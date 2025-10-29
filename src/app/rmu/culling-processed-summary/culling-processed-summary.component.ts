import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RmuApiServiceService } from '../rmu-api-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-culling-processed-summary',
  templateUrl: './culling-processed-summary.component.html',
  styleUrls: ['./culling-processed-summary.component.scss','../rmustyles.css']
})
export class CullingProcessedSummaryComponent implements OnInit {
  //summarydata
  summaryform: FormGroup;
  summarylist = [];
  //pagination
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  Culling_search:any;
  rmuurl=environment.apiURL
  searchvar :any = "String";
  selectedarray = []
  constructor(private fb: FormBuilder, private rmuservice: RmuApiServiceService, private router: Router) { 
    this.Culling_search=[
      {"type":"input","label":"Culling Code","formvalue":"department"},
      { "type": "date", "label": "Culling Request Date", "formvalue": "req_date" },
      {"type":"input","label":"Status","formvalue":"status"},
    ]
  }

  ngOnInit(): void {
    this.summaryform = this.fb.group({
      reqcode: '',
      department: '',
      barcodetype: null,
      barcodecategory: null,
      status: null,
      req_date: null
    })
    this.getsummary('')
  }

  proceed() {
    this.selectedarray = this.summarylist.filter(element => {

      if (element.culling_select) {
        // element.isselected = false;
        return element;
      }
    })
  }



  gotocomponent() {
    // data = Object.keys(data).map(key => {
    //   let value = data[key];
    //   let  newvalue =null;
    //   typeof value == 'object' ? newvalue = JSON.stringify(value):newvalue = value;
    //   return key + '=' + newvalue;
    // }).join('&');

    this.router.navigateByUrl(`rmu/culling-selection?selectedarray=${JSON.stringify(this.selectedarray)}`);

  }
  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.getsummary('')
  }

  prevpage() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1
    }
    this.getsummary('')
  }

  Culling_summaryapi:any;

  getsummary(data) {
    // var val = this.summaryform.value;
    // val = Object.keys(val).map(key => key +'='+val[key]).join('&')
    // this.rmuservice.getculledsummary(this.pagination.index).subscribe(results => {
    //   if (!results) {
    //     return false;
    //   }
    //   this.summarylist = results['data'];
    //   this.summarylist.forEach(element => {
    //     element.culling_select = false;
    //   })
    //   this.pagination = results.pagination ? results.pagination : this.pagination;
    // })
    this.Culling_summaryapi= { "method": "get", "url": this.rmuurl + "rmuserv/culling_summary",params: data}
    
  }
  
  Culling_summary:any=[   
    {"columnname": "Culling Date", "key": "date",},
    {"columnname": "Culling Code",  "key": "culling_code",},
    { columnname: "View",
      icon:"edit",
      key: "remarks",
      button: true,
      function: false,
      validate: false,
         
    },
    ]

}
