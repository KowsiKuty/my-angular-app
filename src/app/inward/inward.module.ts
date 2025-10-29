import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import {ToastrModule} from 'ngx-toastr'
import { InwardRoutingModule } from './inward-routing.module';
import { ChannelComponent } from './channel/channel.component';
import { DocumentComponent } from './document/document.component';
import { InwardSummaryComponent } from './inward-summary/inward-summary.component';
import { InwardMasterComponent } from './inward-master/inward-master.component';
import { CourierComponent } from './courier/courier.component';
import { InwardFormComponent } from './inward-form/inward-form.component';
import { DatePipe } from '@angular/common';
import { InwardDetailsComponent } from './inward-details/inward-details.component';
// import { InwardDocumentComponent } from './inward-document/inward-document.component';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DocresponseComponent } from './docresponse/docresponse.component';
@NgModule({
  declarations: [CourierComponent, ChannelComponent, DocumentComponent,
     InwardSummaryComponent, InwardMasterComponent, InwardFormComponent, InwardDetailsComponent, DocresponseComponent,
     ],
  imports: [
    InwardRoutingModule,SharedModule, MaterialModule,ToastrModule.forRoot(),PdfViewerModule,
  ], providers: [
    DatePipe,
  ],
})
export class InwardModule { }