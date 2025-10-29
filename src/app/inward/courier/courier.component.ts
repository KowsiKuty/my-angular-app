import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { DataService } from '../inward.service'
import { ShareService } from '../share.service'
import { Router } from '@angular/router'
import { NotificationService } from '../notification.service'

@Component({
  selector: 'app-courier',
  templateUrl: './courier.component.html',
  styleUrls: ['./courier.component.css']
})
export class CourierComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  courierForm: FormGroup;
  pinCodeList: Array<any>;
  cityList: Array<any>;
  stateList: Array<any>;
  districtList: Array<any>;
  designationList: Array<any>;
  contactTypeList: Array<any>;
  HeaderID: any
  constructor(private fb: FormBuilder, private notification: NotificationService,
    private dataService: DataService, private router: Router, private shareService: ShareService,) { }

  ngOnInit(): void {
    this.courierForm = this.fb.group({
      // code: ['', Validators.required],
      name: ['', Validators.required],
      type: [''],
      contactperson: ['', Validators.required],
      address: this.fb.group({
        line1: [''],
        pincode_id: [''],
        city_id: [''],
        district_id: [''],
        state_id: [''],
        line2: [''],
        line3: [''],
      }),
      contact: this.fb.group({
        designation_id: ['', Validators.required],
        email: ['', Validators.email],
        landline: [''],
        landline2: [''],
        mobile: [''],
        mobile2: [''],
        name: ['', Validators.required],
        type_id: ['', Validators.required],

      }),
    })

    this.getPinCode();
    this.getCity();
    this.getDistrict();
    this.getState();
    this.getDesignation();
    this.getContactType();
    this.getCourierEdit();
  }

  getCourierEdit() {
    let id = this.shareService.courierEdit.value;
    if (id == null || id == undefined || id == "") {
      return false
    }
    this.HeaderID = id
    this.dataService.getCourierEdit(id)
      .subscribe((results: any) => {
        let datas = results
        let Code = results?.code;
        let Name = results?.name;
        let Type = results?.type;
        let contactPerson = results?.contactperson;
        let Address = results?.address_id;
        let Line = Address?.line1;
        let pinCode = Address?.pincode_id?.id;
        let City = Address?.city_id?.id;
        let State = Address?.state_id?.id;
        let District = Address?.district_id?.id;
        let addressLandLine2 = Address?.line2;
        let addressLandLine3 = Address?.line3;
        let Contact = results?.contact_id;
        let Designation = Contact?.designation_id;
        let contactType = Contact?.type_id;
        let contactName = Contact?.name;
        let Email = Contact?.email;
        let landline1 = Contact?.landline;
        let landline2 = Contact?.landline2;
        let mobileNo1 = Contact?.mobile;
        let mobileNo2 = Contact?.mobile2
        this.courierForm.patchValue({
          code: Code,
          name: Name,
          type: Type,
          contactperson: contactPerson,
          address: {
            line1: Line,
            pincode_id: pinCode,
            city_id: City,
            state_id: State,
            district_id: District,
            line2: addressLandLine2,
            line3: addressLandLine3,
          },
          contact: {
            designation_id: Designation,
            type_id: contactType,
            name: contactName,
            email: Email,
            landline: landline1,
            landline2: landline2,
            mobile: mobileNo1,
            mobile2: mobileNo2
          }
        })
      })
  }


  private getPinCode() {
    this.dataService.getPinCode()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.pinCodeList = datas;
      })
  }


  private getCity() {
    this.dataService.getCity()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cityList = datas;

      })
  }
  private getState() {
    this.dataService.getState()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.stateList = datas;

      })
  }
  private getDistrict() {
    this.dataService.getDistrict()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.districtList = datas;

      })
  }
  private getDesignation() {
    this.dataService.getDesignation()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.designationList = datas;

      })
  }
  private getContactType() {
    this.dataService.getContactType()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.contactTypeList = datas;

      })
  }


  courierCreateForm() {
    let dataSubmit: any
    if ((this.HeaderID == "") || (this.HeaderID == undefined) || (this.HeaderID == null)) {
      dataSubmit = this.courierForm.value
    }
    else {
      let data = this.courierForm.value
      dataSubmit = Object.assign({}, data, { "id": this.HeaderID.id })
    }
    this.dataService.courierCreateForm(dataSubmit)
      .subscribe(res => {
        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.notification.showWarning("Duplicate! Code Or Name ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!...")
        }
        else {
          this.notification.showSuccess("Saved Successfully!...")
          this.onSubmit.emit();
        }
        return true
      })
  }


  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onCancelClick() {
    this.onCancel.emit()
  }

}