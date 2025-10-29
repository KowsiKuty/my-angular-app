import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef,HostListener } from '@angular/core';
import { FormGroup, FormControl,FormArray,FormBuilder } from '@angular/forms';
import { DatePipe, formatDate} from '@angular/common';
import { fromEvent } from 'rxjs';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router'
import { SmsService } from '../sms.service'
import { SmsShareService } from '../sms-share.service';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { NgxSpinnerService } from 'ngx-spinner';
import {Observable, range} from 'rxjs';
import { finalize, map, switchMap, takeUntil, tap, startWith} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
export interface User {
  title: string;
  model:string
}
export interface property{
  id:string;
  name:string;
}
export interface assetid{
  id:string;
  name:string;
}
export interface vendorname{
  id:string;
  name:string;
  code:string;
}
export interface periodicmail{
  id:string;
  name:string;
}
export interface branch{
  id:string;
  name:string;
  code:string;
}
export interface category{
  id:string;
  subcatname:string;
}
export interface product{
  id:string;
  name:string;
}
export interface assetserialno{
  id:string;
  barcode:string;
  assetserialno:string;
}
export const PICK_FORMAT={
  parse:{dateInput:{year:'numeric',month:'short',day:'numeric'}},
  display:{
    dateInput:'input',
    monthYearLabel:{'year':'numeric',month:'short'},
    dateAllyLabel:{year:'numeric',month:'long',day:'numeric'},
    monthYearAllyLabel:{year:'numeric',month:'long'}
  }
}
class pDateAdapter extends NativeDateAdapter{
  format(date: Date, displayFormat: Object): string {
    if(displayFormat==='input'){
      return formatDate(date,'dd-MMM-yyyy',this.locale)
    }
    else{
      return date.toDateString();
    }
  }
}
interface servicePeriod {
  value: Number;
  viewValue: string;
}
@Component({
  selector: 'app-sms-amc-edit',
  templateUrl: './sms-amc-edit.component.html',
  styleUrls: ['./sms-amc-edit.component.scss']
})
export class SmsAmcEditComponent implements OnInit {
  @ViewChild('exampleModal') public exampleModal: ElementRef;
  @ViewChild('exampleModals') public exampleModals: ElementRef;

  @ViewChild( MatAutocompleteTrigger ) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('Asset_id') matassetAutocomplete: MatAutocomplete;
  @ViewChild('assetidInput') Inputassetid: any;

  @ViewChild('branchref') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchidInput') branchidInput: any;
  @ViewChild('datacate') matsubAutocomplete: MatAutocomplete;
  @ViewChild('branchidInput') subInput: any;
  @ViewChild('checkerbranchs') matsupAutocomplete: MatAutocomplete;
  @ViewChild('periodicmail') matpermailAutocomplete: MatAutocomplete;
  @ViewChild('checkerproduct') matprodAutocomplete: MatAutocomplete;
  @ViewChild('checkerassetserialno') matserialAutocomplete: MatAutocomplete;
  // @ViewChild('branchidInput') subInput: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  ctrl_branch_id: any;
  select: Date;

  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.spinner.hide();
    } 
  }
  myControl = new FormControl();
  formData:any=new FormData();
  searchdata = {
    "barcode": "",
    "branch": "",
    // "capdate": "",
    // "crnum": "",
    // "invoice_no": "",
    // "subcatname": "",
  }
  servicePeriod: servicePeriod[] = [
    {value: 1, viewValue: 'MONTHLY'},
    {value: 3, viewValue: 'QUARTERLY '},
    {value: 6, viewValue: 'HALF YEARLY,'},
    {value: 12, viewValue: 'ANNUAL'}
  ];
  servicePeriod1:any= {
    '1':'MONTHLY',
    '3': 'QUARTERLY ',
    '6': 'HALF YEARLY',
    '12': 'ANNUAL'
    };
  vendorList:Array<any>=[];
  periodicmailList:Array<any>=[];
  listcomments:Array<any> = [];
  listcomments1:Array<any> = [];
  datapagination:any=[];
  assetserialList:Array<any>=[];
  presentpagebuk: number = 1;
  presentpagebuk_new: number = 1;
  pageSize = 10;
  pageNumber:number = 1;
  currentpagecom_branch=1;
  has_nextcom_branch=true;
  has_previouscom=true;
  Asset_id:number;
  asset_name:''
  branch:number;
  latest_date: string;
  valid_date=new Date();
  pageLength_popup:any=0;
  startDate: any;
  endDate: any;
  details_total_amount:number=0;
  smscreateform:any= FormGroup;
  smseditform:any=FormGroup;
  smscreate2:any = FormGroup;
  has_previousnew:boolean=false;
  has_nextnew:boolean=false;
  fromdate = new FormControl(new Date());
  todate = new FormControl(new Date());
  isLoading = false;
  has_nextbuk:boolean=true;
  has_previousbuk:boolean=false;
  has_nextbuk_new : boolean= false;
  has_previousbuk_new :boolean= false;
  assetsave:any= FormGroup;
  frmData :any= new FormData();
  assetgroupform:any= FormGroup;
  assetgroupEDITform:any= FormGroup;
  asseteditsave:any= FormGroup;
  propertyList : Array<any>=[];
  assetidList: Array<any>=[];
  branchList: Array<any>=[];
  categoryList: Array<any>=[];
  file:any;
  checkbox:any=new FormControl('');
  has_branchnext:boolean=true;
  has_branchprevious:boolean=false;
  has_branchpresentpage:number=1;
  has_subnext:boolean=true;
  has_subprevious:boolean=false;
  has_subpresentpage:number=1;
  has_supnext:boolean=true;
  has_supprevious:boolean=false;
  has_suppresentpage:number=1;
  presentpagenew:number=1;
  productlist:Array<any>=[];
  product:number;  
	has_prodnext:boolean=true;
  has_prodprevious:boolean=false;
  has_prodpresentpage:number=1;
  has_serialnext:boolean=true;
  has_serialprevious:boolean=false;
  has_serialpresentpage:number=1;
  filteredOptions: Observable<User[]>;
  summarydata:Array<any>=[];
  capdatefrom = false;
  capdateto = false;
  first:boolean=false;
  crnum = false;
  invoice_no = false;
  subcatname = false;
  submit_button_disable:boolean=false;
  amcheaderid:any;
  
  filter_options:User[]=[{'title':"Cap Date From",'model':"capdatefrom"},
                        {'title':"Cap Date To",'model':"capdateto"},
                       {'title':"CR no",'model':"crnum"},
                       {'title':"Invoice No",'model':"invoice_no"},
                       {'title':"Asset SubCategory",'model':"subcatname"}
                      ]             

  constructor(private fb: FormBuilder, private router: Router,private toastr:ToastrService,public datepipe: DatePipe,
    private smsService: SmsService,private shareservice:SmsShareService, private spinner: NgxSpinnerService) { }
  ngO

  ngOnInit(): void {

  this.assetsave =this.fb.group({
    "listproduct":this.fb.array([
      this.fb.group({
      'remarks':new FormControl(''),
      'amount':new FormControl('')
      })
    ])

    });

    this.assetgroupform = this.fb.group({
      'Asset_id':new FormControl(),
      'branch':new FormControl(),
      'property':new FormControl(),
      'category':new FormControl(),
      'asset_name':new FormControl(),
      'assetserialno':new FormControl(),
      'type':new FormControl(),
      "capdatefrom": new FormControl(),
      "capdateto": new FormControl(),
      "crnum": new FormControl(),
      "invoice_no": new FormControl(),
      "subcatname": new FormControl(),
    });
    this.asseteditsave =this.fb.group({
      "listproduct":this.fb.array([
        this.fb.group({
        'remarks':new FormControl(''),
        'amount':new FormControl('')
        })
      ])
  
      });
  
      this.assetgroupEDITform = this.fb.group({
        'Asset_id':new FormControl(),
        'branch':new FormControl(),
        'property':new FormControl(),
        'category':new FormControl(),
        'asset_name':new FormControl(),
        'assetserialno':new FormControl(),
        'type':new FormControl(),
        "capdatefrom": new FormControl(),
        "capdateto": new FormControl(),
        "crnum": new FormControl(),
        "invoice_no": new FormControl(),
        "subcatname": new FormControl(),
      });
    let data:any=this.shareservice.smsamceditvalue.value;
    let amcheaderid=data
    this.getAMCEdit(amcheaderid);
    this.filteredOptions=this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.title)),
      map(title => (title ? this._filter(title) : this.filter_options.slice())),
    );
    this.smsService.getAMCassetiddropdown(1,'').subscribe(data=>{
      this.assetidList=data['data'];
    });
    this.assetgroupform.get('Asset_id').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.smsService.getAMCassetiddropdown(1,value).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.assetidList=data['data'];
    });
    this.smsService.getAMBranchdropdown(1,'').subscribe(data=>{
      this.branchList=data['data'];
    });
    this.assetgroupform.get('branch').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.smsService.getAMBranchdropdown(1,value).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.branchList=data['data'];
    });
    this.assetgroupform.get('property').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      // switchMap((value:any)=>this.smsService.getAMCpropertydropdown(value,1).pipe(
      switchMap((value:any)=>this.smsService.getAMCpropertydropdown(1,value).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.propertyList=data['data'];
    });
    this.smsService.getAMCategorydropdown(1,'').subscribe(data=>{
      this.categoryList=data['data'];
    });
    this.assetgroupform.get('category').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.smsService.getAMCategorydropdown(1,value).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.categoryList=data['data'];
    });
    this.smsService.getAMProductdropdown(1,'','').subscribe(productdata=>{
      this.productlist=productdata['data'];
    });
    this.assetgroupform.get('asset_name').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
    
      switchMap((value:any)=>this.smsService.getAMProductdropdown(1,value,'').pipe(
        finalize(()=>{
          console.log("value=>",value)
          this.isLoading=false;
        })
      ))
      ).subscribe(productdata=>{
        this.productlist=productdata['data'];
      });
      this.smsService.getamcserialnodata('').subscribe(data=>{
        this.assetserialList=data['data'];
      })
      this.assetgroupform.get('assetserialno').valueChanges.pipe(
  
        tap(()=>{
          this.isLoading=true;
        }),
        switchMap(value=>this.smsService.getamcserialnodata(value).pipe(
          finalize(()=>{
            this.isLoading=false;
          })
        ))
      ).subscribe(data=>{
        this.assetserialList=data['data'];
      });
    
    

    this.smscreateform = this.fb.group({
      amcHeaderName: new FormControl(),
      fromdate: new FormControl(),
      todate: new FormControl(),
      vendor: new FormControl(),
      periodicmail: new FormControl(),
      servicePeriod: new FormControl(),
      amcTotalAmount: new FormControl()
    });
    this.smseditform = this.fb.group({
      amcHeaderName: new FormControl(),
      fromdate: new FormControl(),
      todate: new FormControl(),
      vendor: new FormControl(),
      periodicmail: new FormControl(),
      servicePeriod: new FormControl(),
      amcTotalAmount: new FormControl()
    });
    this.smsService.getCustomerStateFilter(1,'').subscribe(data=>{
      this.vendorList=data['data'];
    });
    this.smscreateform.get('vendor').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.smsService.getCustomerStateFilter(1,value).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.vendorList=data['data'];
    });
    this.smsService.getperiodicmailFilter('').subscribe(data=>{
      this.periodicmailList=data['data'];
    });
    this.smscreateform.get('periodicmail').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.smsService.getperiodicmailFilter(value).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.periodicmailList=data['data'];
    });
    this.smscreate2 = this.fb.group({
      remarks: new FormControl(),
      amcamount: new FormControl()
    });

    // this.smscreateform =new FormGroup({
    //   'amcHeaderName':new FormControl(),
    //   'fromdate':new FormControl(),
    //   'todate':new FormControl(),
    //   'vendor':new FormControl(),
    //   'servicePeriod':new FormControl(),
    //   'amcTotalAmount':new FormControl()
    // });
    (this.assetsave.get('listproduct') as FormArray).clear();
    // this.finalSubmitted();
  
    this.latest_date =this.datepipe.transform(this.valid_date, 'yyyy-MM-dd');
  }
  
  public propertyintreface(data?:property):string | undefined{
    return data?data.name:undefined;
  }
  public assetidintreface(data?:assetid):string | undefined{
    return data?data.name:undefined;
  }
  public branchintreface(data?:branch):string | undefined{
    return data?data.code +' - '+data.name:undefined;
  }
  public categoryintreface(data?:category):string | undefined{
    return data?data.subcatname:undefined;
  }
  public vendorinterface(data?:vendorname):string | undefined{
    return data?data.code +' - '+data.name:undefined;
  }
  public periodicinterface(data?:periodicmail):string | undefined{
    return data?data.name:undefined;
  }
  createAMC(){
    this.router.navigate(['/sms/smsamccreate'], { skipLocationChange: true })
  }
  onDateChange(){
    this.latest_date=this.datepipe.transform(this.smscreateform.get('fromdate').value,'dd-MMM-yyyy');
  }
  createWarranty(){
    this.router.navigate(['/sms/smswarrantycreate'], { skipLocationChange: true })
  }

  autocompleteScroll_branch(){

  }
  public assetnameinterface(productdata?:product):string | undefined{
    return productdata?productdata.name:undefined;
  }
  public asserialnointerface(data?:assetserialno):string | undefined{
    return data?data.assetserialno:undefined;
  }
  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.filter_options.filter(option => option.title.toLowerCase().includes(filterValue));
}

  bukpreviousClick() {
    if (this.has_previousbuk === true) {
      this.presentpagebuk -=1;
      this.finalSubmitted_search(this.presentpagebuk);
    }
  }

  buknextClick() {
    if (this.has_nextbuk === true) {
      this.presentpagebuk +=1;
      this.finalSubmitted_search(this.presentpagebuk);
    }
  }
  resetsummarydata(){
    this.presentpagebuk=1;
    this.assetgroupform.reset('');
    this.finalSubmitted();
  }
  amountdata(event:any,i:any,d:any){
    let ds:any=new RegExp(/[-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/)
    console.log(ds.test(event.key))
    if(ds.test(event.key)==true){
      return false;
    }
    let total:number=0;
    let length:any=Number((this.assetsave.get('listproduct') as FormArray).length);
    for(let j=0;j<length;j++){
      total =total+Number(((this.assetsave.get('listproduct') as FormArray).at(j) as FormGroup).get('amount').value);
    }
    if(Number(total)==Number(this.smscreateform.value.amcTotalAmount)){
      this.details_total_amount=total;
    }
    else{
      this.details_total_amount=total;
    }
    return true;
  }
  delete(data:any,idx:any){
    let index=this.listcomments1.findIndex(i=>i.id==data.id);
    this.listcomments1.splice(index,1);
    let indexs=this.listcomments.findIndex(i=>i.id==data.id);
    this.listcomments[indexs]['con']=false;
    (this.assetsave.get('listproduct') as FormArray).removeAt(idx);
    let len:any=(Number(this.smscreateform.get('amcTotalAmount').value)/this.listcomments1.length).toFixed(2);
    for(let i=0;i<this.listcomments1.length;i++){
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('amount').patchValue(len);
    }
    let total:number=0;
    let length:any=Number((this.assetsave.get('listproduct') as FormArray).length);
    for(let j=0;j<length;j++){
      total =total+Number(((this.assetsave.get('listproduct') as FormArray).at(j) as FormGroup).get('amount').value);
    }
    if(Number(total)==Number(this.smscreateform.value.amcTotalAmount)){
      this.details_total_amount=total;
    }
  }
  active(){

  }
  edit(d:any,i:any){
    this.listcomments[i]['con']=true;
    if(this.listcomments1.length==0){
      this.listcomments1.push(d);
      (this.assetsave.get('listproduct') as FormArray).push(this.fb.group({
        'amount':new FormControl(''),
        'remarks':new FormControl('')
      }));
      return true;
    }


    // if(this.TicketSearch.get('paid').value !=true){
      if(this.listcomments1.length==0){
        this.listcomments[i]['con']=true;
        this.listcomments1.push(d);
        return true;
      }
      console.log('nopListnew',d)
      if(this.listcomments1.length>0){
      let supIndex:any=this.listcomments1.findIndex(a => a.supplier_id == d.supplier_id);
      let branchIndex:any=this.listcomments1.findIndex(a => a.branch_id.id == d.branch_id.id);
      if((supIndex !=-1)&&(branchIndex!=-1)){
        for(let i=0;i<this.listcomments1.length;i++){
          if(d['id']==this.listcomments1[i]['id']){
            this.toastr.warning('Already Inserted');
            return false;
          }
        }
        this.listcomments[i]['con']=true;
        this.listcomments1.push(d);
      }
      // if (supIndex ==-1){
      //   this.toastr.warning('Please Select The Same Vendor Name');

      // }
      if (branchIndex==-1){
        this.listcomments[i]['con']=false;
        this.toastr.warning('Please Select The Same Branch Name');
        
      }
      // else{
      //   this.toastr.warning('Please Select The Same Vendor Name and Branch Name');
      // }
    // }
    }
    else{
      if(this.listcomments1.length==0){
        this.listcomments1.push(d);
        this.listcomments[i]['con']=true;
        return true;
      }
      for(let i=0;i<this.listcomments1.length;i++){
        if(d['id']==this.listcomments1[i]['id']){
          this.listcomments[i]['con']=true;
          this.toastr.warning('Already Inserted');
          return false;
        }
      }
      this.listcomments1.push(d);
    }
    
  }

  // edit(data:any,i:any){
  //   this.listcomments[i]['con']=true;
  //   if(this.listcomments1.length==0){
  //     this.listcomments1.push(data);
  //     (this.assetsave.get('listproduct') as FormArray).push(this.fb.group({
  //       'amount':new FormControl(''),
  //       'remarks':new FormControl('')
  //     }));
  //     return true;
  //   }
   
  //   for(let i=0;i<this.listcomments1.length;i++){
  //     let supIndex:any=this.listcomments1.findIndex(a => a.supplier_id == data.supplier_id);
  //     let branchIndex:any=this.listcomments1.findIndex(a => a.branch_id.id == data.branch_id.id);
  //     if((supIndex !=-1)&&(branchIndex!=-1)){
  //       for(let i=0;i<this.listcomments1.length;i++){
  //         if(data['id']==this.listcomments1[i]['id']){
  //           this.toastr.warning('Already Inserted');
  //           return false;
  //         }
  //       }
  //       // this.listcomments1[i]['con']=true;
  //       // this.listcomments1.push(d);
  //     }
  //     if (supIndex ==-1){
  //       this.listcomments1.push(data);
  //       this.toastr.warning('Please Select The Same Vendor Name');

  //     }
  //     if (branchIndex==-1){
  //       this.listcomments1.push('');
  //       this.toastr.warning('Please Select The Same Branch Name');
  //     }
  //     else{
  //       this.listcomments1.push('');
  //       this.toastr.warning('Please Select The Same Vendor Name and Branch Name');
  //     }
      
  //     if(data['id']==this.listcomments1[i]['id']){
  //       this.toastr.warning('Already Inserted');
  //       return false;
  //     }
  //   }
  //   this.listcomments1.push(data);
  //   (this.assetsave.get('listproduct') as FormArray).push(this.fb.group({
  //     'amount':new FormControl(''),
  //     'remarks':new FormControl('')
  //   }));
  // }

  createsms(){

  }

  createsms2(){
    
  }

  servicePeriodSMSEdit(d:any){

  }

  finalSubmitted(){
    let branch:any='';
    if(this.assetgroupform.get('branch').value!=null && this.assetgroupform.get('branch').value.id!=undefined){
      branch=this.assetgroupform.get('branch').value.id;
    }
    else{
      branch=this.assetgroupform.get('branch').value ? this.assetgroupform.get('branch').value:'';
    }
    // let branch:any=this.assetgroupform.get('branch').value?this.assetgroupform.get('branch').value.id:'';
    let barcode:any=this.assetgroupform.get('Asset_id').value?this.assetgroupform.get('Asset_id').value:'';
    let subcatname:any=this.assetgroupform.get('category').value?this.assetgroupform.get('category').value.subcategory_id.id:'';

    if (this.assetgroupform.value['asset_name']!=undefined && this.assetgroupform.value['asset_name']!=null && this.assetgroupform.value['asset_name']!='' && this.assetgroupform.value['asset_name']!=""){
      var asset_name1:any=this.assetgroupform.value['asset_name']?this.assetgroupform.value['asset_name']:'';
      if (typeof(asset_name1)=='object'){
        var asset_name:any=this.assetgroupform.get('asset_name').value.id?this.assetgroupform.get('asset_name').value.id:'';


      }
      else{
      var asset_name:any=this.assetgroupform.value['asset_name']?this.assetgroupform.value['asset_name']:'';
      }
    }
    else{
      var asset_name:any=this.assetgroupform.get('asset_name').value?this.assetgroupform.get('asset_name').value.id:'';
    }
    if (this.assetgroupform.value['assetserialno']!=undefined && this.assetgroupform.value['assetserialno']!=null && this.assetgroupform.value['assetserialno']!='' && this.assetgroupform.value['assetserialno']!=""){
      var assetserialno1:any=this.assetgroupform.value['assetserialno']?this.assetgroupform.value['assetserialno']:'';
      if (typeof(assetserialno1)=='object'){
        var assetserialno:any=this.assetgroupform.get('assetserialno').value.id?this.assetgroupform.get('assetserialno').value.id:'';


      }
      else{
      var assetserialno:any=this.assetgroupform.value['assetserialno']?this.assetgroupform.value['assetserialno']:'';
      }
    }
    else{
      var assetserialno:any=this.assetgroupform.get('assetserialno').value?this.assetgroupform.get('assetserialno').value.id:'';
    }
    // let assetserialno:any=this.assetgroupform.get('assetserialno').value?this.assetgroupform.get('assetserialno').value.assetserialno:'';
    let type:any=this.assetgroupform.get('type').value?this.assetgroupform.get('type').value.type:'AMC';
    
    console.log('capdatefrom',this.datepipe.transform(this.assetgroupform.value.capdatefrom, 'yyyy-MM-dd'))
    let capdatefrom:any=this.datepipe.transform(this.assetgroupform.value.capdatefrom, 'yyyy-MM-dd')?this.datepipe.transform(this.assetgroupform.value.capdatefrom, 'yyyy-MM-dd'):'';
    console.log('capdateto',this.datepipe.transform(this.assetgroupform.value.capdateto, 'yyyy-MM-dd'))
    let capdateto:any=this.datepipe.transform(this.assetgroupform.value.capdateto, 'yyyy-MM-dd')?this.datepipe.transform(this.assetgroupform.value.capdateto, 'yyyy-MM-dd'):'';
    let invoice_no:any=this.assetgroupform.get('invoice_no').value?this.assetgroupform.get('invoice_no').value:'';
    console.log('inv',this.assetgroupform.get('invoice_no').value?this.assetgroupform.get('invoice_no').value:'')
    let crnum:any=this.assetgroupform.get('crnum').value?this.assetgroupform.get('crnum').value:'';
    console.log('cr',this.assetgroupform.get('crnum').value?this.assetgroupform.get('crnum').value:'')


    //this.searchdata.capend_date=this.datepipe.transform(this.fasearchform.value.capend_date, 'yyyy-MM-dd')
    this.presentpagebuk=1;
    this.spinner.show();
    this.smsService.getAMCsummary(this.presentpagebuk,barcode,branch,subcatname,asset_name,assetserialno,type,capdatefrom,capdateto,crnum,invoice_no).subscribe(data=>{

      if (data['code']!=undefined && data['code']!=''){
        this.toastr.warning(data['description']);
        this.toastr.warning(data['code']);
      }
      else{
      this.listcomments=data['data'];
      if(this.listcomments.length>0){
        this.pageLength_popup=this.listcomments[0]['count'];
      }
      for(let i=0;i<this.listcomments.length;i++){
        this.listcomments[i]['con']=false;
      }
      this.spinner.hide();
      let paguination=data['pagination'];
      this.has_previousbuk=paguination.has_previous;
      this.has_nextbuk=paguination.has_next;
      this.presentpagebuk=paguination.index;
    }
  },
    (error)=>{
      this.toastr.error(error.code+error.description);
      this.toastr.error(error.description);
      this.spinner.hide();
    })
  }
  finalSubmitted_search(page:any){
    let branch:any=this.assetgroupform.get('branch').value?this.assetgroupform.get('branch').value.id:'';
    let barcode:any=this.assetgroupform.get('Asset_id').value?this.assetgroupform.get('Asset_id').value:'';
    let subcatname:any=this.assetgroupform.get('category').value?this.assetgroupform.get('category').value.id:'';
    let asset_name:any=this.assetgroupform.get('asset_name').value?this.assetgroupform.get('asset_name').value.id:'';
    let assetserialno:any=this.assetgroupform.get('assetserialno').value?this.assetgroupform.get('assetserialno').value.assetserialno:'';

    //let type:any='AMC'
    

    let type:any=this.assetgroupform.get('type').value?this.assetgroupform.get('type').value.type:'AMC';

    console.log('capdatefrom',this.datepipe.transform(this.assetgroupform.value.capdatefrom, 'yyyy-MM-dd'))
    let capdatefrom:any=this.datepipe.transform(this.assetgroupform.value.capdatefrom, 'yyyy-MM-dd')?this.datepipe.transform(this.assetgroupform.value.capdatefrom, 'yyyy-MM-dd'):'';    
    console.log('capdateto',this.datepipe.transform(this.assetgroupform.value.capdateto, 'yyyy-MM-dd'))
    let capdateto:any=this.datepipe.transform(this.assetgroupform.value.capdateto, 'yyyy-MM-dd')?this.datepipe.transform(this.assetgroupform.value.capdateto, 'yyyy-MM-dd'):'';    
    let invoice_no:any=this.assetgroupform.get('invoice_no').value?this.assetgroupform.get('invoice_no').value:'';
    console.log(this.assetgroupform.get('invoice_no').value?this.assetgroupform.get('invoice_no').value:'')
    let crnum:any=this.assetgroupform.get('crnum').value?this.assetgroupform.get('crnum').value:'';
    console.log(this.assetgroupform.get('crnum').value?this.assetgroupform.get('crnum').value:'')
    this.spinner.show();
    this.presentpagebuk=this.presentpagebuk?page:''
    this.smsService.getAMCsummary(this.presentpagebuk,barcode,branch,subcatname,asset_name,assetserialno,type,capdatefrom,capdateto,crnum,invoice_no).subscribe(data=>{

      if (data['code']!=undefined && data['code']!=''){
        this.toastr.warning(data['description']);
        this.toastr.warning(data['code']);
      }
      else{
      this.listcomments=data['data'];
      if(this.listcomments.length>0){
        this.pageLength_popup=this.listcomments[0]['count'];
      }
      for(let i=0;i<this.listcomments.length;i++){
        this.listcomments[i]['con']=false;
      }
      this.spinner.hide();
      let paguination=data['pagination'];
      this.has_previousbuk=paguination.has_previous;
      this.has_nextbuk=paguination.has_next;
      this.presentpagebuk=paguination.index;
    }
  },
  (error)=>{
    this.toastr.error(error.code+error.description);
    this.toastr.error(error.description);
    this.spinner.hide();
 
  });
  }
  resetdata(){
    this.assetgroupform.reset('');
    this.finalSubmitted_search(1);
  }

  savesub(){

  }
  uploaddata(event:any){
    console.log(event.target.files.length);
    this.formData.append('file',event.target.files[0])
  }
  approvedata(){
    if(this.smscreateform.get('amcTotalAmount').value ==undefined || this.smscreateform.get('amcTotalAmount').value =="" || this.smscreateform.get('amcTotalAmount').value ==''){
      this.toastr.error('Please Enter The AmcTotalAmount');
      return false;
    }
    if(Number(this.smscreateform.value.amcTotalAmount.toFixed(2))==Number(this.details_total_amount.toFixed(2))){
      
    }
    else{
      this.toastr.warning('Please Enter  The AMC Total Amount and  AMC Detail Total Amount');
      return false;
    }
    if(this.smscreateform.get('amcHeaderName').value ==undefined || this.smscreateform.get('amcHeaderName').value =="" || this.smscreateform.get('amcHeaderName').value ==''){
      this.toastr.error('Please Enter The AMC Header Name');
      return false;
    }
    if(this.smscreateform.get('fromdate').value ==undefined || this.smscreateform.get('fromdate').value =="" || this.smscreateform.get('fromdate').value ==''){
      this.toastr.error('Please Enter The From Date');
      return false;
    }
    if(this.smscreateform.get('todate').value ==undefined || this.smscreateform.get('todate').value =="" || this.smscreateform.get('todate').value ==''){
      this.toastr.error('Please Enter The AMC To Date');
      return false;
    }
    if(this.smscreateform.get('vendor').value ==undefined || this.smscreateform.get('vendor').value =="" || this.smscreateform.get('vendor').value =='' || this.smscreateform.get('vendor').value.id ==undefined || this.smscreateform.get('vendor').value.id =="" || this.smscreateform.get('vendor').value.id ==''){
      this.toastr.error('Please Select The AMC Vendor Name');
      return false;
    }
    if(this.smscreateform.get('servicePeriod').value ==undefined || this.smscreateform.get('servicePeriod').value =="" || this.smscreateform.get('servicePeriod').value ==''){
      this.toastr.error('Please Select The ServicePeriod');
      return false;
    }
    if(this.smscreateform.get('amcTotalAmount').value ==undefined || this.smscreateform.get('amcTotalAmount').value =="" || this.smscreateform.get('amcTotalAmount').value ==''){
      this.toastr.error('Please Enter The AmcTotalAmount');
      return false;
    }
    if(this.smscreateform.get('periodicmail').value ==undefined || this.smscreateform.get('periodicmail').value =="" || this.smscreateform.get('periodicmail').value =='' || this.smscreateform.get('periodicmail').value.id ==undefined || this.smscreateform.get('periodicmail').value.id =="" || this.smscreateform.get('periodicmail').value.id ==''){
      this.toastr.error('Please Select The Periodic Mail Field');
      return false;
    }
    this.submit_button_disable=true;
    let detailsdata:Array<any>=[];
    let filterdata:any={};
    if(this.listcomments1.length==0){
      this.toastr.error('Please Select Any One Data:');
      return false;
    }
    for(let i=0;i<this.listcomments1.length;i++){
      console.log(typeof this.listcomments1[i]['product_id']);
      if ('category_id' in this.listcomments1[i]['product_id']){
          filterdata={'branch_id':this.listcomments1[i]['branch_id'].id,
          "amcdetails_amcamt":((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('amount').value,
          "category_id":this.listcomments1[i]['product_id']['category_id'].id ,
          "product_id":this.listcomments1[i]['product_id'].id,
          "assetlocation_id":this.listcomments1[i]['assetlocation_id'],
          "barcode":this.listcomments1[i]['assetdetails_id'],
          "remarks":((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('remarks').value,
          "status":"1"
        }
        }
      else{
        filterdata={'branch_id':this.listcomments1[i]['branch_id'].id,
          "amcdetails_amcamt":((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('amount').value,
          "category_id":this.listcomments1[i]['product_id'].id,
          "product_id":'None',
          "assetlocation_id":0,
          "barcode":this.listcomments1[i]['assetdetails_id'],
          "remarks":((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('remarks').value,
          "status":"1"
      
    }
        };
        // if (this.listcomments1[i]['product_id']['category_id'].id==undefined){
        //   "category_id":this.listcomments1[i]['product_id']['category_id'].id ? "category_id":this.listcomments1[i]['product_id'].id,
        // }
        detailsdata.push(filterdata);
    };
    let d:any={
      "amcheader_type":"AMC",
      "old_amc_code": "", 
      "amcheader_name":this.smscreateform.get('amcHeaderName').value,
      "supplier_id":this.smscreateform.get('vendor').value.id,
      "amcheader_period_from":this.datepipe.transform(this.smscreateform.get('fromdate').value,'yyyy-MM-dd'),
      "amcheader_period_to":this.datepipe.transform(this.smscreateform.get('todate').value,'yyyy-MM-dd'),
      "serviceperiod":this.smscreateform.get('servicePeriod').value,
      "amcheader_amctotalamt":this.smscreateform.get('amcTotalAmount').value,
      "status":1,
      "periodicmail":this.smscreateform.get('periodicmail').value.id,
      "amc_details":detailsdata
    }
    this.formData.append('data',JSON.stringify(d));
    this.spinner.show();
    this.smsService.getAMCcreate(this.formData).subscribe(resulr=>{
      this.spinner.hide();
      if (resulr.status=="success"){
        this.toastr.success(resulr.message);
        this.router.navigate(['/sms/smsmakersummary']);
        // this.router.navigate(['/sms/smsamccreate'])

      }
      if (resulr.code=="INVALID_DATA"){
        this.toastr.error(resulr.description);
        this.router.navigate(['/sms/smsamccreate'])
    }
    },
    (error)=>{
      this.toastr.error(error.status+error.statusText);
      this.spinner.hide();
    }
    )
      // "amc_details":[{"branch_id":"5","amcdetails_amcamt":"1000","category_id":"1","barcode":"KVB250","remarks":"Testing","status":"1"}]
  
  }
  splitequal(event){
    

    if(this.smscreateform.get('amcTotalAmount').value==null || this.smscreateform.get('amcTotalAmount').value==undefined || this.smscreateform.get('amcTotalAmount').value=='' || Number(this.smscreateform.get('amcTotalAmount').value)==0){
      this.toastr.warning('Please Enter The Amount');
      event.preventDefault();
      return false;
    }
    if(this.listcomments1.length==0){
      this.toastr.warning('Please Add The Data');
      event.preventDefault();
      return false;
    }
    if (event.target.checked == true)
      console.log(this.assetsave.value);
      let len:any=(Number(this.smscreateform.get('amcTotalAmount').value)/this.listcomments1.length).toFixed(2);
      for(let i=0;i<this.listcomments1.length;i++){
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).patchValue({'amount':len});
      }
    

    if (event.target.checked == false){
        let len:any=(Number(this.smscreateform.get('amcTotalAmount').value)/this.listcomments1.length).toFixed(2);
        for(let i=0;i<this.listcomments1.length;i++){
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).patchValue({'amount':''});
      }

      }
    let total:number=0;
    let length:any=Number((this.assetsave.get('listproduct') as FormArray).length);
    for(let j=0;j<length;j++){
      total =total+Number(((this.assetsave.get('listproduct') as FormArray).at(j) as FormGroup).get('amount').value);
    }
    if(Number(total)==Number(this.smscreateform.value.amcTotalAmount)){
      this.details_total_amount=total;
    }
  }
  // else{
  //   let len:any=(Number(this.smscreateform.get('amcTotalAmount').value)/this.listcomments1.length).toFixed(2);
  //   for(let i=0;i<this.listcomments1.length;i++){
  //     ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).patchValue({'amount':0});
  //   }
  //   let total:number=0;
  //   let length:any=Number((this.assetsave.get('listproduct') as FormArray).length);
  //   this.details_total_amount=0;
    
  // }
  // }
  kyenbdata(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }
  kyentdata(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?-]+/)
    console.log(d.test(event.key))
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }
  autocompletebranchname(){
    console.log('second');
    setTimeout(()=>{
      if(this.matbranchAutocomplete && this.autocompleteTrigger && this.matbranchAutocomplete.panel){
        fromEvent(this.matbranchAutocomplete.panel.nativeElement,'scroll').pipe(
          map(x=>this.matbranchAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        ).subscribe(
          x=>{
            const scrollTop=this.matbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight=this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight=this.matbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
            if(atBottom){
             if(this.has_branchnext){
               
              this.smsService.getAMBranchdropdown( this.has_branchpresentpage+1,this.assetgroupform.get('branch').value).subscribe((data:any)=>{
                 let dear:any=data['data'];
                 console.log('second');
                 let pagination=data['pagination']
                 this.branchList=this.branchList.concat(dear);
                 if(this.branchList.length>0){
                   this.has_branchnext=pagination.has_next;
                   this.has_branchprevious=pagination.has_previous;
                   this.has_branchpresentpage=pagination.index;
                 }
               })
             }
            }
          }
        )
      }
    })
  }
  autocompletesubname(){
    console.log('second');
    setTimeout(()=>{
      if(this.matsubAutocomplete && this.autocompleteTrigger && this.matsubAutocomplete.panel){
        fromEvent(this.matsubAutocomplete.panel.nativeElement,'scroll').pipe(
          map(x=>this.matsubAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        ).subscribe(
          x=>{
            const scrollTop=this.matsubAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight=this.matsubAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight=this.matsubAutocomplete.panel.nativeElement.clientHeight;
            const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
            if(atBottom){
             if(this.has_subnext){
               
              this.smsService.getAMCassetiddropdown(this.has_subpresentpage+1,this.assetgroupform.get('category').value).subscribe((data:any)=>{
                 let dear:any=data['data'];
                 console.log('second');
                 let pagination=data['pagination']
                 this.assetidList=this.assetidList.concat(dear);
                 if(this.assetidList.length>0){
                   this.has_subnext=pagination.has_next;
                   this.has_subprevious=pagination.has_previous;
                   this.has_subpresentpage=pagination.index;
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
               
              this.smsService.getCustomerStateFilter(this.has_suppresentpage+1,this.smscreateform.get('vendor').value).subscribe((data:any)=>{
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
               
              this.smsService.getAMProductdropdown( this.has_prodpresentpage+1,this.assetgroupform.get('asset_name').name,this.assetgroupform.get('asset_name').id).subscribe((data:any)=>{
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
               
              this.smsService.getamcserialnodata( this.assetgroupform.get('assetserialno').assetserialno).subscribe((data:any)=>{
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
  fromDateSelection(event: string) {

    const date = new Date(event)
    this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }
  filter_flags(ev,fg){
    console.log(fg)
  }
  selectionChange(event) {
    if (event.isUserInput && event.source.selected == false) {
      // let index = this.selectedValues.indexOf(event.source.value);
      // this.selectedValues.splice(index, 1)
      if(event.source.value.model=='capdatefrom'){
        this.capdatefrom=false;
        this.assetgroupform.value.capdatefrom='';
      }
      if(event.source.value.model=='capdateto'){
        this.capdateto=false;
        this.assetgroupform.value.capdateto='';
      }
      if(event.source.value.model=='crnum'){
        this.crnum=false;
        this.assetgroupform.value.crnum='';
      }
      if(event.source.value.model=='invoice_no'){
        this.invoice_no=false;
        this.assetgroupform.value.invoice_no='';
      }
      if(event.source.value.model=='subcatname'){
        this.subcatname=false;
        this.assetgroupform.value.subcatname='';
      }
     
    
    }
    else if(event.isUserInput && event.source.selected == true){
  
      if(event.source.value.model=='capdatefrom'){
        this.capdatefrom=true;
      }
      if(event.source.value.model=='capdateto'){
        this.capdateto=true;
      }
      if(event.source.value.model=='crnum'){
        this.crnum=true;
      }
      if(event.source.value.model=='invoice_no'){
        this.invoice_no=true;
      }
      if(event.source.value.model=='subcatname'){
        this.subcatname=true;
      }
     
    }
  
}
getAMCEdit(amcheaderid:any) {
  this.spinner.show();
    this.smsService.getamcapprovalsummaryselect(amcheaderid, this.presentpagenew).subscribe(res=>{
      this.spinner.hide();
     
      this.smseditform.patchValue({'amcHeaderName':res.amcheader_name,'fromdate':res.amcheader_period_from,
    'todate':res.amcheader_period_to,'vendor':{'code':res.supplier_code,'name':res.supplier_name},
      'amcTotalAmount':res.amcheader_amctotalamt,'periodicmail':{'name':res.periodic_mail}
    });
    this.smseditform.patchValue({'servicePeriod':{'viewValue':this.servicePeriod1[res.serviceperiod]}})
    // this.file=res.file
    // if(res['data']['data'].length>0){
    //   this.summarydata=res['data']['data'];
    //   let pagination:any=res['data']['pagination'];

    //   console.log(pagination)
    // this.has_previousnew=pagination.has_previous;
    // this.has_nextnew=pagination.has_next;
    // this.presentpagenew=pagination.index;
    // }
    // else{
    //   this.summarydata=[];
    // }
    });
    

}
}
