import { Component, OnInit } from '@angular/core';
import { Rems2Service } from '../rems2.service'
import { RemsShareService } from '../rems-share.service'
import { Router, ActivatedRoute } from '@angular/router';
import { RemsService } from '../rems.service';
import { NotificationService } from '../notification.service';
import { SharedService } from '../../service/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modification-summary',
  templateUrl: './modification-summary.component.html',
  styleUrls: ['./modification-summary.component.scss']
})
export class ModificationSummaryComponent implements OnInit {
  amenitiesModiData = [];
  statutoryPaymentModiData = [];
  occupancyModiData = [];
  licenseDetailsModiData = [];
  repairModiData = [];
  renovationModiData = [];
  statutoryNoticeModiData = [];
  insuranceDetailsModiData = [];
  leaseAgreementModiData = [];
  leaseAgreementRenewalData: any;
  premisesDetailsModiData = [];
  legalClearanceModidata = [];
  landlordModidata = [];
  DocumentModidata = [];
  premiseViewId: string;
  isOccupancyTable: boolean;
  isAgreementTable: boolean;
  isAmenitiesTable: boolean;
  isLandlordTable: boolean;
  isLegalClearanceTable: boolean;
  isLegalNoticeTable: boolean;
  isLicenseTable: boolean;
  isDocumentTable: boolean;
  isPremiseDetailsTable: boolean;
  isStatutoryTable: boolean;
  isEbDetailsTable: boolean;
  isInsuranceTable: boolean;
  isRenovationTable: boolean;
  isRepairMaintanceTable: boolean;
  paramsData = "";
  premisViewData: any;
  premisType: string;
  isLeased: boolean;
  isOwned: boolean;
  tokenValues: any
  urlTypes: string;
  pdfUrls: string;
  imageUrl = environment.apiURL
  jpgUrls: string;
  isImages: boolean
  isEditBtn: boolean;
  isEditEbBtn:boolean;
  request_status: any;
  constructor(private remsService2: Rems2Service, private remsshareService: RemsShareService,
    private route: ActivatedRoute, private router: Router, private remsService: RemsService,
    private notification: NotificationService, private shareService: SharedService,
  ) { }

  ngOnInit(): void {
    this.premisViewData = this.remsshareService.modificationView.value;
    this.premiseViewId = this.premisViewData.id
    this.premisType = this.premisViewData?.type.text;
    this.request_status = this.premisViewData.requeststatus
    this.getModificationView();
    if (this.premisViewData.requeststatus == "MODIFICATION") {
      this.isOccupancyTable = true;
    }
    let datas = this.shareService.menuUrlData.filter(rolename => rolename.name == 'REMS');
    datas.forEach((data) => {
      let roleValues = data.role[0].name;
      if (roleValues === "Maker" && this.premisViewData.premise_status == "DRAFT") {
        this.isEditBtn = true;
        this.isEditEbBtn=true;
      } if (roleValues === "Maker" && this.premisViewData.premise_status == "PENDING_CHECKER") {
        this.isEditBtn = false;
      }
    });

  }

  getQueryParams() {
    this.route.queryParams.subscribe(params => {
      this.paramsData = params.status;
      if (this.paramsData == "Occupancy Details") {
        this.isOccupancyTable = true;
      } else if (this.paramsData == "Statutory Payments") {
        this.isOccupancyTable = false;
      } else if (this.paramsData == "Amenities & Infrastructure") {
        this.isOccupancyTable = false;
      } else if (this.paramsData == "EB Details") {
        this.isOccupancyTable = false;
      } else if (this.paramsData == "Licenses & Certificate") {
        this.isOccupancyTable = false;
      } else if (this.paramsData == "Repairs & Maintenance") {
        this.isOccupancyTable = false;
      } else if (this.paramsData == "Renovations & Additions") {
        this.isOccupancyTable = false;
      } else if (this.paramsData == "Insurance Details") {
        this.isOccupancyTable = false;
      } else if (this.paramsData == "Legal & Statutory Notice") {
        this.isOccupancyTable = false;
      } else if (this.paramsData == "Agreement and Rent") {
        this.isOccupancyTable = false;
      } else if (this.paramsData == "Premise Details") {
        this.isOccupancyTable = false;
      } else if (this.paramsData == "Legal Clearance") {
        this.isOccupancyTable = false;
      } else if (this.paramsData == "Documents") {
        this.isOccupancyTable = false;
      } else if (this.paramsData == "Landlord Details") {
        this.isOccupancyTable = false;
      }
    })
  }

  getModificationView() {
    this.remsService2.getModificationViewAddRenewal(this.premiseViewId,this.request_status)
      .subscribe((results) => {
        this.getQueryParams();
        let datas = results.data
        console.log("Modificatoi ", datas)
        this.amenitiesModiData = [];
        this.statutoryPaymentModiData = [];
        this.occupancyModiData = [];
        this.licenseDetailsModiData = [];
        this.repairModiData = [];
        this.renovationModiData = [];
        this.statutoryNoticeModiData = [];
        this.insuranceDetailsModiData = [];
        this.leaseAgreementModiData = [];
        this.premisesDetailsModiData = [];
        this.legalClearanceModidata = [];
        this.landlordModidata = [];
        this.DocumentModidata = [];

        if(this.premisViewData.requeststatus == "RENEWAL"){
          this.leaseAgreementRenewalData = datas;
          console.log("renewal",this.leaseAgreementRenewalData)
        } else {
        datas.forEach(element => {
          if (element.action == 2 && element.type_name == "AMENTIES") {
            let data = {
              modify_data: "Modify"
            }
            let json = Object.assign({}, data, element.new_data)
            this.amenitiesModiData.push(json);
          } else if (element.action == 1 && element.type_name == "AMENTIES") {
            let data = {
              modify_data: "New"
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
              modify_data: "Modify"
            }
            let json = Object.assign({}, data, element.new_data)
            this.occupancyModiData.push(json);
          } else if (element.action == 1 && element.type_name == "OCCUPANCY") {
            let data = {
              modify_data: "New"
            }
            let json = Object.assign({}, data, element.data)
            this.occupancyModiData.push(json);
          } else if (element.action == 0 && element.type_name == "OCCUPANCY") {
            let data = {
              modify_data: "Delete"
            }
            let json = Object.assign({}, data, element.data)
            this.occupancyModiData.push(json);
          } else if (element.action == 2 && element.type_name == "STATUTORYPAYMENT") {
            let data = {
              modify_data: "Modify"
            }
            let json = Object.assign({}, data, element.new_data)
            this.statutoryPaymentModiData.push(json);
          } else if (element.action == 1 && element.type_name == "STATUTORYPAYMENT") {
            let data = {
              modify_data: "New"
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
              modify_data: "Modify"
            }
            let json = Object.assign({}, data, element.new_data)
            this.licenseDetailsModiData.push(json);
          } else if (element.action == 1 && element.type_name == "LICENSE DETAILS") {
            let data = {
              modify_data: "New"
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
              modify_data: "Modify"
            }
            let json = Object.assign({}, data, element.new_data)
            this.repairModiData.push(json);
          } else if (element.action == 1 && element.type_name == "REPAIRMAINTENANCE") {
            let data = {
              modify_data: "New"
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
              modify_data: "Modify"
            }
            let json = Object.assign({}, data, element.new_data)
            this.renovationModiData.push(json);
          } else if (element.action == 1 && element.type_name == "RENOVATION") {
            let data = {
              modify_data: "New"
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
              modify_data: "Modify"
            }
            let json = Object.assign({}, data, element.new_data)
            this.insuranceDetailsModiData.push(json);
          } else if (element.action == 1 && element.type_name == "INSURANCE DETAILS") {
            let data = {
              modify_data: "New"
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
              modify_data: "Modify"
            }
            let json = Object.assign({}, data, element.new_data)
            this.statutoryNoticeModiData.push(json);
          } else if (element.action == 1 && element.type_name == "LEGALNOTICETYPE") {
            let data = {
              modify_data: "New"
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
              modify_data: "Modify"
            }
            let json = Object.assign({}, data, element.new_data)
            this.leaseAgreementModiData.push(json);
          } else if (element.action == 1 && element.type_name == "LEASEAGREEMENT") {
            let data = {
              modify_data: "New"
            }
            let json = Object.assign({}, data, element.data)
            this.leaseAgreementModiData.push(json);
          } else if (element.action == 0 && element.type_name == "LEASEAGREEMENT") {
            let data = {
              modify_data: "Delete"
            }
            let json = Object.assign({}, data, element.data)
            this.leaseAgreementModiData.push(json);
          } else if (element.action == 2 && element.type_name == "PREMISE DETAILS") {
            let data = {
              modify_data: "Modify"
            }
            let json = Object.assign({}, data, element.new_data)
            this.premisesDetailsModiData.push(json);
          } else if (element.action == 1 && element.type_name == "PREMISE DETAILS") {
            let data = {
              modify_data: "New"
            }
            let json = Object.assign({}, data, element.data)
            this.premisesDetailsModiData.push(json);
          } else if (element.action == 0 && element.type_name == "PREMISE DETAILS") {
            let data = {
              modify_data: "Delete"
            }
            let json = Object.assign({}, data, element.data)
            this.premisesDetailsModiData.push(json);
          } else if (element.action == 2 && element.type_name == "LEGALCLEARANCE") {
            let data = {
              modify_data: "Modify"
            }
            let json = Object.assign({}, data, element.new_data)
            this.legalClearanceModidata.push(json);
          } else if (element.action == 1 && element.type_name == "LEGALCLEARANCE") {
            let data = {
              modify_data: "New"
            }
            let json = Object.assign({}, data, element.data)
            this.legalClearanceModidata.push(json);
          } else if (element.action == 0 && element.type_name == "LEGALCLEARANCE") {
            let data = {
              modify_data: "Delete"
            }
            let json = Object.assign({}, data, element.data)
            this.legalClearanceModidata.push(json);
          }
          else if (element.action == 2 && element.type_name == "PREMISE DOCUMENT") {
            let data = {
              modify_data: "Modify"
            }
            let json = Object.assign({}, data, element.new_data)
            this.DocumentModidata.push(json);
          } else if (element.action == 1 && element.type_name == "PREMISE DOCUMENT") {
            let data = {
              modify_data: "New"
            }
            let json = Object.assign({}, data, element.data)
            this.DocumentModidata.push(json);
          } else if (element.action == 0 && element.type_name == "PREMISE DOCUMENT") {
            let data = {
              modify_data: "Delete"
            }
            let json = Object.assign({}, data, element.data)
            this.DocumentModidata.push(json);
          }
          else if (element.action == 2 && element.type_name == "LANDLORD DETAILS") {
            let data = {
              modify_data: "Modify"
            }
            let json = Object.assign({}, data, element.new_data)
            this.landlordModidata.push(json);
          } else if (element.action == 1 && element.type_name == "LANDLORD DETAILS") {
            let data = {
              modify_data: "New"
            }
            let json = Object.assign({}, data, element.data)
            this.landlordModidata.push(json);
          } else if (element.action == 0 && element.type_name == "LANDLORD DETAILS") {
            let data = {
              modify_data: "Delete"
            }
            let json = Object.assign({}, data, element.data)
            this.landlordModidata.push(json);
          }

        });


      }
      })

  }

  occupancyEdit(data: any) {
    let premiseid = {
      premiseId: this.premiseViewId
    }
    let jsonData = Object.assign({}, premiseid, data)
    this.remsshareService.occupancyEditValue.next(jsonData);
    this.router.navigate(['/rems/occupancyedit'], { skipLocationChange: true });
  }
  amenitiesEdit(data) {
    this.remsshareService.amenities.next(data)
    this.remsshareService.premiseViewID.next(this.premiseViewId)
    this.router.navigate(['/rems/amenitiesForm'], { skipLocationChange: true });
  }

  statutoryEdit(data) {
    this.remsshareService.statutoryIdValue.next(data);
    this.remsshareService.premiseViewID.next(this.premiseViewId)
    this.router.navigate(['/rems/statutorycreateeditform'], { skipLocationChange: true });
    return data;
  }


  licensesDetailsEdit(data) {
    this.remsshareService.licensedetailsEditValue.next(data);
    this.remsshareService.premiseViewID.next(this.premiseViewId)
    this.router.navigate(['/rems/licensedetailsedit'], { skipLocationChange: true });
  }

  RepairEdit(data: any) {
    this.remsshareService.premiseViewID.next(this.premiseViewId)
    this.remsshareService.repairEditValue.next(data)
    this.router.navigate(['/rems/repairandmaintenanceEdit'], { skipLocationChange: true });
    return data;
  }

  renovationEdit(data) {
    this.remsshareService.renovationForm.next(data)
    this.remsshareService.premiseViewID.next(this.premiseViewId)
    this.router.navigate(['/rems/renovationForm'], { skipLocationChange: true });
  }
  insuranceDetailsEdit(data) {
    this.remsshareService.InsuranceDetailEdit.next(data);
    this.remsshareService.premiseViewID.next(this.premiseViewId)
    this.router.navigate(['/rems/InsurancedetailEdit'], { skipLocationChange: true });
  }

  legalNoticeEdit(data) {
    this.remsshareService.legalNoticeForm.next(data)
    this.remsshareService.premiseViewID.next(this.premiseViewId)
    this.router.navigate(['/rems/legalNoticeForm'], { skipLocationChange: true });
  }
  legalClearanceEdit(data) {
    this.remsshareService.legalClearanceForm.next(data)
    this.remsshareService.premiseViewID.next(this.premiseViewId)
    this.router.navigate(['/rems/legalClearanceForm'], { skipLocationChange: true });
  }

  agreementEdit(data) {
    this.remsshareService.agreementForm.next(data)
    console.log("modification-agreeedit",data);
    this.remsshareService.premiseViewID.next(this.premiseViewId)
    if (this.premisType == "Leased" || this.premisType == "Owned and Leased") {
      this.isLeased = true;
      this.remsshareService.premiseLeased.next(this.isLeased)
    } if (this.premisType == "Owned") {
      this.isOwned = false;
      this.remsshareService.premiseLeased.next(this.isOwned)
    }
    this.router.navigate(['/rems/leaseAgreement'], { skipLocationChange: true });
  }
  premiseDetailsEdit(data) {
    this.remsshareService.premiseDetailsForm.next(data);
    this.remsshareService.premiseViewID.next(this.premiseViewId)
    this.router.navigate(['/rems/premiseDetailsForm'], { skipLocationChange: true });
  }
  landlordEdit(data: any) {
    this.remsshareService.landlordEdit.next(data)
    this.remsshareService.premiseViewID.next(this.premiseViewId)
    this.router.navigateByUrl('/rems/landlordedit', data)
    this.router.navigate(['/rems/landlordedit'], { skipLocationChange: true });

    return data;
  }
  documentEdit(data) {
    let doc = {
      premiseid: this.premiseViewId
    }
    let jsondata = Object.assign({}, data, doc)
    this.remsshareService.documentForm.next(jsondata);
    this.router.navigate(['/rems/documentForm'], { skipLocationChange: true });
  }

  premiseDetailsDelete(id) {
    this.remsService.premiseDetailsDelete(this.premiseViewId, id)
      .subscribe((result) => {
        this.notification.showSuccess("Deleted....")
        this.getModificationView();
      })
  }


  deleteoccupancy(data) {
    console.log("modify-occ",data)
    let value = data.id
    if(data.agreement_id.length == 0){
    this.remsService.deleteoccupancy(value, this.premiseViewId)
      .subscribe(result => {
        this.notification.showSuccess("Successfully deleted....")
        this.getModificationView();

      })
    }  else {
      this.notification.showError("Should Not be Delete Occupancy...")
    }
  }

  amenitiesDelete(id) {
    this.remsService.amenitiesDelete(id)
      .subscribe((result) => {
        if (result.status == "success") {
          this.notification.showSuccess("Deleted....")
          this.amenitiesModiData = []
          this.getModificationView()
        }

      })
  }





  statutoryDelete(id) {
    this.remsService2.statutoryDeleteForm(id, this.premiseViewId)
      .subscribe((result) => {
        this.notification.showSuccess("Deleted Successfully....")
        this.getModificationView()

      })
  }


  licensesDelete(id) {
    this.remsService.licensesDelete(id)
      .subscribe((result) => {
        this.notification.showSuccess("Deleted....")
        this.getModificationView()

      })
  }

  RepairDelete(data) {
    let value = data.id
    this.remsService.repairDeleteForm(value)
      .subscribe(result => {
        this.notification.showSuccess("Successfully deleted....")
        this.getModificationView()
      })
  }

  adddetailRM(data) {

    this.remsshareService.repairEditValue.next(data.id)
    this.router.navigate(['/rems/RM'], { skipLocationChange: true });
  }


  deleterenovation(data) {
    let value = data.id
    this.remsService.deleterenovation(value)
      .subscribe(result => {
        this.notification.showSuccess("Successfully deleted....")
        this.getModificationView()

      })
  }


  insuranceDetailsDelete(id) {
    this.remsService.insuranceDetailsDelete(id)
      .subscribe((result) => {
        this.notification.showSuccess("Deleted....")
        this.getModificationView()

      })
  }


  agreementDelete(id) {
    this.remsService.agreementDelete(id, this.premiseViewId)
      .subscribe((result) => {
        this.notification.showSuccess("Deleted....")
        this.getModificationView()

      })
  }

  legalClearanceDelete(id) {
    this.remsService.legalClearanceDelete(id)
      .subscribe((result) => {
        this.notification.showSuccess("Deleted....")
        this.getModificationView()

      })
  }
  deletelanlord(data) {
    console.log("modify-land",data)
    let value = data.id
    if(data.agreement_id.length == 0){
    this.remsService.deletelanlordform(value, this.premiseViewId)
      .subscribe(result => {
        this.notification.showSuccess("Successfully deleted....")
        this.getModificationView()


      })
    }else {
      this.notification.showError("Should Not be Delete Landlord...")
    }

  }

  documentDelete(id) {
    this.remsService.documentDelete(id)
      .subscribe((result) => {
        this.notification.showSuccess("Deleted....")
        this.getModificationView()

      })
  }

  landLordView(id) {
    let json: any = {
      premise_id: this.premiseViewId,
      landlordView: id
    }
    this.remsshareService.landLordView.next(json)
    this.remsshareService.premiseViewID.next(this.premisViewData)
    this.router.navigate(['/rems/landLordView'], { skipLocationChange: true });
  }


  imagePreview(file_id, file_name, file) {
    let files = file
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let stringValue = files.file_name.split('.')
    if (file_name === files.file_name) {
      if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
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

  OccupancyView(id) {
    let datas: any = {
      premise_id: this.premiseViewId,
      OccupancyView: id
    }
    this.remsshareService.OccupancyView.next(datas)
    this.router.navigate(['/rems/OccupancyView'], { skipLocationChange: true });
  }


  premiseDetailsView(id) {
    this.remsshareService.premiseDetailsView.next(id)
    this.remsshareService.premiseViewID.next(this.premisViewData)
    this.router.navigate(['/rems/premiseDetailsView'], { skipLocationChange: true });
  }


  agreementView(id) {
    this.remsshareService.agreementView.next(id)
    this.remsshareService.premiseViewID.next(this.premisViewData)
    this.router.navigate(['/rems/agreementView'], { skipLocationChange: true });
  }

}


