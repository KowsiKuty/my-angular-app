import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router'
import { Rems2Service } from '../rems2.service'
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, tap, map, takeUntil, switchMap, finalize } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { environment } from 'src/environments/environment'

const isSkipLocationChange = environment.isSkipLocationChange

export interface ctrlofzListss {
  name: string;
  id: number;
}
export interface cityListss {
  name: string;
  id: number;
}
export interface pinCodeListss {
  no: string;
  id: number;
}
export interface districtListss {
  name: string;
  id: number;
}
export interface stateListss {
  name: string;
  id: number;
}
export interface PrimaryContact {
  id: number;
  full_name: string;
}


@Component({
  selector: 'app-premise-edit',
  templateUrl: './premise-edit.component.html',
  styleUrls: ['./premise-edit.component.scss']
})
export class PremiseEditComponent implements OnInit {
  @ViewChild('autoPrimary') matAutocompleteDept: MatAutocomplete;
  @ViewChild('primaryContactInput') primaryContactInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  PremiseEditForm: FormGroup;
  // @Output() onCancel = new EventEmitter<any>();
  // @Output() onSubmit = new EventEmitter<any>();
  // cityList: Array<any>;
  // districtList: any;
  // pinCodeList: any;
  // stateList: any;
  // ControllingOfficeList: any;
  ControllingOfficeList: Array<ctrlofzListss>;
  controlling_office_id = new FormControl();
  isLoading = false;

  cityList: Array<cityListss>;
  city_id = new FormControl();

  pinCodeList: Array<pinCodeListss>;
  pincode_id = new FormControl();


  districtList: Array<districtListss>;
  district_id = new FormControl();

  stateList: Array<stateListss>;
  state_id = new FormControl();

  cityId: number;
  districtId: number;
  stateId: number;
  pincodeId: number;

  PremiseIdValue: number;
  isPermiseEditForm: boolean;
  isPremiseView: boolean;
  code: string;
  name: string;
  type: string;
  rent_area: string;
  premise_status: string;
  modify_status: string;
  controlling_office: string;
  line1: string;
  line2: string;
  line3: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  employeeName: string;
  // premiseType = [{ id: 1, type: "LEASED" }, { id: 2, type: "OWNED" },{ id: 3, type: "RENT FREE" }]
  premiseType: any;
  primaryContactList: any;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  identificationSearchData: any;
  premisesIdentificationId: number;
  land_ownership: string;
  ownership: boolean;
  PremiseEditbtn=false
  Latitude: any;
  Longitude: any;
  ownershipType: number;
  has_prinext = true;
  has_priprevious = true;
  pricurrentpage: number = 1; 
  
  @ViewChild('cotype') matpriofficeAutocomplete: MatAutocomplete;
  @ViewChild('office1Input') office1Input: any;


  constructor(private fb: FormBuilder, private router: Router, private remsshareService: RemsShareService, private remsService2: Rems2Service,
    private dataService: RemsService, private toastr: ToastrService, private notification: NotificationService, ) { }





  ngOnInit(): void {
    let data: any = this.remsshareService.premiseEditValue.value;
    this.PremiseIdValue = data
    console.log("PremiseIdValue", this.PremiseIdValue)
    this.PremiseEditForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      rent_area: ['', Validators.required],
      controlling_office_id: ['', Validators.required],
      land_ownership: [''],
      code: '',
      latitude: [''],
      longitude: [''],
      address: this.fb.group({
        line1: ['', Validators.required],
        line2: ['', Validators.required],
        line3: ['', Validators.required],
        city_id: ['', Validators.required],
        district_id: ['', Validators.required],
        state_id: ['', Validators.required],
        pincode_id: ['', Validators.required],
      }),
    })
    this.getPremiseEdit();
    let ctrlofzkeyvalue: String = "";
    this.getControllingOfz(ctrlofzkeyvalue);

    let pinkeyvalue: String = "";
    this.getPinCode(pinkeyvalue);
    //this.getPinCode();
    this.PremiseEditForm.controls.address.get('pincode_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),

        switchMap(value => this.dataService.getPinCodeDropDown(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.pinCodeList = datas;
        console.log("pincode_id", datas)

      })








    let citykeyvalue: String = "";
    this.getCity(citykeyvalue);
    this.PremiseEditForm.controls.address.get('city_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),

        switchMap(value => this.dataService.getCityDropDown(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cityList = datas;
        console.log("cityList", datas)
      })



    //this.getDistrict();
    let districtkeyvalue: String = "";
    this.getDistrict(districtkeyvalue);
    this.PremiseEditForm.controls.address.get('district_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),

        switchMap(value => this.dataService.getDistrictDropDown(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.districtList = datas;
        console.log("districtList", datas)

      })








    // this.getState();
    let statekeyvalue: String = "";
    this.getState(statekeyvalue);
    this.PremiseEditForm.controls.address.get('state_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),

        switchMap(value => this.dataService.getStateDropDown(value)
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
        console.log("stateList", datas)

      })


    this.PremiseEditForm.get('controlling_office_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),

        switchMap(value => this.dataService.getControllingOfzDropDown(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ControllingOfficeList = datas;
        console.log("ControllingOfficeList", datas)

      })
    // let primaykey: String = "";
    // this.primaryContact(primaykey);
    // this.PremiseEditForm.get('rm_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap(value => this.dataService.primaryContact(value)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.primaryContactList = datas;
    //   })
  }

  public displayFn(cotype?: ctrlofzListss): string | undefined {
    console.log('id', cotype.id);
    console.log('name', cotype.name);
    return cotype ? cotype.name : undefined;
  }

  get cotype() {
    return this.PremiseEditForm.get('controlling_office_id');
  }


  private getControllingOfz(ctrlofzkeyvalue) {
    this.dataService.getControllingOfzDropDown(ctrlofzkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ControllingOfficeList = datas;
        console.log("Controlling Office DD", datas)
        return true
      })
    this.premisesType();
  }
  premisesType() {
    this.remsService2.premisesType()
      .subscribe((results) => {
        this.premiseType = results.data;
      })
  }
  priOffScroll() {
    setTimeout(() => {
      if (
        this.matpriofficeAutocomplete &&
        this.autocompleteTrigger &&
        this.matpriofficeAutocomplete.panel
      ) {
        fromEvent(this.matpriofficeAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matpriofficeAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matpriofficeAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matpriofficeAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matpriofficeAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_prinext === true) {
                this.dataService.getUsageCode(this.office1Input.nativeElement.value, this.pricurrentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.ControllingOfficeList = this.ControllingOfficeList.concat(datas);
                    if (this.ControllingOfficeList.length >= 0) {
                      this.has_prinext = datapagination.has_next;
                      this.has_priprevious = datapagination.has_previous;
                      this.pricurrentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }



  // getPremiseEdit(){
  //   let id = this.remsshareService.PremiseEdit.value
  //   this.dataService.getPremiseEdit(id)
  //   .subscribe((results:any) =>{
  //     let datas = results
  //     let Name = results.name;
  //     let Type = results.type;
  //     let controlling_office_id = results.controlling_office_id.id;
  //     let Address = results.address_id;
  //     let Line1 = Address.line1;
  //     let Line2 = Address.line2;
  //     let Line3 = Address.line3;
  //     let pinCode = Address.pincode_id.id;
  //     let City = Address.city_id.id;
  //     let State = Address.state_id.id;
  //     let District = Address.district_id.id;

  getPremiseEdit() {
    this.dataService.getPremiseEdit(this.PremiseIdValue)
      .subscribe(result => {
        console.log("ssss", result)
        this.land_ownership = result.land_ownership
        
        console.log("result.land_ownership.land_ownership_id",result.land_ownership);
        if (result.land_ownership){
          if (result.land_ownership.land_ownership_id == 1 || result.land_ownership.land_ownership_id == 3 || result.land_ownership.land_ownership_id == 2){
            this.ownershipType = result.land_ownership.land_ownership_id;
            this.ownership =true;
          } else {
            this.ownership = true;
          }
        } 
        
        this.code = result.code;
        this.name = result.name;
        this.type = result.type.id;
        this.rent_area = result.rent_area;
        this.controlling_office = result.controlling_office;
        this.Latitude = result.latitude;
        this.Longitude = result.longitude;
        this.line1 = result.address.line1;
        this.line2 = result.address.line2;
        this.line3 = result.address.line3;
        this.city = result.address.city_id;
        this.district = result.address.district_id;
        this.state = result.address.state_id;
        this.pincode = result.address.pincode_id;

        this.PremiseEditForm.patchValue({
          code: this.code,
          name: this.name,
          type: this.type,
          rent_area: this.rent_area,
          latitude: this.Latitude,
          longitude: this.Longitude,
          controlling_office_id: this.controlling_office,
          land_ownership: this.ownershipType,
          address: {
            line1: this.line1,
            line2: this.line2,
            line3: this.line3,
            pincode_id: this.pincode,
            city_id: this.city,
            state_id: this.state,
            district_id: this.district
          },
        })
      })
  }

  // private getControllingOfz(ctrlofzkeyvalue) {
  //   this.dataService.getControllingOfzDropDown(ctrlofzkeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.ControllingOfficeList = datas;
  //       console.log("Controlling Office DD", datas)

  //     })
  // }






  public displayFnpin(pintype?: pinCodeListss): string | undefined {
    console.log('id', pintype.id);
    console.log('no', pintype.no);
    return pintype ? pintype.no : undefined;
  }

  get pintype() {
    return this.PremiseEditForm.controls.address.get('pincode_id');
  }



  private getPinCode(pinkeyvalue) {
    this.dataService.getPinCodeDropDown(pinkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.pinCodeList = datas;
        console.log("PinCode DD", datas)
      })
  }




  public displayFncity(citytype?: cityListss): string | undefined {
    console.log('id', citytype.id);
    console.log('name', citytype.name);
    return citytype ? citytype.name : undefined;
  }

  get citytype() {
    return this.PremiseEditForm.controls.address.get('city_id');
  }
  private getCity(citykeyvalue) {
    this.dataService.getCityDropDown(citykeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cityList = datas;
        console.log("City DD", datas)

      })
  }


  public displayFndistrict(districttype?: districtListss): string | undefined {
    console.log('id', districttype.id);
    console.log('name', districttype.name);
    return districttype ? districttype.name : undefined;
  }

  get districttype() {
    return this.PremiseEditForm.controls.address.get('district_id');
  }
  private getDistrict(districtkeyvalue) {
    this.dataService.getDistrictDropDown(districtkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.districtList = datas;
        console.log("District DD", datas)

      })
  }



  public displayFnstate(statetype?: stateListss): string | undefined {
    console.log('id', statetype.id);
    console.log('name', statetype.name);
    return statetype ? statetype.name : undefined;
  }

  get statetype() {
    return this.PremiseEditForm.controls.address.get('state_id');
  }
  private getState(statekeyvalue) {
    this.dataService.getStateDropDown(statekeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.stateList = datas;
        console.log("State DD", datas)
      })
  }
  pinCode(data) {
    this.cityId = data.city;
    this.districtId = data.district;
    this.stateId = data.state;
    this.pincodeId = data
    this.PremiseEditForm.patchValue({
      address: {
        city_id: this.cityId,
        district_id: this.districtId,
        state_id: this.stateId,
        pincode_id: this.pincodeId
      }
    })
  }

  citys(data) {
    this.cityId = data;
    this.districtId = data.district;
    this.stateId = data.state;
    this.pincodeId = data.pincode;
    this.PremiseEditForm.patchValue({
      address: {
        city_id: this.cityId,
        state_id: this.stateId,
        district_id: this.districtId,
        pincode_id: this.pincodeId
      }
    })
  }

  identificationSearch() {
    let search = this.PremiseEditForm.value;
    this.remsService2.getIdentificationSearch(search)
      .subscribe(result => {
        this.identificationSearchData = result.data;
        this.identificationSearchData.forEach(element => {
          this.remsService2.getPremiseIdentificationEdit(element.id)
            .subscribe(result => {
              this.premisesIdentificationId = result.id;
              this.PremiseEditForm.patchValue({
                name: result.name
              })
            })
        });
      })
  }
  autocompletePrimaryScroll() {
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
              if (this.has_next === true) {
                this.dataService.primaryContacts(this.primaryContactInput.nativeElement.value, this.currentpage + 1, 'all')
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];

                    this.primaryContactList = this.primaryContactList.concat(datas);
                    if (this.primaryContactList.length >= 0) {
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

  public displayFn1(primary?: PrimaryContact): string | undefined {
    return primary ? primary.full_name : undefined;
  }

  get primary() {
    return this.PremiseEditForm.get('rm_id');
  }

  private primaryContact(primaykey) {
    this.dataService.primaryContact(primaykey)
      .subscribe((results) => {
        let datas = results["data"];
        this.primaryContactList = datas;
      })
  }


  createFormat() {
    let data = this.PremiseEditForm.controls;
    let datas = this.PremiseEditForm.controls.address;
    let obj = new ctrlofztype();
    let address1 = {
      line1: datas.value.line1,
      line2: datas.value.line2,
      line3: datas.value.line3,
      city_id: datas.value.city_id.id,
      district_id: datas.value.district_id.id,
      state_id: datas.value.state_id.id,
      pincode_id: datas.value.pincode_id.id
    }
    obj.address = address1;
    obj.name = data['name'].value;
    obj.type = data['type'].value;
    obj.latitude = data['latitude'].value;
    obj.longitude= data['longitude'].value;
    obj.rent_area = data['rent_area'].value;
    // if (this.land_ownership == "Owned") {
    //   obj.land_ownership = data['land_ownership'].value;
    // }land_ownership_id
    if(this.land_ownership){
      if (this.ownershipType == 1 || this.ownershipType == 3 || this.ownershipType == 2){
        obj.land_ownership = data['land_ownership'].value;
      }
    }
   
    obj.controlling_office_id = data['controlling_office_id'].value.id;
    console.log("obj", obj)
    return obj;
  }
  PremiseEditsubmitForm() {
    this.PremiseEditbtn=true
    if (this.PremiseEditForm.value.name === "") {
      this.toastr.error('Add Name Field', 'Empty value not Allowed', { timeOut: 1500 });
      // this.onCancel.emit()
      this.PremiseEditbtn=false;
      return false;
    }
    if (this.PremiseEditForm.value.name.trim() === "") {
      this.toastr.error('Add Name Field', ' WhiteSpace Not Allowed', { timeOut: 1500 });
      // this.onCancel.emit()
      this.PremiseEditbtn=false;
      return false;
    }
    // if (this.PremiseEditForm.value.name.trim().length > 20) {
    //   this.toastr.error('Not more than 20 characters', 'Enter valid Name', { timeOut: 1500 });
    //   // this.onCancel.emit()
    //   this.PremiseEditbtn=false;
    //   return false;
    // }
    if (this.PremiseEditForm.value.type === "") {
      this.toastr.error('Add Type Field', 'Empty value not Allowed', { timeOut: 1500 });
      // this.onCancel.emit()
      this.PremiseEditbtn=false;
      return false;
    }
    // if (this.PremiseEditForm.value.type.trim().length > 20){
    //   this.toastr.error('Not more than 20 characters','Enter valid Type' ,{timeOut: 1500});
    //   // this.onCancel.emit()
    //   return false;
    // }
    if (this.PremiseEditForm.value.rent_area === "") {
      this.toastr.error('Add Rent Area Field', 'Empty value not Allowed', { timeOut: 1500 });
      // this.onCancel.emit()
      this.PremiseEditbtn=false;
      return false;
    }
    if (this.PremiseEditForm.value.latitude === "") {
      this.toastr.error('Add Latitude Field', 'Empty value not Allowed', { timeOut: 1500 });
      // this.onCancel.emit()
      this.PremiseEditbtn=false;
      return false;
    }
    if (this.PremiseEditForm.value.longitude === "") {
      this.toastr.error('Add Longitude Field', 'Empty value not Allowed', { timeOut: 1500 });
      // this.onCancel.emit()
      this.PremiseEditbtn=false;
      return false;
    }
    // if (this.PremiseEditForm.value.rent_area.trim().length > 20){
    //   this.toastr.error('Not more than 20 characters','Enter valid Rent Area' ,{timeOut: 1500});
    //   // this.onCancel.emit()
    //   return false;
    // }
    // if (this.PremiseEditForm.value.type.trim()===""){
    //   this.toastr.error('Add Type Field',' WhiteSpace Not Allowed' ,{timeOut: 1500});
    //   // this.onCancel.emit()
    //   return false;
    // }
    // if (this.PremiseEditForm.value.rent_area.trim()===""){
    //   this.toastr.error('Add Rent Area Field',' WhiteSpace Not Allowed' ,{timeOut: 1500});
    //   // this.onCancel.emit()
    //   return false;
    // }
    if (this.PremiseEditForm.value.controlling_office_id === "") {
      this.toastr.error('Add Rent Paying Office Field', 'Empty value not Allowed', { timeOut: 1500 });
      // this.onCancel.emit()
      this.PremiseEditbtn=false;
      return false;
    }
    if (this.PremiseEditForm.controls.address.value.line1 === "") {
      this.toastr.error('Add No: Field', 'Empty value not Allowed', { timeOut: 1500 });
      // this.onCancel.emit()
      this.PremiseEditbtn=false;
      return false;
    }
    if (this.PremiseEditForm.controls.address.value.line1.trim() === "") {
      this.toastr.error('Add No: Field', ' WhiteSpace Not Allowed', { timeOut: 1500 });
      // this.onCancel.emit()
      this.PremiseEditbtn=false;
      return false;
    }
    if (this.PremiseEditForm.controls.address.value.line2 === "") {
      this.toastr.error('Add Street Field', 'Empty value not Allowed', { timeOut: 1500 });
      // this.onCancel.emit()
      this.PremiseEditbtn=false;
      return false;
    }
    if (this.PremiseEditForm.controls.address.value.line2.trim() === "") {
      this.toastr.error('Add Street Field', ' WhiteSpace Not Allowed', { timeOut: 1500 });
      // this.onCancel.emit()
      this.PremiseEditbtn=false;
      return false;
    }
    if (this.PremiseEditForm.controls.address.value.line3 === "") {
      this.toastr.error('Add Area Field', 'Empty value not Allowed', { timeOut: 1500 });
      // this.onCancel.emit()
      this.PremiseEditbtn=false;
      return false;
    }
    if (this.PremiseEditForm.controls.address.value.line3.trim() === "") {
      this.toastr.error('Add Area Field', ' WhiteSpace Not Allowed', { timeOut: 1500 });
      // this.onCancel.emit()
      this.PremiseEditbtn=false;
      return false;
    }
    if (this.PremiseEditForm.controls.address.value.city_id === "") {
      this.toastr.error('Add City Field', 'Empty value not Allowed', { timeOut: 1500 });
      // this.onCancel.emit()
      this.PremiseEditbtn=false;
      return false;
    }
    if (this.PremiseEditForm.controls.address.value.district_id === "") {
      this.toastr.error('Add District Field', 'Empty value not Allowed', { timeOut: 1500 });
      // this.onCancel.emit()
      this.PremiseEditbtn=false;
      return false;
    }
    if (this.PremiseEditForm.controls.address.value.state_id === "") {
      this.toastr.error('Add State Field', 'Empty value not Allowed', { timeOut: 1500 });
      // this.onCancel.emit()
      this.PremiseEditbtn=false;
      return false;
    }
    if (this.PremiseEditForm.controls.address.value.pincode_id === "") {
      this.toastr.error('Add Pincode Field', 'Empty value not Allowed', { timeOut: 1500 });
      // this.onCancel.emit()
      this.PremiseEditbtn=false;
      return false;
    }
    let idValue: any = this.PremiseIdValue
    //let data = this.PremiseEditForm.value
    this.dataService.editPremieForm(this.createFormat(), idValue)
      .subscribe(res => {
        if(res.id === undefined){
          this.notification.showError(res.description)
          this.PremiseEditbtn=false;
          return false


        }
       else{
        this.notification.showSuccess("Updated Successfully!...")
        // this.onSubmit.emit();
        this.router.navigate(['/rems/premiseView'], { skipLocationChange: isSkipLocationChange })
        console.log("premise edit form result ", res)
        return true
       }
      })
    
  }





  onCancelClick() {
    this.router.navigate(['/rems/premiseView'], { skipLocationChange: isSkipLocationChange });

  }

  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  numberOnlyAndDot(event) {
    var k;
    k = event.charCode;
    return (k == 46 || (k >= 48 && k <= 57));
  }

  


}
class ctrlofztype {
  name: string;
  type: string;
  rent_area: string;
  controlling_office_id: any;
  // rm_id: number;
  address: any;
  line1: string;
  line2: string;
  line3: string;
  city_id: any;
  district_id: any;
  state_id: any;
  pincode_id: any;
  land_ownership: any;
  latitude: any;
  longitude: any;
}
