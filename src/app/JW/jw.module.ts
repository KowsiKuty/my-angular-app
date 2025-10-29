import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { ToastrModule } from 'ngx-toastr';
import { JwRoutingModule } from './jw-routing.module';
import { JwComponent } from './jw/jw.component';
import { JwCreationComponent } from './jw-creation/jw-creation.component';
import { JwUploadComponent } from './jw-upload/jw-upload.component';
import { JwsummaryViewComponent } from './jwsummary-view/jwsummary-view.component';
import { JwApprovalviewComponent } from './jw-approvalview/jw-approvalview.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations: [JwComponent,JwCreationComponent,JwUploadComponent,JwsummaryViewComponent,JwApprovalviewComponent],
  imports: [
    CommonModule,
    JwRoutingModule,
    SharedModule,
    MaterialModule,
    ToastrModule,
    PdfViewerModule
    
  ]
})
export class JwModule { }
