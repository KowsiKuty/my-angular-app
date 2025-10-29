import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { DtpcShareService } from '../dtpc-share.service';
import { Router } from '@angular/router'
import { DtpcService } from '../dtpc.service';
import { NgxSpinnerService } from "ngx-spinner";
import { from, Observable } from 'rxjs';
import { formatDate, DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
export interface ApplicationClass {
  id: number;
  ApplNo: string;
}
export interface BranchClass {
  id: number;
  BranchName: string;
  BranchCode: string;
}
@Component({
  selector: 'app-los-summary',
  templateUrl: './los-summary.component.html',
  styleUrls: ['./los-summary.component.scss']
})
export class LosSummaryComponent implements OnInit {
  vendorMasterList: any;
  applno: any;
  invoice_isEdit: any;
  losList: any;
  invoice_details_data: FormArray;
  pipe = new DatePipe('en-US');
  branchbank = 1;
  isLoading = false;
  Los_Sub_Menu_List: any;
  sub_module_url: any;
  is_los_summary: boolean;
  is_los_branch_summary: boolean;
  los_summary_data = []
  is_create_los: boolean;
  losSummaryForm: FormGroup;
  isLosSummaryPagination: boolean;
  branchpatch: any;
  pageSize = 10;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  branap: any;

  constructor(private sharedService: SharedService, private router: Router, private DtpcService: DtpcService,
    private fb: FormBuilder, private DtpcShareService: DtpcShareService, private SpinnerService: NgxSpinnerService) { }
  ngOnInit(): void {
    this.losSummaryForm = this.fb.group({
      branch: [''],
      application_no: ['']
    })
    let search_applno: String = "";
    let branch_name: string = "";
    let branch_code: string = "";
    this.Summaryapplication(search_applno);
    this.losSummaryForm.get('application_no').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.DtpcService.get_loanapp_dropdownLOS(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.applno = datas;
      })
    this.Summaryapplication("");
    this.Branchapplication(branch_name, branch_code);
    this.losSummaryForm.get('branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.DtpcService.get_branch_dropdown(value, value)
          // switchMap(value => this.DtpcService.get_branch_dropdown(value)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let res = results["data"];
        this.branap = res;
      })
    this.Branchapplication("", "");
    // this.Branchapplication("");
    let datas = this.sharedService.menuUrlData;
    // this.los_summary_data = []
    console.log(datas)
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "LOS") {
        this.Los_Sub_Menu_List = subModule;
        console.log("Los_Sub_Menu_List", this.Los_Sub_Menu_List)
      }
    });
    this.get_summary()
  }
  Summaryapplication(search_applno) {
    this.SpinnerService.show()
    this.DtpcService.get_loanapp_dropdownLOS(search_applno, 1)
      .subscribe((result) => {
        this.SpinnerService.hide()
        let applnovar = result['data'];
        this.applno = applnovar;
        console.log(this.applno)
      })
  }
  // Branchapplication(branch_name)
  Branchapplication(branch_name, branch_code) {
    this.SpinnerService.show()
    this.DtpcService.get_branch_dropdown(branch_name, branch_code)
      // this.DtpcService.get_branch_dropdown(branch_name)
      .subscribe((result) => {
        this.SpinnerService.hide()
        let loanapdr = result['data'];
        this.branap = loanapdr;
        console.log(this.branap)
      })
  }
  myclick(data) {
    // this.branchpatch=data.BranchName
    // this.losSummaryForm.patchValue({
    //   branch: this.branchpatch
    // })
  }
  public displayFn(ApplicationClass?: ApplicationClass): string | undefined {
    // this.validate_application_fun(ApplicationClass)
    return ApplicationClass ? ApplicationClass.ApplNo : undefined;
  }
  get ApplicationClass() {
    return this.losSummaryForm.get('application_no');
  }
  public displaybranch(BranchClass?: BranchClass): string | undefined {
    return BranchClass ? BranchClass.BranchName + BranchClass.BranchCode : undefined;
    // return BranchClass ?  BranchClass.BranchCode  : undefined;
  }
  get BranchClass() {
    return this.losSummaryForm.get('branch');
  }
  create_los() {
    // debugger;
    this.router.navigate(['/createLos'], { skipLocationChange: true })
  }
  get_summary(pageNumber = 1, pageSize = 10) {
    // debugger;
    this.los_summary_data = []
    this.SpinnerService.show()
    this.DtpcService.get_loan_summary(pageNumber, pageSize).subscribe((results) => {
      this.SpinnerService.hide();
      //let single_data={"data":results}
      console.log(results)
      this.los_summary_data = results['data']
      let dataPagination = results['pagination'];
      if (this.los_summary_data.length >= 0) {
        this.has_next = dataPagination.has_next;
        this.has_previous = dataPagination.has_previous;
        this.presentpage = dataPagination.index;
        this.isLosSummaryPagination = true;
      } if (this.los_summary_data.length <= 0) {
        this.isLosSummaryPagination = false;
      }
    }, error => {
      this.SpinnerService.hide();
      let errorMessage = error.statusText;
      console.log("Erorr" + errorMessage);
      return Observable.throw(error);
    });
  }
  nextClick() {
    this.currentpage = this.presentpage + 1
    this.get_summary(this.presentpage + 1, 10)
  }
  previousClick() {
    this.currentpage = this.presentpage - 1
    this.get_summary(this.presentpage - 1, 10)
  }
  search() {
    let searchappl = this.losSummaryForm.value.application_no.ApplNo;
    let searchbranch = this.losSummaryForm.value.branch.BranchName;
    let searchbranchcode = this.losSummaryForm.value.branch.BranchCode;
    if (searchappl === undefined) { searchappl = "" }
    if (searchbranch === undefined) { searchbranch = "" }
    if (searchbranchcode === undefined) { searchbranchcode = "" }
    console.log('before service', searchappl);
    this.DtpcService.getLOSsummarySearch(searchappl, searchbranch, searchbranchcode)
      .subscribe(result => {
        console.log(" after service", result)
        this.los_summary_data = result['data'];
        // return this.losList;
        if (searchappl.application_no === '') {
          this.get_summary();
        }
        return true
      })
  }
  reset() {
    this.losSummaryForm.controls["application_no"].reset("")
    this.losSummaryForm.controls["branch"].reset("")
    this.get_summary()
  }
  view_los_data(data) {
    // debugger;
    this.DtpcShareService.Los_Data.next(data)
    this.DtpcShareService.LosCurrentPage.next("")
    this.router.navigate(['/losviewdetails'], { skipLocationChange: false })
  }
}