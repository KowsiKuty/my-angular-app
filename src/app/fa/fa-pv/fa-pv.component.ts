import { Component, ElementRef, OnInit, ViewChild, Directive,ViewChildren, HostListener, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { faservice } from '../fa.service';
import { faShareService } from '../share.service';
import {ToastrService} from 'ngx-toastr';
import { Observable,fromEvent } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap, timeout } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Fa3Service } from '../fa3.service';
import { DatePipe, formatDate } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { F } from '@angular/cdk/keycodes';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { event } from 'jquery';
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
}
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

export interface BRANCH {
  name: string;
  code: string;
  id: string;
  
}
export interface assetbranch{
  name:string,
  code:string,
  id:string
}
export interface assetowner{
  full_name:string,
  code:string,
  id:string
}
export interface itod_drop{
  name:string,
  id:string

}

interface condition {
  value: string;
  viewValue: string;
}

interface status {
  value: string;
  viewValue: string;
}

export interface Asset{
  id:string;
  subcatname:string;
}
export interface Branch_data {
  name: string;
  id:string;
}
export interface isproductList {
  name: string;
  id: number;
}

@Component({
  selector: 'app-fa-pv',
  templateUrl: './fa-pv.component.html',
  styleUrls: ['./fa-pv.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ],
  encapsulation: ViewEncapsulation.None
})

export class FaPvComponent implements OnInit {

  @ViewChild('fileInput') frmdata:FormData;
  @ViewChild('exampleModal') public exampleModal: ElementRef;
  @ViewChild('exampleModals') public exampleModals: ElementRef;

  @ViewChild( MatAutocompleteTrigger ) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('Asset_id') matassetAutocomplete: MatAutocomplete;
  @ViewChild('assetidInput') Inputassetid: any;

  @ViewChild('Asset_edit') matasseteditAutocomplete: MatAutocomplete;
  @ViewChild('assetideditInput') Inputasseteditid: any;

  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchidInput') branchidInput: any;

  @ViewChild('categoryInput') categoryInput: any;
  @ViewChild('categoryref') categoryAutoComplete: MatAutocomplete;

  @ViewChild('product') matproductbAutocomplete: MatAutocomplete;
  @ViewChildren('inputproduct') Inputproduct: any;

  
@ViewChild("branchInput") branchInput: any;
@ViewChild("is_branch") is_branch: MatAutocomplete;

@ViewChild("inputproduct") inputproduct: any;
@ViewChild("products") products: MatAutocomplete;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  category: any;
  catId: any;
  productId: any;
  branch_code_list: any;
  is_branch_has_next: boolean;
  is_branch_has_previous: boolean;
  is_branch_currentpage: number;
  document_list: any;

  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    console.log('welcome',event.code);
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
  branchlist:Array<any>=[];
  assetcatlist=[]

  conditions: condition[] = [
    {value: 'In use', viewValue: 'In use'},
    {value: 'Not in use', viewValue: 'Not in use'},
    {value: 'In need of repair', viewValue: 'In need of repair'},
    {value:'Obsolete',viewValue:'Obsolete'}
  ];

  status: status[] = [
    {value: 'Available', viewValue: 'Available '},
    {value: 'Not available', viewValue: 'Not available'},
    {value: 'Transferred (if transferred enter branch name)', viewValue: 'Transferred (if transferred enter branch name)'}
  ];
  fapvstatus =[
    {value:'0',name:'PV not Yet done'},
    {value:'1',name:'Approved'},
    {value:'2',name:'Rejected'}
  ]

  d1:any;
  d2:any;
  data:any;
  as_assetcat=[];
  product=[];
  as_Asset_id=[];
  booleancondition = true;
  searchdata = {
    "barcode": "",
    "branch": "",
    "Asset_edit":""
  }
  ctrl_branch_id: any;
  search_mod = false;
  images:any;
  currentElement:any;
  Asset_id:number;
  branch:number;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  pageLength_popup:any;
  isLoading = false;
  has_nextbuk = true;
  has_previousbuk = true;
  assetsave:any= FormGroup;
  frmData :any= new FormData();
  assetgroupform:any= FormGroup;
  asset_details:any={}
  factor: number;
  pageNumber:number = 1;
  currentpagecom_branch=1;
  as_branchname=[];
  has_nextcom_branch=true;
  has_previouscom=true;
  selectedPersonId: number;
  presentpagebuk: number = 1;
  pageSize = 10;
  data_save: {};
  listcomments:Array<any>=[];
  datapagination:any=[];
  notEmptyPost = true;
  notScrolly = true;
  totalRecords: string;
  currentPage: number = 1;  
  config: any;
  hideBranch = true;
  flag = false;
  addRowOnce = false;
  statusCheck = false;
  newFlag = false;
  readOnly = true;
  displayedFields:string[] = ["S.No","Asset ID","Product Name","Branch Code","Branch Name","Asset Cost","Asset Value","Status","Asset Tag","Make","Serial no","Condition","Remarks","Add Row","Image Upload","Save"];
  branchdata: any=[];
  branch_id: any;
  branch_names: any;
  branch_codes: any;
  branch_id_data:any;
  product_id_data:any;
  id: any;
  addRowDisable=false;
  addrowRemove = true;
  addrowCheck = true;
  saveCheck = false;
  ctrl_branch:any;
  save_btn = false;
  btndisable:boolean=false;
  btndisablepopup:boolean=false;
  has_nextcom_product=true;
  currentpagecom_product=1;
  first:boolean=false;
  pvfileData:any=new FormData();
  filedetails: any;
  // private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  // private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  // get images(): string[] {
  //   const selectedPerson = this.assetcatlist.find(person => person.id === this.selectedPersonId);
  //   if (selectedPerson?.images.length) {
  //     return selectedPerson.images;
  //   }

  //   return [];
  // }
is_admin_branch:boolean=false;

  constructor( private router: Router, private share: faShareService, private http: HttpClient,
     private Faservice: faservice, private toastr:ToastrService, private spinner: NgxSpinnerService,
      private fb: FormBuilder, route:ActivatedRoute, private el: ElementRef, private faservice3:Fa3Service,
      private datePipe:DatePipe ) { }


  ngOnInit(): void {
  this.data = this.share.regular.value;
  this.assetsave =this.fb.group({
    "listproduct":this.fb.array([
      this.fb.group({
      'id':'',
      'barcode':new FormControl(),
      'product_name':new FormControl(),
      'branch_code':new FormControl(),
      'branch_name':new FormControl(),
      'asset_cost':new FormControl(),
      'asset_value':new FormControl(),
      'asset_tag':new FormControl(),
      'make':new FormControl(),
      'model':new FormControl(''),
      'condition':new FormControl(),
      'status':new FormControl(),
      'serial_no': new FormControl(),
      'crnum':new FormControl(),
      'pvsts':new FormControl(),
      'pvsts_date':new FormControl(),
      'asset_tfr_id':new FormControl(),
      'product_spec':new FormControl(),
      'branch_id_data':new FormControl(),
      'asset_owner':new FormControl(),
      'asset_owner_desg':new FormControl(),
      'kvb_asset_id':new FormControl(),
      'images': new FormControl(),
      'remarks' : new FormControl(),
      'assetheader_id':new FormControl(),
      'product_id':new FormControl(""),
      'newserialno':new FormControl(null),
      "oldserialno":new FormControl(null),
      "serialno_id":new FormControl(null),
      'oldderial_no':new FormControl(null),
      'serial_no_btn_enb':new FormControl(''),
      'documents_data':new FormControl('')
      })
    ])
      
    });

  if (this.data = "REGULAR") {
    console.log('condition1=',this.data);
    this.assetgroupform =this.fb.group({
      'Asset_id':new FormControl(),
      'branch':new FormControl(),
      'Asset_edit':new FormControl(),
      'asset_cat':new FormControl(),
      'invoicedate': new FormControl(),
      'asset_cost': new FormControl(),
      'product': new FormControl(),
      'crno':new FormControl(""),
      'product_id_data':new FormControl(""),
      'branch_admin': new FormControl(),
      'fapvsts':new FormControl(),
      'itod':new FormControl(),
     
    });

    // this.assetgroupform = this.fb.group({
    //     Asset_id: [''],
    //     branch: [''],
    // })

    // this.Faservice.getassetproductdata('',1).subscribe(data=>{
    //   this.product=data['data'];
    // })
    // this.assetgroupform.get('product').valueChanges.pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(()=>{
    //     this.isLoading=true;
        
    //   }),
      
    //   switchMap((value:any) => this.Faservice.getassetproductdata(value,1).pipe(
    //     finalize(()=>{
    //       this.isLoading=false;
    //     })
    //   ))
    // ).
    //   subscribe((results: any[]) => {
    //       this.product=results['data']
    //   });
  

  this.getdata();  
    this.Faservice.get_is_branch('', 1).subscribe(data=>{
       let datas = data["data"];
        this.branch_code_list = datas;
        if(data?.is_admin === true){
          this.is_admin_branch=true
        }else{
           this.is_admin_branch=false
        }
    })


  // checkVisibility() {
  //   let columnCheck: boolean = true;
  //   for (var i = 0; i < this.listcomments.length; i++) {
  //     if (this.listcomments[i].id === this.as_assetcat[i].id) {
  //       return false;
  //     }
  //   }
  //   return columnCheck;
  // }

    // this.assetgroupform.get('Asset_id').valueChanges.pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(()=>{
    //     this.isLoading=true;
    //   }),
    //   switchMap((value:any) => this.Faservice.getassetsearch(value).pipe(
    //     finalize(()=>{
    //       this.isLoading=false;
    //     })
    //   ))
    // ).
    //   subscribe((results: any[]) => {
    //       this.listcomments=results['data']
    //       console.log('asset_id=',results)
    //   });
      this.Faservice.getbranchsearch('',1).subscribe(data=>{
        this.branchdata=data['data'];
      });
      this.assetgroupform.get('branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
  
        }),
        switchMap(value => this.Faservice.getbranchsearch(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
  
      .subscribe((results: any[]) => {
        this.branchdata = results["data"];
        console.log('branch_id=',results)
        console.log('branch_data=',this.branchdata)
  
      })

    }
     if (this.prod_Control !== null) {
          this.prod_Control.valueChanges
            .pipe(
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
              }),
              switchMap(value => this.Faservice.get_productList(value)
                .pipe(
                  finalize(() => {
                    this.isLoading = false;
                  }),
                )
              )
            )
            .subscribe((results: any[]) => {
              const allItem = { code: "0000", id: 0, name: "All", status: 1 };
              let datas = results["data"];
              this.allproductList = [allItem,...datas];
              // console.log("alllemployeeeisttt", datas)
    
            })
    
        }
  }
  getdata(){
    (this.assetsave.get('listproduct') as FormArray).clear()
    let search:string="";
    console.log(this.assetgroupform.value)
    if(this.assetgroupform.get('branch').value!='' && this.assetgroupform.get('branch').value!=null){
      console.log('hi')
      // this.searchdata.branch=this.assetgroupform.value.branch
      search=search+"&branch="+this.branch_id;
    }    
    if(this.assetgroupform.get('Asset_id').value!='' && this.assetgroupform.get('Asset_id').value!=null){
      console.log('hii')
      // this.searchdata.barcode=this.assetgroupform.value.barcode
      search=search+"&barcode="+this.assetgroupform.get('Asset_id').value;
    }
    if(this.assetgroupform.get('asset_cat').value !=null && this.assetgroupform.get('asset_cat').value !="" ){
      search=search+"&asset_cat="+this.catId;
    }
    if(this.assetgroupform.get('product').value !=null && this.assetgroupform.get('product').value !="" ){
      search=search+"&product="+this.productId;
    }
    if(this.assetgroupform.get('invoicedate').value !=null && this.assetgroupform.get('invoicedate').value !="" ){
      let datevalue=this.assetgroupform.get('invoicedate').value;
      search=search+"&asset_cap="+this.datePipe.transform(datevalue,'yyyy-MM-dd');      
    } 
    if(this.assetgroupform.get('asset_cost').value !=null && this.assetgroupform.get('asset_cost').value !="" ){
      search=search+"&asset_cost="+this.assetgroupform.get('asset_cost').value;
    }
    this.spinner.show();
    console.log(search)
    this.Faservice.getassetdata1PV(this.presentpagebuk, this.pageSize = 10,search).subscribe((data) => {
      if(data.description == 'Invalid Branch Id'){
        this.toastr.error('No Branch ID Assigned')
        this.addRowDisable = true;
      }
      else if(data.code == "Header ID Not Matched"){
        this.toastr.error('Header ID Not Matched')
        this.spinner.hide()
        this.pageLength_popup = 0
        this.addRowDisable = true;
      }
      else if(data['data'].length == 0){
        this.toastr.error('No Data')
        this.spinner.hide()
        this.pageLength_popup = 0
      }
      else{
      // if(data['data']['desp_startswith']==false){
      //   delete data['data']['description']
      // }
      this.listcomments = data['data'];
      this.addRowDisable = false;
        setTimeout(() => {
          /** spinner ends after 3 seconds */
          this.spinner.hide();
        }, 3000);
      console.log( data);
      if(data['data'].length==0){
        this.toastr.warning('Matching data Not Found');
      }
      for (let i=0; i<this.listcomments.length; i++){
        this.listcomments[i]['is_Checked']=false;    
        this.listcomments[i]['images'] = [];
        this.listcomments[i]['image'] = [];
        this.listcomments[i]['files'] = [];
        this.listcomments[i]['control_office_branch'] = this.listcomments[i].branch_id?.control_office_branch
        this.branch_names = this.listcomments[0].branch_id?.name
        this.branch_codes = this.listcomments[0].branch_id?.code
        this.branch_id_data = this.listcomments[0].branch_id?.id
        if(this.listcomments[0].branch_id?.control_office_branch == null){
          this.ctrl_branch_id = this.listcomments[0].branch_id?.code  
        }
        else{
          this.ctrl_branch_id = this.listcomments[0].branch_id?.control_office_branch
        }
      }
      this.datapagination = data['pagination'];
      this.pageLength_popup = data['count'];
      console.log('total ', this.pageLength_popup)
      console.log('d-',data['data']);
      console.log('page',this.datapagination)
      if (this.listcomments.length >= 0) {
        this.has_nextbuk = this.datapagination.has_next;
        this.has_previousbuk = this.datapagination.has_previous;
        this.presentpagebuk = this.datapagination.index;
      }
      console.log(this.listcomments.length);
      for(let i=0;i<this.listcomments.length;i++){
        console.log('hiii');
    (this.assetsave.get('listproduct') as FormArray).push(this.fb.group({


      'id':new FormControl(),
      'barcode':new FormControl(),
      'product_name':new FormControl(),
      'branch_code':new FormControl(),
      'branch_name':new FormControl(),
      'asset_cost':new FormControl(),
      'asset_value':new FormControl(),
      'asset_tag':new FormControl(),
      'make':new FormControl(),
      'condition':new FormControl(),
      'status':new FormControl(),
      'serial_no': new FormControl(),
      'crnum':new FormControl(),
      'pvsts':new FormControl(),
      'pvsts_date':new FormControl(),
      'asset_tfr_id':new FormControl(),
      'product_spec':new FormControl(),
      'asset_owner':new FormControl(),
      'asset_owner_desg':new FormControl(),
      'kvb_asset_id':new FormControl(),
      'images': new FormControl(),
      'remarks' : new FormControl(),
      'model':new FormControl(''),
      'assetheader_id':new FormControl(),
      'product_id_data':new FormControl(""),
      'branch_id_data':new FormControl(),
      'newserialno':new FormControl(null),
       "oldserialno":new FormControl(null),
       "serialno_id":new FormControl(null),
       'oldderial_no':new FormControl(null),
       'serial_no_btn_enb': new FormControl(),
       'documents_data':new FormControl('')
    }));
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_tfr_id').disable();
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('id').patchValue(this.listcomments[i].id);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('barcode').patchValue(this.listcomments[i].barcode);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('product_name').patchValue(this.listcomments[i].product_id);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_code').patchValue(this.listcomments[i].branch_id?.code);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_name').patchValue(this.listcomments[i].branch_id?.name);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_cost').patchValue(this.listcomments[i].assetdetails_cost);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_value').patchValue(this.listcomments[i].assetdetails_value);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_tag').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('make').patchValue(this.listcomments[i]?.make);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('condition').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('status').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serial_no').patchValue(this.listcomments[i]?.serial_no);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('crnum').patchValue(this.listcomments[i]?.ecfnum);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('pvsts').patchValue(this.listcomments[i]?.pv_approved_status);
    const formattedDate = this.datePipe.transform(this.listcomments[i]?.pv_checker_date, 'dd-MMM-yyyy');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('pvsts_date').patchValue(formattedDate);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_tfr_id').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_owner').patchValue(this.listcomments[i]?.asset_owner_data);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_owner_desg').patchValue(this.listcomments[i]?.asset_owner_data.designation);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('kvb_asset_id').patchValue(this.listcomments[i].description.slice(1,15));
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('images').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('remarks').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('model').patchValue(this.listcomments[i]?.model);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('product_spec').patchValue(this.listcomments[i]?.product_spec);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('assetheader_id').patchValue(this.listcomments[i]?.assetheader_id);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('product_id_data').patchValue(this.listcomments[i]?.product_id_data);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_id_data').patchValue(this.listcomments[i]?.branch_id?.id);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('newserialno').patchValue(this.listcomments[i]?.newserialno);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('oldserialno').patchValue(this.listcomments[i]?.oldserialno);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serialno_id').patchValue(this.listcomments[i]?.serialno_id);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('oldderial_no').patchValue(this.listcomments[i]?.serial_no);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serial_no_btn_enb').patchValue(this.listcomments[i]?.serial_no_btn_enb);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('documents_data').patchValue(this.listcomments[i]?.documents_data);

      }
      // let i:any=((this.assetsave.get('listproduct') as FormArray).length);
      // ((this.assetsave.get('listproduct') as FormArray).removeAt(i[11]-1));
      }},
      (error)=>{
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      }
      )
      
  }
  displayFn(branch:Branch_data):string {
    return branch?branch.name:""
  }

  getdata1(){
    (this.assetsave.get('listproduct') as FormArray).clear()
    let search:string="";
    console.log(this.assetgroupform.value)
    if(this.assetgroupform.get('branch').value!='' && this.assetgroupform.get('branch').value!=null  && this.assetgroupform.get('branch').value.id !=undefined){
      console.log('hi')
      // this.searchdata.branch=this.assetgroupform.value.branch
      search=search+"&branch="+this.assetgroupform.get('branch').value.id;
    }    
    if(this.assetgroupform.get('Asset_id').value!='' && this.assetgroupform.get('Asset_id').value!=null){
      console.log('hii')
      // this.searchdata.barcode=this.assetgroupform.value.barcode
      search=search+"&barcode="+this.assetgroupform.get('Asset_id').value;
    }
    if(this.assetgroupform.get('asset_cat').value !=null && this.assetgroupform.get('asset_cat').value !="" ){
      search=search+"&asset_cat="+this.catId;
    }
    if(this.assetgroupform.get('product').value !=null && this.assetgroupform.get('product').value !="" ){
      search=search+"&product="+this.productId;
    }
    if(this.assetgroupform.get('invoicedate').value !=null && this.assetgroupform.get('invoicedate').value !="" ){
      let datevalue=this.assetgroupform.get('invoicedate').value;
      search=search+"&asset_cap="+this.datePipe.transform(datevalue,'yyyy-MM-dd');      
    } 
    if(this.assetgroupform.get('asset_cost').value !=null && this.assetgroupform.get('asset_cost').value !="" ){
      search=search+"&asset_cost="+this.assetgroupform.get('asset_cost').value;
    }
    if(this.assetgroupform.get('crno').value !=null && this.assetgroupform.get('crno').value !=""  && this.assetgroupform.get('crno').value !=undefined){
      search=search+"&crno="+this.assetgroupform.get('crno').value;
    }
    this.spinner.show();
    console.log(search)
    this.Faservice.getassetdata2(this.presentpagebuk, this.pageSize = 10,search).subscribe((data) => {
      if(data.description == 'Invalid Branch Id'){
        this.toastr.error('No Branch ID Assigned')
        this.addRowDisable = true;
      }
      else if(data.code == "Header ID Not Matched"){
        this.toastr.error('Header ID Not Matched')
        this.spinner.hide()
        this.pageLength_popup = 0
        this.addRowDisable = true;
      }
      else if(data['data'].length == 0){
        this.toastr.error('No Data')
        this.spinner.hide()
        this.pageLength_popup = 0
        this.addRowDisable = true;
      }
      else{
      this.listcomments = data['data'];
      this.addRowDisable = false;
        setTimeout(() => {
          /** spinner ends after 3 seconds */
          this.spinner.hide();
        }, 3000);
      console.log( data);
      for (let i=0; i<this.listcomments.length; i++){
        this.listcomments[i]['is_Checked']=false;    
        this.listcomments[i]['images'] = [];
        this.listcomments[i]['image'] = [];
        this.listcomments[i]['files'] = [];
        this.listcomments[i]['control_office_branch'] = this.listcomments[0].branch_id?.control_office_branch
        this.branch_names = this.listcomments[0].branch_id?.name
        this.branch_codes = this.listcomments[0].branch_id?.code
        this.branch_id_data = this.listcomments[0].branch_id?.id
        if(this.listcomments[0].branch_id?.control_office_branch == null){
          this.ctrl_branch_id = this.listcomments[0].branch_id?.code  
        }
        else{
          this.ctrl_branch_id = this.listcomments[0].branch_id?.control_office_branch
        }
      }
      this.datapagination = data['pagination'];
      this.pageLength_popup = data['count'];
      console.log('total ', this.pageLength_popup)
      console.log('d-',data['data']);
      console.log('page',this.datapagination)
      if (this.listcomments.length >= 0) {
        this.has_nextbuk = this.datapagination.has_next;
        this.has_previousbuk = this.datapagination.has_previous;
        this.presentpagebuk = this.datapagination.index;
      }
      console.log(this.listcomments.length);
      for(let i=0;i<this.listcomments.length;i++){
        console.log('hiii');
    (this.assetsave.get('listproduct') as FormArray).push(this.fb.group({


      'id':new FormControl(),
      'barcode':new FormControl(),
      'product_name':new FormControl(),
      'branch_code':new FormControl(),
      'branch_name':new FormControl(),
      'asset_cost':new FormControl(),
      'asset_value':new FormControl(),
      'asset_tag':new FormControl(),
      'make':new FormControl(),
      'condition':new FormControl(),
      'status':new FormControl(),
      'serial_no': new FormControl(),
      'crnum':new FormControl(),
      'kvb_asset_id':new FormControl(),
      'images': new FormControl(),
      'remarks' : new FormControl(),
      'model':new FormControl(''),
      'assetheader_id':new FormControl(),
      "product_id_data":new FormControl(""),
      'newserialno':new FormControl(null),
       "oldserialno":new FormControl(null),
       "serialno_id":new FormControl(null),
       'oldderial_no':new FormControl(null),
       'serial_no_btn_enb':new FormControl(''),
       'documents_data':new FormControl('')
    }));
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('id').patchValue(this.listcomments[i].id);

    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('barcode').patchValue(this.listcomments[i].barcode);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('crnum').patchValue(this.listcomments[i].crnum);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('product_name').patchValue(this.listcomments[i].product_id);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_code').patchValue(this.listcomments[i].branch_id?.code);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_name').patchValue(this.listcomments[i].branch_id?.name);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_cost').patchValue(this.listcomments[i].assetdetails_cost);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_value').patchValue(this.listcomments[i].assetdetails_value);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_tag').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('make').patchValue(this.listcomments[i].make);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('model').patchValue(this.listcomments[i].model);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('condition').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('status').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serial_no').patchValue(this.listcomments[i]?.serial_no);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('crnum').patchValue(this.listcomments[i]?.ecfnum);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('kvb_asset_id').patchValue(this.listcomments[i].description.slice(1,15));
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('images').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('remarks').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('assetheader_id').patchValue(this.listcomments[i]?.assetheader_id);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('product_id_data').patchValue(this.listcomments[i]?.product_id_data);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serial_no').patchValue(this.listcomments[i]?.serial_no);

     // 'newserialno':new FormControl(null),
      // "oldserialno":new FormControl(null),
      // "serialno_id":new FormControl(null)
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('newserialno').patchValue(this.listcomments[i]?.newserialno);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('oldserialno').patchValue(this.listcomments[i]?.oldserialno);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serialno_id').patchValue(this.listcomments[i]?.serialno_id);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serial_no_btn_enb').patchValue(this.listcomments[i]?.serial_no_btn_enb);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('documents_data').patchValue(this.listcomments[i]?.documents_data);

      }
      // let i:any=((this.assetsave.get('listproduct') as FormArray).length);
      // 'newserialno':new FormControl(null),
      // "oldserialno":new FormControl(null),
      // "serialno_id":new FormControl(null)
      // ((this.assetsave.get('listproduct') as FormArray).removeAt(i[11]-1));
      }},
      (error)=>{
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      }
      )
    }
    resetgetdata1(){
      (this.assetsave.get('listproduct') as FormArray).clear()
      let search:string="";
      console.log(this.assetgroupform.value);
      this.assetgroupform.reset('');
      if(this.assetgroupform.get('branch').value!='' && this.assetgroupform.get('branch').value!=null && this.assetgroupform.get('branch').value.id!=undefined){
        console.log('hi')
        // this.searchdata.branch=this.assetgroupform.value.branch
        search=search+"&branch="+this.assetgroupform.get('branch').value.id;
      }    
      if(this.assetgroupform.get('Asset_id').value!='' && this.assetgroupform.get('Asset_id').value!=null){
        console.log('hii')
        // this.searchdata.barcode=this.assetgroupform.value.barcode
        search=search+"&barcode="+this.assetgroupform.get('Asset_id').value;
      }
      if(this.assetgroupform.get('asset_cat').value !=null && this.assetgroupform.get('asset_cat').value !="" ){
        search=search+"&asset_cat="+this.catId;
      }
      if(this.assetgroupform.get('product').value !=null && this.assetgroupform.get('product').value !="" ){
        search=search+"&product="+this.productId;
      }
      if(this.assetgroupform.get('invoicedate').value !=null && this.assetgroupform.get('invoicedate').value !="" ){
        let datevalue=this.assetgroupform.get('invoicedate').value;
        search=search+"&asset_cap="+this.datePipe.transform(datevalue,'yyyy-MM-dd');      
      } 
      if(this.assetgroupform.get('asset_cost').value !=null && this.assetgroupform.get('asset_cost').value !="" ){
        search=search+"&asset_cost="+this.assetgroupform.get('asset_cost').value;
      }
      this.spinner.show();
      console.log(search)
      this.Faservice.getassetdata2PV(this.presentpagebuk, this.pageSize = 10,'').subscribe((data) => {
        if(data.description == 'Invalid Branch Id'){
          this.toastr.error('No Branch ID Assigned')
          this.addRowDisable = true;
        }
        else if(data.code == "Header ID Not Matched"){
          this.toastr.error('Header ID Not Matched')
          this.spinner.hide()
          this.pageLength_popup = 0
          this.addRowDisable = true;
        }
        else if(data['data'].length == 0){
          this.toastr.error('No Data')
          this.spinner.hide()
          this.pageLength_popup = 0
          this.addRowDisable = true;
        }
        else{
        this.listcomments = data['data'];
        this.addRowDisable = false;
          setTimeout(() => {
            /** spinner ends after 3 seconds */
            this.spinner.hide();
          }, 3000);
        console.log( data);
        for (let i=0; i<this.listcomments.length; i++){
          this.listcomments[i]['is_Checked']=false;    
          this.listcomments[i]['images'] = [];
          this.listcomments[i]['image'] = [];
          this.listcomments[i]['files'] = [];
          this.listcomments[i]['control_office_branch'] = this.listcomments[0].branch_id?.control_office_branch
          this.branch_names = this.listcomments[0].branch_id?.name
          this.branch_codes = this.listcomments[0].branch_id?.code
          this.branch_id_data = this.listcomments[0].branch_id?.id
          if(this.listcomments[0].branch_id?.control_office_branch == null){
            this.ctrl_branch_id = this.listcomments[0].branch_id?.code  
          }
          else{
            this.ctrl_branch_id = this.listcomments[0].branch_id?.control_office_branch
          }
        }
        this.datapagination = data['pagination'];
        this.pageLength_popup = data['count'];
        console.log('total ', this.pageLength_popup)
        console.log('d-',data['data']);
        console.log('page',this.datapagination)
        if (this.listcomments.length >= 0) {
          this.has_nextbuk = this.datapagination.has_next;
          this.has_previousbuk = this.datapagination.has_previous;
          this.presentpagebuk = this.datapagination.index;
        }
        console.log(this.listcomments.length);
        for(let i=0;i<this.listcomments.length;i++){
          console.log('hiii');
      (this.assetsave.get('listproduct') as FormArray).push(this.fb.group({
  
  
        'id':new FormControl(),
        'barcode':new FormControl(),
        'product_name':new FormControl(),
        'branch_code':new FormControl(),
        'branch_name':new FormControl(),
        'asset_cost':new FormControl(),
        'asset_value':new FormControl(),
        'asset_tag':new FormControl(),
        'make':new FormControl(),
        'condition':new FormControl(),
        'status':new FormControl(),
        'serial_no': new FormControl(),
        'crnum':new FormControl(),
        'kvb_asset_id':new FormControl(),
        'images': new FormControl(),
        'remarks' : new FormControl(),
        'assetheader_id':new FormControl(),
        'model':new FormControl(''),
        "product_id_data":new FormControl(""),
        'newserialno':new FormControl(null),
      "oldserialno":new FormControl(null),
      "serialno_id":new FormControl(null),
      'oldderial_no':new FormControl(null)
      }));
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('id').patchValue(this.listcomments[i].id);
  
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('barcode').patchValue(this.listcomments[i].barcode);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('crnum').patchValue(this.listcomments[i].crnum);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('product_name').patchValue(this.listcomments[i].product_id);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_code').patchValue(this.listcomments[i].branch_id?.code);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_name').patchValue(this.listcomments[i].branch_id?.name);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_cost').patchValue(this.listcomments[i].assetdetails_cost);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_value').patchValue(this.listcomments[i].assetdetails_value);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_tag').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('make').patchValue(this.listcomments[i].make);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('model').patchValue(this.listcomments[i].model);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('condition').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('status').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serial_no').patchValue(this.listcomments[i]?.serial_no);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('crnum').patchValue(this.listcomments[i]?.ecfnum);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('kvb_asset_id').patchValue(this.listcomments[i].description.slice(1,15));
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('images').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('remarks').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('assetheader_id').patchValue(this.listcomments[i]?.assetheader_id);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('product_id_data').patchValue(this.listcomments[i]?.product_id_data);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('oldderial_no').patchValue(this.listcomments[i]?.serial_no);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serial_no_btn_enb').patchValue(this.listcomments[i]?.serial_no_btn_enb);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('documents_data').patchValue(this.listcomments[i]?.documents_data);

      
     // 'newserialno':new FormControl(null),
      // "oldserialno":new FormControl(null),
      // "serialno_id":new FormControl(null)
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('newserialno').patchValue(this.listcomments[i]?.newserialno);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('oldserialno').patchValue(this.listcomments[i]?.oldserialno);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serialno_id').patchValue(this.listcomments[i]?.serialno_id);

        }
        // let i:any=((this.assetsave.get('listproduct') as FormArray).length);
        // ((this.assetsave.get('listproduct') as FormArray).removeAt(i[11]-1));
        }},
        (error)=>{
          this.spinner.hide();
          this.toastr.warning(error.status+error.statusText)
        }
        )
      }
    getdata_edit(){
      (this.assetsave.get('listproduct') as FormArray).clear()
      let search:string="";
      console.log(this.assetgroupform.value)
      
      if(this.assetgroupform.get('Asset_edit').value!='' && this.assetgroupform.get('Asset_edit').value!=null){
        console.log('hii')
        // this.searchdata.barcode=this.assetgroupform.value.barcode
        search=search+"&Asset_edit="+this.assetgroupform.get('Asset_edit').value;
      }
      this.spinner.show();
      console.log(search)
      this.Faservice.getassetdataedit(this.pageNumber = 1, this.pageSize = 10,search).subscribe((data) => {
        console.log(data)
        if(data['code'] == 'Not Available'){
          this.toastr.error('Maker Already Approved')
          this.spinner.hide()
          this.pageLength_popup = 0
          this.addRowDisable = true;
        }
        else if(data['data'].length==0){
          this.toastr.warning('Matching data Not Found');
          this.addRowDisable = true;
        }
        else{
          this.toastr.warning('Maker Already Done')
          this.listcomments = data['data'];
          this.addRowDisable = false;
            setTimeout(() => {
              /** spinner ends after 3 seconds */
              this.spinner.hide();
            }, 3000);
          console.log( data);
          for (let i=0; i<this.listcomments.length; i++){
            this.listcomments[i]['is_Checked']=false;    
            this.listcomments[i]['images'] = [];
            this.listcomments[i]['image'] = [];
            this.listcomments[i]['files'] = [];
            this.listcomments[i]['control_office_branch'] = this.listcomments[i].branch_id?.control_office_branch
            this.branch_names = this.listcomments[0].branch_id?.name
            this.branch_codes = this.listcomments[0].branch_id?.code
            this.branch_id_data = this.listcomments[0].branch_id?.id
            if(this.listcomments[0].branch_id?.control_office_branch == null){
              this.ctrl_branch_id = this.listcomments[0].branch_id?.code  
            }
            else{
              this.ctrl_branch_id = this.listcomments[0].branch_id?.control_office_branch
            }
          }
          this.datapagination = data['pagination'];
          this.pageLength_popup = data['count'];
          console.log('total ', this.pageLength_popup)
          console.log('d-',data['data']);
          console.log('page',this.datapagination)
          if (this.listcomments.length >= 0) {
            this.has_nextbuk = this.datapagination.has_next;
            this.has_previousbuk = this.datapagination.has_previous;
            this.presentpagebuk = this.datapagination.index;
          }
          console.log(this.listcomments.length);
          for(let i=0;i<this.listcomments.length;i++){
            console.log('hiii');
        (this.assetsave.get('listproduct') as FormArray).push(this.fb.group({
    
    
          'id':new FormControl(),
          'barcode':new FormControl(),
          'product_name':new FormControl(),
          'branch_code':new FormControl(),
          'branch_name':new FormControl(),
          'asset_cost':new FormControl(),
          'asset_value':new FormControl(),
          'asset_tag':new FormControl(),
          'make':new FormControl(),
          'condition':new FormControl(),
          'status':new FormControl(),
          'serial_no': new FormControl(),
          'crnum':new FormControl(),
          'kvb_asset_id':new FormControl(),
          'images': new FormControl(),
          'remarks' : new FormControl(),
          'model':new FormControl(''),
          'pvsts':new FormControl(''),
          'pvsts_date':new FormControl(''),
          'asset_tfr_id':new FormControl(),
          'asset_owner':new FormControl(),
          'asset_owner_desg':new FormControl(),
          'product_spec':new FormControl(''),
          'assetheader_id':new FormControl(),
          "product_id_data":new FormControl(""),
          "branch_id_data":new FormControl(),
            'newserialno':new FormControl(null),
      "oldserialno":new FormControl(null),
      "serialno_id":new FormControl(null),
      'oldderial_no':new FormControl(null),
      'serial_no_btn_enb':new FormControl(''),
      'documents_data':new FormControl('')
        }));
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_tfr_id').disable();
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('id').patchValue(this.listcomments[i].id);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('barcode').patchValue(this.listcomments[i].barcode);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('product_name').patchValue(this.listcomments[i].product_id);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_code').patchValue(this.listcomments[i].branch_code);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_name').patchValue(this.listcomments[i].branch_name);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_cost').patchValue(this.listcomments[i].assetdetails_cost);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_value').patchValue(this.listcomments[i].assetdetails_value);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_tag').patchValue(this.listcomments[i].asset_tag);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('make').patchValue(this.listcomments[i].make);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('model').patchValue(this.listcomments[i].model);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('condition').patchValue(this.listcomments[i].condition);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('status').patchValue(this.listcomments[i].status);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serial_no').patchValue(this.listcomments[i].serial_no);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('crnum').patchValue(this.listcomments[i]?.ecfnum);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('pvsts').patchValue(this.listcomments[i]?.pv_approved_status);
        const formattedDate = this.datePipe.transform(this.listcomments[i]?.pv_checker_date, 'dd-MMM-yyyy');        
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('pvsts_date').patchValue(formattedDate);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_tfr_id').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_owner').patchValue(this.listcomments[i]?.asset_owner_data);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_owner_desg').patchValue(this.listcomments[i]?.asset_owner_data.designation);
        
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('product_spec').patchValue(this.listcomments[i]?.product_spec);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('kvb_asset_id').patchValue(this.listcomments[i].description);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('images').patchValue('');
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('remarks').patchValue(this.listcomments[i].remarks);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('assetheader_id').patchValue(this.listcomments[i]?.assetheader_id);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('product_id_data').patchValue(this.listcomments[i]?.product_id_data);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_id_data').patchValue(this.listcomments[i]?.branch_id?.id);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('oldderial_no').patchValue(this.listcomments[i]?.serial_no);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serial_no_btn_enb').patchValue(this.listcomments[i]?.serial_no_btn_enb);

        // 'newserialno':new FormControl(null),
      // "oldserialno":new FormControl(null),
      // "serialno_id":new FormControl(null)
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('newserialno').patchValue(this.listcomments[i]?.newserialno);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('oldserialno').patchValue(this.listcomments[i]?.oldserialno);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serialno_id').patchValue(this.listcomments[i]?.serialno_id);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('documents_data').patchValue(this.listcomments[i]?.documents_data);
          }
          // let i:any=((this.assetsave.get('listproduct') as FormArray).length);
          // ((this.assetsave.get('listproduct') as FormArray).removeAt(i[11]-1));
          }},
          (error)=>{
            this.spinner.hide();
            this.toastr.warning(error.status+error.statusText)
          }
          )
          
      }
  
    categoryClick(d){
      this.catId = d.id
    }
    assetSearch(){
      this.search_mod = false
      console.log('false_edit',this.search_mod)
    }

    assetEditSearch(){
      this.search_mod = true
      console.log('true_edit',this.search_mod)
    }

  getassetcategorysummary(d){
    this.Faservice.getbranchpv(d,this.pageNumber)
         .subscribe((result:any) => {
          // this.spinner.hide();
           console.log("landlord-1", result);
           let datass = result['data'];
           this.listcomments = result['data'];
           for (let i=0; i<this.listcomments.length; i++){
            this.listcomments[i]['is_Checked']=false;    
            this.listcomments[i]['images'] = [];
            this.listcomments[i]['image'] = [];
            this.listcomments[i]['files'] = [];
            this.branch_names = this.listcomments[0].branch_id?.name
            this.branch_codes = this.listcomments[0].branch_id?.code
            this.branch_id_data = this.listcomments[0].branch_id?.id
          }
           this.datapagination = result['pagination'];
           this.pageLength_popup = result['count'];
          if (this.listcomments.length >= 0) {
            this.has_nextbuk = this.datapagination.has_next;
            this.has_previousbuk = this.datapagination.has_previous;
            this.presentpagebuk = this.datapagination.index;
          }
          else{
            this.toastr.warning('No Branch Data')
          }
           for(let i=0;i<this.listcomments.length;i++){
            console.log('hiii');
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('barcode').patchValue(this.listcomments[i].barcode);
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('crnum').patchValue(this.listcomments[i].crnum);
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('product_name').patchValue(this.listcomments[i].product_id);
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_code').patchValue(this.listcomments[i].branch_id?.code);
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_name').patchValue(this.listcomments[i].branch_id?.name);
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_cost').patchValue(this.listcomments[i].assetdetails_cost);
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_value').patchValue(this.listcomments[i].assetdetails_value);
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_tag').patchValue('');
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('make').patchValue(this.listcomments[i].make);
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('model').patchValue(this.listcomments[i].model);
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('condition').patchValue('');
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('status').patchValue('');
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serial_no').patchValue(this.listcomments[i]?.serial_no);
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('crnum').patchValue(this.listcomments[i]?.ecfnum);
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('kvb_asset_id').patchValue(this.listcomments[i].description.slice(1,15));
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('images').patchValue('');
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('remarks').patchValue('');
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('assetheader_id').patchValue(this.listcomments[i]?.assetheader_id);
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('product_id_data').patchValue(this.listcomments[i]?.product_id_data);
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_id_data').patchValue(this.listcomments[i]?.branch_id?.id);
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('pvsts').patchValue(this.listcomments[i]?.pv_approved_status);
          const formattedDate = this.datePipe.transform(this.listcomments[i]?.pv_checker_date, 'dd-MMM-yyyy');
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('pvsts_date').patchValue(formattedDate);
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_owner').patchValue(this.listcomments[i]?.asset_owner_data);
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_owner_desg').patchValue(this.listcomments[i]?.asset_owner_data?.designation);
  
        // 'newserialno':new FormControl(null),
      // "oldserialno":new FormControl(null),
      // "serialno_id":new FormControl(null)
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('newserialno').patchValue(this.listcomments[i]?.newserialno);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('oldserialno').patchValue(this.listcomments[i]?.oldserialno);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serialno_id').patchValue(this.listcomments[i]?.serialno_id);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('oldderial_no').patchValue(this.listcomments[i]?.serial_no);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('documents_data').patchValue(this.listcomments[i]?.documents_data);
        }
           this.spinner.hide();
           console.log("landlord", this.listcomments)   
         },
         (error:any)=>{
           console.log(error);
            
           this.spinner.hide();
         }
         );
        }


  get_productdatas(index:any){
     const currentInput = this.Inputproduct.toArray()[index].nativeElement;
     const query = currentInput.value;
    this.Faservice.getassetproductdata(query, 1)
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((results) => {
        let datas = results["data"];
        this.product = datas;
        console.log(this.product);

      });
  }

        autocompletecommodityScroll_product() {
          setTimeout(() => {
            if (
              this.matproductbAutocomplete &&
              this.autocompleteTrigger &&
              this.matproductbAutocomplete.panel
            ) {
              fromEvent(this.matproductbAutocomplete.panel.nativeElement, 'scroll')
                .pipe(
                  map(x => this.matproductbAutocomplete.panel.nativeElement.scrollTop),
                  takeUntil(this.autocompleteTrigger.panelClosingActions)
                )
                .subscribe(x => {
                  const scrollTop = this.matproductbAutocomplete.panel.nativeElement.scrollTop;
                  const scrollHeight = this.matproductbAutocomplete.panel.nativeElement.scrollHeight;
                  const elementHeight = this.matproductbAutocomplete.panel.nativeElement.clientHeight;
                  const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                  if (atBottom) {
                    if (this.has_nextcom_product === true) {
                      this.Faservice.getassetproductdata( this.Inputproduct.nativeElement.value, this.currentpagecom_product+1 )
                        .subscribe((results: any[]) => {
                          let datas = results["data"];
                          let datapagination = results["pagination"];
                          this.product = this.product.concat(datas);
                          if (this.product.length >= 0) {
                            this.has_nextcom_product = datapagination.has_next;
                            this.has_previouscom = datapagination.has_previous;
                            this.currentpagecom_product = datapagination.index;
                          }
                        },
      (error)=>{
        this.spinner.hide();
        this.toastr.warning(error)
      }
      )
                    }
                  }
                });
            }
          });
        }
      
  autocompleteScroll_asset() {
    // setTimeout(() => {
    //   if (
    //     this.matassetAutocomplete &&
    //     this.autocompleteTrigger &&
    //     this.matassetAutocomplete.panel
    //   ) {
    //     fromEvent(this.matassetAutocomplete.panel.nativeElement, 'scroll')
    //       .pipe(
    //         map(x => this.matassetAutocomplete.panel.nativeElement.scrollTop),
    //         takeUntil(this.autocompleteTrigger.panelClosingActions)
    //       )
    //       .subscribe(x => {
    //         const scrollTop = this.matassetAutocomplete.panel.nativeElement.scrollTop;
    //         const scrollHeight = this.matassetAutocomplete.panel.nativeElement.scrollHeight;
    //         const elementHeight = this.matassetAutocomplete.panel.nativeElement.clientHeight;
    //         const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
    //         if (atBottom) {
    //           if (this.has_nextcom_branch === true) {
    //             this.Faservice.getassetsearch( this.Inputassetid.nativeElement.value)
    //               .subscribe((results: any[]) => {
    //                 let datas = results["data"];
    //                 console.log('asset=',results)
    //                 let datapagination = results["pagination"];
    //                 this.listcomments = this.listcomments.concat(datas);
    //                 if (this.listcomments.length >= 0) {
    //                   this.has_nextcom_branch = datapagination.has_next;
    //                   this.has_previouscom = datapagination.has_previous;
    //                   this.currentpagecom_branch = datapagination.index;
    //                 }
    //               })
    //           }
    //         }
    //       });
    //   }
    // });
  }

  private getasset_category(keyvalue) {
    this.Faservice.getassetcategorynew(keyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.category = datas;
       
      },(error)=>{
        this.spinner.hide();
        this.toastr.warning(error)
      })
  }
  
  asset_category(){
    let keyvalue: String = "";
      this.getasset_category(keyvalue);
      this.assetgroupform.get('asset_cat').valueChanges
        .pipe(
          startWith(""),
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
           
  
          }),
         
          switchMap((value:any) => this.Faservice.getassetcategorynew(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )))
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.category = datas;
  
         },(error)=>{
        this.spinner.hide();
        this.toastr.warning(error)
      })
  
  }


  autocompleteScrollcategory() {
    setTimeout(() => {
      if (
        this.categoryAutoComplete &&
        this.autocompleteTrigger &&
        this.categoryAutoComplete.panel
      ) {
        fromEvent(this.categoryAutoComplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.categoryAutoComplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.categoryAutoComplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.categoryAutoComplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.categoryAutoComplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.Faservice.getassetcategorynew(this.categoryInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.category = this.category.concat(datas);
                    if (this.category.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                   },(error)=>{
        this.spinner.hide();
        this.toastr.warning(error)
      })
              }
            }
          });
      }
    });
  }

  autocompleteScroll_branch() {
    setTimeout(() => {
      if (this.matbranchAutocomplete && this.autocompleteTrigger && this.matbranchAutocomplete.panel) {
        fromEvent(this.matbranchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbranchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)).subscribe(x => {
            const scrollTop = this.matbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom_branch === true) {
                this.Faservice.getbranchsearchscroll( this.branchidInput.nativeElement.value, this.currentpagecom_branch + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    console.log('branch=',results)
                    let datapagination = results["pagination"];
                    this.branchdata = this.branchdata.concat(datas);
                    if (this.branchdata.length >= 0) {
                      this.has_nextcom_branch = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom_branch = datapagination.index;
                    }
                  },(error)=>{
        this.spinner.hide();
        this.toastr.warning(error)
      })
              }
            }
          });
      }
    });
  }
 
  branchget() {
    let boo: String = "";
    this.getbranch(boo);
  
    this.assetgroupform.get('branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')
  
        }),
        switchMap(value => this.Faservice.getbranchsearch(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
  
      .subscribe((results: any[]) => {
        this.branchdata = results["data"];
        if (results.length == 0){
          this.toastr.warning('No Branch Data')
          this.spinner.hide();
        }
       },(error)=>{
        this.spinner.hide();
        this.toastr.warning(error)
      })
  
  }
  getbranch(val) {
    this.Faservice.getbranchsearch(val,1).subscribe((results: any[]) => {
      this.branchdata = results["data"];
      if (results.length == 0){
        this.toastr.warning('No Branch Data')
        this.spinner.hide();
      }
     },(error)=>{
        this.spinner.hide();
        this.toastr.warning(error)
      })
  
  }
  public displaybranch(_branchval ? : BRANCH): string | undefined {
    return _branchval ? _branchval.name : undefined;
  }
  
  public display_branch(branch ? : BRANCH): string | undefined {
    return branch ? branch.code +'-'+ branch.name : undefined;
  }
  
  public display_assetbranch(branch ? :assetbranch):string | undefined{
    return branch? branch.name:undefined;
  }
  public display_assetowner(emp?: assetowner):string | undefined{
    return emp? emp.full_name:undefined;
  }
 

  get _branchval() {
    return this.assetgroupform.get('branch');
  }

  savesub(){

  }

  checker_branchs(data){
    this.branch_id=data.id;
    this.branch_names=data.name;
    this.branch_codes=data.code;
    this.getassetcategorysummary(this.branch_id);

 };
 
  resetbranchData() {
    this.assetgroupform.reset('')
    // this.impairmentAdd.patchValue({
    //   data: new Date()
    // })
  }

  finalSubmitted(){
    // let j:number=0;
    // console.log(this.d1,this.d2);
    // let search:string="";
    // if(this.assetgroupform.value.branch!='' && this.assetgroupform.value.branch!=null){
    //   this.searchdata.branch=this.assetgroupform.value.branch.id
    //   search=search+"&branch="+this.assetgroupform.value.branch;
    // }
    
    // if(this.assetgroupform.value.barcode!='' && this.assetgroupform.value.barcode!=null){
    //   this.searchdata.barcode=this.assetgroupform.value.barcode
    //   search=search+"&barcode="+this.assetgroupform.value.barcode;
    // }
     
    // this.Faservice.getassetdata1(this.pageNumber = 1, this.pageSize = 10,'').subscribe(data=>{

    // })
    
  
  }

  search(){
    if(this.search_mod==false){
      this.getdata1();
      this.save_btn = false;
      this.addRowDisable = false;
    }
    else if(this.search_mod==true){
      this.getdata_edit();
      this.save_btn = true;
      this.addRowDisable = true;
    }
    // this.assetgroupform.get('Asset_id').patchValue('');
    // this.assetgroupform.get('branch').patchValue('');
    // this.assetgroupform.get('Asset_edit').patchValue('');
  }

  asset_tag_remove(e:any){
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('asset_tag').patchValue('');
  }
  make_remove(e:any){
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('make').patchValue('');
  }
  serial_no_remove(e:any){
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('serial_no').patchValue('');
  }
  remarks_remove(e:any){
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('remarks').patchValue('');
  }
  crnum_remove(e:any){
  ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('crnum').patchValue('');
  }
  kvb_asset_id_remove(e:any){
  ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('kvb_asset_id').patchValue('');
  }

  assetgrps_assetid(e:any){
    this.d1 = e.bracode
    // let obj:string = event.target.value;
    let dear:any={'asset_id':e.barcode}
    // this.Faservice.getassetsearch(dear).subscribe(results => {
    //   console.log(results);
    //   for (let i=0; i<results.length; i++) {
    //     console.log(i);
    //     this.listcomments = results
    //   }
    // })
  }

  assetgrps_ddlbranch(e:any){
    // this.d2 = e.branch_id.id
    // // let obj:string = event.target.value;
    // let dear1:any = {'branch_name':e.branch_id.name};
    // console.log(dear1)
    // this.Faservice.getbranchsearch(dear1,1).subscribe(results => {
    //   console.log(results);
    //   for (let i=0; i<results.length; i++) {
    //     console.log(i);
    //     this.listcomments = results
    //     console.log(this.listcomments);
    //   }
    // })
    if(this.assetgroupform.value.branch!=''||undefined){
      this.searchdata.branch=this.assetgroupform.value.branch.id
      
    }else{
      delete this.searchdata.branch;
  }      
}

  files: any
  myFiles: Array<any> = [];
  getFileDetails(index, e:any,data:any) {
    console.log('q=',data);
    const d:any=new FormData();
    this.listcomments[index] = [{'files':[],'images':[],'image':[]}]
    console.log(this.listcomments)
    for (var i = 0; i < e.target.files.length; i++) {
      this.listcomments[index].files = []
      this.listcomments[index].images = [];
      this.listcomments[index].image = []

      this.listcomments[index].files.push(e.target.files[i].name);
      const reader :any= new FileReader();
      reader.readAsDataURL(e.target.files[i]);
      reader.onload = (_event) => {
      this.listcomments[index].images.push(reader.result);
      }
      this.frmData.append('file',e.target.files[i])
    }
    // this.saveCheck=true;
    console.log('form=',this.frmData)
    this.listcomments[index].image.push(d);
    console.log(this.listcomments[index])
  }

  goBack(){
    this.getdata();
    this.save_btn=false
  }


  uploadFiles() {
    const frmData = new FormData();

    for (var i = 0; i < this.myFiles.length; i++) {
      frmData.append("fileUpload", this.myFiles[i]);
    }
    console.log(frmData)
  }

  imagess(e:any){
    this.images=e;
  }

  deleteRow(listIndex: number, fileIndex: number) {
    console.log("files", this.listcomments[listIndex].files);
    this.listcomments[listIndex].files.splice(fileIndex, 1);
    this.listcomments[listIndex].images.splice(fileIndex, 1);

    console.log("filess", this.listcomments[listIndex].files);
  }

  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  buknextClick() {
    // let c = (this.assetsave.get('listproduct')).length
    // console.log('length',c)
    // for(let i=0;i<=c;i++){
    //   ((this.assetsave.get('listproduct') as FormArray).removeAt(i))
    // }
    ((this.assetsave.get('listproduct') as FormArray).clear());
   
    console.log(this.has_nextbuk,this.has_previousbuk,this.presentpagebuk)
    if (this.has_nextbuk === true) {
      this.presentpagebuk = this.presentpagebuk + 1
      this.spinner.show();
      this.getdata();
      // this.Faservice.getassetdata1(this.pageNumber = this.presentpagebuk + 1, 10,'').subscribe(data => {
      //   console.log(data)
      //   this.listcomments = data['data'];
      //   this.spinner.hide();
      //   for (let i=0; i<this.listcomments.length; i++){
      //     this.listcomments[i]['is_Checked']=false;    
      //     this.listcomments[i]['images'] = [];
      //     this.listcomments[i]['image'] = [];
      //     this.listcomments[i]['files'] = [];
      //     this.branch_names = this.listcomments[0].branch_id?.name
      //     this.branch_codes = this.listcomments[0].branch_id?.code
      //   }
      //   this.datapagination = data['pagination'];
      //   console.log('d-',data['data']);
      //   console.log('page',this.datapagination)
      //   if (this.listcomments.length >= 0) {
      //     this.has_nextbuk = this.datapagination.has_next;
      //     this.has_previousbuk = this.datapagination.has_previous;
      //     this.presentpagebuk = this.datapagination.index;
      //   }
      //   for(let i=0;i<this.listcomments.length;i++){
      //     console.log('hiii');
      // (this.assetsave.get('listproduct') as FormArray).push(this.fb.group({
  
  
      //   'id':new FormControl(),
      //   'barcode':new FormControl(),
      //   'product_name':new FormControl(),
      //   'branch_code':new FormControl(),
      //   'branch_name':new FormControl(),
      //   'asset_cost':new FormControl(),
      //   'asset_value':new FormControl(),
      //   'asset_tag':new FormControl(),
      //   'make':new FormControl(),
      //   'condition':new FormControl(),
      //   'status':new FormControl(),
      //   'serial_no': new FormControl(),
      //   'crnum':new FormControl(),
      //   'kvb_asset_id':new FormControl(),
      //   'images': new FormControl(),
      //   'remarks' : new FormControl(),
      // }));
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('id').patchValue(this.listcomments[i].id);
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('barcode').patchValue(this.listcomments[i].barcode);
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('crnum').patchValue(this.listcomments[i].crnum);
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('product_name').patchValue(this.listcomments[i].product_id);
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_code').patchValue(this.listcomments[i].branch_id?.code);
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_name').patchValue(this.listcomments[i].branch_id?.name);
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_cost').patchValue(this.listcomments[i].assetdetails_cost);
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_value').patchValue(this.listcomments[i].assetdetails_value);
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_tag').patchValue('');
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('make').patchValue('');
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('condition').patchValue('');
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('status').patchValue('');
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serial_no').patchValue('');
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('crnum').patchValue(this.listcomments[i].invoice_id?.ecfnum);
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('kvb_asset_id').patchValue(this.listcomments[i].description.slice(1,15));
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('images').patchValue('');
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('remarks').patchValue('');
      
      
      //   }
      //   // let i:any=((this.assetsave.get('listproduct') as FormArray).length);
      //   // ((this.assetsave.get('listproduct') as FormArray).removeAt(i[11]-1));
      //   },
      //   (error)=>{
      //     this.spinner.hide();
      //     this.toastr.warning(error.status+error.statusText)
      //   }
      //   )
      }}
  
  bukpreviousClick() {
    ((this.assetsave.get('listproduct') as FormArray).clear())
    if (this.has_previousbuk === true) {
      this.spinner.show();
      this.presentpagebuk = this.presentpagebuk - 1;
      this.getdata();
      // this.Faservice.getassetdata1(this.pageNumber = this.presentpagebuk - 1, 10,'').subscribe(data => {
      //   console.log(data)
      //   this.listcomments = data['data'];
      //   this.spinner.hide();
      //   for (let i=0; i<this.listcomments.length; i++){
      //     this.listcomments[i]['is_Checked']=false;    
      //     this.listcomments[i]['images'] = [];
      //     this.listcomments[i]['image'] = [];
      //     this.listcomments[i]['files'] = [];
      //     this.branch_names = this.listcomments[0].branch_id?.name
      //     this.branch_codes = this.listcomments[0].branch_id?.code
      //   }
      //   this.datapagination = data['pagination'];
      //   console.log('d-',data['data']);
      //   console.log('page',this.datapagination)
      //   if (this.listcomments.length >= 0) {
      //     this.has_nextbuk = this.datapagination.has_next;
      //     this.has_previousbuk = this.datapagination.has_previous;
      //     this.presentpagebuk = this.datapagination.index;
      //   }
      //   for(let i=0;i<this.listcomments.length;i++){
      //     console.log('hiii');
      // (this.assetsave.get('listproduct') as FormArray).push(this.fb.group({
  
  
      //   'id':new FormControl(),
      //   'barcode':new FormControl(),
      //   'product_name':new FormControl(),
      //   'branch_code':new FormControl(),
      //   'branch_name':new FormControl(),
      //   'asset_cost':new FormControl(),
      //   'asset_value':new FormControl(),
      //   'asset_tag':new FormControl(),
      //   'make':new FormControl(),
      //   'condition':new FormControl(),
      //   'status':new FormControl(),
      //   'serial_no': new FormControl(),
      //   'crnum':new FormControl(),
      //   'kvb_asset_id':new FormControl(),
      //   'images': new FormControl(),
      //   'remarks' : new FormControl(),
      // }));
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('id').patchValue(this.listcomments[i].id);
  
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('barcode').patchValue(this.listcomments[i].barcode);
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('crnum').patchValue(this.listcomments[i].crnum);
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('product_name').patchValue(this.listcomments[i].product_id);
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_code').patchValue(this.listcomments[i].branch_id?.code);
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_name').patchValue(this.listcomments[i].branch_id?.name);
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_cost').patchValue(this.listcomments[i].assetdetails_cost);
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_value').patchValue(this.listcomments[i].assetdetails_value);
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_tag').patchValue('');
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('make').patchValue('');
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('condition').patchValue('');
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('status').patchValue('');
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serial_no').patchValue('');
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('crnum').patchValue(this.listcomments[i].invoice_id?.ecfnum);
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('kvb_asset_id').patchValue(this.listcomments[i].description.slice(1,15));
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('images').patchValue('');
      // ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('remarks').patchValue('');
      
      
      //   }
      //   // let i:any=((this.assetsave.get('listproduct') as FormArray).length);
      //   // ((this.assetsave.get('listproduct') as FormArray).removeAt(i[11]-1));
      //   },
      //   (error)=>{
      //     this.spinner.hide();
      //     this.toastr.warning(error.status+error.statusText)
      //   }
      //   )
      }}
  // Example: 
  //     form = new FormGroup({
  //       first: new FormControl({value: 'Nancy', disabled: true}, Validators.required),
  //       last: new FormControl('Drew', Validators.required)
  //     });

  dummyboolean:any=true
  addItem() {
    this.toastr.success('Row Added To Last Field')
    this.toastr.warning('Save The Added Row First','',{timeOut:40000})
    this.addrowRemove = false
    this.addrowCheck = false
    this.saveCheck = true;
    this.dummyboolean=false;
    this.addRowOnce = true;
    let max:number = 10;
    let id = Math.floor(Math.random() * (max + 1));
    (this.assetsave.get('listproduct') as FormArray).push(this.fb.group({
      'id': null,
      'barcode':new FormControl("Unknown"),
      'product_name':new FormControl(),
      'branch_code':new FormControl(this.branch_codes),
      'branch_name':new FormControl(this.branch_names),
      'asset_cost':new FormControl(0),
      'asset_value':new FormControl(0),
      'asset_tag':new FormControl(),
      'make':new FormControl(),
      'product_spec':new FormControl(),
      'unknown_asset_id':new FormControl(''), //while add new data needs to send it as empty
      'condition':new FormControl(),
      'status':new FormControl(),
      'serial_no': new FormControl(),
      'crnum': new FormControl(),
      'kvb_asset_id': new FormControl(),
      'images': new FormControl(),
      'remarks' : new FormControl(),
      'pvsts':new FormControl(''),
      'pvsts_date':new FormControl(''),
      'asset_tfr_id':new FormControl(),
      'branch_id_data':new FormControl(this.branch_id_data),
      'product_id_data':new FormControl(),
      'asset_owner':new FormControl(),
      'asset_owner_desg':new FormControl(),
    }));    
    this.readOnly = false
    this.flag = true;
    // this.listcomments.push(this.addItem());
    // const newGroup=new FormGroup({});
    // this.displayedFields.forEach(x=>{
    //   newGroup.addControl(x,new FormControl())
    // })
    // this.listcomments.push(newGroup)
    // this.currentElement = this.listcomments[9];
    // this.listcomments.push(obj)
    // this.currentElement = this.listcomments[index];
    // this.listcomments.splice(index, 0, this.currentElement);
    // this.flag = true;
    // for(let i=0;i<this.listcomments.length;i++){
    //   if(this.listcomments[i].id==data.id){
    //     this.listcomments[i].is_Checked = true;
    //   }
    // }
    // this.listcomments.style.color = "red";  
    // index.style.fontWeight = "bold"; 
 }

 product12(data){
  this.productId=data.id;
  }

 make1(){
   if(this.assetsave.valid){
     this.statusCheck = true
   }
 }

 serial(){
  if(this.assetsave.valid){
    this.statusCheck = true
  }
}

condition(){
  if(this.assetsave.valid){
    this.statusCheck = true
  }
}

remarks1(){
  if(this.assetsave.valid){
    this.statusCheck = true
  }
}

product1(){
  if(this.assetsave.valid){
    this.statusCheck = true
  }
}

crnum1(){
  if(this.assetsave.valid){
    this.statusCheck = true
  }
}

kvb_asset_id1(){
  if(this.assetsave.valid){
    this.statusCheck = true
  }
}
 edit(value,index){
   console.log(value)
   console.log(index)
  const formArray = this.assetsave.get('listproduct') as FormArray;
  const fb = formArray.at(index) as FormGroup;
  if(value == 'Not available'){
    this.statusCheck = true
    fb.get('asset_tfr_id')?.disable();

  }
  else if(value == 'Transferred (if transferred enter branch name)'){
    this.statusCheck = true
    fb.get('asset_tfr_id')?.enable();

  }
  else{
    this.statusCheck=false
  }
 }

valueCheck(){
  if(this.assetsave.valid && this.statusCheck==true){
    this.newFlag = false
  }
  else{
    this.newFlag = true
  }
}

  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);
 
    if (!reg.test(input)) {
      this.toastr.warning('Please Give Value As Decimal');
        event.preventDefault();
    }
 }

  onScroll(){
    console.log("Scrolled");  
    // this.page = this.page + 1;  
    // if(this.notScrolly && this.notEmptyPost) {
    //   this.spinner.show();
    //   // this.notScrolly = false;
    //   // this.loadNextPost();
    // setTimeout(() => {
    //   /** spinner ends after 3 seconds */
    //   this.spinner.hide();
    // }, 3000);
    }
    // }

    // loadNextPost() {
    
    //   // return last post from the array
    //   const lastPost = this.listcomments[this.listcomments.length - 1];
    //   // get id of last post
    //   const lastPostId = lastPost.id;
    //   // sent this id as key value parse using formdata()
    //   const dataToSend = new FormData();
    //   dataToSend.append('id',lastPostId);
    //   // call http request
    //   this.http.post(url, dataToSend).subscribe((data:any) => {
    //     const newPost = data[0];
    //     this.spinner.hide();
    //     if(newPost.length === 0) {
    //       this.notEmptyPost = false;
    //     }
    //     // add newly fetched posts to the existing post 
    //     this.listcomments = this.listcomments.concat(newPost);
    //     this.notScrolly = true;
    //   })
    // }
  remove(form: any,e:number){
    let i:any=((this.assetsave.get('listproduct') as FormArray).length);
    ((this.assetsave.get('listproduct') as FormArray).removeAt(i-1));
    this.flag = false;
    this.addrowCheck = true
    this.toastr.error('Row Deleted')
    this.dummyboolean=true;
    this.addRowOnce = false;
  }
    
  save(form: any,e:number) {
    let data_val=[]
      if(this.flag==false){
        let data_val=[];
        if (this.statusCheck==false){
        if(this.addrowCheck == false){
          this.toastr.error('Save The Added Row First')
        }
        if((this.assetsave.get('listproduct') as FormArray).at(e).get('status').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('status').value ==""){
          this.toastr.warning('Please Select Valid Status');
          return false;
        }
        else if((this.assetsave.get('listproduct') as FormArray).at(e).get('asset_tag').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('asset_tag').value ==""){
          this.toastr.warning('Please Select Valid Asset Tag');
          return false;
        }
        else if((this.assetsave.get('listproduct') as FormArray).at(e).get('make').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('make').value ==""){
          this.toastr.warning('Please Select Valid Make');
          return false;
        }
        else if((this.assetsave.get('listproduct') as FormArray).at(e).get('remarks').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('remarks').value ==""){
          this.toastr.warning('Please Select Valid Remarks');
          return false;
        }
        else if((this.assetsave.get('listproduct') as FormArray).at(e).get('serial_no').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('serial_no').value ==""){
          this.toastr.warning('Please Select Valid Serial No');
          return false;
        }
        // else if((this.assetsave.get('listproduct') as FormArray).at(e).get('crnum').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('crnum').value ==""){
        //   this.toastr.warning('Please Select Valid CR Number');
        //   return false;
        // }
        // else if((this.assetsave.get('listproduct') as FormArray).at(e).get('kvb_asset_id').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('kvb_asset_id').value ==""){
        //   this.toastr.warning('Please Select Valid KVB Asset ID');
        //   return false;
        // }
        else if((this.assetsave.get('listproduct') as FormArray).at(e).get('condition').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('condition').value ==""){
          this.toastr.warning('Please Select Valid Condition');
          return false;
        }
        // else if((this.assetsave.get('listproduct') as FormArray).at(e).get('images').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('images').value ==""){
        //   this.toastr.warning('Please Select Valid images');
        //   return false;
        // }
        console.log('h=',(this.assetsave.get('listproduct') as FormArray).at(e).value)
        let h=(this.assetsave.get('listproduct') as FormArray).at(e).value;
        h['control_office_branch']=this.branch_codes
        console.log('index',e)
        // h['id']=this.listcomments[e].id
        // h['asset_details_id']=parseInt(this.listcomments[e].assetdetails_id)  
        // h['asset_details_id']=this.listcomments[e].ass
        // data_val.push(h);
        this.frmData.append('data',JSON.stringify(h))
        // console.log('ee=',data_val);
        // console.log('frmdata=',this.frmData)
      this.spinner.show();
      if(this.saveCheck==false){
      this.Faservice.getassetsave(this.frmData).subscribe(result=>{
        console.log(result);        
        this.toastr.success('success');
        this.frmData=""
        setTimeout(() => {
          /** spinner ends after 3 seconds */
          this.spinner.hide();
        }, 3000);
       },(error)=>{
        this.spinner.hide();
        this.toastr.warning(error)
      })
      }
      else if(this.saveCheck==true){
      this.Faservice.getassetsave1(this.frmData).subscribe(result=>{
        console.log(result);
        this.toastr.success('success');
        this.frmData=""
        setTimeout(() => {
          /** spinner ends after 3 seconds */
          this.spinner.hide();
        }, 3000);
       },(error)=>{
        this.spinner.hide();
        this.toastr.warning(error)
      })
      }
      // this.assetsave.reset();
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('asset_tag').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('make').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('condition').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('status').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('serial_no').patchValue('');
      // ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('crnum').patchValue('');
      // ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('kvb_asset_id').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('images').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('remarks').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).removeAt(e));
      // let index = this.listcomments.findIndex(d => d.id === form.id); //find index in your array
      // this.listcomments.splice(index, 1);
      // this.pageLength_popup = this.listcomments.length
      // console.log(e)
      // console.log(this.as_assetcat)
      this.readOnly = true;
      this.addrowRemove = true
      this.saveCheck=false;
      this.dummyboolean=true;
      if (this.listcomments[e].files>0) {
        this.listcomments[e].files = []
        this.listcomments[e].images = [];
        this.listcomments[e].image = []
        }
      
    }
    if (this.statusCheck==true){
      if(this.addrowCheck == false){
        this.toastr.error('Save The Added Row First')
      }
      if((this.assetsave.get('listproduct') as FormArray).at(e).get('status').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('status').value ==""){
        this.toastr.warning('Please Select Valid Status');
        return false;
      }
      else if((this.assetsave.get('listproduct') as FormArray).at(e).get('remarks').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('remarks').value ==""){
        this.toastr.warning('Please Select Valid Remarks');
        return false;
      }
      // else if((this.assetsave.get('listproduct') as FormArray).at(e).get('images').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('images').value ==""){
      //   this.toastr.warning('Please Select Valid images');
      //   return false;
      // }
      console.log('h=',(this.assetsave.get('listproduct') as FormArray).at(e).value)
      let h=(this.assetsave.get('listproduct') as FormArray).at(e).value;
      // data_val.push(h);
      h['control_office_branch']=this.branch_codes
      console.log('index',e)
      // h['id']=this.listcomments[e].id
      // h['asset_details_id']=parseInt(this.listcomments[e].assetdetails_id)
    this.frmData.append('data',JSON.stringify(h))
        // console.log('ee=',data_val);
        // console.log('frmdata=',this.frmData)
    this.spinner.show();
    if(this.saveCheck==false){
    this.Faservice.getassetsave(this.frmData).subscribe(result=>{
      console.log(result);
      this.toastr.success('success');
      this.frmData=""
      setTimeout(() => {
        /** spinner ends after 3 seconds */
        this.spinner.hide();
      }, 3000);
     },(error)=>{
        this.spinner.hide();
        this.toastr.warning(error)
      })
    }
    else if(this.saveCheck==true){
    this.Faservice.getassetsave(this.frmData).subscribe(result=>{
      console.log(result);
      this.toastr.success('success');
      this.frmData=""
      setTimeout(() => {
        /** spinner ends after 3 seconds */
        this.spinner.hide();
      }, 3000);
     },(error)=>{
        this.spinner.hide();
        this.toastr.warning(error)
      })
    }
    // this.assetsave.reset();
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('asset_tag').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('make').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('condition').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('status').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('serial_no').patchValue('');
    // ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('crnum').patchValue('');
    // ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('kvb_asset_id').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('images').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('remarks').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).removeAt(e));
    // let index = this.listcomments.findIndex(d => d.id === form.id); //find index in your array
    // this.listcomments.splice(index, 1);
    // this.pageLength_popup = this.listcomments.length
    // console.log(e)
    // console.log(this.as_assetcat)
    this.readOnly = true;
    this.addrowRemove = true
    this.saveCheck=false;
    this.dummyboolean=true;
    if (this.listcomments[e].files>0) {
      this.listcomments[e].files = []
      this.listcomments[e].images = [];
      this.listcomments[e].image = []
      }
  }
}
     
    else if(this.flag==true){
    if((this.assetsave.get('listproduct') as FormArray).at(e).get('barcode').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('barcode').value ==""){
      this.toastr.warning('Please Select Valid Barcode');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('product_name').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('product_name').value ==""){
      this.toastr.warning('Please Select Valid Product Name');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('branch_code').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('branch_code').value ==""){
      this.toastr.warning('Please Select Valid Branch Code');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('branch_name').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('branch_name').value ==""){
      this.toastr.warning('Please Select Valid Branch Name');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('asset_cost').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('asset_cost').value ==""){
      this.toastr.warning('Please Select Valid Asset Cost');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('asset_value').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('asset_value').value ==""){
      this.toastr.warning('Please Select Valid Asset Value');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('status').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('status').value ==""){
      this.toastr.warning('Please Select Valid Status');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('asset_tag').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('asset_tag').value ==""){
      this.toastr.warning('Please Select Valid Asset Tag');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('make').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('make').value ==""){
      this.toastr.warning('Please Select Valid Make');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('serial_no').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('serial_no').value ==""){
      this.toastr.warning('Please Select Valid Serial No');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('crnum').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('crnum').value ==""){
      this.toastr.warning('Please Select Valid CR Number');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('kvb_asset_id').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('kvb_asset_id').value ==""){
      this.toastr.warning('Please Select Valid KVB Asset ID');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('condition').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('condition').value ==""){
      this.toastr.warning('Please Select Valid Condition');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('remarks').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('remarks').value ==""){
      this.toastr.warning('Please Select Valid Remarks');
      return false;
    }
    // else if((this.assetsave.get('listproduct') as FormArray).at(e).get('images').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('images').value ==""){
    //   this.toastr.warning('Please Select Valid images');
    //   return false;
    // }
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('id').patchValue('');
    console.log('h=',(this.assetsave.get('listproduct') as FormArray).at(e).value)
    let h=(this.assetsave.get('listproduct') as FormArray).at(e).value;
    // data_val.push(h);
    h['control_office_branch']=this.ctrl_branch_id
    this.frmData.append('data',JSON.stringify(h))
        // console.log('ee=',data_val);
        // console.log('frmdata=',this.frmData)
    
    if(this.saveCheck==false){
    this.Faservice.getassetrowsave(this.frmData).subscribe(result=>{
      console.log(result);
      if(result.description == 'INVALID_ASSETID_ID'){
        this.toastr.error('Barcode Already in Data')
      }
      else{
        this.toastr.success('Success');
        this.frmData=""
      }
      this.spinner.show();
      setTimeout(() => {
      /** spinner ends after 3 seconds */
      this.spinner.hide();
      }, 3000);
     },(error)=>{
        this.spinner.hide();
        this.toastr.warning(error)
      })
    }
    else if(this.saveCheck==true){
      this.Faservice.getassetrowsave1(this.frmData).subscribe(result=>{
        console.log(result);
        if(result.description == 'INVALID_ASSETID_ID'){
          this.toastr.error('Barcode Already in Data')
        }
        else{
          this.toastr.success('Success');
          this.frmData=""
        }
        this.spinner.show();
        setTimeout(() => {
        /** spinner ends after 3 seconds */
        this.spinner.hide();
        }, 3000);
       },(error)=>{
        this.spinner.hide();
        this.toastr.warning(error)
      })
    }
    // this.assetsave.reset();
    ((this.assetsave.get('listproduct') as FormArray).removeAt(e));
    
    // this.listcomments = this.listcomments.show();
    // let index = this.listcomments.findIndex(d => d.id === form.id); //find index in your array
    // this.listcomments.splice(index, 1);
    // this.pageLength_popup = this.listcomments.length
    // console.log(e)
    // console.log(this.as_assetcat)
    this.flag = false;
    this.readOnly = true;
    this.addrowRemove = true;
    this.addrowCheck = true;
    this.id = ''
    this.saveCheck=false;
    this.dummyboolean=true;
    this.addRowOnce = false;
    if (this.listcomments[e].files>0) {
      this.listcomments[e].files = []
      this.listcomments[e].images = [];
      this.listcomments[e].image = []
      }
    let i:any=((this.assetsave.get('listproduct') as FormArray).length);
  ((this.assetsave.get('listproduct') as FormArray).removeAt(i-1));
  }
    // let max:number = 5;
    // form['asset_master_code_id']=Math.floor(Math.random() * (max + 1));
//     if(this.flag==false){
//       let data_val=[];
//       form['asset_tag']=this.assetsave.get('asset_tag').value;
//       form['make']=this.assetsave.get('make').value;
//       form['condition']=this.assetsave.get('condition').value;
//       form['status']=this.assetsave.get('status').value;    
//       form['serial_no']=this.assetsave.get('serial_no').value;
//       form['remarks']=this.assetsave.get('remarks').value;
//       data_val.push(form);
//       // this.frmData.append('data_val',JSON.stringify(this.listcomments))
//       // console.log(form);
//       console.log('ee=',data_val);
//       // console.log('frmdata=',this.frmData)
//       this.toastr.success('success');
//       this.spinner.show();
//       setTimeout(() => {
//         /** spinner ends after 3 seconds */
//         this.spinner.hide();
//       }, 3000);
//       this.Faservice.getassetsave(data_val).subscribe(result=>{
//         console.log(result);
//       })
//       this.assetsave.reset();
//       // this.listcomments = this.listcomments.show();
//       let index = this.listcomments.findIndex(d => d.id === form.id); //find index in your array
//       this.listcomments.splice(index, 1);
//       this.pageLength_popup = this.listcomments.length
//       console.log(e)
//       console.log(this.as_assetcat)
//   }
//   else if(this.flag==true){
//     let data_val=[]
//     form['barcode']=this.assetsave.get('barcode').value;
//     form['product_name']=this.assetsave.get('product_name').value;
//     form['branch_code']=this.assetsave.get('branch_code').value;
//     form['branch_name']=this.assetsave.get('branch_name').value;    
//     form['asset_cost']=this.assetsave.get('asset_cost').value;
//     form['asset_value']=this.assetsave.get('asset_value').value;
//     form['asset_tag']=this.assetsave.get('asset_tag').value;
//     form['make']=this.assetsave.get('make').value;
//     form['condition']=this.assetsave.get('condition').value;
//     form['status']=this.assetsave.get('status').value;    
//     form['serial_no']=this.assetsave.get('serial_no').value;
//     form['remarks']=this.assetsave.get('remarks').value;
//     data_val.push(form);
//     this.frmData.append('data_val',JSON.stringify(this.listcomments))
//     console.log(form);
//     console.log('ee=',data_val);
//     console.log('frmdata=',this.frmData)
//     this.toastr.success('success');
//     this.spinner.show();
//     setTimeout(() => {
//       /** spinner ends after 3 seconds */
//       this.spinner.hide();
//     }, 3000);
//     this.Faservice.getassetrowsave(this.frmData).subscribe(result=>{
//       console.log(result);
//     })
//     this.assetsave.reset();
//     // this.listcomments = this.listcomments.show();
//     let index = this.listcomments.findIndex(d => d.id === form.id); //find index in your array
//     this.listcomments.splice(index, 1);
//     this.pageLength_popup = this.listcomments.length
//     console.log(e)
//     console.log(this.as_assetcat)
//   }
//   this.flag = false;
}

update(form: any,e:number) {
    if((this.assetsave.get('listproduct') as FormArray).at(e).get('remarks').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('remarks').value ==""){
      this.toastr.warning('Please Select Valid Remarks');
      return false;
    }
    console.log('h=',(this.assetsave.get('listproduct') as FormArray).at(e).value)
    let h=(this.assetsave.get('listproduct') as FormArray).at(e).value;
    h['control_office_branch']=this.branch_codes
    // h['id']=this.listcomments[e].id
    this.frmData.append('data',JSON.stringify(h))
    // console.log('ee=',data_val);
    // console.log('frmdata=',this.frmData)
  this.spinner.show();
  if(this.saveCheck==false){
  this.Faservice.getassetrowupdate(this.frmData).subscribe(result=>{
    console.log(result);
    this.toastr.success('success');
    setTimeout(() => {
      /** spinner ends after 3 seconds */
      this.spinner.hide();
    }, 3000);
   },(error)=>{
        this.spinner.hide();
        this.toastr.warning(error)
      });
  }
  else if(this.saveCheck==true){
  this.Faservice.getassetrowupdate1(this.frmData).subscribe(result=>{
    console.log(result);
    this.toastr.success('success');
    setTimeout(() => {
      /** spinner ends after 3 seconds */
      this.spinner.hide();
    }, 3000);
 },(error)=>{
        this.spinner.hide();
        this.toastr.warning(error)
      });
  }
  // this.assetsave.reset();
  ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('asset_tag').patchValue('');
  ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('make').patchValue('');
  ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('condition').patchValue('');
  ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('status').patchValue('');
  ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('serial_no').patchValue('');
  ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('images').patchValue('');
  ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('remarks').patchValue('');
  ((this.assetsave.get('listproduct') as FormArray).removeAt(e));
  
  this.readOnly = true;
  this.addrowRemove = true
  this.saveCheck=false;
  this.dummyboolean=true;
  if (this.listcomments[e].files>0) {
    this.listcomments[e].files = []
    this.listcomments[e].images = [];
    this.listcomments[e].image = []
    }
  }
  fapvfileget(event:any){
   
    this.pvfileData.delete('file');
    
    if(event.target.files.length>0){
      this.pvfileData.append('file',event.target.files[0])
    }
    else{
      this.toastr.warning('Please Select The Valid Files ..')
    }

  }
  fapvfileprepare(){
    (this.assetsave.get('listproduct') as FormArray).clear()
    let search:string="";
    console.log(this.assetgroupform.value)
    if(this.assetgroupform.get('branch').value!='' && this.assetgroupform.get('branch').value!=null && this.assetgroupform.get('branch').value.id!=undefined){
      console.log('hi')
      // this.searchdata.branch=this.assetgroupform.value.branch
      search=search+"&branch="+this.assetgroupform.get('branch').value.id;
    }    
    if(this.assetgroupform.get('Asset_id').value!='' && this.assetgroupform.get('Asset_id').value!=null){
      console.log('hii')
      // this.searchdata.barcode=this.assetgroupform.value.barcode
      search=search+"&barcode="+this.assetgroupform.get('Asset_id').value;
    }
    if(this.assetgroupform.get('asset_cat').value !=null && this.assetgroupform.get('asset_cat').value !="" ){
      search=search+"&asset_cat="+this.catId;
    }
    if(this.assetgroupform.get('product').value !=null && this.assetgroupform.get('product').value !="" ){
      search=search+"&product="+this.productId;
    }
    if(this.assetgroupform.get('invoicedate').value !=null && this.assetgroupform.get('invoicedate').value !="" ){
      let datevalue=this.assetgroupform.get('invoicedate').value;
      search=search+"&asset_cap="+this.datePipe.transform(datevalue,'yyyy-MM-dd');      
    } 
    if(this.assetgroupform.get('asset_cost').value !=null && this.assetgroupform.get('asset_cost').value !="" ){
      search=search+"&asset_cost="+this.assetgroupform.get('asset_cost').value;
    }
    if(this.assetgroupform.get('crno').value !=null && this.assetgroupform.get('crno').value !=""  && this.assetgroupform.get('crno').value !=undefined){
      search=search+"&crno="+this.assetgroupform.get('crno').value;
    }
    this.spinner.show();
    console.log(search);
    this.first=true;
    
    this.Faservice.fapvrecordsprepare(this.presentpagebuk, this.pageSize = 10,search).subscribe((data:any)=>{
      console.log(data);
      this.first=false;
      this.spinner.hide();
      if(data.code!=undefined && data.code!="" && data.code!=null){
        this.toastr.warning(data.code);
        this.toastr.warning(data.description);
      } 
      else{
        this.toastr.success(data.status);
        this.toastr.success(data.message);
      }
    },
    (error:HttpErrorResponse)=>{
      this.first=false;
      this.spinner.hide();
      this.toastr.error("Status="+error.status);
      this.toastr.error("Error Type="+error.statusText);
    }
    );
  }
  fapvfiledownload(){
    this.spinner.show();
    this.Faservice.fapvrecordsdownload().subscribe((response:any)=>{
      this.spinner.hide();
      if(response['type']=='application/json'){
              const reader = new FileReader();

        reader.onload = (event: any) => {
          const fileContent = event.target.result;
          // Handle the file content here
          console.log(fileContent);
          let DataNew:any=JSON.parse(fileContent);
          this.toastr.warning(DataNew.code);
          this.toastr.warning(DataNew.description);
        };

        reader.readAsText(response);
        //this.toastr.warning('No Records Found..')
      }
      else{
      let filename:any='document';
      let dataType = response.type;
      let binaryData = [];
      binaryData.push(response);
      let downloadLink:any = document.createElement('a');
      //console.log()
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
      
      downloadLink.setAttribute('download',filename);
      document.body.appendChild(downloadLink);
      let dte:any=new Date();
      let valied_dte=this.datePipe.transform(dte, 'yyyy-MM-dd');
      downloadLink.download = 'FA-PV Data '+ valied_dte +".xlsx";
      downloadLink.click();
      }
    },
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
      this.toastr.error("Status="+error.status);
      this.toastr.error("Error Type="+error.statusText);

    }
    )
   
  }
  fa_serial_number_update(dataf:any,i:any){
    let serial_no:any=((this.assetsave.get("listproduct") as FormArray).at(i) as FormGroup).get("serial_no").value;//get("serial_no")
    console.log(serial_no);
    let data:any=dataf.value;
    let product_id:any=((this.assetsave.get("listproduct") as FormArray).at(i) as FormGroup).get("product_id_data").value;
    if(serial_no==undefined || serial_no=="" || serial_no==null || serial_no=="0"){
      this.toastr.warning("Please Enter The Valid Serial No..");
      return false;

    }
    // return false;
    let datas:any={"assetheader_id":data.assetheader_id,"barcode":data.barcode,"serial_no":serial_no,"product_id":product_id,
    "oldserialmo":data.oldderial_no,"newserialno":serial_no,'serailid':data.serialno_id};

    this.spinner.show();
    this.Faservice.fa_serial_no_update(datas).subscribe((responce:any)=>{
      this.spinner.hide();
      if(responce.code!=undefined && responce.code!="" && responce!=null){
        this.toastr.warning(responce.code);
        this.toastr.warning(responce.description);
      }
      else{
        this.getdata();
        this.toastr.success(responce.status);
        this.toastr.success(responce.message);
      }
    },
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
      this.toastr.error("Status="+error.status);
      this.toastr.error("Error Type="+error.statusText);

    }
    )



  }
  fapvfileafterupload(fileinput:HTMLInputElement){
    console.log(this.pvfileData.has('file'))
    if(this.pvfileData.has('file')){
      this.spinner.show();
      this.Faservice.fapvrecordsupload(this.pvfileData).subscribe((responce:any)=>{
        this.spinner.hide();
        if(responce.code!=undefined && responce && responce!=null){
          this.toastr.warning(responce.code);
          this.toastr.warning(responce.description);
        }
        else{
          this.toastr.success(responce.status);
          this.toastr.success(responce.message);
          this.pvfileData.delete('file');
          fileinput.value=''

        }
      },
      (error:HttpErrorResponse)=>{
        this.spinner.hide();
        this.toastr.error("Status="+error.status);
        this.toastr.error("Error Type="+error.statusText);

      }
      )
    }
  }
    fapvfilepreparePV(){
    (this.assetsave.get('listproduct') as FormArray).clear()
    let search:string="";
    console.log(this.assetgroupform.value)
    if(this.assetgroupform.get('branch').value!='' && this.assetgroupform.get('branch').value!=null && this.assetgroupform.get('branch').value.id!=undefined){
      console.log('hi')
      // this.searchdata.branch=this.assetgroupform.value.branch
      search=search+"&branch="+this.assetgroupform.get('branch').value.id;
    }    
    if(this.assetgroupform.get('Asset_id').value!='' && this.assetgroupform.get('Asset_id').value!=null){
      console.log('hii')
      // this.searchdata.barcode=this.assetgroupform.value.barcode
      search=search+"&barcode="+this.assetgroupform.get('Asset_id').value;
    }
    if(this.assetgroupform.get('asset_cat').value !=null && this.assetgroupform.get('asset_cat').value !="" ){
      search=search+"&asset_cat="+this.catId;
    }
    // if(this.assetgroupform.get('product').value !=null && this.assetgroupform.get('product').value !="" ){
    //   search=search+"&product="+this.productId;
    // }
    if(this.prod_Control.value !=null && this.prod_Control.value !='' && this.prod_Control.value !=undefined){
       search=search +"&product="+this.productIdValue;
    }
    if(this.assetgroupform.get('invoicedate').value !=null && this.assetgroupform.get('invoicedate').value !="" ){
      let datevalue=this.assetgroupform.get('invoicedate').value;
      search=search+"&asset_cap="+this.datePipe.transform(datevalue,'yyyy-MM-dd');      
    } 
    if(this.assetgroupform.get('asset_cost').value !=null && this.assetgroupform.get('asset_cost').value !="" ){
      search=search+"&asset_cost="+this.assetgroupform.get('asset_cost').value;
    }
    if(this.assetgroupform.get('crno').value !=null && this.assetgroupform.get('crno').value !=""  && this.assetgroupform.get('crno').value !=undefined){
      search=search+"&crno="+this.assetgroupform.get('crno').value;
    }
    if(this.assetgroupform.get('itod').value !=null && this.assetgroupform.get('itod').value !=""  && this.assetgroupform.get('itod').value !=undefined){
      search=search+"&it_od="+this.assetgroupform.get('itod').value.cat_list;
    }
    this.spinner.show();
    console.log(search);
    this.first=true;
    
    this.Faservice.fapvrecordspreparePV(this.presentpagebuk, this.pageSize = 10,search).subscribe((data:any)=>{
      console.log(data);
      this.first=false;
      this.spinner.hide();
      if(data.code!=undefined && data.code!="" && data.code!=null){
        this.toastr.warning(data.code);
        this.toastr.warning(data.description);
      } 
      else{
        this.toastr.success(data.status);
        this.toastr.success(data.message);
        this.getFiles();
      }
    },
    (error:HttpErrorResponse)=>{
      this.first=false;
      this.spinner.hide();
      this.toastr.error("Status="+error.status);
      this.toastr.error("Error Type="+error.statusText);
    }
    );
  }
   fapvfileafteruploadPV(){
    console.log(this.pvfileData.has('file'))
    if(this.pvfileData.has('file')){
      this.spinner.show();
      this.Faservice.fapvrecordsupload(this.pvfileData).subscribe((responce:any)=>{
        this.spinner.hide();
        if(responce.code!=undefined && responce && responce!=null){
          this.toastr.warning(responce.code);
          this.toastr.warning(responce.description);
        }
        else{
          this.toastr.success(responce.status);
          this.toastr.success(responce.message);
        }
      },
      (error:HttpErrorResponse)=>{
        this.spinner.hide();
        this.toastr.error("Status="+error.status);
        this.toastr.error("Error Type="+error.statusText);

      }
      )
    }
  }
   searchPV(){
    if(this.search_mod==false){
      this.getdata1PV();
      this.save_btn = false;
      this.addRowDisable = false;
    }
    else if(this.search_mod==true){
      this.getdata_edit();
      this.save_btn = true;
      this.addRowDisable = true;
    }
    // this.assetgroupform.get('Asset_id').patchValue('');
    // this.assetgroupform.get('branch').patchValue('');
    // this.assetgroupform.get('Asset_edit').patchValue('');
  }
  getdata1PV(){
    (this.assetsave.get('listproduct') as FormArray).clear()
    let search:string="";
    console.log(this.assetgroupform.value)
    if(this.assetgroupform.get('branch').value!='' && this.assetgroupform.get('branch').value!=null  && this.assetgroupform.get('branch').value.id !=undefined){
      console.log('hi')
      // this.searchdata.branch=this.assetgroupform.value.branch
      search=search+"&branch="+this.assetgroupform.get('branch').value.id;
    }    
    if(this.assetgroupform.get('Asset_id').value!='' && this.assetgroupform.get('Asset_id').value!=null){
      console.log('hii')
      // this.searchdata.barcode=this.assetgroupform.value.barcode
      search=search+"&barcode="+this.assetgroupform.get('Asset_id').value;
    }
    if(this.assetgroupform.get('asset_cat').value !=null && this.assetgroupform.get('asset_cat').value !="" ){
      search=search+"&asset_cat="+this.catId;
    }
    // if(this.assetgroupform.get('product').value !=null && this.assetgroupform.get('product').value !="" ){
    //   search=search+"&product="+this.productId;
    // }
    if(this.assetgroupform.get('invoicedate').value !=null && this.assetgroupform.get('invoicedate').value !="" ){
      let datevalue=this.assetgroupform.get('invoicedate').value;
      search=search+"&asset_cap="+this.datePipe.transform(datevalue,'yyyy-MM-dd');      
    } 
    if(this.assetgroupform.get('asset_cost').value !=null && this.assetgroupform.get('asset_cost').value !="" ){
      search=search+"&asset_cost="+this.assetgroupform.get('asset_cost').value;
    }
    if(this.assetgroupform.get('crno').value !=null && this.assetgroupform.get('crno').value !=""  && this.assetgroupform.get('crno').value !=undefined){
      search=search+"&crno="+this.assetgroupform.get('crno').value;
    }
    if(this.assetgroupform.get('branch_admin').value !=null && this.assetgroupform.get('branch_admin').value !=""  && this.assetgroupform.get('branch_admin').value !=undefined){
      search=search+"&branch="+this.assetgroupform.get('branch_admin').value?.id;
    }
     if(this.assetgroupform.get('fapvsts').value !=null && this.assetgroupform.get('fapvsts').value !=""  && this.assetgroupform.get('fapvsts').value !=undefined){
      search=search+"&pv_status="+this.assetgroupform.get('fapvsts').value;
    }
    if(this.prod_Control.value !=null && this.prod_Control.value !='' && this.prod_Control.value !=undefined){
       search=search +"&product="+this.productIdValue;
    }
    if(this.assetgroupform.get('itod').value !=null && this.assetgroupform.get('itod').value !=""  && this.assetgroupform.get('itod').value !=undefined){
      search=search+"&it_od="+this.assetgroupform.get('itod').value.cat_list;
    }
    this.spinner.show();
    console.log(search)
    this.Faservice.getassetdata2PV(this.presentpagebuk, this.pageSize = 10,search).subscribe((data) => {
      if(data.description == 'Invalid Branch Id'){
        this.toastr.error('No Branch ID Assigned')
        this.addRowDisable = true;
      }
      else if(data.code == "Header ID Not Matched"){
        this.toastr.error('Header ID Not Matched')
        this.spinner.hide()
        this.pageLength_popup = 0
        this.addRowDisable = true;
      }
      else if(data['data'].length == 0){
        this.toastr.error('No Data')
        this.spinner.hide()
        this.pageLength_popup = 0
        this.addRowDisable = true;
      }
      else{
      this.listcomments = data['data'];
      this.addRowDisable = false;
        setTimeout(() => {
          /** spinner ends after 3 seconds */
          this.spinner.hide();
        }, 3000);
      console.log( data);
      for (let i=0; i<this.listcomments.length; i++){
        this.listcomments[i]['is_Checked']=false;    
        this.listcomments[i]['images'] = [];
        this.listcomments[i]['image'] = [];
        this.listcomments[i]['files'] = [];
        this.listcomments[i]['control_office_branch'] = this.listcomments[0].branch_id?.control_office_branch
        this.branch_names = this.listcomments[0].branch_id?.name
        this.branch_codes = this.listcomments[0].branch_id?.code
        this.branch_id_data = this.listcomments[0].branch_id?.id
        if(this.listcomments[0].branch_id?.control_office_branch == null){
          this.ctrl_branch_id = this.listcomments[0].branch_id?.code  
        }
        else{
          this.ctrl_branch_id = this.listcomments[0].branch_id?.control_office_branch
        }
      }
      this.datapagination = data['pagination'];
      this.pageLength_popup = data['count'];
      console.log('total ', this.pageLength_popup)
      console.log('d-',data['data']);
      console.log('page',this.datapagination)
      if (this.listcomments.length >= 0) {
        this.has_nextbuk = this.datapagination.has_next;
        this.has_previousbuk = this.datapagination.has_previous;
        this.presentpagebuk = this.datapagination.index;
      }
      console.log(this.listcomments.length);
      for(let i=0;i<this.listcomments.length;i++){
        console.log('hiii');
    (this.assetsave.get('listproduct') as FormArray).push(this.fb.group({


      'id':new FormControl(),
      'barcode':new FormControl(),
      'product_name':new FormControl(),
      'branch_code':new FormControl(),
      'branch_name':new FormControl(),
      'asset_cost':new FormControl(),
      'asset_value':new FormControl(),
      'asset_tag':new FormControl(),
      'make':new FormControl(),
      'condition':new FormControl(),
      'status':new FormControl(),
      'serial_no': new FormControl(),
      'crnum':new FormControl(),
      'kvb_asset_id':new FormControl(),
      'images': new FormControl(),
      'remarks' : new FormControl(),
      'model':new FormControl(''),
      'pvsts':new FormControl(''),
      'pvsts_date':new FormControl(''),
      'asset_tfr_id':new FormControl(),
      'product_spec':new FormControl(''),
      'asset_owner':new FormControl(),
      'asset_owner_desg':new FormControl(),
      'assetheader_id':new FormControl(),
      "product_id_data":new FormControl(""),
      "branch_id_data":new FormControl(),
      'newserialno':new FormControl(null),
       "oldserialno":new FormControl(null),
       "serialno_id":new FormControl(null),
       'oldderial_no':new FormControl(null),
       'serial_no_btn_enb':new FormControl(),
       'documents_data':new FormControl(),
    }));
    
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_tfr_id').disable();
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('id').patchValue(this.listcomments[i].id);

    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('barcode').patchValue(this.listcomments[i].barcode);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('crnum').patchValue(this.listcomments[i].crnum);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('product_name').patchValue(this.listcomments[i].product_id);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_code').patchValue(this.listcomments[i].branch_id?.code);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_name').patchValue(this.listcomments[i].branch_id?.name);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_cost').patchValue(this.listcomments[i].assetdetails_cost);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_value').patchValue(this.listcomments[i].assetdetails_value);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_tag').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('make').patchValue(this.listcomments[i].make);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('model').patchValue(this.listcomments[i].model);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('condition').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('status').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('product_spec').patchValue(this.listcomments[i]?.product_spec);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('pvsts').patchValue(this.listcomments[i]?.pv_approved_status);
    const formattedDate = this.datePipe.transform(this.listcomments[i]?.pv_checker_date, 'dd-MMM-yyyy');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('pvsts_date').patchValue(formattedDate);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_tfr_id').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_owner').patchValue(this.listcomments[i]?.asset_owner_data);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_owner_desg').patchValue(this.listcomments[i]?.asset_owner_data?.designation);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serial_no').patchValue(this.listcomments[i]?.serial_no);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('crnum').patchValue(this.listcomments[i]?.ecfnum);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('kvb_asset_id').patchValue(this.listcomments[i].description.slice(1,15));
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('images').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('remarks').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('assetheader_id').patchValue(this.listcomments[i]?.assetheader_id);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_id_data').patchValue(this.listcomments[i]?.branch_id?.id);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('product_id_data').patchValue(this.listcomments[i]?.product_id_data);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serial_no').patchValue(this.listcomments[i]?.serial_no);

     // 'newserialno':new FormControl(null),
      // "oldserialno":new FormControl(null),
      // "serialno_id":new FormControl(null)
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('newserialno').patchValue(this.listcomments[i]?.newserialno);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('oldserialno').patchValue(this.listcomments[i]?.oldserialno);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serialno_id').patchValue(this.listcomments[i]?.serialno_id);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serial_no_btn_enb').patchValue(this.listcomments[i]?.serial_no_btn_enb);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('documents_data').patchValue(this.listcomments[i]?.documents_data);
      }
      // let i:any=((this.assetsave.get('listproduct') as FormArray).length);
      // 'newserialno':new FormControl(null),
      // "oldserialno":new FormControl(null),
      // "serialno_id":new FormControl(null)
      // ((this.assetsave.get('listproduct') as FormArray).removeAt(i[11]-1));
      }},
      (error)=>{
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      }
      )
    }

      savePV(form: any,e:number) {
    let data_val=[]
      if(this.flag==false){
        let data_val=[];
        if (this.statusCheck==false){
        if(this.addrowCheck == false){
          this.toastr.error('Save The Added Row First')
        }
        if((this.assetsave.get('listproduct') as FormArray).at(e).get('status').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('status').value ==""){
          this.toastr.warning('Please Select Valid Status');
          return false;
        }
        else if((this.assetsave.get('listproduct') as FormArray).at(e).get('asset_tag').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('asset_tag').value ==""){
          this.toastr.warning('Please Select Valid Asset Tag');
          return false;
        }
        else if((this.assetsave.get('listproduct') as FormArray).at(e).get('make').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('make').value ==""){
          this.toastr.warning('Please Select Valid Make');
          return false;
        }
         else if((this.assetsave.get('listproduct') as FormArray).at(e).get('model').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('model').value ==""){
          this.toastr.warning('Please Select Valid Model');
          return false;
        }
        //  else if((this.assetsave.get('listproduct') as FormArray).at(e).get('product_spec').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('product_spec').value ==""){
        //   this.toastr.warning('Please Select Valid Specification');
        //   return false;
        // }
        // else if((this.assetsave.get('listproduct') as FormArray).at(e).get('asset_owner').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('asset_owner').value ==""){
        //   this.toastr.warning('Please Select Valid Asset Used By Employee');
        //   return false;
        // }
        else if((this.assetsave.get('listproduct') as FormArray).at(e).get('remarks').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('remarks').value ==""){
          this.toastr.warning('Please Select Valid Remarks');
          return false;
        }
        else if((this.assetsave.get('listproduct') as FormArray).at(e).get('serial_no').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('serial_no').value ==""){
          this.toastr.warning('Please Select Valid Serial No');
          return false;
        }
        // else if((this.assetsave.get('listproduct') as FormArray).at(e).get('crnum').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('crnum').value ==""){
        //   this.toastr.warning('Please Select Valid CR Number');
        //   return false;
        // }
        // else if((this.assetsave.get('listproduct') as FormArray).at(e).get('kvb_asset_id').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('kvb_asset_id').value ==""){
        //   this.toastr.warning('Please Select Valid KVB Asset ID');
        //   return false;
        // }
        else if((this.assetsave.get('listproduct') as FormArray).at(e).get('condition').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('condition').value ==""){
          this.toastr.warning('Please Select Valid Condition');
          return false;
        }
        // else if((this.assetsave.get('listproduct') as FormArray).at(e).get('images').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('images').value ==""){
        //   this.toastr.warning('Please Select Valid images');
        //   return false;
        // }
        console.log('h=',(this.assetsave.get('listproduct') as FormArray).at(e).value)
        let h=(this.assetsave.get('listproduct') as FormArray).at(e).value;
        h['control_office_branch']=this.branch_codes
        // h['asset_tfr_id'] =(this.assetsave.get('listproduct') as FormArray).at(e).get('asset_tfr_id').value.id,
        h['asset_owner']=(this.assetsave.get('listproduct') as FormArray).at(e).get('asset_owner').value.id
        console.log('index',e)
        // h['id']=this.listcomments[e].id
        // h['asset_details_id']=parseInt(this.listcomments[e].assetdetails_id)  
        // h['asset_details_id']=this.listcomments[e].ass
        // data_val.push(h);
        this.frmData.append('data',JSON.stringify(h))
        // console.log('ee=',data_val);
        // console.log('frmdata=',this.frmData)
      this.spinner.show();
      if(this.saveCheck==false){
      this.Faservice.getassetsavePV(this.frmData).subscribe(result=>{
        console.log(result);
        this.spinner.hide()
        if(result['status']){
           this.toastr.success(result.message)
        }
         else{
          this.toastr.error(result.description)
          return false
        }
        // this.toastr.success('success');
        // setTimeout(() => {
        //   /** spinner ends after 3 seconds */
        //   this.spinner.hide();
        // }, 3000);
       },(error)=>{
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      })
      }
      else if(this.saveCheck==true){
      this.Faservice.getassetsave1(this.frmData).subscribe(result=>{
        console.log(result);
        this.spinner.hide()
        // this.toastr.success('success');
        // setTimeout(() => {
        //   /** spinner ends after 3 seconds */
        //   this.spinner.hide();
        // }, 3000);
        if(result['status']){
           this.toastr.success(result.message)
        }
        else{
          this.toastr.error(result.description)
          return false
        }
      },(error)=>{
        this.spinner.hide();
        this.toastr.warning(error)
      })
      }
      // this.assetsave.reset();
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('asset_tag').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('make').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('condition').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('status').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('serial_no').patchValue('');
      // ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('crnum').patchValue('');
      // ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('kvb_asset_id').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('images').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('remarks').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('product_spec').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('pvsts').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('asset_owner').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('asset_owner_desg').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('pvsts_date').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('asset_tfr_id').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('asset_tfr_id').disable();
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('branch_id_data').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('product_id_data').patchValue('');


      ((this.assetsave.get('listproduct') as FormArray).removeAt(e));
      // let index = this.listcomments.findIndex(d => d.id === form.id); //find index in your array
      // this.listcomments.splice(index, 1);
      // this.pageLength_popup = this.listcomments.length
      // console.log(e)
      // console.log(this.as_assetcat)
      this.readOnly = true;
      this.addrowRemove = true
      this.saveCheck=false;
      this.dummyboolean=true;
      if (this.listcomments[e].files>0) {
        this.listcomments[e].files = []
        this.listcomments[e].images = [];
        this.listcomments[e].image = []
        }
      
    }
    if (this.statusCheck==true){
      if(this.addrowCheck == false){
        this.toastr.error('Save The Added Row First')
      }
      if((this.assetsave.get('listproduct') as FormArray).at(e).get('status').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('status').value ==""){
        this.toastr.warning('Please Select Valid Status');
        return false;
      }
      // else if((this.assetsave.get('listproduct') as FormArray).at(e).get('asset_owner').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('asset_owner').value ==""){
      //     this.toastr.warning('Please Select Valid Asset Used By Employee');
      //     return false;
      //   }
      else if((this.assetsave.get('listproduct') as FormArray).at(e).get('remarks').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('remarks').value ==""){
        this.toastr.warning('Please Select Valid Remarks');
        return false;
      }
      // else if((this.assetsave.get('listproduct') as FormArray).at(e).get('images').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('images').value ==""){
      //   this.toastr.warning('Please Select Valid images');
      //   return false;
      // }
      console.log('h=',(this.assetsave.get('listproduct') as FormArray).at(e).value)
      let h=(this.assetsave.get('listproduct') as FormArray).at(e).value;
      // data_val.push(h);
      h['control_office_branch']=this.branch_codes
      h['asset_tfr_id'] =(this.assetsave.get('listproduct') as FormArray).at(e).get('asset_tfr_id').value.id,
      h['asset_owner']=(this.assetsave.get('listproduct') as FormArray).at(e).get('asset_owner').value.id
      console.log('index',e)
      // h['id']=this.listcomments[e].id
      // h['asset_details_id']=parseInt(this.listcomments[e].assetdetails_id)
    this.frmData.append('data',JSON.stringify(h))
        // console.log('ee=',data_val);
        // console.log('frmdata=',this.frmData)
    this.spinner.show();
    if(this.saveCheck==false){
    this.Faservice.getassetsavePV(this.frmData).subscribe(result=>{
      console.log(result);
      this.spinner.hide()
      // this.toastr.success('success');
      // setTimeout(() => {
      //   /** spinner ends after 3 seconds */
      //   this.spinner.hide();
      // }, 3000);
      if(result['status'] == 'success'){
        this.toastr.success(result['message'])
      }else{
        this.toastr.error(result['description'])

      }
     },(error)=>{
        this.spinner.hide();
        this.toastr.warning(error)
      })
    }
    else if(this.saveCheck==true){
    this.Faservice.getassetsavePV(this.frmData).subscribe(result=>{
      console.log(result);
      this.spinner.hide();
      // this.toastr.success('success');
      // setTimeout(() => {
      //   /** spinner ends after 3 seconds */
      //   this.spinner.hide();
      // }, 3000);
       if(result['status'] == 'success'){
        this.toastr.success(result['message'])
      }else{
        this.toastr.success(result['description'])

      }
    });
    }
    // this.assetsave.reset();
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('asset_tag').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('make').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('condition').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('status').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('serial_no').patchValue('');
    // ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('crnum').patchValue('');
    // ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('kvb_asset_id').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('images').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('remarks').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).removeAt(e));
    // let index = this.listcomments.findIndex(d => d.id === form.id); //find index in your array
    // this.listcomments.splice(index, 1);
    // this.pageLength_popup = this.listcomments.length
    // console.log(e)
    // console.log(this.as_assetcat)
    this.readOnly = true;
    this.addrowRemove = true
    this.saveCheck=false;
    this.dummyboolean=true;
    if (this.listcomments[e].files>0) {
      this.listcomments[e].files = []
      this.listcomments[e].images = [];
      this.listcomments[e].image = []
      }
  }
}
     
    else if(this.flag==true){
    if((this.assetsave.get('listproduct') as FormArray).at(e).get('barcode').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('barcode').value ==""){
      this.toastr.warning('Please Select Valid Barcode');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('product_name').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('product_name').value ==""){
      this.toastr.warning('Please Select Valid Product Name');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('branch_code').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('branch_code').value ==""){
      this.toastr.warning('Please Select Valid Branch Code');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('branch_name').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('branch_name').value ==""){
      this.toastr.warning('Please Select Valid Branch Name');
      return false;
    }
    // else if((this.assetsave.get('listproduct') as FormArray).at(e).get('asset_cost').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('asset_cost').value ==""){
    //   this.toastr.warning('Please Select Valid Asset Cost');
    //   return false;
    // }
    // else if((this.assetsave.get('listproduct') as FormArray).at(e).get('asset_value').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('asset_value').value ==""){
    //   this.toastr.warning('Please Select Valid Asset Value');
    //   return false;
    // }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('status').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('status').value ==""){
      this.toastr.warning('Please Select Valid Status');
      return false;
    }
    // else if((this.assetsave.get('listproduct') as FormArray).at(e).get('asset_tag').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('asset_tag').value ==""){
    //   this.toastr.warning('Please Select Valid Asset Tag');
    //   return false;
    // }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('make').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('make').value ==""){
      this.toastr.warning('Please Select Valid Make');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('serial_no').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('serial_no').value ==""){
      this.toastr.warning('Please Select Valid Serial No');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('crnum').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('crnum').value ==""){
      this.toastr.warning('Please Select Valid CR Number');
      return false;
    }
    // else if((this.assetsave.get('listproduct') as FormArray).at(e).get('kvb_asset_id').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('kvb_asset_id').value ==""){
    //   this.toastr.warning('Please Select Valid KVB Asset ID');
    //   return false;
    // }
    // else if((this.assetsave.get('listproduct') as FormArray).at(e).get('condition').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('condition').value ==""){
    //   this.toastr.warning('Please Select Valid Condition');
    //   return false;
    // }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('remarks').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('remarks').value ==""){
      this.toastr.warning('Please Select Valid Remarks');
      return false;
    }
    // else if((this.assetsave.get('listproduct') as FormArray).at(e).get('images').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('images').value ==""){
    //   this.toastr.warning('Please Select Valid images');
    //   return false;
    // }
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('id').patchValue('');
    console.log('h=',(this.assetsave.get('listproduct') as FormArray).at(e).value)
    let h=(this.assetsave.get('listproduct') as FormArray).at(e).value;
    // data_val.push(h);
    h['control_office_branch']=this.ctrl_branch_id,
    h['asset_tfr_id'] =(this.assetsave.get('listproduct') as FormArray).at(e).get('asset_tfr_id')?.value?.id,
    h['asset_owner']=(this.assetsave.get('listproduct') as FormArray).at(e).get('asset_owner')?.value?.id,
    h['product_id_data']= this.productId
    this.frmData.append('data',JSON.stringify(h))
        // console.log('ee=',data_val);
        // console.log('frmdata=',this.frmData)
    
    if(this.saveCheck==false){
    this.spinner.show()
    this.Faservice.getassetrowsavePV(this.frmData).subscribe(result=>{
    this.spinner.hide();
     if(result['status'] == 'success'){
        this.toastr.success(result['message'])
      }else{
        this.toastr.error(result['description'])
        return false

      }
      // console.log(result);
      // if(result.description == 'INVALID_ASSETID_ID'){
      //   this.toastr.error('Barcode Already in Data')
      // }
      // else{
      //   this.toastr.success('Success');
      // }
      // this.spinner.show();
      // setTimeout(() => {
      // /** spinner ends after 3 seconds */
      // this.spinner.hide();
      // }, 3000);
    })
    }
    else if(this.saveCheck==true){
      this.spinner.show()
      this.Faservice.getassetrowsave1PV(this.frmData).subscribe(result=>{
        this.spinner.hide()
        console.log(result);
        if(result['status'] == 'success'){
        this.toastr.success(result['message'])
      }else{
        this.toastr.error(result['description'])
        return false

      }
        // if(result.description == 'INVALID_ASSETID_ID'){
        //   this.toastr.error('Barcode Already in Data')
        // }
        // else{
        //   this.toastr.success('Success');
        // }
        // this.spinner.show();
        // setTimeout(() => {
        // /** spinner ends after 3 seconds */
        // this.spinner.hide();
        // }, 3000);
       },(error)=>{
        this.spinner.hide();
        this.toastr.warning(error)
      })
    }
    // this.assetsave.reset();
    ((this.assetsave.get('listproduct') as FormArray).removeAt(e));
    
    // this.listcomments = this.listcomments.show();
    // let index = this.listcomments.findIndex(d => d.id === form.id); //find index in your array
    // this.listcomments.splice(index, 1);
    // this.pageLength_popup = this.listcomments.length
    // console.log(e)
    // console.log(this.as_assetcat)
    this.flag = false;
    this.readOnly = true;
    this.addrowRemove = true;
    this.addrowCheck = true;
    this.id = ''
    this.saveCheck=false;
    this.dummyboolean=true;
    this.addRowOnce = false;
    if (this.listcomments[e].files>0) {
      this.listcomments[e].files = []
      this.listcomments[e].images = [];
      this.listcomments[e].image = []
      }
    let i:any=((this.assetsave.get('listproduct') as FormArray).length);
  ((this.assetsave.get('listproduct') as FormArray).removeAt(i-1));
  }
    // let max:number = 5;
    // form['asset_master_code_id']=Math.floor(Math.random() * (max + 1));
//     if(this.flag==false){
//       let data_val=[];
//       form['asset_tag']=this.assetsave.get('asset_tag').value;
//       form['make']=this.assetsave.get('make').value;
//       form['condition']=this.assetsave.get('condition').value;
//       form['status']=this.assetsave.get('status').value;    
//       form['serial_no']=this.assetsave.get('serial_no').value;
//       form['remarks']=this.assetsave.get('remarks').value;
//       data_val.push(form);
//       // this.frmData.append('data_val',JSON.stringify(this.listcomments))
//       // console.log(form);
//       console.log('ee=',data_val);
//       // console.log('frmdata=',this.frmData)
//       this.toastr.success('success');
//       this.spinner.show();
//       setTimeout(() => {
//         /** spinner ends after 3 seconds */
//         this.spinner.hide();
//       }, 3000);
//       this.Faservice.getassetsave(data_val).subscribe(result=>{
//         console.log(result);
//       })
//       this.assetsave.reset();
//       // this.listcomments = this.listcomments.show();
//       let index = this.listcomments.findIndex(d => d.id === form.id); //find index in your array
//       this.listcomments.splice(index, 1);
//       this.pageLength_popup = this.listcomments.length
//       console.log(e)
//       console.log(this.as_assetcat)
//   }
//   else if(this.flag==true){
//     let data_val=[]
//     form['barcode']=this.assetsave.get('barcode').value;
//     form['product_name']=this.assetsave.get('product_name').value;
//     form['branch_code']=this.assetsave.get('branch_code').value;
//     form['branch_name']=this.assetsave.get('branch_name').value;    
//     form['asset_cost']=this.assetsave.get('asset_cost').value;
//     form['asset_value']=this.assetsave.get('asset_value').value;
//     form['asset_tag']=this.assetsave.get('asset_tag').value;
//     form['make']=this.assetsave.get('make').value;
//     form['condition']=this.assetsave.get('condition').value;
//     form['status']=this.assetsave.get('status').value;    
//     form['serial_no']=this.assetsave.get('serial_no').value;
//     form['remarks']=this.assetsave.get('remarks').value;
//     data_val.push(form);
//     this.frmData.append('data_val',JSON.stringify(this.listcomments))
//     console.log(form);
//     console.log('ee=',data_val);
//     console.log('frmdata=',this.frmData)
//     this.toastr.success('success');
//     this.spinner.show();
//     setTimeout(() => {
//       /** spinner ends after 3 seconds */
//       this.spinner.hide();
//     }, 3000);
//     this.Faservice.getassetrowsave(this.frmData).subscribe(result=>{
//       console.log(result);
//     })
//     this.assetsave.reset();
//     // this.listcomments = this.listcomments.show();
//     let index = this.listcomments.findIndex(d => d.id === form.id); //find index in your array
//     this.listcomments.splice(index, 1);
//     this.pageLength_popup = this.listcomments.length
//     console.log(e)
//     console.log(this.as_assetcat)
//   }
//   this.flag = false;
}
getFiles(){
  this.Faservice.GetfapvrecordspreparePV().subscribe((response) => {
    this.filedetails = response?.filename;
  });
}

resfresh(){
  this.getFiles();
}
goHome(){

}
resetdata(fileinput:HTMLInputElement) {
  (this.assetsave.get('listproduct') as FormArray).clear();
  this.assetgroupform.reset({
    branch: null,
    Asset_id: '',
    asset_cat: '',
    product: '',
    invoicedate: null,
    asset_cost: '',
    fapvsts:'',
    itod:'',
  });
  this.productIdValue=[]
  this.chipSelectedproduct=[]
  this.prod_Control.reset('')
  this.pvfileData.delete('file');
  fileinput.value=''
  // this.fapvfileget(event,'delete')


  let search: string = "";

  console.log("Form after reset:", this.assetgroupform.value);
  console.log("prodcontrol",this.prod_Control,this.productIdValue)

  if (this.assetgroupform.get('branch')?.value?.id) {
    search += "&branch=" + this.assetgroupform.get('branch')?.value.id;
  }

  if (this.assetgroupform.get('Asset_id')?.value) {
    search += "&barcode=" + this.assetgroupform.get('Asset_id')?.value;
  }

  if (this.assetgroupform.get('asset_cat')?.value) {
    search += "&asset_cat=" + this.catId;
  }

  if (this.assetgroupform.get('product')?.value) {
    search += "&product=" + this.productId;
  }

  if (this.assetgroupform.get('invoicedate')?.value) {
    let datevalue = this.assetgroupform.get('invoicedate')?.value;
    search += "&asset_cap=" + this.datePipe.transform(datevalue, 'yyyy-MM-dd');
  }

  if (this.assetgroupform.get('asset_cost')?.value) {
    search += "&asset_cost=" + this.assetgroupform.get('asset_cost')?.value;
  }
   if (this.assetgroupform.get('fapvsts')?.value) {
    search += "&pv_status=" + this.assetgroupform.get('fapvsts')?.value;
  }

  console.log("Search params after reset:", search);


  this.spinner.show();
  this.Faservice.getassetdata2PV(this.presentpagebuk, this.pageSize = 10, search).subscribe(
    (data) => {
      if (data.description === 'Invalid Branch Id') {
        this.toastr.error('No Branch ID Assigned');
        this.addRowDisable = true;
      } else if (data.code === "Header ID Not Matched") {
        this.toastr.error('Header ID Not Matched');
        this.spinner.hide();
        this.pageLength_popup = 0;
        this.addRowDisable = true;
      } else if (data['data'].length === 0) {
        this.toastr.error('No Data');
        this.spinner.hide();
        this.pageLength_popup = 0;
        this.addRowDisable = true;
      } else {
        // ✅ Handle API data
        this.listcomments = data['data'];
        this.addRowDisable = false;

        setTimeout(() => {
          this.spinner.hide();
        }, 3000);

        this.listcomments.forEach((item, i) => {
          item['is_Checked'] = false;
          item['images'] = [];
          item['image'] = [];
          item['files'] = [];
          item['control_office_branch'] = this.listcomments[0].branch_id?.control_office_branch;
          this.branch_names = this.listcomments[0].branch_id?.name;
          this.branch_codes = this.listcomments[0].branch_id?.code;
          this.branch_id_data = this.listcomments[0].branch_id?.id
          this.ctrl_branch_id = this.listcomments[0].branch_id?.control_office_branch ?? this.listcomments[0].branch_id?.code;

          (this.assetsave.get('listproduct') as FormArray).push(this.fb.group({
            id: new FormControl(item.id),
            barcode: new FormControl(item.barcode),
            product_name: new FormControl(item.product_id),
            branch_code: new FormControl(item.branch_id?.code),
            branch_name: new FormControl(item.branch_id?.name),
            asset_cost: new FormControl(item.assetdetails_cost),
            asset_value: new FormControl(item.assetdetails_value),
            asset_tag: new FormControl(''),
            make: new FormControl(item.make),
            model: new FormControl(item.model),
            product_spec:new FormControl(item.product_spec),
            pvsts:new FormControl(item.pv_approved_status),
            pvsts_date:new FormControl(item.pv_checker_date),
            asset_owner:new FormControl(item.asset_owner_data?.name),
            asset_owner_desg:new FormControl(''),
            condition: new FormControl(''),
            status: new FormControl(''),
            serial_no: new FormControl(item.serial_no),
            crnum: new FormControl(item.ecfnum),
            kvb_asset_id: new FormControl(item.description.slice(1, 15)),
            images: new FormControl(''),
            remarks: new FormControl(''),
            assetheader_id: new FormControl(item.assetheader_id),
            product_id_data: new FormControl(item.product_id_data),
            branch_id_data:new FormControl(item.branch_id?.id),
            oldderial_no: new FormControl(item.serial_no),
            serial_no_btn_enb: new FormControl(item.serial_no_btn_enb),
            newserialno: new FormControl(item.newserialno ?? null),
            oldserialno: new FormControl(item.oldserialno ?? null),
            serialno_id: new FormControl(item.serialno_id ?? null),
          }));
        });

        this.datapagination = data['pagination'];
        this.pageLength_popup = data['count'];
        this.has_nextbuk = this.datapagination.has_next;
        this.has_previousbuk = this.datapagination.has_previous;
        this.presentpagebuk = this.datapagination.index;
      }
    },
    (error) => {
      this.spinner.hide();
      this.toastr.warning(error.status + error.statusText);
    }
  );
}


getbranchcode(){
//  this.spinner.show();
    this.Faservice
      .get_is_branch(this.branchInput.nativeElement.value, 1)
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((results) => {
        // this.spinner.hide();
        let datas = results["data"];
        this.branch_code_list = datas;
        console.log("getbranchcode", this.branch_code_list)
      });
}
autocompletebranchcodeScroll(){
    this.is_branch_has_next = true;
    this.is_branch_has_previous = true;
    this.is_branch_currentpage = 1;
    setTimeout(() => {
      if (this.is_branch && this.autocompleteTrigger && this.is_branch.panel) {
        fromEvent(this.is_branch.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.is_branch.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.is_branch.panel.nativeElement.scrollTop;
            const scrollHeight = this.is_branch.panel.nativeElement.scrollHeight;
            const elementHeight = this.is_branch.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.is_branch_has_next === true) {
                this.Faservice
                  .get_is_branch(
                    this.branchInput.nativeElement.value,
                    this.is_branch_currentpage + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branch_code_list = this.branch_code_list.concat(datas);
                    if (this.branch_code_list.length >= 0) {
                      this.is_branch_has_next = datapagination.has_next;
                      this.is_branch_has_previous = datapagination.has_previous;
                      this.is_branch_currentpage = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }

  documents(data){
  this.document_list=data
  }
downloadfiledocument(data) {
  let vals = data?.id;
  let fileType = data?.gen_file_name;
  this.Faservice.pv_file_download(vals).subscribe(results => {
    let binaryData = [];
    binaryData.push(results);
    let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));

    let link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileType; 
    link.click();
  }, (error) => {
    this.spinner.hide();
    this.toastr.warning(error.status + " " + error.statusText);
  });
}
pvreport_prepare(){
  console.log('prodis',this.productIdValue)
   let search:string="";
    console.log(this.assetgroupform.value)  
    if(this.assetgroupform.get('Asset_id').value!='' && this.assetgroupform.get('Asset_id').value!=null){
      search=search+"&barcode="+this.assetgroupform.get('Asset_id').value;
    }
    // if(this.assetgroupform.get('asset_cat').value !=null && this.assetgroupform.get('asset_cat').value !="" ){
    //   search=search+"&asset_cat="+this.catId;
    // }
    // if(this.assetgroupform.get('product').value !=null && this.assetgroupform.get('product').value !="" ){
    //   search=search+"&product="+this.productId;
    // }
    // if(this.assetgroupform.get('invoicedate').value !=null && this.assetgroupform.get('invoicedate').value !="" ){
    //   let datevalue=this.assetgroupform.get('invoicedate').value;
    //   search=search+"&asset_cap="+this.datePipe.transform(datevalue,'yyyy-MM-dd');      
    // } 
    if(this.assetgroupform.get('asset_cost').value !=null && this.assetgroupform.get('asset_cost').value !="" ){
      search=search+"&asset_cost="+this.assetgroupform.get('asset_cost').value;
    }
    if(this.assetgroupform.get('crno').value !=null && this.assetgroupform.get('crno').value !=""  && this.assetgroupform.get('crno').value !=undefined){
      search=search+"&crno="+this.assetgroupform.get('crno').value;
    }
    if(this.assetgroupform.get('branch_admin').value !=null && this.assetgroupform.get('branch_admin').value !=""  && this.assetgroupform.get('branch_admin').value !=undefined){
      search=search+"&branch="+this.assetgroupform.get('branch_admin').value?.id;
    }
     if(this.assetgroupform.get('fapvsts').value !=null && this.assetgroupform.get('fapvsts').value !=""  && this.assetgroupform.get('fapvsts').value !=undefined){
      search=search+"&pv_status="+this.assetgroupform.get('fapvsts').value;
    } 
    if(this.prod_Control.value !=null && this.prod_Control.value !='' && this.prod_Control.value !=undefined){
       search=search +"&product="+this.productIdValue;
    }
    if(this.assetgroupform.get('itod').value !=null && this.assetgroupform.get('itod').value !=""  && this.assetgroupform.get('itod').value !=undefined){
      search=search+"&it_od="+this.assetgroupform.get('itod').value.cat_list;
    }

    // let data:any={
    //   'barcode':this.assetgroupform.get('Asset_id').value,
    //   'product':this.productId,
    //   'asset_cost':this.assetgroupform.get('asset_cost').value,
    //   'crno':this.assetgroupform.get('crno').value,
    //   'branch':this.assetgroupform.get('branch_admin').value?.id,
    //   'pv_status':this.assetgroupform.get('fapvsts').value
    // }
    this.spinner.show();
    this.Faservice.fapvreport_prepare(search).subscribe(res=>{
      this.spinner.hide();
      if(res['status']== 'success'){
        this.toastr.success(res['message'])
      }else{
         this.toastr.warning(res['description']);
      }
      
    },(error)=>{
      this.spinner.hide();
      this.toastr.error(error.status+error.statusText)
    });
}
 Fapv_exceldownload() {
    this.spinner.show()
    this.Faservice.excelfapv().subscribe((res: any) => {
        if (res?.code) {
          this.toastr.warning(res['code']);
          this.toastr.warning(res['description']);
        } else {
        
            this.toastr.success("Successfully Downloaded");

            const url = window.URL.createObjectURL(res);
            const a = document.createElement('a');
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
            a.href = url;
            a.download = `Fapv_Excel_Download_${formattedDate}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            this.spinner.hide();
        }
      },
      (error) => {
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      });
  }
  Fapv_pdfdownload() {
    this.spinner.show()
    this.Faservice.fapvpdf().subscribe((res: any) => {
      this.spinner.hide()
        if (res?.code) {
          this.toastr.warning(res['code']);
          this.toastr.warning(res['description']);
        } else {
        
            this.toastr.success("Successfully Downloaded");

            const url = window.URL.createObjectURL(res);
            const a = document.createElement('a');
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
            a.href = url;
            a.download = `Fapv_pdf_Download_${formattedDate}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            this.spinner.hide();
        }
      },
      (error) => {
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      });
  }

@ViewChildren("branchstsInput") branchstsInput: any;
@ViewChild("is_branchsts") is_branchsts: MatAutocomplete;
  branchlist_sts: any;
  branch_sts_prev: boolean;
  branch_sts_next: boolean;
  branch_sts_page: number;
  get_transferbranch(index){
     const currentInput = this.branchstsInput.toArray()[index].nativeElement;
     const query = currentInput.value;
    this.Faservice.asset_transferbranch( query,1)
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((results) => {
        let datas = results["data"];
        this.branchlist_sts = datas;
        console.log(this.branchlist_sts);

      });
}
autocompletebranchtransfer_Scroll(){
    this.branch_sts_next = true;
    this.branch_sts_prev = true;
    this.branch_sts_page = 1;
    setTimeout(() => {
      if (this.is_branchsts && this.autocompleteTrigger && this.is_branchsts.panel) {
        fromEvent(this.is_branchsts.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.is_branchsts.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.is_branchsts.panel.nativeElement.scrollTop;
            const scrollHeight = this.is_branchsts.panel.nativeElement.scrollHeight;
            const elementHeight = this.is_branchsts.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.branch_sts_next === true) {
                this.Faservice
                  .asset_transferbranch(
                    this.branchstsInput.nativeElement.value,
                    this.branch_sts_page + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchlist_sts = this.branchlist_sts.concat(datas);
                    if (this.branchlist_sts.length >= 0) {
                      this.branch_sts_next = datapagination.has_next;
                      this.branch_sts_prev = datapagination.has_previous;
                      this.branch_sts_page = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }
@ViewChildren("assetownerInput") assetownerInput: any;
@ViewChildren("autoassetowner") autoassetowner: MatAutocomplete;
  assetowner_lists: any;
  assetowner_prev: boolean;
  assetowner_next: boolean;
  assetowner_page: number;
   

  get_assetowner_employee(index:any){
     const currentInput = this.assetownerInput.toArray()[index].nativeElement;
     const query = currentInput.value;
    this.Faservice.assetowner_employee(query, 1)
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((results) => {
        let datas = results["data"];
        this.assetowner_lists = datas;
        console.log(this.assetowner_lists);

      });
  }
autocompleteScroll_assetowner(index){
    this.assetowner_next = true;
    this.assetowner_prev = true;
    this.assetowner_page = 1;
    setTimeout(() => {
      if (this.autoassetowner && this.autocompleteTrigger && this.autoassetowner.panel) {
        fromEvent(this.autoassetowner.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.autoassetowner.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.autoassetowner.panel.nativeElement.scrollTop;
            const scrollHeight = this.autoassetowner.panel.nativeElement.scrollHeight;
            const elementHeight = this.autoassetowner.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.assetowner_next === true) {
                this.Faservice
                  .assetowner_employee(
                    this.assetownerInput.toArray()[index].nativeElement.value,
                    this.assetowner_page + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.assetowner_lists = this.assetowner_lists.concat(datas);
                    if (this.assetowner_lists.length >= 0) {
                      this.assetowner_next = datapagination.has_next;
                      this.assetowner_prev = datapagination.has_previous;
                      this.assetowner_page = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }
  getassetownerdesg(value,index){
  console.log(value)
  console.log(index)
  const formArray = this.assetsave.get('listproduct') as FormArray;
  const fb = formArray.at(index) as FormGroup;
  fb.get('asset_owner_desg').patchValue(value.designation);
  }

  productchip(){
    let key:any='';
    this.Faservice.get_productList(key).subscribe(results=>{
      let datas=results['data'];
      const allItem={code:'0000',id:0,name:"All",status:1}
      this.allproductList =[allItem,...datas]

    })


  }
  @ViewChild('productInput') productInput: any;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
   public allproductList: isproductList[];
    public chipSelectedproduct: isproductList[] = [];
    public chipSelectedproductid = [];
    public chipRemovedproductid = [];
    public prod_Control = new FormControl();
    productIdValue: Array<any>=[];
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  


      public removeproduct(prod: isproductList): void {
        const index = this.chipSelectedproduct.indexOf(prod);
    
        // this.chipSelectedproductid.push(prod.id)
        // console.log('this.chipRemovedEmployeeid', this.chipRemovedEmployeeid);
        // console.log(employee.id)
    
        this.chipSelectedproduct.splice(index, 1);
        // console.log(this.chipSelectedEmployee);
        this.chipSelectedproductid.splice(index, 1);
        // console.log(this.chipSelectedEmployeeid);
        return;
      }
  

   public productSelected(event: MatAutocompleteSelectedEvent): void {
    // console.log('employeeSelected', event.option.value.full_name);
    this.Selectedbyname(event.option.value.name);
    this.productInput.nativeElement.value = '';
  }
  private Selectedbyname(productName) {
    let foundEmployee1 = this.chipSelectedproduct.filter(product => product.name == productName);
    if (foundEmployee1.length) {
      // console.log('found in chips');
      return;
    }
    let foundEmployee = this.allproductList.filter(product => product.name == productName);
    if (foundEmployee.length) {
      // We found the employeecc name in the allEmployeeList list
      // console.log('founde', foundEmployee[0].id);
      this.chipSelectedproduct.push(foundEmployee[0]);
      this.chipSelectedproductid.push(foundEmployee[0].id)
      // console.log(this.chipSelectedEmployeeid);
      this.productIdValue = this.chipSelectedproductid;

    }
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
    this.Faservice.itod_dropdown('',1).subscribe(res=>{
      let datas=res['data']
      this.itod_list=datas;
    })
  } 

  // autocomplete_itod(){
  //   this.itod_next = true;
  //   this.itod_prev = true;
  //   this.itod_page = 1;
  //   setTimeout(() => {
  //     if (this.itodauto && this.autocompleteTrigger && this.itodauto.panel) {
  //       fromEvent(this.itodauto.panel.nativeElement, "scroll")
  //         .pipe(
  //           map(() => this.itodauto.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(() => {
  //           const scrollTop = this.itodauto.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.itodauto.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.itodauto.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.itod_next === true) {
  //               this.Faservice
  //                 .itod_dropdown(
  //                   this.itodinput.nativeElement.value,
  //                   this.itod_page + 1
  //                 )
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.itod_list = this.itod_list.concat(datas);
  //                   if (this.itod_list.length >= 0) {
  //                     this.itod_next = datapagination.has_next;
  //                     this.itod_prev = datapagination.has_previous;
  //                     this.itod_page = datapagination.index;
  //                   }
  //                 });
  //             }
  //           }
  //         });
  //     }
  //   });
  // }

  }