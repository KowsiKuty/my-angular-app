import { Component, EventEmitter, OnInit, Output, LOCALE_ID, Inject, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/service/data.service';
import { MemoService } from 'src/app/ememo/memo.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/service/shared.service';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';

export interface pincode {
  full_name: string;
  id: number;
}
export interface assigncode {
  full_name: string;
  id: number;
}
export interface searchcode {
  full_name: string;
  id: number;
}
export interface searchassigncode {
  full_name: string;
  id: number;
}

@Component({
  selector: 'app-viewrightscreate',
  templateUrl: './viewrightscreate.component.html',
  styleUrls: ['./viewrightscreate.component.scss']
})
export class ViewrightscreateComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  isLoading: boolean;
  constructor(private fb: FormBuilder, private SpinnerService: NgxSpinnerService, private toastr: ToastrService, private memoService: MemoService, public sharedService: SharedService, @Inject(LOCALE_ID) public locale: string,) { }
 remarks: FormGroup;
 Viewrights: FormGroup;
 Searchform: FormGroup;
 employee_id:any;
 assignee_id:any;
 employelist:any;
 Searchemployelist:any;
 assignedlist:any;
 assignedsearchlist:any;
 currentpage:number=1;
 has_next:boolean = true;
 has_previous:boolean = true;
 searchcurrentpage:number=1;
 searchhas_next:boolean = true;
 searchhas_previous:boolean = true;
 asscurrentpage:number=1;
 asssearchcurrentpage:number=1;
 asssummarypage:number=1;
 asshas_next:boolean = true;
 asssearchhas_next:boolean = true;
 asssummaryhas_next:boolean = true;
 asshas_previous:boolean = true;
 asssearchhas_previous:boolean = true;
 asssummaryhas_previous:boolean = true;
 summaryassignedlist:any=[];
 pageSize = 10;
 searchempids:any;
 searchassignids:any;
 
 @ViewChild('pintype') matpincodeAutocomplete: MatAutocomplete;
 @ViewChild('pinCodeInput') pinCodeInput: any;

 @ViewChild('pintypesearch') matpincodesearchAutocomplete: MatAutocomplete;
 @ViewChild('pinCodesearchInput') pinCodesearchInput: any;

 @ViewChild('assigntype') matassignAutocomplete: MatAutocomplete;
 @ViewChild('assigninput') assigninput: any;

 @ViewChild('assignsearchtype') matassignsearchAutocomplete: MatAutocomplete;
 @ViewChild('assignsearchinput') assignsearchinput: any;

 @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  ngOnInit(): void {
    this.remarks = this.fb.group({
      remarks: ''
    })
    this.Viewrights = this.fb.group({
     employee_id: '',
     assigned_to:''
    })
    this.Searchform = this.fb.group({
     employee_id: '',
     assigned_to:''
    })
    this.viewrightssummary();
  }
  Submitmemo() {
    if (this.Viewrights.value.employee_id === undefined || this.Viewrights.value.employee_id === null || this.Viewrights.value.employee_id === '') {
      this.toastr.error("Please Choose Employee")
      return false
    }
    if (this.Viewrights.value.assigned_to === undefined || this.Viewrights.value.assigned_to === null || this.Viewrights.value.assigned_to === '') {
      this.toastr.error("Please Choose Assignee")
      return false
    }
    let data = {
      "remarks": this.remarks.value.remarks,
      "employee": this.Viewrights.value.employee_id.id,
      "assigned_to": this.Viewrights.value.assigned_to.id,
    }
    this.SpinnerService.show();
    this.memoService.submitviewrights(data).subscribe((res) => {
      this.SpinnerService.hide();
      if (res.code) {
        this.toastr.error(res.description);
        this.Viewrights.reset();
        this.remarks.reset();
      }
      else {
        this.toastr.success(res.message);
        this.Viewrights.reset();
        this.viewrightssummary();
        this.remarks.reset();
        // this.onCancel.emit()
      }
    },
      error => {
        this.SpinnerService.hide();
        this.Viewrights.reset();
        this.remarks.reset();
      }
    );
    
    

  }
  backtosummary() {
    this.onCancel.emit()

  }
  enmpname(){
    let pincodekeyvalue: String = "";
  this.getempCode(pincodekeyvalue);

  this.Viewrights.get('employee_id')?.valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),

      switchMap(value => this.memoService.get_EmployeeList(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.employelist = datas;

    })

  }
  enmpsearchname(){
    let pincodekeyvalue: String = "";
  this.getempsearchCode(pincodekeyvalue);

  this.Searchform.get('employee_id')?.valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),

      switchMap(value => this.memoService.get_EmployeeList(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.Searchemployelist = datas;

    })

  }
  assignname(){
    let pinkeyvalue: String = "";
  this.assigncode(pinkeyvalue);

  this.Viewrights.get('assigned_to')?.valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),

      switchMap(value => this.memoService.get_EmployeeList(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.assignedlist = datas;

    })

  }
  assignsearchname(){
    let pinkeyvalue: String = "";
  this.assignsearchcode(pinkeyvalue);

  this.Searchform.get('assigned_to')?.valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),

      switchMap(value => this.memoService.get_EmployeeList(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.assignedsearchlist = datas;

    })

  }
  private getempCode(pincodekeyvalue) {
    this.memoService.get_EmployeeList(pincodekeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employelist = datas;
      })
  }
  private getempsearchCode(pincodekeyvalue) {
    this.memoService.get_EmployeeList(pincodekeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Searchemployelist = datas;
      })
  }
  private assigncode(pincodekeyvalue) {
    this.memoService.get_EmployeeList(pincodekeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.assignedlist = datas;
      })
  }
  private assignsearchcode(pincodekeyvalue) {
    this.memoService.get_EmployeeList(pincodekeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.assignedsearchlist = datas;
      })
  }
  employescroll() {
    setTimeout(() => {
      if (
        this.matpincodeAutocomplete &&
        this.autocompleteTrigger &&
        this.matpincodeAutocomplete.panel
      ) {
        fromEvent(this.matpincodeAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matpincodeAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matpincodeAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matpincodeAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matpincodeAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.memoService.get_EmployeeList(this.pinCodeInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employelist = this.employelist.concat(datas);
                    if (this.employelist.length >= 0) {
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
  employesearchscroll() {
    setTimeout(() => {
      if (
        this.matpincodesearchAutocomplete &&
        this.autocompleteTrigger &&
        this.matpincodesearchAutocomplete.panel
      ) {
        fromEvent(this.matpincodesearchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matpincodesearchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matpincodesearchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matpincodesearchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matpincodesearchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.searchhas_next === true) {
                this.memoService.get_EmployeeList(this.pinCodesearchInput.nativeElement.value, this.searchcurrentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.Searchemployelist = this.Searchemployelist.concat(datas);
                    if (this.Searchemployelist.length >= 0) {
                      this.searchhas_next = datapagination.has_next;
                      this.searchhas_previous = datapagination.has_previous;
                      this.searchcurrentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  assignedscroll() {
    setTimeout(() => {
      if (
        this.matassignAutocomplete &&
        this.autocompleteTrigger &&
        this.matassignAutocomplete.panel
      ) {
        fromEvent(this.matassignAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matassignAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matassignAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matassignAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matassignAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.asssearchhas_next === true) {
                this.memoService.get_EmployeeList(this.assignsearchinput.nativeElement.value, this.asssearchcurrentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.assignedlist = this.assignedlist.concat(datas);
                    if (this.assignedlist.length >= 0) {
                      this.asssearchhas_next = datapagination.has_next;
                      this.asssearchhas_previous = datapagination.has_previous;
                      this.asssearchcurrentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  assignedsearchscroll() {
    setTimeout(() => {
      if (
        this.matassignsearchAutocomplete &&
        this.autocompleteTrigger &&
        this.matassignsearchAutocomplete.panel
      ) {
        fromEvent(this.matassignsearchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matassignsearchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matassignsearchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matassignsearchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matassignsearchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.asshas_next === true) {
                this.memoService.get_EmployeeList(this.assigninput.nativeElement.value, this.asscurrentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.assignedsearchlist = this.assignedsearchlist.concat(datas);
                    if (this.assignedsearchlist.length >= 0) {
                      this.asshas_next = datapagination.has_next;
                      this.asshas_previous = datapagination.has_previous;
                      this.asscurrentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  public displayFnpin(pintype?: pincode): string | undefined {
    return pintype ? pintype.full_name : undefined;
  }
  public displayassin(assigntype?: assigncode): string | undefined {
    return assigntype ? assigntype.full_name : undefined;
  }
  public displaysearchFnpin(pintypesearch?: searchcode): string | undefined {
    return pintypesearch ? pintypesearch.full_name : undefined;
  }
  public displaysearchassin(assignsearchtype?: searchassigncode): string | undefined {
    return assignsearchtype ? assignsearchtype.full_name : undefined;
  }
  viewrightssummary(pageNumber = 1, pageSize = 10){
    this.SpinnerService.show()
    if(this.searchempids == undefined || this.searchempids == null || this.searchempids ==""){
      this.searchempids = ""
    }
    if(this.searchassignids == undefined || this.searchassignids == null || this.searchassignids ==""){
      this.searchassignids = ""
    }
    this.memoService.getnewsearchsummarylists(this.searchempids,this.searchassignids,pageNumber,pageSize)
                  .subscribe((results: any[]) => {
                    this.SpinnerService.hide()
                    let datas = results["data"];
                    this.summaryassignedlist = datas;  
                    if (this.summaryassignedlist.length >= 0) {
                    let datapagination = results["pagination"];
                    this.asssummaryhas_next = datapagination.has_next;
                    this.asssummaryhas_previous = datapagination.has_previous;
                    this.asssummarypage = datapagination.index;
                  }
                  })
   
  }
  searchsummary(pageNumber = 1, pageSize = 10){
    this.SpinnerService.show()
    if(this.searchempids == undefined || this.searchempids == null || this.searchempids ==""){
      this.searchempids = ""
    }
    if(this.searchassignids == undefined || this.searchassignids == null || this.searchassignids ==""){
      this.searchassignids = ""
    }
    this.memoService.getnewsearchsummarylists( this.searchempids,this.searchassignids,pageNumber,pageSize)
                  .subscribe((results: any[]) => {
                    this.SpinnerService.hide();
                    let datas = results["data"];
                    this.summaryassignedlist = datas;  
                    if (this.summaryassignedlist.length >= 0) {
                    let datapagination = results["pagination"];
                    this.asssummaryhas_next = datapagination.has_next;
                    this.asssummaryhas_previous = datapagination.has_previous;
                    this.asssummarypage = datapagination.index;
                  }
                  })
   
  }
  Clearsummary(){
     this.searchempids = ""
     this.searchassignids = ""
    this.Searchform.reset();
    this.viewrightssummary();
  }
  previousClick(){
    this.viewrightssummary(this.asssummarypage - 1, 10);
  }
  nextClick(){
    this.viewrightssummary(this.asssummarypage + 1, 10);
  }
  active_inactive(data) {
    this.SpinnerService.show();
    this.memoService.branchactive(data.id)
    .subscribe(result => {
      this.SpinnerService.hide();
      if (result.code) {
        this.toastr.error(result.description);
      }
      else {
        this.toastr.success(result.message);
        this.viewrightssummary();
      }
    })
  }
  searchemp(datas){
    this.searchempids = datas.id

  }
  searchassign(datas){
    this.searchassignids = datas.id

  }
}