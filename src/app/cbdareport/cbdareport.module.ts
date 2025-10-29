import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { CbdareportRoutingModule } from './cbdareport-routing.module';
import { FileuploadmasterCbdaComponent } from './fileuploadmaster-cbda/fileuploadmaster-cbda.component';
import { IncusemasterCbdaComponent } from './incusemaster-cbda/incusemaster-cbda.component';
import { MappingmasterCbdaComponent } from './mappingmaster-cbda/mappingmaster-cbda.component';
import { SpecialproductCbdaComponent } from './specialproduct-cbda/specialproduct-cbda.component';
import { CbdamainComponent } from './cbdamain/cbdamain.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VsSearchInpModule } from '@unnilouis.org/vs-search-inp';
import { CboxSummaryModule } from '@unnilouis.org/vs-summary-cbox';
import { VsSepDatesModule } from '@unnilouis.org/vs-sep-dates';
import { VsDynamicformsModule } from '@unnilouis.org/vs-dynamicforms';
import { VsOptionddModule } from '@unnilouis.org/vs-optiondd';



@NgModule({
  declarations: [FileuploadmasterCbdaComponent, IncusemasterCbdaComponent, MappingmasterCbdaComponent, SpecialproductCbdaComponent, CbdamainComponent],
  imports: [
    CommonModule,
    CbdareportRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    VsSearchInpModule,
    CboxSummaryModule,
    VsSepDatesModule,
    VsDynamicformsModule,
    VsOptionddModule
  ]
})
export class CbdareportModule { }
