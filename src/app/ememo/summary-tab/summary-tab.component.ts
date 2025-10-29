import { Component, OnInit } from '@angular/core';
import { MemoService } from '../memo.service';
import {  Router } from "@angular/router";
import { CommunicationServiceService } from '../communication-service.service';

@Component({
  selector: 'app-summary-tab',
  templateUrl: './summary-tab.component.html',
  styleUrls: ['./summary-tab.component.scss']
})
export class SummaryTabComponent implements OnInit {

  summaryData : any ={}
  bnaData ={
                "above_5": 0,
                "one_to_two": 0,
                "three_to_five": 0,
                "total": 0,
                "zero": 0
            }
  nfaData ={
                "above_5": 0,
                "one_to_two": 0,
                "three_to_five": 0,
                "total": 0,
                "zero": 0
            }
  iomData ={
                "above_5": 0,
                "one_to_two": 0,
                "three_to_five": 0,
                "total": 0,
                "zero": 0
            }
  constructor(private memoService: MemoService,
      private router: Router, private comm : CommunicationServiceService ) { }

  ngOnInit(): void {
    this.getSummaryData()
  }

  emp_br =""
  emp_name =""
  getSummaryData(){
    this.memoService
      .getMemoSummary()
      .subscribe((results) => {
        this.summaryData = results['data'][0] ?? {};
        if(this.summaryData?.bna != undefined)
          this.bnaData = this.summaryData?.bna 
        if(this.summaryData?.iom != undefined)
          this.iomData = this.summaryData?.iom 
        if(this.summaryData?.nfa != undefined)
          this.nfaData = this.summaryData?.nfa     
        this.emp_br = this.summaryData?.employee_branch ?? ''
        this.emp_name = this.summaryData?.employee_name ?? '' 
      });
  }

  viewNFA(){
    this.comm.triggerMenuTabClick('nfa')
    // this.router.navigate(["/ememo/memoNFA"], {skipLocationChange: isSkipLocationChange});
  }

  viewBN(){
    this.comm.triggerMenuTabClick('bn')
    // this.router.navigate(["/ememo/memoBN"], {skipLocationChange: isSkipLocationChange});    
  }

  viewIOM(){
    this.comm.triggerMenuTabClick('iom')
    // this.router.navigate(["/ememo/memoIOM"], {skipLocationChange: isSkipLocationChange});
  }
}
