import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { Router } from '@angular/router'
import { AtmaService } from '../atma.service'
import { ShareService } from '../share.service'
import { NotificationService } from '../notification.service'
import { ToastrService } from 'ngx-toastr';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
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
  dept_name: string;
  Activity_dep_id:string;

}
@Component({
  selector: 'app-activitydetail-edit',
  templateUrl: './activitydetail-edit.component.html',
  styleUrls: ['./activitydetail-edit.component.scss'],
  providers:[imp.Vendor]
})
export class ActivitydetailEditComponent implements OnInit {
  // ActivityDetailEditForm: FormGroup;
  // @Output() onCancel = new EventEmitter<any>();
  // readonly separatorKeysCodes = [ENTER, COMMA] as const;
  // @Output() onSubmit = new EventEmitter<any>();
  // activityId: number;
  // activityDetailEditId: number;
  // rasisorEmployeeList: Array<Raisor>;
  // employeeList: Array<Approver>;
  // data: any;
  // activityDetailEditButton = false;
  // has_next = true;
  // has_previous = true;
  // currentpage: number = 1;
  // public allEmployeeList: Department[];
  // public chipSelectedEmployee: Department[] = [];
  // public chipSelectedEmployeeid = [];
  // public chipRemovedEmployeeid = [];
  // public employeeControl = new FormControl();
  // isLoading = false;
  // @ViewChild('raisoremp') matAutocomplete: MatAutocomplete;
  // @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  // @ViewChild('employeeRaisorInput') employeeRaisorInput: any;
  // @ViewChild('employeeInput') employeeInput: any;
  // @ViewChild('approveremp') matappAutocomplete: MatAutocomplete;
  // @ViewChild('employeeApproverInput') employeeApproverInput: any;
  // depdata: any;
  // employeeIdValue: any[];
  // vendorURL=environment.apiURL
  // raiserfield:any = {label: "Raiser"}
  // approverfield:any = { label: "Approver"}
  // venservapi: any;
  // url1: string;

  constructor(private formBuilder: FormBuilder, private atmaService: AtmaService, private sharedService: ShareService,
    private notification: NotificationService, private toastr: ToastrService,private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService,
    private router: Router,private vendorpath: imp.Vendor) {
      // this.raiserfield = {
      //   label: "Raiser",
      //   method: "get",
      //   url: this.vendorURL + "usrserv/searchemployee",
      //   params: "",
      //   searchkey: "query",
      //   displaykey: "full_name",
      //   wholedata: true,
      //   required: true,
      // };
      // this.approverfield = {
      //   label: "Approver",
      //   method: "get",
      //   url: this.vendorURL + "usrserv/searchemployee",
      //   params: "",
      //   searchkey: "query",
      //   displaykey: "full_name",
      //   wholedata: true,
      //   required: true,
      // };
    }

  ngOnInit(): void {
    // let data = this.sharedService.activityView.value;
    // this.activityId = data
    // console.log("activityid", this.activityId)
    // this.ActivityDetailEditForm = this.formBuilder.group({
    //   // name: [{ value: "", disabled: isBoolean }],
    //   // name: [''],
    //   dept_name:[''],
    //   code: ['', Validators.required],
    //   detailname: ['', Validators.required],
    //   raisor: ['', Validators.required],
    //   approver: ['', Validators.required],
    //   remarks: [''],    
    //    dept_id:[''],
    //   Activity_dep_id:[null],chipinfo:['']
    // })

    // this.getActivityName();
    // this.getActivityDetailEdit();

    // this.ActivityDetailEditForm.get('dept_id?').valueChanges
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
  // raisoremployee(){
  //   let raisorkeyvalue: String = "";
  //   this.getRaisorEmployee(raisorkeyvalue);

  //   this.ActivityDetailEditForm.get('raisor').valueChanges
  //     .pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
  //         console.log('inside tap')

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
  //       console.log("raisor", datas)

  //     })
  // }
  // approveremployee(){
  //   let approverkeyvalue: String = "";
  //   this.getApproverEmployee(approverkeyvalue);

  //   this.ActivityDetailEditForm.get('approver').valueChanges
  //     .pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
  //         console.log('inside tap')

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
  //       console.log("approver", datas)

  //     })
  // }
  // public displayFnRaisor(raisoremp?: Raisor): string | undefined {
  //   console.log('id', raisoremp.id);
  //   console.log('name', raisoremp.full_name);
  //   return raisoremp ? raisoremp.full_name : undefined;
  // }

  // get raisoremp() {
  //   return this.ActivityDetailEditForm.get('raisor');
  // }

  // public displayFnApprover(approveremp?: Approver): string | undefined {
  //   console.log('id', approveremp.id);
  //   console.log('name', approveremp.full_name);
  //   return approveremp ? approveremp.full_name : undefined;
  // }

  // get approveremp() {
  //   return this.ActivityDetailEditForm.get('approver');
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
  // getActivityDetailEdit() {
  //   let data = this.sharedService.activityDetailEditForm.value;
  //   console.log("activitydetail===>", data)
  //   this.raiserfield = {
  //     label: "Raiser",
  //     method: "get",
  //     url: this.vendorURL + "usrserv/searchemployee",
  //     params: "",
  //     searchkey: "query",
  //     displaykey: "full_name",
  //     wholedata: true,
  //     required: true,
  //     defaultvalue:data.raisor
  //   };
  //   this.approverfield = {
  //     label: "Approver",
  //     method: "get",
  //     url: this.vendorURL + "usrserv/searchemployee",
  //     params: "",
  //     searchkey: "query",
  //     displaykey: "full_name",
  //     wholedata: true,
  //     required: true,
  //     defaultvalue:data.approver
  //   };
  //   this.activityDetailEditId = data.id;
  //   let Code = data.code;
  //   let Detailname = data.detailname;
  //   let Remarks = data.remarks;
  //   let Raisor = data.raisor;
  //   let Approver = data.approver;
  //   let dept_id=data?.dept_id;

  //   let Activity_dep_id=data.Activity_dep_id;
  //   this.chipSelectedEmployee=dept_id?.Activity_dep_id;
  //   console.log(this.chipSelectedEmployee)
  //   this.ActivityDetailEditForm.patchValue({
  //     "approver": Approver,
  //     "code": Code,
  //     "detailname": Detailname,
  //     "raisor": Raisor,
  //     "remarks": Remarks,
      
  //     'dept_id?':this.chipSelectedEmployee,
  //     "Activity_dep_id?":dept_id

  //   })
  //   console.log('this.ActivityDetailEditForm===>',this.ActivityDetailEditForm)

  // }


  // getActivityName(){
  //   this.data = this.sharedService.activityViewDetail.value;
  //   console.log("edit--",this.data)
  //   // let activityName = this.data.name
  //   let deptname = this.data.service_branch.name
  //   console.log("activityname", deptname)
  //   this.ActivityDetailEditForm.patchValue({
  //     // "name": activityName,
  //     "dept_name": deptname,

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


  // numberOnly(event): boolean {
  //   const charCode = (event.which) ? event.which : event.keyCode;
  //   if (charCode > 31 && (charCode < 48 || charCode > 57)) {
  //     return false;
  //   }
  //   return true;
  // }

  // createFormate() {
  //   let data = this.ActivityDetailEditForm.controls;
  //   let detailclass = new activityDetail();
  //   detailclass.raisor = data['raisor'].value.id;
  //   detailclass.approver = data['approver'].value.id;
  //   detailclass.code = data['code'].value;
  //   // detailclass.dept_id = data['dept_id'].value.id;
  //   // detailclass.Activity_dep_id = data['Activity_dep_id'].value;

  //   // detailclass.detailname = data['detailname'].value;
  //   // detailclass.remarks = data['remarks'].value;

  //   var str = data['detailname'].value
  //   var cleanStr_detilname=str.trim();//trim() returns string with outer spaces removed
  //   detailclass.detailname = cleanStr_detilname

  //   var str = data['remarks'].value
  //   var cleanStr_rmk=str.trim();//trim() returns string with outer spaces removed
  //   detailclass.remarks = cleanStr_rmk
  //   console.log("detailclass", detailclass)
  //   return detailclass;
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

  // submitForm() {
  //   this.SpinnerService.show();
  
  //     if (this.ActivityDetailEditForm.value.detailname === "") {
  //       this.toastr.error('Please Enter Activity Detail Name');
  //       this.SpinnerService.hide();
  //       return false;
  //     }
      // if (this.ActivityDetailEditForm.value.dept_id == ""||this.ActivityDetailEditForm.value.dept_id.id==undefined ||this.ActivityDetailEditForm.value.dept_id.id=="" ) {
      //   this.toastr.error(' Invalid Department ');
      //   this.SpinnerService.hide();
      //   return false;
      // }
      // if (this.ActivityDetailEditForm.value.raisor == "" ||this.ActivityDetailEditForm.value.raisor.id==undefined) {
      //   this.toastr.error('Invalid  Raisor Name');
      //   this.SpinnerService.hide();
      //   return false;
      // }
      // if (this.ActivityDetailEditForm.value.approver == ""||this.ActivityDetailEditForm.value.approver.id==undefined ) {
      //   this.toastr.error(' Invalid Approver Name');
      //   this.SpinnerService.hide();
      //   return false;
      // }
    
      // let raisorId = this.ActivityDetailEditForm.value.raisor.id
      // console.log("raisorid", raisorId)
      // let approverId = this.ActivityDetailEditForm.value.approver.id
      // console.log("approverid", approverId)
      // if(raisorId == approverId){
      //   this.notification.showWarning("Should not be same raisor and approver");
      //   this.SpinnerService.hide();
      //   return false

      // }

    //   let idValue = {
    //     "id": this.activityDetailEditId
    //   }
    //   let activityDetailEditJson = Object.assign({}, idValue, this.createFormate())
    //   this.venservapi=this.vendorpath.vendorser.venserv
    // this.url1=this.vendorURL+this.venservapi+'activity/'+this.activityId +'/supplieractivitydtl'
    
    // this.atmaService.CommonApiCall(this.url1,'post','body','',activityDetailEditJson)
    // .subscribe((result) => {
    //     console.log("res",result)
    //     if(result.id === undefined){
    //       this.notification.showError(result.description)
    //       this.SpinnerService.hide();
    //       return false;
    //     }
    //     else{
    //       this.notification.showSuccess("Updated Successfully!...")
    //       this.SpinnerService.hide();
    //       this.onSubmit.emit();
    //     }
    //   },
    //   error => {
    //     this.errorHandler.handleError(error);
    //     this.SpinnerService.hide();
    //   }
    //   )
      
    // this.atmaService.activityDetailEditForm(this.activityDetailEditId, this.activityId, this.createFormate())
    //   .subscribe((result) => {
    //     console.log("res",result)
    //     if(result.id === undefined){
    //       this.notification.showError(result.description)
    //       this.SpinnerService.hide();
    //       return false;
    //     }
    //     else{
    //       this.notification.showSuccess("Updated Successfully!...")
    //       this.SpinnerService.hide();
    //       this.onSubmit.emit();
    //     }
    //   },
    //   error => {
    //     this.errorHandler.handleError(error);
    //     this.SpinnerService.hide();
    //   }
    //   )
  
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
  //   let keyvalue: String = "";
  //   this.getempbranch(keyvalue);

  //   this.ActivityDetailEditForm.get('dept_id?').valueChanges
  //     .pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
         

  //       }),
  //       switchMap(value => this.atmaService.supplierbranch(value)
  //         .pipe(
  //           finalize(() => {
  //             this.isLoading = false
  //           }),
  //         )
  //       )
  //     )
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.depdata = datas;
       

  //     })
  // }

  // private getempbranch(approverkeyvalue) {
  //   this.atmaService.supplierbranch(approverkeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.depdata = datas;
  //     })
  // }

  // public displayFnDEp(DEp?: Department): string | undefined {
 
  //   // return DEp ? DEp.name : undefined;
  //   return DEp ? DEp.dept_name : undefined;

  // }

  // get DEp() {
  //   return this.ActivityDetailEditForm.get('dept_id');
  // }
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
  //   let foundEmployee1 = this.chipSelectedEmployee.filter(employee => employee.dept_name == employeeName);
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

//   raiserdata(e) {
//     console.log("event", e);
//     this.ActivityDetailEditForm.patchValue({
//       raisor: e,
//     });
//   }
//   approverdata(e) {
//     console.log("event", e);
//     this.ActivityDetailEditForm.patchValue({
//       approver: e,
//     });
//   }
}
// class activityDetail{
//   code:string;
//   detailname: string;
//   raisor: any;
//   approver: any;
//   remarks: string;
//   dept_id?:any;
//   Activity_dep_id:any;
//   chipinfo:any;
// }
