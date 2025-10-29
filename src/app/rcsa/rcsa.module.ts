import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RCSARoutingModule } from './rcsa-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SharedModule } from '../shared/shared.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MaterialModule } from '../material/material.module';
import { RcsaMainComponent } from './rcsa-main/rcsa-main.component';


@NgModule({
  declarations: [RcsaMainComponent],
  imports: [
    CommonModule,
    RCSARoutingModule,
    ToastrModule.forRoot(),
    NgxMaterialTimepickerModule,
    SharedModule,
    PdfViewerModule,MaterialModule
  ]
})
export class RCSAModule { }
