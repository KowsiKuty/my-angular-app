import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { DssSummaryComponent } from './dss-summary/dss-summary.component';
import { DssMasterComponent } from './dss-master/dss-master.component';
import { DssExceptionComponent } from './dss-exception/dss-exception.component';
import { DssActiveComponent } from './dss-active/dss-active.component';
const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [
     {path: 'dssreport', component: DssSummaryComponent},
     {path: 'dssmaster', component: DssMasterComponent},
     {path :'exp',component:DssExceptionComponent},
     {path :'act',component:DssActiveComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DssRoutingModule { }
