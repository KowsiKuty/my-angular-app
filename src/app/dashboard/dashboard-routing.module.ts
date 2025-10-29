import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {path:"dashboard",  canActivate: [CanActivateGuardService], component:DashboardComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
