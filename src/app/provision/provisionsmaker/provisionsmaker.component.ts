
import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {ErrorHandlingprovisionService} from'../error-handlingprovision.service'
import { ProvisionService } from '../provision.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { ProisionshareserviceService} from '../proisionshareservice.service'
import { NotificationService } from '../notification.service';                                                                          
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, tap } from 'rxjs/operators';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

import { DatePipe, formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
export interface BS {
  name: string;
  id: string;
  
}
export interface CC {
  name: string;
  id: string;
  
}
export interface maincat {
  name: string;
  id: string;
  
}
export interface subcat {
  name: string;
  id: string;
  
}
export interface vendor{
  name:string;
  id:string
}

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};
@Injectable()
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
@Component({
  selector: 'app-provisionsmaker',
  templateUrl: './provisionsmaker.component.html',
  styleUrls: ['./provisionsmaker.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
}) 


export class ProvisionsmakerComponent implements OnInit {
  
  
  provisionadd:FormGroup;
  bsdata:any;
  isLoading = false;
  myControl = new FormControl();
  bsid: any;
  ccdata: any;
  maicatdata: any;
  catid: any;
  maincatdata: any;
  subcatdata: any;
  branchdata:any;
  vendordata: any;
tomorrow=new Date();
  constructor( private fb: FormBuilder,
    private router: Router,private toastr: ToastrService, private Service: ProvisionService,private datePipe: DatePipe, public share:ProisionshareserviceService,
    private notification: NotificationService,private SpinnerService: NgxSpinnerService,private errorHandler:ErrorHandlingprovisionService)
     {this.tomorrow.setDate(this.tomorrow.getDate() ); }

  ngOnInit(): void {
    this.provisionadd= this.fb.group({
      cr_number: [''],
      category_id: [''],
      subcategory_id: [''],
      gl_id:[''],
      branch_id: [''],
      narration:[''],
      vendor_id: [1],
      expense_date: [],
      amount: [''],
      gst_amount:[''],
      cc_id: [''],
      bs_id: [''], 
      invoice_date:[''],
      invoice_no:[''] 
    })
    let data: any = this.share.provisiondata.value;
    if (data!=''){
      this.provisionadd.addControl('id', new FormControl(''));
    this.provisionadd.patchValue({
    cr_number:data.cr_number,
    category_id:data.category_id,
    subcategory_id:data.subcategory_id,
    gl_id:data.gl_id,
    branch_id:data.branch_id,
    narration:data.narration,
    vendor_id:data.vendor_id,
    expense_date: data.expense_date,
    amount:data.amount,
    gst_amount:data.gst_amount,
    cc_id: data.cc_id,
    bs_id: data.bs_id,
    id:data.id ,
    invoice_date:data.invoice_date,
    invoice_no:data.invoice_no




    })
  }

    this.fetchbranchinfo();
    
  }
  fetchbranchinfo(){
    this.Service.branchdata().then((results: any[]) => {
      this.branchdata=results;
      this.provisionadd.get('branch_id').setValue(this.branchdata.name);
      
     
    })
  }
  public createprovision() {
    this.SpinnerService.show();
     
    // if (this.provisionadd.value.cr_number === "") {
    //   this.toastr.error('Please Enter CR Number ');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    if (this.provisionadd.value.category_id.id === undefined || this.provisionadd.value.category_id === "") {
      
      this.toastr.error('Please Choose Main Cat ');
      this.SpinnerService.hide();
      return false;
    }
    if (this.provisionadd.value.subcategory_id.id === undefined || this.provisionadd.value.subcategory_id === "") {
      
      this.toastr.error('Please Choose Sub Cat ');
      this.SpinnerService.hide();
      return false;
    }
    if (this.provisionadd.value.bs_id.id === undefined || this.provisionadd.value.bs_id === "") {
      
      this.toastr.error('Please Choose BS ');
      this.SpinnerService.hide();
      return false;
    }
    if (this.provisionadd.value.cc_id.id === undefined || this.provisionadd.value.cc_id === "") {
      
      this.toastr.error('Please Choose CC ');
      this.SpinnerService.hide();
      return false;
    }
    if (this.provisionadd.value.vendor_id.id === undefined || this.provisionadd.value.vendor_id === "") {
      
      this.toastr.error('Please Choose Vendor ');
      this.SpinnerService.hide();
      return false;
    }
    
    if (this.provisionadd.value.narration === "") {
      this.toastr.error('Please Enter Description ');
      this.SpinnerService.hide();
      return false;
    }
    if (this.provisionadd.value.gst_amount === "") {
      this.toastr.error('Please Enter gst_amount ');
      this.SpinnerService.hide();
      return false;
    }
    if (this.provisionadd.value.gst_amount === "") {
      this.toastr.error('Please Enter amount ');
      this.SpinnerService.hide();
      return false;
    }
    
    this.provisionadd.value.expense_date=this.datePipe.transform(this.provisionadd.value.expense_date, 'yyyy-MM-dd')
    this.provisionadd.value.cc_id= this.provisionadd.value.cc_id.id
    this.provisionadd.value.bs_id= this.provisionadd.value.bs_id.id
    this.provisionadd.value.subcategory_id= this.provisionadd.value.subcategory_id.id
    this.provisionadd.value.category_id= this.provisionadd.value.category_id.id
    this.provisionadd.value.vendor_id= this.provisionadd.value.vendor_id.id
    this.provisionadd.value.branch_id= this.branchdata.id


    this.Service.provision(this.provisionadd.value)
      .subscribe(result => {
        if(result.id){
        console.log("RESULSSS", result)
        this.notification.showSuccess("Saved Successfully!...")
        this.SpinnerService.hide();
        this.provisionadd.reset();
        this.router.navigate(['/provision'], { skipLocationChange: true })

      
      }else{
        if(result['description']){
          this.notification.showWarning(result['description'])}
          else{
            this.notification.showWarning('Unauthorized Request')}
            this.SpinnerService.hide();
  
      }
      

      
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  // cat start
  catget(){
    let bs: String = "";
    this.catdata(bs);

    this.provisionadd.get('category_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.Service.getcategorydd(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
  
      .subscribe((results: any[]) => {
        this.maincatdata = results["data"];
       
      })
  }

  catdata(val){
    this.Service.getcategorydd(val).subscribe((results: any[]) => {
      this.maincatdata = results["data"];
     
    })

  }
  public displayFncat(_maincat?: maincat): string | undefined {
    return _maincat ? _maincat.name : undefined;
  }

  get _maincat() {
    return this.provisionadd.value.get('category_id');
  }

  catid_get(id){
    this.catid=id;
    this.provisionadd.get('subcategory_id').setValue('');
    this.provisionadd.get('gl_id').setValue('');
  }
  // cat end
// bs

   bsget() {
    let bs: String = "";
    this.bsdatafun(bs);

    this.provisionadd.get('bs_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.Service.getbsvalue(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
  
      .subscribe((results: any[]) => {
        this.bsdata = results["data"];
       
      })
  }

  bsdatafun(val){
    this.Service.getbsvalue(val).subscribe((results: any[]) => {
      this.bsdata = results["data"];
     
    })

  }
  public displayFnbs(_bsval?: BS): string | undefined {
    return _bsval ? _bsval.name : undefined;
  }

  get _bsval() {
    return this.provisionadd.value.get('bs_id');
  }

  bsid_cc(id){
    this.bsid=id;
    this.provisionadd.get('cc_id').setValue('');
  }
  // bsend
  // cc
  ccget(){
    let cc: String = "";
    this.ccdatafun( this.bsid,cc);

    this.provisionadd.get('cc_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        

      }),
      switchMap(value => this.Service.getcclistDependentBs( this.bsid,value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
  
      .subscribe((results: any[]) => {
        this.ccdata = results["data"];
       
      })
  }
  ccdatafun(id,val){
    this.Service.getcclistDependentBs(id,val).subscribe((results: any[]) => {
      this.ccdata = results["data"];
     
    })

  }
  public displayFncc(_ccval?: CC): string | undefined {
    return _ccval ? _ccval.name : undefined;
  }

  get _ccval() {
    return this.provisionadd.value.get('cc_id');
  }
  // ccend
  // subcat
  subcatget(){
    let cc: String = "";
    this.subcat( this.catid,cc);

    this.provisionadd.get('subcategory_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        

      }),
      switchMap(value => this.Service.getapsubcatDropDown( this.catid,value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
  
      .subscribe((results: any[]) => {
        this.subcatdata = results["data"];
       
      })
  }
  subcat(id,val){
    this.Service.getapsubcatDropDown(id,val).subscribe((results: any[]) => {
      this.subcatdata = results["data"];
  
    })

  }
  public displayFnsub(_subcat?: subcat): string | undefined {
    return _subcat ? _subcat.name : undefined;
  }

  get _subcat() {
    return this.provisionadd.value.get('subcategory_id');
  }

  // subcatends

  // Vendor
  vendorget(){
    let query: String = "";
    this.vendor_data( query);

    this.provisionadd.get('vendor_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        

      }),
      switchMap(value => this.Service.vendorsearch(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
  
      .subscribe((results: any[]) => {
        this.vendordata = results["data"];
       
      })
  }
  vendor_data(val){
    this.Service.vendorsearch(val).subscribe((results: any[]) => {
      this.vendordata = results["data"];
     
    })

  }
  public displayFnvendor(_vendor?: vendor): string | undefined {
    return _vendor ? _vendor.name : undefined;
  }

  get( _vendor) {
    return this.provisionadd.value.get('vendor_id');
  }

  // vendor end

  glget(data){
    this.provisionadd.get('gl_id').setValue('');
    this.provisionadd.get('gl_id').setValue(data.glno);
  }
}
