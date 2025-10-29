import { Component, OnInit, ViewChild, Injectable } from "@angular/core";
import { AtmaService } from "../atma.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { ShareService } from "../share.service";
import { Router } from "@angular/router";
import { getAllJSDocTagsOfKind } from "typescript";
import { getMatFormFieldPlaceholderConflictError } from "@angular/material/form-field";
import { NotificationService } from "../notification.service";
import {
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_FORMATS,
} from "@angular/material/core";
import { formatDate, DatePipe } from "@angular/common";
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
import { env } from "src/app/AppAutoEngine/import-services/CommonimportFiles";
export interface classification {
  id: string;
  text: string;
}
export interface RM {
  id: string;
  full_name: string;
}

export interface GST {
  id: string;
  text: string;
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
  selector: "app-vendor-summary",
  templateUrl: "./vendor-summary.component.html",
  styleUrls: ["./vendor-summary.component.scss"],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,
  ],
})
export class VendorSummaryComponent implements OnInit {
  atmaUrl = environment.apiURL
  searclos: boolean = false;
  vendorSummaryList: any;
  searchValue: any;
  vendorDataLength: any;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  inputGstValue = "";
  inputPanValue = "";
  employeeList: Array<RM>;
  GSTlist: Array<GST>;
  isLoading = false;
  classificationList: Array<classification>;
  pageSize = 10;
  isVendorSummaryPagination: boolean;
  vendorSearchForm: FormGroup;
  isRejectRemarks = false;
  rejectedList: any;
  id: number;
  StatusTag: any;
  status: any;
  classifys:any;
  rmfield:any;
  gstcatfield:any;
  requesttype: any;
  VendorstatusesList = [
    { id: 1, name: "DRAFT" },
    //  {'id':2, 'name':'PENDING_RM'},{'id':3, 'name':'PENDING_CHECKER'},
    { id: 4, name: "PENDING_HEADER" },
    { id: 5, name: "APPROVED" },
    { id: 6, name: "RENEWAL_APPROVED" },
    { id: 0, name: "REJECTED" },
  ];
  //  Vendorstatuslist: string[] = ['ALL', 'ACTIVATION', 'DEACTIVATION', 'APPROVED', 'QUEUE', 'MODIFICATION', 'RENEWAL', 'TERMINATION','PENDING'];
  Vendorstatuslist = [
    { id: 0, text: "All" },
    { id: 3, text: "Activation" },
    { id: 4, text: "Deactivation" },
    { id: 1, text: "Approved" },
    { id: 7, text: "Queue" },
    { id: 2, text: "Modification" },
    { id: 6, text: "Termination" },
    { id: 8, text: "Pending" },
  ];
  @ViewChild("classify") matclassifyAutocomplete: MatAutocomplete;
  @ViewChild("classifyInput") classifyInput: any;
  @ViewChild("rmemp") matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild("rmInput") rmInput: any;
  @ViewChild("gstInput") gstInput: any;
  vendorURL=environment.apiURL
  constructor(
    private atmaService: AtmaService,
    private errorHandler: ErrorHandlingService,
    private SpinnerService: NgxSpinnerService,
    private fb: FormBuilder,
    private notification: NotificationService,
    public datepipe: DatePipe,
    private router: Router,
    private shareService: ShareService
  ) {
    this.status = 
    { label: "Status", fronentdata: true, data: this.VendorstatusesList, params: "", "searchkey": "", "displaykey": "name", Outputkey: "id",
      formcontrolname:'vendor_status',formkey:'id'
     }
    this.requesttype = 
    { label: "Request Type", fronentdata: true, data: this.Vendorstatuslist, params: "", "searchkey": "", "displaykey": "text", Outputkey: "id",
      formcontrolname:'vendorstatus'
     }
    this.classifys = 
    { label: "Classification",  "method": "get", "url": this.vendorURL + "mstserv/type" ,params: "", "searchkey": "", "displaykey": "text", Outputkey: "id",
      formcontrolname:'classification'
     }
    this.rmfield = 
    { label: "Header Name",  "method": "get", "url": this.vendorURL + "usrserv/searchemployee" ,params: "", "searchkey": "query", "displaykey": "full_name", Outputkey: "id",
      formcontrolname:'rm_id',
     }
    this.gstcatfield = 
    { label: "GST Category",  "method": "get", "url": this.vendorURL + "mstserv/composite" ,params: "", "searchkey": "", "displaykey": "text", Outputkey: "id",
      formcontrolname:'GST_status'
     }
  }

  ngOnInit(): void {
    // this.getVendorSummary();
    this.vendorSearchForm = this.fb.group({
      name: [""],
      panno: [""],
      gstno: [""],
      code: [""],
      classification: [""],
      rm_id: [""],
      renewal_date: [""],
      vendor_status: [""],
      GST_status: [""],
      vendorstatus: new FormControl(null),
    });
  }

  getVendorSummary(pageNumber = 1, pageSize = 10) {
    this.atmaService
      .getVendorSummary(pageNumber, pageSize)
      .subscribe((result) => {
        this.vendorSummaryList = result["data"];
        let dataPagination = result["pagination"];
        if (this.vendorSummaryList.length >= 0) {
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
          this.isVendorSummaryPagination = true;
        }
        if (this.vendorSummaryList <= 0) {
          this.isVendorSummaryPagination = false;
        }

        console.log("VendorSummary", result);
      });
  }
  nextClick() {
    if (this.has_next === true) {
      if (this.StatusTag === "MODIFICATION") {
        this.currentpage = this.presentpage + 1;
        this.getfilterdata(this.id, this.presentpage + 1, 10);
      } else if (this.StatusTag === "ACTIVATION") {
        this.currentpage = this.presentpage + 1;
        this.getfilterdata(this.id, this.presentpage + 1, 10);
      } else if (this.StatusTag === "DEACTIVATION") {
        this.currentpage = this.presentpage + 1;
        this.getfilterdata(this.id, this.presentpage + 1, 10);
      } else if (this.StatusTag === "TERMINATION") {
        this.currentpage = this.presentpage + 1;
        this.getfilterdata(this.id, this.presentpage + 1, 10);
      } else if (this.StatusTag === "RENEWAL") {
        this.currentpage = this.presentpage + 1;
        this.getfilterdata(this.id, this.presentpage + 1, 10);
      } else if (this.StatusTag === "QUEUE") {
        this.currentpage = this.presentpage + 1;
        this.getfilterdata(this.id, this.presentpage + 1, 10);
      } else if (this.StatusTag === "APPROVED") {
        this.currentpage = this.presentpage + 1;
        this.getfilterdata(this.id, this.presentpage + 1, 10);
        // this.vendorSearch(this.presentpage + 1, 10)
      } else if (this.StatusTag === "PENDING") {
        this.currentpage = this.presentpage + 1;
        this.getfilterdata(this.id, this.presentpage + 1, 10);
      } else {
        this.currentpage = this.presentpage + 1;
        // this.getVendorSummary(this.presentpage + 1, 10)
        // BUG ID:7022
        this.vendorSearch(this.presentpage + 1, 10);
      }
    }
  }

  previousClick() {
    if (this.has_previous === true) {
      if (this.StatusTag === "MODIFICATION") {
        this.currentpage = this.presentpage - 1;
        this.getfilterdata(this.id, this.presentpage - 1, 10);
      } else if (this.StatusTag === "ACTIVATION") {
        this.currentpage = this.presentpage - 1;
        this.getfilterdata(this.id, this.presentpage - 1, 10);
      } else if (this.StatusTag === "DEACTIVATION") {
        this.currentpage = this.presentpage - 1;
        this.getfilterdata(this.id, this.presentpage - 1, 10);
      } else if (this.StatusTag === "TERMINATION") {
        this.currentpage = this.presentpage - 1;
        this.getfilterdata(this.id, this.presentpage - 1, 10);
      } else if (this.StatusTag === "RENEWAL") {
        this.currentpage = this.presentpage - 1;
        this.getfilterdata(this.id, this.presentpage - 1, 10);
      } else if (this.StatusTag === "QUEUE") {
        this.currentpage = this.presentpage - 1;
        this.getfilterdata(this.id, this.presentpage - 1, 10);
      } else if (this.StatusTag === "APPROVED") {
        this.currentpage = this.presentpage - 1;
        this.getfilterdata(this.id, this.presentpage - 1, 10);
      } else if (this.StatusTag === "PENDING") {
        this.currentpage = this.presentpage - 1;
        this.getfilterdata(this.id, this.presentpage - 1, 10);
      } else {
        this.currentpage = this.presentpage - 1;
        // this.getVendorSummary(this.presentpage - 1, 10)
        this.vendorSearch(this.presentpage - 1, 10);
      }
    }
  }

  // vendorSearch() {
  // BUG ID:7022
  vendorSearch(pageNumber = 1, pageSize = 10) {
    this.SpinnerService.show();
    // this.vendorSearchForm.value.code='su';
    let search = this.vendorSearchForm.value;

    if (
      search.rm_id == null ||
      search.rm_id == "" ||
      search.rm_id == undefined
    ) {
      this.vendorSearchForm.value.rm_id = "";
    }
    // else{
    //   this.vendorSearchForm.value.rm_id= this.vendorSearchForm.value.rm_id.id
    //   }
    //7022
    else {
      if (
        this.vendorSearchForm.value.rm_id.id == undefined ||
        this.vendorSearchForm.value.rm_id.id == null
      ) {
        this.vendorSearchForm.value.rm_id = this.vendorSearchForm.value.rm_id;
      } else {
        this.vendorSearchForm.value.rm_id =
          this.vendorSearchForm.value.rm_id.id;
      }
    }
    //BUG ID:7023

    if (
      search.vendorstatus == null ||
      search.vendorstatus == "" ||
      search.vendorstatus == undefined
    ) {
      this.vendorSearchForm.value.vendorstatus = "";
    } else {
      if (
        this.vendorSearchForm.value.vendorstatus.id == undefined ||
        this.vendorSearchForm.value.vendorstatus.id == null
      ) {
        this.vendorSearchForm.value.vendorstatus =
          this.vendorSearchForm.value.vendorstatus;
      } else {
        this.vendorSearchForm.value.vendorstatus =
          this.vendorSearchForm.value.vendorstatus.id;
      }
    }
    //BUG ID:7023

    //BUG ID:7009

    if (
      search.GST_status == null ||
      search.GST_status == "" ||
      search.GST_status == undefined
    ) {
      this.vendorSearchForm.value.GST_status = "";
    } else {
      if (
        this.vendorSearchForm.value.GST_status.id == undefined ||
        this.vendorSearchForm.value.GST_status.id == null
      ) {
        this.vendorSearchForm.value.GST_status =
          this.vendorSearchForm.value.GST_status;
      } else {
        this.vendorSearchForm.value.GST_status =
          this.vendorSearchForm.value.GST_status.id;
      }
    }
    //BUG ID:7009

    if (
      search.classification == null ||
      search.classification == "" ||
      search.classification == undefined
    ) {
      // search.classification.id = "''"
      this.vendorSearchForm.value.classification = "";
    }
    //  else{
    //   this.vendorSearchForm.value.classification= this.vendorSearchForm.value.classification.id
    // }
    else {
      if (
        this.vendorSearchForm.value.classification.id == undefined ||
        this.vendorSearchForm.value.classification.id == null
      ) {
        this.vendorSearchForm.value.classification =
          this.vendorSearchForm.value.classification;
      } else {
        this.vendorSearchForm.value.classification =
          this.vendorSearchForm.value.classification.id;
      }
    }

    if (
      search.renewal_date == null ||
      search.renewal_date == "" ||
      search.renewal_date == "''"
    ) {
      this.vendorSearchForm.value.renewal_date == "";
    } else {
      this.vendorSearchForm.value.renewal_date = this.datepipe.transform(
        this.vendorSearchForm.value.renewal_date,
        "yyyy-MM-dd"
      );
    }
    if (
      search.vendorstatus == null ||
      search.vendorstatus == "" ||
      search.vendorstatus == undefined
    ) {
      this.vendorSearchForm.value.vendorstatus = "";
    } else {
      this.vendorSearchForm.value.vendorstatus =
        this.vendorSearchForm.value.vendorstatus;
    }

    if (
      search.GST_status == null ||
      search.GST_status == "" ||
      search.GST_status == undefined
    ) {
      this.vendorSearchForm.value.GST_status = "";
    } else {
      this.vendorSearchForm.value.GST_status =
        this.vendorSearchForm.value.GST_status;
    }
    let datas=this.searchfunction(this.vendorSearchForm.value)
    this.vendorsummaryObjNew = { "method": "get", "url": this.atmaUrl + "venserv/search" ,params:datas}

    // this.adsearchclose()
    // this.atmaService
    //   .getVendorSearch(this.vendorSearchForm.value, pageNumber)
    //   .subscribe(
    //     (result) => {
    //       console.log("RESULSSS", result);
    //       if (result.data) {
    //         this.vendorSummaryList = result["data"];
    //         let dataPagination = result["pagination"];
    //         if (this.vendorSummaryList.length >= 0) {
    //           this.has_next = dataPagination.has_next;
    //           this.has_previous = dataPagination.has_previous;
    //           this.presentpage = dataPagination.index;
    //           this.isVendorSummaryPagination = true;
    //         }
    //         if (this.vendorSummaryList <= 0) {
    //           this.isVendorSummaryPagination = false;
    //         }
    //         this.searclos = false;
    //         this.SpinnerService.hide();
    //       }
    //     },
    //     (error) => {
    //       this.errorHandler.handleError(error);
    //       this.SpinnerService.hide();
    //     }
    //   );
  }

  vendorView(vendorViewData) {
    this.shareService.vendorView.next(vendorViewData);
    this.router.navigate(["/atma/vendorView"], { skipLocationChange: true });
  }

  vendorEdit(vendorEditData) {
    this.shareService.vendorEditValue.next(vendorEditData);
    this.router.navigate(["/atma/vendoredit"], { skipLocationChange: true });
  }

  rejectPopup(status, vendorId) {
    if (status === "REJECTED") {
      this.isRejectRemarks = true;
      this.atmaService.getRejected(vendorId).subscribe((result) => {
        let data = result["data"];
        let rejectList = data;
        let io = rejectList.length - 1;
        this.rejectedList = rejectList[io].comments;
      });
    } else {
      this.isRejectRemarks = false;
    }
  }

  getfilterdata(id, pageNumber, pageSize) {
    this.atmaService
      .getstatusfilter(id, pageNumber, pageSize)
      .subscribe((result) => {
        this.vendorSummaryList = result["data"];
        let dataPagination = result["pagination"];
        if (this.vendorSummaryList.length >= 0) {
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
          this.isVendorSummaryPagination = true;
        }
        if (this.vendorSummaryList <= 0) {
          this.isVendorSummaryPagination = false;
        }
      });
  }

  Vendorchange(e) {
    if (e.isUserInput == true) {
      this.StatusTag = e.source.value;
      this.getVendorSummary(1, 10);
      //7023
      // if (this.StatusTag === 'MODIFICATION') {

      //   this.id = 2;
      //   this.getfilterdata(this.id, 1, 10)

      // }
      // if (this.StatusTag === 'ACTIVATION') {

      //   this.id = 3;
      //   this.getfilterdata(this.id, 1, 10)

      // }
      // if (this.StatusTag === 'DEACTIVATION') {

      //   this.id = 4;
      //   this.getfilterdata(this.id, 1, 10)

      // }
      // if (this.StatusTag === 'TERMINATION') {

      //   this.id = 6;
      //   this.getfilterdata(this.id, 1, 10)

      // }
      // if (this.StatusTag === 'RENEWAL') {

      //   this.id = 5;
      //   this.getfilterdata(this.id, 1, 10)

      // }
      // if (this.StatusTag == 'QUEUE') {

      //   this.id=7;
      //     this.getfilterdata(this.id, 1, 10)

      // }
      // if (this.StatusTag == 'APPROVED') {

      //   this.id=1
      //   this.getfilterdata(this.id, 1, 10)

      // }
      // if (this.StatusTag == 'PENDING') {

      //   this.id=8
      //   this.getfilterdata(this.id, 1, 10)

      // }
      // if (this.StatusTag === 'ALL') {
      //   this.getVendorSummary(1,10)
      // }
      //7023
    }
  }

  validationPAN(e) {
    let panno = e.target.value;
    this.atmaService.getVendorPanNumber(panno).then((res) => {
      let result = res.validation_status;
      // this.pan_status = result
      if (result === false) {
        this.notification.showWarning("Please Enter a Valid PAN Number");
      } else {
        this.notification.showSuccess("PAN Number validated...");
      }
    });
  }

  validationGstNo(e) {
    let gstno = e.target.value;
    this.atmaService.getVendorGstNumber(gstno).then((res) => {
      let result = res.validation_status;
      // this.gst_status = result
      if (result === false) {
        this.notification.showWarning("Please Enter a Valid GST Number");
      } else {
        this.notification.showSuccess("GST Number validated...");
      }
    });
  }
  namevalidation(event) {
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9-]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  classifyname() {
    this.getClassification();

    this.vendorSearchForm
      .get("classification")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.atmaService.getClassification().pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.classificationList = datas;
      });
  }

  private getClassification() {
    this.atmaService.getClassification().subscribe((results: any[]) => {
      let datas = results["data"];
      this.classificationList = datas;
    });
  }
  public displayFnclassify(classify?: classification): string | undefined {
    return classify ? classify.text : undefined;
  }

  get classify() {
    return this.vendorSearchForm.get("classification");
  }

  rmname() {
    let rmkeyvalue: String = "";
    this.getRmEmployee(rmkeyvalue);

    this.vendorSearchForm
      .get("rm_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.atmaService.get_EmployeeName(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;
      });
  }

  private getRmEmployee(rmkeyvalue) {
    this.atmaService
      .getEmployeeSearchFilter(rmkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;
      });
  }
  public displayFnRm(rmemp?: RM): string | undefined {
    return rmemp ? rmemp.full_name : undefined;
  }

  get rmemp() {
    return this.vendorSearchForm.value.get("rm_id");
  }

  //GST FILTER BUG ID:7009

  GSTname() {
    let gstkeyvalue: String = "";
    this.getGST();

    this.vendorSearchForm
      .get("GST_status")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.atmaService
            .getComposite()

            .pipe(
              finalize(() => {
                this.isLoading = false;
              })
            )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.GSTlist = datas;
      });
  }

  getGST() {
    this.atmaService.getComposite().subscribe((results: any[]) => {
      let datas = results["data"];
      this.GSTlist = datas;
    });
  }
  public displayFnGST(gstcat?: GST): string | undefined {
    return gstcat ? gstcat.text : undefined;
  }

  get gstcat() {
    return this.vendorSearchForm.value.get("GST_status");
  }

  // Bug id:5564
  Reset() {
    this.vendorSearchForm.reset();
    this.getVendorSummary();
  }

  vendorsearchicon(){
    this.vendorSearch()
    this.adsearchclose()
  }
  adsearchclose() {
    if (this.searclos) {
      this.searclos = false;
    } else {
      this.searclos = true;
    }
  }

  // statussearch(e){
  //   console.log("event",e)
  //   this.vendorSearchForm.patchValue({
  //     vendor_status : e
  //   })
  // }
  // requestypesearch(e){
  //   console.log("event",e)
  //   this.vendorSearchForm.patchValue({
  //     vendorstatus : e
  //   })
  // }
  // classifydata(e){
  //   console.log("event",e)
  //   this.vendorSearchForm.patchValue({
  //     classification : e
  //   })
  // }
  // rmdata(e){
  //   console.log("event",e)
  //   this.vendorSearchForm.patchValue({
  //     rm_id : e
  //   })
  // }
  // gstcatdata(e){
  //   console.log("event",e)
  //   this.vendorSearchForm.patchValue({
  //     GST_status : e
  //   })
  // }
  vendorsummaryObjNew:any = { "method": "get", "url": this.atmaUrl + "venserv/search" }
  vendorsummaryData:any  = [{ "columnname": "Code", "key": "code"},
    {"columnname": "Name", "key": "name", "style":{color:"blue"},function:true,clickfunction:this.vendorView.bind(this) },
    {"columnname": "PANNo", "key": "panno"},
    {"columnname": "Classification", "key": "type", "type": "object", "objkey":"text" },
    {"columnname": "GSTCategory", "key": "composite"},
    {"columnname": "HeaderName", "key": "rm_id", "type": "object", "objkey": "full_name"},
    {"columnname": "RenewalDate", "key": "renewal_date", "type": "date","datetype": "dd/MM/yyyy"},
    {"columnname": "VendorStatus", "key": "mainstatus_name"},
    {"columnname": "RequestType", "key": "requeststatus_name"},
    {"columnname": "RequestStatus", "key": "vendor_status_name",validate: true, validatefunction: this.vendorcreatefn.bind(this)},
  ]

  // vendorcreatefn(data){
  //   let config: any = {
  //     style: '',
  //     icon: '',
  //     class: '',
  //     value: '',
  //   };
  //   if(data.vendor_status_name == 'Draft'){
  //     config={ 
  //       style: {"background-color": "#d7f8e1" ,"color": "#057926", "font-size": "small"},
  //       icon: '',
  //       class: 'badge rounded-pill  ba-badge',
  //       value: 'Draft',
  //     }
      
  //   }
  //     else if( data.vendor_status_name == 'Pending_Header'){
  //       config={
  //         style: { "background-color": "#ededfd", 
  //           "color": "#2d2e8e", "font-size": "small"},
  //         icon: '',
  //         class: 'badge rounded-pill  ba-badge',
  //         value: 'Pending_Header',
  //       }
  //   }

  //   else if ( data.vendor_status_name == 'Pending RM'){
  //     config={
  //       style: { "background-color": "#ededfd", 
  //         "color": "#2d2e8e", "font-size": "small"},
  //       icon: '',
  //       class: 'badge rounded-pill   ba-badge',
  //       value: 'Pending_Header',
  //     } 
  //   }

  //   else if (data.vendor_status_name == 'Pending_Checker'){
  //     config={
  //       style: { "background-color": "#ededfd", 
  //         "color": "#2d2e8e", "font-size": "small"},
  //       icon: '',
  //       class: 'badge rounded-pill   ba-badge',
  //       value: 'Pending_Header',
  //     }
  //   }
  //   else if (data.vendor_status_name == 'Approved'){
  //     config={
  //       style: {  "background-color": "#ffedcc" ,
  //         "color":" #966200", "font-size": "small"},
  //       icon: '',
  //       class: 'badge rounded-pill   ba-badge',
  //       value: 'Approved',
  //     }
  //   }

  //   else if (data.vendor_status_name == 'Rejected'){
  //     config={
  //       style: {  "background-color": "#fae6e6" , "color": "#7f1111", "font-size": "small"},
  //       icon: '',
  //       class: 'badge rounded-pill   ba-badge',
  //       value: 'Rejected',
  //     }
  //   }
  //   console.log("this.config========", config)
  //   return config
  // }
  
  
  vendorcreatefn(data) {
    let config: any = {
      style: '',
      icon: '',
      class: '',
      value: '',
    };
  
    const statusConfigs = {
      'Draft': {
        style: {"background-color": "#d7f8e1", "color": "#057926", "font-size": "small"},
        value: 'Draft',
      },
      'Pending_Header': {
        style: {"background-color": "#ededfd", "color": "#2d2e8e", "font-size": "small"},
        value: 'Pending Header',
      },
      'Pending RM': {
        style: {"background-color": "#ededfd", "color": "#2d2e8e", "font-size": "small"},
        value: 'Pending Header',
      },
      'Pending_Checker': {
        style: {"background-color": "#ededfd", "color": "#2d2e8e", "font-size": "small"},
        value: 'Pending Header',
      },
      'Approved': {
        style: {"background-color": "#ffedcc", "color": "#966200", "font-size": "small"},
        value: 'Approved',
      },
      'Rejected': {
        style: {"background-color": "#fae6e6", "color": "#7f1111", "font-size": "small"},
        value: 'Rejected',
      },
    };
  
    const statusConfig = statusConfigs[data.vendor_status_name];
    if (statusConfig) {
      config = { ...config, ...statusConfig, class: 'badge rounded-pill ba-badge' };
    }
  
    console.log("this.config========", config);
    return config;
  }
  
  searchfunction(search){
    let url=''
    let url1=''
    if (search.gstno == null || search.gstno == '') {
      search.gstno = ""
    }else{
      url1=url1+ "&gstno=" + search.gstno 
    } 
    if (search.name == null || search.name == '') {
      search.name = ""
    } else{
      url1=url1+ "&name=" + search.name 
    } 
    if (search.panno == null || search.panno == '') {
      search.panno = ""
    }else{
      url1=url1+ "&panno=" + search.panno 
    } 
    if (search.code == null || search.code == '') {
      search.code = ""
    }else{
      url1=url1+ "&code=" + search.code 
    } 
    // console.log(search)
    if (search.classification== null || search.classification == '') {
      search.classification= ""
    }else{
      url1=url1+ "&type=" + search.classification 
    } 
    if (search.renewal_date == null || search.renewal_date == '' ) {
      search.renewal_date = ""
    }else{
      url1=url1+ "&renewal_date=" + search.renewal_date 
    } 
    if (search.rm_id == null || search.rm_id == '') {
      search.rm_id = ""
    }else{
      url1=url1+ "&rm_id=" + search.rm_id 
    } 
    if (search.vendor_status == null || search.vendor_status == '') {
      search.vendor_status = ""
    }else{
      url1=url1+ "&vendor_status=" + search.vendor_status 
    } 
    //BUG ID:7023

    if (search.vendorstatus == null || search.vendorstatus == '') {
      search.vendorstatus = ""
    }else{
      url1=url1+ "&supplierprocess=" + search.vendorstatus
    } 
    //7023

    //BUG ID:7009

    if (search.GST_status == null || search.GST_status == '') {
      search.GST_status = ""
    }else{
      url1=url1+ "&composite=" + search.GST_status 
    } 
    //7009
    if(search.code!=''|| search.name!=''
    ||search.vendor_status!=''||search.rm_id!=''|| search.renewal_date!=''||search.classification!=''
    ||search.panno!=''||search.gstno!='' || search.GST_status!='' || search.vendorstatus!=''){


      url=url+"&name1=1"
    }
      url=url+url1
      return url
  }
}
