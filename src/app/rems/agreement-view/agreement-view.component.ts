import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { RemsService } from '../rems.service'
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../notification.service'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, } from '@angular/material/autocomplete';
import { Rems2Service } from '../rems2.service'
import { SharedService } from '../../service/shared.service';
import { environment } from 'src/environments/environment'

const isSkipLocationChange = environment.isSkipLocationChange


export interface LandLordMapping {
  id: number;
  name: string
}

@Component({
  selector: 'app-agreement-view',
  templateUrl: './agreement-view.component.html',
  styleUrls: ['./agreement-view.component.scss']
})
export class AgreementViewComponent implements OnInit {
  @ViewChild('mappingInput') mappingInput: ElementRef;
  @ViewChild('closebutton') closebutton;
  @ViewChild('closeOccupancy') closeOccupancy;
  chipSelectedLandLord: LandLordMapping[] = [];
  chipSelectedMappingId = [];
  landLordMappingValue: LandLordMapping[];
  chipRemovedLandLordid = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public codeControl = new FormControl();
  approvalDate1: string;
  isMaker: boolean = false;
  isChecker: boolean = false;
  isHeader: boolean = false;
  rlxprd: string;
  endDate: string;
  startDate: string;
  enhancementTerms: number;
  leaseChanged: number;
  leaseRegistration: number;
  leasePeriod: number;
  lockPeriod: number;
  registrationDate: string;
  rentAdjusttment: number;
  vacationPeriod: number;
  rentpayingoffice: string;
  vacationTerms: number;
  approvalDate: string;
  code: string;
  commercialApprove: string;
  landloardPropertydtl: string;
  nonpaymentReason: string;
  primaryContact: string;
  rentPaymentmode: number;
  securityDeposit: number
  totalArea: string;
  line1: string;
  line2: string;
  line3: string;
  city: string;
  district: string;
  pinCode: string;
  state: string;
  dropDownTag = "rent";
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
  leaseAgreementId: string;
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
  scheduleViewdata: any;
  vacationterm: any;
  isLeaseRegStatus = false;
  Rentschmodify = false;
  rentschedulemodiData = [];
  premiseviewid: any;
  isEditBtn: boolean;
  isAddRentScheduleBtn: boolean;
  isModification: boolean;
  premisesStatus: string;
  requestedStatus: string;
  scheduleType: string;
  scheduleType_Id: any;
  detailsList = [];
  constructor(private shareService: RemsShareService, private remsService: RemsService, private remsshareService: RemsShareService,
    private route: ActivatedRoute, private fb: FormBuilder, private remsService2: Rems2Service, private sharedService: SharedService,
    private router: Router, private notification: NotificationService) { }

  ngOnInit(): void {

    let remsurl = this.sharedService.menuUrlData.filter(rolename => rolename.name == 'REMS');
    remsurl.forEach((data) => {
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

    console.log("this.remsshareService.previousScheduledate1", this.remsshareService.previousScheduledate);
    this.remsshareService.previousScheduledate = undefined;
    console.log("this.remsshareService.previousScheduledate2", this.remsshareService.previousScheduledate);
    this.getAgreementView();
    // this.getlanlordsummary();
    // this.getOccupancyList();
    // this.getModificationView();
    this.landLordMappingForm = this.fb.group({
      landlord_id: ['', Validators.required],
    })
    this.occupancyMapForm = this.fb.group({
      occupancy_id: ['', Validators.required],
    })
  }


  getAgreementView() {
    let id = this.shareService.agreementView.value;
    this.leaseAgreementId = id;
    console.log("agreement--> id", this.leaseAgreementId)
    let premisesData = this.shareService.premiseViewID.value;
    this.premisesStatus = premisesData.premise_status;
    this.requestedStatus = premisesData.requeststatus;

    this.premiseId = premisesData.id
    this.remsService.getAgreementView(id, this.premiseId)
      .subscribe(data => {
        console.log("a", data)
        this.shareService.agreementDetails.next(data)
        this.detailsList = data.landlord_allocation_ratio.data;
        this.startDate = data.start_date;

        if (data.type != null) {
          this.scheduleType = data.type.text;
          this.scheduleType_Id = data.type.id;
        }


        this.endDate = data.end_date;
        this.enhancementTerms = data.enhancement_terms;
        this.leaseChanged = data.vacation_date;
        this.leasePeriod = data.lease_period;
        this.lockPeriod = data.lock_in_period;
        this.rlxprd = data.relaxation_period;
        this.vacationPeriod = data.vacation_period;
        this.rentpayingoffice = data.rentpaying_ofz.name + '(' + data.rentpaying_ofz.code + ')'
        this.vacationterm = data.vacation_terms;
        this.approvalDate = data.relaxation_end_date;
        this.approvalDate1 = data.relaxation_start_date;
        this.code = data.code;
        this.commercialApprove = data.lease_status.text;
        this.landloardPropertydtl = data.lease_registration_status.text;
        this.primaryContact = data.primarycontact.full_name;
        this.rentAdjusttment = data.rent_adjustment
        this.securityDeposit = data.security_deposit;
        this.rent = data.rent_schedule;
        if (data.temporary_lease == true) {
          this.templease = 'Yes';
        } else {
          this.templease = 'No';
        }
        if (data.lease_registration_status.id == 1) {
          this.isLeaseRegStatus = true;
          this.registrationDate = data.registration_date;
          this.leaseRegistration = data.lease_registration;
          if (data.lease_regcharges_paidby != null) {
            this.nonpaymentReason = data.lease_regcharges_paidby.text;
          }
        }

        this.getRent();
        this.getTableValue();
        let json: any = {
          data: [{
            title: "AgreementView",
            name: '',
            code: premisesData.code + " (" + premisesData.name + " ) " + " / " + data.code,
            routerUrl: "/premiseView"
          }]
        }
        this.scheduleViewdata = {
          schedule: premisesData.code + " (" + premisesData.name + " ) " + " / " + data.code,
        }
        this.remsshareService.premiseBackNavigation.next(json);

      })
  }

  backToAgreementSummary() {
    this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Agreement and Rent" }, skipLocationChange: isSkipLocationChange });
  }

  getTableValue() {
    this.route.queryParams.subscribe(params => {
      this.backNavigationTable = params.status;
      if (this.backNavigationTable == "rent") {
        this.dropDownTag = "rent";
        this.getRent();
      }
      // else if (this.backNavigationTable == "rent_term") {
      //   this.dropDownTag = "rent_term";
      //   this.getRentTerm();
      // }
      //  else if (this.backNavigationTable == "rent_arrear") {
      //   this.dropDownTag = "rent_arrear";
      //   this.getRentArrear();
      // }
      else if (this.backNavigationTable == "landLordMapping") {
        this.dropDownTag = "landLordMapping";
        this.getLandlordListMap();
      } else if (this.backNavigationTable == "occupancyMapping") {
        this.dropDownTag = "occupancyMapping";
        this.getLeaseOccupancyMap();
      }
    })
  }
  rentCreate() {
    let json: any = {
      premiseID: this.premiseId,
      leaseAgreementId: this.leaseAgreementId,
      data: ''
    }
    // this.shareService.rentForm.next(json)

    if (this.rent == true) {
      this.shareService.rentForm.next('')
      // this.shareService.previousScheduledate=;
      this.shareService.rentForm1.next(this.leaseAgreementId)
      this.shareService.agreementStartdate.next(this.startDate)
      this.shareService.agreementEnddate.next(this.endDate)
      this.shareService.terminateStartdate.next(this.terminatedCaseStartDate)
      this.shareService.terminateEnddate.next(this.terminatedCaseEndDate)
      this.shareService.firstTermEnddate.next(this.scheduleEndDate)
      this.shareService.scheduleType.next(this.scheduleType_Id)
      this.shareService.lastrentamount.next(this.lastRentAmount)
      this.shareService.lastrentincrement.next(this.lastRentIncrement)
      this.router.navigate(['/rems/rentscheduleleased'], { skipLocationChange: isSkipLocationChange });
    } if (this.rent == false) {
      this.shareService.rentForm.next('')
      this.shareService.rentForm1.next(this.leaseAgreementId)
      this.router.navigate(['/rems/rentForm'], { skipLocationChange: isSkipLocationChange });
    }
  }
  rentEdit(data) {
    // let json = {
    //   premiseID: this.premiseId,
    //   leaseAgreementId: this.leaseAgreementId
    // }
    // let finalJson = Object.assign({}, data, json);
    // this.shareService.rentForm.next(finalJson)
    if (this.rent == true) {
      // let finalJson = Object.assign({}, data, json);
      this.shareService.rentForm.next(data)
      this.shareService.rentForm1.next(this.leaseAgreementId)
      this.shareService.scheduleType.next(this.scheduleType_Id)
      this.router.navigate(['/rems/rentscheduleleased'], { skipLocationChange: isSkipLocationChange });
    } if (this.rent == false) {
      // let finalJson = Object.assign({}, data, json);
      this.shareService.rentForm.next(data)
      this.shareService.rentForm1.next(this.leaseAgreementId)
      this.router.navigate(['/rems/rentForm'], { skipLocationChange: isSkipLocationChange });
    }
  }

  rentDelete(id) {
    console.log("id", id);
    this.remsService.rentDelete(this.leaseAgreementId, id)
      .subscribe((result) => {
        let code = result.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Modify before getting the Approval")
        }
        else {
          this.notification.showSuccess("Deleted....")
          this.getRent();
        }

      })
  }
  scheduleStartDate: string;
  scheduleEndDate: string;
  lastRentAmount: any;
  lastRentIncrement: any;
  terminatedCaseStartDate: any;
  terminatedCaseEndDate: any;
  // lastAmAmount: any;
  // lastAmIncrement: any;
  // lastMainAmount: any;
  // lastMainIncrement: any;
  getRent(pageNumber = 1) {
    this.remsService.getRent(pageNumber, this.leaseAgreementId)
      .subscribe(data => {
        console.log("rent schedule", data)
        this.rentList = data.data;

        if (this.rentList.length == 0) {
          this.scheduleEndDate = undefined;
          this.lastRentAmount = undefined;
          this.lastRentIncrement = undefined;
          this.terminatedCaseStartDate = undefined;
          this.remsshareService.previousScheduledate = undefined
          // this.lastAmAmount = undefined;
          // this.lastAmIncrement = undefined;
          // this.lastMainAmount = undefined;
          // this.lastMainIncrement = undefined;
        }
        for (let i = 0; i < this.rentList.length; i++) {
          this.scheduleEndDate = this.rentList[i].end_date
          console.log("endDate", this.scheduleEndDate)
          this.remsshareService.previousScheduledate = this.rentList[i].valid_date;
          console.log("this.remsshareService.previousScheduledate", this.remsshareService.previousScheduledate);
          this.terminatedCaseStartDate = this.rentList[i].from_date
          this.terminatedCaseEndDate = this.rentList[i].to_date
          if (this.scheduleType_Id == 1) {
            this.lastRentAmount = this.rentList[i].rent_amount
            this.lastRentIncrement = this.rentList[i].rent_increment
          }

          if (this.scheduleType_Id == 2) {
            this.lastRentAmount = this.rentList[i].amenties_amount
            this.lastRentIncrement = this.rentList[i].amenties_increment
          }

          if (this.scheduleType_Id == 3) {
            this.lastRentAmount = this.rentList[i].maintenance_amount
            this.lastRentIncrement = this.rentList[i].maintenance_increment
          }


        }

        let datapagination = data.pagination;
        if (this.rentList.length === 0) {
          this.is_RentPage = false
        }
        if (this.rentList.length > 0) {
          this.next_rent = datapagination.has_next;
          this.previous_rent = datapagination.has_previous;
          this.present_RentPages = datapagination.index;
          this.is_RentPage = true
        }
      })
    // let data: any = this.remsshareService.PremiseView.value;
    let data: any = this.remsshareService.premiseViewID.value;
    // console.log("data",data);
    // let datas = this.sharedService.menuUrlData.filter(rolename => rolename.name == 'REMS');
    // datas.forEach((result) => {
    // console.log("result",result)
    if (this.isMaker == true && data.premise_status == "DRAFT") {
      this.isAddRentScheduleBtn = true;
      this.isEditBtn = true;
    }
    if (this.isMaker == true && this.requestedStatus == "RENEWAL" && data.premise_status == "DRAFT"
      && data.main_status == "APPROVED") {
      this.isAddRentScheduleBtn = true;
      this.isEditBtn = false;
    }
    if (this.isMaker == true && this.premisesStatus == "PENDING_CHECKER") {
      this.isAddRentScheduleBtn = false;
      this.isEditBtn = false;
    }
    if (this.isMaker == true && this.requestedStatus == "MODIFICATION") {
      this.Rentschmodify = true;
    }
    if (this.isChecker == true && this.requestedStatus == "MODIFICATION") {
      this.Rentschmodify = false;
    }
    if (this.isHeader == true && this.requestedStatus == "MODIFICATION") {
      this.Rentschmodify = false;
    }
    if (this.isMaker == true && data.premise_status == "APPROVED"
      && data.requeststatus == "MODIFICATION" && data.main_status == "APPROVED") {
      this.Rentschmodify = false;
    }
    // });
    this.premiseviewid = data.id
    this.getModificationView();
  }

  rent_nextClick() {
    if (this.next_rent === true) {
      this.getRent(this.present_RentPages + 1)
    }
  }

  rent_previousClick() {
    if (this.previous_rent === true) {
      this.getRent(this.present_RentPages - 1)
    }
  }
  getModificationView() {
    this.remsService2.getModificationView(this.premiseviewid)
      .subscribe((results) => {
        this.rentschedulemodiData = []
        let datas = results.data
        console.log("Modificatoin ", datas)

        datas.forEach(element => {
          console.log("element", element);
          if (element.data.lease_agreement_id == this.leaseAgreementId) {
            if (element.action == 1 && element.type_name == "RENTSCHEDULE") {
              let data = {
                modify_data: "New"
              }
              let json = Object.assign({}, data, element.data)
              this.rentschedulemodiData.push(json);
            } else if (element.action == 2 && element.type_name == "RENTSCHEDULE") {
              let data = {
                modify_data: "Modify"
              }
              let json = Object.assign({}, data, element.new_data)
              this.rentschedulemodiData.push(json);
            } else if (element.action == 0 && element.type_name == "RENTSCHEDULE") {
              let data = {
                modify_data: "Delete"
              }
              let json = Object.assign({}, data, element.data)
              this.rentschedulemodiData.push(json);
            }
            console.log("this.rentschedulemodiData", this.rentschedulemodiData);
          }
        })

      })
  }
  scheduleClick(data) {
    if (this.rent == true) {
      let json = Object.assign({}, this.scheduleViewdata, data)
      this.remsshareService.scheduleView.next(json)
      this.shareService.scheduleType.next(this.scheduleType_Id)
      this.shareService.rentForm1.next(this.leaseAgreementId)
      this.router.navigate(['/rems/scheduleview'], { skipLocationChange: isSkipLocationChange });
    } if (this.rent == false) {
      this.remsshareService.scheduleView.next(data)
      this.router.navigate(['/rems/ownedscheduleview'], { skipLocationChange: isSkipLocationChange });
    }
  }

  scheduleClick1(data) {
    this.remsshareService.scheduleView.next(data)
    this.router.navigate(['/rems/ownedscheduleview'], { skipLocationChange: isSkipLocationChange });
  }



  // rentTermCreate() {
  //   this.shareService.rentTermForm.next('')
  // }
  // rentTermEdit(data) {
  //   this.shareService.rentTermForm.next(data)
  // }

  // rentTermDelete(id) {
  //   this.remsService.rentTermDelete(id)
  //     .subscribe((result) => {
  //       this.notification.showSuccess("Deleted....")
  //       this.getRentTerm();
  //     })
  // }
  // getRentTerm(pageNumber = 1) {
  //   this.remsService.getRentTerm(pageNumber)
  //     .subscribe(results => {
  //       console.log("?ter", results)
  //       this.rentTermList = results.data;
  //       let datapagination = results.pagination;
  //       if (results.code === 'INVALID_INWARDHEADER_ID' && results.description === 'Invalid inwardheader ID') {
  //         this.is_RentTermPage = false;
  //       } else if (this.rentTermList.length == 0) {
  //         this.is_RentTermPage = true;
  //       } else if (this.rentTermList.length > 0) {
  //         this.next_rentTerm = datapagination.has_next;
  //         this.previous_rentTerm = datapagination.has_previous;
  //         this.present_RentTermPages = datapagination.index;
  //         this.is_RentTermPage = true;
  //       }
  //     })
  // }

  // rentTerm_nextClick() {
  //   if (this.next_rentTerm === true) {
  //     this.getRentTerm(this.present_RentTermPages + 1)
  //   }
  // }

  // rentTerm_previousClick() {
  //   if (this.previous_rentTerm === true) {
  //     this.getRentTerm(this.present_RentTermPages - 1)
  //   }
  // }

  rentArrearCreate() {
    this.shareService.rentArrearForm.next('')
    this.router.navigate(['/rems/rentArrearForm'], { skipLocationChange: isSkipLocationChange });
  }
  rentArrearEdit(data) {
    this.shareService.rentArrearForm.next(data)
    this.router.navigate(['/rems/rentArrearForm'], { skipLocationChange: isSkipLocationChange });
  }

  rentArrearDelete(id) {
    this.remsService.rentArrearDelete(id)
      .subscribe((result) => {
        this.notification.showSuccess("Deleted....")
        this.getRentArrear();
      })
  }
  getRentArrear(pageNumber = 1) {
    this.remsService.getRentArrear(pageNumber)
      .subscribe(results => {
        let datapagination = results.pagination;
        this.rentArrearList = results.data
        if (this.rentArrearList.length == 0) {
          this.is_RentArrearPage = true;
        } else if (this.rentArrearList.length > 0) {
          this.next_rentArrear = datapagination.has_next;
          this.previous_rentArrear = datapagination.has_previous;
          this.present_RentArrearPages = datapagination.index;
          this.is_RentArrearPage = true;
        }
      })
  }

  arrear_nextClick() {
    if (this.next_rentArrear === true) {
      this.getRentArrear(this.present_RentArrearPages + 1)
    }
  }

  arrear_previousClick() {
    if (this.previous_rentArrear === true) {
      this.getRentArrear(this.present_RentArrearPages - 1)
    }
  }

  getlanlordsummary() {
    this.remsService.getlanlordsummary('', '', 1, 10, this.premiseId)
      .subscribe(result => {
        let data = result.data;
        this.landLordMappingValue = data;
      })
  }

  public removeCode(name: LandLordMapping): void {
    const index = this.chipSelectedLandLord.indexOf(name);
    this.chipRemovedLandLordid.push(name.id)
    this.chipSelectedLandLord.splice(index, 1);
    this.chipSelectedMappingId.splice(index, 1);
    return;
  }

  public nameSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectName(event.option.value.name);
    this.mappingInput.nativeElement.value = '';
  }
  private selectName(name) {
    let foundCode = this.landLordMappingValue.filter(item => item.name == name);
    if (foundCode.length) {
      this.chipSelectedLandLord.push(foundCode[0]);
      this.chipSelectedMappingId.push(foundCode[0].id)
    }
  }

  landLordMapCreate() {
    let json = {
      method: "add"
    }
    this.method = json.method
  }

  landMapppingCreate() {
    if (this.method == "add") {
      this.remsService.landLordMappingForm(this.chipSelectedMappingId, this.leaseAgreementId, this.method)
        .subscribe(result => {
          this.notification.showSuccess(result.message)
          this.closebutton.nativeElement.click();
          this.getLandlordListMap();
          this.chipSelectedMappingId = [];
          this.chipSelectedLandLord = [];
        })
    }
  }
  landLordMappigEdit(id) {
    let json = {
      method: "remove"
    }
    this.method = json.method
    this.tableId = id;
  }

  landLordMapDelete() {
    if (this.method == "remove") {
      this.remsService.landLordMappingForm(this.tableId, this.leaseAgreementId, this.method)
        .subscribe(result => {
          if (result.status == "success") {
            this.notification.showSuccess(result.message)
            this.closebutton.nativeElement.click();
          }
          this.getLandlordListMap();
        })
    }
  }

  getLandlordListMap(pageNumber = 1) {
    this.remsService.getLandlordListMap(pageNumber, this.leaseAgreementId)
      .subscribe(result => {
        let data = result.data;
        this.landLordData = data;
        this.landLordData = data;
        let datapagination = result.pagination;
        if (result.code === 'INVALID_INWARDHEADER_ID' && result.description === 'Invalid inwardheader ID') {
          this.isLandLord = false;
        } else if (this.landLordData.length == 0) {
          this.isLandLord = false;
        } else if (this.landLordData.length > 0) {
          this.next_landLord = datapagination.has_next;
          this.previous_landLord = datapagination.has_previous;
          this.present_LandLordPage = datapagination.index;
          this.isLandLord = true;
        }
      })
  }

  landLordNext() {
    if (this.next_landLord === true) {
      this.getLandlordListMap(this.present_LandLordPage + 1)
    }
  }

  landLordPrevious() {
    if (this.previous_landLord === true) {
      this.getLandlordListMap(this.present_LandLordPage - 1)
    }
  }

  getOccupancyList() {
    this.remsService.getOccupancyList('', '', 1, 10, this.premiseId)
      .subscribe(result => {
        let data = result.data;
        this.occupancyMapData = data;
      })
  }

  occupancyMapCreate() {
    let json = {
      method: "add"
    }
    this.method = json.method
  }

  occupancyMapppingCreate() {
    if (this.method == "add") {
      this.remsService.leaseOccupancyMapCreate(this.occupancyMapForm.value, this.leaseAgreementId, this.method)
        .subscribe(result => {
          this.notification.showSuccess(result.message)
          this.closeOccupancy.nativeElement.click();
          this.getLeaseOccupancyMap();
          this.chipSelectedMappingId = [];
          this.chipSelectedLandLord = [];
        })
    }
  }
  occupancyMappingEdit(id) {
    let json = {
      method: "remove"
    }
    this.method = json.method
    this.tableId = id;
  }

  occupancyMapDelete() {
    if (this.method == "remove") {
      this.remsService.leaseOccupancyMapCreate(this.tableId, this.leaseAgreementId, this.method)
        .subscribe(result => {
          if (result.status == "success") {
            this.notification.showSuccess(result.message)
            this.closeOccupancy.nativeElement.click();
          }
          this.getLeaseOccupancyMap();
        })
    }
  }

  getLeaseOccupancyMap(pageNumber = 1) {
    this.remsService.getLeaseOccupancyMap(pageNumber, this.leaseAgreementId)
      .subscribe(result => {
        let data = result.data;
        this.occupancyData = data;
        let datapagination = result.pagination;
        if (result.code === 'INVALID_INWARDHEADER_ID' && result.description === 'Invalid inwardheader ID') {
          this.isOccupancy = false;
        } else if (this.occupancyData.length == 0) {
          this.isOccupancy = false;
        } else if (this.occupancyData.length > 0) {
          this.nextOccupancy = datapagination.has_next;
          this.previousOccupancy = datapagination.has_previous;
          this.presentOccupancyPage = datapagination.index;
          this.isOccupancy = true;
        }
      })
  }

  occupancyNext() {
    if (this.nextOccupancy === true) {
      this.getLeaseOccupancyMap(this.presentOccupancyPage + 1)
    }
  }

  occupancyPrevious() {
    if (this.previousOccupancy === true) {
      this.getLeaseOccupancyMap(this.presentOccupancyPage - 1)
    }
  }

  backToRemsSummary() {
    this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Agreement and Rent" }, skipLocationChange: isSkipLocationChange });
  }
}