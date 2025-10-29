import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-tb-submodule-routing',
  templateUrl: './tb-submodule-routing.component.html',
  styleUrls: ['./tb-submodule-routing.component.scss']
})
export class TbSubmoduleRoutingComponent implements OnInit {
  Tb_report: boolean;
  tb_document: boolean;
  tb_master: boolean;

  constructor(private shareService: SharedService) { }
  tb_module_list:any;
  ngOnInit(): void {
    let datas = this.shareService.menuUrlData.filter(rolename => rolename.name == "TB Report");
    console.log('totaldata', datas)
    datas.forEach((element) => {
      if (element.url === "/tbreport") {
        let subModule = element.submodule;
        this.tb_module_list = subModule;
      }
    })

  }

  tbsubModuleData(data){
    if(data.url==="/tbreport"){
      this.Tb_report=true;
      this.tb_document=false;
      this.tb_master=false;
    }
    if(data.url ==="/tbdoc"){
      this.Tb_report=false;
      this.tb_document=true;
      this.tb_master=false;
    }
    if(data.url ==="/tbmaster"){
      this.tb_master=true;
      this.tb_document=false;
      this.Tb_report=false;
    }
  }

}
