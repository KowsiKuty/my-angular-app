import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray, NgForm } from '@angular/forms';
import { map, takeUntil, startWith, debounceTime, distinctUntilChanged, tap, switchMap, finalize } from 'rxjs/operators';
import { Observable, fromEvent } from 'rxjs';
import { filter, } from 'rxjs/operators';
import { isBoolean } from 'util';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
// import { formatDate } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { ShareService } from 'src/app/ta/share.service';
import { TaService } from "../ta.service";
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { flattenDiagnosticMessageText } from 'typescript';
import { MY_FORMATS } from 'src/app/SGmodule/sgmster/sgmster.component';
import { COMMA, E, ENTER, V } from '@angular/cdk/keycodes';


// import { error } from 'console';
// import { error } from 'console';
export const PICK_FORMATS = {
  parse: { dateInput: "l,LTS" },
  display: {
    dateInput: 'l,LTS',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
    enableMerdian:true
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
interface permission {
  id: number;
  Name: string;
}
interface reason {
  id: number;
  Name: string;
}
interface ticketby {
  id: number;
  Name: string;
}








@Component({
  selector: 'app-traveling-expence',
  templateUrl: './traveling-expence.component.html',
  styleUrls: ['./traveling-expence.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class TravelingExpenceComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger
  @ViewChild('hsncodeid') hsncodeset: any;
  @ViewChild('hsnid') hsnidauto: MatAutocomplete;
  @ViewChild('gstcodetid') gstcodeset: any;
  @ViewChild('gstid') gstidauto: MatAutocomplete;
  @Output() expense_navigate_n=new EventEmitter<any>();

  has_nextid: boolean = true;
  has_presentid: number = 1;
  has_nexthsnid: boolean = true;
  has_presenthsnid: number = 1;
  has_nextgstid: boolean = true;
  has_presentgstid: number = 1;


  gstList: any
  myControl = new FormControl();
  form: FormGroup;
  // options: string[] = [this.gstList];
  filteredOptions: Observable<string[]>;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  traveling: any
  travelingform: FormGroup
  expenseid: any
  exptype: any
  applevel: number = 0;
  comm: any
  depaturedate: any
  offcurrentpage: number = 1;
  enddate: any
  p = 1;
  currentpage: number = 1;
  pagesize = 10;
  pageSize = 10
  datecopy: any
  travelmodelist: Array<any>
  Traveldepaturedate: any
  Travelarrivaldate: any
  dailyid: any
  tourno: any
  classtravelmodelist: any;
  road: any;
  air: any;
  train: any;
  sea: any;
  classtravel: any;
  tourdatas: string;
  show_gstpercent: boolean = false
  show_gstpercentage: boolean = false
  gstshow: boolean = false
  approver: boolean = false;
  employeename: any;
  employeegrade: any;
  employeedesignation: any;
  id: any;
  dependencies :any =[]
  claimid: any;
  expenceid: string;
  approveamount: any;
  depatureplace: any;
  placeofvisit: any
  totaltkttamt: number
  tktbybank: any
  actualtravel: any
  highermodereasons: any
  priorpermission: any
  highermodeopted: any
  classoftravel: any
  dependentgid: any
  eligibletravel: any
  noofdependents: any
  tourreq_no:any
  claimedamount: number
  vendorname: any
  vendorcode: any
  hsnList: any;
  ishidden: boolean = false
  has_offnext = true;
  gst: any;
  vendor: any;
  yesnoList: any;
  tktrefno: any;
  show_button: boolean = true
  ttime: any;
  fdt: string;
  tdt: string;
  dependList: any;
  appamount: any;
  vendorgstno: any;
  cgst: Number
  igst: number
  sgst: number
  value: any;
  gstdata: any;
  newvalue: string;
  arrivaldate: any;
  array: any = [];
  paginationedit: boolean = false;
  isLoading: boolean;
  branchdata: any;
  formChangesSubscription: any;
  results: Observable<any>;
  reason: any;
  maximum: any;
  startdate: any;
  isonbehalf: boolean = false;
  onbehalf_empName: string;
  newform: boolean;
  eligibleclass: void;
  onbehalfid: Number = 0;
  approvedamount: Number = 0;
  airtravellist: any;
  roadtravellist: any;
  seatravellist: any;
  traintravellist: any;
  dependentavailable: boolean = false;
  dependentcheck:boolean =  false;
  fielddisable:boolean=true;
  applist: any[];
  statusid: any;
  dependent:FormControl
  report: any;
  traveldependent:any =[]
  dp = 1
  enb_all_exbdetails:boolean=false;
  gst_no: boolean=false;
  ap:any;
  apuser_key: boolean = false;
  bank_gst: Number = 0;
  validate_gst: boolean = false;

  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private http: HttpClient, private shareservice: ShareService,
    private taservice: TaService, private notification: NotificationService, private router: Router,private SpinnerService: NgxSpinnerService) {

  }


  ngOnInit(): void {
   this.ap='ap_verify'
    let expensetype = JSON.parse(localStorage.getItem('expense_edit'));
    let expensedetails = JSON.parse(localStorage.getItem('expense_details'))?JSON.parse(localStorage.getItem('expense_details')):JSON.parse(localStorage.getItem('expense_edit'));
    // this.report =expensedetails.report
  

    this.report = expensedetails?.report;
    if(this.shareservice.TA_Ap_Exp_Enb_type.value){
      this.enb_all_exbdetails=true;
      // this.approver=true;
      this.show_button=false;
    }
    else{
      this.enb_all_exbdetails=false;
    }
    this.employeename = '(' + expensedetails.employee_code + ') ' + expensedetails.employee_name
    this.employeegrade = expensedetails['empgrade']?expensedetails['empgrade']:expensedetails['emp_grade'];
    this.employeedesignation = expensedetails['empdesignation']?expensedetails['empdesignation']:expensedetails['designation']
    this.comm = expensetype.requestercomment;
    this.exptype = expensetype.expenseid
    this.reason = expensedetails.reason_id;
    this.startdate = this.datePipe.transform(expensedetails.startdate, 'yyyy-MM-dd');
    // this.startdate = this.datePipe.transform(expensedetails.startdate, 'yyyy-MM-ddThh:mm');
    this.enddate = this.datePipe.transform(expensedetails.enddate, 'yyyy-MM-dd');
    // this.enddate = this.datePipe.transform(expensedetails.enddate, 'yyyy-MM-ddThh:mm');
    this.statusid = expensedetails.claim_status_id;
    if (expensedetails.applevel) {
      this.applevel = expensedetails.applevel
    }
    
    this.expenseid = expensedetails.tourid?expensedetails.tourid:expensedetails.id;
    this.tourreq_no = expensedetails.requestno;
    if (expensedetails.onbehalfof) {
      this.isonbehalf = true;
      this.onbehalfid = expensedetails.empgid;
      this.onbehalf_empName = '(' + expensedetails.employee_code + ') ' + expensedetails.employee_name
      console.log("onbehalf_empName", this.onbehalf_empName)

    } else {
      this.isonbehalf = false;
    }
    if (expensedetails.applevel == 2 || expensedetails.applevel == 1) {
      this.isonbehalf = false;
      this.expenseid =expensedetails.tourid?expensedetails.tourid:expensedetails.id;
      this.approver = true;
    }

    if (expensetype.status == 'REQUESTED') {
      this.newform = false;
    }
    if(this.statusid == 3 || this.statusid == 4|| this.statusid == 2){
      this.approver = true;
    }
    if(this.shareservice.TA_Ap_Exp_Enb_type.value){
      this.apuser_key = true;
      this.taservice.gettravelingeditSummary(this.expenseid,this.report,this.ap).subscribe(res =>{
        let travellist = res['data'];
        this.bank_gst = res['branch_gst']
        var length = travellist.length;
        for (var i =0;i<length ;i++){
          delete travellist[i].claimreqid;
          delete  travellist[i].exp_name;
          delete travellist[i].exp_id
          if (i >0){
            this.addSection();
          }
          travellist[i].tktbybank = String(travellist[i].tktbybank.value)
          travellist[i].actualtravel = String(travellist[i].actualtravel.value)
          travellist[i].classoftravel = String(travellist[i].classoftravel.value)
          travellist[i].priorpermission = String(travellist[i].priorpermission.value)
          travellist[i].depaturedate=travellist[i]['depaturedate']?this.datePipe.transform(travellist[i].depaturedate,'yyyy-MM-dd'):'';
          travellist[i].arrivaldate = travellist[i]['arrivaldate']?this.datePipe.transform(travellist[i].arrivaldate,'yyyy-MM-dd'):'';
          travellist[i].depaturetime = travellist[i].depaturetime;
          travellist[i].arrivaltime = travellist[i].arrivaltime
          travellist[i].gstno=travellist[i]['gstno']?travellist[i][i]['gstno']:"",
          travellist[i].gstno=travellist[i]['gst_no']?travellist[i]['gst_no']:"",
          // travellist[i].gstno=travellist[i]['gst_no']?travellist[i][i]['gst_no']:"",
          travellist[i].invoiceno=travellist[i]['invoiceno']?travellist[i]['invoiceno']:"",
          travellist[i].invoiceno=travellist[i]['invoice_no']?travellist[i]['invoice_no']:"",
          travellist[i].invoicedate=travellist[i]['invoicedate']?travellist[i]['invoicedate']:""
          travellist[i].invoicedate=travellist[i]['invoice_date']?this.datePipe.transform(travellist[i].invoice_date,'yyyy-MM-dd'):'';
          travellist[i].address=travellist[i]['address']?travellist[i]['address']:"";
          travellist[i].taxableamount=travellist[i]['taxable_amount']?travellist[i]['taxable_amount']:"";
          travellist[i].cgst=travellist[i]['cgst']?travellist[i]['cgst']:"";
          travellist[i].sgst=travellist[i]['sgst']?travellist[i]['sgst']:"";
          travellist[i].igst=travellist[i]['igst']?travellist[i]['igst']:"";
          travellist[i].invoiceamount=travellist[i]['invoice_amount']?travellist[i]['invoice_amount']:"";
          travellist[i].vendorname=travellist[i]['vendorname']?travellist[i]['vendorname']:"";
          travellist[i].bankgstno=res['branch_gst']?res['branch_gst']:"";
          // this.travelingform.patchValue({invoiceno:travellist[i].invoice_no})
          // this.travelingform.patchValue({gstno:travellist[i].gst_no})
          // this.travelingform.patchValue({invoicedate:travellist[i].invoice_date})
          if(travellist[i].dependencies){
            this.traveldependent = this.traveldependent.concat(travellist[i].dependencies)
          }
          
        
        }
        if(travellist.length != 0){
          
          
        this.travelingform.patchValue({
          data: travellist
        
        })
      }
      })
  
      this.travelingform = this.formBuilder.group({
        data: new FormArray([
          this.createItem(),
  
        ]),
        // data: new FormArray([]),.
      })
  
    }
    else{
    this.taservice.gettravelingeditSummary(this.expenseid,this.report,'').subscribe(res =>{
      let travellist = res['data'];
      this.bank_gst = res['branch_gst']
      var length = travellist.length;
      for (var i =0;i<length ;i++){
        delete travellist[i].claimreqid;
        delete  travellist[i].exp_name;
        delete travellist[i].exp_id
        if (i >0){
          this.addSection();
        }
        travellist[i].tktbybank = String(travellist[i].tktbybank.value)
        travellist[i].actualtravel = String(travellist[i].actualtravel.value)
        travellist[i].classoftravel = String(travellist[i].classoftravel.value)
        travellist[i].priorpermission = String(travellist[i].priorpermission.value)
        travellist[i].depaturedate=travellist[i]['depaturedate']?this.datePipe.transform(travellist[i].depaturedate,'yyyy-MM-dd'):'';
          travellist[i].arrivaldate = travellist[i]['arrivaldate']?this.datePipe.transform(travellist[i].arrivaldate,'yyyy-MM-dd'):'';
          travellist[i].depaturetime = travellist[i].depaturetime;
          travellist[i].arrivaltime = travellist[i].arrivaltime

        // travellist[i].depaturedate= this.datePipe.transform(travellist[i].depaturedate,'yyyy-MM-ddTHH:mm');
        // travellist[i].arrivaldate = this.datePipe.transform(travellist[i].arrivaldate,'yyyy-MM-ddTHH:mm');
        // travellist[i].depaturetime = this.datePipe.transform(travellist[i].arrivaldate,'yyyy-MM-ddTHH:mm');
        // travellist[i].arrivaltime = this.datePipe.transform(travellist[i].arrivaldate,'yyyy-MM-ddTHH:mm');
        travellist[i].gstno=travellist[i]['gstno']?travellist[i][i]['gstno']:"",
        travellist[i].gstno=travellist[i]['gst_no']?travellist[i]['gst_no']:"",
        // travellist[i].gstno=travellist[i]['gst_no']?travellist[i][i]['gst_no']:"",
        travellist[i].invoiceno=travellist[i]['invoiceno']?travellist[i]['invoiceno']:"",
        travellist[i].invoiceno=travellist[i]['invoice_no']?travellist[i]['invoice_no']:"",
        travellist[i].invoicedate=travellist[i]['invoicedate']?travellist[i]['invoicedate']:""
        travellist[i].invoicedate=travellist[i]['invoice_date']?this.datePipe.transform(travellist[i].invoice_date,'yyyy-MM-dd'):'';
        travellist[i].address=travellist[i]['address']?travellist[i]['address']:"";
        travellist[i].taxableamount=travellist[i]['taxable_amount']?travellist[i]['taxable_amount']:0;
        travellist[i].cgst=travellist[i]['cgst']?travellist[i]['cgst']:0;
        travellist[i].sgst=travellist[i]['sgst']?travellist[i]['sgst']:0;
        travellist[i].igst=travellist[i]['igst']?travellist[i]['igst']:0;
        travellist[i].invoiceamount=travellist[i]['invoice_amount']?travellist[i]['invoice_amount']:0;
        travellist[i].bankgstno=res['branch_gst']?res['branch_gst']:"";
        // this.travelingform.patchValue({invoiceno:travellist[i].invoice_no})
        // this.travelingform.patchValue({gstno:travellist[i].gst_no})
        // this.travelingform.patchValue({invoicedate:travellist[i].invoice_date})
        if(travellist[i].dependencies){
          this.traveldependent = this.traveldependent.concat(travellist[i].dependencies)
        }
        
      
      }
      if(travellist.length != 0){
        
        
      this.travelingform.patchValue({
        data: travellist
      
      })
    }
    else {
      let myform = (this.travelingform.get('data') as FormArray).at(0)
      myform.patchValue({bankgstno: res['branch_gst']})
      }
    })

    this.travelingform = this.formBuilder.group({
      data: new FormArray([
        this.createItem(),

      ]),
      // data: new FormArray([]),
    })
  }

    this.gettravelMode();
    this.getbustravel();
    this.gettrainitravel();
    this.getairtravel();
    this.getseatravel();
    this.gethsncode();
    this.getgstcode();
    this.getyesno();
    this.getdepend()
    this.createtime();

  }
  hsnsearch(ind) {
    ind = ((this.p-1)*this.pageSize)+ind;
    (this.travelingform.get('data') as FormArray).at(ind).get('hsncode').valueChanges
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
    ind = ((this.p-1)*this.pageSize)+ind;
    (this.travelingform.get('data') as FormArray).at(ind).get('bankgstno').valueChanges
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

  numberOnly(event) {
    return (event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46)
  }

  omit_special_char(event, ind) {
    var k;
    this.validate_gst = false;
    let myform = (this.travelingform.get('data') as FormArray).at(ind)
        myform.patchValue({vendorname: '', vendorcode: '', address: ''})
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  fieldGlobalIndex(index) {
    let dat = this.pageSize * (this.p - 1) + index;
    return dat
  }

  entergst_check(ind) {
    ind = ((this.p-1)*this.pageSize)+ind
    let myform = (this.travelingform.get('data') as FormArray).at(ind).value
    return myform.entergst;
  }
  entergst(event, ind) {
    ind = ((this.p-1)*this.pageSize)+ind
    let myform1 = (this.travelingform.get('data') as FormArray).at(ind)
    myform1.patchValue({
      bankgstno: event.target.value
    })
  }
  newgst(ind) {
    ind = ((this.p-1)*this.pageSize)+ind
    let myform1 = (this.travelingform.get('data') as FormArray).at(ind)
    myform1.patchValue({
      entergst: true
    })
  }

  gst_calc(ind) {
    ind = ((this.p-1)*this.pageSize)+ind
    let myform = (this.travelingform.get('data') as FormArray).at(ind).value
    let myform1 = (this.travelingform.get('data') as FormArray).at(ind)
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
        "igst": 0,
        "cgst": 0,
        "sgst": 0,
        "cgstp": 0,
        "sgstp": 0,
        "invoiceamount": tax_amt
      })
    }
  }

  dependents(ind){
    ind = ((this.p-1)*this.pageSize)+ind

    let myform = this.travelingform.value.data[ind].dependencies
    return myform
  }
  onToppingRemoved(topping: string, ind) {
    ind = ((this.p-1)*this.pageSize)+ind
    const toppings = this.travelingform.value.data[ind].dependencies as string[];
    this.removeFirst(toppings, topping);

    const myform = (this.travelingform.get('data') as FormArray).at(ind)
    myform.patchValue({
      dependencies:toppings
    }) // To trigger change detection
  }
  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }


  hsnshow(subject) {
    return subject ? subject.code : undefined;
  }

  checkigst(ind) {
    ind = ((this.p-1)*this.pageSize)+ind
    let myform = (this.travelingform.get('data') as FormArray).at(ind).value
    if (myform.igst != 0) {
      return true;
    }
    else {
      return false;
    }
  }
  checkscgst(ind) {
    ind = ((this.p-1)*this.pageSize)+ind
    let myform = (this.travelingform.get('data') as FormArray).at(ind).value
    if (myform.cgst != 0 || myform.sgst != 0) {
      return true;
    }
    else {
      return false;
    }

  }

  dependshow(){
    this.dependentcheck=true
  }
  minselect(ind) {
    ind = ((this.p-1)*this.pageSize)+ind
    this.maximum = this.enddate;
    if (ind == 0) {
      return this.startdate;
    }
    else if (this.travelingform.value.data[ind - 1].arrivaldate != null){
      return this.travelingform.value.data[ind - 1].arrivaldate;
    }
    else{
      return this.maximum
    }
  }
  invaliddatestart(ind) {
    ind = ((this.p-1)*this.pageSize)+ind
    var length = this.travelingform.value.data.length
    let myform = (this.travelingform.get('data') as FormArray).at(ind)
    myform.patchValue({
      arrivaldate: null
    })
    if (length > ind) {
      for (var i = ind + 1; i < length; i++) {
        let valuecheck = (this.travelingform.get('data') as FormArray).at(i).value;
        let changeform = (this.travelingform.get('data') as FormArray).at(i)
        if (valuecheck.depaturedate != null || valuecheck.arrivaldate != null) {
          this.notification.showError('Invalid Dates in table row at ' + (i + 1))
          changeform.patchValue({
            "depaturedate": null,
            "arrivaldate": null,
         
          })
        }

      }
    }
  }
  maxselect(ind) {
    ind = ((this.p-1)*this.pageSize)+ind
    this.maximum = this.enddate;
    if (this.travelingform.value.data[ind].depaturedate == null) {
      return this.maximum;
    }
    else {
      return this.travelingform.value.data[ind].depaturedate
    }

  }
  

  selection(ind){

  }

  tktcheck(ind) {
    ind = ((this.p-1)*this.pageSize)+ind
    let bill = this.travelingform.value.data.at(ind).tktbybank;
    if (bill == '1') {
      return true;
    }
    else {
      this.travelingform.value.data.at(ind).tktrefno = 0;
      return false;
    }
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
  

  createItem() {
    let group = this.formBuilder.group({
      dependencies:null,
      requestercomment: this.comm,
      expenseid: 1,
      tourid: this.expenseid,
      id: 0,
      claimedamount:null,
      depaturedate: null,
      depaturetime:null,
      depatureplace:null,
      arrivaldate: null,
      arrivaltime:null,
      placeofvisit: null,
      totaltkttamt: 0,
      tktrefno: 0,
      tktbybank: '0',
      actualtravel: null,
      eligibletravel: new FormControl({value:this.eligibleclass, disabled:true}),
      highermodereasons: "0",
      priorpermission: "0",
      highermodeopted: "0",
      classoftravel: null,
      noofdependents: 0,
      hsncode: '',
      vendorname: '',
      vendorcode: '',
      bankgstno: this.bank_gst,
      taxableamount: 0,
      invoiceamount: 0,
      address: '',
      vendorgstno: new FormControl("",[Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")]),
      igst: 0,
      cgst: 0,
      sgst: 0,
      igstp: 0,
      cgstp: 0,
      sgstp: 0,
      
      entergst: false,
      approvedamount: 0,
      gstno:new FormControl("",[Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")]),
      invoicedate:null,
      invoiceno:null
    });

    return group;
  }
  addSection() {
    const data = this.travelingform.get('data') as FormArray;
    data.push(this.createItem());
  }
  ticket(e) {
    this.value = e
    console.log("e", this.value)
    if (this.value == "yes") {
      this.ishidden = true
    }
    else if (this.value == "no") {
      this.ishidden = false
    }
  }
  getdepend() {
    this.taservice.eligibletravel(this.expenseid).subscribe(res => {
      this.eligibleclass = res.travelclass
      console.log(res.travelclass)
    });
    this.taservice.getdepend(this.onbehalfid)
      .subscribe(res => {
        this.dependList = res['DATA']
        if(this.dependList.length > 0)[
          this.dependentavailable = true
        ]
        console.log("dependentlist", this.dependList)
      })
  }
  getyesno() {
    this.taservice.getyesno()
      .subscribe(res => {
        this.yesnoList = res
        console.log("yesnoList", this.yesnoList)
      })
  }
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

 

  gettravelMode() {
    this.taservice.gettravelMode()
      .subscribe(result => {
        this.travelmodelist = result
        this.road = result[0].name
        this.train = result[1].name
        this.air = result[2].name
        this.sea = result[3].name
        console.log("travelmodelist", this.travelmodelist)
      })
  }
 
  classt(ind){
    ind = ((this.p-1)*this.pageSize)+ind
    let myform = this.travelingform.value.data[ind].actualtravel
    if(myform =='Air'){
      return this.airtravellist;
    }
    else if(myform =='Road'){
      return this.roadtravellist;
    }
    else if(myform == 'Train'){
      return this.traintravellist;
    }
    else if(myform =='Sea'){
      return this.seatravellist;
    }
    else{
      return []
    }

  }

  getairtravel(){
    this.taservice.getairtravelMode()
    .subscribe(result => {
      this.airtravellist = result
    })
  }
  getseatravel(){
    this.taservice.getseatravelMode()
        .subscribe(result => {
          this.seatravellist = result
          
        })
  }
  gettrainitravel(){
    this.taservice.gettraintravelMode()
        .subscribe(result => {
          this.traintravellist = result
        })
  }
  getbustravel(){
    this.taservice.getroadtravelMode()
    .subscribe(result => {
      this.roadtravellist = result
      })
  }

  // removeSection(ind) {
  //   (<FormArray>this.travelingform.get('data')).removeAt(ind);
  // }
  removeSection(i) {
    if (this.travelingform.value.data[i].id == undefined || this.travelingform.value.data[i].id == null || this.travelingform.value.data[i].id ==''){
      let ind = this.pageSize * (this.p - 1) + i;
      const control = <FormArray>this.travelingform.controls['data'];
      control.removeAt(ind)
    }
    else {
      this.SpinnerService.show()
      this.taservice.deletetraveldeleteSummary(this.travelingform.value.data[i].id)
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
            const control = <FormArray>this.travelingform.controls['data'];
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
  submitForm() {

    let travellist = this.travelingform.value.data;
    for(let i=0;i<this.travelingform.value.data.length;i++){
    if(this.travelingform.value.data[i].vendorgstno!=''){
      // if (this.travelingform.value.data[i].vendorgstno == null || this.travelingform.value.data[i].vendorgstno == '' || this.travelingform.value.data[i].vendorgstno==undefined) {
      //   this.notification.showError('Please Enter Valid VENDOR GST No..')
      //   console.log('Please Enter Valid VENDOR GST No')
      //   throw new Error
      // }
      // let regex = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
      // if(regex.test(this.travelingform.value.data[0].vendorgstno)==false){
      //   this.notification.showError('Invalid VENDOR GST No Format..');
      //   throw new Error
      // }
      if (this.validate_gst == false){
        this.notification.showError('Please validate VENDOR GST No');
        throw new Error
      }
    }
  }
   
    travellist.forEach(element => {
      delete element.entergst
      //  let parse=new Date(element.depaturedate);
      //  let parseat=new Date(element.arrivaldate)
      element.depaturedate = this.datePipe.transform(element.depaturedate , 'yyyy-MM-dd');
      element.arrivaldate = this.datePipe.transform(element.arrivaldate , 'yyyy-MM-dd');
      element.invoicedate=this.datePipe.transform(element.invoicedate, 'yyyy-MM-dd')
      if(element.depaturedate > element.arrivaldate)
      {
        this.notification.showError("Arrival Date and Time should be less than Departure Date and Time ")
        throw new Error
      }

      if (element.depaturedate == null || element.depaturedate == ''){
        // element.depaturedate=this.datePipe.transform(data_ta.invoicedate, 'yyyy-MM-dd')
        this.notification.showError("Please Select Departure Date and Time")
        throw new Error
      }
      if (element.depatureplace == null || element.depatureplace == ''){
        this.notification.showError("Please Enter Departure Place")
        throw new Error
      }
      if (element.arrivaldate == null || element.arrivaldate == ''){
        this.notification.showError("Please Select Arrival Date and Time")
        throw new Error
      }
      let index = this.timelist.findIndex((item) => item.name === element.arrivaltime);
      if(index ==-1){
        this.notification.showError('Kindly Select Arrival Time from the given dropdown')
        throw new Error
      }
      // if (element.arrivaldate.toISOString() < element.depaturedate.toISOString()) {
      //   this.notification.showError("Arrival Date and Time Should be Greater than Departure Date and time")
      //   throw new Error
      // } 

      if (element.placeofvisit == null || element.placeofvisit == ''){
        this.notification.showError("Please Enter Place Of Visit")
        throw new Error
      }
      if (element.totaltkttamt == null || element.totaltkttamt == ''){
        this.notification.showError("Please Enter Total Ticket Amount")
        throw new Error
      }
      if (element.totaltkttamt == 0){
        this.notification.showError("Total Ticket Amount should be greater than Zero")
        throw new Error
      }
      if (element.tktbybank == '1' && (element.tktrefno == null || element.tktrefno == 0)){
        this.notification.showError("Please Enter Tiket Reference Number")
        throw new Error
      }
      if (element.actualtravel == null || element.actualtravel == ''){
        this.notification.showError("Please Select Actual Mode of Travel")
        throw new Error
      }
      if (element.classoftravel == null || element.classoftravel == ''){
        this.notification.showError("Please Select Class of Travel")
        throw new Error
      }
      // if(element.hsncode == null || element.hsncode == ''){
      //   this.notification.showError("please Select the Hsn code");
      //   throw new Error
      // }
      // if(element.bankgstno == null || element.bankgstno == ''){
      //   this.notification.showError("please Select the Bank Gst No");
      //   throw new Error
      // }
      // if(element.vendorgstno == null || element.vendorgstno == ''){
      //   this.notification.showError("please Enter the Vendor gst no");
      //   throw new Error
      // }
      if (element.highermodereasons === '1' && (element.highermodeopted == null || element.highermodeopted == "" || element.highermodeopted == 0)) {   
   
          this.notification.showError('Please Enter Who Has Opted Higher Mode');
          throw new Error('');
        
      }

      if (element.highermodereasons === '1' && element.priorpermission == '0' ) {   
   
        this.notification.showError('Please Check Prior Permisson Taken For Higher Mode of Travel');
        throw new Error('');
      
    }
    if (element.highermodereasons === '0' && element.priorpermission == '1' ) {   
   
      this.notification.showError('Please Check Higher Mode Opted Due To Personal Reason of Exigencies*');
      throw new Error('');
    
  }
  if (element.invoiceamount < element.claimedamount) {
    this.notification.showError("Invoice Amount must be greater than or equal to claim amount")
    throw new Error
  }
    
  // if(element.gstno == null || element.gstno == '' || element.gstno == undefined){
  //   this.notification.showError('Please select the Gst No');
  //   throw new Error;
  // }

  // if(element.invoicedate == null || element.invoicedate == '' || element.invoicedate == undefined){
  //   this.notification.showError('Please select the Invoice date');
  //   throw new Error;
  // }
  // if(element.invoiceno == null || element.invoiceno == '' || element.invoiceno == undefined){
  //   this.notification.showError('Please select the Invoice Number')
  //   throw new Error;
  // }

      if(element.dependencies == null){
        element.dependencies = []
      }
      else{
        // element.dependencies.forEach(element => {
        //   delete element.FamilyMemberDOB
        //   delete element.FamilyMemberDependent
        //   delete element.FamilyMemberId
        //   delete element.FamilyMemberName
        //   delete element.FamilyMemberRelation
        // });
      }
      if ((element.noofdependents == null || element.noofdependents == '') && element.dependencies.length > 0){
        this.notification.showError("Please Enter Number Of Dependents")
        throw new Error
      }
      element.claimedamount =Number(element.claimedamount)
    if (element.claimedamount == ''){
      this.notification.showError("Please Enter Claim Amount")
      throw new Error
    }
    if(element.id == 0){
      delete element.id
    }
    if (element.hsncode){
      element.hsncode = element.hsncode.code
    }
    if(this.shareservice.TA_Ap_Exp_Enb_type.value){
      if (element.gstno == null || element.gstno == '' || element.gstno==undefined) {
        // this.notification.showError('Please Enter Valid GST No..')
        // throw new Error
      }
      else {
        let regex = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
        if(regex.test(element.gstno)==false){
          this.notification.showError('Invalid GST No Format..');
          throw new Error
        }
      }
      // if (element.invoicedate == null || element.invoicedate == '' || element.invoicedate==undefined) {
      //   // element.invoicedate
      //   this.notification.showError('Please Select The Invoice Date..')
      //   throw new Error
      // }
      // if (element.invoiceno == null || element.invoiceno == '' || element.invoiceno==undefined) {
      //   this.notification.showError('Please Enter The Valid Invoice No..')
      //   throw new Error
      // }
    }
    });

    let payload = {
      "data":travellist
    }
    let ta_data_list:Array<any>=[];
    if(this.shareservice.TA_Ap_Exp_Enb_type.value){
      for(let data_ta of travellist){
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
      this.taservice.TravelingCreate(payload)
        .subscribe(res => {
          console.log("resss", res)
          if (res.message === "Successfully Created" && res.status === "success" || res.message === "Successfully Updated" && res.status === "success") {
            this.notification.showSuccess("Successfully Created")
            this.onSubmit.emit();
            this.back(); //BUG 8211 FIX *30/03/2023 Harikrishnan
            this.SpinnerService.hide()
            return true;
          }
          else {
            this.notification.showError(res.description)
            this.SpinnerService.hide()
          }
        }
        )
    }
   

  }
  ApproveForm(){
    this.applist=[];
console.log("form-app",this.travelingform.value)
for(var i=0;i<this.travelingform.value.data.length;i++){
  let json = {
    "id": this.travelingform.value.data[i].id,
    "amount": this.travelingform.value.data[i].approvedamount,
    "gst_no": this.travelingform.value.data[i].vendorgstno,
    "vendor_name": this.travelingform.value.data[i].vendorname,
    "invoice_no": this.travelingform.value.data[i].invoiceno,
    "invoice_date": this.datePipe.transform(this.travelingform.value.data[i].invoicedate, 'yyyy-MM-dd'),
    "vendor_code": this.travelingform.value.data[i].vendorcode,
    "vendor_address": this.travelingform.value.data[i].address,
    "hsn_code": this.travelingform.value.data[i].hsncode.code,
    "taxable_amount": this.travelingform.value.data[i].taxableamount,
    "Cgst": this.travelingform.value.data[i].cgst,
    "Sgst": this.travelingform.value.data[i].sgst,
    "Igst": this.travelingform.value.data[i].igst,
    "invoice_amount": this.travelingform.value.data[i].invoiceamount
     
  }
  this.applist.push(json)
}
for(var i=0;i<this.applist.length;i++){
  this.applist[i].amount = JSON.parse(this.applist[i].amount)
  
}
console.log("createdlist",this.applist)
this.SpinnerService.show()
this.taservice.approver_amountupdate(this.expenseid,1,this.applist)
    .subscribe(res => {
      console.log("incires", res)
      if (res.status === "success") {
        this.SpinnerService.hide()
        this.notification.showSuccess("Success....")
        this.onSubmit.emit();
        this.router.navigateByUrl('ta/exapprove-edit')
        return true;
      }else {
        this.notification.showError(res.description)
        
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
  back() {
    if(this.applevel == 0){
      if(this.shareservice.TA_Ap_Exp_Enb_type.value!=null && this.shareservice.TA_Ap_Exp_Enb_type.value!=false && this.shareservice.TA_Ap_Exp_Enb_type.value!="" && this.shareservice.TA_Ap_Exp_Enb_type.value!=undefined){
        this.expense_navigate_n.emit();
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
  // createtime() {
  //   for (var j = 0; j < 24; j++) {
  //     let i = String(j).padStart(2, '0')
  //     var t00 = { 'name': i + ':00' }
  //     var t15 = { 'name': i + ':15' }
  //     var t30 = { 'name': i + ':30' }
  //     var t45 = { 'name': i + ':45' }
  //     this.timelist.push(t00)
  //     this.timelist.push(t15)
  //     this.timelist.push(t30)
  //     this.timelist.push(t45)
  //   }
  //   this.timeclone = this.timelist;
  //   console.log("time",this.timeclone)
  // }
  // createtime() {
  //   for (let j = 0; j < 24; j++) {
  //     let i = String(j).padStart(2, '0');
      
  //     let hour12 = (j % 12 === 0) ? 12 : j % 12;
  //     let period = (j < 12) ? 'AM' : 'PM';
      
  //     var t00 = { 'name': hour12 + ':00 ' + period };
  //     var t15 = { 'name': hour12 + ':15 ' + period };
  //     var t30 = { 'name': hour12 + ':30 ' + period };
  //     var t45 = { 'name': hour12 + ':45 ' + period };
      
  //     this.timelist.push(t00);
  //     this.timelist.push(t15);
  //     this.timelist.push(t30);
  //     this.timelist.push(t45);
  //   }
  //   this.timeclone = this.timelist;
  //   console.log("time", this.timeclone);
  // }
  
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
      // this.notification.showError('Kindly Select Time from the given dropdon')
      this.travelingform.get('data')['controls'].at(ind).get(controlname).setValue(null)
    }

  }
  numberOnlywithcolon(event: any) {
    return (event.charCode >= 48 && event.charCode <= 57) || event.key === ':';
  }

  
  datechange(ind) {
    ind = ((this.p - 1) * this.pageSize) + ind
    let myform = this.travelingform.value.data[ind];
    let expform = (this.travelingform.get('data') as FormArray).at(ind)
    if (myform.depaturedate.getDate() == myform.arrivaldate.getDate()) {
      expform.patchValue({
        arrivaltime: null
      })
    }
    // this.invaliddatestart(ind);
  
  }
  

    

  
    





totimechange(ind, totime) {
  ind = this.pagesize * (this.p - 1) + ind;
  let myform = this.travelingform.value.data[ind]
  if (myform.depaturedate && myform.arrivaldate) {
    if (myform.depaturedate < myform.arrivaldate) {

    }
    else if (myform.depaturedate >= myform.arrivaldate) {
      let index = this.timelist.findIndex((item) => item.name === myform.depaturetime);
      let index2 = this.timelist.findIndex((item) => item.name === totime.value);
      if (!(index2 > index)) {
        this.notification.showError('Kindly Select Time from the given dropdown')
        this.travelingform.get('data')['controls'].at(ind).get('arrivaltime').setValue(null)
      }
    }
  }
}

totimes(ind, totime) {
  ind = this.pageSize * (this.p - 1) + ind;
  this.totimelist = []
  let myform = this.travelingform.value.data[ind]
  let time = myform.depaturetime;
  let arrivaldate=this.datePipe.transform(new Date(myform.arrivaldate),"yyyy-MM-dd");
  let depaturedate=this.datePipe.transform(new Date(myform.depaturedate),"yyyy-MM-dd");

  if (time && depaturedate >= arrivaldate) {
    let index = this.timelist.findIndex((item) => item.name === time)
    let arr = this.timelist;
    var list = arr.slice(index + 1)
    list = list.filter(function (element) {
      return element.name.includes(totime.value)
    })
    return list;
  }
  else if (depaturedate < arrivaldate) {
    var timelist = this.timelist
    return timelist.filter(function (element) {
      return element.name.includes(totime.value)
    })
  }
  else {
    return []
  }
}

  
   
    onfocus(index: number) {
      let dataFormArray = this.travelingform.get('data') as FormArray;
      let vendorgstnoValue = dataFormArray.at(index).get('vendorgstno').value;
      
      dataFormArray.at(index).get('gstno').patchValue(vendorgstnoValue);

    }
    // timeregx(event) {
    //   const inputElement = event.target;
    //   let inputValue = inputElement.value.replace(/\D/g, ''); // Remove non-numeric characters
    
    //   // Ensure the hours part doesn't exceed 23
    //   const hours = inputValue.slice(0, 2);
    //   if (parseInt(hours, 10) > 23) {
    //     hours = '23';
    //   }
    
    //   // Ensure the minutes part doesn't exceed 59
    //   let minutes = inputValue.slice(2, 4);
    //   if (parseInt(minutes, 10) > 59) {
    //     minutes = '59';
    //   }
    
    //   // Create the formatted value (HH:mm)
    //   const formattedValue = hours + ':' + minutes;
    
    //   // Update the input value and move the cursor positions
    //   inputElement.value = formattedValue;
    
    //   // If the cursor was positioned at the end, keep it at the end
    //   if (cursorPosition === inputValue.length) {
    //     inputElement.setSelectionRange(cursorPosition, cursorPosition);
    //   } else {
    //     // Update the cursor position while preserving the colon
    //     inputElement.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
    //   }
    // }
    


  
  // timeregx(event){
  //   const inputElement = event.target;
  //   const inputValue = inputElement.value.replace(/\D/g, ''); // Remove non-numeric characters
  //   const cursorPosition = inputElement.selectionStart; // Get the cursor positions
  //   if (inputValue.length > 2) {
  //     // Add colons after the first two digits
  //     const formattedValue = inputValue.slice(0, 2) + ':' + inputValue.slice(2);
  //     // Update the input value and move the cursor positions
  //     inputElement.value = formattedValue;
  //     inputElement.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
  //   } else {
  //     inputElement.value = inputValue;
  //   }

  // }
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
    let myform = (this.travelingform.get('data') as FormArray).at(ind).value
    this.SpinnerService.show()
    this.taservice.gst_validate(myform.vendorgstno).subscribe(response => {
      this.SpinnerService.hide()
      let gst_details = response
      if (gst_details.validation_status == false) {
        let myform = (this.travelingform.get('data') as FormArray).at(ind)
        myform.patchValue({vendorname: '', vendorcode: '', address: ''})
        this.notification.showError('Please Enter Valid GST No')
        return false;
      }
      this.validate_gst = true
      let vendor_name = gst_details.validation_status.tradeNam
      let vendor_code = gst_details.validation_status.ctjCd
      let vendor_address = gst_details.validation_status.pradr.addr.bno + ',' + gst_details.validation_status.pradr.addr.st + ',' + gst_details.validation_status.pradr.addr.loc + ',' + gst_details.validation_status.pradr.addr.stcd + ',' + gst_details.validation_status.pradr.addr.pncd
      let myform = (this.travelingform.get('data') as FormArray).at(ind)
      myform.patchValue({vendorname: vendor_name, vendorcode: vendor_code, address: vendor_address})
    })
  } 




    
  
}

