import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ToastrModule} from 'ngx-toastr'
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon'
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatMenuModule } from '@angular/material/menu'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatTabsModule } from '@angular/material/tabs';
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProofingRoutingModule } from './proofing-routing.module';
import { ProofingMasterComponent } from './proofing-master/proofing-master.component';
import { ProofingMapComponent} from './proofing-map/proofing-map.component';
import { NumberonlyDirective, TemplateCreateComponent } from './template-create/template-create.component';
import { ProofingUploadComponent } from './proofing-upload/proofing-upload.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { MaterialModule } from '../material/material.module';
import { AgingReportComponent } from './aging-report/aging-report.component';
import { DefineRuleEngineComponent } from './define-rule-engine/define-rule-engine.component';
import { FilterPipe } from './proofing-map/proofing-map.component';
import { AgingBucketComponent } from './aging-bucket/aging-bucket.component';
import { NumberOnlyDirective } from './number-only.directive';
import { AccountSelectionDropdownComponent } from './account-selection-dropdown/account-selection-dropdown.component';
import { HistoryComponent } from './history/history.component';
import { ProofingTransactionComponent } from './proofing-transaction/proofing-transaction.component';
import { ProofingreportComponent } from './proofingreport/proofingreport.component';
import { VsDynamicformsModule } from '@unnilouis.org/vs-dynamicforms';
import {VsSepDatesModule} from '@unnilouis.org/vs-sep-dates'
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileUploadSummaryComponent } from './file-upload-summary/file-upload-summary.component';
import {CboxSummaryModule} from '@unnilouis.org/vs-summary-cbox'
import {VsSearchInpModule} from "@unnilouis.org/vs-search-inp"
import {VsChipdropdownModule} from "@unnilouis.org/vs-chipdropdown"
import {VsOptionddModule} from '@unnilouis.org/vs-optiondd';
import { ProofingS3DownloadComponent } from './proofing-s3-download/proofing-s3-download.component';
import { ConnectionFileuploadComponent } from './connection-fileupload/connection-fileupload.component';
import { NewproofingComponent } from './newproofing/newproofing.component';
import { NewproofinguploadComponent } from './newproofingupload/newproofingupload.component';
import { NewproofingmappingComponent } from './newproofingmapping/newproofingmapping.component';
import { NewconnectionfileComponent } from './newconnectionfile/newconnectionfile.component'
@NgModule({
  declarations: [ProofingMasterComponent,ProofingMapComponent,ProofingUploadComponent, TemplateCreateComponent, AgingReportComponent,CreateAccountComponent,ProofingreportComponent,
  NumberonlyDirective,FilterPipe,
  DefineRuleEngineComponent,
  AgingBucketComponent,
  NumberOnlyDirective,
  AccountSelectionDropdownComponent,
  HistoryComponent,
  ProofingTransactionComponent,
  FileUploadComponent,
  FileUploadSummaryComponent,
  ProofingS3DownloadComponent,
  ConnectionFileuploadComponent,
  NewproofingComponent,
  NewproofinguploadComponent,
  NewproofingmappingComponent,
  NewconnectionfileComponent],
  imports: [
    CommonModule,ProofingRoutingModule,
    MatIconModule,ToastrModule.forRoot(),
    FormsModule, MatInputModule, MatRadioModule, MatTooltipModule, MatProgressSpinnerModule,
    ReactiveFormsModule, HttpClientModule, MatTableModule, MatAutocompleteModule, MatTabsModule,
    MatCheckboxModule, MatSelectModule, MatNativeDateModule, MatButtonModule,NgxSpinnerModule, MatFormFieldModule, MatDatepickerModule, NgxPaginationModule,MaterialModule,VsDynamicformsModule,VsSepDatesModule,
    MatCheckboxModule, MatSelectModule, MatNativeDateModule, MatButtonModule,NgxSpinnerModule, MatFormFieldModule, MatDatepickerModule, NgxPaginationModule,MaterialModule,
    CboxSummaryModule,
    VsSearchInpModule,VsChipdropdownModule,VsOptionddModule
  ]
})
export class ProofingModule { }
