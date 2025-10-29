import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MigrationHeaderComponent } from './migration-header/migration-header.component';
import { MigrationMainComponent } from './migration-main/migration-main.component';
import { DataMigrationRoutingModule } from './data-migration-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [MigrationHeaderComponent, MigrationMainComponent],
  imports: [
    CommonModule,
    DataMigrationRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class DataMigrationModule { }
