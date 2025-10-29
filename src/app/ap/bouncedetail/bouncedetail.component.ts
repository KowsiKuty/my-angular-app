import { Component, OnInit } from '@angular/core';
import { Ap1Service } from '../ap1.service';
import { NotificationService } from '../../service/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router'; 
import { FormGroup, FormControl, FormBuilder, Validators ,FormArray} from '@angular/forms';
import { data } from 'jquery';
import { ApShareServiceService } from '../ap-share-service.service';
@Component({
  selector: 'app-bouncedetail',
  templateUrl: './bouncedetail.component.html',
  styleUrls: ['./bouncedetail.component.scss']
})
export class BouncedetailComponent implements OnInit {
  dt=this.service.dat.value
  rem = new FormControl('', Validators.required);
 images=new FormControl('');
  RoutingECFValue: any;
  newDataRouting: any;
  constructor(private service:Ap1Service,private notification: NotificationService,
    private router:Router,private spinner:NgxSpinnerService, private shareservice:ApShareServiceService,
    ) { }
  remark:any;
  sta=4;
  stat=5;
  bo:any=[];
  data:any=[]
  star=true;
  com=true;
  routeData:any=[];
  fileData: any;
  presentpage: number = 1;
  identificationSize: number = 10;
  invdet:any[];
  incdet:any[];
  indbdet:any[];
  type=['exact',
        'supplier',
        'invoice_amount',
        'invoiceno',
        'invoice_date']

  exactList: any;
  withoutSuppList: any;
  withoutInvAmtList: any;
  withoutInvNoList: any;
  withoutInvDtList: any;
  viewtrnlist:any=[]
btnDisabled =false;
name:any;
designation:any;
branch:any;
apinvoicehdr_id=this.service.inhed.value;
invHdrID=this.service.inhed.value;
bscclist:any=[];
ccbsamt:any;
ccname:any;
bsname:any;
glno:any;
per:any;
  ngOnInit(): void {
  this.routeData = this.shareservice.commonsummary.value 
  console.log("common",this.routeData)
  this.RoutingECFValue = this.routeData['key']
  this.newDataRouting = this.routeData['data'][0]
  console.log('santhosh',this.newDataRouting)
  console.log("bounceSummary",this.dt) 
  console.log("invhd",this.apinvoicehdr_id)
  this.getinvdet()
  this.getcetdet()
  this.getdbtdet()
  }
 //dedupe for type(exact)
  dedup()
  {  
this.service.getInwDedupeChk(this.apinvoicehdr_id,this.type[0])
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
this.service.getInwDedupeChk(this.apinvoicehdr_id,this.type[1])
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
this.service.getInwDedupeChk(this.apinvoicehdr_id,this.type[2])
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
this.service.getInwDedupeChk(this.apinvoicehdr_id,this.type[3])
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
this.service.getInwDedupeChk(this.apinvoicehdr_id,this.type[4])
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
} )           
  }
  audit()
  {
    this.service.bounceauditchecklist(this.apinvoicehdr_id).subscribe(data=>{
      this.data=data['data'];
      console.log(data)
    })
  }
  reaudit()
  {
    this.remark=this.rem.value
    console.log(this.invHdrID)
    let boui:any={
      "status_id":this.sta.toString(),
      "apinvoicehdr_id":this.invHdrID.toString(),
      "remark":this.remark.toString()
    }
    console.log(boui)
    this.spinner.show();
      this.service.bounce(boui).subscribe(data=>{
        this.spinner.hide();
        console.log(data)
       //  if(data['message']=="success"){
         this.notification.showSuccess(data['message']);
           this.router.navigateByUrl('/ap/commonsummary');
     
       //  }
       //  else{
       //   this.notification.showError(data['description']);
       //  }
       }
      )
  }
  reject()
  {
    this.remark=this.rem.value
    // this.apinvoicehdr_id=this.newDataRouting.id;
    // console.log(this.apinvoicehdr_id)
    let boui:any={
      "status_id":this.stat.toString(),
      "apinvoicehdr_id":this.invHdrID.toString(),
      "remark":this.remark.toString()
    }
    console.log(boui)
    this.spinner.show();
      this.service.bounce(boui).subscribe(data=>{
        this.spinner.hide();
        console.log(data)
       //  if(data['message']=="success"){
         this.notification.showSuccess(data['message']);
         this.router.navigateByUrl('/ap/commonsummary');
     
          // this.router.navigateByUrl('rejectsummary');
     
       //  }
       //  else{
       //   this.notification.showError(data['description']);
       //  }
       }
      )
  }

  goBack(){
    this.router.navigateByUrl('/ap/commonsummary')
  }
//   submitted()
//   {
//     let obj={
//       'auditchecklist':this.bo
//     }
//     console.log('obj', obj);
//     this.service.audiokservie(obj).subscribe(data=>{
//       this.notification.showSuccess(data['status'])
//      },
//      (error)=>{
//      alert(error.status+error.statusText);
//     }
//     )
//   }
//   ok(dt)
//   {
//     let val=1
//     let dear:any={
//       "id":dt.id,
//       "value":val};
//       this.bo.push(dear)
//   for(let i=0;i<this.bo.length;i++){
//     if(this.bo[i].apauditchecklist_id==dt.id && this.bo[i].value!=val ){
//       this.bo.splice(i,1)
//     }
//   } 
//   //   let val=1
//   //   let dear:any={
//   //     "id":dt.id,
//   //     // "apinvoiceheader_id":this.apinvoicehdr_id,
//   //     "value":val};
//   //     for(let i=0;i<this.bo.length;i++){
//   //       if(this.bo[i].id==dt.id && this.bo[i].value!=val ){
//   //         this.bo.splice(i,1)
//   //       }
//   //     }
//   //     this.bo.push(dear)
//   // console.log(this.bo)
 
//   }
//   notok(dt)
//   {
//     let val=2
//     let dear:any={
//       "id":dt.id,
//       "value":val};
//       this.bo.push(dear)
//   for(let i=0;i<this.bo.length;i++){
//     if(this.bo[i].apauditchecklist_id==dt.id && this.bo[i].value!=val ){
//       this.bo.splice(i,1)
//     }
//   } 
//   //   let val=2
//   //   let dear:any={
//   //     "id":dt.id,
//   //     // "apinvoiceheader_id":this.apinvoicehdr_id,
//   //     "value":val};
//   //     for(let i=0;i<this.bo.length;i++){
//   //       if(this.bo[i].id==dt.id && this.bo[i].value!=val ){
//   //         this.bo.splice(i,1)
//   //       }
//   //     }
//   //     this.bo.push(dear)
//   // console.log(this.bo)
  

//   }
//   na(dt)
//   {
//     let val=3
//     let dear:any={
//       "id":dt.id,
//       "value":val};
//       this.bo.push(dear)
//   for(let i=0;i<this.bo.length;i++){
//     if(this.bo[i].apauditchecklist_id==dt.id && this.bo[i].value!=val ){
//       this.bo.splice(i,1)
//     }
//   } 
// //   let val=2
// //   let dear:any={
// //     "id":dt.id,
// //     // "apinvoiceheader_id":this.apinvoicehdr_id,
// //     "value":val};
// //     for(let i=0;i<this.bo.length;i++){
// //       if(this.bo[i].id==dt.id && this.bo[i].value!=val ){
// //         this.bo.splice(i,1)
// //       }
// //     }
// //     this.bo.push(dear)
// // console.log(this.bo) 
//   }
  selectFile(event) {
    this.fileData = event.target.files[0];

    // if (this.fileData.type == 'image/jpeg' || this.fileData.type == 'application/pdf') {

    // } else {
    //   alert("file type should be image of pdf")
    //   return;
    // }

  }
  viewtrn()
  {
    console.log("id",this.apinvoicehdr_id)
    this.service.viewtracation(this.apinvoicehdr_id).subscribe(data=>
     {
       this.viewtrnlist = data['data']
       console.log("trnDt",this.viewtrnlist)
     })
  }
  view(dt){
   this.name=dt.from_user.name
   this.designation=dt.from_user.designation
   this.branch=dt.from_user.branch.name
  }
  viewto(dt)
 {
   this.name=dt.to_user.name
   this.designation=dt.to_user.designation
   this.branch=dt.to_user.branch.name
 }
 getinvdet()
 {
   this.service.getInvDetail(this.apinvoicehdr_id).subscribe(data=>
    {
      this.invdet=data['data']
      console.log("invdet",this.invdet)
    })
 }
 getcetdet()
 {
   this.service.getInvCredit(this.apinvoicehdr_id).subscribe(data=>
    {
      this.incdet=data['data']
      console.log("cet",this.incdet)
    })
 }
 getdbtdet()
 {
   this.service.getInvDebit(this.apinvoicehdr_id).subscribe(data=>
    {
      this.indbdet=data['data']
      console.log("dbt",this.indbdet)
    })
 }
 bscc(indbdet,i)
 {
  this.bscclist=indbdet[i].ccbs[0];
  console.log("bscc",this.bscclist)
  this.ccbsamt=this.bscclist.amount;
  this.ccname=this.bscclist.cc_code.name
  this.bsname=this.bscclist.bs_code.name
  this.glno=this.bscclist.glno
  this.per=this.bscclist.ccbspercentage
 }

 }


