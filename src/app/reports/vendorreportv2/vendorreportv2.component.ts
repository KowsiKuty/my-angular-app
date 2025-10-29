import { Component, OnInit, ViewChild, Injectable, ElementRef } from '@angular/core';
import { AtmaService } from 'src/app/atma/atma.service'
import { ReportserviceService } from '../reportservice.service'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router'
import { NotificationService } from 'src/app/atma/notification.service'
import { NativeDateAdapter, DateAdapter } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from 'src/app/atma/error-handling.service';
import { MatDatepicker } from '@angular/material/datepicker';
import { fromEvent } from 'rxjs';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';

// import { Console } from 'console';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



export interface classification {
  id: string;
  text: string;
}
export interface vendor {
  name: string;
  id: string;
  code: string
}
export interface description {
  name: string;
  id: number;

}

export interface branch {
  name: string;
  id: string
}
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
  selector: 'app-vendorreportv2',
  templateUrl: './vendorreportv2.component.html',
  styleUrls: ['./vendorreportv2.component.scss']
})
export class Vendorreportv2Component implements OnInit {
  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;
  @ViewChild('modalclose') public modalclose: ElementRef;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;


  @ViewChild('reporttable', { static: false }) reporttable: ElementRef;

  @ViewChild('supplier') matreportsupplierAutocomplete: MatAutocomplete;
  @ViewChild('SupplierInput') SupplierInput: any;

  @ViewChild('auto2') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;

  
  @ViewChild('autov') matvendorAutocomplete: MatAutocomplete;
  @ViewChild('vendorInput') vendorInput: any;


  @ViewChild('auto11') matreportactivityAutocomplete: MatAutocomplete;
  @ViewChild('activityInput') activityInput: any;

  selectedValue : string = '1';
  vendorSummaryList = [];
  searchValue: any;
  vendorDataLength: any;
  has_next = true;
  isChecked = false;
  search_value: any;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  inputGstValue = "";
  inputPanValue = "";
  flag = false
  isLoading = false;
  classificationList: Array<classification>;
  pageSize = 10;
  isVendorSummaryPagination: boolean;
  vendorSearchForm: FormGroup;
  email_form: FormGroup;
  isRejectRemarks = false;
  rejectedList: any;
  id: number;
  StatusTag: any;
  VendorstatusesList = [{ 'id': 1, 'name': 'ACTIVE' }, { 'id': 6, 'name': 'INACTIVE' }]

  filter_base = [
    { 'id': 1, 'name': 'Filter Based Agreement From' }, { 'id': 2, 'name': 'Filter Based Agreement To' }
  ]
  // vendorSearchForm: any;
  Vendorrequests = [{ 'id': 1, 'name': 'DRAFT' }, { 'id': 2, 'name': 'PENDING_RM' }, { 'id': 3, 'name': 'PENDING_CHECKER' }, { 'id': 4, 'name': 'PENDING_HEADER' },
  { 'id': 5, 'name': 'APPROVED' }, { 'id': 6, 'name': 'RENEWAL_APPROVED' }, { 'id': 0, 'name': 'REJECTED' }]
  vendordata: any;
  branch_data: any;
  description_data: any[];
  page_search = false;
  count: any;
  from_flag: boolean;
  to_flag: boolean;
  select: Date;
  reportpopup: boolean;
  maildata: any;
  invendorsummary: any = [];
  invendor_has_next = true;
  invendor_has_previous = true;
  invendor_presentpage = 1;
  vendorid: any;

  description_has_next = true;
  description_has_previous = true;
  description_currentpage = 1
  questionnairehistory: any;

  statusdropdown = [
    { "id": 1, "name": "Contract Pending" },
    { "id": 2, "name": "Contract Documents Pending" },
    { "id": 3, "name": "Contract Rejected" },
    { "id": 4, "name": "Live"},
    { "id": 5, "name": "Contract Expired"},
    
  ]
  riskstatus: any = [
    // {"id" : 1, "name" : "Draft"},
    // {"id" : 4, "name" : "Pending"},
    // {"id" : 2, "name" : "Approved"},
    // {"id" : 3, "name" : "Return"},
    // {"id" : 5, "name" : "Risk Pending EMC"},
    {"id" : 1, "name" : "Draft"},
    {"id" : 4, "name" : " RA Pending"},
    {"id" : 2, "name" : "RA EMC accepted"},
    {"id" : 3, "name" : "RA EMC rejected"},
    {"id" : 5, "name" : "RA EMC review"},

  ]
  currenturl: string;
  currentactivity: any;
  currentvendor: any;
  supplierdata: any;
  matreportbranchAutocomplete: any;
  contract: boolean = true;
  risk: boolean;
  riskSummary: any;
  risk_next: boolean = true;
  risk_previous: boolean = true;
  riskpresentpage: number = 1;
  vendoridd: any;
  activity_id: any;
  description: any;
  s_b: any;
  supplier_name: any;
  vendor_name: any;
  risk_status_name: any;
  transList: any;
  qvid: any;
  transhas_next: boolean = false;
  transpresentpage: number = 1;
  transhas_previous: boolean = false;
pgsize: any;
  file: any;
  // autocompleteTrigger: any;

  constructor(private atmaService: AtmaService, private errorHandler: ErrorHandlingService, private SpinnerService: NgxSpinnerService, private fb: FormBuilder, private notification: NotificationService, public datepipe: DatePipe,
    private router: Router, private service: ReportserviceService
  ) { }
  ngOnInit(): void {

    console.log('routerrrrr', this.router.url);
    console.log('routerrrrr', window.location.href);
    let url = window.location.href
    this.currenturl = url.split('#')[0]
    console.log('curenturl', this.currenturl)

    this.vendorSearchForm = this.fb.group({
      to_date: [''],
      from_date: [''],
      request_for: [''],
      contract_flag: [''],
      contractdate_from_start: [''],
      contractdate_from_end: [''],
      contractdate_to_start: [''],
      contractdate_to_end: [''],
      from_to: [''],
      classification: [''],
      vendor_status: [''],
      name: [''],
      branch_id: [''],
      description: [''],
      email_status: [''],
      search_p: [0],
      supplier_name:[''],
      risk_status:['']
    })
    this.email_form = this.fb.group({
      mail_content: [''],
      file:['']
    })



    this.vendorSearchForm.get('supplier_name').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      // switchMap(value => this.dataService.getassignDeptFK(value, 1)
      switchMap(value => this.atmaService.suppliersearch(value,1)
      .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      this.supplierdata = results["data"];
    }, (error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }

  vendorsearch(page) {
   // console.log('1 search_p value,',this.vendorSearchForm.value.search_p)

    this.SpinnerService.show();
    let data;
   // console.log('2 search_p value,',this.vendorSearchForm.value.search_p)

    console.log('data',data)

    // if (!this.page_search) {
    //  console.log('3 search_p value,',this.vendorSearchForm.value.search_p)

      data = this.validation_fun()
      console.log('data',data)
    // }
    if (data == false) {
      return false
    }
   // console.log('4 search_p value,',this.vendorSearchForm.value.search_p)

    if (this.vendorSearchForm.value.search_p == 0) {

     // console.log('5 search_p value,',this.vendorSearchForm.value.search_p)

      this.notification.showError('Please  Choose any one Filter!! ');
      // this.vendorSearchForm.reset()
      // this.vendorSearchForm = this.fb.group({
      //   to_date: [''],
      //   from_date: [''],
      //   request_for:[''],
      //   contract_flag:[''],
      //   contractdate_from_start:[''],
      //   contractdate_from_end:[''],
      //   contractdate_to_start:[''],
      //   contractdate_to_end:[''],
      //   from_to:[''],
      //   classification:[''],
      //   vendor_status:[''],
      //   name:[''],
      //   branch_id:[''],description:[''],
      //   search_p:[0]
      // })
      this.SpinnerService.hide();
      return false
    }


    this.service.report_v(this.search_value, 1, page)
      .subscribe(result => {
        console.log("RESULSSS", result)
        console.log("RESULSSS", typeof result)
        if (result.data) {
          this.vendorSummaryList = result['data']
          this.count = result['count']
          let dataPagination = result['pagination'];
          if (this.vendorSummaryList.length >= 0) {
            this.has_next = dataPagination.has_next;
            this.has_previous = dataPagination.has_previous;
            this.presentpage = dataPagination.index;
            this.isVendorSummaryPagination = true;

          } if (this.vendorSummaryList.length <= 0) {
            this.isVendorSummaryPagination = false;
          }
          this.SpinnerService.hide();
          // this.vendorSearchForm.reset()

        }

        this.SpinnerService.hide();

      },
        error => {
          console.log('search error', error)
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )

  }

  validation_fun() {

    let search = this.vendorSearchForm.value;
    console.log("search",search)
    if(this.risk){
      this.vendorSearchForm.value.email_status = 6;
    }
    if (search.contract_flag == null || search.contract_flag == '' || search.contract_flag == undefined) {
      this.vendorSearchForm.value.contract_flag = ''
      //console.log('1',this.vendorSearchForm.value.search_p )
    }
    else {
      this.vendorSearchForm.value.contract_flag = this.vendorSearchForm.value.contract_flag
      this.vendorSearchForm.value.search_p = 1
      //console.log('2',this.vendorSearchForm.value.search_p )

    }
    if (search.from_date == null || search.from_date == '' || search.from_date == undefined) {
      this.vendorSearchForm.value.from_date = ''
      //console.log('1',this.vendorSearchForm.value.search_p )
    }
    else {
      this.vendorSearchForm.value.from_date = this.vendorSearchForm.value.from_date
      this.vendorSearchForm.value.search_p = 1
      //console.log('2',this.vendorSearchForm.value.search_p )

    }
    if (search.from_to == null || search.from_to == '' || search.from_to == undefined) {
      this.vendorSearchForm.value.from_to = ''
      //console.log('1',this.vendorSearchForm.value.search_p )
    }
    else {
      this.vendorSearchForm.value.from_to = this.vendorSearchForm.value.from_to
      this.vendorSearchForm.value.search_p = 1
      //console.log('2',this.vendorSearchForm.value.search_p )

    }
    if (search.risk_status == null || search.risk_status == '' || search.risk_status == undefined) {
      this.vendorSearchForm.value.risk_status = ''
      //console.log('1',this.vendorSearchForm.value.search_p )
    }
    else {
      this.vendorSearchForm.value.risk_status = this.vendorSearchForm.value.risk_status
      this.vendorSearchForm.value.search_p = 1
      //console.log('2',this.vendorSearchForm.value.search_p )

    }
    if (search.to_date == null || search.to_date == '' || search.to_date == undefined) {
      this.vendorSearchForm.value.to_date = ''
      //console.log('1',this.vendorSearchForm.value.search_p )
    }
    else {
      this.vendorSearchForm.value.to_date = this.vendorSearchForm.value.to_date
      this.vendorSearchForm.value.search_p = 1
      //console.log('2',this.vendorSearchForm.value.search_p )

    }
    if (search.description == null || search.description == '' || search.description == undefined) {
      this.vendorSearchForm.value.description = ''
      //console.log('3',this.vendorSearchForm.value.search_p )

    }
    else {

      let description = (this.vendorSearchForm.value.description.id);

      if (description == undefined) {
        this.vendorSearchForm.value.description = this.vendorSearchForm.value.description
        //console.log('4',this.vendorSearchForm.value.search_p )

      } else {
        this.vendorSearchForm.value.description = this.vendorSearchForm.value.description.id
        //console.log('5',this.vendorSearchForm.value.search_p )

      }
      this.vendorSearchForm.value.search_p = 1
      //console.log('6',this.vendorSearchForm.value.search_p )

    }


    if (search.classification == null || search.classification == '' || search.classification == undefined) {
      this.vendorSearchForm.value.classification = ''
     // console.log('7',this.vendorSearchForm.value.search_p )

    } else {

      let classification = (this.vendorSearchForm.value.classification.id)
      if (classification == undefined) {
        this.vendorSearchForm.value.classification = this.vendorSearchForm.value.classification
      //console.log('8',this.vendorSearchForm.value.search_p )

      }
      else {
        this.vendorSearchForm.value.classification = this.vendorSearchForm.value.classification.id
      //console.log('9',this.vendorSearchForm.value.search_p )

      }
      this.vendorSearchForm.value.search_p = 1
     // console.log('10',this.vendorSearchForm.value.search_p )

    }


    if (search.contractdate_from_start == null || search.contractdate_from_start == '' || search.contractdate_from_start == "''") {
      // this.vendorSearchForm.get('contractdate_from_start').setValue('')
      this.vendorSearchForm.value.contractdate_from_start = ''
      // this.vendorSearchForm.removeControl('contractdate_from')
      //console.log('11',this.vendorSearchForm.value.search_p )


    } else {
      // this.vendorSearchForm.get('contractdate_from_start').setValue(this.datepipe.transform(this.vendorSearchForm.value.contractdate_from_start, 'yyyy-MM-dd'))
      this.vendorSearchForm.value.search_p = 1
      this.vendorSearchForm.value.contractdate_from_start = this.datepipe.transform(this.vendorSearchForm.value.contractdate_from_start, 'yyyy-MM-dd')
      //console.log('12',this.vendorSearchForm.value.search_p )

    }

    if (search.contractdate_from_end == null || search.contractdate_from_end == '' || search.contractdate_from_end == "''") {
      this.vendorSearchForm.value.contractdate_from_end = ''
      // this.vendorSearchForm.removeControl('contractdate_from')
      //console.log('13',this.vendorSearchForm.value.search_p )

    } else {
      this.vendorSearchForm.value.contractdate_from_end = this.datepipe.transform(this.vendorSearchForm.value.contractdate_from_end, 'yyyy-MM-dd')
      this.vendorSearchForm.value.search_p = 1
     // console.log('14',this.vendorSearchForm.value.search_p )

    }


    if (search.request_for == null || search.request_for == '' || search.request_for == undefined) {
      // this.vendorSearchForm.get('request_for').setValue('')
      //this.vendorSearchForm.removeControl('request_for')
      this.vendorSearchForm.value.request_for = ''
     // console.log('14',this.vendorSearchForm.value.search_p )

    }
    else {

      this.vendorSearchForm.value.request_for = this.vendorSearchForm.value.request_for
      this.vendorSearchForm.value.search_p = 1
      //console.log('15',this.vendorSearchForm.value.search_p )

    }


    if (search.contractdate_to_start == null || search.contractdate_to_start == '' || search.contractdate_to_start == "''") {
      // this.vendorSearchForm.get('contractdate_to_start').setValue('')
      this.vendorSearchForm.value.contractdate_to_start = ''
      // this.vendorSearchForm.removeControl('contractdate_from')
      //console.log('16',this.vendorSearchForm.value.search_p )


    } else {
      this.vendorSearchForm.value.contractdate_to_start = this.datepipe.transform(this.vendorSearchForm.value.contractdate_to_start, 'yyyy-MM-dd')
      this.vendorSearchForm.value.search_p = 1
      //console.log('17',this.vendorSearchForm.value.search_p )


    }

    if (search.contractdate_to_end == null || search.contractdate_to_end == '' || search.contractdate_to_end == "''") {

      this.vendorSearchForm.value.contractdate_to_end = ''
      //console.log('18',this.vendorSearchForm.value.search_p )


    } else {

      this.vendorSearchForm.value.search_p = 1
      this.vendorSearchForm.value.contractdate_to_end = this.datepipe.transform(this.vendorSearchForm.value.contractdate_to_end, 'yyyy-MM-dd')
     // console.log('19',this.vendorSearchForm.value.search_p )

    }


    if (search.vendor_status == null || search.vendor_status == '' || search.vendor_status == undefined) {
      this.vendorSearchForm.value.vendor_status = ''
     // console.log('20',this.vendorSearchForm.value.search_p )

    }
    else {
      //  this.vendorSearchForm.get('vendor_status').setValue(this.vendorSearchForm.value.vendor_status)

      this.vendorSearchForm.value.vendor_status = this.vendorSearchForm.value.vendor_status
      this.vendorSearchForm.value.search_p = 1
      this.vendorSearchForm.value.search_p = 1
      //console.log('21',this.vendorSearchForm.value.search_p )

    }
    if (search.branch_id == null || search.branch_id == '' || search.branch_id == undefined) {
      // this.vendorSearchForm.get('branch_id').setValue('')

      this.vendorSearchForm.value.branch_id = ''
      //console.log('22',this.vendorSearchForm.value.search_p )

    }
    else {
      let b_id = this.vendorSearchForm.value.branch_id.id
      if (b_id == undefined) {
        this.vendorSearchForm.value.branch_id = this.vendorSearchForm.value.branch_id
        // this.vendorSearchForm.get('branch_id').setValue(this.vendorSearchForm.value.branch_id)
       // console.log('23',this.vendorSearchForm.value.search_p )

      }
      else {
        // this.vendorSearchForm.get('branch_id').setValue(this.vendorSearchForm.value.branch_id.id)

        this.vendorSearchForm.value.branch_id = this.vendorSearchForm.value.branch_id.id
      //console.log('24',this.vendorSearchForm.value.search_p )

      }
      // this.vendorSearchForm.get('branch_id').setValue(b_id)
      this.vendorSearchForm.value.search_p = 1
      //console.log('24',this.vendorSearchForm.value.search_p )

    }
    if (search.name == null || search.name == '' || search.name == undefined) {
      // this.vendorSearchForm.get('name').setValue('')
      this.vendorSearchForm.value.name = ''
      //console.log('25',this.vendorSearchForm.value.search_p )

    }
    else {
      let code = (this.vendorSearchForm.value.name.code)
      if (code == undefined) {
        this.vendorSearchForm.value.name = this.vendorSearchForm.value.name
       // console.log('26',this.vendorSearchForm.value.search_p )

        // this.vendorSearchForm.get('name').setValue(this.vendorSearchForm.value.name)
      }
      else {
        // this.vendorSearchForm.get('name').setValue(this.vendorSearchForm.value.name.code)
        this.vendorSearchForm.value.name = this.vendorSearchForm.value.name.code;
      //console.log('27',this.vendorSearchForm.value.search_p )

      }

      this.vendorSearchForm.value.search_p = 1;
      //console.log('28',this.vendorSearchForm.value.search_p )

    }
    //console.log('emailstatus',this.vendorSearchForm.value.email_status)
    //BUG ID:9321
    if (search.supplier_name == null || search.supplier_name == '' || search.supplier_name == undefined) {
      // this.vendorSearchForm.get('name').setValue('')
      this.vendorSearchForm.value.supplier_name = ''
      //console.log('25',this.vendorSearchForm.value.search_p )

    }
    else {
      let code = (this.vendorSearchForm.value.supplier_name.code)
      if (code == undefined) {
        this.vendorSearchForm.value.supplier_name = this.vendorSearchForm.value.supplier_name
       // console.log('26',this.vendorSearchForm.value.search_p )

        // this.vendorSearchForm.get('supplier_name').setValue(this.vendorSearchForm.value.supplier_name)
      }
      else {
        // this.vendorSearchForm.get('supplier_name').setValue(this.vendorSearchForm.value.supplier_name.code)
        this.vendorSearchForm.value.supplier_name = this.vendorSearchForm.value.supplier_name.code;
      //console.log('27',this.vendorSearchForm.value.search_p )

      }

      this.vendorSearchForm.value.search_p = 1;
      //console.log('28',this.vendorSearchForm.value.search_p )

    }
    ///


    if (this.vendorSearchForm.value.email_status != '') {
      //console.log('emailstatus',this.vendorSearchForm.value.email_status)
      this.vendorSearchForm.value.search_p = 1
      //console.log('29',this.vendorSearchForm.value.search_p )

    }

    if (search.contractdate_to_start != '' && search.contractdate_to_end == '' || search.contractdate_from_start != '' && search.contractdate_from_end == '') {
      this.notification.showError(' Fill Both Dates !! ');
      this.SpinnerService.hide();
     // console.log('30',this.vendorSearchForm.value.search_p )

      return false

    }



    this.search_value = this.vendorSearchForm.value
   // console.log('31',this.vendorSearchForm.value.search_p )

    return this.search_value
  }
  clearsearch() {
    // this.vendorSearchForm.addControl('search_p', new FormControl(0));
    // this.vendorSearchForm.get('search_p').setValue( 0)
    this.vendorSummaryList = [];
    this.vendorSearchForm = this.fb.group({
      to_date: [''],
      from_date: [''],
      request_for: [''],
      contract_flag: [''],
      contractdate_from_start: [''],
      contractdate_from_end: [''],
      contractdate_to_start: [''],
      contractdate_to_end: [''],
      from_to: [''],
      classification: [''],
      vendor_status: [''],
      name: [''],
      branch_id: [''], description: [''],
      search_p: [0],
      email_status: [''],
      supplier_name:[''],
      risk_status:['']
    })
    this.presentpage = 1
    this.page_search = false;
    this.flag = false;
    this.has_next = true;
    this.has_previous = true;
    this.to_flag = false;
    this.from_flag = false;

    // this.vendorSearchForm.get('contractdate_from_start').setValue('')
    // this.vendorSearchForm.get('contractdate_from_end').setValue('')
    // this.vendorSearchForm.get('contractdate_to_start').setValue('')
    // this.vendorSearchForm.get('contractdate_to_end').setValue('')
    // this.vendorSearchForm.get('from_to').setValue('')
    this.count = 0;
  }

  vendorreport() {
    this.SpinnerService.show();
      
    this.validation_fun();
    if (this.vendorSearchForm.value.search_p == 0) {
      this.notification.showError('Please select atleast one field!  ');
      this.SpinnerService.hide();

      this.vendorSearchForm.reset();
      //   this.vendorSearchForm = this.fb.group({
      //     to_date: [''],
      //     from_date: [''],
      //     request_for:[''],
      //     contract_flag:[''],
      //     contractdate_from_start:[''],
      //     contractdate_from_end:[''],
      //     contractdate_to_start:[''],
      //     contractdate_to_end:[''],
      //     from_to:[''],
      //     classification:[''],
      //     vendor_status:[''],
      //     name:[''],
      //     branch_id:[''],description:[''],
      //     search_p:[0]
      //   })
      return false
    }

    this.service.report_v(this.search_value, 0, 0)
      .subscribe(data => {
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'Vendorreport' + date + ".xlsx";
        link.click();

        // this.vendorSearchForm = this.fb.group({
        //   to_date: [''],
        //   from_date: [''],
        //   request_for:[''],
        //   contract_flag:[''],
        //   contractdate_from:[''],
        //   contractdate_to:[''],
        //   classification:[''],
        //   vendor_status:[''],
        //   name:[''],
        //   branch_id:[''],description:[''],
        //   search_p:[0]
        // })
        this.SpinnerService.hide();
        // this.vendorSearchForm.reset();

      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )

  }
  fileSelected(e){
    this.file = e.target.files[0];
    console.log("thi.dile",this.file)
  }
  send_mail_(value) {
    this.maildata = [];
      this.maildata = value;

    this.email_form.patchValue({
      mail_content: '',
    });
    // console.log('booolean', event.target.value)
    // if (event.target.checked) {
    //   this.reportpopup = true

    //   console.log('maildata', value)



      // this.email_form.patchValue({
      //   mail_content:'Hi '+value.description+' Team'+
      //   'Renewal questionnaier send to your e-mail address, kindly update'
      // })

      // setTimeout(() => {
      //   event.target.checked = false

      // }, 1500);

      // event.target.value == 'off'
      // checkbox.value='off'



    // }
    // else {
    //   this.reportpopup = false
    // }
  }
  send_mail_1(value){

    this.maildata = [];
    this.maildata = value;

  this.email_form.patchValue({
    mail_content: '',
  });
  this.submitForm1()
  }

  submitForm1() {
    console.log(this.email_form.value.mail_content)
    console.log('department_id', this.maildata.dept_id)
    console.log('vendor_id', this.maildata.vendor_id)
    console.log('activity_id', this.maildata.activity_id)


    this.SpinnerService.show();
    this.isChecked = false
    // let send = {
    //   // "vendor_id": this.maildata?.vendor_id,
    //   // "activity_id": this.maildata.activity_id,
    //  "remarks": this.email_form.value.mail_content
    // }

    let formdata = new FormData();
    formdata.append("file",this.file)
    // formdata.append("data",JSON.stringify(send));
    this.service.send_mail(this.maildata.vendor_id, this.maildata.activity_id,formdata).subscribe((results) => {
      if (results.status == 'success') {
        this.notification.showSuccess("Mail Sent Successfully!..");
        this.modalclose.nativeElement.click();
        this.email_form.reset();
        this.SpinnerService.hide();
      }
      else if (results.status) {
        this.notification.showWarning(results.status);
        this.modalclose.nativeElement.click();
        this.email_form.reset();
        this.SpinnerService.hide();
      }
      else {
        this.notification.showWarning(JSON.stringify(results.code));
        this.modalclose.nativeElement.click();
        this.SpinnerService.hide();
      }
    },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    )
  }
  submitForm() {
    console.log(this.email_form.value.mail_content)
    console.log('department_id', this.maildata.dept_id)
    console.log('vendor_id', this.maildata.vendor_id)
    console.log('vendor_id', this.maildata.activity_id)


    this.SpinnerService.show();
    this.isChecked = false
    let send = {
      "dept_id": this.maildata.dept_id,
      "vendor_id": this.maildata?.vendor_id,
      "msg": this.email_form.value.mail_content,
      "activity_id": this.maildata.activity_id,
      // "vendor_code": this.maildata.vendor_code + ' (' + this.maildata?.vendor_name + ')',
      "vendor_code": this.maildata.vendor_code,
      "vendor_name" : this.maildata?.vendor_name ,
      "description": this.maildata.description,
      "agreement_expiry_date":this.maildata.contractdate_to,
      "supplier_name" : this.maildata.supplier_name ,
      "supplier_code" : this.maildata.supplier_code,
      "type_status"    : 0,
      "service_branch" :this.maildata.dep_name
    }

    this.service.send_mail1(send).subscribe((results: any[]) => {
      if (results["key"] == 'success') {
        this.notification.showSuccess("SUCCESS!...")
        this.modalclose.nativeElement.click();
        this.email_form.reset();
        this.SpinnerService.hide();
      }
      else {
        this.notification.showWarning(JSON.stringify(results['key']));
        this.modalclose.nativeElement.click();
        this.SpinnerService.hide();
      }
    },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    )
  }


  is_contract(check) {
    if (check.checked) {
      this.vendorSearchForm.value.contract_flag = 1
      this.flag = true
    } else {
      this.vendorSearchForm.value.contract_flag = 0
      this.flag = false
      this.to_flag = false;
      this.from_flag = false;
      this.vendorSearchForm.get('contractdate_from_start').setValue('')
      this.vendorSearchForm.get('contractdate_from_end').setValue('')
      this.vendorSearchForm.get('contractdate_to_start').setValue('')
      this.vendorSearchForm.get('contractdate_to_end').setValue('')
      this.vendorSearchForm.get('from_to').setValue('')
    }


  }
  is_from(check) {
    if (check.checked) {
      this.from_flag = true;
    } else {
      this.from_flag = false;

      this.vendorSearchForm.get('contractdate_from_start').setValue('')
      this.vendorSearchForm.get('contractdate_from_end').setValue('')
      // this.vendorSearchForm.get('contractdate_to_start').setValue('')
      // this.vendorSearchForm.get('contractdate_to_end').setValue('')
      this.vendorSearchForm.get('from_to').setValue('')
    }


  }
  is_to(check) {
    if (check.checked) {
      this.to_flag = true;
    } else {

      this.to_flag = false;

      // this.vendorSearchForm.get('contractdate_from_start').setValue('')
      // this.vendorSearchForm.get('contractdate_from_end').setValue('')
      this.vendorSearchForm.get('contractdate_to_start').setValue('')
      this.vendorSearchForm.get('contractdate_to_end').setValue('')
      this.vendorSearchForm.get('from_to').setValue('')
    }


  }
  is_from_to(value) {
    console.log(value)
    this.vendorSearchForm.get('contractdate_from_start').setValue('')
    this.vendorSearchForm.get('contractdate_from_end').setValue('')
    this.vendorSearchForm.get('contractdate_to_start').setValue('')
    this.vendorSearchForm.get('contractdate_to_end').setValue('')
    if (value.id == 1) {
      this.from_flag = true;
      this.to_flag = false;

    } if (value.id == 2) {
      this.to_flag = true;
      this.from_flag = false;
    }
  }


  classifyname() {

    this.getClassification();

    this.vendorSearchForm.get('classification').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.atmaService.getClassification()
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),

          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.classificationList = datas;

      })
  }

  private getClassification() {
    this.atmaService.getClassification()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.classificationList = datas;
      })
  }
  public displayFnclassify(classify?: classification): string | undefined {
    return classify ? classify.text : undefined;
  }

  get classify() {
    return this.vendorSearchForm.get('classification');
  }


  // Vendor
  vendorget() {
    let query: String = "";
    this.vendor_data(query);

    this.vendorSearchForm.get('name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.atmaService.vendorsearch(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )

      .subscribe((results: any[]) => {
        this.vendordata = results["data"];

      })
  }
  supplierget() {
    let dataToSearchCheck = ''
    this.atmaService.suppliersearch(dataToSearchCheck, this.currentpagebranch)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierdata = datas;
        // this.List = datas;
      })
  }
  vendor_data(val) {
    this.atmaService.vendorsearch(val,1).subscribe((results: any[]) => {
      this.vendordata = results["data"];

    })

  }
  public displayFnvendor(_vendor?: vendor): string | undefined {
    return _vendor ? _vendor.name : undefined;
  }
  public displayFnSupplier(_vendor?: vendor): string | undefined {
    return _vendor ? _vendor.name : undefined;
  }

  get(_vendor) {
    return this.vendorSearchForm.value.get('name');
  }

  // vendor end
  branchget() {
    let query: String = "";
    this.vendorbranch_data(query);

    this.vendorSearchForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.atmaService.supplierbranchreport(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )

      .subscribe((results: any[]) => {
        this.branch_data = results["data"];

      })
  }
  vendorbranch_data(val) {
    this.atmaService.supplierbranchreport(val,1).subscribe((results: any[]) => {
      this.branch_data = results["data"];

    })

  }
  public displayFnbranch(_b?: branch): string | undefined {
    return _b ? _b.name : undefined;
  }

  getb(_b) {
    return this.vendorSearchForm.value.get('branch_id');
  }
  // branch

  // 
  previousClick() {
    this.page_search = true;
    this.presentpage = this.presentpage - 1
    this.vendorsearch(this.presentpage)
  }
  nextClick() {
    this.page_search = true;
    this.presentpage = this.presentpage + 1
    this.vendorsearch(this.presentpage)
  }

  // description
  description_get() {
    let query: String = ""
    this.desget(query);

    this.vendorSearchForm.get('description').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.service.getactivitydesignation(value, this.description_currentpage = 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),

          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results;
        this.description_data = datas['data'];

      })
  }

  private desget(query) {
    this.service.getactivitydesignation(query, this.description_currentpage = 1)
      .subscribe((results: any[]) => {
        let datas = results;
        this.description_data = datas['data'];
        let pagination = results['pagination']
        if (this.description_data.length != 0) {

          this.description_has_next = pagination['has_next']
          this.description_has_previous = pagination['has_previous']
          this.description_currentpage = pagination['index']

        }

      })
  }
  public displayFndesc(desc?: description): string | undefined {
    return desc ? desc.name : undefined;
  }

  get desc() {
    return this.vendorSearchForm.get('description');
  }

  fromDateSelection(event: string) {

    const date = new Date(event)
    this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  getinvendorsummary(id, page) {
    this.service.getinvendorproductsummary(id, page).subscribe(result => {
      console.log("RESULSSS", result)
      if (result.data) {
        this.invendorsummary = result['data']

        let dataPagination = result['pagination'];
        if (this.invendorsummary.length >= 0) {
          this.invendor_has_next = dataPagination.has_next;
          this.invendor_has_previous = dataPagination.has_previous;
          this.invendor_presentpage = dataPagination.index;


        }
        // this.vendorSearchForm.reset()

      }
    })


  }

  invendorsummarynext() {
    if (this.invendor_has_next) {
      this.getinvendorsummary(this.vendorid, this.invendor_presentpage + 1)
    }
  }

  riskPrevious() {
    if (this.risk_previous) {
      this.particularRisk(this.vendoridd, this.riskpresentpage - 1)
    }
  }
  riskNext() {
    if (this.risk_next) {
      this.particularRisk(this.vendoridd, this.riskpresentpage + 1)
    }
  }

  invendorsummaryprevious() {
    if (this.invendor_has_previous) {
      this.getinvendorsummary(this.vendorid, this.invendor_presentpage - 1)
    }
  }
  invendorproductsummary(vendor) {
    this.vendorid = vendor.vendor_id
    this.getinvendorsummary(this.vendorid, this.invendor_presentpage = 1)
  }
  download(id){
    if(id){
    this.service.particularDownload(this.activity_id,id)
    .subscribe(data => {
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'Questionnaire' + date + ".xlsx";
      link.click();
    },
      error => {
        this.errorHandler.handleError(error);

      }

    )} else {
      this.notification.showInfo("No Records Found!");
      this.SpinnerService.hide();
    }
  }
  downloadpdf(id){
    if(id){ 
    this.service.pdfDownload(id)
    .subscribe(data => {
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'Questionnaire' + date + ".pdf";
      // link.download = "ExpenseClaimForm.pdf";
      link.click();
    },
      error => {
        this.errorHandler.handleError(error);

      }

    )}
    else {
      this.notification.showInfo("No Records Found!");
      this.SpinnerService.hide();
    }
  }
  particularRisk(data,page){
    this.vendoridd = data.vendor_id;
    console.log("riskdata",data); 
    this.description = data.description,
    this.s_b = data.s_b.name,
    this.supplier_name = data.supplier_name,
    this.vendor_name = data.vendor_name,
    this.risk_status_name = data.risk_status_name;

    // this.riskSummary = [{
    //         "period_start": "2023-07-01",
    //         "period_end": "2023-08-31",
    // },
    // {
    //   "period_start": "2023-07-01",
    //   "period_end": "2023-08-31",
    // }];
    // // this.riskSummary.push(tempArr);
    // console.log("riskSummary",this.riskSummary)

    this.activity_id = data.activity_id;
    this.service.getRiskData(this.vendoridd, this.activity_id, page).subscribe(result => {
      console.log("riforiufhu", result)
      if (result['data']) {
        this.riskSummary = result['data'];
        // this.riskSummary.push(tempArr);
        console.log("riskSummary",this.riskSummary)
        let dataPagination = result['pagination'];
        if (this.riskSummary.length >= 0) {
          this.risk_next = dataPagination.has_next;
          this.risk_previous = dataPagination.has_previous;
          this.riskpresentpage = dataPagination.index;


        }
        // this.vendorSearchForm.reset()

      }
    })

  }

  invendorreportdownload() {
    this.service.getinvendorproductreport(this.vendorid)
      .subscribe(data => {
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'Vendorservicereport' + date + ".xlsx";
        link.click();




      },
        error => {
          this.errorHandler.handleError(error);

        }

      )
  }
  closepopup(){
    this.risk_next = true;
    this.risk_previous = true;
    this.riskpresentpage = 1;
    this.riskSummary = [];
  }
  closeinvendorpopup() {
    this.invendor_has_next = true
    this.invendor_has_previous = true
    this.invendor_presentpage = 1
    this.invendorsummary = []
  }

  generarPDF() {

    const div = document.getElementById('reporttable');
    const options = {
      background: 'white',
      scale: 3
    };

    html2canvas(div, options).then((canvas) => {

      var img = canvas.toDataURL("image/PNG");
      var doc = new jsPDF('l', 'mm', 'a4');

      // Add image Canvas to PDF
      const bufferX = 5;
      const bufferY = 5;
      const imgProps = (<any>doc).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');

      return doc;
    }).then((doc) => {
      doc.save('Vendor ' + new Date() + '.pdf');
    });
  }

  questionnairehistoryreport(activity, vendor,value) {

    // this.currentactivity=activity;
    // this.currentvendor=vendor
    
    this.maildata=value

    let url = window.location.href
    let spliturl = url.split('#')[0]

    this.currenturl = spliturl + '#/atma/activityquestionnaire?activityid=' + activity + '&vendorid=' + vendor

    console.log('current url routing', this.currenturl + '#/atma/activityquestionnaire?activityid=' + this.currentactivity + '&vendorid=' + this.vendorSearchForm)
    this.SpinnerService.show()
    this.service.reportquestionnairehistory(activity).subscribe(
      result => {
        this.SpinnerService.hide()

        this.questionnairehistory = result
      }, 
      error => {
        this.SpinnerService.hide()
      }
    )

  }

  resethistory() {
    this.questionnairehistory = []
    this.maildata=''
  }
  currentpagesupplier: number = 1;
  has_nextsupplier = true;
  has_previoussupplier = true;
  pagesupplier: number = 1;
  supplierscroll() {
    setTimeout(() => {
      if (
        this.matreportsupplierAutocomplete &&
        this.autocompleteTrigger &&
        this.matreportsupplierAutocomplete.panel
      ) {
        fromEvent(this.matreportsupplierAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matreportsupplierAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matreportsupplierAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matreportsupplierAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matreportsupplierAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextsupplier === true) {
                this.atmaService.suppliersearch(this.SupplierInput.nativeElement.value, this.currentpagesupplier + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.supplierdata = this.supplierdata.concat(datas);
                    if (this.supplierdata.length >= 0) {
                      this.has_nextsupplier = datapagination.has_next;
                      this.has_previoussupplier = datapagination.has_previous;
                      this.currentpagesupplier = datapagination.index;
                    }
                  }, (error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }

  currentpagebranch: number = 1;
  has_nextbranch = true;
  has_previousbranch = true;
  pagebranch: number = 1;
  has_nexbranch = true;
  has_previoubranch = true;
  branchScroll() {
    setTimeout(() => {
      if (
        this.matbranchAutocomplete &&
        this.autocompleteTrigger &&
        this.matbranchAutocomplete.panel
      ) {
        fromEvent(this.matbranchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbranchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbranch === true) {
                this.atmaService.supplierbranchreport(this.branchInput.nativeElement.value, this.currentpagebranch + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branch_data = this.branch_data.concat(datas);
                    if (this.branch_data.length >= 0) {
                      this.has_nextbranch = datapagination.has_next;
                      this.has_previousbranch = datapagination.has_previous;
                      this.currentpagebranch = datapagination.index;
                    }
                  }, (error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }

  currentpagevendor: number = 1;
  has_nextvendor = true;
  has_previousvendor = true;
  pagevendor: number = 1;
  has_nexvendor = true;
  has_previouvendor = true;
  vendorscroll() {
    setTimeout(() => {
      if (
        this.matvendorAutocomplete &&
        this.autocompleteTrigger &&
        this.matvendorAutocomplete.panel
      ) {
        fromEvent(this.matvendorAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matvendorAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matvendorAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matvendorAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matvendorAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nexvendor === true) {
                this.atmaService.vendorsearch(this.vendorInput.nativeElement.value, this.currentpagevendor + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.vendordata = this.vendordata.concat(datas);
                    if (this.vendordata.length >= 0) {
                      this.has_nexvendor = datapagination.has_next;
                      this.has_previouvendor = datapagination.has_previous;
                      this.currentpagevendor = datapagination.index;
                    }
                  }, (error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }


  currentpageactivity: number = 1;
  has_nextactivity = true;
  has_previousactivity = true;
  pageactivity: number = 1;
  has_nexactivity = true;
  has_previouactivity = true;
  activityscroll() {
    setTimeout(() => {
      if (
        this.matreportactivityAutocomplete &&
        this.autocompleteTrigger &&
        this.matreportactivityAutocomplete.panel
      ) {
        fromEvent(this.matreportactivityAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matreportactivityAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matreportactivityAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matreportactivityAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matreportactivityAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nexactivity === true) {
                this.atmaService.getactivitydesignation(this.activityInput.nativeElement.value, this.currentpageactivity + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.description_data = this.description_data.concat(datas);
                    if (this.description_data.length >= 0) {
                      this.has_nexactivity = datapagination.has_next;
                      this.has_previousactivity = datapagination.has_previous;
                      this.currentpageactivity = datapagination.index;
                    }
                  }, (error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }
  selectedValues(e){
    console.log("event",e);
    let value = e.value;
    this.contract = (value == 1) ? true : false;
    this.risk = (value == 2) ? true : false;
    this.vendorSearchForm.reset();
  }
  gettranhistory(data){
    // this.prno=pr.no
    this.id=data.activity_id
    this.qvid = data.que_v_map_id
    this.SpinnerService.show();
    this.atmaService.gettranshis(this.id,this.qvid)
      .subscribe((results) => {
        this.SpinnerService.hide();
        this.transList = results['data']
        let dataPagination = results['pagination'];
        if (this.transList.length >= 0) {
          this.transhas_next = dataPagination.has_next;
          this.transpresentpage = dataPagination.index;
          this.transhas_previous = dataPagination.has_previous;

          this.isVendorSummaryPagination = true;

        } if (this.transList.length <= 0) {
          this.isVendorSummaryPagination = false;
        }
          
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }  

  transnextClick() {
    if (this.transhas_next === true) {
      this.gettranhistory(this.transpresentpage + 1)
    }
  }
  transpreviousClick() {
    if (this.transhas_previous === true) {
      this.gettranhistory(this.transpresentpage - 1)
    }
  }
}



        
          