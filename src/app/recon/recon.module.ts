import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReconRoutingModule } from './recon-routing.module';
import { ReconexternalComponent } from './reconexternal/reconexternal.component'
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from '../material/material.module';
import {VsDynamicformsModule} from '@unnilouis.org/vs-dynamicforms';
import {VsDepDropdownModule} from '@unnilouis.org/vs-dep-dropdown';
import {VsSepDatesModule} from '@unnilouis.org/vs-sep-dates';
import {CboxSummaryModule} from '@unnilouis.org/vs-summary-cbox';
import {VsSearchInpModule} from "@unnilouis.org/vs-search-inp";
import {VsChipdropdownModule} from "@unnilouis.org/vs-chipdropdown";
import {VsOptionddModule} from '@unnilouis.org/vs-optiondd';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReconprocessComponent } from './reconprocess/reconprocess.component';

@NgModule({
  declarations: [ReconexternalComponent, ReconprocessComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReconRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatTableModule,
    VsDynamicformsModule,
    VsDepDropdownModule,
    VsSepDatesModule,
    CboxSummaryModule,
    VsSearchInpModule,
    VsChipdropdownModule,
    VsOptionddModule,NgbModule
  ]
})
export class ReconModule { }
