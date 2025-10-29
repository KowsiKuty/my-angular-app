import { Component, OnInit,ViewChild } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { RemsService } from '../rems.service'
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../notification.service'
import { FormBuilder, FormGroup, Validators, FormControl,FormGroupDirective, FormArray } from '@angular/forms';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../service/shared.service'
import { environment } from 'src/environments/environment'

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
  selector: 'app-schedule-view',
  templateUrl: './schedule-view.component.html',
  styleUrls: ['./schedule-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class ScheduleViewComponent implements OnInit {
  ActivateForm:FormGroup;
  TerminateForm: FormGroup;
  PartiallyTerminateForm: FormGroup;
  HoldForm: FormGroup;
  PartiallyHoldForm: FormGroup;
  rentEditable: FormGroup;
  landlordRemarks: FormGroup;
  fg_reprocessLandlord:FormGroup;
  rentTermForm: FormGroup;
  rentscheduleinfo_id:any;
  ScheduleId: any;
  approvalDate1: string;
  rlxprd: string;
  endDate: string;
  startDate: string;
  freq: string;
  enhancementTerms: number;
  leaseChanged: number;
  leaseRegistration: number;
  leasePeriod: number;
  lockPeriod: number;
  registrationDate: string;
  rentAdjusttment: number;
  vacationPeriod: number;
  vacationTerms: number;
  approvalDate: string;
  code: string;
  commercialApprove: string;
  landloardPropertydtl: string;
  nonpaymentReason: string;
  dropDownTag = "schedule";
  rentList: any;
  next_rent = true;
  previous_rent = true;
  is_RentPage = true;
  current_RentPage: number = 1;
  present_RentPages: number = 1;
  pagesizeRent = 10;
  rentTermList: any;
  next_rentTerm = true;
  previous_rentTerm = true;
  is_RentTermPage = true;
  current_RentTermPage: number = 1;
  present_RentTermPages: number = 1;
  pagesizeRentTerm = 10;
  rentArrearList: any;
  next_rentArrear = true;
  previous_rentArrear = true;
  is_RentArrearPage = true;
  current_RentArrearPage: number = 1;
  present_RentArrearPages: number = 1;
  pagesizeRentArrear = 10;
  backNavigationTable: any;
  premiseId: number;
  leaseAgreementId: Number;
  landLordMappingForm: FormGroup;
  method = "";
  landLordData: any;
  next_landLord = true;
  previous_landLord = true;
  isLandLord = true;
  currentLandLordPage: number = 1;
  present_LandLordPage: number = 1;
  pagesizeLandLord = 10;
  tableId: number;
  nextOccupancy = true;
  previousOccupancy = true;
  isOccupancy = true;
  currentOccupancyPage: number = 1;
  presentOccupancyPage: number = 1;
  pagesizeOccupancy = 10;
  occupancyMapForm: FormGroup;
  occupancyData: any
  occupancyMapData: any;
  rent: any;
  templease: string;
  hold: string;
  fromdate: string;
  todate: string;
  scheduleStatus: any;
  isterminate = false;
  ishold = false;
  isactivate = false;
  
  idValue: any;
  toDate: any;
  ss: any;
  defaultDate = new FormControl(new Date())
  isActivateForm = true;
  isTerminateForm = true;
  isPartiallyTerminateForm = true;
  isHoldForm = true;
  isPartiallyHoldForm = true;
  toDate1: any;
  ss1: any;
  status: any;
  isshow = false;
  isArrearsForm = true;
  arrearsFromDate: any;
  aa: any;
  arrearsPeriod: any;
  scheduleList: any;
  isShow:boolean;
  type_Id: number;
  isShowpoButton = true;
  isShowId = false;
  rentamt: number;
  edit_flag: any;
  flag: any;
  scheduleStartDate: any;
  scheduleEndDate: any;
  roRaisedEndDate: any;
  leaseAgrementId: any;
  landlordList: any;
  rentschedule_accessor_id: any;
  role: any;
  Ro: any;
  landlordStatus: any;
  enddatefield = true;
  typeList = [{ id: 1, text: "All Schedules" }, { id: 2, text: "Schedules on hold" },{ id: 3, text: "Terminate" }]

  @ViewChild(FormGroupDirective) formGroupDirective : FormGroupDirective 
  @ViewChild('closebutton') closebutton;
  @ViewChild('closebuttonhold') closebuttonhold;
  @ViewChild('closebuttonpartiallyhold') closebuttonpartiallyhold;
  @ViewChild('closebuttonterminate') closebuttonterminate;
  @ViewChild('closebuttonpartiallyterminated') closebuttonpartiallyterminated;
  @ViewChild('closebuttonRentEditable') closebuttonRentEditable;
  @ViewChild('closebuttonreprocessLandlord') closebuttonreprocessLandlord;
  
  

  constructor(private shareService: RemsShareService, private remsService: RemsService, private remsshareService: RemsShareService, private datePipe: DatePipe,
    private route: ActivatedRoute, private fb: FormBuilder,private toastr: ToastrService,private sharedService: SharedService,
    private router: Router, private notification: NotificationService) { }

  ngOnInit(): void {
    let  id: any = this.shareService.agreementView.value;
    this.leaseAgreementId = id;
    let id1: any = this.remsshareService.scheduleType.value;
    this.type_Id = id1;
    console.log("type_Id-->scheduleview",this.type_Id)
    this.ActivateForm = this.fb.group({
      remarks: ['']
    })
    this.TerminateForm = this.fb.group({
      remarks: ['', Validators.required]
    })
    this.PartiallyTerminateForm = this.fb.group({
      from_date: ['', Validators.required],
      end_date: ['', Validators.required],
      remarks: ['', Validators.required]
    })

    this.HoldForm = this.fb.group({
      remarks: ['', Validators.required]
    })
    this.PartiallyHoldForm = this.fb.group({
      from_date: ['', Validators.required],
      end_date: ['', Validators.required],
      remarks: ['', Validators.required]
    })

    this.rentEditable = this.fb.group({
      oldrent_amount: [''],
      scheduleraccr_id: [''],
      rent_amount: [''],
      remarks: [''],
      rent_status: [''],
      landlord_allocation: new FormArray([

      ]),
    }) 

    this.fg_reprocessLandlord = this.fb.group({
      reprocess_rent_amount: [''],
      reprocess_landlord: [''],
      reprocess_grn_status:['']
    }) 
    
    this.landlordRemarks = this.fb.group({
      remarks: [''],
    })
     


    this.rentTermForm = this.fb.group({
      from_date: [''],
      to_date: [''],
      term_period: [''],
      rent_amount: ['', Validators.required],
      amenities_amount: [''],
      maintenance_amount: [''],
      remarks: ['', Validators.required],

    })
    let datas = this.sharedService.menuUrlData;
    datas.forEach((element) => {
      for(let i = 0; i < element.role.length; i++){
        if (element.role[i].name === "Maker"){
          console.log('role---??', element.role[i].name)
          this.role = element.role[i].name
          break;
        }
  
      }
    });
    this.getScheduleView();
  }
  array() {
    let group = new FormGroup({
      landlord_id: new FormControl(''),
      landlord: new FormControl(''),
      rent_amount: new FormControl(''),
      share: new FormControl(''),

    })

    return group
  }
  getFormArray(): FormArray {
    return this.rentEditable.get('landlord_allocation') as FormArray;
  }

  setDate(event: string) {
    const date = new Date(event)
    this.ss = date
    this.toDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  setDate1(event: string) {
    const date = new Date(event)
    this.ss1 = date
    this.toDate1 = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

 ArrearsFromDate(event: string) {
    const date = new Date(event)
    this.arrearsFromDate = date
    this.toDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  enddate(event: string){
    
    const date = new Date(event)
    this.aa = date

      this.arrearsPeriod =  (this.aa.getMonth() - this.arrearsFromDate.getMonth() + 1 )+
        (12 * (this.aa.getFullYear() - this.arrearsFromDate.getFullYear()))
        
    
  }

  terminatePopupForm() {
    let status = 2
    if (this.TerminateForm.value.remarks === ""){
      this.toastr.error('', 'Please Enter Remarks', { timeOut: 1500 });
      return false;
    }
    let terminatearray: any = [];
    for(let i = 0; i < this.landlordList.length; i++){
      if(this.landlordList[i].is_val == true){
        terminatearray.push(this.landlordList[i].landlord_id)
        
      }
    }
      this.remsService.terminateForm(this.TerminateForm.value, this.ScheduleId, status,terminatearray)
        .subscribe(result => {
          if (result.status == 'success') {
            this.notification.showSuccess("Submitted To Terminate")
            this.router.navigate(["/rems/scheduleview"], { skipLocationChange: isSkipLocationChange })
            this.ngOnInit();
            this.closebuttonterminate.nativeElement.click();
          } else {
            this.notification.showError(result.description)
          }
          
        })
   
  }


  partiallyTerminatePopupForm() {
    let status = 4
    if (this.PartiallyTerminateForm.value.from_date  === "" || this.PartiallyTerminateForm.value.from_date  ===  null){
      this.toastr.error('', 'Please Enter Start Date', { timeOut: 1500 });
      return false;
    }
    if (this.PartiallyTerminateForm.value.end_date  === "" || this.PartiallyTerminateForm.value.end_date  ===  null){
      this.toastr.error('', 'Please Enter End Date', { timeOut: 1500 });
      return false;
    }
    if (this.PartiallyTerminateForm.value.remarks === ""){
      this.toastr.error('', 'Please Enter Remarks', { timeOut: 1500 });
      return false;
    }
    const fromDate = this.PartiallyTerminateForm.value;
    fromDate.from_date = this.datePipe.transform(fromDate.from_date, 'yyyy-MM-dd');

    const toDate = this.PartiallyTerminateForm.value;
    toDate.end_date = this.datePipe.transform(toDate.end_date, 'yyyy-MM-dd');

    let partiallyTerminatearray: any = [];
    for(let i = 0; i < this.landlordList.length; i++){
      if(this.landlordList[i].is_val == true){
        partiallyTerminatearray.push(this.landlordList[i].landlord_id)
        
      }
    }


      this.remsService.partiallyTermiante(this.PartiallyTerminateForm.value, this.ScheduleId, status, partiallyTerminatearray )
        .subscribe(result => {
          if (result.status == 'success') {
            this.notification.showSuccess("Submitted To Partially Terminate")
            this.router.navigate(["/rems/scheduleview"], { skipLocationChange: isSkipLocationChange })
            this.ngOnInit();
            this.closebuttonpartiallyterminated.nativeElement.click();
          } else {
            this.notification.showError(result.description)
          }
        })
    

  }


  holdPopupForm() {
    let status = 3
    if (this.HoldForm.value.remarks === ""){
      this.toastr.error('', 'Please Enter Remarks', { timeOut: 1500 });
      return false;
    }
    let holdarray: any = [];
    for(let i = 0; i < this.landlordList.length; i++){
      if(this.landlordList[i].is_val == true){
        holdarray.push(this.landlordList[i].landlord_id)
        
      }
    }
  
      this.remsService.holdForm(this.HoldForm.value,this.ScheduleId, status, holdarray)
        .subscribe(result => {
          if (result.status == 'success') {
            this.notification.showSuccess("Submitted To Hold")
            this.router.navigate(["/rems/scheduleview"], { skipLocationChange: isSkipLocationChange })
            this.ngOnInit();
            this.closebuttonhold.nativeElement.click();
          } else {
            this.notification.showError(result.description)
          }
        })
  

  }

  checkedCondition(data,id){
    console.log("landlord",data)
    console.log("id",id)
    for(let i = 0; i < this.landlordList.length; i++){
      let landlordId = this.landlordList[i].landlord_id
      let a1 = this.landlordList[i]
      let a2 = a1['is_val']
      if((a2 == undefined || a2 != data) && (landlordId == id)){
        a1['is_val']= data
        console.log("a1",a1)
      }
      
    }
   }

  
   partiallyHoldPopupForm() {
    let status = 5
    if (this.PartiallyHoldForm.value.from_date  === "" || this.PartiallyHoldForm.value.from_date  ===  null){
      this.toastr.error('', 'Please Enter Start Date', { timeOut: 1500 });
      return false;
    }
    if (this.PartiallyHoldForm.value.end_date  === "" || this.PartiallyHoldForm.value.end_date  ===  null){
      this.toastr.error('', 'Please Enter End Date', { timeOut: 1500 });
      return false;
    }
    if (this.PartiallyHoldForm.value.remarks === ""){
      this.toastr.error('', 'Please Enter Remarks', { timeOut: 1500 });
      return false;
    }
    const fromDate = this.PartiallyHoldForm.value;
    fromDate.from_date = this.datePipe.transform(fromDate.from_date, 'yyyy-MM-dd');

    const toDate = this.PartiallyHoldForm.value;
    toDate.end_date = this.datePipe.transform(toDate.end_date, 'yyyy-MM-dd');

  
    let partiallyholdarray: any = [];
    for(let i = 0; i < this.landlordList.length; i++){
      if(this.landlordList[i].is_val == true){
        partiallyholdarray.push(this.landlordList[i].landlord_id)
        
      }
    }

   
      this.remsService.partiallyhold(this.PartiallyHoldForm.value,this.ScheduleId, status, partiallyholdarray)
        .subscribe(result => {
          if (result.status == 'success') {
            this.notification.showSuccess("Submitted To Partially Hold")
            this.router.navigate(["/rems/scheduleview"], { skipLocationChange: isSkipLocationChange })
            this.ngOnInit();
            this.closebuttonpartiallyhold.nativeElement.click();
          } else {
            this.notification.showError(result.description)
          }
        })
    

  }



  getScheduleView() {
    let leaseAgreementId : any = this.remsshareService.rentForm1.value;
    this.leaseAgrementId = leaseAgreementId;
    let res: any = this.shareService.scheduleView.value;
    this.ScheduleId = res.id;
    console.log("schedule-->id", this.ScheduleId)
    this.remsService.getparticularOwnedRentsch(this.leaseAgrementId ,this.ScheduleId)
        .subscribe((data) => {
          console.log("scheduleView", data)
        //  this.landlordList =  data.landlord
        //   console.log("landlordlist",this.landlordList)
          this.scheduleStatus = data.schedule_status.id;
    this.status = data.schedule_status.text;
    this.fromdate = data.from_date;
    this.freq = data.recurring_frequency.text
    this.todate = data.to_date;
    // if (this.scheduleStatus == 4 || this.scheduleStatus == 5 ){
    //   this.isshow = true;
    // }
    this.edit_flag = data.edit_flag;
    if(this.edit_flag == true) {
      this.flag = "YES"
    } else {
      this.flag = "NO"
    }
    this.startDate = data.start_date;
    this.endDate = data.end_date;
    this.PartiallyTerminateForm.patchValue({
      end_date: data.end_date,
    })
    const datestart = new Date(this.startDate)
    this.scheduleStartDate  = new Date(datestart.getFullYear(), datestart.getMonth(), datestart.getDate())
    const dateend = new Date(this.endDate)
    this.scheduleEndDate  = new Date(dateend.getFullYear(), dateend.getMonth(), dateend.getDate())
    this.enhancementTerms = data.renttype.text;
    this.leaseChanged = data.term_number;
    this.leaseRegistration = data.term_period;
    this.rentamt = data.rent_amount;
    this.leasePeriod = data.amenties_amount;
    this.lockPeriod = data.maintenance_amount;
    this.registrationDate = data.others;
    this.rlxprd = data.recurring_amount;
    this.vacationPeriod = data.rent_increment;
    this.approvalDate = data.amenties_increment;
    this.approvalDate1 = data.maintenance_increment;
    this.code = data.others_increment;
    this.commercialApprove = data.recurring_scheduleamount;
    this.landloardPropertydtl = data.recurring_date;
    this.nonpaymentReason = data.terminate;
    this.hold = data.hold;
    
    // if (this.scheduleStatus == 2 || this.scheduleStatus == 4) {
    //   this.ishold = false;
    //   this.isterminate = false;
    //   this.isactivate = false;
    // } else {
    //   this.ishold = true;
    //   this.isterminate = true;
    //   this.isactivate = false;
    // }

    this.ishold = true;
    this.isterminate = true;
    this.isactivate = false;
      

    // if (this.scheduleStatus == 1) {
    //   this.isterminate = true;
    //   this.ishold = true;
    //   this.isactivate = false;
    // }
    // if (this.scheduleStatus == 2) {
    //   this.isactivate = false;
    //   this.ishold = false;
    //   this.isterminate = false;
    // }
    //  else {
    //   this.ishold = true;
    //   this.isterminate = true;
    // }
    // if(this.scheduleStatus == 4){
    //   this.isactivate = true;
    //   this.ishold = true;
    //   this.isterminate = false;
    // }
    // if (this.scheduleStatus == 3 || this.scheduleStatus == 5) {
    //   this.isactivate = true;
    //   this.ishold = false;
    //   this.isterminate = true;
    // }
    })
    
    
    // this.getRentTerm();
    this.getTableValue();
    this.getSchedule();
    let json: any = {
      data: [{
        title: "ScheduleView",
        name: '',
        code: res.schedule,
        routerUrl: "/agreementView"
      }]
      // "PDPRS262(orange) /PDLA109"
    }
    this.shareService.premiseBackNavigation.next(json);

  }

  backToAgreementSummary(){
    this.router.navigate(['/rems/agreementView'], { queryParams: { status: "Agreement and Rent" }, skipLocationChange: isSkipLocationChange });
  }

  getTableValue() {
    this.route.queryParams.subscribe(params => {
      this.backNavigationTable = params.status;
      if (this.backNavigationTable == "schedule") {
        this.dropDownTag = "schedule";
        this.getSchedule();
      } else if (this.backNavigationTable == "rent_term") {
        this.dropDownTag = "rent_term";
        this.getRentTerm();
      }
    })
  }


  rentTermDelete(id) {
    this.remsService.rentTermDelete(id)
      .subscribe((result) => {
        this.notification.showSuccess("Deleted....")
        this.getRentTerm();
      })
  }
  getRentTerm(pageNumber = 1) {
    this.remsService.getRentTerm(pageNumber)
      .subscribe(results => {
        console.log("arrears for leased", results)
        this.rentTermList = results.data;
        let datapagination = results.pagination;
        if (results.code === 'INVALID_INWARDHEADER_ID' && results.description === 'Invalid inwardheader ID') {
          this.is_RentTermPage = false;
        } else if (this.rentTermList.length == 0) {
          this.is_RentTermPage = true;
        } else if (this.rentTermList.length > 0) {
          this.next_rentTerm = datapagination.has_next;
          this.previous_rentTerm = datapagination.has_previous;
          this.present_RentTermPages = datapagination.index;
          this.is_RentTermPage = true;
        }
      })
  }

  rentTerm_nextClick() {
    if (this.next_rentTerm === true) {
      this.getRentTerm(this.present_RentTermPages + 1)
    }
  }

  rentTerm_previousClick() {
    if (this.previous_rentTerm === true) {
      this.getRentTerm(this.present_RentTermPages - 1)
    }
  }


  rentTermCreate(data) {
    if (data == '') {
      this.rentTermForm.patchValue({
        from_date: '',
        to_date: '',
        term_period: '',
        rent_amount: '',
        amenities_amount: '',
        maintenance_amount: '',
        remarks: '',
      })
    }

    this.getRentTerm();
  }

  rentTermEdit(data:any) {
    this.idValue = data.id;
    this.arrearsPeriod= data.term_period;
    if (data === '') {
      this.rentTermForm.patchValue({
        from_date: '',
        to_date: '',
        term_period: '',
        rent_amount: '',
        amenities_amount: '',
        maintenance_amount: '',
        remarks: '',

      })
    } else {
      this.rentTermForm.patchValue({
        from_date: data.from_date,
        to_date: data.to_date,
        term_period: this.arrearsPeriod,
        rent_amount: data.rent_amount,
        amenities_amount: data.amenities_amount,
        maintenance_amount: data.maintenance_amount,
        remarks: data.remarks
      })
    }
  }


  rentTermFormCreate() {
    if (this.rentTermForm.value.from_date === "") {
      this.toastr.error('', 'Please Enter Arrears From Date', { timeOut: 1500 });
      return false;
    }
    if (this.rentTermForm.value.to_date === "") {
      this.toastr.error('', 'Please Enter Arrears TO Date', { timeOut: 1500 });
      return false;
    } 
     if (this.rentTermForm.value.rent_amount === "") {
      this.toastr.error('', 'Please Enter Rent Amount', { timeOut: 1500 });
      return false;
    }
    // if (this.rentTermForm.value.amenities_amount === "") {
    //   this.toastr.warning('', 'Please Enter Amenities Amount', { timeOut: 1500 });
    //   return false;

    // } if (this.rentTermForm.value.maintenance_amount === "") {
    //   this.toastr.warning('', 'Please Enter Maintenance Amount', { timeOut: 1500 });
    //   return false;
    // }
     if (this.rentTermForm.value.remarks === "") {
      this.toastr.error('', 'Please Enter Remarks', { timeOut: 1500 });
      return false;
    }

    const fromDate = this.rentTermForm.value;
    fromDate.from_date = this.datePipe.transform(fromDate.from_date, 'yyyy-MM-dd');
    const toDate = this.rentTermForm.value;
    toDate.to_date = this.datePipe.transform(toDate.to_date, 'yyyy-MM-dd');
    this.rentTermForm.value.rentschedule_id = this.ScheduleId 
    if (this.idValue == undefined) {
      this.remsService.rentTermFormCreate(this.rentTermForm.value, '')
        .subscribe(result => {
          console.log(">>>leasedarrears", result)
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
            this.notification.showError("Some Thing Wrong")
          }
          else {
            this.notification.showSuccess("Successfully created!...")
            this.router.navigate(['/rems/scheduleview'], { skipLocationChange: isSkipLocationChange });
            this.getRentTerm();
            this.formGroupDirective.resetForm();
            this.closebutton.nativeElement.click();
          }
          this.idValue = result.id;
        })
    } else {
      this.remsService.rentTermFormCreate(this.rentTermForm.value, this.idValue)
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
            this.notification.showError("Some Thing Wrong")
          }
          else {
            this.notification.showSuccess("Successfully Updated!...")
            this.router.navigate(['/rems/scheduleview'], { skipLocationChange: isSkipLocationChange });
            this.getRentTerm();
            this.formGroupDirective.resetForm();
            this.closebutton.nativeElement.click();
          }
        })
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  ActivatePopupForm() {
    let status = 1
    let Activatearray: any = [];
    for(let i = 0; i < this.landlordList.length; i++){
      if(this.landlordList[i].is_val == true){
        Activatearray.push(this.landlordList[i].landlord_id)
        
      }
    }
  
      this.remsService.activate(this.ActivateForm.value,this.ScheduleId, status, Activatearray)
      .subscribe(result => {
        if (result.status == 'success') {
          this.notification.showSuccess("Submitted To Activate")
          this.router.navigate(["/rems/scheduleview"], { skipLocationChange: isSkipLocationChange })
          this.ngOnInit();
        } else {
          this.notification.showError(result.description)
        }
      })
  }

  rentPayableAmount: string;
  scheduleaccessorId: number
  Schedule:string;
  getSchedule() {
    this.remsService.getScheduleForTerm(this.ScheduleId,this.bothcondition)
      .subscribe(results => {
        console.log("scheduleaccessor", results)
        if(results?.data == undefined ){
          this.notification.showError(results.description)
          return false
        }
        this.scheduleList = results.data;
        this.landlordList =  this.scheduleList[0].rentscheduleinfo
        console.log("landlordlist",this.landlordList)

        // partially hold and terminate
      // for(let i = 0; i < this.scheduleList.length; i++){

      //   if(this.scheduleList[i].rentscheduleinfo.length == 0){
      //     const datestart = new Date(this.startDate)
      //     this.scheduleStartDate  = new Date(datestart.getFullYear(), datestart.getMonth(), datestart.getDate())
      //     console.log("ro not raised",this.scheduleStartDate )
      //   }
      //   else {
      //     for(let i = 0; i < this.scheduleList.length; i++){
       
      //       if(this.scheduleList[i].rentscheduleinfo.length != 0){
      //         this.roRaisedEndDate = this.scheduleList[i].to_date
      //         const datestart = new Date(this.roRaisedEndDate)
      //         this.scheduleStartDate  = new Date(datestart.getFullYear(), datestart.getMonth(), datestart.getDate()+1)
      //         console.log("endDate--ro raised",this.scheduleStartDate )
      //       } 
      //   }

      //   }
      //   break;

      // }
       
      //   const dateend = new Date(this.endDate)
      //   this.scheduleEndDate  = new Date(dateend.getFullYear(), dateend.getMonth(), dateend.getDate())

      })
  }


  scheduleaccessorClick(data){
   this.isShowId = true;
   this.isShowpoButton = true;
   let id = data.id;
   this.scheduleaccessorId = id; 
   console.log("scheduleaccessorId",this.scheduleaccessorId )
   let amount = data.rentpaid_amount;
   this.rentPayableAmount = amount;
   console.log("rentPayableAmount",this.rentPayableAmount )
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;
    return (k == 46 || (k >= 48 && k <= 57));
  }

  moveToRO1() {
    this.remsService.moveToPo(this.leaseAgreementId,this.scheduleaccessorId, this.rentPayableAmount)
      .subscribe(results => {
        console.log("moveToPo", results)
          if (results.status == 'success') {
            this.notification.showSuccess("Submitted To RO")
            this.getSchedule();
            this.isShowpoButton = false;
          } 
        else {
          this.notification.showError(results.description)
        }
      })
  }

  moveToRO() {
    let checkedItems: any = [];
    checkedItems.push(this.scheduleaccessorId);
    let json: any = {
      accrid_list: checkedItems
    }
    this.remsService.moveToRO(json)
      .subscribe(results => {
        if (results.status != 'success') {
          this.notification.showError(results?.message)         
        }
        else {
          this.notification.showSuccess("Submitted To RO")
          this.getSchedule();
            this.isShowpoButton = false;
        }
      })
  }


  landlordRemarksPopup(data){
    console.log("remarks",data)
    this.landlordRemarks.patchValue({
      "remarks": data.remarks
    })
  }

  scheduleEditPopup(data){
    this.landlordStatus = undefined;
    this.rentschedule_accessor_id = data.id;
    console.log("accssor id",this.rentschedule_accessor_id)
    console.log("rent modify",data)
    this.rentEditable.patchValue({
      "scheduleraccr_id": this.rentschedule_accessor_id,
      "oldrent_amount": data.rent_amount,
      "rent_amount": 0,
      "remarks": "",
      "rent_status": 2
    })
    this.getFormArray().clear()
    // for (let detail of data.rentscheduleinfo) {
      for (let i=0; i<data.rentscheduleinfo.length; i++) { 
      this.Ro = data.rentscheduleinfo[0].po_number
      let landlord_id: FormControl = new FormControl('');
      let rentscheduleinfo_id: FormControl = new FormControl('');
      let oldrent_amount: FormControl = new FormControl('');
      let rent_amount: FormControl = new FormControl('');
      let landlord: FormControl = new FormControl('');
      let share: FormControl = new FormControl('');
      
      landlord_id.setValue(data.rentscheduleinfo[i].landlord_id);
      rentscheduleinfo_id.setValue(data.rentscheduleinfo[i].rentscheduleinfo_id);
      oldrent_amount.setValue(data.rentscheduleinfo[i].share_amount)
      rent_amount.setValue(0)
      landlord.setValue(data.rentscheduleinfo[i].landlord_name);
      share.setValue(+data.rentscheduleinfo[i].calculated_share);
      
      this.getFormArray().push(new FormGroup({
        landlord_id: landlord_id,
        rentscheduleinfo_id: rentscheduleinfo_id,
        oldrent_amount: oldrent_amount,
        rent_amount: rent_amount,
        landlord: landlord,
        share: share
      }))
    }
    for (let i=0; i<data.rentscheduleinfo.length; i++) { 
        if(data.rentscheduleinfo[i].active_status.text != "Active"){
          this.landlordStatus = data.rentscheduleinfo[i].active_status.text
          break;
        }
    }
  }

  scheduleRejectReprocess(rentshe){
    console.log("rentshe",rentshe)
    this.fg_reprocessLandlord.patchValue({
      "reprocess_rent_amount": rentshe.share_amount,
      "reprocess_landlord":rentshe.landlord_name,
      "reprocess_grn_status":rentshe.grn_status
    })
    this.rentscheduleinfo_id=rentshe.rentscheduleinfo_id;
  }
  amtclick(e){
    let oldamt = this.rentEditable.controls.oldrent_amount.value
    let amt = e.target.value
    let datas = this.rentEditable.value.landlord_allocation
    console.log("atclk",datas)
    this.getFormArray().clear()
    for (let i=0; i<datas.length; i++) {
        let oldrent_amount: FormControl = new FormControl('');
        let Rentamt: FormControl = new FormControl('');
        let landlord_id: FormControl = new FormControl('');
        let Share: FormControl = new FormControl('');
        let Landlord: FormControl = new FormControl('');
        let remarks: FormControl = new FormControl('');
        let rentscheduleinfo_id: FormControl = new FormControl('');
    
        let sharept = +datas[i].share
        let landlord_id1 = datas[i].landlord_id
        let landlord1 = datas[i].landlord
        let share1 = datas[i].share

        oldrent_amount.setValue((oldamt * (sharept/100)).toFixed(2));
        Rentamt.setValue((amt * (sharept/100)).toFixed(2));
        landlord_id.setValue(landlord_id1);      
        rentscheduleinfo_id.setValue(datas[i].rentscheduleinfo_id);      
        Landlord.setValue(landlord1);
        Share.setValue(share1);
       
        this.getFormArray().push(new FormGroup({
        oldrent_amount: oldrent_amount,
        rent_amount: Rentamt,
        share: Share,
        landlord: Landlord,
        landlord_id: landlord_id,
        rentscheduleinfo_id: rentscheduleinfo_id
      }))
      

    
    }
  
 
  }

  reprocessLandLordForm(){
    let data = this.fg_reprocessLandlord.value;
    console.log("rent", data)
    if (data.reprocess_rent_amount == "" || data.reprocess_rent_amount == null || data.reprocess_rent_amount == undefined) {
      this.toastr.error('', 'Please enter schedule share amount', { timeOut: 1500 });
      return false;
    }
    this.remsService.get_reprocessschedule(data.reprocess_rent_amount,this.rentscheduleinfo_id)
          .subscribe((results) => {
            let datas = results["data"];
            // this.typeList = datas;
            console.log("get_reprocessschedule",datas)
            this.getScheduleView();
          })

  }

  rentEditableForm(){
    let data = this.rentEditable.value;
    console.log("rent", data)
    if (data.rent_amount == "" || data.rent_amount == null || data.rent_amount == undefined) {
      this.toastr.error('', 'Please Enter Schedule Amount', { timeOut: 1500 });
      return false;
    }
    if (data.remarks == "" ) {
      this.toastr.error('', 'Please Enter Remarks', { timeOut: 1500 });
      return false;
    }
    if (this.role !="Maker" || this.role == undefined) {
      this.toastr.error('', 'Modification denied ', { timeOut: 1500 });
      return false;
    } if (this.landlordStatus != undefined) {
      this.toastr.error('', 'You can not modify Schedule Amount ', { timeOut: 1500 });
      return false;
    }
    

    let obj = this.rentEditable.value.landlord_allocation
    console.log("cc", obj)
    let rentAmt = obj.map(x => x.rent_amount);
    console.log('data check amt', rentAmt);

    let sum: any = rentAmt.reduce((a, b) => +a + +b, 0);
    console.log("sum total", sum)

    if ( Math.ceil(sum) != Math.ceil(+this.rentEditable.value.rent_amount)) {
      this.notification.showError("Schedule Amount and landlord Share amount Not Matched")
      return false;
    }
    this.remsService.rentEditableNew(this.rentEditable.value)
      .subscribe(result => {
        if (result.statusText == "Internal Server Error") {
          this.notification.showError("Internal Server Error")
        } else if (result.code === "PERMISSION DENIED") {
          this.notification.showError("PERMISSION DENIED")
        }
        else if(result.status == "success"){
          this.notification.showSuccess("Successfully updated!...")
          this.closebuttonRentEditable.nativeElement.click();
          this.getSchedule();
        }
        else
        {
          this.notification.showError(result.message)
        }
      })
  }
  
  bothcondition: any;
  onChangeDropDown(e){
    console.log("ggg",e)
    this.bothcondition = e
    if(this.bothcondition == 1){
      this.getScheduleView();
      this.isShowpoButton = true;
    }
    if(this.bothcondition == 2){
      // if(this.scheduleStatus == 2 || this.scheduleStatus == 4) {
      //   this.ishold = false;
      //   this.isterminate = false;
      //   this.isactivate = false;
      // }else {
      // this.isactivate = true;
      // this.ishold = false;
      // this.isterminate = false;
      // }
      this.isactivate = true;
      this.ishold = false;
      this.isterminate = false;
      this.isShowpoButton = false;
      this.getSchedule();
    } if(this.bothcondition == 3) {
      this.isactivate = false;
      this.ishold = false;
      this.isterminate = false;
      this.isShowpoButton = false;
      this.getSchedule();
    }
    
  }

  closeHold(){
    this.ngOnInit();
  }
  closePartiallyHold(){
    this.ngOnInit();
  }
  closeTerminate(){
    this.ngOnInit();
  }
  closePartiallyTerminate(){
    this.ngOnInit();
  }


}
