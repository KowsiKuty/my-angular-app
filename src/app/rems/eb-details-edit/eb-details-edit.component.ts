import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { RemsService } from '../rems.service'
import { RemsShareService } from '../rems-share.service'
import { NotificationService } from '../notification.service'
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
export interface ebdetailsidLists {
  circle_name: string;
  id: number;
}
export interface serviceProviderLists {
  name: string;
  id: number;
}
@Component({
  selector: 'app-eb-details-edit',
  templateUrl: './eb-details-edit.component.html',
  styleUrls: ['./eb-details-edit.component.scss']
})
export class EbDetailsEditComponent implements OnInit {
  @ViewChild('serviceInput') service_provider;
  @ViewChild('ebcircleid') EBCircle;
  isLoading = false;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  ebdetailsEditForm: FormGroup;
  isEbdetailsEditForm: boolean;
  ebdetailsleaseidList: any;
  ebdetailsidList: Array<ebdetailsidLists>;
  serviceproviderList: Array<serviceProviderLists>;
  id = new FormControl();
  refTypeList: any;
  refidList: any;
  BorneidList: any;
  premiseId: any;
  refTypeID: number;
  isECFno: boolean;
  ecfno: any;
  EBEditBtn = false;
  ebcircleid = 0;


  constructor(private formBuilder: FormBuilder, private router: Router, private notification: NotificationService,
    private remsService: RemsService, private shareService: RemsShareService, private toastr: ToastrService) { }
  ngOnInit(): void {
    this.ebdetailsEditForm = this.formBuilder.group({
      ref_type: ['', Validators.required],
      ref_id: ['', Validators.required],
      EB_circle_id: ['', Validators.required],
      borne_by: ['', Validators.required],
      cosumer_number: ['', Validators.required],
      service_provider: ['', Validators.required],
      ecf_no: ['', Validators.required]
    })
    let ebcirclevalue: string = "";
    this.getebcirclenameDropDown(ebcirclevalue);
    this.ebdetailsEditForm.get('EB_circle_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.remsService.getebcirclenameDropDown(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ebdetailsidList = datas;
        console.log("ebdetailsidList", datas)
      })

    let servicevalue: string = "";
    this.getServiceProviderDropDown(this.ebcircleid,servicevalue);
    this.ebdetailsEditForm.get('service_provider').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.remsService.serviceProvider(this.ebcircleid,value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.serviceproviderList = datas;
      })

    this.getleasedetails();
    this.getbornedetails();
    this.getebdetailsEdit();
    this.getPremiseId();
    this.getRefType();
  }
  getPremiseId() {
    this.premiseId = this.shareService.premiseViewID.value
  }
  public displayFnebcircle(ebcirclename?: ebdetailsidLists): string | undefined {
    console.log('id', ebcirclename.id);
    console.log('name', ebcirclename.circle_name);
    return ebcirclename ? ebcirclename.circle_name : undefined;
  }
  get ebcirclename() {
    return this.ebdetailsEditForm.get('EB_circle_id');
  }
  private getebcirclenameDropDown(ebcirclevalue) {
    this.remsService.getebcirclenameDropDown(ebcirclevalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ebdetailsidList = datas;
        console.log("ebcircle N", datas)
        // return true	
      })
  }



  clear() {
    this.service_provider.nativeElement.value = ' ';

  }

  
  selectEBCircle(data) {
    this.ebcircleid = data.id;
    console.log("id", this.ebcircleid)
    this.getServiceProviderDropDown(data.id, '')
  }

  //service provider
  public displayFnserviceprovider(serviceprovider?: serviceProviderLists): string | undefined {
    return serviceprovider ? serviceprovider.name : undefined;
  }
  get serviceprovider() {
    return this.ebdetailsEditForm.get('service_provider');
  }
  private getServiceProviderDropDown(id,servicevalue) {
    this.remsService.getServiceProviderDropDown(id,servicevalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.serviceproviderList = datas;
      })
  }


  private getleasedetails() {
    this.remsService.getleasedetails()
      .subscribe((results: any[]) => {
        let databb = results["data"];
        this.ebdetailsleaseidList = databb;
        console.log("leasedetails", databb)
      })
  }

  private getbornedetails() {
    this.remsService.getbornedetails()
      .subscribe((results: any[]) => {
        let databb = results["data"];
        this.BorneidList = databb;
        console.log("bankdetails", databb)
      })
  }
  private getRefType() {

    this.remsService.getRefType(this.premiseId)
      .subscribe((results: any[]) => {
        let refdata = results["data"];
        this.refTypeList = refdata;
        console.log("refdata", refdata)
      })

  }
  dependentid(s) {
    this.remsService.getRefID(this.premiseId, s)
      .subscribe((results: any[]) => {
        let refdata = results["data"];
        this.refidList = refdata;
        console.log("refdata", refdata)
      })
  }

  getebdetailsEdit() {
    let data: any = this.shareService.ebdetailsEditValue.value;
    this.remsService.ebdetailsparticular(data.id)
      .subscribe((result) => {
        console.log("ressssss", result)
        console.log("EDit.............", data)
        this.refTypeID = result.ref_type.id
        this.dependentid(this.refTypeID)
        let RefType = result.ref_type.id
        let RefId = result.ref_id.id
        let Circle = result.EB_circle_id
        let BomeBy = result.borne_by_id
        // let ECFref = result.ecf_no
        console.log("ss", BomeBy)
        let Consumerno = result.cosumer_number
        let ServiceProvider = result.service_provider
        if (result.borne_by_id == 1) {
          this.isECFno = true;
          this.isECFno = result.ecf_no;
        }
        this.ebdetailsEditForm.patchValue({
          ref_type: RefType,
          ref_id: RefId,
          EB_circle_id: Circle,
          borne_by: BomeBy,
          cosumer_number: Consumerno,
          service_provider: ServiceProvider,
          ecf_no: this.isECFno
        })
      })
  }

  submitForm() {
    this.EBEditBtn = true;
    if (this.ebdetailsEditForm.value.borne_by_id == 2) {
      this.ebdetailsEditForm.value.ecf_no = null;
    }
    if (this.ebdetailsEditForm.value.ref_type === "") {
      this.toastr.warning('', 'Please Enter Type', { timeOut: 1500 });
      this.EBEditBtn = false;
      return false
    }
    else if (this.ebdetailsEditForm.value.ref_id === "") {
      this.toastr.warning('', 'Please Enter ID', { timeOut: 1500 });
      // this.onCancel.emit()
      this.EBEditBtn = false;
      return false;
    }
    else if (this.ebdetailsEditForm.value.borne_by === "") {
      this.toastr.warning('', 'Please Enter Borene By', { timeOut: 1500 });
      this.EBEditBtn = false;
      return false;
    }
    else if (this.ebdetailsEditForm.value.service_provider === "") {
      this.toastr.warning('', 'Please Enter Service Provider', { timeOut: 1500 });
      this.EBEditBtn = false;
      return false;
    }
    else if (this.ebdetailsEditForm.value.cosumer_number === "") {
      this.toastr.warning('', 'Please Enter Cosumer Number', { timeOut: 1500 });
      this.EBEditBtn = false;
      return false;
    }

    else if (this.ebdetailsEditForm.value.EB_circle_id === "") {
      this.toastr.warning('', 'Please Enter EB Circle', { timeOut: 1500 });
      this.EBEditBtn = false;
      return false;
    }
    // else if (this.ebdetailsEditForm.value.ecf_no === "") {
    //   this.toastr.warning('', 'Please Enter ECF', { timeOut: 1500 });
    //   this.EBEditBtn = false;
    //   return false;
    // }
    let data: any = this.shareService.ebdetailsEditValue.value
    this.remsService.ebdetailsEdit(this.createFormate(), data.id, this.premiseId)
      .subscribe(res => {
        let code = res.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Modify before getting the Approval")
          this.EBEditBtn = false;
        }
        else if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          this.EBEditBtn = false;
        }
        else {
          this.notification.showSuccess("Successfully Updated!...")
          this.router.navigate(['/rems/premiseView'], { queryParams: { status: "EB Details" }, skipLocationChange: true });
        }
      })
  }
  onCancelClick() {
    this.router.navigate(['/rems/premiseView'], { queryParams: { status: "EB Details" }, skipLocationChange: true });
  }
  createFormate() {
    let data = this.ebdetailsEditForm.controls;

    let objebdetailsedit = new ebdetailsedit();
    objebdetailsedit.ref_type = data['ref_type'].value;
    objebdetailsedit.ref_id = data['ref_id'].value;
    objebdetailsedit.EB_circle_id = data['EB_circle_id'].value.id;
    objebdetailsedit.borne_by = data['borne_by'].value;
    objebdetailsedit.cosumer_number = data['cosumer_number'].value;

    objebdetailsedit.service_provider = data['service_provider'].value.id;
    if (this.ebdetailsEditForm.value.borne_by == 2) {
      this.ebdetailsEditForm.value.ecf_no = null;
      this.ecfno = this.ebdetailsEditForm.value.ecf_no
      objebdetailsedit.ecf_no = this.ecfno;
    } else {
      objebdetailsedit.ecf_no = data['ecf_no'].value;
    }
    console.log(" objebdetailscreate", objebdetailsedit)
    // objebdetailsedit.ecf_no = data['ecf_no'].value;
    // console.log(" objebdetailscreate",  objebdetailsedit)	
    return objebdetailsedit;
  }
  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || (k >= 48 && k <= 57));
  }
  only_char(event) {
    var a;
    a = event.which;
    if ((a > 32) && (a < 65 || a > 90) && (a < 97 || a > 122)) {
      return false;
    }
  }
  omit_special_chars(event) {
    var k;
    k = event.charCode;
    return ((k > 59 && k < 61)||(k > 61 && k < 63)||(k > 63 && k < 91) || (k > 96 && k < 123) || (k >= 48 && k <= 57) ||(k>31 && k<34)||(k>37 && k<39)
    ||(k>39 && k<43) ||(k>43 && k<49));
  }
  DropDown(data) {
    if (data.id == 1) {
      this.isECFno = true;
    } else {
      this.isECFno = false;
    }
    console.log("DropDown", data)
  }

}
class ebdetailsedit {
  ref_type: number;
  ref_id: number;
  EB_circle_id: number;
  borne_by: number;
  cosumer_number: number;

  service_provider: string;
  ecf_no: number;
}