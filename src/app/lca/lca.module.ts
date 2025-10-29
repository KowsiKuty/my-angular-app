import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LcaComponent } from './lca/lca.component';
import { LcaRoutingModule } from './lca-routing.module';
import { LcaCreationComponent } from './lca-creation/lca-creation.component';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MaterialModule } from '../material/material.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { LcaApprovalSummaryComponent } from './lca-approval-summary/lca-approval-summary.component';
import { LcaViewComponent } from './lca-view/lca-view.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { LcaExpenseComponent } from './lca-expense/lca-expense.component';



@NgModule({
  declarations: [LcaComponent, LcaCreationComponent, LcaApprovalSummaryComponent, LcaViewComponent, LcaExpenseComponent],
  imports: [
    CommonModule,LcaRoutingModule,MatIconModule,MatInputModule,MatFormFieldModule,MaterialModule,
    MatDatepickerModule,MatSelectModule,MatCardModule,MatNativeDateModule,ReactiveFormsModule,FormsModule,
    PdfViewerModule,
  ]
})
export class LcaModule { }
