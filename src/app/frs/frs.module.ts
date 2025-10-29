import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table'; 
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';

import { FrsRoutingModule } from './frs-routing.module';
import { FrstransactionComponent } from './frstransaction/frstransaction.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FrsTransactionComponent } from './frs-transaction/frs-transaction.component';
import { FrsSummaryComponent } from './frs-summary/frs-summary.component';
import { TwoDigitDecimaNumberDirectiveDirective } from './two-digit-decima-number-directive.directive';
import { FrsDocumentComponent } from './frs-document/frs-document.component';
import { QueryPageComponent } from './query-page/query-page.component';
import { GlMappingComponent } from './gl-mapping/gl-mapping.component';
import { ReverseMasterComponent } from './reverse-master/reverse-master.component';



@NgModule({
  declarations: [FrstransactionComponent, FrsTransactionComponent, FrsSummaryComponent, TwoDigitDecimaNumberDirectiveDirective, FrsDocumentComponent, QueryPageComponent, GlMappingComponent, ReverseMasterComponent],
  imports: [
    CommonModule,
    FrsRoutingModule,
    MatTableModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule, SharedModule

  ]
})
export class FrsModule { }
