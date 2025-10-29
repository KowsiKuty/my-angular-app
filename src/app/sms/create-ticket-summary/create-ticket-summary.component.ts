import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { DatePipe, formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { SmsService } from '../sms.service';

export interface branch{
  id:string;
  name:string;
}
export interface location{
  id:string;
  name:string;
}
export interface vendorname{
  id:string;
  name:string;
}
export interface assetsubcat{
  id:string,
  name:string
}
export interface product{
  id:string;
  name:string;
}
export interface assetname{
  id:string;
  name:string;
  cose:string;
}
export interface asserialno{
  id:string;
  barcode:string;
  assetserialno:string;
}
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
  selector: 'app-create-ticket-summary',
  templateUrl: './create-ticket-summary.component.html',
  styleUrls: ['./create-ticket-summary.component.scss'],
  providers: [{ provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
      DatePipe]
})
export class CreateTicketSummaryComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){  
    if(event.code =="Escape"){
      this.spinner.hide();
    }   
  }
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger:MatAutocompleteTrigger;
  @ViewChild('branchdataref') matBranch:MatAutocomplete;
  @ViewChild('locationdataref') matlocation:MatAutocomplete;
  @ViewChild('branchInput') branch:any;
  @ViewChild('locationInput') location:any;
  @ViewChild('nop') templates:TemplateRef<any>;
  @ViewChild('checkerproduct') matprodAutocomplete: MatAutocomplete;
  @ViewChild('product') matproductAutocomplete: MatAutocomplete;
  @ViewChild('checkerassetserialno') matserialAutocomplete: MatAutocomplete;
  @ViewChild('checkerbranchs') matsupAutocomplete: MatAutocomplete;
  has_supnext:boolean=true;
  has_supprevious:boolean=false;
  has_suppresentpage:number=1;
  formTicket: any=FormGroup;
  TicketSearch:any=FormGroup;
  branchList:Array<any>=[];
  assetserialList:Array<any>=[];
  locationList:Array<any>=[];
  nopList:Array<any>=[];
  nopListnew:Array<any>=[];
  supplierList:Array<any>=[];
  isLoading:boolean;
  sel:any;
  @ViewChild('categorys') matcategory:MatAutocomplete;
  @ViewChild('inputcategorys') inputcategory:any;
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger:MatAutocompleteTrigger;
  smsassetcat:any=FormGroup;
  categorylist: Array<any>=[];
  assetnamelist: Array<any>=[];
  has_nextcategory:boolean=true;
  has_previouscategory:boolean=true;
  has_presentcategory:number=1;
  // isLoading:boolean=false;
  totalcount:number=0;
  pagesize:number=10;
  has_next:boolean=false;
  has_previous:boolean=false;
  presentpage:number=1;
  has_next_n:boolean=false;
  has_previous_n:boolean=false;
  presentpage_n:number=1;
  has_branchprevious:boolean=false;
  has_branchnext:boolean=true;
  has_locationprevious:boolean=false;
  submit_button_disable:boolean=false;
  has_locationnext:boolean=true;
  has_locationpage:number=1;
  has_branchpage:number=1;
  has_nopprevious:boolean=false;
  has_nopnext:boolean=true;
  has_noppage:number=1;
  enb:boolean=false;
  nopform:any=FormGroup;
  listcomments:Array<any>=[];
  latest_date: string;
  valid_date=new Date();
  branch_id:number ;
  productlist:Array<any>=[];
  product:number;  
	has_prodnext:boolean=true;
  has_prodprevious:boolean=false;
  has_prodpresentpage:number=1;
	has_serialnext:boolean=true;
  has_serialprevious:boolean=false;
  has_serialpresentpage:number=1;
  parentchildlist:string;
  parentlist:string="Parent Name";
  childlist:string="Child Name" ;
  vendorList:Array<any>=[];
  assetidList: Array<any>=[];
  constructor(private router:Router,private dialog:MatDialog,private datepipe:DatePipe,private spinner:NgxSpinnerService,private fb:FormBuilder,private smsservice:SmsService,private toastr:ToastrService) { }

  ngOnInit(): void {
    this.formTicket=this.fb.group({
      'summaryproblem':new FormControl(''),
      'problemdesc':new FormControl('')
    });
    this.TicketSearch=this.fb.group({
      'branch':new FormControl(''),
      'Location':new FormControl(''),
      'amc':new FormControl(false),
      'war':new FormControl(false),
      'all':new FormControl(false),
      'paid':new FormControl(false),
      'assetid':new FormControl(''),
      'date':new FormControl(''),
      'nop':new FormControl(''),
      'supplier':new FormControl(''),
      'asset_name':new FormControl(),
      'assetserialno':new FormControl(),
      'vendor': new FormControl(),
    });
    this.smsservice.getAMCassetiddropdown(1,'').subscribe(data=>{
      this.assetidList=data['data'];
    })
    this.TicketSearch.get('assetid').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.smsservice.getAMCassetiddropdown(1,value).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.assetidList=data['data'];
    });
    this.nopform=this.fb.group({
      'natureop':new FormControl('')
    });
    this.smsservice.getamcbranchdata('',1).subscribe(data=>{
      this.branchList=data['data'];
    })
    this.TicketSearch.get('branch').valueChanges.pipe(
      debounceTime(100),distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.smsservice.getamcbranchdata(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.branchList=data['data'];
    });
    this.smsservice.getCustomerStateFilter(1,'').subscribe(data=>{
      this.vendorList=data['data'];
    });
    this.TicketSearch.get('vendor').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.smsservice.getCustomerStateFilter(1,value).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.vendorList=data['data'];
    });
    this.smsservice.getamcserialnodata('').subscribe(data=>{
      this.assetserialList=data['data'];
    })
    this.TicketSearch.get('assetserialno').valueChanges.pipe(
      debounceTime(100),distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.smsservice.getamcserialnodata(value).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.assetserialList=data['data'];
    });
    this.smsservice.getCustomerStateFilter(1,'').subscribe(data=>{
      this.supplierList=data['data'];
    });
    this.TicketSearch.get('supplier').valueChanges.pipe(
      debounceTime(100),distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.smsservice.getCustomerStateFilter(1,value).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.supplierList=data['data'];
    });
   
    this.smsassetcat=this.fb.group({
      // 'subcat':new FormControl(''),
      'asset_name':new FormControl(''),
      // 'cat':new FormControl('')
    });
    // this.smsservice.getassetcategorynew('',1).subscribe(data=>{
    //   this.categorylist=data['data'];
    // });
    // this.smsassetcat.get('subcat').valueChanges.pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   map(()=>{
    //     this.isLoading=true;
    //   }),
    //   switchMap((value:any)=>this.smsservice.getassetcategorynew( this.smsassetcat.get('subcat').value,1).pipe(
    //     finalize(()=>{
    //       this.isLoading=false;
    //     })
    //   ))
    // ).subscribe(data=>{
    //   console.log(data);
    //   this.categorylist=data['data'];
    // });
    this.smsservice.getAMProductdropdown(1,'','').subscribe(data=>{
      this.assetnamelist=data['data'];
    });
    this.smsassetcat.get('asset_name').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.smsservice.getAMProductdropdown(1,this.smsassetcat.get('asset_name').value,'').pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      console.log(data);
      this.assetnamelist=data['data'];
    });
    this.smsservice.getAMProductdropdown(1,'','').subscribe(productdata=>{
      this.productlist=productdata['data'];
    });
    this.TicketSearch.get('asset_name').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
    
      switchMap((value:any)=>this.smsservice.getAMProductdropdown(1,value,'').pipe(
        finalize(()=>{
          console.log("value=>",value)
          this.isLoading=false;
        })
      ))
      ).subscribe(productdata=>{
        this.productlist=productdata['data'];
      });
    this.latest_date =this.datepipe.transform(this.valid_date, 'yyyy-MM-dd');
    this.getsummarydata()
  }
  // public assetcategory(data ?:assetsubcat):string | undefined{
  //   return data?data.name:undefined;
  // }
  public assetnameinterface(productdata?:product):string | undefined{
    return productdata?productdata.name:undefined;
  }
  public assetname_interface(productdata?:assetname):string | undefined{
    return productdata?productdata.name:undefined;
  }
  kyenbdata1(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }
  getsummarydata(){
  this.spinner.show();
   console.log(this.TicketSearch.value);
   let dta:any='?page='+this.presentpage;
   let data:any={
  //   "amcheader_type":'',
  //  "barcode":[],
  //  "branch_id":[]
  };
   if(this.TicketSearch.get('branch').value.id !=undefined && this.TicketSearch.get('branch').value !='' && this.TicketSearch.get('branch').value !="" ){
          data['branch_id']=[this.TicketSearch.get('branch').value.id];
          dta=dta+'&branch_id='+'['+[this.TicketSearch.get('branch').value.id]+']';
   }
   if(this.TicketSearch.get('Location').value.id !=undefined && this.TicketSearch.get('Location').value !='' && this.TicketSearch.get('Location').value !="" ){
    data['Location_id']=[this.TicketSearch.get('Location').value.id];
    dta=dta+'&Location_id='+this.TicketSearch.get('Location').value.id;
 }
//  if(this.TicketSearch.get('branch').value.id !=undefined && this.TicketSearch.get('branch').value !='' && this.TicketSearch.get('branch').value !="" ){
//         data['branch_id']=[this.TicketSearch.get('branch').value.id];
//         dta=dta+'&branch_id='+'['+[this.TicketSearch.get('branch').value.id]+']';
//  }
   if(this.TicketSearch.get('amc').value !=undefined && this.TicketSearch.get('amc').value !=null && this.TicketSearch.get('amc').value !=''){
    data['amcheader_type']=this.TicketSearch.get('amc').value;
    dta=dta+'&amcheader_type='+this.TicketSearch.get('amc').value;
   }
   if(this.TicketSearch.get('assetid').value !=undefined && this.TicketSearch.get('assetid').value !=null && this.TicketSearch.get('assetid').value !=''){
    data['barcode']=[this.TicketSearch.get('assetid').value];
    dta=dta+'&asset_id='+this.TicketSearch.get('assetid').value;
   }

   if(this.TicketSearch.get('asset_name').value !=undefined && this.TicketSearch.get('asset_name').value !=null && this.TicketSearch.get('asset_name').value !=''){
    data['id']=[this.TicketSearch.get('asset_name').value.id];
    dta=dta+'&product_id='+this.TicketSearch.get('asset_name').value.id;
   }
   console.log('product=',dta)
   if(this.TicketSearch.get('assetserialno').value !=undefined && this.TicketSearch.get('assetserialno').value !=null && this.TicketSearch.get('assetserialno').value !=''){
    data['asserialno']=this.TicketSearch.get('assetserialno').value.assetserialno;
    dta=dta+'&assetserialno='+this.TicketSearch.get('assetserialno').value.assetserialno;;
   }
   if(this.TicketSearch.get('vendor').value !=undefined && this.TicketSearch.get('vendor').value !=null && this.TicketSearch.get('vendor').value !=''){
    data['asserialno']=this.TicketSearch.get('vendor').value.id;
    dta=dta+'&supplier_id='+this.TicketSearch.get('vendor').value.id;;
   }
   console.log('asserialno=',dta)
  // //  let data:any={"amcheader_type":this.TicketSearch.get('amc').value,
  //  "barcode":[this.TicketSearch.get('assetid').value],
  //  "branch_id":[this.TicketSearch.get('branch').value.id]};
  //  this.spinner.hide();
  //  this.spinner.show();
   this.smsservice.getamcticketsummary(dta).subscribe(data=>{
    this.spinner.hide();
     this.nopList=data['data'];
     if(this.nopList.length>0){
       this.totalcount=this.nopList[0]['count'];
     }
     else{
      this.totalcount=0
     }
     this.spinner.hide();
     let pagination:any=data['pagination'];
     this.has_next=pagination.has_next;
     this.has_previous=pagination.has_previous;
     this.presentpage=pagination.index;
     for(let i=0;i<this.nopList.length;i++){
       this.nopList[i]['con']=false;
     }
   },
   (error)=>{
     this.spinner.hide();
   }
   );
   return true;
  //  if(this.TicketSearch.get('branch').value.id !=undefined && this.TicketSearch.get('branch').value !='' && this.TicketSearch.get('branch').value !="" && this.TicketSearch.get('assetid').value !=undefined && this.TicketSearch.get('assetid').value !=null && this.TicketSearch.get('assetid').value !=''){
  //   let data:any={"barcode":[this.TicketSearch.get('assetid').value],
  //   "branch_id":[this.TicketSearch.get('branch').value.id]};
  //   this.spinner.hide();
  //   this.smsservice.getamcticketsummary_s(data,1).subscribe(data=>{
  //     this.nopList=data['data'];
  //     if(this.nopList.length>0){
  //       this.totalcount=this.nopList[0]['count'];
  //     }
  //     let pagination:any=data['pagination'];
  //     this.has_next=pagination.has_next;
  //     this.has_previous=pagination.has_previous;
  //     this.presentpage=pagination.index;
  //   },
  //   (error)=>{
  //     this.spinner.hide();
  //   }
  //   );
  //  }
    // let data:any={"amcheader_type":"Warrenty",
    // "branch_id":1}
    // this.smsservice.getamcticketsummary('',1).subscribe(data=>{
    //   this.nopList=data['data'];
    // })
  }
  enbdata(){
    this.enb=!this.enb;
  }
  public branchinterface(data?:branch):string | undefined{
    return data?data.name:undefined;
  }
  public locationinterface(data?:location):string | undefined{
    return data?data.name:undefined;
  }
  public asserialnointerface(data?:asserialno):string | undefined{
    return data?data.assetserialno:undefined;
  }
  public vendorinterface(data?:vendorname):string | undefined{
    return data?data.name:undefined;
  }
  addata(d:any,i:any){
      this.spinner.show();
      let barcode=d.barcode;
      let type=d.amcheader_type
      this.smsservice.barcode_status(barcode,type).subscribe(res=>{
        this.spinner.hide();
        if(res['data']==""){
          this.spinner.hide();
        }
        else{
          this.spinner.hide();
          // this.toastr.warning(res['code']);
          this.toastr.warning(res['description']);}

        

        },
        (error)=>{
          this.spinner.hide();
          this.toastr.error(error.status+error.statusText);
        }
      )


    if(this.TicketSearch.get('paid').value !=true){
      if(this.nopListnew.length==0){
        this.nopList[i]['con']=true;
        this.nopListnew.push(d);
        return true;
      }
      console.log('nopListnew',d)
      let supIndex:any=this.nopListnew.findIndex(a => a.supplier_id == d.supplier_id);
      let branchIndex:any=this.nopListnew.findIndex(a => a.branch_id.id == d.branch_id.id);
      if((supIndex !=-1)&&(branchIndex!=-1)){
        for(let i=0;i<this.nopListnew.length;i++){
          if(d['id']==this.nopListnew[i]['id']){
            this.toastr.warning('Already Inserted');
            return false;
          }
        }
        this.nopList[i]['con']=true;
        this.nopListnew.push(d);
      }
      if (supIndex ==-1){
        this.toastr.warning('Please Select The Same Vendor Name');

      }
      if (branchIndex==-1){
        this.toastr.warning('Please Select The Same Branch Name');
      }
      else{
        this.toastr.warning('Please Select The Same Vendor Name and Branch Name');
      }
      
    }
    else{
      if(this.nopListnew.length==0){
        this.nopListnew.push(d);
        this.nopList[i]['con']=true;
        return true;
      }
      for(let i=0;i<this.nopListnew.length;i++){
        if(d['id']==this.nopListnew[i]['id']){
          this.nopList[i]['con']=true;
          this.toastr.warning('Already Inserted');
          return false;
        }
      }
      this.nopListnew.push(d);
    }
    
  }
  deletedata(data:any){
    let index=this.nopListnew.findIndex(i=>i.id==data.id);
    this.nopListnew.splice(index,1);
  }
  locationdata(d){
    this.branch_id=d.id
    this.smsservice.getassetlocationdata(this.branch_id).subscribe(data=>{
      this.locationList=data['data'];
    })
  }
  autocompletecommoditybranch() {
    setTimeout(() => {
      if (
        this.matBranch &&
        this.autocompleteTrigger &&
        this.matBranch.panel
      ) {
        fromEvent(this.matBranch.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matBranch.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matBranch.panel.nativeElement.scrollTop;
            const scrollHeight = this.matBranch.panel.nativeElement.scrollHeight;
            const elementHeight = this.matBranch.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_branchnext === true) {
                this.smsservice.getamcbranchdata(this.branch.nativeElement.value,this.has_branchpage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    console.log('pagination=',results)
                    let datapagination = results["pagination"];
                    this.branchList= this.branchList.concat(datas);
                    if (this.branchList.length >= 0) {
                      this.has_branchnext = datapagination.has_next;
                      this.has_branchprevious = datapagination.has_previous;
                      this.has_branchpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  autocompleteassetlocation() {
    setTimeout(() => {
      if (
        this.matlocation &&
        this.autocompleteTrigger &&
        this.matlocation.panel
      ) {
        fromEvent(this.matlocation.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matlocation.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matlocation.panel.nativeElement.scrollTop;
            const scrollHeight = this.matlocation.panel.nativeElement.scrollHeight;
            const elementHeight = this.matlocation.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_branchnext === true) {
                this.smsservice.getassetlocationdata(this.location.nativeElement.value)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    console.log('pagination=',results)
                    let datapagination = results["pagination"];
                    this.locationList= this.locationList.concat(datas);
                    if (this.locationList.length >= 0) {
                      this.has_locationnext = datapagination.has_next;
                      this.has_locationprevious = datapagination.has_previous;
                      this.has_locationpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  createdata(){
    if(this.formTicket.get('summaryproblem').value ==undefined || this.formTicket.get('summaryproblem').value=='' || this.formTicket.get('summaryproblem').value==null){
      this.toastr.error('Please Enter The Summary Of Problem');
      return false;
    }
    if(this.formTicket.get('problemdesc').value ==undefined || this.formTicket.get('problemdesc').value=='' || this.formTicket.get('problemdesc').value==null){
      this.toastr.error('Please Enter The Problem Description');
      return false;
    }
    // if(this.TicketSearch.get('branch').value ==undefined || this.TicketSearch.get('branch').value=='' || this.TicketSearch.get('branch').value==null){
    //   this.toastr.error('Please Select the branch');
    //   return false;
    // }
    if(this.TicketSearch.get('date').value ==undefined || this.TicketSearch.get('date').value=='' || this.TicketSearch.get('date').value==null){
      this.toastr.error('Please Select the Due Date');
      return false;
    }
    if(this.nopform.get('natureop').value.id==undefined || this.nopform.get('natureop').value==undefined || this.nopform.get('natureop').value=="" || this.nopform.get('natureop').value==null ){
      this.toastr.error('Please Select The Nature of Problem');
      return false;
    }
    if(this.nopListnew.length==0){
      this.toastr.warning('Please Select The Any Data');
      return false;
    }
    let dta:any=[];
    for(let i=0;i<this.nopListnew.length;i++){
      dta.push({"assetdetails_id":this.nopListnew[i]['assetdetails_id'],"assetbarcode":this.nopListnew[i]['barcode'],
      "assetcat_id":this.nopListnew[i]['category_id'],"branch_id":this.nopListnew[i]['branch_id'].id
    });
    }
    let supplierid:any;
    if(this.enb){
      supplierid=this.TicketSearch.get('supplier').value?this.TicketSearch.get('supplier').value.id:null
    }
    else{
      supplierid=null;
    }
    this.submit_button_disable=true;
    let data:any={
      "duedate":this.datepipe.transform(this.TicketSearch.get('date').value,'yyyy-MM-dd'),
      "status":1,
      "onhold":"Y",
      "summary":this.formTicket.get('summaryproblem').value,
      "description":this.formTicket.get('problemdesc').value,
      "ticketheader_assignedto":4,
      "supplier_id":this.nopListnew[0]['supplier_id'],
      "branch_id":this.nopListnew[0]['branch_id'].id,
      "nop_id":this.nopform.get('natureop').value.id,
      "ticketdetails":dta
      }
      this.spinner.show();
      this.smsservice.getcreateticketsummary(data).subscribe(res=>{
        this.spinner.hide();
        if(res['status']=='success'){
          this.router.navigate(['/sms/smsticketsummary']);
          this.toastr.success('Successfully Created');
        }
        else{
          this.router.navigate(['/sms/smsticketsummary']);
          this.toastr.error(res['description']);
          // this.toastr.error(res['description']);
        }
      },
      (error)=>{
        this.spinner.hide();
        this.toastr.error(error.status+error.statusText);
      }
      );
  }
  checkbranch(){
    if(this.TicketSearch.get('branch').value.id ==undefined && this.TicketSearch.get('branch').value =='' && this.TicketSearch.get('branch').value =="" ){
      this.toastr.warning("Please Select Branch")
  }
}
// variable:number=0;
  addChildClickStart(d){


      if(d['con']==true){
        this.listcomments=[this.listcomments[0]];
      }
      if (d.errorcategory_parent=="Y"){
        this.parentlist=d.errorcategory_name;
      }
      else if(d.errorcategory_parent=="N"){
        this.childlist=d.errorcategory_name;
      }
      // let parent_name=dear.errorcategory_name
      let asset_name:any=this.smsassetcat.get('asset_name').value.id;
      this.smsservice.getNOPChild(this.presentpage = 1, this.pagesize = 10, d.id,asset_name).subscribe((data) => {
        console.log(data);
        this.spinner.hide();
        let datas:Array<any> = data["data"];
        if(datas.length>0){
          // this.listcomments.append(listcomments+'-'+datas);
          this.listcomments.push(datas);
          // if (d.errorcategory_parent=="Y"){
          //   this.parentlist=d.errorcategory_name;
          // }
          // else if(d.errorcategory_parent=="N"){
          //   this.childlist=d.errorcategory_name;
          // }
          // this.parentchildlist.push(this.parentlist+' - '+this.childlist)
          // this.parentchildlist=this.parentchildlist;
        
        }
        else{
          this.listcomments=this.listcomments;
        }
    
        
        
        
      },
      (error)=>{
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      })
      
  

  }
  // addParentClickStart(dear){
  //   this.parentlist=dear.errorcategory_name
  //   // this.parentchildlist=this.parentlist+' - '+this.childlist

  // }
  
   
  clicktochange(){
    // this.TicketSearch.get('amc').reset();
    console.log('h');
  }
  clicktochangedata(){
    // this.TicketSearch.get('assetid').reset();
    console.log('n');
  }
  opendialog(){
    const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.position = {
        top:  '0%'  ,
        // right: '0'
      };
      dialogConfig.width = '50%' ;
      dialogConfig.height = '500px' ;
    this.dialog.open(this.templates,dialogConfig);
    
   
  }
  getApi(){
    let asset_name:any=this.smsassetcat.get('asset_name').value.id;
    this.listcomments=[]
    this.smsservice.getTicketnopdropdown('',1,asset_name).subscribe(data=>{
     
      let datas:Array<any>=data['data']
      for(let i=0;i<datas.length;i++){
        datas[i]['con']=true;
      }
      this.listcomments.push(datas);
    });
  }
  closedialog(){
    this.dialog.closeAll();
  }
  kyenbdata(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }
  previousdata(){
    if(this.has_previous){
      this.presentpage -=1;
      this.getsummarydata();
    }
  }
  nextdata(){
    if(this.has_next){
      this.presentpage +=1;
      this.getsummarydata();
    }
  }
  autocompletecategory(){
    setTimeout(()=>{
    if(this.matcategory && this.autocompletetrigger && this.matcategory.panel){
      fromEvent(this.matcategory.panel.nativeElement,'scroll').pipe(
        map((x:any)=>this.matcategory.panel.nativeElement.scrollTop),
        takeUntil(this.autocompletetrigger.panelClosingActions)

      ).subscribe(
        x=>{
          const scrollTop = this.matcategory.panel.nativeElement.scrollTop;
          const scrollHeight = this.matcategory.panel.nativeElement.scrollHeight;
          const elementHeight = this.matcategory.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if(atBottom){
            if(this.has_nextcategory == true){
              this.smsservice.getassetcategorynew(this.inputcategory.nativeElement.value, this.has_presentcategory+1).subscribe(data=>{
                // this.assetcategorylist=data['data'];
                let datapagination=data['pagination'];
                this.categorylist=this.categorylist.concat(data['data']);
                if(this.categorylist.length>0){
                  this.has_nextcategory=datapagination.has_next;
                  this.has_previouscategory=datapagination.has_previous;
                  this.has_presentcategory=datapagination.index;
                }
              })
            }
          }
        }
      )
    }
  })
  };
  autocompleteproductname(){
    console.log('second');
    setTimeout(()=>{
      if(this.matprodAutocomplete && this.autocompleteTrigger && this.matprodAutocomplete.panel){
        fromEvent(this.matprodAutocomplete.panel.nativeElement,'scroll').pipe(
          map(x=>this.matprodAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        ).subscribe(
          x=>{
            const scrollTop=this.matprodAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight=this.matprodAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight=this.matprodAutocomplete.panel.nativeElement.clientHeight;
            const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
            if(atBottom){
             if(this.has_prodnext){
               
              this.smsservice.getAMProductdropdown( this.has_prodpresentpage+1,this.TicketSearch.get('asset_name').name,this.TicketSearch.get('asset_name').id).subscribe((data:any)=>{
                 let dear:any=data['data'];
                 console.log('second');
                 let pagination=data['pagination']
                 this.productlist=this.productlist.concat(dear);
                 if(this.productlist.length>0){
                   this.has_prodnext=pagination.has_next;
                   this.has_prodprevious=pagination.has_previous;
                   this.has_prodpresentpage=pagination.index;
                 }           
               })
             }
            }
          }
        )
      }
    })
  }
  autocompleteproduct(){
    console.log('second');
    setTimeout(()=>{
      if(this.matproductAutocomplete && this.autocompleteTrigger && this.matproductAutocomplete.panel){
        fromEvent(this.matproductAutocomplete.panel.nativeElement,'scroll').pipe(
          map(x=>this.matproductAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        ).subscribe(
          x=>{
            const scrollTop=this.matproductAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight=this.matproductAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight=this.matproductAutocomplete.panel.nativeElement.clientHeight;
            const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
            if(atBottom){
             if(this.has_prodnext){
               
              this.smsservice.getAMProductdropdown( this.has_prodpresentpage+1,this.smsassetcat.get('asset_name').name,this.smsassetcat.get('asset_name').id).subscribe((data:any)=>{
                 let dear:any=data['data'];
                 console.log('second');
                 let pagination=data['pagination']
                 this.assetnamelist=this.assetnamelist.concat(dear);
                 if(this.assetnamelist.length>0){
                   this.has_prodnext=pagination.has_next;
                   this.has_prodprevious=pagination.has_previous;
                   this.has_prodpresentpage=pagination.index;
                 }           
               })
             }
            }
          }
        )
      }
    })
  }
  autocompleteassetserialno(){
    console.log('second');
    setTimeout(()=>{
      if(this.matserialAutocomplete && this.autocompleteTrigger && this.matserialAutocomplete.panel){
        fromEvent(this.matserialAutocomplete.panel.nativeElement,'scroll').pipe(
          map(x=>this.matserialAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        ).subscribe(
          x=>{
            const scrollTop=this.matserialAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight=this.matserialAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight=this.matserialAutocomplete.panel.nativeElement.clientHeight;
            const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
            if(atBottom){
             if(this.has_prodnext){
               
              this.smsservice.getamcserialnodata( this.TicketSearch.get('assetserialno').assetserialno).subscribe((data:any)=>{
                 let dear:any=data['data'];
                 console.log('second');
                 let pagination=data['pagination']
                 this.assetserialList=this.assetserialList.concat(dear);
                 if(this.assetserialList.length>0){
                   this.has_serialnext=pagination.has_next;
                   this.has_serialprevious=pagination.has_previous;
                   this.has_serialpresentpage=pagination.index;
                 }           
               })
             }
            }
          }
        )
      }
    })
  }
  autocompletesupname(){
    console.log('second');
    setTimeout(()=>{
      if(this.matsupAutocomplete && this.autocompleteTrigger && this.matsupAutocomplete.panel){
        fromEvent(this.matsupAutocomplete.panel.nativeElement,'scroll').pipe(
          map(x=>this.matsupAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        ).subscribe(
          x=>{
            const scrollTop=this.matsupAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight=this.matsupAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight=this.matsupAutocomplete.panel.nativeElement.clientHeight;
            const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
            if(atBottom){
             if(this.has_supnext){
               
              this.smsservice.getCustomerStateFilter(this.has_suppresentpage+1,this.TicketSearch.get('vendor').value).subscribe((data:any)=>{
                 let dear:any=data['data'];
                 console.log('second');
                 let pagination=data['pagination']
                 this.vendorList=this.vendorList.concat(dear);
                 if(this.vendorList.length>0){
                   this.has_supnext=pagination.has_next;
                   this.has_supprevious=pagination.has_previous;
                   this.has_suppresentpage=pagination.index;
                 }
               })
             }
            }
          }
        )
      }
    })
  }
}
  

