import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PprRoutingModule } from './ppr-routing.module';
import { PprSummaryComponent } from './ppr-summary/ppr-summary.component';
import { BudgetBuilderComponent } from './budget-builder/budget-builder.component';
import { TemplateSummaryComponent } from './Template-Summary/Template-Summary.component';
import { DssdocumentComponent } from './dssdocument/dssdocument.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PdfViewerModule } from 'ng2-pdf-viewer';
@NgModule({
  declarations: [PprSummaryComponent, BudgetBuilderComponent,TemplateSummaryComponent,DssdocumentComponent],
  imports: [
    PprRoutingModule,
    NgbModule,
    SharedModule,MaterialModule,
   PdfViewerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class dynamicModule { }
