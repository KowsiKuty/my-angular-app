
// import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
// import { SpinnerComponent } from './spinner/spinner.component';
// import { SpinnerService } from '../app/spinner/spinner.service';
// import { NgxSummernoteModule } from 'ngx-summernote';
// import { NgxSpinnerModule } from "ngx-spinner";
// import { MatDialogModule } from '@angular/material/dialog';
import { DtpcRoutingModule } from './dtpc-routing.module';
// import { LosSummaryComponent } from './los-summary/los-summary.component';
import { LosComponent } from './los/los.component';
// import { LosBranchSummaryComponent } from './los-branch-summary/los-branch-summary.component';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { MatInputModule } from '@angular/material/input';
// import { MatIconModule } from '@angular/material/icon';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
// import { MatNativeDateModule } from '@angular/material/core';
import { CreateLosComponent, DialogApplicationDetails } from './create-los/create-los.component';
import { LosDetailsComponent } from './los-details/los-details.component';
// import { MatSelectModule } from '@angular/material/select'
import { CreateLoanchargetypeComponent } from './create-loanchargetype/create-loanchargetype.component';
// import { LosInvoiceSummaryComponent } from './los-invoice-summary/los-invoice-summary.component';
// import { LosInvoiceApprovalComponent } from './los-invoice-approval/los-invoice-approval.component';
import { LosApproveRejectScreenComponent,DialogAppDetails } from './los-approve-reject-screen/los-approve-reject-screen.component';
import { LosInvoiceApprovalViewComponent,DialogDetails } from './los-invoice-approval-view/los-invoice-approval-view.component'
import { BrowserModule } from '@angular/platform-browser'
// import {MatSlideToggleModule} from '@angular/material/slide-toggle';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatTabsModule } from '@angular/material/tabs';
import { LosBranchDetailsComponent } from './los-branch-details/los-branch-details.component';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { ApptodecimalDirective } from './apptodecimal.directive';
import { DialogAppDetailsComponent } from './los-approve-reject-screen/dialog-app-details/dialog-app-details.component';
import { LosLogSummaryComponent } from './los-log-summary/los-log-summary.component';
import { LosAppPushComponent } from './los-app-push/los-app-push.component';

@NgModule({
  declarations: [ LosComponent,
    CreateLosComponent, DialogApplicationDetails, LosDetailsComponent, CreateLoanchargetypeComponent,
    // LosSummaryComponent, LosBranchSummaryComponent,LosInvoiceSummaryComponent,
    // LosInvoiceApprovalComponent,
    LosInvoiceApprovalViewComponent,DialogDetails,LosApproveRejectScreenComponent,DialogAppDetails, LosBranchDetailsComponent, ApptodecimalDirective, DialogAppDetailsComponent, LosLogSummaryComponent, LosAppPushComponent
    ],
  imports: [
    DtpcRoutingModule,SharedModule,MaterialModule
  ],
  // entryComponents: [DialogApplicationDetails],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // providers: [DialogApplicationDetails],
  // bootstrap:[DialogApplicationDetails],
})
export class DtpcModule { }
