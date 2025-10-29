import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { UserCreationComponent} from './user-creation/user-creation.component'
import { UserDetailsRoutingModule } from './user-details-routing.module';
import { UserSummaryComponent } from './user-summary/user-summary.component';
import { GroupComponent } from './group/group.component';


// import { VowSummaryComponent } from '../vow/vow-summary/vow-summary.component';



@NgModule({
  declarations: [UserCreationComponent, UserSummaryComponent, GroupComponent],
  imports: [
    CommonModule,
    UserDetailsRoutingModule,MaterialModule, SharedModule,

    // VowSummaryComponent
  ],
  // exports: [
  //   GroupComponent
  // ]

})
export class UserDetailsModule { }
