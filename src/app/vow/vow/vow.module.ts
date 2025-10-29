import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToastrModule } from 'ngx-toastr'
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material/material.module';
import { DatePipe } from '@angular/common';


import { VowRoutingModule } from './vow-routing.module';
import { VowSummaryComponent } from '../vow-summary/vow-summary.component';
import { DashviewComponent } from '../dashview/dashview.component';
// import { LeaddataComponent } from 'src/app/lead/leaddata/leaddata.component';
// import { GroupComponent } from 'src/app/user-details/group/group.component';


@NgModule({
  declarations: [DashviewComponent,VowSummaryComponent],
  providers: [DatePipe],
  imports: [
    CommonModule,
    VowRoutingModule,
    ToastrModule.forRoot(),
    SharedModule,MaterialModule,
    // LeaddataComponent,
    // GroupComponent
  ],
  // exports: [
  //   VowSummaryComponent
  // ]
})
export class VowModule { }
