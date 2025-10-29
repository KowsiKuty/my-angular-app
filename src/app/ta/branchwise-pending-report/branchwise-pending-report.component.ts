import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TaTransactionSummaryComponent } from '../ta-transaction-summary/ta-transaction-summary.component';
import { TaService } from '../ta.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-branchwise-pending-report',
  templateUrl: './branchwise-pending-report.component.html',
  styleUrls: ['./branchwise-pending-report.component.scss']
})
export class BranchwisePendingReportComponent implements OnInit {
  tabranchwiseForm:FormGroup;
  getbranchwiseList:any;
  branchwisemodal:any;
  value:any;
  has_previous:boolean=false;
  has_next:boolean=false;
  presentpage:number=1;
  pagecount:number=10;
  radiocheck: any[] = [
    { value: 1, display: 'Self' },
    { value: 0, display: 'Other' }
  ]
  constructor(private taservice:TaService,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.branchwisemodal={
      status:''
    }
  }
  getdata(data){
    this.spinner.show()
    this.value=data.value
    this.taservice.getbranchwisereport(this.value)
    .subscribe(result=>{
      this.spinner.hide();
      this.getbranchwiseList=result['data']
     
    },error=>{
      this.spinner.hide();
    })
  }
  getsumdata(){
    this.spinner.show()
    this.taservice.getbranchwisereport(this.value)
    .subscribe(result=>{
      this.spinner.hide();
      this.getbranchwiseList=result['data']
     
    },error=>{
      this.spinner.hide()
    })
  }
  previousClick(){
    if(this.has_previous===true){
      this.presentpage -=1
      this.getsumdata()
    }

  }
  nextClick(){
    if(this.has_previous===true){
      this.presentpage +=1
      this.getsumdata()
    }

  }
}
