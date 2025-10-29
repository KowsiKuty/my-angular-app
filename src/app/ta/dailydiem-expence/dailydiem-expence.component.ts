import { Component, OnInit, Output, EventEmitter, ViewChild,HostListener } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { isBoolean } from 'util';
// import { formatDate } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { ShareService } from 'src/app/ta/share.service';
import { TaService } from "../ta.service";
import { NotificationService } from '../notification.service'
import { Router } from '@angular/router';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChangeDetectorRef } from '@angular/core';
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
  selector: 'app-dailydiem-expence',
  templateUrl: './dailydiem-expence.component.html',
  styleUrls: ['./dailydiem-expence.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class DailydiemExpenceComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.spinnerservice.hide();
    }
  }
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() expense_navigate_n=new EventEmitter<any>();
  dailydiem: any
  Dailydiemfromdate: any
  DailydiemTodate: any
  fromdate: any
  todate: any
  expense: any
  startdate: any
  enddate: any
  sss: any
  mindatecopy: any
  expenseid: any
  exptype: any
  comm: any
  show: boolean = true
  touridd: any
  dailyid: any;
  currentpage: number = 1;
  pagesize = 10;
  depdatetime: any
  daily: any
  dd: any
  tourid = 0;
  time = '6:00 am';
  defaultValue = '6:00 am';
  citylist: any
  yesnoList: any
  // showdailydiem=true
  geteligibleamt: any
  tourdatas: any
  employeename: any
  employeegrade: any
  employeedesignation: any
  accomdation: any
  boardingbybank: any
  declaration: any
  noofleavedays: any
  enddateee: any
  startdateeee: any
  fromtimes: any
  totimes: any
  selectedcity: any
  eligibleamount: any
  syshours: any
  //  showaccomcreate=true
  //  showaccomedit=false
  //  showboardingcreate=true
  //  showboardingedit=false
  //  showdeclarationcreate=true
  //  showdeclarationedit=false
  //  showfromtimecreate=true
  //  showfromtimeedit=false
  //  showtotimecreate=true
  //  showtotimeedit=false
  FromTimes: any
  requestno:any
  totime: any
  getlocalexpid: any
  declareList: any
  boardingList: any
  reason: any;
  id: any;
  
  maximum: any;

  dailydiemform: FormGroup;
  expense_edit: any;
  expense_details: any;
  tournumb: any;
  requestercomment: any;

  isonbehalf: boolean = false;
  onbehalf_empName: any;
  maker: any;
  makerboolean: any;
  pageSize: any = 10;
  p: any = 1;
  expname: any;
  employee_grade: any;

  has_nextid: boolean = true;
  has_presentid: number = 1;
  has_previousid: boolean = false;

  start_date: any;
  end_date: any;

  centerarray: any = []
  submitarray: any = []
  approverarray: any = []

  applevel: number = 0;
  delcareval: any = 0

  approver: boolean = false;
  newform: boolean = false;
  transferreason: boolean = false;

  statusid: any;


  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger
  @ViewChild('inputassetid') inputasset: any;
  @ViewChild('assetid') matassetidauto: MatAutocomplete;
  report: any;
  enb_all_exbdetails:boolean=false;

  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private cdr: ChangeDetectorRef, private http: HttpClient, private spinnerservice: NgxSpinnerService,
    private shareservice: ShareService, private taservice: TaService, private notification: NotificationService, private router: Router) { }
  datecopy: any
  ngOnInit(): void {

    this.expense_edit = JSON.parse(localStorage.getItem('expense_edit'));
    this.expense_details = JSON.parse(localStorage.getItem('expense_details'))?JSON.parse(localStorage.getItem('expense_details')):JSON.parse(localStorage.getItem('expense_edit'));
    console.log(this.shareservice.expenseedit.value);
    console.log(this.expense_edit);
    console.log(this.expense_details);
    this.report = this.expense_details?.report;
    if(this.shareservice.TA_Ap_Exp_Enb_type.value){
      this.enb_all_exbdetails=true;
    }
    else{
      this.enb_all_exbdetails=false;
    }

    this.requestercomment = this.expense_edit['requestercomment']
    this.expname = 'Daily Diem';
    this.employee_grade = this.expense_details['empgrade']?this.expense_details['empgrade']:this.expense_details['emp_grade'];
    this.start_date = this.datePipe.transform(this.expense_details.startdate, 'yyyy-MM-dd');
    // this.start_date = this.datePipe.transform(this.expense_details.startdate, 'yyyy-MM-ddTHH:mm');
    this.end_date = this.datePipe.transform(this.expense_details.enddate, 'yyyy-MM-dd');
    // this.end_date = this.datePipe.transform(this.expense_details.enddate, 'yyyy-MM-ddTHH:mm');

    this.statusid = this.expense_details.claim_status_id;

    if (this.expense_details.applevel) {
      this.applevel = this.expense_details.applevel
    }
    
    this.tournumb = this.expense_details.tourid?this.expense_details.tourid:this.expense_details.id;
    this.requestno = this.expense_details.requestno?this.expense_details.requestno:this.expense_details.requestno;
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



    if (this.expense_details.status == 'REQUESTED') {
      this.newform = false;
    }
    // this.exptype = expensetype.expenseid

    if (this.expense_details['reason_id'] == 6 || this.expense_details['reason_id'] == 7 || this.expense_details['reason_id'] == 8) {
      this.transferreason = true;
      console.log('this.reasonid', this.expense_details['reason_id'])
    }

    if (this.expense_details.claim_status_id == 2 || this.expense_details.claim_status_id == 3 || this.expense_details.claim_status_id == 4) {
      this.approver = true;
    }


    this.dailydiemform = this.formBuilder.group({
      tourno: this.tournumb,
      requestno :this.expense_details['requestno'],
      employeename: '(' + this.expense_details.employee_code + ') ' + this.expense_details.employee_name,
      designation: this.expense_details['empdesignation']?this.expense_details['empdesignation']:this.expense_details['designation'],
      employeegrade: this.expense_details['empgrade']?this.expense_details['empgrade']:this.expense_details['emp_grade'],
      data: new FormArray([])
    })








    // let expensetype = this.shareservice.dropdownvalue.value;
    // // console.log("mmm",expensetype)

    // this.exptype = expensetype['expenseid']
    // // console.log("sf",this.exptype)
    // this.comm = expensetype['requestercomment']
    // // console.log("cc",this.comm)
    // let data = this.shareservice.expensesummaryData.value;
    // console.log("data", data)
    // this.expenseid = data['id']
    // this.id = data['id']
    // this.reason = data['reason']
    // console.log("this.reason", this.reason)
    // if (this.reason == "Transfer With Family" || this.reason == "Transfer Without Family") {
    //   this.show = false
    // }
    // this.fromdate = data['requestdate']
    // // console.log("dd",this.fromdate)

    // let datefield = data['id']
    // this.taservice.getTourmakereditSummary(data['id'])
    //   .subscribe((results: any[]) => {
    //     // console.log("expense", results)
    //     let datas = results['detail']
    //     let expense = datas
    //     // console.log("detailFromdate",expense)
    //     for (var i = 0; i < expense.length; i++) {
    //       this.datecopy = expense[i].startdate
    //       // console.log('kkk',this.datecopy)
    //       this.enddate = expense[i].enddate
    //       // console.log("lll",this.enddate)
    //     }
    //     const date = new Date(this.datecopy)
    //     this.Dailydiemfromdate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    //     const datee = new Date(this.enddate)
    //     this.DailydiemTodate = new Date(datee.getFullYear(), datee.getMonth(), datee.getDate())
    //     this.tourdatas = this.shareservice.expensesummaryData.value;
    //     // console.log("tddddd",this.tourdatas)
    //     this.employeename = this.tourdatas['employee_name']
    //     this.employeegrade = this.tourdatas['empgrade']
    //     this.employeedesignation = this.tourdatas['empdesignation']
    //     let data = this.shareservice.expenseedit.value;
    //     let datavalue = this.shareservice.expensesummaryData.value;
    //     // console.log("expensedataaaa",data)
    //     if (datavalue['requestno'] != 0) {
    //       this.dailyid = datavalue['requestno']
    //       // console.log("id",this.dailyid)

    //       this.taservice.getdailydiemeditSummary(this.id)
    //         .subscribe((results: any[]) => {
    //           console.log("Tourmaker", results)
    //           // this.showaccomcreate=false
    //           // this.showaccomedit=true
    //           // this.showboardingcreate=false
    //           // this.showboardingedit=true
    //           // this.showdeclarationcreate=false
    //           // this.showdeclarationedit=true
    //           // this.showfromtimecreate=false
    //           // this.showfromtimeedit=true
    //           // this.showtotimecreate=false
    //           // this.showtotimeedit=true
    //           this.dailydiem = results;
    //           //   let getdata=results['data']
    //           //   for (let i=0;i<getdata.length;i++){
    //           //  this.getlocalexpid= getdata[i].id
    //           //  console.log("expid",this.getlocalexpid)
    //           //  }
    //           // this.dailydiem.data.accbybank=getdata[0].accbybank_name
    //           // console.log("aacc",this.dailydiem.data.accbybank)
    //           // this.dailydiem.tourid=this.dailyid
    //           // for(var i=0;i<this.dailydiem.data.length;i++){
    //           // let fromtime=this.dailydiem.data[i].fromdate.split(" ")
    //           // console.log("timeget",fromtime)
    //           // this.FromTimes=fromtime[1]
    //           // }
    //           // for(var i=0;i<this.dailydiem.data.length;i++){
    //           // let totime=this.dailydiem.data[i].todate.split(" ")
    //           // console.log("timeget",totime)
    //           // this.totime=totime[1]
    //           // }
    //           this.dailydiem.data.forEach(currentValue => {
    //             console.log("cv", currentValue)
    //             let fromtime = currentValue.fromdate.split(" ")
    //             console.log("timeget", fromtime)
    //             currentValue.FromTime = fromtime[1]
    //             let totime = currentValue.todate.split(" ")
    //             console.log("timeget", totime)
    //             currentValue.totime = totime[1]

    //             currentValue.fromdate = this.datePipe.transform(currentValue.fromdate, 'yyyy-MM-dd');
    //             currentValue.todate = this.datePipe.transform(currentValue.todate, 'yyyy-MM-dd');

    //             currentValue.accbybank = currentValue.accbybank.value
    //             currentValue.boardingbybank = currentValue.boardingbybank.value
    //             currentValue.declaration = currentValue.declaration.value
    //             currentValue.isleave = currentValue.isleave.value
    //             currentValue.expenseid = 2
    //           });


    //           // this.dailydiem.accbybank=results['accbybank_name']
    //           // console.log("aacc1", this.dailydiem.accbybank)


    //         })

    //     }
    //     else {
    //       this.dailydiem = {
    //         // tourid:this.expenseid,
    //         data: [],
    //       }
    //       this.dailydiem.data.push({
    //         tourgid: JSON.parse(this.expenseid),
    //         claimedamount: '',
    //         requestercomment: this.comm,
    //         city: '',
    //         fromdate: '',
    //         todate: '',
    //         noofhours: '',
    //         isleave: '',
    //         accbybank: '',
    //         boardingbybank: '',
    //         declaration: '',
    //         expenseid: 2,

    //         // requestercomment:this.comm,
    //         // expenseid:this.exptype,
    //         // tourid:this.expenseid,
    //         // visitcity:'',
    //         // fromdatee:'',
    //         // FromTime:'',
    //         // todate:'',
    //         // totime:'',
    //         // syshours:'',
    //         // noofhours:'',
    //         // isleave:'',
    //         // accbybank:'',
    //         // boardingbybank:'',
    //         // declaration:'',
    //         // eligibleamount:'',
    //         // claimedamount:'',

    //       });

    //     }

    //   })

    // this.dailydiem = {
    //   // tourid:this.expenseid,
    //   data: [],
    // }
    // // this.dailydiem.data.push({
    // //   tourgid: JSON.parse(this.expenseid),
    // //   claimedamount: '',
    // //   requestercomment: this.comm,
    // //   city: '',
    // //   fromdate: '',
    // //   todate: '',
    // //   noofhours: '',
    // //   isleave: '',
    // //   accbybank: '',
    // //   boardingbybank: '',
    // //   declaration: '',
    // //   expenseid: 2,

    // // visitcity:'',
    // // fromdate:'',
    // // FromTime:'',
    // // todate:'',
    // // totime:'',
    // // syshours:'',
    // // noofhours:'',
    // // isleave:'',
    // // accbybank:'',
    // // boardingbybank:'',
    // // declaration:'',
    // // eligibleamount:'',


    // // });

    this.getcityValue();

    this.geteditfun();
    // this.getcitylist();
    this.getaccomodation();
    this.getdeclarations();
    this.getboardings();
    this.existingdata(this.tournumb);
    this.createtime();
  }

  getcitylist() {
    this.taservice.getcitylist('', 1, '', '')
      .subscribe(result => {
        this.citylist = result['data']

      })
  }

  getaccomodation() {
    this.taservice.getyesno()
      .subscribe(res => {
        this.yesnoList = res
        console.log("yesnoList", this.yesnoList)
      })
  }
  public accomvalueMapper = (value) => {
    let selection = this.yesnoList.find(e => {
      return e.value == value;
    });
    if (selection) {
      return selection.name;
    }
  };
  getdeclarations() {
    this.taservice.getyesno()
      .subscribe(res => {
        this.declareList = res
        // console.log("yesnoList",this.declareList)
      })
  }
  public declarevalueMapper = (value) => {
    let selection = this.declareList.find(e => {
      return e.value == value;
    });
    if (selection) {
      return selection.name;
    }
  };
  getboardings() {
    this.taservice.getyesno()
      .subscribe(res => {
        this.boardingList = res
        // console.log("yesnoList",this.boardingList)
      })
  }
  public boardingvalueMapper = (value) => {
    let selection = this.boardingList.find(e => {
      return e.value == value;
    });
    if (selection) {
      return selection.name;
    }
  };
  // showaccomdation(){
  //  this.showaccomcreate=true
  //  this.showaccomedit=false

  // }
  // showboarding(){
  //   this.showboardingcreate=true
  //   this.showboardingedit=false
  // }
  // showdeclaration(){
  //   this.showdeclarationcreate=true
  //  this.showdeclarationedit=false
  // }
  // showfromtime(){
  //   this.showfromtimecreate=true
  //   this.showfromtimeedit=false
  // }
  // showtotime(){
  //   this.showtotimecreate=true
  //   this.showtotimeedit=false
  // }

  // addSection() {
  //   // this.showdailydiem=true
  //   this.dailydiem.data.push({
  //     ids: this.dailydiem.data.length + 1,
  //     // tourgid: JSON.parse(this.expenseid),
  //     claimedamount: '',
  //     requestercomment: this.comm,
  //     city: '',
  //     fromdate: '',
  //     todate: '',
  //     noofhours: '',
  //     isleave: '',
  //     accbybank: '',
  //     boardingbybank: '',
  //     declaration: '',
  //     expenseid: 2,
  //   })


  // }






  removeSection(i) {
    if (this.dailydiemform.value.data[i].id == undefined || this.dailydiemform.value.data[i].id == null || this.dailydiemform.value.data[i].id ==''){
      let ind = this.pageSize * (this.p - 1) + i;
      const control = <FormArray>this.dailydiemform.controls['data'];
      control.removeAt(ind)
    }
    else {
      this.spinnerservice.show()
      this.taservice.deletedailydeim(this.dailydiemform.value.data[i].id)
        .subscribe(res => {
          if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
            this.notification.showWarning("Duplicate! Code Or Name ...")
          } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
            this.notification.showError("INVALID_DATA!...")
          }
          else {
            this.spinnerservice.hide()
            this.notification.showSuccess("Deleted Successfully....")
            let ind = this.pageSize * (this.p - 1) + i;
            const control = <FormArray>this.dailydiemform.controls['data'];
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


  oncityChange(e, data) {
    this.selectedcity = e
    let indexid = data.id
    const indexx = this.dailydiem.data.findIndex(fromdata => fromdata.id === indexid)


    this.geteligibleamt = {
      city: this.selectedcity,
      accbybank: this.accomdation,
      boardingbybank: this.boardingbybank,
      declaration: this.declaration,
      isleave: this.noofleavedays,
      fromdate: this.startdateeee + " " + this.fromtimes + ":00",
      todate: this.enddateee + " " + this.totimes + ":00",
      tourgid: this.expenseid,

    }
    if (this.selectedcity === undefined) {
      this.geteligibleamt.city = this.dailydiem.data[indexx].city
    } else {
      this.geteligibleamt.city = this.selectedcity
    }
    if (this.accomdation === undefined) {
      this.geteligibleamt.accbybank = this.dailydiem.data[indexx].accbybank
    } else {
      this.geteligibleamt.accbybank = this.accomdation
    }
    if (this.boardingbybank === undefined) {
      this.geteligibleamt.boardingbybank = this.dailydiem.data[indexx].boardingbybank
    } else {
      this.geteligibleamt.boardingbybank = this.boardingbybank
    }
    if (this.boardingbybank === undefined) {
      this.geteligibleamt.boardingbybank = this.dailydiem.data[indexx].boardingbybank
    } else {
      this.geteligibleamt.boardingbybank = this.boardingbybank
    }
    if (this.declaration === undefined) {
      this.geteligibleamt.declaration = this.dailydiem.data[indexx].declaration
    } else {
      this.geteligibleamt.declaration = this.declaration
    }
    if (this.noofleavedays === undefined) {
      this.geteligibleamt.isleave = this.dailydiem.data[indexx].isleave
    } else {
      this.geteligibleamt.isleave = this.noofleavedays
    }
    if (this.startdateeee === undefined) {
      this.geteligibleamt.fromdate = this.dailydiem.data[indexx].fromdate
    } else {
      this.geteligibleamt.fromdate = this.startdateeee + " " + this.fromtimes + ":00"
    }
    if (this.enddateee === undefined) {
      this.geteligibleamt.todate = this.dailydiem.data[indexx].todate
    } else {
      this.geteligibleamt.todate = this.enddateee + " " + this.totimes + ":00"
    }




    if (indexid === undefined) {
      if (this.accomdation === undefined) {
        this.geteligibleamt.accbybank = 0
      } else {
        this.geteligibleamt.accbybank = this.accomdation
      }
      if (this.boardingbybank === undefined) {
        this.geteligibleamt.boardingbybank = 0
      } else {
        this.geteligibleamt.boardingbybank = this.boardingbybank
      }
      if (this.declaration === undefined) {
        this.geteligibleamt.declaration = 0
      } else {
        this.geteligibleamt.declaration = this.declaration
      }
      if (this.noofleavedays === undefined) {
        this.geteligibleamt.isleave = 0
      } else {
        this.geteligibleamt.isleave = this.noofleavedays
      }
      // if(this.geteligibleamt.city != "" &&  this.geteligibleamt.accbybank !="" &&
      // this.geteligibleamt.boardingbybank != "" &&this.geteligibleamt.declaration !=""  &&this.geteligibleamt.isleave !="" &&
      // this.geteligibleamt.fromdate!=undefined&& this.geteligibleamt.fromdate!=""&& this.geteligibleamt.todate!=""&&this.geteligibleamt.tourgid!=""){
      this.taservice.dailydeimligibleamt(this.geteligibleamt)
        .subscribe(result => {

          this.eligibleamount = result['Eligible_amount']
          this.syshours = result['sys_hours']
          const indexes = this.dailydiem.data.findIndex(fromdatas => fromdatas.ids === data.ids)
          this.dailydiem.data[indexes].eligibleamount = this.eligibleamount
          this.dailydiem.data[indexes].syshours = this.syshours
        })
      // }
    } else {

      if (this.geteligibleamt.city != undefined && this.geteligibleamt.accbybank != undefined && this.geteligibleamt.boardingbybank != undefined
        && this.geteligibleamt.declaration != undefined && this.geteligibleamt.isleave != undefined && this.geteligibleamt.fromdate != undefined && this.geteligibleamt.todate != undefined &&
        this.geteligibleamt.tourgid != undefined) {
        this.taservice.dailydeimligibleamt(this.geteligibleamt)
          .subscribe(result => {

            this.eligibleamount = result['Eligible_amount']
            this.syshours = result['sys_hours']
            this.dailydiem.data[indexx].eligibleamount = this.eligibleamount
            this.dailydiem.data[indexx].syshours = this.syshours

          })
      }
    }
  }
  getaccom(data, datas) {
    //  console.log("accom",data)
    this.accomdation = JSON.parse(data)
    let indexid = datas.id
    const indexx = this.dailydiem.data.findIndex(fromdata => fromdata.id === indexid)


    this.geteligibleamt = {
      city: this.selectedcity,
      accbybank: this.accomdation,
      boardingbybank: this.boardingbybank,
      declaration: this.declaration,
      isleave: this.noofleavedays,
      fromdate: this.startdateeee + " " + this.fromtimes + ":00",
      todate: this.enddateee + " " + this.totimes + ":00",
      tourgid: this.expenseid,

    }
    if (this.selectedcity === undefined) {
      this.geteligibleamt.city = this.dailydiem.data[indexx].city
    } else {
      this.geteligibleamt.city = this.selectedcity
    }
    if (this.accomdation === undefined) {
      this.geteligibleamt.accbybank = this.dailydiem.data[indexx].accbybank
    } else {
      this.geteligibleamt.accbybank = this.accomdation
    }
    if (this.boardingbybank === undefined) {
      this.geteligibleamt.boardingbybank = this.dailydiem.data[indexx].boardingbybank
    } else {
      this.geteligibleamt.boardingbybank = this.boardingbybank
    }
    if (this.boardingbybank === undefined) {
      this.geteligibleamt.boardingbybank = this.dailydiem.data[indexx].boardingbybank
    } else {
      this.geteligibleamt.boardingbybank = this.boardingbybank
    }
    if (this.declaration === undefined) {
      this.geteligibleamt.declaration = this.dailydiem.data[indexx].declaration
    } else {
      this.geteligibleamt.declaration = this.declaration
    }
    if (this.noofleavedays === undefined) {
      this.geteligibleamt.isleave = this.dailydiem.data[indexx].isleave
    } else {
      this.geteligibleamt.isleave = this.noofleavedays
    }
    if (this.startdateeee === undefined) {
      this.geteligibleamt.fromdate = this.dailydiem.data[indexx].fromdate
    } else {
      this.geteligibleamt.fromdate = this.startdateeee + " " + this.fromtimes + ":00"
    }
    if (this.enddateee === undefined) {
      this.geteligibleamt.todate = this.dailydiem.data[indexx].todate
    } else {
      this.geteligibleamt.todate = this.enddateee + " " + this.totimes + ":00"
    }




    if (indexid === undefined) {
      if (this.accomdation === undefined) {
        this.geteligibleamt.accbybank = 0
      } else {
        this.geteligibleamt.accbybank = this.accomdation
      }
      if (this.boardingbybank === undefined) {
        this.geteligibleamt.boardingbybank = 0
      } else {
        this.geteligibleamt.boardingbybank = this.boardingbybank
      }
      if (this.declaration === undefined) {
        this.geteligibleamt.declaration = 0
      } else {
        this.geteligibleamt.declaration = this.declaration
      }
      if (this.noofleavedays === undefined) {
        this.geteligibleamt.isleave = 0
      } else {
        this.geteligibleamt.isleave = this.noofleavedays
      }
      // if(this.geteligibleamt.city != "" &&  this.geteligibleamt.accbybank !="" &&
      // this.geteligibleamt.boardingbybank != "" &&this.geteligibleamt.declaration !=""  &&this.geteligibleamt.isleave !="" &&
      // this.geteligibleamt.fromdate!=undefined&& this.geteligibleamt.fromdate!=""&& this.geteligibleamt.todate!=""&&this.geteligibleamt.tourgid!=""){

      this.taservice.dailydeimligibleamt(this.geteligibleamt)
        .subscribe(result => {

          this.eligibleamount = result['Eligible_amount']
          this.syshours = result['sys_hours']
          const indexes = this.dailydiem.data.findIndex(fromdatas => fromdatas.ids === datas.ids)
          this.dailydiem.data[indexes].eligibleamount = this.eligibleamount
          this.dailydiem.data[indexes].syshours = this.syshours
        })
      // }
    } else {

      if (this.geteligibleamt.city != undefined && this.geteligibleamt.accbybank != undefined && this.geteligibleamt.boardingbybank != undefined
        && this.geteligibleamt.declaration != undefined && this.geteligibleamt.isleave != undefined && this.geteligibleamt.fromdate != undefined && this.geteligibleamt.todate != undefined &&
        this.geteligibleamt.tourgid != undefined) {
        this.taservice.dailydeimligibleamt(this.geteligibleamt)
          .subscribe(result => {

            this.eligibleamount = result['Eligible_amount']
            this.syshours = result['sys_hours']
            this.dailydiem.data[indexx].eligibleamount = this.eligibleamount
            this.dailydiem.data[indexx].syshours = this.syshours

          })
      }
    }
  }
  getboarding(data, datas) {

    this.boardingbybank = JSON.parse(data)
    let indexid = datas.id
    const indexx = this.dailydiem.data.findIndex(fromdata => fromdata.id === indexid)


    this.geteligibleamt = {
      city: this.selectedcity,
      accbybank: this.accomdation,
      boardingbybank: this.boardingbybank,
      declaration: this.declaration,
      isleave: this.noofleavedays,
      fromdate: this.startdateeee + " " + this.fromtimes + ":00",
      todate: this.enddateee + " " + this.totimes + ":00",
      tourgid: this.expenseid,

    }
    if (this.selectedcity === undefined) {
      this.geteligibleamt.city = this.dailydiem.data[indexx].city
    } else {
      this.geteligibleamt.city = this.selectedcity
    }
    if (this.accomdation === undefined) {
      this.geteligibleamt.accbybank = this.dailydiem.data[indexx].accbybank
    } else {
      this.geteligibleamt.accbybank = this.accomdation
    }
    if (this.boardingbybank === undefined) {
      this.geteligibleamt.boardingbybank = this.dailydiem.data[indexx].boardingbybank
    } else {
      this.geteligibleamt.boardingbybank = this.boardingbybank
    }
    if (this.boardingbybank === undefined) {
      this.geteligibleamt.boardingbybank = this.dailydiem.data[indexx].boardingbybank
    } else {
      this.geteligibleamt.boardingbybank = this.boardingbybank
    }
    if (this.declaration === undefined) {
      this.geteligibleamt.declaration = this.dailydiem.data[indexx].declaration
    } else {
      this.geteligibleamt.declaration = this.declaration
    }
    if (this.noofleavedays === undefined) {
      this.geteligibleamt.isleave = this.dailydiem.data[indexx].isleave
    } else {
      this.geteligibleamt.isleave = this.noofleavedays
    }
    if (this.startdateeee === undefined) {
      this.geteligibleamt.fromdate = this.dailydiem.data[indexx].fromdate
    } else {
      this.geteligibleamt.fromdate = this.startdateeee + " " + this.fromtimes + ":00"
    }
    if (this.enddateee === undefined) {
      this.geteligibleamt.todate = this.dailydiem.data[indexx].todate
    } else {
      this.geteligibleamt.todate = this.enddateee + " " + this.totimes + ":00"
    }




    if (indexid === undefined) {
      if (this.accomdation === undefined) {
        this.geteligibleamt.accbybank = 0
      } else {
        this.geteligibleamt.accbybank = this.accomdation
      }
      if (this.boardingbybank === undefined) {
        this.geteligibleamt.boardingbybank = 0
      } else {
        this.geteligibleamt.boardingbybank = this.boardingbybank
      }
      if (this.declaration === undefined) {
        this.geteligibleamt.declaration = 0
      } else {
        this.geteligibleamt.declaration = this.declaration
      }
      if (this.noofleavedays === undefined) {
        this.geteligibleamt.isleave = 0
      } else {
        this.geteligibleamt.isleave = this.noofleavedays
      }
      // if(this.geteligibleamt.city != "" &&  this.geteligibleamt.accbybank !="" &&
      // this.geteligibleamt.boardingbybank != "" &&this.geteligibleamt.declaration !=""  &&this.geteligibleamt.isleave !="" &&
      // this.geteligibleamt.fromdate!=undefined&& this.geteligibleamt.fromdate!=""&& this.geteligibleamt.todate!=""&&this.geteligibleamt.tourgid!=""){

      this.taservice.dailydeimligibleamt(this.geteligibleamt)
        .subscribe(result => {

          this.eligibleamount = result['Eligible_amount']
          this.syshours = result['sys_hours']
          const indexes = this.dailydiem.data.findIndex(fromdatas => fromdatas.ids === datas.ids)
          this.dailydiem.data[indexes].eligibleamount = this.eligibleamount
          this.dailydiem.data[indexes].syshours = this.syshours
        })
      // }
    } else {

      if (this.geteligibleamt.city != undefined && this.geteligibleamt.accbybank != undefined && this.geteligibleamt.boardingbybank != undefined
        && this.geteligibleamt.declaration != undefined && this.geteligibleamt.isleave != undefined && this.geteligibleamt.fromdate != undefined && this.geteligibleamt.todate != undefined &&
        this.geteligibleamt.tourgid != undefined) {
        this.taservice.dailydeimligibleamt(this.geteligibleamt)
          .subscribe(result => {

            this.eligibleamount = result['Eligible_amount']
            this.syshours = result['sys_hours']
            this.dailydiem.data[indexx].eligibleamount = this.eligibleamount
            this.dailydiem.data[indexx].syshours = this.syshours

          })
      }
    }
  }
  getdeclaration(data, datas) {

    this.declaration = JSON.parse(data)
    let indexid = datas.id
    const indexx = this.dailydiem.data.findIndex(fromdata => fromdata.id === indexid)


    this.geteligibleamt = {
      city: this.selectedcity,
      accbybank: this.accomdation,
      boardingbybank: this.boardingbybank,
      declaration: this.declaration,
      isleave: this.noofleavedays,
      fromdate: this.startdateeee + " " + this.fromtimes + ":00",
      todate: this.enddateee + " " + this.totimes + ":00",
      tourgid: this.expenseid,

    }
    if (this.selectedcity === undefined) {
      this.geteligibleamt.city = this.dailydiem.data[indexx].city
    } else {
      this.geteligibleamt.city = this.selectedcity
    }
    if (this.accomdation === undefined) {
      this.geteligibleamt.accbybank = this.dailydiem.data[indexx].accbybank
    } else {
      this.geteligibleamt.accbybank = this.accomdation
    }
    if (this.boardingbybank === undefined) {
      this.geteligibleamt.boardingbybank = this.dailydiem.data[indexx].boardingbybank
    } else {
      this.geteligibleamt.boardingbybank = this.boardingbybank
    }
    if (this.boardingbybank === undefined) {
      this.geteligibleamt.boardingbybank = this.dailydiem.data[indexx].boardingbybank
    } else {
      this.geteligibleamt.boardingbybank = this.boardingbybank
    }
    if (this.declaration === undefined) {
      this.geteligibleamt.declaration = this.dailydiem.data[indexx].declaration
    } else {
      this.geteligibleamt.declaration = this.declaration
    }
    if (this.noofleavedays === undefined) {
      this.geteligibleamt.isleave = this.dailydiem.data[indexx].isleave
    } else {
      this.geteligibleamt.isleave = this.noofleavedays
    }
    if (this.startdateeee === undefined) {
      this.geteligibleamt.fromdate = this.dailydiem.data[indexx].fromdate
    } else {
      this.geteligibleamt.fromdate = this.startdateeee + " " + this.fromtimes + ":00"
    }
    if (this.enddateee === undefined) {
      this.geteligibleamt.todate = this.dailydiem.data[indexx].todate
    } else {
      this.geteligibleamt.todate = this.enddateee + " " + this.totimes + ":00"
    }




    if (indexid === undefined) {
      if (this.accomdation === undefined) {
        this.geteligibleamt.accbybank = 0
      } else {
        this.geteligibleamt.accbybank = this.accomdation
      }
      if (this.boardingbybank === undefined) {
        this.geteligibleamt.boardingbybank = 0
      } else {
        this.geteligibleamt.boardingbybank = this.boardingbybank
      }
      if (this.declaration === undefined) {
        this.geteligibleamt.declaration = 0
      } else {
        this.geteligibleamt.declaration = this.declaration
      }
      if (this.noofleavedays === undefined) {
        this.geteligibleamt.isleave = 0
      } else {
        this.geteligibleamt.isleave = this.noofleavedays
      }
      // if(this.geteligibleamt.city != "" &&  this.geteligibleamt.accbybank !="" &&
      // this.geteligibleamt.boardingbybank != "" &&this.geteligibleamt.declaration !=""  &&this.geteligibleamt.isleave !="" &&
      // this.geteligibleamt.fromdate!=undefined&& this.geteligibleamt.fromdate!=""&& this.geteligibleamt.todate!=""&&this.geteligibleamt.tourgid!=""){

      this.taservice.dailydeimligibleamt(this.geteligibleamt)
        .subscribe(result => {

          this.eligibleamount = result['Eligible_amount']
          this.syshours = result['sys_hours']
          const indexes = this.dailydiem.data.findIndex(fromdatas => fromdatas.ids === datas.ids)
          this.dailydiem.data[indexes].eligibleamount = this.eligibleamount
          this.dailydiem.data[indexes].syshours = this.syshours
        })
      // }
    } else {

      if (this.geteligibleamt.city != undefined && this.geteligibleamt.accbybank != undefined && this.geteligibleamt.boardingbybank != undefined
        && this.geteligibleamt.declaration != undefined && this.geteligibleamt.isleave != undefined && this.geteligibleamt.fromdate != undefined && this.geteligibleamt.todate != undefined &&
        this.geteligibleamt.tourgid != undefined) {
        this.taservice.dailydeimligibleamt(this.geteligibleamt)
          .subscribe(result => {

            this.eligibleamount = result['Eligible_amount']
            this.syshours = result['sys_hours']
            this.dailydiem.data[indexx].eligibleamount = this.eligibleamount
            this.dailydiem.data[indexx].syshours = this.syshours

          })
      }
    }
  }
  getleavedays(data, datas) {

    this.noofleavedays = JSON.parse(data)
    let indexid = datas.id
    const indexx = this.dailydiem.data.findIndex(fromdata => fromdata.id === indexid)


    this.geteligibleamt = {
      city: this.selectedcity,
      accbybank: this.accomdation,
      boardingbybank: this.boardingbybank,
      declaration: this.declaration,
      isleave: this.noofleavedays,
      fromdate: this.startdateeee + " " + this.fromtimes + ":00",
      todate: this.enddateee + " " + this.totimes + ":00",
      tourgid: this.expenseid,

    }
    if (this.selectedcity === undefined) {
      this.geteligibleamt.city = this.dailydiem.data[indexx].city
    } else {
      this.geteligibleamt.city = this.selectedcity
    }
    if (this.accomdation === undefined) {
      this.geteligibleamt.accbybank = this.dailydiem.data[indexx].accbybank
    } else {
      this.geteligibleamt.accbybank = this.accomdation
    }
    if (this.boardingbybank === undefined) {
      this.geteligibleamt.boardingbybank = this.dailydiem.data[indexx].boardingbybank
    } else {
      this.geteligibleamt.boardingbybank = this.boardingbybank
    }
    if (this.boardingbybank === undefined) {
      this.geteligibleamt.boardingbybank = this.dailydiem.data[indexx].boardingbybank
    } else {
      this.geteligibleamt.boardingbybank = this.boardingbybank
    }
    if (this.declaration === undefined) {
      this.geteligibleamt.declaration = this.dailydiem.data[indexx].declaration
    } else {
      this.geteligibleamt.declaration = this.declaration
    }
    if (this.noofleavedays === undefined) {
      this.geteligibleamt.isleave = this.dailydiem.data[indexx].isleave
    } else {
      this.geteligibleamt.isleave = this.noofleavedays
    }
    if (this.startdateeee === undefined) {
      this.geteligibleamt.fromdate = this.dailydiem.data[indexx].fromdate
    } else {
      this.geteligibleamt.fromdate = this.startdateeee + " " + this.fromtimes + ":00"
    }
    if (this.enddateee === undefined) {
      this.geteligibleamt.todate = this.dailydiem.data[indexx].todate
    } else {
      this.geteligibleamt.todate = this.enddateee + " " + this.totimes + ":00"
    }




    if (indexid === undefined) {
      if (this.accomdation === undefined) {
        this.geteligibleamt.accbybank = 0
      } else {
        this.geteligibleamt.accbybank = this.accomdation
      }
      if (this.boardingbybank === undefined) {
        this.geteligibleamt.boardingbybank = 0
      } else {
        this.geteligibleamt.boardingbybank = this.boardingbybank
      }
      if (this.declaration === undefined) {
        this.geteligibleamt.declaration = 0
      } else {
        this.geteligibleamt.declaration = this.declaration
      }
      if (this.noofleavedays === undefined) {
        this.geteligibleamt.isleave = 0
      } else {
        this.geteligibleamt.isleave = this.noofleavedays
      }
      // if(this.geteligibleamt.city != "" &&  this.geteligibleamt.accbybank !="" &&
      // this.geteligibleamt.boardingbybank != "" &&this.geteligibleamt.declaration !=""  &&this.geteligibleamt.isleave !="" &&
      // this.geteligibleamt.fromdate!=undefined&& this.geteligibleamt.fromdate!=""&& this.geteligibleamt.todate!=""&&this.geteligibleamt.tourgid!=""){

      this.taservice.dailydeimligibleamt(this.geteligibleamt)
        .subscribe(result => {

          this.eligibleamount = result['Eligible_amount']
          this.syshours = result['sys_hours']
          const indexes = this.dailydiem.data.findIndex(fromdatas => fromdatas.ids === datas.ids)
          this.dailydiem.data[indexes].eligibleamount = this.eligibleamount
          this.dailydiem.data[indexes].syshours = this.syshours
        })
      // }
    } else {

      if (this.geteligibleamt.city != undefined && this.geteligibleamt.accbybank != undefined && this.geteligibleamt.boardingbybank != undefined
        && this.geteligibleamt.declaration != undefined && this.geteligibleamt.isleave != undefined && this.geteligibleamt.fromdate != undefined && this.geteligibleamt.todate != undefined &&
        this.geteligibleamt.tourgid != undefined) {
        this.taservice.dailydeimligibleamt(this.geteligibleamt)
          .subscribe(result => {

            this.eligibleamount = result['Eligible_amount']
            this.syshours = result['sys_hours']
            this.dailydiem.data[indexx].eligibleamount = this.eligibleamount
            this.dailydiem.data[indexx].syshours = this.syshours

          })
      }
    }
  }
  fromdateSelection(event, data) {
    // console.log("fd",event)
    this.startdateeee = this.datePipe.transform(event, 'yyyy-MM-dd');
    // console.log("fd1",this.startdateeee)
    let indexid = data.id
    const indexx = this.dailydiem.data.findIndex(fromdata => fromdata.id === indexid)


    this.geteligibleamt = {
      city: this.selectedcity,
      accbybank: this.accomdation,
      boardingbybank: this.boardingbybank,
      declaration: this.declaration,
      isleave: this.noofleavedays,
      fromdate: this.startdateeee + " " + this.fromtimes + ":00",
      todate: this.enddateee + " " + this.totimes + ":00",
      tourgid: this.expenseid,

    }
    if (this.selectedcity === undefined) {
      this.geteligibleamt.city = this.dailydiem.data[indexx].city
    } else {
      this.geteligibleamt.city = this.selectedcity
    }
    if (this.accomdation === undefined) {
      this.geteligibleamt.accbybank = this.dailydiem.data[indexx].accbybank
    } else {
      this.geteligibleamt.accbybank = this.accomdation
    }
    if (this.boardingbybank === undefined) {
      this.geteligibleamt.boardingbybank = this.dailydiem.data[indexx].boardingbybank
    } else {
      this.geteligibleamt.boardingbybank = this.boardingbybank
    }
    if (this.boardingbybank === undefined) {
      this.geteligibleamt.boardingbybank = this.dailydiem.data[indexx].boardingbybank
    } else {
      this.geteligibleamt.boardingbybank = this.boardingbybank
    }
    if (this.declaration === undefined) {
      this.geteligibleamt.declaration = this.dailydiem.data[indexx].declaration
    } else {
      this.geteligibleamt.declaration = this.declaration
    }
    if (this.noofleavedays === undefined) {
      this.geteligibleamt.isleave = this.dailydiem.data[indexx].isleave
    } else {
      this.geteligibleamt.isleave = this.noofleavedays
    }
    if (this.startdateeee === undefined) {
      this.geteligibleamt.fromdate = this.dailydiem.data[indexx].fromdate
    } else {
      this.geteligibleamt.fromdate = this.startdateeee
    }
    if (this.enddateee === undefined) {
      this.geteligibleamt.todate = this.dailydiem.data[indexx].todate
    } else {
      this.geteligibleamt.todate = this.enddateee
    }




    if (indexid === undefined) {
      if (this.accomdation === undefined) {
        this.geteligibleamt.accbybank = 0
      } else {
        this.geteligibleamt.accbybank = this.accomdation
      }
      if (this.boardingbybank === undefined) {
        this.geteligibleamt.boardingbybank = 0
      } else {
        this.geteligibleamt.boardingbybank = this.boardingbybank
      }
      if (this.declaration === undefined) {
        this.geteligibleamt.declaration = 0
      } else {
        this.geteligibleamt.declaration = this.declaration
      }
      if (this.noofleavedays === undefined) {
        this.geteligibleamt.isleave = 0
      } else {
        this.geteligibleamt.isleave = this.noofleavedays
      }
      // if(this.geteligibleamt.city != "" &&  this.geteligibleamt.accbybank !="" &&
      // this.geteligibleamt.boardingbybank != "" &&this.geteligibleamt.declaration !=""  &&this.geteligibleamt.isleave !="" &&
      // this.geteligibleamt.fromdate!=undefined&& this.geteligibleamt.fromdate!=""&& this.geteligibleamt.todate!=""&&this.geteligibleamt.tourgid!=""){

      this.taservice.dailydeimligibleamt(this.geteligibleamt)
        .subscribe(result => {

          this.eligibleamount = result['Eligible_amount']
          this.syshours = result['sys_hours']
          const indexes = this.dailydiem.data.findIndex(fromdatas => fromdatas.ids === data.ids)
          this.dailydiem.data[indexes].eligibleamount = this.eligibleamount
          this.dailydiem.data[indexes].syshours = this.syshours
        })
      // }
    } else {

      if (this.geteligibleamt.city != undefined && this.geteligibleamt.accbybank != undefined && this.geteligibleamt.boardingbybank != undefined
        && this.geteligibleamt.declaration != undefined && this.geteligibleamt.isleave != undefined && this.geteligibleamt.fromdate != undefined && this.geteligibleamt.todate != undefined &&
        this.geteligibleamt.tourgid != undefined) {
        this.taservice.dailydeimligibleamt(this.geteligibleamt)
          .subscribe(result => {

            this.eligibleamount = result['Eligible_amount']
            this.syshours = result['sys_hours']
            this.dailydiem.data[indexx].eligibleamount = this.eligibleamount
            this.dailydiem.data[indexx].syshours = this.syshours

          })
      }
    }
  }
  todateSelection(event, data) {
    //  console.log("td",event)
    this.enddateee = this.datePipe.transform(event, 'yyyy-MM-dd');
    // console.log("td1",this.enddateee)
    let indexid = data.id
    const indexx = this.dailydiem.data.findIndex(fromdata => fromdata.id === indexid)


    this.geteligibleamt = {
      city: this.selectedcity,
      accbybank: this.accomdation,
      boardingbybank: this.boardingbybank,
      declaration: this.declaration,
      isleave: this.noofleavedays,
      fromdate: this.startdateeee + " " + this.fromtimes + ":00",
      todate: this.enddateee + " " + this.totimes + ":00",
      tourgid: this.expenseid,

    }
    if (this.selectedcity === undefined) {
      this.geteligibleamt.city = this.dailydiem.data[indexx].city
    } else {
      this.geteligibleamt.city = this.selectedcity
    }
    if (this.accomdation === undefined) {
      this.geteligibleamt.accbybank = this.dailydiem.data[indexx].accbybank
    } else {
      this.geteligibleamt.accbybank = this.accomdation
    }
    if (this.boardingbybank === undefined) {
      this.geteligibleamt.boardingbybank = this.dailydiem.data[indexx].boardingbybank
    } else {
      this.geteligibleamt.boardingbybank = this.boardingbybank
    }
    if (this.boardingbybank === undefined) {
      this.geteligibleamt.boardingbybank = this.dailydiem.data[indexx].boardingbybank
    } else {
      this.geteligibleamt.boardingbybank = this.boardingbybank
    }
    if (this.declaration === undefined) {
      this.geteligibleamt.declaration = this.dailydiem.data[indexx].declaration
    } else {
      this.geteligibleamt.declaration = this.declaration
    }
    if (this.noofleavedays === undefined) {
      this.geteligibleamt.isleave = this.dailydiem.data[indexx].isleave
    } else {
      this.geteligibleamt.isleave = this.noofleavedays
    }
    if (this.startdateeee === undefined) {
      this.geteligibleamt.fromdate = this.dailydiem.data[indexx].fromdate
    } else {
      this.geteligibleamt.fromdate = this.startdateeee + " " + this.fromtimes + ":00"
    }
    if (this.enddateee === undefined) {
      this.geteligibleamt.todate = this.dailydiem.data[indexx].todate
    } else {
      this.geteligibleamt.todate = this.enddateee + " " + this.totimes + ":00"
    }




    if (indexid === undefined) {
      if (this.accomdation === undefined) {
        this.geteligibleamt.accbybank = 0
      } else {
        this.geteligibleamt.accbybank = this.accomdation
      }
      if (this.boardingbybank === undefined) {
        this.geteligibleamt.boardingbybank = 0
      } else {
        this.geteligibleamt.boardingbybank = this.boardingbybank
      }
      if (this.declaration === undefined) {
        this.geteligibleamt.declaration = 0
      } else {
        this.geteligibleamt.declaration = this.declaration
      }
      if (this.noofleavedays === undefined) {
        this.geteligibleamt.isleave = 0
      } else {
        this.geteligibleamt.isleave = this.noofleavedays
      }
      // if(this.geteligibleamt.city != "" &&  this.geteligibleamt.accbybank !="" &&
      // this.geteligibleamt.boardingbybank != "" &&this.geteligibleamt.declaration !=""  &&this.geteligibleamt.isleave !="" &&
      // this.geteligibleamt.fromdate!=undefined&& this.geteligibleamt.fromdate!=""&& this.geteligibleamt.todate!=""&&this.geteligibleamt.tourgid!=""){

      this.taservice.dailydeimligibleamt(this.geteligibleamt)
        .subscribe(result => {

          this.eligibleamount = result['Eligible_amount']
          this.syshours = result['sys_hours']
          const indexes = this.dailydiem.data.findIndex(fromdatas => fromdatas.ids === data.ids)
          this.dailydiem.data[indexes].eligibleamount = this.eligibleamount
          this.dailydiem.data[indexes].syshours = this.syshours
        })
      // }
    } else {

      if (this.geteligibleamt.city != undefined && this.geteligibleamt.accbybank != undefined && this.geteligibleamt.boardingbybank != undefined
        && this.geteligibleamt.declaration != undefined && this.geteligibleamt.isleave != undefined && this.geteligibleamt.fromdate != undefined && this.geteligibleamt.todate != undefined &&
        this.geteligibleamt.tourgid != undefined) {
        this.taservice.dailydeimligibleamt(this.geteligibleamt)
          .subscribe(result => {

            this.eligibleamount = result['Eligible_amount']
            this.syshours = result['sys_hours']
            this.dailydiem.data[indexx].eligibleamount = this.eligibleamount
            this.dailydiem.data[indexx].syshours = this.syshours

          })
      }
    }
  }
  getfromtime(value, data) {
    //  console.log("ft",value)
    this.fromtimes = value
    //  let fromstringValue = fromtimes.split("AM")
    //  let fromstringValues = fromtimes.split("PM")
    //  this.fromtimes=fromstringValue
    //  this.fromtimes=fromstringValues
    console.log("ft1", this.fromtimes)

    let indexid = data.id
    const indexx = this.dailydiem.data.findIndex(fromdata => fromdata.id === indexid)


    this.geteligibleamt = {
      city: this.selectedcity,
      accbybank: this.accomdation,
      boardingbybank: this.boardingbybank,
      declaration: this.declaration,
      isleave: this.noofleavedays,
      fromdate: this.startdateeee + " " + this.fromtimes + ":00",
      todate: this.enddateee + " " + this.totimes + ":00",
      tourgid: this.expenseid,

    }
    if (this.selectedcity === undefined) {
      this.geteligibleamt.city = this.dailydiem.data[indexx].city
    } else {
      this.geteligibleamt.city = this.selectedcity
    }
    if (this.accomdation === undefined) {
      this.geteligibleamt.accbybank = this.dailydiem.data[indexx].accbybank
    } else {
      this.geteligibleamt.accbybank = this.accomdation
    }
    if (this.boardingbybank === undefined) {
      this.geteligibleamt.boardingbybank = this.dailydiem.data[indexx].boardingbybank
    } else {
      this.geteligibleamt.boardingbybank = this.boardingbybank
    }
    if (this.boardingbybank === undefined) {
      this.geteligibleamt.boardingbybank = this.dailydiem.data[indexx].boardingbybank
    } else {
      this.geteligibleamt.boardingbybank = this.boardingbybank
    }
    if (this.declaration === undefined) {
      this.geteligibleamt.declaration = this.dailydiem.data[indexx].declaration
    } else {
      this.geteligibleamt.declaration = this.declaration
    }
    if (this.noofleavedays === undefined) {
      this.geteligibleamt.isleave = this.dailydiem.data[indexx].isleave
    } else {
      this.geteligibleamt.isleave = this.noofleavedays
    }
    if (this.startdateeee === undefined) {
      this.geteligibleamt.fromdate = this.dailydiem.data[indexx].fromdate
    } else {
      this.geteligibleamt.fromdate = this.startdateeee + " " + this.fromtimes + ":00"
    }
    if (this.enddateee === undefined) {
      this.geteligibleamt.todate = this.dailydiem.data[indexx].todate
    } else {
      this.geteligibleamt.todate = +" " + this.totimes + ":00"
    }




    if (indexid === undefined) {
      if (this.accomdation === undefined) {
        this.geteligibleamt.accbybank = 0
      } else {
        this.geteligibleamt.accbybank = this.accomdation
      }
      if (this.boardingbybank === undefined) {
        this.geteligibleamt.boardingbybank = 0
      } else {
        this.geteligibleamt.boardingbybank = this.boardingbybank
      }
      if (this.declaration === undefined) {
        this.geteligibleamt.declaration = 0
      } else {
        this.geteligibleamt.declaration = this.declaration
      }
      if (this.noofleavedays === undefined) {
        this.geteligibleamt.isleave = 0
      } else {
        this.geteligibleamt.isleave = this.noofleavedays
      }
      // if(this.geteligibleamt.city != "" &&  this.geteligibleamt.accbybank !="" &&
      // this.geteligibleamt.boardingbybank != "" &&this.geteligibleamt.declaration !=""  &&this.geteligibleamt.isleave !="" &&
      // this.geteligibleamt.fromdate!=undefined&& this.geteligibleamt.fromdate!=""&& this.geteligibleamt.todate!=""&&this.geteligibleamt.tourgid!=""){

      this.taservice.dailydeimligibleamt(this.geteligibleamt)
        .subscribe(result => {

          this.eligibleamount = result['Eligible_amount']
          this.syshours = result['sys_hours']
          const indexes = this.dailydiem.data.findIndex(fromdatas => fromdatas.ids === data.ids)
          this.dailydiem.data[indexes].eligibleamount = this.eligibleamount
          this.dailydiem.data[indexes].syshours = this.syshours
        })
      // }
    } else {

      if (this.geteligibleamt.city != undefined && this.geteligibleamt.accbybank != undefined && this.geteligibleamt.boardingbybank != undefined
        && this.geteligibleamt.declaration != undefined && this.geteligibleamt.isleave != undefined && this.geteligibleamt.fromdate != undefined && this.geteligibleamt.todate != undefined &&
        this.geteligibleamt.tourgid != undefined) {
        this.taservice.dailydeimligibleamt(this.geteligibleamt)
          .subscribe(result => {

            this.eligibleamount = result['Eligible_amount']
            this.syshours = result['sys_hours']
            this.dailydiem.data[indexx].eligibleamount = this.eligibleamount
            this.dailydiem.data[indexx].syshours = this.syshours

          })
      }
    }
  }

  ontimeChange(e, data) {
    //  console.log("tt",e)

    this.totimes = e
    //  let stringValue = totimes.split("AM")
    //  let stringValues = totimes.split("PM")
    //  this.totimes=stringValue
    //  this.totimes=stringValues
    console.log("tt1", this.totimes)
    let indexid = data.id
    const indexx = this.dailydiem.data.findIndex(fromdata => fromdata.id === indexid)


    this.geteligibleamt = {
      city: this.selectedcity,
      accbybank: this.accomdation,
      boardingbybank: this.boardingbybank,
      declaration: this.declaration,
      isleave: this.noofleavedays,
      fromdate: this.startdateeee + " " + this.fromtimes + ":00",
      todate: this.enddateee + " " + this.totimes + ":00",
      tourgid: this.expenseid,

    }
    if (this.selectedcity === undefined) {
      this.geteligibleamt.city = this.dailydiem.data[indexx].city
    } else {
      this.geteligibleamt.city = this.selectedcity
    }
    if (this.accomdation === undefined) {
      this.geteligibleamt.accbybank = this.dailydiem.data[indexx].accbybank
    } else {
      this.geteligibleamt.accbybank = this.accomdation
    }
    if (this.boardingbybank === undefined) {
      this.geteligibleamt.boardingbybank = this.dailydiem.data[indexx].boardingbybank
    } else {
      this.geteligibleamt.boardingbybank = this.boardingbybank
    }
    if (this.boardingbybank === undefined) {
      this.geteligibleamt.boardingbybank = this.dailydiem.data[indexx].boardingbybank
    } else {
      this.geteligibleamt.boardingbybank = this.boardingbybank
    }
    if (this.declaration === undefined) {
      this.geteligibleamt.declaration = this.dailydiem.data[indexx].declaration
    } else {
      this.geteligibleamt.declaration = this.declaration
    }
    if (this.noofleavedays === undefined) {
      this.geteligibleamt.isleave = this.dailydiem.data[indexx].isleave
    } else {
      this.geteligibleamt.isleave = this.noofleavedays
    }
    if (this.startdateeee === undefined) {
      this.geteligibleamt.fromdate = this.dailydiem.data[indexx].fromdate
    } else {
      this.geteligibleamt.fromdate = this.startdateeee + " " + this.fromtimes + ":00"
    }
    if (this.enddateee === undefined) {
      this.geteligibleamt.todate = this.dailydiem.data[indexx].todate
    } else {
      this.geteligibleamt.todate = this.enddateee + " " + this.totimes + ":00"
    }




    if (indexid === undefined) {
      if (this.accomdation === undefined) {
        this.geteligibleamt.accbybank = 0
      } else {
        this.geteligibleamt.accbybank = this.accomdation
      }
      if (this.boardingbybank === undefined) {
        this.geteligibleamt.boardingbybank = 0
      } else {
        this.geteligibleamt.boardingbybank = this.boardingbybank
      }
      if (this.declaration === undefined) {
        this.geteligibleamt.declaration = 0
      } else {
        this.geteligibleamt.declaration = this.declaration
      }
      if (this.noofleavedays === undefined) {
        this.geteligibleamt.isleave = 0
      } else {
        this.geteligibleamt.isleave = this.noofleavedays
      }
      //  if(this.geteligibleamt.city != "" &&  this.geteligibleamt.accbybank !="" &&
      // this.geteligibleamt.boardingbybank != "" &&this.geteligibleamt.declaration !=""  &&this.geteligibleamt.isleave !="" &&
      // this.geteligibleamt.fromdate!=undefined&& this.geteligibleamt.fromdate!=""&& this.geteligibleamt.todate!=""&&this.geteligibleamt.tourgid!=""){
      this.taservice.dailydeimligibleamt(this.geteligibleamt)
        .subscribe(result => {

          this.eligibleamount = result['Eligible_amount']
          this.syshours = result['sys_hours']
          const indexes = this.dailydiem.data.findIndex(fromdatas => fromdatas.ids === data.ids)
          this.dailydiem.data[indexes].eligibleamount = this.eligibleamount
          this.dailydiem.data[indexes].syshours = this.syshours
        })
      //  }
    } else {

      if (this.geteligibleamt.city != undefined && this.geteligibleamt.accbybank != undefined && this.geteligibleamt.boardingbybank != undefined
        && this.geteligibleamt.declaration != undefined && this.geteligibleamt.isleave != undefined && this.geteligibleamt.fromdate != undefined && this.geteligibleamt.todate != undefined &&
        this.geteligibleamt.tourgid != undefined) {
        this.taservice.dailydeimligibleamt(this.geteligibleamt)
          .subscribe(result => {

            this.eligibleamount = result['Eligible_amount']
            this.syshours = result['sys_hours']
            this.dailydiem.data[indexx].eligibleamount = this.eligibleamount
            this.dailydiem.data[indexx].syshours = this.syshours

          })
      }
    }

  }

  geteditfun() {


  }

  ftime: any
  ttime: any
  dt: any
  td: any
  tt: any
  fdt: any
  tdt: any
  aa: any
  submitForm() {
    this.tt = this.td
    console.log("ff", this.tt)
    this.dailydiem.data.forEach(currentValue => {
      this.ftime = currentValue.FromTime
      console.log("time", this.ftime)
      currentValue.fromdate = this.datePipe.transform(currentValue.fromdate, 'yyyy-MM-dd');
      this.tt = currentValue.fromdate
      console.log("dd", this.tt)
      this.fdt = this.tt + " " + this.ftime + ":00"
      console.log("bb", this.dt)
      //  let gg=this.time.toString() + this.tt.toString()
      //  console.log("bb",gg)
      this.ttime = currentValue.totime
      currentValue.todate = this.datePipe.transform(currentValue.todate, 'yyyy-MM-dd');
      this.aa = currentValue.todate
      this.tdt = this.aa + " " + this.ttime + ":00"
    });
    // for(var i=0;i< this.dailydiem.data.length;i++){
    //   this.dailydiem.data[i].fromdate=this.fdt
    //   this.dailydiem.data[i].todate=this.tdt
    //   console.log("fdt",this.fdt)
    //   console.log("tdt",this.tdt)
    // }

    for (var i = 0; i < this.dailydiem.data.length; i++) {
      if (this.dailydiem.data[i].claimreqid === undefined) {
        delete this.dailydiem.data[i].ids
        delete this.dailydiem.data[i].syshours
        delete this.dailydiem.data[i].eligibleamount
        this.dailydiem.data[i].expenseid = 2
        let data = this.shareservice.expenseedit.value;
        let comm = data['requestercomment']
        this.dailydiem.data[i].requestercomment = comm
        this.dailydiem.data[i].fromdate = this.fdt
        this.dailydiem.data[i].todate = this.tdt
        console.log("fdt", this.fdt)
        console.log("tdt", this.tdt)
      } else {
        this.dailydiem.data[i].fromdate = this.fdt
        this.dailydiem.data[i].todate = this.tdt
        delete this.dailydiem.data[i].syshours
        delete this.dailydiem.data[i].eligibleamount
        let data = this.shareservice.expenseedit.value;
        let comm = data['requestercomment']
        this.dailydiem.data[i].requestercomment = comm
      }
    }
    console.log("dailydeim", this.dailydiem)
    this.taservice.DailydiemCreate(this.dailydiem)
      .subscribe(res => {
        console.log("dailydeimres", res)
        if (res.message === "Successfully Created" && res.status === "success" || res.message === "Successfully Updated" && res.status === "success") {
          this.notification.showSuccess("Successfully Created")
          this.onSubmit.emit();
          return true;
        }

        else {
          this.notification.showError(res.description)
          return false;
        }
      }
      )
  }
  // minselects(ind) {

  //   if (ind == 0) {
  //     return this.Dailydiemfromdate;
  //   }
  //   else {
  //     return this.dailydiem.data[ind - 1].todate;

  //   }
  // }
  maxselects(ind) {



    if (this.dailydiem.data[ind].fromdate == null) {
      return;
    }
    else {
      return this.dailydiem.data[ind].fromdate
      
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

  omit_special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }


  GlobalIndex(i) {
    let dat = this.pageSize * (this.p - 1) + i;
    return dat
  }


  createnewitem(): FormGroup {



    let datasarray = this.formBuilder.group({
      tourgid: this.tournumb,
      claimedamount: null,
      requestercomment: this.requestercomment,
      city: null,
      fromdate: null,
      fromtime:new FormControl(),
      todate: null,
      totime:new FormControl(),
      syshours: null,
      noofhours: null,
      isleave: 0,
      accbybank: "0",
      boardingbybank: "0",
      declaration: "0",
      expenseid: 2,
      eligibleamount: new FormControl(0), //Bug 8418 Fix
      gstno:new FormControl("",[Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")]),
      invoicedate:null,
      invoiceno:null
    });

    return datasarray;
  }

  createnewitemarray(): FormGroup {



    let datasarray1 = this.formBuilder.group({
      tourgid: this.tournumb,
      claimedamount: null,
      requestercomment: this.requestercomment,
      city: null,
      fromtime:new FormControl(),
      totime:new FormControl(),
      fromdate: this.start_date,
      todate: this.start_date,
      syshours: null,
      noofhours: null,
      isleave: 0,
      accbybank: "0",
      boardingbybank: "0",
      declaration: "0",
      expenseid: 2,
      eligibleamount: new FormControl({ value: null, disabled: true }),
      gstno:new FormControl("",[Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")]),
      invoicedate:null,
      invoiceno:null
    });

    return datasarray1;
  }

  adddata() {
    const data = this.dailydiemform.get('data') as FormArray;
    data.push(this.createnewitem());
    console.log(this.dailydiemform.value.data)
  }

  adddata1() {
    const data = this.dailydiemform.get('data') as FormArray;
    data.push(this.createnewitemarray());
    console.log(this.dailydiemform.value.data)
  }

  indexdelete(i) {
    let ind = this.pageSize * (this.p - 1) + i;
    const control = <FormArray>this.dailydiemform.controls['data'];
    control.removeAt(ind)
  }

  getcityValue() {
    this.taservice.getcitylist('', this.expname, this.employee_grade, 1)
      .subscribe(result => {
        this.citylist = result['data']
        console.log("Reason", this.citylist)
      })
  }


  citysearch(ind) {

    let i = this.pageSize * (this.p - 1) + ind;

    (this.dailydiemform.get('data') as FormArray).at(i).get('city').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          // this.isLoading = true;
        }),
        switchMap(value => this.taservice.getcitylist(value, this.expname, this.employee_grade, 1))
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
              this.taservice.getcitylist(this.inputasset.nativeElement.value, this.expname, this.employee_grade, this.has_presentid + 1).subscribe(data => {
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


  minselect(ind) {
    this.maximum = this.end_date;
    if (ind == 0) {
      return this.start_date;
    }
    else if (this.dailydiemform.value.data[ind - 1].todate != null) {
      return this.dailydiemform.value.data[ind - 1].todate;

    }
    else {
      return this.maximum
    }
  }

  maxselect(ind) {
    this.maximum = this.end_date;
    // console.log('i',ind)
    let formdata = this.dailydiemform.value.data
    // console.log("form valuesss", formdata)
    if (this.dailydiemform.value.data[ind].fromdate == null) {

      // console.log("formdata[ind].fromdate", formdata[ind].fromdate)
      return this.maximum
    }
    else {
      // console.log("else")
      // return this.dailydiemform.value.data[ind].fromdate
      console.log("FROM DATETIME", this.dailydiemform.get('data')['controls'][ind].get('fromdate').value)
      return this.dailydiemform.get('data')['controls'][ind].get('fromdate').value
    }

  }
  invaliddatestart(ind) {
    var length = this.dailydiemform.value.data.length
    let myform = (this.dailydiemform.get('data') as FormArray).at(ind)
    myform.patchValue({
      todate: null
    })
    if (length > ind) {
      for (var i = ind + 1; i < length; i++) {
        let valuecheck = (this.dailydiemform.get('data') as FormArray).at(i).value;
        let changeform = (this.dailydiemform.get('data') as FormArray).at(i)
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

  datechange(ind) {
   
    let myform = (this.dailydiemform.get('data') as FormArray).at(ind)
    let dateform = (this.dailydiemform.get('data') as FormArray).at(ind).value
    let val = new Date(this.dailydiemform.get('data')['controls'][ind].get('fromdate').value);
    let check = new Date(this.dailydiemform.get('data')['controls'][ind].get('todate').value);
    if (val > check) {
      this.notification.showError("To Date should be greater than From Date");
      this.dailydiemform.get('data')['controls'][ind].get('todate').value = ''
    }
    

    myform.patchValue({
      lodgcheckoutdate: dateform.todate
    })
    this.invaliddateend(ind);
  }

  invaliddateend(ind) {
    var length = this.dailydiemform.value.data.length
    if (length > ind) {

      for (var i = ind + 1; i < length; i++) {
        let valuecheck = (this.dailydiemform.get('data') as FormArray).at(i).value;
        let changeform = (this.dailydiemform.get('data') as FormArray).at(i)
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

  geteligibleamount(i) {


    if (this.centerarray.length >= 1) {
      this.centerarray.splice(0, this.centerarray.length)
    }

    let ind = this.pageSize * (this.p - 1) + i;
    if (this.dailydiemform.value.data[ind].accbybank == '1' && this.dailydiemform.value.data[ind].boardingbybank == '1') {

      this.dailydiemform.get('data')['controls'][ind].get('declaration').setValue('0')

    }


    console.log("INDDD", ind)
    const detailframe = this.dailydiemform.value.data[ind]
    let val = typeof (+detailframe.isleave)

    // if(detailframe.accbybank==1 && detailframe.boardingbybank==1 ){

    //   const def=(this.dailydiemform.get('data') as FormArray).at(ind)
    //   def.patchValue({
    //     "declaration":0,
    //   })
    // }



    if (detailframe.tourgid && detailframe.fromdate && detailframe.todate && detailframe.city && val === 'number' && detailframe.isleave !== "") {
      this.centerarray = {
        city: detailframe.city,
        accbybank: detailframe.accbybank,
        boardingbybank: detailframe.boardingbybank,
        declaration: detailframe.declaration,
        isleave: detailframe.isleave,
        fromdate: detailframe.fromdate,
        todate: detailframe.todate,
        fromtime:detailframe.fromtime,
        totime:detailframe.totime,
        tourgid: detailframe.tourgid,

      }
      console.log('ecnterarray', this.centerarray)
    }
    else {
      return false;

    }



    this.centerarray.fromdate = this.datePipe.transform(this.centerarray.fromdate, 'yyyy-MM-dd');
    this.centerarray.todate = this.datePipe.transform(this.centerarray.todate, 'yyyy-MM-dd');
    // this.spinnerservice.show()

    if (detailframe.tourgid && detailframe.fromdate && detailframe.todate && detailframe.city) {
      this.spinnerservice.show()
      this.taservice.dailydeimligibleamt(this.centerarray)
        .subscribe(result => {

          console.log("resutl", result)
          let eligible = result['Eligible_amount']
          let sys_hours = result['sys_hours']
          const myform = (this.dailydiemform.get('data') as FormArray).at(ind)
          myform.patchValue({
            "eligibleamount": eligible,
            "syshours": sys_hours,
          })
          this.spinnerservice.hide()

        })

    }
  }

  submitapi(data) {
    this.spinnerservice.show()
    this.taservice.DailydiemCreate(data)
      .subscribe(res => {
        console.log("dailydeimres", res)
        this.spinnerservice.hide()
        if (res.message === "Successfully Created" && res.status === "success" || res.message === "Successfully Updated" && res.status === "success") {
          this.notification.showSuccess("Successfully Created")
          this.back(); //BUG 8211 FIX *30/03/2023 Harikrishnan
          // this.onSubmit.emit();
          return true;
        }

        else {
          this.notification.showError(res.description)
          return false;
        }
      }
      )
  }

  submitfunction() {
    if (this.submitarray.length >= 1) {
      // this.submitarray.splice(0, this.submitarray.length)
      this.submitarray = []
    }
    console.log('array before', this.submitarray)


    this.submitarray = this.dailydiemform.value.data

    console.log('array after', this.submitarray)



    for (let i = 0; i < this.submitarray.length; i++) {

      if (this.submitarray[i].city == null || this.submitarray[i].city == '') {
        this.notification.showError('Please Select City')
        throw new Error
      }

      if (this.submitarray[i].fromdate == null || this.submitarray[i].fromdate == '') {
        this.notification.showError('Please Choose From Date')
        throw new Error
      }
      if (this.submitarray[i].todate == null || this.submitarray[i].todate == '') {
        this.notification.showError('Please Choose To Date')
        throw new Error
      }
      if (this.submitarray[i].todate < this.submitarray[i].fromdate) {
        this.notification.showError('To Date and Time Should be Greater than From Date and Time')
        throw new Error
      }
      if (this.submitarray[i].noofhours === null || this.submitarray[i].noofhours === '') {
        this.notification.showError('Please Enter No of Hours')
        throw new Error

      }
      if (this.number_test(this.submitarray[i].noofhours) != 0) {
        this.notification.showError('Please Enter No of Hours in Numbers not Decimals')
        throw new Error

      }



      if (this.submitarray[i].isleave === null || this.submitarray[i].isleave === '') {

        this.notification.showError('Please Enter Leave')
        throw new Error

      }
      if (this.submitarray[i].claimedamount == null || this.submitarray[i].claimedamount == '' || this.submitarray[i].claimedamount == 0) {
        this.notification.showError('Please Enter Claimed Amount')
        throw new Error
      }
      if (this.submitarray[i].accbybank == null || this.submitarray[i].accbybank == '') {
        this.notification.showError('Please Select Accomodation Provided by Bank')
        throw new Error
      }
      if (this.submitarray[i].boardingbybank == null || this.submitarray[i].boardingbybank == '') {
        this.notification.showError('Please Select Boarding Provided by Bank')
        throw new Error
      }
      if (this.submitarray[i].declaration == null || this.submitarray[i].declaration == '') {
        this.notification.showError('Please Enter Declaration')
        throw new Error
      }



      //validation over
      if (this.submitarray[i].claimedamount) {
        this.submitarray[i].claimedamount = JSON.parse(this.submitarray[i].claimedamount)
      }
      if (this.submitarray[i].fromdate) {
        this.submitarray[i].fromdate = this.datePipe.transform(this.submitarray[i].fromdate, 'yyyy-MM-dd ');
      }
      if (this.submitarray[i].todate) {
        this.submitarray[i].todate = this.datePipe.transform(this.submitarray[i].todate, 'yyyy-MM-dd ');
      }
      if(this.shareservice.TA_Ap_Exp_Enb_type.value){
        if (this.submitarray[i].gstno == null || this.submitarray[i].gstno == '' || this.submitarray[i].gstno==undefined) {
          // this.notification.showError('Please Enter Valid GST No..')
          // throw new Error
        }
        else {
          let regex = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
          if(regex.test(this.submitarray[i].gstno)==false){
            this.notification.showError('Invalid GST No Format..');
            throw new Error
          }
        }
        // if (this.submitarray[i].invoicedate == null || this.submitarray[i].invoicedate == '' || this.submitarray[i].invoicedate==undefined) {
        //   // this.submitarray[i].invoicedate= this.datePipe.transform(this.submitarray[i].invoicedate, 'yyyy-MM-dd');
        //   this.notification.showError('Please Select The Invoice Date..');
        //   throw new Error
        // }
        // if (this.submitarray[i].invoiceno == null || this.submitarray[i].invoiceno == '' || this.submitarray[i].invoiceno==undefined) {
        //   this.notification.showError('Please Enter The Valid Invoice No..')
        //   throw new Error
        // }
      }
    }

    let obj = {
      data: this.submitarray
    }
    let ta_data_list:Array<any>=[];
    console.log('apiobj', obj)
   if(this.shareservice.TA_Ap_Exp_Enb_type.value){
    for(let data_ta of this.submitarray){
      let a:object={
        'id':data_ta['id'],
        'tourid':data_ta['tourgid'],
        'gstno':data_ta['gstno'],
        'expenseid':data_ta['expenseid'],
        'invoice_date':this.datePipe.transform(data_ta.invoicedate, 'yyyy-MM-dd'),
        'invoice_no':data_ta['invoiceno']
      }
      ta_data_list.push(a);
    }
    let ta_obj_be:any={"data":ta_data_list};
    console.log('apuser',ta_obj_be)
    this.spinnerservice.show();
  this.taservice.Submitapuser(ta_obj_be)
    .subscribe(res => {
      console.log("dailydeimres", res)
      this.spinnerservice.hide()
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
      this.submitapi(obj)
    }

    


  }

  getpatchdeclare(i) {
    let ind = this.pageSize * (this.p - 1) + i;

    if (this.dailydiemform.value.data[ind].accbybank == '1' && this.dailydiemform.value.data[ind].boardingbybank == '1') {

      this.dailydiemform.get('data')['controls'][ind].get('declaration').setValue('0')

    }




  }

  existingdata(data) {

    this.spinnerservice.show()
    this.taservice.getdailydiemeditSummary(data, this.report)
      .subscribe(results => {
        this.spinnerservice.hide();
        console.log('existing data', results)
        let datas = results['data']
        let variable = results['requestercomment']
        console.log(results)
        for (let i = 0; i < datas.length; i++) {

          let array = this.formBuilder.group({
            id: datas[i]['id'],
            tourgid: datas[i]['tourgid'],
            expenseid: 2,
            city: datas[i]['city'],
            fromdate: this.datePipe.transform(datas[i]['fromdate'], 'yyyy-MM-dd'),
            todate: this.datePipe.transform(datas[i]['todate'], 'yyyy-MM-dd'),
            totime:datas[i]['totime']?datas[i]['totime']:"",
            fromtime:datas[i]['fromtime']?datas[i]['fromtime']:"",
            syshours: datas[i]['syshours'],
            noofhours: datas[i]['noofhours'],
            isleave: datas[i]['isleave'],
             //Bug 8418 Fix ** Starts ** Developer: Hari ** Date:25/04/2023
            // eligibleamount: new FormControl({ value: datas[i]['eligibleamount'] }),
            eligibleamount: datas[i]['eligibleamount'],
             //Bug 8418 Fix ** Starts ** Developer: Hari ** Date:25/04/2023
            claimedamount: datas[i]['claimedamount'],
            accbybank: datas[i]['accbybank']['value'].toString(),
            boardingbybank: datas[i]['boardingbybank']['value'].toString(),
            declaration: datas[i]['declaration']['value'].toString(),
            requestercomment: variable,
            approvedamount: datas[i]['approvedamount'],
            gstno:datas[i]['gstno']?datas[i]['gstno']:"",
            invoiceno:datas[i]['invoiceno']?datas[i]['invoiceno']:"",
            invoicedate:datas[i]['invoicedate']?datas[i]['invoicedate']:"",
          })
          // if (this.maker) {
          //   delete array['approvedamount']
          // }
          const docu = this.dailydiemform.get('data') as FormArray;
          docu.push(array)

        }


        if (!this.transferreason) {
          if (this.dailydiemform.value.data.length == 0) {
            this.adddata()
          }
        }
        else {
          if (this.dailydiemform.value.data.length == 0) {
            this.adddata1()
          }
        }



        
      });
  }


  approverupdate(tourno, expid, approvearray) {
    this.taservice.approver_amountupdate(tourno, expid, approvearray)
      .subscribe(res => {
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

  Approve() {
    this.approverarray.splice(0, this.approverarray.length)

    for (let i = 0; i < this.dailydiemform.value.data.length; i++) {
      let json = {
        "id": this.dailydiemform.value.data[i].id,
        "amount": JSON.parse(this.dailydiemform.value.data[i].approvedamount),
      }
      this.approverarray.push(json)

    }
    this.approverupdate(this.dailydiemform.value.tourno, 2, this.approverarray)
  }

  limit(e, i) {
    let ind = this.pageSize * (this.p - 1) + i;
    let val = e.target.value
    let check = this.dailydiemform.value.data[ind].syshours
    if (Number(val) > Number(check)) {
      e.target.value = ''
    }
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

  nospacewithperiod(e) {
    if (e.code === 'Space' || e.code == 'Period') {
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

  number_test(n) {
    var result = (n - Math.floor(n)) !== 0;

    if (result)
      return 'Please enter No of Hours in Number not Decimal';
    else
      return 0
    // return 'It is a whole number.';
  }

  //Bug 8368 Fix ** Starts ** Developer: Hari ** Date:25/04/2023
  onKeyDown(event: KeyboardEvent) {
    if (event.key === '-') {
      event.preventDefault();
    }
  }
  kyenbdata(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(d.test(event.key)==true){
      return false;
    }
    return true;
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
      this.dailydiemform.get('data')['controls'].at(ind).get(controlname).setValue(null)
    }

  }
   numberOnlywithcolon(event: any) {
    return (event.charCode >= 48 && event.charCode <= 57) || event.key === ':';
  }


  datechanges(ind) {
    ind = ((this.p - 1) * this.pageSize) + ind
    let myform = this.dailydiemform.value.data[ind];
    let expform = (this.dailydiemform.get('data') as FormArray).at(ind)
    if (myform.fromdate.getDate() == myform.todate.getDate()) {
      expform.patchValue({
        totime: null
      })
    }
    // this.invaliddatestart(ind);
  }
  totimechange(ind, totime) {
    ind = this.pagesize * (this.p - 1) + ind;
    let myform = this.dailydiemform.value.data[ind]
    if (myform.fromdate && myform.todate) {
      if (myform.fromdate < myform.todate) {

      }
      else if (myform.fromdate >= myform.todate) {
        let index = this.timelist.findIndex((item) => item.name === myform.fromtime);
        let index2 = this.timelist.findIndex((item) => item.name === totime.value);
        if (!(index2 > index)) {
          this.notification.showError('Kindly Select Time from the given dropdown')
          this.dailydiemform.get('data')['controls'].at(ind).get('totime').setValue(null)
        }
      }
    }
    this.onOptionSelected(totime.value, ind);

  }
  // numberOnlywithcolon(event: any) {
  //   return (event.charCode >= 48 && event.charCode <= 57) || event.key === ':';
  // }
  
  totimesdd(ind,totime) {
    ind = this.pageSize * (this.p - 1) + ind;
    this.totimelist  = []
    let myform = this.dailydiemform.value.data[ind]
    let time = myform.fromtime;
    let fromdate =this.datePipe.transform(new Date(myform.fromdate),"yyyy-MM-dd");
    let todate =this.datePipe.transform(new Date(myform.todate),"yyyy-MM-dd");
    if (time && fromdate >= todate) {
      let index = this.timelist.findIndex((item) => item.name === time)
      let arr = this.timelist;
      var list = arr.slice(index + 1)
      list = list.filter(function (element) {
        return element.name.includes(totime?.value)
      })
      return list;
    }
    else if (fromdate < todate) {
      var timelist = this.timelist
      return timelist.filter(function (element) {
        return element.name.includes(totime?.value)
      })
    }
    else {
      return []
    }
  }
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
  geteligibleamount_datechanges(i){
    this.geteligibleamount(i);
    this.datechanges(i);
    }
    get formData() {
      return this.dailydiemform.get('data') as FormArray;
    }
    onOptionSelected(selectedValue: string, ind: number) {
      ind = this.pageSize * (this.p - 1) + ind;
      const control = this.formData.at(ind).get('totime');
      control.setValue(selectedValue);
      this.cdr.detectChanges(); // Ensure change detection is triggered
    }
}
