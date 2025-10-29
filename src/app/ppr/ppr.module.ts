import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PprRoutingModule } from './ppr-routing.module';
import { PprSummaryComponent } from './ppr-summary/ppr-summary.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BudgetBuilderComponent } from './budget-builder/budget-builder.component';
import { CostAllocationComponent } from './cost-allocation/cost-allocation.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { CostTransactionComponent } from './cost-transaction/cost-transaction.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { VarianceAnalysisComponent } from './variance-analysis/variance-analysis.component';
import { PprLevelComponent } from './ppr-level/ppr-level.component';
import { EmployeeBusinessMappingComponent } from './employee-business-mapping/employee-business-mapping.component';
import { BudgetBuilderApproveComponent } from './budget-builder-approve/budget-builder-approve.component';
import { BudgetBuilderViewerComponent } from './budget-builder-viewer/budget-builder-viewer.component';
import { BudgetBuilderCheckerComponent } from './budget-builder-checker/budget-builder-checker.component';
import { PprViewTemplateComponent } from './ppr-view-template/ppr-view-template.component';
import { ExpenceGrpLevelMappingComponent } from './expence-grp-level-mapping/expence-grp-level-mapping.component';
import { ExceptionMasterComponent } from './exception-master/exception-master.component';
import { ExpenseGlMappingComponent } from './expense-gl-mapping/expense-gl-mapping.component';
import { AwsFileComponent } from './aws-file/aws-file.component';
import { PprExceptionComponent } from './ppr-exception/ppr-exception.component';
import { CostAllocationViewComponent } from './cost-allocation-view/cost-allocation-view.component';
import { DssdocumentComponent } from './dssdocument/dssdocument.component';
import { PprLabelComponent } from './ppr-label/ppr-label.component';
import { PprChartComponent } from './ppr-chart/ppr-chart.component';
import {VsDynamicformsModule} from '@unnilouis.org/vs-dynamicforms';
import {VsDepDropdownModule} from '@unnilouis.org/vs-dep-dropdown';
import {CboxSummaryModule} from '@unnilouis.org/vs-summary-cbox';
import {VsSearchInpModule} from "@unnilouis.org/vs-search-inp";


@NgModule({
  declarations: [PprSummaryComponent, BudgetBuilderComponent, CostAllocationComponent, CostTransactionComponent, VarianceAnalysisComponent, PprLevelComponent, EmployeeBusinessMappingComponent, BudgetBuilderApproveComponent, BudgetBuilderViewerComponent, BudgetBuilderCheckerComponent, PprViewTemplateComponent, ExpenceGrpLevelMappingComponent, ExceptionMasterComponent, ExpenseGlMappingComponent, AwsFileComponent, PprExceptionComponent, CostAllocationViewComponent, DssdocumentComponent, PprLabelComponent, PprChartComponent,],
  imports: [
    NgxPaginationModule,
    PprRoutingModule,
    NgbModule,
    SharedModule,MaterialModule,
   PdfViewerModule,
   VsDynamicformsModule,
   VsDepDropdownModule,
   CboxSummaryModule,
   VsSearchInpModule
  ],
  // entryComponents: [DialogApplicationDetails],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // providers: [DialogApplicationDetails],
  // bootstrap:[DialogApplicationDetails],
})
export class PprModule { }
