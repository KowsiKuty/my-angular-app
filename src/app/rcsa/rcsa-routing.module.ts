import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RcsaMainComponent } from './rcsa-main/rcsa-main.component';


const routes: Routes = [
  {path:'rcsamain',component:RcsaMainComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  bootstrap:[RcsaMainComponent],
})
export class RCSARoutingModule { }
