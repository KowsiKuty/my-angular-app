import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup,FormBuilder, FormControl } from '@angular/forms';
import { faservice } from '../fa.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';

export interface Branch{
  id:string;
  name:string;
  code:string;
}
export interface Vendor{
  id:number;
  name:string;
  code:string;
}
export interface Product{
  id:number;
  name:string;
  cde:string;
}
export interface criticality{
  id:string;
  name:string
}
export interface itod_drop{
  name:string,
  id:string

}

@Component({
  selector: 'app-generalquery',
  templateUrl: './generalquery.component.html',
  styleUrls: ['./generalquery.component.scss']
})
export class GeneralqueryComponent implements OnInit {

  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.SpinnerService.hide();
    }
  }
  genearqueryform:FormGroup;
  isLoading:boolean=false;
  branchlist:Array<any>=[];
  vendorlist:Array<any>=[];
  productlist:Array<any>=[];
  Querylist:Array<any>=[]
  count:any;
  has_next:Boolean=false;
  has_previous:Boolean=false;
  presentpage:number=1;
  pagesize:number=10;
  first:boolean=false;
  product_hasnext:boolean=false;
  product_hasprevious:boolean=false;
  product_presentpage:number=1;

  vendor_hasnext:boolean=false;
  vendor_hasprevious:boolean=false;
  vendor_presentpage:number=1;

  branch_hasnext:boolean=false;
  branch_hasprevious:boolean=false;
  branch_presentpage:number=1;
  active_inactive_type:number=0;
  checkbox_selected:number=1;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('productinfo') Productname:MatAutocomplete
  @ViewChild('productInput') Productinput:ElementRef;
  @ViewChild('vendorinfo') vendorname:MatAutocomplete
  @ViewChild('vendorInput') vendorinput:ElementRef;
  @ViewChild('branchinfo') branchname:MatAutocomplete
  @ViewChild('branchInput') branchinput:ElementRef;
  Type=[{"name":"All","id":0},{"name":"Actvive","id":1},{"name":"Inactive","id":2}]

  constructor(private fb:FormBuilder,private faservice: faservice,private notification:NotificationService,
    private SpinnerService: NgxSpinnerService,private datepipe:DatePipe
  ) { }

  ngOnInit(): void {
    this.genearqueryform=this.fb.group({
      'assetid':new FormControl(),
      'crno':new FormControl(),
      'ponumber':new FormControl(),
      'invoicenno':new FormControl(),
      'invoicedate':new FormControl(),
      'branch':new FormControl(),
      'product':new FormControl(),
      'vendorname':new FormControl(),
      'assetmake':new FormControl(),
      'assetmodel':new FormControl(),
      'specification':new FormControl(),
      'serialno':new FormControl(),
      'active_inactive':new FormControl(0),
      'crictical':new FormControl(''),
      'itod':new FormControl(''),
    });
    this.genearqueryform.get('product').valueChanges
    .pipe(
     debounceTime(100),
     distinctUntilChanged(),
     tap(() => {
       this.isLoading = true;
     }),
     switchMap(value => this.faservice.getassetproductdata(value ,1)
     .pipe(
       finalize(() => {
         this.isLoading = false
       }),)
     )
   )
   .subscribe((results: any[]) => {
     let datas = results['data'];
     this.productlist = datas
     console.log("product List", this.productlist)
   });
   this.genearqueryform.get('branch').valueChanges.pipe(
    debounceTime(100),
    distinctUntilChanged(),
    tap(()=>{
      this.isLoading=true;
    }),
    switchMap((value:any) => this.faservice.get_is_branch(value,1).pipe(
      finalize(()=>{
        this.isLoading=false;
      })
    ))
  ).
    subscribe((results: any[]) => {
        this.branchlist=results['data']
    });
    this.genearqueryform.get('vendorname').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any) => this.faservice.getassetsuppliername(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).
      subscribe((results: any[]) => {
          this.vendorlist=results['data']
      });
    this.getgen_summary();
    this.getproduct();
    this.getvendor();
    this.branchget();
  }
  is_admin:boolean=false;
  branchget(){
    this.faservice.get_is_branch('',1).subscribe(result=>{
      if(result?.code!=null && result?.code!="" && result?.code!=undefined){
        this.notification.showWarning(result?.code);
        this.notification.showWarning(result?.description);
      }
      else{
      this.branchlist=result['data'];
      let pagination = result['pagination'];
      this.is_admin=result.is_admin
      if(this.branchlist.length>0){
        this.branch_hasnext=pagination.has_next;
        this.branch_hasprevious=pagination.has_previous;
        this.branch_presentpage=pagination.index;
      }
      }
    },(error:HttpErrorResponse)=>{
      this.notification.showWarning(error.status+error.message);
    }
    )
  }
  getproduct(){
    this.faservice.getassetproductdata('',1).subscribe(result=>{
      if(result?.code!=null && result?.code!="" && result?.code!=undefined){
        this.notification.showWarning(result?.code);
        this.notification.showWarning(result?.description);
      }
      else{
      this.productlist=result['data'];
      let pagination=result['pagination'];
      if(this.productlist.length>0){
        this.product_hasnext=pagination.has_next;
        this.product_hasprevious=pagination.has_previous;
        this.product_presentpage=pagination.index;
      }
      }
    },(error:HttpErrorResponse)=>{
      this.notification.showWarning(error.status+error.message);
    }
    )
  }
  getvendor(){
    this.faservice.getassetsuppliername('',1).subscribe(result=>{
      if(result['code']!=null && result['code']!="" && result['code']!=undefined){
        this.notification.showWarning(result['code']);
        this.notification.showWarning(result['description']);
      }
      else{
      this.vendorlist=result['data'];
      let pagination=result['pagination'];
      if(this.vendorlist.length>0){
        this.vendor_hasnext=pagination.has_next;
        this.vendor_hasprevious=pagination.has_previous;
        this.vendor_presentpage=pagination.index;
      }
      }
    },(error:HttpErrorResponse)=>{
      this.notification.showWarning(error.status+error.message);
    }
    )
  }
  public displayFnbranchfrom(branchval?: Branch): string | undefined {
    return branchval ? branchval.name : undefined;
  }
  public displayFnvendor(vendorval?: Vendor): string | undefined {
    return vendorval ? vendorval.name : undefined;
  }
  public displayFnproduct(productval?: Product): string | undefined {
    return productval ? productval.name : undefined;
  }
  public displayfnCriticality(key?: criticality):string|undefined{
    return key?key.name:undefined
  }
  @ViewChild("cricinput") cricinput: any;
  criticality_list:Array<any>=[]
  Criticality_dropdown(){
    this.faservice.criticality_dd().subscribe(res=>{
      this.criticality_list=res['data']
    })
  }
   public display_idod(key?: itod_drop):string | undefined{
      return key?key.name:undefined
    }
  @ViewChild("itodinput") itodinput: any;
  @ViewChild("itodauto") itodauto: MatAutocomplete;
    itod_list:Array<any>=[];
    itod_page:number;
    itod_prev:boolean;
    itod_next:boolean;
    itod_dropdown(){
      this.faservice.itod_dropdown('',1).subscribe(res=>{
        let datas=res['data']
        this.itod_list=datas;
      })
    } 
  selecttype(id){
    this.active_inactive_type=id;
    this.getgen_summary();
  }
  getgen_summary(page=1){
    // let params:any=page +'&status='+ this.active_inactive_type;
    let params:any=page ;
    if(this.genearqueryform.get('assetid').value){
      params+='&assetid='+this.genearqueryform.get('assetid').value;
    }
    if(this.genearqueryform.get('crno').value){
      params+='&crno='+this.genearqueryform.get('crno').value;
    }
    if(this.genearqueryform.get('product').value){
      params+='&product_id='+this.genearqueryform.get('product').value.id;
    }
    if(this.genearqueryform.get('branch').value){
      params+='&branch_id='+this.genearqueryform.get('branch').value.id;
    }
    if(this.genearqueryform.get('vendorname').value){
      params+='&vendorname='+this.genearqueryform.get('vendorname').value.name;
    }
    if(this.genearqueryform.get('ponumber').value){
      params+='&ponumber='+this.genearqueryform.get('ponumber').value;
    }
    if(this.genearqueryform.get('assetmake').value){
      params+='&assetmake='+this.genearqueryform.get('assetmake').value;
    }
    if(this.genearqueryform.get('assetmodel').value){
      params+='&assetmodel='+this.genearqueryform.get('assetmodel').value;
    }
    if(this.genearqueryform.get('serialno').value){
      params+='&assetserialno='+this.genearqueryform.get('serialno').value;
    }
    if(this.genearqueryform.get('specification').value){
      params+='&assetspecification='+this.genearqueryform.get('specification').value;
    }
    if(this.genearqueryform.get('invoicenno').value){
      params+='&invoiceno='+this.genearqueryform.get('invoicenno').value;
    }
    if(this.genearqueryform.get('invoicedate').value){
      params+='&invoicedate='+(this.datepipe.transform(this.genearqueryform.get('invoicedate').value,'yyyy-MM-dd'))
   }
   if(this.genearqueryform.get('crictical').value){
    params+='&critiacality='+this.genearqueryform.get('crictical').value.value
   }
   if(this.genearqueryform.get('itod').value){
    params+='&it_od='+this.genearqueryform.get('itod').value.cat_list
   }
   this.SpinnerService.show();
    this.faservice.general_query_summary(params).subscribe(result=>{
      this.SpinnerService.hide();
      if(result?.code!='' && result?.code!=null && result?.code!=undefined){
        this.notification.showWarning(result?.code);
        this.notification.showWarning(result?.description);
        this.Querylist=[];
      }
      else{
        this.count=result['count']
        this.Querylist=result['data'];
        let pagination = result['pagination'];
        if(this.Querylist.length>0){
          this.has_next=pagination.has_next;
          this.has_previous=pagination.has_previous;
          this.presentpage=pagination.index;
        }
      }
    },(error:HttpErrorResponse)=>{
        this.notification.showWarning(error?.status + error?.message);
        this.SpinnerService.hide();  
    });
  }
  previousClick(){
   if (this.has_previous==true){
    this.presentpage-=1;
    this.getgen_summary(this.presentpage);
   }
  }
  nextClick(){
    if (this.has_next==true){
      this.presentpage+=1;
      this.getgen_summary(this.presentpage);
     }
  }
  reset(){
    this.genearqueryform.reset('');
    this.active_inactive_type=0;
    this.genearqueryform.get('active_inactive').patchValue(0);
    this.getgen_summary(1);
  }
  Download_prepare(){
    if(this.first==true){
      this.notification.showWarning('Please Wait');
      return false;
    }
    this.first=true;
    let params={}
    // params['status']=this.active_inactive_type;
    if(this.genearqueryform.get('assetid').value){
      params['assetid']=this.genearqueryform.get('assetid').value;
    }
    if(this.genearqueryform.get('crno').value){
      // params+='&crno='+this.genearqueryform.get('crno').value;
      params['crno']=this.genearqueryform.get('crno').value;
    }
    if(this.genearqueryform.get('product').value){
      // params+='&product_id='+this.genearqueryform.get('product').value.id;
      params['product_id']=this.genearqueryform.get('product').value.id;
    }
    if(this.genearqueryform.get('branch').value){
      // params+='&branch_id='+this.genearqueryform.get('branch').value.id;
      params['branch_id']=this.genearqueryform.get('branch').value.id;
    }
    if(this.genearqueryform.get('vendorname').value){
      // params+='&vendorname='+this.genearqueryform.get('vendorname').value.name;
      params['vendorname']=this.genearqueryform.get('vendorname').value.name;
    }
    if(this.genearqueryform.get('ponumber').value){
      // params+='&ponumber='+this.genearqueryform.get('ponumber').value;
      params['ponumber']=this.genearqueryform.get('ponumber').value;
    }
    if(this.genearqueryform.get('assetmake').value){
      // params+='&assetmake='+this.genearqueryform.get('assetmake').value;
      params['assetmake']=this.genearqueryform.get('assetmake').value;
    }
    if(this.genearqueryform.get('assetmodel').value){
      // params+='&assetmodel='+this.genearqueryform.get('assetmodel').value;
      params['assetmodel']=this.genearqueryform.get('assetmodel').value;
    }
    if(this.genearqueryform.get('serialno').value){
      // params+='&assetserialno='+this.genearqueryform.get('serialno').value;
      params['assetserialno']=this.genearqueryform.get('serialno').value;

    }
    if(this.genearqueryform.get('specification').value){
      // params+='&assetspecification='+this.genearqueryform.get('specification').value;
      params['assetspecification']=this.genearqueryform.get('specification').value;
    }
    if(this.genearqueryform.get('invoicenno').value){
      // params+='&invoiceno='+this.genearqueryform.get('invoicenno').value;
      params['invoiceno']=this.genearqueryform.get('invoicenno').value;
    }
    if(this.genearqueryform.get('invoicedate').value){
      // params+='&invoicedate='+(this.datepipe.transform(this.genearqueryform.get('invoicedate').value,'yyyy-MM-dd'))
      params['invoicedate']=(this.datepipe.transform(this.genearqueryform.get('invoicedate').value,'yyyy-MM-dd'));
   }
   if(this.genearqueryform.get('crictical').value){
    params['critiacality']=this.genearqueryform.get('crictical').value.value
   }
   if(this.genearqueryform.get('itod').value){
    params['it_od']=this.genearqueryform.get('itod').value.cat_list
   }
    this.SpinnerService.show();
    this.notification.showWarning("Please Wait For 5 Mins..");
    this.faservice.queryprepare_downloadfile_prepare(params).subscribe((result:any)=>{
      this.SpinnerService.hide();
      this.first=false;
      if(result.code!=undefined && result.code!="" && result.code!=null){
        this.notification.showWarning(result.code);
        this.notification.showWarning(result.description);
      }
      else{
        this.notification.showSuccess(result.status);
        this.notification.showSuccess(result.message);
      }
    },
    (error:any)=>{
      this.first=false;
      this.notification.showWarning(error.status+error.statusText);
      this.SpinnerService.hide();
    })
  }
  download_file(){
    if(this.first==true){
      this.notification.showWarning('Please Wait');
      return false;
    } 
    this.SpinnerService.show();
    this.faservice.gen_querydownloadfile().subscribe(
      (response: any) =>{
        this.SpinnerService.hide();
          // this.first=false;
          // this.first=false;
          if (response['type']=='application/json'){
            this.notification.showWarning('INVALID_DATA')
           }
           else{
            let filename:any='FA-General_Query';
            let dataType = response.type;
            let binaryData = [];
            binaryData.push(response);
            let downloadLink:any = document.createElement('a');
            console.log()
            downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
            
            downloadLink.setAttribute('download',filename);
            document.body.appendChild(downloadLink);
            downloadLink.click();
           }
            
      },
      (error:HttpErrorResponse)=>{
        // this.first=false;
        this.SpinnerService.hide();
        this.notification.showWarning(error.status+error.statusText)
        // this.notification.showWarning(error.status+'-'+error.statusText,'',{timeOut: 5000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});
        // this.notification.showWarning(error.message,'',{timeOut: 5000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});
  
      }
  )
  }
  autocompleteScrollProduct(){

    setTimeout(() => {
      if (
        this.Productname &&
        this.autocompleteTrigger &&
        this.Productname.panel
      ) {
        fromEvent(this.Productname.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.Productname.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.Productname.panel.nativeElement.scrollTop;
            const scrollHeight = this.Productname.panel.nativeElement.scrollHeight;
            const elementHeight = this.Productname.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.product_hasnext === true) {
                this.faservice.getassetproductdata(this.Productinput.nativeElement.value,this.product_presentpage+1)
                  .subscribe((data: any[]) => {
                    let datas = data["data"];
                    let datapagination = data["pagination"];
                    this.productlist = this.productlist.concat(datas);
                    if (this.productlist.length > 0) {
                      this.product_hasnext = datapagination.has_next;
                      this.product_hasprevious = datapagination.has_previous;
                      this.product_presentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  autocompleteScrollVendor(){

    setTimeout(() => {
      if (
        this.vendorname &&
        this.autocompleteTrigger &&
        this.vendorname.panel
      ) {
        fromEvent(this.vendorname.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.vendorname.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.vendorname.panel.nativeElement.scrollTop;
            const scrollHeight = this.vendorname.panel.nativeElement.scrollHeight;
            const elementHeight = this.vendorname.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.vendor_hasnext === true) {
                this.faservice.getassetsuppliername(this.vendorinput.nativeElement.value,this.vendor_presentpage+1)
                  .subscribe((data: any[]) => {
                    let datas = data["data"];
                    let datapagination = data["pagination"];
                    this.vendorlist = this.vendorlist.concat(datas);
                    if (this.vendorlist.length > 0) {
                      this.vendor_hasnext = datapagination.has_next;
                      this.vendor_hasprevious = datapagination.has_previous;
                      this.vendor_presentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  autocompleteScrollbranch(){

    setTimeout(() => {
      if (
        this.branchname &&
        this.autocompleteTrigger &&
        this.branchname.panel
      ) {
        fromEvent(this.branchname.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.branchname.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.branchname.panel.nativeElement.scrollTop;
            const scrollHeight = this.branchname.panel.nativeElement.scrollHeight;
            const elementHeight = this.branchname.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.branch_hasnext === true) {
                this.faservice.get_is_branch(this.branchinput.nativeElement.value,this.branch_presentpage+1)
                  .subscribe((data: any[]) => {
                    let datas = data["data"];
                    let datapagination = data["pagination"];
                    this.branchlist = this.branchlist.concat(datas);
                    if (this.branchlist.length > 0) {
                      this.branch_hasnext = datapagination.has_next;
                      this.branch_hasprevious = datapagination.has_previous;
                      this.branch_presentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
}
