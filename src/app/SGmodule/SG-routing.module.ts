import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SgmsterComponent } from './../SGmodule/sgmster/sgmster.component';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { EmployeecatmasterComponent } from './../SGmodule/employeecatmaster/employeecatmaster.component';
import { EmployeetypemasterComponent } from './../SGmodule/employeetypemaster/employeetypemaster.component';
import { MinwagesmasterComponent } from './../SGmodule/minwagesmaster/minwagesmaster.component';
import { StatezonemasterComponent } from './../SGmodule/statezonemaster/statezonemaster.component';
import { VendermarkupmasterComponent } from './../SGmodule/vendermarkupmaster/vendermarkupmaster.component';
import { SecurityloginComponent } from './securitylogin/securitylogin.component';
import { AttendenceDetailsComponent}from './attendence-details/attendence-details.component'
import { HolidaymasterComponent } from './holidaymaster/holidaymaster.component';
import { SecurityguardpaymentComponent } from './securityguardpayment/securityguardpayment.component';
import { VendormarkupComponent } from './vendormarkup/vendormarkup.component';
import { PaymentfreezereportComponent } from './paymentfreezereport/paymentfreezereport.component';
import { BranchCertificationComponent} from './branch-certification/branch-certification.component'
import { BranchcertSummaryComponent} from './branchcert-summary/branchcert-summary.component'
import { BranchViewComponent} from'./branch-view/branch-view.component'
import { BranchCertifyEditComponent} from './branch-certify-edit/branch-certify-edit.component'
import { InvoiceSummaryComponent} from './invoice-summary/invoice-summary.component'
import { AddInvoiceComponent } from './add-invoice/add-invoice.component'
import { InvoiceUpdateComponent} from './invoice-update/invoice-update.component'
import { InvoiceViewComponent} from './invoice-view/invoice-view.component'
import { HolidayUpdateComponent} from './holiday-update/holiday-update.component'
import { MonthlySchedulerComponent } from './monthly-scheduler/monthly-scheduler.component';
 
const routes: Routes = [ 
  {
  path: '', canActivate: [CanActivateGuardService],
  children: [
  { path: 'sgmaster', component: SgmsterComponent, canActivate:[CanActivateGuardService] },
  { path: "sgmaster/:id", component: SgmsterComponent, canActivate:[CanActivateGuardService]},
  { path:'employeecat',component:EmployeecatmasterComponent, canActivate:[CanActivateGuardService]},
  { path:'employeetype',component:EmployeetypemasterComponent},
  { path:'minwage',component:MinwagesmasterComponent, canActivate:[CanActivateGuardService]},
  { path:'statezone',component:StatezonemasterComponent, canActivate:[CanActivateGuardService]},
  { path:'vender',component:VendermarkupmasterComponent, canActivate:[CanActivateGuardService]},
  { path:'Securitylogin',component:SecurityloginComponent, canActivate:[CanActivateGuardService]},
  { path:'holidaymaster',component:HolidaymasterComponent, canActivate:[CanActivateGuardService]},
  { path:'securityguardpayment',component:SecurityguardpaymentComponent, canActivate:[CanActivateGuardService]},
  // { path:'securityguardpayment/:id',component:SecurityguardpaymentComponent, canActivate:[CanActivateGuardService]},
  { path:'vendormarkup',component:VendormarkupComponent, canActivate:[CanActivateGuardService]},
  { path:'paymentfreeze',component: PaymentfreezereportComponent, canActivate:[CanActivateGuardService]},
  { path:'attendence',component:AttendenceDetailsComponent, canActivate:[CanActivateGuardService]},
  { path:'branch',component:BranchCertificationComponent, canActivate:[CanActivateGuardService]},
  { path:'branchsummary',component:BranchcertSummaryComponent, canActivate:[CanActivateGuardService]},
  { path:'branchview',component:BranchViewComponent, canActivate:[CanActivateGuardService]},
  { path:'branchcertifyedit', component:BranchCertifyEditComponent, canActivate:[CanActivateGuardService]},
  { path:'invoiceSummary', component: InvoiceSummaryComponent, canActivate:[CanActivateGuardService]},
  { path:'addInvoice', component: AddInvoiceComponent, canActivate:[CanActivateGuardService]},
  { path:'invoiceUpdate', component: InvoiceUpdateComponent, canActivate:[CanActivateGuardService]},
  { path:'invoiceView', component: InvoiceViewComponent, canActivate:[CanActivateGuardService]},
  { path:'premiseadd',component:VendormarkupComponent, canActivate:[CanActivateGuardService]},
  { path:'holidayUpdate',component:HolidayUpdateComponent, canActivate:[CanActivateGuardService]},
  { path:'sg_scheduler',component:MonthlySchedulerComponent, canActivate:[CanActivateGuardService]}
]
}
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    



exports: [RouterModule]
  })
  export class SGRoutingModule { }