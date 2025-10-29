import { Component, OnInit, Output, EventEmitter,ViewChild,ElementRef } from '@angular/core';
import { Router } from '@angular/router'
import { Observable, fromEvent, } from 'rxjs'
import { masterService } from '../master.service'
import { ShareService } from '../share.service'
import { NotificationService } from '../../service/notification.service'
import { SharedService } from '../../service/shared.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from '../../service/data.service'
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Department, MemoService } from '../../ememo/memo.service'
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
export interface emppaymode {
  id: string;
  name: string;
}
export interface empbank {
  id: string;
  name: string;
}
export interface branch {
  id: string;
  name: string;
}
export interface employee {
  id: string;
  full_name: string
  code:string
}
export interface type {
  id: string;
  text: string
}
export interface empbranch{
  id:string;
  codename:string
}
@Component({
  selector: 'app-branch-bank-add',
  templateUrl: './branch-bank-add.component.html',
  styleUrls: ['./branch-bank-add.component.scss']
})
export class BranchBankAddComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  has_paynxt: boolean = true;
  type: Object = { 1: 'Employee', 2: 'Branch' }
  type_reverse: Object = { 'Employee': 1, 'Branch': 2 }
  has_paypre: boolean = false;
  createbranch: boolean = true;
  has_paypage: number = 1;
  has_banknxt: boolean = true;
  has_bankpre: boolean = false;
  has_bankpage: number = 1;
  has_branchnxt: boolean = true;
  has_branchpre: boolean = false;
  readonly: boolean = false;
  isLoading: boolean = false;
  has_branchpage: number = 1;
  isBranchbank: boolean;
  isBranchbankForm: boolean;
  urlbranchbank: string;
  emppaycodelist: Array<any> = [];
  paymodelist: Array<any>=[]
  banknamelist: Array<any> = [];
  branchnamelist: Array<any> = [];
  emplist: Array<any> = [];
  ref_type_list: Array<any> = [];
  branchbank_id: number;
  empbranchnamelist:Array<any>=[];
  has_empbranchpage:number=1;
  has_empbranchpre:boolean=false;
  has_empbranchnxt:boolean=false;
  employee:boolean=false;
  employeebranch:boolean=false;
  branchbankForm: any = FormGroup;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('payemp') matPay: MatAutocomplete;
  @ViewChild('payinput') payInput;
  @ViewChild('bankemp') matBank: MatAutocomplete;
  @ViewChild('bankinput') bankInput;
  @ViewChild('branchemp') matBranch: MatAutocomplete;
  @ViewChild('branchinput') branchInput;
  @ViewChild('emploeeauto') matemp: MatAutocomplete;
  @ViewChild('empinput') empinput;
  @ViewChild('typemat') typemat: MatAutocomplete;
  @ViewChild('typeinput') typeinput;
  @ViewChild('empbranchinfo') matempbranchname:MatAutocomplete
  @ViewChild('empbranInput') matempbranchinput:ElementRef;
  constructor(private router: Router, private notification: NotificationService, private mastersErvice: masterService,
    private spinner: NgxSpinnerService, private dataServices: DataService, private formBuilder: FormBuilder,
    private shareService: ShareService, private sharedService: SharedService) { }


  ngOnInit(): void {
    this.branchbankForm = this.formBuilder.group({
      'type': ['', Validators.required],
      'paymode': ['', Validators.required],
      'branchname': ['', Validators.required],
      'bankname': ['', Validators.required],
      'accountno': ['', Validators.required],
      'benifiencyname': ['', Validators.required],
      'employee': ['', Validators.required],
      'empbranch':['',Validators.required]
    });
    this.get_emp_dropdown("")
    this.get_ref_type_list()
    this.employee_branchdrop()
    let branchbank = this.sharedService.BranchbankEditValue.value;
    let readonlyval = this.sharedService.branchreadonly.value;
    console.log('readolnynum', readonlyval);
    console.log(branchbank)
    if (branchbank != undefined && branchbank != '' && branchbank != null && branchbank['id'] != "" && branchbank['id'] != undefined) {
      this.branchbank_id = branchbank['id'];
      this.createbranch = false;
      if(this.sharedService.BranchbankEditValue.value['type'].text=='Employee'){
      this.branchbankForm.patchValue({
        'type': {'id': branchbank['type']['id'], 'text': branchbank['type']['text']},
        'paymode': { "id": branchbank['paymode']['id'], "name": branchbank['paymode']['name'] },
        'branchname': { "id": branchbank['bankbranch']['id'], "name": branchbank['bankbranch']['name'] },
        'bankname': { "id": branchbank['bank']['id'], "name": branchbank['bank']['name'] },
        'accountno': branchbank['account_no'],
        'benifiencyname': branchbank['accountholder'],
        'employee':{'id':branchbank['employee']['id'],'code':branchbank['employee']['code'],'full_name':branchbank['employee']['full_name'],} ,
        // 'empbranch':{"id":branchbank["employeebranch"]["id"],"codename":branchbank["employeebranch"]["codename"]}
       })
     }
     else{
      this.branchbankForm.patchValue({
        'type': {'id': branchbank['type']['id'], 'text': branchbank['type']['text']},
        'paymode': { "id": branchbank['paymode']['id'], "name": branchbank['paymode']['name'] },
        'branchname': { "id": branchbank['bankbranch']['id'], "name": branchbank['bankbranch']['name'] },
        'bankname': { "id": branchbank['bank']['id'], "name": branchbank['bank']['name'] },
        'accountno': branchbank['account_no'],
        'benifiencyname': branchbank['accountholder'],
        // 'employee':{'id':branchbank['employee']['id'],'code':branchbank['employee']['code'],'full_name':branchbank['employee']['full_name'],} ,
        'empbranch':{"id":branchbank["employeebranch"]["id"],"codename":branchbank["employeebranch"]["codename"]}
      })
    }
  }
  else{
    this.createbranch = true;
  }
    if (readonlyval == 2) {
      this.readonly = true;
    }
    else {
      this.readonly = false;
    }
    // if (branchbank != undefined && branchbank != '' && branchbank != null && branchbank['id'] != "" && branchbank['id'] != undefined) {
    //   this.branchbank_id = branchbank['id'];
    //   this.createbranch = false;
      
      // this.branchbankForm.patchValue({
      //   'type': {'id': branchbank['type']['id'], 'text': branchbank['type']['text']},
      //   'paymode': { "id": branchbank['paymode']['id'], "name": branchbank['paymode']['name'] },
      //   'branchname': { "id": branchbank['bankbranch']['id'], "name": branchbank['bankbranch']['name'] },
      //   'bankname': { "id": branchbank['bank']['id'], "name": branchbank['bank']['name'] },
      //   'accountno': branchbank['account_no'],
      //   'benifiencyname': branchbank['accountholder'],
      //   'employee':{'id':branchbank['employee']['id'],'code':branchbank['employee']['code'],'full_name':branchbank['employee']['full_name'],} ,
      //   'empbranch':{"id":branchbank["employeebranch"]["id"],"codename":branchbank["employeebranch"]["codename"]}
      // })
    // }
    // else {
    //   this.createbranch = true;
    // }
    
    if(this.branchbankForm.get('type').value.text ==='Branch'){
      this.employeebranch=true;  
      this.employee=false;    
    }else if(this.branchbankForm.get('type').value.text ==='Employee'){
      this.employee=true;
      this.employeebranch=false;
    }
    else{
      this.employee=false;
      this.employeebranch=false;
    }


    // this.branchbankForm.get('paymode').valueChanges.pipe(
    //   debounceTime(2000),distinctUntilChanged(),
    //   tap(()=>{
    //     this.isLoading =true;
    //   }),
    //   switchMap(value =>this.mastersErvice.getemppaydropdown(value,1)
    // .pipe(
    //   finalize(()=>{
    //     this.isLoading=false;
    //   }),
    // ))
    // ).subscribe((res:any)=>{
    //   this.emppaycodelist = res['data'];
    // })


    // this.branchbankForm.get('bankname').valueChanges.pipe(
    //   debounceTime(2000),distinctUntilChanged(),
    //   tap(()=>{
    //     this.isLoading =true;
    //   }),
    //   switchMap(value =>this.mastersErvice.getempbankdropdown(value,1)
    // .pipe(
    //   finalize(()=>{
    //     this.isLoading=false;
    //   }),
    // ))
    // ).subscribe((res:any)=>{
    //   this.banknamelist = res['data'];
    // })

    this.branchbankForm.get('branchname').valueChanges.pipe(
      debounceTime(2000),distinctUntilChanged(),
      tap(()=>{
        this.isLoading =true;
      }),
      switchMap(value =>this.mastersErvice.getempbranchdropdown(this.branchbankForm.get('bankname').value.id ,value,1)
    .pipe(
      finalize(()=>{
        this.isLoading=false;
      }),
    ))
    ).subscribe((res:any)=>{
      this.branchnamelist = res['data'];
    })



    this.branchbankForm.get('empbranch').valueChanges.pipe(
      debounceTime(2000),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value =>this.mastersErvice.getempbranchedrop(value,1)
      .pipe(
        finalize(()=>{
          this.isLoading=false;
        }),
      ))
    ).subscribe((res:any)=>{
      this.empbranchnamelist=res['data']
    })
    this.branchbankForm.get('employee').valueChanges.pipe(
      debounceTime(2000),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value =>this.mastersErvice.get_Emp_List(value,1)
      .pipe(
        finalize(()=>{
          this.isLoading=false;
        }),
      ))
    ).subscribe((res:any)=>{
      this.emplist=res['data']
    })
  }
  public getemppaymodeinterface(data?: emppaymode): string | undefined {
    return data ? data.name : undefined;
  }
  public getempbanknameinterface(data?: empbank): string | undefined {
    return data ? data.name : undefined;
  }
  public getbranchinterface(data?: branch): string | undefined {
    return data ? data.name : undefined;
  }
  public getemployeeinterface(employee?: employee): string | undefined {
    return employee ? employee.full_name : undefined;
  }
  public gettypeinterface(type?: type): string | undefined {
    return type ? type.text : undefined;
  }
  public getemployeebranchinterface(data?:empbranch):string|undefined{
    return data?data.codename:undefined;
  }
  autocompleteDeptScrollpay() {
    setTimeout(() => {
      if (
        this.matPay &&
        this.autocompleteTrigger &&
        this.matPay.panel
      ) {
        fromEvent(this.matPay.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matPay.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matPay.panel.nativeElement.scrollTop;
            const scrollHeight = this.matPay.panel.nativeElement.scrollHeight;
            const elementHeight = this.matPay.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_paynxt === true) {
                this.mastersErvice.getemppaydropdown(this.payInput.nativeElement.value, this.has_paypage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.emppaycodelist = this.emppaycodelist.concat(datas);
                    if (this.emppaycodelist.length >= 0) {
                      this.has_paynxt = datapagination.has_next;
                      this.has_paypre = datapagination.has_previous;
                      this.has_paypage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });

  }
  autocompleteDeptScrollBank() {
    setTimeout(() => {
      if (
        this.matBank &&
        this.autocompleteTrigger &&
        this.matBank.panel
      ) {
        fromEvent(this.matBank.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matBank.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matBank.panel.nativeElement.scrollTop;
            const scrollHeight = this.matBank.panel.nativeElement.scrollHeight;
            const elementHeight = this.matBank.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_banknxt === true) {
                this.mastersErvice.getempbankdropdown(this.bankInput, this.has_bankpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.banknamelist = this.banknamelist.concat(datas);
                    if (this.banknamelist.length >= 0) {
                      this.has_banknxt = datapagination.has_next;
                      this.has_bankpre = datapagination.has_previous;
                      this.has_bankpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });

  }
  autocompleteDeptScrollBranch() {
    setTimeout(() => {
      if (
        this.matBranch &&
        this.autocompleteTrigger &&
        this.matBranch.panel
      ) {
        fromEvent(this.matBranch.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matBranch.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matBranch.panel.nativeElement.scrollTop;
            const scrollHeight = this.matBranch.panel.nativeElement.scrollHeight;
            const elementHeight = this.matBranch.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_branchnxt === true) {
                this.mastersErvice.getempbranchdropdown(this.branchbankForm.get('bankname').value.id, this.branchInput.nativeElement.value, this.has_branchpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchnamelist = this.branchnamelist.concat(datas);
                    if (this.branchnamelist.length >= 0) {
                      this.has_branchnxt = datapagination.has_next;
                      this.has_branchpre = datapagination.has_previous;
                      this.has_branchpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });

  }
  keypressnodigit(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 64 || charCode > 123)) {
      return false;
    }
    return true;
  }
  keypressd(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 64 || charCode == 94 || charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 58 || charCode > 126)) {
      return false;
    }
    return true;
  }
  keypressdd(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 64 || charCode == 94 || charCode > 32 && (charCode < 48 || charCode > 57) && (charCode < 58 || charCode > 123)) {
      return false;
    }
    return true;
  }
  get_paymode(){
    let d:any;
    if(this.branchbankForm.get('type').value== undefined || this.branchbankForm.get('type').value == null || this.branchbankForm.get('type').value == null){
      this.notification.showWarning('Please Select The Type');
      return false;
    }else{
      d=this.branchbankForm.get('type').value.id;
    }
    this.mastersErvice.bbdetails_paymode(d).subscribe(data=>{
      this.paymodelist=data['data'];
      this.branchbankForm.patchValue({
        paymode:data['data']
      })
    },
  (error)=>{
    this.notification.showError(error.status + error.statusText);
  })
    
  }
  getpayadata() {
    let d: any;
    if (this.branchbankForm.get('paymode').value == null || this.branchbankForm.get('paymode').value == undefined || this.branchbankForm.get('paymode').value == '' || this.branchbankForm.get('paymode').value == "") {
      d = '';
    }
    else {
      d = this.branchbankForm.get('paymode').value;
    }
    this.mastersErvice.getemppaydropdown(d, 1).subscribe(data => {
      this.emppaycodelist = data['data'];
    },
      (error) => {
        this.notification.showError(error.status + error.statusText);
      }
    );
  }
  getbankdata() {
    // let d: any;
    // if (this.branchbankForm.get('bankname').value == null || this.branchbankForm.get('bankname').value == undefined || this.branchbankForm.get('bankname').value == '' || this.branchbankForm.get('bankname').value == "") {
    //   d = '';
    // }
    // else {
    //   d = this.branchbankForm.get('bankname').value;
    // }
    this.mastersErvice.bbd_empbankdropdown().subscribe(data => {
      this.banknamelist = data['data'];
    },
      (error) => {
        this.notification.showError(error.status + error.statusText);
      }
    );
  }
  getbranchdata() {
    if (this.branchbankForm.get('bankname').value.id == undefined || this.branchbankForm.get('bankname').value == '' || this.branchbankForm.get('bankname').value == null) {
      this.notification.showError('Plaese Select The Bank Name');
      return false;
    }
    let d: any;
    if (this.branchbankForm.get('branchname').value == null || this.branchbankForm.get('branchname').value == undefined || this.branchbankForm.get('branchname').value == '' || this.branchbankForm.get('branchname').value == "") {
      d = '';
    }
    else {
      d = this.branchbankForm.get('branchname').value;
    }
    this.mastersErvice.getempbranchdropdown(this.branchbankForm.get('bankname').value.id, d, 1).subscribe(data => {
      this.branchnamelist = data['data'];
    },
      (error) => {
        this.notification.showError(error.status + error.statusText);
      }
    );
  }
  keypressnodigitbranch(event: any) {
    const charCodebranch = (event.which) ? event.which : event.keyCode;
    if (charCodebranch > 31 && (charCodebranch < 48 || charCodebranch > 57) && (charCodebranch < 64 || charCodebranch > 123)) {
      if (charCodebranch == 127 || charCodebranch == 32 || charCodebranch == 8) {
        // this.ifsccode='';
      }
      return false;
    }
    else if (charCodebranch == 127 || charCodebranch == 32 || charCodebranch == 8) {
      // this.ifsccode='';
    }
    return true;
  }
  select_type(){
    console.log(this.branchbankForm.value.type);  
    if(this.branchbankForm.get('type').value.text ==='Branch'){
      this.employeebranch=true;  
      this.employee=false;    
    }else if(this.branchbankForm.get('type').value.text ==='Employee'){
      this.employee=true;
      this.employeebranch=false;
    }
    else{
      this.employee=false;
      this.employeebranch=false;
    }
  }
  branchbankcreate() {
    if (this.branchbankForm.get('paymode').value == undefined || this.branchbankForm.get('paymode').value == '') {
      this.notification.showError('Please Select The Type');
      return false;
    }
    if (this.branchbankForm.get('paymode').value.id == undefined || this.branchbankForm.get('paymode').value == undefined || this.branchbankForm.get('paymode').value == null || this.branchbankForm.get('paymode').value == "") {
      this.notification.showError('Please Enter The Pay Mode');
      return false;
    }
    if (this.branchbankForm.get('bankname').value.id == undefined || this.branchbankForm.get('bankname').value == undefined || this.branchbankForm.get('bankname').value == null || this.branchbankForm.get('bankname').value == "") {
      this.notification.showError('Please Enter The Bank Name');
      return false;
    }
    if (this.branchbankForm.get('branchname').value.id == undefined || this.branchbankForm.get('branchname').value == undefined || this.branchbankForm.get('branchname').value == null || this.branchbankForm.get('branchname').value == "") {
      this.notification.showError('Please Enter The Branch Name');
      return false;
    }
    if(this.branchbankForm.get('accountno').value == undefined || this.branchbankForm.get('accountno').value == ''||this.branchbankForm.get('accountno').value ==''){
      this.notification.showError('Please Enter The Account Number');
      return false;
    }
    // if (this.branchbankForm.get('bankname').value.name == 'KARUR VYSYA BANK') {
    //   if (this.branchbankForm.get('accountno').value.toString().length == 15) {
    //     console.log(this.branchbankForm.get('accountno').value);
    //   }
    //   else {
    //     this.notification.showError('Please Enter The Account Number 15 Digits');
    //     return false;
    //   }
    // }
    // else {
    //   if (this.branchbankForm.get('accountno').value.toString().length == 18) {
    //     console.log(this.branchbankForm.get('accountno').value);
    //   }
    //   else {
    //     this.notification.showError('Please Enter The Account Number 18 Digits');
    //     return false;
    //   }
    // }
    if (this.branchbankForm.get('benifiencyname').value.toString().trim() == undefined || this.branchbankForm.get('benifiencyname').value == undefined || this.branchbankForm.get('benifiencyname').value == null || this.branchbankForm.get('benifiencyname').value == "") {
      this.notification.showError('Please Enter The Benifiency Name');
      return false;
    }
    console.log(this.branchbankForm.value);
    let data: any = {
      "ref_id": this.branchbankForm.get('type').value.id,
      "paymode_id": this.branchbankForm.get('paymode').value.id,
      "bank_id": this.branchbankForm.get('bankname').value.id,
      "bankbranch_id": this.branchbankForm.get('branchname').value.id,
      "beneficiaryname": this.branchbankForm.get('benifiencyname').value,
      "acno": this.branchbankForm.get('accountno').value,
      'reftable_id': this.branchbankForm.get('employee').value.id || this.branchbankForm.get('empbranch').value.id,
      'reftable_code':this.branchbankForm.get('employee').value.code || this.branchbankForm.get('empbranch').value.code,
      
    }
    this.spinner.show();
    this.mastersErvice.getbranchbankcreate(data).subscribe(data => {
      this.spinner.hide();
      if (data['status'] == "success") {
        this.notification.showSuccess(data['message']);
        this.sharedService.BranchbankEditValue.next('');
        this.onCancel.emit()
      }
      else if (data.code == "UNEXPECTED_ERROR") {
        this.notification.showError(data['description'])
      }
      else if (data.code == "INVALID_DATA") {
        this.notification.showError(data['description'])
      }
    },
      (error => {
        this.spinner.hide();
      }))
  }
  ifsc(data) {

  }
  branchbankedit() {
    if (this.branchbankForm.get('paymode').value == undefined || this.branchbankForm.get('paymode').value == '') {
      this.notification.showError('Please Select The Type');
      return false;
    }
    if (this.branchbankForm.get('paymode').value.id == undefined || this.branchbankForm.get('paymode').value == undefined || this.branchbankForm.get('paymode').value == null || this.branchbankForm.get('paymode').value == "") {
      this.notification.showError('Please Enter The Pay Mode');
      return false;
    }
    if (this.branchbankForm.get('bankname').value.id == undefined || this.branchbankForm.get('bankname').value == undefined || this.branchbankForm.get('bankname').value == null || this.branchbankForm.get('bankname').value == "") {
      this.notification.showError('Please Enter The Bank Name');
      return false;
    }
    if (this.branchbankForm.get('branchname').value.id == undefined || this.branchbankForm.get('branchname').value == undefined || this.branchbankForm.get('branchname').value == null || this.branchbankForm.get('branchname').value == "") {
      this.notification.showError('Please Enter The Branch Name');
      return false;
    }
    if(this.branchbankForm.get('accountno').value == undefined || this.branchbankForm.get('accountno').value == ''||this.branchbankForm.get('accountno').value ==''){
      this.notification.showError('Please Enter The Account Number');
      return false;
    }
    // if (this.branchbankForm.get('bankname').value.name == 'KARUR VYSYA BANK') {
    //   if (this.branchbankForm.get('accountno').value.toString().length == 15) {
    //     console.log(this.branchbankForm.get('accountno').value);
    //   }
    //   else {
    //     this.notification.showError('Please Enter The Account Number 15 Digits');
    //     return false;
    //   }
    // }
    // else {
    //   if (this.branchbankForm.get('accountno').value.toString().length == 18) {
    //     console.log(this.branchbankForm.get('accountno').value);
    //   }
    //   else {
    //     this.notification.showError('Please Enter The Account Number 18 Digits');
    //     return false;
    //   }
    // }
    if (this.branchbankForm.get('benifiencyname').value.toString().trim() == undefined || this.branchbankForm.get('benifiencyname').value == undefined || this.branchbankForm.get('benifiencyname').value == null || this.branchbankForm.get('benifiencyname').value == "") {
      this.notification.showError('Please Enter The Benifiency Name');
      return false;
    }
    console.log(this.branchbankForm.value);
    let data: any = {
      "id": this.branchbank_id,
      "ref_id": this.branchbankForm.get('type').value.id,
      "paymode_id": this.branchbankForm.get('paymode').value.id,
      "bank_id": this.branchbankForm.get('bankname').value.id,
      "bankbranch_id": this.branchbankForm.get('branchname').value.id,
      "beneficiaryname": this.branchbankForm.get('benifiencyname').value,
      "acno": this.branchbankForm.get('accountno').value,
      // "reftable_id": this.branchbankForm.get('employee').value.id || this.branchbankForm.get('empbranch').value.id,
      // "reftable_code":this.branchbankForm.get('employee').value.code || this.branchbankForm.get('empbranch').value.code, 
      "reftable_id":(this.branchbankForm.get('type').value.text=="Employee")?this.branchbankForm.get('employee').value.id:this.branchbankForm.get('empbranch').value.id,
      "reftable_code":(this.branchbankForm.get('type').value.text=="Employee")?this.branchbankForm.get('employee').value.code:this.branchbankForm.get('empbranch').value.code
       }
    this.spinner.show();
    this.mastersErvice.getbranchbankcreate(data).subscribe(data => {
      this.spinner.hide();
      if (data['status'] == "success") {
        this.notification.showSuccess("Updated Successfully");
        this.sharedService.BranchbankEditValue.next('');
        this.onCancel.emit()
      }
      else if (data['code'] == "UNEXPECTED_ERROR") {
        this.notification.showError(data['description'])
      }
      else if (data['code'] == "INVALID_DATA") {
        this.notification.showError(data['description'])
      }
    },
      (error => {
        this.spinner.hide();
      }))
  }
  onCancelClick() {
    this.sharedService.BranchbankEditValue.next('');
    this.sharedService.branchreadonly.next(0);
    this.onCancel.emit()
  }
  get_emp_dropdown(emp){
    this.mastersErvice.get_EmployeeList(emp).subscribe(data =>{
      this.emplist = data['data']
    })
  }
  getempdata() {
    let d: any;
    if (this.branchbankForm.get('employee').value == null || this.branchbankForm.get('employee').value == undefined || this.branchbankForm.get('employee').value == '' || this.branchbankForm.get('employee').value == "") {
      d = '';
    }
    else {
      d = this.branchbankForm.get('employee').value;
    }
    this.mastersErvice.get_Emp_List(d, 1).subscribe(data => {
      this.emplist = data['data'];
    },
      (error) => {
        this.notification.showError(error.status + error.statusText);
      }
    );
  }
  keypressnodigitemp(event: any) {
    const charCodebranch = (event.which) ? event.which : event.keyCode;
    return true;
  }
  get_ref_type_list(){
    this.mastersErvice.get_ref_type_list().subscribe(data => {
      this.ref_type_list = data['data']
    })
  }
  autocompleteempScrollpay() {
    setTimeout(() => {
      if (
        this.matemp &&
        this.autocompleteTrigger &&
        this.matemp.panel
      ) {
        fromEvent(this.matemp.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matemp.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matemp.panel.nativeElement.scrollTop;
            const scrollHeight = this.matemp.panel.nativeElement.scrollHeight;
            const elementHeight = this.matemp.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_paynxt === true) {
                this.mastersErvice.get_Emp_List(this.empinput.nativeElement.value, this.has_paypage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.emplist = this.emplist.concat(datas);
                    if (this.emplist.length >= 0) {
                      this.has_paynxt = datapagination.has_next;
                      this.has_paypre = datapagination.has_previous;
                      this.has_paypage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });

  }

  autocompletetypeScrollpay() {
    setTimeout(() => {
      if (
        this.typemat &&
        this.autocompleteTrigger &&
        this.typemat.panel
      ) {
        fromEvent(this.typemat.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.typemat.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.typemat.panel.nativeElement.scrollTop;
            const scrollHeight = this.typemat.panel.nativeElement.scrollHeight;
            const elementHeight = this.typemat.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_paynxt === true) {
                this.mastersErvice.get_ref_type_list()
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.emplist = this.emplist.concat(datas);
                    if (this.emplist.length >= 0) {
                      this.has_paynxt = datapagination.has_next;
                      this.has_paypre = datapagination.has_previous;
                      this.has_paypage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  employee_branchdrop(){
    this.mastersErvice.getempbranchedrop('',1).subscribe(data=>{
      this.empbranchnamelist=data['data']
      let datapagination = data["pagination"];
      if (this.empbranchnamelist.length > 0) {
        this.has_empbranchnxt = datapagination.has_next;
        this.has_empbranchpre = datapagination.has_previous;
        this.has_empbranchpage = datapagination.index;
      }
    })
  }

  autocompleteScrollempbranch(){
    setTimeout(() => {
      if (
        this.matempbranchname &&
        this.autocompleteTrigger &&
        this.matempbranchname.panel
      ) {
        fromEvent(this.matempbranchname.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matempbranchname.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matempbranchname.panel.nativeElement.scrollTop;
            const scrollHeight = this.matempbranchname.panel.nativeElement.scrollHeight;
            const elementHeight = this.matempbranchname.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_empbranchnxt === true) {
                this.mastersErvice.getempbranchedrop(this.matempbranchinput.nativeElement.value,this.has_empbranchpage+1)
                  .subscribe((data: any[]) => {
                    let datas = data["data"];
                    let datapagination = data["pagination"];
                    this.empbranchnamelist = this.empbranchnamelist.concat(datas);
                    if (this.empbranchnamelist.length > 0) {
                      this.has_empbranchnxt = datapagination.has_next;
                      this.has_empbranchpre = datapagination.has_previous;
                      this.has_empbranchpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
}
}