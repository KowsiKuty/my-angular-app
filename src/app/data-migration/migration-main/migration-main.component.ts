import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-migration-main',
  templateUrl: './migration-main.component.html',
  styleUrls: ['./migration-main.component.scss']
})
export class MigrationMainComponent implements OnInit {

  constructor( private shareService: SharedService) { }
  DataMigrationList=[]
  MigrationHeader:boolean=false
  ngOnInit(): void {
      let datas = this.shareService.menuUrlData.filter(
      (rolename) => rolename.name == "Data Migration"
    );
    datas.forEach((element) => {
      if (element.url === "/datamigration") {
        let subModule = element.submodule;
        this.DataMigrationList = subModule;
      }
    });
  }
  DataMigrationmodule(sub){
    if(sub?.url=='/migrationheader'){
      this.MigrationHeader=true
    }
  }


}
