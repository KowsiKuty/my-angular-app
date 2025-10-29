import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map, startWith } from 'rxjs/operators';
import { PprService } from '../ppr.service';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from 'src/app/service/notification.service';
import { E, I } from '@angular/cdk/keycodes';
import { element } from 'protractor';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { DatePipe, formatDate } from '@angular/common';
import { ErrorhandlingService } from '../errorhandling.service';

export interface displayfromat {
  id: number
  name: string
  sector:string
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
  selector: 'app-cost-allocation',
  templateUrl: './cost-allocation.component.html',
  styleUrls: ['./cost-allocation.component.scss'],
  providers: [{ provide: DateAdapter, useClass: PickDateAdapter },
  { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe]
})
export class CostAllocationComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('allocationfrom_auto') allocationfrom_auto: MatAutocomplete;
  @ViewChild('allocationfrom_Input') allocationfrom_Input: any;
  @ViewChild('allocation_from_auto') allocation_from_auto: MatAutocomplete;
  @ViewChild('allocation_from_Input') allocation_from_Input: any;
  @ViewChild('branch_auto') branch_auto: MatAutocomplete;
  @ViewChild('branch_Input') branch_Input: any;
  @ViewChild('bs_from_Auto') bs_from_Auto: MatAutocomplete;
  @ViewChild('bs_from_Input') bs_from_Input: any;
  @ViewChild('cc_from_Auto') cc_from_Auto: MatAutocomplete;
  @ViewChild('cc_form_Input') cc_form_Input: any;
  @ViewChild('level_auto') level_auto: MatAutocomplete;
  @ViewChild('level_input') level_input: any;
  @ViewChildren('to_branch_auto') to_branch_auto: MatAutocomplete;
  @ViewChildren('to_branch_Input') to_branch_Input: any;
  @ViewChildren('to_bscc_auto') to_bscc_auto: MatAutocomplete;
  @ViewChildren('to_bscc_Input') to_bscc_Input: any;
  @ViewChildren('to_bs_auto') to_bs_auto: MatAutocomplete;
  @ViewChildren('to_bs_input') to_bs_input: any;
  @ViewChildren('to_cc_auto') to_cc_auto: MatAutocomplete;
  @ViewChildren('to_cc_input') to_cc_input: any;
  @ViewChildren('to_parameter_auto') to_parameter_auto: MatAutocomplete;
  @ViewChildren('to_cc_input') to_parameter_input: any;
  cost_allocation: FormGroup;
  cost_allocationform:FormGroup;
  allocation_value:FormGroup;
  allocation_from: any;
  isLoading: boolean;
  has_nextval: boolean;
  has_previousval: boolean;
  currentpagenum: number;
  has_next: any;
  has_previous: any;
  presentpage: any;
  isSummaryPagination: boolean;
  costallocation_summary: any;
  identificationSize=10;
  currentpage: number;
  allocationfrom_value: string;
  summary_tag=false
  Allocation: any;
  branch_List: any;
  Bs_from: any;
  cc_from: any;
  level_List: any;
  to_branchList: any;
  to_BsccList: any;
  to_bsList: any;
  to_ccList: any;
  to_parameterList: any;
  add_or_edit: number;
  allocation_id: any;
  allocation_view:boolean=false;
  constructor(private datePipe:DatePipe,private toastr: ToastrService,private formBuilder: FormBuilder, private dataService: PprService, private SpinnerService: NgxSpinnerService, private Errorhandling: ErrorhandlingService,private notification:NotificationService) { }
  ngOnInit(): void {
    this.cost_allocation = this.formBuilder.group({
      allocation_from: [''],
      allocation_masterfilefrom:['']
    })
    this.cost_allocationform=this.formBuilder.group({
      allocation_from:[''],
      branch_from:[''],
      bs_from:[''],
      cc_from:[''],
      level_from:[''],
      validity_from:[''],
      validity_to:['']
    })
    this.allocation_value = this.formBuilder.group({
      allocation_new_row: new FormArray([
        this.allocation_row_add()
      ])
    })
    let allocationvalue=''
    this.cost_allocation_summary(allocationvalue)
  }
  allocation_row_add() {
    let new_row = new FormGroup({
      to_branch:new FormControl(''),
      to_bscc:new FormControl(''),
      to_cc: new FormControl(''),
      to_bs: new FormControl(''),
      to_parameter: new FormControl(''),
      to_input: new FormControl(''),
      to_ratio: new FormControl(''),
      to_amount: new FormControl(''),
      to_premium_amount:new FormControl(''),
    })
    return new_row
  }
  public display_allocationfrom(allocation_from?: displayfromat): string | undefined {
    return allocation_from ? allocation_from.name : undefined;
  }
 asset_Bscodesearch() {
    this.dataService.getbusinessdropdown(1, this.allocationfrom_Input.nativeElement.value, 1).pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),finalize(() => {
        this.isLoading = false
      })
      ).subscribe((results: any[]) => {
        let datas = results["data"];
        this.allocation_from = datas;
        console.log("main=>", this.allocation_from)
      })
  }
  allocationform_search() {
    let keyvalue: String = "";
    // this.asset_Bscodesearch(keyvalue);
    this.cost_allocation.get('allocation_from').valueChanges
      .pipe(

        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getbusinessdropdown(1, value, 1)
          .pipe(
            finalize(() => {
              // this.srachid=value.id
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.allocation_from = datas;
        console.log("value")
      })
  }
  allocationfromscroll() {
    console.log("scroll")
    this.has_nextval = true
    this.has_previousval = true
    this.currentpagenum = 1
    setTimeout(() => {
      if (
        this.allocationfrom_auto &&
        this.autocompleteTrigger &&
        this.allocationfrom_auto.panel
      ) {
        fromEvent(this.allocationfrom_auto.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.allocationfrom_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.allocationfrom_auto.panel.nativeElement.scrollTop;
            const scrollHeight = this.allocationfrom_auto.panel.nativeElement.scrollHeight;
            const elementHeight = this.allocationfrom_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              console.log(this.has_nextval)
              if (this.has_nextval === true) {
                console.log("true")
                this.dataService.getbusinessdropdown(1, this.allocationfrom_Input.nativeElement.value, this.currentpagenum + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.allocation_from = this.allocation_from.concat(datas);
                    if (this.allocation_from.length >= 0) {
                      this.has_nextval = datapagination.has_next;
                      this.has_previousval = datapagination.has_previous;
                      this.currentpagenum = datapagination.index;
                    }
                  })

              }

            }
          });
      }
    });
  }
  cost_allocation_summary(allocationvalue, pageNumber = 1, pageSize = 10) {
    console.log("allocationvalue=>",allocationvalue)
    
    if (this.cost_allocation.value.allocation_from == undefined || this.cost_allocation.value.allocation_from == null || this.cost_allocation.value.allocation_from == '') {
      this.allocationfrom_value = ''
    } else {
      this.allocationfrom_value = this.cost_allocation.value.allocation_from.id
    }
    this.SpinnerService.show()
    this.dataService.getcostallocationsummary(pageNumber, pageSize, this.allocationfrom_value)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["data"];
        let dataPagination = results['pagination'];
        this.costallocation_summary = datas;
        if (datas.length > 0) {
          console.log("val")
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
          this.isSummaryPagination = true;
        } if (datas.length <= 0) {
          this.toastr.warning("NO Data Found")
          this.has_next = false;
          this.has_previous = false;
          this.presentpage = 1;
          this.isSummaryPagination = false;
        }
      }, error => {
        this.Errorhandling.handleError(error);
        this.SpinnerService.hide();
      })
  }
  nextClick() {
    if (this.has_next === true) {
         
        this.currentpage = this.presentpage + 1
        this.cost_allocation_summary(this.allocationfrom_value,this.presentpage + 1, 10)
      }
   
    }
  
  previousClick() {
    if (this.has_previous === true) {
      
      this.currentpage = this.presentpage - 1
      this.cost_allocation_summary(this.allocationfrom_value,this.presentpage - 1, 10)
    }
  }
  cost_allocation_summary_clear(){
    this.cost_allocation.controls['allocation_from'].reset('')
    this.cost_allocation_summary("")
  }
  cost_allocation_Add(){
    this.summary_tag=true
    this.add_or_edit=1
    this.cost_allocation_summary_clear()
  }

  public displayallocation(allocation_from?: displayfromat): string | undefined {
    return allocation_from ? allocation_from.name : undefined;
  }
  allocation_search() {
    this.dataService.getbusinessdropdown(1, this.allocation_from_Input.nativeElement.value, 1).pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),finalize(() => {
        this.isLoading = false
      })).subscribe((results: any[]) => {
        let datas = results["data"];
        this.Allocation = datas;
      })
  }
  allocation_from_Dropdown() {
    let keyvalue: String = "";
    // this.allocation_search(keyvalue);
    this.cost_allocationform.get('allocation_from').valueChanges
      .pipe(

        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getbusinessdropdown(1, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Allocation = datas;
      })
  }
  allocation_from_scroll() {
    this.has_nextval = true
    this.has_previousval = true
    this.currentpagenum = 1
    setTimeout(() => {
      if (
        this.allocation_from_auto &&
        this.autocompleteTrigger &&
        this.allocation_from_auto.panel
      ) {
        fromEvent(this.allocation_from_auto.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.allocation_from_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.allocation_from_auto.panel.nativeElement.scrollTop;
            const scrollHeight = this.allocation_from_auto.panel.nativeElement.scrollHeight;
            const elementHeight = this.allocation_from_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              console.log(this.has_nextval)
              if (this.has_nextval === true) {
                console.log("true")
                this.dataService.getbusinessdropdown(1, this.allocation_from_Input.nativeElement.value, this.currentpagenum + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.Allocation = this.Allocation.concat(datas);
                    if (this.Allocation.length >= 0) {
                      this.has_nextval = datapagination.has_next;
                      this.has_previousval = datapagination.has_previous;
                      this.currentpagenum = datapagination.index;
                    }
                  })

              }

            }
          });
      }
    });
  }
  branchDropdown() {
    let prokeyvalue: String = "";
    // this.getbranch(prokeyvalue);
    this.cost_allocationform.get('branch_from').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getbranchdropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branch_List = datas;

      })
  }

  getbranch() {
    this.dataService.getbranchdropdown(this.branch_Input.nativeElement.value, 1).pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),finalize(() => {
        this.isLoading = false
      }),).subscribe((results: any[]) => {
        let datas = results["data"];
        this.branch_List = datas;
      })
  }
  branch_Scroll() {
    this.has_nextval = true
    this.has_previousval = true
    this.currentpagenum = 1
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
              if (this.has_nextval === true) {
                this.dataService.getbranchdropdown(this.branch_Input.nativeElement.value, this.currentpagenum + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branch_List = this.branch_List.concat(datas);
                    if (this.branch_List.length >= 0) {
                      this.has_nextval = datapagination.has_next;
                      this.has_previousval = datapagination.has_previous;
                      this.currentpagenum = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  public displayfnbranch(branch?: displayfromat): string | undefined {
    return branch ? branch.name : undefined;
  }

  bs_Dropdown(){
    let keyvalue: String = "";
    // this.get_Bs(keyvalue);
    this.cost_allocationform.get('bs_from').valueChanges
      .pipe(
        
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.get_bs_dropdown(1,value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Bs_from = datas;
        console.log("value")
        
      })
  }
  get_Bs() {
    this.dataService.get_bs_dropdown(1,this.bs_from_Input.nativeElement.value,1).pipe(
        
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),finalize(() => {
        this.isLoading = false
      })).subscribe((results: any[]) => {
        let datas = results["data"];
        this.Bs_from = datas;
      })
  }
  display_bs_from(BSName:displayfromat): string | undefined{
    return BSName ? BSName.name : undefined;
  }
  bs_from_scroll(){
     this.has_nextval = true
     this.has_previousval = true
     this.currentpagenum = 1
      console.log("scroll")
      setTimeout(() => {
        if (
          this.bs_from_Auto &&
          this.autocompleteTrigger &&
          this.bs_from_Auto.panel
        ) {
          fromEvent(this.bs_from_Auto.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.bs_from_Auto.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.bs_from_Auto.panel.nativeElement.scrollTop;
              const scrollHeight = this.bs_from_Auto.panel.nativeElement.scrollHeight;
              const elementHeight = this.bs_from_Auto.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_nextval === true) {
                  console.log("true")
                  this.dataService.get_bs_dropdown(1,this.bs_from_Input.nativeElement.value, this.currentpagenum+1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      console.log("loop",this.currentpagenum)
                      this.Bs_from = this.Bs_from.concat(datas);
                      if (this.Bs_from.length >= 0) {
                        this.has_nextval = datapagination.has_next;
                        this.has_previousval = datapagination.has_previous;
                        this.currentpagenum = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
  }

  cc_Dropdown(){
    let keyvalue: String = "";
    // this.get_cc(keyvalue);
    this.cost_allocationform.get('cc_from').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.get_cc_dropdown(1,value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cc_from = datas;
        console.log("value")
        
      })
  }
  get_cc() {
    this.dataService.get_cc_dropdown(1,this.cc_form_Input.nativeElement.value,1) .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),finalize(() => {
        this.isLoading = false
      }),
    )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cc_from = datas;
        
        console.log("main=>",this.cc_from)
      })
  }
  display_cc_from(ccname:displayfromat):string |undefined{
    return ccname?ccname.name :undefined
  }
  ccfromscroll(){
    this.has_nextval = true
    this.has_previousval = true
    this.currentpagenum = 1
     console.log("scroll")
     setTimeout(() => {
       if (
         this.cc_from_Auto &&
         this.autocompleteTrigger &&
         this.cc_from_Auto.panel
       ) {
         fromEvent(this.cc_from_Auto.panel.nativeElement, 'scroll')
           .pipe(
             map(x => this.cc_from_Auto.panel.nativeElement.scrollTop),
             takeUntil(this.autocompleteTrigger.panelClosingActions)
           )
           .subscribe(x => {
             const scrollTop = this.cc_from_Auto.panel.nativeElement.scrollTop;
             const scrollHeight = this.cc_from_Auto.panel.nativeElement.scrollHeight;
             const elementHeight = this.cc_from_Auto.panel.nativeElement.clientHeight;
             const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
             if (atBottom) {
               if (this.has_nextval === true) {
                 console.log("true")
                 this.dataService.get_cc_dropdown(1,this.cc_form_Input.nativeElement.value, this.currentpagenum+1)
                   .subscribe((results: any[]) => {
                     let datas = results["data"];
                     let datapagination = results["pagination"];
                     console.log("loop",this.currentpagenum)
                     this.cc_from = this.cc_from.concat(datas);
                     if (this.cc_from.length >= 0) {
                       this.has_nextval = datapagination.has_next;
                       this.has_previousval = datapagination.has_previous;
                       this.currentpagenum = datapagination.index;
                     }
                   })
               }
             }
           });
       }
     });
  }
  level_dropdown() {
    let prokeyvalue: String = "";
    this.getlevel(prokeyvalue);
    this.cost_allocationform.get('level_from').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getallocationleveldropdown(value, 1)
          .pipe(
            finalize(() => {
              console.log(value)
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.level_List = datas;     
      })
  }

  private getlevel(prokeyvalue) {
    this.dataService.getallocationleveldropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.level_List = datas;
      })
  }

  public level_display(Allocation_level?: displayfromat): string | undefined {
    return Allocation_level ? Allocation_level.name : undefined;

  }
  level_scroll(){
    this.has_nextval =true
    this.has_previousval =true
    this.currentpagenum =1
    console.log("scroll")
    setTimeout(() => {
      if (
        this.level_auto &&
        this.autocompleteTrigger &&
        this.level_auto.panel
      ) {
        fromEvent(this.level_auto.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.level_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.level_auto.panel.nativeElement.scrollTop;
            const scrollHeight = this.level_auto.panel.nativeElement.scrollHeight;
            const elementHeight = this.level_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextval === true) {
                console.log("true")
                this.dataService.getallocationleveldropdown(this.level_input.nativeElement.value, this.currentpagenum+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    console.log("loop",this.currentpagenum)
                    this.level_List = this.level_List.concat(datas);
                    if (this.level_List.length >= 0) {
                      this.has_nextval = datapagination.has_next;
                      this.has_previousval = datapagination.has_previous;
                      this.currentpagenum = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  validityto_clear(){
    console.log(this.cost_allocationform)
    this.cost_allocationform.controls['validity_to'].reset('')
  }

  to_Branch_Dropdown(ind) {
    let prokeyvalue: String = "";
    // this.get_branch(prokeyvalue);
    console.log(this.allocation_value)
    var arrayControl = this.allocation_value.get('allocation_new_row') as FormArray;
    console.log(arrayControl)
    let item = arrayControl.at(ind);
    console.log(item)
    item.get('to_branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getbranchdropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.to_branchList = datas;
      })
  }
  
  get_branch(ind) {
    this.dataService.getbranchdropdown(this.to_branch_Input['_results'][ind].nativeElement.value, 1).pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),finalize(() => {
        this.isLoading = false
      }),
      ).subscribe((results: any[]) => {
        let datas = results["data"];
        this.to_branchList = datas;
  
      })
  }
  
  to_branch_Scroll(ind) {
    this.has_nextval = true
    this.has_previousval = true
    this.currentpagenum = 1
    setTimeout(() => {
      if (
        this.to_branch_auto &&
        this.autocompleteTrigger &&
        this.to_branch_auto['_results'][ind].panel
      ) {
        fromEvent(this.to_branch_auto['_results'][ind].panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.to_branch_auto['_results'][ind].panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.to_branch_auto['_results'][ind].panel.nativeElement.scrollTop;
            const scrollHeight = this.to_branch_auto['_results'][ind].panel.nativeElement.scrollHeight;
            const elementHeight = this.to_branch_auto['_results'][ind].panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextval === true) {
                this.dataService.getbranchdropdown(this.to_branch_Input['_results'][ind].nativeElement.value, this.currentpagenum+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    console.log("loop",this.currentpagenum)
                    
                      this.to_branchList=this.to_branchList.concat(datas);
                      if (this.to_branchList.length >= 0) {
                        this.has_nextval = datapagination.has_next;
                        this.has_previousval = datapagination.has_previous;
                        this.currentpagenum = datapagination.index;
                      }
                  })
              }
            }
          });
      }
    });
 
  }
  
  public displayfn_branch(branch?: displayfromat): string | undefined {
    return branch ? branch.name : undefined;
  
  }

  public display_to_bscc(bsccocde_level?: displayfromat): string | undefined {
    return bsccocde_level ? bsccocde_level.name : undefined;
  }
  
  to_Bscc_Dropdown(i) {
    console.log(i)
   let keyvalue: String = "";
    // this.get_Bscc(keyvalue);
    var arrayControl = this.allocation_value.get('allocation_new_row') as FormArray;
    let item = arrayControl.at(i);
    item.get("to_bscc").valueChanges

      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getbusinessdropdown(1, value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.to_BsccList = datas;
      })
  }
  get_Bscc(ind) {
    this.dataService.getbusinessdropdown(1,this.to_bscc_Input['_results'][ind].nativeElement.value,1).pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),finalize(() => {
        this.isLoading = false
      }),
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.to_BsccList = datas;
        console.log("out")
      })
  }
  to_bscc_scroll(ind) {
    this.has_nextval = true
    this.has_previousval = true
    this.currentpagenum = 1
    setTimeout(() => {
      if (
        this.to_bscc_auto &&
        this.autocompleteTrigger &&
        this.to_bscc_auto['_results'][ind].panel
      ) {
        fromEvent(this.to_bscc_auto['_results'][ind].panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.to_bscc_auto['_results'][ind].panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.to_bscc_auto['_results'][ind].panel.nativeElement.scrollTop;
            const scrollHeight = this.to_bscc_auto['_results'][ind].panel.nativeElement.scrollHeight;
            const elementHeight = this.to_bscc_auto['_results'][ind].panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextval === true) {
                this.dataService.getbusinessdropdown(1,this.to_bscc_Input['_results'][ind].nativeElement.value, this.currentpagenum+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                      this.to_BsccList=this.to_BsccList.concat(datas);
                      if (this.to_BsccList.length >= 0) {
                        this.has_nextval = datapagination.has_next;
                        this.has_previousval = datapagination.has_previous;
                        this.currentpagenum = datapagination.index;
                      }
                  })
              }
            }
          });
      }
    });
  
  }
  public display_to_bs(bsccocde_level?: displayfromat): string | undefined {
    return bsccocde_level ? bsccocde_level.name : undefined;
  }

  getbsDropdown(ind) {

    this.dataService.get_bs_dropdown(1,this.to_bs_input['_results'][ind].nativeElement.value, 1).pipe(
        
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),finalize(() => {
        this.isLoading = false
      }),
      ).subscribe((results: any[]) => {
        let datas = results["data"];
        this.to_bsList = datas;
      })
  }
  to_bs_Dropdown(i) {
    let keyvalue: String = "";
    var arrayControl = this.allocation_value.get('allocation_new_row') as FormArray;
    let item = arrayControl.at(i);
    // this.getbsDropdown(keyvalue);
    item.get("to_bs").valueChanges
      .pipe(
        
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),

        switchMap(value => this.dataService.get_bs_dropdown(1, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.to_bsList = datas;
      })
  }
  to_bs_Scroll(ind) {
    this.has_nextval = true
    this.has_previousval = true
    this.currentpagenum = 1
    setTimeout(() => {
      if (
        this.to_bs_auto &&
        this.autocompleteTrigger &&
        this.to_bs_auto['_results'][ind].panel
      ) {
        fromEvent(this.to_bs_auto['_results'][ind].panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.to_bs_auto['_results'][ind].panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.to_bs_auto['_results'][ind].panel.nativeElement.scrollTop;
            const scrollHeight = this.to_bs_auto['_results'][ind].panel.nativeElement.scrollHeight;
            const elementHeight = this.to_bs_auto['_results'][ind].panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextval === true) {
                this.dataService.get_bs_dropdown(1,this.to_bs_input['_results'][ind].nativeElement.value, this.currentpagenum+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                      this.to_bsList=this.to_bsList.concat(datas);
                      if (this.to_bsList.length >= 0) {
                        this.has_nextval = datapagination.has_next;
                        this.has_previousval = datapagination.has_previous;
                        this.currentpagenum = datapagination.index;
                      }
                  })
              }
            }
          });
      }
    });
  
  }

  getasset_cccode(ind) {
    this.dataService.get_cc_dropdown(1, this.to_cc_input['_results'][ind].nativeElement.value, 1).pipe(
       
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),finalize(() => {
        this.isLoading = false
      }),
      ).subscribe((results: any[]) => {
        let datas = results["data"];
        this.to_ccList = datas;

      })
  }
  public display_to_cc(cc_name?: displayfromat): string | undefined {
    return cc_name ? cc_name.name : undefined;
  }
  to_cc_Dropdown(i) {
    let keyvalue: String = "";
    // this.getasset_cccode(keyvalue);
    var arrayControl = this.allocation_value.get('allocation_new_row') as FormArray;
    let item = arrayControl.at(i);
    item.get("to_cc").valueChanges
      .pipe(
       
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),

        switchMap(value => this.dataService.get_cc_dropdown(1, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.to_ccList = datas;

      })

  }
  cc_Scroll(ind) {
    this.has_nextval = true
    this.has_previousval = true
    this.currentpagenum = 1
    setTimeout(() => {
      if (
        this.to_cc_auto &&
        this.autocompleteTrigger &&
        this.to_cc_auto['_results'][ind].panel
      ) {
        fromEvent(this.to_cc_auto['_results'][ind].panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.to_cc_auto['_results'][ind].panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.to_cc_auto['_results'][ind].panel.nativeElement.scrollTop;
            const scrollHeight = this.to_cc_auto['_results'][ind].panel.nativeElement.scrollHeight;
            const elementHeight = this.to_cc_auto['_results'][ind].panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextval === true) {
                this.dataService.get_cc_dropdown(1,this.to_cc_input['_results'][ind].nativeElement.value, this.currentpagenum+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                      this.to_ccList=this.to_ccList.concat(datas);
                      if (this.to_ccList.length >= 0) {
                        this.has_nextval = datapagination.has_next;
                        this.has_previousval = datapagination.has_previous;
                        this.currentpagenum = datapagination.index;
                      }
                  })
              }
            }
          });
      }
    });
  
  }
  public display_to_param(CostDriver?: displayfromat): string | undefined {
    return CostDriver ? CostDriver.sector : undefined;
  }
  getParameter(ind) {

    this.dataService.getcostdriverdropdown(this.to_parameter_input['_results'][ind].nativeElement.value, 1) .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),finalize(() => {
        this.isLoading = false
      }),
    )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.to_parameterList = datas;
        console.log(this.to_parameterList)

      })
  }
  to_Parameter_Dropdown(i) {
    let prokeyvalue: String = "";
    // this.getParameter(prokeyvalue);
    var arrayControl = this.allocation_value.get('allocation_new_row') as FormArray;
    let item = arrayControl.at(i);
    item.get("to_parameter").valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getcostdriverdropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.to_parameterList = datas;

      })
  }
  to_param_scroll(ind) {
    this.has_nextval = true
    this.has_previousval = true
    this.currentpagenum = 1
    setTimeout(() => {
      if (
        this.to_parameter_auto &&
        this.autocompleteTrigger &&
        this.to_parameter_auto['_results'][ind].panel
      ) {
        fromEvent(this.to_parameter_auto['_results'][ind].panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.to_parameter_auto['_results'][ind].panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.to_parameter_auto['_results'][ind].panel.nativeElement.scrollTop;
            const scrollHeight = this.to_parameter_auto['_results'][ind].panel.nativeElement.scrollHeight;
            const elementHeight = this.to_parameter_auto['_results'][ind].panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextval === true) {
                this.dataService.getcostdriverdropdown(this.to_parameter_input['_results'][ind].nativeElement.value, this.currentpagenum+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                      this.to_parameterList=this.to_parameterList.concat(datas);
                      if (this.to_parameterList.length >= 0) {
                        this.has_nextval = datapagination.has_next;
                        this.has_previousval = datapagination.has_previous;
                        this.currentpagenum = datapagination.index;
                      }
                  })
              }
            }
          });
      }
    });
  
  }
  newrowadd(){
    const form = <FormArray> this.allocation_value.get('allocation_new_row')
    // form.insert(0,this.allocation_row_add())
    form.push(this.allocation_row_add())
  }
  deleteRow(x) {
    var delBtn = confirm(" Do you want to delete ?");
    if (delBtn == true) {
      this.allocation_value.controls.allocation_new_row['controls'].splice(x, 1);
      // newvalue.splice(x,1)
    }
  }
  back_to_summary(){
    this.cost_allocation_summary_clear()
    this.cost_allocationform.controls['allocation_from'].reset('');
    this.cost_allocationform.controls['branch_from'].reset('');
    this.cost_allocationform.controls['bs_from'].reset('');
    this.cost_allocationform.controls['cc_from'].reset('');
    this.cost_allocationform.controls['level_from'].reset('');
    this.cost_allocationform.controls['validity_from'].reset('');
    this.cost_allocationform.controls['validity_to'].reset('');
    let allocation_arr= (this.allocation_value.controls['allocation_new_row'] as FormArray)
    allocation_arr.reset();
    // const control = <FormArray>this.newrowadd.controls['rows_value'];
    for(let i = allocation_arr.length-1; i >= 1; i--) {
      allocation_arr.removeAt(i)
    }
    this.summary_tag = false
    let allocationvalue=''
    this.cost_allocation_summary(allocationvalue)
  }
  editview_allocation(id,cost_obj) {
    
    this.add_or_edit=2
    this.summary_tag = true
    this.allocation_id=id
    this.getparticularallocationcost(this.allocation_id)   
  }
  private getparticularallocationcost(allocationid) {
    this.SpinnerService.show()
    this.dataService.particularallocation(allocationid)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let display_data=results['to_data']
        let data=new FormArray([])

        display_data.forEach(element => {
          data.push(this.formBuilder.group({
          id:element.id,
          to_branch:element['branch_data'],
          to_bscc: element['bscc_data'],
          to_bs:element['bs_data'],
          to_cc:element['cc_data'],
          to_parameter:element['parameter'],
          to_premium_amount:element['premium_amount'],
          to_input:element['input_value'],
          to_ratio:Number(element['ratio']).toFixed(2),
          to_amount:element['to_amount'],
          }))
          return data;
        });
        this.allocation_value.setControl('allocation_new_row',data)
        this.cost_allocationform.patchValue({
          bs_from:results['bs_data'],
          cc_from:results['cc_data'],
          allocation_from:results['bscc_data'],
          branch_from:results['branch_data'],
          level_from:results['level_data'],
          validity_from:results['validity_from'],
          validity_to:results['validity_to'],
        })
      },error => {
        this.Errorhandling.handleError(error);
        this.SpinnerService.hide();
      })
  }
  status(id){
    console.log(id)
    let dataConfirm = confirm("Are you sure,You Are Change The Status?")
    if (dataConfirm == false) {
      return false;
    }
    this.SpinnerService.show()
    this.dataService.getStatus(id).subscribe((results: any[]) => {
      this.SpinnerService.hide()
      let allocationvalue=''
      this.cost_allocation_summary(allocationvalue)
      console.log("result=>",results)
    },error => {
      this.Errorhandling.handleError(error);
      this.SpinnerService.hide();
    })
  }
  Allocation_data(){
    let newvalue=[]
    console.log(this.allocation_value.controls.allocation_new_row.value)
      var maxratio=0

    for(var calc of this.allocation_value.controls.allocation_new_row.value ){
      console.log("calc=>",calc)
      maxratio+=(Number(calc.to_ratio))
    }
    if(this.cost_allocationform.value.validity_from=='' || this.cost_allocationform.value.validity_from==null || this.cost_allocationform.value.validity_from==undefined){
      this.toastr.warning('', 'Please Select Form Date', { timeOut: 1500 });
      return false;

    }
    if(this.cost_allocationform.value.validity_to=='' || this.cost_allocationform.value.validity_to==null || this.cost_allocationform.value.validity_to==undefined){
      this.toastr.warning('', 'Please Select To Date', { timeOut: 1500 });
      return false;

    }
    if(Number(maxratio)!=100){
      console.log("max",maxratio)
      this.toastr.error("Ratio Value Should Be 100 Percentage");
      return false;
    }
    
    console.log("validity_from=>",this.cost_allocationform.value.validity_from)
    var fromdate=this.cost_allocationform.value.validity_from
    let validityfrom=this.datePipe.transform(fromdate, 'yyyy-MM-dd')
    var todate=this.cost_allocationform.value.validity_to
    let validityto=this.datePipe.transform(todate, 'yyyy-MM-dd')

    // console.log("formatdate=>",formatdate)
    console.log("maxratio=>",maxratio)
    for(let val of this.allocation_value.controls.allocation_new_row['controls']){
      console.log("todata_id=>",val.id)
      let id=""
      id=val.value.id
      console.log("id=>",id)
      
      if(val.value.to_bscc=='' || val.value.to_bscc==null || val.value.to_bscc==undefined){
        val.value.tobscc=''
      }else{
        val.value.tobscc=val.value.to_bscc.id
      }
      if(val.value.to_branch=='' || val.value.to_branch==null || val.value.to_branch==undefined){
        val.value.tobranch=''
      }else{
        val.value.tobranch=val.value.to_branch.id
      }
      if(val.value.to_cc=="" || val.value.to_cc==null || val.value.to_cc==undefined){
        val.value.tocc=""
      }else{
        val.value.tocc=val.value.to_cc.id
      }
      if(val.value.to_bs=="" || val.value.to_bs==undefined || val.value.to_bs==null){
        val.value.tobs=""
      }else{
        val.value.tobs=val.value.to_bs.id
      }
      if(val.value.to_parameter==''|| val.value.to_parameter==null || val.value.to_parameter==undefined){
        val.value.toparameter=""
      }else{
        val.value.toparameter=val.value.to_parameter.sector
      }
      if(val.value.to_input=="" || val.value.to_input==undefined || val.value.to_input==null){
        val.value.toinput=""
      }else{
        val.value.toinput=val.value.to_input
      }
      if(val.value.to_ratio=="" || val.value.to_ratio==undefined || val.value.to_ratio==null){
        val.value.toratio=""
      }else{
        val.value.toratio=val.value.to_ratio
      }
      if(val.value.to_amount =="" || val.value.to_amount==null || val.value.to_amount==undefined){
        val.value.toamount=""
      }else{
        val.value.toamount=val.value.to_amount
      }
      if(val.value.to_premium_amount=="" || val.value.to_premium_amount==null || val.value.to_premium_amount==undefined){
        val.value.topremiumamount=""
      }else{
        val.value.topremiumamount=val.value.to_premium_amount
      }
      if(this.add_or_edit == 2){
        newvalue.push({
          "id":id,
          "cat_id":'',
          "subcat_id":'',
          "bscc_code": val.value.tobscc,
          "cc_id": val.value.tocc,
          "bs_id": val.value.tobs,
          "parameter": val.value.toparameter,
          "input_value": val.value.toinput,
          "ratio": val.value.toratio,
          "to_amount": val.value.toamount,
          "premium_amount":val.value.topremiumamount,
          "branch_id":val.value.tobranch
        })
        console.log("if edit=>",newvalue)
      
      }else{
        newvalue.push({
          "cat_id":'',
          "subcat_id":'',
          "bscc_code": val.value.tobscc,
          "cc_id": val.value.tocc,
          "bs_id": val.value.tobs,
          "parameter": val.value.toparameter,
          "input_value": val.value.toinput,
          "ratio": val.value.toratio,
          "to_amount": val.value.toamount,
          "premium_amount":val.value.topremiumamount,
          "branch_id":val.value.tobranch     
      });
      console.log("else",newvalue)
    }      
     }
     for (var ind in newvalue) {
       console.log(ind)
       console.log("newvalue[ind]=>",newvalue[ind])
       console.log("newvalue[ind].id=>",newvalue[ind].id)
      if (newvalue[ind].id == null || newvalue[ind].id == undefined || newvalue[ind].id == '') {
        delete newvalue[ind].id;
      }
    }
    console.log("finally=>",newvalue)
  //  var amount=this.cost_allocationform.value.allocationfrom_ratio
  //  console.log("amount=>",amount)
   console.log("cost_allocationform=>", this.cost_allocationform.value)
   if(this.cost_allocationform.value.level_from=="" || this.cost_allocationform.value.level_from==null || this.cost_allocationform.value.level_from==undefined){
    this.cost_allocationform.value.levelfrom=''
   }else{
    this.cost_allocationform.value.levelfrom=this.cost_allocationform.value.level_from
   }
   if(this.cost_allocationform.value.allocation_from=="" || this.cost_allocationform.value.allocation_from==null || this.cost_allocationform.value.allocation_from==undefined){
    this.cost_allocationform.value.allocationfrom=''
   }else{
    this.cost_allocationform.value.allocationfrom=this.cost_allocationform.value.allocation_from.id
   }
   if(this.cost_allocationform.value.branch_from=="" || this.cost_allocationform.value.branch_from==null || this.cost_allocationform.value.branch_from==undefined){
    this.cost_allocationform.value.branchfrom=''
   }else{
    this.cost_allocationform.value.branchfrom=this.cost_allocationform.value.branch_from.id
   }
   if(this.cost_allocationform.value.bs_from=="" || this.cost_allocationform.value.bs_from==null || this.cost_allocationform.value.bs_from==undefined){
    this.cost_allocationform.value.bsfrom=''
   }else{
    this.cost_allocationform.value.bsfrom=this.cost_allocationform.value.bs_from.id
   }
   if(this.cost_allocationform.value.cc_from=="" || this.cost_allocationform.value.cc_from==null || this.cost_allocationform.value.cc_from==undefined){
    this.cost_allocationform.value.ccfrom=''
   }else{
    this.cost_allocationform.value.ccfrom=this.cost_allocationform.value.cc_from.id
   }
  let changeValue
  if(this.add_or_edit==2){
    changeValue = {
      // "frombscccode": this.cost_allocationform.value.allocationbsfilter,
      "bscc_code": this.cost_allocationform.value.allocationfrom,
      "branch_id":this.cost_allocationform.value.branchfrom,
      "cc_id": this.cost_allocationform.value.ccfrom,
      "bs_id": this.cost_allocationform.value.bsfrom,
      "validity_from":validityfrom,
      "validity_to":validityto,
      "level": this.cost_allocationform.value.levelfrom,
      "to_data":newvalue,
      "cat_id":'',
      "subcat_id":'',
      "id":this.allocation_id
      }
  }else{
    changeValue = {
      // "frombscccode": this.cost_allocationform.value.allocationbsfilter,
      "bscc_code": this.cost_allocationform.value.allocationfrom,
      "branch_id":this.cost_allocationform.value.branchfrom,
      "cc_id": this.cost_allocationform.value.ccfrom,
      "bs_id": this.cost_allocationform.value.bsfrom,
      "validity_from":validityfrom,
      "validity_to":validityto,
      "level": this.cost_allocationform.value.levelfrom,
      "to_data":newvalue,
      "cat_id":'',
      "subcat_id":'',
    }
  }
 
    console.log("changeValue=>",changeValue)
    this.SpinnerService.show()
    this.dataService.set_allocationratio(changeValue).subscribe(res => {
    this.SpinnerService.hide()
    this.notification.showSuccess("Successfully Updated!...")
    this.back_to_summary()
    },error => {
      newvalue=[]

      this.Errorhandling.handleError(error);
      this.SpinnerService.hide();
    })
    // this.getcostallocationsummary()
  }
  view_allocation(id) {
    
    this.add_or_edit=3
    this.summary_tag = true
    this.allocation_id=id
    this.getparticularallocationcost(this.allocation_id) 
  }
  filevarible
  Fileupload_master(fileobj){
    
    this.filevarible=fileobj.target.files[0]
  }
  cost_allocation_fileupload(){
    if (this.filevarible=='' || this.filevarible==undefined || this.filevarible==null){
      this.toastr.warning('','Please Select File',{timeOut:1500})
      return false
    }
    this.SpinnerService.show()
    this.dataService.allocationmaster_upload(this.filevarible)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        this.toastr.success('','Success',{timeOut:1500})
        this.cost_allocation.controls.allocation_masterfilefrom.reset('')
        this.filevarible=''
      },error=>{this.SpinnerService.hide()})
  }
  back_allocation(change){
    this.allocation_view=change;
  }
}
