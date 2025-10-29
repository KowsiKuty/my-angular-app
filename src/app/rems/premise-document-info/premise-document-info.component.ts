// import { Component, OnInit, ViewChild } from '@angular/core';
// import { RemsShareService } from '../rems-share.service'
// import { RemsService } from '../rems.service';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';
// import { NotificationService } from '../notification.service';
// import { Router } from '@angular/router'
// import { fromEvent } from 'rxjs';
// import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
// import { debounceTime, distinctUntilChanged, tap, map, takeUntil, switchMap, finalize } from 'rxjs/operators';
// import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
// import { formatDate, DatePipe } from '@angular/common';
// import { Rems2Service } from '../rems2.service'

// export const PICK_FORMATS = {
//   parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
//   display: {
//     dateInput: 'input',
//     monthYearLabel: { year: 'numeric', month: 'short' },
//     dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
//     monthYearA11yLabel: { year: 'numeric', month: 'long' }
//   }
// };
// class PickDateAdapter extends NativeDateAdapter {
//   format(date: Date, displayFormat: Object): string {
//     if (displayFormat === 'input') {
//       return formatDate(date, 'dd-MMM-yyyy', this.locale);
//     } else {
//       return date.toDateString();
//     }
//   }
// }
// @Component({
//   selector: 'app-premise-document-info',
//   templateUrl: './premise-document-info.component.html',
//   styleUrls: ['./premise-document-info.component.scss'],
//   providers: [
//     { provide: DateAdapter, useClass: PickDateAdapter },
//     { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
//     DatePipe
//   ]
// })
// export class PremiseDocumentInfoComponent implements OnInit {
//   @ViewChild('autoPrimary') matAutocompleteDept: MatAutocomplete;
//   @ViewChild('primaryContactInput') primaryContactInput: any;
//   @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
//   premiseDocInfoForm: FormGroup
//   primaryContactList: any;
//   isLoading = false;
//   has_next = true;
//   has_previous = true;
//   currentpage: number = 1;
//   documentTypeData: any;
//   images: any;
//   premiseIdentification: number;
//   idValue: number;
//   constructor(private remsService: RemsService, private fb: FormBuilder, private toastr: ToastrService,
//     private datePipe: DatePipe, private notification: NotificationService, private router: Router,
//     private shareService: RemsShareService, private remsService2: Rems2Service
//   ) { }

//   ngOnInit(): void {
//     this.premiseDocInfoForm = this.fb.group({
//       doctype: ['', Validators.required,],
//       initiation_date: ['', Validators.required],
//       approved_by: ['', Validators.required],
//       remarks: ['', Validators.required],
//       images: []

//     })
//     let primaykey: String = "";
//     this.primaryContact(primaykey);
//     this.premiseDocInfoForm.get('approved_by').valueChanges
//       .pipe(
//         debounceTime(100),
//         distinctUntilChanged(),
//         tap(() => {
//           this.isLoading = true;
//         }),
//         switchMap(value => this.remsService.primaryContact(value)
//           .pipe(
//             finalize(() => {
//               this.isLoading = false
//             }),
//           )
//         )
//       )
//       .subscribe((results: any[]) => {
//         let datas = results["data"];
//         this.primaryContactList = datas;
//       })
//     this.getDocumentEdit();
//     this.getDocumentType();

//   }

//   autocompletePrimaryScroll() {
//     setTimeout(() => {
//       if (
//         this.matAutocompleteDept &&
//         this.autocompleteTrigger &&
//         this.matAutocompleteDept.panel
//       ) {
//         fromEvent(this.matAutocompleteDept.panel.nativeElement, 'scroll')
//           .pipe(
//             map(x => this.matAutocompleteDept.panel.nativeElement.scrollTop),
//             takeUntil(this.autocompleteTrigger.panelClosingActions)
//           )
//           .subscribe(x => {
//             const scrollTop = this.matAutocompleteDept.panel.nativeElement.scrollTop;
//             const scrollHeight = this.matAutocompleteDept.panel.nativeElement.scrollHeight;
//             const elementHeight = this.matAutocompleteDept.panel.nativeElement.clientHeight;
//             const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
//             if (atBottom) {
//               if (this.has_next === true) {
//                 this.remsService.primaryContacts(this.primaryContactInput.nativeElement.value, this.currentpage + 1, 'all')
//                   .subscribe((results: any[]) => {
//                     let datas = results["data"];
//                     let datapagination = results["pagination"];
//                     this.primaryContactList = this.primaryContactList.concat(datas);
//                     if (this.primaryContactList.length >= 0) {
//                       this.has_next = datapagination.has_next;
//                       this.has_previous = datapagination.has_previous;
//                       this.currentpage = datapagination.index;
//                     }
//                   })
//               }
//             }
//           });
//       }
//     });
//   }

//   public displayFn(primary?: PrimaryContact): string | undefined {
//     return primary ? primary.full_name : undefined;
//   }

//   get primary() {
//     return this.premiseDocInfoForm.get('approved_by');
//   }

//   private primaryContact(primaykey) {
//     this.remsService.primaryContact(primaykey)
//       .subscribe((results) => {
//         let datas = results["data"];
//         this.primaryContactList = datas;
//       })
//   }


//   getDocumentEdit() {
//     let data: any = this.shareService.premiseDocuInfo.value
//     this.premiseIdentification = data.premisesIdentification;
//     this.idValue = data.id;
//     if (data === '') {
//       this.premiseDocInfoForm.patchValue({
//         doctype: '',
//         initiation_date: '',
//         approved_by: '',
//         remarks: '',

//       })
//     } else {
//       this.premiseDocInfoForm.patchValue({
//         remarks: data.remarks,
//         initiation_date: data.initiation_date,
//         approved_by: data.approved_by,
//         doctype: data.doctype?.id,

//       })
//     }
//   }


//   premiseDocInfoCreate() {
//     if (this.premiseDocInfoForm.value.doctype === "") {
//       this.toastr.warning('', 'Please Enter Document Type', { timeOut: 1500 });
//       return false;
//     } if (this.premiseDocInfoForm.value.initiation_date === "") {
//       this.toastr.warning('', 'Select Date', { timeOut: 1500 });
//       return false;
//     } if (this.premiseDocInfoForm.value.remarks === "") {
//       this.toastr.warning('', 'Please Enter Remarks', { timeOut: 1500 });
//       return false;
//     }  if (this.premiseDocInfoForm.value.approved_by === "") {
//       this.toastr.warning('', 'Please Enter Approved', { timeOut: 1500 });
//       return false;
//     }    if (this.premiseDocInfoForm.value.images === "" || this.premiseDocInfoForm.value.images === null || this.premiseDocInfoForm.value.images === undefined) {
//       this.toastr.warning('', 'Choose Upload Files ', { timeOut: 1500 });
//       return false;
//     }

//     const Date = this.premiseDocInfoForm.value;
//     Date.initiation_date = this.datePipe.transform(Date.initiation_date, 'yyyy-MM-dd');
//     if (this.idValue == undefined) {
//       this.remsService2.premiseDocInfoForm(this.premiseDocInfoForm.value, '', this.images, this.premiseIdentification)
//         .subscribe(result => {
//           if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
//             this.notification.showError("Duplicate! [INVALID_DATA! ...]")
//           }
//           else {
//             this.notification.showSuccess("Successfully created!...")
//           }
//           this.idValue = result.id;
//         })
//     } else {
//       this.remsService2.premiseDocInfoForm(this.premiseDocInfoForm.value, this.idValue, this.images, this.premiseIdentification)
//         .subscribe(result => {
//           if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
//             this.notification.showError("Duplicate! [INVALID_DATA! ...]")
//           }
//           else {
//             this.notification.showSuccess("Successfully Updated!...")
//           }
//         })
//     }
//   }
//   onFileSelected(e) {
//     this.images = e.target.files;
//   }
//   onCancel() {
//   }
//   getDocumentType() {
//     this.remsService2.getDocumentType()
//       .subscribe(result => {
//         let data = result.data;
//         this.documentTypeData = data;
//       })
//   }
// }

// export interface PrimaryContact {
//   id: number;
//   full_name: string;
// }