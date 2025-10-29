
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { NotificationService } from '../../service/notification.service'
import { RemsShareService } from '../rems-share.service'
import { RemsService } from '../rems.service';
import { Router } from '@angular/router';
import { Observable, fromEvent } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { filter, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { environment } from 'src/environments/environment'

const isSkipLocationChange = environment.isSkipLocationChange
export interface cityListss {
  name: string;
  id: number;
}
export interface distListss {
  name: string;
  id: number;
}
export interface stateListss {
  name: string;
  id: number;
}
export interface pinListss {
  no: string;
  id: number;
}
export interface TDS {
  name: string;
  id: number;
}

export interface TDSRate {
  rate: string;
  id: number;
}
export interface Landlord {
  name: string;
  id: number;
}


@Component({
  selector: 'app-landlord-edit',
  templateUrl: './landlord-edit.component.html',
  styleUrls: ['./landlord-edit.component.scss']
})
export class LandlordEditComponent implements OnInit {

  @ViewChild('rmemp') matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('rmInput') rmInput: any;


  @ViewChild('conoffice') matofficeAutocomplete: MatAutocomplete;
  @ViewChild('officeInput') officeInput: any;
  

  @ViewChild('ij') tdssection;

  @ViewChild('officeInput') tds_section;

  @ViewChild('landlord') matAutocompleteLandlord: MatAutocomplete;
  @ViewChild('lanlordInput') lanlordInput: any;


  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  LandlordEditForm: FormGroup;
  // LandlordForm: FormGroup;

  cityList1: Array<cityListss>;
  districtList1: Array<distListss>;
  stateList1: Array<stateListss>;
  pinCodeList1: Array<pinListss>;

  entitytypeList: any;
  inputGstValue = "";
  inputPanValue = "";
  landlordEditId: number;
  cityList: Array<cityListss>;
  city_id = new FormControl();
  districtList: Array<distListss>;
  district_id = new FormControl();
  stateList: Array<stateListss>;
  state_id = new FormControl();
  pinCodeList: Array<pinListss>;
  pincode_id = new FormControl();
  cityId: number;
  districtId: number;
  stateId: number;
  pincodeId: number;
  isLoading = false;
  premiseId: any;
  nri: number;
  poa: number;
  isNriDetails: boolean;
  isPoaDetails: boolean;

  // isNRI = false;
  isPOA = false;
  LandlordEditBtn=false;

  TDSList: Array<TDS>;
  has_tdsnext = true;
  has_tdsprevious = true;
  tdscurrentpage: number = 1;

  TDSRateList: Array<TDSRate>;
  has_offnext = true;
  has_offprevious = true;
  offcurrentpage: number = 1;
  tdssectionid = 0;

  landlordList: Array<Landlord>;
  has_landnext = true;
  has_landprevious = true;
  landcurrentpage: number = 1;
  isReadonly = false;
  tdsApplicable = [{ id: true, name: "Yes" }, { id: false, name: "No" }]
  landlordView : boolean
  
  constructor(private formbuilder: FormBuilder, private shareService: RemsShareService, private toastr:
    ToastrService,
    private notification: NotificationService, private remsservice: RemsService,
    private router: Router) { }

  ngOnInit(): void {
    let result = this.shareService.landlordEdit.value;
    console.log("landlordedit--shareservice", result)
    this.landlordEditId = result.id;
    let openMode = result.openMode
    if(openMode == "view")
      this.landlordView = true
    else
      this.landlordView = false

    // this.LandlordForm = this.formbuilder.group({
    //   landlord_id: [''],
    // }) 

    this.LandlordEditForm = this.formbuilder.group({
      vendor: ['', Validators.required],
      aadharno: ['', [Validators.pattern('[0-9]{12}')]],
      name: ['', Validators.required],
      panno: ['', Validators.required],
      gstno: [''],
      TDS_applicable: ['', Validators.required],
      entity_type: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', [Validators.required, Validators.email,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      is_nri: ['', Validators.required],
      is_poa: ['', Validators.required],
      // nri_localcontact: ['', Validators.required],

      contact_and_address: this.formbuilder.group({
        landlordname: ['', Validators.required],
        landlordcontact: ['', Validators.required],
        landlordemail: ['', Validators.required],
        landlordtype: ['', Validators.required],
        id: [''],

        address: this.formbuilder.group({
          line1: ['', Validators.required],
          line2: ['', Validators.required],
          line3: ['', Validators.required],
          city_id: ['', Validators.required],
          district_id: ['', Validators.required],
          state_id: ['', Validators.required],
          pincode_id: ['', Validators.required],
          id: [''],

        })
      }),
      address: this.formbuilder.group({
        line1: ['', Validators.required],
        line2: ['', Validators.required],
        line3: ['', Validators.required],
        city_id: ['', Validators.required],
        district_id: ['', Validators.required],
        state_id: ['', Validators.required],
        pincode_id: ['', Validators.required],
        id: [''],
      })

    })
    

    let citykeyvalue: String = "";
    this.getCity(citykeyvalue);
    this.LandlordEditForm.controls.address.get('city_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.remsservice.getCityDropDown(value)
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
    this.LandlordEditForm.controls.address.get('district_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.remsservice.getDistrictDropDown(value)
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
    this.LandlordEditForm.controls.address.get('state_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.remsservice.getStateDropDown(value)
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


    let pinkeyvalue: String = "";
    this.getPincode(pinkeyvalue);
    this.LandlordEditForm.controls.address.get('pincode_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),

        switchMap(value => this.remsservice.getPincodeDropDown(value)
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


    let citykeyvalue1: String = "";
    this.getCity1(citykeyvalue1);
    this.LandlordEditForm.controls.contact_and_address.get('address').get('city_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.remsservice.getCityDropDown(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cityList1 = datas;
      })

    let districtkeyvalue1: String = "";
    this.getDistrict1(districtkeyvalue1);
    this.LandlordEditForm.controls.contact_and_address.get('address').get('district_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.remsservice.getDistrictDropDown(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.districtList1 = datas;
      })

    let statekeyvalue1: String = "";
    this.getState1(statekeyvalue1);
    this.LandlordEditForm.controls.contact_and_address.get('address').get('state_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.remsservice.getStateDropDown(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.stateList1 = datas;
      })


    let pinkeyvalue1: String = "";
    this.getPincode1(pinkeyvalue1);
    this.LandlordEditForm.controls.contact_and_address.get('address').get('pincode_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.remsservice.getPincodeDropDown(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.pinCodeList1 = datas;
      })


      // let tdsvalue: String = "";
      // this.getTDSSection(tdsvalue);
      // this.LandlordEditForm.get('TDS_section').valueChanges
      // .pipe(
      //   debounceTime(100),
      //   distinctUntilChanged(),
      //   tap(() => {
      //     this.isLoading = true;
      //     console.log('inside tap')

      //   }),
      //   switchMap(value => this.remsservice.TDSSection(value, 1)
      //     .pipe(
      //       finalize(() => {
      //         this.isLoading = false
      //       }),
      //     )
      //   )
      // )
      // .subscribe((results: any[]) => {
      //   let datas = results["data"];
      //   this.TDSList = datas;

      // })


      let tdsRatevalue: String = "";
      this.getTDSRate(this.tdssectionid, tdsRatevalue);
  
    let landlordvalue: String = "";
    this.getLandlord(landlordvalue);
    this.LandlordEditForm.get('vendor').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.remsservice.landlordName(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.landlordList = datas;
      })



    this.getEntityType();
    this.getPremiseId();
    this.getLandlordEditForm()
  }
  autocompletelandlordScroll() {
    setTimeout(() => {
      if (
        this.matAutocompleteLandlord &&
        this.autocompleteTrigger &&
        this.matAutocompleteLandlord.panel
      ) {
        fromEvent(this.matAutocompleteLandlord.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matAutocompleteLandlord.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matAutocompleteLandlord.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteLandlord.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteLandlord.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_landnext === true) {
                this.remsservice.landlordScroll(this.lanlordInput.nativeElement.value, this.landcurrentpage + 1, 'all')
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.landlordList = this.landlordList.concat(datas);
                    if (this.landlordList.length >= 0) {
                      this.has_landnext = datapagination.has_next;
                      this.has_landprevious = datapagination.has_previous;
                      this.landcurrentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  public displayFnLandlord(landlord?: Landlord): string | undefined {
    return landlord ? landlord.name : undefined;
  }

  get landlord() {
    return this.LandlordEditForm.get('vendor');
  }

  private getLandlord(primaykey) {
    this.remsservice.landlordName(primaykey)
      .subscribe((results) => {
        let datas = results["data"];
        this.landlordList = datas;
      })
  }

  vendorname: string;
  vendor_Id =  0;
  branch_Id: any;
  vendorName(data) {
    this.vendor_Id= data.vendor_id;
    this.vendorname = data.name;
    this.branch_Id = data.id;
    this.remsservice.getVendor(this.vendor_Id, this.branch_Id)
      .subscribe((result) => {
    this.LandlordEditForm.patchValue({
      "name":this.vendorname,
      "panno":result.panno,
      "gstno":result.gstno,
      "aadharno":result.adhaarno,
      "mobile":result.contact_id.mobile,
      "email":result.contact_id.email,
      address: {
        "line1": result.address_id.line1,
        "line2": result.address_id.line2,
        "line3": result.address_id.line3,
        "city_id": result.address_id.city_id,
        "district_id": result.address_id.district_id,
        "state_id": result.address_id.state_id,
        "pincode_id": result.address_id.pincode_id,

      }
    })
  })
  this.isReadonly = true;  
  }

  getPremiseId() {
    this.premiseId = this.shareService.premiseViewID.value
    console.log("premise--idd", this.premiseId)
  }

  private getEntityType() {
    this.remsservice.getEntityType()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.entitytypeList = datas;
      })
  }

  validationPAN(e) {
    // let panno = e.target.value;
    // this.remsservice.getlandlordPanNumber(panno)
    //   .subscribe(res => {
    //     let result = res.validation_status
    //     if (result === false) {
    //       this.notification.showWarning("Please Enter a Valid PAN Number")
    //     } else {
    //       this.notification.showSuccess("PAN Number validated...")
    //     }

    //   })
  }

  validationGstNo(e) {
    // let gstno = e.target.value;
    // this.remsservice.getlandlordGstNumber(gstno)
    //   .subscribe(res => {
    //     let result = res.validation_status
    //     if (result === false) {
    //       this.notification.showWarning("Please Enter a Valid GST Number")
    //     } else {
    //       this.notification.showSuccess("GST Number validated...")
    //     }
    //   })
  }


  checkedtrue(data) {
    if (data == true) {
      this.isNriDetails = true;
      // this.isNRI = true;
      this.LandlordEditForm.controls.contact_and_address.reset()
      this.isPOA = false;
    } else {
      this.isNriDetails = false;
      // this.isNRI = false;
      this.isPOA = false;

    }
    console.log("checkedtrue", data)
  }

  checkedtrue1(data) {
    if (data == true) {
      this.isPoaDetails = true;
      // this.isNRI = false;
      this.isPOA = true;
      this.LandlordEditForm.controls.contact_and_address.reset()
    } else {
      this.isPoaDetails = false;
      // this.isNRI = false;
      this.isPOA = false;

    }
    console.log("checkedtrue1", data)
  }
  // checkedtrue1(data) {
  //   if (data == true) {
  //     this.isPoaDetails = true;
  //   }else{
  //     this.isPoaDetails = false;

  //   }
  //   console.log("checkedtrue1", data)
  // }

  // checkedtrue(data) {
  //   if (data == true) {
  //     this.isNriDetails = true;
  //   }else{
  //     this.isNriDetails = false;

  //   }
  //   console.log("checkedtrue", data)
  // }
  name1: any;
  contact1: any;
  emai1: any;
  contactid: any;
  type: any;
  A1: any;
  A2: any;
  A3: any;
  City1: any;
  District1: any;
  State1: any;
  Pincode1: any;
  addressid1: any;
  vendorID: any;

  getLandlordEditForm() {
    this.remsservice.landLordView(this.premiseId, this.landlordEditId)
      .subscribe(result => {
        this.vendorID = result.vendor_id.vendor_id;
        console.log("approvedvendorname",this.vendorID)

        // this.remsservice.getVendor(this.vendorID, this.branch_Id)
        // .subscribe((res) => {
          
  
    let aadharNo = result.aadharno;
    let Name = result.name;
    let branch = result.vendor_id
    this.inputPanValue = result.panno;
    this.inputGstValue = result.gstno ? result.gstno : "";
    let TDS_appl = result.TDS_applicable ? result.TDS_applicable : false;
    let TDS_rate = result.TDS_rate;
    let Entity_id = result.entity_type_id;
    let Mobile = result.mobile;
    let Email = result.email;
    let is_nri = result.is_nri;
    let Power_of_Attorney = result.is_poa;
    // let NRI_localcontact = result.nri_localcontact;
    if (result.landlordcontactdtls === null) {
      this.name1 = "",
      this.contact1 = "",
      this.emai1 = "",
      this.contactid = "",
      this.type = "",
      this.A1 = "",
      this.A2 = "",
      this.A3 = "",
      this.City1 = "",
      this.District1 = "",
      this.State1 = "",
      this.Pincode1 = "",
      this.addressid1 = ""

    } else {
      this.name1 = result.landlordcontactdtls.landlordname;
      this.contact1 = result.landlordcontactdtls.landlordcontact;
      this.emai1 = result.landlordcontactdtls.landlordemail;
      this.contactid = result.landlordcontactdtls.landlordcontact_id;
      this.type = result.landlordcontactdtls.landlordtype;

      let nriaddress = result.landlordcontactdtls.landlordaddress;
      this.A1 = nriaddress.line1;
      this.A2 = nriaddress.line2;
      this.A3 = nriaddress.line3;
      this.City1 = nriaddress.city_id;
      this.District1 = nriaddress.district_id;
      this.State1 = nriaddress.state_id;
      this.Pincode1 = nriaddress.pincode_id;
      this.addressid1 = nriaddress.id;

    }

    // if (result.is_nri == true && result.is_poa == false) {
    //   this.isNRI = true;
    // }
    if ((result.is_nri == false && result.is_poa == true) || (result.is_nri == true && result.is_poa == true)) {
      this.isPOA = true;
    }
    if (result.is_nri == false && result.is_poa == false) {
      // this.isNRI = false;
      this.isPOA = false;
    }



    let Address = result.address;
    let Address1 = Address.line1;
    let Address2 = Address.line2;
    let Address3 = Address.line3;
    let City = Address.city_id;
    let District = Address.district_id;
    let State = Address.state_id;
    let Pincode = Address.pincode_id;
    let addressid = Address.id;

    this.LandlordEditForm.patchValue({
      aadharno: aadharNo,
      name: Name,
      panno: this.inputPanValue,
      gstno: this.inputGstValue,
      vendor: branch,
      TDS_applicable: TDS_appl,
      entity_type: Entity_id,
      mobile: Mobile,
      email: Email,
      is_nri: is_nri,
      is_poa: Power_of_Attorney,
      

      contact_and_address: {
        landlordname: this.name1,
        landlordcontact: this.contact1,
        landlordemail: this.emai1,
        landlordtype: this.type,
        id: this.contactid,

        address: {
          line1: this.A1,
          line2: this.A2,
          line3: this.A3,
          city_id: this.City1,
          district_id: this.District1,
          state_id: this.State1,
          pincode_id: this.Pincode1,
          id: this.addressid1,

        }
      },

      address: {
        line1: Address1,
        line2: Address2,
        line3: Address3,
        city_id: City,
        district_id: District,
        state_id: State,
        pincode_id: Pincode,
        id: addressid
      }
    })
    this.isReadonly = true;
  // })
  })
  }

  Reset(){
    this.isReadonly = false;
    this.LandlordEditForm.reset();
    this.ngOnInit()
  }
  

  public displayFnRm(rmemp?: TDS): string | undefined {
    return rmemp ?  rmemp.name : undefined;
  }

  get rmemp() {
    return this.LandlordEditForm.value.get('TDS_section');
  }

  private getTDSSection(id,rmkeyvalue) {
    this.remsservice.getTDSSearchFilterWithVendorId(id, rmkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.TDSList = datas;
      })
  }
  autocompleteRMScroll() {
    setTimeout(() => {
      if (
        this.matAutocomplete &&
        this.autocompleteTrigger &&
        this.matAutocomplete.panel
      ) {
        fromEvent(this.matAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_tdsnext === true) {
                this.remsservice.TDSSectionWithVendorId(this.vendor_Id,this.rmInput.nativeElement.value, this.tdscurrentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.TDSList = this.TDSList.concat(datas);
                    if (this.TDSList.length >= 0) {
                      this.has_tdsnext = datapagination.has_next;
                      this.has_tdsprevious = datapagination.has_previous;
                      this.tdscurrentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }


  clear() {
    this.tds_section.nativeElement.value = ' ';
  
  }

  TDSSelectionName: string;
  selectTDSSection(data) {

    this.tdssectionid = data.id;
    this.TDSSelectionName = data.name;
    console.log("TDSSelectionName",this.TDSSelectionName)
    console.log("id", this.tdssectionid)
    this.getTDSRate(data.id, '')
  }




  public displayconoffice(conoffice?: TDSRate): string | undefined {
    return conoffice ? conoffice.rate: undefined;
    
  }

  get conoffice() {
    return this.LandlordEditForm.value.get('TDS_rate');
  }

  private getTDSRate(id, officekeyvalue) {
    this.remsservice.getTDSRateSearchFilter(id,officekeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.TDSRateList = datas;
      })
  }

  conofficeScroll() {
    setTimeout(() => {
      if (
        this.matofficeAutocomplete &&
        this.autocompleteTrigger &&
        this.matofficeAutocomplete.panel
      ) {
        fromEvent(this.matofficeAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matofficeAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matofficeAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matofficeAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matofficeAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_offnext === true) {
                this.remsservice.TDSRate(this.tdssectionid,this.officeInput.nativeElement.value, this.offcurrentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.TDSRateList = this.TDSRateList.concat(datas);
                    if (this.TDSRateList.length >= 0) {
                      this.has_offnext = datapagination.has_next;
                      this.has_offprevious = datapagination.has_previous;
                      this.offcurrentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  b : any;

  landlordEditCreateForm() {
    this.LandlordEditBtn=true;
  //   if (this.LandlordEditForm.value.gstno === "") {
  //     this.LandlordEditForm.value.gstno = null
  //   }
  //   if (this.LandlordEditForm.value.name === "") {
  //     this.toastr.error('Please Enter Name');;
  //     this.LandlordEditBtn=false;
  //     return false;
  //   }
  //   // if (this.LandlordEditForm.value.panno === "") {
  //   //   this.toastr.error('Please Enter PAN Name');;
  //   //   this.LandlordEditBtn=false;
  //   //   return false;
  //   // }
  //   if (this.LandlordEditForm.value.aadharno === "") {
  //     this.LandlordEditForm.value.gstno = null
  //     // this.toastr.error('Please Enter Aadhar Number');;
  //     // this.LandlordEditBtn=false;
  //     return false;
  //   }
  //   if(this.LandlordEditForm.value.aadharno != "" && this.LandlordEditForm.value.aadharno != undefined){
  //   if (this.LandlordEditForm.value.aadharno.length != 12) {
  //     this.toastr.error('Please Enter Valid Aadhar Number');;
  //     this.LandlordEditBtn=false;
  //     return false;
  //   }
  // }
    // if (this.LandlordEditForm.value.entity_type === "") {
    //   this.toastr.error('Please Select Any One Entity Type');;
    //   this.LandlordEditBtn=false;
    //   return false;
    // }
    if (this.LandlordEditForm.value.TDS_applicable === "") {
      this.toastr.error('Please Select TDS Applicable');;
      this.LandlordEditBtn=false;
      return false;
    }
    // if (this.LandlordEditForm.value.mobile === "") {
    //   this.toastr.error('Please Enter Mobile Number');;
    //   this.LandlordEditBtn=false;
    //   return false;
    // }
    // if (this.LandlordEditForm.value.mobile.length != 10) {
    //   this.toastr.error('Please Enter Valid Mobile Number');
    //   this.LandlordEditBtn=false;
    //   return false;
    // }
    // if (this.LandlordEditForm.controls.address.value.line1 === "") {
    //   this.toastr.error('Add No: Field', 'Empty value not Allowed', { timeOut: 1500 });
    //   this.LandlordEditBtn=false;
    //   return false;
    // }
    // if (this.LandlordEditForm.controls.address.value.line1.trim() === "") {
    //   this.toastr.error('Add No: Field', ' WhiteSpace Not Allowed', { timeOut: 1500 });
    //   this.LandlordEditBtn=false; 
    //   return false;
    // }
    // if (this.LandlordEditForm.controls.address.value.line2 === "") {
    //   this.toastr.error('Add Street Field', 'Empty value not Allowed', { timeOut: 1500 });
    //   this.LandlordEditBtn=false;
    //   return false;
    // }
    // if (this.LandlordEditForm.controls.address.value.line2.trim() === "") {
    //   this.toastr.error('Add Street Field', ' WhiteSpace Not Allowed', { timeOut: 1500 });
    //   this.LandlordEditBtn=false;
    //   return false;
    // }
    // if (this.LandlordEditForm.controls.address.value.line3 === "") {
    //   this.toastr.error('Add Area Field', 'Empty value not Allowed', { timeOut: 1500 });
    //   this.LandlordEditBtn=false;
    //   return false;
    // }
    // if (this.LandlordEditForm.controls.address.value.line3.trim() === "") {
    //   this.toastr.error('Add Area Field', ' WhiteSpace Not Allowed', { timeOut: 1500 });
    //   this.LandlordEditBtn=false;
    //   return false;
    // }
    // if (this.LandlordEditForm.controls.address.value.city_id === "") {
    //   this.toastr.error('Add City Field', 'Empty value not Allowed', { timeOut: 1500 });
    //   this.LandlordEditBtn=false;
    //   return false;
    // }
    // if (this.LandlordEditForm.controls.address.value.district_id === "") {
    //   this.toastr.error('Add District Field', 'Empty value not Allowed', { timeOut: 1500 });
    //   this.LandlordEditBtn=false;
    //   return false;
    // }
    // if (this.LandlordEditForm.controls.address.value.state_id === "") {
    //   this.toastr.error('Add State Field', 'Empty value not Allowed', { timeOut: 1500 });
    //   this.LandlordEditBtn=false;
    //   return false;
    // }
    // if (this.LandlordEditForm.controls.address.value.pincode_id === "") {
    //   this.toastr.error('Add Pincode Field', 'Empty value not Allowed', { timeOut: 1500 });
    //   this.LandlordEditBtn=false;
    //   return false;
    // }
    
    if (this.isNriDetails == true && ((this.isPoaDetails == false )|| (this.isPoaDetails == undefined)) || (this.isNriDetails == true && this.isPoaDetails == false)) {
      this.nri = 2
      this.LandlordEditForm.controls.contact_and_address.value.landlordtype = this.nri
    }
    if ((((this.isNriDetails == false )|| (this.isNriDetails == undefined)) && this.isPoaDetails == true) || (this.isNriDetails == true && this.isPoaDetails == true) || (this.isNriDetails == false && this.isPoaDetails == true)) {
      this.poa = 1
      this.LandlordEditForm.controls.contact_and_address.value.landlordtype = this.poa
    }


    this.LandlordEditForm.controls.address.value.city_id = this.LandlordEditForm.controls.address.value.city_id.id
    this.LandlordEditForm.controls.address.value.state_id = this.LandlordEditForm.controls.address.value.state_id.id
    this.LandlordEditForm.controls.address.value.district_id = this.LandlordEditForm.controls.address.value.district_id.id
    this.LandlordEditForm.controls.address.value.pincode_id = this.LandlordEditForm.controls.address.value.pincode_id.id
    this.LandlordEditForm.value.vendor = this.LandlordEditForm.value.vendor.id

    if(this.LandlordEditForm.controls.contact_and_address.get('address').value.city_id != null){
    this.LandlordEditForm.controls.contact_and_address.get('address').value.city_id = this.LandlordEditForm.controls.contact_and_address.get('address').value.city_id.id
    this.LandlordEditForm.controls.contact_and_address.get('address').value.district_id = this.LandlordEditForm.controls.contact_and_address.get('address').value.district_id.id
    this.LandlordEditForm.controls.contact_and_address.get('address').value.state_id = this.LandlordEditForm.controls.contact_and_address.get('address').value.state_id.id
    this.LandlordEditForm.controls.contact_and_address.get('address').value.pincode_id = this.LandlordEditForm.controls.contact_and_address.get('address').value.pincode_id.id
    }

    if (this.isNriDetails === undefined && this.isPoaDetails === undefined || this.isNriDetails === false && this.isPoaDetails === false || (this.isNriDetails === true && ((this.isPoaDetails == false )|| (this.isPoaDetails == undefined)))){

      this.b = this.LandlordEditForm.controls.contact_and_address.get('address').value
    
      for(let i in this.b){
        if (!this.b[i]){
            delete this.b[i]
        }
      }
  
      console.log("b",this.b)
  
      let a = this.LandlordEditForm.controls.contact_and_address.value
      for(let i in a){
        if (!a[i]){
           delete a[i]
        }
      }
      console.log("a",a)
    
      // let c = this.LandlordAddForm.controls.contact_and_address.value
      // for(let i in c){
      //   if (!c[i].address){
      //     // delete c[i].address
      //     // this.LandlordAddForm.controls.contact_and_address = {}
      //     // var json = { ... };
      //     // var key = "foo";
      //    delete c[address];
      //   }
      // }
     
      // console.log("c",c)
     
   }




    this.remsservice.landlordEditCreateForm(this.landlordEditId, this.LandlordEditForm.value, this.premiseId,this.TDSSelectionName)
      .subscribe(result => {
        console.log("L----edit", result)
        let code = result.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Modify before getting the Approval")
          this.LandlordEditBtn=false;
        }
         else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!...")
          this.LandlordEditBtn=false;
        } else {
          this.notification.showSuccess("Successfully Updated!...")
          this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Landlord Details" }, skipLocationChange: isSkipLocationChange });
          this.shareService.landlordFlag.next(true)
          return true
        }
      })
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  public displayFnpin(pintype?: pinListss): string | undefined {
    return pintype ? pintype.no : undefined;
  }

  get pintype() {
    return this.LandlordEditForm.controls.address.get('pincode_id');
  }

  private getPincode(pinkeyvalue) {
    this.remsservice.getPincodeDropDown(pinkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.pinCodeList = datas;
      })
  }


  pinCode(data) {
    this.cityId = data.city;
    this.districtId = data.district;
    this.stateId = data.state;
    this.pincodeId = data;
    this.LandlordEditForm.patchValue({
      address: {
        city_id: this.cityId,
        district_id: this.districtId,
        state_id: this.stateId,
        pincode_id: this.pincodeId
      }
    })
  }

  public displayFncity(citytype?: cityListss): string | undefined {
    return citytype ? citytype.name : undefined;
  }

  get citytype() {
    return this.LandlordEditForm.controls.address.get('city_id');
  }

  private getCity(citykeyvalue) {
    this.remsservice.getCityDropDown(citykeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cityList = datas;
      })
  }

  citys(data) {
    this.cityId = data;
    this.districtId = data.district;
    this.stateId = data.state;
    this.pincodeId = data.pincode;
    this.LandlordEditForm.patchValue({
      address: {
        city_id: this.cityId,
        state_id: this.stateId,
        district_id: this.districtId,
        pincode_id: this.pincodeId
      }
    })
  }

  public displayFnstate(statetype?: stateListss): string | undefined {
    return statetype ? statetype.name : undefined;
  }

  get statetype() {
    return this.LandlordEditForm.controls.address.get('state_id');
  }

  private getState(statekeyvalue) {
    this.remsservice.getCityDropDown(statekeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.stateList = datas;
      })
  }

  public displayFndistrict(districttype?: distListss): string | undefined {
    return districttype ? districttype.name : undefined;
  }

  get districttype() {
    return this.LandlordEditForm.controls.address.get('district_id');
  }

  private getDistrict(districtkeyvalue) {
    this.remsservice.getDistrictDropDown(districtkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.districtList = datas;
      })
  }





  public displayFnpin1(pintype1?: pinListss): string | undefined {
    return pintype1 ? pintype1.no : undefined;
  }

  get pintype1() {
    return this.LandlordEditForm.controls.contact_and_address.get('address').get('pincode_id');
  }

  private getPincode1(pinkeyvalue) {
    this.remsservice.getPincodeDropDown(pinkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.pinCodeList1 = datas;
      })
  }


  pinCode1(data) {
    this.cityId = data.city;
    this.districtId = data.district;
    this.stateId = data.state;
    this.pincodeId = data;
    this.LandlordEditForm.controls.contact_and_address.get('address').patchValue({
      // address: {
      city_id: this.cityId,
      district_id: this.districtId,
      state_id: this.stateId,
      pincode_id: this.pincodeId
      // }
    })
  }

  public displayFncity1(citytype1?: cityListss): string | undefined {
    return citytype1 ? citytype1.name : undefined;
  }

  get citytype1() {
    return this.LandlordEditForm.controls.contact_and_address.get('address').get('city_id');
  }

  private getCity1(citykeyvalue) {
    this.remsservice.getCityDropDown(citykeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cityList1 = datas;
      })
  }

  citys1(data) {
    this.cityId = data;
    this.districtId = data.district;
    this.stateId = data.state;
    this.pincodeId = data.pincode;
    this.LandlordEditForm.controls.contact_and_address.get('address').patchValue({
      // address: {
      city_id: this.cityId,
      state_id: this.stateId,
      district_id: this.districtId,
      pincode_id: this.pincodeId
      // }
    })
  }

  public displayFnstate1(statetype1?: stateListss): string | undefined {
    return statetype1 ? statetype1.name : undefined;
  }

  get statetype1() {
    return this.LandlordEditForm.controls.contact_and_address.get('address').get('state_id');
  }

  private getState1(statekeyvalue) {
    this.remsservice.getCityDropDown(statekeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.stateList = datas;
        console.log("stateList", datas)

      })
  }

  public displayFndistrict1(districttype1?: distListss): string | undefined {
    return districttype1 ? districttype1.name : undefined;
  }

  get districttype1() {
    return this.LandlordEditForm.controls.contact_and_address.get('address').get('district_id');
  }

  private getDistrict1(districtkeyvalue) {
    this.remsservice.getDistrictDropDown(districtkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.districtList1 = datas;
      })
  }

  onCancelClick() {
    this.onCancel.emit()
    this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Landlord Details" }, skipLocationChange: isSkipLocationChange });
    return true
  }


}
class landlord {
  aadharno: number;
  name: string;
  panno: string;
  gstno: string;
  TDS_section: any;
  TDS_rate: any;
  entity_type: string;
  mobile: number;
  email: string;
  is_nri: string;
  is_poa: string;
  nri_localcontact: string;
  address: any;
  line1: string;
  line2: string;
  line3: string;
  city_id: any;
  district_id: number;
  state_id: number;
  pincode_id: number;
  landlordtype: any;
  landlordname: string;
  landlordcontact: string;
  landlordemail: string;

}