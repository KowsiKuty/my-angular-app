import { Component, OnInit } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Router } from '@angular/router'
import { RemsShareService } from '../rems-share.service'
import { Rems2Service } from '../rems2.service'
import { RemsService } from '../rems.service';
export interface ExampleTab {
  tab_name: string;
  tab_id: string;
}
@Component({
  selector: 'app-modification-changes',
  templateUrl: './modification-changes.component.html',
  styleUrls: ['./modification-changes.component.scss']
})
export class ModificationChangesComponent implements OnInit {
  asyncTabs: Observable<ExampleTab[]>;
  tabChanges: any;
  premisViewData: any;
  premiseViewId: number;
  modificationData: any
  dataId: number;
  amenitiesModiData = [];
  amenitiesModiOldData: any;
  amentiesData: any;
  premisesModiData = [];
  premisesModiOldData: any;
  premisesData: any;
  premiseDetailsModiData = [];
  premiseDetailsModiOldData: any;
  premiseDetailsData: any;
  statutoryPaymentModiData = [];
  statutoryPaymentModiOldData: any;
  legalClearanceData: any;
  legalClearanceModiData = [];
  legalClearanceModiOldData: any;
  statutoryPaymentData: any;
  occupancyModiData = [];
  occupancyModiOldData: any;
  occupancyData: any;
  licenseDetailsModiData: any = [];
  licenseDetailsData: any;
  licenseDetailsModiOldData: any;
  insuranceDetailsModiData: any = [];
  insuranceDetailsData: any;
  insuranceDetailsModiOldData: any;
  repairModiOldData: any;
  repairDetailsData: any;
  repairModiData = [];
  repairMaintanceDatas: any;
  repairMaintenaceData: any;
  renovationModiData = [];
  renovationData: any;
  renovationModiOldData: any;
  repairDetailsModiOldData: any;
  repairDetailsModiData = [];
  bankDetailsModiOldData: any;
  bankDetailsData: any;
  bankDetailsModiData = [];
  ebAdvanceModiOldData: any;
  ebAdvanceModiData = [];
  ebAdvanceData: any;
  agreementModiData = [];
  agreementModiOldData: any;
  leaseAgreementData: any;
  landlordbankModiData = [];
  landlordbankModiOlData: any;
  landlorDetailsModiData = [];
  landlordDetailsData: any;
  landlordDetailsModiOlData: any;
  documentModiData = [];
  documentModiOlData: any;
  documentData: any;
  ebDetailsData: any;
  ebDetailsModiData = [];
  ebDetailsModiOldData: any;
  legalNoticeData: any;
  statutoryNoticeModiData = [];
  statutoryNoticeModiOldData: any;
  rentScheduleModiData = [];
  rentScheduleModiOldData: any;
  rentScheduleData: any;
  isRentScheduleDelete: boolean;
  isRentScheduleCreate: boolean;
  isRentSchedule: boolean;
  isInsurance: boolean;
  isAmentiesDelete: boolean;
  isAmentiesCreate: boolean;
  isAmenties: boolean;
  isRenovation: boolean;
  isRepair: boolean;
  isRepairDelete: boolean;
  isRepairCreate: boolean;
  isLegalNoticeCreate: boolean;
  isLegalNotice: boolean;
  isLegalNoticeDelete: boolean;
  isLandLordDetails: boolean;
  isebDetailsCreate: boolean;
  isLandLordDetailsCreate: boolean;
  isDocumentCreate: boolean;
  isStatutoryPayment: boolean;
  isStatutoryPaymentDelete: boolean;
  isStatutoryPaymentCreate: boolean;
  isLicenseDetailsCreate: boolean;
  isLicenses: boolean;
  isLicenseDetailsDelete: boolean;
  isEbDetails: boolean;
  isAgreement: boolean
  isDocument: boolean;
  isRenovationCreate: boolean;
  isInusranceCreate: boolean;
  isAgreementCreate: boolean;
  isRepairDetailsCreate: boolean;
  isRepairDetails: boolean;
  isEbAdvance: boolean;
  isEbAdvanceCreate: boolean;
  isBankDetails: boolean;
  isBankDetailsCreate: boolean;
  isBankDetailsDelete: boolean;
  isPremiseDetails: boolean;
  isPremiseDetailsCreate: boolean;
  isOccupancyDelete: boolean;
  isOccupancyCreate: boolean;
  isOccupancy: boolean;
  isRenovationDelete: boolean;
  isInusranceDelete: boolean;
  isAgreementDelete: boolean;
  isRepairDetailsDelete: boolean;
  isPremiseDetailsDelete: boolean;
  isEbDetailsDelete: boolean;
  isEbAdvanceDelete: boolean;
  isDocumentDelete: boolean;
  isLandLordDelete: boolean;
  isLegalClearanceDelete: boolean;
  isLegalClearance: boolean;
  isLegalClearanceCreate: boolean;
  isPremises: boolean;
  request_status: any;
  ebadvanceModificationList: any[];

  constructor(private router: Router, private remsService2: Rems2Service, private remsshareService: RemsShareService,private remsService:RemsService ) {
    this.asyncTabs = new Observable((observer: Observer<ExampleTab[]>) => {
      setTimeout(() => {
        observer.next([
          { "tab_name": "Premises", "tab_id": "1" },
          { "tab_name": "Amenities", "tab_id": "2" },
          { "tab_name": "Occupancy", "tab_id": "3" },
          { "tab_name": "Agreement", "tab_id": "4" },
          { "tab_name": "Legal Notice", "tab_id": "5" },
          { "tab_name": "Insurance Details", "tab_id": "6" },
          { "tab_name": "License Details", "tab_id": "7" },
          { "tab_name": "Premises Details", "tab_id": "8" },
          { "tab_name": "Renovation", "tab_id": "9" },
          { "tab_name": "Statutory Payment", "tab_id": "10" },
          { "tab_name": "Repairs & Maintenance", "tab_id": "11" },
          { "tab_name": "Legal Clearance", "tab_id": "12" },
          { "tab_name": "LandLord", "tab_id": "13" },
          { "tab_name": "EB Details", "tab_id": "14" },
          { "tab_name": "Documents", "tab_id": "15" },
          { "tab_name": "EB Advance", "tab_id": "16" },
          { "tab_name": "Repair Maintenance Details", "tab_id": "17" },
          { "tab_name": "Bank Details", "tab_id": "18" },
          { "tab_name": "Rent Schedule", "tab_id": "19" },
        ]);
      }, 1000);
    });
  }

  ngOnInit(): void {
    this.getPremisesData();
    this.getModificationView();
  }
  getPremisesData() {
    this.premisViewData = this.remsshareService.modificationView.value;
    this.premiseViewId = this.premisViewData.id
    console.log("premisViewData", this.premisViewData)
    this.request_status = this.premisViewData.requeststatus
    console.log("request status", this.request_status)
  }

  getTabValue() {
    this.changeTabValue(false, false, false, false, false, false, false, false, false,
      false, false, false, false, false, false, false, false, false, false, false, false,
      false, false, false, false, false, false, false, false, false, false, false, false, false,
      false, false, false, false, false, false, false, false, false, false,
      false, false, false, false, false, false, false, false, false, false, false)
  }

  changeTabValue(isLicenses: boolean, isInsurance: boolean, isStatutoryPayment: boolean,
    isAmenties: boolean, isRenovation: boolean, isRepair: boolean, isLegalNotice: boolean,
    isEbDetails: boolean, isOccupancy: boolean, isAmentiesCreate: boolean, isOccupancyCreate: boolean,
    isLicenseDetailsCreate: boolean, isInusranceCreate: boolean, isStatutoryPaymentCreate: boolean,
    isRenovationCreate: boolean, isRepairCreate: boolean, isLegalNoticeCreate: boolean,
    isebDetailsCreate: boolean, isAgreement: boolean, isAgreementCreate: boolean, isEbAdvance: boolean,
    isEbAdvanceCreate: boolean, isRepairDetails: boolean, isRepairDetailsCreate: boolean, isBankDetails: boolean,
    isDocument: boolean, isDocumentCreate: boolean, isLandLordDetails: boolean, isLandLordDetailsCreate: boolean,
    isLegalClearance: boolean, isLegalClearanceCreate: boolean, isAmentiesDelete: boolean, isOccupancyDelete: boolean,
    isAgreementDelete: boolean, isLegalNoticeDelete: boolean, isInusranceDelete: boolean, isLicenseDetailsDelete: boolean,
    isPremiseDetailsDelete: boolean, isRenovationDelete: boolean, isStatutoryPaymentDelete: boolean, isLegalClearanceDelete: boolean,
    isLandLordDelete: boolean, isEbDetailsDelete: boolean, isDocumentDelete: boolean, isRepairDelete: boolean,
    isRepairDetailsDelete: boolean, isEbAdvanceDelete: boolean, isBankDetailsCreate: boolean, isBankDetailsDelete: boolean,
    isRentSchedule: boolean, isRentScheduleCreate: boolean, isRentScheduleDelete: boolean,
    isPremiseDetails: boolean, isPremiseDetailsCreate: boolean, isPremises: boolean) {
    this.isAmenties = isAmenties;
    this.isOccupancy = isOccupancy;
    this.isLicenses = isLicenses;
    this.isInsurance = isInsurance;
    this.isStatutoryPayment = isStatutoryPayment;
    this.isRenovation = isRenovation;
    this.isRepair = isRepair;
    this.isLegalNotice = isLegalNotice;
    this.isEbDetails = isEbDetails;
    this.isAmentiesCreate = isAmentiesCreate;
    this.isOccupancyCreate = isOccupancyCreate;
    this.isLicenseDetailsCreate = isLicenseDetailsCreate;
    this.isInusranceCreate = isInusranceCreate;
    this.isStatutoryPaymentCreate = isStatutoryPaymentCreate;
    this.isRenovationCreate = isRenovationCreate;
    this.isRepairCreate = isRepairCreate;
    this.isLegalNoticeCreate = isLegalNoticeCreate;
    this.isebDetailsCreate = isebDetailsCreate;
    this.isAgreement = isAgreement;
    this.isAgreementCreate = isAgreementCreate;
    this.isEbAdvance = isEbAdvance;
    this.isEbAdvanceCreate = isEbAdvanceCreate;
    this.isRepairDetails = isRepairDetails;
    this.isRepairDetailsCreate = isRepairDetailsCreate;
    this.isBankDetails = isBankDetails;
    this.isBankDetailsCreate = isBankDetailsCreate
    this.isBankDetailsDelete = isBankDetailsDelete
    this.isPremiseDetails = isPremiseDetails;
    this.isPremiseDetailsCreate = isPremiseDetailsCreate;
    this.isDocument = isDocument;
    this.isDocumentCreate = isDocumentCreate;
    this.isLandLordDetailsCreate = isLandLordDetailsCreate;
    this.isLandLordDetails = isLandLordDetails;
    this.isLegalClearance = isLegalClearance;
    this.isLegalClearanceCreate = isLegalClearanceCreate;
    this.isAmentiesDelete = isAmentiesDelete;
    this.isOccupancyDelete = isOccupancyDelete;
    this.isAgreementDelete = isAgreementDelete;
    this.isLegalNoticeDelete = isLegalNoticeDelete;
    this.isInusranceDelete = isInusranceDelete;
    this.isLicenseDetailsDelete = isLicenseDetailsDelete;
    this.isPremiseDetailsDelete = isPremiseDetailsDelete;
    this.isRenovationDelete = isRenovationDelete;
    this.isStatutoryPaymentDelete = isStatutoryPaymentDelete;
    this.isLegalClearanceDelete = isLegalClearanceDelete;
    this.isLandLordDelete = isLandLordDelete;
    this.isEbDetailsDelete = isEbDetailsDelete;
    this.isDocumentDelete = isDocumentDelete;
    this.isRepairDelete = isRepairDelete;
    this.isRepairDetailsDelete = isRepairDetailsDelete;
    this.isEbAdvanceDelete = isEbAdvanceDelete;
    this.isRentSchedule = isRentSchedule;
    this.isRentScheduleCreate = isRentScheduleCreate;
    this.isRentScheduleDelete = isRentScheduleDelete;
    this.isPremises = isPremises;
  }


  backPage() {
    this.router.navigate(['/rems/premiseView'], { skipLocationChange: true })
  }

  getModificationView() {
    this.remsService2.getModificationViewAddRenewal(this.premiseViewId, this.request_status)
      .subscribe((results) => {
        this.modificationData = results.data
        console.log("ModificatoiChanges.... ", this.modificationData)
        if(this.premisViewData.requeststatus == "RENEWAL"){
          this.agreementModiData = results.data;
          console.log("renewal-agreement",this.agreementModiData)
        } else {
        this.modificationData.forEach(element => {

          if(element.type_name == "EBDETAILS"){
            this.getpremiseseb_modification()

          }

          if (element.action == 1 && element.type_name == "EBDETAILS") {
            // let data = {
            //   modify_data: "NEW DATA"
            // }
            // let json = Object.assign({}, data, element.data)
            // this.ebDetailsModiData.push(json);


          } else if (element.action == 0 && element.type_name == "EBDETAILS") {
            // let data = {
            //   modify_data: "Delete"
            // }
            // let json = Object.assign({}, data, element.data)
            // this.ebDetailsModiData.push(json);
           

          } else if (element.action == 2 && element.type_name == "EBDETAILS") {
            // let data = {
            //   modify_data: "MODIFY DATA",
            //   old_data: element.old_data
            // }
            // let json = Object.assign({}, data, element.new_data)
            // this.ebDetailsModiData.push(json);
          } else if (element.action == 2 && element.type_name == "AMENTIES") {
            let data = {
              modify_data: "MODIFY DATA",
              old_data: element.old_data
            }
            let json = Object.assign({}, data, element.new_data)
            this.amenitiesModiData.push(json);
          } else if (element.action == 1 && element.type_name == "AMENTIES") {
            let data = {
              modify_data: "NEW DATA"
            }
            let json = Object.assign({}, data, element.data)
            this.amenitiesModiData.push(json);
          } else if (element.action == 0 && element.type_name == "AMENTIES") {
            let data = {
              modify_data: "Delete"
            }
            let json = Object.assign({}, data, element.data)
            this.amenitiesModiData.push(json);
          } else if (element.action == 2 && element.type_name == "OCCUPANCY") {
            let data = {
              modify_data: "MODIFY DATA",
              old_data: element.old_data
            }
            let json = Object.assign({}, data, element.new_data)
            this.occupancyModiData.push(json);
            console.log('viewn ',this.occupancyModiData)

          } else if (element.action == 1 && element.type_name == "OCCUPANCY") {
            let data = {
              modify_data: "NEW DATA"
            }
            let json = Object.assign({}, data, element.data)
            this.occupancyModiData.push(json);
            console.log('viewn ',this.occupancyModiData)

          } else if (element.action == 0 && element.type_name == "OCCUPANCY") {
            let data = {
              modify_data: "Delete"
            }
            let json = Object.assign({}, data, element.data)
            this.occupancyModiData.push(json);
            console.log('viewn ',this.occupancyModiData)

          } else if (element.action == 2 && element.type_name == "STATUTORYPAYMENT") {
            let data = {
              modify_data: "MODIFY DATA",
              old_data: element.old_data
            }
            let json = Object.assign({}, data, element.new_data)
            this.statutoryPaymentModiData.push(json);
          } else if (element.action == 1 && element.type_name == "STATUTORYPAYMENT") {
            let data = {
              modify_data: "NEW DATA"
            }
            let json = Object.assign({}, data, element.data)
            this.statutoryPaymentModiData.push(json);
          } else if (element.action == 0 && element.type_name == "STATUTORYPAYMENT") {
            let data = {
              modify_data: "Delete"
            }
            let json = Object.assign({}, data, element.data)
            this.statutoryPaymentModiData.push(json);
          } else if (element.action == 2 && element.type_name == "LICENSE DETAILS") {
            let data = {
              modify_data: "MODIFY DATA",
              old_data: element.old_data
            }
            let json = Object.assign({}, data, element.new_data)
            this.licenseDetailsModiData.push(json);
          } else if (element.action == 1 && element.type_name == "LICENSE DETAILS") {
            let data = {
              modify_data: "NEW DATA"
            }
            let json = Object.assign({}, data, element.data)
            this.licenseDetailsModiData.push(json);
          } else if (element.action == 0 && element.type_name == "LICENSE DETAILS") {
            let data = {
              modify_data: "Delete"
            }
            let json = Object.assign({}, data, element.data)
            this.licenseDetailsModiData.push(json);
          } else if (element.action == 2 && element.type_name == "REPAIRMAINTENANCE") {
            let data = {
              modify_data: "MODIFY DATA",
              old_data: element.old_data
            }
            let json = Object.assign({}, data, element.new_data)
            this.repairModiData.push(json);
          } else if (element.action == 1 && element.type_name == "REPAIRMAINTENANCE") {
            let data = {
              modify_data: "NEW DATA"
            }
            let json = Object.assign({}, data, element.data)
            this.repairModiData.push(json);
          } else if (element.action == 0 && element.type_name == "REPAIRMAINTENANCE") {
            let data = {
              modify_data: "Delete"
            }
            let json = Object.assign({}, data, element.data)
            this.repairModiData.push(json);
          } else if (element.action == 2 && element.type_name == "RENOVATION") {
            let data = {
              modify_data: "MODIFY DATA",
              old_data: element.old_data
            }
            let json = Object.assign({}, data, element.new_data)
            this.renovationModiData.push(json);
          } else if (element.action == 1 && element.type_name == "RENOVATION") {
            let data = {
              modify_data: "NEW DATA"
            }
            let json = Object.assign({}, data, element.data)
            this.renovationModiData.push(json);
          } else if (element.action == 0 && element.type_name == "RENOVATION") {
            let data = {
              modify_data: "Delete"
            }
            let json = Object.assign({}, data, element.data)
            this.renovationModiData.push(json);
          } else if (element.action == 2 && element.type_name == "INSURANCE DETAILS") {
            let data = {
              modify_data: "MODIFY DATA",
              old_data: element.old_data
            }
            let json = Object.assign({}, data, element.new_data)
            this.insuranceDetailsModiData.push(json);
          } else if (element.action == 1 && element.type_name == "INSURANCE DETAILS") {
            let data = {
              modify_data: "NEW DATA"
            }
            let json = Object.assign({}, data, element.data)
            this.insuranceDetailsModiData.push(json);
          } else if (element.action == 0 && element.type_name == "INSURANCE DETAILS") {
            let data = {
              modify_data: "Delete"
            }
            let json = Object.assign({}, data, element.data)
            this.insuranceDetailsModiData.push(json);
          } else if (element.action == 2 && element.type_name == "LEGALNOTICETYPE") {
            let data = {
              modify_data: "MODIFY DATA",
              old_data: element.old_data
            }
            let json = Object.assign({}, data, element.new_data)
            this.statutoryNoticeModiData.push(json);
          } else if (element.action == 1 && element.type_name == "LEGALNOTICETYPE") {
            let data = {
              modify_data: "NEW DATA"
            }
            let json = Object.assign({}, data, element.data)
            this.statutoryNoticeModiData.push(json);
          } else if (element.action == 0 && element.type_name == "LEGALNOTICETYPE") {
            let data = {
              modify_data: "Delete"
            }
            let json = Object.assign({}, data, element.data)
            this.statutoryNoticeModiData.push(json);
          } else if (element.action == 2 && element.type_name == "LEASEAGREEMENT") {
            let data = {
              modify_data: "MODIFY DATA",
              old_data: element.old_data
            }
            let json = Object.assign({}, data, element.new_data)
            this.agreementModiData.push(json);
          } else if (element.action == 1 && element.type_name == "LEASEAGREEMENT") {
            let data = {
              modify_data: "NEW DATA"
            }
            let json = Object.assign({}, data, element.data)
            this.agreementModiData.push(json);
          } else if (element.action == 0 && element.type_name == "LEASEAGREEMENT") {
            let data = {
              modify_data: "Delete"
            }
            let json = Object.assign({}, data, element.data)
            this.agreementModiData.push(json);
          } else if (element.action == 2 && element.type_name == "LANDLORD BANK DETAILS") {
            let data = {
              modify_data: "MODIFY DATA",
              old_data: element.old_data
            }
            let json = Object.assign({}, data, element.new_data)
            this.bankDetailsModiData.push(json);
          } else if (element.action == 1 && element.type_name == "LANDLORD BANK DETAILS") {
            let data = {
              modify_data: "NEW DATA"
            }
            let json = Object.assign({}, data, element.data)
            this.bankDetailsModiData.push(json);
          } else if (element.action == 0 && element.type_name == "LANDLORD BANK DETAILS") {
            let data = {
              modify_data: "Delete"
            }
            let json = Object.assign({}, data, element.data)
            this.bankDetailsModiData.push(json);
          } else if (element.action == 2 && element.type_name == "REPAIR MAINTENANCE DETAILS") {
            let data = {
              modify_data: "MODIFY DATA",
              old_data: element.old_data
            }
            let json = Object.assign({}, data, element.new_data)
            this.repairDetailsModiData.push(json);
          } else if (element.action == 1 && element.type_name == "REPAIR MAINTENANCE DETAILS") {
            let data = {
              modify_data: "NEW DATA"
            }
            let json = Object.assign({}, data, element.data)
            this.repairDetailsModiData.push(json);
          } else if (element.action == 0 && element.type_name == "REPAIR MAINTENANCE DETAILS") {
            let data = {
              modify_data: "Delete"
            }
            let json = Object.assign({}, data, element.data)
            this.repairDetailsModiData.push(json);
          } else if (element.action == 2 && element.type_name == "EBADVANCE") {
            let data = {
              modify_data: "MODIFY DATA",
              old_data: element.old_data
            }
            let json = Object.assign({}, data, element.new_data)
            this.ebAdvanceModiData.push(json);
          } else if (element.action == 1 && element.type_name == "EBADVANCE") {
            let data = {
              modify_data: "NEW DATA"
            }
            let json = Object.assign({}, data, element.data)
            this.ebAdvanceModiData.push(json);
          } else if (element.action == 0 && element.type_name == "EBADVANCE") {
            let data = {
              modify_data: "Delete"
            }
            let json = Object.assign({}, data, element.data)
            this.ebAdvanceModiData.push(json);
          } else if (element.action == 2 && element.type_name == "PREMISE DETAILS") {
            let data = {
              modify_data: "MODIFY DATA",
              old_data: element.old_data
            }
            let json = Object.assign({}, data, element.new_data)
            this.premiseDetailsModiData.push(json);
          } else if (element.action == 1 && element.type_name == "PREMISE DETAILS") {
            let data = {
              modify_data: "NEW DATA"
            }
            let json = Object.assign({}, data, element.data)
            this.premiseDetailsModiData.push(json);
          } else if (element.action == 0 && element.type_name == "PREMISE DETAILS") {
            let data = {
              modify_data: "Delete"
            }
            let json = Object.assign({}, data, element.data)
            this.premiseDetailsModiData.push(json);
          }


          else if (element.action == 2 && element.type_name == "PREMISE DOCUMENT") {
            let data = {
              modify_data: "MODIFY DATA",
              old_data: element.old_data
            }
            let json = Object.assign({}, data, element.new_data)
            this.documentModiData.push(json);
          } else if (element.action == 1 && element.type_name == "PREMISE DOCUMENT") {
            let data = {
              modify_data: "NEW DATA"
            }
            let json = Object.assign({}, data, element.data)
            this.documentModiData.push(json);
          } else if (element.action == 0 && element.type_name == "PREMISE DOCUMENT") {
            let data = {
              modify_data: "Delete"
            }
            let json = Object.assign({}, data, element.data)
            this.documentModiData.push(json);
          } else if (element.action == 2 && element.type_name == "LANDLORD DETAILS") {
            let data = {
              modify_data: "MODIFY DATA",
              old_data: element.old_data
            }
            let json = Object.assign({}, data, element.new_data)
            this.landlorDetailsModiData.push(json);
          } else if (element.action == 1 && element.type_name == "LANDLORD DETAILS") {
            let data = {
              modify_data: "NEW DATA"
            }
            let json = Object.assign({}, data, element.data)
            this.landlorDetailsModiData.push(json);
          } else if (element.action == 0 && element.type_name == "LANDLORD DETAILS") {
            let data = {
              modify_data: "Delete"
            }
            let json = Object.assign({}, data, element.data)
            this.landlorDetailsModiData.push(json);
          } else if (element.action == 2 && element.type_name == "LEGALCLEARANCE") {
            let data = {
              modify_data: "MODIFY DATA",
              old_data: element.old_data
            }
            let json = Object.assign({}, data, element.new_data)
            this.legalClearanceModiData.push(json);
          } else if (element.action == 1 && element.type_name == "LEGALCLEARANCE") {
            let data = {
              modify_data: "NEW DATA"
            }
            let json = Object.assign({}, data, element.data)
            this.legalClearanceModiData.push(json);
          } else if (element.action == 0 && element.type_name == "LEGALCLEARANCE") {
            let data = {
              modify_data: "Delete"
            }
            let json = Object.assign({}, data, element.data)
            this.legalClearanceModiData.push(json);
          } else if (element.action == 2 && element.type_name == "RENTSCHEDULE") {
            let data = {
              modify_data: "MODIFY DATA",
              old_data: element.old_data
            }
            let json = Object.assign({}, data, element.new_data)
            this.rentScheduleModiData.push(json);
          } else if (element.action == 1 && element.type_name == "RENTSCHEDULE") {
            let data = {
              modify_data: "NEW DATA"
            }
            let json = Object.assign({}, data, element.data)
            this.rentScheduleModiData.push(json);
          } else if (element.action == 0 && element.type_name == "RENTSCHEDULE") {
            let data = {
              modify_data: "Delete"
            }
            let json = Object.assign({}, data, element.data)
            this.rentScheduleModiData.push(json);
          } else if (element.action == 2 && element.type_name == "PREMISE") {
            let data = {
              modify_data: "MODIFY DATA",
              old_data: element.old_data
            }
            let json = Object.assign({}, data, element.new_data)
            this.premisesModiData.push(json);
          }
        });
      }
      })
  }

  licenses(data, id) {
    this.licenseDetailsData = data;
    this.licenseDetailsModiOldData = data.old_data;
    if (this.licenseDetailsData.modify_data == "NEW DATA" && this.licenseDetailsData.id == id) {
      this.isLicenses = false;
      this.isLicenseDetailsCreate = true;
      this.isLicenseDetailsDelete = false;
    } else if (this.licenseDetailsData.modify_data == "MODIFY DATA" && this.licenseDetailsData.id == id) {
      this.isLicenses = true;
      this.isLicenseDetailsDelete = false;
      this.isLicenseDetailsCreate = false;
    } else if (this.licenseDetailsData.modify_data == "Delete" && this.licenseDetailsData.id == id) {
      this.isLicenses = false;
      this.isLicenseDetailsDelete = true;
      this.isLicenseDetailsCreate = false;
    }
  }
  popUpClose() {
    this.isLicenseDetailsCreate = false;
    this.isLicenses = false;
    this.isLicenseDetailsDelete = false;
    this.isAgreement = false;
    this.isAgreementCreate = false;
    this.isAgreementDelete = false;
    this.isAmentiesDelete = false;
    this.isAmenties = false;
    this.isAmentiesCreate = false;
    this.isPremiseDetails = false;
    this.isPremiseDetailsCreate = false;
    this.isPremiseDetailsDelete = false;
    this.isOccupancyDelete = false;
    this.isOccupancy = false;
    this.isOccupancyCreate = false;
    this.isLegalNoticeDelete = false;
    this.isLegalNotice = false;
    this.isLegalNoticeCreate = false;
    this.isLegalClearanceDelete = false;
    this.isRepairDetails = false;
    this.isRepairDetailsCreate = false;
    this.isBankDetails = false;
    this.isBankDetailsCreate = false;
    this.isBankDetailsDelete = false;
    this.isRenovation = false;
    this.isRenovationCreate = false;
    this.isStatutoryPaymentCreate = false;
    this.isStatutoryPayment = false;
    this.isStatutoryPaymentDelete = false;
    this.isEbDetailsDelete = false;
    this.isEbDetails = false;
    this.isebDetailsCreate = false;
    this.isEbAdvance = false;
    this.isEbAdvanceDelete = false;
    this.isEbAdvanceCreate = false;
    this.isInsurance = false;
    this.isInusranceDelete = false;
    this.isInusranceCreate = false;
    this.isLegalClearanceDelete = false;
    this.isLandLordDetails = false;
    this.isLandLordDetailsCreate = false;
    this.isDocument = false;
    this.isDocumentCreate = false;
    this.isLegalClearance = false;
    this.isLegalClearanceCreate = false;
    this.isRentSchedule = false;
    this.isRentScheduleCreate = false;
    this.isRentScheduleDelete = false;
    this.isRepair = false;
    this.isRepairCreate = false;
    this.isRepairDelete = false;
    this.isPremises = false;
    this.isLandLordDelete = false;
    this.isRepairDetailsDelete = false
  }
  occupancys(data, id) {
    this.occupancyData = data;
    this.occupancyModiOldData = data.old_data;
    if (this.occupancyData.modify_data == "NEW DATA" && this.occupancyData.id == id) {
      this.isOccupancyCreate = true;
      this.isOccupancy = false;
      this.isOccupancyDelete = false;
    } else if (this.occupancyData.modify_data == "MODIFY DATA" && this.occupancyData.id == id) {
      this.isOccupancy = true;
      this.isOccupancyDelete = false;
      this.isOccupancyCreate = false;
    } else if (this.occupancyData.modify_data == "Delete" && this.occupancyData.id == id) {
      this.isOccupancy = false;
      this.isOccupancyDelete = true;
      this.isOccupancyCreate = false;
    }
  }
  amenties(data, id) {
    this.amenitiesModiOldData = data.old_data
    this.amentiesData = data;
    if (this.amentiesData.modify_data == "NEW DATA" && this.amentiesData.id == id) {
      this.isAmentiesCreate = true;
      this.isAmenties = false;
      this.isAmentiesDelete = false;
    } else if (this.amentiesData.modify_data == "MODIFY DATA" && this.amentiesData.id == id) {
      this.isAmentiesDelete = false;
      this.isAmenties = true;
      this.isAmentiesCreate = false;
    } else if (this.amentiesData.modify_data == "Delete" && this.amentiesData.id == id) {
      this.isAmenties = false;
      this.isAmentiesDelete = true;
      this.isAmentiesCreate = false;
    }
  }

  ebDetail(data, id) {
    this.ebDetailsModiOldData = data.old_data;
    this.ebDetailsData = data;
    if (this.ebDetailsData.action != 2  && this.ebDetailsData.id == id) {
      this.isEbDetails = false;
      this.isebDetailsCreate = true;
      this.isEbDetailsDelete = false;
    } else if (this.ebDetailsData.action == 2 && this.ebDetailsData.id == id) {
      this.isEbDetails = true;
      this.isebDetailsCreate = false;
      this.isEbDetailsDelete = false;
    }
    // else if (this.ebDetailsData.modify_data == "Delete" && this.ebDetailsData.id == id) {
    //   this.isEbDetails = false;
    //   this.isEbDetailsDelete = true;
    //   this.isebDetailsCreate = false;
    // }
  }

  ebAdvance(data, id) {
    this.ebAdvanceModiOldData = data.old_data;
    this.ebAdvanceData = data;
    if (this.ebAdvanceData.modify_data == "NEW DATA" && this.ebAdvanceData.id == id) {
      this.isEbAdvance = false;
      this.isEbAdvanceDelete = false;
      this.isEbAdvanceCreate = true;
    } else if (this.ebAdvanceData.modify_data == "MODIFY DATA" && this.ebAdvanceData.id == id) {
      this.isEbAdvance = true;
      this.isEbAdvanceDelete = false;
      this.isEbAdvanceCreate = false;
    } else if (this.ebAdvanceData.modify_data == "Delete" && this.ebAdvanceData.id == id) {
      this.isEbAdvance = false;
      this.isEbAdvanceDelete = true;
      this.isEbAdvanceCreate = false;
    }
  }

  statutory(data, id) {
    this.legalNoticeData = data;
    this.statutoryNoticeModiOldData = data.old_data;
    if (this.legalNoticeData.modify_data == "NEW DATA" && this.legalNoticeData.id == id) {
      this.isLegalNotice = false;
      this.isLegalNoticeCreate = true;
      this.isLegalNoticeDelete = false;
    } else if (this.legalNoticeData.modify_data == "MODIFY DATA" && this.legalNoticeData.id == id) {
      this.isLegalNotice = true;
      this.isLegalNoticeDelete = false;
      this.isLegalNoticeCreate = false;
    } else if (this.legalNoticeData.modify_data == "Delete" && this.legalNoticeData.id == id) {
      this.isLegalNotice = false;
      this.isLegalNoticeDelete = false;
      this.isLegalNoticeCreate = true;
    }
  }

  repairs(data, id) {
    this.repairModiOldData = data.old_data;
    this.repairMaintanceDatas = data;
    if (this.repairMaintanceDatas.modify_data == "NEW DATA" && this.repairMaintanceDatas.id == id) {
      this.isRepair = false;
      this.isRepairCreate = true;
      this.isRepairDelete = false;
    } else if (this.repairMaintanceDatas.modify_data == "MODIFY DATA" && this.repairMaintanceDatas.id == id) {
      this.isRepair = true;
      this.isRepairDelete = false;
      this.isRepairCreate = false;
    } else if (this.repairMaintanceDatas.modify_data == "Delete" && this.repairMaintanceDatas.id == id) {
      this.isRepair = false;
      this.isRepairDelete = true;
      this.isRepairCreate = false;
    }
  }


  insurance(data, id) {
    this.insuranceDetailsModiOldData = data.old_data;
    this.insuranceDetailsData = data;
    if (this.insuranceDetailsData.modify_data == "NEW DATA" && this.insuranceDetailsData.id == id) {
      this.isInsurance = false;
      this.isInusranceCreate = true;
      this.isInusranceDelete = false;
    } else if (this.insuranceDetailsData.modify_data == "MODIFY DATA" && this.insuranceDetailsData.id == id) {
      this.isInsurance = true;
      this.isInusranceDelete = false;
      this.isInusranceCreate = false;
    } else if (this.insuranceDetailsData.modify_data == "Delete" && this.insuranceDetailsData.id == id) {
      this.isInsurance = false;
      this.isInusranceDelete = true;
      this.isInusranceCreate = false;
    }
  }
  renovations(data, id) {
    this.renovationData = data;
    this.renovationModiOldData = data.old_data;
    if (this.renovationData.modify_data == "NEW DATA" && this.renovationData.id == id) {
      this.isRenovation = false;
      this.isRenovationCreate = true;
      this.isRenovationDelete = false;
    } else if (this.renovationData.modify_data == "MODIFY DATA" && this.renovationData.id == id) {
      this.isRenovation = true;
      this.isRenovationDelete = false;
      this.isRenovationCreate = false;
    } else if (this.renovationData.modify_data == "Delete" && this.renovationData.id == id) {
      this.isRenovation = false;
      this.isRenovationDelete = true;
      this.isRenovationCreate = false;
    }
  }

  statutoryPayment(data, id) {
    this.statutoryPaymentData = data;
    this.statutoryPaymentModiOldData = data.old_data;
    if (this.statutoryPaymentData.modify_data == "NEW DATA" && this.statutoryPaymentData.id == id) {
      this.isStatutoryPayment = false;
      this.isStatutoryPaymentCreate = true;
      this.isStatutoryPaymentDelete = false;
    } else if (this.statutoryPaymentData.modify_data == "MODIFY DATA" && this.statutoryPaymentData.id == id) {
      this.isStatutoryPayment = true;
      this.isStatutoryPaymentDelete = false;
      this.isStatutoryPaymentCreate = false;
    } else if (this.statutoryPaymentData.modify_data == "Delete" && this.statutoryPaymentData.id == id) {
      this.isStatutoryPayment = false;
      this.isStatutoryPaymentDelete = false;
      this.isStatutoryPaymentCreate = true;
    }
  }


  agreementView(data, id) {
    this.agreementModiOldData = data.old_data;
    this.leaseAgreementData = data;
    if(this.premisViewData.requeststatus == "RENEWAL"){
      this.isAgreementCreate = true;
    }
    if (this.leaseAgreementData.modify_data == "NEW DATA" && this.leaseAgreementData.id == id) {
      this.isAgreement = false;
      this.isAgreementCreate = true;
      this.isAgreementDelete = false;
    } else if (this.leaseAgreementData.modify_data == "MODIFY DATA" && this.leaseAgreementData.id == id) {
      this.isAgreement = true;
      this.isAgreementDelete = false;
      this.isAgreementCreate = false;
    } else if (this.leaseAgreementData.modify_data == "Delete" && this.leaseAgreementData.id == id) {
      this.isAgreementDelete = true;
      this.isAgreement = false;
      this.isAgreementCreate = false;
    }
  }

  repairDetails(data, id) {
    this.repairDetailsData = data;
    this.repairDetailsModiOldData = data.old_data;
    if (this.repairDetailsData.modify_data == "NEW DATA" && this.repairDetailsData.id == id) {
      this.isRepairDetails = false;
      this.isRepairDetailsDelete = false;
      this.isRepairDetailsCreate = true;
    } else if (this.repairDetailsData.modify_data == "MODIFY DATA" && this.repairDetailsData.id == id) {
      this.isRepairDetails = true;
      this.isRepairDetailsDelete = false;
      this.isRepairDetailsCreate = false;
    } else if (this.repairDetailsData.modify_data == "Delete" && this.repairDetailsData.id == id) {
      this.isRepairDetails = false;
      this.isRepairDetailsDelete = true;
      this.isRepairDetailsCreate = false;
    }
  }


  bankDetails(data, id) {
    this.bankDetailsModiOldData = data.old_data;
    this.bankDetailsData = data;
    if (this.bankDetailsData.modify_data == "NEW DATA" && this.bankDetailsData.id == id) {
      this.isBankDetails = false;
      this.isBankDetailsCreate = true;
      this.isBankDetailsDelete = false;
    } else if (this.bankDetailsData.modify_data == "MODIFY DATA" && this.bankDetailsData.id == id) {
      this.isBankDetails = true;
      this.isBankDetailsDelete = false;
      this.isBankDetailsCreate = false;
    } else if (this.bankDetailsData.modify_data == "Delete" && this.bankDetailsData.id == id) {
      this.isBankDetails = false;
      this.isBankDetailsDelete = true;
      this.isBankDetailsCreate = false;
    }
  }


  premisesDetails(data, id) {
    this.premiseDetailsModiOldData = data.old_data;
    this.premiseDetailsData = data;
    if (this.premiseDetailsData.modify_data == "NEW DATA" && this.premiseDetailsData.id == id) {
      this.isPremiseDetails = false;
      this.isPremiseDetailsCreate = true;
      this.isPremiseDetailsDelete = false;
    } else if (this.premiseDetailsData.modify_data == "MODIFY DATA" && this.premiseDetailsData.id == id) {
      this.isPremiseDetailsDelete = false;
      this.isPremiseDetails = true;
      this.isPremiseDetailsCreate = false;
    } else if (this.premiseDetailsData.modify_data == "Delete" && this.premiseDetailsData.id == id) {
      this.isPremiseDetails = false;
      this.isPremiseDetailsDelete = true;
      this.isPremiseDetailsCreate = false;
    }
  }


  documents(data, id) {
    this.documentModiOlData = data.old_data;
    this.documentData = data;
    if (this.documentData.modify_data == "NEW DATA" && this.documentData.id == id) {
      this.isDocument = false;
      this.isDocumentDelete = false;
      this.isDocumentCreate = true;
    } else if (this.documentData.modify_data == "MODIFY DATA" && this.documentData.id == id) {
      this.isDocumentDelete = false;
      this.isDocument = true;
      this.isDocumentCreate = false;
    } else if (this.documentData.modify_data == "Delete" && this.documentData.id == id) {
      this.isDocument = false;
      this.isDocumentDelete = false;
      this.isDocumentCreate = true;
    }
  }
  landLordDetails(data, id) {
    this.landlordDetailsModiOlData = data.old_data;
    this.landlordDetailsData = data;
    if (this.landlordDetailsData.modify_data == "NEW DATA" && this.landlordDetailsData.id == id) {
      this.isLandLordDelete = false;
      this.isLandLordDetailsCreate = true;
      this.isLandLordDetails = false;
    } else if (this.landlordDetailsData.modify_data == "MODIFY DATA" && this.landlordDetailsData.id == id) {
      this.isLandLordDelete = false;
      this.isLandLordDetailsCreate = false;
      this.isLandLordDetails = true;
    } else if (this.landlordDetailsData.modify_data == "Delete" && this.landlordDetailsData.id == id) {
      this.isLandLordDelete = true;
      this.isLandLordDetailsCreate = false;
      this.isLandLordDetails = false;
    }
  }


  legalClearance(data, id) {
    this.legalClearanceModiOldData = data.old_data;
    this.legalClearanceData = data;
    if (this.legalClearanceData.modify_data == "NEW DATA" && this.legalClearanceData.id == id) {
      this.isLegalNoticeDelete = false;
      this.isLegalClearance = false;
      this.isLegalClearanceCreate = true;
    } else if (this.legalClearanceData.modify_data == "MODIFY DATA" && this.legalClearanceData.id == id) {
      this.isLegalNoticeDelete = false;
      this.isLegalClearance = true;
      this.isLegalClearanceCreate = false;
    } else if (this.legalClearanceData.modify_data == "Delete" && this.legalClearanceData.id == id) {
      this.isLegalNoticeDelete = true;
      this.isLegalClearance = false;
      this.isLegalClearanceCreate = false;
    }
  }

  rentSchedule(data, id) {
    this.rentScheduleModiOldData = data.old_data;
    this.rentScheduleData = data;
    if (this.rentScheduleData.modify_data == "NEW DATA" && this.rentScheduleData.id == id) {
      this.isRentScheduleDelete = false;
      this.isRentSchedule = false;
      this.isRentScheduleCreate = true;
    } else if (this.rentScheduleData.modify_data == "MODIFY DATA" && this.rentScheduleData.id == id) {
      this.isRentScheduleDelete = false;
      this.isRentSchedule = true;
      this.isRentScheduleCreate = false;
    } else if (this.rentScheduleData.modify_data == "Delete" && this.rentScheduleData.id == id) {
      this.isRentScheduleDelete = true;
      this.isRentSchedule = false;
      this.isRentScheduleCreate = false;
    }
  }

  premises(data, id) {
    this.premisesModiOldData = data.old_data;
    this.premisesData = data;
    if (this.premisesData.modify_data == "MODIFY DATA" && this.premisesData.id == id) {
      this.isPremises = true;
    }
  }

  getpremiseseb_modification(){
    let data: any = this.remsshareService.PremiseView.value;
    

    this.remsService.getebmodificationsummary(data.id).subscribe(
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
            let assign = Object.assign(element.new_data, {action: element.action,old_data:element.old_data})
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
          console.log('eb details ',this.ebDetailsModiData)
      })
    })
    
  }

}
