import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { ToastrModule } from 'ngx-toastr';
import { EcfapRoutingModule } from './ecfap-routing.module';
import { EcfapComponent } from './ecfap/ecfap.component';
import { CreateEcfComponent } from './create-ecf/create-ecf.component';
import { EcfapViewComponent } from './ecfap-view/ecfap-view.component';
import { EcfbatchViewComponent } from './ecfbatch-view/ecfbatch-view.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { InvDetailViewComponent } from './inv-detail-view/inv-detail-view.component';
import { ApApproveComponent } from './ap-approve/ap-approve.component';
import { InvDetailApproveComponent } from './inv-detail-approve/inv-detail-approve.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PreparePaymentComponent } from './prepare-payment/prepare-payment.component';
import { BounceDetailComponent } from './bounce-detail/bounce-detail.component';
import { DisableCopyPasteDirective } from './disable-copy-paste.directive';
import { EcfApprovalViewComponent } from './ecf-approval-view/ecf-approval-view.component';
import { ApproverInvDetailViewComponent } from './approver-inv-detail-view/approver-inv-detail-view.component';
import { ApComponent } from './ap/ap.component';
import { CreateApComponent } from './create-ap/create-ap.component';
import { EcfviewComponent } from './ecfview/ecfview.component';
import { InwardFormComponent } from './inward-form/inward-form.component';
import { PoviewComponent } from './poview/poview.component';
import { PaymentQSummaryComponent } from './payment-q-summary/payment-q-summary.component';
import { SchedularComponent } from './schedular/schedular.component';
import { VsSearchInpModule } from '@unnilouis.org/vs-search-inp';
import { VsDynamicformsModule } from '@unnilouis.org/vs-dynamicforms';
import { VsDepDropdownModule } from '@unnilouis.org/vs-dep-dropdown';
import { VsOptionddModule } from '@unnilouis.org/vs-optiondd';
import { CboxSummaryModule } from '@unnilouis.org/vs-summary-cbox';
import { VsSepDatesModule } from '@unnilouis.org/vs-sep-dates';
import { CleardirectiveDirective } from './cleardirective.directive';
@NgModule({
  declarations: [EcfapComponent, CreateEcfComponent, EcfapViewComponent, EcfbatchViewComponent, InvoiceDetailComponent, InvDetailViewComponent, ApApproveComponent, InvDetailApproveComponent, PreparePaymentComponent, BounceDetailComponent, DisableCopyPasteDirective, EcfApprovalViewComponent, ApproverInvDetailViewComponent, ApComponent, CreateApComponent,
    EcfviewComponent, InwardFormComponent, PoviewComponent, PaymentQSummaryComponent, SchedularComponent, CleardirectiveDirective],
  imports: [

    MaterialModule,
    ToastrModule,
    EcfapRoutingModule,
    SharedModule,
    PdfViewerModule,
    VsDynamicformsModule,
    VsDepDropdownModule,
    VsOptionddModule,
    CboxSummaryModule,
    VsSearchInpModule,
    VsOptionddModule,
    VsSepDatesModule
  ],

})
export class EcfapModule { }
