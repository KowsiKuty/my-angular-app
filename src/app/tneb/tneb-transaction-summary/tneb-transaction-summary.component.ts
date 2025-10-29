import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-tneb-transaction-summary',
  templateUrl: './tneb-transaction-summary.component.html',
  styleUrls: ['./tneb-transaction-summary.component.scss']
})
export class TnebTransactionSummaryComponent implements OnInit {
//   listicons:any={"Electricity Details Maker":"fa fa-sitemap", "Electricity Details Approver":"fa fa-cog",
//   "Electricity Details CO and DO Summary":"fa fa-sitemap","Electricity Details Status":"fa fa-cog",
//   "Electricity Details CO and DO Approval Summary":"fa fa-sitemap",
//   "Electricity Details Query Summary":"fa fa-quora"
// };
listicons:any={"Electricity Details Maker":"fa fa-sitemap", "Electricity Details Approver":"fa fa-cog",
  "Electricity Details CO and DO Summary":"fa fa-sitemap","Electricity Details Status":"fa fa-cog",
  "Electricity Details CO and DO Approval Summary":"fa fa-sitemap",
  "Electricity Details Query Summary":"fa fa-quora"
};
  constructor(private router: Router,private apcser:SharedService) { }
  menugrid:any;
  
  currentab=0;
  currenttabname:any

  ngOnInit(): void {
    let data: any = this.apcser.submodulestneb.value;
    this.menugrid=data

  //   let array=[
  //     {
  //       "id": 248,
  //       "logo": null,
  //       "name": "Electricity Board",
  //       "role": [
  //           {
  //               "code": "ROL1",
  //               "id": 1,
  //               "name": "Maker"
  //           }
  //       ],
  //       "type": "transaction",
  //       "url": "/electricityboardmaster"
  //   },{
  //     "id": 249,
  //     "logo": null,
  //     "name": "Electricity Region",
  //     "role": [
  //         {
  //             "code": "ROL1",
  //             "id": 1,
  //             "name": "Maker"
  //         }
  //     ],
  //     "type": "transaction",
  //     "url": "/electricityregionmaster"
  // }
  //   ]

  //   for(let i=0;i<array.length;i++){
  //     this.menugrid.push(array[i])
  //   }
  //   console.log('fghgi')
    console.log(this.menugrid)
    


    // document.getElementById('tab'+this.currenttabname) as HTMLElement

    this.currenttabname=this.menugrid[0]
    

    this.tabselect(this.currentab,this.currenttabname)

  }

  tabselect(i,value){

    this.currentab=i
    this.currenttabname=value.name
    this.router.navigateByUrl(value.url)
    console.log('tabs',this.currentab,this.currenttabname)

  }

}