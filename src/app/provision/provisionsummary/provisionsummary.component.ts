import { Component, OnInit, Inject, Injectable, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ProisionshareserviceService } from '../proisionshareservice.service';
import { ProvisionService } from '../provision.service'
import { NotificationService } from '../notification.service';
import { ErrorHandlingprovisionService } from '../error-handlingprovision.service'
import { Router, ActivatedRoute } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOption, NativeDateAdapter } from '@angular/material/core';
import { DatePipe, formatDate } from '@angular/common';
import { MatDatepicker } from '@angular/material/datepicker';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, tap } from 'rxjs/operators';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { default as _rollupMoment, Moment } from 'moment';
import * as _moment from 'moment';
import { SharedService } from '../../service/shared.service';
const moment = _rollupMoment || _moment;
export interface BS {
  name: string;
  id: string;

}

export interface Module {
  text: string;
  id: string;

}
export interface BRANCH {
  name: string;
  id: string;

}

export interface DEPARTMENT {
  name: string;
  id: string;

}
export interface CC {
  name: string;
  id: string;

}

export interface maingl {
  glno: string;
}
export interface maincat {
  name: string;
  id: string;
  code: string;
}
export interface subcat {
  name: string;
  id: string;
  code: string;

}
export interface vendor {
  name: string;
  id: string
}


export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

@Injectable()
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
  selector: 'app-provisionsummary',
  templateUrl: './provisionsummary.component.html',
  styleUrls: ['./provisionsummary.component.scss'],
  providers: [

    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    // {provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions}

  ],
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProvisionsummaryComponent implements OnInit {
  [x: string]: any;
  file_upload: any;
  datenew = new FormControl('');
  datenew1 = new FormControl(moment());
  datenew2 = new FormControl(moment());
  maincatdata = [];
  maxDate = this.datenew1.value;
  catid: any;
  type_data = [{
    "id": 1, "name": "PREPAID"
  }, {
    "id": 2, "name": "UNPAID"
  }

  ]
  touchedRows: any[];
  subcatdata = [];
  StatusSelect = new FormControl("")
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date1.value;
    ctrlValue.year(normalizedYear.year());
    this.date1.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date1.value;
    ctrlValue.month(normalizedMonth.month());
    this.date1.setValue(ctrlValue);
    datepicker.close();
  }

  VendorstatusesList1 = [{
    "name": "Draft",
    "status": 1
  },

  {
    "name": "Pending checker approval",
    "status": 2
  },
  {
    "name": "Pending EMC approval",
    "status": 3
  },
  {
    "name": "Approved",
    "status": 4
  },
  {
    "name": "Rejected",
    "status": 5
  },
  {
    "name": "Created by me",
    "status": 7
  },
  {
    "name": "Created by department",
    "status": 8
  },
  ]
  length = 1;
  showEmail: boolean = false;
  options: string[] = ['Approve', 'Reject'];
  provisiondata = [];
  provisiondata_previousmonth = [];
  has_previous_month = false;
  has_next_month = false;
  presentpages_month = 1
  has_previous = false;
  has_next = false;
  presentpage = 1;
  pdata: any;
  makerflag = false;
  checkerflag = false;
  approverflag = false;
  isChecked: any;
  provisionload = false;
  moveto_checker = [];
  prv_checker = [];
  previousp = [];
  isShown = false
  display: string;
  file: any; y
  dep_data: any;
  has_nexts = false;
  has_previouss = false;
  presentpage2 = 1;
  approval: any;
  approvaldata = []
  dept_id: Array<any> = [];
  date = new Date().toLocaleString('en-us', { month: 'long' });
  pre_date = new Date()
  month = (this.pre_date.getMonth() + 1) - 1
  year = this.pre_date.getFullYear()
  previousm = this.pre_date.setMonth(this.pre_date.getMonth() - 1);
  previousMonth = this.pre_date.toLocaleString('default', { month: 'long' });
  // tabs=[this.date,this.previousMonth]
  pform: FormGroup;
  tabs = [{
    "tab_name": "Provisions Submission-" + this.date.toString(),
    "tab_id": "1"
  },
  {
    "tab_name": "Provisions Taken-" + this.previousMonth,
    "tab_id": "2"
  },
  {
    "tab_name": 'Provision WiseFin Pipeline-' + this.date,
    "tab_id": "3"
  }
  ]
  tomorrow = new Date();
  searchid: any;
  filterdata: any;
  provisionsearch: FormGroup;
  p_mainStatus: any;
  previous = false;
  hidden = false;
  tab3 = false;
  ccdata: any;
  bsid: any;
  bsdata: any;
  isLoading: boolean;
  branchdata: any;
  vendordata: any;
  is_pipeline = false;
  search = false;
  provisionflagid = 0;
  selected = '1'
  disable_form = false;
  Selected = {
    "id": 2, "name": "UNPAID"
  }

  constructor(public datepipe: DatePipe, private fb: FormBuilder, private Service: ProvisionService, private notification: NotificationService, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingprovisionService,
    public share: ProisionshareserviceService, public router: Router, private cdr: ChangeDetectorRef, private shareService: SharedService,) {


    this.tomorrow.setDate(this.tomorrow.getDate());
  }



  ngOnInit(): void {
    // this.subModuleData('USER');
    let datas: any = this.shareService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "Provision") {
        subModule.forEach((innerElement) => {
          let obj = {
            "tab_name": innerElement.name,
            "tab_id": innerElement.id,
          }
          this.tabs.push(obj);
        })
      }
    })
    this.provisionsearch = this.fb.group({
      expense_date: [null],
      cc_id: [''],
      bs_id: [''],
      dept_id: [''],
      gl_no: [''],
      month: [''],
      year: [''],
      type: [''],
      module_id: [''], status: [''],
      disable: [this.disable_form]


    })
    this.touchedRows = [];
    this.pform = this.fb.group({
      users: new FormArray([])
    });
    // this.catggggget(0)
    // this.get_count()
    // this.provisionsummary(1, 10);
    this.moduleData()

  }

  patchDefaultStatus() {
    let dataToPatchStatus = this.VendorstatusesList[0]
    let status = dataToPatchStatus
    this.provisionsearch.patchValue({
      status: dataToPatchStatus
    })

  }




  get_count(data) {

    this.Service.getpvscount(data).subscribe((results: any[]) => {
      this.count = results["count"];
    },)

  }
  report_drop() {
    this.SpinnerService.show()
    this.Service.report_dropdown()
      .subscribe(async (results: any[]) => {
        this.VendorstatusesList = results["data"];
        let data = this.VendorstatusesList
        this.SpinnerService.hide()
        if (data?.length > 0) {
          await this.patchDefaultStatus()
        }
        if (data?.length > 0) {
          await this.provisionsearch1(1)
        }
      }, (error) => {
        this.SpinnerService.hide()

      })
  }
  //dynamic formgrid
  globalset = false
  getpform() {
    this.pform = this.fb.group({
      users: new FormArray([])
    });
    const control = <FormArray>this.pform.get('users');
    let dataToPush = this.provisiondata
    for (const data in dataToPush) {
      const grp = this.fb.group({
        cr_number: dataToPush[data].cr_number,
        gstflag: false,
        category_id: dataToPush[data].category_id,
        subcategory_id: dataToPush[data].subcategory_id,
        sgl_no: dataToPush[data].gl,
        glname: dataToPush[data].gl?.gl_name,
        selectAll: false,
        dept_id: dataToPush[data].dept_id,
        narration: dataToPush[data].narration,
        vendor_id: dataToPush[data].vendor_id,
        expense_date: this.datepipe.transform(dataToPush[data].expense_date, 'yyyy-MM-dd'),
        amount: dataToPush[data].amount,
        gst_amount: dataToPush[data].gst_amount,
        cc_id: dataToPush[data].cc_id,
        bs_id: dataToPush[data].bs_id,
        id: dataToPush[data].id,
        type: this.gettype(dataToPush[data].type),
        code: dataToPush[data].code,
        changed_amount: dataToPush[data].changed_amount,
        camount: this.getamount(dataToPush[data].changed_amount, 1),
        cgst_amount: this.getamount(dataToPush[data].changed_amount, 2),
        ap_amount: this.getamount(dataToPush[data].changed_amount, 3),
        apgst_amount: this.getamount(dataToPush[data].changed_amount, 4),
        invoice_date: dataToPush[data].invoice_date,
        invoice_no: dataToPush[data].invoice_no,
        provision_status: dataToPush[data].provision_status.status,
        isEditable: true,
        created_by: dataToPush[data].created_by.name,
        disable: this.disable_form,
        checkboxs: false,
        dirtyDetect: false,
        indexkey: data


      });
      control.push(grp);




    }
    this.length = (this.pform.get('users') as FormArray).controls.length

    // return

  }

  disableTooltip(element: MatOption) {
    return element._getHostElement().firstElementChild.scrollWidth === element._getHostElement().firstElementChild.clientWidth;
  }
  gettype(type) {
    if (type == null || type == undefined) {
      return 'UNPAID'
    }
    else {
      return type.name
    }
  }
  getamount(a, num) {
    if (a.length > 0) {
      if (num == 1) {
        return a[0].amount
      }
      if (num == 2) {
        return a[0].gst_amount
      }
    } else if (a.length > 1) {

      if (num == 3) {
        return a[1].amount
      }
      if (num == 4) {
        return a[1].gst_amount
      }

    }
    else {
      return []
    }

  }
  initiatForm(): FormGroup {
    let lengthOfForm = this.pform.value.users?.length
    return this.fb.group({
      cr_number: [''],
      gstflag: [false],
      provision_status: ['Draft'],
      category_id: [''],
      subcategory_id: [''],
      sgl_no: [''],
      glname: [''],
      dept_id: [''],
      check: [''],
      narration: [''],
      vendor_id: [1],
      expense_date: [new FormControl(moment())],
      amount: [''],
      gst_amount: [0],
      cc_id: [''],
      bs_id: [''],
      provisionflag: [''],
      invoice_date: [null],
      camount: [null],
      cgst_amount: [null],
      ap_amount: [null],
      selectAll: [false],
      apgst_amount: [null],
      changed_amount: [
        []
      ],
      code: '',
      type: 'UNPAID',
      // depdetails: new FormArray([this.deparment_get()]),
      invoice_no: [null],
      isEditable: [false],
      created_by: [],
      disable: [this.disable_form],
      checkboxs: false,
      dirtyDetect: false,
      indexkey: lengthOfForm

    });
  }

  get getFormData(): FormArray {
    return <FormArray>this.pform.get('users');
  }

  addUser() {
    const control = <FormArray>this.pform.get('users');
    control.push(this.initiatForm());
  }

  remove(index: number) {
    const control = <FormArray>this.pform.get('users');
    control.removeAt(index);
  }
  // formgrid ends 
  subModuleData(p) {
    if (p == 0) {
      // this.provisionsummary(1, 10);
      this.report_drop()
      // this.patchDefaultStatus()
      this.provisionsearch.reset();
      this.provisionflagid = 1;
      this.notification.showInfo("click add ( +) for new provision entry")
      // this.provisionload = true;
      // this.previous = false;
    } else if (p == 1) {
      // this.previous = true;
      this.previos(1);
      this.provisionflagid = 2
      this.provisionsearch.reset();
      // this.provisionload = false;
    } else if (p == 2) {
      this.internalapi(1, 10, 1)
      this.provisionflagid = 3
      this.provisionsearch.reset();
    } else if (p == 3) {
      this.provisionflagid = 4
      this.provisionsearch.reset();
    }
  }
  public previos(p) {
    this.previousp = []
    this.prv_checker = []
    this.Service.previousdata(p, this.month, this.year)
      .subscribe((results: any[]) => {
        this.provisiondata_previousmonth = results["data"];
        // this.makerflag=results["flag"].is_maker;
        if (this.provisiondata_previousmonth.length > 0) {
          this.has_next_month = results['pagination'].has_next;

          this.has_previous_month = results['pagination'].has_previous;
          this.presentpages_month = results['pagination'].index;
        } else {
          this.provisiondata_previousmonth = [];
        }
      })

  }
  previoussearch() {
    var d =
      this.datepipe.transform(this.date1.value, 'MM')

    this.Service.datesaerch(d)
      .subscribe((results: any[]) => {
        this.provisiondata_previousmonth = results["data"];
        if (this.provisiondata_previousmonth.length > 0) {
          this.has_next_month = results['pagination'].has_next;
          this.has_previous_month = results['pagination'].has_previous;
          this.presentpages_month = results['pagination'].index;
          this.provisionsearch.reset();
        } else {
          this.provisiondata_previousmonth = [];
        }
      })
  }
  ValidationDataBasedOnStatusSearch: boolean = false

  provisionsearch1(page) {
    this.search = true;
    // this.tab3=true;
    this.moveto_checker = [];

    if (this.provisionsearch.value.module_id == null || this.provisionsearch.value.module_id == '') {
      this.provisionsearch.value.module_id = ''
    }
    else {
      let module_id = (this.provisionsearch.value.module_id.module_id)
      if (module_id != undefined) {
        this.provisionsearch.value.module_id = module_id.module_id
      } else {
        this.provisionsearch.value.module_id = this.provisionsearch.value.module_id;
      }
    }
    if (this.provisionsearch.value.status == null || this.provisionsearch.value.status == '') {
      this.provisionsearch.value.status = ''
    }
    else {
      let status = (this.provisionsearch.value.status.status)
      if (status != undefined) {
        this.provisionsearch.value.status = this.provisionsearch.value.status.status
      } else {
        this.provisionsearch.value.status = this.provisionsearch.value.status
      }
    }
    if (this.provisionsearch.value.cc_id == null || this.provisionsearch.value.cc_id == '') {
      this.provisionsearch.value.cc_id = ''
    }
    else {
      let cc_id = this.provisionsearch.value.cc_id.id
      if (cc_id != undefined) {
        this.provisionsearch.value.cc_id = this.provisionsearch.value.cc_id.id
      } else {
        this.provisionsearch.value.cc_id = this.provisionsearch.value.cc_id.id
      }
    }

    if (this.provisionsearch.value.bs_id == null || this.provisionsearch.value.bs_id == '') {
      this.provisionsearch.value.bs_id = ''
    }
    else {
      let bs_id = this.provisionsearch.value.b_id.id
      if (bs_id != undefined) {
        this.provisionsearch.value.bs_id = this.provisionsearch.value.bs_id.id
      }
      else { this.provisionsearch.value.bs_id = this.provisionsearch.value.bs_id }
    }
    if (this.provisionsearch.value.dept_id == null || this.provisionsearch.value.dept_id == '') {
      this.provisionsearch.value.dept_id = ''
    } else {
      let dept_id = this.provisionsearch.value.dept_id.id
      if (dept_id != undefined) {
        this.provisionsearch.value.dept_id = this.provisionsearch.value.dept_id.id
      }
      else {
        this.provisionsearch.value.dept_id = this.provisionsearch.value.dept_id
      }
    }

    if (this.provisionsearch.value.type == null || this.provisionsearch.value.type == '') {
      this.provisionsearch.value.type = ''
    } else {

      let type = this.provisionsearch.value.type
      if (type != undefined) {
        this.provisionsearch.value.type = this.provisionsearch.value.type
      }
      else {
        this.provisionsearch.value.type = this.provisionsearch.value.type
      }
      // if(this.provisionsearch.value.type == 'PREPAID'){
      //   this.provisionsearch.value.type = 1

      // } else if(this.provisionsearch.value.type == 'UNPAID'){
      //   this.provisionsearch.value.type = 2}
    }


    if (this.provisionsearch.value.expense_date == null || this.provisionsearch.value.expense_date == '' || this.provisionsearch.value.expense_date.value == '') {
      this.provisionsearch.value.expense_date = ''
    } else {
      let exp = this.provisionsearch.value.expense_date
      if (exp != undefined) {
        this.provisionsearch.value.month = this.datepipe.transform(this.provisionsearch.value.expense_date, 'MM')

        this.provisionsearch.value.year = this.datepipe.transform(this.provisionsearch.value.expense_date, 'yyyy')
      }
      else {
        this.provisionsearch.value.expense_date = this.provisionsearch.value.expense_date
      }
    }
    this.search_data = this.provisionsearch.value;
    this.isChecked = false;
    this.SpinnerService.show();
    this.provision_search(this.search_data, page)
  }
  provision_search(search_data, page) {
    this.Service.provisionsearch(search_data, page)

      .subscribe((results: any[]) => {
        let statusdataCheckForValidation = this.provisionsearch.value.status
        if (statusdataCheckForValidation == 7 || statusdataCheckForValidation == 4 || statusdataCheckForValidation == 8 || statusdataCheckForValidation == 5) {
          this.ValidationDataBasedOnStatusSearch = true
        } else {
          this.ValidationDataBasedOnStatusSearch = false
        }
        this.provisiondata = results["data"];
        this.makerflag = results["flag"].is_maker;
        this.checkerflag = results["flag"].is_checker;
        this.approverflag = results["flag"].is_header;
        if (search_data.status == 1 || search_data.status == 7) {
          this.makerflag = true
          this.checkerflag = false
          this.approverflag = false
        } else {
          this.makerflag = false
        }
        if (this.provisiondata.length > 0) {
          this.has_next = results['pagination'].has_next;
          this.has_previous = results['pagination'].has_previous;
          this.presentpage = results['pagination'].index;
          this.getpform()
          this.length = (this.pform.get('users') as FormArray).controls.length
          // this.provisionsearch.reset();
          this.SpinnerService.hide();
        } else {
          this.provisiondata = [];
          // this.makerflag=true;
          this.pform = this.fb.group({
            users: new FormArray([])
          });
          this.length = 0
          this.search = false;
          this.SpinnerService.hide();
          // this.tab3=false;
        }

        if (this.search_data.status == 7 || this.search_data.status == 8 || this.search_data.status == 4) {
          this.hidden = true;
        }
        else {
          this.hidden = false;
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    this.get_count(search_data)

  }

  enable_gst(index, event) {
    if (event.target.checked) {
      var arrayControl = this.pform.get('users') as FormArray;
      arrayControl.at(index).get('gstflag').setValue(true);
    } else {
      var arrayControl = this.pform.get('users') as FormArray;
      arrayControl.at(index).get('gstflag').setValue(false);
    }
  }

  // 

  select_all(event, type) {
    this.moveto_checker = []
    if (event.checked) {
      if (this.search_data == undefined) {
        this.isChecked = false;
        this.notification.showWarning('Choose  Status filter then select the All recodrs!!')
      }
      if (this.search_data.status == 1 || this.search_data.status == 2 || this.search_data.status == 3) {
        this.isChecked = true;
        // this.hidden=false;
        this.Service.get_selectall_data(this.search_data.status)
          .then((results: any[]) => {
            if (results['array_id']) {
              this.moveto_checker = results['array_id']
            }
          })
      } else {
        this.notification.showWarning('Change the filter Status and select again!!')
        this.isChecked = false;
      }
      this.ForBulkUpdateSelect(event, type)
    }
    else {
      this.isChecked = false;
      this.moveto_checker = [];
      this.BulkUpdateDataList = []
      this.ExceptNoNUpdatedlist = []
      this.InvalidUpdateList = []
      this.DeleteArrList = []
    }
  }
  trackByCode(index: number, accountingType: any): string {
    return accountingType.id;
  }
  getvalue(index, d, event) {
    if (!('id' in d)) {
      this.pform.get('users')['controls'][index].get('checkboxs').setValue(false)
      this.isChecked = false;
      return false
    }

    if (event.checked) {
      if (d.provision_status == 'Draft') {
        this.moveto_checker.push({
          "id": d.id,
          "amount": d.amount,
          "gst_amount": d.gst_amount
        })
      }
      if (d.provision_status == 'Pending checker') {
        this.moveto_checker.push({
          "id": d.id,
          "amount": d.camount,
          "gst_amount": d.cgst_amount
        })
      }
      if (d.provision_status == 'Pending header') {
        this.moveto_checker.push({
          "id": d.id,
          "amount": d.ap_amount,
          "gst_amount": d.apgst_amount
        })
      }
    } else {
      let indexfind = this.moveto_checker.findIndex(x => x.id == d.id)
      if (d.provision_status == 'Draft') {
        this.moveto_checker.splice(indexfind, 1);
      }
      if (d.provision_status == 'Pending checker') {
        this.moveto_checker.splice(indexfind, 1);
      }
      if (d.provision_status == 'Pending header') {
        this.moveto_checker.splice(indexfind, 1);
      }
    }
  }
  ignore(check, index, d) {
    var k = d.id
    if (check) {
      this.prv_checker.push(d)
      this.previousp.push(k)
    } else {
      this.previousp.splice(this.previousp.indexOf(k), 1);
      this.prv_checker.splice(this.prv_checker.indexOf(d), 1);
    }
  }
  previous_Pvmove() {
    this.SpinnerService.show()
    this.pdata = {
      "provision_id": this.prv_checker,
      "status": 2,
      "remarks": "ok"
    }
    this.Service.provision_status(this.pdata)
      .subscribe(result => {
        if (result.status == 'success') {
          this.isChecked = false;
          this.notification.showSuccess("SUCCESS!...")
          this.previos(1);
          this.prv_checker = [];
          this.previousp = [];
          this.SpinnerService.hide()
        } else {
          if (result['description']) {
            this.notification.showWarning(result['description'])
          } else {
            this.notification.showWarning('Unauthorized Request')
          }
          this.SpinnerService.hide()
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }

  checker(se) {
    // this.SpinnerService.show()
    let role = ''
    this.pdata = []
    this.provisiondata = this.pform.value.users
    if (this.provisiondata.length == 0) {
      this.notification.showWarning('Choose Any provision !!')
      this.SpinnerService.hide()
      return false
    }
    if (this.moveto_checker.length == 0) {
      this.notification.showWarning('Choose Any provision !!')
      this.SpinnerService.hide()
      return false
    }
    if (this.provisiondata[0].provision_status?.status == 'Draft') {
      this.pdata = {
        "provision_id": this.moveto_checker,
        "status": 2,
        "remarks": "ok"
      }
    }
    if (this.provisiondata[0].provision_status?.status == 'Pending checker') {
      let status: any;
      if (se == 2) {
        status = 0
      } else {
        status = 3
      }
      this.pdata = {
        "provision_id": this.moveto_checker,
        "status": status,
        "remarks": "ok"
      }
    }
    if (this.provisiondata[0].provision_status?.status == 'Pending header') {
      let status: any;
      if (se == 2) {
        status = 0
      } else {
        status = 5
      }
      this.pdata = {
        "provision_id": this.moveto_checker,
        "status": status,
        "remarks": "ok"
      }
    }
    //////////////////////////
    if (this.provisiondata[0].provision_status == 'Draft') {

      this.pdata = {
        "provision_id": this.moveto_checker,
        "status": 2,
        "remarks": "ok"
      }
    }
    if (this.provisiondata[0].provision_status == 'Pending checker') {
      let status: any;
      if (se == 2) {
        status = 0
      } else {
        status = 3
      }
      this.pdata = {
        "provision_id": this.moveto_checker,
        "status": status,
        "remarks": "ok"
      }
    }
    if (this.provisiondata[0].provision_status == 'Pending header') {
      let status: any;
      if (se == 2) {
        status = 0
      } else {
        status = 5
      }
      this.pdata = {
        "provision_id": this.moveto_checker,
        "status": status,
        "remarks": "ok"
      }
    }
    this.Service.provision_status(this.pdata)
      .subscribe(result => {
        if (result.status == 'success') {
          this.isChecked = false;
          this.notification.showSuccess("SUCCESS!...")
          this.selected = "1"
          this.isChecked = false;
          if (this.search_data != undefined) {
            this.provision_search(this.search_data, 1)
          }
          else {
            this.provisionsummary(1, 10);
            this.get_count(this.provisionsearch.value)
          }
          this.moveto_checker = []
          this.SpinnerService.hide()
        } else {
          if (result['description']) {
            this.notification.showWarning(result['description'])
          } else {
            this.notification.showWarning('Unauthorized Request')
          }
          this.SpinnerService.hide()
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  approve_emc() {
    this.SpinnerService.show();
    this.Service.provision_status({
      "provision_id": this.prv_checker,
      "status": 3,
      "remarks": "ok"
    })
      .subscribe(result => {
        if (result.status == 'success') {
          this.isChecked = false;
          this.notification.showSuccess("SUCCESS!...")
          this.prv_checker = []
          this.SpinnerService.hide()
        } else {
          if (result['description']) {
            this.notification.showWarning(result['description'])
          } else {
            this.notification.showWarning('Unauthorized Request')
          }
          this.SpinnerService.hide()
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  ignoremaker(status) {
    this.SpinnerService.show()
    this.Service.ignorebymaker_({
      "id": this.previousp
    }, status)
      .subscribe(result => {
        if (result.status == 'success') {
          this.isChecked = false;
          this.notification.showSuccess("SUCCESS!...")
          this.previos(1);
          this.moveto_checker = []
          this.previousp = []
          this.prv_checker = []
          this.SpinnerService.hide()
        } else {
          if (result['description']) {
            this.notification.showWarning(result['description'])
          } else {
            this.notification.showWarning('Unauthorized Request')
          }
          this.SpinnerService.hide()
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  provisionget(data) {
    if (data == 'add') {
      this.share.provisiondata.next('')
    } else {
      this.share.provisiondata.next(data)
    }
    this.router.navigate(['/provisionmaker'], {
      skipLocationChange: true
    })
  }
  async provisionsummary(p, s) {
    this.SpinnerService.show();
    this.Service.provisionsummaryfilter(p, s, 1)
      .subscribe((results: any[]) => {
        this.provisiondata = results["data"];
        this.makerflag = results["flag"].is_maker;
        this.checkerflag = results["flag"].is_checker;
        this.approverflag = results["flag"].is_header;
        if (this.makerflag && this.checkerflag) {
          this.checkerflag = false
          this.makerflag = false
        }

        if (this.provisiondata.length > 0) {
          this.has_next = results['pagination'].has_next;
          this.has_previous = results['pagination'].has_previous;
          this.presentpage = results['pagination'].index;
          this.getpform()
        } else {
          this.provisiondata = [];
          this.pform = this.fb.group({
            users: new FormArray([])
          });
        }
        this.SpinnerService.hide();
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }
  nextClick() {
    if (this.has_next === true) {
      if (this.searchid) {
        this.presentpage = this.presentpage + 1
        this.provisiongetsummaryp(this.presentpage, 10, this.searchid)
      }
      if (this.search) {
        this.pagination_search(this.search_data, this.presentpage + 1)
      }
      else {
        this.provisionsummary(this.presentpage + 1, 10)
      }
    }
  }

  pagination_search(searchinfo, page) {
    this.Service.provisionsearch(searchinfo, page)
      .subscribe((results: any[]) => {
        this.provisiondata = results["data"];
        this.makerflag = results["flag"].is_maker;
        this.checkerflag = results["flag"].is_checker;
        this.approverflag = results["flag"].is_header;
        if (searchinfo.status == 1 || searchinfo.status == 7) {
          this.makerflag = true
          this.checkerflag = false
          this.approverflag = false
        } else {
          this.makerflag = false
        }
        if (this.provisiondata.length > 0) {
          this.has_next = results['pagination'].has_next;
          this.has_previous = results['pagination'].has_previous;
          this.presentpage = results['pagination'].index;
          this.getpform()
          this.length = (this.pform.get('users') as FormArray).controls.length
        } else {
          this.provisiondata = [];
          this.pform = this.fb.group({
            users: new FormArray([])
          });
          this.length = 0
        }
      })
  }
  previousClick() {
    if (this.has_previous === true) {
      if (this.searchid) {
        this.provisiongetsummaryp(this.presentpage - 1, 10, this.searchid)
      }
      if (this.search) {
        this.pagination_search(this.search_data, this.presentpage - 1)
      }
      else {
        this.provisionsummary(this.presentpage - 1, 10)
      }
    }
  }
  tab2previous() {
    if (this.has_previous_month === true) {
      this.previos(this.presentpages_month - 1)
    }
  }
  tab2nextClick() {
    if (this.has_next_month === true) {
      this.previos(this.presentpages_month + 1)
    }

  }

  tab3previous() {
    if (this.has_previouss === true) {
      if (this.tab3) {
        this.systemdatasearch(this.presentpage2 - 1)
      }
      else {
        this.internalapi(this.presentpage2 - 1, 10, 1)
      }
    }
  }
  tab3nextClick() {
    if (this.has_nexts === true) {
      if (this.tab3) {
        this.systemdatasearch(this.presentpage2 + 1)
      }
      else {
        this.internalapi(this.presentpage2 + 1, 10, 1)
      }
    }
  }

  public provisiongetsummaryp(p, s, id) {
    this.SpinnerService.show();
    this.moveto_checker = []
    this.Service.provisionsummaryfilter(p, s, id)
      .subscribe((results: any[]) => {
        this.provisiondata = results["data"];
        if (this.provisiondata.length > 0) {
          this.has_next = results['pagination'].has_next;
          this.has_previous = results['pagination'].has_previous;
          this.presentpage = results['pagination'].index;
          this.getpform()
          this.SpinnerService.hide();
        } else {
          this.provisiondata = [];
          this.pform = this.fb.group({
            users: new FormArray([])
          });
          this.SpinnerService.hide();
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
  }
  provisionchange(e) {
    this.moveto_checker = [];
    this.prv_checker = [];
    this.provisionsearch.reset();
    this.provisiongetsummaryp(1, 10, 1)
  }

  checkerapprover() {
    this.SpinnerService.show();
    this.Service.movetoapprover_provision(this.approvaldata, this.approvaldata[0].flag)
      .subscribe(result => {
        if (result.status == 'success') {
          this.isChecked = false;
          this.notification.showSuccess("SUCCESS!...")
          this.provisionsummary(1, 10);
          this.get_count(this.provisionsearch.value)
          this.SpinnerService.hide();
          this.approvaldata = []
          this.router.navigate(['/provision'], {
            skipLocationChange: true
          })
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  approverdata() {
    if (this.approval.value.flag == 'Approved_By_Approver') {
      this.approvaldata.push({
        "id": this.approval.value.id,
        "amount_approver": this.approval.value.amount_approver,
        "gst_amount_approver": this.approval.value.gst_amount_approver,
        "description": this.approval.value.description,
        "flag": 'Approved_By_Approver'
      })
    } else {
      this.approvaldata.push(this.approval.value)
    }
    this.approval.reset();
  }

  provisionstatus(status) {
    this.p_mainStatus = status;
  }

  // bs

  bsget(index) {
    let bs: String = "";
    this.bsdatafun(bs);
    var arrayControl = this.pform.get('users') as FormArray;
    this.bsdata[index] = arrayControl.at(index).get('bs_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.Service.getbsvalue(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        this.bsdata = results["data"];
      })
  }

  bsdatafun(val) {
    this.Service.getbsvalue(val).subscribe((results: any[]) => {
      this.bsdata = results["data"];
    })

  }
  public displayFnbs(_bsval?: BS): string | undefined {
    return _bsval ? _bsval.name : undefined;
  }

  get _bsval() {
    return this.provisionsearch.value.get('bs_id');
  }

  bsid_cc(id, index) {
    this.provisionsearch.get('cc_id').setValue('');
    var arrayControl = this.pform.get('users') as FormArray;
    this.bsdata[index] = arrayControl.at(index).get('cc_id').setValue('')
    this.bsid = arrayControl[index].bs_id?.id;
  }

  bsid_cc_(id) {
    this.bsid = id;
    this.provisionsearch.get('cc_id').setValue('');
  }
  // bsend
  // cc
  ccget(index) {
    let cc: String = "";
    var arrayControl = this.pform.get('users') as FormArray;
    this.bsid = arrayControl.value[index].bs_id.id
    this.ccdatafun(this.bsid, cc);
    this.ccdata[index] = arrayControl.at(index).get('cc_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.Service.getcclistDependentBs(this.bsid, value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        this.ccdata = results["data"];
      })
  }
  ccdatafun(id, val) {
    this.Service.getcclistDependentBs(id, val).subscribe((results: any[]) => {
      this.ccdata = results["data"];
    })

  }
  public displayFncc(_ccval?: CC): string | undefined {
    return _ccval ? _ccval.name : undefined;
  }

  get _ccval() {
    return this.provisionsearch.value.get('cc_id');
  }

  // ccend


  // dep

  deparment_get(index) {
    this.dep_data = [];
    let bs: String = "";
    this.dep_get(bs)
    var arrayControl = this.pform.get('users') as FormArray;
    this.dep_data[index] = arrayControl.at(index).get('dept_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.Service.department(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        this.dep_data = results["data"];
      })
  }

  dep_get(val) {
    this.Service.department(val).subscribe((results: any[]) => {
      this.dep_data = results["data"];
    })
  }

  provisionfilterget() {
    this.Service.provisionfilterget().subscribe((results: any[]) => {
      this.filterdata = results["data"];
    })

  }
  public displayFdep(_dep?: DEPARTMENT): string | undefined {
    return _dep ? _dep.name : undefined;
  }

  get _dep() {
    return this.pform.value.get('dept_id');
  }

  // dep-chend
  //gl Start
  glid_get(glno, index) {
    var arrayControl = this.pform.get('users') as FormArray;
    arrayControl.at(index).get('category_id').setValue('');
    arrayControl.at(index).get('subcategory_id').setValue('');
  }
  gldata(val) {
    this.Service.getGLData(val).subscribe((results: any[]) => {
      this.maingldata = results["data"];
    })


  }
  public displayFn_GL(_maingl?: maingl): string | undefined {
    return _maingl ? _maingl.glno : undefined;
  }

  get _maingl() {
    return this.pform.value.get('sgl_no');
  }
  //gl ENd

  // cat start
  CategoryClick(index) {
    let catkeyvalue: String = "";
    var arrayControl = this.pform.get('users') as FormArray;
    if (arrayControl.value[index].sgl_no.glno === undefined) {
      arrayControl.at(index).get('subcategory_id').setValue('');
      return false
    }
    this.catdata(index, catkeyvalue);
    this.maincatdata[index] = arrayControl.at(index).get('category_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.Service.getcategorydataFromGL(value, arrayControl.value[index].sgl_no)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        this.maincatdata = results["data"];
      })
  }

  catdata(index, val) {
    var arrayControl = this.pform.get('users') as FormArray;
    if (arrayControl.value[index].sgl_no?.glno) {
      this.Service.getcategorydataFromGL(val, arrayControl.value[index].sgl_no).subscribe((results: any[]) => {
        this.maincatdata = results["data"];
      })
    }
  }
  public displayFncat(_maincat?: maincat): string | undefined {
    return _maincat ? _maincat.code : undefined;
  }

  get _maincat() {
    return this.pform.value.get('category_id');
  }

  catid_get(id, index) {
    // this.catid=id;
    var arrayControl = this.pform.get('users') as FormArray;
    arrayControl.at(index).get('subcategory_id').setValue('');

  }
  // cat end

  // subcat


  subCategoryClick(index) {
    let keyvalue: String = "";
    var catid = '';
    var glno = ""
    var arrayControl = this.pform.get('users') as FormArray;
    glno = arrayControl.value[index].sgl_no.glno
    catid = arrayControl.value[index].category_id.id
    if (arrayControl.value[index].sgl_no.glno === undefined || arrayControl.value[index].category_id.id === undefined) {
      // arrayControl.at(index).get('subcategory_id').setValue('');
      return false
    }
    this.subcat(index, keyvalue);
    this.subcatdata[index] = arrayControl.at(index).get('subcategory_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.Service.getSubcategorydataFromGL(arrayControl.value[index].sgl_no, arrayControl.value[index].category_id, value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        this.subcatdata = results["data"];
      })
  }
  subcat(index, val) {
    var arrayControl = this.pform.get('users') as FormArray;
    if (arrayControl.value[index].sgl_no?.glno && arrayControl.value[index].category_id?.id) {
      this.Service.getSubcategorydataFromGL(arrayControl.value[index].sgl_no, arrayControl.value[index].category_id, val).subscribe((results: any[]) => {
        this.subcatdata = results["data"];
      })
    }
  }
  public displayFnsub(_subcat?: subcat): string | undefined {
    return _subcat ? _subcat.code : undefined;
  }

  get _subcat() {
    return this.pform.value.get('subcategory_id');
  }

  // subcatends

  // Vendor
  vendorget(index) {
    this.vendordata = [];
    let query: String = "";
    this.vendor_data(query);
    var arrayControl = this.pform.get('users') as FormArray;

    this.vendordata[index] = arrayControl.at(index).get('vendor_id').valueChanges

      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.Service.vendorbranch(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )

      .subscribe((results: any[]) => {
        this.vendordata = results["data"];

      })
  }
  vendor_data(val) {
    this.Service.vendorbranch(val).subscribe((results: any[]) => {
      this.vendordata = results["data"];

    })

  }
  public displayFnvendor(_vendor?: vendor): string | undefined {
    return _vendor ? _vendor.name : undefined;
  }

  get(_vendor) {
    return this.pform.value.get('vendor_id');
  }

  // vendor end

  // glget(data, index) {
  //   var arrayControl = this.pform.get('users') as FormArray;

  // }

  addRow() {
    const control = this.pform.get('users') as FormArray;
    control.push(this.initiatForm());
  }

  deleteRow(index: number, value) {
    let dataconfirm = confirm("Are you sure! do you want to continue?")
    if (dataconfirm) {

      if (value.id) {
        let dataToDelete = { "id": [value.id] }
        this.Service.delete_provision(dataToDelete).subscribe((results: any[]) => {
          // this.vendordata = results["data"];
          if (results['status'] == "success") {
            this.notification.showSuccess("success")
            this.provision_search(this.search_data, 1)
            this.BulkUpdateDataList = []
            this.ExceptNoNUpdatedlist = []
            this.InvalidUpdateList = []
            this.DeleteArrList = []
            this.isChecked = false
          }

        })
      } else {
        const control = this.pform.get('users') as FormArray;
        control.removeAt(index);
      }

    }

  }




  isDirty(index: number, type): boolean {
    const data = this.pform.get('users') as FormArray;
    if (type == 'submit') {
      return false
    }
    else {
      if (data.controls[index].status == 'INVALID' && data.controls[index].dirty == false) {
        return false
      }
      else if (data.controls[index].status == 'INVALID' && data.controls[index].dirty == true) {
        return false
      }
      else if (data.controls[index].status == 'VALID' && data.controls[index].dirty == false) {
        return false
      }
      else if (data.controls[index].status == 'VALID' && data.controls[index].dirty == true) {
        return true
      }
    }

  }

  isDirtyCheckbox(index: number): boolean {
    const data = this.pform.get('users') as FormArray;
    let fg = data.controls
    let fgindex = data.controls[index]
    if (fgindex.status == 'INVALID') {
      return false
    }
    else if (fgindex.status == 'VALID') {
      return true
    }
  }

  editRow() {
    return (this.pform.get('users') as FormArray).controls.length
  }

  doneRow(index, group) {
    this.pform.get('users')['controls'][index].markAsPristine()
    var arrayControl = this.pform.get('users') as FormArray;
    arrayControl.at(index).get('isEditable').setValue(false);
    let typedata = group.value.type
    let typevalue
    if (typedata == 'PREPAID') {
      typevalue = 1
    } else if (typedata == 'UNPAID') {
      typevalue = 2
    }

    group.value.cc_id = group.value.cc_id.id
    group.value.dept_id = group.value.dept_id.id
    group.value.bs_id = group.value.bs_id.id
    if (group.value.vendor_id == null) {
      group.value.vendor_id = group.value.vendor_id
    }
    else {
      group.value.vendor_id = group.value.vendor_id.id
    }
    group.value.subcategory_id = group.value.subcategory_id.id
    group.value.gl_id = group.value.sgl_no.glno
    group.value.glname = group.value.sgl_no.gl_name
    group.value.category_id = group.value.category_id.id
    group.value.type = typevalue
    group.value.expense_date = this.datepipe.transform(group.value.expense_date, 'yyyy-MM-dd')
    let datasetpatch = Object.assign({}, group.value, { ref_key: index })
    this.SpinnerService.show()
    this.Service.provision([datasetpatch])
      .subscribe(result => {
        this.SpinnerService.hide()
        if (result.status == "success") {
          this.PatchFormDataOnParticularDataLine(result)
          this.notification.showSuccess("Saved Successfully!...")
          var arrayControl = this.pform.get('users') as FormArray;
          arrayControl.at(index).markAsPristine();
          this.SpinnerService.hide();
        } else {
          if (result['description']) {
            this.notification.showWarning(result['description'])
          } else {
            this.notification.showWarning('Unauthorized Request')
          }
          this.SpinnerService.hide();
        }
        this.SpinnerService.hide();
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

    const control = this.pform.get('users') as FormArray;

  }

  get getFormControls() {
    const control = this.pform.get('users') as FormArray;
    return control;
  }

  submitForm() {
    const control = this.pform.get('users') as FormArray;
    this.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
  }

  toggleTheme() {
    this.mode = !this.mode;
  }

  deparment_() {
    let bs: String = "";
    this.dep_get(bs)
    this.provisionsearch.get('dept_id').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.Service.department(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
      .subscribe((results: any[]) => {
        this.dep_data = results["data"];

      })

  }
  // cc
  ccget_() {
    let cc: String = "";
    this.ccdatafun(this.bsid, cc);
    this.provisionsearch.get('cc_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.Service.getcclistDependentBs(this.bsid, value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        this.ccdata = results["data"];
      })
  }
  // bs

  bsget_() {
    let bs: String = "";
    this.bsdatafun(bs);
    this.provisionsearch.get('bs_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.Service.getbsvalue(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        this.bsdata = results["data"];
      })
  }
  public internalapi(p, s, id) {
    this.SpinnerService.show();
    this.Service.systemcall(p, s, id)
      .subscribe((results: any[]) => {
        this.systemdata = results["data"];
        if (this.systemdata.length > 0) {
          this.has_nexts = results['pagination'].has_next;
          this.has_previouss = results['pagination'].has_previous;
          this.presentpage2 = results['pagination'].index;
          this.SpinnerService.hide();
        } else {
          this.systemdata = [];
          this.SpinnerService.hide();
        }
        this.SpinnerService.hide();
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  systemdatasearch(page) {
    this.SpinnerService.show();
    this.tab3 = true;
    if (this.provisionsearch.value.cc_id == null || this.provisionsearch.value.cc_id == '') {
      this.provisionsearch.value.cc_id = ''
    }
    else {
      this.provisionsearch.value.cc_id = this.provisionsearch.value.cc_id.id
    }

    if (this.provisionsearch.value.bs_id == null || this.provisionsearch.value.bs_id == '') {
      this.provisionsearch.value.bs_id = ''
    }
    else {
      this.provisionsearch.value.bs_id = this.provisionsearch.value.bs_id.id
    }
    if (this.provisionsearch.value.dept_id == null || this.provisionsearch.value.dept_id == '') {
      this.provisionsearch.value.dept_id = ''
    } else {
      this.provisionsearch.value.dept_id = this.provisionsearch.value.dept_id.id
    }
    if (this.provisionsearch.value.expense_date == null || this.provisionsearch.value.expense_date == '' || this.provisionsearch.value.expense_date.value == 1) {
      this.provisionsearch.value.expense_date = ''
    } else {
      this.provisionsearch.value.month = this.datepipe.transform(this.provisionsearch.value.expense_date, 'MM')
      this.provisionsearch.value.year = this.datepipe.transform(this.provisionsearch.value.expense_date, 'yyyy')
    }
    let search = this.provisionsearch.value
    let obj: any = {
      bs_id: search?.bs_id,
      cc_id: search?.cc_id,
      module_id: search?.module_id,
      month: search?.month,
      year: search?.year
    }
    for (let i in obj) {
      if (obj[i] == '' || obj[i] == null || obj[i] == undefined) {
        obj[i] = ''
      }
    }
    this.Service.provisionsearchsystemdata(obj, page)
      .subscribe((results: any[]) => {
        this.systemdata = results["data"];
        if (this.systemdata.length > 0) {
          this.has_nexts = results['pagination'].has_next;
          this.has_previouss = results['pagination'].has_previous;
          this.presentpage2 = results['pagination'].index;
          this.getpform()
          this.SpinnerService.hide();
        } else {
          this.provisiondata = [];
          this.pform = this.fb.group({
            users: new FormArray([])
          });
          this.tab3 = false;
          this.SpinnerService.hide();
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    this.SpinnerService.hide();
  }

  module() {
    let bs: String = "";
    this.modulefn(bs);
    this.provisionsearch.get('module_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.Service.moduleget(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        this.moduledata = results["data"];
      })
  }

  modulefn(val) {
    this.Service.moduleget(val).subscribe((results: any[]) => {
      this.moduledata = results["data"];
    })

  }
  public displayFnmodule(_module?: Module): string | undefined {
    return _module ? _module.text : undefined;
  }

  get _module() {
    return this.provisionsearch.value.get('module_id');
  }
  Provisionreport() {
    this.SpinnerService.show();
    if (this.provisionsearch.value.module_id == null || this.provisionsearch.value.module_id == '') {
      this.provisionsearch.value.module_id = ''
    }
    else {
      let module_id = (this.provisionsearch.value.module_id.module_id)
      if (module_id != undefined) {
        this.provisionsearch.value.module_id = module_id.module_id
      } else {
        this.provisionsearch.value.module_id = this.provisionsearch.value.module_id;
      }
    }
    if (this.provisionsearch.value.status == null || this.provisionsearch.value.status == '') {
      this.provisionsearch.value.status = ''
    }
    else {
      let status = (this.provisionsearch.value.status.status)
      if (status != undefined) {
        this.provisionsearch.value.status = this.provisionsearch.value.status.status
      } else {
        this.provisionsearch.value.status = this.provisionsearch.value.status
      }
    }
    if (this.provisionsearch.value.cc_id == null || this.provisionsearch.value.cc_id == '') {
      this.provisionsearch.value.cc_id = ''
    }
    else {
      let cc_id = this.provisionsearch.value.cc_id.id
      if (cc_id != undefined) {
        this.provisionsearch.value.cc_id = this.provisionsearch.value.cc_id.id
      } else {
        this.provisionsearch.value.cc_id = this.provisionsearch.value.cc_id.id
      }
    }

    if (this.provisionsearch.value.bs_id == null || this.provisionsearch.value.bs_id == '') {
      this.provisionsearch.value.bs_id = ''
    }
    else {
      let bs_id = this.provisionsearch.value.b_id.id
      if (bs_id != undefined) {
        this.provisionsearch.value.bs_id = this.provisionsearch.value.bs_id.id
      }
      else { this.provisionsearch.value.bs_id = this.provisionsearch.value.bs_id }
    }
    if (this.provisionsearch.value.dept_id == null || this.provisionsearch.value.dept_id == '') {
      this.provisionsearch.value.dept_id = ''
    } else {
      let dept_id = this.provisionsearch.value.dept_id.id
      if (dept_id != undefined) {
        this.provisionsearch.value.dept_id = this.provisionsearch.value.dept_id.id
      }
      else {
        this.provisionsearch.value.dept_id = this.provisionsearch.value.dept_id
      }
    }

    if (this.provisionsearch.value.type == null || this.provisionsearch.value.type == '') {
      this.provisionsearch.value.type = ''
    } else {

      let type = this.provisionsearch.value.type
      if (type != undefined) {
        this.provisionsearch.value.type = this.provisionsearch.value.type
      }
      else {
        this.provisionsearch.value.type = this.provisionsearch.value.type
      }
    }

    if (this.provisionsearch.value.expense_date == null || this.provisionsearch.value.expense_date == '' || this.provisionsearch.value.expense_date.value == '') {
      this.provisionsearch.value.expense_date = ''
    } else {
      let exp = this.provisionsearch.value.expense_date
      if (exp != undefined) {
        this.provisionsearch.value.month = this.datepipe.transform(this.provisionsearch.value.expense_date, 'MM')

        this.provisionsearch.value.year = this.datepipe.transform(this.provisionsearch.value.expense_date, 'yyyy')
      }
      else {
        this.provisionsearch.value.expense_date = this.provisionsearch.value.expense_date
      }
    }
    this.Service.report(this.provisionsearch.value)
      .subscribe(data => {
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'ProvisionReport' + date + ".xlsx";
        link.click();
        this.SpinnerService.hide();
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  fileupload(files) {
    if (files && files.length) {
      this.file = files[0].name;
    }
    this.file_upload = files[0]
  }

  bulkdataupload() {
    this.SpinnerService.show();
    if (this.file_upload) {
      this.Service.fileupload(this.file_upload)
        .subscribe((results) => {
          if (results.status == 'success') {
            this.notification.showSuccess(results.message)
            this.provisionsummary(1, 10);
            this.file = '';
            this.SpinnerService.hide();
          } else {
            this.SpinnerService.hide();
            if (results['description']) {
              this.notification.showWarning(results['description'])
            } else {
              this.notification.showWarning('Unauthorized Request')
            }
            this.file = '';
          }
        },
          error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          })
    }
    else {
      this.SpinnerService.hide();
      this.notification.showWarning('Please Choose a File !!')
    }
  }
  getexceldownload() {
    this.Service.exceldownload()
      .subscribe((results) => {
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'Provision Excel' + ".xlsx";
        link.click();
      })
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>, index) {
    var arrayControl = this.pform.get('users') as FormArray;
    const ctrlValue = normalizedMonthAndYear
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    datepicker.close();
    arrayControl.at(index).get('expense_date').setValue(ctrlValue);
    this.fromDateSelection(index);
  }
  setMonthAndYearsearch(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = normalizedMonthAndYear
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    datepicker.close();
    this.provisionsearch.patchValue({
      expense_date: ctrlValue
    })
  }
  fromDateSelection(i) {
    var arrayControl = this.pform.get('users') as FormArray;
    arrayControl.at(i).markAsDirty();
  }
  refresh() {
    this.provisionsearch.reset();
    this.file = ''
    this.presentpage = 1;
  }

  BulkUpdateDataList: any = []
  ExceptNoNUpdatedlist: any = []
  InvalidUpdateList: any = []
  DeleteArrList: any = []
  typeselect = new FormControl(false)

  ForBulkUpdateSelect(event, type) {
    this.BulkUpdateDataList = []
    this.ExceptNoNUpdatedlist = []
    this.InvalidUpdateList = []
    this.DeleteArrList = []
    let dataToSelectForBulk = this.pform.value.users
    let lengthOfFormSize = dataToSelectForBulk?.length
    if (lengthOfFormSize == 0) {
      return false
    }
    let validateAndSeperate = this.pform.get('users') as FormArray;
    let controlsOnForm = validateAndSeperate.controls
    for (let data in controlsOnForm) {
      if (controlsOnForm?.length > 0) {
        if (controlsOnForm[data].status == 'INVALID') {
          this.InvalidUpdateList.push(controlsOnForm[data].value)
        }
        if (controlsOnForm[data].status == 'VALID' && controlsOnForm[data].touched == true) {
          let dataSetToPush = controlsOnForm[data].value
          let typedata = dataSetToPush.type
          let typevalue
          if (typedata == 'PREPAID') {
            typevalue = 1
          } else if (typedata == 'UNPAID') {
            typevalue = 2
          }
          let obj = {
            "cr_number": dataSetToPush.cr_number,
            "gstflag": dataSetToPush.gstflag,
            "provision_status": dataSetToPush.provision_status,
            "category_id": dataSetToPush.category_id?.id,
            "subcategory_id": dataSetToPush.subcategory_id?.id,
            "sgl_no": dataSetToPush.sgl_no?.glno,
            "gl_id": dataSetToPush.sgl_no?.glno,
            "glname": dataSetToPush.sgl_no?.gl_name,
            "dept_id": dataSetToPush.dept_id?.id,
            "narration": dataSetToPush.narration,
            "vendor_id": dataSetToPush.id || null,
            "expense_date": this.datepipe.transform(dataSetToPush.expense_date, 'yyyy-MM-dd'),
            "amount": dataSetToPush.amount,
            "gst_amount": dataSetToPush.gst_amount,
            "cc_id": dataSetToPush.cc_id?.id,
            "bs_id": dataSetToPush.bs_id?.id,
            "provisionflag": dataSetToPush.provisionflag,
            "invoice_date": dataSetToPush.invoice_date,
            "camount": dataSetToPush.camount,
            "cgst_amount": dataSetToPush.cgst_amount,
            "ap_amount": dataSetToPush.ap_amount,
            "selectAll": dataSetToPush.selectAll,
            "apgst_amount": dataSetToPush.apgst_amount,
            "changed_amount": dataSetToPush.changed_amount,
            "code": dataSetToPush.code,
            "type": typevalue,
            "invoice_no": dataSetToPush.invoice_no,
            "isEditable": dataSetToPush.isEditable,
            "disable": dataSetToPush.disable,
            "checkboxs": dataSetToPush.checkboxs,
            "dirtyDetect": dataSetToPush.dirtyDetect,
            "indexkey": dataSetToPush.indexkey,
            "id": dataSetToPush.id
          }
          this.BulkUpdateDataList.push(obj)
        }
        if (controlsOnForm[data].status == 'VALID' && controlsOnForm[data].touched == false) {
          this.ExceptNoNUpdatedlist.push(controlsOnForm[data].value)
        }
      }

      if (controlsOnForm?.length > 0) {
        this.DeleteArrList.push(controlsOnForm[data].value.id)
      }
    }
  }


  checkCheckBoxIsSelectedOrNot(index, group) {
    if (group.checkboxs == true) {
      let findindexOfData = group?.id
      let findindOfID = this.BulkUpdateDataList.findIndex(x => x.id == findindexOfData)
      this.BulkUpdateDataList.splice(findindOfID, 1)
      return false
    }
  }
  PatchFormDataOnParticularDataLine(data) {
    let dataPatchOnPArticularLine = data["arr"]
    for (let datalist of dataPatchOnPArticularLine) {
      this.pform.get('users')['controls'][datalist.ref_key].addControl('id', new FormControl(datalist.id));
      this.pform.get('users')['controls'][datalist.ref_key].get('code').setValue(datalist.code)
      this.pform.get('users')['controls'][datalist.ref_key].get('checkboxs').setValue(false)
    }
  }

  BulkAddOrUpdate() {
    let dataToUpdate = this.BulkUpdateDataList
    if (dataToUpdate?.length == 0) {
      this.notification.showWarning("Not selected or No changes Occur ")
      return false
    }
    if (this.InvalidUpdateList?.length > 0) {
      let dataconfirm = confirm("Some Data are not filled It will refresh if continue. Do you want to continue? ")
      if (dataconfirm) {
        this.Service.provisionBulkUpdate(dataToUpdate)
          .subscribe(result => {
            if (result.status == "success") {
              this.BulkUpdateDataList = []
              this.notification.showSuccess("Success")
              this.ExceptNoNUpdatedlist = []
              this.InvalidUpdateList = []
              this.DeleteArrList = []
              this.provision_search(this.search_data, 1)
              this.isChecked = false
            }
          }
          )
      }
      else {
        this.notification.showInfo("Interrupted by User")
      }

    }
    else {
      let dataForBulkIndividal = dataToUpdate
      let dataconfirm = confirm("Are you sure! Do you want to continue? ")
      if (dataconfirm) {
        this.Service.provisionBulkUpdate(dataForBulkIndividal)
          .subscribe(result => {
            if (result.status == "success") {
              this.BulkUpdateDataList = []
              this.notification.showSuccess("Success")
              this.ExceptNoNUpdatedlist = []
              this.InvalidUpdateList = []
              this.DeleteArrList = []
              let resdata = result
              this.isChecked = false
              this.provision_search(this.search_data, 1)
            }
          }
          )
      }
    }
  }

  PushOrRemoveForBulkSubmit(index, data, event) {
    let dataForm = this.pform.value.users
    if (event.checked) {
      let dataIndex = dataForm.map(x => x.indexkey)
      let validateAndSeperate = this.pform.get('users') as FormArray;
      let controlsOnForm = validateAndSeperate.controls
      let dataSetToPush = controlsOnForm[index].value
      let typedata = dataSetToPush.type
      let typevalue
      if (typedata == 'PREPAID') {
        typevalue = 1
      } else if (typedata == 'UNPAID') {
        typevalue = 2
      }
      let obj = {
        "cr_number": dataSetToPush.cr_number,
        "gstflag": dataSetToPush.gstflag,
        "provision_status": dataSetToPush.provision_status,
        "category_id": dataSetToPush.category_id?.id,
        "subcategory_id": dataSetToPush.subcategory_id?.id,
        "sgl_no": dataSetToPush.sgl_no?.glno,
        "gl_id": dataSetToPush.sgl_no?.glno,
        "glname": dataSetToPush.sgl_no?.gl_name,
        "dept_id": dataSetToPush.dept_id?.id,
        "narration": dataSetToPush.narration,
        "vendor_id": dataSetToPush.id || null,
        "expense_date": this.datepipe.transform(dataSetToPush.expense_date, 'yyyy-MM-dd'),
        "amount": dataSetToPush.amount,
        "gst_amount": dataSetToPush.gst_amount,
        "cc_id": dataSetToPush.cc_id?.id,
        "bs_id": dataSetToPush.bs_id?.id,
        "provisionflag": dataSetToPush.provisionflag,
        "invoice_date": dataSetToPush.invoice_date,
        "camount": dataSetToPush.camount,
        "cgst_amount": dataSetToPush.cgst_amount,
        "ap_amount": dataSetToPush.ap_amount,
        "selectAll": dataSetToPush.selectAll,
        "apgst_amount": dataSetToPush.apgst_amount,
        "changed_amount": dataSetToPush.changed_amount,
        "code": dataSetToPush.code,
        "type": typevalue,
        "invoice_no": dataSetToPush.invoice_no,
        "isEditable": dataSetToPush.isEditable,
        "disable": dataSetToPush.disable,
        "checkboxs": dataSetToPush.checkboxs,
        "dirtyDetect": dataSetToPush.dirtyDetect,
        "indexkey": dataSetToPush.indexkey,
        "id": dataSetToPush.id
      }
      if (this.BulkUpdateDataList?.length == 0) {
        this.BulkUpdateDataList.push(obj)
      }
      else if (!dataIndex.includes(String(index))) {
        this.BulkUpdateDataList.push(obj)
      }
      this.DeleteArrList.push(data?.id)
    }
    else {
      let indexdata = Number(data.indexkey)
      this.BulkUpdateDataList.splice(indexdata, 1)
      this.DeleteArrList.splice(indexdata, 1)
    }
  }

  BulkDelete() {
    let dataToUpdate = this.DeleteArrList
    if (dataToUpdate?.length == 0) {
      this.notification.showWarning("No records to delete")
      return false
    }
    let dataConfirm = confirm("Are you sure! Do you want to continue?")
    if (dataConfirm) {
      let ids = {
        id: dataToUpdate
      }
      this.Service.delete_provision(ids).subscribe((results: any) => {
        if (results['status'] == "success") {
          this.notification.showSuccess(results['status'])
          this.BulkUpdateDataList = []
          this.ExceptNoNUpdatedlist = []
          this.InvalidUpdateList = []
          this.DeleteArrList = []
          this.provision_search(this.search_data, 1)
          this.isChecked = false
        }
        if (results?.code == "PERMISSION DENIED" && results?.description == "Invalid data") {
          this.notification.showWarning("Permission Denied")
          return false
        }
      })
    }
  }
  ngAfterViewInit() {
    console.log("ngAfterViewInit")
    this.cdr.detectChanges();
  }
  ProvisionSystemreport() {
    let search = this.provisionsearch.value
    let obj: any = {
      bs_id: search?.bs_id?.id,
      cc_id: search?.cc_id?.id,
      module_id: search?.module_id?.id,
      month: search?.month,
      year: search?.year
    }
    for (let i in obj) {
      if (obj[i] == '' || obj[i] == null || obj[i] == undefined) {
        obj[i] = ''
      }
    }
    this.Service.reportsystem(obj)
      .subscribe(data => {
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'ProvisionReport' + date + ".xlsx";
        link.click();
        this.SpinnerService.hide();
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  moduleData() {
    this.Service.moduleget('').subscribe((results: any[]) => { this.moduledata = results["data"] })
  }

  bsDataSearch(data) {
    this.Service.getbsvalue(data)
      .subscribe((results: any[]) => {
        this.bsdata = results["data"];
        this.bsid = data?.id
      })
  }

  ccDataSearch(bs, data) {
    this.Service.getcclistDependentBs(bs?.id, data)
      .subscribe((results: any[]) => {
        this.ccData = results["data"]
      })
  }
}