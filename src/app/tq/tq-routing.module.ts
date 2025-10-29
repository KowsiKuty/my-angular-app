import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TqQueryComponent } from './tq-query/tq-query.component';


const routes: Routes = [
  { path: "TQ", component: TqQueryComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TQRoutingModule { }
