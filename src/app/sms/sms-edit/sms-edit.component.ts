import { DatePipe, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { SmsShareService } from '../sms-share.service';
import { SmsService } from '../sms.service';

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
}
export interface branch{
  id:string;
  name:string;
}
export interface category{
  id:string;
  subcatname:string;
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
  selector: 'app-sms-edit',
  templateUrl: './sms-edit.component.html',
  styleUrls: ['./sms-edit.component.scss']
})
export class SmsEditComponent implements OnInit {
  @ViewChild('exampleModal') public exampleModal: ElementRef;
  @ViewChild('exampleModals') public exampleModals: ElementRef;

  @ViewChild( MatAutocompleteTrigger ) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('Asset_id') matassetAutocomplete: MatAutocomplete;
  @ViewChild('assetidInput') Inputassetid: any;

  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchidInput') branchidInput: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  ctrl_branch_id: any;

  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    console.log('welcome',event.code);
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }

  searchdata = {
    "barcode": "",
    "branch": "",
  }
  servicePeriod: servicePeriod[] = [
    {value: 3, viewValue: 'QUARTERLY '},
    {value: 6, viewValue: 'HALF YEAR'},
    {value: 12, viewValue: 'FULL YEAR'}
  ];
  servicePeriod_new = [
    {'3.00': 'QUARTERLY '},
    { '6.00': 'HALF YEAR'},
    {'12.00': 'FULL YEAR'}
  ];
  id:any;
  vendorList:Array<any>=[];
  listcomments:Array<any> = [];
  listcomments1:Array<any> = [];
  datapagination:any=[];
  presentpagebuk: number = 1;
  presentpagebuk_new: number = 1;
  pageSize = 10;
  pageNumber:number = 1;
  currentpagecom_branch=1;
  has_nextcom_branch=true;
  has_previouscom=true;
  Asset_id:number;
  branch:number;
  latest_date: string;
  valid_date=new Date();
  pageLength_popup:any;
  startDate: any;
  endDate: any;
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
  frmData :any= new FormData();
  assetgroupform:any= FormGroup;
  propertyList : Array<any>=[];
  assetidList: Array<any>=[];
  branchList: Array<any>=[];
  categoryList: Array<any>=[];
  checkbox:any=new FormControl('');
  id_any:any;
  constructor(private shareservice:SmsShareService,private router: Router, private smsService: SmsService, private http: HttpClient,
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
      'category':new FormControl()
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
      this.categoryList=data['data'];
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
      switchMap((value:any)=>this.smsService.getAMCpropertydropdown(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.propertyList=data['data'];
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
    
    

    this.smscreateform = this.fb.group({
      amcHeaderName: new FormControl(),
      fromdate: new FormControl(),
      todate: new FormControl(),
      vendor: new FormControl(),
      servicePeriod: new FormControl(),
      amcTotalAmount: new FormControl()
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

    this.smscreate2 = this.fb.group({
      remarks: new FormControl(),
      amcamount: new FormControl()
    });
    (this.assetsave.get('listproduct') as FormArray).clear();
    this.id=this.shareservice.amcedit.value.id;
    this.smsService.getamcapprovalsummaryselect(this.id,1).subscribe(res=>{
      this.smscreateform.patchValue({'amcHeaderName':res['data'][0].amcheader_name,'fromdate':res['data'][0].amcheader_period_from,
    'todate':res['data'][0].amcheader_period_to,'vendor':{'name':res['data'][0].supplier_name,'id':res['data'][0].supplier_id},'servicePeriod':this.servicePeriod_new[res['data'][0].serviceperiod],
      'amcTotalAmount':res['data'][0].amcheader_amctotalamt
    });
    this.details_total_amount=res['data'][0].amcheader_amctotalamt;
    this.listcomments1=res['data'][0]['data'];
    for(let i=0;i<this.listcomments1.length;i++){
      (this.assetsave.get('listproduct') as FormArray).push(
        this.fb.group({
          'remarks':new FormControl(''),
          'amount':new FormControl('')
        })
      );
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).patchValue({'amount':this.listcomments1[i]['amount'],'remarks':this.listcomments1[i]['remarks']});

    }
    console.log(res[0])
    });
    (this.assetsave.get('listproduct') as FormArray).clear();
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
    return data?data.name:undefined;
  }
  public categoryintreface(data?:category):string | undefined{
    return data?data.subcatname:undefined;
  }
  public vendorinterface(data?:vendorname):string | undefined{
    return data?data.name:undefined;
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
  }
  delete(data:any,idx:any){
    let index=this.listcomments1.findIndex(i=>i.id==data.id);
    this.listcomments1.splice(index,1);
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
    if(this.listcomments1.length==0){
      this.listcomments1.push(data);
      (this.assetsave.get('listproduct') as FormArray).push(this.fb.group({
        'amount':new FormControl(''),
        'remarks':new FormControl('')
      }));
      return true;
    }
   
    for(let i=0;i<this.listcomments1.length;i++){
      if(data['id']==this.listcomments1[i]['id']){
        this.toastr.warning('Already Inserted');
        return false;
      }
    }
    this.listcomments1.push(data);
    (this.assetsave.get('listproduct') as FormArray).push(this.fb.group({
      'amount':new FormControl(''),
      'remarks':new FormControl('')
    }));
  }

  createsms(){

  }

  createsms2(){
    
  }

  servicePeriodSMSEdit(d:any){

  }

  finalSubmitted(){
    let branch:any=this.assetgroupform.get('branch').value?this.assetgroupform.get('branch').value.id:'';
    let barcode:any=this.assetgroupform.get('Asset_id').value?this.assetgroupform.get('Asset_id').value.id:'';
    let subcatname:any=this.assetgroupform.get('category').value?this.assetgroupform.get('category').value.id:'';
    let asset_name:any=this.assetgroupform.get('asset_name').value?this.assetgroupform.get('asset_name').value.id:'';
    let assetserialno:any=this.assetgroupform.get('assetserialno').value?this.assetgroupform.get('assetserialno').value.assetserialno:'';
    let type:any=this.assetgroupform.get('type').value?this.assetgroupform.get('type').value.type:'';

    console.log('capdatefrom',this.datepipe.transform(this.assetgroupform.value.capdatefrom, 'yyyy-MM-dd'))
    let capdatefrom:any=this.datepipe.transform(this.assetgroupform.value.capdatefrom, 'yyyy-MM-dd')?this.datepipe.transform(this.assetgroupform.value.capdatefrom, 'yyyy-MM-dd'):'';    
    console.log('capdateto',this.datepipe.transform(this.assetgroupform.value.capdateto, 'yyyy-MM-dd'))
    let capdateto:any=this.datepipe.transform(this.assetgroupform.value.capdateto, 'yyyy-MM-dd')?this.datepipe.transform(this.assetgroupform.value.capdateto, 'yyyy-MM-dd'):'';    
    let invoice_no:any=this.assetgroupform.get('invoice_no').value?this.assetgroupform.get('invoice_no').value:'';
    console.log('inv',this.assetgroupform.get('invoice_no').value?this.assetgroupform.get('invoice_no').value:'')
    let crnum:any=this.assetgroupform.get('crnum').value?this.assetgroupform.get('crnum').value:'';
    console.log('cr',this.assetgroupform.get('crnum').value?this.assetgroupform.get('crnum').value:'')

    this.smsService.getAMCsummary(this.presentpagebuk,barcode,branch,subcatname,asset_name,assetserialno,type,capdatefrom,capdateto,crnum,invoice_no).subscribe(data=>{

      this.listcomments=data['data'];
      for(let i=0;i<this.listcomments.length;i++){
        this.listcomments[i]['con']=false;
      }
      let paguination=data['pagination'];
      this.has_previousbuk=paguination.has_previous;
      this.has_nextbuk=paguination.has_next;
      this.presentpagebuk=paguination.index;
    });
  }

  savesub(){

  }
  approvedata(){
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
    if(this.smscreateform.get('vendor').value ==undefined || this.smscreateform.get('vendor').value =="" || this.smscreateform.get('vendor').value ==''){
      this.toastr.error('Please Enter The AMC Vendor Name');
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
    let detailsdata:Array<any>=[];
    let filterdata:any={};
    if(this.listcomments1.length==0){
      this.toastr.error('Please Select Any One Data:');
      return false;
    }
    for(let i=0;i<this.listcomments1.length;i++){
          filterdata={'branch_id':this.listcomments1[i]['branch_id'].id,
          "amcdetails_amcamt":((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('amount').value,
          "category_id":this.listcomments1[i]['product_id']['category_id'].id,
          "barcode":this.listcomments1[i]['assetdetails_id'],
          "remarks":((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('remarks').value,
          "status":"1"
        };
        detailsdata.push(filterdata);
     
    };
    let d:any={
      'id':this.id,
      "amcheader_type":"AMC",
      "amcheader_name":this.smscreateform.get('amcHeaderName').value,
      "supplier_id":this.smscreateform.get('vendor').value.id,
      "amcheader_period_from":this.datepipe.transform(this.smscreateform.get('fromdate').value,'yyyy-MM-dd'),
      "amcheader_period_to":this.datepipe.transform(this.smscreateform.get('fromdate').value,'yyyy-MM-dd'),
      "serviceperiod":this.smscreateform.get('servicePeriod').value,
      "amcheader_amctotalamt":this.smscreateform.get('amcTotalAmount').value,
      "status":1,
      "amc_details":detailsdata
    }
    this.spinner.show();
    this.smsService.getAMCcreate(d).subscribe(resulr=>{
      this.spinner.hide();
      this.toastr.success('Created Successfully');
      this.router.navigate(['/sms/smsmakersummary']);
    },
    (error)=>{
      this.toastr.error(error.status+error.statusText);
      this.spinner.hide();
    }
    )
      // "amc_details":[{"branch_id":"5","amcdetails_amcamt":"1000","category_id":"1","barcode":"KVB250","remarks":"Testing","status":"1"}]
  
  }
  splitequal(event:any){
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
    console.log(this.assetsave.value);
    let len:any=(Number(this.smscreateform.get('amcTotalAmount').value)/this.listcomments1.length).toFixed(2);
    for(let i=0;i<this.listcomments1.length;i++){
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).patchValue({'amount':len,'remarks':''});
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

}
