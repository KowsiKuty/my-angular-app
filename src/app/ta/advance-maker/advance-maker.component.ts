import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef,HostListener } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../notification.service'
import { TaService } from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import { ActivatedRoute, Router } from "@angular/router";
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ShareService } from 'src/app/ta/share.service';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';

import { NgxSpinnerService } from "ngx-spinner";

import { environment } from 'src/environments/environment';
// import { element } from 'protractor';

export interface controllingOffice {
  id: string;
  name: string;
  code: string;
}
export let PICK_FORMATS = {
  
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
  selector: 'app-advance-maker',
  templateUrl: './advance-maker.component.html',
  styleUrls: ['./advance-maker.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class AdvanceMakerComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.SpinnerService.hide();
    }
  }
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() lineChanges = new EventEmitter<any>();
  @ViewChild('closebutton') closebutton;
  @ViewChild('assetid') matassetidauto: MatAutocomplete;
  @ViewChild('bssid') matbssidauto: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger
  @ViewChild('inputassetid') inputasset: any;
  @ViewChild('selfpopup', { static: true }) selfpopup: ElementRef;
  @ViewChild('ccid') cccid: any;
  @ViewChild('bsid') bsssid: any;
  radiocheck: any[] = [
    { value: 1, display: 'Self' },
    { value: 0, display: 'Onbehalf' }
  ]
  currentDate: any = new Date();
  // date = new Date().toLocaleDateString();
  defaultDate = new FormControl(new Date());
  today = new Date();
  date = new Date();
  latest: any
  currentpage: number = 1;
  pagesize = 10;
  overall: any
  isDisabled: boolean;
  days: any
  tourmodel: any
  values = [];
  tourdata = [];
  stratdate: Date;
  enddate: Date;
  endatetemp: Date
  startdatetemp: Date
  showdisabled = true;
  starttdate: any
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  showradiobtn = false;
  uploadedFilePath: string = null;
  totall: number;
  select: any;
  selectto: any;
  showccbs: boolean;
  request: any
  isSumbitbtn: boolean
  isAdvancebtn: boolean
  total: any;
  submitbtn: boolean = true
  a: any
  tokenValues: any;
  jpgUrls: any;
  attachmentlist = []
  data: any
  reasonlist: Array<any>
  showme: boolean = false;
  tourr: any
  isnew: boolean
  istaapprove: any
  approve: boolean = false
  tourmodell: any
  touremodel: any
  employeelist: Array<any>
  listBranch: Array<any>
  branchlist: Array<any>
  bisinesslist: Array<any>
  costlist: Array<any>
  dataa: any
  datas: any
  advancelist: any
  re: any
  strat: any
  end: any
  has_next = true;
  has_previous = true;
  file_downloaded: boolean = false;
  linesChange: any
  subTotal: any
  closeResult: string;
  filesystem_error: boolean;
  isLoading = false;
  @ViewChild('approveremp') matappAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('employeeApproverInput') employeeApproverInput: any;
  @ViewChild('empid') empauto: MatAutocomplete;
  @ViewChild('empinput') empinput: any;
  has_empnext:boolean=true;
  has_empprevious:boolean=false;
  empcurrentpage:number=1
  approvedby: any;
  totalccbs: any;
  ccbstotal: any;
  ccbsamt: any;
  amtsum: any;
  ccbsper: any;
  persum: any;
  bs: any;
  tour: any[];
  advanceform: FormGroup
  has_nextid: boolean = true;
  advancediv: boolean
  advancecanceldiv: boolean
  has_presentid: number = 1;
  has_nextbsid: boolean = true;
  has_presentbsid: number = 1;
  branchid: any;
  subject: any;
  approvelevel: boolean = false;
  fileid: any;
  currentind: any;
  sp_percentage: any;
  remarks: any;
  tourid: any;
  reqno:any;
  reqnodata:any;
  getAdvanceapproveList: any;
  alreadymaked: any;
  ccbsresult: any;
  backrequest: boolean;
  colorapply: boolean;
  requestno: any = null;
  has_offnext = true;
  has_offprevious = true;
  offcurrentpage: number = 1;
  reason: any;
  startdate: any;
  enddatee: any;
  requestdate: any;
  employee_code: any;
  imageUrl = environment.apiURL;
  empgrade: any;
  empdesignation: any;
  employee_name: any;
  applevel: number;
  approver: boolean = false;
  data_final: any;
  advanceid: any;
  amtenable: boolean = false;
  updatingamt: number;
  advanceamtid: any;
  approvesum: number = 0;
  showapproveddiv: boolean;
  showrejectdiv: boolean;
  showreturndiv: boolean;
  show_approvediv: boolean = false;
  show_rejectdiv: boolean = false;
  show_returndiv: boolean = false;
  resoncomment: any;
  ccbsdeletearray: Array<any> = [];
  appflow: boolean = true;
  ischanged: boolean = false;
  pageSize = 10;
  p = 1;
  s = 1;
  apichanges: boolean = true;
  lastcomment: any = null;
  mainccbs: any;
  onbehalfname: any;
  onbehalfid: any;
  onbehalfenable: boolean = false;
  success: boolean = true;
  ishidden: boolean = false
  advancecancel: any
  approval: any;
  cmt: any;
  taonbehalfForm: FormGroup
  show_cancelbtn: boolean = false
  tourcanid: any;
  remarksbtn: boolean = true
  token: any;
  requestamt: number = 0;
  app: any;
  addbtn: boolean = true;
  branchList: any;
  empList: any;
  showselfonbehalf: boolean = false;
  ccbsdata: any;
  btnelement: HTMLElement;
  status_id:any;
  disableList = ["APPROVED", "REJECTED"]



  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private datePipe: DatePipe, private http: HttpClient,
    private notification: NotificationService, private taservice: TaService,
    public sharedService: SharedService, private route: Router, private activatedroute: ActivatedRoute, private SpinnerService: NgxSpinnerService,
    private shareservice: ShareService) { }

  branchdata: Array<controllingOffice>;


  @ViewChild('conoffice') matofficeAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;

  ngOnInit(): void {
    this.getbranchValue();
    this.taonbehalfForm = this.formBuilder.group({

      branch: ['', Validators.required],
      employee: ['', Validators.required],
      status: [''],

    })
    this.getbranches();
    this.btnelement = this.selfpopup.nativeElement;
    this.btnelement.style.visibility = 'hidden';

    let officekeyvalue: String = "";
    this.getConOffice(officekeyvalue);
    this.taonbehalfForm.get('employee').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.taservice.getonbehalfemployee(value, this.branchid,1))
      )
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.empList = datas;
        console.log("Employee List", this.empList)
      });
    this.taonbehalfForm.get('branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.taservice.getUsageCode(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchdata = datas;
      })
    let advance_summary = JSON.parse(localStorage.getItem('advancemakersummary'))
    this.employee_name = advance_summary.employee_name
    this.employee_code = advance_summary.employee_code
    this.tourid = advance_summary.tourgid
    this.empgrade = advance_summary.empgrade
    this.empdesignation = advance_summary.empdesignation
    this.reason = advance_summary.reason
    this.startdate = this.datePipe.transform(advance_summary.startdate, 'yyyy-MM-dd');
    this.requestdate = this.datePipe.transform(advance_summary.requestdate, 'yyyy-MM-dd');
    this.enddatee = this.datePipe.transform(advance_summary.enddate, 'yyyy-MM-dd');

    let onbehalf = JSON.parse(localStorage.getItem('onbehalf'))
    if (advance_summary.onbehalfof) {
      this.onbehalfenable = true;
      this.onbehalfname = onbehalf.onbename;
      this.onbehalfid = onbehalf.onbeid
      this.app = onbehalf.app
    }
    if (advance_summary['apptype'] == "AdvanceCancel") {
      this.show_cancelbtn = true
      this.dataa = advance_summary.tourid
      this.reqnodata = advance_summary.reqno
      this.tourcanid = advance_summary.id
      this.ishidden = false;
      this.onbehalfenable = false
      this.appflow = true
      this.submitbtn = false
      this.remarksbtn = false
    }

    // if(advance_summary['tour_approvedby']){
    //   this.dataa= advance_summary.tourid
    //   this.ishidden = true;
    //   this.submitbtn=false;
    //   this.getadvancecancel();
    // }
    if (advance_summary.advance_cancel_status == "PENDING") {
      this.ishidden = true
    }
    else if (advance_summary.advance_cancel_status == "APPROVED") {
      this.ishidden = false

    }

    if (advance_summary.advance_status == "PENDING") {
      this.dataa = advance_summary.tourgid;
      this.reqnodata = advance_summary.requestno;
    }
    else {
      this.dataa = advance_summary.tourgid;
      this.reqnodata = advance_summary.requestno;
      this.isAdvancebtn = true;
    }
    if (advance_summary.applevel == undefined) {
      console.log("this is maker")
    }
    else {
      console.log("this is approver")
      this.dataa = advance_summary.tourid;
      this.reqnodata = advance_summary.requestno;
      this.onbehalfenable = false;
      var approval = true;
      this.tourid = this.dataa;
      this.reqno=this.reqnodata;
      this.applevel = 1;
      this.show_approvediv = true;
      this.apichanges = false;
      // this.getimages();
    }
    // this.taservice.getfetchimages(this.dataa)
    //   .subscribe((results) => {
    //     // this.resultimage = results[0].url
    //     this.attachmentlist = results
    //     this.count = this.attachmentlist.length
    //     // let stringValue = results[0].file_name.split('.')
    //     // this.fileextension = stringValue.pop();
    //     // console.log("file", this.fileextension)

    //   })
    if (advance_summary.apptype == 'AdvanceCancel') {
      this.show_approvediv = false;
    }
    if(advance_summary.tour_status == 'APPROVED'){
      this.show_approvediv=true;
    }
    if (this.applevel == 1) {
      this.getapprovelflowall();
    }
    else {
      this.getadvanceapprovesumm();
    }
    console.log("summary", advance_summary)
    this.getccbssum();
    let data1 = this.shareservice.approveview.value
    this.datas = data1['status']
    console.log("status", this.datas)
    console.log("data1", data1)
    // if(advance_summary['advance_cancel_status']){
    //   this.dataa= advance_summary.id
    //   this.getadvancecancel();
    //   this.iscancel=false
    // }
    // if (data['id'] != 0){

    if (advance_summary['type'] == "AdvanceCancel") {
      this.addbtn = false
      this.dataa = advance_summary.id
      this.ishidden = true;
      this.submitbtn = false
      if (advance_summary['advance_cancel_status']) {
        this.appflow = true

      }
      else {
        this.appflow = false
      }

      this.getadvancecancel();


    }
    if (advance_summary['advance_cancel_status'] == "APPROVED") {
      this.ishidden = false;
      this.approve = true;
    }
    else {
      this.ishidden = true;

    }

    this.advancesummary(advance_summary);

    // this.isnew = false;
    // }
    // else{

    // this.advanceform = new FormGroup({
    //   requestno: new FormControl(''),
    //   requestdate: new FormControl(''),
    //   reason: new FormControl(''),
    //   startdate: new FormControl(''),
    //   enddate: new FormControl(''),
    //   advreason: new FormControl(''),
    //   advamount: new FormControl(''),
    //   advstatus: new FormControl(''),
    //   advpdf: new FormControl(''),
    //   bsid: new FormControl(''),
    //   ccid: new FormControl(''),
    //   ccbsamount: new FormControl(''),
    //   ccbspercent: new FormControl(''),
    //   remarks: new FormControl('')

    // })

    // this.isnew = false;
    // }
    // else{


    // }
    this.getccbssum();

    this.getbusinesssegmentValue();



    this.advanceform = this.formBuilder.group({
      advance: new FormArray([
        this.createItem()

      ]
      ),
      ccbss: new FormArray([
      ]),
      approval: new FormControl(''),
      empbranchid: new FormControl(''),
      remarks: new FormControl(''),
      ccbs: new FormArray([])
      // data: new FormArray([]),
    });
    if (this.apichanges) {
      this.advanceform.get('empbranchid').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.taservice.getUsageCode(value ? value : '', 1))
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.branchlist = datas;
          console.log("Branch List", this.branchlist)
        });

      this.advanceform.get('approval').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.taservice.setemployeeValue(value ? value : '', this.branchid, this.onbehalfid,1))
        )
        .subscribe((results: any[]) => {
          let datas = results;
          this.employeelist = datas['data'];
          console.log("Employee List", this.employeelist);
        });

    }

    if (approval) {
      this.advanceform.disable();
      this.approver = true;
      this.advanceform.controls['advance'].enable();
      this.advanceid = advance_summary.id;
    }
    else {
      this.getbranchValue();
      this.getemployeeValue();
    }
    this.getimages();
  }
  branchclick(id) {
    this.branchid = id
    console.log("this.branchid", this.branchid)
    this.taservice.getonbehalfemployee("", this.branchid,1)
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.empList = datas;
        console.log("Employee List", this.empList)
      });
  }
  advanceForm() {
    if (this.value === 0) {
      this.route.navigateByUrl('ta/advancemaker-summary');
      this.shareservice.fetchData.next(this.result);
      this.closebutton.nativeElement.click();
      this.taonbehalfForm.reset();
    }
  }
  // numberOnly(event) {
  //   return (event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46)
  // }

  advancesummary(advance_summary) {
    this.SpinnerService.show()
    this.taservice.getadvanceEditsummary(this.dataa)
      .subscribe((result?) => {
        this.SpinnerService.hide();
        if (result.code == 'UNEXPECTED_ERROR') {
          this.notification.showError(result.description)
          return false;
        }

        this.requestno = this.dataa
        this.reason = result['reason']
        this.startdate = this.datePipe.transform(result['startdate'], 'yyyy-MM-dd');

        this.enddatee = this.datePipe.transform(result['enddate'], 'yyyy-MM-dd');
        this.alreadymaked = result['detail'];
        if (result['detail'].length > 0) {
          this.backrequest = true;
          if (this.applevel == 1) {
            this.backrequest = false;
          }
        }
        if (this.alreadymaked.length != 0) {

          for (var i = 0; i < this.alreadymaked.length; i++) {

            if (i > 0) {
              let data = this.advanceform.get('advance') as FormArray;
              data.push(this.createItem())
            }
            let myform = (this.advanceform.get('advance') as FormArray).at(i)
            if (this.alreadymaked[i].status_name == 'APPROVED') {
              myform.patchValue({ appamount: this.alreadymaked[i].appamount })
            }
            else if (this.alreadymaked[i].status_name == 'PENDING' && advance_summary.advance_status == 'RETURNED') {
              this.advanceamtid = this.alreadymaked[i].id
              myform.patchValue({ appamount: this.alreadymaked[i].appamount })
            }
            else if (this.alreadymaked[i].status_name == 'PENDING') {
              if (this.applevel == 1) {
                this.advanceamtid = this.alreadymaked[i].id
                myform.patchValue({ appamount: this.alreadymaked[i].appamount })
              }
              else {
                myform.patchValue({ appamount: null })
              }
            }
            myform.patchValue({
              "id": this.alreadymaked[i].id,
              "reqamount": this.alreadymaked[i].reqamount,
              "reason": this.alreadymaked[i].reason,
              "approval": this.alreadymaked[i].approver_id,
              "statuss": this.alreadymaked[i].status_name,
              "crnno": this.alreadymaked[i].crnno,
              "invoiceheadergid": this.alreadymaked[i].invoiceheadergid
            });
            this.advanceform.patchValue({ remarks: this.remarks })
          }
          let sumarray = this.advanceform.value.advance
          sumarray.forEach(element => {
            if (element.appamount == null) {
              this.approvesum = Number(this.approvesum) + 0;
            }
            else {
              this.approvesum = this.approvesum + parseFloat(element.appamount)
            }
          });

          for (var i = 0; i < this.ccbsresult.length; i++) {
            let data = this.advanceform.get('ccbss') as FormArray;
            data.push(this.createccbs())
            let datas = this.advanceform.get('ccbs') as FormArray;
            datas.push(this.createccbs())
            let myform = (this.advanceform.get('ccbss') as FormArray).at(i)
            myform.patchValue({
              "id": this.ccbsresult[i].id,
              "bsid": this.ccbsresult[i].bs_data,
              "ccid": this.ccbsresult[i].cc_data,
              "percentage": this.ccbsresult[i].percentage,
              "amount": this.ccbsresult[i].amount,
              "ccbs_edit_status": this.ccbsresult[i].ccbs_edit_status
            });
          }
          let approverdata = result['approver_branch_data']
          if (approverdata == undefined) {
            this.appflow = false;
            this.ishidden = false
          }
          var branchdetail = {
            code: approverdata.branch_code,
            name: approverdata.branch_name,
            id: approverdata.branch_id
          }
          // '(' + approverdata.branch_code + ')' + approverdata.branch_name
          this.advanceform.patchValue({ empbranchid: branchdetail })
          if (this.applevel != 1) {
            this.selectBranch(approverdata.branch_id)
          }
          this.advanceform.patchValue({ approval: approverdata })

          let amountlist = (this.advanceform.get('advance') as FormArray).value
          let amount: number = 0;
          amountlist.forEach(element => {
            amount = amount + Number(element.reqamount ? element.reqamount : 0);
          });

          this.sum = amount
          var length = (this.advanceform.get('advance') as FormArray).length
          var appamount = Number((this.advanceform.get('advance') as FormArray).at(length - 1).value.appamount)
          this.requestamt = appamount;
          this.updatingamt = appamount;
          //  for (let stat in advstatus){
          //    if(stat =='APPROVED' || stat =='RETURNED'){
          //     this.amt = Number((this.advanceform.get('advance') as FormArray).at(length-1).value.appamount)
          //    }
          //    else{
          //      this.amt = 0;
          //    }
          //  }

        }

        else {
          this.amt == 0;
          this.appflow = false;
          this.ishidden = false;
          let data = this.advanceform.get('ccbss') as FormArray;
          data.push(this.createccbs());
        }

        console.log("advance summary", result)
      })
  }
  dataadvance(n, event) {

    this.value = n.value
    this.shareservice.radiovalue.next(this.value)
    if (n.value === 1) {
      this.showradiobtn = false;
      this.showdisabled = true;
      this.closebutton.nativeElement.click();
      this.route.navigateByUrl('ta/advancemaker-summary')
    }
    else {
      this.showradiobtn = true;
      this.showdisabled = false;
    }
  }
  name: any;
  id: any;
  result: any
  clickemp(id, name, emp) {
    this.name = name;
    this.id = id;
    this.result = emp;

    let employeejson: any = []
    employeejson = {
      "id": this.id,
      "name": this.name
    }
    console.log("employeejson", employeejson)
  }
  displayFn1(subject) {
    // return subject? '('+subject.onbehalf_employee_code+') '+subject.onbehalf_employee_name:undefined
    return subject ? "(" + subject.employee_code + ") " + subject.employee_name : undefined
  }
  displaybrnch(subject) {
    // return subject? '('+subject.onbehalf_employee_code+') '+subject.onbehalf_employee_name:undefined
    return subject ? "(" + subject.code + ") " + subject.name : undefined
  }
  getbranches() {
    this.taservice.getbranchSummary()
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.branchList = datas;


      })
  }
  public displayfnbranch(conoffice?: controllingOffice): string | undefined {
    return conoffice ? "(" + conoffice.code + ") " + conoffice.name : undefined;
  }

  get conoffice() {
    return this.taonbehalfForm.value.get('branch');
  }

  private getConOffice(officekeyvalue) {
    this.taservice.getusageSearchFilter(officekeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchdata = datas;

      })
  }
  branchScroll() {
    setTimeout(() => {
      if (
        this.matofficeAutocomplete &&
        this.autocompleteTrigger &&
        this.matofficeAutocomplete.panel
      ) {
        fromEvent(this.matofficeAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matofficeAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            let scrollTop = this.matofficeAutocomplete.panel.nativeElement.scrollTop;
            let scrollHeight = this.matofficeAutocomplete.panel.nativeElement.scrollHeight;
            let elementHeight = this.matofficeAutocomplete.panel.nativeElement.clientHeight;
            let atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_offnext === true) {
                this.taservice.getUsageCode(this.branchInput.nativeElement.value, this.offcurrentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchdata = this.branchdata.concat(datas);
                    // if (this.branchdata.length >= 0) {
                    //   this.has_offnext = datapagination.has_next;
                    //   this.has_offprevious = datapagination.has_previous;
                    //   this.offcurrentpage = datapagination.index;
                    // }
                  })
              }
            }
          });
      }
    });
  }
  cancelback() {
    this.route.navigateByUrl('ta/ta_summary');

  }
  getccbssum() {
    this.taservice.getadvanceccbsEditview(this.dataa)
      .subscribe(result => {
        this.ccbsresult = result;

        // if (this.ccbsresult.length == 0) {
        //   this.notification.showError("Invalid as error occurred");
        //   return false;
        // }
        console.log("CCBS DATA", result)
        var amount = 0;
        // result?.forEach(element => {
        //   if (element.ccbs_edit_status == 1) {
        //     amount = amount + Number(element.amount ? element.amount : 0)
        //   }
        // });
        for (let key in result) {
          if (result.hasOwnProperty(key) && result[key].ccbs_edit_status == 1) {
            amount += Number(result[key].amount ? result[key].amount : 0);
          }
        }
        
        this.amt = amount
      })
  }
  remarksupdate(value) {
    this.remarks = value.target.value;
  }

  index: any

  datafinal: any
  res: any
  advancee: any

  number(event): boolean {
    let charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    else {
      if (event.target.value == '0') {
        return false;
      }
      else {
        return true;
      }
    }
  }
  number2(event): boolean {
    let charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    else {
      if (event.target.value == '0') {
        return false;
      }
      else {
        return true;
      }
    }
  }

  checkind(ind) {
    let d:any='';

    if(this.advanceform.get("ccbss").value [ind]['bsid'] == null || this.advanceform.get("ccbss").value [ind]['bsid']=='' || this.advanceform.get("ccbss").value [ind]['bsid']==undefined){
      d='';
    }
    else{
      d=this.advanceform.get("ccbss").value [ind]['bsid'];
    }
    this.taservice.getbusinesssegmentValue(d,1).subscribe(data=>{
      this.bisinesslist=data['data'];
    });
    (<FormArray>this.advanceform.get("ccbss")).at(ind).get('bsid').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.taservice.getbusinesssegmentValue(value, 1))
      )
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.bisinesslist = datas;
        console.log("Employee List", this.employeelist)
      });
    return true
  }
  
  checkccind(ind) {
    let d:any='';
    let cc:any='';
    // let bs=this.advanceform.get("ccbss").value [ind]['bsid'].id 

    if(this.advanceform.get("ccbss").value [ind]['bsid'].id == null || this.advanceform.get("ccbss").value [ind]['bsid'].id=='' || this.advanceform.get("ccbss").value [ind]['bsid'].id==undefined){
      
      this.notification.showError('Please select The BS Name');
      return false;
    }
    else{
      d=this.advanceform.get("ccbss").value [ind]['bsid'].id;    
    }
   
    
    // (<FormArray>this.advanceform.get("ccbss")).at(ind).get('bsid').valueChanges.
    // pipe(
    //   tap(()=>{
    //     this.isLoading=true;
    //   },
    //   switchMap((value:any)=>this.taservice.getcostcenterValue(value,this.advanceform.get("ccbss").value [ind]['bsid'].id).pipe(
    //     finalize(()=>{
    //       this.isLoading=false;
    //     })
    //   ))
    //   )
    // ).subscribe(data=>{
    //   this.costlist=data['data'];
    // });
    (<FormArray>this.advanceform.get("ccbss")).at(ind).get('ccid').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
      }),
      switchMap(value => this.taservice.getcostcenterValue(value, this.advanceform.get("ccbss").value [ind]['bsid'].id).pipe(
            finalize(()=>{
          this.isLoading=false;
        })
      ))
      ).subscribe((results: any[]) => {
      let datas = results['data'];
      console.log('123');
      this.costlist = datas;
      console.log(this.costlist);
    });
    return true
  }

  displayFn(subject) {
    return subject ? "(" + subject.code + ")" + subject.full_name : undefined;
  }
  csview(subject) {
    return subject ? subject.name : undefined;
  }
  bsview(subject) {
    return subject ? subject.name : undefined;
  }
  empidupdate(id) {
    this.approval = id
  }
  reson(event) {
    this.resoncomment = event.target.value;

  }
  comment(e) {
    this.cmt = e.target.value
  }
  checkdisable(status) {
    if (status.value.statuss == 'APPROVED' || status.value.statuss == 'REJECTED') {
      this.colorapply = true;
      return true;
    }
    else {
      return false;
    }
  }
  checkremove(status) {
    if (status.value.statuss != null) {
      return true;
    }
  }

  pdfcheck(dtl) {

    if (dtl.value.statuss == 'APPROVED') {
      return true;
    }
    else {
      return false;
    }
  }
  ccbsreadonly(status) {
    if (status.value.ccbs_edit_status == 0 || this.applevel == 1) {
      return true;
    }
    else {
      return false;
    }
  }
  advpdfdownload(invoice) {
    var invoiceid = invoice.value.invoiceheadergid
    this.taservice.getadvpdf(invoiceid).subscribe(results => {
      let fileurl = window.URL.createObjectURL(new Blob([results]))
      let link = document.createElement('a')
      link.href = fileurl
      link.download = `${invoice.value.crnno}.pdf`;
      link.click();
    })
  }
  createItem() {

    let group = this.formBuilder.group({
      id: 0,
      remarks: new FormControl(''),
      reason: null,
      reqamount: null,
      appamount: null,
      tourgid: this.dataa,
      invoiceheadergid: null,
      approval: null,
      statuss: null,
      crnno: null,
      pdf: null,
      onbehalfof: this.onbehalfid
    });
    return group;
  }

  createccbs() {
    let group = this.formBuilder.group({
      id: 0,
      bsid: null,
      ccid: null,
      amount: null,
      tourgid: this.dataa,
      percentage: null,
      ccbs_edit_status: null
    });
    return group;
  }
  addSection() {
    let data = this.advanceform.get('advance') as FormArray;
    data.push(this.createItem())
    // this.showme=true;
    // this.tourmodel.detail=(this.advance[1])
    // this.isDisabled=true;
    // this.tourmodel.advance=this.tourmodel.detail;
    // let detail=this.tourmodel.detail;
    // console.log("kk",detail)
    // let advance=this.tourmodel;
    // this.tourmodell=advance['bank']
    // console.log("vvvv", this.tourmodell)
    this.isAdvancebtn = true;


  }
  valuecheck() {
    if (this.amt == null || this.amt == 0) {
      return false;
    }
  }
  addccbs() {

    var advlength = this.advanceform.value.advance.length
    var adv = (this.advanceform.get('advance') as FormArray).at(advlength - 1).value.statuss;

    if ((adv != null && adv != 'PENDING') && (adv!=null &&adv !='RETURNED')) {
      return false
    }
    if (this.amt == null || this.amt == 0) {
      this.notification.showError("Please Enter Valid Advance Amount...")
      return false
    }

    var sum_percent: number = 0;
    let percentlist = (this.advanceform.get('ccbss') as FormArray).value
    percentlist.forEach(element => {
      if (element.ccbs_edit_status != 0 || element.ccbs_edit_status == 1 || element.ccbs_edit_status == null) {
        sum_percent = sum_percent + parseFloat(element.percentage);
      }
    });
    if (sum_percent < 100 && this.amt != null) {
      let data = this.advanceform.get('ccbss') as FormArray;
      data.push(this.createccbs());
      let datas = this.advanceform.get('ccbs') as FormArray;
      datas.push(this.createccbs())
      this.success = true;
    }
    else {
      this.notification.showError("Check CCBS Percentage or Amount...")
    }
  }

  removeSection(index) {
    (<FormArray>this.advanceform.get('advance')).removeAt(index);
    this.isAdvancebtn = false;
    let amountlist = (this.advanceform.get('advance') as FormArray).value
    let amount: number = 0;
    amountlist.forEach(element => {
      amount = amount + parseFloat(element.reqamount);
    });
    var length = (this.advanceform.get('advance') as FormArray).length
    this.amt = (this.advanceform.get('advance') as FormArray).at(length - 1).value.reqamount;
    this.sum = amount
  }
  removeSection1(index, ccbs) {
    (<FormArray>this.advanceform.get('ccbss')).removeAt(index);
    // (<FormArray>this.advanceform.get('ccbs')).removeAt(index);
    // this.ccbsdeletearray = this.ccbsdeletearray.concat(ccbs.value.id);
  }


  fieldGlobalIndex(index) {
    let dat = this.pageSize * (this.p - 1) + index;
    return dat
  }
  numberOnly(event) {
    return (event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46)
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    // return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 13 || k == 32 || (k >= 48 && k <= 57));
  }


  getemployeeValue() {
    this.taservice.getemployeeValue()
      .subscribe(result => {
        this.employeelist = result['data']
        console.log("employee", this.employeelist);
        let datapagination = result["pagination"];
        if (this.employeelist.length > 0) {
          this.has_empnext = datapagination.has_next;
          this.has_empprevious = datapagination.has_previous;
          this.empcurrentpage = datapagination.index;
        }
      });
     
  }
  getbranchValue() {
    this.taservice.getbranchValue()
      .subscribe(result => {
        this.branchlist = result['data']
        console.log("branchlist", this.branchlist)
      })
  }
  getbusinesssegmentValue() {
    this.taservice.getbusinesssegmentValue('', 1)
      .subscribe(result => {
        this.bisinesslist = result['data']
        console.log("bisinesslist", this.bisinesslist)
      })
  }
  getBS(id, ind) {

    this.bs = id
    // let myForm = (<FormArray>this.advanceform.get("ccbs")).at(ind);
    // myForm.patchValue({
    //   ccid: undefined
    // });
  

    this.getcostcenterValue()
  }
  getcostcenterValue() {
    this.taservice.getcostcenterValue('', this.bs)
      .subscribe(result => {
        this.costlist = result['data']
        console.log("costlist", this.costlist)
        this.isLoading = false
      })
  }
  // isDisabled(item) : boolean {
  //   return item ;
  //  }

  value: any
  percen_calc(event, ind) {
    this.success = true;
    let form = this.advanceform.value.ccbss[ind];
    if (form.ccbs_edit_status == 0 || this.applevel == 1) {
      return true;
    }
    let value = (event.target.value / this.amt) * 100;
    if (value > 0) {
      let myForm = (<FormArray>this.advanceform.get('ccbss')).at(ind);
      myForm.patchValue({
        percentage: value
      });
    }
    else {
      let myForm = (<FormArray>this.advanceform.get('ccbss')).at(ind);
      myForm.patchValue({
        percentage: null,
        amount: null
      });
    }
  }
  // percen_calc(event, ind) {
  //   let value = (event.target.value / this.ccbsamt()) * 100;
  //   if (value > 0) {
  //     const myForm = (<FormArray>this.advanceform.get('ccbss')).at(ind);
  //     myForm.patchValue({
  //       percentage: value
  //     });
  //   }
  // }

  ccbsbtn() {
    let sum = this.advanceform.value.ccbss.map(item => Number(item?.percentage))?.reduce((prev, next) => prev + next);
    return sum
  }
  // ccbsamnt() {
  //   return this.getclaimrequest.map(item => Number(item?.approvedamount))?.reduce((prev, next) => prev + next);
  // }
  ccbs_validation(ind, field = 'percentage') {
       const myForm = (<FormArray>this.advanceform.get('ccbss')).at(ind);
    // let value = evt.target.value;
    if(this.approvesum==0){
    if (field == 'percentage') {
      let persum = this.advanceform.value.ccbss.map(item => Number(item.percentage)).reduce((prev, next) => prev + next);

      if (persum > 100) {
        this.notification.showError('Please Enter Valid Percentage as Total Percentage can not be greater than 100');
        myForm.patchValue({
          percentage: null,
          amount: null
        });
      }
    }
    else {
      let sum = this.advanceform.value.ccbss.map(item => Number(item.amount)).reduce((prev, next) => prev + next);
      // if (sum > this.ccbsamt) {
      if (sum > this.amt) {
        this.notification.showError('Please Enter Valid Amount, as Total CCBS Amount can not be greater than ' + sum);
        myForm.patchValue({
          amount: null,
          percentage: null
        });
      }
    }
  }
  else{
        let value_array=this.advanceform.value.ccbss
        let result = value_array.filter(item => item.ccbs_edit_status !== 0).map(item => Number(item.percentage)).reduce((prev, next) => prev + next);
        console.log("percetage amount,"+result);
        if (result > 100) {
          this.notification.showError('Please Enter Valid Percentage as Total Approved amount Percentage can not be greater than 100');
          myForm.patchValue({
            percentage: null,
            amount: null
          });
        }
  }
   

  }

  disablecheck() {
    let data = this.advanceform.value
    if (data.empbranchid == null) {

      return true
    }
    if (data.approval == null) {
      return true
    }
    if (data.remarks == null || data.remarks == '') {
      return true;
    }
    else {
      return false
    }
  }

  updateapproveamt(event, ind) {
    this.amtenable = true;
    this.updatingamt = Number(event.target.value)
    let formarray = this.advanceform.value.advance;
    this.approvesum = 0;
    formarray.forEach(element => {
      this.approvesum = this.approvesum + parseFloat(element.appamount)
    });
  }

  value1: any
  amount_calc(event, ind) {
    this.success = true;
    // if(this.am)
    var value = (event.target.value / 100) * this.amt;
    let form = this.advanceform.value.ccbss[ind];
    if (form.ccbs_edit_status == 0 || this.applevel == 1) {
      return true;
    }
    if (value > 0) {
      let myForm = (<FormArray>this.advanceform.get('ccbss')).at(ind);
      myForm.patchValue({
        amount: value
      });
    }
    else {
      let myForm = (<FormArray>this.advanceform.get('ccbss')).at(ind);
      myForm.patchValue({
        amount: null,
        percentage: null
      });
    }
    
  }
  selectBranch(e) {
    console.log("e", e.value)
    let branchvalue = e
    this.branchid = branchvalue
    var value = ''
    this.taservice.setemployeeValue(value, branchvalue, this.onbehalfid,1)
      .subscribe(results => {
        let datas = results
        this.employeelist = results['data']
        console.log("employee", this.employeelist);
        let datapagination = results["pagination"];
        if (this.employeelist.length > 0) {
          this.has_empnext = datapagination.has_next;
          this.has_empprevious = datapagination.has_previous;
          this.empcurrentpage = datapagination.index;
        }
      })
  }

  amt: any
  sum: any
  datasums() {

    // let ccbslist = (this.advanceform.get('ccbss') as FormArray).value
    let oldsum = this.sum
    let amountlist = (this.advanceform.get('advance') as FormArray).value
    let amount: number = 0;
    amountlist.forEach(element => {
      amount = amount + parseFloat(element.reqamount);
    });
    var length = (this.advanceform.get('advance') as FormArray).length
    var reqamt = (this.advanceform.get('advance') as FormArray).at(length - 1).value.reqamount;
    this.amt = Math.round(reqamt * 100) / 100;
    this.sum = amount.toFixed(2);

    if (this.sum != oldsum) {

    }

  }
  amtt: any
  summ: any

  negcheck(event) {
    if (event.target.value == '0') {
      event.target.value = null;
      return false;
    }
    return event.charCode >= 48
  }
  CancelClick() {
    this.shareservice.radiovalue.next('1')
    this.onCancel.emit()
    this.data = { index: 7 }
    this.sharedService.summaryData.next(this.data)
    this.route.navigateByUrl('ta/ta_summary');
  }
  Cancelback() {
    this.route.navigateByUrl('ta/cancelmaker');
  }
  empclear() {
    this.advanceform.patchValue({
      approval: null
    })


  }
  brclear() {
    this.advanceform.patchValue({
      empbranchid: null,
      approval: null
    })


  }
  reasonvals(e) {
    this.value = e.target.value
  }
  cancelapprove() {
    this.data_final = {
      "id": this.tourcanid,
      "tourgid": this.dataa,
      "apptype": "AdvanceCancel",
      "appcomment": this.value,
      "status": "3",
    }

    this.taservice.approvetourmaker(this.data_final,this.selectedFiles)
      .subscribe(res => {
        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.SpinnerService.hide()
          this.notification.showWarning("Duplicate! Code Or Name ...")
        }
        else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.SpinnerService.hide()
          this.notification.showError("INVALID_DATA!...")
        }
        else if (res.status == 'success') {
          this.SpinnerService.hide()
          this.notification.showSuccess("Approved Successfully....")
          this.route.navigateByUrl('ta/ta_summary')
          console.log("res", res)
          // this.data = {index: 4}
          // this.sharedService.summaryData.next(this.data)
          // this.route.navigateByUrl('ta/tamaster');
          this.onSubmit.emit();
          return true
        }
        else if (res.code === "UNEXPECTED_ERROR" && res.description.MESSAGE) {
          this.SpinnerService.hide()
          this.notification.showError(res.description.MESSAGE);
        }
        else {
          this.SpinnerService.hide()
          this.notification.showError(res.description);
        }
      })
  }
  cancelreject() {
    this.data_final = {
      "id": this.tourcanid,
      "tour_id": this.dataa,
      "apptype": "AdvanceCancel",
      "appcomment": this.value,
    }
    this.taservice.rejecttourmaker(this.data_final,this.selectedFiles)
      .subscribe(res => {
        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.SpinnerService.hide()
          this.notification.showWarning("Duplicate! Code Or Name ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.SpinnerService.hide()
          this.notification.showError("INVALID_DATA!...")
        }
        else if (res.status == 'success' || res.status == "SUCCESS") {
          this.SpinnerService.hide()
          this.notification.showSuccess("Rejected Successfully....")
          this.route.navigateByUrl('ta/ta_summary')

          console.log("res", res)
          // this.data = {index: 4}
          // this.sharedService.summaryData.next(this.data)
          // this.route.navigateByUrl('ta/tamaster');
          this.onSubmit.emit();
          return true
        }
        else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
        }
      })
  }
  canceldata(n) {
    this.value = n.value
    this.shareservice.radiovalue.next(this.value)
    if (n.value === 1) {
      this.showradiobtn = false;
      this.showdisabled = true;
      this.closebutton.nativeElement.click();
      this.route.navigateByUrl('ta/cancelmaker');

    }
    else {
      this.showradiobtn = true;
      this.showdisabled = false;
    }
  }
  submitcancel() {
    if (this.value === 0) {
      this.route.navigateByUrl('ta/cancelmaker');
      this.shareservice.fetchData.next(this.result);
      this.closebutton.nativeElement.click();
      this.taonbehalfForm.reset();
    }

  }
  cancel() {
    this.advancecanceldiv = true
    this.advancediv = false
    let myform = this.advanceform.value;
    this.approval = myform.approval.id ? myform.approval.id : null;
    if (!this.approval) {
      this.notification.showError('Please Select Approvar');
      return false;
    }
    if (!myform.remarks) {
      this.notification.showError('Please Enter Remarks')
      return false;
    }

    if (this.onbehalfid == "") {
      this.advancecancel = {
        "tour_id": this.dataa,
        "appcomment": this.remarks,
        "apptype": "AdvanceCancel",
        "status": "1",
        "approval": this.approval
      }
    }
    else {
      this.advancecancel = {
        "tour_id": this.dataa,
        "appcomment": this.remarks,
        "apptype": "AdvanceCancel",
        "status": "1",
        "approval": this.approval,
        "onbehalfof": this.onbehalfid,
      }
    }

    this.taservice.advanceCancel(this.advancecancel)
      .subscribe(res => {
        if (res.status === "success") {
          this.SpinnerService.hide()
          this.notification.showSuccess("Advance Cancelled Successfully....")
          this.showselfonbehalf = true;
          this.selfpopup.nativeElement.click()
          this.onSubmit.emit();

          return true;
        } else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
          return false;
        }
      })
  }

  submitccbs() {
    // console.log("Submit ccbs")
    // if (this.amt == null || this.amt == 0 || this.amt == '0') {
    //   this.notification.showError("Please Enter Valid CCBS Amount");
    //   return false;
    // }
    for (var i = 0; i < this.advanceform.get("ccbss").value.length; i++) {
        if(this.advanceform.get("ccbss").value [i]['bsid'].id == null || this.advanceform.get("ccbss").value [i]['bsid'].id=='' ||this.advanceform.get("ccbss").value [i]['bsid'].id==undefined){
          this.notification.showError('Please Select The BS Name');
          throw new Error;
        }
    }
    for (var i = 0; i < this.advanceform.get("ccbss").value.length; i++) {
     if(this.advanceform.get("ccbss").value[i]['ccid'].id==null||this.advanceform.get("ccbss").value[i]['ccid']==''||this.advanceform.get("ccbss").value[i]['ccid'].id==undefined){
      this.notification.showError("Please  Select The CC Name");
      return false;
     }
    }
    var sum_percent: number = 0;
    var sumamt: number = 0;
    let percentlist = (this.advanceform.get('ccbss') as FormArray).value
    percentlist.forEach(element => {

      if (element.percentage < 0.1) {
        this.notification.showError("Please Enter Valid CCBS Percentage")
        this.success = false;
        return false;
      }
      if (element.ccid == null || element.bsid == null) {
        this.notification.showError("Please Select CCBS")
        this.success = false;
        return false;
      }
      if (element.ccbs_edit_status == 1 || element.ccbs_edit_status == null) {
        sumamt = sumamt + Number(element.amount);
        sum_percent = sum_percent + parseFloat(element.percentage);
      }
    });
    if (this.success) {

      if (sum_percent == 100 && (this.amt == sumamt)) {
        this.closebutton.nativeElement.click();
        this.notification.showSuccess("CCBS Added Successfully....")
      }
      else {
        this.notification.showError("Check CCBS Percentage and Amount")
        return false;
      }
    }
    else {
      this.notification.showError("CCBS percentage should not be greater than 100")
      return false;
    }
  }

  getadvancecancel() {
    this.taservice.getadvancecancelflowlist(this.dataa)
      .subscribe(result => {
        console.log("Tourmaker", result)
        this.getAdvanceapproveList = result['approve'];
      })
  }

  getapprovelflowall() {
    this.taservice.getapproveflowalllist(this.dataa,'')
      .subscribe(result => {
        console.log("Tourmaker", result)
        let datas = result['approve'];
        let advstatuslist = [1, 2, 5]
        let advstatus = result['approve']
        if (advstatuslist.includes(result['advance_status_id']) || advstatuslist.includes(advstatus[advstatus.length - 1].status)) {
          this.isAdvancebtn = true;
        }
        else if (this.isAdvancebtn) {
          this.isAdvancebtn = false;
        }
        this.isAdvancebtn = true;

        let comments = result['approve']
        comments = comments.filter(function (record) {
          return record.apptype == 'ADVANCE CREATION';
        })
        var applength = comments.length;
        var comment = comments[applength - 2].comment;
        var status = comments[applength - 1].status;
        if (status != 2) {
          this.ischanged = true;
          this.advanceform.disable();
        }
        if (comments[applength - 1].status != 2 && comments[applength - 1].apptype == "ADVANCE CREATION") {
          this.lastcomment = comments[applength - 1].comment;
        }
        this.remarks = comment;
        this.getAdvanceapproveList = datas;
        this.ishidden = false

      })
  }

  getadvanceapprovesumm(pageNumber = 1, pageSize = 10) {
    this.taservice.getadvanceEditview(this.dataa)
      .subscribe(result => {
        console.log("Tourmaker", result)

        let datas = result['approve'];
        let advstatuslist = [1, 2, 5]
        let advstatus = result['approve']
        if (advstatuslist.includes(result['advance_status_id']) || advstatuslist.includes(advstatus[advstatus.length - 1].status)) {
          this.isAdvancebtn = true;
        }
        else if (this.isAdvancebtn) {
          this.isAdvancebtn = false;
        }
        if (advstatus[advstatus.length - 1].apptype != 'ADVANCE CANCEL CREATION'){
          this.ishidden = false
        }

        var applength = result['approve'].length;
        let comments = result['approve']
        var comment = comments[applength - 2].comment
        this.remarks = comment;
        this.getAdvanceapproveList = datas;

      })
  }
  // percentage_matched(i){
  //   let num:any=i;
  //   let sumd:any=0; 
  //   let val:any=this.sp_percentage
  //   console.log((this.advanceform.get('ccbss') as FormArray).value)
  //   for(let j=0;j<(this.advanceform.get('ccbss') as FormArray).length;j++){
  //     if(i<=num){
  //       sumd=sumd+(this.advanceform.get('listofquantity') as FormArray).at(j).get('asset_quantity').value;
  //     }

  //   }
  //   // console.log('sumd=',sumd);
  //   // console.log('lll',this.splitqty_ng);
  //   if((val ) < sumd ){

  //     this.notification.showError('Data Not Matched');
  //     // console.log(event.target.value );
  //     // console.log();

  //     (this.advanceform.get('listofquantity') as FormArray).at(i).get('asset_quantity').reset();
  //     return false;
  //   }
  // }

  autocompleteid() {
    setTimeout(() => {
      if (this.matassetidauto && this.autocompletetrigger && this.matassetidauto.panel) {
        fromEvent(this.matassetidauto.panel.nativeElement, 'scroll').pipe(
          map(x => this.matassetidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          let scrollTop = this.matassetidauto.panel.nativeElement.scrollTop;
          let scrollHeight = this.matassetidauto.panel.nativeElement.scrollHeight;
          let elementHeight = this.matassetidauto.panel.nativeElement.clientHeight;
          let atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          console.log("CALLLLL", atBottom)
          if (atBottom) {

            if (this.has_nextid) {
              this.taservice.getUsageCode(this.inputasset.nativeElement.value, this.has_presentid + 1).subscribe(data => {
                let dts = data['data'];
                console.log('h--=', data);
                console.log("SS", dts)
                console.log("GGGgst", this.branchlist)
                let pagination = data['pagination'];
                this.branchlist = this.branchlist.concat(dts);

                if (this.branchlist.length > 0) {
                  this.has_nextid = pagination.has_next;
                  this.has_presentid = pagination.has_previous;
                  this.has_presentid = pagination.index;

                }
              })
            }
          }
        })
      }
    })


  }
  bsidget() {
    setTimeout(() => {
      if (this.matbssidauto && this.autocompletetrigger && this.matbssidauto.panel) {
        fromEvent(this.matbssidauto.panel.nativeElement, 'scroll').pipe(
          map(x => this.matbssidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          let scrollTop = this.matbssidauto.panel.nativeElement.scrollTop;
          let scrollHeight = this.matbssidauto.panel.nativeElement.scrollHeight;
          let elementHeight = this.matbssidauto.panel.nativeElement.clientHeight;
          let atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          console.log("CALLLLL", atBottom)
          if (atBottom) {

            if (this.has_nextbsid) {
              this.taservice.getbusinesssegmentValue(this.bsssid.nativeElement.value, this.has_presentbsid + 1).subscribe(data => {
                let dts = data['data'];
                console.log('h--=', data);
                console.log("SS", dts)
                console.log("GGGgst", this.bisinesslist)
                let pagination = data['pagination'];
                this.bisinesslist = this.bisinesslist.concat(dts);

                if (this.bisinesslist.length > 0) {
                  this.has_nextbsid = pagination.has_next;
                  this.has_presentbsid = pagination.has_previous;
                  this.has_presentbsid = pagination.index;

                }
              })
            }
          }
        })
      }
    })

  }

  submitForm() {
    this.remarks=this.advanceform.get('remarks').value;
    // var datadelete = this.advanceform.value.advance
    // datadelete = datadelete.filter(function (element) {
    //   return element.statuss != 'APPROVED' && element.statuss != 'REJECTED';
    // })
    // if (datadelete[0].reason == null || datadelete[0].reason == '') {
    //   this.notification.showError('Please Enter Reason');
    //     throw new Error
    // }
    // if (datadelete[0].reqamount == null || datadelete[0].reqamount == '') {
    //   this.notification.showError('Please Enter Advance Amount');
    //     throw new Error
    // }
    if (this.remarks == null || this.remarks == '') {
      this.notification.showError('Please Enter Remarks');
        throw new Error
    }
    // if(this.resoncomment == null || this.resoncomment == '' || !this.resoncomment){
    //   this.notification.showError('Please Enter the reason');
    //   throw new Error
    // }
    if(!this.selectedFiles|| this.selectedFiles == null){
      this.notification.showError('please Upload the File  ');
      throw new Error
    }
    this.showselfonbehalf = false;
    this.advancecanceldiv = false
    this.advancediv = true;
    let formdata = JSON.parse(JSON.stringify(this.advanceform.value));
    let ccbsdata = formdata.ccbss;
    let sum_percentage: number = 0;
    let amount: number = 0;
    ccbsdata.forEach(element => {
      if (element.id == 0) {
        delete element.id;
      }
      if (element.ccid == null || element.bsid == null) {
        this.notification.showError("Please Select CCBS")
        throw new Error
      }
      if (element.percentage < 0.1) {
        this.notification.showError("Please Enter CCBS Percentage")
        throw new Error
      }

      element.ccid = element.ccid.id;
      element.bsid = element.bsid.id;
      element.percentage = Number(element.percentage)
      sum_percentage = sum_percentage + Number(element.percentage)
      element.amount = Number(element.amount)
      amount = amount + Number(element.amount)
    });

    let subject = this.advanceform.get('approval') as FormArray
    var employee = subject.value ? subject.value.id : null;
    var length = (<FormArray>this.advanceform.get("advance")).length - 1
    let myForm = (<FormArray>this.advanceform.get("advance")).at(length);
    if (employee == null) {
      this.notification.showError('Please Select Employee')
      return false;
    }
    let remarks_value= this.advanceform.get('remarks') as FormArray
   
    var remarks = remarks_value.value ? remarks_value.value : null;
    if (remarks==null){ this.notification.showError('Please Enter the Remarks')
      return false
    }
    myForm.patchValue({
      approval: employee,
    });
    myForm.patchValue({
      remarks: this.remarks,
    });

    // datadelete.forEach(element => {
    //   if (element.statuss == 'APPROVED' || element.statuss == 'REJECTED') {
    //     var index = datadelete.indexOf(element.statuss);
    //     (this.advanceform.get('advance') as FormArray).removeAt(index + 1)
    //   }
    // });
    var datadelete = this.advanceform.value.advance
    datadelete = datadelete.filter(function (element) {
      return element.statuss != 'APPROVED' && element.statuss != 'REJECTED';
    })
    if (datadelete[0].reason == null || datadelete[0].reason == '') {
      this.notification.showError('Please Enter Reason');
        throw new Error
    }
    if (datadelete[0].reqamount == null || datadelete[0].reqamount == '') {
      this.notification.showError('Please Enter Advance Amount');
        throw new Error
    }
    for (let i in datadelete) {
      if (datadelete[i].id == 0) {
        delete datadelete[i].id;
      }
      if (this.onbehalfid == undefined || this.onbehalfid == null || this.onbehalfid == "") {
        delete datadelete[i].onbehalfof;
      }
    }

    var array = this.advanceform.value.ccbss;

    let ccbslist = array;
    let mainccbs = ccbslist.filter(function (element) {
      return (element.ccbs_edit_status == 1 || element.ccbs_edit_status == null);
    });
    let maindata = []
    mainccbs.forEach((element) => {
      if (element.id == 0) {
        delete element.id;
      }
      let a = {
        id: null,
        ccid: null,
        bsid: null,
        amount: null,
        percentage: null,
        tourgid: element.tourgid
      }
      maindata.push(a);
    });

    let approve = true;

    let payload = {
      "advance": datadelete,
      "ccbs": mainccbs
    }

    let sum_percent = 0;
    maindata.forEach((element, ind) => {
      let arr = mainccbs[ind];
      if (arr?.id > 0) {
        element.id = arr.id;
      }
      else {
        delete element.id;
      }
      if(arr.ccid != null && arr.bsid != null){
        element.ccid = arr.ccid.id;
        element.bsid = arr.bsid.id;
      }
      element.amount = arr.amount;
      sum_percent = sum_percent + Number(arr.percentage)
      element.percentage = arr.percentage;
    });
    payload.ccbs = maindata;
    if (sum_percent != 100) {
      this.notification.showError('Check CCBS Percentage or Amount...')
      return false;
    }
    if (approve) {
      this.SpinnerService.show()
      this.taservice.advanceCreate(payload,this.selectedFiles)
        .subscribe(res => {
          this.SpinnerService.hide()
          if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
            this.notification.showWarning("Duplicate! Code Or Name ...")
          }
          else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
            this.SpinnerService.hide()
            this.notification.showError("INVALID_DATA!...")
          }
          else if (res.status === "SUCCESS" || res.status == "success") {

            this.SpinnerService.hide()
            this.notification.showSuccess(res.message)
            this.showselfonbehalf = true;
            let status = JSON.parse(localStorage.getItem('onbehalfpopup'));
            if (status.status) {
              this.selfpopup.nativeElement.click()
            }
            else {
              this.shareservice.radiovalue.next('1')
              this.shareservice.fetchData.next(this.result);
              this.route.navigateByUrl('ta/advancemaker-summary');
            }
            return true
          }
          else {
            this.SpinnerService.hide()
            console.log('data got :', this.ccbsdata);
            this.notification.showError(res.description)

          }
        }
        )


    }
    else {
      this.showccbs = true
      this.isSumbitbtn = false;
    }
  }


  approved() {
    this.data_final = {
      "id": this.advanceid,
      "tourgid": this.tourid,
      "requestno":this.reqno,
      "apptype": "advance",
      "applevel": "1",
      "appcomment": this.resoncomment,
      "appamount": this.updatingamt,
      "status": "3",
      // "approvedby":this.appid
    }
    // if(this.fileData == null || !this.fileData ){
    //   this.notification.showError('Please Upload the File');
    //   throw new Error
    // }

    this.approve_service(this.data_final)
  }
  rejected() {
    this.data_final = {
      "id": this.advanceid,
      "tour_id": this.tourid,
      "requestno":this.reqno,
      "apptype": "advance",
      "appcomment": this.resoncomment,


    }
    this.reject_service(this.data_final)
  }

  returned() {
    this.data_final = {
      "id": this.advanceid,
      "tour_id": this.tourid,
      "requestno":this.reqno,
      "apptype": "advance",
      "appcomment": this.resoncomment,
      "appamount": this.updatingamt
    }
    this.return_service(this.data_final)
  }

  onCancelClick() {

    this.advancecanceldiv = false
    this.advancediv = true
    this.showselfonbehalf = true;
    if (this.backrequest) {
      this.shareservice.radiovalue.next('1')
    this.onCancel.emit()
    this.data = { index: 3 }
    this.sharedService.summaryData.next(this.data)
    this.route.navigateByUrl('ta/ta_summary');
      // this.data = { index: 3 }
      // this.sharedService.summaryData.next(this.data)
      // this.route.navigateByUrl('ta/ta_summary')
    }
    else if (this.applevel == 1) {
      this.data = { index: 4 }
      this.sharedService.summaryData.next(this.data)
      this.route.navigateByUrl('ta/ta_summary');
    }
    else {
      // this.route.navigateByUrl('ta/approve');
    }

  }


  approve_service(data) {
    if (this.updatingamt == null) {
      this.notification.showError("Please Enter Approve Amount");
      throw new Error
    }
    if (this.resoncomment == null) {
      this.notification.showError('Please Enter reason');
      ;throw new Error
    }
    this.SpinnerService.show()
    this.taservice.approvetourmaker(data,this.selectedFiles)
      .subscribe(res => {
        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.SpinnerService.hide()
          this.notification.showWarning("Duplicate! Code Or Name ...")
        }
        else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.SpinnerService.hide()
          this.notification.showError("INVALID_DATA!...")
        }
        else if (res.status == 'success') {
          this.SpinnerService.hide()
          this.notification.showSuccess("Approved Successfully....")
          this.route.navigateByUrl('ta/ta_summary');
          console.log("res", res)
          // this.data = {index: 4}
          // this.sharedService.summaryData.next(this.data)
          // this.route.navigateByUrl('ta/tamaster');
          this.onSubmit.emit();
          return true
        }
        else if (res.code === "UNEXPECTED_ERROR" && res.description.MESSAGE) {
          this.SpinnerService.hide()
          this.notification.showError(res.description.MESSAGE);
        }
        else {
          this.SpinnerService.hide()
          this.notification.showError(res.description);
        }
      })
  }
  reject_service(data) {

    if (this.resoncomment == null) {
      this.notification.showError('Please Enter Reason');
      return false;
    }
    this.SpinnerService.show()
    this.taservice.rejecttourmaker(data,this.selectedFiles)
      .subscribe(res => {
        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.SpinnerService.hide()
          this.notification.showWarning("Duplicate! Code Or Name ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.SpinnerService.hide()
          this.notification.showError("INVALID_DATA!...")
        }
        else if (res.status == 'success' || res.status == "SUCCESS") {
          this.SpinnerService.hide()
          this.notification.showSuccess("Rejected Successfully....")
          this.route.navigateByUrl('ta/ta_summary');

          console.log("res", res)
          // this.data = {index: 4}
          // this.sharedService.summaryData.next(this.data)
          // this.route.navigateByUrl('ta/tamaster');
          this.onSubmit.emit();
          return true
        }
        else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
        }
      })
  }

  amountcheck(event) {
    let amount = Number(event.target.value)
    if (this.requestamt < amount) {
      event.target.value = null;
    }
  }
  return_service(data) {

    if (this.updatingamt == null) {
      this.notification.showError("Please Enter Approve Amount");
      return false;
    }
    if (this.resoncomment == null) {
      this.notification.showError('Please Enter Reason');
      return false;
    }
    this.SpinnerService.show()
    this.taservice.returntourmaker(data,this.selectedFiles)
      .subscribe(res => {
        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.SpinnerService.hide()
          this.notification.showWarning("Duplicate! Code Or Name ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.SpinnerService.hide()
          this.notification.showError("INVALID_DATA!...")
        }
        else if (res.status == 'success') {
          this.SpinnerService.hide()
          this.notification.showSuccess("Returned Successfully....")
          this.route.navigateByUrl('ta/ta_summary');
          console.log("res", res)
          // this.data = {index: 4}
          // this.sharedService.summaryData.next(this.data)
          // this.route.navigateByUrl('ta/tamaster');
          this.onSubmit.emit();
          return true
        }
        else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
        }
      })
  }
  file_ext: string[];
  base64textString = [];
  handleReaderLoaded(e) {
    var conversion = btoa(e.target.result)
    this.file_ext = ['jpg', 'png', 'JPG', 'JPEG', 'jpeg', 'image']
    if (this.file_ext.includes(this.fileextension)) {
      this.base64textString.push('data:image/png;base64,' + conversion);

    }
    else {
      this.base64textString.push('data:application/pdf;base64,' + conversion);

    }
  }
  totalcount:number=0;
  count:number=0;
  getfilecount() {
    let count = this.totalcount + this.count;
    return count
  }
  file_length: number = 0;
  list:DataTransfer;
  fileextension:any;
  images:any;
  showreasonattach:boolean;
  pdfimgview:any;
  onFileSelected(evt: any) {
    const file = evt.target.files;
    for (var i = 0; i < file.length; i++) {
      if (this.file_length == 0) {
        this.list = new DataTransfer();
        this.list.items.add(file[i]);
      }
      else {
        this.list.items.add(file[i]);
      }
      if (file[i]) {

        let stringValue = file[i].name.split('.')
        this.fileextension = stringValue.pop();
        const reader = new FileReader();
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file[i]);
        this.file_length = this.file_length + 1;
      }

    }

    let myfilelist = this.list.files
    evt.target.files = myfilelist
    this.images = evt.target.files;
    console.log("this.images", this.images)
    this.totalcount = evt.target.files.length;
    this.fileData = evt.target.files
    if (this.fileData) {
      this.showreasonattach = false
    }
    console.log("fdddd", this.fileData)
    this.pdfimgview = this.fileData[0].name
    console.log("pdffff", this.pdfimgview)

  }
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }
  preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
}
filetype_check(i: string | number) {
  let stringValue = this.images[i].name.split('.')
  this.fileextension = stringValue.pop();
  if (this.file_ext.includes(this.fileextension)) {
    var msg = 1;
  }
  else {
    var msg = 0;
  }
  return msg


}

filetype_check2(i: string | number) {
  let stringValue = this.images[i].name.split('.')
  this.fileextension = stringValue.pop();
  if (this.file_ext.includes(this.fileextension)) {
    var msg = 0;
  }
  else {
    var msg = 1;
  }
  return msg


}
pdfimages: any
fileextensions: any
getimagedownload(url, file_name) {
  this.taservice.getfetchimagesss(url)
  // .subscribe(result=>{
  // this.pdfimages=result
  // }
  // )

}
fileDeleted(id, i) {

  this.fileid = id
  this.taservice.fileDelete(this.fileid)
    .subscribe(res => {
      console.log("incires", res)
      if (res.status === "Successfully Deleted") {
        this.SpinnerService.hide()
        this.notification.showSuccess("Deleted Successfully....")
        this.attachmentlist.splice(i, 1)
        this.count = this.attachmentlist.length
        this.onSubmit.emit();
        return true;
      } else {
        this.SpinnerService.hide()
        this.notification.showError(res.description)
        return false;
      }
    })

}
deleteUpload(i) {
  this.base64textString.splice(i, 1);
  this.list.items.remove(i)
  this.totalcount = this.list.items.length;
  (<HTMLInputElement>document.getElementById("uploadFile")).files = this.list.files;
  if (this.totalcount === 0) {
    (<HTMLInputElement>document.getElementById("uploadFile")).files = null
    this.showreasonattach = true;
  }
}
commentPopup(pdf_id, file_name) {
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  this.tokenValues = token
  this.filesystem_error = false;
  let id = pdf_id;
  this.fileid = pdf_id;
  const headers = { 'Authorization': 'Token ' + token }
  let stringValue = file_name.split('.')
  this.fileextension = stringValue.pop();
  if (this.fileextension === "pdf") {
    this.jpgUrls = this.imageUrl + "taserv/download_documents/" + id + "?type=pdf&token=" + token
    // window.open(this.imageUrl + "taserv/download_documents/" + id + "?type="+this.fileextension+"&token=" + token,"_blank")
    // this.file_window = window.open(this.pdfUrls,"_blank")
  }
  else if (this.fileextension === "png" || this.fileextension === "jpeg" || this.fileextension === "jpg" || this.fileextension === "JPG" || this.fileextension === "JPEG") {
    // if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {

    this.jpgUrls = this.imageUrl + "taserv/download_documents/" + id + "?type=" + this.fileextension + "&token=" + token
  }
  else {
    this.filesystem_error = true;
  }
}
deleteAll() {
  this.totalcount = this.list.items.length;
  this.list.items.clear()
  for (let i = 0; i < this.totalcount; i++) {
    this.base64textString.splice(i, this.totalcount);
    // this.list.items.remove(i)


  }
  this.totalcount = 0;
  (<HTMLInputElement>document.getElementById("uploadFile")).files = this.list.files;
}
viewpdfimageeee: any
total_list_count:any;
advance_approverlist:[]
getimages() {
  this.taservice.getfetchimages(this.tourid)
    .subscribe((results) => {
      // this.resultimage = results[0].url
      const file_ext = ['pdf', 'jpg', 'png', 'PDF', 'JPG', 'JPEG', 'jpeg', 'image']
      this.attachmentlist = results.advance_maker
      this.advance_approverlist=results.advance_approver;
      this.total_list_count = results.advance_file_count;

      console.log("barcode", results)
      for (var i = 0; i < results.length; i++) {

        var downloadUrl = results[i].url;
        let stringValue = results[i].file_name.split('.')
        this.fileextension = stringValue.pop();
        if (file_ext.includes(this.fileextension)) {
          continue
        }
        else if (this.file_downloaded == false) {
          this.viewpdfimageeee = window.open(downloadUrl, '_blank');
          console.log('barcode', downloadUrl)
          this.fileid = results[i].id
          console.log("this.fileid", this.fileid)
          // this.getcall()
        }
      }
      this.file_downloaded = true;
    })
}
empScroll(){
  setTimeout(() => {
    if (
      this.empauto &&
      this.autocompleteTrigger &&
      this.empauto.panel
    ) {
      fromEvent(this.empauto.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.empauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.empauto.panel.nativeElement.scrollTop;
          const scrollHeight = this.empauto.panel.nativeElement.scrollHeight;
          const elementHeight = this.empauto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_empnext === true) {
              this.taservice.setemployeeValue(this.empinput.nativeElement.value,this.branchid,this.onbehalfid, this.empcurrentpage + 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.employeelist = this.employeelist.concat(datas);
                
                  if (this.employeelist.length > 0) {
                    this.has_empnext = datapagination.has_next;
                    this.has_empprevious = datapagination.has_previous;
                    this.empcurrentpage = datapagination.index;
                  }
                })
            }
          }
        });
    }
  });
}

selectedFiles:File[]=[];

onFileSelected_admaker(event:any):void{
  const files: FileList = event.target.files;
  for (let i = 0; i < files.length; i++) {
    this.selectedFiles.push(files[i]);
  }
}
getselectedFiles(){
    if (this.selectedFiles.length > 0) {
      const formData = new FormData();
      this.selectedFiles.forEach((file) => {
        formData.append('files', file, file.name);
      });
    }
 
}
deletefileUpload(i){
  this.selectedFiles.splice(i, 1);
}
@ViewChild('closedbuttons') closedbuttons;
fileback() {
  this.closedbuttons.nativeElement.click();
}

showimageHeaderPreview: boolean = false
showimageHeaderPreviewPDF: boolean = false
pdfurl: any
filepreview(files) {
  let stringValue = files.name.split('.')
  let extension = stringValue[stringValue.length-1]
  
  if (extension === "png" || extension === "jpeg" || extension === "jpg" ||
    extension === "PNG" || extension === "JPEG" || extension === "JPG") {
    // this.showimageHeaderPreview = true
    // this.showimageHeaderPreviewPDF = false
    const reader: any = new FileReader();
    reader.readAsDataURL(files);
    reader.onload = (_event) => {
    this.jpgUrls = reader.result
    const newTab = window.open();
    newTab.document.write('<html><body><img style="width: 500px;" src="' + this.jpgUrls + '" "/></body></html>');
    newTab.document.close();
    }
  }
 
  if (extension === "pdf" || extension === "PDF") {
    const reader: any = new FileReader();
    reader.onload = (_event) => {
      const fileData = reader.result;
      const blob = new Blob([fileData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    };
    reader.readAsArrayBuffer(files);
  }
  if (extension === "csv" || extension === "ods" || extension === "xlsx" || extension === "txt" ||
    extension === "ODS" || extension === "XLSX" || extension === "TXT") {
    this.showimageHeaderPreview = false
    this.showimageHeaderPreviewPDF = false
  }
}
}
