import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-sms-master',
  templateUrl: './sms-master.component.html',
  styleUrls: ['./sms-master.component.scss']
})
export class SmsMasterComponent implements OnInit {
  listicons:any={'NON OWNED ASSET MAKER':"fa fa-sitemap",'NON OWN ASSET APPROVER':"fa fa-sitemap"};
  constructor(private router: Router,private apcser:SharedService,private toastr:ToastrService) { }
  menugrid:any;
  admin:boolean=false;
  ngOnInit(): void {
    let data: any = this.apcser.submodulessmsmaster.value;
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
