import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TBReportComponent } from './tb-report/tb-report.component';
import{TBGlReportComponent}from'./tb-gl-report/tb-gl-report.component';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { TBSummaryComponent } from './tb-summary/tb-summary.component';
import { TbDocumentComponent } from './tb-document/tb-document.component';
import { TbSubmoduleRoutingComponent } from './tb-submodule-routing/tb-submodule-routing.component';
import { RoarunscreenComponent } from './roarunscreen/roarunscreen.component';


const routes: Routes = [
  {
  path: '', canActivate: [CanActivateGuardService],
    children: [
      {path:'tb_route',component:TbSubmoduleRoutingComponent},
      {path:'tb',component:TBSummaryComponent},
  {path:'Tb_report',component:TBReportComponent},
  {path:'TB_gl_report',component:TBGlReportComponent},
  {path:'tb_document',component:TbDocumentComponent},
  {path:'ROARun',component:RoarunscreenComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TbReportRoutingModule { }
