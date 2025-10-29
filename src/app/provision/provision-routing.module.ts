import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import{ProvisionsummaryComponent} from './provisionsummary/provisionsummary.component'
import{ProvisionsmakerComponent} from './provisionsmaker/provisionsmaker.component'
import{ProvisioncheckerComponent} from './provisionchecker/provisionchecker.component'
import{ProvisionapproverComponent} from './provisionapprover/provisionapprover.component'
import { ProvisiondelmatComponent } from './provisiondelmat/provisiondelmat.component';
import { DelmatmakerComponent } from '../provision/delmatmaker/delmatmaker.component';
import { DelmatapproverComponent } from '../provision/delmatapprover/delmatapprover.component';
import { CanActivateGuardService } from '../can-activate-guard.service';

const routes: Routes = [{
  path: '', canActivate: [CanActivateGuardService],
  children: [

  { path: 'provision', component: ProvisionsummaryComponent },
  { path: 'provisionmaker', component: ProvisionsmakerComponent },
  { path: 'provisionchecker', component:ProvisioncheckerComponent  },
  { path: 'provisionapprover', component:ProvisionapproverComponent  },
  // {path:'delmat',component:ProvisiondelmatComponent},
  // {path:'delamtadd',component:DelmatmakerComponent},
  // {path:'delamtapprover',component:DelmatapproverComponent}
]
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
  
})
export class ProvisionRoutingModule { }