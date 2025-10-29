import { Component, OnInit,Output,EventEmitter,ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { SGShareService } from './../share.service';
import { NotificationService } from 'src/app/service/notification.service';
import { SGService } from '../SG.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize } from 'rxjs/operators';
import { MatDatepicker } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';

export interface approvalBranch {
  id: string;
  name: string;
}
export interface approver {
  id: string;
  full_name: string;
}


@Component({
  selector: 'app-branch-view',
  templateUrl: './branch-view.component.html',
  styleUrls: ['./branch-view.component.scss']
})
export class BranchViewComponent implements OnInit {
  // salarycredit:any
  // esf:any
  // guardtype:any
  // overtime:any
  // status:any
  // headerbtn:boolean;
  // checkerbtn:boolean;
  // month:any
  // year:any
  // premiseid:any
  // branchid:any
   //approval branch
   @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
   @ViewChild('branchInput') branchInput: any;
 
   //approver
   @ViewChild('employee') matemployeeAutocomplete: MatAutocomplete;
   @ViewChild('employeeInput') employeeInput: any;
 
 
   @Output() onCancel = new EventEmitter<any>();
   @Output() onSubmit = new EventEmitter<any>();
   branchcert = [{ id: true, name: "YES" }, { id: false, name: "NO" }]
   branchcertification: FormGroup
   guard_type: Array<any> = [];
   isLoading = false
   branchlist: any
   premiselistt: any
   count = 0
   branchList: Array<approvalBranch>;
   employeeList: Array<approver>;
   leaveunarmed: any;
   sleepingunarmed: any;
   isOvertimeunarmed: any;
   overtimeunarmed: any;
   overtimereasonunarmed: any;
   typeunarmed: any;
   unarmedId: any;
   leave: any;
   sleeping: any;
   isOvertime: any;
   overtime: any;
   overtimereason: any;
   type: any;
   armedId: any;
   branchView: any;
   premise_Name: any;
   branch_Name: any;
   historyData: any;
   branchDetails: any;
   moveToApproverForm:FormGroup;
   ApproverForm:FormGroup;
   rejectForm:FormGroup;
   reviewForm:FormGroup;
   branchCerSingleGet_Id: any;

  constructor(private fb: FormBuilder, private tostar: ToastrService, private router: Router, private sgshareservice: SGShareService,
    private sgservice: SGService, private datepipe: DatePipe,
    private notification: NotificationService) { }

  ngOnInit(): void {
    this.branchcertification = this.fb.group({
      id: [''],
      monthdate: [''],
      month: [''],
      year: [''],
      premise_id: [''],
      branch_id: [''],
      premise_id1: [''],
      branch_id1: [''],

      is_salary_credited: [''],
      is_esi_esf_remitted: [''],
      is_staisfied: [''],
      // armed 
      is_overtime: [''],
      overtime: [''],
      overtime_reason: [''],
      is_sleeping: [''],
      is_leave: [''],
      is_armedId: [''],
      // unarmed
      is_overtimeunarmed: [''],
      overtimeunarmed: [''],
      overtime_reasonunarmed: [''],
      is_sleepingunarmed: [''],
      is_leaveunarmed: [''],
      is_unarmedId: [''],
      // approval_branch_name: [''],
      approval_branch: [''],
      approver: [''],
      
    })

    
    this.moveToApproverForm = this.fb.group({
      remarks: ['']
    })
    this.ApproverForm = this.fb.group({
      remarks: ['']
    })
    this.rejectForm = this.fb.group({
      remarks: ['']
    })
    this.reviewForm = this.fb.group({
      remarks: ['']
    })
    let data=this.sgshareservice.branchData.value
    this.branchDetails = data
    this.branchCerSingleGet_Id = this.branchDetails?.id
    console.log("branchdetails",data)
    this.premise_Name = "("+data.premise.code + ") "+data.premise.name
    this.branch_Name = "("+data.branch.code + ") "+data.branch.name
    this.getbranchView();
  }


  getbranchView(){
    this.sgservice.getbranchView(this.branchDetails)
    .subscribe((result)=>{
      let datas = result['data'];
      this.branchView = datas[0]
      console.log("branchView", this.branchView)
      this.getBranchEditForm(this.branchView);
      this.approvalFlow();
    })

  }

  // patchvalue
  getBranchEditForm(branchView) {
    let data = branchView;
    let mon_year = data.month + '-' + data.year
    console.log("mon_year", mon_year)

    for (let i = 0; i < data.guard_type.length; i++) {
      // unarmed
      this.leaveunarmed = data.guard_type[0].is_leave
      this.sleepingunarmed = data.guard_type[0].is_sleeping
      this.isOvertimeunarmed = data.guard_type[0].is_overtime
      this.overtimeunarmed = data.guard_type[0].overtime
      this.overtimereasonunarmed = data.guard_type[0].overtime_reason
      this.typeunarmed = data.guard_type[0].type.name
      this.unarmedId = data.guard_type[0].id
      // armed
      this.leave = data.guard_type[1].is_leave
      this.sleeping = data.guard_type[1].is_sleeping
      this.isOvertime = data.guard_type[1].is_overtime
      this.overtime = data.guard_type[1].overtime
      this.overtimereason = data.guard_type[1].overtime_reason
      this.type = data.guard_type[1].type.name
      this.armedId = data.guard_type[1].id

    }

    this.branchcertification.patchValue({
      premise_id: this.premise_Name,
      branch_id: this.branch_Name,
      monthdate: mon_year,
      is_salary_credited: data.is_salary_credited,
      is_esi_esf_remitted: data.is_esi_esf_remitted,
      is_staisfied: data.is_staisfied,
      approval_branch:'('+data.approver.branch_code+ ') ' + data.approver.branch_name,
      // approval_branch: data.approval_branch.id,
      approver:data.approver.name,

      // unarmed
      is_overtimeunarmed: this.isOvertimeunarmed,
      overtimeunarmed: this.overtimeunarmed,
      overtime_reasonunarmed: this.overtimereasonunarmed,
      is_sleepingunarmed: this.sleepingunarmed,
      is_leaveunarmed: this.leaveunarmed,
      is_unarmedId: this.unarmedId,
      // armed 
      is_overtime: this.isOvertime,
      overtime: this.overtime,
      overtime_reason: this.overtimereason,
      is_sleeping: this.sleeping,
      is_leave: this.leave,
      is_armedId: this.armedId,

    })
  }


  //approval Flow summary
  
  approvalFlow() {
    let branchGet_id = this.branchView?.id
    this.sgservice.getIdentificationHistory(branchGet_id)
      .subscribe(result => {
        console.log("approvalFlow", result)
        this.historyData = result.data;
      })
  }

  //update Button 
  updateButton() {
  this.sgshareservice.brachEditValue.next(this.branchView);
  this.sgshareservice.premisesName.next(this.premise_Name);
  this.sgshareservice.brachName.next(this.branch_Name);
  this.router.navigate(['SGmodule/branchcertifyedit'], { skipLocationChange: true })
}


backTobranchSummary(){
  if(this.sgshareservice.key.value  == "BC tab"){
    this.router.navigate(['SGmodule/invoiceView'], { skipLocationChange: true })
  } else {
    // this.router.navigate(['SGmodule/securityguardpayment',1], { skipLocationChange: true })
    this.onCancel.emit()
  }
  
}





// submit to checker button 
  year: any;
  month: any;
  branchId: any;
  moveToApproverPopupForm(){
    
    // this.month = this.branchDetails?.month
    // this.year = this.branchDetails?.year
    // let premiseId = this.branchDetails?.premise.id
    // this.branchId = this.branchDetails?.branch.id

    let json = { 
     "status": 2,
    //  "branch_id": this.branchId,
    //  "month": this.month,
    //  "year": this.year,
    }
    this.sgservice.movetoApprover(this.moveToApproverForm.value,this.branchCerSingleGet_Id, json)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Moved to Approver!...")
          this.getbranchView();
        } else {
          this.notification.showError(res.description)
        } 
        return true
      })

  }

  // approver button 
  ApproverPopupForm(){
    // this.month = this.branchDetails?.month
    // this.year = this.branchDetails?.year
    // let premiseId = this.branchDetails?.premise.id
    // this.branchId = this.branchDetails?.branch.id
    
    let json = { 
      "status": 3,
      // "branch_id": this.branchId,
      // "month": this.month,
      // "year": this.year,
     }
    this.sgservice.approver(this.ApproverForm.value, this.branchCerSingleGet_Id, json)
    .subscribe(res => {
      if (res.status == "success") {
        this.notification.showSuccess("Approved Successfully!...")
        this.getbranchView();
      } else {
        this.notification.showError(res.description)
      } 
      return true
    })

  }

  // reject button 
  rejectPopupForm(){
    // this.month = this.branchDetails?.month
    // this.year = this.branchDetails?.year
    // let premiseId = this.branchDetails?.premise.id
    // this.branchId = this.branchDetails?.branch.id
    
    let json = { 
      "status": 0,
      // "branch_id": this.branchId,
      // "month": this.month,
      // "year": this.year,
     }
    this.sgservice.reject(this.rejectForm.value,this.branchCerSingleGet_Id, json)
    .subscribe(res => {
      if (res.status == "success") {
        // this.notification.showSuccess("Rejected!...")
        // BUG ID:7112
        this.notification.showSuccess("Returned!...")
        this.getbranchView();
      } else {
        this.notification.showError(res.description)
      } 
      return true
    })

  }


  // reject button 
  reviewPopupForm(){
    // this.month = this.branchDetails?.month
    // this.year = this.branchDetails?.year
    // let premiseId = this.branchDetails?.premise.id
    // this.branchId = this.branchDetails?.branch.id
    
    let json = { 
      "status": 4,
      // "branch_id": this.branchId,
      // "month": this.month,
      // "year": this.year,
     }
    this.sgservice.review(this.reviewForm.value,this.branchCerSingleGet_Id, json)
    .subscribe(res => {
      if (res.status == "success") {
        this.notification.showSuccess("updated!...")
        this.getbranchView();
      } else {
        this.notification.showError(res.description)
      } 
      return true
    })

  }





 //approval branch drop down
 approvalBranch() {
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
      switchMap(value => this.sgservice.getbranchdropdown(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.branchList = datas;

    })

}

private getApprovalBranch(approvalbranchkeyvalue) {
  this.sgservice.getbranchdropdown(approvalbranchkeyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.branchList = datas;
    })
}

public displayFnbranch(branch?: approvalBranch): string | undefined {
  return branch ? branch.name : undefined;
}

get branch() {
  return this.branchcertification.value.get('approval_branch');
}


//approver drop down
approvername() {
  let approverkeyvalue: String = "";
  this.getApprover(approverkeyvalue);

  this.branchcertification.get('approver').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.sgservice.getEmployeeFilter(value, 1)
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

private getApprover(approverkeyvalue) {
  this.sgservice.getEmployeeFilter(approverkeyvalue, 1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.employeeList = datas;
    })
}

public displayFnEmployee(employee?: approver): string | undefined {
  return employee ? employee.full_name : undefined;
}

get employee() {
  return this.branchcertification.value.get('approver');
}


















  // movetochecker() {
  //   // {"month":8,"year":2021,"status"2,"branch_id":1}
  //   // let identificationid = this.premiseData?.id
  //   let json = {"month":this.month,"year":this.year,"status":2,"branch_id":this.branchid,"remarks":"okkk"}
  //   this.sgservice.branchstatus(json,this.premiseid)
  //     .subscribe(res => {
  //       if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
  //         this.notification.showError("INVALID_DATA!...")
  //       } if (res.status == "success") {
  //         this.notification.showSuccess("Moved to Checker!...")
  //         // this.getPremiseView();
  //       }
  //       return true
  //     })
  // }
  // movetoapprover() {
  //   // let identificationid = this.premiseData?.id
  //   let json = {"month":this.month,"year":this.year,"status":3,"branch_id":this.branchid,"remarks":"okkk"}
  //   // let json = { "status": 3,}
  //   this.sgservice.branchstatus(json,this.premiseid)
  //     .subscribe(res => {
  //       if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
  //         this.notification.showError("INVALID_DATA!...")
  //       } if (res.status == "success") {
  //         this.notification.showSuccess("Approved!...")
         
  //       }
  //       return true
  //     })
  // }

  // branchviewdata(){
  //   let data=this.shareservice.branchData.value
  //   this.salarycredit=data.is_salary_credited
  //   this.esf=data.is_esi_esf_remitted
  //   // this.guardtype=data.guard_type.guard_type.name
  //   // console.log("guardtype",this.guardtype)
  //   this.overtime=data.guard_type.is_overtime
  //   this.status=data.approval_status
  //   this.month=data.month
  //   this.year=data.year
  //   this.premiseid=data.premise_id
  //   this.branchid=data.branch_id
    
  // }

}
