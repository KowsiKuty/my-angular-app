import { Component, OnInit, Output, EventEmitter,HostListener,ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { isBoolean } from 'util';
import { Observable, fromEvent } from 'rxjs';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NotificationService } from '../notification.service'
import { TaService } from "../ta.service";
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/service/shared.service';
import { ActivatedRoute, Router } from "@angular/router";
import { ShareService } from 'src/app/ta/share.service';
import { NgxSpinnerService } from "ngx-spinner";
import { map, takeUntil, startWith, debounceTime, distinctUntilChanged, tap, switchMap, finalize } from 'rxjs/operators';
import { G } from '@angular/cdk/keycodes';

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
  selector: 'app-incidental-expence',
  templateUrl: './incidental-expence.component.html',
  styleUrls: ['./incidental-expence.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class IncidentalExpenceComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.SpinnerService.hide();
    }
  }
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger;
  @ViewChild('hsncodeid') hsncodeset: any;
  @ViewChild('hsnid') hsnidauto: MatAutocomplete;
  @ViewChild('gstcodetid') gstcodeset: any;
  @ViewChild('gstid') gstidauto: MatAutocomplete;
  has_nextid: boolean = true;
  has_presentid: number = 1;
  has_nexthsnid: boolean = true;
  has_presenthsnid: number = 1;
  has_nextgstid: boolean = true;
  has_presentgstid: number = 1;
  gstList: any
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() expense_navigate_new=new EventEmitter<any>();
  incidental: any
  expenseid: any
  exptype: any
  comm: any
  comm1: any
  expID: any;
  incigeid: any
  tourno: any
  ModeOFList: any
  onwardList: any
  geteligibleamt: any
  tourdatas: any
  employeename: any
  employeegrade: any
  employeedesignation: any
  getelgamt: any
  single_fare: any
  gettravelmodes: any
  getreturnchange: any
  travelhours: any
  getlocalexpid: any
  onwardreturn: any
  getincidentaldata: any
  getsamedayreturn: any
  indexid: any
  getreturn: any
  currentpage: number = 1;
  pagesize:any= 10;
  p: any = 1;
  acc: any;
  event: any;
  incidentalform: FormGroup
  reason: any;
  onbehalf_empName: any;
  isonbehalf = false;
  isApprovedAmt = false;
  isApproveButton = false;
  isSumbitButton = true;
  addIncidentalButton = false
  isMakerAction = true;
  eligibleamount: any;
  is_modetrvl = false;
  is_onwdretn = false;
  is_travelhr = false;
  is_singlefare = false;
  tourid: any
  applevel: Number = 0;
  report: any;
  statuid: any;
  enb_all_exbdetails:boolean=false;
  is_same_day_return_selected: any;
  // applevel=0;
    ap:any;
  isLoading: boolean = false;
  hsnList: any[];
  tourreqno:any;
  bank_gst: Number = 0;
  validate_gst: boolean = false;
  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private http: HttpClient,
    private notification: NotificationService, private taservice: TaService, private SpinnerService: NgxSpinnerService,
    public sharedService: SharedService, private route: Router, private activatedroute: ActivatedRoute,
    private shareservice: ShareService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
   this.ap='ap_verify'
    let expensetype = JSON.parse(localStorage.getItem('expense_edit'));
    let expensedetails = JSON.parse(localStorage.getItem('expense_details'))?JSON.parse(localStorage.getItem('expense_details')):JSON.parse(localStorage.getItem('expense_edit'));
    this.statuid = expensedetails.claim_status_id
    this.report = expensedetails.report
    this.tourreqno=expensedetails.requestno
    if(this.shareservice.TA_Ap_Exp_Enb_type.value){
      this.enb_all_exbdetails=true;
      this.isSumbitButton=true;
      this.statuid=1;
    }
    else{
      this.enb_all_exbdetails=false;
    }

    let list: any = expensedetails
    let data_reqcom: any = expensetype
    if (expensedetails.onbehalfof) {
      this.isonbehalf = true;
      this.onbehalf_empName = '(' + expensedetails.employee_code + ') ' + expensedetails.employee_name
      console.log("onbehalf_empName", this.onbehalf_empName)
    } else {
      this.isonbehalf = false;
    }

    if (expensedetails.applevel == 2 || expensedetails.applevel == 1) {
      this.isonbehalf = false;
      this.tourid = expensedetails['tourid']
    }
   if (list.applevel) {
      this.applevel = list.applevel
    }
    // this.applevel = list.applevel;
    if (list.applevel == 2 || list.applevel == 1) {
      this.isApproveButton = true
      this.isApprovedAmt = true;
      this.isSumbitButton = false
      this.addIncidentalButton = true
      this.isMakerAction = false
      this.is_modetrvl = true;
      this.is_onwdretn = true;
      this.is_travelhr = true;
      this.is_singlefare = true;
      this.isonbehalf = false;


      this.employeename = '(' + list.employee_code + ') ' + list.employee_name
      this.employeegrade = list.empgrade
      this.employeedesignation = list.empdesignation
      this.comm1 = data_reqcom.requestercomment;
      // this.exptype=expensetype.expenseid
      this.tourid = list.tourid
      this.expenseid = this.tourid

      this.SpinnerService.show()
      this.taservice.getincidentaleditSummary(this.tourid, this.report).subscribe(res => {
        this.SpinnerService.hide()
        let incidentallist = res['data'];
        this.bank_gst = res['branch_gst']
        console.log("incidental list", incidentallist)
        var length = incidentallist.length;
        for (var i = 0; i < length; i++) {
          if (i > 0) {
            this.addSet();
          }
          incidentallist[i].travel_mode = String(incidentallist[i].travel_mode.value)
          incidentallist[i].same_day_return = String(incidentallist[i].same_day_return.value)
          incidentallist[i].amount = String(incidentallist[i].approvedamount);
          incidentallist[i].invoiceno = incidentallist[i].invoice_no?incidentallist[i].invoice_no:'';
          incidentallist[i].invoicedate=incidentallist[i].invoice_date?this.datePipe.transform(incidentallist[i].invoice_date,'yyyy-MM-dd'):'';
          incidentallist[i].bankgstno=res['branch_gst']?res['branch_gst']:"";
        }
        if (incidentallist.length != 0) {
          this.incidentalform.patchValue({
            data: incidentallist
          })
        }
      }, error => this.SpinnerService.hide())
    } else {
      this.employeename = '(' + expensedetails.employee_code + ') ' + expensedetails.employee_name
      this.employeegrade = expensedetails.empgrade?expensedetails.empgrade: expensedetails.emp_grade;
      this.employeedesignation = expensedetails.empdesignation?expensedetails.empdesignation:expensedetails.designation;
      this.comm1 = expensetype.requestercomment;
      this.exptype = expensetype.expenseid
      this.expenseid = expensedetails.tourid?expensedetails.tourid:expensedetails.id;
      this.reason = expensedetails.reason_id;
      this.SpinnerService.show()
      this.taservice.getincidentaleditSummary(this.expenseid, this.report).subscribe(res => {
        this.SpinnerService.hide()
        let incidentallist = res['data'];
        this.bank_gst = res['branch_gst']
        console.log("incidental list", incidentallist)
        var length = incidentallist.length;
        for (var i = 0; i < length; i++) {
          if (i > 0) {
            this.addSet();
          }
          incidentallist[i].travel_mode = String(incidentallist[i].travel_mode.value)
          incidentallist[i].same_day_return = String(incidentallist[i].same_day_return.value)
          incidentallist[i].amount = Number(incidentallist[i].approvedamount);
          incidentallist[i].invoiceno = incidentallist[i].invoice_no?incidentallist[i].invoice_no:'';
          incidentallist[i].invoicedate=incidentallist[i].invoice_date?this.datePipe.transform(incidentallist[i].invoice_date,'yyyy-MM-dd'):'';
          incidentallist[i].bankgstno=res['branch_gst']?res['branch_gst']:"";
          // incidentallist[i].address=incidentallist[i]['address']?incidentallist[i]['address']:"";
          // incidentallist[i].taxableamount=incidentallist[i]['taxable_amount']?incidentallist[i]['taxable_amount']:"";
          // incidentallist[i].cgst=incidentallist[i]['cgst']?incidentallist[i]['cgst']:"";
          // incidentallist[i].sgst=incidentallist[i]['sgst']?incidentallist[i]['sgst']:"";
          // incidentallist[i].igst=incidentallist[i]['igst']?incidentallist[i]['igst']:"";
          // incidentallist[i].invoiceamount=incidentallist[i]['invoice_amount']?incidentallist[i]['invoice_amount']:"";
        }
        if (incidentallist.length != 0) {
          this.incidentalform.patchValue({
            data: incidentallist
          })
        }
        else {
          let myform = (this.incidentalform.get('data') as FormArray).at(0)
          myform.patchValue({bankgstno: res['branch_gst']})
          }
      }, error => this.SpinnerService.hide())
    }
    if (list.applevel == 1) {
      this.isApproveButton = false;
      this.isApprovedAmt = false;
      this.isSumbitButton = false
      this.addIncidentalButton = true;
      this.isMakerAction = false
      this.is_modetrvl = true;
      this.is_onwdretn = true;
      this.is_travelhr = true;
      this.is_singlefare = true;
      this.isonbehalf = false;
    }

    this.incidentalform = this.formBuilder.group({
      data: new FormArray([
        this.createItem(),

      ]),
      // data: new FormArray([]),
    });

    this.gettravelmode()
    this.getonwardreturn()
    this.gethsncode();

  }
  //   onKeypressEvent(value){

  //     console.log(value);
  //     if(this.acc=="YES"){
  //       if(value<24){

  //       }
  //       else{
  //         value=""
  //       }
  //      }


  //  }
  //   getAcc(value){
  //     this.acc = value
  //     console.log("acc",this.acc)
  //   }

  gettravelmode() {
    this.taservice.getincidentaltravelmode()
      .subscribe(res => {
        this.ModeOFList = res;
        this.ModeOFList.forEach(element => {
          element.name = element.name.toUpperCase()
        });
      })

  }

  getonwardreturn() {
    this.taservice.getyesno()
      .subscribe(res => {
        this.onwardList = res
        console.log("onwlist", this.onwardList)

      })
  }
  getValue: any;
  onwardReturnChange(e) {
    this.getValue = e
    console.log("getValue", this.getValue)
  }

  keyPressAmounts(event) {
    var inp = String.fromCharCode(event.keyCode);

    if (/[0-9.]/.test(inp) || event.keyCode == 32) {
      return true;
    }
    else {
      event.preventDefault();
      return false;

    }
  }
  pageSize = 10;
  presentpage = 1;
  fieldGlobalIndex(index) {
    let dat = this.pageSize * (this.presentpage - 1) + index;
    return dat
  }

  detailsframe: any;
  modeoftravelchange(ind) {
    console.log("INDDD", ind)
    const detailframe = this.incidentalform.value.data[ind]
    if (detailframe.travel_mode && detailframe.same_day_return && detailframe.travel_hours && detailframe.single_fare) {
      this.detailsframe = {
        expense_id: 3,
        travel_mode: detailframe.travel_mode,
        same_day_return: detailframe.same_day_return,
        travel_hours: detailframe.travel_hours,
        single_fare: detailframe.single_fare
      }
    }
    else {
      return false;
    }

    this.SpinnerService.show()
    this.taservice.Incidentaleligibleamt(this.detailsframe)
      .subscribe(result => {
        console.log("res", result)
        const myform = (this.incidentalform.get('data') as FormArray).at(ind)
        console.log("new", myform)
        this.SpinnerService.hide()
        // if (myform.value.accbybank == 1){
        //   var elgamt = 0;
        // }
        // else{
        //   var elgamt = Number(result['Eligible_amount'])
        // }

        // var noofday = result['noofdays']
        // this.maxdayslimit = noofday
        myform.patchValue({
          "eligibleamount": result.elgibleamount,

        })
      })
  }


  onwardreturnchange(ind) {

    if (this.incidentalform.value.data[ind].same_day_return == '1') {
      if (this.incidentalform.value.data[ind].travel_hours > 24) {
        const myform = (this.incidentalform.get('data') as FormArray).at(ind)
        myform.patchValue({
          "travel_hours": null
        })
      }

    }

    console.log("INDDD", ind)
    const detailframe = this.incidentalform.value.data[ind]
    if (detailframe.travel_mode && detailframe.same_day_return && detailframe.travel_hours && detailframe.single_fare) {
      this.detailsframe = {
        expense_id: 3,
        travel_mode: detailframe.travel_mode,
        same_day_return: detailframe.same_day_return,
        travel_hours: detailframe.travel_hours,
        single_fare: detailframe.single_fare
      }
    }
    else {
      return false;
    }

    this.SpinnerService.show()
    this.taservice.Incidentaleligibleamt(this.detailsframe)
      .subscribe(result => {
        console.log("res", result)
        const myform = (this.incidentalform.get('data') as FormArray).at(ind)
        this.SpinnerService.hide()
        // if (myform.value.accbybank == 1){
        //   var elgamt = 0;
        // }
        // else{
        //   var elgamt = Number(result['Eligible_amount'])
        // }

        // var noofday = result['noofdays']
        // this.maxdayslimit = noofday
        myform.patchValue({
          "eligibleamount": result.elgibleamount,

        })
      })



  }


  traveltimechange(ind) {
    console.log("INDDD", ind)
    const detailframe = this.incidentalform.value.data[ind]
    if (detailframe.travel_mode && detailframe.same_day_return && detailframe.travel_hours && detailframe.single_fare) {
      this.detailsframe = {
        expense_id: 3,
        travel_mode: detailframe.travel_mode,
        same_day_return: detailframe.same_day_return,
        travel_hours: detailframe.travel_hours,
        single_fare: detailframe.single_fare
      }
    }
    else {
      return false;
    }

    this.SpinnerService.show()
    this.taservice.Incidentaleligibleamt(this.detailsframe)
      .subscribe(result => {
        console.log("res", result)
        const myform = (this.incidentalform.get('data') as FormArray).at(ind)
        this.SpinnerService.hide()
        // if (myform.value.accbybank == 1){
        //   var elgamt = 0;
        // }
        // else{
        //   var elgamt = Number(result['Eligible_amount'])
        // }

        // var noofday = result['noofdays']
        // this.maxdayslimit = noofday
        myform.patchValue({
          "eligibleamount": result.elgibleamount,

        })
      })
  }



  singlefarechange(ind) {
    console.log("INDDD", ind)
    const detailframe = this.incidentalform.value.data[ind]
    if (detailframe.travel_mode && detailframe.same_day_return && detailframe.travel_hours && detailframe.single_fare) {
      this.detailsframe = {
        expense_id: 3,
        travel_mode: detailframe.travel_mode,
        same_day_return: detailframe.same_day_return,
        travel_hours: detailframe.travel_hours,
        single_fare: detailframe.single_fare
      }
    }
    else {
      return false;
    }

    this.SpinnerService.show()
    this.taservice.Incidentaleligibleamt(this.detailsframe)
      .subscribe(result => {
        console.log("res", result)
        const myform = (this.incidentalform.get('data') as FormArray).at(ind)
        this.SpinnerService.hide()
        // if (myform.value.accbybank == 1){
        //   var elgamt = 0;
        // }
        // else{
        //   var elgamt = Number(result['Eligible_amount'])
        // }

        // var noofday = result['noofdays']
        // this.maxdayslimit = noofday
        myform.patchValue({
          "eligibleamount": result.elgibleamount,

        })
      })
  }

  applist = [];
  incidentalApproveButton() {
    this.applist = [];
    console.log("form-app", this.incidentalform.value)
    for (var i = 0; i < this.incidentalform.value.data.length; i++) {
      // this.incidentalform.value.data[i].same_day_return = JSON.parse(this.incidentalform.value.data[i].same_day_return)
      // this.incidentalform.value.data[i].travel_hours = JSON.parse( this.incidentalform.value.data[i].travel_hours)
      // this.incidentalform.value.data[i].single_fare = JSON.parse( this.incidentalform.value.data[i].single_fare)
      // if (this.incidentalform.value.data[i].id == 0){
      //   delete this.incidentalform.value.data[i].id;
      // }
      let json = {
        "id": this.incidentalform.value.data[i].id,
        "amount": this.incidentalform.value.data[i].amount,
        "gst_no": this.incidentalform.value.data[i].vendorgstno,
        "vendor_name": this.incidentalform.value.data[i].vendorname,
        "invoice_no": this.incidentalform.value.data[i].invoiceno,
        "invoice_date": this.datePipe.transform(this.incidentalform.value.data[i].invoicedate, 'yyyy-MM-dd'),
        "vendor_code": this.incidentalform.value.data[i].vendorcode,
        "vendor_address": this.incidentalform.value.data[i].address,
        "hsn_code": this.incidentalform.value.data[i].hsncode.code,
        "taxable_amount": this.incidentalform.value.data[i].taxableamount,
        "Cgst": this.incidentalform.value.data[i].cgst,
        "Sgst": this.incidentalform.value.data[i].sgst,
        "Igst": this.incidentalform.value.data[i].igst,
        "invoice_amount": this.incidentalform.value.data[i].invoiceamount

      }
      this.applist.push(json)
    }
    for (var i = 0; i < this.applist.length; i++) {
      this.applist[i].amount = JSON.parse(this.applist[i].amount)

    }
    console.log("createdlist", this.applist)
    this.SpinnerService.show()
    this.taservice.approver_Incidental(this.applist, this.expenseid)
      .subscribe(res => {
        this.SpinnerService.hide()
        console.log("incires", res)
        if (res.status === "success") {
          this.notification.showSuccess("Success....")
          this.onSubmit.emit();
          this.router.navigateByUrl('ta/exapprove-edit')
          return true;
        } else {
          this.notification.showError(res.description)
          return false;
        }
      })

  }

  createItem() {
    let group = this.formBuilder.group({
      expenseid: 3,
      requestercomment: this.comm1,
      tourid: this.expenseid,
      same_day_return: '',
      single_fare: '',
      travel_hours: '',
      travel_mode: '',
      id: '',
      amount: '',
      eligibleamount: new FormControl({ value: 0, disabled: true }),
      hsncode: '',
      vendorname: '',
      vendorcode: '',
      bankgstno: this.bank_gst,
      taxableamount: 0,
      invoiceamount: 0,
      vendorgstno: new FormControl("",[Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")]),
      igst: 0,
      cgst: 0,
      sgst: 0,
      igstp: 0,
      cgstp: 0,
      sgstp: 0,
      address: '',
      gstno:new FormControl("",[Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")]),
      invoicedate:null,
      invoiceno:null
    });

    return group;
  }

  addSet() {
    const data = this.incidentalform.get('data') as FormArray;
    data.push(this.createItem());
  }

  // deleteArray(index: number) {
  //   (<FormArray>this.incidentalform.get('data')).removeAt(index);
  // }
  removeSection(i) {
    if (this.incidentalform.value.data[i].id == undefined || this.incidentalform.value.data[i].id == null || this.incidentalform.value.data[i].id ==''){
      let ind = this.pageSize * (this.p - 1) + i;
      const control = <FormArray>this.incidentalform.controls['data'];
      control.removeAt(ind)
    }
    else {
      this.SpinnerService.show()
      this.taservice.deleteincidental(this.incidentalform.value.data[i].id)
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
            const control = <FormArray>this.incidentalform.controls['data'];
            control.removeAt(ind)
            console.log("res", res)
            this.onSubmit.emit();
            return true
          }
        }
        )
        this.ngOnInit()

    // this.dailydiem.data.splice(i, 1);
    }
    // console.log("bb",this.fromdate)
  }

  submitForm() {
    console.log("incidental form", this.incidentalform.value)
    for (var i = 0; i < this.incidentalform.value.data.length; i++) {

      
      // delete  this.incidentalform.value.data[i].amount
      if(this.incidentalform.value.data[i]?.vendorgstno!=''){
        // if (this.incidentalform.value.data[i].vendorgstno == null || this.incidentalform.value.data[i].vendorgstno == '' || this.incidentalform.value.data[i].vendorgstno == undefined) {
        //   this.notification.showError('Please Enter Valid VENDOR GST No..')
        //   console.log('Please Enter Valid VENDOR GST No')
        //   throw new Error
        // }
        // let regex = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
        // if(regex.test(this.incidentalform.value.data[i].vendorgstno)==false){
        //   this.notification.showError('Invalid VENDOR GST No Format..');
        //   throw new Error
        // }
        if (this.validate_gst == false){
          this.notification.showError('Please validate VENDOR GST No');
          throw new Error
        }
      }

      if (this.number_test(this.incidentalform.value.data[i].travel_hours) != 0) {
        this.notification.showError('Please Enter No of Hours in Numbers not Decimals')
        throw new Error

      }

      if(this.incidentalform.value.data[i].travel_mode == '' || this.incidentalform.value.data[i].travel_mode == null)
      {
        this.notification.showError('Please Select Mode of Travel')
        throw new Error
      }
      //same_day_return
      if(this.incidentalform.value.data[i].same_day_return == '' || this.incidentalform.value.data[i].same_day_return == null)
      {
        this.notification.showError('Please Select Onward and Return Journey on Same Day')
        throw new Error
      }
      if(this.incidentalform.value.data[i].same_day_return == 0 && this.incidentalform.value.data[i].travel_hours < 24)
      {
        this.notification.showError('Travel Time in Hours should be greater than 24')
        throw new Error
      }
      //travel_hours
      if(this.incidentalform.value.data[i].travel_hours == '' || this.incidentalform.value.data[i].travel_hours == null)
      {
        this.notification.showError('Please Enter Travel Time in Hours')
        throw new Error
      }

      if (this.incidentalform.value.data[i].single_fare <= 0) {
        this.notification.showError('Please Enter Valid Single Fare Amount');
        throw new Error
      }
      if (this.incidentalform.value.data[i].invoiceamount < this.incidentalform.value.data[i].single_fare) {
        this.notification.showError("Invoice Amount must be greater than or equal to claim amount")
        throw new Error
      }
      if (this.incidentalform.value.data[i].hsncode){
        this.incidentalform.value.data[i].hsncode = this.incidentalform.value.data[i].hsncode.code
      }
            // if(this.incidentalform.value.data[i].gstno == null || this.incidentalform.value.data[i].gstno == '' || this.incidentalform.value.data[i].gstno == undefined ){
      //   this.notification.showError('please select the Gst no');
      //   throw new Error
      // }
     // let regex = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
      //  if(regex.test(this.incidentalform.value.data[i].gstno)==false){
       //   this.notification.showError('Invalid GST No Format..');
       //   throw new Error
        
    //  if(this.incidentalform.value.data[i].invoiceno == null || this.incidentalform.value.data[i].invoiceno == '' || this.incidentalform.value.data[i].invoiceno == undefined){
      //  this.notification.showError(' please select the Invoice Number');
     //   throw new Error;
      
    //  if(this.incidentalform.value.data[i].invoicedate == null || this.incidentalform.value.data[i].invoicedate == '' || this.incidentalform.value.data[i].invoicedate == undefined){
    //    this.notification.showError(' please select the Invoice Date');
     //   throw new Error;
      


      if(this.shareservice.TA_Ap_Exp_Enb_type.value){
         if (this.incidentalform.value.data[i].gstno == null || this.incidentalform.value.data[i].gstno == '' || this.incidentalform.value.data[i].gstno==undefined) {
          // this.notification.showError('Please Enter Valid GST No..')
          //  throw new Error
        }
        else {
          let regex = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
          if(regex.test(this.incidentalform.value.data[i].gstno)==false){
            this.notification.showError('Invalid GST No Format..');
            throw new Error
          }
        }
        // if (this.incidentalform.value.data[i].invoicedate == null || this.incidentalform.value.data[i].invoicedate == '' || this.incidentalform.value.data[i].invoicedate==undefined) {
        //   this.notification.showError('Please Select The Invoice Date..')
        //   throw new Error
        // }
        // if (this.incidentalform.value.data[i].invoiceno == null || this.incidentalform.value.data[i].invoiceno == '' || this.incidentalform.value.data[i].invoiceno==undefined) {
        //   this.notification.showError('Please Enter The Valid Invoice No..')
        //    throw new Error
        //  }
      }

      this.incidentalform.value.data[i].invoicedate=this.datePipe.transform(this.incidentalform.value.data[i].invoicedate,'yyyy-MM-dd');
      this.incidentalform.value.data[i].same_day_return = JSON.parse(this.incidentalform.value.data[i].same_day_return)
      this.incidentalform.value.data[i].travel_hours = JSON.parse(this.incidentalform.value.data[i].travel_hours)
      this.incidentalform.value.data[i].single_fare = JSON.parse(this.incidentalform.value.data[i].single_fare)
      if (this.incidentalform.value.data[i].id == 0) {
        delete this.incidentalform.value.data[i].id;
      }
    }
    let ta_data_list:Array<any>=[];
    if(this.shareservice.TA_Ap_Exp_Enb_type.value){
      for(let data_ta of this.incidentalform.value.data){
        let a:object={
          'id':data_ta['id'],
          'tourid':data_ta['tourid'],
          'gstno':data_ta['gstno'],
          'expenseid':data_ta['expenseid'],
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

  
    this.SpinnerService.show()
    this.taservice.IncidentalCreate(this.incidentalform.value)
      .subscribe(res => {
        this.SpinnerService.hide()
        if (res.status === "success") {
          this.notification.showSuccess("Successfully Created")
          this.onSubmit.emit();
          this.router.navigateByUrl('ta/exedit')
          return true;
        } else {
          this.notification.showError(res.description)
          return false;
        }
      }, (error) => {
        this.SpinnerService.hide();
      })
    }
  }
  
    // back() {
  //   if (this.applevel==1) {
  //       this.router.navigateByUrl('ta/exapprove-edit');
  //   }
  //   else if (this.applevel == 1 && this.report) {
  //     this.router.navigateByUrl('ta/report')

  //   }
  //   else {
  //     if(this.shareservice.TA_Ap_Exp_Enb_type.value!=null && this.shareservice.TA_Ap_Exp_Enb_type.value!=false && this.shareservice.TA_Ap_Exp_Enb_type.value!="" && this.shareservice.TA_Ap_Exp_Enb_type.value!=undefined){
  //       this.expense_navigate_new.emit();
  //     }
  //     else{
  //     this.router.navigateByUrl('ta/exedit');
  //     }
  //   }


  // }
  back() {
    if(this.applevel == 0){
      if(this.shareservice.TA_Ap_Exp_Enb_type.value!=null && this.shareservice.TA_Ap_Exp_Enb_type.value!=false && this.shareservice.TA_Ap_Exp_Enb_type.value!="" && this.shareservice.TA_Ap_Exp_Enb_type.value!=undefined){
        this.expense_navigate_new.emit();
      }
      else{
        this.router.navigateByUrl('ta/exedit');
      }
      
    }
    else if(this.applevel==1 && this.report){
      this.router.navigateByUrl('ta/reporttourexpense')

    }
    else{
      this.router.navigateByUrl('ta/exapprove-edit')
    }

  }





  limit(e, i) {
    // let ind = this.pageSize * (this.presentpage - 1) + i;
    let val = e.target.value
    if (this.incidentalform.value.data[i].same_day_return == '1') {
      if (Number(val) > 24) {
        e.target.value = ''
        this.notification.showError('If you are return on the same day you cannot enter time more then 24')
      }
    }
    

  }

  number_test(n) {
    var result = (n - Math.floor(n)) !== 0;

    if (result)
      return 'Please enter No of Hours in Number not Decimal';
    else
      return 0
    // return 'It is a whole number.';
  }
  kyenbdata(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }
  updateTravelHoursValidators() {
    this.is_same_day_return_selected = this.incidentalform.get('same_day_return');
    const travelHoursControl = this.incidentalform.get('travel_hours');
    if (this.incidentalform.value.same_day_return === 1) {
      travelHoursControl.setValidators([Validators.required, Validators.max(24)]);
    } else {
      travelHoursControl.setValidators([Validators.required]);
    }
    travelHoursControl.updateValueAndValidity();
  }

  // setMaxTravelHours(sameDayReturn: number): void {
  //   const travelHoursInput = document.querySelector('input[formControlName="travel_hours"]') as HTMLInputElement;
  //   if (sameDayReturn === 0) {
  //     travelHoursInput.min = '24';
  //   } else {
  //     travelHoursInput.min = null;
  //   }
  // }

  //Bug 8368 Fix ** Starts ** Developer: Hari ** Date:25/04/2023
  onKeyDown(event: KeyboardEvent) {
    if (event.key === '-') {
      event.preventDefault();
    }
  }
  //Bug 8368 Fix ** Ends ** Developer: Hari ** Date:25/04/2023
  omit_special_char(event) {
    var k;
    this.validate_gst = false
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  gst_calc(ind) {
    let myform = (this.incidentalform.get('data') as FormArray).at(ind).value
    let myform1 = (this.incidentalform.get('data') as FormArray).at(ind)
    if (myform.bankgstno != myform.vendorgstno
      && myform.hsncode != '' && (myform.bankgstno != 0 && (myform.vendorgstno != '' || myform.vendorgstno != 0))) {
      var bnk_gst = myform.bankgstno.slice(0, 2);
      var lo_gst = myform.vendorgstno.slice(0, 2);
      var tax_amt = parseInt(myform.taxableamount);
      if (bnk_gst == lo_gst) {
        // this.gstshow = true;
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
        // this.gstshow = true;
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
        "igst": 0,
        "cgst": 0,
        "sgst": 0,
        "igstp": 0,
        "cgstp": 0,
        "sgstp": 0,
        "invoiceamount": tax_amt
    })
    }
  }
  hsnsearch(ind) {
    (this.incidentalform.get('data') as FormArray).at(ind).get('hsncode').valueChanges
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
  gethsncode() {
    this.taservice.gethsncode('', 1)
      .subscribe(result => {
        this.hsnList = result['data']
        console.log("hsnlist", this.hsnList)
      })
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
  hsnshow(subject) {
    return subject ? subject.code : undefined;
  }
  gst_validate(ind) {
    ind = ((this.currentpage-1)*this.pageSize)+ind
    let myform = (this.incidentalform.get('data') as FormArray).at(ind).value
    this.SpinnerService.show()
    this.taservice.gst_validate(myform.vendorgstno).subscribe(response => {
      this.SpinnerService.hide()
      let gst_details = response
      if (gst_details.validation_status == false) {
        let myform = (this.incidentalform.get('data') as FormArray).at(ind)
        myform.patchValue({vendorname: '', vendorcode: '', address: ''})
        this.notification.showError('Please Enter Valid GST No')
        return false;
      }
      this.validate_gst = true
      let vendor_name = gst_details.validation_status.tradeNam
      let vendor_code = gst_details.validation_status.ctjCd
      let vendor_address = gst_details.validation_status.pradr.addr.bno + ',' + gst_details.validation_status.pradr.addr.st + ',' + gst_details.validation_status.pradr.addr.loc + ',' + gst_details.validation_status.pradr.addr.stcd + ',' + gst_details.validation_status.pradr.addr.pncd
      let myform = (this.incidentalform.get('data') as FormArray).at(ind)
      myform.patchValue({vendorname: vendor_name, vendorcode: vendor_code, address: vendor_address})
    })
  } 
  
  


}
