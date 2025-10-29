import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { SGService } from '../SG.service';
import { SGShareService } from '../share.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatTabChangeEvent } from '@angular/material/tabs';
// import {faChevronLeft, faChevronRight} from '@fortawesome/fontawesome-free-solid';
// import fontawesome from '@fortawesome/fontawesome';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// import {BranchcertSummaryComponent} from '../branchcert-summary/branchcert-summary.component'
import { BranchcertSummaryComponent } from '../branchcert-summary/branchcert-summary.component'
import { InvoiceSummaryComponent } from '../invoice-summary/invoice-summary.component'
import * as moment from 'moment';

import { DatePipe, formatDate } from '@angular/common';


import { default as _rollupMoment, Moment } from 'moment';

import { MatDatepicker } from '@angular/material/datepicker';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map, count } from 'rxjs/operators';

import { SharedService } from '../../service/shared.service'
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlingService } from '../error-handling.service';
import { environment } from 'src/environments/environment';



const moment1 = _rollupMoment || moment;



export interface branchList {
  id: number
  name: string
  code: string
}
export interface premiseList {
  id: number
  name: string
  code: string
}

export interface approver_IN {
  id: string;
  name: string;
}






export interface approvalBranch {
  id: string;
  name: string;
  code: string;
}

export interface productlistss {
  id: number,
  name: string,
  code: string
}

export interface approver {
  id: string;
  full_name: string;
  code: string
}

export interface branchlistss {
  id: number,
  name: string,
  code: string
}

export interface primeslistss {
  id: number,
  name: string,
  code: string
}

export interface Shift {
  id: number
  Shift: string
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'MMM YYYY',
  },
  display: {
    dateInput: 'MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-sgadmin',
  templateUrl: './sgadmin.component.html',
  styleUrls: ['./sgadmin.component.scss'],
  providers: [BranchcertSummaryComponent, InvoiceSummaryComponent,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SGAdminComponent implements OnInit {

  @ViewChild('branchContactInput') branchContactInput: any;
  @ViewChild('branchtype') matAutocompletebrach: MatAutocomplete;

  // Premise dropdown
  @ViewChild('PremiseContactInput') PremiseContactInput: any;
  @ViewChild('primestype') matAutocompletepremise: MatAutocomplete;

  @ViewChild('PremiseContactInput') clear_premises;

  // Vendor dropdown
  @ViewChild('VendorContactInput') VendorContactInput: any;
  @ViewChild('producttype') matAutocompletevendor: MatAutocomplete;


  @ViewChild('VendorContactInput') clear_agency;


  //approval branch
  @ViewChild('appBranchInput') appBranchInput: any;
  @ViewChild('approvalBranch') matAutocompleteappbranch: MatAutocomplete;


  // Approver dropdown
  @ViewChild('ApproverContactInput') ApproverContactInput: any;
  @ViewChild('employee') matAutocompleteapprover: MatAutocomplete;

  @ViewChild('ApproverContactInput') clear_appBranch;

  // popup-screens
  @ViewChild('addaprover') addaprover;
  @ViewChild('rejected') rejected;
  @ViewChild('review') review;
  @ViewChild('makerchecker') makerchecker;

  @ViewChild('branchbranchInput') branchbranchInput: any;
  @ViewChild('branchtype') matAutocompletebrachbranch: MatAutocomplete;

  // Premise dropdown
  @ViewChild('branchsiteInput') branchsiteInput: any;
  @ViewChild('producttype') matAutocompletebranchsite: MatAutocomplete;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  isAttendanceAdmin: FormGroup;
  isBranchcertificationAdmin: FormGroup;
  isInvoiceAdmin: FormGroup;
  premisesArray = [];
  agencyArray = [];
  count = 0;
  premiselistt: any


  monthdate = new FormControl(moment());

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.monthdate.value;
    ctrlValue.year(normalizedYear.year());
    this.monthdate.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.monthdate.value;
    ctrlValue.month(normalizedMonth.month());
    this.monthdate.setValue(ctrlValue);
    datepicker.close();
    this.isAttendanceAdmin.patchValue({
      monthdate: this.monthdate.value
    })
    this.count = 0
  }



  //branch certification
  count_bc = 0;
  monthdate_bc = new FormControl(moment());

  chosenYearHandler_bc(normalizedYear: Moment) {
    const ctrlValue = this.monthdate_bc.value;
    ctrlValue.year(normalizedYear.year());
    this.monthdate_bc.setValue(ctrlValue);
  }

  chosenMonthHandler_bc(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.monthdate_bc.value;
    ctrlValue.month(normalizedMonth.month());
    this.monthdate_bc.setValue(ctrlValue);
    datepicker.close();
    this.isBranchcertificationAdmin.patchValue({
      monthdate_bc: this.monthdate_bc.value
    })
    this.count_bc = 0
  }

  //invoice
  count_In = 0;
  monthdate_In = new FormControl(moment())

  chosenYearHandler_In(normalizedYear: Moment) {
    console.log("normalizedYear: Moment===========================>", normalizedYear)
    const ctrlValue = this.monthdate_In.value;
    ctrlValue.year(normalizedYear.year());
    this.monthdate_In.setValue(ctrlValue);
  }

  chosenMonthHandler_In(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.monthdate_In.value;
    ctrlValue.month(normalizedMonth.month());
    this.monthdate_In.setValue(ctrlValue);
    datepicker.close();
    this.isInvoiceAdmin.patchValue({
      monthdate_In: this.monthdate_In.value
    })
    this.count_In = 0
  }


  constructor(private fb: FormBuilder, private toastr: ToastrService, private datepipe: DatePipe, private route: ActivatedRoute,
    private router: Router, private sgservice: SGService, private shareservice: SGShareService, private SpinnerService: NgxSpinnerService,
    private shareService: SharedService, private notification: NotificationService, private errorHandler: ErrorHandlingService,
    private branchCertSummary: BranchcertSummaryComponent, private invoiceSummary: InvoiceSummaryComponent,
  ) {

  }

  ngOnInit(): void {
    // let monthAttendance = new Date()
    // let Attdate = this.datepipe.transform(monthAttendance, 'yyyy-MM')
    // console.log("Attdate", Attdate)
    // this.monthdate.patchValue({
    //   monthdate:Attdate
    // })



    this.isAttendanceAdmin = this.fb.group({

      monthdate: [''],
      branch_id: [''],
      premise_id: [''],
      agency_id: [''],
    })

    this.isBranchcertificationAdmin = this.fb.group({

      monthdate_bc: [''],
      branch_id: [''],
      premise_id: ['']
    })

    this.isInvoiceAdmin = this.fb.group({

      monthdate_In: [''],
      branch_id: [''],
      premise_id: ['']
    })

    this.datapatchAttendance(moment())
    this.monthpatchAttendance(moment())

    this.datapatchbranch(moment())
    this.monthpatchbranch(moment())

    this.datapatchinvoice(moment())
    this.monthpatchinvoice(moment())
  }

  datapatchAttendance(normalizedYear: Moment) {
    const ctrlValue = this.monthdate.value;
    ctrlValue.year(normalizedYear.year());
    this.monthdate.setValue(ctrlValue);


  }
  monthpatchAttendance(normalizedMonth: Moment) {
    const ctrlValue = this.monthdate.value;
    ctrlValue.month(normalizedMonth.month());
    this.monthdate.setValue(ctrlValue);
    this.isAttendanceAdmin.patchValue({
      monthdate: this.monthdate.value
    })
  }

  datapatchbranch(normalizedYear: Moment) {
    const ctrlValue = this.monthdate_bc.value;
    ctrlValue.year(normalizedYear.year());
    this.monthdate_bc.setValue(ctrlValue);


  }
  monthpatchbranch(normalizedMonth: Moment) {
    const ctrlValue = this.monthdate_bc.value;
    ctrlValue.month(normalizedMonth.month());
    this.monthdate_bc.setValue(ctrlValue);
    this.isBranchcertificationAdmin.patchValue({
      monthdate_bc: this.monthdate_bc.value
    })
  }

  datapatchinvoice(normalizedYear: Moment) {
    const ctrlValue = this.monthdate_In.value;
    ctrlValue.year(normalizedYear.year());
    this.monthdate_In.setValue(ctrlValue);


  }
  monthpatchinvoice(normalizedMonth: Moment) {
    const ctrlValue = this.monthdate_In.value;
    ctrlValue.month(normalizedMonth.month());
    this.monthdate_In.setValue(ctrlValue);
    this.isInvoiceAdmin.patchValue({
      monthdate_In: this.monthdate_In.value
    })
  }



  SG_Admin_DD_List = [
    { id: 7, Display: 'Attendance' },
    { id: 8, Display: 'Branch Certification' },
    { id: 9, Display: 'Invoice Data Entry' }
  ];

  Attendance_Admin: boolean = false
  Branch_Certification_Admin: boolean = false
  Invoice_Data_Entry_Admin: boolean = false



  getFilter_SG_Admin(selected_filter) {
    console.log("selected filter", selected_filter)

    if (selected_filter.id == 7) {
      this.Attendance_Admin = true
      this.Branch_Certification_Admin = false
      this.Invoice_Data_Entry_Admin = false
    }
    if (selected_filter.id == 8) {
      this.Attendance_Admin = false
      this.Branch_Certification_Admin = true
      this.Invoice_Data_Entry_Admin = false

    }
    if (selected_filter.id == 9) {
      this.Attendance_Admin = false
      this.Branch_Certification_Admin = false
      this.Invoice_Data_Entry_Admin = true

    }



  }
  AttendanceShowData: any
  StatusShowSG_Admin: any
  AttendanceSummary: any
  ShowOrHideTable: any
  getAttendanceAdmin() {
    let sgAdminAttendance = this.isAttendanceAdmin.value
    console.log("getting Attendance Value", this.isAttendanceAdmin.value)
    console.log("Month dan date onnly", this.monthdate)

    let date: any = this.monthdate
    console.log("month date select field", this.monthdate)



    let month = parseInt(this.datepipe.transform(date.value, "MM"));
    let year = parseInt(this.datepipe.transform(date.value, "yyyy"));

    let presentMonthAndYear = new Date();
    let getpresentMonthForValidation = presentMonthAndYear.getMonth() + 1;
    let getpresentyearForValidation = presentMonthAndYear.getFullYear();


    if (date == "" || date == null || date == undefined) {
      this.toastr.warning('Note: Current Month & Year and Future Month and Year also not valid', 'Please Select the Correct Year and Month. ', { timeOut: 1500 });
      return false
    }

    if (sgAdminAttendance.branch_id === "") {
      this.toastr.warning('', 'Please Select the Branch', { timeOut: 1500 });
      return false
    }
    if (sgAdminAttendance.premise_id === "") {
      this.toastr.warning('', 'Please Select the Premises', { timeOut: 1500 });
      return false
    }
    if (sgAdminAttendance.agency_id === "") {
      this.toastr.warning('', 'Please Select the Agency', { timeOut: 1500 });
      return false
    }


    console.log("month and year", month, year)
    let objToSubmit = {
      premise_id: this.isAttendanceAdmin.value?.premise_id?.id,
      month: month,
      year: year,
      branch_id: this.isAttendanceAdmin.value?.branch_id?.id,
      vendor_id: this.isAttendanceAdmin.value?.agency_id?.id
    }
    let objToShow = {
      premise_id: this.isAttendanceAdmin.value?.premise_id.name,
      month: month,
      year: year,
      branch_id: this.isAttendanceAdmin.value?.branch_id.name,
      vendor_id: this.isAttendanceAdmin.value?.agency_id.name
    }
    console.log("objToShow", objToShow)
    this.AttendanceSummary = objToShow
    console.log("att search dataaaa", this.AttendanceSummary)

    this.sgservice.getattendacedetailsSGAdmin(objToSubmit)
      .subscribe(results => {
        let data = results['data']
        this.AttendanceShowData = data
        if (this.AttendanceShowData?.length == 0) {
          this.notification.showWarning('No data Found')
          return false
        }
        else{
          this.submitclickAttendance = false 
        }

        // console.log("data[0]?.approval_data?.approval_status?.status", data[0]?.approval_data?.approval_status?.status)
        // this.StatusShowSG_Admin = data[0]?.approval_data
        // if (!('key' in this.StatusShowSG_Admin)){
        //   this.ShowOrHideTable = false 

        // }else{
        //   this.ShowOrHideTable = true 
        // }


      })

  }

  BranchDataList: any
  BranchCertificationShow: any
  submitclickbranch: boolean = false 
  getbranchCert() {

    let sgAdminBranch = this.isBranchcertificationAdmin.value

    if (sgAdminBranch.branch_id === "") {
      this.toastr.warning('', 'Please Select the Branch', { timeOut: 1500 });
      return false
    }
    if (sgAdminBranch.premise_id === "") {
      this.toastr.warning('', 'Please Select the Premises', { timeOut: 1500 });
      return false
    }

    let date: any = this.monthdate_bc
    console.log("month date select field", this.monthdate_bc)



    let month = parseInt(this.datepipe.transform(date.value, "MM"));
    let year = parseInt(this.datepipe.transform(date.value, "yyyy"));

    console.log("month", month)

    let objToSubmit = {
      branch_id: sgAdminBranch.branch_id.id,
      premise_id: sgAdminBranch.premise_id.id,
      month: month,
      year: year,
      is_admin: 1

    }

    let objToShow = {
      branch_id: sgAdminBranch.branch_id.name,
      premise_id: sgAdminBranch.premise_id.name,
      month: month,
      year: year
    }
    this.BranchCertificationShow = objToShow

    this.sgservice.getBranchdetailsSGAdmin(objToSubmit)
      .subscribe(results => {
        let data = results['data']
        this.BranchDataList = data
        console.log("this.BranchCertificationShow", this.BranchCertificationShow)
        if (this.BranchDataList?.length == 0) {
          this.notification.showWarning('No data found')
          return false
        }
        else{
          this.submitclickbranch = false
        }

      })








  }


  InvoiceDataList: any
  InvoiceDataShow: any
  submitclickinvoice: boolean = false 

  getInvoiceData() {



    let sgAdmininvoice = this.isInvoiceAdmin.value

    if (sgAdmininvoice.branch_id === "") {
      this.toastr.warning('', 'Please Select the Branch', { timeOut: 1500 });
      return false
    }
    if (sgAdmininvoice.premise_id === "") {
      this.toastr.warning('', 'Please Select the Premises', { timeOut: 1500 });
      return false
    }

    let date: any = this.monthdate_In
    console.log("month date select field", this.monthdate_In)



    let month = parseInt(this.datepipe.transform(date.value, "MM"));
    let year = parseInt(this.datepipe.transform(date.value, "yyyy"));

    console.log("month", month)

    let objToSubmit = {
      branch_id: sgAdmininvoice.branch_id.id,
      premise_id: sgAdmininvoice.premise_id.id,
      month: month,
      year: year,
      is_admin: 1
    }

    let objToShow = {
      branch_id: sgAdmininvoice.branch_id.name,
      premise_id: sgAdmininvoice.premise_id.name,
      month: month,
      year: year
    }
    this.InvoiceDataShow = objToShow

    this.sgservice.getinvoicedetailsSGAdmin(objToSubmit)
      .subscribe(results => {
        let data = results['data']
        this.InvoiceDataList = data
        console.log("this.InvoiceDataShow", this.InvoiceDataShow)
        if (this.InvoiceDataList?.length == 0) {
          this.notification.showWarning('No data found')
          return false
        }
        else{
          this.submitclickinvoice = false 
        }

      })















  }

















  submitclickAttendance: boolean = false

  UpdateDeavtivateStatus(type, dataID, reason) {

    console.log("type", type)
    console.log("id data", dataID)
    console.log("reason data", reason)


    // console.log("id data", dataID.approval_data.id)
    if( reason == '' || reason == null || reason == undefined ){
      this.notification.showWarning("Please fill reason")
      return false
    }
    let obj;
    let idget;
    if (type == 7) {
      idget = dataID?.approval_data?.id
      if (idget == null || idget == undefined || idget == "") {
        this.notification.showWarning("Data Not Found Against this Month")
        return false
      }
    }
    if (type == 8) {
      idget = dataID?.id
      if (idget == null || idget == undefined || idget == "") {
        this.notification.showWarning("Data Not Found Against this Month")
        return false
      }
    }

    if (type == 9) {
      idget = dataID?.id
      if (idget == null || idget == undefined || idget == "") {
        this.notification.showWarning("Data Not Found Against this Month")
        return false
      }
    }
    let dataPrompt = confirm("Are you sure, do you want to deactivate?")
    if(dataPrompt == true){
    obj = {
      id: idget,
      type: type,
      reason: reason
    }
    this.submitclickAttendance = true
    this.submitclickinvoice = true 
    this.submitclickbranch = true  

    this.sgservice.SGAdminDeactivate(obj)
      .subscribe(results => {
        if (results.code) {
          this.notification.showWarning(results.code)
          this.submitclickAttendance = false 
          this.submitclickinvoice = false  
          this.submitclickbranch = false   
          return false
        }
        else {
          this.notification.showSuccess("Successfully Updated")
        }
      })
    }
    else{
      this.submitclickAttendance = false
      this.submitclickinvoice = false 
      this.submitclickbranch = false  
    }


  }












































  /////////////////////////////////////////////////////////////////// get function-attendance
  branchlist: any
  isLoadingbranch = false
  isLoading = false

  brachname() {
    let a = this.branchContactInput.nativeElement.value
    this.sgservice.getAllBranch(a, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;
      })

  }


  getbranch() {
    this.sgservice.getAllBranch("", 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;
      })
  }

  clearPremisesAndAgency() {
    this.clear_premises.nativeElement.value = '';
    this.clear_agency.nativeElement.value = '';
  }
  public displaybranch(producttype?: branchlistss): string | undefined {
    return producttype ? "(" + producttype.code + ") " + producttype.name : undefined;
  }

  premise_list: any;
  branchFocusOut(data) {
    this.premisesArray = [];
    this.premise_list = data.premise;
    // this.branch_IID =data.id;
    //premises array
    for (let i = 0; i < this.premise_list.length; i++) {
      let premise_id = this.premise_list[i].id
      this.premisesArray.push(premise_id)
    }
    console.log("premisesArray", this.premisesArray)
    this.getprimes()

  }


  premiseFocusOut(data) {
    console.log("premises-- focusout", data)
    // this.isPremisesAddress = true;
    // this.premisesname = "(" +data.code+") "+data.name
    // this.updatelineName1 = data.address.line1;
    // this.updatelineName2 = data.address.line2;
    // this.updatelineName3 = data.address.line3;
    // this.updatecityName = data.address.city.name;
    // this.updatedistrictName = data.address.district.name;
    // this.updatestateName = data.address.state.name;
    // this.updatepinCode = data.address.pincode.no;
    this.agencyArray = [];
    let premiseId = data.id;
    //agency array
    for (let i = 0; i < this.premise_list.length; i++) {
      if (premiseId == this.premise_list[i].id) {
        this.agencyArray = this.premise_list[i].vendor
      }

    }
    console.log("agencyArray", this.agencyArray)
    this.getcatven()

    this.isAttendanceAdmin.controls['agency_id'].reset('')

  }





  // vendor
  empvendorlist: any
  productname() {
    let a = this.VendorContactInput.nativeElement.value
    this.sgservice.getAgency(this.agencyArray, a)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.empvendorlist = datas;
      })

  }
  getcatven() {
    this.sgservice.getAgency(this.agencyArray, "")
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.empvendorlist = datas;

      })
  }

  public displaydis(producttype?: productlistss): string | undefined {
    // return producttype ? producttype.name : undefined;
    return producttype ? "(" + producttype.code + ") " + producttype.name : undefined;

  }



  // primes


  primeslist: any
  isLoadingprimes = false

  primiesname() {
    let a = this.PremiseContactInput.nativeElement.value
    this.sgservice.getpremises(this.premisesArray, a, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.primeslist = datas;


      })


  }
  getprimes() {
    this.sgservice.getpremises(this.premisesArray, "", 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.primeslist = datas;

      })
    this.empvendorlist = [];
  }

  public displayprimes(producttype?: primeslistss): string | undefined {
    return producttype ? "(" + producttype.code + ") " + producttype.name : undefined;

  }

  currentpagebra: any = 1
  has_nextbra: boolean = true
  has_previousbra: boolean = true
  autocompletebranchnameScroll() {

    setTimeout(() => {
      if (
        this.matAutocompletebrach &&
        this.autocompleteTrigger &&
        this.matAutocompletebrach.panel
      ) {
        fromEvent(this.matAutocompletebrach.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletebrach.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletebrach.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletebrach.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletebrach.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbra === true) {
                this.sgservice.getAllBranch(this.branchContactInput.nativeElement.value, this.currentpagebra + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchlist = this.branchlist.concat(datas);
                    if (this.branchlist.length >= 0) {
                      this.has_nextbra = datapagination.has_next;
                      this.has_previousbra = datapagination.has_previous;
                      this.currentpagebra = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  // Premies dropdown
  currentpagepre: any = 1
  has_nextpre: boolean = true
  has_previouspre: boolean = true
  autocompletePremisenameScroll() {

    setTimeout(() => {
      if (
        this.matAutocompletepremise &&
        this.autocompleteTrigger &&
        this.matAutocompletepremise.panel
      ) {
        fromEvent(this.matAutocompletepremise.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletepremise.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletepremise.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletepremise.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletepremise.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextpre === true) {
                this.sgservice.getpremises(this.premisesArray, this.PremiseContactInput.nativeElement.value, this.currentpagepre + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.primeslist = this.primeslist.concat(datas);
                    if (this.primeslist.length >= 0) {
                      this.has_nextpre = datapagination.has_next;
                      this.has_previouspre = datapagination.has_previous;
                      this.currentpagepre = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }






















  // ///////////////////////////////////////////// branch certification
  branchname() {
    let a = this.branchContactInput.nativeElement.value
    this.sgservice.getAllBranch(a, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;
      })


  }
  getbranchid() {
    this.sgservice.getAllBranch("", 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;

      })
  }

  public displaydiss2(branchtype?: branchList): string | undefined {
    return branchtype ? "(" + branchtype.code + " )" + branchtype.name : undefined;

  }

  branchRecord: any;
  premisesArray_bc = [];
  branchFocusOut_bc(data) {
    this.branchRecord = data
    this.premisesArray_bc = [];
    let list = data.premise;
    for (let i = 0; i < list.length; i++) {
      let premise_id = list[i].id
      this.premisesArray_bc.push(premise_id)
    }
    console.log("premisesArray-bc", this.premisesArray_bc)
    this.getpremiseid()
  }

  clearPremises() {
    this.clear_premises.nativeElement.value = '';

  }
  premisename() {
    let a = this.PremiseContactInput.nativeElement.value
    this.sgservice.getpremises(this.premisesArray_bc, a, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.premiselistt = datas;

      })


  }
  getpremiseid() {
    this.sgservice.getpremises(this.premisesArray_bc, "", 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.premiselistt = datas;

      })
  }

  public displaydiss1(producttype?: premiseList): string | undefined {
    return producttype ? "(" + producttype.code + " )" + producttype.name : undefined;

  }

  premiseRecord: any;
  premiseFocusOut_bc(data) {
    this.premiseRecord = data
  }






}
