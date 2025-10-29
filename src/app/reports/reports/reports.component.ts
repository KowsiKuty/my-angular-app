import { Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ReportserviceService } from '../reportservice.service';
import { RemsService } from 'src/app/rems/rems.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, share } from 'rxjs/operators';
import { takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { isBoolean } from 'util';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/service/shared.service';
import { Rems2Service } from 'src/app/rems/rems2.service';
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from 'src/environments/environment'
import { ErrorHandlingService } from 'src/app/rems/error-handling.service';
import { NgbCarouselConfig } from "@ng-bootstrap/ng-bootstrap";
import { NotificationService } from "src/app/service/notification.service";

const isSkipLocationChange = environment.isSkipLocationChange

export interface usageCode {
  id: number;
  name: string;
  code: string;
}
class branchSearchtype {
  occupancy_usagecode: number

}
export interface EmployeeName {
  id: number;
  full_name: string;
}
export interface DepartmentName {
  id: number;
  name: string;
}
export interface stateList {
  name: string;
  id: number;
}
export interface RentDo {
  id: number;
  name: string;
  code: string;
}
export interface RentBranch {
  id: number;
  name: string;
  code: string;
}
export interface holdrentstateList {
  name: string;
  id: number;
}
export interface holdRentDo {
  id: number;
  name: string;
  code: string;
}
export interface holdRentBranch {
  id: number;
  name: string;
  code: string;
}
export interface ownedstateList {
  name: string;
  id: number;
}
export interface ownedDo {
  id: number;
  name: string;
  code: string;
}
export interface ownedBranch {
  id: number;
  name: string;
  code: string;
}
export interface parnolistss {
  id: any;
  no: string;
}
export interface mepnoLists {
  no: string;
  id: number;
}
class provisionSearchtype {
  type: string;
  premise_name: string;
  premise_type: any;
  rnt_no: string;
  ro_no: string;

  controlling_ofz_id: number;
  occupancy_name_id: number;
  occupancy_type: number;
 
  landlord_name: string;
  landlord_type: string;
  schedule_to_date: string;
}

class leaseSearchtype {
  type: string;
  branchcode: any;
  premise_name: string;
  premise_type: any;
  agreement_status: string;

  controlling_ofz_id: string;
  occupancy_name_id: string;
  usage_id: any;
  terminal_id: string;

  landlord_name: string;
  landlord_status: any;
  landlord_type: any;
  vacation_date: string;

  lease_start_date: string;
  lease_end_date: string;
  relaxation_start_date: string;
  relaxation_end_date: string;
  schedule_status: string;
}

class beforeRunSearchtype {
  type: string;
  premise_name: string;
  premise_type: any;
  agreement_status: string;

  controlling_ofz_id: string;
  schedule_from_date: string;
  schedule_to_date: string;
  regular : boolean;
  upfront : boolean;
}

class afterRunSearchtype {
  type: string;
  premise_name: string;
  premise_type: any;
  agreement_status: string;

  controlling_ofz_id: string;
  schedule_from_date: string;
  schedule_to_date: string;
  regular : boolean;
  upfront : boolean;
}

class premiseSearchtype {
  type: string;
  premise_name: string;
  premise_type: any;
  premise_status: string;

  controlling_ofz_id: string;
  occupancy_name_id: string;
  occupancy_type: string;
 
  lease_start_date: string;
  lease_end_date: string;
  premises_sqft: number;
  city_name: string;
  district_name: string;
  state_id: any;
}

class masterSearchtype {
  type: string;
  premise_name: string;
  premise_type: any;
  agreement_status: string;

  controlling_ofz_id: string;
  occupancy_name_id: string;
  occupancy_type: string;
 
  lease_start_date: string;
  lease_end_date: string;
  term_from_date: string;
  term_to_date: string;
  landlord_name: string;
  landlord_type: any;
  regular : boolean;
  upfront : boolean;
}

class paymentSearchtype {
  type: string;

  premise_name: string;
  premise_type: any;
  occupancy_type: string;
  paid_status: string;
  
  lease_start_date: string;
  lease_end_date: string;
  schedule_from_date: string;
  schedule_to_date: string;

  landlord_name: string;
  landlord_type: any;
  RNT_No: string;
  ro_number: string;
  
  controlling_ofz_id: any;
  landlord_share_amt: string;
}

export interface branchLists {
  id: number;
  name: string;
  code: string;
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


class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
export interface branchlistss {
  id: any;
  code: string;
  name: string;
}
export interface depttypelistss {
  id: any
  code: any
  name: any
}
declare var bootstrap: any;

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
    providers: [
      { provide: DateAdapter, useClass: PickDateAdapter },
      { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
      DatePipe
    ]
  })
  export class ReportsComponent implements OnInit {
    url = environment.apiURL
    @ViewChild('usagecode') matAutocomplete: MatAutocomplete;
    @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
    @ViewChild('rmInput') rmInput: any;
  
    @ViewChild('autoPrimary') matAutocompleteEmp: MatAutocomplete;
    @ViewChild('primaryContactInput') primaryContactInput: any;
  
    @ViewChild('autoDept') matAutocompleteDept: MatAutocomplete;
    @ViewChild('deptInput') deptInput: any;
  
    @ViewChild('statetype') matAutocompleteStateRent: MatAutocomplete;
    @ViewChild('rentsateInput') rentsateInput: any;
  
    @ViewChild('rentdo') matAutocompleteRentDo: MatAutocomplete;
    @ViewChild('rentdoInput') rentdoInput: any;
  
    @ViewChild('rentbranch') matAutocompleteRentBranch: MatAutocomplete;
    @ViewChild('rentbranchInput') rentbranchInput: any;
  
    @ViewChild('stateholdrent') matAutocompleteStateHoldRent: MatAutocomplete;
    @ViewChild('holdrentsateInput') holdrentsateInput: any;
  
    @ViewChild('holdrentdo') matAutocompleteHoldRentDo: MatAutocomplete;
    @ViewChild('holdrentdoInput') holdrentdoInput: any;
  
    @ViewChild('holdrentbranch') matAutocompleteHoldRentBranch: MatAutocomplete;
    @ViewChild('holdrentbranchInput') holdrentbranchInput: any;
  
    @ViewChild('stateowned') matAutocompleteStateOwned: MatAutocomplete;
    @ViewChild('stateownedInput') stateownedInput: any;
  
    @ViewChild('owneddo') matAutocompleteOwnedDo: MatAutocomplete;
    @ViewChild('owneddoInput') owneddoInput: any;
  
    @ViewChild('ownedbranch') matAutocompleteOwnedBranch: MatAutocomplete;
    @ViewChild('ownedbranchInput') ownedbranchInput: any;
  
    @ViewChild('stateleaseagreement') matAutocompleteStateleaseagreement: MatAutocomplete;
    @ViewChild('stateleaseagreementInput') stateleaseagreementInput: any;
  
    @ViewChild('leaseagreementdo') matAutocompleteleaseagreementDo: MatAutocomplete;
    @ViewChild('leaseagreementdoInput') leaseagreementdoInput: any;
  
    @ViewChild('leaseagreementbranch') matAutocompleteleaseagreementBranch: MatAutocomplete;
    @ViewChild('leaseagreementbranchInput') leaseagreementbranchInput: any;
  
    @ViewChild('stateexpiredagreement') matAutocompleteStateexpiredAgreement: MatAutocomplete;
    @ViewChild('stateexpiredagreementInput') stateexpiredagreementInput: any;
  
    @ViewChild('expiredagreementdo') matAutocompleteexpiredAgreementDo: MatAutocomplete;
    @ViewChild('expiredagreementdoInput') expiredagreementdoInput: any;
  
    @ViewChild('expiredagreementbranch') matAutocompleteexpiredAgreementBranch: MatAutocomplete;
    @ViewChild('expiredagreementbranchInput') expiredagreementbranchInput: any;
    @ViewChild('assetid') matassetidauto:MatAutocomplete;
    @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger
    @ViewChild('inputassetid') inputasset:any;
  
    @ViewChild('branchType') matBrAutocomplete: MatAutocomplete;
    @ViewChild('brInput') brInput: any;
  
    value:any
    radiocheck: any[] = [
      { value: 1, display: 'Self' },
      { value: 0, display: 'Other' }
    ]
    p: number = 1;
    itemsPerPage = 10;
    hasres_next : boolean = true;
    hasres_previous : boolean = true;
  
    has_next = true;
    has_previous = true;
    currentpage: number = 1;
    presentpage: number = 1;
    has_employeenext = true;
    has_employeeprevious = true;
    employeecurrentpage: number = 1;
    employeeNameList: any;
  
    has_deptnext = true;
    has_deptprevious = true;
    deptcurrentpage: number = 1;
    deptNameList: any;
    
    ownedPremiseSearch: FormGroup;
    TourExpenseReport: FormGroup;
    leasedPremiseSearch: FormGroup;
    activePremiseSearch: FormGroup;
    terminatedPremiseSearch: FormGroup;
    rentReportSearch: FormGroup;
    holdRentReportSearch: FormGroup;
    usageCodeSearch: FormGroup;
    employeenameSearch: FormGroup;
    departmentNameSearch: FormGroup;
    regReportSearch: FormGroup;
    unregReportSearch: FormGroup;
    nriReportSearch: FormGroup;
    agreeReportSearch: FormGroup;
    expReportSearch: FormGroup;
    typeReportSearch: FormGroup;
    closedReportSearch: FormGroup;
    usagecodeReportSearch: FormGroup;
    buildReportSearch: FormGroup;
    Branchform:FormGroup;
    TourDetailReport:FormGroup;
    deptReportSearch: FormGroup;
    Consolidateform:FormGroup;
    empReportSearch: FormGroup;
    Advanceform:FormGroup;
    approvedReportSearch: FormGroup;
    advanceform:FormGroup;
    Employeeform:FormGroup;
    pendingReportSearch: FormGroup;
    closedMemoReportSearch: FormGroup;
    editReportSearch: FormGroup;
    reviewReportSearch: FormGroup;
    RcnReportSearch: FormGroup;
    POReportExcel: FormGroup;
    ProcurementeportExcel : FormGroup;
    TourReport: FormGroup;
    expiredRentScheduleSearch: FormGroup;
    InwardOverallReport: FormGroup;
    dropDownTag:any
    selected:any
    ispremise:boolean
    procurementReportVisible: boolean = false;
    activeTab: string = 'Reports';
    ispremiseown:boolean
    isconsolidateReport:boolean
    ispremiselea:boolean
    ispremiseactive:boolean
    ispremiseterminated:boolean
    isoccuown:boolean
    isProcurementList:boolean
    isocculea:boolean
    isrentown:boolean
    isrentlea:boolean
    isExpiredRentSchedule:boolean
    islandown:boolean
    islandlea:boolean
    isClosedOccpancy:boolean
    isOccpancyUsageType:boolean
    isOccpancyUsageCode:boolean
    isHoldRent:boolean
    isUnregLandlord:boolean
    isNRILandlord:boolean
    isExpiredAgree:boolean
    isBuilding:boolean
    isRCN:boolean
    isProvisionReport:boolean
    isLeaseReport:boolean=false
    isBeforeRunReport:boolean
    isAfterRunReport:boolean=false
    isPremiseReport:boolean=false
    isMasterReport:boolean=false
    isPaymentReport:boolean=false
    MemoShow: boolean = false 
    ProvisionReportScreen: boolean = false 
    isPOReport:boolean
    isPODetReportform:boolean
    isPOAssetReportform:boolean
  
    frmPODetRpt : FormGroup;
    isTourReport:boolean=false
    occupancy:boolean
    rent:boolean
    agreement:boolean
  
    identificationData: any;
    ownedPremiseList: any;
    leasedPremiseList: any;
    activePremiseList: any;
    terminatedPremiseList: any;
    atmList: any;
    branchList: any;
    closedOccList: any;
    occUsageTypeList: any;
    occUsageCodeList: any;
    rentList: any;
    Procurement:boolean=false;
    landLordList: any;
    UnRegLandLordList: any;
    NRILandLordList: any;
    agreementList: any;
    holdRentList: any;
    expiredRentScheduleList: any;
    expAgreementList: any;
    premiseList: any;
    usageType: any;
    isLoading = false;
    UsageCodeData: any;
    isBranchpendingdetail:boolean
    isType:boolean;
    isAdvancedetail:boolean=false
    isemployereport:boolean
    isOccupancy:boolean;
    isRent:boolean;
    isLandlord:boolean;
    isAgreement:boolean;
  
    isMemo: boolean;
    isdept: boolean;
    isemp: boolean;
    isapproved: boolean;
    isclosed: boolean;
    ispending: boolean;
    isedit: boolean;
    isreview: boolean;
    isExpensedetail:boolean=false
    deptList: any;
    empList: any;
    approvedmemoList: any;
    pendingmemoList: any;
    closedmemoList: any;
    editList: any;
    reviewList: any;
    isMemoType: boolean;
    isTourdetail:boolean=false
  
    stateList: any;
    rentDoList: any;
    rentBranchList: any;
    stateholdrentList: any;
    holdrentDoList: any;
    holdrentBranchList: any;
    stateownedList: any;
    owneddoList: any;
    ownedbranchList: any;
    stateleasedList: any;
    leaseddoList: any;
    leasedbranchList: any;
    stateActiveList: any;
    activedoList: any;
    activebranchList: any;
    stateTerminatedList: any;
    terminateddodoList: any;
    terminatedbranchList: any;
    stateleaseagreementList: any;
    leaseagreementdoList: any;
    leaseagreementbranchList: any;
    stateexpiredagreementList: any;
    expiredagreementdoList: any;
    expiredagreementbranchList: any;
    stateregList: any;
    regdoList: any;
    regbranchList: any;
    stateunregList: any;
    unregdoList: any;
    unregbranchList: any;
    statenriList: any;
    nridoList: any;
    nribranchList: any;
    stateclosedoccupancyList: any;
    closedoccupancydoList: any;
    closedoccupancybranchList: any;
    stateoccupancytypeList: any;
    occupancytypedoList: any;
    occupancytypebranchList: any;
    RcnReportList: any
    RCNMenuList:any
    has_nextid: boolean = true;
    has_presentid: number = 1;
    branchpresentpage: number = 1;
    isBranchuser_ownedPremises = true;
    isBranchuser_leasedPremises = true;
    isBranchuser_activePremises = true;
    isBranchuser_terminatedPremises =  true;
    isBranchuser_occuType = true;
    isBranchuser_closedoccupancy = true;
    isBranchuser_rent = true;
    isBranchuser_rentonhold = true;
    isBranchuser_reglandlord = true;
    isBranchuser_unreglandlord = true;
    isBranchuser_nri = true;
    isBranchuser_leaseagree = true;
    isBranchuser_Expiredagree = true;
    iMasterList: any;
    inwardReportTab: boolean = false 
    
  
    typeList = [{ id: 1, text: "Owned Premises" }, { id: 2, text: "Leased Premises" }, { id: 18, text: "Active Premises" }, { id: 19, text: "Terminated Premises" }]
    occupancyList = [{ id: 6, text: "Occupancy Type" }, { id: 15, text: "Occupancy Usage Code" }, { id: 5, text: "Closed Occupancy" }]
    rentdropdownList = [{ id: 7, text: "Rent" }, { id: 8, text: "Rent on Hold" }, { id: 17, text: "Expired Rent Schedule" }]
    landlordList = [{ id: 9, text: "Registered Landlord" }, { id: 10, text: "Unregistered Landlord" }, { id: 11, text: "NRI Landlord" }]
    agreementdropdownList = [{ id: 12, text: "Lease Agreement" }, { id: 13, text: "Expired Lease Agreement" }]
    nextmonthList = [{ id: 1, text: "1" }, { id: 2, text: "2" },{ id: 3, text: "3" },
    { id: 4, text: "4" },{ id: 2, text: "5" },{ id: 6, text: "6" }]
  
    memoList = [{ id: 1, text: "Department" }, { id: 2, text: "Employee" }, { id: 3, text: "Approved Memo" },
    { id: 4, text: "Pending Memo" }, { id: 5, text: "Closed Memo" },{ id: 6, text: "Edit and resubmitted Memo" },
    { id: 7, text: "Review and resubmitted Memo" }]
  
    memoTypeList = [{ id: 1, text: "Inter Office Memo" }, { id: 2, text: "Note for Approval" }]
    branchlist: any;
    branchid: any;
    employeelist: any[];
    tourno: any;
    empgid: any;
    gettourreportList: any;
    tourrequestno: any;
    gettourdetailreportList: any;
    gettourexpensereportList: any;
    touradvancee: any;
    requestno: any;
    requestdate: any;
    startdate: string;
    enddatee: string;
    reason: any;
    branch: any;
    branchemployee: any;
    getbranchwiseList: any;
    getempreportList: any;
    id: any;
    getconsolidateList: any;
    pagesize = 10;
    approvalflowlist: any;
    tourid: any;
    employee_name: any;
    tourgid: any;
    expensename: any;
    isDisabled: boolean;
    isEnable: boolean;
    vendor_flage: boolean;
    vendor_report=false;
    trial_balance=false;
  
    ProvisionSearchForm: FormGroup;
    ProvisionList: any;
    searchtype: any
    BranchCode: any;
    premisedropList: any
    premisesTypeData: any;
    landlordTypeData: any;
    isProvisionList : boolean
    today = new Date();
    fileid : any;
    file_name : any;
    downloadDisable = true;
  
    LeaseSearchForm: FormGroup;
    LeaseList: any;
    isLeaseList : boolean;
    Status: any;
   
    beforeRunSearchForm: FormGroup;
    beforeRunList: any=[]
    isBeforeRunList : boolean
  
    afterRunSearchForm: FormGroup;
    afterRunList: any=[]
    isAfterRunList : boolean
  
    PremiseSearchForm: FormGroup;
    premiseReportList: any=[]
    isPremiseList : boolean
    premiseStatus : any;
  
    MasterSearchForm: FormGroup;
    masterReportList: any=[]
    isMasterList : boolean
  
    PaymentSearchForm: FormGroup;
    paymentReportList: any=[]
    isPaymentList : boolean
    isprocurementslist : boolean
  
    getCatlog_NonCatlogList: any;	
    expensetype: any;
    presentpageres:number=1;
    pageSize: number = 10;
    wisefinTbUpload: FormGroup;
  grndetailreport: boolean;
  isGRNReportform: boolean;
    
    constructor( private router: Router, private fb: FormBuilder,private datePipe: DatePipe, private sharedService: SharedService,
        private reportService: ReportserviceService, private h1: RemsService, private remsService2: Rems2Service, 
        private toastr: ToastrService, private SpinnerService: NgxSpinnerService,private errorHandler: ErrorHandlingService,
            private notification: NotificationService,) { 
           
      // this.PODetRptButtons = [
      //     {
      //       icon: "add", "tooltip": "Add",
      //       function: this.PODetRptAdd.bind(this)
      //     }, 
      // ] 
        }
  
    ngOnInit(): void {
      this.moduleGet()
      this.getprpoReports()

      let datas = this.sharedService.menuUrlData;
      datas.forEach((element) => {
        let subModule = element.submodule;
        if (element.name === "REMS") {
          this.iMasterList = subModule;
    
  
        }
        for(let i = 0; i < element.role.length; i++){
          if (element.role[i].name === "Branch_User"){
            this.isBranchuser_ownedPremises = false;
            this.isBranchuser_leasedPremises = false;
            this.isBranchuser_activePremises = false;
            this.isBranchuser_terminatedPremises = false;
            this.isBranchuser_occuType = false;
            this.isBranchuser_closedoccupancy = false;
            this.isBranchuser_rent = false;
            this.isBranchuser_rentonhold = false;
            this.isBranchuser_reglandlord = false;
            this.isBranchuser_unreglandlord = false;
            this.isBranchuser_nri = false;
            this.isBranchuser_leaseagree = false;
            this.isBranchuser_Expiredagree = false;
            console.log('role??', element.role[i].name)
            break;
          }
    
        }
      });
  
      this.ownedPremiseSearch = this.fb.group({
        datefrom: [''],
        dateto: [''],
        state_owned: [''],
        do_owned:[{ value: "", enabled: isBoolean }],
        branch_owned: [{ value: "", enabled: isBoolean }],
      })
      this.leasedPremiseSearch = this.fb.group({
        datefrom1: [''],
        dateto1: [''],
        state_leased: [''],
        do_leased: [{ value: "", enabled: isBoolean }],
        branch_leased: [{ value: "", enabled: isBoolean }],
      })
      this.activePremiseSearch = this.fb.group({
        datefromactive: [''],
        datetoactive: [''],
        state_active: [''],
        do_active: [{ value: "", enabled: isBoolean }],
        branch_active: [{ value: "", enabled: isBoolean }],
      })
      this.terminatedPremiseSearch = this.fb.group({
        datefromterminated: [''],
        datetoterminated: [''],
        state_terminated: [''],
        do_terminated: [{ value: "", enabled: isBoolean }],
        branch_terminated: [{ value: "", enabled: isBoolean }],
      })
      this.rentReportSearch = this.fb.group({
        rentdatefrom: [''],
        rentdateto: [''],
        state_id:[''],
        // rent_do: [''],
        // rent_branch: [''],
        rent_do:[{ value: "", enabled: isBoolean }],
        rent_branch: [{ value: "", enabled: isBoolean }],
      })
      this.holdRentReportSearch = this.fb.group({
        holdRentdatefrom: [''],
        holdRentdateto: [''],
        state_holdrent:[''],
        holdrent_do:[{ value: "", enabled: isBoolean }],
        holdrent_branch:[{ value: "", enabled: isBoolean }],
      })
      this.regReportSearch = this.fb.group({
        regdatefrom: [''],
        regdateto: [''],
        state_reg:[''],
        do_reg:[{ value: "", enabled: isBoolean }],
        branch_reg:[{ value: "", enabled: isBoolean }],
      })
      this.unregReportSearch = this.fb.group({
        unregdatefrom: [''],
        unregdateto: [''],
        state_unreg:[''],
        do_unreg:[{ value: "", enabled: isBoolean }],
        branch_unreg:[{ value: "", enabled: isBoolean }],
      })
      this.nriReportSearch = this.fb.group({
        nridatefrom: [''],
        nridateto: [''],
        state_nri:[''],
        do_nri:[{ value: "", enabled: isBoolean }],
        branch_nri:[{ value: "", enabled: isBoolean }],
      })
      this.agreeReportSearch = this.fb.group({
        agreedatefrom: [''],
        agreedateto: [''],
        state_leaseagreement: [''],
        do_leaseagreement: [{ value: "", enabled: isBoolean }],
        branch_leaseagreement: [{ value: "", enabled: isBoolean }],
      })
      this.expReportSearch = this.fb.group({
        expdatefrom: [''],
        expdateto: [''],
        state_expiredagreement:[''],
        do_expiredagreement:[{ value: "", enabled: isBoolean }],
        branch_expiredagreement:[{ value: "", enabled: isBoolean }],
      })
      this.typeReportSearch = this.fb.group({
        typedatefrom: [''],
        typedateto: [''],
        state_occupancytype:[''],
        do_occupancytype:[{ value: "", enabled: isBoolean }],
        branch_occupancytype:[{ value: "", enabled: isBoolean }],
      }) 
      this.closedReportSearch = this.fb.group({
        closeddatefrom: [''],
        closeddateto: [''],
        state_closedoccupancy:[''],
        do_closedoccupancy:[{ value: "", enabled: isBoolean }],
        branch_closedoccupancy:[{ value: "", enabled: isBoolean }],
      }) 
      this.usagecodeReportSearch = this.fb.group({
        usagecodedatefrom: [''],
        usagecodedateto: [''],
      }) 
      this.buildReportSearch = this.fb.group({
        builddatefrom: [''],
        builddateto: [''],
      }) 
      this.usageCodeSearch = this.fb.group({
        occupancy_usagecode: [''],
      })
      this.deptReportSearch = this.fb.group({
        deptdatefrom: [''],
        deptdateto: [''],
      }) 
      this.empReportSearch = this.fb.group({
        empdatefrom: [''],
        empdateto: [''],
      }) 
      this.approvedReportSearch = this.fb.group({
        approveddatefrom: [''],
        approveddateto: [''],
      }) 
      this.pendingReportSearch = this.fb.group({
        pendingdatefrom: [''],
        pendingdateto: [''],
      }) 
      this.closedMemoReportSearch = this.fb.group({
        closedmemodatefrom: [''],
        closedmemodateto: [''],
      }) 
      this.editReportSearch = this.fb.group({
        editdatefrom: [''],
        editdateto: [''],
      }) 
      this.reviewReportSearch = this.fb.group({
        reviewdatefrom: [''],
        reviewdateto: [''],
      }) 
      this.employeenameSearch = this.fb.group({
        employee_name: [''],
      })
      this.departmentNameSearch = this.fb.group({
        department_name: [''],
      })
      this.RcnReportSearch = this.fb.group({
        from_date:[''],
        to_date:['']
      })
      this.POReportExcel = this.fb.group({
        from_date:[''],
        to_date:[''],        	
        mep_no:[''], 	
        par_no:[''],	
        type:['']
      })
      this.ProcurementeportExcel = this.fb.group({
        INdate:[''],       	
        INnumber:[''], 	
        ponumber:[''],
        par_no:[''],
        mep_no:[''],	
        // type:[''],
        empbranchgid:[''],
        pr_number:[''],
        po_number:['']
      })
      this.expiredRentScheduleSearch = this.fb.group({
        expiredRentSchefrom: [''],
        expiredRentScheto: [''],
        nextmonth: [''],
      })
      this.TourReport = this.fb.group({
        empbranchgid: [''],
        approval: [''],
        tourno:['']
      }) 
      this.TourDetailReport = this.fb.group({
     
      }) 
      this.TourExpenseReport = this.fb.group({
        
      }) 
      this.Advanceform=this.fb.group({
        
      })
      this.Branchform=this.fb.group({
        status:['']
      })
      this.Employeeform=this.fb.group({
        tourno:['']
      })
      this.Consolidateform=this.fb.group({
        tourno:['']
      })
      this.InwardOverallReport=this.fb.group({
        assignedto:'',
        from_date: new Date(),
        to_date: new Date(),
        awb_no: '',
        channel_id: '',
        courier_id: '',
        docaction: '',
        docstatus: '',
        doctype_id: '',
        branch_id: '',
        docnumber: '',
        inward_no: ''
  
      })
  
      this.ProvisionSearchForm = this.fb.group({
        premise_name: "",
        premise_type: "",
        rnt_no: "",
        ro_no: "",
  
        controlling_ofz_id: "",
        occupancy_name_id: "",
        occupancy_type: "",    
        landlord_name: "",
        landlord_type: "",
        schedule_to_date: "",
      })
    
      this.LeaseSearchForm = this.fb.group({
        branchcode: "",
        premise_name: "",
        premise_type: "",
        agreement_status: "",
  
        controlling_ofz_id: "",
        occupancy_name_id: "",
        usage_id: "",
        terminal_id: "",
  
        landlord_name: "",
        landlord_status: "",
        landlord_type: "",
        vacation_date: "",
  
        lease_start_date: "",
        lease_end_date: "",
        relaxation_start_date: "",
        relaxation_end_date: "",
        schedule_status: "",
        premiseCheck : "",
      })
  
      this.beforeRunSearchForm= this.fb.group({
        premise_name: "",
        premise_type: "",
        agreement_status: "",
        controlling_ofz_id: "",
        schedule_from_date: "",
        schedule_to_date: "",
        regular: "",
        upfront: "",
      })
  
      this.afterRunSearchForm= this.fb.group({
        premise_name: "",
        premise_type: "",
        agreement_status: "",
        controlling_ofz_id: "",
        schedule_from_date: "",
        schedule_to_date: "",
        regular: "",
        upfront: "",
      })
  
      this.PremiseSearchForm= this.fb.group({
        premise_name: "",
        premise_type: "",
        premise_status: "",
        controlling_ofz_id: "",
        occupancy_type: "",    
        occupancy_name_id: "",
        lease_start_date: "",
        lease_end_date: "",
        premises_sqft: "",
        city_name: "",
        district_name: "",
        state_id: "",
      })
  
  
      this.MasterSearchForm= this.fb.group({
        premise_name: "",
        premise_type: "",
        agreement_status: "",
        controlling_ofz_id: "",
        occupancy_type: "", 
        lease_start_date: "",
        lease_end_date: "",
        term_from_date: "",
        term_to_date: "", 
        landlord_name: "",
        landlord_type: "",
        occupancy_name_id: "",
        regular : "",
        upfront : "",
      })
  
  
      this.PaymentSearchForm= this.fb.group({
        premise_name: "",
        premise_type: "",
        paid_status: "",
        occupancy_type: "", 
        
        controlling_ofz_id: "",
        landlord_share_amt: "",
        schedule_from_date: "",
        schedule_to_date: "",
        landlord_name: "",
        landlord_type: "",
        RNT_No: "",
        ro_number: "",
      })
  
  
      let rmkeyvalue: String = "";
      this.getUsageCodee(rmkeyvalue);
      this.getbranchValue();
      this.usageCodeSearch.get('occupancy_usagecode').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
          switchMap(value => this.reportService.getusageSearchFilter(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.UsageCodeData = datas;
  
        })
  
  
      let primaykey: String = "";
      this.employeeName(primaykey);
      this.employeenameSearch.get('employee_name').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.reportService.getEmployeeFilter(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.employeeNameList = datas;
        })
        this.TourReport.get('empbranchgid').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.reportService.getUsageCode(value, 1))
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.branchlist = datas;
          console.log("Branch List",this.branchlist)
        });
  
      let primaykey1: String = "";
      this.departmentName(primaykey1);
      this.departmentNameSearch.get('department_name').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.reportService.getDepartmentFilter(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.deptNameList = datas;
        })
  
  
      let statekeyvalue: String = "";
      this.getState(statekeyvalue);
      this.rentReportSearch.get('state_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.reportService.getStateDropDownRent(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.stateList = datas;
  
        })
  
  
      let rentdo: String = "";
      this.getRentDo(rentdo);
      this.rentReportSearch.get('rent_do').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
          }),
          switchMap(value => this.reportService.getusageSearchFilter(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.rentDoList = datas;
          console.log("rentDoList", datas)
          // this.rentReportSearch.get('rent_branch').disable();
  
        })
  
  
      let rentbranch: String = "";
      this.getRentBranch(rentbranch);
      this.rentReportSearch.get('rent_branch').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
          }),
  
          switchMap(value => this.reportService.getusageSearchFilter(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.rentBranchList = datas;
          // this.rentReportSearch.get('rent_do').disable();
  
        })
  
      let stateHoldRent: String = "";
      this.getStateHoldRent(stateHoldRent);
      this.holdRentReportSearch.get('state_holdrent').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.reportService.getStateDropDownRent(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.stateholdrentList = datas;
  
        })
  
  
      let holdrentdo: String = "";
      this.getHoldRentDo(holdrentdo);
      this.holdRentReportSearch.get('holdrent_do').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.reportService.getusageSearchFilter(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.holdrentDoList = datas;
  
        })
  
  
      let holdrentbranch: String = "";
      this.getHoldRentBranch(holdrentbranch);
      this.holdRentReportSearch.get('holdrent_branch').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.reportService.getusageSearchFilter(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.holdrentBranchList = datas;
  
        })
  
  
      let stateowned: String = "";
      this.getStateOwned(stateowned);
      this.ownedPremiseSearch.get('state_owned').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.reportService.getStateDropDownRent(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.stateownedList = datas;
  
        })
  
  
      let owneddo: String = "";
      this.getOwnedDo(owneddo);
      this.ownedPremiseSearch.get('do_owned').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.reportService.getusageSearchFilter(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.owneddoList = datas;
  
        })
  
  
      let ownedbranch: String = "";
      this.getOwnedBranch(ownedbranch);
      this.ownedPremiseSearch.get('branch_owned').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.reportService.getusageSearchFilter(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.ownedbranchList = datas;
  
        })
  
      let stateleased: String = "";
      this.getStateLeased(stateleased);
      this.leasedPremiseSearch.get('state_leased').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.reportService.getStateDropDownRent(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.stateleasedList = datas;
  
        })
  
  
      let leaseddo: String = "";
      this.getLeasedDo(leaseddo);
      this.leasedPremiseSearch.get('do_leased').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.reportService.getusageSearchFilter(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.leaseddoList = datas;
  
        })
  
  
      let leasedbranch: String = "";
      this.getLeasedBranch(leasedbranch);
      this.leasedPremiseSearch.get('branch_leased').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.reportService.getusageSearchFilter(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.leasedbranchList = datas;
  
        })
  
  
  
        //active premises
      let stateactive: String = "";
      this.getStateActive(stateactive);
      this.activePremiseSearch.get('state_active').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.reportService.getStateDropDownRent(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.stateActiveList = datas;
  
        })
  
  
      let activedo: String = "";
      this.getActiveDo(activedo);
      this.activePremiseSearch.get('do_active').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.reportService.getusageSearchFilter(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.activedoList = datas;
  
        })
  
  
      let activebranch: String = "";
      this.getActiveBranch(activebranch);
      this.activePremiseSearch.get('branch_active').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.reportService.getusageSearchFilter(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.activebranchList = datas;
  
        })
  
  
      //terminated premises
      let stateterminated: String = "";
      this.getStateTerminated(stateterminated);
      this.terminatedPremiseSearch.get('state_terminated').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.reportService.getStateDropDownRent(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.stateTerminatedList = datas;
  
        })
  
  
      let terminateddo: String = "";
      this.getTerminatedDo(terminateddo);
      this.terminatedPremiseSearch.get('do_terminated').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.reportService.getusageSearchFilter(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.terminateddodoList = datas;
  
        })
  
  
      let terminatedbranch: String = "";
      this.getTerminatedBranch(terminatedbranch);
      this.terminatedPremiseSearch.get('branch_terminated').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.reportService.getusageSearchFilter(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.terminatedbranchList = datas;
  
        })
  
      let stateleaseagree: String = "";
      this.getStateLeaseAgree(stateleaseagree);
      this.agreeReportSearch.get('state_leaseagreement').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.reportService.getStateDropDownRent(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.stateleaseagreementList = datas;
  
        })
  
  
      let leaseagreedo: String = "";
      this.getLeaseAgreeDo(leaseagreedo);
      this.agreeReportSearch.get('do_leaseagreement').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.reportService.getusageSearchFilter(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.leaseagreementdoList = datas;
  
        })
  
  
      let leaseagreebranch: String = "";
      this.getLeaseAgreeBranch(leaseagreebranch);
      this.agreeReportSearch.get('branch_leaseagreement').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.reportService.getusageSearchFilter(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.leaseagreementbranchList = datas;
  
        })
  
        
      let stateexpireagree: String = "";
      this.getStateExpireAgree(stateexpireagree);
      this.expReportSearch.get('state_expiredagreement').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.reportService.getStateDropDownRent(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.stateexpiredagreementList = datas;
  
        })
  
  
      let expireagreedo: String = "";
      this.getExpireAgreeDo(expireagreedo);
      this.expReportSearch.get('do_expiredagreement').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.reportService.getusageSearchFilter(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.expiredagreementdoList = datas;
  
        })
  
  
      let expireagreebranch: String = "";
      this.getExpireAgreeBranch(expireagreebranch);
      this.expReportSearch.get('branch_expiredagreement').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.reportService.getusageSearchFilter(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.expiredagreementbranchList = datas;
  
        })
  
      let statereg: String = "";
      this.getStateReg(statereg);
      this.regReportSearch.get('state_reg').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.reportService.getStateDropDownRent(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.stateregList = datas;
  
        })
  
  
      let regdo: String = "";
      this.getregDo(regdo);
      this.regReportSearch.get('do_reg').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.reportService.getusageSearchFilter(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.regdoList = datas;
  
        })
  
  
      let regbranch: String = "";
      this.getregBranch(regbranch);
      this.regReportSearch.get('branch_reg').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.reportService.getusageSearchFilter(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.regbranchList = datas;
  
        })
  
  
        let stateunreg: String = "";
        this.getStateunReg(stateunreg);
        this.unregReportSearch.get('state_unreg').valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
              console.log('inside tap')
    
            }),
    
            switchMap(value => this.reportService.getStateDropDownRent(value)
              .pipe(
                finalize(() => {
                  this.isLoading = false
                }),
              )
            )
          )
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.stateunregList = datas;
    
          })
    
    
        let unregdo: String = "";
        this.getunregDo(unregdo);
        this.unregReportSearch.get('do_unreg').valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
              console.log('inside tap')
    
            }),
    
            switchMap(value => this.reportService.getusageSearchFilter(value)
              .pipe(
                finalize(() => {
                  this.isLoading = false
                }),
              )
            )
          )
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.unregdoList = datas;
    
          })
    
    
        let unregbranch: String = "";
        this.getunregBranch(unregbranch);
        this.unregReportSearch.get('branch_unreg').valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
              console.log('inside tap')
    
            }),
    
            switchMap(value => this.reportService.getusageSearchFilter(value)
              .pipe(
                finalize(() => {
                  this.isLoading = false
                }),
              )
            )
          )
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.unregbranchList = datas;
    
          })
  
          let statenri: String = "";
          this.getStateNri(statenri);
          this.nriReportSearch.get('state_nri').valueChanges
            .pipe(
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
                console.log('inside tap')
      
              }),
      
              switchMap(value => this.reportService.getStateDropDownRent(value)
                .pipe(
                  finalize(() => {
                    this.isLoading = false
                  }),
                )
              )
            )
            .subscribe((results: any[]) => {
              let datas = results["data"];
              this.statenriList = datas;
      
            })
      
      
          let nrido: String = "";
          this.getNriDo(nrido);
          this.nriReportSearch.get('do_nri').valueChanges
            .pipe(
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
                console.log('inside tap')
      
              }),
      
              switchMap(value => this.reportService.getusageSearchFilter(value)
                .pipe(
                  finalize(() => {
                    this.isLoading = false
                  }),
                )
              )
            )
            .subscribe((results: any[]) => {
              let datas = results["data"];
              this.nridoList = datas;
      
            })
      
      
          let nribranch: String = "";
          this.getnriBranch(nribranch);
          this.nriReportSearch.get('branch_nri').valueChanges
            .pipe(
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
                console.log('inside tap')
      
              }),
      
              switchMap(value => this.reportService.getusageSearchFilter(value)
                .pipe(
                  finalize(() => {
                    this.isLoading = false
                  }),
                )
              )
            )
            .subscribe((results: any[]) => {
              let datas = results["data"];
              this.nribranchList = datas;
      
            })
  
          let stateclosed: String = "";
          this.getStateClosed(stateclosed);
          this.closedReportSearch.get('state_closedoccupancy').valueChanges
            .pipe(
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
                console.log('inside tap')
      
              }),
      
              switchMap(value => this.reportService.getStateDropDownRent(value)
                .pipe(
                  finalize(() => {
                    this.isLoading = false
                  }),
                )
              )
            )
            .subscribe((results: any[]) => {
              let datas = results["data"];
              this.stateclosedoccupancyList = datas;
      
            })
      
      
          let closeddo: String = "";
          this.getClosedDo(closeddo);
          this.closedReportSearch.get('do_closedoccupancy').valueChanges
            .pipe(
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
                console.log('inside tap')
      
              }),
      
              switchMap(value => this.reportService.getusageSearchFilter(value)
                .pipe(
                  finalize(() => {
                    this.isLoading = false
                  }),
                )
              )
            )
            .subscribe((results: any[]) => {
              let datas = results["data"];
              this.closedoccupancydoList = datas;
      
            })
      
      
          let closedbranch: String = "";
          this.getClosedBranch(closedbranch);
          this.closedReportSearch.get('branch_closedoccupancy').valueChanges
            .pipe(
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
                console.log('inside tap')
      
              }),
      
              switchMap(value => this.reportService.getusageSearchFilter(value)
                .pipe(
                  finalize(() => {
                    this.isLoading = false
                  }),
                )
              )
            )
            .subscribe((results: any[]) => {
              let datas = results["data"];
              this.closedoccupancybranchList = datas;
      
            })
  
          let stateocctype: String = "";
          this.getStateOccType(stateocctype);
          this.typeReportSearch.get('state_occupancytype').valueChanges
            .pipe(
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
                console.log('inside tap')
      
              }),
      
              switchMap(value => this.reportService.getStateDropDownRent(value)
                .pipe(
                  finalize(() => {
                    this.isLoading = false
                  }),
                )
              )
            )
            .subscribe((results: any[]) => {
              let datas = results["data"];
              this.stateoccupancytypeList = datas;
      
            })
      
      
          let occtypedo: String = "";
          this.getOccTypeDo(occtypedo);
          this.typeReportSearch.get('do_occupancytype').valueChanges
            .pipe(
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
                console.log('inside tap')
      
              }),
      
              switchMap(value => this.reportService.getusageSearchFilter(value)
                .pipe(
                  finalize(() => {
                    this.isLoading = false
                  }),
                )
              )
            )
            .subscribe((results: any[]) => {
              let datas = results["data"];
              this.occupancytypedoList = datas;
      
            })
      
      
          let occtypebranch: String = "";
          this.getOccTypeBranch(occtypebranch);
          this.typeReportSearch.get('branch_occupancytype').valueChanges
            .pipe(
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
                console.log('inside tap')
      
              }),
      
              switchMap(value => this.reportService.getusageSearchFilter(value)
                .pipe(
                  finalize(() => {
                    this.isLoading = false
                  }),
                )
              )
            )
            .subscribe((results: any[]) => {
              let datas = results["data"];
              this.occupancytypebranchList = datas;
      
            })
  
            this.TourReport.get('approval').valueChanges
            .pipe(
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
              }),
              switchMap(value => this.reportService.getbranchemployee(value,this.branchid))
            )
            .subscribe((results: any[]) => {
              let datas = results['data'];
              this.employeelist = datas;
              console.log("Employee List",this.employeelist)
            });
  
      this.getReportGroup();
      this.getUsage();
      this.getMemoReportGroup();
  
  
      this.getbranchFK();
      this.actionType();
      // this.Statusdd();
      this.docstatusDD();
      // this.getemployeeFKData();
      this.docAssignUnAssignstatusDD();
      this.getSearchstatusList();
      this.getChannelFK();
      this.getCourierFK();
      this.duplicateCheckExpense();
  
  
      this.InwardOverallReport.get('branch_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
          switchMap(value => this.reportService.getbranchFK(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.branchList = datas;
        })
  
        this.InwardOverallReport.get('courier_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
          switchMap(value => this.reportService.getCourierFKdd(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.CourierList = datas;
  
        })
  
  
        this.getStatus();
    this.wisefinTbUpload = this.fb.group({
      wisefinuploadbscc: "",
      wisefinuploadjv: '',
      wisefinuploadjw: "",
      wisefinuploadfa: "",
      wisefinuploadcbcc: "",

    });
     
    }
  
    doChange(e){
      this.ownedPremiseSearch.get('branch_owned').disable();
    }
    branchChange(e){
      this.ownedPremiseSearch.get('do_owned').disable();
    }
  
    doleasedChange(e){
      this.leasedPremiseSearch.get('branch_leased').disable();
    }
    branchleasedChange(e){
      this.leasedPremiseSearch.get('do_leased').disable();
    }
    doActiveChange(e){
      this.activePremiseSearch.get('branch_active').disable();
    }
    branchActiveChange(e){
      this.activePremiseSearch.get('do_active').disable();
    }
    doTerminatedChange(e){
      this.terminatedPremiseSearch.get('branch_terminated').disable();
    }
    branchTerminatedChange(e){
      this.terminatedPremiseSearch.get('do_terminated').disable();
    }
  
    
    doclosedChange(e){
      this.closedReportSearch.get('branch_closedoccupancy').disable();
    }
    branchclosedChange(e){
      this.closedReportSearch.get('do_closedoccupancy').disable();
    }
  
    dorentChange(e){
      this.rentReportSearch.get('rent_branch').disable();
    }
    branchrentChange(e){
      this.rentReportSearch.get('rent_do').disable();
    }
  
    doholdrentChange(e){
      this.holdRentReportSearch.get('holdrent_branch').disable();
    }
    branchholdrentChange(e){
      this.holdRentReportSearch.get('holdrent_do').disable();
    }
  
    doregChange(e){
      this.regReportSearch.get('branch_reg').disable();
    }
    branchregChange(e){
      this.regReportSearch.get('do_reg').disable();
    }
    dounregChange(e){
      this.unregReportSearch.get('branch_unreg').disable();
    }
    branchunregChange(e){
      this.unregReportSearch.get('do_unreg').disable();
    }
    donriChange(e){
      this.nriReportSearch.get('branch_nri').disable();
    }
    branchnriChange(e){
      this.nriReportSearch.get('do_nri').disable();
    }
    doagreeChange(e){
      this.agreeReportSearch.get('branch_leaseagreement').disable();
    }
    branchagreeChange(e){
      this.agreeReportSearch.get('do_leaseagreement').disable();
    }
    doexpiredChange(e){
      this.expReportSearch.get('branch_expiredagreement').disable();
    }
    branchexpiredChange(e){
      this.expReportSearch.get('do_expiredagreement').disable();
    }
    dooccupancytypeChange(e){
      this.typeReportSearch.get('branch_occupancytype').disable();
    }
    branchoccupancytypeChange(e){
      this.typeReportSearch.get('do_occupancytype').disable();
    }
  
    getUsage() {
      this.reportService.getUsage()
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.usageType = datas;
        })
  
    }
    
  
  //premise dropodown
    onChangeForType(event){
      console.log("onChangeForType", event)
      if (event == this.ownedPremiseId){
      this.premiseown();
      } if ((event == this.leasedPremiseId)) {
      this.premiseownlea();
      } if ((event == this.activePremiseId)) {
        this.premiseactive();
      }
       if ((event == this.terminatedPremiseId)) {
          this.premiseterminated();
      }
    }
  
    //occupancy dropdown
    onChangeOccupancy(event){
      if (event == this.occUsageTypeId){
        this.occUsageType();
      } if (event == this.occByUsageCodeId){
          this.occUsageCode();
      } if (event == this.closedOccuId){
        this.closedOccu();
      }
  
    }
  
    
    //rent dropdown
    onChangeRent(event){
      if (event == this.rentId){
        this.rent1();
      } if (event == this.holdRentId){
          this.holdRent();
      } if(event == this.expiredRentScheduleId){
          this.expiredRentSchedule();
      }
  
    }
  
  
    //landlord dropdown
    onChangeLandlord(event){
      if (event == this.landlordId){
        this.landlord();
      } if (event == this.unreglandlordId){
          this.unRegLandLord();
      } if (event == this.nrilandlordId){
        this.NRILandLord();
      }
  
    }
  
    //agreement dropdown
    onChangeAgreement(event){
      if (event == this.agreementId){
        this.agreemnt();
      } if (event == this.expagreementId){
          this.expiredAgreemnt();
      } 
  
    }
  
    //memo dropdown
    onChangeForMemo(event){
      console.log("onChangeForMemo", event)
      if (event == this.deptId){
      this.department();
      } if ((event == this.employeeId)) {
      this.employee();
      } if ((event == this.approvedMemoId)) {
        this.approvedMemo();
      } if ((event == this.pendingMemoId)) {
        this.pendingMemo();
      } if ((event == this.closedMemoId)) {
        this.closedMemo();
      } if ((event == this.editandResubmittedMemoId)) {
        this.editandResubmittedMemo();
      }  if ((event == this.reviewandResubmittedMemoId)) {
        this.reviewandResubmittedMemo();
      }
    }
  
    //memoType dropdown
    onChangeForMemoType(event){
      console.log("onChangeForMemoType", event)
      if(event == 1 ){
        this.isMemo = true;
      }if(event == 2){
        this.isMemo = true;
        this.memoReportGroupId = event;
      }
    }
  
  
  
    occUsageId:number;
   
    onChange(e){
      this.occUsageId= e
      this.getReportGroupForoccUsageType();
  
    }
    
    usageBranchId: number;
    public displayFnRm(usagecode?: usageCode): string | undefined {
      return usagecode ? usagecode.name : undefined;
    }
    displayFn(subject){
      return subject? subject.full_name:undefined
    }
    get usagecode() {
      return this.usageCodeSearch.value.get('occupancy_usagecode');
     
    }
  
    private getUsageCodee(rmkeyvalue) {
      this.reportService.getusageSearchFilter(rmkeyvalue)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.UsageCodeData = datas;
          this.BranchCode = datas;
        })
    }
  
    autocompleteRMScroll() {
      setTimeout(() => {
        if (
          this.matAutocomplete &&
          this.autocompleteTrigger &&
          this.matAutocomplete.panel
        ) {
          fromEvent(this.matAutocomplete.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.matAutocomplete.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.matAutocomplete.panel.nativeElement.scrollTop;
              const scrollHeight = this.matAutocomplete.panel.nativeElement.scrollHeight;
              const elementHeight = this.matAutocomplete.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_next === true) {
                  this.reportService.getUsageCodeScroll(this.rmInput.nativeElement.value, this.currentpage + 1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.UsageCodeData = this.UsageCodeData.concat(datas);
                      if (this.UsageCodeData.length >= 0) {
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
  
  
  
  
    public displayFnEmployeeName(primary?: EmployeeName): string | undefined {
      return primary ? primary.full_name : undefined;
    }
  
    get primary() {
      return this.employeenameSearch.get('employee_name');
    }
  
    private employeeName(primaykey) {
      this.reportService.getEmployeeFilter(primaykey)
        .subscribe((results) => {
          let datas = results["data"];
          this.employeeNameList = datas;
        })
    }
  
    autocompleteEmployeeNameScroll() {
      setTimeout(() => {
        if (
          this.matAutocompleteEmp &&
          this.autocompleteTrigger &&
          this.matAutocompleteEmp.panel
        ) {
          fromEvent(this.matAutocompleteEmp.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.matAutocompleteEmp.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.matAutocompleteEmp.panel.nativeElement.scrollTop;
              const scrollHeight = this.matAutocompleteEmp.panel.nativeElement.scrollHeight;
              const elementHeight = this.matAutocompleteEmp.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_employeenext === true) {
                  this.reportService.getEmployeeScroll(this.primaryContactInput.nativeElement.value, this.employeecurrentpage + 1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
  
                      this.employeeNameList = this.employeeNameList.concat(datas);
                      if (this.employeeNameList.length >= 0) {
                        this.has_employeenext = datapagination.has_next;
                        this.has_employeeprevious = datapagination.has_previous;
                        this.employeecurrentpage = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }
  
  
  
  
    public displayFnDeptName(autoDept?: DepartmentName): string | undefined {
      return autoDept ? autoDept.name : undefined;
    }
  
    get autoDept() {
      return this.departmentNameSearch.get('department_name');
    }
  
    private departmentName(primaykey1) {
      this.reportService.getDepartmentFilter(primaykey1)
        .subscribe((results) => {
          let datas = results["data"];
          this.deptNameList = datas;
        })
    }
  
    autocompleteDeptNameScroll() {
      setTimeout(() => {
        if (
          this.matAutocompleteDept &&
          this.autocompleteTrigger &&
          this.matAutocompleteDept.panel
        ) {
          fromEvent(this.matAutocompleteDept.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.matAutocompleteDept.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.matAutocompleteDept.panel.nativeElement.scrollTop;
              const scrollHeight = this.matAutocompleteDept.panel.nativeElement.scrollHeight;
              const elementHeight = this.matAutocompleteDept.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_deptnext === true) {
                  this.reportService.getDepartmentScroll(this.deptInput.nativeElement.value, this.deptcurrentpage + 1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
  
                      this.deptNameList = this.deptNameList.concat(datas);
                      if (this.deptNameList.length >= 0) {
                        this.has_deptnext = datapagination.has_next;
                        this.has_deptprevious = datapagination.has_previous;
                        this.deptcurrentpage = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }
  
    
    reportGroupId: number;
    reportGroupIdoccupany: number;
    reportGroupIdrent: number;
    reportGroupIdlandlord: number;
    reportGroupIdagreement: number;
    reportGroupIdBuilding: number;
    ownedPremiseId: number;
    leasedPremiseId: number;
    atmId: number;
    branchId: number;
    rentId: number;
    landlordId: number;
    agreementId: number;
    closedOccuId: number;
    occUsageTypeId: number;
    holdRentId: number;
    expiredRentScheduleId: number;
    occByUsageCodeId: number;
    unreglandlordId: number;
    nrilandlordId: number;
    expagreementId: number;
    premiseId: number;
    buildingPlanId: number;
    activePremiseId: number;
    terminatedPremiseId: number;
    memoReportGroupId: number;
    memoData: any;
    deptId: number;
    employeeId: number;
    approvedMemoId: number;
    pendingMemoId: number;
    closedMemoId: number;
    editandResubmittedMemoId: number;
    reviewandResubmittedMemoId: number;
    getReportGroup() {
      this.reportService.getReportGroup()
        .subscribe(result => {
          this.reportGroupId = result.data[0].id;
          this.identificationData = result.data[0].report;
          console.log("reportzgroup",this.identificationData)
          this.ownedPremiseId = this.identificationData[0].id
          console.log("ownedPremiseId", this.ownedPremiseId)
          this.leasedPremiseId = this.identificationData[1].id
          console.log("leasedPremiseId", this.leasedPremiseId)
          this.buildingPlanId = this.identificationData[2].id
          console.log("buildingplan", this.buildingPlanId)
          this.activePremiseId = this.identificationData[3].id
          console.log("active", this.activePremiseId)
          this.terminatedPremiseId = this.identificationData[4].id
          console.log("terminated", this.terminatedPremiseId)
  
          
          this.reportGroupIdoccupany = result.data[1].id;
          console.log("occupany-->id",this.reportGroupIdoccupany)
          this.occUsageTypeId = result.data[1].report[0].id;
          console.log("occupancy usage type-->id",this.occUsageTypeId)
          this.occByUsageCodeId = result.data[1].report[1].id;
          console.log("occupancy usage code-->id",this.occByUsageCodeId)
          this.closedOccuId = result.data[1].report[2].id;
          console.log("closed occupancy-->id",this.closedOccuId)
  
  
          this.reportGroupIdrent = result.data[2].id;
          console.log("rrrr-->id",this.reportGroupIdrent)
          this.rentId = result.data[2].report[0].id;
          console.log("rent-->id",this.rentId)
          this.holdRentId = result.data[2].report[1].id;
          console.log("hold rent-->id",this.holdRentId)
          this.expiredRentScheduleId = result.data[2].report[2].id;
          console.log("expired Rent Schedule-->id",this.expiredRentScheduleId)
  
          this.reportGroupIdlandlord = result.data[3].id;
          console.log("llll-->id",this.reportGroupIdlandlord)
          this.landlordId = result.data[3].report[0].id;
          console.log("reglandlord-->id",this.landlordId)
          this.unreglandlordId = result.data[3].report[1].id;
          console.log("unreglandlord-->id",this.unreglandlordId)
          this.nrilandlordId = result.data[3].report[2].id;
          console.log("nrilandlord-->id",this.nrilandlordId)
  
          this.reportGroupIdagreement = result.data[4].id;
          console.log("aaaa-->id",this.reportGroupIdagreement)
          this.agreementId = result.data[4].report[0].id;
          console.log("agreement-->id",this.agreementId)
          this.expagreementId = result.data[4].report[1].id;
          console.log("expagreement-->id",this.expagreementId)
    
      })
    }
  
    getMemoReportGroup() {
      this.reportService.getMemoReportGroup()
        .subscribe(result => {
          this.memoReportGroupId = result.data[0].id;
          this.memoData = result.data[0].report;
          console.log("memoReportGroupId",this.memoData)
          this.deptId = this.memoData[0].id
          console.log("deptId", this.deptId)
          this.employeeId = this.memoData[1].id
          console.log("employeeId", this.employeeId)
          this.approvedMemoId = this.memoData[2].id
          console.log("approvedMemoId", this.approvedMemoId)
          this.pendingMemoId = this.memoData[3].id
          console.log("pendingMemoId", this.pendingMemoId)
          this.closedMemoId = this.memoData[4].id
          console.log("closedMemoId", this.closedMemoId)
          this.editandResubmittedMemoId = this.memoData[5].id
          console.log("editMemoId", this.editandResubmittedMemoId)
          this.reviewandResubmittedMemoId = this.memoData[6].id
          console.log("reviewMemoId", this.reviewandResubmittedMemoId)
      })
    }
  
    duplicateCheckExpense() {	
      this.SpinnerService.show();	
      this.reportService.getParexpensetype()	
        .subscribe((results: any[]) => {	
          this.SpinnerService.hide();	
          let datas = results["data"];	
          this.expensetype = datas;	
        })	
    }
  
    fromdate:any;
    todate: any;
    ownedStateId: number;
    ownedDoId: number;
    ownedBranchId: number;
    ownedSearch(){
      const fromDate = this.ownedPremiseSearch.value;
      fromDate.datefrom = this.datePipe.transform(fromDate.datefrom, 'dd-MM-yyyy');
      this.fromdate = this.ownedPremiseSearch.value.datefrom
  
      const toDate = this.ownedPremiseSearch.value;
      toDate.dateto = this.datePipe.transform(toDate.dateto, 'dd-MM-yyyy');
      this.todate = this.ownedPremiseSearch.value.dateto
  
      if (this.ownedPremiseSearch.value.state_owned != null){
      this.ownedStateId = this.ownedPremiseSearch.value.state_owned.id
      console.log("ownedStateId",this.ownedStateId)
      } else {
        this.ownedStateId = null;
      }
  
      if (this.ownedPremiseSearch.value.do_owned != null){
      this.ownedDoId = this.ownedPremiseSearch.value.do_owned.id
      console.log("ownedDoId",this.ownedDoId)
      } else {
        this.ownedDoId  = null;
      }
  
      if (this.ownedPremiseSearch.value.branch_owned != null){
      this.ownedBranchId = this.ownedPremiseSearch.value.branch_owned.id
      console.log("ownedBranchId",this.ownedBranchId)
      } else {
        this.ownedBranchId  = null;
      }
  
      let val = ''
      if(this.fromdate !=null){
        if (val == ''){
          val = '?from_date=' + this.fromdate
        }else{
          val = val +'&from_date=' + this.fromdate
        }
        
      } if(this.todate !=null){
        if (val == ''){
          val = '?to_date=' + this.todate
        }else{
          val = val +'&to_date=' + this.todate
        }
       
      } if(this.ownedStateId){
        if (val == ''){
          val = '?state=' + this.ownedStateId
        }else{
          val = val +'&state=' + this.ownedStateId
        }
        
      } if(this.ownedDoId){
        if (val == ''){
          val = '?do=' + this.ownedDoId
        }else{
          val = val +'&do=' + this.ownedDoId
        }
       
      } if(this.ownedBranchId){
        if (val == ''){
          val = '?branch=' + this.ownedBranchId
        }else{
          val = val +'&branch=' + this.ownedBranchId
        }
      
      } 
      console.log("ownedval",val)
  
      this.reportService.ownedDateSearch(this.reportGroupId, this.ownedPremiseId,val)
        .subscribe(result => {
          console.log("search->owned", result)
          this.ownedPremiseList= result['data']
        })
  
    }
  
    reset(){
      this.getReportGroupForOwnedPremise();
      this.ownedPremiseSearch.reset();
      this.ownedPremiseSearch.get('branch_owned').enable();
      this.ownedPremiseSearch.get('do_owned').enable();
    }
  
  
    fromdate1:any;
    todate1: any;
    leasedStateId: number;
    leasedDoId: number;
    leasedBranchId: number;
    leasedSearch(){
      const fromDate = this.leasedPremiseSearch.value;
      fromDate.datefrom1 = this.datePipe.transform(fromDate.datefrom1, 'dd-MM-yyyy');
      this.fromdate1 = this.leasedPremiseSearch.value.datefrom1
      
      const toDate = this.leasedPremiseSearch.value;
      toDate.dateto1 = this.datePipe.transform(toDate.dateto1, 'dd-MM-yyyy');
      this.todate1 = this.leasedPremiseSearch.value.dateto1
  
      if (this.leasedPremiseSearch.value.state_leased != null){
      this.leasedStateId = this.leasedPremiseSearch.value.state_leased.id
      console.log("leasedStateId",this.leasedStateId)
      } else {
        this.leasedStateId = null;
      }
      if (this.leasedPremiseSearch.value.do_leased != null){
      this.leasedDoId = this.leasedPremiseSearch.value.do_leased.id
      console.log("leasedDoId",this.leasedDoId)
      } else {
        this.leasedDoId = null;
      }
      if (this.leasedPremiseSearch.value.branch_leased != null){
      this.leasedBranchId = this.leasedPremiseSearch.value.branch_leased.id
      console.log("leasedBranchId",this.leasedBranchId)
      } else {
        this.leasedBranchId = null;
      }
  
      let val = ''
      if(this.fromdate1 !=null){
        if (val == ''){
          val = '?from_date=' + this.fromdate1
        }else{
          val = val +'&from_date=' + this.fromdate1
        }
        
      } if(this.todate1 !=null){
        if (val == ''){
          val = '?to_date=' + this.todate1
        }else{
          val = val +'&to_date=' + this.todate1
        }
       
      } if(this.leasedStateId){
        if (val == ''){
          val = '?state=' + this.leasedStateId
        }else{
          val = val +'&state=' + this.leasedStateId
        }
        
      } if(this.leasedDoId){
        if (val == ''){
          val = '?do=' + this.leasedDoId
        }else{
          val = val +'&do=' + this.leasedDoId
        }
       
      } if(this.leasedBranchId){
        if (val == ''){
          val = '?branch=' + this.leasedBranchId
        }else{
          val = val +'&branch=' + this.leasedBranchId
        }
      
      } 
      console.log("leasedval",val)
  
      this.reportService.leasedDateSearch(this.reportGroupId, this.leasedPremiseId,val)
        .subscribe(result => {
          console.log("search->leased", result)
          this.leasedPremiseList= result['data']
        })
  
    }
  
    reset1(){
      this.getReportGroupForLeasedPremise();
      this.leasedPremiseSearch.reset()
      this.leasedPremiseSearch.get('do_leased').enable();
      this.leasedPremiseSearch.get('branch_leased').enable();
    }
  
  
  
    fromdateactive:any;
    todateactive: any;
    activeStateId: number;
    activeDoId: number;
    activeBranchId: number;
    activeSearch(){
      const fromDate = this.activePremiseSearch.value;
      fromDate.datefromactive = this.datePipe.transform(fromDate.datefromactive, 'dd-MM-yyyy');
      this.fromdateactive = this.activePremiseSearch.value.datefromactive
      
      const toDate = this.activePremiseSearch.value;
      toDate.datetoactive = this.datePipe.transform(toDate.datetoactive, 'dd-MM-yyyy');
      this.todateactive = this.activePremiseSearch.value.datetoactive
  
      if (this.activePremiseSearch.value.state_active != null){
      this.activeStateId = this.activePremiseSearch.value.state_active.id
      console.log("activeStateId",this.activeStateId)
      } else {
        this.activeStateId = null;
      }
      if (this.activePremiseSearch.value.do_active != null){
      this.activeDoId = this.activePremiseSearch.value.do_active.id
      console.log("activeDoId",this.activeDoId)
      } else {
        this.activeDoId = null;
      }
      if (this.activePremiseSearch.value.branch_active != null){
      this.activeBranchId = this.activePremiseSearch.value.branch_active.id
      console.log("activeBranchId",this.activeBranchId)
      } else {
        this.activeBranchId = null;
      }
  
      let val = ''
      if(this.fromdateactive !=null){
        if (val == ''){
          val = '?from_date=' + this.fromdateactive
        }else{
          val = val +'&from_date=' + this.fromdateactive
        }
        
      } if(this.todateactive !=null){
        if (val == ''){
          val = '?to_date=' + this.todateactive
        }else{
          val = val +'&to_date=' + this.todateactive
        }
       
      } if(this.activeStateId){
        if (val == ''){
          val = '?state=' + this.activeStateId
        }else{
          val = val +'&state=' + this.activeStateId
        }
        
      } if(this.activeDoId){
        if (val == ''){
          val = '?do=' + this.activeDoId
        }else{
          val = val +'&do=' + this.activeDoId
        }
       
      } if(this.activeBranchId){
        if (val == ''){
          val = '?branch=' + this.activeBranchId
        }else{
          val = val +'&branch=' + this.activeBranchId
        }
      
      } 
      console.log("activeval",val)
  
      this.reportService.activeDateSearch(this.reportGroupId, this.activePremiseId,val)
        .subscribe(result => {
          console.log("search->active", result)
          this.activePremiseList= result['data']
        })
  
    }
    resets(){
      this.send_value=""
      this.TourReport = this.fb.group({
        tourno:[''],
        approval:[''],
      })
     
      this.tourSearch(this.send_value,this.currentpage,this.pagesize)
    }
    resetconsolidate(){
      this.Consolidateform.reset()
    }
    resetemp(){
      this.send_value=""
      this.Employeeform = this.fb.group({
        tourno:[''],
      })
      
      this.empreportSearch(this.send_value,this.currentpage,this.pagesize)
  
    }
    resetActive(){
      this.getReportGroupForActivePremise();
      this.activePremiseSearch.reset()
      this.activePremiseSearch.get('do_active').enable();
      this.activePremiseSearch.get('branch_active').enable();
    }
  
  
  
    fromdateterminated:any;
    todateterminated: any;
    terminatedStateId: number;
    terminatedDoId: number;
    terminatedBranchId: number;
    terminatedSearch(){
      const fromDate = this.terminatedPremiseSearch.value;
      fromDate.datefromterminated = this.datePipe.transform(fromDate.datefromterminated, 'dd-MM-yyyy');
      this.fromdateterminated = this.terminatedPremiseSearch.value.datefromterminated
      
      const toDate = this.terminatedPremiseSearch.value;
      toDate.datetoterminated = this.datePipe.transform(toDate.datetoterminated, 'dd-MM-yyyy');
      this.todateterminated = this.terminatedPremiseSearch.value.datetoterminated
  
      if (this.terminatedPremiseSearch.value.state_terminated != null){
      this.terminatedStateId = this.terminatedPremiseSearch.value.state_terminated.id
      console.log("terminatedStateId",this.terminatedStateId)
      } else {
        this.terminatedStateId = null;
      }
      if (this.terminatedPremiseSearch.value.do_terminated != null){
      this.terminatedDoId = this.terminatedPremiseSearch.value.do_terminated.id
      console.log("terminatedDoId",this.terminatedDoId)
      } else {
        this.terminatedDoId = null;
      }
      if (this.terminatedPremiseSearch.value.branch_terminated != null){
      this.terminatedBranchId = this.terminatedPremiseSearch.value.branch_terminated.id
      console.log("terminatedBranchId",this.terminatedBranchId)
      } else {
        this.terminatedBranchId = null;
      }
  
      let val = ''
      if(this.fromdateterminated !=null){
        if (val == ''){
          val = '?from_date=' + this.fromdateterminated
        }else{
          val = val +'&from_date=' + this.fromdateterminated
        }
        
      } if(this.todateterminated !=null){
        if (val == ''){
          val = '?to_date=' + this.todateterminated
        }else{
          val = val +'&to_date=' + this.todateterminated
        }
       
      } if(this.terminatedStateId){
        if (val == ''){
          val = '?state=' + this.terminatedStateId
        }else{
          val = val +'&state=' + this.terminatedStateId
        }
        
      } if(this.terminatedDoId){
        if (val == ''){
          val = '?do=' + this.terminatedDoId
        }else{
          val = val +'&do=' + this.terminatedDoId
        }
       
      } if(this.terminatedBranchId){
        if (val == ''){
          val = '?branch=' + this.terminatedBranchId
        }else{
          val = val +'&branch=' + this.terminatedBranchId
        }
      
      } 
      console.log("terminatedval",val)
  
      this.reportService.terminatedDateSearch(this.reportGroupId, this.terminatedPremiseId,val)
        .subscribe(result => {
          console.log("search->terminated", result)
          this.terminatedPremiseList= result['data']
        })
  
    }
  
    resetTerminated(){
      this.getReportGroupForTerminatedPremise();
      this.terminatedPremiseSearch.reset()
      this.terminatedPremiseSearch.get('do_terminated').enable();
      this.terminatedPremiseSearch.get('branch_terminated').enable();
    }
  
    fromdate2:any;
    todate2: any;
    rentStateId: number;
    rentDoId: number;
    rentBranchId: number;
    rentSearch(){
      const fromDate = this.rentReportSearch.value;
      fromDate.rentdatefrom = this.datePipe.transform(fromDate.rentdatefrom, 'dd-MM-yyyy');
      this.fromdate2 = this.rentReportSearch.value.rentdatefrom
  
      const toDate = this.rentReportSearch.value;
      toDate.rentdateto = this.datePipe.transform(toDate.rentdateto, 'dd-MM-yyyy');
      this.todate2 = this.rentReportSearch.value.rentdateto
  
      if (this.rentReportSearch.value.state_id != null){
        this.rentStateId = this.rentReportSearch.value.state_id.id
        console.log("rentStateId",this.rentStateId)
      } else {
        this.rentStateId = null;
      }
      
      if (this.rentReportSearch.value.rent_do != null){
        this.rentDoId = this.rentReportSearch.value.rent_do.id
        console.log("rentDoId",this.rentDoId)
      } else {
        this.rentDoId = null;
      }
  
      if (this.rentReportSearch.value.rent_branch != null){
        this.rentBranchId = this.rentReportSearch.value.rent_branch.id
        console.log("rentBranchId",this.rentBranchId)
      } else {
        this.rentBranchId = null;
      }
  
      let val = ''
      if(this.fromdate2 !=null){
        if (val == ''){
          val = '?from_date=' + this.fromdate2
        }else{
          val = val +'&from_date=' + this.fromdate2
        }
        
      } if(this.todate2 !=null){
        if (val == ''){
          val = '?to_date=' + this.todate2
        }else{
          val = val +'&to_date=' + this.todate2
        }
       
      } if(this.rentStateId){
        if (val == ''){
          val = '?state=' + this.rentStateId
        }else{
          val = val +'&state=' + this.rentStateId
        }
        
      } if(this.rentDoId){
        if (val == ''){
          val = '?do=' + this.rentDoId
        }else{
          val = val +'&do=' + this.rentDoId
        }
       
      } if(this.rentBranchId){
        if (val == ''){
          val = '?branch=' + this.rentBranchId
        }else{
          val = val +'&branch=' + this.rentBranchId
        }
      
      } 
      console.log("rentval",val)
  
      this.reportService.rentDateSearch(this.reportGroupIdrent, this.rentId,val)
        .subscribe(result => {
          console.log("search->rent", result)
          this.rentList= result['data']
        })
  
    }
  
    rentReset(){
      this.getReportGroupForRent();
      this.rentReportSearch.reset();
      this.rentReportSearch.get('rent_do').enable();
      this.rentReportSearch.get('rent_branch').enable();
    }
  
  
    fromdate3:any;
    todate3: any;
    holdrentStateId: number;
    holdrentDoId: number;
    holdrentBranchId: number;
    holdRentSearch(){
      const fromDate = this.holdRentReportSearch.value;
      fromDate.holdRentdatefrom = this.datePipe.transform(fromDate.holdRentdatefrom, 'dd-MM-yyyy');
      this.fromdate3 = this.holdRentReportSearch.value.holdRentdatefrom
      
      const toDate = this.holdRentReportSearch.value;
      toDate.holdRentdateto = this.datePipe.transform(toDate.holdRentdateto, 'dd-MM-yyyy');
      this.todate3 = this.holdRentReportSearch.value.holdRentdateto
  
      if (this.holdRentReportSearch.value.state_holdrent != null){
      this.holdrentStateId = this.holdRentReportSearch.value.state_holdrent.id
      console.log("holdrentStateId",this.holdrentStateId)
      }  else {
        this.holdrentStateId = null;
      }
   
      if (this.holdRentReportSearch.value.holdrent_do != null){
      this.holdrentDoId = this.holdRentReportSearch.value.holdrent_do.id
      console.log("holdrentDoId",this.holdrentDoId)
      }  else {
        this.holdrentDoId = null;
      }
  
      if (this.holdRentReportSearch.value.holdrent_branch != null){
      this.holdrentBranchId = this.holdRentReportSearch.value.holdrent_branch.id
      console.log("holdrentBranchId",this.holdrentBranchId)
      }  else {
        this.holdrentBranchId = null;
      }
   
      let val = ''
      if(this.fromdate3 !=null){
        if (val == ''){
          val = '?from_date=' + this.fromdate3
        }else{
          val = val +'&from_date=' + this.fromdate3
        }
        
      } if(this.todate3 !=null){
        if (val == ''){
          val = '?to_date=' + this.todate3
        }else{
          val = val +'&to_date=' + this.todate3
        }
       
      } if(this.holdrentStateId){
        if (val == ''){
          val = '?state=' + this.holdrentStateId
        }else{
          val = val +'&state=' + this.holdrentStateId
        }
        
      } if(this.holdrentDoId){
        if (val == ''){
          val = '?do=' + this.holdrentDoId
        }else{
          val = val +'&do=' + this.holdrentDoId
        }
       
      } if(this.holdrentBranchId){
        if (val == ''){
          val = '?branch=' + this.holdrentBranchId
        }else{
          val = val +'&branch=' + this.holdrentBranchId
        }
      
      } 
      console.log("holdval",val)
  
      this.reportService.holdRentDateSearch(this.reportGroupIdrent, this.holdRentId,val)
        .subscribe(result => {
          console.log("search->holdrentsearch", result)
          this.holdRentList= result['data']
        })
  
    }
  
    holdRentReset(){
      this.getReportGroupForHoldRent();
      this.holdRentReportSearch.reset();
      this.holdRentReportSearch.get('holdrent_do').enable();
      this.holdRentReportSearch.get('holdrent_branch').enable();
    }
  
  
  
    fromdaterentsche:any;
    todaterentsche: any;
    expiredRentScheSearch(){
  
      if(this.expiredRentScheduleSearch.value.expiredRentSchefrom === "" || this.expiredRentScheduleSearch.value.expiredRentSchefrom === null ){
        this.toastr.warning("Choose required Expired RentSchedule From")
        return false
        
      }
      if(this.expiredRentScheduleSearch.value.expiredRentScheto === "" || this.expiredRentScheduleSearch.value.expiredRentScheto === null ){
        this.toastr.warning("Choose required Expired RentSchedule To")
        return false
      } 
  
      const fromDate = this.expiredRentScheduleSearch.value;
      fromDate.expiredRentSchefrom = this.datePipe.transform(fromDate.expiredRentSchefrom, 'dd-MM-yyyy');
      this.fromdaterentsche = this.expiredRentScheduleSearch.value.expiredRentSchefrom
      
      const toDate = this.expiredRentScheduleSearch.value;
      toDate.expiredRentScheto = this.datePipe.transform(toDate.expiredRentScheto, 'dd-MM-yyyy');
      this.todaterentsche = this.expiredRentScheduleSearch.value.expiredRentScheto
  
      this.reportService.expiredRentSchDateSearch(this.reportGroupIdrent, this.expiredRentScheduleId,this.fromdaterentsche,this.todaterentsche)
        .subscribe(result => {
          console.log("search->ExpiredRentSchsearch", result)
          this.expiredRentScheduleList= result['data']
        })
  
    }
  
    expiredRentScheReset(){
      this.getReportGroupForexpiredRentSchedule();
      this.expiredRentScheduleSearch.reset();
    }
  
    onChangeFornextmonth(event){
      this.reportService.onChangeFornextmonth(this.reportGroupIdrent, this.expiredRentScheduleId,event)
        .subscribe(result => {
          console.log("next month", result)
          this.expiredRentScheduleList= result['data']
        })
    }
  
  
  
    fromdate4:any;
    todate4: any;
    regStateId: number;
    regrentDoId: number;
    regBranchId: number;
    regSearch(){
      const fromDate = this.regReportSearch.value;
      fromDate.regdatefrom = this.datePipe.transform(fromDate.regdatefrom, 'dd-MM-yyyy');
      this.fromdate4 = this.regReportSearch.value.regdatefrom
      
      const toDate = this.regReportSearch.value;
      toDate.regdateto = this.datePipe.transform(toDate.regdateto, 'dd-MM-yyyy');
      this.todate4 = this.regReportSearch.value.regdateto
  
      if (this.regReportSearch.value.state_reg != null){
        this.regStateId = this.regReportSearch.value.state_reg.id
        console.log("regStateId",this.regStateId)
        }  else {
          this.regStateId = null;
        }
     
        if (this.regReportSearch.value.do_reg != null){
        this.regrentDoId = this.regReportSearch.value.do_reg.id
        console.log("regrentDoId",this.regrentDoId)
        }  else {
          this.regrentDoId = null;
        }
    
        if (this.regReportSearch.value.branch_reg != null){
        this.regBranchId = this.regReportSearch.value.branch_reg.id
        console.log("regBranchId",this.regBranchId)
        } else {
          this.regBranchId = null;
        }
    
        let val = ''
        if(this.fromdate4 !=null){
          if (val == ''){
            val = '?from_date=' + this.fromdate4
          }else{
            val = val +'&from_date=' + this.fromdate4
          }
          
        } if(this.todate4 !=null){
          if (val == ''){
            val = '?to_date=' + this.todate4
          }else{
            val = val +'&to_date=' + this.todate4
          }
         
        } if(this.regStateId){
          if (val == ''){
            val = '?state=' + this.regStateId
          }else{
            val = val +'&state=' + this.regStateId
          }
          
        } if(this.regrentDoId){
          if (val == ''){
            val = '?do=' + this.regrentDoId
          }else{
            val = val +'&do=' + this.regrentDoId
          }
         
        } if(this.regBranchId){
          if (val == ''){
            val = '?branch=' + this.regBranchId
          }else{
            val = val +'&branch=' + this.regBranchId
          }
        
        } 
        console.log("regval",val)
  
  
      this.reportService.regDateSearch(this.reportGroupIdlandlord, this.landlordId,val)
        .subscribe(result => {
          console.log("search->regsearch", result)
          this.landLordList= result['data']
        })
  
    }
  
    regReset(){
      this.getReportGroupForLandlord();
      this.regReportSearch.reset();
      this.regReportSearch.get('do_reg').enable();
      this.regReportSearch.get('branch_reg').enable();
    }
  
  
  
    fromdate5:any;
    todate5: any;
    unregStateId: number;
    unregrentDoId: number;
    unregBranchId: number;
    unregSearch(){
      const fromDate = this.unregReportSearch.value;
      fromDate.unregdatefrom = this.datePipe.transform(fromDate.unregdatefrom, 'dd-MM-yyyy');
      this.fromdate5 = this.unregReportSearch.value.unregdatefrom
      
      const toDate = this.unregReportSearch.value;
      toDate.unregdateto = this.datePipe.transform(toDate.unregdateto, 'dd-MM-yyyy');
      this.todate5 = this.unregReportSearch.value.unregdateto
  
      if (this.regReportSearch.value.state_unreg != null){
        this.unregStateId = this.regReportSearch.value.state_unreg.id
        console.log("unregStateId",this.unregStateId)
        }else {
          this.unregStateId = null;
        }
     
        if (this.regReportSearch.value.do_unreg != null){
        this.unregrentDoId = this.regReportSearch.value.do_unreg.id
        console.log("unregrentDoId",this.unregrentDoId)
        }else {
          this.unregrentDoId = null;
        }
    
        if (this.regReportSearch.value.branch_unreg != null){
        this.unregBranchId = this.regReportSearch.value.branch_unreg.id
        console.log("unregBranchId",this.unregBranchId)
        }else {
          this.unregBranchId = null;
        }
    
        let val = ''
        if(this.fromdate5 !=null){
          if (val == ''){
            val = '?from_date=' + this.fromdate5
          }else{
            val = val +'&from_date=' + this.fromdate5
          }
          
        } if(this.todate5 !=null){
          if (val == ''){
            val = '?to_date=' + this.todate5
          }else{
            val = val +'&to_date=' + this.todate5
          }
         
        } if(this.unregStateId){
          if (val == ''){
            val = '?state=' + this.unregStateId
          }else{
            val = val +'&state=' + this.unregStateId
          }
          
        } if(this.unregrentDoId){
          if (val == ''){
            val = '?do=' + this.unregrentDoId
          }else{
            val = val +'&do=' + this.unregrentDoId
          }
         
        } if(this.unregBranchId){
          if (val == ''){
            val = '?branch=' + this.unregBranchId
          }else{
            val = val +'&branch=' + this.unregBranchId
          }
        
        } 
        console.log("unregval",val)
  
      this.reportService.unregDateSearch(this.reportGroupIdlandlord, this.unreglandlordId,val)
        .subscribe(result => {
          console.log("search->unregsearch", result)
          this.UnRegLandLordList= result['data']
        })
  
    }
  
    unregReset(){
      this.getReportGroupForUnregLandLord();
      this.unregReportSearch.reset();
      this.unregReportSearch.get('do_unreg').enable();
      this.unregReportSearch.get('branch_unreg').enable();
    }
  
  
    fromdate6:any;
    todate6: any;
    nriStateId: number;
    nriDoId: number;
    nriBranchId: number;
    nriSearch(){
      const fromDate = this.nriReportSearch.value;
      fromDate.nridatefrom = this.datePipe.transform(fromDate.nridatefrom, 'dd-MM-yyyy');
      this.fromdate6 = this.nriReportSearch.value.nridatefrom
      
      const toDate = this.nriReportSearch.value;
      toDate.nridateto = this.datePipe.transform(toDate.nridateto, 'dd-MM-yyyy');
      this.todate6 = this.nriReportSearch.value.nridateto
  
      if (this.nriReportSearch.value.state_nri != null){
        this.nriStateId = this.nriReportSearch.value.state_nri.id
        console.log("nriStateId",this.nriStateId)
        }else {
          this.nriStateId = null;
        }
     
        if (this.nriReportSearch.value.do_nri != null){
        this.nriDoId = this.nriReportSearch.value.do_nri.id
        console.log("nriDoId",this.nriDoId)
        }else {
          this.nriDoId = null;
        }
    
        if (this.nriReportSearch.value.branch_nri != null){
        this.nriBranchId = this.nriReportSearch.value.branch_nri.id
        console.log("nriBranchId",this.nriBranchId)
        }else {
          this.nriBranchId = null;
        }
    
        let val = ''
        if(this.fromdate6 !=null){
          if (val == ''){
            val = '?from_date=' + this.fromdate6
          }else{
            val = val +'&from_date=' + this.fromdate6
          }
          
        } if(this.todate6 !=null){
          if (val == ''){
            val = '?to_date=' + this.todate6
          }else{
            val = val +'&to_date=' + this.todate6
          }
         
        } if(this.nriStateId){
          if (val == ''){
            val = '?state=' + this.nriStateId
          }else{
            val = val +'&state=' + this.nriStateId
          }
          
        } if(this.nriDoId){
          if (val == ''){
            val = '?do=' + this.nriDoId
          }else{
            val = val +'&do=' + this.nriDoId
          }
         
        } if(this.nriBranchId){
          if (val == ''){
            val = '?branch=' + this.nriBranchId
          }else{
            val = val +'&branch=' + this.nriBranchId
          }
        
        } 
        console.log("nrival",val)
  
      this.reportService.nriDateSearch(this.reportGroupIdlandlord, this.nrilandlordId,val)
        .subscribe(result => {
          console.log("search->nrisearch", result)
          this.NRILandLordList= result['data']
        })
  
    }
  
    nriReset(){
      this.getReportGroupForNRILandLord();
      this.nriReportSearch.reset();
      this.nriReportSearch.get('do_nri').enable();
      this.nriReportSearch.get('branch_nri').enable();
    }
  
  
    fromdate7:any;
    todate7: any;
    agreeStateId: number;
    agreeDoId: number;
    agreeBranchId: number;
    agreeSearch(){
      const fromDate = this.agreeReportSearch.value;
      fromDate.agreedatefrom = this.datePipe.transform(fromDate.agreedatefrom, 'dd-MM-yyyy');
      this.fromdate7 = this.agreeReportSearch.value.agreedatefrom
      
      const toDate = this.agreeReportSearch.value;
      toDate.agreedateto = this.datePipe.transform(toDate.agreedateto, 'dd-MM-yyyy');
      this.todate7 = this.agreeReportSearch.value.agreedateto
  
      if (this.agreeReportSearch.value.state_leaseagreement != null){
        this.agreeStateId = this.agreeReportSearch.value.state_leaseagreement.id
        console.log("agreeStateId",this.agreeStateId)
      }else {
        this.agreeStateId = null;
      }
      
      if (this.agreeReportSearch.value.do_leaseagreement != null){
        this.agreeDoId = this.agreeReportSearch.value.do_leaseagreement.id
        console.log("agreeDoId",this.agreeDoId)
      }else {
        this.agreeDoId = null;
      }
  
      if (this.agreeReportSearch.value.branch_leaseagreement != null){
        this.agreeBranchId = this.agreeReportSearch.value.branch_leaseagreement.id
        console.log("agreeBranchId",this.agreeBranchId)
      }else {
        this.agreeBranchId = null;
      }
  
      let val = ''
      if(this.fromdate7 !=null){
        if (val == ''){
          val = '?from_date=' + this.fromdate7
        }else{
          val = val +'&from_date=' + this.fromdate7
        }
        
      } if(this.todate7 !=null){
        if (val == ''){
          val = '?to_date=' + this.todate7
        }else{
          val = val +'&to_date=' + this.todate7
        }
       
      } if(this.agreeStateId){
        if (val == ''){
          val = '?state=' + this.agreeStateId
        }else{
          val = val +'&state=' + this.agreeStateId
        }
        
      } if(this.agreeDoId){
        if (val == ''){
          val = '?do=' + this.agreeDoId
        }else{
          val = val +'&do=' + this.agreeDoId
        }
       
      } if(this.agreeBranchId){
        if (val == ''){
          val = '?branch=' + this.agreeBranchId
        }else{
          val = val +'&branch=' + this.agreeBranchId
        }
      
      } 
      console.log("agreeval",val)
  
      this.reportService.agreeDateSearch(this.reportGroupIdagreement, this.agreementId,val)
        .subscribe(result => {
          console.log("search->agreesearch", result)
          this.agreementList= result['data']
        })
  
    }
  
    agreeReset(){
      this.getReportGroupForAgreement();
      this.agreeReportSearch.reset();
      this.agreeReportSearch.get('do_leaseagreement').enable();
      this.agreeReportSearch.get('branch_leaseagreement').enable();
    }
  
  
  
  
    fromdate8:any;
    todate8: any;
    expiredStateId: number;
    expiredDoId: number;
    expiredBranchId: number;
    expSearch(){
      const fromDate = this.expReportSearch.value;
      fromDate.expdatefrom = this.datePipe.transform(fromDate.expdatefrom, 'dd-MM-yyyy');
      this.fromdate8 = this.expReportSearch.value.expdatefrom
      
      const toDate = this.expReportSearch.value;
      toDate.expdateto = this.datePipe.transform(toDate.expdateto, 'dd-MM-yyyy');
      this.todate8 = this.expReportSearch.value.expdateto
  
      if (this.expReportSearch.value.state_expiredagreement != null){
        this.expiredStateId = this.expReportSearch.value.state_expiredagreement.id
        console.log("expiredStateId",this.expiredStateId)
      }else {
        this.expiredStateId = null;
      }
      
      if (this.expReportSearch.value.do_expiredagreement != null){
        this.expiredDoId = this.expReportSearch.value.do_expiredagreement.id
        console.log("expiredDoId",this.expiredDoId)
      }else {
        this.expiredDoId = null;
      }
  
      if (this.expReportSearch.value.branch_expiredagreement != null){
        this.expiredBranchId = this.expReportSearch.value.branch_expiredagreement.id
        console.log("expiredBranchId",this.expiredBranchId)
      }else {
        this.expiredBranchId = null;
      }
  
      let val = ''
      if(this.fromdate8 !=null){
        if (val == ''){
          val = '?from_date=' + this.fromdate8
        }else{
          val = val +'&from_date=' + this.fromdate8
        }
        
      } if(this.todate8 !=null){
        if (val == ''){
          val = '?to_date=' + this.todate8
        }else{
          val = val +'&to_date=' + this.todate8
        }
       
      } if(this.expiredStateId){
        if (val == ''){
          val = '?state=' + this.expiredStateId
        }else{
          val = val +'&state=' + this.expiredStateId
        }
        
      } if(this.expiredDoId){
        if (val == ''){
          val = '?do=' + this.expiredDoId
        }else{
          val = val +'&do=' + this.expiredDoId
        }
       
      } if(this.expiredBranchId){
        if (val == ''){
          val = '?branch=' + this.expiredBranchId
        }else{
          val = val +'&branch=' + this.expiredBranchId
        }
      
      } 
      console.log("expiredval",val)
  
      this.reportService.expDateSearch(this.reportGroupIdagreement, this.expagreementId,val)
        .subscribe(result => {
          console.log("search->expsearch", result)
          this.expAgreementList= result['data']
        })
  
    }
  
    expReset(){
      this.getReportGroupForExpiredAgreement();
      this.expReportSearch.reset();
      this.expReportSearch.get('do_expiredagreement').enable();
      this.expReportSearch.get('branch_expiredagreement').enable();
    }
  
  
  
    fromdate9:any;
    todate9: any;
    typeStateId: number;
    typeDoId: number;
    typeBranchId: number;
    typeSearch(){
      const fromDate = this.typeReportSearch.value;
      fromDate.typedatefrom = this.datePipe.transform(fromDate.typedatefrom, 'dd-MM-yyyy');
      this.fromdate9 = this.typeReportSearch.value.typedatefrom
      
      const toDate = this.typeReportSearch.value;
      toDate.typedateto = this.datePipe.transform(toDate.typedateto, 'dd-MM-yyyy');
      this.todate9 = this.typeReportSearch.value.typedateto
  
      if (this.typeReportSearch.value.state_occupancytype != null){
        this.typeStateId = this.typeReportSearch.value.state_occupancytype.id
        console.log("typeStateId",this.typeStateId)
      }else {
        this.typeStateId = null;
      }
      
      if (this.typeReportSearch.value.do_occupancytype != null){
        this.typeDoId = this.typeReportSearch.value.do_occupancytype.id
        console.log("typeDoId",this.typeDoId)
      }else {
        this.typeDoId = null;
      }
  
      if (this.typeReportSearch.value.branch_occupancytype != null){
        this.typeBranchId = this.typeReportSearch.value.branch_occupancytype.id
        console.log("typeBranchId",this.typeBranchId)
      }else {
        this.typeBranchId = null;
      }
  
      let val = ''
      if(this.fromdate9 !=null){
        if (val == ''){
          val = '?type=' + this.occUsageId + '&from_date=' + this.fromdate9
        }else{
          val = val +'&from_date=' + this.fromdate9
        }
        
      } if(this.todate9 !=null){
        if (val == ''){
          val = '?type=' + this.occUsageId + '&to_date=' + this.todate9
        }else{
          val = val +'&to_date=' + this.todate9
        }
       
      } if(this.typeStateId){
        if (val == ''){
          val = '?type=' + this.occUsageId +'&state=' + this.typeStateId
        }else{
          val = val +'&state=' + this.typeStateId
        }
        
      } if(this.typeDoId){
        if (val == ''){
          val = '?type=' + this.occUsageId + '&do=' + this.typeDoId
        }else{
          val = val +'&do=' + this.typeDoId
        }
       
      } if(this.typeBranchId){
        if (val == ''){
          val = '?type=' + this.occUsageId +'&branch=' + this.typeBranchId
        }else{
          val = val +'&branch=' + this.typeBranchId
        }
      
      } 
      console.log("typeval",val)
  
      this.reportService.typeDateSearch(this.reportGroupIdoccupany, this.occUsageTypeId,val)
        .subscribe(result => {
          console.log("search->typesearch", result)
          this.occUsageTypeList= result['data']
        })
  
    }
  
    typeReset(){
      this.getReportGroupForoccUsageType();
      this.typeReportSearch.reset();
      this.typeReportSearch.get('do_occupancytype').enable();
      this.typeReportSearch.get('branch_occupancytype').enable();
    }
  
    fromdate10:any;
    todate10: any;
    closedStateId: number;
    closedDoId: number;
    closedBranchId: number;
    closedSearch(){
      const fromDate = this.closedReportSearch.value;
      fromDate.closeddatefrom = this.datePipe.transform(fromDate.closeddatefrom, 'dd-MM-yyyy');
      this.fromdate10 = this.closedReportSearch.value.closeddatefrom
      
      const toDate = this.closedReportSearch.value;
      toDate.closeddateto = this.datePipe.transform(toDate.closeddateto, 'dd-MM-yyyy');
      this.todate10 = this.closedReportSearch.value.closeddateto
  
      if (this.closedReportSearch.value.state_closedoccupancy != null){
        this.closedStateId = this.closedReportSearch.value.state_closedoccupancy.id
        console.log("closedStateId",this.closedStateId)
      }else {
        this.closedStateId = null;
      }
      
      if (this.closedReportSearch.value.do_closedoccupancy != null){
        this.closedDoId = this.closedReportSearch.value.do_closedoccupancy.id
        console.log("closedDoId",this.closedDoId)
      }else {
        this.closedDoId = null;
      }
  
      if (this.closedReportSearch.value.branch_closedoccupancy != null){
        this.closedBranchId = this.closedReportSearch.value.branch_closedoccupancy.id
        console.log("closedBranchId",this.closedBranchId)
      }else {
        this.closedBranchId = null;
      }
  
      let val = ''
      if(this.fromdate10 !=null){
        if (val == ''){
          val = '?from_date=' + this.fromdate10
        }else{
          val = val +'&from_date=' + this.fromdate10
        }
        
      } if(this.todate10 !=null){
        if (val == ''){
          val = '?to_date=' + this.todate10
        }else{
          val = val +'&to_date=' + this.todate10
        }
       
      } if(this.closedStateId){
        if (val == ''){
          val = '?state=' + this.closedStateId
        }else{
          val = val +'&state=' + this.closedStateId
        }
        
      } if(this.closedDoId){
        if (val == ''){
          val = '?do=' + this.closedDoId
        }else{
          val = val +'&do=' + this.closedDoId
        }
       
      } if(this.closedBranchId){
        if (val == ''){
          val = '?branch=' + this.closedBranchId
        }else{
          val = val +'&branch=' + this.closedBranchId
        }
      
      } 
      console.log("closedval",val)
  
      this.reportService.closedDateSearch(this.reportGroupIdoccupany, this.closedOccuId,val)
        .subscribe(result => {
          console.log("search->closedsearch", result)
          this.closedOccList= result['data']
        })
  
    }
  
    closedReset(){
      this.getReportGroupForClosedOccu();
      this.closedReportSearch.reset();
      this.closedReportSearch.get('do_closedoccupancy').enable();
      this.closedReportSearch.get('branch_closedoccupancy').enable();
    }
  
  
  
    fromdate11:any;
    todate11: any;
    usagecodeSearch(){
      if(this.usagecodeReportSearch.value.usagecodedatefrom === "" || this.usagecodeReportSearch.value.usagecodedatefrom === null ){
        this.toastr.warning("Choose required Occupancy Created From")
        return false
        
      }
      if(this.usagecodeReportSearch.value.usagecodedateto === "" || this.usagecodeReportSearch.value.usagecodedateto === null ){
        this.toastr.warning("Choose required Occupancy Created To")
        return false
      } 
  
      const fromDate = this.usagecodeReportSearch.value;
      fromDate.usagecodedatefrom = this.datePipe.transform(fromDate.usagecodedatefrom, 'dd-MM-yyyy');
      this.fromdate11 = this.usagecodeReportSearch.value.usagecodedatefrom
      
      const toDate = this.usagecodeReportSearch.value;
      toDate.usagecodedateto = this.datePipe.transform(toDate.usagecodedateto, 'dd-MM-yyyy');
      this.todate11 = this.usagecodeReportSearch.value.usagecodedateto
  
      this.reportService.usageCodeDateSearch(this.reportGroupIdoccupany, this.occByUsageCodeId,this.usageBranchId,this.fromdate11,this.todate11)
        .subscribe(result => {
          console.log("search->usagecodesearch", result)
          this.occUsageCodeList= result['data']
        })
  
    }
  
    usagecodeReset(){
      this.getReportGroupForoccUsageCode();
      this.usagecodeReportSearch.reset()
    }
  
  
  
    fromdate12:any;
    todate12: any;
    buildSearch(){
  
      if(this.buildReportSearch.value.builddatefrom === "" || this.buildReportSearch.value.builddatefrom === null ){
        this.toastr.warning("Choose required Premises Created From")
        return false
        
      }
      if(this.buildReportSearch.value.builddateto === "" || this.buildReportSearch.value.builddateto === null ){
        this.toastr.warning("Choose required Premises Created To")
        return false
      }
    
      const fromDate = this.buildReportSearch.value;
      fromDate.builddatefrom = this.datePipe.transform(fromDate.builddatefrom, 'dd-MM-yyyy');
      this.fromdate12 = this.buildReportSearch.value.builddatefrom
      
      const toDate = this.buildReportSearch.value;
      toDate.builddateto = this.datePipe.transform(toDate.builddateto, 'dd-MM-yyyy');
      this.todate12 = this.buildReportSearch.value.builddateto
  
      this.reportService.buildDateSearch(this.reportGroupId, this.buildingPlanId,this.fromdate12,this.todate12)
        .subscribe(result => {
          console.log("search->buildsearch", result)
          this.premiseList= result['data']
        })
  
    }
  
    buildReset(){
      this.buildReportSearch.reset()
      this.buildingplan(this.status);
      console.log("status",this.status)
    }
  
    //memo date search 
    fromdatedept:any;
    todatedept: any;
    deptSearch(){
      const fromDate = this.deptReportSearch.value;
      fromDate.deptdatefrom = this.datePipe.transform(fromDate.deptdatefrom, 'dd-MM-yyyy');
      this.fromdatedept = this.deptReportSearch.value.deptdatefrom
      
      const toDate = this.deptReportSearch.value;
      toDate.deptdateto = this.datePipe.transform(toDate.deptdateto, 'dd-MM-yyyy');
      this.todatedept = this.deptReportSearch.value.deptdateto
  
      this.reportService.deptDateSearch(this.memoReportGroupId, this.deptId,this.fromdatedept,this.todatedept)
        .subscribe(result => {
          console.log("search->deptsearch", result)
          this.deptList= result['data']
        })
  
    }
  
    deptReset(){
      this.getReportGroupFordept();
      this.deptReportSearch.reset()
    }
  
  
    fromdateemp:any;
    todateemp: any;
    empSearch(){
      const fromDate = this.empReportSearch.value;
      fromDate.empdatefrom = this.datePipe.transform(fromDate.empdatefrom, 'dd-MM-yyyy');
      this.fromdateemp = this.empReportSearch.value.empdatefrom
      
      const toDate = this.empReportSearch.value;
      toDate.empdateto = this.datePipe.transform(toDate.empdateto, 'dd-MM-yyyy');
      this.todateemp = this.empReportSearch.value.empdateto
  
      this.reportService.empDateSearch(this.memoReportGroupId, this.employeeId,this.fromdateemp,this.todateemp)
        .subscribe(result => {
          console.log("search->empsearch", result)
          this.empList= result['data']
        })
  
    }
  
    empReset(){
      this.getReportGroupForEmployee();
      this.empReportSearch.reset()
    }
  
    fromdateapp:any;
    todateapp: any;
    approvedSearch(){
      const fromDate = this.approvedReportSearch.value;
      fromDate.approveddatefrom = this.datePipe.transform(fromDate.approveddatefrom, 'dd-MM-yyyy');
      this.fromdateapp = this.approvedReportSearch.value.approveddatefrom
      
      const toDate = this.approvedReportSearch.value;
      toDate.approveddateto = this.datePipe.transform(toDate.approveddateto, 'dd-MM-yyyy');
      this.todateapp = this.approvedReportSearch.value.approveddateto
  
      this.reportService.approvedDateSearch(this.memoReportGroupId, this.approvedMemoId ,this.fromdateapp,this.todateapp)
        .subscribe(result => {
          console.log("search->approvedsearch", result)
          this.approvedmemoList= result['data']
        })
  
    }
  
    approvedReset(){
      this.getReportGroupForApprovedMemo();
      this.approvedReportSearch.reset()
    }
  
    fromdatepending:any;
    todatepending: any;
    pendingSearch(){
      const fromDate = this.pendingReportSearch.value;
      fromDate.pendingdatefrom = this.datePipe.transform(fromDate.pendingdatefrom, 'dd-MM-yyyy');
      this.fromdatepending = this.pendingReportSearch.value.pendingdatefrom
      
      const toDate = this.pendingReportSearch.value;
      toDate.pendingdateto = this.datePipe.transform(toDate.pendingdateto, 'dd-MM-yyyy');
      this.todatepending = this.pendingReportSearch.value.pendingdateto
  
      this.reportService.pendingDateSearch(this.memoReportGroupId, this.pendingMemoId,this.fromdatepending,this.todatepending)
        .subscribe(result => {
          console.log("search->deptsearch", result)
          this.pendingmemoList= result['data']
        })
  
    }
  
    pendingReset(){
      this.getReportGroupForPendingMemo();
      this.pendingReportSearch.reset()
    }
  
    fromdateclosedmemo:any;
    todateclosedmemo: any;
    closedMemoSearch(){
      const fromDate = this.closedMemoReportSearch.value;
      fromDate.closedmemodatefrom = this.datePipe.transform(fromDate.closedmemodatefrom, 'dd-MM-yyyy');
      this.fromdateclosedmemo = this.closedMemoReportSearch.value.closedmemodatefrom
      
      const toDate = this.closedMemoReportSearch.value;
      toDate.closedmemodateto = this.datePipe.transform(toDate.closedmemodateto, 'dd-MM-yyyy');
      this.todateclosedmemo = this.closedMemoReportSearch.value.closedmemodateto
  
      this.reportService.closedMemoDateSearch(this.memoReportGroupId, this.closedMemoId,this.fromdateclosedmemo,this.todateclosedmemo)
        .subscribe(result => {
          console.log("search->closedMemosearch", result)
          this.closedmemoList= result['data']
        })
  
    }
  
    closedMemoReset(){
      this.getReportGroupForClosedMemo();
      this.closedMemoReportSearch.reset()
    }
  
    fromdateedit:any;
    todateedit: any;
    editSearch(){
      const fromDate = this.editReportSearch.value;
      fromDate.editdatefrom = this.datePipe.transform(fromDate.editdatefrom, 'dd-MM-yyyy');
      this.fromdateedit = this.editReportSearch.value.editdatefrom
      
      const toDate = this.editReportSearch.value;
      toDate.editdateto = this.datePipe.transform(toDate.editdateto, 'dd-MM-yyyy');
      this.todateedit = this.editReportSearch.value.editdateto
  
      this.reportService.editDateSearch(this.memoReportGroupId, this.editandResubmittedMemoId,this.fromdateedit,this.todateedit)
        .subscribe(result => {
          console.log("search->editsearch", result)
          this.editList= result['data']
        })
  
    }
  
    editReset(){
      this.getReportGroupForEdit();
      this.editReportSearch.reset()
    }
  
    fromdatereview:any;
    todatereview: any;
    reviewSearch(){
      const fromDate = this.reviewReportSearch.value;
      fromDate.reviewdatefrom = this.datePipe.transform(fromDate.reviewdatefrom, 'dd-MM-yyyy');
      this.fromdatereview = this.reviewReportSearch.value.reviewdatefrom
      
      const toDate = this.reviewReportSearch.value;
      toDate.reviewdateto = this.datePipe.transform(toDate.reviewdateto, 'dd-MM-yyyy');
      this.todatereview = this.reviewReportSearch.value.reviewdateto
  
      this.reportService.reviewDateSearch(this.memoReportGroupId, this.reviewandResubmittedMemoId,this.fromdatereview,this.todatereview)
        .subscribe(result => {
          console.log("search->reviewsearch", result)
          this.reviewList= result['data']
        })
  
    }
  
    reviewReset(){
      this.getReportGroupForReview();
      this.reviewReportSearch.reset()
    }
  
  
  
  
    //premise Report
    getReportGroupForOwnedPremise() {
      this.reportService.getReportGroupForOwnedPremise(this.reportGroupId, this.ownedPremiseId)
        .subscribe(result => {
          this.ownedPremiseList = result.data;
          console.log("reportGroup--->OwnedPremise", this.ownedPremiseList)
    
      })
    }
  
    getReportGroupForLeasedPremise() {
      this.reportService.getReportGroupForLeasedPremise(this.reportGroupId, this.leasedPremiseId)
        .subscribe(result => {
          this.leasedPremiseList = result.data;
          console.log("reportGroup--->leasedPremise", this.leasedPremiseList)
    
      })
    }
    getReportGroupForActivePremise() {
      this.reportService.getReportGroupForActivePremise(this.reportGroupId, this.activePremiseId)
        .subscribe(result => {
          this.activePremiseList = result.data;
          console.log("reportGroup--->activePremise", this.activePremiseList)
    
      })
    }
    getReportGroupForTerminatedPremise() {
      this.reportService.getReportGroupForTerminatedPremise(this.reportGroupId, this.terminatedPremiseId)
        .subscribe(result => {
          this.terminatedPremiseList = result.data;
          console.log("reportGroup--->terminatedPremise", this.terminatedPremiseList)
    
      })
    }
    // occupancy
    getReportGroupForATM() {
      this.reportService.getReportGroupForATM(this.reportGroupIdoccupany, this.atmId)
        .subscribe(result => {
          this.atmList = result.data;
          console.log("reportGroup--->ATM", this.atmList)
    
      })
    }
  
    getReportGroupForBranch() {
      this.reportService.getReportGroupForBranch(this.reportGroupIdoccupany, this.branchId)
        .subscribe(result => {
          this.branchList = result.data;
          console.log("reportGroup--->branch", this.branchList)
    
      })
    }
  
    getReportGroupForClosedOccu() {
      this.reportService.getReportGroupForClosedOccu(this.reportGroupIdoccupany, this.closedOccuId)
        .subscribe(result => {
          this.closedOccList = result.data;
          console.log("reportGroup--->closedocc", this.closedOccList)
    
      })
    }
  
    getReportGroupForoccUsageType() {
      if (this.occUsageId != undefined){
        this.reportService.getReportGroupForoccUsageType(this.reportGroupIdoccupany, this.occUsageTypeId,this.occUsageId)
        .subscribe(result => {
          this.occUsageTypeList = result.data;
          console.log("reportGroup--->occusagetype", this.occUsageTypeList)
      })
      }
    
    }
  
    SearchForBranchList(){
      this.usageBranchId = this.usageCodeSearch.value.occupancy_usagecode.id
      console.log("usageBranchId",this.usageBranchId)
      this.getReportGroupForoccUsageCode();
    }
   
    getReportGroupForoccUsageCode() {
      if (this.usageBranchId != undefined){
      this.reportService.getReportGroupForoccUsageCode(this.reportGroupIdoccupany, this.occByUsageCodeId,this.usageBranchId)
        .subscribe(result => {
          this.occUsageCodeList = result.data;
          console.log("reportGroup--->occusagecode", this.occUsageCodeList)
    
      })
    }
    }
  
    //rent
    getReportGroupForRent() {
      this.reportService.getReportGroupForRent(this.reportGroupIdrent, this.rentId)
        .subscribe(result => {
          this.rentList = result.data;
          console.log("reportGroup--->rent", this.rentList)
    
      })
    }
    getReportGroupForHoldRent() {
      this.reportService.getReportGroupForHoldRent(this.reportGroupIdrent, this.holdRentId)
        .subscribe(result => {
          this.holdRentList = result.data;
          console.log("reportGroup--->holdrent", this.holdRentList)
    
      })
    }
    getReportGroupForexpiredRentSchedule() {
      this.reportService.getReportGroupForexpiredRentSchedule(this.reportGroupIdrent, this.expiredRentScheduleId)
        .subscribe(result => {
          this.expiredRentScheduleList = result.data;
          console.log("reportGroup--->expiredrentsche", this.expiredRentScheduleList)
    
      })
    }
    
    //landlord
    getReportGroupForLandlord() {
      this.reportService.getReportGroupForLandlord(this.reportGroupIdlandlord, this.landlordId)
        .subscribe(result => {
          this.landLordList = result.data;
          console.log("reportGroup--->reglandlord", this.landLordList)
    
      })
    }
    getReportGroupForUnregLandLord() {
      this.reportService.getReportGroupForUnregLandLord(this.reportGroupIdlandlord, this.unreglandlordId)
        .subscribe(result => {
          this.UnRegLandLordList = result.data;
          console.log("reportGroup--->unreglandLord", this.UnRegLandLordList)
    
      })
    }
    getReportGroupForNRILandLord() {
      this.reportService.getReportGroupForNRILandLord(this.reportGroupIdlandlord, this.nrilandlordId)
        .subscribe(result => {
          this.NRILandLordList = result.data;
          console.log("reportGroup--->nrilandLord", this.NRILandLordList)
    
      })
    }
  
      //agreement
      getReportGroupForAgreement() {
        this.reportService.getReportGroupForAgreement(this.reportGroupIdagreement, this.agreementId)
          .subscribe(result => {
            this.agreementList = result.data;
            console.log("reportGroup--->agreement", this.agreementList)
      
        })
      }
      getReportGroupForExpiredAgreement() {
        this.reportService.getReportGroupForExpiredAgreement(this.reportGroupIdagreement, this.expagreementId)
          .subscribe(result => {
            this.expAgreementList = result.data;
            console.log("reportGroup--->expagreement", this.expAgreementList)
      
        })
      }
      // checkedtrue(data) {
      //   if (data == true) {
      //     this.reportService.lastMothRecord(this.reportGroupIdagreement, this.expagreementId)
      //     .subscribe(result => {
      //       this.expAgreementList = result.data;
      //       console.log("lastmonth", this.expAgreementList)
      
      //   })
      //   }else{
      //     this.getReportGroupForExpiredAgreement();
      //   }
      
      // }
  
      status: any;
      buildingplan(data) {
        this.status = data;
        if (data == true) {
          this.isBuilding = true;
          this.ispremiseown = false;
          this.ispremiselea = false;
          this.reportService.buildingplan(this.reportGroupId, this.buildingPlanId)
          .subscribe(result => {
            this.premiseList = result.data;
            console.log("approve premises", this.premiseList)
      
        })
        }else{
          this.ispremiseown = false;
          this.ispremiselea = false;
          this.isBuilding = false;
        }
        
      }
      //building approval plan
      // getReportGroupForpremise() {
      //   this.reportService.getReportGroupForpremise(this.reportGroupIdBuilding, this.premiseId)
      //     .subscribe(result => {
      //       this.premiseList = result.data;
      //       console.log("reportGroup--->premise", this.premiseList)
      
      //   })
      // }
  
      //department
  
      departmentNameId: number
      SearchForDepartmentNameList(){
        this.departmentNameId = this.departmentNameSearch.value.department_name.id
        console.log("departmentNameId",this.departmentNameId)
        this.getReportGroupFordept();
      }
  
      getReportGroupFordept() {
        if (this.departmentNameId != undefined){
        this.reportService.getReportGroupFordept(this.memoReportGroupId, this.deptId,this.departmentNameId)
          .subscribe(result => {
            this.deptList = result.data;
            console.log("memoreportGroup--->dept", this.deptList)
      
        })
      }
      }
  
      employeeNameId: number
      SearchForEmpoyeeNameList(){
        this.employeeNameId = this.employeenameSearch.value.employee_name.id
        console.log("employeeNameId",this.employeeNameId)
        this.getReportGroupForEmployee();
      }
  
      getReportGroupForEmployee() {
        if (this.employeeNameId != undefined){
        this.reportService.getReportGroupForEmployee(this.memoReportGroupId, this.employeeId,this.employeeNameId)
          .subscribe(result => {
            this.empList = result.data;
            console.log("memoreportGroup--->emp", this.empList)
      
        })
      }
      }
      
  
      getReportGroupForApprovedMemo() {
        this.reportService.getReportGroupForApprovedMemo(this.memoReportGroupId, this.approvedMemoId)
          .subscribe(result => {
            this.approvedmemoList = result.data;
            console.log("memoreportGroup--->appovedmemo", this.approvedmemoList)
      
        })
      }
      getReportGroupForPendingMemo() {
        this.reportService.getReportGroupForPendingMemo(this.memoReportGroupId, this.pendingMemoId)
          .subscribe(result => {
            this.pendingmemoList = result.data;
            console.log("memoreportGroup--->pendingmemo", this.pendingmemoList)
      
        })
      }
      getReportGroupForClosedMemo() {
        this.reportService.getReportGroupForClosedMemo(this.memoReportGroupId, this.closedMemoId)
          .subscribe(result => {
            this.closedmemoList = result.data;
            console.log("memoreportGroup--->closedmemo", this.closedmemoList)
      
        })
      }
      getReportGroupForEdit() {
        this.reportService.getReportGroupForEdit(this.memoReportGroupId, this.editandResubmittedMemoId)
          .subscribe(result => {
            this.editList = result.data;
            console.log("memoreportGroup--->editmemo", this.editList)
      
        })
      }
      getReportGroupForReview() {
        this.reportService.getReportGroupForReview(this.memoReportGroupId, this.reviewandResubmittedMemoId)
          .subscribe(result => {
            this.reviewList = result.data;
            console.log("memoreportGroup--->reviememo", this.reviewList)
      
        })
      }
  
  
      //rent state
      public displayFnstate(statetype?: stateList): string | undefined {
        return statetype ? statetype.name : undefined;
      }
    
      get statetype() {
        return this.rentReportSearch.get('state_id');
      }
      private getState(statekeyvalue) {
        this.reportService.getStateDropDownRent(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.stateList = datas;
          })
      }
   
      public displayFnRentDo(rentdo?: RentDo): string | undefined {
        return rentdo ? rentdo.name : undefined;
      }
    
      get rentdo() {
        return this.rentReportSearch.get('rent_do');
      }
      private getRentDo(statekeyvalue) {
        this.reportService.getusageSearchFilter(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.rentDoList = datas;
          })
      }
  
      public displayFnRentBranch(rentbranch?: RentDo): string | undefined {
        return rentbranch ? rentbranch.name : undefined;
      }
    
      get rentbranch() {
        return this.rentReportSearch.get('rent_branch');
      }
      private getRentBranch(statekeyvalue) {
        this.reportService.getusageSearchFilter(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.rentBranchList = datas;
          })
      }
      // holdrent
      public displayFnstateholdrent(stateholdrent?: holdrentstateList): string | undefined {
        return stateholdrent ? stateholdrent.name : undefined;
      }
    
      get stateholdrent() {
        return this.holdRentReportSearch.get('state_holdrent');
      }
      private getStateHoldRent(statekeyvalue) {
        this.reportService.getStateDropDownRent(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.stateholdrentList = datas;
          })
      }
  
      public displayFnHoldRentDo(holdrentdo?: holdRentDo): string | undefined {
        return holdrentdo ? holdrentdo.name : undefined;
      }
    
      get holdrentdo() {
        return this.holdRentReportSearch.get('holdrent_do');
      }
      private getHoldRentDo(statekeyvalue) {
        this.reportService.getusageSearchFilter(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.holdrentDoList = datas;
          })
      }
  
      public displayFnHoldRentBranch(holdrentbranch?: holdRentDo): string | undefined {
        return holdrentbranch ? holdrentbranch.name : undefined;
      }
    
      get holdrentbranch() {
        return this.holdRentReportSearch.get('holdrent_branch');
      }
      private getHoldRentBranch(statekeyvalue) {
        this.reportService.getusageSearchFilter(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.holdrentBranchList = datas;
          })
      }
     //ownedpremise
      public displayFnstateowned(stateowned?: ownedstateList): string | undefined {
        return stateowned ? stateowned.name : undefined;
      }
    
      get stateowned() {
        return this.ownedPremiseSearch.get('state_owned');
      }
      private getStateOwned(statekeyvalue) {
        this.reportService.getStateDropDownRent(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.stateownedList = datas;
          })
      }
  
      public displayFnDoOwned(owneddo?: ownedDo): string | undefined {
        return owneddo ? owneddo.name : undefined;
      }
    
      get owneddo() {
        return this.ownedPremiseSearch.get('do_owned');
      }
      private getOwnedDo(statekeyvalue) {
        this.reportService.getusageSearchFilter(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.owneddoList = datas;
          })
      }
  
      public displayFnBranchOwned(ownedbranch?: ownedBranch): string | undefined {
        return ownedbranch ? ownedbranch.name : undefined;
      }
    
      get ownedbranch() {
        return this.ownedPremiseSearch.get('branch_owned');
      }
      private getOwnedBranch(statekeyvalue) {
        this.reportService.getusageSearchFilter(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.ownedbranchList = datas;
          })
      }
       //leased premise
      public displayFnstateleased(stateleased?: ownedstateList): string | undefined {
        return stateleased ? stateleased.name : undefined;
      }
    
      get stateleased() {
        return this.leasedPremiseSearch.get('state_leased');
      }
      private getStateLeased(statekeyvalue) {
        this.reportService.getStateDropDownRent(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.stateleasedList = datas;
          })
      }
  
      public displayFnDoleased(leaseddo?: ownedDo): string | undefined {
        return leaseddo ? leaseddo.name : undefined;
      }
    
      get leaseddo() {
        return this.leasedPremiseSearch.get('do_leased');
      }
      private getLeasedDo(statekeyvalue) {
        this.reportService.getusageSearchFilter(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.leaseddoList = datas;
          })
      }
  
      public displayFnBranchleased(leasedbranch?: ownedBranch): string | undefined {
        return leasedbranch ? leasedbranch.name : undefined;
      }
    
      get leasedbranch() {
        return this.leasedPremiseSearch.get('branch_leased');
      }
      private getLeasedBranch(statekeyvalue) {
        this.reportService.getusageSearchFilter(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.leasedbranchList = datas;
          })
      }
  
      //Active Premises
      public displayFnStateActive(stateactive?: ownedstateList): string | undefined {
        return stateactive ? stateactive.name : undefined;
      }
    
      get stateactive() {
        return this.activePremiseSearch.get('state_active');
      }
      private getStateActive(statekeyvalue) {
        this.reportService.getStateDropDownRent(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.stateActiveList = datas;
          })
      }
  
      public displayFnDoActive(activedo?: ownedDo): string | undefined {
        return activedo ? activedo.name : undefined;
      }
    
      get activedo() {
        return this.activePremiseSearch.get('do_active');
      }
      private getActiveDo(statekeyvalue) {
        this.reportService.getusageSearchFilter(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.activedoList = datas;
          })
      }
  
      public displayFnBranchActive(activebranch?: ownedBranch): string | undefined {
        return activebranch ? activebranch.name : undefined;
      }
    
      get activebranch() {
        return this.activePremiseSearch.get('branch_active');
      }
      private getActiveBranch(statekeyvalue) {
        this.reportService.getusageSearchFilter(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.activebranchList = datas;
          })
      }
  
  
  
      //Terminated Premises
      public displayFnStateTerminated(stateterminated?: ownedstateList): string | undefined {
        return stateterminated ? stateterminated.name : undefined;
      }
    
      get stateterminated() {
        return this.terminatedPremiseSearch.get('state_terminated');
      }
      private getStateTerminated(statekeyvalue) {
        this.reportService.getStateDropDownRent(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.stateTerminatedList = datas;
          })
      }
  
      public displayFnDoTerminated(terminateddo?: ownedDo): string | undefined {
        return terminateddo ? terminateddo.name : undefined;
      }
    
      get terminateddo() {
        return this.terminatedPremiseSearch.get('do_terminated');
      }
      private getTerminatedDo(statekeyvalue) {
        this.reportService.getusageSearchFilter(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.terminateddodoList = datas;
          })
      }
  
      public displayFnBranchTerminated(terminatedbranch?: ownedBranch): string | undefined {
        return terminatedbranch ? terminatedbranch.name : undefined;
      }
    
      get terminatedbranch() {
        return this.terminatedPremiseSearch.get('branch_terminated');
      }
      private getTerminatedBranch(statekeyvalue) {
        this.reportService.getusageSearchFilter(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.terminatedbranchList = datas;
          })
      }
  
  
      //lease agreement
      public displayFnstateleaseagreement(stateleaseagreement?: ownedstateList): string | undefined {
        return stateleaseagreement ? stateleaseagreement.name : undefined;
      }
    
      get stateleaseagreement() {
        return this.agreeReportSearch.get('state_leaseagreement');
      }
      private getStateLeaseAgree(statekeyvalue) {
        this.reportService.getStateDropDownRent(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.stateleaseagreementList = datas;
          })
      }
  
      public displayFnDoleaseagreement(leaseagreementdo?: ownedDo): string | undefined {
        return leaseagreementdo ? leaseagreementdo.name : undefined;
      }
    
      get leaseagreementdo() {
        return this.agreeReportSearch.get('do_leaseagreement');
      }
      private getLeaseAgreeDo(statekeyvalue) {
        this.reportService.getusageSearchFilter(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.leaseagreementdoList = datas;
          })
      }
  
      public displayFnBranchleaseagreement(leaseagreementbranch?: ownedBranch): string | undefined {
        return leaseagreementbranch ? leaseagreementbranch.name : undefined;
      }
    
      get leaseagreementbranch() {
        return this.agreeReportSearch.get('branch_leaseagreement');
      }
      private getLeaseAgreeBranch(statekeyvalue) {
        this.reportService.getusageSearchFilter(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.leaseagreementbranchList = datas;
          })
      }
  
      //expire agreement
      public displayFnexpiredagreement(stateexpiredagreement?: ownedstateList): string | undefined {
        return stateexpiredagreement ? stateexpiredagreement.name : undefined;
      }
    
      get stateexpiredagreement() {
        return this.expReportSearch.get('state_expiredagreement');
      }
      private getStateExpireAgree(statekeyvalue) {
        this.reportService.getStateDropDownRent(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.stateexpiredagreementList = datas;
          })
      }
  
      public displayFnDoexpiredagreement(expiredagreementdo?: ownedDo): string | undefined {
        return expiredagreementdo ? expiredagreementdo.name : undefined;
      }
    
      get expiredagreementdo() {
        return this.expReportSearch.get('do_expiredagreement');
      }
      private getExpireAgreeDo(statekeyvalue) {
        this.reportService.getusageSearchFilter(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.expiredagreementdoList = datas;
          })
      }
  
      public displayFnBranchexpiredagreement(expiredagreementbranch?: ownedBranch): string | undefined {
        return expiredagreementbranch ? expiredagreementbranch.name : undefined;
      }
    
      get expiredagreementbranch() {
        return this.expReportSearch.get('branch_expiredagreement');
      }
      private getExpireAgreeBranch(statekeyvalue) {
        this.reportService.getusageSearchFilter(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.expiredagreementbranchList = datas;
          })
      }
  
      //reg landlord
       public displayFnstatereg(statereg?: ownedstateList): string | undefined {
        return statereg ? statereg.name : undefined;
      }
    
      get statereg() {
        return this.regReportSearch.get('state_reg');
      }
      private getStateReg(statekeyvalue) {
        this.reportService.getStateDropDownRent(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.stateregList = datas;
          })
      }
  
      public displayFnReg(regdo?: ownedDo): string | undefined {
        return regdo ? regdo.name : undefined;
      }
    
      get regdo() {
        return this.regReportSearch.get('do_reg');
      }
      private getregDo(statekeyvalue) {
        this.reportService.getusageSearchFilter(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.regdoList = datas;
          })
      }
  
      public displayFnBranchReg(regbranch?: ownedBranch): string | undefined {
        return regbranch ? regbranch.name : undefined;
      }
    
      get regbranch() {
        return this.regReportSearch.get('branch_reg');
      }
      private getregBranch(statekeyvalue) {
        this.reportService.getusageSearchFilter(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.regbranchList = datas;
          })
      }
  
      //unreg landlord
      public displayFnstateunreg(stateunreg?: ownedstateList): string | undefined {
        return stateunreg ? stateunreg.name : undefined;
      }
    
      get stateunreg() {
        return this.unregReportSearch.get('state_unreg');
      }
      private getStateunReg(statekeyvalue) {
        this.reportService.getStateDropDownRent(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.stateunregList = datas;
          })
      }
  
      public displayFnunReg(unregdo?: ownedDo): string | undefined {
        return unregdo ? unregdo.name : undefined;
      }
    
      get unregdo() {
        return this.unregReportSearch.get('do_unreg');
      }
      private getunregDo(statekeyvalue) {
        this.reportService.getusageSearchFilter(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.unregdoList = datas;
          })
      }
  
      public displayFnBranchunReg(unregbranch?: ownedBranch): string | undefined {
        return unregbranch ? unregbranch.name : undefined;
      }
    
      get unregbranch() {
        return this.unregReportSearch.get('branch_unreg');
      }
      private getunregBranch(statekeyvalue) {
        this.reportService.getusageSearchFilter(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.unregbranchList = datas;
          })
      }
  
      //nri landlord
      public displayFnstatenri(statenri?: ownedstateList): string | undefined {
        return statenri ? statenri.name : undefined;
      }
    
      get statenri() {
        return this.nriReportSearch.get('state_nri');
      }
      private getStateNri(statekeyvalue) {
        this.reportService.getStateDropDownRent(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.statenriList = datas;
          })
      }
  
      public displayFnnrido(nrido?: ownedDo): string | undefined {
        return nrido ? nrido.name : undefined;
      }
    
      get nrido() {
        return this.nriReportSearch.get('do_nri');
      }
      private getNriDo(statekeyvalue) {
        this.reportService.getusageSearchFilter(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.nridoList = datas;
          })
      }
  
      public displayFnnribranch(nribranch?: ownedBranch): string | undefined {
        return nribranch ? nribranch.name : undefined;
      }
    
      get nribranch() {
        return this.nriReportSearch.get('branch_nri');
      }
      private getnriBranch(statekeyvalue) {
        this.reportService.getusageSearchFilter(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.nribranchList = datas;
          })
      }
  
      //closed occupancy
      public displayFnstateclosedoccupancy(stateclosedoccupancy?: ownedstateList): string | undefined {
        return stateclosedoccupancy ? stateclosedoccupancy.name : undefined;
      }
    
      get statestateclosedoccupancynri() {
        return this.closedReportSearch.get('state_closedoccupancy');
      }
      private getStateClosed(statekeyvalue) {
        this.reportService.getStateDropDownRent(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.stateclosedoccupancyList = datas;
          })
      }
  
      public displayFnclosedoccupancydo(closedoccupancydo?: ownedDo): string | undefined {
        return closedoccupancydo ? closedoccupancydo.name : undefined;
      }
    
      get closedoccupancydo() {
        return this.closedReportSearch.get('do_closedoccupancy');
      }
      private getClosedDo(statekeyvalue) {
        this.reportService.getusageSearchFilter(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.closedoccupancydoList = datas;
          })
      }
  
      public displayFnclosedoccupancybranch(closedoccupancybranch?: ownedBranch): string | undefined {
        return closedoccupancybranch ? closedoccupancybranch.name : undefined;
      }
    
      get closedoccupancybranch() {
        return this.closedReportSearch.get('branch_closedoccupancy');
      }
      private getClosedBranch(statekeyvalue) {
        this.reportService.getusageSearchFilter(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.closedoccupancybranchList = datas;
          })
      }
  
      // occupancy type 
      public displayFnstateoccupancytype(stateoccupancytype?: ownedstateList): string | undefined {
        return stateoccupancytype ? stateoccupancytype.name : undefined;
      }
    
      get stateoccupancytype() {
        return this.typeReportSearch.get('state_occupancytype');
      }
      private getStateOccType(statekeyvalue) {
        this.reportService.getStateDropDownRent(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.stateoccupancytypeList = datas;
          })
      }
  
      public displayFnoccupancytypedo(occupancytypedo?: ownedDo): string | undefined {
        return occupancytypedo ? occupancytypedo.name : undefined;
      }
    
      get occupancytypedo() {
        return this.typeReportSearch.get('do_occupancytype');
      }
      private getOccTypeDo(statekeyvalue) {
        this.reportService.getusageSearchFilter(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.occupancytypedoList = datas;
          })
      }
  
      public displayFnoccupancytypebranch(occupancytypebranch?: ownedBranch): string | undefined {
        return occupancytypebranch ? occupancytypebranch.name : undefined;
      }
    
      get occupancytypebranch() {
        return this.typeReportSearch.get('branch_occupancytype');
      }
      private getOccTypeBranch(statekeyvalue) {
        this.reportService.getusageSearchFilter(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.occupancytypebranchList = datas;
          })
      }
  
  
      
  
    memo(){
      this.vendor_flage=false;
      this.vendor_report=false;
      this.trial_balance=false;
      this.ProvisionReportScreen = false
      this.CBS_tb_screen=false;
    }
  
  
    vendor(){
      this.vendor_flage=true;
      this.vendor_report=false;
      this.trial_balance=false;
      this.ProvisionReportScreen = false;
      this.CBS_tb_screen=false;
    }
  
  
    rems(){
      this.vendor_flage=false;
      this.vendor_report=false;
      this.trial_balance=false;
      this.ProvisionReportScreen = false
      this.CBS_tb_screen=false;
    }
    PO(){
      this.vendor_flage=false; 
      this.vendor_report=false;
      this.trial_balance=false;
      this.ProvisionReportScreen = false
      this.CBS_tb_screen=false;
    }
    TA(){
      this.vendor_flage=false;
      this.vendor_report=false;
      this.trial_balance=false;
      this.ProvisionReportScreen = false
      this.CBS_tb_screen=false;
    }
    vendor_reportfn(){
      this.vendor_report=true;
      this.vendor_flage=false;
      this.trial_balance=false;
      this.ProvisionReportScreen = false
      this.CBS_tb_screen=false;
    }
    Inward(){
      this.vendor_flage=false; 
      this.vendor_report=false;
      this.trial_balance=false;
      this.ProvisionReportScreen = false
      this.CBS_tb_screen=false;
    }
    trialbalance(){
      this.vendor_flage=false; 
      this.vendor_report=false;
      this.trial_balance=true;
      this.ProvisionReportScreen = false
      this.CBS_tb_screen=false;
    }
    provisionScreenView(){
      this.vendor_flage=false; 
      this.vendor_report=false;
      this.trial_balance=false;
      this.ProvisionReportScreen = true 
      this.CBS_tb_screen=false;
    }
  
    Cbs_trailbalance(){
      this.vendor_flage=false; 
      this.vendor_report=false;
      this.trial_balance=false;
      this.ProvisionReportScreen = false
      this.CBS_tb_screen=true;
    }
  CBS_tb_screen:boolean=false
    
    branchWiseReport(){
     
      this.isTourReport = false
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isBranchpendingdetail=true
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      
      this.ispremiseown=false;
      this.occupancy=false;
      this.rent=false;
      this.agreement=false;
      this.ispremiselea=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
  
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
      this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.ProvisionReportScreen = false
  
  
  
    }
    consolidateReport(){
      
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=true
      this.isTourReport = false
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isTourdetail=false;
      
      this.ispremiseown=false;
      this.occupancy=false;
      this.rent=false;
      this.agreement=false;
      this.ispremiselea=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
  
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.ProvisionReportScreen = false
  
  
  
    }
    premiseown(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.ispremiseown=true;
      this.isTourReport = false
      this.getReportGroupForOwnedPremise();
      this.occupancy=false;
      this.rent=false;
      this.agreement=false;
      this.ispremiselea=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
  
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.ProvisionReportScreen = false
  
  
  
    }
    premiseownlea(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isTourReport = false
      this.ispremiselea=true;
      this.getReportGroupForLeasedPremise();   
      this.occupancy=false;
      this.rent=false;
      this.agreement=false;
      this.ispremiseown=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
  
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.ProvisionReportScreen = false
    }
    premiseactive(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isTourReport = false
      this.ispremiseactive= true;
      this.getReportGroupForActivePremise();
      this.ispremiseown=false;
      this.occupancy=false;
      this.rent=false;
      this.agreement=false;
      this.ispremiselea=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
  
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.ProvisionReportScreen = false
  
  
  
    }
    premiseterminated(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isTourReport = false
      this.ispremiseterminated= true;
      this.getReportGroupForTerminatedPremise();
      this.ispremiseown=false;
      this.occupancy=false;
      this.rent=false;
      this.agreement=false;
      this.ispremiselea=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
  
      this.ispremiseactive= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.ProvisionReportScreen = false
  
  
  
    }
  
    occuown(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isTourReport = false
      this.isoccuown=true
      this.getReportGroupForATM();   
      this.isocculea=false
      this.ispremiselea=false;
      // this.occupancy=false;
      // this.rent=false;
      // this.agreement=false;
      this.ispremiseown=false;
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isType = false;
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
  
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.ProvisionReportScreen = false
    }
    occulea(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isocculea=true
      this.isTourReport = false
      this.getReportGroupForBranch();  
      this.isoccuown=false
      this.ispremiselea=false;
      this.ispremiseown=false;
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isType = false;
      this.isRCN = false;
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
      this.ProvisionReportScreen = false
  
    }
    closedOccu(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isTourReport = false
      this.isClosedOccpancy=true
      this.getReportGroupForClosedOccu();
      this.isoccuown=false
      this.isocculea=false
      this.ispremiselea=false;
      this.ispremiseown=false;
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isType = false;
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
  
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.ProvisionReportScreen = false
  
    }
    occUsageType(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isTourReport = false
      this.isOccpancyUsageType=true
      this.getReportGroupForoccUsageType();
      this.isoccuown=false
      this.isocculea=false
      this.ispremiselea=false;
      this.ispremiseown=false;
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isType = false;
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
  
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.ProvisionReportScreen = false
  
    }
    occUsageCode(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isTourReport = false
      this.isOccpancyUsageCode=true
      this.getReportGroupForoccUsageCode();
      this.isoccuown=false
      this.isocculea=false
      this.ispremiselea=false;
      this.ispremiseown=false;
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isHoldRent=false
      this.isOccpancyUsageType=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isType = false;
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
  
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.ProvisionReportScreen = false
  
    }
  
    reenown(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isTourReport = false
      this.isrentown=true
      this.isoccuown=false
      this.isocculea=false
      this.ispremiselea=false;
      this.ispremiseown=false;
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isType = false;
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
  
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.ProvisionReportScreen = false
   
    }
   
    agreeown(){
  
    }
    agreelea(){
      
    }
    
    landlea(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isTourReport = false
      this.islandlea=true
      this.isoccuown=false
      this.isocculea=false
      this.ispremiselea=false;
      this.ispremiseown=false;
      this.islandown=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isType = false;
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
  
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.ProvisionReportScreen = false
  
  
    }
    gettourdetail(id){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.tourrequestno=id
      this.reportService.gettourdetailreport(this.tourrequestno)
    .subscribe(res =>{
      this.gettourdetailreportList=res
     
    })
    this.touradvance();
    this.isAdvancedetail=false
      this.isTourReport=false
      this.isTourdetail=true
      this.islandlea=false
      this.isoccuown=false
      this.isocculea=false
      this.ispremiselea=false;
      this.ispremiseown=false;
      this.islandown=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isType = false;
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
  
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.ProvisionReportScreen = false
  
    }
    touradvance(){
      this.isEnable=true
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isAdvancedetail=true
      this.isconsolidateReport=false;
      this.reportService.gettouradvancereport(this.tourrequestno)
      .subscribe(res =>{
        console.log("advanceres",res)
       this.requestno=res.tourgid
       this.reason=res.reason
       this.requestdate=this.datePipe.transform(res.requestdate, 'yyyy-MM-dd'),
       this.startdate=this.datePipe.transform(res.startdate, 'yyyy-MM-dd'),
       this.enddatee=this.datePipe.transform(res.enddate, 'yyyy-MM-dd'),
       this.touradvancee=res['detail']
       this.branch=res.branch_name
       if(res.branch_name==undefined){
        this.branch="Branch"
       }
       if(res['approver_data']){
        this.branchemployee=res['approver_data'].name
       }
       else{
        this.branchemployee="Employee"
       }
       this.branchemployee=res['approver_data'].name
      
  
        
        
        
      })
      this.isTourdetail=false;
      this.isExpensedetail=false;
     
      
      this.isTourReport=false
      
      this.islandlea=false
      this.isoccuown=false
      this.isocculea=false
      this.ispremiselea=false;
      this.ispremiseown=false;
      this.islandown=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isType = false;
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
  
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.ProvisionReportScreen = false
  
    }
    tourexpense(){
     
  
        this.reportService.gettourexpensereport(this.tourrequestno)
      .subscribe(res =>{
        this.gettourdetailreportList=res
       
      })
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isAdvancedetail=false;
        this.isTourReport=false
        this.isTourdetail=false
        this.isExpensedetail=true
        this.islandlea=false
        this.isoccuown=false
        this.isocculea=false
        this.ispremiselea=false;
        this.ispremiseown=false;
        this.islandown=false
        this.isrentlea=false
        this.isrentown=false
        this.isExpiredRentSchedule=false
        this.isClosedOccpancy=false
        this.isOccpancyUsageType=false
        this.isHoldRent=false
        this.isOccpancyUsageCode=false
        this.isUnregLandlord=false
        this.isNRILandlord=false
        this.isExpiredAgree=false
        this.isBuilding=false
        this.isType = false;
        this.isRCN = false;
        this.isProvisionReport=false
        this.isLeaseReport = false;
        this.isBeforeRunReport =false;
        this.isAfterRunReport =false;
        this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
  
        this.ispremiseactive= false;
        this.ispremiseterminated= false;
        this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
        this.ProvisionReportScreen = false
    
    
      }
      getexpensedetail(reports){
     this.expensename=reports.expensename
     this.tourgid=reports
     this.tourgid.applevel=1
     this.tourgid.empdesignation=reports.designation
     this.tourgid.empgrade=reports.emp_grade
     this.tourgid.report = 'true'
     if(this.expensename=="Lodging"){
      var datas = JSON.stringify(Object.assign({}, this.tourgid));
      localStorage.setItem('expense_details',datas)
      this.router.navigateByUrl('/lodge');
     }
     else  if(this.expensename=="Daily Diem"){
      var datas = JSON.stringify(Object.assign({}, this.tourgid));
      localStorage.setItem('expense_details',datas)
      this.router.navigateByUrl('/daily');
     }
     else  if(this.expensename=="Travelling Expenses"){
      var datas = JSON.stringify(Object.assign({}, this.tourgid));
      localStorage.setItem('expense_details',datas)
      this.router.navigateByUrl('/travel');
     }
     else  if(this.expensename=="Incidental Expenses"){
      var datas = JSON.stringify(Object.assign({}, this.tourgid));
      localStorage.setItem('expense_details',datas)
      this.router.navigateByUrl('/inci');
     }
     else  if(this.expensename=="Local Conveyance"){
      var datas = JSON.stringify(Object.assign({}, this.tourgid));
      localStorage.setItem('expense_details',datas)
      this.router.navigateByUrl('/local');
     }
     else  if(this.expensename=="Miscellaneous Charges"){
      var datas = JSON.stringify(Object.assign({}, this.tourgid));
      localStorage.setItem('expense_details',datas)
      this.router.navigateByUrl('/misc');
     }
     else  if(this.expensename=="Packaging/Freight"){
      var datas = JSON.stringify(Object.assign({}, this.tourgid));
      localStorage.setItem('expense_details',datas)
      this.router.navigateByUrl('/pack');
     }
     else  if(this.expensename=="Local Deputation Allowance"){
      var datas = JSON.stringify(Object.assign({}, this.tourgid));
      localStorage.setItem('expense_details',datas)
      this.router.navigateByUrl('/deput');
     }
      }
    gettourexpense(id){
      this.tourrequestno=id
      this.reportService.gettourexpensereport(this.tourrequestno)
    .subscribe(res =>{
      
      this.gettourexpensereportList=res['data']
     
    })
    this.isBranchpendingdetail=false
    this.isemployereport=false;
    this.isconsolidateReport=false;
      this.isAdvancedetail=false;
      this.isTourReport=false
      this.isTourdetail=false
      this.isExpensedetail=true
      this.islandlea=false
      this.isoccuown=false
      this.isocculea=false
      this.ispremiselea=false;
      this.ispremiseown=false;
      this.islandown=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isType = false;
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
  
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.MemoShow = false 
      this.ProvisionReportScreen = false
    }
    rent1(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isTourReport = false
      this.isrentown=true;
      this.getReportGroupForRent();
      this.ispremiseown=false;
      this.occupancy=false;
      this.rent=false;
      this.agreement=false;
      this.ispremiselea=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isType = false;
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
  
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.MemoShow = false; this.ProvisionReportScreen = false
    }
    holdRent(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isHoldRent=true
      this.isTourReport = false
      this.getReportGroupForHoldRent();
      this.ispremiseown=false;
      this.occupancy=false;
      this.rent=false;
      this.agreement=false;
      this.ispremiselea=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isrentown=false;
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isType = false;
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
  
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.MemoShow = false 
      this.ProvisionReportScreen = false
    }
  
    expiredRentSchedule(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isTourReport = false
      this.isExpiredRentSchedule=true;
      this.getReportGroupForexpiredRentSchedule();
      this.ispremiseown=false;
      this.occupancy=false;
      this.rent=false;
      this.isHoldRent=false;
      this.agreement=false;
      this.ispremiselea=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isrentown=false;
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isType = false;
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
  
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.MemoShow = false 
      this.ProvisionReportScreen = false
    }
  
    landlord(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isTourReport = false
      this.isrentlea = true;
      this.getReportGroupForLandlord();   
      this.isrentown=false;
      this.ispremiseown=false;
      this.occupancy=false;
      this.rent=false;
      this.agreement=false;
      this.ispremiselea=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandown=false
      this.islandlea=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isType = false;
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
  
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.MemoShow = false 
      this.ProvisionReportScreen = false
  
    }
    unRegLandLord(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isTourReport = false
      this.isUnregLandlord=true;
      this.getReportGroupForUnregLandLord();
      this.isrentown=false;
      this.ispremiseown=false;
      this.occupancy=false;
      this.rent=false;
      this.agreement=false;
      this.ispremiselea=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandown=false
      this.islandlea=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isrentlea =false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isType = false;
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
  
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.MemoShow = false 
      this.ProvisionReportScreen = false
  
    }
    NRILandLord(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isNRILandlord=true;
      this.getReportGroupForNRILandLord();
      this.isrentown=false;
      this.isTourReport = false
      this.ispremiseown=false;
      this.occupancy=false;
      this.rent=false;
      this.agreement=false;
      this.ispremiselea=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandown=false
      this.islandlea=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isrentlea = false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isType = false;
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
  
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.MemoShow = false 
      this.ProvisionReportScreen = false
    }
    agreemnt(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isTourReport = false
      this.islandown= true;
      this.getReportGroupForAgreement();  
      this.isrentlea = false; 
      this.isrentown=false;
      this.ispremiseown=false;
      this.occupancy=false;
      this.rent=false;
      this.agreement=false;
      this.ispremiselea=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandlea=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isType = false;
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
  
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.MemoShow = false 
      this.ProvisionReportScreen = false
    }
    expiredAgreemnt(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isTourReport = false
      this.isExpiredAgree=true;
      this.getReportGroupForExpiredAgreement();
      this.isrentlea = false; 
      this.isrentown=false;
      this.ispremiseown=false;
      this.occupancy=false;
      this.rent=false;
      this.agreement=false;
      this.ispremiselea=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandlea=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.islandown=false
      this.isBuilding=false
      this.isType = false;
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
  
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.MemoShow = false 
      this.ProvisionReportScreen = false
    }
  
  
    department(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isTourReport = false
      this.isdept= true;
      this.getReportGroupFordept();
    this.isemp=false;
    this.isapproved=false;
    this.isclosed=false;
    this.ispending=false;
    this.isedit=false;
    this.isreview=false;
      this.ispremiseown=false;
      this.occupancy=false;
      this.rent=false;
      this.agreement=false;
      this.ispremiselea=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      // this.MemoShow = false 
      this.ProvisionReportScreen = false
    }
    employee(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isTourReport = false
      this.isemp= true;
      this.getReportGroupForEmployee();
      this.isdept= false;
      this.isapproved=false;
    this.isclosed=false;
    this.ispending=false;
    this.isedit=false;
    this.isreview=false;
      this.ispremiseown=false;
      this.occupancy=false;
      this.rent=false;
      this.agreement=false;
      this.ispremiselea=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      // this.MemoShow = false 
    }
    approvedMemo(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isTourReport = false
      this.isapproved= true;
      this.getReportGroupForApprovedMemo();
      this.isdept= false;
      this.isemp=false;
    this.isclosed=false;
    this.ispending=false;
    this.isedit=false;
    this.isreview=false;
      this.ispremiseown=false;
      this.occupancy=false;
      this.rent=false;
      this.agreement=false;
      this.ispremiselea=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      // this.MemoShow = false 
    }
    pendingMemo(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isTourReport = false
      this.ispending= true;
      this.getReportGroupForPendingMemo();
      this.isdept= false;
      this.isemp=false;
    this.isclosed=false;
    this.isapproved=false;
    this.isedit=false;
    this.isreview=false;
      this.ispremiseown=false;
      this.occupancy=false;
      this.rent=false;
      this.agreement=false;
      this.ispremiselea=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      // this.MemoShow = false 
    }
    closedMemo(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isclosed= true;
      this.isTourReport = false
      this.getReportGroupForClosedMemo();
      this.isdept= false;
      this.isemp=false;
    this.ispending=false;
    this.isapproved=false;
    this.isedit=false;
    this.isreview=false;
      this.ispremiseown=false;
      this.occupancy=false;
      this.rent=false;
      this.agreement=false;
      this.ispremiselea=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      // this.MemoShow = false 
    }
    editandResubmittedMemo(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isedit= true;
      this.isTourReport = false
      this.getReportGroupForEdit();
      this.isdept= false;
      this.isemp=false;
    this.ispending=false;
    this.isapproved=false;
    this.isclosed=false;
    this.isreview=false;
      this.ispremiseown=false;
      this.occupancy=false;
      this.rent=false;
      this.agreement=false;
      this.ispremiselea=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      // this.MemoShow = false 
    }
    reviewandResubmittedMemo(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isreview= true;
      this.isTourReport = false
      this.getReportGroupForReview();
      this.isdept= false;
      this.isemp=false;
    this.ispending=false;
    this.isapproved=false;
    this.isclosed=false;
    this.isedit=false;
      this.ispremiseown=false;
      this.occupancy=false;
      this.rent=false;
      this.agreement=false;
      this.ispremiselea=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      // this.MemoShow = false 
    }
    
  
    //Rems
    premiseReportOLD(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isTourReport = false
      console.log("Premise selected")
      this.isType = true;
      this.isMemo = false;
      this.isOccupancy = false;
      this.isRent = false;
      this.isLandlord = false;
      this.isAgreement = false;
      this.ispremiseown=false;
      this.occupancy=false;
      this.rent=false;
      this.agreement=false;
      this.ispremiselea=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isdept= false;
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.MemoShow = false 
    }
    occupancyReport(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isTourReport = false
      this.isOccupancy = true;
      this.isMemo = false;
      this.isType = false;
      this.isRent = false;
      this.isLandlord = false;
      this.isAgreement = false;
      this.ispremiseown=false;
      this.occupancy=false;
      this.rent=false;
      this.agreement=false;
      this.ispremiselea=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isdept= false;
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.MemoShow = false 
    }
    rentReport(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isTourReport = false
      this.isRent = true;
      this.isMemo = false;
      this.isOccupancy = false;
      this.isType = false;
      this.isLandlord = false;
      this.isAgreement = false;
      this.ispremiseown=false;
      this.occupancy=false;
      this.rent=false;
      this.agreement=false;
      this.ispremiselea=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isdept= false;
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.MemoShow = false 
    }
    landlordReport(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isTourReport = false
      this.isLandlord = true;
      this.isMemo = false;
      this.isRent = false;
      this.isOccupancy = false;
      this.isType = false;
      this.isAgreement = false;
      this.ispremiseown=false;
      this.occupancy=false;
      this.rent=false;
      this.agreement=false;
      this.ispremiselea=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isdept= false;
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.MemoShow = false 
    }
    agreementReport(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isTourReport = false
      this.isAgreement = true;
      this.isMemo = false;
      this.isLandlord = false;
      this.isRent = false;
      this.isOccupancy = false;
      this.isType = false;
      this.ispremiseown=false;
      this.occupancy=false;
      this.rent=false;
      this.agreement=false;
      this.ispremiselea=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isrentown=false
      this.isExpiredRentSchedule=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isdept= false;
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.MemoShow = false 
    }
    
  
    //memo
    memoReport(){
      this.isBranchpendingdetail=false
      this.isemployereport=false;
      this.isconsolidateReport=false;
      this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
      this.isTourReport = false
      this.isMemoType = true;
      // this.isMemo = true;
      this.isType = false;
      this.isOccupancy = false;
      this.isRent = false;
      this.isLandlord = false;
      this.isAgreement = false;
      this.ispremiseown=false;
      this.occupancy=false;
      this.rent=false;
      this.agreement=false;
      this.ispremiselea=false;
      this.isoccuown=false
      this.isocculea=false
      this.islandown=false
      this.islandlea=false
      this.isrentlea=false
      this.isrentown=false
      this.isClosedOccpancy=false
      this.isOccpancyUsageType=false
      this.isHoldRent=false
      this.isOccpancyUsageCode=false
      this.isUnregLandlord=false
      this.isNRILandlord=false
      this.isExpiredAgree=false
      this.isBuilding=false
      this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
      this.isExpiredRentSchedule=false
      this.ispremiseactive= false;
      this.ispremiseterminated= false;
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.MemoShow = true 
    }
  
    insights(){
      this.router.navigate(['/insights'], { skipLocationChange: true })
  
    }
  //RCN REPORT
  RCNReport(){
    this.isBranchpendingdetail=false
    this.isemployereport=false;
    this.isconsolidateReport=false;
    this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
    this.isTourReport = false
    this.isRCNReportsummarypage = false;
    this.isRCN = true;
    this.isProvisionReport=false
    this.isLeaseReport = false;
    this.isBeforeRunReport =false;
    this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
    this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
    this.isMemoType = false;
    this.isType = false;
    this.isOccupancy = false;
    this.isRent = false;
    this.isLandlord = false;
    this.isAgreement = false;
    this.ispremiseown=false;
    this.occupancy=false;
    this.rent=false;
    this.agreement=false;
    this.ispremiselea=false;
    this.isoccuown=false
    this.isocculea=false
    this.islandown=false
    this.islandlea=false
    this.isrentlea=false
    this.isrentown=false
    this.isClosedOccpancy=false
    this.isOccpancyUsageType=false
    this.isHoldRent=false
    this.isOccpancyUsageCode=false
    this.isUnregLandlord=false
    this.isNRILandlord=false
    this.isExpiredAgree=false
    this.isBuilding=false
    this.isExpiredRentSchedule=false
    this.ispremiseactive= false;
    this.ispremiseterminated= false;
    this.MemoShow = false 
    this.getRCNMenu();
  }
  
  
  /**                               PROVISION REPORT                                */  
  
  Search : any 
  provisionReport(){
    this.isBranchpendingdetail=false
    this.isemployereport=false;
    this.isconsolidateReport=false;
    this.isTourdetail=false;
    this.isExpensedetail=false;
    this.isAdvancedetail=false;
    this.isTourReport = false
    this.isRCNReportsummarypage = false;
    this.isRCN = false;
    this.isProvisionReport=true;
    this.isLeaseReport = false;
    this.isBeforeRunReport =false;
    this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
    this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
    this.isMemoType = false;
    this.isType = false;
    this.isOccupancy = false;
    this.isRent = false;
    this.isLandlord = false;
    this.isAgreement = false;
    this.ispremiseown=false;
    this.occupancy=false;
    this.rent=false;
    this.agreement=false;
    this.ispremiselea=false;
    this.isoccuown=false
    this.isocculea=false
    this.islandown=false
    this.islandlea=false
    this.isrentlea=false
    this.isrentown=false
    this.isClosedOccpancy=false
    this.isOccpancyUsageType=false
    this.isHoldRent=false
    this.isOccpancyUsageCode=false
    this.isUnregLandlord=false
    this.isNRILandlord=false
    this.isExpiredAgree=false
    this.isBuilding=false
    this.isExpiredRentSchedule=false
    this.ispremiseactive= false;
    this.ispremiseterminated= false;
    this.MemoShow = false 
  
    this.Search={"type": "Provision_Report"}
    // this.getProvision();
    this.premisedrop();
      
    this.getUsageCodee("");
  
    this.ProvisionSearchForm.get('controlling_ofz_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.h1.getUsageCode(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.BranchCode = datas;
  
      })
    
    this.ProvisionSearchForm.get('occupancy_name_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.h1.getUsageCode(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.BranchCode = datas;
  
      })
  
      this.premisesType();
      this.getUsage();
      this.landlordType();   
  }
  
  premisesType() {
    this.remsService2.premisesType()
      .subscribe((results) => {
        this.premisesTypeData = results.data;
      })
  }
  
  landlordType() {
    this.h1.getLandlordType()
      .subscribe((results) => {
        this.landlordTypeData = results.data;
      })
  }
  
  createProFormate() {
    let data = this.ProvisionSearchForm.controls;
    let search = new provisionSearchtype();
    search.type = "Provision_Report"
    search.premise_name = data['premise_name'].value;
    search.premise_type = data['premise_type'].value;
    search.rnt_no =data['rnt_no'].value
    search.ro_no = data['ro_no'].value;
  
    search.controlling_ofz_id = data['controlling_ofz_id'].value?.id;
    search.occupancy_name_id = data['occupancy_name_id'].value?.id;
    search.occupancy_type = data['occupancy_type'].value;
    search.landlord_name = data['landlord_name'].value;
    search.landlord_type = data['landlord_type'].value;
    search.schedule_to_date = this.datePipe.transform(data['schedule_to_date'].value,"yyyy-MM-dd");
    return search;
  }
  
  ProvisionSearch() {
    this.Search = this.createProFormate();
    for (let i in this.Search) {
      if (!this.Search[i]) {
        delete this.Search[i];
      }
    }
    this.getProvision();
  }
  
  pro_nextClick() {
    if (this.has_next === true) {
      this.getProvision(this.presentpage + 1 )
    }
  }
  
  pro_previousClick() {
    if (this.has_previous === true) {
      this.getProvision(this.presentpage - 1)
    }
  }
  
  resetpro() {
    this.Search = {"type":"Provision_Report"};
    this.ProvisionSearchForm.reset();
  }
  
  private premisedrop() {
    this.h1.premisedrop()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.premisedropList = datas;
      })
  }
  
  getProvision(pageNumber = 1) {
    this.downloadDisable = true;
    this.SpinnerService.show();
    this.h1.getRemsReport(pageNumber, this.Search)
      .subscribe((results: any[]) => {  
        this.SpinnerService.hide();
        let datas = results["Data"];
        if(datas != undefined){
          let datapagination = results["Pagination"];
          this.ProvisionList = datas;
          if (this.ProvisionList.length > 0) {
            this.has_next = datapagination.has_next;
            this.has_previous = datapagination.has_previous;
            this.presentpage = datapagination.index;
            this.isProvisionList = true;
            this.h1.remsReportFileget(this.Search)
            .subscribe((result: any[]) => {
              this.fileid = result["id"];
              this.file_name = result["file_name"];
              })
              
              this.toastr.info("File download is in process.      Please wait..")
              setTimeout(()=>{
                this.downloadDisable = false;}, 250000)
          } else if (this.ProvisionList.length == 0) {
            this.isProvisionList = false;
            this.fileid = undefined;
            this.file_name = undefined;
            this.downloadDisable = true;  
          }
        }
        else{
          this.toastr.error(results['message'])
        }
       }, (error) => {
          this.errorHandler.handleError(error);
      })
  }
  
  public displayFnBr(branchType?: branchLists): string | undefined {
    return branchType ? branchType.name : undefined;
  }
  
  get branchType() {
    return this.ProvisionSearchForm.value.get('controlling_ofz_id');
  }
  
  autocompleteBranchScroll() {
    setTimeout(() => {
      if (
        this.matBrAutocomplete &&
        this.autocompleteTrigger &&
        this.matBrAutocomplete.panel
      ) {
        fromEvent(this.matBrAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matBrAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matBrAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matBrAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matBrAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.h1.getUsageCode(this.brInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.BranchCode = this.BranchCode.concat(datas);
                    if (this.BranchCode.length >= 0) {
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
  
  
  fileDownload() {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let url = environment.apiURL + "pdserv/rems_report?token=" + token;
    let anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.click();
  }
  
  
  
  
  /**                               LEASE REPORT                                */  
  
  private getStatus() {
    this.h1.getAgreementStatusAll()
      .subscribe((results) => {
        let datas = results["data"];
        this.Status = datas;
      })
  }
  
  leaseReport(){
    this.isBranchpendingdetail=false
    this.isemployereport=false;
    this.isconsolidateReport=false;
    this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
    this.isTourReport = false
    this.isRCNReportsummarypage = false;
    this.isRCN = false;
    this.isProvisionReport=false;
    this.isLeaseReport = true;
    this.isBeforeRunReport =false;
    this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
    
    this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
    this.isMemoType = false;
    this.isType = false;
    this.isOccupancy = false;
    this.isRent = false;
    this.isLandlord = false;
    this.isAgreement = false;
    this.ispremiseown=false;
    this.occupancy=false;
    this.rent=false;
    this.agreement=false;
    this.ispremiselea=false;
    this.isoccuown=false
    this.isocculea=false
    this.islandown=false
    this.islandlea=false
    this.isrentlea=false
    this.isrentown=false
    this.isClosedOccpancy=false
    this.isOccpancyUsageType=false
    this.isHoldRent=false
    this.isOccpancyUsageCode=false
    this.isUnregLandlord=false
    this.isNRILandlord=false
    this.isExpiredAgree=false
    this.isBuilding=false
    this.isExpiredRentSchedule=false
    this.ispremiseactive= false;
    this.ispremiseterminated= false;
    this.MemoShow = false 
    
    this.Search={"type": "Lease_Expire_Report"}
      // this.getLease();
      this.premisedrop();
      this.getUsageCodee("");
  
      this.LeaseSearchForm.get('controlling_ofz_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.h1.getUsageCode(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.BranchCode = datas;
  
      })
  
      this.LeaseSearchForm.get('occupancy_name_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.h1.getUsageCode(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.BranchCode = datas;
  
      })
  
      this.premisesType();
      this.getUsage();
      this.landlordType();   
  }
  
  createFormate() {
    let data = this.LeaseSearchForm.controls;
    let search = new leaseSearchtype();
    search.type = "Lease_Expire_Report"
    search.premise_name = data['premise_name'].value;
    search.premise_type = data['premise_type'].value;
    search.agreement_status =data['agreement_status'].value;
  
    search.controlling_ofz_id = data['controlling_ofz_id'].value?.id;
    search.occupancy_name_id = data['occupancy_name_id'].value?.id;
    search.usage_id = data['usage_id'].value;
    search.terminal_id = data['terminal_id'].value;
  
    search.landlord_name = data['landlord_name'].value;
    search.landlord_status = data['landlord_status'].value;   
    search.landlord_type = data['landlord_type'].value;
    search.vacation_date = data['vacation_date'].value;
  
    search.lease_start_date = this.datePipe.transform(data['lease_start_date'].value,"yyyy-MM-dd");
    search.lease_end_date = this.datePipe.transform(data['lease_end_date'].value,"yyyy-MM-dd");
    search.relaxation_start_date = this.datePipe.transform(data['relaxation_start_date'].value,"yyyy-MM-dd");
    search.relaxation_end_date = this.datePipe.transform(data['relaxation_end_date'].value,"yyyy-MM-dd");
    search.schedule_status = data['schedule_status'].value;
  
    return search;
  }
  
  LeaseSearch() {
    this.Search = this.createFormate();
    for (let i in this.Search) {
      if (!this.Search[i]) {
        delete this.Search[i];
      }
    }
    this.getLease();
  }
  
  leasse_nextClick() {
    if (this.has_next === true) {
      this.getLease(this.presentpage + 1 )
    }
  }
  
  lease_previousClick() {
    if (this.has_previous === true) {
      this.getLease(this.presentpage - 1)
    }
  }
  
  resetLease() {
    this.Search = {"type":"Lease_Expire_Report"};
    this.LeaseSearchForm.reset();
  }
  abc: number = 1
  onpremiseChange(e: number = 1) {
    this.abc = e
    this.getLease()
  
  }
  
  getLease(pageNumber = 1) {
    this.SpinnerService.show();
    this.h1.getRemsReport(pageNumber, this.Search)
      .subscribe((results: any[]) => {
        let datas = results["Data"];
        let datapagination = results["Pagination"];
        this.LeaseList = datas;
        this.SpinnerService.hide();
        if (this.LeaseList?.length > 0) {
          this.SpinnerService.show();
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
          this.isLeaseList = true;
  
          this.downloadSearch =this.downloadFormate()
  
          let js
          if(this.LeaseSearchForm.value.premiseCheck == true)
          {
            js = {
              "type":"Premise_Lease_Report" 
            }         
          }
         else
          {
            js = {
              "type":"Lease_Expire_Report" 
            }       
          }
          this.downloadSearch = Object.assign({}, this.downloadSearch, js)  
     
          for (let i in this.downloadSearch) {
            if (!this.downloadSearch[i]) {
              delete this.downloadSearch[i];
            }
          }
          this.downloadDisable = true; 
          this.h1.remsReportFileget(this.downloadSearch)
          .subscribe((result: any[]) => {
            this.fileid = result["id"];
            this.file_name = result["file_name"];
            this.toastr.info("File download is in process.      Please wait..")
            setTimeout(()=>{
              this.downloadDisable = false;}, 250000)
            this.SpinnerService.hide();
          })
        } else if (this.LeaseList.length == 0) {
          this.isLeaseList = false;
          this.fileid = undefined;
          this.file_name = undefined;
          this.downloadDisable = true;    
          this.SpinnerService.hide();
        }
      })
  }
  
  downloadSearch : any
  downloadFormate() {
    let data = this.LeaseSearchForm.controls;
    let search = new leaseSearchtype();
    search.premise_name = data['premise_name'].value;
    search.premise_type = data['premise_type'].value;
    search.agreement_status =data['agreement_status'].value;
  
    search.controlling_ofz_id = data['controlling_ofz_id'].value?.id;
    search.occupancy_name_id = data['occupancy_name_id'].value?.id;
    search.usage_id = data['usage_id'].value;
    search.terminal_id = data['terminal_id'].value;
  
    search.landlord_status = data['landlord_status'].value;   
    search.landlord_type = data['landlord_type'].value;
    search.vacation_date = data['vacation_date'].value;
  
    search.lease_start_date = this.datePipe.transform(data['lease_start_date'].value,"yyyy-MM-dd");
    search.lease_end_date = this.datePipe.transform(data['lease_end_date'].value,"yyyy-MM-dd");
    search.relaxation_start_date = this.datePipe.transform(data['relaxation_start_date'].value,"yyyy-MM-dd");
    search.relaxation_end_date = this.datePipe.transform(data['relaxation_end_date'].value,"yyyy-MM-dd");
    search.schedule_status = data['schedule_status'].value;
  
    return search;
  }
  selectPremLev(e)
  {
    this.downloadSearch =this.downloadFormate()
    let search
    let js
    if(e.checked == true)
      {
        js = {
          "type":"Premise_Lease_Report" 
        }         
      }
    else
    {
      js = {
        "type":"Lease_Expire_Report" 
      }       
    }
      search = Object.assign({}, this.downloadSearch, js)
      for (let i in search) {
        if (!search[i]) {
          delete search[i];
        }
      }  
      this.downloadDisable = true
      this.SpinnerService.show();
      this.h1.remsReportFileget(search)
          .subscribe((result: any[]) => {
            this.fileid = result["id"];
            this.toastr.info("File download is in process.      Please wait..")
            this.file_name = result["file_name"];setTimeout(()=>{
              this.downloadDisable = false;}, 250000)    
            this.SpinnerService.hide();
          })
  }
  
  
  /**                               BEFORE RUN REPORT                                */  
  chk_upfront:boolean;
  chk_regular:boolean;
  
  beforeRunReport(){
    this.isBranchpendingdetail=false
    this.isemployereport=false;
    this.isconsolidateReport=false;
    this.isTourdetail=false;
    this.isExpensedetail=false;
    this.isAdvancedetail=false;
    this.isTourReport = false
    this.isRCNReportsummarypage = false;
    this.isRCN = false;
  
    this.isProvisionReport=false;
    this.isLeaseReport = false;
    this.isBeforeRunReport =true;
    this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;  
      this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
    this.isMemoType = false;
    this.isType = false;
    this.isOccupancy = false;
    this.isRent = false;
    this.isLandlord = false;
    this.isAgreement = false;
    this.ispremiseown=false;
    this.occupancy=false;
    this.rent=false;
    this.agreement=false;
    this.ispremiselea=false;
    this.isoccuown=false
    this.isocculea=false
    this.islandown=false
    this.islandlea=false
    this.isrentlea=false
    this.isrentown=false
    this.isClosedOccpancy=false
    this.isOccpancyUsageType=false
    this.isHoldRent=false
    this.isOccpancyUsageCode=false
    this.isUnregLandlord=false
    this.isNRILandlord=false
    this.isExpiredAgree=false
    this.isBuilding=false
    this.isExpiredRentSchedule=false
    this.ispremiseactive= false;
    this.ispremiseterminated= false;
    this.MemoShow = false 
  
    this.Search={"type": "Schedule_Before_Run_Report"}
    // this.getBeforeRun();
    this.premisedrop();
      
    this.getUsageCodee("");
  
    this.beforeRunSearchForm.get('controlling_ofz_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.h1.getUsageCode(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.BranchCode = datas;
  
      })
  
      this.premisesType();
      this.getUsage();
      this.landlordType();   
  }
  
  createBeforeRunFormate() {
    let data = this.beforeRunSearchForm.controls;
    let search = new beforeRunSearchtype();
    search.type = "Schedule_Before_Run_Report"
    search.premise_name = data['premise_name'].value;
    search.premise_type = data['premise_type'].value;
    search.agreement_status =data['agreement_status'].value  
    search.controlling_ofz_id = data['controlling_ofz_id'].value?.id;
    search.schedule_from_date = this.datePipe.transform(data['schedule_from_date'].value,"yyyy-MM-dd");
    search.schedule_to_date = this.datePipe.transform(data['schedule_to_date'].value,"yyyy-MM-dd");
    search.regular = data['regular'].value ? true : undefined
    search.upfront = data['upfront'].value ? true : undefined
  
    return search;
  }
  
  BeforeRunSearch() {
    this.Search = this.createBeforeRunFormate();
    if(this.Search.schedule_from_date == null && this.Search.schedule_to_date != null)
    {
      this.toastr.error("Please select Schedule From Date.")
      return false
    }
    if(this.Search.schedule_from_date != null && this.Search.schedule_to_date == null)
    {
      this.toastr.error("Please select Schedule To Date.")
      return false
    }
    for (let i in this.Search) {
      if (!this.Search[i]) {
        delete this.Search[i];
      }
    }
    this.getBeforeRun();
  }
  
  beforeRun_nextClick() {
    if (this.has_next === true) {
      this.getBeforeRun(this.presentpage + 1 )
    }
  }
  
  beforeRun_previousClick() {
    if (this.has_previous === true) {
      this.getBeforeRun(this.presentpage - 1)
    }
  }
  
  resetbeforeRun() {
    this.Search = {"type":"Schedule_Before_Run_Report"};
    this.beforeRunSearchForm.reset();
  }
  
  getBeforeRun(pageNumber = 1) {
    this.SpinnerService.show();
    this.h1.getRemsReport(pageNumber, this.Search)
      .subscribe((results: any[]) => {
        let datas = results["Data"];
        let datapagination = results["Pagination"];
        this.beforeRunList = datas;
        if (this.beforeRunList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
          this.isBeforeRunList = true;
          this.SpinnerService.hide();
          this.downloadDisable = true;    
          this.h1.remsReportFileget(this.Search)
          .subscribe((result: any[]) => {
            this.fileid = result["id"];
            this.file_name = result["file_name"]; 
          })
          this.toastr.info("File download is in process.      Please wait..")
          setTimeout(()=>{
            this.downloadDisable = false;}, 250000)
        } else if (this.beforeRunList.length == 0) {
          this.beforeRunList = false;
          this.fileid = undefined;
          this.file_name = undefined;
          this.downloadDisable = true;    
          this.SpinnerService.hide();
        }
      })
  }
  
  
  
  /**                               AFTER RUN REPORT                                */  
  
  afterRunReport(){
    this.isBranchpendingdetail=false
    this.isemployereport=false;
    this.isconsolidateReport=false;
    this.isTourdetail=false;
    this.isExpensedetail=false;
    this.isAdvancedetail=false;
    this.isTourReport = false
    this.isRCNReportsummarypage = false;
    this.isRCN = false;
    this.isProvisionReport=false;
    this.isLeaseReport = false;
    this.isBeforeRunReport =false;
    this.isAfterRunReport =true;
    this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
   
    this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
    this.isMemoType = false;
    this.isType = false;
    this.isOccupancy = false;
    this.isRent = false;
    this.isLandlord = false;
    this.isAgreement = false;
    this.ispremiseown=false;
    this.occupancy=false;
    this.rent=false;
    this.agreement=false;
    this.ispremiselea=false;
    this.isoccuown=false
    this.isocculea=false
    this.islandown=false
    this.islandlea=false
    this.isrentlea=false
    this.isrentown=false
    this.isClosedOccpancy=false
    this.isOccpancyUsageType=false
    this.isHoldRent=false
    this.isOccpancyUsageCode=false
    this.isUnregLandlord=false
    this.isNRILandlord=false
    this.isExpiredAgree=false
    this.isBuilding=false
    this.isExpiredRentSchedule=false
    this.ispremiseactive= false;
    this.ispremiseterminated= false;
    this.MemoShow = false 
  
    this.Search={"type": "Schedule_After_Run_Report"}
    // this.getAfterRun();
    this.premisedrop();
      
    this.getUsageCodee("");
  
    this.afterRunSearchForm.get('controlling_ofz_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.h1.getUsageCode(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.BranchCode = datas;
  
      })
      this.premisesType();
      this.getUsage();
      this.landlordType();   
  }
  
  createAfterRunFormate() {
    let data = this.afterRunSearchForm.controls;
    let search = new afterRunSearchtype();
    search.type = "Schedule_After_Run_Report"
    search.premise_name = data['premise_name'].value;
    search.premise_type = data['premise_type'].value;
    search.agreement_status =data['agreement_status'].value  
    search.controlling_ofz_id = data['controlling_ofz_id'].value?.id;
    search.schedule_from_date = this.datePipe.transform(data['schedule_from_date'].value,"yyyy-MM-dd");
    search.schedule_to_date = this.datePipe.transform(data['schedule_to_date'].value,"yyyy-MM-dd");
    search.regular = data['regular'].value ? true : undefined
    search.upfront = data['upfront'].value ? true : undefined
  
    return search;
  }
  
  AfterRunSearch() {
    this.Search = this.createAfterRunFormate();
    if(this.Search.schedule_from_date == null && this.Search.schedule_to_date != null)
    {
      this.toastr.error("Please select Schedule From Date.")
      return false
    }
    if(this.Search.schedule_from_date != null && this.Search.schedule_to_date == null)
    {
      this.toastr.error("Please select Schedule To Date.")
      return false
    }
    for (let i in this.Search) {
      if (!this.Search[i]) {
        delete this.Search[i];
      }
    }
    this.getAfterRun();
  }
  
  afterRun_nextClick() {
    if (this.has_next === true) {
      this.getAfterRun(this.presentpage + 1 )
    }
  }
  
  afterRun_previousClick() {
    if (this.has_previous === true) {
      this.getAfterRun(this.presentpage - 1)
    }
  }
  
  resetAfterRun() {
    this.Search = {"type":"Schedule_After_Run_Report"};
    this.afterRunSearchForm.reset();
  }
  
  getAfterRun(pageNumber = 1) {
    this.SpinnerService.show();
    this.h1.getRemsReport(pageNumber, this.Search)
      .subscribe((results: any[]) => {
        let datas = results["Data"];
        let datapagination = results["Pagination"];
        this.afterRunList = datas;
        if (this.afterRunList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
          this.isAfterRunList = true;
          this.SpinnerService.hide();
          this.downloadDisable = true;    
          this.h1.remsReportFileget(this.Search)
          .subscribe((result: any[]) => {
            this.fileid = result["id"];
            this.file_name = result["file_name"];
          })
  
          this.toastr.info("File download is in process.      Please wait..")
          setTimeout(()=>{
            this.downloadDisable = false;}, 250000)
        } else if (this.afterRunList.length == 0) {
          this.isAfterRunList = false;
          this.fileid = undefined;
          this.file_name = undefined;
          this.downloadDisable = true;    
          this.SpinnerService.hide();
        }
      })
  }
  
  
  
  /**                               PREMISE REPORT                                */  
  
  private getPremiseStatus() {
    this.reportService.premiseStatus()
      .subscribe((results) => {
        let datas = results["data"];
        this.premiseStatus = datas;
      })
  }
  
  premiseReport(){
    this.isBranchpendingdetail=false
    this.isemployereport=false;
    this.isconsolidateReport=false;
    this.isTourdetail=false;
    this.isExpensedetail=false;
    this.isAdvancedetail=false;
    this.isTourReport = false
    this.isRCNReportsummarypage = false;
    this.isRCN = false;
    this.isProvisionReport=false;
    this.isLeaseReport = false;
    this.isBeforeRunReport =false;
    this.isAfterRunReport =false;
    this.isPremiseReport =true;
    this.isMasterReport =false;
      this.isPaymentReport =false;
  
    this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
    this.isMemoType = false;
    this.isType = false;
    this.isOccupancy = false;
    this.isRent = false;
    this.isLandlord = false;
    this.isAgreement = false;
    this.ispremiseown=false;
    this.occupancy=false;
    this.rent=false;
    this.agreement=false;
    this.ispremiselea=false;
    this.isoccuown=false
    this.isocculea=false
    this.islandown=false
    this.islandlea=false
    this.isrentlea=false
    this.isrentown=false
    this.isClosedOccpancy=false
    this.isOccpancyUsageType=false
    this.isHoldRent=false
    this.isOccpancyUsageCode=false
    this.isUnregLandlord=false
    this.isNRILandlord=false
    this.isExpiredAgree=false
    this.isBuilding=false
    this.isExpiredRentSchedule=false
    this.ispremiseactive= false;
    this.ispremiseterminated= false;
    this.MemoShow = false 
  
    this.Search={"type": "Premise_Report"}
    this.premisedrop();
      
    this.getUsageCodee("");
  
    this.PremiseSearchForm.get('controlling_ofz_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.h1.getUsageCode(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.BranchCode = datas;
  
      })
  
      this.PremiseSearchForm.get('occupancy_name_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.h1.getUsageCode(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.BranchCode = datas;
      })
  
  
      this.PremiseSearchForm.get('state_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.reportService.getStateDropDownRent(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.stateList = datas;
  
        })
  
  
      this.premisesType();
      this.getUsage();
      this.landlordType(); 
      this.getPremiseStatus();  
  }
  
  createPremiseFormate() {
    let data = this.PremiseSearchForm.controls;
    let search = new premiseSearchtype();
    search.type = "Premise_Report"
    search.premise_name = data['premise_name'].value;
    search.premise_type = data['premise_type'].value;
    search.premise_status =data['premise_status'].value  
    search.controlling_ofz_id = data['controlling_ofz_id'].value?.id;
    search.occupancy_name_id = data['occupancy_name_id'].value?.id;
    search.occupancy_type = data['occupancy_type'].value;
    search.lease_start_date = this.datePipe.transform(data['lease_start_date'].value,"yyyy-MM-dd");
    search.lease_end_date = this.datePipe.transform(data['lease_end_date'].value,"yyyy-MM-dd");
    search.premises_sqft = data['premises_sqft'].value;
    search.city_name = data['city_name'].value;
    search.district_name = data['district_name'].value;
    search.state_id = data['state_id'].value?.id;
   
    return search;
  }
  
  PremiseSearch() {
    this.Search = this.createPremiseFormate();
    for (let i in this.Search) {
      if (!this.Search[i]) {
        delete this.Search[i];
      }
    }
    this.getPremise();
  }
  
  premise_nextClick() {
    if (this.has_next === true) {
      this.getPremise(this.presentpage + 1 )
    }
  }
  
  premise_previousClick() {
    if (this.has_previous === true) {
      this.getPremise(this.presentpage - 1)
    }
  }
  
  resetPremise() {
    this.Search = {"type":"Premise_Report"};
    this.PremiseSearchForm.reset();
  }
  
  getPremise(pageNumber = 1) {
    this.SpinnerService.show();
    this.h1.getRemsReport(pageNumber, this.Search)
      .subscribe((results: any[]) => {
        let datas = results["Data"];
        let datapagination = results["Pagination"];
        this.premiseReportList = datas;
        if (this.premiseReportList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
          this.isPremiseList = true;
          this.SpinnerService.hide();
          this.downloadDisable = true;    
          this.h1.remsReportFileget(this.Search)
          .subscribe((result: any[]) => {
            this.fileid = result["id"];
            this.file_name = result["file_name"];
          })
  
          this.toastr.info("File download is in process.      Please wait..")
          setTimeout(()=>{
            this.downloadDisable = false;}, 250000)
          
        } else if (this.premiseReportList.length == 0) {
          this.isPremiseList = false;
          this.fileid = undefined;
          this.file_name = undefined;
          this.downloadDisable = true;    
          this.SpinnerService.hide();
        }
      })
  }
  
  
  
  /**                               MASTER REPORT                                */  
  
  masterReport(){
    this.isBranchpendingdetail=false
    this.isemployereport=false;
    this.isconsolidateReport=false;
    this.isTourdetail=false;
    this.isExpensedetail=false;
    this.isAdvancedetail=false;
    this.isTourReport = false
    this.isRCNReportsummarypage = false;
    this.isRCN = false;
    this.isProvisionReport=false;
    this.isLeaseReport = false;
    this.isBeforeRunReport =false;
    this.isAfterRunReport =false;
    this.isPremiseReport =false;
    this.isMasterReport =true;
    this.isPaymentReport =false;
    
  
    this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
    this.isMemoType = false;
    this.isType = false;
    this.isOccupancy = false;
    this.isRent = false;
    this.isLandlord = false;
    this.isAgreement = false;
    this.ispremiseown=false;
    this.occupancy=false;
    this.rent=false;
    this.agreement=false;
    this.ispremiselea=false;
    this.isoccuown=false
    this.isocculea=false
    this.islandown=false
    this.islandlea=false
    this.isrentlea=false
    this.isrentown=false
    this.isClosedOccpancy=false
    this.isOccpancyUsageType=false
    this.isHoldRent=false
    this.isOccpancyUsageCode=false
    this.isUnregLandlord=false
    this.isNRILandlord=false
    this.isExpiredAgree=false
    this.isBuilding=false
    this.isExpiredRentSchedule=false
    this.ispremiseactive= false;
    this.ispremiseterminated= false;
    this.MemoShow = false 
  
    this.Search={"type": "Master_Report"}
    this.premisedrop();
      
    this.getUsageCodee("");
  
    this.MasterSearchForm.get('controlling_ofz_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.h1.getUsageCode(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.BranchCode = datas;
  
      })
  
      this.MasterSearchForm.get('occupancy_name_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.h1.getUsageCode(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.BranchCode = datas;
  
      })
  
      this.premisesType();
      this.getUsage();
      this.landlordType();   
  }
  
  createMasterFormate() {
    let data = this.MasterSearchForm.controls;
    let search = new masterSearchtype();
    search.type = "Master_Report"
    search.premise_name = data['premise_name'].value;
    search.premise_type = data['premise_type'].value;
    search.agreement_status =data['agreement_status'].value  
    search.controlling_ofz_id = data['controlling_ofz_id'].value?.id;
    search.occupancy_name_id = data['occupancy_name_id'].value?.id;
    search.occupancy_type = data['occupancy_type'].value;
    search.lease_start_date = this.datePipe.transform(data['lease_start_date'].value,"yyyy-MM-dd");
    search.lease_end_date = this.datePipe.transform(data['lease_end_date'].value,"yyyy-MM-dd");
    search.term_from_date = this.datePipe.transform(data['term_from_date'].value,"yyyy-MM-dd");
    search.term_to_date = this.datePipe.transform(data['term_to_date'].value,"yyyy-MM-dd");
    search.landlord_name = data['landlord_name'].value;
    search.landlord_type = data['landlord_type'].value;
    search.regular = data['regular'].value ? true : undefined
    search.upfront = data['upfront'].value ? true : undefined
   
    return search;
  }
  
  MasterSearch() {
    this.Search = this.createMasterFormate();
    for (let i in this.Search) {
      if (!this.Search[i]) {
        delete this.Search[i];
      }
    }
    this.getMaster();
  }
  
  master_nextClick() {
    if (this.has_next === true) {
      this.getMaster(this.presentpage + 1 )
    }
  }
  
  master_previousClick() {
    if (this.has_previous === true) {
      this.getMaster(this.presentpage - 1)
    }
  }
  
  resetMaster() {
    this.Search = {"type":"Master_Report"};
    this.MasterSearchForm.reset();
  }
  
  getMaster(pageNumber = 1) {
    this.SpinnerService.show();
    this.h1.getRemsReport(pageNumber, this.Search)
      .subscribe((results: any[]) => {
        let datas = results["Data"];
        let datapagination = results["Pagination"];
        this.masterReportList = datas;
        if (this.masterReportList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
          this.isMasterList = true;
          this.SpinnerService.hide();
          this.downloadDisable = true;    
          this.h1.remsReportFileget(this.Search)
          .subscribe((result: any[]) => {
            this.fileid = result["id"];
            this.file_name = result["file_name"];
          })
  
          this.toastr.info("File download is in process.      Please wait..")
          setTimeout(()=>{
            this.downloadDisable = false;}, 250000)
          
        } else if (this.masterReportList.length == 0) {
          this.isMasterList = false;
          this.fileid = undefined;
          this.file_name = undefined;
          this.downloadDisable = true;    
          this.SpinnerService.hide();
        }
      })
  }
  
  
  
  
  
  
  
  
  /**                               PAYMENT REPORT                                */  
  
  paymentReport(){
    this.isBranchpendingdetail=false
    this.isemployereport=false;
    this.isconsolidateReport=false;
    this.isTourdetail=false;
    this.isExpensedetail=false;
    this.isAdvancedetail=false;
    this.isTourReport = false
    this.isRCNReportsummarypage = false;
    this.isRCN = false;
    this.isProvisionReport=false;
    this.isLeaseReport = false;
    this.isBeforeRunReport =false;
    this.isAfterRunReport =false;
    this.isPremiseReport =false;
    this.isMasterReport =false;
    this.isPaymentReport =true;
  
    this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
    this.isMemoType = false;
    this.isType = false;
    this.isOccupancy = false;
    this.isRent = false;
    this.isLandlord = false;
    this.isAgreement = false;
    this.ispremiseown=false;
    this.occupancy=false;
    this.rent=false;
    this.agreement=false;
    this.ispremiselea=false;
    this.isoccuown=false
    this.isocculea=false
    this.islandown=false
    this.islandlea=false
    this.isrentlea=false
    this.isrentown=false
    this.isClosedOccpancy=false
    this.isOccpancyUsageType=false
    this.isHoldRent=false
    this.isOccpancyUsageCode=false
    this.isUnregLandlord=false
    this.isNRILandlord=false
    this.isExpiredAgree=false
    this.isBuilding=false
    this.isExpiredRentSchedule=false
    this.ispremiseactive= false;
    this.ispremiseterminated= false;
    this.MemoShow = false 
  
    this.Search={"type": "Rent_Paid_NotPaid_Report"}
    this.premisedrop();
      
    this.getUsageCodee("");
  
    this.PaymentSearchForm.get('controlling_ofz_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.h1.getUsageCode(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.BranchCode = datas;
  
    })
  
    this.premisesType();
    this.getUsage();
    this.landlordType();   
    this.paidStatus();   
  }
  
  paidstatus :any;
  paidStatus() {
    this.h1.getPaidStatus()
      .subscribe((results) => {
        this.paidstatus = results.data;
      })
  }
  
  createPaymentFormate() {
    let data = this.PaymentSearchForm.controls;
    let search = new paymentSearchtype();
    search.type = "Rent_Paid_NotPaid_Report"
    search.premise_name = data['premise_name'].value;
    search.premise_type = data['premise_type'].value;
    search.occupancy_type = data['occupancy_type'].value;
    search.controlling_ofz_id = data['controlling_ofz_id'].value?.id;
    search.landlord_share_amt = data['landlord_share_amt'].value;
    search.schedule_from_date = this.datePipe.transform(data['schedule_from_date'].value,"yyyy-MM-dd");
    search.schedule_to_date = this.datePipe.transform(data['schedule_to_date'].value,"yyyy-MM-dd");
    search.landlord_name = data['landlord_name'].value;
    search.landlord_type = data['landlord_type'].value;
    search.RNT_No = data['RNT_No'].value;
    search.ro_number = data['ro_number'].value;
    search.paid_status = data['paid_status'].value;
   
    return search;
  }
  
  PaymentSearch() {
    this.Search = this.createPaymentFormate();
    for (let i in this.Search) {
      if (!this.Search[i]) {
        delete this.Search[i];
      }
    }
    this.getPayment();
  }
  
  payment_nextClick() {
    if (this.has_next === true) {
      this.getMaster(this.presentpage + 1 )
    }
  }
  
  payment_previousClick() {
    if (this.has_previous === true) {
      this.getPayment(this.presentpage - 1)
    }
  }
  procurement_nextClick() {
    if (this.hasres_next === true) {
      this.ProcurementSearchs(this.presentpageres + 1 )
    }
  }
  
  procurement_previousClick() {
    if (this.hasres_previous === true) {
      this.ProcurementSearchs(this.presentpageres - 1)
    }
  }
  
  resetPayment() {
    this.Search = {"type":"Rent_Paid_NotPaid_Report"};
    this.PaymentSearchForm.reset();
  }
  
  getPayment(pageNumber = 1) {
    this.SpinnerService.show();
    this.h1.getRemsReport(pageNumber, this.Search)
      .subscribe((results: any[]) => {
        let datas = results["Data"];
        let datapagination = results["Pagination"];
        this.paymentReportList = datas;
        if (this.paymentReportList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
          this.isPaymentList = true;
          this.SpinnerService.hide();
          this.downloadDisable = true;    
          this.h1.remsReportFileget(this.Search)
          .subscribe((result: any[]) => {
            this.fileid = result["id"];
            this.file_name = result["file_name"];
          })
  
          this.toastr.info("File download is in process.      Please wait..")
          setTimeout(()=>{
            this.downloadDisable = false;}, 250000)
          
        } else if (this.paymentReportList.length == 0) {
          this.isPaymentList = false;
          this.fileid = undefined;
          this.file_name = undefined;
          this.downloadDisable = true;    
          this.SpinnerService.hide();
        }
      })
  }
  
  
  
  
  
  
  employeeReport(){
    this.empreportSearch(this.send_value,this.currentpage,this.pagesize);
    this.isBranchpendingdetail=false
    this.isTourdetail=false;
    this.isconsolidateReport=false;
    this.isExpensedetail=false;
    this.isAdvancedetail=false;
    this.isTourReport = false
    this.isemployereport=true;
    this.isRCNReportsummarypage = false;
    this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
      
    this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
    this.isMemoType = false;
    this.isType = false;
    this.isOccupancy = false;
    this.isRent = false;
    this.isLandlord = false;
    this.isAgreement = false;
    this.ispremiseown=false;
    this.occupancy=false;
    this.rent=false;
    this.agreement=false;
    this.ispremiselea=false;
    this.isoccuown=false
    this.isocculea=false
    this.islandown=false
    this.islandlea=false
    this.isrentlea=false
    this.isrentown=false
    this.isClosedOccpancy=false
    this.isOccpancyUsageType=false
    this.isHoldRent=false
    this.isOccpancyUsageCode=false
    this.isUnregLandlord=false
    this.isNRILandlord=false
    this.isExpiredAgree=false
    this.isBuilding=false
    this.isExpiredRentSchedule=false
    this.ispremiseactive= false;
    this.ispremiseterminated= false;
    this.MemoShow = false 
    this.getRCNMenu();
  }
  tourReport(){
    this.tourSearch(this.send_value,this.currentpage,this.pagesize);
    this.isBranchpendingdetail=false
    this.isemployereport=false;
    this.isconsolidateReport=false;
    this.isTourdetail=false;
      this.isExpensedetail=false;
      this.isAdvancedetail=false;
    
    this.isTourReport = true
    this.isRent = false;
    this.isMemo = false;
    this.isOccupancy = false;
    this.isType = false;
    this.isLandlord = false;
    this.isAgreement = false;
    this.ispremiseown=false;
    this.occupancy=false;
    this.rent=false;
    this.agreement=false;
    this.ispremiselea=false;
    this.isoccuown=false
    this.isocculea=false
    this.islandown=false
    this.islandlea=false
    this.isrentlea=false
    this.isrentown=false
    this.isExpiredRentSchedule=false
    this.isClosedOccpancy=false
    this.isOccpancyUsageType=false
    this.isHoldRent=false
    this.isOccpancyUsageCode=false
    this.isUnregLandlord=false
    this.isNRILandlord=false
    this.isExpiredAgree=false
    this.isBuilding=false
    this.isdept= false;
    this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
    this.ispremiseactive= false;
    this.ispremiseterminated= false;
    this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
    this.MemoShow = false 
  }
  RCNSearch(){
  
    if(this.RcnReportSearch.value.from_date === "" || null || undefined ){
      this.toastr.warning("Choose required From_date")
      return
    }
    if(this.RcnReportSearch.value.to_date === "" || null || undefined ){
      this.toastr.warning("Choose required To_date")
      return
    }
  
    let fromdate = this.RcnReportSearch.value.from_date
    let fromdates = this.datePipe.transform(fromdate, 'yyyy-MM-dd');
    this.RcnReportSearch.value.from_date = fromdates;
  
    let todate = this.RcnReportSearch.value.to_date
    let todates = this.datePipe.transform(todate, 'yyyy-MM-dd');
    this.RcnReportSearch.value.to_date = todates;
  
    this.reportService.RCNReportSearch(this.RcnReportSearch.value.from_date, this.RcnReportSearch.value.to_date)
      .subscribe(result => {
        this.RcnReportList= result['data']
        //console.log("RcnReportList", this.RcnReportList)
      })
  
  }
  RCNReset(){
    this.RcnReportSearch.reset();
    this.getRcnReportSummary();
  }
  
  exportexcel(): void {
  
    if (this.RcnReportSearch.value.from_date !== '' && this.RcnReportSearch.value.to_date === '') {
      this.toastr.warning("Please enter 'To Date' ")
      return
    }
  
    if (this.RcnReportSearch.value.to_date !== '' && this.RcnReportSearch.value.from_date === '') {
      this.toastr.warning("Please enter 'To Date' ")
      return
    }
    
    if (this.RcnReportSearch.value.from_date > this.RcnReportSearch.value.to_date) {
      this.toastr.warning(" FROM date must be lesser than TO date ")
      return
    }
  
    if(this.RcnReportSearch.value.from_date != "" || null || undefined ){
    let fromdate = this.RcnReportSearch.value.from_date
    let fromdates = this.datePipe.transform(fromdate, 'yyyy-MM-dd');
    this.RcnReportSearch.value.from_date = fromdates;
    }
    if(this.RcnReportSearch.value.to_date != "" || null || undefined ){
      let todate = this.RcnReportSearch.value.to_date
      let todates = this.datePipe.transform(todate, 'yyyy-MM-dd');
      this.RcnReportSearch.value.to_date = todates;
    }
  
    this.reportService.getrcnExcel(this.RcnReportSearch.value.from_date, this.RcnReportSearch.value.to_date)
      .subscribe((data) => {
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'Rent Confirmation Note'+".xlsx";
        link.click();
        })
    }
  
       
  
      getRCNMenu(){
        this.reportService.getrcnmenu()
            .subscribe((results: any) => {
              let datas = results.data
              for (let i in datas){
              if(datas[i].name === "RCN"){
                let menulist = datas[i].report
                this.RCNMenuList = menulist
              }}
            })
      }
      isRCNReportsummarypage:boolean
  
  
      getrcnreportsummaryPage(data){
        if(data.name == "Rent Not Conformed"){
          this.isRCNReportsummarypage = true
          this.getRcnReportSummary();
        }
  
      }
  
    
      getRcnReportSummary() {
        this.SpinnerService.show();
      this.reportService.getRcnReportSummary()
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.RcnReportList = datas;
          this.SpinnerService.hide();
          console.log("RcnReportList", this.RcnReportList)
        })
    }
  
  
  
    //////////////////////////////////////////////////////////////////////////////////////////////////////////PO Module Report
  
  
  // //POModule REPORT
  // POModulereport(){
  //   this.isRCNReportsummarypage = false;
  //   this.isRCN = false;
  //   this.isPOReport = true
  //   this.isMemoType = false;
  //   this.isType = false;
  //   this.isOccupancy = false;
  //   this.isRent = false;
  //   this.isLandlord = false;
  //   this.isAgreement = false;
  //   this.ispremiseown=false;
  //   this.occupancy=false;
  //   this.rent=false;
  //   this.agreement=false;
  //   this.ispremiselea=false;
  //   this.isoccuown=false
  //   this.isocculea=false
  //   this.islandown=false
  //   this.islandlea=false
  //   this.isrentlea=false
  //   this.isrentown=false
  //   this.isClosedOccpancy=false
  //   this.isOccpancyUsageType=false
  //   this.isHoldRent=false
  //   this.isOccpancyUsageCode=false
  //   this.isUnregLandlord=false
  //   this.isNRILandlord=false
  //   this.isExpiredAgree=false
  //   this.isBuilding=false
  //   this.isExpiredRentSchedule=false
  //   this.ispremiseactive= false;
  //   this.ispremiseterminated= false;
  //   this.getRCNMenu();
  // }
  
  // POModulereportReset(){
  //   this.POReportExcel.reset();
  // }
  
  // exportexcelPO(): void {
  // let search = this.POReportExcel.value
  //   if (this.POReportExcel.value.from_date !== '' && this.POReportExcel.value.to_date === '') {
  //     this.toastr.warning("Please enter 'To Date' ")
  //     return
  //   }
  
  //   if (this.POReportExcel.value.to_date !== '' && this.POReportExcel.value.from_date === '') {
  //     this.toastr.warning("Please enter 'To Date' ")
  //     return
  //   }
    
  //   if (this.POReportExcel.value.from_date > this.POReportExcel.value.to_date) {
  //     this.toastr.warning(" FROM date must be lesser than TO date ")
  //     return
  //   }
  
  //   if(this.POReportExcel.value.from_date != "" || null || undefined ){
  //   let fromdate = this.POReportExcel.value.from_date
  //   let fromdates = this.datePipe.transform(fromdate, 'yyyy-MM-dd');
  //   this.POReportExcel.value.from_date = fromdates;
  //   }
  //   if(this.POReportExcel.value.to_date != "" || null || undefined ){
  //     let todate = this.POReportExcel.value.to_date
  //     let todates = this.datePipe.transform(todate, 'yyyy-MM-dd');
  //     this.POReportExcel.value.to_date = todates;
  //   }
  
  // //   let data = {
  // //     "from_date":this.POReportExcel.value.from_date,
  // //     "to_date":this.POReportExcel.value.to_date
  // // }
  // for (let i in search) {
  //   if (!search[i]) {
  //     delete search[i];
  //   }
  // }
  
  //   this.reportService.getPOExcel(search)
  //     .subscribe((data) => {
  //       let binaryData = [];
  //       binaryData.push(data)
  //       let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
  //       let link = document.createElement('a');
  //       link.href = downloadUrl;
  //       link.download = 'PCA Utilization Report'+".xlsx";
  //       link.click();
  //       })
  
  
  
  // }
  // POutilSearchList: any
  // PoUtilSearch(){
  
  //   let search = this.POReportExcel.value
  //   if (this.POReportExcel.value.from_date !== '' && this.POReportExcel.value.to_date === '') {
  //     this.toastr.warning("Please enter 'To Date' ")
  //     return
  //   }
  
  //   if (this.POReportExcel.value.to_date !== '' && this.POReportExcel.value.from_date === '') {
  //     this.toastr.warning("Please enter 'To Date' ")
  //     return
  //   }
    
  //   if (this.POReportExcel.value.from_date > this.POReportExcel.value.to_date) {
  //     this.toastr.warning(" FROM date must be lesser than TO date ")
  //     return
  //   }
  
  //   if(this.POReportExcel.value.from_date != "" || null || undefined ){
  //   let fromdate = this.POReportExcel.value.from_date
  //   let fromdates = this.datePipe.transform(fromdate, 'yyyy-MM-dd');
  //   this.POReportExcel.value.from_date = fromdates;
  //   }
  //   if(this.POReportExcel.value.to_date != "" || null || undefined ){
  //     let todate = this.POReportExcel.value.to_date
  //     let todates = this.datePipe.transform(todate, 'yyyy-MM-dd');
  //     this.POReportExcel.value.to_date = todates;
  //   }
  
  // //   let data = {
  // //     "from_date":this.POReportExcel.value.from_date,
  // //     "to_date":this.POReportExcel.value.to_date
  // // }
  // for (let i in search) {
  //   if (!search[i]) {
  //     delete search[i];
  //   }
  // }
  // if(search == {}){
  //   this.toastr.warning('Please select atleast one...')
  //   return false
  // }
  // this.reportService.POReportSearch(search)
  //     .subscribe((results) => {
  //       console.log("Utilization Report",results) 
  //       let data = results['data']
  //       this.POutilSearchList = data
  //     })
  
  
  // }
  
  
  
  
  
  
  // parnoList: Array<parnolistss>;
  // @ViewChild('parno') matparnoAutocomplete: MatAutocomplete;
  // @ViewChild('parnoInput') parnoInput: any;
  // displayFnparno(parno?: any) {
  //   if ((typeof parno) === 'string') {
  //     return parno;
  //   }
  //   return parno ? this.parnoList.find(_ => _.no === parno).no : undefined;
  // }
  
  // getparnoFK() {
  //   let parnokeyvalue = ''
  //   this.reportService.getparnoFK(parnokeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.parnoList = datas;
  //       console.log("parnoList", datas)
  //     })
  // }
  
  
  
  
  // currentpagepar: number = 1;
  // has_nextpar = true;
  // has_previouspar = true;
  // //////////////////////////////////////par no scroll
  // autocompleteparnoScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matparnoAutocomplete &&
  //       this.autocompleteTrigger &&
  //       this.matparnoAutocomplete.panel
  //     ) {
  //       fromEvent(this.matparnoAutocomplete.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.matparnoAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.matparnoAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matparnoAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matparnoAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.reportService.getparnoFKdd(this.parnoInput.nativeElement.value, this.currentpagepar + 1)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.parnoList = this.parnoList.concat(datas);
  //                   if (this.parnoList.length > 0) {
  //                     this.has_nextpar = datapagination.has_next;
  //                     this.has_previouspar = datapagination.has_previous;
  //                     this.currentpagepar = datapagination.index;
  //                   }
  //                 })
  //             }
  //           }
  //         });
  //     }
  //   });
  // }
  
  // MEPList: Array<mepnoLists>;
  // @ViewChild('mepname') matmepAutocomplete: MatAutocomplete;
  // @ViewChild('mepinput') mepinput: any;
  //   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////mep
  //   public displayFnMep(MEP?: any) {
  //     if (typeof (MEP) == "string") {
  //       return MEP
  //     }
  //     return MEP ? this.MEPList.find(_ => _.no == MEP).no : undefined;
  //   }
  //   getmepFK() {
  //     // this.SpinnerService.show();
  //     this.reportService.getmepFK("")
  //       .subscribe((results: any[]) => {
  //         // this.SpinnerService.hide();
  //         let datas = results["data"];
  //         this.MEPList = datas;
  //         console.log("mepList", datas)
  //       })
  //   }
  
  //   currentpagemep = 1
  //   has_nextmep = true;
  //   has_previousmep = true;
  //   autocompleteMepScroll() {
  //     setTimeout(() => {
  //       if (
  //         this.matmepAutocomplete &&
  //         this.autocompleteTrigger &&
  //         this.matmepAutocomplete.panel
  //       ) {
  //         fromEvent(this.matmepAutocomplete.panel.nativeElement, 'scroll')
  //           .pipe(
  //             map(x => this.matmepAutocomplete.panel.nativeElement.scrollTop),
  //             takeUntil(this.autocompleteTrigger.panelClosingActions)
  //           )
  //           .subscribe(x => {
  //             const scrollTop = this.matmepAutocomplete.panel.nativeElement.scrollTop;
  //             const scrollHeight = this.matmepAutocomplete.panel.nativeElement.scrollHeight;
  //             const elementHeight = this.matmepAutocomplete.panel.nativeElement.clientHeight;
  //             const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //             if (atBottom) {
  //               if (this.has_nextmep === true) {
  //                 this.reportService.getmepFKdd(this.mepinput.nativeElement.value, this.currentpagemep + 1)
  //                   .subscribe((results: any[]) => {
  //                     let datas = results["data"];
  //                     let datapagination = results["pagination"];
  //                     this.MEPList = this.MEPList.concat(datas);
  //                     if (this.MEPList.length >= 0) {
  //                       this.has_nextmep = datapagination.has_next;
  //                       this.has_previousmep = datapagination.has_previous;
  //                       this.currentpagemep = datapagination.index;
  //                     }
  //                   })
  //               }
  //             }
  //           });
  //       }
  //     });
  //   }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    autocompleteid(){
      setTimeout(()=>{
        if(this.matassetidauto && this.autocompletetrigger && this.matassetidauto.panel){
          fromEvent(this.matassetidauto.panel.nativeElement,'scroll').pipe(
            map(x=> this.matassetidauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompletetrigger.panelClosingActions)
          ).subscribe(data=>{
            const scrollTop=this.matassetidauto.panel.nativeElement.scrollTop;
            const scrollHeight=this.matassetidauto.panel.nativeElement.scrollHeight;
            const elementHeight=this.matassetidauto.panel.nativeElement.clientHeight;
            const atBottom=scrollHeight-1<=scrollTop +elementHeight;
            console.log("CALLLLL",atBottom)
            if(atBottom){
    
              if(this.has_nextid){
                this.reportService.getUsageCode(this.inputasset.nativeElement.value, this.has_presentid+1).subscribe(data=>{
                  let dts=data['data'];
                  console.log('h--=',data);
                  console.log("SS",dts)
                  console.log("GGGgst",this.branchlist)
                  let pagination=data['pagination'];
                  this.branchlist=this.branchlist.concat(dts);
                  
                  if(this.branchlist.length>0){
                    this.has_nextid=pagination.has_next;
                    this.has_presentid=pagination.has_previous;
                    this.has_presentid=pagination.index;
                    
                  }
                  
                })
              }
            }
          })
        }
      })
     
      
    }
    getbranchValue() {
      this.reportService.getbranchValue()
        .subscribe(result => {
          this.branchlist = result['data']
          
          
        })
    }
  
    getbranch(id){
      this.branchid=id
      console.log("this.branchid",this.branchid)
      this.reportService.getbranchemployee("",this.branchid)
        
        .subscribe((results: any[]) => {
          let datas = results['data'];
          this.employeelist = datas;
          console.log("Employee List",this.employeelist)
        });
      
    }
    approvalemp(id){
      this.empgid=id
    }
    send_value:String=""
   
  
    search(){
      this.send_value=""
      let form_value = this.TourReport.value;
      if(form_value.tourno != "")
      {
        this.send_value=this.send_value+"&tourno="+form_value.tourno
      }
      if(form_value.approval != "")
      {
        
        this.send_value=this.send_value+"&empid="+this.empgid
      }
      this.tourSearch(this.send_value,this.currentpage,this.pagesize)
    }
    tourSearch(val,pageNumber,pageSize){
     this.reportService.gettoursearch(val,pageNumber)
      .subscribe(result=> {
       
       this.gettourreportList=result['data']
       let datapagination = result["pagination"];
       this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
      })
    
  
    }
    TourmakernextClick() {
      if (this.has_next === true) {
        this.tourSearch(this.send_value,this.currentpage + 1,this.pagesize)
      }
    }
    TourmakerpreviousClick() {
      if (this.has_previous === true) {
        this.tourSearch(this.send_value,this.currentpage - 1,this.pagesize)
      }
    }
    nextClick() {
      if (this.has_next === true) {
        this.empreportSearch(this.send_value,this.presentpage + 1,this.pagesize)
      }
    }
    previousClick() {
      if (this.has_previous === true) {
        this.empreportSearch(this.send_value,this.presentpage - 1,this.pagesize)
      }
    }
    branchnextClick() {
      if (this.has_next === true) {
        this.getdata(this.value,this.branchpresentpage + 1,this.pagesize)
      }
    }
    branchpreviousClick() {
      if (this.has_previous === true) {
        this.getdata(this.value,this.branchpresentpage - 1,this.pagesize)
      }
    }
    tourdownload(){
    
      this.reportService.gettouriddownload( this.tourno, this.empgid)
      .subscribe((results) => {
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'Tour Report'+".xlsx";
        link.click();
        })
      
  }
  
     download(){
    
  
        this.reportService.gettourexpensedownload( this.tourrequestno)
        .subscribe((results) => {
          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'Tour Expense Report'+".xlsx";
          link.click();
          })
          }
     downloads(){
           
             
                this.reportService.gettourdetaildownload( this.tourrequestno)
                .subscribe((results) => {
                  let binaryData = [];
                  binaryData.push(results)
                  let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
                  let link = document.createElement('a');
                  link.href = downloadUrl;
                  link.download = 'Tour Detail Report'+".xlsx";
                  link.click();
                  })
                  
          }
       onCancelClick(){
           this.isTourReport=true
           this.isBranchpendingdetail=false
           this.isemployereport=false;
           this.isconsolidateReport=false
           this.isTourReport = false
           this.isExpensedetail=false;
           this.isAdvancedetail=false;
           this.isBranchpendingdetail=false
           this.isemployereport=false;
           this.isTourdetail=false;
           
           this.ispremiseown=false;
           this.occupancy=false;
           this.rent=false;
           this.agreement=false;
           this.ispremiselea=false;
           this.isoccuown=false
           this.isocculea=false
           this.islandown=false
           this.islandlea=false
           this.isrentlea=false
           this.isrentown=false
           this.isExpiredRentSchedule=false
           this.isClosedOccpancy=false
           this.isOccpancyUsageType=false
           this.isHoldRent=false
           this.isOccpancyUsageCode=false
           this.isUnregLandlord=false
           this.isNRILandlord=false
           this.isExpiredAgree=false
           this.isBuilding=false
           this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
      
           this.ispremiseactive= false;
           this.ispremiseterminated= false;
           this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false
           this.MemoShow = false 
          }
          getdatas(data){
            this.value=data.value
            this.reportService.getbranchwisereport(this.value,this.branchpresentpage)
            .subscribe(result=>{
              this.getbranchwiseList=result['data']
              let datapagination = result["pagination"];
             this.has_next = datapagination.has_next;
                this.has_previous = datapagination.has_previous;
                this.branchpresentpage = datapagination.index;
            })
          }
       getdata(data,pageNumber,pageSize){
            this.value=data.value
            if(pageNumber==undefined){
              pageNumber=1
            }
            this.reportService.getbranchwisereport(this.value,pageNumber)
            .subscribe(result=>{
              this.getbranchwiseList=result['data']
              let datapagination = result["pagination"];
             this.has_next = datapagination.has_next;
                this.has_previous = datapagination.has_previous;
                this.branchpresentpage = datapagination.index;
            })
          }
        searchemp(){
          this.send_value=""
            let form_value = this.Employeeform.value;
            if(form_value.tourno != "")
             {
               this.send_value=this.send_value+form_value.tourno
             }
      
               this.empreportSearch(this.send_value,this.presentpage,this.pagesize)
             }
      
        empreportSearch(val,pageNumber,pageSize){
          
            let tourno = this.Employeeform.value.tourno
            this.id=tourno
            this.reportService.getemptourreport(val,pageNumber)
            .subscribe(result=> {
             this.getempreportList=result['data']
             let datapagination = result["pagination"];
             this.has_next = datapagination.has_next;
                this.has_previous = datapagination.has_previous;
                this.presentpage = datapagination.index;
           
          })
          
         
        }
        downloademp(){
      
          this.reportService.getempreportdownload( this.id)
          .subscribe((results) => {
            let binaryData = [];
            binaryData.push(results)
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            let link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'Employee Tour Report'+".xlsx";
            link.click();
            })
    }
    billSearch(){
      this.tourno= this.Consolidateform.value.tourno
      this.reportService.getconsolidatereport(this.tourno)
      .subscribe(result =>{
        
        this.getconsolidateList=result
        
        
      })
    }
    gettourhistory(id){
      this.tourid=id
    this.reportService.getapproveflowalllist(this.tourid)
    .subscribe(res =>{
      this.approvalflowlist=res['approve']
    })
  }
  
  
  
  
  
   //////////////////////////////////////////////////////////////////////////////////////////////////////////PO Module Report
  
  //POModule REPORT
  POModulereport(){
    this.isRCNReportsummarypage = false;
    this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
      
    this.isPOReport = true
    this.isMemoType = false;
    this.isType = false;
    this.isOccupancy = false;
    this.isRent = false;
    this.isLandlord = false;
    this.isAgreement = false;
    this.ispremiseown=false;
    this.occupancy=false;
    this.rent=false;
    this.agreement=false;
    this.ispremiselea=false;
    this.isoccuown=false
    this.isocculea=false
    this.islandown=false
    this.islandlea=false
    this.isrentlea=false
    this.isrentown=false
    this.isClosedOccpancy=false
    this.isOccpancyUsageType=false
    this.isHoldRent=false
    this.isOccpancyUsageCode=false
    this.isUnregLandlord=false
    this.isNRILandlord=false
    this.isExpiredAgree=false
    this.isBuilding=false
    this.isExpiredRentSchedule=false
    this.ispremiseactive= false;
    this.ispremiseterminated= false;
    this.MemoShow = false 
    this.getRCNMenu();
  }

  

  POModulereportReset(){
    this.POReportExcel.reset();
  }
  ProcurementModulereportReset(){
    this.ProcurementeportExcel.reset();
    this.ProcurementSearch();
  }
  
  exportexcelPO(): void {
  let search = this.POReportExcel.value
  // Check if all controls are empty
  const allEmpty = Object.values(search).every(controlValue => {
    // Check if the control value is null, undefined, or an empty string
    return controlValue === null || controlValue === undefined || controlValue === '';
  });
  if(allEmpty){
    this.toastr.warning("There is No Record to Download")
    return
  }
    if (this.POReportExcel.value.from_date !== '' && this.POReportExcel.value.to_date === '') {
      this.toastr.warning("Please enter 'To Date' ")
      return
    }
  
    if (this.POReportExcel.value.to_date !== '' && this.POReportExcel.value.from_date === '') {
      this.toastr.warning("Please enter 'To Date' ")
      return
    }
    
    if (this.POReportExcel.value.from_date > this.POReportExcel.value.to_date) {
      this.toastr.warning(" FROM date must be lesser than TO date ")
      return
    }
  
    if(this.POReportExcel.value.from_date != "" || null || undefined ){
    let fromdate = this.POReportExcel.value.from_date
    let fromdates = this.datePipe.transform(fromdate, 'yyyy-MM-dd');
    this.POReportExcel.value.from_date = fromdates;
    }
    if(this.POReportExcel.value.to_date != "" || null || undefined ){
      let todate = this.POReportExcel.value.to_date
      let todates = this.datePipe.transform(todate, 'yyyy-MM-dd');
      this.POReportExcel.value.to_date = todates;
    }
  
  //   let data = {
  //     "from_date":this.POReportExcel.value.from_date,
  //     "to_date":this.POReportExcel.value.to_date
  // }
  for (let i in search) {
    if (!search[i]) {
      delete search[i];
    }
  }
  
    this.reportService.getPOExcel(search)
      .subscribe((data) => {
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'PCA Utilization Report'+".xlsx";
        link.click();
        })
  
  
  
  }
  POutilSearchList: any
  ProcurementSearchList:any;
  PoUtilSearch(){
  
    let search = this.POReportExcel.value
    if (this.POReportExcel.value.from_date !== '' && this.POReportExcel.value.to_date === '') {
      this.toastr.warning("Please enter 'To Date' ")
      return
    }
  
    if (this.POReportExcel.value.to_date !== '' && this.POReportExcel.value.from_date === '') {
      this.toastr.warning("Please enter 'To Date' ")
      return
    }
    
    if (this.POReportExcel.value.from_date > this.POReportExcel.value.to_date) {
      this.toastr.warning(" FROM date must be lesser than TO date ")
      return
    }
  
    if(this.POReportExcel.value.from_date != "" || null || undefined ){
    let fromdate = this.POReportExcel.value.from_date
    let fromdates = this.datePipe.transform(fromdate, 'yyyy-MM-dd');
    this.POReportExcel.value.from_date = fromdates;
    }
    if(this.POReportExcel.value.to_date != "" || null || undefined ){
      let todate = this.POReportExcel.value.to_date
      let todates = this.datePipe.transform(todate, 'yyyy-MM-dd');
      this.POReportExcel.value.to_date = todates;
    }
  
  //   let data = {
  //     "from_date":this.POReportExcel.value.from_date,
  //     "to_date":this.POReportExcel.value.to_date
  // }
  for (let i in search) {
    if (!search[i]) {
      delete search[i];
    }
  }
  // if(search == {}){
  //   this.toastr.warning('Please select atleast one...')
  //   return false
  // }
  this.SpinnerService.show()
  this.reportService.POReportSearch(search)
      .subscribe((results) => {
      this.SpinnerService.hide()
        console.log("Utilization Report",results) 
        let data = results['data']
        this.POutilSearchList = data
      })
  
  
  }
  ProcurementSearch(){
    this.ProcurementSearchs(1);
  }
  ProcurementSearchs(pageno){
  
    let search = this.ProcurementeportExcel.value
    if (this.ProcurementeportExcel.value.from_date !== '' && this.ProcurementeportExcel.value.to_date === '') {
      this.toastr.warning("Please enter 'To Date' ")
      return
    }
  
    if (this.ProcurementeportExcel.value.to_date !== '' && this.ProcurementeportExcel.value.from_date === '') {
      this.toastr.warning("Please enter 'To Date' ")
      return
    }
    
    if (this.ProcurementeportExcel.value.from_date > this.ProcurementeportExcel.value.to_date) {
      this.toastr.warning(" FROM date must be lesser than TO date ")
      return
    }
  
    if(this.ProcurementeportExcel.value.from_date != "" || null || undefined ){
    let fromdate = this.ProcurementeportExcel.value.from_date
    let fromdates = this.datePipe.transform(fromdate, 'yyyy-MM-dd');
    this.ProcurementeportExcel.value.from_date = fromdates;
    }
    if(this.ProcurementeportExcel.value.to_date != "" || null || undefined ){
      let todate = this.ProcurementeportExcel.value.to_date
      let todates = this.datePipe.transform(todate, 'yyyy-MM-dd');
      this.ProcurementeportExcel.value.to_date = todates;
    }
  
  //   let data = {
  //     "from_date":this.POReportExcel.value.from_date,
  //     "to_date":this.POReportExcel.value.to_date
  // }
  for (let i in search) {
    if (!search[i]) {
      delete search[i];
    }
  }
  // if(search == {}){
  //   this.toastr.warning('Please select atleast one...')
  //   return false
  // }
  this.SpinnerService.show()
  this.reportService.ProcureReportSearch(search,pageno)
      .subscribe((results) => {
      this.SpinnerService.hide()
        console.log("Utilization Report",results) 
        let data = results['data']
        this.ProcurementSearchList = data
        let dataPagination = results["pagination"];
        if (this.ProcurementSearchList.length >= 0) {
          this.hasres_next = dataPagination.has_next;
          this.hasres_previous = dataPagination.has_previous;
          this.presentpageres = dataPagination.index;
          this.isprocurementslist = true;
          this.SpinnerService.hide();
          console.log('presentpageres',this.presentpageres)
        } 
        
        else {
          console.error("Pagination data is missing in the results");
        }
      })
  
  
  }
  
  
  
  
  
  
  parnoList: Array<parnolistss>;
  @ViewChild('parno') matparnoAutocomplete: MatAutocomplete;
  @ViewChild('parnoInput') parnoInput: any;
  displayFnparno(parno?: any) {
    if ((typeof parno) === 'string') {
      return parno;
    }
    return parno ? this.parnoList.find(_ => _.no === parno).no : undefined;
  }
  
  getparnoFK() {
    let parnokeyvalue = '';
    this.SpinnerService.show();
    this.reportService.getparnoFK(parnokeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        this.parnoList = datas;
        console.log("parnoList", datas)
      })
  }
  
  
  
  
  currentpagepar: number = 1;
  has_nextpar = true;
  has_previouspar = true;
  //////////////////////////////////////par no scroll
  autocompleteparnoScroll() {
    setTimeout(() => {
      if (
        this.matparnoAutocomplete &&
        this.autocompleteTrigger &&
        this.matparnoAutocomplete.panel
      ) {
        fromEvent(this.matparnoAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matparnoAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matparnoAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matparnoAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matparnoAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.reportService.getparnoFKdd(this.parnoInput.nativeElement.value, this.currentpagepar + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.parnoList = this.parnoList.concat(datas);
                    if (this.parnoList.length > 0) {
                      this.has_nextpar = datapagination.has_next;
                      this.has_previouspar = datapagination.has_previous;
                      this.currentpagepar = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  
  MEPList: Array<mepnoLists>;
  @ViewChild('mepname') matmepAutocomplete: MatAutocomplete;
  @ViewChild('mepinput') mepinput: any;
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////mep
    public displayFnMep(MEP?: any) {
      if (typeof (MEP) == "string") {
        return MEP
      }
      return MEP ? this.MEPList.find(_ => _.no == MEP).no : undefined;
    }
    getmepFK() {
      this.SpinnerService.show();
      this.reportService.getmepFK("")
        .subscribe((results: any[]) => {
          this.SpinnerService.hide();
          let datas = results["data"];
          this.MEPList = datas;
          console.log("mepList", datas)
        })
    }
  
    currentpagemep = 1
    has_nextmep = true;
    has_previousmep = true;
    autocompleteMepScroll() {
      setTimeout(() => {
        if (
          this.matmepAutocomplete &&
          this.autocompleteTrigger &&
          this.matmepAutocomplete.panel
        ) {
          fromEvent(this.matmepAutocomplete.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.matmepAutocomplete.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.matmepAutocomplete.panel.nativeElement.scrollTop;
              const scrollHeight = this.matmepAutocomplete.panel.nativeElement.scrollHeight;
              const elementHeight = this.matmepAutocomplete.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_nextmep === true) {
                  this.reportService.getmepFKdd(this.mepinput.nativeElement.value, this.currentpagemep + 1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.MEPList = this.MEPList.concat(datas);
                      if (this.MEPList.length >= 0) {
                        this.has_nextmep = datapagination.has_next;
                        this.has_previousmep = datapagination.has_previous;
                        this.currentpagemep = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }
  
  ModuleList: any 
  
    moduleGet(){
      this.SpinnerService.show();
      this.reportService.getReportsModule()
      .subscribe(results=>{
        this.SpinnerService.hide();
        let data = results["data"]
        console.log("data for report module=======================> ", data)
        this.ModuleList = data 
      }, error=>{
        this.SpinnerService.hide();
      })
  
    }
  
    checkMenuBasedSubModules(modules){
      console.log("module ====================================>", modules )
      if(modules.text == 'e-Memo'){
        this.memo()
        console.log("dropDownTag===============>", this.dropDownTag) 
      }
      if(modules.text == 'Vendor'){
        this.vendor() 
      }
      if(modules.text == 'VendorReport'){
        this.vendor_reportfn() 
      }
      if(modules.text == 'TrialBalance'){
        this.trialbalance() 
      }
      if(modules.text == 'REMS'){
        this.rems() 
      }
      if(modules.text == 'PO'){
        this.PO() 
      }
      if(modules.text == 'TA'){
        this.TA() 
      }
      if(modules.text == 'Inward'){
        this.Inward() 
      }
      if(modules?.text == 'Provision'){  
        this.provisionScreenView() 
      }
      if(modules.text =='CBS-TB'){
        this.Cbs_trailbalance()
      }
      
    }
      //InwardModule REPORT
      InwardReport(){
        this.SpinnerService.show()
        this.inwardReportTab = true
        this.isRCNReportsummarypage = false;
        this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
      this.isMasterReport =false;
      this.isPaymentReport =false;
      
        this.isPOReport = false
         this.isPODetReportform = false
      this.isPOAssetReportform = false; 
        this.isMemoType = false;
        this.isType = false;
        this.isOccupancy = false;
        this.isRent = false;
        this.isLandlord = false;
        this.isAgreement = false;
        this.ispremiseown=false;
        this.occupancy=false;
        this.rent=false;
        this.agreement=false;
        this.ispremiselea=false;
        this.isoccuown=false;
        this.isocculea=false;
        this.islandown=false;
        this.islandlea=false;
        this.isrentlea=false;
        this.isrentown=false;
        this.isClosedOccpancy=false
        this.isOccpancyUsageType=false
        this.isHoldRent=false
        this.isOccpancyUsageCode=false
        this.isUnregLandlord=false
        this.isNRILandlord=false
        this.isExpiredAgree=false
        this.isBuilding=false
        this.isExpiredRentSchedule=false
        this.ispremiseactive= false;
        this.ispremiseterminated= false;
        this.MemoShow = false 
        this.SpinnerService.hide()
        
        // this.getRCNMenu();
      }
  
    ChannelList: any
    CourierList: any
    HeaderDocstatusList: any 
    SearchstatusList: any
    @ViewChild('Courier') matCourierAutocomplete: MatAutocomplete;
    @ViewChild('CourierInput') CourierInput: any;
    @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
    @ViewChild('branchInput') branchInput: any;
  
    getChannelFK() {
      this.SpinnerService.show();
      this.reportService.getChannelFKdd("", 1)
        .subscribe((results: any[]) => {
          this.SpinnerService.hide();
          let datas = results["data"];
          this.ChannelList = datas;
          console.log("channel list", datas)
        }, error=>{
          this.SpinnerService.hide()
        })
    }
  
    
  
    currentpageCourier: number = 1;
    has_nextCourier = true;
    has_previousCourier = true;
    autocompleteCourierScroll() {
      setTimeout(() => {
        if (
          this.matCourierAutocomplete &&
          this.autocompleteTrigger &&
          this.matCourierAutocomplete.panel
        ) {
          fromEvent(this.matCourierAutocomplete.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.matCourierAutocomplete.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.matCourierAutocomplete.panel.nativeElement.scrollTop;
              const scrollHeight = this.matCourierAutocomplete.panel.nativeElement.scrollHeight;
              const elementHeight = this.matCourierAutocomplete.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_nextCourier === true) {
                  this.reportService.getCourierFKdd(this.CourierInput.nativeElement.value, this.currentpageCourier + 1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.CourierList = this.CourierList.concat(datas);
                      // console.log("emp", datas)
                      if (this.CourierList.length > 0) {
                        this.has_nextCourier = datapagination.has_nextCourier;
                        this.has_previousCourier = datapagination.has_previousCourier;
                        this.currentpageCourier = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }
  
  
    displayFnCourier(courier?: any) {
      return courier ? this.CourierList.find(_ => _.id === courier).name : undefined;
    }
  
    getCourierFK() {
      this.SpinnerService.show();
      this.reportService.getCourierFKdd("", 1)
        .subscribe((results: any[]) => {
          this.SpinnerService.hide();
          let datas = results["data"];
          this.CourierList = datas;
          console.log("CourierList list", datas)
        }, error=>{
          this.SpinnerService.hide()
        })
    }
  
    currentpagebranch: number = 1;
    has_nextbranch = true;
    has_previousbranch = true;
    autocompletebranchScroll() {
      setTimeout(() => {
        if (
          this.matbranchAutocomplete &&
          this.autocompleteTrigger &&
          this.matbranchAutocomplete.panel
        ) {
          fromEvent(this.matbranchAutocomplete.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.matbranchAutocomplete.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.matbranchAutocomplete.panel.nativeElement.scrollTop;
              const scrollHeight = this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
              const elementHeight = this.matbranchAutocomplete.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_nextbranch === true) {
                  this.reportService.getbranchFK(this.branchInput.nativeElement.value, this.currentpagebranch + 1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.branchList = this.branchList.concat(datas);
                      if (this.branchList.length > 0) {
                        this.has_nextbranch = datapagination.has_next;
                        this.has_previousbranch = datapagination.has_previous;
                        this.currentpagebranch = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }
  
    public displayFnbranch(branch?: branchlistss): string | undefined {
      return branch ? this.branchList.find(_ => _.id === branch).name : undefined;
    }
  
    getbranchFK() {
      this.SpinnerService.show();
      this.reportService.getbranchFK('', 1)
        .subscribe((results: any[]) => {
          this.SpinnerService.hide();
          let datas = results["data"];
          this.branchList = datas;
          // console.log("branchList", datas)
        }, error=>{
          this.SpinnerService.hide()
        })
    }
  
    docAssignUnAssignstatusDD() {
      this.SpinnerService.show();
      this.reportService.docAssignUnAssignstatusDD()
        .subscribe(res => {
          this.SpinnerService.hide();
          let data = res['data'];
          this.HeaderDocstatusList = data;
        }, error=>{
          this.SpinnerService.hide()
        })
    }
  
    
  
    getSearchstatusList() {
      this.SpinnerService.show();
      this.reportService.getSearchstatusList()
        .subscribe(res => {
          this.SpinnerService.hide();
          let data = res['data'];
          this.SearchstatusList = data;
        }, error=>{
          this.SpinnerService.hide()
        })
    }
  
    documenttypeList: any
    currentpagedoctype: any = 1
    has_nextdoctype: boolean
    has_previousdoctype: boolean
    Documenttype(e) {
      // this.SpinnerService.show();
      console.log("event dataaa", e)
      let dataToSearchCheck = e.target.value
      this.reportService.DocumenttypeSearchAPI(dataToSearchCheck, this.currentpagedoctype)
        .subscribe((results: any[]) => {
          this.SpinnerService.hide();
          let datas = results["data"];
          this.documenttypeList = datas;
          let datapagination = results["pagination"];
          this.has_nextdoctype = datapagination.has_next;
          this.has_previousdoctype = datapagination.has_previous;
          this.currentpagedoctype = datapagination.index;
        }, error=>{
          // this.SpinnerService.hide()
        })
    }
  
    DocumenttypeDD() {
      // this.SpinnerService.show();
      let dataToSearchCheck = ''
      this.reportService.DocumenttypeSearchAPI(dataToSearchCheck, this.currentpagedoctype)
        .subscribe((results: any[]) => {
          this.SpinnerService.hide();
          let datas = results["data"];
          this.documenttypeList = datas;
          let datapagination = results["pagination"];
          this.has_nextdoctype = datapagination.has_next;
          this.has_previousdoctype = datapagination.has_previous;
          this.currentpagedoctype = datapagination.index;
        }, error=>{
          // this.SpinnerService.hide()
        })
    }
  
  
    public displayFnDocType(doc?: depttypelistss): string | undefined {
      // return doc ? doc.name : undefined;
      return doc ? this.documenttypeList.find(_ => _.id === doc).name : undefined;
    }
  
    
    actionTypeList: any
    PhysicalstatusList: any 
    statusListResponse: any
    actionType() {
      this.SpinnerService.show();
      this.reportService.ActiontypeDD()
        .subscribe(res => {
          this.SpinnerService.hide();
          let data = res['data'];
          this.actionTypeList = data;
        }, error=>{
          this.SpinnerService.hide()
        })
    }
  
    docstatusDD() {
      this.SpinnerService.show();
      this.reportService.docstatusDD()
        .subscribe(res => {
          this.SpinnerService.hide();
          let data = res['data'];
          this.PhysicalstatusList = data;
        }, error=>{
          this.SpinnerService.hide()
        })
    }
    
  
  InwardReportReset(){
    this.InwardOverallReport.controls['assignedto'].reset('')
    this.InwardOverallReport.controls['from_date'].reset('')
    this.InwardOverallReport.controls['to_date'].reset('')
    this.InwardOverallReport.controls['awb_no'].reset('')
    this.InwardOverallReport.controls['channel_id'].reset('')
    this.InwardOverallReport.controls['courier_id'].reset('')
    this.InwardOverallReport.controls['docaction'].reset('')
    this.InwardOverallReport.controls['docstatus'].reset('')
    this.InwardOverallReport.controls['doctype_id'].reset('')
    this.InwardOverallReport.controls['inward_no'].reset('')
    this.InwardOverallReport.controls['docnumber'].reset('')
    this.InwardOverallReport.controls['branch_id'].reset('')
  }
  
  exportexcelInward(): void {
    if (this.InwardOverallReport.value.from_date !== '' && this.InwardOverallReport.value.to_date === '') {
      this.toastr.warning("Please enter 'From Date' ")
      return
    }
    
  
    if (this.InwardOverallReport.value.to_date !== '' && this.InwardOverallReport.value.from_date === '') {
      this.toastr.warning("Please enter 'To Date' ")
      return
    }
    
    if (this.InwardOverallReport.value.from_date > this.InwardOverallReport.value.to_date) {
      this.toastr.warning(" FROM date must be lesser than TO date ")
      return
    }
  
    let fromdateValue;
    let todateValue;
  
    if (this.InwardOverallReport.value.from_date !== '' && this.InwardOverallReport.value.to_date !== '') {
      fromdateValue = this.datePipe.transform(this.InwardOverallReport.value.from_date, 'yyyy-MM-dd')
      todateValue = this.datePipe.transform(this.InwardOverallReport.value.to_date, 'yyyy-MM-dd')
    }
    else {
      fromdateValue = ''
      todateValue = ''
    }
    let obj = {
        assignedto:this.InwardOverallReport.value.assignedto,
        from_date: fromdateValue,
        to_date: todateValue,
        awb_no: this.InwardOverallReport.value.awb_no,
        channel_id: this.InwardOverallReport.value.channel_id,
        courier_id: this.InwardOverallReport.value.courier_id,
        docaction: this.InwardOverallReport.value.docaction,
        docstatus: this.InwardOverallReport.value.docstatus,
        doctype_id: this.InwardOverallReport.value.doctype_id,
        branch_id: this.InwardOverallReport.value.branch_id,
        docnumber: this.InwardOverallReport.value.docnumber,
        inward_no: this.InwardOverallReport.value.inward_no
  
    }
  
    console.log("obj of inward search", obj)
    this.reportService.getInwardExcel(obj)
    .subscribe((data) => {
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'Inward Report'+".xlsx";
      link.click();
      })
  
  
  }
  InwardSearchList: any
  InwardOverAllSearch(){
  
    let search = this.InwardOverallReport.value
  
    if (this.InwardOverallReport.value.from_date !== '' && this.InwardOverallReport.value.to_date === '') {
      this.toastr.warning("Please enter 'From Date' ")
      return
    }
  
    if (this.InwardOverallReport.value.to_date !== '' && this.InwardOverallReport.value.from_date === '') {
      this.toastr.warning("Please enter 'To Date' ")
      return
    }
    
    if (this.InwardOverallReport.value.from_date > this.InwardOverallReport.value.to_date) {
      this.toastr.warning(" FROM date must be lesser than TO date ")
      return
    }
    let fromdateValue;
    let todateValue;
  
    if (this.InwardOverallReport.value.from_date !== '' && this.InwardOverallReport.value.to_date !== '') {
      fromdateValue = this.datePipe.transform(this.InwardOverallReport.value.from_date, 'yyyy-MM-dd')
      todateValue = this.datePipe.transform(this.InwardOverallReport.value.to_date, 'yyyy-MM-dd')
    }
    else {
      fromdateValue = ''
      todateValue = ''
    }
    let obj = {
        assignedto:this.InwardOverallReport.value.assignedto,
        from_date: fromdateValue ,
        to_date: todateValue,
        awb_no: this.InwardOverallReport.value.awb_no,
        channel_id: this.InwardOverallReport.value.channel_id,
        courier_id: this.InwardOverallReport.value.courier_id,
        docaction: this.InwardOverallReport.value.docaction,
        docstatus: this.InwardOverallReport.value.docstatus,
        doctype_id: this.InwardOverallReport.value.doctype_id,
        branch_id: this.InwardOverallReport.value.branch_id,
        docnumber: this.InwardOverallReport.value.docnumber,
        inward_no: this.InwardOverallReport.value.inward_no
  
    }
  
    console.log("obj of inward search", obj)
    this.reportService.InwardReportSearch(obj)
    .subscribe(results=>{
      let data = results['data'] 
      this.InwardSearchList = data 
      console.log("inward search list ", data )
    })
  
  
  
  
  }
  Procurementreport(){
  
  }
  toggleProcurementReport(){
    this.procurementReportVisible = !this.procurementReportVisible;
    this.ProcurementSearch()
  }
  setActiveTab(tabName: string) {
    this.activeTab = tabName;
    if (this.activeTab !== 'Procurement') {
      this.procurementReportVisible = false;
    }
  }
  getProcurement(data,pageNumber = 1) {
    this.SpinnerService.show();
    this.reportService.ProcureReportSearch(data,pageNumber)
      .subscribe((results: any[]) => {
        let datas = results["Data"];
        let datapagination = results["Pagination"];
        this.ProcurementSearchList = datas;
        if (this.ProcurementSearchList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
          this.isprocurementslist = true;
          this.SpinnerService.hide();
          
        }
      })
  }
  
  getproster(data,pageNumber = 1) {
    this.SpinnerService.show();
    this.reportService.ProcureReportSearch(data,pageNumber)
      .subscribe((results: any[]) => {
        let datas = results["Data"];
        let datapagination = results["Pagination"];
        this.ProcurementSearchList = datas;
        if (this.ProcurementSearchList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
          this.isprocurementslist = true;
          this.SpinnerService.hide();
          
        } 
      })
  }
  
  
  icon: boolean = false;
  
  click(){
      this.icon = !this.icon;
    }
  
  cbsformdata=new FormData()
  fileget(event:any){
    this.cbsformdata = new FormData();  
  
    if (event.target.files && event.target.files.length > 0) {
      this.cbsformdata.append('file', event.target.files[0]);
    }
  }
  
  cbsfile_upload(){
      
  this.SpinnerService.show();
    this.reportService.cbs_fileupload(this.cbsformdata).subscribe(datas=>{
      this.SpinnerService.hide();
      if(datas['status']=='success'){
        this.toastr.success(datas.message);
      }  
      else{
        this.toastr.warning(datas.description);
      }       
   } ),(error =>{
    this.toastr.error(error.status+error.message);
    this.SpinnerService.hide();
   } )
  }
  resetcbs_file(fileInput: any) {
    fileInput.value = ''; 
    this.cbsformdata = new FormData(); 
  }
  
  //PO Detail REPORT
  PODetailReport(){
    this.isRCNReportsummarypage = false;
    this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
      
    this.isPOReport = false
    this.sharedService.ReportsPO.next(1)
    this.isPODetReportform = true
          this.isPOAssetReportform = false
          this.isMemoType = false;
    this.isType = false;
    this.isOccupancy = false;
    this.isRent = false;
    this.isLandlord = false;
    this.isAgreement = false;
    this.ispremiseown=false;
    this.occupancy=false;
    this.rent=false;
    this.agreement=false;
    this.ispremiselea=false;
    this.isoccuown=false
    this.isocculea=false
    this.islandown=false
    this.islandlea=false
    this.isrentlea=false
    this.isrentown=false
    this.isClosedOccpancy=false
    this.isOccpancyUsageType=false
    this.isHoldRent=false
    this.isOccpancyUsageCode=false
    this.isUnregLandlord=false
    this.isNRILandlord=false
    this.isExpiredAgree=false
    this.isBuilding=false
    this.isExpiredRentSchedule=false
    this.ispremiseactive= false;
    this.ispremiseterminated= false;
    this.MemoShow = false 
  }
  
  
    //PO Asset REPORT
  POAssetDetReport(){
    this.isRCNReportsummarypage = false;
    this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
      
    this.isPOReport = false
    this.isPODetReportform = false
      this.isPOAssetReportform = true
      this.sharedService.ReportsPO.next(2)
    this.isMemoType = false;
    this.isType = false;
    this.isOccupancy = false;
    this.isRent = false;
    this.isLandlord = false;
    this.isAgreement = false;
    this.ispremiseown=false;
    this.occupancy=false;
    this.rent=false;
    this.agreement=false;
    this.ispremiselea=false;
    this.isoccuown=false
    this.isocculea=false
    this.islandown=false
    this.islandlea=false
    this.isrentlea=false
    this.isrentown=false
    this.isClosedOccpancy=false
    this.isOccpancyUsageType=false
    this.isHoldRent=false
    this.isOccpancyUsageCode=false
    this.isUnregLandlord=false
    this.isNRILandlord=false
    this.isExpiredAgree=false
    this.isBuilding=false
    this.isExpiredRentSchedule=false
    this.ispremiseactive= false;
    this.ispremiseterminated= false;
    this.MemoShow = false 
    // this.getRCNMenu();
  }


     //GRN DETAIL REPORT
  POGRNDetReport(){
    this.isRCNReportsummarypage = false;
    this.isRCN = false;
      this.isProvisionReport=false
      this.isLeaseReport = false;
      this.isBeforeRunReport =false;
      this.isAfterRunReport =false;
      this.isPremiseReport =false;
    this.isMasterReport =false;
      this.isPaymentReport =false;
      
    this.isPOReport = false
    this.isPODetReportform = false
      this.isPOAssetReportform = false
      this.isGRNReportform = true
      this.sharedService.ReportsPO.next(3)
    this.isMemoType = false;
    this.isType = false;
    this.isOccupancy = false;
    this.isRent = false;
    this.isLandlord = false;
    this.isAgreement = false;
    this.ispremiseown=false;
    this.occupancy=false;
    this.rent=false;
    this.agreement=false;
    this.ispremiselea=false;
    this.isoccuown=false
    this.isocculea=false
    this.islandown=false
    this.islandlea=false
    this.isrentlea=false
    this.isrentown=false
    this.isClosedOccpancy=false
    this.isOccpancyUsageType=false
    this.isHoldRent=false
    this.isOccpancyUsageCode=false
    this.isUnregLandlord=false
    this.isNRILandlord=false
    this.isExpiredAgree=false
    this.isBuilding=false
    this.isExpiredRentSchedule=false
    this.ispremiseactive= false;
    this.ispremiseterminated= false;
    this.MemoShow = false 
    // this.getRCNMenu();
  }

  LoadPOReport(id){
    if(id == 2)
      this.PODetailReport()
    else if(id== 3)
      this.POAssetDetReport()
    else if(id == 4)
      this.POModulereport()
        else if(id == 5)
      this.POGRNDetReport()

  }
  prpoRpts : any
  getprpoReports() {
    this.reportService.getPrpoRpts()
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.prpoRpts = datas;
        }

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }

  
cbsWisefinTBDate = new FormControl('');
  craetewisefintb() {
    // console.log("file:",this.uploadbscc,this.uploadjv, this.uploadjw,this.uploadfa,this.uploadcbcc)
    let bscc = this.wisefinTbUpload.get("wisefinuploadbscc").value;
    let jv = this.wisefinTbUpload.get("wisefinuploadjv").value;
    let jw = this.wisefinTbUpload.get("wisefinuploadjw").value;
    let fa = this.wisefinTbUpload.get("wisefinuploadfa").value;
    let expense = this.wisefinTbUpload.get("wisefinuploadcbcc").value;
    let date = this.datePipe.transform(
      this.cbsWisefinTBDate.value,
      "yyyy-MM-dd",
    )
    // if (
    //   this.integrityCheck.controls["InterSelectDate"].value == null ||
    //   this.integrityCheck.controls["InterSelectDate"].value == ""
    // ) {
    //   this.notification.showError("Please choose a date to proceed");
    //   return false;
    // }
    if (
      date == null || date == ""
    ) {
      this.notification.showError("Please select date");
      return false;
    }
    if (
      this.wisefinTbUpload.get("wisefinuploadbscc").value == null ||
      this.wisefinTbUpload.get("wisefinuploadbscc").value == ""
    ) {
      this.notification.showError("Please select valid BSCC file to upload");
      return false;
    }
    if (
      this.wisefinTbUpload.get("wisefinuploadjv").value == null ||
      this.wisefinTbUpload.get("wisefinuploadjv").value == ""
    ) {
      this.notification.showError("Please select valid JV file to upload");
      return false;
    }
    if (
      this.wisefinTbUpload.get("wisefinuploadjw").value == null ||
      this.wisefinTbUpload.get("wisefinuploadjw").value == ""
    ) {
      this.notification.showError("Please select valid JW file to upload");
      return false;
    }
    if (
      this.wisefinTbUpload.get("wisefinuploadfa").value == null ||
      this.wisefinTbUpload.get("wisefinuploadfa").value == ""
    ) {
      this.notification.showError("Please select valid FA file to upload");
      return false;
    }
    if (
      this.wisefinTbUpload.get("wisefinuploadcbcc").value == null ||
      this.wisefinTbUpload.get("wisefinuploadcbcc").value == ""
    ) {
      this.notification.showError("Please select valid EXPENSE file to upload");
      return false;
    }
    let datal = {
      // "bscc": this.uploadbscc,
      // "jv": this.uploadjv,
      // "jw": this.uploadjw,

      // "fa": this.uploadfa,
      // "expense": this.uploadcbcc,
      "date": date,
    };
    // console.log("this.wisefinUpload.get(filedatas).value",this.wisefinUpload.get("filedatas").value)
    this.SpinnerService.show();
    this.reportService
      .wisefintb(datal, bscc, jv, jw, fa, expense)
      .subscribe((results) => {
        this.SpinnerService.hide();
        if (results['data'] == undefined) {
          this.notification.showError(results.code);
        }
        if (results['data'][0].key == "scheduler triggered") {
          this.notification.showSuccess("scheduler triggered");
          // this.wisefinUpload.reset()
        }

      });
  }

  tbsummary() {
    this.popupopenwisefintb()
    this.wisefinTBreset()  
    // this.interintegrity_trans_summaryapi = { method: "get",
    //   url: this.url + "integrityserv/auto_fetch_summary",
    //   params: ""}
       this.integrity_transaction_summary = [{"columnname": "Date", "key": "date"},
        {"columnname": "Status", "key": "integrity_status"},
        // ,validate: true,validatefunction: this.statusfunction.bind(this)},
        {"columnname": "Download", "key": "download",icon: 'file_download',"style":{cursor: "pointer"}, button: true,
        function: true,clickfunction: this.s3_download.bind(this)},
        {"columnname": "Delete", "key": "delete",icon: 'delete',"style":{cursor: "pointer"}, button: true,
        function: true,clickfunction: this.tb_delete.bind(this)}]
   

  }
  statusfunction(status){
    let config: any = {
      disabled: false,
      style: "",
      class: "",
      value: "",
      checked: "",
      function: false,
    };

    if(status.integrity_status == 0){
      config = {
        disabled: false,
        style: "",
        class: "",
        value: "Start",
        checked: "",
        function: false,
      };
    }

    else if(status.integrity_status == 1){
      config = {
        disabled: false,
        style: "",
        class: "",
        value: "Active",
        checked: "",
        function: false,
      };
    }
else if(status.integrity_status == 2){
  config = {
    disabled: false,
    style: "",
    class: "",
    value: "Started",
    checked: "",
    function: false,
  };
}
else if(status.integrity_status == 3){
  config = {
    disabled: false,
    style: "",
    class: "",
    value: "Processing",
    checked: "",
    function: false,
  };
}
else if(status.integrity_status == 4){
  config = {
    disabled: false,
    style: "",
    class: "",
    value: "Success",
    checked: "",
    function: false,
  };
}
else if(status.integrity_status == 5){
  config = {
    disabled: false,
    style: "",
    class: "",
    value: "Failed BSCC FILE",
    checked: "",
    function: false,
  };
}
else if(status.integrity_status == 6){
  config = {
    disabled: false,
    style: "",
    class: "",
    value: "Failed JVFILE",
    checked: "",
    function: false,
  };
}

else if(status.integrity_status == 7){
  config = {
    disabled: false,
    style: "",
    class: "",
    value: "Failed JW FILE",
    checked: "",
    function: false,
  };
}
else if(status.integrity_status == 8){
  config = {
    disabled: false,
    style: "",
    class: "",
    value: "Failed FAFILE",
    checked: "",
    function: false,
  };
}
else if(status.integrity_status == 9){
  config = {
    disabled: false,
    style: "",
    class: "",
    value: "Failed Minor FILE",
    checked: "",
    function: false,
  };
}
else if(status.integrity_status == 10){
  config = {
    disabled: false,
    style: "",
    class: "",
    value: "Failed",
    checked: "",
    function: false,
  };
}

else if(status.integrity_status == 10){
  config = {
    disabled: false,
    style: "",
    class: "",
    value: status.integrity_status,
    checked: "",
    function: false,
  };
}
return config
  }

  tb_delete(date) {
    // let dateParts: string[] = date.date.split('-'); // Splitting the string into parts

    // // Creating a Date object manually
    // let year: number = parseInt(dateParts[2]);
    // let month: number = parseInt(dateParts[1]) - 1; // Months in JavaScript are zero-indexed (0-11)
    // let day: number = parseInt(dateParts[0]);

    // let dateObject: Date = new Date(year, month, day);

    // // let dateObject = this.parseDateString(date, format);
    let date_tb_sum = this.datePipe.transform(this.cbsWisefinTBDate.value, 'yyyy-MM-dd');
    this.SpinnerService.show();
    this.reportService.tb_status_tb(date_tb_sum).subscribe((results) => {
      this.SpinnerService.hide();
      if (results.status == "success") {
        this.notification.showSuccess("successfully updated");
        //  this.runint();
        this.tbsummary();
      } else {
        this.notification.showError(results.description);
      }

    });

  }
  s3_download(data) {
    console.log(data,'download data')
    let date = this.datePipe.transform(this.cbsWisefinTBDate.value, "yyyy-MM-dd");
    this.SpinnerService.show();
    this.reportService.tb_s3_download().subscribe((results: any[]) => {
      this.SpinnerService.hide();
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'EXCEL_report.xlsx';
      link.click();
    });

  }


  popupopenwisefintb() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("myModal1"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }

  interintegrity_trans_summaryapi:any
  integrity_transaction_summary:any
  wisefinTBreset(){
    this.interintegrity_trans_summaryapi = { method: "get",
      url: this.url + "reportserv/wisefin_tb_summary",
      params: ""}
  }

  
  }