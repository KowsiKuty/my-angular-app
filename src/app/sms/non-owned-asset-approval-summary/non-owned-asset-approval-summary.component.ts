
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SmsService } from '../sms.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DatePipe, formatDate } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { finalize, map, switchMap, takeUntil, tap, startWith} from 'rxjs/operators';
import { fromEvent } from 'rxjs';

export interface assetid{
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
  selector: 'app-non-owned-asset-approval-summary',
  templateUrl: './non-owned-asset-approval-summary.component.html',
  styleUrls: ['./non-owned-asset-approval-summary.component.scss'],
  providers: [{ provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
      DatePipe]
})
export class NonOwnedAssetApprovalSummaryComponent implements OnInit {

  @ViewChild( MatAutocompleteTrigger ) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('Asset_id') matassetAutocomplete: MatAutocomplete;
  @ViewChild('assetidInput') Inputassetid: any;

  @ViewChild('branchref') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchidInput') branchidInput: any;
  @ViewChild('datacate') matsubAutocomplete: MatAutocomplete;
  @ViewChild('branchidInput') subInput: any;
  @ViewChild('closepopup') closepopup;
noagropform:any= FormGroup;
noaeditform:any= FormGroup;
assetsave:any= FormGroup;
presentpagebuk: number = 1;
presentpagenew: number = 1;
noasummarydata:any = [];
has_nextbuk = true;
has_previousbuk = true;
pageSize = 10;
assetidList: Array<any>=[];
isLoading = false;
branchList: Array<any>=[];
categoryList: Array<any>=[];
has_branchnext:boolean=true;
has_branchprevious:boolean=false;
has_branchpresentpage:number=1;
has_subnext:boolean=true;
has_subprevious:boolean=false;
has_subpresentpage:number=1;
latest_date: string;
noa_id:any;
first=false;
valid_date=new Date();
constructor(private router: Router, private smsService: SmsService, private http: HttpClient,
  private toastr:ToastrService, private spinner: NgxSpinnerService,private matdialog:MatDialog,
  private fb: FormBuilder, route:ActivatedRoute,public datepipe: DatePipe,) { }
  

ngOnInit(): void {
this.assetsave =this.fb.group({
  });

  this.noaeditform =this.fb.group({
    'Asset_id':new FormControl(),
    'branch':new FormControl(),
    'category':new FormControl(),
    'enddate':new FormControl(),
    'remarks':new FormControl(),
    'Asset_name':new FormControl(),
    'Make_model':new FormControl(),
    'asset_serial_number':new FormControl(),
    'Start_date':new FormControl()
  });

  this.noagropform =this.fb.group({
    'Asset_id':new FormControl(),
    'branch':new FormControl(),
    'category':new FormControl(),
    'enddate':new FormControl(),
    'Asset_name':new FormControl(),
    'Make_model':new FormControl(),
    'asset_serial_number':new FormControl(),
    'Start_date':new FormControl(),
    'status':new FormControl()
  });

  // this.noaeditform =this.fb.group({
  //   'Asset_id':new FormControl(),
  //   'branch':new FormControl(),
  //   'category':new FormControl(),
  //   'enddate':new FormControl(),
  //   'remarks':new FormControl()
  // });
  this.smsService.getAMCassetiddropdown(1,'').subscribe(data=>{
    this.assetidList=data['data'];
  });
  this.noagropform.get('Asset_id').valueChanges.pipe(
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
  this.noagropform.get('branch').valueChanges.pipe(
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
  this.noagropform.get('category').valueChanges.pipe(
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
  this.getnoaApi();
}
createNOAApproval(){
  this.router.navigate(['/sms/nonownedassetapprover'], { skipLocationChange: true })
}
resetdata(){
  this.noagropform.reset('');
  this.getnoaApi();
}
sortOrdernoaap:any;
noaapclr:boolean=false;
noaapclr1:boolean=false;
getnoaApi(){
  this.spinner.show()
  if (this.noaapclr == true){
    this.noaapclr=true;
  }
  else if(this.noaapclr1 == true){
    this.noaapclr1=true;
  }
  else{
    this.noaapclr=true;
    this.noaapclr1=false;
  }
  if (this.sortOrdernoaap != undefined && this.sortOrdernoaap != null &&this.sortOrdernoaap != ''){
    this.sortOrdernoaap=this.sortOrdernoaap
  }
  else  {
    this.sortOrdernoaap='asce'
  }
  let asset_id:any=this.noagropform.value.Asset_id?this.noagropform.value.Asset_id:'';
  let branch_id:any=this.noagropform.value.branch?this.noagropform.value.branch.id:'';
  let asset_cat:any=this.noagropform.value.category?this.noagropform.value.category:'';
  let asset_name:any=this.noagropform.value.Asset_name?this.noagropform.value.Asset_name:'';
  let make_model:any=this.noagropform.value.Make_model?this.noagropform.value.Make_model:'';
  let asset_serial_number:any=this.noagropform.value.asset_serial_number?this.noagropform.value.asset_serial_number:'';
  let start_date:any=this.datepipe.transform(this.noagropform.value.Start_date, 'yyyy-MM-dd')?this.datepipe.transform(this.noagropform.value.Start_date, 'yyyy-MM-dd'):'';
  let enddate:any=this.datepipe.transform(this.noagropform.value.enddate, 'yyyy-MM-dd')?this.datepipe.transform(this.noagropform.value.enddate, 'yyyy-MM-dd'):'';
  let Status={'PENDING':1,'APPROVED':2,'REJECTED':3};
  let status:any=Status[this.noagropform.get('status').value]?Status[this.noagropform.get('status').value]:'';
  this.smsService.getNOAApprovalSummary_sort(this.presentpagebuk,asset_id,branch_id,asset_cat,asset_name,make_model,asset_serial_number,start_date,enddate,status,this.sortOrdernoaap).subscribe(data => {
    // console.log(data['code'])
    this.spinner.hide();
    if (data['code'] !=undefined && data['code'] !=''){
      this.toastr.warning(data['description']);
      this.toastr.warning(data['code']);
    }
    else{
    this.noasummarydata = data['data'];

    let pagination=data['pagination'];
    this.has_previousbuk=pagination.has_previous;
    this.has_nextbuk=pagination.has_next;
    this.presentpagebuk=pagination.index;
  
    console.log(data);
  }
  },
  (error)=>{
    this.spinner.hide();
    this.toastr.warning(error.status+error.statusText);
    let d:string=error.error;
    this.toastr.warning(d.substring(0,100));
  
    
  })
  }
  getnoaaproveascdec(data,num){
    this.spinner.show()
    this.sortOrdernoaap=data;
    if (num==1){
      this.noaapclr=true;
      this.noaapclr1=false;
    }
    if (num==2){
      this.noaapclr=false;
    this.noaapclr1=true;
    }
    let asset_id:any=this.noagropform.value.Asset_id?this.noagropform.value.Asset_id:'';
    let branch_id:any=this.noagropform.value.branch?this.noagropform.value.branch.id:'';
    let asset_cat:any=this.noagropform.value.category?this.noagropform.value.category:'';
    let asset_name:any=this.noagropform.value.Asset_name?this.noagropform.value.Asset_name:'';
    let make_model:any=this.noagropform.value.Make_model?this.noagropform.value.Make_model:'';
    let asset_serial_number:any=this.noagropform.value.asset_serial_number?this.noagropform.value.asset_serial_number:'';
    let start_date:any=this.datepipe.transform(this.noagropform.value.Start_date, 'yyyy-MM-dd')?this.datepipe.transform(this.noagropform.value.Start_date, 'yyyy-MM-dd'):'';
    let enddate:any=this.datepipe.transform(this.noagropform.value.enddate, 'yyyy-MM-dd')?this.datepipe.transform(this.noagropform.value.enddate, 'yyyy-MM-dd'):'';
    let Status={'PENDING':1,'APPROVED':2,'REJECTED':3};
    let status:any=Status[this.noagropform.get('status').value]?Status[this.noagropform.get('status').value]:'';
    this.smsService.getNOAApprovalSummary_sort(this.presentpagebuk,asset_id,branch_id,asset_cat,asset_name,make_model,asset_serial_number,start_date,enddate,status,this.sortOrdernoaap).subscribe(data => {
      // console.log(data['code'])
      this.spinner.hide();
      if (data['code'] !=undefined && data['code'] !=''){
        this.toastr.warning(data['description']);
        this.toastr.warning(data['code']);
      }
      else{
      this.noasummarydata = data['data'];
  
      let pagination=data['pagination'];
      this.has_previousbuk=pagination.has_previous;
      this.has_nextbuk=pagination.has_next;
      this.presentpagebuk=pagination.index;
    
      console.log(data);
    }
    },
    (error)=>{
      this.spinner.hide();
      this.toastr.warning(error.status+error.statusText);
      let d:string=error.error;
      this.toastr.warning(d.substring(0,100));
    
      
    })
    }
  bukpreviousClick() {
    if (this.has_previousbuk === true) {
      this.presentpagebuk -=1;
      this.getnoaApi();
    }
  }
  buknextClick() {
    if (this.has_nextbuk === true) {
      this.presentpagebuk +=1;
      this.getnoaApi();
    }
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
  kyenbdata(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }
  disables(noa){
    if(noa.status=="APPROVED"||noa.status=="REJECTED"){
      return true;
    }else{
      return false;
    }
  }
  edit_noa_screen(noa:any){
    this.noa_id=noa.id
    this.latest_date=this.datepipe.transform(this.noaeditform.get('Start_date').value,'dd-MMM-yyyy');
    this.smsService.getNOASingleget(this.noa_id).subscribe(data=>{
      console.log(data)
      this.noaeditform.get('branch').patchValue({id:data.branch_id.id,name:data.branch_id.name,code:data.branch_id.code})
      this.noaeditform.get('Asset_id').patchValue(data.asset_id)
      this.noaeditform.get('category').patchValue({id:data.asset_cat.id,subcatname:data.asset_cat.name})
      this.noaeditform.get('remarks').patchValue(data.remarks)
      this.noaeditform.get('enddate').patchValue(data.end_date)
      this.noaeditform.get('Asset_name').patchValue(data.asset_name)
      this.noaeditform.get('Make_model').patchValue(data.asset_make_model)
      this.noaeditform.get('asset_serial_number').patchValue(data.asset_serial_no)
      this.noaeditform.get('Start_date').patchValue(data.start_date)
    })
  }
  approvenoa(){
    if(this.noaeditform.get('remarks').value ==undefined || this.noaeditform.get('remarks').value =="" || this.noaeditform.get('remarks').value ==''){
      this.toastr.error('Please Enter The Remarks');
      return false;
    }
    let remarks=this.noaeditform.get('remarks').value;
    this.smsService.getnoaapprovalsummaryapprove(this.noa_id,remarks).subscribe(res=>{
      if(res['status']=='success'){
        this.toastr.success('Successfully Approved');
        this.closepopup.nativeElement.click();
      
        this.getnoaApi();
        
      }
      else{
       
        this.toastr.error(res['description']);
      }
    });
  }
  rejectnoa(){
    if(this.noaeditform.get('remarks').value ==undefined || this.noaeditform.get('remarks').value =="" || this.noaeditform.get('remarks').value ==''){
      this.toastr.error('Please Enter The Remarks');
      return false;
    }
    let remarks=this.noaeditform.get('remarks').value;

    this.smsService.getnoaapprovalsummaryreject(this.noa_id,remarks).subscribe(res=>{
      if(res['status']=='success'){
        this.toastr.success('Successfully Rejected');
        this.closepopup.nativeElement.click();
        
        this.getnoaApi();
      
      }
      else{
      
        this.toastr.error(res['description']);
      }
    });

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
               
              this.smsService.getAMBranchdropdown( this.has_branchpresentpage+1,this.noagropform.get('branch').value).subscribe((data:any)=>{
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
               
              this.smsService.getAMCassetiddropdown(this.has_subpresentpage+1,this.noagropform.get('Asset_id').value).subscribe((data:any)=>{
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
  
  noa_approval_summary_Download(){
    let asset_id:any=this.noagropform.value.Asset_id?this.noagropform.value.Asset_id:'';
    let branch_id:any=this.noagropform.value.branch?this.noagropform.value.branch.id:'';
    let asset_cat:any=this.noagropform.value.category?this.noagropform.value.category:'';
    let asset_name:any=this.noagropform.value.Asset_name?this.noagropform.value.Asset_name:'';
    let make_model:any=this.noagropform.value.Make_model?this.noagropform.value.Make_model:'';
    let asset_serial_number:any=this.noagropform.value.asset_serial_number?this.noagropform.value.asset_serial_number:'';
    let start_date:any=this.datepipe.transform(this.noagropform.value.Start_date, 'yyyy-MM-dd')?this.datepipe.transform(this.noagropform.value.Start_date, 'yyyy-MM-dd'):'';
    let enddate:any=this.datepipe.transform(this.noagropform.value.enddate, 'yyyy-MM-dd')?this.datepipe.transform(this.noagropform.value.enddate, 'yyyy-MM-dd'):'';
    let Status={'PENDING':1,'APPROVED':2,'REJECTED':3};
    let status:any=Status[this.noagropform.get('status').value]?Status[this.noagropform.get('status').value]:'';
    
    if(this.first == true){
      this.toastr.warning('Already Progress')
      return true
    }
    this.first=true
    this.smsService.getnoa_approval_DownloadReport_xl(asset_id,branch_id,asset_cat,asset_name,make_model,asset_serial_number,start_date,enddate,status)
    .subscribe(fullXLS=>{
      console.log(fullXLS);
      let binaryData = [];
      binaryData.push(fullXLS)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'NOA_APPROVAL_Summary_Download'+ date +".xlsx";
      link.click();
      this.first=false;
    },
    (error)=>{
      this.first=false;
      this.toastr.warning(error.description)
    });
  }
 
}

