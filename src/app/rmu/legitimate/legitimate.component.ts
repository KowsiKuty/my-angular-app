import { Component, ElementRef, Inject, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RmuApiServiceService } from '../rmu-api-service.service';
import { NotificationService } from '../../service/notification.service';
import { environment } from 'src/environments/environment';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";

@Component({
  selector: 'app-legitimate',
  templateUrl: './legitimate.component.html',
  styleUrls: ['./legitimate.component.scss','../rmustyles.css']
})
export class LegitimateComponent implements OnInit {

  rmuurl=environment.apiURL

  legitimateSearch : FormGroup;
  createLegitimates: FormGroup;
  legitmatedocs =[];
  statuss : any;
  limit = 10;
  pagination={
    has_next:false,
    has_previous:false,
    index:1
  }
  tableshow:boolean=false;
  checked : boolean = true;
  legitmatedocs_search:any;
  searchvar :any = "String";

  @ViewChild('closebtn') closebtn: ElementRef
  @ViewChild('closeretrivalpopup')closeretrivalpopup
  constructor( private fb: FormBuilder,  private rmuservice: RmuApiServiceService,private notification: NotificationService,
  private router: Router) { 
    this.legitmatedocs_search=[
    {"type":"input","label":"Document No","formvalue":"docNum"},
    ]
  }

  ngOnInit(): void {

    // this.statuss = 1;

    this.legitimateSearch = this.fb.group({
      docNum : '',
    })
    this.createLegitimates = this.fb.group({
      id:'',
      archived_details_id:'',
      legitimate_date:'',
      comment:'',
    })
    this.getLegitimatedocs('');
  }
  legitmatedocs_summaryapi:any;



      legitmatedocs_summary:any=[
        {"columnname": "Product",  "key": "product", type: "object", objkey: "name",},
        {"columnname": "Product Barcode", "key": "product_barcode",},
        {"columnname": "Retention Date", "key": "retention_date",}, 
        {"columnname": "Status", "key": "archival_status",type: "object", objkey: "value",},
        { columnname: "Action",
          icon:"toggle_on",
          key: "remarks",
          button: true,
          function: true,
          validate: true,
          validatefunction:this.validate_data.bind(this),    
          clickfunction:this.popupopen.bind(this),      
        },
      ]

  getLegitimatedocs(data)
  {
      this.tableshow = true;

    //   this.rmuservice.getfilelevels(this.pagination.index).subscribe(results =>{
    //     // console.log(res.data[0].id);
    //     this.legitmatedocs = results.data;

    // // console.log("Datas coming",+datas)
    // // this.rmuservice.getfilelevel(datas).subscribe(results =>{
    // //   this.filelevellists = results.data;
    
    //   this.pagination = results.pagination?results.pagination:this.pagination;
    //   if (results.status == 'success') {
    //     //this.notification.showSuccess("Records Uploaded Successfully")
    //   }
    //   else
    //   {
    //  // this.notification.showError(results.description)
// "params": e 
    //   }
    // })
    
    this.legitmatedocs_summaryapi= { "method": "get", "url": this.rmuurl + "rmuserv/archival_details_get","params": data}

  }


  validate_data(data){
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: true,     
    };
    if (data.legitimate == 1) {
        config = {
          disabled: true,
          style: { color: "green" },
          icon: "toggle_on",
          class: "",
          value: "",
          function: true,
          clickfunction: this.activedatas.bind(this),
        };
      
    } else if (data.legitimate == 0) {
      config = {
        disabled: true,
        style: { color: "black" },
        icon: "toggle_off",
        class: "",
        value: "",
        function: true,
        clickfunction: this.activedata.bind(this),
      };
    }
    return config;
  }



  activedata(data)
  {
   // this.statuss = 0;
   this.createLegitimates.patchValue({
    id : data.id,
    archived_details_id : data.id,
    legitimate_date:'',
    comment:'',


   }

   )
  }

  activedatas(data)
  {
    //this.statuss = 1;
    this.createLegitimates.patchValue({
      id : data.id,
      archived_details_id : data.id,
      legitimate_date:'',
      comment:'',
  
  
     }
  
     )

     this.deleteLegitimate(this.createLegitimates.value.id)
  }


  prevpage()
  {
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1
    }
    this.getLegitimatedocs('')
  }

  nextpage()
  {
    if(this.pagination.has_next){
      this.pagination.index = this.pagination.index+1
    }
    this.getLegitimatedocs('')

  }

  submitLegitimate()
  {
    console.log("Datas coming",)
    this.rmuservice.submitlegitimaterequest(this.createLegitimates.value).subscribe(results =>{
      // this.boxlevellists = results.data;
    
      this.pagination = results.pagination?results.pagination:this.pagination;
      if (results.status == 'success') {
        this.notification.showSuccess("Legitmate document Successfully Created")
        this.closeretrivalpopup.nativeElement.click();
        this.getLegitimatedocs('');
      }
      else
      {
      this.notification.showError(results.description)

      }
      
    })
    // if(this.tableshow){
    //   for(let  i=0;i < this.legitmatedocs.length;i++ ){
    //     if(this.legitmatedocs[i].id  == this.createLegitimates.value.id ){
    //       this.legitmatedocs[i].legitimate = 1
    //     }
    //   }
    // }
  }

  deleteLegitimate(datas)
  {

    this.rmuservice.deletelegitimate(datas).subscribe(results =>{
      // this.boxlevellists = results.data;
    
      this.pagination = results.pagination?results.pagination:this.pagination;
      if (results.status == 'success') {
        this.notification.showSuccess("Legitimate Document Deleted")
        // this.closebtn.nativeElement.click();
        this.getLegitimatedocs('');
      }
      else
      {
      this.notification.showError(results.description)

      }
      
    })
  }

  popupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("myModal2"),
      {
        keyboard: false,
      }
    );
    myModal.show();
  }


  close(){
    this.closeretrivalpopup.nativeElement.click()
  }
}
