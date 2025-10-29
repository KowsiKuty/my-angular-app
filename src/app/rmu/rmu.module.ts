import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from '../material/material.module';
import { RmuRoutingModule } from './rmu-routing.module';
import { RmuTransactionsComponent } from './rmu-transactions/rmu-transactions.component';
import { BarcodeAssignSummaryComponent } from './barcode-assign-summary/barcode-assign-summary.component';
import { BarcodeRequestSummaryComponent } from './barcode-request-summary/barcode-request-summary.component';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BarcodeRequestComponent } from './barcode-request/barcode-request.component';
import { RmuApiServiceService } from './rmu-api-service.service';
import { BarcoderAssignComponent } from './barcoder-assign/barcoder-assign.component';
import { ArchivalSummaryComponent } from './archival-summary/archival-summary.component';
import { RetrievalSummaryComponent } from './retrieval-summary/retrieval-summary.component';
import { ArchivalformComponent } from './archivalform/archivalform.component';
import { RetrievalformComponent } from './retrievalform/retrievalform.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReturnComponent } from './return/return.component';
import { AdminpageComponent } from './adminpage/adminpage.component';
import { ReturnrequestComponent } from './returnrequest/returnrequest.component';
import { AddressComponent } from './address/address.component';
import { AddbarcodesComponent } from './addbarcodes/addbarcodes.component';
import { RemovalComponent } from './removal/removal.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReturnformComponent } from './returnform/returnform.component';
import { ViewarchivalComponent } from './viewarchival/viewarchival.component';
import { BarcodesummaryComponent } from './barcodesummary/barcodesummary.component';
import { ArchivaladminComponent } from './archivaladmin/archivaladmin.component';
import { VendorpageComponent } from './vendorpage/vendorpage.component';
import { VendorRetrievalSummaryComponent } from './vendor-retrieval-summary/vendor-retrieval-summary.component';
import { VendorarchivalComponent } from './vendorarchival/vendorarchival.component';
import { RetrievalAdminSummaryComponent } from './retrieval-admin-summary/retrieval-admin-summary.component';
import { FilesSelectionComponent } from './files-selection/files-selection.component';
import { DestroyComponent } from './destroy/destroy.component';
import { DestroysummaryComponent } from './destroysummary/destroysummary.component';
import { DestroyapproveComponent } from './destroyapprove/destroyapprove.component';
import { RmuMastersComponent } from './rmu-masters/rmu-masters.component';
import { VendorInitiationComponent } from './vendor-initiation/vendor-initiation.component';
import { CullingSummaryComponent } from './culling-summary/culling-summary.component';
import { CullingSelectionComponent } from './culling-selection/culling-selection.component';
import { LegitimateComponent } from './legitimate/legitimate.component';
import { SharedModule } from '../shared/shared.module';
import { VendordestroyComponent } from './vendordestroy/vendordestroy.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { CullingProcessedSummaryComponent } from './culling-processed-summary/culling-processed-summary.component';
import { AgingbucketComponent } from './agingbucket/agingbucket.component';
import { VsDynamicformsModule } from '@unnilouis.org/vs-dynamicforms';
import { VsDepDropdownModule } from '@unnilouis.org/vs-dep-dropdown';
import { CboxSummaryModule } from '@unnilouis.org/vs-summary-cbox';
import { VsSearchInpModule } from '@unnilouis.org/vs-search-inp';
import { ArchivalmasterComponent } from './archivalmaster/archivalmaster.component';
import { BoxMasterComponent } from './box-master/box-master.component';
import { ProductMasterComponent } from './product-master/product-master.component';
import { AcacknowledgementComponent } from './acacknowledgement/acacknowledgement.component';
import { UploaddocumentComponent } from './uploaddocument/uploaddocument.component';
import { FileDocumentComponent } from './file-document/file-document.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [RmuTransactionsComponent, BarcodeAssignSummaryComponent, BarcodeRequestSummaryComponent, 
    BarcodeRequestComponent, BarcoderAssignComponent, ArchivalSummaryComponent, RetrievalSummaryComponent,
     ArchivalformComponent, RetrievalformComponent, ReturnComponent, AdminpageComponent, ReturnrequestComponent,
      AddressComponent, AddbarcodesComponent, RemovalComponent, ReturnformComponent, ViewarchivalComponent,
       BarcodesummaryComponent, ArchivaladminComponent, VendorpageComponent, VendorRetrievalSummaryComponent, 
       VendorarchivalComponent, RetrievalAdminSummaryComponent, FilesSelectionComponent, RmuMastersComponent, VendorInitiationComponent, DestroyComponent, DestroysummaryComponent, DestroyapproveComponent, CullingSummaryComponent, CullingSelectionComponent, LegitimateComponent, VendordestroyComponent, ProductCreateComponent, CullingProcessedSummaryComponent, AgingbucketComponent, ArchivalmasterComponent, BoxMasterComponent, ProductMasterComponent, AcacknowledgementComponent, UploaddocumentComponent, FileDocumentComponent],
  imports: [
    CommonModule,
    RmuRoutingModule,
    MaterialModule,  MatCheckboxModule,SharedModule,
    VsDynamicformsModule,
    VsDepDropdownModule,
    CboxSummaryModule,
    VsSearchInpModule,
    PdfViewerModule
  ],
  providers: [
    { provide: RmuApiServiceService }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RmuModule {

}
