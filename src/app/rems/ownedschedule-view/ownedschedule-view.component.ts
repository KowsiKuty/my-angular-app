import { Component, OnInit } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { RemsService } from '../rems.service'
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../notification.service'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-ownedschedule-view',
  templateUrl: './ownedschedule-view.component.html',
  styleUrls: ['./ownedschedule-view.component.scss']
})
export class OwnedscheduleViewComponent implements OnInit {
  OwnedScheduleId: any;
  approvalDate1: string;
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
  vacationTerms: number;
  approvalDate: string;
  code: string;
  commercialApprove: string;
  landloardPropertydtl: string;
  nonpaymentReason: string;
  dropDownTag = "recurring";
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

  is_RecurringPage = true;
  next_recurring = true;
  previous_recurring = true;
  present_RecurringPages: number = 1;
  pagesizeRecurring = 10;
  recurringList: any;

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
  tableId:number;
  nextOccupancy = true;
  previousOccupancy = true;
  isOccupancy = true;
  currentOccupancyPage: number = 1;
  presentOccupancyPage: number = 1;
  pagesizeOccupancy = 10;
  occupancyMapForm: FormGroup;
  occupancyData:any
  occupancyMapData:any;
  rent: any;
  templease: string;
  leaseRegistration1: any;
  type: any;


  constructor(private shareService: RemsShareService, private remsService: RemsService,private remsshareService: RemsShareService,
    private route: ActivatedRoute, private fb: FormBuilder,
    private router: Router, private notification: NotificationService) { }

  ngOnInit(): void {
    this.getScheduleView();
  }

  getScheduleView() {
    let data: any = this.shareService.scheduleView.value;
    this.OwnedScheduleId = data.id;
    console.log("ownedschedule-->id",this.OwnedScheduleId )
        console.log("ownedSchedule", data)
        this.type= data.renttype.text
        this.startDate = data.rent_amount;
        this.endDate = data.amenties_amount;
        this.enhancementTerms = data.maintenance_amount;
        this.leaseChanged = data.others;
        this.leaseRegistration = data.remarks;
        this.leaseRegistration1 = data.total_amount;
        this.getOwnRecurringSchedule();
        this.getTableValue();
        let json: any = {
          data: [{
            title: "ScheduleView",
          name: '',
          code: this.code,
            routerUrl: "/agreementView"
          }]
        }
        this.shareService.premiseBackNavigation.next(json);
           
  }

  getTableValue() {
    this.route.queryParams.subscribe(params => {
      this.backNavigationTable = params.status;
      if (this.backNavigationTable == "recurring") {
        this.dropDownTag = "recurring";
        this.getOwnRecurringSchedule();
      } else if (this.backNavigationTable == "rent_term") {
        this.dropDownTag = "rent_term";
        this.getOwnArrears();
      }
    })
  }

  rentTermCreate() {
    this.shareService.rentTermForm.next('')
    this.shareService.scheduleId.next(this.OwnedScheduleId)
    this.router.navigate(['/rems/ownedarrearform'], { skipLocationChange: true });
  }
  rentTermEdit(data) {
    this.shareService.rentTermForm.next(data)
    this.shareService.scheduleId.next(this.OwnedScheduleId)
    this.router.navigate(['/rems/ownedarrearform'], { skipLocationChange: true });
  }

  ownedArrearsDelete(id) {
    this.remsService.ownedArrearsDelete(id)
      .subscribe((result) => {
        this.notification.showSuccess("Deleted....")
        this.getOwnArrears();
      })
  }
  getOwnArrears(pageNumber = 1) {
    this.remsService.getOwnArrears(pageNumber)
      .subscribe(results => {
        console.log("arrears for Owned", results)
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
      this.getOwnArrears(this.present_RentTermPages + 1)
    }
  }

  rentTerm_previousClick() {
    if (this.previous_rentTerm === true) {
      this.getOwnArrears(this.present_RentTermPages - 1)
    }
  }







  recurringCreate() {
    this.shareService.recurringForm.next('')
    this.shareService.scheduleId.next(this.OwnedScheduleId)
    this.router.navigate(['/rems/recurringform'], { skipLocationChange: true });
  }
  recurringEdit(data) {
    this.shareService.recurringForm.next(data)
    this.shareService.scheduleId.next(this.OwnedScheduleId)
    this.router.navigate(['/rems/recurringform'], { skipLocationChange: true });
  }

  recurringDelete(id) {
    this.remsService.ownRecurringScheduleDelete(id)
      .subscribe((result) => {
        this.notification.showSuccess("Deleted....")
        this.getOwnRecurringSchedule();
      })
  }
  getOwnRecurringSchedule(pageNumber = 1) {
    this.remsService.getOwnRecurringSchedule(pageNumber)
      .subscribe(results => {
        console.log("Recurring for owned", results)
        this.recurringList = results.data;
        let datapagination = results.pagination;
        if (results.code === 'INVALID_INWARDHEADER_ID' && results.description === 'Invalid inwardheader ID') {
          this.is_RecurringPage = false;
        } else if (this.recurringList.length == 0) {
          this.is_RecurringPage = true;
        } else if (this.recurringList.length > 0) {
          this.next_recurring = datapagination.has_next;
          this.previous_recurring = datapagination.has_previous;
          this.present_RecurringPages = datapagination.index;
          this.is_RecurringPage = true;
        }
      })
  }

  recurring_nextClick() {
    if (this.next_recurring === true) {
      this.getOwnRecurringSchedule(this.present_RecurringPages + 1)
    }
  }

  recurring_previousClick() {
    if (this.previous_recurring === true) {
      this.getOwnRecurringSchedule(this.present_RecurringPages - 1)
    }
  }

}
