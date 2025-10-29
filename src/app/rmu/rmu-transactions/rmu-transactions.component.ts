import { E } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ArchivalSummaryComponent } from '../archival-summary/archival-summary.component';
import { BarcodeAssignSummaryComponent } from '../barcode-assign-summary/barcode-assign-summary.component';
import { BarcodeRequestSummaryComponent } from '../barcode-request-summary/barcode-request-summary.component';
import { RetrievalSummaryComponent } from '../retrieval-summary/retrieval-summary.component';
import { ArchivalformComponent } from '../archivalform/archivalform.component';
import { ReturnComponent } from '../return/return.component';
import { RemovalComponent } from '../removal/removal.component';
import { AdminpageComponent } from '../adminpage/adminpage.component';
import { VendorpageComponent } from '../vendorpage/vendorpage.component';
import { RmuApiServiceService } from '../rmu-api-service.service';
import { SharedService } from 'src/app/service/shared.service';
import { DestroyComponent } from '../destroy/destroy.component';
import { DestroysummaryComponent } from '../destroysummary/destroysummary.component';
import { DestroyapproveComponent } from '../destroyapprove/destroyapprove.component';
import { LegitimateComponent } from '../legitimate/legitimate.component';
import { CullingSummaryComponent } from '../culling-summary/culling-summary.component';
import { AgingbucketComponent } from '../agingbucket/agingbucket.component';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { AcacknowledgementComponent } from '../acacknowledgement/acacknowledgement.component';
import { ArchivalmasterComponent } from '../archivalmaster/archivalmaster.component';
@Component({
  selector: 'app-rmu-transactions',
  templateUrl: './rmu-transactions.component.html',
  styleUrls: ['./rmu-transactions.component.scss', '../rmustyles.css']
})
export class RmuTransactionsComponent implements OnInit {
  @ViewChild("rmutranspopup") rmutranspopup;
  // tab1 = 'Barcode Request'
  // tab2 = 'Barcode Assign'
  tab3 = 'Archivals'
  tab4 = 'Retrieval'
  tab6 = 'Culled'
  tab8 = 'Admin'
  tab9 = 'Vendor'
  tab10 = 'Destroy'
  tab11 = 'Destroy Summary'
  tab5 = 'Culling'
  tab13 = 'Legal/Regulatory'
  tab14 = 'Destroy Approve'
  tabs15 = 'Ageing Bucket'
  tab17='Archival'
  tab16='Acknowledgement'
  tabs = []

  selectedtab: string;
  branch = null
  useraccess: any;
  rmurole: any;
  branchcall
  showPopup: boolean = false;
  constructor(private rmuservice: RmuApiServiceService, private SharedService: SharedService) {

  }


  ngOnInit(): void {
    this.branchcall = true;
    let userdata = this.SharedService.transactionList

    userdata.forEach(element => {
      if (element.name == 'RMU') {
        this.useraccess = element?.submodule
        this.rmurole = element?.role
        // console.log("USER ACCESS", this.useraccess)
      }
    })

    if (this.useraccess) {
      if (this.rmurole)
      // console.log("RMU ROLE", this.rmurole)
      {
        this.rmurole.forEach(element => {
          if (element.name == 'Admin') {
            this.tabs.push({ name: this.tab8, index: 8, Component: AdminpageComponent })

            // if (this.tabs) {
            //   this.tabs = this.tabs.sort((key1, key2) => (key1.ind < key2.ind) ? -1 : 1);
            // }

          }
          if (element.name == 'Checker') {
            this.tabs.push({ name: this.tab16, index:  14, Component: AcacknowledgementComponent  })
            this.tabs.push({ name: this.tab17, index:  4, Component: ArchivalmasterComponent  })
            // this.tabs.push({ name: this.tab8, index: 8, Component: AdminpageComponent })
            this.tabs.push({ name: this.tab4, index: 16, Component: RetrievalSummaryComponent })
            // this.tabs.push({ name: this.tab10, index: 10, Component: DestroyComponent })
            // this.tabs.push({ name: this.tab11, index: 11, Component: DestroysummaryComponent })
            this.tabs.push({name : this.tab14, index : 17, Component : DestroyapproveComponent})
           

          }
          if (element.name == 'Maker') {

            // this.tabs.push({ name: this.tab1, index: 1, Component: BarcodeRequestSummaryComponent })
            this.tabs.push({ name: this.tab3, index: 3, Component: ArchivalSummaryComponent })
            this.tabs.push({ name: this.tab4, index: 4, Component: RetrievalSummaryComponent })
            this.tabs.push({ name: this.tab10, index: 10, Component: DestroyComponent })
            this.tabs.push({ name: this.tab11, index: 11, Component: DestroysummaryComponent })
            this.tabs.push({ name: this.tab13, index: 9, Component: LegitimateComponent })
            this.tabs.push({ name: this.tab5, index: 12, Component: CullingSummaryComponent })
            this.tabs.push({name:this.tab6,index:13})

            this.tabs.push({ name: this.tabs15, index: 15, Component: AgingbucketComponent  })
           
          }
          if (element.name == 'Vendor') {
            this.branchcall = false;
            this.tabs.push({ name: this.tab9, index: 8, Component: VendorpageComponent })
            // this.tabs.push({ name: this.tab3, index: 3, Component: ArchivalSummaryComponent  })
            // this.tabs.push({ name: this.tab4, index: 4, Component: RetrievalSummaryComponent  })
            // this.tabs.push({ name: this.tab4, index: 4, Component: RetrievalSummaryComponent  })
          }
        })

        this.tabs = [...new Map(this.tabs.map(index => [JSON.stringify(index), index])).values()];
        if (this.tabs) {
          this.tabs = this.tabs.sort((key1, key2) => (key1.index < key2.index) ? -1 : 1);
        }

      }
    }

    const ind = sessionStorage.getItem('navbar')
    if (ind) {
      this.submodule(ind)
    }
    else {
      this.submodule(0)
    }
    this.branchcall ? this.rmuservice.getaddress().subscribe(res => {
      console.log('API hits')
      if (res['name']) {
        this.branch = `(${res['code']}) ${res['name']}`
      }
    }) : false;

  }
  submodule(ind) {
    sessionStorage.setItem('navbar', ind)
    const selected = this.tabs[ind];
    this.selectedtab = selected?.name;

  }
  // ngDoCheck(){
  //   console.log('ngDocheck hits') //frist fre
  // }
  ngAfterContentInit() {
    console.log('After Contrnet OIntit hits')
    //second
  }

  // ngAfterContentChecked(){
  //   console.log('after content checked hits')//second free
  // }
  ngAfterViewInit() {
    console.log('After View Init')
    //third
  }
  // ngAfterViewChecked(){
  //   console.log('ngAfterViewChecked')// 3rd free
  // }

  togglePopup() {
    this.showPopup = !this.showPopup;
  }

  closepopup(){
    this.rmutranspopup.nativeElement.click();
  }

  popupopen_rmu_trans() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("notifyModal"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
}
