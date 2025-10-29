import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { CbdatransRoutingModule } from './cbdatrans-routing.module';
import { CbdatransactionComponent } from './cbdatransaction/cbdatransaction.component';
import { CbdaSubComponent } from './cbda-sub/cbda-sub.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [CbdatransactionComponent, CbdaSubComponent],
  imports: [
    CommonModule,
    CbdatransRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class CbdatransModule { }
