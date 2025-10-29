import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PprSummaryComponent } from './ppr-summary/ppr-summary.component';
import { CostAllocationComponent } from './cost-allocation/cost-allocation.component'

import { CanActivateGuardService } from '../can-activate-guard.service';
import { CostTransactionComponent } from './cost-transaction/cost-transaction.component';
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
import { BudgetBuilderComponent } from './budget-builder/budget-builder.component';
import { DssdocumentComponent } from './dssdocument/dssdocument.component';
import { PprLabelComponent } from './ppr-label/ppr-label.component';


const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [
      { path: 'pprreport', component: PprSummaryComponent },
      { path: 'CAC', component: CostAllocationComponent },
      { path: 'ctc',component:CostTransactionComponent },            
      {path:'VarianceAnalysis',component:VarianceAnalysisComponent},
      {path:'Plc',component:PprLevelComponent},
      {path:'budget',component:BudgetBuilderComponent},
      {path:"empbsmapping",component:EmployeeBusinessMappingComponent},
      {path:'budgetapprover',component:BudgetBuilderApproveComponent},
      {path:'budgetreviewer',component:BudgetBuilderViewerComponent},
      {path:'budgetchecker',component:BudgetBuilderCheckerComponent},
      {path:'pprviewtemplate',component:PprViewTemplateComponent},
      {path:'expgrpmapping',component:ExpenceGrpLevelMappingComponent},
      {path:'exceptionmaster',component:ExceptionMasterComponent},
      {path:'expensegl',component:ExpenseGlMappingComponent},
      {path:'Aws',component:AwsFileComponent},
      {path:'exception',component:PprExceptionComponent},
      {path:'Dssdocument',component:DssdocumentComponent},
      {path:'ppr_label',component:PprLabelComponent},
  
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PprRoutingModule { }
