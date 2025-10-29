import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TnebShareService } from '../tneb-share.service';
import { TnebService } from '../tneb.service';

@Component({
  selector: 'app-electricity-details-co-do-apptoval-summary',
  templateUrl: './electricity-details-co-do-apptoval-summary.component.html',
  styleUrls: ['./electricity-details-co-do-apptoval-summary.component.scss']
})
export class ElectricityDetailsCoDoApptovalSummaryComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
   
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
  codosearchform:any=FormGroup;
  summarydata:Array<any>=[];
  has_next:boolean=false;
  has_previous:boolean=false;
  presentpage:number=1;
  pagesize:number=10;
  statusdetails:any={'Modified':4,'Submitted':0,'Resubmitted':2,'Approved':1,'Rejected':3};
  constructor(private spinner:NgxSpinnerService,private fb:FormBuilder,private router:Router,private ebservice:TnebService,
    private tnebshare:TnebShareService
    ) { }

  ngOnInit(): void {
    this.codosearchform=this.fb.group({
      'consumerno':new FormControl(''),
      'branch':new FormControl(''),
      'status':new FormControl('')
    });
    this.getsummarydata();
  }
  getsummarydata(){
    this.ebservice.getcodoapprovalsummary('',this.presentpage,'','','').subscribe(data=>{
      this.summarydata=data['data'];
      let pagination:any=data['pagination'];
      this.has_next=pagination.has_next;
      this.has_previous=pagination.has_previous;
      this.presentpage=pagination.index;
    },
    (error)=>{

    }
    )
  }
  searchsummarydata(){
    let consumer_no:any=this.codosearchform.get('consumerno').value !=undefined?this.codosearchform.get('consumerno').value:'';
    let consumer_branch:any=this.codosearchform.get('branch').value !=undefined?this.codosearchform.get('branch').value:'';
    let consumer_status:any=this.codosearchform.get('status').value !=undefined?this.statusdetails[this.codosearchform.get('status').value]:'';
    this.ebservice.getcodoapprovalsummary('',this.presentpage,consumer_no,consumer_branch,consumer_status).subscribe(data=>{
      this.summarydata=data['data'];
      let pagination:any=data['pagination'];
      // this.has_next=pagination.has_next;
      // this.has_previous=pagination.has_previous;
      // this.presentpage=pagination.index;
    },
    (error)=>{

    }
    )
  }
  resetdata(){
    this.codosearchform.reset('');
    this.getsummarydata();
  }
  uploaddata(data:any){
    this.tnebshare.viewelecdetails.next(data);
    this.router.navigate(['/tneb/elctcodoapproval'])
  }
  nextdata(){
    if(this.has_next){
      this.presentpage=this.presentpage+1;
      this.getsummarydata();
    }
  }
  previousdata(){
    if(this.has_previous){
      this.presentpage=this.presentpage-1;
      this.getsummarydata();
    }
  }


}
