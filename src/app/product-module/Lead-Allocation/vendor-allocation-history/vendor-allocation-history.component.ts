import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatAutocomplete } from '@angular/material/autocomplete';
export interface Objdatas {
  code: any
  name: any
}

@Component({
  selector: 'app-vendor-allocation-history',
  templateUrl: './vendor-allocation-history.component.html',
  styleUrls: ['./vendor-allocation-history.component.scss'],
  providers: [imp.LogFile, imp.UtilFiles, imp.Master, imp.ToastrService, imp.ProductAPI]
})
export class VendorAllocationHistoryComponent implements OnInit {

  constructor(private fb: FormBuilder, private service: ApicallserviceService,
    private spin: imp.NgxSpinnerService, private log: imp.LogFile, private activatedRoute: ActivatedRoute,
    private error: imp.ErrorHandlingServiceService, private route: Router, private master: imp.Master,
    private notify: imp.ToastrService, private productapi: imp.ProductAPI) { }

  VendorAllocationHistorySummarySearch: FormGroup;
  VendorAllocationSearch: FormGroup;
  width = 35
  selectedNav: ''
  CRM_Allocation_Menu_List: any
  Objs={
    'Vendor Allocation History':false,
    'Allocation': false, 
    'Unassigned Leads': false  
  }

  ngOnInit(): void {
    this.CRM_Allocation_Menu_List = [ { name: "Allocation" },{ name: "Vendor Allocation History" },{ name: "Unassigned Leads" }];

    this.VendorAllocationHistorySummarySearch = this.fb.group({
      codename: '', 
    })
    this.VendorAllocationSearch = this.fb.group({
      codename: '' 
    })

    this.VendorAllocationHistorySearch('')
    this.VendorAllocationSummarySearch('')



    // this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
    //   let SummaryCall: any = params.get('data')
    //   console.log("summary call", SummaryCall)
    //   // this.VendorAllocationHistorySearch('');
    //   // if( SummaryCall == 'Summary'){ 

    //   // } 
    // })

  }


  VendorAllocationHistoryObjects:any = {
    has_nextVendorAllocationHistory: false,
    has_previousVendorAllocationHistory: false,
    presentpageVendorAllocationHistory: 1,
    VendorAllocationHistoryList: [],

    has_nextVendorAllocation: false,
    has_previousVendorAllocation: false,
    presentpageVendorAllocation: 1,
    VendorAllocationList: [],
     

  }


  serviceCallVendorAllocationHistorySummaryget(search, pageno) {
    this.service.ApiCall('get', this.productapi.ProductsAPI.VendorAllocationHistory + '?page=' + pageno + "&", search)
      .subscribe(result => {
        this.spin.hide()
        let page = result['pagination']
        this.VendorAllocationHistoryObjects.VendorAllocationHistoryList = result['data']
        this.log.logging("VendorAllocationHistory Summary", result, this.VendorAllocationHistoryObjects.VendorAllocationHistoryList)
        if (this.VendorAllocationHistoryObjects.VendorAllocationHistoryList?.length > 0) {
          this.VendorAllocationHistoryObjects.has_nextVendorAllocationHistory = page.has_next;
          this.VendorAllocationHistoryObjects.has_previousVendorAllocationHistory = page.has_previous;
          this.VendorAllocationHistoryObjects.presentpageVendorAllocationHistory = page.index;
        }
      }, (error) => {
        this.error.handleError(error);
        this.spin.hide();
      })
  }

  VendorAllocationHistorySearch(hint: any) {
    let search = this.VendorAllocationHistorySummarySearch.value;
    let obj = {
      name: search?.codename,
      status: search?.status
    }
    console.log("obj data b4 api", obj)
    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null) {
        obj[i] = '';
      }
    }
    this.spin.show();

    if (hint == 'next') {
      this.serviceCallVendorAllocationHistorySummaryget(obj, this.VendorAllocationHistoryObjects.presentpageVendorAllocationHistory + 1)
    }
    else if (hint == 'previous') {
      this.serviceCallVendorAllocationHistorySummaryget(obj, this.VendorAllocationHistoryObjects.presentpageVendorAllocationHistory - 1)
    }
    else {
      this.serviceCallVendorAllocationHistorySummaryget(obj, 1)
    }

  }

  resetVendorAllocationHistory() {
    this.VendorAllocationHistorySummarySearch.reset('')
    this.VendorAllocationHistorySearch('')
  }



  getMenus(data) {

    if(data == null || data == undefined || data == ''){ 
      return false 
    }
    this.selectedNav = data?.name

    console.log("keyObjs keys seperate", data)
      let objs = this.Objs
      console.log("objs",objs)
      for (let i in objs) { 
        console.log("loop data ", i , data?.name )
        if (!(i == data?.name)) {
          objs[i] = false;
        } else {
          objs[i] = true;
        } 
      //  } 
    }

  }


///////////////////////////// Vendor Allocation



serviceCallVendorAllocationSummaryget(search, pageno) {
  this.service.ApiCall('get', this.productapi.ProductsAPI.VendorAllocation + '&page=' + pageno + "&", search)
    .subscribe(result => {
      this.spin.hide()
      this.log.logging("VendorAllocation Summary", result)
      let page = result['pagination']
      this.VendorAllocationHistoryObjects.VendorAllocationList = result['data']
      if (this.VendorAllocationHistoryObjects.VendorAllocationList?.length > 0) {
        this.VendorAllocationHistoryObjects.has_nextVendorAllocation = page.has_next;
        this.VendorAllocationHistoryObjects.has_previousVendorAllocation = page.has_previous;
        this.VendorAllocationHistoryObjects.presentpageVendorAllocation = page.index;
      }
    }, (error) => {
      this.error.handleError(error);
      this.spin.hide();
    })
}

VendorAllocationSummarySearch(hint: any) {
  let search = this.VendorAllocationHistorySummarySearch.value;
  let obj = {
    name: search?.codename
  }
  console.log("obj data b4 api", obj)
  for (let i in obj) {
    if (obj[i] == undefined || obj[i] == null) {
      obj[i] = '';
    }
  }
  this.spin.show();

  if (hint == 'next') {
    this.serviceCallVendorAllocationSummaryget(obj, this.VendorAllocationHistoryObjects.presentpageVendorAllocation + 1)
  }
  else if (hint == 'previous') {
    this.serviceCallVendorAllocationSummaryget(obj, this.VendorAllocationHistoryObjects.presentpageVendorAllocation - 1)
  }
  else {
    this.serviceCallVendorAllocationSummaryget(obj, 1)
  }

}

resetVendorAllocation() {
  this.VendorAllocationSearch.reset('')
  this.VendorAllocationSummarySearch('')
}









}
