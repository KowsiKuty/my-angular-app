import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/service/shared.service';
import { Router} from '@angular/router'
import { LeaddataComponent } from 'src/app/lead/leaddata/leaddata.component';

@Component({
  selector: 'app-vow-summary',
  templateUrl: './vow-summary.component.html',
  styleUrls: ['./vow-summary.component.scss'],
  providers: [LeaddataComponent],
})
export class VowSummaryComponent implements OnInit {
  VOW_Sub_Menu_List: any;
  sub_module_url: any;
  usersummarydata:any;
  leaddata:any;
  groupdata:any;
  leadreportdata:any;
  dashboarddata:any;
  usersummaryPath:any;
  leaddataPath:any;
  groupdataPath:any;
  leadreportdataPath:any;
  dashboarddatapath:any;
  showuserdata:boolean = false;

  isShowleadreport:boolean = false;
  isShowlead:boolean = false;
  isShowgroup:boolean = false;


  constructor(private sharedService: SharedService,private router:Router) { }

  ngOnInit(): void {
    let datas = this.sharedService.menuUrlData;
    console.log("urllllllss",datas)
   
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "VOW") {
        this.VOW_Sub_Menu_List = subModule;
        console.log("VOW_Sub_Menu_List", this.VOW_Sub_Menu_List)
      }
    });
  }
  
  vowSubModule(data){
    this.sub_module_url = data.url;
    this.usersummarydata = "/usersummary"
    this.leaddata = "/leaddata"
    this.groupdata = "/group"
    this.leadreportdata = "/leadreport"
    this.dashboarddata = "/dashboard"

    this.usersummaryPath = this.usersummarydata === this.sub_module_url ? true : false;
    this.leaddataPath = this.leaddata === this.sub_module_url ? true : false;
    this.groupdataPath = this.groupdata === this.sub_module_url ? true : false;
    this.leadreportdataPath = this.leadreportdata === this.sub_module_url ? true : false;
    this.dashboarddatapath = this.dashboarddata  === this.sub_module_url ? true : false;
    console.log("leaddataPath===>",this.leaddataPath)
    // if(this.usersummaryPath){
    //   this.isShowleadreport = false;
    //   this.isShowlead = false;
    //   this.isShowgroup = false;
    //   // this.router.navigate(['user/usersummary']);
    // }
    if(this.leaddataPath){
      this.isShowleadreport = false;
      this.isShowlead = true;
      this.isShowgroup = false;
      // this.router.navigate(['lead/leaddata']);
    }
    if(this.groupdataPath){
      this.isShowleadreport = false;
      this.isShowlead = false;
      this.isShowgroup = true;
      // this.router.navigate(['user/group']);
    }
    if(this.leadreportdataPath){
      this.isShowleadreport = true;
      this.isShowlead = false;
      this.isShowgroup = false;
      // this.router.navigate(['lead/leadreport']);
    }
    // if(this.dashboarddatapath){
    //   this.isShowleadreport = true;
    //   this.isShowlead = false;
    //   this.isShowgroup = false;
    //   // this.router.navigate(['crm/dashboard'])
    // }
  }

}
