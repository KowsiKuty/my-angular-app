import { Component, OnInit, Inject, Injectable, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ProisionshareserviceService } from '../proisionshareservice.service';
import { ProvisionService } from '../provision.service'
import { NotificationService } from '../notification.service';
import { ErrorHandlingprovisionService } from '../error-handlingprovision.service'
import { Router, ActivatedRoute } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
}
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
  selector: 'app-provision-report',
  templateUrl: './provision-report.component.html',
  styleUrls: ['./provision-report.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class ProvisionReportComponent implements OnInit {

  constructor(public datepipe: DatePipe, private fb: FormBuilder, private Service: ProvisionService,
    private notification: NotificationService, private SpinnerService: NgxSpinnerService,
    private errorHandler: ErrorHandlingprovisionService, public share: ProisionshareserviceService,
    public router: Router, private cdr: ChangeDetectorRef ) {
 
 }

 provisionReport: FormGroup;

 provisionObjects = {
  statusList : []
 }


  ngOnInit(): void {
    this.provisionReport = this.fb.group({
      fromdate: '',
      todate: '',
      status: ''
    })
    this.report_drop() 
  }


  report_drop() {
    this.SpinnerService.show()
    this.Service.report_dropdownAction()
      .subscribe((results: any[]) => {
        this.provisionObjects.statusList = results["data"]; 
        this.SpinnerService.hide()
      }, (error) => {
        this.SpinnerService.hide()
      })
  }



  Provisionreport(){

    let data = this.provisionReport.value 

    if(data?.fromdate == '' && data?.todate != ''){
      this.notification.showWarning("Please fill From Date")
      return false 
    }
    if(data?.todate == '' && data?.fromdate != ''){
      this.notification.showWarning("Please fill To Date")
      return false 
    }
    
    let obj; let fromdate; let todate; 

    if( data?.fromdate != '' || data?.fromdate != null || data?.fromdate != undefined ){
      fromdate = this.datepipe.transform(data?.fromdate, 'yyyy-MM-dd')
      todate = this.datepipe.transform(data?.todate, 'yyyy-MM-dd')
    }

    obj = {
      fromdate : fromdate,
      todate: todate,
      status: data?.status
    }

    for (let i in obj){
      if(obj[i] == '' || obj[i]== null || obj[i] == undefined){
        obj[i] = ''
      }
    }

    this.Service.provisionReportSearch(obj) 
      .subscribe(data => {
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'ProvisionReport' + date + ".xlsx";
        link.click();
        this.SpinnerService.hide();

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })


  }
  }






