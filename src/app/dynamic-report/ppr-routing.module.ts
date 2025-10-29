import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PprSummaryComponent } from './ppr-summary/ppr-summary.component';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { BudgetBuilderComponent } from './budget-builder/budget-builder.component';

const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [
      { path: 'dynamicreport', component: PprSummaryComponent },
      {path:'budget',component:BudgetBuilderComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PprRoutingModule { }
