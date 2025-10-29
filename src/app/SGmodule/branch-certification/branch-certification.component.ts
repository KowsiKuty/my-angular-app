import { Component, OnInit,Output,EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators,FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { SGShareService } from './../share.service';
import { NotificationService } from 'src/app/service/notification.service';
import { SGService } from '../SG.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatDatepicker } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { MatAutocompleteSelectedEvent,MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';

// import { ToastrService } from 'ngx-toastr';
export interface branchList{
  id:number
  name:string
  code: string
}
export interface premiseList{
  id:number
  name:string
  code: string
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
    dateInput: 'MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-branch-certification',
  templateUrl: './branch-certification.component.html',
  styleUrls: ['./branch-certification.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class BranchCertificationComponent implements OnInit {
 //approval branch
 @ViewChild('appBranchInput') appBranchInput:any;
 @ViewChild('approvalBranch') matAutocompleteappbranch: MatAutocomplete;

   // Approver dropdown
  @ViewChild('ApproverContactInput') ApproverContactInput:any;
  @ViewChild('employee') matAutocompleteapprover: MatAutocomplete;

  @ViewChild('ApproverContactInput') clear_appBranch;

   // branch dropdown
  @ViewChild('branchContactInput') branchContactInput:any;
  @ViewChild('branchtype') matAutocompletebrach: MatAutocomplete;

  // Premise dropdown
  @ViewChild('PremiseContactInput') PremiseContactInput:any;
  @ViewChild('producttype') matAutocompletepremise: MatAutocomplete;

  @ViewChild('PremiseContactInput') clear_premises;
  
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
 

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  branchcert = [{ id: true, name: "YES" }, { id: false, name: "NO" }]
  // overtime:FormControl
  branchcertification:FormGroup
  guard_type:Array<any> = [];
  isLoading=false
  branchlist:any
  premiselistt:any
  count=0
  branchList: Array<approvalBranch>;
  employeeList: Array<approver>;
  dataEntryButton = true;
  isShowtable = false;
  Sovertime_no:boolean;
  Sovertime_yes:boolean;
  Aovertime_no:boolean;
  Aovertime_yes:boolean;

  constructor(private fb:FormBuilder,private tostar :ToastrService,private router:Router,private sgservice:SGService,private datepipe:DatePipe,
    private notification:NotificationService, private errorHandler: ErrorHandlingService, private SpinnerService: NgxSpinnerService,
    private toast:ToastrService,private shareservice:SGShareService ) { }


    monthdate = new FormControl(moment());

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.monthdate.value;
    ctrlValue.year(normalizedYear.year());
    this.monthdate.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.monthdate.value;
    ctrlValue.month(normalizedMonth.month());
    this.monthdate.setValue(ctrlValue);
    datepicker.close();
    this.branchcertification.patchValue({
      monthdate:this.monthdate.value
    })
    this.count=0
  }

  ngOnInit(): void {
    this.branchcertification=this.fb.group({
      monthdate: [''],
      month:['',Validators.required],
      year:['',Validators.required],
      premise_id:['',Validators.required],
      branch_id:[''],

      is_salary_credited:['',Validators.required],
      is_esi_esf_remitted:['',Validators.required],
      is_staisfied:['',Validators.required],
      // armed 
      is_overtime:[''],
      overtime:[''],
      overtime_reason:[''],
      is_sleeping:[''],
      is_leave:[''],
      // unarmed
      is_overtimeunarmed:[''],
      overtimeunarmed:[''],
      overtime_reasonunarmed:[''],
      is_sleepingunarmed:[''],
      is_leaveunarmed:[''],

      approval_branch:[''],
      approver:['',Validators.required],
      guard_type:new FormArray([
       this.guard()
      ]),
      })
    
    
  }
  guard() {
    let group = new FormGroup({
      overtime:new FormControl(''),
      // is_overtime:new FormControl(''),
      // is_sleeping:new FormControl(''),
      // overtime_reason:new FormControl(''),
      // is_leave:new FormControl('')
    })  
    return group
    
  }

//get Approval branch name & id
approver(data) {
  console.log("approver", data)
  this.branchcertification.patchValue({
    "approval_branch_name": data.branch_code +'-'+ data.branch_name,
    "approval_branch" : data.branch_id
  })
}

  createFormate(){
    let data=this.branchcertification.value
    let obj = new ctrlofztype();

       
    let month=this.datepipe.transform(data.monthdate,"M");
    let year=this.datepipe.transform(data.monthdate,"yyyy")

    obj.month=month;
    obj.year=year;
    obj.premise_id=data.premise_id.id;
    obj.branch_id=data.branch_id.id;
    obj.is_salary_credited=data.is_salary_credited;
    obj.is_esi_esf_remitted=data.is_esi_esf_remitted;
    obj.is_staisfied=data.is_staisfied;                          
    obj.approver = data.approver.id
    obj.approval_branch = data.approval_branch.id
    obj.guard_type=[
      {
        overtime:data.overtimeunarmed,
        is_overtime:data.is_overtimeunarmed,
        is_sleeping:data.is_sleepingunarmed,
        overtime_reason:data.overtime_reasonunarmed,
        is_leave:data.is_leaveunarmed,
        type: "Unarmed"
  
     },
      {
       overtime:data.overtime,
       is_overtime:data.is_overtime,
       is_sleeping:data.is_sleeping,
       overtime_reason:data.overtime_reason,
       is_leave:data.is_leave,
       type: "Armed"
    }
    
  ]
    
    return obj;
  }




  keyPressAlphanumeric(event)
  {
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9]/.test(inp)||event.keyCode==32  ) {
      return true;
    } else {
      event.preventDefault();
      this.toast.warning('', 'Don\'t Use Extra character ', { timeOut: 1500 });      
      return false;
      
    }
  }


  idValue:any
  BranchSubmitForm(){
   
    this.SpinnerService.show();
    if (this.branchcertification.value.is_salary_credited === ""){
      this.tostar.error('Please Enter Last Month Salary Credited');
      this.SpinnerService.hide();
      return false;
    }
    if (this.branchcertification.value.is_esi_esf_remitted === ""){
      this.tostar.error('Please Enter Last Month ESI/EPF Remitted');
      this.SpinnerService.hide();
      return false;
    }
    if (this.branchcertification.value.is_staisfied === ""){
      this.tostar.error('Please Enter Security Guard Operation is Satisfied');
      this.SpinnerService.hide();
      return false;
    } 
     if (this.branchcertification.value.approval_branch.id === undefined || this.branchcertification.value.approval_branch === ""){
      this.tostar.error('Add Approval Branch Field', 'Select Any one Approval Branch', { timeOut: 1500 });
      this.SpinnerService.hide();
      return false;
    }
    if (this.branchcertification.value.approver.id === undefined || this.branchcertification.value.approver === ""){
      this.tostar.error('Add Approver Field', 'Select Any one Approver', { timeOut: 1500 });
      this.SpinnerService.hide();
      return false;
    }
    if (this.branchcertification.value.overtime_reasonunarmed === "" && this.branchcertification.value.overtimeunarmed != 0 ){
      this.tostar.error('Please Enter Securityguard Reason');
      this.SpinnerService.hide();
      return false;
    }
    if (this.branchcertification.value.overtime_reason === "" && this.branchcertification.value.overtime != 0 ){
      this.tostar.error('Please Enter Armedguard Reason');
      this.SpinnerService.hide();
      return false;
    }

    if (this.branchcertification.value.overtimeunarmed == 0 ){
      this.branchcertification.value.overtime_reasonunarmed = null;
    }
    if (this.branchcertification.value.overtime == 0){
      this.branchcertification.value.overtime_reason = null;

    }

      if (this.idValue == undefined) {
      this.sgservice.BranchCertification(this.createFormate(),'')
        .subscribe(result => {
          if(result.id === undefined){
            this.notification.showError(result.description)
            this.SpinnerService.hide();
          }
          else {

            this.notification.showSuccess("Successfully created!...")
            this.SpinnerService.hide();
            // let json ={
            //   "id":result.id,
            //   "branch":this.branchRecord,
            //   "premise":this.premiseRecord,
            //   "month":this.createList.month,
            //   "year":this.createList.year
            // }
            // this.shareservice.branchData.next(json)
            // this.router.navigate(['SGmodule/branchview'], { skipLocationChange: true })
            let json = { 
              "status": 2,
            }
            let remarksJson = { 
              "remarks": null,
             }
             this.sgservice.movetoApprover(remarksJson,result.id, json)
               .subscribe(res => {
                 if (res.status == "success") {
                   this.notification.showSuccess("Moved to Approver!...")
                   this.SpinnerService.hide();
                 } else {
                   this.notification.showError(res.description)
                   this.SpinnerService.hide();
                 } 
                //  return true
                 this.onSubmit.emit();
               })

            // this.router.navigate(['SGmodule/securityguardpayment',1], { skipLocationChange: true })
          }
          this.idValue = result.id;
        },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
    } else {
      this.sgservice.employeecatCreateForm(this.branchcertification.value, this.idValue)
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            // this.submit=false
          }
          else {
            this.notification.showSuccess("Success...")
            this.router.navigate(['SGmodule/securityguardpayment',1], { skipLocationChange: true })
          }
        })
      }
  }

  onCancelClick(){
    // this.router.navigate(['SGmodule/securityguardpayment',1], { skipLocationChange: true })
    this.onCancel.emit();
  }
  branchname(){
    // let prokeyvalue: String = "";
    //   this.getbranchid(prokeyvalue);
    //   this.branchcertification.get('branch_id').valueChanges
    //     .pipe(
    //       debounceTime(100),
    //       distinctUntilChanged(),
    //       tap(() => {
    //         this.isLoading = true;
    //       }),
    //       switchMap(value => this.sgservice.getBranchLoadMore(value,1)
    //         .pipe(
    //           finalize(() => {
    //             this.isLoading = false
    //           }),
    //         )
    //       )
    //     )
    //     .subscribe((results: any[]) => {
    //       let datas = results["data"];
    //       this.branchlist = datas;
    //       console.log("branch", datas)

    //     })

    let a = this.branchContactInput.nativeElement.value
   this.sgservice.getBranchLoadMore(a, 1)
  //  .subscribe(x =>{
  //    console.log("dd value data", x)
  //  })
    .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;
      })


  }
  getbranchid()
  {
    this.sgservice.getBranchLoadMore("",1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;

      })
  }

  public displaydiss2(branchtype?: branchList): string | undefined {
    
    
    
    return branchtype ? "("+branchtype.code +" )"+branchtype.name : undefined;
    
  }
  branchRecord:any;
  premisesArray=[];
  branchFocusOut(data) {
    this.branchRecord = data
    this.premisesArray=[];
    let list = data.premise;
    for (let i = 0; i < list.length; i++) {
        let premise_id = list[i].id
        this.premisesArray.push(premise_id)
    }
    console.log("premisesArray",this.premisesArray )
    this.getpremiseid()
  }

  clearPremises() {
    this.clear_premises.nativeElement.value = '';

  }
  premisename(){
    // let prokeyvalue: String = "";
    //   this.getpremiseid(this.premisesArray,prokeyvalue);
    //   this.branchcertification.get('premise_id').valueChanges
    //     .pipe(
    //       debounceTime(100),
    //       distinctUntilChanged(),
    //       tap(() => {
    //         this.isLoading = true;
    //       }),
    //       switchMap(value => this.sgservice.getpremises(this.premisesArray,value,1)
    //         .pipe(
    //           finalize(() => {
    //             this.isLoading = false
    //           }),
    //         )
    //       )
    //     )
    //     .subscribe((results: any[]) => {
    //       let datas = results["data"];
    //       this.premiselistt = datas;
    //       console.log("product", datas)

    //     })
    let a = this.PremiseContactInput.nativeElement.value
    this.sgservice.getpremises(this.premisesArray,a, 1)
   //  .subscribe(x =>{
   //    console.log("dd value data", x)
   //  })
     .subscribe((results: any[]) => {
         let datas = results["data"];
         this.premiselistt = datas;
 
       })


  }
  getpremiseid()
  {
    this.sgservice.getpremises(this.premisesArray,"",1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.premiselistt = datas;

      })
  }

  public displaydiss1(producttype?: premiseList): string | undefined {
    
    
    
    return producttype ? "("+producttype.code +" )"+producttype.name : undefined;
    
  }

  premiseRecord:any;
  premiseFocusOut(data) {
    this.premiseRecord = data
  }

 //approval branch

 appBranchList:any
 approvalBranchClick() {
   let approvalbranchkeyvalue: String = "";
   this.getApprovalBranch(approvalbranchkeyvalue);
   this.branchcertification.get('approval_branch').valueChanges
     .pipe(
       debounceTime(100),
       distinctUntilChanged(),
       tap(() => {
         this.isLoading = true;
         console.log('inside tap')
 
       }),
       switchMap(value => this.sgservice.getBranchLoadMore(value,1)
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
   this.sgservice.getBranchLoadMore(approvalbranchkeyvalue,1)
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

  this.branchcertification.get('approver').valueChanges
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
  
createList:any;
  createFunctionForreport(){
    let data=this.branchcertification.value
    let obj = new ctrlofztype();
  
    let month =this.datepipe.transform(data.monthdate,"M");
    let year =this.datepipe.transform(data.monthdate,"yyyy")

    let MONTH = Number(month)
    let YEAR = Number(year)
    obj.month=MONTH;
    obj.year=YEAR;
    obj.premise_id=data.premise_id.id;
    obj.branch_id=data.branch_id.id;
    console.log("createList",obj)
    this.createList = obj
    return obj;
  }


  //  onClick data entry button
  onClickButton(){
    if (this.branchcertification.value.branch_id === ""){
      this.tostar.error('Add Branch Field', 'Select Any one Branch', { timeOut: 1500 });
      return false;
    }
    if (this.branchcertification.value.premise_id === ""){
      this.tostar.error('Add Site Field', 'Select Any one Site', { timeOut: 1500 });
      return false;
    }
    if (this.branchcertification.value.monthdate === ""){
      this.tostar.error('Add Month Field','Select month and year', { timeOut: 1500 });
      return false;
    }
    this.sgservice.onClickDataEntryButton(this.createFunctionForreport())
        .subscribe(result => {
          let data = result
          console.log("attendance_bc",data)
          if(data.attendance_approved == true){
          //sleep
          if(data.is_sleep_armed  == 0){
            this.branchcertification.value.is_sleeping = false
          }if(data.is_sleep_armed !=0 ){
            this.branchcertification.value.is_sleeping  = true
          }
          if(data.is_sleep_unarmed  == 0){
            this.branchcertification.value.is_sleepingunarmed  = false
          }if(data.is_sleep_unarmed !=0 ){
            this.branchcertification.value.is_sleepingunarmed = true
          }
          //leave
          if(data.leave_armed  == 0){
            this.branchcertification.value.is_leave  = false
          }if(data.leave_armed != 0){
            this.branchcertification.value.is_leave = true
          }
          if(data.leave_unarmed  == 0){
            this.branchcertification.value.is_leaveunarmed = false
          }if(data.leave_unarmed != 0){
            this.branchcertification.value.is_leaveunarmed = true
          }

          if(data.ot_armed != 0){
            this.branchcertification.value.is_overtime = true;
            this.Aovertime_no = false;
            this.Aovertime_yes= true;
            
          }else{
            this.branchcertification.value.is_overtime = false;
            this.Aovertime_no = true;
            this.Aovertime_yes= false;
           
          }


          if(data.ot_unarmed != 0){
            this.branchcertification.value.is_overtimeunarmed = true;
            this.Sovertime_no = false;
            this.Sovertime_yes= true;
           
          }else{
            this.branchcertification.value.is_overtimeunarmed = false;
            this.Sovertime_no = true;
            this.Sovertime_yes= false;
            
          }

          this.branchcertification.patchValue({
            is_overtime: this.branchcertification.value.is_overtime,
            is_overtimeunarmed: this.branchcertification.value.is_overtimeunarmed,
            overtime: data.ot_armed,
            overtimeunarmed: data.ot_unarmed,
            is_sleeping: this.branchcertification.value.is_sleeping,
            is_sleepingunarmed: this.branchcertification.value.is_sleepingunarmed,
            is_leave: this.branchcertification.value.is_leave,
            is_leaveunarmed: this.branchcertification.value.is_leaveunarmed
          })
          this.dataEntryButton = false
          this.isShowtable = true

        }else{
            this.notification.showError("You can not create Branch Certification before getting the Attendance Approval")
            this.dataEntryButton = true;
            this.isShowtable = false;
          }
        })
        
  }

  // Branch  dropdown

  currentpagebra:any=1
  has_nextbra:boolean=true
  has_previousbra:boolean=true
  autocompletebranchnameScroll() {
    
    setTimeout(() => {
      if (
        this.matAutocompletebrach &&
        this.autocompleteTrigger &&
        this.matAutocompletebrach.panel
      ) {
        fromEvent(this.matAutocompletebrach.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletebrach.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(()=> {
            const scrollTop = this.matAutocompletebrach.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletebrach.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletebrach.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbra === true) {
                this.sgservice.getBranchLoadMore(this.branchContactInput.nativeElement.value, this.currentpagebra+ 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchlist = this.branchlist.concat(datas);
                    if (this.branchlist.length >= 0) {
                      this.has_nextbra = datapagination.has_next;
                      this.has_previousbra = datapagination.has_previous;
                      this.currentpagebra = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  // Premies dropdown
  currentpagepre:any=1
  has_nextpre:boolean=true
  has_previouspre:boolean=true
  autocompletePremisenameScroll() {
    
    setTimeout(() => {
      if (
        this.matAutocompletepremise&&
        this.autocompleteTrigger &&
        this.matAutocompletepremise.panel
      ) {
        fromEvent(this.matAutocompletepremise.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletepremise.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(()=> {
            const scrollTop = this.matAutocompletepremise.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletepremise.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletepremise.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextpre=== true) {
                this.sgservice.getpremises(this.premisesArray,this.PremiseContactInput.nativeElement.value, this.currentpagepre + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.premiselistt = this.premiselistt.concat(datas);
                    if (this.premiselistt.length >= 0) {
                      this.has_nextpre = datapagination.has_next;
                      this.has_previouspre = datapagination.has_previous;
                      this.currentpagepre = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
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
                this.sgservice.getBranchLoadMore(this.appBranchInput.nativeElement.value, this.currentpageappbranch + 1)
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
class ctrlofztype{
  year:any
  month:any
  site:any
  is_salary_credited:any
  is_esi_esf_remitted:any
  is_staisfied:any
  guard_type:Array<any>
  premise_id:any
  type:number
  branch_id:any
  approval_branch: any;
  approver: any;
}
