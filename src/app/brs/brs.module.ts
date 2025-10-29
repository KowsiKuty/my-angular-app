import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrsRoutingModule } from './brs-routing.module';
import { BrstransactionsComponent } from './brstransactions/brstransactions.component';
import { MaterialModule } from '../material/material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrsmasterComponent } from './brsmaster/brsmaster.component';
import { NewbrsformComponent } from './newbrsform/newbrsform.component';
import { NewbrsrulesetsComponent } from './newbrsrulesets/newbrsrulesets.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { RulemappingComponent } from './rulemapping/rulemapping.component';
import { KnockoffhistoryComponent } from './knockoffhistory/knockoffhistory.component';
import { CreateaccountComponent } from './createaccount/createaccount.component';
import { AutoknockoffComponent } from './autoknockoff/autoknockoff.component';
import { ViewsinglerecordComponent } from './viewsinglerecord/viewsinglerecord.component';
import { NewtemplatecreateComponent } from './newtemplatecreate/newtemplatecreate.component';
import { RulesummaryComponent } from './rulesummary/rulesummary.component';
import { NwisefinsummComponent } from './nwisefinsumm/nwisefinsumm.component';
import { BanksummaryComponent } from './banksummary/banksummary.component';
import {MatTableModule} from '@angular/material/table';
import { AccountrulemappingComponent } from './accountrulemapping/accountrulemapping.component';
import { PurgehistoryComponent } from './purgehistory/purgehistory.component';
import { IntegrityComponent } from './integrity/integrity.component';
import { ActionmasterComponent } from './actionmaster/actionmaster.component';
import { BrsUnknockoffdataComponent } from './brs-unknockoffdata/brs-unknockoffdata.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BrsUnmatchedComponent } from './brs-unmatched/brs-unmatched.component';
import { BrsReportComponent } from './brs-report/brs-report.component';
import { RulemasterCurdComponent } from './rulemaster-curd/rulemaster-curd.component';
import {VsDynamicformsModule} from '@unnilouis.org/vs-dynamicforms';
import { CboxSummaryModule } from '@unnilouis.org/vs-summary-cbox';
import { VsSearchInpModule } from '@unnilouis.org/vs-search-inp';
import {VsDepDropdownModule} from '@unnilouis.org/vs-dep-dropdown';
import { AccountMappingComponent } from './account-mapping/account-mapping.component'

// import { DraggableColumnDirective } from './draggable-column.directive';



@NgModule({
  declarations: [BrstransactionsComponent, BrsmasterComponent, NewbrsformComponent, NewbrsrulesetsComponent, RulemappingComponent, KnockoffhistoryComponent, CreateaccountComponent, AutoknockoffComponent, ViewsinglerecordComponent, NewtemplatecreateComponent, RulesummaryComponent, NwisefinsummComponent, BanksummaryComponent, AccountrulemappingComponent, PurgehistoryComponent, IntegrityComponent, ActionmasterComponent, BrsUnknockoffdataComponent, BrsUnmatchedComponent, BrsReportComponent, RulemasterCurdComponent, AccountMappingComponent,],
  imports: [
    CommonModule,
    BrsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MatSlideToggleModule,
    MatTableModule,
    InfiniteScrollModule,
    VsDynamicformsModule,VsDepDropdownModule,
    CboxSummaryModule,VsSearchInpModule
  ],
  providers:[],
  exports:[VsDynamicformsModule]
})
export class BrsModule { }
