import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate, DatePipe, Time } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../notification.service'

import { TaService } from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';

import { LOCALE_ID } from '@angular/core';

import { ActivatedRoute, Router } from "@angular/router";
import { ShareService } from 'src/app/ta/share.service';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { NgxSpinnerService } from "ngx-spinner";
// import { error } from 'console';

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};
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
  selector: 'app-lodging-expence',
  templateUrl: './lodging-expence.component.html',
  styleUrls: ['./lodging-expence.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    { provide: LOCALE_ID, useValue: 'en-EN' },
    { provide: MAT_DATE_LOCALE, useValue: 'en-EN' },
    DatePipe
  ]
})
export class LodgingExpenceComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() expense_navigate_n=new EventEmitter<any>();
  expenseid: any
  exptype: any
  comm: any
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger
  @ViewChild('inputassetid') inputasset: any;
  @ViewChild('assetid') matassetidauto: MatAutocomplete;
  @ViewChild('hsncodeid') hsncodeset: any;
  @ViewChild('hsnid') hsnidauto: MatAutocomplete;
  @ViewChild('gstcodetid') gstcodeset: any;
  @ViewChild('gstid') gstidauto: MatAutocomplete;

  lodging: any
  lodgeid: any
  tourno: any
  citylist: any;
  city: any;
  fromtime: Time;
  acrefno: any;
  vendorgstno: any;
  claimedamount: number;
  billavailable: any;
  vendorname: any;
  lodgcheckoutdate: any;
  totime: any;
  fromdate: any;
  lodgecheckouttime: any;
  igst: number = 0;
  sgst: number = 0;
  cgst: number = 0;
  appamount: number;
  billnumber: number;
  todate: any;
  applevel: number = 0;

  startdate: any;
  defaultValue = '6:00 am'
  enddate: any;
  detailsframe: any;
  totalbillamount: number;
  eligibleamount: any;
  currentpage: number = 1;
  pagesize = 10;
  noofday: any;
  centerlist: any;
  lodgingform: FormGroup;
  tourdatas: string;
  employeename: any;
  employeegrade: any;
  employeedesignation: any;
  gender:any;
  id: any;
  show_number: boolean = false
  feild_disable: boolean = true
  claimid: any;
  expenceid: string;
  approvedamount: number;
  acc: any;
  datecopy: any;
  date: any;
  Dailydiemfromdate: Date;
  DailydiemTodate: Date;
  yesnoList: any;
  taxonly: any;
  pageSize = 10;
  p = 1;
  has_nextid: boolean = true;
  has_presentid: number = 1;
  has_nexthsnid: boolean = true;
  has_presenthsnid: number = 1;
  has_nextgstid: boolean = true;
  has_presentgstid: number = 1;
  isLoading: boolean;
  expname: string;
  maker: boolean;
  approver: boolean = false;
  gstshow: boolean = false;
  lodgefromdate: any;
  lodgetodate: any;
  maximum: any;
  maxdayslimit: any;
  newform: boolean = true;
  billchecklist: any;
  expid: any;
  isonbehalf: boolean;
  onbehalf_empName: string;
  applist: any[];
  statusid: any;
  report: boolean = false;
  enb_all_exbdetails:boolean=false;
  ap:any;
  apuser_key: boolean = false;
  bank_gst: Number = 0;
  validate_gst: boolean = false;
  tourreq_no:any

  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private http: HttpClient,
    private notification: NotificationService, private taservice: TaService,
    public sharedService: SharedService, private route: Router, private activatedroute: ActivatedRoute, private SpinnerService: NgxSpinnerService,
    private shareservice: ShareService, private router: Router) { }


  ngOnInit(): void {
    this.ap='ap_verify';
    let expensetype = JSON.parse(localStorage.getItem('expense_edit'));
    // this.tourreq_no =expensetype.requestno
    let expensedetails = JSON.parse(localStorage.getItem('expense_details'))?JSON.parse(localStorage.getItem('expense_details')):JSON.parse(localStorage.getItem('expense_edit'));
    this.report = expensedetails.report
    this.tourreq_no =expensedetails.requestno
    this.employeename = '(' + expensedetails.employee_code + ') ' + expensedetails.employee_name;
    this.gender = expensedetails?.gender
    this.employeegrade = expensedetails.empgrade?expensedetails.empgrade: expensedetails.emp_grade;
    this.employeedesignation = expensedetails.empdesignation?expensedetails.empdesignation:expensedetails.designation;
    if(this.shareservice.TA_Ap_Exp_Enb_type.value){
      this.enb_all_exbdetails=true;
    }
    else{
      this.enb_all_exbdetails=false;
    }
    this.startdate = this.datePipe.transform(expensedetails.startdate, 'yyyy-MM-dd');
    // this.startdate = this.datePipe.transform(expensedetails.startdate, 'yyyy-MM-ddTHH:mm');
    this.enddate = this.datePipe.transform(expensedetails.enddate, 'yyyy-MM-dd');
    // this.enddate = this.datePipe.transform(expensedetails.enddate, 'yyyy-MM-ddTHH:mm');
    this.statusid = expensedetails.claim_status_id;
    if (expensedetails.applevel) {
      this.applevel = expensedetails.applevel
    }

    this.expenceid = expensedetails.tourid?expensedetails.tourid:expensedetails.id;
    if (expensedetails.onbehalfof) {
      this.isonbehalf = true;
      this.onbehalf_empName = '(' + expensedetails.employee_code + ') ' + expensedetails.employee_name
      console.log("onbehalf_empName", this.onbehalf_empName)
    } else {
      this.isonbehalf = false;
    }
    if (expensedetails.applevel == 2 || expensedetails.applevel == 1) {
      this.isonbehalf = false;
      this.expenceid = expensedetails['tourid']
      this.approver = true;
    }
    if (this.statusid == 3 || this.statusid == 4 || this.statusid == 2) {
      this.approver = true;
    }

    if (expensetype.status == 'REQUESTED') {
      this.newform = false;
    }
    this.exptype = expensetype.expenseid
    if (this.exptype == 5) {
      this.expname = 'Lodging';
    }

    console.log("sf", this.exptype)
    this.comm = expensetype.requestercomment
    console.log("cc", this.comm)



    this.lodgingform = this.formBuilder.group({
      data: new FormArray([
        this.createItem(),

      ]),
      // data: new FormArray([]),
    })
  if(this.shareservice.TA_Ap_Exp_Enb_type.value){
    this.apuser_key = true;
    this.SpinnerService.show()
    this.taservice.getlodgeeditSummary(this.expenceid, this.report,this.ap).subscribe(res => {
      this.SpinnerService.hide()
      let lodgelist = res['data'];
      this.bank_gst = res['branch_gst']
      var length = lodgelist.length;
      for (var i = 0; i < length; i++) {
        delete lodgelist[i].claimreqid;
        delete lodgelist[i].exp_name;
        delete lodgelist[i].exp_id
        if (i > 0) {
          this.addSection();
        }
        lodgelist[i].accbybank = String(lodgelist[i].accbybank.value)
        // lodgelist[i].accrefbybank = String(lodgelist[i].accrefbybank.value)
        lodgelist[i].billavailable = String(lodgelist[i].billavailable.value)
        // lodgelist[i].fromdate = this.datePipe.transform(lodgelist[i].fromdate, 'yyyy-MM-ddTHH:mm');
        lodgelist[i].fromdate = this.datePipe.transform(lodgelist[i].fromdate, 'yyyy-MM-dd');
        lodgelist[i].todate = this.datePipe.transform(lodgelist[i].todate, 'yyyy-MM-dd');
        lodgelist[i].lodgcheckoutdate = this.datePipe.transform(lodgelist[i].lodgcheckoutdate, 'yyyy-MM-dd');
        // lodgelist[i].todate = this.datePipe.transform(lodgelist[i].todate, 'yyyy-MM-ddTHH:mm');
        // lodgelist[i].lodgcheckoutdate = this.datePipe.transform(lodgelist[i].lodgcheckoutdate, 'yyyy-MM-ddTHH:mm')
        lodgelist[i].gstno=lodgelist[i].gstno?lodgelist[i].gstno:"";
        lodgelist[i].gstno=lodgelist[i].gst_no?lodgelist[i].gst_no:"";
        lodgelist[i].invoiceno=lodgelist[i]['invoiceno']?lodgelist[i]['invoiceno']:"" ;
        lodgelist[i].invoiceno=lodgelist[i]['invoice_no']?lodgelist[i]['invoice_no']:"";
        lodgelist[i].invoicedate= lodgelist[i]['invoicedate']?lodgelist[i]['invoicedate']:"";
        lodgelist[i].invoicedate= lodgelist[i]['invoice_date']?this.datePipe.transform(lodgelist[i].invoice_date,'yyyy-MM-dd'):'';
        lodgelist[i].vendorgstno=lodgelist[i].vendorgstno?lodgelist[i].vendorgstno:'';
        lodgelist[i].address=lodgelist[i]['address']?lodgelist[i]['address']:"";
        lodgelist[i].cgst=lodgelist[i]['cgst']?lodgelist[i]['cgst']:"";
        lodgelist[i].sgst=lodgelist[i]['sgst']?lodgelist[i]['sgst']:"";
        lodgelist[i].igst=lodgelist[i]['igst']?lodgelist[i]['igst']:"";
        lodgelist[i].invoiceamount=lodgelist[i]['invoice_amount']?lodgelist[i]['invoice_amount']:"";
        lodgelist[i].bankgstno=res['branch_gst']?res['branch_gst']:"";
        
        // gstno:datas[i]['gstno']?datas[i]['gstno']:"",
        //     invoiceno:datas[i]['invoiceno']?datas[i]['invoiceno']:"",
        //     invoicedate:datas[i]['invoicedate']?datas[i]['invoicedate']:"",
      }
      if (lodgelist.length != 0) {
        this.gstshow = true;
        this.lodgingform.patchValue({
          data: lodgelist
        })
      }
    }, (error) => {
      this.SpinnerService.hide()
    })
  }
    else{
    this.SpinnerService.show()
    this.taservice.getlodgeeditSummary(this.expenceid, this.report,'').subscribe(res => {
      this.SpinnerService.hide()
      let lodgelist = res['data'];
      this.bank_gst = res['branch_gst']
      var length = lodgelist.length;
      for (var i = 0; i < length; i++) {
        delete lodgelist[i].claimreqid;
        delete lodgelist[i].exp_name;
        delete lodgelist[i].exp_id
        if (i > 0) {
          this.addSection();
        }
        lodgelist[i].accbybank = String(lodgelist[i].accbybank.value)
        // lodgelist[i].accrefbybank = String(lodgelist[i].accrefbybank.value)
        lodgelist[i].billavailable = String(lodgelist[i].billavailable.value)
        lodgelist[i].fromdate = this.datePipe.transform(lodgelist[i].fromdate, 'yyyy-MM-dd');
        // lodgelist[i].fromdate = this.datePipe.transform(lodgelist[i].fromdate, 'yyyy-MM-ddTHH:mm');
        lodgelist[i].todate = this.datePipe.transform(lodgelist[i].todate, 'yyyy-MM-dd');
        // lodgelist[i].todate = this.datePipe.transform(lodgelist[i].todate, 'yyyy-MM-ddTHH:mm');
        lodgelist[i].lodgcheckoutdate = this.datePipe.transform(lodgelist[i].lodgcheckoutdate, 'yyyy-MM-dd');
        lodgelist[i].gstno=lodgelist[i].gstno?lodgelist[i].gstno:"";
        lodgelist[i].invoiceno=lodgelist[i]['invoiceno']?lodgelist[i]['invoiceno']:"" ;
        lodgelist[i].invoiceno=lodgelist[i]['invoice_no']?lodgelist[i]['invoice_no']:"";
        lodgelist[i].invoicedate= lodgelist[i]['invoicedate']?lodgelist[i]['invoicedate']:"";
        lodgelist[i].invoicedate= lodgelist[i]['invoice_date']?this.datePipe.transform(lodgelist[i].invoice_date,'yyyy-MM-dd'):'';
        lodgelist[i].gstno=lodgelist[i].vendorgstno?lodgelist[i].vendorgstno:'';
        lodgelist[i].address=lodgelist[i]['address']?lodgelist[i]['address']:"";
        lodgelist[i].cgst=lodgelist[i]['cgst']?lodgelist[i]['cgst']:0;
        lodgelist[i].sgst=lodgelist[i]['sgst']?lodgelist[i]['sgst']:0;
        lodgelist[i].igst=lodgelist[i]['igst']?lodgelist[i]['igst']:0;
        lodgelist[i].invoiceamount=lodgelist[i]['invoiceamount']?lodgelist[i]['invoiceamount']:0;
        lodgelist[i].bankgstno=res['branch_gst']?res['branch_gst']:"";
        
        // gstno:datas[i]['gstno']?datas[i]['gstno']:"",
        //     invoiceno:datas[i]['invoiceno']?datas[i]['invoiceno']:"",
        //     invoicedate:datas[i]['invoicedate']?datas[i]['invoicedate']:"",
      }
      if (lodgelist.length != 0) {
        this.gstshow = true;
        this.lodgingform.patchValue({
          data: lodgelist
        })
      }
      else {
        let myform = (this.lodgingform.get('data') as FormArray).at(0)
        myform.patchValue({bankgstno: res['branch_gst']})
        }
    }, (error) => {
      this.SpinnerService.hide()
    })
  }
    this.getcityValue();
    this.getCenter();
    this.getyesno();
    this.gethsncode();
    this.getgstcode();
    this.createtime();
  }

  cityname(subject) {
    return subject ? subject.city : undefined;
  }
  getyesno() {
    this.taservice.getyesno()
      .subscribe(res => {
        this.yesnoList = res
        this.billchecklist = res
        console.log("yesnoList", this.yesnoList)
        console.log("billyesnoList", this.billchecklist)
      })
  }
  addSection() {
    const data = this.lodgingform.get('data') as FormArray;
    data.push(this.createItem());
    // this.gstshow = false
  }
  // deleteArray(index: number) {
  //   (<FormArray>this.lodgingform.get('data')).removeAt(index);
  // }
  removeSection(i) {
    if (this.lodgingform.value.data[i].id == undefined || this.lodgingform.value.data[i].id == null || this.lodgingform.value.data[i].id ==''){
      let ind = this.pageSize * (this.p - 1) + i;
      const control = <FormArray>this.lodgingform.controls['data'];
      control.removeAt(ind)
    }
    else {
      this.SpinnerService.show()
      this.taservice.deletelodgingdeleteSummary(this.lodgingform.value.data[i].id)
        .subscribe(res => {
          if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
            this.notification.showWarning("Duplicate! Code Or Name ...")
          } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
            this.notification.showError("INVALID_DATA!...")
          }
          else {
            this.SpinnerService.hide()
            this.notification.showSuccess("Deleted Successfully....")
            let ind = this.pageSize * (this.p - 1) + i;
            const control = <FormArray>this.lodgingform.controls['data'];
            control.removeAt(ind)
            console.log("res", res)
            this.onSubmit.emit();
            return true
          }
        }
        )

    // this.dailydiem.data.splice(i, 1);
    }
    // console.log("bb",this.fromdate)
  }

  calc_eligble(ind) {
    console.log("INDDD", ind)
    const detailframe = this.lodgingform.value.data[ind]
    if (detailframe.tourgid && detailframe.fromdate && detailframe.todate && detailframe.city) {
      this.detailsframe = {
        "accbybank": detailframe.accbybank,
        "tourgid": detailframe.tourgid,
        "fromdate": detailframe.fromdate,
        "todate": detailframe.todate,
        "city": detailframe.city,
        "totime":detailframe.totime,
        "fromtime":detailframe.fromtime,
        "lodgecheckouttime":detailframe.lodgcheckoutime,
        "expensegid": 5,
      }
    }
    else {
      return false;
    }
    this.detailsframe.fromdate = this.datePipe.transform(this.detailsframe.fromdate, 'yyyy-MM-dd');
    this.detailsframe.todate = this.datePipe.transform(this.detailsframe.todate, 'yyyy-MM-dd');
    
    this.SpinnerService.show()
    this.taservice.getlodgingeligibleAmount(this.detailsframe)
      .subscribe(result => {
        const myform = (this.lodgingform.get('data') as FormArray).at(ind)
        this.SpinnerService.hide()
        if (myform.value.accbybank == 1) {
          var elgamt = 0;
        }
        else {
          var elgamt = Number(result['Eligible_amount'])
        }

        var noofday = result['noofdays']
        // let lodgcheckoutdate=result['lodgcheckoutdate'

        this.maxdayslimit = noofday

        myform.patchValue({
          "eligibleamount": elgamt,
          "noofdays": noofday,
        })
      })
  }

  datechange(ind) {
    let myform = (this.lodgingform.get('data') as FormArray).at(ind)
    let dateform = (this.lodgingform.get('data') as FormArray).at(ind).value
    myform.patchValue({
      lodgcheckoutdate: dateform.todate,
      // lodgecheckouttime:dateform.totime
    })
    this.invaliddateend(ind);
  }

  invaliddatestart(ind) {
    var length = this.lodgingform.value.data.length
    let myform = (this.lodgingform.get('data') as FormArray).at(ind)
    myform.patchValue({
      todate: null
    })
    if (length > ind) {
      for (var i = ind + 1; i < length; i++) {
        let valuecheck = (this.lodgingform.get('data') as FormArray).at(i).value;
        let changeform = (this.lodgingform.get('data') as FormArray).at(i)
        if (valuecheck.fromdate != null || valuecheck.todate != null) {
          this.notification.showError('Invalid Dates In Table Row at ' + (i + 1))
          changeform.patchValue({
            "lodgcheckoutdate": null,
            "lodgecheckouttime":null,
            "fromdate": null,
            "todate": null,
            'eligibleamount': null,
            'noofday': null
          })
        }

      }
    }
  }
  invaliddateend(ind) {
    var length = this.lodgingform.value.data.length
    if (length > ind) {

      for (var i = ind + 1; i < length; i++) {
        let valuecheck = (this.lodgingform.get('data') as FormArray).at(i).value;
        let changeform = (this.lodgingform.get('data') as FormArray).at(i)
        if (valuecheck.fromdate != null || valuecheck.todate != null) {
          this.notification.showError('Invalid Dates in Table Row at ' + (i + 1))
          changeform.patchValue({
            "lodgcheckoutdate": null,
            "fromdate": null,
            "todate": null,
            'eligibleamount': null,
            'noofday': null
          })
        }
      }
    }
  }

  selectcheck(ind) {
    let myform = (this.lodgingform.get('data') as FormArray).at(ind).value
    return myform.fromdate;
  }
  select2check(ind) {
    let myform = (this.lodgingform.get('data') as FormArray).at(ind).value
    return myform.todate;
  }
  accbybankcheck(ind) {
    let accby = this.lodgingform.value.data.at(ind).accbybank;
    if (accby == '1') {
      return false;
    }
    else {
      return true;
    }
  }

  billcheck(ind) {
    let bill = this.lodgingform.value.data.at(ind).billavailable;
    if (bill == '1') {
      return true;
    }
    else {
      this.lodgingform.value.data.at(ind).billnumber = 0;
      return false;
    }
  }

  acfcheck(ind) {
    let acf = this.lodgingform.value.data.at(ind).accbybank;
    if (acf == '1') {
      return true;
    }
    else {
      this.lodgingform.value.data.at(ind).acrefno = 0;
      return false;
    }
  }

  fieldGlobalIndex(index) {
    let dat = this.pageSize * (this.p - 1) + index;
    return dat
  }
  hsnshow(subject) {
    return subject ? subject.code : undefined;
  }

  checkigst(ind) {
    let myform = (this.lodgingform.get('data') as FormArray).at(ind).value
    if (myform.igst != 0) {
      return true;
    }
    else {
      return false;
    }
  }
  checkscgst(ind) {
    let myform = (this.lodgingform.get('data') as FormArray).at(ind).value
    if (myform.cgst != 0 || myform.sgst != 0) {
      return true;
    }
    else {
      return false;
    }

  }

  minselect(ind) {
    this.maximum = this.enddate;
    if (ind == 0) {
      return this.startdate;
    }
    else if (this.lodgingform.value.data[ind - 1].todate != null) {
      return this.lodgingform.value.data[ind - 1].todate;
    }
    else {
      this.maximum
    }
  }

  maxselect(ind) {
    this.maximum = this.enddate;
    if (this.lodgingform.value.data[ind].fromdate == null) {

      return this.maximum;
    }
    else {
      return this.lodgingform.value.data[ind].fromdate
    }

  }
  entergst_check(ind) {
    let myform = (this.lodgingform.get('data') as FormArray).at(ind).value
    return myform.entergst;
  }
  entergst(event, ind) {
    let myform1 = (this.lodgingform.get('data') as FormArray).at(ind)
    myform1.patchValue({
      bankgstno: event.target.value
    })
  }
  newgst(ind) {
    let myform1 = (this.lodgingform.get('data') as FormArray).at(ind)
    myform1.patchValue({
      entergst: true
    })
  }

  gst_calc(ind) {
    let myform = (this.lodgingform.get('data') as FormArray).at(ind).value
    let myform1 = (this.lodgingform.get('data') as FormArray).at(ind)
    if (myform.bankgstno != myform.vendorgstno
      && myform.hsncode != '' && (myform.bankgstno != 0 && (myform.vendorgstno != '' || myform.vendorgstno != 0))) {
      var bnk_gst = myform.bankgstno.slice(0, 2);
      var lo_gst = myform.vendorgstno.slice(0, 2);
      var tax_amt = parseInt(myform.taxableamount);
      if (bnk_gst == lo_gst) {
        this.gstshow = true;
        var per = myform.hsncode.igstrate / 2;
        var amt = (tax_amt * per) / 100;
        myform1.patchValue({
          "cgst": amt,
          "sgst": amt,
          "igst": 0,
          "cgstp": per,
          "sgstp": per,
          "igstp": 0,
          "invoiceamount": amt + amt + tax_amt
        })
      }
      else {
        this.gstshow = true;
        myform1.patchValue({
          "igst": (myform.hsncode.igstrate * tax_amt) / 100,
          "cgst": 0,
          "sgst": 0,
          "igstp": myform.hsncode.igstrate,
          "cgstp": 0,
          "sgstp": 0,
          "invoiceamount": ((myform.hsncode.igstrate * tax_amt) / 100) + tax_amt
        })
      }
    }
    else if ((myform.bankgstno != 0 && myform.hsncode != '' && (myform.vendorgstno != '' || myform.vendorgstno != 0))) {
      this.notification.showInfo("Bank GST and Vendor GST are Same");
      myform1.patchValue({
        vendorgstno: ''
      })
    }
    else {
      var tax_amt = parseInt(myform.taxableamount);
      myform1.patchValue({
        "igst":0,
        "cgst": 0,
        "sgst": 0,
        "igstp": 0,
        "cgstp": 0,
        "sgstp": 0,
        "invoiceamount": tax_amt
      })
    }
    //   if (e.bankgstno != e.vendorgstno ){
    //     var bnk_gst = e.bankgstno.slice(0,2);
    //     var lo_gst = e.vendorgstno.slice(0,2);
    //     if( bnk_gst == lo_gst ){
    //         $scope.gst_show = true;
    //         var per = e.selectedhsn.hsn_igstrate/2;
    //         $scope.eClaim_lodg[i].cgst = per;
    //         $scope.eClaim_lodg[i].sgst = per;
    //         $scope.eClaim_lodg[i].scgst_show = true;
    //         $scope.eClaim_lodg[i].igst_show = false;
    //     }
    //     else{
    //         $scope.gst_show = true;
    //         $scope.eClaim_lodg[i].igst = e.selectedhsn.hsn_igstrate;
    //         $scope.eClaim_lodg[i].igst_show = true;
    //         $scope.eClaim_lodg[i].scgst_show = false;
    //     }
    // }
    // else{
    //     alert("Bank GST and Vendor GST are Same");
    //     e.vendorgstno = '';
    // }
  }


  createItem() {
    let group = this.formBuilder.group({
      id: 0,
      tourgid: this.expenceid,
      expensegid: 5,
      city: null,
      centreclassification: null,
      placeofactualstay: null,
      fromdate: null,
      fromtime:null,
      todate: null,
      totime:null,
      lodgcheckoutdate: null,
      lodgcheckouttime: null,
      noofdays: 0,
      accbybank: "0",
      acrefnoavailable: null,
      acrefno: 0,
      billavailable: null,
      billnumber: 0,
      totalbillamount: null,    
      claimedamount: null,
      eligibleamount: new FormControl('0'),
      taxonly: null,
      vendorname: '',
      vendorcode: '',
      hsncode: '',
      requestercomment: this.comm,
      bankgstno: this.bank_gst,
      invoiceamount: 0,
      taxableamount: 0,
      vendorgstno:new FormControl("",[Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")]),
      igst: 0,
      cgst: 0,
      sgst: 0,
      igstp: 0,
      cgstp: 0,
      sgstp: 0,
      address: '',
      entergst: false,
      approvedamount: 0,
      gstno:new FormControl("",[Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")]),
      invoicedate:null,
      invoiceno:null
    })

    return group;
  }
  numberOnly(event) {
    return (event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46)
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  citysearch(ind) {
    (this.lodgingform.get('data') as FormArray).at(ind).get('city').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.taservice.getcitylist(value, this.expname, this.employeegrade, 1))
      )
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.citylist = datas;
      });

  }

  hsnsearch(ind) {
    (this.lodgingform.get('data') as FormArray).at(ind).get('hsncode').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.taservice.gethsncode(value, 1))
      )
      .subscribe((results: any[]) => {
        this.hsnList = results['data']

      });

  }

  gstsearch(ind) {
    (this.lodgingform.get('data') as FormArray).at(ind).get('bankgstno').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.taservice.getgstcode(value, 1))
      )
      .subscribe((results: any[]) => {
        this.gstList = results['data']
      });

  }

  getcityValue() {
    this.taservice.getcitylist('', this.expname, this.employeegrade, 1)
      .subscribe(result => {
        this.citylist = result['data']
        console.log("Reason", this.citylist)
      })
  }
  getAcc(value, ind) {
    this.acc = value
    console.log("acc", this.acc)
    if (this.acc == "1") {
      // this.lodgingform.controls.data['controls'].at(ind).acrefno.enable();
      // console.log(this.lodgingform.controls['data'].value.at(ind).value)
    }
    else if (this.acc == "0") {
      // this.lodgingform.controls['data'].value.at(ind).acrefno.disable();
    }
  }
  getCenter() {
    this.taservice.getCenter()
      .subscribe(result => {
        this.centerlist = result
      })
  }
  amount_validate(event: any, ind){
    let myform = (this.lodgingform.get('data') as FormArray).at(ind).value
    let myform1 = (this.lodgingform.get('data') as FormArray).at(ind)
  
    if (myform.approvedamount > (myform.claimedamount + myform.taxonly)) {
      myform1.patchValue({
        approvedamount: null
      })
      this.notification.showError("Approved amount should not be greater than claimed amount.");
      return false;
  }
  return true; 
}
  ApproveForm() {
    this.applist = [];
    console.log("form-app", this.lodgingform.value)
    for (var i = 0; i < this.lodgingform.value.data.length; i++) {
      let json = {
        "id": this.lodgingform.value.data[i].id,
        "amount": this.lodgingform.value.data[i].approvedamount,
        "gst_no": this.lodgingform.value.data[i].vendorgstno,
        "vendor_name": this.lodgingform.value.data[i].vendorname,
        "invoice_no": this.lodgingform.value.data[i].invoiceno,
        "invoice_date": this.datePipe.transform(this.lodgingform.value.data[i].invoicedate, 'yyyy-MM-dd'),
        "vendor_code": this.lodgingform.value.data[i].vendorcode,
        "vendor_address": this.lodgingform.value.data[i].address,
        "hsn_code": this.lodgingform.value.data[i].hsncode.code,
        "taxable_amount": this.lodgingform.value.data[i].taxableamount,
        "Cgst": this.lodgingform.value.data[i].cgst,
        "Sgst": this.lodgingform.value.data[i].sgst,
        "Igst": this.lodgingform.value.data[i].igst,
        "invoice_amount": this.lodgingform.value.data[i].invoiceamount

      }
      this.applist.push(json)
    }
    for (var i = 0; i < this.applist.length; i++) {
      this.applist[i].amount = JSON.parse(this.applist[i].amount)

    }
    console.log("createdlist", this.applist)
    this.SpinnerService.show()
    this.taservice.approver_amountupdate(this.expenceid, 5, this.applist)
      .subscribe(res => {
        this.SpinnerService.hide()
        if (res.status === "success") {
          this.notification.showSuccess("Success....")
          this.onSubmit.emit();
          this.router.navigateByUrl('/ta/exapprove-edit')
          return true;
        } else {
          this.notification.showError(res.description)
          return false;
        }
      })
  }
  submitForm() {
    let submitForm = this.lodgingform.value.data;
    if(this.lodgingform.value.data[0].vendorgstno!=''){
      // if (this.lodgingform.value.data[0].vendorgstno == null || this.lodgingform.value.data[0].vendorgstno == '' || this.lodgingform.value.data[0].vendorgstno==undefined) {
      //   this.notification.showError('Please Enter Valid VENDOR GST No..')
      //   console.log('Please Enter Valid VENDOR GST No')
      //   throw new Error
      // }
      // let regex = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
      // if(regex.test(this.lodgingform.value.data[0].vendorgstno)==false){
      //   this.notification.showError('Invalid VENDOR GST No Format..');
      //   throw new Error
      // }
      if (this.validate_gst == false){
        this.notification.showError('Please validate VENDOR GST No');
        throw new Error
      }
    }

    console.log(submitForm)



    submitForm.forEach(currentValue => {
      Object.keys(currentValue).forEach(key => {
        if (key == 'city' && (currentValue[key] == null || currentValue[key] == '' || currentValue[key] == undefined)) {
          this.notification.showError('Please Select City');
          throw new Error('');
        }
       
        if (key == 'centreclassification' && (currentValue[key] == null || currentValue[key] == '' || currentValue[key] == undefined)) {
          this.notification.showError('Please Select Centre Classification');
          throw new Error('');
        }
        //placeofactualstay
        if (key == 'placeofactualstay' && (currentValue[key] == null || currentValue[key] == '' || currentValue[key] ==undefined)) {
          this.notification.showError('Please Enter Place of Actual Stay');
          throw new Error('');
        }

        //fromdate
        if (key == 'fromdate' && (currentValue[key] == null || currentValue[key] == '' || currentValue[key] ==undefined)) {
          this.notification.showError('Please Choose Checkin Date and Time');
          throw new Error('');
        }

        //todate
        if (key == 'todate' && (currentValue[key] == null || currentValue[key] == '' || currentValue[key] ==undefined)) {
          this.notification.showError('Please Choose Checkout Date and Time');
          throw new Error('');
        }
        //billavailable
        if (key == 'billavailable' && currentValue[key] == null) {
          this.notification.showError('Please Select  Bill Available ');
          throw new Error('');
        } else if (currentValue.billavailable === '1' && (key == 'billnumber' && currentValue[key] == '' || key == 'billnumber' && currentValue[key] == 0)) {
          console.log("VALUE OF BILL AVAILABLE", currentValue.billavailable)
          this.notification.showError('Please Enter  Bill Number');
          throw new Error('');
        } else if (key == 'totalbillamount' && (currentValue[key] == null || currentValue[key] == '')) {
          this.notification.showError('Please Enter Total Bill Amount');
          throw new Error('');
        }
        
      
    
        //claimedamount
        if (key == 'claimedamount' && (currentValue[key] == null || currentValue[key] == '')) {
          this.notification.showError('Please Enter Claimed Amount');
          throw new Error('');
        }
     
        //taxonly
        if (key == 'taxonly' && (currentValue[key] === null || currentValue[key] === '')) {
          this.notification.showError('Please Enter Tax Only');
          throw new Error('');
        }
        if (currentValue['invoiceamount'] < currentValue['claimedamount']) {
          this.notification.showError("Invoice Amount must be greater than or equal to claim amount")
          throw new Error
        }
        //  if (key == 'bankgstno' && currentValue[key] == null) {
        //      this.notification.showError('Please select the GSTNo');
        //      throw new Error('');
        //  }
        //  if (key == 'hsncode' && currentValue[key] == null) {
        //      this.notification.showError('Please select the HSN Code');
        //      throw new Error('');
        //  }
        //  if (key == 'vendorgstno' && currentValue[key] == null) {
        //      this.notification.showError('Please select the Lodge GSTNo');
        //      throw new Error('');
        //  }
        //  if (currentValue[key] == null && key != 'billnumber') {
        //   this.notification.showError('Please Select ' + key);
        //   throw new Error('');
        // }
        if (key == 'noofdays' && currentValue[key] > this.noofday) {
          this.notification.showError('No Of Days Should be less than No Of Tour Days');
          throw new Error('');
        }
        let startsdate = currentValue['fromdate']
        let endsdate = currentValue['todate']
        if (endsdate < startsdate) {
          this.notification.showError('Checkout Date and Time should be greater than Checkin Date and Time ');
          throw new Error('');
        }
         startsdate += currentValue['fromtime']
         endsdate += currentValue['totime']
        //Bug 8420 Fix ** Starts ** Developer: Hari ** Date:25/04/2023
        if(endsdate && startsdate && endsdate === startsdate)
        {
          this.notification.showError('Checkout Date and Time should not be same as Checkin Date and Time ');
          throw new Error('');
        }
        if (key == 'noofdays' && currentValue[key] == 0 || key == 'noofdays' && currentValue[key] == '') {
          this.notification.showError('Please Enter Valid No Of Days');
          throw new Error('');
        }
        if(this.shareservice.TA_Ap_Exp_Enb_type.value){
          if ((key=="gstno" && currentValue[key] == null) || (key=="gstno" && currentValue[key] == "") || (key=="gstno" && currentValue[key] == undefined)) {
            // this.notification.showError('Please Enter Valid GST No..')
            // throw new Error
          }
          else {
            if(key=="gstno"){
              let regex = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
            if(regex.test(currentValue[key])==false && key=="gstno"){
              this.notification.showError('Invalid GST No Format..');
              throw new Error
            }
            }
          }
          
          // if ((key=="invoicedate" && currentValue[key] == null) == null || (key=="invoicedate" && currentValue[key] == "") || (key=="invoicedate" && currentValue[key] == undefined)) {
          //   this.notification.showError('Please Select The Invoice Date..')
          //   throw new Error
          // }
          // if ((key=="invoiceno" && currentValue[key] == null) || (key=="invoiceno" && currentValue[key] == "") || (key=="invoiceno" && currentValue[key] == undefined)) {
          //   this.notification.showError('Please Enter The Valid Invoice No..')
          //   throw new Error
          // }
        }
        //Bug 8420 Fix ** Ends ** Developer: Hari ** Date:25/04/2023

      });
      // if(this.fromdate > this.todate){
      // }
      // else{
      //   return false
      // }
      console.log("hrr", this.fromdate)
      delete currentValue.entergst;
      currentValue.fromdate = this.datePipe.transform(currentValue.fromdate, 'yyyy-MM-dd');
      currentValue.todate = this.datePipe.transform(currentValue.todate, 'yyyy-MM-dd');
      currentValue.lodgcheckoutdate = this.datePipe.transform(currentValue.lodgcheckoutdate, 'yyyy-MM-dd');
      currentValue.invoicedate=this.datePipe.transform(currentValue.invoicedate,'yyyy-MM-dd');
      if (currentValue.hsncode) {
        currentValue.hsncode = currentValue.hsncode.code;
      }
      if (currentValue.id == 0) {
        delete currentValue.id;
      }

    });

    console.log("locexp1", submitForm)
    this.SpinnerService.show();
    let payload = {
      "data": submitForm
    };
    let ta_data_list:Array<any>=[];
    if(this.shareservice.TA_Ap_Exp_Enb_type.value){
      for(let data_ta of submitForm){
        let a:object={
          'id':data_ta['id'],
          'tourid':data_ta['tourgid'],
          'gstno':data_ta['gstno'],
          'expenseid':data_ta['expensegid'],
          'invoice_date':this.datePipe.transform(data_ta.invoicedate, 'yyyy-MM-dd'),
          'invoice_no':data_ta['invoiceno']
        }
        ta_data_list.push(a);
      }
      let ta_obj_be:any={"data":ta_data_list};
      console.log('apuser',ta_obj_be)
      this.SpinnerService.show();
    this.taservice.Submitapuser(ta_obj_be)
      .subscribe(res => {
        console.log("dailydeimres", res)
        this.SpinnerService.hide()
        if (res.message === "Successfully Created" && res.status === "success" || res.message === "Successfully Updated" && res.status === "success") {
          this.notification.showSuccess("Successfully Created")
          this.back();
          return true;
        }
        else {
          this.notification.showError(res.description)
          return false;
        }
      })
  
  
  
  
    }   
else{
    this.taservice.LodgingCreate(payload)
      .subscribe(res => {
        console.log("resss", res)
        if (res.message === "Successfully Created" && res.status === "success" || res.message === "Successfully Updated" && res.status === "success") {
          this.notification.showSuccess("Successfully Created")
          this.SpinnerService.hide();
          this.onSubmit.emit();
          this.router.navigateByUrl('ta/exedit')
          return true;
        }

        else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
          return false;

        }
      }
      )
    }
  }
  back() {

    if (this.applevel == 0) {
      if(this.shareservice.TA_Ap_Exp_Enb_type.value!=null && this.shareservice.TA_Ap_Exp_Enb_type.value!=false && this.shareservice.TA_Ap_Exp_Enb_type.value!="" && this.shareservice.TA_Ap_Exp_Enb_type.value!=undefined){
        this.expense_navigate_n.emit();
      }
      else{
        this.router.navigateByUrl('ta/exedit');
      }
      
    }
    else if (this.applevel == 1 && this.report) {
      this.router.navigateByUrl('ta/reporttourexpense')

    }
  
    else {
      this.router.navigateByUrl('ta/exapprove-edit')
    }


  }

  hsnList: any;
  gstList: any;
  getgstcode() {
    this.taservice.getgstcode('', 1)
      .subscribe(result => {
        this.gstList = result['data']
        console.log("gstList", this.gstList)
      })
  }
  gethsncode() {
    this.taservice.gethsncode('', 1)
      .subscribe(result => {
        this.hsnList = result['data']
        console.log("hsnlist", this.hsnList)
      })
  }
  gst: any;
  selectGst(e) {
    this.gst = e.value
    console.log("gs", this.gst)
  }


  autocompleteid() {
    setTimeout(() => {
      if (this.matassetidauto && this.autocompletetrigger && this.matassetidauto.panel) {
        fromEvent(this.matassetidauto.panel.nativeElement, 'scroll').pipe(
          map(x => this.matassetidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.matassetidauto.panel.nativeElement.scrollTop;
          const scrollHeight = this.matassetidauto.panel.nativeElement.scrollHeight;
          const elementHeight = this.matassetidauto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          console.log("CALLLLL", atBottom)
          if (atBottom) {

            if (this.has_nextid) {
              this.taservice.getcitylist(this.inputasset.nativeElement.value, this.expname, this.employeegrade, this.has_presentid + 1).subscribe(data => {
                let dts = data['data'];
                console.log('h--=', data);
                console.log("SS", dts)
                console.log("GGGgst", this.citylist)
                let pagination = data['pagination'];
                this.citylist = this.citylist.concat(dts);

                if (this.citylist.length > 0) {
                  this.has_nextid = pagination.has_next;
                  this.has_presentid = pagination.has_previous;
                  this.has_presentid = pagination.index;

                }
              })
            }
          }
        })
      }
    })


  }


  autocompletehsnid() {
    setTimeout(() => {
      if (this.hsnidauto && this.autocompletetrigger && this.hsnidauto.panel) {
        fromEvent(this.hsnidauto.panel.nativeElement, 'scroll').pipe(
          map(x => this.hsnidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.hsnidauto.panel.nativeElement.scrollTop;
          const scrollHeight = this.hsnidauto.panel.nativeElement.scrollHeight;
          const elementHeight = this.hsnidauto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          console.log("CALLLLL", atBottom)
          if (atBottom) {

            if (this.has_nexthsnid) {
              this.taservice.gethsncode(this.hsncodeset.nativeElement.value, this.has_presenthsnid + 1).subscribe(data => {
                let dts = data['data'];
                console.log('h--=', data);
                console.log("SS", dts)
                console.log("GGGgst", this.hsnList)
                let pagination = data['pagination'];
                this.hsnList = this.hsnList.concat(dts);

                if (this.hsnList.length > 0) {
                  this.has_nexthsnid = pagination.has_next;
                  this.has_presenthsnid = pagination.has_previous;
                  this.has_presenthsnid = pagination.index;

                }
              })
            }
          }
        })
      }
    })


  }
  kyenbdata(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }

  autocompletegstid() {
    setTimeout(() => {
      if (this.gstidauto && this.autocompletetrigger && this.gstidauto.panel) {
        fromEvent(this.gstidauto.panel.nativeElement, 'scroll').pipe(
          map(x => this.gstidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.gstidauto.panel.nativeElement.scrollTop;
          const scrollHeight = this.gstidauto.panel.nativeElement.scrollHeight;
          const elementHeight = this.gstidauto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          console.log("CALLLLL", atBottom)
          if (atBottom) {

            if (this.has_nextid) {
              this.taservice.getgstcode(this.gstcodeset.nativeElement.value, this.has_presentid + 1).subscribe(data => {
                let dts = data['data'];
                console.log('h--=', data);
                console.log("SS", dts)
                console.log("GGGgst", this.gstList)
                let pagination = data['pagination'];
                this.gstList = this.gstList.concat(dts);

                if (this.gstList.length > 0) {
                  this.has_nextgstid = pagination.has_next;
                  this.has_presentgstid = pagination.has_previous;
                  this.has_presentgstid = pagination.index;

                }
              })
            }
          }
        })
      }
    })


  }

  toDateNull(index) {
    let lodgingForm = this.lodgingform.value
    console.log("----", lodgingForm)
    this.lodgingform.get('data')['controls'][index].get('todate').setValue(null)


  }

  //Bug 8368 Fix ** Starts ** Developer: Hari ** Date:25/04/2023
  onKeyDown(event: KeyboardEvent) {
    if (event.key === '-') {
      event.preventDefault();
    }
  }
  //Bug 8368 Fix ** Ends ** Developer: Hari ** Date:25/04/2023

  timeclone: any;
  timelist = [];
  totimelist = [];
  createtime() {
    for (let j = 0; j < 24 * 60; j++) { // Loop for each minute in 24 hours
      let totalMinutes = j;
      let hour12 = Math.floor(totalMinutes / 60) % 12;
      let minute = totalMinutes % 60;
      let period = (totalMinutes < 720) ? 'AM' : 'PM'; // 720 minutes = 12 hours
  
      let formattedHour = String(hour12 === 0 ? 12 : hour12).padStart(2, '0');
      let formattedMinute = String(minute).padStart(2, '0');
  
      let time = { 'name': formattedHour + ':' + formattedMinute + ' ' + period };
      this.timelist.push(time);
    }
    this.timeclone = this.timelist;
    console.log("time", this.timeclone);
  }
  


  datechanges(ind) {
    ind = ((this.p - 1) * this.pageSize) + ind
    let myform = this.lodgingform.value.data[ind];
    let expform = (this.lodgingform.get('data') as FormArray).at(ind)
    if (myform.fromdate.getDate() == myform.todate.getDate()) {
      expform.patchValue({
        totime: null
      })
    }
    this.invaliddatestart(ind);
  }
  timefilter(evt) {
    let value = evt.target.value;
    this.timeclone = this.timelist.filter(function (element) {
      return element.name.includes(value)
    })
  }
  timedropdowncheck(time, ind) {
    ind = this.pagesize * (this.p - 1) + ind;
    let controlname = time.getAttribute('formControlName')
    let found = this.timelist.find(value => value.name == time.value)
    if (!found) {
      // this.notification.showError('Kindly Select Time from the given dropdown')
      this.lodgingform.get('data')['controls'].at(ind).get(controlname).setValue(time.value)
    }

  }
  totimechange(ind, totime) {
    ind = this.pagesize * (this.p - 1) + ind;
    let myform = this.lodgingform.value.data[ind]
    if (myform.fromdate && myform.todate) {
      if (myform.fromdate < myform.todate) {

      }
      else if (myform.fromdate >= myform.todate) {
        let index = this.timelist.findIndex((item) => item.name === myform.fromtime);
        let index2 = this.timelist.findIndex((item) => item.name === totime.value);
        if (!(index2 > index)) {
          // this.notification.showError('Kindly Select Time from the given dropdown')
          this.lodgingform.get('data')['controls'].at(ind).get('totime').setValue(totime.value)
        }
      }
    }


  }
  totimes(ind,totime) {
    ind = this.pageSize * (this.p - 1) + ind;
    this.totimelist = []
    let myform = this.lodgingform.value.data[ind]
    let time = myform.fromtime;
    let fromdate=this.datePipe.transform((myform.fromdate),'yyy-MM-dd');
    let todate=this.datePipe.transform((myform.todate),'yyyy-MM-dd');
    if (time && fromdate >= todate) {
      let index = this.timelist.findIndex((item) => item.name === time)
      let arr = this.timelist;
      var list = arr.slice(index + 1)
      list = list.filter(function (element) {
        return element.name.includes(totime.value)
      })
      return list;
    }
    else if (fromdate < todate) {
      var timelist = this.timelist
      return timelist.filter(function (element) {
        return element.name.includes(totime.value)
      })
    }
    else {
      return []
    }
  }
  
  numberOnlywithcolon(event: any) {
    return (event.charCode >= 48 && event.charCode <= 57) || event.key === ':';
  }
  onfocusinno(index:number){
    let myinvoice=this.lodgingform.get('data') as FormArray;
    let billno= myinvoice.at(index).get('billnumber').value;
    myinvoice.at(index).get('invoiceno').patchValue(billno);
  }
  onfocusgst(index:number){
    let mygst=this.lodgingform.get('data') as FormArray;
    let lodggst=mygst.at(index).get('vendorgstno').value;
    mygst.at(index).get('gstno').patchValue(lodggst)
  }
 onfocuscheckdate(index){
  let checkoutdate=this.lodgingform.get('data') as FormArray;
  let date=checkoutdate.at(index).get('totime').value;
  checkoutdate.at(index).get('lodgcheckouttime').patchValue(date)
 }
//  onfocustime(ind){
//   // let checkouttime=this.lodgingform.get('data') as FormArray
//   // let time= checkouttime.at(index).get('todate').value
//   // console.log("time for",time);
//   let dateform = (this.lodgingform.get('data') as FormArray).at(ind).value
//        console.log(dateform)
//  }
 
formatInput(event: any) {
  const inputElement = event.target;
  const inputValue = inputElement.value.replace(/\D/g, ''); // Remove non-numeric characters
  const cursorPosition = inputElement.selectionStart; // Get the cursor position
  if (inputValue.length > 2) {
    // Add colons after the first two digits
    const formattedValue = inputValue.slice(0, 2) + ':' + inputValue.slice(2);
    // Update the input value and move the cursor position
    inputElement.value = formattedValue;
    inputElement.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
  } else {
    inputElement.value = inputValue;
  }
}
gst_validate(ind) {
  ind = ((this.p-1)*this.pageSize)+ind
  let myform = (this.lodgingform.get('data') as FormArray).at(ind).value
  this.SpinnerService.show()
  this.taservice.gst_validate(myform.vendorgstno).subscribe(response => {
    this.SpinnerService.hide()
    let gst_details = response
    if (gst_details.validation_status == false) {
      let myform = (this.lodgingform.get('data') as FormArray).at(ind)
      myform.patchValue({vendorname: '', vendorcode: '', address: ''})
      this.notification.showError('Please Enter Valid GST No')
      return false;
    }
    this.validate_gst = true
    let vendor_name = gst_details.validation_status.tradeNam
    let vendor_code = gst_details.validation_status.ctjCd
    let vendor_address = gst_details.validation_status.pradr.addr.bno + ',' + gst_details.validation_status.pradr.addr.st + ',' + gst_details.validation_status.pradr.addr.loc + ',' + gst_details.validation_status.pradr.addr.stcd + ',' + gst_details.validation_status.pradr.addr.pncd
    let myform = (this.lodgingform.get('data') as FormArray).at(ind)
    myform.patchValue({vendorname: vendor_name, vendorcode: vendor_code, address: vendor_address})
  })
} 
  
  gst_change(){
    this.validate_gst = false;
  }
  geteligibleamount_datechanges(i){
    this.calc_eligble(i);
    this.datechanges(i);
    }

 }
