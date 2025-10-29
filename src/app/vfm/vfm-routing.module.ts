import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../can-activate-guard.service';
import {VfmSummaryComponent} from './vfm-summary/vfm-summary.component';
import {FleetMakerComponent} from './fleet-maker/fleet-maker.component';
import {FleetViewComponent} from './fleet-view/fleet-view.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { ServiceDetailComponent } from './service-detail/service-detail.component';
import { DocumentComponent } from './document/document.component';
import { TripDetailComponent } from './trip-detail/trip-detail.component';
import { FastTagComponent } from './fast-tag/fast-tag.component';
import { FleetcheckerSummaryComponent } from './fleetchecker-summary/fleetchecker-summary.component';
import { VehicleDetailComponent } from './vehicle-detail/vehicle-detail.component';
import { MonthlyDetailComponent } from './monthly-detail/monthly-detail.component';
import { ModificationViewComponent } from './modification-view/modification-view.component';

const routes: Routes = [ 
  {
  path: '', canActivate: [CanActivateGuardService],
  children: [
   
    { path:"vfm_summary", component: VfmSummaryComponent },
    { path:"fleet_maker", component: FleetMakerComponent },
    { path:"fleet_view", component: FleetViewComponent },
    { path:"insurance", component: InsuranceComponent },
    { path:"service_detail", component: ServiceDetailComponent },
    { path:"document", component: DocumentComponent },
    { path:"trip_detail", component: TripDetailComponent },
    { path:"fast_tag", component: FastTagComponent },
    { path:"fleet_summary", component: FleetcheckerSummaryComponent },
    { path:"vehicle_detail", component: VehicleDetailComponent },
    { path:"monthly_detail", component: MonthlyDetailComponent },
    { path:"modify", component: ModificationViewComponent }

  ]
}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VFMRoutingModule { }