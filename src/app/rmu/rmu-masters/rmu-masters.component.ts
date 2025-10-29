import { Component, OnInit } from '@angular/core';
import { BarcodeRequestSummaryComponent } from '../barcode-request-summary/barcode-request-summary.component';
import { BoxMasterComponent } from '../box-master/box-master.component';

@Component({
  selector: 'app-rmu-masters',
  templateUrl: './rmu-masters.component.html',
  styleUrls: ['./rmu-masters.component.scss']
})
export class RmuMastersComponent implements OnInit {
  tabs = [];
  selectedtab;
  tab1 = 'Vendors'
  // tab2='Product'
  // tab5='Archival'
  tab3='BOX Master'
  tab4='Product master'
  // tab6='Acknowledgement'
  tab7='Document Screen'
  constructor() { }

  ngOnInit(): void {
    this.tabs.push({ name: this.tab1, index: 1, Component: BarcodeRequestSummaryComponent })
    // this.tabs.push({name:this.tab2,index:2});
    this.tabs.push({name:this.tab3,index:3,Component: BoxMasterComponent });
    this.tabs.push({name:this.tab4,index:4});
    // this.tabs.push({name:this.tab5,index:5});
    // this.tabs.push({name:this.tab6,index:6});
    // this.tabs.push({name:this.tab7,index:7});
    const ind = sessionStorage.getItem('navbarmst')
    if (ind) {
      this.submodule(ind)
    }
    else {
      this.submodule(0)
    }
  }

  submodule(ind) {

    sessionStorage.setItem('navbarmst', ind)
    const selected = this.tabs[ind];
    this.selectedtab = selected.name;

  }
}
