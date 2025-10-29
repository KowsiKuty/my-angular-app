import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, FormArray  } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { Rems2Service } from '../rems2.service'
import { ModificationSummaryComponent } from '../modification-summary/modification-summary.component'
import { SharedService } from '../../service/shared.service';
import { environment } from 'src/environments/environment'
import { DataService } from 'src/app/service/data.service';

const isSkipLocationChange = environment.isSkipLocationChange

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


@Component({
  selector: 'app-premise-view',
  templateUrl: './premise-view.component.html',
  styleUrls: ['./premise-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class PremiseViewComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Input() max: any;

  isMaker: boolean = false;
  isChecker: boolean = false;
  isHeader: boolean = false;

  tomorrow = new Date();
  occupancyList: any
  has_next = true;
  has_previous = true;
  has_next1 = true;
  has_previous1 = true;
  isoccupancypage: boolean = true;
  isLandLordpage: boolean = true;
  currentpage: number = 1;
  presentpage: number = 1;
  pagesize = 10;
  landlordCurrentPage: number = 1;
  landlordPresentPage: number = 1;
  pagesizeLandLoord = 10;
  dropDownTag = "Occupancy Details";
  PremiseId: any;
  mailfrom: any;
  isPermiseEditForm: boolean;
  isPremiseView: boolean;
  type: any;
  premise_status: any;
  getLandlordList: Array<any>
  pageSize = 10;
  next_landLord = true;
  previous_landLord = true;
  landlordPage: number = 1
  landloardCurrentpage: number = 1;
  isOccupancy: boolean;
  isLease: boolean;
  amenitiesList: any;
  next_amenities = true;
  previous_amenities = true;
  is_amenitiesPage: boolean;
  isAmenitiesData: boolean;

  current_amenitiesPage: number = 1;
  present_amentie_pages: number = 1;
  pagesizeAmenties = 10;
  next_legal = true;
  previous_legal = true;
  is_LegalPage = true;
  current_LegalPage: number = 1;
  present_legal_pages: number = 1;
  pagesizeLegal = 10;
  legalDataList: any;
  agreementList: any;
  next_agreement = true;
  previous_agreement = true;
  is_AgreementPage = true;
  current_AgreementPage: number = 1;
  present_agreement_pages: number = 1;
  pagesizeAgreement = 10;
  ebdetailsList: Array<any>
  isEbdetailssummary: boolean;
  isEbdetailsForm: boolean;
  isEbdetailsEditForm: boolean;
  currentebdetailspage: number = 1;
  presentebdetailspage: number = 1;
  pageSizeebdetails = 10;
  ebdetailspage: number = 1;
  has_nextebdetails = true;
  has_previousebdetails = true;
  repairList: Array<any>
  isrepairsummary: boolean;
  isRepairForm: boolean;
  isRepairEditForm: boolean;
  currentrepairpage: number = 1;
  presentrepairpage: number = 1;
  pageSizerepair = 10;
  repairpage: number = 1;
  has_nextrepair = true;
  has_previousrepair = true;
  ebadvanceForm: FormGroup;
  approveAmtForm: FormGroup;
  idValue: any;
  isEbadvanceForm: boolean;
  ebdetailsidList: any;
  currentDate: any = new Date();
  defaultDate = new FormControl(new Date());
  ebadvanceList: Array<any>
  currentadvancepage: number = 1;
  presentadvancepage: number = 1;
  pageSizeadvance = 10;
  ebadvancepage: number = 1;
  has_nextadvance = true;
  has_previousadvance = true;
  ebadvance: any;
  legalClearanceList: any;
  next_clearance = false;
  previous_clearance = false;
  present_clearance: number = 1;
  is_clearancePage = true;
  size_clearance = 10;
  legalNoticeList: any;
  isLegalNoticeData: boolean;
  next_legalNotice = false;
  previous_legalNotice = false;
  present_legalNotice: number = 1;
  is_legalNoticePage = true;
  size_legalNotice = 10;
  insuranceDetailList: any;
  next_insuranceDetails = false;
  previous_insuranceDetails = false;
  present_insuranceDetails: number = 1;
  is_InsuranceDetailsPage = true;
  size_InsuranceDetails = 10;
  refId: number;
  refType: number;
  pageNumber = 1;
  premiseViewId: any;
  renovationList: any;
  next_renovation = false;
  previous_renovation = false;
  present_renovation: number = 1;
  isRenovation = true;
  size_renovation = 10;
  EbdetailID: number;
  is_ebdetailspage = true;
  is_repairpage = true;
  is_ebadvance = true;
  licensesDetailList: any;
  next_licensesDetails = false;
  previous_licensesDetails = false;
  present_licensesDetails: number = 1;
  isLicensesPages = false;
  size_licensesDetails = 10;
  premiseDetailList: any;
  next_premiseDetails = false;
  previous_premiseDetails = false;
  present_premiseDetails: number = 1;
  isPremiseDetails = false;
  size_Premise = 10;
  documentList: any;
  next_document = false;
  previous_document = false;
  present_document: number = 1;
  isDocument = false;
  size_Document = 10;
  isDocumentData: boolean;
  backNavigationTable: any;
  premiseData: PremiseView;
  isAmenitiesTable: boolean;
  isDocumentTable: boolean;
  isEbDetailsTable: boolean;
  isInsuranceTable: boolean;
  isLicenseTable: boolean;
  isLandlordTable: boolean;
  isLegalClearanceTable: boolean;
  isLegalNoticeTable: boolean;
  isOccupancyTable: boolean;
  isPremiseDetailsTable: boolean;
  isRenovationTable: boolean;
  isRepairMaintanceTable: boolean;
  isStatutoryTable: boolean;
  next_statutory = false;
  previous_statutory = false;
  present_statutory: number = 1;
  current_statutory: number = 1;
  isStatutory = false;
  isStatutoryData: boolean;
  statutoryList: any;
  size_Statutory = 10;
  is_statutorypage = true
  modificationdata: any;
  ismodificationView = false;
  status: number;
  updatecode: string;
  updatename: string;
  updaterequeststatus: string;
  updaterentarea: string;
  updatepremisestatus: string;
  updatecontrollingoffname: string;
  updatecontrollingoffcode: string;
  updatemainstatus: string;
  updatelineName1: string;
  updatelineName2: string;
  updatelineName3: string;
  updatecityName: string;
  updatedistrictName: string;
  updatestateName: string;
  updatepinCode: string;
  updatermName: string;
  typetext: any;
  premise_createdate: any;
  btnName = "";
  dropDownValue: string;
  isModificationBtn: boolean;
  ty: any;
  leased: any;
  owned: any;
  buttonNames: string;
  isMovetoRm = true;
  EBAdvanceBtn = false;

  EBadvanceModification = false;
  ebadvanceModificationList = [];
  premiseviewid: any;
  isModification: boolean;
  EBdetailsModification = false;
  ebDetailsModiData = [];
  paramsData = "";
  documentFileData: any;
  tokenValues: any
  urlTypes: string;
  pdfUrls: string;
  imageUrl = environment.apiURL
  jpgUrls: string;
  isImages: boolean
  isAgreementTable: boolean
  isModiReqBtn: boolean;
  isRenewalReqBtn: boolean;
  isChangeViewBtn: boolean;
  isScheduleAmtChg : boolean = false
  approveAmtChgData : any
  isEditBtn: boolean;
  isAddBtn: boolean;
  isApproverBtn: boolean;
  isRenewalApproverBtn: boolean;
  isOnBordApproveBtn: boolean;
  isRejectBtn: boolean;
  isEbDetails: boolean;

  isEditEbBtn: boolean;
  agreementEndDate: any;
  emptyEndDate: any;
  amenitiesagreementEndDate: any;
  maintenanceagreementEnddate: any;
  isShowRenewal: boolean;
  isShowAll: boolean;
  isTerminateReqBtn: boolean;
  request_Status: any;
  premiseOccupiedArea: any;
  occu_Status: any;
  dropDownValuerenewal = [{ id: 1, text: "Agreement and Rent" }]
  isSubmitToCheckerBtn: boolean = false;
  scheduledType: any;
  modificationReqSummary : any;
  // dropDownValueterminate = [{ id: 1, text: "Occupancy Details" },{ id: 2, text: "Agreement and Rent" }]
  @ViewChild("modSummary") modSummary: ModificationSummaryComponent;
  @ViewChild(FormGroupDirective) fromGroupDirective: FormGroupDirective
  @ViewChild('closebuttonApproveAmt') closebuttonApproveAmt;
  constructor(private dataService: DataService, private fb: FormBuilder, private datePipe: DatePipe, private router: Router,
    private remsshareService: RemsShareService, private route: ActivatedRoute, private shareService: SharedService,
    private remsService: RemsService, private toastr: ToastrService, private remsService2: Rems2Service,
    private notification: NotificationService, private location: Location) { }


  ngOnInit(): void {
    let datas = this.shareService.menuUrlData;
    datas.forEach((data) => {
      if (data.name == "REMS") {
        let allrems_role = data.role;
        allrems_role.forEach((data) => {
          let remsrole = data.name;
          if (remsrole === "Checker") {
            this.isChecker = true;
          }
          if (remsrole === "Header") {
            this.isHeader = true;
          }
          if (remsrole === "Maker") {
            this.isMaker = true;
          }
        });
      }

    });

    this.approveAmtForm = this.fb.group({     
      remarks: [''],
      rent_status: [''],
      // scheduleraccr_id: [''],
      // oldrent_amount: [''],
      // rent_amount: [''],
      rent_approval_details1: new FormArray([     
      
      ]),
      rent_approval_details: new FormArray([     
      
      ]),
    }) 
    
    this.ebadvanceForm = this.fb.group({
      advance_amount: ['', Validators.required],
      remarks: ['', Validators.required],
      advance_date: ['', Validators.required]
    })

    let Ebdetailmodi = this.remsshareService.ebadvanceForm.value
    console.log("Ebdetailmodi", Ebdetailmodi)
    this.eddetails = Ebdetailmodi['id']

    this.route.queryParams
      .subscribe(params => {
        this.PremiseId = params.PremiseId;
        this.mailfrom = params.from;
      }
      );
    if (this.PremiseId === undefined) {
      let data: any = this.remsshareService.PremiseView.value;
      this.PremiseId = data.id
      this.mailfrom = "NA";
    }
    this.remsshareService.premiseViewID.next(this.PremiseId)
    if (this.mailfrom === 'remsemail') {
      this.getMenuUrl()
    }

    this.remsService.getApproveAmtchg(this.PremiseId)
      .subscribe(result => {
        let approvalAmtChg = result?.data
        if(approvalAmtChg?.length >0)
        {
          this.isScheduleAmtChg = true
          this.approveAmtChgData = result.data
        }
      })

    this.remsService.getModificationReqSummary(this.PremiseId)
      .subscribe(result => {
        let modificReq = result?.data
        if(modificReq?.length >0)
        {
          this.modificationReqSummary = result.data
        }
      })
    this.getPremiseView();
    this.btnName = "Occupancy Details"
    this.getmodification_premise();
    this.getDropDown();

  }

  getApproveFormArray(): FormArray {
    return this.approveAmtForm.get('rent_approval_details1') as FormArray;
  }

  approveScheduleAmtView(){
    console.log("approve rent modify==",this.approveAmtChgData)
    let data =this.approveAmtChgData
    this.approveAmtForm.patchValue({     
      "remarks": "",
      "rent_status": 1

      // "scheduleraccr_id": data.id,
      // "oldrent_amount": "",
      // "rent_amount": "",
   
    })
    this.getApproveFormArray().clear()
    for (let i=0; i<data.length; i++) { 
      let scheduleraccr_id: FormControl = new FormControl('');
      let from_date: FormControl = new FormControl('');
      let to_date: FormControl = new FormControl('');
      let oldrent_amount: FormControl = new FormControl('');
      let rent_amount: FormControl = new FormControl('');
      let landlord_allocation: FormControl = new FormControl('');
      let select: FormControl = new FormControl('');
    
      scheduleraccr_id.setValue(data[i].id);
      from_date.setValue(this.datePipe.transform(data[i].from_date, 'dd-MMM-yyyy'));
      to_date.setValue(this.datePipe.transform(data[i].to_date, 'dd-MMM-yyyy'));
      oldrent_amount.setValue(data[i].old_amount)
      rent_amount.setValue(data[i].approval_amount)
      landlord_allocation.setValue(data[i].rentschinfo)
      select.setValue(false)
  
      this.getApproveFormArray().push(new FormGroup({
        scheduleraccr_id: scheduleraccr_id,
        from_date: from_date,
        to_date: to_date,
        oldrent_amount: oldrent_amount,
        rent_amount: rent_amount,
        landlord_allocation: landlord_allocation ,
        select : select    
      }))
    }
  }

  approveAmtchgForm()
  {
    const approvedata = this.approveAmtForm.value
        
    for(let i in approvedata.rent_approval_details1)
    {
      if(approvedata.rent_approval_details1[i].select == true)
       { 
        this.schSelect =true
        approvedata.rent_approval_details.push(approvedata.rent_approval_details1[i])
        }      
    }

    if(this.schSelect == false)
    {
      this.toastr.error('', 'Please Select atleast one Amount change to approve', { timeOut: 1500 });
      return false;
    }
    approvedata.rent_status = 1
    delete approvedata.rent_approval_details1
    let data = this.approveAmtForm.value;   
    console.log("approve--->", data)
   
    this.remsService.approveOrRejAmtChg(data)
      .subscribe(result => {
        if (result.statusText == "Internal Server Error") {
          this.notification.showError("Internal Server Error")
        } else if (result.code === "PERMISSION DENIED") {
          this.notification.showError("PERMISSION DENIED")
        }
        else if(result.status == "success"){
          this.notification.showSuccess("Successfully Approved!...")
          this.closebuttonApproveAmt.nativeElement.click();
          this.remsService.getApproveAmtchg(this.PremiseId)
          .subscribe(result => {
            let approvalAmtChg = result?.data
            if(approvalAmtChg?.length >0)
            {
              this.isScheduleAmtChg = true
              this.approveAmtChgData = result.data
            }
            else
            {
              this.isScheduleAmtChg = false
            }
          })
        }
        else
        {
          this.notification.showError(result.message)
        }
      }) 
  }

  schSelect = false;

 rejectAmtchgForm()
  {
    const approvedata = this.approveAmtForm.value
        
    for(let i in approvedata.rent_approval_details1)
    {
      if(approvedata.rent_approval_details1[i].select == true)
        {
          this.schSelect =true
          approvedata.rent_approval_details.push(approvedata.rent_approval_details1[i])
        }
    }

    if(this.schSelect == false)
    {
      this.toastr.error('', 'Please Select atleast one Amount change to reject', { timeOut: 1500 });
      return false;
    }
    approvedata.rent_status = 3
    delete approvedata.rent_approval_details1
    let data = this.approveAmtForm.value;
    console.log("reject--->", data)
    if (data.remarks == "" ) {
      this.toastr.error('', 'Please Enter Remarks', { timeOut: 1500 });
      return false;
    }
    this.remsService.approveOrRejAmtChg(data)
      .subscribe(result => {
        if (result.statusText == "Internal Server Error") {
          this.notification.showError("Internal Server Error")
        } else if (result.code === "PERMISSION DENIED") {
          this.notification.showError("PERMISSION DENIED")
        }
        else  if(result.status == "success"){
          this.notification.showSuccess("Successfully Rejected!...")
          this.closebuttonApproveAmt.nativeElement.click();
          this.remsService.getApproveAmtchg(this.PremiseId)
          .subscribe(result => {
            let approvalAmtChg = result?.data
            if(approvalAmtChg?.length >0)
            {
              this.isScheduleAmtChg = true
              this.approveAmtChgData = result.data
            }
            else
            {
              this.isScheduleAmtChg = false
            }
          })
        }
        else
        {
          this.notification.showError(result.message)
        }
      }) 
  }

  AddEditCCBS() {
    this.router.navigate(['/rems/occupancyccbs'], { skipLocationChange: isSkipLocationChange });
  }

  getDropDown() {
    this.remsService2.getDropDown(this.PremiseId)
      .subscribe((results) => {
        console.log("type", results)
        this.dropDownValue = results.data;
      })
  }

  private getMenuUrl() {
    this.shareService.menuUrlData = [];
    this.dataService.getMenuUrl()
      .subscribe((results: any[]) => {
        let data = results['data'];
        if (data) {
          this.shareService.titleUrl = data[0].url;
          this.shareService.menuUrlData = data;
        };
        this.shareService.transactionList = [];
        this.shareService.masterList = [];
        this.shareService.menuUrlData.forEach(element => {
          if (element.type === "transaction") {
            this.shareService.transactionList.push(element);
          } else if (element.type === "master") {
            this.shareService.masterList.push(element);
          }
        });
      })
  }

  getPremiseView() {
    this.remsService.getPremiseView(this.PremiseId)
      .subscribe(result => {
        this.premiseData = result;
        console.log("getPremiseView", this.premiseData)
        this.type = result.type.id;
        this.typetext = result.type.text
        this.premise_createdate = result.created_date
        this.request_Status = result.requeststatus
        this.premise_status = result.premise_status;
        this.premiseOccupiedArea = result.rent_area;
        this.isRejectBtn = false;
        this.isOnBordApproveBtn = false;
        if (result.premise_status == "PENDING_HEADER" || result.premise_status == "APPROVED"
          || result.premise_status == "PENDING_CHECKER" || result.premise_status == "REJECTED") {
          this.isModification = false;
          this.EBadvanceModification = false;
          this.isEditEbBtn = true;
        }
        if (this.isMaker == true && result.premise_status == "APPROVED" && result.main_status == "APPROVED" &&
          result.requeststatus == "ONBOARD") {
          this.isModiReqBtn = true;
          this.isRenewalReqBtn = true;
          this.isTerminateReqBtn = true;
        }
        if (this.isMaker == true && result.premise_status == "APPROVED" && result.main_status == "APPROVED" &&
          result.requeststatus == "RENEWAL") {
          this.isModiReqBtn = true;
          this.isRenewalReqBtn = true;
          this.isTerminateReqBtn = true;
        }
        if (this.isMaker == true && result.premise_status == "APPROVED" && result.main_status == "APPROVED" &&
          result.requeststatus == "MODIFICATION") {
          this.isModiReqBtn = true;
          this.isRenewalReqBtn = true;
          this.isTerminateReqBtn = true;
        }
        if (this.isMaker == true && result.premise_status == "PENDING_CHECKER"
          && result.main_status == "APPROVED" && result.requeststatus == "MODIFICATION") {
          this.isModification = true;
        }
        //renewal
        if (this.isMaker == true && result.premise_status == "PENDING_CHECKER"
          && result.main_status == "APPROVED" && result.requeststatus == "RENEWAL") {
          this.isModification = true;
        }

        if (this.isModification && result.premise_status == "PENDING_CHECKER") {
          this.modSummary.isEditBtn = false;
        }
        let json: any = {
          data: [{
            title: "PremiseView",
            name: result.name,
            code: result.code,
            routerUrl: "/rems",
            headerName: "REMS"
          }]
        }
        this.remsshareService.premiseBackNavigation.next(json)
        this.premiseViewId = result.id;


        if (result.requeststatus == "RENEWAL") {
          this.btnName = "Agreement and Rent"
          this.dropDownTag = "Agreement and Rent";
          this.isShowRenewal = true;
          this.isShowAll = false;
          this.getAgreement();
        } else {
          this.getOccupancyList();
          if (result.requeststatus != "RENEWAL") {
            this.isShowAll = true;
            this.isShowRenewal = false;
          }

        }

        // this.getOccupancyList();

        this.getTableValue();
        this.remsshareService.modificationView.next(this.premiseData)
        // let datas = this.shareService.menuUrlData;
        // console.log("pview-datas", datas);

        // if (this.isChecker === true) {
        //   this.isModiReqBtn = false;
        //   this.isRenewalReqBtn = false;
        //   this.isTerminateReqBtn = false;
        // }
        // if (this.isHeader === true) {
        //   this.isModiReqBtn = false;
        //   this.isRenewalReqBtn = false;
        //   this.isTerminateReqBtn = false;
        // }
        if (this.isChecker === true && result.requeststatus == "MODIFICATION") {
          this.isModification = false;
          this.isChangeViewBtn = true;
        }
        if (this.isHeader === true && result.requeststatus == "MODIFICATION") {
          this.isChangeViewBtn = true;
          this.isModification = false;
        }
        if (this.isMaker === true && result.requeststatus == "MODIFICATION") {
          this.isChangeViewBtn = false;
          this.isModification = true;
        }
        if (this.isChecker === true && result.requeststatus == "RENEWAL") {
          this.isModification = false;
          this.isChangeViewBtn = true;
        }
        if (this.isHeader === true && result.requeststatus == "RENEWAL") {
          this.isChangeViewBtn = true;
          this.isModification = false;
        }
        if (this.isMaker === true && result.requeststatus == "RENEWAL") {
          this.isChangeViewBtn = false;
          this.isModification = true;
        }

        if (this.isMaker === true && result.premise_status == "DRAFT") {
          this.isAddBtn = true;
          this.isEditBtn = true;
          this.isSubmitToCheckerBtn = true;
          this.isEditEbBtn = true;
        }
        if (this.isMaker === true && result.requeststatus == "RENEWAL" && result.premise_status == "DRAFT"
          && result.main_status == "APPROVED") {
          this.isAddBtn = true;
          this.isSubmitToCheckerBtn = true;
          this.isEditBtn = false;
        }
        if (this.isMaker === true && result.premise_status == "PENDING_CHECKER") {
          this.isAddBtn = false;
          this.isEditBtn = false;
          console.log("this.isSubmitToCheckerBtn = false;")
          this.isSubmitToCheckerBtn = false;
        }
        // if (this.isMaker === true && result.premise_status == "DRAFT") {
        //   this.isModiReqBtn = false;
        //   this.isRenewalReqBtn = false;
        //   this.isTerminateReqBtn = false;
        // }
        if (this.isChecker === true && result.requeststatus == "ONBOARD") {
          this.isChangeViewBtn = false;
        }
        if (this.isHeader === true && result.requeststatus == "ONBOARD") {
          this.isChangeViewBtn = false;
        }
        if (this.isHeader === true && result.requeststatus == "ONBOARD") {
          this.isChangeViewBtn = false;
        }
        if (this.isMaker === true && result.requeststatus == "MODIFICATION"
          && result.premise_status == "APPROVED") {
          this.isModiReqBtn = true;
          this.isTerminateReqBtn = true;
          this.isModification = false;
        }

        if (this.isMaker === true && result.requeststatus == "RENEWAL"
          && result.premise_status == "APPROVED") {
          this.isRenewalReqBtn = true;
          this.isTerminateReqBtn = true;
          this.isModification = false;
        }

        if (this.isHeader == true && result.premise_status == "PENDING_HEADER"
          && result.requeststatus == "RENEWAL") {
          this.isRenewalApproverBtn = true;
        }

        if (this.isHeader == true && result.premise_status == "PENDING_HEADER"
          && result.requeststatus == "MODIFICATION") {
          this.isApproverBtn = true;
        } else if (this.isHeader == true && result.premise_status == "PENDING_HEADER"
          && result.requeststatus == "ONBOARD") {
          this.isOnBordApproveBtn = true;
        } else if (this.isHeader == true && result.premise_status == "PENDING_HEADER"
          && result.requeststatus == "TERMINATION") {
          this.isOnBordApproveBtn = true;
        }
        if (this.isHeader === true && result.premise_status == "PENDING_HEADER") {
          this.isRejectBtn = true;
        } if (this.isChecker === true && result.premise_status == "PENDING_CHECKER") {
          this.isRejectBtn = true;
        } if (result.main_status == "APPROVED" && result.requeststatus == "MODIFICATION"
          && this.isMaker === true && result.premise_status == "REJECTED") {
          this.isModiReqBtn = true;
        } if (result.main_status == "APPROVED" && result.requeststatus == "RENEWAL"
          && this.isMaker === true && result.premise_status == "REJECTED") {
          this.isModiReqBtn = true;
          this.isRenewalReqBtn = true;
        }

      })
  }

  getTableValue() {
    this.route.queryParams.subscribe(params => {
      this.backNavigationTable = params.status;
      if (this.backNavigationTable == "Amenities & Infrastructure") {
        this.dropDownTag = "Amenities & Infrastructure";
        this.btnName = "Amenities & Infrastructure"
        this.getAmenties();
      } else if (this.backNavigationTable == "Agreement and Rent") {
        this.dropDownTag = "Agreement and Rent";
        this.btnName = "Agreement and Rent"
        this.getAgreement();
      } else if (this.backNavigationTable == "Documents") {
        this.dropDownTag = "Documents";
        this.btnName = "Documents"
        this.getDocumentList();
      } else if (this.backNavigationTable == "EB Details") {
        this.btnName = "EB Details"
        this.dropDownTag = "EB Details";
        // this.ebdetailssummary();
        this.remsshareService.ebdetailsEditValue.next('')
        this.getpremiseseb(1)
        this.getpremiseseb_modification()
        if (this.premiseData.requeststatus === "MODIFICATION" && this.isHeader == true) {
          this.isEbDetails = false;
        } if (this.premiseData.requeststatus === "MODIFICATION" && this.isChecker == true) {
          this.isEbDetails = false;
        } if (this.premiseData.requeststatus === "MODIFICATION" && this.isMaker === true
          && this.premiseData.premise_status == "DRAFT") {
          this.isEbDetails = true;
        }
      } else if (this.backNavigationTable == "Insurance Details") {
        this.btnName = "Insurance Details"
        this.dropDownTag = "Insurance Details";
        this.getInsuranceDetails();
      } else if (this.backNavigationTable == "Landlord Details") {
        this.btnName = "Landlord Details"
        this.dropDownTag = "Landlord Details";
        this.getlanlordsummary();
      } else if (this.backNavigationTable == "Legal Clearance") {
        this.btnName = "Legal Clearance"
        this.dropDownTag = "Legal Clearance";
        this.getLegalClearance();
      } else if (this.backNavigationTable == "Legal & Statutory Notice") {
        this.btnName = "Legal & Statutory Notice"
        this.dropDownTag = "Legal & Statutory Notice";
        this.getLegalNotice();
      } else if (this.backNavigationTable == "Licenses & Certificate") {
        this.btnName = "Licenses & Certificate"
        this.dropDownTag = "Licenses & Certificate";
        this.getLicensesDetails();
      } else if (this.backNavigationTable == "Occupancy Details") {
        this.btnName = "Occupancy Details"
        this.dropDownTag = "Occupancy Details";
        this.getOccupancyList();
      } else if (this.backNavigationTable == "Premise Details") {
        this.dropDownTag = "Premise Details";
        this.btnName = "Premise Details"
        this.getPremiseDetails();
      } else if (this.backNavigationTable == "Renovations & Additions") {
        this.btnName = "Renovations & Additions";
        this.dropDownTag = "Renovations & Additions"
        this.getRenovation();
      } else if (this.backNavigationTable == "Repairs & Maintenance") {
        this.btnName = "Repairs & Maintenance";
        this.dropDownTag = "Repairs & Maintenance";
        this.repairsummary();
      } else if (this.backNavigationTable == "Statutory Payments") {
        this.dropDownTag = "Statutory Payments";
        this.btnName = "Statutory Payments";
        this.getStatutory();
      }
    });
  }


  onCancelClick() {
    this.onCancel.emit()
  }

  getOccupancyList(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
    this.remsService.getOccupancyList(filter, sortOrder, pageNumber, pageSize, this.PremiseId)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.occupancyList = datas;
        let datapagination = results["pagination"];
        this.occupancyList = datas;
        // for(let i=0; i < this.occupancyList.length; i++){
        //  let number = this.occupancyList[i].occupancy_status
        //   if(number == 2){
        //    this.occu_Status = "Closed"
        //   }
        //   if(number == 1){
        //     this.occu_Status = "Open"
        //   }
        // }
        if (this.occupancyList.length === 0) {
          this.isoccupancypage = false
        }
        if (this.occupancyList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
          this.isoccupancypage = true
        }
      })
  }

  nextClickOccupancy() {
    if (this.has_next === true) {
      this.currentpage = this.presentpage + 1
      this.getOccupancyList("", 'asc', this.presentpage + 1, 10)
    }
  }

  previousClickOccupancy() {
    if (this.has_previous === true) {
      this.currentpage = this.presentpage - 1
      this.getOccupancyList("", 'asc', this.presentpage - 1, 10)
    }
  }

  occupancyEdit(data: any) {
    let premiseid = {
      premiseId: this.PremiseId
    }
    let jsonData = Object.assign({}, premiseid, data)
    this.remsshareService.occupancyEditValue.next(jsonData);
    this.remsshareService.premiseArea.next(this.premiseOccupiedArea)
    this.router.navigate(['/rems/occupancyedit'], { skipLocationChange: isSkipLocationChange });
  }


  deleteoccupancy(data) {
    console.log("occ", data)
    let value = data.id
    if (data.agreement_id.length == 0 && this.modificationReqSummary.length > 0) {
      let chkApproval = this.modificationReqSummary.filter(x => x.premise_type.id == 1 && x.ref_id == data.id)
      if (chkApproval.length == 0)
      {
        this.notification.showError("You can not Modify before getting the Approval")
        return false
      }

      this.remsService.deleteoccupancy(value, this.PremiseId)
        .subscribe(result => {
          let code = result.code
          if (code === "INVALID_MODIFICATION_REQUEST") {
            this.notification.showError("You can not Modify before getting the Approval")
          } else {
            this.notification.showSuccess("Successfully deleted....")
            this.getOccupancyList();
            if (this.isModification) {
              this.modSummary.getModificationView();
            }
          }
        })
    } else {
      this.notification.showError("Should Not be Delete Occupancy...")
    }

  }

  deleterenovation(data) {
    let value = data.id
    if (this.modificationReqSummary.length > 0) {
      let chkApproval = this.modificationReqSummary.filter(x => x.premise_type.id == 11 && x.ref_id == data.id)
      if (chkApproval.length == 0)
      {
        this.notification.showError("You can not Modify before getting the Approval")
        return false
      }

    this.remsService.deleterenovation(value)
      .subscribe(result => {
        let code = result.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Modify before getting the Approval")
        }
        else {
          this.notification.showSuccess("Successfully deleted....")
          this.getRenovation();
          if (this.isModification) {
            this.modSummary.getModificationView();
          }
        }
      })
    }
  }


  getlanlordsummary(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10) {
    this.remsService.getlanlordsummary(filter, sortOrder, pageNumber, pageSize, this.PremiseId)
      .subscribe((result) => {
        let datass = result['data'];
        console.log("landlord", datass)
        let datapagination = result["pagination"];
        this.getLandlordList = datass;
        if (this.getLandlordList.length === 0) {
          this.isLandLordpage = false
        }
        if (this.getLandlordList.length > 0) {
          this.has_next1 = datapagination.has_next;
          this.has_previous1 = datapagination.has_previous;
          this.landlordPresentPage = datapagination.index;
          this.isLandLordpage = true

        }
      })

  }

  nextClick() {
    if (this.has_next1 === true) {
      this.landlordCurrentPage = this.landlordPresentPage + 1
      this.getlanlordsummary("", 'asc', this.landlordPresentPage + 1, 10)
    }
  }

  previousClick() {
    if (this.has_previous1 === true) {
      this.landlordCurrentPage = this.landlordPresentPage - 1
      this.getlanlordsummary("", 'asc', this.landlordPresentPage - 1, 10)
    }

  }

  landlordEdit(data: any, openMode) {
    let text = {"openMode" : openMode}
    data = Object.assign({}, data, text)   
    this.remsshareService.landlordEdit.next(data)
    this.router.navigateByUrl('/rems/landlordedit', data)
    this.router.navigate(['/rems/landlordedit'], { skipLocationChange: isSkipLocationChange });

    return data;
  }


  landlordBtn() {
    this.getlanlordsummary();

  }

  deletelanlord(data) {
    console.log("land", data)
    let value = data.id
    if (data.agreement_id.length == 0 && this.modificationReqSummary.length > 0) {
      let chkApproval = this.modificationReqSummary.filter(x => x.premise_type.id == 3 && x.ref_id == data.id)
      if (chkApproval.length == 0)
      {
        this.notification.showError("You can not Modify before getting the Approval")
        return false
      }
      this.remsService.deletelanlordform(value, this.PremiseId)
        .subscribe(result => {
          let code = result.code
          if (code === "INVALID_MODIFICATION_REQUEST") {
            this.notification.showError("You can not Modify before getting the Approval")
          }
          else {
            this.notification.showSuccess("Successfully deleted....")
            this.getlanlordsummary();
            if (this.isModification) {
              this.modSummary.getModificationView();
            }
          }
        })
    } else {
      this.notification.showError("Should Not be Delete Landlord...")
    }
  }

  landLordView(id) {
    let json: any = {
      premise_id: this.PremiseId,
      landlordView: id
    }
    this.remsshareService.landLordView.next(json)
    this.remsshareService.premiseViewID.next(this.premiseData)

    this.router.navigate(['/rems/landLordView'], { skipLocationChange: isSkipLocationChange });
  }
  OccupancyView(id) {
    let datas: any = {
      premise_id: this.PremiseId,
      OccupancyView: id
    }
    this.remsshareService.OccupancyView.next(datas)
    this.router.navigate(['/rems/OccupancyView'], { skipLocationChange: isSkipLocationChange });
  }


  getAmenties(pageNumber = 1) {
    this.remsService.getAmenties(this.PremiseId, pageNumber)
      .subscribe((result) => {
        let datapagination = result.pagination
        this.amenitiesList = result.data;
        if (result.code === 'INVALID_INWARDHEADER_ID' && result.description === 'Invalid inwardheader ID') {
          this.isAmenitiesData = true
        } else if (this.amenitiesList.length > 0) {
          this.next_amenities = datapagination.has_next;
          this.previous_amenities = datapagination.has_previous;
          this.present_amentie_pages = datapagination.index;
          this.is_amenitiesPage = true;
        } else if (this.amenitiesList.length == 0) {
          this.isAmenitiesData = true
        }
      })
  }

  amenities_nextClick() {
    if (this.next_amenities === true) {
      this.current_amenitiesPage = this.present_amentie_pages + 1
      this.getAmenties(this.present_amentie_pages + 1)
    }
  }

  amenities_previousClick() {
    if (this.previous_amenities === true) {
      this.current_amenitiesPage = this.present_amentie_pages - 1
      this.getAmenties(this.present_amentie_pages - 1)
    }
  }
  addAmenties() {
    this.remsshareService.amenities.next('')
    this.router.navigate(['/rems/amenitiesForm'], { skipLocationChange: isSkipLocationChange });
  }

  amenitiesEdit(data) {
    this.remsshareService.amenities.next(data)
    this.router.navigate(['/rems/amenitiesForm'], { skipLocationChange: isSkipLocationChange });
  }
  amenitiesDelete(id) {
    if (this.modificationReqSummary.length > 0) {
      let chkApproval = this.modificationReqSummary.filter(x => x.premise_type.id == 6 && x.ref_id == id)
      if (chkApproval.length == 0)
      {
        this.notification.showError("You can not Modify before getting the Approval")
        return false
      }

    this.remsService.amenitiesDelete(id)
      .subscribe((result) => {
        let code = result.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Modify before getting the Approval")
        }
        else {
          this.notification.showSuccess("Deleted....")
          this.getAmenties();
          if (this.isModification) {
            this.modSummary.getModificationView();
          }
        }
      })
    }
  }
  licensesDelete(id) {
    if (this.modificationReqSummary.length > 0) {
      let chkApproval = this.modificationReqSummary.filter(x => x.premise_type.id == 12 && x.ref_id == id)
      if (chkApproval.length == 0)
      {
        this.notification.showError("You can not Modify before getting the Approval")
        return false
      }

    this.remsService.licensesDelete(id)
      .subscribe((result) => {
        let code = result.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Modify before getting the Approval")
        }
        else {
          this.notification.showSuccess("Deleted....")
          this.getLicensesDetails();
          if (this.isModification) {
            this.modSummary.getModificationView();
          }
        }
      })
    }
  }
  occupancyCreate() {
    this.remsshareService.occupancyEditValue.next(this.PremiseId);
    this.remsshareService.premiseArea.next(this.premiseOccupiedArea)
    this.router.navigate(['/rems/occupancyCreate'], { skipLocationChange: isSkipLocationChange });
  }
  landLordCreate() {
    this.router.navigate(['/rems/landlordcreate'], { skipLocationChange: isSkipLocationChange });
  }
  legalDataCreate() {
    this.remsshareService.legaldataForm.next('')
    this.router.navigate(['/rems/legalDataForm'], { skipLocationChange: isSkipLocationChange });
  }
  legalEdit(data) {
    this.remsshareService.legaldataForm.next(data)
    this.router.navigate(['/rems/legalDataForm'], { skipLocationChange: isSkipLocationChange });
  }
  legalDelete(id) {
    this.remsService.legalDelete(id)
      .subscribe((result) => {
        this.notification.showSuccess("Deleted....")
        this.getLegalData();
        if (this.isModification) {
          this.modSummary.getModificationView();
        }
      })
  }

  getLegalData(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10) {
    this.remsService.getLegalData(filter, sortOrder, pageNumber, pageSize)
      .subscribe((result) => {
        let datass = result['data'];
        let datapagination = result["pagination"];
        this.legalDataList = datass;
        if (this.legalDataList.length === 0) {
          this.is_LegalPage = false
        }
        if (this.legalDataList.length > 0) {
          this.next_legal = datapagination.has_next;
          this.previous_legal = datapagination.has_previous;
          this.present_legal_pages = datapagination.index;
          this.is_LegalPage = true
        }
      })
  }

  legal_nextClick() {
    if (this.next_legal === true) {
      this.current_LegalPage = this.present_legal_pages + 1
      this.getLegalData("", 'asc', this.present_legal_pages + 1, 10)
    }
  }

  legal_previousClick() {
    if (this.previous_legal === true) {
      this.current_LegalPage = this.present_legal_pages - 1
      this.getLegalData("", 'asc', this.present_legal_pages - 1, 10)
    }
  }

  getAgreement(pageNumber = 1) {
    this.remsService.getAgreement(pageNumber, this.PremiseId)
      .subscribe((results) => {
        console.log("agg", results)
        let datas = results.data
        let datapagination = results.pagination;
        this.agreementList = datas;
        if (this.agreementList.length == 0) {
          this.agreementEndDate = undefined;
        }
        for (let i = 0; i < this.agreementList.length; i++) {
          if (this.agreementList[i].type.text == "Rent") {
            this.scheduledType = this.agreementList[i].type.text
            this.agreementEndDate = this.agreementList[i].end_date
          }
          if (this.agreementList[i].type.text == "Amenties") {
            this.scheduledType = this.agreementList[i].type.text
            this.amenitiesagreementEndDate = this.agreementList[i].end_date
          } if (this.agreementList[i].type.text == "Maintenance") {
            this.scheduledType = this.agreementList[i].type.text
            this.maintenanceagreementEnddate = this.agreementList[i].end_date
          }

          // this.scheduledType = this.agreementList[i].type.text
          // this.agreementEndDate = this.agreementList[i].end_date
          // console.log("agreementEndDate",this.agreementEndDate )

        }
        if (this.agreementList.length === 0) {
          this.is_AgreementPage = false
        } else if (this.agreementList.length >= 0) {
          this.next_agreement = datapagination.has_next;
          this.previous_agreement = datapagination.has_previous;
          this.present_agreement_pages = datapagination.index;
          this.is_AgreementPage = true;
        }
      })
  }

  agreement_nextClick() {
    if (this.next_agreement === true) {
      this.getAgreement(this.present_agreement_pages + 1)
    }
  }

  agreement_previousClick() {
    if (this.previous_agreement === true) {
      this.getAgreement(this.present_agreement_pages - 1)
    }
  }

  addAgreement() {
    this.remsshareService.agreementForm.next('')
    this.remsshareService.premiseReqStatus.next(this.request_Status)
    this.remsshareService.premisesStatus.next(this.premise_status)
    this.remsshareService.startagreementEnddate.next(this.agreementEndDate)
    this.remsshareService.amenitiesagreementEnddate.next(this.amenitiesagreementEndDate)
    this.remsshareService.maintenanceagreementEnddate.next(this.maintenanceagreementEnddate)
    if (this.typetext == "Leased" || this.typetext == "Owned and Leased" || this.typetext == "Rent Free") {
      this.leased = true;
      this.remsshareService.premiseLeased.next(this.leased)
    } if (this.typetext == "Owned") {
      this.owned = false;
      this.remsshareService.premiseLeased.next(this.owned)
    }
    this.router.navigate(['/rems/leaseAgreement'], { queryParams: { comefrom: 'ADDAGREEMENT' }, skipLocationChange: isSkipLocationChange });
  }

  EditAgreement(data) {
    this.remsshareService.agreementForm.next(data)
    this.remsshareService.premiseReqStatus.next(this.request_Status)
    this.remsshareService.premisesStatus.next(this.premise_status)
    if (this.typetext == "Leased" || this.typetext == "Owned and Leased" || this.typetext == "Rent Free") {
      this.leased = true;
      this.remsshareService.premiseLeased.next(this.leased)
    } if (this.typetext == "Owned") {
      this.owned = false;
      this.remsshareService.premiseLeased.next(this.owned)
    }
    this.router.navigate(['/rems/leaseAgreement'], { queryParams: { comefrom: 'EDITAGREEMENT' }, skipLocationChange: isSkipLocationChange });
  }
  agreementDelete(id) {
    if (this.modificationReqSummary.length > 0) {
      let chkApproval = this.modificationReqSummary.filter(x => x.premise_type.id == 4 && x.ref_id == id)
      if (chkApproval.length == 0)
      {
        this.notification.showError("You can not Modify before getting the Approval")
        return false
      }

    this.remsService.agreementDelete(id, this.PremiseId)
      .subscribe((result) => {
        let code = result.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Modify before getting the Approval")
        }
        else {
          this.notification.showSuccess("Deleted....")
          this.getAgreement();
          if (this.isModification) {
            this.modSummary.getModificationView();
          }
        }
      })
    }
  }

  agreementView(id) {
    this.remsshareService.agreementView.next(id)
    this.remsshareService.premiseViewID.next(this.premiseData)
    this.router.navigate(['/rems/agreementView'], { skipLocationChange: isSkipLocationChange });
  }


  legalClearanceCreate() {
    this.remsshareService.legalClearanceForm.next('')
    this.router.navigate(['/rems/legalClearanceForm'], { skipLocationChange: isSkipLocationChange });
  }
  legalClearanceEdit(data) {
    this.remsshareService.legalClearanceForm.next(data)
    this.router.navigate(['/rems/legalClearanceForm'], { skipLocationChange: isSkipLocationChange });
  }


  getLegalClearance(pageNumber = 1) {
    this.remsService.getLegalClearance(this.PremiseId, pageNumber)
      .subscribe((results) => {
        let datas = results.data
        let datapagination = results.pagination;
        this.legalClearanceList = datas;
        if (this.legalClearanceList.length === 0) {
          this.is_clearancePage = false
        } else if (this.legalClearanceList.length >= 0) {
          this.next_clearance = datapagination.has_next;
          this.previous_clearance = datapagination.has_previous;
          this.present_clearance = datapagination.index;
          this.is_clearancePage = true;
        }
      })
  }

  legalClearanceDelete(id) {
    if (this.modificationReqSummary.length > 0) {
    let chkApproval = this.modificationReqSummary.filter(x => x.premise_type.id == 7 && x.ref_id == id)
    if (chkApproval.length == 0)
    {
      this.notification.showError("You can not Modify before getting the Approval")
      return false
    }

    this.remsService.legalClearanceDelete(id)
      .subscribe((result) => {
        let code = result.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Modify before getting the Approval")
        }
        else {
          this.notification.showSuccess("Deleted....")
          this.getLegalClearance();
          if (this.isModification) {
            this.modSummary.getModificationView();
          }
        }

      })
    }
  }
  clearance_nextClick() {
    if (this.next_clearance === true) {
      this.getLegalClearance(this.present_clearance + 1)
    }
  }

  clearance_previousClick() {
    if (this.previous_clearance === true) {
      this.getLegalClearance(this.present_clearance - 1)
    }
  }

  premiseType() {
    if (this.type == 1) {
      return "LEASED"
    } else if (this.type == 2) {
      return "OWNED"
    } else {
      return "Owned and Leased"
    }
  }
  ebdetailssummary(pageNumber = 1, pageSize = 10) {
    this.remsService.ebdetailssummary(pageNumber, pageSize, this.PremiseId)
      .subscribe((results) => {
        let datas = results.data;
        let datapagination = results["pagination"];
        this.ebdetailsList = datas;
        if (this.ebdetailsList.length === 0) {
          this.is_ebdetailspage = false
        }
        if (this.ebdetailsList.length > 0) {
          this.has_nextebdetails = datapagination.has_next;
          this.has_previousebdetails = datapagination.has_previous;
          this.presentebdetailspage = datapagination.index;
          this.is_ebdetailspage = true
        }
      })
    let data: any = this.remsshareService.PremiseView.value;
    this.premiseviewid = data.id
    if (this.premiseData.requeststatus === "MODIFICATION") {
      this.EBadvanceModification = true;
      this.getModificationView();

    } if (this.premiseData.requeststatus === "MODIFICATION" && this.premiseData.premise_status == "DRAFT") {
      this.isEbDetails = true;
      this.getModificationView();

    }

  }

  addadvance(data) {
    this.eddetails = data.id
    this.ebadavancesummary();
    this.remsshareService.ebadvanceForm.next(data)
    let datas: any = this.remsshareService.PremiseView.value;
    this.premiseviewid = datas.id
    if (datas.requeststatus === "MODIFICATION") {
      this.EBadvanceModification = true;
      this.getModificationView();

    } if (this.isChecker === true && datas.requeststatus == "MODIFICATION") {
      this.EBadvanceModification = false;
    } if (this.isHeader === true && datas.requeststatus == "MODIFICATION") {
      this.EBadvanceModification = false;
    }
  }

  nextClickEbdetails() {
    if (this.has_nextebdetails === true) {
      this.currentebdetailspage = this.presentebdetailspage + 1
      // this.ebdetailssummary(this.presentebdetailspage + 1)
      this.getpremiseseb(this.presentebdetailspage+1)

    }
  }


  previousClickEbdetails() {
    if (this.has_previousebdetails === true) {
      this.currentebdetailspage = this.presentebdetailspage - 1
      // this.ebdetailssummary(this.presentebdetailspage - 1)
      this.getpremiseseb(this.presentebdetailspage-1)
    }
  }

  ebdetailsDelete(data) {
    let value = data.id
    if (this.modificationReqSummary.length > 0) {
      let chkApproval = this.modificationReqSummary.filter(x => x.premise_type.id == 8 && x.ref_id == data.id)
      if (chkApproval.length == 0)
      {
        this.notification.showError("You can not Modify before getting the Approval")
        return false
      }

    this.remsService.ebdetailsDeleteForm(value)
      .subscribe(result => {
        let code = result.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Modify before getting the Approval")
        }
        else {
          this.notification.showSuccess("Successfully deleted....")
          this.ebdetailssummary();
          return true
        }
      })
    }
  }
  EbdetailsEdit(data: any) {
    this.remsshareService.ebdetailsEditValue.next(data)
    this.router.navigate(['/rems/ebdetailsEdit'], { skipLocationChange: isSkipLocationChange });
    return data;
  }

  addEBDetails() {
    this.remsshareService.ebdetailsEditValue.next('')
    this.router.navigate(['/rems/ebdetailsCreate'], { skipLocationChange: isSkipLocationChange });
  }

  repairsummary(pageNumber = 1, pageSize = 10) {
    this.remsService.repairsummary(pageNumber, pageSize, this.PremiseId)
      .subscribe((result) => {
        let datas = result.data;
        let datapagination = result["pagination"];
        this.repairList = datas;
        if (this.repairList.length === 0) {
          this.is_repairpage = false
        }
        if (this.repairList.length > 0) {
          this.has_nextrepair = datapagination.has_next;
          this.has_previousrepair = datapagination.has_previous;
          this.presentrepairpage = datapagination.index;
          this.is_repairpage = true
        }
      })
  }
  addRepairMaintance() {
    this.router.navigate(['/rems/repairandmaintenanceCreate'], { skipLocationChange: isSkipLocationChange });
  }

  RepairEdit(data: any) {
    this.remsshareService.repairEditValue.next(data)
    this.router.navigate(['/rems/repairandmaintenanceEdit'], { skipLocationChange: isSkipLocationChange });
    return data;
  }

  RepairDelete(data) {
    let value = data.id
    if (this.modificationReqSummary.length > 0) {
      let chkApproval = this.modificationReqSummary.filter(x => x.premise_type.id == 10 && x.ref_id == data.id)
      if (chkApproval.length == 0)
      {
        this.notification.showError("You can not Modify before getting the Approval")
        return false
      }

    this.remsService.repairDeleteForm(value)
      .subscribe(result => {
        let code = result.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Modify before getting the Approval")
        }
        else {
          this.notification.showSuccess("Successfully deleted....")
          this.repairsummary();
          if (this.isModification) {
            this.modSummary.getModificationView();
          }
        }
      })
    }
  }

  nextClickRepair() {
    if (this.has_nextrepair === true) {
      this.currentrepairpage = this.presentrepairpage + 1
      this.repairsummary(this.presentrepairpage + 1)
    }
  }


  previousClickRepair() {
    if (this.has_previousrepair === true) {
      this.currentrepairpage = this.presentrepairpage - 1
      this.repairsummary(this.presentrepairpage - 1)
    }
  }


  adddetailRM(data) {
    this.remsshareService.repairEditValue.next(data.id)
    this.remsshareService.premiseViewID.next(this.premiseData)

    this.router.navigate(['/rems/RM'], { skipLocationChange: isSkipLocationChange });
  }
  /*   private getebdetails() {
      this.remsService.getebdetails()
        .subscribe((results: any[]) => {
          let databb = results["data"];
          this.ebdetailsidList = databb;
          console.log(">>>FUCCKKCKC", this.ebdetailsidList)
        })
    }
   */
  setDate(date: string) {
    this.currentDate = date
    this.currentDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    return this.currentDate;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  only_num(event) {
    var k;
    k = event.charCode;
    return ((k > 48 && k < 57) || (k > 96 && k < 123) || (k >= 48 && k <= 57));
  }
  only_char(event) {
    var a;
    a = event.which;
    if ((a < 65 || a > 90) && (a < 97 || a > 122)) {
      return false;
    }
  }


  ebadavancesummary(pageNumber = 1, pageSize = 10) {
    this.remsService.ebadavancesummary(pageNumber, pageSize, this.eddetails)
      .subscribe((result) => {
        let datas = result['data'];
        let datapagination = result["pagination"];
        this.ebadvanceList = datas;
        if (this.ebadvanceList.length === 0) {
          this.is_ebadvance = false
        }
        if (this.ebadvanceList.length >= 0) {
          this.has_nextadvance = datapagination.has_next;
          this.has_previousadvance = datapagination.has_previous;
          this.presentadvancepage = datapagination.index;
          this.is_ebadvance = true
        }
      })
    let data: any = this.remsshareService.PremiseView.value;
    this.premiseviewid = data.id
    if (data.requeststatus === "MODIFICATION") {
      this.EBadvanceModification = true;
      this.getModificationView();
    } if (this.isChecker === true && data.requeststatus == "MODIFICATION") {
      this.EBadvanceModification = false;
    } if (this.isHeader === true && data.requeststatus == "MODIFICATION") {
      this.EBadvanceModification = false;
    }

  }

  nextClickEbadvance() {
    if (this.has_next === true) {
      this.currentadvancepage = this.presentadvancepage + 1
      this.ebadavancesummary(this.presentadvancepage + 1)
    }
  }

  previousClickEbadvance() {
    if (this.has_previous === true) {
      this.currentadvancepage = this.presentadvancepage - 1
      this.ebadavancesummary(this.presentadvancepage - 1)
    }
  }
  EbadvanceEdit(data: any) {
    this.remsshareService.ebadvanceForm.next(data)
    this.getebadvance();
  }
  getQueryParams() {
    this.route.queryParams.subscribe(params => {
      this.paramsData = params.status;
      if (this.paramsData == "Occupancy Details") {
        this.isOccupancyTable = true;
        this.isEbDetails = false;
      } else if (this.paramsData == "Statutory Payments") {
        this.isEbDetails = false;
        this.isOccupancyTable = false;
      } else if (this.paramsData == "Amenities & Infrastructure") {
        this.isEbDetails = false;
        this.isOccupancyTable = false;
      } else if (this.paramsData == "EB Details") {
        if (this.premiseData.requeststatus === "MODIFICATION" && this.isHeader == true) {
          this.isEbDetails = false;
        } if (this.premiseData.requeststatus === "MODIFICATION" && this.isChecker == true) {
          this.isEbDetails = false;
        } if (this.premiseData.requeststatus === "MODIFICATION" && this.isMaker === true
          && this.premiseData.premise_status == "DRAFT") {
          this.isEbDetails = true;
        }
        this.isOccupancyTable = false;
        this.getModificationView();
      } else if (this.paramsData == "Licenses & Certificate") {
        this.isEbDetails = false;
        this.isOccupancyTable = false;
      } else if (this.paramsData == "Repairs & Maintenance") {
        this.isEbDetails = false;
        this.isOccupancyTable = false;
      } else if (this.paramsData == "Renovations & Additions") {
        this.isEbDetails = false;
        this.isOccupancyTable = false;
      } else if (this.paramsData == "Insurance Details") {
        this.isEbDetails = false;
        this.isOccupancyTable = false;
      } else if (this.paramsData == "Legal & Statutory Notice") {
        this.isEbDetails = false;
        this.isOccupancyTable = false;
      } else if (this.paramsData == "Agreement and Rent") {
        this.isEbDetails = false;
        this.isOccupancyTable = false;
      } else if (this.paramsData == "Premise Details") {
        this.isEbDetails = false;
        this.isOccupancyTable = false;
      } else if (this.paramsData == "Legal Clearance") {
        this.isEbDetails = false;
        this.isOccupancyTable = false;
      } else if (this.paramsData == "Documents") {
        this.isEbDetails = false;
        this.isOccupancyTable = false;
      } else if (this.paramsData == "Landlord Details") {
        this.isEbDetails = false;
        this.isOccupancyTable = false;
      }
    })
  }

  backToRemsSummary() {
    let landlordEdit = this.remsshareService.landlordFlag.value
    if(landlordEdit)
    {
      this.notification.showWarning("Please view Landlord Bank and Tax Details.")
    }
    else
    {
      this.router.navigate(['/rems/rems/remsSummary'], { skipLocationChange: isSkipLocationChange });
      this.remsshareService.backtosum.next('premises')
    }
  }

  getModificationView() {
    this.remsService.getebmodificationsummary(this.premiseviewid)
      .subscribe((results) => {
        this.getQueryParams();
        let datas = results.data
        this.ebDetailsModiData = [];
        this.ebadvanceModificationList = [];
        datas.forEach(element => {
          if (element.action == 1 && element.type_name == "EBADVANCE") {
            let data = {
              modify_data: "New"
            }
            let json = Object.assign({}, data, element.data)
            this.ebadvanceModificationList.push(json);
          } else if (element.action == 2 && element.type_name == "EBADVANCE") {
            let data = {
              modify_data: "Modify"
            }
            let json = Object.assign({}, data, element.new_data)
            this.ebadvanceModificationList.push(json);
          } else if (element.action == 0 && element.type_name == "EBADVANCE") {
            let data = {
              modify_data: "Delete"
            }
            let json = Object.assign({}, data, element.data)
            this.ebadvanceModificationList.push(json);
          }
          if (element.action == 1 && element.type_name == "EBDETAILS") {
            let data = {
              modify_data: "New"
            }
            let json = Object.assign({}, data, element.data)
            this.ebDetailsModiData.push(json);
          } else if (element.action == 2 && element.type_name == "EBDETAILS") {
            let data = {
              modify_data: "Modify"
            }
            let json = Object.assign({}, data, element.new_data)
            this.ebDetailsModiData.push(json);
          } else if (element.action == 0 && element.type_name == "EBDETAILS") {
            let data = {
              modify_data: "Delete"
            }
            let json = Object.assign({}, data, element.data)
            this.ebDetailsModiData.push(json);
          }
        });
      })

  }
  ebadvanceDelete(data) {
    this.EbdetailID = data.eb_details_id.id
    let advanceId = data.id
    this.remsService.ebadvanceDeleteForm(this.EbdetailID, advanceId)
      .subscribe(result => {
        let code = result.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Modify before getting the Approval")
        }
        else {
          this.notification.showSuccess("Successfully deleted....")
          this.ebadavancesummary();
          return true
        }
      })
  }
  getebadvance() {
    let data: any = this.remsshareService.ebadvanceForm.value;
    this.idValue = data.id;
    if (data === '') {
      this.ebadvanceForm.patchValue({
        advance_amount: '',
        remarks: '',
        advance_date: ''
      })
    } else {
      this.ebadvanceForm.patchValue({
        advance_amount: data.advance_amount,
        remarks: data.remarks,
        advance_date: data.advance_date
      })
    }
  }
  Ebdetailmodi: any;
  eddetails: any;
  ebadvanceCreateEditForm() {
    this.EBAdvanceBtn = true;
    if (this.ebadvanceForm.value.advance_amount === "") {
      this.toastr.warning('', 'Please Enter  Advance amount', { timeOut: 1500 });
      this.EBAdvanceBtn = false;
      return false;
    }
    if (this.ebadvanceForm.value.advance_date === "") {
      this.toastr.warning('', 'Please Enter  Advance date', { timeOut: 1500 });
      this.EBAdvanceBtn = false;
      return false;
    }
    if (this.ebadvanceForm.value.remarks === "") {
      this.toastr.warning('', 'Please Enter Remarks', { timeOut: 1500 });
      this.EBAdvanceBtn = false;
      return false;
    }
    const currentDate = this.ebadvanceForm.value
    currentDate.advance_date = this.datePipe.transform(currentDate.advance_date, 'yyyy-MM-dd');

    if (this.idValue == undefined) {
      this.remsService.ebadvanceCreateEditForm(this.ebadvanceForm.value, '', this.eddetails)
        .subscribe(result => {
          let code = result.code
          if (code === "INVALID_MODIFICATION_REQUEST") {
            this.notification.showError("You can not Modify before getting the Approval")
            this.EBAdvanceBtn = false;
          }
          else if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            this.EBAdvanceBtn = false;
          }
          else {
            this.notification.showSuccess("Successfully created!...")
            this.ebadavancesummary();
            this.EBAdvanceBtn = false;
            // this.ebadvanceForm.reset();
            this.fromGroupDirective.resetForm()
          }

        })
    } else {
      this.remsService.ebadvanceCreateEditForm(this.ebadvanceForm.value, this.idValue, this.eddetails)
        .subscribe(result => {
          let code = result.code
          if (code === "INVALID_MODIFICATION_REQUEST") {
            this.notification.showError("You can not Modify before getting the Approval")
            this.EBAdvanceBtn = false;
          }
          else if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            this.EBAdvanceBtn = false;
          }
          else {
            this.notification.showSuccess("Successfully Updated!...")
            this.idValue = undefined
            this.EBAdvanceBtn = false;
            this.ebadavancesummary();
            this.fromGroupDirective.resetForm()
          }
        })
    }
  }
  getLegalNotice(pageNumber = 1) {
    this.remsService.getLegalNotice(this.PremiseId, pageNumber)
      .subscribe((results) => {
        let datas = results.data
        let datapagination = results.pagination;
        this.legalNoticeList = datas;
        if (results.code === 'INVALID_INWARDHEADER_ID' && results.description === 'Invalid inwardheader ID') {
          this.isLegalNoticeData = true
        } else if (this.legalNoticeList.length === 0) {
          this.is_legalNoticePage = false;
          this.isLegalNoticeData = true;
        } else if (this.legalNoticeList.length > 0) {
          this.next_legalNotice = datapagination.has_next;
          this.previous_legalNotice = datapagination.has_previous;
          this.present_legalNotice = datapagination.index;
          this.is_legalNoticePage = true;
        }
      })
  }

  notice_nextClick() {
    if (this.next_legalNotice === true) {
      this.getLegalNotice(this.present_legalNotice + 1)
    }
  }

  notice_previousClick() {
    if (this.previous_legalNotice === true) {
      this.getLegalNotice(this.present_legalNotice - 1)
    }
  }

  addLegalNotice() {
    this.remsshareService.legalNoticeForm.next('')
    this.router.navigate(['/rems/legalNoticeForm'], { skipLocationChange: isSkipLocationChange });
  }

  legalNoticeEdit(data) {
    this.remsshareService.legalNoticeForm.next(data)
    this.router.navigate(['/rems/legalNoticeForm'], { skipLocationChange: isSkipLocationChange });
  }

  legalNoticeDelete(id) {
    if (this.modificationReqSummary.length > 0) {
      let chkApproval = this.modificationReqSummary.filter(x => x.premise_type.id == 9 && x.ref_id == id)
      if (chkApproval.length == 0)
      {
        this.notification.showError("You can not Modify before getting the Approval")
        return false
      }
    this.remsService.legalNoticeDelete(id, this.PremiseId)
      .subscribe((result) => {
        let code = result.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Modify before getting the Approval")
        }
        else {
          this.notification.showSuccess("Deleted....")
          this.getLegalNotice();
          if (this.isModification) {
            this.modSummary.getModificationView();
          }
        }
      })
    }
  }



  getInsuranceDetails(pageNumber = 1) {
    this.remsService.getInsuranceDetails(pageNumber, this.PremiseId)
      .subscribe((results) => {
        let datas = results.data
        let datapagination = results.pagination;
        this.insuranceDetailList = datas;
        if (this.insuranceDetailList.length > 0) {
          this.next_insuranceDetails = datapagination.has_next;
          this.previous_insuranceDetails = datapagination.has_previous;
          this.present_insuranceDetails = datapagination.index;
          this.is_InsuranceDetailsPage = true;
        } else if (this.insuranceDetailList.length === 0) {
          this.is_InsuranceDetailsPage = false
        }
      })
  }

  nextInsuranceDetails() {
    if (this.next_insuranceDetails === true) {
      this.getInsuranceDetails(this.present_insuranceDetails + 1)
    }
  }

  previousInsuranceDetails() {
    if (this.previous_insuranceDetails === true) {
      this.getInsuranceDetails(this.present_insuranceDetails - 1)
    }
  }

  addInsuranceDetails() {
    this.router.navigate(['/rems/Insurancedetailcreate'], { skipLocationChange: isSkipLocationChange });
  }

  insuranceDetailsEdit(data) {
    this.remsshareService.InsuranceDetailEdit.next(data);
    this.router.navigate(['/rems/InsurancedetailEdit'], { skipLocationChange: isSkipLocationChange });
  }
  insuranceDetailsDelete(id) {
    if (this.modificationReqSummary.length > 0) {
      let chkApproval = this.modificationReqSummary.filter(x => x.premise_type.id == 13 && x.ref_id == id)
      if (chkApproval.length == 0)
      {
        this.notification.showError("You can not Modify before getting the Approval")
        return false
      }
    this.remsService.insuranceDetailsDelete(id)
      .subscribe((result) => {
        let code = result.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Modify before getting the Approval")
        }
        else {
          this.notification.showSuccess("Deleted....")
          this.getInsuranceDetails();
          if (this.isModification) {
            this.modSummary.getModificationView();
          }
        }
      })
    }
  }

  getRenovation(pageNumber = 1) {
    this.remsService.getRenovation(this.PremiseId, pageNumber)
      .subscribe((results) => {
        let datas = results.data
        let datapagination = results.pagination;
        this.renovationList = datas;
        if (this.renovationList.length === 0) {
          this.isRenovation = false
        } else if (this.renovationList.length >= 0) {
          this.next_renovation = datapagination.has_next;
          this.previous_renovation = datapagination.has_previous;
          this.present_renovation = datapagination.index;
          this.isRenovation = true;
        }
      })
  }

  renovationNext() {
    if (this.next_renovation === true) {
      this.getRenovation(this.present_renovation + 1)
    }
  }

  renovationPrevious() {
    if (this.previous_renovation === true) {
      this.getRenovation(this.present_renovation - 1)
    }
  }

  addRenovation() {
    this.remsshareService.renovationForm.next('')
    this.router.navigate(['/rems/renovationForm'], { skipLocationChange: isSkipLocationChange });
  }

  renovationEdit(data) {
    this.remsshareService.renovationForm.next(data)
    this.router.navigate(['/rems/renovationForm'], { skipLocationChange: isSkipLocationChange });
  }

  getLicensesDetails(pageNumber = 1) {
    this.remsService.getLicensesDetails(pageNumber, this.PremiseId)
      .subscribe((results) => {
        let datas = results.data
        let datapagination = results.pagination;
        this.licensesDetailList = datas;
        if (this.licensesDetailList.length >= 0) {
          this.next_licensesDetails = datapagination.has_next;
          this.previous_licensesDetails = datapagination.has_previous;
          this.present_licensesDetails = datapagination.index;
          this.isLicensesPages = true;
        } if (this.licensesDetailList.length === 0) {
          this.isLicensesPages = false
        }
      })
  }

  nextLicensesDetails() {
    if (this.next_licensesDetails === true) {
      this.getLicensesDetails(this.present_licensesDetails + 1)
    }
  }

  previousLicensesDetails() {
    if (this.previous_licensesDetails === true) {
      this.getLicensesDetails(this.present_licensesDetails - 1)
    }

  }

  addLicensesDetails() {
    this.router.navigate(['/rems/licensedetails'], { skipLocationChange: isSkipLocationChange });

  }

  licensesDetailsEdit(data) {
    this.remsshareService.licensedetailsEditValue.next(data);
    this.router.navigate(['/rems/licensedetailsedit'], { skipLocationChange: isSkipLocationChange });
  }

  licensesDetailsDelete(id) {
    this.remsService.insuranceDetailsDelete(id)
      .subscribe((result) => {
        this.notification.showSuccess("Deleted....")
        this.getInsuranceDetails();
        if (this.isModification) {
          this.modSummary.getModificationView();
        }
      })
  }
  premiseStatus() {
    if (this.premise_status == 1) {
      return "ONBOARD"
    } else {
      return "MODIFICATION"
    }
  }

  getPremiseDetails(pageNumber = 1) {
    this.remsService.getPremiseDetails(this.PremiseId)
      .subscribe((results) => {
        let datas = results.data
        let datapagination = results.pagination;
        this.premiseDetailList = datas;
        if (this.premiseDetailList.length > 0) {
          this.next_premiseDetails = datapagination.has_next;
          this.previous_premiseDetails = datapagination.has_previous;
          this.present_premiseDetails = datapagination.index;
          this.isPremiseDetails = true;
        } if (this.premiseDetailList.length === 0) {
          this.isPremiseDetails = false
        }
      })
  }

  nextPremiseDetails() {
    if (this.next_premiseDetails === true) {
      this.getPremiseDetails(this.present_premiseDetails + 1)
    }
  }

  previousPremiseDetails() {
    if (this.previous_premiseDetails === true) {
      this.getPremiseDetails(this.present_premiseDetails - 1)
    }
  }

  addPremiseDetails() {
    this.remsshareService.premiseDetailsForm.next('');
    this.router.navigate(['/rems/premiseDetailsForm'], { skipLocationChange: isSkipLocationChange });
  }

  premiseDetailsEdit(data) {
    this.remsshareService.premiseDetailsForm.next(data);
    this.router.navigate(['/rems/premiseDetailsForm'], { skipLocationChange: isSkipLocationChange });
  }

  premiseDetailsDelete(id) {
    if (this.modificationReqSummary.length > 0) {
      let chkApproval = this.modificationReqSummary.filter(x => x.premise_type.id == 2 && x.ref_id == id)
      if (chkApproval.length == 0)
      {
        this.notification.showError("You can not Modify before getting the Approval")
        return false
      }
    this.remsService.premiseDetailsDelete(this.PremiseId, id)
      .subscribe((result) => {
        let code = result.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Modify before getting the Approval")
        }
        else {
          this.notification.showSuccess("Deleted....")
          this.getPremiseDetails();
          if (this.isModification) {
            this.modSummary.getModificationView();
          }
        }
      })
    }
  }

  premiseDetailsView(id) {
    this.remsshareService.premiseDetailsView.next(id)
    this.remsshareService.premiseViewID.next(this.premiseData)
    this.router.navigate(['/rems/premiseDetailsView'], { skipLocationChange: isSkipLocationChange });
  }


  getDocumentList(pageNumber = 1) {
    this.remsService.getDocumentList(pageNumber, this.PremiseId)
      .subscribe((results) => {
        let datas = results.data
        let datapagination = results.pagination;
        this.documentList = datas;
        this.documentFileData = datas.file_data;
        if (results.code === "INVALID_INWARDHEADER_ID" && results.description === "Invalid inwardheader ID") {
          this.isDocumentData = true;
        }
        else if(results.code === "INVALID_FILETYPE") {
          this.notification.showError("Invalid FileType...")
        } 
        else if (this.documentList.length >= 0) {
          this.next_document = datapagination.has_next;
          this.previous_document = datapagination.has_previous;
          this.present_document = datapagination.index;
          this.isDocument = true;
        }
      })
  }

  nextDocument() {
    if (this.next_document === true) {
      this.getDocumentList(this.present_document + 1)
    }
  }

  previousDocument() {
    if (this.previous_document === true) {
      this.getDocumentList(this.present_document - 1)
    }
  }

  addDocument() {
    let data = {
      text: '',
      premiseid: this.PremiseId

    }
    this.remsshareService.documentForm.next(data)
    this.router.navigate(['/rems/documentForm'], { skipLocationChange: isSkipLocationChange });

  }

  documentEdit(data) {
    let doc = {
      premiseid: this.PremiseId
    }
    let jsondata = Object.assign({}, data, doc)
    this.remsshareService.documentForm.next(jsondata);
    this.router.navigate(['/rems/documentForm'], { skipLocationChange: isSkipLocationChange });
  }

  documentDelete(id) {
    if (this.modificationReqSummary.length > 0) {
      let chkApproval = this.modificationReqSummary.filter(x => x.premise_type.id == 5 && x.ref_id == id)
      if (chkApproval.length == 0)
      {
        this.notification.showError("You can not Modify before getting the Approval")
        return false
      }
    this.remsService.documentDelete(id)
      .subscribe((result) => {
        let code = result.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Modify before getting the Approval")
        }
        else {
          this.notification.showSuccess("Deleted....")
          this.getDocumentList();
          if (this.isModification) {
            this.modSummary.getModificationView();
          }
        }

      })
    }
  }


  imagePreview(file_id, file_name, file) {
    let files = file
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let stringValue = files.file_name.split('.')
    if (file_name === files.file_name) {
      if (stringValue[1] === "pdf") {
        this.isImages = false
        window.open(this.imageUrl + "pdserv/files/" + file_id + "?token=" + token, "_blank");
      }
      else if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg" || stringValue[1] === "JPG" || stringValue[1] === "JPEG") {
        this.isImages = true;
        this.jpgUrls = this.imageUrl + "pdserv/files/" + file_id + "?token=" + token;
      }
      else {
        this.isImages = false;
        this.remsService.fileDownload(file_id)
          .subscribe((results) => {
            let binaryData = [];
            binaryData.push(results)
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            let link = document.createElement('a');
            link.href = downloadUrl;
            link.download = file_name;
            link.click();
          })
      }
    }
  }

  getStatutory(pageNumber = 1, pageSize = 10) {
    this.remsService2.getStatutorySummary(pageNumber, pageSize, this.premiseViewId)
      .subscribe((results) => {
        let datas = results.data;
        let datapagination = results["pagination"];
        this.statutoryList = datas;
        if (this.statutoryList.length === 0) {
          this.is_statutorypage = false
        }
        if (this.statutoryList.length > 0) {
          this.next_statutory = datapagination.has_next;
          this.previous_statutory = datapagination.has_previous;
          this.present_statutory = datapagination.index;
          this.is_statutorypage = true
        }
      })
  }

  nextStatutory() {
    if (this.next_statutory === true) {
      this.current_statutory = this.present_statutory + 1
      this.getStatutory(this.present_statutory + 1)
    }
  }

  previousStatutory() {
    if (this.previous_statutory === true) {
      this.current_statutory = this.present_statutory - 1
      this.getStatutory(this.present_statutory - 1)
    }
  }

  addStatutory() {
    this.remsshareService.statutoryIdValue.next('');
    this.router.navigate(['/rems/statutorycreateeditform'], { skipLocationChange: isSkipLocationChange });
  }


  statutoryEdit(data) {
    this.remsshareService.statutoryIdValue.next(data);
    this.router.navigate(['/rems/statutorycreateeditform'], { skipLocationChange: isSkipLocationChange });
    return data;
  }

  statutoryDelete(id) {
    if (this.modificationReqSummary.length > 0) {
      let chkApproval = this.modificationReqSummary.filter(x => x.premise_type.id == 14 && x.ref_id == id)
      if (chkApproval.length == 0)
      {
        this.notification.showError("You can not Modify before getting the Approval")
        return false
      }
    this.remsService2.statutoryDeleteForm(id, this.PremiseId)
      .subscribe((result) => {
        let code = result.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Modify before getting the Approval")
        }
        else {
          this.notification.showSuccess("Deleted Successfully....")
          this.getStatutory();
          if (this.isModification) {
            this.modSummary.getModificationView();
          }
        }
      })
    }
  }


  dropDownChange(isOccupancyTable: boolean, isAgreementTable: boolean, isAmenitiesTable: boolean,
    isLandlordTable: boolean, isLegalClearanceTable: boolean, isLegalNoticeTable: boolean,
    isLicenseTable: boolean, isDocumentTable: boolean, isPremiseDetailsTable: boolean,
    isStatutoryTable: boolean, isEbDetailsTable: boolean, isInsuranceTable: boolean,
    isRenovationTable: boolean, isRepairMaintanceTable: boolean) {
    this.isOccupancyTable = isOccupancyTable;
    this.isAgreementTable = isAgreementTable;
    this.isAmenitiesTable = isAmenitiesTable;
    this.isLandlordTable = isLandlordTable;
    this.isLegalClearanceTable = isLegalClearanceTable;
    this.isLegalNoticeTable = isLegalNoticeTable;
    this.isLicenseTable = isLicenseTable;
    this.isDocumentTable = isDocumentTable;
    this.isPremiseDetailsTable = isPremiseDetailsTable;
    this.isStatutoryTable = isStatutoryTable;
    this.isEbDetailsTable = isEbDetailsTable;
    this.isInsuranceTable = isInsuranceTable;
    this.isRenovationTable = isRenovationTable;
    this.isRepairMaintanceTable = isRepairMaintanceTable;
  }

  onDropDownChange(data) {
    let ddValue = data.value;
    if (ddValue == "Occupancy Details") {
      this.btnName = "Occupancy Details"
      this.router.navigate(['/rems/premiseView'], { queryParams: { status: ddValue, PremiseId: this.PremiseId, from: this.mailfrom }, skipLocationChange: isSkipLocationChange });
      this.getOccupancyList()
      this.dropDownChange(true, false, false, false, false, false, false, false, false, false, false, false, false, false)
    } else if (ddValue == "Agreement and Rent") {
      this.btnName = "Agreement and Rent"
      this.getAgreement();
      this.router.navigate(['/rems/premiseView'], { queryParams: { status: ddValue, PremiseId: this.PremiseId, from: this.mailfrom }, skipLocationChange: isSkipLocationChange });
      this.dropDownChange(false, true, false, false, false, false, false, false, false, false, false, false, false, false)
    } else if (ddValue == "Amenities & Infrastructure") {
      this.btnName = "Amenities & Infrastructure"
      this.router.navigate(['/rems/premiseView'], { queryParams: { status: ddValue, PremiseId: this.PremiseId, from: this.mailfrom }, skipLocationChange: isSkipLocationChange });
      this.getAmenties();
      this.dropDownChange(false, false, true, false, false, false, false, false, false, false, false, false, false, false)
    } else if (ddValue == "Legal Clearance") {
      this.btnName = "Legal Clearance"
      this.router.navigate(['/rems/premiseView'], { queryParams: { status: ddValue, PremiseId: this.PremiseId, from: this.mailfrom }, skipLocationChange: isSkipLocationChange });
      this.getLegalClearance();
      this.dropDownChange(false, false, false, false, true, false, false, false, false, false, false, false, false, false)
    } else if (ddValue == "Licenses & Certificate") {
      this.btnName = "Licenses & Certificate"
      this.getLicensesDetails();
      this.router.navigate(['/rems/premiseView'], { queryParams: { status: ddValue, PremiseId: this.PremiseId, from: this.mailfrom }, skipLocationChange: isSkipLocationChange });
      this.dropDownChange(false, false, false, false, false, false, true, false, false, false, false, false, false, false)
    } else if (ddValue == "Insurance Details") {
      this.btnName = "Insurance Details"
      this.router.navigate(['/rems/premiseView'], { queryParams: { status: ddValue, PremiseId: this.PremiseId, from: this.mailfrom }, skipLocationChange: isSkipLocationChange });
      this.getInsuranceDetails();
      this.dropDownChange(false, false, false, false, false, false, false, false, false, false, false, true, false, false)
    } else if (ddValue == "Legal & Statutory Notice") {
      this.btnName = "Legal & Statutory Notice"
      this.router.navigate(['/rems/premiseView'], { queryParams: { status: ddValue, PremiseId: this.PremiseId, from: this.mailfrom }, skipLocationChange: isSkipLocationChange });
      this.getLegalNotice();
      this.dropDownChange(false, false, false, false, false, true, false, false, false, false, false, false, false, false)
    } else if (ddValue == "EB Details") {
      this.router.navigate(['/rems/premiseView'], { queryParams: { status: ddValue, PremiseId: this.PremiseId, from: this.mailfrom }, skipLocationChange: isSkipLocationChange });
      this.btnName = "EB Details"
      // this.ebdetailssummary();
      this.getpremiseseb(1)
      this.getpremiseseb_modification()
      this.dropDownChange(false, false, false, false, false, false, false, false, false, false, true, false, false, false)
    } else if (ddValue == "Premise Details") {
      this.btnName = "Premise Details"
      this.router.navigate(['/rems/premiseView'], { queryParams: { status: ddValue, PremiseId: this.PremiseId, from: this.mailfrom }, skipLocationChange: isSkipLocationChange });
      this.getPremiseDetails();
      this.dropDownChange(false, false, false, false, false, false, false, false, true, false, false, false, false, false)
    } else if (ddValue == "Renovations & Additions") {
      this.btnName = "Renovations & Additions"
      this.router.navigate(['/rems/premiseView'], { queryParams: { status: ddValue, PremiseId: this.PremiseId, from: this.mailfrom }, skipLocationChange: isSkipLocationChange });
      this.getRenovation();
      this.dropDownChange(false, false, false, false, false, false, false, false, false, false, false, false, true, false)
    } else if (ddValue == "Statutory Payments") {
      this.btnName = "Statutory Payments"
      this.router.navigate(['/rems/premiseView'], { queryParams: { status: ddValue, PremiseId: this.PremiseId, from: this.mailfrom }, skipLocationChange: isSkipLocationChange });
      this.getStatutory();
      this.dropDownChange(false, false, false, false, false, false, false, false, false, true, false, false, false, false)
    } else if (ddValue == "Documents") {
      this.btnName = "Documents"
      this.router.navigate(['/rems/premiseView'], { queryParams: { status: ddValue, PremiseId: this.PremiseId, from: this.mailfrom }, skipLocationChange: isSkipLocationChange });
      this.getDocumentList();
      this.dropDownChange(false, false, false, false, false, false, false, true, false, false, false, false, false, false)
    } else if (ddValue == "Landlord Details") {
      this.btnName = "Landlord Details"
      this.router.navigate(['/rems/premiseView'], { queryParams: { status: ddValue, PremiseId: this.PremiseId, from: this.mailfrom }, skipLocationChange: isSkipLocationChange });
      this.getlanlordsummary();
      this.dropDownChange(false, false, false, true, false, false, false, false, false, false, false, false, false, false)
    } else if (ddValue == "Repairs & Maintenance") {
      this.btnName = "Repairs & Maintenance"
      this.router.navigate(['/rems/premiseView'], { queryParams: { status: ddValue, PremiseId: this.PremiseId, from: this.mailfrom }, skipLocationChange: isSkipLocationChange });
      this.repairsummary();
      this.dropDownChange(false, false, false, false, false, false, false, false, false, false, false, false, false, true)
    }

  }

  addForm(data) {
    if (data == "Amenities & Infrastructure") {
      this.addAmenties();
    } else if (data == "Renovations & Additions") {
      this.addRenovation();
    } else if (data == "Repairs & Maintenance") {
      this.addRepairMaintance();
    } else if (data == "Landlord Details") {
      this.landLordCreate();
    } else if (data == "Documents") {
      this.addDocument();
    } else if (data == "Statutory Payments") {
      this.addStatutory();
    } else if (data == "EB Details") {
      this.addEBDetails();
    } else if (data == "Premise Details") {
      this.addPremiseDetails();
    } else if (data == "Legal & Statutory Notice") {
      this.addLegalNotice();
    } else if (data == "Insurance Details") {
      this.addInsuranceDetails();
    } else if (data == "Licenses & Certificate") {
      this.addLicensesDetails();
    } else if (data == "Legal Clearance") {
      this.legalClearanceCreate();
    } else if (data == "Agreement and Rent") {
      this.addAgreement();
    } else if (data == "Occupancy Details") {
      this.occupancyCreate();
    }
  }

  modifyPremiseView(modifyData) {
    // this.status = modifyData.modify_status
    // if (this.status == 1) {
    this.updatecode = modifyData.code;
    this.premiseViewId = modifyData.id
    this.updatename = modifyData.name;
    this.ty = modifyData.type.text;
    this.updaterequeststatus = modifyData.requeststatus;
    this.updaterentarea = modifyData.rent_area;
    this.updatepremisestatus = modifyData.premise_status;
    this.updatecontrollingoffcode = modifyData.controlling_office.code;
    this.updatecontrollingoffname = modifyData.controlling_office.name;
    this.updatemainstatus = modifyData.main_status;
    this.updatelineName1 = modifyData.address.line1;
    this.updatelineName2 = modifyData.address.line2;
    this.updatelineName3 = modifyData.address.line3;
    this.updatecityName = modifyData.address.city_id.name;
    this.updatedistrictName = modifyData.address.district_id.name;
    this.updatestateName = modifyData.address.state_id.name;
    this.updatepinCode = modifyData.address.pincode_id.no;
    // this.updatermName = modifyData.rm.full_name;
    this.ismodificationView = true;

    // }

  }
  premiseEdit() {
    this.remsshareService.premiseEditValue.next(this.premiseViewId);
    this.router.navigate(['/rems/premiseEdit'], { skipLocationChange: isSkipLocationChange })
  }

  getmodification_premise() {
    console.log("getmodification_premise_premiseid", this.PremiseId)
    this.remsService.getModificationView(this.PremiseId)
      .subscribe(result => {
        this.modificationdata = result['data']
        this.modificationdata.forEach(element => {
          if (element.action == 2)//edit
          {
            if (element.type_name == "PREMISE") {
              this.ismodificationView = true;
              let modifyData = element.new_data
              this.modifyPremiseView(modifyData);
            }
          }
        });
      })

  }


  modificationrequest() {
    console.log(this.modificationdata,this.modificationdata.length)
    if (this.modificationdata.length > 0) {
      var answer = window.confirm("Discard the changes.?");
      if (answer) {
        //some code
      }
      else {
        return false;
      }
      this.remsService2.approverreject(this.PremiseId)
        .subscribe(result => {
          if (result.status == 'success') {
            this.notification.showSuccess("Done")
            this.remsService2.getModificationRequest(this.PremiseId)
              .subscribe(result => {
                this.notification.showSuccess("Success")
                window.location.reload()
              })
          }
          else {
            this.notification.showError("something went wrong try again")
          }
        });
    }
    else {
      this.modification();
    }
  }

  modification() {
    this.isModificationBtn = true;
    this.remsService2.getModificationRequest(this.PremiseId)
      .subscribe((results) => {
        let code = results.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Raise a Request before getting the Approval")
        } else {
          this.notification.showSuccess(results.message);
          this.getPremiseView()
        }

      })
  }

  //renewal request
  renewalrequest() {
    this.remsService2.getRenewalRequest(this.PremiseId)
      .subscribe((results) => {
        let code = results.code
        if (code === "INVALID_RENEWAL_REQUEST") {
          this.notification.showError("You can not Raise a Request before getting the Approval")
        } else {
          this.notification.showSuccess(results.message);
          this.getPremiseView()
        }

      })
  }

  //terminate request
  terminaterequest() {
    this.remsService2.getTerminateRequest(this.PremiseId)
      .subscribe((results) => {
        let code = results.code
        if (code === "INVALID_DATA") {
          this.notification.showError("You can not Raise a Request before getting the Approval")
        } else {
          this.notification.showSuccess(results.message);
          this.getPremiseView()
        }

      })
  }

  getModificationApprove() {
    this.remsService2.getModificationApprove(this.PremiseId)
      .subscribe((results) => {
        this.getPremiseView()
        this.isApproverBtn = false;
        this.notification.showSuccess("Approved Successfully!...")
      })
  }

  //renewal approve
  getRenewalApprove() {
    this.remsService2.getRenewalApprove(this.PremiseId)
      .subscribe((results) => {
        this.getPremiseView()
        this.notification.showSuccess(results.message);
      })
  }


  // movetorm() {

  //   let identificationid = this.premiseData?.id
  //   let json = { "status": 2, "comments": "k" }
  //   console.log("identificationid", identificationid)
  //   console.log("json", json)
  //   console.log("json", json)
  //   this.remsService2.premisestatus(identificationid, json)
  //     .subscribe(res => {
  //       if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
  //         this.notification.showError("INVALID_DATA!...")
  //       } else {
  //         this.notification.showSuccess(res.status)
  //       }
  //       return true
  //     })
  // }

  movetochecker() {
    let identificationid = this.premiseData?.id
    let json = { "status": 3, "comments": "k" }
    this.remsService2.premisestatus(identificationid, json)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Moved to Checker!...")
          this.getPremiseView();
        } else {
          this.notification.showError(res.description)
        }
        return true
      })
  }

  movetoheader() {
    let identificationid = this.premiseData?.id
    let json = { "status": 4, "comments": "k" }
    this.remsService2.premisestatus(identificationid, json)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Moved to Header!...")
          this.getPremiseView();
        } else {
          this.notification.showError(res.description)
        }
        return true
      })
  }


  approve() {
    let identificationid = this.premiseData?.id
    let json = { "status": 5, "comments": "k" }
    this.remsService2.premisestatus(identificationid, json)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Approved Successfully!...")
          this.isOnBordApproveBtn = false;
          this.getPremiseView();
        } else {
          this.notification.showError(res.description)
        }
        return true
      })

  }

  reject() {
    let identificationid = this.premiseData?.id
    let json = { "status": 0, "comments": "k" }
    this.remsService2.premisestatus(identificationid, json)
      .subscribe(res => {
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("INVALID_DATA!...")
        } else {
          this.notification.showSuccess("Rejected!...")
          this.isRejectBtn = false;
          this.getPremiseView();
        }
        return true
      })

  }

  changeView() {
    this.router.navigate(['/rems/modificationChanges'], { skipLocationChange: isSkipLocationChange });

  }

  getpremiseseb(page){
    let data: any = this.remsshareService.PremiseView.value;
    this.premiseviewid = data.id

    let modifydata= (this.isModification)? 1:0
    console.log(modifydata)
    this.remsService.getpremisesbased_eb(this.premiseviewid,modifydata,page).subscribe(
      result =>{
          this.ebdetailsList=result['data']
          let datapagination=result['pagination']
          if (this.ebdetailsList.length > 0) {
            this.has_nextebdetails = datapagination.has_next;
            this.has_previousebdetails = datapagination.has_previous;
            this.presentebdetailspage = datapagination.index;
            this.is_ebdetailspage = true
          }
      }
    )
    
  }

  getpremiseseb_modification(){
    let data: any = this.remsshareService.PremiseView.value;
    this.premiseviewid = data.id

    this.remsService.getebmodificationsummary(this.premiseviewid).subscribe(
      result =>{
          this.ebDetailsModiData=result['data']
          // let datapagination=result['pagination']
          // if (this.ebdetailsList.length > 0) {
          //   this.has_nextebdetails = datapagination.has_next;
          //   this.has_previousebdetails = datapagination.has_previous;
          //   this.presentebdetailspage = datapagination.index;
          //   this.is_ebdetailspage = true
          // }
          let datas = result.data
        this.ebDetailsModiData = [];
        this.ebadvanceModificationList = [];
        datas.forEach(element => {
          if (element.action == 2 ) {
            // let data = {
            //   modify_data: "New"
            // }
            // let json = Object.assign({}, data, element.data)
            // this.ebadvanceModificationList.push(json);
            let assign = Object.assign(element.new_data, {action: element.action})
            console.log("1", assign)

            this.ebDetailsModiData.push(assign)
          } 
          if (element.action == 1 ) {
            // let data = {
            //   modify_data: "New"
            // }
            // let json = Object.assign({}, data, element.data)
            // this.ebadvanceModificationList.push(json);
            let assign = Object.assign(element.data, {action: element.action})
            console.log("2", assign)
            this.ebDetailsModiData.push(assign)
          } 
          if (element.action == 3 ) {
            // let data = {
            //   modify_data: "New"
            // }
            // let json = Object.assign({}, data, element.data)
            // this.ebadvanceModificationList.push(json);
            let assign = Object.assign(element.data, {action: element.action})
            console.log("2", assign)
            this.ebDetailsModiData.push(assign)
          } 

      })
    })
    
  }

  ebedit(data){
    data.maker=true
    console.log('data.maker',data,data.maker)
    this.remsshareService.ebdetailsEditValue.next(data);
    this.router.navigate(['/rems/ebdetailsCreate'], { skipLocationChange: isSkipLocationChange });
    return data;
  }

  ebactive(id,status,premisesid){

    let ebstatus=(status == 0) ? 1 : 0
    let data: any = this.remsshareService.PremiseView.value;

    let modifydata= (this.isModification )? 1:0
    console.log(modifydata,'mod','mod',data.premise_status,data.requeststatus)
    this.remsService.getconsumeractivated(id, ebstatus, premisesid).subscribe(
      result => {
        console.log(result)
        if (result.status == 'success') {
          if (status == 0) {
            this.notification.showSuccess('Successfully Activated')
          }
          else {
            this.notification.showSuccess('Successfully Deactivated')
          }
          this.getpremiseseb(this.presentebdetailspage=1);
          (this.isEbDetails)? this.getpremiseseb_modification():''
        }
        else {
          this.notification.showError(result.description)
          // this.addElectricityForm.value.makerisactive = false
        }
      }
    )
  }
  ebview(data){
    let assign= Object.assign(data, {maker: false})
    console.log('assign',assign)
    this.remsshareService.ebdetailsEditValue.next(assign);
    this.router.navigate(['/rems/ebdetailsCreate'], { skipLocationChange: isSkipLocationChange });

  }

}




export class PremiseView {
  id: number;
  name: string;
  premise_status: string;
  code: string;
  rent_area: number;
  type: {
    id: string,
    text: string;
  }
  requeststatus: string;
  main_status: string;
  rm: {
    code: string,
    full_name: string
  }
  controlling_office: {
    code: string,
    name: string
  }
  address: {
    city_id: { code: string, name: string, state_id: number },
    district_id: { code: string, name: string, state_id: number },
    pincode_id: { city_id: number, district_id: number, no: string },
    state_id: { code: string, country_id: number, created_by: number, name: string, status: number },
    line1: string
    line2: string
    line3: string;
  }
  approval_flag: {
    flag: boolean,
    name: string,
  }

}