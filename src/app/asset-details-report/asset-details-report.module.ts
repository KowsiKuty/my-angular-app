import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetDetailsComponentComponent } from './asset-details-component/asset-details-component.component';
import { AssetDetailsReportRoutingModule } from './asset-details-report-routing.module';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';



@NgModule({
  declarations: [AssetDetailsComponentComponent],
  imports: [
    CommonModule,AssetDetailsReportRoutingModule,
       MaterialModule,
        ReactiveFormsModule,
        FormsModule
  ]
})
export class AssetDetailsReportModule { }
