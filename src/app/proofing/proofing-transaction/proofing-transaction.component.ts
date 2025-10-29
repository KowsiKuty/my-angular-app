import { C } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/service/shared.service';
import { ShareService } from '../share.service';
@Component({
  selector: 'app-proofing-transaction',
  templateUrl: './proofing-transaction.component.html',
  styleUrls: ['./proofing-transaction.component.scss']
})
export class ProofingTransactionComponent implements OnInit {
 url:any;
 subModuleList:any[]=[]
  reportmodule: any;
  constructor(private shareservice:SharedService,private shareservices: ShareService,) { }

  ngOnInit(): void {
  
  this.subModuleList =this.shareservice.proofingsub.value;
  

  let data= {
    "id": 1364,
    "logo": "far fa-clock",
    "name": "New Proofing",
    "order": null,
    "role": [
        {
            "code": "ROL3",
            "id": 3,
            "name": "Header"
        }
    ],
    "type": "transaction",
    "url": "/newproffing"
}
const exists = this.subModuleList.some(item => item.name === data.name);

if (!exists) {
  this.subModuleList.push(data);
}

  console.log("submodulelist==========>",this.subModuleList)
  // this.subModuleData(this.subModuleList)
  // this.reportmodule=this.subModuleList.name
  let arr: any = [];
  for (let card of this.subModuleList) {
    arr.push(card.name);
  }
  console.log("array=====>",arr)
  // let value = arr.find(element => element === 'Proofing Report');
  // let value2 = arr.find(element => element === 'Proofing Summary');

  // if(value === 'Proofing Report'){
  //   this.shareservices.cardreport.next(true)
  // }else if(value2 === 'Proofing Summary'){
  //   this.shareservices.cardreport.next(false)

  // }
  }
  subModuleData(data) {
    if(data.name === 'Proofing Report'){
      this.shareservices.cardreport.next(true)
      return false
    }else if(data.name === 'Proofing File Upload'){
      this.shareservices.cardreport.next(false)
      return false
    }
    // let arr: any = [];
    // for (let card of this.subModuleList) {
    //   arr.push(card.name);
    // }
//     console.log("array=====>",arr)
//     let arrays = arr.values()
//     for (let singlearr of  arrays)
// {
//   if(singlearr === 'Proofing Report'){
//     this.shareservices.cardreport.next(true)
//     return false
//   }else if(singlearr === 'Proofing Summary'){
//     this.shareservices.cardreport.next(false)
//     return false
//   }
// }
    this.url = data.url;
  }
  listicons:any={"Proofing Mapping":"fa fa-sitemap","Proofing File Upload old":"fa fa-cloud-upload","Proofing Report":"fa fa-file-text",
  "Proofing File Upload":"fa fa-cloud-upload","Connection File Upload":"fa fa-cloud-upload","New Proofing":"fa fa-sitemap",};

}
