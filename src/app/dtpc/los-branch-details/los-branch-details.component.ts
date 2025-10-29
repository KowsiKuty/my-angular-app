
import { Component, OnInit, Injectable, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DtpcShareService } from '../dtpc-share.service';
import { DtpcService } from '../dtpc.service';
import { formatDate, DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

@Injectable()
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-los-branch-details',
  templateUrl: './los-branch-details.component.html',
  styleUrls: ['./los-branch-details.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class LosBranchDetailsComponent implements OnInit {
  single_application_data: any;
  Charges = [];
  Collaterals = [];
  pageSize = 10;
  currentpage: number = 1;
  details_current_page: any;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  constructor(private router: Router, private DtpcShareService: DtpcShareService, private SpinnerService: NgxSpinnerService,
    private DtpcService: DtpcService, public datepipe: DatePipe) { }
  ngOnInit(): void {
    let loan_datas = this.DtpcShareService.Los_Data.value;
    this.details_current_page = this.DtpcShareService.LosCurrentPage.value;
    this.get_los_details_data(loan_datas);
  }
  public get_los_details_data(loan_datas) {
    // debugger;
    let ApplNo = loan_datas.ApplNo;
    this.Charges = [];
    this.Collaterals = [];
    this.single_application_data = [];
    this.SpinnerService.show();
    this.DtpcService.get_application_number(ApplNo).subscribe((results) => {
      //let single_data={"data":results}
      this.SpinnerService.hide();
      let single_datas = results;
      if (single_datas.Message) {
        alert(JSON.stringify(single_datas))
        return false;
      }
      //let single_data1=single_data.toString()
      let TxnDate = single_datas.TxnDate;
      let latest_date = this.datepipe.transform(TxnDate, 'dd-MMM-yyyy');
      single_datas.TxnDate = latest_date;
      this.single_application_data = single_datas;
      console.log(this.single_application_data)
      this.Charges = this.single_application_data.Charges;
      console.log(this.Charges);
      this.Collaterals = this.single_application_data.Collaterals;
      console.log(this.Collaterals);
    })
  }
  los_summary(page_type) {
    // debugger;
    this.onCancel.emit();
    // if (page_type == "is_los_branch_summary") {
    //   this.DtpcShareService.LosCurrentPage.next("is_los_branch_summary")
    //   // this.Current_Page="is_los_branch_summary";
    //   this.router.navigate(['/los',0], { skipLocationChange: true })
    // }
    // else {
    //   this.router.navigate(['/los'], { skipLocationChange: true })
    // }
  }
}