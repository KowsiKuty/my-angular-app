import { Component, OnInit,ViewChild,Output,EventEmitter,Injectable } from '@angular/core';
import { FormGroup,FormBuilder,FormArray,FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DtpcService } from '../dtpc.service';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NotificationService } from '../notification.service';
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

export interface ApplicationClass {
  id: number;
  ApplNo: string;
  DrAcctName: string;
}
export interface branchesss {
  id: any;
  name: string;
  code: string;
  full_name: any;
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
  selector: 'app-los-app-push',
  templateUrl: './los-app-push.component.html',
  styleUrls: ['./los-app-push.component.scss']
})
export class LosAppPushComponent implements OnInit {

  constructor(public fb : FormBuilder,public SpinnerService:NgxSpinnerService,public toastr:ToastrService,
    public DtpcService :DtpcService,public notification :NotificationService,public datepipe:DatePipe
  ) { }

  losdetailsform:FormGroup
  showapplpush = false;
  resultamount:any
  header_total = 0;
  resultbalanceamount =0;
  isDisable = false
  LoanAp:any
  isLoading = false;
  branchnamecode:any
  onbehalfoff = false
  branch_id:any
  behalfdata:any
  branchappid:any
  BranchesList:any
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  has_nextbrnch = true;
  has_previousbrnch = true;
  brnchcurrentpage: number = 1;
  chargeTypelist :any
  ecftypeid:any
  previousCharCode: any = 0
  charCode: any = 0
  @ViewChild('appdata') matappAutocomplete: MatAutocomplete;
  @ViewChild('appInput') appInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  behalfbranchnamecode:any
  @ViewChild('brnchInput') brnchInput:any;
  @ViewChild('brnch') matbrnchAutocomplete: MatAutocomplete;
  @Output() linesChange = new EventEmitter<any>();
  debitindex: any
  readonlydebit= false
  Typelist =[{"id":1,"value":"True"},{"id":0,"value":"False"}]
  id:any
  branchname:any
  branchcode:any

  ngOnInit(): void {
    this.showapplpush = true;
    this.losdetailsform = this.fb.group({
      ApplNo :[''],
      branch:[''],
      CustomerID:[''],
      DrAcctNo:[''],
      DrAcctName:[''],
      BusinessUnit:[''],
      TranRefNo:[''],
      TxnDate:[''],
      Narration:[''],

      loancharges :new FormArray([]),
      loancollaterals :new FormArray([])

    })
      this.getbranchcode()
      this.chargetype()


  }
  getbranchcode(){
     this.DtpcService.getBranchcode().subscribe(result=>{
      if(result?.Branch_id != undefined){
      this.branchnamecode=result.Branch_name+'-'+result.Branch_code
      this.branch_id = result.Branch_id
      this.branchname = result.Branch_name
      this.branchcode = result.Branch_code
      this.behalfdata = result.is_onbehalfoff_hr
      this.branchappid = result.Branch_id
      console.log("branchappid",this.branchappid)
      if (result.is_onbehalfoff_hr==true){
        this.onbehalfoff = true
      }
      else{
        this.onbehalfoff = false 
          this.losdetailsform.patchValue({
            branch:this.branchnamecode
          })   

      }
    }
      })
  }

  autocompleteappScroll() {
    setTimeout(() => {
      if (
        this.matappAutocomplete &&
        this.autocompleteTrigger &&
        this.matappAutocomplete.panel
      ) {
        fromEvent(this.matappAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matappAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matappAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matappAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matappAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.DtpcService.get_CreateEditscreen_loanapp_dropdown(this.appInput.nativeElement.value, this.currentpage + 1,this.branchappid)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.LoanAp = this.LoanAp.concat(datas);
                    if (this.LoanAp.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
   public displayFn(ApplicationClass?: ApplicationClass): string | undefined {
      return ApplicationClass ? ApplicationClass.ApplNo +"-"+ApplicationClass.DrAcctName:undefined;
    }
    get ApplicationClass() {
      return this.losdetailsform.get('ApplNo');
    }
    Loanapplication(value) {
      this.SpinnerService.show()
      this.DtpcService.get_CreateEditscreen_loanapp_dropdown(value, 1,this.branchappid)
        .subscribe((result) => {
          this.SpinnerService.hide()
          let loanapdr = result['data'];
          this.LoanAp = loanapdr;
        })
    }

    
      branchnames() {
        let branchkeyvalue: String = "";
        this.getbranchname(branchkeyvalue);
      
        this.losdetailsform.get('branch').valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
              console.log('inside tap')
      
            }),
            switchMap(value => this.DtpcService.getcontrolbranch(value, 1,this.branch_id)
              .pipe(
                finalize(() => {
                  this.isLoading = false
                }),
              )
            )
          )
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.BranchesList = datas;
      
          })
      
      }
    
      private getbranchname(branchkeyvalue) {
        this.DtpcService.getcontrolbranch(branchkeyvalue, 1,this.branch_id)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.BranchesList = datas;
          })
      }
      
      public displayFnBranch(branchee?: branchesss): string | undefined {
        return branchee ? branchee.full_name : undefined;
      }

      getbranchid(data){
        this.branchappid = data.id
        this.behalfbranchnamecode = data.gstin
        console.log("branchappid1",this.branchappid)
        this.Loanapplication("");
        this.Branchcallingfunction();
      }
      
        autocompletebranchScroll() {
           
          setTimeout(() => {
            if (
              this.matbrnchAutocomplete &&
              this.autocompleteTrigger &&
              this.matbrnchAutocomplete.panel
            ) {
              fromEvent(this.matbrnchAutocomplete.panel.nativeElement, 'scroll')
                .pipe(
                  map(() => this.matbrnchAutocomplete.panel.nativeElement.scrollTop),
                  takeUntil(this.autocompleteTrigger.panelClosingActions)
                )
                .subscribe(()=> {
                  const scrollTop = this.matbrnchAutocomplete.panel.nativeElement.scrollTop;
                  const scrollHeight = this.matbrnchAutocomplete.panel.nativeElement.scrollHeight;
                  const elementHeight = this.matbrnchAutocomplete.panel.nativeElement.clientHeight;
                  const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                  if (atBottom) {
                    if (this.has_nextbrnch === true) {
                      this.DtpcService.getcontrolbranch(this.brnchInput.nativeElement.value, this.brnchcurrentpage + 1 , this.branch_id)
                        .subscribe((results: any[]) => {
                          let datas = results["data"];
                          let datapagination = results["pagination"];
                          this.BranchesList = this.BranchesList.concat(datas);
                          if (this.BranchesList.length >= 0) {
                            this.has_nextbrnch = datapagination.has_next;
                            this.has_previousbrnch = datapagination.has_previous;
                            this.brnchcurrentpage = datapagination.index;
                          }
                        })
                    }
                  }
                });
            }
          });
        }

    Branchcallingfunction() {
    
  }

 chargetype(){
  this.SpinnerService.show()
  this.DtpcService.chargetypedrpdown().subscribe((result)=>{
    if(result.code){
      this.SpinnerService.hide()
      this.notification.showError(result?.description)
    }
    else{
      this.chargeTypelist = result["data"]
      this.SpinnerService.hide()
    }
    })
 }

 getecf(id) {
    this.ecftypeid = id?.id
  }

  getCharCode(e) {
    this.previousCharCode = this.charCode
    this.charCode = (e.which) ? e.which : e.keyCode;
  }

  ecfhdrchangeToCurrency(ctrl, ctrlname) {
    if (this.charCode != 46 && !(this.previousCharCode == 46 && this.charCode == 48)) {
      let a = ctrl.value;
      a = a.replace(/,/g, "");

      if (a && !isNaN(+a)) {
        let num: number = +a;
        let temp = new Intl.NumberFormat("en-GB").format(num);
        temp = temp ? temp.toString() : '';
        // this.ecfheaderForm.get('apamount').setValue(temp)
      }    

    }
  }
    numberOnlyandDot(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
    getloancharges(form) {  
      return form.controls.loancharges.controls;
    }
    getloancollaterals(form){
      return form.controls.loancollaterals.controls;
    }
    
    addloanchargesSection() {
        const control = <FormArray>this.losdetailsform.get('loancharges');
        let n = control.length
        control.push(this.addloancharges());
    }

    adddebitSection() {
      
      const control = <FormArray>this.losdetailsform.get('loancharges');
      control.push(this.addloancharges());
      this.readonlydebit[control.length-1] = false
    }
     addloancharges() {
        let group = new FormGroup({
          chargetype: new FormControl(),
          amount: new FormControl(''),
          gstamount: new FormControl(''),         
        })
    
        group.get('amount').valueChanges.pipe(
          debounceTime(100)
        ).subscribe(value => {
    
          // this.debitdatasums();
          if (!this.losdetailsform.valid) {
            return;
          }
          this.linesChange.emit(this.losdetailsform.value['loancharges']);
        })
         group.get('gstamount').valueChanges.pipe(
          debounceTime(100)
        ).subscribe(value => {
    
          // this.debitdatasums();
          if (!this.losdetailsform.valid) {
            return;
          }
          this.linesChange.emit(this.losdetailsform.value['loancharges']);
        })
         group.get('chargetype').valueChanges.pipe(
          debounceTime(100)
        ).subscribe(value => {
    
          // this.debitdatasums();
          if (!this.losdetailsform.valid) {
            return;
          }
          this.linesChange.emit(this.losdetailsform.value['loancharges']);
        })
        return group;
      }

       addinvdtlSection() {
        const control = <FormArray>this.losdetailsform.get('loancharges');
        let n = control.length
        control.push(this.addloancharges());
    }

    adddloancollateralsSection() {
      
      const control = <FormArray>this.losdetailsform.get('loancollaterals');
      control.push(this.addloancollaterals());
      this.readonlydebit[control.length-1] = false
    }
     addloancollaterals() {
        let group = new FormGroup({
          type: new FormControl(),
          Collateral_ID: new FormControl(''),
          Collateral_Name: new FormControl(''),    
          Collateral_Value :new FormControl('')    
        })
    
        group.get('type').valueChanges.pipe(
          debounceTime(100)
        ).subscribe(value => {
    
          // this.debitdatasums();
          if (!this.losdetailsform.valid) {
            return;
          }
          this.linesChange.emit(this.losdetailsform.value['loancollaterals']);
        })
         group.get('Collateral_ID').valueChanges.pipe(
          debounceTime(100)
        ).subscribe(value => {
    
          // this.debitdatasums();
          if (!this.losdetailsform.valid) {
            return;
          }
          this.linesChange.emit(this.losdetailsform.value['loancollaterals']);
        })
         group.get('Collateral_Name').valueChanges.pipe(
          debounceTime(100)
        ).subscribe(value => {
    
          // this.debitdatasums();
          if (!this.losdetailsform.valid) {
            return;
          }
          this.linesChange.emit(this.losdetailsform.value['loancollaterals']);
        })
         group.get('Collateral_Value').valueChanges.pipe(
          debounceTime(100)
        ).subscribe(value => {
    
          // this.debitdatasums();
          if (!this.losdetailsform.valid) {
            return;
          }
          this.linesChange.emit(this.losdetailsform.value['loancollaterals']);
        })
        return group;
      }
    
  gettype(val){
    this.id = val
  }

  loancharges:any[]=[]
  loancollaterals:any[]=[]
  loanappcreate(){
    this.SpinnerService.show()

    if(this.losdetailsform.get('ApplNo').value == '' || this.losdetailsform.get('ApplNo').value == null || this.losdetailsform.get('ApplNo').value == undefined){
      this.notification.showError("Please Enter the Application Number")
      this.SpinnerService.hide()
      return false
    }
     if(this.onbehalfoff &&( this.losdetailsform.get('branch').value == '' || this.losdetailsform.get('branch').value == null || this.losdetailsform.get('branch').value == undefined)){
      this.notification.showError("Please Select the Branch")
      this.SpinnerService.hide()
      return false
    }
     if(this.losdetailsform.get('CustomerID').value == '' || this.losdetailsform.get('CustomerID').value == null || this.losdetailsform.get('CustomerID').value == undefined){
      this.notification.showError("Please Enter the Customer ID")
      this.SpinnerService.hide()
      return false
    }
     if(this.losdetailsform.get('DrAcctNo').value == '' || this.losdetailsform.get('DrAcctNo').value == null || this.losdetailsform.get('DrAcctNo').value == undefined){
      this.notification.showError("Please Enter Debit Account Number")
      this.SpinnerService.hide()
      return false
    }
     if(this.losdetailsform.get('DrAcctName').value == '' || this.losdetailsform.get('DrAcctName').value == null || this.losdetailsform.get('DrAcctName').value == undefined){
      this.notification.showError("Please Enter Debit Account Name")
      this.SpinnerService.hide()
      return false
    }
     if(this.losdetailsform.get('Narration').value == '' || this.losdetailsform.get('Narration').value == null || this.losdetailsform.get('Narration').value == undefined){
      this.notification.showError("Please Enter Narration")
      this.SpinnerService.hide()
      return false
    }
     if(this.losdetailsform.get('TxnDate').value == '' || this.losdetailsform.get('TxnDate').value == null || this.losdetailsform.get('TxnDate').value == undefined){
      this.notification.showError("Please Select the Transaction Date")
      this.SpinnerService.hide()
      return false
    }
     if(this.losdetailsform.get('TranRefNo').value == '' || this.losdetailsform.get('TranRefNo').value == null || this.losdetailsform.get('TranRefNo').value == undefined){
      this.notification.showError("Please Enter the Transaction Ref No")
      this.SpinnerService.hide()
      return false
    }
     if(this.losdetailsform.get('BusinessUnit').value == '' || this.losdetailsform.get('BusinessUnit').value == null || this.losdetailsform.get('BusinessUnit').value == undefined){
      this.notification.showError("Please Enter the Business Unit")
      this.SpinnerService.hide()
      return false
    }
    if(this.losdetailsform.get('loancollaterals').value.length == 0){
      this.notification.showError("Please Add the Loan Collaterals")
      this.SpinnerService.hide()
      return false
    }
    if(this.losdetailsform.get('loancharges').value.length == 0){
      this.notification.showError("Please Add the Loan Charges")
      this.SpinnerService.hide()
      return false
    }
  if(this.losdetailsform.get('loancharges').value.length >= 0){
    for(let i = 0; i<this.losdetailsform.get('loancharges').value.length;i++){
      let loancharges = {
      "ChargeType": this.losdetailsform.get('loancharges').value[i].chargetype,
      "Amount": this.losdetailsform.get('loancharges').value[i].amount,
      "GST": this.losdetailsform.get('loancharges').value[i].gstamount
      }
      this.loancharges.push(loancharges)
    }
  }
   if(this.losdetailsform.get('loancollaterals').value.length >= 0){
    for(let i = 0; i<this.losdetailsform.get('loancollaterals').value.length;i++){
      let loancollaterals = {
      "Is_New": this.losdetailsform.get('loancollaterals').value[i].type,
      "CollateralID": this.losdetailsform.get('loancollaterals').value[i].Collateral_ID,
      "CollateralName": this.losdetailsform.get('loancollaterals').value[i].Collateral_Name,
      "CollateralValue":this.losdetailsform.get('loancollaterals').value[i].Collateral_Value
      }
      this.loancollaterals.push(loancollaterals)
    }
  }

    let data = {
    "BranchCode": this.onbehalfoff == false ? this.branchcode :this.losdetailsform.get('branch').value.code,
    "BranchName": this.onbehalfoff == false ? this.branchname :this.losdetailsform.get('branch').value.name,
    "CustomerID": this.losdetailsform.get('CustomerID').value,
    "DrAcctName": this.losdetailsform.get('DrAcctName').value,
    "DrAcctNo": this.losdetailsform.get('DrAcctNo').value,
    "TxnDate": this.datepipe.transform(this.losdetailsform.get('TxnDate').value, 'dd-MMM-yyyy'),
    "Narattion": this.losdetailsform.get('Narration').value,
    "ApplNo": this.losdetailsform.get('ApplNo').value,
    "TranRefNo": this.losdetailsform.get('TranRefNo').value,
    "BusinessUnit": this.losdetailsform.get('BusinessUnit').value,
    "Charges" :this.loancharges,
    "Collaterals":this.loancollaterals
   
    }

    this.DtpcService.loanapplication_push(data).subscribe(results=>{
      if(results?.code){
        this.SpinnerService.hide()
        this.notification.showError(results?.description)
        this.loanappcreateback()
        this.getbranchcode()
        this.loancharges= []
        this.loancollaterals = []
      }
      else if(results?.error_code == "00"){
        this.SpinnerService.hide()
        this.notification.showSuccess(results?.Message)
        this.loanappcreateback()
        this.getbranchcode()
        this.loancharges= []
        this.loancollaterals = []
      }
      else if(results?.error_code == "01"){
        this.SpinnerService.hide()
        this.notification.showError(results?.Message)
        this.loanappcreateback()
        this.getbranchcode()
        this.loancharges= []
        this.loancollaterals = []
      }
      else {
        this.SpinnerService.hide()
        this.notification.showError(results?.Message)
        this.loanappcreateback()
        this.getbranchcode()
        this.loancharges= []
        this.loancollaterals = []
      }
    })
  }
  loanappcreateback(){
    this.losdetailsform.reset("")
    const loanchargesArray = this.losdetailsform.get('loancharges') as FormArray;
      while (loanchargesArray.length !== 0) {
        loanchargesArray.removeAt(0);
      }
      const loancollateralsArray = this.losdetailsform.get('loancollaterals') as FormArray;
      while (loancollateralsArray.length !== 0) {
        loancollateralsArray.removeAt(0);
      }
  }
    numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
