
import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { CommonModule } from '@angular/common';
// import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { NgxSpinnerModule } from "ngx-spinner"; 
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { SGRoutingModule } from './SG-routing.module';
import { SgProvisionComponent } from './sg-provision/sg-provision.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { SgmsterComponent } from './../SGmodule/sgmster/sgmster.component';
import { EmployeecatmasterComponent } from './../SGmodule/employeecatmaster/employeecatmaster.component';
import { EmployeetypemasterComponent } from './../SGmodule/employeetypemaster/employeetypemaster.component';
import { MinwagesmasterComponent } from './../SGmodule/minwagesmaster/minwagesmaster.component';
import { StatezonemasterComponent } from './../SGmodule/statezonemaster/statezonemaster.component';
import { VendermarkupmasterComponent } from './../SGmodule/vendermarkupmaster/vendermarkupmaster.component';
import { SecurityloginComponent } from './securitylogin/securitylogin.component';
import { HolidaymasterComponent } from './holidaymaster/holidaymaster.component';
import { SecurityguardpaymentComponent } from './securityguardpayment/securityguardpayment.component';
import { AttendenceDetailsComponent } from './attendence-details/attendence-details.component';
import { BranchCertificationComponent } from './branch-certification/branch-certification.component';
import { BranchcertSummaryComponent } from './branchcert-summary/branchcert-summary.component';
import { BranchViewComponent } from './branch-view/branch-view.component';
import { AttendancedetailsComponent } from './attendancedetails/attendancedetails.component';
import { VendormarkupComponent } from './vendormarkup/vendormarkup.component';
import { MinimumwagesComponent } from './minimumwages/minimumwages.component';
import { PaymentfreezereportComponent } from './paymentfreezereport/paymentfreezereport.component';
import { BranchCertifyEditComponent } from './branch-certify-edit/branch-certify-edit.component';
import { InvoiceSummaryComponent } from './invoice-summary/invoice-summary.component';
import { AddInvoiceComponent } from './add-invoice/add-invoice.component';
import { InvoiceUpdateComponent } from './invoice-update/invoice-update.component';
import { InvoiceViewComponent } from './invoice-view/invoice-view.component';
import { PenaltyFormComponent } from './penalty-form/penalty-form.component';
import { HolidayUpdateComponent } from './holiday-update/holiday-update.component';
import { SGAdminComponent } from './sgadmin/sgadmin.component';
import { MonthlySchedulerComponent } from './monthly-scheduler/monthly-scheduler.component';


@NgModule({
  declarations: [

    SgmsterComponent,
    EmployeecatmasterComponent,
    EmployeetypemasterComponent,
    MinwagesmasterComponent,
    StatezonemasterComponent,
    VendermarkupmasterComponent,
    SecurityloginComponent,
    HolidaymasterComponent  ,
    SecurityguardpaymentComponent,
    AttendenceDetailsComponent,
    BranchCertificationComponent,
    BranchcertSummaryComponent,
    BranchViewComponent,
    AttendancedetailsComponent,
    VendormarkupComponent,
    MinimumwagesComponent,
    PaymentfreezereportComponent,
    BranchCertifyEditComponent,
    InvoiceSummaryComponent,
    AddInvoiceComponent,
    InvoiceUpdateComponent,
    InvoiceViewComponent,
    PenaltyFormComponent,
    SgProvisionComponent,
    HolidayUpdateComponent,
    SGAdminComponent,
    MonthlySchedulerComponent
  ],
  
  imports: [  
    // BrowserAnimationsModule,
    NgbModule,
    // AppModule.forRoot(),
    ScrollingModule,
    SGRoutingModule,
    SharedModule,
    MaterialModule
     
  ]
})
export class SGModule { }
