import { Component, OnInit, ViewChild,Input } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { SharedService } from '../../service/shared.service';
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router'
import { fromEvent } from 'rxjs';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, tap, map, takeUntil, switchMap, finalize } from 'rxjs/operators';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
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
@Component({
  selector: 'app-premise-details-form',
  templateUrl: './premise-details-form.component.html',
  styleUrls: ['./premise-details-form.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class PremiseDetailsFormComponent implements OnInit {
  @ViewChild('autoPrimary') matAutocompleteDept: MatAutocomplete;
  @ViewChild('primaryContactInput') primaryContactInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @Input() max: any;
  premiseDetailsForm: FormGroup;
  idValue: any;
  premiseId: any;
  primaryContactList: any;
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  tomorrow = new Date();
  PredetButton=false;
  constructor(private fb: FormBuilder, private router: Router, private datePipe: DatePipe,
    private remsshareService: RemsShareService, private shareService: SharedService,
    private remsService: RemsService, private toastr: ToastrService,
    private notification: NotificationService, ) { }

  ngOnInit(): void {
    this.premiseDetailsForm = this.fb.group({
      building_name: ['', Validators.required,],
      purchased_date: ['', Validators.required],
      registered_date: ['', Validators.required],
      registration_charge: ['', Validators.required],
      reg_charges_paidby: ['', Validators.required],
      allocation_charges: ['', Validators.required],
      floors_owned: ['', Validators.required],
      description: ['', Validators.required],
      primary_contact: ['', Validators.required],
      building_details: this.fb.group({
        name: ['', Validators.required],
        land_area: ['', Validators.required],
        land_purchased_amount: ['', Validators.required],
        construction_date: ['', Validators.required],
        land_revaluation_amount: ['', Validators.required],
        land_market_value: ['', Validators.required],
        carpet_area: ['', Validators.required],
        common_area: ['', Validators.required],
        buildup_area: ['', Validators.required],
        building_purchased_amount: ['', Validators.required],
        building_revaluation_amount: ['', Validators.required],
        building_market_value: ['', Validators.required],
      })

    })
    let primaykey: String = "";
    this.primaryContact(primaykey);
    this.premiseDetailsForm.get('primary_contact').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.remsService.premiseDetail(value)
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
    this.getPremiseId();
    this.getPremiseDetailsEdit();
  }
  getPremiseId() {
    this.premiseId = this.remsshareService.premiseViewID.value
    console.log(".s.s.",this.premiseId)
  }

  getPremiseDetailsEdit() {
    let data: any = this.remsshareService.premiseDetailsForm.value;
    this.idValue = data.id;
    if (data === '') {
      this.premiseDetailsForm.patchValue({
        building_name: '',
        purchased_date: '',
        registered_date: '',
        registration_charge: '',
        reg_charges_paidby: '',
        allocation_charges: '',
        floors_owned: '',
        primary_contact: '',
        description:'',
        building_details: {
          name: '',
          land_area: '',
          land_purchased_amount: '',
          construction_date: '',
          land_revaluation_amount: '',
          land_market_value: '',
          carpet_area: '',
          common_area: '',
          buildup_area: '',
          building_purchased_amount: '',
          building_revaluation_amount: '',
          building_market_value: ''
        }
      })
    }
    else {
      this.premiseDetailsForm.patchValue({
        building_name: data.building_name,
        purchased_date: data.purchased_date,
        registered_date: data.registered_date,
        registration_charge: data.registration_charge ,
        reg_charges_paidby: data.reg_charges_paidby,
        allocation_charges: data.allocation_charges,
        floors_owned: data.floors_owned,
        primary_contact: data.primary_contact,
        description:data.description,
        building_details: {
          name: data.building_details.name,
          land_area: data.building_details.land_area,
          land_purchased_amount: data.building_details.land_purchased_amount,
          construction_date: data.building_details.construction_date,
          land_revaluation_amount: data.building_details.land_revaluation_amount,
          land_market_value: data.building_details.land_market_value,
          carpet_area: data.building_details.carpet_area,
          common_area: data.building_details.common_area,
          buildup_area: data.building_details.buildup_area,
          building_purchased_amount: data.building_details.building_purchased_amount,
          building_revaluation_amount: data.building_details.building_revaluation_amount,
          building_market_value: data.building_details.building_market_value,
        }
      })
    }
  }


  premiseDetailsFormCreate() {
    this.PredetButton=true;
    if (this.premiseDetailsForm.value.building_name === "") {
      this.toastr.warning('', 'Please Enter Building Name', { timeOut: 1500 });
      this.PredetButton=false;
      return false;
    } if (this.premiseDetailsForm.value.purchased_date === "") {
      this.toastr.warning('', 'Select Purchased Date', { timeOut: 1500 });
      this.PredetButton=false;
      return false;
    }
    if (this.premiseDetailsForm.value.registered_date === "") {
      this.toastr.warning('', 'Select Registered Date', { timeOut: 1500 });
      this.PredetButton=false;
      return false;
    } if (this.premiseDetailsForm.value.registration_charge === "") {
      this.toastr.warning('', 'Please Enter registration', { timeOut: 1500 });
      this.PredetButton=false;
      return false;
    } if (this.premiseDetailsForm.value.reg_charges_paidby === "") {
      this.toastr.warning('', 'Please Enter Reg Charged', { timeOut: 1500 });
      this.PredetButton=false;
      return false;
    }
    if (this.premiseDetailsForm.value.allocation_charges === "") {
      this.toastr.warning('', 'Please Enter Allocation Charges', { timeOut: 1500 });
      this.PredetButton=false;
      return false;
    } if (this.premiseDetailsForm.value.floors_owned === "") {
      this.toastr.warning('', 'Please Enter Floors owned', { timeOut: 1500 });
      this.PredetButton=false;
      return false;
    } if (this.premiseDetailsForm.value.primary_contact === "") {
      this.toastr.warning('', 'Please Enter Primary Contact', { timeOut: 1500 });
      this.PredetButton=false;
      return false;
    } if (this.premiseDetailsForm.value.building_details.name === "") {
      this.toastr.warning('', 'Please Enter Name', { timeOut: 1500 });
      this.PredetButton=false;
      return false;
    } if (this.premiseDetailsForm.value.building_details.land_area === "") {
      this.toastr.warning('', 'Please Enter Land Area', { timeOut: 1500 });
      this.PredetButton=false;
      return false;
    } if (this.premiseDetailsForm.value.building_details.land_purchased_amount === "") {
      this.toastr.warning('', 'Please Enter Land Purchased Amount', { timeOut: 1500 });
      this.PredetButton=false;
      return false;
    } if (this.premiseDetailsForm.value.building_details.construction_date === "") {
      this.toastr.warning('', 'Select Construction Date', { timeOut: 1500 });
      this.PredetButton=false;
      return false;
    } if (this.premiseDetailsForm.value.building_details.land_revaluation_amount === "") {
      this.toastr.warning('', 'Please Enter Land Revaluation Amount', { timeOut: 1500 });
      this.PredetButton=false;
      this.PredetButton=false;
      return false;
    } if (this.premiseDetailsForm.value.building_details.land_market_value === "") {
      this.toastr.warning('', 'Please Enter Land Market Value', { timeOut: 1500 });
      this.PredetButton=false;
      return false;
    } if (this.premiseDetailsForm.value.building_details.carpet_area === "") {
      this.toastr.warning('', 'Please Enter Carpet Area', { timeOut: 1500 });
      this.PredetButton=false;
      return false;
    } if (this.premiseDetailsForm.value.building_details.buildup_area === "") {
      this.toastr.warning('', 'Please Enter Buildup Area', { timeOut: 1500 });
      this.PredetButton=false;
      return false;
    } if (this.premiseDetailsForm.value.building_details.common_area === "") {
      this.toastr.warning('', 'Please Enter Common Area', { timeOut: 1500 });
      this.PredetButton=false;
      return false;
    } if (this.premiseDetailsForm.value.building_details.building_purchased_amount === "") {
      this.toastr.warning('', 'Please Enter Building Purchased Amount', { timeOut: 1500 });
      this.PredetButton=false;
      return false;
    } if (this.premiseDetailsForm.value.building_details.building_revaluation_amount === "") {
      this.toastr.warning('', 'Please Enter Building Revaluation Amount', { timeOut: 1500 });
      this.PredetButton=false;
      return false;
    } if (this.premiseDetailsForm.value.building_details.building_market_value === "") {
      this.toastr.warning('', 'Please Enter Building Market  Value', { timeOut: 1500 });
      this.PredetButton=false;
      return false;
    }
    const purchaseDate = this.premiseDetailsForm.value;
    purchaseDate.purchased_date = this.datePipe.transform(purchaseDate.purchased_date, 'yyyy-MM-dd');
    const registeredDate = this.premiseDetailsForm.value;
    registeredDate.registered_date = this.datePipe.transform(registeredDate.registered_date, 'yyyy-MM-dd');
    const constructionDate = this.premiseDetailsForm.value;
    constructionDate.building_details.construction_date = this.datePipe.transform(constructionDate.building_details.construction_date, 'yyyy-MM-dd');

    if (this.idValue == undefined) {
      this.remsService.premiseDetailsFormCreate(this.premiseDetailsForm.value, this.premiseId, '')
        .subscribe(result => {
          console.log("prebuce", result)
          let code = result.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Modify before getting the Approval")
          this.PredetButton=false;
        }
          else {
            this.notification.showSuccess("Successfully created!...")
            this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Premise Details"}, skipLocationChange: isSkipLocationChange });
          }
          this.idValue = result.id;
        })
    } else {
      this.remsService.premiseDetailsFormCreate(this.premiseDetailsForm.value, this.premiseId, this.idValue)
        .subscribe(result => {
          let code = result.code
          if (code === "INVALID_MODIFICATION_REQUEST") {
            this.notification.showError("You can not Modify before getting the Approval")
            this.PredetButton=false;
          }
          else {
            this.notification.showSuccess("Successfully Updated!...")
            this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Premise Details"}, skipLocationChange: isSkipLocationChange });
          }
        })
    }
  }

  onCancelClick() {
    this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Premise Details"}, skipLocationChange: isSkipLocationChange });

  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  numberOnlyandDot(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if ((charCode < 46 || charCode >47)  && (charCode < 48 || charCode > 57) ){
      return false;
      }
      return true;
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
                this.remsService.premiseDetails(this.primaryContactInput.nativeElement.value, this.currentpage + 1, 'all')
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

  public displayFn(primary?: PrimaryContact): string | undefined {
    return primary ? primary.full_name : undefined;
  }

  get primary() {
    return this.premiseDetailsForm.get('primary_contact');
  }

  private primaryContact(primaykey) {
    this.remsService.premiseDetail(primaykey)
      .subscribe((results) => {
        let datas = results["data"];
        this.primaryContactList = datas;
      })
  }

}
export interface PrimaryContact {
  id: number;
  full_name: string;
}