import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ProjectComponent } from './project/project.component';
// import { MemoViewComponent } from './ememo/memo-view/memo-view.component';
// import { MemoForwardComponent } from './ememo/memo-forward/memo-forward.component';
// import { MemoComponent } from './ememo/memo/memo.component';
import { LoginComponent } from './login/login.component';
import { SummaryListComponent } from './ememo/mastersummary/summary-list.component';
// import { CreateCategoryComponent } from './ememo/create-category/create-category.component';
// import { SubcategoryCreateComponent } from './ememo/subcategory-create/subcategory-create.component';
// import { MemoCategoryEditComponent } from './ememo/memo-category-edit/memo-category-edit.component';
// import { MemoSubCategoryEditComponent } from './ememo/memo-sub-category-edit/memo-sub-category-edit.component';
// import { EmployeeDeptMapComponent } from './ememo/employee-dept-map/employee-dept-map.component';
import { CreateAccountComponent} from '../app/create-account/create-account.component'
import { EmployeeSummaryComponent} from '../app/Employee/employee-summary/employee-summary.component'
import { CreateContactComponent} from '../app/Employee/create-contact/create-contact.component'
import { ContactEditComponent} from '../app/Employee/contact-edit/contact-edit.component'
import { CreateDesignationComponent} from '../app/Employee/create-designation/create-designation.component'
import { DesignationEditComponent} from '../app/Employee/designation-edit/designation-edit.component'
import { CreateCountryComponent} from '../app/Employee/create-country/create-country.component'
import { CountryEditComponent} from '../app/Employee/country-edit/country-edit.component'
import { CreateStateComponent} from '../app/Employee/create-state/create-state.component'
import { StateEditComponent} from '../app/Employee/state-edit/state-edit.component'
import { CreateDistrictComponent} from '../app/Employee/create-district/create-district.component'
import { DistrictEditComponent} from '../app/Employee/district-edit/district-edit.component'
import { CreateCityComponent} from '../app/Employee/create-city/create-city.component'
import { CityEditComponent} from '../app/Employee/city-edit/city-edit.component'
import { CreatePincodeComponent} from '../app/Employee/create-pincode/create-pincode.component'
import { PincodeEditComponent} from '../app/Employee/pincode-edit/pincode-edit.component'
// import { DepartmentViewComponent} from '../app/ememo/department-view/department-view.component'
// import { MemosummaryComponent } from './ememo/memosummary/memosummary.component';
// import { MemoMasterComponent} from '../app/ememo/memo-master/memo-master.component'
import { CreatePriorityComponent} from '../app/ememo/create-priority/create-priority.component'
import { PriorityEditComponent} from '../app/ememo/priority-edit/priority-edit.component'
import { CanActivateGuardService } from './can-activate-guard.service';
// import { MemoredraftComponent } from './ememo/memoredraft/memoredraft.component';
import {ReportsComponent} from '../app/reports/reports.component'
import { InsightsComponent } from './reports/insights/insights.component';
import { UtilitiesComponent } from './utilities/utilities.component';
import { EmployeeMobilenoSumarryComponent } from './employee-mobileno-sumarry/employee-mobileno-sumarry.component';
import { VendorRenewalReportComponent } from './vendor-renewal-report/vendor-renewal-report.component';
import { VendorRiskAssesmentComponent } from './vendor-risk-assesment/vendor-risk-assesment.component';
// import { VowSummaryComponent } from './vow-summary/vow-summary.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path:'utilities/mobileupdate',component:UtilitiesComponent,canActivate:[CanActivateGuardService]},
  { path: 'contact', component: ContactComponent, canActivate:[CanActivateGuardService] },
  { path: 'kvb', component: AboutComponent, canActivate:[CanActivateGuardService] },
  { path: 'project', component: ProjectComponent, canActivate:[CanActivateGuardService] },
  // { path: 'createcategory', component: CreateCategoryComponent, canActivate:[CanActivateGuardService] },
  // { path: 'subcategorycreate', component: SubcategoryCreateComponent, canActivate:[CanActivateGuardService] },
  // { path: 'categoryEdit', component: MemoCategoryEditComponent, canActivate:[CanActivateGuardService] },
  // { path: 'subCategoryEdit', component: MemoSubCategoryEditComponent, canActivate:[CanActivateGuardService] },
  // { path: 'empTodeptMap', component: EmployeeDeptMapComponent, canActivate:[CanActivateGuardService] },
  { path: 'createAccount', component: CreateAccountComponent, canActivate:[CanActivateGuardService]},
  { path: 'employeeSummary', component: EmployeeSummaryComponent, canActivate:[CanActivateGuardService]},
  { path: 'createcontact', component: CreateContactComponent, canActivate:[CanActivateGuardService]},
  { path: 'contactEdit', component: ContactEditComponent, canActivate:[CanActivateGuardService]},
  { path: 'createDesignation', component: CreateDesignationComponent, canActivate:[CanActivateGuardService]},
  { path: 'designationEdit', component: DesignationEditComponent, canActivate:[CanActivateGuardService]},
  { path: 'createCountry', component: CreateCountryComponent, canActivate:[CanActivateGuardService]},
  { path: 'countryEdit', component: CountryEditComponent, canActivate:[CanActivateGuardService]},
  { path: 'createState', component:CreateStateComponent, canActivate:[CanActivateGuardService]},
  { path: 'stateEdit', component:StateEditComponent, canActivate:[CanActivateGuardService]},
  { path: 'createDistrict', component: CreateDistrictComponent, canActivate:[CanActivateGuardService]},
  { path: 'districtEdit', component: DistrictEditComponent, canActivate:[CanActivateGuardService]},
  { path: 'createCity', component: CreateCityComponent, canActivate:[CanActivateGuardService]},
  { path: 'cityEdit', component: CityEditComponent, canActivate:[CanActivateGuardService]},
  { path: 'createPincode', component: CreatePincodeComponent, canActivate:[CanActivateGuardService]},
  { path: 'pincodeEdit', component: PincodeEditComponent, canActivate:[CanActivateGuardService]},
  {path:'employee-mobileno-sumarry/mobilesummary',component:EmployeeMobilenoSumarryComponent,canActivate:[CanActivateGuardService]},
  // { path: 'memoMaster', component: MemoMasterComponent, canActivate:[CanActivateGuardService]},
  // { path: 'createPriority', component: CreatePriorityComponent, canActivate:[CanActivateGuardService]},
  // { path: 'priorityEdit', component: PriorityEditComponent, canActivate:[CanActivateGuardService]},
  {path: 'reports',component: ReportsComponent},
  {path:'insights',component:InsightsComponent},
  {path: '', pathMatch: 'full', redirectTo: 'login' },
  {path:'ememo',loadChildren:()=> import("./ememo/ememo.module").then(m=>m.EmemoModule)},
  {path:'rems',loadChildren:()=> import("./rems/rems.module").then(m=>m.RemsModule)},
  {path:'atma',loadChildren:()=> import("./atma/atma.module").then(m=>m.AtmaModule)},
  {path:'prpo',loadChildren:()=> import("./prpo/prpo.module").then(m=>m.PRPOModule)},
  {path:'master',loadChildren:()=> import("./Master/mastermodule.module").then(m=>m.MastermoduleModule)},
  {path:'ppr',loadChildren:()=> import("./ppr/ppr.module").then(m=>m.PprModule)},
  {path:'SGmodule',loadChildren:()=> import("./SGmodule/SGcomponent.module").then(m=>m.SGModule)},
  {path:'fa',loadChildren:()=> import("./fa/fa.module").then(m=>m.FAModule)},
  {path:'tneb',loadChildren:()=> import("./tneb/tneb.module").then(m=>m.TnebModule)},
  {path:'sms',loadChildren:()=> import("./sms/sms.module").then(m=>m.SmsModule)},
  {path:'ta',loadChildren:()=> import("./ta/ta.module").then(m=>m.TAModule)},
  {path:'rmu',loadChildren:()=> import("./rmu/rmu.module").then(m=>m.RmuModule)},
  {path:'proofing',loadChildren:()=> import("./proofing/proofing.module").then(m=>m.ProofingModule)},
  {path:'provision',loadChildren:()=> import("./provision/provision.module").then(m=>m.ProvisionModule)},
  {path:'documentation',loadChildren:()=> import("./documentation/documentation.module").then(m=>m.DocumentationModule)},
  {path:'inward',loadChildren:()=> import("./inward/inward.module").then(m=>m.InwardModule)},
  {path:'dtpc',loadChildren:()=> import("./dtpc/dtpc.module").then(m=>m.DtpcModule)},
  {path:'ECF',loadChildren:()=> import("./ECF/ecfnew.module").then(m=>m.EcfnewModule)},
  {path:'ap',loadChildren:()=> import("./ap/ap.module").then(m=>m.ApModule)},
  {path:'entry',loadChildren: ()=> import('./entry/entry.module').then(m=>m.EntryModule)},
  {path:'vfm',loadChildren:()=> import("./vfm/vfm.module").then(m=>m.VfmModule)},
  {path:'report',loadChildren:()=> import("./reports/reports.module").then(m=>m.ReportsModule)},
  {path:'frs',loadChildren:()=> import("./frs/frs.module").then(m=>m.FrsModule)},
  {path:'brs',loadChildren:()=> import("./brs/brs.module").then(m=>m.BrsModule)},
  {path:'interintegrity', loadChildren:()=> import("./interintegrity/interintegrity.module").then(m=>m.InterintegrityModule)},
  {path:'JV',loadChildren:()=> import("./JV/jv.module").then(m=>m.JvModule)},
  {path:'JW',loadChildren:()=> import("./JW/jw.module").then(m=>m.JwModule)},
  {path:'ECFAP',loadChildren:()=>import("./ECFAP/ecfap.module").then(m=>m.EcfapModule)},
  {path:'drs',loadChildren:()=>import("./drs/drs.module").then(m=>m.DrsModule)},
  {path:'bre',loadChildren:()=>import("./bre/bre.module").then(m=>m.BreModule)},
  {path:'lca',loadChildren:()=>import("./lca/lca.module").then(m=>m.LcaModule)},
  {path:'VendorRenewalReport',component:VendorRenewalReportComponent},
  {path: 'VendorRenewalReport', component: VendorRenewalReportComponent, canActivate: [CanActivateGuardService] },
  {path: 'VendorRiskAssesment', component: VendorRiskAssesmentComponent, canActivate: [CanActivateGuardService] },
  {path:'crm',loadChildren:()=> import("./product-module/product-module.module").then(m=>m.ProductModuleModule)},
  {path:'user',loadChildren:()=> import("./user-details/user-details.module").then(m=>m.UserDetailsModule)},
  { path: 'lead', loadChildren: () => import ("./lead/lead.module").then(m => m.LeadModule), canActivate: [CanActivateGuardService]},
  { path: 'vow', loadChildren: () => import("./vow/vow/vow.module").then(m=>m.VowModule),canActivate: [CanActivateGuardService]},
  {path:'crmreport',loadChildren: () => import ("./crmreport/reports.module").then(m=>m.ReportsModule)},
  {path:'tb_route',loadChildren:()=>import("./tb-report/tb-report.module").then(m=>m.TbReportModule)},
  {path:'dss',loadChildren:()=> import("./dss/dss.module").then(m=>m.DssModule)},
  {path:'reconsib',loadChildren:()=> import("./recon/recon.module").then(m=>m.ReconModule)},
  {path:'dashboard',loadChildren:()=> import("./dashboard/dashboard.module").then(m=>m.DashboardModule)},
  {path:'dynamic',loadChildren:()=> import("./dynamic-report/ppr.module").then(m=>m.dynamicModule)},
  {path:'cbda',loadChildren:()=>import("./cbdareport/cbdareport.module").then(m=>m.CbdareportModule)},
  {path:'cbdareport',loadChildren:()=>import("./cbdatrans/cbdatrans.module").then(m=>m.CbdatransModule)},
  {path:'dataMigrate',loadChildren:()=>import("./data-migration/data-migration.module").then(m=>m.DataMigrationModule)},
  {path:'AssetDetailsReport',loadChildren:()=>import("./asset-details-report/asset-details-report.module").then(m=>m.AssetDetailsReportModule)},


];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }