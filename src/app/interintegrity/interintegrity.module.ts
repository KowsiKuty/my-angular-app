import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

import { InterintegrityRoutingModule } from './interintegrity-routing.module';
import { IntertransactionsComponent } from './intertransactions/intertransactions.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InterintegritymastersComponent } from './interintegritymasters/interintegritymasters.component';
import { AddaccountComponent } from './addaccount/addaccount.component';
import { NewtemplatesComponent } from './newtemplates/newtemplates.component';
import { CbstemplatesComponent } from './cbstemplates/cbstemplates.component';
import { NewwisfinTemplateComponent } from './newwisfin-template/newwisfin-template.component';
import { NewcbsTemplateComponent } from './newcbs-template/newcbs-template.component';
import { KnockhistoryComponent } from './knockhistory/knockhistory.component';
import { ActionmasterComponent } from './actionmaster/actionmaster.component';
import { ConfirmdialogComponent } from './confirmdialog/confirmdialog.component';
import { UserdialogComponent } from './userdialog/userdialog.component';
import { AdmindialogComponent } from './intertransactions/admindialog/admindialog.component';
import { DocumentDetailsComponent } from './document-details/document-details.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { VsDynamicformsModule } from '@unnilouis.org/vs-dynamicforms';
import {VsSepDatesModule} from '@unnilouis.org/vs-sep-dates';
import {CboxSummaryModule} from '@unnilouis.org/vs-summary-cbox';
import {VsSearchInpModule} from "@unnilouis.org/vs-search-inp";
import {VsChipdropdownModule} from "@unnilouis.org/vs-chipdropdown";
import {VsOptionddModule} from '@unnilouis.org/vs-optiondd';
import { InterintegrityactionComponent } from './interintegrityaction/interintegrityaction.component';

@NgModule({
  declarations: [IntertransactionsComponent, InterintegritymastersComponent, AddaccountComponent, NewtemplatesComponent, CbstemplatesComponent, NewwisfinTemplateComponent, NewcbsTemplateComponent, KnockhistoryComponent, ActionmasterComponent, ConfirmdialogComponent, UserdialogComponent, AdmindialogComponent, DocumentDetailsComponent, LandingpageComponent, InterintegrityactionComponent],
  imports: [
    CommonModule,
    InterintegrityRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    VsOptionddModule,
    VsChipdropdownModule,
    VsSearchInpModule,
    CboxSummaryModule,
    VsSepDatesModule,
    VsDynamicformsModule
  ],
  providers:[DatePipe]
})
export class InterintegrityModule { }
