import { NgModule } from '@angular/core';
import { ProvisionRoutingModule } from './provision-routing.module';
import { ProvisionsummaryComponent } from './provisionsummary/provisionsummary.component';
import { ProvisionsmakerComponent } from './provisionsmaker/provisionsmaker.component';
import { ProvisioncheckerComponent } from './provisionchecker/provisionchecker.component';
import { ProvisionapproverComponent } from './provisionapprover/provisionapprover.component';
import { ProvisiondelmatComponent } from './provisiondelmat/provisiondelmat.component';
import { DelmatmakerComponent } from './delmatmaker/delmatmaker.component';
// import { DelmatcheckerComponent } from './delmatchecker/delmatchecker.component';
import { DelmatapproverComponent } from './delmatapprover/delmatapprover.component';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import{TwoDigitDecimaNumberDirective} from '../two-placedecimal';
import { ProvisionReportComponent } from './provision-report/provision-report.component'
@NgModule({
  
  declarations: [TwoDigitDecimaNumberDirective,ProvisionsummaryComponent, ProvisionsmakerComponent, ProvisioncheckerComponent, ProvisionapproverComponent, ProvisiondelmatComponent, DelmatmakerComponent, DelmatapproverComponent, ProvisionReportComponent],
  imports: [
    MaterialModule,SharedModule,
    ProvisionRoutingModule,
    // MatAutocompleteModule,
    //  MatIconModule, 
     ToastrModule.forRoot(),





  ],
  // providers: [],
})
export class ProvisionModule { }
