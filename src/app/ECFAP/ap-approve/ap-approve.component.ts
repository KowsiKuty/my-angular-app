import { Component, OnInit, Output, EventEmitter, ViewChild  } from '@angular/core';
import { DatePipe, formatDate } from "@angular/common";
import {FormGroup, FormControl, FormBuilder, Validators, FormArray} from "@angular/forms";
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from "../../service/notification.service";
import { EcfapService } from '../ecfap.service';
import { ErrorHandlingService } from '../error-handling.service';
import { ShareService } from '../share.service';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { EcfService } from 'src/app/ECF/ecf.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router'; 
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
  selector: 'app-ap-approve',
  templateUrl: './ap-approve.component.html',
  styleUrls: ['./ap-approve.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
  ]
})
export class ApApproveComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
 formbuilder : FormBuilder
  batchSearchForm : FormGroup
  showBatchSummary = false
  showBatchView = true


  batchForm : FormGroup
  has_bviewpagenext = true;
  has_bviewpageprevious = true;
  isbatchviewpage: boolean = true;
  bvpresentpage: number = 1;
  pagesizebview = 10;
  
  ecfheaderviewForm: FormGroup
  InvoiceHeaderForm: FormGroup
 
  TypeList: any
  SupptypeList: any
  isLoading: boolean;
  tomorrow = new Date()
  invheaderdata: any
  ecfheaderid: any
  invoiceheaderdetailForm: FormGroup
  SubmitApproverForm: FormGroup
  SubmitBatchForm: FormGroup
  showhdrview = true
  showdtlview = false
  headertotalamt:any
  
  raisername:any
  raiserempname:any
 
  showheaderform:boolean = false
  searchData: any ={}

  @ViewChild('closebutton') closebutton;
  @ViewChild('closebutton1') closebutton1;
  @ViewChild('closeglbutton') closeglbutton;
  @ViewChild('supclosebutton') supclosebutton;
  SubmitAPApproverForm:any;
  showgst = true
  @ViewChild('auditclose') auditclose;
  auditflage:boolean=false;
  dedupflage:boolean=false;
  batchno:any;
  batchdates:any;
  batchcount:any;
  batchamount:any;
  ecfraisername:any;
  ecfapprovername:any;
  ecfbranchname:any;
  @Output() onView = new EventEmitter<any>();

  hdrAuditFlag = [false, false,false,false,false];
  hdrDedupeFlag = [false, false,false,false,false];
  batchviewdatas:any
  ecfviewdatas:any
 
  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]
  behalfyesorno = [{ 'value': true, 'display': 'Yes', "checked": true }, { 'value': false, 'display': 'No', "checked": false }]
  
  constructor(private router: Router, private notification: NotificationService, private fb: FormBuilder, private datePipe: DatePipe, private spinner: NgxSpinnerService,
              private service : EcfapService, private errorHandler : ErrorHandlingService, private shareservice:ShareService, private sanitizer: DomSanitizer,
              private toastr: ToastrService,private ecfservice:EcfService,private activatedroute : ActivatedRoute) { }

  ngOnInit(): void {
    let batchviewdatas = this.shareservice.batchviewdatas.value
    this.batchviewdatas = batchviewdatas
    console.log(batchviewdatas)
    this.ecfviewdatas = this.shareservice.ecfwiseApprove.value
    this.batchno = batchviewdatas?.batchno
    this.batchdates = batchviewdatas?.batch_date
    this.batchamount = batchviewdatas?.batchamount
    this.batchcount = batchviewdatas?.batchcount
    this.ecfraisername = batchviewdatas?.raisername
    this.ecfapprovername = batchviewdatas?.approvername
    this.ecfbranchname = batchviewdatas?.branchname

    console.log("batchviewdatas",batchviewdatas)
    this.batchSearchForm = this.fb.group({
      batchno:[''],
      fromdate: [''],
      todate: [''],
      batchcount: [''],
      batchstatus: [''],
    })

    this.batchForm = this.fb.group({
      batchno:[''],
      batchdate: [''],
      batchamt: [''],
    })

    this.ecfheaderviewForm = this.fb.group({
      supplier_type: [''],
      commodity_id: [''],
      ecftype: [''],
      branch: [''],
      ecfdate: [''],
      ecfamount: [''],
      ppx: [''],
      notename: [''],
      remark: [''],
      payto: [''],
      client_code: [''],
      rmcode: [''],
      is_raisedby_self:[''],
      raised_by:[''],
      raised_for:[''],
      location:[''],
      is_originalinvoice:[''],
      inwarddetails_id:['']

     
    })


    this.InvoiceHeaderForm = this.fb.group({
      branch_id: [''],
      invtotalamt: [''],
      ecfheader_id: [''],
      dedupinvoiceno: [''],
      suppliergst: [''],
      raisorbranchgst: [''],
      invoicegst: [''],

      
    })

    this.SubmitAPApproverForm = this.fb.group({
      remarks:['']
    })
    if(batchviewdatas != '')
    {
      this.showbatchviewview(batchviewdatas)
      this.viewbatches()     
    }
    else if(this.ecfviewdatas != '')
    {
      this.headerview(this.ecfviewdatas)
    }
    // this.batchSummarySearch(1)

    // this.activatedroute.queryParams.subscribe(
    //   params => {
    //     if(params)
    //     {
    //       if(params.comefrom == "invoicedetail")
    //       {
    //         let batchdata =this.shareservice.approveBatchData.value
    //         let ind = this.shareservice.approveViewIndex.value
    //         this.headerview(batchdata,ind)
    //       }
    //     }
    //   })
  }

  batchSummary: any
  getbatchtotalcount: any
  isbatchsummarypage: boolean
  has_batchpageprevious= false
  has_batchpagenext= false
  batchpresentpage:any
  pagesizebatch = 10;
 
  batchdate : any
  batchamt: any
  batchSummarySearch(pageNumber = 1)
  { 
    if(this.batchSearchForm){
      let search=this.batchSearchForm.value
      if((search.fromdate !== null && search.fromdate !== '')  ){
        var fromDate=this.datePipe.transform(search.fromdate, 'yyyy-MM-dd')
        this.searchData.fromdate=fromDate
      }
      else
      {
        this.searchData.fromdate=""
      }
      if((search.todate !== null && search.todate !== '')  ){
        var toDate=this.datePipe.transform(search.todate, 'yyyy-MM-dd')
        this.searchData.todate=toDate
      }
      else
      {
        this.searchData.todate=""
      }
      this.searchData.batchcount = search.batchcount ? search.batchcount : "";
      this.searchData.batchno = search.batchno ? search.batchno : "";
      this.searchData.batchstatus = search.batchstatus ? search.batchstatus : "";
   
      }

    this.spinner.show()
    let data = this.batchSearchForm.value
    this.service.approvedbatchSearch(this.searchData, pageNumber)
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.batchSummary = result['data']
          let datapagination = result["pagination"];
          this.getbatchtotalcount = datapagination?.count
          if (this.batchSummary.length === 0) {
            this.isbatchsummarypage = false
          }
          if (this.batchSummary.length > 0) {
            this.has_batchpagenext = datapagination.has_next;
            this.has_batchpageprevious = datapagination.has_previous;
            this.batchpresentpage = datapagination.index;
            this.isbatchsummarypage = true
          }
          this.spinner.hide()
        } else {
          this.notification.showError(result?.description)
          this.spinner.hide()
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.spinner.hide();
        }

      )
  }

  nextClickbatch() {
    if (this.has_batchpagenext === true) {
      this.batchSummary(this.batchpresentpage + 1)
    }
  }

  previousClickbatch() {
    if (this.has_batchpageprevious === true) {
      this.batchSummary(this.batchpresentpage - 1)
    }
  }

  resetbatch()
  {
    this.batchSearchForm.controls['batchno'].reset(),
    this.batchSearchForm.controls['fromdate'].reset(),
    this.batchSearchForm.controls['todate'].reset(),
    this.batchSearchForm.controls['batchcount'].reset(),
    this.batchSummarySearch(1);
  }

  batchEdit(data)
  {
    this.shareservice.ecfheaderedit.next(data?.id)
    this.router.navigate(['ECFAP/createecf'])
  }

  batchView(data)
  {
    this.showBatchSummary= false
    this.showBatchView =true
    this.showbatchviewview(data)
  }

  batchviewid:any
  batchviewlist : any
  showbatchviewview(data,pageNumber = 1) {
    console.log("dataaaaaaa",data)
    this.batchviewid = data
    this.service.batchview(data.id,pageNumber)
    .subscribe(result=>{
      console.log("viewresult",result)
      this.batchviewlist = result['data']
      let datapagination = result["pagination"];
   
      if (this.batchviewlist?.length === 0) {
        this.isbatchviewpage = false
      }
      if (this.batchviewlist?.length > 0) {
        this.batchForm.patchValue({
          batchno : data.batchno, 
          batchdate : this.datePipe.transform(data.batch_date, 'dd-MMM-yyyy'),
          batchamt : data.batchamount
        })

        let ecf_app =this.batchviewlist[0]?.ECF_Approver
        // let flag = this.batchSummary[0]?.apstatus_id
        // if(ecf_app && ( flag != 3 && flag !=4) )
        //   this.ECF_Approver = true
        // else
        //   this.ECF_Approver = false
        this.has_bviewpagenext = datapagination.has_next;
        this.has_bviewpageprevious = datapagination.has_previous;
        this.bvpresentpage = datapagination.index;
        this.isbatchviewpage = true
      }
    })
  }

  nextClickbview() {
    if (this.has_bviewpagenext === true) {
     this.showbatchviewview( this.batchviewid ,this.bvpresentpage + 1)
    }
  }

  previousClickbview() {
    if (this.has_bviewpageprevious === true) {
     this.showbatchviewview( this.batchviewid ,this.bvpresentpage - 1)
    }
  }
  apstatusname:any
  apstatusid:any
  viewcrno:any
  viewindex:any
  headerview(data,ind =0){
    this.showBatchView = false
    this.showheaderform = true
    this.ecfheaderid = data.id
    this.apstatusname = data.apstatus
    this.apstatusid = data.apstatus_id
    this.viewcrno = data.crno
    this.viewindex = ind
    this.getinvoicedetails()
  }

  ecftypeid: any
  ppxid: any
  raisergstnum:any
  checkhr:any
  originalinvoice :any
  getinvoicedetails() {
    this.spinner.show()
    
    this.service.getecfheader(this.ecfheaderid)
      .subscribe(result => {
        console.log("result",result)
        this.spinner.hide()
        if(result?.id != undefined){
        let datas = result
        // if(datas?.apstatus == "APPROVED"){
        //   this.notification.showInfo("This Claim is Already Approved")
        // }
        // if(datas?.apstatus == "REJECT"){
        //   this.notification.showInfo("This Claim is Already Rejected")
        // }
        if(datas?.aptype_id == 3 || datas?.aptype_id == 13){
          this.raisername = datas?.raisername?.name
        }else{
        this.raisername = datas?.raisername
        }
        this.raiserempname = datas?.raisername?.name
        this.raisergstnum = datas?.raiserbranchgst
        this.checkhr = datas?.is_onbehalfoff_hr
        this.ecftypeid = datas?.aptype_id
        if (this.ecftypeid == 4) {
          this.ppxid = datas?.ppx_id?.id
        }
        if(datas?.is_originalinvoice == true){
          this.originalinvoice = "Yes"
        }else{
          this.originalinvoice = "No"
        }

        this.invheaderdata = result["invoice_header"]

         this.InvoiceHeaderForm.patchValue({
          invoicegst:this.invheaderdata[0]?.invoicegst
         })
      
        this.ecfheaderviewForm.patchValue({
          supplier_type: datas?.supplier_type,
          commodity_id: datas?.commodity_id?.name,
          ecftype: datas?.aptype,
          branch: datas?.branch?.name,
          // branch:datas.raiserbranch.name,
          ecfdate: this.datePipe.transform(datas?.apdate,'dd-MMM-yyyy'),
          ecfamount: datas?.apamount,
          payto: datas?.payto,
          ppx: datas?.ppx,
          notename: datas?.notename,
          remark: datas?.remark,
          // client_code: datas?.client_code?.client_name,
          // rmcode: datas?.rmcode?.code + "-" + datas?.rmcode?.name,
          is_raisedby_self:datas?.is_raisedby_self,
          raised_by:datas?.raisername?.name,
          raised_for:datas?.raisedby_dtls?.name,
          location:datas?.location?.location,
          is_originalinvoice:this.originalinvoice,
          inwarddetails_id : datas?.inwarddetails_id

        })

        if( this.invheaderdata?.length > 0){
        
          let totalamount =  this.invheaderdata.map(x => x.totalamount);
          this.headertotalamt = totalamount.reduce((a, b) => a + b, 0);
        
        // ----
       
      }
      
    }else{
      this.notification.showError(result?.description)
      this.spinner.hide()
      return false
    }
      },
      error => {
        this.errorHandler.handleError(error);
        this.spinner.hide();
      }

    
      )
  }

  config: any = {
    airMode: false,
    tabDisable: true,
    popover: {
      table: [
        ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
        ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
      ],
      link: [['link', ['linkDialogShow', 'unlink']]],
      air: [
        [
          'font',
          [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'superscript',
            'subscript',
            'clear',
          ],
        ],
      ],
    },
    height: '200px',
    // uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
      [
        'font',
        [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'superscript',
          'subscript',
          'clear',
        ],
      ],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']],
    ],
    codeviewFilter: true,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true,
  };


  editorDisabled = false;

  get sanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.ecfheaderviewForm.get('html').value);
  }


  enableEditor() {
    this.editorDisabled = false;
  }

  disableEditor() {
    this.editorDisabled = true;
  }

  onBlur() {
    // console.log('Blur');
  }

  onDelete(file) {
    // console.log('Delete file', file.url);
  }

  summernoteInit(event) {
    // console.log(event);
  }
  onFileSelected(e) { }
  
  hdrApproveEnabled = false
  hdrselFlag: any =[false,false,false,false,false,false,false,false,false,false]
  hdrselect(e,i)
  {
    if(! this.hdrselFlag[i] && ! this.hdrSelectable[i])
    {
      this.toastr.error('Please Check Audit & Dedup CheckList.')	
      this.hdrselFlag[i] =false
      return false
    }
    else
    {
      if(e.checked == true)
      {
        this.hdrselFlag[i] =true
      }
      else
      {
        this.hdrselFlag[i] =false
      }
      let flag = true
      for(let x=0; x<this.invheaderdata.length; x++)
      {
        if(this.hdrselFlag[x] == false)
          flag = false
      }
  
      if(flag)
        this.hdrApproveEnabled = true
      else
        this.hdrApproveEnabled = false
    }   
  }

  approverem = new FormControl('', Validators.required)
  hdrApprove()
  {
    let datas = this.SubmitAPApproverForm.value.remarks
    if(datas == "" || datas == null || datas == undefined){
      this.notification.showError("Please Enter Remarks")
      return false;
    }
    if(this.hdrApproveEnabled==false )	
    {	
      this.toastr.error('Please Check Audit & Dedup CheckList.')	
      return false	
    }
    this.spinner.show()  
    
    let hdrids = this.invheaderdata.map(x => x.id) 
    this.service.apApproveRej({ "apinvhdrid_list":hdrids,"apinvoiceheaderstatus":9 , "remarks":this.SubmitAPApproverForm.value.remarks} )
      .subscribe(result => {
        console.log("result",result)
        this.spinner.hide()
        if(result.status != "success")
        {          
          this.notification.showError(result?.message)
          return false
        }
        else
        {
          this.notification.showSuccess("Approved Successfully!")
          this.getinvoicedetails()
          this.showBatchView = true
          this.showbatchviewview(this.batchviewdatas)
          this.showheaderform = false
          // this.onCancel.emit()
          // this.router.navigate(['ECFAP/ecfapsummary'])
        }
      },
      error => {
        this.errorHandler.handleError(error);
        this.spinner.hide();
      }
    )
  }

  hdrReject()
  {
    let datas = this.SubmitAPApproverForm.value.remarks
    if(datas == "" || datas == null || datas == undefined){
      this.notification.showError("Please Enter Remarks")
      return false;
    }
    this.spinner.show()  
    
    let hdrids = this.invheaderdata.map(x => x.id) 
    this.service.apApproveRej({ "apinvhdrid_list":hdrids,"apinvoiceheaderstatus":10,"remarks": this.SubmitAPApproverForm.value.remarks} )
      .subscribe(result => {
        console.log("result",result)
        this.spinner.hide()
        if(result.status != "success")
        {          
          this.notification.showError(result?.message)
          return false
        }
        else
        {
          this.notification.showSuccess("Rejected Successfully!")
          this.getinvoicedetails()
          this.showBatchView = true
          this.showbatchviewview(this.batchviewdatas)
          this.showheaderform = false
          // this.onCancel.emit()
          // this.router.navigate(['ECFAP/ecfapsummary'])
        }
      },
      error => {
        this.errorHandler.handleError(error);
        this.spinner.hide();
      }
    )
  }
  Movetodetail(i,dtl) {
    // this.shareservice.invheaderid.next(dtl?.id)
    // this.shareservice.invheaderstatus.next(dtl.apinvoiceheaderstatus)
    // this.router.navigate(['ECFAP/invdetApproval'], {queryParams : {comefrom : "apapprove"}})

    if((dtl.apinvoiceheaderstatus_id == 1 || dtl.apinvoiceheaderstatus_id == 3 || dtl.apinvoiceheaderstatus_id == 12) && !this.hdrSelectable[i])
    {
      this.notification.showInfo("Please check Audit and Dedupe.")
    
      // this.router.navigate(['ECFAP/invdetApproval'])
      // this.router.navigate(['ECFAP/invdetApproval'], {queryParams : {comefrom : "apapprove"}})
    }
    else
    {
      this.shareservice.invheaderid.next(dtl?.id)
      this.shareservice.invhdrstatus_id.next(dtl.apinvoiceheaderstatus_id)
      this.shareservice.invhdrstatus.next(dtl.apinvoiceheaderstatus_id ? dtl.apinvoiceheaderstatus : dtl.invoice_status)
      this.onView.emit()
    }
   
  }
  back() {
    if(this.batchviewdatas != '')
    {
      this.showbatchviewview(this.batchviewdatas)
      this.viewbatches()     
    }
    else if(this.ecfviewdatas != '')
    {
      this.onCancel.emit()
    }
   
  }

  imageUrl = environment.apiURL
  tokenValues: any
  showimageHeaderAPI: boolean
  showimagepdf: boolean
  pdfurl: any
  jpgUrlsAPI: any

  data(datas) {
    let id = datas?.file_id
    let filename = datas?.file_name
    // this.ecfservice.downloadfile(id)




    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = filename.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg"||
    stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {

        this.showimageHeaderAPI = true
        this.showimagepdf = false
        this.jpgUrlsAPI = this.imageUrl + "ecfserv/fileview/" + id + "?token=" + token;
      }
      if (stringValue[1] === "pdf"|| stringValue[1] === "PDF") {
        this.showimagepdf = true
        this.showimageHeaderAPI = false
        this.service.downloadfile(id)
          .subscribe((data) => {
            let binaryData = [];
            binaryData.push(data)
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            let link = document.createElement('a');
            link.href = downloadUrl;
            this.pdfurl = downloadUrl
          }, (error) => {
            this.errorHandler.handleError(error);
            this.showimagepdf = false
            this.showimageHeaderAPI = false
            this.spinner.hide();
          })
      }
      if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt"||
      stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT") {
        this.showimagepdf = false
        this.showimageHeaderAPI = false
      }
  
  
  
  
      }

  getfiles(data) {
    this.spinner.show()
    this.service.filesdownload(data?.file_id)
      .subscribe((results) => {

        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = data.file_name;
        link.click();
        this.spinner.hide()
      },
      error => {
        this.errorHandler.handleError(error);
        this.spinner.hide();
      }
      )
  }
  checkInvID : any
  checkinvdate : any
  checklist:any;
  getquestion(i, id,date)
  {
    this.checkInvID = id
    this.checkinvdate =this.datePipe.transform(date, 'yyyy-MM-dd')
    this.hdrAuditFlag[i]=true;
    this.service.getBouncedChecklist(this.checkInvID).subscribe(data=>{
      this.checklist=data['data'];
      for(let i=0;i<this.checklist.length;i++){
        this.checklist[i]['clk']=data['data'][i].value.id == 1 ? true : false;     
        this.checklist[i]['value']=data['data'][i].value.id       
      }
      console.log('check=',data);
    if(this.checklist == undefined || this.checklist == null || this.checklist == "" || this.checklist?.length == 0)
    { 
      this.service.getAuditChecklist(this.ecftypeid).subscribe(data=>{
      this.checklist=data['data'];
      for(let i=0;i<this.checklist.length;i++){
        this.checklist[i]['clk']=true;
        this.checklist[i]['value']=1;       
      }
      console.log('check=',data);
    })
    }
  }) 
  if(this.hdrAuditFlag[i] == true && this.hdrDedupeFlag[i] == true)
    this.hdrSelectable[i] = true
  }


dedupeChkType=['exact',
        'supplier',
        'invoice_amount',
        'invoiceno',
        'invoice_date']

  exactList: any;
  withoutSuppList: any;
  withoutInvAmtList: any;
  withoutInvNoList: any;
  withoutInvDtList: any;

  presentpage: number = 1;
  identificationSize: number = 10;
  
  //Dedup
getdedup(i, id)
{
  this.checkInvID = id
  
  this.hdrDedupeFlag[i]=true;
    //dedupe for type(exact)
    this.service.getInwDedupeChk(this.checkInvID,this.dedupeChkType[0],1)
    .subscribe(result => {
      this.exactList = result['data']
      console.log("exactList",this.exactList)
  
      // let dataPagination = result['pagination'];
      // if (this.exactList.length >= 0) {
      //   this.has_next = dataPagination.has_next;
      //   this.has_previous = dataPagination.has_previous;
      //   this.presentpage = dataPagination.index;
      //   this.isSummaryPagination = true;
      // } if (this.exactList <= 0) {
      //   this.isSummaryPagination = false;
      // }        
    },error=>{
      console.log("No data found")
    }            
    )
  //dedupe for type(WITHOUT_SUPPLIER)
  this.service.getInwDedupeChk(this.checkInvID,this.dedupeChkType[1],1)
  .subscribe(result => {
    this.withoutSuppList = result['data']
    console.log("WITHOUT_SUPPLIER List",this.withoutSuppList)
    // let dataPagination = result['pagination'];
    // if (this.exactList.length >= 0) {
    //   this.has_next = dataPagination.has_next;
    //   this.has_previous = dataPagination.has_previous;
    //   this.presentpage = dataPagination.index;
    //   this.isSummaryPagination = true;
    // } if (this.exactList <= 0) {
    //   this.isSummaryPagination = false;
    // }        
  },error=>{
    console.log("No data found")
  }            
  )
  
  //dedupe for type(WITHOUT_INVOICE_AMOUNT)
  this.service.getInwDedupeChk(this.checkInvID,this.dedupeChkType[2],1)
    .subscribe(result => {
      this.withoutInvAmtList = result['data']
      console.log("WITHOUT_INVOICE_AMOUNT List",this.withoutInvAmtList)
      // let dataPagination = result['pagination'];
      // if (this.exactList.length >= 0) {
      //   this.has_next = dataPagination.has_next;
      //   this.has_previous = dataPagination.has_previous;
      //   this.presentpage = dataPagination.index;
      //   this.isSummaryPagination = true;
      // } if (this.exactList <= 0) {
      //   this.isSummaryPagination = false;
      // }        
    },error=>{
      console.log("No data found")
    }             
    )
  
    //dedupe for type(WITHOUT_INVOICE_NUMBER)
    this.service.getInwDedupeChk(this.checkInvID,this.dedupeChkType[3],1)  .subscribe(result => {
    this.withoutInvNoList = result['data']
    console.log("WITHOUT_INVOICE_NUMBER List",this.withoutInvNoList)
  //   let dataPagination = result['pagination'];
  //   if (this.exactList.length >= 0) {
  //     this.has_next = dataPagination.has_next;
  //     this.has_previous = dataPagination.has_previous;
  //     this.presentpage = dataPagination.index;
  //     this.isSummaryPagination = true;
  //   } if (this.exactList <= 0) {
  //    this.isSummaryPagination = false;
  //   }        
  },error=>{
    console.log("No data found")
  }            
  )
  
  //dedupe for type(WITHOUT_INVOICE_DATE)
  this.service.getInwDedupeChk(this.checkInvID,this.dedupeChkType[4],1)    .subscribe(result => {
      this.withoutInvDtList = result['data']
      console.log("WITHOUT_INVOICE_DATE List",this.withoutInvDtList)
      // let dataPagination = result['pagination'];
      // if (this.exactList.length >= 0) {
      //   this.has_next = dataPagination.has_next;
      //   this.has_previous = dataPagination.has_previous;
      //   this.presentpage = dataPagination.index;
      //   this.isSummaryPagination = true;
      // } if (this.exactList <= 0) {
      //   this.isSummaryPagination = false;
      // }        
    },error=>{
      console.log("No data found")
    }            
    )
    this.spinner.hide();
    if(this.hdrAuditFlag[i] == true && this.hdrDedupeFlag[i] == true)
     this.hdrSelectable[i] = true
}

hdrSelectable =[false, false, false, false, false]
enableHdrSelect(i)
{
  
}

auditcheck:any=[];
  
submitted(){
  this.auditcheck =[]

  this.spinner.show()
    for(let i=0;i<this.checklist.length;i++){
    if(this.checklist[i]['clk']){
      let dear:any={
        'ecfauditchecklist_id':this.checklist[i]['id'],
        'apinvoiceheader_id':this.checkInvID,
        'value':this.checklist[i]['value']
      };
      this.auditcheck.push(dear)
       }
  }  let obj={
    'auditchecklist':this.auditcheck
  }
  console.log('obj', obj);
  
  this.service.audiokservie(obj).subscribe(result=>{
    console.log("result",result)
    this.spinner.hide()
    if(result.status != "Success")
    {          
      this.notification.showError(result?.message)
      return false
    }
    else
    {
      this.notification.showSuccess("Saved Successfully!")
    }
    },
   (error)=>{
   alert(error.status+error.statusText);
    }
  )
  this.auditclose.nativeElement.click();
}

ok(i:any,dt)
{
  let val=1;
  let dear:any={
    "ecfauditchecklist_id":dt.id,
    "apinvoiceheader_id":this.checkInvID,
    "value":val}; 
  console.log(dear)
  console.log("check bounce",dear)
  for(let i=0;i<this.auditcheck.length;i++){
   if(this.auditcheck[i].ecfauditchecklist_id==dt.id ){
     this.auditcheck.splice(i,1)
   }
  }
this.auditcheck.push(dear)
  console.log("bo",this.auditcheck)
 }
 notok(i:any,dt)
 {
  this.checklist[i]['clk'] = false
   let d=2;
    let dear:any={
    "ecfauditchecklist_id":dt.id,
    "apinvoiceheader_id":this.checkInvID,
    "value":d};  
   console.log("check bounce",dear)
   for(let i=0;i<this.auditcheck.length;i++){
    if(this.auditcheck[i].ecfauditchecklist_id==dt.id ){
      this.auditcheck.splice(i,1)
    }
   }
this.auditcheck.push(dear)
console.log("bo",this.auditcheck)
}
 nap(i:any,dt)
 {
 let d=3
let dear:any={
    "ecfauditchecklist_id":dt.id,
    "apinvoiceheader_id":this.checkInvID,
    "value":d};
    console.log("check bounce",dear)
    for(let i=0;i<this.auditcheck.length;i++){
     if(this.auditcheck[i].ecfauditchecklist_id==dt.id ){
       this.auditcheck.splice(i,1)
     }
    }
 this.auditcheck.push(dear)
 console.log("bo",this.auditcheck)
 }

  cli:boolean=false;
  remark:any;
  rem = new FormControl('', Validators.required);

 bounce()
 {
  this.cli=true;
  this.auditcheck =[]
  for(let i =0; i<this.checklist.length; i++)
  {
    let dear:any={
      "ecfauditchecklist_id":this.checklist[i].id,
      "apinvoiceheader_id":this.checkInvID,
      "value":this.checklist[i]['clk'] == true ? 1 : 2};
      
  this.auditcheck.push(dear)
  }
  this.remark=this.rem.value;
  let bouio:any={
    "status_id":"11",
    "invoicedate":this.checkinvdate,
    "remarks":this.remark.toString()
};
let obj={
  'auditchecklist':this.auditcheck
}
 this.service.audiokservie(obj).subscribe(data=>{
   console.log(data)
    if(data['status']=="Success"){
    this.notification.showSuccess(data?.message);

    }
  }
 )

 this.service.bounce(this.checkInvID,bouio).subscribe(data=>{
  console.log(data)
 }
)
 console.log("check bounce",obj)
 this.auditclose.nativeElement.click();
 }


 disables(){
  for(let i=0;i<this.auditcheck.length;i++)
   {
    if(this.auditcheck[i].value==2){
      return true;
      
    }
  }
}
batchviewnewlist :any
viewbatches(){
  this.service.batchviewwithoutpage(this.batchviewdatas?.id)
  .subscribe(result=>{
    this.batchviewnewlist = result['data']
  })
}
  //  nextClick() {
  //   if (this.has_next === true) {
  //   this.presentpage=this.presentpage+1;
  //      this.getdedup();
  //   }
  // }

  movetonext(){
    this.showBatchView = false
    this.showheaderform = true
    let datas = this.batchviewnewlist
    this.viewindex += 1
    this.ecfheaderid = datas[this.viewindex].id
    this.apstatusname = datas[this.viewindex].apstatus
    this.apstatusid = datas[this.viewindex].apstatus_id
    this.viewcrno = datas[this.viewindex].crno
    this.getinvoicedetails()
  }

  movetoprevious(){
    this.showBatchView = false
    this.showheaderform = true
    let datas = this.batchviewnewlist
    this.viewindex -= 1
    this.ecfheaderid = datas[this.viewindex].id
    this.apstatusname = datas[this.viewindex].apstatus
    this.apstatusid = datas[this.viewindex].apstatus_id
    this.viewcrno = datas[this.viewindex].crno
    this.getinvoicedetails()
  }

modify(){
    window.confirm('Are you sure to modify the invoice? \n Note : Once Modified you cant able to Approve')
    if(confirm){
      localStorage.setItem("ecf_id",this.ecfheaderid)
      this.shareservice.editkey.next('modification')
      this.shareservice.ecfheaderedit.next(this.ecfheaderid)
      this.shareservice.modificationFlag.next('modification')
      this.onSubmit.emit()
      // this.router.navigate(['ECFAP/createecf'])
    }
  }
  viewtrnlist:any=[];
viewtrn(i,id)
{
  this.viewtrnlist=[];
  this.spinner.show()
  this.service.getViewTrans(id,1).subscribe(data=>{
    this.viewtrnlist=data['data'];
    this.spinner.hide()
  })
}
name:any;
designation:any
branch:any;
view(dt){
  this.name=dt.from_user.name + ' - ' + dt.from_user.code
  this.designation=dt.from_user.designation
  this.branch=dt.from_user_branch.name + ' - ' + dt.from_user_branch.code
 }
 viewto(dt)
{
  this.name=dt.to_user.name + ' - ' + dt.to_user.code
  this.designation=dt.to_user.designation
  this.branch=dt.to_user_branch.name + ' - ' + dt.to_user_branch.code
} 
  
}
