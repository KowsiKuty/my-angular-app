import { Component, OnInit } from '@angular/core';
import { LeadserviceService } from '../leadservice.service';

@Component({
  selector: 'app-alllead',
  templateUrl: './alllead.component.html',
  styleUrls: ['./alllead.component.scss']
})
export class AllleadComponent implements OnInit {
  leaddata=[];
  leaddata_hasnext=true;
  leaddata_hasprevious=true;
  currentleaddatapage=1;
  vendorid:any

  constructor(private leadservice:LeadserviceService) { }

  ngOnInit(): void {
    const data=JSON.parse(localStorage.getItem('UserData'))
    // let roleid=data.role.id
    this.getagentlead(this.currentleaddatapage)
  }


  getagentlead(page){
    // let role=value == 1? true:false
    // this.leadservice.getagentlead(this.vendorid,1,page).subscribe(
    //   result=>{
    //     console.log(this.leaddata)
    //     this.leaddata=result['data'];
    //     let pagination=result['pagination']
    //     console.log(this.leaddata)

    //     if(this.leaddata.length != 0){
    //       this.leaddata_hasnext=pagination['has_next']
    //       this.leaddata_hasprevious=pagination['has_previous']
    //       this.currentleaddatapage=pagination['index']

    //     }
    //   }
    // )
  }

  getpreviouslead(){
    if(this.leaddata_hasprevious){
      this.getagentlead(this.currentleaddatapage-1)
    }
  }

  getnextlead(){
    if(this.leaddata_hasprevious){
      this.getagentlead(this.currentleaddatapage+1)
    }
  }

}