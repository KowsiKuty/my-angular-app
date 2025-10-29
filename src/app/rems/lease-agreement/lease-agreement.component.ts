import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { SharedService } from '../../service/shared.service';
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { ActivatedRoute, Router } from '@angular/router'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { MatAutocomplete, MatAutocompleteTrigger, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, tap, map, takeUntil, switchMap, finalize } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { environment } from 'src/environments/environment'

const isSkipLocationChange = environment.isSkipLocationChange

export interface PrimaryContact {
  id: number;
  full_name: string;
}
export interface PrimaryContact1 {
  id: number;
  name: string;
}
export interface LanlordList {
  name: string;
  id: number;
}
export interface BSList {
  name: string;
  id: number;
}
export interface CCList {
  name: string;
  id: number;
}
export interface OccupancyList {
  code:string;
  id: number;
  name:string;
}
export interface primaryOffice {
  id: string;
  name: string;
  code: string;
}
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
@Component({
  selector: 'app-lease-agreement',
  templateUrl: './lease-agreement.component.html',
  styleUrls: ['./lease-agreement.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class LeaseAgreementComponent implements OnInit {
  @ViewChild('ratio') inputratio;
  @ViewChild('landlordInput') inputlandlord;
  @ViewChild('autoPrimary') matAutocompleteDept: MatAutocomplete;
  @ViewChild('primaryContactInput') primaryContactInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('prioffice') matpriofficeAutocomplete: MatAutocomplete;
  @ViewChild('office1Input') office1Input: any;
  agreementForm: FormGroup;

  landlord_allocation_ratio: Array<any> = [];
  landList: Array<LanlordList>;
  Status: any;
  primaryData: Array<primaryOffice>;
  has_prinext = true;
  has_priprevious = true;
  pricurrentpage: number = 1;
  defaultDate = new FormControl(new Date())
  AgreementId: any;
  comefrom: any;
  toDate: any;
  fromDate: any;
  paramsValue: any;
  premiseId: any;
  toDate1: any;
  fromDate1: any;
  leasePeriod: any;
  relaxationPeriod: any;
  AgreementDate_or_Landlord_Modify: any;
  ss: any;
  aa: any;
  RentSchedule: any;
  ss1: any;
  aa1: any;
  isECFNo = false;
  ecfno: any;
  isAllocation = false;
  allocation: any;
  registrationStatus: any;
  regchargespaidby: any;
  leaseStatus: any;
  primaryContactList: any;
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  occupancyList: any;
  isRegdate = false;
  isRegcharges = false;
  isChargespaidby = false;
  paidbyid: any;
  typeList: any;
  amount: any;
  amt = 0;
  sum: any;


  landlordRatio: any;
  share: any;
  id: any;
  landlord_id: any;
  bsname: any;
  bsid: any;

  public OccupancyListobj: OccupancyList[];
  public agreement_occupancy_map = new FormControl();
  public chipSelectedOccupancy = [];
  public chipSelectedOccupancyid = [];
  @ViewChild('occupancyInput') occupancyInput: any;
  @ViewChild('autooccu') matAutocompleteoccu: MatAutocomplete;

  public BSList: BSList[];
  public CCList: CCList[];
  public chipSelectedLandlordid = [];
  public chipRemovedLandlordid = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  BSIdValue: any;
  nextlist: any;
  agreementEndDate: any;
  updatestartdate: any;
  request_Status: any;
  premise_status: any;
  isReadonly = false;
  occIdvalue: any;
  occupancypatchedId: any;
  array: any = [];
  array1: any = [];
  detailsList = [];
  detailsList1 = [];
  termcreated_flag: any;
  oldLandlordList = [];
  AgreementDate_or_LandlordEdited: any;
  landlord_delete: any;
  bsarray = [];
  agg_startdate: any;
  agg_enddate: any;
  toDateForEdit: any;

  @Output() linesChange = new EventEmitter<any>();

  temporaryLease = [{ id: true, name: "Yes" }, { id: false, name: "No" }]
  rentSchedule = [{ id: true, name: "Leased" }, { id: false, name: "Owned" }]

  constructor(private fb: FormBuilder, private router: Router,
    private remsshareService: RemsShareService, private shareService: SharedService,
    private datePipe: DatePipe, private route: ActivatedRoute,
    private remsService: RemsService, private toastr: ToastrService, private notification: NotificationService,) { }

  ngOnInit(): void {
    this.premiseId = this.remsshareService.premiseViewID.value
    this.request_Status = this.remsshareService.premiseReqStatus.value
    this.premise_status = this.remsshareService.premisesStatus.value

    this.route.queryParams
      .subscribe(params => {
        this.comefrom = params.comefrom;
      }
      );

    this.AgreementDate_or_Landlord_Modify = false;
    if (this.comefrom === "ADDAGREEMENT") {
      this.AgreementDate_or_Landlord_Modify = true;
    }
    if (this.request_Status === "ONBOARD" && this.premise_status === "DRAFT" && this.comefrom === "EDITAGREEMENT") {
      this.AgreementDate_or_Landlord_Modify = true;
    }
    if (this.request_Status === "MODIFICATION" && this.premise_status === "DRAFT" && this.comefrom === "EDITAGREEMENT") {
      this.AgreementDate_or_Landlord_Modify = true;
    }
    this.agreementForm = this.fb.group({
      start_date: [''],
      end_date: [''],
      registration_date: [''],
      lease_period: [''],
      enhancement_terms: [''],
      lease_registration: ['', Validators.required],
      rent_adjustment: [''],
      vacation_terms: [''],
      vacation_period: [''],
      lock_in_period: [''],
      lease_registration_status: [''],
      lease_regcharges_paidby: [''],
      temporary_lease: [''],
      rent_schedule: [''],
      relaxation_start_date: [''],
      relaxation_end_date: [''],
      relaxation_period: [''],
      vacation_date: [''],
      vacation_reason: [''],
      security_deposit: ['', Validators.required],
      lease_status: [''],
      primary_contact: ['', Validators.required],
      ecf_no: [''],
      allocation: [''],
      agreement_occupancy_map: [{ value: '', disabled: true }, Validators.required],
      type: [''],
      rentpaying_ofz: [],
      status: [''],
      landlord_allocation_ratio: this.fb.group({
        landlord_id: ['', Validators.required],
        share: ['', Validators.required],
        bs_id: ['', Validators.required],
        cc_id: ['', Validators.required],
      }),



    })

    let primaykey: String = "";
    this.primaryContact(primaykey);
    this.agreementForm.get('primary_contact').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.remsService.Employee(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.primaryContactList = datas;
      })

    let primaykey11: String = "";
    this.primaryContact2(primaykey11);
    this.getStatus();
    this.agreementForm.controls.landlord_allocation_ratio.get('landlord_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.remsService.get_landlordListwithpageno(this.premiseId, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.landList = datas;
      })

    let office1keyvalue: String = "";
    this.getpriOffice(office1keyvalue);
    this.agreementForm.get('rentpaying_ofz').valueChanges
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

    let bskey: String = "";
    this.bsvalue(bskey);
    this.agreementForm.controls.landlord_allocation_ratio.get('bs_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.remsService.get_BSListwithpageno(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.BSList = datas;
      })

    this.agreementForm.controls.landlord_allocation_ratio.get('cc_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.remsService.get_CCList(value, this.bsid)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.CCList = datas;
      })

    let occkey: String = "";
    this.occuvalue(occkey);
    if (this.agreement_occupancy_map !== null) {
      this.agreement_occupancy_map.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.remsService.getMultipleOccupancy(this.premiseId, value)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.OccupancyListobj = datas;

        })

    }
    this.getLeasestatus();
    this.getEditAgreement();
    this.getRegistrationStatus();
    this.getRegchargespaidby();

    this.getLandlordList();
    this.getScheduleType();
  }

  OnBSChange(e) {
    this.bsid = e.source.value.id;
  }
  getccList()
  {
    this.remsService.get_CCList("", this.bsid)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.CCList = datas;
    })
  }
  addLandlord() {

    if (this.agreementForm.value.landlord_allocation_ratio.landlord_id === "") {
      this.notification.showError("Please Select Any One Landlord Name")
      return false;
    }
    if (this.agreementForm.value.landlord_allocation_ratio.share === "") {
      this.notification.showError("Please Enter Share")
      return false;
    }
    if (this.agreementForm.value.landlord_allocation_ratio.bs_id === "") {
      this.notification.showError("Please Enter BS")
      return false;
    }

    let share = this.detailsList.map(x => x.share);
    let percent = share.reduce((a, b) => Number(a) + Number(b), 0) + +this.agreementForm.value.landlord_allocation_ratio.share;
    percent = Math.round(percent)
    console.log("percent----", percent)
    if(percent > 100)
    {
      this.notification.showError("Sum of share % should not exceed 100")
      return false;
    }
    let landlord = this.agreementForm.value.landlord_allocation_ratio.landlord_id
    let amt = this.agreementForm.value.landlord_allocation_ratio.share
    let bsoutput = this.agreementForm.value.landlord_allocation_ratio.bs_id;
    let ccoutput = this.agreementForm.value.landlord_allocation_ratio.cc_id;
    let ccbsdata5 = {
      bs_id: bsoutput.id,
      bsname: bsoutput.name,
      cc_id: ccoutput.id,
      ccname: ccoutput.name,
    }
    this.array1.push(ccbsdata5);
    if(String(amt).indexOf('.') > -1)
    {
      amt = amt.toFixed(2)
    }
    let data = {
      landlord_id: landlord.id,
      landlord_name: landlord.name,
      share: amt,
      ccbs: this.array1
    }
    this.array1 = [];
    this.detailsList.push(data)
    this.inputratio.nativeElement.value = null;
    this.inputlandlord.nativeElement.value = null;
    this.agreementForm.value.landlord_allocation_ratio.landlord_id = ""
    this.agreementForm.value.landlord_allocation_ratio.share = ""
    this.agreementForm.value.landlord_allocation_ratio.bs_id = ""
    let primaykey11: String = "";
    this.primaryContact2(primaykey11);
    let bskey: String = "";
    this.bsvalue(bskey);
  }

  DeleteDetails(index: number) {
    this.detailsList.splice(index, 1);
  }

  public displayFn1(primary?: PrimaryContact): string | undefined {
    return primary ? primary.full_name : undefined;
  }

  get primary() {
    return this.agreementForm.get('primary_contact');
  }

  private primaryContact(primaykey) {
    this.remsService.Employee(primaykey)
      .subscribe((results) => {
        let datas = results["data"];
        this.primaryContactList = datas;
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
                this.remsService.EmployeeName(this.primaryContactInput.nativeElement.value, this.currentpage + 1, 'all')
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

  public displayFnLandlord(auto?: LanlordList): string | undefined {
    return auto ? auto.name : undefined;
  }

  public displayFnBS(autobs1?: BSList): string | undefined {
    return autobs1 ? autobs1.name : undefined;
  }

  public displayFnCC(autocc1?: CCList): string | undefined {
    return autocc1 ? autocc1.name : undefined;
  }
  public displayPriOff(prioffice?: primaryOffice): string | undefined {
    return prioffice ? prioffice.name : undefined;
  }

  get prioffice() {
    return this.agreementForm.value.get('rentpaying_ofz');
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

  private primaryContact2(primaykey) {
    this.remsService.get_landlordList(this.premiseId, primaykey)
      .subscribe((results) => {
        let datas = results["data"];
        this.landList = datas;
      })
  }

  private getStatus() {
    this.remsService.getAgreementStatus()
      .subscribe((results) => {
        let datas = results["data"];
        this.Status = datas;
      })
  }

  private bsvalue(bskey) {
    this.remsService.get_BSList(bskey)
      .subscribe((results) => {
        let datas = results["data"];
        this.BSList = datas;
      })
  }

  private occuvalue(occkey) {
    this.remsService.getMultipleOccupancy(this.premiseId, occkey)
      .subscribe((results) => {
        let datas = results["data"];
        this.OccupancyListobj = datas;
      })
  }




  setDate(event: string) {
    const date = new Date(event)
    this.ss = date
    this.toDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }
  enddate(event: string) {
    const date = new Date(event)
    this.aa = date
    if (this.AgreementId == undefined) {
      this.leasePeriod = (this.aa.getMonth() - this.ss.getMonth() + 1) +
        (12 * (this.aa.getFullYear() - this.ss.getFullYear()))
    } else {
      const etdate = new Date(this.updatestartdate)
      this.ss = etdate
      this.leasePeriod = (this.aa.getMonth() - this.ss.getMonth() + 1) +
        (12 * (this.aa.getFullYear() - this.ss.getFullYear()))
    }
  }
  setDate1(event: string) {
    const date = new Date(event)
    this.ss1 = date
    this.toDate1 = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  relaxationEnddate(event: string) {
    const date = new Date(event)
    this.aa1 = date

    this.relaxationPeriod = (this.aa1.getMonth() - this.ss1.getMonth() + 1) +
      (12 * (this.aa1.getFullYear() - this.ss1.getFullYear()))

  }

  getEditAgreement() {
    let dataa: any = this.remsshareService.agreementForm.value;
    console.log("dataa", dataa);
    this.AgreementId = dataa.id;
    let typeName = this.remsshareService.premiseLeased.value;
    this.RentSchedule = typeName;
    console.log("dataa.modify_data", dataa.modify_data);
    // if (this.request_Status === "MODIFICATION" && this.premise_status === "DRAFT" && dataa.modify_data===undefined) {
    //   this.AgreementDate_or_Landlord_Modify = false;
    // }
    if (dataa.modify_data === "Modify") {
      this.AgreementDate_or_Landlord_Modify = true;
    }
    if (dataa.modify_data === "New") {
      this.AgreementDate_or_Landlord_Modify = true;
    }

    if (this.AgreementId !== undefined) {
      this.remsService.getparticularAgreement(this.premiseId, this.AgreementId)
        .subscribe((data) => {
          this.detailsList = data.landlord_allocation_ratio.data;
          this.oldLandlordList = this.detailsList.filter(function (f) { return f; });
          this.agg_startdate = data.start_date
          this.termcreated_flag = data.termcreated_flag;
          const start_data = new Date(data.start_date)
          this.agreementEndDate = new Date(start_data.getFullYear(), start_data.getMonth(), start_data.getDate())
          this.updatestartdate = start_data
          const ed_data = new Date(data.end_date)
          this.agg_enddate = data.end_date
          this.leasePeriod = data.lease_period;
          this.relaxationPeriod = data.relaxation_period;
          let occuarray: any = [];
          let occupancyId: any = [];
          for (let i = 0; i < data.occupancy.length; i++) {
            occuarray.push(data.occupancy[i])
            occupancyId.push(data.occupancy[i].occupancy_id)
          }
          this.chipSelectedOccupancy = occuarray
          this.occupancypatchedId = occupancyId
          console.log("this.chipSelectedOccupancy",this.chipSelectedOccupancy)
          console.log("this.occupancypatchedId",this.occupancypatchedId)
          if (data.lease_registration_status.id == 1) {
            this.isRegcharges = true;
            this.isRegdate = true;
            this.isChargespaidby = true;
          }
          if (data.lease_registration_status.id == 2 || data.lease_registration_status.id == 3) {
            this.isECFNo = false;
            this.isAllocation = false;
            this.isRegcharges = false;
            this.isRegdate = false;
            this.isChargespaidby = false;
          }
          if (data.lease_regcharges_paidby != null) {
            if (data.lease_regcharges_paidby.id == 1) {
              this.isECFNo = true;
              this.isAllocation = false;
              this.ecfno = data.ecf_no;
            }
            if (data.lease_regcharges_paidby.id == 3) {
              this.isECFNo = true;
              this.isAllocation = true;
              this.ecfno = data.ecf_no;
              this.allocation = data.allocation;
            }
          }
          if (data.lease_regcharges_paidby != null) {
            this.paidbyid = data.lease_regcharges_paidby.id
          }
          this.agreementForm.patchValue({
            start_date: data.start_date,
            end_date: data.end_date,
            registration_date: data.registration_date,
            lease_period: this.leasePeriod,
            enhancement_terms: data.enhancement_terms,
            lease_registration: data.lease_registration,
            rent_adjustment: data.rent_adjustment,
            vacation_terms: data.vacation_terms,
            vacation_period: data.vacation_period,
            lock_in_period: data.lock_in_period,
            lease_registration_status: data.lease_registration_status.id,
            lease_regcharges_paidby: this.paidbyid,
            temporary_lease: data.temporary_lease,
            rent_schedule: data.rent_schedule,
            relaxation_start_date: data.relaxation_start_date,
            relaxation_end_date: data.relaxation_end_date,
            relaxation_period: this.relaxationPeriod,
            vacation_date: data.vacation_date,
            vacation_reason: data.vacation_reason,
            security_deposit: data.security_deposit,
            lease_status: data.lease_status.id,
            ecf_no: this.ecfno,
            allocation: this.allocation,
            primary_contact: data.primarycontact,
            rentpaying_ofz: data.rentpaying_ofz,
            agreement_occupancy_map: this.chipSelectedOccupancy,
            type: data.type.id,
            status: data.status.id,
          });
          if (this.AgreementDate_or_Landlord_Modify === false) {
            this.agreementForm.controls.start_date.disable();
            this.agreementForm.controls.end_date.disable();
            this.agreementForm.controls.lease_period.disable();
          } else {
            this.agreementForm.controls.start_date.enable();
            this.agreementForm.controls.end_date.enable();
            this.agreementForm.controls.lease_period.enable();
          }
        })
    }
  }

  regchargesDropDown(data) {
    if (data.id == 1) {
      this.isECFNo = true;
      this.isAllocation = false;
    } if (data.id == 3) {
      this.isECFNo = true;
      this.isAllocation = true;
    } if (data.id == 2) {
      this.isECFNo = false;
      this.isAllocation = false;
    }
  }

  regStatusDropDown(data) {
    if (data.id == 1) {
      this.isRegcharges = true;
      this.isRegdate = true;
      this.isChargespaidby = true;
    } else {
      this.isRegcharges = false;
      this.isRegdate = false;
      this.isChargespaidby = false;
      this.isECFNo = false;
      this.isAllocation = false;
    }
  }

  //occupancy
  public removeOccupancy(list: OccupancyList): void {
    const index = this.chipSelectedOccupancy.indexOf(list);
    this.chipSelectedOccupancy.splice(index, 1);
    if (this.occupancypatchedId) {
      for (let i = 0; i < this.chipSelectedOccupancy.length; i++) {
        let occbalance_id = this.chipSelectedOccupancy[i].id
        this.array.push(occbalance_id)
        this.occupancypatchedId = this.array
      }
    }
    this.chipSelectedOccupancyid.splice(index, 1);
    console.log("chipSelectedOccupancy-remove",this.chipSelectedOccupancy);
    return;
  }

  public occupancySelected(event: MatAutocompleteSelectedEvent): void {
    this.selectOccupancyByName(event.option.value.code);
    this.occupancyInput.nativeElement.value = '';
  }

  private selectOccupancyByName(selected_occcode) {
    console.log("employeeName",selected_occcode)
    let foundEmployee1 = this.chipSelectedOccupancy.filter(list => list.occupancy_code == selected_occcode);
    if (foundEmployee1.length) {
      return;
    }
    let foundEmployee = this.OccupancyListobj.filter(list => list.code == selected_occcode);
    if (foundEmployee.length) {
      console.log("foundEmployee[0]",foundEmployee[0])
      // this.chipSelectedOccupancy.push(foundEmployee[0]);
      let occupancydetails={"occupancy_id":foundEmployee[0].id,"occupancy_code":foundEmployee[0].code}
      this.chipSelectedOccupancyid.push(foundEmployee[0].id);
      this.chipSelectedOccupancy.push(occupancydetails);
      this.occIdvalue = this.chipSelectedOccupancyid
    }
    console.log("chipSelectedOccupancy-add",this.chipSelectedOccupancy);
  }

  agreementFormCreate() {
    console.log("this.occIdvalue",this.occIdvalue);
    console.log("this.occupancypatchedId",this.occupancypatchedId);
    console.log("chipSelectedOccupancyid",this.chipSelectedOccupancyid);
    console.log("chipSelectedOccupancy",this.chipSelectedOccupancy);
    // if (this.occIdvalue) {
    //   this.agreementForm.value.occupancy_id = this.occIdvalue
    // } else {
    //   this.agreementForm.value.occupancy_id = this.occupancypatchedId
    // }
    this.agreementForm.value.agreement_occupancy_map = this.chipSelectedOccupancy
    if (this.agreementForm.value.lease_regcharges_paidby == 2) {
      this.agreementForm.value.ecf_no = null;
    }
    if (this.agreementForm.value.lease_regcharges_paidby == 1 || this.agreementForm.value.lease_regcharges_paidby == 2) {
      this.agreementForm.value.allocation = null;
    }

    if (this.agreementForm.value.lease_registration_status == 2 || this.agreementForm.value.lease_registration_status == 3) {
      this.agreementForm.value.registration_date = null;
      this.agreementForm.value.lease_registration = null;
      this.agreementForm.value.lease_regcharges_paidby = null;
      this.agreementForm.value.allocation = null;
      this.agreementForm.value.ecf_no = null;
    }


    if (this.agreementForm.value.lease_status === "") {
      this.toastr.warning('', 'Please Enter Lease Status', { timeOut: 1500 });
      return false;
    } if (this.agreementForm.value.primary_contact === "") {
      this.toastr.warning('', 'Please Enter Primary Contact', { timeOut: 1500 });
      return false;
    }
    if (this.agreementForm.value.rentpaying_ofz === "") {
      this.toastr.warning('', 'Please Enter Rent Paying office', { timeOut: 1500 });
      return false;
    }
    if (this.agreementForm.value.start_date === "") {
      this.toastr.warning('', 'Select Start Date', { timeOut: 1500 });
      return false;
    }
    if (this.agreementForm.value.end_date === "") {
      this.toastr.warning('', 'Select End Date', { timeOut: 1500 });
      return false;
    }

    if (this.agreementForm.value.lease_period === "") {
      this.toastr.warning('', 'Please Enter Lease Period', { timeOut: 1500 });
      return false;
    }
    if (this.agreementForm.value.relaxation_end_date < this.agreementForm.value.relaxation_start_date) {
      this.toastr.error('Select Valid Relaxation Date', 'End date must be greater than Start date', { timeOut: 1500 });
      return false;
    }

    if (this.agreementForm.value.lease_registration_status === "") {
      this.toastr.warning('', 'Please Enter Lease Registration Status', { timeOut: 1500 });
      return false;
    }
    if (this.agreementForm.value.lease_registration_status == 1) {
      if (this.agreementForm.value.lease_registration === "") {
        this.toastr.warning('', 'Please Enter Lease Registration Charges', { timeOut: 1500 });
        return false;
      }
      if (this.agreementForm.value.lease_regcharges_paidby === "") {
        this.toastr.warning('', 'Please Enter Lease Regcharges Paidby', { timeOut: 1500 });
        return false;
      }
    }

    if (this.agreementForm.value.temporary_lease === "") {
      this.toastr.warning('', 'Please Enter Temporary Lease', { timeOut: 1500 });
      return false;
    }

    if (this.agreementForm.value.security_deposit === "") {
      this.toastr.warning('', 'Please Enter Security Deposit', { timeOut: 1500 });
      return false;
    }

    if (this.agreementForm.value.registration_date === "" || null) {
      this.agreementForm.value.registration_date = null
    }

    if (this.agreementForm.value.relaxation_start_date === "" || null) {
      this.agreementForm.value.relaxation_start_date = null
    }

    if (this.agreementForm.value.relaxation_end_date === "" || null) {
      this.agreementForm.value.relaxation_end_date = null
    }

    if (this.agreementForm.value.vacation_date === "" || null) {
      this.agreementForm.value.vacation_date = null
    }

    if (this.agreementForm.value.type === "") {
      this.toastr.warning('', 'Please Select Any One Schedule Type', { timeOut: 1500 });
      return false;
    }
    console.log("agreement_occupancy_map",this.agreementForm.value.agreement_occupancy_map)
    if (this.agreementForm.value.agreement_occupancy_map === "" || this.agreementForm.value.agreement_occupancy_map === undefined) {
      this.toastr.warning('', 'Please Enter Occupancy', { timeOut: 1500 });
      return false;
    }
    
    const startDate = this.agreementForm.value;
    startDate.start_date = this.datePipe.transform(startDate.start_date, 'yyyy-MM-dd');
    const endDate = this.agreementForm.value;
    endDate.end_date = this.datePipe.transform(endDate.end_date, 'yyyy-MM-dd');
    const registrationDate = this.agreementForm.value;
    registrationDate.registration_date = this.datePipe.transform(registrationDate.registration_date, 'yyyy-MM-dd');
    const relaxationStartDate = this.agreementForm.value;
    relaxationStartDate.relaxation_start_date = this.datePipe.transform(relaxationStartDate.relaxation_start_date, 'yyyy-MM-dd');
    const relaxationEndDate = this.agreementForm.value;
    relaxationEndDate.relaxation_end_date = this.datePipe.transform(relaxationEndDate.relaxation_end_date, 'yyyy-MM-dd');
    const vacationData = this.agreementForm.value;
    vacationData.vacation_date = this.datePipe.transform(vacationData.vacation_date, 'yyyy-MM-dd');
    this.agreementForm.value.primary_contact = this.agreementForm.value.primary_contact.id
    this.agreementForm.value.rent_schedule = this.RentSchedule;
    this.agreementForm.value.rentpaying_ofz = this.agreementForm.value.rentpaying_ofz.id;
    let obj = this.detailsList
    let sharess = obj.map(x => x.share);
    this.sum = sharess.reduce((a, b) => Number(a) + Number(b), 0);
    this.sum = this.sum.toFixed(2)
    if (this.sum > 100 || this.sum < 100) {
      this.notification.showError("Allocation Ratio Not Matched")
      return false;
    }
    if (this.agreementForm.value.end_date < this.agreementForm.value.start_date) {
      this.toastr.error('Select Valid Date', 'End date must be greater than Start date');
      return false;
    }

    if (this.AgreementId == undefined) {
      let obj = this.detailsList
      this.remsService.agreementFormCreate(this.agreementForm.value, '', this.premiseId, obj)
        .subscribe(result => {
          let code = result.code
          if (code === "INVALID_MODIFICATION_REQUEST") {
            this.notification.showError("You can not Modify before getting the Approval")
            return false;
          }
          else if (result.id === undefined) {
            this.notification.showError(result.description)
            return false
          }
          else {
            this.notification.showSuccess("Successfully created!...")
            this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Agreement and Rent" }, skipLocationChange: isSkipLocationChange });
          }
        });
    } else {  //if AgreementId exists
      this.AgreementDate_or_LandlordEdited = false;
      if (this.termcreated_flag === true) {
        if (this.agg_startdate !== startDate.start_date) {
          this.AgreementDate_or_LandlordEdited = true;
        }
        if (this.agg_enddate !== endDate.end_date) {
          this.AgreementDate_or_LandlordEdited = true;
        }
        for (var i = 0; i < this.detailsList.length; i++) {
          let landlordid = this.detailsList[i].landlord_id.id;
          if (landlordid === undefined) { landlordid = this.detailsList[i].landlord_id }
          let foundLandlord = this.oldLandlordList.filter(landlordid1 => landlordid1.landlord_id.id == landlordid);
          if (foundLandlord.length === 0) {
            // We found the id in the oldLandlordList list
            this.AgreementDate_or_LandlordEdited = true;
            break;
          }
        }
        for (var i = 0; i < this.oldLandlordList.length; i++) {
          let landlordid = this.oldLandlordList[i].landlord_id.id;
          if (landlordid === undefined) { landlordid = this.oldLandlordList[i].landlord_id }
          let foundLandlord = this.detailsList.filter(landlordid1 => landlordid1.landlord_id.id == landlordid);
          if (foundLandlord.length === 0) {
            // We found the id in the detailsList list
            this.AgreementDate_or_LandlordEdited = true;
            break;
          }
        }
      }
      if (this.AgreementDate_or_LandlordEdited === false) {
        this.detailsList1 = [];
        this.array1 = [];
        for (var i = 0; i < this.detailsList.length; i++) {
          let landlordid: any;
          if (this.detailsList[i].landlord_id.id === undefined) {
            landlordid = this.detailsList[i].landlord_id;
          } else {
            landlordid = this.detailsList[i].landlord_id.id;
          }
          let landlordname: any;
          if (this.detailsList[i].landlord_id.name === undefined) {
            landlordname = this.detailsList[i].landlord_name
          } else {
            landlordname = this.detailsList[i].landlord_id.name
          }
          let shareamt = this.detailsList[i].share;
          let agreelandlordmapid = this.detailsList[i].agreelandlord_mapid;
          let ccbs1: any;
          if (this.detailsList[i].ccbs[0].ccbs_details === undefined) {
            ccbs1 = this.detailsList[i].ccbs[0];
          } else {
            ccbs1 = this.detailsList[i].ccbs[0].ccbs_details;
          }
          let ccbsdata5 = {
            bs_id: ccbs1.bs_id,
            bsname: ccbs1.bs_name,
            cc_id: ccbs1.cc_id,
            ccname: ccbs1.cc_name,
          }
          this.array1.push(ccbsdata5);
          let data = {
            agreelandlord_mapid: agreelandlordmapid,
            landlord_id: landlordid,
            landlord_name: landlordname,
            share: shareamt,
            ccbs: this.array1
          }
          this.array1 = [];
          this.detailsList1.push(data)
        }
        let obj = this.detailsList1
        this.remsService.agreementFormCreate(this.agreementForm.value, this.AgreementId, this.premiseId, obj)
          .subscribe(result => {
            let code = result.code
            if (code === "INVALID_MODIFICATION_REQUEST") {
              this.notification.showError("You can not Modify before getting the Approval")
              return false;
            }
            else if (result.id === undefined) {
              this.notification.showError(result.description)
              return false
            }
            else {
              this.notification.showSuccess("Successfully Updated!...")
              this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Agreement and Rent" }, skipLocationChange: isSkipLocationChange });
            }
          })
      }//if (this.AgreementDate_or_LandlordEdited === false)
      if (this.AgreementDate_or_LandlordEdited === true) {
        var answer = window.confirm("Agreement Date or Landlord details changed.Do you want to delete this agreement and create new one?");
        if (answer) {
          //some code
        }
        else {
          return false;
        }
        this.remsService.wholeschedule_delete(this.AgreementId)
          .subscribe((result) => {
            let code = result.code;
            let status = result.status;
            if (status === "success") {
              this.detailsList1 = [];
              this.array1 = [];
              for (var i = 0; i < this.detailsList.length; i++) {
                let landlordid = this.detailsList[i].landlord_id.id;
                let landlordname = this.detailsList[i].landlord_id.name;
                let shareamt = this.detailsList[i].share;
                let ccbs1 = this.detailsList[i].ccbs[0].ccbs_details;
                let ccbsdata5 = {
                  bs_id: ccbs1.bs_id,
                  bsname: ccbs1.bs_name,
                  cc_id: ccbs1.cc_id,
                  ccname: ccbs1.cc_name,
                }
                this.array1.push(ccbsdata5);
                let data = {
                  landlord_id: landlordid,
                  landlord_name: landlordname,
                  share: shareamt,
                  ccbs: this.array1
                }
                this.array1 = [];
                this.detailsList1.push(data)
              }
              let obj = this.detailsList1
              this.remsService.agreementFormCreate(this.agreementForm.value, '', this.premiseId, obj)
                .subscribe(result => {
                  let code = result.code
                  if (code === "INVALID_MODIFICATION_REQUEST") {
                    this.notification.showError("You can not Modify before getting the Approval")
                    return false;
                  }
                  else if (result.id === undefined) {
                    this.notification.showError(result.description)
                    return false
                  }
                  else {
                    this.notification.showSuccess("Successfully created!...")
                    this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Agreement and Rent" }, skipLocationChange: isSkipLocationChange });
                  }
                });
            }//if (status === 'success')
            if (code === "INVALID_DATA") {
              this.notification.showError("RO number created.So you can not modify this agreement")
              return false;
            }
            else {
              this.notification.showError(result.description)
              return false
            }
          });
      }//if (this.AgreementDate_or_LandlordEdited === true) 
    }//if AgreementId exists
  }

  onCancelClick() {
    this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Agreement and Rent" }, skipLocationChange: isSkipLocationChange });
  }

  percentMax=100
  valPercent()
  {
    let amt = String(this.agreementForm.controls.landlord_allocation_ratio.value.share)
    let dotind = amt.indexOf(".")

    if(dotind >-1 && (dotind +2 < amt.length-1))
    {
      let n = amt.slice(0,amt.length-1)
      this.agreementForm.controls.landlord_allocation_ratio.get('share').setValue(n)
    }
    if (+amt > this.percentMax) {
      this.toastr.warning("Percentage should not exceed 100");
      let n = amt.slice(0,amt.length-1)
      this.agreementForm.controls.landlord_allocation_ratio.get('share').setValue(n)
      return false
    }   
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

  getRegistrationStatus() {
    this.remsService.getRegistrationStatus()
      .subscribe(result => {
        this.registrationStatus = result.data;
      })
  }
  getScheduleType() {
    this.remsService.getScheduleType()
      .subscribe(result => {
        this.typeList = result.data;
      })
  }
  scheduleTypechange(e) {
    let type = e.source.value
    if (e.isUserInput == true) {
      if (type == 1) {
        let startagreementEnddate: any = this.remsshareService.startagreementEnddate.value
        const startenddata = new Date(startagreementEnddate)
        this.agreementEndDate = new Date(startenddata.getFullYear(), startenddata.getMonth(), startenddata.getDate() + 1)
        return false
      }
      else if (type == 2) {
        let amenitiesagreementEnddate: any = this.remsshareService.amenitiesagreementEnddate.value
        const startenddata = new Date(amenitiesagreementEnddate)
        this.agreementEndDate = new Date(startenddata.getFullYear(), startenddata.getMonth(), startenddata.getDate() + 1)
        return false
      } else if (type == 3) {
        let maintenanceagreementEnddate: any = this.remsshareService.maintenanceagreementEnddate.value
        const startenddata = new Date(maintenanceagreementEnddate)
        this.agreementEndDate = new Date(startenddata.getFullYear(), startenddata.getMonth(), startenddata.getDate() + 1)
        return false
      }
    }
  }

  getRegchargespaidby() {
    this.remsService.getRegchargespaidby()
      .subscribe(result => {
        this.regchargespaidby = result.data;
      })
  }

  getLeasestatus() {
    this.remsService.getLeasestatus()
      .subscribe(result => {
        let res = result.data
        this.leaseStatus = res;
        // for (let i = 0; i < res.length; i++) {
        //   if (this.request_Status === "ONBOARD") {
        //     this.leaseStatus = res.splice(0, 1);
        //     break;
        //   }
        //   else if (this.request_Status === "RENEWAL") {
        //     this.leaseStatus = res.splice(1, 1);
        //     break;
        //   }
        //   else if (this.request_Status === "MODIFICATION") {
        //     this.leaseStatus = res.splice(1, 1);
        //     break;
        //   }

        // }
      })
  }

  getOccupancyList() {
    this.remsService.getOccupancy(this.premiseId)
      .subscribe(result => {
        this.occupancyList = result.data;
      })
  }

  getLandlordList() {
    this.remsService.getlanlord(this.premiseId)
      .subscribe(result => {
        this.landList = result.data;

      })
  }
  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || (k >= 48 && k <= 57));
  }
}
