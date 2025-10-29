import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MemoService } from 'src/app/ememo/memo.service';
import { NgxSpinnerService } from "ngx-spinner";
import { map, takeUntil } from 'rxjs/operators';
import { NotificationService } from 'src/app/service/notification.service';
import { HttpResponse } from '@angular/common/http';
import { fromEvent } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ThemePalette } from '@angular/material/core';

const isSkipLocationChange = environment.isSkipLocationChange

export interface iToNameList {
  id: number;
  full_name: string;
}
export interface iDeptList {
  name: string;
  id: number;
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
  selector: 'app-memoreport',
  templateUrl: './memoreport.component.html',
  styleUrls: ['./memoreport.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class MemoreportComponent implements OnInit {
  deparmentwise: boolean = false
  memowise: boolean = false
  staffwise: boolean = true
  links = ['StaffWise Report', 'DepartmentWise Report', 'MemoWise Report'];
  activeLink = this.links[0];
  background: ThemePalette = undefined;
  switchtab(data) {
    if (data === 'StaffWise Report') {
      this.staffwise = true
      this.deparmentwise = false
      this.memowise = false
      this.staffwiseapi = {
        method: "get",
        url: this.url + "memserv/report_documents_summary",
        params: "&type=STAFF"
      };
    }
    else if (data === 'DepartmentWise Report') {
      this.deparmentwise = true
      this.staffwise = false
      this.memowise = false
      this.staffwiseapi = {
        method: "get",
        url: this.url + "memserv/report_documents_summary",
        params: "&type=DEPT"
      };
    }
    else if (data === 'MemoWise Report') {
      this.memowise = true
      this.deparmentwise = false
      this.staffwise = false
      this.staffwiseapi = {
        method: "get",
        url: this.url + "memserv/report_documents_summary",
        params: "&type=MEMO"
      };

    }
  }
  staffwisedata: any = [

    { columnname: "File Name", key: "file_name" },

    {
      columnname: "Status", key: "remarks", validate: true, validatefunction: this.statusvalidation.bind(this),
    },

    { columnname: "Created On", key: "created_date", type: "Date", "datetype": "dd-MMM-yyyy HH:MM:SS" },

    // { columnname: "Header Name", key: "rm" },

    {
      columnname: "Download",
      key: "download",
      button: true,
      function: true,
      icon: "download",
      style: { cursor: "pointer" },
      validate: true,
      validatefunction: this.validation.bind(this),
      clickfunction: this.download_file.bind(this),
    },
    // {
    //   columnname: "Refresh",
    //   key: "replay",
    //   button: true,
    //   function: true,
    //   icon: "replay",
    //   style: { cursor: "pointer" },
    //   // validate: true,
    //   // validatefunction: this.validation.bind(this),
    //   clickfunction: this.refreshsummary.bind(this),
    // },

  ];
  refreshsummary() {
    if (this.staffwise) {
      this.staffwiseapi = {
        method: "get",
        url: this.url + "memserv/report_documents_summary",
        params: "&type=STAFF"
      };
    }
    else if (this.deparmentwise) {
      this.staffwiseapi = {
        method: "get",
        url: this.url + "memserv/report_documents_summary",
        params: "&type=DEPT"
      };
    }
    else if (this.memowise) {
      this.staffwiseapi = {
        method: "get",
        url: this.url + "memserv/report_documents_summary",
        params: "&type=MEMO"
      };
    }
  }
  // {
  //   columnname: "Action",
  //   key: "remarks",
  //   button: true,
  //   function: true,
  //   validate: true,
  //   style: { cursor: "pointer" },
  //   validatefunction: this.activityeditfn.bind(this),
  //   clickfunction: this.activityUpdate.bind(this),
  // },
  // activityeditfn(data) {
  //   let config: any = {
  //     disabled: false,
  //     style: "",
  //     icon: "",
  //     class: "",
  //     value: "",
  //     function: false,
  //   };
  //   if (this.vendor_flag == true) {
  //     if (data.modify_ref_id > 0) {
  //       config = {
  //         disabled: true,
  //         style: { color: "gray" },
  //         icon: "edit",
  //         class: "",
  //         value: "",
  //         function: false,
  //       };
  //     } else if (data.modify_ref_id == "-1") {
  //       config = {
  //         disabled: false,
  //         style: { color: "green" },
  //         icon: "edit",
  //         class: "",
  //         value: "",
  //         function: true,
  //       };
  //     }
  //   } else if (this.vendor_flag == false) {
  //     config = {
  //       disabled: true,
  //       style: { color: "gray" },
  //       icon: "edit",
  //       class: "",
  //       value: "",
  //       function: false,
  //     };
  //   }
  //   return config;
  // }
  statusvalidation(data) {
    let config: any = {
      value: ''
    }
    if (data?.status == 1) {
      config = {
        value: "Pending"
      }
    }
    else if (data?.status == 2) {
      config = {
        value: "Process"
      }
    }
    else if (data?.status == 3) {
      config = {
        value: "Completed"
      }
    }
    else {
      config = {
        value: "Failed"
      }
    }
    return config
  }
  // pending = 1
  // process = 2
  // completed = 3
  // failed = 4
  validation(data) {
    let config: any = {
      disabled: true,
      icon: "download",
      function: false,
    }
    if (data?.status == 3) {
      config = {
        disabled: false,
        icon: "download",
        function: true,
      }
    }
    else {
      config = {
        function: false,
        icon: "download",
        disabled: true
      }
    }
    return config

  }
  download_file(dataw) {
    this.memoService.download_schedular(dataw?.id).subscribe((result: HttpResponse<Blob>) => {
      const contentType = result.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        this.SpinnerService.hide();
        const reader = new FileReader();
        reader.onloadend = () => {
          const data = JSON.parse(reader.result as string);
          // console.log('JSON response:', data);
          // Now you can handle the parsed JSON data as needed
          if (data.code) {
            this.notification.showError(data.description)
          }
        };
        reader.readAsText(result.body);
      }
      else {
        this.SpinnerService.hide();
        let data = [];
        data.push(result.body);

        let downloadurl = window.URL.createObjectURL(new Blob(data));
        let link = document.createElement('a');
        link.href = downloadurl;
        link.download = dataw?.file_name + ".xlsx";
        link.click();
        this.notification.showSuccess(dataw?.file_name + ' Downloaded!...');
      }
    },
      error => {
        this.SpinnerService.hide();
        // console.log(error)
        this.notification.showError('Failed To Load Data' + error);
      }
    );
  }
  url: any = environment.apiURL
  staffwiseapi: any = {
    method: "get",
    url: this.url + "memserv/report_documents_summary",
  };
  toggleBackground() {
    this.background = this.background ? undefined : 'primary';
  }
  form_Search_Userwise: FormGroup;
  form_Search_Deptwise: FormGroup;
  from_Search_Memowise: FormGroup;
  isLoading = false;
  ToList: Array<iToNameList>;
  Department_List: Array<iDeptList>;
  selectedName: iToNameList;
  selectedDept: iDeptList;

  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  @ViewChild('staffInput') staffInput: any;
  @ViewChild('departmentInput') departmentInput: any;
  @ViewChild('autotoid') matAutocompleteStaff: MatAutocomplete;
  @ViewChild('autodeptid') matAutocompleteDep: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  //@ViewChild('autotoid') matStaffAutocomplete: MatAutocomplete;
  // @ViewChild('autodeptid') matDepAutocomplete: MatAutocomplete;
  constructor(private memoService: MemoService, private datePipe: DatePipe, private SpinnerService: NgxSpinnerService, private notification: NotificationService,
    private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.form_Search_Userwise = new FormGroup({
      to_id: new FormControl(null),
      memodatefrom: new FormControl(null),
      memodateto: new FormControl(null),
      reporttype_tat_ageing: new FormControl(null),
      chk_allparticipants: new FormControl(null)
    })

    this.form_Search_Deptwise = new FormGroup({
      dept_id: new FormControl(null),
      deptdatefrom: new FormControl(null),
      deptdateto: new FormControl(null),
      dept_tat_ageing: new FormControl(null),
      chk_deptallparticipants: new FormControl(null)
    })
    this.from_Search_Memowise = new FormGroup({
      memowisedatefrom: new FormControl(null),
      memowisedateto: new FormControl(null),
      memo_tat_ageing: new FormControl(null)

    })

    this.form_Search_Userwise.get('to_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.memoService.get_EmployeeList(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ToList = datas;
        let datapagination = results["pagination"];
        if (this.ToList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
      })


    this.form_Search_Deptwise.get('dept_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.memoService.getDepartmentPage(value, 1, '')
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Department_List = datas;
        let datapagination = results["pagination"];
        if (this.Department_List.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
      })

  }

  displayToName(selectedname?: iToNameList): string {
    return selectedname ? selectedname.full_name : '';
  }

  displayDeptName(selecteddept?: iDeptList): string {
    return selecteddept ? selecteddept.name : '';
  }
  clk_Download() {

    if (this.form_Search_Userwise.value.memodatefrom === null) {
      this.SpinnerService.hide();
      this.toastr.error('StaffWise Report', 'Please enter Date from value', { timeOut: 1500 });
      return;
    }
    if (this.form_Search_Userwise.value.memodateto === null) {
      this.SpinnerService.hide();
      this.toastr.error('StaffWise Report', 'Please enter Date to value', { timeOut: 1500 });
      return;
    }
    if(!this.form_Search_Userwise.value.to_id){
      this.SpinnerService.hide();
      this.toastr.error('StaffWise Report', 'Please Select To value', { timeOut: 1500 });
      return;
    }
     if(!this.form_Search_Userwise.value.reporttype_tat_ageing){
      this.SpinnerService.hide();
      this.toastr.error('StaffWise Report', 'Please Select TAT or AGEING', { timeOut: 1500 });
      return;
    }
    let final_json = {
      "approver_id": this.form_Search_Userwise.value.to_id.id,
      "date_from": this.datePipe.transform(new Date(this.form_Search_Userwise.value.memodatefrom), 'yyyy-MM-dd'),
      "date_to": this.datePipe.transform(new Date(this.form_Search_Userwise.value.memodateto), 'yyyy-MM-dd'),
      "report_type": this.form_Search_Userwise.value.reporttype_tat_ageing
    }
    let filename = this.form_Search_Userwise.value.to_id.full_name + "_";
    filename += this.datePipe.transform(new Date(this.form_Search_Userwise.value.memodatefrom), 'yyyy-MM-dd') + "_";
    filename += this.datePipe.transform(new Date(this.form_Search_Userwise.value.memodateto), 'yyyy-MM-dd') + "_";
    filename += this.form_Search_Userwise.value.reporttype_tat_ageing;
    filename += ".xlsx"
    // console.log("this.form_Search_Userwise.value.chk_allparticipants " + this.form_Search_Userwise.value.chk_allparticipants)
    if (this.form_Search_Userwise.value.chk_allparticipants == true) {
      final_json["status"] = "for_all";
    } else {
      final_json["status"] = "for_me";
    }
    this.SpinnerService.show();
if(this.form_Search_Userwise.value.reporttype_tat_ageing == "TAT"){
 this.memoService.TATDownl(final_json).subscribe((result: HttpResponse<Blob>) => {
      const contentType = result.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        this.SpinnerService.hide();
        const reader = new FileReader();
        reader.onloadend = () => {
          const data = JSON.parse(reader.result as string);
          // console.log('JSON response:', data);
          // Now you can handle the parsed JSON data as needed
          if (data.code) {
            this.notification.showError(data.description)
          }
          else {
            this.notification.showSuccess("Please Click the refresh button after sometime")
          }
        };
        reader.readAsText(result.body);
      }
      else {
        this.SpinnerService.hide();
        let data = [];
        data.push(result.body);

        let downloadurl = window.URL.createObjectURL(new Blob(data));
        let link = document.createElement('a');
        link.href = downloadurl;
        link.download = filename;
        link.click();
        this.notification.showSuccess(filename + ' Downloaded!...');
      }
    },
      error => {
        this.SpinnerService.hide();
        // console.log(error)
        this.notification.showError('Failed To Load Data' + error);
      }
    );
}
if(this.form_Search_Userwise.value.reporttype_tat_ageing == "AGEING"){
 this.memoService.AgingDownl(final_json).subscribe((result: HttpResponse<Blob>) => {
      const contentType = result.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        this.SpinnerService.hide();
        const reader = new FileReader();
        reader.onloadend = () => {
          const data = JSON.parse(reader.result as string);
          // console.log('JSON response:', data);
          // Now you can handle the parsed JSON data as needed
          if (data.code) {
            this.notification.showError(data.description)
          }
          else {
            this.notification.showSuccess("Please Click the refresh button after sometime")
          }
        };
        reader.readAsText(result.body);
      }
      else {
        this.SpinnerService.hide();
        let data = [];
        data.push(result.body);

        let downloadurl = window.URL.createObjectURL(new Blob(data));
        let link = document.createElement('a');
        link.href = downloadurl;
        link.download = filename;
        link.click();
        this.notification.showSuccess(filename + ' Downloaded!...');
      }
    },
      error => {
        this.SpinnerService.hide();
        // console.log(error)
        this.notification.showError('Failed To Load Data' + error);
      }
    );
} 
// else{
//     this.memoService.staffwise_deptwise_tat_ageing(final_json).subscribe((result: HttpResponse<Blob>) => {
//       const contentType = result.headers.get('content-type');
//       if (contentType && contentType.includes('application/json')) {
//         this.SpinnerService.hide();
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           const data = JSON.parse(reader.result as string);
//           // console.log('JSON response:', data);
//           // Now you can handle the parsed JSON data as needed
//           if (data.code) {
//             this.notification.showError(data.description)
//           }
//           else {
//             this.notification.showSuccess("Please Click the refresh button after sometime")
//           }
//         };
//         reader.readAsText(result.body);
//       }
//       else {
//         this.SpinnerService.hide();
//         let data = [];
//         data.push(result.body);

//         let downloadurl = window.URL.createObjectURL(new Blob(data));
//         let link = document.createElement('a');
//         link.href = downloadurl;
//         link.download = filename;
//         link.click();
//         this.notification.showSuccess(filename + ' Downloaded!...');
//       }
//     },
//       error => {
//         this.SpinnerService.hide();
//         // console.log(error)
//         this.notification.showError('Failed To Load Data' + error);
//       }
//     );
   
//   }
  }

  clk_DownloadDept() {
    // console.log(this.form_Search_Deptwise.value.dept_id)
    if (this.form_Search_Deptwise.value.deptdatefrom === null) {
      this.SpinnerService.hide();
      this.toastr.error('DepartmentWise Report', 'Please enter Date from value', { timeOut: 1500 });
      return;
    }
    if (this.form_Search_Deptwise.value.deptdateto === null) {
      this.SpinnerService.hide();
      this.toastr.error('DepartmentWise Report', 'Please enter Date to value', { timeOut: 1500 });
      return;
    }
    if (!this.form_Search_Deptwise.value.dept_id) {
      this.SpinnerService.hide();
      this.toastr.error('DepartmentWise Report', 'Please Select To', { timeOut: 1500 });
      return;
    }
    if (!this.form_Search_Deptwise.value.dept_tat_ageing) {
      this.SpinnerService.hide();
      this.toastr.error('DepartmentWise Report', 'Please Select TAT or AGEING', { timeOut: 1500 });
      return;
    }
    let final_json = {
      "dept_id": this.form_Search_Deptwise.value.dept_id.id,
      "date_from": this.datePipe.transform(new Date(this.form_Search_Deptwise.value.deptdatefrom), 'yyyy-MM-dd'),
      "date_to": this.datePipe.transform(new Date(this.form_Search_Deptwise.value.deptdateto), 'yyyy-MM-dd'),
      "report_type": this.form_Search_Deptwise.value.dept_tat_ageing
    }

    let filename = this.form_Search_Deptwise.value.dept_id.view_name + "_";
    filename += this.datePipe.transform(new Date(this.form_Search_Deptwise.value.deptdatefrom), 'yyyy-MM-dd') + "_";
    filename += this.datePipe.transform(new Date(this.form_Search_Deptwise.value.deptdateto), 'yyyy-MM-dd') + "_";
    filename += this.form_Search_Deptwise.value.dept_tat_ageing;
    filename += ".xlsx"
    // console.log("this.form_Search_Userwise.value.chk_allparticipants " + this.form_Search_Userwise.value.chk_allparticipants)
    if (this.form_Search_Deptwise.value.chk_deptallparticipants == true) {
      final_json["status"] = "for_all";
    } else {
      final_json["status"] = "for_me";
    }
    this.SpinnerService.show();
if(this.form_Search_Deptwise.value.dept_tat_ageing == "TAT"){
    this.memoService.TATDownl(final_json).subscribe((result: HttpResponse<Blob>) => {
      const contentType = result.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        this.SpinnerService.hide();
        const reader = new FileReader();
        reader.onloadend = () => {
          const data = JSON.parse(reader.result as string);
          // console.log('JSON response:', data);
          // Now you can handle the parsed JSON data as needed
          if (data.code) {
            this.notification.showError(data.description)
          }
          else {
            this.notification.showSuccess("Please Click the refresh button after sometime")
          }
        };
        reader.readAsText(result.body);
      }
      else {
        this.SpinnerService.hide();
        let data = [];
        data.push(result.body);

        let downloadurl = window.URL.createObjectURL(new Blob(data));
        let link = document.createElement('a');
        link.href = downloadurl;
        link.download = filename;
        link.click();
        this.notification.showSuccess(filename + ' Downloaded!...');
      }
    },
      error => {
        this.SpinnerService.hide();
        // console.log(error)
        this.notification.showError('Failed To Load Data' + error);
      }
    );
  }
if(this.form_Search_Deptwise.value.dept_tat_ageing == "AGEING"){
    this.memoService.AgingDownl(final_json).subscribe((result: HttpResponse<Blob>) => {
      const contentType = result.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        this.SpinnerService.hide();
        const reader = new FileReader();
        reader.onloadend = () => {
          const data = JSON.parse(reader.result as string);
          // console.log('JSON response:', data);
          // Now you can handle the parsed JSON data as needed
          if (data.code) {
            this.notification.showError(data.description)
          }
          else {
            this.notification.showSuccess("Please Click the refresh button after sometime")
          }
        };
        reader.readAsText(result.body);
      }
      else {
        this.SpinnerService.hide();
        let data = [];
        data.push(result.body);

        let downloadurl = window.URL.createObjectURL(new Blob(data));
        let link = document.createElement('a');
        link.href = downloadurl;
        link.download = filename;
        link.click();
        this.notification.showSuccess(filename + ' Downloaded!...');
      }
    },
      error => {
        this.SpinnerService.hide();
        // console.log(error)
        this.notification.showError('Failed To Load Data' + error);
      }
    );
  }
  //  this.memoService.staffwise_deptwise_tat_ageing(final_json).subscribe((result: HttpResponse<Blob>) => {
  //     const contentType = result.headers.get('content-type');
  //     if (contentType && contentType.includes('application/json')) {
  //       this.SpinnerService.hide();
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         const data = JSON.parse(reader.result as string);
  //         // console.log('JSON response:', data);
  //         // Now you can handle the parsed JSON data as needed
  //         if (data.code) {
  //           this.notification.showError(data.description)
  //         }
  //         else {
  //           this.notification.showSuccess("Please Click the refresh button after sometime")
  //         }
  //       };
  //       reader.readAsText(result.body);
  //     }
  //     else {
  //       this.SpinnerService.hide();
  //       let data = [];
  //       data.push(result.body);

  //       let downloadurl = window.URL.createObjectURL(new Blob(data));
  //       let link = document.createElement('a');
  //       link.href = downloadurl;
  //       link.download = filename;
  //       link.click();
  //       this.notification.showSuccess(filename + ' Downloaded!...');
  //     }
  //   },
  //     error => {
  //       this.SpinnerService.hide();
  //       // console.log(error)
  //       this.notification.showError('Failed To Load Data' + error);
  //     }
  //   );
  }
  clk_DownloadMemo() {

    if (this.from_Search_Memowise.value.memowisedatefrom === null) {
      this.SpinnerService.hide();
      this.toastr.error('MemoWise Report', 'Please enter Date from value', { timeOut: 1500 });
      return;
    }
    if (this.from_Search_Memowise.value.memowisedateto === null) {
      this.SpinnerService.hide();
      this.toastr.error('MemoWise Report', 'Please enter Date to value', { timeOut: 1500 });
      return;
    }
    if (!this.from_Search_Memowise.value.memo_tat_ageing) {
      this.SpinnerService.hide();
      this.toastr.error('MemoWise Report', 'Please select TAT or AGEING', { timeOut: 1500 });
      return;
    }
    let final_json = {

      "date_from": this.datePipe.transform(new Date(this.from_Search_Memowise.value.memowisedatefrom), 'yyyy-MM-dd'),
      "date_to": this.datePipe.transform(new Date(this.from_Search_Memowise.value.memowisedateto), 'yyyy-MM-dd'),
      "report_type": this.from_Search_Memowise.value.memo_tat_ageing
    }
    let filename = "Memo_"
    filename += this.datePipe.transform(new Date(this.from_Search_Memowise.value.memowisedatefrom), 'yyyy-MM-dd') + "_";
    filename += this.datePipe.transform(new Date(this.from_Search_Memowise.value.memowisedateto), 'yyyy-MM-dd') + "_";
    filename += this.from_Search_Memowise.value.memo_tat_ageing;
    filename += ".xlsx"
    this.SpinnerService.show();
    // if(this.from_Search_Memowise.value.memo_tat_ageing =="TAT"){
    //    this.memoService.TATDownl(final_json).subscribe((result: HttpResponse<Blob>) => {
    //   const contentType = result.headers.get('content-type');
    //   if (contentType && contentType.includes('application/json')) {
    //     this.SpinnerService.hide();
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //       const data = JSON.parse(reader.result as string);
    //       // console.log('JSON response:', data);
    //       // Now you can handle the parsed JSON data as needed
    //       if (data.code) {
    //         this.notification.showError(data.description)
    //       }
    //     };
    //     reader.readAsText(result.body);
    //   }
    //   else {
    //     this.SpinnerService.hide();
    //     let data = [];
    //     data.push(result.body);

    //     let downloadurl = window.URL.createObjectURL(new Blob(data));
    //     let link = document.createElement('a');
    //     link.href = downloadurl;
    //     link.download = filename;
    //     link.click();
    //     this.notification.showSuccess(filename + ' Downloaded!...');
    //   }
    // },
    //   error => {
    //     this.SpinnerService.hide();
    //     // console.log(error)
    //     this.notification.showError('Failed To Load Data' + error);
    //   }
    // );
    // }
    // if(this.from_Search_Memowise.value.memo_tat_ageing =="AGEING"){
    //    this.memoService.AgingDownl(final_json).subscribe((result: HttpResponse<Blob>) => {
    //   const contentType = result.headers.get('content-type');
    //   if (contentType && contentType.includes('application/json')) {
    //     this.SpinnerService.hide();
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //       const data = JSON.parse(reader.result as string);
    //       // console.log('JSON response:', data);
    //       // Now you can handle the parsed JSON data as needed
    //       if (data.code) {
    //         this.notification.showError(data.description)
    //       }
    //     };
    //     reader.readAsText(result.body);
    //   }
    //   else {
    //     this.SpinnerService.hide();
    //     let data = [];
    //     data.push(result.body);

    //     let downloadurl = window.URL.createObjectURL(new Blob(data));
    //     let link = document.createElement('a');
    //     link.href = downloadurl;
    //     link.download = filename;
    //     link.click();
    //     this.notification.showSuccess(filename + ' Downloaded!...');
    //   }
    // },
    //   error => {
    //     this.SpinnerService.hide();
    //     // console.log(error)
    //     this.notification.showError('Failed To Load Data' + error);
    //   }
    // );
    // }
    this.memoService.memowise_tat_ageing(final_json).subscribe((result: HttpResponse<Blob>) => {
      const contentType = result.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        this.SpinnerService.hide();
        const reader = new FileReader();
        reader.onloadend = () => {
          const data = JSON.parse(reader.result as string);
          // console.log('JSON response:', data);
          // Now you can handle the parsed JSON data as needed
          if (data.code) {
            this.notification.showError(data.description)
          }
          else{
            this.notification.showSuccess("Please Click the refresh button after sometime")
          }
        };
        reader.readAsText(result.body);
      }
      else {
        this.SpinnerService.hide();
        let data = [];
        data.push(result.body);

        let downloadurl = window.URL.createObjectURL(new Blob(data));
        let link = document.createElement('a');
        link.href = downloadurl;
        link.download = filename;
        link.click();
        this.notification.showSuccess(filename + ' Downloaded!...');
      }
    },
      error => {
        this.SpinnerService.hide();
        // console.log(error)
        this.notification.showError('Failed To Load Data' + error);
      }
    );
  }

  autocompleteStaffScroll() {
    setTimeout(() => {
      if (
        this.matAutocompleteStaff &&
        this.autocompleteTrigger &&
        this.matAutocompleteStaff.panel
      ) {
        fromEvent(this.matAutocompleteStaff.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matAutocompleteStaff.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matAutocompleteStaff.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteStaff.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteStaff.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.memoService.get_EmployeeList(this.staffInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.ToList = this.ToList.concat(datas);
                    if (this.ToList.length >= 0) {
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

  autocompleteDepScroll() {
    setTimeout(() => {
      if (
        this.matAutocompleteDep &&
        this.autocompleteTrigger &&
        this.matAutocompleteDep.panel
      ) {
        fromEvent(this.matAutocompleteDep.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matAutocompleteDep.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matAutocompleteDep.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteDep.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteDep.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.memoService.getDepartmentPage(this.departmentInput.nativeElement.value, this.currentpage + 1, '')
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.Department_List = this.Department_List.concat(datas);
                    if (this.Department_List.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }//if (this.has_next === true)
            }//endof atBottom
          });
      }
    });
  }

  // onToNameSelected(event: any): void {
  //   this.selectedName = event.option.value;
  //   console.log("this.selectedName " + this.selectedName.full_name)
  //   // console.log("this.form_Search_Userwise.get('to_id') " + this.form_Search_Userwise.get('to_id'))
  //   this.form_Search_Userwise.controls['to_id'].setValue(event.option.value.id);

  // }



  // public displayTo(todisplay?: ToNameList): string | undefined {
  //   // console.log("todisplay" + todisplay.full_name)
  //   return todisplay ? todisplay.full_name : undefined;
  // }

  // get to_display() {
  //   console.log(" this.form_Search_Userwise.get('to_id');" + this.form_Search_Userwise.get('to_id'))
  //   return this.form_Search_Userwise.get('to_id');
  // }
 
}

