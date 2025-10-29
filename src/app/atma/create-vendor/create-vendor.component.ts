import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  Injectable,
  ElementRef,
} from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { Validators, FormArray } from "@angular/forms";
import { Observable, from, fromEvent } from "rxjs";
import { Router } from "@angular/router";
import { ShareService } from "../share.service";
import { AtmaService } from "../atma.service";
import { NotificationService } from "../notification.service";
import { ToastrService } from "ngx-toastr";
import { MatCheckboxChange } from "@angular/material/checkbox";
import {
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_FORMATS,
} from "@angular/material/core";
import { MatStepper } from '@angular/material/stepper';

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
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from "../error-handling.service";
import { environment } from "src/environments/environment";
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { icon } from "src/app/AppAutoEngine/import-services/CommonimportFiles";
export interface RM {
  id: string;
  full_name: string;
}
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

export interface pincode {
  no: string;
  id: number;
}

// export interface state {
//   name: string;
//   id: number;
// }

// export interface classification {
//   id: string;
//   text: string;
// }

// export interface risk {
//   id: number;
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
  selector: "app-create-vendor",
  templateUrl: "./create-vendor.component.html",
  styleUrls: ["./create-vendor.component.scss"],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,
  ],
})
export class CreateVendorComponent implements OnInit {
  @ViewChild("name") inputName;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild("closeaddpopup") closeaddpopup;
  vendorAddForm: FormGroup;
  // compositeList: Array<composite>;
  // groupList: Array<category>;
  // custcategoryList: Array<subcategory>;
  // classificationList: Array<classification>;
  // riskcatList: Array<risk>;

  // typeList: Array<vendortype>;
  // orgtypeList: Array<orgtype>;
  employeeList: Array<RM>;
  pinCodeList: Array<pincode>;
  // cityList: Array<city>;
  // stateList: Array<state>;
  // districtList: Array<district>;
  // designationList: Array<Designation>;
  contactTypeList: Array<ContactType>;
  Contract = false;
  fromdate: any;
  todate: Date;
  renewaldate: Date;
  totalEmployee: any;
  ismsme: boolean = false;
  permanentEmployee: any;
  temporaryEmployee: any;
  inputGstValue = "";
  inputPanValue = "";
  inputPanNameValue = "";
  inputPanFathersNameValue = "";
  cityId: number;
  districtId: number;
  stateId: number;
  pincodeId: number;
  directorNameList = [];
  vendorButton = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  pan_status: any;
  gst_status: any;
  stateID = 0;
  has_districtnext = false;
  has_districtprevious = true;
  districtcurrentpage: number = 1;
  has_citynext = true;
  has_cityprevious = true;
  citycurrentpage: number = 1;
  GstNo: any;
  pan: any;
  futureDays = new Date();
  addButton = false;
  array: number;
  list: string;

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  isLoading = false;

  @ViewChild("rmemp") matAutocomplete: MatAutocomplete;
  @ViewChild("long") long: ElementRef; // Reference to the input field element

  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild("rmInput") rmInput: any;

  @ViewChild("autocit") matcityAutocomplete: MatAutocomplete;
  @ViewChild("cityInput") cityInput: any;

  @ViewChild("autodis") matdistrictAutocomplete: MatAutocomplete;
  @ViewChild("districtInput") districtInput: any;

  @ViewChild("statetype") matstateAutocomplete: MatAutocomplete;
  @ViewChild("stateInput") stateInput: any;

  @ViewChild("pintype") matpincodeAutocomplete: MatAutocomplete;
  @ViewChild("pinCodeInput") pinCodeInput: any;

  @ViewChild("desg") matdesignationAutocomplete: MatAutocomplete;
  @ViewChild("designationInput") designationInput: any;

  @ViewChild("contactType") matcontactAutocomplete: MatAutocomplete;
  @ViewChild("contactInput") contactInput: any;

  @ViewChild("classify") matclassifyAutocomplete: MatAutocomplete;
  @ViewChild("classifyInput") classifyInput: any;

  @ViewChild("risk") matriskAutocomplete: MatAutocomplete;
  @ViewChild("riskInput") riskInput: any;

  @ViewChild("gstcat") matgstAutocomplete: MatAutocomplete;
  @ViewChild("gstInput") gstInput: any;
  panvalname = "";
  riskcatid: any;
  selectedriskopt: any[] = [];
  risktransactionList: any;
  presentpage: any;
  isVendorSummaryPagination: boolean;
  riskoptionList: any;
  selectedid: any;
  selectedtext: any;
  isOthersSelected = false;
  isOtherOptionDisabled = false;
  isriskremarks = false;
  riskrmarks: any;
  riskform: FormGroup;
  riskcategoryselected: any;
  panHolderDOB: string;
  adultAgeDate: Date;
  minorAgeDate: Date;
  Panvalidate: boolean = false;
  pandata: {};
  isValidationSuccessful: boolean;
  showthepandatafield: boolean = false;
  msme = "False";
  msme_reg_no: string;
  msmetrue: string;
  msmefalse: string;
  relationcat: any;
  relationsubcat: any;
  orgtypefield: any;
  relatypefield: any;
  comfield: any;
  classifycrityfield: any;
  riskcatfield: any;
  headerfield: any;
  designationfield: any;
  pincodefield: any;
  cityfield: any;
  districtfield: any;
  statefield: any;
  vendorURL = environment.apiURL;
  city_name: any;
  district_name: any;
  state_name: any;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  reasonfornocontract: boolean = true;
  msme_type: boolean = false;
  msme_type_field: any;

  constructor(
    private formBuilder: FormBuilder,
    private atmaService: AtmaService,
    private errorHandler: ErrorHandlingService,
    private SpinnerService: NgxSpinnerService,
    private notification: NotificationService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private router: Router,
    private shareService: ShareService
  ) {
    this.futureDays.setDate(this.futureDays.getDate());
    this.relationcat = {
      label: "Relationship Category",
      method: "get",
      url: this.vendorURL + "mstserv/group",
      params: "",
      searchkey: "",
      displaykey: "text",
      wholedata: true,
      required: true,
      formcontrolname: 'group',
    };
    this.relationsubcat = {
      label: "Relationship Subcategory",
      method: "get",
      url: this.vendorURL + "mstserv/customercategory",
      params: "",
      searchkey: "",
      displaykey: "name",
      wholedata: true,
      required: true,
      formcontrolname: 'custcategory_id'
    };
    this.orgtypefield = {
      label: "Organization Type",
      method: "get",
      url: this.vendorURL + "mstserv/org_type",
      params: "",
      searchkey: "",
      displaykey: "text",
      wholedata: true,
      required: true,
      formcontrolname: 'orgtype'
    };
    this.relatypefield = {
      label: "Relationship Type",
      method: "get",
      url: this.vendorURL + "mstserv/classification",
      params: "",
      searchkey: "",
      displaykey: "text",
      wholedata: true,
      required: true,
      formcontrolname: 'classification'
    };
    this.comfield = {
      label: "GST Category",
      method: "get",
      url: this.vendorURL + "mstserv/composite",
      params: "",
      searchkey: "",
      displaykey: "text",
      wholedata: true,
      required: true,
      formcontrolname: 'composite'
    };
    this.classifycrityfield = {
      label: "Criticality Classification",
      method: "get",
      url: this.vendorURL + "mstserv/type",
      params: "",
      searchkey: "",
      displaykey: "text",
      wholedata: true,
      required: true,
      formcontrolname: 'type'
    };
    this.riskcatfield = {
      label: "Risk Category",
      method: "get",
      url: this.vendorURL + "mstserv/risktype",
      params: "",
      searchkey: "",
      displaykey: "text",
      wholedata: true,
      required: true,
      formcontrolname: 'risk_type'
    };
    this.headerfield = {
      label: "Header Name",
      method: "get",
      url: this.vendorURL + "usrserv/searchheader",
      params: "&query=",
      searchkey: "query",
      displaykey: "full_name",
      wholedata: true,
      required: true,
      formcontrolname: 'rm_id'
    };
    this.designationfield = {
      label: "Designation",
      method: "get",
      url: this.vendorURL + "mstserv/designation_search",
      params: "",
      searchkey: "query",
      displaykey: "name",
      wholedata: true,
      required: true,
      formcontrolname: 'designation_id'
    };
    
    this.cityfield = {
      label: "City",
      method: "get",
      url: this.vendorURL + "mstserv/new_city_search",
      params: "&state_id=" + this.stateID+"&query=",
      searchkey: "query",
      displaykey: "name",
      wholedata: true,
      disabled: true,
      required: true,
      formcontrolname: 'city_id'
    };
    this.districtfield = {
      label: "District",
      method: "get",
      url: this.vendorURL + "mstserv/district_search",
      params: "&state_id=" + this.stateID+"&query=",
      searchkey: "query",
      displaykey: "name",
      wholedata: true,
      disabled: true,
      required: true,
      formcontrolname: 'district_id'
    };
    this.statefield = {
      label: "State",
      method: "get",
      url: this.vendorURL + "mstserv/state_search",
      params: "&query=",
      searchkey: "query",
      displaykey: "name",
      wholedata: true,
      disabled: true,
      required: true,
      formcontrolname: 'state_id'
    };

    this.msme_type_field = {
      label:"MSME Type",
      "method": "get",
      "url": this.vendorURL + "mstserv/get_msmetype",
      params: "" ,
      // searchkey: "query",
      displaykey: "text",
      required: true,
      formcontrolname: 'msme_type'
    }
  }

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ["", Validators.required],
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ["", Validators.required],
    });
    this.thirdFormGroup = this.formBuilder.group({
      thirdCtrl: ["", Validators.required],
    });
    this.fourthFormGroup = this.formBuilder.group({
      fourthCtrl: ["", Validators.required],
    });

    this.vendorAddForm = this.formBuilder.group({
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
      // panno: ['', Validators.required],hello
      // gstno: ['', Validators.required],
      composite: ["", Validators.required],
      pannoholdername: ["", Validators.required],
      pannoholderfathername: [""],
      pannodob: ["", Validators.required],
      comregno: [""],
      group: ["", Validators.required],
      custcategory_id: ["", Validators.required],
      classification: ["", Validators.required],
      risk_type: [""],
      riskcategory_id: [""],
      risk_remarks: [""],
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
      nocontract_reason: [{ value: "", disabled: false }],
      contractdate_from: [{ value: "", disabled: isBoolean }],
      contractdate_to: [{ value: "", disabled: isBoolean }],
      aproxspend: ["0.0"],
      actualspend: ["0.0"],
      orgtype: ["", Validators.required],
      renewal_date: [{ value: "", disabled: true }],
      remarks: [""],
      rm_id: ["", Validators.required],
      adhaarno: ["", [Validators.pattern("[0-9]{12}")]],
      director_count: ["0"],
      emaildays: [{value:'0',disabled:true}, Validators.required],
      msme_reg_no: [{ value: "", disabled: true }],
      msme: ["", Validators.required],
      msme_type: ["",Validators.required],
      address: this.formBuilder.group({
        line1: ["", Validators.required],
        line2: [""],
        line3: [""],
        pincode_id: ["", Validators.required],
        city_id: ["", Validators.required],
        district_id: ["", Validators.required],
        state_id: ["", Validators.required],
      }),
      contact: this.formBuilder.group({
        designation_id: ["", Validators.required],
        dob: [""],
        email: [
          "",
          [
            Validators.email,
            Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
          ],
        ],
        // email: ['', [ Validators.required]],
        // landline: ['', Validators.required],
        // landline2: ['', Validators.required],
        // mobile: ['', Validators.required],
        // mobile2: ['', Validators.required],
        landline: [""],
        landline2: [""],
        mobile: [""],
        mobile2: [""],
        name: ["", Validators.required],
        // type_id: ['', Validators.required],
      }),
      profile: this.formBuilder.group({
        year: [""],
        associate_year: [""],
        award_details: [""],
        permanent_employee: [""],
        temporary_employee: [""],
        total_employee: [""],
        branch: ["", Validators.required],
        factory: [""],
        remarks: [""],
      }),
      director: this.formBuilder.group({
        name: [""],
      }),
    });
    // this.getOrgType();
    this.riskform = this.formBuilder.group({
      risk_remarks: [""],
    });

    this.pincodefield = {
      label: "Pin Code",
      method: "get",
      url: this.vendorURL + "mstserv/pincodesearch",
      params: "&query=",
      searchkey: "query",
      displaykey: "no",
      wholedata: true,
      required: true,
      formcontrolname: 'pincode_id'
    };
  }

  // rmname() {
  //   let rmkeyvalue: String = "";
  //   this.getRmEmployee(rmkeyvalue);

  //   this.vendorAddForm
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
  //     });
  // }
  // districtname() {
  //   let districtkeyvalue: String = "";
  //   this.getDistrict(districtkeyvalue);

  //   this.vendorAddForm.controls.address
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
  // cityname() {
  //   let citykeyvalue: String = "";
  //   this.getCity(citykeyvalue);

  //   this.vendorAddForm.controls.address
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
  pincodename() {
    let pincodekeyvalue: String = "";
    this.getPinCode(pincodekeyvalue);

    this.vendorAddForm.controls.address
      .get("pincode_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),

        switchMap((value) =>
          this.atmaService.get_pinCode(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.pinCodeList = datas;
      });
  }
  // statename() {
  //   let statekeyvalue: String = "";
  //   this.getState(statekeyvalue);

  //   this.vendorAddForm.controls.address
  //     .get("state_id")
  //     .valueChanges.pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
  //         console.log("inside tap");
  //       }),

  //       switchMap((value) =>
  //         this.atmaService.get_state(value, 1).pipe(
  //           finalize(() => {
  //             this.isLoading = false;
  //           })
  //         )
  //       )
  //     )
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.stateList = datas;
  //     });
  // }
  // designationname() {
  //   let desgkeyvalue: String = "";
  //   this.getDesignation(desgkeyvalue);
  //   this.vendorAddForm.controls.contact
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

  //   this.vendorAddForm
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

  //   this.vendorAddForm
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

  //   this.vendorAddForm
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
  // typename() {
  //   this.getType();

  //   this.vendorAddForm
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

  //   this.vendorAddForm
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

  //   this.vendorAddForm
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

  //   this.vendorAddForm
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
    let count = this.vendorAddForm.value.director_count;
    this.addButton = false;
    console.log("number", count);
  }

  addDirectorName() {
    let count = this.vendorAddForm.value.director_count;
    let name = this.vendorAddForm.value.director.name;
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
        this.vendorAddForm.value.director.name = [];
      }
    }

  }

  directorNameDelete(index: number) {
    this.directorNameList.splice(index, 1);
    let count = this.vendorAddForm.value.director_count;
    this.array = this.directorNameList.length;
    this.list = this.array.toString();
    if (count === this.list) {
      this.addButton = true;
    } else {
      this.addButton = false;
    }
    this.SummaryApivendorcreatemodifyObjNew = {FeSummary:true, data:this.directorNameList}

  }

  // public displayFnRm(rmemp?: RM): string | undefined {
  //   return rmemp ? rmemp.full_name : undefined;
  // }

  // get rmemp() {
  //   return this.vendorAddForm.value.get("rm_id");
  // }

  // public displayFnDesg(desg?: Designation): string | undefined {
  //   return desg ? desg.name : undefined;
  // }

  // get desg() {
  //   return this.vendorAddForm.value.get("designation_id");
  // }

  // public displayFnContactType(contactType?: ContactType): string | undefined {
  //   return contactType ? contactType.name : undefined;
  // }

  // get contactType() {
  //   return this.vendorAddForm.value.get('type_id');
  // }

  // public displaydis(autodis?: district): string | undefined {
  //   return autodis ? autodis.name : undefined;
  // }

  // get autodis() {
  //   return this.vendorAddForm.controls.address.get("district_id");
  // }

  // public displaycit(autocit?: city): string | undefined {
  //   return autocit ? autocit.name : undefined;
  // }

  // get autocit() {
  //   return this.vendorAddForm.controls.address.get("city_id");
  // }

  public displayFnpin(pintype?: pincode): string | undefined {
    return pintype ? pintype.no : undefined;
  }

  get pintype() {
    return this.vendorAddForm.controls.address.get("pincode_id");
  }

  // public displayFnstate(statetype?: state): string | undefined {
  //   return statetype ? statetype.name : undefined;
  // }

  // get statetype() {
  //   return this.vendorAddForm.controls.address.get("state_id");
  // }
  // public displayFnclassify(classify?: classification): string | undefined {
  //   return classify ? classify.text : undefined;
  // }

  // public displayFnrisk(risk?: classification): string | undefined {
  //   return risk ? risk.text : undefined;
  // }

  get classify() {
    return this.vendorAddForm.get("classification");
  }
  // public displayFngst(gstcat?: composite): string | undefined {
  //   return gstcat ? gstcat.text : undefined;
  // }

  // get gstcat() {
  //   return this.vendorAddForm.get("composite");
  // }
  // public displayFntypes(ventype?: vendortype): string | undefined {
  //   return ventype ? ventype.text : undefined;
  // }

  // get ventype() {
  //   return this.vendorAddForm.get("type");
  // }
  // public displayFnorgtypes(orgtype?: orgtype): string | undefined {
  //   return orgtype ? orgtype.text : undefined;
  // }

  // get orgtype() {
  //   return this.vendorAddForm.get("orgtype");
  // }
  // public displayFncategory(categorytype?: category): string | undefined {
  //   return categorytype ? categorytype.text : undefined;
  // }

  // get categorytype() {
  //   return this.vendorAddForm.get("group");
  // }

  // public displayFnsubcategory(subcategory?: subcategory): string | undefined {
  //   return subcategory ? subcategory.name : undefined;
  // }

  // get subcategory() {
  //   return this.vendorAddForm.get("custcategory_id");
  // }

  private getRmEmployee(rmkeyvalue) {
    this.atmaService
      .getEmployeeSearchFilter2(rmkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;
      });
  }
  // private getComposite() {
  //   this.atmaService.getComposite().subscribe((results: any[]) => {
  //     let datas = results["data"];
  //     this.compositeList = datas;
  //     // console.log("composite", datas)
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

  private getPinCode(pincodekeyvalue) {
    this.atmaService
      .get_pinCode(pincodekeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.pinCodeList = datas;
        // console.log("pincode", datas)
      });
  }

  // private getCity(citykeyvalue) {
  //   this.atmaService.getCitySearch(citykeyvalue).subscribe((results: any[]) => {
  //     let datas = results["data"];
  //     this.cityList = datas;
  //     // console.log("city", datas)
  //   });
  // }

  // private getDistrict(districtkeyvalue) {
  //   this.atmaService
  //     .districtdropdown(this.stateID, districtkeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.districtList = datas;
  //       // console.log("district", datas)
  //     });
  // }

  // private getState(statekeyvalue) {
  //   this.atmaService
  //     .getStateSearch(statekeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.stateList = datas;
  //       // console.log("state", datas)
  //     });
  // }
  // private getDesignation(desgkeyvalue) {
  //   this.atmaService
  //     .getDesignationSearch(desgkeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.designationList = datas;
  //       // console.log("designation", datas)
  //     });
  // }

  // private getContactType(contactkeyvalue) {
  //   this.atmaService.getContactSearch(contactkeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.contactTypeList = datas;
  //     })
  // }
  autocompleteRMScroll() {
    setTimeout(() => {
      if (
        this.matAutocomplete &&
        this.autocompleteTrigger &&
        this.matAutocomplete.panel
      ) {
        fromEvent(this.matAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.matAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaService
                  .getEmployeeSearchFilter2(
                    this.rmInput.nativeElement.value,
                    this.currentpage + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeeList = this.employeeList.concat(datas);
                    if (this.employeeList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }
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
  //   let districtkeyvalue: String = "";
  //   this.getDistrict(districtkeyvalue);
  //   // this.cityInput.nativeElement.value =  ' ';
  //   // let districtkey: String = "";
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
  //     });
  // }

  pinCode(data) {
    this.cityId = data.city;
    this.districtId = data.district;
    this.stateId = data.state;
    this.pincodeId = data;
    this.vendorAddForm.patchValue({
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
    this.vendorAddForm.patchValue({
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

  //   dobnumberOnly(event): boolean {
  //     const charCode = (event.which) ? event.which : event.keyCode;
  //     // Allow numbers (0-9) and slash (/)
  //     if ((charCode >= 48 && charCode <= 57) || charCode === 47) {
  //         return true;
  //     }
  //     return false;
  // }

  // dobnumberOnly(event): boolean {
  //   const inputChar = String.fromCharCode(event.charCode);
  //   const inputValue = event.target.value + inputChar;
  //   const parts = inputValue.split('/');

  //   // Ensure each part of the date is within valid ranges
  //   if (
  //       (parts.length === 1 && parts[0].length <= 2 && parseInt(parts[0]) <= 31) || // Day
  //       (parts.length === 2 && parts[1].length <= 2 && parseInt(parts[1]) <= 12) || // Month
  //       (parts.length === 3 && parts[2].length <= 4) // Year
  //   ) {
  //       // Format day and month as two digits
  //       if (parts.length === 1 && inputValue.length >= 3) {
  //           const day = inputValue.slice(0, 2);
  //           event.target.value = day + '/' + inputValue.slice(2);
  //       } else if (parts.length === 2 && inputValue.length >= 6) {
  //           const month = inputValue.slice(3, 5);
  //           event.target.value = parts[0] + '/' + month + '/' + inputValue.slice(6);
  //       }

  //       return true;
  //   }

  //   return false;
  // }

  // validationPAN(e){
  //   var panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  //   if (e.match(panPattern)) {
  //     this.notification.showSuccess("PAN Number validated...")
  //     this.showthepandatafield = true
  // } else {
  //    this.notification.showWarning("Please Enter a Valid PAN Number")
  //   this.showthepandatafield = false
  // }
  // }
  validationPAN(e) {
    let panno = e.target.value;

    if (panno && panno.length == 10) {
      this.showthepandatafield = true;

      if (this.vendorAddForm.get("panno").invalid) {
        this.notification.showWarning("Please Enter a Valid PAN Number");
        this.SpinnerService.hide();
      }
      if (panno && this.vendorAddForm.get("panno").valid) {
        this.notification.showSuccess("PAN Number Validated!");
      }
    }

    if (
      this.vendorAddForm.value.panno === "" ||
      this.vendorAddForm.value.panno === null ||
      this.vendorAddForm.value.panno === undefined
    ) {
      this.showthepandatafield = false;
    }

    // if(panno.length==10){
    //   this.showthepandatafield = true
    //   this.SpinnerService.show();
    // this.atmaService.getVendorPanNumber(panno)
    //   .then(res => {
    //     let result = res.validation_status
    //     this.pan_status = result
    //     if (result.pan != panno) {
    //       // this.showthepandatafield = false
    //       this.notification.showWarning("Please Enter a Valid PAN Number")
    //       this.panvalname=''
    //       this.SpinnerService.hide();
    //     } if (result.pan == panno) {
    //       // this.showthepandatafield = true
    //       this.notification.showSuccess("PAN Number validated...")
    //       this.panvalname=res.validation_status.firstName + res.validation_status.lastName
    //       this.SpinnerService.hide();
    //     }
    //     else{
    //       this.notification.showWarning("Please Enter a Valid PAN Number")
    //       this.panvalname=''
    //       this.SpinnerService.hide();
    //     }

    //   },
    // error => {
    //   this.notification.showWarning("PanNo validation failure")
    //   this.SpinnerService.hide();
    // }

    // )
  }
  validationPANname(e) {
    this.Panvalidate = false;
  }
  validationPANfathername(e) {
    this.Panvalidate = false;
  }
  // validationGstNo(e) {

  //   let gstno = e.target.value;
  //   if(gstno==""){
  //   this.atmaService.getVendorGstNumber(gstno)
  //     .subscribe(res => {
  //       let result = res.validation_status
  //       this.gst_status = result
  //       if (result === false) {
  //         this.notification.showWarning("Please Enter a Valid GST Number")
  //       } else {
  //         this.notification.showSuccess("GST Number validated...")
  //       }

  //     })}
  // }
  // validationGstNo(event) {
  //   let gstno = event.target.value;
  //   let gst = gstno
  //   gst = gst.slice(2, -3);
  //   this.GstNo = gst;
  //   console.log("gst------",this.GstNo)
  // }

  // validationPAN(event) {
  //   let panno = event.target.value;
  //   this.pan = panno
  //   console.log("pan", this.pan)
  // }

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

    if (/[a-zA-Z0-9-_#@.', &/]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  onClick(e:MatCheckboxChange) {
    this.Contract = !e.checked
    console.log("click", this.Contract)
    if (this.Contract === false) {
      this.frtodatevendor = {"fromobj":{label: "Contract From",disabled: false},toobj:{label: "Contract To", disabled: false},renewobj:{label: "Renewal Date", disabled: false}}
      this.vendorAddForm.get('nocontract_reason').disable();
      this.vendorAddForm.get('contractdate_from').enable();
      this.vendorAddForm.get('contractdate_to').enable();
      this.vendorAddForm.get('renewal_date').enable();
      this.vendorAddForm.get('emaildays').enable();
      this.vendorAddForm.controls.emaildays.patchValue(30)
      this.reasonfornocontract= false
      this.vendorAddForm.get('nocontract_reason').reset();


    } else {
      this.frtodatevendor = {"fromobj":{label: "Contract From",disabled: true},toobj:{label: "Contract To", disabled: true},renewobj:{label: "Renewal Date", disabled: true}}
      this.vendorAddForm.get('contractdate_from').disable();
      this.vendorAddForm.get('contractdate_from').reset();
      this.vendorAddForm.get('contractdate_to').disable();
      this.vendorAddForm.get('contractdate_to').reset();
      this.vendorAddForm.get('nocontract_reason').enable();
      this.vendorAddForm.get('renewal_date').disable();
      this.vendorAddForm.get('renewal_date').reset();
      this.vendorAddForm.controls.emaildays.reset();
      this.vendorAddForm.get('nocontract_reason').reset();

      this.vendorAddForm.get('emaildays').disable();
      this.vendorAddForm.controls.emaildays.patchValue(0);
      this.reasonfornocontract= true

    }
  }
  // msClick(){
  //   console.log("click",this.ismsme)
  //   this.ismsme=!this.ismsme;
  //   }

  cursor() {
    if (this.long && this.long.nativeElement) {
      this.long.nativeElement.focus();
    }
  }

  Msmecheck(e) {
    if (e.checked) {
      this.msme = "True";
      // this.ismsme= true;
      this.msmetrue = this.msme;
      this.vendorAddForm.get("msme_reg_no").enable();
      this.msme_type = true
      this.cursor();
    } else {
      this.msme = "False";
      // this.ismsme = false
      this.msmefalse = this.msme;
      this.vendorAddForm.get("msme_reg_no").disable();
      this.msme_type = false
    }
  }

  onTabKey(event: KeyboardEvent) {
    const msmeRegNoValue = this.vendorAddForm.get("msme_reg_no").value;

    if (event.key === "Tab") {
      if (msmeRegNoValue.trim() !== "") {
        //
      } else {
        event.preventDefault();
        this.toastr.error("Please Enter MSME Registration Number.");
      }
    }
  }

  showErrorPopup(errorMessage: string) {
    // Here you can implement the logic to display an error popup
    // For example, you can use Angular Material dialog to display the error message
    // You can create a dialog component and open it to show the error message
  }

  // panvalidateclick() {
  //   this.SpinnerService.show();
  //   console.log("click", this.Panvalidate)
  //   const panno = this.vendorAddForm.get('panno').value;
  //   const pannoholdername = this.vendorAddForm.get('pannoholdername').value;
  //   const pannoholderfathername = this.vendorAddForm.get('pannoholderfathername').value;
  //   const pannodob = this.vendorAddForm.get('pannodob').value;
  //   this.pandata = {
  //     "inputData": [{
  //         "pan": panno,
  //         "name": pannoholdername,
  //         "fathername": pannoholderfathername,
  //         "dob": pannodob
  //     }]
  // };

  //   this.atmaService.panvalidation(this.pandata)
  //   .subscribe(res => {
  //     console.log("vendor", res)
  //     if(res.id === undefined){
  //       this.notification.showError(res.description)
  //       this.SpinnerService.hide();
  //       return false;
  //     }
  //     else {
  //       this.notification.showSuccess("saved Successfully!...")
  //       this.SpinnerService.hide();
  //       this.shareService.vendorView.next(res);
  //       this.router.navigate(['/atma/vendorView'], { skipLocationChange: true })
  //     }
  //   },
  //   error => {
  //     this.errorHandler.handleError(error);
  //     this.SpinnerService.hide();
  //   }
  //   )
  // }

  panvalidateclick() {
    this.SpinnerService.show();

    if (
      this.vendorAddForm.value.pannoholdername === "" ||
      this.vendorAddForm.value.pannoholdername === null ||
      this.vendorAddForm.value.pannoholdername === undefined
    ) {
      this.toastr.error("Please Enter PAN Holder Name");
      this.SpinnerService.hide();
      return false;
    }
    if (
      this.vendorAddForm.value.pannodob === "" ||
      this.vendorAddForm.value.pannodob === null ||
      this.vendorAddForm.value.pannodob === undefined
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
    const panno = this.vendorAddForm.get("panno").value;
    const pannoholdername = this.vendorAddForm.get("pannoholdername").value;
    const pannoholderfathername = this.vendorAddForm.get(
      "pannoholderfathername"
    ).value;
    let pannodob = this.vendorAddForm.get("pannodob").value;

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
        // if(res.status === "E"){
        //   this.notification.showSuccess(res.Message)
        //   this.isValidationSuccessful = true;
        //   this.SpinnerService.hide();
        // }
        // if(res.status !== "E"){
        //   this.notification.showError(res.Message)
        //   this.isValidationSuccessful = false;
        //   this.SpinnerService.hide();
        // }
        // else {
        //   this.notification.showError(res.ErrorMessage)
        //   this.isValidationSuccessful = false;
        //   this.SpinnerService.hide();
        //   return false;
        // }
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
    console.log("ss", this.vendorAddForm.value.contractdate_from);
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
  }

  toDateSelection(event: string) {
    console.log("todate", event);
    const date = new Date(event);
    console.log(date, 'test');
  
    // Calculate the renewaldate by subtracting 30 days from the contract to date
    const renewalDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 30);
    this.renewaldate = renewalDate;
  
    // Update the form field
    this.vendorAddForm.controls['renewal_date'].setValue(this.renewaldate);
    // this.checkRenewalDate(renewalDate)
  }
  fromDOBSelection(event: string) {
    console.log("DOB", event);
    const dob = new Date(event);
    console.log(dob, "test");
    console.log("ss", this.vendorAddForm.value.pannodob);
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
  createFormate() {
    let data = this.vendorAddForm.controls;
    let datas = this.vendorAddForm.controls.address;
    let datass = this.vendorAddForm.controls.contact;
    let datasss = this.vendorAddForm.controls.profile;
    let datassss = this.vendorAddForm.controls.director;
    let vendorclass = new vendor();
    // vendorclass.code = data['code'].value;
    // vendorclass.name = data['name'].value;
    vendorclass.panno = data["panno"].value;
    vendorclass.pannoholdername = data["pannoholdername"].value;
    vendorclass.pannodob = data["pannodob"].value;
    vendorclass.pannoholderfathername = data["pannoholderfathername"].value;
    vendorclass.gstno = data["gstno"].value;
    vendorclass.composite = data["composite"].value.id;
    // vendorclass.comregno = data['comregno'].value;
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
    // vendorclass.remarks = data['remarks'].value;
    vendorclass.rm_id = data["rm_id"].value.id;
    vendorclass.adhaarno = data["adhaarno"].value;
    // vendorclass.director_count = data['director_count'].value;
    vendorclass.emaildays = data["emaildays"].value;
    vendorclass.msme_reg_no = data["msme_reg_no"].value;
    // vendorclass.msme_type = data["msme_type"].value.id;
    // if(this.ismsme == true){
    //   vendorclass.msme=this.msmetrue

    // }
    // if(this.ismsme == false){
    //   vendorclass.msme=this.msmefalse

    // }
    // vendorclass.msme=data['msme'].value;
    vendorclass.msme = this.msme;

    if(this.msme == "False"){
      vendorclass.msme_type = 4
    }
    else{
      vendorclass.msme_type = data["msme_type"].value.id;
    }
    vendorclass.risk_type = data["risk_type"].value.id;
    vendorclass.riskcategory_id = data["riskcategory_id"].value;
    vendorclass.risk_remarks = data["risk_remarks"].value;

    var str = datas.value.line1;
    var cleanStr_l1 = str.trim(); //trim() returns string with outer spaces removed
    // vendorclass.name = cleanStr_l1

    var str = datas.value.line2;
    var cleanStr_l2 = str.trim(); //trim() returns string with outer spaces removed

    var str = datas.value.line3;
    var cleanStr_l3 = str.trim(); //trim() returns string with outer spaces removed

    let address1 = {
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

    var str = datasss.value.award_details;
    var cleanStr_av = str.trim(); //trim() returns string with outer spaces removed

    var str = datasss.value.remarks;
    var cleanStr_rem = str.trim(); //trim() returns string with outer spaces removed

    let profile1 = {
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
    console.log("delete", datadelete);

    let dateValue = this.vendorAddForm.value;
    vendorclass.contractdate_from = this.datePipe.transform(
      dateValue.contractdate_from,
      "yyyy-MM-dd"
    );
    vendorclass.contractdate_to = this.datePipe.transform(
      dateValue.contractdate_to,
      "yyyy-MM-dd"
    );
    vendorclass.renewal_date = this.datePipe.transform(
      dateValue.renewal_date,
      "yyyy-MM-dd"
    );
    vendorclass.contact.dob = this.datePipe.transform(
      dateValue.contact.dob,
      "yyyy-MM-dd"
    );

    var str = data["name"].value;
    var cleanStr_name = str.trim(); //trim() returns string with outer spaces removed
    vendorclass.name = cleanStr_name;

    var str = data["comregno"].value;
    var cleanStr_spe = str.trim(); //trim() returns string with outer spaces removed
    vendorclass.comregno = cleanStr_spe;

    var str = data["website"].value;
    var cleanStr_rk = str.trim(); //trim() returns string with outer spaces removed
    vendorclass.website = cleanStr_rk;

    var str = data["remarks"].value;
    var cleanStr_cp = str.trim(); //trim() returns string with outer spaces removed
    vendorclass.remarks = cleanStr_cp;

    var str = data["director_count"].value;
    var cleanStr_dc = str.trim(); //trim() returns string with outer spaces removed
    vendorclass.director_count = cleanStr_dc;

    var str = data["nocontract_reason"].value;
    var cleanStr_rn = str?.trim(); //trim() returns string with outer spaces removed
    vendorclass.nocontract_reason = cleanStr_rn;

    console.log("vendorclass", vendorclass);
    return vendorclass;
  }

  submitForm() {
    this.SpinnerService.show();

    if (this.vendorAddForm.value.risk_type.id != 3) {
      this.selectedriskopt = [];
      // this.riskform.value.risk_remarks = ''
    }

    if (this.riskcategoryselected != "Others") {
      this.riskform.value.risk_remarks = "";
    }
    this.riskrmarks = this.riskform.value.risk_remarks;
    this.vendorAddForm.patchValue({
      riskcategory_id: this.selectedriskopt,
      risk_remarks: this.riskrmarks,
    });

    if (this.vendorAddForm.value.name === "") {
      this.toastr.error("Please Enter Vendor Name");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }
    if (
      this.vendorAddForm.value.group.id === undefined ||
      this.vendorAddForm.value.group === ""
    ) {
      this.toastr.error("Please Select Valid Relationship Category");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }
    if (
      this.vendorAddForm.value.custcategory_id.id === undefined ||
      this.vendorAddForm.value.custcategory_id === ""
    ) {
      this.toastr.error("Please Select Valid Relationship SubCategory");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }
    if (
      this.vendorAddForm.value.orgtype.id === undefined ||
      this.vendorAddForm.value.orgtype === ""
    ) {
      this.toastr.error("Please Select Valid Organization Type");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }
    if (
      this.vendorAddForm.value.classification.id === undefined ||
      this.vendorAddForm.value.classification === ""
    ) {
      this.toastr.error("Please Select Valid Vendor Type");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }
   
    if (
      this.vendorAddForm.value.composite.id === undefined ||
      this.vendorAddForm.value.composite === ""
    ) {
      this.toastr.error("Please Select Valid GST Category");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }
   
    if (
      this.vendorAddForm.value.type.id === undefined ||
      this.vendorAddForm.value.type === ""
    ) {
      this.toastr.error("Please Select Valid Classification");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }

      if (
      this.vendorAddForm.value.risk_type == "" ||
      this.vendorAddForm.value.risk_type == null ||
      this.vendorAddForm.value.risk_type == undefined
    ) {
      this.notification.showError("Please Select Risk Category");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }

    if (
      (this.vendorAddForm.value.risk_type.id == 3 &&
        this.vendorAddForm.value.riskcategory_id == "") ||
      this.vendorAddForm.value.riskcategory_id == null ||
      this.vendorAddForm.value.riskcategory_id == undefined
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

    if (
      this.vendorAddForm.value.panno === "" &&
      this.vendorAddForm.value.composite.id != 3 &&
      this.vendorAddForm.value.composite.id != 4
    ) {
      this.toastr.error("Please Enter PAN Number");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }

    if (
      this.vendorAddForm.value.pannoholdername === "" &&
      this.vendorAddForm.value.composite.id != 3 &&
      this.vendorAddForm.value.composite.id != 4
    ) {
      this.toastr.error("Please Enter PAN Holder Name");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }
    if (
      this.vendorAddForm.value.pannodob === "" &&
      this.vendorAddForm.value.composite.id != 3 &&
      this.vendorAddForm.value.composite.id != 4
    ) {
      this.toastr.error("Please Enter DOB");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }


    if (
      this.Panvalidate == false &&
      (this.vendorAddForm.value.composite.id == 1 ||
        this.vendorAddForm.value.composite.id == 2)
    ) {
      this.toastr.error("Select the checkbox to Validate PAN.");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }

    if (
      this.vendorAddForm.value.composite.id != 1 &&
      this.vendorAddForm.value.composite.id != 2
    ) {
      if (
        this.vendorAddForm.value.panno != "" &&
        this.vendorAddForm.value.panno != null &&
        this.vendorAddForm.value.panno != undefined
      ) {
        if (this.Panvalidate == false) {
          this.toastr.error("Select the checkbox to Validate PAN.");
          this.SpinnerService.hide();
          this.goToStep(0)
          return false;
        }
      }
    }

  
    if (this.vendorAddForm.value.adhaarno != "") {
      if (this.vendorAddForm.value.adhaarno.length != 12) {
        this.notification.showError("Adhaar Number length should be 12");
        this.SpinnerService.hide();
        this.goToStep(0)
        return false;
      }
    }
    if (this.vendorAddForm.value.website != "") {
      let a = this.vendorAddForm.value.website;
      let b =
        /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
      let c = b.test(a);
      console.log(c);
      if (c === false) {
        this.notification.showError("Please Enter Valid Website Name");
        this.SpinnerService.hide();
        this.goToStep(0)
        return false;
      }
    }

    if(this.vendorAddForm.value.activecontract === true){
      if (this.vendorAddForm.value.contractdate_from ==="" || this.vendorAddForm.value.contractdate_from === null  || this.vendorAddForm.value.contractdate_from === undefined || this.vendorAddForm.value.contractdate_from === 'None' ) {
        this.toastr.error('Please Enter Contract Details');
        this.SpinnerService.hide();
        this.goToStep(0)
        return false;
      }
      if ( this.vendorAddForm.value.contractdate_to ==="" || this.vendorAddForm.value.contractdate_to === null  || this.vendorAddForm.value.contractdate_to === 'None' || this.vendorAddForm.value.contractdate_to === undefined) {
        this.toastr.error('Please Enter Contract Date To');
        this.SpinnerService.hide();
        this.goToStep(0)
        return false;
      }
      if ( this.vendorAddForm.value.renewal_date ==="" || this.vendorAddForm.value.renewal_date === null  || this.vendorAddForm.value.renewal_date === undefined || this.vendorAddForm.value.renewal_date === 'None' ) {
        this.toastr.error('Please Enter Renewal Date');
        this.SpinnerService.hide();
        this.goToStep(0)
        return false;
      }
    }
    else{

      if ( this.vendorAddForm.value.nocontract_reason === "" || this.vendorAddForm.value.nocontract_reason === null  || this.vendorAddForm.value.nocontract_reason === undefined || this.vendorAddForm.value.nocontract_reason === 'None' ) {
        this.toastr.error('Please Enter No Contract Reason');
        this.SpinnerService.hide();
        this.goToStep(0)
        return false;
      }
    }


    if (this.vendorAddForm.value.msme_reg_no === "") {
      this.toastr.error('Please Enter MSME Registration Number');
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }
    
    if(this.vendorAddForm.value.msme === true){
      if (this.vendorAddForm.value.msme_type === "") {
        this.toastr.error('Please Enter MSME Type');
        this.SpinnerService.hide();
        this.goToStep(0);
        return false;
      }
    }

    if (this.vendorAddForm.value.emaildays === "") {
      this.toastr.error("Please Enter Email Days");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }

    if (
      this.vendorAddForm.value.rm_id.id === undefined ||
      this.vendorAddForm.value.rm_id === ""
    ) {
      this.toastr.error("Please Select Valid Header Name");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }


    let count = this.vendorAddForm.value.director_count;
    console.log("count", count);
    let arraySize = this.directorNameList.length;
    console.log("arraysize", arraySize);
    if (count < arraySize || count > arraySize) {
      this.notification.showError("Director Count Not Match...");
      this.SpinnerService.hide();
      this.goToStep(0)
      return false;
    }

    for (let j = 0; j < this.directorNameList.length; j++) {
      var str = this.directorNameList[j].name;
      var cleanStr_name = str.trim(); //trim() returns string with outer spaces removed
      this.directorNameList[j].name = cleanStr_name;
    }
    console.log("arylist", this.directorNameList);

    
    // if (this.vendorAddForm.value.panno === "" && this.vendorAddForm.value.composite.id!=3) {
    // BUG ID:7019
   
    // if(this.vendorAddForm.value.panno){
    //   if(this.panvalname==''){
    //     this.toastr.error('Please Enter Valid PAN Number');
    //   this.SpinnerService.hide();
    //   return false;
    //   }
    // }

   
    // if (this.vendorAddForm.value.pannoholderfathername === "" || this.vendorAddForm.value.pannoholderfathername === null || this.vendorAddForm.value.pannoholderfathername === undefined) {
    //   this.toastr.error('Please Enter Father`s Name');
    //   this.SpinnerService.hide();
    //   return false;
    // }


    //address error
    if (this.vendorAddForm.value.address.line1 === "") {
      this.toastr.error("Please Enter Address1");
      this.SpinnerService.hide();
      this.goToStep(1)
      return false;
    }
    if (
      this.vendorAddForm.value.address.pincode_id.id === undefined ||
      this.vendorAddForm.value.address.pincode_id === ""
    ) {
      this.toastr.error("Please Select Valid Pincode");
      this.SpinnerService.hide();
      this.goToStep(1)
      return false;
    }
    if (
      this.vendorAddForm.value.address.pincode_id.city.id === undefined ||
      this.vendorAddForm.value.address.pincode_id.city === ""
    ) {
      this.toastr.error("Please Select Valid City");
      this.SpinnerService.hide();
      this.goToStep(1)
      return false;
    }
    if (
      this.vendorAddForm.value.address.pincode_id.state.id === undefined ||
      this.vendorAddForm.value.address.pincode_id.state === ""
    ) {
      this.toastr.error("Please Select Valid State");
      this.SpinnerService.hide();
      this.goToStep(1)
      return false;
    }
    if (
      this.vendorAddForm.value.address.pincode_id.district.id === undefined ||
      this.vendorAddForm.value.address.pincode_id.district === ""
    ) {
      this.toastr.error("Please Select Valid District");
      this.SpinnerService.hide();
      this.goToStep(1)
      return false;
    }

    //contact error
    if (
      this.vendorAddForm.value.contact.designation_id.id === undefined ||
      this.vendorAddForm.value.contact.designation_id === ""
    ) {
      this.toastr.error("Please Select Valid Designation");
      this.SpinnerService.hide();
      this.goToStep(2)
      return false;
    }
    if (this.vendorAddForm.value.contact.name === "") {
      this.toastr.error("Please Enter Contact Name");
      this.SpinnerService.hide();
      this.goToStep(2)
      return false;
    }
    if (this.vendorAddForm.value.contact.email != "") {
      let a = this.vendorAddForm.value.contact.email;
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
    if (this.vendorAddForm.value.contact.mobile != "") {
      if (this.vendorAddForm.value.contact.mobile.length != 10) {
        this.notification.showError("MobileNo length should be 10 chars");
        this.SpinnerService.hide();
        this.goToStep(2)
        return false;
      }
    }
    if (this.vendorAddForm.value.contact.mobile2 != "") {
      if (this.vendorAddForm.value.contact.mobile2.length != 10) {
        this.notification.showError("MobileNo2 length should be 10 chars");
        this.SpinnerService.hide();
        this.goToStep(2)
        return false;
      }
    }


    //profile
    if (this.vendorAddForm.value.profile.branch === "") {
      this.toastr.error("Please Enter Branch Count");
      this.SpinnerService.hide();
      return false;
    }
    let branchcount = this.vendorAddForm.value.profile.branch;
    console.log("branch------", Number(branchcount));
    if (Number(branchcount) == 0) {
      this.toastr.error("Please Enter Valid Branch Count");
      this.SpinnerService.hide();
      return false;
    }

    
    // BUG ID:7269
    if (
      this.vendorAddForm.value.composite.id == 3 ||
      this.vendorAddForm.value.composite.id == 4
    ) {
      if (
        this.vendorAddForm.value.panno === "" &&
        this.vendorAddForm.value.adhaarno === ""
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

  
  


    // if (this.vendorAddForm.value.gstno === "") {
    //   this.toastr.error('Please Enter GST Name');
    //   this.vendorButton = false;
    //   return false;
    // }
    // if (this.vendorAddForm.value.composite === "" ) {
    //   this.toastr.error('Please Select Any One GST Category');
    //   this.vendorButton = false;
    //   return false;
    // }

  

    // if (this.vendorAddForm.value.group === "") {
    //   this.toastr.error('Please Select Any One Relationship Category');
    //   this.vendorButton = false;
    //   return false;
    // }
    // if (this.vendorAddForm.value.custcategory_id === "") {
    //   this.toastr.error('Please Select Any One Relationship SubCategory');
    //   this.vendorButton = false;
    //   return false;
    // }
    // if (this.vendorAddForm.value.classification === "") {
    //   this.toastr.error('Please Select Any One Vendor Type');
    //   this.vendorButton = false;
    //   return false;
    // }
    // if (this.vendorAddForm.value.type === "") {
    //   this.toastr.error('Please Select Any One Classification');
    //   this.vendorButton = false;
    //   return false;
    // }

    // if (this.vendorAddForm.value.orgtype === "") {
    //   this.toastr.error('Please Select Any One Organization Type');
    //   this.vendorButton = false;
    //   return false;
    // }
    // if (this.vendorAddForm.value.remarks === "") {
    //   this.toastr.error('Please Enter Remarks');
    //   this.vendorButton = false;
    //   return false;
    // }
    // if (this.vendorAddForm.value.rm_id === "") {
    //   this.toastr.error('Please Select Any One RM Name');
    //   this.vendorButton = false;
    //   return false;
    // }
    // if (this.vendorAddForm.value.director_count === "") {
    //   this.toastr.error('Please Enter Director Count');
    //   this.vendorButton = false;
    //   return false;
    // }

   

    // if (this.vendorAddForm.value.address.pincode_id === "" ) {
    //   this.toastr.error('Please Select Any One Pincode');
    //   this.vendorButton = false;
    //   return false;
    // }
    // if (this.vendorAddForm.value.address.city_id === "") {
    //   this.toastr.error('Please Select Any One city');
    //   this.vendorButton = false;
    //   return false;
    // }
    // if (this.vendorAddForm.value.address.district_id === "") {
    //   this.toastr.error('Please Select Any One district');
    //   this.vendorButton = false;
    //   return false;
    // }
    // if (this.vendorAddForm.value.address.state_id === "") {
    //   this.toastr.error('Please Select Any One state');
    //   this.vendorButton = false;
    //   return false;
    // }
    // if (this.vendorAddForm.value.contact.designation_id === "" ) {
    //   this.toastr.error('Please Select Any One Designation');
    //   this.vendorButton = false;
    //   return false;
    // }



 

  

  

  



    this.atmaService
      .vendorCreateForm(this.createFormate(), this.directorNameList)
      .subscribe(
        (res) => {
          console.log("vendor", res);
          if (res.id === undefined) {
            this.notification.showError(res.description);
            this.SpinnerService.hide();
            return false;
          } else {
            this.notification.showSuccess("Saved Successfully!...");
            this.SpinnerService.hide();
            this.shareService.vendorView.next(res);
            this.router.navigate(["/atma/vendorView"], {
              skipLocationChange: true,
            });
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
    // this.vendorAddForm.patchValue({
    //   risk_type: data,
    // });
  }
  // Selectedlist(data){

  //   this.selectedid = data.id
  //   this.selectedtext = data.risk_name
  //   this.selectedriskopt.push(this.selectedid)
  // }
  goToStep(stepIndex: number) {
    this.stepper.selectedIndex = stepIndex;
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
    this.atmaService
      .risktransaction(pageNumber, pageSize, vendor)
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
      this.popupriskopen()
    });
  }
  // relationcatdata(e) {
  //   console.log("event", e);
  //   this.vendorAddForm.patchValue({
  //     group: e,
  //   });
  // }
  // relationsubcatdata(e) {
  //   console.log("event", e);
  //   this.vendorAddForm.patchValue({
  //     custcategory_id: e,
  //   });
  // }
  // orgtypedata(e) {
  //   console.log("event", e);
  //   this.vendorAddForm.patchValue({
  //     orgtype: e,
  //   });
  // }
  // relatypedata(e) {
  //   console.log("event", e);
  //   this.vendorAddForm.patchValue({
  //     classification: e,
  //   });
  // }
  // comdata(e) {
  //   console.log("event", e);
  //   this.vendorAddForm.patchValue({
  //     composite: e,
  //   });
  // }
  // classifycritydata(e) {
  //   console.log("event", e);
  //   this.vendorAddForm.patchValue({
  //     type: e,
  //   });
  // }
  // riskcatdata(e) {
  //   console.log("event", e);
  //   this.vendorAddForm.patchValue({
  //     risk_type: e,
  //   });
  // }
  headerdata(e) {
    console.log("header=======>", e);
    console.log("header value---------->", this.vendorAddForm.value.rm_id);
    // this.vendorAddForm.patchValue({
    //   rm_id: e,
    // });
  }
  pincodedata(data) {
    console.log("pincodedata ====> ", data);
    this.city_name = data.city;
    this.district_name = data.district;
    this.state_name = data.state;
    // this.cityfield = {
    //   label: "City",
    //   method: "get",
    //   url: this.vendorURL + "mstserv/new_city_search",
    //   params: "&state_id=" + this.stateID+"&query=",
    //   searchkey: "query",
    //   displaykey: "name",
    //   Outputkey: "id",
    //   defaultvalue: this.city_name,
    //   // formcontrolname: 'city_id',
    //   disabled: true,
    // };
    // this.districtfield = {
    //   label: "District",
    //   method: "get",
    //   url: this.vendorURL + "mstserv/district_search",
    //   params: "&state_id=" + this.stateID+"&query=",
    //   searchkey: "query",
    //   displaykey: "name",
    //   Outputkey: "id",
    //   defaultvalue: this.district_name,
    //   // formcontrolname: 'district_id',
    //   disabled: true,
    // };
    // this.statefield = {
    //   label: "State",
    //   method: "get",
    //   url: this.vendorURL + "mstserv/state_search",
    //   params: "&query=",
    //   searchkey: "query",
    //   displaykey: "name",
    //   Outputkey: "id",
    //   defaultvalue: this.state_name,
    //   formcontrolname: 'state_id',
    //   disabled: true,
    // };
    this.vendorAddForm.controls.address.patchValue({
      // pincode_id: data,
      city_id: data.city,
      district_id: data.district,
      state_id: data.state,
    });
  }
  citydata(datas) {
    console.log("event", datas);
    this.city_name = datas.city;
    this.district_name = datas.district;
    this.state_name = datas.state;
    // this.vendorAddForm.patchValue({
    //   city_id : datas
    // })
  }
  districtdata(datass) {
    console.log("event", datass);
    this.city_name = datass.city;
    this.district_name = datass.district;
    this.state_name = datass.state;
    // this.vendorAddForm.patchValue({
    //   district_id : datass
    // })
  }
  statedata(datasss) {
    console.log("event", datasss);
    this.city_name = datasss.city;
    this.district_name = datasss.district;
    this.state_name = datasss.state;
  }

  designationdata(e) {
    console.log("event", e);
    this.vendorAddForm.controls.contact.patchValue({
      designation_id: e,
    });
  }

  frtodatevendor:any = { "fromobj":{label: "Contract From",disabled: true},toobj:{label: "Contract To", disabled: true},renewobj:{label: "Renewal Date", disabled: true}}

  fromdatevendorfun(vendorfrom){
this.vendorAddForm.patchValue({
  contractdate_from:vendorfrom
})
if(vendorfrom == "" || vendorfrom == undefined || vendorfrom == null){
  this.frtodatevendor = { "fromobj":{label: "Contract From",defaultvalue:''},toobj:{label: "Contract To",defaultvalue:''}}
  this.vendorAddForm.get('renewal_date').reset()
}
else{
  const date = new Date(vendorfrom);
  console.log(date, "test");
  console.log("ss", this.vendorAddForm.value.contractdate_from);
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
  this.frtodatevendor = { "fromobj":{label: "Contract From",defaultvalue:this.fromdate},toobj:{label: "Contract To",defaultvalue:this.todate}}
}
  

  }

  todatevendorfun(vendorto){
this.vendorAddForm.patchValue({
  contractdate_to:vendorto
})
  }



  SummaryvendorcreateData:any = [{columnname: "Director Name",
  key: "name"},
{  columnname: "Action",
key: "remarks",
button: true,
function: true,
icon: "delete",
clickfunction: this.directorNameDelete.bind(this), }]

  SummaryApivendorcreatemodifyObjNew:any = {"method": "get",FeSummary:true, data:this.directorNameList}

  
  closedpopup() {
    this.closeaddpopup.nativeElement.click();
  }

  popupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("exampleModal"),
      {
        keyboard: false,
      }
    );
    myModal.show();
  }


  popupriskopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("riskList"),
      {
        keyboard: false,
      }
    );
    myModal.show();
  }

  msme_type_data(e) {
    this.vendorAddForm.patchValue({
      msme_type : e
    })
    // if(this.msme == "True"){

    // }
  }
}
class vendor {
  name: string;
  remarks: string;
  gstno: any;
  panno: any;
  // code: string;
  composite: any;
  comregno: string;
  group: any;
  custcategory_id: any;
  classification: any;
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
  director_count: any;
  rm_id: number;
  emaildays: any;
  msme = "False";
  msme_reg_no: any;
  msme_type:any;
  risk_type: any;
  riskcategory_id: any;
  risk_remarks: any;
  address: {
    line1: string;
    line2: string;
    line3: string;
    pincode_id: any;
    city_id: any;
    district_id: any;
    state_id: any;
  };
  contact: {
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