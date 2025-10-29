import { Component, OnInit, Output, EventEmitter, ViewChild, HostListener, ElementRef, ɵbypassSanitizationTrustUrl, Sanitizer, ErrorHandler } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
// import { isBoolean } from 'util';
import { PdfViewerModule } from 'ng2-pdf-viewer';
// import { formatDate } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NotificationService } from '../notification.service'
import { TaService } from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from 'src/environments/environment'
import { ShareService } from '../share.service';
import { ErrorHandlingService } from '../error-handling.service';
import { NgxSpinnerService } from "ngx-spinner";
const isSkipLocationChange = environment.isSkipLocationChange

import { finalize, switchMap, debounceTime, distinctUntilChanged, tap, map, takeUntil } from 'rxjs/operators';
// import { EventHandlerVars } from '@angular/compiler/src/compiler_util/expression_converter';
// import { I } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { TaTransactionSummaryComponent } from '../ta-transaction-summary/ta-transaction-summary.component';
import { HighlightSpanKind } from 'typescript';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
// import { Console } from 'console';

// import { pdfDefaultOptions } from 'ng2-pdf-viewer';

// import {Tourmaker} from '../tourmaker';
export interface controllingOffice {
  id: string;
  name: string;
  code: string;
}
export interface approverValue {
  employeeid: number;
  employee_name: string;
  employee_code: string;
}
export interface debit_branch{
  id:string;
  name:string;
  code:string;
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

interface details {
  id: number
  startdate: any
  enddate: any
  startingpoint: string,
  placeofvisit: string,
  purposeofvisit: string
}


@Component({
  selector: 'app-tamaker-create',
  templateUrl: './tamaker-create.component.html',
  styleUrls: ['./tamaker-create.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,
    // { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'always' } }
  ]
})
export class TamakerCreateComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.SpinnerService.hide();
    }
  }
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild('closebuttons') closebuttons;
  @ViewChild('closebutton') closebutton;
  @ViewChild("outsideElement", { static: true }) outsideElement: ElementRef;
  @ViewChild("selfpopup", { static: true }) selfpopup: ElementRef;
  btnelement: HTMLElement;
  @ViewChild('modalView', { static: true }) modalView$: ElementRef;
  employeeControl = new FormControl();
  myControl = new FormControl();
  myControl2 = new FormControl();
  myControl1 = new FormControl();
  permitmyControl = new FormControl();
  @ViewChild('employeegid') employeegid: any;
  @ViewChild('assetid') matassetidauto: MatAutocomplete;
  @ViewChild('branchassetid') branchmatassetidauto: MatAutocomplete;
  @ViewChild('permitassetid') permitmatassetidauto: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger
  @ViewChild('inputassetid') inputasset: any;
  @ViewChild('permitinputassetid') permitinputasset: any;
  @ViewChild('branchinputassetid') branchinputasset: any;
  @ViewChild('employee_gid') matemployee_gidauto: MatAutocomplete;
  @ViewChild('empid') empauto: MatAutocomplete;
  @ViewChild('empinput') empinput: any;
  transcomp: TaTransactionSummaryComponent;


  taForm: FormGroup
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
  overall: any
  has_branchnext:boolean=true;
  has_branchprevious:boolean=false;
  has_branchpresentpage:number=1;
  file_name:any
  days: any
  files_pdf:any
  tourmodel: any
  values = [];
  tourdata = [];
  tourno:any;
  stratdate: Date;
  enddate: Date;
  endatetemp: Date
  startdatetemp: Date
  isbranch: boolean = true
  currentpage: number = 1;
  pagesize = 10;
  starttdate: any
  fileData: File = null;
  previewUrl: any = null;
  uploadList = [];
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  totall: any;
  select: any;
  selectto: any;
  request: any
  toapprover: boolean = true
  isapprove: boolean = true
  total: any;
  a: any
  data: any
  data_final: any
  status: any
  tourid: any
  approverid: any
  tourapprove: any
  ishidden: boolean = false
  reasonlist: Array<any>
  isnew: boolean
  feild_disable: boolean
  show_cancelrejectdiv: boolean
  show_cancelapprovediv: boolean
  show_cancelbtn: boolean
  show_approvebtn: boolean
  isrejectdiv: boolean = false
  istaapprove: any
  pdfUrls: any;
  show_submitbtn = true
  show_approvediv: boolean
  show_rejectdiv: boolean
  show_returndiv: boolean
  show_forwarddiv: boolean
  appr_option: boolean
  showapprovalflow_div: boolean = false
  show_forwarderapprovediv: boolean
  employeelist: Array<any>=[]
  detail: details[];
  feilds_disable: boolean
  selectstart: any
  selectend: any
  imageUrl = environment.apiURL;
  jpgUrls: any;
  tourcancel: any;
  approval: any;
  file_e:any;
  base64textString = [];
  showfunds = false;
  showctc = false;
  onbehalfname: any;
  feild_reason: boolean = false
  branchlist: any;
  add_button: boolean = true
  InputVar: ElementRef;
  permittedlist: any
  onbehalfid: any
  show_forsubmit: boolean = false
  radiovalue: any
  isLoading = false;
  tourdataas: any
  images: any
  imagesData: any
  permitemployeelist: any
  tapermitForm: FormGroup
  tourpermitmodel: any
  approvalflowlist: any
  showdropdown = true
  showtext = false
  tourforward: any
  forwardbranchlist: any
  forwardemployeelist: any
  showattachment = false
  attachmentlist = []
  pdfattachmentlist = [];
  fileextension: any
  approvedby_id: any
  frwdapproverid: any
  showDate = false
  appflowtable: boolean = true
  has_next = true;
  has_previous = true;
 

  // showdates=true
  tick: boolean = true
  tourfromDate: any
  showemployeeapprover: boolean = false
  showemployee: boolean = true
  appflow: boolean = false
  tourtoDate: any
  // showcurrentdate=true
  // showselecteddate=false
  showselecteddate = false
  comment: any
  showcreatefile = true
  showeditfile = false
  showcreatecount = true
  showeditcount = false
  show_editsubmitbtn = false
  tourdetails: any
  transferList: any
  showtransfer = false
  getapprovername: any
  id: any;
  tourgid: any;
  isaction: boolean = true
  reason: any;
  fileid: any;
  image: any;
  tokenValues: any;
  result: any;
  tour: any;
  ssurl: any;
  externalWindow: Window;
  filesset: any;
  tourcanceldiv: boolean
  files: any;
  file_length: number = 0;
  file_len:number=0
  list: DataTransfer;
  file_window: Window;
  filesystem_error: boolean;
  file_downloaded: boolean = false;
  tourdiv: boolean
  name: any;
  tourlist: any[];
  empname: any;
  empgrade: any;
  empcode: any;
  empdesign: any;
  filecheck: boolean;
  fileimg: boolean;
  file_ext: string[];
  isapprovediv: boolean = false
  approver: any;
  new: boolean;
  old: boolean;
  public selected: string;
  appedit: boolean = false;
  appeditno: boolean = true;
  endlimit: any;
  endlimit1: any;
  startlimit: Date;
  dateedit: boolean;
  tourdatenot: boolean = false;
  minimum: any;
  maximum: any;
  enmaximum: any;
  enminimum: any;
  showsubmit: boolean;
  has_nextid: boolean = true;
  has_presentid: number = 1;
  log_emp: any;
  tourdetails_check: boolean = false;
  permittedupdate: boolean = false;
  tourapproval: any;
  mainbranchid: any;
  employeeid: any;
  listBranch: any;
  branchlists: any;
  approvalid: any;
  debit_branch: any;
  permitid: any;
  code: any;
  designation: any;
  full_name: any;
  showdisabled = true;
  grade: any;
  showradiobtn = false;
  empid: any;
  startdate: any;
  enddata: any;
  taonbehalfForm: FormGroup
  startingpoint: any;
  placeofvisit: any;
  purposeofvisit: any;
  reasonval: any;
  permittedby: any;
  approver_data: any;
  resonupdate: boolean;
  approveupdate: boolean;
  isSumbitbtn: boolean;
  permitupdatevl: boolean;
  isDisabled: boolean = false;
  isEnable: boolean = false;
  tour_summary: any;
  lastcomment: any = null;
  applevel: any;
  onbehalfchoose: boolean = false
  tourstatus: boolean = true;
  pageSize = 10;
  p = 1;
  s =1;
  value: any;
  tourcanid: any;
  submitbtn: boolean = true;
  tourcancelapp: boolean = false;
  cancelid: any;
  approvalflowcancellist: any;
  app: any;
  showreasonattach: boolean = false;
  report: string;
  empList: any;
  branchList: any;
  showselfonbehalf: boolean = false;
  reasonid: any;
  tourreasonid: any;
  has_reasonnext:boolean=true;
  has_reasonprevious:boolean=false;
  has_reasonpresentpage:number=1;
  tour_reason: any;



  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private http: HttpClient,
    private notification: NotificationService, private taservice: TaService,
    public sharedService: SharedService, private shareservice: ShareService, private SpinnerService: NgxSpinnerService,
    private route: Router, private activatedroute: ActivatedRoute, private errorHandler: ErrorHandlingService,) { }
  branchdata: Array<controllingOffice>;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('conoffice') matofficeAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild('branchref') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('reasons') matreasonAutocomplete: MatAutocomplete;
  @ViewChild('branchidInput') branchidInput: any;
  offcurrentpage: number = 1;
  has_offnext = true;
  has_offprevious = true;
  //tourmodel= new Tourmaker(1,'',1,'','',3,'',1)
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
      



    this.tour_summary = JSON.parse(localStorage.getItem('tourmakersummary'))
    let values = this.shareservice.radiovalue.value

    this.radiovalue = values
    let datas = this.tour_summary;
    this.tourcanid = datas['id']
    console.log("datas", datas)

    const onbehalf = JSON.parse(localStorage.getItem('onbehalf'))
    if (this.tour_summary.onbehalfof) {
      this.onbehalfname = onbehalf.onbename;
      this.onbehalfid = onbehalf.onbeid
      this.app = onbehalf.app
    }
    if (datas['id'] != 0) {
      this.empname = this.tour_summary.employee_name
      this.empgrade = this.tour_summary.empgrade
      this.empcode = this.tour_summary.employee_code
      this.empdesign = this.tour_summary.empdesignation
      this.empid = this.tour_summary.empgid
      this.getpermitedlist();
    }
    else {
      this.ishidden = false
      this.onbehalfid = datas.onbehalf
      this.onbehalfname = datas.name
      if (this.onbehalfid != undefined) {
        this.taservice.getemployeedetails(this.onbehalfid)
          .subscribe((results) => {
            console.log("results", results)
            this.tour = results
            this.empcode = results['code']
            this.empdesign = results['designation']
            this.empname = results['full_name']
            this.empgrade = results['grade']
            this.empid = this.onbehalfid
            this.getpermitedlist()
          })
        this.onbehalfchoose = true
      }
      else {
        this.taservice.getemployeesdetails()
          .subscribe((results) => {
            console.log("results", results)
            this.tour = results
            this.empcode = results['code']
            this.empdesign = results['designation']
            this.empname = results['full_name']
            this.empgrade = results['grade']
            this.empid = results['id']

            this.getpermitedlist()

          })
      }
    }
    console.log("datas", datas)


    this.taForm = this.formBuilder.group({
      requestno: 'NEW',
      requestdate: new Date(),
      reason: ['', Validators.required],
      startdate: ['', Validators.required],
      enddate: ['', Validators.required],
      approval: ['', Validators.required],
      durationdays: '',
      ordernoremarks: ['', Validators.required],
      permittedby: ['', Validators.required],
      empbranchgid: ['', Validators.required],
      comments: ['', Validators.required],
      transfer_on_promotion: '0',
      quantum_of_funds: null,
      opening_balance: null,
      debit_branch: null,
      onbehalfof: this.onbehalfid,
      detail: new FormArray([
        this.createItem(),

      ]),
      fileInputs: this.formBuilder.array([this.filerow()])

      // data: new FormArray([]),
    });


    this.tourpermitmodel = {
      empbranchgid: '',
      permittedby: ''
    }

    // this.tourfromDate=new Date()
    // this.tourtoDate=new Date()
    let data = this.tour_summary;

    console.log("data", data['tour_status'])
    if (data['tour_status'] == "APPROVED") {

      this.feild_disable = true
      this.feilds_disable = true
    }
    this.id = data['tourid'] || data['id']
    if (this.id == "0") {
      this.tourno = "NEW"
      this.id = "NEW"
      this.new = true;
      this.old = false;
      this.showsubmit = true;
    }

    console.log("id", this.id)
    let approverdata = data['approver_data']
    console.log("approverdata", approverdata)

    // let frwddata=this.shareservice.forwardData.value;
    console.log("data", data)
    console.log("this.id", this.id)

    this.show_approvediv = false;
    this.show_rejectdiv = false;
    this.show_returndiv = false;
    this.show_forwarddiv = false;
    this.appr_option = false;

    this.show_forwarderapprovediv = false;
    // if(data['tour_cancel_status']){
    //   this.cancelid =data['id']
    //    this.getapprovalflowcancel();
    //    this.iscancel=false
    //  }
    if (data['tour_approvedby']) {



      this.ishidden = true;
      this.feild_reason = false
      this.submitbtn = false
      this.cancelid = data['id']
      this.showapprovalflow_div = true
      this.appflow = false;

    }

    if (data['apptype'] == "TourCancel") {
      // this.showapprovalflow_div=true
      this.show_cancelbtn = true
      this.isbranch = false
      this.submitbtn = false
      this.feild_reason = false
      this.ishidden = false;
      this.taservice.getapproveflowalllist(this.tourgid || this.tourid,'')
        .subscribe(res => {
          this.approvalflowlist = res['approve']
        })
    }
    if (data['id'] != 0) {

      this.tourno=data['requestno']
      this.tourid = data['id']
      this.tourgid = data['tourid']
      // this.show_editsubmitbtn=true
      // this.show_submitbtn = false
      if (this.id != "NEW") {
        this.taservice.getTourmakereditSummary(data['tourid'] || data['id'])
          .subscribe((results: any) => {
            console.log(results);
            
            this.show_submitbtn = false;
            this.show_editsubmitbtn = true;
            this.tourlist = results
            let data = results
            this.removeSection(0)
            console.log("this.tourlist", this.tourlist)
            this.name = results['employee_name']
            this.new = false;
            this.old = true;
            let reason = results['reason_data']
            this.reasonval = reason.id
            let startDate = results['startdate']
            let startdate1 = this.datePipe.transform(startDate, 'yyyy-MM-dd');
            let endDate = results['enddate']
            let enddate1 = this.datePipe.transform(endDate, 'yyyy-MM-dd');
            let durationdays = results['durationdays']
            let ordernoremarks = results['ordernoremarks']
            let permittedby = results['permitted_by_data']
            let opening_balance = results['opening_balance']
            let quantum_of_funds = results['quantum_of_funds']
            // let debit_branch = results['debit_branch']
            // let new_debit_branch = {
            //   "debit_branch":  results['debit_branch'].code + "-" + results['debit_branch'].name,
            // }
            this.taForm.get('debit_branch').patchValue(
              {'id':results['debit_branch'].id,'name':results['debit_branch'].name,'code':results['debit_branch'].code });
            let transfer_on_promotion = results['transfer_on_promotion'].toString()
            let newdict = {
              "full_name": "(" + permittedby.code + ") " + permittedby.full_name,
            }
            this.permittedby = permittedby.id
            let branch_name = results['branch_data_maker']
            let approver_data = results['approver_branch_data']
            this.approver_data = approver_data.id

            var branchdetail = '(' + approver_data.branch_code + ') ' + approver_data.branch_name
            this.taForm.patchValue({ empbranchgid: branchdetail })
            for (let detail of results.detail) {
              // unarmed
              let id: FormControl = new FormControl('');
              let startdate: FormControl = new FormControl('');
              let enddate: FormControl = new FormControl('');
              let startingpoint: FormControl = new FormControl('');
              let placeofvisit: FormControl = new FormControl('');
              let purposeofvisit: FormControl = new FormControl('');

              id.setValue(detail.id);
              startdate.setValue(this.datePipe.transform(detail.startdate, 'yyyy-MM-dd'))
              enddate.setValue(this.datePipe.transform(detail.enddate, 'yyyy-MM-dd'));
              startingpoint.setValue(detail.startingpoint);
              placeofvisit.setValue(detail.placeofvisit);
              purposeofvisit.setValue(detail.purposeofvisit);
              this.getFormArray().push(new FormGroup({
                id: id,
                startdate: startdate,
                enddate: enddate,
                startingpoint: startingpoint,
                placeofvisit: placeofvisit,
                purposeofvisit: purposeofvisit,

              }));

            }
            this.taForm.patchValue({
              "reason": reason,
              "startdate": startdate1,
              "enddate": enddate1,
              "durationdays": durationdays,
              "ordernoremarks": ordernoremarks,
              "permittedby": newdict,
              "approval": approver_data,
              "quantum_of_funds": quantum_of_funds,
              "opening_balance": opening_balance,
              "transfer_on_promotion": transfer_on_promotion,
              // "debit_branch": new_debit_branch
            })

            // this.approver =results['approver_data'].name
            // console.log("this.approver",this.approver )
            // this.tourmodel.approval=this.approver
            // console.log("this.tourmodel.approver",this.tourmodel.approval )
            // console.log("permittedby", permittedby)
            let res = results['approve']
            this.approvedby_id = res[1].approvedby_id
            // console.log("this.approvedby_id", this.approvedby_id)
            // this.frwdapproverid=res[2].id
            this.dateedit = true;

            this.showtext = true

            this.showattachment = true
            this.showeditfile = true
            this.showcreatefile = false
            this.showcreatecount = false
            this.showeditcount = true


            let tourdata: any = []
            let tourjson: any = []
            tourjson = {
              "employeeid": results['approver_data'].id,
              "employee_name": results['approver_data'].name,
              "employee_code": results['approver_data'].code,
              "employee_grade": results['approver_data'].grade,
              "employee_designation": results['approver_data'].designation   

            }

            tourdata["tour"] = tourjson
            this.tourdataas = JSON.stringify(Object.assign({}, tourdata));
            tourdata = results
            localStorage.setItem("Tourmakerlist", this.tourdataas)
            this.tourmodel = results;
            this.tourmodel.reason = results['reason_id']
            this.totall = this.tourmodel.durationdays


            const branchdata = results['approver_branch_data']
            this.tourmodel.empbranchgid = branchdata.branch_name;
            this.tourmodel.approval = branchdata.full_name;
            this.employeeid = branchdata.id;
            this.mainbranchid = branchdata.branch_id;

            if (this.tourmodel.reason == 6 || this.tourmodel.reason == 7 || this.tourmodel.reason == 8) {
              this.showtransfer = true
              // this.taForm.value.transfer_on_promotion = results['transfer_on_promotion']
              // if (results['transfer_on_promotion'] == 1) {
              //   this.transferList['name'] = 'YES'
              // }
              // else {
              //   this.transferList['name'] = 'NO'
              // }
            }
            else if (this.tourmodel.reason == 2) {
              this.showfunds = true
              // this.tourmodel.quantum_of_funds = results['quantum_of_funds']
              // this.tourmodel.opening_balance = results['opening_balance']
            }
            else if (this.tourmodel.reason==12){
              this.showctc=true

            }
            this.tourmodel.permittedby = results['permittedby_id']
            this.tourmodel.permittedby = results['permittedby']
            this.tourmodel.permittedby = results['permittedby']


            console.log("this.tour", this.tourmodel)
            const tourresult = localStorage.getItem("Tourmakerlist")
            if (tourresult) {
              let gettourapproverdata = JSON.parse(tourresult);
              console.log("value", gettourapproverdata)
              this.selected = gettourapproverdata.tour.employee_name;

              console.log("APP", this.selected)
            }


            this.tourmodel.permittedby_id = results['permittedby_id']

            this.tourmodel.permittedby = results['permittedby']
            let approval = results['approver_data']
            this.tourapproval = results['approver_data'].id
            let approve = results['approve']
            this.branchid = results.approver_branch_data?.branch_id;
            var length = approve.length
            const login_check = localStorage.getItem("sessionData")
            if (login_check) {
              this.log_emp = JSON.parse(login_check);
              if (approve[length - 1].applevel == 2 && this.log_emp.employee_id == approve[length - 1].approvedby_id) {
                this.show_approvebtn = false;
                this.showsubmit = true;

              }
              else {
                this.showsubmit = false;
              }
            }
            this.getapprovername = approval.name
            console.log("appname", this.tourmodel.approval)
            this.tourmodel.detail.forEach(currentValue => {
              currentValue.startdate = this.datePipe.transform(currentValue.startdate, 'yyyy-MM-dd');
              currentValue.enddate = this.datePipe.transform(currentValue.enddate, 'yyyy-MM-dd');
            });
            this.tourmodel.startdate = this.datePipe.transform(this.tourmodel.startdate, 'yyyy-MM-dd');
            this.select = new Date(this.tourmodel.startdate);
            this.tourmodel.enddate = this.datePipe.transform(this.tourmodel.enddate, 'yyyy-MM-dd');

            this.tourmodel.requestdate = this.datePipe.transform(this.tourmodel.requestdate, 'yyyy-MM-dd');
            this.tourdetails = results['detail']
            console.log("tourdetail", this.tourdetails)
            this.tourdetails_check = true;
            let datas = this.tour_summary
            let applevel = datas['applevel']
            this.applevel = datas['applevel']


            if (datas['applevel'] == undefined || datas['applevel'] == null || datas['applevel'] == 0) {

              this.showapprovalflow_div = true
              if (this.tour_summary['tour_cancel_status'] == "APPROVED") {
                this.ishidden = false;
                this.isapprovediv = true;
              }
              else {
                if (this.tour_summary['approver_data']) {

                  this.ishidden = false;
                }
                else {
                  this.ishidden = true;
                }

              }



              if (this.tour_summary['tour_approvedby']) {
                if (this.tour_summary['tour_cancel_status']) {
                  this.showapprovalflow_div = true

                }
                else {
                  this.showapprovalflow_div = false
                }
                this.SpinnerService.show()
                this.taservice.getcancelflowlist(this.cancelid)
                  .subscribe(res => {
                    this.SpinnerService.hide()
                    this.approvalflowlist = res['approve']

                  })
              }
              else {

                this.SpinnerService.show()
                this.taservice.getapproveflowlist(this.tourid)
                  .subscribe(res => {
                    this.SpinnerService.hide()
                    this.approvalflowlist = res['approve']
                    var logged = this.log_emp.employee_id
                    let apptypelist = this.approvalflowlist.filter(function (element) {
                      return element.apptype == 'TOUR CREATION'
                    });


                    let commentlist = apptypelist.filter(function (element) {
                      return element.approver_id === logged
                    });
                    console.log("APPROVAL COMMENT", commentlist);
                    this.lastcomment = commentlist[commentlist.length - 1].comment;
                  })
              }
            }

            else {
              this.SpinnerService.show()
              this.taservice.getapproveflowalllist(this.tourgid || this.tourid,'')
                .subscribe(res => {
                  this.SpinnerService.hide()
                  this.appflow = true;
                  this.approvalflowlist = res['approve']
                  var logged = this.log_emp.employee_id
                  let apptypelist = this.approvalflowlist.filter(function (element) {
                    return element.apptype == 'TOUR CREATION'
                  });

                  if (apptypelist[apptypelist.length - 1].status == 3 || apptypelist[apptypelist.length - 1].status == 4) {
                    this.tourstatus = false;
                  }


                  let commentlist = apptypelist.filter(function (element) {
                    return element.approver_id === logged
                  });
                  console.log("APPROVAL COMMENT", commentlist);
                  let forwardlist = apptypelist;
                  var fdlength = forwardlist.length
                  if (forwardlist[fdlength - 1].status == 2 && forwardlist[fdlength - 2].status == 6) {
                    this.isDisabled = true
                    this.feild_disable = true;
                    this.feilds_disable = true;
                    this.taForm.controls['reason'].disable();
                    this.taForm.controls['durationdays'].disable();
                    this.taForm.controls['ordernoremarks'].disable();
                    this.taForm.controls['permittedby'].disable();
                    this.taForm.controls['transfer_on_promotion'].disable();
                    this.taForm.controls['quantum_of_funds'].disable();
                    this.taForm.controls['opening_balance'].disable();
                    this.taForm.controls['debit_branch'].disable();
                    this.isaction = false;
                    this.isEnable = true
                    this.add_button = false
                    let branchdata = forwardlist[fdlength - 1]
                    var brcode = branchdata.branch_code;
                    var brname = branchdata.branch_name;
                    var empcode = branchdata.approver_code;
                    var empname = branchdata.approvedby;
                    let finalbrdata = "(" + brcode + ") " + brname;
                    let finalemployee = {
                      "code": empcode,
                      "full_name": empname
                    }
                    this.feild_reason = true;
                    this.taForm.patchValue({ empbranchgid: finalbrdata })
                    this.taForm.patchValue({ approval: finalemployee })
                  }
                  this.lastcomment = commentlist[commentlist.length - 1].comment;
                  this.taForm.patchValue({ comments: this.lastcomment })
                })

            }

            console.log("applevel", applevel)
            this.status = datas['status']
            if (datas['applevel'] == 1 && this.log_emp.employee_id == approve[length - 1].approvedby_id) {
              this.showemployeeapprover = true
              this.showemployee = false
              this.feild_reason = true
              this.add_button = false
              this.feild_disable = true;
              this.feilds_disable = true;
              this.show_approvebtn = true;
              this.toapprover = false
              this.ishidden = false
              this.feilds_disable = true;
              this.isbranch = false
              this.isDisabled = true
              this.taForm.controls['reason'].disable();
              this.taForm.controls['durationdays'].disable();
              this.taForm.controls['ordernoremarks'].disable();
              this.taForm.controls['permittedby'].disable();
              this.taForm.controls['transfer_on_promotion'].disable();
              this.taForm.controls['quantum_of_funds'].disable();
              this.taForm.controls['opening_balance'].disable();
              this.taForm.controls['debit_branch'].disable();

              //   for(var i=0;i<this.taForm.value.detail.length;i++){
              //  (this.taForm.get('detail') as FormArray).at(i).disable();
              //   }


              this.appflow = true;
              this.isaction = false;
              this.show_submitbtn = false;
              this.show_editsubmitbtn = false;
              this.approverid = datas['approverid']
            }
            else if (datas['applevel'] == 2 && this.log_emp.employee_id == approve[length - 1].approvedby_id) {
              this.feild_disable = true;
              this.feild_reason = true
              this.feilds_disable = true;
              this.show_forsubmit = true;
              this.toapprover = false
              this.add_button = false
              this.isbranch = false
              this.isDisabled = true
              this.taForm.controls['reason'].disable();
              this.taForm.controls['durationdays'].disable();
              this.taForm.controls['ordernoremarks'].disable();
              this.taForm.controls['permittedby'].disable();
              this.taForm.controls['transfer_on_promotion'].disable();
              this.taForm.controls['quantum_of_funds'].disable();
              this.taForm.controls['opening_balance'].disable();
              this.taForm.controls['debit_branch'].disable();
              this.appflow = true
              this.isaction = false;
              this.show_submitbtn = false;
              this.show_editsubmitbtn = false;
              this.frwdapproverid = datas['approverid']
            
            }
            else if (datas['applevel'] == null) {
              this.show_editsubmitbtn = true;
              this.show_submitbtn = false;

            }
            else {
              this.show_editsubmitbtn = false;
              this.show_submitbtn = false;
            }
            if (datas['status'] == 3 || datas['status'] == 4 || datas['status'] == 5) {
              this.feild_disable = true;
              this.feilds_disable = true;
              this.show_submitbtn = false;
              this.show_approvebtn = false;
              this.show_editsubmitbtn = false;
            }
            this.tourapprove = {
              comments: ''
            }
            this.tourforward = {
              empbranchgid: '',
              approval: '',
              comments: ''
            }
          })
      }
    }
    else {
      this.show_submitbtn = true;
      this.show_editsubmitbtn = false;
      if (this.radiovalue === 0) {
        this.tourmodel = {
          requestno: 'NEW',
          requestdate: new Date(),
          reason: '',
          startdate: '',
          enddate: '',
          approval: '',
          comments: '',
          durationdays: '1',
          ordernoremarks: '',
          permittedby: '',
          onbehalfof: this.onbehalfid,
          detail: [],



        };

      } else {
        this.tourmodel = {
          requestno: 'NEW',
          requestdate: new Date(),
          reason: '',
          startdate: '',
          enddate: '',
          approval: '',
          durationdays: '1',
          ordernoremarks: '',
          permittedby: '',
          detail: [],

        };

      }
      // this.addSection();

      // this.startlimit = new Date()
      // this.startlimit.setDate(this.startlimit.getDate() - 762);
      const today = new Date();
      this.startlimit = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()+1);
      console.log(this.startlimit)
      this.endlimit = new Date()
      this.endlimit.setMonth(this.endlimit.getMonth() + 3)
      this.tourmodel.startdate = new Date()
      this.tourmodel.enddate = new Date()
      this.select = this.tourmodel.startdate
      this.selectto = this.tourmodel.enddate


      this.feild_disable = false;
      this.feilds_disable = false;
      this.show_approvebtn = false;
    

    }

    if (data['tour_approvedby']) {
      this.taForm.enable();
      this.show_submitbtn = false
      this.show_editsubmitbtn = false
      this.taForm.controls['reason'].disable();
      this.taForm.controls['durationdays'].disable();
      this.taForm.controls['ordernoremarks'].disable();
      this.taForm.controls['permittedby'].disable();
      this.taForm.controls['transfer_on_promotion'].disable();
      this.taForm.controls['quantum_of_funds'].disable();
      this.taForm.controls['debit_branch'].disable();
      this.taForm.controls['opening_balance'].disable();
      // this.taForm.controls['debit_branch'].disable();
      this.isDisabled = true
      this.add_button = false



    }
    else {
      if (data['tour_status'] == "APPROVED" || data['tour_status'] == "REJECTED" || data['tour_status'] == "FORWARDED") {
        this.submitbtn = false
        if (this.tour_summary['apptype'] == "TourCancel") {
          this.isrejectdiv = false
        }
        else {
          this.isrejectdiv = true
        }
        this.taForm.disable();
        this.isDisabled = true
        this.add_button = false
        this.show_submitbtn = false
        this.show_editsubmitbtn = false
        this.isaction = false
        this.ishidden = false;
        this.feilds_disable = true
      }
    }

    // this.getreasonValue();
    this.getbranchValue();
    this.gettransfer();
    // this.getreasonValue();
    this.getreasonValues();

    this.taForm.get('approval').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.taservice.getbranchemployee(value ?value : '', this.branchid, this.onbehalfid,1))
      )
      .subscribe((results: any[]) => {
        let datas = results;
        this.employeelist = datas['data'];
        console.log("Employee List", this.employeelist)
      });
    this.taservice.getreasonValues('',1).subscribe(data=>{
      this.reasonlist=data['data'];
    });
    this.taForm.get('reason').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.taservice.getreasonValues(value,1))
      )
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.reasonlist = datas;
        console.log("Employee List", this.reasonlist)
      });
    this.myControl2.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.taservice.getemployeevaluepermit(value, this.permitbranchid, this.empid))
      )
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.permitemployeelist = datas;
        console.log("permitted List", this.permitemployeelist)
      });
    this.taForm.get('permittedby').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.taservice.getpermittedlist(this.empid, value, 1, this.onbehalfid))
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.permittedlist = datas;
        console.log("permit List", this.permittedlist)
      });
    this.myControl1.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.taservice.getUsageCode(value, 1))
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;
        this.branchlists = datas;
        console.log("Branch List", this.branchlist)
      });

    this.taForm.get('empbranchgid').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.taservice.getUsageCode(value, 1))
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;
        this.branchlists = datas;
        console.log("Branch List", this.branchlist)
      });


    // this.getemployeeValue();
    this.getimages();

  }
  getbranches() {
    this.taservice.getbranchSummary()
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.branchList = datas;


      })
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

  datas(n) {
    this.value = n.value
    this.shareservice.radiovalue.next(this.value)

    if (n.value === 1) {
      this.showradiobtn = false;
      this.showdisabled = true;
      this.closebutton.nativeElement.click();
      this.route.navigateByUrl('ta/toursummary');

    }
    else {
      this.showradiobtn = true;
      this.showdisabled = false;
    }
  }
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
  submitForm() {
    if (this.value === 0) {
      this.route.navigateByUrl('ta/toursummary');
      this.shareservice.fetchData.next(this.result);
      this.closebutton.nativeElement.click();
      this.taonbehalfForm.reset();
    }

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
            const scrollTop = this.matofficeAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matofficeAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matofficeAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
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
                this.taservice.getbranchemployee(this.empinput.nativeElement.value,this.branchid,this.onbehalfid, this.empcurrentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeelist = this.employeelist.concat(datas);
                    if (this.employeelist.length >= 0) {
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

  getcall() {
    this.taservice.getfetchimages1(this.fileid)
      .subscribe((results) => {
        console.log("results", results)
      })
  }
  // empidupdate(ind){
  //     this.taForm.patchValue({
  //       approval: employee.value.id
  //     });
  //   }
  fieldGlobalIndex(index) {
    let dat = this.pageSize * (this.p - 1) + index;
    return dat
  }
  displayFn(subject) {
    return subject ? '(' + subject.code + ') ' + subject.full_name : undefined
  }
  displayFn1(subject) {
    return subject ? '(' + subject.employee_code + ') ' + subject.employee_name : undefined
  }
  permittvalue(subject) {
    return subject ? subject.full_name : undefined
  }
  reasonvalue(subject) {
    return subject ? subject.name : undefined;
  }
  branchvalue(subject) {
    return subject ? '(' + (subject.code) + ') ' + (subject.name) : undefined;
  }
  getpermitedlist() {
    console.log(this.onbehalfid);
    this.taservice.getpermitlist(this.empid, this.onbehalfid)
      .subscribe(result => {
        this.permittedlist = result['data']

      })
  }
  // addSection(i) {
  //    this.tourmodel.detail.push({
  //       id:i+1,       
  //       startdate:null,
  //       enddate:null,
  //       startingpoint:null,
  //       placeofvisit:null,
  //       purposeofvisit:null
  //   })


  // this.selectend;
  // this.selectstart;
  // this.select=false;
  // this.selectto=false;
  // this.tourmodel.approval.valueChanges
  // .pipe(
  //   debounceTime(100),
  //   distinctUntilChanged(),
  //   tap(() => {
  //     this.isLoading = true;
  //   }),
  //   switchMap(value => this.taservice.getbranchemployee(this.branchid)
  //     .pipe(
  //       finalize(() => {
  //         this.isLoading = false
  //       }),
  //     )
  //   )
  // )
  // .subscribe((results: any[]) => {
  //   let datas = results["data"];
  //   this.employeelist = datas;
  // })


  // }
  permitupdate(e) {
    this.permitid = e
    this.permitupdatevl = true
    console.log("this.permitid", this.permitid)
    this.permittedupdate = true;
  }
  // public approverFilter(filterdata?: approverValue): string | undefined {
  //   return filterdata ? filterdata.employee_name:undefined

  // }
  // get filterdata() {
  //   return this.tourmodel.approval;
  // }

  // removeSection(i){
  //   if (i!=0){
  //   this.tourmodel.detail.splice(i,1);
  //   }
  //  }
  setDate(date: string) {
    this.date = new Date();
    this.latest = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    this.currentDate = date
    this.currentDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    // console.log("Datttee   " + this.currentDate)
    this.currentDate = this.datePipe.transform(new Date(), "dd-MM-yyyy");
    return this.currentDate;
  }

  reson(e) {
    this.reason = e.target.value
    console.log("this.reason", this.reason)
    if (this.reason != undefined) {
      this.isapprove = false
    }
  }
  removevalues(i) {
    this.values.splice(i, 1);

  }

  totalcount = 0;
  pdfimgview: any
  pdfSrc: any

  CancelClick() {
    this.showselfonbehalf = true;
    this.tourdiv = false;
    this.tourcanceldiv = true;
    // let status = JSON.parse(localStorage.getItem('onbehalfpopup'));
    // if (status.status) {

    //   setTimeout(() => {
    //     this.selfpopup.nativeElement.click()
    //   })

    // }
    // else {
    //   this.shareservice.radiovalue.next('1')
    //   // this.shareservice.fetchData.next(this.result);
    //   this.route.navigateByUrl('ta/canceladd');
    // }
    this.shareservice.radiovalue.next('1')
    this.onCancel.emit()
    this.data = { index: 7 }
    this.sharedService.summaryData.next(this.data)
    this.route.navigateByUrl('ta/ta_summary');

  }
  Cancelback() {
    this.route.navigateByUrl('ta/cancelmaker');
  }
  clicktopdf(pdfSrc){
    let link = document.createElement('a');
    console.log(link)
    link.href = pdfSrc;
    link.target='_blank';
    link.click()
  }


  onFileSelected(evt: any) {
    const file = evt.target.files;
    this.totalcount = evt.target.files.length;
    
    for (var i = 0; i < file.length; i++) {
      if (file[i].name.split('.')[1]=='pdf'){
        this.file_name=file[i].name
      // file[i].name
    
      let $img: any = document.getElementById("uploadFile")['files'];

        if (typeof (FileReader) !== 'undefined') {
      
      let reader = new FileReader();

      reader.onload = (e: any) => {
        const files = evt.target.files;
        this.fileData = evt.target.files
        if (this.fileData) {
          this.showreasonattach = false
        }
        for (var i = 0; i < files.length; i++) {
          // this.totalcount = evt.target.files.length;
       
        // this.pdfSrc = window.URL.createObjectURL(new Blob([e.target.result],c));
        this.pdfSrc= window.URL.createObjectURL(new Blob([e.target.result], {type: "application/pdf"}))
        this.file_name=files[i].name
        this.pdfattachmentlist.push({"pdf":this.pdfSrc,"name":this.file_name})
        this.totalcount = this.pdfattachmentlist.length+ this.file_length
        // console.log( this.pdfattachmentlist.push({"pdf":this.pdfSrc,"name":this.file_name}));
        // let link = document.createElement('a');
        // console.log(this.link)
        // link.href = this.pdfSrc;
        // link.target='_blank';
        // link.click()
        }
    };


      reader.readAsArrayBuffer($img[0]);

        }
      }
      else{
    // const file = evt.target.files;
    // for (var i = 0; i < file.length; i++) {
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
        this.file_len = this.file_length + 1;
        this.file_length= this.pdfattachmentlist.length + this.file_len
      }

    // }

    let myfilelist = this.list.files
    evt.target.files = myfilelist
    this.images = evt.target.files;
    this.files_pdf=evt.target.files;
    console.log("this.images", this.images)
    // this.totalcount = evt.target.files.length;
    this.fileData = evt.target.files
    if (this.fileData) {
      this.showreasonattach = false
    }
    console.log("fdddd", this.fileData)
    this.pdfimgview = this.fileData[0].name
    console.log("pdffff", this.pdfimgview)
  }
    
    }
  }
  handleReaderLoaded(e) {
    var conversion = btoa(e.target.result)
    this.file_ext = ['jpg', 'png', 'JPG', 'JPEG', 'jpeg', 'image']
    this.file_e =['pdf','PDF']
    if (this.file_ext.includes(this.fileextension)) {
      this.base64textString.push('data:image/png;base64,' + conversion);
    }
    else {
      this.base64textString.push('data:application/pdf;base64,' + conversion);

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
  deleteAll() {
    this.totalcount = this.list.items.length;
    this.list.items.clear()
    for (let i = 0; i < this.totalcount; i++) {
      this.base64textString.splice(i, this.totalcount);
      this.pdfattachmentlist.splice(i, this.totalcount);
      // this.list.items.remove(i)


    }
    this.totalcount = 0;
    (<HTMLInputElement>document.getElementById("uploadFile")).files = this.list.files;
  }
  deleteUpload(i) {
    this.base64textString.splice(i, 1);
    this.pdfattachmentlist.splice(i, 1);
    this.list.items.remove(i)
    this.totalcount = this.list.items.length;
    (<HTMLInputElement>document.getElementById("uploadFile")).files = this.list.files;
    if (this.totalcount === 0) {
      (<HTMLInputElement>document.getElementById("uploadFile")).files = null
      this.showreasonattach = true;
    }
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

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
      console.log("this.previewUrl", this.previewUrl)

    }
  }
  startDateSelection(event: string, ind) {

    // console.log("startDate", event)
    const date = new Date(event)
    this.selectstart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    this.dateedit = true;
    (this.taForm.get('detail') as FormArray).at(ind).patchValue({
      enddate: null
    })

    // console.log("startttt",this.selectstart)

  }
  endDateSelection(event: string, ind) {

    // console.log("endDate", event)
    const date = new Date(event)
    if (this.taForm.value.detail[ind + 1] != null) {
      for (var i = ind + 1; i < this.taForm.value.detail.length; i++) {
        (this.taForm.get('detail') as FormArray).at(i).patchValue({
          "enddate": null,
          "startdate": null
        })
      }
    }
    this.selectend = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    this.dateedit = true;

  }

  fromdateSelection(event: string) {
    // this.showdates=false
    // this.showstartdate=true
    console.log("fromdate", event)
    const date = new Date(event)
    this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    this.selectend = this.select
    this.total = 0
    this.tourdatenot = true;

    this.taForm.patchValue({
      enddate: null
    })
    if (this.dateedit) {
      this.dateedit = false;
      this.notification.showError("Tour Start Date is changed so change the details according to it.");
      (this.taForm.controls['detail'] as FormArray).clear();
      this.addSection();
      //   this.tourdetails = []
      //   this.taForm.value.detail.push({startdate:this.select,
      //     enddate:null,
      //     startingpoint:null,
      //     placeofvisit:null,
      //     purposeofvisit:null,
      // });
    }
    this.totall = (this.total / (1000 * 60 * 60 * 24)) + 1
    // this.taForm.patchValue({
    //   reason: this.tourreasonid
    // })
    const tour_reason=this.taForm.value.reason.id
    if(tour_reason==12){
    this.endlimit1 = new Date()
    const month =this.select.getMonth()
    const year =this.select.getFullYear()
    const nextMonthFirstDay = new Date(year, month + 1, 1);
    const lastDayOfCurrentMonth = new Date(nextMonthFirstDay.getTime() - 1);
    const lastDate = new Date(lastDayOfCurrentMonth.getFullYear(), lastDayOfCurrentMonth.getMonth(), lastDayOfCurrentMonth.getDate())
    // const lastDayOfCurrentMonth = new Date(firstDayOfNextMonth.getMonth());

    this.endlimit1=(lastDate)
    }
    else{
      this.endlimit1 = new Date()
      const lastDate = new Date(this.endlimit.getFullYear(), this.endlimit.getMonth(), this.endlimit.getDate())

      this.endlimit1=(lastDate)

    }
  }
  todateSelection(event: string) {
    // this.showdates=false
    // this.showstartdate=true
    // console.log("todate", event)
    const date = new Date(event)
    this.selectto = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    if (this.dateedit) {
       /*BUG FIX 7634 Starts */
          this.dateedit = false;
      this.notification.showError("Tour Start Date is changed so change the details according to it.");
      (this.taForm.controls['detail'] as FormArray).clear();
      this.addSection();
      /*BUG FIX 7634 Ends  */
      this.taForm.value.detail = []
      this.tourdetails = []
      this.taForm.value.detail.push({
        startdate: this.select,
        enddate: null,
        startingpoint: null,
        placeofvisit: null,
        purposeofvisit: null,
      });
    }
    this.total = this.selectto - this.select;
    this.totall = (Math.round(this.total) / (1000 * 60 * 60 * 24)) + 1
    if (this.tourdatenot != true) {
      this.totall = Math.round(this.totall)
    }
    console.log("tot1", this.totall)
   

  }
  numberOnly(event) {
    var k;
    k = event.charCode;
    return  (k >= 48 && k <= 57);
  }
  // getreasonValue() {
  //   this.taservice.getreasonValue()
  //     .subscribe(result => {
  //       this.reasonlist = result['data']


  //     })
  // }
  
  getreasonValues(){
    this.taForm.get('reason').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.taservice.getreasonValues(value,1))
    )
    .subscribe((results: any[]) => {
      let datas = results['data'];
      this.reasonlist = datas;
      console.log("Employee List", this.reasonlist)
    })
  }

  permitbranchid: any
  getbrnchemp(id) {
    this.permitbranchid = id
    console.log("this.permitbranchid", this.permitbranchid)
    this.getemployeepermitlist()

  }
  getemployeepermitlist() {
    this.taservice.getemployeevalue(this.permitbranchid)
      .subscribe(result => {
        let datas = result['data']
        console.log("this.datas", datas)

        this.permitemployeelist = datas
      })
  }
  gettransfer() {
    this.taservice.getyesno()
      .subscribe(res => {
        this.transferList = res
        // console.log("yesnoList",this.boardingList)
      })
  }
  public transfervalueMapper = (value) => {
    let selection = this.transferList.find(e => {
      return e.value == value;
    });
    if (selection) {
      return selection.name;
    }
  };
  permitempname: any
  permitempid: any
  getpermit(data) {
    this.permitempname = data.full_name
    this.permitempid = data.id
    this.taForm.value.permittedby = this.permitempname


  }

  getbranchValue() {
    this.taservice.getbranchValue()
      .subscribe(result => {
        this.branchlist = result['data']
        this.forwardbranchlist = result['data']

      })
  }


  branchid: any = 0;
  has_empnext:boolean=true;
  has_empprevious:boolean=false;
  empcurrentpage:number=1
  getbranch(id) {
    this.branchid = id
    console.log("this.branchid", this.branchid)
    this.taservice.getbranchemployee("", this.branchid, this.onbehalfid,1)

      .subscribe((results: any[]) => {
        let datas = results;
        this.employeelist = datas['data']; 
        if(this.employeelist.length>0){
          let pagination=datas['pagination']
          this.has_empnext = pagination.has_next;
            this.has_empprevious = pagination.has_previous;
            this.empcurrentpage = pagination.index;
         
        }
        console.log("Employee List", this.employeelist)
      });
    }
  omit_special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    // return ((k > 31 && (k < 48 || k > 57)));
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 13 || k == 32 || (k >= 48 && k <= 57));
    // return ((k > 96 && k < 123) || k == 8 || k == 32 || (k > 64 && k < 91));


  }
  getemployeeValue() {
    // this.taservice.getbranchemployee(this.branchid)
    //   .subscribe(result => {
    //     this.employeelist = result
    //     })
  }
  forwardbranchid: any
  getforwardbranch(id) {
    this.forwardbranchid = id

    // this.taservice.getbranchemployee(this.forwardbranchid)
    //   .subscribe(result => {
    //     this.forwardemployeelist = result

    //   })
  }
  appempid: any
  getfrwdemp(data) {
    this.appempid = data.employeeid

  }
  approvalvalue(e) {
    this.approvalid = e
    this.approveupdate = true
    console.log("approval", e)
  }
  // reasonid: any;
  // tourreasonid: any;
  dropdown(data) {
    this.reasonid = data.fileupload;
    this.tourreasonid = data.id
    this.resonupdate = true
    console.log("this.tourreasonid", this.tourreasonid)
    if (data.id === 2) {
      this.showfunds = true;
    }
    else {
      this.showfunds = false;
    }
    if (data.id === 12) {
      this.showctc = true;
    }
    else {
      this.showctc = false;
    }
    if (data.id === 7 || data.id === 8 || data.name == "Transfer-Reporting") {
      this.showtransfer = true
    } else {
      this.showtransfer = false
    }
    if (data.id !== 3 && data.id !== 9 && data.id !== 10) {
      this.showreasonattach = true;
    }
    else {
      this.showreasonattach = false;
    }

  }
  approverempid: any
  getapprover(data) {
    this.approverempid = data.id
  }
  reasonvals(e) {
    this.value = e.target.value
  }
  cancelapprove() {
    this.data_final = {
      "id": this.tourcanid,
      "tourgid": this.tourgid,
      "apptype": "TourCancel",
      "appcomment": this.value,
      "status": "3",
    }

    this.approve_service(this.data_final)
  }
  cancelreject() {
    this.data_final = {
      "id": this.tourcanid,
      "tour_id": this.tourgid,
      "apptype": "TourCancel",
      "appcomment": this.value,
    }
    this.reject_service(this.data_final)
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

  tourcancelation() {
    this.tourcanceldiv = true
    this.tourdiv = false

    if (!this.taForm.value.approval) {
      this.notification.showError('Please Select Approvar')
      return false;
    }
    if (this.taForm.value.comments == '' || this.taForm.value.comments == null) {
      this.notification.showError('Please Enter Remarks');
      return false;
    }

    this.approvalid = this.taForm.value.approval.id;
    if (this.onbehalfid == "") {
      this.tourcancel = {
        "tour_id": this.tourid,
        "appcomment": this.taForm.value.comments,
        "apptype": "TourCancel",
        "status": 1,
        "approval": this.approvalid
      }
    }
    else {
      this.tourcancel = {
        "tour_id": this.tourid,
        "appcomment": this.taForm.value.comments,
        "apptype": "TourCancel",
        "onbehalfof": this.onbehalfid,
        "status": 1,
        "approval": this.approvalid
      }
    }
    this.taservice.tourCancel(this.tourcancel)
      .subscribe(res => {
        if (res.status === "success") {
          this.SpinnerService.hide()
          this.showselfonbehalf = true;
          this.notification.showSuccess("Tour Cancel Submitted Successfully....")
          this.selfpopup.nativeElement.click()
          this.onSubmit.emit();
          return true;
        } else {
          this.SpinnerService.hide()
          if (res.description == "INVALID COMMENT") {
            this.notification.showError("FILL THE REMARK")
          }
          else {
            this.notification.showError(res.description)
          }
          return false;
        }
      })
  }

  // submitForm(){
  //   if (this.tourmodel.reason === "") {
  //     this.notification.showError('Select Tour Reason');
  //     return false;
  //   }
  //   if (this.tourmodel.startdate === "") {
  //     this.notification.showError('Select Tour Start Date');
  //     return false;
  //   }
  //   if (this.tourmodel.enddate === "") {
  //     this.notification.showError('Select Tour End Date');
  //     return false;
  //   }
  //   if (this.tourmodel.ordernoremarks === "") {
  //     this.notification.showError('Select Ordernoremarks');
  //     return false;
  //   }
  //   if (this.tourmodel.permittedby === "") {
  //     this.notification.showError('Select Permittedby');
  //     return false;
  //   }
  //   this.tourmodel.approval =  this.employeeid;
  //   if ( this.tourmodel.approval === "") {
  //     this.notification.showError('Select Approver');
  //     return false;
  //   }
  //   if(this.reasonid === 1){
  //     if(this.fileData === undefined || this.fileData === null){
  //     this.notification.showError("Please Choose Files");
  //     return false;
  //     }
  //   }



  //   // if(this.tourreasonid === 2){
  //   //  let tourjson:any=[]
  //   //   tourjson={
  //   //     quantum_of_funds:'',
  //   //     opening_balance:''
  //   // }
  //   // this.tourmodel.push(tourjson)
  // // }
  //    this.tourmodel.detail.forEach(currentValue => {
  //     currentValue.startdate = this.datePipe.transform(currentValue.startdate, 'yyyy-MM-dd hh:mm:ss.0');
  //     currentValue.enddate = this.datePipe.transform(currentValue.enddate, 'yyyy-MM-dd hh:mm:ss.0');
  //     if (currentValue.startdate === "") {
  //       this.notification.showError('Select Start Date');
  //       return false;
  //     }
  //     if (currentValue.enddate === "") {
  //       this.notification.showError('Select End Date');
  //       return false;
  //     }
  //     if (currentValue.startingpoint === "") {
  //       this.notification.showError('Select Start Date');
  //       return false;
  //     }
  //     if (currentValue.placeofvisit === "") {
  //       this.notification.showError('Select Starting Point');
  //       return false;
  //     }
  //     if (currentValue.purposeofvisit === "") {
  //       this.notification.showError('Select Purposeofvisit');
  //       return false;
  //     }
  //   });

  //   this.tourmodel.startdate = this.datePipe.transform(this.tourmodel.startdate, 'yyyy-MM-dd hh:mm:ss.0');
  //   this.tourmodel.enddate = this.datePipe.transform(this.tourmodel.enddate, 'yyyy-MM-dd hh:mm:ss.0');
  //   var startdate = new Date(this.tourmodel.startdate)
  //   var enddate = new Date(this.tourmodel.enddate)
  //   if (startdate > enddate) {
  //     this.notification.showError('Tour End date must be greater than Tour Start date');
  //     return false;
  //   }
  //   this.tourmodel.requestdate = this.datePipe.transform(this.tourmodel.requestdate, 'yyyy-MM-dd hh:mm:ss.0' );
  //  if(this.totall != undefined){
  //   this.tourmodel.durationdays=this.totall
  //   console.log("day",this.tourmodel.durationdays)
  //   console.log("days",this.totall)
  //  }
  //   if(this.tourpermitmodel.permittedby !="" ){
  //     this.tourmodel.permittedby= this.tourpermitmodel.permittedby
  //   }

  //   for (var i = 0;i<this.tourmodel.detail.length;i++){
  //     if(this.tourmodel.detail[i].id == null || this.tourmodel.detail[i].id== undefined ){
  //       continue
  //     }
  //     else{
  //       delete this.tourmodel.detail[i].id ;
  //     }

  //   }
  //   console.log("tourmodel",this.tourmodel)
  //  this.taservice.createtourmakers(this.tourmodel,this.fileData)
  //   .subscribe(res=>{
  //     if(res.status === "success"){
  //       this.notification.showSuccess("Successfully Created!...")
  //       this.data = {index: 1}
  //     this.sharedService.summaryData.next(this.data)
  //     this.route.navigateByUrl('ta/ta_summary');
  //     this.onSubmit.emit();
  //     }
  //     else {
  //       this.notification.showError(res.description)

  //     } 

  //   },
  //   error => {
  //     this.errorHandler.handleError(error);

  //   }
  //   )
  // }

  //  EditsubmitForm(){
  //   if (this.reasonid === "") {
  //     this.notification.showError('Select Tour Reason');
  //     return false;
  //   }

  //   if (this.tourmodel.startdate === "") {
  //     this.notification.showError('Select Tour Start Date');
  //     return false;
  //   }
  //   if (this.tourmodel.enddate === "") {
  //     this.notification.showError('Select Tour End Date');
  //     return false;
  //   }
  //   if (this.tourmodel.ordernoremarks === "") {
  //     this.notification.showError('Select Ordernoremarks');
  //     return false;
  //   }
  //   if (this.tourmodel.permittedby == undefined|| this.tourmodel.permittedby === "" ) {
  //     this.notification.showError('Select Permittedby');
  //     return false;
  //   }
  //   this.tourmodel.approval = this.employeeid
  //   if ( this.tourmodel.approval === "") {
  //     this.notification.showError('Select Approver');
  //     return false;
  //   }

  //   console.log("tm",this.tourmodel)
  //   if(this.tourmodel['detail'].length > 0)
  //       {
  //         this.tourdetails = this.tourmodel['detail']
  //       }
  //   if (this.permittedupdate != true){
  //     this.tourmodel['permittedby'] = this.tourmodel.permittedby_id;
  //   }
    // if(this.branchid !=0){
    //   this.tourmodel['empbranchgid'] = this.branchid
    // }
    // else{
    //   this.tourmodel['empbranchgid'] = this.mainbranchid
    // }

  //   this.tourmodel={
  //         id:this.tourid,
  //         approval: this.tourmodel['approval'],
  //         durationdays:this.tourmodel['durationdays'],
  //         empbranchgid:this.tourmodel['empbranchgid'],
  //         enddate:this.tourmodel['enddate'],
  //         ordernoremarks:this.tourmodel['ordernoremarks'],
  //         permittedby:this.tourmodel['permittedby'],

  //         reason:this.tourmodel['reason'],
  //         // permittedby:this.permitempid,
  //         // reason:this.tourreasonid,
  //         requestdate:this.tourmodel['requestdate'],
  //         requestno:this.tourmodel['requestno'],
  //         startdate:this.tourmodel['startdate'],
  //         transfer_on_promotion:this.tourmodel['transfer_on_promotion'],
  //         status:2,
  //         detail:[],

  //       }
  //       this.tourmodel.durationdays=this.totall


  //       this.select = this.tourmodel['startdate']
  //       this.selectto = this.tourmodel['enddate']
  //       console.log("tourdetails",this.tourdetails)
  //       console.log("tourdetails_model",this.tourmodel.detail)
  //       for(var i = 0 ; i< this.tourdetails.length;i++){
  //         if(i==0){
  //           this.tourmodel.detail.push({
  //             id:this.tourdetails[i].id,
  //             startdate:this.tourdetails[i].startdate,
  //             enddate:this.tourdetails[i].enddate,
  //             startingpoint:this.tourdetails[i].startingpoint,
  //             placeofvisit:this.tourdetails[i].placeofvisit,
  //             purposeofvisit:this.tourdetails[i].purposeofvisit

  //         });

  //         }

  //       else if (this.tourdetails[i].id < this.tourdetails[i-1].id){
  //         this.tourmodel.detail.push({
  //           startdate:this.tourdetails[i].startdate,
  //           enddate:this.tourdetails[i].enddate,
  //           startingpoint:this.tourdetails[i].startingpoint,
  //           placeofvisit:this.tourdetails[i].placeofvisit,
  //           purposeofvisit:this.tourdetails[i].purposeofvisit

  //       });}
  //       else {
  //         this.tourmodel.detail.push({
  //           id:this.tourdetails[i].id,
  //           startdate:this.tourdetails[i].startdate,
  //           enddate:this.tourdetails[i].enddate,
  //           startingpoint:this.tourdetails[i].startingpoint,
  //           placeofvisit:this.tourdetails[i].placeofvisit,
  //           purposeofvisit:this.tourdetails[i].purposeofvisit

  //       });
  //       }
  //     }


  //     this.tourmodel.detail.forEach(currentValue => {
  //       currentValue.startdate = this.datePipe.transform(currentValue.startdate, 'yyyy-MM-dd hh:mm:ss.0');
  //       currentValue.enddate = this.datePipe.transform(currentValue.enddate, 'yyyy-MM-dd hh:mm:ss.0');
  //       if (currentValue.startdate === "") {
  //         this.notification.showError('Select Start Date');
  //         return false;
  //       }
  //       if (currentValue.enddate === "") {
  //         this.notification.showError('Select End Date');
  //         return false;
  //       }
  //       if (currentValue.startingpoint === "") {
  //         this.notification.showError('Select Start Date');
  //         return false;
  //       }
  //       if (currentValue.placeofvisit === "") {
  //         this.notification.showError('Select Starting Point');
  //         return false;
  //       }
  //       if (currentValue.purposeofvisit === "") {
  //         this.notification.showError('Select Purposeofvisit');
  //         return false;
  //       }
  //     });
  //     if (this.tourmodel.enddate < this.tourmodel.startdate) {
  //       this.notification.showError('Tour End date must be greater than Tour Start date');
  //       return false;
  //     }
  //     this.tourmodel.startdate = this.datePipe.transform(this.tourmodel.startdate, 'yyyy-MM-dd hh:mm:ss.0');
  //     this.tourmodel.enddate = this.datePipe.transform(this.tourmodel.enddate, 'yyyy-MM-dd hh:mm:ss.0');
  //     this.tourmodel.requestdate = this.datePipe.transform(this.tourmodel.requestdate, 'yyyy-MM-dd hh:mm:ss.0' );
  //     console.log("tm",this.tourmodel)

  //   this.taservice.edittourmakers(this.tourmodel,this.fileData)
  //   .subscribe(res=>{
  //     if(res.status === "success"){
  //       this.notification.showSuccess("Successfully Updated!...")
  //       this.data = {index: 1}
  //     this.sharedService.summaryData.next(this.data)
  //     this.route.navigateByUrl('ta/ta_summary');
  //     this.onSubmit.emit();
  //     }
  //     else {
  //       this.notification.showError(res.description)

  //     } 

  //   },
  //   error => {
  //     this.errorHandler.handleError(error);

  //   }
  //   )


  // }
  minselect(ind) {
    this.maximum = this.taForm.value.enddate;
    if (ind == 0) {
      return this.taForm.value.startdate;
    }
    else {
      return this.taForm.value.detail[ind - 1].enddate;

    }
  }

  maxselect(ind) {
    this.maximum = this.taForm.value.enddate;
    if (this.taForm.value.detail[ind].startdate == null) {
      return;
    }
    else {
      return this.taForm.value.detail[ind].startdate
    }

  }
  approve() {
    this.data_final = {
      "id": this.approverid,
      "tourgid": this.tourid,
      "apptype": "tour",
      "applevel": "1",
      // "approvedby": this.approvedby_id,
      "appcomment": this.reason,
      "status": "3",

    }
    if (!this.reason) {
      this.notification.showError('Please Enter Remarks..')
      return false;
    }
    // if(!this.fileData || this.fileData == null){
    //   this.notification.showError('Please select the file');
    //   return false
    // }

    this.approve_service(this.data_final)
  }


  selectemployee(employeeid) {

    this.employeeid = employeeid['id']
    console.log("EMMMM", this.employeeid)
  }


  reject() {
    this.data_final = {
      "id": this.approverid,
      "tour_id": this.tourid,
      "apptype": "tour",
      "appcomment": this.reason,

    }
    if (!this.reason) {
      this.notification.showError('Please Enter Remarks..')
      return false;
    }
    this.reject_service(this.data_final)
  }

  return() {
    this.data_final = {
      "id": this.approverid,
      "tour_id": this.tourid,
      "apptype": "tour",
      "appcomment": this.reason,

    }
    if (!this.reason) {
      this.notification.showError('Please Enter Remarks..')
      return false;
    }
    this.return_service(this.data_final)

  }
  cancelback() {
    this.route.navigateByUrl('ta/cancelapprove');

  }
  forward() {

    // if (!this.reason) {
    //   this.notification.showError('Please Enter Remarks..')
    //   return false;
    // }
    if (!this.isbranch) {
      this.taForm.patchValue({ empbranchgid: null })
      this.taForm.patchValue({ approval: null })
    }
    this.frwdapprove()
    this.isbranch = true;
  }

  frwdapprove() {
    this.data_final = {
      "id": this.approverid,
      "tour_id": this.tourid,
      "apptype": "tour",
      "applevel": "2",
      "appcomment": this.reason,
      "approvedby": this.approvalid,
    }
    this.isEnable = false;


    if (this.isbranch) {
      if (!this.approvalid) {
        this.notification.showError('Please Select Forwarder..')
        return false;
      }
      if (!this.reason) {
        this.notification.showError('Please Enter Remarks..')
        return false;
      }
      this.SpinnerService.show()
      this.taservice.forwardtourmaker(this.data_final,this.fileData)
        .subscribe(res => {
          if (res.status === "success") {
            this.SpinnerService.hide()
            this.notification.showSuccess("Forwarded Successfully....")
            this.onSubmit.emit();
            this.route.navigateByUrl('ta/ta_summary');
            return true;
          } else {
            this.SpinnerService.hide()
            if (res.description == "INVALID COMMENT") {
              this.notification.showError("FILL THE REMARK")
            }
            else {
              this.notification.showError(res.description)
            }
            return false;
          }
        })
    }
    else {
      // this.notification.showWarning('Select Forwarder');
    }
   
  }

  close_div(cls) {
    this.show_approvebtn = true;
    this.toapprover = false
    this.ishidden = false
    this.appflow = true
    this.show_approvediv = false;
    this.show_rejectdiv = false;
    this.show_returndiv = false;
    this.show_forwarddiv = false;
    this.show_forwarderapprovediv = false;
    this.tourapprove.comments = '';
  }

  approve_service(data) {
    this.SpinnerService.show()
    this.taservice.approvetourmaker(data,this.selectedFiles)
      .subscribe(res => {
        if (res.status === "success") {
          this.SpinnerService.hide()
          this.notification.showSuccess("Approved Successfully....")
          this.onSubmit.emit();
          if (data['apptype'] == "TourCancel") {
            this.route.navigateByUrl('ta/cancelapprove');
          }
          else {
            this.route.navigateByUrl('ta/ta_summary');
          }
          return true;
        } else {
          this.SpinnerService.hide()
          if (res.description == "INVALID COMMENT") {
            this.notification.showError("FILL THE REMARK")
          }
          else {
            this.notification.showError(res.description)
          }
          return false;
        }
      })
  }

  reject_service(data) {
    this.SpinnerService.show()
    this.taservice.rejecttourmaker(data,this.fileData)
      .subscribe(res => {
        if (res.status === "success") {
          this.SpinnerService.hide()
          this.notification.showSuccess("Rejected Successfully....")
          this.onSubmit.emit();
          if (data['apptype'] == "TourCancel") {
            this.route.navigateByUrl('ta/cancelapprove');
          }
          else {
            this.route.navigateByUrl('ta/ta_summary');
          }
          return true;
        } else {
          this.SpinnerService.hide()
          if (res.description == "INVALID COMMENT") {
            this.notification.showError("FILL THE REMARK")
          }
          else {
            this.notification.showError(res.description)
          }
          return false;
        }
      })
  }
  return_service(data) {
    this.SpinnerService.show()
    this.taservice.returntourmaker(data,this.fileData)
      .subscribe(res => {
        if (res.status === "success") {
          this.SpinnerService.hide()
          this.notification.showSuccess("Returned Successfully....")
          this.onSubmit.emit();
          this.route.navigateByUrl('ta/ta_summary');
          return true;
        } else {
          this.SpinnerService.hide()
          if (res.description == "INVALID COMMENT") {
            this.notification.showError("FILL THE REMARK")
          }
          else {
            this.notification.showError(res.description)
          }
          return false;
        }
      })
  }

  forwardapprove_service(data) {
    this.SpinnerService.show()
    this.taservice.forwardtourmaker(data,this.fileData)
      .subscribe(res => {
        if (res.status === "success") {
          this.SpinnerService.hide()
          this.notification.showSuccess("Forwarded Approved Successfully....")
          this.onSubmit.emit();
          this.route.navigateByUrl('ta/ta_summary');
          return true;
        } else {
          this.SpinnerService.hide()
          if (res.description == "INVALID COMMENT") {
            this.notification.showError("FILL THE REMARK")
          }
          else {
            this.notification.showError(res.description)
          }
          return false;
        }
      })


  }

  // approve_btn(btn) {
  //   this.appr_option = true;
  //   if (btn == 1) {
  //     this.show_approvebtn = false;
  //     this.show_approvediv = true;
  //     // this.taForm.controls['comments'].enable();
  //     this.show_rejectdiv = false;
  //     this.show_returndiv = false;
  //     this.show_forwarddiv = false;
  //     this.show_forwarderapprovediv = false;
  //   }
  //   else if (btn == 2) {
  //     this.show_approvebtn = false;
  //     this.show_approvediv = false;
  //     // this.taForm.controls['comments'].enable();
  //     this.show_rejectdiv = true;
  //     this.show_returndiv = false;
  //     this.show_forwarddiv = false;
  //     this.show_forwarderapprovediv = false;
  //   }
  //   else if (btn == 3) {
  //     this.show_approvebtn = false;
  //     this.show_approvediv = false;
  //     this.show_rejectdiv = false;
  //     // this.taForm.controls['comments'].enable();
  //     this.show_returndiv = true;
  //     this.show_forwarddiv = false;
  //     this.show_forwarderapprovediv = false;
  //   }

  //   else if (btn == 4) {
  //     this.show_approvebtn = false;
  //     this.show_approvediv = false;
  //     this.show_rejectdiv = false;
  //     this.show_returndiv = false;
  //     // this.taForm.controls['comments'].enable();
  //     // this.taForm.controls['empbranchgid'].enable();
  //     // this.taForm.controls['approval'].enable();
  //     this.show_forwarddiv = true;
  //     this.feilds_disable = false;
  //     this.show_forwarderapprovediv = false;
  //   }

  //   else if (btn == 5) {
  //     this.show_approvebtn = false;
  //     this.show_approvediv = false;
  //     this.show_rejectdiv = false;
  //     // this.taForm.controls['comments'].enable();
  //     this.show_returndiv = false;
  //     this.show_forwarddiv = false;
  //     this.show_forwarderapprovediv = true;
  //   }
  // }


  back() {
    this.tourdiv = true;
    this.tourcanceldiv = false;
    this.showselfonbehalf = true;
    // let status = JSON.parse(localStorage.getItem('onbehalfpopup'));
    // if (status.status) {
    //   setTimeout(() => { this.selfpopup.nativeElement.click() }, 50)
    // }
    // else {
    //   this.shareservice.radiovalue.next('1')
    //   this.shareservice.fetchData.next(this.result);
    //   this.route.navigateByUrl('ta/toursummary');
    // }
    this.shareservice.radiovalue.next('1')
    this.onCancel.emit()
    this.data = { index: 1 }
    this.sharedService.summaryData.next(this.data)
    this.route.navigateByUrl('ta/ta_summary');

  }
  approveback() {
    this.onCancel.emit()
    this.data = { index: 2 }
    this.sharedService.summaryData.next(this.data)
    this.route.navigateByUrl('ta/ta_summary');
  }
  forwardback() {
    this.isbranch = false;
  }
  resultimage: any
  downloadUrl: any
  attachmenturl: any
  pdffilename: any
  count = 0;
  viewpdfimageeee: any
  editcount = 0;
  getfilecount() {
    let count = this.totalcount + this.count;
    return count
  }
  tourmaker_list=[]
  tourapprover_list=[]
  totoallist_count:any;
  getimages() {
    if(this.id==='NEW'){
      return false;
    }else{
      this.taservice.getfetchimages(this.tourid)
      .subscribe((results) => {
        // this.resultimage = results[0].url
        const file_ext = ['pdf', 'jpg', 'png', 'PDF', 'JPG', 'JPEG', 'jpeg', 'image']
        this.attachmentlist = results.tour_maker;
        // this.tourmaker_list=results.tour_maker;
        this.tourapprover_list=results.tour_approver;
        this.totoallist_count =results.tour_file_count;


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
            this.getcall()
          }
        }
        this.file_downloaded = true;
      })

    }
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

  submitpermit() {
    this.closebuttons.nativeElement.click();
  }
  aaaa: any
  openpdfimage(url) {
    this.taservice.getviewpdfimages(url)
      .subscribe((results) => {

        this.aaaa = results
        // this.resultimage=results[0].url
        // pdfSrc: string = '/pdf-test.pdf';
        // var fileURL: any ='/ta_210820_052848angularjs_tutorial.pdf';
        // console.log("ri",this.resultimage)
        // var a = document.createElement("a");
        // a.href = fileURL;
        // a.target = '_blank';
        // a.click();

      })
  }
  empclear() {
    this.taForm.patchValue({
      approval: null
    })


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


  closefile_window() {
    this.file_window.close()
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
  fileDelete() {
    this.taservice.fileDelete(this.fileid)
      .subscribe(res => {
        console.log("incires", res)
        if (res.status === "Successfully Deleted") {
          this.SpinnerService.hide()
          this.notification.showSuccess("Deleted Successfully....")
          this.onSubmit.emit();
          return true;
        } else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
          return false;
        }
      })
  }
  permitautocompleteid() {
    setTimeout(() => {
      if (this.permitmatassetidauto && this.autocompletetrigger && this.permitmatassetidauto.panel) {
        fromEvent(this.permitmatassetidauto.panel.nativeElement, 'scroll').pipe(
          map(x => this.permitmatassetidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.permitmatassetidauto.panel.nativeElement.scrollTop;
          const scrollHeight = this.permitmatassetidauto.panel.nativeElement.scrollHeight;
          const elementHeight = this.permitmatassetidauto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          console.log("CALLLLL", atBottom)
          if (atBottom) {

            if (this.has_nextid) {
              this.taservice.getpermittedlist(this.empid, this.permitinputasset.nativeElement.value, this.has_presentid + 1, this.onbehalfid).subscribe(data => {
                let dts = data['data'];
                console.log('h--=', data);
                console.log("SS", dts)
                console.log("GGGgst", this.permittedlist)
                let pagination = data['pagination'];
                this.permittedlist = this.permittedlist.concat(dts);
                if (this.permittedlist.length > 0) {
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
  branchautocompleteid() {
    setTimeout(() => {
      if (this.branchmatassetidauto && this.autocompletetrigger && this.branchmatassetidauto.panel) {
        fromEvent(this.branchmatassetidauto.panel.nativeElement, 'scroll').pipe(
          map(x => this.branchmatassetidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.branchmatassetidauto.panel.nativeElement.scrollTop;
          const scrollHeight = this.branchmatassetidauto.panel.nativeElement.scrollHeight;
          const elementHeight = this.branchmatassetidauto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          console.log("CALLLLL", atBottom)
          if (atBottom) {

            if (this.has_nextid) {
              this.taservice.getUsageCode(this.branchinputasset.nativeElement.value, this.has_presentid + 1).subscribe(data => {
                let dts = data['data'];
                console.log('h--=', data);
                console.log("SS", dts)
                console.log("GGGgst", this.branchlist)
                let pagination = data['pagination'];
                this.branchlist = this.branchlist.concat(dts);
                this.branchlists = this.branchlists.concat(dts);
                if (this.branchlist.length > 0) {
                  this.has_nextid = pagination.has_next;
                  this.has_presentid = pagination.has_previous;
                  this.has_presentid = pagination.index;

                }
                if (this.branchlists.length > 0) {
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

  autocompleteid() {
    setTimeout(() => {
      if (this.matassetidauto && this.autocompletetrigger && this.matassetidauto.panel) {
        fromEvent(this.matassetidauto.panel.nativeElement, 'scroll').pipe(
          map(x => this.matassetidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.matassetidauto.panel.nativeElement.scrollTop;
          const scrollHeight = this.matassetidauto.panel.nativeElement.scrollHeight;
          const elementHeight = this.matassetidauto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
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
                this.branchlists = this.branchlists.concat(dts);
                if (this.branchlist.length > 0) {
                  this.has_nextid = pagination.has_next;
                  this.has_presentid = pagination.has_previous;
                  this.has_presentid = pagination.index;

                }
                if (this.branchlists.length > 0) {
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

  createItem() {
    // let group = new FormGroup({
    //   expenseid: new FormControl(''),
    //   requestercomment: new FormControl(''),
    //   tourid: new FormControl(''),
    //   same_day_return: new FormControl(''),
    //   single_fare: new FormControl(''),
    //   travel_hours: new FormControl(''),
    //   travel_mode: new FormControl('')
    // });
    let group = this.formBuilder.group({
      startdate: ['', Validators.required],
      enddate: ['', Validators.required],
      startingpoint: ['', Validators.required],
      placeofvisit: ['', Validators.required],
      purposeofvisit: ['', Validators.required],
    });

    return group;
  }
  getSections(form) {
    return form.controls.detail.controls;
  }
  addSection() {
    const data = this.taForm.get('detail') as FormArray;
    data.push(this.createItem());
  }

  removeSection(index: number) {
    (<FormArray>this.taForm.get('detail')).removeAt(index);
  }
  getFormArray(): FormArray {
    return this.taForm.get('detail') as FormArray;
  }

  is_disble_submit:boolean=false;
  submitform() {
    this.tourdiv = true
    this.tourcanceldiv = false
    if (this.taForm.value.reason.id== null || this.taForm.value.reason.id == '') {
      this.notification.showError('Please Select Tour Reason');
      throw new Error
    }
    // if (this.tourreasonid == 6 || this.tourreasonid == 7 || this.tourreasonid == 8) {
    //   if (this.taForm.value.transfer_on_promotion == "") {
    //     this.notification.showError("Please Select Transfer On Promotion");
    //     throw new Error
    //   }

    // }

    if (this.taForm.value.reason.id === 2) {
      if (this.taForm.value.quantum_of_funds == "" || this.taForm.value.quantum_of_funds==null) {
        this.notification.showError("Please Enter Quantum Of Funds");
        throw new Error
      }
      if (this.taForm.value.opening_balance == "" || this.taForm.value.opening_balance==null) {
        this.notification.showError("Please Enter Opening Balance");
        throw new Error
      }

    }
    if (this.taForm.value.reason.id === 12) {
      // this.debit_branch = this.taForm.value.debit_branch?.id;
      if (this.taForm.value.debit_branch == "" || this.taForm.value.debit_branch==null) {
        this.notification.showError("Please Select Debit Branch");
        throw new Error
      }
      this.debit_branch = this.taForm.value.debit_branch?.id;

    }
    if (this.taForm.value.startdate == '') {
      this.notification.showError("Please Select Tour Start Date");
      throw new Error
    }

    if (this.taForm.value.enddate == '' || this.taForm.value.enddate == null) {
      this.notification.showError("Please Select Tour End Date");
      throw new Error
    }

    if (this.taForm.value.ordernoremarks == '') {
      this.notification.showError("Please Enter Order No or Remarks");
      throw new Error
    }

    if (this.taForm.value.permittedby.id == '') {
      this.notification.showError("Please Select Permitted By");
      throw new Error
    }

    this.taForm.value.durationdays = this.totall
    const creditdtlsdatas = this.taForm.value.detail
    for (let i in creditdtlsdatas) {
      if (creditdtlsdatas[i].startdate == '') {
        this.notification.showError('Please Select Tour Itenary Start Date')
        throw new Error
      }
      if (creditdtlsdatas[i].enddate == null) {
        this.notification.showError('Please Select Tour Itenary End Date')
        throw new Error
      }
      if (this.taForm.value.enddate < creditdtlsdatas[i].enddate) {
        this.notification.showError('Itenary End Date should not be greater than Tour End Date')
        throw new Error
      }
      if (creditdtlsdatas[i].startingpoint == '') {
        this.notification.showError('Please Enter Starting Point')
        throw new Error
      }
      if (creditdtlsdatas[i].placeofvisit == '') {
        this.notification.showError('Please Enter Place of Visit')
        throw new Error
      }
      if (creditdtlsdatas[i].purposeofvisit == '') {
        this.notification.showError('Please Enter Purpose of Visit')
        throw new Error
      }
      creditdtlsdatas[i].startdate = this.datePipe.transform(creditdtlsdatas[i].startdate, 'yyyy-MM-dd hh:mm:ss.0'),
        creditdtlsdatas[i].enddate = this.datePipe.transform(creditdtlsdatas[i].enddate, 'yyyy-MM-dd hh:mm:ss.0')
    }
    if (this.tourreasonid === 1 || this.tourreasonid === 2 || this.tourreasonid === 4 || this.tourreasonid === 5 || this.tourreasonid === 6 ||
      this.tourreasonid === 7 || this.tourreasonid === 8 || this.tourreasonid === 11) {
      if (this.selectedFiles === undefined || this.selectedFiles === null) {
        this.notification.showError("Please Choose Files");
        throw new Error;
      }
      let filecounts = this.selectedFiles.length;
      if(filecounts == 0)
      {
        this.notification.showError("Please Attach Files");
        throw new Error;
      }

    }

    let branchVal = this.taForm.value.empbranchgid;
    if (!branchVal) {
      this.notification.showError('Please Select Branch');
      throw new Error;
    }

    let empVal = this.taForm.value.approval;
    if (!empVal) {
      this.notification.showError('Please Select Employee');
      throw new Error;
    }

    // if (this.taForm.value.permittedby  == '' ||   this.taForm.value.permittedby == null) {
    //   console.log('show error in permitted by')
    //   this.notification.showError('Please Enter Permitted By')
    //   throw new Error;
    // }

    // if (this.taForm.value.ordernoremarks  == '' ||   this.taForm.value.ordernoremarks == null) {
    //   console.log('show error in orders')
    //   this.notification.showError('Please Enter Order No or Remarks')
    //   throw new Error;
    // }
    // console.log("BRANCH VALUE", this.taForm.value.branch)
    // let branchVal = this.taForm.value.branch;
    // if(!branchVal)
    // {
    //   this.notification.showError('Please Select Branch')
    // }

    // if (this.taonbehalfForm.value.branch == '') {
    //   console.log('show error in branch')
    //   this.notification.showError('Please Select Branch')
    //   throw new Error;
    // }
    // if (this.taonbehalfForm.value.employee  == '' ||   this.taonbehalfForm.value.employee == null) {
    //   console.log('show error in employee')
    //   this.notification.showError('Please Select Employee')
    //   throw new Error;
    // }


    console.log("form", this.taForm.value)
    this.taForm.value.reason = this.taForm.value.reason.id
    this.taForm.value.approval = this.taForm.value.approval.id
    this.taForm.value.permittedby = this.taForm.value.permittedby.id;
    this.taForm.value.debit_branch = this.debit_branch;
    // this.taForm.value.permittedby = this.permitid
    this.taForm.value.startdate = this.datePipe.transform(this.taForm.value.startdate, 'yyyy-MM-dd hh:mm:ss.0');
    this.taForm.value.enddate = this.datePipe.transform(this.taForm.value.enddate, 'yyyy-MM-dd hh:mm:ss.0');
    this.taForm.value.requestdate = this.datePipe.transform(this.taForm.value.requestdate, 'yyyy-MM-dd hh:mm:ss.0');
    this.taForm.value.detail.forEach(currentValue => {
      currentValue.startdate = this.datePipe.transform(currentValue.startdate, 'yyyy-MM-dd hh:mm:ss.0');
      currentValue.enddate = this.datePipe.transform(currentValue.enddate, 'yyyy-MM-dd hh:mm:ss.0');
    })

    let deletearray = this.taForm.value;

    if (deletearray.onbehalfof == undefined) {
      delete deletearray.onbehalfof;
    }

    console.log("create", this.taForm.value)
    this.is_disble_submit=true;
    this.SpinnerService.show()
    this.taservice.createtourmakers(this.taForm.value, this.selectedFiles)
      .subscribe(res => {
        console.log("incires", res)
        if (res.status === "success") {
          this.SpinnerService.hide()
          this.notification.showSuccess("Successfully Created")
          this.showselfonbehalf = true;
          this.isSumbitbtn = true
          this.is_disble_submit=false;
          let status = JSON.parse(localStorage.getItem('onbehalfpopup'));
          if (status.status) {
            this.selfpopup.nativeElement.click()
          }
          else {
            this.shareservice.radiovalue.next('1')
            this.shareservice.fetchData.next(this.result);
            this.route.navigateByUrl('ta/toursummary');
          }
          this.onSubmit.emit();

          return true;
        } else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
          this.showselfonbehalf = false;
          this.is_disble_submit=false;
          return false;
        }
      })

  }
  EditsubmitForm() {
    this.tourdiv = true
    this.tourcanceldiv = false
    if (this.tourmodel.reason == null || this.tourmodel.reason == '') {
      this.notification.showError('Please Select Tour Reason');
      throw new Error
    }

    if (this.taForm.value.startdate == '') {
      this.notification.showError("Please Select Tour Start Date");
      throw new Error
    }

    if (this.taForm.value.enddate == '') {
      this.notification.showError("Please Select Tour End Date");
      throw new Error
    }
    if (this.tourmodel.reason === 2) {
      if (this.taForm.value.quantum_of_funds == ""||this.taForm.value.quantum_of_funds==null) {
        this.notification.showError("Please Enter Quantum Of Funds");
        throw new Error
      }
      if (this.taForm.value.opening_balance == "" || this.taForm.value.opening_balance==null) {
        this.notification.showError("Please Enter Opening Balance");
        throw new Error
      }


    }
    if (this.tourmodel.reason === 12) {
      this.debit_branch = this.taForm.value.debit_branch.id;
      if (!this.debit_branch) {
        this.notification.showError("Please Select Debit Branch");
        throw new Error
      }

    }


    this.taForm.value.durationdays = this.totall
    console.log("form", this.taForm.value)
    if (this.resonupdate) {
      this.taForm.value.reason = this.tourreasonid
    }
    else {
      this.taForm.value.reason = this.reasonval
    }
    if (this.approveupdate) {
      this.taForm.value.approval = this.approvalid
    }
    else {
      this.taForm.value.approval = this.approver_data
    }

    // if (this.taForm.value.approval == null || this.taForm.value.approval == "") {
    //   this.notification.showError('Please select Approver')
    //   return false;
    // }
    if (this.permitupdatevl) {
      this.taForm.value.permittedby = this.permitid
    }
    else {
      this.taForm.value.permittedby = this.permittedby
    }
    this.taForm.value.debit_branch = this.debit_branch;
    this.taForm.value.startdate = this.datePipe.transform(this.taForm.value.startdate, 'yyyy-MM-dd hh:mm:ss.0');
    this.taForm.value.enddate = this.datePipe.transform(this.taForm.value.enddate, 'yyyy-MM-dd hh:mm:ss.0');
    this.taForm.value.requestdate = this.datePipe.transform(this.taForm.value.requestdate, 'yyyy-MM-dd hh:mm:ss.0');
    if (this.taForm.value.startdate == "") {
      this.notification.showError("Please Select Start Date")
      return false;
    }
    if (this.taForm.value.enddate == null) {
      this.notification.showError("Please Select End Date")
      return false;
    }
    if (this.taForm.value.permittedby == "") {
      this.notification.showError("Please Select Permitted by")
      return false;
    }
    if (this.taForm.value.ordernoremarks == "") {
      this.notification.showError("Please Enter Remarks ")
      return false;
    }

    this.taForm.value.durationdays = this.totall
    console.log("form", this.taForm.value)
    if (this.resonupdate) {
      this.taForm.value.reason = this.tourreasonid
    }
    else {
      this.taForm.value.reason = this.reasonval
    }
    if (this.approveupdate) {
      this.taForm.value.approval = this.approvalid
    }
    else {
      this.taForm.value.approval = this.approver_data
    }
    if (this.permitupdatevl) {
      this.taForm.value.permittedby = this.permitid
    }
    else {
      this.taForm.value.permittedby = this.permittedby
    }

    // this.taForm.value.startdate = this.datePipe.transform(this.taForm.value.startdate, 'yyyy-MM-dd hh:mm:ss.0');
    // this.taForm.value.enddate = this.datePipe.transform(this.taForm.value.enddate, 'yyyy-MM-dd hh:mm:ss.0');
    // this.taForm.value.requestdate = this.datePipe.transform(this.taForm.value.requestdate, 'yyyy-MM-dd hh:mm:ss.0' );

    const creditdtlsdatas = this.taForm.value.detail
    for (let i in creditdtlsdatas) {
      if (creditdtlsdatas[i].startdate == '') {
        this.notification.showError('Please Select Tour Itenary Start date')
        throw new Error
      }
      if (creditdtlsdatas[i].enddate == null) {
        this.notification.showError('Please Select Tour Itenary End date')
        throw new Error
      }
      if (this.taForm.value.enddate < creditdtlsdatas[i].enddate) {
        this.notification.showError('Itenary End Date should not be greater than Tour End Date')
        throw new Error
      }
      if (creditdtlsdatas[i].startingpoint == '') {
        this.notification.showError('Please Enter Starting Point')
        throw new Error
      }
      if (creditdtlsdatas[i].placeofvisit == '') {
        this.notification.showError('Please Enter Place of Visit')
        throw new Error
      }
      if (creditdtlsdatas[i].purposeofvisit == '') {
        this.notification.showError('Please Enter Purpose of Visit')
        throw new Error
      }
      creditdtlsdatas[i].startdate = this.datePipe.transform(creditdtlsdatas[i].startdate, 'yyyy-MM-dd hh:mm:ss.0'),
        creditdtlsdatas[i].enddate = this.datePipe.transform(creditdtlsdatas[i].enddate, 'yyyy-MM-dd hh:mm:ss.0')
    }
    if (this.tourreasonid === 1 || this.tourreasonid === 2 || this.tourreasonid === 4 || this.tourreasonid === 5 || this.tourreasonid === 6 ||
      this.tourreasonid === 7 || this.tourreasonid === 8 || this.tourreasonid === 11) {
      if (this.fileData === undefined || this.fileData === null) {
        this.notification.showError("Please Choose Files");
        throw new Error
      }
    }
    let deletearray = this.taForm.value;

    if (deletearray.onbehalfof == undefined) {
      delete deletearray.onbehalfof;
    }
    console.log("create", this.taForm.value)
    this.is_disble_submit=true;
    this.SpinnerService.show()
    this.taservice.edittourmakers(this.taForm.value, this.selectedFiles, this.id)
      .subscribe(res => {
        console.log("incires", res)
        if (res.status === "success") {
          this.SpinnerService.hide()
          this.notification.showSuccess("Tour Submitted Successfully")
          this.showselfonbehalf = true;
          this.is_disble_submit=false;
          let status = JSON.parse(localStorage.getItem('onbehalfpopup'));
          if (status.status) {
            this.selfpopup.nativeElement.click()
          }
          else {
            this.shareservice.radiovalue.next('1')
            this.shareservice.fetchData.next(this.result);
            this.route.navigateByUrl('ta/toursummary');
          }


          this.onSubmit.emit();


          return true;
        } else {
          this.SpinnerService.hide()
          this.showselfonbehalf = false;
          this.notification.showError(res.description)
          this.is_disble_submit=false;
          return false;
        }
      })
  }
  frwdapproves()
  {
    this.data_final = {
      "id": this.frwdapproverid,
      "tour_id": this.tourid,
      "apptype": "tour",
      "applevel": "1",
      "appcomment": this.reason,
      "approvedby": this.frwdapproverid
    }
    this.forwardapprove_service(this.data_final)
  }
  autocompletebranchname(){
    console.log('second');
    setTimeout(()=>{
      if(this.matbranchAutocomplete && this.autocompleteTrigger && this.matbranchAutocomplete.panel){
        fromEvent(this.matbranchAutocomplete.panel.nativeElement,'scroll').pipe(
          map(x=>this.matbranchAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        ).subscribe(
          x=>{
            const scrollTop=this.matbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight=this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight=this.matbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
            if(atBottom){
             if(this.has_branchnext){
               
              this.taservice.getdebitbranchsummary( this.has_branchpresentpage+1,this.taForm.get('debit_branch').value).subscribe((data:any)=>{
                 let dear:any=data['data'];
                 console.log('second');
                 let pagination=data['pagination']
                 this.branchList=this.branchList.concat(dear);
                 if(this.branchList.length>0){
                   this.has_branchnext=pagination.has_next;
                   this.has_branchprevious=pagination.has_previous;
                   this.has_branchpresentpage=pagination.index;
                 }
               })
             }
            }
          }
        )
      }
    })
  }
  public branchintreface(data?:debit_branch):string | undefined{
    return data?data.code +' - '+data.name:undefined;
  }
  getdebitbranchdata(){
  this.taservice.getdebitbranchsummary(1,'').subscribe(data=>{
    this.branchList=data['data'];
  });
  this.taForm.get('debit_branch').valueChanges.pipe(
    tap(()=>{
      this.isLoading=true;
    }),
    switchMap((value:any)=>this.taservice.getdebitbranchsummary(1,value).pipe(
      finalize(()=>{
        this.isLoading=false;
      })
    ))
  ).subscribe(data=>{
    this.branchList=data['data'];
  });
}
autocompletereason(){
  console.log('second');
  setTimeout(()=>{
    if(this.matreasonAutocomplete && this.autocompleteTrigger && this.matreasonAutocomplete.panel){
      fromEvent(this.matreasonAutocomplete.panel.nativeElement,'scroll').pipe(
        map(x=>this.matreasonAutocomplete.panel.nativeElement.scrollTop),
        takeUntil(this.autocompleteTrigger.panelClosingActions)
      ).subscribe(
        x=>{
          const scrollTop=this.matreasonAutocomplete.panel.nativeElement.scrollTop;
          const scrollHeight=this.matreasonAutocomplete.panel.nativeElement.scrollHeight;
          const elementHeight=this.matreasonAutocomplete.panel.nativeElement.clientHeight;
          const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
          if(atBottom){
           if(this.has_reasonnext){
             
            this.taservice.getreasonValues(this.taForm.get('reason').value,this.has_reasonpresentpage+1).subscribe((data:any)=>{
               let dear:any=data['data'];
               console.log('second');
               let pagination=data['pagination']
               this.reasonlist=this.reasonlist.concat(dear);
               if(this.reasonlist.length>0){
                 this.has_reasonnext=pagination.has_next;
                 this.has_reasonprevious=pagination.has_previous;
                 this.has_reasonpresentpage=pagination.index;
               }
             })
           }
          }
        }
      )
    }
  })
}



@ViewChild('closedbuttons') closedbuttons;


filerow(){
  let group =this.formBuilder.group({
    filevalue:new FormArray([]),
    file_key:new FormArray([]),
    filedataas:new FormArray([])
  })
}
filedatas: any
fileindex: any
filedatadataswork: any
getfiledetails(datas, ind) {
  console.log("ddataas",datas)
  this.filedatadataswork=datas
  this.fileindex = ind
  // this.filedatas = datas.value['filekey']
}
formData:any=new FormData();
total_file_count:number=0;
assetcat1:any
valid_arr:Array<any>=[];
file_process_data:any={};
getFileDetails(index, e) {
  let data = this.taForm.value.fileInputs;
  this.total_file_count=this.taForm.value.fileInputs.length;
  console.log(this.total_file_count);
  for (var i = 0; i < e.target.files.length; i++) {
    data?.filevalue?.push(e.target.files[i])
    data?.filedataas?.push(e.target.files[i])
    data?.file_key?.push(e.target.files[i])
    this.taForm?.value?.fileInputs.push(e.target.files[i])
    this.valid_arr.push(e.target.files[i])
      // this.frmData.append("file",e.target.files[i]);
    // this.formData.push('file',e.target.files[i]);
    
    

  }
  
  
  this.file_process_data["file"+index]=this.valid_arr;
  this.formData.append('file',this.valid_arr)
  this.formData['file']=this.valid_arr
  if (e.target.files.length > 0) {
    if (data?.file_key.length < 1) {
      data?.file_key?.push("file" + index);
    }
    
  }

}
fileback() {
  this.closedbuttons.nativeElement.click();
}
selectedFiles:File[]=[];
totalcount_selectedfile:any

onFileSelected_tamaker(event:any):void{
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
delete_file_Upload(i){
  this.selectedFiles.splice(i, 1);
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
deletefileUpload(invdata, i) {

  
  let filedata = invdata.filevalue
  let filedatas = invdata.filedataas
  let file_key = invdata.file_key;
  
  let index_id:any="file"+this.fileindex;
  this.file_process_data[index_id].splice(i,1);
  filedata.splice(i, 1)
  filedatas.splice(i, 1)
  if (this.file_process_data[index_id].length == 0) 
    file_key.splice(i, 1)
    
    this.valid_arr.push(file_key)
    this.valid_arr.push(file_key);
    this.total_file_count=this.taForm.value.fileInputs.length;
    this.total_file_count=this.file_process_data.length();
    console.log('file data',this.formData)
    

}

}

