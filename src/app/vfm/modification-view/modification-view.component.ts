import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import {VfmService} from "../vfm.service";
import {ShareService} from '../share.service'
import {ActivatedRoute, Router} from "@angular/router";

export interface ExampleTab {
  tab_name: string;
  tab_id: string;
}
@Component({
  selector: 'app-modification-view',
  templateUrl: './modification-view.component.html',
  styleUrls: ['./modification-view.component.scss']
})
export class ModificationViewComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  asyncTabs: Observable<ExampleTab[]>;
  vehicle_flag = false;
  insurance_flag=false
  fastatg_flag=false
  trip_flag=false
  service_flag=false
  document_flag=false
  asset_flag=false
  claim_flag=false
  month_flag=false
  vehicle_data = [];
  insurance_data = [];
  fasttag_data = [];
  trip_data = [];
  service_data = [];
  document_data = [];
  asset_data = [];
  claim_data = [];
  eor_data = [];
  vehicleId: any;
  modificationdata: any;
  modify_changestatus: any;

  constructor(private shareservice:ShareService,private router: Router,private vfmService:VfmService) { 
    this.asyncTabs = new Observable((observer: Observer<ExampleTab[]>) => {
      setTimeout(() => {
        observer.next([
          { "tab_name": "VEHICLE MASTER", "tab_id": "1" },
          { "tab_name": "INSURANCE", "tab_id": "2" },
          { "tab_name": "FASTAG", "tab_id": "3" },
          { "tab_name": "TRIP DETAILS", "tab_id": "4" },
          { "tab_name": "SERVICE HISTORY", "tab_id": "5" },
          { "tab_name": "DOCUMENT", "tab_id": "6" },
          { "tab_name": "ASSET DETAILS", "tab_id": "7" },
          { "tab_name": "CLAIM", "tab_id": "8" },
          { "tab_name": "MONTHLY RUN DETAIL", "tab_id": "9" }
        ]);
      }, 1000);
    });
  }

  ngOnInit(): void {
    this.getmodification_vender();
    this.modify_changestatus = 'modify_changestatus'
  }
   modify_vehicle(j) {
    this.vehicle_flag = true;
    this.shareservice.modification_data.next(j);
  }
  modify_insurance(j) {
    this.insurance_flag = true;
    this.shareservice.modification_data.next(j);
  }
  modify_fasttag(j) {

    this.fastatg_flag = true;
    this.shareservice.modification_data.next(j);
  }

  modify_trip(data) {
    this.trip_flag = true;
    this.shareservice.modification_data.next(data);
  }

  modify_service(data) {
    this.service_flag = true;
    this.shareservice.modification_data.next(data);
  }
  modify_doc(data) {
    this.document_flag = true;
    this.shareservice.modification_data.next(data);
  }
  modify_asset(data) {
    this.asset_flag = true;
    this.shareservice.modification_data.next(data);
  }
  modify_claim(data){
    this.claim_flag = true;
    this.shareservice.modification_data.next(data); 
  }
  modify_month(data){
    this.month_flag=true;
    this.shareservice.modification_data.next(data); 
  }
  backButton(){
    this.router.navigate(['vfm/fleet_view'], { skipLocationChange: true })
  }
  get_tabe(value) {
    this.modify_changestatus = value.tab.textLabel

  }
  clientCancel() {
    this.vehicle_flag = false;
    this.insurance_flag=false
    this.fastatg_flag=false
    this.trip_flag=false
    this.service_flag=false
    this.document_flag=false
    this.asset_flag=false
    this.claim_flag=false
    this.month_flag=false

    this.onCancel.emit()
  }
  getmodification_vender() {
    this.vehicle_data = [];
    this.insurance_data = [];
    this.fasttag_data = [];
    this.trip_data = [];
    this.service_data = [];
    this.document_data = [];
    this.asset_data = [];
    this.claim_data = [];
    this.eor_data = [];
    this.vehicleId = this.shareservice.vehicleId.value

    this.vfmService.getmodification(this.vehicleId)
      .subscribe(result => {
        this.modificationdata = result['data']
        this.modificationdata.forEach(element => {
          if (element.action == 2)//edit
          {
            if (element.type_name == 1) {
              this.vehicle_data.push(element)
            }
            if (element.type_name == 2) {
              this.insurance_data.push(element)
            }
            if (element.type_name == 3) {
              this.fasttag_data.push(element)
            }

            if (element.type_name == 4) {
              this.trip_data.push(element)
            }
            if (element.type_name == 5) {
              this.service_data.push(element)
            }
            if (element.type_name == 6) {
              this.document_data.push(element)
            }

            if (element.type_name == 7) {
              this.asset_data.push(element)
            }

            if (element.type_name == 8) {
              this.claim_data.push(element)
            }

            if (element.type_name == 9) {

              this.eor_data.push(element)
            }

          }
          if (element.action == 1)//create
          {
            if (element.type_name == 1) {
              this.vehicle_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 2) {
              this.insurance_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            
            if (element.type_name == 3) {
              this.fasttag_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 4) {
              this.trip_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 5) {
              this.service_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }

            if (element.type_name == 6) {

              this.document_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 7) {
              this.asset_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 8) {
              this.claim_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 9) {
              this.eor_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }

          }
          if (element.action == 0) {
            if (element.type_name == 1) {
              this.vehicle_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 2) {
              this.insurance_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            
            if (element.type_name == 3) {
              this.fasttag_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 4) {
              this.trip_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 5) {
              this.service_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }

            if (element.type_name == 6) {

              this.document_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 7) {
              this.asset_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 8) {
              this.claim_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 9) {
              this.eor_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
          }
          if (element.action == -1) {
            if (element.type_name == 1) {
              this.vehicle_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 2) {
              this.insurance_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            
            if (element.type_name == 3) {
              this.fasttag_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 4) {
              this.trip_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 5) {
              this.service_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }

            if (element.type_name == 6) {

              this.document_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 7) {
              this.asset_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 8) {
              this.claim_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 9) {
              this.eor_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
          }

        });






      })


  }
}
