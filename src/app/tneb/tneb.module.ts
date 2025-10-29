import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TnebRoutingModule } from './tneb-routing.module';
import { AddElectricityDetailsComponent } from './add-electricity-details/add-electricity-details.component';
import { ElectricityApprovalSummaryComponent } from './electricity-approval-summary/electricity-approval-summary.component';
import { ElectricityDetailSummaryComponent } from './electricity-detail-summary/electricity-detail-summary.component';
import { EledetailPaymentSummaryComponent } from './eledetail-payment-summary/eledetail-payment-summary.component';
import { EledetStatusSummaryComponent } from './eledet-status-summary/eledet-status-summary.component';
import { TnebTransactionSummaryComponent } from './tneb-transaction-summary/tneb-transaction-summary.component';
import { ViewEleDetailComponent } from './view-ele-detail/view-ele-detail.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ToastrModule } from 'ngx-toastr';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { ElectricityDetailsCoDoMakerSummaryComponent } from './electricity-details-co-do-maker-summary/electricity-details-co-do-maker-summary.component';
import { ElectricityDetailsCoDoApptovalSummaryComponent } from './electricity-details-co-do-apptoval-summary/electricity-details-co-do-apptoval-summary.component';
import { ElectricityDetailsCoDoMakerComponent } from './electricity-details-co-do-maker/electricity-details-co-do-maker.component';
import { ElectricityDetailsStatusComponent } from './electricity-details-status/electricity-details-status.component';
import { EleTransactionComponent } from './ele-transaction/ele-transaction.component';
import { ElecDetailsTranSummaryComponent } from './elec-details-tran-summary/elec-details-tran-summary.component';
import { ElecQuerySummaryComponent } from './elec-query-summary/elec-query-summary.component';
import { ElecViewDetailsComponent } from './elec-view-details/elec-view-details.component';
import { ElecCodoApprovalComponent } from './elec-codo-approval/elec-codo-approval.component';
import { ElectricityboardmasterComponent } from './electricityboardmaster/electricityboardmaster.component';
import { ElectricityregionmasterComponent } from './electricityregionmaster/electricityregionmaster.component';


@NgModule({
  declarations: [AddElectricityDetailsComponent, ElectricityApprovalSummaryComponent, ElectricityDetailSummaryComponent, EledetailPaymentSummaryComponent, EledetStatusSummaryComponent, TnebTransactionSummaryComponent, ViewEleDetailComponent, ElectricityDetailsCoDoMakerSummaryComponent, ElectricityDetailsCoDoApptovalSummaryComponent, ElectricityDetailsCoDoMakerComponent, ElectricityDetailsStatusComponent, EleTransactionComponent, ElecDetailsTranSummaryComponent, ElecQuerySummaryComponent, ElecViewDetailsComponent, ElecCodoApprovalComponent, ElectricityboardmasterComponent, ElectricityregionmasterComponent],
  imports: [
    ToastrModule.forRoot({ timeOut: 10000 }),
    TnebRoutingModule, SharedModule, MaterialModule,PdfViewerModule, CommonModule
  ],
  // providers: [TriggerService]
})
export class TnebModule { }
