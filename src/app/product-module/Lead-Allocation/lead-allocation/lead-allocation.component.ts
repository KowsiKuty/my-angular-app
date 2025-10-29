import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { ApicallserviceService } from 'src/app/AppAutoEngine/API Services/Api_and_Query/apicallservice.service';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles'

export interface datas {
  code: any
  name: any
}
@Component({
  selector: 'app-lead-allocation',
  templateUrl: './lead-allocation.component.html',
  styleUrls: ['./lead-allocation.component.scss'],
  providers: [imp.LogFile, imp.UtilFiles, imp.APIServicesPath, imp.Master, imp.ProductAPI, imp.Vendor]
})
export class LeadAllocationComponent implements OnInit {

  constructor(private fb: FormBuilder, private service: ApicallserviceService,
    private spin: imp.NgxSpinnerService, private log: imp.LogFile, private productpath: imp.ProductAPI,
    private notify: imp.ToastrService, private vendor: imp.Vendor,
    private error: imp.ErrorHandlingServiceService, private route: Router,
    private path: imp.APIServicesPath, private master: imp.Master) { }

  LeadAllocationSearchForm: FormGroup;
  LeadAllocationForm: FormGroup;
  limits = new FormControl('')

  ngOnInit(): void {
    this.LeadAllocationSearchForm = this.fb.group({
      codename: ''
    })
    this.LeadAllocationForm = this.fb.group({
      vendor: ''
    })

    this.LeadAllocationSearch('')
    this.getTotalCount()
  }




  LeadAllocationObjects: any = {
    has_nextLeadAllocation: false,
    has_previousLeadAllocation: false,
    presentpageLeadAllocation: 1,
    LeadAllocationList: [],
    VendorList: '',
    counts: 0,

    selectAll: {
      AllSelected: false
    },
    removeArr: [],
    addArr: []
  }


  serviceCallLeadAllocationSummaryget(search, pageno) {
    this.service.ApiCall('get', this.productpath.ProductsAPI.leadData + "?page=" + pageno + "&action=unassigned&", search)
      .subscribe(result => {
        this.spin.hide()
        this.log.logging("LeadAllocation Summary", result)
        let page = result['pagination']
        this.LeadAllocationObjects.LeadAllocationList = result['data']



        this.log.logging("this.LeadAllocationObjects.LeadAllocationList", this.LeadAllocationObjects.LeadAllocationList)

        if (this.LeadAllocationObjects.LeadAllocationList?.length > 0) {
          this.LeadAllocationObjects.has_nextLeadAllocation = page.has_next;
          this.LeadAllocationObjects.has_previousLeadAllocation = page.has_previous;
          this.LeadAllocationObjects.presentpageLeadAllocation = page.index;
        }
        if (this.LeadAllocationObjects.LeadAllocationList?.length > 0) {
          this.LeadAllocationObjects.LeadAllocationList.forEach(element => {
            Object.assign(element, { checked: false })
          });
          this.getCheckedOrNot()
        }
      }, (error) => {
        this.error.handleError(error);
        this.spin.hide();
      })
  }

  LeadAllocationSearch(hint: any) {
    let search = this.LeadAllocationSearchForm.value;
    let obj = {
      name: search.codename
    }
    // let obj = {
    //   name: search?.codename,
    //   category: search?.category_id?.id,
    //   subcategory:search?.subcategory_id?.id
    // }
    // console.log("obj data b4 api", obj)
    // for (let i in obj) {
    //   if (obj[i] == undefined || obj[i] == null) {
    //     obj[i] = '';
    //   }
    // }
    this.spin.show();

    if (hint == 'next') {
      this.serviceCallLeadAllocationSummaryget(obj, this.LeadAllocationObjects.presentpageLeadAllocation + 1)
    }
    else if (hint == 'previous') {
      this.serviceCallLeadAllocationSummaryget(obj, this.LeadAllocationObjects.presentpageLeadAllocation - 1)
    }
    else {
      this.serviceCallLeadAllocationSummaryget(obj, 1)
    }

  }

  resetLeadAllocation() {
    this.LeadAllocationSearchForm.reset('')
    this.LeadAllocationSearch('')
  }


  ////////////////////// Select All and Un Select All Functionality 

  SelectAllLeadsOrSingleLeads(event, type) {

    if (this.limits.value > this.LeadAllocationObjects?.counts || this.limits.value < 1) {
      this.LeadAllocationObjects.selectAll.AllSelected = false;
      event.stopPropagation()
      return false
    }

    // let boolSelect = event.target.checked == true ? true : false 
    // this.LeadAllocationObjects.LeadAllocationList.forEach(x => x.checked = boolSelect) 
    let arr: any = this.LeadAllocationObjects.LeadAllocationList
    if (event.target.checked == true) {
      this.LeadAllocationObjects.selectAll.AllSelected = true
      let pagenoData = this.LeadAllocationObjects?.presentpageLeadAllocation
      let AllocationSummary = this.LeadAllocationObjects.LeadAllocationList
      for (let ind in AllocationSummary) {
        let NumberOfPageNoData = Number(pagenoData)
        let NumberOfIndex = Number(ind)
        let indexCount = (NumberOfPageNoData - 1) * 10 + NumberOfIndex + 1

        let NumberIndexCount = Number(indexCount)
        // if(indexCount < this.LeadAllocationObjects?.counts ){ 
        //   AllocationSummary[ind].checked = true 
        // }
        this.log.logging("Index count and index and pagenoData and this.limits.value", indexCount,
          NumberIndexCount, NumberOfIndex, pagenoData, this.limits.value, "(", NumberIndexCount, '<', this.limits.value, ")")
        if (NumberIndexCount <= this.limits.value) {
          AllocationSummary[NumberOfIndex].checked = true
        }

      }

    } else {
      for (let data of arr) {
        data.checked = false
      }
      this.LeadAllocationObjects.addArr = []
      this.LeadAllocationObjects.removeArr = [] 
      this.LeadAllocationObjects.selectAll.AllSelected = false
    }


    this.log.logging("this.LeadAllocationObjects.selectAll.AllSelected", this.LeadAllocationObjects.selectAll.AllSelected)
  }

  getCheckedOrNot() {
    let arr: any = this.LeadAllocationObjects.LeadAllocationList
    if (this.LeadAllocationObjects.selectAll.AllSelected == true) {
      // for(let data of arr){
      //   data.checked = true
      // }
      this.LeadAllocationObjects.selectAll.AllSelected = true
      let pagenoData = this.LeadAllocationObjects?.presentpageLeadAllocation
      let AllocationSummary = this.LeadAllocationObjects.LeadAllocationList
      for (let ind in AllocationSummary) {
        let NumberOfPageNoData = Number(pagenoData)
        let NumberOfIndex = Number(ind)
        let indexCount = (NumberOfPageNoData - 1) * 10 + NumberOfIndex + 1

        let NumberIndexCount = Number(indexCount)
        // if(indexCount < this.LeadAllocationObjects?.counts ){ 
        //   AllocationSummary[ind].checked = true 
        // }
        this.log.logging("Index count and index and pagenoData and this.limits.value", indexCount,
          NumberIndexCount, NumberOfIndex, pagenoData, this.limits.value, "(", NumberIndexCount, '<', this.limits.value, ")")
        if (NumberIndexCount <= this.limits.value) {
          AllocationSummary[NumberOfIndex].checked = true
        }

      }
    } else {
      for (let data of arr) {
        data.checked = false
      }
    }
  }







  ///////////////////////////////////////Vendor Drop down///////////////////////////////////////////////////
  @ViewChild('Vendor') matcatAutocomplete: MatAutocomplete;
  @ViewChild('VendorInput') catInput: any;

  VendorDD(typeddata) {
    // console.log(typeddata)
    // this.spin.show();
    // this.service.commoditysearch(data, 1)
    this.service.ApiCall("get", this.vendor.vendor.vendorApi + typeddata + "&page=1")
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.log.logging("typeddata, results", typeddata, results)
        this.LeadAllocationObjects.VendorList = datas;
        // this.spin.hide();
      }, (error) => {
        this.error.handleError(error);
        this.spin.hide();
      })
  }

  public displayFnVendor(Vendor?: datas): string | undefined {
    return Vendor ? Vendor.name : undefined;
  }


  SubmitFinalDataAllocation() {
    let obj: any 
    if (this.LeadAllocationObjects.selectAll.AllSelected == true) {
      obj = {
        "count_arr": +(this.limits.value),
        "remove_arr": this.LeadAllocationObjects.removeArr,
        "add_arr": this.LeadAllocationObjects.addArr,
        "vendor_id": this.LeadAllocationForm.value.vendor?.id
      }
    }else{
      obj = {
        "count_arr": 0,
        "remove_arr": this.LeadAllocationObjects.removeArr,
        "add_arr": this.LeadAllocationObjects.addArr,
        "vendor_id": this.LeadAllocationForm.value.vendor?.id
      }
    }

    this.service.ApiCall('post', this.productpath.ProductsAPI.unassignedAllocation, obj) 
    .subscribe(results=>{
      this.log.logging("Results after unassigned Allocation", results)
      this.LeadAllocationObjects.selectAll.AllSelected = false
      this.LeadAllocationSearch('')
    })
    
  }

  AddRemoveArr(e, data) {
    this.log.logging("event and data", e.target.checked, data, this.LeadAllocationObjects.addArr.indexOf(data?.id))
    if (e.target.checked == true) {
      let checkRemoveArr: boolean = this.LeadAllocationObjects.removeArr.includes(data?.id)
      this.log.logging("check remove arr in remove arr", checkRemoveArr)
      if(checkRemoveArr){
      this.LeadAllocationObjects.removeArr.splice(this.LeadAllocationObjects.removeArr.indexOf(data?.id), 1)
      }
      this.LeadAllocationObjects.addArr.push(data?.id)
    } else {
      this.LeadAllocationObjects.addArr.splice(this.LeadAllocationObjects.addArr.indexOf(data?.id), 1)
      this.LeadAllocationObjects.removeArr.push(data?.id)

    }

    this.log.logging("add remove ", this.LeadAllocationObjects.addArr, this.LeadAllocationObjects.removeArr)

  }




  ////////////////////////// Count Calling API

  getTotalCount() {
    this.service.ApiCall("get", this.productpath.ProductsAPI.unassaignedCount)
      .subscribe(results => {
        this.log.logging("Count", results, results?.count)
        this.LeadAllocationObjects.counts = results?.count
        this.limits.patchValue(results?.count)
      })
  }















}
