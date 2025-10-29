import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  Injectable,
} from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { Validators, FormArray } from "@angular/forms";
import { Observable, from, fromEvent } from "rxjs";
import { Router } from "@angular/router";
import { AtmaService } from "../atma.service";
import { ShareService } from "../share.service";
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
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from "../error-handling.service";
import { environment } from "src/environments/environment";

// export interface Designation {
//   id: string;
//   name: string;
// }
// export interface ContactType {
//   id: string;
//   name: string;
// }

export interface actdescription {
  id: string;
  name: string;
}

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
  selector: "app-branchactivity-edit",
  templateUrl: "./branchactivity-edit.component.html",
  styleUrls: ["./branchactivity-edit.component.scss"],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,
  ],
})
export class BranchactivityEditComponent implements OnInit {
  ActivityEditForm: FormGroup;
  pinCodeList: Array<any>;
  cityList: Array<any>;
  stateList: Array<any>;
  districtList: Array<any>;
  // designationList: Array<Designation>;
  // contactTypeList: Array<ContactType>;
  // public Fidelity: boolean = false;
  // public Bidding: boolean = false;
  Fidelity: any;
  Bidding: any;
  vendorData: any;
  branchId: number;
  activityEditID: number;
  activityStatusList=["Active","Inactive"]
  // activityStatusList = [
  //   { name: "Active",value: "Active"},
  //   { name: "Inactive",value:"Inactive" },
  // ];
  activityTypeList = [
    { name: "product", value: "product" },
    { name: "Service", value: "Service" },
  ];
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  select: any;
  requestStatusName: string;
  vendorStatusName: string;
  vendorId: number;
  activityButton = false;
  futureDays = new Date();

  depdata: any;
  employeeIdValue: any[];

  // acitivitydropdowndata: any;
  name_has_next = true;
  name_has_previous = true;
  namecurrentpage = 1;
  activitype: any ={
    label: "Activity Type",
    fronentdata: true,
    data: this.activityTypeList,
    displaykey: "name",
    Outputkey: "value",
    valuekey: "value",
    formcontrolname: 'type',formkey:'value',
    required: true,
  };
  activitstatus:any = {label: "Activity Status",
    fronentdata: true,
    data: this.activityStatusList,
    displaykey: "name",
    Outputkey: "value",
    valuekey: "value",
    formcontrolname: 'activity_status',
    required: true,
  };

  // @ViewChild("desg") matdesignationAutocomplete: MatAutocomplete;
  // @ViewChild("designationInput") designationInput: any;

  // @ViewChild("contactType") matcontactAutocomplete: MatAutocomplete;
  // @ViewChild("contactInput") contactInput: any;
  // @ViewChild(MatAutocompleteTrigger)
  // autocompleteTrigger: MatAutocompleteTrigger;

  // @ViewChild("nameautocomplete") nameautocomplete: MatAutocomplete;
  // @ViewChild("activitynameInput") activitynameInput: any;

  // @ViewChild("descriptionautocomplete")
  // descriptionautocomplete: MatAutocomplete;
  // @ViewChild("activitydescriptioninput") activitydescriptioninput: any;

  // activitydesignationdata = [];
  activitydesign_has_next = true;
  activitydesign_has_previous = true;
  activitydesign_currentpage = 1;
  vendorURL = environment.apiURL;

  departmentfield: any  = {
    label: "Department",
    method: "get",
    url: this.vendorURL + "usrserv/searchdepartment",
    params: "",
    searchkey: "query",
    displaykey: "name",
    wholedata: true,
    required: true,
    formcontrolname: 'service_branch'
  };
  descriptionfield: any = {
    label: "Description",
    method: "get",
    url: this.vendorURL + "mstserv/create_activity",
    params: "",
    searchkey: "query",
    displaykey: "name",
    required: true,
    formcontrolname: 'description'
  };
  designationfield: any = {
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
  Type: any;
  activity_status: any;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  contact_id: any;
  des_id: any;
  constructor(
    private formBuilder: FormBuilder,
    private atmaService: AtmaService,
    private sharedService: ShareService,
    private notification: NotificationService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private errorHandler: ErrorHandlingService,
    private SpinnerService: NgxSpinnerService,
    private router: Router
  ) {
    this.futureDays.setDate(this.futureDays.getDate());

    // this.activitstatus = {
    //   label: "Activity Status",
    //   fronentdata: true,
    //   data: this.activityStatusList,
    //   params: "",
    //   searchkey: "",
    //   displaykey: "name",
    //   Outputkey: "name",
    //   required: true,
    // };
    // this.departmentfield = {
    //   label: "Department",
    //   method: "get",
    //   url: this.vendorURL + "usrserv/searchdepartment",
    //   params: "",
    //   searchkey: "query",
    //   displaykey: "name",
    //   wholedata: true,
    //   required: true,
    // };
    // this.descriptionfield = {
    //   label: "Description",
    //   method: "get",
    //   url: this.vendorURL + "mstserv/create_activity",
    //   params: "",
    //   searchkey: "query",
    //   displaykey: "name",
    //   required: true,
    // };
    // this.designationfield = {
    //   label: "Designation",
    //   method: "get",
    //   url: this.vendorURL + "mstserv/designation_search",
    //   params: "",
    //   searchkey: "query",
    //   displaykey: "name",
    //   wholedata: true,
    //   required: true,
    // };
  }

  ngOnInit(): void {
    let id = this.sharedService.vendorID.value;
    this.vendorId = id;
    console.log("v---id", this.vendorId);
    let data = this.sharedService.activityEditForm.value;
    this.branchId = data.branch;
    console.log("branchid", this.branchId);
    this.ActivityEditForm = this.formBuilder.group({
      name: ["", Validators.required],
      service_branch: [""],
      type: ["", Validators.required],
      start_date: [""],
      end_date: [""],
      contract_spend: ["", Validators.required],
      rm: [""],
      fidelity: [""],
      bidding: [""],
      description: [""],
      description_id: [""],
      activity_status: ["", Validators.required],
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
        landline: [""],
        landline2: [""],
        mobile: [""],
        mobile2: [""],
        name: [""],
        // type_id: ['', Validators.required],
        id:[''],
      }),
    });

    this.ActivityEditForm.get("service_branch")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.atmaService
            .activitynamedrop(value, (this.namecurrentpage = 1))
            .pipe(
              finalize(() => {
                this.isLoading = false;
              })
            )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.depdata = datas;
      });

    // let desgkeyvalue: String = "";
    // this.getDesignation(desgkeyvalue);

    // this.ActivityEditForm.controls.contact.get('designation_id').valueChanges
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
    //     console.log("dd",datas)

    //   })
    // let contactkeyvalue: String = "";
    // this.getContactType(contactkeyvalue);

    // this.ActivityEditForm.controls.contact.get('type_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),
    //     switchMap(value => this.atmaService.get_contact(value,1)
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
    //     console.log("tt",datas)

    //   })
    this.getActivityEdit();
    this.getActivityRM();
    this.getVendorViewDetails();
  }
  // designame() {
  //   let desgkeyvalue: String = "";
  //   this.getDesignation(desgkeyvalue);

  //   this.ActivityEditForm.controls.contact
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
  //       console.log("dd", datas);
  //     });
  // }
  getVendorViewDetails() {
    this.atmaService.getVendorViewDetails(this.vendorId).subscribe((result) => {
      this.requestStatusName = result.requeststatus_name;
      this.vendorStatusName = result.vendor_status_name;
    });
  }
  getActivityEdit() {
    let dataa = this.sharedService.activityEditForm.value;
    console.log("BranchActyy", dataa);
    this.activityEditID = dataa.id;
    this.contact_id = dataa.contact_id.id
    this.atmaService
      .branchActivitySingle(this.branchId, this.activityEditID)
      .subscribe((data) => {
        console.log(" this.Type", this.Type);
        this.Type = data.type;
        this.activity_status = data.activity_status;
        // this.activitype = {
        //   label: "Activity Type",
        //   fronentdata: true,
        //   data: this.activityTypeList,
        //   displaykey: "name",
        //   Outputkey: "value",
        //   valuekey: "value",
        //   defaultvalue: this.Type,
        //   required: true,
        // };
        this.activitstatus = {
          label: "Activity Status",
          fronentdata: true,
          data: this.activityStatusList,
          displaykey: "name",
          Outputkey: "value",
          valuekey: "value",
          defaultvalue: this.activity_status,
          required: true,
        };
        this.frtodate = {
          fromobj: {
            label: "Start Date",
            defaultvalue: data.start_date,
            required: true,
          },
          toobj: {
            label: "End Date",
            defaultvalue: data.end_date,
            required: true,
          },
        };
        console.log("singlerecord", data);
        // this.departmentfield = {
        //   label: "Department",
        //   method: "get",
        //   url: this.vendorURL + "usrserv/searchdepartment",
        //   params: "",
        //   searchkey: "query",
        //   displaykey: "name",
        //   wholedata: true,
        //   required: true,
        //   defaultvalue: data.service_branch,
        // };
        // this.descriptionfield = {
        //   label: "Description",
        //   method: "get",
        //   url: this.vendorURL + "mstserv/create_activity",
        //   params: "",
        //   searchkey: "query",
        //   displaykey: "name",
        //   required: true,
        //   defaultvalue: data.description_id,
        // };
        // this.designationfield = {
        //   label: "Designation",
        //   method: "get",
        //   url: this.vendorURL + "mstserv/designation_search",
        //   params: "",
        //   searchkey: "query",
        //   displaykey: "name",
        //   wholedata: true,
        //   required: true,
        //   defaultvalue: data.contact_id.designation_id,
        // };
        let ActivityType = data.type;
        let Name = data.name;
        let Description = data.description == null ? "" : data.description;
        let description_id = data.description_id;
        let StartDate = data.start_date;
        let EndDate = data.end_date;
        let ContractSpend = data.contract_spend;
        let servicebranchdata = data.service_branch;
        if (data.fidelity == "True") {
          this.Fidelity = true;
        } else {
          this.Fidelity = false;
        }
        if (data.bidding == "True") {
          this.Bidding = true;
        } else {
          this.Bidding = false;
        }
        // this.Fidelity = data.fidelity;
        // let fidlity = this.Fidelity;
        // this.Bidding = data.bidding;
        // let bidng = this.Bidding;
        let ActicvityStatus = data.activity_status;
        let Contact = data.contact_id;
        let designation = data.contact_id.designation_id;
        // let type = data.contact_id.type_id
        let dob = Contact.dob;
        let Email = Contact.email;
        let LandLine1 = Contact.landline;
        let LandLine2 = Contact.landline2;
        let Mobile1 = Contact.mobile;
        let Mobile2 = Contact.mobile2;
        let contactName = Contact.name;
        this.ActivityEditForm.patchValue({
          type: ActivityType,
          name: Name,
          // "description": Description,
          description: description_id,
          // description_id: description_id.id ? description_id.id : "",
          start_date: StartDate,
          end_date: EndDate,
          contract_spend: ContractSpend,
          fidelity: this.Fidelity,
          bidding: this.Bidding,
          activity_status: ActicvityStatus,
          service_branch: servicebranchdata,
          contact: {
            designation_id: designation,
            email: Email,
            landline: LandLine1,
            landline2: LandLine2,
            mobile: Mobile1,
            mobile2: Mobile2,
            name: contactName,
            dob: dob,
            // "type_id": type
          },
        });
      });
  }

  getActivityRM() {
    this.vendorData = this.sharedService.activityEditForm.value;
    console.log("vendortotaldata", this.vendorData);
    let employeeName = this.vendorData.rm;
    console.log("empname", employeeName);
    this.ActivityEditForm.patchValue({
      rm: employeeName,
    });
  }

  // public displayFnDesg(desg?: Designation): string | undefined {
  //   console.log("id", desg.id);
  //   console.log("name", desg.name);
  //   return desg ? desg.name : undefined;
  // }

  // get desg() {
  //   return this.ActivityEditForm.value.get("designation_id");
  // }

  // public displayFnContactType(contactType?: ContactType): string | undefined {
  //   console.log("id", contactType.id);
  //   console.log("name", contactType.name);
  //   return contactType ? contactType.name : undefined;
  // }

  // get contactType() {
  //   return this.ActivityEditForm.value.get("type_id");
  // }

  // private getDesignation(desgkeyvalue) {
  //   this.atmaService
  //     .getDesignationSearch(desgkeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.designationList = datas;
  //       console.log("designation", datas);
  //     });
  // }

  // private getContactType(contactkeyvalue) {
  //   this.atmaService
  //     .getContactSearch(contactkeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.contactTypeList = datas;
  //       console.log("contacttype", datas);
  //     });
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
  //       fromEvent(this.matcontactAutocomplete.panel.nativeElement, "scroll")
  //         .pipe(
  //           map(
  //             (x) => this.matcontactAutocomplete.panel.nativeElement.scrollTop
  //           ),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe((x) => {
  //           const scrollTop =
  //             this.matcontactAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight =
  //             this.matcontactAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight =
  //             this.matcontactAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.atmaService
  //                 .get_contact(
  //                   this.contactInput.nativeElement.value,
  //                   this.currentpage + 1
  //                 )
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.contactTypeList = this.contactTypeList.concat(datas);
  //                   if (this.contactTypeList.length >= 0) {
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
  // fromDateSelection(event: string) {
  //   console.log("fromdate", event);
  //   const date = new Date(event);
  //   this.select = new Date(
  //     date.getFullYear(),
  //     date.getMonth(),
  //     date.getDate() + 1
  //   );
  // }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  submitForm() {
    this.SpinnerService.show();

    // if (this.ActivityEditForm.value.name === "") {
    //   this.toastr.error('Please Enter Activity Name');
    //   this.SpinnerService.hide();
    //   return false;
    // }

    if (
      this.ActivityEditForm.value.service_branch.id === "" ||
      this.ActivityEditForm.value.service_branch.id === undefined ||
      this.ActivityEditForm.value.service_branch.id === null
    ) {
      this.toastr.error("Please Select Department");
      this.SpinnerService.hide();
      return false;
    }

    if (this.ActivityEditForm.value.type === "") {
      this.toastr.error("Please Select Any One Activity Type");
      this.SpinnerService.hide();
      return false;
    }
    if (this.ActivityEditForm.value.start_date === "") {
      this.toastr.error("Please Choose start Date");
      this.SpinnerService.hide();
      return false;
    }
    if (this.ActivityEditForm.value.end_date === "") {
      this.toastr.error("Please Choose end Date");
      this.SpinnerService.hide();
      return false;
    }
    if (this.ActivityEditForm.value.contract_spend === "") {
      this.toastr.error("Please Enter Contract Spend");
      this.SpinnerService.hide();
      return false;
    }
    if (this.ActivityEditForm.value.activity_status === "") {
      this.toastr.error("Please Select Any One Activity Status");
      this.SpinnerService.hide();
      return false;
    }
    if (this.ActivityEditForm.value.description === "") {
      this.toastr.error('Please Select Description');
      this.SpinnerService.hide();
      return false;
    }
    if (
      this.ActivityEditForm.value.contact.designation_id === "" ||
      this.ActivityEditForm.value.contact.designation_id.id === undefined
    ) {
      this.toastr.error("Please Select Valid Designation");
      this.SpinnerService.hide();
      return false;
    }

    if (this.ActivityEditForm.value.contact.name === "") {
      this.toastr.error("Please Enter Name");
      this.SpinnerService.hide();
      return false;
    }
    if (this.ActivityEditForm.value.contact.email != "") {
      let a = this.ActivityEditForm.value.contact.email;
      let b = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let c = b.test(a);
      if (c === false) {
        this.toastr.error("Please Enter Valid Email Id");
        this.SpinnerService.hide();
        return false;
      }
    }
    if (this.ActivityEditForm.value.contact.mobile.length != "") {
      if (this.ActivityEditForm.value.contact.mobile.length != 10) {
        this.toastr.error("MobileNo length should be 10 chars");
        this.SpinnerService.hide();
        return false;
      }
    }

    if (this.ActivityEditForm.value.contact.mobile2.length != "") {
      if (this.ActivityEditForm.value.contact.mobile2.length != 10) {
        this.toastr.error("MobileNo2 length should be 10 chars");
        this.SpinnerService.hide();
        return false;
      }
    }
    // //9186
    // if(this.ActivityEditForm.value.service_branch == '' || this.ActivityEditForm.value.service_branch == null || this.ActivityEditForm.value.service_branch == undefined ){
    //   this.notification.showError("Pls ")
    // }

    const dateValue = this.ActivityEditForm.value;
    if (this.ActivityEditForm.controls.contact.value.dob != "None") {
      dateValue.contact.dob = this.datePipe.transform(
        dateValue.contact.dob,
        "yyyy-MM-dd"
      );
    } else {
      this.ActivityEditForm.controls.contact.value.dob = null;
    }
    // dateValue.contact.dob = this.datePipe.transform(dateValue.contact.dob, 'yyyy-MM-dd');

    const startDate = this.ActivityEditForm.value;
    startDate.start_date = this.datePipe.transform(
      dateValue.start_date,
      "yyyy-MM-dd"
    );
    const endDate = this.ActivityEditForm.value;
    endDate.end_date = this.datePipe.transform(
      dateValue.end_date,
      "yyyy-MM-dd"
    );
    this.ActivityEditForm.value.service_branch =
      this.ActivityEditForm.value.service_branch.id;

    this.ActivityEditForm.controls.contact.value.designation_id =
      this.ActivityEditForm.controls.contact.value.designation_id.id;
    // this.ActivityEditForm.controls.contact.value.type_id = this.ActivityEditForm.controls.contact.value.type_id.id

    var str = this.ActivityEditForm.value.name;
    var cleanStr_name = str.trim(); //trim() returns string with outer spaces removed
    this.ActivityEditForm.value.name = cleanStr_name;

    // var str = this.ActivityEditForm.value.description
    // var cleanStr_descpt=str.trim();
    // this.ActivityEditForm.value.description = cleanStr_descpt

    var str = this.ActivityEditForm.value.description;
    var cleanStr_descpt = str.name ? str.name : "";
    if (cleanStr_descpt == "") {
      delete this.ActivityEditForm.value.description_id;
    } else {
      this.ActivityEditForm.value.description = cleanStr_descpt;
    }
    // this.ActivityEditForm.value.description = cleanStr_descpt
    var str = this.ActivityEditForm.value.description_id = this.des_id;
    var str = this.ActivityEditForm.value.contact.name;
    var cleanStr4 = str.trim(); //trim() returns string with outer spaces removed
    this.ActivityEditForm.value.contact.name = cleanStr4;

    var str = this.ActivityEditForm.value.contact.id = this.contact_id;

    var str = this.ActivityEditForm.value.contact.email;
    var cleanStr5 = str.trim(); //trim() returns string with outer spaces removed
    this.ActivityEditForm.value.contact.email = cleanStr5;

    this.atmaService
      .activityEditForm(
        this.activityEditID,
        this.branchId,
        this.ActivityEditForm.value
      )
      .subscribe(
        (res) => {
          console.log("res", res);

          if (res.id === undefined) {
            this.notification.showError(res.description);
            this.SpinnerService.hide();
            return false;
          } else if (
            this.requestStatusName == "MODIFICATION" &&
            this.vendorStatusName == "DRAFT"
          ) {
            this.sharedService.result.next(res);
            this.notification.showSuccess("Updated Successfully!...");
            this.SpinnerService.hide();
            // this.router.navigate(['/atma/branchView'], { skipLocationChange: true })
            this.onSubmit.emit();
          } else {
            this.notification.showSuccess("Updated Successfully!...");
            this.SpinnerService.hide();
            this.onSubmit.emit();
            // this.router.navigate(['/atma/branchView'], { skipLocationChange: true })
          }
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }

  namevalidation(event) {
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9-/  ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  addressvalidation(event) {
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9-_#@.', /&]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  // activitynamedropdown() {
  //   let desgkeyvalue: String = "";
  //   this.getactivitynamedropdown(desgkeyvalue);

  //   this.ActivityEditForm.get("service_branch")
  //     .valueChanges.pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
  //         console.log("inside tap");
  //       }),
  //       switchMap((value) =>
  //         this.atmaService
  //           .activitynamedrop(value, (this.namecurrentpage = 1))
  //           .pipe(
  //             finalize(() => {
  //               this.isLoading = false;
  //             })
  //           )
  //       )
  //     )
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.acitivitydropdowndata = datas;
  //     });
  // }

  // private getactivitynamedropdown(desgkeyvalue) {
  //   this.atmaService
  //     .activitynamedrop(desgkeyvalue, (this.namecurrentpage = 1))
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.acitivitydropdowndata = datas;
  //       // console.log("designation", datas)
  //     });
  // }

  // activitynameauto() {
  //   setTimeout(() => {
  //     if (
  //       this.nameautocomplete &&
  //       this.autocompleteTrigger &&
  //       this.nameautocomplete.panel
  //     ) {
  //       fromEvent(this.nameautocomplete.panel.nativeElement, "scroll")
  //         .pipe(
  //           map((x) => this.nameautocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe((x) => {
  //           const scrollTop =
  //             this.nameautocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight =
  //             this.nameautocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight =
  //             this.nameautocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.atmaService
  //                 .activitynamedrop(
  //                   this.activitynameInput.nativeElement.value,
  //                   this.namecurrentpage + 1
  //                 )
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.acitivitydropdowndata =
  //                     this.acitivitydropdowndata.concat(datas);
  //                   if (this.acitivitydropdowndata.length >= 0) {
  //                     this.name_has_next = datapagination.has_next;
  //                     this.name_has_previous = datapagination.has_previous;
  //                     this.namecurrentpage = datapagination.index;
  //                   }
  //                 });
  //             }
  //           }
  //         });
  //     }
  //   });
  // }

  // activitydesignationsearch(value, page) {
  //   this.isLoading = true;

  //   this.atmaService.getactivitydesignation(value, page).subscribe((result) => {
  //     this.isLoading = false;

  //     this.activitydesignationdata = result["data"];
  //     let pagination = result["pagination"];
  //     if (this.activitydesignationdata.length >= 0) {
  //       this.activitydesign_has_next = pagination.has_next;
  //       this.activitydesign_has_previous = pagination.has_previous;
  //       this.activitydesign_currentpage = pagination.index;
  //     }
  //   });
  // }

  // activitydescriptionautocomplete() {
  //   setTimeout(() => {
  //     if (
  //       this.activitydescriptioninput &&
  //       this.autocompleteTrigger &&
  //       this.activitydescriptioninput.panel
  //     ) {
  //       fromEvent(this.activitydescriptioninput.panel.nativeElement, "scroll")
  //         .pipe(
  //           map(
  //             (x) => this.activitydescriptioninput.panel.nativeElement.scrollTop
  //           ),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe((x) => {
  //           const scrollTop =
  //             this.activitydescriptioninput.panel.nativeElement.scrollTop;
  //           const scrollHeight =
  //             this.activitydescriptioninput.panel.nativeElement.scrollHeight;
  //           const elementHeight =
  //             this.activitydescriptioninput.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.atmaService
  //                 .getactivitydesignation(
  //                   this.activitydescriptioninput.nativeElement.value,
  //                   this.activitydesign_currentpage + 1
  //                 )
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let pagination = results["pagination"];
  //                   this.activitydesignationdata =
  //                     this.activitydesignationdata.concat(datas);

  //                   if (this.activitydesignationdata.length >= 0) {
  //                     this.activitydesign_has_next = pagination.has_next;
  //                     this.activitydesign_has_previous =
  //                       pagination.has_previous;
  //                     this.activitydesign_currentpage = pagination.index;
  //                   }
  //                 });
  //             }
  //           }
  //         });
  //     }
  //   });
  // }

  descriptionselected(value) {
    this.ActivityEditForm.patchValue({
      description_id: value.id ? value.id : "",
    });
  }

  public displayFnactdescrition(desg?: actdescription): string | undefined {
    // console.log('id', desg.id);
    // console.log('name', desg.name);
    return desg ? desg.name : undefined;
  }

  activitypesubmit(e) {
    console.log("event", e);
    this.ActivityEditForm.patchValue({
      type: e,
    });
  }

  activitstatusubmit(e) {
    console.log("event", e);
    this.ActivityEditForm.patchValue({
      activity_status: e,
    });
  }

  // departmentdata(e) {
  //   console.log("event", e);
  //   this.ActivityEditForm.patchValue({
  //     service_branch: e,
  //   });
  // }
  descriptiondata(e) {
    console.log("event", e);
    // this.ActivityEditForm.patchValue({
    //   description_id: e.id ? e.id : "",
    //   description: e
    // });
    this.des_id = e.id;
  }
  // designationdata(e) {
  //   console.log("event", e);
  //   this.ActivityEditForm.controls.contact.patchValue({
  //     designation_id: e,
  //   });
  // }

  frtodate: any = {
    fromobj: { label: "Start Date" },
    toobj: { label: "End Date" },
  };

  fromdatefun(fromdatessss) {
    this.ActivityEditForm.patchValue({
      start_date: fromdatessss,
    });
  }

  todatefun(todatessss) {
    this.ActivityEditForm.patchValue({
      end_date: todatessss,
    });
  }
  close() {
    this.onCancel.emit();
  }
}
