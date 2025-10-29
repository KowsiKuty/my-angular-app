// import { Component, OnInit } from '@angular/core';
// import { RemsService } from '../rems.service';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';
// import { NotificationService } from '../notification.service';
// import { Router } from '@angular/router'
// import { RemsShareService } from '../rems-share.service'

// @Component({
//   selector: 'app-premise-broker-details-form',
//   templateUrl: './premise-broker-details-form.component.html',
//   styleUrls: ['./premise-broker-details-form.component.scss']
// })
// export class PremiseBrokerDetailsFormComponent implements OnInit {

//   brokerDetailsForm: FormGroup;
//   amentiesList: any;
//   idValue: any;
//   premiseId: any;
//   premiseDetailsId: any;
//   constructor(private fb: FormBuilder, private router: Router,
//     private remsshareService: RemsShareService,
//     private remsService: RemsService, private toastr:
//       ToastrService, private notification: NotificationService, ) { }

//   ngOnInit(): void {
//     this.brokerDetailsForm = this.fb.group({
//       name: ['', Validators.required],
//       email_id: ['', [Validators.required, Validators.email,
//       Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
//       mobile: ['', Validators.required],
//       brokerage_amount: ['', Validators.required],
//     })
//     this.getEditBrokerDetails();

//   }

//   getEditBrokerDetails() {
//     let data: any = this.remsshareService.brokerDetailsForm.value
//     this.idValue = data.id;
//     this.premiseDetailsId = data.premiseDetailsId;
//     if (data === '') {
//       this.brokerDetailsForm.patchValue({
//         name: '',
//         email_id: '',
//         brokerage_amount: '',
//         mobile: ''
//       })
//     } else {
//       this.brokerDetailsForm.patchValue({
//         name: data.name,
//         email_id: data.email_id,
//         brokerage_amount: data.brokerage_amount,
//         mobile: data.mobile
//       })
//     }
//   }

//   brokerDetailsFormCreate() {
//     if (this.brokerDetailsForm.value.name === undefined) {
//       this.toastr.warning('', 'Please Enter Name', { timeOut: 1500 });
//       return false;
//     } else if (this.brokerDetailsForm.value.email_id === undefined) {
//       this.toastr.warning('', 'Please Enter E-Mail', { timeOut: 1500 });
//       return false;
//     } else if (this.brokerDetailsForm.value.mobile === undefined) {
//       this.toastr.warning('', 'Please Enter Mobile Number', { timeOut: 1500 });
//       return false;
//     } else if (this.brokerDetailsForm.value.mobile.trim().length < 10) {
//       this.toastr.warning('', 'Please Enter Mobile Number 10 Digit', { timeOut: 1500 });
//       return false;
//     }
//     else if (this.brokerDetailsForm.value.brokerage_amount === undefined) {
//       this.toastr.warning('', 'Please Enter Brokerage Amount', { timeOut: 1500 });
//       return false;
//     }else if (this.brokerDetailsForm.value.brokerage_amount === undefined) {
//       this.toastr.warning('', 'Please Enter Number Only..', { timeOut: 1500 });
//       return false;
//     }
//     if (this.idValue == undefined) {
//       this.remsService.brokerDetailsForm(this.brokerDetailsForm.value, '', this.premiseDetailsId)
//         .subscribe(result => {
//           console.log(">.premiseDetailsViewpremiseDetailsViewpremiseDetailsView", result)
//           if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
//             this.notification.showError("Duplicate! INVALID_DATA! ...")
//           } else if (result.code === "INVALID_ARREARS_ID" && result.description === "INVALID_ARREARS_ID") {
//             this.notification.showError("Empty Field Not Allow... ")
//           } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
//             this.notification.showError("Valid Mail Id..")
//           }
//           else {
//             this.notification.showSuccess("Successfully created!...")
//             this.router.navigate(['/premiseDetailsView'], { queryParams: { status: "broker_Details" }, skipLocationChange: true });
//           }
//           this.idValue = result.id;
//         })
//     } else {
//       this.remsService.brokerDetailsForm(this.brokerDetailsForm.value, this.idValue, this.premiseDetailsId)
//         .subscribe(result => {
//           console.log(">.premiseDetail........", result)
//           if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
//             this.notification.showError("Duplicate! INVALID_DATA! ...")
//           } else if (result.code === "INVALID_ARREARS_ID" && result.description === "INVALID_ARREARS_ID") {
//             this.notification.showError("Empty Field Not Allow... ")
//           } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
//             this.notification.showError("Valid Mail Id..")
//           }
//           else {
//             this.notification.showSuccess("Successfully Updates!...")
//             this.router.navigate(['/premiseDetailsView'], { queryParams: { status: "broker_Details" }, skipLocationChange: true });
//           }
//         })
//     }
//   }

//   onCancelClick() {
//     this.router.navigate(['/premiseDetailsView'], { queryParams: { status: "broker_Details" }, skipLocationChange: true });

//   }
//   numberOnly(event): boolean {
//     const charCode = (event.which) ? event.which : event.keyCode;
//     if (charCode > 31 && (charCode < 48 || charCode > 57)) {
//       return false;
//     }
//     return true;
//   }

// }
