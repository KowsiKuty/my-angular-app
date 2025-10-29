import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourierComponent } from '../inward/courier/courier.component';
import { ChannelComponent } from '../inward/channel/channel.component';
import { DocumentComponent } from '../inward/document/document.component';
import { InwardSummaryComponent } from '../inward/inward-summary/inward-summary.component';
import { InwardMasterComponent } from '../inward/inward-master/inward-master.component';
import { InwardFormComponent } from '../inward/inward-form/inward-form.component';
import { InwardDetailsComponent } from '../inward/inward-details/inward-details.component';
// import { InwardDocumentComponent } from './inward-document/inward-document.component';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { DocresponseComponent } from './docresponse/docresponse.component';

const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [
  { path: 'inwardcourier', component: CourierComponent },
  { path: 'inwardchannel', component: ChannelComponent },
  { path: 'inwarddocument', component: DocumentComponent },
  { path: 'inward', component: InwardSummaryComponent },
  { path: 'inwardMaster', component: InwardMasterComponent },
  // { path: 'inwarddocumentsummary', component: InwardDocumentComponent },

  { path: 'inwardForm', component: InwardFormComponent },
  { path: 'inwardDetailView', component: InwardDetailsComponent },
  {path:'docresponse', component:DocresponseComponent}

]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InwardRoutingModule { }
