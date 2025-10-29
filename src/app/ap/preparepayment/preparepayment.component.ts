import { Component,ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import { DatePipe } from '@angular/common';
import { Ap1Service } from '../ap1.service';
import { NotificationService } from '../../service/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApShareServiceService } from '../ap-share-service.service';

export interface Master {
  title: string;
  model: number;
}

@Component({
  selector: 'app-preparepayment',
  templateUrl: './preparepayment.component.html',
  styleUrls: ['./preparepayment.component.scss']
})

export class PreparepaymentComponent implements OnInit {
  perpay:any= FormGroup;
  crno:any;
  branch:any=[];
  ischeck=true;
  invoicetype:any=[];
  invtyp:any
  invoicedate:any;
  apinvoicehdr_id:any;
  raiser_employeename:any=[];
  invdate:any;
  data:any=[];
  has_next = true;
  isLoading = false;
  has_previous = true;
  pageSizeApp = 10;
  absolutedata:any;
  parAppList: any;
  presentpage:any=1;
  pageNumber:any;
  pageSize:any;
  sup:any;
  raiser:any;
  date:any;
  bank:any;
  invoice_no:any;
  invoice_date:any;
  beni:any;
  ifsc:any;
  acno:any;
  d:any=[];
  incamt:any;
  invoice_amount:any;
  paymode:any;
  latest_date:any;
  apamount:any;
  istrue:boolean=true;
  // intyp = ["Po", "Non-PO", "Advance,Emp","Emp Claim"];
  intyp:Master[]=[{'title':"PO",'model':1},
                       {'title':"Non PO",'model':2},
                       {'title':"ADVANCE",'model':3},
                       {'title':"EMP Claim",'model':4},
                       {'title':"BRANCH EXP",'model':5},
                       {'title':"PETTY CASH",'model':6},
                       {'title':"SI",'model':7},
                       {'title':"TAF",'model':8},
                       {'title':"TCF",'model':9},
                       {'title':"EB",'model':10},
                       {'title':"RENT",'model':11},
                       {'title':"DTPC",'model':12},
                       {'title':"SGB",'model':13},
                       {'title':"ICR",'model':14}];
  checknumb:number;
  routeData:any=[]
  RoutingECFValue:any=[]
  newDataRouting:any=[]
  invoiceTypeValue:any=[];
  @ViewChild('payementsubmit') payementsubmit;
  constructor(private formbuilder: FormBuilder,private service:Ap1Service,
    private router:Router,private datepipe:DatePipe,private notification: NotificationService,
    private spinner:NgxSpinnerService, private shareservice:ApShareServiceService) { }

  ngOnInit(): void 
  {
    this.routeData = this.shareservice.commonsummary.value 
    this.RoutingECFValue = this.routeData['key']
    this.newDataRouting = this.routeData['data']

    this.perpay = this.formbuilder.group(
      {
        crno: [''],
        invoicetype:[],
        sup:[],
        bar:[],
        invoiceno:[''],
        inmt:[''],
        invoice_from_date: [''],
        raiser_employeename:[''],
        invoice_to_date: ['']
      });
      this.getdata();
      this.getbranch();
      this.perpay.get("bar").valueChanges.subscribe(
        value => {
          this.service.branchget(value).subscribe(data => {
            console.log('h');
             this.branch = data['data']
             console.log(this.branch)
           })
        }
      )
  }
  
  getdata(){
    this.spinner.show();
    if(this.RoutingECFValue==1){
      console.log('santhoshECF',this.newDataRouting)
      this.data = this.newDataRouting
      this.spinner.hide();
    }
    else{  
    this.service.prepayi({},this.presentpage).subscribe(data=>{
      console.log('payment=',data);
      this.data=data['data'];
      let datapagination = data["pagination"];
      this.spinner.hide();
      if (this.data.length > 0) {
        this.has_next = datapagination.has_next;
         this.has_previous = datapagination.has_previous;
         this.presentpage = datapagination.index;
      }
      if(data){
this.updatewhilePagination()

      }
    }
    )
  }
    return true;
  }
  nextClick() {
    if (this.has_next === true) {
    //   this.service.apicallservice({}, this.presentpage+1)
    this.presentpage=this.presentpage+1;
      //  this.search();
      this.getdata();
       }
  }
previousClick() {
    if (this.has_previous === true) {
//       this.service.apicallservice({}, this.presentpage-1)
this.presentpage=this.presentpage-1;
// this.search();
this.getdata()
    }
  }
  getbranch()
{
   this.service.branchget('').subscribe(data => {
    console.log('h');
     this.branch = data['data']
     console.log(this.branch)
   })
}
search()
{
  let values=this.perpay.value.crno;
  let fill:any={};
 if(this.perpay.get('crno').value !=null && this.perpay.get('crno').value !='' ){
  fill['crno']=this.perpay.get('crno').value;
 }
if(this.perpay.get('invoice_from_date').value !=null && this.perpay.get('invoice_from_date').value !='' ){
  fill['invoice_from_date']=this.datepipe.transform(this.perpay.get('invoice_from_date').value,"yyyy-MM-dd");
 }
if(this.perpay.get('invoice_to_date').value !=null && this.perpay.get('invoice_to_date').value !='' ){
  fill['invoice_to_date']=this.datepipe.transform(this.perpay.get('invoice_to_date').value,"yyyy-MM-dd");
  }
  if(this.perpay.get('invoiceno').value !=null && this.perpay.get('invoiceno').value !='' ){
    fill['invoiceno']=this.perpay.get('invoiceno').value;
   }
   if(this.perpay.get('sup').value !=null && this.perpay.get('sup').value !='' ){
    fill['supplier_id']=this.perpay.get('sup').value;
   }
   if(this.perpay.get('bar').value !=null && this.perpay.get('bar').value !='' ){
    fill['branch_id']=this.perpay.get('bar').value;
   }
   if(this.perpay.get('raiser_employeename').value !=null && this.perpay.get('raiser_employeename').value !='' ){
    fill['raisername']=this.perpay.get('raiser_employeename').value;
   }
   if(this.perpay.get('invoicetype').value !=null && this.perpay.get('invoicetype').value !='' ){
    fill['invoicetype_id']=this.invoiceTypeValue;
   }
  
  
  let val=this.perpay.value.crno;
  this.crno=this.perpay.value.crno;
  this.service.prepayi(fill,this.presentpage).subscribe(data=>{
    console.log('search=',data);
    this.data=data['data'];
    let datapagination=data['pagination'];
    if (this.data.length > 0) {
      this.has_next = datapagination.has_next;
       this.has_previous = datapagination.has_previous;
       this.presentpage = datapagination.index;
    }
  });
  console.log("Crno",this.crno)
   console.log("Crno",this.crno)
}
cancel()
{
  this.spinner.show();
    this.perpay.reset();
    this.invoiceTypeValue = '';
  this.perpay.reset();
  this.service.prepayi({},this.presentpage).subscribe(data=>{
    console.log('rr=',data);
    this.data=data['data'];
    this.spinner.hide();
  })
}
checkboxData = Array(100).fill(false)
dataToPatch: any
compareIdData : any
checkbox(index, data,e){
  // this.istrue=!this.istrue;
  this.date=new Date();
  this.latest_date =this.datepipe.transform(this.date, 'yyyy-MM-dd');
 console.log(this.latest_date )
  this.ischeck=false;
  console.log(e)
  console.log("checking",e.checked)
  console.log("index", index)
  console.log("data of table", data.id)
  console.log("crno", data.crno)
  this.crno=data.crno;
  this.invtyp=data.invoicetype.text;
  this.sup=data.supplier.name;
  this.raiser=data.raiser_employeename;
  this.bank=data.apcredit.creditbank.name;
  this.beni=data.apcredit.beneficiaryname;
  this.ifsc=data.apcredit['bankbranch'].data[0].ifsccode;
  this.acno=data.apcredit.creditrefno
  this.invoice_no=data.invoice_no;
  this.invoice_date=data.invoice_date;
  this.incamt=data.apcredit.amount;
  this.invoice_amount=data.invoice_amount;
  this.paymode=data.paymode_data.name
  this.apamount=data.apamount;
  this.compareIdData = data.id

  let absolutedata = this.data

  for (let idata in absolutedata){
    if(absolutedata[idata].id == data.id){
      this.checkboxData[idata] = !this.checkboxData[idata]
      // this.istrue=false;
      this.d=absolutedata[idata]
    }
    else{
      this.checkboxData[idata] = false 
    }
  }
  console.log(this.checkboxData)

  // if(this.checkboxData[index] == false  ){
  //   this.checkboxData[index] = true
  // }

  // this.checknumb=i; 
  for(let i in this.checkboxData) 
  {
    if(this.checkboxData[i] == true  ){
      console.log("sugu",this.checkboxData[i])
      this.istrue=false;
      break
      } 
      else{
      this.istrue=true;
      } 
  }
}

checks(i){
  if(this.checknumb==i){
    return false
  }
  else{
    return true
  }
  }
  prepare(absolutedata)
  {
   
  }
  paymentsubmit()
  {
   console.log("paysub",this.d)
   let pay:any={
    "paymentheader_date":this.latest_date.toString(),
    "paymentheader_amount":this.invoice_amount.toString(),
    "ref_id":"1",
    "reftable_id":"2",
    "paymode":this.d.paymode_data.name.toString(),
    "bankdetails_id":this.d.apcredit['bankbranch'].data[0].id.toString(),
    "beneficiaryname":this.d.apcredit.beneficiaryname.toString(),
    "bankname":this.d.apcredit['bankbranch'].data[0].bank.name.toString(),
    "IFSCcode":this.d.apcredit['bankbranch'].data[0].ifsccode.toString(),
    "accno":this.d.apcredit.creditrefno.toString(),
    "remarks":this.d.remarks.toString(),
    "payment_dtls":[{"apinvhdr_id":this.d.apcredit.apinvoiceheader.toString(),"apcredit_id":this.d.apcredit.id.toString(),"paymntdtls_amt":this.invoice_amount.toString()}]
  }
  this.service.paymentsubmit(pay).subscribe(data=>{
    console.log(data)
    if(data.id){
      console.log("pamentdetailId",data.id)
      this.notification.showSuccess("Successfully updated");
      this.payementsubmit.nativeElement.click();
    }
    else{
      this.notification.showError("Invalid Data");
      this.payementsubmit.nativeElement.click();
    }
   }
  ) 
 console.log("Input",pay)
  }

updatewhilePagination(){
    
  let absolutedata = this.data
      for (let idata in absolutedata){
      if(absolutedata[idata].id == this.compareIdData){
        this.checkboxData[idata] = !this.checkboxData[idata]
        // this.istrue=false;
      }
      else{
        this.checkboxData[idata] = false 
      }
    }
  }
  selectionChangeType(event) {
    if (event.isUserInput && event.source.selected == false) {
      if(event.source.value.title=='PO'){
        this.invoiceTypeValue[0] = ''
      }
      if(event.source.value.title=='Non PO'){
        this.invoiceTypeValue[1] = ''
      }
      if(event.source.value.title=='ADVANCE'){
        this.invoiceTypeValue[2] = ''
      }
      if(event.source.value.title=='EMP Claim'){
        this.invoiceTypeValue[3] = ''
      }
      if(event.source.value.title=='BRANCH EXP'){
        this.invoiceTypeValue[4] = ''
      }
      if(event.source.value.title=='PETTY CASH'){
        this.invoiceTypeValue[5] = ''
      }
      if(event.source.value.title=='SI'){
        this.invoiceTypeValue[6] = ''
      }
      if(event.source.value.title=='TAF'){
        this.invoiceTypeValue[7] = ''
      }
      if(event.source.value.title=='TCF'){
        this.invoiceTypeValue[8] = ''
      }
      if(event.source.value.title=='EB'){
        this.invoiceTypeValue[9] = ''
      }
      if(event.source.value.title=='RENT'){
        this.invoiceTypeValue[10] = ''
      }
      if(event.source.value.title=='DTPC'){
        this.invoiceTypeValue[11] = ''
      }
      if(event.source.value.title=='SGB'){
        this.invoiceTypeValue[12] = ''
      }
      if(event.source.value.title=='ICR'){
        this.invoiceTypeValue[13] = ''
      }  
    }
    else if(event.isUserInput && event.source.selected == true){
      if(event.source.value.title=='PO'){
        this.invoiceTypeValue[0] = 1
      }
      if(event.source.value.title=='Non PO'){
        this.invoiceTypeValue[1] = 2
      }
      if(event.source.value.title=='ADVANCE'){
        this.invoiceTypeValue[2] = 3
      }
      if(event.source.value.title=='EMP Claim'){
        this.invoiceTypeValue[3] = 4
      }
      if(event.source.value.title=='BRANCH EXP'){
        this.invoiceTypeValue[4] = 5
      }
      if(event.source.value.title=='PETTY CASH'){
        this.invoiceTypeValue[5] = 6
      }
      if(event.source.value.title=='SI'){
        this.invoiceTypeValue[6] = 7
      }
      if(event.source.value.title=='TAF'){
        this.invoiceTypeValue[7] = 8
      }
      if(event.source.value.title=='TCF'){
        this.invoiceTypeValue[8] = 9
      }
      if(event.source.value.title=='EB'){
        this.invoiceTypeValue[9] = 10
      }
      if(event.source.value.title=='RENT'){
        this.invoiceTypeValue[10] = 11
      }
      if(event.source.value.title=='DTPC'){
        this.invoiceTypeValue[11] = 12
      }
      if(event.source.value.title=='SGB'){
        this.invoiceTypeValue[12] = 13
      }
      if(event.source.value.title=='ICR'){
        this.invoiceTypeValue[13] = 14
      }
    }  
  }

}
