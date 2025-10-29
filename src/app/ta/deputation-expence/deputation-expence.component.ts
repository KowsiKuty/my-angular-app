import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../notification.service'
import { TaService } from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import { ActivatedRoute, Router } from "@angular/router";
import { ShareService } from 'src/app/ta/share.service';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';


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
  selector: 'app-deputation-expence',
  templateUrl: './deputation-expence.component.html',
  styleUrls: ['./deputation-expence.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class DeputationExpenceComponent implements OnInit {

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  deputationexpence: FormGroup
  deputation: any
  expenseid: any
  citylist: Array<any>
  exptype: any
  comm: any
  tourno: any
  startdate: any;
  city: void;
  enddate: any;
  leave1: BigInteger;
  days: number;
  eligibleamount: any;
  detailsframe: any;
  noofday: any;
  tourdatas: string;
  employeename: any;
  employeegrade: any;
  currentpage: number = 1;
  pagesize = 10;
  employeedesignation: any;
  id: any;
  claimid: any;
  expenceid: string;
  approveamount: any;
  datecopy: any;
  date: any;
  Dailydiemfromdate: Date;
  DailydiemTodate: Date;

  expense_edit: any;
  expense_details: any;

  deputationform: FormGroup
  maker: any;
  isonbehalf: boolean = false
  makerboolean: boolean = false
  onbehalf_empName: any;
  tournumb: any;
  pageSize: any = 10;
  p: any = 1;
  expname: string;
  requestercomment: any;
  has_nextid: boolean = true;
  has_presentid: number = 1;
  has_nexthsnid: boolean = true;
  has_presenthsnid: number = 1;
  has_nextgstid: boolean = true;
  has_presentgstid: number = 1;

  maximum: any;
  minimum: any;

  centerarray: any = []
  submitarray: any = []
  expenseedit: any = []
  approverarray: any = []

  approver: boolean = false;
  reject: boolean = false;
  view: boolean = false;
  onbehalf: boolean = false;
  maker1: boolean = false;
  applevel: any = 0;
  statusid: any;
  requestno:any;


  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger
  @ViewChild('inputassetid') inputasset: any;
  @ViewChild('assetid') matassetidauto: MatAutocomplete;
  report: any;


  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private http: HttpClient,
    private notification: NotificationService, private taservice: TaService,
    public sharedService: SharedService, private route: Router, private activatedroute: ActivatedRoute,
    private shareservice: ShareService, private router: Router, private spinnerservice: NgxSpinnerService) { }
  ngOnInit(): void {
    let expensetype = this.shareservice.dropdownvalue.value;
    this.expense_edit = JSON.parse(localStorage.getItem('expense_edit'));
    this.expense_details = JSON.parse(localStorage.getItem('expense_details'));
    this.report = this.expense_details.report
    this.requestno = this.expense_details['requestno']
    this.maker = this.expense_details['applevel']
    this.maximum = this.datePipe.transform(this.expense_details['enddate'], 'yyyy-MM-dd')
    this.minimum = this.datePipe.transform(this.expense_details['startdate'], 'yyyy-MM-dd')
    this.requestercomment = this.expense_edit['requestercomment']

    this.statusid = this.expense_details.claim_status_id;


    if (this.expense_details.applevel) {
      this.applevel = this.expense_details.applevel
    }

    this.tournumb = this.expense_details.id
    if (this.expense_details.onbehalfof) {
      this.isonbehalf = true;
      this.onbehalf_empName = '(' + this.expense_details.employee_code + ') ' + this.expense_details.employee_name
      console.log("onbehalf_empName", this.onbehalf_empName)
    } else {
      this.isonbehalf = false;
    }
    if (this.expense_details.applevel == 2 || this.expense_details.applevel == 1) {
      this.isonbehalf = false;
      this.tournumb = this.expense_details['tourid']
      this.approver = true;
    }

    if (this.expense_details.claim_status_id == 2 || this.expense_details.claim_status_id == 3 || this.expense_details.claim_status_id == 4) {
      this.approver = true;
    }



    this.expname = "Local Deputation"

    this.deputationform = this.formBuilder.group({
      requestno:this.requestno,
      tourno: this.tournumb,
      employeename: '(' + this.expense_details.employee_code + ') ' + this.expense_details.employee_name,
      designation: this.expense_details['empdesignation'],
      employeegrade: this.expense_details['empgrade'],
      data: new FormArray([])



    })

    this.employeegrade = this.expense_details['empgrade']


    this.deputation = {

      data: []
    }

    this.getcityValue()
    this.existingdata(this.tournumb)
  }

  getcityValue() {
    this.taservice.getcitylist('', this.expname ,this.employeegrade,1)
      .subscribe(result => {
        this.citylist = result['data']
        console.log("Reason", this.citylist)
      })
  }

  expensedelete() {

    let data = this.shareservice.expensesummaryData.value;
    this.taservice.deletedeptdeleteSummary(data['id'])
      .subscribe(res => {
        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.notification.showWarning("Duplicate! Code Or Name ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!!...")
        }
        else {
          this.notification.showSuccess("Deleted Successfully.....")
          console.log("res", res)
          this.onSubmit.emit();
          return true
        }
      }
      )

  }
  back() {
    if (this.applevel == 0) {
      this.router.navigateByUrl('ta/exedit')
    }
    else if (this.applevel == 1 && this.report) {
      this.router.navigateByUrl('ta/reporttourexpense')

    }
    else {
      this.router.navigateByUrl('ta/exapprove-edit')
    }

  }

  existingdata(data) {
    this.spinnerservice.show()
    this.taservice.getdeputeditSummary(data, this.report)
      .subscribe((results: any[]) => {
        let datas = results['data']
        let variable = results['requestercomment']
        console.log(results)


        for (let i = 0; i < datas.length; i++) {
          console.log('datechanger', new Date(datas[i]['startdate']))
          let array = this.formBuilder.group({
            id: datas[i]['id'],
            tourgid: datas[i]['tourgid'],
            expense_id: 8,
            city: datas[i]['city'],
            startdate: new Date(datas[i]['startdate']),
            enddate: new Date(datas[i]['enddate']),
            sysdays: new FormControl({ value: datas[i]['sysdays'], disabled: true }),
            no_of_days: Number(datas[i]['no_of_days']),
            leave: datas[i]['isleave'],
            eligibleamount: new FormControl({ value: datas[i]['eligibleamount'], disabled: true }),
            claimedamount: datas[i]['claimedamount'],
            requestercomment: variable,
            approvedamount: datas[i]['approvedamount'],
          })
          // if (this.maker) {
          //   delete array['approvedamount']
          // }
          const docu = this.deputationform.get('data') as FormArray;
          docu.push(array)

        }

        if (this.deputationform.value.data.length == 0) {
          this.adddata()
        }

        this.spinnerservice.hide()
      });




  }




  createnewitem(): FormGroup {



    let datasarray = this.formBuilder.group({
      tourgid: this.tournumb,
      expense_id: 8,
      city: null,
      startdate: null,
      enddate: null,
      sysdays: new FormControl({ value: null, disabled: true }),
      no_of_days: 0,
      leave: 0,
      eligibleamount: new FormControl({ value: null, disabled: true }),
      claimedamount: null,
      requestercomment: this.requestercomment,
    });

    return datasarray;
  }

  adddata() {
    const data = this.deputationform.get('data') as FormArray;
    data.push(this.createnewitem());
    console.log(this.deputationform.value.data)
  }

  GlobalIndex(i) {
    let dat = this.pageSize * (this.p - 1) + i;
    return dat
  }

  indexdelete(i) {
    let ind = this.pageSize * (this.p - 1) + i;
    const control = <FormArray>this.deputationform.controls['data'];
    control.removeAt(ind)
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  citysearch(ind) {

    let i = this.pageSize * (this.p - 1) + ind;

    (this.deputationform.get('data') as FormArray).at(i).get('city').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          // this.isLoading = true;
        }),
        switchMap(value => this.taservice.getcitylist(value, this.expname, this.employeegrade, 1))
      )
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.citylist = datas;
      });

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

  submitapi(data) {
    this.spinnerservice.show()
    this.taservice.localdeputationCreate(data)
      .subscribe(res => {
        console.log("resss", res)
        if (res.message === "Successfully Created" && res.status === "success" || res.message === "Successfully Updated" && res.status === "success") {
          this.spinnerservice.hide()
          this.notification.showSuccess("Local Deputation Created Successfully")
          this.onSubmit.emit();
          this.back()
          return true;
        }

        else {
          this.notification.showError(res.description)
          this.spinnerservice.hide();
          return false;


        }
      }, er => this.spinnerservice.hide()
      )
  }


  minselect(i) {
    let ind = this.pageSize * (this.p - 1) + i;
    if (ind == 0) {
      return this.minimum
    }
    else {
      return this.deputationform.value.data[ind - 1].enddate;

    }

  }

  maxselect(i) {
    let ind = this.pageSize * (this.p - 1) + i;
    // this.maximum = this.deputationform.value.enddate;
    if (this.deputationform.value.data[ind].startdate == null) {
      return this.maximum;
    }
    else {
      return this.deputationform.value.data[ind].startdate
    }

  }



  cityselectcall(i) {
    if (this.centerarray.length >= 1) {
      this.centerarray.splice(0, this.centerarray.length)
    }

    let ind = this.pageSize * (this.p - 1) + i;

    console.log("INDDD", ind)
    const detailframe = this.deputationform.value.data[ind]
    if (detailframe.tourgid && detailframe.startdate && detailframe.enddate && detailframe.city) {
      this.centerarray = {
        "leave": JSON.parse(detailframe.leave),
        "tourgid": detailframe.tourgid,
        "startdate": detailframe.startdate,
        "enddate": detailframe.enddate,
        "city": detailframe.city,
        "expense_id": 8,
        "no_of_days": Number(JSON.parse(detailframe.no_of_days))
      }
    }
    else {
      return false;

    }
    this.centerarray.startdate = this.datePipe.transform(this.centerarray.startdate, 'yyyy-MM-dd');
    this.centerarray.enddate = this.datePipe.transform(this.centerarray.enddate, 'yyyy-MM-dd');
    // this.spinnerservice.show()

    if (detailframe.tourgid && detailframe.startdate && detailframe.enddate && detailframe.city) {
      this.spinnerservice.show()
      this.taservice.getdeputeligibleAmount(this.centerarray)
        .subscribe(result => {

          let eligible = result['Eligible_amount']
          let noofday = result['noofdays']
          const myform = (this.deputationform.get('data') as FormArray).at(ind)
          myform.patchValue({
            "eligibleamount": eligible,
            "sysdays": noofday,
          })
          this.eligibleamount = result['Eligible_amount']
          this.noofday = result['noofdays']
          console.log("eligibleamount", this.eligibleamount)
          console.log("noofday", this.noofday)
          for (var i = 0; i < this.deputation.data.length; i++) {
            this.deputation.data[i].eligibleamount = this.eligibleamount
            this.deputation.data[i].sysdays = this.noofday
          }
          this.spinnerservice.hide()
        }, err => this.spinnerservice.hide())
      // this.spinnerservice.hide()

    }

    console.log()
  }

  submit() {

    if (this.submitarray.length >= 1) {
      this.submitarray.splice(0, this.submitarray.length)
    }


    this.submitarray = this.deputationform.value.data

    for (let i = 0; i < this.submitarray.length; i++) {

      if (this.submitarray[i].city == null || this.submitarray[i].city == '') {
        this.notification.showError('Please Enter City')
        throw new Error
      }

      if (this.submitarray[i].startdate == null || this.submitarray[i].startdate == '') {
        this.notification.showError('Please Choose From Date')
        throw new Error
      }
      if (this.submitarray[i].enddate == null || this.submitarray[i].enddate == '') {
        this.notification.showError('Please Choose To Date')
        throw new Error
      }
      if (this.submitarray[i].no_of_days > this.noofday) {
        this.notification.showError('Number of Days should be less than Total Tour Days')
        throw new Error
      }
      if (this.submitarray[i].leave > this.noofday) {
        this.notification.showError('Number of Leave Days should be less than Total Tour Days')
        throw new Error
      }

      if (this.submitarray[i].no_of_days === null || this.submitarray[i].no_of_days === '' || this.submitarray[i].no_of_days == 0) {
        this.notification.showError('Please Enter No of Days')
        throw new Error
      }
      if (this.eligibleamount == 0) {
        this.notification.showError('Eligible Amount is 0. Please Check')
        throw new Error
      }



      if (this.submitarray[i].leave === null || this.submitarray[i].leave === '') {

        this.notification.showError('Please Enter No of Leave Days')
        throw new Error

      }



      if (this.submitarray[i].claimedamount == null || this.submitarray[i].claimedamount == '') {
        this.notification.showError('Please Enter Claimed Amount')
        throw new Error
      }


      this.submitarray[i].no_of_days = Number(this.submitarray[i].no_of_days)
      //validation over
      if (this.submitarray[i].claimedamount) {
        this.submitarray[i].claimedamount = JSON.parse(this.submitarray[i].claimedamount)
      }
      if (this.submitarray[i].startdate) {
        this.submitarray[i].startdate = this.datePipe.transform(this.submitarray[i].startdate, 'yyyy-MM-dd');
      }
      if (this.submitarray[i].enddate) {
        this.submitarray[i].enddate = this.datePipe.transform(this.submitarray[i].enddate, 'yyyy-MM-dd');
      }
      if (this.submitarray[i].leave) {
        this.submitarray[i].leave = JSON.parse(this.submitarray[i].leave)
      }
    }

    let obj = {
      data: this.submitarray
    }
    console.log('apiobj', obj)


    this.submitapi(obj)


  }

  invaliddatestart(i) {
    let ind = this.pageSize * (this.p - 1) + i;
    var length = this.deputationform.value.data.length
    let myform = (this.deputationform.get('data') as FormArray).at(ind)
    myform.patchValue({
      enddate: null
    })
    if (length > ind) {
      for (var i = ind + 1; i < length; i++) {
        let valuecheck = (this.deputationform.get('data') as FormArray).at(i).value;
        let changeform = (this.deputationform.get('data') as FormArray).at(i)
        if (valuecheck.startdate != null || valuecheck.enddate != null) {
          this.notification.showError('Invalid Dates in Table Row at ' + (i + 1))
          changeform.patchValue({
            "sysdays": null,
            "startdate": null,
            "enddate": null,
            'eligibleamount': null,
            'no_of_days': null
          })
        }

      }
    }
  }

  invaliddateend(i) {
    let ind = this.pageSize * (this.p - 1) + i;
    var length = this.deputationform.value.data.length
    if (length > ind) {

      for (var i = ind + 1; i < length; i++) {
        let valuecheck = (this.deputationform.get('data') as FormArray).at(i).value;
        let changeform = (this.deputationform.get('data') as FormArray).at(i)
        if (valuecheck.startdate != null || valuecheck.enddate != null) {
          this.notification.showError('Invalid Dates in Table Row at ' + (i + 1))
          changeform.patchValue({
            "sysdays": null,
            "startdate": null,
            "enddate": null,
            'eligibleamount': null,
            'no_of_days': null
          })
        }
      }
    }
  }

  approverupdate(tourno, expid, approvearray) {
    this.taservice.approver_amountupdate(tourno, expid, approvearray)
      .subscribe(res => {
        console.log("incires", res)
        if (res.status === "success") {
          this.notification.showSuccess("Success....")
          this.onSubmit.emit();
          return true;
        } else {
          this.notification.showError(res.description)
          return false;
        }
      })

  }

  getupdateapprove() {
    this.approverarray.splice(0, this.approverarray.length)

    for (let i = 0; i < this.deputationform.value.data.length; i++) {
      let json = {
        "id": this.deputationform.value.data[i].id,
        "amount": JSON.parse(this.deputationform.value.data[i].approvedamount),
      }
      this.approverarray.push(json)

    }

    // console.log('approveamountchange', this.approverarray)
    // console.log('expid', this.expenseids)
    this.approverupdate(this.deputationform.value.tourno, 8, this.approverarray)


  }

  backchecker() {
    this.router.navigateByUrl('ta/exapprove-edit')
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

  space(e) {
    if (e.target.selectionStart === 0 && e.code === 'Space') {
      e.preventDefault();
    }
  }

  nospace(e) {
    if (e.code === 'Space') {
      e.preventDefault();
    }
  }

  zero(e) {
    let a = ''
    if (e.code == 'Digit0') {
      a = a + e.target.value
      if (a == "0") {
        e.preventDefault();
        console.log('hello')
      }

    }
    if (e.code == 'Period') {
      a = a + e.target.value
      if (a.includes(".")) {
        e.preventDefault()
      }
    }

  }


}