import { Component, OnInit, Output, EventEmitter, ViewChild,HostListener } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { isBoolean } from 'util';
import { ToastrService } from 'ngx-toastr';
// import { formatDate } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NotificationService } from '../notification.service'
import { TaService } from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import { ActivatedRoute, Router } from "@angular/router";
import { ShareService } from 'src/app/ta/share.service';
import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';
import { NgxSpinnerService } from "ngx-spinner";
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { environment } from 'src/environments/environment';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, tap } from 'rxjs/operators';
export interface paymodelistss {
  code: string;
  id: string;
  name: string;
}
@Component({
  selector: 'app-expenceapprove-edit',
  templateUrl: './expenceapprove-edit.component.html',
  styleUrls: ['./expenceapprove-edit.component.scss']
})

export class ExpenceapproveEditComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.SpinnerService.hide();
    }
  }
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild('closebutton') closebutton;
  @ViewChild('ccid') cccid: any;
  @ViewChild('bsid') bsssid: any;
  @ViewChild('bssid') matbssidauto: MatAutocomplete;
  @ViewChild('assetid') matassetidauto: any;
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger
  @ViewChild('empid') empauto: MatAutocomplete;
  @ViewChild('empinput') empinput: any;
  has_empnext:boolean=true;
  has_empprevious:boolean=false;
  empcurrentpage:number=1
  crnno:any;
  comments: any
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  tourmodel: any
  tourmodell: any
  expencetypeList: any
  isDisabled = true;
  exp: any;
  comm: any;
  expense: any;
  expensee: any;
  id: any
  data: any
  getclaimrequest: any
  expenseList = [];
  advance_list = [];
  re: any
  tourrr: any
  types: any
  isccbsbtn: boolean = true;
  clicked = false;
  expensetype: any;
  expenceform: FormGroup;
  tourid: any;
  show_forwarderapprovediv: boolean
  expenceid: any;
  getAdvanceapproveList: any;
  employeelist: any;
  branchlist: any;
  bisinesslist: any;
  costlist: any;
  listBranch: any;
  amt: any;
  ccbsamt: any;
  amtsum: any;
  ccbsper: any;
  persum: any;
  total1: number;
  tourgid: any;
  PaymodeList: any
  ppxid:any
  creditglForm: FormGroup
  ERAList: any;
  expenceformview: FormGroup;
  payableSelected =false
  cdtsum: any;

  reason: any;
  startdate: any;
  showattachment: boolean = false
  showeditfile: boolean = true
  enddate:any;
  employee_code: any;
  employee_name: any;
  show_approvediv: boolean
  show_rejectdiv: boolean
  appr_option: boolean
  show_returndiv: boolean
  show_forwarddiv: boolean
  show_approvebtn: boolean = true
  empdesignation: any;
  empgrade: any;
  emp_branch: any;
  forwarded:any
  emp_branch_code: any;
  emp_branch_name_code: any;
  aaaa: any;
  viewpdfimageeee: Window;
  pdfimgview: any;
  totalcount: any;
  images: any;
  resultimage: any;
  attachmentlist=[];
  imageUrl = environment.apiURL;
  count: any;
  fileextension: any;
  data_final: any
  tourapprove: any;
  tourforward: any;
  approverid: any;
  file_downloaded: boolean;
  fileid: any;
  p = 1;
  tokenValues: any;
  filesystem_error: boolean;
  pdfUrls: string;
  reapprove: boolean = false;
  file_window: Window;
  jpgUrls: string;
  remarks: any;
  branchid: any;
  has_nextemp: boolean = true;
  has_previousemp: boolean = true;
  has_presentemp: any = 1
  movetootherno: boolean = true;
  applevel: any;
  apichanges: boolean = true;
  isLoading: boolean;
  approvedamt: number;
  eligibleamt: Number;
  claimedamt: Number;
  expencetyp: any;
  approvedbyid: any;
  value: any;
  advance_statusid: any;
  empl: any
  pageSize = 10
  pageadsize = 10
  presentpage = 1
  ccbslist: any;
  reasonchange: any = null;
  statusId: any;
  itemdisable: boolean = true;
  loginid: any;
  currentDate: any = new Date();
  changeapprover: boolean;
  advancelist: any;
  sumadvance: number = 0;
  netpay: number;
  expencetypee: any;
  invalidpermission: boolean = false;
  tournotend: boolean = false;
  laststatus: any;
  empbrid: boolean = false;
  apvl: boolean = false;
  action: string[];
  actionapprove: boolean = false;
  actionreject: boolean = false;
  actionreturn: boolean = false;
  showreason: boolean = false;
  returnreason: boolean;
  editcount = 0;
  has_nextbsid: boolean = true;
  has_presentbsid: number = 1;
  rejectreason: boolean;
  actionkey: boolean = true;
  ccid: any;
  bsid: any;
  bs: any;
  paper_type: boolean = false;
  is_advance: boolean = false;
  base64textString = [];
  file_ext: any;
  file_length: number = 0;
  list: DataTransfer;
  reqtourno:any;
  amtapprove: boolean = false;
  not_reset:boolean=false;
  move_To_other:any
  // tourmodel.comments || !tourmodel.expencetype=any
  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private http: HttpClient, private taservice: TaService, private notification: NotificationService, private shareservice: ShareService,
    private router: Router, private sharedService: SharedService, private taService: TaService, private SpinnerService:NgxSpinnerService,private toastr: ToastrService,) { }

  ngOnInit(): void {
    const expense_summary = JSON.parse(localStorage.getItem('expense_details'))
    const logindetails = JSON.parse(localStorage.getItem('sessionData'))
    this.loginid = logindetails.employee_id
    this.approverid = expense_summary['approver_id']
    this.tourgid = expense_summary['tourid']
    this.reqtourno = expense_summary['requestno']
    this.tourid = expense_summary['tourid']
    this.reason = expense_summary['reason']
    this.startdate = expense_summary['startdate']
    this.action = ['APPROVE', 'RETURN', 'REJECT']

    this.enddate = expense_summary['enddate']
    this.emp_branch=expense_summary['branch_name']
    this.emp_branch_code=expense_summary['branch_code']
    this.emp_branch_name_code=`(${this.emp_branch_code}) ${this.emp_branch}`;
    this.employee_code = expense_summary['employee_code']
    this.employee_name = expense_summary['employee_name']
    this.empdesignation = expense_summary['empdesignation']
    this.empgrade = expense_summary['empgrade']
    this.applevel = expense_summary['applevel']
    this.statusId = expense_summary.claim_status_id;
    if (this.applevel == 2) {
      
      this.action = ['APPROVE', 'RETURN', 'REJECT', 'MOVE TO OTHER']
    }
    this.branchid = expense_summary.empbranchgid
    this.advance_statusid = expense_summary['advance_status_id'];
    if (expense_summary.status_name == 'APPROVED') {
      this.reapprove = true;
    }
    this.id = expense_summary['tourid']
    console.log("id", this.id)
    this.tourmodell = {
      requestno: this.id,
      expencetypee: "",
      comments: "",
      bank: ""
    }
    this.tourmodel = {
      tourgid: this.id,
      approvedby: '',
      appcomment: '',

    }
    this.tourapprove = {
      comments: ''
    }
    this.creditglForm = this.formBuilder.group({
      paymode_id: [''],
      glnum: [''],
      category_code: [''],
      subcategory_code: [''],
      bs_code:[''],
      cc_code:[''],

    })
    this.expenceformview=this.formBuilder.group({
      creditdtl: new FormArray([
        this.creditdetails(),
        
      ])
    })

    this.exp = this.tourmodell.expencetype;
    this.comm = this.tourmodell.comments;
    console.log("bbb", this.comm)
    this.getexpenseValue();
    this.comentscl();
    this.getclaimrequestsumm();
    this.getadvanceapprovesumm();
    this.getbusinesssegmentValue();
    this.getbranchValue();
    if (this.applevel == 2 && this.statusId == 2) {
      this.ccbsupdate();
    }

    this.tourrr = this.tourmodell
    console.log("saiii", this.tourrr)

    this.shareservice.dropdownvalue.next(expense_summary)
    //  this.taservice.getfetchimages( this.tourid)
    //  .subscribe((results) => {
    //  //  this.resultimage=results[0].url
    //    this.attachmentlist=results
    //    this.count = this.attachmentlist.length
    //    let stringValue = results[0].file_name.split('.')
    //    this.fileextension=stringValue.pop();

    //  }) 

    this.expenceform = this.formBuilder.group({
      tourgid: this.id,
      appcomment: null,
      empbranchid: null,
      approvedby: null,
      approval: null,
      action: null,
      ccbs: new FormArray([
      ]),
    })

    if (this.apichanges) {
      this.expenceform.get('empbranchid').valueChanges
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
          console.log("Branch List", this.branchlist)
        });

      this.expenceform.get('approval').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.taservice.setemployeeValues(value?value:' ', this.branchid, '', this.id,1))
        )
        .subscribe((results: any[]) => {
          let datas = results;
          this.employeelist = datas['data'];
          console.log("Employee List", this.employeelist)
        });
        (this.expenceform.get('ccbs') as FormArray).push(this.createccbs());

    }

  }
  getimagedownload(url, file_name) {
    this.taservice.getfetchimagesss(url)
    // .subscribe(result=>{
    // this.pdfimages=result
    // }
    // )
  }
  file_download(id, filename){
    this.SpinnerService.show();
    let fileName = filename
    this.taService.ta_file_download(id).subscribe((response: any) =>{
      this.SpinnerService.hide();
      if(response['type']!="application/json"){
        let filevalue = fileName.split('.')
        let binaryData = [];
        binaryData.push(response)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();}
     if(response['type']=="application/json"){
      this.SpinnerService.hide();
        this.toastr.error('No Download Files Found');
      }
  }),(error) => {
    this.toastr.error('No Download Files Found');
    this.SpinnerService.hide();
  }
  }
  fileDeleted(id, i) {
    this.fileid = id
    this.taservice.fileDelete(this.fileid)
      .subscribe(res => {
        console.log("incires", res)
        if (res.status === "Successfully Deleted") {
          this.SpinnerService.hide()
          this.notification.showSuccess("Deleted Successfully")
          this.attachmentlist.splice(i, 1)
          this.onSubmit.emit();
          return true;
        } else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
          return false;
        }
      })
  }
  displayFn(subject) {
    return subject ? "(" + subject.code + ")" + subject.full_name : undefined;
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 13 || k == 32 || (k >= 48 && k <= 57));
  }

  remarksupdate(value) {
    this.remarks = value.target.value;
  }

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

  actionchange(key) {
    this.move_To_other = key;
    let actionvalue = key
    this.actionkey = false
    if (actionvalue == 'APPROVE' && this.applevel == 1 || actionvalue == 'MOVE TO OTHER') {
      this.amtapprove = false;
      this.actionapprove = true;
      this.actionreject = false;
      this.actionreturn = false;
      this.showreason = false;
      const myForm = this.expenceform;
      myForm.patchValue({
        "approval": undefined,
        "empbranchid": null,  
        "remarks": null,
        "action":actionvalue,
      });
    }
    else if (actionvalue == 'APPROVE' && this.applevel == 2) {
      if (this.approvedamt === 0) {  
        this.notification.showError(' Total Approved Amount cannot be 0') 
        return;
      }
      this.amtapprove = true;
      this.actionreject = false;
      this.actionreturn = false;
      this.actionapprove = false;
      this.showreason = true;
      const myForm = this.expenceform;
      myForm.patchValue({
        "action":actionvalue,
      });
    }
    else if (actionvalue == 'REJECT') {
      this.amtapprove = false;
      this.actionreject = true
      this.actionreturn = false;
      this.actionapprove = false;
      this.showreason = true;
    }
    else if (actionvalue == 'RETURN') {
      this.amtapprove = false;
      this.actionreturn = true;
      this.actionreject = false;
      this.actionapprove = false;
      this.showreason = true;
    }
  }
  getviewpdf() {
    this.taservice.getfetchimages(this.tourid)
      .subscribe((results) => {
        console.log("barcode", results)
        // let downloadUrl = results[0].url;
        let downloadUrl = "https://memo-project-assets-uat.s3.amazonaws.com/KVB2.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWA5L3SZ42JOYR5UT%2F20210909%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20210909T084811Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=07a8ffcf8508c8261317e22ed72f4219a904df774891e24dba86644a8bd24c47"
        this.viewpdfimageeee = window.open(downloadUrl, '_blank');
        console.log('barcode', downloadUrl)

      })
  }
  tourexpence_makerlist=[];
  tourexpence_applist=[];
  tour_makerlist=[];
  tour_app_list=[];
  total_filecount:any;
  tour_and_expence_filecount:any;

  getimages() {
    this.taservice.getfetchimages(this.tourid)
      .subscribe((results) => {
        // this.resultimage = results[0].url
        const file_ext = ['pdf', 'jpg', 'png', 'PDF', 'JPG', 'JPEG', 'jpeg', 'image']
        this.tourexpence_makerlist=results.tour_expense_maker;
        if(results.tour_expense_approver){
           this.tourexpence_applist=results.tour_expense_approver;
        }
        else if(results?.tour_expense_return){
          this.tourexpence_applist=results.tour_expense_return
        }
        else if(results?.Tour_Expense_reject){
          this.tourexpence_applist=results.Tour_Expense_reject
        }
        else if(results?.Tour_Expense_forward){
          this.tourexpence_applist=results.Tour_Expense_forward
        }
        else if(results?.Tour_Expense_create){
          this.tourexpence_applist=results.Tour_Expense_create
        }
        this.tour_makerlist=results.tour_maker;
        this.tour_app_list=results.tour_approver;
        this.attachmentlist = results;
        this.total_filecount=results.expense_file_count;
        this.tour_and_expence_filecount=results.expense_file_count+results.tour_file_count;
        // this.count = this.attachmentlist.length
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
      // this.file_window = window.open(this.pdfUrls, "_blank", 'width=600,height=400,left=200,top=200')
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

  fileDelete() {
    this.taservice.fileDelete(this.fileid)
      .subscribe((res) => {
        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.notification.showWarning("Duplicate! Code Or Name ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!...")
        }
        else {
          this.notification.showSuccess("Deleted Successfully")
          console.log("res", res)
          this.onSubmit.emit();
          return true
        }

      })
  }

  submitvaluecheck() {
    let values = this.expenceform.value;
    if (values.empbranchid && values.approval && values.appcomment && !this.invalidpermission) {
      return false;
    }
    else {
      return true
    }

  }
  getcall() {
    this.taservice.getfetchimages1(this.fileid)
      .subscribe((results) => {
        console.log("results", results)
      })
  }
  // onFileSelected(e) {

  //   this.images = e.target.files;
  //   this.totalcount = this.images.length;
  //   this.fileData = this.images;
  //   this.pdfimgview = this.fileData[0].name;
  //   this.attachmentlist=e.target.files;

  // }
  onFileSelected(evt: any) {
    const file = evt.target.files;

    for (var i = 0; i < file.length; i++) {
      if (this.file_length == 0) {
        this.list = new DataTransfer();
        this.list.items.add(file[i]);
        console.log("FIELS", file)
      }
      else {
        this.list.items.add(file[i]);
      }
      if (file[i]) {
        let stringValue = file[i].name.split('.')
        this.fileextension = stringValue.pop()
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
    console.log("fdddd", this.fileData)
    this.pdfimgview = this.fileData[0].name
    console.log("pdffff", this.pdfimgview)

  }

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


  deleteUpload(i) {
    this.base64textString.splice(i, 1);
    this.list.items.remove(i)
    this.totalcount = this.list.items.length;

    (<HTMLInputElement>document.getElementById('uploadFile')).files = this.list.files;
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
  comentscl() {
    if (this.tourmodell.comments != "") {
      this.isDisabled = false;
    }
    else {
      this.isDisabled = true;
    }

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
      })
  }
  getbranchValue() {
    this.taservice.getbranchValue()
      .subscribe(result => {
        this.branchlist = result['data']
        console.log("branchlist", this.branchlist)
      })
  }



  close_div(cls) {
    this.show_approvebtn = true;
    this.show_approvediv = false;
    this.show_rejectdiv = false;
    this.show_returndiv = false;
    this.show_forwarddiv = false;
    this.show_forwarderapprovediv = false;
    this.tourapprove.comments = '';
  }
  invoice_number:any
  pdfapuserdownload(){
    this.SpinnerService.show()
    this.invoice_number= 'TOUR'+this.id
    this.taservice.getAPUserpdf(this.invoice_number).subscribe(results => {
      if (results['type']=='application/pdf'){
      this.SpinnerService.hide()
      let fileurl = window.URL.createObjectURL(new Blob([results]))
      let link = document.createElement('a')
      link.href = fileurl
      link.download = `${this.invoice_number}.pdf`;
      link.click();
      }
      else{
        this.SpinnerService.hide()
        this.notification.showWarning('No File Found')

      }

    })

  }
  approve_service(data,file_data) {
    this.SpinnerService.show();
    // this.taservice.approvetourmaker(data,file_data)
    //   .subscribe(res => {
    //     if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
    //       this.SpinnerService.hide();
    //       this.reapprove=false
    //       this.notification.showWarning("Duplicate! Code Or Name ...")
    //     } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
    //       this.SpinnerService.hide()
    //       this.reapprove= false
    //       this.notification.showError("INVALID_DATA!...")
    //     }
    //     else if (res.status == 'success') {
    //       this.SpinnerService.hide()
    //       //Bug 7135 Fix ** Starts ** Developer: Hari ** Date:24/04/2023
    //       let actionvalue = this.expenceform.value.action
    //       if(actionvalue == 'APPROVE')
    //       this.notification.showSuccess("Approved Successfully")
    //       else if(actionvalue == 'MOVE TO OTHER')
    //       this.notification.showSuccess("Forwarded Successfully")
    //         //Bug 7135 Fix ** Ends **  Developer: Hari ** Date:24/04/2023
    //       this.data = { index: 2 }
    //       this.sharedService.summaryData.next(this.data)
    //       this.router.navigateByUrl('ta/ta_summary');
    //       this.onSubmit.emit();
    //       return true
    //     }
    //     else {
    //       this.SpinnerService.hide()
    //       this.reapprove=false;
    //       this.notification.showError(res.description)

    //     }

    //   })
     this.forwarded = this.shareservice?.expenseforwardkeyaccesss?.value;
    // let forwardkey = this.forwarded.validateobj_claim_status_id.value;
    // let forwardkey = this.forwarded.claim_status_id;

    this.taservice.approvetour_maker(data,file_data,this.forwarded,this.move_To_other )
      .subscribe(res => {
        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.SpinnerService.hide();
          this.reapprove=false
          this.notification.showWarning("Duplicate! Code Or Name ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.SpinnerService.hide()
          this.reapprove= false
          this.notification.showError("INVALID_DATA!...")
        }
        else if (res.status == 'success') {
          this.SpinnerService.hide()
          //Bug 7135 Fix ** Starts ** Developer: Hari ** Date:24/04/2023
          let actionvalue = this.expenceform.value.action
          if(actionvalue == 'APPROVE')
          this.notification.showSuccess("Approved Successfully")
          else if(actionvalue == 'MOVE TO OTHER')
          this.notification.showSuccess("Forwarded Successfully")
            //Bug 7135 Fix ** Ends **  Developer: Hari ** Date:24/04/2023
          this.data = { index: 2 }
          this.sharedService.summaryData.next(this.data)
          this.router.navigateByUrl('ta/ta_summary');
          this.onSubmit.emit();
          return true
        }
        else {
          this.SpinnerService.hide()
          this.reapprove=false;
          this.notification.showError(res.description)

        }

      })
  }

  reject_service(data) {
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
        else if (res.status == 'success') {
          this.SpinnerService.hide()
          this.notification.showSuccess("Rejected Successfully")
          this.data = { index: 2 }
          this.sharedService.summaryData.next(this.data)
          this.router.navigateByUrl('ta/ta_summary');
          this.onSubmit.emit();
          return true
        }
        else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)

        }
      })
  }
  return_service(data) {
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
          this.notification.showSuccess("Returned Successfully")
          this.data = { index: 2 }
          this.sharedService.summaryData.next(this.data)
          this.router.navigateByUrl('ta/ta_summary');
          this.onSubmit.emit();
          return true
        }
        else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)

        }
      })
  }

  approve_btn(btn) {
    this.appr_option = true;
    if (btn == 1) {
      this.show_approvebtn = false;
      this.show_approvediv = true;
      this.show_rejectdiv = false;
      this.show_returndiv = false;
      this.show_forwarddiv = false;
      this.show_forwarderapprovediv = false;
    }
    else if (btn == 2) {
      this.show_approvebtn = false;
      this.show_approvediv = false;
      this.show_rejectdiv = true;
      this.show_returndiv = false;
      this.show_forwarddiv = false;
      this.show_forwarderapprovediv = false;
    }
    else if (btn == 3) {
      this.show_approvebtn = false;
      this.show_approvediv = false;
      this.show_rejectdiv = false;
      this.show_returndiv = true;
      this.show_forwarddiv = false;
      this.show_forwarderapprovediv = false;
    }

    else if (btn == 4) {
      this.show_approvebtn = false;
      this.show_approvediv = false;
      this.show_rejectdiv = false;
      this.show_returndiv = false;
      this.show_forwarddiv = true;
      this.show_forwarderapprovediv = false;
    }

    else if (btn == 5) {
      this.show_approvebtn = false;
      this.show_approvediv = false;
      this.show_rejectdiv = false;
      this.show_returndiv = false;
      this.show_forwarddiv = false;
      this.show_forwarderapprovediv = true;
    }
  }
  selectBranch(e) {
    console.log("e", e.value)
    let branchvalue = e
    this.branchid = branchvalue
    this.expenceform.patchValue({
      "approval": undefined
    })

  }

  brclear() {
    let myform = this.expenceform
    myform.patchValue({
      "empbranchid": null,
      "approval": null
    })
    this.apvl = false;
    this.empbrid = false;
  }

  empclear() {
    this.expenceform.patchValue({
      approval: null
    })
    this.apvl = false;
  }

  brchange() {

    this.empbrid = true;
  }

  empchange() {

    this.apvl = true;
  }
  getadvanceapprovesumm(pageNumber = 1, pageSize = 10) {
    this.taservice.getapproveflowalllist(this.tourid,'')
      .subscribe(result => {
        console.log("Tourmaker", result)
        let datas = result['approve'];
        this.getAdvanceapproveList = datas;
        let mainelement = datas[datas.length - 1]
        this.approvedbyid = mainelement.id
        let lastbefore = datas[datas.length - 2]
        this.laststatus = mainelement.status
        if (this.applevel == 0 || this.invalidpermission) {
          this.reasonchange = mainelement.comment
        }

        if (this.loginid == lastbefore.approver_id && this.statusId == 3 && this.laststatus == 2) {
          this.changeapprover = true;
          this.actionapprove = true;
          this.returnreason = false;
          this.rejectreason = false;
        }
        else {
          this.changeapprover = false;
          this.returnreason = true;
          this.rejectreason = true;
        }

        if ((this.statusId == 3 || this.statusId == 4 || this.statusId == 5) && this.laststatus != 2) {
          this.invalidpermission = true;
        }
        else {
          this.invalidpermission = false;
        }

        if (this.loginid != mainelement.approver_id && this.loginid != lastbefore.approver_id && this.applevel == 2) {
          this.movetootherno = false;
        }
        // if (mainelement.applevel == 2 && lastbefore.applevel == 2 && this.applevel == 1) {
        //   this.invalidpermission = true;
        // 
      })
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
    }
  }
  getexpenseValue() {
    this.taservice.getexpenseTypeValue()
      .subscribe(result => {
        this.expencetypeList = result['data']
        console.log("expense", this.expencetypeList)
      })

  }
  datas: any
  addForm() {

    let result = this.tourrr;
    console.log("nn", result)
    let re = {
      "requestno": result.requestno,
      "expenseid": result.expencetypee,
      "requestercomment": result.comments
    }
    console.log("ddd", re)

    this.getclaimrequest.push(re);
    console.log("ss", this.getclaimrequest)
    this.datas = re
    let data = this.shareservice.dropdownvalue.next(this.datas)
    console.log("data", data)
    this.resetclick();
    // this.tourmodel.expencetype='';
    // this.tourmodel.comments='';
    // this.tourmodel.reset();  
  }

  resetclick() {
    this.tourmodell.expencetypee = '';
    this.tourmodell.comments = '';
  }
  Expensetypes(data) {
    this.types = data;
    this.expensetype = data.Expensetype
    console.log("expensetype", this.expensetype)
    console.log("types", this.types)
    if (this.types.Expensetype == 1) {
      this.router.navigateByUrl('ta/travel');
    }
    else if (this.types.Expensetype == 2) {
      this.router.navigateByUrl('ta/daily');
    }
    else if (this.types.Expensetype == 3) {
      this.router.navigateByUrl('ta/inci');
    }
    else if (this.types.Expensetype == 4) {
      this.router.navigateByUrl('ta/local')
    }
    else if (this.types.Expensetype == 5) {
      this.router.navigateByUrl('ta/lodge')
    }
    else if (this.types.Expensetype == 6) {
      this.router.navigateByUrl('ta/misc')
    }
    else if (this.types.Expensetype == 7) {
      this.router.navigateByUrl('ta/pack')
    }
    else if (this.types.Expensetype == 8) {
      this.router.navigateByUrl('ta/deput')
    }
    else if (this.types.Expensetype == 9){
      this.router.navigateByUrl('ta/iba-expense')
    }
  }


  removeSection1(i) {
    this.tourmodel.ccbs.splice(i, 1);


  }
  back() {
    this.onCancel.emit()
    this.data = { index: 6 }
    this.sharedService.summaryData.next(this.data)
    this.router.navigateByUrl('ta/ta_summary');
  }
  actionback(){
    this.actionapprove = false;
    this.actionkey = true;
  }

  getclaimrequestsumm() {
    this.SpinnerService.show();
    this.getERA(this.id,4,'0');
    this.taService.getclaimrequestsummary(this.tourid,'')
      .subscribe(result => {
        // console.log("claim .....", result)
        this.SpinnerService.hide();
        this.approvedamt = result.approved_amount
        this.eligibleamt = result.eligible_amount
        this.claimedamt = result.claimed_amount
        this.paper_type = result.paper_type

        let datas = result['data'];
        if (result.approver_branch_data) {
          let branchdetail = result.approver_branch_data
          const myform = this.expenceform
          this.remarks = result.approver_comment;
          this.crnno = result.crnno !== undefined ? result.crnno : ' ';
          myform.patchValue({
            "approval": branchdetail,
            "empbranchid": "(" + branchdetail.branch_code + ") " + branchdetail.branch_name,
          })
          if (this.applevel==0) {
            myform.patchValue({"appcomment": this.remarks})
          }
          this.branchid = branchdetail.branch_id
        }

        this.getclaimrequest = datas;
        console.log("Claim Request......", this.getclaimrequest)
        for (var i = 0; i < this.getclaimrequest.length; i++) {
          // this.tourid= this.getclaimrequest[i].tourid;
          this.expenceid = this.getclaimrequest[i].expenseid;
          console.log("Claim Request......", this.expenceid)
        }
        this.taservice.getadvanceEditsummary(this.id)
          .subscribe((result: any[]) => {
            this.advancelist = result['detail']
            this.advancelist = this.advancelist.filter(function (element) {
              return element.paid_advance_amount !== 0
            })
            this.sumadvance = 0;
            this.advancelist.forEach(element => {
              this.sumadvance += Number(element.paid_advance_amount)
            });
            this.sumadvance = result['total_paid_advance']
            if (this.sumadvance > 0){
              this.is_advance = true;
            } 
            console.log(this.advancelist);
            if (this.approvedamt < this.sumadvance) {
              this.netpay = this.sumadvance - this.approvedamt
            }
            // else if(this.sumadvance == 0){
            //   this.netpay =this.approvedamt
            // }
            else {
              this.netpay = this.approvedamt - this.sumadvance
            }
          })
        this.getimages()

        this.taservice.getclaimccbsEditview(this.id).subscribe(result => {
          this.ccbslist = result;
          console.log(this.ccbslist)
          const length = result.length
          // this.ccbslist =result;
          const myform = (this.expenceform.get('ccbs') as FormArray)
          for (var i = 1; i < length; i++) {
            myform.push(this.createccbs())
          }
          result?.forEach(element => {
            element.ccid = element.cc_data;
            element.bsid = element.bs_data;
          });
          const ccbsform = this.expenceform
          ccbsform?.patchValue({
            ccbs: result
          })
          if (length > 0) {
            if (this.statusId == 2 && this.applevel==2) {
              this.itemdisable = false;
            }
            else{
              (this.expenceform.get('ccbs') as FormArray).disable()
            }
          }
        })
      })
  }


  csview(subject) {
    return subject ? subject.name : undefined;
  }
  bsview(subject) {
    return subject ? subject.name : undefined;
  }

  ccbsupdate() {
    this.taservice.claimccbsupdate(this.id).subscribe(res => {
      console.log(res.description)
    })
  }

  expenseEdit(data) {
    this.data = data
    console.log("dd", this.data)
    var datas = JSON.stringify(Object.assign({}, data))
    localStorage.setItem("expense_edit", datas)

    this.shareservice.id.next(this.tourid)
    this.shareservice.expenseedit.next(this.data)
    if (this.data.expenseid == 1) {
      this.router.navigateByUrl('ta/travel');
    }
    else if (this.data.expenseid == 2) {
      this.router.navigateByUrl('ta/daily');
    }
    else if (this.data.expenseid == 3) {
      this.router.navigateByUrl('ta/inci');
    }
    else if (this.data.expenseid == 4) {
      this.router.navigateByUrl('ta/local')
    }
    else if (this.data.expenseid == 5) {
      this.router.navigateByUrl('ta/lodge')
    }
    else if (this.data.expenseid == 6) {
      this.router.navigateByUrl('ta/misc')
    }
    else if (this.data.expenseid == 7) {
      this.router.navigateByUrl('ta/pack')
    }
    else if (this.data.expenseid == 8) {
      this.router.navigateByUrl('ta/deput')
    }
    else if (this.data.expenseid == 9){
      this.router.navigateByUrl('ta/iba-expense')
    }
  }
  approvefirst() {
    const myform = this.expenceform.value;
    if (myform.empbranchid == null || myform.empbranchid == '') {
      this.notification.showError('Please Select Branch')
      return false
    }
    if (this.remarks == null || this.remarks == '') {
      this.notification.showError("Please Enter Remarks")
      return false;
    }

    if (myform.approval == null || myform.approval == '') {
      this.notification.showError('Please Select Approver')
      return false
    }
    if (!this.selectedFiles || this.selectedFiles == null){
      this.notification.showError('Please select the File');
      return false
    }

    if (this.changeapprover) {
      let payload = {
        "id": this.approvedbyid,
        "apptype": "claim",
        "tour_id": this.id,
        "comment": myform.appcomment,
        "approver": myform.approval.id
      }
      this.taservice.claimapproveupdate(payload).subscribe(results => {
        if (results.status == "success") {
          this.notification.showSuccess("Updated Successfully")
          this.data = { index: 2 }
          this.sharedService.summaryData.next(this.data)
          this.router.navigateByUrl('ta/ta_summary');
          this.onSubmit.emit();
          return true
        }
        else {
          this.notification.showError(results.description)
        }
      })
    }
    else {
      let payload = {
        "id": this.approvedbyid,
        "apptype": "claim",
        "tourgid": this.id,
        "appcomment": myform.appcomment,
        "status": "3",
        "approvedby": myform.approval.id
      }
      this.approve_service(payload,this.selectedFiles)
    }


  }

  reasonupdate(event) {
    this.reasonchange = event.target.value;
  }
  approveclaim() {
    if(this.applevel==2){
      if(this.selectedFiles){
        console.log(123);
      }
      // else{
      //   this.notification.showWarning("Please Select The File");
      //   return false;
      // }
    }
    if (this.reasonchange == null || this.reasonchange == '') {
      this.notification.showError("Please Enter Reason")
      return false;
    }
    let is_admin = 0
    if (this.shareservice.is_admin_approve.value) {
      is_admin = 1
    }
    let payload = {
      "id": this.approvedbyid,
      "apptype": "claim",
      "tourgid": this.id,
      "appcomment": this.reasonchange,
      "status": "3",
      "approvedby": 0,
      "app_empid":this.expenceform.value?.approval?.id,
      "paper_type": this.paper_type,
      "is_advance": this.is_advance,
      "is_admin": is_admin
    };
    console.log(payload);
    this.reapprove=true;
    this.approve_service(payload,this.selectedFiles);
  }

  returnclaim() {
    if (this.reasonchange == null || this.reasonchange == '') {
      this.notification.showError("Please Enter Reason")
      return false;
    }
    let payload = {
      "id": this.approvedbyid,
      "apptype": "claim",
      "appcomment": this.reasonchange,
      "tour_id": this.id
    }
    this.return_service(payload);
  }

  rejectclaim() {
    if (this.reasonchange == null || this.reasonchange == '') {
      this.notification.showError("Please Enter Reason")
      return false;
    }

    let payload = {
      "id": this.approvedbyid,
      "apptype": "claim",
      "appcomment": this.reasonchange,
      "tour_id": this.id
    }
    this.reject_service(payload)
  }
  getfilecount() {
    let count = this.totalcount? this.totalcount:0+ this.editcount?this.editcount:0
    return count
  }
  getTotall(marks) {
    // console.log("llll",marks)
    this.total1 = 0;

    marks.forEach((item) => {
      this.total1 += Number(item.claimedamount);
    });
    // total1 = this.formatPipe.transform(total1);

    return this.total1;


  }
  ccbsreadonly(status) {
    if (status.value.ccbs_edit_status == 0 || this.applevel == 1) {
      return true;
    }
    else {
      return false;
    }
  }
  checkind(ind) {
    (<FormArray>this.expenceform.get("ccbs")).at(ind).get('bsid').valueChanges
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
      });
    return true
  }
  bsidget() {
    setTimeout(() => {
      if (this.matbssidauto && this.autocompletetrigger && this.matbssidauto.panel) {
        fromEvent(this.matbssidauto.panel.nativeElement, 'scroll').pipe(
          map(x => this.matbssidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.matbssidauto.panel.nativeElement.scrollTop;
          const scrollHeight = this.matbssidauto.panel.nativeElement.scrollHeight;
          const elementHeight = this.matbssidauto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
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
  checkccind(ind) {
    (<FormArray>this.expenceform.get("ccbs")).at(ind).get('ccid').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.taservice.getcostcenterValue(value, this.bs))
      )
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.costlist = datas;
      });
    return true
  }
  ccbsbtn() {
    let sum = this.expenceform.value.ccbs.map(item => Number(item?.percentage))?.reduce((prev, next) => prev + next);
    return sum
  }
  ccbs_validation(ind, field = 'percentage') {
    const myForm = (<FormArray>this.expenceform.get('ccbs')).at(ind);
    // let value = evt.target.value;
    if (field == 'percentage') {
      if (this.ccbsbtn() > 100) {
        this.notification.showError('Please Enter Valid Percentage as Total Percentage can not be greater than 100');
        myForm.patchValue({
          percentage: null,
          amount: null
        });
      }
    }
    else {
      let sum = this.expenceform.value.ccbs.map(item => Number(item.amount)).reduce((prev, next) => prev + next);
      if (sum > this.ccbsamt) {
        this.notification.showError('Please Enter Valid Amount, as Total CCBS Amount can not be greater than ' + sum);
        myForm.patchValue({
          amount: null,
          percentage: null
        });
      }
    }

  }
  percen_calc(event, ind) {
    let value = (event.target.value / this.ccbsamt()) * 100;
    if (value > 0) {
      const myForm = (<FormArray>this.expenceform.get('ccbs')).at(ind);
      myForm.patchValue({
        percentage: value
      });
    }
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

            if (this.has_nextemp) {
              this.taservice.getbranchvalues(this.has_presentemp).subscribe(data => {
                let dts = data['data'];
                console.log('h--=', data);
                console.log("SS", dts)
                console.log("GGGgst", this.branchlist)
                let pagination = data['pagination'];
                this.branchlist = this.branchlist.concat(dts);

                if (this.branchlist.length > 0) {
                  this.has_nextemp = pagination.has_next;
                  this.has_previousemp = pagination.has_previous;
                  this.has_presentemp = pagination.index;

                }
              })
            }
          }
        })
      }
    })
  }
  aptypeid: any;
  getPaymode(ind) {
    this.payableSelected = false

    let text =""
    if(this.aptypeid == 7)
    {
      text ="cr"
    }
    this.taService.getallPaymode()
    .subscribe((results: any[]) => {
      let paymodedata = results["data"];
      this.PaymodeList = paymodedata;
      console.log("paymodelist",this.PaymodeList)
      this.PaymodeList = paymodedata.filter(pay => pay.code === 'PM004')
      this.getERA(this.id,this.PaymodeList,ind)

      const creditdtlsdatas = this.expenceform.value.creditdtl
      for (let i=0; i < creditdtlsdatas.length; i++) 
      {
        let paymodecode = creditdtlsdatas[i].paymode_id?.code
        let gl_flag = this.PaymodeList.filter(pay => pay.code === paymodecode)[0]?.gl_flag
        if (gl_flag === 'Payable' && ind !== i)
        {
          this.payableSelected = true
          break;
        }
        else
        {
          this.payableSelected = false
        }
      }
      if(this.aptypeid == 3 && ind == 0)
      {
        this.PaymodeList  =paymodedata.filter(pay => (this.payableSelected === false && pay.code === 'PM004')  )
      }
    
      else if(this.aptypeid == 4 && this.ppxid  == "E" && ind == 0)
      {
        this.PaymodeList  =paymodedata.filter(pay => (this.payableSelected === false && pay.code === 'PM004'))
      }
      // 
    })   
  }
  getCreditSections(form) {
    // console.log(form);
    return form.controls.creditdtl.controls;
  }
  paymodecode:any
  paymode_id:any
  creditids:any
  bank_id:any
  getERA(id,paymodeid,ind) {
    let tour_id=id
    let accno:''
    this.SpinnerService.show()
    this.taService.getcreditpaymodesummaryy(1,tour_id, paymodeid, accno)
        .subscribe(result => {
          this.SpinnerService.hide()
            if(paymodeid == '4'){
           
              this.ERAList = result.data
          
              if(this.ERAList?.length == 1)
              {
                
               let accdtls = this.ERAList[0]
               this.paymodecode = accdtls.paymode.code
               this.paymode_id= accdtls.paymode.id
               this.creditids = accdtls.bank.id
               this.bank_id= accdtls.bank.id


               this.expenceformview.get('creditdtl')['controls'][ind].get('paymode_id').setValue(accdtls?.paymode?.name)
               this.expenceformview.get('creditdtl')['controls'][ind].get('accno').setValue(accdtls?.account_number)
               this.expenceformview.get('creditdtl')['controls'][ind].get('refno').setValue(accdtls?.account_number)
               this.expenceformview.get('creditdtl')['controls'][ind].get('bank').setValue(accdtls?.bank?.name)
               this.expenceformview.get('creditdtl')['controls'][ind].get('branch').setValue(accdtls?.bankbranch?.name)
               this.expenceformview.get('creditdtl')['controls'][ind].get('ifsccode').setValue(accdtls?.bankbranch?.ifsccode)
               this.expenceformview.get('creditdtl')['controls'][ind].get('benificiary').setValue(accdtls?.beneficiary_name)
               this.expenceformview.get('creditdtl')['controls'][ind].get('glno').setValue(accdtls?.credit_details[ind]?.glno)
               this.expenceformview.get('creditdtl')['controls'][ind].get('amount').setValue(accdtls?.credit_details[ind]?.sum_of_approved_amount)
               this.cdtsum=accdtls?.credit_details[ind]?.sum_of_approved_amount
               console.log(this.expenceformview.get('creditdtl')['controls'])
              }
              if(this.ERAList?.length == 0){
                window.alert("Employee don't have an Account Number")
                return false
              }
            }
            else {
            this.toastr.warning("Employee don't have an Account Number and against era number are missing")
            }
          
        })
  }
    creditdetails(){
      let group=this.formBuilder.group({
        'paymode_id':new FormControl(),
        'accno':new FormControl(),
        'refno':new FormControl(),
        'bank':new FormControl(),
        'branch':new FormControl(),
        'ifsccode':new FormControl(),
        'benificiary':new FormControl(),
        'glno':new FormControl(),
        'amount':new FormControl(),


      })
      return group
    }
   addcreditSection(exceedAmt = 0, paymode = "") {    
  
    const control = <FormArray>this.expenceform.get('creditdtl');
    control.push(this.creditdetails());
    let creditDtl = this.expenceform.value.creditdtl

    let index = creditDtl.length-1
    // if(exceedAmt != 0)
    // {
     
    // } else if(paymode =="PM004")
    // {
      
    // this.getPaymode(index)
    this.getERA(this.id,4,index)
    
  }
  empScroll(){
    setTimeout(() => {
      if (
        this.empauto &&
        this.autocompletetrigger &&
        this.empauto.panel
      ) {
        fromEvent(this.empauto.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.empauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompletetrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.empauto.panel.nativeElement.scrollTop;
            const scrollHeight = this.empauto.panel.nativeElement.scrollHeight;
            const elementHeight = this.empauto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_empnext === true) {
                this.taservice.setemployeeValues(this.empinput.nativeElement.value,this.branchid,"",this.id, this.empcurrentpage + 1)
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
    onFiles_Selected(event:any):void{
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
submitccbs() {
  let sum_percent: number = 0;
  let amount: number = 0;
  this.not_reset=false;
  let percentlist = (this.expenceform.get('ccbs') as FormArray).value
  percentlist.forEach(element => {
    if (element.percentage < 0.1) {
      this.notification.showError("Plese Enter Valid Percentage")
      throw new Error
    }
    if (element.ccid == null || element.bsid == null) {
      this.notification.showError("Please Select CCBS")
      throw new Error
    }
    sum_percent = sum_percent + Number(element.percentage)
    amount = amount + Number(element.amount)
  });
  if (sum_percent == 100 && this.claimedamt == amount) {
    this.not_reset=true;
    this.closebutton.nativeElement.click();
    this.notification.showSuccess("CCBS Added Successfully....")
  }
  else {
    this.notification.showError("Please Check CCBS Percentage/Amount..")
    return false;
  }
}
createccbs() {
  let group = this.formBuilder.group({
    id: 0,
    bsid: null,
    ccid: null,
    amount: null,
    tourgid: this.id,
    percentage: null,
  });
  return group;
}
close(){
   
  if((this.statusId == 1 || this.statusId == -1) && this.not_reset==false){
    this.closebutton.nativeElement.click();
   (this.expenceform.get('ccbs') as FormArray).clear();
   (this.expenceform.get('ccbs') as FormArray).push(this.createccbs());
  }
  else{
  this.closebutton.nativeElement.click();
  // this.expenceform.reset()
}
}
getcostcenterValue() {
  this.taservice.getcostcenterValue('', this.bs)
    .subscribe(result => {
      this.costlist = result['data']
      console.log("costlist", this.costlist)
    })
}
getBS(id, ind) {
  this.bs = id
  const myForm = (<FormArray>this.expenceform.get("ccbs")).at(ind);
  myForm.patchValue({
    ccid: undefined
  });

  this.getcostcenterValue()
}
ccbsamt1() {
  return this.getclaimrequest.map(item => Number(item?.approvedamount))?.reduce((prev, next) => prev + next);
}
amount_calc(event, ind) {
  var value = (event.target.value / 100) * this.ccbsamt1();
  if (value > 0) {
    const myForm = (<FormArray>this.expenceform.get('ccbs')).at(ind);
    myForm.patchValue({
      amount: value
    });
  }
}
removeSection2(index, ccbs) {
  (<FormArray>this.expenceform.get('ccbs')).removeAt(index);
}
addccbs() {
  this.amt = this.ccbsamt1();

  if (this.amt == null || this.amt == 0) {
    this.notification.showError("Amount Can't be ZERO (0)")
    return false
  }

  var sum_percent: number = 0;
  let percentlist = (this.expenceform.get('ccbs') as FormArray).value
  percentlist.forEach(element => {
    if (element.ccbs_edit_status != 0 || element.ccbs_edit_status == 1 || element.ccbs_edit_status == null) {
      sum_percent = sum_percent + parseFloat(element.percentage);
    }
  });
  if (sum_percent < 100 && this.amt != null) {
    const datas = this.expenceform.get('ccbs') as FormArray;
    datas.push(this.createccbs())
  }
  else {
    this.notification.showError("Check CCBS Percentage or Amount...")
  }
  
}
getbusinesssegmentValue() {
  this.taservice.getbusinesssegmentValue('', 1)
    .subscribe(result => {
      this.bisinesslist = result['data']
      console.log("bisinesslist", this.bisinesslist)
    })
}
submitccbs1() {
  let formdata = JSON.parse(JSON.stringify(this.expenceform.value));
  let sum_percent: number = 0;
  let amount: number = 0;
   let compare_ccbs: [number, number][] = [];
  let percentlist = (this.expenceform.get('ccbs') as FormArray).value
  // let percentlist = 
  percentlist.forEach(element => {
    if (element.percentage < 0) {
      this.notification.showError("Percentage Can't be Zero")
      throw new Error
    }
    if (element.ccid == null || element.bsid == null) {
      this.notification.showError("Please select CCBS")
      throw new Error
    }
    sum_percent = sum_percent + Number(element.percentage)
    amount = amount + Number(element.amount)
    compare_ccbs.push([element.ccid,element.bsid])
  });
  let uniqueSet = new Set(compare_ccbs.map(item => JSON.stringify(item)));
  if ((compare_ccbs.length !== uniqueSet.size)){
    this.notification.showError("Don't Enter Same CC BS in Split CCBS")
    return false;
  }
  if (sum_percent == 100 && this.approvedamt == amount && amount != 0) {
    this.closebutton.nativeElement.click();
    this.submitForm()
  }
  else {
    this.notification.showError("Total Percentage Must be 100")
    return false;
  }
}
check_advance(){
  this.SpinnerService.show()
  let params = {"tour_id": this.tourid}
  this.taService.check_advance(params).subscribe(rep =>{
    this.SpinnerService.hide()
    if (rep.code === "UNEXPECTED_ERROR") {
      return
    }
    this.advance_list=rep
  })
}
submitForm() {
    
  this.SpinnerService.show()
  let formdata = JSON.parse(JSON.stringify(this.expenceform.value));
  // let formdata = this.expenceform.value;
  console.log('the submit ccbs formdata',formdata);
  let ccbsdata = formdata.ccbs
  let sum_percent: number = 0;
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
    sum_percent = sum_percent + Number(element.percentage)
    element.amount = Number(element.amount)
    amount = amount + Number(element.amount)
  });

  if (sum_percent != 100) {
    this.notification.showError("Check CCBS Percentage")
    return false;
  }
  if (this.approvedamt != amount) {
    this.notification.showError("Check CCBS Amount")
    return false
  }
 
  let apsubmit={
    
    'ccbs':ccbsdata
  }

  this.taService.Submit_ccbs_expence_ap(apsubmit)
.subscribe(res => {
  console.log("dailydeimres", res)
  this.SpinnerService.hide()
  if (res.message === "Successfully Created" && res.status === "success" || res.message === "Successfully Updated" && res.status === "success") {
    this.notification.showSuccess( res.message )
    return true;
  }
  else {
    this.notification.showError(res.description)
    return false;
  }
})
this.SpinnerService.hide();
      }
}