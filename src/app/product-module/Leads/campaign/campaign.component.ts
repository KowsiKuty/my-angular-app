import { Component, EventEmitter, Injectable, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NativeDateAdapter } from '@angular/material/core';
import { DatePipe, formatDate } from '@angular/common';

export interface Objdatas {
  code: any
  name: any
  no: any
  id: any
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

@Injectable()
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss'],
  providers: [imp.LogFile, imp.UtilFiles, imp.Master, imp.ToastrService, imp.ProductAPI,
  { provide: imp.DateAdapter, useClass: PickDateAdapter },
  { provide: imp.MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,]
})
export class CampaignComponent implements OnInit {

  constructor(private fb: FormBuilder, private service: ApicallserviceService,
    private spin: imp.NgxSpinnerService, private log: imp.LogFile, private activatedRoute: ActivatedRoute,
    private error: imp.ErrorHandlingServiceService, private route: Router, private master: imp.Master,
    private notify: imp.ToastrService, private productapi: imp.ProductAPI, private datepipe: DatePipe) { }

  CampaignSummary: boolean;
  Campaign: boolean;
  CampaignSummarySearch: FormGroup;
  CampaignFormAllocation: FormGroup;
  Campaign_id = new FormControl('')
  product_id = new FormControl('');
  @Output() viewLeads = new EventEmitter();
  @Output() addCampaign = new EventEmitter();
  // @Output() submit = new EventEmitter<any>();


  ngOnInit(): void {
    this.CampaignSummary = true
    this.Campaign = false
    this.CampaignSummarySearch = this.fb.group({
      codename: '',
      from_date: '',
      to_date: ''
    })

    this.CampaignFormAllocation = this.fb.group({
      campaign: '',
      city_id: '',
      district_id: '',
      state_id: '',
      pincode_id: '',
      source_id: '',
      from_date: '',
      to_date: ''
    })

    this.CampaignSearch('')

  }

  CampaignObjects: any = {
    has_nextCampaign: false,
    has_previousCampaign: false,
    presentpageCampaign: 1,
    CampaignList: [],
    CampaignDD_List: [],
    CityList: [],
    DistrictList: [],
    StateList: [],
    PincodeList: [],
    SourceList: [],
    SelectFilterCampaign: [],
    SelectFilterCampaignHeader: [],
    ActualSelectedData: [],
    ProductPopUpArr: []
  }



  serviceCallCampaignSummaryget(search, pageno) {
    this.service.ApiCall('get', this.productapi.ProductsAPI.campaign + '?page=' + pageno + "&", search)
      .subscribe(result => {
        this.spin.hide()
        this.log.logging("Campaign Summary", result)
        let page = result['pagination']
        this.CampaignObjects.CampaignList = result['data']
        if (this.CampaignObjects.CampaignList?.length > 0) {
          this.CampaignObjects.has_nextCampaign = page.has_next;
          this.CampaignObjects.has_previousCampaign = page.has_previous;
          this.CampaignObjects.presentpageCampaign = page.index;
        }
      }, (error) => {
        this.error.handleError(error);
        this.spin.hide();
      })
  }

  CampaignSearch(hint: any) {
    let search = this.CampaignSummarySearch.value;
    let obj = {
      name: search?.codename,
      from_date: search?.from_date,
      to_date: search?.to_date
    }
    console.log("obj data b4 api", obj)
    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null) {
        obj[i] = '';
      }
    }
    this.spin.show();

    if (hint == 'next') {
      this.serviceCallCampaignSummaryget(obj, this.CampaignObjects.presentpageCampaign + 1)
    }
    else if (hint == 'previous') {
      this.serviceCallCampaignSummaryget(obj, this.CampaignObjects.presentpageCampaign - 1)
    }
    else {
      this.serviceCallCampaignSummaryget(obj, 1)
    }

  }

  resetCampaign() {
    this.CampaignSummarySearch.reset('')
    this.CampaignSearch('')
  }

  AddCampaign() {
    console.log("Add called")
    this.CampaignSummary = false;
    this.Campaign = true;
  }


  ShowProduct(prodData){
    this.CampaignObjects.ProductPopUpArr = prodData

  }

}
