import { Component, OnInit, ViewChild, } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { DrsService } from "../drs.service";
import { MatAutocomplete, MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DatePipe, formatDate } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { ErrorhandlingService } from "src/app/ppr/errorhandling.service";
import * as XLSX from 'xlsx';
import { Router } from "@angular/router";
import { SharedDrsService } from "../shared-drs.service"; 
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map, debounce, skip } from 'rxjs/operators';
import { fromEvent } from "rxjs";



export interface drs {
  name: string;
  code: number;
  id: number;
  reportsummary: string;
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
  selector: 'app-drssummary',
  templateUrl: './drssummary.component.html',
  styleUrls: ['./drssummary.component.scss'],
  providers: [{ provide: DateAdapter, useClass: PickDateAdapter },
  { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe]
})
export class DrssummaryComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild("report_name") report_name: MatAutocomplete;


  report_summary: FormGroup;
  report_view: FormGroup;
  has_previous: boolean;
  has_next: any;
  presentpage: any=1;
  data_found: boolean = true;
  evantlue: number;
  isClicked: boolean;
  report_data_list: any;
  report_sumdata: any;
  report_view_list: any;
  report_view_flag: Boolean = false;
  report_view_name: any;
  reportmaster_list: any;
  aws_search_val: any;
  dss_report_data: any;
  drs_report_param: { type: any; };
  drs_report_data: any;
  summarydata: any;
  reportmaster: FormGroup;
  search_data: { created_date: string; file_name: string; id: number; status: number; type: string; }[];
  current_date = new Date();
  rmDrop: any;
  input_params: { reportmaster_id: any; reportheader_id: any; reportgroup_id: any; reporttype_id: any; };
  value: any;
  datatable: any;
  drssummry:boolean= true;
  summrytemplate:boolean= false;
  isLoading: boolean;
  has_nextbrasum: boolean;
  currentpagebrasum: number;
  has_previousbrasum: boolean;

  constructor(private errorHandler: ErrorhandlingService, private fb: FormBuilder, private drsService: DrsService, private SpinnerService: NgxSpinnerService, private toastr: ToastrService, public datepipe: DatePipe,    private router: Router,
    private drsservice: SharedDrsService,
    ) { }

  ngOnInit(): void {
    this.report_summary = this.fb.group({
      report_code: "",
      report_name: "",
      create_date: [''],
      file_name: ['']
    })
    this.report_view = this.fb.group({
      Amount: "",
      Name: "",
      report_name: "",
      name: "",
      report_amount: ""
    });

    this.drs_report_summary(this.report_summary.value, 1)

  }
  // public reportmaster_display(reportmaster_name?: drs): string | undefined {
  //   return reportmaster_name ? reportmaster_name.name : undefined;
  // }


   public displayfnreportsum(file_name?: drs): string | undefined {
      return file_name ? file_name.name : undefined;
    }
  
   report_drop() {
      // this.spinnerservice.show()
  
      let prokeyvalue: String = "";
      this.getaudict_brasum_drop(prokeyvalue);
      this.report_summary.get('file_name').valueChanges
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
                this.isLoading = false
  
              }),
            )
          )
        )
        .subscribe((results: any) => {
          // this.spinnerservice.hide()
          let data_bra_sum = results["data"]
          this.reportmaster_list = data_bra_sum;
          console.log("report_create_dropdown", this.reportmaster_list)
          this.isLoading = false
        })
  
    }
  
    private getaudict_brasum_drop(prokeyvalue) {
      // this.spinnerservice.show()
      this.drsService.reportmasterdrop(prokeyvalue, 1)
        .subscribe((results: any[]) => {
          this.SpinnerService.hide()
          let data_bra_sum = results["data"];
          this.reportmaster_list = data_bra_sum;
          this.isLoading = false
        })
  
    }

    @ViewChild('reportContactInput') reportContactInput: any;
    @ViewChild('reportsum') matAutocompletebrasum: MatAutocomplete;
  
    autocompletereportsumScroll() {
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
                  this.drsService.reportmasterdrop(this.reportContactInput.nativeElement.value, this.currentpagebrasum + 1)
                    .subscribe((results: any[]) => {
                      let data_bra_sum = results["data"];
                      let datapagination = results["pagination"];
                      this.reportmaster_list = this.reportmaster_list.concat(data_bra_sum);
                      if (this.reportmaster_list.length >= 0) {
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

    
  // reportmasterdrop() {
  //   this.rmDrop = this.report_summary.controls["file_name"].value;
  //   let value = ''

  //   // let name = this.rmDrop?.name ?? "";
  //   this.drsService.reportmasterdrop(value, 1).subscribe((results: any) => {
  //     let data = results["data"];
  //     this.reportmaster_list = data;
  //   });
  // }
  drs_report_summary(drs, pageNumber = 1) {
    let report_sumdata = drs;
    let date = ''
    if (report_sumdata.create_date != '' || report_sumdata.create_date != undefined || report_sumdata.create_date != null) {

      date = this.datepipe.transform(report_sumdata.create_date, 'yyyy-MM-dd')
    }
    this.aws_search_val = report_sumdata
    let search_val = {
      name: report_sumdata.file_name?.name??"",
      created_date: date
    }
    for (let val in search_val) {
      if (search_val[val] === null || search_val[val] === "" || search_val[val] === undefined) {
        search_val[val] = ''
      }
    }
    console.log("search_val", search_val)
    this.SpinnerService.show()
    this.drsService.report_summary_master(search_val, pageNumber).subscribe((results: any) => {
      this.SpinnerService.hide()
      let data = results["data"];
      let datapagination = results["pagination"];
      this.report_data_list = data;
      if (this.report_data_list?.length > 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.presentpage = datapagination.index;
        this.data_found = true;
      } if (results["set_code"] || this.report_data_list?.length == 0) {
        this.has_next = false;
        this.has_previous = false;
        this.presentpage = 1;
        this.data_found = false;
        this.toastr.warning("", 'No Data Found')
      }
    });
  }
  report_file_get(report, file_type) {
    console.log(report.id, file_type)
    let fileid = report.id
    let filetype = file_type
    this.SpinnerService.show()
    this.drsService.Reportfile_download(fileid, filetype).subscribe((results: any) => {
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(results)
      console.log("results", results)
      if (results.type == "application/json") {
        this.toastr.warning("", 'No Data Found')
        return false
      }
      console.log("binaryData", binaryData)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      console.log(downloadUrl)
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = report.name + "." + file_type;
      link.click();
      this.toastr.success('Successfully Download');
    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }
  get_report_view(report, file_type) {
    console.log(report.id, file_type)
    let fileid = report.id
    let filetype = file_type
    this.SpinnerService.show()
    this.drsService.Reportfile_download(fileid, filetype).subscribe((results: any) => {
      this.SpinnerService.hide()
      console.log("results", results)
      let data = results["data"];
      if (data.length == 0) {
        this.toastr.warning("", 'No Data Found')
        return false
      }
      this.report_view_list = data
      this.report_view_name = results["filename"]
      this.report_view_flag = true

    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }
  previousClick() {
    if (this.has_previous === true) {
      this.drs_report_summary(this.aws_search_val, this.presentpage - 1);
    }
  }
  nextClick() {
    if (this.has_next === true) {
      this.drs_report_summary(this.aws_search_val, this.presentpage + 1);
    }
  }
  back_summary() {
    this.report_view_flag = false
    this.drs_report_summary(this.report_summary.value, 1)

  }
  clear_summary() {
    this.report_summary.reset('')
  }
  report_header_list(data) {
    let params_data = { "reportmaster_id": data.id }
    // this.SpinnerService.show()
    // this.drsService.report_header_level(params_data)
    //   .subscribe((results: any[]) => {
    //     this.SpinnerService.hide()
    //     let datas = results["data"];
    //     if (datas.length == 0) {
    //       this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
    //     } else {
    //       for (var val in datas) {
    //         datas[val].toolkey = 'Report Header'
            //   // this.index_expense=this.index_expense+1
          // }
          // console.log("data", data)
          // this.report_view_list = datas
          this.report_view_flag = false
          // this.report_view_name = data.name
          this.drsservice.View_values.next(data.id);
          this.drsservice.schedule_flag.next(data.flag);
          
          this.drsservice.View_name.next(data.name);
          this.drsservice.ViewFullData.next(data);
          // this.router.navigate(["drs/template"], {});
          this.drssummry= false;
          this.summrytemplate= true;
          // }

      // }, error => {
      //   this.errorHandler.handleError(error);
      //   this.SpinnerService.hide();
      // })
  }
  treelevel_click(ind, drsreport, drs_report_data) {
    console.log("flag", drsreport.tree_flag)
    let data = drsreport
    this.value = data
    let data1 = drs_report_data
    let a = []
    let a2 = ind + 1
    if (data.tree_flag == 'N') {
      if (data.padding_left == '10px') {
        for (let i = a2; i < data1.length; i++) {
          let a1 = data1[i]
          console.log("a", a)
          if (a1.padding_left == '10px') { break; }
          else { a.push(i) }
          console.log("Block statement execution no." + i);
        }
      }
      if (data.padding_left == '50px') {
        for (let i = a2; i < data1.length; i++) {
          let a1 = data1[i]
          a.push(i)
          if ((a1.padding_left == '50px') || (a1.padding_left == '10px')) { break; }
          else { a.push(i) }
          console.log("Block statement execution no." + i);
        }
      }
      if (data.padding_left == '75px') {
        for (let i = a2; i < data1.length; i++) {
          let a1 = data1[i]
          if ((a1.padding_left == '75px') || (a1.padding_left == '50px') || (a1.padding_left == '10px')) { break; }
          else { a.push(i) }
          console.log("Block statement execution no." + i);
        }
      }
      if (data.padding_left == '100px') {
        for (let i = a2; i < data1.length; i++) {
          let a1 = data1[i]
          if ((a1.padding_left == '100px') || (a1.padding_left == '75px') || (a1.padding_left == '50px') || (a1.padding_left == '10px')) { break; }
          else { a.push(i) }
          console.log("Block statement execution no." + i);
        }
      }
      // a.pop()
      const indexSet = new Set(a);

      const arrayWithValuesRemoved = data1.filter((value, i) => !indexSet.has(i));
      arrayWithValuesRemoved[ind].tree_flag = 'Y'
      this.report_view_list = arrayWithValuesRemoved;
      console.log(arrayWithValuesRemoved);
    } else {

      if (data.padding_left == '10px' && this.value.doc_type == "header") {
        let input_params = {
          "reportmaster_id": data.report_id,
          "reportheader_id": data.id,
        }
        this.report_group_list(ind, input_params, data1)
        console.log("input_params", input_params)
      }
      if (data.padding_left == '50px' && this.value.doc_type == "group") {
        let input_params = {
          "reportmaster_id": data.report_id,
          "reportheader_id": data.header_id,
          "reportgroup_id": data.id
        }
        this.report_type_list(ind, input_params, data1)
        console.log("input_params", input_params)
      }
      // }else{
      //   let input_params={
      //     "reportmaster_id":data.report_id,
      //     "reportheader_id":data.header_id,
      //     "reportgroup_id":data.group_id,
      //     "reporttype_id":data.id
      //   }
      //   this.scheduler_master_list(ind,input_params,data1)
      //   console.log("input_params",input_params)          
      // }
      if (data.padding_left == '75px' && this.value.doc_type == "report_item" || this.value.doc_type == "report_item" && data.padding_left == '50px') {
        let input_params = {
          "reportmaster_id": data.report_id,
          "reportheader_id": data.header_id,
          "reportgroup_id": data.group_id,
          "reporttype_id": data.id
        }
        this.scheduler_master_list(ind, input_params, data1)
        console.log("input_params", input_params)
      }
      if (data.padding_left == '100px' && this.value.doc_type == "scheduler_master" || this.value.doc_type == "scheduler_master" && data.padding_left == '75px') {
        let input_params = {
          "reportmaster_id": data.report_id,
          "reportheader_id": data.header_id,
          "reportgroup_id": data.group_id,
          // "reporttype_id":data.reporttype_id,
          "reporttype_id": data.reporttype_id,
          "schedulermaster_id": data.id
        }
        this.scheduler_type_list(ind, input_params, data1)
        console.log("input_params", input_params)
      }

    }
  }
  index_expense: any;
  private report_group_list(ind, data, data1) {
    this.index_expense = ind + 1
    this.SpinnerService.show()
    // if(data.doc_type== "report_item"){
    //   this.scheduler_master_list(ind,this.input_params,data1);

    // }
    // if(data.doc_type== "group"){

    this.drsService.report_group_list(data)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()

        let data = results["data"];
        if (data.length == 0) {
          this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
        } else {

          for (var val of data) {
            let a = data

            data1.splice(this.index_expense, 0, val);
            this.index_expense = this.index_expense + 1
          }
          data1[ind].tree_flag = 'N'
          // for (var val in data) {
            // if (data.padding_left == '10px' && this.value.doc_type == "header") {
              for (var val in data) {
                data[val].toolkey = 'Report Group / Report Type'

              }     
            // } else {
            //   for (var val in data) {
            //     data[val].toolkey = 'Report Item'

            //   }  
            // }

          // }
          this.report_view_list = data1;
        }
        console.log("report_view_list", this.report_view_list)

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    // }
  }
  // if(datas.doc_type== "report_item"){


  index_subcat: any;
  private report_type_list(ind, data, data1) {
    this.index_expense = ind + 1
    // if(this.value.doc_type== "group"){
    this.SpinnerService.show()
    this.drsService.report_type_list(data)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()

        let datas = results["data"];

        if (datas.length == 0) {
          this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
          // this.scheduler_master_list(ind,this.input_params,data1)


        } else {
          for (var val in datas) {
            datas[val].toolkey = 'Report Type'
          }

          for (var val of datas) {
            let a = data

            data1.splice(this.index_expense, 0, val);
            this.index_expense = this.index_expense + 1
          }
          data1[ind].tree_flag = 'N'
          this.report_view_list = data1;
        }

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    // }else{

    // }
  }
  // }
  private scheduler_master_list(ind, data, data1) {
    this.index_expense = ind + 1
    this.SpinnerService.show()
    this.drsService.scheduler_master_list(data)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()

        let datas = results["data"];

        if (datas.length == 0) {
          this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
        } else {
          for (var val in datas) {
            datas[val].toolkey = 'Schedule Master'
          }
          for (var val of datas) {
            let a = data

            data1.splice(this.index_expense, 0, val);
            this.index_expense = this.index_expense + 1
          }
          data1[ind].tree_flag = 'N'
          this.report_view_list = data1;
        }

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  private scheduler_type_list(ind, data, data1) {
    this.index_expense = ind + 1
    this.SpinnerService.show()
    this.drsService.scheduler_type_list(data)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["data"];
        if (datas.length == 0) {
          this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
        } else {
          for (var val in datas) {
            // datas[val].toolkey = 'Schedule Type'
          }
          for (var val of datas) {
            let a = data

            data1.splice(this.index_expense, 0, val);
            this.index_expense = this.index_expense + 1
          }
          data1[ind].tree_flag = 'N'

          this.report_view_list = data1;
        }

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  trigger_report_filedownload(report, file_type) {
    console.log(report.id, file_type)
    let fileid = report.id
    let filetype = file_type
    this.SpinnerService.show()
    let fileparams = {
      "id": fileid,
      "filetype": file_type
    }
    this.drsService.reportdownload_trigger(fileparams).subscribe((results: any) => {
      this.SpinnerService.hide()
      console.log("results", results)
      let data = results["data"];
      if (data.length == 0) {
        this.toastr.warning("", 'No Data Found')
        return false
      }
      else {
        this.toastr.success('Process Started')
        return true
      }

    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }
  Screendownload() {

    let profit = document.getElementById('datatable')
    console.log("profit=>", profit)
    // let Head=document.getElementById('headtable')
    let head = []
    head = this.report_view_name
    console.log("head=>", this.report_view_name)


    const T_table: XLSX.WorkSheet = XLSX.utils.table_to_sheet(profit)
    console.log("T_table=>", T_table)
    let profitability: any = XLSX.utils.sheet_to_json(T_table, { header: 1 });
    const arr = Array(profitability[0].length).fill("")
    let cal = Math.floor(arr.length / 2)
    console.log(arr, cal);
    profitability.splice(0, 0, arr)
    console.log("profitability=>", profitability)
    let max_length = Math.max(arr.length)
    let head_report = []
    head_report.push(Array(max_length).fill(""))
    head_report.push(Array(max_length + 1).fill(""))
    console.log("head_report=>", head_report)
    let header_position = Math.floor(max_length / 2)
    head_report[1].splice(header_position, 0, head)
    // const arr = Array(profitability[0].length).fill("")

    // let max_length=Math.max(arr.length)
    // let head_report = []
    // head_report.push(Array(max_length).fill(""))
    // head_report.push(Array(max_length+1).fill(""))
    // console.log("head_report=>",head_report)
    // let header_position=Math.floor(max_length/2)
    // head_report[1].splice(header_position,0,'Variance Report')


    // let header= this.datatable[0].report_view_name 
    // console.log("header=>", header)

    // let Expence:any=XLSX.utils.sheet_to_json(T_table,{ header: 1 }); 
    // console.log("Expence=>",Expence)

    profitability.splice(0, 0, head_report[1])

    let worksheet = XLSX.utils.json_to_sheet(profitability, { skipHeader: true });;
    console.log("worksheet=>", worksheet)
    console.log("worksheet=>", worksheet)
    const new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, worksheet, this.report_view_name);
    XLSX.writeFile(new_workbook, this.report_view_name + ".xls");


  }
}
