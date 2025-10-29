import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, FormControlDirective,Validators } from '@angular/forms';
import { EcfapService } from '../ecfap.service';
import { ShareService } from '../share.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe, DecimalPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { ErrorhandlingService } from 'src/app/ppr/errorhandling.service';

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
  selector: 'app-inv-detail-approve',
  templateUrl: './inv-detail-approve.component.html',
  styleUrls: ['./inv-detail-approve.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe, DecimalPipe
  ]
})
export class InvDetailApproveComponent implements OnInit {
  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]
 
  frmInvHdr: FormGroup;
  invoiceheaderdetailForm: FormGroup
  InvoiceDetailForm: FormGroup

  creditdetForm: FormGroup
  DebitDetailForm: FormGroup
  ccbsForm: FormGroup
  apinvHeader_id= this.shareservice.invheaderid.value;
  crno = this.shareservice.crno.value;
  showinvoicediv =true
  showdebitdiv=false

  invHdrRes:any;
  invtotamount: any
  
  invDetailList:any;
  invDebitList:any;
  invDebitTot:number;
  invCreditList:any;
  invCreditTot:number;
  getgstapplicable: any
  gstAppl :boolean
  aptypeid: any
  paytoid: any
  INVsum: any
  INVamt: any
  totalamount: any
  cdtsum: any
  showaccno = [false, false, false,false, false, false,false, false, false]
  showtranspay = [false, false, false,false, false, false,false, false, false]
  showtaxtype = [false, false, false,false, false, false,false, false, false]
  paymodecode=['','','','','','','','']
  invoicedetailsdata: any
  showtaxtypes = [true, true, true,true, true, true,true, true, true]
  showtaxrates = [true, true, true,true, true, true,true, true, true]
  showtaxrate = [false, false, false,false, false, false,false, false, false]
  SubmitAPApproverForm:any;
  @Output() onCancel = new EventEmitter<any>();
  invoiceheaderstatus:any;
  comefrom =""
  @Output() onSubmit = new EventEmitter<any>();
  
  constructor(  private formBuilder: FormBuilder,private service: EcfapService, private router: Router,  private spinner:NgxSpinnerService, private shareservice: ShareService, 
    public datepipe: DatePipe,private toastr: ToastrService, private notification : NotificationService, private errorHandler : ErrorhandlingService,
    private activatedroute : ActivatedRoute) { }

  ngOnInit(): void {
    let status = this.shareservice?.invhdrstatus_id?.value
    console.log("status",status)
    this.invoiceheaderstatus = status
    this.frmInvHdr=this.formBuilder.group({
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

    this.InvoiceDetailForm = this.formBuilder.group({
      roundoffamt :[''],     
      invoicedtls: new FormArray([
      ]),
      
      creditdtl: new FormArray([
      ])
    });

   
    this.creditdetForm = this.formBuilder.group({
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

    this.DebitDetailForm = this.formBuilder.group({

      debitdtl: new FormArray([
      ])
    });

    this.ccbsForm = this.formBuilder.group({

      ccbsdtl: new FormArray([
      ])
    })

    this.SubmitAPApproverForm = this.formBuilder.group({
      remarks:['']
    })

    this.activatedroute.queryParams.subscribe(
      params => {
        if(params)
        {
          if(params.comefrom == "apapprove")
          {
           this.comefrom = "apapprove"
          }
          else if (params.comefrom =="preparepay")
          {
           this.comefrom ="preparepay"
          }
        }
      })

    this.getApHdr();
  }
  getApHdr()
  {     this.service.getInvHdr(this.apinvHeader_id)
        .subscribe(result => {
          if(result.code == undefined){
            this.invHdrRes=result.data[0]
            this.getInvHdr(); 
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
  suppid: any
  Roundoffamount: any
  OtherAmount : any
  
  getInvHdr()
  {
     if (this.invHdrRes !==undefined && this.invHdrRes!==null)
      {
        let num: number = +this.invHdrRes.totalamount;
        let amt = new Intl.NumberFormat("en-GB",{ style: 'decimal', minimumFractionDigits : 2, maximumFractionDigits: 2}).format(num);
        amt = amt ? amt.toString() : '';
        num = +this.invHdrRes.totalamount - +this.invHdrRes.taxamount;
        let taxableamt = new Intl.NumberFormat("en-GB",{ style: 'decimal', minimumFractionDigits : 2, maximumFractionDigits: 2}).format(num);
        taxableamt = taxableamt ? taxableamt.toString() : '';
        this.aptypeid = this.invHdrRes.aptype_id
        console.log("this.aptypeid",this.aptypeid)
        let suppname : any
        let suppgst : any
        if(this.aptypeid == 3){
          suppname = this.invHdrRes.manualsupp_name
          suppgst = this.invHdrRes.manual_gstno
        }else if(this.aptypeid == 13){
          suppname = this.invHdrRes.supplier_name,
          suppgst = this.invHdrRes.suppliergst
        
        }else{
          suppname = this.invHdrRes.supplier_id?.name,
          suppgst = this.invHdrRes.supplier_id?.gstno
        
        }
        this.frmInvHdr.patchValue(
          {
            rsrCode:this.invHdrRes.raisercode,
            rsrEmp:this.invHdrRes.raisername,
            supCode:this.invHdrRes.supplier_id?.code,
            supName:suppname,
            supGST:suppgst,
            status: this.shareservice.invhdrstatus.value,
            branchGST:this.invHdrRes.raisorbranchgst,
            invNo:this.invHdrRes.invoiceno,
            invDate:this.datepipe.transform(this.invHdrRes.invoicedate,'dd-MMM-yyyy'),
            invAmt:amt,
            taxableAmt:taxableamt,
            gst:this.invHdrRes.invoicegst == 'Y' ? 'Yes' : 'No',
          }
        )
        this.Roundoffamount = this.invHdrRes.roundoffamt

        this.InvoiceDetailForm.patchValue({roundoffamt: this.invHdrRes.roundoffamt})
        this.creditdetForm.patchValue({supName : this.invHdrRes.supplier_id?.name})
        this.crno=this.invHdrRes.apinvoiceheader_crno
        // this.aptypeid = this.invHdrRes.aptype_id
        console.log("aptypeid",this.aptypeid)
        this.paytoid = this.invHdrRes.payto_id
        if(this.paytoid == undefined || this.paytoid == "")
          this.paytoid = this.invHdrRes?.ppx
        this.getgstapplicable = this.invHdrRes.invoicegst
        this.suppid = this.invHdrRes.supplier_id?.id
        if(this.getgstapplicable == "Y")
        {
          this.gstAppl = true
        }
        else
        {
          this.gstAppl = false
        }
        this.totalamount = Number(this.invHdrRes.totalamount)
        if(this.aptypeid !=4)
        {
          this.invDetailList =this.invHdrRes.invoicedetails.data
          this.OtherAmount = this.invDetailList[0]?.otheramount
          this.getinvoicedtlrecords();
          this.service.getDebitCredit(this.apinvHeader_id, 0, 2)
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
            this.service.getDebitCredit(this.apinvHeader_id, this.invdtladdonid, 1)
            .subscribe(result => {
            console.log("getInvdebit",result)
            if (result)
            {           
              this.spinner.hide();
              let data =result.data
            this.debitdata = data.filter(x => x.is_display == "YES" && x.amount >= 0)     
      
            this.getdebitrecords(this.debitdata)  
            }})

            this.service.getDebitCredit(this.apinvHeader_id, 0, 2)
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
      else{
        this.toastr.error('Invoice Hdr not available');
        return false;
        this.spinner.hide();
      }
  }

  getinvoicedtlrecords() {
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
        let cgstt = new Intl.NumberFormat("en-GB",{ style: 'decimal', minimumFractionDigits : 2, maximumFractionDigits: 2}).format(num); 
        cgstt = cgstt ? cgstt.toString() : '';
        cgst.setValue(cgstt)

        num = +details.sgst;
        let sgstt = new Intl.NumberFormat("en-GB",{ style: 'decimal', minimumFractionDigits : 2, maximumFractionDigits: 2}).format(num); 
        sgstt = sgstt ? sgstt.toString() : '';
        sgst.setValue(sgstt)

        num = +details.igst;
        let igstt = new Intl.NumberFormat("en-GB",{ style: 'decimal', minimumFractionDigits : 2, maximumFractionDigits: 2}).format(num); 
        igstt = igstt ? igstt.toString() : '';
        igst.setValue(igstt) 

        num = +details.taxamount;
        let tax = new Intl.NumberFormat("en-GB",{ style: 'decimal', minimumFractionDigits : 2, maximumFractionDigits: 2}).format(num); 
        tax = tax ? tax.toString() : '';
        taxamount.setValue(tax)
      }
      uom.setValue(details.uom)

      let num: number = +details.unitprice;
      let up = new Intl.NumberFormat("en-GB",{ style: 'decimal', minimumFractionDigits : 2, maximumFractionDigits: 2}).format(num); 
      up = up ? up.toString() : '';
      unitprice.setValue(up)

      num = +details.quantity;
      let qty = new Intl.NumberFormat("en-GB",{ style: 'decimal', minimumFractionDigits : 2, maximumFractionDigits: 2}).format(num); 
      qty = qty ? qty.toString() : '';
      quantity.setValue(qty)

      num = +details.amount;
      let amt = new Intl.NumberFormat("en-GB",{ style: 'decimal', minimumFractionDigits : 2, maximumFractionDigits: 2}).format(num); 
      amt = amt ? amt.toString() : '';
      amount.setValue(amt)

      num = +details.discount;
      let dis = new Intl.NumberFormat("en-GB",{ style: 'decimal', minimumFractionDigits : 2, maximumFractionDigits: 2}).format(num); 
      dis = dis ? dis.toString() : '';
      discount.setValue(dis)

      num = +details.totalamount;
      let tot = new Intl.NumberFormat("en-GB",{ style: 'decimal', minimumFractionDigits : 2, maximumFractionDigits: 2}).format(num); 
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
    console.log('this.INVsum', this.INVsum);  
  }
  getcreditrecords(datas) {
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
        let amt = new Intl.NumberFormat("en-GB",{ style: 'decimal', minimumFractionDigits : 2, maximumFractionDigits: 2}).format(num); 
        amt = amt ? amt.toString() : '';
        amount.setValue(amt)
        console.log("amount",amt)
    
        num = +data.taxableamount
        let taxbleamt = new Intl.NumberFormat("en-GB",{ style: 'decimal', minimumFractionDigits : 2, maximumFractionDigits: 2}).format(num); 
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
            if(data?.employee_account_dtls  == null || data?.employee_account_dtls == undefined)
            {
              accno.setValue(data?.refno)    
              refno.setValue(data?.refno)   
              bank.setValue("") 
              ifsccode.setValue("")
              branch.setValue("")
              benificiary.setValue("")
            }
            else if(data?.employee_account_dtls.data?.length < 1)
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
              accdet  = data.employee_account_dtls
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
   
        // }
        // else
        // {
        //   if(data.glno != "151515" && data.glno != "151516" && data.glno != "151517" )  
        //   {
        //     num = +data.amount
        //     let amt = new Intl.NumberFormat("en-GB",{ style: 'decimal', minimumFractionDigits : 2, maximumFractionDigits: 2}).format(num); 
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
    this.service.getDebitCredit(this.apinvHeader_id, this.invdtladdonid, 1)
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

  adddebits(detail){
    this.invtotamount = String(detail.totalamount).replace(/,/g, '')
    this.service.getDebitCredit(this.apinvHeader_id, detail.id, 1)
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
      let dbtamt = new Intl.NumberFormat("en-GB",{ style: 'decimal', minimumFractionDigits : 2, maximumFractionDigits: 2}).format(num); 
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



  getCreditSections(form) {
    return form.controls.creditdtl.controls;
  }

  apApprove()
  {
    let datas = this.SubmitAPApproverForm.value.remarks
    if(datas == "" || datas == null || datas == undefined){
      this.notification.showError("Please Enter Remarks")
      return false;
    }
    this.spinner.show()
    
    this.service.apApproveRej({ "apinvhdrid_list":[this.apinvHeader_id],"apinvoiceheaderstatus":9,"remarks":this.SubmitAPApproverForm.value.remarks } )
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
        this.onSubmit.emit()
        // this.router.navigate(['ECFAP/apapproval'], {queryParams : {comefrom : "invoicedetail"}})
      }
    },
    error => {
      this.errorHandler.handleError(error);
      this.spinner.hide();
    }
  )
  }

  apReject()
  {
    let datas = this.SubmitAPApproverForm.value.remarks
    if(datas == "" || datas == null || datas == undefined){
      this.notification.showError("Please Enter Remarks")
      return false;
    }
    this.spinner.show()
    
    this.service.apApproveRej({ "apinvhdrid_list":[this.apinvHeader_id],"apinvoiceheaderstatus":10,"remarks": this.SubmitAPApproverForm.value.remarks} )
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
        this.onSubmit.emit()
        // this.router.navigate(['ECFAP/apapproval'], {queryParams : {comefrom : "invoicedetail"}})
      }
    },
    error => {
      this.errorHandler.handleError(error);
      this.spinner.hide();
    }
  )
  }
  
  preparePay()
  {
    let datas = this.SubmitAPApproverForm.value.remarks
    if(datas == "" || datas == null || datas == undefined){
      this.notification.showError("Please Enter Remarks")
      return false;
    }
    this.spinner.show()  
    let creditres = this.invCreditList.filter(x => x.paymode_id == 5)
    let paymentData ={
                      "paymentheader_date" :this.datepipe.transform(new Date(), 'yyyy-MM-dd'),
                      "paymentheader_amount":creditres[0].amount,
                      "paymode":"NEFT",
                      "bankdetails_id":  creditres[0].debit_bankdetails.id,
                      "beneficiaryname":creditres[0].supplierpayment_details["data"][0].beneficiary,
                      "bankname":creditres[0].supplierpayment_details["data"][0].bank_id?.name,
                      "ifsc_code":creditres[0].supplierpayment_details["data"][0].branch_id?.ifsccode,
                      "accno":creditres[0].supplierpayment_details["data"][0].account_no,
                      "debitbankacc":creditres[0].supplierpayment_details["data"][0].account_no,
                      "remarks":datas,
                      "payment_dtls":[{"apinvhdr_id":this.apinvHeader_id,"apcredit_id":creditres[0].id,"paymntdtls_amt":creditres[0].amount}]
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
      this.router.navigate(['ECFAP/ecfapsummary'])
    }
   },
   error => {
    this.errorHandler.handleError(error);
    this.spinner.hide();
    }
  )
 
  }
  overallback() {
    // this.shareservice.comefrom.next("invoicedetail")
    // this.router.navigate(['ECFAP/apapproval'], {queryParams : {comefrom : "invoicedetail"}})
    this.onSubmit.emit()
  }
  
  checkInvID : any
  checkinvdate : any
  checklist:any;
  getquestion()
  {
    this.checkInvID = this.invHdrRes.id
    this.checkinvdate =this.datepipe.transform(this.invHdrRes.invoicedate, 'yyyy-MM-dd')
    this.service.getBouncedChecklist(this.checkInvID).subscribe(data=>{
      this.checklist=data['data'];
      for(let i=0;i<this.checklist.length;i++){
        this.checklist[i]['clk']=data['data'][i].value.id == 1 ? true : false;;       
        this.checklist[i]['value']=data['data'][i].value.id       
      }
      console.log('check=',data);
    if(this.checklist == undefined || this.checklist == null || this.checklist?.length == 0)
    { 
      this.service.getAuditChecklist(this.aptypeid).subscribe(data=>{
      this.checklist=data['data'];
      for(let i=0;i<this.checklist.length;i++){
        this.checklist[i]['clk']=true;
        this.checklist[i]['value']=1;       
      }
      console.log('check=',data);
    })
    }
  })    
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
getdedup()
{
  this.checkInvID = this.invHdrRes.id
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
      // } i`f (this.exactList <= 0) {
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
}
auditcheck:any=[];
cli:boolean=false;
  remark:any;
  rem = new FormControl('', Validators.required);

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
  // this.auditclose.nativeElement.click();
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
//  this.auditclose.nativeElement.click();
 }

 disables(){
  for(let i=0;i<this.auditcheck.length;i++)
   {
    if(this.auditcheck[i].value==2){
      return true;
      
    }
  }
}

}
