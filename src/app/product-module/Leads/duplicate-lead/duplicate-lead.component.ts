import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApicallserviceService } from 'src/app/AppAutoEngine/API Services/Api_and_Query/apicallservice.service';
import { MasterApiServiceService } from '../../ProductMaster/master-api-service.service';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles';

@Component({
  selector: 'app-duplicate-lead',
  templateUrl: './duplicate-lead.component.html',
  styleUrls: ['./duplicate-lead.component.scss'],
  providers: [imp.LogFile, imp.UtilFiles, imp.APIServicesPath, imp.Master, imp.ProductAPI]
})
export class DuplicateLeadComponent implements OnInit {

  constructor(private fb: FormBuilder, private service: ApicallserviceService, private masterApi: MasterApiServiceService,
    private productpath: imp.ProductAPI,) { }

  sourceList: [] = []
  searchForm: FormGroup;
  ngOnInit(): void {
    this.searchForm = this.fb.group({
      "source_id": "",
      "from_date": "",
      "to_date": ""
    });
    this.getSourceData();
    this.getDuplicates();
  }

  duplicateList: any = [];
  leadList: any = [];
  getDuplicates(page = 1) {
    let params = 'page=' + page+'&action_status=-1';
    this.masterApi.getDuplicateLeads(params).subscribe(res => {
      this.duplicateList = res['data'];
      this.duplicateList = this.duplicateList.sort((a, b) => a.lead_id - b.lead_id)
      let dup = this.duplicateList.map(element => element = element.lead_id).join(",")
      let params = "lead_id=" + dup;
      this.masterApi.getLeads(params).subscribe(res => {
        this.leadList = res;
        this.leadList.forEach(element => element.isExpanded = false)
      })
    })
  }

  getSourceData() {
    this.service.ApiCall("get", this.productpath.ProductsAPI.Source)
      .subscribe(results => {

        console.log(results)
        let data = results["data"]

        this.sourceList = data;

      })
  }


  duplicatedData: any = [];
  editLead(data) {
    this.duplicatedData = [];
    let params = "lead_id=" + data.lead_id;
    params+= "&action_status=-1"
    this.masterApi.getDuplicateLeads(params).subscribe(res => {
      let duplicateArray = res['data'].filter(element => element.lead_id == data.lead_id);
      duplicateArray.forEach(element => {

        // var mainobj = {
        //   field: '',
        //   duplicateValue: '',
        //   originalValue: ''
        // }

        let entry: object = JSON.parse(element.lead_data.replace(/'/g, '"'));
        let lead_id = entry['lead_id'];
        var obj = {
          keys: null,
          values: null,
          entries: null,
          obj: entry,
          id: element.id,
          lead_id: lead_id,
        };
        delete entry['lead_id'];
        obj.keys = Object.keys(entry)
        obj.values = Object.values(entry)
        obj.entries = obj.keys.map((element, ind) => {
          const dd = {
            field: element,
            duplicateValue: obj.values[ind],
            originalValue: data[element] ? data[element] : 'Empty'
          }
          return dd;
        })
        this.duplicatedData.push(obj);
      });


      console.log(this.duplicatedData)
    })

  }
  merge: number = 3;
  reject: number = 4
  // auto: number = 0;
  manual: number = 1;
  source_id: number = null;
  // status-3 -> merge status-4 reject
  //type 1 manual type 0 auto
  update(type, status, data) {
    var payload: any = {
      type: type,
      status: status,
      id: data.id
    }
    if (type == 0) {
      payload.lead_source_id = this.source_id

    } else {
      payload.lead_data = data.obj;
      payload.lead_data.lead_id = data.lead_id;
    }

    console.log(payload)
    this.duplicateUpdate(payload);
  }



  duplicateUpdate(payload) {
    this.masterApi.updateDuplicate(payload).subscribe(res => {
      if (res.status == 'success') {

      }
    })
  }
}
