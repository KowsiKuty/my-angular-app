
import { Component, OnInit, ViewChild, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router, ActivatedRoute } from '@angular/router';
import { SGService } from './../SG.service';
import { SGShareService } from './../share.service';
import { NotificationService } from 'src/app/service/notification.service';
import { SharedService } from '../../service/shared.service'
import { FormGroup, FormControl, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, map, takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';



import * as moment from 'moment';

import { DatePipe, formatDate } from '@angular/common';


import { default as _rollupMoment, Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';

const moment1 = _rollupMoment || moment;

export class zonelist {
  id: number;
  state: string;
  zone: string;
  count: number;
}
export interface productlistss {

  id: number;
  empcat: string;
  emptypedesc: string;
  empdesc: string;
}
export interface employeetypelistss {
  id: number
  emptype: string
}
export interface productlistss1 {
  id: number,
  name: string
  code: string;
}
export interface statezonelist1 {
  id: number,
  name: string
}


export interface branchList {
  id: number
  name: string
}


export interface approver {
  id: string;
  full_name: string;
}
export interface approvalBranch {
  id: string;
  name: string;
  code: string;
}
//holiday view screen
export interface approvalBranch_HD {
  id: string;
  name: string;
  code: string;
}


export interface approver_HD {
  id: string;
  full_name: string;
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-sgmster',
  templateUrl: './sgmster.component.html',
  // encapsulation: ViewEncapsulation.None,
  styleUrls: ['./sgmster.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SgmsterComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;


  //approval branch
  @ViewChild('appBranchInput') appBranchInput: any;
  @ViewChild('approvalBranch') matAutocompleteappbranch: MatAutocomplete;

  // Approver dropdown
  @ViewChild('ApproverContactInput') ApproverContactInput: any;
  @ViewChild('employee') matAutocompleteapprover: MatAutocomplete;

  @ViewChild('ApproverContactInput') clear_appBranch;

  // Vendor dropdown
  @ViewChild('VendorContactInput') VendorContactInput: any;
  @ViewChild('vendortype') matAutocompletevendor: MatAutocomplete;

  // State dropdown
  @ViewChild('StateContactInput') StateContactInput: any;
  @ViewChild('statetype') matAutocompletestate: MatAutocomplete;


  // VM vendor serach dropdown
  @ViewChild('Vendor_VMContactInput') Vendor_VMContactInput: any;
  @ViewChild('vendorSearchType') matAutocompletevendor_VM: MatAutocomplete;

  // approval flow

  movetochekerform: FormGroup
  approverform: FormGroup
  rejectedform: FormGroup
  reviewform: FormGroup
  isAdmin: boolean;
  branchlist: any
  countlen: boolean = true;
  has_previousemp: boolean = false;
  has_nextemp: boolean = false;
  presentpageemp: number = 1;
  employecatlist: any;
  isLoading = false
  //employeecat type
  has_previoustype: boolean = false;
  has_nexttype: boolean = false;
  presentpagetype: number = 1;
  emptypelist: any
  empcatlist: any
  //minwages master
  has_previousmin: boolean = false;
  has_nextmin: boolean = false;
  presentpagemin: number = 1;
  minwageslist: any
  isDisabled: boolean
  //statezone master
  has_previoussta: boolean = false;
  has_nextsta: boolean = false;
  presentpagesta: number = 1;
  statezonelist: any
  hidecat: boolean = false
  //vendor markup
  has_previousven: boolean = false;
  has_nextven: boolean = false;
  presentpageven: number = 1;
  vedordetails: any
  holidayform: FormGroup
  vendormarkupSearchForm: FormGroup
  pagenumber = 1;
  pagesize = 10;

  // sg_privision 

  sgprovision: boolean = false

  count = 0

  someArray: Array<{
    id: number;
    count: number;
    state: string;
    zone: string;
  }> = [];
  demo = 0;
  prpomasterList: any;
  isCommodity: any;
  // urls: any;
  urlemployee: string;
  urlemlpoyeetype: string;
  urlstatezonemapping: string;
  urlstatezonecity: string;
  urlvendormarkup: string;
  urlholidaymaster: string;
  holidaymaster: boolean;
  // isvendormarkup: boolean;
  // isverndormapping:boolean
  // isstatezonecity: boolean;
  // isstatezonemapping: boolean;
  // isemlpoyeetype: boolean;
  // isemployee: boolean;
  // isholidaymaster: boolean;
  Employeetypeform: any
  Employeeaddform: any
  premiseform: any
  fileoalist: any;
  premiselistt: any
  // minimumwages:boolean=false
  // penalty:boolean=false
  isStateZonepage: boolean = true;
  isHolidayPage: boolean = true;
  isVendorMarkupPage: boolean = true;

  // popup-screens
  @ViewChild('addaprover') addaprover;
  @ViewChild('rejected') rejected;
  @ViewChild('review') review;
  @ViewChild('makerchecker') makerchecker;

  @ViewChild(FormGroupDirective) fomGroupDirective: FormGroupDirective;





  //holiday view screen
  movetochekerform_HD: FormGroup;
  approverform_HD: FormGroup;
  rejectedform_HD: FormGroup;
  reviewform_HD: FormGroup;
  @ViewChild('addaprover_HD') addaprover_HD;
  @ViewChild('rejected_HD') rejected_HD;
  @ViewChild('review_HD') review_HD;
  @ViewChild('makerchecker_HD') makerchecker_HD;

  //approval branch
  @ViewChild('appBranchInput_HD') appBranchInput_HD: any;
  @ViewChild('approvalBranch_HD') matAutocompleteappbranch_HD: MatAutocomplete;

  // Approver dropdown
  @ViewChild('ApproverContactInput_HD') ApproverContactInput_HD: any;
  @ViewChild('employee_HD') matAutocompleteapprover_HD: MatAutocomplete;

  @ViewChild('ApproverContactInput_HD') clear_appBranch_HD;
  toggletype: number;


  constructor(private router: Router, private datepipe: DatePipe, private shareServicesg: SGShareService, private shareService: SharedService, private route: ActivatedRoute, private notification: NotificationService, private sgservice: SGService,
    private shareservice: SGShareService, private fb: FormBuilder, private toastr: ToastrService,private SpinnerService: NgxSpinnerService) {

  }

  monthdate = new FormControl(moment());

  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.monthdate.value;
    ctrlValue.year(normalizedYear.year());
    this.monthdate.setValue(ctrlValue);
    this.holidayform.patchValue({
      year: this.monthdate.value
    })
    datepicker.close();
  }

  // chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
  //   const ctrlValue = this.monthdate.value;
  //   ctrlValue.month(normalizedMonth.month());
  //   this.monthdate.setValue(ctrlValue);


  //   this.count=0
  // }

  ngOnInit(): void {

    let datas = this.shareService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "Security Guard Master") {
        this.prpomasterList = subModule;
        this.isCommodity = subModule[0].name;
      }
    })

    // this.isverndormapping=false
    // const routeparam=this.route.snapshot.paramMap;
    // const demo1 = Number(routeparam.get('id'));
    // this.demo=demo1;
    // if(this.demo==0)
    // {
    //   this.isemployee =true
    //   this.isemlpoyeetype =false 
    //   this.isstatezonemapping = false
    //   this.isstatezonecity = false
    //   this.isvendormarkup =false
    //   this.isholidaymaster=false
    //   this.isverndormapping=false
    //   this.getemployeecat(1,10);
    //   this.minimumwages=false
    //   this.penalty=false 
    //   this.sgprovision=false
    // }

    // if(this.demo==1)
    // {
    //   this.isemployee =false
    //   this.isemlpoyeetype =false 
    //   this.isstatezonemapping = true
    //   this.isstatezonecity = false
    //   this.isvendormarkup =false
    //   this.isholidaymaster=false
    //   this.isverndormapping=false
    //   this.getemployeeminwage()
    //   this.minimumwages=false
    //   this.penalty=false 
    //   this.sgprovision=false
    // }

    // if(this.demo==4)
    // {
    //   this.isvendormarkup =true
    //   this.isemployee =false
    //   this.isemlpoyeetype =false 
    //   this.isstatezonemapping = false
    //   this.isstatezonecity = false

    //   this.isholidaymaster=false
    //   this.isverndormapping=false
    //   this.getvendordetails(this.send_VM,this.presentpageven)
    //   this.vendormarkupSearchForm=this.fb.group({
    //     vendor:[''],
    //   })
    //   this.minimumwages=false
    //   this.penalty=false 
    //   this.sgprovision=false

    // }
    // if(this.demo==3)
    // {
    //   this.isemployee =false
    //   this.isemlpoyeetype =false 
    //   this.isstatezonemapping = false
    //   this.isstatezonecity = false
    //   this.isvendormarkup =false
    //   this.isholidaymaster=true
    //   this.isverndormapping=false
    //   this.getholidayfile(this.send_value, this.presentpageholi)
    //   this.holidayform=this.fb.group({
    //     vendor_id:[''],
    //     state_id:[''],
    //     year:['']
    //   })
    //   this.minimumwages=false
    //   this.penalty=false
    //   this.sgprovision=false
    // }
    // if(this.demo==2)
    // {
    //   this.isemployee =false
    //   this.isemlpoyeetype =false 
    //   this.isstatezonemapping = false
    //   this.isstatezonecity = false
    //   this.isvendormarkup =false
    //   this.isholidaymaster=false
    //   this.isverndormapping=false
    //   this.minimumwages=true
    //   this.penalty=false
    //   this.sgprovision=false
    // }
    // if(this.demo==5)
    // {
    //   this.isemployee =false
    //   this.isemlpoyeetype =false 
    //   this.isstatezonemapping = false
    //   this.isstatezonecity = false
    //   this.isvendormarkup =false
    //   this.isholidaymaster=false
    //   this.isverndormapping=false
    //   this.minimumwages=false
    //   this.penalty=true
    //   this.sgprovision=false
    // }

    this.Employeetypeform = this.fb.group({
      emptype: ['', Validators.required],
      emptypedesc: ['', Validators.required],
      empcat_id: ['', Validators.required]
    })
    this.premiseform = this.fb.group({
      premise_id: ['', Validators.required],
      type_id: ['', Validators.required],
      count: ['', Validators.required]

    })
    this.Employeeaddform = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      vendor_id: ['', Validators.required],
      premise_id: ['', Validators.required],
      branch_id: ['', Validators.required]
    })


    this.movetochekerform = this.fb.group({

      status: [''],
      remarks: [''],
      approver: [''],
      approval_branch: [''],
      // patch1:['']
    })

    this.approverform = this.fb.group({

      status: [''],
      remarks: [''],

    })

    this.rejectedform = this.fb.group({
      status: [''],
      remarks: [''],
    })

    this.reviewform = this.fb.group({
      status: [''],
      remarks: [''],
    })

    this.holidayform = this.fb.group({
      vendor_id: [''],
      state_id: [''],
      year: ['']
    })
    this.vendormarkupSearchForm = this.fb.group({
      vendor: [''],
    })



    //holiday view screen
    this.movetochekerform_HD = this.fb.group({

      status: [''],
      remarks: [''],
      approver: [''],
      approval_branch: [''],
    })

    this.approverform_HD = this.fb.group({

      status: [''],
      remarks: [''],

    })

    this.rejectedform_HD = this.fb.group({
      status: [''],
      remarks: [''],
    })

    this.reviewform_HD = this.fb.group({
      status: [''],
      remarks: [''],
    })




  }

  // subModuleData(event: MatTabChangeEvent) {
  //   const tab = event.tab.textLabel;

  //   if (tab=="Employee Category") {

  //     this.isemployee =true
  //     this.isemlpoyeetype =false 
  //     this.isstatezonemapping = false
  //     this.isstatezonecity = false
  //     this.isvendormarkup =false
  //     this.isholidaymaster=false
  //     this.isverndormapping=false
  //     this.getemployeecat(1,10);
  //     this.minimumwages=false 
  //     this.penalty=false     
  //     this.sgprovision=false
  //   }

  //   if (tab=="State Zone Mapping") {

  //     this.isemployee =false
  //     this.isemlpoyeetype =false 
  //     this.isstatezonemapping = true
  //     this.isstatezonecity = false
  //     this.isvendormarkup =false
  //     this.isholidaymaster=false
  //     this.isverndormapping=false
  //     this.getemployeeminwage()
  //     this.minimumwages=false
  //     this.penalty=false
  //     this.sgprovision=false
  //   }       
  //   if (tab=="Vendor Markup Master") {

  //     this.isemployee =false
  //     this.isemlpoyeetype =false 
  //     this.isstatezonemapping = false
  //     this.isstatezonecity = false
  //     this.isvendormarkup =true
  //     this.isholidaymaster=false
  //     this.isverndormapping=false
  //     this.send_VM = ""
  //     this.getvendordetails(this.send_VM,this.presentpageven)
  //     this.vendormarkupSearchForm=this.fb.group({
  //       vendor:[''],
  //     })
  //     this.minimumwages=false 
  //     this.penalty=false     
  //     this.sgprovision=false 
  //   }
  //   if (tab=="Holiday Master") {

  //     this.isemployee =false
  //     this.isemlpoyeetype =false 
  //     this.isstatezonemapping = false
  //     this.isstatezonecity = false
  //     this.isvendormarkup =false
  //     this.isholidaymaster=true
  //     this.isverndormapping=false
  //     this.send_value = ""
  //     this.getholidayfile(this.send_value, this.presentpageholi)
  //     this.holidayform=this.fb.group({
  //       vendor_id:[''],
  //       state_id:[''],
  //       year:['']
  //     })
  //     this.minimumwages=false
  //     this.penalty=false
  //     this.sgprovision=false
  //   }
  //   if(tab=="Minimum Wages Master")
  //   {
  //     this.isemployee =false
  //     this.isemlpoyeetype =false 
  //     this.isstatezonemapping = false
  //     this.isstatezonecity = false
  //     this.isvendormarkup =false
  //     this.isholidaymaster=false
  //     this.isverndormapping=false
  //     this.minimumwages=true
  //     this.penalty=false
  //     this.sgprovision=false
  //   }
  //   if(tab=="Penalty")
  //   {
  //     this.isemployee =false
  //     this.isemlpoyeetype =false 
  //     this.isstatezonemapping = false
  //     this.isstatezonecity = false
  //     this.isvendormarkup =false
  //     this.isholidaymaster=false
  //     this.isverndormapping=false
  //     this.minimumwages=false
  //     this.penalty=true
  //     this.sgprovision=false
  //   }
  //   // if(tab=="SG Provision")
  //   // {
  //   //   this.isemployee =false
  //   //   this.isemlpoyeetype =false 
  //   //   this.isstatezonemapping = false
  //   //   this.isstatezonecity = false
  //   //   this.isvendormarkup =false
  //   //   this.isholidaymaster=false
  //   //   this.isverndormapping=false
  //   //   this.minimumwages=false
  //   //   this.penalty=false
  //   //   this.sgprovision=true
  //   // }

  // }

  urls: string;
  urlEmpCat: string;
  urlStateZoneMapping: string;
  urlMinimumWages: string;
  urlVendorMarkup: string;
  urlPenalty: string;
  urlHoliday: string;

  isemployee: boolean;
  isstatezonemapping: boolean;
  minimumwages: boolean;
  isvendormarkup: boolean;
  penalty: boolean;
  isholidaymaster: boolean;

  isemlpoyeetype: boolean;
  isAddEmpCAtForm: boolean

  isSZ_AddForm: boolean;
  isSZ_viewForm: boolean;

  isVM_AddEdit_Form: boolean;
  isVM_viewForm: boolean;

  is_AddHolidayForm: boolean
  is_view_holiday: boolean
  is_HolidayUpdateForm: boolean
  subModuleData(data) {
    this.urls = data.url;
    this.urlEmpCat = "/employeementcategory";
    this.urlStateZoneMapping = "/statezonemapping";
    this.urlMinimumWages = "/minimumwages";
    this.urlVendorMarkup = "/vendormarkup";
    this.urlPenalty = "/penalty";
    this.urlHoliday = "/holidaymaster";
    this.isemployee = this.urlEmpCat === this.urls ? true : false;
    this.isstatezonemapping = this.urlStateZoneMapping === this.urls ? true : false;
    this.minimumwages = this.urlMinimumWages === this.urls ? true : false;
    this.isvendormarkup = this.urlVendorMarkup === this.urls ? true : false;
    this.penalty = this.urlPenalty === this.urls ? true : false;
    this.isholidaymaster = this.urlHoliday === this.urls ? true : false;

    if (this.isemployee) {
      this.isemployee = true
      this.isemlpoyeetype = false
      this.isAddEmpCAtForm = false
      this.isstatezonemapping = false
      this.isSZ_AddForm = false
      this.isSZ_viewForm = false
      this.minimumwages = false
      this.isholidaymaster = false
      this.is_AddHolidayForm = false
      this.is_HolidayUpdateForm = false
      this.is_view_holiday = false
      this.isvendormarkup = false
      this.isVM_AddEdit_Form = false;
      this.isVM_viewForm = false;
      this.penalty = false
      this.getemployeecat(1, 10);
    }
    else if (this.isstatezonemapping) {
      this.isemployee = false
      this.isemlpoyeetype = false
      this.isAddEmpCAtForm = false
      this.isstatezonemapping = true
      this.isSZ_AddForm = false
      this.isSZ_viewForm = false
      this.minimumwages = false
      this.isholidaymaster = false
      this.is_AddHolidayForm = false
      this.is_view_holiday = false
      this.is_HolidayUpdateForm = false
      this.isvendormarkup = false
      this.isVM_AddEdit_Form = false;
      this.isVM_viewForm = false;
      this.penalty = false
      this.getemployeeminwage()
    } else if (this.minimumwages) {
      this.isemployee = false
      this.isemlpoyeetype = false
      this.isAddEmpCAtForm = false
      this.isstatezonemapping = false
      this.isSZ_AddForm = false
      this.isSZ_viewForm = false
      this.minimumwages = true
      this.isholidaymaster = false
      this.is_AddHolidayForm = false
      this.is_view_holiday = false
      this.is_HolidayUpdateForm = false
      this.isvendormarkup = false
      this.isVM_AddEdit_Form = false;
      this.isVM_viewForm = false;
      this.penalty = false
    } else if (this.isvendormarkup) {
      this.isemployee = false
      this.isemlpoyeetype = false
      this.isAddEmpCAtForm = false
      this.isstatezonemapping = false
      this.isSZ_AddForm = false
      this.isSZ_viewForm = false
      this.minimumwages = false
      this.isholidaymaster = false
      this.is_view_holiday = false
      this.is_AddHolidayForm = false
      this.is_HolidayUpdateForm = false
      this.isvendormarkup = true
      this.isVM_AddEdit_Form = false;
      this.isVM_viewForm = false;
      this.penalty = false
      this.send_VM = ""
      this.hasNextVMSearch_Page = ""
      this.presentpageven = 1
      this.getvendordetails(this.send_VM, this.presentpageven)
      this.vendormarkupSearchForm = this.fb.group({
        vendor: [''],
      })
    } else if (this.penalty) {
      this.isemployee = false
      this.isemlpoyeetype = false
      this.isAddEmpCAtForm = false
      this.isstatezonemapping = false
      this.isSZ_AddForm = false
      this.isSZ_viewForm = false
      this.minimumwages = false
      this.isholidaymaster = false
      this.is_AddHolidayForm = false
      this.is_view_holiday = false
      this.is_HolidayUpdateForm = false
      this.isvendormarkup = false
      this.isVM_AddEdit_Form = false;
      this.isVM_viewForm = false;
      this.penalty = true
    } else if (this.isholidaymaster) {
      this.isemployee = false
      this.isemlpoyeetype = false
      this.isAddEmpCAtForm = false
      this.isstatezonemapping = false
      this.isSZ_AddForm = false
      this.isSZ_viewForm = false
      this.minimumwages = false
      this.isholidaymaster = true
      this.is_AddHolidayForm = false
      this.is_view_holiday = false
      this.is_HolidayUpdateForm = false
      this.isvendormarkup = false
      this.isVM_AddEdit_Form = false;
      this.isVM_viewForm = false;
      this.penalty = false
      this.send_value = ""
      this.hasNextHDSearch_Page = ""
      this.presentpageholi = 1
      this.getholidayfile(this.send_value, this.presentpageholi)
      this.holidayform = this.fb.group({
        vendor_id: [''],
        state_id: [''],
        year: ['']
      })
    }


  }


  //Add employee category
  empCatAddCancel() {
    this.isemployee = true;
    this.isAddEmpCAtForm = false;
    this.isemlpoyeetype = false;
  }

  empCatAddSubmit() {
    this.isemployee = true;
    this.isAddEmpCAtForm = false;
    this.isemlpoyeetype = false;
    this.getemployeecat(1, 10);
  }


  //Add State Zone Mapping
  SZAddCancel() {
    this.isstatezonemapping = true;
    this.isSZ_AddForm = false;
    this.isSZ_viewForm = false;
  }

  SZAddSubmit() {
    this.isstatezonemapping = true;
    this.isSZ_AddForm = false;
    this.isSZ_viewForm = false;
    this.getemployeeminwage();
  }

  SZViewCancel() {
    this.isstatezonemapping = true;
    this.isSZ_AddForm = false;
    this.isSZ_viewForm = false;
  }

  //vendormarkup 
  VM_AddEdit_Cancel() {
    this.isvendormarkup = true;
    this.isVM_AddEdit_Form = false;
    this.isVM_viewForm = false;
  }
  VM_AddEdit_Submit() {
    this.isvendormarkup = true;
    this.isVM_AddEdit_Form = false;
    this.isVM_viewForm = false;
    this.getvendordetails(this.send_VM, this.presentpageven)
  }

  VMViewCancel() {
    this.isvendormarkup = true;
    this.isVM_AddEdit_Form = false;
    this.isVM_viewForm = false;
    this.getvendordetails(this.send_VM, this.presentpageven)
  }

  //holiday screen
  //vendormarkup 
  holiday_AddCancel() {
    this.isholidaymaster = true;
    this.is_AddHolidayForm = false;
    this.is_view_holiday = false;
    this.is_HolidayUpdateForm = false
  }
  holiday_AddSubmit() {
    this.isholidaymaster = true;
    this.is_AddHolidayForm = false;
    this.is_view_holiday = false;
    this.is_HolidayUpdateForm = false
    this.getholidayfile(this.send_value, this.presentpageholi)
  }

  holiday_updateCancel() {
    this.isholidaymaster = false;
    this.is_AddHolidayForm = false;
    this.is_view_holiday = true;
    this.is_HolidayUpdateForm = false
  }
  holiday_Updateubmit() {
    this.isholidaymaster = false;
    this.is_AddHolidayForm = false;
    this.is_view_holiday = true;
    this.is_HolidayUpdateForm = false
    this.getholidayvalue();
  }

  empcatDelete(data) {
    this.sgservice.empolyeecatdelete(data.id).subscribe((result) => {
      if (result.code === "INVALID_EmployeeCategory_ID" && result.description === "INVALID_EmployeeCategory_ID") {
        this.notification.showError(" [INVALID_EmployeeCategory_ID! ...]")
      }
      else if (result.code === "INVALID_DELETE" && result.description === "INVALID_DELETE") {
        this.notification.showError("[INVALID_EmployeeCategory_ID! ...]")
      }
      else {
        this.notification.showSuccess("Success")
        this.getemployeecat(1, 10);
      }
    })
  }

  employeecat() {
    this.shareservice.employementcat.next("")
    this.isemlpoyeetype = false
    this.isemployee = false
    this.isAddEmpCAtForm = true
    // this.router.navigate(['SGmodule/employeecat'], { skipLocationChange: true })

  }

  employeecatedit(data) {
    this.shareservice.employementcat.next(data)
    this.router.navigate(['SGmodule/employeecat'], { skipLocationChange: true })
  }
  getemployeecat(pagenumber = 1, pagesize = 10) {

    this.sgservice.getEmployeecat(pagenumber, pagesize)
      .subscribe((result) => {

        let datas = result['data'];
        let datapagination = result["pagination"];
        this.employecatlist = datas;
        if (this.employecatlist.length >= 0) {
          this.has_nextemp = datapagination.has_next;
          this.has_previousemp = datapagination.has_previous;
          this.presentpageemp = datapagination.index;
        }

      })

  }
  employeenextClick() {

    if (this.has_nextemp === true) {
      this.getemployeecat(this.presentpageemp + 1, 10)

    }
  }

  employeepreviousClick() {

    if (this.has_previousemp === true) {
      this.getemployeecat(this.presentpageemp - 1, 10)

    }
  }

  //employeecat type



  employeetype() {
    this.shareservice.employementtype.next("");
    this.router.navigate(['SGmodule/employeetype'], { skipLocationChange: true })

  }
  emptypeedit(data) {
    this.shareservice.employementtype.next(data);
    this.getEditemployeetype();

    // this.router.navigate(['/employeetype'], { skipLocationChange: true })

  }

  getemployeetype(pagenumber = 1, pagesize = 10) {

    this.sgservice.getEmployeetype(pagenumber, pagesize)
      .subscribe((result) => {

        let datas = result['data'];
        let datapagination = result["pagination"];
        this.emptypelist = datas;
        if (this.emptypelist.length >= 0) {
          this.has_nexttype = datapagination.has_next;
          this.has_previoustype = datapagination.has_previous;
          this.presentpagetype = datapagination.index;
        }

      })

  }

  emptypenextClick() {

    if (this.has_nexttype === true) {
      this.getemployeecat(this.presentpagetype + 1, 10)

    }
  }

  emptypepreviousClick() {

    if (this.has_previoustype === true) {
      this.getemployeecat(this.presentpagetype - 1, 10)

    }
  }



  //statezone master

  statezoneedit(data) {
    this.shareservice.statezone.next(data)
    this.isstatezonemapping = false;
    this.isSZ_AddForm = false;
    this.isSZ_viewForm = true;
    // this.router.navigate(['SGmodule/statezone'], { skipLocationChange: true })
  }

  // createstate(data)
  // {
  //   this.shareservice.noofzones.next(data);
  //   this.router.navigate(['/statezone'],{skipLocationChange: true})

  // }

  getemployeestatezone(pagenumber = 1, pagesize = 10) {

    this.sgservice.getStatezone(pagenumber, pagesize)
      .subscribe((result) => {

        let datas = result['data'];
        let datapagination = result["pagination"];
        this.statezonelist = datas;
        if (this.statezonelist.length >= 0) {
          this.has_nextsta = datapagination.has_next;
          this.has_previoussta = datapagination.has_previous;
          this.presentpagesta = datapagination.index;
        }

      })

  }
  statenextClick() {

    if (this.has_nextsta === true) {
      this.getemployeestatezone(this.presentpagesta + 1, 10)

    }
  }

  statepreviousClick() {

    if (this.has_previoussta === true) {
      this.getemployeestatezone(this.presentpagesta - 1, 10)

    }
  }

  employeestate() {
    this.shareservice.statezone.next("")
    this.router.navigate(['SGmodule/statezone'], { skipLocationChange: true })
  }

  //minwages master

  minwagesedit(data) {
    this.shareservice.minwages.next(data)
    this.router.navigate(['SGmodule/minwage'], { skipLocationChange: true })
  }
  getemployeeminwage(pagenumber = 1, pagesize = 10) {

    this.sgservice.getminwages(pagenumber, pagesize)
      .subscribe((result) => {

        let datas = result['data'];
        let datapagination = result["pagination"];
        this.minwageslist = datas;
        this.someArray = [];

        for (let i = 0; i < this.minwageslist.length; i++) {
          let val = this.minwageslist[i].count;
          for (let j = 0; j < val; j++) {
            var res = String.fromCharCode(65 + j);
            let zone = "Zone";
            zone = zone + res;
            if (this.str === undefined) {
              this.str = zone;
            } else {
              this.str = this.str + " / " + zone;
            }
          }

          let obj = new zonelist();
          obj.id = this.minwageslist[i].id;
          if (this.minwageslist[i].state != null) {
            obj.state = this.minwageslist[i].state.name;
            obj.count = this.minwageslist[i].count;
            obj.zone = this.str;

            this.someArray.push(obj);
            this.str = undefined;
          }

        }

        if (this.minwageslist.length > 0) {
          this.has_nextmin = datapagination.has_next;
          this.has_previousmin = datapagination.has_previous;
          this.presentpagemin = datapagination.index;
          this.isStateZonepage = true;
        }
        if (this.minwageslist.length === 0) {
          this.isStateZonepage = false
        }

      })

  }
  minwagenextClick() {

    if (this.has_nextmin === true) {
      this.getemployeeminwage(this.presentpagemin + 1, 10)

    }
  }

  minwagepreviousClick() {

    if (this.has_previousmin === true) {
      this.getemployeeminwage(this.presentpagemin - 1, 10)

    }
  }
  Add_StateZone() {
    this.shareservice.minwages.next("")
    this.isstatezonemapping = false;
    this.isSZ_AddForm = true;
    this.isSZ_viewForm = false;
    // this.router.navigate(['SGmodule/minwage'], { skipLocationChange: true })
  }


  str: string;
  value() {
    this.someArray = [];
    for (let i = 0; i < this.minwageslist.length; i++) {
      let val = this.minwageslist[i].count;
      for (let j = 0; j < val; j++) {
        var res = String.fromCharCode(65 + j);
        let zone = "Zone";
        zone = zone + res;
        if (this.str === undefined) {
          this.str = zone;
        } else {
          this.str = this.str + " / " + zone;
        }
      }

      let obj = new zonelist();
      obj.id = this.minwageslist[i].id;
      obj.state = this.minwageslist[i].state.name;
      obj.count = this.minwageslist[i].count;
      obj.zone = this.str;

      this.someArray.push(obj);

      this.str = undefined;

    }

  }
  //vendor markup

  employeevendor() {
    this.shareservice.vendor.next("");
    this.isvendormarkup = false;
    this.isVM_AddEdit_Form = true;
    this.isVM_viewForm = false;
    // this.router.navigate(['SGmodule/vender'], { skipLocationChange: true })
  }

  employeevendor1() {
    this.router.navigate(['SGmodule/sgmaster', 0], { skipLocationChange: true })
  }


  employeevendoredit(data) {
    this.shareservice.vendor.next(data);
    this.isvendormarkup = false;
    this.isVM_AddEdit_Form = true;
    this.isVM_viewForm = false;
    // this.router.navigate(['SGmodule/vender'], { skipLocationChange: true })

  }

  getvendordetails(val, pageNumber) {
    // this.SpinnerService.show()

    this.sgservice.getvendorMarkupSummary(val, pageNumber)
      .subscribe((result) => {
        // this.SpinnerService.hide()
        let datas = result['data'];
        this.isAdmin = result.is_admin;
        let datapagination = result["pagination"];
        this.vedordetails = datas;

        if (this.vedordetails.length > 0) {

          this.has_nextven = datapagination.has_next;
          this.has_previousven = datapagination.has_previous;
          this.presentpageven = datapagination.index;
          this.isVendorMarkupPage = true;
        }
        if (this.vedordetails.length === 0) {
          this.isVendorMarkupPage = false
        }
        this.send_VM = ""
      })

  }
  vendornextClick() {

    if (this.has_nextven === true) {
      this.getvendordetails(this.hasNextVMSearch_Page, this.presentpageven + 1)

    }
  }

  vendorpreviousClick() {

    if (this.has_previousven === true) {
      this.getvendordetails(this.hasNextVMSearch_Page, this.presentpageven - 1)

    }
  }

  send_VM: String = ""
  hasNextVMSearch_Page: any = ""
  OnserachVM() {
    let form_value = this.vendormarkupSearchForm.value;


    if (form_value.vendor != "") {
      this.send_VM = this.send_VM + "&vendor_id=" + form_value.vendor.id
    }
    this.hasNextVMSearch_Page = this.send_VM
    this.presentpageven = 1
    this.getvendordetails(this.send_VM, this.presentpageven)

    // this.sgservice.vendorSerachSummary(this.presentpageven,value).subscribe((result)=>{
    //   let datas = result['data'];
    //   let datapagination = result["pagination"];
    //   this.vedordetails = datas;

    //   if (this.vedordetails.length > 0) {

    //     this.has_nextven = datapagination.has_next;
    //     this.has_previousven = datapagination.has_previous;
    //     this.presentpageven= datapagination.index;
    //   }

    // })

  }
  resetVMform() {
    this.send_VM = ""
    this.vendormarkupSearchForm = this.fb.group({
      vendor: [''],
    })
    this.presentpageven = 1
    this.getvendordetails(this.send_VM, this.presentpageven);
  }


  productname() {
    let prokeyvalue: String = "";
    this.getcatid(prokeyvalue);
    this.Employeetypeform.get('empcat_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.sgservice.getemployeementcatdropsown(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.empcatlist = datas;

      })


  }
  private getcatid(prokeyvalue) {
    this.sgservice.getemployeementcatdropsown(prokeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.empcatlist = datas;

      })
  }

  public displaydis(producttype?: productlistss): string | undefined {



    return producttype ? producttype.empdesc : undefined;

  }



  // }






  idValue: any
  getEditemployeetype() {

    let data: any = this.shareservice.employementtype.value;
    this.idValue = data.id;
    if (data === '') {
      this.Employeetypeform.patchValue({
        emptype: '',
        emptypedesc: '',
        empcat_id: data.empcat
      })
    } else {
      this.Employeetypeform.patchValue({
        emptype: data.emptype,
        emptypedesc: data.emptypedesc,
        empcat_id: this.categoryname
      })
    }


  }

  createFormat() {
    let data = this.Employeetypeform.controls;


    let obj = new ctrlofztype();

    obj.emptype = data['emptype'].value;
    obj.emptypedesc = data['emptypedesc'].value;
    obj.empcat_id = this.dataid;

    return obj;
  }
  categoryname: any
  catdesc: any
  empcatdesc: any
  dataid: any
  addEmployeetype(data) {
    this.dataid = data.id
    this.categoryname = data.empcat
    this.catdesc = data.empcatdesc
    this.empcatdesc = this.categoryname - this.catdesc
    this.isemlpoyeetype = true;
    this.fomGroupDirective.resetForm();
    this.Employeetypeform.patchValue({
      empcat_id: data.empcat
    })
    this.getparticularemptype();

  }

  EmployeetypeSubmitForm() {

    if (this.Employeetypeform.value.empcat_id === "") {

      this.toastr.warning('', 'Please Enter the Employee category', { timeOut: 1500 });
      return false
    }
    if (this.Employeetypeform.value.emptype === "" || this.Employeetypeform.value.emptype === null) {

      this.toastr.warning('', 'Please Enter the Employee Type', { timeOut: 1500 });
      return false
    }
    if (this.Employeetypeform.value.emptypedesc === "" || this.Employeetypeform.value.emptypedesc === null) {

      this.toastr.warning('', 'Please Enter the  Description', { timeOut: 1500 });
      return false
    }

    if (this.idValue == undefined) {
      this.sgservice.employeetypeCreation(this.createFormat(), '')
        .subscribe(result => {
          if (result.status === "success") {
            this.notification.showSuccess("Successfully Created..")
            this.getparticularemptype();
            this.fomGroupDirective.resetForm();
            this.Employeetypeform.patchValue({
              empcat_id: this.categoryname
            })
            this.idValue = undefined;
          }
          else {
            this.notification.showError(result.description)
          }
        })
    }
    else {
      this.sgservice.employeetypeCreation(this.createFormat(), this.idValue)
        .subscribe(result => {
          if (result.status === "success") {
            this.notification.showSuccess("Successfully Updated..")
            this.getparticularemptype();
            this.fomGroupDirective.resetForm();
            this.Employeetypeform.patchValue({
              empcat_id: this.categoryname
            })
            this.idValue = undefined;
          }
          else {
            this.notification.showError(result.description)
          }
        })
    }


  }





  onCancelClick() {

    this.shareservice.employementtype.next("");
    this.isemployee = true
    this.isAddEmpCAtForm = false
    // this.router.navigate(['SGmodule/sgmaster',0], { skipLocationChange: true })
  }
  particularemptypelist: any
  getparticularemptype(pagenumber = 1, pagesize = 10) {

    this.sgservice.getparticularemptype(pagenumber, pagesize, this.dataid)
      .subscribe((result) => {

        let datas = result['data'];
        let datapagination = result["pagination"];
        this.particularemptypelist = datas;
        if (this.particularemptypelist.length >= 0) {
          this.has_nexttype = datapagination.has_next;
          this.has_previoustype = datapagination.has_previous;
          this.presentpagetype = datapagination.index;
        }

      })

  }







  holidaytype(data, key) {
    if (key == 1) {
      this.shareServicesg.hoildaykeyview = false
      this.shareServicesg.hoildaykeyadd = true
      this.shareServicesg.holidaysummarydata.next(data)
      this.isholidaymaster = false
      this.is_AddHolidayForm = true
      this.is_view_holiday = false
      this.is_HolidayUpdateForm = false
    }
    else if (key == 2) {
      this.shareServicesg.hoildaykeyadd = false
      this.shareServicesg.hoildaykeyview = true
      this.shareServicesg.holidaysummarydata.next(data)
      this.isholidaymaster = false
      this.is_AddHolidayForm = false
      this.is_HolidayUpdateForm = false
      this.is_view_holiday = true
      this.getholidayvalue();
    }
    // this.shareServicesg.holidaysummarydata.next(data)
    // this.isholidaymaster = false
    // this.is_AddHolidayForm = true
    // this.router.navigate(['SGmodule/holidaymaster'], { skipLocationChange: true })

  }


  holidayidapproval: any
  approvalflowlist: any = [];
  state: String;
  vendor: any;
  year: any;
  approval_status: any;
  hoildayvalue: any
  yearlyHolidayList: any;
  //holiday view screen 
  getholidayvalue() {
    let sharevalue = this.shareServicesg.holidaysummarydata.value;
    this.holidayidapproval = sharevalue?.id
    this.approvalflowlist.push(sharevalue)
    this.hoildayvalue = sharevalue
    this.state = sharevalue?.state?.name
    // this.vendor=sharevalue?.vendor?.name
    this.vendor = "(" + sharevalue?.vendor?.code + ") " + sharevalue?.vendor?.name
    this.year = sharevalue?.year
    this.approval_status = sharevalue?.approval_status?.status
    this.sgservice.Viewholidayformdetails(this.holidayidapproval).subscribe((result) => {
      let datass = result['data'];
      this.yearlyHolidayList = datass;

    })

  }

  OnCancleview_holiday() {
    this.approvalflowlist = [];
    this.isholidaymaster = true;
    this.is_AddHolidayForm = false
    this.is_view_holiday = false
    this.is_HolidayUpdateForm = false
    this.getholidayfile(this.send_value, this.presentpageholi)

  }

  holidayUpdate() {
    this.shareservice.holidayupdate.next(this.holidayidapproval)
    this.shareservice.holidaysummarydata.next(this.hoildayvalue)
    this.isholidaymaster = false
    this.is_AddHolidayForm = false
    this.is_view_holiday = false
    this.is_HolidayUpdateForm = true
    // this.router.navigate(['SGmodule/holidayUpdate'], { skipLocationChange: true })
  }

  oncancelclick1_HD() {
    this.movetochekerform_HD.patchValue({
      approver: '',
      remarks: '',
      approval_branch: '',
      patch1: ''
    })
    this.approverform_HD.patchValue({
      remarks: ''
    })
    this.reviewform_HD.patchValue({
      remarks: ''
    })
    this.rejectedform_HD.patchValue({
      remarks: ''
    })

  }
  namelist = [];

  movetoapprove_HD() {
    if (this.movetochekerform_HD.value.approval_branch.id === undefined || this.movetochekerform_HD.value.approval_branch === '') {
      this.toastr.warning('', 'Please Select Any one Approver Branch', { timeOut: 1500 });
      return false
    }
    if (this.movetochekerform_HD.value.approver.id === undefined || this.movetochekerform_HD.value.approver === '') {
      this.toastr.warning('', 'Please Select Any one Approver', { timeOut: 1500 });
      return false
    }
    // if(this.movetochekerform.value.remarks=='')
    // {
    //   this.toastr.warning('', 'Please Enter the Remarks', { timeOut: 1500 });    
    //   return false
    // }

    // this.movetochekerform_HD.patchValue({
    //   status:2,
    //   approval_branch:this.movetochekerform_HD.value.approval_branch.id,
    //   approver:this.movetochekerform_HD.value.approver.id,

    // })
    let obj = {
      status: 2,
      approval_branch: this.movetochekerform_HD.value.approval_branch.id,
      approver: this.movetochekerform_HD.value.approver.id,
      remarks: this.movetochekerform_HD.value.remarks
    }
    // this.movetochekerform_HD.value.approval_branch = this.movetochekerform_HD.value.approval_branch.id,
    // this.movetochekerform_HD.value.approver=this.movetochekerform_HD.value.approver.id,

    this.sgservice.holiday_status(obj, this.holidayidapproval)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Moved to Approver!...")
          this.makerchecker_HD.nativeElement.click();
          this.sgservice.getholidayformdetails('', 1)
            .subscribe(result => {
              let datass = result['data'];
              this.namelist = datass;
              for (let i = 0; i < this.namelist.length; i++) {
                if (this.namelist[i].id == this.holidayidapproval) {
                  this.approvalflowlist = []
                  this.approvalflowlist.push(this.namelist[i])
                }
              }
              let sharevalue = this.approvalflowlist[0];
              this.state = sharevalue?.state?.name
              this.vendor = "(" + sharevalue?.vendor?.code + ") " + sharevalue?.vendor?.name
              this.year = sharevalue?.year
              this.approval_status = sharevalue?.approval_status?.status
              this.OnCancleview_holiday()
            })

        } else {
          this.notification.showError(res.description)
        }
        return true
      })


  }


  ApproverPopupForm_HD() {

    if (this.approverform_HD.value.remarks == '') {
      this.toastr.warning('', 'Please Enter the Remarks', { timeOut: 1500 });
      return false
    }

    this.approverform_HD.patchValue({
      status: 3,

    })
    this.sgservice.holiday_status(this.approverform_HD.value, this.holidayidapproval)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Approved Successfully!...")
          this.addaprover_HD.nativeElement.click();
          this.sgservice.getholidayformdetails('', 1)
            .subscribe(result => {
              let datass = result['data'];
              this.namelist = datass;
              for (let i = 0; i < this.namelist.length; i++) {
                if (this.namelist[i].id == this.holidayidapproval) {
                  this.approvalflowlist = []
                  this.approvalflowlist.push(this.namelist[i])
                }
              }
              let sharevalue = this.approvalflowlist[0];
              this.state = sharevalue?.state?.name
              this.vendor = "(" + sharevalue?.vendor?.code + ") " + sharevalue?.vendor?.name
              this.year = sharevalue?.year
              this.approval_status = sharevalue?.approval_status?.status
            })

        } else {
          this.notification.showError(res.description)
        }
        return true
      })

  }

  rejectPopupForm_HD() {
    if (this.rejectedform_HD.value.remarks == '') {
      this.toastr.warning('', 'Please Enter the Remarks', { timeOut: 1500 });
      return false
    }
    this.rejectedform_HD.patchValue({
      status: 0,

    })
    this.sgservice.holiday_status(this.rejectedform_HD.value, this.holidayidapproval)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Rejected!...")
          this.rejected_HD.nativeElement.click();
          this.sgservice.getholidayformdetails('', 1)
            .subscribe(result => {
              let datass = result['data'];
              this.namelist = datass;
              for (let i = 0; i < this.namelist.length; i++) {
                if (this.namelist[i].id == this.holidayidapproval) {
                  this.approvalflowlist = []
                  this.approvalflowlist.push(this.namelist[i])
                }
              }
              let sharevalue = this.approvalflowlist[0];
              this.state = sharevalue?.state?.name
              this.vendor = "(" + sharevalue?.vendor?.code + ") " + sharevalue?.vendor?.name
              this.year = sharevalue?.year
              this.approval_status = sharevalue?.approval_status?.status
            })


        } else {
          this.notification.showError(res.description)
        }
        return true
      })
  }

  reviewPopupForm_HD() {
    if (this.reviewform_HD.value.remarks == '') {
      this.toastr.warning('', 'Please Enter the Remarks', { timeOut: 1500 });
      return false
    }
    this.reviewform_HD.patchValue({
      status: 4,

    })


    this.sgservice.holiday_status(this.reviewform_HD.value, this.holidayidapproval)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Reviewed!...")
          this.review_HD.nativeElement.click();
          this.sgservice.getholidayformdetails('', 1)
            .subscribe(result => {
              let datass = result['data'];
              this.namelist = datass;
              for (let i = 0; i < this.namelist.length; i++) {
                if (this.namelist[i].id == this.holidayidapproval) {
                  this.approvalflowlist = []
                  this.approvalflowlist.push(this.namelist[i])
                }
              }

              let sharevalue = this.approvalflowlist[0];
              this.state = sharevalue?.state?.name
              this.vendor = "(" + sharevalue?.vendor?.code + ") " + sharevalue?.vendor?.name
              this.year = sharevalue?.year
              this.approval_status = sharevalue?.approval_status?.status
            })


        } else {
          this.notification.showError(res.description)
        }
        return true
      })
  }


  employeeList_HD: any
  holidayhistoryData: any

  approvalFlow_HD(data) {
    let atten_id = data.id
    if (atten_id == undefined) {
      return false
    }
    this.sgservice.getholidayHistory(atten_id)
      .subscribe(result => {
        this.holidayhistoryData = result.data;
      })
  }

  //approval branch

  appBranchList_HD: any
  approvalBranchClick_HD() {
    let approvalbranchkeyvalue: String = "";
    this.getApprovalBranch_HD(approvalbranchkeyvalue);
    this.movetochekerform_HD.get('approval_branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.sgservice.getApprovalBranch(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.appBranchList_HD = datas;

      })

  }

  private getApprovalBranch_HD(approvalbranchkeyvalue) {
    this.sgservice.getApprovalBranch(approvalbranchkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.appBranchList_HD = datas;
      })
  }

  public displayFnappBranch_HD(branch?: approvalBranch_HD): string | undefined {

    return branch ? "(" + branch.code + " )" + branch.name : undefined;
  }

  appBranch_Id_ID = 0;
  FocusApprovalBranch_HD(data) {
    this.appBranch_Id_ID = data.id;
    this.getApprover_HD(data.id, '')
  }
  clearAppBranch_HD() {
    this.clear_appBranch_HD.nativeElement.value = '';
  }

  // appbranch based employee

  approvername_HD() {
    let approverkeyvalue: String = "";
    this.getApprover_HD(this.appBranch_Id_ID, approverkeyvalue);

    this.movetochekerform_HD.get('approver').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.sgservice.appBranchBasedEmployee(this.appBranch_Id_ID, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList_HD = datas;

      })

  }

  private getApprover_HD(id, approverkeyvalue) {
    this.sgservice.appBranchBasedEmployee(id, approverkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList_HD = datas;
      })
  }

  public displayFnEmployee_HD(employee?: approver_HD): string | undefined {
    return employee ? employee.full_name : undefined;
  }





  // approval branch
  currentpageappbranch_HD: any = 1
  has_nextappbranch_HD: boolean = true
  has_previousappbranch_HD: boolean = true
  autocompleteapprovalBranchScroll_HD() {

    setTimeout(() => {
      if (
        this.matAutocompleteappbranch_HD &&
        this.autocompleteTrigger &&
        this.matAutocompleteappbranch_HD.panel
      ) {
        fromEvent(this.matAutocompleteappbranch_HD.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompleteappbranch_HD.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompleteappbranch_HD.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteappbranch_HD.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteappbranch_HD.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextappbranch_HD === true) {
                this.sgservice.getApprovalBranch(this.appBranchInput_HD.nativeElement.value, this.currentpageappbranch_HD + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.appBranchList_HD = this.appBranchList_HD.concat(datas);
                    if (this.appBranchList_HD.length >= 0) {
                      this.has_nextappbranch_HD = datapagination.has_next;
                      this.has_previousappbranch_HD = datapagination.has_previous;
                      this.currentpageappbranch_HD = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  // Approver(employee) dropdown
  currentpageaddpay_HD: any = 1
  has_nextaddpay_HD: boolean = true
  has_previousaddpay_HD: boolean = true
  autocompleteapprovernameScroll_HD() {

    setTimeout(() => {
      if (
        this.matAutocompleteapprover_HD &&
        this.autocompleteTrigger &&
        this.matAutocompleteapprover_HD.panel
      ) {
        fromEvent(this.matAutocompleteapprover_HD.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompleteapprover_HD.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompleteapprover_HD.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteapprover_HD.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteapprover_HD.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextaddpay_HD === true) {
                this.sgservice.appBranchBasedEmployee(this.appBranch_Id_ID, this.ApproverContactInput_HD.nativeElement.value, this.currentpageaddpay_HD + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeeList_HD = this.employeeList_HD.concat(datas);
                    if (this.employeeList_HD.length >= 0) {
                      this.has_nextaddpay_HD = datapagination.has_next;
                      this.has_previousaddpay_HD = datapagination.has_previous;
                      this.currentpageaddpay_HD = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }


















  getholidayfile(val, pagenumber = 1) {
    this.sgservice.getholidayformdetails(val, pagenumber)
      .subscribe(result => {
        let datass = result['data'];
        this.fileoalist = datass;
        let datapagination = result["pagination"];
        if (this.fileoalist.length > 0) {

          this.has_nextholi = datapagination.has_next;
          this.has_previousholi = datapagination.has_previous;
          this.presentpageholi = datapagination.index;
          this.isHolidayPage = true;
        }
        if (this.fileoalist.length === 0) {
          this.isHolidayPage = false
        }
        this.send_value = ""
      })
  }
  has_nextholi = false
  has_previousholi = false
  presentpageholi = 1
  holinextClick() {


    if (this.has_nextholi === true) {
      this.getholidayfile(this.hasNextHDSearch_Page, this.presentpageholi + 1)
    }
  }

  holipreviousClick() {

    if (this.has_previousholi === true) {
      this.getholidayfile(this.hasNextHDSearch_Page, this.presentpageholi - 1)


    }
  }


  vendorid: any
  vendordtl(data) {
    if (data.approval_status.id == 0) {
      this.toastr.warning("Your Form is Already Rejected ");
      return false;
    }
    if (data.approval_status.id != 3) {
      this.toastr.warning("Please Get Approval");
      return false;
    }


    this.vendorid = data.id
    let vendorrid = data.vendor.id
    this.shareservice.vendormappingdetails.next(data)
    this.isvendormarkup = false;
    this.isVM_AddEdit_Form = false;
    this.isVM_viewForm = true;
    // this.router.navigate(['SGmodule/premiseadd'], { skipLocationChange: true })
  }
  PremiseaddForm() {
    this.premiseform.patchValue({
      premise_id: this.premiseform.value.premise_id.id,
      type_id: this.premiseform.value.type_id.id
    })
    if (this.idValue == undefined) {
      this.sgservice.premiseaddform(this.vendorid, this.premiseform.value, '')
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")

          }
          else {
            this.notification.showSuccess("Successfully Created..")
            this.getparticularpremise();



          }

        })
    }
    else {
      this.sgservice.premiseaddform(this.vendorid, this.premiseform.value, this.idValue)
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          }
          else {
            this.notification.showSuccess("Successfully Updated...")

          }
        })
    }


  }
  employeetypelist: any
  employeetypename() {

    let prokeyyvalue: String = "";
    this.getcatven(prokeyyvalue);
    this.premiseform.get('type_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.sgservice.getemployeetypedropdown(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeetypelist = datas;
      })

  }
  private getcatven(prokeyyvalue) {
    this.sgservice.getemployeetypedropdown(prokeyyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeetypelist = datas;

      })
  }

  public displaydiss(employetype?: employeetypelistss): string | undefined {



    return employetype ? employetype.emptype : undefined;

  }
  premiselist: any
  getparticularpremise(pagenumber = 1, pagesize = 10) {

    this.sgservice.getparticularpremise(this.vendorid, pagenumber)
      .subscribe((result) => {

        let datas = result['data'];
        let datapagination = result["pagination"];
        this.premiselist = datas;
        if (this.premiselist.length >= 0) {
          this.has_nexttype = datapagination.has_next;
          this.has_previoustype = datapagination.has_previous;
          this.presentpagetype = datapagination.index;
        }

      })

  }
  EmployeeaddForm() {
    this.Employeeaddform.patchValue({
      premise_id: this.Employeeaddform.value.premise_id.id,
      branch_id: this.Employeeaddform.value.branch_id.id
    })

    if (this.idValue == undefined) {
      this.sgservice.Employeeaddform(this.Employeeaddform.value, '')
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")

          }
          else {
            this.notification.showSuccess("Successfully Created..")
            this.getEmployeeList()


          }

        })
    }
    else {
      this.sgservice.Employeeaddform(this.Employeeaddform.value, this.idValue)
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          }
          else {
            this.notification.showSuccess("Successfully Updated...")

          }
        })
    }


  }

  Count: any
  employelistid: any
  employeepremise(data) {
    let vendordata = data.vendor_id
    this.employelistid = data.id
    this.Count = data.count
    this.getEmployeeList();

  }

  // }
  employeelist: any
  getEmployeeList(pagenumber = 1, pagesize = 10) {

    this.sgservice.getEmployeeList(pagenumber, pagesize, this.vendorid)
      .subscribe((result) => {
        this.employeelist = result['data']?.length;
        if (this.employeelist === this.Count) {
          this.countlen = false

        }
        else {
          this.countlen = true
        }
        let datas = result['data'];
        let datapagination = result["pagination"];
        this.employeelist = datas;
        // if (this.premiselist.length >= 0) {
        //   this.has_nexttype = datapagination.has_next;
        //   this.has_previoustype = datapagination.has_previous;
        //   this.presentpagetype= datapagination.index;
        // }

      })

  }
  branchname() {
    let prokeyvalue: String = "";
    this.getbranchid(prokeyvalue);
    this.Employeetypeform.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.sgservice.getbranchdropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;

      })


  }
  private getbranchid(prokeyvalue) {
    this.sgservice.getbranchdropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;

      })
  }

  public displaydiss2(branchtype?: branchList): string | undefined {



    return branchtype ? branchtype.name : undefined;

  }






  // mimimumwages display
  oncancelclick1() {
    this.movetochekerform.patchValue({
      approver: '',
      remarks: '',
      approval_branch: '',
      // patch1:''
    })
    this.approverform.patchValue({
      remarks: ''
    })
    this.reviewform.patchValue({
      remarks: ''
    })
    this.rejectedform.patchValue({
      remarks: ''
    })

  }


  movetoapprove() {
    if (this.movetochekerform.value.approval_branch.id === undefined || this.movetochekerform.value.approval_branch === '') {
      this.toastr.warning('', 'Please Select any one Approver Branch', { timeOut: 1500 });
      return false
    }
    if (this.movetochekerform.value.approver.id === undefined || this.movetochekerform.value.approver === '') {
      this.toastr.warning('', 'Please Select Any one Approver', { timeOut: 1500 });
      return false
    }
    if (this.movetochekerform.value.remarks == '') {
      this.toastr.warning('', 'Please Enter the Remarks', { timeOut: 1500 });
      return false
    }

    this.movetochekerform.patchValue({
      status: 2,
      // approval_branch:this.movetochekerform.value.approval_branch.id,
      // approver:this.movetochekerform.value.approver.id,

    })
    this.movetochekerform.value.approval_branch = this.movetochekerform.value.approval_branch.id,
      this.movetochekerform.value.approver = this.movetochekerform.value.approver.id,

      this.sgservice.Attendance_status(this.movetochekerform.value, this.vendoridapproval)
        .subscribe(res => {
          if (res.status == "success") {
            this.notification.showSuccess("Moved to Approver!...")
            this.getvendordetails('', 1)
            this.makerchecker.nativeElement.click();


          } else {
            this.notification.showError(res.description)
          }
          return true
        })


  }

  ApproverPopupForm() {

    if (this.approverform.value.remarks == '') {
      this.toastr.warning('', 'Please Enter the Remarks', { timeOut: 1500 });
      return false
    }

    this.approverform.patchValue({
      status: 3,

    })
    this.sgservice.Attendance_status(this.approverform.value, this.vendoridapproval)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Approved Successfully!...")

          this.getvendordetails('', 1)
          this.addaprover.nativeElement.click();

        } else {
          this.notification.showError(res.description)
        }
        return true
      })
  }
  rejectPopupForm() {
    if (this.rejectedform.value.remarks == '') {
      this.toastr.warning('', 'Please Enter the Remarks', { timeOut: 1500 });
      return false
    }
    this.rejectedform.patchValue({
      status: 0,

    })
    this.sgservice.Attendance_status(this.rejectedform.value, this.vendoridapproval)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Rejected!...")
          this.getvendordetails('', 1)

          this.rejected.nativeElement.click();

        } else {
          this.notification.showError(res.description)
        }
        return true
      })
  }
  reviewPopupForm() {
    if (this.reviewform.value.remarks == '') {
      this.toastr.warning('', 'Please Enter the Remarks', { timeOut: 1500 });
      return false
    }
    this.reviewform.patchValue({
      status: 4,

    })

    this.sgservice.Attendance_status(this.reviewform.value, this.vendoridapproval)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Reviewed!...")

          this.getvendordetails('', 1)
          this.review.nativeElement.click();

        } else {
          this.notification.showError(res.description)
        }
        return true
      })
  }



  historyData: any

  approvalFlow(data) {
    let atten_id = data.id
    if (atten_id == undefined) {
      return false
    }
    this.SpinnerService.show()
    this.sgservice.getvendorHistory(atten_id)
      .subscribe(result => {
        this.historyData = result.data;
        this.SpinnerService.hide()
      })
  }
  onChange(event,data) {
    if (event.checked) {
      this.toggletype=1;
      console.log(1);
    } else {
      this.toggletype=-1;
      console.log(2);
    }
    this.UpdateDeactivateStatus(data)
  }

  UpdateDeactivateStatus(data) {
    let vendorid = data.id
    if (vendorid == undefined) {
      return false
    }
    if(data.status.id===1){
      var answer = window.confirm("Deactivate?  " + data.vendor.name);
    }
    else{
      var answer = window.confirm("Activate?  " + data.vendor.name);
    }
   
    if (answer === false) {
      this.getvendordetails('', 1)
      return false;
    }
    let vendordata = {
      "id": vendorid, "status": this.toggletype
    }
    this.SpinnerService.show()
    this.sgservice.vendormarkupDeactivate(vendordata)
      .subscribe(result => {
        this.SpinnerService.hide()
        if (result.code ) {
          this.notification.showError(result.description)
          this.getvendordetails('', 1)

        }
        else {
          this.notification.showSuccess(result.message)
          this.getvendordetails('', 1)

        }
      })
  }


  approve(data) {
    this.movetochekerform.patchValue({
      approval_branch: data.branch_id,
      patch1: data.branch_code + "-" + data.branch_name
    })


  }

  vendoridapproval: any
  vendoradd(data) {
    this.vendoridapproval = data.id
  }


  //vm-vendor search
  vendor_VM_List: any;
  vendor_Vm() {

    let prokeyvalue: String = "";
    this.getVM(prokeyvalue);
    this.vendormarkupSearchForm.get('vendor').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.sgservice.getvendordropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.vendor_VM_List = datas;

      })

  }
  private getVM(prokeyvalue) {
    this.sgservice.getvendordropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.vendor_VM_List = datas;

      })
  }

  public displayVendor_VM(producttype?: productlistss1): string | undefined {
    // return producttype ? producttype.name : undefined;
    return producttype ? "(" + producttype.code + ") " + producttype.name : undefined;

  }



  empvendorlist: any
  productname1() {

    let prokeyvalue: String = "";
    this.getcatven1(prokeyvalue);
    this.holidayform.get('vendor_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.sgservice.getvendordropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.empvendorlist = datas;
      })

  }
  private getcatven1(prokeyvalue) {
    this.sgservice.getvendordropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.empvendorlist = datas;

      })
  }

  public displaydis2(producttype?: productlistss1): string | undefined {
    // return producttype ? producttype.name : undefined;
    return producttype ? "(" + producttype.code + ") " + producttype.name : undefined;

  }

  dropdownstate: any
  statename() {
    let prokeyvalue: String = "";
    this.getstate(prokeyvalue);
    this.holidayform.get('state_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.sgservice.getStatezonesearch(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        for (let i = 0; i < datas.length; i++) {
          const Date = datas[i].effectivefrom
          let fromdate = this.datepipe.transform(Date, 'dd-MMM-yyyy');
          datas[i].name = datas[i].name + " (" + fromdate + ")"
        }
        this.dropdownstate = datas;

      })

  }
  private getstate(prokeyvalue) {
    this.sgservice.getStatezonesearch(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        for (let i = 0; i < datas.length; i++) {
          const Date = datas[i].effectivefrom
          let fromdate = this.datepipe.transform(Date, 'dd-MMM-yyyy');
          datas[i].name = datas[i].name + " (" + fromdate + ")"
        }
        this.dropdownstate = datas;

      })
  }

  public displaydis1(producttype?: statezonelist1): string | undefined {
    return producttype ? producttype.name : undefined;

  }


  // vendor dropdown

  currentpageven: any = 1
  shas_nextven: boolean = true
  shas_previousven: boolean = true
  autocompleteVendornameScroll() {

    setTimeout(() => {
      if (
        this.matAutocompletevendor &&
        this.autocompleteTrigger &&
        this.matAutocompletevendor.panel
      ) {
        fromEvent(this.matAutocompletevendor.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletevendor.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletevendor.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletevendor.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletevendor.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.shas_nextven === true) {
                this.sgservice.getvendordropdown(this.VendorContactInput.nativeElement.value, this.currentpageven + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.empvendorlist = this.empvendorlist.concat(datas);
                    if (this.empvendorlist.length >= 0) {
                      this.shas_nextven = datapagination.has_next;
                      this.shas_previousven = datapagination.has_previous;
                      this.currentpageven = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  // State dropdown
  currentpageste: any = 1
  shas_nextsta: boolean = true
  shas_previoussta: boolean = true
  autocompleteStatenameScroll() {

    setTimeout(() => {
      if (
        this.matAutocompletestate &&
        this.autocompleteTrigger &&
        this.matAutocompletestate.panel
      ) {
        fromEvent(this.matAutocompletestate.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletestate.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletestate.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletestate.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletestate.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.shas_nextsta === true) {
                this.sgservice.getStatezonesearch(this.StateContactInput.nativeElement.value, this.currentpageste + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    for (let i = 0; i < datas.length; i++) {
                      const Date = datas[i].effectivefrom
                      let fromdate = this.datepipe.transform(Date, 'dd-MMM-yyyy');
                      datas[i].name = datas[i].name + " (" + fromdate + ")"
                    }
                    let datapagination = results["pagination"];
                    this.dropdownstate = this.dropdownstate.concat(datas);
                    if (this.dropdownstate.length >= 0) {
                      this.shas_nextsta = datapagination.has_next;
                      this.shas_previoussta = datapagination.has_previous;
                      this.currentpageste = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  // vendor search VM dropdown

  currentpageVM: any = 1
  shas_nextVM: boolean = true
  shas_previousVM: boolean = true
  autocompleteVMScroll() {

    setTimeout(() => {
      if (
        this.matAutocompletevendor_VM &&
        this.autocompleteTrigger &&
        this.matAutocompletevendor_VM.panel
      ) {
        fromEvent(this.matAutocompletevendor_VM.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletevendor_VM.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletevendor_VM.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletevendor_VM.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletevendor_VM.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.shas_nextVM === true) {
                this.sgservice.getvendordropdown(this.Vendor_VMContactInput.nativeElement.value, this.currentpageVM + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.vendor_VM_List = this.vendor_VM_List.concat(datas);
                    if (this.vendor_VM_List.length >= 0) {
                      this.shas_nextVM = datapagination.has_next;
                      this.shas_previousVM = datapagination.has_previous;
                      this.currentpageVM = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }


  resettheholidayform() {
    this.send_value = ""
    this.hasNextHDSearch_Page = ""
    this.holidayform = this.fb.group({
      vendor_id: [''],
      state_id: [''],
      year: ['']
    })
    this.presentpageholi = 1
    this.getholidayfile(this.send_value, this.presentpageholi);
    // this.holidayform.reset();
  }
  onsearch = false

  vendor_id: number;
  state_id: number;

  send_value: String = ""
  hasNextHDSearch_Page: any = ""
  Onserachhoildaydetails() {
    // let url;
    // let formvalue=this.holidayform.value

    // let vendor_id=formvalue.vendor_id.id;
    // let state_id=formvalue.state_id.id;
    // let year=formvalue.year
    // year= this.datepipe.transform(year,"yyyy")

    // if (this.holidayform.value.vendor_id != null){
    //   this.vendor_id = this.holidayform.value.vendor_id.id

    //   } else {
    //     this.vendor_id= null;
    //   }

    //   if (this.holidayform.value.state_id != null){
    //   this.state_id = this.holidayform.value.state_id.id

    //   } else {
    //     this.state_id  = null;
    //   }


    // let val = ''
    // let year1;
    // if (formvalue.year=='')
    // {
    //   year1=false
    // }
    // else{
    //   year1=true
    // }

    // if(year){
    //   if (val == ''){
    //     val = '?year=' + year
    //   }else{
    //     val = val +'&year=' + year
    //   }

    // } if(this.vendor_id){
    //   if (val == ''){
    //     val = '?vendor_id=' +this.vendor_id
    //   }else{
    //     val = val +'&vendor_id=' + this.vendor_id
    //   }

    // } if(this.state_id){
    //   if (val == ''){
    //     val = '?state_id=' + this.state_id
    //   }else{
    //     val = val +'&state_id=' + this.state_id
    //   }

    // }


    // this.sgservice.Searchholidayformdetails(this.presentpageholi, val)
    //   .subscribe(result => {
    //     let datass = result['data'];
    //     this.fileoalist=datass;
    //     let datapagination = result["pagination"];
    //     if (this.fileoalist.length >= 0) {

    //       this.has_nextholi = datapagination.has_next;
    //       this.has_previousholi = datapagination.has_previous;
    //       this.presentpageholi= datapagination.index;
    //     }
    //     this.onsearch=true
    //   })

    let form_value = this.holidayform.value;

    if (form_value.vendor_id != "") {
      this.send_value = this.send_value + "&vendor_id=" + form_value.vendor_id.id
    }
    if (form_value.state_id != "") {
      this.send_value = this.send_value + "&state_id=" + form_value.state_id.id
    }
    if (form_value.year != "") {
      let year_holiday = this.datepipe.transform(form_value.year, "yyyy")
      this.send_value = this.send_value + "&year=" + year_holiday
    }
    this.hasNextHDSearch_Page = this.send_value
    this.presentpageholi = 1
    this.getholidayfile(this.send_value, this.presentpageholi);
  }


  // 
  downloadholidaysampledata() {
    this.sgservice.holidaysmampledownload().subscribe((result) => {
      let data = result

      let binaryData = [];
      binaryData.push(data)

      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "Holidaymastersampledata.xlsx";
      link.click();
    })
  }

  getMyStyles(arg) {
    let Draft = {
      'background-color': '#aab3be'
    };
    let pendingapprival = {
      'background-color': '#aab3be',
      'width': '162px'
    };
    let aprroved = {
      'background-color': '#00c353'
    };

    let return1 = {
      'background-color': '#ffb52a'
    };
    let reject = {
      'background-color': '#eb372b'
    };

    switch (arg) {
      case 1:
        return Draft;
      case 2:
        return pendingapprival;
      case 3:
        return aprroved;
      case 4:
        return return1;
      case 5:
        return reject;
      default:
        return Draft;
    }


  }


  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (event.keyCode == 32) {
      return true;
    }
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      this.toastr.warning('', 'Please Enter the Number only', { timeOut: 1500 });
      return false;
    } else {
      return true;
    }
  }
  keyPressAlpha(event) {

    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z]/.test(inp) || event.keyCode == 32) {
      return true;
    } else {
      event.preventDefault();
      this.toastr.warning('', 'Please Enter the Letter only', { timeOut: 1500 });
      return false;

    }
  }
  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9]/.test(inp) || event.keyCode == 32) {
      return true;
    } else {
      event.preventDefault();
      this.toastr.warning('', 'Don\'t Use Extra character ', { timeOut: 1500 });
      return false;

    }
  }





  //approval branch

  appBranchList: any
  approvalBranchClick() {
    let approvalbranchkeyvalue: String = "";
    this.getApprovalBranch(approvalbranchkeyvalue);
    this.movetochekerform.get('approval_branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;

        }),
        switchMap(value => this.sgservice.getApprovalBranch(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.appBranchList = datas;

      })

  }

  private getApprovalBranch(approvalbranchkeyvalue) {
    this.sgservice.getApprovalBranch(approvalbranchkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.appBranchList = datas;
      })
  }

  public displayFnappBranch(branch?: approvalBranch): string | undefined {

    return branch ? "(" + branch.code + " )" + branch.name : undefined;
  }

  appBranch_Id = 0;
  FocusApprovalBranch(data) {
    this.appBranch_Id = data.id;
    this.getApprover(data.id, '')
  }
  clearAppBranch() {
    this.clear_appBranch.nativeElement.value = '';
  }

  // appbranch based employee
  employeeList: any;
  approvername() {
    let approverkeyvalue: String = "";
    this.getApprover(this.appBranch_Id, approverkeyvalue);

    this.movetochekerform.get('approver').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.sgservice.appBranchBasedEmployee(this.appBranch_Id, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;

      })

  }
  deleteholiday(holiday){
    this.SpinnerService.show()
     this.sgservice.holidaydelete(holiday.id).subscribe((result) => {
      this.SpinnerService.hide()
      if (result.status== "success"){
        this.notification.showSuccess(result.message)
        this.getholidayfile(this.send_value, this.presentpageholi)
      }
    
    })
    

  }

  private getApprover(id, approverkeyvalue) {
    this.sgservice.appBranchBasedEmployee(id, approverkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;
      })
  }

  public displayFnEmployee(employee?: approver): string | undefined {
    return employee ? employee.full_name : undefined;
  }





  // approval branch
  currentpageappbranch: any = 1
  has_nextappbranch: boolean = true
  has_previousappbranch: boolean = true
  autocompleteapprovalBranchScroll() {

    setTimeout(() => {
      if (
        this.matAutocompleteappbranch &&
        this.autocompleteTrigger &&
        this.matAutocompleteappbranch.panel
      ) {
        fromEvent(this.matAutocompleteappbranch.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompleteappbranch.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompleteappbranch.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteappbranch.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteappbranch.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextappbranch === true) {
                this.sgservice.getApprovalBranch(this.appBranchInput.nativeElement.value, this.currentpageappbranch + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.appBranchList = this.appBranchList.concat(datas);
                    if (this.appBranchList.length >= 0) {
                      this.has_nextappbranch = datapagination.has_next;
                      this.has_previousappbranch = datapagination.has_previous;
                      this.currentpageappbranch = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  // Approver(employee) dropdown
  currentpageaddpay: any = 1
  has_nextaddpay: boolean = true
  has_previousaddpay: boolean = true
  autocompleteapprovernameScroll() {

    setTimeout(() => {
      if (
        this.matAutocompleteapprover &&
        this.autocompleteTrigger &&
        this.matAutocompleteapprover.panel
      ) {
        fromEvent(this.matAutocompleteapprover.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompleteapprover.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompleteapprover.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteapprover.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteapprover.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextaddpay === true) {
                this.sgservice.appBranchBasedEmployee(this.appBranch_Id, this.ApproverContactInput.nativeElement.value, this.currentpageaddpay + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeeList = this.employeeList.concat(datas);
                    if (this.employeeList.length >= 0) {
                      this.has_nextaddpay = datapagination.has_next;
                      this.has_previousaddpay = datapagination.has_previous;
                      this.currentpageaddpay = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
}



class ctrlofztype {

  emptype: any;
  emptypedesc: any;

  empcat_id: any
}


