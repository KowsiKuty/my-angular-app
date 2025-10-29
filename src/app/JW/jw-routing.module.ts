import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { JwComponent } from './jw/jw.component';
import { JwCreationComponent } from './jw-creation/jw-creation.component';
import { JwUploadComponent } from './jw-upload/jw-upload.component';
import { JwsummaryViewComponent } from './jwsummary-view/jwsummary-view.component';
import { JwApprovalviewComponent } from './jw-approvalview/jw-approvalview.component';



const routes: Routes = [
  {
  path: '', canActivate: [CanActivateGuardService],
  children: [
   {path:'jwsummary',component:JwComponent,canActivate:[CanActivateGuardService]},
   {path:'addjv',component:JwCreationComponent,canActivate:[CanActivateGuardService]},
   {path:'jvview',component:JwApprovalviewComponent,canActivate:[CanActivateGuardService]},
   {path:'jvupload',component:JwUploadComponent,canActivate:[CanActivateGuardService]},
   {path:'jvsummaryview',component:JwsummaryViewComponent,canActivate:[CanActivateGuardService]}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JwRoutingModule { }
