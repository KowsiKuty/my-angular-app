import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { SGShareService } from './../share.service';
import { NotificationService } from 'src/app/service/notification.service';
import { SGService } from '../SG.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, map, takeUntil } from 'rxjs/operators';
import { MatDatepicker } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
import { fromEvent } from 'rxjs';

export interface approvalBranch {
  id: string;
  name: string;
  code: string; 
}
export interface approver {
  id: string;
  name: string;
  code: string;
  full_name: string;
}

@Component({
  selector: 'app-branch-certify-edit',
  templateUrl: './branch-certify-edit.component.html',
  styleUrls: ['./branch-certify-edit.component.scss']
})
export class BranchCertifyEditComponent implements OnInit {
  //approval branch
  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;

  //approver
  @ViewChild('employee') matemployeeAutocomplete: MatAutocomplete;
  @ViewChild('employeeInput') employeeInput: any;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
    //approval branch
    @ViewChild('appBranchInput') appBranchInput:any;
    @ViewChild('approvalBranch') matAutocompleteappbranch: MatAutocomplete;

    @ViewChild('ApproverContactInput') ApproverContactInput:any;
    @ViewChild('employee') matAutocompleteapprover: MatAutocomplete;
    @ViewChild('ApproverContactInput') clear_appBranch;


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
  basedOnUpdate: boolean

  constructor(private fb: FormBuilder, private tostar: ToastrService, private router: Router, private sgshareservice: SGShareService,
    private sgservice: SGService, private datepipe: DatePipe, private errorHandler: ErrorHandlingService, private SpinnerService: NgxSpinnerService,
    private notification: NotificationService, private toast:ToastrService) { }

  ngOnInit(): void {
    this.branchcertification = this.fb.group({
      id: [''],
      monthdate: [''],
      month: ['', Validators.required],
      year: ['', Validators.required],
      premise_id: ['', Validators.required],
      branch_id: [''],
      premise_id1: [''],
      branch_id1: [''],

      is_salary_credited: ['', Validators.required],
      is_esi_esf_remitted: ['', Validators.required],
      is_staisfied: ['', Validators.required],
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

      // approval_branch: [''],
      approval_branch: [''],
      approver: ['', Validators.required],
      guard_type: new FormArray([
        this.guard()
      ]),
    })



    this.getBranchEditForm();
  }


  approval_branchId:any;
  // patchvalue
  getBranchEditForm() {
    let data = this.sgshareservice.brachEditValue.value;
    let premise_Name = this.sgshareservice.premisesName.value;
    let branch_Name = this.sgshareservice.brachName.value;

    let mon_year = data.month + '-' + data.year
    console.log("mon_year", mon_year)
     this.approval_branchId = data.approval_branch.id


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

    console.log("----------------------------------------------->", data)

    if( data.ismaker == true && (data.approval_status.id == 1 || data.approval_status.id == 2)   ){
      this.basedOnUpdate = false 
    }
    else{this.basedOnUpdate == true }

    this.branchcertification.patchValue({
      id: data.id,
      premise_id: premise_Name,
      branch_id: branch_Name,
      premise_id1: data.premise_id,
      branch_id1: data.branch_id,
      monthdate: mon_year,
      month: data.month,
      year: data.year,
      is_salary_credited: data.is_salary_credited,
      is_esi_esf_remitted: data.is_esi_esf_remitted,
      is_staisfied: data.is_staisfied,
      // approval_branch:'('+data.approver.branch_code+ ') ' + data.approver.branch_name,
      approval_branch: data.approval_branch,
      approver:data.approver,

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
    this.appBranch_Id = data.approval_branch.id
  }


  guard() {
    let group = new FormGroup({
      overtime: new FormControl(''),
    })
    return group

  }

  //get Approval branch name & id
approver(data) {
  console.log("approver", data)
  this.branchcertification.patchValue({
    "approval_branch": data.branch_code +'-'+ data.branch_name,
    // "approval_branch" : data.branch_id
  })
}


  createFormate() {
    let data = this.branchcertification.value
    let obj = new ctrlofztype();  
    obj.id = data.id;
    obj.month = data.month;
    obj.year = data.year;
    obj.premise_id = data.premise_id1;
    obj.branch_id = data.branch_id1;

    obj.is_salary_credited = data.is_salary_credited;
    obj.is_esi_esf_remitted = data.is_esi_esf_remitted;
    obj.is_staisfied = data.is_staisfied;
    obj.approver = data.approver.id
    obj.approval_branch = data.approval_branch.id
    obj.guard_type = [
      {
        overtime: data.overtimeunarmed,
        is_overtime: data.is_overtimeunarmed,
        is_sleeping: data.is_sleepingunarmed,
        overtime_reason: data.overtime_reasonunarmed,
        is_leave: data.is_leaveunarmed,
        id: data.is_unarmedId,
        type: "Unarmed"

      },
      {
        overtime: data.overtime,
        is_overtime: data.is_overtime,
        is_sleeping: data.is_sleeping,
        overtime_reason: data.overtime_reason,
        is_leave: data.is_leave,
        id: data.is_armedId,
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




  // branch Certification updation
  BranchSubmitForm() {
    let dataForm = this.branchcertification.value
    if( dataForm.approval_branch == null || dataForm.approval_branch == undefined || dataForm.approval_branch == ""    ){
      this.notification.showWarning("Please fill Employee Branch")
      return false 

    }
    if( dataForm.approver == null || dataForm.approver == undefined || dataForm.approver == ""    ){
      this.notification.showWarning("Please fill Approver")
      return false 

    }
    this.SpinnerService.show();
    let dataset = this.createFormate()
    this.sgservice.BranchCertificationUpdate(dataset)
      .subscribe(result => {
        if (result.id === undefined) {
          this.notification.showError(result.description)
          this.SpinnerService.hide();
        }
        else {
          this.notification.showSuccess("Successfully updated!...")
          this.SpinnerService.hide();
          // this.router.navigate(['SGmodule/branchview'], { skipLocationChange: true })
          this.onSubmit.emit();
        }
      },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  onCancelClick() {
    // this.router.navigate(['SGmodule/branchview'], { skipLocationChange: true })
    this.onCancel.emit();
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
    return employee ? employee.name : undefined;
  }

  get employee() {
    return this.branchcertification.value.get('approver');
  }


  appBranch_Id=0;
  public displayFnEmployeeApprover(employee?: approver): string | undefined {
    console.log("employeee---->", employee )
    let empname = employee?.name
    let emp_fullname = employee?.full_name
    let nameOrFullname: any
    console.log("a value emp", empname)
    console.log("b value emp", emp_fullname)
    if( emp_fullname  == undefined ){
      nameOrFullname = employee.name
    }
    else{
      nameOrFullname = emp_fullname
    }
  return employee ? nameOrFullname : undefined;
  }


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
  clearAppBranch() {
    this.clear_appBranch.nativeElement.value = '';
    this.branchcertification.controls['approver'].reset('')
  }


  public displayFnappBranch(branch?: approvalBranch): string | undefined {
    
    return branch ? "("+branch.code +" )"+branch.name : undefined;
  }


  
  FocusApprovalBranch(data) {
    console.log("appbranch",data)
    this.appBranch_Id = data.id;
    console.log("id", this.appBranch_Id)
    this.getApprover(data.id, '')
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


class ctrlofztype {
  year: any
  month: any
  site: any
  is_salary_credited: any
  is_esi_esf_remitted: any
  is_staisfied: any
  guard_type: Array<any>
  premise_id: any
  type: number
  branch_id: any
  approval_branch: any;
  approver: any;
  id: any;
  is_armedId: any;
  is_unarmedId: any;
}
