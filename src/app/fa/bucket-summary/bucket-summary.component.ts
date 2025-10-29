import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormArray,FormGroup,FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap,map, takeUntil } from 'rxjs/operators';
import { faservice } from '../fa.service';
import { faShareService } from '../share.service';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
export interface Data{
  id:number,
  name:string
};
export interface bucketdata{
  id:string;
  name:string;
}
@Component({
  selector: 'app-bucket-summary',
  templateUrl: './bucket-summary.component.html',
  styleUrls: ['./bucket-summary.component.scss']
})


export class BucketSummaryComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.spinner.hide();
    }
  }
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('BranchInput') BranchInput: any;
  @ViewChild('todata') todata: MatAutocomplete;
  @ViewChild('assetidvalue') matassetid:MatAutocomplete;
  @ViewChild('assetidinputvalue') assetinput:ElementRef;
  @ViewChild(MatAutocompleteTrigger) autoTrigger:MatAutocompleteTrigger;
  searchForm:any=FormGroup;
  first:boolean=false;
  second:boolean=false;
  isLoading:boolean=true;
  currentPage:number=1;
  has_next:boolean=false;
  has_previous:boolean=false;
  bucketdata:Array<any>=[];
  buckethistory:Array<any>=[];
  assetIddata:Array<any>=[];
  pageSize:number=10;
  has_assetprevious:boolean=false;
  has_assetnext:boolean=false;
  has_assetpage:number=1;
  has_hprevious:boolean=false;
  has_hnext:boolean=false;
  has_hpage:number=1;
  has_bucprevious:boolean=true;
  has_bucnext:boolean=true;
  has_bucpage:number=1;
  fromBucketList:Array<any>=[];
  searchFormn:any=FormGroup;
  addinvoicevalue:number=0;
  addassetvalue:number=0;
  remassetvalue:number=0;
  reminvoicevalue:number=0;
  newbucketvalue:number=0;
  expamount:number=0;
  sumcapitalizedvalue:number=0;
  adddataList:Array<any>=[];
  // addshowdata:Array<any>=[];
  remdataList:Array<any>=[];
  constructor(private formBuild:FormBuilder,private router:Router,private Faservice:faservice,private service:faShareService,private notification:NotificationService,private spinner:NgxSpinnerService) { }

  ngOnInit(){
    this.searchForm=this.formBuild.group({
      'assetid':new FormControl('')
    });
    this.searchFormn=this.formBuild.group({
      'frombucket':new FormControl(''),
      'tobucket':new FormControl('')
    });
    this.searchFormn.get('frombucket').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.Faservice.getbucketsummarydropdown(1,value,'Y').pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe((data:any)=>{
      this.fromBucketList=data['data'];
    });
    this.Faservice.getbucketsummarydropdown(1,'','Y').subscribe(data=>{
      this.assetIddata=data['data'];
    },
    
    );
    this.searchForm.get('assetid').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.Faservice.getbucketsummarydropdown(1,value,'Y').pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe((data:any)=>{
      this.assetIddata=data['data'];
    });
    this.invoiceBtn(0);
    this.getsummarydata();
  }
  getsummarydata(){
    let search:any='&page='+this.currentPage;
    if(this.searchForm.get('assetid').value !=null && this.searchForm.get('assetid').value !='' && this.searchForm.get('assetid').value !=""){
      search=search+this.searchForm.get('assetid').value;
    }  ;
    // this.spinner.show();
    this.Faservice.getbucketsummarydropdown(this.currentPage,'','Y').subscribe(data=>{
      // this.spinner.hide();
      this.bucketdata=data['data'];
      let pagination=data['pagination'];
      for(let i=0;i<this.bucketdata.length;i++){
        this.bucketdata[i]['con']=false;
      }
      if(this.bucketdata.length>0){
        this.has_next=pagination.has_next;
        this.has_previous=pagination.has_previous;
        this.currentPage=pagination.index;
      }
    });
    
     
  }
  clicktoview(data:any){
    this.addassetvalue=0;
    this.addinvoicevalue=0;
    this.newbucketvalue=0;
    this.remassetvalue=0;
    this.reminvoicevalue=0;
    this.spinner.show();
    this.Faservice.getbucketsummaryhistory(this.currentPage=1,data.name).subscribe(data=>{
      this.spinner.hide();
      this.adddataList=data['addition_data'];
      if(this.adddataList.length>0){
        if(this.adddataList[0]['doctype']=='1' || this.adddataList[0]['doctype']=='2'){
          for(let i=0;i<this.adddataList.length;i++){
            // this.adddataList[i]['assetvalue']=Number(this.adddataList[i]['clearingheader']['totinvoiceamount'])/Number(this.adddataList[i]['qty']);
            // this.addassetvalue=this.addassetvalue+Number(this.adddataList[i]['clearingheader']['totinvoiceamount'])/Number(this.adddataList[i]['qty']);
            // this.addinvoicevalue=this.addinvoicevalue+Number(this.adddataList[i]['clearingheader']['totinvoiceamount']);
            this.adddataList[i]['assetvalue']=Number(this.adddataList[i]['totamount'])/Number(this.adddataList[i]['qty']);
            this.adddataList[i]['tottaxvalue']=Number(this.adddataList[i]['totamount'])+(Number(this.adddataList[i]['taxamount'])/2);
            this.addassetvalue=this.addassetvalue+(Number(this.adddataList[i]['totamount'])/Number(this.adddataList[i]['qty'])*Number(this.adddataList[i]['qty']));
            this.addinvoicevalue=this.addinvoicevalue+Number(this.adddataList[i]['totamount'])+(Number(this.adddataList[i]['taxamount'])/2);
          }
        }
        else{
          for(let i=0;i<this.adddataList.length;i++){
            // this.adddataList[i]['assetvalue']=Number(this.adddataList[i]['clearingheader']['totinvoiceamount'])/Number(this.adddataList[i]['qty']);
            // this.addassetvalue=this.addassetvalue+Number(this.adddataList[i]['clearingheader']['totinvoiceamount'])/Number(this.adddataList[i]['qty']);
            // this.addinvoicevalue=this.addinvoicevalue+Number(this.adddataList[i]['clearingheader']['totinvoiceamount']);
            this.adddataList[i]['assetvalue']=Number(this.adddataList[i]['totamount'])/Number(this.adddataList[i]['qty']);
            this.adddataList[i]['tottaxvalue']=Number(this.adddataList[i]['totamount'])+(Number(this.adddataList[i]['taxamount']));
            this.addassetvalue=this.addassetvalue+(Number(this.adddataList[i]['totamount'])/Number(this.adddataList[i]['qty'])*Number(this.adddataList[i]['qty']));
            this.addinvoicevalue=this.addinvoicevalue+Number(this.adddataList[i]['totamount'])+(Number(this.adddataList[i]['taxamount']));
          }
        }
          this.spinner.hide();
      }
      this.expamount=data['expense'];
      this.remdataList=data['removed_data'];
      if(this.remdataList.length>0){
        for(let i=0;i<this.remdataList.length;i++){
          // this.remdataList[i]['assetvalue']=Number( this.remdataList[i]['totamount'])/Number(this.remdataList[i]['qty']);
          this.remassetvalue=this.remassetvalue+Number(this.remdataList[i]['asset_value']);
          this.reminvoicevalue=this.reminvoicevalue+Number(this.remdataList[i]['asset_value']);
          this.sumcapitalizedvalue=this.sumcapitalizedvalue+Number(this.remdataList[i]['captalizedamount']);
        }
        this.spinner.hide();
      }
      this.newbucketvalue=this.addassetvalue-this.remassetvalue;

    },
    (error)=>{
      this.spinner.hide();
    }
    );
  }
  getsummarydata_history(){
    let search:any='&page='+this.has_hpage;
    if(this.searchForm.get('assetid').value !=null && this.searchForm.get('assetid').value !='' && this.searchForm.get('assetid').value !=""){
      search=search+this.searchForm.get('assetid').value;
    };
    // let d:any='';
    // if(this.searchFormn.get('frombucket').value==undefined || this.searchFormn.get('frombucket').value.name==undefined || this.searchFormn.get('frombucket').value==null || this.searchFormn.get('frombucket').value==""){
    //   d='';
    // }
    // else{
    //   d=this.searchFormn.get('frombucket').value.name
    // }
    this.spinner.show();
    this.Faservice.getbucketsummaryhistory(this.has_hpage,'').subscribe(data=>{
      this.spinner.hide();
      this.buckethistory=data['data'];
      let pagination=data['pagination'];
      for(let i=0;i<this.bucketdata.length;i++){
        this.bucketdata[i]['con']=false;
      }
      if(this.buckethistory.length>0){
        this.has_hnext=pagination.has_next;
        this.has_hprevious=pagination.has_previous;
        this.has_hpage=pagination.index;
      }
    },
    (error)=>{
      this.spinner.hide();
    }
    );
    
     
  }
  getsummarydata_history_search(){
    let search:any='&page='+this.has_hpage;
    if(this.searchForm.get('assetid').value !=null && this.searchForm.get('assetid').value !='' && this.searchForm.get('assetid').value !=""){
      search=search+this.searchForm.get('assetid').value;
    };
    let d:any='';
    if(this.searchFormn.get('frombucket').value==undefined || this.searchFormn.get('frombucket').value.name==undefined || this.searchFormn.get('frombucket').value==null || this.searchFormn.get('frombucket').value==""){
      d='';
    }
    else{
      d=this.searchFormn.get('frombucket').value.name
    }
    this.spinner.show();
    this.Faservice.getbucketsummaryhistory(this.currentPage=1,d).subscribe(data=>{
      this.spinner.hide();
      this.buckethistory=data['data'];
      let pagination=data['pagination'];
      // for(let i=0;i<this.bucketdata.length;i++){
      //   this.bucketdata[i]['con']=false;
      // }
      // if(this.buckethistory.length>0){
      //   this.has_hnext=pagination.has_next;
      //   this.has_hprevious=pagination.has_previous;
      //   this.has_hpage=pagination.index;
      // }
    },
    (error)=>{
      this.spinner.hide();
    }
    );
    
     
  }
  public tobucketinterface(data?:bucketdata):string | undefined{
    return data?data.name:undefined;
  }
  invoiceBtn(d:number) {
    if(d==0){
    this.first = true;
    this.second = false;
    this.getsummarydata();
    }
    if(d==1){
      this.first = false;
    this.second = true;
    this.getsummarydata_history();

    }

  }
  nextpage(){
    if(this.has_next){
      this.currentPage +=1;
      this.getsummarydata();
    }
  }
  previouspage(){
    if(this.has_previous){
      this.currentPage -=1;
      this.getsummarydata();
    }
  }
  nextpagehistory(){
    if(this.has_hnext){
      this.has_hpage +=1;
      this.getsummarydata_history();
    }
  }
  previouspagehistory(){
    if(this.has_hprevious){
      this.has_hpage -=1;
      this.getsummarydata_history();
    }
  }
  getcitydata(data,i){
    this.bucketdata[i]['con']=!this.bucketdata[i]['con'];
  }
  assetiddisplay(data?:Data):string | undefined{
    return data?data.name:undefined;
  }
  viewofpage(){
    this.service.bucket_id.next(1);
    this.router.navigate(['fa/bucketsummaryview'],{skipLocationChange:true});
  }
  clickoff(){
    this.isLoading=true;
    console.log(this.searchForm.value);
    this.Faservice.getbucketsummarysearch(this.searchForm.get('assetid').value,1).subscribe(data=>{
      this.isLoading=false;
      this.assetIddata=data['data'];
    });
  };
  searchdata(){
    this.Faservice.getbucketsummarydropdown_search(this.currentPage,this.searchForm.get('assetid').value,'Y').subscribe(data=>{
      // this.spinner.hide();
      this.bucketdata=data['data'];
      let pagination=data['pagination'];
      for(let i=0;i<this.bucketdata.length;i++){
        this.bucketdata[i]['con']=false;
      }
      // if(this.bucketdata.length>0){
      //   this.has_next=pagination.has_next;
      //   this.has_previous=pagination.has_previous;
      //   this.currentPage=pagination.index;
      // }
    });
  }
  autocompleteassetid(){
    console.log('hi')
    setTimeout(()=>{
      if(this.matassetid && this.autoTrigger && this.matassetid.panel){
        fromEvent(this.matassetid.panel.nativeElement,'scroll').pipe(
          map(()=>this.matassetid.panel.nativeElement.scrollTop),
          takeUntil(this.autoTrigger.panelClosingActions)
        ).subscribe(()=>{
          const scrollTop=this.matassetid.panel.nativeElement.scrollTop;
          const scrollHeight=this.matassetid.panel.nativeElement.scrollHeight;
          const elementHeight=this.matassetid.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if(atBottom){
            console.log('h');
            if(this.has_assetnext){
              this.Faservice.getbucketsummarysearch(this.assetinput.nativeElement.value,this.has_assetpage+1).subscribe(data=>{
                this.isLoading=false;
                this.assetIddata=this.assetIddata.concat(data['data']);
                let pagination=data['pagination'];
                if(this.assetIddata.length>0){
                  this.has_assetnext=pagination.has_next;
                  this.has_assetprevious=pagination.has_assetprevious;
                  this.has_assetpage=pagination.index;
                }
                
              });
             
            }
          }
        }
        )
      }
    })
  }
  autocompleteScrollbucket() {
    setTimeout(() => {
      if (
        this.todata &&
        this.autocompleteTrigger &&
        this.todata.panel
      ) {
        fromEvent(this.todata.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.todata.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.todata.panel.nativeElement.scrollTop;
            const scrollHeight = this.todata.panel.nativeElement.scrollHeight;
            const elementHeight = this.todata.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_bucnext === true) {
                this.Faservice.getbucketsummarydropdown(this.has_bucpage+1,this.searchForm.get('assetid').value,'Y')
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.assetIddata = this.assetIddata.concat(datas);
                    if (this.assetIddata.length >= 0) {
                      this.has_bucnext = datapagination.has_next;
                      this.has_bucprevious = datapagination.has_previous;
                      this.has_bucpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
}
