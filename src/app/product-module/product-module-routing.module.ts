import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductSummaryComponent } from './Product/product-summary/product-summary.component';
import { ProductCreateComponent } from './Product/product-create/product-create.component';
import { ProductMasterComponent } from './ProductMaster/product-master/product-master.component';
import { ProductViewComponent } from './Product/product-view/product-view.component';
import { LeadslandingpageComponent } from './Leads/leadslandingpage/leadslandingpage.component';

import { ProductMasterCreateComponent } from './ProductMaster/product-master-create/product-master-create.component';
import { LeadsDetailsComponent } from './Leads/leads-details/leads-details.component';
import { EmployeeTaskComponent } from './employee-task/employee-task.component';

import { TaskTemplateSummaryFormComponent } from './ProductMaster/task-template-summary-form/task-template-summary-form.component';
import { FollowUpLeadsAndTaskComponent } from './Leads/follow-up-leads-and-task/follow-up-leads-and-task.component';
import { UploadHistoryComponent } from './Leads/upload-history/upload-history.component';

import { LeadsdatapageComponent } from './Leads/leadsdatapage/leadsdatapage.component';

// import { UploadHistoryViewComponent } from './Leads/upload-history-view/upload-history-view.component';
import { LeadAllocationComponent } from './Lead-Allocation/lead-allocation/lead-allocation.component';
import { CreatetemplateComponent } from './Leads/createtemplate/createtemplate.component';
import { VendorAllocationHistoryComponent } from './Lead-Allocation/vendor-allocation-history/vendor-allocation-history.component';
import { DashboardComponent } from './Leads/dashboard/dashboard.component';
// import { DashviewComponent } from './Leads/dashview/dashview.component';
import { LeadsuploadComponent } from './Leads/leadsupload/leadsupload.component';
// import { UploadHistoryComponent } from './Leads/upload-history/upload-history.component';

const routes: Routes = [
  { path: 'crm/:data', component: ProductSummaryComponent },
  { path: 'productadd', component: ProductCreateComponent },
  { path: 'crmmaster', component: ProductMasterComponent },
  { path: 'productview/:data', component: ProductViewComponent },
  { path: 'mainpage', component: LeadslandingpageComponent },
  { path: 'productmastercreate', component: ProductMasterCreateComponent },
  { path: 'viewleads', component: LeadsDetailsComponent },
  { path: 'employeetask', component: EmployeeTaskComponent },
  { path: 'tasktemplate', component: TaskTemplateSummaryFormComponent },
  { path: 'viewfollowup', component: FollowUpLeadsAndTaskComponent },
  { path: 'leadsupload', component: UploadHistoryComponent },
  { path: 'leadsdata', component: LeadsdatapageComponent },
  // { path: 'historyview', component: UploadHistoryViewComponent },
  { path: 'leadallocation', component: LeadAllocationComponent },
  {path:'newtemplate', component: CreatetemplateComponent},
  {path:'vendorallocationhistory', component: VendorAllocationHistoryComponent},
  {path: 'report', component: DashboardComponent},
  {path:'newCamp', component: LeadsuploadComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductModuleRoutingModule { }
