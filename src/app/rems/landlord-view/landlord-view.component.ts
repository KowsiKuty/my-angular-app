import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { RemsShareService } from '../rems-share.service'
import { RemsService } from '../rems.service'
import { Router } from '@angular/router';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Rems2Service } from '../rems2.service'
import { SharedService } from '../../service/shared.service';
import { environment } from 'src/environments/environment'

const isSkipLocationChange = environment.isSkipLocationChange

export interface landlordbankbranchnameLists {
  name: string;
  id: number;
}

export interface landlordbanknameLists {
  name: string;
  id: number;
}

@Component({
  selector: 'app-landlord-view',
  templateUrl: './landlord-view.component.html',
  styleUrls: ['./landlord-view.component.scss']
})
export class LandlordViewComponent implements OnInit {
  @ViewChild('autoPrimary') matAutocompleteDept: MatAutocomplete;
  @ViewChild('bankName1') bankName1: any;
  @ViewChild('closebutton') closebutton;


  tdsRate: string;
  tdsApplicable: string;
  tdsSection: string;
  email: string;
  entityType: string;
  gstNo: string;
  lowerDeductionCertificate: string;
  mobile: string;
  name: string;
  nriLocalContact: string;
  panNo: string;
  powerOfAttorney: string;
  city: string;
  pinCode: string;
  district: string;
  datas: any
  line1: string;
  line2: string;
  line3: string;
  state: string;
  landlordbankList: Array<any>
  currentpage: number = 1; val
  presentpage: number = 1;
  pageSize = 10;
  landlordbankpage: number = 1;
  has_next = false;
  has_previous = false;
  premiseId: any;
  landlordViewId: any;
  is_landlordbank: boolean;
  isLoading = false;
  LanlordBankBtn = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('branch_name') branch_names;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  landlordbankcreateAddForm: FormGroup;
  inputIFSCValue = "";
  isLandlordbankForm: boolean;
  bank_name = new FormControl();
  branch_name = new FormControl();
  landlordbanknameList: Array<landlordbanknameLists>;
  id = new FormControl();
  landlordbankbranchnameList: Array<landlordbankbranchnameLists>;
  did = new FormControl();
  accountidList: any;
  bankID = 0;
  bankbranchID: number;
  ifscCODE: number;
  LandLordBankForm: FormGroup;
  idValue: any;
  bankNameData: any;
  branchBankNameData: any;
  IsmodelShow = false
  nri: any;
  poa: any;
  name1: any;
  contact1: any;
  emai1: any;
  contactid: any;
  type: any;
  A1: any;
  A2: any;
  A3: any;
  City1: any;
  District1: any;
  State1: any;
  Pincode1: any;
  addressid1: any;
  isNRI = false;
  isPOA = false;
  isnriview: any;

  isEditBtn: boolean;
  lanlordbankModiData = []
  requestStatus: string;
  isModification: boolean;
  vendor_Id: number;
  Aadharno:string;
  
  accSelFlag = false;
  oldpaymentId : any;
  paymentId : any;

  is_landlordtax: boolean;  
  taxSelFlag = false;
  oldtaxId : any;
  taxId : any;
  landlordTaxpage : number =1;
  
  @ViewChild(FormGroupDirective) fromGroupDirective: FormGroupDirective
  constructor(private toastr: ToastrService, private formBuilder: FormBuilder, private remsshareService: RemsShareService, private remsService: RemsService,
    private router: Router, private notification: NotificationService, private dialog: MatDialog, private shareService: SharedService,
    private remsService2: Rems2Service,
  ) { }

  
  ngOnInit(): void {
    // let premiseViewData: any = this.remsshareService.PremiseView.value;
    let premiseViewData: any = this.remsshareService.premiseViewID.value;
    // let premiseViewData = this.remsshareService.premiseViewID.value;
   
    let datas = this.shareService.menuUrlData.filter(rolename => rolename.name == 'REMS');
    datas.forEach((result) => {
      let roleValues = result.role[0].name;
      if (roleValues === "Maker" && premiseViewData.premise_status == "DRAFT") {
        this.isEditBtn = true;
      } if (roleValues === "Maker" && premiseViewData.premise_status == "PENDING_CHECKER") {
        this.isEditBtn = false;
      } if (roleValues === "Checker" && premiseViewData.requeststatus == "MODIFICATION") {
        this.isModification = false;
      } if (roleValues === "Header" && premiseViewData.requeststatus == "MODIFICATION") {
        this.isModification = false;
      } if (roleValues === "Maker" && premiseViewData.requeststatus == "MODIFICATION") {
        this.isModification = true;
      }

    });
    this.getLandLordView();
    this.getAccountTypedetails();
    this.getModificationView();
    this.LandLordBankForm = this.formBuilder.group({

      bank_name: ['', Validators.required],
      branch_name: ['', Validators.required],
      ifsccode: ['', Validators.required],
      account_type: ['', Validators.required],
      account_number: ['', Validators.required],
      paymode_id: ['', Validators.required],
      remarks: ['', Validators.required],
      
    })
    let bankname: String = "";
    this.getBankNameDD(bankname);
    this.LandLordBankForm.get('bank_name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.remsService.getBankNameDD(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bankNameData = datas;
      })

    let bankbranchkeyvalue: string = "";
    this.getBankBranchNameDD(this.bankID, bankbranchkeyvalue);
    this.LandLordBankForm.get('branch_name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.remsService.getBankBranchNameDD(this.bankID, value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchBankNameData = datas;
        console.log("landlordbankbranchnameList", datas)
      })


  }

  public displayFn(bankName?: bankName): string | undefined {
    return bankName ? bankName.name : undefined;
  }

  get bankName() {
    return this.LandLordBankForm.get('bank_name');
  }


  public displayFn1(bankBranchName?: bankBranchName): string | undefined {
    return bankBranchName ? bankBranchName.name : undefined;
  }

  get bankBranchName() {
    return this.LandLordBankForm.get('branch_name');
  }
  landlordbankbranchnames(data) {

    this.bankID = data.id;
    this.getBankBranchNameDD(data.id, '')
    console.log('check', this.getBankBranchNameDD(data.id, ''))
  }


  private getBankNameDD(bankname) {
    this.remsService.getBankNameDD(bankname)
      .subscribe((results) => {
        let datas = results["data"];
        this.bankNameData = datas;
      })
  }

  getBankBranchNameDD(id, bankbranchkeyvalue) {
    this.remsService.getBankBranchNameDD(id, bankbranchkeyvalue)
      .subscribe((results) => {
        let datas = results["data"];
        this.branchBankNameData = datas;
      })
  }
  getIfscCode(data) {
    this.remsService.getIFSCdependent(data.id)
      .subscribe((results) => {
        this.inputIFSCValue = results.ifsccode;
        this.LandLordBankForm.patchValue({
          ifsccode: this.inputIFSCValue,
        })
      })
  }

  private getAccountTypedetails() {
    this.remsService.getAccountTypedetails()
      .subscribe((results: any[]) => {
        let databb = results["data"];
        this.accountidList = databb;
        console.log("accounttypedetails", databb)
      })
  }


  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || (k >= 48 && k <= 57));
  }
  only_char(event) {
    var a;
    a = event.which;
    if ((a < 65 || a > 90) && (a < 97 || a > 122)) {
      return false;
    }

  }

  landlordbankCreateEdForm() {
    if (this.LandLordBankForm.value.bank_name === "") {
      this.toastr.warning('', 'Please Enter Bank Name', { timeOut: 1500 });
      this.LanlordBankBtn = false;
      return false;
    }
    else if (this.LandLordBankForm.value.branch_name === "") {
      this.toastr.warning('', 'Please Enter Branch Name', { timeOut: 1500 });
      this.LanlordBankBtn = false;
      return false;
    }
    else if (this.LandLordBankForm.value.ifsccode === "") {
      this.toastr.warning('', 'Please Enter IfSC Code', { timeOut: 1500 });
      this.LanlordBankBtn = false;
      return false;
    }
    else if (this.LandLordBankForm.value.account_type === "") {
      this.toastr.warning('', 'Please Enter Account Type', { timeOut: 1500 });
      this.LanlordBankBtn = false;
      return false;
    }
    else if (this.LandLordBankForm.value.account_number === "") {
      this.toastr.warning('', 'Please Enter Account Number', { timeOut: 1500 });
      return false;
    }



    if (this.idValue == undefined) {
      this.remsService.landlordbankCreateEditForm(this.LandLordBankForm.value, '', this.landlordViewId)
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            this.LanlordBankBtn = false;
          }
          else {
            this.notification.showSuccess("Successfully created!...")
            this.landlordbanksummary();
            this.getModificationView();
            this.LanlordBankBtn = false;
            this.fromGroupDirective.resetForm();
            this.closebutton.nativeElement.click();
          }
        })
    } else {
      this.remsService.landlordbankCreateEditForm(this.LandLordBankForm.value, this.idValue, this.landlordViewId)
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            this.LanlordBankBtn = false;
            this.getModificationView();

          }
          else {
            this.notification.showSuccess("Successfully Updates!...")
            this.idValue = undefined;
            this.LanlordBankBtn = false;
            this.landlordbanksummary();
            this.getModificationView();
            this.fromGroupDirective.resetForm();
            this.closebutton.nativeElement.click();
          }
        })
    }
  }
  addLLB(data) {


  }
  clear() {
    this.branch_names.nativeElement.value = ' ';
    // this.ifsccode.nativeElement.value = ' ';
  }
  //---------------------------------------------------------------------------------------------------------
  taxData : any;
  getLandLordView() {
    let data: any = this.remsshareService.landLordView.value;
    this.premiseId = data.premise_id;
    this.landlordViewId = data.landlordView
    this.remsService.landLordView(this.premiseId, this.landlordViewId)
      .subscribe(data => {
        console.log("get landlord id",data)
        this.requestStatus = data.premise.requeststatus
        this.vendor_Id = data.vendor_id.vendor_id
        console.log("vendor_Id",this.vendor_Id)
        this.landlordbanksummary();
        let json: any = {
          data: [{
            title: "LandLordView",
            name: data.name,
            code: '',
            routerUrl: "/premiseView"
          }]
        }
        this.remsshareService.premiseBackNavigation.next(json);
        this.panNo = data.panno;
        this.email = data.email;
        this.entityType = data.entity_type;
        this.gstNo = data.gstno;
        this.Aadharno=data.aadharno;
        this.lowerDeductionCertificate = data.lower_deduction_certificate;
        this.mobile = data.mobile;
        this.name = data.name;
        this.tdsApplicable = data.TDS_applicable == true ? "YES": "NO";

        if(this.tdsApplicable =="YES")
          this.landlordTaxsummary();
        
        this.tdsRate = data.TDS_rate.rate;
        this.tdsSection = data.TDS_section.name;
        this.nri = data.is_nri;
        if(this.nri == true){
          this.isnriview = "YES"  
        } else {
          this.isnriview = "NO" 
        }
        this.poa = data.is_poa;
        if (data.is_nri == true && data.is_poa == false) {
          this.isNRI = true;
        }
        if ((data.is_nri == false && data.is_poa == true) || (data.is_nri == true && data.is_poa == true)) {
          this.isPOA = true;
        }
        if (data.is_nri == false && data.is_poa == false) {
          this.isNRI = false;
          this.isPOA = false;
        }

        if (data.landlordcontactdtls === null) {
          this.isNRI = false;
          this.isPOA = false;

        } else {
          this.name1 = data.landlordcontactdtls.landlordname;
          this.contact1 = data.landlordcontactdtls.landlordcontact;
          this.emai1 = data.landlordcontactdtls.landlordemail;
          this.contactid = data.landlordcontactdtls.landlordcontact_id;
          this.type = data.landlordcontactdtls.landlordtype;

          let nriaddress = data.landlordcontactdtls.landlordaddress;
          this.A1 = nriaddress.line1;
          this.A2 = nriaddress.line2;
          this.A3 = nriaddress.line3;
          this.City1 = nriaddress.city_id.name;
          this.District1 = nriaddress.district_id.name;
          this.State1 = nriaddress.state_id.name;
          this.Pincode1 = nriaddress.pincode_id.name;
          this.addressid1 = nriaddress.id;

        }
        this.city = data.address.city_id.name;
        this.district = data.address.district_id.name;
        this.pinCode = data.address.pincode_id.no;
        this.state = data.address.state_id.name;
        this.line1 = data.address.line1;
        this.line2 = data.address.line2;
        this.line3 = data.address.line3;
      })
  }


  landlordbanksummary(pageNumber = 1, pageSize = 10) {
    this.remsService.landlordbankpaymentsummary(pageNumber, pageSize, this.landlordViewId)
      .subscribe((result) => {
        console.log("bankdetails",result)
        let datas = result['data'];
        let datapagination = result["pagination"];
        this.landlordbankList = datas;
        if (this.landlordbankList.length === 0) {
          this.is_landlordbank = false
        }
        if (this.landlordbankList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.landlordbankpage = datapagination.index;
          this.is_landlordbank = true

          this.oldpaymentId = this.landlordbankList.filter(x => x.rems_flag == true && x.is_active)[0]?.id
          if(this.oldpaymentId != undefined)
          {
            this.accSelFlag = true
          }
        }
      })
  }


  // landlordbanksummary(pageNumber = 1, pageSize = 10) {
  //   this.remsService.landlordbanksummary(pageNumber, pageSize, this.landlordViewId)
  //     .subscribe((result) => {
  //       console.log("bankdetails",result)
  //       let datas = result['data'];
  //       let datapagination = result["pagination"];
  //       this.landlordbankList = datas;
  //       if (this.landlordbankList.length === 0) {
  //         this.is_landlordbank = false
  //       }
  //       if (this.landlordbankList.length > 0) {
  //         this.has_next = datapagination.has_next;
  //         this.has_previous = datapagination.has_previous;
  //         this.landlordbankpage = datapagination.index;
  //         this.is_landlordbank = true
  //       }
  //     })
  // }
  landlordBankEdit(s: any) {
    let data = s;
    console.log("view",data)
    this.idValue = data.id;
    if (data === '') {
      this.LandLordBankForm.patchValue({
        bank_name: '',
        branch_name: '',
        ifsccode: '',
        account_type: '',
        account_number: ''
      })
    } else {
      this.LandLordBankForm.patchValue({
        bank_name: data.bank_id,
        branch_name: data.branch_id,
        ifsccode: data.branch_id.ifsccode,
        account_type: data.account_type,
        account_number: data.account_no,
        paymode_id:data.paymode_id.name,
        remarks: data.remarks,
        // bank_name: data.bankbranch.bank,
        // branch_name: data.bankbranch,
        // ifsccode: data.bankbranch.ifsccode,
        // account_type: data.account_type_id,
        // account_number: data.account_number
      })
    }
  }
  addLandLordBank(s) {
    if (s == '') {
      this.LandLordBankForm.patchValue({
        bank_name: '',
        branch_name: '',
        ifsccode: '',
        account_type: '',
        account_number: ''
      })
    }
  }

  landlordBankDelete(data) {
    let value = data.id
    this.remsService.landlordBankDeleteForm(value, this.landlordViewId)
      .subscribe(result => {
        this.notification.showSuccess("Successfully deleted....")
        this.landlordbanksummary();
        this.getModificationView();
        return true
      })
  }

  landlordbankBtn() {
    this.landlordbanksummary();
  }

  nextClickLandlordbank() {
    if (this.has_next === true) {
      this.landlordbanksummary(this.landlordbankpage + 1, 10)
    }
  }


  previousClicklandlordBank() {
    if (this.has_previous === true) {
      this.landlordbanksummary(this.landlordbankpage - 1, 10)
    }
  }


  getModificationView() {
    this.lanlordbankModiData = [];
    this.remsService2.getModificationView(this.premiseId)
      .subscribe((results) => {
        let datas = results.data
        datas.forEach(element => {
          if (element.action == 1 && element.type_name == "LANDLORD BANK DETAILS") {
            let data = {
              modify_data: "New"
            }
            let json = Object.assign({}, data, element.data)
            this.lanlordbankModiData.push(json);
          } else if (element.action == 2 && element.type_name == "LANDLORD BANK DETAILS") {
            let data = {
              modify_data: "Modify"
            }
            let json = Object.assign({}, data, element.new_data)
            this.lanlordbankModiData.push(json);
          } else if (element.action == 0 && element.type_name == "LANDLORD BANK DETAILS") {
            let data = {
              modify_data: "Delete"
            }
            let json = Object.assign({}, data, element.data)
            this.lanlordbankModiData.push(json);
          }
        });
      })

  }

  accSelect(data, e)
  {
    if(e.target.checked == false)
    {
      this.accSelFlag = false
    }
    else
    {
      if(this.accSelFlag)
      {
        this.notification.showError("Already an Account Number Selected.  Please Unselect that and try again.")
        return false
      }
      else
      {
        this.accSelFlag = true
        this.paymentId = data.id
      }
    }    
  }

  taxTabFlag = false

  taxTabSelected()
  {
    this.taxTabFlag = true
    this.remsshareService.landlordFlag.next(false)
  }
  
  backToRemsSummary() {
    let landlordEdit = this.remsshareService.landlordFlag.value
    if(this.tdsApplicable== "YES" && landlordEdit && !this.taxTabFlag )
    {
      this.notification.showWarning("Please view Tax Details.")
    }
    else
    {
      this.remsshareService.landlordFlag.next(false)
      this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Landlord Details" }, skipLocationChange: isSkipLocationChange });
    }
  }

  updateDisable = false
  updateAcc()
  {
    let json ={"active_payment_id":this.paymentId,
    "inactive_payment_id":this.oldpaymentId
    }
    this.remsService.updateLandlordAccno(this.landlordViewId, json)
    .subscribe(results => {
      console.log("updateAcc---", results)
      if(results.status== "success")
      {
        this.updateDisable = true
        this.notification.showSuccess("Successfully Account No. updated.")
      }
    })
  }

  landlordTaxsummary(pageNumber = 1, pageSize = 10) {
    this.remsService.getLandlordTaxDet(this.landlordViewId)
      .subscribe((result) => {
        console.log("tax details",result)
        let datas = result['data'];
        let datapagination = result["pagination"];
        this.taxData = datas;
        if (this.taxData.length === 0) {
          this.is_landlordtax = false
        }
        if (this.taxData.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.landlordTaxpage = datapagination.index;
          this.is_landlordtax = true

          this.oldtaxId = this.taxData.filter(x => x.rems_flag == true && (x.is_delete == false && x.status == 1))[0]?.id
          if(this.oldtaxId != undefined)
          {
            this.taxSelFlag = true
          }
        }
      })
  }

  nextClickLandlordTaxDet() {
    if (this.has_next === true) {
      this.landlordTaxsummary(this.landlordTaxpage + 1, 10)
    }
  }


  previousClicklandlordTaxDet() {
    if (this.has_previous === true) {
      this.landlordTaxsummary(this.landlordTaxpage - 1, 10)
    }
  }

  taxSelect(id, e)
  {
    if(e.target.checked == false)
    {
      this.taxSelFlag = false
    }
    else
    {
      if(this.taxSelFlag)
      {
        this.notification.showError("Already an Tax details Selected.  Please Unselect that and try again.")
        return false
      }
      else
      {
        this.taxSelFlag = true
        this.taxId = id
      }
    }    
  }
  updateTaxDisable = false
  updateTaxDet()
  {
    let json ={"active_tax_id":this.taxId,
    "inactive_tax_id":this.oldtaxId
    }
    this.remsService.updateLandlordTaxDet(this.landlordViewId, json)
    .subscribe(results => {
      console.log("updateTax det---", results)
      if(results.status== "success")
      {
        this.updateTaxDisable = true
        this.notification.showSuccess("Successfully Tax details updated.")
      }
    })
  }
}



export interface bankName {
  id: number;
  name: string;
}

export interface bankBranchName {
  id: number;
  name: string;
}