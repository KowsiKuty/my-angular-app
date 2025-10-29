import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RemsRoutingModule } from './rems-routing.module';
import { RemsMasterComponent } from './rems-master/rems-master.component';
import { RemsSummaryComponent } from './rems-summary/rems-summary.component';
import { LeaseSummaryComponent } from './lease-summary/lease-summary.component';
import { LandlordCreateComponent } from './landlord-create/landlord-create.component';
import { LandlordEditComponent } from './landlord-edit/landlord-edit.component';
import { PremiseCreateComponent } from './premise-create/premise-create.component';
import { PremiseViewComponent } from './premise-view/premise-view.component';
import { PremiseEditComponent } from './premise-edit/premise-edit.component';
import { OccupancyComponent } from './occupancy/occupancy.component';
import { OccupancyEditComponent } from './occupancy-edit/occupancy-edit.component';
import { InsurancetypeCreateComponent } from './insurancetype-create/insurancetype-create.component';
import { InsurancetypeEditComponent } from './insurancetype-edit/insurancetype-edit.component';
import { InsuranceDetailCreateComponent } from './insurance-detail-create/insurance-detail-create.component';
import { InsuranceDetailEditComponent } from './insurance-detail-edit/insurance-detail-edit.component';
import { LicensetypeComponent } from './licensetype/licensetype.component';
import { LicensetypeEditComponent } from './licensetype-edit/licensetype-edit.component';
import { LicensedetailsComponent } from './licensedetails/licensedetails.component';
import { LicensedetailsEditComponent } from './licensedetails-edit/licensedetails-edit.component';
import { LandlordViewComponent } from './landlord-view/landlord-view.component';
import { AmentiesComponent } from './amenties/amenties.component';
import { EbDetailsCreateComponent } from './eb-details-create/eb-details-create.component';
import { EbDetailsEditComponent } from './eb-details-edit/eb-details-edit.component';
import { RepairAndMaintenanceCreateComponent } from './repair-and-maintenance-create/repair-and-maintenance-create.component';
import { RepairAndMaintenanceEditComponent } from './repair-and-maintenance-edit/repair-and-maintenance-edit.component';
import { LegaldataComponent } from './legaldata/legaldata.component';
import { TaxComponent } from './tax/tax.component';
import { TaxRateComponent } from './tax-rate/tax-rate.component';
import { LeaseAgreementComponent } from './lease-agreement/lease-agreement.component';
import { AgreementViewComponent } from './agreement-view/agreement-view.component';
import { RentFormComponent } from './rent-form/rent-form.component';
import { LegalClearanceComponent } from './legal-clearance/legal-clearance.component';
import { RentArrearFormComponent } from './rent-arrear-form/rent-arrear-form.component';
import { RentTermFormComponent } from './rent-term-form/rent-term-form.component';
import { StatutoryTypeComponent } from './statutory-type/statutory-type.component';
import { LegalNoticeFormComponent } from './legal-notice-form/legal-notice-form.component';
import { BankAccountTypeComponent } from './bank-account-type/bank-account-type.component';
import { RenovationFormComponent } from './renovation-form/renovation-form.component';
import { OccupancyViewComponent } from './occupancy-view/occupancy-view.component';
import { PremiseOccupancyMappingFormComponent } from './premise-occupancy-mapping-form/premise-occupancy-mapping-form.component';
import { PremiseDetailsFormComponent } from './premise-details-form/premise-details-form.component';
import { PremiseDetailsViewComponent } from './premise-details-view/premise-details-view.component';
// import { PremiseBrokerDetailsFormComponent } from './premise-broker-details-form/premise-broker-details-form.component'
import { DocumentFormComponent } from './document-form/document-form.component';
import { LandlordbankComponent } from './landlordbank/landlordbank.component';
import { PremiseIdentificationFormComponent } from './premise-identification-form/premise-identification-form.component';
import { PremiseIdentificationSummaryComponent } from './premise-identification-summary/premise-identification-summary.component';
import { StatutoryFormComponent } from './statutory-form/statutory-form.component';
import { PremiseIdentificationViewComponent } from './premise-identification-view/premise-identification-view.component';
// import { PremiseDocumentInfoComponent } from './premise-document-info/premise-document-info.component';
import { RemslayoutComponent } from './remslayout/remslayout.component';
import { ModificationSummaryComponent } from './modification-summary/modification-summary.component';
import { DetailsRMComponent } from './details-rm/details-rm.component';
import { RentScheduleLeasedComponent } from './rent-schedule-leased/rent-schedule-leased.component';
import { ScheduleViewComponent } from './schedule-view/schedule-view.component';
import { OwnedscheduleViewComponent } from './ownedschedule-view/ownedschedule-view.component';
import { OwnedArrearsFormComponent } from './owned-arrears-form/owned-arrears-form.component';
import { RecurringFormComponent } from './recurring-form/recurring-form.component';
import { GrnComponent } from './grn/grn.component';
import { GrnCreateComponent } from './grn-create/grn-create.component';
import { GrnViewComponent } from './grn-view/grn-view.component';
import { ModificationChangesComponent } from './modification-changes/modification-changes.component';
import { PremisedocinfoViewComponent } from './premisedocinfo-view/premisedocinfo-view.component';
import { RentConfirmationComponent } from './rent-confirmation/rent-confirmation.component';
import { PaymentdetailsFormComponent } from './paymentdetails-form/paymentdetails-form.component';
import { ExpenseDetailsComponent } from './expense-details/expense-details.component';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { RemstemplateComponent } from './remstemplate/remstemplate.component';
import { ApprovedIdentificationComponent } from './approved-identification/approved-identification.component';
import { ScheduleApprovalComponent } from './schedule-approval/schedule-approval.component';
import { RaiseRequestComponent } from './raise-request/raise-request.component';
import { AddRaiserequestComponent } from './add-raiserequest/add-raiserequest.component';
import { RaisereqViewComponent } from './raisereq-view/raisereq-view.component';
import { ScheduleApprovalViewComponent } from './schedule-approval-view/schedule-approval-view.component';
import { RemsanalysisComponent } from './remsanalysis/remsanalysis.component';
import { OccupancyccbsComponent } from './occupancyccbs/occupancyccbs.component';
import { ScheduleoverallComponent } from './scheduleoverall/scheduleoverall.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { DatePipe } from '@angular/common';
import { ProvisionReportComponent } from './provision-report/provision-report.component';
import { LeaseReportComponent } from './lease-report/lease-report.component';


@NgModule({

  declarations: [
    PremiseCreateComponent, PremiseViewComponent, PremiseEditComponent,
    OccupancyComponent, OccupancyEditComponent,
    RemsMasterComponent, RemsSummaryComponent,
    LandlordViewComponent, AmentiesComponent,
    LeaseSummaryComponent,
    LandlordCreateComponent, LandlordEditComponent,
    InsurancetypeCreateComponent,
    InsurancetypeEditComponent, InsuranceDetailCreateComponent,
    InsuranceDetailEditComponent, LicensetypeComponent,
    LicensetypeEditComponent, LicensedetailsComponent,
    LicensedetailsEditComponent,
    EbDetailsCreateComponent, EbDetailsEditComponent,
    RepairAndMaintenanceCreateComponent, RepairAndMaintenanceEditComponent, LegaldataComponent,
    TaxComponent, TaxRateComponent, LeaseAgreementComponent, AgreementViewComponent,
    RentFormComponent, LegalClearanceComponent,
    RentArrearFormComponent, RentTermFormComponent, StatutoryTypeComponent, LegalNoticeFormComponent, BankAccountTypeComponent, RenovationFormComponent, OccupancyViewComponent, 
    RentArrearFormComponent, RentTermFormComponent, StatutoryTypeComponent,
    LegalNoticeFormComponent, BankAccountTypeComponent, RenovationFormComponent, PremiseDetailsFormComponent, 
    PremiseDetailsViewComponent,
    //  PremiseBrokerDetailsFormComponent,
      PremiseOccupancyMappingFormComponent
    , RentTermFormComponent, StatutoryTypeComponent,
    LegalNoticeFormComponent, BankAccountTypeComponent, RenovationFormComponent, PremiseDetailsFormComponent, 
    PremiseDetailsViewComponent,
    //  PremiseBrokerDetailsFormComponent,
      DocumentFormComponent,
     LandlordbankComponent,
     PremiseIdentificationFormComponent,
     PremiseIdentificationSummaryComponent,
     StatutoryFormComponent, 
     PremiseIdentificationViewComponent,
    //  PremiseDocumentInfoComponent,
     RemslayoutComponent,
     ModificationSummaryComponent,
     DetailsRMComponent,
     RentScheduleLeasedComponent,
     ScheduleViewComponent,
     OwnedscheduleViewComponent,
     OwnedArrearsFormComponent,
     RecurringFormComponent,
     GrnComponent,
     GrnCreateComponent,
     GrnViewComponent,
     ModificationChangesComponent,
     PremisedocinfoViewComponent,
     RentConfirmationComponent,
     PaymentdetailsFormComponent, 
     ExpenseDetailsComponent, 
     InvoiceDetailsComponent, RemstemplateComponent, 
     ApprovedIdentificationComponent, ScheduleApprovalComponent, 
     RaiseRequestComponent, AddRaiserequestComponent, RaisereqViewComponent,  
     ScheduleApprovalViewComponent, RemsanalysisComponent, OccupancyccbsComponent, ScheduleoverallComponent, ProvisionReportComponent, LeaseReportComponent,  

  ],
  providers: [DatePipe],
  imports: [
    ToastrModule.forRoot(),
    // BrowserAnimationsModule,  
    RemsRoutingModule,SharedModule,MaterialModule
  ],

})
export class RemsModule { }