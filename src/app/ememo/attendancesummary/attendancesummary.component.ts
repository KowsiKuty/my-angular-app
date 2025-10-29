import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/service/data.service';
import { MemoService } from 'src/app/ememo/memo.service'
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-attendancesummary',
  templateUrl: './attendancesummary.component.html',
  styleUrls: ['./attendancesummary.component.scss']
})
export class AttendancesummaryComponent implements OnInit {
  url: any = environment.apiURL
  issummary: boolean = true
  constructor(private fb: FormBuilder, private SpinnerService: NgxSpinnerService, private toastr: ToastrService, private memoService: MemoService) { }
  SummaryData: any = [{ "columnname": "From Date", "key": "from_date", "type": "Date", "datetype": "dd/MMM/yyyy" },
  { "columnname": "To date", "key": "to_date", "type": "Date", "datetype": "dd/MMM/yyyy" },
  { "columnname": "Employee", "key": "emp_name" },
  { "columnname": "Assignee", "key": "assigned_to" },
  { "columnname": "Created By", "key": "created_by" },
  { "columnname": "Created Date", "key": "created_date", "type": "Date", "datetype": "dd/MMM/yyyy h:mm:ss" },
  { "columnname": "Remarks", "key": "remarks" },
  { "columnname": "Status", "key": "is_active" },
  { "columnname": "InActive", "icon": "delete", function: true, clickfunction: this.deleted.bind(this), 'wholedata': true, "button": true, validate: true, validatefunction: this.InactiveRequest.bind(this) }

  ]
  // {
  //   columnname: "Download",
  //   key: "download",
  //   button: true,
  //   function: true,
  //   icon: "download",
  //   style: { cursor: "pointer" },
  //   validate: true,
  //   validatefunction: this.validation.bind(this),
  //   clickfunction: this.download_file.bind(this),
  // },

  SummaryApiObj: any = { "method": "get", "url": this.url + "memserv/create_leave_history", "params": "" }
  ngOnInit(): void {
  }
  createrequest() {
    if (this.issummary) {
      this.issummary = false
    }
    else {
      this.issummary = true
    }

  }

  InactiveRequest(data) {
    let config: any = {
      disabled: false,
      style: '',
      icon: 'delete',
      class: '',
      value: '',
      function: true
    };
    if (data.is_active == "Active") {
      config = {
        disabled: false,
        style: '',
        icon: 'delete',
        class: '',
        value: '',
        function: true

      };
    }
    else {
      config = {
        disabled: true,
        style: '',
        icon: 'delete',
        class: '',
        value: '',
        function: false

      };
    }
    return config

  }

  deleted(data) {
    let datass = {
      "leave_id": data?.id
    }
    console.log("deleted", datass)
    this.memoService.deleteattendance(datass).subscribe((res) => {
      this.SpinnerService.hide();
      if (res.code) {
        this.toastr.error(res.description);
        this.SummaryApiObj = { "method": "get", "url": this.url + "memserv/create_leave_history", "params": "" }


      }
      else {
        this.toastr.success(res.message);
        this.SummaryApiObj = { "method": "get", "url": this.url + "memserv/create_leave_history", "params": "" }


      }
    },
      error => {
        this.SpinnerService.hide();
      }
    );

  }
}
// ,VsChipdropdownModule,VsDepDropdownModule,VsSearchInpModule,
