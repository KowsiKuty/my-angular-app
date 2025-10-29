import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { RetrievalformComponent } from './retrievalform/retrievalform.component';
import { RmuTransactionsComponent } from './rmu-transactions/rmu-transactions.component';
import { ViewarchivalComponent } from './viewarchival/viewarchival.component';
import { AddbarcodesComponent } from './addbarcodes/addbarcodes.component';
import { BarcodeAssignSummaryComponent } from './barcode-assign-summary/barcode-assign-summary.component';
import { AdminpageComponent } from './adminpage/adminpage.component';
import { BarcodesummaryComponent } from './barcodesummary/barcodesummary.component';
import { ArchivaladminComponent } from './archivaladmin/archivaladmin.component';
import { VendorRetrievalSummaryComponent } from './vendor-retrieval-summary/vendor-retrieval-summary.component';
import { VendorarchivalComponent } from './vendorarchival/vendorarchival.component';
import { RetrievalAdminSummaryComponent } from './retrieval-admin-summary/retrieval-admin-summary.component';
import { RmuMastersComponent } from './rmu-masters/rmu-masters.component';
import { DestroyapproveComponent } from './destroyapprove/destroyapprove.component';
import { CullingSelectionComponent } from './culling-selection/culling-selection.component';
import { VendordestroyComponent } from './vendordestroy/vendordestroy.component';
const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [
      { path: "rmu_summary", component: RmuTransactionsComponent },
      { path: "retrievalform", component: RetrievalformComponent },
      { path: "viewarchival", component: ViewarchivalComponent },
      { path: "addbarcodes", component: AddbarcodesComponent },
      { path: "barcodeassign", component: BarcodeAssignSummaryComponent },
      { path: "adminpage", component: AdminpageComponent },
      { path: "barcodesummary", component: BarcodesummaryComponent },
      { path: "archivaladmin", component: ArchivaladminComponent },
      { path: "vendor-retrieval-summary", component: VendorRetrievalSummaryComponent },
      { path: "vendorarchival", component: VendorarchivalComponent },
      {path:"retrieval-admin-summary", component:RetrievalAdminSummaryComponent},
      {path:"rmumaster", component:RmuMastersComponent},
      {path:"destroyapprove", component:DestroyapproveComponent},
      {path:'culling-selection',component:CullingSelectionComponent},
      {path:'destroy-vendor',component:VendordestroyComponent}


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RmuRoutingModule {

}
