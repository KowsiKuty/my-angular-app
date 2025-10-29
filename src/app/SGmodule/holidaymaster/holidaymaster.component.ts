import { Component, OnInit, ViewChild, ElementRef, Output,EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SGService } from '../SG.service';
import { SGShareService } from '../share.service';
import { NotificationService } from 'src/app/service/notification.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';



import * as moment from 'moment';

import { DatePipe, formatDate } from '@angular/common';


import {default as _rollupMoment, Moment} from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';

const moment1 = _rollupMoment || moment;

export interface productlistss{
  id:number,
  name:string,
  code:string
}
export interface statezonelist{
  id:number,
  name:string,
  // state__name:string
}

export interface approvalBranch {
  id: string;
  name: string;
  code: string;
}


export interface approver {
  id: string;
  full_name: string;
}


export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-holidaymaster',
  templateUrl: './holidaymaster.component.html',
  styleUrls: ['./holidaymaster.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class HolidaymasterComponent implements OnInit {
  
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  // Vendor dropdown
  @ViewChild('VendorContactInput') VendorContactInput:any;
  @ViewChild('producttype') matAutocompletevendor: MatAutocomplete;

  // State dropdown
  @ViewChild('StateContactInput') StateContactInput:any;
  @ViewChild('producttype1') matAutocompletestate: MatAutocomplete;

//approval branch
@ViewChild('appBranchInput') appBranchInput:any;
@ViewChild('approvalBranch') matAutocompleteappbranch: MatAutocomplete;

  // Approver dropdown
 @ViewChild('ApproverContactInput') ApproverContactInput:any;
 @ViewChild('employee') matAutocompleteapprover: MatAutocomplete;

 @ViewChild('ApproverContactInput') clear_appBranch;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  
  filelistcheck=[];
  myFileseventfile:any;
  filehide=true;
  eventfileid: any;
  fileoalist: any;
  movetochekerform: FormGroup;
  approverform: FormGroup;
  rejectedform: FormGroup;
  reviewform: FormGroup;
  holidayidapproval:any
  @ViewChild('addaprover')addaprover;
  @ViewChild('rejected')rejected;
  @ViewChild('review')review;
  @ViewChild('makerchecker')makerchecker;

  constructor(private fb: FormBuilder,private datepipe:DatePipe,private shareServicesg:SGShareService,private router:Router,private toastr: ToastrService,private  sgservice:SGService,private shareservice:SGShareService,private notification:NotificationService) { }

  @ViewChild('fileInput')
  fileInput;
  holidaysform: FormGroup;  
  HolidayUpdateForm: FormGroup;
  validfrom:FormControl
  validto:FormControl
  approvalflowlist:any=[];

  // Add form 

  addformholiday:boolean=false
  addviewholiday:boolean=false

  // view screen datas 

  state:String;
  vendor:any;
  year:any;
  approval_status:any;
  hoildayvalue:any
  monthdate = new FormControl(moment());
  navigationskey:any

  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.monthdate.value;
    ctrlValue.year(normalizedYear.year());
    this.monthdate.setValue(ctrlValue);
    this.holidaysform.patchValue({
      year:this.monthdate.value
    })
    datepicker.close();
  }

  ngOnInit(): void {

    this.holidaysform=this.fb.group({
      
      vendor_id:[''],
      state_id:[''],
      year:['']
    })
    // this.HolidayUpdateForm = this.fb.group({
    //   name:[''],
    //   date:['']
    // })
    this.addformholiday=this.shareServicesg.hoildaykeyadd
    this.addviewholiday=this.shareServicesg.hoildaykeyview
    let sharevalue=this.shareServicesg.holidaysummarydata.value;
    this.holidayidapproval=sharevalue?.id
    this.approvalflowlist.push(sharevalue)
    this.hoildayvalue=sharevalue
    this.state=sharevalue?.state?.name
    // this.vendor=sharevalue?.vendor?.name
    this.vendor = "("+sharevalue?.vendor?.code +") "+sharevalue?.vendor?.name
    this.year=sharevalue?.year
    this.approval_status=sharevalue?.approval_status?.status
   
    if(this.addviewholiday==true)
    {
      this.getholidayvalue(this.shareServicesg.holidaysummarydata.value.id)
    }
    this.navigationskey=1;

    
    this.movetochekerform=this.fb.group({

      status:[''],
      remarks:[''],
      approver:[''],
      approval_branch:[''],
      // patch1:['']
    })
    
    this.approverform=this.fb.group({
     
      status:[''],
      remarks:[''],
      
    })
    
    this.rejectedform=this.fb.group({
      status:[''],
      remarks:[''],
    })

    this.reviewform=this.fb.group({
      status:[''],
      remarks:[''],
    })

  }

  getholidayvalue(holiday_id){
    this.sgservice.Viewholidayformdetails(holiday_id).subscribe((result)=>{
      console.log('fileone',result)
        let datass = result['data'];
        this.fileoalist=datass;
        
        console.log('fileone',datass)
    })

  }
  addformonholiday=false
  Addscreenchange(hoildayvaluedata)
  {
    this.addformonholiday=true
    this.addformholiday=true
    this.addviewholiday=false
    this.navigationskey=2;
    this.holidaysform.patchValue({
      vendor_id:this.shareServicesg.holidaysummarydata.value.vendor,
      state_id:this.shareServicesg.holidaysummarydata.value.state,  
    })
  }

  fileProgress(fileInput: any) {
    this.myFileseventfile =[];
    // this.myFileseventfile.push(fileInput.target.files);
    this.myFileseventfile = fileInput.target.files
    // for (var i = 0; i < fileInput.target.files.length; i++) { 
      
    //   if(this.filelistcheck.length===1){
    //     this.toastr.warning('', 'Please Enter only one file', { timeOut: 1500 });
    //     break;
  
    //   }
    //   else{
    //     this.myFileseventfile.push(fileInput.target.files[i]);
    //   console.log("myFileseventfile",  this.myFileseventfile)
    //   console.log("fileInput.target.files",  fileInput.target.files)
    //   this.filehide=true
  
    //   }
  
  
    // }
  }
  delete(i){
    this.myFileseventfile.splice(i, 1)
  }

  OnSubmitclick()
  {

    if(this.holidaysform.value.vendor_id==="")
    {
      
      this.toastr.warning('', 'Please Select the Vendor', { timeOut: 1500 });
      return false
    }
    if(this.holidaysform.value.state_id==="")
    {
      this.toastr.warning('', 'Please Select the State', { timeOut: 1500 });
      return false
    }
    if(this.holidaysform.value.year==="")
    {
      this.toastr.warning('', 'Please Select the Valid From ', { timeOut: 1500 });
      return false
    }
    if (this.myFileseventfile === undefined || this.myFileseventfile.length === 0) {
      this.toastr.warning('', 'Choose Upload Files ', { timeOut: 1500 });
      return false;
    }
    // if(this.myFileseventfile.length>1){
    //   this.toastr.warning('', 'Please Enter only one file', { timeOut: 1500 });
    //   return false;
    // }
    if(this.movetochekerform.value.approval_branch.id=== undefined|| this.movetochekerform.value.approval_branch==='')
    {
      this.toastr.warning('', 'Please Select Any one Approver Branch', { timeOut: 1500 });
      return false
    }
    if( this.movetochekerform.value.approver.id=== undefined|| this.movetochekerform.value.approver==='')
    {
      this.toastr.warning('', 'Please Select Any one Approver', { timeOut: 1500 });
      return false
    }
    // let yearselect=this.holidaysform.value.year
    // yearselect=this.datepipe.transform(yearselect,'yyyy')
    
    // this.holidaysform.patchValue({
    //   vendor_id:this.holidaysform.value.vendor_id.id,
    //   state_id:this.holidaysform.value.state_id.id,
    //   year:yearselect
    // })
    const endDate = this.holidaysform.value;
    endDate.year = this.datepipe.transform(endDate.year, 'yyyy');
    console.log("abc",this.holidaysform.value.year)
  

    if(this.holidaysform.value.vendor_id.id != undefined){
      this.holidaysform.value.vendor_id = this.holidaysform.value.vendor_id.id
      this.holidaysform.value.state_id = this.holidaysform.value.state_id.id
    }
    



   
//     else{   
    this.sgservice.createholidayform(this.eventfileid,this.holidaysform.value,this.myFileseventfile)
    .subscribe(result => {
      if (result.status === "success") {
        this.notification.showSuccess(result.message)
        let dataForApprover = {
          status: 2, 
          remarks: this.movetochekerform.value.remarks, 
          approver: this.movetochekerform.value.approver.id, 
          approval_branch: this.movetochekerform.value.approval_branch.id,
        }
        this.sgservice.holiday_status( dataForApprover, result.id)
          .subscribe(res => {
            if (res.status == "success") {
              this.notification.showSuccess("Moved to Approver!...")
            } else {
              this.notification.showError(res.description)
            }
            this.movetochekerform=this.fb.group({
              state_id:[''],
              status:[''],
              remarks:[''],
              approver:[''],
              shift_type:['']
            }) 
            // return true
            this.onSubmit.emit()
          })
        this.filehide=false
        this.myFileseventfile=[]
        // if(this.navigationskey==2)
        // {
         this.addformholiday=false
          this.addviewholiday=true
          this.holidaysform=this.fb.group({
      
            vendor_id:[''],
            state_id:[''],
            year:['']
          })
        // }
        // else{
          // this.onSubmit.emit()
          // this.router.navigate(['SGmodule/sgmaster',3], { skipLocationChange: true })
          // this.holidaysform=this.fb.group({
      
          //   vendor_id:[''],
          //   state_id:[''],
          //   year:['']
          // })
        // }
        
      }
      else {
        this.notification.showError(result.description)
        this.holidaysform=this.fb.group({
      
          vendor_id:[''],
          state_id:[''],
          year:['']
        })
        
      }
      

    }) 
  // }
   
  }
  

  
  OnCancleclick1(){
    // this.router.navigate(['SGmodule/sgmaster',3], { skipLocationChange: true })
    this.onCancel.emit();
    this.approvalflowlist=[]
    
  }
  

  OnCancleclick(){
    if(this.navigationskey==2)
    {
      this.addformholiday=false
      this.addviewholiday=true
    }
    else{
      this.onCancel.emit();
      // this.router.navigate(['SGmodule/sgmaster',3], { skipLocationChange: true })
      this.approvalflowlist=[]
    }
    
  }

  isLoading:boolean=false
  empvendorlist:any
  productname(){
    
    let prokeyvalue: String = "";
      this.getcatven(prokeyvalue);
      this.holidaysform.get('vendor_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.sgservice.getvendordropdown(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.empvendorlist = datas;
          console.log("product", datas)

        })

  }
  private getcatven(prokeyvalue)
  {
    this.sgservice.getvendordropdown(prokeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.empvendorlist = datas;

      })
  }

  public displaydis(producttype?: productlistss): string | undefined {
    // return producttype ? producttype.name : undefined;
    return producttype ? "("+producttype.code +") "+producttype.name : undefined;
    
  }

  dropdownstate:any
  statename(){
    let prokeyvalue: String = "";
      this.getstate(prokeyvalue);
      this.holidaysform.get('state_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.sgservice.getStatezonesearch(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          for (let i = 0; i < datas.length; i++) {
            const Date = datas[i].effectivefrom
            let fromdate = this.datepipe.transform(Date, 'dd-MMM-yyyy');
            console.log("date",fromdate)
            datas[i].name = datas[i].name + " (" + fromdate + ")"
            console.log("name",datas[i].name)
          }
          this.dropdownstate = datas;
          console.log("search--sate", this.dropdownstate)

        })

  }
  private getstate(prokeyvalue)
  {
    this.sgservice.getStatezonesearch(prokeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        for (let i = 0; i < datas.length; i++) {
          const Date = datas[i].effectivefrom
          let fromdate = this.datepipe.transform(Date, 'dd-MMM-yyyy');
          console.log("date",fromdate)
          datas[i].name = datas[i].name + " (" + fromdate + ")"
          console.log("name",datas[i].name)
        }
        this.dropdownstate = datas;
        console.log("sate", this.dropdownstate)

      })
  }

  public displaydis1(producttype?: statezonelist): string | undefined {
    //console.log('id', producttype.id);
    // this.selecteddrop=producttype.id
    // console.log('name', this.selecteddrop);
        
    
    return producttype.name ? producttype.name : undefined
    
  }
 

  // vendor dropdown

  currentpageven:any=1
  has_nextven:boolean=true
  has_previousven:boolean=true
  autocompleteVendornameScroll() {
    
    setTimeout(() => {
      if (
        this.matAutocompletevendor &&
        this.autocompleteTrigger &&
        this.matAutocompletevendor.panel
      ) {
        fromEvent(this.matAutocompletevendor.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletevendor.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(()=> {
            const scrollTop = this.matAutocompletevendor.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletevendor.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletevendor.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextven === true) {
                this.sgservice.getvendordropdown(this.VendorContactInput.nativeElement.value, this.currentpageven + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.empvendorlist = this.empvendorlist.concat(datas);
                    if (this.empvendorlist.length >= 0) {
                      this.has_nextven = datapagination.has_next;
                      this.has_previousven = datapagination.has_previous;
                      this.currentpageven = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  // State dropdown
  currentpageste:any=1
  has_nextsta:boolean=true
  has_previoussta:boolean=true
  autocompleteStatenameScroll() {
    
    setTimeout(() => {
      if (
        this.matAutocompletestate &&
        this.autocompleteTrigger &&
        this.matAutocompletestate.panel
      ) {
        fromEvent(this.matAutocompletestate.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletestate.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(()=> {
            const scrollTop = this.matAutocompletestate.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletestate.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletestate.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextsta === true) {
                this.sgservice.getStatezonesearch(this.StateContactInput.nativeElement.value, this.currentpageste + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    for (let i = 0; i < datas.length; i++) {
                      const Date = datas[i].effectivefrom
                      let fromdate = this.datepipe.transform(Date, 'dd-MMM-yyyy');
                      datas[i].name = datas[i].name + " (" + fromdate + ")"
                    }
                    let datapagination = results["pagination"];
                    this.dropdownstate = this.dropdownstate.concat(datas);
                    if (this.dropdownstate.length >= 0) {
                      this.has_nextsta = datapagination.has_next;
                      this.has_previoussta = datapagination.has_previous;
                      this.currentpageste = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }


  // Approval flow of the program

  
  // mimimumwages display
  oncancelclick1()
  {
    this.movetochekerform.patchValue({
      approver:'',
      remarks:'',
      approval_branch:'',
      patch1:''
    })
    this.approverform.patchValue({
      remarks:''
    })
    this.reviewform.patchValue({
      remarks:''
    })
    this.rejectedform.patchValue({
      remarks:''
    })
    
  }
  namelist=[];
  
  movetoapprove(){
    if(this.movetochekerform.value.approval_branch=='')
    {
      this.toastr.warning('', 'Please Select the Approver Branch', { timeOut: 1500 });    
      return false
    }
    if(this.movetochekerform.value.approver=='')
    {
      this.toastr.warning('', 'Please Select the Approver', { timeOut: 1500 });    
      return false
    }
    // if(this.movetochekerform.value.remarks=='')
    // {
    //   this.toastr.warning('', 'Please Enter the Remarks', { timeOut: 1500 });    
    //   return false
    // }
    
    this.movetochekerform.patchValue({
      status:2,
      approval_branch:this.movetochekerform.value.approval_branch.id,
      approver:this.movetochekerform.value.approver.id,
      
    })
    console.log("holiday",this.movetochekerform.value)
  
    this.sgservice.holiday_status(this.movetochekerform.value,this.holidayidapproval)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Moved to Approver!...")
     
            this.makerchecker.nativeElement.click();
            this.sgservice.getholidayformdetails('',1)
            .subscribe(result => {
              console.log('fileone',result)
              let datass = result['data'];
              this.namelist=datass;
              for(let i=0;i<this.namelist.length;i++)
              {
                if(this.namelist[i].id==this.holidayidapproval)
                {
                  this.approvalflowlist=[]
                  this.approvalflowlist.push(this.namelist[i])
                }
              }
              let sharevalue=this.approvalflowlist[0];
              this.state=sharevalue?.state?.name
              this.vendor = "("+sharevalue?.vendor?.code +") "+sharevalue?.vendor?.name
              this.year=sharevalue?.year
              this.approval_status=sharevalue?.approval_status?.status
              // let datapagination = result["pagination"];
              // console.log('fileone',datass)
              // if (this.fileoalist.length >= 0) {
              
              //   this.has_nextholi = datapagination.has_next;
              //   this.has_previousholi = datapagination.has_previous;
              //   this.presentpageholi= datapagination.index;
              //   console.log("if conditions",this.has_nextven )
              // }
              // this.onsearch=false
            })
          
        } else {
          this.notification.showError(res.description)
        } 
        return true
      })

      
  }

  ApproverPopupForm()
  {
    
    if(this.approverform.value.remarks=='')
    {
      this.toastr.warning('', 'Please Enter the Remarks', { timeOut: 1500 });    
      return false
    }
    
    console.log("approver branch",this.approverform.value)
    this.approverform.patchValue({
      status:3,
     
    })
    this.sgservice.holiday_status(this.approverform.value,this.holidayidapproval)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Approved Successfully!...")

          
            this.addaprover.nativeElement.click();
            this.sgservice.getholidayformdetails('',1)
            .subscribe(result => {
              console.log('fileone',result)
              let datass = result['data'];
              this.namelist=datass;
              for(let i=0;i<this.namelist.length;i++)
              {
                if(this.namelist[i].id==this.holidayidapproval)
                {
                  this.approvalflowlist=[]
                  this.approvalflowlist.push(this.namelist[i])
                }
              }
              let sharevalue=this.approvalflowlist[0];
              this.state=sharevalue?.state?.name
              this.vendor = "("+sharevalue?.vendor?.code +") "+sharevalue?.vendor?.name
              this.year=sharevalue?.year
              this.approval_status=sharevalue?.approval_status?.status
              // let datapagination = result["pagination"];
              // console.log('fileone',datass)
              // if (this.fileoalist.length >= 0) {
              
              //   this.has_nextholi = datapagination.has_next;
              //   this.has_previousholi = datapagination.has_previous;
              //   this.presentpageholi= datapagination.index;
              //   console.log("if conditions",this.has_nextven )
              // }
              // this.onsearch=false
            })
          
            
       
        } else {
          this.notification.showError(res.description)
        } 
        return true
      })
    console.log("form value",this.approverform.value)
  }
  rejectPopupForm()
  { 
    if(this.rejectedform.value.remarks=='')
    {
      this.toastr.warning('', 'Please Enter the Remarks', { timeOut: 1500 });    
      return false
    }
    this.rejectedform.patchValue({
      status:0,
     
    })
    console.log("form value",this.rejectedform.value)
    this.sgservice.holiday_status(this.rejectedform.value,this.holidayidapproval)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Rejected!...")
          
              
            this.rejected.nativeElement.click();
            this.sgservice.getholidayformdetails('',1)
            .subscribe(result => {
              console.log('fileone',result)
              let datass = result['data'];
              this.namelist=datass;
              for(let i=0;i<this.namelist.length;i++)
              {
                if(this.namelist[i].id==this.holidayidapproval)
                {
                  this.approvalflowlist=[]
                  this.approvalflowlist.push(this.namelist[i])
                }
              }
              let sharevalue=this.approvalflowlist[0];
              this.state=sharevalue?.state?.name
              this.vendor = "("+sharevalue?.vendor?.code +") "+sharevalue?.vendor?.name
              this.year=sharevalue?.year
              this.approval_status=sharevalue?.approval_status?.status
              // let datapagination = result["pagination"];
              // console.log('fileone',datass)
              // if (this.fileoalist.length >= 0) {
              
              //   this.has_nextholi = datapagination.has_next;
              //   this.has_previousholi = datapagination.has_previous;
              //   this.presentpageholi= datapagination.index;
              //   console.log("if conditions",this.has_nextven )
              // }
              // this.onsearch=false
            })
          
          
        } else {
          this.notification.showError(res.description)
        } 
        return true
      })
  }
  reviewPopupForm()
  {
    if(this.reviewform.value.remarks=='')
    {
      this.toastr.warning('', 'Please Enter the Remarks', { timeOut: 1500 });    
      return false
    }
    this.reviewform.patchValue({
      status:4,
      
    })
  
    console.log("form value",this.reviewform.value)
    this.sgservice.holiday_status(this.reviewform.value,this.holidayidapproval)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Reviewed!...")

      
            this.review.nativeElement.click();
            this.sgservice.getholidayformdetails('',1)
            .subscribe(result => {
              console.log('fileone',result)
              let datass = result['data'];
              this.namelist=datass;
              for(let i=0;i<this.namelist.length;i++)
              {
                if(this.namelist[i].id==this.holidayidapproval)
                {
                  this.approvalflowlist=[]
                  this.approvalflowlist.push(this.namelist[i])
                }
              }

              let sharevalue=this.approvalflowlist[0];
              this.state=sharevalue?.state?.name
              this.vendor = "("+sharevalue?.vendor?.code +") "+sharevalue?.vendor?.name
              this.year=sharevalue?.year
              this.approval_status=sharevalue?.approval_status?.status
              // let datapagination = result["pagination"];
              // console.log('fileone',datass)
              // if (this.fileoalist.length >= 0) {
              
              //   this.has_nextholi = datapagination.has_next;
              //   this.has_previousholi = datapagination.has_previous;
              //   this.presentpageholi= datapagination.index;
              //   console.log("if conditions",this.has_nextven )
              // }
              // this.onsearch=false
            })
          
         
        } else {
          this.notification.showError(res.description)
        } 
        return true
      })
  }

  


  employeeList:any
  historyData:any

  approvalFlow(data) {
    let atten_id = data.id
    if(atten_id==undefined)
    {
      return false
    }
    this.sgservice.getholidayHistory(atten_id)
      .subscribe(result => {
        console.log("approvalFlow", result)
        this.historyData = result.data;
      })
  }

  // holidayDate:any;
  // holiday_Id:any
  // //singleList - holiday
  // singleList(data){
  //   this.holiday_Id =data.id
  //   const Date = data.date;
  //   this.holidayDate = this.datepipe.transform(Date, 'yyyy-MM-dd');  
  //   this.HolidayUpdateForm.patchValue({
  //     name:data.name,
  //     date:this.holidayDate
      
  //   })
  // }

  // HolidayUpdatePopupForm(){
  //   let json={
  //     id:this.holiday_Id
  //   }
  //   const HolidayDate = this.HolidayUpdateForm.value;
  //   HolidayDate.date = this.datepipe.transform(HolidayDate.date, 'yyyy-MM-dd');
  //   // HolidayDate.date = parseInt(this.datepipe.transform(HolidayDate.date, 'yyyy-MM-dd'));
  //   // const datetoint = this.HolidayUpdateForm.value;
  //   // datetoint.date = Number(datetoint.date)
  //   console.log("form",this.HolidayUpdateForm.value)
  //   this.sgservice.holiday_Update(this.HolidayUpdateForm.value,json)
  //   .subscribe(res => {
  //     if (res.status == "success") {
  //       this.notification.showSuccess("Updated Successfully!...")
  //       this.getholidayvalue(this.shareServicesg.holidaysummarydata.value.id);
  //     } else {
  //       this.notification.showError(res.description)
  //     } 
  //     return true
  //   })

  // }

  holidayUpdate(){
    this.shareservice.holidayupdate.next(this.holidayidapproval)
    this.shareservice.holidaysummarydata.next(this.hoildayvalue)
    this.router.navigate(['SGmodule/holidayUpdate'], { skipLocationChange: true })
  }


  

  approve(data)
  {
    console.log("name",data)
    this.movetochekerform.patchValue({
      approval_branch:data.branch_id,
      patch1:data.branch_code+"-"+data.branch_name
    })


  }







   //approval branch

 appBranchList:any
 approvalBranchClick() {
   let approvalbranchkeyvalue: String = "";
   this.getApprovalBranch(approvalbranchkeyvalue);
   this.movetochekerform.get('approval_branch').valueChanges
     .pipe(
       debounceTime(100),
       distinctUntilChanged(),
       tap(() => {
         this.isLoading = true;
         console.log('inside tap')
 
       }),
       switchMap(value => this.sgservice.getApprovalBranch(value,1)
         .pipe(
           finalize(() => {
             this.isLoading = false
           }),
         )
       )
     )
     .subscribe((results: any[]) => {
       let datas = results["data"];
       this.appBranchList = datas;
 
     })
 
 }
 
 private getApprovalBranch(approvalbranchkeyvalue) {
   this.sgservice.getApprovalBranch(approvalbranchkeyvalue,1)
     .subscribe((results: any[]) => {
       let datas = results["data"];
       this.appBranchList = datas;
     })
 }
 
 public displayFnappBranch(branch?: approvalBranch): string | undefined {
   
   return branch ? "("+branch.code +" )"+branch.name : undefined;
 }

 appBranch_Id=0;
 FocusApprovalBranch(data) {
   console.log("appbranch",data)
   this.appBranch_Id = data.id;
   console.log("id", this.appBranch_Id)
   this.getApprover(data.id, '')
 }
 clearAppBranch() {
   this.clear_appBranch.nativeElement.value = '';
 }

 // appbranch based employee

 approvername() {
  let approverkeyvalue: String = "";
  this.getApprover(this.appBranch_Id,approverkeyvalue);

  this.movetochekerform.get('approver').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.sgservice.appBranchBasedEmployee(this.appBranch_Id,value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.employeeList = datas;

    })

}

private getApprover(id,approverkeyvalue) {
  this.sgservice.appBranchBasedEmployee(id,approverkeyvalue, 1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.employeeList = datas;
    })
}

public displayFnEmployee(employee?: approver): string | undefined {
  return employee ? employee.full_name : undefined;
}





    // approval branch
    currentpageappbranch:any=1
    has_nextappbranch:boolean=true
    has_previousappbranch:boolean=true
    autocompleteapprovalBranchScroll() {
      
      setTimeout(() => {
        if (
          this.matAutocompleteappbranch &&
          this.autocompleteTrigger &&
          this.matAutocompleteappbranch.panel
        ) {
          fromEvent(this.matAutocompleteappbranch.panel.nativeElement, 'scroll')
            .pipe(
              map(() => this.matAutocompleteappbranch.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(()=> {
              const scrollTop = this.matAutocompleteappbranch.panel.nativeElement.scrollTop;
              const scrollHeight = this.matAutocompleteappbranch.panel.nativeElement.scrollHeight;
              const elementHeight = this.matAutocompleteappbranch.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_nextappbranch === true) {
                  this.sgservice.getApprovalBranch(this.appBranchInput.nativeElement.value, this.currentpageappbranch + 1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.appBranchList = this.appBranchList.concat(datas);
                      if (this.appBranchList.length >= 0) {
                        this.has_nextappbranch = datapagination.has_next;
                        this.has_previousappbranch = datapagination.has_previous;
                        this.currentpageappbranch = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }
  
    // Approver(employee) dropdown
   currentpageaddpay:any=1
   has_nextaddpay:boolean=true
   has_previousaddpay:boolean=true
   autocompleteapprovernameScroll() {
     
     setTimeout(() => {
       if (
         this.matAutocompleteapprover &&
         this.autocompleteTrigger &&
         this.matAutocompleteapprover.panel
       ) {
         fromEvent(this.matAutocompleteapprover.panel.nativeElement, 'scroll')
           .pipe(
             map(() => this.matAutocompleteapprover.panel.nativeElement.scrollTop),
             takeUntil(this.autocompleteTrigger.panelClosingActions)
           )
           .subscribe(()=> {
             const scrollTop = this.matAutocompleteapprover.panel.nativeElement.scrollTop;
             const scrollHeight = this.matAutocompleteapprover.panel.nativeElement.scrollHeight;
             const elementHeight = this.matAutocompleteapprover.panel.nativeElement.clientHeight;
             const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
             if (atBottom) {
               if (this.has_nextaddpay === true) {
                 this.sgservice.appBranchBasedEmployee(this.appBranch_Id,this.ApproverContactInput.nativeElement.value, this.currentpageaddpay + 1)
                   .subscribe((results: any[]) => {
                     let datas = results["data"];
                     let datapagination = results["pagination"];
                     this.employeeList = this.employeeList.concat(datas);
                     if (this.employeeList.length >= 0) {
                       this.has_nextaddpay = datapagination.has_next;
                       this.has_previousaddpay = datapagination.has_previous;
                       this.currentpageaddpay = datapagination.index;
                     }
                   })
               }
             }
           });
       }
     });
   }
  

}
