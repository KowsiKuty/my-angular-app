import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { LocalStorage } from '@ng-idle/core';
import { NotificationService } from '../notification.service'
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { TaService } from '../ta.service';
import { Router } from '@angular/router';
import { ShareService } from 'src/app/ta/share.service';

@Component({
  selector: 'app-ta-recovery',
  templateUrl: './ta-recovery.component.html',
  styleUrls: ['./ta-recovery.component.scss']
})
export class TaRecoveryComponent implements OnInit {

  @ViewChild('assetid') matassetidauto: any;
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger
  @ViewChild('empc') matemp:any;
  @ViewChild('emp') emp:any;
  recoveryform:FormGroup
  page: any = 1;
  has_nextemp: boolean = true;
  has_previousemp: boolean = true;
  has_presentemp: any = 1
  branchlist: any;
  branchid: any=null;
  currentpage = 1;
  pagesize = 10;
  employeelist: any;
  isLoading: boolean;
  summarylist: any[] = [];
  has_next = false;
  has_previous= false;
  isTourChecker: boolean=true;
  branchcode: any=null;
  payload: { Employee_code: string; Employee_gid: string; Branch_code: string; Branch_gid: string; Invoice_No: string;Invoice_crno: string; };
  empid: any =null;
  empcode: any=null;
  has_presentid: number = 1;
  has_nextid: boolean = true;
  has_previousemps = false;
  emplyeeid: any;
  isbranch:boolean
  firstscreen: boolean=false;
  secondscreen: boolean=false;
  monoscreen: boolean=true;
  expenceform: FormGroup;
  id: any=null
  tourgid: any;
  reason: any;
  startdate: any;
  requestdate: any;
  employee_code: any;
  employee_name: any;
  empdesignation: any;
  empgrade: any;
  advancedetail: any[] = [];
  claimedamt: Number;
  approvedamt: number;
  reasonchange: any = null;
  ccbslist: any;
  itemdisable: boolean;
  status_id: any;
  balance_amount: any;
  jv_entry_id: any;
  Jv_approve: boolean = false;
  recovery_maker: boolean = false;
  recovery_checker: boolean = false;
  crno: any;
  constructor(private fb:FormBuilder, public taservice :TaService,private route:Router,private notification :NotificationService,
    private spinnerservice: NgxSpinnerService, private shareservice: ShareService) {
   }

  ngOnInit(): void {
    this.recoveryform = this.fb.group({
      invoiceno:[''],Invoice_crno:[''],
      branch:[''],
      employee:['']
    })
    this.expenceform = this.fb.group({
      tourgid: this.id,
      appcomment: null,
      empbranchid: null,
      approvedby: null,
      approval: null,
      action: null,
      brnid:null,
      ccbs: new FormArray([this.createccbs()
      ])
    })
    this.recovery_checker = this.shareservice.Recovery_checker.value
    this.recovery_maker = this.shareservice.Recovery_maker.value
    let employee = JSON.parse(localStorage.getItem('sessionData'))
    // let recoveryid = JSON.parse(localStorage.getItem('recovery'))
    // this.branchid=recoveryid
    // if(recoveryid=="259"){
    this.isbranch= true
    // }
    // else{
    //   this.isbranch= false
    // }
    let empid = employee.employee_id;
    // this.taservice.getemployeedetail().s
    this.payload ={ "Employee_code": "", "Employee_gid": "", "Branch_code":
    "", "Branch_gid": "", "Invoice_No": "" ,"Invoice_crno":""}
    this.recoverysummary(this.payload);
    this.branchslist();
    this.recoveryform.get('employee').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.taservice.getemployeevaluechanges('0',value?value:'',1))
    )
    .subscribe((results: any[]) => {
      this.isLoading = false;
      let datas = results['data'];
      this.employeelist = datas;
      if(this.branchid==null){
        this.employeelist  = []
      }
      console.log("Employee List", this.employeelist)
    });

    this.recoveryform.get('branch').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.taservice.getUsageCode(value, 1))
        )
        .subscribe((results: any[]) => {
          this.isLoading = false;
          let datas = results["data"];
          this.branchlist = datas;
          
          console.log("Branch List", this.branchlist)
        });
 
        this.recoveryform.get('employee').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.taservice.getemployeevaluechanges(this.branchid ? this.branchid:'0',value?value:'',1))
        )
        .subscribe((results: any[]) => {
          this.isLoading = false;
          let datas = results['data'];
          this.employeelist = datas;
          // if(this.branchid==null){
          //   this.employeelist  = []
          // }
          console.log("Employee List", this.employeelist)
        });
      
  }

  omit_special_char(event)
  {   
     var k;  
     k = event.charCode;  //         k = event.keyCode;  (Both can be used)
     return((k > 64 && k < 91) || (k == 46) || (k == 44) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  }

  selectBranch(e) {
    console.log("e", e.value)
    let branchvalue = e.id
    this.branchid = branchvalue
    this.branchcode =  e.code;
    this.recoveryform.patchValue({
      "employee": undefined
    })
  }
  selectbranch(){
    this.taservice.getemployeevaluechanges(this.branchid ? this.branchid:'0','',1)
    .subscribe((results) => {
      let datas = results['data'];
          this.employeelist = datas;
    })
  }
  displayFn(subject) {
    return subject ?subject.full_name : undefined;
  }

  brclear(event){
   (<HTMLInputElement>document.getElementById("inputassetid")).value=null;
   (<HTMLInputElement>document.getElementById("emplid")).value=null;
   this.branchid = null;
   this.branchcode= null;
   this.empid = null;
   this.empcode = null;
   this.employeelist=[]

  }
  empclear(){
    (<HTMLInputElement>document.getElementById("emplid")).value=null
    this.empid = null;
    this.empcode = null;
  }
  selectemployee(emp){
    this.empid = emp.id
    this.empcode = emp.code
  }
  recoverysearch(){
    this.payload.Branch_code = this.branchcode;
    this.payload.Employee_code=this.empcode
    this.payload.Branch_gid = this.branchid;
    this.payload.Employee_gid= this.empid
    this.payload.Invoice_No = this.recoveryform.value.invoiceno
    this.payload.Invoice_crno=this.recoveryform.value.Invoice_crno
    
    this.recoverysummary(this.payload);
  }

  recoverysummary(payload){
    this.spinnerservice.show()
    this.taservice.recoverysum(payload).subscribe(results =>{
      this.spinnerservice.hide()
      let data = results;
      if (this.monoscreen) {
        this.summarylist = results['DATA']
      }
      else {
      this.summarylist = results['data']
      }
    })
  }

  jventry(sum){
    this.spinnerservice.show()
    if (this.monoscreen){
      let payload = {
        'crnno': sum.invoiceheader_crno,
        'balanceamt': sum.ppxheader_balance
      }
      this.taservice.recoveryedit(payload) 
      .subscribe(res => {
        this.spinnerservice.hide()
        console.log("incires", res)
        if (res.status === "success") {
          this.notification.showSuccess("Success....")                                   
          // this.route.navigateByUrl('ta/ta-recovery');
          return true;
        }else {
          this.notification.showError(res.description)
          return false;
        }
      })
    }
    else{
    let payload = {
      "tour_id": sum.tour_id,
      "amount": sum.Balance_Amount
    }
    this.taservice.recoveryedit(payload) 
    .subscribe(res => {
      console.log("incires", res)
      if (res.status === "success") {
        this.notification.showSuccess("Success....")                                   
        // this.route.navigateByUrl('ta/ta-recovery');
        return true;
      }else {
        this.notification.showError(res.description)
        return false;
      }
    })
  }
  }

  branchslist(){
    this.taservice.getUsageCode('', 1).subscribe(result =>{
      let data = result['data'];
      this.branchlist = data;
    })
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

            if (this.has_nextemp) {
              this.taservice.getbranchvalues(this.has_presentemp).subscribe(data => {
                let dts = data['data'];
                console.log('h--=', data);
                console.log("SS", dts)
                console.log("GGGgst", this.branchlist)
                let pagination = data['pagination'];
                this.branchlist = this.branchlist.concat(dts);

                if (this.branchlist.length > 0) {
                  this.has_nextemp = pagination.has_next;
                  this.has_previousemp = pagination.has_previous;
                  this.has_presentemp = pagination.index;

                }
              })
            }
          }
        })
      }
    })
  }

  autocompleteemps() {
    setTimeout(() => {
      if (this.matemp && this.autocompletetrigger && this.matemp.panel) {
        fromEvent(this.matemp.panel.nativeElement, 'scroll').pipe(
          map(x => this.matemp.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.matemp.panel.nativeElement.scrollTop;
          const scrollHeight = this.matemp.panel.nativeElement.scrollHeight;
          const elementHeight = this.matemp.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_nextid) {
              this.taservice.getonbehalfemployeepage(this.branchid, this.has_presentid + 1).subscribe(data => {
                let dts = data['data'];
                let pagination = data['pagination'];
                this.employeelist = this.employeelist.concat(dts);

                if (this.employeelist.length > 0) {
                  this.has_nextid = pagination.has_next;
                  this.has_previousemps = pagination.has_previous;
                  this.has_presentid = pagination.index;

                }
              })
            }
          }
        })
      }
    })
  }

  nextpage(){

  }

  previouspage(){

  }

  reset(){
    // this.recoveryform.patchValue({
    //   "invoiceno":null,
    //   "branch":null,
    //   "employee":null
    // })
    // this.branchcode=null;
    // this.branchid =null;
    // this.empid = null;
    // this.empcode = null;
    this.recoveryform.reset();
    let payload ={ 'Employee_code': null, 'Employee_gid':null, 'Branch_code': null, 'Branch_gid':null, 'Invoice_No': null}
   
    this.recoverysummary(payload)

  }
  createccbs() {
    let group = this.fb.group({
      id: 0,
      bsid: null,
      ccid: '',
      amount: null,
      tourgid: this.id,
      percentage: null,
    });
    return group;
  }
  reasonupdate(event) {
    this.reasonchange = event.target.value;
  }
  approve(){
    let jv_payload = {
      'tour_id': this.tourgid,
      'jv_entry_id': this.jv_entry_id,
      'description': this.reasonchange
    }
    this.taservice.recovery_jv_approve(jv_payload).subscribe(result =>{
      console.log("incires", result)
      if (result.status === "success") {
        this.notification.showSuccess("Success....")                                   
        this.back()
        return true;
      }else {
        this.notification.showError(result.description)
        return false;
      }
    })
  }
  back(){
    this.secondscreen = false;
    this.firstscreen = false;
    this.monoscreen = true;
    this.recoverysummary(this.payload);
  }
  jv_maker(value){
    this.id = value.tour_id;
    this.advancedetail = [value];
    this.firstscreen = false;
    this.secondscreen = false;
    this.monoscreen = true;
    this.tourgid = value.tour_id;
    this.reason = value.reason;
    this.startdate = value.startdate;
    this.requestdate = value.end_date;
    this.employee_code = value.Employee_Code;
    this.employee_name = value.Employee;
    this.empdesignation = value.empdesignation;
    this.empgrade = value.empgrade;
    this.balance_amount = value.Balance_Amount;
    this.jv_entry_id = value.jv_entry_id
    if (this.jv_entry_id == 0){
      this.Jv_approve = false;
    }
    else{
      this.Jv_approve = true;
    }

    this.taservice.getclaimccbsEditview(this.id).subscribe(result => {
      this.ccbslist = result;
      this.itemdisable = true;
      console.log("the edit",this.ccbslist)
      const length = result.length;
      // (this.expenceform.get('ccbs') as FormArray).clear()
    const myform = (this.expenceform.get('ccbs') as FormArray)
    for (var i = 1; i < length; i++) {
      myform.push(this.createccbs())

    }
    result.forEach(element => {
      element.ccid = element.cc_data.name;
      element.bsid = element.bs_data.name;
    });
    const ccbsform = this.expenceform
    ccbsform.patchValue({
      ccbs: result
    })
    if (length > 0) {
      if (this.status_id != -1 && this.status_id != 5) {
        (this.expenceform.get('ccbs') as FormArray)
        this.itemdisable = true;
      }
    }
  })
  }
}
