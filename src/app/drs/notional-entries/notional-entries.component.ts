import { Component, OnInit, ViewChild, ElementRef, LOCALE_ID} from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map, debounce, skip } from 'rxjs/operators';
import { DrsService } from '../drs.service';
import { DatePipe, formatDate } from '@angular/common';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { MatCheckbox } from '@angular/material/checkbox';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
// import { registerLocaleData } from '@angular/common';
// import localeEnIN from '@angular/common/locales/en-IN';
import { SharedDrsService } from '../shared-drs.service';
// import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
// import { ViewportRuler } from '@angular/cdk/scrolling';
// import { UiScrollModule } from 'ngx-ui-scroll';
// import { InfiniteScrollModule } from 'ngx-infinite-scroll';




export interface drs {
  finyer: string;
  gl_no: string;
  name: string;
  code: string;
  id: number;
  glno: string;
  stage: any;
  // type: number;
}


@Component({
  selector: 'app-notional-entries',
  templateUrl: './notional-entries.component.html',
  styleUrls: ['./notional-entries.component.scss'],
  providers: [DatePipe,
    { provide: LOCALE_ID, useValue: 'en-IN' }
  ]
})
export class NotionalEntriesComponent implements OnInit {
  infiniteScroll: InfiniteScrollDirective;
  // Arrow: number;
  Stage_list_create: any;
  currentpages: any;
  has_nextstages: any;
  has_previousstages: boolean;
  arrdate1: any[];
  Stage_List: any;
  isButtonDisableds: boolean;
  isCheckboxDisabledcheck: boolean= false;
  stages: any;
  Stagegroup: FormGroup;
  stagesup: any;
  scroll: number;
  search_down: boolean;
  remove: any[];



  @ViewChild(InfiniteScrollDirective)  set appScroll(directive: InfiniteScrollDirective) {    this.infiniteScroll = directive;  }


  @ViewChild('fin_year') fin_yearauto: MatAutocomplete
  @ViewChild('finyearInput') finyearInput: any;

  @ViewChild('StageContactInput') StageContactInput: any;
  @ViewChild('stagesum') matAutocompletestage: MatAutocomplete;

  @ViewChild('StagecreateContactInput') StagecreateContactInput: any;
  @ViewChild('stagesumcreate') matAutocompletestagecreate: MatAutocomplete;

  @ViewChild('Notional_sum_close') Notional_sum_close: ElementRef;
  @ViewChild('Audit_upload_close') Audit_upload_close: ElementRef;

  @ViewChild('branchSumContactInput') branchSumContactInput: any;
  @ViewChild('branchsum') matAutocompletebrasum: MatAutocomplete;

  @ViewChild('GLsumContactInput') GLsumContactInput: any;
  @ViewChild('GLNumbersum') matAutocompleteGLsum: MatAutocomplete;

  // @ViewChild('GLsumContactInput') GLsumContactInput: any;
  // @ViewChild('targetElement') matAutocompletetarget: MatAutocomplete;

  @ViewChild('branchContactInput') branchContactInput: any;
  @ViewChild('branch') matAutocompletebrach: MatAutocomplete;

  @ViewChild('GLContactInput') GLContactInput: any;
  @ViewChild('GLNumber') matAutocompleteGL: MatAutocomplete;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('checkbox') checkbox: MatCheckbox;

  @ViewChild('branchmodalContactInput') branchmodalContactInput: any;
  @ViewChild('branchmodal') matAutocompletebramodal: MatAutocomplete;

  @ViewChild('GLmodalContactInput') GLmodalContactInput: any;
  @ViewChild('GLNumbermodal') matAutocompleteGLmodal: MatAutocomplete;





  singleCheckboxControl = new FormControl(false);
  selectAllCheckboxControl = new FormControl(false);

  singleCheckbox_for_checker_approver = new FormControl(false);
  selectAllCheckbox_for_Checker_Approver = new FormControl(false);

  Notional_entry_summary: FormGroup;
  isLoading: boolean;
  finyearList: any;
  has_nextfinyr: boolean;
  has_previousfinyr: boolean;
  currentpagefinyr: number;
  brasum_list_sum: any;
  has_nextbrasum: any;
  has_previousbrasum: any;
  currentpagebrasum: any;
  has_nextFinsum: boolean;
  has_previousFinsum: boolean;
  currentpageFinsum: number;
  glsum_list1: any;
  creditsum = 0;
  debitsum = 0;
  creditChecker = 0;
  debitChecker = 0;
  summaryshow: boolean;
  newrowadd: FormGroup;
  i: FormGroup;
  // Checkbox: any[];
  notional_Trans_date_sums: any;
  page: number;
  permission: any;
  employee_permission: boolean;
  notional_summary_data: any;
  hasnext: any;
  hasprevious: any;
  presentpage: any;
  data_notional_found: boolean;
  Approved_status: boolean;
  employee_permission_checker: boolean;
  employee_permission_checkers: boolean;
  Stage_freeze: boolean;
  Edit_permission: boolean;
  upload_maker: boolean;
  Audit_checked: boolean;
  Approver_status: boolean;
  branchList: any;
  has_nextbra: any;
  has_previousbra: any;
  currentpagebra: any;
  GL_List: any;
  has_nextGl: boolean;
  has_previousGl: boolean;
  currentpageGl: number;
  Alei_Value: any;
  Dr_CRs_edit: boolean;
  Description_edit: boolean;
  isDatepickerDisabled: boolean;
  isDatepicker2Disabled: boolean;
  Alei_edit: boolean;
  Gl_edit: boolean;
  branch_cod_edit: boolean;
  isButtonDisabled: boolean;
  key_param: { audict_Alei: any; audict_Bra_code: any; audict_Gl_no: any; audict_Trans_date: any; audict_value_date: any; audict_trans_desc: any; audict_Amount: any; audict_Dr_Cr: any; };
  date: string;
  date1: string;
  values: any;
  Selected: boolean;
  All_data_Add: any;
  Allselectmaker: any;
  All_data: any;
  dateall: string;
  date1all: string;
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
  key_params: { audict_Alei: any; audict_Bra_code: any; audict_Gl_no: any; audict_Trans_date: any; audict_value_date: any; audict_trans_desc: any; audict_Amount: any; audict_Dr_Cr: any; };
  Allselectchecker: any;
  id = [];
  message_checker: any;
  // PARAMS: { ids: any[]; status: number; finyear: any; };
  PARAMS: {};
  checker: any;
  checker_id: any;
  indexvalues: any[];
  message_maker: any;
  brasum_list_modal: any;
  has_nextbra_modal: any;
  currentpagebra_modal: any;
  has_previousbra_modal: any;
  has_nextFinModal: any;
  has_previousFinModal: any;
  currentpageFinModal: any;
  glmodal_list1: any;
  AuditModal: FormGroup;
  Edit_param: { audict_Alei: any; audict_Bra_code: any; audict_Gl_no: any; audict_Trans_date: any; audict_value_date: any; audict_trans_desc: any; audict_Amount: any; audict_Dr_Cr: any; id: any };
  audict_Alei_modal: any;
  audict_Bra_code_modal: any;
  audict_Gl_no_modal: any;
  audict_Trans_date_modal: any;
  audict_value_date_modal: any;
  audict_trans_desc_modal: any;
  audict_Amount_modal: any;
  audict_stage_modal: any;
  audict_Dr_Cr_modal: any;
  dateTrans: string;
  datevalue: string;
  Alei_key: any;
  // Audit_edits: Object;
  Audit_Edit_submit_btn: boolean;
  Evalue: any;
  EditId: any;
  AuditModaldownload: FormGroup;
  endDate: Date;
  file: any;
  Audit_edits: any;
  audict_Trans_date_sums: string;
  Stage_list_: any;
  has_nextstage: boolean;
  has_previousstage: boolean;
  currentpage: number;
  notional_approve_date_sums: string;
  has_previous: boolean;
  Arrow: string = "1";
  ArrowDirection: string = "&#8595;";



  // branchContactInput: any;


  constructor(private drsservices: SharedDrsService, private fb: FormBuilder, private Toastr: ToastrService, private drsservice: DrsService, private spinnerservice: NgxSpinnerService, public datepipe: DatePipe) {

    this.selectAllCheckboxControl.valueChanges.subscribe(checked => {
      this.singleCheckboxControl.setValue(checked);
    });

    this.selectAllCheckbox_for_Checker_Approver.valueChanges.subscribe(checked => {
      this.singleCheckbox_for_checker_approver.setValue(checked);
    });
  }

  ngOnInit(): void {

    document.getElementById("mySidenav").style.width = "200px";
    document.getElementById("main").style.marginLeft = "12rem";
    this.drsservices.isSideNav = false;

    this.summaryshow = true 
    const currentDate = new Date();
    this.endDate = new Date(currentDate.getTime() - 0 * 24 * 60 * 60 * 1000);


    this.Notional_entry_summary = this.fb.group({
      notional_branch: '',
      notional_Gl: '',
      notional_Trans_date_sum: '',
      audict_Approve_date_sum: '',
      notional_status: '',
      stage: '',
      notional_finyear: '',
      // selectAllCheckbox_for_Checker_Approver: '',
      // singleCheckbox_for_checker_approver: ''
    })
    this.Stagegroup= this.fb.group({
      stage_create: '',
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
      // stage_create: '',
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
      Stage_upload: '',
    })

    this.newrowadd = this.fb.group({
      rows_value: new FormArray([
        this.createItemFormGroup()
      ])
    })

    this.newrowadd.get('rows_value').valueChanges.subscribe(values => {
      console.log("values", values);
    });

    // this.Notional_search("")
    
    this.isButtonDisableds= true
  }

  public displayfnfinyear(fin_year?: drs): string | undefined {
    return fin_year ? fin_year.finyer : undefined;
  }

  public displayfnbranchsum(audict_branch?: drs): string | undefined {
    return audict_branch ? audict_branch.name + "-" + audict_branch.code : undefined;
  }

  public displayGLsum(audict_Gl?: drs): string | undefined {
    return audict_Gl ? audict_Gl.glno : undefined;
  }

  public Status_display(audict_status?: drs): string | undefined {
    return audict_status ? audict_status.name : undefined;
  }

  public displayfnbranch(audict_Bra_code?: drs): string | undefined {
    return audict_Bra_code ? audict_Bra_code.name + "-" + audict_Bra_code.code : undefined;
  }

  public displayGL(audict_Gl_no?: drs): string | undefined {
    return audict_Gl_no ? audict_Gl_no.glno : undefined;
  }

  public ALEI_display(audict_Alei?: drs): string | undefined {
    return audict_Alei ? audict_Alei.name : undefined;
  }

  public DR_CR_display(audict_Dr_Cr?: drs): string | undefined {
    return audict_Dr_Cr ? audict_Dr_Cr.name : undefined;
  }

  public displayfnbranchmodal(Audit_modal_branch?: drs): string | undefined {
    return Audit_modal_branch ? Audit_modal_branch.code : undefined;
  }

  public displaystage(stage?: drs): string | undefined {
    return stage ? stage.name  : undefined;
  }

  public displayGLmodal(glnum?:drs): string | undefined {
    return glnum ? glnum.glno  : undefined;
  }
  public ALEI_modal_display(alei?: drs): string | undefined {
    return alei ? alei.name  : undefined;
  }

  public DR_CR_Modal_display(dc?: drs): string | undefined {
    return dc ? dc.name  : undefined;
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
      // stage_create: new FormControl(''),
      // audict_stage: new FormControl(''),
      singleCheckboxControl: new FormControl(''),
      selectAllCheckboxControl: new FormControl('')
    })
    return fg
  }


  finyear_dropdown() {
    let prokeyvalue: String = "";
    this.getfinyear(prokeyvalue);
    this.Notional_entry_summary.get('notional_finyear').valueChanges
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

  Branch_fun_sum() {
    // this.spinnerservice.show()

    let prokeyvalue: String = "";
    this.getaudict_brasum_drop(prokeyvalue);
    this.Notional_entry_summary.get('notional_branch').valueChanges
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
    this.spinnerservice.show()
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

  GL_fun_sum() {
    // this.spinnerservice.show()

    let prokeyvalue: String = "";
    this.getaudict_glsum_drop(prokeyvalue);
    this.Notional_entry_summary.get('notional_Gl').valueChanges
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
        this.spinnerservice.hide()
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

  status() {

  }

  Notional_search(Notional_data) {
    if (this.Notional_entry_summary.value["notional_finyear"] === null || this.Notional_entry_summary.value["notional_finyear"] === '') {
      this.Toastr.warning("Please Select The Finyear")
      return false
    }
    this.page = 1;
    this.selectAllCheckbox_for_Checker_Approver.reset()
    this.singleCheckbox_for_checker_approver.reset()
    this.debitChecker = 0
    this.creditChecker = 0
    let Audit_form_data = Notional_data
    this.notional_Trans_date_sums = this.datepipe.transform(this.Notional_entry_summary.value.notional_Trans_date_sum, 'yyyy-MM-dd')
    console.log("date", this.notional_Trans_date_sums)
    this.notional_approve_date_sums = this.datepipe.transform(this.Notional_entry_summary.value.audict_Approve_date_sum, 'yyyy-MM-dd')
    console.log("date", this.notional_approve_date_sums)
    // let page = 1
    // this.Exception_data.Exception_Fyear?.finyer?? '';
    // let glnoo = ""
    let glno = this.Notional_entry_summary.value.notional_Gl?.glno ?? '';
    let branchcode = this.Notional_entry_summary.value.notional_branch?.code ?? '';
    let transactiondate = this.notional_Trans_date_sums ? this.notional_Trans_date_sums : "";
    let status = this.Notional_entry_summary.value.audict_status?.id ?? '';
    let flag = 2;
    let stage= this.Notional_entry_summary.value.stage?.id?? '';
    // let stage = 1
    let approvedate = this.notional_approve_date_sums ? this.notional_approve_date_sums : "";
    let finyear = this.Notional_entry_summary.value.notional_finyear?.finyer ?? '';
    // let status = 1
    this.spinnerservice.show()
    this.drsservice.Notional_summary(glno, this.page, branchcode, transactiondate, status, flag, stage, approvedate, finyear).subscribe((results: any) => {
      this.spinnerservice.hide()
      let data = results["data"];
      this.notional_summary_data = data;
      this.permission = results["employee_permission"];
      this.Audit_checked = true
      let datapagination = results["pagination"];
      if (this.notional_summary_data?.length > 0) {
        this.hasnext = datapagination.has_next;
        this.hasprevious = datapagination.has_previous;
        this.presentpage = datapagination.index;
        this.data_notional_found = true;
        this.isButtonDisableds= false
      }
      if (this.notional_summary_data?.length == 0) {
        this.hasnext = false;
        this.hasprevious = false;
        this.presentpage = 1;
        this.data_notional_found = false;
        this.isButtonDisableds= true
      }

      if(this.search_down== true){
        if(this.page == 1){
          this.infiniteScroll.ngOnDestroy();
          this.infiniteScroll.setup();
          return false  
        }
      }
      // this.infiniteScroll.ngOnDestroy();
      // this.infiniteScroll.setup();
      // this.infiniteScroll.setup();[]
      

    })
    this.Stage_last()
    // this.infiniteScroll.setup();



  }

  Notional_clear() {
    // this.Checkbox = []
   
    this.Notional_entry_summary.reset()    
    this.selectAllCheckbox_for_Checker_Approver.reset()
    this.singleCheckbox_for_checker_approver.reset()
    this.Checkbox = []
    this.id = []
    this.debitChecker = 0
    this.creditChecker = 0
    // this.Notional_search("")    

  }

  upload_notional() {
    this.AuditModaldownload.reset()
    this.Notional_entry_summary.reset()
    // this.Notional_search("")
  }

  

  onScroll() {
    // this.infiniteScroll.setup();
    this.scroll=1  
    this.Checkbox = []
    this.id = []
    this.debitChecker = 0
    this.creditChecker = 0
    this.selectAllCheckbox_for_Checker_Approver.reset()
    this.singleCheckbox_for_checker_approver.reset()
    this.notional_Trans_date_sums = this.datepipe.transform(this.Notional_entry_summary.value.audict_Trans_date_sum, 'yyyy-MM-dd')
    console.log("date", this.notional_Trans_date_sums)
    this.notional_approve_date_sums = this.datepipe.transform(this.Notional_entry_summary.value.audict_Approve_date_sum, 'yyyy-MM-dd')
    console.log("date", this.notional_approve_date_sums)
    let glno = this.Notional_entry_summary.value.notional_Gl?.glno ?? '';
    let status = this.Notional_entry_summary.value.notional_status?.id ?? '';
    let branchcode = this.Notional_entry_summary.value.notional_branch?.code ?? '';
    let transactiondate = this.notional_Trans_date_sums ? this.notional_Trans_date_sums : "";
    let flag = 2;
    let stage= this.Notional_entry_summary.value.stage?.id?? '';
    // let stage = 1
    let approvedate = this.notional_approve_date_sums ? this.notional_approve_date_sums : "";
    let finyear = this.Notional_entry_summary.value.notional_finyear?.finyer ?? '';

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
    this.spinnerservice.show();
    // this.infiniteScroll.ngOnDestroy();
    this.drsservice.Audit_summary(glno, this.page, branchcode, transactiondate, status, flag, stage, approvedate, finyear,'').subscribe((results: any) => {
        this.spinnerservice.hide();

        let pagedatas = results["data"];
        let datapagination = results["pagination"];
        this.hasnext = datapagination.has_next;

        this.notional_summary_data = this.notional_summary_data.concat(pagedatas);
        return false
       

      });
     
  }

  Notional_edit(Audit, Edit) {
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
        "Audit_modal_gl": this.Audit_edits.glno.glno,
        "Audit_modal_alei": this.Audit_edits.alei.name,
        "Audit_modal_tdate": this.Audit_edits.transactiondate,
        "Audit_modal_vdate": this.Audit_edits.valuedate,
        "Audit_modal_Td": this.Audit_edits.transactiondesc,
        "Audit_modal_drcr": this.Audit_edits.drcr.name,
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

  // up_arrow() {
  //   console.log(Event, "event")
  //   this.Arrow = this.Arrow === "1" ? "0" : "1";
  //   this.ArrowDirection = this.Arrow === "1" ? "&#8593;" : "&#8595;";
  //   const targetElement = document.getElementById('boxlevel');
  //   if (this.ArrowDirection!== "&#8595;") {
  //     // window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  //     setTimeout(() => {
  //       const bottomRowIndex = this.notional_summary_data.length - 13; // Assuming items is your data array
  //       const bottomElement = document.getElementById('itemRow_' + bottomRowIndex);
  //       bottomElement?.scrollIntoView({ behavior: 'smooth' });
  //     }, 100);
      
  //   }else{
  //     targetElement.scrollIntoView({ behavior: 'smooth' });
      
     
  //   }
  // }

  Add(ADD) {
    // this.summaryshow= false
    this.summaryshow = false;
    this.Notional_entry_summary.reset()
    this.newrowadd.reset()
    this.Stagegroup.reset()
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
    this.Stage_last()
  }

  Add_audict_form(Audict_add, row) {
    console.log("Row=>", row)
    this.summaryshow = false;
    if (this.newrowadd.value.rows_value[0]["audict_Bra_code"] === null || this.newrowadd.value.rows_value[0]["audict_Bra_code"] === '') {
      this.Toastr.warning("Please Select The Branch Code")
      return false
    }
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

    const formArray = this.newrowadd.get('rows_value') as FormArray;
    formArray.controls.forEach((formGroup: FormGroup) => {
      formGroup.enable();
      this.isButtonDisabled= false
    });
  }

  back() {
    this.summaryshow = true
    this.Notional_entry_summary.reset()
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

  Alei_fun(i) {
    var arrayControl = this.newrowadd.get('rows_value') as FormArray;
    let item = arrayControl.at(i);
    this.Alei_Value = item
    console.log(this.Alei_Value, "ALEI:")
  }

  Transaction_fun(i) {
    var arrayControl = this.newrowadd.get('rows_value') as FormArray;
    let item = arrayControl.at(i);
  }

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


  Dr_CR_edit() {

  }

  Checkbox = [];
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


    console.log("item", item)
    console.log("index", i)
    this.values = item.value
    if (data.checked == false) {
      this.Selected = false
    }
    if (this.Selected == true) {
      this.Selected = true
    }

    if (data.checked == true) {
      const formArray = this.newrowadd.get('rows_value') as FormArray;
      const formGroup = formArray.at(i) as FormGroup;

      formGroup.disable();
      this.isButtonDisabled = true
      // this.isCheckboxDisabledcheck= true

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
        // "audict_stage": this.values.stage_create
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
    if (data.checked == false) {

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
      // const indexToRemove = this.Checkbox

    //   const indexToRemove = this.Checkbox.indexOf(i);
    //   if (indexToRemove !== -1) {
    //     this.Checkbox.splice(i, 1);
    //     console.log("removed from checker:", this.Checkbox)
    //   } else {
    //     this.Checkbox.splice(i, 1);
    //     console.log("removed from maker:", this.Checkbox)

    //   }
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
    // if (this.newrowadd.value.rows_value[0]["stage_create"] === null || this.newrowadd.value.rows_value[0]["stage_create"] === '') {
    //   this.Toastr.warning("Please Enter The Stage")
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
          // "audict_stage": this.All_data.stage_create,
        }
        this.Checkbox.push(this.key_params)
        console.log("this.sumary_id", this.Checkbox)

        if (this.All_data.audict_Dr_Cr.id == "1") {
          this.debitsum = this.All_data.audict_Amount + this.debitsum;
          console.log("Debit", this.debitsum)
        } else if (this.All_data.audict_Dr_Cr.id == "2") {
          this.creditsum = this.All_data.audict_Amount + this.creditsum;
          console.log("Credit", this.creditsum)
        }
      }
    }
    if (app.checked == false) {
      const formArray = this.newrowadd.get('rows_value') as FormArray;
      formArray.controls.forEach((formGroup: FormGroup) => {
        formGroup.enable();
        this.isButtonDisabled = false
      });
      // this.Amount_edit = false
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



  sumary_id = []

  AllSelectvalue_Checker_approver(check) {
    // this.forms= Audit
    // this.Checkbox= [];
    if (check.checked == true) {
      this.debitChecker = 0
      this.creditChecker = 0
    }

    this.id = []

    this.Allselectchecker = check.checked
    this.notional_summary_data.forEach(item => item.selected = this.Allselectchecker);
    console.log("Checker Select All checker Datas ", this.notional_summary_data)

    if (check.checked == true) {
      this.Selected = true

      for (let sumdata of this.notional_summary_data) {
        this.All_data = sumdata
        console.log("All_data", this.All_data)
        this.id.push(this.All_data.id)
        console.log("this.sumary_id", this.id)


        if (this.All_data.drcr.id == "1") {
          this.debitChecker = this.All_data.audit_amount + this.debitChecker;
          console.log("Debit", this.debitChecker)
        } else if (this.All_data.drcr.id == "2") {
          this.creditChecker = this.All_data.audit_amount + this.creditChecker;
          console.log("Credit", this.creditChecker)
        }
      }

    }
    if (check.checked == false) {
      this.Selected = false
      for (let sumdata of this.notional_summary_data) {
        this.All_data = sumdata
        if (this.All_data.drcr.id == "1") {
          this.debitChecker = this.debitChecker - this.All_data.audit_amount;
          console.log("Debit", this.debitChecker)
        } else if (this.All_data.drcr.id == "2") {
          this.creditChecker = this.creditChecker - this.All_data.audit_amount;
          console.log("Credit", this.creditChecker)
        }

      }
    }



  }

  Selectvalue_Checker_approver(even, Audit) {
    console.log("Audit", Audit)
    this.checker = Audit
    this.checker_id = this.checker.id

    if (even.checked == false) {
      this.Selected = false
    }

    if (this.Selected == true) {
      this.Selected = true

    }
    if (even.checked == true) {

      this.id.push(this.checker_id)
      console.log("Checker Data Select Id:", this.id)
      if (this.checker.drcr.id == "1") {
        this.debitChecker = this.checker.audit_amount + this.debitChecker;
        console.log("Debit", this.debitChecker)
      } else if (this.checker.drcr.id == "2") {
        this.creditChecker = this.checker.audit_amount + this.creditChecker;
        console.log("Credit", this.creditChecker)
      }

    }
    if (even.checked == false) {
      this.Selected = false
      if (this.checker.drcr.id == "1") {
        this.debitChecker = this.debitChecker - this.checker.audit_amount;

      } else if (this.checker.drcr.id == "2") {
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
      // }

    }



  }
  stage_fun(stage){
    console.log("Stage values=>", stage)
    const inputValue = stage.target.value;
    // if (inputValue.startsWith('-')) {
    //   stage.target.value = '';
    //   this.Toastr.warning(" Please Enter The Correct Number")
    //   // this.Stagegroup
    // } else{
    //   console.log("Stage values=>", stage)

    // }
    
  }
  stage_up(up){
    console.log("Stage Upload=>", up)
  }


  selecteddatas = [];
  Submit(rowdata) {


    this.stages= this.Stagegroup.controls["stage_create"].value


    if (this.debitsum !== 0 || this.creditsum !== 0) {
      if (this.debitsum === this.creditsum) {
        if (this.Stagegroup.value["stage_create"] === null || this.Stagegroup.value["stage_create"] === '') {
          this.Toastr.warning("Please Enter The Stage")
          return false
        } else if (this.Stagegroup.value["stage_create"] < 0) {
          this.Toastr.warning("Stage Value Cannot Be Negative");
          return false;
        }
        this.indexvalues = this.Checkbox
        for (let index of this.indexvalues) {
          let indexValue = index;
          this.selecteddatas.push(indexValue);
          console.log(this.selecteddatas, "amount")
        }
        
        this.PARAMS = {
          "data": this.selecteddatas,
          "flag": 2,
          "stage": this.stages

        }

        this.spinnerservice.show()
        this.drsservice.Audict_submit(this.PARAMS).subscribe((results: any) => {
          this.spinnerservice.hide()
          let data = results["data"]

          this.message_maker = results.message
          if (results.status == "success") {
            this.Toastr.success("Successfully Created")
            // this.Notional_search("")
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
            const formArrays = this.newrowadd.get('rows_value') as FormArray;
            formArrays.controls.forEach((formGroup: FormGroup) => {
              formGroup.enable();
            });
          } else {
            this.Toastr.error('error')
          }


        })
        console.log("Total Debit and Credit amounts are equal.");

      } else {
        this.Toastr.warning("Total Debit and Credit amounts are not equal")
        console.log("Total Debit and Credit amounts are not equal.");
      }


    } else {
      this.Toastr.warning("Please Select The Records")
    }

  }

  upload_clear() {
    this.AuditModaldownload.reset()
    this.Notional_entry_summary.reset()
    // this.Notional_search("")

  }

  Notionalclose() {
    const body = document.body;
    body.style.position = '';
    body.style.top = '';

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

  Alei_modal() {

  }

  Transaction_modal() {

  }
  Value_modal() {

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
      "audict_Alei": this.audict_Alei_modal,
      "audict_Bra_code": this.audict_Bra_code_modal.code,
      "audict_Gl_no": this.audict_Gl_no_modal,
      "audict_Trans_date": this.dateTrans,
      "audict_value_date": this.datevalue,
      "audict_trans_desc": this.audict_trans_desc_modal,
      "audict_Amount": this.audict_Amount_modal,
      "audict_Dr_Cr": this.audict_Dr_Cr_modal,
      // "audict_stage": this.audict_stage_modal,
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
        this.Notional_sum_close.nativeElement.click();
        // this.Notional_search("")
        this.selectAllCheckboxControl.reset()
        this.singleCheckboxControl.reset()
        this.Notionalclose()
        this.Checkbox = []
        this.id = []
      } else {
        this.Toastr.error('error')
        this.Notionalclose()
      }


    })
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
    if (this.AuditModaldownload.value["Stage_upload"] === null || this.AuditModaldownload.value["Stage_upload"] === '') {
      this.Toastr.warning("Please Enter The Stage")
      return false
    }
    this.spinnerservice.show()
    this.stagesup= this.AuditModaldownload.controls["Stage_upload"].value
    let stage= this.stagesup
    // let PARAMS
    let flag =2
    this.drsservice.doc_upload(this.file,flag,stage).subscribe(results => {
      this.spinnerservice.hide();
      let data = results["data"]
      if (data[0].status == "SUCCESS") {
        this.Toastr.success("", "Successfully Uploaded")
        this.Audit_upload_close.nativeElement.click();
        this.AuditModal.reset()
        // this.Notional_search("")
        this.AuditModaldownload.reset()
        // this.aws_search(this.aws_search_val)
        this.file = ""
      }
    })
  }

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
  Dr_Cr_fun(i) {
    var arrayControl = this.newrowadd.get('rows_value') as FormArray;
    let item = arrayControl.at(i);
  }

  Stagedrop() {
    // this.spinnerservice.show()

    let prokeyvalue: String = "";
    this.get_template_stage_drop(prokeyvalue);
    this.Notional_entry_summary.get('stage').valueChanges
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
    this.spinnerservice.show()
    this.drsservice.Stage_drop(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        this.spinnerservice.hide()
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

  exceldownlode(type){
    if (this.Notional_entry_summary.value["notional_finyear"] === null || this.Notional_entry_summary.value["notional_finyear"] === '') {
      this.Toastr.warning("Please Select The Finyear")
      return false
    }
    this.notional_Trans_date_sums = this.datepipe.transform(this.Notional_entry_summary.value.notional_Trans_date_sum, 'yyyy-MM-dd')
    console.log("date", this.notional_Trans_date_sums)
    this.notional_approve_date_sums = this.datepipe.transform(this.Notional_entry_summary.value.audict_Approve_date_sum, 'yyyy-MM-dd')
    console.log("date", this.notional_approve_date_sums)
    // let page = 1
    // this.Exception_data.Exception_Fyear?.finyer?? '';
    let glnoo = ""
    let glno = this.Notional_entry_summary.value.notional_Gl?.glno ?? '';
    let branchcode = this.Notional_entry_summary.value.notional_branch?.code ?? '';
    let transactiondate = this.notional_Trans_date_sums ? this.notional_Trans_date_sums : "";
    let status = this.Notional_entry_summary.value.audict_status?.id ?? '';
    let flag = 2;
    let stage= this.Notional_entry_summary.value.stage?.id?? '';
    // let stage = 1
    let approvedate = this.notional_approve_date_sums ? this.notional_approve_date_sums : "";
    let finyear = this.Notional_entry_summary.value.notional_finyear?.finyer ?? '';
    this.spinnerservice.show()
    this.drsservice.Screen_download(status, branchcode,transactiondate,stage,approvedate,flag,finyear,glno).subscribe((results: any) => {
      this.spinnerservice.hide()
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = "Notional Entry.xlsx";
      link.click();
      this.Toastr.success('Successfully Download');
      // this.arrdate1 = []
    });

  }

  Stage_last(){
    // if (this.Notional_entry_summary.value["notional_finyear"] === null || this.Notional_entry_summary.value["notional_finyear"] === '') {
    //   // this.Toastr.warning("Please Select The Finyear")
    //   return false
    // }
    let page=1
    let flag=2
    let finyear = this.Notional_entry_summary.value.notional_finyear?.finyer ?? '';
    this.drsservice.Stage_end(page,flag,finyear,'').subscribe((results: any) => {
      let Sta_datas = results["data"][0];
      this.Stage_List = Sta_datas;
      console.log("Stage=>",this.Stage_List)

    })
   
  }

  finyear_clear(){
    if(typeof this.Notional_entry_summary.controls['stage'].value ==='object'){
      this.Notional_entry_summary.controls['stage'].reset('')
    }
    if(typeof this.Notional_entry_summary.controls['notional_branch'].value ==='object'){
      this.Notional_entry_summary.controls['notional_branch'].reset('')
    }
    if(typeof this.Notional_entry_summary.controls['notional_Gl'].value ==='object'){
      this.Notional_entry_summary.controls['notional_Gl'].reset('')
    }     
    this.Notional_entry_summary.controls['notional_Trans_date_sum'].reset('')
    this.Notional_entry_summary.controls['audict_Approve_date_sum'].reset('')

  }

  branch_clear(){
    if(typeof this.Notional_entry_summary.controls['stage'].value ==='object'){
      this.Notional_entry_summary.controls['stage'].reset('')
    }   
    if(typeof this.Notional_entry_summary.controls['notional_Gl'].value ==='object'){
      this.Notional_entry_summary.controls['notional_Gl'].reset('')
    }     
    this.Notional_entry_summary.controls['notional_Trans_date_sum'].reset('')
    this.Notional_entry_summary.controls['audict_Approve_date_sum'].reset('')
  }

}
