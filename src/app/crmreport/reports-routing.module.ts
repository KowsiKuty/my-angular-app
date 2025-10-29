import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { ReportsmainComponent } from './reportsmain/reportsmain.component';


const routes: Routes = [
 {path:'',canActivate:[CanActivateGuardService],
 children:[
  {path:"reportsmain",  canActivate: [CanActivateGuardService], component:ReportsmainComponent},
 ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
