import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../can-activate-guard.service';
import{LodgingExpenceComponent}from'../ta/lodging-expence/lodging-expence.component'
import{DailydiemExpenceComponent}from '../ta/dailydiem-expence/dailydiem-expence.component'
import{MiscellaneousExpenceComponent}from '../ta/miscellaneous-expence/miscellaneous-expence.component'
import { DeputationExpenceComponent } from '../ta/deputation-expence/deputation-expence.component';
import{IncidentalExpenceComponent}from '../ta/incidental-expence/incidental-expence.component'
import{PackingExpenceComponent}from '../ta/packing-expence/packing-expence.component'
import{TravelingExpenceComponent}from'../ta/traveling-expence/traveling-expence.component'
import{LocalconveyanceExpenseComponent} from '../ta/localconveyance-expense/localconveyance-expense.component'
import { ReportsComponent } from './reports.component';
import { QueryscreenComponent } from './queryscreen/queryscreen.component';
import { QueryexefileComponent } from './queryexefile/queryexefile.component';
import { VendorReportComponent } from './vendor-report/vendor-report.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PrpoReportsComponent } from './prpo-reports/prpo-reports.component';
import { EmployeequeryComponent } from './employeequery/employeequery.component';
const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
  children: [
    // {path:"reports",component:ReportsComponent,canActivate:[CanActivateGuardService]},
    {path:"lodge",component:LodgingExpenceComponent},
    {path:"daily",component:DailydiemExpenceComponent},
    {path:"misc",component:MiscellaneousExpenceComponent},
    {path:"deput",component:DeputationExpenceComponent},
    {path:"inci",component:IncidentalExpenceComponent},
    {path:"pack",component:PackingExpenceComponent},
    {path:"travel",component:TravelingExpenceComponent},
    {path:"local",component:LocalconveyanceExpenseComponent},
    {path:"query", component: QueryscreenComponent},
    {path:"queryexefile", component: QueryexefileComponent},
    {path:"venderreport", component: VendorReportComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'reports', component: ReportsComponent},
    {path:"prpoReport", component: PrpoReportsComponent},
    {path:"employeequery", component: EmployeequeryComponent}
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
