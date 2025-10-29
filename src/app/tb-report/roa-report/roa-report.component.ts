import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { TbReportService } from "../tb-report.service";
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { fromEvent } from "rxjs";
import { VertSharedService } from "../vert-shared.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import * as XLSX from "xlsx";
import localeEnIN from "@angular/common/locales/en-IN";
import { registerLocaleData } from "@angular/common";
registerLocaleData(localeEnIN);
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import ChartDataLabels from "chartjs-plugin-datalabels";
import canvg from "canvg";
import html2pdf from "html2pdf.js";
export interface branchList {
  id: number;
  name: string;
  code: string;
}
export interface finyearList {
  finyer: string;
}

@Component({
  selector: "app-roa-report",
  templateUrl: "./roa-report.component.html",
  styleUrls: ["./roa-report.component.scss"],
})
export class RoaReportComponent implements OnInit {
  Amount_List: any = [
    { id: "C", name: "Crores" },
    { id: "L", name: "Lakhs" },
    { id: "A", name: "Actuals" },
  ];
  finyearList: any;
  isLoading: boolean;
  branchList: any;
  has_nextbra: boolean;
  has_previousbra: boolean;
  currentpagebra: number;
  from_month = [
    { id: 1, month: "Apr", month_id: 4 },
    { id: 2, month: "May", month_id: 5 },
    { id: 3, month: "Jun", month_id: 6 },
    { id: 4, month: "Jul", month_id: 7 },
    { id: 5, month: "Aug", month_id: 8 },
    { id: 6, month: "Sep", month_id: 9 },
    { id: 7, month: "Oct", month_id: 10 },
    { id: 8, month: "Nov", month_id: 11 },
    { id: 9, month: "Dec", month_id: 12 },
    { id: 10, month: "Jan", month_id: 1 },
    { id: 11, month: "Feb", month_id: 2 },
    { id: 12, month: "Mar", month_id: 3 },
  ];
  xlsx_param: any;
  data_not_found: boolean;
  div_Amt_show: string;
  currentpagebss: any;
  has_previousbss: any;
  has_nextbss: any;
  businessList: any;
  branch_list: any;
  view_branch: boolean = false;
  role_per: any;
  Branch_data_show_hide: boolean = true;
  table_headers: boolean;
  brach_dd_hide: boolean = true;
  view_List: any = [
    { id: 1, name: "Bank As a Whole" },
    { id: 2, name: "Branch Wise" },
  ];
  Do_permission: any;
  do_view: boolean;
  branch_value_code: any;
  branch_do_List: any;
  has_next_do_bra: boolean;
  has_previous_do_bra: boolean;
  currentpage_do_bra: number;
  ccList: any;
  bsList: any;
  branch_name_show: any;
  header_names: any = [];
  vertical_headers: any = [];
  card_hide: boolean = false;
  public Chart: any;
  title = "angulardashboard";
  canvas: any;
  canvas1: any;
  ctx: any;
  ctx1: any;
  myChart: any;
  myChart1: any;
  myChart1lijne: any;
  level_dash_name: any;
  Some_lable: boolean = true;
  All_lable: boolean = false;
  pdf_download: boolean = false;
  chart_summary: boolean = false;
  Roa_summary: boolean = true;
  label_data: Array<any> = [];
  label_amount: Array<any> = [];
  label_data_month: Array<any> = [];
  label_amount_month: Array<any> = [];
  buzname: any;
  top6_data: any;
  dashboard_buss: any;
  grantamt: any;
  filteredBusinessNames: any;
  isAdvancedSearchVisible = false;
  dashboard_buss_raw: any;
  sort_amount: number;
  perticullar_buz: boolean = false;
  totalamt: number;
  total_index: any;
  free_lables: any = [];
  branch_code_login: any;
  finyearListrun: any;
  data_found: boolean;
  has_next: boolean;
  has_previous: boolean;
  presentpage: number;
  back_roa: boolean = false;
  runscreen: boolean = true;
  status_list = [
    { name: "Started", id: 1 },
    { name: "Processing", id: 2 },
    { name: "Success", id: 4 },
  ];
  roa_runscreen: boolean = false;
  runupdatestatus: boolean = false;
  constructor(
    private dataService: TbReportService,
    private fb: FormBuilder,
    private vrtshardserv: VertSharedService,
    private SpinnerService: NgxSpinnerService,
    private toastr: ToastrService
  ) {}
  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild("branchContactInput") branchContactInput: any;
  @ViewChild("branch") matAutocompletebrach: MatAutocomplete;
  @ViewChild("businessInput") businessInput: any;
  @ViewChild("business_name") business_nameautocomplete: MatAutocomplete;
  @ViewChild("branch_dos") matAutocompletebranch_dos: MatAutocomplete;
  @ViewChild("branch_do_Input") branch_do_Input: any;
  //bs
  @ViewChild("bsInput") bsInput: any;
  @ViewChild("bs") matAutocompletebs: MatAutocomplete;

  //cc
  @ViewChild("ccInput") ccInput: any;
  @ViewChild("cc_name") matAutocompletecc: MatAutocomplete;

  @ViewChild("bsclear_nameInput") bsclear_name;
  // @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  @ViewChild("chartsummary") chartSummary!: ElementRef;

  roarun: FormGroup;
  roaSearchForm: FormGroup;
  ngOnInit(): void {
    this.roaSearchForm = this.fb.group({
      finyear: [],
      frommonth: [],
      tomonth: [],
      branch_id: [],
      amount: [],
      business: [],
      view: [],
      branch_do: [],
      bs_id: [],
      cc_id: [],
    });
    // this.roa_summary_Search()
    this.roaSearchForm.patchValue({
      frommonth: this.from_month[0],
    });
    this.roaSearchForm.patchValue({
      amount: this.Amount_List[1],
    });

    this.roarun = this.fb.group({
      finyear: "",
      frommonth: "",
      tomonth: "",
      status: "",
    });
    this.finyear_dropdown_run();
    this.vrtshardserv.isSideNav = true;
    document.getElementById("mySidenav").style.width = "50px";
    document.getElementById("main").style.marginLeft = "40px";
    document.getElementById("main").style.transition = "margin-left 0.5s";
    this.role_per = this.vrtshardserv.role_permission.value;
    console.log("rolessssssssss", this.role_per);
    this.branch_value_code = this.vrtshardserv.Branch_value.value;
    this.Do_permission = this.vrtshardserv.Branch_value_do.value;
    this.branch_name_show = this.vrtshardserv.Branch_value_show.value;
    console.log(
      "Do_permission",
      this.Do_permission["empbranch_ids"].length,
      this.branch_value_code
    );
    if (this.role_per.name == "Admin") {
      this.view_branch = true;
      this.brach_dd_hide = false;
      this.table_headers = false;
      this.branch_code_login = "";
    } else {
      if (this.Do_permission["empbranch_ids"].length != 0) {
        this.view_branch = false;
        this.brach_dd_hide = true;
        this.table_headers = true;
        this.branch_code_login = "";
      } else {
        this.view_branch = false;
        this.brach_dd_hide = false;
        this.table_headers = true;
        this.branch_code_login = this.branch_value_code;
      }
    }
  }

  all_data_rest() {
    if (this.role_per.name == "Admin") {
      this.roaSearchForm.controls["business"].reset("");
      this.roaSearchForm.controls["gl_no_id"].reset("");
      this.roaSearchForm.controls["branch_id"].reset("");
      this.roaSearchForm.controls["branch_do"].reset("");
      this.roaSearchForm.controls["view"].reset("");
      this.roaSearchForm.controls["bs_id"].reset("");
      this.roaSearchForm.controls["cc_id"].reset("");
      // }else if(this.Do_permission['empbranch_ids'].length !=0 && this.role_per.name !="Admin"){
      //   this.roaSearchForm.controls['bs_id'].reset('')
      //   this.roaSearchForm.controls['cc_id'].reset('')
      //   this.roaSearchForm.controls['business'].reset('')
      // this.roaSearchForm.controls['gl_no_id'].reset('')
      // this.roaSearchForm.controls['branch_id'].reset('')
    } else {
      this.roaSearchForm.controls["bs_id"].reset("");
      this.roaSearchForm.controls["cc_id"].reset("");
      this.roaSearchForm.controls["business"].reset("");
      this.roaSearchForm.controls["gl_no_id"].reset("");
    }
  }

  selectbsSection(data) {
    this.cc_bs_id = data.id;
  }

  bs_clear() {
    this.roaSearchForm.controls["bs_id"].reset("");
    this.roaSearchForm.controls["cc_id"].reset("");
  }

  branch_hide(branch) {
    this.Branch_data_show_hide = false;
    if (branch.id == 1) {
      this.brach_dd_hide = false;

      this.do_view = false;
      this.roaSearchForm.controls["branch_id"].reset("");
      this.roaSearchForm.controls["branch_do"].reset("");
      // this.roaSearchForm.controls['view'].reset('')
      this.roaSearchForm.controls["business"].reset("");
      this.roaSearchForm.controls["bs_id"].reset("");
      this.roaSearchForm.controls["cc_id"].reset("");
    } else if (branch.id == 2) {
      this.brach_dd_hide = true;
      this.do_view = false;
      this.roaSearchForm.controls["branch_do"].reset("");
      this.roaSearchForm.controls["branch_id"].reset("");
      // this.roaSearchForm.controls['view'].reset('')
      this.roaSearchForm.controls["business"].reset("");
      this.roaSearchForm.controls["bs_id"].reset("");
      this.roaSearchForm.controls["cc_id"].reset("");
    } else {
      this.brach_dd_hide = true;
      this.table_headers = false;
      this.do_view = true;
      this.roaSearchForm.controls["branch_id"].reset("");
      this.roaSearchForm.controls["branch_do"].reset("");
      // this.roaSearchForm.controls['view'].reset('')
      this.roaSearchForm.controls["business"].reset("");
      this.roaSearchForm.controls["bs_id"].reset("");
      this.roaSearchForm.controls["cc_id"].reset("");
    }
  }

  do_view_dd(branch) {
    this.roaSearchForm.controls["branch_id"].reset("");
    if (branch == "" || branch == null || branch == undefined) {
      this.brach_dd_hide = false;
    } else {
      this.brach_dd_hide = true;
    }
  }

  finyear_dropdown() {
    this.dataService.getfinyeardropdown("", 1).subscribe((results: any[]) => {
      let datas = results["data"];
      this.finyearList = datas;
    });
  }
  branchname() {
    let bran_do;
    let branch_flag;
    if (this.role_per.name == "Admin") {
      if (this.roaSearchForm.value.view?.id === 2) {
        branch_flag = 2;
      }
      bran_do = this.roaSearchForm.value.branch_do?.code ?? "";
    } else {
      bran_do = this.branch_value_code;
    }
    let prokeyvalue: String = "";
    this.getbranchid(prokeyvalue);
    this.roaSearchForm
      .get("branch_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.dataService
            .getbranchdropdown(value, 1, bran_do, branch_flag)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              })
            )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
      });
  }

  private getbranchid(prokeyvalue) {
    let bran_do;
    let branch_flag;
    if (this.role_per.name == "Admin") {
      if (this.roaSearchForm.value.view?.id === 2) {
        branch_flag = 2;
      }
      bran_do = this.roaSearchForm.value.branch_do?.code ?? "";
    } else {
      bran_do = this.branch_value_code;
    }
    this.dataService
      .getbranchdropdown(prokeyvalue, 1, bran_do, branch_flag)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
      });
  }

  autocompletebranchnameScroll() {
    let bran_do;
    let branch_flag;
    if (this.role_per.name == "Admin") {
      if (this.roaSearchForm.value.view?.id === 2) {
        branch_flag = 2;
      }
      bran_do = this.roaSearchForm.value.branch_do?.code ?? "";
    } else {
      bran_do = this.branch_value_code;
    }
    this.has_nextbra = true;
    this.has_previousbra = true;
    this.currentpagebra = 1;
    setTimeout(() => {
      if (
        this.matAutocompletebrach &&
        this.autocompleteTrigger &&
        this.matAutocompletebrach.panel
      ) {
        fromEvent(this.matAutocompletebrach.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.matAutocompletebrach.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop =
              this.matAutocompletebrach.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matAutocompletebrach.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matAutocompletebrach.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbra === true) {
                this.dataService
                  .getbranchdropdown(
                    this.branchContactInput.nativeElement.value,
                    this.currentpagebra + 1,
                    bran_do,
                    branch_flag
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchList = this.branchList.concat(datas);
                    if (this.branchList.length >= 0) {
                      this.has_nextbra = datapagination.has_next;
                      this.has_previousbra = datapagination.has_previous;
                      this.currentpagebra = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }

  public displayfnbranch(branch?: branchList): string | undefined {
    return branch ? branch.name + "-" + branch.code : undefined;
  }

  public displayfnfinyear(fin_year?: finyearList): string | undefined {
    return fin_year ? fin_year.finyer : undefined;
  }

  amount_array = [];
  transformed_report_list: any[] = [];
  header_name: any;
  vertical_report_list: any;
  RunDate: any;
  RunFinyear: any;
  RunFrom_mon: any;
  RunTo_mon: any;
  roa_summary_Search(data, value) {
    this.card_hide = false;
    if (
      this.roaSearchForm.value.finyear == "" ||
      this.roaSearchForm.value.finyear == undefined ||
      this.roaSearchForm.value.finyear == null
    ) {
      this.toastr.warning("Please Select Finyear");
      return false;
    }
    if (
      this.roaSearchForm.value.frommonth == "" ||
      this.roaSearchForm.value.frommonth == undefined ||
      this.roaSearchForm.value.frommonth == null
    ) {
      this.toastr.warning("Please Select From Month");
      return false;
    }
    if (this.roaSearchForm.value.frommonth != "") {
      if (
        this.roaSearchForm.value.tomonth == "" ||
        this.roaSearchForm.value.tomonth == undefined ||
        this.roaSearchForm.value.tomonth == null
      ) {
        this.toastr.warning("Please Select To Month");
        return false;
      }
    }
    if (this.role_per.name == "Admin") {
      if (
        this.roaSearchForm.value.view == "" ||
        this.roaSearchForm.value.view == undefined ||
        this.roaSearchForm.value.view == null
      ) {
        this.toastr.warning("Please Select View Type");
        return false;
      }
    }
    if (
      this.roaSearchForm.value.business == "" ||
      this.roaSearchForm.value.business == undefined ||
      this.roaSearchForm.value.business == null
    ) {
      this.roaSearchForm.controls["bs_id"].reset("");
      this.roaSearchForm.controls["cc_id"].reset("");
    }
    if (
      this.roaSearchForm.value.bs_id == "" ||
      this.roaSearchForm.value.bs_id == null ||
      this.roaSearchForm.value.bs_id == undefined
    ) {
      this.roaSearchForm.controls["cc_id"].reset("");
    }

    if (this.roaSearchForm.value.amount?.id == "C") {
      this.div_Amt_show = "Amount In Crores";
    } else if (this.roaSearchForm.value.amount?.id == "A") {
      this.div_Amt_show = "Amount In Actuals";
    } else {
      this.div_Amt_show = "Amount In Lakhs";
    }
    let finyear = this.roaSearchForm.value.finyear?.finyer ?? "";
    let from_month = this.roaSearchForm.value.frommonth?.month_id ?? "";
    let to_month = this.roaSearchForm.value.tomonth?.month_id ?? "";
    let branch;
    let amount = this.roaSearchForm.value.amount?.id ?? "";
    let business = this.roaSearchForm.value.business?.code ?? "";
    let view_name = this.roaSearchForm.value.view?.id ?? 2;
    let bs_id = this.roaSearchForm.value.bs_id?.id ?? "";
    let cc_id = this.roaSearchForm.value.cc_id?.id ?? "";
    if (this.branch_code_login === "") {
      if (this.roaSearchForm.value.view?.name == "Bank As a Whole") {
        // branch = 6666
        branch = "";
      } else {
        branch = this.roaSearchForm.value.branch_id?.code ?? "";
      }
    } else {
      branch = this.branch_code_login;
    }
    this.branch_value_code;
    let branch_flags;
    // branch = 6666
    if (this.role_per.name == "Admin") {
      branch_flags = view_name;
      // }else if(this.Do_permission['empbranch_ids'].length !=0 && this.role_per.name !="Admin"){
      //   branch_flags=5
    } else {
      branch_flags = 2;
    }
    let report_type = 2;
    this.xlsx_param = {
      Amount: this.roaSearchForm.value.amount?.name ?? "",
      "Business Name": this.roaSearchForm.value.business?.name ?? "",
      "Branch Name": this.roaSearchForm.value.branch_id?.name ?? "",
      "BS Name": this.roaSearchForm.value.bs_id?.name ?? "",
      "CC Name": this.roaSearchForm.value.cc_id?.id ?? "",
      "To Month": this.roaSearchForm.value.tomonth?.month ?? "",
      "From Month": this.roaSearchForm.value.frommonth?.month ?? "",
      Finyear: this.roaSearchForm.value.finyear?.finyer ?? "",
    };
    this.header_names = [];
    this.vertical_report_list = [];
    this.transformed_report_list = [];
    this.SpinnerService.show();
    this.dataService
      .roa_summary(
        finyear,
        from_month,
        to_month,
        report_type,
        branch,
        amount,
        business,
        branch_flags,
        bs_id,
        cc_id
      )
      .subscribe((results: any[]) => {
        if (value == "sum") {
          this.SpinnerService.hide();
        }
        let datas = results["data"];
        this.isAdvancedSearchVisible = false;

        if (datas.length > 1) {
          this.card_hide = true;
          for (let a of datas) {
            if (a.business_name) {
              this.dashboard_buss_raw = a.business_name;
              for (let b of a.business_name) {
                this.header_names.push(b.name);
              }
            }
            if (a?.report_run_data) {
              this.runupdatestatus=true
              let date = a?.report_run_data?.date ?? "";
              this.RunDate = date.split(",")[0];
              this.RunFinyear = a?.report_run_data?.finyear ?? "";
              let from_months = a?.report_run_data?.from_month ?? "";
              let to_months = a?.report_run_data?.to_month ?? "";

              const monthObject = this.from_month.find(
                (m) => m.month_id === from_months
              );
              const tomonthObject = this.from_month.find(
                (m) => m.month_id === to_months
              );
              this.RunFrom_mon = monthObject.month;
              this.RunTo_mon = tomonthObject.month;
              console.log(
                "sdg",
                datas,
                this.RunDate,
                this.RunFinyear,
                this.RunFrom_mon,
                this.RunTo_mon
              );
              datas.pop();
              console.log(datas);
            }else{
            this.runupdatestatus=false;
            }
          }

          const filterdata = datas.filter((item: any) => !item.business_name);
          this.vertical_report_list = filterdata;
          this.vertical_report_list.forEach((report) => {
            const existingNames = new Set(
              report.business_dict.map((item: any) => item.name)
            );

            this.header_names.forEach((name) => {
              if (!existingNames.has(name) && name !== "Total") {
                report.business_dict.push({
                  balance_amount: "0.00",
                  name: name,
                  sort_order: report.business_dict.length + 1,
                });
              }
            });
            this.total_index = this.header_names.indexOf("Total");

            report.business_dict = report.business_dict.filter((item: any) => {
              return this.header_names.includes(item.name);
            });
          });

          this.free_lables.push(
            this.vertical_report_list.filter((item: any) => {
              if (item.flag == "F" && item.template == "") {
                return item.name;
              }
            })
          );

          console.log("vaschange", this.free_lables);

          this.datamapping(value);
        } else {
          this.data_not_found = true;
          this.transformed_report_list = [];
          this.toastr.warning("No Data Found");
        }
      });
  }
  checkCondition(name: string): boolean {
    return this.free_lables[0].some((item) => item.name === name);
  }

  datamapping(value) {
    this.vertical_report_list.forEach((item) => {
      if (item.flag === "F") {
        const templateParts = item.template
          .split(/\s*([\+\-\*\/])\s*/)
          .filter((part) => part.trim());

        const businessDicts = templateParts
          .filter(
            (part) =>
              isNaN(Number(part)) && !["+", "-", "*", "/"].includes(part)
          )
          .map(
            (code) =>
              this.vertical_report_list.find((entry) => entry.code === code)
                ?.business_dict || []
          );

        const operations = templateParts.filter((part) =>
          ["+", "-", "*", "/"].includes(part)
        );

        const constants = templateParts
          .filter((part) => !isNaN(Number(part)))
          .map(Number);

        if (businessDicts.length >= 1) {
          const newBusinessDict = this.header_names.map((name) => {
            let result =
              businessDicts[0].find((b) => b.name === name)?.balance_amount ||
              0;

            result = parseFloat(result.toString().replace(/,/g, "")) || 0;

            let constantIndex = 0;
            let nextAmount = result;

            for (let i = 0; i < operations.length; i++) {
              if (i + 1 < businessDicts.length) {
                nextAmount =
                  businessDicts[i + 1].find((b) => b.name === name)
                    ?.balance_amount || 0;
                nextAmount =
                  parseFloat(nextAmount.toString().replace(/,/g, "")) || 0;
              } else if (constantIndex < constants.length) {
                nextAmount = constants[constantIndex];
                constantIndex++;
              }

              switch (operations[i]) {
                case "+":
                  result += nextAmount;
                  break;
                case "-":
                  result -= nextAmount;
                  break;
                case "*":
                  result *= nextAmount;
                  break;
                case "/":
                  result = nextAmount !== 0 ? result / nextAmount : 0;
                  break;
                default:
                  break;
              }
            }

            return {
              name: name,
              balance_amount: result.toFixed(2),
            };
          });

          item.business_dict = newBusinessDict;
        }
      }
    });
    this.vertical_report_list.forEach((report) => {
      // Remove items where name is 'Total'
      report.business_dict = report.business_dict.filter(
        (item) => item.name !== "Total"
      );
    });
    this.totalcalculation();
    console.log("header:", this.header_names);
    console.log("header:", this.transformed_report_list);
    this.header_names.unshift("Row Labels");
    let last = this.dashboard_buss_raw;
    this.dashboard_buss = last.slice(0, -1);
    this.dashboard_buss.splice(0, 1);
    if (value == "dash") {
      this.Roa_summary = false;
      this.chart_summary = true;
      this.Some_lable = true;
      this.All_lable = false;
      // this.show_original_data(this.transformed_report_list[0].name,this.transformed_report_list[0].business_dict?.Amount[this.transformed_report_list[0].business_dict.Amount.length - 4])
      this.level_data_api("", "NET PROFIT");
    }
  }

  bussmap() {
    this.transformed_report_list = this.vertical_report_list.map((item) => {
      const amounts = this.header_names.map((hsec) => {
        const found = item.business_dict.find((bv) => bv.name === hsec);

        return found
          ? parseFloat(found.balance_amount.replace(/,/g, "")) || 0.0
          : 0.0;
      });

      return {
        ...item,
        business_dict: {
          Amount: amounts,
        },
      };
    });
    console.log("lasmapped", this.transformed_report_list);
  }

  totalcalculation() {
    const totalIndex = this.header_names.indexOf("Total");

    if (totalIndex > -1) {
      this.filteredBusinessNames = this.header_names.slice(0, totalIndex);
    } else {
      this.filteredBusinessNames = [...this.header_names];
    }
    this.vertical_report_list.forEach((item) => {
      if (item.business_dict) {
        const totalClosingAmount = item.business_dict.reduce((acc, curr) => {
          if (this.filteredBusinessNames.includes(curr.name)) {
            return acc + parseFloat(curr.balance_amount);
          }
          return acc;
        }, 0);

        const totalEntry = {
          balance_amount: totalClosingAmount.toFixed(2),
          code: 0,
          name: "Total",
          opening_amount: "0",
          sort_order: 0,
        };

        item.business_dict.push(totalEntry);
      }
    });
    this.bussmap();
    this.bank_as_hole_cal();
  }
  bank_as_hole_cal() {
    this.vertical_report_list.forEach((report) => {
      // Remove items where name is 'Total'
      report.business_dict = report.business_dict.filter(
        (item) => item.name !== "Bank as a whole"
      );
    });
    this.filteredBusinessNames = ["Total", "Treasury", "Centre"];

    this.vertical_report_list.forEach((item) => {
      if (item.business_dict) {
        const totalClosingAmount = item.business_dict.reduce((acc, curr) => {
          if (this.filteredBusinessNames.includes(curr.name)) {
            return acc + parseFloat(curr.balance_amount);
          }
          return acc;
        }, 0);

        const totalEntry = {
          balance_amount: totalClosingAmount.toFixed(2),
          code: 0,
          name: "Bank as a whole",
          opening_amount: "0",
          sort_order: 0,
        };

        item.business_dict.push(totalEntry);
      }
    });
    this.bussmap();
  }
  reset() {
    this.roaSearchForm.reset();
    this.transformed_report_list = [];
    this.header_names = [];
    this.card_hide = false;
  }
  to_reset() {
    this.roaSearchForm.controls["tomonth"].reset("");
  }
  bs_cc_clear() {
    this.roaSearchForm.controls["cc_id"].reset("");
  }

  Business_dropdown() {
    let report_type = 2;
    let prokeyvalue: String = "";
    this.getbusiness(prokeyvalue);
    this.roaSearchForm
      .get("business")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.dataService.getbusiness_dropdown(value, 1, report_type).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.businessList = datas;
      });
  }

  autocompletebusinessnameScroll() {
    let report_type = 2;
    this.has_nextbss = true;
    this.has_previousbss = true;
    this.currentpagebss = 1;
    setTimeout(() => {
      if (
        this.business_nameautocomplete &&
        this.autocompleteTrigger &&
        this.business_nameautocomplete.panel
      ) {
        fromEvent(this.business_nameautocomplete.panel.nativeElement, "scroll")
          .pipe(
            map(
              () => this.business_nameautocomplete.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop =
              this.business_nameautocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.business_nameautocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.business_nameautocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbss === true) {
                this.dataService
                  .getbusiness_dropdown(
                    this.businessInput.nativeElement.value,
                    this.currentpagebss + 1,
                    report_type
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.businessList = this.businessList.concat(datas);
                    if (this.businessList.length >= 0) {
                      this.has_nextbss = datapagination.has_next;
                      this.has_previousbss = datapagination.has_previous;
                      this.currentpagebss = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }
  business_id = 0;
  private getbusiness(prokeyvalue) {
    let report_type = 2;
    this.dataService
      .getbusiness_dropdown(prokeyvalue, 1, report_type)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.businessList = datas;
      });
  }

  public displayfnbusiness(business_name?: branchList): string | undefined {
    return business_name ? business_name.name : undefined;
  }
  branch_do_name() {
    let prokeyvalue: String = "";
    this.getbranch_do_id(prokeyvalue);
    this.roaSearchForm
      .get("branch_do")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.dataService.getbranch_do_dropdown(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branch_do_List = datas;
      });
  }

  private getbranch_do_id(prokeyvalue) {
    this.dataService
      .getbranch_do_dropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branch_do_List = datas;
      });
  }

  autocompletebranch_do_nameScroll() {
    this.has_next_do_bra = true;
    this.has_previous_do_bra = true;
    this.currentpage_do_bra = 1;
    setTimeout(() => {
      if (
        this.matAutocompletebranch_dos &&
        this.autocompleteTrigger &&
        this.matAutocompletebranch_dos.panel
      ) {
        fromEvent(this.matAutocompletebranch_dos.panel.nativeElement, "scroll")
          .pipe(
            map(
              () => this.matAutocompletebranch_dos.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop =
              this.matAutocompletebranch_dos.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matAutocompletebranch_dos.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matAutocompletebranch_dos.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next_do_bra === true) {
                this.dataService
                  .getbranch_do_dropdown(
                    this.branch_do_Input.nativeElement.value,
                    this.currentpage_do_bra + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branch_do_List = this.branch_do_List.concat(datas);
                    if (this.branch_do_List.length >= 0) {
                      this.has_next_do_bra = datapagination.has_next;
                      this.has_previous_do_bra = datapagination.has_previous;
                      this.currentpage_do_bra = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }

  public displayfnbranch_do(branch?: branchList): string | undefined {
    return branch ? branch.code + "-" + branch.name : undefined;
  }

  bsname_dropdown() {
    let business = this.roaSearchForm.value.business?.id ?? "";
    let prokeyvalue: String = "";
    this.getbsid(prokeyvalue);
    this.roaSearchForm
      .get("bs_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.dataService.getbsdropdown(business, value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bsList = datas;
        // this.expand=false
        this.bsclear_name.nativeElement.value = "";
      });
  }

  private getbsid(prokeyvalue) {
    let business = this.roaSearchForm.value.business?.id ?? "";
    this.dataService
      .getbsdropdown(business, prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bsList = datas;
      });
  }

  cc_bs_id = 0;
  currentpagebs: any = 1;
  has_nextbs: boolean = true;
  has_previousbs: boolean = true;
  autocompletebsnameScroll() {
    let business = this.roaSearchForm.value.business?.id ?? "";
    this.has_previousbs = true;
    this.currentpagebs = 1;
    setTimeout(() => {
      if (
        this.matAutocompletebs &&
        this.autocompleteTrigger &&
        this.matAutocompletebs.panel
      ) {
        fromEvent(this.matAutocompletebs.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.matAutocompletebs.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop =
              this.matAutocompletebs.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matAutocompletebs.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matAutocompletebs.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbs === true) {
                this.dataService
                  .getbsdropdown(
                    business,
                    this.bsInput.nativeElement.value,
                    this.currentpagebs + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.bsList = this.bsList.concat(datas);
                    if (this.bsList.length >= 0) {
                      this.has_nextbs = datapagination.has_next;
                      this.has_previousbs = datapagination.has_previous;
                      this.currentpagebs = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }

  public displayfnbs(bs?: branchList): string | undefined {
    return bs ? bs.name : undefined;
  }

  ccname_dropdown() {
    let prokeyvalue: String = "";
    this.getccid(prokeyvalue);
    this.roaSearchForm
      .get("cc_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.dataService.getccdropdown(this.cc_bs_id, value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ccList = datas;
        // for (let levelslist of this.levelslist) {

        //   levelslist.expanded = false
        // }
        // this.data4aexp = true
        // this.dataaexp = true
        // this.dataaexpone = true
        // this.levelsdatavalueoneexp = ''
        // this.levels4adatas = ''
        // this.levelstwodatas = ''
        // this.levelsonedatas = ''
        // this.levelsdatas = ''
        // this.levels5adatas = ''
      });
  }

  private getccid(prokeyvalue) {
    this.dataService
      .getccdropdown(this.cc_bs_id, prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ccList = datas;
      });
  }

  currentpagecc: any = 1;
  has_nextcc: boolean = true;
  has_previouscc: boolean = true;
  autocompletccnameScroll() {
    this.has_nextcc = true;
    this.has_previouscc = true;
    this.currentpagecc = 1;
    setTimeout(() => {
      if (
        this.matAutocompletecc &&
        this.autocompleteTrigger &&
        this.matAutocompletecc.panel
      ) {
        fromEvent(this.matAutocompletecc.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.matAutocompletecc.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop =
              this.matAutocompletecc.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matAutocompletecc.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matAutocompletecc.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcc === true) {
                this.dataService
                  .getccdropdown(
                    this.cc_bs_id,
                    this.ccInput.nativeElement.value,
                    this.currentpagecc + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.ccList = this.ccList.concat(datas);
                    if (this.ccList.length >= 0) {
                      this.has_nextcc = datapagination.has_next;
                      this.has_previouscc = datapagination.has_previous;
                      this.currentpagecc = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }

  public displayfncc(cc_name?: branchList): string | undefined {
    return cc_name ? cc_name.name : undefined;
  }

  Screendownload() {
    var wsrows = [{ hpt: 12 }, { hpx: 16 }];
    // let header=[['PPR Report']]

    let profit = document.getElementById("datatable");

    console.log("profit=>", profit);

    const p_table: XLSX.WorkSheet = XLSX.utils.table_to_sheet(profit);

    console.log("p_table=>", p_table);

    let profitability: any = XLSX.utils.sheet_to_json(p_table, { header: 1 });
    const arr = Array(profitability[0].length).fill("");
    let cal = Math.floor(arr.length / 2);
    console.log(arr, cal);
    profitability.splice(0, 0, arr);
    console.log("profitability=>", profitability);
    let max_length = Math.max(arr.length);
    let head_report = [];
    head_report.push(Array(max_length).fill(""));
    head_report.push(Array(max_length + 1).fill(""));
    console.log("head_report=>", head_report);
    let header_position = Math.floor(max_length / 2);
    head_report[1].splice(header_position, 0, "ROA Report");
    let xlsxparam: any = {};
    let xlsx_len = 1;
    for (let xlsx in this.xlsx_param) {
      console.log("xlsx_param 1=>", xlsx);
      console.log("xlsx_param 2=>", this.xlsx_param);
      if (this.xlsx_param[xlsx] != "") {
        xlsxparam[xlsx] = this.xlsx_param[xlsx];
      }
    }
    console.log("xlsx=>", xlsxparam);
    if (Object.values(xlsxparam).length != 0) {
      xlsx_len = Object.values(xlsxparam).length;
    }
    for (let xlsx in xlsxparam) {
      for (let i = 1; i <= xlsx_len; i++) {
        head_report[0].splice(xlsx_len[i], 0, xlsx + ":" + xlsxparam[xlsx]);
        break;
      }
    }
    profitability.splice(0, 0, head_report[0]);
    profitability.splice(0, 0, head_report[1]);
    console.log("table=>", profitability);
    let worksheet = XLSX.utils.json_to_sheet(profitability, {
      skipHeader: true,
    });
    console.log("worksheet=>", worksheet);
    console.log("worksheet=>", worksheet);
    const new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, worksheet, "ROA Reports");
    XLSX.writeFile(new_workbook, "ROA Report's.xls");
    // }
  }

  // Dashboard code
  Component_Summary = [];
  vert_chart() {
    this.Roa_summary = false;
    this.chart_summary = true;
    this.Component_Summary = [
      {
        balance_amount: "3000.00",
        cat_name: {
          id: 5,
          name: "Grants for Specific Schemes (MME)",
        },
        subcat_name: {
          id: 6,
          name: "Other Allowance",
        },
        vendor_data: {
          code: "CD001",
          id: 1,
          name: "Amazon",
        },
      },
      {
        balance_amount: "20000.00",
        cat_name: {
          id: 5,
          name: "Grants for Specific Schemes (MME)",
        },
        subcat_name: {
          id: 6,
          name: "Other Allowance",
        },
        vendor_data: {
          code: "CD002",
          id: 2,
          name: "Flipkart",
        },
      },
      {
        balance_amount: "50000.00",
        cat_name: {
          id: 5,
          name: "Grants for Specific Schemes (MME)",
        },
        subcat_name: {
          id: 6,
          name: "Other Allowance",
        },
        vendor_data: {
          code: "CD002",
          id: 2,
          name: "Flipkart",
        },
      },
      {
        balance_amount: "60000.00",
        cat_name: {
          id: 5,
          name: "Grants for Specific Schemes (MME)",
        },
        subcat_name: {
          id: 6,
          name: "Other Allowance",
        },
        vendor_data: {
          code: "CD002",
          id: 2,
          name: "Ajio",
        },
      },
    ];
    setTimeout(() => {
      this.chart();
    }, 500);
  }

  // chart2() {
  //   const monthMap = [
  //     "",
  //     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  //     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  //   ];
  //   let from_month=this.roaSearchForm.value.tomonth?.month_id??""
  //   console.log("char2",this.label_amount)
  //   this.canvas1 = document.getElementById('myChart1');
  //   this.ctx1 = this.canvas1.getContext('2d')
  //   let delayed;
  //   this.myChart1 = new Chart(this.ctx1, {
  //     type: 'bar',
  //     data: {
  //       labels: this.label_data,
  //       datasets: [{
  //         label: monthMap[from_month -1] + ' ' + 'Original Amt',
  //         data: this.label_amount_month,
  //         backgroundColor:['#00308F'],
  //         borderWidth: 1
  //       },{
  //         label: monthMap[from_month] +  ' ' + 'Original Amt',
  //         data: this.label_amount,
  //         backgroundColor:['#7CB9E8'],
  //         borderWidth: 1
  //       }
  //     ]
  //     },
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       animation: {
  //       onComplete: () => {
  //         delayed = true;
  //       },
  //       delay: (context) => {
  //         let delay = 0;
  //         if (context.type === 'data' && context.mode === 'default' && !delayed) {
  //           delay = context.dataIndex * 300 + context.datasetIndex * 100;
  //         }
  //         return delay;
  //       },
  //     },
  //     plugins: {
  //       datalabels: {
  //         display: true,
  //         align: 'end',
  //         anchor: 'end',
  //         formatter: (value) => {
  //           return (this.roaSearchForm.value.amount.name == 'Actuals' ? value / 10000000 : value / 1).toFixed(2); // Format numbers with commas
  //         },
  //         color: '#000', // Color of the label text
  //         font: {
  //           weight: 'bold',
  //           size: 12 // You can adjust the size of the label text
  //         },
  //       },
  //       legend: {
  //         position: 'top',
  //         display: false,
  //       },
  //     },
  //       scales: {
  //         x: {
  //           grid: {
  //             display: false, // Hide horizontal grid lines
  //           },
  //           beginAtZero: true,
  //         },
  //       },
  //       layout: {
  //         padding: {
  //           left: 0,
  //           right: 0,
  //           top: 0,
  //           bottom: 0
  //         }
  //       }
  //     },
  //     plugins: [ChartDataLabels] // Add the datalabels plugin here
  //   });
  //   const targetElement = document.getElementById('myChart1');
  //   if (targetElement) {
  //     targetElement.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }

  chart2() {
    const monthMap = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    let from_month = this.roaSearchForm.value.tomonth?.month_id ?? "";
    console.log("char2", this.label_amount);

    this.canvas1 = document.getElementById("myChart1");
    this.ctx1 = this.canvas1.getContext("2d");
    let delayed;

    this.myChart1 = new Chart(this.ctx1, {
      type: "bar",
      data: {
        labels: this.label_data,
        datasets: [
          {
            label:
              this.roaSearchForm.value.amount.name == "Actuals"
                ? monthMap[from_month - 1] + " " + "Original Amt"
                : monthMap[from_month - 1] + " " + "Amt",
            data: this.label_amount_month,
            backgroundColor: ["#00308F"],
            borderWidth: 1,
          },
          {
            label:
              this.roaSearchForm.value.amount.name == "Actuals"
                ? monthMap[from_month] + " " + "Original Amt"
                : monthMap[from_month] + " " + "Amt",
            data: this.label_amount,
            backgroundColor: ["#7CB9E8"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (
              context.type === "data" &&
              context.mode === "default" &&
              !delayed
            ) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
        plugins: {
          datalabels: {
            display: true,
            align: "end",
            anchor: "end",
            rotation: -45, // Rotate the labels by 45 degrees to avoid overlap
            formatter: (value) => {
              return (
                this.roaSearchForm.value.amount.name == "Actuals"
                  ? value / 10000000
                  : value / 1
              ).toFixed(2);
            },
            color: "#000",
            font: {
              weight: "bold",
              size: 12,
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false, // Hide horizontal grid lines
            },
            beginAtZero: true,
          },
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          },
        },
      },
      plugins: [ChartDataLabels],
    });

    const targetElement = document.getElementById("myChart1");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  show_original_data(name, amount) {
    this.grantamt = amount;
    this.level_dash_name = name;
    this.buzname = "";
    let filtered_branch = this.transformed_report_list.filter(
      (item) => item.name == name
    );
    let hearders = this.header_names;
    const targetElement = document.getElementById("myChart1");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
    this.show_chart(name, filtered_branch, hearders);
  }
  show_chart(name, filtered_branch, hearders) {
    let filter_header = hearders.slice(0, -1);
    filter_header.splice(0, 1);
    const totalIndex = filter_header.indexOf("Total");
    filter_header = filter_header.filter((label) => label !== "Total");
    let allExceptLastAmount = filtered_branch[0].business_dict.Amount.slice(
      0,
      -1
    );
    allExceptLastAmount.splice(totalIndex, 1);
    if (this.myChart1) {
      this.myChart1.destroy();
    }
    if (this.myChart) {
      this.myChart.destroy();
    }
    this.label_data = filter_header;
    this.label_amount = allExceptLastAmount.map(
      (amount: number) => amount * -1
    );
    let rgubuz = this.label_amount;
    let filterrgubuz = rgubuz.slice(0, totalIndex);
    let combinedData = filterrgubuz.map((amount, index) => ({
      amount: amount,
      label: this.label_data[index],
    }));

    combinedData.sort((a, b) => b.amount - a.amount);

    let top6 = combinedData.slice(0, 5);
    let remaining = combinedData.slice(5);
    let totalRemainingAmount = remaining.reduce((accumulator, currentItem) => {
      return accumulator + (currentItem.amount || 0);
    }, 0);

    // let top6 = combinedData;
    let branch = this.transformed_report_list.filter(
      (item) => item.name == "NET PROFIT"
    );

    top6 = top6.map((item) => {
      let index = this.header_names.indexOf("Total");
      let amount = branch[0].business_dict.Amount[index - 1];

      return {
        ...item,
        sort: amount,
      };
    });
    let index = this.header_names.indexOf("Total");
    let amount = branch[0].business_dict.Amount[index - 1];
    let newEntry = {
      amount: totalRemainingAmount,
      label: "OTHERS",
      sort: amount,
    };
    this.top6_data = top6;
    this.top6_data.push(newEntry);

    setTimeout(() => {
      this.chart2();
      this.chart();
    }, 500);
  }

  back_to_roa() {
    this.Roa_summary = true;
    this.chart_summary = false;
  }
  level_show(data) {
    if (data == "All_lable") {
      this.All_lable = true;
      this.Some_lable = false;
    } else {
      this.All_lable = false;
      this.Some_lable = true;
    }
  }

  show_monthwise(name) {
    let branch;
    if (this.myChart1) {
      this.myChart1.destroy();
    }
    this.label_amount = [];
    this.label_data = [];
    this.buzname = name.name;
    if (this.branch_code_login === "") {
      if (this.roaSearchForm.value.view?.name == "Bank As a Whole") {
        branch = 6666;
      } else {
        branch = this.roaSearchForm.value.branch_id?.code ?? "";
      }
    } else {
      branch = this.branch_code_login;
    }
    let amount = this.roaSearchForm.value.amount?.id ?? "";
    let finyear = this.roaSearchForm.value.finyear?.finyer ?? "";
    let from_month = this.roaSearchForm.value.frommonth?.month_id ?? "";
    let to_month = this.roaSearchForm.value.tomonth?.month_id ?? "";
    this.SpinnerService.show();
    this.dataService
      .top_six_buz(finyear, from_month, to_month, branch, amount, name.code, 1)
      .subscribe((results: any[]) => {
        const monthMap = [
          "",
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        this.perticullar_buz = true;
        for (let a of results["data"]) {
          this.label_amount.push(a.total_closing_amount);
          const monthName = monthMap[a.month];
          const formattedString = `${a.finyear} - ${monthName}`;
          this.label_data.push(formattedString);
        }
        let tot = this.label_amount;
        tot.sort((a, b) => b - a);
        let one = tot.slice(0, 1);
        this.totalamt = one[0];

        this.get_net_profit(name.name);
        this.chart3();
      });
    // this.label_amount = [500,300,700,200,800,1000]
    // this.label_data = ["Apr","May","Jun","Jul","Aug","Sep"]
  }

  chart3() {
    console.log("chart2", this.label_amount);

    this.canvas1 = document.getElementById("myChart1");
    this.ctx1 = this.canvas1.getContext("2d");
    let delayed;

    this.myChart1 = new Chart(this.ctx1, {
      type: "line",
      data: {
        labels: this.label_data,
        datasets: [
          {
            label: this.buzname,
            data: this.label_amount,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(173, 216, 230, 0.5)",
            fill: true,
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (
              context.type === "data" &&
              context.mode === "default" &&
              !delayed
            ) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
        plugins: {
          legend: {
            position: "top",
            display: false,
          },
          datalabels: {
            display: true,
            align: "end", // Align the labels at the end of the line
            anchor: "end", // Position them at the end (outside)
            formatter: (value) => {
              return (
                this.roaSearchForm.value.amount.name == "Actuals"
                  ? value / 10000000
                  : value / 1
              ).toFixed(2); // Format the label value
            },
            color: "#000", // Color of the label text
            font: {
              weight: "bold",
              size: 12, // Adjust the label text size if needed
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false, // Hide horizontal grid lines
            },
            beginAtZero: true,
          },
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          },
        },
      },
      plugins: [ChartDataLabels], // Add the datalabels plugin
    });

    const targetElement = document.getElementById("myChart1");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  chart() {
    const name = [];
    const amount = [];

    for (let datas of this.top6_data) {
      name.push(datas.label);
      amount.push(datas.amount);
    }

    this.canvas = document.getElementById("myChart");
    this.ctx = this.canvas.getContext("2d");
    let delayed;

    this.myChart = new Chart(this.ctx, {
      type: "doughnut",
      data: {
        labels: this.perticullar_buz == true ? this.label_data : name,
        datasets: [
          {
            label: "Total cases",
            data: this.perticullar_buz == true ? this.label_amount : amount,
            backgroundColor: [
              "#EF0107",
              "#F0AB00",
              "#03C03C",
              "#3e98c7",
              "#4B0082",
              "#E25822",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (
              context.type === "data" &&
              context.mode === "default" &&
              !delayed
            ) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
        plugins: {
          datalabels: {
            display: true,
            align: "center", // Center the label within each section
            anchor: "center",
            formatter: (value) => {
              return (
                this.roaSearchForm.value.amount.name == "Actuals"
                  ? value / 10000000
                  : value / 1
              ).toFixed(2); // Display the full amount
            },
            color: "#000", // Color of the label text
            font: {
              weight: "bold",
              size: 12, // Adjust the label text size if needed
            },
          },
          legend: {
            position: "right",
          },
          title: {
            display: false,
          },
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          },
        },
      },
      plugins: [ChartDataLabels], // Add the datalabels plugin
    });
  }

  getPercentage(amount: number, total: number): number {
    if (!total || isNaN(amount) || isNaN(total)) {
      return 0;
    }
    return (amount / total) * 100;
  }

  toggleAdvancedSearch() {
    this.isAdvancedSearchVisible = !this.isAdvancedSearchVisible;
  }

  downloadPDF() {
    this.SpinnerService.show();
    this.pdf_download = true;
    setTimeout(() => {
      this.NewdownloadPDF();
    }, 500);
  }

  NewdownloadPDF() {
    var doc = new jsPDF("p", "mm", "a4");
    var element = document.getElementById("chart-summary");

    var canvas1 = document.getElementById("myChart") as HTMLCanvasElement;
    var ctx1 = canvas1.getContext("2d");
    ctx1.save();
    ctx1.globalCompositeOperation = "destination-over";
    ctx1.fillStyle = "white";
    ctx1.fillRect(0, 0, canvas1.width, canvas1.height);
    ctx1.restore();

    var canvas2 = document.getElementById("myChart1") as HTMLCanvasElement;
    var ctx2 = canvas2.getContext("2d");
    ctx2.save();
    ctx2.globalCompositeOperation = "destination-over";
    ctx2.fillStyle = "white";
    ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
    ctx2.restore();

    doc.html(element, {
      callback: (pdf) => {
        pdf.save(this.level_dash_name + ".pdf");
      },
      x: 2,
      y: 2,
      width: 205,
      windowWidth: element.scrollWidth,
    });
    this.pdf_download = false;
    this.SpinnerService.hide();
  }

  level_data_api(code, name) {
    this.level_dash_name = name;
    this.buzname = "";
    let branch;
    if (this.branch_code_login === "") {
      if (this.roaSearchForm.value.view?.name == "Bank As a Whole") {
        branch = 6666;
      } else {
        branch = this.roaSearchForm.value.branch_id?.code ?? "";
      }
    } else {
      branch = this.branch_code_login;
    }
    let amount = this.roaSearchForm.value.amount?.id ?? "";
    let finyear = this.roaSearchForm.value.finyear?.finyer ?? "";
    let from_month = this.roaSearchForm.value.tomonth?.month_id ?? "";
    let to_month = "";
    let levelcode = code;
    this.SpinnerService.show();
    this.dataService
      .level_shown(finyear, from_month, to_month, branch, amount, levelcode, 2)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        if (this.myChart1) {
          this.myChart1.destroy();
        }
        if (this.myChart) {
          this.myChart.destroy();
        }
        this.perticullar_buz = false;
        let data = results["data"];
        if (data.length > 1) {
          this.label_data = [];
          this.label_amount = [];
          for (let a of data) {
            if (a.finyear == finyear && a.month == from_month) {
              for (let b of a.amounts_desc) {
                if (b.name != "Grand Total") {
                  this.label_data.push(b.name);
                  this.label_amount.push(b.closing_amount * -1);
                } else if (b.name == "Grand Total") {
                  this.sort_amount = b.closing_amount * -1;
                }
              }
            } else if (a.finyear == finyear && a.month == from_month - 1) {
              for (let b of a.amounts_desc) {
                if (b.name != "Grand Total") {
                  this.label_data_month.push(b.name);
                  this.label_amount_month.push(b.closing_amount * -1);
                }
              }
            }
          }
        }

        let combinedData = this.label_amount.map((amount, index) => ({
          amount: amount,
          label: this.label_data[index],
        }));

        combinedData.sort((a, b) => b.amount - a.amount);

        let top6 = combinedData.slice(0, 5);
        let remaining = combinedData.slice(5);
        let totalRemainingAmount = remaining.reduce(
          (accumulator, currentItem) => {
            return accumulator + (currentItem.amount || 0);
          },
          0
        );

        // let top6 = combinedData;
        let branch = this.transformed_report_list.filter(
          (item) => item.name == "NET PROFIT"
        );

        top6 = top6.map((item) => {
          let index = this.header_names.indexOf("Total");
          let amount = branch[0].business_dict.Amount[index - 1];

          return {
            ...item,
            sort: code == "" ? this.sort_amount : amount,
          };
        });
        let index = this.header_names.indexOf("Total");
        let amount = branch[0].business_dict.Amount[index - 1];
        let newEntry = {
          amount: totalRemainingAmount,
          label: "OTHERS",
          sort: code == "" ? this.sort_amount : amount,
        };
        this.top6_data = top6;
        this.top6_data.push(newEntry);

        setTimeout(() => {
          this.chart2();
          this.chart();
        }, 500);
      });
  }

  getPercentagepdf(amount: number, total: number): number {
    if (!total || isNaN(amount) || isNaN(total)) {
      return 0;
    }
    return Math.max(0, Math.min((amount / Math.abs(total)) * 100, 100)); // Ensure percentage is between 0 and 100
  }

  getProgressColor(index: number): string {
    switch (index) {
      case 0:
        return "#EF0107"; // Red
      case 1:
        return "#F0AB00"; // Yellow
      case 2:
        return "#03C03C"; // Green
      case 3:
        return "#3e98c7"; // Violet
      case 4:
        return "#4B0082"; // Blue
      case 5:
        return "#E25822"; // or
      default:
        return "#000"; // Fallback color
    }
  }

  get_net_profit(name) {
    let branch;
    if (this.branch_code_login === "") {
      if (this.roaSearchForm.value.view?.name == "Bank As a Whole") {
        branch = 6666;
      } else {
        branch = this.roaSearchForm.value.branch_id?.code ?? "";
      }
    } else {
      branch = this.branch_code_login;
    }
    let amount = this.roaSearchForm.value.amount?.id ?? "";
    let finyear = this.roaSearchForm.value.finyear?.finyer ?? "";
    let from_month = this.roaSearchForm.value.tomonth?.month_id ?? "";
    let to_month = "";
    let levelcode = "";
    this.SpinnerService.show();
    this.dataService
      .level_shown(finyear, from_month, to_month, branch, amount, levelcode, 2)
      .subscribe((results: any[]) => {
        let data = results["data"];
        this.top6_data = [];
        let yearParts = finyear.replace("FY", "").split("-");
        let firstYear = parseInt(yearParts[0]) - 1;
        let secondYear = parseInt(yearParts[1]) - 1;
        let result = `FY${firstYear}-${secondYear}`;
        const monthMap = [
          "",
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        let current;
        let currentgrant;
        let prevesyear;
        let preves;
        for (let a of data) {
          if (a.finyear == finyear && a.month == from_month) {
            if (a.amounts_desc.length != 0) {
              current = a.amounts_desc.filter((item) => item.name == name);
              if (current.length == 0) {
                current = [{ closing_amount: "0.00" }];
              }
              currentgrant = a.amounts_desc.filter(
                (item) => item.name == "Grand Total"
              );
              if (currentgrant.length == 0) {
                currentgrant = [{ closing_amount: "0.00" }];
              }
            } else {
              current = [{ closing_amount: "0.00" }];
              currentgrant = [{ closing_amount: "0.00" }];
            }
            this.top6_data.push({
              label: a.finyear + "-" + monthMap[a.month],
              amount: current[0].closing_amount,
              sort: currentgrant[0].closing_amount,
            });
          } else if (
            a.finyear == finyear &&
            a.month == parseInt(from_month) - 1
          ) {
            if (a.amounts_desc.length != 0) {
              preves = a.amounts_desc.filter((item) => item.name == name);
              if (preves.length == 0) {
                preves = [{ closing_amount: "0.00" }];
              }
              currentgrant = a.amounts_desc.filter(
                (item) => item.name == "Grand Total"
              );
              if (currentgrant.length == 0) {
                currentgrant = [{ closing_amount: "0.00" }];
              }
            } else {
              preves = [{ closing_amount: "0.00" }];
              currentgrant = [{ closing_amount: "0.00" }];
            }
            this.top6_data.push({
              label: a.finyear + "-" + monthMap[a.month],
              amount: preves[0].closing_amount,
              sort: currentgrant[0].closing_amount,
            });
          } else if (a.finyear == result) {
            if (a.amounts_desc.length != 0) {
              prevesyear = a.amounts_desc.filter((item) => item.name == name);
              if (prevesyear.length == 0) {
                prevesyear = [{ closing_amount: "0.00" }];
              }
              currentgrant = a.amounts_desc.filter(
                (item) => item.name == "Grand Total"
              );
              if (currentgrant.length == 0) {
                currentgrant = [{ closing_amount: "0.00" }];
              }
            } else {
              prevesyear = [{ closing_amount: "0.00" }];
              currentgrant = [{ closing_amount: "0.00" }];
            }
            this.top6_data.push({
              label: a.finyear + "-" + monthMap[a.month],
              amount: prevesyear[0].closing_amount,
              sort: currentgrant[0].closing_amount,
            });
          }
        }
        if (this.myChart) {
          this.myChart.destroy();
        }
        this.chart();
        this.SpinnerService.hide();
      });
  }

  roa_run() {
    this.roaSearchForm.reset()
    this.roa_runscreen = true;
    this.Roa_summary = false;
    this.chart_summary = false;
    this.roa_run_summary("");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    let startYear, endYear;
    
    if (currentMonth >= 3) {
        startYear = currentYear;
        endYear = currentYear + 1;
    } else {
        startYear = currentYear - 1;
        endYear = currentYear;
    }
    
    const formattedFinYear = 'FY' + startYear.toString().slice(-2) + '-' + endYear.toString().slice(-2);
    
    const matchedYear = this.finyearListrun.find(year => year.finyer === formattedFinYear);
    
    if (matchedYear) {
        this.roarun.patchValue({
            finyear: matchedYear,
        });
        this.to_month_fetch()
    }   
  
  }

  finyear_dropdown_run() {
    this.dataService.getfinyeardropdown("", 1).subscribe((results: any[]) => {
      let datas = results["data"];
      this.finyearListrun = datas;
    });
  }
  public displayfnfinyear_run(fin_year?: finyearList): string | undefined {
    return fin_year ? fin_year.finyer : undefined;
  }

  public displayStatus(aws_name?: branchList): string | undefined {
    return aws_name ? aws_name.name : undefined;
  }
  tomonthid: any;
  to_month_data: any;
  to_month_values: any;
  run_disable: boolean = false;
  eom_response: any;
  to_month_fetch() {
    let finyear = this.roarun.value.finyear?.finyer ?? "";
    this.roarun.controls["frommonth"].reset("");
    this.roarun.controls["tomonth"].reset("");
    // this.SpinnerService.show()
    this.tomonthid = "";
    this.dataService.get_to_month_fetch(finyear).subscribe((results: any) => {
      let datas = results;
      if (datas.set_code) {
        this.eom_response = datas;
        this.run_disable = true;
        // this.toastr.warning(datas.set_code)
      } else {
        this.run_disable = false;
        // this.SpinnerService.hide()
        this.to_month_data = datas?.month;
        const monthObject = this.from_month.find(
          (m) => m.month_id === this.to_month_data
        );
        this.tomonthid = monthObject.id;
        this.to_month_values = monthObject;
      }
    });
  }
  summary_data: any = [];
  roa_run_summary(value, page = 1) {
    let status = this.roarun.value.status?.id ?? "";
    let finyear = this.roarun.value.finyear?.finyer ?? "";

    this.SpinnerService.show();
    this.dataService.roa_run_summary(status, page, finyear).subscribe(
      (results: any) => {
        let datas = results["data"];

        if (this.summary_data.length >= 0) {
          datas.forEach((item) => {
            const fromMonth = this.from_month.find(
              (month) => month.month_id === item.from_month
            );
            const toMonth = this.from_month.find(
              (month) => month.month_id === item.to_month
            );

            item.from_month = fromMonth ? fromMonth.month : item.from_month;
            item.to_month = toMonth ? toMonth.month : item.to_month;
          });
          this.summary_data = datas;
          this.SpinnerService.hide();
          console.log("summary", this.summary_data);
          let datapagination = results["pagination"];
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
          this.data_found = true;
        }
        if (this.summary_data.length == 0) {
          this.SpinnerService.hide();
          this.has_next = false;
          this.has_previous = false;
          this.presentpage = 1;
          this.data_found = false;
        }
      },
      (error) => {
        this.SpinnerService.hide();
      }
    );
  }
  previousClick() {
    if (this.has_previous === true) {
      this.roa_run_summary("", this.presentpage - 1);
    }
  }
  nextClick() {
    if (this.has_next === true) {
      this.roa_run_summary("", this.presentpage + 1);
    }
  }

  reset_run() {
    this.roarun.reset();
    this.summary_data = [];
    this.roa_run_summary("");
    this.run_disable = false;
  }

  to_month_patch() {
    this.roarun.patchValue({
      tomonth: this.to_month_values.month,
    });
  }

  roa_summary_run() {
    this.roa_runscreen = false;
    this.Roa_summary = true;
    this.chart_summary = false;
    this.roaSearchForm.patchValue({
      frommonth: this.from_month[0],
    });
    this.roaSearchForm.patchValue({
      amount: this.Amount_List[1],
    });
    this.roarun.reset()
  }

  roa_run_trigger() {
    if (
      this.roarun.value.finyear == "" ||
      this.roarun.value.finyear === null ||
      this.roarun.value.finyear === undefined
    ) {
      this.toastr.warning("", "Please Select The Finyear");
      return false;
    }
    if (
      this.roarun.value.frommonth == "" ||
      this.roarun.value.frommonth === null ||
      this.roarun.value.frommonth === undefined
    ) {
      this.toastr.warning("", "Please Select The From Month");
      return false;
    }
    const monthObject = this.from_month.find(
      (m) => m.month === this.roarun.value.tomonth
    );

    if (
      monthObject?.month == "" ||
      monthObject?.month === null ||
      monthObject?.month === undefined
    ) {
      this.toastr.warning("", "Please Select The To Month");
      return false;
    }
    let params = {
      fy: this.roarun.value.finyear?.finyer ?? "",
      from_month: this.roarun.value.frommonth?.month_id ?? "",
      to_month: monthObject?.month_id ?? "",
      branch: "",
      sectorid: "",
      report_type: 1,
    };
    this.SpinnerService.show();
    this.dataService.roa_ppr_run_trigger(params).subscribe((results: any) => {
      let datas = results;
      this.SpinnerService.hide();
      if (datas.message) {
        this.toastr.warning(datas.message);
      }
      if (datas.status) {
        this.toastr.success("SUCCESSFULLY RUN");
      }
      this.roarun.controls["frommonth"].reset("");
      this.roarun.controls["tomonth"].reset("");
    });
  }
}
