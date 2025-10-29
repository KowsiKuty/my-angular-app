import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from 'src/app/can-activate-guard.service';
// import { VowSummaryComponent } from '../vow-summary/vow-summary.component';
import { DashviewComponent } from '../dashview/dashview.component';



const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [
    // { path: 'vowsummary', component: VowSummaryComponent, canActivate:[CanActivateGuardService] },
    { path: 'dashboard', component: DashviewComponent, canActivate:[CanActivateGuardService]}
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VowRoutingModule { }
