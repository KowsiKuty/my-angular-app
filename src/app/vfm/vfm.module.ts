import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VfmSummaryComponent } from './vfm-summary/vfm-summary.component';
import { ToastrModule } from 'ngx-toastr'
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';        
import { VFMRoutingModule } from './vfm-routing.module';
import { FleetmakerSummaryComponent } from './fleetmaker-summary/fleetmaker-summary.component';
import { FleetcheckerSummaryComponent } from './fleetchecker-summary/fleetchecker-summary.component';
import { FleetMakerComponent } from './fleet-maker/fleet-maker.component';
import { FleetViewComponent } from './fleet-view/fleet-view.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { FastTagComponent } from './fast-tag/fast-tag.component';
import { ServiceDetailComponent } from './service-detail/service-detail.component';
import { DocumentComponent } from './document/document.component';
import { TripDetailComponent } from './trip-detail/trip-detail.component';
import { VehicleDetailComponent } from './vehicle-detail/vehicle-detail.component';
import { MonthlyDetailComponent } from './monthly-detail/monthly-detail.component';
import { ModificationViewComponent } from './modification-view/modification-view.component';
import { VehiclemodificationComponent } from './vehiclemodification/vehiclemodification.component';
import { InsurancemodificationComponent } from './insurancemodification/insurancemodification.component';
import { FasttagmodificationComponent } from './fasttagmodification/fasttagmodification.component';
import { TripmodificationComponent } from './tripmodification/tripmodification.component';
import { ServicemodificationComponent } from './servicemodification/servicemodification.component';
import { DocumentmodificationComponent } from './documentmodification/documentmodification.component';
import { AssetmodificationComponent } from './assetmodification/assetmodification.component';
import { ClaimmodificationComponent } from './claimmodification/claimmodification.component';
import { MonthlydetailmodificationComponent } from './monthlydetailmodification/monthlydetailmodification.component';

@NgModule({
  declarations: [VfmSummaryComponent, FleetmakerSummaryComponent, FleetcheckerSummaryComponent, FleetMakerComponent, FleetViewComponent, InsuranceComponent, FastTagComponent, ServiceDetailComponent, DocumentComponent, TripDetailComponent, VehicleDetailComponent, MonthlyDetailComponent, ModificationViewComponent, VehiclemodificationComponent, InsurancemodificationComponent, FasttagmodificationComponent, TripmodificationComponent, ServicemodificationComponent, DocumentmodificationComponent, AssetmodificationComponent, ClaimmodificationComponent, MonthlydetailmodificationComponent],
  imports: [
    CommonModule,
    ToastrModule.forRoot(),
    SharedModule,MaterialModule,VFMRoutingModule
  ]
})
export class VfmModule { }
