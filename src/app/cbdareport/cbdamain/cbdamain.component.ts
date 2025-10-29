import { Component, OnInit } from "@angular/core";
import { SharedService } from "src/app/service/shared.service";

@Component({
  selector: "app-cbdamain",
  templateUrl: "./cbdamain.component.html",
  styleUrls: ["./cbdamain.component.scss"],
})
export class CbdamainComponent implements OnInit {
  tb_module_list: any;
  constructor(private shareService: SharedService) {}

  ngOnInit(): void {
    let datas = this.shareService.menuUrlData.filter(
      (rolename) => rolename.name == "CBDA Masters"
    );
    datas.forEach((element) => {
      if (element.url === "/cbdamaster") {
        let subModule = element.submodule;
        this.tb_module_list = subModule;
      }
    });
  }
  cbdafileShow: boolean = false;
  cbdaincShow: boolean = false;
  cbdamappingShow: boolean = false;
  cbdaspecialprod: boolean = false;
  cbdareportmodule(value) {
    if (value.url === "/cbdafile") {
      this.cbdafileShow = true;
      this.cbdaincShow = false;
      this.cbdamappingShow = false;
      this.cbdaspecialprod = false;
    }
    if (value.url === "/cbdaincexcdata") {
       this.cbdafileShow = false;
      this.cbdaincShow = true;
      this.cbdamappingShow = false;
      this.cbdaspecialprod = false;
    }
    if (value.url === "/cbdamapping") {
       this.cbdafileShow = false;
      this.cbdaincShow = false;
      this.cbdamappingShow = true;
      this.cbdaspecialprod = false;
    }
    if (value.url === "/cbdaspecialprod") {
       this.cbdafileShow = false;
      this.cbdaincShow = false;
      this.cbdamappingShow = false;
      this.cbdaspecialprod = true;
    }
  }
}
