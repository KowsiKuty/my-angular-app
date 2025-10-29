import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmsRoutingModule } from './sms-routing.module';
import { SmsMakerSummaryComponent } from './sms-maker-summary/sms-maker-summary.component';
import { SmsApprovalSummaryComponent } from './sms-approval-summary/sms-approval-summary.component';
import { SmsNatureOfAssetProblemComponent } from './sms-nature-of-asset-problem/sms-nature-of-asset-problem.component';
import { SmsTicketSummaryComponent } from './sms-ticket-summary/sms-ticket-summary.component';
import { SmsTransactionSummaryComponent } from './sms-transaction-summary/sms-transaction-summary.component';
import { SmsAmcCreateComponent } from './sms-amc-create/sms-amc-create.component';
import { SmsWarrantyCreateComponent } from './sms-warranty-create/sms-warranty-create.component';
import { SmsEditComponent } from './sms-edit/sms-edit.component';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SmsListOfAssetComponent } from './sms-list-of-asset/sms-list-of-asset.component';
import { CreateTicketSummaryComponent } from './create-ticket-summary/create-ticket-summary.component';
import { SmsApprovalDataComponent } from './sms-approval-data/sms-approval-data.component';
import { TicketFollowupComponent } from './ticket-followup/ticket-followup.component';
import { NonOwnedAssetSummaryComponent } from './non-owned-asset-summary/non-owned-asset-summary.component';
import { NonOwnedAssetMakerComponent } from './non-owned-asset-maker/non-owned-asset-maker.component';
import{NonOwnedAssetApprovalSummaryComponent} from './non-owned-asset-approval-summary/non-owned-asset-approval-summary.component';
import { SmsMasterComponent } from './sms-master/sms-master.component';
import { SmsRenewalCreateComponent } from './sms-renewal-create/sms-renewal-create.component';
import { SmsAmcEditComponent } from './sms-amc-edit/sms-amc-edit.component';


@NgModule({
  declarations: [SmsMakerSummaryComponent, SmsApprovalSummaryComponent, SmsNatureOfAssetProblemComponent, SmsTicketSummaryComponent, SmsTransactionSummaryComponent, SmsAmcCreateComponent, SmsWarrantyCreateComponent, SmsEditComponent, SmsListOfAssetComponent, CreateTicketSummaryComponent, SmsApprovalDataComponent, TicketFollowupComponent, NonOwnedAssetSummaryComponent, NonOwnedAssetMakerComponent, NonOwnedAssetApprovalSummaryComponent, SmsMasterComponent, SmsRenewalCreateComponent, SmsAmcEditComponent],
  imports: [
    ToastrModule.forRoot({ timeOut: 10000 }),
    SmsRoutingModule, SharedModule, MaterialModule,PdfViewerModule, CommonModule
    ],
    // providers: [TriggerService]
  })
export class SmsModule { }
