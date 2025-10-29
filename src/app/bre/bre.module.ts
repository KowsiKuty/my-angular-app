import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { BreRoutingModule } from './bre-routing.module';
import { BreComponent } from './bre/bre.component';
import { ExpenseCreateComponent } from './expense-create/expense-create.component';
import { ToastrModule } from 'ngx-toastr';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SharedModule } from '../shared/shared.module';
import { BranchExpCreateComponent } from './branch-exp-create/branch-exp-create.component';
import { BranchExpenseViewComponent } from './branch-expense-view/branch-expense-view.component';
import { BreToEcfViewComponent } from './bre-to-ecf-view/bre-to-ecf-view.component';
import { ClaimMakerComponent } from './claim-maker/claim-maker.component';
import { ManualScheduleComponent } from './manual-schedule/manual-schedule.component';

@NgModule({
  declarations: [BreComponent, ExpenseCreateComponent, BranchExpCreateComponent, BranchExpenseViewComponent, BreToEcfViewComponent, ClaimMakerComponent, ManualScheduleComponent],
  imports: [
    CommonModule,
    BreRoutingModule,
    MaterialModule,
    ToastrModule,
    PdfViewerModule,
    SharedModule
  ]
})
export class BreModule { }
