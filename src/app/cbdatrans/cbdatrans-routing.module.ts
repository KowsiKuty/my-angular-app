import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { CbdatransactionComponent } from './cbdatransaction/cbdatransaction.component';
import { CbdaSubComponent } from './cbda-sub/cbda-sub.component';


const routes: Routes = [
    {
      path: "",
      canActivate: [CanActivateGuardService],
      children: [
        { path: "cbdareports", component: CbdatransactionComponent },
        { path: "cbdasub", component: CbdaSubComponent },
        
      ],
    },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CbdatransRoutingModule { }
