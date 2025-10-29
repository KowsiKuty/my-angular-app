
import { Component, OnInit, Output, EventEmitter, Pipe, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { RemsService } from '../rems.service'
import { NotificationService } from '../notification.service'
import { ToastrService } from 'ngx-toastr';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Observable, fromEvent } from 'rxjs';
import { Router } from '@angular/router'
import { RemsShareService } from '../rems-share.service'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { Rems2Service } from '../rems2.service'
import { filter, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { environment } from 'src/environments/environment'
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from 'src/app/rems/error-handling.service';
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
  selector: 'app-occupancy',
  templateUrl: './occupancy.component.html',
  styleUrls: ['./occupancy.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class OccupancyComponent implements OnInit {
  @ViewChild('rmemp') matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('rmInput') rmInput: any;

  @ViewChild('conoffice') matofficeAutocomplete: MatAutocomplete;
  @ViewChild('officeInput') officeInput: any;

  @ViewChild('prioffice') matpriofficeAutocomplete: MatAutocomplete;
  @ViewChild('office1Input') office1Input: any;


  @Pipe({
    name: 'stringFilterBy'
  })
  isLoading = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  occupancyForm: FormGroup;
  public searchInput: String = '';
  public searchResult: Array<any> = [];
  public seriesList: Array<any> = [];
  cityList: Array<citylistss>;
  districtList: Array<districtlistss>;
  usageList: any
  ownershipList: any
  branchclassificationList: any
  branchwindowList: any
  branchlocationList: any
  strongroomList: any
  saferoompartitionList: any
  riskcategoryList: any
  cityId: number;
  districtId: number;
  stateId: number;
  pincodeId: number;
  districtID: any;
  district_id = new FormControl();
  cityID: any;
  premiseID: any;

  pinCodeList: Array<pinCodeListss>;
  pincode_id = new FormControl();
  stateList: Array<stateListss>;
  state_id = new FormControl();
  premiseList: Array<premiseListss>;
  premise = new FormControl();
  usage = new FormControl();
  filteredOptions: Observable<any[]>;


  city_id = new FormControl();
  public chipSelecteddisid = [];

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
  OccupancyBtn=false
  premise_Area: any;

  isTerminalCount = false;
  constructor(private fb: FormBuilder, private remsService: RemsService,
    private router: Router, private remsshareService: RemsShareService,
    private datePipe: DatePipe, private remsService2: Rems2Service,
    private toastr: ToastrService, private notification: NotificationService, private SpinnerService: NgxSpinnerService,
    private errorHandler: ErrorHandlingService ) { }

  ngOnInit(): void {

    this.occupancyForm = this.fb.group({
      usage: ['', Validators.required],
      ownership: ['', Validators.required],
      floor_located: [''],
      area_occupied: ['', Validators.required],
      branch_classification: ['', Validators.required],
      branch_window: ['', Validators.required],
      branch_location: ['', Validators.required],
      strong_room: ['', Validators.required],
      saferoom_partition: ['', Validators.required],
      risk_category: ['', Validators.required],
      terminal_count: ['', Validators.required],
      date_of_opening: [''],
      usage_code_id: ['', Validators.required],
      controlling_ofz_id: ['', Validators.required],
      primary_ofz_id: ['', Validators.required],
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

    this.premise_Area = this.remsshareService.premiseArea.value;
    console.log("premise_Area",this.premise_Area)

    this.premiseID = this.remsshareService.occupancyEditValue.value;
    let citykeyvalue: String = "";
    this.getCity(citykeyvalue);
    let diskeyvalue: String = "";
    this.getDistrict(diskeyvalue);
    let statekeyvalue: String = "";
    this.getStateDropDown(statekeyvalue);
    let pinkeyvalue: String = "";
    this.getPinCodeDropDown(pinkeyvalue);
    this.getControllingOffice();
    this.getUsage();
    this.getOwnership();
    this.getBranchclassification();
    this.getBranchwindow();
    this.getBranchlocation();
    this.getStrongroom();
    this.getSaferoompartition();
    this.getRiskcategory();
    // this.getUsageCode();
    
    let rmkeyvalue: String = "";
    this.getUsageCodee(rmkeyvalue);

    this.occupancyForm.get('usage_code_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

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
        this.UsageCodeData = datas;

      })



    let officekeyvalue: String = "";
    this.getConOffice(officekeyvalue);

    this.occupancyForm.get('controlling_ofz_id').valueChanges
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
        this.controllingData = datas;

      })



    let office1keyvalue: String = "";
    this.getpriOffice(office1keyvalue);

    this.occupancyForm.get('primary_ofz_id').valueChanges
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




    this.occupancyForm.controls.address.get('district_id').valueChanges
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
    this.occupancyForm.controls.address.get('city_id').valueChanges
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
        console.log("district", datas)
      })
    this.occupancyForm.controls.address.get('pincode_id').valueChanges
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
    this.occupancyForm.controls.address.get('state_id').valueChanges
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

  }

  public displayFnRm(rmemp?: usageCode): string | undefined {
    return rmemp ?  rmemp.name : undefined;
  }

  get rmemp() {
    return this.occupancyForm.value.get('usage_code_id');
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
    return conoffice ? conoffice.name : undefined;
    
  }

  get conoffice() {
    return this.occupancyForm.value.get('controlling_ofz_id');
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
    return this.occupancyForm.value.get('primary_ofz_id');
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




  options: any;
  private getUsage() {
    this.remsService.getUsage()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.usageList = datas;
        this.options = this.usageList;
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
    this.occupancyForm.patchValue({
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
    this.occupancyForm.patchValue({
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
    return this.occupancyForm.controls.address.get('district_id');
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
    return this.occupancyForm.controls.address.get('city_id');
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
    return this.occupancyForm.controls.address.get('pincode_id');
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
    return this.occupancyForm.controls.address.get('state_id');
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
    return this.occupancyForm.get('premise');
  }

  createFormate() {
    let data = this.occupancyForm.controls;
    let datas = this.occupancyForm.controls.address;
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


  occupanyCreateForm() {
    this.OccupancyBtn=true
    if (this.occupancyForm.value.usage === "") {
      this.toastr.warning('', 'Select Occupancy Usage', { timeOut: 1500 });
      this.OccupancyBtn=false;
      return false;
    } 

    if (this.occupancyForm.value.usage_code_id === "") {
      this.toastr.warning('', 'Select Occupancy Usage Code', { timeOut: 1500 });
      this.OccupancyBtn=false;
      return false;
    }  if (this.occupancyForm.value.controlling_ofz_id === "") {
      this.toastr.warning('', 'Select controlling Ofz', { timeOut: 1500 });
      this.OccupancyBtn=false;
      return false;
    } if (this.occupancyForm.value.primary_ofz_id === "") {
      this.toastr.warning('', 'Select Rent Paying Ofz', { timeOut: 1500 });
      this.OccupancyBtn=false;
      return false;
    }  
    if (this.occupancyForm.value.date_of_opening === "") {
      this.toastr.warning('', 'Select Date', { timeOut: 1500 });
      this.OccupancyBtn=false;
      return false;
    } if (this.occupancyForm.value.floor_located.trim().length > 25) {
      this.toastr.warning('', 'Dont Allow more than 25 characters in floor location', { timeOut: 1500 });
      this.OccupancyBtn=false;
      return false;
    } if (this.occupancyForm.value.area_occupied === "") {
      this.toastr.warning('', 'Select Area Occupied Usagewise', { timeOut: 1500 });
      this.OccupancyBtn=false;
      return false;
    } if (this.occupancyForm.value.branch_location === "") {
      this.toastr.warning('', 'Select Branch Location', { timeOut: 1500 });
      this.OccupancyBtn=false;
      return false;
    }
     if (this.occupancyForm.value.branch_classification === "") {
      this.toastr.warning('', 'Select Branch Classification', { timeOut: 1500 });
      this.OccupancyBtn=false;
      return false;
    } 
    // if (this.occupancyForm.value.area_occupied.trim() === "") {
    //   this.toastr.error('Add Area Occupied Field', 'Empty value inserted', { timeOut: 1500 });
    //   this.OccupancyBtn=false;
    //   return false;
    // }
     if (this.occupancyForm.value.branch_window === "") {
      this.toastr.warning('', 'Select Branch Window', { timeOut: 1500 });
      this.OccupancyBtn=false;
      return false;
    }  if (this.occupancyForm.value.strong_room === "") {
      this.toastr.warning('', 'Select Strong Room', { timeOut: 1500 });
      this.OccupancyBtn=false;
      return false;
    } if (this.occupancyForm.value.saferoom_partition === "") {
      this.toastr.warning('', 'Select Saferoom Partion', { timeOut: 1500 });
      this.OccupancyBtn=false;
      return false;
    } if (this.occupancyForm.value.risk_category === "") {
      this.toastr.warning('', 'Select Risk Category', { timeOut: 1500 });
      this.OccupancyBtn=false;
      return false;
    } 
    
     if (this.occupancyForm.controls.address.value.line1 === "") {
      this.toastr.warning('', 'Enter Door/Flat No.', { timeOut: 1500 });
      this.OccupancyBtn=false;
      return false;
    }
     if (this.occupancyForm.controls.address.value.line2 === "") {
      this.toastr.warning('', 'Enter Street', { timeOut: 1500 });
      this.OccupancyBtn=false;
      return false;
    }
    if (this.occupancyForm.controls.address.value.line3 === "") {
      this.toastr.warning('', 'Enter Area', { timeOut: 1500 });
      this.OccupancyBtn=false;
      return false;
    }  if (this.occupancyForm.controls.address.value.pincode_id === "") {
      this.toastr.warning('', 'Select Pincode', { timeOut: 1500 });
      this.OccupancyBtn=false;
      return false;
    } if (this.occupancyForm.controls.address.value.city_id === "") {
      this.toastr.warning('', 'Select City', { timeOut: 1500 });
      this.OccupancyBtn=false;
      return false;
    } if (this.occupancyForm.controls.address.value.district_id === "") {
      this.toastr.warning('', 'Select District', { timeOut: 1500 });
      this.OccupancyBtn=false;
      return false;
    } if (this.occupancyForm.controls.address.value.state_id === "") {
      this.toastr.warning('', 'Select State', { timeOut: 1500 });
      this.OccupancyBtn=false;
      return false;
    }
    if (this.occupancyForm.value.area_occupied > this.premise_Area) {
      this.toastr.warning('', 'Occupancy Area Must be less than Premise Occupied Area', { timeOut: 1500 });
      this.OccupancyBtn=false;
      return false;
    } 

    const dateOfOpening = this.datePipe.transform(this.occupancyForm.value.date_of_opening, 'yyyy-MM-dd');
    this.remsService.occupancyCreateForm(this.createFormate(), this.premiseID, dateOfOpening)
      .subscribe(result => {
        let code = result.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Modify before getting the Approval")
          this.OccupancyBtn=false;
        } else if(result.id === undefined){
          this.notification.showError(result.description)
          this.OccupancyBtn=false;
          return false
        }
         else {
          this.notification.showSuccess("Successfully created!...")
          this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Occupancy Details" }, skipLocationChange: isSkipLocationChange });

        }
        
      },
       error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )

  }

  onCancelClick() {
    this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Occupancy Details" }, skipLocationChange: isSkipLocationChange });
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

 
  getControllingOffice() {
    this.remsService2.getControllingOffice()
      .subscribe((results) => {
        let datas = results.data
        this.controllingData = datas;
        console.log("dd", this.controllingData)
      })
  }

  usageDropDown(data) {
    if (data.id == 1 || data.id == 2 || data.id == 13 || data.id == 14) {
      this.isTerminalCount = true;
    } else {
      this.isTerminalCount = false;
    }
    console.log("usageDropDown", data)
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


