import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MemoService } from "./memo.service";
import { MemoViewComponent } from '../ememo/memo-view/memo-view.component';
import { MemoForwardComponent } from '../ememo/memo-forward/memo-forward.component';
import { MemoComponent } from '../ememo/memo/memo.component'
import { SummaryListComponent } from '../ememo/mastersummary/summary-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { CreateDepartmentComponent } from '../ememo/create-department/create-department.component'
// import { MemoDepartentEditComponent } from '../ememo/memo-departent-edit/memo-departent-edit.component'
// import { CreateCategoryComponent } from '../ememo/create-category/create-category.component'
// import { MemoCategoryEditComponent } from '../ememo/memo-category-edit/memo-category-edit.component'
// import { SubcategoryCreateComponent } from '../ememo/subcategory-create/subcategory-create.component'
// import { MemoSubCategoryEditComponent } from '../ememo/memo-sub-category-edit/memo-sub-category-edit.component';
import { EmployeeDeptMapComponent } from '../ememo/employee-dept-map/employee-dept-map.component';
// import { EmployeeViewComponent } from '../ememo/employee-view/employee-view.component';
// import { DepartmentViewComponent } from '../ememo/department-view/department-view.componentt';
import { MemosummaryComponent } from '../ememo/memosummary/memosummary.component';
import { MemoindividualComponent } from '../ememo/memoindividual/memoindividual.component';
import { MemodeptComponent } from '../ememo/memodept/memodept.component';
import { MemoMasterComponent } from '../ememo/memo-master/memo-master.component';
import { CreatePriorityComponent } from '../ememo/create-priority/create-priority.component';
import { PriorityEditComponent } from '../ememo/priority-edit/priority-edit.component';
import { MemoredraftComponent } from '../ememo/memoredraft/memoredraft.component';
import { EmemoRoutingModule } from './ememo-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { MemoboardComponent } from './memoboard/memoboard.component';
import { MemoskipComponent } from './memoskip/memoskip.component';
import { MemoreportComponent } from './memoreport/memoreport.component';
import { ToastrModule } from 'ngx-toastr';
import { AttendancesummaryComponent } from './attendancesummary/attendancesummary.component';
import { AttendancecreateComponent } from './attendancecreate/attendancecreate.component';
import { VsDynamicformsModule } from '@unnilouis.org/vs-dynamicforms'
import { VsDepDropdownModule } from '@unnilouis.org/vs-dep-dropdown';
import { VsChipdropdownModule } from '@unnilouis.org/vs-chipdropdown';
import { VsSepDatesModule } from '@unnilouis.org/vs-sep-dates'
import { VsSearchInpModule } from '@unnilouis.org/vs-search-inp';
import { CboxSummaryModule } from '@unnilouis.org/vs-summary-cbox';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxSummernoteModule } from 'ngx-summernote';
import { ViewrightscreateComponent } from './viewrightscreate/viewrightscreate.component';
import { SummaryTabComponent } from './summary-tab/summary-tab.component';

@NgModule({
  declarations: [
    MemoViewComponent, MemoForwardComponent, MemoComponent,
    SummaryListComponent,
    EmployeeDeptMapComponent,
    MemosummaryComponent,
    MemoindividualComponent,
    MemodeptComponent,
    MemoMasterComponent,
    CreatePriorityComponent,
    PriorityEditComponent,
    MemoredraftComponent,
    MemoboardComponent,
    MemoskipComponent,
    MemoreportComponent,
    AttendancesummaryComponent,
    AttendancecreateComponent,
    ViewrightscreateComponent,
    SummaryTabComponent,
  ],
  imports: [
    CommonModule, EmemoRoutingModule,
    MaterialModule,
    FormsModule,
    NgbModule,
    SharedModule,
    ReactiveFormsModule,
    CboxSummaryModule,
    SharedModule, MaterialModule,
    NgxSummernoteModule,

    CboxSummaryModule, VsDynamicformsModule, VsDepDropdownModule, VsChipdropdownModule, VsSepDatesModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  exports: [],

  entryComponents: [MemoindividualComponent, MemodeptComponent],
})
export class EmemoModule { }
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http)
}