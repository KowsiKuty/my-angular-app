import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SmsService } from '../sms.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, map, switchMap, takeUntil, tap, startWith} from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DatePipe, formatDate } from '@angular/common';
// import { DateAdapter } from '@angular/material/core';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
export interface assetid{
  id:string;
  barcode:string;
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
  selector: 'app-non-owned-asset-maker',
  templateUrl: './non-owned-asset-maker.component.html',
  styleUrls: ['./non-owned-asset-maker.component.scss'],
  providers: [{ provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
      DatePipe]
})
export class NonOwnedAssetMakerComponent implements OnInit {
  @ViewChild( MatAutocompleteTrigger ) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('Asset_id') matassetAutocomplete: MatAutocomplete;
  @ViewChild('assetidInput') Inputassetid: any;

  @ViewChild('branchref') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchidInput') branchidInput: any;
  @ViewChild('datacate') matsubAutocomplete: MatAutocomplete;
  @ViewChild('branchidInput') subInput: any;
  isLoading = false;
  branchList: Array<any>=[];
  categoryList: Array<any>=[];
  has_branchnext:boolean=true;
  has_branchprevious:boolean=false;
  has_branchpresentpage:number=1;
  has_subnext:boolean=true;
  has_subprevious:boolean=false;
  has_subpresentpage:number=1;
  assetidList: Array<any>=[];
  noacreateform:any= FormGroup;
  latest_date: string;
  start_date: string;
  valid_date=new Date();
  submit_button_disable:boolean=false;
  endDate:Date;
  constructor(private router: Router, private smsService: SmsService, private http: HttpClient,
    private toastr:ToastrService, private spinner: NgxSpinnerService,public datepipe: DatePipe,
    private fb: FormBuilder, route:ActivatedRoute,private dateAdapter: DateAdapter<Date>) {

    const today = new Date();
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    this.endDate=new Date(
     today.getFullYear(),
     today.getMonth(),
     today.getDate()+1
    )
     }

  ngOnInit(): void {
 
    this.noacreateform =this.fb.group({
      'Asset_id':new FormControl(),
      'branch':new FormControl(),
      'category':new FormControl(),
      'enddate':new FormControl(),
      'remarks':new FormControl(),
      'Asset_name':new FormControl(),
      'Make_model':new FormControl(),
      'asset_serial_number':new FormControl(),
      'Start_date':new FormControl(),
    });
    // this.latest_date =this.datepipe.transform(this.valid_date, 'dd-MM-yyyy');
    // this.start_date =this.datepipe.transform(this.valid_date, 'dd-MM-yyyy');
    this.smsService.getAMCassetiddropdown(1,'').subscribe(data=>{
      this.assetidList=data['data'];
    });
    this.noacreateform.get('Asset_id').valueChanges.pipe(
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
    this.noacreateform.get('branch').valueChanges.pipe(
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
    this.smsService.getAMCategorydropdown(1,'').subscribe(data=>{
      this.categoryList=data['data'];
    });
    this.noacreateform.get('category').valueChanges.pipe(
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
  }
  public assetidintreface(data?:assetid):string | undefined{
    return data?data.barcode:undefined;
  }
  public branchintreface(data?:branch):string | undefined{
    return data?data.code +' - '+data.name:undefined;
  }
  public categoryintreface(data?:category):string | undefined{
    return data?data.subcatname:undefined;
  }
  kyenbdata(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }
  resetdata(){
    this.noacreateform.reset('');
   
  }
  // this.start_date=this.this.datepipe.transform(this.noacreateform.get('Start_date').value,'dd-MMM-yyyy');
  onDateChange(){
    this.latest_date=this.datepipe.transform(this.noacreateform.get('Start_date').value,'dd-MMM-yyyy');
    console.log(this.latest_date)
  }
  
  createnoa(){
    this.latest_date =this.datepipe.transform(this.valid_date, 'yyyy-MM-dd');
    this.start_date=this.datepipe.transform(this.noacreateform.get('Start_date').value,'dd-MMM-yyyy');
    if(this.noacreateform.get('branch').value ==undefined || this.noacreateform.get('branch').value =="" || this.noacreateform.get('branch').value ==''){
      this.toastr.error('Please Select The Branch Name');
      return false;
    }
    if(this.noacreateform.get('Asset_id').value ==undefined || this.noacreateform.get('Asset_id').value =="" || this.noacreateform.get('Asset_id').value ==''){
      this.toastr.error('Please Enter The Asset Id');
      return false;
    }
    if(this.noacreateform.get('Asset_name').value ==undefined || this.noacreateform.get('Asset_name').value =="" || this.noacreateform.get('Asset_name').value ==''){
      this.toastr.error('Please Enter The Asset Name');
      return false;
    }
    if(this.noacreateform.get('Make_model').value ==undefined || this.noacreateform.get('Make_model').value =="" || this.noacreateform.get('Make_model').value ==''){
      this.toastr.error('Please Enter The Asset Make/Model');
      return false;
    }
    if(this.noacreateform.get('asset_serial_number').value ==undefined || this.noacreateform.get('asset_serial_number').value =="" || this.noacreateform.get('asset_serial_number').value ==''){
      this.toastr.error('Please Enter The Asset Serial Number');
      return false;
    }
    // if(this.noacreateform.get('category').value ==undefined || this.noacreateform.get('category').value =="" || this.noacreateform.get('category').value ==''){
    //   this.toastr.error('Please Enter The Asset Category');
    //   return false;
    // }
    
    // if(this.noacreateform.get('remarks').value ==undefined || this.noacreateform.get('remarks').value =="" || this.noacreateform.get('remarks').value ==''){
    //   this.toastr.error('Please Enter The Remarks');
    //   return false;
    // }
    if(this.noacreateform.get('enddate').value ==undefined || this.noacreateform.get('enddate').value =="" || this.noacreateform.get('enddate').value ==''){
      this.toastr.error('Please Select The End Date');
      return false;
    }
    if(this.noacreateform.get('Start_date').value ==undefined || this.noacreateform.get('Start_date').value =="" || this.noacreateform.get('Start_date').value ==''){
      this.toastr.error('Please Select The Start Date');
      return false;
    }
    this.submit_button_disable=true;
  
    let d:any={
      "asset_id":this.noacreateform.get('Asset_id').value,
      "branch_id":this.noacreateform.get('branch').value.id,
      "start_date": this.datepipe.transform(this.noacreateform.get('Start_date').value,'yyyy-MM-dd'),
      "end_date":this.datepipe.transform(this.noacreateform.get('enddate').value,'yyyy-MM-dd'),
      "remarks":'',
      "asset_cat":1,
      "asset_serial_no":this.noacreateform.get('asset_serial_number').value,
      "asset_make_model":this.noacreateform.get('Make_model').value,
      "asset_name":this.noacreateform.get('Asset_name').value

      
    }
    console.log('noa',d)

    this.spinner.show();
    this.smsService.noacreate(d).subscribe(resulr=>{
      this.spinner.hide();
      if (resulr.status=="success"){
        this.toastr.success(resulr.message);
        this.router.navigate(['/sms/nonownedassetsummary']);
        // this.router.navigate(['/sms/smsamccreate'])

      }
      if (resulr.code=="INVALID_DATA"){
        this.toastr.error(resulr.description);
        this.router.navigate(['/sms/nonownedassetmaker'])
    }
    },
    (error)=>{
      this.toastr.error(error.status+error.statusText);
      this.spinner.hide();
    }
    )
      
  
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
               
              this.smsService.getAMBranchdropdown( this.has_branchpresentpage+1,this.noacreateform.get('branch').value).subscribe((data:any)=>{
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
               
              this.smsService.getAMCassetiddropdown(this.has_subpresentpage+1,this.noacreateform.get('Asset_id').value).subscribe((data:any)=>{
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
}
