import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router'
import { Rems2Service } from '../rems2.service'
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, tap, map, takeUntil, switchMap, finalize } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { RemsShareService } from '../rems-share.service'
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

@Component({
  selector: 'app-premise-create',
  templateUrl: './premise-create.component.html',
  styleUrls: ['./premise-create.component.scss']
})
export class PremiseCreateComponent implements OnInit {
  PremiseForm: FormGroup;
  @ViewChild('autoPrimary') matAutocompleteDept: MatAutocomplete;
  @ViewChild('primaryContactInput') primaryContactInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('cotype') matpriofficeAutocomplete: MatAutocomplete;
  @ViewChild('office1Input') office1Input: any;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  cityId: number;
  districtId: number;
  stateId: number;
  pincodeId: number;

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
  // premiseType = [{ id: 1, name: "LEASED" }, { id: 2, name: "OWNED" }, { id: 3, name: "RENT FREE" }]
  // premiseType = [{ id: 1, name: "LEASED" }, { id: 2, name: "OWNED" }, { id: 3, name: "RENT FREE" }]
  premiseIdenticationData: any;
  primaryContactList: any;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  identificationSearchData: any;
  premisesIdentificationId: number;
  types: string;

  premisesTypeData: any;
  ownershipData: any;
  landOwnerShipType: boolean;
  Premisebtn=false

  has_prinext = true;
  has_priprevious = true;
  pricurrentpage: number = 1;
  
  constructor(private fb: FormBuilder, private router: Router, private remsService2: Rems2Service,private remsshareService: RemsShareService,
    private dataService: RemsService, private toastr: ToastrService, private notification: NotificationService, ) { }

  // "name":"Premise2","type":"1","rent_area":"1","controlling_office_id":"1",

  ngOnInit(): void {
    this.PremiseForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      rent_area: ['', Validators.required],
      land_ownership: ['', Validators.required],
      code: '',
      latitude: [''],
      longitude: [''],
      controlling_office_id: ['', Validators.required],
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

    let ctrlofzkeyvalue: String = "";
    this.getControllingOfz(ctrlofzkeyvalue);
    this.PremiseForm.get('controlling_office_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;

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
      })


    let pinkeyvalue: String = "";
    this.getPinCode(pinkeyvalue);
    this.PremiseForm.controls.address.get('pincode_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
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
      })








    let citykeyvalue: String = "";
    this.getCity(citykeyvalue);
    this.PremiseForm.controls.address.get('city_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
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
      })



    let districtkeyvalue: String = "";
    this.getDistrict(districtkeyvalue);
    this.PremiseForm.controls.address.get('district_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
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
      })



    let statekeyvalue: String = "";
    this.getState(statekeyvalue);
    this.PremiseForm.controls.address.get('state_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;

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
      })


  this.premisesType();
  this.ownershipType();
   let premisesData : any = this.remsshareService.premisesCode.value
   let code = premisesData.premiseidentification.code
   this.PremiseForm.patchValue({
     "code": code,
   })
   let search = this.PremiseForm.value;
    console.log("code",search)
    this.remsService2.getPremiseIdentificationCodeSearch(search)
      .subscribe(result => {
        console.log("result",result)
        this.identificationSearchData = result.data;
        if(this.identificationSearchData.length == 0){
          this.toastr.warning('', 'Already Premises Created', { timeOut: 1500 });
        }
        this.identificationSearchData.forEach(element => {
          this.remsService2.getPremiseIdentificationEdit(element.id)
            .subscribe(results => {
              console.log("idddddddddddddd",results)
              this.premisesIdentificationId = results.id;
            
            })
        });
        let premise = this.identificationSearchData[0]
        if (premise.ownership_type.id == 1 || premise.ownership_type.id == 3 || premise.ownership_type.id == 4) {
          this.landOwnerShipType = true;
        } 
        else{
          this.landOwnerShipType = false;
        }
        this.PremiseForm.patchValue({
          "name": premise.premiseidentification_name[0].name,
          "type": premise.ownership_type.id,
          "rent_area": premise.premiseidentification_name[0].area,
          address:{
          "line1": premise.premiseidentification_name[0].address.line1,
          "line2": premise.premiseidentification_name[0].address.line2,
          "line3": premise.premiseidentification_name[0].address.line3,
          "city_id": premise.premiseidentification_name[0].address.city_id,
          "state_id": premise.premiseidentification_name[0].address.state_id,
          "district_id": premise.premiseidentification_name[0].address.district_id,
          "pincode_id": premise.premiseidentification_name[0].address.pincode_id
          }
      
        })
       
      })
    
  }

  public displayFn(cotype?: ctrlofzListss): string | undefined {
    return cotype ? cotype.name : undefined;
  }

  get cotype() {
    return this.PremiseForm.get('controlling_office_id');
  }


  private getControllingOfz(ctrlofzkeyvalue) {
    this.dataService.getControllingOfzDropDown(ctrlofzkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ControllingOfficeList = datas;
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





  public displayFnpin(pintype?: pinCodeListss): string | undefined {
    return pintype ? pintype.no : undefined;
  }

  get pintype() {
    return this.PremiseForm.controls.address.get('pincode_id');
  }

  private getPinCode(pinkeyvalue) {
    this.dataService.getPinCodeDropDown(pinkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.pinCodeList = datas;
      })
  }







  public displayFncity(citytype?: cityListss): string | undefined {
    return citytype ? citytype.name : undefined;
  }

  get citytype() {
    return this.PremiseForm.controls.address.get('city_id');
  }
  private getCity(citykeyvalue) {
    this.dataService.getCityDropDown(citykeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cityList = datas;
      })
  }





  public displayFndistrict(districttype?: districtListss): string | undefined {
    return districttype ? districttype.name : undefined;
  }

  get districttype() {
    return this.PremiseForm.controls.address.get('district_id');
  }
  private getDistrict(districtkeyvalue) {
    this.dataService.getDistrictDropDown(districtkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.districtList = datas;    
      })
  }



  public displayFnstate(statetype?: stateListss): string | undefined {
    return statetype ? statetype.name : undefined;
  }

  get statetype() {
    return this.PremiseForm.controls.address.get('state_id');
  }
  private getState(statekeyvalue) {
    this.dataService.getStateDropDown(statekeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.stateList = datas;
      })
  }

  pinCode(data) {
    this.cityId = data.city;
    this.districtId = data.district;
    this.stateId = data.state;
    this.pincodeId = data
    this.PremiseForm.patchValue({
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
    this.PremiseForm.patchValue({
      address: {
        city_id: this.cityId,
        state_id: this.stateId,
        district_id: this.districtId,
        pincode_id: this.pincodeId
      }
    })
  }

  createFormat() {
    let data = this.PremiseForm.controls;
    let datas = this.PremiseForm.controls.address;
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
    obj.rent_area = data['rent_area'].value;
    obj.latitude = data['latitude'].value;
    obj.longitude= data['longitude'].value;
    obj.land_ownership = data['land_ownership'].value;
    obj.controlling_office_id = data['controlling_office_id'].value.id;
    return obj;
  }


  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;
    return (k == 46 || (k >= 48 && k <= 57));
  }
  

  


  PremiseCreateForm() {
    this.Premisebtn=true
    if (this.PremiseForm.value.name === "") {
      this.toastr.error('Add Name Field', 'Empty value not Allowed', { timeOut: 1500 });
      this.Premisebtn=false;
      return false;
    }
    if (this.PremiseForm.value.code === "") {
      this.toastr.error('Add Code Field', 'Empty value not Allowed', { timeOut: 1500 });
      this.Premisebtn=false;
      return false;
    }
    if (this.PremiseForm.value.name.trim() === "") {
      this.toastr.error('Add Name Field', ' WhiteSpace Not Allowed', { timeOut: 1500 });
      this.Premisebtn=false;
      return false;
    }
    if (this.PremiseForm.value.type === "") {
      this.toastr.error('Add Type Field', 'Empty value not Allowed', { timeOut: 1500 });
      this.Premisebtn=false;
      return false;
    }
    if (this.PremiseForm.value.rent_area === "") {
      this.toastr.error('Add Rent Area Field', 'Empty value not Allowed', { timeOut: 1500 });
      this.Premisebtn=false;
      return false;
    }
    if (this.PremiseForm.value.controlling_office_id === "") {
      this.toastr.error('Add Rent Paying Office Field', 'Empty value not Allowed', { timeOut: 1500 });
      this.Premisebtn=false;
      return false;
    }
    if (this.PremiseForm.value.latitude === "") {
      this.toastr.error('Add Latitude Field', 'Empty value not Allowed', { timeOut: 1500 });
      this.Premisebtn=false;
      return false;
    }
    if (this.PremiseForm.value.longitude === "") {
      this.toastr.error('Add Longitude Field', 'Empty value not Allowed', { timeOut: 1500 });
      this.Premisebtn=false;
      return false;
    }
    // if (this.PremiseForm.value.rent_area.trim().length > 20) {
    //   this.toastr.error('Not more than 20 characters', 'Enter valid Rent Area', { timeOut: 1500 });
    //   // this.onCancel.emit()
    //   this.Premisebtn=false;
    //   return false;
    // }

    // if (this.PremiseForm.value.rent_area.trim() === "") {
    //   this.toastr.error('Add Rent Area Field', ' WhiteSpace Not Allowed', { timeOut: 1500 });
    //   // this.onCancel.emit()
    //   this.Premisebtn=false;
    //   return false;
    // }
  
    if (this.PremiseForm.controls.address.value.line1 === "") {
      this.toastr.error('Add No: Field', 'Empty value not Allowed', { timeOut: 1500 });
      this.Premisebtn=false;
      return false;
    }
    if (this.PremiseForm.controls.address.value.line1.trim() === "") {
      this.toastr.error('Add No: Field', ' WhiteSpace Not Allowed', { timeOut: 1500 });
      this.Premisebtn=false; 
      return false;
    }
    if (this.PremiseForm.controls.address.value.line2 === "") {
      this.toastr.error('Add Street Field', 'Empty value not Allowed', { timeOut: 1500 });
      this.Premisebtn=false;
      return false;
    }
    if (this.PremiseForm.controls.address.value.line2.trim() === "") {
      this.toastr.error('Add Street Field', ' WhiteSpace Not Allowed', { timeOut: 1500 });
      this.Premisebtn=false;
      return false;
    }
    if (this.PremiseForm.controls.address.value.line3 === "") {
      this.toastr.error('Add Area Field', 'Empty value not Allowed', { timeOut: 1500 });
      this.Premisebtn=false;
      return false;
    }
    if (this.PremiseForm.controls.address.value.line3.trim() === "") {
      this.toastr.error('Add Area Field', ' WhiteSpace Not Allowed', { timeOut: 1500 });
      this.Premisebtn=false;
      return false;
    }
    if (this.PremiseForm.controls.address.value.city_id === "") {
      this.toastr.error('Add City Field', 'Empty value not Allowed', { timeOut: 1500 });
      this.Premisebtn=false;
      return false;
    }
    if (this.PremiseForm.controls.address.value.district_id === "") {
      this.toastr.error('Add District Field', 'Empty value not Allowed', { timeOut: 1500 });
      this.Premisebtn=false;
      return false;
    }
    if (this.PremiseForm.controls.address.value.state_id === "") {
      this.toastr.error('Add State Field', 'Empty value not Allowed', { timeOut: 1500 });
      this.Premisebtn=false;
      return false;
    }
    if (this.PremiseForm.controls.address.value.pincode_id === "") {
      this.toastr.error('Add Pincode Field', 'Empty value not Allowed', { timeOut: 1500 });
      this.Premisebtn=false;
      return false;
    }



    this.dataService.PremiseCreateForm(this.createFormat(), this.premisesIdentificationId)
      .subscribe(result => {
        if(result.id === undefined){
          this.notification.showError(result.description)
          this.Premisebtn=false;
          return false


        }
        else {
          this.notification.showSuccess("Successfully created!...")
          this.router.navigate(['/rems/rems/remsSummary'], { skipLocationChange: isSkipLocationChange });
        }
      })

  }

  onCancelClick() {
    this.router.navigate(['/rems/rems/remsSummary'], { skipLocationChange: isSkipLocationChange });
    this.remsshareService.backtosum.next('approved_premise')
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
    return this.PremiseForm.get('rm_id');
  }

  private primaryContact(primaykey) {
    this.dataService.primaryContact(primaykey)
      .subscribe((results) => {
        let datas = results["data"];
        this.primaryContactList = datas;
      })
  }

  // identificationSearch() {
  //   let search = this.PremiseForm.value;
  //   console.log("code",search)
  //   this.remsService2.getPremiseIdentificationCodeSearch(search)
  //     .subscribe(result => {
  //       console.log("result",result)
  //       this.identificationSearchData = result.data;
  //       if(this.identificationSearchData.length == 0){
  //         this.toastr.warning('', 'Already Premises Created', { timeOut: 1500 });
  //       }
  //       this.identificationSearchData.forEach(element => {
  //         this.remsService2.getPremiseIdentificationEdit(element.id)
  //           .subscribe(results => {
  //             console.log("idddddddddddddd",results)
  //             this.premisesIdentificationId = results.id;
            
  //           })
  //       });
  //       let premise = this.identificationSearchData[0]
  //       if (premise.ownership_type.id == 1 || premise.ownership_type.id == 3 || premise.ownership_type.id == 4) {
  //         this.landOwnerShipType = true;
  //       } 
  //       else{
  //         this.landOwnerShipType = false;
  //       }
  //       this.PremiseForm.patchValue({
  //         "name": premise.premiseidentification_name[0].name,
  //         "type": premise.ownership_type.id,
  //         "rent_area": premise.premiseidentification_name[0].area,
  //         address:{
  //         "line1": premise.premiseidentification_name[0].address.line1,
  //         "line2": premise.premiseidentification_name[0].address.line2,
  //         "line3": premise.premiseidentification_name[0].address.line3,
  //         "city_id": premise.premiseidentification_name[0].address.city_id,
  //         "state_id": premise.premiseidentification_name[0].address.state_id,
  //         "district_id": premise.premiseidentification_name[0].address.district_id,
  //         "pincode_id": premise.premiseidentification_name[0].address.pincode_id
  //         }
      
  //       })
       
  //     })
  // }

 
  // identificationSearch() {
  //   let search = this.PremiseForm.value;
  //   this.remsService2.getIdentificationSearch(search)
  //     .subscribe(result => {
  //       this.identificationSearchData = result.data;
  //       this.identificationSearchData.forEach(element => {
  //         this.remsService2.getPremiseIdentificationEdit(element.id)
  //           .subscribe(result => {
  //             console.log("idddddddddddddd",result)
  //             this.premisesIdentificationId = result.id;
  //             this.PremiseForm.patchValue({
  //               "name": result.name,
  //             })
  //           })
  //       });
  //     })
  // }

  premisesType() {
    this.remsService2.premisesType()
      .subscribe((results) => {
        this.premisesTypeData = results.data;
      })
  }
  ownershipType() {
    this.remsService2.premisesType()
      .subscribe((result) => {
        let res = result.data;
        for(let i = 0; i < res.length; i++){
            res.splice(3, 1);
            this.ownershipData = res
            break;

          }
      })
  }

}



export interface PrimaryContact {
  id: number;
  full_name: string;
}




class ctrlofztype {
  name: string;
  type: string;
  rent_area: string;
  rm_id: number;
  controlling_office_id: any;
  address: any;
  line1: string;
  line2: string;
  line3: string;
  city_id: any;
  district_id: any;
  state_id: any;
  pincode_id: any;
  latitude: any;
  longitude: any;
  land_ownership: number;

}







