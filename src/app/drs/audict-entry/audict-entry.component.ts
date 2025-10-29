import { Component, OnInit, ViewChild, ElementRef, LOCALE_ID, Renderer2} from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map, debounce, skip } from 'rxjs/operators';
import { DrsService } from '../drs.service';
import { DatePipe, formatDate } from '@angular/common';

import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { MatCheckbox } from '@angular/material/checkbox';
// import { MatDatepicker } from '@angular/material/datepicker';
// import { event } from 'jquery';
import { registerLocaleData } from '@angular/common';
import localeEnIN from '@angular/common/locales/en-IN';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { SharedDrsService } from '../shared-drs.service';

registerLocaleData(localeEnIN);

export interface drs {
  gl_no: string;
  name: string;
  code: string;
  id: number;
  glno: string;
  stage: any;
  finyer: string;
  // type: number;
}


@Component({
  selector: 'app-audict-entry',
  templateUrl: './audict-entry.component.html',
  styleUrls: ['./audict-entry.component.scss'],
  providers: [DatePipe,
    { provide: LOCALE_ID, useValue: 'en-IN' }
  ]
})

export class AudictEntryComponent implements OnInit {

  infiniteScroll: InfiniteScrollDirective;

  // @HostListener('window:scroll', ['$event'])

  // @Output() scrollingFinished = new EventEmitter<void>();

  @ViewChild('Audit_sum_close') Audit_sum_close: ElementRef;
  @ViewChild('Audit_upload_close') Audit_upload_close: ElementRef;
  @ViewChild('Audit_return_close') Audit_return_close: ElementRef;

  @ViewChild('StageContactInput') StageContactInput: any;
  @ViewChild('stagesum') matAutocompletestage: MatAutocomplete;

  @ViewChild("audict_Alei") audict_Alei: MatAutocomplete;
  @ViewChild("audict_Dr_Cr") audict_Dr_Cr: MatAutocomplete;
  @ViewChild("Audit_modal_drcr") Audit_modal_drcr: MatAutocomplete;

  @ViewChild('branchContactInput') branchContactInput: any;
  @ViewChild('branch') matAutocompletebrach: MatAutocomplete;

  @ViewChild('branchSumContactInput') branchSumContactInput: any;
  @ViewChild('branchsum') matAutocompletebrasum: MatAutocomplete;

  @ViewChild('branchmodalContactInput') branchmodalContactInput: any;
  @ViewChild('branchmodal') matAutocompletebramodal: MatAutocomplete;

  @ViewChild('GLContactInput') GLContactInput: any;
  @ViewChild('GLNumber') matAutocompleteGL: MatAutocomplete;

  @ViewChild('GLsumContactInput') GLsumContactInput: any;
  @ViewChild('GLNumbersum') matAutocompleteGLsum: MatAutocomplete;

  @ViewChild('GLmodalContactInput') GLmodalContactInput: any;
  @ViewChild('GLNumbermodal') matAutocompleteGLmodal: MatAutocomplete;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('checkbox') checkbox: MatCheckbox;

  @ViewChild('fin_year') fin_yearauto: MatAutocomplete
  @ViewChild('finyearInput') finyearInput: any;

  @ViewChild('targetElement') scrollableElement: ElementRef;
  // @ViewChild('targetElement') tableElement: ElementRef;
  Stage_List: any;
  Stage_lasts: boolean;
  check_permission: any;
  isButtonDisableds: boolean;
  Selectedsingle: boolean;
  single: any;
  scroll: number;
  set: number;
  entry: number;
  style: any;
  search_down: boolean;
  formGroupBeingProcessed: FormGroup;
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
  // Arrow: number;
  @ViewChild(InfiniteScrollDirective) set appScroll(directive: InfiniteScrollDirective) { this.infiniteScroll = directive; }

  // @ViewChild('targetElement') targetElement!: ElementRef;


  singleCheckboxControl = new FormControl(false);
  selectAllCheckboxControl = new FormControl(false);

  singleCheckbox_for_checker_approver = new FormControl(false);
  selectAllCheckbox_for_Checker_Approver = new FormControl(false);


  checkboxItems: any[] = [];
  allSelected = false;
  Audict_entry_summary: FormGroup;
  summaryshow: boolean = true;
  Audict_entry_form: FormGroup;
  i: FormGroup;
  newrowadd: FormGroup;
  Alei_Value: any;
  ALEI_type = [
    { name: "Assets", id: "1", code: "A" },
    { name: "Liabilities", id: "2", code: "L" },
    { name: "Expenses", id: "3", code: "E" },
    { name: "Income", id: "4", code: "I" },
  ]
  DR_CR = [
    { name: "Debit", id: "1" },
    { name: "Credit", id: "2" },
  ]
  Status = [
    // { name: "Move To Approver", id: "2" },
    { name: "Approved", id: "3" },
    { name: "Freeze", id: "4" },
  ]
  allComplete: boolean;
  endDate: Date;
  branchList: any;
  pprSearchForm: any;
  isLoading = false;
  has_nextbra: boolean;
  has_previousbra: boolean;
  currentpagebra: number;
  startdate: Date;
  datas: any;
  checkboxValue: any;
  datas1: any;
  rows: any;
  rows_value: any;
  rowsArray: any;
  values: any;
  indexdata: any;
  data_view: boolean = true;
  indexvalues: any;
  // debitsum: any;
  // creditsum: any;
  creditsum = 0;
  debitsum = 0;
  creditChecker = 0;
  debitChecker = 0;
  PARAMS: {};
  alei_code: any;
  audict_datas: any;
  Alei_be_data: any;
  // datepipe: any;
  date: any;
  date1: any;
  key_param: { audict_Alei: any; audict_Bra_code: any; audict_Gl_no: any; audict_Trans_date: any; audict_value_date: any; audict_trans_desc: any; audict_Amount: any; audict_Dr_Cr: any; };
  GL_List: any;
  currentpageGl: any;
  has_nextGl: any;
  has_previousGl: boolean;
  glsum_list1: any;
  currentpageFinsum: number;
  has_previousFinsum: boolean;
  has_nextFinsum: boolean;
  audit_summary_data: any;
  hasnext: any;
  hasprevious: any;
  presentpage: any;
  brasum_list_sum: any;
  has_nextbrasum: any;
  currentpagebrasum: any;
  has_previousbrasum: any;
  transdate: string;
  data_Audit_found: boolean;
  currentpage: number;
  Audit_form_data: any;
  employee_permission: boolean;
  notification: any;

  Audit_checked: boolean;
  employee_checker: boolean;
  checker: any;
  checker_id: any;
  idvalues = [];
  id = [];

  message_checker: any;
  Allselectchecker: any;
  checker_select_all_id: any;
  All_data: any;
  Selected: boolean;
  // form: any;
  forms: any;
  employee_permission_btn: boolean;
  employee_permission_card: boolean;
  employee_permission_checker: boolean;
  permission: any;
  Allselectmaker: any;
  All_data_Add: any;
  message_maker: any;
  Amount_edit: boolean;
  AuditModal: FormGroup;
  brasum_list_modal: any;
  has_nextbra_modal: boolean;
  has_previousbra_modal: boolean;
  currentpagebra_modal: number;
  glmodal_list1: any;
  has_nextFinModal: boolean;
  has_previousFinModal: boolean;
  currentpageFinModal: number;
  Audit_Edit_submit_btn: boolean;
  Evalue: any;
  EditId: any;
  audict_stage_modal: any;
  audict_Dr_Cr_modal: any;
  audict_Amount_modal: any;
  audict_trans_desc_modal: any;
  audict_value_date_modal: any;
  audict_Trans_date_modal: any;
  audict_Gl_no_modal: any;
  audict_Bra_code_modal: any;
  audict_Alei_modal: any;
  Edit_param: { audict_Alei: any; audict_Bra_code: any; audict_Gl_no: any; audict_Trans_date: any; audict_value_date: any; audict_trans_desc: any; audict_Amount: any; audict_Dr_Cr: any; id: any };
  Approver_status: boolean;
  Approved_status: boolean;
  employee_permission_checkers: boolean;
  Edit_permission: boolean;
  file: any;
  Stage_freeze: boolean;
  AuditModaldownload: FormGroup;
  upload_maker: boolean;
  audict_Trans_date_sums: string;
  key_params: { audict_Alei: any; audict_Bra_code: any; audict_Gl_no: any; audict_Trans_date: any; audict_value_date: any; audict_trans_desc: any; audict_Amount: any; audict_Dr_Cr: any; };
  date1all: string;
  dateall: string;
  paginations: any;
  Audit_edits: any;
  dateTrans: string;
  datevalue: string;
  Alei_key: any;
  page: number;
  Dr_CRs_edit: boolean;
  Description_edit: boolean;
  value_date_edit: boolean;
  Transaction_date_edit: boolean;
  Alei_edit: boolean;
  Gl_edit: boolean;
  branch_cod_edit: boolean;
  isDatepickerDisabled: boolean;
  isDatepicker2Disabled: boolean;
  isButtonDisabled: boolean = false;
  scrollableElementRef: any;
  hasnexts: boolean = true;
  Clears: boolean;
  name_clear: any;
  Stage_list_: any;
  has_nextstage: any;
  has_previousstage: any;
  app_permission: boolean;
  stage_permission: boolean;
  audict_approve_date_sums: string;
  finyearList: any;
  has_nextfinyr: boolean;
  has_previousfinyr: boolean;
  currentpagefinyr: number;
  scrollTimeout: any;
  Arrow: string = "1";
  ArrowDirection: string = "&#8595;";


  // Audit_sum_close: any;
  // AuditModal: any;
  // sumary_id: any;

  constructor(private Render: Renderer2 , private element: ElementRef, private fb: FormBuilder, private Toastr: ToastrService, private drsservice: DrsService, private spinnerservice: NgxSpinnerService, public datepipe: DatePipe, private drsshared: SharedDrsService) {
    this.selectAllCheckboxControl.valueChanges.subscribe(checked => {
      this.singleCheckboxControl.setValue(checked);
    });

    this.selectAllCheckbox_for_Checker_Approver.valueChanges.subscribe(checked => {
      this.singleCheckbox_for_checker_approver.setValue(checked);
    });
  }

  Audit_return:FormGroup;
  ngOnInit(): void {
    document.getElementById("mySidenav").style.width = "200px";
    document.getElementById("main").style.marginLeft = "12rem";
    this.drsshared.isSideNav = false;

    this.summaryshow = true;
    const currentDate = new Date();
    this.endDate = new Date(currentDate.getTime() - 0 * 24 * 60 * 60 * 1000);



    this.Audict_entry_summary = this.fb.group({
      audict_branch: '',
      audict_Gl: '',
      audict_Trans_date_sum: '',
      audict_status: '',
      audict_Approve_date_sum: '',
      stage: '',
      Audit_finyear: '',
      frommonth:'',
      // selectAllCheckbox_for_Checker_Approver: '',
      // singleCheckbox_for_checker_approver: ''
    })
    this.Audict_entry_form = this.fb.group({
    })
    this.i = this.fb.group({
      audict_Alei: '',
      audict_Dr_Cr: '',
      audict_Bra_code: '',
      audict_Gl_no: '',
      audict_Trans_date: '',
      audict_value_date: '',
      audict_trans_desc: '',
      audict_Amount: '',
      audict_App_date: '',
      // audict_stage: '',
      singleCheckboxControl: '',
      selectAllCheckboxControl: '',
      delete: ''
    })
    this.AuditModal = this.fb.group({
      Audit_modal_branch: '',
      Audit_modal_gl: '',
      Audit_modal_alei: '',
      Audit_modal_tdate: '',
      Audit_modal_vdate: '',
      Audit_modal_Td: '',
      Audit_modal_drcr: '',
      Audit_modal_amount: '',
      Audit_modal_stage: '',
    })
    this.AuditModaldownload = this.fb.group({
      documentfile: '',
    })
    this.Audict_entry_summary = this.fb.group({
      audict_branch: '',
      audict_Gl: '',
      audict_Trans_date_sum: '',
      audict_status: '',
      audict_Approve_date_sum: '',
      stage: '',
      Audit_finyear: '',
      frommonth:'',
      // selectAllCheckbox_for_Checker_Approver: '',
      // singleCheckbox_for_checker_approver: ''
    })
    this.Audit_return = this.fb.group({
        remarks: ''
      })
    this.newrowadd = this.fb.group({
      rows_value: new FormArray([
        this.createItemFormGroup()
      ])
    })



    this.newrowadd.get('rows_value').valueChanges.subscribe(values => {
      console.log("values", values);
    });

    // this.Audit_search("")
    // this.Stage_last()
    this.isButtonDisableds = true
    this.check_permission= this.drsshared.found_permission.value
    console.log("Permission Check =>", this.check_permission)
    if(this.check_permission== "Maker"){
      this.employee_permission= true
      this.upload_maker= true
    }
   

  }
  

  public ALEI_display(audict_Alei?: drs): string | undefined {
    return audict_Alei ? audict_Alei.name : undefined;
  }

  public displaystage(stage?: drs): string | undefined {
    return stage ? stage.name : undefined;
  }

  public ALEI_modal_display(Audit_modal_alei?: drs): string | undefined {
    return Audit_modal_alei ? Audit_modal_alei.name : undefined;
  }

  public DR_CR_display(audict_Dr_Cr?: drs): string | undefined {
    return audict_Dr_Cr ? audict_Dr_Cr.name : undefined;
  }

  public DR_CR_Modal_display(Audit_modal_drcr?: drs): string | undefined {
    return Audit_modal_drcr ? Audit_modal_drcr.name : undefined;
  }

  public Status_display(audict_status?: drs): string | undefined {
    return audict_status ? audict_status.name : undefined;
  }

  // schdular_master_name.name+"-"+schdular_master_name.cod

  public displayfnbranch(audict_Bra_code?: drs): string | undefined {
    return audict_Bra_code ? audict_Bra_code.name + "-" + audict_Bra_code.code : undefined;
  }

  public displayGL(audict_Gl_no?: drs): string | undefined {
    return audict_Gl_no ? audict_Gl_no.glno : undefined;
  }

  public displayGLsum(audict_Gl?: drs): string | undefined {
    return audict_Gl ? audict_Gl.glno : undefined;
  }

  public displayGLmodal(Audit_modal_gl?: drs): string | undefined {
    return Audit_modal_gl ? Audit_modal_gl.glno : undefined;
  }

  public displayfnbranchsum(audict_branch?: drs): string | undefined {
    return audict_branch ? audict_branch.name + "-" + audict_branch.code : undefined;
  }

  public displayfnbranchmodal(Audit_modal_branch?: drs): string | undefined {
    return Audit_modal_branch ? Audit_modal_branch.code : undefined;
  }

  public displayfnfinyear(fin_year?: drs): string | undefined {
    return fin_year ? fin_year.finyer : undefined;
  }




  createItemFormGroup() {
    let fg = new FormGroup({
      audict_Alei: new FormControl(''),
      audict_Bra_code: new FormControl(''),
      audict_Gl_no: new FormControl(''),
      audict_Trans_date: new FormControl(''),
      audict_value_date: new FormControl(''),
      audict_trans_desc: new FormControl(''),
      audict_Amount: new FormControl(''),
      audict_Dr_Cr: new FormControl(''),
      audict_App_date: new FormControl(''),
      // audict_stage: new FormControl(''),
      singleCheckboxControl: new FormControl(''),
      selectAllCheckboxControl: new FormControl('')
    })
    return fg
  }

  Alei_fun(i) {
    var arrayControl = this.newrowadd.get('rows_value') as FormArray;
    let item = arrayControl.at(i);
    this.Alei_Value = item
    console.log(this.Alei_Value, "ALEI:")
  }

  Dr_Cr_fun(i) {
    var arrayControl = this.newrowadd.get('rows_value') as FormArray;
    let item = arrayControl.at(i);
  }

  Branch_fun(i) {
    let prokeyvalue: String = "";
    this.getbranchid(prokeyvalue);
    var arrayControl = this.newrowadd.get('rows_value') as FormArray;
    let item = arrayControl.at(i);
    item.get('audict_Bra_code').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.drsservice.getbranchdropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
      })
  }

  private getbranchid(prokeyvalue) {
    // this.spinnerservice.show()
    this.drsservice.getbranchdropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        // this.spinnerservice.hide()
        let datas = results["data"];
        this.branchList = datas;
      })
  }

  autocompletebranchnameScroll() {
    this.has_nextbra = true
    this.has_previousbra = true
    this.currentpagebra = 1
    setTimeout(() => {
      if (
        this.matAutocompletebrach &&
        this.autocompleteTrigger &&
        this.matAutocompletebrach.panel
      ) {
        fromEvent(this.matAutocompletebrach.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletebrach.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletebrach.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletebrach.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletebrach.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbra === true) {
                this.drsservice.getbranchdropdown(this.branchContactInput.nativeElement.value, this.currentpagebra + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchList = this.branchList.concat(datas);
                    if (this.branchList.length >= 0) {
                      this.has_nextbra = datapagination.has_next;
                      this.has_previousbra = datapagination.has_previous;
                      this.currentpagebra = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  Branch_fun_sum() {
    // this.spinnerservice.show()

    let prokeyvalue: String = "";
    this.getaudict_brasum_drop(prokeyvalue);
    this.Audict_entry_summary.get('audict_branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),

        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.drsservice.getbranchdropdown(value, 1)
          .pipe(
            finalize(() => {
              console.log(value)

            }),
          )
        )
      )
      .subscribe((results: any) => {
        // this.spinnerservice.hide()
        let data_bra_sum = results["data"]
        this.brasum_list_sum = data_bra_sum;
        console.log("report_create_dropdown", this.brasum_list_sum)
        this.isLoading = false
      })

  }

  private getaudict_brasum_drop(prokeyvalue) {
    // this.spinnerservice.show()
    this.drsservice.getbranchdropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        this.spinnerservice.hide()
        let data_bra_sum = results["data"];
        this.brasum_list_sum = data_bra_sum;
      })

  }

  autocompletebranchsumScroll() {
    this.has_nextbrasum = true
    this.has_previousbrasum = true
    this.currentpagebrasum = 1
    setTimeout(() => {
      if (
        this.matAutocompletebrasum &&
        this.autocompleteTrigger &&
        this.matAutocompletebrasum.panel
      ) {
        fromEvent(this.matAutocompletebrasum.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletebrasum.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletebrasum.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletebrasum.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletebrasum.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbrasum === true) {
                this.drsservice.getbranchdropdown(this.branchSumContactInput.nativeElement.value, this.currentpagebrasum + 1)
                  .subscribe((results: any[]) => {
                    let data_bra_sum = results["data"];
                    let datapagination = results["pagination"];
                    this.brasum_list_sum = this.brasum_list_sum.concat(data_bra_sum);
                    if (this.brasum_list_sum.length >= 0) {
                      this.has_nextbrasum = datapagination.has_next;
                      this.has_previousbrasum = datapagination.has_previous;
                      this.currentpagebrasum = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });

  }

  Branch_fun_modal() {
    // this.spinnerservice.show()

    let prokeyvalue: String = "";
    this.getaudict_bramodal_drop(prokeyvalue);
    this.AuditModal.get('Audit_modal_branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),

        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.drsservice.getbranchdropdown(value, 1)
          .pipe(
            finalize(() => {
              console.log(value)

            }),
          )
        )
      )
      .subscribe((results: any) => {
        // this.spinnerservice.hide()
        let data_bra_modal = results["data"]
        this.brasum_list_modal = data_bra_modal;
        console.log("report_create_dropdown", this.brasum_list_modal)
        this.isLoading = false
      })

  }
  private getaudict_bramodal_drop(prokeyvalue) {
    // this.spinnerservice.show()
    this.drsservice.getbranchdropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        // this.spinnerservice.hide()
        let data_bra_modal = results["data"];
        this.brasum_list_modal = data_bra_modal;
      })

  }
  autocompletebranchmodalScroll() {
    this.has_nextbra_modal = true
    this.has_previousbra_modal = true
    this.currentpagebra_modal = 1
    setTimeout(() => {
      if (
        this.matAutocompletebramodal &&
        this.autocompleteTrigger &&
        this.matAutocompletebramodal.panel
      ) {
        fromEvent(this.matAutocompletebramodal.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletebramodal.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletebramodal.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletebramodal.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletebramodal.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbra_modal === true) {
                this.drsservice.getbranchdropdown(this.branchmodalContactInput.nativeElement.value, this.currentpagebra_modal + 1)
                  .subscribe((results: any[]) => {
                    let data_bra_modal = results["data"];
                    let datapagination = results["pagination"];
                    this.brasum_list_modal = this.brasum_list_modal.concat(data_bra_modal);
                    if (this.brasum_list_modal.length >= 0) {
                      this.has_nextbra_modal = datapagination.has_next;
                      this.has_previousbra_modal = datapagination.has_previous;
                      this.currentpagebra_modal = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });


  }

  GL_fun(i) {
    let prokeyvalue: String = "";
    this.getGLid(prokeyvalue);
    var arrayControl = this.newrowadd.get('rows_value') as FormArray;
    let item = arrayControl.at(i);
    item.get('audict_Gl_no').valueChanges

      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("Item GL", item)

        }),
        switchMap(value => this.drsservice.GL_dropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let GL_datas = results["data"];
        this.GL_List = GL_datas;
      })
  }
  private getGLid(prokeyvalue) {
    // this.spinnerservice.show()
    this.drsservice.GL_dropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        // this.spinnerservice.hide()
        let GL_datas = results["data"];
        this.GL_List = GL_datas;
      })
  }

  autocompleteGLnameScroll() {
    this.has_nextGl = true
    this.has_previousGl = true
    this.currentpageGl = 1
    setTimeout(() => {
      if (
        this.matAutocompleteGL &&
        this.autocompleteTrigger &&
        this.matAutocompleteGL.panel
      ) {
        fromEvent(this.matAutocompleteGL.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompleteGL.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompleteGL.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteGL.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteGL.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextGl === true) {
                this.drsservice.GL_dropdown(this.GLContactInput.nativeElement.value, this.currentpageGl + 1)
                  .subscribe((results: any[]) => {
                    let GL_datas = results["data"];
                    let datapaginations = results["pagination"];
                    this.GL_List = this.GL_List.concat(GL_datas);
                    if (this.GL_List.length >= 0) {
                      this.has_nextGl = datapaginations.has_next;
                      this.has_previousGl = datapaginations.has_previous;
                      this.currentpageGl = datapaginations.index;
                    }
                  })
              }
            }
          });
      }
    });

  }
  GL_fun_sum() {
    // this.spinnerservice.show()

    let prokeyvalue: String = "";
    this.getaudict_glsum_drop(prokeyvalue);
    this.Audict_entry_summary.get('audict_Gl').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),

        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.drsservice.GL_dropdown(value, 1)
          .pipe(
            finalize(() => {
              console.log(value)

            }),
          )
        )
      )
      .subscribe((results: any) => {
        // this.spinnerservice.hide()
        let datasum = results["data"]
        this.glsum_list1 = datasum;
        console.log("report_create_dropdown", this.glsum_list1)
        this.isLoading = false
      })
  }

  private getaudict_glsum_drop(prokeyvalue) {
    this.drsservice.GL_dropdown(prokeyvalue, 1)
      .subscribe((results: any) => {
        // this.spinnerservice.hide()
        this.glsum_list1 = results["data"]
        console.log("report_create_dropdown", this.glsum_list1)
        this.isLoading = false
      })

  }

  autocompleteGLsumScroll() {
    this.has_nextFinsum = true;
    this.has_previousFinsum = true;
    this.currentpageFinsum = 1
    let flag = 0
    setTimeout(() => {
      if (
        this.matAutocompleteGLsum &&
        this.autocompleteTrigger &&
        this.matAutocompleteGLsum.panel
      ) {
        fromEvent(this.matAutocompleteGLsum.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompleteGLsum.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompleteGLsum.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteGLsum.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteGLsum.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextFinsum === true) {
                this.drsservice.GL_dropdown(this.GLsumContactInput.nativeElement.value, this.currentpageFinsum + 1)
                  .subscribe((results: any[]) => {
                    let datasum = results["data"];
                    let datapagination5 = results["pagination"];
                    this.glsum_list1 = this.glsum_list1.concat(datasum);
                    if (this.glsum_list1.length >= 0) {
                      this.has_nextFinsum = datapagination5.has_next;
                      this.has_previousFinsum = datapagination5.has_previous;
                      this.currentpageFinsum = datapagination5.index;
                    }
                    console.log("report_create_data:", this.glsum_list1)
                  })
              }

            }
          })
      }
    })
  }
  GL_fun_modal() {
    // this.spinnerservice.show()

    let prokeyvalue: String = "";
    this.getaudict_glModal_drop(prokeyvalue);
    this.AuditModal.get('Audit_modal_gl').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),

        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.drsservice.GL_dropdown(value, 1)
          .pipe(
            finalize(() => {
              console.log(value)

            }),
          )
        )
      )
      .subscribe((results: any) => {
        // this.spinnerservice.hide()
        let GLModal = results["data"]
        this.glmodal_list1 = GLModal;
        console.log("report_create_dropdown", this.glmodal_list1)
        this.isLoading = false
      })

  }
  private getaudict_glModal_drop(prokeyvalue) {
    this.drsservice.GL_dropdown(prokeyvalue, 1)
      .subscribe((results: any) => {
        // this.spinnerservice.hide()
        this.glmodal_list1 = results["data"]
        console.log("report_create_dropdown", this.glmodal_list1)
        this.isLoading = false
      })

  }
  autocompleteGLmodalScroll() {
    this.has_nextFinModal = true;
    this.has_previousFinModal = true;
    this.currentpageFinModal = 1
    let flag = 0
    setTimeout(() => {
      if (
        this.matAutocompleteGLmodal &&
        this.autocompleteTrigger &&
        this.matAutocompleteGLmodal.panel
      ) {
        fromEvent(this.matAutocompleteGLmodal.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompleteGLmodal.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompleteGLmodal.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteGLmodal.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteGLmodal.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextFinModal === true) {
                this.drsservice.GL_dropdown(this.GLmodalContactInput.nativeElement.value, this.currentpageFinModal + 1)
                  .subscribe((results: any[]) => {
                    let GLModal = results["data"];
                    let datapagination5 = results["pagination"];
                    this.glmodal_list1 = this.glmodal_list1.concat(GLModal);
                    if (this.glmodal_list1.length >= 0) {
                      this.has_nextFinModal = datapagination5.has_next;
                      this.has_previousFinModal = datapagination5.has_previous;
                      this.currentpageFinModal = datapagination5.index;
                    }
                    console.log("report_create_data:", this.glmodal_list1)
                  })
              }

            }
          })
      }
    })

  }

  Transaction_fun(i) {
    var arrayControl = this.newrowadd.get('rows_value') as FormArray;
    let item = arrayControl.at(i);
  }

  // Transaction_sum() {

  // }

  value_fun(i) {
    var arrayControl = this.newrowadd.get('rows_value') as FormArray;
    let item = arrayControl.at(i);
  }

  Description_fun(i) {
    var arrayControl = this.newrowadd.get('rows_value') as FormArray;
    let item = arrayControl.at(i);
  }

  Amount_fun(i) {
    var arrayControl = this.newrowadd.get('rows_value') as FormArray;
    let item = arrayControl.at(i);
  }

  Approved_fun(i) {
    var arrayControl = this.newrowadd.get('rows_value') as FormArray;
    let item = arrayControl.at(i);
  }

  Stage_fun(i) {
    var arrayControl = this.newrowadd.get('rows_value') as FormArray;
    let item = arrayControl.at(i);
  }

  Dr_CR_edit() {

  }

  Add(ADD) {
    this.summaryshow = false;
    this.newrowadd.reset()
    this.Audict_entry_summary.reset()
    // this.isButtonDisabled= true
    this.selectAllCheckboxControl.reset()
    this.singleCheckboxControl.reset()
    const formArrays = <FormArray>this.newrowadd.get('rows_value');
    const startindex = 1
    for (let i = formArrays.length - 1; i >= startindex; i--) {
      formArrays.removeAt(i);
    }
    const formArray = this.newrowadd.get('rows_value') as FormArray;
    formArray.controls.forEach((formGroup: FormGroup) => {
      formGroup.enable();
      this.isButtonDisabled = false
    });
  }

  Audit_clear() {
    // this.audit_summary_data= []

    this.Audict_entry_summary.reset()

    this.selectAllCheckbox_for_Checker_Approver.reset()
    this.singleCheckbox_for_checker_approver.reset()
    this.Checkbox = []
    this.id = []
    this.debitChecker = 0
    this.creditChecker = 0
    // this.Audit_search("")
    // this.infiniteScroll.ngOnDestroy();
    // this.infiniteScroll.setup();


    // this.infiniteScroll.ngOnDestroy();
    // this.infiniteScroll.setup();

    // this.Clears= true
    // this.name_clear="clear"


    // this.attachScrollListener();
    // this.onscroll()
    //   setTimeout(() => {
    //     const tableElement = document.getElementById('boxlevel'); // Replace 'yourTableId' with the actual ID of your table
    //     if (tableElement) {
    //         tableElement.scrollTop = 0; // Scroll to the top of the table
    //         const event = new Event('scroll');
    //         tableElement.dispatchEvent(event); // Dispatch the scroll event
    //     }
    // }, 100);

  }
  // resetTableScroll(){
  //   const tableElement = document.getElementById('boxlevel'); 
  //   if (tableElement) {
  //       tableElement.scrollTo(0,0); 
  //       this.Audit_search("")
  //       // const event = new Event('scroll');
  //       // // const event = new Event('scroll');
  //       // tableElement.dispatchEvent(event); 
  //   }
  // }

  // attachScrollListener() {
  //   const scrollableElement = this.scrollableElementRef.nativeElement;

  //   scrollableElement.addEventListener('scroll', () => {
  //     console.log('Scroll event triggered');
  //     // Your logic for handling scroll event goes here
  //   });
  // }

  Alei_modal() {

  }

  Add_audict_form(Audict_add, row) {
    console.log("Row=>", row)
    this.summaryshow = false;
    if (this.newrowadd.value.rows_value[0]["audict_Bra_code"] === null || this.newrowadd.value.rows_value[0]["audict_Bra_code"] === '') {
      this.Toastr.warning("Please Select The Branch Code")
      return false
    }
    // this.i.reset()
    // this.newrowadd.reset()

    // if (this.i.controls["audict_Dr_Cr"].value == null || this.i.controls["audict_Dr_Cr"].value == '') {
    //   this.Toastr.warning("Please Enter The DR/CR")
    //   return false
    // }
    // if (this.i.controls["audict_Alei"].value == null || this.i.controls["audict_Alei"].value == '') {
    //   this.Toastr.warning("Please Enter The ALEI")
    //   return false
    // }
    // if (this.i.controls["audict_Alei"].value == null || this.i.controls["audict_Alei"].value == '') {
    //   this.Toastr.warning("Please Enter The ALEI")
    //   return false
    // }
    const form = <FormArray>this.newrowadd.get('rows_value')
    for (let valsource of form.value) {
      console.log("edit", valsource.isEditable)
    }

    form.insert(0, this.createItemFormGroup());




    this.selectAllCheckboxControl.reset()
    this.singleCheckboxControl.reset()
    this.Checkbox = []
    this.debitsum = 0
    this.creditsum = 0
    // this.Amount_edit = false

    const formArray = this.newrowadd.get('rows_value') as FormArray;
    formArray.controls.forEach((formGroup: FormGroup) => {
      formGroup.enable();
      this.isButtonDisabled= false
    });
  }


  back() {
    this.summaryshow = true;
    this.Audict_entry_summary.reset()
    // this.Audit_search("")
  }

  Audit_search(Auditsum_data) {

    if (this.Audict_entry_summary.value["Audit_finyear"] === null || this.Audict_entry_summary.value["Audit_finyear"] === '' || this.Audict_entry_summary.value["Audit_finyear"] === undefined) {
      this.Toastr.warning("Please Select The Finyear")
      return false
    }
    if (this.Audict_entry_summary.value["frommonth"] === null || this.Audict_entry_summary.value["frommonth"] === '' || this.Audict_entry_summary.value["frommonth"] === undefined) {
      this.Toastr.warning("Please Select The Month")
      return false
    }
    this.page = 1;
    this.selectAllCheckbox_for_Checker_Approver.reset()
    this.singleCheckbox_for_checker_approver.reset()
    this.debitChecker = 0
    this.creditChecker = 0
    let Audit_form_data = Auditsum_data
    this.audict_Trans_date_sums = this.datepipe.transform(this.Audict_entry_summary.value.audict_Trans_date_sum, 'yyyy-MM-dd')
    console.log("date", this.audict_Trans_date_sums)
    this.audict_approve_date_sums = this.datepipe.transform(this.Audict_entry_summary.value.audict_Approve_date_sum, 'yyyy-MM-dd')
    console.log("date", this.audict_approve_date_sums)

    // let page = 1
    // this.Exception_data.Exception_Fyear?.finyer?? '';
    // let glnoo = ""
    let glno = this.Audict_entry_summary.value.audict_Gl?.glno ?? '';
    let branchcode = this.Audict_entry_summary.value.audict_branch?.code ?? '';
    let transactiondate = this.audict_Trans_date_sums ? this.audict_Trans_date_sums : "";
    let status = this.Audict_entry_summary.value.audict_status?.id ?? '';
    let flag = 1
    let stage = this.Audict_entry_summary.value.stage?.id ?? '';
    // let stage= 1
    let approvedate = this.audict_approve_date_sums ? this.audict_approve_date_sums : "";
    let finyear = this.Audict_entry_summary.value.Audit_finyear?.finyer ?? '';
    let month = this.Audict_entry_summary.value.frommonth?.month_id ?? '';
    // let status = 1
    this.spinnerservice.show()
    this.drsservice.Audit_summary(glno, this.page, branchcode, transactiondate, status, flag, stage, approvedate, finyear,month).subscribe((results: any) => {
      this.spinnerservice.hide()
      let data = results["data"];
      this.audit_summary_data = data;
      this.permission = results["employee_permission"];
      this.Stage_last()



      if (this.permission == "Maker") {
        this.employee_permission = true
        this.employee_permission_checker = false
        this.Approver_status = false
        this.Edit_permission = true
        this.Stage_freeze = false
        this.upload_maker = true
        this.Approved_status = false
        this.app_permission = false
        this.stage_permission = false
        this.Stage_lasts= false

      }
      if (this.permission == "Checker") {
        this.employee_permission_checker = true
        this.employee_permission = false
        this.Approver_status = false
        this.employee_permission_checkers = true
        this.Edit_permission = true
        this.Stage_freeze = false
        this.upload_maker = false
        this.Approved_status = false
        this.app_permission = false
        this.stage_permission = false
        this.Stage_lasts= false

      }
      if (this.permission == "Approver") {
        this.employee_permission_checker = true
        this.employee_permission = false
        this.Approver_status = true
        this.employee_permission_checkers = true
        this.Edit_permission = true
        this.Stage_freeze = false
        this.upload_maker = false
        this.Approved_status = false
        this.app_permission = false
        this.stage_permission = false
        this.Stage_lasts= false
        if (status == "3") {
          this.style= true
          this.Approved_status = true
          this.employee_permission_checker = true
          this.employee_permission_checkers = false
          this.Edit_permission = true
          this.Stage_freeze = false
          this.upload_maker = false
          this.app_permission = true
          this.stage_permission = false
          this.Stage_lasts= true
        }
        if (status == "4") {
          this.style= false
          // this.Stage_lasts= true
          this.Approved_status = false
          this.employee_permission_checker = false
          this.employee_permission_checkers = false
          this.Edit_permission = false
          this.Stage_freeze = true
          this.upload_maker = false
          this.app_permission = true
          this.stage_permission = true
          this.Stage_lasts= true
          

        }

      }


      let datapagination = results["pagination"];
      if (this.audit_summary_data?.length > 0) {
        this.hasnext = datapagination.has_next;
        this.hasprevious = datapagination.has_previous;
        this.presentpage = datapagination.index;
        this.data_Audit_found = true;
        this.isButtonDisableds= false
      }
      if (this.audit_summary_data?.length == 0) {
        this.hasnext = false;
        this.hasprevious = false;
        this.presentpage = 1;
        this.data_Audit_found = false;
        this.isButtonDisableds = true
      }
      if(this.search_down== true){
        if(this.page == 1){
          this.infiniteScroll.ngOnDestroy();
          this.infiniteScroll.setup();
          return false          
        }
      }
      return false

      
      
     
     
      // this.infiniteScroll.setup();
      // this.infiniteScroll.setup();
      // this.infiniteScroll.ngOnDestroy();
      // this.infiniteScroll.ngOnDestroy();



    })

    // this.infiniteScroll.ngOnDestroy();

    // this.infiniteScroll.setup();



    console.log("this.Stage_lasts= true",this.Stage_lasts)

  }





  onscroll() {
    // this.infiniteScroll.setup();
    // this.infiniteScroll.ngOnDestroy();
    // if(this.entry==0){
    //   // this.entry=2
    // }else{
      
    // }
    // this.entry=1
    
    // if(this.entry==1){
      // if(this.entry==1){
        this.scroll=1
        this.Checkbox = []
        this.id = []
        this.debitChecker = 0
        this.creditChecker = 0
        this.selectAllCheckbox_for_Checker_Approver.reset()
        this.singleCheckbox_for_checker_approver.reset()
        this.audict_Trans_date_sums = this.datepipe.transform(this.Audict_entry_summary.value.audict_Trans_date_sum, 'yyyy-MM-dd')
        console.log("date", this.audict_Trans_date_sums)
        this.audict_approve_date_sums = this.datepipe.transform(this.Audict_entry_summary.value.audict_Approve_date_sum, 'yyyy-MM-dd')
        console.log("date", this.audict_approve_date_sums)
        let glno = this.Audict_entry_summary.value.audict_Gl?.glno ?? '';
        let status = this.Audict_entry_summary.value.audict_status?.id ?? '';
        let branchcode = this.Audict_entry_summary.value.audict_branch?.code ?? '';
    
        let transactiondate = this.audict_Trans_date_sums ? this.audict_Trans_date_sums : "";
        let flag = 1
        let stage = this.Audict_entry_summary.value.stage?.id ?? '';
        // let stage= 1
        let approvedate = this.audict_approve_date_sums ? this.audict_approve_date_sums : "";
        let finyear = this.Audict_entry_summary.value.Audit_finyear?.finyer ?? '';
    
        if (this.hasnext === true) {
          this.page++;
        }
        if (this.hasnext === false) {
          // this.page = 1
          return false
        }
        if(this.page==2){
          this.search_down=true
        }
        if(this.page==3){
          this.search_down=false
        }
        // this.name_clear=this.page
       let month = this.Audict_entry_summary.value.frommonth?.month_id ?? '';
        this.spinnerservice.show();
        // this.infiniteScroll.ngOnDestroy();
        // this.infiniteScroll.setup();
        this.drsservice.Audit_summary(glno, this.page, branchcode, transactiondate, status, flag, stage, approvedate, finyear,month).subscribe((results: any) => {
          this.spinnerservice.hide();
          let pagedatas = results["data"];
          let datapagination = results["pagination"];
          this.hasnext = datapagination.has_next;
          this.audit_summary_data = this.audit_summary_data.concat(pagedatas);
          return false
          // this.entry=1
          // this.infiniteScroll.ngOnDestroy();
    
    
    
    
        });
        // return false;
  

      // }
     
    // }
    // let set= 1
   
  }

  Transaction_modal() {

  }
  Value_modal() {

  }

  // let selecteddatas= [];
  glErrors = [];
branchErrors = []; 
debit =[];

  selecteddatas = [];
  Submit(rowdata) {

const rows = this.newrowadd.get('rows_value') as FormArray;
this.glErrors = []; 
this.branchErrors = []; 
this.debit =[];

rows.controls.forEach((row, index) => {
  const glValue = row.get('audict_Gl_no')?.value;  
  const branch_value = row.get('audict_Bra_code')?.value;
  const alei = row.get('audict_Alei')?.value;
if(!branch_value){
  this.branchErrors.push(index)
}
if(!glValue){
  this.glErrors.push(index)
}
if(!alei){
  this.debit.push(index)
}
});
if (this.branchErrors.length > 0) {
  this.Toastr.warning(`Please Select Valid Branch Name at Row: ${this.branchErrors.join(', ')}`);
  return;
}
if (this.glErrors.length > 0) {
  this.Toastr.warning(`Please Select Valid GL Number at Row: ${this.glErrors.join(', ')}`);
  return;
}

if(this.debit.length > 0){
   this.Toastr.warning(`Please Select Valid ALEI Value at Row: ${this.debit.join(', ')}`);
  return;
}


    if (this.debitsum !== 0 || this.creditsum !== 0) {
      if (this.debitsum === this.creditsum) {
        this.indexvalues = this.Checkbox
        for (let index of this.indexvalues) {
          let indexValue = index;
          this.selecteddatas.push(indexValue);
          console.log(this.selecteddatas, "amount")
        }
        this.PARAMS = {
          "data": this.selecteddatas,
          "flag": 1
        }

        this.spinnerservice.show()
        this.drsservice.Audict_submit(this.PARAMS).subscribe((results: any) => {
          this.spinnerservice.hide()
          let data = results["data"]

          this.message_maker = results.message
          if (results.status == "success") {
            this.Toastr.success("Successfully Created")

            this.creditsum = 0
            this.debitsum = 0
            this.selectAllCheckboxControl.reset()
            this.singleCheckboxControl.reset()
            this.i.reset()
            this.newrowadd.reset()
            this.Checkbox = []
            this.summaryshow = true
            const formArray = <FormArray>this.newrowadd.get('rows_value');
            const startindex = 1
            for (let i = formArray.length - 1; i >= startindex; i--) {
              formArray.removeAt(i);
            }
            // this.Audit_search("")
          } else {
            this.Toastr.error('error')
          }


        })
        console.log("Total Debit and Credit amounts are equal.");

      } else {
        this.Toastr.warning("Total Debit and Credit amounts are not equal")
        console.log("Total Debit and Credit amounts are not equal.");
      }

      // } else{
      //   this.Toastr.warning("Please Select The Records")


    } else {
      this.Toastr.warning("Please Select The Records")
    }

  }

  Checkbox = [];
  alei_push = [];
  bra_code_push = [];
  GL_push = [];
  Tdate_push = [];
  Vdate_push = [];
  Tdescrip_push = [];
  amount_push = [];
  dr_cr_push = [];
  stage_push = [];


  Selectvalue(data, item, i) {

    if (item.value.audict_Bra_code === null || item.value.audict_Bra_code === '') {
      this.Toastr.warning("Please Select The Branch Code")
      this.singleCheckboxControl.reset()
      return false
    }
    if (item.value.audict_Gl_no === null || item.value.audict_Gl_no === '') {
      this.Toastr.warning("Please Select The GL Number")
      this.singleCheckboxControl.reset()
      return false
    }
    if (item.value.audict_Alei === null || item.value.audict_Alei === '') {
      this.Toastr.warning("Please Select The ALEI")
      this.singleCheckboxControl.reset()
      return false
    }
    if (item.value.audict_Trans_date === null || item.value.audict_Trans_date === '') {
      this.Toastr.warning("Please Select The Transaction Date")
      this.singleCheckboxControl.reset()
      return false
    }
    if (item.value.audict_value_date === null || item.value.audict_value_date === '') {
      this.Toastr.warning("Please Select The Value Date")
      this.singleCheckboxControl.reset()
      return false
    }
    // if (item.value.audict_trans_desc === null || item.value.audict_trans_desc === '') {
    //   this.Toastr.warning("Please Enter The Description")
    //   this.singleCheckboxControl.reset()
    //   return false
    // }
    if (item.value.audict_Dr_Cr === null || item.value.audict_Dr_Cr === '') {
      this.Toastr.warning("Please Select The Debit / Credit")
      this.singleCheckboxControl.reset()
      return false
    }
    if (item.value.audict_Amount === null || item.value.audict_Amount === '') {
      this.Toastr.warning("Please Enter The Amount")
      this.singleCheckboxControl.reset()
      return false
    }
    // if (this.newrowadd.value.rows_value[0]["audict_stage"] === null || this.newrowadd.value.rows_value[0]["audict_stage"] === '') {
    //   this.Toastr.warning("Please Enter The Stage")
    //   this.singleCheckboxControl.reset()
    //   return false
    // }

    console.log("item", item)
    console.log("index", i)
    this.values = item.value
    this.single= data.checked
    if (this.single == false) {
      this.Selected = false
    }
    if (this.Selected == true) {
      this.Selected = true
    }

    if (this.single == true) {
      const formArray = this.newrowadd.get('rows_value') as FormArray;
      const formGroup = formArray.at(i) as FormGroup;

      formGroup.disable();
      // item.isVisible = false;
      
      this.isButtonDisabled= true

      this.date = this.datepipe.transform(this.values.audict_value_date, 'yyyy-MM-dd')
      console.log("date", this.date)
      this.date1 = this.datepipe.transform(this.values.audict_Trans_date, 'yyyy-MM-dd')
      console.log("date1", this.date1)
      this.key_param = {
        "audict_Alei": this.values.audict_Alei.code,
        "audict_Bra_code": this.values.audict_Bra_code.code,
        "audict_Gl_no": this.values.audict_Gl_no.glno,
        "audict_Trans_date": this.date1,
        "audict_value_date": this.date,
        "audict_trans_desc": this.values.audict_trans_desc,
        "audict_Amount": this.values.audict_Amount,
        "audict_Dr_Cr": this.values.audict_Dr_Cr.id,
        // "audict_stage": this.values.audict_stage
      }
      this.Checkbox.push(this.key_param)
      console.log(this.Checkbox, "Checkbox Selected Data:=>")


      if (item.value.audict_Dr_Cr.name == "Debit") {
        this.debitsum = item.value.audict_Amount + this.debitsum;
        console.log("Debit", this.debitsum)
      } else if (item.value.audict_Dr_Cr.name == "Credit") {
        this.creditsum = item.value.audict_Amount + this.creditsum;
        console.log("Credit", this.creditsum)
      }
    }
    if (this.single == false) {

      const formArray = this.newrowadd.get('rows_value') as FormArray;
      const formGroup = formArray.at(i) as FormGroup;


      formGroup.enable();
      this.isButtonDisabled = false
      this.Dr_CRs_edit = false
      this.Description_edit = false
      this.isDatepickerDisabled = false
      this.isDatepicker2Disabled = false
      this.Alei_edit = false
      this.Gl_edit = false
      this.branch_cod_edit = false
      if (item.value.audict_Dr_Cr.name == "Debit") {
        this.debitsum = this.debitsum - item.value.audict_Amount;

      } else if (item.value.audict_Dr_Cr.name == "Credit") {
        this.creditsum = this.creditsum - item.value.audict_Amount;

      }

      this.Checkbox = this.Checkbox.filter(check => {
        return (
          check.audict_Alei !== item.value.audict_Alei.code ||
          check.audict_Bra_code !== item.value.audict_Bra_code.code ||
          check.audict_Gl_no !== item.value.audict_Gl_no.glno ||
          check.audict_Trans_date !== this.date1 ||
          check.audict_value_date !== this.date ||
          check.audict_Dr_Cr !== item.value.audict_Dr_Cr.id ||
          check.audict_Amount !== item.value.audict_Amount
        );
      });

      // const indexToRemove = this.Checkbox.indexOf(i);
      // if (indexToRemove !== -1) {
      //   this.Checkbox.splice(i, 1);
      //   console.log("removed from checker:", this.Checkbox)
      // } else {
      //   this.Checkbox.splice(i, 1);
      //   console.log("removed from maker:", this.Checkbox)

      // }
    }

  }

  formGroupValues=[]

  AllSelectvalue_Maker_approver(app, add) {
    if (this.newrowadd.value.rows_value[0]["audict_Bra_code"] === null || this.newrowadd.value.rows_value[0]["audict_Bra_code"] === '') {
      this.Toastr.warning("Please Select The Branch Code")
      this.selectAllCheckboxControl.reset()
      return false
    }
    if (this.newrowadd.value.rows_value[0]["audict_Gl_no"] === null || this.newrowadd.value.rows_value[0]["audict_Gl_no"] === '') {
      this.Toastr.warning("Please Select The GL Number")
      this.selectAllCheckboxControl.reset()
      return false
    }
    if (this.newrowadd.value.rows_value[0]["audict_Alei"] === null || this.newrowadd.value.rows_value[0]["audict_Alei"] === '') {
      this.Toastr.warning("Please Select The ALEI")
      this.selectAllCheckboxControl.reset()
      return false
    }
    if (this.newrowadd.value.rows_value[0]["audict_Trans_date"] === null || this.newrowadd.value.rows_value[0]["audict_Trans_date"] === '') {
      this.Toastr.warning("Please Select The Transaction Date")
      this.selectAllCheckboxControl.reset()
      return false
    }
    if (this.newrowadd.value.rows_value[0]["audict_value_date"] === null || this.newrowadd.value.rows_value[0]["audict_value_date"] === '') {
      this.Toastr.warning("Please Select The Value Date")
      this.selectAllCheckboxControl.reset()
      return false
    }
    // if (this.newrowadd.value.rows_value[0]["audict_trans_desc"] === null || this.newrowadd.value.rows_value[0]["audict_trans_desc"] === '') {
    //   this.Toastr.warning("Please Enter The Description")
    //   this.selectAllCheckboxControl.reset()
    //   return false
    // }
    if (this.newrowadd.value.rows_value[0]["audict_Dr_Cr"] === null || this.newrowadd.value.rows_value[0]["audict_Dr_Cr"] === '') {
      this.Toastr.warning("Please Select The Debit / Credit")
      this.selectAllCheckboxControl.reset()
      return false
    }
    if (this.newrowadd.value.rows_value[0]["audict_Amount"] === null || this.newrowadd.value.rows_value[0]["audict_Amount"] === '') {
      this.Toastr.warning("Please Enter The Amount")
      this.selectAllCheckboxControl.reset()
      return false
    }
    // if (this.newrowadd.value.rows_value[0]["audict_stage"] === null || this.newrowadd.value.rows_value[0]["audict_stage"] === '') {
    //   this.Toastr.warning("Please Enter The Stage")
    //   this.selectAllCheckboxControl.reset()
    //   return false
    // }
    // console.log("Formarray=>", this.newrowadd.value.rows_value)
    if (app.checked == true) {
      this.debitsum = 0
      this.creditsum = 0
    }
    this.Checkbox = []   
    this.Allselectmaker = app.checked
   
    if (app.checked == true) {
      this.formGroupValues= []

      const formArray = this.newrowadd.get('rows_value') as FormArray;
      formArray.controls.forEach((formGroup: FormGroup) => {
        formGroup.disable();
        this.isButtonDisabled = true
      });

      const formArrays = this.newrowadd.get('rows_value') as FormArray;
      formArrays.controls.forEach((formGroup: FormGroup) => {
          this.formGroupValues.push(formGroup.value);
          console.log("Formgroupvalues:",this.formGroupValues)
      });
  
      this.Dr_CRs_edit = true
      this.Description_edit = true
      this.isDatepickerDisabled = true
      this.isDatepicker2Disabled = true
      this.Alei_edit = true
      this.Gl_edit = true
      this.branch_cod_edit = true
      this.Selected = true
      for (let sumdata of this.formGroupValues) {
        this.All_data = sumdata
        console.log("All_data", this.All_data)
        this.dateall = this.datepipe.transform(this.All_data.audict_value_date, 'yyyy-MM-dd')
        console.log("date", this.date)
        this.date1all = this.datepipe.transform(this.All_data.audict_Trans_date, 'yyyy-MM-dd')
        console.log("date1", this.date1)
        this.key_params = {
          "audict_Alei": this.All_data.audict_Alei.code,
          "audict_Bra_code": this.All_data.audict_Bra_code.code,
          "audict_Gl_no": this.All_data.audict_Gl_no.glno,
          "audict_Trans_date": this.date1all,
          "audict_value_date": this.dateall,
          "audict_trans_desc": this.All_data.audict_trans_desc,
          "audict_Amount": this.All_data.audict_Amount,
          "audict_Dr_Cr": this.All_data.audict_Dr_Cr.id,
        }
        this.Checkbox.push(this.key_params)
        console.log("this.sumary_id", this.Checkbox)

        if (this.All_data.audict_Dr_Cr.id == "1") {
          this.debitsum = this.All_data.audict_Amount + this.debitsum;
          console.log("Debit true", this.debitsum)
        } else if (this.All_data.audict_Dr_Cr.id == "2") {
          this.creditsum = this.All_data.audict_Amount + this.creditsum;
          console.log("Credit true", this.creditsum)
        }
      }
    }
    if (app.checked == false) {
      const formArray = this.newrowadd.get('rows_value') as FormArray;
      formArray.controls.forEach((formGroup: FormGroup) => {
        formGroup.enable();
        this.isButtonDisabled = false
      });
      this.Dr_CRs_edit = false
      this.Description_edit = false
      this.isDatepickerDisabled = false
      this.isDatepicker2Disabled = false
      this.Alei_edit = false
      this.Gl_edit = false
      this.branch_cod_edit = false
      this.Selected = false
      for (let sumdata of this.formGroupValues) {
        this.All_data = sumdata
        if (this.All_data.audict_Dr_Cr.id == "1") {
          this.debitsum = this.debitsum - this.All_data.audict_Amount;
          console.log("Debit", this.debitsum)
        } else if (this.All_data.audict_Dr_Cr.id == "2") {
          this.creditsum = this.creditsum - this.All_data.audict_Amount;
          console.log("Credit", this.creditsum)
        }
        const indexToRemoveChecker = this.Checkbox.indexOf(this.All_data);
        if (indexToRemoveChecker !== -1) {
          this.Checkbox.splice(indexToRemoveChecker, 1);
          console.log("removed from Maker Allselect:", this.Checkbox)
        } else {
          this.Checkbox.splice(indexToRemoveChecker, 1);
          console.log("removed from checker:", this.Checkbox)
        }

      }
     
    }

  }


  selectedMonthYear: string = null; 

Selectvalue_Checker_approver(even, Audit,index) {
  this.selectedMonthYears=null
  console.log("Audit", Audit);
  this.checker = Audit;
  this.checker_id = this.checker.id;

    if (even.checked == false) {
      this.Selected = false
    }

    if (this.Selected == true) {
      this.Selected = true

    }
  if (this.permission == "Approver" && this.Approved_status == true) {

     const valueDate = new Date(this.checker.valuedate); 
  const monthYear = valueDate.getFullYear() + "-" + (valueDate.getMonth() + 1); 

  if (even.checked === true) {
    if(this.id?.length ===0){
      this.selectedMonthYear = null
    }
    if (!this.selectedMonthYear) {
      this.selectedMonthYear = monthYear;
    }
 if (this.selectedMonthYear === monthYear) {
      // this.Selected = true;
      // this.id.push(this.checker_id);
      if (even.checked == true) {
      this.id.push(this.checker_id)
      console.log("Checker Data Select Id:", this.id)
      if (this.checker.drcr.id == "1" ||  this.checker.drcr.id == 1) {
        this.debitChecker = this.checker.audit_amount + this.debitChecker;
        console.log("Debit", this.debitChecker)
      } else if (this.checker.drcr.id == "2" || this.checker.drcr.id == 2) {
        this.creditChecker = this.checker.audit_amount + this.creditChecker;
        console.log("Credit", this.creditChecker)
      }

    }
    } else {
      even.checked = false;      
      
   
    this.singleCheckbox_for_checker_approver.setValue(false)
    this.debitChecker=0
    this.creditChecker=0
    this.id=[]
    this.selectedMonthYear=null
    this.Toastr.warning("You can only select records from the same month");
    return
    }
  }  
   if (even.checked == false) {
      if (this.checker.drcr.id == "1" || this.checker.drcr.id == 1) {
        this.debitChecker = this.debitChecker - this.checker.audit_amount;

      } else if (this.checker.drcr.id == "2" || this.checker.drcr.id == 2) {
        this.creditChecker = this.creditChecker - this.checker.audit_amount;

      }

      
      const indexToRemoveChecker = this.id.indexOf(this.checker);
      if (indexToRemoveChecker !== -1) {
        this.id.splice(indexToRemoveChecker, 1);
        console.log("removed from checker:", this.id)
      } else {
        this.id.splice(indexToRemoveChecker, 1);
        console.log("removed from checker:", this.id)
      }
    }          
        }else{
       if (even.checked == true) {

      this.id.push(this.checker_id)
      console.log("Checker Data Select Id:", this.id)
      if (this.checker.drcr.id == "1" || this.checker.drcr.id == 1) {
        this.debitChecker = this.checker.audit_amount + this.debitChecker;
        console.log("Debit", this.debitChecker)
      } else if (this.checker.drcr.id == "2" || this.checker.drcr.id == 2) {
        this.creditChecker = this.checker.audit_amount + this.creditChecker;
        console.log("Credit", this.creditChecker)
      }

    }
    if (even.checked == false) {
      if (this.checker.drcr.id == "1" || this.checker.drcr.id == 1) {
        this.debitChecker = this.debitChecker - this.checker.audit_amount;

      } else if (this.checker.drcr.id == "2" || this.checker.drcr.id == 2) {
        this.creditChecker = this.creditChecker - this.checker.audit_amount;

      }
      
      const indexToRemoveChecker = this.id.indexOf(this.checker);
      if (indexToRemoveChecker !== -1) {
        this.id.splice(indexToRemoveChecker, 1);
        console.log("removed from checker:", this.id)
      } else {
        this.id.splice(indexToRemoveChecker, 1);
        console.log("removed from checker:", this.id)
      }

    }
        }
  }

  sumary_id = []
selectedMonthYears = null;

  AllSelectvalue_Checker_approver(check) {
    this.selectedMonthYear=null
    if (check.checked == true) {
      this.debitChecker = 0
      this.creditChecker = 0     
    }

    this.id = []

    this.Allselectchecker = check.checked
    this.audit_summary_data.forEach(item => item.selected = this.Allselectchecker);
    console.log("Checker Select All checker Datas ", this.audit_summary_data)
if (this.permission == "Approver" && this.Approved_status == true) {
  //  if (check.checked == true) {
  //     this.Selected = true

  //     for (let sumdata of this.audit_summary_data) {
  //       this.All_data = sumdata
  //       console.log("All_data", this.All_data)
  //       this.id.push(this.All_data.id)
  //       console.log("this.sumary_id", this.id)


  //       if (this.All_data.drcr.id == "1") {
  //         this.debitChecker = this.All_data.audit_amount + this.debitChecker;
  //         console.log("Debit", this.debitChecker)
  //       } else if (this.All_data.drcr.id == "2") {
  //         this.creditChecker = this.All_data.audit_amount + this.creditChecker;
  //         console.log("Credit", this.creditChecker)
  //       }
  //     }

  //   }
  //   if (check.checked == false) {
  //     this.Selected = false
  //     for (let sumdata of this.audit_summary_data) {
  //       this.All_data = sumdata
  //       if (this.All_data.drcr.id == "1") {
  //         this.debitChecker = this.debitChecker - this.All_data.audit_amount;
  //         console.log("Debit", this.debitChecker)
  //       } else if (this.All_data.drcr.id == "2") {
  //         this.creditChecker = this.creditChecker - this.All_data.audit_amount;
  //         console.log("Credit", this.creditChecker)
  //       }

  //     }
  //   }
  if (check.checked) {
      const monthYears = this.audit_summary_data.map(item => {
        const valueDate = new Date(item.valuedate);
        return valueDate.getFullYear() + "-" + (valueDate.getMonth() + 1);
      });

      const uniqueMonths = [...new Set(monthYears)];

      if (uniqueMonths.length > 1) {
        this.Selected = false;
        this.Allselectchecker = false;
        this.audit_summary_data.forEach(item => (item.selected = false));
        this.id=[]
        this.creditChecker=0
        this.debitChecker=0
        this.singleCheckbox_for_checker_approver.setValue(false)
        this.selectAllCheckboxControl.setValue(false)
        this.selectedMonthYear = null;
        this.Toastr.warning("You can only select records from the same month");
        return;
      } else {
        this.selectedMonthYears = uniqueMonths[0];
        this.audit_summary_data.forEach(item => {
          item.selected = true;
          this.id.push(item.id);

          if (item.drcr.id === "1" || item.drcr.id === 1) {
            this.debitChecker = item.audit_amount + this.debitChecker;
          } else if (item.drcr.id === "2" || item.drcr.id === 2) {
            this.creditChecker  = item.audit_amount + this.creditChecker;
          }
        });
      }
    } else {
      this.Selected = false
      this.audit_summary_data.forEach(item => (item.selected = false));
      this.selectedMonthYear = null;
      this.id = [];
      
      for (let sumdata of this.audit_summary_data) {
        this.All_data = sumdata
        if (this.All_data.drcr.id == "1" || this.All_data.drcr.id == 1) {
          this.debitChecker = this.debitChecker - this.All_data.audit_amount;
          console.log("Debit", this.debitChecker)
        } else if (this.All_data.drcr.id == "2" || this.All_data.drcr.id == 2) {
          this.creditChecker = this.creditChecker - this.All_data.audit_amount;
          console.log("Credit", this.creditChecker)
        }

      }
      this.debitChecker = 0;
      this.creditChecker = 0;
    }
}else{
    if (check.checked == true) {
      this.Selected = true

      for (let sumdata of this.audit_summary_data) {
        this.All_data = sumdata
        console.log("All_data", this.All_data)
        this.id.push(this.All_data.id)
        console.log("this.sumary_id", this.id)


        if (this.All_data.drcr.id == "1" || this.All_data.drcr.id == 1) {
          this.debitChecker = this.All_data.audit_amount + this.debitChecker;
          console.log("Debit", this.debitChecker)
        } else if (this.All_data.drcr.id == "2" || this.All_data.drcr.id == 2) {
          this.creditChecker = this.All_data.audit_amount + this.creditChecker;
          console.log("Credit", this.creditChecker)
        }
      }

    }
    if (check.checked == false) {
      this.Selected = false
      for (let sumdata of this.audit_summary_data) {
        this.All_data = sumdata
        if (this.All_data.drcr.id == "1"|| this.All_data.drcr.id == 1) {
          this.debitChecker = this.debitChecker - this.All_data.audit_amount;
          console.log("Debit", this.debitChecker)
        } else if (this.All_data.drcr.id == "2" || this.All_data.drcr.id == 2) {
          this.creditChecker = this.creditChecker - this.All_data.audit_amount;
          console.log("Credit", this.creditChecker)
        }

      }
    }
  }


  }

  selectedid = []
  Checker_Submit(select) {
   console.log("this.selectedMonthYearsthis.selectedMonthYears",this.selectedMonthYears,"this.selectedMonthYearthis.selectedMonthYearsingle",this.selectedMonthYear)
      if (this.id.length !== 0) {
      if (this.debitChecker === this.creditChecker) {
        if (this.permission == "Checker") {
          this.PARAMS = {
            "ids": this.id,
            "status": 2,
            "finyear": this.Audict_entry_summary.value.Audit_finyear?.finyer ?? '',
          }

        }
        if (this.permission == "Approver") {
          this.PARAMS = {
            "ids": this.id,
            "status": 3,
            "finyear": this.Audict_entry_summary.value.Audit_finyear?.finyer ?? '',
          }

        }
        if (this.permission == "Approver") {
          if (this.Approved_status == true) {
             const value = this.selectedMonthYears?this.selectedMonthYears:this.selectedMonthYear
             const month = value.slice(value.indexOf("-") + 1);
             console.log("month",month); 
            this.PARAMS = {
              "ids": this.id,
              "status": 4,
              "finyear": this.Audict_entry_summary.value.Audit_finyear?.finyer ?? '',
              'month':month
            }
          }
        }
         if (this.permission == "Approver" && select == 'Return') {
            if(this.Audit_return.value.remarks=="" || this.Audit_return.value.remarks == null || this.Audit_return.value.remarks == undefined){
          this.Toastr.warning("Please Enter The Remarks")
          return false;
        }
          this.PARAMS = {
            "ids": this.id,
            "status": 5,
            "remarks":this.Audit_return.value.remarks,
            "finyear": this.Audict_entry_summary.value.Audit_finyear?.finyer ?? '',
          }
        }
      

        this.spinnerservice.show()
        this.drsservice.Checker_data(this.PARAMS).subscribe((results: any) => {
          this.spinnerservice.hide()
          let data = results["data"]
          this.message_checker = results.message
          if (results.status == "success") {
            this.Toastr.success("Successfully Updated")
            this.Audit_return_close.nativeElement.click();  
            this.selectedMonthYear=null;
            this.selectedMonthYears=null;
            this.Audit_search("")
            this.creditChecker = 0
            this.debitChecker = 0
            this.selectAllCheckbox_for_Checker_Approver.reset()
            this.singleCheckbox_for_checker_approver.reset()
            this.id = []
            this.Audit_return.reset()    
          } else {
            this.Toastr.error('error')
          }
        })
        console.log("Total Debit and Credit amounts are equal.");
       
        console.log(this.id, "amount")
      } else {
        this.Toastr.warning("Total Debit and Credit amounts are not equal")
        console.log("Total Debit and Credit amounts are not equal.");

      }

    } else {
      this.Toastr.warning('Please Select Records')
    }

  }


  Audit_edit(Audit, Edit) {
    this.Audit_Edit_submit_btn = true
    this.Evalue = Edit
    let id = Audit.id
    this.EditId = id
    this.spinnerservice.show()
    this.drsservice.Edit_fetch(this.EditId).subscribe(results => {
      this.spinnerservice.hide();
      let data = results
      this.Audit_edits = data


      this.AuditModal.patchValue({
        "Audit_modal_branch": this.Audit_edits.branch_code,
        "Audit_modal_gl": this.Audit_edits.glno,
        "Audit_modal_alei": this.Audit_edits.alei,
        "Audit_modal_tdate": this.Audit_edits.transactiondate,
        "Audit_modal_vdate": this.Audit_edits.valuedate,
        "Audit_modal_Td": this.Audit_edits.transactiondesc,
        "Audit_modal_drcr": this.Audit_edits.drcr,
        "Audit_modal_amount": this.Audit_edits.audit_amount,
        "Audit_modal_stage": this.Audit_edits.stage,
      })
    })
    document.getElementById('exampleModalAudit').classList.add('show')
    const body = document.body;
    const scrollY = body.style.top;
    body.style.position = 'fixed';
    body.style.width = '100%';

  }
  Auditclose() {
    const body = document.body;
    body.style.position = '';
    body.style.top = '';

  }
  Auditclose1() {

  }
  fileupload(evt) {
    this.file = evt.target.files[0];
    console.log("file", this.file)
  }
  fil_upload() {
    if (this.AuditModaldownload.value["documentfile"] === null || this.AuditModaldownload.value["documentfile"] === '') {
      this.Toastr.warning("Please Upload The File")
      return false
    }
    
    let flag = 1
    let stage= ""
    this.spinnerservice.show()
    this.drsservice.doc_upload(this.file, flag, stage).subscribe(results => {
      this.spinnerservice.hide();
      let data = results["data"]
      if (data[0].status == "SUCCESS") {
        this.Toastr.success("", "Successfully Uploaded")
        this.Audit_upload_close.nativeElement.click();
        this.AuditModal.reset()
        this.AuditModaldownload.reset()
        this.file = ""
      }
    })
  }
  upload_clear() {
    this.AuditModaldownload.reset()
    this.Audict_entry_summary.reset()

  }


  audit_update_data() {
    this.audict_Alei_modal = this.AuditModal.controls["Audit_modal_alei"].value
    this.audict_Bra_code_modal = this.AuditModal.controls["Audit_modal_branch"].value
    this.audict_Gl_no_modal = this.AuditModal.controls["Audit_modal_gl"].value
    this.audict_Trans_date_modal = this.AuditModal.controls["Audit_modal_tdate"].value
    this.audict_value_date_modal = this.AuditModal.controls["Audit_modal_vdate"].value
    this.audict_trans_desc_modal = this.AuditModal.controls["Audit_modal_Td"].value
    this.audict_Amount_modal = this.AuditModal.controls["Audit_modal_amount"].value
    this.audict_Dr_Cr_modal = this.AuditModal.controls["Audit_modal_drcr"].value
    this.audict_stage_modal = this.AuditModal.controls["Audit_modal_stage"].value

    this.dateTrans = this.datepipe.transform(this.audict_Trans_date_modal, 'yyyy-MM-dd')
    console.log("date", this.date)
    this.datevalue = this.datepipe.transform(this.audict_value_date_modal, 'yyyy-MM-dd')
    console.log("date1", this.date1)
    if (this.audict_Alei_modal.code == "A" || this.audict_Alei_modal.code == "L" || this.audict_Alei_modal.code == "E" || this.audict_Alei_modal.code == "I") {
      this.Alei_key = this.audict_Alei_modal.code

    } else {
      this.Alei_key = this.audict_Alei_modal.id
    }

    this.Edit_param = {
      "audict_Alei": this.Alei_key,
      "audict_Bra_code": this.audict_Bra_code_modal.code,
      "audict_Gl_no": this.audict_Gl_no_modal.glno.toString(),
      "audict_Trans_date": this.dateTrans,
      "audict_value_date": this.datevalue,
      "audict_trans_desc": this.audict_trans_desc_modal,
      "audict_Amount": this.audict_Amount_modal,
      "audict_Dr_Cr": this.audict_Dr_Cr_modal.id,
      "id": this.EditId
    }
    console.log(this.Edit_param, "Edit")


    if (this.Evalue == 'Edit') {
      this.PARAMS = {
        "data": [this.Edit_param]

      }

    }
    this.spinnerservice.show()
    this.drsservice.Audict_submit(this.PARAMS).subscribe((results: any) => {
      this.spinnerservice.hide()
      let data = results["data"]

      this.message_maker = results.message
      if (results.status == "success") {
        this.Toastr.success("Successfully Updated")
        this.Audit_sum_close.nativeElement.click();        
        this.selectAllCheckboxControl.reset()
        this.singleCheckboxControl.reset()
        this.Audit_search("")
        this.Auditclose()
        this.Checkbox = []
        this.id = []
      } else {
        this.Toastr.error('error')
        this.Auditclose()
      }


    })
  }

  status() {

  }

  Stagedrop() {
    // this.spinnerservice.show()

    let prokeyvalue: String = "";
    this.get_template_stage_drop(prokeyvalue);
    this.Audict_entry_summary.get('stage').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),

        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.drsservice.Stage_drop(value, 1)
          .pipe(
            finalize(() => {
              console.log(value)

            }),
          )
        )
      )
      .subscribe((results: any) => {
        // this.spinnerservice.hide()
        let stage_value = results["data"]
        this.Stage_list_ = stage_value;
        console.log("report_create_dropdown", this.Stage_list_)
        this.isLoading = false
      })

  }

  private get_template_stage_drop(prokeyvalue) {
    // this.spinnerservice.show()
    this.drsservice.Stage_drop(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        // this.spinnerservice.hide()
        let stage_value = results["data"];
        this.Stage_list_ = stage_value;
      })

  }

  autocompleteStageScroll() {
    this.has_nextstage = true
    this.has_previousstage = true
    this.currentpage = 1
    setTimeout(() => {
      if (
        this.matAutocompletestage &&
        this.autocompleteTrigger &&
        this.matAutocompletestage.panel
      ) {
        fromEvent(this.matAutocompletestage.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletestage.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletestage.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletestage.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletestage.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextstage === true) {
                this.drsservice.Stage_drop(this.StageContactInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let stage_value = results["data"];
                    let datapagination = results["pagination"];
                    this.Stage_list_ = this.Stage_list_.concat(stage_value);
                    if (this.Stage_list_.length >= 0) {
                      this.has_nextstage = datapagination.has_next;
                      this.has_previousstage = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  // up_arrow() {
  //   console.log(Event, "event")
  //   this.Arrow = this.Arrow === "1" ? "0" : "1";
  //   this.ArrowDirection = this.Arrow === "1" ? "&#8593;" : "&#8595;";
  //   const targetElement = document.getElementById('boxlevel');
  //   if (this.ArrowDirection!== "&#8595;") {
  //           setTimeout(() => {
  //       const bottomRowIndex = this.audit_summary_data.length-1; 
  //       const bottomElement = document.getElementById('itemRow_' + bottomRowIndex);
  //       // this.renderer.addClass(this.tableElement.nativeElement, 'disable-scroll');
  //       this.Render.removeClass(this.tableElement.nativeElement, 'disable-scroll');

  //       bottomElement?.scrollIntoView({ behavior: 'smooth' });
  //       this.entry= 0
  //       // this.infiniteScroll.setup();
  //       // this.infiniteScroll.ngOnDestroy();
        
  //     }, 100);
      
  //   }else{
  //     targetElement.scrollIntoView({ behavior: 'smooth' });
      
     
  //   }
  // }

  deleteRow(i, items) {
    console.log("Datas to remove after delete", items)
    var delBtn = confirm(" Do you want to delete ?");
    const formArray = <FormArray>this.newrowadd.get('rows_value');
    if (formArray.length > 1) {
      const rows = this.newrowadd.get('rows_value') as FormArray;
      rows.removeAt(i);
      this.Toastr.success("Successfully Deleted")
    } else {
      this.Toastr.warning("Add new row!")
    }

  }

  finyear_dropdown() {
    let prokeyvalue: String = "";
    this.getfinyear(prokeyvalue);
    this.Audict_entry_summary.get('Audit_finyear').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.drsservice.getfinyeardropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.finyearList = datas;
      })

  }

  autocompletefinyearScroll() {
    this.has_nextfinyr = true;
    this.has_previousfinyr = true;
    this.currentpagefinyr = 1;
    setTimeout(() => {
      if (
        this.fin_yearauto &&
        this.autocompleteTrigger &&
        this.fin_yearauto.panel
      ) {
        fromEvent(this.fin_yearauto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.fin_yearauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.fin_yearauto.panel.nativeElement.scrollTop;
            const scrollHeight = this.fin_yearauto.panel.nativeElement.scrollHeight;
            const elementHeight = this.fin_yearauto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextfinyr === true) {
                this.drsservice.getfinyeardropdown(this.finyearInput.nativeElement.value, this.currentpagefinyr + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.finyearList = this.finyearList.concat(datas);
                    if (this.finyearList.length >= 0) {
                      this.has_nextfinyr = datapagination.has_next;
                      this.has_previousfinyr = datapagination.has_previous;
                      this.currentpagefinyr = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  private getfinyear(prokeyvalue) {
    this.drsservice.getfinyeardropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.finyearList = datas;
        console.log(this.finyearList)

      })
  }

  exceldownlode(type){
    if (this.Audict_entry_summary.value["Audit_finyear"] === null || this.Audict_entry_summary.value["Audit_finyear"] === '') {
      this.Toastr.warning("Please Select The Finyear")
      return false
    }
    this.audict_Trans_date_sums = this.datepipe.transform(this.Audict_entry_summary.value.audict_Trans_date_sum, 'yyyy-MM-dd')
    console.log("date", this.audict_Trans_date_sums)
    this.audict_approve_date_sums = this.datepipe.transform(this.Audict_entry_summary.value.audict_Approve_date_sum, 'yyyy-MM-dd')
    console.log("date", this.audict_approve_date_sums)

    // let page = 1
    // this.Exception_data.Exception_Fyear?.finyer?? '';
    // let glnoo = ""
    let glno = this.Audict_entry_summary.value.audict_Gl?.glno ?? '';
    let branchcode = this.Audict_entry_summary.value.audict_branch?.code ?? '';
    let transactiondate = this.audict_Trans_date_sums ? this.audict_Trans_date_sums : "";
    let status = this.Audict_entry_summary.value.audict_status?.id ?? '';
    let flag = 1
    let stage = this.Audict_entry_summary.value.stage?.id ?? '';
    // let stage= 1
    let approvedate = this.audict_approve_date_sums ? this.audict_approve_date_sums : "";
    let finyear = this.Audict_entry_summary.value.Audit_finyear?.finyer ?? '';
   
    this.spinnerservice.show()
    this.drsservice.Screen_download(status, branchcode,transactiondate,stage,approvedate,flag,finyear,glno).subscribe((results: any) => {
      this.spinnerservice.hide()
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = "Audit Entry.xlsx";
      link.click();
      this.Toastr.success('Successfully Download');
    });

  }

  Stage_last(){
    if (this.Audict_entry_summary.value["Audit_finyear"] === null || this.Audict_entry_summary.value["Audit_finyear"] === '') {
      // this.Toastr.warning("Please Select The Finyear")/
      return false
    }
    let page=1
    let flag=2
    // let Entry=1
    // let finyear= 
    let finyear = this.Audict_entry_summary.value.Audit_finyear?.finyer ?? '';
    let month = this.Audict_entry_summary.value.frommonth?.month_id ?? '';
    this.drsservice.Stage_end(page,flag,finyear,month).subscribe((results: any) => {
      let Sta_datas = results["data"][0];
      this.Stage_List = Sta_datas;
      console.log("Stage=>",this.Stage_List)

    })
   
  }

  finyear_clear(){
    if(typeof this.Audict_entry_summary.controls['stage'].value ==='object'){
      this.Audict_entry_summary.controls['stage'].reset('')
    }
    if(typeof this.Audict_entry_summary.controls['audict_branch'].value ==='object'){
      this.Audict_entry_summary.controls['audict_branch'].reset('')
    }
    if(typeof this.Audict_entry_summary.controls['audict_Gl'].value ==='object'){
      this.Audict_entry_summary.controls['audict_Gl'].reset('')
    }     
    if(typeof this.Audict_entry_summary.controls['audict_status'].value ==='object'){
      this.Audict_entry_summary.controls['audict_status'].reset('')
    }   

    this.Audict_entry_summary.controls['audict_Trans_date_sum'].reset('')
    this.Audict_entry_summary.controls['audict_Approve_date_sum'].reset('')

  }

  branch_clear(){
    if(typeof this.Audict_entry_summary.controls['stage'].value ==='object'){
      this.Audict_entry_summary.controls['stage'].reset('')
    }
    if(typeof this.Audict_entry_summary.controls['audict_Gl'].value ==='object'){
      this.Audict_entry_summary.controls['audict_Gl'].reset('')
    }     
    if(typeof this.Audict_entry_summary.controls['audict_status'].value ==='object'){
      this.Audict_entry_summary.controls['audict_status'].reset('')
    }  
    this.Audict_entry_summary.controls['audict_Trans_date_sum'].reset('')


  }

Audit_view(data){
this.Audit_return.patchValue({
  remarks:data.remarks
})
}
audit_file_down(){
   this.spinnerservice.show()
    this.drsservice.audit_template_download().subscribe((results: any) => {
      this.spinnerservice.hide()
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = "Audit Template.xlsx";
      link.click();
      this.Toastr.success('Successfully Download');
    });
}

}






