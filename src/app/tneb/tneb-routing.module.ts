import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { AddElectricityDetailsComponent } from './add-electricity-details/add-electricity-details.component';
import { EleTransactionComponent } from './ele-transaction/ele-transaction.component';
import { ElecCodoApprovalComponent } from './elec-codo-approval/elec-codo-approval.component';
import { ElecDetailsTranSummaryComponent } from './elec-details-tran-summary/elec-details-tran-summary.component';
import { ElecQuerySummaryComponent } from './elec-query-summary/elec-query-summary.component';
import { ElectricityApprovalSummaryComponent } from './electricity-approval-summary/electricity-approval-summary.component';
import { ElectricityDetailSummaryComponent } from './electricity-detail-summary/electricity-detail-summary.component';
import { ElectricityDetailsCoDoApptovalSummaryComponent } from './electricity-details-co-do-apptoval-summary/electricity-details-co-do-apptoval-summary.component';
import { ElectricityDetailsCoDoMakerSummaryComponent } from './electricity-details-co-do-maker-summary/electricity-details-co-do-maker-summary.component';
import { ElectricityDetailsCoDoMakerComponent } from './electricity-details-co-do-maker/electricity-details-co-do-maker.component';
import { ElectricityDetailsStatusComponent } from './electricity-details-status/electricity-details-status.component';
import { ElectricityboardmasterComponent } from './electricityboardmaster/electricityboardmaster.component';
import { ElectricityregionmasterComponent } from './electricityregionmaster/electricityregionmaster.component';
import { EledetStatusSummaryComponent } from './eledet-status-summary/eledet-status-summary.component';
import { EledetailPaymentSummaryComponent } from './eledetail-payment-summary/eledetail-payment-summary.component';
import { TnebTransactionSummaryComponent } from './tneb-transaction-summary/tneb-transaction-summary.component';
import { ViewEleDetailComponent } from './view-ele-detail/view-ele-detail.component';


const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [

      {
        path: 'electricityexpense', component: EleTransactionComponent, children: [
          { path: 'addElectricity', component: AddElectricityDetailsComponent },
          { path: 'electricitySummary', component: ElectricityDetailSummaryComponent },
          { path: 'eleDetailPaymentSummary', component: EledetailPaymentSummaryComponent },
          { path: 'viewEleDetail', component: ViewEleDetailComponent },
          { path: 'EleDetailApprovalSummary', component: ElectricityApprovalSummaryComponent },
          { path: 'eledetStatusSummary', component: EledetStatusSummaryComponent },
          { path: 'electricitycodomaker', component: ElectricityDetailsCoDoMakerComponent },
          { path: 'electricitycodoapproval', component: ElectricityDetailsCoDoApptovalSummaryComponent },
          { path: 'electricitystatus', component: ElectricityDetailsStatusComponent },
          { path: 'electricitycodo', component: ElectricityDetailsCoDoMakerSummaryComponent },
          { path: 'elecdetailsappsummary', component: ElecDetailsTranSummaryComponent },
          { path: 'elecquerysummary', component: ElecQuerySummaryComponent },
          { path: 'elctcodoapproval', component: ElecCodoApprovalComponent },
          { path: 'electricityboardmaster', component: ElectricityboardmasterComponent },
          { path: 'electricityregionmaster', component: ElectricityregionmasterComponent },

        ]
      },
      {
        path: "electricityexpensemaster", component: TnebTransactionSummaryComponent, children: [


          { path: 'addElectricity', component: AddElectricityDetailsComponent },
          { path: 'electricitySummary', component: ElectricityDetailSummaryComponent },
          { path: 'eleDetailPaymentSummary', component: EledetailPaymentSummaryComponent },
          { path: 'viewEleDetail', component: ViewEleDetailComponent },
          { path: 'EleDetailApprovalSummary', component: ElectricityApprovalSummaryComponent },
          { path: 'eledetStatusSummary', component: EledetStatusSummaryComponent },
          { path: 'electricitycodomaker', component: ElectricityDetailsCoDoMakerComponent },
          { path: 'electricitycodoapproval', component: ElectricityDetailsCoDoApptovalSummaryComponent },
          { path: 'electricitystatus', component: ElectricityDetailsStatusComponent },
          { path: 'electricitycodo', component: ElectricityDetailsCoDoMakerSummaryComponent },
          { path: 'elecdetailsappsummary', component: ElecDetailsTranSummaryComponent },
          { path: 'elecquerysummary', component: ElecQuerySummaryComponent },
          { path: 'elctcodoapproval', component: ElecCodoApprovalComponent },
          { path: 'electricityboardmaster', component: ElectricityboardmasterComponent },
          { path: 'electricityregionmaster', component: ElectricityregionmasterComponent },
        ]
      },


    ]
  }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TnebRoutingModule { }
