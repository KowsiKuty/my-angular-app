import { Component, OnInit, ViewChild } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Rems2Service } from '../rems2.service'
import { takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { environment } from 'src/environments/environment'

const isSkipLocationChange = environment.isSkipLocationChange

export interface ctrlofzListss {
  name: string;
  id: number;
}
@Component({
  selector: 'app-rems-summary',
  templateUrl: './rems-summary.component.html',
  styleUrls: ['./rems-summary.component.scss']
})
export class RemsSummaryComponent implements OnInit {
  @ViewChild('usagecode') matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('rmInput') rmInput: any;

  remsMasterList: any
  occupancyList: any
  premisedropList: any
  urls: string
  urlControllingOffice: string;
  urlPremise: string;
  urlOccupancy: string;
  isControllinOffice: boolean;
  isPermise: boolean;
  isoccupancypage: boolean = true;
  isoccupancypages: boolean = true;
  isOccupancy: boolean = true;
  isOccupancyForm: boolean;
  isOccupancyEditForm: boolean;
  
  addFormBtn: string = "Occupancy";
  ismakerCheckerButton: boolean = true;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  pagesize = 10;
  PremiseSearchForm: FormGroup;
  has_nextctrl = true;
  has_previousctrl = true;
  has_nextprem = true;
  has_previousprem = true;
  has_nextinsty = true;
  has_previousinsty = true;
  has_nextid = true;
  has_previousid = true;
  presentpageinsty: number = 1;
  presentpagectrl: number = 1;
  presentpageprem: number = 1;
  PremiseList: any;
  isLoading = false;
  isPremiseList: boolean;
  ControllingOfficeList: Array<ctrlofzListss>;
  tabsValue = ""
  premisesTypeData: any;
  usageType: any;
  UsageCodeData: any;
  pinCodeList: any;
  cityList: any;
  search: any;
  constructor(private remsService: RemsService, private fb: FormBuilder,
    private router: Router, private remsService2: Rems2Service,
    private remsshareService: RemsShareService) { }

  ngOnInit(): void {
    // this.remsshareService.premiseConnection ==='FUCK'
    this.getPremise();
    this.premisedrop();
    this.PremiseSearchForm = this.fb.group({
      // code: "",
      // name: "",
      // controllingofz_id: ""
      premise_name: "",
      premise_type: "",
      city: "",
      pincode: "",
      occupancy_usagetype: "",
      occupancy_usagecode: "",
      premise_filter : "",
    })
    /*  this.PremiseSearchForm.get('controllingofz_id').valueChanges
       .pipe(
         debounceTime(100),
         distinctUntilChanged(),
         tap(() => {
           this.isLoading = true;
           console.log('inside tap')
 
         }),
 
         switchMap(value => this.remsService.getControllingOfzDropDown(value)
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
 
       }) */
    let rmkeyvalue: String = "";
    this.getUsageCodee(rmkeyvalue);

    this.PremiseSearchForm.get('occupancy_usagecode').valueChanges
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
        this.UsageCodeData = datas;

      })

    let pinkeyvalue: String = "";
    this.getPinCode(pinkeyvalue);
    this.PremiseSearchForm.get('pincode').valueChanges
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

    let citykeyvalue: String = "";
    this.getCity(citykeyvalue);
    this.PremiseSearchForm.get('city').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.remsService.getCityDropDown(value)
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

    this.premisesType();
    this.getUsage();
  }

  createFormate() {
    let data = this.PremiseSearchForm.controls;
    let search = new premiseSearchtype();
    // premiseSearchclass.code = data['code'].value;
    // premiseSearchclass.name = data['name'].value;
    // premiseSearchclass.name = data['name'].value;
    // premiseSearchclass.controllingofz_id = data['controllingofz_id'].value.id;
    search.premise_name = data['premise_name'].value;
    search.premise_type = data['premise_type'].value;
    search.occupancy_usagetype = data['occupancy_usagetype'].value;
    if(data['city'].value != null){
    search.city = data['city'].value.id;
    search.pincode = data['pincode'].value.id;
    search.occupancy_usagecode = data['occupancy_usagecode'].value.id;
    }
    return search;
  }

  provisionOpen()
  {
    this.router.navigate(['/rems/rems/provisionReport'], { skipLocationChange: isSkipLocationChange });
  }

  leaseOpen()
  {
    this.router.navigate(['/rems/rems/leaseReport'], { skipLocationChange: isSkipLocationChange });
  }
  OverallScheduleClick(){
    this.router.navigate(['/rems/scheduleoverall'], { skipLocationChange: isSkipLocationChange });
  }

  PremiseSearch() {
    // let search = this.PremiseSearchForm.value;
    this.search = this.createFormate();
    for (let i in this.search) {
      if (!this.search[i]) {
        delete this.search[i];
      }
    }
    this.filterFlg =false
    this.getPremise();
    // this.remsService.getPremiseSearch(search)
    //   .subscribe(result => {
    //     console.log("premise search result", result)
    //     this.PremiseList = result['data']
    //     if (search.name === '' && search.code === '' && search.controllingofz_id === '') {
    //       this.getPremise();
    //     }
    //   })
  }

  reset() {
    this.PremiseSearchForm.reset();
    this.search = undefined;
    this.filterFlg = false
    this.abc=1
    this.getPremise();
  }
  abc: number = 1
  filterFlg = true
  onpremiseChange( e = 1) {
    this.PremiseSearchForm.controls["premise_name"].reset();
    this.PremiseSearchForm.controls["premise_type"].reset();
    this.PremiseSearchForm.controls["city"].reset();
    this.PremiseSearchForm.controls["pincode"].reset();
    this.PremiseSearchForm.controls["occupancy_usagetype"].reset();
    this.PremiseSearchForm.controls["occupancy_usagecode"].reset();

    this.search = undefined;
    this.abc = e
    this.filterFlg = true
    this.getPremise()

  }
  private premisedrop() {
    this.remsService.premisedrop()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.premisedropList = datas;
      })

  }


  getPremise(pageNumber = 1, pageSize = 10) {
    if(! this.filterFlg )
      // this.PremiseSearchForm.controls['premise_filter'].reset("")
   
    this.remsService.getPremiseRemsSummary(pageNumber, pageSize, this.abc, this.search)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.PremiseList = datas;
        if (this.PremiseList.length >= 0) {
          this.has_nextprem = datapagination.has_next;
          this.has_previousprem = datapagination.has_previous;
          this.presentpageprem = datapagination.index;
          this.isPremiseList = true;
        } else if (this.PremiseList.length == 0) {
          this.isPremiseList = false;
        }
      })

  }
  pre_nextClick() {
    if (this.has_nextprem === true) {
      // this.currentpage= this.presentpage + 1
      this.getPremise(this.presentpageprem + 1, 10)
    }
  }

  pre_previousClick() {
    if (this.has_previousprem === true) {
      // this.currentpage= this.presentpage - 1
      this.getPremise(this.presentpageprem - 1, 10)
    }
  }


  premiseView(PremiseViewData) {
    this.remsshareService.PremiseView.next(PremiseViewData);
    this.router.navigate(['/rems/premiseView'], { skipLocationChange: isSkipLocationChange })
  }
  public displayFn(cotype?: ctrlofzListss): string | undefined {
    return cotype ? cotype.name : undefined;
  }

  get cotype() {
    return this.PremiseSearchForm.get('controllingofz_id');
  }

  premiseType(type) {
    if (type == 1) {
      return "LEASED"

    } else if (type == 2) {
      return "OWNED"
    } else {
      return "Owned and Leased"
    }
  }

  addPremise() {
    this.router.navigate(['/rems/premiseCreate'], { skipLocationChange: isSkipLocationChange });

  }
  addPremiseIdentification() {
    this.router.navigate(['/rems/identificationSummary'], { skipLocationChange: isSkipLocationChange });

  }


  premisesType() {
    this.remsService2.premisesType()
      .subscribe((results) => {
        this.premisesTypeData = results.data;
      })
  }


  getUsage() {
    this.remsService.getUsage()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.usageType = datas;
      })

  }

  public displayFnRm(usagecode?: usageCode): string | undefined {
    return usagecode ? usagecode.name : undefined;
  }

  get usagecode() {
    return this.PremiseSearchForm.value.get('occupancy_usagecode');
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


  public displayFnpin(pintype?: pinCodeListss): string | undefined {
    return pintype ? pintype.no : undefined;
  }

  get pintype() {
    return this.PremiseSearchForm.value.get('pincode');
  }

  private getPinCode(pinkeyvalue) {
    this.remsService.getPinCodeDropDown(pinkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.pinCodeList = datas;
      })
  }

  public displayFncity(citytype?: cityListss): string | undefined {
    return citytype ? citytype.name : undefined;
  }

  get citytype() {
    return this.PremiseSearchForm.value.get('city');

  }
  private getCity(citykeyvalue) {
    this.remsService.getCityDropDown(citykeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cityList = datas;
      })
  }



}


class premiseSearchtype {
  name: string;
  controllingofz_id: any;
  code: string;
  premise_name: string;
  premise_type: number;
  city: number;
  pincode: number;
  occupancy_usagetype: number;
  occupancy_usagecode: number

}

export interface usageCode {
  id: number;
  name: string;
  code: string;
}

export interface cityListss {
  name: string;
  id: number;
}
export interface pinCodeListss {
  no: string;
  id: number;
}