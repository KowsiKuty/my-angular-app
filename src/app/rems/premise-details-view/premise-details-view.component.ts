import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { RemsService } from '../rems.service'
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../notification.service'
import { FormBuilder, FormGroup, Validators, FormControl,FormGroupDirective } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, } from '@angular/material/autocomplete';
import { environment } from 'src/environments/environment'

const isSkipLocationChange = environment.isSkipLocationChange

export interface occupancyMapping {
  id: number;
  code: string
}

@Component({
  selector: 'app-premise-details-view',
  templateUrl: './premise-details-view.component.html',
  styleUrls: ['./premise-details-view.component.scss']
})
export class PremiseDetailsViewComponent implements OnInit {
  
  @ViewChild('mappingInput') mappingInput: ElementRef;
  @ViewChild('closebutton') closebutton;
  @ViewChild('closebutton1') closebutton1;
  chipSelectedEmployee: occupancyMapping[] = [];
  chipSelectedMappingId = [];
  occupancyMappingValue: occupancyMapping[];
  chipRemovedEmployeeid = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public codeControl = new FormControl();
  premiseId: any;
  premiseDetailsId: any;
  dropDownTag = "occupancy_Mapping"
  backNavigationTable: any;
  occupancyMapList: any;
  nex_occupancyMap = true;
  previous_occupancyMap = true;
  isOccupancyMap = true;
  present_OccupancyMap: number = 1;
  occupancyMapSize = 10;
  brokerDetailsList: any;
  next_broker = true;
  previous_broker = true;
  isBrokerDetails = true;
  isBrokerDetailsData: boolean;
  present_broker: number = 1;
  brokerSize = 10;
  occpancyMapppingForm: FormGroup;
  idValue: any;
  method = "";
  premiseDetialisData: PremsieDetailsView;
  tableId: number;
  brokerDetailsForm : FormGroup;
  finalJson : any;
  BrodetButton= false;
  OccmapDetails=false;

  @ViewChild(FormGroupDirective) fromGroupDirectives : FormGroupDirective 
  constructor(private shareService: RemsShareService, private remsService: RemsService,
    private route: ActivatedRoute, private toastr:
      ToastrService, private router: Router, private fb: FormBuilder,
    private notification: NotificationService) { }
  ngOnInit(): void {
    this.occpancyMapppingForm = this.fb.group({
      occupancy_id: ['', Validators.required],
    })
    this.brokerDetailsForm = this.fb.group({
      name: ['', Validators.required],
      email_id: ['', [Validators.required, Validators.email,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      mobile: ['', Validators.required],
      brokerage_amount: ['', Validators.required],
    })
    this.getPremiseDetailsView();
    this.getEditBrokerDetails();
  }
  getPremiseDetailsView() {
    let id = this.shareService.premiseDetailsView.value;
    let data = this.shareService.premiseViewID.value;
    this.premiseId=data.id
    this.remsService.getPremiseDetailsView(id)
      .subscribe((result) => {
        console.log("fu",result)
        let json: any = {
          data: [{
            title:"PremiseDetailsView",
            name:result.building_name,
            code:'',
            routerUrl: "/premiseView"
          }]
        }
        this.shareService.premiseBackNavigation.next(json);
        this.premiseDetialisData = result
        this.premiseDetailsId = result.id;

        this.getTableValue();
        this.getOccupancyMapping();
        this.getOccupancyListMap();
      })
  }
  getTableValue() {
    this.route.queryParams.subscribe(params => {
      this.backNavigationTable = params.status;
      if (this.backNavigationTable == "broker_Details") {
        this.dropDownTag = "broker_Details";
        this.getBrokerDetails();
      } else if (this.backNavigationTable == "occupancy_Mapping") {
        this.dropDownTag = "occupancy_Mapping";
        this.getOccupancyMapping();
      }
    })
  }
  getOccupancyMapping(pageNumber = 1) {
    this.remsService.getOccupancyMapping(this.premiseDetailsId, pageNumber)
      .subscribe(data => {
        console.log("OCUU", data)
        this.occupancyMapList = data.data;
        let datapagination = data.pagination;
        if (this.occupancyMapList.length === 0) {
          this.isOccupancyMap = false
        }
        if (this.occupancyMapList.length > 0) {
          this.nex_occupancyMap = datapagination.has_next;
          this.previous_occupancyMap = datapagination.has_previous;
          this.present_OccupancyMap = datapagination.index;
          this.isOccupancyMap = true
        }
      })
  }
  rent_nextClick() {
    if (this.nex_occupancyMap === true) {
      this.getOccupancyMapping(this.present_OccupancyMap + 1)
    }
  }
  rent_previousClick() {
    if (this.previous_occupancyMap === true) {
      this.getOccupancyMapping(this.present_OccupancyMap - 1)
    }
  }
  brokerDetailCreate() {
    let data = {
      premiseDetailsId: this.premiseDetailsId
    }
    this.shareService.brokerDetailsForm.next(data)
  }
  brokerDetailsEdit(data) {
    let datas = {
      premiseDetailsId: this.premiseDetailsId
    }
    let s = Object.assign({}, data, datas)
    this. finalJson = s
    console.log('ssss',this. finalJson)
    this.getEditBrokerDetails();
    // this.shareService.brokerDetailsForm.next(this.finalJson)
    // this.router.navigate(['/brokerDetailsForm'], { skipLocationChange: true });
  }
  brokerDetailsDelete(id) {
    this.remsService.brokerDetailsDelete(id)
      .subscribe((result) => {
        this.notification.showSuccess("Deleted....")
        this.getBrokerDetails();
        return true;
      })
  }
  getBrokerDetails(pageNumber = 1) {
    this.remsService.getBrokerDetails(this.premiseDetailsId, pageNumber)
      .subscribe(data => {
        this.brokerDetailsList = data.data;
        let datapagination = data.pagination;
        if (data.code === "INVALID_INWARDHEADER_ID" && data.description === "Invalid inwardheader ID") {
          this.isBrokerDetails = false;
          this.isBrokerDetailsData = true;
        } else if (this.brokerDetailsList.length === 0) {
          this.isBrokerDetails = false;
          this.isBrokerDetailsData = true;
        } else
          if (this.brokerDetailsList.length > 0) {
            this.next_broker = datapagination.has_next;
            this.previous_broker = datapagination.has_previous;
            this.present_broker = datapagination.index;
            this.isBrokerDetails = true
          }
      })
  }
  broker_nextClick() {
    if (this.next_broker === true) {
      this.getBrokerDetails(this.present_broker + 1)
    }
  }
  broker_previousClick() {
    if (this.previous_broker === true) {
      this.getBrokerDetails(this.present_broker - 1)
    }
  }
  occupancyMapCreate() {
    let json = {
      method: "add"
    }
    this.method = json.method
  }
  occupancyMapEdit(id) {
    let json = {
      method: "remove"
    }
    this.method = json.method
    this.tableId = id;

  }
  occupancyMapDelete() {
    if (this.method == "remove") {
      this.remsService.premiseOccupancyMappingForm(this.tableId, this.premiseDetailsId, this.method)
        .subscribe(result => {
          console.log("<", result)
          if(result.status == "success"){
            this.notification.showSuccess(result.message)
            this.closebutton.nativeElement.click();
          }
          this.getOccupancyMapping();
        })
    }
  }
  occpancyMapppingCreate() {
    this.OccmapDetails=true;
    if (this.method == "add") {
      this.remsService.premiseOccupancyMappingForm(this.chipSelectedMappingId, this.premiseDetailsId, this.method)
        .subscribe(result => {
          this.notification.showSuccess(result.message)
          this.closebutton.nativeElement.click();
          this.getOccupancyMapping();
          this.chipSelectedMappingId = [];
          this.chipSelectedEmployee = [];
        })
    }
  }
  onCancelClick() {
    this.closebutton.nativeElement.click();
  }
  getOccupancyListMap() {
    this.remsService.getOccupancyListMap(this.premiseId)
      .subscribe(result => {
        let data = result.data;
        this.occupancyMappingValue = data;
        console.log("list", this.occupancyMappingValue)

      })
  }

  public removeCode(code: occupancyMapping): void {
    const index = this.chipSelectedEmployee.indexOf(code);
    this.chipRemovedEmployeeid.push(code.id)
    this.chipSelectedEmployee.splice(index, 1);
    this.chipSelectedMappingId.splice(index, 1);
    return;
  }

  public codeSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectCode(event.option.value.code);
    this.mappingInput.nativeElement.value = '';
  }
  private selectCode(code) {
    let foundCode = this.occupancyMappingValue.filter(item => item.code == code);
    if (foundCode.length) {
      this.chipSelectedEmployee.push(foundCode[0]);
      this.chipSelectedMappingId.push(foundCode[0].id)
    }
  }


getEditBrokerDetails() {
  // let data: any = this.shareService.brokerDetailsForm.value
  let data = this.finalJson
  this.idValue = data.id;
  this.premiseDetailsId = data.premiseDetailsId;
  if (data === '') {
    this.brokerDetailsForm.patchValue({
      name: '',
      email_id: '',
      brokerage_amount: '',
      mobile: ''
    })
  } else {
    this.brokerDetailsForm.patchValue({
      name: data.name,
      email_id: data.email_id,
      brokerage_amount: data.brokerage_amount,
      mobile: data.mobile
    })
  }
}

brokerDetailsFormCreate() {
  this.BrodetButton=true;
  if (this.brokerDetailsForm.value.name === "") {
    this.toastr.warning('', 'Please Enter Name', { timeOut: 1500 });
    this.BrodetButton=false;
    return false;
  } else if (this.brokerDetailsForm.value.email_id === "") {
    this.toastr.warning('', 'Please Enter E-Mail', { timeOut: 1500 });
    this.BrodetButton=false;
    return false;
  } else if (this.brokerDetailsForm.value.brokerage_amount === "") {
    this.toastr.warning('', 'Please Enter Brokerage Amount', { timeOut: 1500 });
    this.BrodetButton=false;
    return false;
  }
  else if (this.brokerDetailsForm.value.mobile === "") {
    this.toastr.warning('', 'Please Enter Mobile Number', { timeOut: 1500 });
    this.BrodetButton=false;
    return false;
  } else if (this.brokerDetailsForm.value.mobile.length != 10) {
    this.toastr.warning('', 'Please Enter Valid Mobile Number', { timeOut: 1500 });
    this.BrodetButton=false;
    return false;
  }

  // else if (this.brokerDetailsForm.value.brokerage_amount === undefined) {
  //   this.toastr.warning('', 'Please Enter Number Only..', { timeOut: 1500 });
  //   this.BrodetButton=false;
  //   return false;
  // }
  if (this.idValue == undefined) {
    this.remsService.brokerDetailsForm(this.brokerDetailsForm.value, '', this.premiseDetailsId)
      .subscribe(result => {
        console.log(">.premiseDetailsViewpremiseDetailsViewpremiseDetailsView", result)
        if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
          this.notification.showError("Duplicate! INVALID_DATA! ...")
          this.BrodetButton=false;
        } else if (result.code === "INVALID_ARREARS_ID" && result.description === "INVALID_ARREARS_ID") {
          this.notification.showError("Empty Field Not Allow... ")
          this.BrodetButton=false;
        } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
          this.notification.showError("Valid Mail Id..")
          this.BrodetButton=false;
        }
        else {
          this.notification.showSuccess("Successfully created!...")
          this.getBrokerDetails();
          this.brokerDetailsForm.reset();
          this.fromGroupDirectives.resetForm();
          this.closebutton1.nativeElement.click();
         
         
          this.router.navigate(['/rems/premiseDetailsView'], { queryParams: { status: "broker_Details" }, skipLocationChange: isSkipLocationChange });
        }
        // this.idValue = result.id;
      })
  } else {
    this.remsService.brokerDetailsForm(this.brokerDetailsForm.value, this.idValue, this.premiseDetailsId)
      .subscribe(result => {
        console.log(">.premiseDetail........", result)
        if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
          this.notification.showError("Duplicate! INVALID_DATA! ...")
          this.BrodetButton=false;
        } else if (result.code === "INVALID_ARREARS_ID" && result.description === "INVALID_ARREARS_ID") {
          this.notification.showError("Empty Field Not Allow... ")
          this.BrodetButton=false;
        } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
          this.notification.showError("Valid Mail Id..")
          this.BrodetButton=false;
        }
        else {
          this.notification.showSuccess("Successfully Updates!...")
          this.idValue = undefined;
          this.getBrokerDetails();
          this.brokerDetailsForm.reset(); 
          this.fromGroupDirectives.resetForm();
          this.closebutton1.nativeElement.click();
          this.router.navigate(['/rems/premiseDetailsView'], { queryParams: { status: "broker_Details" }, skipLocationChange: isSkipLocationChange });
        }
      })
  }
}

onCancelbrokerClick() {
  this.router.navigate(['/rems/premiseDetailsView'], { queryParams: { status: "broker_Details" }, skipLocationChange: isSkipLocationChange });

}
numberOnly(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}
}

export class PremsieDetailsView {
  allocation_charges: number;
  building_details: {
    building_market_value: number;
    building_purchased_amount: number;
    building_revaluation_amount: number;
    buildup_area: number;
    carpet_area: number;
    common_area: number;
    construction_date: string;
    land_area: number;
    land_market_value: number;
    land_purchased_amount: number;
    land_revaluation_amount: number;
  }
  building_name: string;
  description: number;
  floors_owned: number;
  primary_contact: {
    code: string;
    full_name: string;
  }
  purchased_date: string;
  reg_charges_paidby: number;
  registered_date: string;
  registration_charge: number;
}