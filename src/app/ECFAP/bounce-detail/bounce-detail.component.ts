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
import { BouncedetailComponent } from 'src/app/ap/bouncedetail/bouncedetail.component';

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
  selector: 'app-bounce-detail',
  templateUrl: './bounce-detail.component.html',
  styleUrls: ['./bounce-detail.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
  ]
})
export class BounceDetailComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  ShowHeader: boolean;
  ShowInvoice: boolean;
  formbuilder : FormBuilder
  ecfheaderviewForm: FormGroup
  InvoiceHeaderForm: FormGroup
  frmInvHdr: FormGroup;
 
 
  TypeList: any
  SupptypeList: any
  isLoading: boolean;
  tomorrow = new Date()
  invheaderdata: any
  apheaderid: any
  invoiceheaderdetailForm: FormGroup
  bounceForm: FormGroup
  showhdrview = true
  showdtlview = false
  headertotalamt:any
  
  raisername:any
  raiserempname:any
 
  showheaderform:boolean = false
  searchData: any ={}
  crno: any;
  aptypeid: any;
  InvoiceDetailForm: FormGroup
  creditdetForm: FormGroup
  DebitDetailForm : FormGroup
  ccbsForm: FormGroup

  @ViewChild('closebutton') closebutton;
  @ViewChild('closebutton1') closebutton1;
  @ViewChild('closeglbutton') closeglbutton;
  @ViewChild('supclosebutton') supclosebutton;
  SubmitAPReauditForm:any;
  showgst = true
  @ViewChild('auditclose') auditclose;
  auditflage:boolean=false;
  dedupflage:boolean=false;

  hdrAuditFlag = [false, false,false,false,false];
  hdrDedupeFlag = [false, false,false,false,false];
 
  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]
  behalfyesorno = [{ 'value': true, 'display': 'Yes', "checked": true }, { 'value': false, 'display': 'No', "checked": false }]
  
  bounceData: any
  INVsum: any
  INVamt: any
  totalamount: any
  cdtsum: any
  paytoid: any
  
  invoicedetailsdata: any
  
  invtotamount: any
  showinvoicediv =true
  showdebitdiv=false
  showaccno = [false, false, false,false, false, false,false, false, false]
  showtranspay = [false, false, false,false, false, false,false, false, false]
  showtaxtype = [false, false, false,false, false, false,false, false, false]
  paymodecode=['','','','','','','','']
  showtaxtypes = [true, true, true,true, true, true,true, true, true]
  showtaxrates = [true, true, true,true, true, true,true, true, true]
  showtaxrate = [false, false, false,false, false, false,false, false, false]
 

  constructor(private router: Router, private notification: NotificationService, private fb: FormBuilder, private datePipe: DatePipe, private spinner: NgxSpinnerService,
              private service : EcfapService, private errorHandler : ErrorHandlingService, private shareservice:ShareService, private sanitizer: DomSanitizer,
              private toastr: ToastrService,private ecfservice:EcfService) { }

  ngOnInit(): void {
    this.ShowHeader = true
    this.apheaderid = this.shareservice.bounceapdata.value.apheader_id
    this.bounceData = this.shareservice.bounceapdata.value
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

    this.frmInvHdr=this.fb.group({
      rsrCode:new FormControl(''),
      rsrEmp:new FormControl(''),
      gst:new FormControl(''),
      branchGST:new FormControl(''),

      supCode:new FormControl(''),
      supName:new FormControl(''),
      supGST:new FormControl(''),
      status:new FormControl(''),

      invNo:new FormControl(''),
      invDate:new FormControl(''),
      taxableAmt:new FormControl(''),
      invAmt:new FormControl(''),
     
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
    this.InvoiceDetailForm = this.fb.group({
      roundoffamt :[''],     
      invoicedtls: new FormArray([
      ]),
      
      creditdtl: new FormArray([
      ])
    });

   
    this.creditdetForm = this.fb.group({
      supName:new FormControl(''),
      isexcempted:new FormControl(''),
      TDSSection: new FormControl(''),
      TDSRate: new FormControl(''),
      thresholdValue: new FormControl(''),
      amountPaid:new FormControl(''),
      normaltdsRate:new FormControl(''),
      balThroAmt: new FormControl(''),
      bankdetails_id:new FormControl(''),
    }),

    this.DebitDetailForm = this.fb.group({

      debitdtl: new FormArray([
      ])
    });

    this.ccbsForm = this.fb.group({

      ccbsdtl: new FormArray([
      ])
    })


    this.SubmitAPReauditForm = this.fb.group({
      remarks:['']
    })
    this.headerview()
    // this.batchSummarySearch(1)
  }

 
  apstatusname:any
  apstatusid:any
  ppxid: any
  raisergstnum:any
  checkhr:any
  originalinvoice :any
  headerview(){
    this.showheaderform = true
    this.spinner.show()
    this.invheaderdata = []
    this.service.getecfheader(this.apheaderid)
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
        this.crno = datas?.crno
        this.aptypeid = datas?.aptype_id
        if (this.aptypeid == 4) {
          this.ppxid = datas?.ppx_id?.id
        }
        if(datas?.is_originalinvoice == true){
          this.originalinvoice = "Yes"
        }else{
          this.originalinvoice = "No"
        }

        // let invhdrstatus = this.bounceData.apinvoicehdr_status
        // let bounceinvhdr = invhdrstatus.id == 11 ? invhdrstatus : undefined

        let invhdr =result["invoice_header"]
        for(let i=0; i < invhdr.length; i++)
        {
          if(invhdr[i].apinvoiceheaderstatus_id  == 11)
          {
            this.invheaderdata.push(invhdr[i])
          }
        }
       
         this.InvoiceHeaderForm.patchValue({
          invoicegst:this.invheaderdata[0]?.invoicegst
         })
      
        this.ecfheaderviewForm.patchValue({
          supplier_type: datas?.supplier_type,
          commodity_id: datas?.commodity_id?.name,
          ecftype: datas?.aptype,
          branch: datas?.branch?.name,
          // branch:datas.raiserbranch.name,
          ecfdate: this.datePipe.transform(datas?.apdate,'dd/MM/yyyy'),
          ecfamount: datas?.apamount,
          payto: datas?.payto,
          ppx: datas?.ppx,
          notename: datas?.notename,
          remark: datas?.remark,
          // client_code: datas?.client_code?.client_name,
          // rmcode: datas?.rmcode?.code + "-" + datas?.rmcode?.name,
          is_raisedby_self:datas?.is_raisedby_self,
          raised_by:datas?.raisername,
          raised_for:datas?.raisedby_dtls?.name,
          location:datas?.location?.location,
          is_originalinvoice:this.originalinvoice

        })

        if( this.invheaderdata?.length > 0){
        
          let totalamount =  this.invheaderdata.map(x => x.totalamount);
          this.headertotalamt = totalamount.reduce((a, b) => a + b, 0);        
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
  
  hdrBulkEnabled = false
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
      this.hdrBulkEnabled = true
    else
      this.hdrBulkEnabled = false
  }
  rem = new FormControl('', Validators.required)
  reaudit(bulk = false)
  {
    let datas = this.SubmitAPReauditForm.value.remarks
    if(datas == "" || datas == null || datas == undefined){
      this.notification.showError("Please Enter Remarks")
      return false;
    }
    if(bulk == true && this.hdrBulkEnabled==false )	
    {	
      this.toastr.error('Please select an invoice')	
      return false	
    }
    this.spinner.show()  
    
    if(bulk == true)
    {
      let hdrids = this.invheaderdata.map(x => x.id) 
      for(let i=0; i<hdrids.length; i++)
      {
        this.service.apReauditRej({ "apinvoiceheader_id":hdrids[i],"apinvoiceheaderstatus":12 , "remarks":this.SubmitAPReauditForm.value.remarks} )
        .subscribe(result => {
          console.log("result",result)
          if(result.status != "success")
          {          
            this.notification.showError(result?.message) 
            this.spinner.hide()           
            return false
          }
          else
          {
            if(i== hdrids.length-1)
            {
              this.notification.showSuccess("Saved Successfully!")
            this.onCancel.emit()
            // this.router.navigate(['ECFAP/ecfapsummary'])
            }
            
          }
        },
        error => {
          this.errorHandler.handleError(error);
          this.spinner.hide();
        }
      )
      }
    }
    else
    {  
      this.service.apReauditRej({ "apinvoiceheader_id":this.checkInvID,"apinvoiceheaderstatus":12 , "remarks":this.SubmitAPReauditForm.value.remarks} )
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
  
  }

  reject(bulk =false)
  {
    let datas = this.SubmitAPReauditForm.value.remarks
    if(datas == "" || datas == null || datas == undefined){
      this.notification.showError("Please Enter Remarks")
      return false;
    }
    if(bulk == true && this.hdrBulkEnabled==false )	
    {	
      this.toastr.error('Please Check Audit & Dedup CheckList.')	
      return false	
    }
    this.spinner.show()  
    
    if(bulk == true)
    {
      let hdrids = this.invheaderdata.map(x => x.id) 
      for(let i=0; i<hdrids.length; i++)
      {
        this.service.apReauditRej({ "apinvoiceheader_id":hdrids[i],"apinvoiceheaderstatus":10 , "remarks":this.SubmitAPReauditForm.value.remarks} )
        .subscribe(result => {
          console.log("result",result)
          if(result.status != "success")
          {          
            this.notification.showError(result?.message)
            this.spinner.hide()
            return false
          }
          else
          {
            if(i== hdrids.length-1)
            {
              this.notification.showSuccess("Saved Successfully!")
            this.onCancel.emit()
            this.spinner.hide()
            // this.router.navigate(['ECFAP/ecfapsummary'])
            }
            
          }
        },
        error => {
          this.errorHandler.handleError(error);
          this.spinner.hide();
        }
      )
      }
    }
    else
    {  
      this.service.apReauditRej({ "apinvoiceheader_id":this.checkInvID,"apinvoiceheaderstatus":10 , "remarks":this.SubmitAPReauditForm.value.remarks} )
        .subscribe(result => {
          console.log("result",result)
          this.spinner.hide()
          if(result.status != "success")
          {          
            this.notification.showError(result?.message)
            this.spinner.hide()
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
  }
  
  apinvhdrid: any
  invHdrRes: any;
  invDetailList: any;
  invCreditList: any;
  Roundoffamount:any;
  Movetodetail(i,dtl) {
    if(this.hdrDisable[i])
    {
      this.notification.showInfo("Please Check Audit and Dedupe.")
    }
    else
    {
      this.ShowHeader = false
      this.ShowInvoice =true
      this.apinvhdrid = dtl.id
      this.shareservice.invhdrstatus.next(dtl.apinvoiceheaderstatus_id ? dtl.apinvoiceheaderstatus : dtl.invoice_status)
      this.service.getInvHdr(this.apinvhdrid)
      .subscribe(result => {
        if(result.code == undefined){
          this.invHdrRes=result.data[0]
          
        this.frmInvHdr.patchValue(
          {
            rsrCode:this.invHdrRes.raisercode,
            rsrEmp:this.invHdrRes.raisername,
            supCode:this.invHdrRes.supplier_id?.code,
            supName:this.invHdrRes.supplier_id?.name,
            supGST:this.invHdrRes.suppliergst,
            status: this.shareservice.invhdrstatus.value,
            branchGST:this.invHdrRes?.branchdetails_id?.gstin,
            invNo:this.invHdrRes.invoiceno,
            invDate:this.datePipe.transform(this.invHdrRes.invoicedate,'dd-MMM-yyyy'),
            invAmt:this.invHdrRes.totalamount,
            taxableAmt:+this.invHdrRes.totalamount - +this.invHdrRes.taxamount,
            gst:this.invHdrRes.invoicegst == 'Y' ? 'Yes' : 'No',
          }
        )
        this.crno=this.invHdrRes.apinvoiceheader_crno
        this.Roundoffamount = this.invHdrRes.roundoffamt
        this.invDetailList =this.invHdrRes.invoicedetails.data
        this.paytoid = this.invHdrRes.payto_id
        if(this.paytoid == undefined || this.paytoid == "")
          this.paytoid = this.invHdrRes?.ppx
        if(this.aptypeid !=4)
        {
          this.invDetailList =this.invHdrRes.invoicedetails.data
          this.getinvoicedtlrecords();
          this.service.getDebitCredit(this.apinvhdrid, 0, 2)
          .subscribe(result => {
            if (result)
              {
                // this.creditres = result.data;
                let cred =result.data;
                this.invCreditList = cred.filter(x=> x.amount >= 0 && x.is_display =="YES")
                console.log("Invoice Credit Detail ",this.invCreditList);
                this.getcreditrecords(this.invCreditList);
                this.spinner.hide();
              }
            },error=>{
              console.log("Inv Credit Detail data not found")
              this.spinner.hide();
            }
          )            
          }
          else
          {
            this.invtotamount =this.invHdrRes.invoicedetails.data[0].amount
            this.invdtladdonid=this.invHdrRes.invoicedetails.data[0].id
            this.service.getDebitCredit(this.apinvhdrid, this.invdtladdonid, 1)
            .subscribe(result => {
            console.log("getInvdebit",result)
            if (result)
            {           
              this.spinner.hide();
              let data =result.data
            this.debitdata = data.filter(x => x.is_display == "YES" && x.amount >= 0)     
      
            this.getdebitrecords(this.debitdata)  
            }})

            this.service.getDebitCredit(this.apinvhdrid, 0, 2)
            .subscribe(result => {
            if (result)
              {
                this.spinner.hide(); 
                let cred =result.data;
                this.invCreditList = cred.filter(x=> x.amount >= 0 && x.is_display =="YES")
                console.log("Invoice Credit Detail ",this.invCreditList);
                if(this.invCreditList?.length > 0)
                  this.getcreditrecords(this.invCreditList);
              }},error=>{
                console.log("Inv Credit Detail data not found")
                this.spinner.hide();
              }
          )   

          }
        }
        else
        {
          console.log("Error while fetching Invoice Header.")
          this.spinner.hide();  
        }
  
      },error=>{
        console.log("Error while fetching Inv Header data")
        this.spinner.hide();  
      }            
      )

    }    
  }

  getinvoicedtlrecords() {
    let data = this.InvoiceDetailForm.get('invoicedtls') as FormArray
    data.clear()
      let datas=this.invDetailList
      this.totalamount = 0 
      let i=0
      
      for (let details of datas) {
        let apinvoiceheader_id: FormControl = new FormControl('');
        let id: FormControl = new FormControl('');
        let description: FormControl = new FormControl('');
        let productcode: FormControl = new FormControl('');
        let productname: FormControl = new FormControl('');
        let isrcm: FormControl = new FormControl('');
        let hsn: FormControl = new FormControl('');
        let hsn_percentage: FormControl = new FormControl('');
        let uom: FormControl = new FormControl('');
        let unitprice: FormControl = new FormControl(0);
        let quantity: FormControl = new FormControl(0);
        let amount: FormControl = new FormControl(0);
        let cgst: FormControl = new FormControl(0);
        let sgst: FormControl = new FormControl(0);
        let igst: FormControl = new FormControl(0);
        let discount: FormControl = new FormControl(0);
        let taxamount: FormControl = new FormControl(0);
        let totalamount: FormControl = new FormControl(0);
        let roundoffamt: FormControl = new FormControl('');
        let otheramount: FormControl = new FormControl(''); 
        let dtltotalamt: FormControl = new FormControl(0); 
        let is_rcmproduct: FormControl = new FormControl(''); 
            
        const invdetFormArray = this.InvoiceDetailForm.get("invoicedtls") as FormArray;
        apinvoiceheader_id.setValue(details.apinvoiceheader_id)
        id.setValue(details.id)
        productcode.setValue(details.productcode)
        is_rcmproduct.setValue(details.is_rcmproduct)
       
     
        productname.setValue(details.productname)
        isrcm.setValue(details.is_rcmproduct)
        description.setValue(details.description)
        if(details.hsn.code == "UNEXPECTED_ERROR")
        {
          hsn.setValue("")
          hsn_percentage.setValue("")  
          cgst.setValue(0)
          sgst.setValue(0)
          igst.setValue(0)   
          taxamount.setValue(0)  
        }
        else if(details.hsn?.Status == "Failed")
        {
          hsn.setValue("NO HSN")
          hsn_percentage.setValue(0) 
          cgst.setValue(0)
          sgst.setValue(0)
          igst.setValue(0)
          taxamount.setValue(0)
        }
        else
        {
          hsn.setValue(details.hsn.code)
          hsn_percentage.setValue(details.hsn_percentage) 
          let num = +details.cgst;
          let cgstt = new Intl.NumberFormat("en-GB").format(num); 
          cgstt = cgstt ? cgstt.toString() : '';
          cgst.setValue(cgstt)
  
          num = +details.sgst;
          let sgstt = new Intl.NumberFormat("en-GB").format(num); 
          sgstt = sgstt ? sgstt.toString() : '';
          sgst.setValue(sgstt)
  
          num = +details.igst;
          let igstt = new Intl.NumberFormat("en-GB").format(num); 
          igstt = igstt ? igstt.toString() : '';
          igst.setValue(igstt) 
  
          num = +details.taxamount;
          let tax = new Intl.NumberFormat("en-GB").format(num); 
          tax = tax ? tax.toString() : '';
          taxamount.setValue(tax)
        }
        uom.setValue(details.uom)
  
        let num: number = +details.unitprice;
        let up = new Intl.NumberFormat("en-GB").format(num); 
        up = up ? up.toString() : '';
        unitprice.setValue(up)
  
        num = +details.quantity;
        let qty = new Intl.NumberFormat("en-GB").format(num); 
        qty = qty ? qty.toString() : '';
        quantity.setValue(qty)
  
        num = +details.amount;
        let amt = new Intl.NumberFormat("en-GB").format(num); 
        amt = amt ? amt.toString() : '';
        amount.setValue(amt)
  
        num = +details.discount;
        let dis = new Intl.NumberFormat("en-GB").format(num); 
        dis = dis ? dis.toString() : '';
        discount.setValue(dis)
  
        num = +details.totalamount;
        let tot = new Intl.NumberFormat("en-GB").format(num); 
        tot = tot ? tot.toString() : '';
        totalamount.setValue(tot)
  
        roundoffamt.setValue(details.roundoffamt)
        otheramount.setValue(details.otheramount)
        
        this.totalamount += details.totalamount
  
        invdetFormArray.push(new FormGroup({
          id: id,
          productcode: productcode,
          productname: productname,
          isrcm: isrcm,
          description: description,
          hsn: hsn,
          hsn_percentage: hsn_percentage,
          uom: uom,
          unitprice: unitprice,
          quantity: quantity,
          amount: amount,
          cgst: cgst,
          sgst: sgst,
          igst: igst,
          discount: discount,
          taxamount: taxamount,
          totalamount: totalamount,
          roundoffamt:roundoffamt,
          otheramount:otheramount,
          is_rcmproduct : is_rcmproduct,
        }))
  
      
    i++;
    }
    this.INVdatasums();
    this.cdtsum = this.totalamount
    }
    Roundoffsamount: any
  INVdatasums() {
    this.INVamt = this.InvoiceDetailForm.value['invoicedtls'].map(x =>Number((String(x.totalamount).replace(/,/g, ''))));
    this.Roundoffsamount = Number(this.InvoiceDetailForm.value.roundoffamt)
    let INVsum =  (this.INVamt.reduce((a, b) => a + b,0));
    this.INVsum = INVsum+Number(this.Roundoffsamount)
    if(this.INVsum >0)
      this.totalamount = this.INVsum
  }
 

  getCreditSections(form) {
    return form.controls.creditdtl.controls;
  }
  getcreditrecords(datas) {
    let data = this.InvoiceDetailForm.get('creditdtl') as FormArray
    data.clear()
    let creditdet= datas;
    if(creditdet != undefined)
    {
      let i=0
      for (let data of creditdet) {
        let id: FormControl = new FormControl('');
        let paymode_id: FormControl = new FormControl('');
        let creditbank_id: FormControl = new FormControl('');
        let suppliertax_id: FormControl = new FormControl('');
    
        let refno: FormControl = new FormControl('');
        let suppliertaxtype: FormControl = new FormControl('');
        let suppliertaxrate: FormControl = new FormControl('');
        let taxexcempted: FormControl = new FormControl('');
    
        let amount: FormControl = new FormControl('');
        let taxableamount: FormControl = new FormControl('');
        let ddtranbranch: FormControl = new FormControl('');
        let credittotal: FormControl = new FormControl('');
        let ddpaybranch: FormControl = new FormControl('');
    
        let category_code: FormControl = new FormControl('');
        let subcategory_code: FormControl = new FormControl('');
        let bank: FormControl = new FormControl('');
        let branch: FormControl = new FormControl('');
        let ifsccode: FormControl = new FormControl('');
    
        let benificiary: FormControl = new FormControl('');
        let amountchange: FormControl = new FormControl('');
        let accno: FormControl = new FormControl('');
        let cc_code: FormControl = new FormControl('');
        let bs_code: FormControl = new FormControl('');
        let ccbspercentage: FormControl = new FormControl('');
        let glno: FormControl = new FormControl('');
        let entry_type: FormControl = new FormControl('2');
          
        const creditdetailformArray = this.InvoiceDetailForm.get("creditdtl") as FormArray;
    
        if(i==0)
        {
          
          this.creditdetForm.patchValue(
            {
            bankdetails_id : data.bankdetails? data.bankdetails : undefined  })
        }
        id.setValue(data.id)
        paymode_id.setValue(data.paymode.name)
       
        creditbank_id.setValue(data.creditbank_id)
        suppliertax_id.setValue(data.suppliertax_id)
        glno.setValue(data.glno)
    
        suppliertaxtype.setValue(data.suppliertaxtype)
        suppliertaxrate.setValue(data.suppliertaxrate)
        taxexcempted.setValue(data.taxexcempted)
    
        let num: number = +data.amount
        let amt = new Intl.NumberFormat("en-GB").format(num); 
        amt = amt ? amt.toString() : '';
        amount.setValue(amt)
        console.log("amount",amt)
    
        num = +data.taxableamount
        let taxbleamt = new Intl.NumberFormat("en-GB").format(num); 
        taxbleamt = taxbleamt ? taxbleamt.toString() : '';
        taxableamount.setValue(taxbleamt)
    
        ddtranbranch.setValue(data.ddtranbranch)
        ddpaybranch.setValue(data.ddpaybranch)
        category_code.setValue(data.category_code) 
        subcategory_code.setValue(data.subcategory_code)  
        bs_code.setValue(data.bs_code)  
        cc_code.setValue(data.cc_code)  
        accno.setValue(data?.refno)              
        refno.setValue(data?.refno) 

        if(data.paymode.name == "KVBAC")
        {
          accno.setValue(data?.refno)              
          refno.setValue(data?.refno) 
        }
        else
        {
          let accdet 
          if(this.paytoid == "S")
          {
            if(data?.supplierpayment_details  == null || data?.supplierpayment_details == undefined)
            {
              accno.setValue(data?.refno)   
              refno.setValue(data?.refno)   
              bank.setValue("")
              ifsccode.setValue("")
              branch.setValue("")
              benificiary.setValue("")
            }
            else if(data.supplierpayment_details.data?.length <1)
            {
              accno.setValue("")   
              refno.setValue("")   
              bank.setValue("")
              ifsccode.setValue("")
              branch.setValue("")
              benificiary.setValue("")
            }
            else
            {
              accdet = data.supplierpayment_details["data"][0] 
              accno.setValue(accdet?.account_no)              
              refno.setValue(accdet?.account_no)    
              bank.setValue(accdet?.bank_id?.name)              
              ifsccode.setValue(accdet?.branch_id?.ifsccode)
              branch.setValue(accdet?.branch_id?.name)
              benificiary.setValue(accdet?.beneficiary)
            }        
          }
          else if(this.paytoid == "E")
          {
            if(data?.employeeaccount_details  == null || data?.employeeaccount_details == undefined)
            {
              accno.setValue(data?.refno)    
              refno.setValue(data?.refno)   
              bank.setValue("") 
              ifsccode.setValue("")
              branch.setValue("")
              benificiary.setValue("")
            }
            else if(data?.employeeaccount_details.data?.length < 1)
            {
               accno.setValue("")  
              refno.setValue("")     
              bank.setValue("") 
              ifsccode.setValue("")
              branch.setValue("")
              benificiary.setValue("")
            }
            else
            { 
              accdet  = data.employeeaccount_details
              accno.setValue(accdet?.account_number)               
              refno.setValue(accdet?.account_number) 
              bank.setValue(accdet?.bank_name)              
              ifsccode.setValue(accdet?.bankbranch?.ifsccode)
              branch.setValue(accdet?.bankbranch?.name)
              benificiary.setValue(accdet?.beneficiary_name)
            }       
          }
        }
        // if (data.paymode.gl_flag == "Payable")
        // {
        //   if(data.paymode.name == "KVBAC")
        //   {
        //     accno.setValue(data?.refno)              
        //     refno.setValue(data?.refno) 
        //   }
        //   else
        //   {
        //     let accdet 
        //     if(this.paytoid == "S")
        //     {
        //       if(data?.supplierpayment_details  == null || data?.supplierpayment_details == undefined)
        //       {
        //         accno.setValue(data?.refno)   
        //         refno.setValue(data?.refno)   
        //         bank.setValue("")
        //         ifsccode.setValue("")
        //         branch.setValue("")
        //         benificiary.setValue("")
        //       }
        //       else if(data.supplierpayment_details.data?.length <1)
        //       {
        //         accno.setValue("")   
        //         refno.setValue("")   
        //         bank.setValue("")
        //         ifsccode.setValue("")
        //         branch.setValue("")
        //         benificiary.setValue("")
        //       }
        //       else
        //       {
        //         accdet = data.supplierpayment_details["data"][0] 
        //         accno.setValue(accdet?.account_no)              
        //         refno.setValue(accdet?.account_no)    
        //         bank.setValue(accdet?.bank_id?.name)              
        //         ifsccode.setValue(accdet?.branch_id?.ifsccode)
        //         branch.setValue(accdet?.branch_id?.name)
        //         benificiary.setValue(accdet?.beneficiary)
        //       }        
        //     }
        //     else if(this.paytoid == "E")
        //     {
        //       if(data?.employeeaccount_details  == null || data?.employeeaccount_details == undefined)
        //       {
        //         accno.setValue(data?.refno)    
        //         refno.setValue(data?.refno)   
        //         bank.setValue("") 
        //         ifsccode.setValue("")
        //         branch.setValue("")
        //         benificiary.setValue("")
        //       }
        //       else if(data?.employeeaccount_details.data?.length < 1)
        //       {
        //          accno.setValue("")  
        //         refno.setValue("")     
        //         bank.setValue("") 
        //         ifsccode.setValue("")
        //         branch.setValue("")
        //         benificiary.setValue("")
        //       }
        //       else
        //       { 
        //         accdet  = data.employeeaccount_details
        //         accno.setValue(accdet?.account_number)               
        //         refno.setValue(accdet?.account_number) 
        //         bank.setValue(accdet?.bank_name)              
        //         ifsccode.setValue(accdet?.bankbranch?.ifsccode)
        //         branch.setValue(accdet?.bankbranch?.name)
        //         benificiary.setValue(accdet?.beneficiary_name)
        //       }       
        //     }
        //   }
        // }
        // else
        // {
        //   if(data.glno != "151515" && data.glno != "151516" && data.glno != "151517" )  
        //   {
        //     num = +data.amount
        //     let amt = new Intl.NumberFormat("en-GB").format(num); 
        //     amt = amt ? amt.toString() : '';
        //     amountchange.setValue(amt)  
        //   }       
        // }
    
        credittotal.setValue(0)
       
        creditdetailformArray.push(new FormGroup({
          paymode_id: paymode_id,
          creditbank_id: creditbank_id,
          suppliertax_id: suppliertax_id,
          glno: glno,
    
          refno: refno,
          suppliertaxtype: suppliertaxtype,
          suppliertaxrate: suppliertaxrate,
          taxexcempted: taxexcempted,
          amount: amount,
    
          taxableamount: taxableamount,
          ddtranbranch: ddtranbranch,
          ddpaybranch: ddpaybranch,
          category_code: category_code,
          subcategory_code: subcategory_code,
          accno : accno,
    
          id: id,
          bank: bank,
          branch: branch,
          ifsccode: ifsccode,
          benificiary: benificiary,
    
          amountchange: amountchange,
          credittotal: credittotal,
          cc_code: cc_code,
          bs_code: bs_code,
          ccbspercentage: ccbspercentage,
          entry_type: entry_type,
        }))
       
        i++
      
      }  
    }
   
    this.creditdatasums()
  }
  
  creditdatasums() {
    let cdtamt = this.InvoiceDetailForm.value['creditdtl'].map(x => String(x.amount).replace(/,/g, ''));
    this.cdtsum = cdtamt.reduce((a, b) => Number(a) + Number(b), 0).toFixed(2);
    }

  bouncedetback()
  {
    this.ShowHeader = true
    this.ShowInvoice =false
  }
   
  overallback() {
    this.shareservice.comefrom.next("bounce")
    this.router.navigate(['ECFAP/ecfapsummary'], {skipLocationChange : true})
  }

  invdtladdonid: any
  debitsum: any
  invdtltaxableamount: any
  invdtloverallamount: any
  invdtltaxamount: any
  cgstval: any
  sgstval: any
  igstval: any
  gettaxrate: any
  debitdata : any[]
  adddebits(detail){
    this.invtotamount = String(detail.totalamount).replace(/,/g, '')
    this.service.getDebitCredit(this.apinvhdrid, detail.id, 1)
    .subscribe(result => {

    console.log("getInvdebit",result)
    if (result)
    {
    this.showinvoicediv=false
    this.showdebitdiv=true
    let data =result.data
    this.debitdata = data.filter(x => x.is_display == "YES" && x.amount >= 0)     
    console.log("debitdata",this.debitdata)
    this.getdebitrecords(this.debitdata)     
  }
  })
  }

  adddebit(section, data, index) {
    
    this.spinner.show();

    let datas = this.DebitDetailForm.get('debitdtl') as FormArray
    datas.clear()


    // console.log("debitsec", section)
    if (this.invoicedetailsdata != undefined) {
      let datas = this.invoicedetailsdata[index]
      this.invdtltaxableamount = this.invoicedetailsdata[index].amount
      this.invtotamount = String(this.invoicedetailsdata[index].totalamount).replace(/,/g, '')
      this.invdtltaxamount = this.invoicedetailsdata[index].taxamount
      this.cgstval = +String(this.invoicedetailsdata[index].cgst).replace(/,/g, '')
      this.sgstval = +String(this.invoicedetailsdata[index].sgst).replace(/,/g, '')
      this.igstval = +String(this.invoicedetailsdata[index].igst).replace(/,/g, '')
      this.gettaxrate = this.cgstval + this.sgstval + this.igstval
      this.invdtladdonid = datas.id
    }
    else {
      let sections = section.value
      this.invdtltaxableamount = sections.amount
      this.invtotamount = String(sections.totalamount).replace(/,/g, '')
      this.invdtltaxamount = sections.taxamount
      this.cgstval = +String(sections.cgst).replace(/,/g, '')
      this.sgstval = +String(sections.sgst).replace(/,/g, '')
      this.igstval = +String(sections.igst).replace(/,/g, '')
      this.gettaxrate = this.cgstval + this.sgstval + this.igstval
      this.invdtladdonid = sections.id
    }
    this.service.getDebitCredit(this.apinvhdrid, this.invdtladdonid, 1)
    .subscribe(result => {

    console.log("getInvdebit",result)
    if (result)
    {
    this.showinvoicediv=false
    this.showdebitdiv=true
    let data =result.data
    this.debitdata = data.filter(x => x.is_display == "YES" && x.amount >= 0)     

    this.getdebitrecords(this.debitdata)     
  }
  })

    this.spinner.hide();
  }

  getdebitrecords(datas) {
    console.log(datas)
    for (let debit of datas) {  
      let id: FormControl = new FormControl('');
      let apinvoicedetail_id: FormControl = new FormControl('');
      let category_code: FormControl = new FormControl('');
      let subcategory_code: FormControl = new FormControl('');
      let glno: FormControl = new FormControl('');
      // let bsproduct_code: FormControl = new FormControl('');
      // let bsproduct_code_id: FormControl = new FormControl('');
      let amt: FormControl = new FormControl('');
      let amount: FormControl = new FormControl('');
      let deductionamount: FormControl = new FormControl(0);
      let bs_code: FormControl = new FormControl('');
      let cc_code: FormControl = new FormControl('');
      let ccbspercentage: FormControl = new FormControl('');
      let taxableamount: FormControl = new FormControl(0);  
      let entry_type: FormControl = new FormControl('1');
      let paymode_id: FormControl = new FormControl('8');
      const debitFormArray = this.DebitDetailForm.get("debitdtl") as FormArray;  

      id.setValue(debit.id)
      apinvoicedetail_id.setValue(debit.apinvoicedetail_id)
      let code = (debit.category_code?.code ? debit.category_code?.code : "").toLowerCase().trim()
      let subcode = (debit.subcategory_code?.code ? debit.subcategory_code?.code : "").toLowerCase().trim()
      if(code == null || code == "dummy" || code.indexOf("unexpected error") >= 0 || code.indexOf("unexpected_error") >= 0 || code.indexOf("invalid_data") >= 0)
      {
        category_code.setValue("")   
        glno.setValue("")         
      }
      else
      {
        category_code.setValue(debit.category_code.code)    
        glno.setValue(debit.glno)
      }
      
      if(subcode == "dummy" || subcode.indexOf("unexpected error") >= 0 || subcode.indexOf("unexpected_error") >= 0 || subcode.indexOf("invalid_data") >= 0)
      {
        subcategory_code.setValue("")  
        glno.setValue("")      
      }
      else
      {
        subcategory_code.setValue(debit.subcategory_code.code)  
        glno.setValue(debit.glno) 
      }
 
      bs_code.setValue(debit.bs_code.name)   
      cc_code.setValue(debit.cc_code.name)   
      if(debit.category_code.code =="GST")
        ccbspercentage.setValue(100)  
      else
        ccbspercentage.setValue(debit.ccbspercentage) 
      let num: number = +debit.amount;
      if(+debit.amount == this.invdtltaxableamount )
        ccbspercentage.setValue(100)  
      let dbtamt = new Intl.NumberFormat("en-GB").format(num); 
      dbtamt = dbtamt ? dbtamt.toString() : '';
      amt.setValue(dbtamt)
      amount.setValue(dbtamt)
      deductionamount.setValue(debit.deductionamount)
      let debtax =Number((this.cgstval +this.sgstval + this.igstval)/2)
     
     
      debitFormArray.push(new FormGroup({
        id: id,
        apinvoicedetail_id: apinvoicedetail_id,
        category_code: category_code,
        subcategory_code: subcategory_code,
        glno: glno,
        amt: amt,
        amount: amount,
        deductionamount: deductionamount,
        bs_code : bs_code,
        cc_code: cc_code,
        ccbspercentage: ccbspercentage,
        taxableamount: taxableamount,
        entry_type : entry_type,
        paymode_id : paymode_id,
       }))

      this.debitdatasums();      
    }
  }
  getDebitSections(form) {

    return form.controls.debitdtl.controls;
  }

  debitClose()
  {
      this.showinvoicediv=true
      this.showdebitdiv=false

      let debitcontrol = this.DebitDetailForm.controls["debitdtl"] as FormArray;
      debitcontrol.clear()
  }
  dbtamt: any
  dbtsum: any=0

  debitdatasums() {
    this.dbtamt = this.DebitDetailForm.value['debitdtl'].map(x => String(x.amount).replace(/,/g, ''));
    this.dbtsum = this.dbtamt.reduce((a, b) =>(Number(a) + Number(b)), 0);

    this.debitsum = this.dbtsum.toFixed(2);
  }

  debitbacks() {
    this.debitClose() 
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
        this.jpgUrlsAPI = this.imageUrl + "ecfserv/ecffile/" + id + "?token=" + token;
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
  getbouncedchecklist(i, id,date)
  {
    this.checkInvID = id
    this.checkinvdate =this.datePipe.transform(date, 'yyyy-MM-dd')
    this.hdrAuditFlag[i]=true;
    this.service.getBouncedChecklist(this.checkInvID).subscribe(data=>{
      this.checklist=data['data'];
      for(let i=0;i<this.checklist.length;i++){
        this.checklist[i]['value']=data['data'][i].value.id == 1 ? true : false;;       
      }
      console.log('check=',data);
  })
  this.enableHdrSelect(i);
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
    this.service.getInwDedupeChk(this.checkInvID,this.dedupeChkType[0],1)    .subscribe(result => {
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
  this.service.getInwDedupeChk(this.checkInvID,this.dedupeChkType[3],1)
  .subscribe(result => {
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
  this.service.getInwDedupeChk(this.checkInvID,this.dedupeChkType[4],1)
    .subscribe(result => {
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
    this.enableHdrSelect(i);
}

hdrDisable =[true, true, true, true, true]
enableHdrSelect(i)
{
  if(this.hdrAuditFlag[i] == true && this.hdrDedupeFlag[i] == true)
    this.hdrDisable[i] = false
}

auditcheck:any=[];
  
submitted(){
  this.auditcheck =[]

  for(let i=0;i<this.checklist.length;i++){
    if(this.checklist[i]['clk']){
      let dear:any={
        'ecfauditchecklist_id':this.checklist[i]['ecfauditchecklist_id'],
        'apinvoiceheader_id':this.checkInvID,
        'value':this.checklist[i]['value']
      };
      this.auditcheck.push(dear)
       }
  }  let obj={
    'auditchecklist':this.auditcheck
  }
  console.log('obj', obj);
  this.service.audiokservie(obj).subscribe(data=>{
    this.notification.showSuccess(data['status'])
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
  
 bounce()
 {
  this.cli=true;
  this.remark=this.rem.value;
  console.log("Hai",this.remark)
  let bouio:any={
    "status_id":"10",
    "invoicedate":this.checkinvdate,
    "remarks":this.remark.toString()
};
let obj={
  'auditchecklist':this.auditcheck
}
 this.service.audiokservie(obj).subscribe(data=>{
   console.log(data)
    if(data['status']=="success"){
    this.notification.showSuccess(data['message']);

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
  //  nextClick() {
  //   if (this.has_next === true) {
  //   this.presentpage=this.presentpage+1;
  //      this.getdedup();
  //   }
  // }
  
}