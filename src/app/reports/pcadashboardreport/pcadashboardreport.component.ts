import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ReportserviceService } from '../reportservice.service'

import { Router, ActivatedRoute } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { NotificationService } from 'src/app/service/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { map, takeUntil } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';


export interface parnolistss {
  id: any;
  no: string;
}
export interface mepnoLists {
  no: string;
  id: number;
}
export interface DepartmentName {
  id: number;
  desc: string;
  amount: number;
  no: string;
  originalamount: number;
  parno: string;
  mepno: string;
}

@Component({
  selector: 'app-pcadashboardreport',
  templateUrl: './pcadashboardreport.component.html',
  styleUrls: ['./pcadashboardreport.component.scss']
})
export class PcadashboardreportComponent implements OnInit {
  bpaData: any = [];
  bpaData1: any = [];
  totalPRs: number = 0;
  totalBudget: number = 0;
  totalUtilized: number = 0;
  totalRemaining: number = 0;
  reportForm: FormGroup;
  MicroUrl = environment.apiURL;
  withoutSearch: boolean = false;
  parNo: any;
  searchBPA: any;
  @ViewChild('autoDept') matAutocompleteDept: MatAutocomplete;
  @ViewChild('deptInput') deptInput: any;
  has_deptnext = true;
  has_deptprevious = true;
  deptcurrentpage: number = 1;
  deptNameList: any;
  disableBtn: boolean = false;
  payloads: any;
  constructor(private route: ActivatedRoute, private http: HttpClient, private reportService: ReportserviceService, private fb: FormBuilder, private SpinnerService: NgxSpinnerService, private notificationService: NotificationService) { }

  ngOnInit(): void {

    this.searchBPA = this.fb.group({
      bpa_no: this.fb.control('')
    })

    this.reportForm = this.fb.group({
      bpa_no: this.fb.control(''),
      pca_no: this.fb.control('')
    });

    this.route.queryParams.subscribe(params => {
      this.parNo = params['par_no'];
      // if (this.parNo) {
      //   this.withoutSearch = true;
      //   this.searchData({ bpa_no: this.parNo }, 1);
      //   // Load data using par_no
      //   // console.log('Navigated with par_no:', parNo);
      // }
    });
    this.shuffleColors();


    // this.reportService.getReportPO(this.reportForm.value.bpa_no, this.reportForm.value.pca_no
    // ).subscribe(response => {
    //   this.bpaData = response.PCAs;
    //   this.calculateTotals();
    // });

    this.departmentName();
  }
  searchArr: any[] = [
    {
      type: "dropdown",
      inputobj: {
        label: "Choose PCA No",
        method: "get",
        // url: this.MicroUrl + 'prserv/search_parno', // BUG Fix #7358 
        url: this.MicroUrl + 'prserv/reports_search_parno',
        params: "",
        searchkey: "query",
        displaykey: "no",
        Outputkey: "no",
        required: true,
        tooltip: true,
        tooltipkey: 'desc'
        // wholedata: true,
      },
      formvalue: "bpa_no",
    }
    //  {
    //   type: "dropdown",
    //   inputobj: {
    //       label: "Choose PCA No",
    // method: "get",
    //     url: this.MicroUrl + 'prserv/search_pca_no',
    // params: "",
    // Outputkey: "no",
    // searchkey: "query",
    // displaykey: "no",
    // // wholedata: true,
    //   },
    //   formvalue: "pca_no",
    // },

  ];
  hasPOData(): boolean {
    return this.bpaData?.PCAs?.some(pca =>
      pca?.PRs?.some(pr =>
        pr?.POs?.length > 0
      )
    );
  }

  // getPcaClass(pca: any): any {
  //   return {
  //     'blue-border': pca.id.includes('001'),
  //     'green-border': pca.id.includes('002'),
  //     'orange-border': pca.id.includes('003'),
  //   };
  // }
  colorClasses = ['pca-blue', 'pca-green', 'pca-orange', 'pca-purple', 'pca-red'];
  assignedColors: string[] = [];

  // ngOnInit() {
  // }
  calculateUtilizedPercent(pca: any): number {
    const totalUtilized = this.bpaData.par_utilized_amount || 0;
    const totalAmount = this.bpaData.par_amount || 1;
    return Math.round((pca.mep_amount / totalAmount) * 100);
  }
  shuffleColors() {
    const shuffled = [...this.colorClasses].sort(() => Math.random() - 0.5);
    this.assignedColors = this.bpaData?.PCAs?.map((_, i) => shuffled[i % shuffled.length]);
  }

  getPcaClass(index: number): string {
    return this.assignedColors[index];
  }
  getStatusClass(status: string): string {
    if (status.includes('PENDING')) return 'badge-pending';
    if (status.includes('APPROVED')) return 'badge-approved';
    return 'badge-default';
  }

  getAmountClass(amount: number): string {
    if (amount >= 100000) {
      return 'red';
    } else if (amount >= 50000) {
      return 'green';
    } else {
      return 'grey';
    }
  }
  showDashboard: boolean = false;
  pca_count: number = 0;
  searchData(data, type: number) {
    if (!data.bpa_no) {
      this.notificationService.showError("Please Select PCA No!");
      return;
    }
    if (type == 1) {
      this.SpinnerService.show();
      this.reportService.getReportpca(data.bpa_no, type).subscribe(response => {
        this.SpinnerService.hide();
        this.showDashboard = true;

        this.bpaData = response.PCAs[0];
        this.totalUtilized = this.bpaData?.par_utilized_amount || 0;
        this.totalBudget = this.bpaData?.par_amount || 0;
        this.totalRemaining = this.bpaData?.par_balance_amount || 0;
        this.pca_count = this.bpaData?.pca_count || 0;
        this.utilizationPercent = Math.round((this.totalUtilized / this.totalBudget) * 100);
        this.remainingPercent = 100 - this.utilizationPercent;
        // this.totalPRs += this.bpaData?.PCAs[0].pr_count || 0;
        this.totalPRs = this.bpaData?.PCAs.reduce((acc: number, pca: any) => acc + (pca.pr_count || 0), 0);

        this.shuffleColors();

        // reduce((acc: number, pca: any) => acc + (pca.pr_count || 0), 0);

        // this.calculateTotals();
      });
    }

    if (type === 0) {

      this.reportService.pcareportdownload(data.bpa_no, type).subscribe((response) => {
        if (response instanceof Blob && response.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          const blob = new Blob([response], { type: response.type });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Report_${data.bpa_no}.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);
        }
      }, (error: HttpErrorResponse) => {
        this.notificationService.showError("Error downloading report.");
      });
    }
  }
  ClearAll(data) {
    data = {}
    this.reportForm.reset();
    this.showDashboard = false;
    this.bpaData = [];
    this.totalPRs = 0;
    this.totalBudget = 0;
    this.totalUtilized = 0;
    this.totalRemaining = 0;
    this.utilizationPercent = 0;
    this.remainingPercent = 0;
  }
  utilizationPercent: number = 0;
  remainingPercent: number = 0;
  calculateTotals(): void {
    this.totalPRs = 0;
    this.totalBudget = 0;
    this.totalUtilized = 0;
    this.totalRemaining = 0;

    for (let bpa of this.bpaData) {
      this.totalBudget += bpa.total_budget || 0;
      this.totalUtilized += bpa.utilized || 0;
      this.totalRemaining += bpa.remaining || 0;
      this.totalPRs += bpa.PCAs.reduce((acc: number, pca: any) => acc + (pca.pr_count || 0), 0);
    }
  }

  //  getAllPOs() {
  //   if (!this.bpaData || this.bpaData.length === 0) return [];

  //   return this.bpaData.reduce((acc: any[], bpa) => {
  //     const pcaPOs = (bpa.PCAs || []).reduce((pcaAcc: any[], pca: any) => {
  //       const prPOs = (pca.PRs || []).reduce((prAcc: any[], pr: any) => {
  //         const poList = (pr.POs || []).map((po: any) => ({
  //           ...po,
  //           pr_no: pr.pr_no,
  //           status: this.getPOStatus(po)
  //         }));
  //         return prAcc.concat(poList);
  //       }, []);
  //       return pcaAcc.concat(prPOs);
  //     }, []);
  //     return acc.concat(pcaPOs);
  //   }, []);
  // }


  // getPOStatus(po: any): string {
  //   const approved = po.GRNs?.filter((g: any) => g.grn_status === 'APPROVED').length || 0;
  //   const total = po.GRNs?.length || 0;
  //   if (approved === total && total > 0) return 'Paid';
  //   if (approved > 0) return 'Partially Paid';
  //   return 'Pending';
  // }


  parnoList: Array<parnolistss>;
  @ViewChild('parno') matparnoAutocomplete: MatAutocomplete;
  @ViewChild('parnoInput') parnoInput: any;
  displayFnparno(parno?: any) {
    if ((typeof parno) === 'string') {
      return parno;
    }
    return parno ? this.parnoList.find(_ => _.no === parno).no : undefined;
  }
  isLoading = false;

  getparnoFK() {
    let parnokeyvalue = '';
    this.SpinnerService.show();
    this.reportService.getparnoFK(parnokeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        this.parnoList = datas;
        console.log("parnoList", datas)
      })
  }




  currentpagepar: number = 1;
  has_nextpar = true;
  has_previouspar = true;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  //////////////////////////////////////par no scroll
  autocompleteparnoScroll() {
    setTimeout(() => {
      if (
        this.matparnoAutocomplete &&
        this.autocompleteTrigger &&
        this.matparnoAutocomplete.panel
      ) {
        fromEvent(this.matparnoAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matparnoAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matparnoAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matparnoAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matparnoAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextpar === true) {
                this.reportService.getparnoFKdd(this.parnoInput.nativeElement.value, this.currentpagepar + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.parnoList = this.parnoList.concat(datas);
                    if (this.parnoList.length > 0) {
                      this.has_nextpar = datapagination.has_next;
                      this.has_previouspar = datapagination.has_previous;
                      this.currentpagepar = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  MEPList: Array<mepnoLists>;
  @ViewChild('mepname') matmepAutocomplete: MatAutocomplete;
  @ViewChild('mepinput') mepinput: any;
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////mep
  public displayFnMep(MEP?: any) {
    if (typeof (MEP) == "string") {
      return MEP
    }
    return MEP ? this.MEPList.find(_ => _.no == MEP).no : undefined;
  }
  getmepFK() {
    this.SpinnerService.show();
    this.reportService.getmepFK("")
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.MEPList = datas;
        console.log("mepList", datas)
      })
  }

  currentpagemep = 1
  has_nextmep = true;
  has_previousmep = true;
  autocompleteMepScroll() {
    setTimeout(() => {
      if (
        this.matmepAutocomplete &&
        this.autocompleteTrigger &&
        this.matmepAutocomplete.panel
      ) {
        fromEvent(this.matmepAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matmepAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matmepAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matmepAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matmepAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextmep === true) {
                this.reportService.getmepFKdd(this.mepinput.nativeElement.value, this.currentpagemep + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.MEPList = this.MEPList.concat(datas);
                    if (this.MEPList.length >= 0) {
                      this.has_nextmep = datapagination.has_next;
                      this.has_previousmep = datapagination.has_previous;
                      this.currentpagemep = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  autocompleteMepScrolls() {
    setTimeout(() => {
      if (
        this.matAutocompleteDept &&
        this.autocompleteTrigger &&
        this.matAutocompleteDept.panel
      ) {
        fromEvent(this.matAutocompleteDept.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matAutocompleteDept.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matAutocompleteDept.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteDept.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteDept.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_deptnext === true) {
                this.reportService.pcafilterapi(this.deptInput.nativeElement.value, this.deptcurrentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];

                    this.deptNameList = this.deptNameList.concat(datas);
                    if (this.deptNameList.length >= 0) {
                      this.has_deptnext = datapagination.has_next;
                      this.has_deptprevious = datapagination.has_previous;
                      this.deptcurrentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  public displayFnDeptName(autoDept?: DepartmentName): string | undefined {
    return autoDept ? autoDept.mepno : undefined;
  }

  get autoDept() {
    return this.searchBPA.get('bpa_no');
  }
  departmentName() {
    this.reportService.pcafilterapi('', 1)
      .subscribe((results) => {
        let datas = results["data"];
        this.deptNameList = datas;
        let datapagination = results["pagination"];
        this.has_deptnext = datapagination.has_next;
        this.has_deptprevious = datapagination.has_previous;
        this.deptcurrentpage = datapagination.index;

      })
  }
  inputdepartmentName() {
    this.reportService.pcafilterapi(this.deptInput.nativeElement.value, 1)
      .subscribe((results) => {
        let datas = results["data"];
        this.deptNameList = datas;
        let datapagination = results["pagination"];
        this.has_deptnext = datapagination.has_next;
        this.has_deptprevious = datapagination.has_previous;
        this.deptcurrentpage = datapagination.index;

      })
  }

  resetBPA() {
    this.searchData('', 1);
  }

  searchDatas(type: number) {
    let bpaNo = this.searchBPA.get('bpa_no').value

    if (!bpaNo?.no) {
      this.notificationService.showError("Please Select PCA No!");
      return;
    }
    if (type == 1) {
      this.SpinnerService.show();
      this.reportService.getReportpca(bpaNo?.no, type).subscribe(response => {
        this.SpinnerService.hide();



        this.showDashboard = true;
        this.bpaData1 = response
        this.bpaData = response.PCAs[0];
        this.totalUtilized = this.bpaData?.mep_utilized_amount || 0;
        this.totalBudget = this.bpaData?.mep_amount || 0;
        this.totalRemaining = this.bpaData?.mep_balance_amount || 0;
        this.pca_count = this.bpaData?.pca_count || 0;
        this.utilizationPercent = Math.round((this.totalUtilized / this.totalBudget) * 100);
        this.remainingPercent = 100 - this.utilizationPercent;
        // this.totalPRs += this.bpaData?.PCAs[0].pr_count || 0;
        this.totalPRs = this.bpaData1?.PCAs?.reduce((acc: number, pca: any) => acc + (pca.pr_count || 0), 0);

        this.shuffleColors();

        // reduce((acc: number, pca: any) => acc + (pca.pr_count || 0), 0);

        // this.calculateTotals();
      });
    }

    if (type === 0) {

      if (this.searchBPA.get('bpa_no').value?.no == 'All') {
        this.payloads = {}
      }
      else {
        this.payloads = bpaNo?.no
      }

      this.reportService.pcareportdownload(this.payloads, type).subscribe((response) => {
        if (response instanceof Blob && response.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          const blob = new Blob([response], { type: response.type });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          let date = new Date()
          a.download = "PCA_report_" + date + ".xlsx";
          a.click();
          window.URL.revokeObjectURL(url);
        }
      }, (error: HttpErrorResponse) => {
        this.notificationService.showError("Error downloading report.");
      });
    }
  }
  onDeptSelected(data) {
    console.log("Selected Data", data)
    let selectVal = data?.option?.value?.no
    if (selectVal == 'All') {
      this.showDashboard=false
      this.disableBtn = true;
    }
    else {
      this.disableBtn = false;
    }

  }

  resetsearch() {
    this.searchBPA.reset();
    this.showDashboard = false
  }

}

