import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductModuleRoutingModule } from './product-module-routing.module';
import { ProductSummaryComponent } from './Product/product-summary/product-summary.component';
import { ProductCreateComponent } from './Product/product-create/product-create.component';
import { ProductMasterComponent } from './ProductMaster/product-master/product-master.component';
import { ProductMasterCreateComponent } from './ProductMaster/product-master-create/product-master-create.component';
import { ProductViewComponent } from './Product/product-view/product-view.component';


import { LeadsMainpageComponent } from './Leads/leads-mainpage/leads-mainpage.component';
import { LeadslandingpageComponent } from './Leads/leadslandingpage/leadslandingpage.component';
import { LeadsdatapageComponent } from './Leads/leadsdatapage/leadsdatapage.component';

import { SearchfilterPipe } from './Leads/searchfilter.pipe';
import { SharedModule } from '../shared/shared.module';
import { TaskTemplateSummaryFormComponent } from './ProductMaster/task-template-summary-form/task-template-summary-form.component';
import { MaterialModule } from '../material/material.module';
import { LeadsDetailsComponent } from './Leads/leads-details/leads-details.component';
import { EmployeeTaskComponent } from './employee-task/employee-task.component';
import { FollowUpLeadsAndTaskComponent } from './Leads/follow-up-leads-and-task/follow-up-leads-and-task.component';
import { TaskTemplateViewComponent } from './ProductMaster/task-template-view/task-template-view.component';
import { DashboardComponent } from './Leads/dashboard/dashboard.component';
import { LineChartComponent } from './Leads/line-chart/line-chart.component';
import { EmployeeTaskEditComponent } from './employee-task-edit/employee-task-edit.component';
import { UploadHistoryComponent } from './Leads/upload-history/upload-history.component';
// import { UploadHistoryViewComponent } from './Leads/upload-history-view/upload-history-view.component';
import { LeadAllocationComponent } from './Lead-Allocation/lead-allocation/lead-allocation.component';
import { CreatetemplateComponent } from './Leads/createtemplate/createtemplate.component';
import { DialogComponent } from './Leads/dialog/dialog.component';
import { AppResizeableDirective } from './app-resizeable.directive';
import { VendorAllocationHistoryComponent } from './Lead-Allocation/vendor-allocation-history/vendor-allocation-history.component';

import { EditableDirective } from './editable.directive';
import { EditableModalComponent } from './editable-modal/editable-modal.component';
import { DuplicateLeadComponent } from './Leads/duplicate-lead/duplicate-lead.component';
import { CampaignComponent } from './Leads/campaign/campaign.component';
import { CampaignCreationComponent } from './Leads/campaign-creation/campaign-creation.component';
// import { DashviewComponent } from './Leads/dashview/dashview.component';
import { LeadsDashboardComponent } from './Leads/leads-dashboard/leads-dashboard.component';
import { CustomleadsComponent } from './Leads/customleads/customleads.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
// import {MatStepperModule} from '@angular/material/stepper';
import { MatStepperModule } from '@angular/material/stepper';
import { Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LeadsuploadComponent } from './Leads/leadsupload/leadsupload.component';








@NgModule({

  declarations: [
    ProductMasterComponent, ProductMasterCreateComponent, ProductSummaryComponent, ProductCreateComponent, ProductViewComponent,
    LeadsMainpageComponent, LeadslandingpageComponent, LeadsdatapageComponent, SearchfilterPipe, LeadsDetailsComponent,
    EmployeeTaskComponent, TaskTemplateSummaryFormComponent,
    ProductCreateComponent, ProductViewComponent, LeadsMainpageComponent, LeadslandingpageComponent,
    LeadsdatapageComponent, SearchfilterPipe, LeadsDetailsComponent, FollowUpLeadsAndTaskComponent, TaskTemplateViewComponent,
    UploadHistoryComponent, EmployeeTaskEditComponent, DashboardComponent, LineChartComponent,
    LeadAllocationComponent, CreatetemplateComponent, DialogComponent, VendorAllocationHistoryComponent,
    AppResizeableDirective, EditableDirective, EditableModalComponent, DuplicateLeadComponent, CampaignComponent, LeadsuploadComponent,


 LeadsDashboardComponent, CampaignCreationComponent, CustomleadsComponent],

  imports: [
    CommonModule,
    ProductModuleRoutingModule,
    MaterialModule,
    SharedModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule

  ],




})
export class ProductModuleModule { }
