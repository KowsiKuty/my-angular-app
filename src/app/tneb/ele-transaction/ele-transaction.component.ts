import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-ele-transaction',
  templateUrl: './ele-transaction.component.html',
  styleUrls: ['./ele-transaction.component.scss']
})
export class EleTransactionComponent implements OnInit {

  listicons:any={"Electricity Payment summary":"fa fa-sitemap", "EB Details Transaction Summary":"fa fa-cog"};
  currentab=0;
  currenttabname: any;
  constructor(private router: Router,private apcser:SharedService,private shareservice:SharedService) { }
  menugrid:any;
  ngOnInit(): void {
  //   let data: any = [{"id": 190,"logo": "","name": "Electricity Payment summary","type": "transaction","url": "/eleDetailPaymentSummary"},
  //   {"id": 246,"logo": '',"name": "EB Details Transaction Summary","type": "transaction","url": "/elecdetailsappsummary"}
  // ];

  console.log('data',this.shareservice.submodulestneb.value)

  let data = this.shareservice.submodulestneb.value
    
    this.menugrid=data
    console.log('fghgi')
    console.log(this.menugrid)

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
