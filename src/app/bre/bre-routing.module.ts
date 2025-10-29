import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { BreComponent } from './bre/bre.component';
import { ExpenseCreateComponent } from './expense-create/expense-create.component'; 
import { BranchExpCreateComponent } from './branch-exp-create/branch-exp-create.component';

const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [
  {path: 'bre', component: BreComponent ,canActivate:[CanActivateGuardService]},
  {path: 'expensecreate', component: ExpenseCreateComponent ,canActivate:[CanActivateGuardService]},
  {path: 'branchexpcreate', component: BranchExpCreateComponent ,canActivate:[CanActivateGuardService]},
  
]
}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BreRoutingModule { }
