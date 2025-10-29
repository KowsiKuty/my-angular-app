import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { RemsService } from '../rems.service';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, fromEvent } from 'rxjs';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { RemsShareService } from '../rems-share.service'
import { filter, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
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
  selector: 'app-landlord-create',
  templateUrl: './landlord-create.component.html',
  styleUrls: ['./landlord-create.component.scss']
})

export class LandlordCreateComponent implements OnInit {

  @ViewChild('rmemp') matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('rmInput') rmInput: any;


  @ViewChild('conoffice') matofficeAutocomplete: MatAutocomplete;
  @ViewChild('officeInput') officeInput: any;
  

  @ViewChild('ij') tdssection;

  @ViewChild('officeInput') tds_section;

  @ViewChild('landlord') matAutocompleteLandlord: MatAutocomplete;
  @ViewChild('lanlordInput') lanlordInput: any;

  LandlordAddForm: FormGroup;
  LandlordForm: FormGroup;
  entitytypeList: any;
  cityList: Array<cityListss>;
  city_id = new FormControl();
  districtList: Array<distListss>;
  district_id = new FormControl();
  stateList: Array<stateListss>;
  state_id = new FormControl();
  pinCodeList: Array<pinListss>;
  pincode_id = new FormControl();

  cityList1: Array<cityListss>;
  districtList1: Array<distListss>;
  stateList1: Array<stateListss>;
  pinCodeList1: Array<pinListss>;

  TDSList: Array<TDS>;
  has_tdsnext = true;
  has_tdsprevious = true;
  tdscurrentpage: number = 1;

  TDSRateList: Array<TDSRate>;
  has_offnext = true;
  has_offprevious = true;
  offcurrentpage: number = 1;

 
  inputGstValue = "";
  inputPanValue = "";
  cityId: number;
  districtId: number;
  stateId: number;
  pincodeId: number;
  isLoading = false;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  premiseId: any;
  isNriDetails: boolean;
  isPoaDetails: boolean;
  nri: number;
  poa: number;
  // isNRI = false;
  isPOA = false;
  LandlordBtn=false;
  tdssectionid = 0;

  landlordList: Array<Landlord>;
  has_landnext = true;
  has_landprevious = true;
  landcurrentpage: number = 1;
  isReadonly = false;
  tdsApplicable = [{ id: true, name: "Yes" }, { id: false, name: "No" }]
  
  constructor(private formBuilder: FormBuilder, private remsservice: RemsService, private remsshareService: RemsShareService,
    private notification: NotificationService, private router: Router, private toastr: ToastrService,private shareService: RemsShareService, ) { }

  ngOnInit(): void {

    this.LandlordForm = this.formBuilder.group({
      landlord_id: [''],
    }) 

    this.LandlordAddForm = this.formBuilder.group({

      // name: ['', Validators.required, Validators.pattern('^[a-z0-9_-]{8,15}$')],
      name: ['', Validators.required],
      panno: [''],
      gstno: [''],
      aadharno: ['', [Validators.pattern('[0-9]{12}')]],
      TDS_applicable: ['', Validators.required],
      entity_type: ['', Validators.required],
      mobile: ['', Validators.required],
      email: [''],
      // nri_localcontact: ['', Validators.required],
      is_nri: false,
      is_poa: false,

      contact_and_address: this.formBuilder.group({
      landlordname: ['', Validators.required],
      landlordcontact: ['', Validators.required],
      landlordemail: ['', Validators.required],
      landlordtype: ['', Validators.required],

      address: this.formBuilder.group({
        line1: ['', Validators.required],
        line2: ['', Validators.required],
        line3: ['', Validators.required],
        city_id: ['', Validators.required],
        district_id: ['', Validators.required],
        state_id: ['', Validators.required],
        pincode_id: ['', Validators.required],

      })
    }),
   
      address: this.formBuilder.group({
        line1: ['', Validators.required],
        line2: ['', Validators.required],
        line3: ['', Validators.required],
        city_id: ['', Validators.required],
        district_id: ['', Validators.required],
        state_id: ['', Validators.required],
        pincode_id: ['', Validators.required],

      })

    })
    let citykeyvalue: String = "";
    this.getCity(citykeyvalue);
    this.LandlordAddForm.controls.address.get('city_id').valueChanges
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
    this.LandlordAddForm.controls.address.get('district_id').valueChanges
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
    this.LandlordAddForm.controls.address.get('state_id').valueChanges
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
    this.LandlordAddForm.controls.address.get('pincode_id').valueChanges
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
        this.pinCodeList = datas;
      })




      let citykeyvalue1: String = "";
    this.getCity1(citykeyvalue1);
    this.LandlordAddForm.controls.contact_and_address.get('address').get('city_id').valueChanges
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
    this.LandlordAddForm.controls.contact_and_address.get('address').get('district_id').valueChanges
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
    this.LandlordAddForm.controls.contact_and_address.get('address').get('state_id').valueChanges
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
    this.LandlordAddForm.controls.contact_and_address.get('address').get('pincode_id').valueChanges
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
      // this.getTDSSection(this.vendor_Id,tdsvalue);
      // this.LandlordAddForm.get('TDS_section').valueChanges
      // .pipe(
      //   debounceTime(100),
      //   distinctUntilChanged(),
      //   tap(() => {
      //     this.isLoading = true;
      //     console.log('inside tap')

      //   }),
      //   switchMap(value => this.remsservice.TDSSectionWithVendorId(this.vendor_Id,value, 1)
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
    this.LandlordForm.get('landlord_id').valueChanges
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
    return this.LandlordForm.get('landlord_id');
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
    console.log("bbbbbbbbb",data)
    this.vendor_Id= data.vendor_id;
    this.vendorname = data.name;
    this.branch_Id = data.id;
    this.remsservice.getVendor(this.vendor_Id,this.branch_Id)
      .subscribe((result) => {
    this.LandlordAddForm.patchValue({
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

     // let tdsvalue: String = "";
    //   this.getTDSSection(this.vendor_Id,tdsvalue);
    //   this.LandlordAddForm.get('TDS_section').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),
    //     switchMap(value => this.remsservice.TDSSection(this.vendorname,this.vendor_Id,value, 1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.TDSList = datas;

    //   })
      
  }

  Reset(){
    this.isReadonly = false;
    this.LandlordAddForm.reset();
    this.LandlordForm.reset();
    this.ngOnInit()
  }

  public displayFnRm(rmemp?: TDS): string | undefined {
    return rmemp ?  rmemp.name : undefined;
  }

  get rmemp() {
    return this.LandlordAddForm.value.get('TDS_section');
  }

  private getTDSSection(id,rmkeyvalue) {
    this.remsservice.getTDSSearchFilterWithVendorId(id, rmkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.TDSList = datas;
      })
  }

  // autocompleteRMScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matAutocomplete &&
  //       this.autocompleteTrigger &&
  //       this.matAutocomplete.panel
  //     ) {
  //       fromEvent(this.matAutocomplete.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.matAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.matAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_tdsnext === true) {
  //               this.remsservice.TDSSection(this.rmInput.nativeElement.value, this.tdscurrentpage + 1)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.TDSList = this.TDSList.concat(datas);
  //                   if (this.TDSList.length >= 0) {
  //                     this.has_tdsnext = datapagination.has_next;
  //                     this.has_tdsprevious = datapagination.has_previous;
  //                     this.tdscurrentpage = datapagination.index;
  //                   }
  //                 })
  //             }
  //           }
  //         });
  //     }
  //   });
  // }


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
    return conoffice ? conoffice.rate : undefined;
    
  }

  get conoffice() {
    return this.LandlordAddForm.value.get('TDS_rate');
  }

  private getTDSRate(id, officekeyvalue) {
    this.remsservice.getTDSRateSearchFilter(id,officekeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.TDSRateList = datas;
      })
  }

  // conofficeScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matofficeAutocomplete &&
  //       this.autocompleteTrigger &&
  //       this.matofficeAutocomplete.panel
  //     ) {
  //       fromEvent(this.matofficeAutocomplete.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.matofficeAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.matofficeAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matofficeAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matofficeAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_offnext === true) {
  //               this.remsservice.TDSRate(this.tdssectionid,this.officeInput.nativeElement.value, this.offcurrentpage + 1)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.TDSRateList = this.TDSRateList.concat(datas);
  //                   if (this.TDSRateList.length >= 0) {
  //                     this.has_offnext = datapagination.has_next;
  //                     this.has_offprevious = datapagination.has_previous;
  //                     this.offcurrentpage = datapagination.index;
  //                   }
  //                 })
  //             }
  //           }
  //         });
  //     }
  //   });
  // }





  private getEntityType() {
    this.remsservice.getEntityType()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.entitytypeList = datas;
      })

  }
  getPremiseId() {
    this.premiseId = this.remsshareService.premiseViewID.value
  }

   b : any;
  
  submitForm() {
    this. LandlordBtn=true;
    if (this.LandlordAddForm.value.gstno === "") {
      this.LandlordAddForm.value.gstno = null
    }
    if (this.LandlordForm.value.landlord_id === "") {
      this.toastr.error('Please Enter Vendor Name');
      this.LandlordBtn=false;
      return false;
    }
    if (this.LandlordAddForm.value.name === "") {
      this.toastr.error('Please Enter Name');
      this.LandlordBtn=false;
      return false;
    }
    // if (this.LandlordAddForm.value.panno === "") {
    //   this.toastr.error('Please Enter PAN Name');
    //   this.LandlordBtn=false;
    //   return false;
    // }
    if (this.LandlordAddForm.value.aadharno === "") {
      this.LandlordAddForm.value.aadharno = null
      // this.LandlordBtn=false;
      // return false;
    }
    if (this.LandlordAddForm.value.aadharno != "" && this.LandlordAddForm.value.aadharno != undefined){
    if (this.LandlordAddForm.value.aadharno.length != 12) {
      this.toastr.error('Please Enter Valid Aadhar Number');
      this.LandlordBtn=false;
      return false;
    }
  }
    if (this.LandlordAddForm.value.entity_type === "") {
      this.toastr.error('Please Select Any One Entity Type');;
      this.LandlordBtn=false;
      return false;
    }
    if (this.LandlordAddForm.value.TDS_applicable === "") {
      this.toastr.error('Please Select TDS Applicable');
      this.LandlordBtn=false;
      return false;
    }
    if (this.LandlordAddForm.value.mobile === "") {
      this.toastr.error('Please Enter Mobile Number');
      this.LandlordBtn=false;
      return false;
    }
    if (this.LandlordAddForm.value.mobile.length != 10) {
      this.toastr.error('Please Enter Valid Mobile Number');
      this.LandlordBtn=false;
      return false;
    }
    // if (this.LandlordAddForm.controls.address.value.line1 === "") {
    //   this.toastr.error('Add No: Field', 'Empty value not Allowed', { timeOut: 1500 });
    //   this.LandlordBtn=false;
    //   return false;
    // }
    // if (this.LandlordAddForm.controls.address.value.line1.trim() === "") {
    //   this.toastr.error('Add No: Field', ' WhiteSpace Not Allowed', { timeOut: 1500 });
    //   this.LandlordBtn=false; 
    //   return false;
    // }
    // if (this.LandlordAddForm.controls.address.value.line2 === "") {
    //   this.toastr.error('Add Street Field', 'Empty value not Allowed', { timeOut: 1500 });
    //   this.LandlordBtn=false;
    //   return false;
    // }
    // if (this.LandlordAddForm.controls.address.value.line2.trim() === "") {
    //   this.toastr.error('Add Street Field', ' WhiteSpace Not Allowed', { timeOut: 1500 });
    //   this.LandlordBtn=false;
    //   return false;
    // }
    // if (this.LandlordAddForm.controls.address.value.line3 === "") {
    //   this.toastr.error('Add Area Field', 'Empty value not Allowed', { timeOut: 1500 });
    //   this.LandlordBtn=false;
    //   return false;
    // }
    // if (this.LandlordAddForm.controls.address.value.line3.trim() === "") {
    //   this.toastr.error('Add Area Field', ' WhiteSpace Not Allowed', { timeOut: 1500 });
    //   this.LandlordBtn=false;
    //   return false;
    // }
    if (this.LandlordAddForm.controls.address.value.city_id === "") {
      this.toastr.error('Add City Field', 'Empty value not Allowed', { timeOut: 1500 });
      this.LandlordBtn=false;
      return false;
    }
    if (this.LandlordAddForm.controls.address.value.district_id === "") {
      this.toastr.error('Add District Field', 'Empty value not Allowed', { timeOut: 1500 });
      this.LandlordBtn=false;
      return false;
    }
    if (this.LandlordAddForm.controls.address.value.state_id === "") {
      this.toastr.error('Add State Field', 'Empty value not Allowed', { timeOut: 1500 });
      this.LandlordBtn=false;
      return false;
    }
    if (this.LandlordAddForm.controls.address.value.pincode_id === "") {
      this.toastr.error('Add Pincode Field', 'Empty value not Allowed', { timeOut: 1500 });
      this.LandlordBtn=false;
      return false;
    }
   
   


    if (this.isNriDetails == true && ((this.isPoaDetails == false )|| (this.isPoaDetails == undefined))){
      this.nri = 2
      this.LandlordAddForm.controls.contact_and_address.value.landlordtype = this.nri 
    } 
    if ((((this.isNriDetails == false )|| (this.isNriDetails == undefined)) && this.isPoaDetails == true)|| this.isNriDetails == true && this.isPoaDetails == true){
      this.poa = 1
      this.LandlordAddForm.controls.contact_and_address.value.landlordtype = this.poa
    }

    this.LandlordAddForm.controls.address.value.city_id = this.LandlordAddForm.controls.address.value.city_id.id
    this.LandlordAddForm.controls.address.value.state_id = this.LandlordAddForm.controls.address.value.state_id.id
    this.LandlordAddForm.controls.address.value.district_id = this.LandlordAddForm.controls.address.value.district_id.id
    this.LandlordAddForm.controls.address.value.pincode_id = this.LandlordAddForm.controls.address.value.pincode_id.id
   

   if(this.LandlordAddForm.controls.contact_and_address.get('address').value.city_id != null){
    this.LandlordAddForm.controls.contact_and_address.get('address').value.city_id = this.LandlordAddForm.controls.contact_and_address.get('address').value.city_id.id
    this.LandlordAddForm.controls.contact_and_address.get('address').value.district_id = this.LandlordAddForm.controls.contact_and_address.get('address').value.district_id.id
    this.LandlordAddForm.controls.contact_and_address.get('address').value.state_id = this.LandlordAddForm.controls.contact_and_address.get('address').value.state_id.id
    this.LandlordAddForm.controls.contact_and_address.get('address').value.pincode_id = this.LandlordAddForm.controls.contact_and_address.get('address').value.pincode_id.id
  }
    

 if (this.isNriDetails === undefined && this.isPoaDetails === undefined || this.isNriDetails === false && this.isPoaDetails === false || (this.isNriDetails === true && ((this.isPoaDetails == false )|| (this.isPoaDetails == undefined))) ||
 (((this.isNriDetails == false )|| (this.isNriDetails == undefined)) && this.isPoaDetails === false)         ){

    this.b = this.LandlordAddForm.controls.contact_and_address.get('address').value
  
    for(let i in this.b){
      if (!this.b[i]){
          delete this.b[i]
      }
    }

    console.log("b",this.b)

    let a = this.LandlordAddForm.controls.contact_and_address.value
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

    let vendorSearchId = this.LandlordForm.value.landlord_id.id

    this.LandlordAddForm.value
  
    this.remsservice.createlandlordForm(this.LandlordAddForm.value, this.premiseId, vendorSearchId,this.TDSSelectionName)
      .subscribe(result => {
        console.log("result", result)
        let code = result.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Modify before getting the Approval")
          this.LandlordBtn=false;
        }
        else if(result.id === undefined){
          this.notification.showError(result.description)
          this.LandlordBtn=false;
          return false
        } else {
          this.notification.showSuccess("Successfully created!...")
          this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Landlord Details" }, skipLocationChange: isSkipLocationChange });
          this.shareService.landlordFlag.next(true)
          return true
        }
      }
      )
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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
  public displayFnpin(pintype?: pinListss): string | undefined {
    return pintype ? pintype.no : undefined;
  }

  get pintype() {
    return this.LandlordAddForm.controls.address.get('pincode_id');
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
    this.LandlordAddForm.patchValue({
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
    return this.LandlordAddForm.controls.address.get('city_id');
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
    this.LandlordAddForm.patchValue({
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
    return this.LandlordAddForm.controls.address.get('state_id');
  }

  private getState(statekeyvalue) {
    this.remsservice.getCityDropDown(statekeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.stateList = datas;
        console.log("stateList", datas)

      })
  }

  public displayFndistrict(districttype?: distListss): string | undefined {
    return districttype ? districttype.name : undefined;
  }

  get districttype() {
    return this.LandlordAddForm.controls.address.get('district_id');
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
    return this.LandlordAddForm.controls.contact_and_address.get('address').get('pincode_id');
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
    this.LandlordAddForm.controls.contact_and_address.get('address').patchValue({
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
    return this.LandlordAddForm.controls.contact_and_address.get('address').get('city_id');
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
    this.LandlordAddForm.controls.contact_and_address.get('address').patchValue({
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
    return this.LandlordAddForm.controls.contact_and_address.get('address').get('state_id');
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
    return this.LandlordAddForm.controls.contact_and_address.get('address').get('district_id');
  }

  private getDistrict1(districtkeyvalue) {
    this.remsservice.getDistrictDropDown(districtkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.districtList1 = datas;
      })
  }

  onCancelClick() {
    this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Landlord Details" }, skipLocationChange: isSkipLocationChange });
    return true
  }
  checkedtrue(data) {
    if (data == true) {
      this.isNriDetails = true;
      // this.isNRI = true;
      // this.LandlordAddForm.controls.contact_and_address.reset()
      this.isPOA = false;
    }else{
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
      // this.LandlordAddForm.controls.contact_and_address.reset()
    }else{
      this.isPoaDetails = false;
      // this.isNRI = false;
      this.isPOA = false;

    }
    console.log("checkedtrue1", data)
  }

}
class landlord {
  aadharno: number;
  name: string;
  panno: string;
  gstno: string;
  TDS_section: string;
  TDS_rate: number;
  entity_type: string;
  lower_deduction_certificate: string;
  mobile: number;
  email: string;
  is_nri: string;
  is_poa: string;
  nri_localcontact: string;
  landlordtype: any;
  landlordname: string;
  landlordcontact: string;
  landlordemail: string;
  address: any;
  line1: string;
  line2: string;
  line3: string;
  city_id: any;
  district_id: number;
  state_id: number;
  pincode_id: number;

}