import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/service/shared.service';
import { DssService } from '../dss.service';
import { ErrorhandlingService } from '../errorhandling.service';

@Component({
  selector: 'app-dss-summary',
  templateUrl: './dss-summary.component.html',
  styleUrls: ['./dss-summary.component.scss']
})
export class DssSummaryComponent implements OnInit {
  DSSMenuList: any;
  dssreport: boolean;
  dssmaster: boolean;
  dssexception: boolean;
  dssactive: boolean;

  constructor(private errorHandler: ErrorhandlingService,private formBuilder: FormBuilder,private shareService: SharedService,private SpinnerService: NgxSpinnerService,
    public dialog: MatDialog,private toastr:ToastrService,) { }

  ngOnInit(): void {
    let datas = this.shareService.menuUrlData.filter(rolename => rolename.url == '/dssreport');
    //  let datas=JSON.parse( localStorage.getItem("menuUrlData"));
    datas.forEach((element) => {
      console.log(element)
      let subModule = element.submodule;
      if (element.url === "/dssreport") {
        this.DSSMenuList = subModule;
        // this.dssreport=true

        console.log("pprmenuList", this.DSSMenuList)
      }
    })
  }
  dsssubModuleData(dss_menu){
    if (dss_menu.name=="DSS Report"){
      this.dssreport=true
      this.dssmaster=false
      this.dssexception=false;
      this.dssactive=false;
    }
    if (dss_menu.name=="Master"){
      this.dssreport=false
      this.dssmaster=true
      this.dssexception=false;
      this.dssactive=false;
    }
    if(dss_menu.name == "DSS Exceptions"){
      this.dssreport=false
      this.dssmaster=false;
      this.dssexception=true;
      this.dssactive=false;
    }
    if(dss_menu.name == "Active client"){
      this.dssreport=false
      this.dssmaster=false;
      this.dssexception=false;
      this.dssactive=true;
    }
  }
}