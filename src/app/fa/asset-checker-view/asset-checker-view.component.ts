import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import { faservice } from '../fa.service';
import { faShareService } from '../share.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-asset-checker-view',
  templateUrl: './asset-checker-view.component.html',
  styleUrls: ['./asset-checker-view.component.scss']
})
export class AssetCheckerViewComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    console.log('welcome',event.code);
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
  assetreject:Array<any>=[];
  assetcatlist: Array<any>=[];
  expdatalist:Array<any>=[];
  isassetmaker: boolean
  isassetbuk: boolean
  isinvoice: boolean=true;
  isexpense: boolean
  isassetwbuk: boolean
  view: String = "sa"
  ismakerCheckerButton: boolean;
  has_nextwbuk = true;
  has_previouswbuk = true;
  presentpagewbuk: number = 1;

  has_nextbuk = false;
  has_previousbuk = false;
  presentpagebuk: number = 1;
  pageSize = 10;
  presentpageloc=1;
  images:any='';
  // pageSize=10;
  btn_enabled:boolean=true;
  is_reject:boolean=true;
  imagearray=[];
  view_id:number=1;
  val_any:any={};
  enb_con:boolean=false;
  expencedata:Array<any>=[];
  checkerForm:any=FormGroup;
  expenceform:any=FormGroup;
  entry_data:Array<any>=[];
  constructor(private toast:ToastrService,private notification: NotificationService, private router: Router,private fb:FormBuilder,
     private Faservice: faservice, private shareservice: faShareService,private spinner:NgxSpinnerService ) { }
  data1: any
  ngOnInit(): void {
    this.checkerForm=this.fb.group({
      'crno':new FormControl(""),
      'groupid':new FormControl(""),
      'count':new FormControl(""),
      'totalcount':new FormControl("")
    });
    this.expenceform=this.fb.group({
      'cat':new FormControl(""),
      "subcat":new FormControl(""),
      "glno":new FormControl(""),
      "amount":new FormControl("")
    });
    this.data1 = this.shareservice.checkerlist.value;
    this.val_any=this.shareservice.FACheckerDataView.value;
    console.log(this.val_any);
    console.log('FR');
    console.log(this.data1);
    this.view_id=this.shareservice.asset_id.value;
    this.checkerForm.patchValue({'crno':this.val_any['crnum'],'groupid':this.val_any['assetgroup_id'],'totalcount':this.val_any['count']});
    this.getassetmakerbsummary();
  }
  getassetmakerbsummary(pageNumber = 1, pageSize = 10) {
  
    this.spinner.show();
    if(this.view_id){
      console.log(1);
      this.assetcatlist=[];
    let count:number=this.checkerForm.get('count').value?this.checkerForm.get('count').value:10;
    this.Faservice.getassetcategorysummaryadd(this.data1+"&count="+count,this.presentpagebuk)
      .subscribe((result) => {
        this.spinner.hide();
        console.log("landlord", result)
        let datass = result['data'];
        let datapagination = result["pagination"];
        this.assetcatlist = datass;
        console.log("landlord", this.assetcatlist);
       
        for(let i=0;i<this.assetcatlist.length;i++){
          this.assetcatlist[i]['is_approved']=false;
        }
        if (this.assetcatlist.length >= 0) {
          this.has_nextbuk = datapagination.has_next;
          this.has_previousbuk = datapagination.has_previous;
          this.presentpagebuk = datapagination.index;
        }

      },
      (error)=>{
        
        this.spinner.hide();
      }
      )
    }
    else{
      console.log(2);
      this.enb_con=true;
      this.assetcatlist=[];
      this.Faservice.getassetcategorysummaryaddgrp(this.data1)
      .subscribe((result) => {
        this.spinner.hide();
        console.log("landlord1=", result)
        let datass = result['data'];
        // let datapagination = result["pagination"];
        this.assetcatlist=datass;
        console.log("nongrp=", this.assetcatlist);
        // this.spinner.hide();
        for(let i=0;i<this.assetcatlist.length;i++){
          this.assetcatlist[i]['is_approved']=false;
        }
        if (this.assetcatlist.length >= 0) {
          // this.has_nextbuk = datapagination.has_next;
          // this.has_previousbuk = datapagination.has_previous;
          // this.presentpagebuk = datapagination.index;
        }

      },
      (error)=>{
        
        this.spinner.hide();
      }
      );

    }

  }
  getexpencedata(){
    this.spinner.show();
    this.Faservice.faexpencedataget(this.data1)
    .subscribe((result) => {
      this.spinner.hide();
      console.log(result);
      console.log("landlord2=", result);
      if (result['code']!=undefined && result['code']!=''){
        this.toast.warning(result['code']);
        this.toast.warning(result['description']);
      }
      else{
      let dta=result;
      this.expencedata=result['details'];
      this.entry_data=result['entry_data'];
      this.expenceform.patchValue({"cat":dta['cat']['name'],"subcat":dta['subcat']['name'],"glno":dta['glno'],"amount":dta['amount']});
      }

    },
    (error:HttpErrorResponse)=>{
      
      this.spinner.hide();
      // this.errorHandler.errorHandler(error,'');
    }
    );
  }
  searchData(){
    console.log(this.checkerForm.value);
    let count:any=this.checkerForm.get('count').value?this.checkerForm.get('count').value:10;
    this.spinner.show();
    this.Faservice.getassetcategorysummaryadd(this.data1+"&count="+count,this.presentpagebuk)
    .subscribe((result) => {
      this.spinner.hide();
      console.log("landlord", result)
      let datass = result['data'];
      let datapagination = result["pagination"];
      this.assetcatlist = datass;
      console.log("landlord", this.assetcatlist);
     
      for(let i=0;i<this.assetcatlist.length;i++){
        this.assetcatlist[i]['is_approved']=false;
      }
      if (this.assetcatlist.length >= 0) {
        this.has_nextbuk = datapagination.has_next;
        this.has_previousbuk = datapagination.has_previous;
        this.presentpagebuk = datapagination.index;
      }

    },
    (error)=>{
      
      this.spinner.hide();
    }
    )
  }
  approveall(e:any){
    if(e.currentTarget.checked){
    for(let i=0;i<this.assetcatlist.length;i++){
      this.assetcatlist[i]['is_approved']=true;
      this.btn_enabled=false;
    }
  }
  else{
    for(let i=0;i<this.assetcatlist.length;i++){
      this.assetcatlist[i]['is_approved']=false;
      this.btn_enabled=true;
    }
  }
  }
  approvedata(data:any,event){
    console.log(event.currentTarget.checked);
    if(event.currentTarget.checked){
      this.expdatalist.push(data);
    for(let i=0;i<this.assetcatlist.length;i++){
      if(this.assetcatlist[i].assetdetails_id==data.assetdetails_id){
        if(this.assetcatlist[i].assetdetails_status == 'PENDING'){
          // this.assetcatlist[i].is_approved=true;
          this.btn_enabled=false;
          this.is_reject=true;
        }
        if(Number(this.assetcatlist[i].assetgroup_id) == Number(0)){
          console.log('enter');
          this.assetreject.push(this.assetcatlist[i]['id']);
          this.is_reject=false;
          this.btn_enabled=false;
        }
        // else{
        //   this.is_reject=true;
        //   this.btn_enabled=false;
        // }
        this.assetcatlist[i].is_approved=true;
        
        
      }
     
    }
  }
  else{
    for(let i=0;i<this.assetcatlist.length;i++){
      if(this.assetcatlist[i].assetdetails_id==data.assetdetails_id){
        this.assetcatlist[i].is_approved=false;
        this.is_reject=true;
        this.btn_enabled=true;
        if(Number(this.assetcatlist[i].assetgroup_id) == Number(0)){
          this.is_reject=false;
          this.btn_enabled=true;
          let d:any=this.assetreject.indexOf(this.assetcatlist[i]['id'])
          this.assetreject.splice(d,1);
        }
      }
     
    }
    let index=this.expdatalist.findIndex(dta=>dta.assetdetails_id==data.assetdetails_id);
    this.expdatalist.splice(index,1);
  }
  for(let i of this.assetcatlist){
    if(i.is_approved){
      this.btn_enabled=false;
      break;
    }
  }

  }

  invoiceBtn() {
    this.isinvoice = true;
    this.isexpense = false;
  }

  expenseBtn() {
    this.isexpense = true;
    this.isinvoice = false;
    this.getexpencedata();

  }
  imagepload(){
    console.log('enter')
  }
  assetView() {
    this.router.navigate(['/fa/assetmakeradd'], { skipLocationChange: true })
  }

  assetsplitView() {
    this.router.navigate(['/fa/assetmakersplit'], { skipLocationChange: true })


  }
  BackBtn() {
    this.router.navigate(['fa/assetcheckersummary'], { skipLocationChange: true });


  }


  buknextClick() {

    if (this.has_nextbuk === true) {
      this.presentpagebuk=this.presentpagebuk+1;
      this.getassetmakerbsummary(this.presentpagebuk + 1, 10)

    }
  }

  bukpreviousClick() {

    if (this.has_previousbuk === true) {
      this.presentpagebuk=this.presentpagebuk-1;
      this.getassetmakerbsummary(this.presentpagebuk - 1, 10)

    }
  }
  buttonclick: boolean
  dataBtn() {
    let data:any={'assetdetails_id':[]};
    for(let i=0;i<this.assetcatlist.length;i++){
      if(this,this.assetcatlist[i].is_approved){
      // console.log(this.assetcatlist[i]);
      data['assetdetails_id'].push(this.assetcatlist[i].id)

      }
    }
    this.buttonclick = true
    this.shareservice.button.next(this.buttonclick)
    console.log('buttonclick', data);
    this.spinner.show();
    
    this.Faservice.getcheckerapprover(data).subscribe((data:any)=>{
      console.log('welcome=',data);
      this.spinner.hide();

      // if(data['CbsStatus'][0].Status=="Success"){
      if(data.status=='success'){
        this.spinner.hide();
        this.toast.success('Approved Successfully');
        this.router.navigate(['fa/assetcheckersummary'], { skipLocationChange: false });
      }
      else if(data['code']=='CBS_RESPONSE_FAIL'){
        this.spinner.hide();
        this.toast.warning(data['code']);
        this.toast.warning(data['description']);
        this.router.navigate(['fa/assetcheckersummary'], { skipLocationChange: false });
      }
      else if (data['Already request made']=='Already request made'){
        this.toast.warning(data['code']);
        this.toast.warning(data['description']);
      }
      else{
        this.toast.warning(data.code)
        this.spinner.hide();
        this.router.navigate(['fa/assetcheckersummary'], { skipLocationChange: false });
      }
      
    },
    (error)=>{
      
      console.log(error);
      this.spinner.hide();
      this.toast.warning(error.status +error.statusText);
      this.router.navigate(['fa/assetcheckersummary'], { skipLocationChange: false });
    }
    )


  }
  imageview(i:number,data:any){
    this.imagearray=[];
    console.log('hii');

    let uint8array = new TextEncoder().encode(this.assetcatlist[i]['imagepath'][1]);
    let string = new TextDecoder().decode(uint8array);
    let dear=string.replace("b'",'').replace("'",'');
    this.images='data:image/png;base64,'+dear;
    console.log(Number(this.images));
    for(let i=0;i<data['imagepath'].length;i++){
      let uint8array = new TextEncoder().encode(data['imagepath'][i]);
      let string = new TextDecoder().decode(uint8array);
      let dear=string.replace("b'",'').replace("'",'');
      this.images='data:image/png;base64,'+dear;
      this.imagearray.push('data:image/png;base64,'+dear)
    }
    console.log(this.imagearray)
    // console.log(decode(this.images=this.assetcatlist[0]['imagepath'][0]));
    // this.images=decode(this.assetcatlist[0]['imagepath'][0]);
  }
  assetcheckerreject(){
   
    if(this.assetreject.length==0){
      this.toast.warning("Please Select Any Data:");
      return false;
    };
    console.log(this.assetreject);
    this.spinner.show();
  this.Faservice.getcheckerreject(this.assetreject[0],'').subscribe((data:any)=>{
    console.log('after=',data);
    if(data.status=="success"){
      this.spinner.hide();
      
      this.toast.success('Successfully Rejected');
      this.getassetmakerbsummary();
    }
    else{
      this.spinner.hide();
      console.log(data);
      this.toast.warning(data.code,"",{timeOut: 5000});
      this.toast.warning(data.description,"",{timeOut: 5000})
    }
   
  },
  (error)=>{
    console.log(error);
    this.spinner.hide();
    this.toast.error(error.status+error.statusText);
  }
  );
  }

}
