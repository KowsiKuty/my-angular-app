import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { RemsService } from '../rems.service'
import { NotificationService } from '../notification.service'
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../service/shared.service';
import { Router } from '@angular/router'
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { RemsShareService } from '../rems-share.service'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { Rems2Service } from '../rems2.service'
import { Observable, fromEvent } from 'rxjs';
import {  filter,takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent,MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { environment } from 'src/environments/environment'

const isSkipLocationChange = environment.isSkipLocationChange

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
export interface districtlistss {
  id: string;
  name: string;
}

export interface citylistss {
  id: string;
  name: string;
}

export interface pinCodeListss {
  no: string;
  id: number;
}

export interface stateListss {
  name: string;
  id: number;
}
export interface premiseListss {
  name: string;
  id: number;
}

export interface usageCode {
  id: number;
  name: string;
  code: string;
}

export interface controllingOffice {
  id: string;
  name: string;
  code: string;
}
export interface primaryOffice {
  id: string;
  name: string;
  code: string;
}



@Component({
  selector: 'app-occupancy-edit',
  templateUrl: './occupancy-edit.component.html',
  styleUrls: ['./occupancy-edit.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class OccupancyEditComponent implements OnInit {
  @ViewChild('rmemp') matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('rmInput') rmInput: any;

  @ViewChild('conoffice') matofficeAutocomplete: MatAutocomplete;
  @ViewChild('officeInput') officeInput: any;

  @ViewChild('prioffice') matpriofficeAutocomplete: MatAutocomplete;
  @ViewChild('office1Input') office1Input: any;

  isLoading = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  occupancyeditForm: FormGroup;
  cityList: Array<citylistss>;
  city_id = new FormControl();
  districtList: Array<districtlistss>;
  district_id = new FormControl();
  pinCodeList: Array<pinCodeListss>;
  pincode_id = new FormControl();
  stateList: Array<stateListss>;
  state_id = new FormControl();
  premiseList: Array<premiseListss>;
  premise = new FormControl();
  usageList: any
  ownershipList: any
  branchclassificationList: any
  branchwindowList: any
  branchlocationList: any
  strongroomList: any
  saferoompartitionList: any
  riskcategoryList: any
  districtId: number;
  stateId: number;
  pincodeId: number;
  districtID: any;
  cityId: any;
  premiseId: any;
  // controllingData: any;
  // UsageCodeData: any;
  isTerminalCount = true;

  controllingData: Array<controllingOffice>; 
  has_offnext = true;
  has_offprevious = true;
  offcurrentpage: number = 1;

  primaryData: Array<primaryOffice>;
  has_prinext = true;
  has_priprevious = true;
  pricurrentpage: number = 1;


  UsageCodeData: Array<usageCode>;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  OccupancyEditBtn=false
  premise_Area: any;

  constructor(private fb: FormBuilder, private remsService: RemsService, private toastr: ToastrService, private router: Router,
    private datePipe: DatePipe, private remsService2: Rems2Service,
    private notification: NotificationService, private shareService: SharedService, private remsshareService: RemsShareService) { }

  ngOnInit(): void {
    this.premise_Area = this.remsshareService.premiseArea.value;
    console.log("premise_Area",this.premise_Area)

    this.occupancyeditForm = this.fb.group({
      usage: ['', Validators.required],
      ownership: ['', Validators.required],
      floor_located: [''],
      area_occupied: ['', Validators.required],
      branch_classification: ['', Validators.required],
      branch_window: ['', Validators.required],
      branch_location: ['', Validators.required],
      strong_room: ['', Validators.required],
      saferoom_partition: ['', Validators.required],
      terminal_count: ['', Validators.required],
      date_of_opening: [''],
      risk_category: ['', Validators.required],
      usage_code_id: ['', Validators.required],
      controlling_ofz_id: ['', Validators.required],
      primary_ofz_id: ['', Validators.required],
      premise: ['', Validators.required],
      address: this.fb.group({
        line1: ['', Validators.required],
        pincode_id: ['', Validators.required],
        city_id: ['', Validators.required],
        district_id: ['', Validators.required],
        state_id: ['', Validators.required],
        line2: ['', Validators.required],
        line3: ['', Validators.required],
      }),

    })
    this.getOccupancyEdit();
    let citykeyvalue: String = "";
    this.getCity(citykeyvalue);
    let diskeyvalue: String = "";
    this.getDistrict(diskeyvalue);
    let statekeyvalue: String = "";
    this.getStateDropDown(statekeyvalue);
    let pinkeyvalue: String = "";
    this.getPinCodeDropDown(pinkeyvalue);
    this.getUsage();
    this.getOwnership();
    this.getBranchclassification();
    this.getBranchwindow();
    this.getBranchlocation();
    this.getStrongroom();
    this.getRiskcategory();
    this.getSaferoompartition();
    this.getUsageCode();
    this.getControllingOffice();
    this.occupancyeditForm.controls.address.get('district_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.remsService.getDistrict(value)
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
    this.occupancyeditForm.controls.address.get('city_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.remsService.getCity(value)
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
    this.occupancyeditForm.controls.address.get('pincode_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.remsService.getPinCodeDropDown(value)
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
    this.occupancyeditForm.controls.address.get('state_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.remsService.getStateDropDown(value)
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



      
      let rmkeyvalue: String = "";
    this.getUsageCodee(rmkeyvalue);

    this.occupancyeditForm.get('usage_code_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.remsService.getUsageCode(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.UsageCodeData = datas;

      })



    let officekeyvalue: String = "";
    this.getConOffice(officekeyvalue);

    this.occupancyeditForm.get('controlling_ofz_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.remsService.getUsageCode(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.controllingData = datas;

      })



      let office1keyvalue: String = "";
    this.getpriOffice(office1keyvalue);

    this.occupancyeditForm.get('primary_ofz_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.remsService.getUsageCode(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.primaryData = datas;

      })

  }


  private getUsage() {
    this.remsService.getUsage()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.usageList = datas;
      })
  }

  private getOwnership() {
    this.remsService.getOwnership()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ownershipList = datas;
      })
  }


  private getBranchclassification() {
    this.remsService.getBranchclassification()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchclassificationList = datas;
      })
  }

  private getBranchwindow() {
    this.remsService.getBranchwindow()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchwindowList = datas;
      })
  }

  private getBranchlocation() {
    this.remsService.getBranchlocation()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlocationList = datas;
      })
  }

  private getStrongroom() {
    this.remsService.getStrongroom()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.strongroomList = datas;
      })
  }

  private getSaferoompartition() {
    this.remsService.getSaferoompartition()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.saferoompartitionList = datas;
      })
  }

  private getRiskcategory() {
    this.remsService.getRiskcategory()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.riskcategoryList = datas;
      })
  }

  pinCode(data) {
    this.cityId = data.city;
    this.districtId = data.district;
    this.stateId = data.state;
    this.pincodeId = data
    this.occupancyeditForm.patchValue({
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
    this.occupancyeditForm.patchValue({
      address: {
        city_id: this.cityId,
        state_id: this.stateId,
        district_id: this.districtId,
        pincode_id: this.pincodeId
      }
    })
  }


  public displaydis(autodis?: districtlistss): string | undefined {
    return autodis ? autodis.name : undefined;
  }

  get autodis() {
    return this.occupancyeditForm.controls.address.get('district_id');
  }

  private getDistrict(diskeyvalue) {
    this.remsService.getDistrict(diskeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.districtList = datas;
      })
  }


  public displaycit(autocit?: citylistss): string | undefined {
    return autocit ? autocit.name : undefined;
  }

  get autocit() {
    return this.occupancyeditForm.controls.address.get('city_id');
  }

  private getCity(citkeyvalue) {
    this.remsService.getCity(citkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cityList = datas;
      })
  }

  public displayFnpin(pintype?: pinCodeListss): string | undefined {
    return pintype ? pintype.no : undefined;
  }

  get pintype() {
    return this.occupancyeditForm.controls.address.get('pincode_id');
  }

  private getPinCodeDropDown(pinkeyvalue) {
    this.remsService.getPinCodeDropDown(pinkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.pinCodeList = datas;
      })
  }

  public displayFnstate(statetype?: stateListss): string | undefined {
    return statetype ? statetype.name : undefined;
  }

  get statetype() {
    return this.occupancyeditForm.controls.address.get('state_id');
  }
  private getStateDropDown(statekeyvalue) {
    this.remsService.getStateDropDown(statekeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.stateList = datas;
      })
  }

  public displayFnpre(pretype?: premiseListss): string | undefined {
    return pretype ? pretype.name : undefined;
  }

  get pretype() {
    return this.occupancyeditForm.get('premise');
  }


  public displayFnRm(rmemp?: usageCode): string | undefined {
    return rmemp ? rmemp.name  : undefined;
  }

  get rmemp() {
    return this.occupancyeditForm.value.get('usage_code_id');
  }

  private getUsageCodee(rmkeyvalue) {
    this.remsService.getusageSearchFilter(rmkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.UsageCodeData = datas;
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
              if (this.has_next === true) {
                this.remsService.getUsageCode(this.rmInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.UsageCodeData = this.UsageCodeData.concat(datas);
                    if (this.UsageCodeData.length >= 0) {
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


  
  public displayconoffice(conoffice?: controllingOffice): string | undefined {
    return conoffice ? conoffice.name: undefined;
  }

  get conoffice() {
    return this.occupancyeditForm.value.get('controlling_ofz_id');
  }

  private getConOffice(officekeyvalue) {
    this.remsService.getusageSearchFilter(officekeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.controllingData = datas;
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
                this.remsService.getUsageCode(this.officeInput.nativeElement.value, this.offcurrentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.controllingData = this.controllingData.concat(datas);
                    if (this.controllingData.length >= 0) {
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


  public displayPriOff(prioffice?: primaryOffice): string | undefined {
    return prioffice ?  prioffice.name : undefined;
    
  }

  get prioffice() {
    return this.occupancyeditForm.value.get('primary_ofz_id');
  }

  private getpriOffice(officekeyvalue) {
    this.remsService.getusageSearchFilter(officekeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.primaryData = datas;
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
                this.remsService.getUsageCode(this.office1Input.nativeElement.value, this.pricurrentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.primaryData = this.primaryData.concat(datas);
                    if (this.primaryData.length >= 0) {
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



  getOccupancyEdit() {
    let results: any = this.remsshareService.occupancyEditValue.value;
    console.log(">>>>>>>>>ed", results)
    let Usage = results.usage_id;
    let Ownership = results.ownership_id;
    let Floorlocated = results.floor_located;
    let AreaOccupied = results.area_occupied;
    let Branchclassification = results.branch_classification_id;
    let Branchwindow = results.branch_window_id;
    let Branchlocation = results.branch_location_id;
    let Strongroom = results.strong_room_id;
    let Saferoompartition = results.saferoom_partition_id;
    let Riskcategory = results.risk_category_id;
    let TeminalCount = results.terminal_count;
    let Address = results.address;
    let Line1 = Address.line1;
    let Line2 = Address.line2;
    let Line3 = Address.line3;
    let pinCode = Address.pincode_id;
    let City = Address.city_id;
    let State = Address.state_id;
    let District = Address.district_id;
    let dateOfOpening = results.date_of_opening
    this.premiseId = results.premise.id;
    let controllingOfz = results.controlling_ofz_id;
    let primaryOfz = results.primary_ofz_id;
    let usgaeCode = results.usage_code_id;
    this.occupancyeditForm.patchValue({
      usage: Usage,
      ownership: Ownership,
      floor_located: Floorlocated,
      area_occupied: AreaOccupied,
      branch_classification: Branchclassification,
      branch_window: Branchwindow,
      branch_location: Branchlocation,
      strong_room: Strongroom,
      saferoom_partition: Saferoompartition,
      risk_category: Riskcategory,
      terminal_count: TeminalCount,
      date_of_opening: dateOfOpening,
      usage_code_id: usgaeCode,
      controlling_ofz_id: controllingOfz,
      primary_ofz_id: primaryOfz,

      address: {
        line1: Line1,
        line2: Line2,
        line3: Line3,
        pincode_id: pinCode,
        city_id: City,
        state_id: State,
        district_id: District,

      }
    })
  }

  createFormate() {
    let data = this.occupancyeditForm.controls;
    let datas = this.occupancyeditForm.controls.address;
    let disclass = new distype();
    let address1 = {
      line1: datas.value.line1,
      line2: datas.value.line2,
      line3: datas.value.line3,
      city_id: datas.value.city_id.id,
      district_id: datas.value.district_id.id,
      state_id: datas.value.state_id.id,
      pincode_id: datas.value.pincode_id.id
    }
    disclass.address = address1;
    disclass.usage = data['usage'].value;
    disclass.floor_located = data['floor_located'].value;
    disclass.area_occupied = data['area_occupied'].value;
    disclass.branch_classification = data['branch_classification'].value;
    disclass.branch_window = data['branch_window'].value;
    disclass.branch_location = data['branch_location'].value;
    disclass.strong_room = data['strong_room'].value;
    disclass.saferoom_partition = data['saferoom_partition'].value;
    disclass.risk_category = data['risk_category'].value;
    disclass.terminal_count = data['terminal_count'].value;
    disclass.usage_code_id = data['usage_code_id'].value.id;
    disclass.controlling_ofz_id = data['controlling_ofz_id'].value.id;
    disclass.primary_ofz_id = data['primary_ofz_id'].value.id;
    return disclass;
  }


  occupanyEditForm() {
    this.OccupancyEditBtn=true
    if (this.occupancyeditForm.value.usage === "") {
      this.toastr.warning('', 'Select Occupancy Usage', { timeOut: 1500 });
      this.OccupancyEditBtn=false;
      return false;
    } 

    if (this.occupancyeditForm.value.usage_code_id === "") {
      this.toastr.warning('', 'Select Occupancy Usage Code', { timeOut: 1500 });
      this.OccupancyEditBtn=false;
      return false;
    }  if (this.occupancyeditForm.value.controlling_ofz_id === "") {
      this.toastr.warning('', 'Select controlling Ofz', { timeOut: 1500 });
      this.OccupancyEditBtn=false;
      return false;
    } if (this.occupancyeditForm.value.primary_ofz_id === "") {
      this.toastr.warning('', 'Select Rent Paying Ofz', { timeOut: 1500 });
      this.OccupancyEditBtn=false;
      return false;
    }  
    if (this.occupancyeditForm.value.date_of_opening === "") {
      this.toastr.warning('', 'Select Date', { timeOut: 1500 });
      this.OccupancyEditBtn=false;
      return false;
    } if (this.occupancyeditForm.value.floor_located.trim().length > 25) {
      this.toastr.warning('', 'Dont Allow more than 25 characters in floor location', { timeOut: 1500 });
      this.OccupancyEditBtn=false;
      return false;
    } if (this.occupancyeditForm.value.area_occupied === "") {
      this.toastr.warning('', 'Select Area Occupied Usagewise', { timeOut: 1500 });
      this.OccupancyEditBtn=false;
      return false;
    } if (this.occupancyeditForm.value.branch_location === "") {
      this.toastr.warning('', 'Select Branch Location', { timeOut: 1500 });
      this.OccupancyEditBtn=false;
      return false;
    }
     if (this.occupancyeditForm.value.branch_classification === "") {
      this.toastr.warning('', 'Select Branch Classification', { timeOut: 1500 });
      this.OccupancyEditBtn=false;
      return false;
    } 
    // if (this.occupancyForm.value.area_occupied.trim() === "") {
    //   this.toastr.error('Add Area Occupied Field', 'Empty value inserted', { timeOut: 1500 });
    //   this.OccupancyBtn=false;
    //   return false;
    // }
     if (this.occupancyeditForm.value.branch_window === "") {
      this.toastr.warning('', 'Select Branch Window', { timeOut: 1500 });
      this.OccupancyEditBtn=false;
      return false;
    }  if (this.occupancyeditForm.value.strong_room === "") {
      this.toastr.warning('', 'Select Strong Room', { timeOut: 1500 });
      this.OccupancyEditBtn=false;
      return false;
    } if (this.occupancyeditForm.value.saferoom_partition === "") {
      this.toastr.warning('', 'Select Saferoom Partion', { timeOut: 1500 });
      this.OccupancyEditBtn=false;
      return false;
    } if (this.occupancyeditForm.value.risk_category === "") {
      this.toastr.warning('', 'Select Risk Category', { timeOut: 1500 });
      this.OccupancyEditBtn=false;
      return false;
    } 
    
     if (this.occupancyeditForm.controls.address.value.line1 === "") {
      this.toastr.warning('', 'Select Line1', { timeOut: 1500 });
      this.OccupancyEditBtn=false;
      return false;
    }
     if (this.occupancyeditForm.controls.address.value.line2 === "") {
      this.toastr.warning('', 'Select Line2', { timeOut: 1500 });
      this.OccupancyEditBtn=false;
      return false;
    }
    if (this.occupancyeditForm.controls.address.value.line3 === "") {
      this.toastr.warning('', 'Select Line3', { timeOut: 1500 });
      this.OccupancyEditBtn=false;
      return false;
    }  if (this.occupancyeditForm.controls.address.value.pincode_id === "") {
      this.toastr.warning('', 'Select Pincode', { timeOut: 1500 });
      this.OccupancyEditBtn=false;
      return false;
    } if (this.occupancyeditForm.controls.address.value.city_id === "") {
      this.toastr.warning('', 'Select City', { timeOut: 1500 });
      this.OccupancyEditBtn=false;
      return false;
    } if (this.occupancyeditForm.controls.address.value.district_id === "") {
      this.toastr.warning('', 'Select District', { timeOut: 1500 });
      this.OccupancyEditBtn=false;
      return false;
    } if (this.occupancyeditForm.controls.address.value.state_id === "") {
      this.toastr.warning('', 'Select State', { timeOut: 1500 });
      this.OccupancyEditBtn=false;
      return false;
    }
    if (this.occupancyeditForm.value.area_occupied > this.premise_Area) {
      this.toastr.warning('', 'Occupancy Area Must be less than Premise Occupied Area', { timeOut: 1500 });
      this.OccupancyEditBtn=false;
      return false;
    } 

    // if (this.occupancyeditForm.value.floor_located.trim() === "") {
    //   this.toastr.error('Add Floor Located Field', 'Empty value inserted', { timeOut: 1500 });
    //   this.OccupancyEditBtn=false;
    //   return false;
    // }
    // if (this.occupancyeditForm.value.area_occupied.trim() === "") {
    //   this.toastr.error('Add Area Occupied Field', 'Empty value inserted', { timeOut: 1500 });
    //   this.OccupancyEditBtn=false;
    //   return false;
    // }
    // if (this.occupancyeditForm.controls.address.value.line1.trim() === "") {
    //   this.toastr.error('Add line1 field', 'Empty value inserted', { timeOut: 2500 });
    //   this.OccupancyEditBtn=false;
    //   return false;
    // }
    // if (this.occupancyeditForm.controls.address.value.line2.trim() === "") {
    //   this.toastr.error('Add line2 field', 'Empty value inserted', { timeOut: 2500 });
    //   this.OccupancyEditBtn=false;
    //   return false;
    // }

    // if (this.occupancyeditForm.value.area_occupied.trim().length > 20) {
    //   this.toastr.error('Dont insert more than 20 characters in area occupied ', 'Insert limited length', { timeOut: 1500 });
    //   this.OccupancyEditBtn=false;
    //   return false;
    // }
    // if (this.occupancyeditForm.value.floor_located.trim().length > 20) {
    //   this.toastr.error('Dont insert more than 20 characters in floor location', 'Insert limited length', { timeOut: 1500 });
    //   this.OccupancyEditBtn=false;
    //   return false;
    // } 
    // if (this.occupancyeditForm.value.area_occupied > this.premise_Area) {
    //   this.toastr.warning('', 'Occupancy Area Must be less than Premise Occupied Area', { timeOut: 1500 });
    //   this.OccupancyEditBtn=false;
    //   return false;
    // }

    let idValue: any = this.remsshareService.occupancyEditValue.value
    let data = this.occupancyeditForm.value
    const dateOfOpening = this.datePipe.transform(this.occupancyeditForm.value.date_of_opening, 'yyyy-MM-dd');
    this.remsService.editOccupancyForm(this.createFormate(), idValue.id, this.premiseId, dateOfOpening)
      .subscribe(res => {
        let code = res.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Modify before getting the Approval")
          this.OccupancyEditBtn=false;
        } else if(res.id === undefined){
          this.notification.showError(res.description)
          this.OccupancyEditBtn=false;
          return false
        }
        else{
        this.notification.showSuccess("Successfully Updated!...")
        this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Occupancy Details"}, skipLocationChange: isSkipLocationChange });
        return true
        }
      })
  }

  onCancelClick() {
    this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Occupancy Details"}, skipLocationChange: isSkipLocationChange });
  }


  getUsageCode() {
    this.remsService2.getUsageCode()
      .subscribe((results) => {
        let datas = results.data
        this.UsageCodeData = datas;
      })
  }
  getControllingOffice() {
    this.remsService2.getControllingOffice()
      .subscribe((results) => {
        let datas = results.data
        this.controllingData = datas;
      })
  }

  usageDropDown(data) {
    if (data.id == 1 || data.id == 2 || data.id == 13 || data.id == 14) {
      this.isTerminalCount=true;
    }else{
      this.isTerminalCount=false;
    }
    console.log("usageDropDown", data)
  }

  Alpha_numeric(event) {
    var k;
    k = event.charCode;
    return ((k > 96 && k < 123) || (k >= 48 && k <= 57));
  }

  numberOnlyandDot(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || (k >= 48 && k <= 57));
  }


}

class distype {

  usage: string;
  ownership: string;
  floor_located: string;
  area_occupied: string;
  branch_classification: string;
  branch_window: string;
  branch_location: string;
  strong_room: string;
  saferoom_partition: string;
  risk_category: string;
  terminal_count: any;
  address: any;
  line1: string;
  line2: string;
  line3: string;
  city_id: any;
  district_id: any;
  state_id: any;
  pincode_id: any;
  controlling_ofz_id: string;
  usage_code_id: string;  
  primary_ofz_id: string;

}

