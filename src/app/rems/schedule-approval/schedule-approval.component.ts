import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { RemsShareService } from '../rems-share.service'
import { RemsService } from '../rems.service'
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { Rems2Service } from '../rems2.service'
import { environment } from 'src/environments/environment'

const isSkipLocationChange = environment.isSkipLocationChange

@Component({
  selector: 'app-schedule-approval',
  templateUrl: './schedule-approval.component.html',
  styleUrls: ['./schedule-approval.component.scss']
})
export class ScheduleApprovalComponent implements OnInit {
  moveToEstateCellForm: FormGroup
  SA_SearchForm: FormGroup;
  ispaymentpage: boolean = true;
  approvedList: any;
  paymentcurrentpage: number = 1;
  paymentpresentpage: number = 1;
  pagesizepayment = 10;
  has_paymentnext = true;
  has_paymentprevious = true;
  premisesId: number;


  constructor(private fb: FormBuilder, private datePipe: DatePipe, private router: Router, private remsshareService: RemsShareService, private route: ActivatedRoute,
    private remsService: RemsService, private toastr: ToastrService, private notification: NotificationService, private remsService2: Rems2Service) { }

  ngOnInit(): void {
    this.moveToEstateCellForm = this.fb.group({
      content: [''],
    });
    this.SA_SearchForm = this.fb.group({
      premise_code: [''],
      premise_name: [''],
      agreement_code: ['']
    });
    console.log("search2",this.SA_SearchForm.value);
    this.getApprovedList(this.SA_SearchForm.value);
  }

  SA_Search(){
    console.log("search2",this.SA_SearchForm.value);
    this.getApprovedList(this.SA_SearchForm.value)
  }
  cleanData(o) {
    if (Object.prototype.toString.call(o) == "[object Array]") {
      for (let key = 0; key < o.length; key++) {
        this.cleanData(o[key]);
        if(Object.prototype.toString.call(o[key]) == "[object Object]") {
          if(Object.keys(o[key]).length === 0){
            o.splice(key, 1);
            key--;
          }
        }
  
      }
    }
    else if (Object.prototype.toString.call(o) == "[object Object]") {
      for (let key in o) {
        let value = this.cleanData(o[key]);
        console.log("value",value);
        if (value === null || value==="") {
          delete o[key];
        }
        if(Object.prototype.toString.call(o[key]) == "[object Object]") {
          if(Object.keys(o[key]).length === 0){
            delete o[key];
          }
        }
        if(Object.prototype.toString.call(o[key]) == "[object Array]") {
          if(o[key].length === 0){
            delete o[key];
          }
        }
      }
    }
    return o;
  }

  getApprovedList(sajson, sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
      // for (let key in sajson) {
      //   console.log("key",sajson[key]);
      //   console.log("key2",key);
      //   console.log("key3",Object.keys(sajson[key]))
      //   console.log("key4",Object.prototype.toString.call(sajson))
      // }
      console.log("sa1",sajson)
      let sajson1=this.cleanData(sajson);
      console.log("sa2",sajson1)
    this.remsService.getScheduleApproval(sajson1, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        console.log("schedule approval", results)
        let datas = results["data"];
        this.approvedList = datas;
        console.log("this.approvedList",this.approvedList);
        this.premisesId = datas
        let datapagination = results["pagination"];
        this.approvedList = datas;
        if (this.approvedList.length === 0) {
          this.ispaymentpage = false
        }
        if (this.approvedList.length > 0) {
          this.has_paymentnext = datapagination.has_next;
          this.has_paymentprevious = datapagination.has_previous;
          this.paymentpresentpage = datapagination.index;
          this.ispaymentpage = true
        }
      })
  }

  nextClickPayment() {
    if (this.has_paymentnext === true) {
      this.paymentcurrentpage = this.paymentpresentpage + 1
      this.getApprovedList(this.SA_SearchForm.value, 'asc', this.paymentpresentpage + 1, 10)
    }
  }

  previousClickPayment() {
    if (this.has_paymentprevious === true) {
      this.paymentcurrentpage = this.paymentpresentpage - 1
      this.getApprovedList(this.SA_SearchForm.value, 'asc', this.paymentpresentpage - 1, 10)
    }


  }

  scheduleId: number
  schedule(data) {
    this.scheduleId = data.id
    console.log("scheduleId", this.scheduleId)
  }

  SubmitForMoveToEstateCell(status = 2) {

    this.remsService.scheduleApprove(this.moveToEstateCellForm.value, this.scheduleId, status)
      .subscribe(res => {
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("INVALID_DATA!...")
        } else {
          this.notification.showSuccess("Approved Successfully!...")
          this.moveToEstateCellForm.reset()
          this.getApprovedList(this.SA_SearchForm.value);

        }
        return true
      })
  }



  scheduleApprovalView(scheduleData) {
    this.router.navigate(['/rems/scheduleApprovalView'], { skipLocationChange: isSkipLocationChange });
    this.remsshareService.scheduleApprovaleView.next(scheduleData);

  }


}
