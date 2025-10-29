import { DatePipe, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild ,ViewChildren, QueryList} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { finalize, map, switchMap, takeUntil, tap, startWith} from 'rxjs/operators';
import { SmsService } from '../sms.service';
import {Observable, range} from 'rxjs';
import { MatDatepicker } from '@angular/material/datepicker';
import { environment } from "src/environments/environment";
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
export interface servicePeriod {
  id: Number;
  name: string;
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
// interface servicePeriod {
//   id: Number;
//   name: string;
// }
@Component({
  selector: 'app-sms-renewal-create',
  templateUrl: './sms-renewal-create.component.html',
  styleUrls: ['./sms-renewal-create.component.scss'],
  providers:[
    {provide:DateAdapter,useClass:pDateAdapter},
    {provide:MAT_DATE_FORMATS,useValue:PICK_FORMAT}
    
  ]
})
export class SmsRenewalCreateComponent implements OnInit {
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
  @ViewChild('serviceperiod') matserviceAutocomplete: MatAutocomplete;
  @ViewChild('checkerproduct') matprodAutocomplete: MatAutocomplete;
  @ViewChild('checkerassetserialno') matserialAutocomplete: MatAutocomplete;
  @ViewChild('takeInput', { static: false }) InputVar: ElementRef;
  // @ViewChild('branchidInput') subInput: any;
  @ViewChild('closebutton') closebutton;
  @ViewChild('closedbuttons') closedbuttons;
  @ViewChildren('fileInput') fileInput: QueryList<ElementRef>
  @ViewChild('fileInput', { static: false }) InputVars: ElementRef;

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
    {id: 1, name: 'MONTHLY'},
    {id: 3, name: 'QUARTERLY'},
    {id:4, name: 'THRICE IN A YEAR'},
    {id: 6, name: 'HALF YEARLY'},
    {id: 12, name: 'ANNUAL'}
  ];
  ServicePeriod:any= {
    '1.00':'MONTHLY',
     '3.00': 'QUARTERLY ',
      '6.00': 'HALF YEARLY',
     '12.00': 'ANNUAL'
    };
  dayChecked=false
  vendorList:Array<any>=[];
  periodicmailList:Array<any>=[];
  serviceperiodList:Array<any>=[];
  listcomments:Array<any> = [];
  renewaltranhistory:Array<any> = [];
  renewalhistory:Array<any> = [];
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
  approverfiledatalist:Array<any>=[];

  startDate: any;
  service_period_data: any;
  period_mail_data: any;
  endDate: any;
  details_total_amount:number=0;
  smscreateform:any= FormGroup;
  smscreate2:any = FormGroup;
  fromdate = new FormControl(new Date());
  todate = new FormControl(new Date());
  filteredOptions: Observable<User[]>;
  isLoading = false;
  filedatalist:Array<any>=[]
  has_nextbuk:boolean=true;
  has_previousbuk:boolean=false;
  has_nextbuk_new : boolean= false;
  has_previousbuk_new :boolean= false;
  has_previousren:boolean=false;
  has_nextren : boolean= false;
  presentpageren=1
  assetsave:any= FormGroup;
  frmData :any= new FormData();
  assetgroupform:any= FormGroup;
  propertyList : Array<any>=[];
  assetidList: Array<any>=[];
  branchList: Array<any>=[];
  categoryList: Array<any>=[];
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
  productlist:Array<any>=[];
  product:number;  
  supplier_id:number;  
  amc_code:number;  
	has_prodnext:boolean=true;
  has_prodprevious:boolean=false;
  has_prodpresentpage:number=1;
  renewalscreen_currentpage:number=1;
  has_serialnext:boolean=true;
  has_serialprevious:boolean=false;
  has_serialpresentpage:number=1;
 
  first:boolean=false;
  assetserialno = false;
  amcheader_name = false;
  subcatname = false;
  submit_button_disable:boolean=false;
  supplier_name = false;
  before_30_days = false;
  viewpage1:number=1;
  viewsize1:number=10;
 
  filter_options:User[]=[{'title':"Asset Serial Number",'model':"assetserialno"},
                  {'title':"AMC Header Name",'model':"amcheader_name"},
                  {'title':"Supplier Name",'model':"supplier_name"},
                  {'title':"Before 30 days Entry",'model':"before_30_days"},
                  // {'title':"Asset SubCategory",'model':"subcatname"}
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
      "amcheader_code": new FormControl(),
      "amcheader_name": new FormControl(),
      "supplier_name": new FormControl(),
      "before_30_days": new FormControl(),
      // "subcatname": new FormControl(),
    });
    this.myForm = this.fb.group({
      fileInputs: this.fb.array([this.filerow()])
    });
    this.finalSubmitted();

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
    this.smsService.getserviceperiodFilter('').subscribe(data=>{
      this.serviceperiodList=data['data'];
      console.log('serviceperiod',data['data'])
    });
    this.smscreateform.get('servicePeriod').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.smsService.getserviceperiodFilter(value).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      // console.log('serviceperiod',data)
      this.serviceperiodList=data['data'];
      console.log('serviceperiod',data['data'])
    });
    this.smscreate2 = this.fb.group({
      remarks: new FormControl(),
      amcamount: new FormControl()
    });
    // this.finalSubmitted();
  
    // (this.assetsave.get('listproduct') as FormArray).clear();
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
  public serviceperiodsinterface(data?:servicePeriod):string | undefined{
    return data?data.name:undefined;
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
      console.log()
      this.presentpagebuk -=1;
     
      this.finalSubmitted();
    }
  }
  renpreviousClick() {
    if (this.has_previousren === true) {
      console.log()
      this.presentpageren -=1;
     
      this.gettranshistoryrenewal();
    }
  }

  buknextClick() {
    if (this.has_nextbuk === true) {
      console.log()
      this.presentpagebuk +=1;
      this.finalSubmitted();
      
    }
  }
  rennextClick() {
    if (this.has_nextren === true) {
      console.log()
      this.presentpageren +=1;
      this.gettranshistoryrenewal();
      
    }
  }
  resetdata(){
    this.assetgroupform.reset('');
    this.finalSubmitted();
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

  edit(data:any,i:any){
    this.listcomments[i]['con']=true;
    if(this.listcomments1.length>0){
      let branchIndex:any=this.listcomments1.findIndex(a => a.branch_id.id == data.branch_id.id);
      let supplierIndex:any=this.listcomments1.findIndex(a => a.supplier.id == data.supplier.id);
      if (branchIndex==-1){
        this.listcomments[i]['con']=false;
        this.toastr.warning('Please Select The Same Branch Name');
        return false;
        
      }
      if(supplierIndex==-1){
        this.listcomments[i]['con']=false;
        this.toastr.warning('Please Select The Same Supplier Name');
        return false;
      }
      else{
      this.listcomments1.push(data);
      (this.assetsave.get('listproduct') as FormArray).push(this.fb.group({
        'amount':new FormControl(''),
        'remarks':new FormControl('')
      }));
      return true;
    }
    this.renewaledit_screen(data);
   }
   if(this.listcomments1.length==0){
    this.listcomments[i]['con']=true;
    this.listcomments1.push(data);
    this.renewaledit_screen(data);
    return true;
  }
 
  // this.renewaledit_screen(data);
  }

  createsms(){

  }

  createsms2(){
    
  }

  servicePeriodSMSEdit(d:any){
    // this.smscreateform.get('servicePeriod').name=d.name

  }
  PeriodSMSEdit(d:any){
    
  }
  filedeatils(data:any){
    this.smsService.getamcaselectfile(data).subscribe((res) => {
      if(res['data'].length>0){
        this.filedatalist=res['data'];
      }
      else{
        this.filedatalist=[];
      }
    })


  }
  approval_download_file(data:any,filename){
    this.spinner.show();
    let fileName = filename
    this.smsService.sms_approval_file_download(data).subscribe((response: any) =>{
          this.spinner.hide();
          if(response['type']!="application/json"){
            let filevalue = fileName.split('.')
            let binaryData = [];
            binaryData.push(response)
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            let link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            link.click();}
         if(response['type']=="application/json"){
            this.toastr.error('No Download Files Found');
          }
      }),(error) => {
        this.toastr.error('No Download Files Found');
        this.spinner.hide();
      }
}
      
tokenValues: any
showimageHeaderAPI: boolean
showimagepdf: boolean
pdfurl: any;
jpgUrlsAPI: any
imageUrl = environment.apiURL

approval_view_file(datas,filename) {
    console.log('approval_view_file:')
    
  
    this.smsService.sms_approval_file_view(datas).subscribe(
    (response: any) =>{
      let fileName = filename
      // let filename = response.type;
      let stringValue = fileName.split('.')
      if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg"||
      stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {   
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token;
        this.tokenValues = token
        const headers = { 'Authorization': 'Token ' + token }
        this.showimageHeaderAPI = true
        this.showimagepdf = false
        this.jpgUrlsAPI = this.imageUrl+"smsservice/download_doc_file/"+datas+"?token="+token
        console.log('view',this.jpgUrlsAPI) 
      }    
      if (stringValue[1] === "pdf"|| stringValue[1] === "PDF") {
        this.showimagepdf = true
        this.showimageHeaderAPI = false
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token;
        this.tokenValues = token
        const headers = { 'Authorization': 'Token ' + token }
        let downloadUrl=this.imageUrl+"smsservice/amc_doc_download/"+datas+"?token="+token
        let link = document.createElement('a');
        link.href = downloadUrl;
        this.pdfurl = downloadUrl;     
      }       
      if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt"||
      stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT"|| stringValue[1] === "octet-stream"|| stringValue[1] === "OCTET-STREAM") {
        this.showimagepdf = false
        this.showimageHeaderAPI = false
        this.toastr.warning('View File (csv,ods,xlsx,txt - Format) is not supported');
      }
      // if(response['code']==='Download File is not Exists') {
      //   this.toastr.error('No View Files Found');
      // }
      if(response['type']=="application/json"){
        this.toastr.error('No View Files Found');

      }
      (error)=>{
        this.toastr.error(response['code']);
        this.toastr.error(response['description']);
      }
  })
}
  sortOrdersap:any;
  sapclr:boolean=false;
  sapclr1:boolean=false;
  finalSubmitted(){
    if (this.sapclr == true){
      this.sapclr=true;
      this.sapclr1=false;
    }
    else if(this.sapclr1 == true){
      this.sapclr1=true;
      this.sapclr=false;
    }
    else{
      this.sapclr=true;
      this.sapclr1=false;
    }
    if (this.sortOrdersap != undefined && this.sortOrdersap != null &&this.sortOrdersap != ''){
      this.sortOrdersap=this.sortOrdersap
    }
    else {
      this.sortOrdersap='asce'
    }
    let branch:any='';
    // let day:any='';
    if(this.assetgroupform.get('branch').value!=null && this.assetgroupform.get('branch').value.id!=undefined){
      branch=this.assetgroupform.get('branch').value.id;
    }
    else{
      branch=this.assetgroupform.get('branch').value ? this.assetgroupform.get('branch').value:'';
    }

    let barcode:any=this.assetgroupform.get('Asset_id').value?this.assetgroupform.get('Asset_id').value:'';
    // let subcatname:any=this.assetgroupform.get('category').value?this.assetgroupform.get('category').value.subcategory_id.id:'';

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

    let type:any=this.assetgroupform.get('type').value?this.assetgroupform.get('type').value.type:'AMC';
    
    if(this.dayChecked==true){
      var day:any=this.assetgroupform.get('before_30_days').value?this.assetgroupform.get('before_30_days').value:30;
    }
    else{
      var day:any='';
    }
   
    let amcheader_code:any=this.assetgroupform.get('amcheader_code').value?this.assetgroupform.get('amcheader_code').value:'';
   
    let amcheader_name:any=this.assetgroupform.get('amcheader_name').value?this.assetgroupform.get('amcheader_name').value:'';
    let supplier_name:any=this.assetgroupform.get('supplier_name').value?this.assetgroupform.get('supplier_name').value.id:'';
    if (this.sortOrdersap != undefined && this.sortOrdersap != null &&this.sortOrdersap != ''){
      this.sortOrdersap=this.sortOrdersap
    }
    else {
      this.sortOrdersap='asce'
    }
    this.spinner.show();
    this.smsService.getrenewalsummary(this.presentpagebuk,branch,barcode,asset_name,assetserialno,type,amcheader_code,amcheader_name,supplier_name,day,this.sortOrdersap).subscribe(data=>{

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
  

  savesub(){

  }
  uploaddata(event:any){
    console.log(event.target.files.length);
    this.formData.append('file',event.target.files[0])
  }
  onFileSelectedHeader(e) {
    for (var i = 0; i < e.target.files.length; i++) {
      this.formData.append('file',e.target.files[i])
      // let checkvalue = this.formData.value.file
      // console.log("checkvalue", checkvalue)
    }
  }
  approvalfiledetails(data:any){
    this.smsService.getamcapprovalaselectfile(data).subscribe((res) => {
      if(res['data'].length>0){
        this.approverfiledatalist=res['data'];
      }
      else{
        this.approverfiledatalist=[];
      }
    })


  }
  // HeaderFilesDelete(e) {
  //   for (var i = 0; i < e.target.files.length; i++) {
  //     this.formData.splice('file',e.target.files[i])
  //   // let checkvalue = this.formData.value.file
  //   // for (let i in checkvalue) {
  //   //   checkvalue.splice(i)
  //   }
  //   // console.log("checkvalue", checkvalue)
  //   this.InputVar.nativeElement.value = "";
  //   // console.log("checkvalue", checkvalue)
  // }
  approvedata(){
    if(this.smscreateform.get('amcTotalAmount').value ==undefined || this.smscreateform.get('amcTotalAmount').value =="" || this.smscreateform.get('amcTotalAmount').value ==''||this.smscreateform.value.amcTotalAmount==undefined || this.smscreateform.value.amcTotalAmount =="" || this.smscreateform.value.amcTotalAmount ==''){
      this.toastr.error('Please Enter The AMC Total Amount');
      return false;
    }
    if(Number(this.smscreateform.value.amcTotalAmount)==Number(this.details_total_amount)){
      // this.toastr.error('Please Enter Same AMC Total Amount and AMC Details Amount');
      // return false;
      
    }
    else{
      this.toastr.warning('Please Enter  The AMC Total Amount and  AMC Detail Total Amount');
      return false;
    }
    if(this.smscreateform.get('amcHeaderName').value ==undefined || this.smscreateform.get('amcHeaderName').value =="" || this.smscreateform.get('amcHeaderName').value ==''||this.smscreateform.value.amcHeaderName ==undefined || this.smscreateform.value.amcHeaderName =="" || this.smscreateform.value.amcHeaderName ==''){
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
    // if(this.smscreateform.get('vendor').value ==undefined || this.smscreateform.get('vendor').value =="" || this.smscreateform.get('vendor').value =='' || this.smscreateform.get('vendor').value.id ==undefined || this.smscreateform.get('vendor').value.id =="" || this.smscreateform.get('vendor').value.id ==''){
    //   this.toastr.error('Please Select The AMC Vendor Name');
    //   return false;
    // }
    this.service_period_data=this.smscreateform.get('servicePeriod').value.id?this.smscreateform.value.servicePeriod.id:''
    if(this.smscreateform.get('servicePeriod').value.id ==undefined || this.smscreateform.get('servicePeriod').value.id =="" || this.smscreateform.get('servicePeriod').value.id ==''){
      // let service_period= this.smscreateform.get('servicePeriod').value.id
      // this.service_period_data=this.smscreateform.get('servicePeriod').value.id?this.smscreateform.value.servicePeriod.id:''
     if(this.smscreateform.value.servicePeriod.name ==undefined || this.smscreateform.value.servicePeriod.name =="" || this.smscreateform.value.servicePeriod.name ==''){
      this.toastr.error('Please Select The Service Period');
      return false;
     }
    }
    if(this.smscreateform.get('amcTotalAmount').value ==undefined || this.smscreateform.get('amcTotalAmount').value =="" || this.smscreateform.get('amcTotalAmount').value ==''){
      this.toastr.error('Please Enter The Amc Total Amount');
      return false;
    }
    this.period_mail_data=this.smscreateform.get('periodicmail').value.id?this.smscreateform.value.periodicmail.name:''
    if(this.smscreateform.get('periodicmail').value.name ==undefined || this.smscreateform.get('periodicmail').value =="" || this.smscreateform.get('periodicmail').value ==''){
      // let service_period= this.smscreateform.get('servicePeriod').value.id
      // this.service_period_data=this.smscreateform.get('servicePeriod').value.id?this.smscreateform.value.servicePeriod.id:''
     if(this.smscreateform.value.periodicmail ==undefined || this.smscreateform.value.periodicmail =="" || this.smscreateform.value.periodicmail ==''){
      this.toastr.error('Please Select The Periodic Mail');
      return false;
     }
    }
    if (this.valid_arr.length==0){
      this.toastr.error('Please Select The File');
      return false;
      
    }
    // this.period_mail_data=this.smscreateform.get('periodicmail').value.id?this.smscreateform.value.periodicmail.id:''
    // if(this.smscreateform.get('periodicmail').value ==undefined || this.smscreateform.get('periodicmail').value =="" || this.smscreateform.get('periodicmail').value =='' || this.smscreateform.get('periodicmail').value.id ==undefined || this.smscreateform.get('periodicmail').value.id =="" || this.smscreateform.get('periodicmail').value.id ==''){
    //   // this.period_mail_data=this.smscreateform.get('periodicmail').value.id?this.smscreateform.value.periodicmail.id:''
    //   if (this.smscreateform.value.periodicmail.name ==undefined || this.smscreateform.value.periodicmail.name =="" || this.smscreateform.value.periodicmail.name ==''){
    //   this.toastr.error('Please Select The Periodic Mail Field');
    //   return false;
    //   }
    // }
    // this.submit_button_disable=true;
    let detailsdata:Array<any>=[];
    let filterdata:any={};
    let amccodedata_list:Array<any>=[];
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
          "category_id":145,
          "product_id":'None',
          "assetlocation_id":0,
          "barcode":this.listcomments1[i]['assetdetails_id'],
          "remarks":((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('remarks').value,
          "status":"1"
      
    }
        };
      
        detailsdata.push(filterdata);
    };
    // for(let i=0;i<this.listcomments1.length;i++){
    //   amccodedata_list.push(this.listcomments1[i]['amcheader_code'])
    // }
   

    let d:any={
      "amcheader_type":"AMC",
      "amcheader_name":this.smscreateform.get('amcHeaderName').value,
      "supplier_id":this.supplier_id,
      "old_amc_code":  this.amc_code,
      "amcheader_period_from":this.datepipe.transform(this.smscreateform.get('fromdate').value,'yyyy-MM-dd'),
      "amcheader_period_to":this.datepipe.transform(this.smscreateform.get('todate').value,'yyyy-MM-dd'),
      "serviceperiod":this.service_period_data,
      "amcheader_amctotalamt":this.smscreateform.get('amcTotalAmount').value,
      "status":4,
      "periodicmail":this.period_mail_data,
      "amc_details":detailsdata
    }
    this.valid_arr.forEach((ele)=>{
      this.frmData.append('file',ele);
    })
    // this.frmData.append('file',this.valid_arr);
    this.frmData.append('data',JSON.stringify(d));
    // this.formData.append('data',JSON.stringify(d));
    this.spinner.show();
    this.smsService.getAMCcreate(this.frmData).subscribe(resulr=>{
      this.spinner.hide();
      // this.submit_button_disable=true;
      if (resulr.status=="success"){
        this.submit_button_disable=true;
        this.toastr.success(resulr.message);
        this.router.navigate(['/sms/smsmakersummary']);
   

      }
      if (resulr.code=="INVALID_DATA" ||resulr.code=="INVALID_FILETYPE"||resulr.code=="INVALID_DATA"||resulr.code=="UNEXPECTED_ERROR"){
        this.submit_button_disable=false;
        this.toastr.error(resulr.description);
        this.router.navigate(['/sms/smsamcrenewal'])
    }
    },
    (error)=>{
      this.toastr.error(error.status+error.statusText);
      this.spinner.hide();
    }
    )
     
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

  fromDateSelection(event: string) {

    const date = new Date(event)
    this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }
  filter_flags(ev,fg){
    
    console.log(fg)
  }
  
renewaledit_screen(data){

  this.spinner.show()
  
  this.filedeatils(data.id)
  this.approvalfiledetails(data.id)
  this.smsService.get_renewal_summary_id(this.renewalscreen_currentpage,data.id).subscribe((data:any)=>{
    this.spinner.hide()
    let dear:any=data['data'];
    this.supplier_id=data['supplier'].id
    this.amc_code=data['amcheader_code']
    console.log('data',dear)
    this.smscreateform.patchValue({'amcHeaderName':data.amcheader_name,'fromdate':data.amcheader_period_from,
    'todate':data.amcheader_period_to,'vendor':{'code':data['supplier'].code,'name':data['supplier'].name},
      'amcTotalAmount':data.amcheader_amctotalamt,'periodicmail':{'name':data['periodic_mail'].text,'id':data['periodic_mail'].id}
    });
        // this.details_total_amount=this.smscreateform.patchValue({"details_total_amount":data.amcheader_amctotalamt});
    this.details_total_amount=data.amcheader_amctotalamt;
   
    this.smscreateform.patchValue({'servicePeriod':{"name":data['serviceperiod'].text,"id":data['serviceperiod'].id}})
    // this.servicePeriodSMSEdit(data['serviceperiod'].id)
    let len:any=(Number(this.smscreateform.get('amcTotalAmount').value)/this.listcomments1.length).toFixed(2);
    for(let i=0;i<this.listcomments1.length;i++){
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).patchValue({'amount':data['amcheader_amctotalamt']});
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).patchValue({'remarks':data['remarks']});
    }
    
   
   
        
  })

}
dayCheck(e) {
    
  if (e.checked==true){
    this.dayChecked=true

  }

  if (e.checked==false){
    this.dayChecked=false

  }
 
    // this.dayChecked=e;

  

  
}
selectionChange(event) {
  if (event.isUserInput && event.source.selected == false) {
    // let index = this.selectedValues.indexOf(event.source.value);
    // this.selectedValues.splice(index, 1)
    if(event.source.value.model=='assetserialno'){
      this.assetserialno=false;
      this.assetgroupform.value.assetserialno='';
    }
    if(event.source.value.model=='amcheader_name'){
      this.amcheader_name=false;
      this.assetgroupform.value.amcheader_name='';
    }
    if(event.source.value.model=='supplier_name'){
      this.supplier_name=false;
      this.assetgroupform.value.supplier_name='';
    }
    if(event.source.value.model=='before_30_days'){
      this.before_30_days=false;
      this.assetgroupform.value.before_30_days='';
    }
    // if(event.source.value.model=='subcatname'){
    //   this.subcatname=false;
    //   this.assetgroupform.value.subcatname='';
    // }
   
  
  }
  else if(event.isUserInput && event.source.selected == true){

    if(event.source.value.model=='assetserialno'){
      this.assetserialno=true;
    }
    if(event.source.value.model=='amcheader_name'){
      this.amcheader_name=true;
    }
    if(event.source.value.model=='supplier_name'){
      this.supplier_name=true;
    }
    if(event.source.value.model=='before_30_days'){
      this.before_30_days=true;
    }
    // if(event.source.value.model=='subcatname'){
    //   this.subcatname=true;
    // }
   
  }

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

getsapascdec(data,num){
  this.spinner.show();
  this.sortOrdersap=data;
  if (num==1){
    this.sapclr=true;
    this.sapclr1=false;
  }
  if (num==2){
    this.sapclr=false;
  this.sapclr1=true;
  }
  let branch:any='';
    
    if(this.assetgroupform.get('branch').value!=null && this.assetgroupform.get('branch').value.id!=undefined){
      branch=this.assetgroupform.get('branch').value.id;
    }
    else{
      branch=this.assetgroupform.get('branch').value ? this.assetgroupform.get('branch').value:'';
    }

    let barcode:any=this.assetgroupform.get('Asset_id').value?this.assetgroupform.get('Asset_id').value:'';
   

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

    let type:any=this.assetgroupform.get('type').value?this.assetgroupform.get('type').value.type:'AMC';
    
    if(this.dayChecked==true){
      var day:any=this.assetgroupform.get('before_30_days').value?this.assetgroupform.get('before_30_days').value:30;
    }
    else{
      var day:any='';
    }
   
    let amcheader_code:any=this.assetgroupform.get('amcheader_code').value?this.assetgroupform.get('amcheader_code').value:'';
   
    let amcheader_name:any=this.assetgroupform.get('amcheader_name').value?this.assetgroupform.get('amcheader_name').value:'';
    let supplier_name:any=this.assetgroupform.get('supplier_name').value?this.assetgroupform.get('supplier_name').value.id:'';
   
    if (this.sortOrdersap != undefined && this.sortOrdersap != null &&this.sortOrdersap != ''){
      this.sortOrdersap=this.sortOrdersap
    }
    else {
      this.sortOrdersap='asce'
    }
    
    this.presentpagebuk=1;
    this.spinner.show();
 
  this.smsService.getrenewalsummary(this.presentpagebuk,branch,barcode,asset_name,assetserialno,type,amcheader_code,amcheader_name,supplier_name,day,this.sortOrdersap).subscribe(data=>{
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

gettranshistoryrenewal(){
  this.spinner.show()
  let amc_code=this.amc_code
  console.log(amc_code)
  // if(amc_code==undefined || amc_code=="" || this.amc_code==''){
  if(amc_code==undefined){
    this.toastr.error('Please Select Any One Action Data');
    return false;

  }
  this.smsService.get_transaction_history(this.presentpageren,amc_code).subscribe((data:any)=>{
    this.spinner.hide()
    console.log(data)
    this.renewaltranhistory=data['data'];   
    let paguination=data['pagination'];
    this.has_previousren=paguination.has_previous;
    this.has_nextren=paguination.has_next;
    this.presentpageren=paguination.index;
  },

  (error)=>{
    this.toastr.error(error.code+error.description);
    this.toastr.error(error.description);
    this.spinner.hide();
  

  })

}
tranback(){
  this.closebutton.nativeElement.click()
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
  // pdfurl: any
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
  maker_view_file(datas,filename) {
    console.log('approval_view_file:')
    let id = datas
    this.spinner.show();
    this.smsService.sms_approval_file_view(id).subscribe((response: any) =>{
    if(response['type']!="application/json"){
      this.spinner.hide();
      let fileName = filename
      // let filename = response.type;
      let stringValue = fileName.split('.')
      if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg"||
      stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {   
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token;
        this.tokenValues = token
        const headers = { 'Authorization': 'Token ' + token }
        this.showimageHeaderAPI = true
        this.showimagepdf = false
        this.jpgUrlsAPI = this.imageUrl+"smsservice/download_doc_file/"+id+"?token="+token
        console.log('view',this.jpgUrlsAPI) 
      }    
      if (stringValue[1] === "pdf"|| stringValue[1] === "PDF") {
        this.showimagepdf = true
        this.showimageHeaderAPI = false
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token;
        this.tokenValues = token
        const headers = { 'Authorization': 'Token ' + token }
        let downloadUrl=this.imageUrl+"smsservice/amc_doc_download/"+id+"?token="+token
        let link = document.createElement('a');
        link.href = downloadUrl;
        this.pdfurl = downloadUrl;     
      }       
    
    }
     
      if(response['type']=="application/json"){
        this.toastr.error('No View Files Found');

      }
     
  })
}
maker_download_file(data:any,files:any){
  this.spinner.show();
  let fileName = files
  this.smsService.sms_approval_file_download(data).subscribe((response: any) =>{
        this.spinner.hide();
        if(response['type']!="application/json"){
          let filevalue = fileName.split('.')
          let binaryData = [];
          binaryData.push(response)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = fileName;
          link.click();}
        if(response['type']=="application/json"){
          this.toastr.error('No Download Files Found');
        }
    })
  }
}