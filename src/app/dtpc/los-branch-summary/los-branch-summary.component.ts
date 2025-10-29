import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DtpcShareService } from '../dtpc-share.service';
import { Router } from '@angular/router'
import { DtpcService } from '../dtpc.service';
import { NgxSpinnerService } from "ngx-spinner";
import { from, Observable } from 'rxjs';
import { formatDate, DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
export interface BranchApplicationClass {
  id: number;
  ApplNo: string;
}
@Component({
  selector: 'app-los-branch-summary',
  templateUrl: './los-branch-summary.component.html',
  styleUrls: ['./los-branch-summary.component.scss']
})
export class LosBranchSummaryComponent implements OnInit {
  bapplno: any;
  pipe = new DatePipe('en-US');
  isLoading = false;
  los_branchsummary_data = []
  is_create_los: boolean;
  losBranchSummaryForm: FormGroup;
  isLosBranchSummaryPagination: boolean;
  branchpatch:any;
  BranchsummarypageSize = 10;
  Branchsummaryhas_next = true;
  Branchsummaryhas_previous = true;
  Branchcurrentpage: number = 1;
  Branchpresentpage: number = 1;
  constructor(private sharedService: SharedService, private router: Router, private DtpcService: DtpcService,
    private fb: FormBuilder, private DtpcShareService: DtpcShareService, private SpinnerService: NgxSpinnerService) { }
  ngOnInit(): void {
    this.losBranchSummaryForm = this.fb.group({
      branch: [''],
      application_no: ['']
    })
    this.get_branchsummary()
    let search_Summarybranch_appno: String = "";
    this.Summarybranchapplication(search_Summarybranch_appno);
      this.losBranchSummaryForm.get('application_no').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.DtpcService.get_loanapp_branchdropdown(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let bdatas = results["data"];
      this.bapplno = bdatas;
    })
    this.Summarybranchapplication("");
  }
  Summarybranchapplication(search_Summarybranch_appno) {
    this.SpinnerService.show()
    this.DtpcService.get_loanapp_branchdropdown(search_Summarybranch_appno,1)
      .subscribe((result) => {
        this.SpinnerService.hide()
        let Branchapplnoresult = result['data'];
        this.bapplno = Branchapplnoresult;
        console.log(this.bapplno)
      })
  }
  // myclick(data){
  //   // let searchlos = this.losSummaryForm.value.application_no.BApplNo;
  //   // this.branap=data.value
  //   this.branchpatch=data.BranchName
  //   this.losBranchSummaryForm.patchValue({
  //     branch: this.branchpatch
  //   })
  // }
  public branchdisplayFn(BranchApplicationClass?: BranchApplicationClass): string | undefined {
    return BranchApplicationClass ? BranchApplicationClass.ApplNo : undefined;
  }
  get BranchApplicationClass() {
    return this.losBranchSummaryForm.get('application_no');
  }
  branchnextClick() {
    this.Branchcurrentpage = this.Branchpresentpage + 1
    this.get_branchsummary(this.Branchpresentpage + 1, 10)
  }
  branchpreviousClick() {
    this.Branchcurrentpage = this.Branchpresentpage - 1
    this.get_branchsummary(this.Branchpresentpage - 1, 10)
  }
  view_branchlos_data(data) {
    // debugger;
    this.DtpcShareService.Los_Data.next(data)
    this.DtpcShareService.LosCurrentPage.next("")
    this.router.navigate(['/losviewdetails'], { skipLocationChange: false })
  }
  get_branchsummary(branchpageNumber = 1, BranchsummarypageSize = 10) {
    // debugger;
    this.los_branchsummary_data = [];
    this.SpinnerService.show()
    this.DtpcService.get_Branch_loan_summary(branchpageNumber, BranchsummarypageSize).subscribe((results) => {
      this.SpinnerService.hide();
      //let single_data={"data":results}
      console.log(results)
      this.los_branchsummary_data = results['data']
      let branchdataPagination = results['pagination'];
      if (this.los_branchsummary_data.length >= 0) {
        this.Branchsummaryhas_next = branchdataPagination.has_next;
        this.Branchsummaryhas_previous = branchdataPagination.has_previous;
        this.Branchpresentpage = branchdataPagination.index;
        this.isLosBranchSummaryPagination = true;
      } if (this.los_branchsummary_data.length <= 0) {
        this.isLosBranchSummaryPagination = false;
      }
    }, error => {
      this.SpinnerService.hide();
      let errorMessage = error.statusText;
      console.log("Erorr" + errorMessage);
      return Observable.throw(error);
    });
  }
  branchsearch_data(){
    let search = this.losBranchSummaryForm.value.application_no.ApplNo;
    console.log('before service', search);
    this.DtpcService.getLOSbranchsummarySearch(search)
      .subscribe(result => {
        console.log(" after service", result)
        this.los_branchsummary_data = result['data'];
        // return this.losList;
        if (search.application_no === '') {
          this.get_branchsummary();
        }
        return true
      })
  }
  branchremove(){
    this.losBranchSummaryForm.controls["application_no"].reset("")
    this.losBranchSummaryForm.controls["branch"].reset("")
    this.get_branchsummary()
  }
}