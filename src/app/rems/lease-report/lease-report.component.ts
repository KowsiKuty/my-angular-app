import { Component, OnInit, ViewChild } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Rems2Service } from '../rems2.service'
import { takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { environment } from 'src/environments/environment'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe, DecimalPipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../notification.service';

const isSkipLocationChange = environment.isSkipLocationChange

class leaseSearchtype {
  type: string;
  branchcode: any;
  premise_name: string;
  premise_type: any;
  lease_status: string;

  controlling_office: string;
  occupancy_name: string;
  occupancy_type: any;
  terminal_id: string;

  landlord_name: string;
  landlord_status: any;
  landlord_type: any;
  vacation_date: string;

  start_date: string;
  end_date: string;
  relaxation_start_date: string;
  relaxation_end_date: string;
  schedule_status: string;
}

export interface branchLists {
  id: number;
  name: string;
  code: string;
}
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-lease-report',
  templateUrl: './lease-report.component.html',
  styleUrls: ['./lease-report.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe, DecimalPipe
  ]
})
export class LeaseReportComponent implements OnInit {

  @ViewChild('branchType') matBrAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('brInput') brInput: any;

  LeaseSearchForm: FormGroup;
  LeaseList: any;
  search: any={"type":"Lease_Expire_Report"}

  BranchCode: any;
  occupancyList: any
  premisedropList: any
  premisesTypeData: any;
  landlordTypeData: any;
  usageType: any;
 
  presentpage: number = 1;
  pagesize = 10;
 
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  isLeaseList : boolean
  isLoading = false;
  today = new Date();
  fileid : any;
  file_name : any;
  downloadDisable = true;
 
  constructor(private remsService: RemsService, private fb: FormBuilder, private datepipe:DatePipe,
    private router: Router, private remsService2: Rems2Service, private spinner:NgxSpinnerService,
    private remsshareService: RemsShareService, private notification: NotificationService) 
    { this.today.setDate(this.today.getDate());}

 
  ngOnInit(): void {
    
    this.search={"type": "Lease_Expire_Report"}
    this.getLease();
    this.premisedrop();
    this.LeaseSearchForm = this.fb.group({
      branchcode: "",
      premise_name: "",
      premise_type: "",
      lease_status: "",

      controlling_office: "",
      occupancy_name: "",
      occupancy_type: "",
      terminal_id: "",

      landlord_name: "",
      landlord_status: "",
      landlord_type: "",
      vacation_date: "",

      lease_start_date: "",
      lease_end_date: "",
      relaxation_start_date: "",
      relaxation_end_date: "",
      schedule_status: "",
    })

    this.getUsageCodee("");

    this.LeaseSearchForm.get('branchcode').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.remsService.getUsageCode(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.BranchCode = datas;

    })

    this.premisesType();
    this.getUsage();
    this.landlordType();   
  }

  premisesType() {
    this.remsService2.premisesType()
      .subscribe((results) => {
        this.premisesTypeData = results.data;
      })
  }

  landlordType() {
    this.remsService.getLandlordType()
      .subscribe((results) => {
        this.landlordTypeData = results.data;
      })
  }
  getUsage() {
    this.remsService.getUsage()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.usageType = datas;
      })

  }

  createFormate() {
    let data = this.LeaseSearchForm.controls;
    let search = new leaseSearchtype();
    search.type = "Lease_Expire_Report"
    search.branchcode =data['branchcode'].value;
    search.premise_name = data['premise_name'].value;
    search.premise_type = data['premise_type'].value;
    search.lease_status =data['lease_status'].value;

    search.controlling_office = data['controlling_office'].value;
    search.occupancy_name = data['occupancy_name'].value;
    search.occupancy_type = data['occupancy_type'].value;
    search.terminal_id = data['terminal_id'].value;

    search.landlord_name = data['landlord_name'].value;
    search.landlord_status = data['landlord_status'].value;   
    search.landlord_type = data['landlord_type'].value;
    search.vacation_date = data['vacation_date'].value;

    search.start_date = this.datepipe.transform(data['lease_start_date'].value,"yyyy-MM-dd");
    search.end_date = this.datepipe.transform(data['lease_end_date'].value,"yyyy-MM-dd");
    search.relaxation_start_date = this.datepipe.transform(data['relaxation_start_date'].value,"yyyy-MM-dd");
    search.relaxation_end_date = this.datepipe.transform(data['relaxation_end_date'].value,"yyyy-MM-dd");
    search.schedule_status = data['schedule_status'].value;

    return search;
  }

  LeaseSearch() {
    this.search = this.createFormate();
    for (let i in this.search) {
      if (!this.search[i]) {
        delete this.search[i];
      }
    }
    this.getLease();
  }

  nextClick() {
    if (this.has_next === true) {
      this.getLease(this.presentpage + 1 )
    }
  }

  previousClick() {
    if (this.has_previous === true) {
      this.getLease(this.presentpage - 1)
    }
  }

  reset() {
    this.search = {"type":"Lease_Expire_Report"};
    this.getLease();
    this.LeaseSearchForm.reset();
  }
  abc: number = 1
  onpremiseChange(e: number = 1) {
    this.abc = e
    this.getLease()


  }
  private premisedrop() {
    this.remsService.premisedrop()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.premisedropList = datas;
      })
  }

  getLease(pageNumber = 1) {
    this.spinner.show();
    this.remsService.getRemsReport(pageNumber, this.search)
      .subscribe((results: any[]) => {
        let datas = results["Data"];
        let datapagination = results["Pagination"];
        this.LeaseList = datas;
        if (this.LeaseList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
          this.isLeaseList = true;
          this.remsService.remsReportFileget(this.search)
          .subscribe((result: any[]) => {
            this.fileid = result["id"];
            this.file_name = result["file_name"];
            this.downloadDisable = false;      
            this.spinner.hide();
          })
        } else if (this.LeaseList.length == 0) {
          this.isLeaseList = false;
          this.fileid = undefined;
          this.file_name = undefined;
          this.downloadDisable = true;    
          this.spinner.hide();
        }
      })
  }


  public displayFnBr(branchType?: branchLists): string | undefined {
    return branchType ? branchType.name : undefined;
  }

  get branchType() {
    return this.LeaseSearchForm.value.get('branchcode');
  }
  
  private getUsageCodee(rmkeyvalue) {
    this.remsService.getusageSearchFilter(rmkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.BranchCode = datas;
      })
  }

  autocompleteBranchScroll() {
    setTimeout(() => {
      if (
        this.matBrAutocomplete &&
        this.autocompleteTrigger &&
        this.matBrAutocomplete.panel
      ) {
        fromEvent(this.matBrAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matBrAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matBrAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matBrAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matBrAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.remsService.getUsageCode(this.brInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.BranchCode = this.BranchCode.concat(datas);
                    if (this.BranchCode.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  backToRemsSummary() {
    this.router.navigate(['/rems/rems/remsSummary'], { skipLocationChange: isSkipLocationChange });
  }

  fileDownload() {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let url = environment.apiURL + "pdserv/rems_report?token=" + token;
    let anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.click();
  }

}

