import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { IntertransactionsComponent } from './intertransactions/intertransactions.component';
import { InterintegritymastersComponent } from './interintegritymasters/interintegritymasters.component';
import { NewwisfinTemplateComponent } from './newwisfin-template/newwisfin-template.component';
import { NewcbsTemplateComponent } from './newcbs-template/newcbs-template.component';
import { KnockhistoryComponent } from './knockhistory/knockhistory.component';
import { DocumentDetailsComponent } from './document-details/document-details.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { NewtemplatesComponent } from './newtemplates/newtemplates.component';

// const routes: Routes = [];

const routes: Routes = [
  {
  path: '', canActivate: [CanActivateGuardService],
    children: [
      { path:"intertrans", component: LandingpageComponent },
      {path:"interintegritymaster", component:InterintegritymastersComponent},
      {path: "newwisefintemp", component: NewwisfinTemplateComponent},
      {path:"newcbstemp", component: NewcbsTemplateComponent},
      {path:"knock", component: KnockhistoryComponent},
      {path:"documentdetails",component:DocumentDetailsComponent},
      {path:"newtemplates",component:NewtemplatesComponent},
      {path:"intertransactions",component:IntertransactionsComponent}

    ]
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterintegrityRoutingModule { }
