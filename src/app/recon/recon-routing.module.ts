import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { ReconexternalComponent } from './reconexternal/reconexternal.component';



const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
      children: [ 
        { path:"reconmain", component: ReconexternalComponent }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReconRoutingModule { }
