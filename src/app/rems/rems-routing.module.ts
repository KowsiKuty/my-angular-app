import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RemsMasterComponent } from '../rems/rems-master/rems-master.component';
import { RemsSummaryComponent } from '../rems/rems-summary/rems-summary.component';
import { PremiseViewComponent } from '../rems/premise-view/premise-view.component';
import { PremiseEditComponent } from '../rems/premise-edit/premise-edit.component';
import { OccupancyComponent } from '../rems/occupancy/occupancy.component';
import { OccupancyEditComponent } from '../rems/occupancy-edit/occupancy-edit.component';
import { EbDetailsCreateComponent } from './eb-details-create/eb-details-create.component';
import { EbDetailsEditComponent } from './eb-details-edit/eb-details-edit.component';
import { RepairAndMaintenanceCreateComponent } from './repair-and-maintenance-create/repair-and-maintenance-create.component';
import { RepairAndMaintenanceEditComponent } from './repair-and-maintenance-edit/repair-and-maintenance-edit.component';
import { LeaseSummaryComponent } from '../rems/lease-summary/lease-summary.component';
import { LandlordCreateComponent } from '../rems/landlord-create/landlord-create.component';
import { LandlordEditComponent } from '../rems/landlord-edit/landlord-edit.component'
import { InsurancetypeCreateComponent } from '../rems/insurancetype-create/insurancetype-create.component';
import { InsurancetypeEditComponent } from '../rems/insurancetype-edit/insurancetype-edit.component';
import { InsuranceDetailCreateComponent } from '../rems/insurance-detail-create/insurance-detail-create.component';
import { InsuranceDetailEditComponent } from '../rems/insurance-detail-edit/insurance-detail-edit.component'
import { LicensetypeComponent } from '../rems/licensetype/licensetype.component';
import { LicensetypeEditComponent } from '../rems/licensetype-edit/licensetype-edit.component'
import { LicensedetailsComponent } from '../rems/licensedetails/licensedetails.component'
import { LicensedetailsEditComponent } from '../rems/licensedetails-edit/licensedetails-edit.component'
import { LandlordViewComponent } from '../rems/landlord-view/landlord-view.component'
import { AmentiesComponent } from './amenties/amenties.component'
import { PremiseCreateComponent } from '../rems/premise-create/premise-create.component'
import { LegaldataComponent } from '../rems/legaldata/legaldata.component'
import { TaxComponent } from '../rems/tax/tax.component'
import { TaxRateComponent } from '../rems/tax-rate/tax-rate.component'
import { LeaseAgreementComponent } from '../rems/lease-agreement/lease-agreement.component'
import { AgreementViewComponent } from '../rems/agreement-view/agreement-view.component'
import { RentFormComponent } from '../rems/rent-form/rent-form.component'
import { LegalClearanceComponent } from '../rems/legal-clearance/legal-clearance.component'
import { RentTermFormComponent } from '../rems/rent-term-form/rent-term-form.component'
import { RentArrearFormComponent } from '../rems/rent-arrear-form/rent-arrear-form.component'
import { OccupancyViewComponent } from './occupancy-view/occupancy-view.component';
import { PremiseOccupancyMappingFormComponent } from '../rems/premise-occupancy-mapping-form/premise-occupancy-mapping-form.component'
import { LegalNoticeFormComponent } from '../rems/legal-notice-form/legal-notice-form.component'
import { RenovationFormComponent } from '../rems/renovation-form/renovation-form.component'
import { PremiseDetailsFormComponent } from '../rems/premise-details-form/premise-details-form.component'
import { PremiseDetailsViewComponent } from '../rems/premise-details-view/premise-details-view.component'
// import { PremiseBrokerDetailsFormComponent } from '../rems/premise-broker-details-form/premise-broker-details-form.component'
import { DocumentFormComponent } from '../rems/document-form/document-form.component'
import { LandlordbankComponent } from './landlordbank/landlordbank.component';
import { PremiseIdentificationFormComponent } from '../rems/premise-identification-form/premise-identification-form.component'
import { PremiseIdentificationSummaryComponent } from '../rems/premise-identification-summary/premise-identification-summary.component'
import { StatutoryFormComponent } from './statutory-form/statutory-form.component';
import { PremiseIdentificationViewComponent } from '../rems/premise-identification-view/premise-identification-view.component'
// import { PremiseDocumentInfoComponent } from '../rems/premise-document-info/premise-document-info.component'
import { RemslayoutComponent } from '../rems/remslayout/remslayout.component'
import { DetailsRMComponent } from '../rems/details-rm/details-rm.component'
import { RentScheduleLeasedComponent} from '../rems/rent-schedule-leased/rent-schedule-leased.component'
import { ScheduleViewComponent} from '../rems/schedule-view/schedule-view.component'
import { OwnedscheduleViewComponent} from '../rems/ownedschedule-view/ownedschedule-view.component'
import { OwnedArrearsFormComponent} from '../rems/owned-arrears-form/owned-arrears-form.component'
import { RecurringFormComponent} from '../rems/recurring-form/recurring-form.component'
// import { GrnComponent } from '../rems/grn/grn.component'
import { GrnCreateComponent } from '../rems/grn-create/grn-create.component'
import { GrnViewComponent } from '../rems/grn-view/grn-view.component'
import {ModificationChangesComponent} from '../rems/modification-changes/modification-changes.component'
import { PremisedocinfoViewComponent } from '../rems/premisedocinfo-view/premisedocinfo-view.component'
import { RentConfirmationComponent} from '../rems/rent-confirmation/rent-confirmation.component'
import { PaymentdetailsFormComponent} from '../rems/paymentdetails-form/paymentdetails-form.component'
import { ExpenseDetailsComponent } from './expense-details/expense-details.component';
import{ InvoiceDetailsComponent } from '../rems/invoice-details/invoice-details.component'
import { RemstemplateComponent } from '../rems/remstemplate/remstemplate.component';
import { ApprovedIdentificationComponent} from '../rems/approved-identification/approved-identification.component'
import { ScheduleApprovalComponent} from '../rems/schedule-approval/schedule-approval.component'
import { RaiseRequestComponent} from '../rems/raise-request/raise-request.component'
import { AddRaiserequestComponent} from '../rems/add-raiserequest/add-raiserequest.component'
import { RaisereqViewComponent} from '../rems/raisereq-view/raisereq-view.component'
import {ScheduleApprovalViewComponent} from '../rems/schedule-approval-view/schedule-approval-view.component'
import { CanActivateGuardService } from '../can-activate-guard.service';
import { RemsanalysisComponent } from './remsanalysis/remsanalysis.component';
import { OccupancyccbsComponent } from './occupancyccbs/occupancyccbs.component';
import {ScheduleoverallComponent} from './scheduleoverall/scheduleoverall.component';
import { ProvisionReportComponent } from './provision-report/provision-report.component';
import { LeaseReportComponent } from './lease-report/lease-report.component';
const routes: Routes = [
  { path: '',canActivate:[CanActivateGuardService],
 children:[ 
  { path: "remsmaster", component: RemsMasterComponent },
  { path: 'premiseCreate', component: PremiseCreateComponent },
  { path: "premiseEdit", component: PremiseEditComponent },
  { path: "occupancyCreate", component: OccupancyComponent },
  { path: "occupancyedit", component: OccupancyEditComponent },
  { path: "occupancyccbs", component: OccupancyccbsComponent },
  { path: "leasesummary", component: LeaseSummaryComponent },
  { path: "landlordcreate", component: LandlordCreateComponent },
  { path: "landlordedit", component: LandlordEditComponent },
  { path: 'Insurancetypecreate', component: InsurancetypeCreateComponent },
  { path: 'InsurancetypeEdit', component: InsurancetypeEditComponent },
  { path: 'Insurancedetailcreate', component: InsuranceDetailCreateComponent },
  { path: 'InsurancedetailEdit', component: InsuranceDetailEditComponent },
  { path: 'licensetype', component: LicensetypeComponent },
  { path: 'licensetypeEdit', component: LicensetypeEditComponent },
  { path: 'licensedetails', component: LicensedetailsComponent },
  { path: 'landLordView', component: LandlordViewComponent },
  { path: 'amenitiesForm', component: AmentiesComponent },
  { path: 'licensedetailsedit', component: LicensedetailsEditComponent },
  { path: "premiseView", component: PremiseViewComponent, canActivate:[CanActivateGuardService]},
  { path: "premiseEdit", component: PremiseEditComponent },
  { path: "remsAnalysis", component: RemsanalysisComponent },
  { path: "scheduleoverall", component: ScheduleoverallComponent },
  { path: "occupancy", component: OccupancyComponent },
  { path: "leasesummary", component: LeaseSummaryComponent },
  { path: "landlordcreate", component: LandlordCreateComponent },
  { path: "landlordedit", component: LandlordEditComponent },
  { path: 'ebdetailsCreate', component: EbDetailsCreateComponent },
  { path: 'ebdetailsEdit', component: EbDetailsEditComponent },
  { path: 'repairandmaintenanceCreate', component: RepairAndMaintenanceCreateComponent },
  { path: 'repairandmaintenanceEdit', component: RepairAndMaintenanceEditComponent },
  { path: 'Insurancetypecreate', component: InsurancetypeCreateComponent },
  { path: 'InsurancetypeEdit', component: InsurancetypeEditComponent },
  { path: 'Insurancedetailcreate', component: InsuranceDetailCreateComponent },
  { path: 'InsurancedetailEdit', component: InsuranceDetailEditComponent },
  { path: 'licensetype', component: LicensetypeComponent },
  { path: 'licensetypeEdit', component: LicensetypeEditComponent },
  { path: 'licensedetails', component: LicensedetailsComponent },
  { path: 'licensedetailsedit', component: LicensedetailsEditComponent },
  { path: 'legalDataForm', component: LegaldataComponent },
  { path: 'tax', component: TaxComponent },
  { path: 'taxRate', component: TaxRateComponent },
  { path: 'leaseAgreement', component: LeaseAgreementComponent },
  { path: 'agreementView', component: AgreementViewComponent },
  { path: 'rentForm', component: RentFormComponent },
  { path: 'legalClearanceForm', component: LegalClearanceComponent },
  { path: 'rentTermForm', component: RentTermFormComponent },
  { path: 'rentArrearForm', component: RentArrearFormComponent },
  { path: 'legalNoticeForm', component: LegalNoticeFormComponent },
  { path: 'renovationForm', component: RenovationFormComponent },
  { path: 'premiseDetailsForm', component: PremiseDetailsFormComponent },
  { path: 'premiseDetailsView', component: PremiseDetailsViewComponent },
  // { path: 'brokerDetailsForm', component: PremiseBrokerDetailsFormComponent },
  { path: 'documentForm', component: DocumentFormComponent },
  { path: 'OccupancyView', component: OccupancyViewComponent },
  { path: 'premiseDetailsForm', component: PremiseDetailsFormComponent },
  { path: 'premiseDetailsView', component: PremiseDetailsViewComponent },
  // { path: 'brokerDetailsForm', component: PremiseBrokerDetailsFormComponent },
  { path: 'occupancyMappingForm', component: PremiseOccupancyMappingFormComponent },
  { path: 'landlordBankSummary', component: LandlordbankComponent },
  { path: 'identificationForm', component: PremiseIdentificationFormComponent },
  { path: 'statutorycreateeditform', component: StatutoryFormComponent },
  { path: 'premiseIDview', component: PremiseIdentificationViewComponent },
  // { path: 'premiseDocInfo', component: PremiseDocumentInfoComponent },
  { path: 'RM', component: DetailsRMComponent },
  { path: 'rentscheduleleased', component:RentScheduleLeasedComponent},
  { path: 'scheduleview', component:ScheduleViewComponent},
  { path: 'ownedscheduleview', component:OwnedscheduleViewComponent},
  { path: 'ownedarrearform', component: OwnedArrearsFormComponent},
  { path: 'recurringform',component: RecurringFormComponent},
  // { path: 'grn',component: GrnComponent},
  { path: 'grncreate',component: GrnCreateComponent},
  { path: 'grnview',component: GrnViewComponent},
  { path: 'modificationChanges',component: ModificationChangesComponent},
  { path: 'premisedocinfo',component: PremisedocinfoViewComponent},
  { path: 'rentconfirmation', component: RentConfirmationComponent},
  { path: 'paymentdetails', component: PaymentdetailsFormComponent },
  { path: 'invdetails',component:InvoiceDetailsComponent},
  { path: 'ExpensesDetails', component: ExpenseDetailsComponent}, 
  { path: 'addRaiseRequest', component: AddRaiserequestComponent}, 
  { path: 'raiseReqView', component: RaisereqViewComponent }, 
  { path: 'scheduleApprovalView',component:ScheduleApprovalViewComponent},
  {
    path: "rems", component: RemslayoutComponent, children: [
      { path: 'identificationSummary', component: PremiseIdentificationSummaryComponent },
      { path: "remsSummary", component: RemsSummaryComponent },
      { path: "remstemplate", component: RemstemplateComponent },
      { path: "approvedIdentification", component: ApprovedIdentificationComponent},
      { path: "scheduleApproval", component:ScheduleApprovalComponent},
      { path: "raiseRequest", component:RaiseRequestComponent},
      { path: "provisionReport", component:ProvisionReportComponent},
      { path: "leaseReport", component:LeaseReportComponent},
      // { path: "", component: PremiseIdentificationSummaryComponent },
    ]
  },

]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RemsRoutingModule { }
