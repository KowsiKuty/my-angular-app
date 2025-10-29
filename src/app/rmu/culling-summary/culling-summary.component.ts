import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RmuApiServiceService } from '../rmu-api-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-culling-summary',
  templateUrl: './culling-summary.component.html',
  styleUrls: ['./culling-summary.component.scss', '../rmustyles.css']
})
export class CullingSummaryComponent implements OnInit {
  //summarydata
  rmuurl = environment.apiURL
  summaryform: FormGroup;
  summarylist = [];
  //pagination
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  selectedarray = []
  culling_search:any
  searchvar:any
  vendor:any
data: any;
cullingbutton:any
 searchcullingvar:any = "String"
  constructor(private fb: FormBuilder, private rmuservice: RmuApiServiceService, private router: Router) {
    this.vendor = {
      label: "Status",
      method: "get",
      url:  "",
      params: "",
      searchkey: "query",
      displaykey: "name",
      wholedata: true,
    }
    this.culling_search = [{"type":"input", "label": "Culling Code",formvalue:"code"},{ "type": "date","label": "Culling Requested Date",formvalue:'date',dateformat:'dd-MMM-yyyy'},{"type":"dropdown",inputobj:this.vendor,formvalue:"vendor"}]
    this.cullingbutton =[{"name": "Start", function:this.gotocomponent.bind(this)}]
   }

  ngOnInit(): void {
    this.summaryform = this.fb.group({
      reqcode: '',
      department: '',
      barcodetype: null,
      barcodecategory: null,
      status: null,
      req_date:null
    })
    this.getsummary('')
  }

  proceed(){
    this.selectedarray = this.summarylist.filter(element =>{
      
      if(element.culling_select){
        // element.isselected = false;
        return element;
      }
    })
  }

  

  gotocomponent(data) {
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

  getsummary(data) {
    // var val = this.summaryform.value;
    // val = Object.keys(val).map(key => key +'='+val[key]).join('&')
    this.rmuservice.getcullingsummary(data,this.pagination.index).subscribe(results => {
      if (!results) {
        return false;
      }
      this.summarylist = results['data'];
      this.summarylist.forEach(element =>{
        element.culling_select=false;
      })
      this.pagination = results.pagination ? results.pagination : this.pagination;
    })
  }

}

