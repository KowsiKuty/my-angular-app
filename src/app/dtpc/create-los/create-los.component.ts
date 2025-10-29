import { Component, OnInit, Directive,Input,ChangeDetectionStrategy, Inject,HostListener, ChangeDetectorRef, ViewChild, Injectable, Output, EventEmitter,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { DtpcService } from '../dtpc.service';
import { NgxSpinnerService } from "ngx-spinner";
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
// import { debug } from 'console';
import { NotificationService } from '../notification.service';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { from, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DtpcShareService } from '../dtpc-share.service';
import { DomSanitizer } from '@angular/platform-browser';
import { fromEvent } from 'rxjs';
import { NONE_TYPE } from '@angular/compiler';
import { take } from 'rxjs/operators';
import { catchError,  timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';



export interface ApplicationClass {
  id: number;
  ApplNo: string;
  DrAcctName: string;
}
export interface SupplierName {
  id: number;
  name: string;
}
export interface commoditylistss {
  id: string;
  name: string;
}
export interface hsnlistss {
  id: any;
  name: string;
  code: string;
}

export interface productlists {
  id: any;
  name: string;
}

export interface bslistss {
  id: any;
  name: string;
  code: string;
}
export interface cclistss {
  id: any;
  name: string;
  code: string;
}

export interface RM {
  id: string;
  ApplNo: string;
}
export interface branchesss {
  id: any;
  name: string;
  code: string;
  full_name: any;
}


export interface ApplicationDetailsDialogData {
  single_application_details_data: [];
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
  selector: 'app-create-los',
  templateUrl: './create-los.component.html',
  styleUrls: ['./create-los.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]

})


export class CreateLosComponent implements OnInit {
  @Output() linesChange = new EventEmitter<any>();
  losheaderform: FormGroup;
  losdetailsform: FormGroup;
  SelectSupplierForm: FormGroup;
  invoice_details_data: FormArray;
  los_summary_data: any;
  pageSize = 10;
  LoanAp: any;
  branchbank = 1;
  file = [];
  multiple_application_data = [];
  pipe = new DatePipe('en-US');
  // vendorList: any;
  chargeTypeList; any;
  invoice_header_data = [];
  isLoading = false;
  header_total: any;
  detail_total: any;
  show_file = false;
  total_amount_edit: true;
  ng_invoice_header_amount = 0;
  ng_invoice_header_gst_amount = 0;
  ng_invoice_details_amount = 0;
  ng_invoice_details_gst_amount = 0;
  invoice_data: any;
  invoice_isEdit: any;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  supplierNameData: any;
  single_application_data: any;
  edit_invoice_details: any;
  resultamount: any;
  resultbalanceamount: any;
  suppliergstnumber:any;
  maxDate = new Date()
  flag : boolean = false; 
  n:any;
  teamInitial :any;
  // vendorsList: Array<vendorlistss>
  invoice_gid: any;
  LOSpatch_data: any;
  invoiceheaderid: any;
  invoicedetailid: any;
  balancechargeid: any;
  defaultapplication = true;
  alterapplication = false;
  editheadertotalamount: any;
  BCloanappid: any;
  IDloanappid: any;
  defaulttotalamount = true;
  altertotalamount = false;
  suplist: any;
  SupplierName: string;
  SupplierCode: string;
  SupplierGSTNumber: string;
  SupplierPANNumber: string;
  invoice_details_amount:any
  Address: string;
  City: string;
  line1: any;
  line2: any;
  line3: any;
  JsonArray = []
  supp: any;
  selectsupplierlist: any;
  default = true
  alternate = false
  submitbutton = false;
  successdata: any[] = [];
  inputSUPPLIERValue = "";
  inputSUPPLIERStateid = "";
  CommodityName = "";
  commodityList: Array<commoditylistss>;
  supplierid: any;
  pay1:any;
  stateid: any;
  StateID: string;
  inputSUPPLIERgst :any;
  branchgstnumber :any;
   // hsnList:any;
  totoTax: any;
  tototaxable: any;
  hsnper: any;
  hsncode: any;
  hsnList: Array<hsnlistss>;
  productlist: Array<productlists>;
  bsList: Array<bslistss>;
  ccList: Array<cclistss>;
  hsnpercentagevalue: any;
  qty: any;
  unit: any;
  GSTType: any;
  EditGSTtype: any;
  fileData: File = null;
  fileName: any;
  headerId: any;
  DetailId: any;
  balance_id: any;
  draftdisable = true
  submitdisable = true
  filedisable = true
  finalpaymentstatus: any;
  finalstatus: any;
  finalstat = { 'LEGAL_FEE': "false", 'VALU_FEE': 'false' }
  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]
  productslists = [{"id": 1119,"name": "Advocate Fee"},{"id":1120,"name":"valuation charges-Insurance Surveyor/Loss Assessor/Valuation charges"}]
  isChecked = false
  HSNnontax = false
  HSNtax = true
  GSTtax = true
  GSTnontax = false
  HSNcodesssssss: any;
  @ViewChild('file1', { static: false }) InputVar: ElementRef;
  // @ViewChild('choosevendor') choosevendor: any;
  // @ViewChild('vendors') matAutocompleteVendor: MatAutocomplete;

  @ViewChild('rmemp') matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('rmInput') rmInput: any;
  @ViewChild('bstype') matbsAutocomplete: MatAutocomplete;
  @ViewChild('bsInput') bsInput: any;
  @ViewChild('cctype') matccAutocomplete: MatAutocomplete;
  @ViewChild('ccInput') ccInput: any;
  @ViewChild('autopro') matproAutocomplete: MatAutocomplete;
  @ViewChild('proname') proInput: any;
  @ViewChild('appdata') matappAutocomplete: MatAutocomplete;
  @ViewChild('appInput') appInput: any;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  fileToUpload: FormData = new FormData();
  number:string="Number"
  branchnamecode:any;
  onbehalfoff:boolean=false
  branch_id: any;
  BranchesList:any
  @ViewChild('brnchInput') brnchInput:any;
  @ViewChild('brnch') matbrnchAutocomplete: MatAutocomplete;
  presentpagebrnch: number = 1;
  pagesizebrnch = 10;
  has_nextbrnch = true;
  has_previousbrnch = true;
  brnchcurrentpage: number = 1;
  behalfdata:boolean;

  constructor(private fb: FormBuilder, private DtpcShareService: DtpcShareService,  private DtpcService: DtpcService, private toastr: ToastrService,
    public datepipe: DatePipe, private SpinnerService: NgxSpinnerService, public dialog: MatDialog, private sanitizer: DomSanitizer,
    private notify : NotificationService) 
    { 
     
    }


  // ngAfterViewInit() {
  //   this.cdRef.detectChanges();
  // }
  
  
  ngOnInit(): void {
    this.losheaderform = this.fb.group({
      invoice_header_date: [''],
      invoice_header_number: [''],
      invoice_header_amount:[''],
      invoice_header_gst_amount: ['0'],
      Remarks: [''],
      invoice_charge_type: [''],
      Supplier_id: [''],
      Supplierstate_id: [''],
      payment_detail:[''],
      Commodity_id: [''],
      behalf_branch:[''],
      Otheramount: new FormControl(0),
      Roundoffamt: new FormControl(0),
      Notename: [''],
      file: [''],
       paymode_id:[''],
       creditbank_id:[''],
       ifsccode:[''],
       accno:[''],
       branchname:[''],
       paymentdetails:[''],

      invoice_header_total_amount: new FormControl({ disabled: true, value: 0 }),
    })
    
    // this.Branchcallingfunction();
    this.DtpcService.getBranchcode().subscribe(result=>{
      if(result?.Branch_id != undefined){
      this.branchnamecode=result.Branch_name+'-'+result.Branch_code
      this.branch_id = result.Branch_id
      this.behalfdata = result.is_onbehalfoff_hr
      this.branchappid = result.Branch_id
      console.log("branchappid",this.branchappid)
      if (result.is_onbehalfoff_hr==true){
        this.onbehalfoff = true
      }
      else{
        this.onbehalfoff = false 
        // if(this.behalfdata == false){
          this.losheaderform.patchValue({
            behalf_branch:this.branchnamecode
          })
        // }
    

      }
      this.Loanapplication("");
    }
      })
    
    this.SelectSupplierForm = this.fb.group({
      gstno: [''],
      code: [''],
      panno: [''],
      name: [''],
    })
   
    let suppliername: String = "";
    this.getsuppliername(this.suplist, suppliername);
    this.SelectSupplierForm.get('name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.DtpcService.getsuppliername(this.suplist, value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierNameData = datas;
      })
    this.getsuppliername(this.suplist, "");



    this.SpinnerService.show();
    this.LOSpatch_data = this.DtpcShareService.LOSpatchmaindatas.value;
    // console.log("this is LOS edit data", this.LOSpatch_data)

    this.EditGSTtype = this.DtpcShareService.GSTtype.value;
    // console.log("this is LOS edit GSTtype", this.EditGSTtype)

    this.invoice_data = this.DtpcShareService.Invoice_Data.value;
    // console.log(this.invoice_data)

    this.invoice_isEdit = this.DtpcShareService.Invoice_isEdit.value;
    // console.log(this.invoice_isEdit)
    this.invoice_gid = this.invoice_data.id;
    // if (this.invoice_data === "" ) {
    //   this.defaultapplication = true;
    //   this.alterapplication = false;
    //   this.defaulttotalamount = true;
    //   this.altertotalamount = false;
    // }
    // else {
    //   this.defaultapplication = false;
    //   this.alterapplication = true;
    //   this.defaulttotalamount = false;
    //   this.altertotalamount = true;
    // }
    
    if (this.invoice_data) {
      let n:number=0;
      this.DtpcService.get_invoice_details(this.invoice_gid)
        .subscribe((result) => {
          this.SpinnerService.hide();
          this.edit_invoice_details = result;
          this.losheaderform.patchValue({
            // vendor: this.edit_invoice_details.Vendor,
            "invoice_charge_type": this.edit_invoice_details.Invoice_Charge_type,
            "invoice_header_date": this.edit_invoice_details.Invoice_Date,
            "invoice_header_number": this.edit_invoice_details.Invoice_No,
            "invoice_header_amount": this.edit_invoice_details.Invoice_Amt,
            "invoice_header_gst_amount": this.edit_invoice_details.Gst_Amt,
            "invoice_header_total_amount": this.edit_invoice_details.Invoice_Total_Amt,
            "Supplier_id": this.edit_invoice_details.Supplier.name,
            "Supplierstate_id": this.edit_invoice_details.Supplierstate.name,
            "Commodity_id": this.edit_invoice_details.Commodity.name,
            "Notename": this.edit_invoice_details.Notename,
            "Otheramount": this.edit_invoice_details.Otheramount,
            "Roundoffamt": this.edit_invoice_details.Roundoffamt,
            "file": this.edit_invoice_details.file_data,
            "Remarks": this.edit_invoice_details.Remarks,
            "behalf_branch":this.edit_invoice_details.behalf_branch,
            "paymode_id":this.edit_invoice_details.paymode_id,
            "ifsccode":this.edit_invoice_details.ifsccode,
            "branchname":this.edit_invoice_details.branchname,
            "creditbank_id":this.edit_invoice_details.creditbank_id,
            "accno":this.edit_invoice_details.accno,

          })
          
          this.branchgstnumber = this.edit_invoice_details.Branchgst
          this.inputSUPPLIERgst = this.edit_invoice_details.Supplier.gstno
         
          // console.log(this.edit_invoice_details);
          this.losdetailsform = this.fb.group({
            Roundoffamt: this.edit_invoice_details.Roundoffamt,
            Otheramount: this.edit_invoice_details.Otheramount,
            invoice_details_data: this.fb.array([])
          })
          this.detail_total = this.edit_invoice_details.Invoice_Total_Amt;

          for (let i = 0; i < this.edit_invoice_details.InvoiceDetails.length; i++) {
            this.addItem_Edit(this.edit_invoice_details.InvoiceDetails[i])
          }
          this.editheadertotalamount = this.edit_invoice_details.Invoice_Total_Amt
          // console.log(" edit header total amount", this.editheadertotalamount)
        })

    }


    
    let commoditykeyvalue : String = ""
    this.getcommodity(commoditykeyvalue);
    this.losheaderform.get('Commodity_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.DtpcService.getcommodity(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.commodityList = datas;
      })
    this.getcommodity('');

    if (this.invoice_isEdit != 'N') {
      this.losdetailsform = this.fb.group({
        Roundoffamt: 0,
        Otheramount: 0,
        invoice_details_data: this.fb.array([this.createItem()])
      })
    }
    if (this.invoice_isEdit === 'N') {
      this.losdetailsform = this.fb.group({
        Roundoffamt: 0,
        Otheramount: 0,
        invoice_details_data: this.fb.array([this.createItem_Edit("")])
      })
    }

    // this.getapplicationList("");

    // this.getvendor()
    this.chargeTypeList = [{ "charge_type": "LEGAL_FEE" }, { "charge_type": "VALU_FEE" }]
    
  }

  //----------------------------------------------------------------------------------------------

  public displaytest(SupplierName?: SupplierName): string | undefined {
    return SupplierName ? SupplierName.name : undefined;
  }

  public displayFnsupplier(SupplierName?: SupplierName): string | undefined {
    return SupplierName ? SupplierName.name : undefined;
  }

  get supplierName() {
    return this.SelectSupplierForm.get('name');
  }

  getsuppliername(id, suppliername) {
    this.DtpcService.getsuppliername(id, suppliername)
      .subscribe((results) => {
        let datas = results["data"];
        this.supplierNameData = datas;
      })
  }

  public displayFncommodity(commodity?: commoditylistss): string | undefined {
    return commodity ? commodity.name : undefined;
  }

  get commodity() {
    return this.losheaderform.get('Commodity_id');
  }

  getcommodity(commoditykeyvalue) {
    this.DtpcService.getcommodity(commoditykeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.commodityList = datas;
        // console.log("commodityList", datas)
        // this.commodityid = datas.id;
        // console.log("ccccccccccccccccccccccccccccccc",this.commodityid)
      })
  }
  //---------------------------------------------------------------------------------------------
  getsupplierView(data) {
    this.supplierid = data.id
    this.DtpcService.getgrninwardView(data.id)
      .subscribe(result => {
        let datas = result['data']
        let overall = datas;
        this.supp = datas
        // for (var i = 0; i < overall.length; i++) {
        //   this.supp = overall[i]
        //   this.SupplierName = this.supp.name;
        //   this.SupplierCode = this.supp.code;
        //   this.SupplierGSTNumber = this.supp.gstno;
        //   this.SupplierPANNumber = this.supp.panno;
        //   this.Address = this.supp.address_id;
        //   this.line1 = this.supp.address_id[i].line1;
        //   this.line2 = this.supp.address_id[i].line2;
        //   this.line3 = this.supp.address_id[i].line3;
        //   this.City = this.supp.address_id[i].city_id[i].name;
        //   this.StateID = this.supp.address_id[i].state_id.name;
        //   this.stateid = this.supp.address_id[i].state_id.id;
        // }

        this.SupplierName = result.name
        this.SupplierCode = result.code
        this.SupplierGSTNumber = result.gstno
        this.SupplierPANNumber =result.panno
        this.Address = result.address_id
        this.line1 = result.address_id.line1
        this.line2 =result.address_id.line2
        this.line3 =result.address_id.line3
        this.City =result.address_id.city_id.name
        this.stateid =result.address_id.state_id.id
        this.StateID =result.address_id.state_id.name

        this.submitbutton = true;
      }) 
      this.getPayDetList();
  }
  PayDetailList : any
  getPayDetList() {
    this.DtpcService.getSupplierPayDet(this.supplierid)
      .subscribe(results => {
        let datas = results["data"];
        this.PayDetailList = datas;
        // console.log("mynameis",datas)
      })
  }
  accno : any
  bankname : any
   ifsccode : any
  creditbank_id:any
  branchname:any
  paymentdetails:any
  getsuppaydet(pay)
  {
    // this.DtpcService.getpaymode(pay)
    // .subscribe(results=>{
    //   let datas=results["data"];
    //   this.PayDetailList=datas;
    // })
  
    console.log("payyyyy",pay)
    this.accno = pay.account_no
    this.bankname = pay.bank_id.name
    this.branchname=pay.branch_id?pay.branch_id.name:''
    this.ifsccode = pay.bank_id?pay.branch_id.ifsccode:''
    this.creditbank_id=pay.id
    this.paymentdetails=pay?.paymode_acc
    
    console.log("formslist123",this.paymentdetails)
    this.losheaderform.patchValue({
       accno:pay?.account_no,
      paymode_id:pay?.paymode_id?.id,
       branchname:pay?.branch_id.name,
       ifsccode:pay?.branch_id?.ifsccode,
      creditbank_id:pay?.id,
      paymentdetails:pay?.paymode_acc
      // accno:pay?.account_no,
      //  paymode_id:pay?.paymode_id?.id,
      //  creditbank_id:pay?.creditbank_id

     })
     if (this.accno == 0||this.ifsccode== ''||this.bankname== '') 
     {
      this.toastr.warning('The Amount is Empty....Please Choose Valid AccountNumber');
      this.losheaderform.controls['payment_detail'].reset(""); 
     }
  }
 
 
  numberOnlyandDot(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  amountcondition() {
    let d:any=Number(((this.losdetailsform.get('invoice_details_data') as FormArray).at(0) as FormGroup).get('invoice_details_balance_amount').value);
    let b_amt:any=Number(((this.losdetailsform.get('invoice_details_data') as FormArray).at(0) as FormGroup).get('Unitprice').value);
    if(d<b_amt){
      this.toastr.warning('Please Check The Amount');

    }
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  only_numalpha(event) {
    var k;
    k = event.charCode;
    // return ((k > 96 && k < 123) || (k >= 48 && k <= 57));
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  numberOnlyandDotminus(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57) && ((charCode < 45 || charCode > 46))) {
      return false;
    }
    return true;
  }
  Rvalue: number = 0;
  Ovalue: number = 0;
  min: number = -1;
  max: number = 1;
  RoundingOFF(e) {
    if (e >= this.max) {
      // this.Rvalue = 0
      this.losdetailsform.patchValue({
        Roundoffamt: 0
      })
      this.toastr.warning("Should not exceed one rupee");
      return false
    }
    else if (e <= this.min) {
      // this.Rvalue = 0
      this.losdetailsform.patchValue({
        Roundoffamt: 0
      })
      this.toastr.warning("Please enter valid amount");
      return false
    }
    // else if (e < this.max) {
    //   this.Rvalue = e
    // }
  }
  OtherAdjustment(e) {
    // if (e > this.max) {
    //   this.Ovalue = 0
    //   this.toastr.warning("Should not exceed one rupee");
    //   return false
    // }
    // if (e < this.min) {
    //   this.Ovalue = 0
    //   this.toastr.warning("Please enter valid amount");
    //   return false
    // }
    // if (e < this.max) {
    //   this.toastr.warning("Amount Should be greater than or equal to one rupee");
    //   return false
      // this.Ovalue = e
      // this.losheaderform.controls['Roundoff'].setValue((this.igstrate), { emitEvent: false });
      // this.losheaderform.controls("")
    // }
  }
  SelectSuppliersearch() {
    let searchsupplier = this.SelectSupplierForm.value;
    if (searchsupplier.code === "" && searchsupplier.panno === "" && searchsupplier.gstno === "") {
      this.getsuppliername("", "");
    }
    else {
      this.alternate = true;
      this.default = false;
      this.Testingfunctionalternate();
    }
  }
  searchsupplier:any;
  Testingfunctionalternate() {
    this.searchsupplier = this.SelectSupplierForm.value;
    this.DtpcService.getgrnselectsupplierSearch(this.searchsupplier)
      .subscribe(result => {
        if(result['data']?.length > 0){
        this.supplierid = result.data.id
        this.selectsupplierlist = result.data
        this.successdata = this.selectsupplierlist
        if (this.searchsupplier?.gstno?.length == 15 || this.searchsupplier?.panno?.length == 10 || this.searchsupplier?.code != "") {
          let supplierdata = {
            "id": this.selectsupplierlist[0]?.id,
            "name": this.selectsupplierlist[0]?.name
          }
          this.supplierid = supplierdata?.id
          this.SelectSupplierForm.patchValue({ name: supplierdata })
          this.getsupplierView(supplierdata)
        }
      }else{
        this.notify.showError("No Records Found");
        this.dataclear();
        return false;
      }

      })
  }
    
  copypaste(event:ClipboardEvent,data:any) {
  event.preventDefault();
    const pastedText = event.clipboardData?.getData('text/plain');
    if (pastedText) {
      const specialCharactersRegex = /[^a-zA-Z0-9\s]+/;
    const containsSpecialCharacters = specialCharactersRegex.test(pastedText);
     const trimmedText = pastedText.trim();
      this.losheaderform.patchValue({Remarks:trimmedText});
      console.log(trimmedText);
      if(containsSpecialCharacters)
      {
        alert("Special Characters is not Allowed");
        
      }
    }
  }
  
  dataclear() {
    this.SelectSupplierForm.controls['gstno'].reset("")
    this.SelectSupplierForm.controls['code'].reset("")
    this.SelectSupplierForm.controls['panno'].reset("")
    this.SelectSupplierForm.controls['name'].reset("")
    this.SupplierName = "";
    this.SupplierCode = "";
    this.SupplierGSTNumber = "";
    this.SupplierPANNumber = "";
    this.Address = "";
    this.line1 = "";
    this.line2 = "";
    this.line3 = "";
    this.City = "";
    this.suplist = "";
    this.JsonArray = [];
    this.alternate = false
    this.default = true
    this.submitbutton = false;
  }

  // Branchcallingfunction() {
  //   this.branchpatch()
  // }
  toggleFlag() {
    this.flag = !this.flag; 
  }
  value:any
  branchgstnumber1:any;
  suppliergstnumber1:any;
  gsttype:any;
  calculateGSTType:any
  submitcount=0
  Branchcallingfunction() {
    this.DtpcService.GetbranchgstnumberGSTtype(this.supplierid,this.branchappid)
      .subscribe((results) => {
        let datas = results;
        console.log("GST DEATAILS",datas);
        // this.branchgstnumber = this.edit_invoice_details.Branchgst
        // this.inputSUPPLIERgst = this.edit_invoice_details.Supplier.gstno
        this.branchgstnumber = datas.Branchgst
        this.suppliergstnumber=datas.Supgstno
        this.gsttype=datas.Gsttype
        this.submitcount++;
        if (this.submitcount == 3 && this.onbehalfoff == true && this.losheaderform.controls['behalf_branch'].value!="") {
          this.wholeformresetwithbehalf();
          this.notify.showWarning("Please Choose Payment Details")
          this.submitcount =0
        }
        if (this.submitcount == 2 && this.onbehalfoff == true && this.losheaderform.controls['behalf_branch'].value=="") {
          this.wholeformreset();
          this.notify.showWarning("Please Choose Payment Details")
          this.submitcount =0
        }
        if(this.submitcount ==2 && this.onbehalfoff == false)
        {
          this.wholeformreset()
          this.notify.showWarning("Please Choose Payment Details")
          this.submitcount =0
        }
        
       
      if(this.inputSUPPLIERgst === ""||this.inputSUPPLIERgst===null||this.inputSUPPLIERgst===undefined)
        {
        
        // this.losheaderform.get('invoice_header_gst_amount').patchValue(0); 
        this.losheaderform.get('invoice_header_gst_amount').disable();
        const invoiceDetailsArray = this.losdetailsform.get('invoice_details_data') as FormArray;
        invoiceDetailsArray.controls.forEach((control: FormGroup) => {
          control.patchValue({
            Hsn:{code: "00000000-0.0"},
            Hsn_percentage: 0
    
          });
          control.get('Hsn').disable();
          control.get('Hsn_percentage').disable();
        });
   
      }
      else{
        this.losheaderform.get('invoice_header_gst_amount').enable();
        const invoiceDetailsArray = this.losdetailsform.get('invoice_details_data') as FormArray;
        invoiceDetailsArray.controls.forEach((control: FormGroup) => {
        //   control.patchValue({         
        //   });
        control.get('Hsn').reset("");
        control.get('Hsn_percentage').reset("")
        control.get('Hsn').enable();
        control.get('Hsn_percentage').enable();
      });
          this.branchgstnumber1=this.branchgstnumber.slice(0,2);
          this.suppliergstnumber1=this.suppliergstnumber.slice(0,2);
          this.calculateGSTType(this.gsttype)
          {
          if(this.suppliergstnumber1==this.branchgstnumber1)
          {
            this.gsttype = this.sgstrate + this.cgstrate;
          }
          else
          {
            this.gsttype = this.igstrate;
          }
          return this.gsttype;
          console.log(this.gsttype)
        }
      
      }
      })
      
    this.inputSUPPLIERValue =  this.SupplierName;
    this.inputSUPPLIERStateid = this.StateID;
    this.inputSUPPLIERgst = this.SupplierGSTNumber;

    this.losheaderform.patchValue({
      Supplier_id: this.inputSUPPLIERValue,
      Supplierstate_id: this.inputSUPPLIERStateid,
      SupplierGSTNumber:this.inputSUPPLIERgst
    })
   
    if (this.inputSUPPLIERgst === "") 
    {
      this.HSNnontax = true;
      this.HSNtax = false;
      this.GSTtax = false;
      this.GSTnontax = true;
    }
    if (this.inputSUPPLIERgst !== "") {
      this.HSNtax = true;
      this.HSNnontax = false;
      this.GSTtax = true;
      this.GSTnontax = false;
    }
  }

  ResetFunction() {
    this.PayDetailList=[];
    this.losheaderform.controls['invoice_header_date'].reset("")
    this.losheaderform.controls['invoice_header_number'].reset("")
    this.losheaderform.controls['invoice_header_amount'].reset("")
    this.losheaderform.controls['invoice_header_gst_amount'].reset("")
    this.losheaderform.controls['Remarks'].reset("")
    this.losheaderform.controls['invoice_charge_type'].reset("")
    this.losheaderform.controls['Supplier_id'].reset("")
    this.losheaderform.controls['Supplierstate_id'].reset("")
    this.losheaderform.controls['Commodity_id'].reset("")
    this.losheaderform.controls['invoice_header_total_amount'].reset("")
    this.losheaderform.controls['behalf_branch'].reset("")
    this.losheaderform.controls['payment_detail'].reset(""); 
     this.losheaderform.controls['paymode_id'].reset("")
     this.losheaderform.controls['creditbank_id'].reset("")
     this.losheaderform.controls['ifsccode'].reset("")
     this.losheaderform.controls['branchname'].reset("")
     this.losheaderform.controls['accno'].reset("")
     this.branchgstnumber = "";
     this.inputSUPPLIERgst = "";
     
    this.dataclear()
   
  
  }
  @ViewChild('fileInput') fileInput: ElementRef;
  wholeformresetwithbehalf()
  {
    this.PayDetailList=[];
    this.losheaderform.controls['Supplier_id'].reset("")
    this.losheaderform.controls['Supplierstate_id'].reset("")
     this.losheaderform.controls['behalf_branch'].reset("")
      this.behalfbranchnamecode = ""
      this.losheaderform.controls['payment_detail'].reset(""); 
       this.losheaderform.controls['paymode_id'].reset("")
       this.losheaderform.controls['creditbank_id'].reset("")
       this.losheaderform.controls['ifsccode'].reset("")
       this.losheaderform.controls['branchname'].reset("")
       this.losheaderform.controls['accno'].reset("")
       this.branchgstnumber = "";
       this.inputSUPPLIERgst = "";
       
      this.dataclear()
  }
  wholeformreset()
  {
   
      this.PayDetailList=[];
      this.losheaderform.controls['Supplier_id'].reset("")
      this.losheaderform.controls['Supplierstate_id'].reset("")
      // this.losheaderform.controls['invoice_header_date'].reset("")
      // this.losheaderform.controls['invoice_header_number'].reset("")
      // this.losheaderform.controls['invoice_header_amount'].reset("")
      // this.losheaderform.controls['invoice_header_gst_amount'].reset("")
      // this.losheaderform.controls['Remarks'].reset("")
      // this.losheaderform.controls['invoice_charge_type'].reset("")
      // this.losheaderform.controls['Supplier_id'].reset("")
      // this.losheaderform.controls['Supplierstate_id'].reset("")
      // this.losheaderform.controls['Commodity_id'].reset("")
      // this.losheaderform.controls['invoice_header_total_amount'].reset("")
      // this.losheaderform.controls['behalf_branch'].reset("")
      // this.behalfbranchnamecode = ""
      this.losheaderform.controls['payment_detail'].reset(""); 
       this.losheaderform.controls['paymode_id'].reset("")
       this.losheaderform.controls['creditbank_id'].reset("")
       this.losheaderform.controls['ifsccode'].reset("")
       this.losheaderform.controls['branchname'].reset("")
       this.losheaderform.controls['accno'].reset("")
      //  this.fileData= null;
      //  this.fileName ="";
       this.branchgstnumber = "";
       this.inputSUPPLIERgst = "";
       
      this.dataclear()
    //   const invoiceDetailsArray1 = this.losdetailsform.get('invoice_details_data') as FormArray;
    //   invoiceDetailsArray1.controls.forEach((control: FormGroup) => {
    //     control.get('invoice_details_app_no').reset("");
    //     control.get('invoice_details_balance_amount').reset("");
    //     control.get('Productname').reset("");
    //     control.get('Description').reset("");
    //     control.get('Hsn').reset("");
    //     control.get('Hsn_percentage').reset("");
    //     control.get('bs_code').reset("");
    //     control.get('cc_code').reset("");
    //     control.get('Unitprice').reset("");
    //     control.get('Quantity').reset("");
    //     control.get('invoice_details_amount').reset("");
    //     control.get('Sgst').reset("");
    //     control.get('Cgst').reset("");
    //     control.get('Igst').reset("");
    //     control.get('invoice_details_gst_amount').reset("");
    //     control.get('invoice_details_total_amount').setValue("0.00");
    //     control.get('is_check').reset("");
    //     control.get('Roundoffamt').reset("")

  
    //     this.detail_total = 0.00;
    //     invoiceDetailsArray1.clear()
      
    // })
    // this.fileInput.nativeElement.value = '';
    
  }
  commoditypatchfunction(data) {
    this.CommodityName = 'Banking Ops Services (Engaged Vendor/Agreement in Place)'
    this.losheaderform.patchValue({
      Commodity_id: this.CommodityName
    })
  }
  //----------------------------------------------------------------------------------------
  ////////////////////////content editor
  config: any = {
    airMode: false,
    tabDisable: true,
    popover: {
      table: [
        ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
        ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
      ],
      link: [['link', ['linkDialogShow', 'unlink']]],
      air: [
        [
          'font',
          [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'superscript',
            'subscript',
            'clear',
          ],
        ],
      ],
    },
    height: '200px',
    // uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
      [
        'font',
        [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'superscript',
          'subscript',
          'clear',
        ],
      ],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']],
    ],
    codeviewFilter: true,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true,
  };

  editorDisabled = false;

  get sanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.losheaderform.get('html').value);
  }


  enableEditor() {
    this.editorDisabled = false;
  }

  disableEditor() {
    this.editorDisabled = true;
  }

  onBlur() {
    // console.log('Blur');
  }

  onDelete(file) {
    // console.log('Delete file', file.url);
  }

  summernoteInit(event) {
    // console.log(event);
  }


  //----------------------------------------------------------------------------------------
  getbsidd:any
  getbsid(data){
    this.getbsidd = data.id
    // console.log("bsid",this.getbsidd)
    this.getcc("")
  }
  
  
  
  addItem_Edit(data) {
    const control = <FormArray>this.losdetailsform.get('invoice_details_data');
    control.push(this.createItem_Edit(data));
  }

  changed() {
    // console.log("haiiii", this.isChecked)
    if (this.isChecked == true) {
      // console.log("hai")
    } else {
      // console.log("hai not")
    }
  }
  // e.target.checked

  createItem_Edit(data) {

    let group = new FormGroup({
      invoice_details_amount: new FormControl(data.Invoice_Amt),
      invoice_details_gst_amount: new FormControl(data.Gst_Amt),
      invoice_details_total_amount: new FormControl(data.Invoice_Total_Amt),
      invoice_details_balance_amount: new FormControl(data.Balance_Amt),
      invoice_details_app_no: new FormControl(data.Loan_Application),
      Productname: new FormControl(data.Productname),
      Productcode: new FormControl(data.Productcode),
      Hsn: new FormControl(data.Hsn),
      Hsn_percentage: new FormControl(data.Hsn_percentage),
      Uom: new FormControl(data.Uom),
      bs_code: new FormControl(),
      cc_code: new FormControl(),
      Quantity: new FormControl(data.Quantity),
      Unitprice: new FormControl(data.Unitprice),
      Description: new FormControl(data.Description),
      Sgst: new FormControl(data.Sgst),
      Igst: new FormControl(data.Igst),
      Cgst: new FormControl(data.Cgst),
      paymode_id:new FormControl(data.paymode_id),
      creditbank_id:new FormControl(data.creditbank_id),
      ifsccode:new FormControl(data.ifsccode),
      branchname:new FormControl(data.branchname),
      accno:new FormControl(data.accno),
      Remarks:new FormControl(data.Remarks),
      paymentdetails:new FormControl
    })
    group.get('invoice_details_app_no').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      if (value.id) {
        value = this.get_application_loan_balance(value, group);
        // return value;
      }

      this.SpinnerService.hide();
      if (!this.losdetailsform.valid) {
        return;
      }
      this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
    }
    )

    group.get('Hsn').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      if (value) {
        value = this.gethsnper(value, group);
      }

      this.SpinnerService.hide();
      if (!this.losdetailsform.valid) {
        return;
      }
      this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
    }
    )

    group.get('invoice_details_amount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      this.calcTotalM(group)
      if (!this.losdetailsform.valid) {
        return;
      }
      this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
    }
    )

    group.get('bs_code').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.DtpcService.getbsscroll(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.bsList = datas;
      this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
      // this.linesChange.emit(this.ThreeDetailed.value['invoicedetails']);
    })

    this.getbs("");

    group.get('cc_code').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.DtpcService.getccscroll(this.getbsidd,value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.ccList = datas;
      this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
      // this.linesChange.emit(this.ThreeDetailed.value['invoicedetails']);
    })

    this.getcc("");


    group.get('invoice_details_gst_amount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      this.calcTotalM(group)
      if (!this.losdetailsform.valid) {
        return;
      }
      this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
    }
    )

  
    group.get('invoice_details_app_no').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.DtpcService.get_CreateEditscreen_loanapp_dropdown(value, 1,this.branchappid)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.LoanAp = datas;
        this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
      })
    if(this.branchappid != undefined){
    this.Loanapplication("")
    }

    group.get('Hsn').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.DtpcService.gethsn(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.hsnList = datas;

        this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
        // this.linesChange.emit(this.ThreeDetailed.value['invoicedetails']);
      })
    this.gethsn("");

    group.get('bs_code').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.DtpcService.getbsscroll(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bsList = datas;
        this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
        // this.linesChange.emit(this.ThreeDetailed.value['invoicedetails']);
      })

      this.getbs("");

      group.get('cc_code').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.DtpcService.getccscroll(this.getbsidd,value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.ccList = datas;
      this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
      // this.linesChange.emit(this.ThreeDetailed.value['invoicedetails']);
    })

    this.getcc("");
    group.get('Unitprice').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
      this.calcTotalM(group)
      // this.datasums()
      if (!this.losdetailsform.valid) {
        return;
      }
      this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
    }
    )

    group.get('Quantity').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
      this.calcTotalM(group)
      if (!this.losdetailsform.valid) {
        return;
      }
      this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
    }
    )

    group.get('Sgst').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      if (value) {
        value = this.ahit(value, group);
        // return value;
      }
      // console.log("should be called first")
      this.calcTotalM(group)
      if (!this.losdetailsform.valid) {
        return;
      }
      this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
    }
    )

    group.get('Cgst').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      if (value) {
        value = this.ahit(value, group);
        // return value;
      }
      // console.log("should be called first")
      this.calcTotalM(group)
      if (!this.losdetailsform.valid) {
        return;
      }
      this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
    }
    )

    group.get('Igst').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      if (value) {
        value = this.ahit(value, group);
        // return value;
      }
      // console.log("should be called first")
      this.calcTotalM(group)
      if (!this.losdetailsform.valid) {
        return;
      }
      this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
    }
    )
    return group
  }

  // getappdd() {
  //   let value: String = "";
  //   this.Loanapplication(value);
  //   this.losdetailsform.get('invoice_details_app_no').valueChanges
  //     .pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
  //       }),
  //       switchMap(value => this.DtpcService.get_CreateEditscreen_loanapp_dropdown(value, 1,this.branchappid)
  //       .pipe(
  //         finalize(() => {
  //           this.isLoading = false
  //         }),
  //       )
  //     )
  //   )
  //   .subscribe((results: any[]) => {
  //     let datas = results["data"];
  //     this.LoanAp = datas;
  //   })
  // }


  public displayFn(ApplicationClass?: ApplicationClass): string | undefined {
    // this.validate_application_fun(ApplicationClass)
    return ApplicationClass ? ApplicationClass.ApplNo +"-"+ApplicationClass.DrAcctName:undefined;
  }
  get ApplicationClass() {
    return this.losdetailsform.get('invoice_details_app_no');
  }
  Loanapplication(value) {
    this.SpinnerService.show()
    this.DtpcService.get_CreateEditscreen_loanapp_dropdown(value, 1,this.branchappid)
      .subscribe((result) => {
        this.SpinnerService.hide()
        let loanapdr = result['data'];
        // console.log("loanapphdr",loanapdr)
        // for(let i in loanapdr){
        //   let amountchk = loanapdr[i]?.balanceamt
        //   console.log("amountchk",amountchk)
        //   if(amountchk.length == 2){
        //     if(amountchk[0].Amount==0 && amountchk[1].Amount == 0){

        //     }
        //   }
       
        //   amountchk.forEach((element,index) => {
          
        // });
      // }
        this.LoanAp = loanapdr;
        // console.log(this.LoanAp)
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
  // getapplicationList(value) {
  //   this.SpinnerService.show()
  //   this.DtpcService.get_loanapp_dropdown1(value, 1)
  //     .subscribe((results) => {
  //       this.SpinnerService.hide()
  //       let datas = results["data"];
  //       this.LoanAp = datas;
  //     })
  // }

  add_invoice_header() {
    if (this.invoice_header_data.length == 0) {
      // let vendor_name = this.losheaderform.value.vendor.name;
      let Remarks = this.losheaderform.value.Remarks;
      let invoice_header_date = this.pipe.transform(this.losheaderform.value.invoice_header_date, 'yyyy-MM-dd');
      let invoice_header_amount = this.losheaderform.value.invoice_header_amount;
      let invoice_header_gst_amount = this.losheaderform.value.invoice_header_gst_amount;
      let invoice_charge_type = this.losheaderform.value.invoice_charge_type;
      let Supplier_id = this.losheaderform.value.Supplier_id;
      let Supplierstate_id = this.losheaderform.value.Supplierstate_id;
      this.losheaderform.value.Commodity_id = 7;
      let Commodity_id = this.losheaderform.value.Commodity_id
      let Otheramount = this.losheaderform.value.Otheramount;
      let Roundoffamt = this.losheaderform.value.Roundoffamt;
      let Notename = this.losheaderform.value.Notename;
      let paymode_id=this.losheaderform.value.paymode_id;
      let creditbank_id=this.losheaderform.value.creditbank_id
       let ifsccode=this.losheaderform.value.ifsccode
       let branchname=this.losheaderform.value.branchname
      let accno=this.losheaderform.value.accno


      this.header_total = Number(invoice_header_amount) + Number(invoice_header_gst_amount)
      // "vendor_id": vendor_id,
      this.invoice_header_data.push({
        "Remarks": Remarks,
        "invoice_header_date": invoice_header_date, "invoice_header_amount": invoice_header_amount,
        "invoice_header_gst_amount": this.losheaderform.value.invoice_header_gst_amount,
        "invoice_charge_type": invoice_charge_type, "Supplier_id": this.supplierid, "Supplierstate_id": this.stateid,
        "Commodity_id": Commodity_id, "Otheramount": Otheramount, "Roundoffamt": Roundoffamt, "Notename": Notename,
        "paymode_id": paymode_id,"creditbank_id":creditbank_id,"accno":accno,"ifsccode":ifsccode,"branchname":branchname
      });
      console.log("gfhgfj",invoice_header_gst_amount)
    }
    else {
      alert("Already Invoice Header Added...")
    }

  }

  createItem() {
    let group = new FormGroup({
      invoice_details_amount: new FormControl(''),
      invoice_details_gst_amount: new FormControl(''),
      invoice_details_total_amount: new FormControl(''),
      invoice_details_balance_amount: new FormControl('0'),
      invoice_details_app_no: new FormControl(''),
      Productname: new FormControl(''),
      Productcode: new FormControl(''),
      Hsn: new FormControl(''),
      Hsn_percentage: new FormControl(''),
      Uom: new FormControl(''),
      bs_code: new FormControl(''),
      cc_code: new FormControl(''),
      Quantity: new FormControl(''),
      Unitprice: new FormControl(''),
      Description: new FormControl(''),
      Sgst: new FormControl(0),
      Igst: new FormControl(0),
      Cgst: new FormControl(0),
      Is_Flag: new FormControl(''),
      is_check:new FormControl(false)
    })

    

    group.get('invoice_details_app_no').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      if (value.id) {
        value = this.get_application_loan_balance(value, group);
        // return value;
      }

      this.SpinnerService.hide();
      if (!this.losdetailsform.valid) {
        return;
      }
      this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
    }
    )

    group.get('Hsn').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      if (value) {
        value = this.gethsnper(value, group);
        // return value;
      }

      this.SpinnerService.hide();
      if (!this.losdetailsform.valid) {
        return;
      }
      this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
    }
    )

    group.get('invoice_details_amount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      this.calcTotalM(group)
      if (!this.losdetailsform.valid) {
        return;
      }
      this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
    }
    )

    group.get('bs_code').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.DtpcService.getbsscroll(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.bsList = datas;
      this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
      // this.linesChange.emit(this.ThreeDetailed.value['invoicedetails']);
    })

    this.getbs("");

    group.get('cc_code').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.DtpcService.getccscroll(this.getbsidd,value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.ccList = datas;
      this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
      // this.linesChange.emit(this.ThreeDetailed.value['invoicedetails']);
    })

    this.getcc("");

    group.get('invoice_details_gst_amount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      this.calcTotalM(group)
      if (!this.losdetailsform.valid) {
        return;
      }
      this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
    }
    )

    let suppliername: String = "";
    // this.getsuppliername(suppliername);
    group.get('invoice_details_app_no').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.DtpcService.get_CreateEditscreen_loanapp_dropdown(value, 1,this.branchappid)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.LoanAp = datas;
      })
    if(this.branchappid != undefined){
      this.Loanapplication("");
    }

    group.get('Hsn').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.DtpcService.gethsn(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.hsnList = datas;
        console.log(this.hsnList);
        // if (this.losdetailsform.value.invoice_details_data[0].Hsn_percentage==''||this.losdetailsform.value.invoice_details_data[0].Hsn_percentage==0){
        //   this.hsnList = datas[0];
        // }
        this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
        // this.linesChange.emit(this.ThreeDetailed.value['invoicedetails']);
      })
    this.gethsn("");

    group.get('bs_code').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.DtpcService.getbsscroll(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.bsList = datas;
      this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
      // this.linesChange.emit(this.ThreeDetailed.value['invoicedetails']);
    })

    this.getbs("");

    group.get('cc_code').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.DtpcService.getccscroll(this.getbsidd,value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.ccList = datas;
      this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
      // this.linesChange.emit(this.ThreeDetailed.value['invoicedetails']);
    })

    this.getcc("");

    group.get('Unitprice').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
      this.calcTotalM(group)
      // this.datasums()
      if (!this.losdetailsform.valid) {
        return;
      }
      this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
    }
    )

    group.get('Quantity').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
      this.calcTotalM(group)
      if (!this.losdetailsform.valid) {
        return;
      }
      this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
    }
    )

    group.get('Sgst').valueChanges.pipe(
     take(1),
    debounceTime(20)
    ).subscribe(value => {
      if (value) {
        value = this.ahit(value, group);
        // return value;
      }
      // console.log("should be called first")
      this.calcTotalM(group)
      if (!this.losdetailsform.valid) {
        return;
      }
      this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
    }
    )

    group.get('Cgst').valueChanges.pipe(
      take(1),
      debounceTime(20)
    ).subscribe(value => {
      if (value) {
        value = this.ahit(value, group);
        // return value;
      }
      // console.log("should be called first")
      this.calcTotalM(group)
      if (!this.losdetailsform.valid) {
        return;
      }
      this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
    }
    )

    group.get('Igst').valueChanges.pipe(
      take(1),
      // debounceTime(20)
    ).subscribe(value => {
      if (value) {
        value = this.ahit(value, group);
        // return value;
      }
      // console.log("should be called first")
      this.calcTotalM(group)
      if (!this.losdetailsform.valid) {
        return;
      }
      this.linesChange.emit(this.losdetailsform.value['invoice_details_data']);
    }
    )

    return group
  }

  delete_single_invoice(data, index) {
    this.invoice_header_data.splice(index, 1);
  }

  igstrate: any;
  sgstrate: any;
  cgstrate: any;
  multipleindex: any;
  editsupplierid: any;


  ahit(qty, group: FormGroup) {
    if(qty =="" || qty==undefined || qty==null){
      return false;
    }
    // this.altergstypefunction();1895
    this.filedisable = false;
    // console.log("this is qty", qty)
    let overalloffIND = this.losdetailsform.value.invoice_details_data;
    // console.log("array", overalloffIND)
    for (var i = 0; i < overalloffIND.length; i++) {
        this.hsncode = overalloffIND[i].Hsn?.code;
        this.unit = overalloffIND[i].Unitprice
      this.qty = overalloffIND[i].Quantity
      if (this.qty === null || this.qty === undefined) {
        this.qty = 0
      }
      overalloffIND[i].Hsn = this.hsncode
      if ((this.hsncode === "" || this.hsncode === undefined || this.hsncode === null)
        || (qty === "" || qty === undefined || qty === null)
        || (this.unit === "" || this.unit === undefined || this.unit === null)) {
        return false
      }


      if ((this.hsncode !== "" || this.hsncode !== undefined || this.hsncode !== null)
        || (qty !== "" || qty !== undefined || qty !== null)
        || (this.unit !== "" || this.unit !== undefined || this.unit !== null)) {
        // || (this.GSTType !== "" || this.GSTType !== undefined || this.GSTType !== null)

        if (this.GSTType === undefined) {
          this.GSTType = this.EditGSTtype
        }
        if(this.qty=="")
        {
          this.notify.showWarning("Please select Quantity")
          return false;
        }

        let json = {
          "code": this.hsncode,
          "unitprice": Number(this.unit),
          "qty": this.qty,
          "discount": 0,
          "type": this.gsttype
        }
        this.DtpcService.GSTcalculation(json)
        .pipe(
          take(1),
          debounceTime(1000)
        )
        .subscribe(result => {
            this.igstrate = result.igst;
            this.sgstrate = result.sgst;
            this.cgstrate = result.cgst;
            // let d:any=Number(((this.losdetailsform.get('invoice_details_data') as FormArray).at(0) as FormGroup).get('invoice_details_balance_amount').value);
            // let b_amt:any=Number(((this.losdetailsform.get('invoice_details_data') as FormArray).at(0) as FormGroup).get('invoice_details_total_amount').value);
            // if(d<b_amt){
            //   this.toastr.warning('Please Check The Amount');

            // }

            const invoiceDetailsArray = this.losdetailsform.get('invoice_details_data') as FormArray;
            invoiceDetailsArray.controls.forEach((itemFormGroup: FormGroup) => {
            itemFormGroup.patchValue({
              Sgst: this.sgstrate,
              Cgst: this.cgstrate,
              Igst: this.igstrate,
            });
          });
            // ((this.losdetailsform.get('invoice_details_data') as FormArray).at(0) as FormGroup).patchValue({
            //   Sgst: this.sgstrate,
            //   Cgst: this.cgstrate,
            //   Igst: this.igstrate,
            // });
            
            // group.controls['invoice_details_balance_amount'].setValue((this.resultamount), { emitEvent: false });
            // group.controls['Igst'].setValue((this.igstrate), { emitEvent: false });
            // group.controls['Sgst'].setValue((this.sgstrate), { emitEvent: false });
            // group.controls['Cgst'].setValue((this.cgstrate), { emitEvent: false });
          });
    
      }
    }
  }
  // Number(this.losheaderform.value.invoice_header_gst_amount) > Number(this.losheaderform.value.invoice_header_amount)
  calculate_header_total(data) {
    // this.losheaderform.value.invoice_header_total_amount=this.losheaderform.value.invoice_header_amount;
    let taxableamount = this.losheaderform.value.invoice_header_amount
    let gstamount = this.losheaderform.get('invoice_header_gst_amount').value;
    let GSTcalc = taxableamount * 28 / 100
    if (gstamount > GSTcalc) {
      this.header_total = 0;
      this.losheaderform.patchValue({
        "invoice_header_total_amount": this.header_total.toFixed
      })
      this.toastr.warning("Actual GST amount is not correct");
   
    }
    else {
       
      this.header_total = Number(this.losheaderform.value.invoice_header_amount) + Number(this.losheaderform.get('invoice_header_gst_amount').value);
      this.losheaderform.patchValue({
        "invoice_header_total_amount": this.header_total.toFixed(2)
      })
    }
    if(gstamount===null||gstamount===undefined||gstamount===0)
    
    {
      this.losheaderform.patchValue({
        "invoice_header_total_amount":taxableamount
      })
      
    }
    else {
      this.header_total = Number(this.losheaderform.value.invoice_header_amount) + Number(this.losheaderform.get('invoice_header_gst_amount').value);
      this.losheaderform.patchValue({
        "invoice_header_total_amount": this.header_total
      })
    }
  }



  ////////////////////////////////////////////calculation
  totoOverall: any;

  calcTotalM(group: FormGroup) {
     let taxableamount = this.losheaderform.value.invoice_header_amount
    // = this.losheaderform.value.invoice_header_gst_amount
    let gstamount =this.losheaderform.get('invoice_header_gst_amount').value;
    if (this.losheaderform.get('invoice_header_gst_amount').disabled) {
      this.losheaderform.get('invoice_header_gst_amount').setValue(0);
      }
    const qty = group.controls['Quantity'].value;
    const unitprice = group.controls['Unitprice'].value;
    this.tototaxable = qty * unitprice
    group.controls['invoice_details_amount'].setValue((this.tototaxable));
    if (this.inputSUPPLIERgst === ""||this.inputSUPPLIERgst===undefined||this.inputSUPPLIERgst===null) {
      this.sgstrate = 0;
      this.igstrate = 0;
      this.cgstrate = 0;
      const invoiceDetailsArray1 = this.losdetailsform.get('invoice_details_data') as FormArray;
     invoiceDetailsArray1.controls.forEach((control: FormGroup) => {
     control.patchValue({
         "invoice_details_total_amount": this.tototaxable,
        "invoice_details_gst_amount": 0,
     });
     });
    }

    
    else{
      this.totoTax = this.sgstrate + this.cgstrate + this.igstrate
        // const sgstrateValue = Number(this.sgstrate) || 0;
        // const cgstrateValue = Number(this.cgstrate) || 0;
        // const igstrateValue = Number(this.igstrate) || 0;
    
    // console.log("tax amount", this.sgstrate)
    // console.log("tax amount", this.cgstrate)
    // console.log("tax amount", this.igstrate)
    // console.log("sdghdfujhdjdshudydhjge", this.totoTax)
    group.controls['invoice_details_gst_amount'].setValue((this.totoTax));
    }
    const INVamt = this.tototaxable
    // console.log("value1", INVamt)
    if(this.totoTax===undefined)
    {
     this.totoTax=0
    }
    const INVtaxamt = this.totoTax
    // console.log("value2", INVtaxamt)
    let Ramt = this.losdetailsform.value.Roundoffamt
    let Oamt = this.losdetailsform.value.Otheramount
    if (Ramt === undefined || Oamt === undefined) {
      Ramt = 0
      Oamt = 0
    }
    let roundOffandOther = Ramt + Oamt
    this.totoOverall = INVamt + INVtaxamt + roundOffandOther;
    // console.log("value3", group.controls['invoice_details_total_amount'])

    let details_balance_amount = +group.controls['invoice_details_balance_amount'].value;
    // console.log("balance", details_balance_amount)

    // if (details_balance_amount < this.totoOverall) {
    //   this.toastr.warning("", "Total Amount is Greater than Balance Amount!...", { timeOut: 4000 });
    //   group.controls['invoice_details_amount'].setValue((""), { emitEvent: false });
    //   group.controls['invoice_details_gst_amount'].setValue((""), { emitEvent: false });
    //   return false;
    // }
    if(gstamount === 0||gstamount===undefined ||gstamount===null)
    {
    //   const invoiceDetailsArray1 = this.losdetailsform.get('invoice_details_data') as FormArray;
    //  invoiceDetailsArray1.controls.forEach((control: FormGroup) => {
    //  control.patchValue({
    // // "invoice_details_gst_amount": 0,
    // "invoice_details_total_amount": this.tototaxable,
    //  });
    //  });
    group.controls['invoice_details_total_amount'].setValue((this.tototaxable).toFixed(2), { emitEvent: false });
    this.INVdatasums();
     
     }
      else {
    group.controls['invoice_details_total_amount'].setValue((this.totoOverall).toFixed(2), { emitEvent: false });
    this.INVdatasums();
    }
  }
//this.tototaxable,
  INVamt: any;
  INVsum: any;
  INVdatasums() {
    if (this.losheaderform.get('invoice_header_gst_amount').disabled) {
      this.INVamt = this.losdetailsform.value['invoice_details_data'].map(x => parseFloat(x.invoice_details_total_amount));
      this.INVsum = this.INVamt.reduce((a, b) => a + b, 0);
    } else {
      this.INVamt = this.losdetailsform.value['invoice_details_data'].map(x => x.invoice_details_total_amount);
    
    // console.log('data check amt', this.INVamt);
    this.INVsum = this.INVamt.reduce((a, b) => a + b, 0);
    this.INVsum = parseInt(this.INVsum);
    }
    // console.log('sum of total ', this.INVsum);
    // let Ramt = this.losdetailsform.value.Roundoffamt
    // let Oamt = this.losdetailsform.value.Otheramount
    // if (Ramt === undefined || Oamt === undefined) {
    //   Ramt = 0
    //   Oamt = 0
    // }
    // //-----------------------------------------------------------------------------------------------------------------------------------------------------
    // let roundOffandOther = Ramt + Oamt
    // //-----------------------------------------------------------------------------------------------------------------------------------------------------
    this.detail_total = this.INVsum;
  }
  //-------------------------------------------------------------------------------------------------------


  // calculate_single_detail_total(group: FormGroup) {
  //   const qty = +group.controls['Quantity'].value;
  //   const unitprice = +group.controls['Unitprice'].value;
  //   this.tototaxable = qty * unitprice
  //   group.controls['invoice_details_amount'].setValue((this.tototaxable));

  //   // }
  //   // calcTotalT(group: FormGroup) {
  //   // const SGST = +group.controls['Sgst'].value;
  //   // console.log("sgst",SGST)
  //   // const CGST = +group.controls['Cgst'].value;
  //   // console.log("cgst",CGST)

  //   this.totoTax = this.sgstrate + this.cgstrate + this.igstrate
  //   console.log("tax amount", this.totoTax)
  //   group.controls['invoice_details_gst_amount'].setValue((this.totoTax));
  //   // }


  //   let detail_amount = +group.controls['invoice_details_amount'].value;
  //   console.log("taxable", detail_amount)
  //   let detail_gst_amount = +group.controls['invoice_details_gst_amount'].value;
  //   console.log("tax", detail_gst_amount)
  //   let details_balance_amount = +group.controls['invoice_details_balance_amount'].value;
  //   console.log("balance", details_balance_amount)
  //   let single_detail_total = detail_amount + detail_gst_amount
  //   if (details_balance_amount < single_detail_total) {
  //     // alert("Total Amount is Greether than Balance Amount!...") + this.Rvalue  + this.Ovalue
  //     this.toastr.warning("", "Total Amount is Greater than Balance Amount!...", { timeOut: 4000 });
  //     group.controls['invoice_details_amount'].setValue((""), { emitEvent: false });
  //     group.controls['invoice_details_gst_amount'].setValue((""), { emitEvent: false });
  //     return false;

  //   }
  //   else {
  //     group.controls['invoice_details_total_amount'].setValue((single_detail_total), { emitEvent: false });
  //     this.net_detail_total();
  //   }
  // }
  // net_detail_total() {
  //   let total = 0;
  //   let all_details_data = this.losdetailsform.value.invoice_details_data;
  //   for (let i = 0; i < all_details_data.length; i++) {
  //     total = total + Number(all_details_data[i].invoice_details_total_amount)
  //   }
  //   //-----------------------------------------------------------------------------------------------------------------------------------------------------
  //   let roundOffandOther = this.losdetailsform.value.Roundoffamt + this.losdetailsform.value.Otheramount
  //   //-----------------------------------------------------------------------------------------------------------------------------------------------------
  //   this.detail_total = total + roundOffandOther;

  // }
  validate_application_fun(app_no) {
    let temp_details_data1 = this.losdetailsform.value.invoice_details_data;
    let duplicate = 0;
    for (let i = 0; i < temp_details_data1.length; i++) {
      if (app_no == temp_details_data1[i].invoice_details_app_no.ApplNo) {
        duplicate++;
      }
    }
    if (duplicate > 1) {
      return false;
    }
  }
  defaultcheck = true
  alternatecheck = false
  isDisable = [true]
  disabled = true
  checked = true
  get_application_loan_balance(value, group: FormGroup) {

    let temp_details_data = this.losdetailsform.value.invoice_details_data;
    let is_app_number_duplicate = 0;
    for (let i = 0; i < temp_details_data.length; i++) {
      if (value.ApplNo == temp_details_data[i].invoice_details_app_no.ApplNo) {
        is_app_number_duplicate++;
      }
    }
    if (is_app_number_duplicate > 1) {
      this.SpinnerService.hide();
      group.controls['invoice_details_app_no'].setValue((""), { emitEvent: false });
      this.toastr.warning("Please Select Another Application Number", "Duplicate Application Number", { timeOut: 4000 });
      // alert("Duplicate Application Number");
      return false;
    }
    if (value.id) {
      this.SpinnerService.show();
      let data = { "Invoice_Charge_type": this.losheaderform.value.invoice_charge_type }
      this.DtpcService.get_loanapp_balance(value.id, data)
        .subscribe((result) => {
          // console.log("resssss", result)
          this.SpinnerService.hide();
          this.resultamount = result.Amount
          this.resultbalanceamount = result.Balance_Amt

          if (
            // this.losheaderform.value.Commodity_id === ""
            // this.losheaderform.value.Remarks === ""
            this.losheaderform.value.Supplier_id === ""
            || this.losheaderform.value.Supplierstate_id === ""
            || this.losheaderform.value.invoice_charge_type === ""
            || this.losheaderform.value.invoice_header_amount === ""
            || this.losheaderform.value.invoice_header_date === ""
            || this.losheaderform.value.invoice_header_gst_amount === ""
            || this.losheaderform.value.invoice_header_number === ""
            || this.losheaderform.value.behalf_branch === "" 
            ||this.losheaderform.value.accno===""
            ||this.losheaderform.value.creditbank_id===""
             ||this.losheaderform.value.ifsccode===""
             ||this.losheaderform.value.branchname===""
            
            
          ) 
          {
            console.log(group.controls['invoice_details_balance_amount'])
            group.controls['invoice_details_balance_amount'].setValue((this.resultamount).toFixed(2), { emitEvent: false });
            // this.toastr.warning("Warning Message", "Please Fill Invoice Header Details Properly ", { timeOut: 4000 });
            // return false;
          }
          
          if (this.resultamount !== "" && this.resultbalanceamount === undefined) {
            if (group.get('invoice_details_balance_amount')) {
              group.get('invoice_details_balance_amount').setValue((this.resultamount).toFixed(2));
            }
            group.controls['invoice_details_balance_amount'].setValue((this.resultamount).toFixed(2), { emitEvent: false });
            let balancetottal = this.resultamount - this.header_total
            if (balancetottal == 0) {
              let totalLines = this.losdetailsform.value.invoice_details_data
              for (let i = 0; i < totalLines.length; i++) {
                this.isDisable[i] = false
              }
            }
            else {
              let totalLines = this.losdetailsform.value.invoice_details_data
              for (let i = 0; i < totalLines.length; i++) {
                this.isDisable[i] = true
              }
            }
          }
          // else {
          //   group.controls['invoice_details_balance_amount'].setValue((""), { emitEvent: false });
          //   this.toastr.warning(result.code, result.description, { timeOut: 4000 });
          //   return false;
          // }
          if (this.resultamount !== "" && this.resultbalanceamount !== undefined && this.resultbalanceamount !== null) {
            group.controls['invoice_details_balance_amount'].setValue((this.resultbalanceamount).toFixed(2), { emitEvent: false });
            let balancetottal = this.resultbalanceamount - this.header_total
            if (balancetottal == 0) {
              let totalLines = this.losdetailsform.value.invoice_details_data
              for (let i = 0; i < totalLines.length; i++) {
                this.isDisable[i] = false
              }
            }
            else {
              let totalLines = this.losdetailsform.value.invoice_details_data
              for (let i = 0; i < totalLines.length; i++) {
                this.isDisable[i] = true
              }
            }
          }

          if (result.code === "Invoice Not Created for this Application Number"
            && result.description === "Check Balance Amount in Loan Charges") {
            this.toastr.warning("Please Choose Another Application Number", "For this Application Number Legal or Valuation Fee not Available,", { timeOut: 4000 });
            return false;
          }

          // else {
          //   group.controls['invoice_details_balance_amount'].setValue((""), { emitEvent: false });
          //   this.toastr.warning(result.code, result.description, { timeOut: 4000 });
          //   return false;
          // }
          // group.controls['invoice_details_app_no'].setValue((""), { emitEvent: false });
          //alert(JSON.stringify(result))
          // let single_balance_Amount = result.Balance_Amt
          // if (single_balance_Amount) {
          //   group.controls['invoice_details_balance_amount'].setValue((single_balance_Amount), { emitEvent: false });
          // }
        })
    }

  }

  addItem() {
    // this.invoice_details_data = this.losdetailsform.get('invoice_details_data') as FormArray;
    // this.invoice_details_data.push(this.createItem());

    const control = <FormArray>this.losdetailsform.get('invoice_details_data');
    control.push(this.createItem());
  }

  getSections(form) {
    return form.controls.invoice_details_data.controls;
  }
  removeSection(i) {
    // if (confirm("Are you sure to delete ")) {
    const control = <FormArray>this.losdetailsform.get('invoice_details_data');
    control.removeAt(i);
    this.toastr.warning("If needed create another one.", "Row deleted", { timeOut: 4000 });
    // }
    // this.files.value.file_upload.splice(i)
  }
  los_summary() {
    this.onCancel.emit()
    // this.router.navigate(['/los'], { skipLocationChange: true })

  }
  searchAppNumber() {
    let data = this.losheaderform.value
    let loan_number = data.loan_number;
    this.DtpcService.get_application_number(loan_number).subscribe((results: any[]) => {
      //let single_data={"data":results}
      let single_datas = JSON.parse(JSON.stringify(results))
      if (single_datas.Message) {
        alert(JSON.stringify(single_datas))
        return false;
      }
      //let single_data1=single_data.toString()
      let TxnDate = single_datas.TxnDate;
      let latest_date = this.datepipe.transform(TxnDate, 'dd-MMM-yyyy');
      single_datas.TxnDate = latest_date
      this.multiple_application_data.push(single_datas);
      this.losheaderform.reset();
    })

  }
  // fileProgress(fileInput: any) {
  //   this.fileData = fileInput.target.files;
  //   this.fileName = this.fileData[0].file_name;
  // }
  onFileSelected(fileInput: any) {
    this.fileData = fileInput.target.files;
    this.fileName = this.fileData[0].name;
    this.submitdisable = false;
    this.draftdisable = false;
  }

  // onFileSelected(event) {
  //   if (event.target.files) {
  //     this.show_file = true;
  //     for (let i = 0; i < event.target.files.length; i++) {
  //       this.file.push(event.target.files[i])
  //       //this.fileToUpload.append('file',event.target.files[i])
  //     }
  //   }
  // }
  gethsnper(data, group: FormGroup) {
    console.log("%%%%%", data)
    this.hsnper = data.igstrate
    this.hsncode = data.code
    // console.log("qwqw", this.hsncode)
    // console.log("dataper", this.hsnper)
    group.controls['Hsn_percentage'].setValue((this.hsnper), { emitEvent: false });
    group.controls['Quantity'].setValue((""), { emitEvent: false });
    // this.losdetailsform.value.patchValue({
    //   Hsn_percentage: this.hsnper,
    // })
    // console.log("main and importnant",value)
  }

  public displayFnhsn(hsn?: hsnlistss): string | undefined {
    return hsn ? hsn.code : undefined;
  }

  get hsn() {
    return this.losdetailsform.get('Hsn');
  }
  gethsn(hsnkeyvalue) {
    this.DtpcService.gethsn(hsnkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.hsnpercentagevalue = datas.igstrate
        this.hsnList = datas;
        //  console.log("hsnList", datas)
        // this.commodityid = datas.id;
        // console.log("ccccccccccccccccccccccccccccccc",this.commodityid)
      })
  }
  public displayFnproduct(autopro?: productlists): string | undefined {
    return autopro ? autopro.name : undefined;
  }

  get autopro() {
    return this.losdetailsform.get('Productname');
  }
  getproducts(prokeyvalue) {
    this.DtpcService.getproduct(prokeyvalue)
      .subscribe(results => {
        let datas = results["data"];
        console.log("datas",datas)
        this.productlist = datas.filter(x=>x.name == "Advocate Fee");
        // || x.name == "Insurance Surveyor/Loss Assessor/Valuation charges"
        console.log("product",this.productlist)
      })
  }
  public displayFnbs(bstype?: bslistss): string | undefined {
    return bstype ? bstype.name : undefined;
  }

  get bstype() {
    return this.losdetailsform.get('bs_code');
  }
  getbs(bskeyvalue) {
    this.DtpcService.getbs(bskeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bsList = datas;
        // console.log("bsList", this.bsList)
        // this.commodityid = datas.id;
        // console.log("ccccccccccccccccccccccccccccccc",this.commodityid)
      })
  }

  bsScroll() {
    setTimeout(() => {
      if (
        this.matbsAutocomplete &&
        this.matbsAutocomplete &&
        this.matbsAutocomplete.panel
      ) {
        fromEvent(this.matbsAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbsAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbsAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbsAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbsAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.DtpcService.getbsscroll(this.bsInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.bsList.length >= 0) {
                      this.bsList = this.bsList.concat(datas);
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

  public displayFncc(cctype?: cclistss): string | undefined {
    return cctype ? cctype.name : undefined;
  }

  get cctype() {
    return this.losdetailsform.get('cc_code');
  }
  getcc(cckeyvalue) {
    this.DtpcService.getcc(this.getbsidd,cckeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ccList = datas;
        // console.log("ccList", this.ccList)
        // this.commodityid = datas.id;
        // console.log("ccccccccccccccccccccccccccccccc",this.commodityid)
      })
  }

  ccScroll() {
    setTimeout(() => {
      if (
        this.matccAutocomplete &&
        this.matccAutocomplete &&
        this.matccAutocomplete.panel
      ) {
        fromEvent(this.matccAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matccAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matccAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matccAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matccAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.DtpcService.getccscroll(this.getbsidd,this.ccInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.ccList.length >= 0) {
                      this.ccList = this.ccList.concat(datas);
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

  

  

  Paymentstatus(ind) {
    // console.log("paymentpop",e.value.checked)
    // console.log("paymentpop",e.MatCheckboxChange)
    var showpopup = this.losdetailsform.value.invoice_details_data[ind].is_check;
    console.log("showpopup",showpopup)
    if(showpopup){
      var paymentpop = window.confirm("Are you sure to proceed with Final Payment ?")
      console.log("paymentpop",paymentpop)
    }
    else{
      paymentpop = false;
    }
    
    if (paymentpop){
    if (this.losheaderform.value.invoice_charge_type === 'LEGAL_FEE' ) {
      // this.finalpaymentstatus = 1
      this.finalstat = { 'LEGAL_FEE': "true", 'VALU_FEE': 'false' }
      // console.log("status", this.finalstat)
    }
    else if (this.losheaderform.value.invoice_charge_type === 'VALU_FEE' ) {
      // this.finalpaymentstatus = 0
      this.finalstat = { 'LEGAL_FEE': "false", 'VALU_FEE': 'true' }
      // console.log("status", this.finalstat)
    }
    else {
      this.finalstat = { 'LEGAL_FEE': "false", 'VALU_FEE': 'false' }
      // console.log("status", this.finalstat)
    }}
    // this.finalstatus = data.value
    // console.log("value", this.finalpaymentstatus)
    else{
      (this.losdetailsform.get('invoice_details_data') as FormArray).at(ind).patchValue({
        is_check:false,
      });
      this.finalstat = { 'LEGAL_FEE': "false", 'VALU_FEE': 'false' }

    }
  }

  submit_loan_app(status) {
    let d:any=Number(((this.losdetailsform.get('invoice_details_data') as FormArray).at(0) as FormGroup).get('invoice_details_balance_amount').value);
    let b_amt:any=Number(((this.losdetailsform.get('invoice_details_data') as FormArray).at(0) as FormGroup).get('invoice_details_amount').value);
    if(b_amt > d ){
      this.toastr.warning('Please Check The Invoice Details Balance Amount and Invoice Details Total Amount');
      return false;
    }
    if (this.invoice_gid === "" || this.invoice_gid === null || this.invoice_gid === undefined) {
      // this.detail_total = 0;
      let Remarks = this.losheaderform.value.Remarks;
      let Invoice_Date = this.pipe.transform(this.losheaderform.value.invoice_header_date, 'yyyy-MM-dd');
      let Invoice_Amt = this.losheaderform.value.invoice_header_amount;
      let Gst_Amt = this.losheaderform.get('invoice_header_gst_amount').value
      let Invoice_No = this.losheaderform.value.invoice_header_number;
      let Invoice_Charge_type = this.losheaderform.value.invoice_charge_type;
      let Supplier_id = this.losheaderform.value.Supplier_id;
      let Supplierstate_id = this.losheaderform.value.Supplierstate_id;
      let Commodity_id = 7;
      let Otheramount = this.losheaderform.value.Otheramount;
      let Roundoffamt = this.losheaderform.value.Roundoffamt;
      let Notename = this.losheaderform.value.Notename;
      let File = this.losheaderform.value.file;
      let accno = this.losheaderform.value.payment_detail.account_no;
      let creditbank_id=this.losheaderform.value.creditbank_id;
       let ifsccode=this.losheaderform.value.ifsccode;
       let branchname=this.losheaderform.value.branchname;
      let paymode_id=this.losheaderform.value.paymode_id
      let paymentdetails=this.losheaderform.value.paymentdetails
      let Total_Header_Amout = Number(Invoice_Amt) + Number(Gst_Amt)
      let behalf_branch = this.branchappid
    

     this.header_total=Total_Header_Amout.toFixed(2)

      let details_data = this.losdetailsform.value.invoice_details_data;
      // console.log("details data ", details_data)
      let final_details_data = [];
      let balancecharge_data = [];
      let files = [];

      if (this.file.length > 0) {
        for (let i = 0; i < this.file.length; i++) {
          this.fileToUpload.append('file', this.file[i])
        }
      }

      for (let i = 0; i < details_data.length; i++) {
        this.HSNcodesssssss = details_data[i]?.Hsn?.id
        if (this.inputSUPPLIERgst === ""|| this.inputSUPPLIERgst===null) {
          this.HSNcodesssssss = 1;
          this.hsnper = 0;
        }
        final_details_data.push({
          // "Vendor_id": Vendor_id,
          "Loan_Application_id": details_data[i].invoice_details_app_no.id,
          "Invoice_Amt": details_data[i].invoice_details_amount, "Gst_Amt": details_data[i].invoice_details_gst_amount,
          "Invoice_Total_Amt": details_data[i].invoice_details_total_amount, "Balance_Amt": details_data[i].invoice_details_balance_amount,
          "Cgst": this.cgstrate, "Description": details_data[i].Description, "Hsn": this.HSNcodesssssss, "Hsn_percentage": this.hsnper, "Igst": this.igstrate,
          "Productcode": 0, "Productname": details_data[i].Productname, "Quantity": details_data[i].Quantity, "Sgst": this.sgstrate,
          "Unitprice": details_data[i].Unitprice, "Uom": "Number",
          "bs_code": details_data[i].bs_code.id,"cc_code":details_data[i].cc_code.id,
          "Is_Flag": this.finalstat
        })
        
        // Hsn:{code: "00000000-0.0"},
        //     Hsn_percentage:0,{code: "00000000-0.0"}details_data[i].invoice_details_gst_amount
        balancecharge_data.push({ "Loan_Application_id": details_data[i].invoice_details_app_no.id })
        //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // let roundAndOther = this.losdetailsform.value.Roundoffamt + this.losdetailsform.value.Otheramount
        //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // this.detail_total += Number(details_data[i].invoice_details_total_amount) + roundAndOther
      }
      if (
        // this.losheaderform.value.Commodity_id === ""
        //   this.losheaderform.value.Remarks === ""
           this.losheaderform.value.Supplier_id === ""
        || this.losheaderform.value.Supplsubmit_loan_appierstate_id === ""
        || this.losheaderform.value.invoice_charge_type === ""
        || this.losheaderform.value.invoice_header_amount === ""
        || this.losheaderform.value.invoice_header_date === ""
        || this.losheaderform.value.invoice_header_gst_amount === ""
        || this.losheaderform.value.invoice_header_number === ""
        || this.losheaderform.value.behalf_branch === "" 
        || this.losheaderform.value.paymode_id === "" 
        || this.losheaderform.value.creditbank_id === "" 
         || this.losheaderform.value.ifsccode === "" 
         ||this.losheaderform.value.branchname ===""
        || this.losheaderform.value.accno === "" 
        // || this.losheaderform.value.accno === undefined
        || this.losheaderform.value.accno === null 
        || this.losheaderform.value.ifsccode === undefined
        // || this.losheaderform.value.ifsccode === null
        // || this.losheaderform.value.paymentdetails === ""
        // || this.losheaderform.value.paymentdetails === null
        // || this.losheaderform.value.paymentdetails === undefined
        // paymentdetails

        
      ) {
        this.toastr.warning("Warning Message", "Please Fill Invoice Header Details Properly", { timeOut: 4000 });
        return false;
      }
      for (i = 0; i < details_data.length; i++) {
        if (this.inputSUPPLIERgst === "") {
          if (
            details_data[i].Cgst === ""
            || details_data[i].Cgst === null
            || details_data[i].Cgst === undefined
            || details_data[i].Description === ""
            || details_data[i].Description === null
            || details_data[i].Description === undefined
            // || details_data[i].Hsn === ""
            // || details_data[i].Hsn_percentage === ""
            || details_data[i].Igst === ""
            || details_data[i].Igst === null
            || details_data[i].Igst === undefined
            || details_data[i].Productname === ""
            || details_data[i].Productname === null
            || details_data[i].Productname === undefined
            || details_data[i].Quantity === ""
            || details_data[i].Quantity === null
            || details_data[i].Quantity === undefined
            || details_data[i].Sgst === ""
            || details_data[i].Sgst === null
            || details_data[i].Sgst === undefined
            || details_data[i].Unitprice === ""
            || details_data[i].Unitprice === null
            || details_data[i].Unitprice === undefined
            || details_data[i].Uom === ""
            || details_data[i].Uom === null
            || details_data[i].Uom === undefined
            || details_data[i].bs_code === ""
            || details_data[i].bs_code === null
            || details_data[i].bs_code === undefined
            || details_data[i].cc_code === ""
            || details_data[i].cc_code === null
            || details_data[i].cc_code === undefined
            || details_data[i].invoice_details_amount === ""
            || details_data[i].invoice_details_amount === null
            || details_data[i].invoice_details_amount === undefined
            || details_data[i].invoice_details_app_no === ""
            || details_data[i].invoice_details_app_no === null
            || details_data[i].invoice_details_app_no === undefined
            || details_data[i].invoice_details_balance_amount === ""
            || details_data[i].invoice_details_balance_amount === null
            || details_data[i].invoice_details_balance_amount === undefined
            || details_data[i].invoice_details_gst_amount === ""
            || details_data[i].invoice_details_gst_amount === null
            || details_data[i].invoice_details_gst_amount === undefined
            // || details_data[i].invoice_details_gst_amount === NaN
            || details_data[i].invoice_details_total_amount === ""
            || details_data[i].invoice_details_total_amount === null
            || details_data[i].invoice_details_total_amount === undefined
            // || details_data[i].invoice_details_total_amount === NaN
          ) {
            this.toastr.warning("Warning Message", "Please Fill Invoice Details Properly", { timeOut: 4000 });
            return false;
          }
        }
        else if (
          details_data[i].Cgst === ""
          || details_data[i].Cgst === null
          || details_data[i].Cgst === undefined
          || details_data[i].Description === ""
          || details_data[i].Description === null
          || details_data[i].Description === undefined
          || details_data[i].Hsn === ""
          || details_data[i].Hsn === null
          || details_data[i].Hsn === undefined
          || details_data[i].Hsn_percentage === ""
          || details_data[i].Hsn_percentage === null
          || details_data[i].Hsn_percentage === undefined
          || details_data[i].Igst === ""
          || details_data[i].Igst === null
          || details_data[i].Igst === undefined
          || details_data[i].Productname === ""
          || details_data[i].Productname === null
          || details_data[i].Productname === undefined
          || details_data[i].Quantity === ""
          || details_data[i].Quantity === null
          || details_data[i].Quantity === undefined
          || details_data[i].Sgst === ""
          || details_data[i].Sgst === null
          || details_data[i].Sgst === undefined
          || details_data[i].Unitprice === ""
          || details_data[i].Unitprice === null
          || details_data[i].Unitprice === undefined
          || details_data[i].Uom === ""
          || details_data[i].Uom === null
          || details_data[i].Uom === undefined
          || details_data[i].bs_code === ""
          || details_data[i].bs_code === null
          || details_data[i].bs_code === undefined
          || details_data[i].cc_code === ""
          || details_data[i].cc_code === null
          || details_data[i].cc_code === undefined
          || details_data[i].invoice_details_amount === ""
          || details_data[i].invoice_details_amount === null
          || details_data[i].invoice_details_amount === undefined
          || details_data[i].invoice_details_app_no === ""
          || details_data[i].invoice_details_app_no === null
          || details_data[i].invoice_details_app_no === undefined
          || details_data[i].invoice_details_balance_amount === ""
          || details_data[i].invoice_details_balance_amount === null
          || details_data[i].invoice_details_balance_amount === undefined
          || details_data[i].invoice_details_gst_amount === ""
          || details_data[i].invoice_details_gst_amount === null
          || details_data[i].invoice_details_gst_amount === undefined
          || details_data[i].invoice_details_gst_amount === isNaN
          || details_data[i].invoice_details_total_amount === ""
          || details_data[i].invoice_details_total_amount === null
          || details_data[i].invoice_details_total_amount === undefined
          || details_data[i].invoice_details_total_amount === isNaN
        ) {
          this.toastr.warning("Warning Message", "Please Fill Invoice Details Properly", { timeOut: 4000 });
          return false;
        }
        else if(  details_data[i].Hsn === ""
        || details_data[i].Hsn === null
        || details_data[i].Hsn === undefined
        || details_data[i].Hsn_percentage === ""
        || details_data[i].Hsn_percentage === null
        || details_data[i].Hsn_percentage === undefined)
        {
          this.toastr.warning("Warning Message", "Please Choose Hsn ", { timeOut: 4000 });
          return false;
        }
    
      }
     
      if (this.losheaderform.get('invoice_header_gst_amount').disabled) {
        this.losheaderform.patchValue({
          invoice_header_gst_amount:0
        })
        this.header_total += this.losheaderform.get('invoice_header_gst_amount').value;
      }
      // this.header_total = this.losheaderform.value.invoice_header_amount;
      else
      {
        this.header_total = parseFloat(this.losheaderform.value.invoice_header_amount) + parseFloat(this.losheaderform.value.invoice_header_gst_amount);
        // this.header_total=this.losheaderform.value.invoice_header_amount +this.losheaderform.value.invoice_header_gst_amount;
      }
      // if (isNaN(this.header_total) || this.header_total !== this.detail_total) {
      if (this.header_total != this.detail_total) {
        //alert("Header Amount and Details Amount Not Equal!");
        this.toastr.warning("Header Amount and Details Amount Not Equal!", "", { timeOut: 3000 });
        return false;
         }
      
      console.log("ha",this.header_total)
      console.log("da",this.detail_total)
      // "Status": status  "FileData": this.fileToUpload,
      let final_data = {
        // "Vendor_id": Vendor_id,
        "Invoice_Date": Invoice_Date, "Invoice_Amt": Invoice_Amt, "Gst_Amt": Gst_Amt, "Invoice_Total_Amt": this.header_total,
        "Invoice_Charge_type": Invoice_Charge_type, "Invoice_No": Invoice_No,
        "Supplier_id": this.supplierid, "Supplierstate_id": this.stateid, "Commodity_id": Commodity_id,
        "Otheramount": this.losdetailsform.value.Otheramount,
        "Roundoffamt": this.losdetailsform.value.Roundoffamt,
        "Notename": Notename,
        "Remarks": this.losheaderform.value.Remarks,
        "behalf_branch":behalf_branch,
        "InvoiceDetails": final_details_data, "Balancecharge": balancecharge_data,
        "accno":accno,"paymode_id":paymode_id,"creditbank_id":creditbank_id,"ifsccode":ifsccode,"branchname":branchname,"paymentdetails":paymentdetails

      }
     
      //-------------------------------------------------------------------------------------------------------------------------------------------------------------
      // this.losdetailsform.value.Otheramount
      // this.losdetailsform.value.Roundoffamt
      //-------------------------------------------------------------------------------------------------------------------------------------------------------------
      // console.log(final_data, this.fileData)
      if (status == "New") {
        // if(final_data.paymode_id == 3 || final_data.paymode_id == 5 || final_data.paymode_id == 8)
        // {
        //   if(final_data.accno == 0 || final_data.accno == undefined || final_data.accno == null)
        //   {
        //     this.toastr.warning("You Are Not Allow To Submit...Please Choose A Valid Account Number...")
        //     this.onSubmit.emit();
        //   }
        // }
        if (final_data.paymode_id == 3 || final_data.paymode_id == 5 || final_data.paymode_id == 8) {
          if (final_data.accno != 0 && final_data.accno !== undefined && final_data.accno !== null) {
        this.SpinnerService.show();
        this.DtpcService.create_los_invoice(final_data, this.fileData)
          .subscribe((results) => {
            // console.log(results)
            if (results.code === "Payment Done" && results.description === "Payment over for this application number") {
              this.toastr.warning("Choose another application number", "Payment Done for this Application number", { timeOut: 4000 });
            }
            else if (results.id != undefined) {
              // alert("Successfully Invoice Created")
              this.toastr.success("", "Successfully Invoice Created", { timeOut: 4000 });
              // this.router.navigate(['/los'])
              this.onSubmit.emit();
              // this.onCancel.emit();
              // this.fromGroupDirective.resetForm()
            }
            else {
              alert(JSON.stringify(results))
            }
            this.SpinnerService.hide();
          })
        } 
        else{
          this.toastr.warning("You Are Not Allowed To Submit...Please Choose A Valid Account Number...");
          this.onSubmit.emit();
        }
      }

    }

      if (status == "Draft") {
        this.SpinnerService.show();
        this.DtpcService.create_los_invoice_draft(final_data, this.fileData).subscribe((results) => {
          // console.log(results)
          if (results.code === "Payment Done" && results.description === "Payment over for this application number") {
            this.toastr.warning("Choose another application number", "Payment Done for this Application number", { timeOut: 4000 });
          }
          else if (results.id != undefined) {
            this.toastr.success("", "Successfully Draft Saved", { timeOut: 4000 });
            // alert("Draft Successfully")
            // this.router.navigate(['/los'])
            // this.onCancel.emit();
            this.onSubmit.emit();
          }
          else {
            alert(JSON.stringify(results))
          }
          this.SpinnerService.hide();
        })

      }
    }
    else if (this.invoice_gid !== "" || this.invoice_gid !== null || this.invoice_gid !== undefined) {
      // this.detail_total = 0;
      console.log(this.losheaderform.value.creditbank_id)
      let Remarks = this.losheaderform.value.Remarks;
      let Invoice_Date = this.pipe.transform(this.losheaderform.value.invoice_header_date, 'yyyy-MM-dd');
      let Invoice_Amt = this.losheaderform.value.invoice_header_amount;
      let Gst_Amt = this.losheaderform.value.invoice_header_gst_amount;
      let Invoice_No = this.losheaderform.value.invoice_header_number;
      let Invoice_Charge_type = this.losheaderform.value.invoice_charge_type;
      let Supplier_id = this.losheaderform.value.Supplier_id;
      let Supplierstate_id = this.losheaderform.value.Supplierstate_id;
      let Commodity_id = 7;
      let Otheramount = this.losheaderform.value.Otheramount;
      let Roundoffamt = this.losheaderform.value.Roundoffamt;
      let Notename = this.losheaderform.value.Notename;
      let behalf_branch = this.branchappid;
       let paymode_id=this.losheaderform.value.paymode_id;
       let creditbank_id=this.losheaderform.value.creditbank_id;
      let ifsccode=this.losheaderform.value.ifsccode;
      let branchname=this.losheaderform.value.branchname;
       let accno=this.losheaderform.value.accno;
       let paymentdetails=this.losheaderform.value.paymentdetails;
      // let headerId =this.losheaderform.value.id
      let Total_Header_Amout = Number(Invoice_Amt) + Number(Gst_Amt)

      let details_data = this.losdetailsform.value.invoice_details_data;
      // console.log("details data ", details_data)
      let final_details_data = [];
      let balancecharge_data = [];
      // let final_details_editdata = [];
      // let balancecharge_editdata = [];
      this.headerId = this.invoice_gid

      if (this.file.length > 0) {
        for (let i = 0; i < this.file.length; i++) {
          this.fileToUpload.append('file', this.file[i])
        }
      }
      let overallbalance = this.LOSpatch_data.Balancecharge
      for (var i = 0; i < overallbalance.length; i++) {
        this.balance_id = overallbalance[i].id
      }
      let overalloff = this.LOSpatch_data.InvoiceDetails
      for (var i = 0; i < overalloff.length; i++) {
        if (this.cgstrate === undefined) {
          this.cgstrate = overalloff[i].Cgst
        }
        if (this.sgstrate === undefined) {
          this.sgstrate = overalloff[i].Sgst
        }
        if (this.igstrate === undefined) {
          this.igstrate = overalloff[i].Igst
        }
        if (this.hsnper === undefined) {
          this.hsnper = overalloff[i].Hsn_percentage
        }
        this.DetailId = overalloff[i].id

        for (let i = 0; i < details_data.length; i++) {
          this.HSNcodesssssss = details_data[i].Hsn.id
          if (this.inputSUPPLIERgst === "") {
            this.HSNcodesssssss = ""
            this.hsnper = 0;
          }
          final_details_data.push({
            // "Vendor_id": Vendor_id,
            "Loan_Application_id": details_data[i].invoice_details_app_no.id,
            "Invoice_Amt": details_data[i].invoice_details_amount, "Gst_Amt": details_data[i].invoice_details_gst_amount,
            "Invoice_Total_Amt": details_data[i].invoice_details_total_amount, "Balance_Amt": details_data[i].invoice_details_balance_amount,
            "Cgst": this.cgstrate, "Description": details_data[i].Description, "Hsn": this.HSNcodesssssss, "Hsn_percentage": this.hsnper, "Igst": this.igstrate,
            "Productcode": 0, "Productname": details_data[i].Productname, "Quantity": details_data[i].Quantity, "Sgst": this.sgstrate,
            "Unitprice": details_data[i].Unitprice, "Uom": "Number", "Is_Flag": this.finalstat, "id": this.DetailId
          })
          // console.log("domnic",this.HSNcodesssssss)
          // console.log("Bosco",this.hsnper)
          balancecharge_data.push({ "Loan_Application_id": details_data[i].invoice_details_app_no.id, "id": this.balance_id })
          console.log("gfghfugggh",Gst_Amt)
          //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
          let Otheramount = this.losdetailsform.value.Otheramount;
          let Roundoffamt = this.losdetailsform.value.Roundoffamt;
          let roundAndOther = Roundoffamt + Otheramount
          //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
          this.detail_total = Number(details_data[i].invoice_details_total_amount).toFixed(2) + roundAndOther

        }
      }
      if (
        // this.losheaderform.value.Commodity_id === ""
          // this.losheaderform.value.Remarks === ""
        this.losheaderform.value.Supplier_id === ""
        || this.losheaderform.value.Supplierstate_id === ""
        || this.losheaderform.value.invoice_charge_type === ""
        || this.losheaderform.value.invoice_header_amount === ""
        || this.losheaderform.value.invoice_header_date === ""
        || this.losheaderform.value.invoice_header_gst_amount === ""
        || this.losheaderform.value.invoice_header_number === ""
        || this.losheaderform.value.behalf_branch === ""
        || this.losheaderform.value.paymode_id === ""
        || this.losheaderform.value.creditbank_id === ""
         || this.losheaderform.value.ifsccode === ""
         ||this.losheaderform.value.branchname===""
        || this.losheaderform.value.accno === ""
      ) {
        // this.toastr.warning("Warning Message", "Please Fill Invoice Header Details Properly", { timeOut: 4000 });
        // return false;
      }
      for (i = 0; i < details_data.length; i++) {
        if (this.inputSUPPLIERgst === "") {
          if (
            details_data[i].Cgst === ""
            || details_data[i].Cgst === null
            || details_data[i].Cgst === undefined
            || details_data[i].Description === ""
            || details_data[i].Description === null
            || details_data[i].Description === undefined
            || details_data[i].Hsn === ""
            || details_data[i].Hsn_percentage === ""
            || details_data[i].Igst === ""
            || details_data[i].Igst === null
            || details_data[i].Igst === undefined
            || details_data[i].Productname === ""
            || details_data[i].Productname === null
            || details_data[i].Productname === undefined
            || details_data[i].Quantity === ""
            || details_data[i].Quantity === null
            || details_data[i].Quantity === undefined
            || details_data[i].Sgst === ""
            || details_data[i].Sgst === null
            || details_data[i].Sgst === undefined
            || details_data[i].Unitprice === ""
            || details_data[i].Unitprice === null
            || details_data[i].Unitprice === undefined
            || details_data[i].Uom === ""
            || details_data[i].Uom === null
            || details_data[i].Uom === undefined
            || details_data[i].invoice_details_amount === ""
            || details_data[i].invoice_details_amount === null
            || details_data[i].invoice_details_amount === undefined
            || details_data[i].invoice_details_app_no === ""
            || details_data[i].invoice_details_app_no === null
            || details_data[i].invoice_details_app_no === undefined
            || details_data[i].invoice_details_balance_amount === ""
            || details_data[i].invoice_details_balance_amount === null
            || details_data[i].invoice_details_balance_amount === undefined
            || details_data[i].invoice_details_gst_amount === ""
            || details_data[i].invoice_details_gst_amount === null
            || details_data[i].invoice_details_gst_amount === undefined
            // || details_data[i].invoice_details_gst_amount === NaN
            || details_data[i].invoice_details_total_amount === ""
            || details_data[i].invoice_details_total_amount === null
            || details_data[i].invoice_details_total_amount === undefined

            || details_data[i].paymode_id === ""
            || details_data[i].paymode_id === null
            || details_data[i].paymode_id === undefined
            || details_data[i].creditbank_id === ""
            || details_data[i].creditbank_id === null
            || details_data[i].creditbank_id === undefined
            || details_data[i].branchname === ""
            || details_data[i].branchname === null
            || details_data[i].branchname === undefined

            || details_data[i].ifsccode === ""
            || details_data[i].ifsccode === null
            || details_data[i].ifsccode === undefined
            || details_data[i].accno === ""
            || details_data[i].accno === null
            || details_data[i].accno === undefined

            || details_data[i].paymentdetails === ""
            || details_data[i].paymentdetails === null
            || details_data[i].paymentdetails === undefined
            // || details_data[i].invoice_details_total_amount === NaN
          ) {
            this.toastr.warning("Warning Message", "Please Fill Invoice Details Properly", { timeOut: 4000 });
            return false;
          }
        }
        else if (
          details_data[i].Cgst === ""
          || details_data[i].Cgst === null
          || details_data[i].Cgst === undefined
          || details_data[i].Description === ""
          || details_data[i].Description === null
          || details_data[i].Description === undefined
          || details_data[i].Hsn === ""
          || details_data[i].Hsn === null
          || details_data[i].Hsn === undefined
          || details_data[i].Hsn_percentage === ""
          || details_data[i].Hsn_percentage === null
          || details_data[i].Hsn_percentage === undefined
          || details_data[i].Igst === ""
          || details_data[i].Igst === null
          || details_data[i].Igst === undefined
          || details_data[i].Productname === ""
          || details_data[i].Productname === null
          || details_data[i].Productname === undefined
          || details_data[i].Quantity === ""
          || details_data[i].Quantity === null
          || details_data[i].Quantity === undefined
          || details_data[i].Sgst === ""
          || details_data[i].Sgst === null
          || details_data[i].Sgst === undefined
          || details_data[i].Unitprice === ""
          || details_data[i].Unitprice === null
          || details_data[i].Unitprice === undefined
          || details_data[i].Uom === ""
          || details_data[i].Uom === null
          || details_data[i].Uom === undefined
          || details_data[i].invoice_details_amount === ""
          || details_data[i].invoice_details_amount === null
          || details_data[i].invoice_details_amount === undefined
          || details_data[i].invoice_details_app_no === ""
          || details_data[i].invoice_details_app_no === null
          || details_data[i].invoice_details_app_no === undefined
          || details_data[i].invoice_details_balance_amount === ""
          || details_data[i].invoice_details_balance_amount === null
          || details_data[i].invoice_details_balance_amount === undefined
          || details_data[i].invoice_details_gst_amount === ""
          || details_data[i].invoice_details_gst_amount === null
          || details_data[i].invoice_details_gst_amount === undefined
          // || details_data[i].invoice_details_gst_amount === NaN
          || details_data[i].invoice_details_total_amount === ""
          || details_data[i].invoice_details_total_amount === null
          || details_data[i].invoice_details_total_amount === undefined
          // || details_data[i].invoice_details_total_amount === NaN
        ) {
          this.toastr.warning("Warning Message", "Please Fill Invoice Details Properly", { timeOut: 4000 });
          return false;
        }
      }
      // if (this.header_total) {
      //   this.header_total = this.edit_invoice_details.Invoice_Total_Amt
      // }
      // if (Total_Header_Amout != this.detail_total) {
      //   //alert("Header Amount and Details Amount Not Equal!");
      //   this.toastr.warning("Header Amount and Details Amount Not Equal!", "", { timeOut: 3000 });
      //   return false;
       
      // }
      console.log("ta",Total_Header_Amout)
      console.log("dt",this.detail_total)
      this.LOSpatch_data
      this.invoiceheaderid = this.LOSpatch_data.id
      // "Status": status  "FileData": this.fileToUpload,
      if (this.supplierid === undefined) {
        this.supplierid = this.LOSpatch_data.Supplier.id
      }
      if (this.stateid === undefined) {
        this.stateid = this.LOSpatch_data.Supplierstate.id
      }
      if (Otheramount === undefined) {
        Otheramount = this.LOSpatch_data.Otheramount
      }
      if (Roundoffamt === undefined) {
        Roundoffamt = this.LOSpatch_data.Roundoffamt
      }
      console.log()
      let final_data = {
        // "Vendor_id": Vendor_id,
        "Invoice_Date": Invoice_Date, "Invoice_Amt": Invoice_Amt, "Gst_Amt": Gst_Amt, "Invoice_Total_Amt": Total_Header_Amout,
        "Invoice_Charge_type": Invoice_Charge_type, "Invoice_No": Invoice_No,
        "Supplier_id": this.supplierid, "Supplierstate_id": this.stateid, "Commodity_id": Commodity_id,
        "Otheramount": this.losdetailsform.value.Otheramount,
        "Roundoffamt": this.losdetailsform.value.Roundoffamt,
        "Notename": Notename, "id": this.headerId,
        "Remarks": this.losheaderform.value.Remarks,
        "behalf_branch":behalf_branch,"paymode_id":paymode_id,"creditbank_id":creditbank_id,"accno":accno,
        "InvoiceDetails": final_details_data, "Balancecharge": balancecharge_data,"ifsccode":ifsccode,"branchname":branchname

      }
      // "Status": status  "FileData": this.fileToUpload,
      // if (this.fileData === null) {
      //   this.fileData = this.edit_invoice_details.file_data
      // }
      // console.log(final_data)
      if (status == "New") {
        this.SpinnerService.show();
        this.DtpcService.create_los_invoice(final_data, this.fileData).subscribe((results) => {
          // console.log(results)
          if (results.code === "Payment Done" && results.description === "Payment over for this application number") {
            this.toastr.warning("Choose another application number", "Payment Done for this Application number", { timeOut: 4000 });
          }
          else if (results.id != undefined) {
            // alert("Successfully Invoice Created")
            this.toastr.success("", "Successfully Invoice Updated", { timeOut: 4000 });
            // this.router.navigate(['/los'])
            this.onSubmit.emit();
            // this.onCancel.emit();
          }
          else {
            alert(JSON.stringify(results))
          }
          this.SpinnerService.hide();
        })
      }

      if (status == "Draft") {
        this.SpinnerService.show();
        this.DtpcService.create_los_invoice_draft(final_data, this.fileData).subscribe((results) => {
          // console.log(results)
          if (results.code === "Payment Done" && results.description === "Payment over for this application number") {
            this.toastr.warning("Choose another application number", "Payment Done for this Application number", { timeOut: 4000 });
          }
          else if (results.id != undefined) {
            this.toastr.success("", "Successfully Draft Updated and Saved", { timeOut: 4000 });
            // alert("Draft Successfully")
            // this.router.navigate(['/los'])
            // this.onCancel.emit();
            this.onSubmit.emit();
          }
          else {
            alert(JSON.stringify(results))
          }
          this.SpinnerService.hide();
        })

      }

    }
  }


  viewDetails(i) {
    let ApplNo = this.losdetailsform.value.invoice_details_data[i].invoice_details_app_no.ApplNo;
    // let ApplNo = loan_datas.ApplNo;
    if (ApplNo) {
      this.SpinnerService.show();
      this.DtpcService.get_application_number(ApplNo).subscribe(result => {
        // console.log(result);
        this.SpinnerService.hide();
        this.single_application_data = result;

        const dialogRef = this.dialog.open(DialogApplicationDetails, {
          data: this.single_application_data,
          height: '90%',
          width: '100%',
        });

        dialogRef.afterClosed().subscribe(result => {

          // console.log(`Dialog result: ${result}`);
        });
        this.SpinnerService.hide();
      }, error => {
        this.SpinnerService.hide();
        let errorMessage = error.statusText;
        // console.log("Erorr" + errorMessage);
        return Observable.throw(error);
      });
    }
    else {
      this.toastr.warning("", "Please Select Application Number", { timeOut: 4000 });
      // alert("Please Select Application Number")
    }
  }

  branchnames() {
    let branchkeyvalue: String = "";
    this.getbranchname(branchkeyvalue);
  
    this.losheaderform.get('behalf_branch').valueChanges
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
  branchappid : any
  behalfbranchnamecode = ""
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


  
  
 
}




@Component({
  selector: 'dialog-application-details-dialog',
  templateUrl: 'dialog-application-details.html',
  styleUrls: ['./dialog-application-details.scss'],
})
export class DialogApplicationDetails {
  [x: string]: any;
  view_application: any;
  Collaterals: any;
  pageSize = 10;
  currentpage: number = 1;
  Charges: any;
  constructor(public _el: ElementRef,public dialogRef: MatDialogRef<DialogApplicationDetails>,
    @Inject(MAT_DIALOG_DATA) public single_application_details_data: ApplicationDetailsDialogData)
     {
      
  }
  ngOnInit(): void {
    this.view_application = this.single_application_details_data;
    this.Charges = this.view_application.Charges;
    this.Collaterals = this.view_application.Collaterals;


  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}


// export class DialogContentExampleDialog { }

