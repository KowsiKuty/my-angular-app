import { DatePipe, formatDate } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { PprService } from '../ppr.service';

export interface display_interface {
  name: string;
  finyer:string;
  
}
export interface level_interface{
level:number;
}
// export const PICK_FORMATS = {
//   parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
//   display: {
//     dateInput: 'input',
//     monthYearLabel: { year: 'numeric', month: 'short' },
//     dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
//     monthYearA11yLabel: { year: 'numeric', month: 'long' }
//   }
// };

// class PickDateAdapter extends NativeDateAdapter {
//   format(date: Date, displayFormat: Object): string {
//     if (displayFormat === 'input') {
//       return formatDate(date, 'dd-MMM-yyyy', this.locale);
//     } else {
//       return date.toDateString();
//     }
//   }
// }
@Component({
  selector: 'app-cost-allocation-view',
  templateUrl: './cost-allocation-view.component.html',
  styleUrls: ['./cost-allocation-view.component.scss'],
  // providers: [{ provide: DateAdapter, useClass: PickDateAdapter },
  //   { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
  //     DatePipe]
})
export class CostAllocationViewComponent implements OnInit {
  cost_view:FormGroup;
  allocation_runing:FormGroup;
  sector_details:any;
  branch_details:any;
  business_details:any;
  cc_details:any;
  bs_details:any;
  finyear_details:any;
  allocation_finyear:any;
  cost_allocation_info:any=[];
  allocation_param:any;
  allocation_child_info:any;
  has_next:boolean;
  has_previous:boolean;
  currentpage:number;
  hasnext:boolean;
  hasprevious:boolean;
  presentpage:number=1;
  isSummaryPagination:boolean=false;
  to_has_next:boolean;
  to_has_previous:boolean;
  present_page:number=1;
  dispaly_child=false;
  child_id:number;
  params:any;
  Viewdata_child:any =[];
  View_childs:boolean = false;
  amount_type: any;
  frommonthid: any = 12;
  month = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
  endyear_ind: number = 8;
  startyear_ind: number = 9;
  start_month_arr: any = [];
  colspanlength: number;
  div_amount_data:any;
  identificationSize=10
  from_month = [
    { id: 1, month: 'Apr', month_id: 4 },
    { id: 2, month: 'May', month_id: 5 },
    { id: 3, month: 'Jun', month_id: 6 },
    { id: 4, month: 'Jul', month_id: 7 },
    { id: 5, month: 'Aug', month_id: 8 },
    { id: 6, month: 'Sep', month_id: 9 },
    { id: 7, month: 'Oct', month_id: 10 },
    { id: 8, month: 'Nov', month_id: 11 },
    { id: 9, month: 'Dec', month_id: 12 },
    { id: 10, month: 'Jan', month_id: 1 },
    { id: 11, month: 'Feb', month_id: 2 },
    { id: 12, month: 'Mar', month_id: 3 },
  ]
  from_months = [
    // { id: 1, month: 'Apr', month_id: 4 },
    { id: 2, month: 'May', month_id: 5 },
    { id: 3, month: 'Jun', month_id: 6 },
    { id: 4, month: 'Jul', month_id: 7 },
    { id: 5, month: 'Aug', month_id: 8 },
    { id: 6, month: 'Sep', month_id: 9 },
    { id: 7, month: 'Oct', month_id: 10 },
    { id: 8, month: 'Nov', month_id: 11 },
    { id: 9, month: 'Dec', month_id: 12 },
    { id: 10, month: 'Jan', month_id: 1 },
    { id: 11, month: 'Feb', month_id: 2 },
    { id: 12, month: 'Mar', month_id: 3 },
  ]
  showTooltip: boolean = false; 
  Download_names:any=["Forecost","Before Allocation","Allocation Master"]
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('finyearInput') finyearInput:any;
  @ViewChild('finyear_auto') finyear_auto:MatAutocomplete;
  @ViewChild('sectorInput') sectorInput:any;
  @ViewChild('sector_auto') sector_auto:MatAutocomplete;
  @ViewChild('branchInput') branchInput:any;
  @ViewChild('branch_auto') branch_auto:MatAutocomplete;
  @ViewChild('level_auto') level_auto :MatAutocomplete;
  @ViewChild('businessInput') businessInput:any;
  @ViewChild('business_auto') business_auto:MatAutocomplete;
  @ViewChild('bsInput') bsInput:any;
  @ViewChild('bs_auto') bs_auto:MatAutocomplete;
  @ViewChild('ccInput') ccInput:any;
  @ViewChild('cc_auto') cc_auto:MatAutocomplete;
  @ViewChild('allocation_finyear_input') allocation_finyear_input:any;
  @ViewChild('allocation_finyear_auto') allocation_finyear_auto:MatAutocomplete;
  @ViewChild('close_allocation') close_allocation:ElementRef;
  @ViewChild ('closecost_allocation') closecost_allocation:ElementRef;
  @Output() back_allocation:EventEmitter<boolean>=new EventEmitter();
  level_list: any;
  haspreviouss: boolean = false;
  hasnexts: boolean = false;
  constructor(private fb:FormBuilder,private SpinnerService: NgxSpinnerService,private datepipe:DatePipe,private dataService:PprService,private toastr:ToastrService) { }

  ngOnInit() {
    this.colspanlength = this.month.length
    this.cost_view=this.fb.group({
      finyear:[''],
      level:[''],
      frommonth: [''],
      tomonth: [''],
      sector:[''],
      business:[''],
      business_segment:[''],
      cc:[''],
      branch:[''],
      divAmount:[""]
    })
    this.allocation_runing=this.fb.group({
      finyear:[''],
      level:[''],
      // YoN:['NO'],
      // from_date: [''],
      // to_date: ['']
      frommonth: 'Apr',
      tomonth: [''],
    })
    // this.cost_allocation_search(this.cost_view.value)

  }
  finyear_dropdown(diff){
    let search_text:string;
    if(diff=="Search"){
      search_text=this.finyearInput.nativeElement.value;
    }else{
      search_text=this.allocation_finyear_input.nativeElement.value;
    }
    this.dataService.getfinyeardropdown(search_text, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        if(diff=='Search'){
          this.finyear_details=datas;
        }else{
          this.allocation_finyear=datas
        }
      })
  }
  public display_finyear(finyear_name?: display_interface): string | undefined {
    return finyear_name ? finyear_name.finyer : undefined;
  }
  autocompletefinyearScroll(diff) {
    this.has_next = true;
    this.has_previous = true;
    this.currentpage = 1;
    let auto_complete:any;
    let input_search:any;
    if(diff=='Search'){
      auto_complete=this.finyear_auto;
      input_search=this.finyearInput;
    }else{
      auto_complete=this.allocation_finyear_auto;
      input_search=this.allocation_finyear_input;
    }
    setTimeout(() => {
      if (
        auto_complete &&
        this.autocompleteTrigger &&
        auto_complete.panel
      ) {
        fromEvent(auto_complete.panel.nativeElement, 'scroll')
          .pipe(
            map(() => auto_complete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = auto_complete.panel.nativeElement.scrollTop;
            const scrollHeight = auto_complete.panel.nativeElement.scrollHeight;
            const elementHeight = auto_complete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getbbfinyeardropdown(input_search.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if(diff=='Search'){
                      this.finyear_details = this.finyear_details.concat(datas);
                      if (this.finyear_details.length >= 0) {
                        this.has_next = datapagination.has_next;
                        this.has_previous = datapagination.has_previous;
                        this.currentpage = datapagination.index;
                      }
                    }else{
                      this.allocation_finyear = this.allocation_finyear.concat(datas);
                      if (this.allocation_finyear.length >= 0) {
                        this.has_next = datapagination.has_next;
                        this.has_previous = datapagination.has_previous;
                        this.currentpage = datapagination.index;
                      }
                    }
                  })
              }
            }
          });
      }
    });
  }
  Sector_dropdown(){
    let seacr_value=this.sectorInput.nativeElement.value ?? ""
    this.dataService.getsectordropdown(seacr_value, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.sector_details = datas;
    })
  }
  public display_sector(sector_name?: display_interface): string | undefined {
    return sector_name ? sector_name.name : undefined;
  }
  public display_level(level_display?: level_interface): number|undefined {
    return level_display ? level_display.level : undefined;
  }
  autocompletesectorScroll() {
    this.has_next = true;
    this.has_previous = true;
    this.currentpage = 1;
    setTimeout(() => {
      if (
        this.sector_auto &&
        this.autocompleteTrigger &&
        this.sector_auto.panel
      ) {
        fromEvent(this.sector_auto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.sector_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.sector_auto.panel.nativeElement.scrollTop;
            const scrollHeight = this.sector_auto.panel.nativeElement.scrollHeight;
            const elementHeight = this.sector_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getsectordropdown(this.sectorInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.sector_details = this.sector_details.concat(datas);
                    if (this.sector_details.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  }
                )
              }
            }
          });
        } 
      });
  }
  branch_dropdown() {
    let branch_search=this.branchInput.nativeElement.value ?? ""
    this.dataService.getbranchdropdown(branch_search, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branch_details = datas;
      })
  }
  public display_branch(branch_name?: display_interface): string | undefined {
    return branch_name ? branch_name.name : undefined;
  }
  autocompletebranchnameScroll() {
    this.has_next = true;
    this.has_previous = true;
    this.currentpage = 1
    setTimeout(() => {
      if (
        this.branch_auto &&
        this.autocompleteTrigger &&
        this.branch_auto.panel
      ) {
        fromEvent(this.branch_auto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.branch_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.branch_auto.panel.nativeElement.scrollTop;
            const scrollHeight = this.branch_auto.panel.nativeElement.scrollHeight;
            const elementHeight = this.branch_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getbranchdropdown(this.branchInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branch_details = this.branch_details.concat(datas);
                    if (this.branch_details.length >= 0) {
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
  Business_dropdown(){
    let sector_id=this.cost_view.value.sector.id ?? "";
    let value=this.businessInput.nativeElement.value
    this.dataService.getbusinessdropdown(sector_id, value , 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.business_details = datas;
      })
  }
  public display_business(business_name?: display_interface): string | undefined {
    return business_name ? business_name.name : undefined;
  }
  autocompletebusinessnameScroll() {
    this.has_next = true;
    this.has_previous = true;
    this.currentpage = 1;
    let sector_id=this.cost_view.value.sector.id ?? "";
    setTimeout(() => {
      if (
        this.business_auto &&
        this.autocompleteTrigger &&
        this.business_auto.panel
      ) {
        fromEvent(this.business_auto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.business_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.business_auto.panel.nativeElement.scrollTop;
            const scrollHeight = this.business_auto.panel.nativeElement.scrollHeight;
            const elementHeight = this.business_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getbusinessdropdown(sector_id, this.businessInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.business_details = this.business_details.concat(datas);
                    if (this.business_details.length >= 0) {
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
  bs_dropdown() {
    let business_id=this.cost_view.value.business.id ?? 0;
    let value = this.bsInput.nativeElement.value ?? "";    
    this.dataService.getbsdropdown(business_id, value, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bs_details = datas;
    })
  }
  public display_bs(bs_name?: display_interface): string | undefined {
    return bs_name ? bs_name.name : undefined;
  }
  autocompletebsnameScroll() {
    this.has_next = true;
    this.has_previous = true;
    this.currentpage = 1;
    let business_id=this.cost_view.value.business.id ?? 0;
    setTimeout(() => {
      if (
        this.bs_auto &&
        this.autocompleteTrigger &&
        this.bs_auto.panel
      ) {
        fromEvent(this.bs_auto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.bs_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.bs_auto.panel.nativeElement.scrollTop;
            const scrollHeight = this.bs_auto.panel.nativeElement.scrollHeight;
            const elementHeight = this.bs_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getbsdropdown(business_id, this.bsInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.bs_details = this.bs_details.concat(datas);
                    if (this.bs_details.length >= 0) {
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
  cc_dropdown() {
    let bs = this.cost_view.value.business.id ?? 0;
    let value = this.ccInput.nativeElement.value ?? "";
    this.dataService.getccdropdown(bs, value, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cc_details = datas;
    })
    console.log("cc_log",this.cc_details)
  }
  public display_cc(cc_name?: display_interface): string | undefined {
    return cc_name ? cc_name.name : undefined;
  }
  autocompletccnameScroll() {
    this.has_next = true;
    this.has_previous = true;
    this.currentpage = 1;
    let bs = this.cost_view.value.business.id ?? 0;
    setTimeout(() => {
      if (
        this.cc_auto &&
        this.autocompleteTrigger &&
        this.cc_auto.panel
      ) {
        fromEvent(this.cc_auto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.cc_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.cc_auto.panel.nativeElement.scrollTop;
            const scrollHeight = this.cc_auto.panel.nativeElement.scrollHeight;
            const elementHeight = this.cc_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getccdropdown(bs, this.ccInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.cc_details = this.cc_details.concat(datas);
                    if (this.cc_details.length >= 0) {
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
  
  cost_allocation_search(cost_allocation,pageNumber=1){
    if (cost_allocation.finyear === undefined || cost_allocation.finyear === '' || cost_allocation.finyear === null) { 
      this.toastr.warning('', 'Please Select Finyear', { timeOut: 1500 });
      return false;
    }
    // if (cost_allocation.sector.name === undefined || cost_allocation.sector.name === '' || cost_allocation.sector.name === null) { 
    //   this.toastr.warning('', 'Please Select sector', { timeOut: 1500 });
    //   return false;
    // }
    if (cost_allocation.divAmount === undefined || cost_allocation.divAmount === '' || cost_allocation.divAmount === null) { 
      this.toastr.warning('', 'Please Select divAmount', { timeOut: 1500 });
      return false;
    }
    this.div_amount_data=cost_allocation.divAmount;
    this.allocation_param=cost_allocation
    let params={
      "from_month":cost_allocation.frommonth?cost_allocation.frommonth.month_id:"",
      "to_month":cost_allocation.tomonth?cost_allocation.tomonth.month_id: "",
      "level":cost_allocation.level ?? "",
      "bsname":cost_allocation.business_segment?.name ?? "",
      "ccname":cost_allocation.cc?.name ?? "",
      "divAmount":cost_allocation ?cost_allocation.divAmount:"",
      "bizname":cost_allocation.business?.name ?? "",
      "sectorname":cost_allocation.sector.name,
      "branch_id":cost_allocation.branch?.id ?? "",
      "fin_year":cost_allocation.finyear?.finyer ,
      "microbscode":cost_allocation.business_segment?cost_allocation.business_segment.microbscode:"",
      "microcccode":cost_allocation.cc?cost_allocation.cc.microcccode:"",
    }
    this.SpinnerService.show();
    this.dataService.allocation_view_summary(params,pageNumber).subscribe((results)=>{     
    this.SpinnerService.hide();
    let data=results.data
    
    
      if (data) {
        let dataPagination = results['pagination'];
        this.cost_allocation_info=data
        console.log("val")
        this.hasnexts = dataPagination.has_next;
        this.haspreviouss = dataPagination.has_previous;
        this.presentpage = dataPagination.index;
        this.isSummaryPagination = true;
      } else {
        this.cost_allocation_info=[]
        this.hasnexts = false;
        this.haspreviouss = false;
        this.presentpage = 1;
        this.isSummaryPagination = false;
      }
    },error=>{
      this.SpinnerService.hide();
    })
  }
  previousClick() {
    if (this.haspreviouss === true) {   
      this.currentpage = this.presentpage - 1
      this.cost_allocation_search(this.allocation_param,this.presentpage - 1)
    }
  }
  nextClick() {
    if (this.hasnexts === true) {   
      this.currentpage = this.presentpage + 1
      this.cost_allocation_search(this.allocation_param,this.presentpage + 1)
    }
  }
  
  Allocation_child(level,pageNumber=1){
    this.child_id=level
    this.View_childs= true;
    let params:any={
      parent_id:level.allocationparent_id,
      level:level.level,
      div_Amount:this.div_amount_data??"",
    }
    console.log("div amount",this.div_amount_data)
    this.Viewdata_child [0]=level
    console.log("child_parent data",this.Viewdata_child)
    this.SpinnerService.show();
    this.dataService.Allocation_child(params,pageNumber).subscribe((results)=>{
    // let results={
    //     "data": [
    //         {
    //             "DRCR_IN": "1",
    //             "allocationparent_id": 4,
    //             "amount": 0,
    //             "bizname": "PBAG",
    //             "branch_id": {
    //                 "code": "1101",
    //                 "id": 471,
    //                 "name": "CENTRAL OFFICE"
    //             },
    //             "bs_name": "ABG-AGRI",
    //             "cat_id": {
    //                 "id": 1,
    //                 "microcatcode": "MCAT0000001",
    //                 "name": "EXECUTIVE MALE SALARY",
    //                 "no": 100
    //             },
    //             "cc_name": "TAX CELL",
    //             "id": 5,
    //             "level": 1,
    //             "subcat_id": {
    //                 "id": 1,
    //                 "microsubcatcode": "MSUB0000001",
    //                 "name": "BASIC PAY - EXECUTIVES -M",
    //                 "no": "200"
    //             }
    //         }
    //     ],
    //     "pagination": {
    //         "has_next": false,
    //         "has_previous": false,
    //         "index": 1,
    //         "limit": 10
    //     }
    //   }
    this.SpinnerService.hide();
      let data=results['data']
      if(results?.set_code){
        this.toastr.warning("","DATA NOT FOUND",{timeOut:1500});
        return false;
      }
      if (data) {
        this.dispaly_child=true;
        let dataPagination=results['pagination']
        this.allocation_child_info=data
        console.log("val")
        this.to_has_next = dataPagination.has_next;
        this.to_has_previous = dataPagination.has_previous;
        this.present_page = dataPagination.index;
        if (data.length < 0) {
          this.toastr.warning("","No Data Found..",{timeOut:15000});
          this.to_has_next = false;
          this.to_has_previous = false;
          this.present_page = 1;
        }
      } 
    },error=>{
      this.SpinnerService.hide();
    })
  }
  previous_Click(){
    if(this.to_has_previous== true){
      this.Allocation_child(this.child_id,this.present_page - 1)
    }
  }
  next_Click() {
    if (this.to_has_next === true) {   
      this.Allocation_child(this.child_id,this.present_page + 1)
    }
  }
  search_details_clear(diff,change){
    if(change=='allocation'){
      if(diff == 'date'){
        this.allocation_runing.controls.tomonth.reset('');
      }else if(diff == 'all'){
        this.allocation_runing.controls.finyear.reset('');
        this.allocation_runing.controls.level.reset('');
        // this.allocation_runing.value.YoN='NO';
        // this.allocation_runing.controls.frommonth.reset('');
        this.allocation_runing.controls.tomonth.reset('');
        this.close_allocation.nativeElement.click();
      }
    }
    else if(change=='back'){
      this.back_allocation.emit(false)
    }
    else{
      if(diff=="business"){
        this.cost_view.controls.business_segment.reset('');
        this.cost_view.controls.cc.reset('');
      }else if(diff=="sector"){
        this.cost_view.controls.business.reset('');
        this.cost_view.controls.business_segment.reset('');
        this.cost_view.controls.cc.reset('');
      }else if(diff=='business_segment'){
        this.cost_view.controls.cc.reset('');
      }else if(diff == 'date'){
        this.cost_view.controls.tomonth.reset('');
      }else if(diff == 'All'){
        this.cost_view.reset('');
      }
    }
  }
  allocation_view_download(allocation,type){
    this.showTooltip=false;
    if(type==="Before Allocation"){
      this.SpinnerService.show()
      this.dataService.beforeallocation_run().subscribe((res:any)=>{
        this.SpinnerService.hide()
        console.log("response",res)
        if( res?.status=="Success"){
        this.toastr.success('',"Before Allocation File Starts",{timeOut:1500});
        } 
         if(res?.status=="Error"){
          this.toastr.warning('',res?.message,{timeOut:1500});
        }
  
      },error=>{
        this.SpinnerService.hide();
      })
    }else if(type==="Allocation Master"){
        this.SpinnerService.show()
        this.dataService.allocation_master_download().subscribe((res:any)=>{
          this.SpinnerService.hide()
          console.log("response",res)
          if( res?.status=="Success"){
          this.toastr.success('',"Allocation Master File Starts",{timeOut:1500});
          }  
          if(res?.status=="Error"){
            this.toastr.warning('',res?.message,{timeOut:1500});
          }
    
        },error=>{
          this.SpinnerService.hide();
        })
      }
    else{
    if(allocation.finyear == "" || allocation.finyear ==null || allocation.finyear == undefined){
      this.toastr.warning("","Please Select the Finyear" ,{timeOut:1500});
      return false;
    }
    if(allocation.frommonth == "" || allocation.frommonth ==null || allocation.frommonth == undefined){
      this.toastr.warning("","Please Select the From Month" ,{timeOut:1500});
      return false;
    }
    if(allocation.tomonth == "" || allocation.tomonth ==null || allocation.tomonth == undefined){
      this.toastr.warning("","Please Select the To Month" ,{timeOut:1500});
      return false;
    }
    let param={
      "from_month":allocation.frommonth.month_id,
      "to_month":allocation.tomonth.month_id,
      "fin_year":allocation.finyear.finyer,
      'level':''
    }
    this.SpinnerService.show()
    this.dataService.allocation_filedownload(param).subscribe((res)=>{

      this.SpinnerService.hide()
      console.log("response",res)
      if( res?.status=="Sucess"){
      this.toastr.success('',res?.message,{timeOut:1500});
      }else{
        this.toastr.warning('',res?.message,{timeOut:1500});
      }

    },error=>{
      this.SpinnerService.hide();
    })
  }
  }
  
  allocation_running(allocation){
    if(allocation.finyear == "" || allocation.finyear == null || allocation.finyear == undefined){
      this.toastr.warning("","Please fill the finyear" ,{timeOut:1500});
      return false;
    }  
    this.params={
      fin_year:allocation.finyear.finyer,
      from_month:4,
      to_month:allocation.tomonth? allocation.tomonth.month_id:'',
      level:0    
    }
  // }  
    this.SpinnerService.show();
    this.dataService.allocation_confirm(this.params).subscribe(res=>{
      this.SpinnerService.hide();
      if(res.status== "SUCCESS"){
        this.allocation_run(this.params)
      this.closecost_allocation.nativeElement.click();
      this.search_details_clear('all','allocation')
      }else{
        var glsubgrpconfirm=window.confirm("Do You want to delete already exsiting data and Continue?")
        console.log(glsubgrpconfirm)
        if(!glsubgrpconfirm){
          console.log("True")
          return false;
        }else{
          this.allocation_run(this.params)
         }
      }
    })
  }

  allocation_run(allocation){ 
    this.SpinnerService.show();
    this.dataService.allocation_run(allocation).subscribe(res=>{
      this.SpinnerService.hide();
      if(res.message== "Allocation RUN"){
      this.toastr.success("",res.message,{timeOut:1500});
      this.closecost_allocation.nativeElement.click();
      this.search_details_clear('all','allocation')
      }else{
        if(res.description=="ALREADY EXISTS "){
          this.toastr.warning("",res.description,{timeOut:1500});        
        }else{
          this.toastr.warning("",res.message,{timeOut:1500});
        }
      }
    },error=>{
      this.SpinnerService.hide();
    })
    console.log("params=>",this.params)
  // }

  }
 
  arial_close(){
    // this.allocation_runing.reset()
    this.allocation_runing.get("finyear").reset();
      this.allocation_runing.get("level").reset();
      this.allocation_runing.get("tomonth").reset();
      this.close_allocation.nativeElement.click()
  }
 arial_close_fore(){
  this.allocation_runing.get("finyear").reset();
  this.allocation_runing.get("level").reset();
  this.allocation_runing.get("tomonth").reset();
this.closecost_allocation.nativeElement.click()
 }
  lakhs() {
    this.amount_type = "Amount In Lakhs"
  }
  thousands() {
    this.amount_type = "Amount In Thousands"
  }
  frommonthsearch(month) {
    this.frommonthid = month.id
    this.month = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'YTD']
    let startmonth = this.month.findIndex((start) => start == month.month)
    console.log("month=>", startmonth)
    this.month = this.month.filter((m, ind) => {
      if (startmonth <= ind) {
        return m;
      } else {
        return
      }
    })
    let startyear = this.month.findIndex(startind => startind == "Dec")
    this.startyear_ind = startyear + 1
    this.colspanlength = this.month.length
    this.start_month_arr = this.month
    console.log('month=>', this.month)
    this.cost_view.controls['tomonth'].reset('')    
    console.log("colspanlength=>", this.colspanlength)
   
   
  }
  tomonthsearch(month) {
    if (this.start_month_arr.length != 0) {
      this.month = this.start_month_arr
    }
    let startmonth = this.month.findIndex((start) => start == month.month)
    console.log("month=>", startmonth)
    this.month = this.month.filter((m, ind) => {
      if (startmonth >= ind || m == "YTD") {
        return m;
      } else {
        return
      }
    })
    this.colspanlength = this.month.length   
    console.log("month changes=>", this.month)
 

  
  }

  leve_dropdown(){
    this.SpinnerService.show();
    this.dataService.leve_dropdown().subscribe(res=>{
      this.SpinnerService.hide();
          let data=res['data']
          this.level_list=data
    },error=>{
      this.SpinnerService.hide();
    })
  }


  allocation_move(forecast_value){
let fore=forecast_value
console.log("fore",fore)
if(fore.finyear == "" || fore.finyear == null || fore.finyear == undefined){
  this.toastr.warning("","Please fill the finyear" ,{timeOut:1500});
  return false;
}
// if(fore.tomonth == "" || fore.tomonth == null || fore.tomonth == undefined){
//   this.toastr.warning("","Please fill the tomonth" ,{timeOut:1500});
//   return false;
// }

let PARAMS={
  "from_month":4,
  "to_month":fore.tomonth?.month_id ??"",
  "fin_year":fore.finyear.finyer,
}
this.SpinnerService.show();
this.dataService.allocation_forecost(PARAMS).subscribe(res=>{
  this.SpinnerService.hide();
  if(res.status=="Sucess"){
  this.toastr.success("",res.status,{timeOut:1500});
  this.arial_close()
  this.close_allocation.nativeElement.click();
  this.search_details_clear('all','allocation')
}else{
  this.toastr.warning("",res.set_code,{timeOut:1500})
}
},error=>{
  this.SpinnerService.hide();
})
console.log("params=>",this.params)
  }

  onOptionClick(name: string): void {
    console.log("Selected option",name);
   
  }
  // @HostListener('document:click', ['$event'])
  // onDocumentClick(event: MouseEvent): void {
  //   const targetElement = event.target as HTMLElement;
  //   if (!targetElement.closest('.col-md-2')) {
  //     this.showTooltip = false;
  //   }
  //   console.log("event",event)
  // }
  isHovering  = false;
  onMouseEnter(): void {
    this.isHovering = true;
    this.showTooltip = true;
  }

  onMouseLeave(event: MouseEvent): void {
    const tooltip = (event.relatedTarget as HTMLElement)?.closest('.tooltip-container');
    if (!tooltip) {
      this.isHovering = false;
      setTimeout(() => {
        if (!this.isHovering) {
          this.showTooltip = false;
        }
      }, 100); // Delay to handle quick transitions
    }
  }

  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const isInside = target.closest('.col-md-2') || target.closest('.tooltip-container');
    if (!isInside) {
      this.showTooltip = false;
    }
    console.log("event",event)
  }
  
}
