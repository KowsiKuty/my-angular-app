import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-sms-transaction-summary',
  templateUrl: './sms-transaction-summary.component.html',
  styleUrls: ['./sms-transaction-summary.component.scss']
})
export class SmsTransactionSummaryComponent implements OnInit {
  listicons:any={"SMS MAKER":"fa fa-sitemap", "SMS APPROVAL":"fa fa-cog","NATURE OF PROBLEM":"fa fa-sitemap","LIST OF ASSET":"fa fa-sitemap",'TICKETING':"fa fa-sitemap",'SMS AMC WAR ADMIN':"fa fa-sitemap",'NON OWNED ASSET MAKER':"fa fa-sitemap",'NON OWN ASSET APPROVER':"fa fa-sitemap"};
  constructor(private router: Router,private apcser:SharedService,private toastr:ToastrService) { }
  menugrid:any;
  admin:boolean=false;
  ngOnInit(): void {
    let data: any = this.apcser.submodulessms.value;
    this.menugrid=data
    console.log('fghgi')
    console.log(this.menugrid)
   
  }
  movetopage(data){
    if(data.url=='/smsticketsummary'){
      this.toastr.success('Click Add(+) for New Ticketing');
    }
  }

}