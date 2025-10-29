import { Component, ComponentFactoryResolver, OnInit, QueryList, ViewChildren, ViewChild, ViewContainerRef,HostListener, Output, EventEmitter} from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/service/shared.service';
import { ShareService } from 'src/app/ta/share.service';
import { TaService } from "../ta.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { TourmakerSummaryComponent } from '../tourmaker-summary/tourmaker-summary.component'
import { TourapprovalSummaryComponent } from '../tourapproval-summary/tourapproval-summary.component'
import { AdvancemakerSummaryComponent } from '../advancemaker-summary/advancemaker-summary.component'
import { AdvanceapprovalSummaryComponent } from '../advanceapproval-summary/advanceapproval-summary.component'
import { ExpensemakerSummaryComponent } from '../expensemaker-summary/expensemaker-summary.component'
import { ExpenseapprovalSummaryComponent } from '../expenseapproval-summary/expenseapproval-summary.component'
import { CancelmakerSummaryComponent } from '../cancelmaker-summary/cancelmaker-summary.component'
import { ActivatedRoute, Router } from "@angular/router";
import { CancelapprovalSummaryComponent } from '../cancelapproval-summary/cancelapproval-summary.component'
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Observable, fromEvent } from 'rxjs';
import { filter, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { AssignApproverComponent } from '../assign-approver/assign-approver.component';
import { TaRecoveryComponent } from '../ta-recovery/ta-recovery.component';
import { LocalStorage } from '@ng-idle/core';
import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';
import { ApUserSummaryComponent } from '../ap-user-summary/ap-user-summary.component';
import { NotificationService } from '../notification.service';
import { TourReportComponent } from '../tour-report/tour-report.component';
import { TaReportComponent } from '../ta-report/ta-report.component';
import { ReportComponent } from '../report/report.component';
export interface controllingOffice {
  id: string;
  name: string;
  code: string;
}
@Component({
  selector: 'app-ta-transaction-summary',
  templateUrl: './ta-transaction-summary.component.html',
  styleUrls: ['./ta-transaction-summary.component.scss']
})

export class TaTransactionSummaryComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.spinnerservice.hide();
    }
  }
  @ViewChild('closebutton') closebutton;

  istourmakersmry: boolean
  istouraprlsmry: boolean
  isadvancemakersmry: boolean
  isadvanceaprlsmry: boolean
  isexpensemakersmry: boolean
  isexpesneaprlsmry: boolean
  iscancelmakersmry: boolean
  iscancelaprlsmry: boolean
  taonbehalfForm: FormGroup

  taTransactionList = [
    { name: "Tour ID Creation", index: 1, component: TourmakerSummaryComponent },
    { name: "Tour ID Approval", index: 2, component: TourapprovalSummaryComponent },
    { name: "Advance Request", index: 3, component: AdvancemakerSummaryComponent },
    { name: "Advance Approval", index: 4, component: AdvanceapprovalSummaryComponent },
    { name: "Claim Submission", index: 5, component: ExpensemakerSummaryComponent },
    { name: "Claim Approval", index: 6, component: ExpenseapprovalSummaryComponent },
    { name: "Cancel Request", index: 7, component: CancelmakerSummaryComponent },
    { name: "Cancel Approval", index: 8, component: CancelapprovalSummaryComponent },
    { name: "Assign Approver", index: 9, component: AssignApproverComponent },
    { name: "Advance Recovery ", index: 10, component: TaRecoveryComponent },
    { name: "Settlement Approval", index: 11, component: ApUserSummaryComponent },
    { name: "Tour Report", index: 12, component: ReportComponent },
  ];
  radiocheck: any[] = [
    { value: 1, display: 'Self' },
    { value: 0, display: 'Onbehalf' }
  ]
  showradiobtn = false;
  activeItem: string;
  closeResult: string;
  activeComponent: any;
  tabs = [];
  showpopup: boolean = true;
  onbehalf: any;
  ishidden: boolean = false;
  listBranch: Array<any>
  branchlist: Array<any>;
  statuslist: any;
  isassignapprover: boolean;
  isrecovery: boolean;
  isApUser: boolean;
  isreport: boolean = false;
  radiovalue: any
  button: string;
  report: any;
  employeeid: any;
  useraccess: any;
  travelrole: any;
  showtravel: boolean = false;
  showexpense: boolean = false;
  expenserole: any;
  showadvance: boolean = false;
  advancerole: any;
  showcancel: boolean = false;
  cancelrole: any;
  assignrole: any;
  recoveryrole: any;
  apuserrole: any;
  reportrole: any;
  permissionlist = [];
  permittedlist: any;
  showheader: boolean;
  headrole: any;
  submiton: boolean = false;
  radiovaluecheck: boolean = false;

  constructor(private shareservice: ShareService, private spinnerservice: NgxSpinnerService,
    private componentFactoryResolver: ComponentFactoryResolver, private taservice: TaService,
    private modalService: NgbModal, private router: Router, private notification: NotificationService,

    public SharedService: SharedService, private fb: FormBuilder) { }




  branchdata: Array<controllingOffice>;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('conoffice') matofficeAutocomplete: MatAutocomplete;
  @ViewChild('empc') matemployeeautocomplete: MatAutocomplete;
  @ViewChild('empInput') empInput: any;
  @ViewChild('branchInput') branchInput: any;
  // @ViewChild('closebutton') closebutton; 
  onbehalfmodel: any;
  has_offnext = true;
  has_offprevious = true;
  offcurrentpage: number = 1;
  isLoading = false;
  empList: any
  onbehalfList: any;
  showdisabled = true;
  branchList: any;
  branchid: any;
has_empNext =true;
has_empPrevious =true
empcurrentPage : number=1;
  ngOnInit(): void {

    let userdata = this.SharedService.transactionList;
    this.shareservice.is_admin_approve.next(false)
    console.log(userdata);
    userdata.forEach(element => {
      if (element.name == 'TA e-Claim') {
        this.useraccess = element.submodule
      }
    })
    if (this.useraccess) {
      this.useraccess.forEach(element => {
        if (element.name.toLowerCase() == 'tour') {
          this.showtravel = true;
          this.travelrole = element.role;
        }

        else if (element.name.toLowerCase() == 'expense') {
          this.showexpense = true;
          // this.tabs.push({ ind: 2, index: 2, name: 'Expense' })
          this.expenserole = element.role;
        }
        else if (element.name.toLowerCase() == 'advance') {
          this.showadvance = true;
          // this.tabs.push({ ind: 2, index: 2, name: 'Expense' })
          this.advancerole = element.role;
        }
        else if (element.name.toLowerCase() == 'cancel') {
          this.showcancel = true;
          this.cancelrole = element.role;
        }
        else if (element.name.toLowerCase() == 'recovery') {
          this.recoveryrole = element.role;
        }
        else if (element.name.toLowerCase() == 'assign') {
          this.assignrole = element.role;
        }
        else if (element.name.toLowerCase() == 'apuser') {
          this.apuserrole = element.role;
        }
        else if (element.name.toLowerCase() == 'report') {
          this.reportrole = element.role;
        }
      });
    }
    if (this.travelrole) {
      this.travelrole.forEach(element => {
        if (element.name.toLowerCase() == 'maker') {
          // 1357
          this.permissionlist = this.permissionlist.concat(1,3,5,7)
        }
        else if (element.name.toLowerCase() == 'checker') {
          this.permissionlist = this.permissionlist.concat(2)
          //2
        }
        // else if (element.name.toLowerCase() == 'header') {
        // this.permissionlist = this.permissionlist.concat(9)
        // //2
        // }
      })
    }
    if (this.expenserole) {
      // this.executed = false;
      // this.expactionlist = [];
      this.expenserole.forEach(element => {
        if ((element.name.toLowerCase() == 'checker')) {
          this.permissionlist = this.permissionlist.concat(6)
        }

      })
    }

    if (this.advancerole) {
      this.advancerole.forEach(element => {
        if (element.name.toLowerCase() == 'checker') {
          this.permissionlist = this.permissionlist.concat(4)
        }
      })
    }

    if (this.cancelrole) {
      this.cancelrole.forEach(element => {
        if (element.name.toLowerCase() == 'checker') {
          this.permissionlist = this.permissionlist.concat(8)
        }
      })
    }
    if (this.recoveryrole) {
      this.recoveryrole.forEach(element => {
        if (element.name.toLowerCase() == 'checker') {
          this.permissionlist = this.permissionlist.concat(10)
          this.shareservice.Recovery_checker.next(true)
        }
        else if (element.name.toLowerCase() == 'maker') {
          this.permissionlist = this.permissionlist.concat(10)
          this.shareservice.Recovery_maker.next(true)
        }
      })
    }
    if (this.assignrole) {
      this.assignrole.forEach(element => {
        if (element.name.toLowerCase() == 'checker') {
          this.permissionlist = this.permissionlist.concat(9)
        }
        if (element.name.toLowerCase() == 'admin') {
          this.shareservice.is_admin_approve.next(true)
        }
      })
    }
    if (this.apuserrole) {
      this.apuserrole.forEach(element => {
        if (element.name.toLowerCase() == 'checker') {
          this.permissionlist = this.permissionlist.concat(11)
        }
      })
    }
    if (this.reportrole) {
      this.reportrole.forEach(element => {
        if (element.name.toLowerCase() == 'checker') {
          this.permissionlist = this.permissionlist.concat(12)
        }
      })
    }
    this.permittedlist = this.taTransactionList
    for (let i = 0; i < 12; i++) {
      let value = this.taTransactionList[i].index;
      if (this.permissionlist.includes(value)) {

      }
      else {
        this.permittedlist = this.permittedlist.filter(function (element) {
          return element.index != value;
        })
      }
    }


    if (this.radiovaluecheck) {
      this.shareservice.radiovalue.next('1')
    }
    else {
      this.shareservice.radiovalue.next('')
    }
    this.taservice.getemployeesdetails()
      .subscribe((results) => {
        console.log("results", results)
        this.employeeid = results['employee_branch_id']
      })
    // return data;

    this.onbehalf = {
      approval: '',
      branch: '',
      self: '',
      onhalf: ''

    }
    this.getbranchValue();
    this.taonbehalfForm = this.fb.group({

      branch: ['', Validators.required],
      employee: ['', Validators.required],
      status: [''],

    })
    this.getbranches();


    let officekeyvalue: String = "";
    this.getConOffice(officekeyvalue);
    this.taonbehalfForm.get('employee').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.taservice.getonbehalfemployee(value, this.branchid,1))
      )
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.empList = datas;
        console.log("Employee List", this.empList)
      });
    this.taonbehalfForm.get('branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.taservice.getUsageCode(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchdata = datas;
      })

    this.spinnerservice.show()
    this.taservice.getonbehalfSummary()
      .subscribe(result => {
        this.statuslist = result.status

        localStorage.setItem('onbehalfpopup', JSON.stringify(result))
        if (this.statuslist == "true") {
          this.showpopup = true
        }
        this.spinnerservice.hide();
      })
      var pagestate = sessionStorage.getItem('pagestate');
      if (pagestate) {
        let pages = JSON.parse(atob(pagestate));
        if (this.permissionlist.includes(pages.index)){
          this.subModuleData(pages);
        }
        // if (pages.index == 1){
        //   this.radiovaluecheck = true;
        // }
  
      }
      else {
        let data = this.SharedService.summaryData.value;
        this.subModuleData(data)
        this.shareservice.TourMakerEditId.next(data)
      }
  }


  public displayfnbranch(conoffice?: controllingOffice): string | undefined {
    return conoffice ? "(" + conoffice.code + ") " + conoffice.name : undefined;
  }

  get conoffice() {
    return this.taonbehalfForm.value.get('branch');
  }

  private getConOffice(officekeyvalue) {
    this.taservice.getusageSearchFilter(officekeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchdata = datas;

      })
  }


  branchScroll() {
    setTimeout(() => {
      if (
        this.matofficeAutocomplete &&
        this.autocompleteTrigger &&
        this.matofficeAutocomplete.panel
      ) {
        fromEvent(this.matofficeAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matofficeAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matofficeAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matofficeAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matofficeAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_offnext === true) {
                this.taservice.getUsageCode(this.branchInput.nativeElement.value, this.offcurrentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchdata = this.branchdata.concat(datas);
                    // if (this.branchdata.length >= 0) {
                    //   this.has_offnext = datapagination.has_next;
                    //   this.has_offprevious = datapagination.has_previous;
                    //   this.offcurrentpage = datapagination.index;
                    // }
                  })
              }
            }
          });
      }
    });
  }

  employeeScroll() {
    setTimeout(() => {
      if (
        this.matemployeeautocomplete &&
        this.autocompleteTrigger &&
        this.matemployeeautocomplete.panel
      ) {
        fromEvent(this.matemployeeautocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matemployeeautocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matemployeeautocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matemployeeautocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matemployeeautocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_empNext === true) {
                this.taservice.getonbehalfemployee(this.empInput.nativeElement.value,this.branchid, this.empcurrentPage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.empList = this.empList.concat(datas);
                    if (this.empList.length >= 0) {
                      this.has_empNext = datapagination.has_next;
                      this.has_empPrevious = datapagination.has_previous;
                      this.empcurrentPage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  permissions(index) {
    if (this.permissionlist.includes(index)) {
      return true;
    }
    else {
      return false;
    }
  }

  subModuleData(data) {
    let state = Object.assign({}, data)
    sessionStorage.setItem('pagestate', btoa(JSON.stringify(state)));
    console.log("val", this.shareservice.radiovalue.value)
    localStorage.removeItem('tourmakersummary')
    localStorage.removeItem('onbehalf')
    localStorage.removeItem('advancemakersummary')
    localStorage.removeItem('expense_details')
    localStorage.removeItem('tour_details')
    // this.spinnerservice.show()

    this.istourmakersmry = false
    this.istouraprlsmry = false
    this.isadvancemakersmry = false
    this.isadvanceaprlsmry = false;
    this.isexpensemakersmry = false
    this.isexpesneaprlsmry = false
    this.iscancelmakersmry = false
    this.iscancelaprlsmry = false
    this.isassignapprover = false
    this.isrecovery = false;
    this.isApUser = false;
    this.submiton = false;
    this.showpopup = false;
    this.isreport = false;

    if (data.index == 1) {
      console.log("hai")
      if (this.statuslist == true) {
        this.showpopup = true;

      } else {
        this.shareservice.radiovalue.next('1')
        // this.router.navigateByUrl('ta/toursummary');
        this.submiton = true;
        this.showpopup = false;
      }
      this.istourmakersmry = true

    }
    else if (data.index == 2) {

      this.istouraprlsmry = true



    }
    else if (data.index == 3) {
      if (this.statuslist == true) {
        this.showpopup = true;

      } else {
        this.showpopup = false;
        this.shareservice.radiovalue.next('1')
        this.submiton = true;
        // this.router.navigateByUrl('ta/advancemaker-summary');
        this.showpopup = false;
      }

      this.isadvancemakersmry = true

    }
    else if (data.index == 4) {

      this.isadvanceaprlsmry = true


    }
    else if (data.index == 5) {
      if (this.statuslist == true) {
        this.showpopup = true;
      } else {
        this.showpopup = false;
        this.shareservice.radiovalue.next('1')
        // this.router.navigateByUrl('ta/expense-summary')
        this.submiton = true;
      }

      this.isexpensemakersmry = true


    }
    else if (data.index == 6) {

      this.isexpesneaprlsmry = true



    }
    else if (data.index == 7) {
      if (this.statuslist == true) {
        this.showpopup = true;
      } else {
        this.showpopup = false;
        this.shareservice.radiovalue.next('1')
        // this.router.navigateByUrl('ta/cancelmaker');
        this.submiton = true;
      }

      this.iscancelmakersmry = true
    }
    else if (data.index == 8) {

      this.iscancelaprlsmry = true

    }
    else if (data.index == 8) {

      this.iscancelaprlsmry = true


    }

    else if (data.index == 9) {

      this.isassignapprover = true




    }

    else if (data.index == 10) {
      this.isrecovery = true;
      localStorage.setItem('recovery', this.employeeid)

    }
    else if (data.index == 11) {

      this.isApUser = true;

    }
    else if (data.index == 12) {
      this.isreport = true;
    }


  }
  displayFn(subject) {
    // return subject? '('+subject.onbehalf_employee_code+') '+subject.onbehalf_employee_name:undefined
    return subject ? "(" + subject.employee_code + ") " + subject.employee_name : undefined
  }
  getbranchValue() {
    this.taservice.getbranchValue()
      .subscribe(result => {
        this.branchlist = result['data']
        console.log("branchlist", this.branchlist)
      })
  }
  selectBranch(e) {
    console.log("e", e.value)
    let branchvalue = e.value
    this.taservice.setemployee(branchvalue)
      .subscribe(result => {
        this.listBranch = result
        console.log("employee", this.listBranch)
      })
  }
  radioButtonChanged($event) {
    let radioValue = event.target['value'];
    if (radioValue == 0) {
      this.ishidden = true;
    } else {
      this.shareservice.fetchValue.next(this.onbehalf);
      this.closebutton.nativeElement.click();
      // this.router.navigateByUrl('ta/advancemaker-summary');
      this.ishidden = false;
    }
  }
  submitAdvanceForm() {
    this.shareservice.fetchValue.next(this.onbehalf);
    this.closebutton.nativeElement.click();
    // this.router.navigateByUrl('ta/advancemaker-summary');
  }
  value: any
  data(n) {
    this.value = n.value
    this.shareservice.radiovalue.next(this.value)

    if (n.value === 1) {
      this.showradiobtn = false;
      this.showdisabled = true;
      this.closebutton.nativeElement.click();
      // this.router.navigateByUrl('ta/toursummary');
      this.submiton = true;

    }
    else {
      this.showradiobtn = true;
      this.showdisabled = false;
    }
  }
  canceldata(n) {
    this.value = n.value
    this.shareservice.radiovalue.next(this.value)
    if (n.value === 1) {
      this.showradiobtn = false;
      this.showdisabled = true;
      this.closebutton.nativeElement.click();
      this.submiton = true;
      // this.router.navigateByUrl('ta/cancelmaker');

    }
    else {
      this.showradiobtn = true;
      this.showdisabled = false;
    }
  }
  datas(n) {
    this.value = n.value
    this.shareservice.radiovalue.next(this.value)
    if (n.value === 1) {
      this.showradiobtn = false;
      this.showdisabled = true;
      this.closebutton.nativeElement.click();
      // this.router.navigateByUrl('ta/expense-summary');
      this.submiton = true;

    }
    else {
      this.showradiobtn = true;
      this.showdisabled = false;
    }
  }
  dataadvance(n, event) {

    this.value = n.value
    this.shareservice.radiovalue.next(this.value)
    if (n.value === 1) {
      this.radiovalue = null;
      this.showradiobtn = false;
      this.showdisabled = true;
      this.submiton = true;
      this.closebutton.nativeElement.click();
      // this.router.navigateByUrl('ta/advancemaker-summary')
    }
    else {
      this.showradiobtn = true;
      this.showdisabled = false;
    }
  }
  getbranches() {
    this.taservice.getbranchSummary()
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.branchList = datas;


      })
  }

  branchclick(id) {
    this.branchid = id
    console.log("this.branchid", this.branchid)
    if (this.taonbehalfForm.value.branch == "" || this.taonbehalfForm.value.branch == null) {
      this.notification.showError('Please Choose Branch')
      throw new Error;
    }
    this.taservice.getonbehalfemployee("", this.branchid,1)
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.empList = datas;
        console.log("Employee List", this.empList)
      });
  }


  name: any;
  id: any;
  result: any
  clickemp(id, name, emp) {


    this.name = name;
    this.id = id;
    this.result = emp;

    let employeejson: any = []
    employeejson = {
      "id": this.id,
      "name": this.name
    }
    console.log("employeejson", employeejson)
  }

  submitForm() {

    //Bug 7502 Fix ** Starts ** Developer: Hari ** Date:27/04/2023
    let statusValue = this.taonbehalfForm.value.status;

    console.log("STATUS VALUE", statusValue)
    
    if(statusValue == 0)
    {
      if (this.taonbehalfForm.value.branch == null || this.taonbehalfForm.value.branch == '') {
        this.notification.showError("Please Select Branch");
        throw new Error;
      }
      if (this.taonbehalfForm.value.employee == null || this.taonbehalfForm.value.employee == '') {
        this.notification.showError("Please Select Employee");
        throw new Error;
      }
    }
    //Bug 8368 Fix ** Ends ** Developer: Hari ** Date:27/04/2023
    if (this.value === 0) {
      // this.router.navigateByUrl('ta/toursummary');
      this.submiton = true;
      this.shareservice.fetchData.next(this.result);
      this.closebutton.nativeElement.click();
      this.taonbehalfForm.reset();
    }

  }
  submitForms() {
    //Bug 7502 Fix ** Starts ** Developer: Hari ** Date:27/04/2023
    let statusValue = this.taonbehalfForm.value.status;

    console.log("STATUS VALUE", statusValue)
    
    if(statusValue == 0)
    {
      if (this.taonbehalfForm.value.branch == null || this.taonbehalfForm.value.branch == '') {
        this.notification.showError("Please Select Branch");
        throw new Error;
      }
      if (this.taonbehalfForm.value.employee == null || this.taonbehalfForm.value.employee == '') {
        this.notification.showError("Please Select Employee");
        throw new Error;
      }
    }
    //Bug 8368 Fix ** Ends ** Developer: Hari ** Date:27/04/2023
    if (this.value === 0) {
      // this.router.navigateByUrl('ta/expense-summary');
      this.submiton = true;
      this.shareservice.fetchData.next(this.result);
      this.closebutton.nativeElement.click();
      this.taonbehalfForm.reset();
    }

  }
  submitcancel() {

       //Bug 7502 Fix ** Starts ** Developer: Hari ** Date:27/04/2023
       let statusValue = this.taonbehalfForm.value.status;

       console.log("STATUS VALUE", statusValue)
       
       if(statusValue == 0)
       {
         if (this.taonbehalfForm.value.branch == null || this.taonbehalfForm.value.branch == '') {
           this.notification.showError("Please Select Branch");
           throw new Error;
         }
         if (this.taonbehalfForm.value.employee == null || this.taonbehalfForm.value.employee == '') {
           this.notification.showError("Please Select Employee");
           throw new Error;
         }
       }
       //Bug 8368 Fix ** Ends ** Developer: Hari ** Date:27/04/2023
    if (this.value === 0) {
      // this.router.navigateByUrl('ta/cancelmaker');
      this.submiton = true;
      this.shareservice.fetchData.next(this.result);
      this.closebutton.nativeElement.click();
      this.taonbehalfForm.reset();
    }

  }
  advanceForm() {
     //Bug 7502 Fix ** Starts ** Developer: Hari ** Date:27/04/2023
     let statusValue = this.taonbehalfForm.value.status;

     console.log("STATUS VALUE", statusValue)
     
     if(statusValue == 0)
     {
       if (this.taonbehalfForm.value.branch == null || this.taonbehalfForm.value.branch == '') {
         this.notification.showError("Please Select Branch");
         throw new Error;
       }
       if (this.taonbehalfForm.value.employee == null || this.taonbehalfForm.value.employee == '') {
         this.notification.showError("Please Select Employee");
         throw new Error;
       }
     }
     //Bug 8368 Fix ** Ends ** Developer: Hari ** Date:27/04/2023

    if (this.value === 0) {
      // this.router.navigateByUrl('ta/advancemaker-summary');
      this.submiton = true;
      this.shareservice.fetchData.next(this.result);
      this.closebutton.nativeElement.click();
      this.taonbehalfForm.reset();
    }
  }
}