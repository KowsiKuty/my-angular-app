import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DssService } from '../dss.service';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MMM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
export interface assetlist {
  id: number
  name: string
}
export interface assetLists {
  id: number
  name: string
}
export class ItemList {
  constructor(public item: string, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}
export class finyearList {
  finyer: string
}

@Component({
  selector: 'app-dss-active',
  templateUrl: './dss-active.component.html',
  styleUrls: ['./dss-active.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    DatePipe
  ],
})
export class DssActiveComponent implements OnInit {
  activeclient_summary: any;
  assetList: assetlist[];
  isLoading: boolean;
  ppractiveclient: FormGroup;
  assestgrp = new FormControl();
  incomeinput = new FormControl();
  clientinput = new FormControl();
  @ViewChild('closepop') closepop
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('finyearsInput') finyearsInput: any;
  public chipSelectedprod: assetlist[] = [];
  public chipSelectedprodid = [];
  chipSelectedEmployeeDept: assetLists[] = []
  public chipSelectedEmployeeDeptid = [];
  assectval: { asset_id: any[]; month: number; };
  headerdata: string[];
  incomedata: any;
  monthsearch: number;
  assest: any;
  Max_date = new Date();
  chipSelectedprodname: any = [];
  tomonth: boolean = true;
  month = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'YTD']
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
  start_month_arr: any = [];
  to_date: any;
  todate: string;
  fromdate: string;
  file_details: any;
  numberoffiled: any;
  filed_name: any;
  boptotalamount: number;
  closingamount: number;
  attritionamount: number;
  new_clientamount: number;
  active: boolean = true;
  client: boolean = false;
  label_names: ["bop", "new", "attritions", "closing"]
  finyearList: any;
  colspanlength: any;
  dssactive: any;
  attritions: number;
  closings: number;
  new_clients: number;
  bops: number;
  closing: number;
  attrition: number;
  new_client: number;
  bop: number;
  activeclient_dashboard: boolean = false;
  from_date: any;
  to_dates: any;
  dashboard_Summary: any;
  myChart1: any;
  myChart: any;
  canvas: any;
  canvas1: any;
  ctx: any;
  ctx1: any;
  color_list: string[] = [];
  label_data: string[] = [];
  label_amount_co: number[] = []
  label_amount_op: number[] = [];
  label_amount_no: number[] = [];
  dash_array: any = [];
  activeclient_screen: boolean = true;
  finyear: any;
  businessDict: any;
  bopss: string;
  attritionss: number;
  closingss: string;
  new_clientss: number;
  updatedindex: number[] = []
  updatedindex1: number[] = []
  removeddatas: any;
  dash_summary: ({ name: string; amount: string; } | { name: string; amount: number; })[];
  closingamounts: number;
  attritionamounts: number;
  new_clientamounts: number;
  boptotalamounts: number;
  removeddatas_index: any;
  Active_table: boolean = false;
  selectedMonth: string = '';
  from_months: number;
  finyear_dashboard: any;


  constructor(private fb: FormBuilder, private datePipe: DatePipe, private toastr: ToastrService, private dssservice: DssService, private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.dssactive = this.fb.group({
      finyear: [''],
      client_fromdate: [''],
      client_todate: [''],
    })
    this.activeclient_screen = true
  }

  finyear_dropdown() {
    let prokeyvalue: String = "";
    this.getsfinyear(prokeyvalue);
    this.dssactive.get('finyear').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dssservice.getfinyeardropdown(value, 1)
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
  private getsfinyear(prokeyvalue) {
    this.dssservice.getfinyeardropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.finyearList = datas;
      })
  }
  public displayfinyear(fin_year?: finyearList): string | undefined {
    return fin_year ? fin_year.finyer : undefined;
  }

  frommonthid: any;
  frommonthsearch(month) {
    this.frommonthid = month.id
    this.from_months = this.frommonthid - 1
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
    this.colspanlength = this.month.length
    this.start_month_arr = this.month
    console.log('month=>', this.month)
    this.dssactive.controls['client_todate'].reset('')
    this.headerdata = this.month
    console.log("colspanlength=>", this.colspanlength)
    this.tomonth = false
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
    this.headerdata = this.month
    console.log("month changes=>", this.month)    
  }
  dsssearch_clear(assestgrp, dssactive) {
    this.chipSelectedprod = []
    this.chipSelectedprodid = []
    this.chipSelectedprodname = []
    dssactive.controls['finyear'].reset('');
    dssactive.controls['client_todate'].reset('');
    dssactive.controls['client_fromdate'].reset('');
  }
  activesearch(assestgrp, assestval, dateval, pageNumber = 1, pageSize = 10) {
    if (this.dssactive.value.finyear == null || this.dssactive.value.finyear == undefined || this.dssactive.value.finyear == "") {
      this.toastr.warning('', 'Please Select Finyear', { timeOut: 1500 });
      return false;
    }
    if (this.dssactive.value.client_fromdate == null || this.dssactive.value.client_fromdate == undefined || this.dssactive.value.client_fromdate == '') {
      this.toastr.warning('', 'Please Select Form Month', { timeOut: 1500 });
      return false;
    }
    if (this.dssactive.value.client_todate == null || this.dssactive.value.client_todate == undefined || this.dssactive.value.client_todate == '') {
      this.toastr.warning('', 'Please Select To Month', { timeOut: 1500 });
      return false;
    }
    console.log("asset=>", this.chipSelectedprodid)
    console.log("dateval=>", dateval)
    var from_date = assestval.value.client_fromdate.month_id
    var to_date = assestval.value.client_todate.month_id
    this.fromdate = assestval.value.client_fromdate
    this.todate = assestval.value.client_todate
    let from_month = assestval.value.client_fromdate.month
    let to_months = assestval.value.client_todate.month
    this.assest = {
      "from_month": from_date,
      "to_month": to_date ? to_date : "",
      "finyear": this.dssactive.value.finyear?.finyer ?? ""
    }
    console.log("assectval=>", this.assectval)
    this.active_clientlist(this.assest, pageNumber, pageSize)
  }
  active_clientlist(assectval, pageNumber, pageSize) {
    console.log("assectval", assectval)
    let bops = 0
    let new_clients = 0
    let attritions = 0
    let closings = 0
    this.boptotalamount = 0
    this.new_clientamount = 0
    this.attritionamount = 0
    this.closingamount = 0
    let from_months = assectval.from_month
    let to_months = assectval.to_month
    let from_month = from_months
    let to_month = to_months
    let finyear = this.dssactive.value.finyear?.finyer ?? ""
    this.SpinnerService.show();
    this.dssservice.activeclientsearch(from_month, to_month, finyear, pageNumber, pageSize).subscribe((results: any[]) => {
      this.SpinnerService.hide();
      console.log("results=>", results)
      let datas = results['data']
      this.activeclient_summary = datas
      this.Active_table = true
      if (this.activeclient_summary && Array.isArray(this.activeclient_summary)) {
        const businessDictItem = this.activeclient_summary.find(item => item.business_dict);
        if (businessDictItem) {
          this.businessDict = businessDictItem.business_dict;
        } else {
          console.error('Invalid API response format');
        }
      } else {
        console.error('Invalid API response format');
      }
      const updatedSummary = this.activeclient_summary.slice(0, -1);
      console.log("removed index:", updatedSummary)
      this.updatedindex.push(updatedSummary)
      this.removeddatas = this.updatedindex[0]
      console.log("removed array:", this.removeddatas)
      for (let summary of this.removeddatas) {
        console.log("bop=", summary)
        bops += summary.bop;
        new_clients += summary.new;
        attritions += summary.attrition;
        closings += summary.closing;
      }
      this.boptotalamount = bops;
      this.new_clientamount = new_clients;
      this.attritionamount = attritions;
      this.closingamount = closings;
      console.log("bop=>", this.boptotalamount)
      console.log("new=>", this.new_clientamount)
      console.log("client=>", this.attritionamount)
      console.log("close=>", this.closingamount)

      this.SpinnerService.hide();
      this.updatedindex = []
    }),
      error => {
        this.activeclient_summary = []
        this.SpinnerService.hide();
      }
  }

  clear_filedetails() {
    this.clientinput.reset('')
    this.incomeinput.reset('')
    this.file_details = ''
    this.filed_name = ''
    this.numberoffiled = ''
  }

  upload_file(e) {
    console.log("event=>", e.target.files[0])
    let file_uplode = e.target.files[0]
    this.file_details = file_uplode
  }
  upload(numberoffiled) {
    console.log("numberoffield=>", numberoffiled)
    console.log("file_details=>", this.file_details)
    if (this.file_details == null || this.file_details == undefined || this.file_details == '') {
      this.toastr.warning('', 'Please Select The Any Excel file', { timeOut: 1500 });
      return false;
    }
    this.SpinnerService.show()
    this.dssservice.activeclientupload(this.file_details).subscribe(e => {
      this.SpinnerService.hide()
      console.log("element=>", e)
      if (e.status == 'success') {
        this.toastr.success('', e['message'], { timeOut: 1500 })
      } if (e.code == 'UNEXPECTED_ERROR') {
        this.toastr.warning('', e['description'], { timeOut: 1500 })
      }
      this.closepop.nativeElement.click();
      this.clientinput.reset('')
      this.incomeinput.reset('')
      this.file_details = ''
      this.filed_name = ''
      this.numberoffiled = ''
    })
  }

  fileuploadopen(filed_name, numberoffiled) {
    console.log("ref=>", filed_name, numberoffiled)
    this.numberoffiled = numberoffiled
    this.filed_name = filed_name
  }

  summar_param(assestval, pageNumber, pageSize) {
    console.log("assestval", assestval)
    if (this.dssactive.value.finyear == null || this.dssactive.value.finyear == undefined || this.dssactive.value.finyear == '') {
      this.toastr.warning('', 'Please Select Finyear', { timeOut: 1500 });
      return false;
    }
    if (this.dssactive.value.client_fromdate == null || this.dssactive.value.client_fromdate == undefined || this.dssactive.value.client_fromdate == '') {
      this.toastr.warning('', 'Please Select Form Month', { timeOut: 1500 });
      return false;
    }
    if (this.dssactive.value.client_todate == null || this.dssactive.value.client_todate == undefined || this.dssactive.value.client_todate == '') {
      this.toastr.warning('', 'Please Select To Month', { timeOut: 1500 });
      return false;
    }
    this.activeclient_dashboard = true
    this.activeclient_screen = false
    this.dashboard_display(assestval, pageNumber, pageSize)
  }
  dashboard_display(assestval, pageNumber, pageSize) {
    console.log("dashboard params", assestval)

    let bopsamount = 0
    let new_clients_amount = 0
    let attritions_amount = 0
    let closings_amount = 0
    this.boptotalamounts = 0
    this.new_clientamounts = 0
    this.attritionamounts = 0
    this.closingamounts = 0
    let type = 1
    this.SpinnerService.show()
    let from_months = this.dssactive.value.client_fromdate.month_id
    let to_months = this.dssactive.value.client_todate.month_id
    let from_month = from_months
    let to_month = to_months
    let finyear = this.dssactive.value.finyear?.finyer ?? ""
    this.dssservice.activeclientsearch(from_month, to_month, finyear, pageNumber, pageSize).subscribe((results: any) => {
      this.SpinnerService.hide();
      let data = results["data"]
      this.dashboard_Summary = data
      const updatedSummarys = this.dashboard_Summary.slice(0, -1);
      console.log("removed index:", updatedSummarys)
      this.updatedindex1.push(updatedSummarys)
      this.removeddatas_index = this.updatedindex1[0]
      console.log("removed array:", this.removeddatas_index)
      for (let summary of this.removeddatas_index) {
        console.log("bop=", summary)
        bopsamount += summary.bop;
        new_clients_amount += summary.new;
        attritions_amount += summary.attrition;
        closings_amount += summary.closing;
      }
      this.boptotalamounts = bopsamount;
      this.new_clientamounts = new_clients_amount;
      this.attritionamounts = attritions_amount;
      this.closingamounts = closings_amount;
      this.finyear_dashboard = finyear
      this.dash_array.push(this.boptotalamounts)
      this.dash_array.push(this.new_clientamounts)
      this.dash_array.push(this.attritionamounts)
      this.dash_array.push(this.closingamounts)
      this.dash_summary = [
        {
          "name": "BOP",
          "amount": this.boptotalamounts,
        },
        {
          "name": "NEW",
          "amount": this.new_clientamounts,
        },
        {
          "name": "Attrition",
          "amount": this.attritionamounts,
        },
        {
          "name": "Closing",
          "amount": this.closingamounts,
        }
      ]
      this.updatedindex1 = []
      for (let i = 0; i < this.dashboard_Summary.length; i++) {
        console.log("bop=", this.dashboard_Summary.bop)

        this.label_amount_op.push(this.dash_array)
        this.label_amount_co.push(this.dash_array)
        console.log("Bob array", this.label_data)
        console.log("Closing array", this.label_amount_op)
        console.log("Attritions array", this.label_amount_co)
        console.log("New array", this.label_amount_no)

        const hue = (i * 30) % 360;
        const saturation = 70; // Adjust as needed
        const lightness = 50 // Adjust as needed
        const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        this.color_list.push(color);
      }
      this.chart()
    });
  }
  finyears(arg0: string, finyears: any) {
    throw new Error('Method not implemented.');
  }

  chart() {
    this.canvas = document.getElementById('myChart');
    this.canvas1 = document.getElementById('myChart1');
    this.ctx = this.canvas.getContext('2d')
    this.ctx1 = this.canvas1.getContext('2d')
    this.myChart = new Chart(this.ctx, {
      type: 'doughnut',

      data: {
        labels: ["BOP", "NEW", "ATTRITION", "CLOSING"],
        datasets: [{
          label: 'Total cases.',
          data: this.label_amount_op[0],
          backgroundColor: this.generateRandomColors(this.dashboard_Summary.length),
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          legend: {
            position: 'right'
          },
          title: {
            display: true, // Display the title
          },
        },
        layout: {
          padding: {
            left: 0, // Adjust the left padding
            right: 0, // Adjust the right padding
            top: 0,
            bottom: 0
          }
        }
      }
    });
    this.chart2()
    this.label_amount_op = []
  }
  chart2() {
    let delayed;
    this.myChart1 = new Chart(this.ctx1, {
      type: 'bar', // Set the chart type to bar
      data: {
        labels: ["BOP", "NEW", "ATTRITION", "CLOSING"],
        datasets: [
          {
            label: 'Amount', // Add a label for the line dataset
            data: this.label_amount_co[0],
            type: 'bar', // Set the type to line for this dataset
            backgroundColor: this.generateRandomColors(this.dashboard_Summary.length),
            borderWidth: 1
            // fill: false // Do not fill the area under the line
          }]
      },
      options: {
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !delayed) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
        plugins: {
          legend: {
            position: 'top',
            display: false, // Set display to false to hide the legend
          },
          title: {
            display: true,
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
            bottom: 0
          }
        }
      }
    });
  }
  private generateRandomColors(count: number): string[] {
    const randomColors: string[] = [];
    for (let i = 0; i < count; i++) {
      const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
      randomColors.push(color);
    }
    return randomColors;
  }

  dashboard_sumary_back() {
    this.activeclient_dashboard = false
    this.activeclient_screen = true
    this.label_amount_co = []
    this.label_amount_op = []
    this.dash_array = []
    this.color_list = []
    if (this.Active_table == true) {
      this.Active_table = true
    } else {
      this.Active_table = false
    }
  }

  finyears_clear(){
    this.dssactive.controls['client_fromdate'].reset('');
    this.dssactive.controls['client_todate'].reset('');  
  }
}