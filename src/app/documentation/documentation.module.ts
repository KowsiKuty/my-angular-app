import {CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { DocumentationRoutingModule } from './documentation-routing.module';
import { DocumentsComponent } from './documents/documents.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [DocumentsComponent],
  imports: [
    CommonModule,
    DocumentationRoutingModule,
    FormsModule,ReactiveFormsModule,
    MaterialModule,SharedModule
  ]
})
export class DocumentationModule { }
