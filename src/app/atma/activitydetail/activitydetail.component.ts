import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from, fromEvent } from 'rxjs';
import { Router } from '@angular/router'
import { AtmaService } from '../atma.service'
import { ShareService } from '../share.service'
import { NotificationService } from '../notification.service'
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips'
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { environment } from 'src/environments/environment';
import * as imp from 'src/app/AppAutoEngine/import-services/CommonimportFiles';


// export interface Raisor {
//   id: string;
//   full_name: string;
// }
// export interface Approver {
//   id: string;
//   full_name: string;
// }
export interface Department {
  id: string;
  // name: string;
  dept_name:string  //7108
}
@Component({
  selector: 'app-activitydetail',
  templateUrl: './activitydetail.component.html',
  styleUrls: ['./activitydetail.component.scss'],
  providers:[imp.Vendor]
})
export class ActivitydetailComponent implements OnInit {
  // @Output() onCancel = new EventEmitter<any>();
  // @Output() onSubmit = new EventEmitter<any>();
  // ActivityDetailAddForm: FormGroup;
  // activityId: number;
  // rasisorEmployeeList: Array<Raisor>;
  // employeeList: Array<Approver>;
  // data: any;
  // activityDetailButton = false;
  // has_next = true;
  // has_previous = true;
  // currentpage: number = 1;
  // addOnBlur = true;
  // readonly separatorKeysCodes = [ENTER, COMMA] as const;
  // isLoading = false;
  // @ViewChild('raisoremp') matAutocomplete: MatAutocomplete;
  // @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  // @ViewChild('employeeRaisorInput') employeeRaisorInput: any;
  // @ViewChild('employeeInput') employeeInput: any;

  // @ViewChild('approveremp') matappAutocomplete: MatAutocomplete;
  // @ViewChild('employeeApproverInput') employeeApproverInput: any;
  // depdata:any;
  // employeeIdValue: any[];
  // vendorURL=environment.apiURL
  // raiserfield:any
  // approverfield:any
  // venservapi: any;
  // url1: string;
  constructor(private formBuilder: FormBuilder, private atmaService: AtmaService, private sharedService: ShareService,
    private notification: NotificationService, private toastr: ToastrService,private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService,
    private router: Router,private vendorpath: imp.Vendor,) { 
  //     this.raiserfield = {
  //       label: "Raiser",
  //       method: "get",
  //       url: this.vendorURL + "usrserv/searchemployee",
  //       params: "",
  //       searchkey: "query",
  //       displaykey: "full_name",
  //       wholedata: true,
  //       required: true,
  //     };
  //     this.approverfield = {
  //       label: "Approver",
  //       method: "get",
  //       url: this.vendorURL + "usrserv/searchemployee",
  //       params: "",
  //       searchkey: "query",
  //       displaykey: "full_name",
  //       wholedata: true,
  //       required: true,
  //     };
      
  //   }
  //   public allEmployeeList: Department[];
  //   public chipSelectedEmployee: Department[] = [];
  //   public chipSelectedEmployeeid = [];
  //   public chipRemovedEmployeeid = [];
  //   public employeeControl = new FormControl();
  //   newdeparray=new FormControl();
  // ngOnInit(): void {
  //   let data = this.sharedService.activityView.value;
  //   this.activityId = data
  //   this.ActivityDetailAddForm = this.formBuilder.group({
      // name: [{ value: "", disabled: isBoolean }],
      // name: [''],
    //   dept_name:[''], //7108
    //   code: [''],
    //   detailname: ['',Validators.required, Validators.pattern('^[a-zA-Z \-\']+')],
    //   raisor: ['', Validators.required],
    //   approver: ['', Validators.required],
    //   remarks: [''],
    //   dept_id:[new FormControl()],
    //   Activity_dep_id:[null],
    //   chipinfo:['']
    // })
    // this.depget();
    // this.getActivityName();
    // let keyvalue: String = "";
    // this.getempbranch(keyvalue);

    // this.ActivityDetailAddForm.get('dept_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
         

    //     }),
    //     switchMap(value => this.atmaService.supplierbranch(value)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.depdata = datas;
       

    //   })

  }
  ngOnInit(): void {
  
  }

  // raisoremployee(){
  //   let raisorkeyvalue: String = "";
  //   this.getRaisorEmployee(raisorkeyvalue);

  //   this.ActivityDetailAddForm.get('raisor').valueChanges
  //     .pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
          

  //       }),
  //       switchMap(value => this.atmaService.get_EmployeeName(value,1)
  //         .pipe(
  //           finalize(() => {
  //             this.isLoading = false
  //           }),
  //         )
  //       )
  //     )
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.rasisorEmployeeList = datas;
        

  //     })
  // }
  // approveremployee(){
  //   let approverkeyvalue: String = "";
  //   this.getApproverEmployee(approverkeyvalue);

  //   this.ActivityDetailAddForm.get('approver').valueChanges
  //     .pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
         

  //       }),
  //       switchMap(value => this.atmaService.get_EmployeeName(value,1)
  //         .pipe(
  //           finalize(() => {
  //             this.isLoading = false
  //           }),
  //         )
  //       )
  //     )
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.employeeList = datas;
       

  //     })

  // }
  // public displayFnRaisor(raisor?: Raisor): string | undefined {
 
  //   return raisor ? raisor.full_name : undefined;
  // }

  // get raisor() {
  //   return this.ActivityDetailAddForm.get('raisor');
  // }

  // public displayFnApprover(approver?: Approver): string | undefined {
    
  //   return approver ? approver.full_name : undefined;
  // }

  // get approver() {
  //   return this.ActivityDetailAddForm.get('approver');
  // }


  // getActivityName() {
  //   this.data = this.sharedService.activityViewDetail.value;
    
  //   let deptname = this.data.service_branch.name
  //   // let activityName = this.data.name
    
  //   this.ActivityDetailAddForm.patchValue({
  //     // "name": activityName,
  //     "dept_name": deptname,  //7108

  //   });
  // }

  // private getRaisorEmployee(raisorkeyvalue) {
  //   this.atmaService.getEmployeeSearchFilter(raisorkeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.rasisorEmployeeList = datas;
  //     })
  // }

  // private getApproverEmployee(approverkeyvalue) {
  //   this.atmaService.getEmployeeSearchFilter(approverkeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.employeeList = datas;
  //     })
  // }
  // autocompleteRaisorScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matAutocomplete &&
  //       this.autocompleteTrigger &&
  //       this.matAutocomplete.panel
  //     ) {
  //       fromEvent(this.matAutocomplete.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.matAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.matAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.atmaService.get_EmployeeName(this.employeeRaisorInput.nativeElement.value, this.currentpage + 1)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.rasisorEmployeeList = this.rasisorEmployeeList.concat(datas);
  //                   if (this.rasisorEmployeeList.length >= 0) {
  //                     this.has_next = datapagination.has_next;
  //                     this.has_previous = datapagination.has_previous;
  //                     this.currentpage = datapagination.index;
  //                   }
  //                 })
  //             }
  //           }
  //         });
  //     }
  //   });
  // }

  // autocompleteApproverScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matappAutocomplete &&
  //       this.autocompleteTrigger &&
  //       this.matappAutocomplete.panel
  //     ) {
  //       fromEvent(this.matappAutocomplete.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.matappAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.matappAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matappAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matappAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.atmaService.get_EmployeeName(this.employeeApproverInput.nativeElement.value, this.currentpage + 1)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.employeeList = this.employeeList.concat(datas);
  //                   if (this.employeeList.length >= 0) {
  //                     this.has_next = datapagination.has_next;
  //                     this.has_previous = datapagination.has_previous;
  //                     this.currentpage = datapagination.index;
  //                   }
  //                 })
  //             }
  //           }
  //         });
  //     }
  //   });
  // }
  // keyPressAlphaNumeric(event) {

  //   var inp = String.fromCharCode(event.keyCode);
  
  //   if (/[a-zA-Z]/.test(inp)) {
  //     return true;
  //   } else {
  //     event.preventDefault();
  //     return false;
  //   }
  // }
  // createFormate() {
  //   let data = this.ActivityDetailAddForm.controls;
  //   let detailclass = new activityDetail();
  //   detailclass.raisor = data['raisor'].value.id;
  //   detailclass.approver = data['approver'].value.id;
  //   detailclass.code = data['code'].value;
    // detailclass.dept_id = this.chipSelectedEmployeeid;
    // detailclass.Activity_dep_id = data['Activity_dep_id'].value;
    // detailclass.chipinfo = this.chipSelectedEmployeeid;


  //   var str = data['detailname'].value
  //   var cleanStr_detilname=str.trim();//trim() returns string with outer spaces removed
  //   detailclass.detailname = cleanStr_detilname

  //   var str = data['remarks'].value
  //   var cleanStr_rmk=str.trim();//trim() returns string with outer spaces removed
  //   detailclass.remarks = cleanStr_rmk

  //   return detailclass;
  // }

  // submitForm() {
  //   this.SpinnerService.show();
  

  //     if (this.ActivityDetailAddForm.value.detailname === "") {
  //       this.toastr.error('Please Enter Activity Detail Name');
  //       this.SpinnerService.hide();
  //       return false;
  //     }
  //     if (this.ActivityDetailAddForm.value.raisor == "" ||this.ActivityDetailAddForm.value.raisor.id==undefined) {
  //       this.toastr.error('Invalid  Raisor Name');
  //       this.SpinnerService.hide();
  //       return false;
  //     }
  //     if (this.ActivityDetailAddForm.value.approver == ""||this.ActivityDetailAddForm.value.approver.id==undefined ) {
  //       this.toastr.error(' Invalid Approver Name');
  //       this.SpinnerService.hide();
  //       return false;
  //     }
  //     // if (this.ActivityDetailAddForm.value.dept_id == ""||this.ActivityDetailAddForm.value.dept_id.id==undefined ) {
  //     //   this.toastr.error(' Invalid Department ');
  //     //   this.SpinnerService.hide();
  //     //   return false;
  //     // }
  //     // if (this.ActivityDetailAddForm.value.remarks === "") {
  //     //   this.toastr.error('Please Enter Remarks');
  //     //   this.activityDetailButton = false;
  //     //   return false;
  //     // }
     
  //     let raisorId = this.ActivityDetailAddForm.value.raisor.id
  //     let approverId = this.ActivityDetailAddForm.value.approver.id
  //     if(raisorId == approverId){
  //       this.notification.showWarning("Should not be same raisor and approver");
  //       this.SpinnerService.hide();
  //       return false

  //     }

  //     this.venservapi=this.vendorpath.vendorser.venserv
  //     this.url1=this.vendorURL+this.venservapi+'activity/'+this.activityId +'/supplieractivitydtl'
      
  //     this.atmaService.CommonApiCall(this.url1,'post','body','',this.createFormate())
  //     .subscribe(result => {
  //       if(result.id === undefined){
  //         this.notification.showError(result.description)
  //         this.SpinnerService.hide();
  //         return false;
  //       }
  //       else{
  //         this.notification.showSuccess("Saved Successfully!...")
  //         this.SpinnerService.hide();
  //         this.onSubmit.emit();
  //       }
      
  //     },
  //     error => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     }
  //     )

  //   // this.atmaService.activityDetailCreateForm(this.activityId, this.createFormate())
  //   //   .subscribe(result => {
  //   //     if(result.id === undefined){
  //   //       this.notification.showError(result.description)
  //   //       this.SpinnerService.hide();
  //   //       return false;
  //   //     }
  //   //     else{
  //   //       this.notification.showSuccess("Saved Successfully!...")
  //   //       this.SpinnerService.hide();
  //   //       this.onSubmit.emit();
  //   //     }
      
  //   //   },
  //   //   error => {
  //   //     this.errorHandler.handleError(error);
  //   //     this.SpinnerService.hide();
  //   //   }
  //   //   )
    

  // }
  // onCancelClick() {
  //   this.onCancel.emit()
  // }
  // namevalidation(event){
    
  //   var inp = String.fromCharCode(event.keyCode);

  //   if (/[a-zA-Z0-9-/  ]/.test(inp)) {
  //     return true;
  //   } else {
  //     event.preventDefault();
  //     return false;
  //   }
  // }

  // addressvalidation(event){
    
  //   var inp = String.fromCharCode(event.keyCode);

  //   if (/[a-zA-Z0-9-_#@.', /&]/.test(inp)) {
  //     return true;
  //   } else {
  //     event.preventDefault();
  //     return false;
  //   }
  // }
  // depget(){
   
  // }

  // private getempbranch(query) {
  //   this.atmaService.supplierbranch(query)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.depdata = datas;
  //     })
  // }

  // public displayFnDEp(DEp?: Department): string | undefined {
 
  //   // return DEp ? DEp.name : undefined;
  //   return DEp ? DEp.dept_name : undefined;  //7108

  // }

  // get DEp() {
  //   return this.ActivityDetailAddForm.get('dept_id');
  // }
// 
// public removeEmployee(employee: Department): void {
//   const index = this.chipSelectedEmployee.indexOf(employee);

//   this.chipRemovedEmployeeid.push(employee.id)
//   // console.log('this.chipRemovedEmployeeid', this.chipRemovedEmployeeid);
//   // console.log(employee.id)

//   this.chipSelectedEmployee.splice(index, 1);
//   // console.log(this.chipSelectedEmployee);
//   this.chipSelectedEmployeeid.splice(index, 1);
//   // console.log(this.chipSelectedEmployeeid);
//   return;
// }


// public employeeSelected(event: MatAutocompleteSelectedEvent): void {
//   // console.log('employeeSelected', event.option.value.full_name);
//   this.selectEmployeeByName(event.option.value.name);
//   this.employeeInput.nativeElement.value = '';
// }
// private selectEmployeeByName(employeeName) {
//   // let foundEmployee1 = this.chipSelectedEmployee.filter(employee => employee.name == employeeName);
//   let foundEmployee1 = this.chipSelectedEmployee.filter(employee => employee.dept_name == employeeName);  //7108
//   if (foundEmployee1.length) {
//     // console.log('found in chips');
//     return;
//   }
//   let foundEmployee = this.depdata.filter(employee => employee.name == employeeName);
//   if (foundEmployee.length) {
//     // We found the employeecc name in the allEmployeeList list
//     // console.log('founde', foundEmployee[0].id);
//     this.chipSelectedEmployee.push(foundEmployee[0]);
//     this.chipSelectedEmployeeid.push(foundEmployee[0].id)
//     // console.log(this.chipSelectedEmployeeid);
//     this.employeeIdValue = this.chipSelectedEmployeeid;

//   }
// }

// raiserdata(e) {
//   console.log("event", e);
//   this.ActivityDetailAddForm.patchValue({
//     raisor: e,
//   });
// }
// approverdata(e) {
//   console.log("event", e);
//   this.ActivityDetailAddForm.patchValue({
//     approver: e,
//   });
// }
// // 
// }
// class activityDetail{
//   detailname: string;
//   raisor: any;
//   approver: any;
//   remarks: string;
//   code:string;
//   dept_id:any;
//   Activity_dep_id:any;
//   chipinfo:any;
  
// }
}