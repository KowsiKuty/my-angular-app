import { Component, OnInit } from '@angular/core';
import { VertSharedService } from '../vert-shared.service';

@Component({
  selector: 'app-master-routing',
  templateUrl: './master-routing.component.html',
  styleUrls: ['./master-routing.component.scss']
})
export class MasterRoutingComponent implements OnInit {
  common_tb: boolean=true;
  label_master: boolean;
  business_master: boolean;
  mapping_master: boolean;
  manual_entry: boolean;
  reports_dd_field:any;
  // {"id":"1","name":"Business Master"},{"id":"2","name":"Label Master"},{"id":"3","name":"Mapping Master"},
  constructor(private vertshared:VertSharedService,) {
    this.reports_dd_field = {
      label: "Reports Master Name",      
      params: "",
      searchkey: "",
      data:[{"id":"4","name":"ROA Manual Entry"}],
      displaykey: "name",
      Outputkey:"id",
      fronentdata:true,
      // defaultvalue :true,
    }
   }

  ngOnInit(): void {
  }
  Rports_master_dd(event){
    document.getElementById("mySidenav").style.width = "200px";
    document.getElementById("main").style.marginLeft = "12rem";
    this.vertshared.isSideNav = false;
  console.log("data",event)
    if(event===true){
    this.common_tb=true;
    this.label_master=false;
    this.business_master=false;
    this.mapping_master=false;
    this.manual_entry=false;
    }
     if(event==="1"){
      this.common_tb=false;
      this.label_master=false;
      this.business_master=true;
      this.mapping_master=false;
      this.manual_entry=false;
    }
     if(event==="2"){
    this.common_tb=false;
    this.label_master=true;
    this.business_master=false;
    this.mapping_master=false;
    this.manual_entry=false;
    }
    if(event==="3"){
    this.common_tb=false;
    this.label_master=false;
    this.business_master=false;
    this.mapping_master=true;
    this.manual_entry=false;
    }
    if(event==="4"){
    this.common_tb=false;
    this.label_master=false;
    this.business_master=false;
    this.mapping_master=false;
    this.manual_entry=true;
    }
  
  }
}
