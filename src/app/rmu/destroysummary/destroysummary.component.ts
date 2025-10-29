import { Component, OnInit } from '@angular/core';
import { RmuApiServiceService } from '../rmu-api-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-destroysummary',
  templateUrl: './destroysummary.component.html',
  styleUrls: ['./destroysummary.component.scss','../rmustyles.css']
})
export class DestroysummaryComponent implements OnInit {
  limit = 10;
  pagination={
    has_next:false,
    has_previous:false,
    index:1
  }
  rmuurl=environment.apiURL
  destroySearch : FormGroup;
  destroysummary: any;
  doclistview: any;
  destroy_search:any;
  searchvar :any = "String";
  constructor(private rmuservice:RmuApiServiceService, private router:Router, private fb: FormBuilder, 
    private snackbar: MatSnackBar) { 
      this.destroy_search=[
        {"type":"input","label":"Destroy Code","formvalue":"producttype"},
        { "type": "date", "label": "Request Date", "formvalue": "retent_date" },
        {"type":"input","label":"Status","formvalue":"status"},
      ]
    }

  ngOnInit(): void {

    this.destroySearch = this.fb.group({
      producttype:'',
      retent_date:'',
      documentnum:'',
      status:'',
    })

    this.getdestroyreqsummary('');
  }
  destroy_summaryapi:any;
  getdestroyreqsummary(data){
    // var val = this.summaryform.value;
    // val = Object.keys(val).map(key => key +'='+val[key]).join('&')
    // this.rmuservice.getdestroyreqsummary('',this.pagination.index).subscribe(results =>{
    //   if(!results){
    //     return false;
    //   }
    //   this.destroysummary = results['data'];
    //   this.pagination = results.pagination?results.pagination:this.pagination;
    // })
    
    this.destroy_summaryapi= { "method": "get", "url": this.rmuurl + "rmuserv/destroy_maker",params:"&destroy_status=2"+data}
  }

  getparticularView(data)
  {
    this.rmuservice.getdestroyparticular(data,this.pagination.index).subscribe(results =>{
      if(!results){
        return false;
      }
      this.destroysummary = results['data']
      this.pagination = results.pagination?results.pagination:this.pagination;
    })

  }


  destroy_summary:any=[
    {"columnname": "Destroy Code",  "key": "destroy_code",},
    {"columnname": "Request Date", "key": "request_date",},
    {"columnname": "comment", "key": "comment",}, 
    {"columnname": "Status", "key": "destroy_status",type: "object", objkey: "value",},
    ]

}
