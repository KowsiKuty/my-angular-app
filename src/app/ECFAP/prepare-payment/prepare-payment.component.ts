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
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { EcfService } from 'src/app/ECF/ecf.service';


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
  selector: 'app-prepare-payment',
  templateUrl: './prepare-payment.component.html',
  styleUrls: ['./prepare-payment.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
  ]
})
export class PreparePaymentComponent implements OnInit {

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
  @ViewChild('auditclose') auditclose;

  showgst = true
 
  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]
  behalfyesorno = [{ 'value': true, 'display': 'Yes', "checked": true }, { 'value': false, 'display': 'No', "checked": false }]
  auditflage:boolean=false;
  dedupflage:boolean=false;

  hdrAuditFlag = [false, false,false,false,false];
  hdrDedupeFlag = [false, false,false,false,false];
  constructor(private router: Router, private notification: NotificationService, private fb: FormBuilder, private datePipe: DatePipe, private spinner: NgxSpinnerService,public datepipe: DatePipe,
              private service : EcfapService, private errorHandler : ErrorHandlingService, private shareservice:ShareService, private sanitizer: DomSanitizer,private toastr: ToastrService,
              private ecfservice:EcfService) { }

  ngOnInit(): void {
    let batchviewdatas = this.shareservice.batchviewdatas.value
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
    this.showbatchviewview(batchviewdatas)
    // this.batchSummarySearch()
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
  apstatusid:any
 
  headerview(data){
    this.showheaderform = true
    this.ecfheaderid = data.id
    this.apstatusid = data.apstatus_id
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
        if(datas?.apstatus == "APPROVED"){
          this.notification.showInfo("This Claim is Already Approved")
        }
        if(datas?.apstatus == "REJECT"){
          this.notification.showInfo("This Claim is Already Rejected")
        }
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

  getpayment(i)
  {
    if(this.invheaderdata[i].apinvoiceheaderstatus_id ==9)
      return true
    else
      return false
  }
 
  rem = new FormControl('', Validators.required);

  preparePay()
  {
    this.spinner.show()  
    let hdrids = this.invheaderdata.map(x => x.id) 
    for(let i=0; i<hdrids.length;i++)
    {
      this.service.getDebitCredit(hdrids[i], 0, 2)
        .subscribe(result => {
          console.log("Credit result", hdrids[i], "-> " , result)
          if (result.code == undefined)
            {
              let data = result.data
              let creditres = data.filter(x => x.is_display=="YES" && x.paymode_id == 5)

              let paymentData ={
                                "paymentheader_date" :this.datepipe.transform(new Date(), 'yyyy-MM-dd'),
                                "paymentheader_amount":creditres[0].amount,
                                "paymode":"NEFT",
                                "bankdetails_id":  1,   //creditres.debit_bankdetails.id,
                                "beneficiaryname":creditres[0].supplierpayment_details["data"][0].beneficiary,
                                "bankname":creditres[0].supplierpayment_details["data"][0].bank_id?.name,
                                "ifsc_code":creditres[0].supplierpayment_details["data"][0].branch_id?.ifsccode,
                                "accno":creditres[0].supplierpayment_details["data"][0].account_no,
                                "debitbankacc":creditres[0].supplierpayment_details["data"][0].account_no,
                                "remarks":this.rem.value,
                                "payment_dtls":[{"apinvhdr_id":hdrids[i],"apcredit_id":creditres[0].id,"paymntdtls_amt":creditres[0].amount}]
              }

              this.service.preparePayment(paymentData)
              .subscribe(result => {
              console.log("result",result)
              this.spinner.hide()
              if(result.status != undefined)
              {          
                this.notification.showError(result?.message)
                return false
              }
              else
              {
                this.notification.showSuccess("Saved Successfully!")
                this.onCancel.emit()
                // this.router.navigate(['ECFAP/ecfapsummary'])
              }
             },
             error => {
              this.errorHandler.handleError(error);
              this.spinner.hide();
              }
            )
            }
                  
            
            })
    }
  }
  back() {
    this.onCancel.emit()
    // this.router.navigate(['ECFAP/ecfapsummary'])
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
    this.ecfservice.filesdownload(data?.file_id)
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
  Movetodetail(dtl) {
    console.log(dtl)
    this.shareservice.invheaderid.next(dtl?.id)
    this.shareservice.invhdrstatus_id.next(dtl.apinvoiceheaderstatus_id)
    this.router.navigate(['ECFAP/invdetApproval'], {queryParams : {comefrom : "preparepay"}})
   
  }
}