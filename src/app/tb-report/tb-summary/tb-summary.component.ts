import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { environment } from 'src/environments/environment';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { VertSharedService } from '../vert-shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TbReportService } from '../tb-report.service';
import { ErrorhandlingService } from 'src/app/ppr/errorhandling.service';


@Component({
  selector: 'app-tb-summary',
  templateUrl: './tb-summary.component.html',
  styleUrls: ['./tb-summary.component.scss']
})
export class TBSummaryComponent implements OnInit {
  reports_field:any;
  tb_report: boolean=false;
  tb_gl_report: boolean=false;
  common_tb: boolean=true;
  ver_report: boolean;
  roa_report: boolean;
  mapping_master: boolean;
  business_master: boolean;
  label_master: boolean;
  common_reportss: boolean;
  Tb_reports_role:any;
  branch_list: any;
  branch_do_list: any;
  branch_code_name: any;
  manual_entry: boolean;
  gltransction: boolean;
  constructor(private shareService: SharedService,private errorHandler: ErrorhandlingService,private vertshared:VertSharedService,private SpinnerService:NgxSpinnerService, public tbservice: TbReportService ) { 
    this.reports_field = {
      label: "Reports Name",      
      params: "",
      searchkey: "",
      data:[{"id":"1","name":"TB Report"},{"id":"2","name":"TB GL Report"},{"id":"3","name":"Vertical Report"} ,{"id":"4","name":"ROA Report"},{"id":"5","name":"Cost of Funds"},{"id":"6","name":"Gross Interest Income "},{"id":"7","name":"Non Interest Income "},{"id":"8","name":"Establishment Cost "},{"id":"9","name":"Other Operating Expenses "},{"id":"10","name":"GL Statement - Transaction"},{"id":"11","name":"CBDA Report"}],
      displaykey: "name",
      Outputkey:"id",
      fronentdata:true,
      // defaultvalue :true,
    }  
  }

  ngOnInit(): void {   
    document.getElementById("mySidenav").style.width = "200px";
    document.getElementById("main").style.marginLeft = "12rem";
    this.vertshared.isSideNav = false;
    let datas = this.shareService.menuUrlData.filter(rolename => rolename.name == 'TB Report');
    console.log('totaldata', datas)
    datas.forEach((element) => {     
      for(let  submodel of element.submodule){
        if (submodel.name === 'TB Report') {
          let role = submodel.role;
          this.Tb_reports_role = role;
        }
      }

      
    })
    for(let roles of this.Tb_reports_role){ 
      console.log("role",roles)
      if(roles.name=="Admin"){
      this.vertshared.role_permission.next(roles)
      }else{
        this.vertshared.role_permission.next("")
      }
    }
    this.branch()
  }

  branch(){
    // this.SpinnerService.show()
    this.tbservice.User_Branch().subscribe(results=>{
      // this.SpinnerService.hide()
      let data=results
      this.branch_list=data      
      this.vertshared.Branch_value.next(this.branch_list.code);
      this.vertshared.Branchwiselogin_id.next(this.branch_list.id)
      this.vertshared.brnach_login_code.next(this.branch_list.code)
      let branch_code=this.branch_list.code
      let branch_name=this.branch_list.name
      this.branch_code_name=branch_code.concat("-"+branch_name)
      this.vertshared.Branch_value_show.next(this.branch_code_name);
      console.log(this.branch_code_name,"this.branch_list.code")
      console.log('branch_list',this.branch_list)
      this.branch_do()
    } , error => {
      this.errorHandler.handleError(error);
      // this.SpinnerService.hide();
    })
  }

  branch_do(){
    let brnch_code= this.branch_list.code
    // this.SpinnerService.show()
    this.tbservice.User_Branch_DO(brnch_code).subscribe(results=>{
      // this.SpinnerService.hide()
      let data=results
      this.branch_do_list=data   
      // this.common_tb=true;   
      this.vertshared.Branch_value_do.next(this.branch_do_list);
      console.log('branch_do_list',this.branch_do_list)
    } , error => {
      this.errorHandler.handleError(error);
      // this.SpinnerService.hide();
    })
  }
 

  headers:any;
  show_CBDA_Report:boolean=false;
Rports_dd(event:any){
  this.headers=event
  document.getElementById("mySidenav").style.width = "200px";
  document.getElementById("main").style.marginLeft = "12rem";
  this.vertshared.isSideNav = false;
  
console.log("data",event)
if(event===true){
  this.tb_report=false;
this.tb_gl_report=false;
this.common_tb=true;
this.ver_report=false;
this.roa_report=false;
this.label_master=false;
this.business_master=false;
this.mapping_master=false;
this.common_reportss=false;
this.manual_entry=false;
this.gltransction=false;
}
 if(event==="1"){
  this.common_tb=false;
  this.tb_report=true;
  this.tb_gl_report=false;
  this.ver_report=false;
  this.roa_report=false;
  this.label_master=false;
  this.business_master=false;
  this.mapping_master=false;
  this.common_reportss=false;
  this.manual_entry=false;
  this.gltransction=false;
}
 if(event==="2"){
this.tb_report=false;
this.tb_gl_report=true;
this.common_tb=false;
this.ver_report=false;
this.roa_report=false;
this.label_master=false;
this.business_master=false;
this.mapping_master=false;
this.common_reportss=false;
this.manual_entry=false;
this.gltransction=false;
}
if(event==="3"){
  this.ver_report=true;
  this.tb_report=false;
this.tb_gl_report=false;
this.common_tb=false;
this.roa_report=false;
this.label_master=false;
this.business_master=false;
this.mapping_master=false;
this.common_reportss=false;
this.manual_entry=false;
this.gltransction=false;
}
if(event==="4"){
  this.roa_report=true;
  this.ver_report=false;
  this.tb_report=false;
this.tb_gl_report=false;
this.common_tb=false;
this.label_master=false;
this.business_master=false;
this.mapping_master=false;
this.common_reportss=false;
this.manual_entry=false;
this.gltransction=false;
}
if(event==="5" || event==="6" || event==="7" || event==="8" || event==="9"){
  this.vertshared.dropdown_data.next(event)
  this.ver_report=false;
  this.tb_report=false;
this.tb_gl_report=false;
this.common_tb=false;
this.roa_report=false;
this.label_master=false;
this.business_master=false;
this.mapping_master=false;
this.common_reportss=true;
this.manual_entry=false;
}
if(event==="10"){
  this.roa_report=false;
  this.ver_report=false;
  this.tb_report=false;
this.tb_gl_report=false;
this.common_tb=false;
this.label_master=false;
this.business_master=false;
this.mapping_master=false;
this.common_reportss=false;
this.manual_entry=false;
this.gltransction=true;
}
if(event==="11"){
  this.roa_report=false;
  this.ver_report=false;
  this.tb_report=false;
this.tb_gl_report=false;
this.common_tb=false;
this.label_master=false;
this.business_master=false;
this.mapping_master=false;
this.common_reportss=false;
this.manual_entry=false;
this.gltransction=false;
this.show_CBDA_Report = true;
}
}



}
