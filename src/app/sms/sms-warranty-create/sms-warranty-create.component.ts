import { DatePipe, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild,ViewChildren, QueryList } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { finalize, map, switchMap, takeUntil, tap,startWith } from 'rxjs/operators';
import { SmsService } from '../sms.service';
import {Observable, range} from 'rxjs';
import { environment } from 'src/environments/environment';


export interface User {
  title: string;
  model:string
}
export interface periodicmail{
  id:string;
  name:string;
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
export interface branch{
  id:string;
  name:string;
  code:string
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
  selector: 'app-sms-warranty-create',
  templateUrl: './sms-warranty-create.component.html',
  styleUrls: ['./sms-warranty-create.component.scss'],
  providers:[
    {provide:DateAdapter,useClass:pDateAdapter},
    {provide:MAT_DATE_FORMATS,useValue:PICK_FORMAT}
    
  ]
})
export class SmsWarrantyCreateComponent implements OnInit {
 
  @ViewChild('exampleModal') public exampleModal: ElementRef;
  @ViewChild('exampleModals') public exampleModals: ElementRef;

  @ViewChild( MatAutocompleteTrigger ) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('Asset_id') matassetAutocomplete: MatAutocomplete;
  @ViewChild('assetidInput') Inputassetid: any;

  @ViewChild('branchref') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchidInput') branchidInput: any;
  @ViewChild('checkerbranchs') matsupAutocomplete: MatAutocomplete;
  @ViewChild('datacate') matsubAutocomplete: MatAutocomplete;
  @ViewChild('branchidInput') subInput: any;
  @ViewChild('checkerproduct') matprodAutocomplete: MatAutocomplete;
  @ViewChild('periodicmail') matpermailAutocomplete: MatAutocomplete;
  @ViewChild('checkerassetserialno') matserialAutocomplete: MatAutocomplete;

  
  @ViewChild('closedbuttons') closedbuttons;
  @ViewChildren('fileInput') fileInput: QueryList<ElementRef>
  @ViewChild('fileInput', { static: false }) InputVars: ElementRef;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  ctrl_branch_id: any;
  select: Date;

  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    console.log('welcome',event.code);
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
  myControl = new FormControl();
  formData:any=new FormData();
  searchdata = {
    "barcode": "",
    "branch": "",
  }
  servicePeriod: servicePeriod[] = [
    {value: 1, viewValue: 'MONTHLY'},
    {value: 3, viewValue: 'QUARTERLY '},
    {value:4, viewValue: 'THRICE IN A YEAR'},
    {value: 6, viewValue: 'HALF YEARLY'},
    {value: 12, viewValue: 'ANNUAL'}
  ];
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
  asset_name:any
  branch:number;
  latest_date: string;
  valid_date=new Date();
  pageLength_popup:any;
  startDate: any;
  endDate: any;
  frmData :any= new FormData();
  has_branchnext:boolean=true;
  has_branchprevious:boolean=false;
  has_branchpresentpage:number=1;
  has_subnext:boolean=true;
  has_subprevious:boolean=false;
  has_subpresentpage:number=1;
  has_supnext:boolean=true;
  has_supprevious:boolean=false;
  has_suppresentpage:number=1;
  details_total_amount:number=0;
  smscreateform:any= FormGroup;
  smscreate2:any = FormGroup;
  fromdate = new FormControl(new Date());
  todate = new FormControl(new Date());
  isLoading = false;
  has_nextbuk:boolean=true;
  has_previousbuk:boolean=false;
  has_nextbuk_new : boolean= false;
  has_previousbuk_new :boolean= false;
  assetsave:any= FormGroup;
  assetgroupform:any= FormGroup;
  propertyList : Array<any>=[];
  assetidList: Array<any>=[];
  branchList: Array<any>=[];
  categoryList: Array<any>=[];
  checkbox:any=new FormControl('');
  productlist:Array<any>=[];
  product:number;  
	has_prodnext:boolean=true;
  has_prodprevious:boolean=false;
  has_prodpresentpage:number=1;
  has_serialnext:boolean=true;
  has_serialprevious:boolean=false;
  has_serialpresentpage:number=1;
  filteredOptions: Observable<User[]>;
  capdatefrom = false;
  capdateto = false;
  first:boolean=false;
  crnum = false;
  invoice_no = false;
  subcatname = false;
  submit_button_disable:boolean=false;
  
  filter_options:User[]=[{'title':"Cap Date From",'model':"capdatefrom"},
                       {'title':"Cap Date To",'model':"capdateto"},
                       {'title':"CR no",'model':"crnum"},
                       {'title':"Invoice No",'model':"invoice_no"},
                       {'title':"Asset SubCategory",'model':"subcatname"}
                      ]
  constructor(private router: Router, private smsService: SmsService, private http: HttpClient,
    private toastr:ToastrService, private spinner: NgxSpinnerService, public datepipe: DatePipe,
    private fb: FormBuilder, route:ActivatedRoute, private el: ElementRef) { }

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
    this.myForm = this.fb.group({
      fileInputs: this.fb.array([this.filerow()])
    });
    this.filteredOptions=this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.title)),
      map(title => (title ? this._filter(title) : this.filter_options.slice())),
    );
    this.smsService.getAMCassetiddropdown(1,'').subscribe(data=>{
      this.assetidList=data['data'];
    })
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
   //   switchMap((value:any)=>this.smsService.getAMCpropertydropdown(value,1).pipe(
      switchMap((value:any)=>this.smsService.getAMCpropertydropdown(1,value).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.propertyList=data['data'];
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
    

    this.smscreateform = this.fb.group({
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
    this.smscreateform.get('vendor').valueChanges.pipe(
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
    // (this.assetsave.get('listproduct') as FormArray).clear();
    this.finalSubmitted();
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
    return data?data.code+' - '+data.name:undefined;
  }
  public assetnameinterface(productdata?:product):string | undefined{
    return productdata?productdata.name:undefined;
  }
  public asserialnointerface(data?:assetserialno):string | undefined{
    return data?data.assetserialno:undefined;
  }
  public periodicinterface(data?:periodicmail):string | undefined{
    return data?data.name:undefined;
  }
  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.filter_options.filter(option => option.title.toLowerCase().includes(filterValue));
}

  createAMC(){
    this.router.navigate(['/sms/smsamccreate'], { skipLocationChange: true })
  }

  createWarranty(){
    this.router.navigate(['/sms/smswarrantycreate'], { skipLocationChange: true })
  }

  autocompleteScroll_branch(){

  }

  bukpreviousClick() {
    if (this.has_previousbuk === true) {
      this.presentpagebuk -=1;
      this.finalSubmitted();
    }
  }

  buknextClick() {
    if (this.has_nextbuk === true) {
      this.presentpagebuk +=1;
      this.finalSubmitted();
    }
  }
  resetsummarydata(){
    this.presentpagebuk=1;
    this.assetgroupform.reset('');
    this.finalSubmitted();
  }
  amountdata(event:any,i:any,d:any){
      let ds:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]+/)
      console.log(ds.test(event.key))
      if(ds.test(event.key)==true){
        return false;
      }    
    let total:number=0;
    let length:any=Number((this.assetsave.get('listproduct') as FormArray).length);
    for(let j=0;j<length;j++){
      total =total+Number(((this.assetsave.get('listproduct') as FormArray).at(j) as FormGroup).get('amount').value);
    }
   // this.smscreateform.value.amcTotalAmount=0;
    if(Number(total)==Number(this.smscreateform.value.amcTotalAmount)){
      this.details_total_amount=total;
    }
    else{
      this.details_total_amount=total;
    }
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
    if(this.listcomments1.length>0){
      let branchIndex:any=this.listcomments1.findIndex(a => a.branch_id.id == d.branch_id.id);
     
      if (branchIndex==-1){
        this.listcomments[i]['con']=false;
        this.toastr.warning('Please Select The Same Branch Name');
        return false;
        
      }
      else{
      this.listcomments1.push(d);
      (this.assetsave.get('listproduct') as FormArray).push(this.fb.group({
        'amount':new FormControl(''),
        'remarks':new FormControl('')
      }));
      return true;
    }
   }
   if(this.listcomments1.length==0){
    this.listcomments[i]['con']=true;
    this.listcomments1.push(d);
    return true;
  }


    // if(this.TicketSearch.get('paid').value !=true){
      // if(this.listcomments1.length==0){
      //   this.listcomments[i]['con']=true;
      //   this.listcomments1.push(d);
      //   return true;
      // }
      // console.log('nopListnew',d)
      // if(this.listcomments1.length>0){
      // let supIndex:any=this.listcomments1.findIndex(a => a.supplier_id == d.supplier_id);
      // let branchIndex:any=this.listcomments1.findIndex(a => a.branch_id.id == d.branch_id.id);
      // if((supIndex !=-1)&&(branchIndex!=-1)){
      //   for(let i=0;i<this.listcomments1.length;i++){
      //     if(d['id']==this.listcomments1[i]['id']){
      //       this.toastr.warning('Already Inserted');
      //       return false;
      //     }
      //   }
      //   this.listcomments[i]['con']=true;
      //   this.listcomments1.push(d);
      // }
      // if (supIndex ==-1){
      //   this.toastr.warning('Please Select The Same Vendor Name');

      // }
      // if (branchIndex==-1){
      //   this.listcomments[i]['con']=false;
      //   this.toastr.warning('Please Select The Same Branch Name');
        
      // }
      // else{
      //   this.toastr.warning('Please Select The Same Vendor Name and Branch Name');
      // }
    // }
    // }
    // else{
    //   if(this.listcomments1.length==0){
    //     this.listcomments1.push(d);
    //     this.listcomments[i]['con']=true;
    //     return true;
    //   }
    //   for(let i=0;i<this.listcomments1.length;i++){
    //     if(d['id']==this.listcomments1[i]['id']){
    //       this.listcomments[i]['con']=true;
    //       this.toastr.warning('Already Inserted');
    //       return false;
    //     }
    //   }
    //   this.listcomments1.push(d);
    // }
    
  }
  // edit(data:any,i:any){
  //   if(this.listcomments1.length==0){
  //     this.listcomments[i]['con']=true;
  //     this.listcomments1.push(data);
  //     (this.assetsave.get('listproduct') as FormArray).push(this.fb.group({
  //       'amount':new FormControl(''),
  //       'remarks':new FormControl('')
  //     }));
  //     return true;
  //   }
   
  //   for(let i=0;i<this.listcomments1.length;i++){
  //     if(data['id']==this.listcomments1[i]['id']){
  //       this.toastr.warning('Already Inserted');
  //       return false;
  //     }
  //   }
  //   this.listcomments[i]['con']=true;
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
    this.spinner.show();
    let branch:any=this.assetgroupform.get('branch').value?this.assetgroupform.get('branch').value.id:'';
    let barcode:any=this.assetgroupform.get('Asset_id').value?this.assetgroupform.get('Asset_id').value:'';
    let subcatname:any=this.assetgroupform.get('category').value?this.assetgroupform.get('category').value.id:'';
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
    // let asset_name:any=this.assetgroupform.get('asset_name').value?this.assetgroupform.get('asset_name').value.id:'';
    // let assetserialno:any=this.assetgroupform.get('assetserialno').value?this.assetgroupform.get('assetserialno').value.assetserialno:'';

   

    let type:any=this.assetgroupform.get('type').value?this.assetgroupform.get('type').value.type:'WARRANTY';

    console.log('capdatefrom',this.datepipe.transform(this.assetgroupform.value.capdatefrom, 'yyyy-MM-dd'))
    let capdatefrom:any=this.datepipe.transform(this.assetgroupform.value.capdatefrom, 'yyyy-MM-dd')?this.datepipe.transform(this.assetgroupform.value.capdatefrom, 'yyyy-MM-dd'):'';
    console.log('capdateto',this.datepipe.transform(this.assetgroupform.value.capdateto, 'yyyy-MM-dd'))
    let capdateto:any=this.datepipe.transform(this.assetgroupform.value.capdateto, 'yyyy-MM-dd')?this.datepipe.transform(this.assetgroupform.value.capdateto, 'yyyy-MM-dd'):'';
    let invoice_no:any=this.assetgroupform.get('invoice_no').value?this.assetgroupform.get('invoice_no').value:'';
    console.log('inv',this.assetgroupform.get('invoice_no').value?this.assetgroupform.get('invoice_no').value:'')
    let crnum:any=this.assetgroupform.get('crnum').value?this.assetgroupform.get('crnum').value:'';
    console.log('cr',this.assetgroupform.get('crnum').value?this.assetgroupform.get('crnum').value:'')

    this.smsService.getAMCsummary(this.presentpagebuk,barcode,branch,subcatname,asset_name,assetserialno,type,capdatefrom,capdateto,crnum,invoice_no).subscribe(data=>{
      this.spinner.hide();
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
      let paguination=data['pagination'];
      this.has_previousbuk=paguination.has_previous;
      this.has_nextbuk=paguination.has_next;
      this.presentpagebuk=paguination.index;
    }
  });
}
  resetdata(){
    this.assetgroupform.reset('');
    this.finalSubmitted();
  }
  savesub(){

  }
  approvedata(){
    //if(Number(this.smscreateform.value.amcTotalAmount.toFixed(2))==Number(this.details_total_amount.toFixed(2))){
      
    //}
    //else{
      //this.toastr.warning('Please Enter  The Warranty Total Amount and  Warranty Detail Total Amount');
      //return false;
    //}
    if(this.smscreateform.get('amcHeaderName').value ==undefined || this.smscreateform.get('amcHeaderName').value =="" || this.smscreateform.get('amcHeaderName').value ==''){
      this.toastr.error('Please Enter The Warranty Header Name');
      return false;
    }
    if(this.smscreateform.get('fromdate').value ==undefined || this.smscreateform.get('fromdate').value =="" || this.smscreateform.get('fromdate').value ==''){
      this.toastr.error('Please Enter The Warranty From Date');
      return false;
    }
    if(this.smscreateform.get('todate').value ==undefined || this.smscreateform.get('todate').value =="" || this.smscreateform.get('todate').value ==''){
      this.toastr.error('Please Enter The Warranty To Date');
      return false;
    }
    if(this.smscreateform.get('vendor').value ==undefined || this.smscreateform.get('vendor').value =="" || this.smscreateform.get('vendor').value =='' || this.smscreateform.get('vendor').value.id ==undefined || this.smscreateform.get('vendor').value.id =="" || this.smscreateform.get('vendor').value.id ==''){
      this.toastr.error('Please Select The Warranty Vendor Name');
      return false;
    }
    if(this.smscreateform.get('servicePeriod').value ==undefined || this.smscreateform.get('servicePeriod').value =="" || this.smscreateform.get('servicePeriod').value ==''){
      this.toastr.error('Please Select The ServicePeriod');
      return false;
    }
    if(this.smscreateform.get('periodicmail').value ==undefined || this.smscreateform.get('periodicmail').value =="" || this.smscreateform.get('periodicmail').value ==''){
      this.toastr.error('Please Select The Periodic Mail');
      return false;
    }
    // if (this.valid_arr.length==0){
    //   this.toastr.error('Please Select The File');
    //   return false;
      
    // }
    // if(this.smscreateform.get('periodicmail').value ==undefined || this.smscreateform.get('periodicmail').value =="" || this.smscreateform.get('periodicmail').value ==''){
    //   this.toastr.error('Please Select The Periodic Mail');
    //   return false;
    // }

    // if(this.smscreateform.get('periodicmail').value ==undefined || this.smscreateform.get('periodicmail').value =="" || this.smscreateform.get('periodicmail').value =='' || this.smscreateform.get('periodicmail').value.id ==undefined || this.smscreateform.get('periodicmail').value.id =="" || this.smscreateform.get('periodicmail').value.id ==''){
    //   this.toastr.error('Please Select The Periodic Mail');
    //   return false;
    // }
    // if(this.smscreateform.get('amcTotalAmount').value ==undefined || this.smscreateform.get('amcTotalAmount').value =="" || this.smscreateform.get('amcTotalAmount').value ==''){
    //   this.toastr.error('Please Enter The AmcTotalAmount');
    //   return false;
    // }
    this.submit_button_disable=true;
    let detailsdata:Array<any>=[];
    let filterdata:any={};
    if(this.listcomments1.length==0){
      this.toastr.error('Please Select Any One Data:');
      return false;
    }
    for(let i=0;i<this.listcomments1.length;i++){
      if ('category_id' in this.listcomments1[i]['product_id']){
          filterdata={'branch_id':this.listcomments1[i]['branch_id'].id,
          "amcdetails_amcamt":((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('amount').value?((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('amount').value:0,
          "category_id":this.listcomments1[i]['product_id']['category_id'].id,
          "product_id":this.listcomments1[i]['product_id'].id,
          "assetlocation_id":this.listcomments1[i]['assetlocation_id'],
          "barcode":this.listcomments1[i]['assetdetails_id'],
          "remarks":((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('remarks').value,
          "status":"1"
      }
    }
    else{
      filterdata={'branch_id':this.listcomments1[i]['branch_id'].id,
          "amcdetails_amcamt":((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('amount').value?((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('amount').value:0,
          "category_id":this.listcomments1[i]['product_id'].id,
          "product_id":'None',
          "barcode":this.listcomments1[i]['assetdetails_id'],
          "assetlocation_id":0,
          "remarks":((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('remarks').value,
          "status":"1"
    }
        };
        detailsdata.push(filterdata);
     
    };
    let d:any={
      "amcheader_type":"WARRANTY",
      "old_amc_code": "", 
      "amcheader_name":this.smscreateform.get('amcHeaderName').value,
      "supplier_id":this.smscreateform.get('vendor').value.id,
      "amcheader_period_from":this.datepipe.transform(this.smscreateform.get('fromdate').value,'yyyy-MM-dd'),
      "amcheader_period_to":this.datepipe.transform(this.smscreateform.get('fromdate').value,'yyyy-MM-dd'),
      "serviceperiod":this.smscreateform.get('servicePeriod').value,
      "amcheader_amctotalamt":this.smscreateform.get('amcTotalAmount').value?this.smscreateform.get('amcTotalAmount').value:0,
      "periodicmail":this.smscreateform.get('periodicmail').value,
      "status":1,
      "amc_details":detailsdata
    }
    this.spinner.show();
    let data:any=new FormData();
    this.valid_arr.forEach((ele)=>{
      this.frmData.append('file',ele);
    })
    // this.frmData.append('file',this.valid_arr);
    this.frmData.append('data',JSON.stringify(d));
    // data.append('data',JSON.stringify(d));
    this.smsService.getAMCcreate(this.frmData).subscribe(resulr=>{
      this.spinner.hide();
      if (resulr.status=="success"){
        this.toastr.success(resulr.message);
        this.router.navigate(['/sms/smsmakersummary']);
        // this.router.navigate(['/sms/smsamccreate'])

      }
      if (resulr.code=="INVALID_DATA" ||resulr.code=="INVALID_FILETYPE"||resulr.code=="INVALID_DATA"||resulr.code=="UNEXPECTED_ERROR"){
        this.submit_button_disable=false;
        this.toastr.error(resulr.description);
        this.router.navigate(['/sms/smswarrantycreate'])
      }
      // else{
      //   this.submit_button_disable=false;
      //   this.toastr.error(resulr.description);
      //   this.router.navigate(['/sms/smswarrantycreate'])
  
      // }
      },
    (error)=>{
      this.toastr.error(error.status+error.statusText);
      this.spinner.hide();
    }
    )
      // "amc_details":[{"branch_id":"5","amcdetails_amcamt":"1000","category_id":"1","barcode":"KVB250","remarks":"Testing","status":"1"}]
  
  }
  uploaddata(event:any){
    console.log(event.target.files.length);
    this.formData.append('file',event.target.files[0])
  }
  onDateChange(){
    this.latest_date=this.datepipe.transform(this.smscreateform.get('fromdate').value,'dd-MMM-yyyy');
  }
  splitequal(event:any){
    // if(event.target.checked){
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
  // }
  // else{
  //   let len:any=(Number(this.smscreateform.get('amcTotalAmount').value)/this.listcomments1.length).toFixed(2);
  //   for(let i=0;i<this.listcomments1.length;i++){
  //     ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).patchValue({'amount':0});
  //   }
  //   let total:number=0;
  //   let length:any=Number((this.assetsave.get('listproduct') as FormArray).length);
  //   this.details_total_amount=0;
    
  // }
  }
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
  PeriodSMSEdit(a:any){
    
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
getSections(forms) {
  return forms.controls.fileInputs.controls;
}
showinvheaderadd : boolean = false
inveditindex:any
getheaderedit(i){
  this.showinvheaderadd = true
  this.inveditindex = i
}
filerow(){
  let group =this.fb.group({
    filevalue:new FormArray([]),
    file_key:new FormArray([]),
    filedataas:new FormArray([])
  })
}
assetcat1:any
valid_arr:Array<any>=[];
file_process_data:any={};
getFileDetails(index, e) {
  let data = this.myForm.value.fileInputs;
  for (var i = 0; i < e.target.files.length; i++) {
    data?.filevalue?.push(e.target.files[i])
    data?.filedataas?.push(e.target.files[i])
    this.myForm?.value?.fileInputs.push(e.target.files[i])
    this.valid_arr.push(e.target.files[i])
      // this.frmData.append("file",e.target.files[i]);
    // this.formData.push('file',e.target.files[i]);
    
    

  }
  
  
  this.file_process_data["file"+index]=this.valid_arr;
  // this.formData.append('file',this.valid_arr)
  this.formData['file']=this.valid_arr
  if (e.target.files.length > 0) {
    if (data?.file_key.length < 1) {
      data?.file_key?.push("file" + index);
    }
    
  }

}

filedatas: any
fileindex: any
filedatadataswork: any
getfiledetails(datas, ind) {
  console.log("ddataas",datas)
  this.filedatadataswork=datas
  this.fileindex = ind
  this.filedatas = datas.value['filekey']
}
fileback() {
  this.closedbuttons.nativeElement.click();
}
fileDeletes(data, index: number) {
  this.smsService.deletefile(data)
    .subscribe(result => {
      if (result?.status == 'success') {
        // this.fileList.splice(index, 1);
        this.myForm.value[this.fileindex].filedataas.splice(index, 1)
        this.myForm.value[this.fileindex].filekey.splice(index, 1)
        this.toastr.show("Deleted....")
        // this.closedbuttons.nativeElement.click();
      } else {
        this.toastr.error(result?.description)
        this.closedbuttons.nativeElement.click();
        return false
      }
    })
}
  showimageHeaderPreview: boolean = false
  showimageHeaderPreviewPDF: boolean = false
  jpgUrls: any
  pdfurl: any
  myForm: FormGroup;
  filepreview(files) {
    let stringValue = files.name.split('.')
    let extension = stringValue[stringValue.length-1]
    
    if (extension === "png" || extension === "jpeg" || extension === "jpg" ||
      extension === "PNG" || extension === "JPEG" || extension === "JPG") {
      // this.showimageHeaderPreview = true
      // this.showimageHeaderPreviewPDF = false
      const reader: any = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
      this.jpgUrls = reader.result
      const newTab = window.open();
      newTab.document.write('<html><body><img style="width: 500px;" src="' + this.jpgUrls + '" "/></body></html>');
      newTab.document.close();
      }
    }
   
    if (extension === "pdf" || extension === "PDF") {
      const reader: any = new FileReader();
      reader.onload = (_event) => {
        const fileData = reader.result;
        const blob = new Blob([fileData], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      };
      reader.readAsArrayBuffer(files);
    }
    if (extension === "csv" || extension === "ods" || extension === "xlsx" || extension === "txt" ||
      extension === "ODS" || extension === "XLSX" || extension === "TXT") {
      this.showimageHeaderPreview = false
      this.showimageHeaderPreviewPDF = false
    }
  }
  getfiles(data) {
    this.spinner.show()
    this.smsService.filesdownload(data.file_id)
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
          this.toastr.error(error);
          this.spinner.hide();
        }
      )
  }

  imageUrl = environment.apiURL
  tokenValues: any
  showimageHeaderAPI: boolean
  showimagepdf: boolean
  jpgUrlsAPI: any
  data1(datas) {
   
    this.showimageHeaderAPI = false
    this.showimagepdf = false
    let id = datas?.file_id
    let filename = datas?.file_name
    // this.ecfservice.downloadfile(id)




    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = filename.split('.')
    let extension = stringValue[stringValue.length-1]

    if (extension === "png" || extension === "jpeg" || extension === "jpg"||
    extension === "PNG" || extension === "JPEG" || extension === "JPG") {

        // this.showimageHeaderAPI = true
        // this.showimagepdf = false
       
        this.jpgUrlsAPI = window.open(this.imageUrl + "ecfapserv/ecffile/" + id + "?token=" + token, '_blank');
       
      }
      if (extension === "pdf"|| extension === "PDF") {
        // this.showimagepdf = true
        // this.showimageHeaderAPI = false
        this.smsService.downloadfile1(id)
          // .subscribe((data) => {
          //   let dataType = data.type;
          //   let binaryData = [];
          //   binaryData.push(data);
          //   let downloadLink = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
          //   window.open(downloadLink, "_blank");
          // }, (error) => {
          //   this.errorHandler.handleError(error);
          //   this.showimagepdf = false
          //   this.showimageHeaderAPI = false
          //   this.SpinnerService.hide();
          // })
      }
      if (extension === "csv" || extension === "ods" || extension === "xlsx" || extension === "txt"||
      extension === "ODS" || extension === "XLSX" || extension === "TXT") {
        // this.showimagepdf = false
        // this.showimageHeaderAPI = false
      }
  
  
  
  
  }
  deletefileUpload(invdata, i) {

    // let filesValue = this.fileInput.toArray()
    // let filesValueLength = filesValue?.length
    // for (let i = 0; i < filesValueLength; i++) {
    //   filesValue[i].nativeElement.value = ""
    // }
    let filedata = invdata.filevalue
    let filedatas = invdata.filedataas
    let file_key = invdata.file_key;
    // this.fileInput:any=this.fileInput.toArray();
    // this.fileInput.splice(i,1);
    let index_id:any="file"+this.fileindex;
    this.file_process_data[index_id].splice(i,1);
    filedata.splice(i, 1)
    filedatas.splice(i, 1)
    if (this.file_process_data[index_id].length == 0) 
      file_key.splice(i, 1)
      
      // this.frmData.append('file',file_key);
      this.valid_arr.push(file_key)
      // this.formData['file']=file_key;
      this.valid_arr.push(file_key);
      console.log('file data',this.formData)
      

  }
  get fileInputs() {
    return this.myForm.get('fileInputs') as FormArray;
  }

}