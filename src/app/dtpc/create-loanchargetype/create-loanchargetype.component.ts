import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder, Validators, } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from "@angular/router";
import { DtpcService } from "../dtpc.service";
import { NotificationService } from "../notification.service";

@Component({
  selector: 'app-create-loanchargetype',
  templateUrl: './create-loanchargetype.component.html',
  styleUrls: ['./create-loanchargetype.component.scss']
})
export class CreateLoanchargetypeComponent implements OnInit {
  presentpageloancharge: number = 1;
  currentepageloancharge: number = 1;
  has_nextloan = true;
  has_previousloan = true;
  pageSize = 10;
  loandata: any;
  currentpage: number = 1;
  LoanAp: any;
  LoanApp: any;
  loanchargetypeForm: FormGroup;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  vendorList: any;
  multiple_application_data = [];
  single_application_data: any;

  constructor(private SpinnerService: NgxSpinnerService, private fb: FormBuilder, private router: Router,
    private notification: NotificationService, private dtpcservice: DtpcService) { }

  ngOnInit(): void {
    this.loanchargetypeForm = this.fb.group({
      // Loan_Collateral_id: ['', Validators.required],
      Vendor_Name_id: ['', Validators.required],
      Charge_Amount: ['', Validators.required],
      Charge_Type: ['', Validators.required],
      CustomerID: ['', Validators.required],
      BranchCode: ['', Validators.required],
      BranchName: ['', Validators.required],
      DrAcctNo: ['', Validators.required],
      DrAcctName: ['', Validators.required],
      Loan_Application_id: ['', Validators.required],
      Loan_Appl_no: ['', Validators.required]
    })
    this.getloandatasummary()
    this.Loanapplication()
    this.getvendor()

  }
  loanchargetypeCreateForm() {
    // debugger;
    if (this.loanchargetypeForm.value.BranchName === "") {
      this.notification.showError("Please fill Branch Name")
      return false;
    }
    let execute=1;
    this.single_application_data = this.loanchargetypeForm.value;
    this.single_application_data['vendor_name'] = this.loanchargetypeForm.value.Vendor_Name_id.name;
    this.single_application_data['vendor_id'] = this.loanchargetypeForm.value.Vendor_Name_id.id;
    this.single_application_data['Loan_Collateral_id'] = '';
    this.single_application_data['Vendor_Name_id'] = '';
    this.single_application_data['rm_id'] = '';
    let appication_number=this.single_application_data.Loan_Appl_no;
    let Charge_Amount=this.single_application_data.Charge_Amount;
    let vendor_id=this.single_application_data.vendor_id;
    let Charge_Type=this.single_application_data.Charge_Type;

    for(let i=0;i<this.multiple_application_data.length;i++){
        if(appication_number==this.multiple_application_data[i].Loan_Appl_no){
          alert("Application Number Duplicate Not Allowed")
          return false;
        }
        if(vendor_id!=this.multiple_application_data[i].vendor_id){
          alert("Difference Vendor Not Allowed")
          return false;
        }
        if(Charge_Type!=this.multiple_application_data[i].Charge_Type){
          alert("Difference Charge Type Not Allowed")
          return false;
        }
    } 
    if(this.amount<Charge_Amount){
      alert("Charges Amount Is Greater Than Amount");
      return false;
    }

    this.multiple_application_data.push(this.single_application_data);
    this.loanchargetypeForm.reset();
    this.amount = "";

  }
  delete_single_loan_number(data,index){
    this.multiple_application_data.splice(index, 1);

  }
  loanpage: any;
  getloandatasummary(pageNumber = 1, pageSize = 10) {
    this.dtpcservice.get_loanchargetype_summary(pageNumber, pageSize)
      .subscribe((result) => {

        let datass = result['data'];
        this.loandata = datass;
        console.log("pay", this.loandata)
        let datapagination = result["pagination"];
        if (this.loandata.length === 0) {
          this.loanpage = false
        }
        if (this.loandata.length >= 0) {
          this.has_nextloan = datapagination.has_next;
          this.has_previousloan = datapagination.has_previous;
          this.presentpageloancharge = datapagination.index;
          this.loanpage = true
        }
      })
  }
  nextClickloan() {
    if (this.has_nextloan === true) {
      this.currentepageloancharge = this.presentpageloancharge + 1
      this.getloandatasummary(this.presentpageloancharge + 1, 10)
    }
  }

  previousClickloan() {
    if (this.has_previousloan === true) {
      this.currentepageloancharge = this.presentpageloancharge - 1
      this.getloandatasummary(this.presentpageloancharge - 1, 10)
    }
  }
  getvendor() {
    this.dtpcservice.getVendorSummary()
      .subscribe((result) => {

        let loanapven = result['data'];
        this.vendorList = loanapven;
        console.log("vendor", this.LoanAp)
      })
  }
  Loanapplication() {
    this.dtpcservice.get_loanapp_dropdownLOS("data",1)
      .subscribe((result) => {

        let loanapdr = result['data'];
        this.LoanAp = loanapdr;
        console.log("pay1", this.LoanAp)
      })
  }
  getid(id) {
    console.log("applid", id)
    this.dtpcservice.get_loanapp_partgetid(id)
      .subscribe((result) => {

        let loanapdr = result;
        this.LoanApp = loanapdr.Charges;
        console.log("pay2", this.LoanApp)
        this.loanchargetypeForm.patchValue({
          CustomerID: loanapdr.CustomerID,
          BranchCode: loanapdr.BranchCode,
          BranchName: loanapdr.BranchName,
          DrAcctNo: loanapdr.DrAcctNo,
          DrAcctName: loanapdr.DrAcctName,
          Loan_Appl_no: loanapdr.ApplNo

        })
      })
  }
  amount: any
  getchargetype(data) {
    console.log("typesssss", data.ChargeType)
    if (data.ChargeType === "LEGAL_FEE") {
      this.amount = data.Amount
      // this.loanchargetypeForm.patchValue(
      //   {Charge_Amount:data.Amount}
      //   )
      console.log("amountsss", data.Amount)
    }
    else {
      this.amount = data.Amount
      // this.loanchargetypeForm.patchValue(
      //   {Charge_Amount:data.Amount}
      //   )

    }
  }
  onCancelClick() {
    this.loanchargetypeForm.reset()
    this.getloandatasummary();
  }
  submit_loan_app(){
    
  }
}