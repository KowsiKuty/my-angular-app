import { Component, EventEmitter, OnInit, Output, LOCALE_ID, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/service/data.service';
import { MemoService } from 'src/app/ememo/memo.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/service/shared.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-attendancecreate',
  templateUrl: './attendancecreate.component.html',
  styleUrls: ['./attendancecreate.component.scss']
})
export class AttendancecreateComponent implements OnInit {
  url: any = environment.apiURL
  restfiled: any
  employee_id: any
  assignee_id: any = ''
  inputobj: any
  assigne: any = { "method": "get", "url": this.url + "usrserv/memosearchemp", "searchkey": "query", params: "", "displaykey": "full_name", "label": "Assignee" }
  fromdate: any = ''
  todate: any = ''
  remarks: FormGroup
  restfiledassigne: any
  isAdmin: boolean = false
  remarksdefault: string
  @Output() onCancel = new EventEmitter<any>();
  constructor(private fb: FormBuilder, private SpinnerService: NgxSpinnerService, private toastr: ToastrService, private memoService: MemoService, public sharedService: SharedService, @Inject(LOCALE_ID) public locale: string,) { }

  ngOnInit(): void {
    this.sharedService.transactionList.forEach(element => {
      if (element.name === "e-Memo") {
        let obj_submodule = element.submodule;
        obj_submodule.forEach(submoduleelement => {
          if (submoduleelement.name === "Delegation-LL/MDL") {
            let obj_submodulerole = submoduleelement.role
            obj_submodulerole.forEach(submodulerole_elem => {
              if (submodulerole_elem.name === "Admin") {
                this.isAdmin = true
              }
            })
          }
        })
      }
    });
    this.remarks = this.fb.group({
      remarks: ''
    })
    const getToken = localStorage.getItem("sessionData");
    console.log("getToken", getToken)
    let tokenValue = JSON.parse(getToken);

    let defaultdata = {
      "id": tokenValue.employee_id,
      "full_name": tokenValue.name
    }
    if (!this.isAdmin) {
      this.inputobj = { "method": "get", "url": this.url + "usrserv/memosearchemp", "searchkey": "query", params: "", "displaykey": "full_name", "label": "Employee", defaultvalue: defaultdata, disabled: true }

    }
    else {
      this.inputobj = { "method": "get", "url": this.url + "usrserv/memosearchemp", "searchkey": "query", params: "", "displaykey": "full_name", "label": "Employee" }
    }
  }
  selectedemployee(data) {
    this.employee_id = data
    this.remarkspatch()

  }
  selectedassignee(data) {
    this.assignee_id = data
    this.remarkspatch()

  }
  // http://
  Submitmemo() {
    if (this.fromdate === undefined || this.fromdate === null || this.fromdate === '') {
      this.toastr.error("Please Choose From date")
      return false
    }
    if (this.todate === undefined || this.todate === null || this.todate === '') {
      this.toastr.error("Please Choose to date")
      return false
    }
    if (this.employee_id === undefined || this.employee_id === null || this.employee_id === '') {
      this.toastr.error("Please Choose Employee")
      return false
    }
    if (this.assignee_id === undefined || this.assignee_id === null || this.assignee_id === '') {
      this.toastr.error("Please Choose Assignee")
      return false
    }
    let data = {
      "from_date": this.fromdate,
      "to_date": this.todate,
      "remarks": this.remarks.value.remarks,
      "employee_id": this.employee_id.id,
      "assigned_to": this.assignee_id.id,


    }
    this.memoService.submitattendance(data).subscribe((res) => {
      this.SpinnerService.hide();
      if (res.code) {
        this.toastr.error(res.description);
        // this.restfiled = []
        // this.restfiledassigne = []
        // this.onCancel.emit()

      }
      else {
        this.toastr.success(res.message);
        this.restfiled = []
        this.restfiledassigne = []
        this.onCancel.emit()
      }
    },
      error => {
        this.SpinnerService.hide();
      }
    );

  }
  fromdateclick(data) {
    this.fromdate = data
    console.log("fdate", this.fromdate)
    if (data) {
      this.remarkspatch()
    }
  }
  todateclick(data) {
    this.todate = data
    console.log("todate", this.todate)
    if (data) {
      this.remarkspatch()
    }
  }
  backtosummary() {
    this.onCancel.emit()

  }
  remarkspatch() {
    this.remarksdefault = "Notes of "
    this.remarksdefault += this.employee_id?.full_name + "  are assigned to " + this.assignee_id?.full_name
    this.remarksdefault += " for approval during "

    if (this.fromdate) {
      this.remarksdefault += formatDate(this.fromdate, 'dd-MMM-yyyy', this.locale)
    }

    if (this.todate) {
      this.remarksdefault += " to " + formatDate(this.todate, 'dd-MMM-yyyy', this.locale)
    }
    console.log("this.remarksdefault", this.remarksdefault)
    this.remarks.get('remarks').setValue(this.remarksdefault)
  }
}
