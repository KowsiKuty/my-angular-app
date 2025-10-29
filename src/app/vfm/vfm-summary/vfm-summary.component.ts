import { Component, OnInit } from '@angular/core';
import { FleetmakerSummaryComponent } from '../fleetmaker-summary/fleetmaker-summary.component';
import { FleetcheckerSummaryComponent } from '../fleetchecker-summary/fleetchecker-summary.component';

@Component({
  selector: 'app-vfm-summary',
  templateUrl: './vfm-summary.component.html',
  styleUrls: ['./vfm-summary.component.scss']
})
export class VfmSummaryComponent implements OnInit {
  isfleetmakersmry:boolean
  isfleetcheckersmry:boolean

  vendorMasterList = [
    { name: "Vehicle Management", index: 1, component: FleetcheckerSummaryComponent },
  ];
  constructor() { }

  ngOnInit(): void {
  }
  subModuleData(data) {
    if(data.index == 1){
      this.isfleetcheckersmry=true
    }
    
  

  
  }
}
