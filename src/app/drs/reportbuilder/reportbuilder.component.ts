import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DrsService } from "../drs.service";
import { MatAutocomplete, MatAutocompleteTrigger } from "@angular/material/autocomplete";
// import { MatTabChangeEvent } from '@angular/material/tabs';
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { ThemePalette } from "@angular/material/core";
import { Router } from "@angular/router";
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map, debounce } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { SharedDrsService } from "../shared-drs.service";
export interface drs {
  name: string;
  code: number;
  id: number;
}
@Component({
  selector: "app-reportbuilder",
  templateUrl: "./reportbuilder.component.html",
  styleUrls: ["./reportbuilder.component.scss"],
})
export class ReportbuilderComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild("reportmasters") reportmasters: MatAutocomplete;
  @ViewChild("reporthead") reporthead: MatAutocomplete;
  @ViewChild("reporttype") reporttype: MatAutocomplete;
  @ViewChild("schdularmasters") schdularmasters: MatAutocomplete;
  @ViewChild("Schdular") Schdular: MatAutocomplete;
  @ViewChild("type_drop") type_drop: MatAutocomplete;
  @ViewChild('report_mas_close') report_mas_close: ElementRef;
  @ViewChild('report_repot_close') report_repot_close: ElementRef;
  @ViewChild('report_group_close') report_group_close: ElementRef;
  @ViewChild('report_item_close') report_item_close: ElementRef;
  @ViewChild('schrdule_mas_close') schrdule_mas_close: ElementRef;
  @ViewChild('schrdule_item_close') schrdule_item_close: ElementRef;
  @ViewChild('reprt_master_serch') reprt_master_serch: MatAutocomplete;
  @ViewChild('maste_header_name') maste_header_name: MatAutocomplete;
  @ViewChild('RMContactInput') RMContactInput: any;
  @ViewChild('repor_group_thead') repor_group_thead: MatAutocomplete;
  @ViewChild('RHContactInput') RHContactInput: any;  
  @ViewChild('RMContact_Input') RMContact_Input: any;
  @ViewChild('reportgroupS') reportgroupS: MatAutocomplete;
  @ViewChild('RGContactInput') RGContactInput: any;
  @ViewChild('reporttype') Reporttype: MatAutocomplete;
  @ViewChild('RTContactInput') RTContactInput: any;
  @ViewChild('reportmasters') Reportcreatetype: MatAutocomplete;
  @ViewChild('RCContactInput') RCContactInput: any;
  @ViewChild('repor_gpr_thead') repor_gpr_thead: MatAutocomplete;
  @ViewChild('RHCContactInput') RHCContactInput: any;
  @ViewChild('reportgroup') Reportgroupcreatetype: MatAutocomplete;
  @ViewChild('RGCContactInput') RGCContactInput: any;  
  @ViewChild('RGCC_ontactInput') RGCC_ontactInput: any;
  @ViewChild('RHTCContactInput') RHTCContactInput: any;
  @ViewChild('reportheadS') reportheadsummary: MatAutocomplete;
  @ViewChild('RHTSContactInput') RHTSContactInput: any;
  @ViewChild('editableContent', { static: false }) editableContentRef!: ElementRef;
  @ViewChild("Sche_data") Sche_data: any;
  @ViewChild("schdularmaster") schdularmaster: MatAutocomplete;
  @ViewChild('report_header') report_header: ElementRef;
  @ViewChild('report_Group') report_Group_route: ElementRef;
  @ViewChild('report_item') report_item_route: ElementRef;

  reportbuilder: FormGroup;
  reportheader: FormGroup;
  report_Group: FormGroup;
  report_type: FormGroup;
  Schdular_master: FormGroup;
  Schdular_type: FormGroup;
  reportmaster: FormGroup;
  reportheadercreate: FormGroup;
  reportgroupcreate: FormGroup;
  reporttypecreate: FormGroup;
  Schdularmastercreate: FormGroup;
  Schdulartypecreate: FormGroup;
  report_list: any;
  reportstatus: boolean = false;
  report_data_list: any;
  report_header_list: any;
  report_group_list: any;
  report_type_list: any;
  Schdular_list: any;
  Schdular_type_list: any;
  has_previous: boolean;
  sumdata: any;
  report_header_sumdata: any;
  has_next: any;
  presentpage: any;
  data_found: boolean;
  reporthead_list: any;
  Schdularmaster_list: any;
  reportmaster_list: any;
  reportgroup_list: any;
  Schdulartype_list: any;
  evantlue: number;
  isClicked: boolean;
  report_master_submit_btn: boolean = true;
  rep_mas_view: boolean = false;
  schedule_item_tab: boolean = true;
  report_group_tab: boolean = true;
  Report_grp_view: boolean = false;
  radiocheck: any[] = [
    { value: 1, display: 'GL' },
    { value: 0, display: 'SL' }
  ]
  radiodata: any[] = [
    { value: 1, name: 'ST' },
    { value: 0, name: 'CM' }
  ]
  radiocheckvalue: any[] = [
    { value: 1, display: 'YES' },
    { value: 0, display: 'NO' }
  ]
  Schedule_Type = [{ name: "Item", id: "1" },
  { name: "Element", id: "2" },]
  GL_value: any;
  SL_value: any;
  yesorno_value: string;
  reportmaster_type: any;
  hashead_next: any;
  hashead_previous: any;
  headpresentpage: any;
  hasgroup_next: boolean;
  hasgroup_previous: boolean;
  grouppresentpage: number;
  hastype_next: boolean;
  hastype_previous: boolean;
  typepresentpage: number;
  hasschmaster_next: any;
  hasschmaster_previous: any;
  schmasterpresentpage: any;
  hasschdultype_next: boolean;
  hasschdultype_previous: boolean;
  schdultypepresentpage: number;
  report_typedropdown_list: any;
  type_presentpage: number;
  multidata = []
  report_master_edit_create: string;
  report_head_submit_btn: boolean = true;
  report_group_sub_btn: boolean = true;
  report_type_sub_btn: boolean = true;
  scdular_mas_sub_btn: boolean = true;
  scdular_type_sub_btn: boolean = true;
  schd_mas_view: boolean = false;
  schd_itm_view: boolean = false
  rep_Head_view: boolean = false;
  Report_itm_view: boolean = false;
  type_data = [{ "id": 1, "name": 'Report Header' },
  { "id": 2, "name": 'Report Group' }]
  header_form_data: boolean = false;
  group_form_data: boolean = false;
  rhDrop: any;
  rmDrop: any;
  rgDrop: any;
  rtDrop: any;
  data: any;
  isLoading: boolean;
  rmdata: any;
  has_nextFin: boolean;
  has_previousFin: boolean;
  currentpageFin: number;
  rmdropdata: any;
  Rmdata: any;
  has_nextFin1: boolean;
  has_previousFin1: boolean;
  currentpageFin1: number;
  has_nextFin2: boolean;
  has_previousFin2: boolean;
  currentpageFin2: number;
  reporttype_list: any;
  has_nextFin3: boolean;
  has_previousFin3: boolean;
  currentpageFin3: number;
  rhcDrop: any;
  reportmaster_list1: any;
  has_nextFin5: boolean;
  has_previousFin5: boolean;
  currentpageFin5: number;
  reporthead_list1: any;
  has_nextFin6: boolean;
  has_previousFin6: any;
  currentpageFin6: any;
  rgcDrop: any;
  reportgroup_list3: any;
  has_nextFin7: boolean;
  has_previousFin7: boolean;
  currentpageFin7: number;
  rhtcDrop: any;
  reporthead_list2: any;
  has_nextFin8: boolean;
  has_previousFin8: boolean;
  currentpageFin8: number;
  Avalue: any;
  Evalue: any;
  ADD: any;
  deff: any;
  form_data: any;
  Schedulemaster: any;
  arr: any = []
  schdule_value: any;
  elem_hide: boolean = true;
  scdule_master_screen: boolean;
  summaryshow: boolean;
  summarysshow: boolean;
  name_value: any = [];
  id_value: any = [];
  schedule_data: any = [];

  mas_has_next: boolean;
  mas_has_previous: boolean;
  mas_currentpage: number;
  reporttypecreate_number: any;
  report_master: any;
  reporthead_list5: any;
  currentpageFin9: number;
  has_nextFin9: boolean;
  has_previousFin9: boolean;
  multidata1: string;
  Schdularmaster: any;
  Multidata: any;
  element: any;
  schdule_mas_temp: any;
  editableContent: HTMLElement;
  ref_element_null: HTMLElement;
  report_datas_ele: any;
  element_deffs: any;
  refe_value: string;
  report_master_id: any;
  reporthead_list_group: any;
  edit_schedule_value: any;
  refe_id: any=[];
  array_edit_data: any=[];
  data_master_found: boolean;
  data_header_found: boolean;
  data_group_found: boolean;
  data_item_found: boolean;
  has_nexthm: any;
  currentpagehm: number;
  has_previoushm: any;
  reportmaster_head_list: any;
  report_group_list3: any;
  has_nextgf: boolean;
  has_previousgf: any;
  currentpagegf: any;
  reportgroup_summary_head: any;
  reporttype_sum_group: any;
  currency_master_screen: boolean;
  report_hearder_con: boolean;
  report_group_con: boolean;
  report_item_con: boolean=false;
  Exception_schedule_screen: boolean;
  isEditable: boolean;
  Is_value: string;
  xcel_name: string;
  schdule_values: any;
  schedule_output: string;
  out_value: any[];
  result: any[];
  match_ids: any;
  final_valuess: any;

  constructor(private drsservice : SharedDrsService, private fb: FormBuilder, private drsService: DrsService, private spinnerService: NgxSpinnerService, private toastr: ToastrService, private router: Router) { }
  drs_menuList = ['Report Master', 'Report Header', 'Report Group', 'Report Item', 'Schedule Master', 'Schedule Item', 'Currency Master', 'Exception Schedule']
  ngOnInit(): void {
    // this.drsservice.isSideNav = true;
    // document.getElementById("mySidenav").style.width = "50px";
    // document.getElementById("main").style.marginLeft = "40px";
    // document.getElementById("main").style.transition = "margin-left 0.5s";
    document.getElementById("mySidenav").style.width = "200px";
    document.getElementById("main").style.marginLeft = "12rem";
    this.drsservice.isSideNav = false;
    this.reportbuilder = this.fb.group({
      report_master_type: [""],
      report_master_code: "",
      report_master_name: "",
      reporttype: [""],
    });
    this.reportheader = this.fb.group({
      // report_header_type: [""],
      report_master_data_name: "",
      report_header_name: "",
      reporttype: [""],
    });
    this.report_Group = this.fb.group({
      report_head_data_name: "",
      reportgroup_name: "",
      reporttype: [""],
    });
    this.report_type = this.fb.group({
      reports_type: [""],
      report_group_data_name: "",
      report_type_name: "",
      Schdular_type: "",
      reporttype: [""],
      reportgroup_summary_head: "",
      type: "",
      reportgroup_dropdown: "",
      reporthead_dropdown2: "",
      reporttypecreate_group1: "",
      type1: "",
      reportgroup_create_head1: "",
      reporttypecreate_group: "",
      reportgroup_create_head: "",     
    });
    this.Schdular_master = this.fb.group({
      Schdular_masters: [""],
      report_type_data_name: "",
    });
    this.Schdular_type = this.fb.group({
      schdulars_type: [""],
      Schdular_type_name: "",
      Schdularmaster_data_name: "",
      reporttype: [""],
    });
    this.reportmaster = this.fb.group({
      reportmaster_name: [""],
      status: "",
      customer: "",
      is_schedule: "",
      is_quarter:""
    });
    this.reportheadercreate = this.fb.group({
      reportheadercreate_name: "",
      reportheadercreate_master: [""],
    });
    this.reportgroupcreate = this.fb.group({
      reportgroupcreate_name: "",
      reportgroupcreate_head: [""],
    });
    this.reporttypecreate = this.fb.group({
      reporttypecreate_name: "",
      reporttypecreate_number: "",
      reporttype_sum_group: [""],
      report_master_data_item_modal: "",
      reporttypecreate_type_name: "",
      type: '',
      Schdular_type: "",
      reportgroup_create_head: '',
      Schdularmaster: "",
    
    });
    this.Schdularmastercreate = this.fb.group({
      Schdularmastercreate_name: "",
      Schdularmastercreate_report: "",
      yesorno: '',
    });
    this.Schdulartypecreate = this.fb.group({
      Schdulartypecreate_name: "",
      Schdulartypecreate_sdlmaster: [""],
      Schdulartypecreate_type_name: "",
    });
    this.drs_report_summary("");
    this.drs_report_header_summary("");
    this.drs_schdular_master_summary("");
    this.drs_report_type_summarys("");
    this.drs_report_group_summary("");
  }
  public report_drop(report_name?: drs): string | undefined {
    return report_name ? report_name.name : undefined;
  }
  public reportmaster_display(report_master_name?: drs): string | undefined {
    return report_master_name ? report_master_name.name : undefined;
  }
  public reporthead_display(reportgroup_create_head?: drs): string | undefined {
    return reportgroup_create_head ? reportgroup_create_head.name : undefined;
  }
  public reporthead_display5(reportgroup_summary_head?: drs): string | undefined {
    return reportgroup_summary_head ? reportgroup_summary_head.name : undefined;
  }
  public reporthead_display1(report_head_data_name?: drs): string | undefined {
    return report_head_data_name ? report_head_data_name.name : undefined;
  }
  public reporthead_displays(reportgroupcreate_head?: drs): string | undefined {
    return reportgroupcreate_head ? reportgroupcreate_head.name : undefined;
  }
  public reportgroup_display(report_group_name?: drs): string | undefined {
    return report_group_name ? report_group_name.name : undefined;
  }
  public reporttype_display(report_types_name?: drs): string | undefined {
    return report_types_name ? report_types_name.name : undefined;
  }
  public schdularmaster_display(Schdularmaster?: drs): string | undefined {
    return Schdularmaster ? Schdularmaster.name+"-"+Schdularmaster.code : undefined;
  }
  public Schdular_display(schdulargroup_name?: drs): string | undefined {
    return schdulargroup_name ? schdulargroup_name.name : undefined;
  }
  public type_display(report_group_name?: drs): string | undefined {
    return report_group_name ? report_group_name.name : undefined;
  }
  public schdulartype_display(schdular_type_name?: drs): string | undefined {
    return schdular_type_name ? schdular_type_name.name : undefined;
  }
  public reportmaster_display_item(report_master_data_item_modal?: drs): string | undefined {
    return report_master_data_item_modal ? report_master_data_item_modal.name : undefined;
  }
  labelnames = ['Report Master', 'Report Header', 'Report Group', 'Report Item', 'Schedule Master', 'Schedule Item', 'Currency Master']
  numberofind: Number = 0;
  routerchange(e) {
    this.numberofind = e
  }
  source(e) {
    this.router.navigate(['/dssreport']);
  }

  reportdrop() {
    this.spinnerService.show()
    this.drsService.reportdrop().subscribe((results: any) => {
      this.spinnerService.hide()
      let data = results["data"];
      this.report_list = data;
    });
  }
  report_selection(select) {
    let value = select;
    console.log("val;ue", value);
    this.drsService.reportdrop().subscribe((results: any) => {
      let data = results["data"];
      this.report_list = data;
    });
  }
  drs_reset() {
    this.reportbuilder.get("report_type").reset();
    this.reportbuilder.get("code").reset();
    this.reportbuilder.get("name").reset();
    this.reportbuilder.get("reporttype").reset();
  }
  drs_report_summary(data, pageNumber = 1) {
    let sumdata = data;
    let report_head = this.reportbuilder.value.report_master_code ? this.reportbuilder.value.report_master_code : "";
    let name = this.reportbuilder.value.report_master_name ? this.reportbuilder.value.report_master_name : "";
    console.log("report_head  report_head", report_head, name);
    this.spinnerService.show()
    this.drsService.report_master_summary(pageNumber, report_head, name)
      .subscribe((results: any) => {
        this.spinnerService.hide()
        let data = results["data"];
        let datapagination = results["pagination"];
        this.report_data_list = data;
        if (this.report_data_list?.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
          this.data_master_found = true;
        }
        if (results["set_code"] || this.report_data_list?.length == 0) {
          this.has_next = false;
          this.has_previous = false;
          this.presentpage = 1;
          this.data_master_found = false;
        }
      });
  }
  previousClick() {
    if (this.has_previous === true) {
      this.drs_report_summary(this.report_data_list, this.presentpage - 1);
    }
  }
  nextClick() {
    if (this.has_next === true) {
      this.drs_report_summary(this.report_data_list, this.presentpage + 1);
    }
  }
  drs_edits(event) {
  }
  rep_mas_clear() {   
    this.reportbuilder.reset()
    this.drs_report_summary("")
  }
  drs_value(event) {
    let drs_value = event;
    console.log("drs_value", drs_value);
  }
  drsreport_create() { }
  drs_report_header_summary(datas, pageNumber = 1) {
    this.report_header_sumdata = datas;
    let report_master = this.reportheader.value.report_master_data_name ? this.reportheader.value.report_master_data_name.id : "";
    let name = this.reportheader.value.report_header_name ? this.reportheader.value.report_header_name : "";
    console.log("sumdata", this.reportheader.value);
    this.spinnerService.show()
    this.drsService.drs_report_header_summary(pageNumber, report_master, name).subscribe((results: any) => {
      this.spinnerService.hide()
      let data = results["data"];
      let datapagination = results["pagination"];
      this.report_header_list = data;
      this.report_hearder_con = false
      if (this.report_header_list?.length > 0) {
        this.hashead_next = datapagination.has_next;
        this.hashead_previous = datapagination.has_previous;
        this.headpresentpage = datapagination.index;
        this.data_header_found = true;
      }
      if (results["set_code"] || this.report_header_list?.length == 0) {
        this.hashead_next = false;
        this.hashead_previous = false;
        this.headpresentpage = 1;
        this.data_header_found = false;
      }
    });
  }
  previousheadClick() {
    if (this.hashead_previous === true) {
      this.drs_report_header_summary(this.report_header_list, this.headpresentpage - 1);
    }
  }
  nextheadClick() {
    if (this.hashead_next === true) {
      this.drs_report_header_summary(this.report_header_list, this.headpresentpage + 1);
    }
  }
  rep_head_clear() {    
    this.reportheader.reset()
    this.drs_report_header_summary("")
  }
  drs_report_group_summary(datas, pageNumber = 1) {
    let sumdata = datas;
    let header = this.report_Group.value.report_head_data_name ? this.report_Group.value.report_head_data_name.id : "";
    let name = this.report_Group.value.reportgroup_name ? this.report_Group.value.reportgroup_name : "";
    console.log("sumdata", sumdata);
    this.spinnerService.show()
    this.drsService.drs_report_group_summary(pageNumber, header, name).subscribe((results: any) => {
      this.spinnerService.hide()
      let data = results["data"];
      let datapagination = results["pagination"];
      this.report_group_list = data;
      this.report_group_con = false
      if (this.report_group_list?.length > 0) {
        this.hasgroup_next = datapagination.has_next;
        this.hasgroup_previous = datapagination.has_previous;
        this.grouppresentpage = datapagination.index;
        this.data_group_found = true;
      }
      if (results["set_code"] || this.report_group_list?.length == 0) {
        this.hasgroup_next = false;
        this.hasgroup_previous = false;
        this.grouppresentpage = 1;
        this.data_group_found = false;
      }
    });
  }
  previousreportgroupClick() {
    if (this.hasgroup_previous === true) {
      this.drs_report_group_summary(this.report_group_list, this.grouppresentpage - 1);
    }
  }
  nextreportgroupClick() {
    if (this.hasgroup_next === true) {
      this.drs_report_group_summary(this.report_group_list, this.grouppresentpage + 1);
    }
  }

  rep_grp_clear() {   
    this.report_Group.reset()
    this.drs_report_group_summary("")
  }
  drs_report_type_summarys(datas, pageNumber = 1) {
    let sumdata = datas;
    let reprt_type = this.report_type.value.reporttypecreate_group ? this.report_type.value.reporttypecreate_group.id : "";
    let name = this.report_type.value.report_type_name ? this.report_type.value.report_type_name : "";
    let type = this.report_type.value.type ?.id??"";
    let head_group
    if (type == 1) {
      head_group = this.report_type.value.reportgroup_summary_head?.id ?? ""

    } else {
      head_group = this.report_type.value.reporttypecreate_group?.id ?? ""
    }

    console.log("sumdata", sumdata);
    this.spinnerService.show()
    this.drsService.drs_report_type_summary(pageNumber, reprt_type, name, type, head_group).subscribe((results: any) => {
      this.spinnerService.hide()
      let data = results["data"];
      let datapagination = results["pagination"];
      this.report_type_list = data;
      if (this.report_type_list?.length > 0) {
        this.hastype_next = datapagination.has_next;
        this.hastype_previous = datapagination.has_previous;
        this.type_presentpage = datapagination.index;
        this.data_item_found = true;
      }
      if (results["set_code"] || this.report_type_list?.length == 0) {
        this.hastype_next = false;
        this.hastype_previous = false;
        this.type_presentpage = 1;
        this.data_item_found = false;
      }
    });
  }
  previous_typeClick() {
    if (this.hastype_previous === true) {
      this.drs_report_type_summarys(this.report_type_list, this.type_presentpage - 1);
    }
  }
  next_typeClick() {
    if (this.hastype_next === true) {
      this.drs_report_type_summarys(this.report_type_list, this.type_presentpage + 1);
    }
  }
  drs_schdular_master_summary(datas, pageNumber = 1) {
    let sumdata = datas;
    let report_type = sumdata.report_type_data_name ? sumdata.report_type_data_name.id : "";
    let name = sumdata.schdularmaster_name ? sumdata.schdularmaster_name : "";
    console.log("sumdata", sumdata);
    this.spinnerService.show()
    this.drsService.drs_schdular_master_summary(pageNumber, report_type, name).subscribe((results: any) => {
      this.spinnerService.hide()
      let data = results["data"];
      let datapagination = results["pagination"];
      this.Schdular_list = data;
      if (this.Schdular_list?.length > 0) {
        this.hasschmaster_next = datapagination.has_next;
        this.hasschmaster_previous = datapagination.has_previous;
        this.schmasterpresentpage = datapagination.index;
        this.data_found = true;
      }
      if (results["set_code"] || this.Schdular_list?.length == 0) {
        this.hasschmaster_next = false;
        this.hasschmaster_previous = false;
        this.schmasterpresentpage = 1;
        this.data_found = false;
      }
    });
  }
  previousgroupClick() {
    if (this.hasschmaster_previous === true) {
      this.drs_schdular_master_summary(this.Schdular_list, this.schmasterpresentpage - 1);
    }
  }
  nextgroupClick() {
    if (this.hasschmaster_next === true) {
      this.drs_schdular_master_summary(this.Schdular_list, this.schmasterpresentpage + 1);
    }
  }

  rep_itm_clear() {    
    this.report_type.reset()
    this.group_form_data = false
    this.header_form_data = false
    this.drs_report_type_summarys("")
  }

  rep_schd_clear() {
    this.Schdular_master.reset()
  }
  schd_itm_clear() {
    this.Schdular_type.reset()
  }
  reportmasterdrop() {
    this.rmDrop = this.reportheader.controls["report_master_data_name"].value;
    let name = this.rmDrop?.name ?? "";

    // this.spinnerService.show()

    let prokeyvalue: String = "";
    this.getreport_master_drop(prokeyvalue);
    this.reportheader.get('report_master_data_name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),

        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.drsService.reportmasterdrop(value, 1)
          .pipe(
            finalize(() => {
              console.log(value)

            }),
          )
        )
      )
      .subscribe((results: any) => {
        // this.spinnerService.hide()
        let data = results["data"]
        this.reportmaster_head_list = data;
        console.log("report_master_dropdown", this.reportmaster_head_list)
        this.isLoading = false
      })
  }
  private getreport_master_drop(prokeyvalue) {
    this.drsService.reportmasterdrop(prokeyvalue, 1)
      .subscribe((results: any) => {
        // this.spinnerService.hide()
        this.reportmaster_head_list = results["data"]
        console.log("report_master_dropdown", this.reportmaster_head_list)
        this.isLoading = false
      })
  }
  RMdropdown_header_Scroll(){
    this.has_nexthm = true;
    this.has_previoushm = true;
    this.currentpagehm = 1
    let flag = 0
    setTimeout(() => {
      if (
        this.maste_header_name &&
        this.autocompleteTrigger &&
        this.maste_header_name.panel
      ) {
        fromEvent(this.maste_header_name.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.maste_header_name.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.maste_header_name.panel.nativeElement.scrollTop;
            const scrollHeight = this.maste_header_name.panel.nativeElement.scrollHeight;
            const elementHeight = this.maste_header_name.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nexthm === true) {
                this.drsService.reportmasterdrop(this.RMContact_Input.nativeElement.value, this.currentpagehm + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.reportmaster_head_list = this.reportmaster_head_list.concat(datas);
                    if (this.reportmaster_head_list.length >= 0) {
                      this.has_nexthm = datapagination.has_next;
                      this.has_previoushm = datapagination.has_previous;
                      this.currentpagehm = datapagination.index;
                    }
                  })
              }

            }
          })
      }
    })
  }
  RMdropdownScroll() {
    this.has_nextFin = true;
    this.has_previousFin = true;
    this.currentpageFin = 1
    let flag = 0
    setTimeout(() => {
      if (
        this.reprt_master_serch &&
        this.autocompleteTrigger &&
        this.reprt_master_serch.panel
      ) {
        fromEvent(this.reprt_master_serch.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.reprt_master_serch.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.reprt_master_serch.panel.nativeElement.scrollTop;
            const scrollHeight = this.reprt_master_serch.panel.nativeElement.scrollHeight;
            const elementHeight = this.reprt_master_serch.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextFin === true) {
                this.drsService.reportmasterdrop(this.RMContactInput.nativeElement.value, this.currentpageFin + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.reportmaster_list = this.reportmaster_list.concat(datas);
                    if (this.reportmaster_list.length >= 0) {
                      this.has_nextFin = datapagination.has_next;
                      this.has_previousFin = datapagination.has_previous;
                      this.currentpageFin = datapagination.index;
                    }
                  })
              }

            }
          })
      }
    })

  }
  reporthead_dropdown() {
    this.rhDrop = this.report_Group.controls["report_head_data_name"].value;
    let name = this.rhDrop?.name ?? "";
    let report_master = ""
    // this.spinnerService.show()
    let prokeyvalue: String = "";
    this.getreport_header_drop(prokeyvalue, report_master);
    this.report_Group.get('report_head_data_name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.drsService.reporthead_dropdown(value, 1, report_master)
          .pipe(
            finalize(() => {
              console.log(value)
            }),
          )
        )
      )
      .subscribe((results: any) => {
        // this.spinnerService.hide()
        let data1 = results["data"]
        this.reporthead_list = data1;
        console.log("Report_header_dropdown", this.reporthead_list)
        this.isLoading = false
      })
  }
  private getreport_header_drop(prokeyvalue, report_master) {
    this.drsService.reporthead_dropdown(prokeyvalue, 1, report_master)
      .subscribe((results: any) => {
        // this.spinnerService.hide()
        this.reporthead_list = results["data"]
        console.log("Report_header_dropdown", this.reporthead_list)
        this.isLoading = false
      })
  }
  RHdropdownScroll() {
    this.has_nextFin1 = true;
    this.has_previousFin1 = true;
    this.currentpageFin1 = 1
    setTimeout(() => {
      if (
        this.repor_group_thead &&
        this.autocompleteTrigger &&
        this.repor_group_thead.panel
      ) {
        fromEvent(this.repor_group_thead.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.repor_group_thead.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.repor_group_thead.panel.nativeElement.scrollTop;
            const scrollHeight = this.repor_group_thead.panel.nativeElement.scrollHeight;
            const elementHeight = this.repor_group_thead.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextFin1 === true) {
                this.drsService.reporthead_dropdown(this.RHContactInput.nativeElement.value, this.currentpageFin1 + 1, "")
                  .subscribe((results: any[]) => {
                    let datas1 = results["data"];
                    let datapagination1 = results["pagination"];
                    this.reporthead_list = this.reporthead_list.concat(datas1);
                    if (this.reporthead_list.length >= 0) {
                      this.has_nextFin1 = datapagination1.has_next;
                      this.has_previousFin1 = datapagination1.has_previous;
                      this.currentpageFin1 = datapagination1.index;
                    }
                  })
              }
            }
          })
      }
    })

  }
  reportgroup_dropdown() {
    this.rgDrop = this.report_type.controls["report_group_data_name"].value;
    let name = this.rgDrop?.name ?? "";
    // this.spinnerService.show()
    let prokeyvalue: String = "";
    this.getreport_group_drop(prokeyvalue);
    this.report_type.get('report_group_data_name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),

        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.drsService.reportgroup_dropdown(value, 1)
          .pipe(
            finalize(() => {
              console.log(value)
            }),
          )
        )
      )
      .subscribe((results: any) => {
        // this.spinnerService.hide()
        let data2 = results["data"]
        this.reportgroup_list = data2;
        console.log("Report_group_dropdown", this.reportgroup_list)
        this.isLoading = false
      })
  }
  private getreport_group_drop(prokeyvalue) {
    this.drsService.reportgroup_dropdown(prokeyvalue, 1)
      .subscribe((results: any) => {
        // this.spinnerService.hide()
        this.reportgroup_list = results["data"]
        console.log("Report_group_dropdown", this.reportgroup_list)
        this.isLoading = false
      })
  }
  RGdropdownScroll() {
    this.has_nextFin2 = true;
    this.has_previousFin2 = true;
    this.currentpageFin2 = 1
    setTimeout(() => {
      if (
        this.reportgroupS &&
        this.autocompleteTrigger &&
        this.reportgroupS.panel
      ) {
        fromEvent(this.reportgroupS.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.reportgroupS.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.reportgroupS.panel.nativeElement.scrollTop;
            const scrollHeight = this.reportgroupS.panel.nativeElement.scrollHeight;
            const elementHeight = this.reportgroupS.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextFin2 === true) {
                this.drsService.reporthead_dropdown(this.RGContactInput.nativeElement.value, this.currentpageFin2 + 1, this.report_master)
                  .subscribe((results: any[]) => {
                    let datas2 = results["data"];
                    let datapagination2 = results["pagination"];
                    this.reportgroup_list = this.reportgroup_list.concat(datas2);
                    if (this.reportgroup_list.length >= 0) {
                      this.has_nextFin2 = datapagination2.has_next;
                      this.has_previousFin2 = datapagination2.has_previous;
                      this.currentpageFin2 = datapagination2.index;
                    }
                  })
              }

            }
          })
      }
    })

  }
  reporttype_dropdown() {

    this.rtDrop = this.Schdular_master.controls["report_type_data_name"].value;
    let name = this.rtDrop?.name ?? "";
    // this.spinnerService.show()
    let prokeyvalue: String = "";
    this.getreport_type_drop(prokeyvalue);
    this.Schdular_master.get('report_type_data_name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),

        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.drsService.reporttype_dropdown(value, 1)
          .pipe(
            finalize(() => {
              console.log(value)
            }),
          )
        )
      )
      .subscribe((results: any) => {
        // this.spinnerService.hide()
        let data3 = results["data"]
        this.reporttype_list = data3;
        console.log("Report_type_dropdown", this.reporttype_list)
        this.isLoading = false
      })
  }
  private getreport_type_drop(prokeyvalue) {
    this.drsService.reporttype_dropdown(prokeyvalue, 1)
      .subscribe((results: any) => {
        // this.spinnerService.hide()
        this.reporttype_list = results["data"]
        console.log("Report_type_dropdown", this.reporttype_list)
        this.isLoading = false
      })
  }
  RTdropdownScroll() {
    this.has_nextFin3 = true;
    this.has_previousFin3 = true;
    this.currentpageFin3 = 1
    setTimeout(() => {
      if (
        this.Reporttype &&
        this.autocompleteTrigger &&
        this.Reporttype.panel
      ) {
        fromEvent(this.Reporttype.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.Reporttype.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.Reporttype.panel.nativeElement.scrollTop;
            const scrollHeight = this.Reporttype.panel.nativeElement.scrollHeight;
            const elementHeight = this.Reporttype.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextFin3 === true) {
                this.drsService.reporttype_dropdown(this.RTContactInput.nativeElement.value, this.currentpageFin3 + 1)
                  .subscribe((results: any[]) => {
                    let datas3 = results["data"];
                    let datapagination3 = results["pagination"];
                    this.reporttype_list = this.reporttype_list.concat(datas3);
                    if (this.reporttype_list.length >= 0) {
                      this.has_nextFin3 = datapagination3.has_next;
                      this.has_previousFin3 = datapagination3.has_previous;
                      this.currentpageFin3 = datapagination3.index;
                    }
                  })
              }

            }
          })
      }
    })

  }
schedul_mas_arry=[]
  select_value1(Schdularmaster, Master) {
    if (this.reporttypecreate.value.Schdular_type.name == "Item") {

    } else {
      let schedule_data = Schdularmaster;
      this.Schedulemaster = Master;
      if (this.Schedulemaster == 'Schedule') {      
        this.form_data = schedule_data
        if(this.reporttype_create_edit=='edit'){
          let a=""
         this.edit_schedule_value= schedule_data.name
         this.array_edit_data.push(schedule_data.name)  
         this.refe_id.push(schedule_data.id)
          a=a+ this.edit_schedule_value
          console.log("aa",a)      
       this.refe_value = this.editableContentRef.nativeElement.innerText+a
         this.updateContent()
         console.log(" this.refe_value", this.refe_value)
        }else{
        this.name_value.push(schedule_data.name)
        this.id_value.push(schedule_data.id)
        }
        this.schedule_data.push(schedule_data)

      } else {
        this.form_data = schedule_data
      }
      this.multidata.push(this.form_data)
      this.reporttypecreate.get('Schdularmaster').reset()
      console.log("create check",this.multidata)
      console.log("create check2",this.id_value)
      console.log("create check3",this.refe_id)
      console.log("create check4",this.schedule_data)

    }
  
  }
  report_master_create: any;
  reportmastercreatedata(report_value) {
    this.report_master_submit_btn = true;
    let reports = report_value
    if (reports.reportmaster_name == "" || reports.reportmaster_name == null || reports.reportmaster_name == undefined) {
      this.toastr.warning("", "Please Enter The Name")
      return false
    }
    if (reports.status == "" || reports.status == null || reports.status == undefined) {
      this.toastr.warning("", "Please Choose The GL Or SL")
      return false
    }
    if (reports.customer == "" || reports.customer == null || reports.customer == undefined) {
      this.toastr.warning("", "Please Choose The SR or CR")
      return false
    }
    if (reports.customer == "" || reports.is_schedule == null || reports.is_schedule == undefined) {
      this.toastr.warning("", "Please Choose The Is Schedule 0 or Is Schedule 1 ")
      return false
    }
    // if(!reports.is_quarter){
    //   this.toastr.warning("", "Please Choose Is Quarter ")
    // }
    console.log("reports", reports)
    if (reports.customer == 'ST') {
      this.reportmaster_type = '1'
    } else {
      this.reportmaster_type = '2'
    }
    if (this.report_master_edit_create == 'edit') {
      this.report_master_create = {
        name: reports.reportmaster_name != null ? reports.reportmaster_name : "",
        report_source: reports.status != null ? reports.status : "",
        report_type: this.reportmaster_type != null ? this.reportmaster_type : "",
        flag: reports.is_schedule!= null ? reports.is_schedule : "",
        id: this.repo_master_edit_create_id,
        Quarter:reports?.is_quarter?1:''
      };
    } else {
      this.report_master_create = {
        name: reports.reportmaster_name != null ? reports.reportmaster_name : "",
        report_source: reports.status != null ? reports.status : "",
        report_type: this.reportmaster_type != null ? this.reportmaster_type : "",
        flag: reports.is_schedule!= null ? reports.is_schedule : "",
        Quarter:reports?.is_quarter?1:''
      };
    }
    this.spinnerService.show()
    this.drsService.reportmastercreatedata(this.report_master_create).subscribe((results: any) => {
      this.spinnerService.hide()
      this.report_master_edit_create = ''
      let data = results["data"];
      if (results.set_code == "SUCCESS") {
        this.toastr.success("", results.set_description)
        this.ADD = ''
        this.deff = ''
        this.report_mas_close.nativeElement.click();
        this.reportmaster_close()
      } else {
        this.toastr.warning("", results.set_description)
        this.reportmaster_close()
      }
      this.report_list = data;
      this.drs_report_summary("");
      this.reportmaster.reset();
    }, error => {
      this.spinnerService.hide()
    })

  }
  report_heade_create: any
  report_heade_create_edit: any
  reportheadercreatedata(reporthead) {
    let values = reporthead
    console.log("values", values)
    if (values.reportheadercreate_master == "" || values.reportheadercreate_master == null || values.reportheadercreate_master == undefined) {
      this.toastr.warning("", "Please Select The Report Master")
      return false
    }
    if (values.reportheadercreate_name == "" || values.reportheadercreate_name == null || values.reportheadercreate_name == undefined) {
      this.toastr.warning("", "Please Enter The Name")
      return false
    }
    if (this.report_heade_create_edit == "edit") {
      this.report_heade_create = {
        name: values.reportheadercreate_name,
        report_master: values.reportheadercreate_master.id,
        id: this.report_heade_create_edit_id
      }
    } else {
      this.report_heade_create = {
        name: values.reportheadercreate_name,
        report_master: values.reportheadercreate_master.id,
      }
    }
    this.spinnerService.show()
    this.drsService.reportheadercreatedata(this.report_heade_create).subscribe((results: any) => {
      this.spinnerService.hide()
      this.report_heade_create_edit = ''
      let data = results["data"];
      if (results.set_code == "SUCCESS") {
        this.toastr.success("", results.set_description)
        this.report_repot_close.nativeElement.click();
        this.reportmaster_close_create()
      } else {
        this.toastr.warning("", results.set_description)
        this.reportmaster_close_create()
      }
      // this.reportmaster_close_create()
      this.drs_report_header_summary("");
      this.reportheadercreate.reset();
    }, error => {
      this.spinnerService.hide()
    })
  }
  reportgroup_create_edit: any;
  reportgroup_create: any
  reportgroupcreatedata(params) {
    let value = params
    if (value.reportgroupcreate_head == "" || value.reportgroupcreate_head == null || value.reportgroupcreate_head == undefined) {
      this.toastr.warning("", "Please Select The Report Header")
      return false
    }
    if (value.reportgroupcreate_name == "" || value.reportgroupcreate_name == null || value.reportgroupcreate_name == undefined) {
      this.toastr.warning("", "Please Enter The Name")
      return false
    }
    

    console.log("value", value)
    if (this.reportgroup_create_edit == "edit") {
      this.reportgroup_create = {
        name: value.reportgroupcreate_name,
        header: value.reportgroupcreate_head.id,
        id: this.reportgroup_create_edit_id
      };
    } else {
      this.reportgroup_create = {
        name: value.reportgroupcreate_name,
        header: value.reportgroupcreate_head.id,
      };
    }
    this.spinnerService.show()
    this.drsService.reportgroupcreatedata(this.reportgroup_create).subscribe((results: any) => {
      this.spinnerService.hide()
      this.reportgroup_create_edit = ""
      let data = results["data"];
      if (results.set_code == "SUCCESS") {
        this.toastr.success("", results.set_description)
        this.report_group_close.nativeElement.click();
        this.reportgroup_close()
      } else {
        this.toastr.warning("", results.set_description)
        this.reportgroup_close()
      }
      this.drs_report_group_summary("");
    }, error => {
      this.spinnerService.hide()
    })
  }
  reporttype_create: any
  reporttype_create_edit: any
  group_header: any
  reporttypecreatedata(params) {
    let value = params
    if (value.reporttypecreate_name == "" || value.reporttypecreate_name == null || value.reporttypecreate_name == undefined) {
      this.toastr.warning("", "Please Enter The Name")
      return false
    }
    if (value.type == "" || value.type == null || value.type == undefined) {
      this.toastr.warning("", "Please Select The Source Type")
      return false
    }
    if (value.type.id == 1) {
      if (value.report_master_data_item_modal == "" || value.report_master_data_item_modal == null || value.report_master_data_item_modal == undefined) {
        this.toastr.warning("", "Please Select The Report Master")
        return false
      }
      if (value.reportgroup_create_head == "" || value.reportgroup_create_head == null || value.reportgroup_create_head == undefined) {
        this.toastr.warning("", "Please Select The Report Header")
        return false
      }      
    } else {
      if (value.reporttypecreate_group == "" || value.reporttype_sum_group == null || value.reporttype_sum_group == undefined) {
        this.toastr.warning("", "Please Select The Report Group")
        return false
      }
    }
    if (value.Schdular_type == "" || value.Schdular_type == null || value.Schdular_type == undefined) {
      this.toastr.warning("", "Please Select The Report Type")
      return false
    }
    if (value.Schdular_type.id == 1) {
      if (value.Schdularmaster == "" || value.Schdularmaster == null || value.Schdularmaster == undefined) {
        this.toastr.warning("", "Please Select The Schedule Master")
        return false
      }
    }else{
      if(this.editableContentRef.nativeElement.innerText == "\n" || this.editableContentRef.nativeElement.innerText == null || this.editableContentRef.nativeElement.innerText == undefined || this.editableContentRef.nativeElement.innerText == "" ){
        this.toastr.warning("", "Please Enter The Template")
        return false
      }
    }
    
    console.log("value", value)
    let flags
    if (value.type.id == 1) {
      this.group_header = value.reportgroup_create_head.id
    } else {
      this.group_header = value.reporttype_sum_group.id
    }
    if (this.reporttypecreate.value.Schdular_type?.name == "Item") {
      this.final_valuess = this.reporttypecreate.value.Schdularmaster.id
      flags = 1
    } else {
      flags = 2
      let rep_value
    
      
      
      

      this.schdule_value = this.editableContentRef.nativeElement.innerText;
      // this.schdule_value = this.reporttypecreate.value.Schdularmaster.id
      this.id_value
      console.log("value5", this.id_value)
      console.log("value6", this.schdule_value)
      console.log("new_value", this.schedule_data)

      const extractedNames = this.schdule_value.split(/[\+\-]/).map(name => name.trim()).filter(name => name !== "");

const matchedIds = this.schedule_data
    .filter(item => extractedNames.includes(item.name))
    .map(item => item.id);

console.log("Matched and removed id's",matchedIds); 
this.match_ids= matchedIds;

const result = this.schdule_value.replace(/[^+\-]+/g, match => {
  const found = this.schedule_data.find(item => item.name.trim() === match.trim());
  return found ? found.id.toString() : match; 
});

console.log("Spl charc output",result); 

this.final_valuess= result

// if (/[^\d+\-]/.test(this.final_valuess)) {
//   this.toastr.warning("Please Submit Correct Schedule Name")
//   console.log("Contains strings");  
//   return false  
// } else {
//   console.log("Only numbers with + and -");  
// }
      let value6 = this.schdule_value;
      let value7 = this.id_value; 
      let specialChars = "+";

this.result = [];

if( this.reporttypecreate.value.Schdular_type?.name == "Element"){
  for (let i = 0; i < Math.max(specialChars.length, value7.length); i++) {
    if (i < specialChars.length) {
      this.result.push(value7[i]); 
    } else {
      this.result.push(value7[i % value7.length]);
    }
  }

  this.out_value= this.result
  
  let output = this.result.join("+");
  if (output.endsWith("+")) {
    output = output.slice(0, -1);
  }  
  
  console.log("Output:", output);  
  console.log("Output:", output);
  this.schdule_value = output    
  console.log('Final schdule_value:', this.schdule_value);
} else{
  for (let i = 0; i < Math.max(specialChars.length, value6.length); i++) {
    if (i < specialChars.length) {
      this.result.push(value6[i]); 
    } else {
      this.result.push(value6[i % value7.length]);
    }
  }
  this.out_value= this.result  
  let output = this.result.join("+");
  if (output.endsWith("+")) {
    output = output.slice(0, -1);
  } 
  console.log("Output:", output);  
  console.log("Output:", output);
  this.schdule_value = output
  console.log('Final schdule_value:', this.schdule_value);
}



// const loopLength = Math.min(specialChars.length, value7.length);

// for (let i = 0; i < loopLength; i++) {
//  this. result.push(value7[i]);
// }


      if(this.reporttype_create_edit=='edit'){
        let names= this.array_edit_data.filter(x=> x !='+' && x !='-')
        let ids= this.refe_id.filter(x=> x !='+' && x !='-')

      for(let i = 0; i <names.length; i++){
        console.log("ids ", ids[i])
        rep_value = this.schdule_value.replaceAll(this.array_edit_data[i], this.refe_id[i])
        this.schdule_value = rep_value.replace(/(\r\n|\n|\r)/gm, "");
      }
    }else{
      for (let i = 0; i < this.name_value.length; i++) {
        console.log("this.name_value[i]", this.name_value[i])
        console.log("this.id_value[i] ", this.id_value[i])
        rep_value = this.schdule_value.replaceAll(this.name_value[i], this.id_value[i])
        this.schdule_value = rep_value.replace(/(\r\n|\n|\r)/gm, "");
      }
    }
  }  

  
   
    

    console.log('hghgfgfg', this.schdule_value)
    if (this.reporttype_create_edit == "edit") {
      this.reporttype_create = {
        name: value.reporttypecreate_name,
        group: this.group_header,
        template: this.final_valuess,
        flag: value.type.id,
        parent_type: flags,
        id: this.reporttype_create_edit_id,
        code: value.reporttypecreate_number,
      };
    } else {
      this.reporttype_create = {
        name: value.reporttypecreate_name,
        group: this.group_header,
        template: this.final_valuess,
        flag: value.type.id,
        parent_type: flags,
        code: value.reporttypecreate_number,


      };
    }
    console.log("",this.reporttype_create)
    this.spinnerService.show()
    this.drsService.reporttypecreatedata(this.reporttype_create).subscribe((results: any) => {
      this.spinnerService.hide()
      this.reporttype_create_edit = ""
      this.Avalue = ""
      this.Evalue = ""
      let data = results["data"];
      if (results.set_code == "SUCCESS") {
        this.toastr.success("", results.set_description)
        this.report_item_close.nativeElement.click();
        this.Reporttype_close()
        this.drs_report_type_summarys("");
        this.id_value=[]
        // this.id_value= ""
        // this.result=[]
      } else {
        this.toastr.warning("", results.set_description)
        this.Reporttype_close()
        this.id_value=[]
        // this.id_value=""
        // this.result=[]
      }
      // this.report_list = data;
      
    }, error => {
      this.spinnerService.hide()
    })
    
  }

  convertToIds(expression: string, mappings: { name: string; id: number }[]): string {
    // Create a map for quick lookup
    const nameToIdMap = new Map(mappings.map((item) => [item.name, item.id]));
  
    // Replace text area names with their corresponding IDs
    const resultExpression = expression.replace(/\b(Interest Earned|Interest Expended|Operating Expenses)\b/g, (match) => {
      return nameToIdMap.get(match)?.toString() || match; // Replace with ID or keep as-is
    });
  
    return resultExpression;
  }
  
  
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    // console.log("Paste:")

  }
  preventTyping(event: KeyboardEvent): void {
    const allowedKeys = [
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 
      'Backspace', 'Tab', 'Delete', 
      'Home', 'End'
  ];

  // const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>_\-+=;'/\\`~[\]]/;
  const specialCharacterRegex = /^[+-]$/;


  if (!allowedKeys.includes(event.key) && !specialCharacterRegex.test(event.key)) {
      event.preventDefault(); 
  }
  else{
    if(this.reporttype_create_edit=='edit'){
        this.array_edit_data.push(event.key)
    }
  }
}
  schdule_master_create_edit: any;
  schdularval: any;
  schdularmastercreatedata(params) {
    let value = params
    console.log("value", value)
    if (value.Schdularmastercreate_name == "" || value.Schdularmastercreate_name == null || value.Schdularmastercreate_name == undefined) {
      this.toastr.warning("", "Please Enter The Name")
      return false
    }
    // if (value.Schdularmastercreate_report == "" || value.Schdularmastercreate_report == null || value.Schdularmastercreate_report == undefined) {
    //   this.toastr.warning("", "Please Enter The Report Item")
    //   return false
    // }
    if (value.yesorno == "" || value.yesorno == null || value.yesorno == undefined) {
      this.toastr.warning("", "Please Enter The Yes or No")
      return false
    }
    if (this.schdule_master_create_edit == "edit") {
      this.schdularval = {
        name: value.Schdularmastercreate_name,
        upper_hierarchy: value.yesorno,
        id: this.schdule_master_create_edit_id
      };
    } else {
      this.schdularval = {
        name: value.Schdularmastercreate_name,
        upper_hierarchy: value.yesorno,
      };
    }
    this.spinnerService.show()
    this.drsService.schdularmastercreatedata(this.schdularval).subscribe((results: any) => {
      this.spinnerService.hide()
      let data = results["data"];
      if (results.set_code == "SUCCESS") {
        this.toastr.success("", results.set_description)
        this.schrdule_mas_close.nativeElement.click();
      } else {
        this.toastr.warning("", results.set_description)
      }
      this.drs_schdular_master_summary("");
    }, error => {
      this.spinnerService.hide()
    })
  }
  schdular_createtype: any
  schdular_createtype_edit: any
  schdulartypecreatedata(params) {
    let value = params
    console.log("value", value)
    if (value.Schdulartypecreate_name == "" || value.Schdulartypecreate_name == null || value.Schdulartypecreate_name == undefined) {
      this.toastr.warning("", "Please Enter The Name")
      return false
    }
    if (value.Schdulartypecreate_sdlmaster == "" || value.Schdulartypecreate_sdlmaster == null || value.Schdulartypecreate_sdlmaster == undefined) {
      this.toastr.warning("", "Please Enter The Schedule Master")
      return false
    }
    if (value.Schdulartypecreate_type_name == "" || value.Schdulartypecreate_type_name == null || value.Schdulartypecreate_type_name == undefined) {
      this.toastr.warning("", "Please Enter The Template")
      return false
    }
    if (this.schdular_createtype_edit == "edit") {
      this.schdular_createtype = {
        name: value.Schdulartypecreate_name,
        scheduler: value.Schdulartypecreate_sdlmaster.id,
        template: value.Schdulartypecreate_type_name,
        id: this.schdular_createtype_edit_id
      };
    } else {
      this.schdular_createtype = {
        name: value.Schdulartypecreate_name,
        scheduler: value.Schdulartypecreate_sdlmaster.id,
        template: value.Schdulartypecreate_type_name,
      };
    }
    this.spinnerService.show()
    this.drsService.schdulartypecreatedata(this.schdular_createtype).subscribe((results: any) => {
      this.spinnerService.hide()
      this.schdular_createtype_edit = ""
      let data = results["data"];
      if (results.set_code == "SUCCESS") {
        this.toastr.success("", results.set_description)
        this.schrdule_item_close.nativeElement.click();
      } else {
        this.toastr.warning("", results.set_description)
      }
    }, error => {
      this.spinnerService.hide()
    })
  }
  repo_master_edit_create_id: any
  ReportMater_edit(report, deff) {
    this.Evalue = deff

    if (deff == 'edit') {
      this.report_master_submit_btn = true;
      this.rep_mas_view = false;
    } else {
      this.report_master_submit_btn = false;
      this.rep_mas_view = true
    }
    let report_id = report.id;
    this.repo_master_edit_create_id = report_id
    this.report_master_edit_create = deff
    console.log("report report_id", report_id)
    this.spinnerService.show()
    this.drsService.ReportMater_edit(report_id).subscribe((results: any) => {
      this.spinnerService.hide()
      let data = results;
      if (data.report_source == "GL") {
        this.GL_value = data.report_source
      } else {
        this.GL_value = data.report_source
      }
      if (data.report_type == "1") {
        this.SL_value = 'ST'
      } else {
        this.SL_value = 'CM'
      }
      if (data.Is_schedule == "0") {
        this.Is_value = '0'
      } else {
        this.Is_value = '1'
      }
      console.log('this.report_list', data)
      this.reportmaster.patchValue({
        reportmaster_name: data.name != null ? data.name : '',
        status: this.GL_value != null ? this.GL_value : '',
        customer: this.SL_value != null ? this.SL_value : '',
        is_schedule: this.Is_value!= null? this.Is_value: '' ,
        is_quarter:data?.Quarter?true:false
      })
    });
  }
  ReportMater_view(report) {
    let reportview_id = report.id;
    this.spinnerService.show()
    this.drsService.ReportMater_view(reportview_id).subscribe((results: any) => {
      this.spinnerService.hide()
      let data = results;
      if (data.report_source == "GL") {
        this.GL_value = data.report_source
      } else {
        this.GL_value = data.report_source
      }
      if (data.report_type == "1") {
        this.SL_value = 'ST'
      } else {
        this.SL_value = 'CM'
      }
      this.reportmaster.patchValue({
        reportmaster_name: data.name != null ? data.name : '',
        status: this.GL_value != null ? this.GL_value : '',
        customer: this.SL_value != null ? this.SL_value : '',
      })
    });
  }
  ReportMater_delete(delete_id) {
    let reportdelete = delete_id.id;
    this.evantlue = 0
    console.log("evantlue", this.evantlue)
    this.spinnerService.show()
    this.drsService.ReportMater_delete(reportdelete, this.evantlue).subscribe((results: any) => {
      this.spinnerService.hide()
      if (results.message == "Successfully Deleted") {
        this.toastr.success('', results.message)
        this.drs_report_summary("");
      } else {
        this.toastr.warning('', results.message)
      }
     
    });
  }
  report_heade_create_edit_id: any;
  ReportHeadrer_edit(report, deff) {
    let report_id = report.id;
    if (deff == 'edit') {
      this.rep_Head_view = false;
      this.report_head_submit_btn = true;
    } else {
      this.rep_Head_view = true;
      this.report_head_submit_btn = false;
    }
    this.report_heade_create_edit = deff
    this.report_heade_create_edit_id = report_id
    this.spinnerService.show()
    this.drsService.ReportHeadrer_edit(report_id).subscribe((results: any) => {
      this.spinnerService.hide()
      let data = results;
      console.log("data", data.report_master)
      this.reportheadercreate.patchValue({
        reportheadercreate_name: data.name != null ? data.name : '',
        reportheadercreate_master: data.report_master != null ? data.report_master : '',
      })
    });
  }

  ReportHeadrer_view(report) {
    let reportview_id = report.id;

    this.spinnerService.show()
    this.drsService.ReportHeadrer_view(reportview_id).subscribe((results: any) => {
      this.spinnerService.hide()
      let data = results["data"];
      this.report_list = data;
    });
  }
  ReportHeadrer_delete(delete_id) {
    let reportdelete = delete_id.id;
    let evantlue = 0;
    this.spinnerService.show()
    this.drsService.ReportHeadrer_delete(reportdelete, evantlue).subscribe((results: any) => {
      this.spinnerService.hide()
      if (results.message == "Successfully Deleted") {
        this.toastr.success('', results.message)
      } else {
        this.toastr.warning('', results.message)
      }
      this.drs_report_header_summary("");
    });
  }
  reportgroup_create_edit_id: any
  Reportgroup_edit(report, deff) {
    let report_id = report.id;
    if (deff == 'edit') {
      this.report_group_sub_btn = true;
      this.Report_grp_view = false;
    } else {
      this.report_group_sub_btn = false;
      this.Report_grp_view = true;
    }
    this.reportgroup_create_edit = deff
    this.reportgroup_create_edit_id = report_id
    this.spinnerService.show()
    this.drsService.Reportgroup_edit(report_id).subscribe((results: any) => {
      this.spinnerService.hide()
      let data = results;
      console.log('this.report_list = data', data)
      this.reportgroupcreate.patchValue({
        reportgroupcreate_name: data.name != null ? data.name : '',
        reportgroupcreate_head: data.header != null ? data.header : '',

      })
    });
  }
  Reportgroup_view(report) {
    let reportview_id = report.id;
    this.spinnerService.show()
    this.drsService.Reportgroup_view(reportview_id).subscribe((results: any) => {
      this.spinnerService.hide()
      let data = results;
      this.reportgroupcreate.patchValue({
        reportgroupcreate_name: data.name != null ? data.name : '',
        reportgroupcreate_head: data.header != null ? data.header : '',
      })
    });
  }
  Reportgroup_delete(delete_id) {
    let reportdelete = delete_id.id;
    let evantlue = 0;
    this.spinnerService.show()
    this.drsService.Reportgroup_delete(reportdelete, evantlue).subscribe((results: any) => {
      this.spinnerService.hide()
      if (results.message == "Successfully Deleted") {
        this.toastr.success('', results.message)
      } else {
        this.toastr.warning('', results.message)
      }
      this.drs_report_group_summary("");
    });
  }
  reporttype_create_edit_id: any;
  flag_obj

  Reporttypeedit(report, deff) {
    this.report_datas_ele = report
    this.element_deffs = deff
    let report_id = report.id;
    if (deff == 'edit') {
      this.report_type_sub_btn = true;
      this.Report_itm_view = false;
      this.isEditable = true;
    } else {
      this.report_type_sub_btn = false;
      this.Report_itm_view = true;
      this.isEditable = false;
    }
    this.reporttype_create_edit = deff
    this.reporttype_create_edit_id = report_id
    this.spinnerService.show()
    this.drsService.Reporttypeedit(report_id).subscribe((results: any) => {
      this.spinnerService.hide()
      let data = results;

      let dataaaa= data.schdule_mas_temp
      this.array_edit_data=data.schdule_mas_temp ? data.schdule_mas_temp :[]
      this.refe_id=data.template ? data.template : []
      this.schedule_data=[]
      let ids = this.refe_id.filter(x=> x!='+' && x != '-')
      let names = this.array_edit_data.filter(x=> x!='+' && x != '-')
      for (let i=0 ; i< ids?.length; i++){        
        let match = this.Schdularmaster_list.filter(x=> x.id == ids[i])[0]
        if(match != undefined){
          this.schedule_data.push(match)
        }
        else{
           this.drsService.Schdularmaster_dropdown(names[i], 1).subscribe((results) => {
                if(results[data].length >0 )
                  this.schedule_data.push(results[data][0])
              })
        }
      }
   
      if (data.flag == 1) {
        if (data?.parent_type?.name == "Element") {
          let a=""
      let value_reg
      let resultObject = {};
      let key_assign
      for(let data of dataaaa){     
             a=a+data
        console.log("aa",a)      
      }
      let dataa_id=data.template
      let b=""
      for(let data of dataa_id){     
        b=b+data
        console.log("bb",b)      
       }
      console.log("aaa",a)
      console.log("this.multidata",this.multidata)
      this.refe_value=a
          this.elem_hide = false;
          this.updateContent()
          this.header_form_data = true
          this.group_form_data = false
          this.flag_obj = { "id": 1, "name": 'Report Header' }
          this.reporttypecreate.patchValue({
            reporttypecreate_name: data.name != null ? data.name : '',
            reporttypecreate_number: data.number != null ? data.number : '',
            type: this.flag_obj.name != null ? this.flag_obj : "",
            reportgroup_create_head: data.group.name != null ? data.group : "",
            Schdular_type: data.parent_type != null ? data.parent_type : '',
            report_master_data_item_modal: data.report_master.name != null ? data.report_master : '',
          })
        } else {
          this.elem_hide = true;
          this.header_form_data = true
          this.group_form_data = false
          this.elem_hide = true;
          this.flag_obj = { "id": 1, "name": 'Report Header' }
          this.reporttypecreate.patchValue({
            reporttypecreate_name: data.name != null ? data.name : '',
            reporttypecreate_number: data.number != null ? data.number : '',
            type: this.flag_obj.name != null ? this.flag_obj : "",
            reportgroup_create_head: data?.group?.name != null ? data.group : "",
            Schdular_type: data?.parent_type?.name != null ? data?.parent_type : '',
            Schdularmaster: data?.schdule_mas_temp != null ? data?.schdule_mas_temp : '',
            report_master_data_item_modal: data?.report_master?.name != null ? data?.report_master : '',
          })
        }
      } else {
        if (data?.parent_type?.name == "Element") {
          this.elem_hide = false;
          this.updateContent()
          this.header_form_data = false
          this.group_form_data = true
          this.flag_obj = { "id": 2, "name": 'Report Group' }
          this.reporttypecreate.patchValue({
            reporttypecreate_name: data.name != null ? data.name : '',
            reporttypecreate_number: data.number != null ? data.number : '',
            type: this.flag_obj.name != null ? this.flag_obj : "",
            reporttype_sum_group: data?.group?.name != null ? data.group : '',
            // Schdularmaster: data.schdule_mas_temp != null ? data.schdule_mas_temp : '',
            Schdular_type: data?.parent_type?.name != null ? data?.parent_type : '',
            report_master_data_item_modal: data?.report_master?.name != null ? data.report_master : '',
          })
        } else {
          this.elem_hide = true;
          this.flag_obj = { "id": 2, "name": 'Report Group' }
          this.header_form_data = false;
          this.group_form_data = true;
          this.elem_hide = true;
          this.reporttypecreate.patchValue({
            reporttypecreate_name: data.name != null ? data.name : '',
            reporttypecreate_number: data.number != null ? data.number : '',
            type: this.flag_obj.name != null ? this.flag_obj : "",
            reporttype_sum_group: data.group.name != null ? data.group : '',
            Schdularmaster: data.schdule_mas_temp != null ? data.schdule_mas_temp : '',
            Schdular_type: data?.parent_type?.name != null ? data.parent_type : '',
            report_master_data_item_modal: data?.report_master?.name != null ? data.report_master : '',
          })
        }
      }
      this.drs_report_type_summarys("")
      console.log('this.report_list = data', data)
    });
  } 
  Reporttype_view(report) {
    let reportview_id = report.id;
    this.spinnerService.show()
    this.drsService.Reporttype_view(reportview_id).subscribe((results: any) => {
      this.spinnerService.hide()
      let data = results;
      this.reporttypecreate.patchValue({
        reporttypecreate_name: data.name != null ? data.name : '',
        reporttype_sum_group: data.group != null ? data.group : '',
        reporttypecreate_type_name: data.template != null ? data.template : '',
      })
    });
  }
  Reporttype_delete(delete_id) {
    let reportdelete = delete_id.id;
    let evantlue = 0;
    this.spinnerService.show()
    this.drsService.Reporttype_delete(reportdelete, evantlue).subscribe((results: any) => {
      this.spinnerService.hide()
      if (results.message == "Successfully Deleted") {
        this.toastr.success('', results.message)
      } else {
        this.toastr.warning('', results.message)
      }
      this.drs_report_type_summarys("");
    });
  }
  SchdularMater_edit(report, deff) {
    let report_id = report.id
    if (deff == 'edit') {
      this.scdular_mas_sub_btn = true;
      this.schd_mas_view = false;
    } else {
      this.scdular_mas_sub_btn = false;
      this.schd_mas_view = true;
    }
    this.schdule_master_create_edit = deff
    this.schdule_master_create_edit_id = report_id
    this.spinnerService.show()
    this.drsService.SchdularMater_edit(report_id).subscribe((results: any) => {
      this.spinnerService.hide()
      let data = results;

      console.log('this.report_list = data', data)
      this.Schdularmastercreate.patchValue({
        Schdularmastercreate_name: data.name != null ? data.name : '',
        Schdularmastercreate_report: data.report_type != null ? data.report_type : '',
        yesorno: data.upper_hierarchy != null ? data.upper_hierarchy : '',
      })
    });
  }
  schdule_master_create_edit_id: any
  SchdularMater_view(report) {
    let reportview_id = report.id;
    this.spinnerService.show()
    this.drsService.SchdularMater_view(reportview_id).subscribe((results: any) => {
      this.spinnerService.hide()
      let data = results;
      this.Schdularmastercreate.patchValue({
        Schdularmastercreate_name: data.name != null ? data.name : '',
        Schdularmastercreate_report: data.report_type != null ? data.report_type : '',
        yesorno: data.upper_hierarchy != null ? data.upper_hierarchy : '',
      })
    });
  }
  SchdularMater_delete(delete_id) {
    let reportdelete = delete_id.id;
    let evantlue = 0;
    this.spinnerService.show()
    this.drsService.SchdularMater_delete(reportdelete, evantlue).subscribe((results: any) => {
      this.spinnerService.hide()
      if (results.message == "Successfully Deleted") {
        this.toastr.success('', results.message)
      } else {
        this.toastr.warning('', results.message)
      }
      this.drs_schdular_master_summary("");
    });
  }
  schdular_createtype_edit_id: any
  report_master_edit_create_id: any


  Schdulartype_view(report) {
    let reportview_id = report.id;
    this.spinnerService.show()
    this.drsService.Schdulartype_view(reportview_id).subscribe((results: any) => {
      this.spinnerService.hide()
      let data = results;
      this.Schdulartypecreate.patchValue({
        Schdulartypecreate_name: data.name != null ? data.name : '',
        Schdulartypecreate_sdlmaster: data.scheduler != null ? data.scheduler : '',
        Schdulartypecreate_type_name: data.template != null ? data.template : '',
      })
    });
  }
  report_mast_add(ADD) {
    this.report_master_submit_btn = true;
    this.rep_mas_view = false
    this.Avalue = ADD
    this.report_master_edit_create=ADD
    this.reportmaster.reset()
    document.getElementById('exampleModal').classList.add('show')
    const body = document.body;
    const scrollY = body.style.top;
    body.style.position = 'fixed';
    body.style.width = '100%';
  }
  reportmaster_close(){
    const body = document.body;
    body.style.position = '';
    body.style.top = '';
  }
  report_Header_add(deff) {
    this.report_head_submit_btn = true;
    this.report_heade_create_edit=deff
    this.rep_Head_view = false
    this.reportheadercreate.reset()
    document.getElementById('exampleModal1').classList.add('show')
    const body = document.body;
    const scrollY = body.style.top;
    body.style.position = 'fixed';
    body.style.width = '100%';
  }
  reportmaster_close_create(){
    const body = document.body;
    body.style.position = '';
    body.style.top = '';
  }
  report_group_add(deff) {
    this.report_group_sub_btn = true;
    this.reportgroup_create_edit=deff
    this.Report_grp_view = false
    this.reportgroupcreate.reset()
    document.getElementById('exampleModal2').classList.add('show')
    const body = document.body;
    const scrollY = body.style.top;
    body.style.position = 'fixed';
    body.style.width = '100%';
  }
  reportgroup_close(){
    const body = document.body;
    body.style.position = '';
    body.style.top = '';
  }

  report_Type_add(deff) {
    this.reporttype_create_edit=deff   
    this.report_type_sub_btn = true;
    this.reporttypecreate.reset()
    this.Report_itm_view = false
    this.header_form_data = false
    this.group_form_data = false
    this.isEditable = true;
    this.elem_hide = true
    document.getElementById('exampleModal3').classList.add('show')
    const body = document.body;
    const scrollY = body.style.top;
    body.style.position = 'fixed';
    body.style.width = '100%';
  }
  Reporttype_close(){
    const body = document.body;
    body.style.position = '';
    body.style.top = '';
    this.result.length = 0;
    // this.id_value=[]
    this.id_value=[]
    // this.id_value=""
  }
  
  types_values(types) {
    let type_click = types.id
    if (type_click == 1) {
      this.header_form_data = true
      this.group_form_data = false
      let ngset= 1
      this.reporttypecreate.get("reportgroup_summary_head").reset();
      this.reporttypecreate.get("report_master_data_item_modal").reset();
    } else {
      this.header_form_data = false;
      this.group_form_data = true
      let ngset= 2
      this.reporttypecreate.get("reporttype_sum_group").reset();
    }
  }
  type_values1(type) {
    let type_click = type.id
    if (type_click == 1) {
      this.header_form_data = true
      this.group_form_data = false
      this.report_type.get("reportgroup_summary_head").reset();
      this.reporttypecreate.get("report_master_data_item_modal").reset();
      this.reporttypecreate.get("reportgroup_create_head").reset();
    } else {
      this.header_form_data = false;
      this.group_form_data = true      
      this.report_type.get("reporttypecreate_group").reset();
      this.reporttypecreate.get("reporttype_sum_group").reset();
    }
  }


  links = ['Report Master', 'Report Header', 'Report Group', 'Report Item', 'Schedule Master', 'Schedule Item', 'Exception Schedule'];
  activeLink = this.links[0];
  background: ThemePalette = undefined;

  toggleBackground() {
    this.background = this.background ? undefined : 'primary';
  }

  addLink() {
    this.links.push(`Link ${this.links.length + 1}`);
  }
  colse() {
    this.reporttypecreate.reset()
    this.group_form_data = false;
    this.header_form_data = false;
  }

  Report_Master_Tab() {
    this.reportbuilder.reset()    
    this.drs_report_summary("");    
    this.currency_master_screen= false;
    this.Exception_schedule_screen= false;
    this.scdule_master_screen=false;

  }
  Report_Header_Tab() {
    this.reportheader.reset()

    if(this.report_hearder_con == false){
      this.drs_report_header_summary("");
    }else{
    }
    this.currency_master_screen= false;
    this.Exception_schedule_screen= false;
    this.scdule_master_screen=false;
  }
  Report_Group_Tab() {
    this.report_Group.reset()
    if(this.report_group_con == false){
      this.drs_report_group_summary("");
    }else{
    }
    this.currency_master_screen= false;
    this.Exception_schedule_screen= false;
    this.scdule_master_screen=false;
  }
  Report_Type_Tab() {
    this.Schdularmaster_dropdown()
    this.report_type.reset()
    // this.report_type.reset()
    this.group_form_data = false
    this.header_form_data = false
    if(this.report_item_con == false){
      this.drs_report_type_summarys("");
    }else{
    }
    this.currency_master_screen= false;
    this.scdule_master_screen=false;
    this.Exception_schedule_screen= false

    // this.scdule_master_screen=true

  }
  Schedule_Master_Tab() {
    this.scdule_master_screen = true;
    this.currency_master_screen= false; 
    this.Exception_schedule_screen= false

  }
  Schedule_summary(arg0: string) {
    throw new Error("Method not implemented.");
  }
  reportmasterdrop1() {
    this.rhcDrop = this.reportheadercreate.controls["reportheadercreate_master"].value;
    let name = this.rhcDrop?.name ?? "";

    // this.spinnerService.show()

    let prokeyvalue: String = "";
    this.getreport_header_create__drop(prokeyvalue);
    this.reportheadercreate.get('reportheadercreate_master').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),

        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.drsService.reportmasterdrop(value, 1)
          .pipe(
            finalize(() => {
              console.log(value)

            }),
          )
        )
      )
      .subscribe((results: any) => {
        // this.spinnerService.hide()
        let data5 = results["data"]
        this.reportmaster_list1 = data5;
        console.log("report_create_dropdown", this.reportmaster_list1)
        this.isLoading = false
      })

  }
  private getreport_header_create__drop(prokeyvalue) {
    this.drsService.reportmasterdrop(prokeyvalue, 1)
      .subscribe((results: any) => {
        this.spinnerService.hide()
        this.reportmaster_list1 = results["data"]
        console.log("report_create_dropdown", this.reportmaster_list1)
        this.isLoading = false
      })


  }
  RCdropdownScroll() {
    this.has_nextFin5 = true;
    this.has_previousFin5 = true;
    this.currentpageFin5 = 1
    let flag = 0
    setTimeout(() => {
      if (
        this.Reportcreatetype &&
        this.autocompleteTrigger &&
        this.Reportcreatetype.panel
      ) {
        fromEvent(this.Reportcreatetype.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.Reportcreatetype.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.Reportcreatetype.panel.nativeElement.scrollTop;
            const scrollHeight = this.Reportcreatetype.panel.nativeElement.scrollHeight;
            const elementHeight = this.Reportcreatetype.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextFin5 === true) {
                this.drsService.reportmasterdrop(this.RCContactInput.nativeElement.value, this.currentpageFin5 + 1)
                  .subscribe((results: any[]) => {
                    let datas5 = results["data"];
                    let datapagination5 = results["pagination"];
                    this.reportmaster_list1 = this.reportmaster_list1.concat(datas5);
                    if (this.reportmaster_list1.length >= 0) {
                      this.has_nextFin5 = datapagination5.has_next;
                      this.has_previousFin5 = datapagination5.has_previous;
                      this.currentpageFin5 = datapagination5.index;
                    }
                    console.log("report_create_data:", this.reportmaster_list1)
                  })
              }

            }
          })
      }
    })

  }
  reporthead_dropdown1() {
    this.rhcDrop = this.report_type.controls["reportgroup_summary_head"].value;
    let name = this.rhDrop?.name ?? "";
   
    let report_master = ""

    // this.spinnerService.show()

    let prokeyvalue: String = "";
    this.getreport_header_create_drop(prokeyvalue, report_master);
    this.report_type.get('reportgroup_summary_head').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),

        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.drsService.reporthead_dropdown(value, 1, report_master)
          .pipe(
            finalize(() => {
              console.log(value)
            }),
          )
        )
      )
      .subscribe((results: any) => {
        // this.spinnerService.hide()
        let data6 = results["data"]
        this.reporthead_list2 = data6;
        console.log("Report_header_dropdown", this.reporthead_list2)
        this.isLoading = false
      })

  }
  private getreport_header_create_drop(prokeyvalue, report_master) {
    this.drsService.reporthead_dropdown(prokeyvalue, 1, report_master)
      .subscribe((results: any) => {
        this.spinnerService.hide()
        this.reporthead_list2 = results["data"]
        console.log("Report_header_dropdown", this.reporthead_list2)
        this.isLoading = false
      })

  }
  RHCdropdownScroll() {
    this.has_nextFin6 = true;
    this.has_previousFin6 = true;
    this.currentpageFin6 = 1
    setTimeout(() => {
      if (
        this.repor_gpr_thead &&
        this.autocompleteTrigger &&
        this.repor_gpr_thead.panel
      ) {
        fromEvent(this.repor_gpr_thead.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.repor_gpr_thead.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.repor_gpr_thead.panel.nativeElement.scrollTop;
            const scrollHeight = this.repor_gpr_thead.panel.nativeElement.scrollHeight;
            const elementHeight = this.repor_gpr_thead.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextFin6 === true) {
                this.drsService.reporthead_dropdown(this.RHCContactInput.nativeElement.value, this.currentpageFin6 + 1,"")
                  .subscribe((results: any[]) => {
                    let datas1 = results["data"];
                    let datapagination6 = results["pagination"];
                    this.reporthead_list_group = this.reporthead_list_group.concat(datas1);
                    if (this.reporthead_list_group.length >= 0) {
                      this.has_nextFin6 = datapagination6.has_next;
                      this.has_previousFin6 = datapagination6.has_previous;
                      this.currentpageFin6 = datapagination6.index;
                    }
                  })
              }

            }
          })
      }
    })

  }

  report_group_dropdown1(){
    this.rgcDrop = this.report_type.controls["reporttypecreate_group"].value;
    let name = this.rgDrop?.name ?? "";

    // this.spinnerService.show()

    let prokeyvalue: String = "";
    this.getreportgroup_create_drop(prokeyvalue);
    this.report_type.get('reporttypecreate_group').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),

        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.drsService.reportgroup_dropdown(value, 1)
          .pipe(
            finalize(() => {
              console.log(value)
            }),
          )
        )
      )
      .subscribe((results: any) => {
        // this.spinnerService.hide()
        let data7 = results["data"]
        this.report_group_list3 = data7;
        console.log("Report_group_create_dropdown", this.report_group_list3)
        this.isLoading = false
      })
  }

  private getreportgroup_create_drop(prokeyvalue) {
    this.drsService.reportgroup_dropdown(prokeyvalue, 1)
      .subscribe((results: any) => {
        this.spinnerService.hide()
        this.report_group_list3 = results["data"]
        console.log("Report_group_create_dropdown", this.report_group_list3)
        this.isLoading = false
      })


  }

  RGCdrop_downScroll(){
    this.has_nextgf = true;
    this.has_previousgf = true;
    this.currentpagegf = 1
    setTimeout(() => {
      if (
        this.reportgroupS &&
        this.autocompleteTrigger &&
        this.reportgroupS.panel
      ) {
        fromEvent(this.reportgroupS.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.reportgroupS.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.reportgroupS.panel.nativeElement.scrollTop;
            const scrollHeight = this.reportgroupS.panel.nativeElement.scrollHeight;
            const elementHeight = this.reportgroupS.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextgf === true) {
                this.drsService.reportgroup_dropdown(this.RGCC_ontactInput.nativeElement.value, this.currentpagegf + 1)
                  .subscribe((results: any[]) => {
                    let datas7 = results["data"];
                    let datapagination7 = results["pagination"];
                    this.report_group_list3 = this.report_group_list3.concat(datas7);
                    if (this.report_group_list3.length >= 0) {
                      this.has_nextgf = datapagination7.has_next;
                      this.has_previousgf = datapagination7.has_previous;
                      this.currentpagegf = datapagination7.index;
                    }
                  })
              }

            }
          })
      }
    })
  }
  reportgroup_dropdown1() {
    this.rgcDrop = this.reporttypecreate.controls["reporttype_sum_group"].value;
    let name = this.rgDrop?.name ?? "";

    // this.spinnerService.show()

    let prokeyvalue: String = "";
    this.getreport_group_create_drop(prokeyvalue);
    this.reporttypecreate.get('reporttype_sum_group').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),

        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.drsService.reportgroup_dropdown(value, 1)
          .pipe(
            finalize(() => {
              console.log(value)
            }),
          )
        )
      )
      .subscribe((results: any) => {
        // this.spinnerService.hide()
        let data7 = results["data"]
        this.reportgroup_list3 = data7;
        console.log("Report_group_create_dropdown", this.reportgroup_list3)
        this.isLoading = false
      })

  }
  private getreport_group_create_drop(prokeyvalue) {
    this.drsService.reportgroup_dropdown(prokeyvalue, 1)
      .subscribe((results: any) => {
        // this.spinnerService.hide()
        this.reportgroup_list3 = results["data"]
        console.log("Report_group_create_dropdown", this.reportgroup_list3)
        this.isLoading = false
      })


  }
  RGCdropdownScroll() {
    this.has_nextFin7 = true;
    this.has_previousFin7 = true;
    this.currentpageFin7 = 1
    setTimeout(() => {
      if (
        this.Reportgroupcreatetype &&
        this.autocompleteTrigger &&
        this.Reportgroupcreatetype.panel
      ) {
        fromEvent(this.Reportgroupcreatetype.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.Reportgroupcreatetype.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.Reportgroupcreatetype.panel.nativeElement.scrollTop;
            const scrollHeight = this.Reportgroupcreatetype.panel.nativeElement.scrollHeight;
            const elementHeight = this.Reportgroupcreatetype.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextFin7 === true) {
                this.drsService.reportgroup_dropdown(this.RGCContactInput.nativeElement.value, this.currentpageFin7 + 1)
                  .subscribe((results: any[]) => {
                    let datas7 = results["data"];
                    let datapagination7 = results["pagination"];
                    this.reportgroup_list3 = this.reportgroup_list3.concat(datas7);
                    if (this.reportgroup_list3.length >= 0) {
                      this.has_nextFin7 = datapagination7.has_next;
                      this.has_previousFin7 = datapagination7.has_previous;
                      this.currentpageFin7 = datapagination7.index;
                    }
                  })
              }

            }
          })
      }
    })

  }

  reporthead_dropdown_group() {
   
    let report_master ="" 
    this.rhtcDrop = this.reportgroupcreate.controls["reportgroupcreate_head"].value;
    let name = this.rhtcDrop?.name ?? "";

    // this.spinnerService.show()

    let prokeyvalue: String = "";
    this.getreport_header_type_create_drop(prokeyvalue, report_master);
    this.reportgroupcreate.get('reportgroupcreate_head').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),

        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.drsService.reporthead_dropdown(value, 1, report_master)
          .pipe(
            finalize(() => {
              console.log(value)
            }),
          )
        )
      )
      .subscribe((results: any) => {
        // this.spinnerService.hide()
        let data8 = results["data"]
        this.reporthead_list_group = data8;
        console.log("Report_header_Type_create_dropdown", this.reporthead_list_group)
        this.isLoading = false
      })

  }
  private getreport_header_type_create_drop(prokeyvalue, report_master) {
    this.drsService.reporthead_dropdown(prokeyvalue, 1, report_master)
      .subscribe((results: any) => {
        this.spinnerService.hide()
        this.reporthead_list_group = results["data"]
        console.log("Report_header_Type_create_dropdown", this.reporthead_list_group)
        this.isLoading = false
      })

  }
 
  RHTSdropdownScroll() {
    this.has_nextFin9 = true;
    this.has_previousFin9 = true;
    this.currentpageFin9 = 1
    setTimeout(() => {
      if (
        this.reportheadsummary &&
        this.autocompleteTrigger &&
        this.reportheadsummary.panel
      ) {
        fromEvent(this.reportheadsummary.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.reportheadsummary.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.reportheadsummary.panel.nativeElement.scrollTop;
            const scrollHeight = this.reportheadsummary.panel.nativeElement.scrollHeight;
            const elementHeight = this.reportheadsummary.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextFin9 === true) {
                this.drsService.reporthead_dropdown(this.RHTSContactInput.nativeElement.value,  this.currentpageFin9 + 1,"")
                  .subscribe((results: any[]) => {
                    let datas8 = results["data"];
                    let datapagination9 = results["pagination"];
                    this.reporthead_list2 = this.reporthead_list2.concat(datas8);
                    if (this.reporthead_list2.length >= 0) {
                      this.has_nextFin9 = datapagination9.has_next;
                      this.has_previousFin9 = datapagination9.has_previous;
                      this.currentpageFin9 = datapagination9.index;
                    }
                  })
              }

            }
          })
      }
    })

  }


  reporthead_dropdown_mas() {  
    this.report_master_id = this.reporttypecreate.value.report_master_data_item_modal?.id??"";
    this.rhtcDrop = this.reporttypecreate.controls["reportgroup_create_head"].value;
    let name = this.rhDrop?.name ?? "";

    // this.spinnerService.show()

    let prokeyvalue: String = "";
    this.getreport_header_type_summary_drop(prokeyvalue, this.report_master_id);
    this.reporttypecreate.get('reportgroup_create_head').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),

        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.drsService.reporthead_dropdown(value, 1, this.report_master_id)
          .pipe(
            finalize(() => {
              console.log(value)
            }),
          )
        )
      )
      .subscribe((results: any) => {
        // this.spinnerService.hide()
        let data9 = results["data"]
        this.reporthead_list5 = data9;
        console.log("Report_header_Type_create_dropdown", this.reporthead_list5)
        this.isLoading = false
      })

  }
  private getreport_header_type_summary_drop(prokeyvalue, master_id) {
    this.drsService.reporthead_dropdown(prokeyvalue, 1, this.report_master_id)
      .subscribe((results: any) => {
        this.spinnerService.hide()
        this.reporthead_list5 = results["data"]
        console.log("Report_header_Type_create_dropdown", this.reporthead_list5)
        this.isLoading = false
      })

  }
  RHTCdropdownScroll() {
    this.has_nextFin8 = true;
    this.has_previousFin8 = true;
    this.currentpageFin8 = 1
    setTimeout(() => {
      if (
        this.reporthead &&
        this.autocompleteTrigger &&
        this.reporthead.panel
      ) {
        fromEvent(this.reporthead.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.reporthead.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.reporthead.panel.nativeElement.scrollTop;
            const scrollHeight = this.reporthead.panel.nativeElement.scrollHeight;
            const elementHeight = this.reporthead.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextFin8 === true) {
                this.drsService.reporthead_dropdown(this.RHTCContactInput.nativeElement.value,  this.currentpageFin8 + 1,this.report_master_id)
                  .subscribe((results: any[]) => {
                    let datas8 = results["data"];
                    let datapagination8 = results["pagination"];
                    this.reporthead_list5 = this.reporthead_list5.concat(datas8);
                    if (this.reporthead_list5.length >= 0) {
                      this.has_nextFin8 = datapagination8.has_next;
                      this.has_previousFin8 = datapagination8.has_previous;
                      this.currentpageFin8 = datapagination8.index;
                    }
                  })
              }

            }
          })
      }
    })

  }
  Schdulartype_dropdown() {

  }
  comon(val) {
    if (this.arr == '') {
      this.arr = []
    }
    this.arr.push(val);

    console.log('val', val);
    console.log('arr222', this.arr);
  }
  closes(event, ind) {
    console.log("mnnmmnnmmnnmn", event.code)
    if (event.code == "Backspace") {
      let removedata = this.arr.splice(ind, 1)
      console.log("removedatacvbcv", removedata)
    }
  }
  editable(event) {
    let text_value = event.target.innerText
    text_value = text_value.replace(/(\r\n|\n|\r)/gm, "");
    this.schdule_value = text_value
    console.log("this.schdule_value", this.schdule_value)
    console.log("eventvhxchnc", text_value, event)
  }
  select_value(form_value) {
    // if(this.multidata==''){
    //   this.multidata=[]
    // }
    if (this.reporttypecreate.value.Schdular_type?.name == "Item") {

    } else {
      let formdata_cond = form_value;
      this.multidata.push(this.form_data)

      console.log("multidata", this.multidata)

    }
  }

  scd_type(sub) {
    if (sub.name == "Item") {
      this.elem_hide = true
    } else {
      this.multidata = [];
      this.elem_hide = false
      //  this.reporttypecreate.value.Schdularmaster.reset();
      this.reporttypecreate.get("Schdularmaster").reset();

      // this.Schdularmaster.reset()
    }
  }

  Selected_value_master_item(reportgroupcreates) {
    this.Selected_value_master_item = reportgroupcreates.id;
    console.log("Selected Option For Report Type Modal Master :", this.Selected_value_master_item);

  }
  Schdularmaster_dropdown() {
    // this.spinnerService.show();
    this.drsService
      .Schdularmaster_dropdown(this.Sche_data.nativeElement.value, 1)
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((results) => {
        // this.spinnerService.hide();
        let datas = results["data"];
        this.Schdularmaster_list = datas;
        // this.cat_id = this.Catagory_list.id;
        console.log("Schdularmaster_list=>", this.Schdularmaster_list);
      });
  }
  autocompleteschedule_mas_Scroll() {
    this.mas_has_next = true;
    this.mas_has_previous = true;
    this.mas_currentpage = 1;
    setTimeout(() => {
      if (this.schdularmaster && this.autocompleteTrigger && this.schdularmaster.panel) {
        fromEvent(this.schdularmaster.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.schdularmaster.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.schdularmaster.panel.nativeElement.scrollTop;
            const scrollHeight = this.schdularmaster.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.schdularmaster.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.mas_has_next === true) {
                this.drsService.Schdularmaster_dropdown(this.Sche_data.nativeElement.value, this.mas_currentpage + 1).subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.Schdularmaster_list = this.Schdularmaster_list.concat(datas);
                  if (this.Schdularmaster_list.length >= 0) {
                    this.mas_has_next = datapagination.has_next;
                    this.mas_has_previous = datapagination.has_previous;
                    this.mas_currentpage = datapagination.index;
                  }
                });
              }
            }
          });
      }
    });
  }
  // updateContent() {   
  //   var s = document.getElementById('editableContents');    
  //   this.ref_element_null = s
  //   if (s == null) {
  //     this.Reporttypeedit(this.report_datas_ele, this.element_deffs)
  //   } else {   
  //   s.innerHTML = this.refe_value;

  //   }
  // }
  updateContent() {   
    const s = document.getElementById('editableContents');
    this.ref_element_null = s;
  
    if (s == null) {
      this.Reporttypeedit(this.report_datas_ele, this.element_deffs);
    } else {   
      let content = '';
        for (let i = 0; i < this.array_edit_data.length; i++) {
        content += `<span>${this.array_edit_data[i]}</span>`;
          if (i % 2 === 0 && this.array_edit_data[i + 1] === "+") {
          // content += `<span class="plus-sign"> + </span>`;
        }
      }
        s.innerHTML = content;
    }
  }

  reportmaster_drop(){
    this.rmDrop = this.reportheader.controls["report_master_data_name"].value;
    let name = this.rmDrop?.name ?? "";

    // this.spinnerService.show()

    let prokeyvalue: String = "";
    this.getreport_master_drop_head(prokeyvalue);
    this.reporttypecreate.get('report_master_data_item_modal').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),

        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.drsService.reportmasterdrop(value, 1)
          .pipe(
            finalize(() => {
              console.log(value)

            }),
          )
        )
      )
      .subscribe((results: any) => {
        // this.spinnerService.hide()
        let data = results["data"]
        this.reportmaster_list = data;
        console.log("report_master_dropdown", this.reportmaster_list)
        this.isLoading = false
      })
  }


  private getreport_master_drop_head(prokeyvalue) {
    this.drsService.reportmasterdrop(prokeyvalue, 1)
      .subscribe((results: any) => {
        // this.spinnerService.hide()
        this.reportmaster_list = results["data"]
        console.log("report_master_dropdown", this.reportmaster_list)
        this.isLoading = false
      })

  }
  onTabChange(event: any) {
    switch (event.index) {
        case 4:
          this.scdule_master_screen=true;
            this.currency_master_screen = false;
            this.Exception_schedule_screen = false;
            break;
        case 5:
            this.currency_master_screen = true;
            this.Exception_schedule_screen = false;
            this.scdule_master_screen=false;
            break;
        case 6:
            this.currency_master_screen = false;
            this.Exception_schedule_screen = true;
            this.scdule_master_screen=false;
            break;
    }
}

  Currency_Master_Tab(){
    // this.drs_report_type_summarys("");
    this.currency_master_screen= true
this.scdule_master_screen=false;
this.Exception_schedule_screen= false
  }
  Exception_schedule_tab(){
    // this.spinnerService.show()
    this.currency_master_screen= false
    this.scdule_master_screen=false;
    this.Exception_schedule_screen= true
    // this.spinnerService.hide()

  }

  // Repor_download(data){
  //   console.log("Data:",data)
  //   let id = data.id
  //   this.xcel_name= data.name
  //   this.spinnerService.show()    
  //   this.drsService.master_download(id).subscribe((results: any) => {
  //     this.spinnerService.hide()
  //     let binaryData = [];
  //     binaryData.push(results)
  //     let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
  //     let link = document.createElement('a');
  //     link.href = downloadUrl;
  //     let date: Date = new Date();
  //     link.download = this.xcel_name+".xlsx";
  //     link.click();
  //     this.toastr.success('Successfully Download');
  //   });

  // }



  Reportheader_route(data){
    this.report_hearder_con = true
    this.report_header.nativeElement.click()
    let parms = {"report_master_data_name": {
      "id": data.id,
      "name": data.name,
  }}
  // this.drs_report_header_summary(parms,this.presentpage) 
  this.spinnerService.show()
    this.drsService.drs_report_header_summary(this.presentpage, data.id, "").subscribe((results: any) => {
      this.spinnerService.hide()
      let data = results["data"];
      let datapagination = results["pagination"];
      this.report_header_list = data;
      this.report_hearder_con = false
      if (this.report_header_list?.length > 0) {
        this.hashead_next = datapagination.has_next;
        this.hashead_previous = datapagination.has_previous;
        this.headpresentpage = datapagination.index;
        this.data_header_found = true;
      }
      if (results["set_code"] || this.report_header_list?.length == 0) {
        this.hashead_next = false;
        this.hashead_previous = false;
        this.headpresentpage = 1;
        this.data_header_found = false;
      }
    });
  }

  Reportgroup_route(data){
    this.report_group_con = true
    this.report_Group_route.nativeElement.click()
    let parms = {"report_head_data_name": {
      "id": data.id,
      "name": data.name,
  }}
  // this.drs_report_group_summary(parms,this.grouppresentpage)
  this.spinnerService.show()
  this.drsService.drs_report_group_summary(this.grouppresentpage, data.id, "").subscribe((results: any) => {
    this.spinnerService.hide()
    let data = results["data"];
    let datapagination = results["pagination"];
    this.report_group_list = data;
    this.report_group_con = false
    if (this.report_group_list?.length > 0) {
      this.hasgroup_next = datapagination.has_next;
      this.hasgroup_previous = datapagination.has_previous;
      this.grouppresentpage = datapagination.index;
      this.data_group_found = true;
    }
    if (results["set_code"] || this.report_group_list?.length == 0) {
      this.hasgroup_next = false;
      this.hasgroup_previous = false;
      this.grouppresentpage = 1;
      this.data_group_found = false;
    }
  });
  
  }
  Reportitem_route(data){
    this.report_item_con = true
    this.report_item_route.nativeElement.click()
    let reprt_type = "";
    let name = data.report_type_name ? data.report_type_name : "";
    let type = 2;
    let head_group =  data.id ? data.id : ""

    this.spinnerService.show()
    this.drsService.drs_report_type_summary(this.type_presentpage, reprt_type, name, type, head_group).subscribe((results: any) => {
      this.spinnerService.hide()
      let data = results["data"];
      let datapagination = results["pagination"];
      this.report_type_list = data;
      this.report_item_con = false
      if (this.report_type_list?.length > 0) {
        this.hastype_next = datapagination.has_next;
        this.hastype_previous = datapagination.has_previous;
        this.type_presentpage = datapagination.index;
        this.data_item_found = true;
      }
      if (results["set_code"] || this.report_type_list?.length == 0) {
        this.hastype_next = false;
        this.hastype_previous = false;
        this.type_presentpage = 1;
        this.data_item_found = false;
      }
    });

    

  }
}