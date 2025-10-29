import {
  Component,
  Output,
  OnInit,
  EventEmitter,
  ViewChild,
  Injectable,
  ElementRef,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { Router } from "@angular/router";
import { AtmaService } from "../atma.service";
import { ShareService } from "../share.service";
import { fromEvent } from "rxjs";
import { NotificationService } from "../notification.service";
import { ToastrService } from "ngx-toastr";
import {
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_FORMATS,
} from "@angular/material/core";
import { formatDate, DatePipe } from "@angular/common";
import { isBoolean } from "util";
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  filter,
  switchMap,
  finalize,
  takeUntil,
  map,
} from "rxjs/operators";
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { ValidationserviceComponent } from "../validationservice/validationservice.component";
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from "../error-handling.service";
import { timeStamp } from "console";
import { environment } from "src/environments/environment";
import { MatStepper } from '@angular/material/stepper';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
// export interface RM {
//   id: string;
//   full_name: string;
// }
// export interface Designation {
//   id: string;
//   name: string;
// }
export interface ContactType {
  id: string;
  name: string;
}
// export interface district {
//   id: string;
//   name: string;
// }

// export interface city {
//   id: string;
//   name: string;
// }

// export interface pincode {
//   no: string;
//   id: number;
// }

export interface state {
  name: string;
  id: number;
}
// export interface classification {
//   id: string;
//   text: string;
// }
// export interface composite {
//   id: string;
//   text: string;
// }
// export interface vendortype {
//   id: string;
//   text: string;
// }
// export interface orgtype {
//   id: string;
//   text: string;
// }
// export interface category {
//   id: string;
//   text: string;
// }
// export interface subcategory {
//   id: string;
//   name: string;
// }

// export interface risk {
//   id: number;
//   text: string;
// }

export const PICK_FORMATS = {
  parse: { dateInput: { month: "short", year: "numeric", day: "numeric" } },
  display: {
    dateInput: "input",
    monthYearLabel: { year: "numeric", month: "short" },
    dateA11yLabel: { year: "numeric", month: "long", day: "numeric" },
    monthYearA11yLabel: { year: "numeric", month: "long" },
  },
};

@Injectable()
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === "input") {
      return formatDate(date, "dd-MMM-yyyy", this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: "app-vendor-edit",
  templateUrl: "./vendor-edit.component.html",
  styleUrls: ["./vendor-edit.component.scss"],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,
  ],
})
export class VendorEditComponent implements OnInit {
  atmaUrl = environment.apiURL
  @ViewChild("name") inputName;
  @ViewChild('stepper') stepper: MatStepper;
  @Output() onSubmit = new EventEmitter<any>();
  Contractdatefrom: any;
  Contractdateto: any;
  vendorEditForm: FormGroup;
  stateID = 0;
  relationcatedit:any = {
    label: "Relationship Category",
    method: "get",
    url: this.atmaUrl + "mstserv/group",
    params: "",
    searchkey: "",
    displaykey: "text",
    wholedata: true,
    required : true,
    formcontrolname: 'group',
    // formkey:'id',
    // defaultvalue :result.group,
  };
  relationsubcatedit:any = {
    label: "Relationship Subcategory",
    method: "get",
    url: this.atmaUrl + "mstserv/customercategory",
    params: "",
    searchkey: "",
    displaykey: "name",
    wholedata: true,
    required : true,
    formcontrolname: 'custcategory_id',
  };
  orgtypefieldedit:any = {
    label: "Organization Type",
    method: "get",
    url: this.atmaUrl + "mstserv/org_type",
    params: "",
    searchkey: "",
    displaykey: "text",
    wholedata: true,
    required : true,
    formcontrolname: 'orgtype',
  };
  relatypefieldedit:any = {
    label: "Relationship Type",
    method: "get",
    url: this.atmaUrl + "mstserv/classification",
    params: "",
    searchkey: "",
    displaykey: "text",
    wholedata: true,
    required : true,
    formcontrolname: 'classification',
  };
  comfieldedit:any =  {
    label: "GST Category",
    method: "get",
    url: this.atmaUrl + "mstserv/composite",
    params: "",
    searchkey: "",
    displaykey: "text",
    wholedata: true,
    required : true,
    formcontrolname: 'composite',
  };
  classifycrityfieldedit:any = {
    label: "Criticality Classification",
    method: "get",
    url: this.atmaUrl + "mstserv/type",
    params: "",
    searchkey: "",
    displaykey: "text",
    wholedata: true,
    required : true,
    formcontrolname: 'type',
  }
  riskcateditfield:any = {
    label: "Risk Category",
    method: "get",
    url: this.atmaUrl + "mstserv/risktype",
    params: "",
    searchkey: "",
    displaykey: "text",
    wholedata: true,
    required : true,
    formcontrolname: 'risk_type',
  };
  headereditfield:any=  {
    label: "Header Name",
      method: "get",
      url: this.atmaUrl + "usrserv/searchheader",
      params: "&query=",
      searchkey: "query",
      displaykey: "full_name",
      wholedata: true,
      required : true,
      formcontrolname: 'rm_id',
  };
  pincodeeditfield:any = {
    label: "Pin Code",
    method: "get",
    url: this.atmaUrl + "mstserv/pincodesearch",
    params: "&query=",
    searchkey: "query",
    displaykey: "no",
    wholedata: true,
    required : true,
    formcontrolname: 'pincode_id'

    // defaultvalue : pincodes 
  };
  cityeditfield:any =  {
    label: "City",
    method: "get",
    url: this.atmaUrl + "mstserv/new_city_search",
    // params: "&state_id=" + this.stateID+"&query=",
    searchkey: "query",
    displaykey: "name",
    Outputkey: "id",
    // defaultvalue: this.city_name,
    disabled: true,
    formcontrolname: 'city_id'

  };
  districteditfield :any =  {
      label: "District",
      method: "get",
      url: this.atmaUrl + "mstserv/district_search",
      // params: "&state_id=" + this.stateID,
      searchkey: "query",
      displaykey: "name",
      wholedata: true,
      disabled: true,
      formcontrolname: 'district_id'

      // defaultvalue: this.district_name,
  };
  stateeditfield:any  = {
    label: "State",
    method: "get",
    url: this.atmaUrl + "mstserv/state_search",
    params: "&query=",
    searchkey: "query",
    displaykey: "name",
    Outputkey: "id",
    disabled: true,
    formcontrolname: 'state_id'

  };
  
  designationeditfield :any = {
    label: "Designation",
    method: "get",
    url: this.atmaUrl + "mstserv/designation_search",
    params: "&query=",
    searchkey: "query",
    displaykey: "name",
    wholedata: true,
    formcontrolname: 'designation_id'
    // defaultvalue :"designation_id",
  };

  msme_type_field:any= {
    label:"MSME Type",
    "method": "get",
    "url": this.atmaUrl + "mstserv/get_msmetype",
    params: "" ,
    // searchkey: "query",
    displaykey: "text",
    formcontrolname: 'msme_type',
    required: true,
  };
  // compositeList: Array<composite>;
  // groupList: Array<category>;
  // custcategoryList: Array<subcategory>;
  // classificationList: Array<classification>;
  // typeList: Array<vendortype>;
  // orgtypeList: Array<orgtype>;
  // employeeList: Array<RM>;
  // pinCodeList: Array<pincode>;
  // cityList: Array<city>;
  stateList: Array<state>;
  // districtList: Array<district>;
  // designationList: Array<Designation>;
  contactTypeList: Array<ContactType>;
  // riskcatList: Array<risk>;
  vendorId: number;
  totalEmployee: any;
  permanentEmployee: any;
  temporaryEmployee: any;
  // public Contract: boolean = false;
  Contract: any;
  fromdate: any;
  todate: Date;
  renewaldate: Date;
  inputGstValue = "";
  inputPanValue = "";
  cityId: number;
  districtId: number;
  stateId: number;
  pincodeId: number;
  directorNameList = [];
  name: any;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  pan_status: any;
  gst_status: any;
  isLoading = false;
  button = false;
  GstNo: any;
  pan: any;
  
  has_districtnext = true;
  has_districtprevious = true;
  districtcurrentpage: number = 1;
  has_citynext = true;
  has_cityprevious = true;
  citycurrentpage: number = 1;
  futureDays = new Date();
  addButton = false;
  array: number;
  list: string;
  requestStatusName: any;
  vendorStatusName: any;
  requeststatus_name = "";
  panHolderDOB: string;
  adultAgeDate: Date;
  minorAgeDate: Date;
  Panvalidate: boolean = false;
  pandata: {};
  isValidationSuccessful: boolean;
  showthepandatafield: boolean = false;
  msme: boolean = false;
  city_name: any;
  district_name: any;
  state_name: any;
  riskcatid: any;
  stateeditsfield:any
  cityeditsfield:any
  districteditsfield:any
  @ViewChild("closespopup") closespopup;
  @ViewChild("closepartneradd") closepartneradd;
  @Output() onCancel = new EventEmitter<any>();
  // @ViewChild("rmemp") matAutocomplete: MatAutocomplete;
  @ViewChild("long") long: ElementRef;
  // @ViewChild("rmInput") rmInput: any;

  // @ViewChild("autocit") matcityAutocomplete: MatAutocomplete;
  // @ViewChild("cityInput") cityInput: any;

  // @ViewChild("autodis") matdistrictAutocomplete: MatAutocomplete;
  // @ViewChild("districtInput") districtInput: any;

  // @ViewChild("statetype") matstateAutocomplete: MatAutocomplete;
  // @ViewChild("stateInput") stateInput: any;

  // @ViewChild("pintype") matpincodeAutocomplete: MatAutocomplete;
  // @ViewChild("pinCodeInput") pinCodeInput: any;

  // @ViewChild("desg") matdesignationAutocomplete: MatAutocomplete;
  // @ViewChild("designationInput") designationInput: any;

  // @ViewChild("contactType") matcontactAutocomplete: MatAutocomplete;
  // @ViewChild("contactInput") contactInput: any;
  // @ViewChild(MatAutocompleteTrigger)
  // autocompleteTrigger: MatAutocompleteTrigger;
  login_id: any;
  modify_ref_id: any;
  panvalname = "";
  pannumber = "";
  selectedriskopt: any[] = [];
  risktransactionList: any;
  presentpage: any;
  isVendorSummaryPagination: boolean;
  riskoptionList: any;
  selectedid: any;
  selectedtext: any;
  alreadyselected: any;
  isOthersSelected = false;
  isOtherOptionDisabled = false;
  isriskremarks = false;
  riskform: any;
  riskrmarks: any;
  oldvendorid: any;
  oldvendoriddata: any;
  newlyadded: any[] = [];
  oldselectedopt: any;
  ismsme: boolean = false;
  riskcategoryselected: any;
  risktypedetails: any;
  risk_deloption: any;
  ishighrisk: any;
  textcolor: any;
  inputPanNameValue: string;
  inputPanFathersNameValue: string;
  panholder_name: any;
  compositeListID: any;
  msmetick: boolean = false;

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  cityss: any;
  districtss: any;
  statess: any;
  isContractEnabled: boolean;
  reasonfornocontract: boolean = true;
  Nocontractreason: any;
  msme_type: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private notification: NotificationService,
    private errorHandler: ErrorHandlingService,
    private SpinnerService: NgxSpinnerService,
    private sharedService: ShareService,
    private toastr: ToastrService,
    private atmaService: AtmaService,
    private datePipe: DatePipe,
    private dialog: MatDialog
  ) {
    this.futureDays.setDate(this.futureDays.getDate());

    this.msme_type_field = {
      label:"MSME Type",
      "method": "get",
      "url": this.atmaUrl + "mstserv/get_msmetype",
      params: "" ,
      displaykey: "text",
      required: true,
      formcontrolname: 'msme_type'
    }
   
  }

  ngOnInit(): void {
    this.firstFormGroup = this.fb.group({
      firstCtrl: ["", Validators.required],
    });
    this.secondFormGroup = this.fb.group({
      secondCtrl: ["", Validators.required],
    });
    this.thirdFormGroup = this.fb.group({
      thirdCtrl: ["", Validators.required],
    });
    this.fourthFormGroup = this.fb.group({
      fourthCtrl: ["", Validators.required],
    });
    const sessionData = localStorage.getItem("sessionData");
    let logindata = JSON.parse(sessionData);
    this.login_id = logindata.employee_id;
    let data: any = this.sharedService.vendorEditValue.value;
    let status_data: any = this.sharedService.vendorView.value;
    this.requeststatus_name = status_data.requeststatus_name;
    this.modify_ref_id = status_data.modify_ref_id;
    this.pannumber = status_data.panno;
    // this.showthepandatafield = true;

    if (this.pannumber) {
      this.showthepandatafield = true;
    }
    // this.validationPAN('pan')
    console.log("data", data);
    this.vendorId = data;
    console.log("vendorid", this.vendorId);
    this.oldvendoriddata = this.sharedService.vendorsingleget.value;
    this.oldvendorid = this.oldvendoriddata.id;
    this.vendorEditForm = this.fb.group({
      code: [""],
      name: ["", Validators.required],
      // panno: ['', [Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
      panno: [
        "",
        [
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern("[A-Z]{5}[0-9]{4}[A-Z]{1}"),
        ],
      ],

      gstno: [
        "",
        [
          Validators.pattern(
            "^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$"
          ),
        ],
      ],
      // panno: ['', Validators.required],
      // gstno: ['', Validators.required],
      pannoholdername: ["", Validators.required],
      pannoholderfathername: [""],
      pannodob: ["", Validators.required],
      msme_reg_no: [{ value: "" }],
      msme: [""],
      msme_type: [""],
      composite: ["", Validators.required],
      comregno: [""],
      group: ["", Validators.required],
      custcategory_id: ["", Validators.required],
      classification: ["", Validators.required],
      risk_type: [""],
      riskcategory_id: [""],
      risk_remarks: [""],
      risk_deloption: [""],
      type: ["", Validators.required],
      website: [
        "",
        [
          Validators.pattern(
            "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
          ),
        ],
      ],
      activecontract: [""],
      pannovalidate: ["", Validators.required],
      nocontract_reason: [""],
      // contractdate_from: [''],
      // contractdate_to: [''],
      contractdate_from: [{ value: "", enabled: isBoolean }],
      contractdate_to: [{ value: "", enabled: isBoolean }],
      aproxspend: ["0.0"],
      actualspend: ["0.0"],
      orgtype: ["", Validators.required],
      renewal_date: [""],
      remarks: [""],
      rm_id: ["", Validators.required],
      // branch_count: ['', Validators.required],
      director_count: ["0"],
      // adhaarno: ['', Validators.required],
      adhaarno: ["", [Validators.pattern("[0-9]{12}")]],
      emaildays: ["", Validators.required],
      address: this.fb.group({
        line1: ["", Validators.required],
        line2: [""],
        line3: [""],
        pincode_id: ["", Validators.required],
        city_id: ["", Validators.required],
        district_id: ["", Validators.required],
        state_id: ["", Validators.required],
        id: [""],
      }),
      contact: this.fb.group({
        designation_id: ["", Validators.required],
        dob: [null],
        email: [
          "",
          [
            Validators.email,
            Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
          ],
        ],
        landline: [""],
        landline2: [""],
        mobile: [""],
        mobile2: [""],
        name: ["", Validators.required],
        // type_id: ['', Validators.required],
        id: [""],
      }),
      profile: this.fb.group({
        year: [""],
        associate_year: [""],
        award_details: [""],
        permanent_employee: [""],
        temporary_employee: [""],
        total_employee: [""],
        branch: ["", Validators.required],
        factory: [""],
        remarks: [""],
        id: [""],
      }),
      director: this.fb.group({
        name: [""],
      }),
    });

    this.riskform = this.fb.group({
      risk_remarks: [""],
    });
    // let rmkeyvalue: String = "";
    // this.getRmEmployee(rmkeyvalue);

    // this.vendorEditForm.get('rm_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),
    //     switchMap(value => this.atmaService.get_EmployeeName(value,1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.employeeList = datas;
    //     console.log("rm", datas)

    //   })
    //   let desgkeyvalue: String = "";
    // this.getDesignation(desgkeyvalue);

    // this.vendorEditForm.controls.contact.get('designation_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),
    //     switchMap(value => this.atmaService.get_designation(value,1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.designationList = datas;

    //   })
    // let contactkeyvalue: String = "";
    // this.getContactType(contactkeyvalue);

    // this.vendorEditForm.controls.contact.get('type_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),
    //     switchMap(value => this.atmaService.get_contact(value, 1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.contactTypeList = datas;

    //   })
    // let districtkeyvalue: String = "";
    // this.getDistrict(districtkeyvalue);

    // this.vendorEditForm.controls.address.get('district_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap(value => this.atmaService.get_district(value,1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.districtList = datas;

    //   })
    // let districtkeyvalue: String = "";
    // this.getDistrict(districtkeyvalue);

    // this.vendorEditForm.controls.address.get('district_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap(value => this.atmaService.get_districtValue(this.stateID,value,1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.districtList = datas;

    //   })
    // let citykeyvalue: String = "";
    // this.getCity(citykeyvalue);

    // this.vendorEditForm.controls.address.get('city_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap(value => this.atmaService.get_city(value, 1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.cityList = datas;

    //   })
    // let pincodekeyvalue: String = "";
    // this.getPinCode(pincodekeyvalue);

    // this.vendorEditForm.controls.address.get('pincode_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),

    //     switchMap(value => this.atmaService.get_pinCode(value,1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.pinCodeList = datas;

    //   })
    // let statekeyvalue: String = "";
    // this.getState(statekeyvalue);

    // this.vendorEditForm.controls.address.get('state_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),

    //     switchMap(value => this.atmaService.get_state(value,1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.stateList = datas;

    //   })
    this.getVendorEdit();
    // this.getComposite();
    // this.getGroup();
    // this.getCustCategory();
    // this.getClassification();
    // this.getType();
    // this.getOrgType();

    this.ishighrisk = this.sharedService.ishighrisk.value;
  }

  onCancelClick() {
    this.router.navigate(["/atma/vendorView"], { skipLocationChange: true });

    // this.onCancel.emit()
    // this.ngOnInit();
  }
  // compositeclick() {
  //   this.getComposite();
  // }
  // groupclick() {
  //   this.getGroup();
  // }
  // custclick() {
  //   this.getCustCategory();
  // }
  // classificationclick() {
  //   this.getClassification();
  // }
  // typeclick() {
  //   this.getType();
  // }
  // orgtypeclick() {
  //   this.getOrgType();
  // }

  // rmname() {
  //   let rmkeyvalue: String = "";
  //   this.getRmEmployee(rmkeyvalue);

  //   this.vendorEditForm
  //     .get("rm_id")
  //     .valueChanges.pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
  //         console.log("inside tap");
  //       }),
  //       switchMap((value) =>
  //         this.atmaService.getEmployeeSearchFilter2(value, 1).pipe(
  //           finalize(() => {
  //             this.isLoading = false;
  //           })
  //         )
  //       )
  //     )
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.employeeList = datas;
  //       console.log("rm", datas);
  //     });
  // }
  statename() {
    let statekeyvalue: String = "";
    this.getState(statekeyvalue);

    this.vendorEditForm.controls.address
      .get("state_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),

        switchMap((value) =>
          this.atmaService.get_state(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.stateList = datas;
      });
  }
  // pincodename() {
  //   let pincodekeyvalue: String = "";
  //   this.getPinCode(pincodekeyvalue);

  //   this.vendorEditForm.controls.address
  //     .get("pincode_id")
  //     .valueChanges.pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
  //         console.log("inside tap");
  //       }),

  //       switchMap((value) =>
  //         this.atmaService.get_pinCode(value, 1).pipe(
  //           finalize(() => {
  //             this.isLoading = false;
  //           })
  //         )
  //       )
  //     )
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.pinCodeList = datas;
  //     });
  // }
  // cityname() {
  //   let citykeyvalue: String = "";
  //   this.getCity(citykeyvalue);

  //   this.vendorEditForm.controls.address
  //     .get("city_id")
  //     .valueChanges.pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
  //       }),
  //       switchMap((value) =>
  //         this.atmaService.get_city(value, 1).pipe(
  //           finalize(() => {
  //             this.isLoading = false;
  //           })
  //         )
  //       )
  //     )
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.cityList = datas;
  //     });
  // }
  // districtname() {
  //   let districtkeyvalue: String = "";
  //   this.getDistrict(districtkeyvalue);

  //   this.vendorEditForm.controls.address
  //     .get("district_id")
  //     .valueChanges.pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
  //       }),
  //       switchMap((value) =>
  //         this.atmaService.get_districtValue(this.stateID, value, 1).pipe(
  //           finalize(() => {
  //             this.isLoading = false;
  //           })
  //         )
  //       )
  //     )
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.districtList = datas;
  //     });
  // }
  // designationname() {
  //   let desgkeyvalue: String = "";
  //   this.getDesignation(desgkeyvalue);

  //   this.vendorEditForm.controls.contact
  //     .get("designation_id")
  //     .valueChanges.pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
  //         console.log("inside tap");
  //       }),
  //       switchMap((value) =>
  //         this.atmaService.get_designation(value, 1).pipe(
  //           finalize(() => {
  //             this.isLoading = false;
  //           })
  //         )
  //       )
  //     )
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.designationList = datas;
  //     });
  // }
  // classifyname() {
  //   this.getClassification();

  //   this.vendorEditForm
  //     .get("classification")
  //     .valueChanges.pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
  //         console.log("inside tap");
  //       }),
  //       switchMap((value) =>
  //         this.atmaService.getClassification().pipe(
  //           finalize(() => {
  //             this.isLoading = false;
  //           })
  //         )
  //       )
  //     )
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.classificationList = datas;
  //     });
  // }
  // riskname() {
  //   this.getriskcategory();

  //   this.vendorEditForm
  //     .get("risk_type")
  //     .valueChanges.pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
  //         console.log("inside tap");
  //       }),
  //       switchMap((value) =>
  //         this.atmaService.getriskcategory().pipe(
  //           finalize(() => {
  //             this.isLoading = false;
  //           })
  //         )
  //       )
  //     )
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.riskcatList = datas;
  //     });
  // }
  // private getriskcategory() {
  //   this.atmaService.getriskcategory().subscribe((results: any[]) => {
  //     let datas = results["data"];
  //     this.riskcatList = datas;
  //   });
  // }
  // compositename() {
  //   this.getComposite();

  //   this.vendorEditForm
  //     .get("composite")
  //     .valueChanges.pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
  //         console.log("inside tap");
  //       }),
  //       switchMap((value) =>
  //         this.atmaService.getComposite().pipe(
  //           finalize(() => {
  //             this.isLoading = false;
  //           })
  //         )
  //       )
  //     )
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.compositeList = datas;
  //     });
  // }

  compositeclickingg() {
    this.Panvalidate = false;
  }
  // typename() {
  //   this.getType();

  //   this.vendorEditForm
  //     .get("type")
  //     .valueChanges.pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
  //         console.log("inside tap");
  //       }),
  //       switchMap((value) =>
  //         this.atmaService.getType().pipe(
  //           finalize(() => {
  //             this.isLoading = false;
  //           })
  //         )
  //       )
  //     )
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.typeList = datas;
  //     });
  // }
  // orgtypename() {
  //   this.getOrgType();

  //   this.vendorEditForm
  //     .get("orgtype")
  //     .valueChanges.pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
  //         console.log("inside tap");
  //       }),
  //       switchMap((value) =>
  //         this.atmaService.getOrgType().pipe(
  //           finalize(() => {
  //             this.isLoading = false;
  //           })
  //         )
  //       )
  //     )
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.orgtypeList = datas;
  //     });
  // }
  // categoryname() {
  //   this.getGroup();

  //   this.vendorEditForm
  //     .get("group")
  //     .valueChanges.pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
  //         console.log("inside tap");
  //       }),
  //       switchMap((value) =>
  //         this.atmaService.getGroup().pipe(
  //           finalize(() => {
  //             this.isLoading = false;
  //           })
  //         )
  //       )
  //     )
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.groupList = datas;
  //     });
  // }
  // subcategoryname() {
  //   this.getCustCategory();

  //   this.vendorEditForm
  //     .get("custcategory_id")
  //     .valueChanges.pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
  //         console.log("inside tap");
  //       }),
  //       switchMap((value) =>
  //         this.atmaService.getCustCategory().pipe(
  //           finalize(() => {
  //             this.isLoading = false;
  //           })
  //         )
  //       )
  //     )
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.custcategoryList = datas;
  //     });
  // }

  directorCount() {
    let count = this.vendorEditForm.value.director_count;
    this.addButton = false;
    console.log("number", count);
  }

  addDirectorName() {
    let count = this.vendorEditForm.value.director_count;
    let name = this.vendorEditForm.value.director.name;
    if (count == 0) {
      this.notification.showWarning("Please Enter valid Director count");
    } else if (count == "") {
      this.notification.showWarning("Please Fill Director count");
    } else if (name == "") {
      this.notification.showWarning("Please Fill Director Name");
    } else {
      let data = {
        name: name,
      };
      let arraySize = this.directorNameList.length;
      if (count > arraySize) {
        this.directorNameList.push(data);
        this.SummaryApivendorcreatemodifyObjNew = {"method": "get",FeSummary:true, data:this.directorNameList}
        this.array = this.directorNameList.length;
        this.list = this.array.toString();
        if (count === this.list) {
          this.addButton = true;
        }
        console.log("aa", this.directorNameList);
        this.inputName.nativeElement.value = " ";
        this.vendorEditForm.value.director.name = [];
      }
    }
  }
  namevalidation(event) {
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9 ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  addressvalidation(event) {
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9-_#@.', &]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  directorNameDelete(index: number) {
    this.directorNameList.splice(index, 1);
    console.log("delete", this.directorNameList);
    let count = this.vendorEditForm.value.director_count;
    this.array = this.directorNameList.length;
    this.list = this.array.toString();
    if (count === this.list) {
      this.addButton = true;
    } else {
      this.addButton = false;
    }
    this.SummaryApivendorcreatemodifyObjNew = {"method": "get",FeSummary:true, data:this.directorNameList}

  }

  // public displayFnRm(rmemp?: RM): string | undefined {
  //   return rmemp ? rmemp.full_name : undefined;
  // }

  // get rmemp() {
  //   return this.vendorEditForm.value.get("rm_id");
  // }

  // public displayFnDesg(desg?: Designation): string | undefined {
  //   return desg ? desg.name : undefined;
  // }

  // get desg() {
  //   return this.vendorEditForm.value.get("designation_id");
  // }

  // public displayFnContactType(contactType?: ContactType): string | undefined {
  //   return contactType ? contactType.name : undefined;
  // }

  // get contactType() {
  //   return this.vendorEditForm.value.get('type_id');
  // }

  // public displaydis(autodis?: district): string | undefined {
  //   return autodis ? autodis.name : undefined;
  // }

  // get autodis() {
  //   return this.vendorEditForm.controls.address.get("district_id");
  // }

  // public displaycit(autocit?: city): string | undefined {
  //   return autocit ? autocit.name : undefined;
  // }

  // get autocit() {
  //   return this.vendorEditForm.controls.address.get("city_id");
  // }

  // public displayFnpin(pintype?: pincode): string | undefined {
  //   return pintype ? pintype.no : undefined;
  // }

  // get pintype() {
  //   return this.vendorEditForm.controls.address.get("pincode_id");
  // }

  public displayFnstate(statetype?: state): string | undefined {
    return statetype ? statetype.name : undefined;
  }

  get statetype() {
    return this.vendorEditForm.controls.address.get("state_id");
  }
  // public displayFnclassify(classify?: classification): string | undefined {
  //   return classify ? classify.text : undefined;
  // }
  // public displayFnrisk(risk?: classification): string | undefined {
  //   return risk ? risk.text : undefined;
  // }
  // get classify() {
  //   return this.vendorEditForm.get("classification");
  // }
  // public displayFngst(gstcat?: composite): string | undefined {
  //   return gstcat ? gstcat.text : undefined;
  // }

  // get gstcat() {
  //   return this.vendorEditForm.get("composite");
  // }
  // public displayFntypes(ventype?: vendortype): string | undefined {
  //   return ventype ? ventype.text : undefined;
  // }

  // get ventype() {
  //   return this.vendorEditForm.get("type");
  // }
  // public displayFnorgtypes(orgtype?: orgtype): string | undefined {
  //   return orgtype ? orgtype.text : undefined;
  // }

  // get orgtype() {
  //   return this.vendorEditForm.get("orgtype");
  // }
  // public displayFncategory(categorytype?: category): string | undefined {
  //   return categorytype ? categorytype.text : undefined;
  // }

  // get categorytype() {
  //   return this.vendorEditForm.get("group");
  // }

  // public displayFnsubcategory(subcategory?: subcategory): string | undefined {
  //   return subcategory ? subcategory.name : undefined;
  // }

  // get subcategory() {
  //   return this.vendorEditForm.get("custcategory_id");
  // }

  // private getRmEmployee(rmkeyvalue) {
  //   this.atmaService
  //     .getEmployeeSearchFilter2(rmkeyvalue, 1)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.employeeList = datas;
  //     });

  //   // this.employeeList.forEach( (item, index) => {
  //   //   if(item.id===this.login_id) this.employeeList.splice(index,1);
  //   // });
  // }

  getVendorEdit() {
    this.atmaService.getVendor(this.vendorId).subscribe((result) => {
      // this.frtodatevendoredit= {"fromobj":{label: "Contract From",disabled: false, defaultvalue:result.contractdate_from},toobj:{label: "Contract To", disabled: false, defaultvalue: result.contractdate_to}}
      let data = result;
      this.isContractEnabled = (data.activecontract === 'True');
      this.Contract = this.isContractEnabled;

      if (this.Contract) {
      this.vendorEditForm.get('emaildays').enable();
      } else {
      this.vendorEditForm.get('emaildays').disable();
      this.vendorEditForm.controls.emaildays.patchValue(0);
      }
      // this.relationcatedit = {
      //   label: "Relationship Category",
      //   method: "get",
      //   url: this.atmaUrl + "mstserv/group",
      //   params: "",
      //   searchkey: "",
      //   displaykey: "text",
      //   wholedata: true,
      //   required : true,
      //   defaultvalue :result.group,
      // }
      // this.relationsubcatedit = {
      //   label: "Relationship Subcategory",
      //   method: "get",
      //   url: this.atmaUrl + "mstserv/customercategory",
      //   params: "",
      //   searchkey: "",
      //   displaykey: "name",
      //   wholedata: true,
      //   required : true,
      //   defaultvalue :result.custcategory_id,
      // }
      // this.orgtypefieldedit = {
      //   label: "Organization Type",
      //   method: "get",
      //   url: this.atmaUrl + "mstserv/org_type",
      //   params: "",
      //   searchkey: "",
      //   displaykey: "text",
      //   wholedata: true,
      //   required : true,
      //   defaultvalue :result.orgtype,
      // }
      // this.relatypefieldedit = {
      //   label: "Relationship Type",
      //   method: "get",
      //   url: this.atmaUrl + "mstserv/classification",
      //   params: "",
      //   searchkey: "",
      //   displaykey: "text",
      //   wholedata: true,
      //   required : true,
      //   defaultvalue :result.classification,
      // }
      // this.comfieldedit = {
      //   label: "GST Category",
      //   method: "get",
      //   url: this.atmaUrl + "mstserv/composite",
      //   params: "",
      //   searchkey: "",
      //   displaykey: "text",
      //   wholedata: true,
      //   required : true,
      //   defaultvalue :result.composite,
      // };
      // this. classifycrityfieldedit = {
      //   label: "Criticality Classification",
      //   method: "get",
      //   url: this.atmaUrl + "mstserv/type",
      //   params: "",
      //   searchkey: "",
      //   displaykey: "text",
      //   wholedata: true,
      //   required : true,
      //   defaultvalue :result.type,
      // };
      // this.  riskcateditfield = {
      //   label: "Risk Category",
      //   method: "get",
      //   url: this.atmaUrl + "mstserv/risktype",
      //   params: "",
      //   searchkey: "",
      //   displaykey: "text",
      //   wholedata: true,
      //   required : true,
      //   defaultvalue :result.risk_type,
      // };
      // this.  headereditfield = {
      //   label: "Header Name",
      //     method: "get",
      //     url: this.atmaUrl + "usrserv/searchheader",
      //     params: "&query=",
      //     searchkey: "query",
      //     displaykey: "full_name",
      //     wholedata: true,
      //     required : true,
      //     defaultvalue :result.rm_id,
      // }
      let pincodes= result.address.pincode_id
      pincodes.city = result.address.city_id
      pincodes.district= result.address.district_id
      pincodes.state = result.address.state_id
      // this.pincodeeditfield = {
      //   label: "Pin Code",
      //   method: "get",
      //   url: this.atmaUrl + "mstserv/pincodesearch",
      //   params: "&query=",
      //   searchkey: "query",
      //   displaykey: "no",
      //   wholedata: true,
      //   required : true,
      //   formcontrolname: 'pincode_id'
      // }
      // this.cityeditfield = {
      //   label: "City",
      //   method: "get",
      //   url: this.atmaUrl + "mstserv/new_city_search",
      //   params: "&state_id=" + this.stateID,
      //   searchkey: "query",
      //   displaykey: "name",
      //   wholedata: true,
      //   disabled: true,
      //   formcontrolname: 'city_id'
      //   // defaultvalue: this.city_name,
      // }
      // this.districteditfield = {
      //   label: "District",
      //   method: "get",
      //   url: this.atmaUrl + "mstserv/district_search",
      //   params: "&state_id=" + this.stateID,
      //   searchkey: "query",
      //   displaykey: "name",
      //   wholedata: true,
      //   disabled: true,
      //   formcontrolname: 'district_id'
      //   // defaultvalue: this.district_name,
      // };
      // this.stateeditfield  = {
      //   label: "State",
      //   method: "get",
      //   url: this.atmaUrl + "mstserv/state_search",
      //   params: "",
      //   searchkey: "query",
      //   displaykey: "name",
      //   wholedata: true,
      //   formcontrolname: 'state_id' ,
      //   disabled: true,
      //   // defaultvalue: this.state_name,
      // }
      // this.designationeditfield  = {
      //   label: "Designation",
      //   method: "get",
      //   url: this.atmaUrl + "mstserv/designation_search",
      //   params: "&query=",
      //   searchkey: "query",
      //   displaykey: "name",
      //   wholedata: true,
      //   defaultvalue :result.contact.designation_id,
      // }

    
      console.log("totalldata", data);
      let Code = data.code;
      let Name = data.name;
      let Gst = data.gstno;
      this.GstNo = data.gstno.slice(2, -3);
      let Pan = data.panno;
      this.pan = data.panno;

      this.panholder_name = data.panholder_name;
      let pan_dob = data.pan_dob;
      let father_name = data.father_name;
      let composite = data["composite"];

      let compositeid = data.composite;
      let Comregno = data.comregno;
      let group = data["group"];

      // let groupid = gpid
      let groupid = data.group;
      let custcategory_id = data["custcategory_id"];

      let custcategoryid = data.custcategory_id;
      let classification = data["type"];
      let risk_type = data?.risk_type;
      this.risktypedetails = data?.risk_type;
      this.riskcatid = data?.risk_type?.id;

      let riskcategory_id = data.riskcategory_id;
      // this.alreadyselected = data.riskcategory_id;
      this.selectedriskopt = data.riskcategory_id;
      this.oldselectedopt = data.riskcategory_id;
      // if(this.selectedriskopt.includes(9)){
      this.msmetick = data.msme;
      if (this.msmetick == true) {
        this.ismsme = true;
        this.vendorEditForm.get("msme_reg_no").enable();
        this.msme_type_field = {
          label:"MSME Type",
          "method": "get",
          "url": this.atmaUrl + "mstserv/get_msmetype",
          params: "" ,
          // searchkey: "query",
          displaykey: "text",
          // defaultvalue :result.msme_type,
           formcontrolname: 'msme_type',
          required: true,
        }
        this.cursor();
      } else {
        this.ismsme = false;
        this.vendorEditForm.get("msme_reg_no").disable();
      }
      let Msme_reg_no = data.msme_reg_no;
      if (this.selectedriskopt.includes(1)) {
        //If others is checked need to disable remaining options
        this.isOthersSelected = true;
      } else {
        //To Disable Other option disabled
        this.isOtherOptionDisabled = true;
      }
      let risk_remarks = data.risk_remarks;

      if (
        risk_remarks != "" &&
        risk_remarks != undefined &&
        risk_remarks != null
      ) {
        this.isriskremarks = true;
      }
      // let classificationid = clid
      let classificationid = data.classification;
      let type = data["classification"];

      // let typeid = typid
      let typeid = data.type;
      let Website = data.website;
      if (data.activecontract == "True") {
        this.Contract = true;
        this.Contractdatefrom = data.contractdate_from;
        this.Contractdateto = data.contractdate_to;
        this.vendorEditForm.get("nocontract_reason").disable();
        this.frtodatevendoredit= {"fromobj":{label: "Contract From",disabled: false, defaultvalue:data.contractdate_from},toobj:{label: "Contract To", disabled: false, defaultvalue: data.contractdate_to},renewobj:{label: "Renewal Date",  disabled: false, defaultvalue: data.renewal_date}}

      } else {
        this.Contract = false;
        this.vendorEditForm.get("contractdate_from").disable();
        this.vendorEditForm.get("contractdate_to").disable();
        this.frtodatevendoredit = {"fromobj":{label: "Contract From",disabled: true},toobj:{label: "Contract To", disabled: false},renewobj:{label: "Renewal Date", disabled: true}}
        this.Nocontractreason = data.nocontract_reason;

        // this.vendorEditForm.value.contractdate_to.disable()
      }
      // this.Contract = data.activecontract
      // let Activecontract = this.Contract
      // let Contractdatefrom = data.contractdate_from
      // let Contractdateto = data.contractdate_to

      let Aproxspend = data.aproxspend;
      let Actualspend = data.actualspend;

      let orgtype = data["orgtype"];
      // let orgtypid = orgtype['id'];
      // let orgtyptext = orgtype['text']
      // let orgtypeid = orgtypid
      let orgtypeid = data.orgtype;
      let Renewaldate = data.renewal_date;
      if (Renewaldate == "None") {
        Renewaldate = null;
      }
      let Remarks = data.remarks;
      let employeeName = data.rm_id;
      let ad = data.adhaarno;
      let em = data.emaildays;
      let Directorcount = data.director_count;
      let Address = data.address;
      let addressId = Address.id;
      let Line1 = Address.line1;
      let Line2 = Address.line2;
      let Line3 = Address.line3;
      let pincode = data.address.pincode_id;
      let city = data.address.city_id;
      let district = data.address.district_id;
      let state = data.address.state_id;
      let Contact = data.contact;
      let contactId = Contact.id;
      let cname = Contact.name;
      let cmail = Contact.email;
      let clandline = Contact.landline;
      let clandline2 = Contact.landline2;
      let cmobile = Contact.mobile;
      let cmobile2 = Contact.mobile2;
      let Dob = Contact.dob;
      let msme_types = data.msme_type;
      if (Dob == "None") {
        Dob = null;
      }
      let designation = data.contact.designation_id;
      // let contacttype = data.contact.type_id
      let Profile = data.profile;
      let ProfileId = Profile.id;
      let Year = Profile.year;
      let Associateyear = Profile.associate_year;
      let Awarddetails = Profile.award_details;
      let Branch = Profile.branch;
      let Factory = Profile.factory;
      let Pfremarks = Profile.remarks;
      let Permanentemployee = Profile.permanent_employee;
      let Temporaryemployee = Profile.temporary_employee;
      let Totalemployee = Profile.total_employee;
      this.directorNameList = data.director;
      this.SummaryApivendorcreatemodifyObjNew = {"method": "get",FeSummary:true, data:this.directorNameList}
      this.riskform.patchValue({
        risk_remarks: data.risk_remarks,
      });
      // this.vendorEditForm.get("pannoholdername").patchValue(panholder_name);
      this.vendorEditForm.patchValue({
        code: Code,
        name: Name,
        panno: Pan,
        pannoholdername: this.panholder_name,
        pannodob: pan_dob,
        pannoholderfathername: father_name,
        gstno: Gst,
        composite: compositeid,
        comregno: Comregno,
        group: groupid,
        msme: this.msmetick,
        msme_type:msme_types,
        msme_reg_no: Msme_reg_no,
        custcategory_id: custcategoryid,
        classification: classificationid,
        risk_type: risk_type,
        riskcategory_id: riskcategory_id,
        risk_remarks: risk_remarks,
        type: typeid,
        website: Website,
        activecontract: this.Contract,
        nocontract_reason: this.Nocontractreason,
        contractdate_from: this.Contractdatefrom,
        contractdate_to: this.Contractdateto,
        aproxspend: Aproxspend,
        actualspend: Actualspend,
        orgtype: orgtypeid,
        renewal_date: Renewaldate,
        remarks: Remarks,
        rm_id: employeeName,
        emaildays: em,
        adhaarno: ad,
        director_count: Directorcount,
        address: {
          line1: Line1,
          line2: Line2,
          line3: Line3,
          pincode_id: pincode,
          city_id: city,
          district_id: district,
          state_id: state,
          id: addressId,
        },
        contact: {
          designation_id: designation,
          dob: Dob,
          name: cname,
          email: cmail,
          landline: clandline,
          landline2: clandline2,
          mobile: cmobile,
          mobile2: cmobile2,
          // "type_id": contacttype,
          id: contactId,
        },
        profile: {
          year: Year,
          associate_year: Associateyear,
          award_details: Awarddetails,
          branch: Branch,
          factory: Factory,
          remarks: Pfremarks,
          permanent_employee: Permanentemployee,
          temporary_employee: Temporaryemployee,
          total_employee: Totalemployee,
          id: ProfileId,
        },
      });
      if (
        this.vendorEditForm.value.composite.id == 1 ||
        this.vendorEditForm.value.composite.id == 2
      ) {
        this.Panvalidate = true;
      }

      if (
        this.vendorEditForm.value.composite.id != 1 &&
        this.vendorEditForm.value.composite.id != 2
      ) {
        if (
          this.vendorEditForm.value.panno != "" &&
          this.vendorEditForm.value.panno != null &&
          this.vendorEditForm.value.panno != undefined
        ) {
          this.Panvalidate = true;
        }
      }
    });
  }

  // private getComposite() {
  //   this.atmaService.getComposite().subscribe((results: any[]) => {
  //     let datas = results["data"];
  //     this.compositeList = datas;
  //     this.compositeListID = datas.id;
  //   });
  // }

  // private getGroup() {
  //   this.atmaService.getGroup().subscribe((results: any[]) => {
  //     let datas = results["data"];
  //     this.groupList = datas;
  //   });
  // }

  // private getCustCategory() {
  //   this.atmaService.getCustCategory().subscribe((results: any[]) => {
  //     let datas = results["data"];
  //     this.custcategoryList = datas;
  //   });
  // }

  // private getClassification() {
  //   this.atmaService.getClassification().subscribe((results: any[]) => {
  //     let datas = results["data"];
  //     this.classificationList = datas;
  //   });
  // }

  // private getType() {
  //   this.atmaService.getType().subscribe((results: any[]) => {
  //     let datas = results["data"];
  //     this.typeList = datas;
  //   });
  // }

  // private getOrgType() {
  //   this.atmaService.getOrgType().subscribe((results: any[]) => {
  //     let datas = results["data"];
  //     this.orgtypeList = datas;
  //   });
  // }

  // private getPinCode(pincodekeyvalue) {
  //   this.atmaService
  //     .getPinCodeSearch(pincodekeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.pinCodeList = datas;
  //     });
  // }

  // private getCity(citykeyvalue) {
  //   this.atmaService.getCitySearch(citykeyvalue).subscribe((results: any[]) => {
  //     let datas = results["data"];
  //     this.cityList = datas;
  //   });
  // }

  // private getDistrict(districtkeyvalue) {
  //   this.atmaService
  //     .districtdropdown(this.stateID, districtkeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.districtList = datas;
  //     });
  // }

  private getState(statekeyvalue) {
    this.atmaService
      .getStateSearch(statekeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.stateList = datas;
      });
  }
  // private getDesignation(desgkeyvalue) {
  //   this.atmaService
  //     .getDesignationSearch(desgkeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.designationList = datas;
  //     });
  // }

  // private getContactType(contactkeyvalue) {
  //   this.atmaService.getContactSearch(contactkeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.contactTypeList = datas;

  //     })
  // }
  pinCode(data) {
    this.cityId = data.city;
    this.districtId = data.district;
    this.stateId = data.state;
    this.pincodeId = data;
    this.vendorEditForm.patchValue({
      address: {
        city_id: this.cityId,
        district_id: this.districtId,
        state_id: this.stateId,
        pincode_id: this.pincodeId,
      },
    });
  }

  citys(data) {
    this.cityId = data;
    this.districtId = data.district;
    this.stateId = data.state;
    this.pincodeId = data.pincode;
    this.vendorEditForm.patchValue({
      address: {
        city_id: this.cityId,
        state_id: this.stateId,
        district_id: this.districtId,
        pincode_id: this.pincodeId,
      },
    });
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onClick( e:MatCheckboxChange) {
      this.Contract = !e.checked
    console.log("click", this.Contract)
    if (this.Contract === false) {
      this.frtodatevendoredit = {"fromobj":{label: "Contract From",disabled: false},toobj:{label: "Contract To", disabled: false},renewobj:{label: "Renewal Date", disabled: false}}
      this.vendorEditForm.get('nocontract_reason').disable();
      this.vendorEditForm.get('contractdate_from').enable();
      this.vendorEditForm.get('contractdate_to').enable();
      this.vendorEditForm.get('renewal_date').enable();
      this.vendorEditForm.get('emaildays').enable();
      this.vendorEditForm.controls.emaildays.patchValue(30)
      this.reasonfornocontract= false
      this.vendorEditForm.get('nocontract_reason').reset();


    } else {
      this.frtodatevendoredit = {"fromobj":{label: "Contract From",disabled: true},toobj:{label: "Contract To", disabled: false},renewobj:{label: "Renewal Date", disabled: true}}
      this.vendorEditForm.get('contractdate_from').disable();
      this.vendorEditForm.get('contractdate_from').reset();
      this.vendorEditForm.get('contractdate_to').disable();
      this.vendorEditForm.get('contractdate_to').reset();
      this.vendorEditForm.get('nocontract_reason').enable();
      this.vendorEditForm.get('renewal_date').disable();
      this.vendorEditForm.get('renewal_date').reset();
      this.vendorEditForm.controls.emaildays.reset()
      this.vendorEditForm.get('emaildays').disable();
      this.vendorEditForm.controls.emaildays.patchValue(0);
      this.reasonfornocontract= true
      this.vendorEditForm.get('nocontract_reason').reset();


    }
  }

  cursor() {
    if (this.long && this.long.nativeElement) {
      this.long.nativeElement.focus();
    }
  }

  Msmecheck(e) {
    if (e.checked) {
      // this.msme = true
      this.ismsme = true;
      this.vendorEditForm.get("msme_reg_no").enable();
      this.msmetick = true
      this.cursor();
      this.msme_type_field = {
        label:"MSME Type",
        "method": "get",
        "url": this.atmaUrl + "mstserv/get_msmetype",
        params: "" ,
        displaykey: "text",
        formcontrolname: 'msme_type',
        required: true,
      }
    } else {
      // this.msme = false
      this.ismsme = false;
      this.vendorEditForm.get("msme_reg_no").disable();
      this.msmetick = false
      this.msme_type_field = { label:"MSME Type"}
    }
  }
  onTabKey(event: KeyboardEvent) {
    const msmeRegNoValue = this.vendorEditForm.get("msme_reg_no").value;

    if (event.key === "Tab") {
      if (msmeRegNoValue.trim() !== "") {
        //
      } else {
        event.preventDefault();
        this.toastr.error("Please Enter MSME Registration Number.");
      }
    }
  }

  panvalidateclick() {
    this.SpinnerService.show();

    if (
      this.vendorEditForm.value.pannoholdername === "" ||
      this.vendorEditForm.value.pannoholdername === null ||
      this.vendorEditForm.value.pannoholdername === undefined
    ) {
      this.toastr.error("Please Enter PAN Holder Name");
      this.SpinnerService.hide();
      return false;
    }
    if (
      this.vendorEditForm.value.pannodob === "" ||
      this.vendorEditForm.value.pannodob === null ||
      this.vendorEditForm.value.pannodob === undefined
    ) {
      this.toastr.error("Please Enter DOB");
      this.SpinnerService.hide();
      return false;
    }
    // if (this.vendorAddForm.value.pannoholderfathername === "" || this.vendorAddForm.value.pannoholderfathername === null || this.vendorAddForm.value.pannoholderfathername === undefined) {
    //   this.toastr.error('Please Enter Father`s Name');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    console.log("click", this.Panvalidate);

    const panno = this.vendorEditForm.get("panno").value;
    const pannoholdername = this.vendorEditForm.get("pannoholdername").value;
    const pannoholderfathername = this.vendorEditForm.get(
      "pannoholderfathername"
    ).value;
    let pannodob = this.vendorEditForm.get("pannodob").value;

    // Format pannodob (DOB) to "DD/MM/YYYY" format
    const dobDate = new Date(pannodob);
    pannodob = `${dobDate.getDate().toString().padStart(2, "0")}/${(
      dobDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${dobDate.getFullYear()}`;

    this.pandata = {
      inputData: [
        {
          pan: panno,
          name: pannoholdername,
          fathername: pannoholderfathername,
          dob: pannodob,
        },
      ],
    };

    this.atmaService.panvalidation(this.pandata).subscribe(
      (res) => {
        console.log("vendor", res);
        if (res.status !== undefined) {
          if (res.status === "E") {
            this.notification.showSuccess(res.Message);
            this.Panvalidate = true;
            this.isValidationSuccessful = true;
            this.SpinnerService.hide();
          } else {
            this.notification.showError(res.Message);
            this.Panvalidate = false;
            this.isValidationSuccessful = false;
            this.SpinnerService.hide();
          }
        } else {
          this.notification.showError(res.ErrorMessage);
          this.Panvalidate = false;
          this.isValidationSuccessful = false;
          this.SpinnerService.hide();
        }
      },
      //   if(res.status === "E"){
      //     this.notification.showSuccess(res.Message)
      //     this.isValidationSuccessful = true;
      //     this.SpinnerService.hide();
      //   }
      //   else if(res.status !== "E"){
      //     this.notification.showError(res.Message)
      //     this.isValidationSuccessful = false;
      //     this.SpinnerService.hide();
      //   }
      //   else if(res.code){
      //     this.notification.showError(res.ErrorMessage)
      //     this.isValidationSuccessful = false;
      //     this.SpinnerService.hide();
      //     return false;
      //   } else {
      //     this.notification.showError("Unexpected Error!");
      //     this.isValidationSuccessful = false;
      //     this.SpinnerService.hide();
      //   }
      // },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  fromDateSelection(event: string) {
    console.log("fromdate", event);
    const date = new Date(event);
    console.log(date, "test");
    console.log("ss", this.vendorEditForm.value.contractdate_from);
    // this.fromdate = this.datePipe.transform(date, 'yyyy-MM-dd')+1;
    this.fromdate = this.datePipe.transform(date, "yyyy-MM-dd"); // bug id:8033
    this.todate = new Date(
      date.getFullYear(),
      date.getMonth() + 12,
      date.getDate()
    );
    this.renewaldate = new Date(
      date.getFullYear(),
      date.getMonth() + 11,
      date.getDate()
    );
  }

  toDateSelection(event: string) {
    console.log("todate", event);
    const date = new Date(event);
    console.log(date, 'test');
  
    // Calculate the renewaldate by subtracting 30 days from the contract to date
    const renewalDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 30);
    this.renewaldate = renewalDate;
  
    // Update the form field
    this.vendorEditForm.controls['renewal_date'].setValue(this.renewaldate);
    // this.checkRenewalDate(renewalDate)
  }

//   checkRenewalDate(renewalDate: Date) {
//     const today = new Date();
//     this.today = false;
//      if (renewalDate <= new Date()) {
//         this.today = true;
//         this.openErrorDialog();
//     }
// }

// openErrorDialog() {
//   const dialogConfig = new MatDialogConfig();
//   dialogConfig.disableClose = true; // This will prevent closing the dialog by clicking outside
//   this.dialog.open(this.errorDialog, dialogConfig);
// }
  fromDOBSelection(event: string) {
    console.log("DOB", event);
    const dob = new Date(event);
    console.log(dob, "test");
    console.log("ss", this.vendorEditForm.value.pannodob);
    this.Panvalidate = false;
    this.panHolderDOB = this.datePipe.transform(dob, "yyyy-MM-dd");
    this.adultAgeDate = new Date(
      dob.getFullYear() + 18,
      dob.getMonth(),
      dob.getDate()
    ); // Setting adultAgeDate to 18 years after DOB
    this.minorAgeDate = new Date(
      dob.getFullYear() + 17,
      dob.getMonth(),
      dob.getDate()
    ); // Setting adultAgeDate to 17 years after DOB
  }
  totalFromPermanentEmployee(event) {
    if (this.temporaryEmployee != undefined) {
      this.temporaryEmployee = this.temporaryEmployee;
    } else {
      this.temporaryEmployee = 0;
    }
    this.totalEmployee =
      parseInt(this.permanentEmployee) + parseInt(this.temporaryEmployee);
  }

  totalFromTemporaryEmployee(event) {
    if (this.permanentEmployee != undefined) {
      this.permanentEmployee = this.permanentEmployee;
    } else {
      this.permanentEmployee = 0;
    }
    this.totalEmployee =
      parseInt(this.permanentEmployee) + parseInt(this.temporaryEmployee);
  }

  validationPAN(e) {
    this.Panvalidate = false;
    // let panno=''
    // this.panvalname='';

    // if(e=='pan'){
    //    panno=this.pannumber;
    // }else{
    let panno = e.target.value;
    // }
    if (panno.length == 10) {
      this.showthepandatafield = true;
      if (!panno || this.vendorEditForm.get("panno").invalid) {
        this.notification.showWarning("Please Enter a Valid PAN Number");
        this.SpinnerService.hide();
      }
      if (panno && this.vendorEditForm.get("panno").valid) {
        this.notification.showSuccess("PAN Number Validated!");
      }
    }

    if (
      this.vendorEditForm.value.panno === "" ||
      this.vendorEditForm.value.panno === null ||
      this.vendorEditForm.value.panno === undefined
    ) {
      this.vendorEditForm.patchValue({
        pannoholdername: "",
        pannodob: "",
        pannoholderfathername: "",
      });
      this.Panvalidate = false;
      this.showthepandatafield = false;
    }
    // if(panno && panno.length==10){
    //   this.showthepandatafield = true
    //   this.SpinnerService.show();

    // this.atmaService.getVendorPanNumber(panno).then(res => {
    //     let result = res.validation_status
    //     this.pan_status = result
    //     if (result.pan != panno) {
    //       this.notification.showWarning("Please Enter a Valid PAN Number")
    //       this.panvalname='';
    //       // this.user$=
    //       this.SpinnerService.hide();
    //       return false;

    //     } if (result.pan==panno) {
    //       this.notification.showSuccess("PAN Number validated...")
    //       this.panvalname=res.validation_status.firstName + res.validation_status.lastName
    //       this.SpinnerService.hide();
    //     }else{
    //       this.notification.showWarning("Please Enter a Valid PAN Number")
    //       this.panvalname='';
    //       this.SpinnerService.hide();

    //     }

    //   },
    //   error => {
    //     this.notification.showWarning("PanNo validation failure")
    //     this.SpinnerService.hide();
    //     return false;
    //   }
    //   )}
  }

  validationPANname(e) {
    this.Panvalidate = false;
  }
  validationPANfathername(e) {
    this.Panvalidate = false;
  }

  // validationGstNo(e) {
  //   let gstno = e.target.value;
  //   this.atmaService.getVendorGstNumber(gstno)
  //     .subscribe(res => {
  //       let result = res.validation_status
  //       this.gst_status = resultu7788
  //       if (result === false) {
  //         this.notification.showWarning("Please Enter a Valid GST Number")
  //       } else {
  //         this.notification.showSuccess("GST Number validated...")
  //       }

  //     })
  // }
  // validationGstNo(event) {
  //   let gstno = event
  //   let gst = gstno
  //   gst = gst.slice(2, -3);
  //   this.GstNo = gst;
  //   console.log("gst------",this.GstNo)
  // }

  // validationPAN(event) {
  //   let panno = event;
  //   this.pan = panno
  //   console.log("pan", this.pan)
  // }

  // autocompleteRMScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matAutocomplete &&
  //       this.autocompleteTrigger &&
  //       this.matAutocomplete.panel
  //     ) {
  //       fromEvent(this.matAutocomplete.panel.nativeElement, "scroll")
  //         .pipe(
  //           map((x) => this.matAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe((x) => {
  //           const scrollTop =
  //             this.matAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight =
  //             this.matAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight =
  //             this.matAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.atmaService
  //                 .getEmployeeSearchFilter2(
  //                   this.rmInput.nativeElement.value,
  //                   this.currentpage + 1
  //                 )
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.employeeList = this.employeeList.concat(datas);
  //                   if (this.employeeList.length >= 0) {
  //                     this.has_next = datapagination.has_next;
  //                     this.has_previous = datapagination.has_previous;
  //                     this.currentpage = datapagination.index;
  //                   }
  //                 });
  //             }
  //           }
  //         });
  //     }
  //   });
  // }
  // cityScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matcityAutocomplete &&
  //       this.autocompleteTrigger &&
  //       this.matcityAutocomplete.panel
  //     ) {
  //       fromEvent(this.matcityAutocomplete.panel.nativeElement, "scroll")
  //         .pipe(
  //           map((x) => this.matcityAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe((x) => {
  //           const scrollTop =
  //             this.matcityAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight =
  //             this.matcityAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight =
  //             this.matcityAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.atmaService
  //                 .get_city(
  //                   this.cityInput.nativeElement.value,
  //                   this.currentpage + 1
  //                 )
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.cityList = this.cityList.concat(datas);
  //                   if (this.cityList.length >= 0) {
  //                     this.has_next = datapagination.has_next;
  //                     this.has_previous = datapagination.has_previous;
  //                     this.currentpage = datapagination.index;
  //                   }
  //                 });
  //             }
  //           }
  //         });
  //     }
  //   });
  // }
  // districtScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matdistrictAutocomplete &&
  //       this.autocompleteTrigger &&
  //       this.matdistrictAutocomplete.panel
  //     ) {
  //       fromEvent(this.matdistrictAutocomplete.panel.nativeElement, "scroll")
  //         .pipe(
  //           map(
  //             (x) => this.matdistrictAutocomplete.panel.nativeElement.scrollTop
  //           ),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe((x) => {
  //           const scrollTop =
  //             this.matdistrictAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight =
  //             this.matdistrictAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight =
  //             this.matdistrictAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.atmaService
  //                 .get_districtValue(
  //                   this.stateID,
  //                   this.districtInput.nativeElement.value,
  //                   this.currentpage + 1
  //                 )
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.districtList = this.districtList.concat(datas);
  //                   if (this.districtList.length >= 0) {
  //                     this.has_next = datapagination.has_next;
  //                     this.has_previous = datapagination.has_previous;
  //                     this.currentpage = datapagination.index;
  //                   }
  //                 });
  //             }
  //           }
  //         });
  //     }
  //   });
  // }
  // stateScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matstateAutocomplete &&
  //       this.autocompleteTrigger &&
  //       this.matstateAutocomplete.panel
  //     ) {
  //       fromEvent(this.matstateAutocomplete.panel.nativeElement, "scroll")
  //         .pipe(
  //           map((x) => this.matstateAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe((x) => {
  //           const scrollTop =
  //             this.matstateAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight =
  //             this.matstateAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight =
  //             this.matstateAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.atmaService
  //                 .get_state(
  //                   this.stateInput.nativeElement.value,
  //                   this.currentpage + 1
  //                 )
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.stateList = this.stateList.concat(datas);
  //                   if (this.stateList.length >= 0) {
  //                     this.has_next = datapagination.has_next;
  //                     this.has_previous = datapagination.has_previous;
  //                     this.currentpage = datapagination.index;
  //                   }
  //                 });
  //             }
  //           }
  //         });
  //     }
  //   });
  // }
  // pinCodeScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matpincodeAutocomplete &&
  //       this.autocompleteTrigger &&
  //       this.matpincodeAutocomplete.panel
  //     ) {
  //       fromEvent(this.matpincodeAutocomplete.panel.nativeElement, "scroll")
  //         .pipe(
  //           map(
  //             (x) => this.matpincodeAutocomplete.panel.nativeElement.scrollTop
  //           ),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe((x) => {
  //           const scrollTop =
  //             this.matpincodeAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight =
  //             this.matpincodeAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight =
  //             this.matpincodeAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.atmaService
  //                 .get_pinCode(
  //                   this.pinCodeInput.nativeElement.value,
  //                   this.currentpage + 1
  //                 )
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.pinCodeList = this.pinCodeList.concat(datas);
  //                   if (this.pinCodeList.length >= 0) {
  //                     this.has_next = datapagination.has_next;
  //                     this.has_previous = datapagination.has_previous;
  //                     this.currentpage = datapagination.index;
  //                   }
  //                 });
  //             }
  //           }
  //         });
  //     }
  //   });
  // }
  // designationScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matdesignationAutocomplete &&
  //       this.autocompleteTrigger &&
  //       this.matdesignationAutocomplete.panel
  //     ) {
  //       fromEvent(this.matdesignationAutocomplete.panel.nativeElement, "scroll")
  //         .pipe(
  //           map(
  //             (x) =>
  //               this.matdesignationAutocomplete.panel.nativeElement.scrollTop
  //           ),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe((x) => {
  //           const scrollTop =
  //             this.matdesignationAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight =
  //             this.matdesignationAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight =
  //             this.matdesignationAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.atmaService
  //                 .get_designation(
  //                   this.designationInput.nativeElement.value,
  //                   this.currentpage + 1
  //                 )
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.designationList = this.designationList.concat(datas);
  //                   if (this.designationList.length >= 0) {
  //                     this.has_next = datapagination.has_next;
  //                     this.has_previous = datapagination.has_previous;
  //                     this.currentpage = datapagination.index;
  //                   }
  //                 });
  //             }
  //           }
  //         });
  //     }
  //   });
  // }
  // contactScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matcontactAutocomplete &&
  //       this.autocompleteTrigger &&
  //       this.matcontactAutocomplete.panel
  //     ) {
  //       fromEvent(this.matcontactAutocomplete.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.matcontactAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.matcontactAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matcontactAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matcontactAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.atmaService.get_contact(this.contactInput.nativeElement.value, this.currentpage + 1)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.contactTypeList = this.contactTypeList.concat(datas);
  //                   if (this.contactTypeList.length >= 0) {
  //                     this.has_next = datapagination.has_next;
  //                     this.has_previous = datapagination.has_previous;
  //                     this.currentpage = datapagination.index;
  //                   }
  //                 })
  //             }
  //           }
  //         });
  //     }
  //   });
  // }
  // states(data) {
  //   console.log("state", data);
  //   let id = data.id;
  //   this.stateID = id;
  //   this.districtInput.nativeElement.value = " ";
  //   let districtkey: String = "";
  //   this.getDistrict(districtkey);
  //   // this.atmaService.get_districtValue(this.stateID , districtkey, this.districtcurrentpage)
  //   //   .subscribe((results: any[]) => {
  //   //     console.log("district",results)
  //   //     let datas = results["data"];
  //   //     let datapagination = results["pagination"];
  //   //     this.districtList = datas;
  //   //     if (this.districtList.length >= 0) {
  //   //       this.has_districtnext = datapagination.has_next;
  //   //       this.has_districtprevious = datapagination.has_previous;
  //   //       this.districtcurrentpage = datapagination.index;
  //   //     }
  //   //    })
  // }
  // districts(data) {
  //   this.cityInput.nativeElement.value = " ";
  //   let citykey: String = "";
  //   this.atmaService
  //     .get_cityValue(this.stateID, citykey)
  //     .subscribe((results: any[]) => {
  //       console.log("city", results);
  //       let datas = results["data"];
  //       this.cityList = datas;
  //       // let datapagination = results["pagination"];
  //       // if (this.cityList.length >= 0) {
  //       //   this.has_citynext = datapagination.has_next;
  //       //   this.has_cityprevious = datapagination.has_previous;
  //       //   this.citycurrentpage = datapagination.index;
  //       // }
  //     });
  // }

  createFormate() {
    let data = this.vendorEditForm.controls;
    let datas = this.vendorEditForm.controls.address;
    let datass = this.vendorEditForm.controls.contact;
    let datasss = this.vendorEditForm.controls.profile;
    let datassss = this.vendorEditForm.controls.director;
    let vendorclass = new vendor();
    vendorclass.code = data["code"].value;
    // vendorclass.name = data['name'].value;
    vendorclass.panno = data["panno"].value;
    vendorclass.pannoholdername = data["pannoholdername"].value;
    vendorclass.pannodob = data["pannodob"].value;
    vendorclass.pannoholderfathername = data["pannoholderfathername"].value;
    vendorclass.gstno = data["gstno"].value;
    vendorclass.composite = data["composite"].value.id;
    vendorclass.comregno = data["comregno"].value;
    vendorclass.group = data["group"].value.id;
    vendorclass.custcategory_id = data["custcategory_id"].value.id;
    vendorclass.classification = data["classification"].value.id;
    vendorclass.type = data["type"].value.id;
    // vendorclass.website = data['website'].value;
    vendorclass.activecontract = data["activecontract"].value;
    vendorclass.pannovalidate = data["pannovalidate"].value;
    // vendorclass.nocontract_reason = data['nocontract_reason'].value;
    vendorclass.contractdate_from = data["contractdate_from"].value;
    vendorclass.contractdate_to = data["contractdate_to"].value;
    vendorclass.aproxspend = data["aproxspend"].value;
    vendorclass.actualspend = data["actualspend"].value;
    vendorclass.orgtype = data["orgtype"].value.id;
    vendorclass.renewal_date = data["renewal_date"].value;
    vendorclass.msme_reg_no = data["msme_reg_no"].value;
    vendorclass.msme = data["msme"].value;
    // vendorclass.remarks = data['remarks'].value;
    vendorclass.rm_id = data["rm_id"].value.id;
    // vendorclass.msme_type = data["msme_type"].value.id;

    if(data["msme"].value == false){
      vendorclass.msme_type = 4;
    }
    else{
      vendorclass.msme_type = data["msme_type"].value.id;
    }
    if (
      data["risk_type"].value == undefined ||
      data["risk_type"].value == "" ||
      data["risk_type"].value == null
    ) {
      vendorclass.risk_type = "";
    } else {
      vendorclass.risk_type = data["risk_type"]?.value?.id;
    }
    vendorclass.riskcategory_id = data["riskcategory_id"]?.value;

    if (
      data["risk_remarks"].value == undefined ||
      data["risk_remarks"].value == null ||
      data["risk_remarks"].value == ""
    ) {
      vendorclass.risk_remarks = "";
    } else {
      vendorclass.risk_remarks = data["risk_remarks"]?.value;
    }
    vendorclass.risk_deloption = data["risk_deloption"].value;
    // vendorclass.branch_count = data['branch_count'].value;
    vendorclass.director_count = data["director_count"].value;
    vendorclass.adhaarno = data["adhaarno"].value;
    vendorclass.emaildays = data["emaildays"].value;

    var str = datas.value.line1;
    var cleanStr_l1 = str.trim(); //trim() returns string with outer spaces removed
    // vendorclass.name = cleanStr_l1

    var str = datas.value.line2;
    var cleanStr_l2 = str.trim(); //trim() returns string with outer spaces removed

    var str = datas.value.line3;
    var cleanStr_l3 = str.trim(); //trim() returns string with outer spaces removed

    let address1 = {
      id: datas.value.id,
      line1: cleanStr_l1,
      line2: cleanStr_l2,
      line3: cleanStr_l3,
      city_id: datas.value.pincode_id.city.id,
      district_id: datas.value.pincode_id.district.id,
      state_id: datas.value.pincode_id.state.id,
      pincode_id: datas.value.pincode_id.id,
    };
    vendorclass.address = address1;

    var str = datass.value.email;
    var cleanStr_email = str.trim(); //trim() returns string with outer spaces removed

    var str = datass.value.name;
    var cleanStr_c_name = str.trim(); //trim() returns string with outer spaces removed

    let contact1 = {
      id: datass.value.id,
      designation_id: datass.value.designation_id.id,
      dob: datass.value.dob,
      email: cleanStr_email,
      landline: datass.value.landline,
      landline2: datass.value.landline2,
      mobile: datass.value.mobile,
      mobile2: datass.value.mobile2,
      name: cleanStr_c_name,
      // type_id: datass.value.type_id.id
    };
    vendorclass.contact = contact1;

    if (datasss.value.award_details != null) {
      var str = datasss.value.award_details;
      var cleanStr_av = str.trim(); //trim() returns string with outer spaces removed
    }

    if (datasss.value.remarks != null) {
      var str = datasss.value.remarks;
      var cleanStr_rem = str.trim(); //trim() returns string with outer spaces removed
    }

    let profile1 = {
      id: datasss.value.id,
      year: datasss.value.year,
      associate_year: datasss.value.associate_year,
      award_details: cleanStr_av,
      permanent_employee: datasss.value.permanent_employee,
      temporary_employee: datasss.value.temporary_employee,
      total_employee: datasss.value.total_employee,
      branch: datasss.value.branch,
      factory: datasss.value.factory,
      remarks: cleanStr_rem,
    };
    vendorclass.profile = profile1;
    let datadelete = vendorclass.profile;

    for (let i in datadelete) {
      if (!datadelete[i]) {
        delete datadelete[i];
      }
    }

    let dateValue = this.vendorEditForm.value;
    if (this.vendorEditForm.controls.contact.value.dob != "None") {
      vendorclass.contact.dob = this.datePipe.transform(
        dateValue.contact.dob,
        "yyyy-MM-dd"
      );
    } else {
      this.vendorEditForm.controls.contact.value.dob = null;
    }
    vendorclass.contractdate_from = this.datePipe.transform(
      dateValue.contractdate_from,
      "yyyy-MM-dd"
    );
    vendorclass.contractdate_to = this.datePipe.transform(
      dateValue.contractdate_to,
      "yyyy-MM-dd"
    );
    if (this.vendorEditForm.value.renewal_date != "None") {
      vendorclass.renewal_date = this.datePipe.transform(
        dateValue.renewal_date,
        "yyyy-MM-dd"
      );
    } else {
      this.vendorEditForm.value.renewal_date = null;
    }

    var str = data["name"].value;
    var cleanStr_name = str.trim(); //trim() returns string with outer spaces removed
    vendorclass.name = cleanStr_name;

    var str = data["comregno"].value;
    var cleanStr_spe = str.trim(); //trim() returns string with outer spaces removed
    vendorclass.comregno = cleanStr_spe;

    if (data["website"].value != null) {
      var str = data["website"].value;
      var cleanStr_rk = str.trim(); //trim() returns string with outer spaces removed
      vendorclass.website = cleanStr_rk;
    }

    if (data["remarks"].value != null) {
      var str = data["remarks"].value;
      var cleanStr_cp = str.trim(); //trim() returns string with outer spaces removed
      vendorclass.remarks = cleanStr_cp;
    }

    // var str = data['remarks'].value
    // var cleanStr_cp=str.trim();//trim() returns string with outer spaces removed
    // vendorclass.remarks = cleanStr_cp

    // var str = data['director_count'].value
    // var cleanStr_dc=str.trim();//trim() returns string with outer spaces removed
    // vendorclass.director_count = cleanStr_dc

    var str = data["nocontract_reason"].value;
    var cleanStr_rn = str?.trim(); //trim() returns string with outer spaces removed
    vendorclass.nocontract_reason = cleanStr_rn;

    return vendorclass;
  }

  editVendorForm() {
    this.SpinnerService.show();

    // this.newlyadded =this.selectedriskopt.filter((value) => !this.oldselectedopt.includes(value));
    this.risk_deloption = this.oldselectedopt.filter(
      (value) => !this.selectedriskopt.includes(value)
    );
    console.log();

    if (
      this.risktypedetails != null &&
      this.vendorEditForm.value.risk_type != "" &&
      this.vendorEditForm.value.risk_type != null &&
      this.vendorEditForm.value.risk_type != undefined
    ) {
      if (this.vendorEditForm.value.risk_type.id != 3) {
        this.selectedriskopt = [];
        // this.newlyadded = []
        this.risk_deloption = [];
      }

      if (this.riskcategoryselected != "Others") {
        this.riskform.value.risk_remarks = "";
      }

      this.riskrmarks = this.riskform.value.risk_remarks;
      this.vendorEditForm.patchValue({
        riskcategory_id: this.selectedriskopt,
        risk_remarks: this.riskrmarks,
        risk_deloption: this.risk_deloption,
      });

    
    }

    if (this.vendorEditForm.value.name === "") {
      this.toastr.error("Please Enter Vendor Name");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }

    if (
      this.vendorEditForm.value.group.id === undefined ||
      this.vendorEditForm.value.group === ""
    ) {
      this.toastr.error("Please Select Valid Relationship Category");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }
    if (
      this.vendorEditForm.value.custcategory_id.id === undefined ||
      this.vendorEditForm.value.custcategory_id === ""
    ) {
      this.toastr.error("Please Select Valid Relationship SubCategory");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }

    if (
      this.vendorEditForm.value.orgtype === null ||
      this.vendorEditForm.value.orgtype.id === undefined ||
      this.vendorEditForm.value.orgtype === ""
    ) {
      this.toastr.error("Please Select Valid Organization Type");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }

    if (
      this.vendorEditForm.value.classification.id === undefined ||
      this.vendorEditForm.value.classification === ""
    ) {
      this.toastr.error("Please Select Valid Vendor Type");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }

    if (
      this.vendorEditForm.value.composite.id === undefined ||
      this.vendorEditForm.value.composite === ""
    ) {
      this.toastr.error("Please Select Valid GST Category");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }


    if (
      this.vendorEditForm.value.type.id === undefined ||
      this.vendorEditForm.value.type === ""
    ) {
      this.toastr.error("Please Select Valid Classification");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }


    if (this.risktypedetails != null) {

      if (
        this.vendorEditForm.value.risk_type == "" ||
        this.vendorEditForm.value.risk_type == null ||
        this.vendorEditForm.value.risk_type == undefined
      ) {
        this.notification.showError("Please Select Risk Category");
        this.SpinnerService.hide();
        this.goToStep(0)
        return false;
      }


      if (
        (this.vendorEditForm.value.risk_type.id == 3 &&
          this.vendorEditForm.value.riskcategory_id == "") ||
        this.vendorEditForm.value.riskcategory_id == null ||
        this.vendorEditForm.value.riskcategory_id == undefined
      ) {
        this.notification.showError("Please Select Risk Options");
        this.SpinnerService.hide();
        this.goToStep(0)
        return false;
      }
   

      if (
        this.riskcategoryselected == "Others" &&
        (this.riskrmarks == "" ||
          this.riskrmarks == undefined ||
          this.riskrmarks == null)
      ) {
        this.notification.showError("Please Fill Risk Remarks");
        this.SpinnerService.hide();
        this.goToStep(0)
        return false;
      }
    }
 

    // if (this.vendorEditForm.value.panno === "" && this.vendorEditForm.value.composite.id!=3 ) {
    //BUG ID:7019
    if (
      this.vendorEditForm.value.panno === "" &&
      this.vendorEditForm.value.composite.id != 3 &&
      this.vendorEditForm.value.composite.id != 4
    ) {
      this.toastr.error("Please Enter PAN Number");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }

    if (
      this.vendorEditForm.value.pannoholdername === "" &&
      this.vendorEditForm.value.composite.id != 3 &&
      this.vendorEditForm.value.composite.id != 4
    ) {
      this.toastr.error("Please Enter PAN Holder Name");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }
    if (
      this.vendorEditForm.value.pannodob === "" &&
      this.vendorEditForm.value.composite.id != 3 &&
      this.vendorEditForm.value.composite.id != 4
    ) {
      this.toastr.error("Please Enter DOB");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }

    if (
      this.vendorEditForm.get("panno").invalid &&
      this.vendorEditForm.value.composite.id != 3 &&
      this.vendorEditForm.value.composite.id != 4
    ) {
      this.toastr.error("Please Enter Valid PAN Number");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }

    if (
      this.Panvalidate == false &&
      (this.vendorEditForm.value.composite.id == 1 ||
        this.vendorEditForm.value.composite.id == 2)
    ) {
      this.toastr.error("Select the checkbox to Validate PAN.");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }

    if (
      this.vendorEditForm.value.composite.id != 1 &&
      this.vendorEditForm.value.composite.id != 2
    ) {
      if (
        this.vendorEditForm.value.panno != "" &&
        this.vendorEditForm.value.panno != null &&
        this.vendorEditForm.value.panno != undefined
      ) {
        if (this.Panvalidate == false) {
          this.toastr.error("Select the checkbox to Validate PAN.");
          this.SpinnerService.hide();
          this.goToStep(0)
          return false;
        }
      }
    }

    if (this.vendorEditForm.value.adhaarno != "") {
      if (this.vendorEditForm.value.adhaarno.length != 12) {
        this.notification.showError("Adhaar Number length should be 12...");
        this.SpinnerService.hide();
        this.goToStep(0)
        return false;
      }
    }

    if(this.vendorEditForm.value.activecontract === true){
      if (this.vendorEditForm.value.contractdate_from ==="" || this.vendorEditForm.value.contractdate_from === null  || this.vendorEditForm.value.contractdate_from === undefined || this.vendorEditForm.value.contractdate_from === 'None' ) {
        this.toastr.error('Please Enter Contract Details');
        this.SpinnerService.hide();
        this.goToStep(0)
        return false;
      }
      if ( this.vendorEditForm.value.contractdate_to ==="" || this.vendorEditForm.value.contractdate_to === null  || this.vendorEditForm.value.contractdate_to === 'None' || this.vendorEditForm.value.contractdate_to === undefined) {
        this.toastr.error('Please Enter Contract Date To');
        this.SpinnerService.hide();
        this.goToStep(0)
        return false;
      }
      if ( this.vendorEditForm.value.renewal_date ==="" || this.vendorEditForm.value.renewal_date === null  || this.vendorEditForm.value.renewal_date === undefined || this.vendorEditForm.value.renewal_date === 'None' ) {
        this.toastr.error('Please Enter Renewal Date');
        this.SpinnerService.hide();
        this.goToStep(0)
        return false;
      }
    }
    else{
  
      if ( this.vendorEditForm.value.nocontract_reason === "" || this.vendorEditForm.value.nocontract_reason === null  || this.vendorEditForm.value.nocontract_reason === undefined || this.vendorEditForm.value.nocontract_reason === 'None' ) {
        this.toastr.error('Please Enter No Contract Reason');
        this.SpinnerService.hide();
        this.goToStep(0)
        return false;
      }
      }

    if(this.vendorEditForm.value.msme === true){
      if (this.vendorEditForm.value.msme_type === "") {
        this.toastr.error('Please Enter MSME Type');
        this.SpinnerService.hide();
        this.goToStep(0);
        return false;
      }
    }
    
    if (this.vendorEditForm.value.msme_reg_no === "") {
      this.toastr.error("Please Enter MSME Registration Number");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }
 
    // if(this.vendorEditForm.value.panno){
    //   if(this.panvalname==''){
    //     this.toastr.error('Please Enter Valid PAN  Number');
    //   this.SpinnerService.hide();
    //   return false;
    //   }
    // }

    // if (this.vendorAddForm.value.pannoholderfathername === "" || this.vendorAddForm.value.pannoholderfathername === null || this.vendorAddForm.value.pannoholderfathername === undefined) {
    //   this.toastr.error('Please Enter Father`s Name');
    //   this.SpinnerService.hide();
    //   return false;
    // }

 

    if (
      this.vendorEditForm.value.msme === true &&
      this.vendorEditForm.value.msme_reg_no === "NOTAVBLE"
    ) {
      var reply = window.confirm(
        " MSME Reg No is empty, Do you want to continue"
      );
      this.msme = true;
      if (reply) {
        //
      } else {
        this.SpinnerService.hide();
        return false;
      }
    }

    if (this.vendorEditForm.value.emaildays === "") {
      this.toastr.error("Please Enter Email Days");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }
    if (
      this.vendorEditForm.value.rm_id.id === undefined ||
      this.vendorEditForm.value.rm_id === ""
    ) {
      this.toastr.error("Please Select Valid Header Name");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }

    let count = this.vendorEditForm.value.director_count;
    console.log("count", count);
    let arraySize = this.directorNameList.length;
    console.log("arraysize", arraySize);
    if (count < arraySize || count > arraySize) {
      this.notification.showError("Director Count Not Match...");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }
    //  if(this.vendorEditForm.valid){

    for (let j = 0; j < this.directorNameList.length; j++) {
      var str = this.directorNameList[j].name;
      var cleanStr_name = str.trim(); //trim() returns string with outer spaces removed
      this.directorNameList[j].name = cleanStr_name;
    }
    console.log("arylist", this.directorNameList);


   //address error
   if (this.vendorEditForm.value.address.line1 === "") {
    this.toastr.error("Please Enter Address1");
    this.SpinnerService.hide();
    this.goToStep(1)
    return false;
  }

  if (
    this.vendorEditForm.value.address.pincode_id.id === undefined ||
    this.vendorEditForm.value.address.pincode_id === ""
  ) {
    this.toastr.error("Please Select Valid Pincode");
    this.SpinnerService.hide();
    this.goToStep(1)
    return false;
  }
  if (
    this.vendorEditForm.value.address.pincode_id.city.id === undefined ||
    this.vendorEditForm.value.address.pincode_id.city === ""
  ) {
    this.toastr.error("Please Select Valid City");
    this.SpinnerService.hide();
    this.goToStep(1)
    return false;
  }
  if (
    this.vendorEditForm.value.address.pincode_id.state.id === undefined ||
    this.vendorEditForm.value.address.pincode_id.state === ""
  ) {
    this.toastr.error("Please Select Valid State");
    this.SpinnerService.hide();
    this.goToStep(1)
    return false;
  }
  if (
    this.vendorEditForm.value.address.pincode_id.district.id === undefined ||
    this.vendorEditForm.value.address.pincode_id.district === ""
  ) {
    this.toastr.error("Please Select Valid District");
    this.SpinnerService.hide();
    this.goToStep(1)
    return false;
  }

  //contact error

  if (
    this.vendorEditForm.value.contact.designation_id.id === undefined ||
    this.vendorEditForm.value.contact.designation_id === ""
  ) {
    this.toastr.error("Please Select Valid Designation");
    this.SpinnerService.hide();
    this.goToStep(2)
    return false;
  }

  if (this.vendorEditForm.value.contact.name === "") {
    this.toastr.error("Please Enter Contact Name");
    this.SpinnerService.hide();
    this.goToStep(2)
    return false;
  }
  if (this.vendorEditForm.value.contact.email != "") {
    let a = this.vendorEditForm.value.contact.email;
    let b = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let c = b.test(a);
    console.log(c);
    if (c === false) {
      this.notification.showError("Please Enter Valid Email Id");
      this.SpinnerService.hide();
      this.goToStep(2)
      return false;
    }
  }
  if (this.vendorEditForm.value.contact.mobile != "") {
    if (this.vendorEditForm.value.contact.mobile.length != 10) {
      this.notification.showError("MobileNo length should be 10 chars");
      this.SpinnerService.hide();
      this.goToStep(2)
      return false;
    }
  }
  if (this.vendorEditForm.value.contact.mobile2 != "") {
    if (this.vendorEditForm.value.contact.mobile2.length != 10) {
      this.notification.showError("MobileNo2 length should be 10 chars");
      this.SpinnerService.hide();
      this.goToStep(2)
      return false;
    }
  }

  //profile

  if (this.vendorEditForm.value.profile.branch === "") {
    this.toastr.error("Please Enter Branch Count");
    this.SpinnerService.hide();
    return false;
  }
  let branchcount = this.vendorEditForm.value.profile.branch;
  console.log("branch edit------", Number(branchcount));
  if (Number(branchcount) == 0) {
    this.toastr.error("Please Enter Valid Branch Count");
    this.SpinnerService.hide();
    return false;
  }


    // BUG ID:7269
    if (
      this.vendorEditForm.value.composite.id == 3 ||
      this.vendorEditForm.value.composite.id == 4
    ) {
      if (
        this.vendorEditForm.value.panno === "" &&
        this.vendorEditForm.value.adhaarno === ""
      ) {
        var answer = window.confirm(
          "Do you want to continue without Aadhar number since PAN is not entered"
        );
        if (answer) {
          //some code
        } else {
          this.SpinnerService.hide();
          return false;
        }
      }
    }

    // BUG ID:7269

 
    // if(this.vendorEditForm.value.website != null||this.vendorEditForm.value.website !=""){
    //   let a = this.vendorEditForm.value.website
    //   let b = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/
    //   let c = b.test(a)
    //   console.log(c)
    //   if (c === false){
    //         this.notification.showError('Please Enter Valid Website Name');
    //         this.SpinnerService.hide();
    //         return false;
    //       }
    // }



    this.atmaService
      .editVendorForm(
        this.createFormate(),
        this.vendorId,
        this.directorNameList
      )
      .subscribe(
        (res) => {
          console.log("vendoreditresult", res);
          if (res.id === undefined) {
            this.notification.showError(res.description);
            this.SpinnerService.hide();
            return false;
          } else {
            this.notification.showSuccess("Updated Successfully!...");

            if (res.modify_ref_id < 0) {
              this.sharedService.vendorView.next(res);
              // this.sharedService.vendorEditValue.next(res);
              // this.vendorId = res.id;
            }

            this.router.navigate(["/atma/vendorView"], {
              skipLocationChange: true,
            });
            this.SpinnerService.hide();
            this.onSubmit.emit();
          }
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }
  getriskcat(data) {
    this.riskcatid = data.id;
    // this.vendorEditForm.patchValue({
    //   risk_type: data,
    // });
  }

  Selectedlist(data) {
    this.selectedid = data.id;
    this.selectedtext = data.risk_name;
    this.selectedriskopt.push(this.selectedid);
  }

  handleCheckboxChange(selectedOption: any) {
    if (this.selectedriskopt.includes(selectedOption.id)) {
      // If the option is already selected, remove it from the array
      this.selectedriskopt = this.selectedriskopt.filter(
        (id) => id !== selectedOption.id
      );
    } else {
      // If the option is not selected, add its ID to the array
      this.selectedriskopt.push(selectedOption.id);
    }
    console.log("this.slected checkbox ids==>", this.selectedriskopt);

    if (selectedOption.risk_name === "Others") {
      this.isOthersSelected = !this.isOthersSelected;
      this.isriskremarks = !this.isriskremarks;
      // If "Other" is selected, disable all options
    } else {
      // If any other option is selected, disable "Other" and all other options
      if (
        this.selectedriskopt.length == 0 &&
        selectedOption.risk_name !== "Others"
      ) {
        this.isOtherOptionDisabled = !this.isOtherOptionDisabled;
      } else {
        this.isOtherOptionDisabled = true;
      }
    }
    this.riskcategoryselected = selectedOption.risk_name;
  }

  risktransaction(pageNumber = 1, pageSize = 10) {
    this.popupopen()
    this.atmaService
      .risktransaction(pageNumber, pageSize, this.oldvendorid)
      .subscribe((result) => {
        this.risktransactionList = result["data"];
        let dataPagination = result["pagination"];
        if (this.risktransactionList.length >= 0) {
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
          this.isVendorSummaryPagination = true;
        }
        if (this.risktransactionList <= 0) {
          this.isVendorSummaryPagination = false;
        }

        console.log("VendorSummary", result);
      });
  }

  riskoption(pageNumber = 1, pageSize = 10) {
    this.popupopen2()
    this.atmaService.riskoption().subscribe((result) => {
      this.riskoptionList = result["data"];
      // let dataPagination = result['pagination'];
      // if (this.riskoptionList.length >= 0) {
      //   this.has_next = dataPagination.has_next;
      //   this.has_previous = dataPagination.has_previous;
      //   this.presentpage = dataPagination.index;
      //   this.isVendorSummaryPagination = true;
      // } if (this.riskoptionList <= 0) {
      //   this.isVendorSummaryPagination = false;
      // }

      console.log("VendorSummary", result);
    });
  }
//   relationcateditdata(relate){
// this.vendorEditForm.patchValue({
//   group: relate
// })
//   }
  
  // relationsubcateditdata(subcat){
  //   this.vendorEditForm.patchValue({
  //     custcategory_id: subcat,
  //   });
  // }
  // orgtypeeditdata(org){
  //     this.vendorEditForm.patchValue({
  //       orgtype: org,
  //     });
  // }

  // relatypeeditdata(relate){
  //   this.vendorEditForm.patchValue({
  //     classification: relate,
  //   });
  // }

  // comeditdata(categ){
  //   this.vendorEditForm.patchValue({
  //     composite: categ,
  //   });
  // }

  // classifycrityeditdata(classific) {
  //   this.vendorEditForm.patchValue({
  //     type: classific,
  //   });
  // }

  // getriskeditcat(risk){
  //   this.riskcatid = risk.id;
  //   this.vendorEditForm.patchValue({
  //     risk_type: risk,
  //   });
  // }

  // headereditdata(head){
  //   this.vendorEditForm.patchValue({
  //     rm_id: head,
  //   });
  // }
 

  cityeditdata(datas) {
    console.log("event", datas);
    this.city_name = datas.city;
    this.district_name = datas.district;
    this.state_name = datas.state;
    // this.vendorAddForm.patchValue({
    //   city_id : datas
    // })
  }
  districteditdata(datass) {
    console.log("event", datass);
    this.city_name = datass.city;
    this.district_name = datass.district;
    this.state_name = datass.state;
    // this.vendorAddForm.patchValue({
    //   district_id : datass
    // })
  }
  stateeditdata(datasss) {
    console.log("event", datasss);
    this.city_name = datasss.city;
    this.district_name = datasss.district;
    this.state_name = datasss.state;
  }

  // designationeditdata(e) {
  //   console.log("event", e);
  //   this.vendorEditForm.controls.contact.patchValue({
  //     designation_id: e,
  //   });


  // }

  // -------inputapi------ //
  // relationcatedit:any = {
  //   label: "Relationship Category",
  //   method: "get",
  //   url: this.atmaUrl + "mstserv/group",
  //   params: "",
  //   searchkey: "",
  //   displaykey: "text",
  //   wholedata: true,
  //   required : true,
  // }

  // relationsubcatedit:any = {
  //   label: "Relationship Subcategory",
  //   method: "get",
  //   url: this.atmaUrl + "mstserv/customercategory",
  //   params: "",
  //   searchkey: "",
  //   displaykey: "name",
  //   wholedata: true,
  //   required : true
  // }

  // orgtypefieldedit:any = {
  //   label: "Organization Type",
  //   method: "get",
  //   url: this.atmaUrl + "mstserv/org_type",
  //   params: "",
  //   searchkey: "",
  //   displaykey: "text",
  //   wholedata: true,
  //   required : true
  // }

  // relatypefieldedit:any = {
  //   label: "Relationship Type",
  //   method: "get",
  //   url: this.atmaUrl + "mstserv/classification",
  //   params: "",
  //   searchkey: "",
  //   displaykey: "text",
  //   wholedata: true,
  //   required : true
  // }

  // comfieldedit:any = {
  //   label: "GST Category",
  //   method: "get",
  //   url: this.atmaUrl + "mstserv/composite",
  //   params: "",
  //   searchkey: "",
  //   displaykey: "text",
  //   wholedata: true,
  //   required : true
  // };
  // classifycrityfieldedit:any = {
  //   label: "Criticality Classification",
  //   method: "get",
  //   url: this.atmaUrl + "mstserv/type",
  //   params: "",
  //   searchkey: "",
  //   displaykey: "text",
  //   wholedata: true,
  //   required : true
  // };

  // riskcateditfield:any = {
  //   label: "Risk Category",
  //   method: "get",
  //   url: this.atmaUrl + "mstserv/risktype",
  //   params: "",
  //   searchkey: "",
  //   displaykey: "text",
  //   wholedata: true,
  //   required : true
  // };

  // headereditfield:any= {
  //   label: "Header Name",
  //     method: "get",
  //     url: this.atmaUrl + "usrserv/searchheader",
  //     params: "&query=",
  //     searchkey: "query",
  //     displaykey: "full_name",
  //     wholedata: true,
  //     required : true
  // }

  // pincodeeditfield:any = {
  //   label: "Pin Code",
  //   method: "get",
  //   url: this.atmaUrl + "mstserv/pincodesearch",
  //   params:"&query=",
  //   searchkey: "query",
  //   displaykey: "no",
  //   wholedata: true,
  //   required : true
  // }

  // cityeditfield:any = {
  //   label: "City",
  //   method: "get",
  //   url: this.atmaUrl + "mstserv/new_city_search",
  //   params: "&state_id=" + this.stateID+"&query=",
  //   searchkey: "query",
  //   displaykey: "name",
  //   wholedata: true,
  //   disabled: true,
  // }
  // districteditfield :any = {
  //   label: "District",
  //   method: "get",
  //   url: this.atmaUrl + "mstserv/district_search",
  //   params: "&state_id=" + this.stateID+"&query=",
  //   searchkey: "query",
  //   displaykey: "name",
  //   wholedata: true,
  //   disabled: true,
  // };

  // designationeditfield :any = {
  //   label: "Designation",
  //   method: "get",
  //   url: this.atmaUrl + "mstserv/designation_search",
  //   params: "&query=",
  //   searchkey: "query",
  //   displaykey: "name",
  //   wholedata: true,
  // }
  // stateeditfield:any  = {
  //   label: "State",
  //   method: "get",
  //   url: this.atmaUrl + "mstserv/state_search",
  //   params: "&query=",
  //   searchkey: "query",
  //   displaykey: "name",
  //   wholedata: true,
  // }

  pincodeeditdata(pin){
    console.log("pincodeeditdata ====> ", pin);
    this.city_name = pin.city;
    this.district_name = pin.district;
    this.state_name = pin.state;
    // this.cityeditfield = {
    //   label: "City",
    //   method: "get",
    //   url: this.atmaUrl + "mstserv/new_city_search",
    //   params: "&state_id=" + this.stateID+"&query=",
    //   searchkey: "query",
    //   displaykey: "name",
    //   Outputkey: "id",
    //   defaultvalue: this.city_name,
    //   disabled: true,
    // };
    // this.districteditfield   = {
    //   label: "District",
    //   method: "get",
    //   url: this.atmaUrl + "mstserv/district_search",
    //   params: "&state_id=" + this.stateID+"&query=",
    //   searchkey: "query",
    //   displaykey: "name",
    //   Outputkey: "id",
    //   defaultvalue: this.district_name,
    //   disabled: true,
    // };
    // this.stateeditfield = {
    //   label: "State",
    //   method: "get",
    //   url: this.atmaUrl + "mstserv/state_search",
    //   params: "&query=",
    //   searchkey: "query",
    //   displaykey: "name",
    //   Outputkey: "id",
    //   defaultvalue: this.state_name,
    //   disabled: true,
    // };
    this.vendorEditForm.controls.address.patchValue({
      // pincode_id: pin,
      city_id: pin.city,
      district_id: pin.district,
      state_id: pin.state,
    });
  }

  frtodatevendoredit:any = {"fromobj":{label: "Contract From",disabled: true},toobj:{label: "Contract To", disabled: false},renewobj:{label: "Renewal Date", disabled: true}}

  fromdatevendoreditfun(vendoreditfrom){
this.vendorEditForm.patchValue({
contractdate_from:vendoreditfrom
})
if(vendoreditfrom == "" || vendoreditfrom == undefined || vendoreditfrom == null){
this.frtodatevendoredit = { "fromobj":{label: "Contract From",defaultvalue:''},toobj:{label: "Contract To",defaultvalue:''}}
this.vendorEditForm.get('renewal_date').reset()
}
else{
const date = new Date(vendoreditfrom);
console.log(date, "test");
console.log("ss", this.vendorEditForm.value.contractdate_from);
this.fromdate = this.datePipe.transform(date, "yyyy-MM-dd");
this.todate = new Date(
  date.getFullYear(),
  date.getMonth() + 12,
  date.getDate()
);
this.renewaldate = new Date(
  date.getFullYear(),
  date.getMonth() + 11,
  date.getDate()
);
this.frtodatevendoredit = { "fromobj":{label: "Contract From",defaultvalue:this.fromdate},toobj:{label: "Contract To",defaultvalue:this.todate}}
}
  }

  todatevendoreditfun(vendoreditto){
this.vendorEditForm.patchValue({
contractdate_to:vendoreditto
})
this.frtodatevendoredit.toobj.defaultvalue = '' 
  }

  goToStep(stepIndex: number) {
    this.stepper.selectedIndex = stepIndex;
  }
  popupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("risktransaction"),
      {
        keyboard: false,
      }
    );
    myModal.show();
  }
  openadddirect(){
    this.popupopen1()
  }
  popupopen1() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("exampleModal"),
      {
        keyboard: false,
      }
    );
    myModal.show();
  }
  popupopen2() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("riskList"),
      {
        keyboard: false,
      }
    );
    myModal.show();
  }

  closepopup(){
    this.closespopup.nativeElement.click();
  }
  // closepopup1(){
  //   this.closepartneradd.nativeElement.click();
  // }
  SummaryvendorcreateData:any = [{columnname: "Director Name",
key: "name"},
{  columnname: "Action",
key: "remarks",
button: true,
function: true,
icon: "delete",
clickfunction: this.directorNameDelete.bind(this), }]
SummaryApivendorcreatemodifyObjNew:any = {"method": "get",FeSummary:true, data:this.directorNameList}

msme_type_data(e) {
  this.vendorEditForm.patchValue({
    msme_type : e
  })
}


}

class vendor {
  name: string;
  remarks: string;
  gstno: any;
  panno: any;
  code: string;
  composite: any;
  comregno: string;
  group: any;
  custcategory_id: any;
  classification: any;
  risk_type: any;
  riskcategory_id: any;
  risk_remarks: any;
  risk_deloption: any;
  type: any;
  website: string;
  activecontract: string;
  pannovalidate: string;
  nocontract_reason: string;
  contractdate_from: string;
  contractdate_to: string;
  aproxspend: any;
  actualspend: any;
  orgtype: any;
  renewal_date: string;
  adhaarno: any;
  emaildays: any;
  msme: boolean = false;
  msme_reg_no: any;
  director_count: any;
  rm_id: number;
  msme_type: any;
  
  address: {
    id: number;
    line1: string;
    line2: string;
    line3: string;
    pincode_id: any;
    city_id: any;
    district_id: any;
    state_id: any;
  };
  contact: {
    id: number;
    designation_id: any;
    dob: any;
    email: string;
    landline: any;
    landline2: any;
    mobile: any;
    mobile2: any;
    name: string;
    // type_id: any;
  };
  profile: {
    id: number;
    year: any;
    associate_year: any;
    award_details: string;
    permanent_employee: any;
    temporary_employee: any;
    total_employee: any;
    branch: any;
    factory: any;
    remarks: string;
  };
  director: {
    name: string;
  };

  pannoholdername: any;
  pannodob: any;
  pannoholderfathername: any;
}

