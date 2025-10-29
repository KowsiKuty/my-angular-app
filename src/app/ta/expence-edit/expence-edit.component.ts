import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef,HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray,FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../notification.service'
import { TaService } from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import { Router } from "@angular/router";
import { ShareService } from 'src/app/ta/share.service';
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from 'src/environments/environment'
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, tap, finalize } from 'rxjs/operators';
import { map } from 'rxjs/operators';
export interface paymodelistss {
  code: string;
  id: string;
  name: string;
}
export interface taxtypefilterValue {
  id: number;
  subtax: {id: any,name:any,glno:any};
  taxrate: number;
}
export interface controllingOffice {
  id: string;
  name: string;
  code: string;
}
@Component({
  selector: 'app-expence-edit',
  templateUrl: './expence-edit.component.html',
  styleUrls: ['./expence-edit.component.scss']
})
export class ExpenceEditComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.SpinnerService.hide();
    }
  }
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild('closebutton') closebutton;
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger
  @ViewChild('ccid') cccid: any;
  @ViewChild('bsid') bsssid: any;
  @ViewChild('bssid') matbssidauto: MatAutocomplete;
  @ViewChild('selfpopup', { static: true }) selfpopup: ElementRef;
  radiocheck: any[] = [
    { value: 1, display: 'Self' },
    { value: 0, display: 'Onbehalf' }
  ]
  comments: any
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  tourmodel: any
  tourmodell: any
  expencetypeList: any
  isDisabled = false;
  exp: any;
  comm: any;
  expense: any;
  expensee: any;
  id: any;
  tourno:any;
  base64textString = [];
  data: any
  showattachment = false
  getclaimrequest: any = [];
  expenseList = [];
  totalcount = 0
  pdfimgview: any
  images: any
  showcreatefile = true
  showeditfile = false
  showradiobtn = false;
  re: any
  has_offnext = true;
  has_offprevious = true;
  offcurrentpage: number = 1;
  tourrr: any
  showdisabled = true;
  types: any
  isccbsbtn: boolean = true;
  clicked = false;
  expensetype: any;
  imageUrl = environment.apiURL;
  tourid: any;
  expenceid: any;
  getAdvanceapproveList: any;
  advance_statusid: any; null
  employeelist: any;
  brevent: any;
  branchlist: any;
  bisinesslist: any;
  showcreatecount = true
  costlist: any;
  listBranch: any;
  amt: any;
  showgrnpopup = false
  showaccno = [false, false, false,false, false, false,false, false, false]
  paymodecode=['','','','','','','','']
  showtaxrate = [false, false, false,false, false, false,false, false, false]
  branch_code : any;
  accList: any
  payableSelected =false
  PaymodeList: any
  creditdetForm: FormGroup;
  invCreditList:any;
  payto_id : any;
  cdtsum: any;
  aptypeid: any;
  tdslist:any;
  creditbrnchList: any;
  credittranList: any
  checkAdvance = false;
  showcrnnotify = false;
  showthreshold = false;
  creditglForm: FormGroup
  ERAList: any;
  showtaxtypes = [true, true, true,true, true, true,true, true, true]
  showtaxrates = [true, true, true,true, true, true,true, true, true]
  showtranspay = [false, false, false,false, false, false,false, false, false]
  raisercode: any
  paytoid : any;
  amtsum: any;
  ccbsper: any;
  persum: any;
  total1: number;
  bs: any;
  file_length: number = 0;
  list: DataTransfer;
  resultimage: any;
  attachmentlist: [];
  fileextension: any;
  file_downloaded: boolean;
  viewpdfimageeee: Window;
  fileid: any;
  tokenValues: any;
  filesystem_error: boolean;
  pdfUrls: string;
  jpgUrls: string;
  file_window: Window;
  upexp2: any;
  showeditcount: boolean;
  reason: any;
  file_ext: any;
  expenceform: FormGroup;
  page: any = 1;
  bank_id:any
  has_nextemp: boolean = true;
  has_previousemp: boolean = true;
  has_presentemp: any = 1
  has_nextbsid: boolean = true;
  has_presentbsid: number = 1;
  p = 1;
  tourgid: number;
  ccid: any;
  bsid: any;
  percentage: number;
  amount: number;
  taonbehalfForm: FormGroup
  onbehalf_empName: any;
  isonbehalf = false;
  pageSize = 10;
  not_reset:boolean=false;
  @ViewChild('assetid') matassetidauto: any;
  resoncomment: any;
  remarks: any;
  applevel: number;
  isLoading: boolean;
  apichanges: boolean = true;
  branchid: any;
  onbehalfid: Number = 0;
  status_id: any;
  approvedbyid: any;
  maxapplevel: any;
  itemdisable: boolean = false;
  payload: any;
  advancelist = [];
  approvedamt: number;
  eligibleamt: number;
  claimedamt: number;
  sumadvance: number = 0;
  netpay: number = 0;
  invoiceid: any;
  token: any;
  daterelax: number;
  tournotend: boolean = false;
  currentDate: any = new Date();
  apvl: boolean = false;
  empbrid: boolean = false;
  formdata: any;
  empList: any;
  branchList: any;
  showselfonbehalf: boolean = false;
  paymentstatus: any;
  uploadcount = 0;
  editcount = 0;
  btnelement: HTMLElement;
  expense_summary: any;
  tourenddate: Date;
  get_expence_type:number;
  totalamount: any
  paymode_id:any
  showtaxtype = [false, false, false,false, false, false,false, false, false]
  taxlist: any
  ppxid:any
  showremarks = true;
  showpurpose = false;
  showreason: boolean = false;
  crnno: any;
  // tourmodel.comments || !tourmodel.expencetype=any
  constructor(private formBuilder: FormBuilder, private http: HttpClient, private taservice: TaService, private notification: NotificationService, private shareservice: ShareService,
    private router: Router, private sharedService: SharedService, private SpinnerService: NgxSpinnerService, private taService: TaService,private toastr: ToastrService) { }


  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('conoffice') matofficeAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  branchdata: Array<controllingOffice>;
  @ViewChild('empid') empauto: MatAutocomplete;
  @ViewChild('empinput') empinput: any;
  has_empnext:boolean=true;
  has_empprevious:boolean=false;
  empcurrentpage:number=1
  ngOnInit(): void {
    this.not_reset=false;
    this.btnelement = this.selfpopup.nativeElement;
    this.btnelement.style.visibility = 'hidden';

    this.getbranchValue();
    this.taonbehalfForm = this.formBuilder.group({

      branch: ['', Validators.required],
      employee: ['', Validators.required],
      status: [''],

    })
  

    this.creditglForm = this.formBuilder.group({
      name: [''],
      glnum: [''],
      category_code: [''],
      subcategory_code: [''],
      bs_code:[''],
      cc_code:[''],

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
    let data = this.shareservice.expensesummaryData.value;

    const expense_summary = JSON.parse(localStorage.getItem('expense_details'))

    this.daterelax = expense_summary.date_relaxation;
    console.log("expense_summary", expense_summary)
    console.log("data", data)
    if (expense_summary.onbehalfof) {
      this.isonbehalf = true;
      this.onbehalf_empName = '(' + expense_summary.employee_code + ') ' + expense_summary.employee_name
      this.onbehalfid = expense_summary.empgid;
      console.log("onbehalf_empName", this.onbehalf_empName)
    } else {
      this.isonbehalf = false;
    }
    let date = new Date(expense_summary['enddate'])
    this.tourenddate = date;
    if (this.currentDate < date) {
      this.notification.showWarning('Tour Expense Claim can be submitted after the tour ended')
      this.tournotend = true;
    }

    this.advance_statusid = expense_summary.advance_status_id
    this.reason = expense_summary['reason']
    this.id = expense_summary['id']
    this.tourno = expense_summary['requestno']
    this.status_id = expense_summary.claim_status_id
    console.log("status id",this.status_id);
    this.maxapplevel = expense_summary.max_applevel
    //  const expense_summary = JSON.parse(localStorage.getItem("tour_details"));
    var reason_check = expense_summary.reason_id;



    this.expenceform = this.formBuilder.group({
      tourgid: this.id,
      tourno:this.tourno,
      expentype: null,
      comments: null,
      appcomment: null,
      empbranchid: null,
      approvedby: null,
      approval: null,
      ccbs: new FormArray([
      ]),
      creditdtl: new FormArray([
      ]),
    
    })


    console.log("id", this.id)
    console.log("reason", this.reason)
    this.tourmodell = {
      tourno:this.tourno,
      requestno: this.id,
      expencetypee: "",
      comments: "",
      bank: "",
      approval: "",
      remarks: "",
     
    }

    this.exp = this.tourmodell.expencetype;
    this.comm = this.tourmodell.comments;
    console.log("bbb", this.comm)
    this.getexpenseValue(reason_check);
    this.comentscl();
    this.getclaimrequestsumm();
    //  this.getadvanceapprovesumm();
    this.getadvanceapprovesumm();
    this.getbusinesssegmentValue();
    this.getbranchValue();
    this.tourrr = this.tourmodell
    console.log("saiii", this.tourrr)

    this.shareservice.dropdownvalue.next(data)

    this.expenceform.get('expentype').valueChanges.subscribe(x => {
      this.tourmodell.expencetypee = x
    })

    this.expenceform.get('comments').valueChanges.subscribe(x => {
      this.tourmodell.comments = x
    })

    // if (this.apichanges) {
      this.expenceform.get('empbranchid').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.taservice.getUsageCode(value, 1))
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.branchlist = datas;
          console.log("Branch List", this.branchlist)
        });

      this.expenceform.get('approval').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.taservice.getbranchid(value,this.branchid,1))
        )
        .subscribe((results: any[]) => {
          let datas = results;
          this.employeelist = datas['data'];
          console.log("Employee List", this.employeelist);
          let datapagination = results["pagination"];
          this.employeelist = this.employeelist
          if (this.employeelist.length > 0) {
            this.has_empnext = datapagination.has_next;
            this.has_empprevious = datapagination.has_previous;
            this.empcurrentpage = datapagination.index;
          }
        });

    // };
    (this.expenceform.get('ccbs') as FormArray).push(this.createccbs());
    this.getERA(4,0,'')
    this.getimages()

  }

  expensedatas(n) {
    this.value = n.value
    this.shareservice.radiovalue.next(this.value)
    if (n.value === 1) {
      this.showradiobtn = false;
      this.showdisabled = true;
      this.closebutton.nativeElement.click();
      this.router.navigateByUrl('ta/expense-summary');

    }
    else {
      this.showradiobtn = true;
      this.showdisabled = false;
    }
  }
  submitForms() {
    if (this.value === 0) {
      this.router.navigateByUrl('ta/expense-summary');
      this.shareservice.fetchData.next(this.result);
      this.closebutton.nativeElement.click();
      this.taonbehalfForm.reset();
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
    this.taservice.getonbehalfemployee("", this.branchid,1)
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.empList = datas;
        console.log("Employee List", this.empList)
      });
  }


  name: any;

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
  comentscl() {
    if (this.tourmodell.comments != "") {
      this.isDisabled = false;
    }
    else {
      this.isDisabled = false;
    }

  }
  createccbs() {
    let group = this.formBuilder.group({
      id: 0,
      bsid: null,
      ccid: null,
      amount: null,
      tourgid: this.id,
      percentage: null,
    });
    return group;
  }

  checkind(ind) {
    (<FormArray>this.expenceform.get("ccbs")).at(ind).get('bsid').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.taservice.getbusinesssegmentValue(value, 1))
      )
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.bisinesslist = datas;
      });
    return true
  }

  checkccind(ind) {
    (<FormArray>this.expenceform.get("ccbs")).at(ind).get('ccid').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.taservice.getcostcenterValue(value, this.bs))
      )
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.costlist = datas;
      });
    return true
  }

  ccbsreadonly(status) {
    if (status.value.ccbs_edit_status == 0 || this.applevel == 1) {
      return true;
    }
    else {
      return false;
    }
  }

  addccbs() {
    this.amt = this.ccbsamt();

    if (this.amt == null || this.amt == 0) {
      this.notification.showError("Amount Can't be ZERO (0)")
      return false
    }

    var sum_percent: number = 0;
    let percentlist = (this.expenceform.get('ccbs') as FormArray).value
    percentlist.forEach(element => {
      if (element.ccbs_edit_status != 0 || element.ccbs_edit_status == 1 || element.ccbs_edit_status == null) {
        sum_percent = sum_percent + parseFloat(element.percentage);
      }
    });
    if (sum_percent < 100 && this.amt != null) {
      const datas = this.expenceform.get('ccbs') as FormArray;
      datas.push(this.createccbs())
    }
    else {
      this.notification.showError("Check CCBS Percentage or Amount...")
    }
  }
  getbranchValue() {
    this.taservice.getbranchvalues(this.page)
      .subscribe(result => {
        this.branchlist = result['data']
        let datapagination = result["pagination"];


        if (this.branchlist.length > 0) {
          this.has_nextemp = datapagination.has_next;
          this.has_previousemp = datapagination.has_previous;
          this.has_presentemp = datapagination.index;
        }
      })

  }
  getbusinesssegmentValue() {
    this.taservice.getbusinesssegmentValue('', 1)
      .subscribe(result => {
        this.bisinesslist = result['data']
        console.log("bisinesslist", this.bisinesslist)
      })
  }
  getBS(id, ind) {
    this.bs = id
    const myForm = (<FormArray>this.expenceform.get("ccbs")).at(ind);
    myForm.patchValue({
      ccid: undefined
    });

    this.getcostcenterValue()
  }
  getcostcenterValue() {
    this.taservice.getcostcenterValue('', this.bs)
      .subscribe(result => {
        this.costlist = result['data']
        console.log("costlist", this.costlist)
      })
  }
  brclear() {
    let myform = this.expenceform
    myform.patchValue({
      "empbranchid": null,
      "approval": null
    })
    this.empbrid = false;
    this.apvl = false;

  }

  brchange() {

    this.empbrid = true;
  }

  empchange() {

    this.apvl = true;
  }
  empclear() {
    this.expenceform.patchValue({
      approval: ''
    })

    this.apvl = false;
  }
  omit_special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || k == 13 || (k >= 48 && k <= 57));
    // return ((k > 96 && k < 123) || k == 8 || k == 32 || (k > 64 && k < 91));
    // return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 13 || k == 32 || (k >= 48 && k <= 57));


  }

  remarksupdate(value) {
    this.remarks = value.target.value;
  }
  
  submitccbs() {
    let sum_percent: number = 0;
    let amount: number = 0;
    this.not_reset=false;
    let percentlist = (this.expenceform.get('ccbs') as FormArray).value
    percentlist.forEach(element => {
      if (element.percentage < 0.1) {
        this.notification.showError("Plese Enter Valid Percentage")
        throw new Error
      }
      if (element.ccid.id == null ||element.ccid.id ==undefined) {
        this.notification.showError("Please Select CC")
        throw new Error
      }
    if(element.bsid.id == undefined || element.bsid.id == null){
      this.notification.showError("Please Select BS")
        throw new Error
    }
      sum_percent = sum_percent + Number(element.percentage)
      amount = amount + Number(element.amount)
    });
    if (sum_percent == 100 && this.claimedamt == amount) {
      this.not_reset=true;
      this.closebutton.nativeElement.click();
      this.notification.showSuccess("CCBS Added Successfully....")
    }
    else {
      this.notification.showError("Please Check CCBS Percentage/Amount..")
      return false;
    }
   
  }
  
  displayFn(subject) {
    return subject ? "(" + subject.code + ")" + subject.full_name : undefined;
  }

  displayFn1(subject) {
    // return subject? '('+subject.onbehalf_employee_code+') '+subject.onbehalf_employee_name:undefined
    return subject ? "(" + subject.employee_code + ") " + subject.employee_name : undefined
  }


  csview(subject) {
    return subject ? subject.name : undefined;
  }
  bsview(subject) {
    return subject ? subject.name : undefined;
  }
  reson(event) {
    this.resoncomment = event.target.value;

  }
  value: any;
  ccbsbtn() {
    let sum = this.expenceform.value.ccbs.map(item => Number(item?.percentage))?.reduce((prev, next) => prev + next);
    return sum
  }

  ccbsamt() {
    return this.getclaimrequest.map(item => Number(item?.claimedamount))?.reduce((prev, next) => prev + next);
  }
  percen_calc(event, ind) {
    let value = (event.target.value / this.ccbsamt()) * 100;
    if (value > 0) {
      const myForm = (<FormArray>this.expenceform.get('ccbs')).at(ind);
      myForm.patchValue({
        percentage: value
      });
    }
  }


  ccbs_validation(ind, field = 'percentage') {
    const myForm = (<FormArray>this.expenceform.get('ccbs')).at(ind);
    // let value = evt.target.value;
    if (field == 'percentage') {
      if (this.ccbsbtn() > 100) {
        this.notification.showError('Please Enter Valid Percentage as Total Percentage can not be greater than 100');
        myForm.patchValue({
          percentage: null,
          amount: null
        });
      }
    }
    else {
      let sum = this.expenceform.value.ccbs.map(item => Number(item.amount)).reduce((prev, next) => prev + next);
      if (sum > this.claimedamt) {
        this.notification.showError('Please Enter Valid Amount, as Total CCBS Amount can not be greater than ' + sum);
        myForm.patchValue({
          amount: null,
          percentage: null
        });
      }
    }

  }

  amount_calc(event, ind) {
    var value = (event.target.value / 100) * this.ccbsamt();
    if (value > 0) {
      const myForm = (<FormArray>this.expenceform.get('ccbs')).at(ind);
      myForm.patchValue({
        amount: value
      });
    }
  }



  selectBranch(branch) {
    console.log("Selected Branch:", branch); 
    this.branchid = branch.id; 
    console.log("Selected Branch ID:", this.branchid);

    this.taservice.getbranchid('', this.branchid, 1)
      .subscribe(results => {
        this.employeelist = results['data'];
        console.log("Employee List:", this.employeelist);
        
        let datapagination = results["pagination"];
        if (this.employeelist.length > 0) {
          this.has_empnext = datapagination.has_next;
          this.has_empprevious = datapagination.has_previous;
          this.empcurrentpage = datapagination.index;
        }
      }, error => {
        console.error("API Error:", error); 
      });
}



  getadvanceapprovesumm(pageNumber = 1, pageSize = 10) {
    this.taservice.getapproveflowexpenselist(this.id)
      .subscribe(result => {
        console.log("Tourmaker123", result)
        let datas = result['approve'];

        console.log("APPROVVAL FLOW", datas)
        this.getAdvanceapproveList = datas;
        this.approvedbyid = datas[datas.length - 1]?.id
        var file_valid = datas[datas.length - 1]?.status;
        if (file_valid > 1) {
          this.showcreatefile = false
          this.showcreatecount = false
          this.showeditfile = true
          this.showeditcount = true
        }
        else {
          this.showcreatefile = true
          this.showeditfile = false
          this.showeditcount = false
        }

      })
  }
  onFileSelected(evt: any) {
    const file = evt.target.files;

    for (var i = 0; i < file.length; i++) {
      if (this.file_length == 0) {
        this.list = new DataTransfer();
        this.list.items.add(file[i]);
        console.log("FIELS", file)
      }
      else {
        this.list.items.add(file[i]);
      }
      if (file[i]) {
        let stringValue = file[i].name.split('.')
        this.fileextension = stringValue.pop()
        const reader = new FileReader();
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file[i]);
        this.file_length = this.file_length + 1;
      }

    }

    let myfilelist = this.list.files
    evt.target.files = myfilelist
    this.images = evt.target.files;
    console.log("this.images", this.images)
    this.totalcount = evt.target.files.length;
    this.fileData = evt.target.files
    console.log("fdddd", this.fileData)
    this.pdfimgview = this.fileData[0].name
    console.log("pdffff", this.pdfimgview)

  }

  filetype_check(i: string | number) {
    let stringValue = this.images[i].name.split('.')
    this.fileextension = stringValue.pop();
    if (this.file_ext.includes(this.fileextension)) {
      var msg = 1;
    }
    else {
      var msg = 0;
    }
    return msg


  }

  filetype_check2(i: string | number) {
    let stringValue = this.images[i].name.split('.')
    this.fileextension = stringValue.pop();
    if (this.file_ext.includes(this.fileextension)) {
      var msg = 0;
    }
    else {
      var msg = 1;
    }
    return msg


  }
  removeSection1(index, ccbs) {
    (<FormArray>this.expenceform.get('ccbs')).removeAt(index);
  }

  handleReaderLoaded(e) {
    var conversion = btoa(e.target.result)
    this.file_ext = ['jpg', 'png', 'JPG', 'JPEG', 'jpeg', 'image']
    if (this.file_ext.includes(this.fileextension)) {
      this.base64textString.push('data:image/png;base64,' + conversion);

    }
    else {
      this.base64textString.push('data:application/pdf;base64,' + conversion);

    }
  }

  getfilecount() {
    let count = this.totalcount + this.editcount
    return count
  }
  deleteUpload(i) {
    this.base64textString.splice(i, 1);
    this.list.items.remove(i)
    this.totalcount = this.list.items.length;

    (<HTMLInputElement>document.getElementById('uploadFile')).files = this.list.files;
  }
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  tourexpence_makerlist=[];
  tourexpence_applist=[];
  total_filecount:any;

  getimages() {
    this.taservice.getfetchimages(this.id)
      .subscribe((results) => {
        // this.resultimage = results[0].url
        const file_ext = ['pdf', 'jpg', 'png', 'PDF', 'JPG', 'JPEG', 'jpeg', 'image']
        this.tourexpence_makerlist=results.tour_expense_maker;
        this.tourexpence_applist=results.tour_expense_approver;
        this.total_filecount=results.expense_file_count;
        console.log("barcode", results)
        console.log("maxlevel",this.maxapplevel)

        for (var i = 0; i < results.length; i++) {

          var downloadUrl = results[i].url;
          let stringValue = results[i].file_name.split('.')
          this.fileextension = stringValue.pop();
          if (file_ext.includes(this.fileextension)) {
            continue
          }
          else if (this.file_downloaded == false) {
            this.viewpdfimageeee = window.open(downloadUrl, '_blank');
            console.log('barcode', downloadUrl)
            this.fileid = results[i].id
            console.log("this.fileid", this.fileid)
            this.getcall()
          }
        }
        this.file_downloaded = true;
      })
  }

  getcall() {
    this.taservice.getfetchimages1(this.fileid)
      .subscribe((results) => {
        console.log("results", results)
      })
  }


  preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    }
  }

  getexpenseValue(reason) {
    let tour_id :any="";
    if (this.expenceform.get('tourgid').value!="" && this.expenceform.get('tourgid').value!=undefined && this.expenceform.get('tourgid').value!=null){
      tour_id=this.expenceform.get('tourgid').value
    }
    this.taservice.getexpenseTypeValue(tour_id)
      .subscribe(result => {
        this.expencetypeList = result['data']
        if (reason == '11' || reason == 11) {
          this.expencetypeList = [this.expencetypeList[7]]
        }
        else {
          this.expencetypeList = this.expencetypeList.filter(record => { return record.id != 8 })
        }
        if (result['key'] == 1){
          this.showreason = true
        }
        console.log("expense", this.expencetypeList)
      })

  }
  datas: any;
  get_exp_data_invoice(data:any){
    this.get_expence_type=data.type;
  }
  addForm() {
    let result = this.tourrr;
    console.log(result);
    console.log(this.expenceform.value);
   
    if (result.expencetypee && result.comments != '') {
      let re = {
        "tourno":result.tourno,
        "requestno": result.requestno,
        "expenseid": result.expencetypee,
        'type':this.get_expence_type,
        "requestercomment": result.comments,
        "eligibleamount": 0,
        "claimedamount": 0,
        "new_type":1
      }
      
      this.getclaimrequest.push(re);
      this.shareservice.expence_list.next(re);
      const exp_list = this.expencetypeList.filter((record) => { return record.id !== result.expencetypee; });
      this.expencetypeList = exp_list;

      this.datas = re
      let data = this.shareservice.dropdownvalue.next(this.datas)
      console.log("data", data)
      this.resetclick();
    }
    else {
      if (result.expencetypee == "") {
        this.notification.showError("Please Select Expense Type")
      }
      else if (result.comments == "") {
        this.notification.showError('Please Enter Comment')
      }
      return false;
    }


  }

  resetclick() {
    this.tourmodell.expencetypee = '';
    this.tourmodell.comments = '';
    this.expenceform.controls['expentype'].reset()
    this.expenceform.controls['comments'].reset()
    // this.expenceform.reset();
    // this.expenceform.value.tourno=this.tourid;
  }
  Expensetypes(data) {
    this.types = data;
    this.expensetype = data.Expensetype
    console.log("expensetype", this.expensetype)
    console.log("types", this.types)
    if (this.types.Expensetype == 1) {
      this.router.navigateByUrl('ta/travel');
    }
    else if (this.types.Expensetype == 2) {
      this.router.navigateByUrl('ta/daily');
    }
    else if (this.types.Expensetype == 3) {
      this.router.navigateByUrl('ta/inci');
    }
    else if (this.types.Expensetype == 4) {
      this.router.navigateByUrl('ta/local')
    }
    else if (this.types.Expensetype == 5) {
      this.router.navigateByUrl('ta/lodge')
    }
    else if (this.types.Expensetype == 6) {
      this.router.navigateByUrl('ta/misc')
    }
    else if (this.types.Expensetype == 7) {
      this.router.navigateByUrl('ta/pack')
    }
    else if (this.types.Expensetype == 8) {
      this.router.navigateByUrl('ta/deput')
    }
    else if (this.types.Expensetype == 9) {
      this.router.navigateByUrl('ta/iba-expense')
    }
  }

  expensedelete(getclaim, i) {
    console.log('getclaimvalues', getclaim)
    let tourid = getclaim.tourid
    let expenseid = getclaim.expenseid
    if (expenseid === this.shareservice.expence_list.value.expenseid) {
      this.shareservice.expence_list.next('')
    }
    this.getclaimrequest.splice(i, 1)
    if (getclaim.id) {
      this.taservice.expensedeleteSummary(tourid, expenseid)
        .subscribe(res => {
          if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
            this.notification.showWarning("Duplicate! Code Or Name ...")

          }
          else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
            this.notification.showError("INVALID_DATA!!...")

          }
          else if (res.status == 'Successfully Deleted') {
            this.notification.showSuccess("Deleted Successfully")
            console.log("res", res)
            this.onSubmit.emit();
            this.ngOnInit();
            return true;
          }
          else {
            this.notification.showError(res.description)
          }
        }
        )

    }
    else {
      this.ngOnInit()
    }
    // console.log(this.expencetypeList)
    // console.log(this.upexp2)
    // console.log(this.expenceid)
    // this.expencetypeList.push(this.upexp2[this.expenceid - 1]);
  }
  expenseadddelete(index: number) {


  }
  back() {
    // this.showselfonbehalf = true;
    // let status = JSON.parse(localStorage.getItem('onbehalfpopup'));
    // if (status.status) {
    //   this.selfpopup.nativeElement.click()
    // }
    // else {
    //   this.shareservice.radiovalue.next('1')
    //   this.shareservice.fetchData.next(this.result);
    //   this.router.navigateByUrl('ta/expense-summary');
    // }
    this.showselfonbehalf = true;
    this.shareservice.radiovalue.next('1')
    this.onCancel.emit()
    this.data = { index: 7 }
    this.sharedService.summaryData.next(this.data)
    this.router.navigateByUrl('ta/ta_summary');
  }
  deleteAll() {
    this.totalcount = this.list.items.length;
    for (let i = 0; i < this.totalcount; i++) {
      this.base64textString.splice(i, this.totalcount);
      this.list.items.remove(i)
      this.totalcount = 0
    }
  }
  getclaimrequestsumm() {
    this.SpinnerService.show()
    this.taService.getclaimrequestsummary(this.id,'')
      .subscribe(result => {
        // console.log("claim .....", result)
        this.SpinnerService.hide()
        this.paymentstatus = result.claim_payment_status;
        let datas = result['data'];
        this.approvedamt = result?.approved_amount
        this.eligibleamt = result?.eligible_amount
        this.claimedamt = result?.claimed_amount
        console.log('daaaatas', datas)
        for (var i = 0; i < datas?.length; i++) {
          var expenseid = datas[i]?.expenseid
          if (result.treason=="CTC Sales Local Conveyance"){
            const exp_list = this.expencetypeList?.filter(record => { return record.id === 4 });
            this.expencetypeList = exp_list;
            this.showremarks = false;
            this.showpurpose = true;
          }
          else{
          const exp_list = this.expencetypeList?.filter(record => { return record.id !== expenseid; });
          this.expencetypeList = exp_list;
          console.log("EXP", this.expencetypeList)
          this.showremarks = true;
          this.showpurpose = false;
          }
        }

        if (this.status_id != -1 && this.status_id != 1) {
          let branchdetail = result.approver_branch_data
          const myform = this.expenceform
          this.branchid = branchdetail.branch_id
          this.remarks = result.maker_comment;
         
          this.crnno = result.crnno !== undefined ? result.crnno : ' ';
          myform.patchValue({
            "approval": branchdetail,
            "empbranchid": "(" + branchdetail.branch_code + ") " + branchdetail.branch_name,
            "appcomment": result.maker_comment

          })
        }
        this.showattachment = true
        if (datas[0].id != null) {
          this.getclaimrequest = datas
          let expence_value = this.shareservice.expence_list.value?this.shareservice.expence_list.value:''
          if (expence_value !== '' && !(this.getclaimrequest.some(item => item.expenseid == expence_value.expenseid)) && this.tourrr.requestno == expence_value.requestno) {
          this.getclaimrequest.push(expence_value)
          const exp_list = this.expencetypeList.filter((record) => { return record.id !== expence_value.value.expenseid; });
          this.expencetypeList = exp_list;
          }
          this.invoiceid = datas[0].invoiceheadergid
          console.log('this.getclaimrequest', this.getclaimrequest)
        }
        else {
          let expence_value = this.shareservice.expence_list.value?this.shareservice.expence_list.value:''
          if (expence_value !== '' && this.tourrr.requestno == expence_value.requestno) {
          this.getclaimrequest.push(expence_value)
          const exp_list = this.expencetypeList.filter((record) => { return record.id !== this.shareservice.expence_list.value.expenseid; });
          this.expencetypeList = exp_list;
          }
          else {
          this.getclaimrequest = []
          }
        }
        console.log("Claim Request......", this.getclaimrequest)
        for (var i = 0; i < this.getclaimrequest.length; i++) {
          this.tourid = this.getclaimrequest[i].tourid;
          this.expenceid = this.getclaimrequest[i].expenseid;
          console.log("Claim Request......", this.expenceid)
        }
        // this.getimages();
        this.addcreditSection(0,'0')
        this.taservice.getadvanceEditsummary(this.id)
          .subscribe((result: any[]) => {
            this.advancelist = result['detail'] ? result['detail'] : []
            this.advancelist = this.advancelist.filter((element) => {
              return element.paid_advance_amount !== 0
            })
            this.sumadvance = 0;
            this.advancelist.forEach(element => {
              this.sumadvance += Number(element.paid_advance_amount)
            });
          })
        if (this.approvedamt < this.sumadvance) {
          this.netpay = this.sumadvance - this.approvedamt
        }
        else {
          this.netpay = this.approvedamt - this.sumadvance
        }
        this.taservice.getclaimccbsEditview(this.id).subscribe(result => {
          const length = result.length
          // this.ccbslist =result;
          const myform = (this.expenceform.get('ccbs') as FormArray)
          for (var i = 1; i < length; i++) {
            myform.push(this.createccbs())
          }
          result?.forEach(element => {
            element.ccid = element.cc_data;
            element.bsid = element.bs_data;
          });
          const ccbsform = this.expenceform
          ccbsform?.patchValue({
            ccbs: result
          })
          if (length > 0) {
            if (this.status_id != -1 && this.status_id != 5) {
              (this.expenceform.get('ccbs') as FormArray).disable()
              this.itemdisable = true;
            }
          }
        })
      })
  }








  getTotal(marks) {
    // console.log('marks',marks)
    let total = 0;

    // marks.forEach((item) => {
    //   total += Number(item.eligibleamount);
    // });
    for (let i = 0; i < marks.length; i++) {
      total = total + Number(marks[i].eligibleamount)
    }
    // total=total+Number(marks.eligibleamount)
    // total = this.formatPipe.transform(total);
    // console.log('total',total)

    return total;
  }
  pdfdownload() {
    this.taservice.getadvpdf(this.invoiceid).subscribe(results => {
      let fileurl = window.URL.createObjectURL(new Blob([results]))
      let link = document.createElement('a')
      link.href = fileurl
      link.download = `${this.invoiceid}.pdf`;
      link.click();
    })
  }
  getTotall(marks) {
    // console.log("llll",marks)
    this.total1 = 0;

    marks.forEach((item) => {
      this.total1 += Number(item.claimedamount);
    });
    // total1 = this.formatPipe.transform(total1);

    return this.total1;


  }

  updatesubmit() {
    this.showselfonbehalf = false;
    let data = this.expenceform.value
    let payload = {
      "id": this.approvedbyid,
      "tour_id": this.id,
      "approver": data.approval.id,
      "comment": this.remarks
    }
    this.SpinnerService.show()
    this.taservice.claimapproveupdate(payload).subscribe(results => {
      if (results.status == "success") {
        this.SpinnerService.hide();
        this.notification.showSuccess("Updated Successfully")
        // this.onCancel.emit()
        this.data = { index: 5 }
        // this.shareservice.radiovalue.next('1')
        // this.sharedService.summaryData.next(this.data)
        // this.sharedService.summaryData.next(this.data)
        this.showselfonbehalf = true;
        let status = JSON.parse(localStorage.getItem('onbehalfpopup'));
        if (status.status) {
          this.selfpopup.nativeElement.click()
        }
        else {
          this.shareservice.radiovalue.next('1')
          this.shareservice.fetchData.next(this.result);
          this.router.navigateByUrl('ta/expense-summary');
        }
        this.onSubmit.emit();
        // this.router.navigateByUrl('ta/expense-summary');
      }
      else {
        this.SpinnerService.hide();
        this.notification.showError(results.description)
      }

    })
  }

  expenseEdit(data) {
    this.data = data
    console.log("dd", this.data)
    var datas = JSON.stringify(Object.assign({}, data))
    localStorage.setItem("expense_edit", datas)

    this.shareservice.id.next(this.id)
    this.shareservice.expenseedit.next(this.data)
    if (this.data.expenseid == 1) {
      this.router.navigateByUrl('ta/travel');
    }
    else if (this.data.expenseid == 2) {
      this.router.navigateByUrl('ta/daily');
    }
    else if (this.data.expenseid == 3) {
      this.router.navigateByUrl('ta/inci');
    }
    else if (this.data.expenseid == 4) {
      this.router.navigateByUrl('ta/local')
    }
    else if (this.data.expenseid == 5) {
      this.router.navigateByUrl('ta/lodge')
    }
    else if (this.data.expenseid == 6) {
      this.router.navigateByUrl('ta/misc')
    }
    else if (this.data.expenseid == 7) {
      this.router.navigateByUrl('ta/pack')
    }
    else if (this.data.expenseid == 8) {
      this.router.navigateByUrl('ta/deput')
    }
    else if (this.data.expenseid == 9) {
      this.router.navigateByUrl('ta/iba-expense')
    }
  }

  submitdisable() {
    let data = this.expenceform.value
    if (data.empbranchid == null) {

      return true
    }
    if (data.approval == null) {
      return true
    }
    if (data.appcomment == null || data.appcomment == '') {
      return true;
    }
    else {
      return false
    }
  }



  submitForm() {
    console.log(this.selectedFiles);
    let daatalist:any=this.getclaimrequest.filter((d)=>{return d.type==1});
    if((this.selectedFiles.length)<1){
    if ((daatalist.length)>0){
      if(  this.selectedFiles==null){
        this.notification.showWarning("Please Upload The File..");
        return false;
      }
    }
  }

    this.showselfonbehalf = false;
    let formdata = JSON.parse(JSON.stringify(this.expenceform.value));
    // let formdata = this.expenceform.value;
    let ccbsdata = formdata.ccbs
    let sum_percent: number = 0;
    let amount: number = 0;
    ccbsdata.forEach(element => {
      if (element.id == 0) {
        delete element.id;
      }
      if (element.ccid == null || element.bsid == null) {
        this.notification.showError("Please Select CCBS")
        throw new Error
      }
      if (element.percentage < 0.1) {
        this.notification.showError("Please Enter CCBS Percentage")
        throw new Error
      }

      element.ccid = element.ccid.id;
      element.bsid = element.bsid.id;
      element.percentage = Number(element.percentage)
      sum_percent = sum_percent + Number(element.percentage)
      element.amount = Number(element.amount)
      amount = amount + Number(element.amount)
    });

    if (sum_percent != 100) {
      this.notification.showError("Check CCBS Percentage")
      return false;
    }
    if (this.claimedamt != amount) {
      this.notification.showError("Check CCBS Amount")
      return false
    }
  if (this.isonbehalf && this.selectedFiles.length <1) {
       
        this.toastr.error('Please Upload The File..');
         return false;
      } 
    let payload;
    if (this.isonbehalf) {
      payload = {
        "tourgid": formdata.tourgid,
        "approvedby": formdata.approval.id,
        "appcomment": formdata.appcomment,
        "ccbs": ccbsdata,
        "onbehalfof": this.onbehalfid
      }
    }
    else {
      payload = {
        "tourgid": formdata.tourgid,
        "approvedby": formdata.approval.id,
        "appcomment": formdata.appcomment,
        "ccbs": ccbsdata
      }
    }

    this.SpinnerService.show()
    this.taservice.expenseAdd(payload, this.selectedFiles)
      .subscribe(res => {

        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.SpinnerService.hide()
          this.notification.showWarning("Duplicate! Code Or Name ...")
        }
        else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.SpinnerService.hide()
          this.notification.showError("INVALID_DATA!...")
        }
        else if (res.status === "SUCCESS" || res.status == "success") {
          this.SpinnerService.hide()
          this.notification.showSuccess("Submitted Successfully")
          this.data = { index: 5 }
          this.sharedService.summaryData.next(this.data)
          let status = JSON.parse(localStorage.getItem('onbehalfpopup'));
          if (status.status) {
            this.selfpopup.nativeElement.click()
          }
          else {
            this.shareservice.radiovalue.next('1')
            this.shareservice.fetchData.next(this.result);
            this.router.navigateByUrl('ta/expense-summary');
          }
          this.showselfonbehalf = true;
          return true
        }
        else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)

        }
      }
      )
  }



  commentPopup(pdf_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    this.filesystem_error = false;
    let id = pdf_id;
    this.fileid = pdf_id;
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = file_name.split('.')
    this.fileextension = stringValue.pop();
    if (this.fileextension === "pdf") {
      this.jpgUrls = this.imageUrl + "taserv/download_documents/" + id + "?type=pdf&token=" + token
      // this.file_window = window.open(this.pdfUrls, "_blank", 'width=600,height=400,left=200,top=200')
    }
    else if (this.fileextension === "png" || this.fileextension === "jpeg" || this.fileextension === "jpg" || this.fileextension === "JPG" || this.fileextension === "JPEG") {
      // if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {

      this.jpgUrls = this.imageUrl + "taserv/download_documents/" + id + "?type=" + this.fileextension + "&token=" + token
    }
    else {
      this.filesystem_error = true;
    }
  }


  // closefile_window() {
  //   this.file_window.close()
  // }
  fileDeleted(id, i) {

    this.fileid = id
    this.taservice.fileDelete(this.fileid)
      .subscribe(res => {
        console.log("incires", res)
        if (res.status === "Successfully Deleted") {
          this.SpinnerService.hide()
          this.notification.showSuccess("Deleted Successfully")
          this.attachmentlist.splice(i, 1)
          this.onSubmit.emit();
          return true;
        } else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
          return false;
        }
      })
  }
  fileDelete() {
    this.taservice.fileDelete(this.fileid)
      .subscribe((res) => {
        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.notification.showWarning("Duplicate! Code Or Name ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!...")
        }
        else {
          this.notification.showSuccess("Deleted Successfully")
          console.log("res", res)
          this.onSubmit.emit();
          return true
        }

      })
  }


  getimagedownload(url, file_name) {
    this.taservice.getfetchimagesss(url)

  }
  numberOnly(event) {
    return (event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46)
  }
  bsidget() {
    setTimeout(() => {
      if (this.matbssidauto && this.autocompletetrigger && this.matbssidauto.panel) {
        fromEvent(this.matbssidauto.panel.nativeElement, 'scroll').pipe(
          map(x => this.matbssidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.matbssidauto.panel.nativeElement.scrollTop;
          const scrollHeight = this.matbssidauto.panel.nativeElement.scrollHeight;
          const elementHeight = this.matbssidauto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          console.log("CALLLLL", atBottom)
          if (atBottom) {

            if (this.has_nextbsid) {
              this.taservice.getbusinesssegmentValue(this.bsssid.nativeElement.value, this.has_presentbsid + 1).subscribe(data => {
                let dts = data['data'];
                console.log('h--=', data);
                console.log("SS", dts)
                console.log("GGGgst", this.bisinesslist)
                let pagination = data['pagination'];
                this.bisinesslist = this.bisinesslist.concat(dts);

                if (this.bisinesslist.length > 0) {
                  this.has_nextbsid = pagination.has_next;
                  this.has_presentbsid = pagination.has_previous;
                  this.has_presentbsid = pagination.index;

                }
              })
            }
          }
        })
      }
    })

  }

  autocompleteid() {
    setTimeout(() => {
      if (this.matassetidauto && this.autocompletetrigger && this.matassetidauto.panel) {
        fromEvent(this.matassetidauto.panel.nativeElement, 'scroll').pipe(
          map(x => this.matassetidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.matassetidauto.panel.nativeElement.scrollTop;
          const scrollHeight = this.matassetidauto.panel.nativeElement.scrollHeight;
          const elementHeight = this.matassetidauto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          console.log("CALLLLL", atBottom)
          if (atBottom) {

            if (this.has_nextemp) {
              this.taservice.getbranchvalues(this.has_presentemp).subscribe(data => {
                let dts = data['data'];
                console.log('h--=', data);
                console.log("SS", dts)
                console.log("GGGgst", this.branchlist)
                let pagination = data['pagination'];
                this.branchlist = this.branchlist.concat(dts);

                if (this.branchlist.length > 0) {
                  this.has_nextemp = pagination.has_next;
                  this.has_previousemp = pagination.has_previous;
                  this.has_presentemp = pagination.index;

                }
              })
            }
          }
        })
      }
    })
  }
  empScroll(){
    setTimeout(() => {
      if (
        this.empauto &&
        this.autocompleteTrigger &&
        this.empauto.panel
      ) {
        fromEvent(this.empauto.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.empauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.empauto.panel.nativeElement.scrollTop;
            const scrollHeight = this.empauto.panel.nativeElement.scrollHeight;
            const elementHeight = this.empauto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_empnext === true) {
                this.taservice.getbranchid(this.empinput.nativeElement.value,this.branchid,this.empcurrentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeelist = this.employeelist.concat(datas);
                    if (this.employeelist.length > 0) {
                      this.has_empnext = datapagination.has_next;
                      this.has_empprevious = datapagination.has_previous;
                      this.empcurrentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  ccbs:any
  close(){
   
    if((this.status_id == 1 || this.status_id == -1) && this.not_reset==false){
      this.closebutton.nativeElement.click();
     (this.expenceform.get('ccbs') as FormArray).clear();
     (this.expenceform.get('ccbs') as FormArray).push(this.createccbs());
    }
    else{
    this.closebutton.nativeElement.click();
    // this.expenceform.reset()
  }
  }
  invoice_number:any
  pdfapuserdownload(){
    this.SpinnerService.show()
    this.invoice_number= 'TOUR'+this.id
    this.taservice.getAPUserpdf(this.invoice_number).subscribe(results => {
      if (results['type']=='application/pdf'){
      this.SpinnerService.hide()
      let fileurl = window.URL.createObjectURL(new Blob([results]))
      let link = document.createElement('a')
      link.href = fileurl
      link.download = `${this.invoice_number}.pdf`;
      link.click();
      }
      else{
        this.SpinnerService.hide()
        this.notification.showWarning('No File Found')

      }

    })

  }
  creditEntryFlag = false
  // checkAdvance = false
  branchGST : any
  attachedFile  = new FormArray([])
  
  addcreditSection(exceedAmt = 0, paymode = "") {    
  
    const control = <FormArray>this.expenceform.get('creditdtl');
    control.push(this.creditdetails());
    let creditDtl = this.expenceform.value.creditdtl

    let index = creditDtl.length-1
    // if(exceedAmt != 0)
    // {
     
    // } else if(paymode =="PM004")
    // {
      
    // this.getPaymode(index)
    // this.getERA(4,index)
    
  }
  creditsaved:boolean = false
  showcreditedit(){
    this.creditsaved = false
    // this.modificationFlag = 'edit'
    }
    gettdschoosen(tdsdata) {
      console.log("tdsdata", tdsdata)
      if (this.aptypeid != 13) {
        if (tdsdata?.id == 0) {
          const creditdtlsdatas = this.expenceform.value.creditdtl
          let chkadv_or_crn = creditdtlsdatas.filter (x=>x.paymode_id.code =='PM006' || x.paymode_id.code =='PM011')
          if(chkadv_or_crn.length >0)
          {
            // this.toastr.error("Kindly select TDS before the Advance or CRN Liquidation.")
            return false
          }
  
          this.addcreditSection(0,'PM004')
  
          
  
        } else {
          this.showthreshold= false
          const creditdtlsdatas = this.expenceform.value.creditdtl
     
          for (let i = 1; i < this.expenceform.value.creditdtl.length; i++) {
            if(this.expenceform.value.creditdtl[i].paymode_id.code =='PM007')
            {
            this.removecreditSection(i,'TDS')
            }
          }
        }
      }
    }
 
  accdata: any
  accnumm: any
  // getaccno(paymode, index) {
  //   // console.log("suppid",this.suppid)
  //   this.taService.getbankaccno(paymode, this.suppid)
  //     .subscribe(res => {
  //       if(res['data'] != undefined)
  //       {
  //         this.accList = res['data']
  //         console.log("account details...", this.accList)
  //         if (this.accList?.length == 1)
  //         {
  //           this.accdata = this.accList[0]?.id
  //           this.accnumm = this.accList[0]?.account_no
           
  //           this.expenceform.get('creditdtl')['controls'][index].get('accno').setValue(this.accdata) 
  //           this.getcreditpaymodesummary(index)                    
  //         } 
  //         else if (this.accList?.length > 1)
  //         {
  //           let credAccNo = this.expenceform.get('creditdtl')['controls'][index].get('refno').value
  //           if (credAccNo != "")
  //           {
  //             let id = this.accList.filter(x => x.account_no == credAccNo)[0]?.id
  //             if (id != undefined && id != null)
  //             {
  //               this.expenceform.get('creditdtl')['controls'][index].get('accno').setValue(id) 
  //               this.accnumm = credAccNo
  //             }              
  //           }   
  //         }         
  //       }
  //     })

  // }
  amtChangeFlag = [true,true,true,true,true,true,true,true]
  taxableCalc = false
  CreditDessss(pay, index, taxtype ="", getcred = false) {
    if(pay.name != "LIQ"){
      if(pay.paymode_details?.data?.length != 0){
        this.creditsaved = false
      }
      else{
        this.notification.showError("Paymode Details Empty")
        this.creditsaved = true
      }
    }
    console.log("paycode",pay)
    this.getcreditindex = index

    const creditdtlsdatas = this.expenceform.value.creditdtl
   

    console.log("pay",pay)
    this.paymodecode[index] = pay.code
    if(pay.gl_flag === "Payable")
    {
      this.expenceform.get('creditdtl')['controls'][index].get('amountchange').reset()
      this.expenceform.get('creditdtl')['controls'][index].get('taxableamount').reset()
      this.expenceform.get('creditdtl')['controls'][index].get('suppliertaxtype').reset()
      this.expenceform.get('creditdtl')['controls'][index].get('suppliertaxrate').reset()
     
      this.amtChangeFlag[index] = false
      // this.payableSelected = true
      let paymode_details=pay.paymode_details ? pay.paymode_details:undefined
      console.log("paymode_details>>",paymode_details)
      if(paymode_details!=undefined && pay.name != "LIQ")
      {
        let gl=paymode_details['data'][0]?.glno
        let catcode = paymode_details['data'][0]?.category_id?.code
        let subcat = paymode_details['data'][0]?.sub_category_id?.code
        this.expenceform.get('creditdtl')['controls'][index].get('category_code').setValue(catcode)
        this.expenceform.get('creditdtl')['controls'][index].get('subcategory_code').setValue(subcat)
        this.expenceform.get('creditdtl')['controls'][index].get('glno').setValue(gl)
       }
    }
    else
    {
      this.payableSelected = false
    }

    if (this.paymodecode[index] === 'PM004' )
     {
       
       if(this.paymodecode[index] == 'PM004')
       {
        this.getERA(pay.id,index,'')
       }
      this.showaccno[index] = true     
      }
   
    

  }
  addPPXline()
  {
    // if(this.creditsaved == false )
    // {
    //   this.addcreditSection(0,'PM006')
    //   this.showppxmodal = true
    // }
  }
  getCreditSections(form) {
    return form.controls.creditdtl.controls;
  }
  getPaymode(ind) {
    this.payableSelected = false

    let text =""
    if(this.aptypeid == 7)
    {
      text ="cr"
    }
    this.taservice.getallPaymode()
    .subscribe((results: any[]) => {
      let paymodedata = results["data"];
      this.PaymodeList = paymodedata;
      console.log("paymodelist",this.PaymodeList)
      this.PaymodeList = paymodedata.filter(pay => pay.code === 'PM004')
      this.getERA(this.PaymodeList,ind,'')

      const creditdtlsdatas = this.expenceform.value.creditdtl
      for (let i=0; i < creditdtlsdatas.length; i++) 
      {
        let paymodecode = creditdtlsdatas[i].paymode_id?.code
        let gl_flag = this.PaymodeList.filter(pay => pay.code === paymodecode)[0]?.gl_flag
        if (gl_flag === 'Payable' && ind !== i)
        {
          this.payableSelected = true
          break;
        }
        else
        {
          this.payableSelected = false
        }
      }
      if(this.aptypeid == 3 && ind == 0)
      {
        this.PaymodeList  =paymodedata.filter(pay => (this.payableSelected === false && pay.code === 'PM004')  )
      }
    
      else if(this.aptypeid == 4 && this.ppxid  == "E" && ind == 0)
      {
        this.PaymodeList  =paymodedata.filter(pay => (this.payableSelected === false && pay.code === 'PM004'))
      }
      // 
    })   
  }
  accountno: any
  getacc(accountno, index) {

    this.accountno = accountno
    this.getcreditpaymodesummary(index)
  }
  getcreditpaymodesummary(index) {
    if (this.accountno === undefined) {
      this.accountnumber = this.accnumm
    } else {
      this.accountnumber = this.accountno
    }
    this.taservice.getcreditpaymodesummaryy(1,this.id,4,this.accountnumber)
      .subscribe((results: any[]) => {
        if(results)
        {
          let datas = results["data"];
        this.creditListed = datas
        console.log("cpres", datas)
        for (let i of this.creditListed) {

          let accno = i.account_no
          let bank = i.bank_id.name
          let branch = i.branch_id.name
          let ifsc = i.branch_id.ifsccode
          let beneficiary = i.beneficiary
          this.creditids = i.bank_id.id

          this.expenceform.get('creditdtl')['controls'][index].get('refno').setValue(accno)
          this.expenceform.get('creditdtl')['controls'][index].get('bank').setValue(bank)
          this.expenceform.get('creditdtl')['controls'][index].get('branch').setValue(branch)
          this.expenceform.get('creditdtl')['controls'][index].get('ifsccode').setValue(ifsc)
          this.expenceform.get('creditdtl')['controls'][index].get('benificiary').setValue(beneficiary)
        }
        
        }
        
      })
  }
  getEraAccDet(acc,ind)
{
  this.expenceform.get('creditdtl')['controls'][ind].get('accno').setValue(acc.id)
  this.expenceform.get('creditdtl')['controls'][ind].get('refno').setValue(acc.acno)
  this.expenceform.get('creditdtl')['controls'][ind].get('bank').setValue(acc.bank_id?.name)
  this.expenceform.get('creditdtl')['controls'][ind].get('branch').setValue(acc.bankbranch_id?.name)
  this.expenceform.get('creditdtl')['controls'][ind].get('ifsccode').setValue(acc.bankbranch_id?.ifsccode)
  this.expenceform.get('creditdtl')['controls'][ind].get('benificiary').setValue(acc.beneficiaryname)
}
public displayPaymode(paymode?: paymodelistss): string | undefined {
  return paymode ? paymode.name : undefined;
}
public displayFnFilter(filterdata?: taxtypefilterValue | any): string | undefined {
  if(filterdata.subtax !== undefined )
  {
  return filterdata ? filterdata.subtax.name + " - " + filterdata.subtax.glno : undefined;
  }
  else
  {
    return filterdata
  }
}
gettaxtypeScroll() {
  // setTimeout(() => {
  //   if (
  //     this.mattactypeAutocomplete &&
  //     this.mattactypeAutocomplete &&
  //     this.mattactypeAutocomplete.panel
  //   ) {
  //     fromEvent(this.mattactypeAutocomplete.panel.nativeElement, 'scroll')
  //       .pipe(
  //         map(x => this.mattactypeAutocomplete.panel.nativeElement.scrollTop),
  //         takeUntil(this.autocompleteTrigger.panelClosingActions)
  //       )
  //       .subscribe(x => {
  //         const scrollTop = this.mattactypeAutocomplete.panel.nativeElement.scrollTop;
  //         const scrollHeight = this.mattactypeAutocomplete.panel.nativeElement.scrollHeight;
  //         const elementHeight = this.mattactypeAutocomplete.panel.nativeElement.clientHeight;
  //         const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //         if (atBottom) {
  //           if (this.has_next === true) {
  //             this.service.gettdstaxtype1Scroll(this.vendorid, this.currentpage + 1)
  //               .subscribe((results: any[]) => {
  //                 let datas = results["data"];
  //                 let datapagination = results["pagination"];
  //                 if (this.taxlist.length >= 0) {
  //                   this.taxlist = this.taxlist.concat(datas);
  //                   this.has_next = datapagination.has_next;
  //                   this.has_previous = datapagination.has_previous;
  //                   this.currentpage = datapagination.index;
  //                 }
  //               })
  //           }
  //         }
  //       });
  //   }
  // });
}
subtaxid: any;




  creditaddonindex: any
  getcreditindex: any
  amountchangedata: any
  creditindex:any

 
  delcreditid: any
 
  submitcredit() {
    // this.expenceform.get('creditdtl')['controls'][index].get('refno')
   let payload=[]
   let data={}
    for(let i=0;i<this.expenceform.get('creditdtl')['value'].length;i++){

      
      
          data ={ "tour_id": this.id,
          "paymode_id": this.paymode_id,
          "bank_id": this.bank_id,
          "glno":  this.expenceform.get('creditdtl')['value'][i]['glno'],
          "account_no":  this.expenceform.get('creditdtl')['value'][i]['accno'],
          "amount":  this.expenceform.get('creditdtl')['value'][i]['amount'],
          "id":this.expenceform.get('creditdtl')['value'][i]['id'],
          // "type": "claim"
          "type": this.expenceform.get('creditdtl')['value'][i]['type']
        
        }
        payload.push(data);
      }
  
    this.taservice.createtourcreditdetails(payload)
      .subscribe((res) => {
        this.SpinnerService.hide();
      if (res.status=="success"){
        this.toastr.success(res.message);
        this.router.navigateByUrl('ta/exedit');
        this.getERA(4,0,'Submited')
     

      }
   
      if (res.code=="INVALID_DATA" ||res.code=="INVALID_FILETYPE"||res.code=="INVALID_DATA"||res.code=="UNEXPECTED_ERROR"){
       
        this.toastr.error(res.description);
        
    }
   
    },
    (error)=>{
      this.toastr.error(error.status+error.statusText);
      this.SpinnerService.hide();
    }
    )
  
    
   
  }
  getcreditrecords(datas) {
    
  }
  creditdetails() {
    let group = new FormGroup({
      // invoiceheader_id: new FormControl(this.apinvHeader_id),
      paymode_id: new FormControl(''),
      creditbank_id: new FormControl(''),
      subtax_id: new FormControl(''),
      glno: new FormControl(0),
      refno: new FormControl(''),
      suppliertaxtype: new FormControl(''),
      suppliertaxrate: new FormControl(''),
      taxexcempted: new FormControl('No'),
      amount: new FormControl(0),
      amountchange: new FormControl(''),
      taxableamount: new FormControl(0),
      // ddtranbranch: new FormControl(this.transaction_branch),
      ddpaybranch: new FormControl(0),
      category_code: new FormControl(''),
      subcategory_code: new FormControl(''),
      branch: new FormControl(''),
      benificiary: new FormControl(''),
      bank: new FormControl(''),
      ifsccode: new FormControl(''),
      accno: new FormControl(''),
      credittotal: new FormControl(''),
      debitbank_id: new FormControl(''),
      bs_code: new FormControl(''),
      cc_code: new FormControl(''),
      ccbspercentage: new FormControl(''),
      entry_type: new FormControl(2),
      id:new FormControl(''),
      type:new FormControl('')
     })
  
   group.get('amountchange').valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {

     
      if (!this.expenceform.valid) {
        return;
      }
      // this.linesChange.emit(this.expenceform.value['creditdtl']);
    }
    )
    return group
  }
  optionsummary = false
  firstsummary = true
  creditListed: any
  arraydata: any
  accno: any
  creditids: any
  bankdetailsids : any
  accountnumber: any

  getbankdetailsid(det:any)
  {
    this.bankdetailsids = det
  }
  taxrateid: any
  taxratename: any
  vendorid: any
  maintaintaxlist: any
  othertaxlist: any
 
  eraaccno:any
  
  getERA(paymodeid,ind,data) {

    let accno:''
    this.SpinnerService.show()
    this.taservice.getcreditpaymodesummaryy(1,this.id, paymodeid, accno)
        .subscribe(result => {
          this.SpinnerService.hide();
          if(result.code!=''&& result.code!=undefined && result.code!=null ){
            this.notification.showError(result.code);
            this.notification.showError(result.description);
          }
          else{
            if(paymodeid == '4'){
           
              this.ERAList = result.data
          
              if(this.ERAList?.length >0)
              {
                for(let i=0;i<this.ERAList.length;i++){
                  let accdtls = this.ERAList[i]
                  if(i>0 && data==''){
                   this.addcreditSection()
                  }
              //  let accdtls = this.ERAList[0]
               this.paymodecode = accdtls?.paymode?.code
               this.paymode_id= accdtls?.paymode?.id
               this.creditids = accdtls?.bank?.id
               this.bank_id= accdtls?.bank?.id
               this.expenceform.get('creditdtl')['controls'][i]?.get('paymode_id').setValue(accdtls?.paymode?.name)
               this.expenceform.get('creditdtl')['controls'][i]?.get('accno').setValue(accdtls?.account_number)
               this.expenceform.get('creditdtl')['controls'][i]?.get('refno').setValue(accdtls?.crno)
               this.expenceform.get('creditdtl')['controls'][i]?.get('bank').setValue(accdtls?.bank?.name)
               this.expenceform.get('creditdtl')['controls'][i]?.get('branch').setValue(accdtls?.bankbranch?.name)
               this.expenceform.get('creditdtl')['controls'][i]?.get('ifsccode').setValue(accdtls?.bankbranch?.ifsccode)
               this.expenceform.get('creditdtl')['controls'][i]?.get('benificiary').setValue(accdtls?.beneficiary_name)
               this.expenceform.get('creditdtl')['controls'][i]?.get('glno').setValue(accdtls?.credit_details[ind]?.glno)
               this.expenceform.get('creditdtl')['controls'][i]?.get('amount').setValue(accdtls?.credit_details[ind]?.sum_of_approved_amount)
               this.expenceform.get('creditdtl')['controls'][i]?.get('id').setValue(accdtls?.credit_details[ind]?.id)
               this.expenceform.get('creditdtl')['controls'][i]?.get('type').setValue(accdtls?.credit_details[ind]?.type)
               this.cdtsum=Math.abs(accdtls?.net_amount)
                }
              }
              if(this.ERAList?.length == 0){
                window.alert("Employee don't have an Account Number")
                return false
              }
            }
          
            else {
            this.toastr.warning("Employee don't have an Account Number and against era number are missing")
            }
          }
        })
        
  }
  cdtamt: any
  // cdtsum: any
  creditdatasums() {
    this.cdtamt = this.expenceform.value['creditdtl'].map(x => String(x.amount).replace(/,/g, ''));
    this.cdtsum =  Math.abs(this.cdtamt.reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2);
    }
    removecreditSection(i,paymodename) {
      const control = <FormArray>this.expenceform.get('creditdtl');
      control.removeAt(i);
      let dta1 = this.expenceform.value.creditdtl
      this.notification.showSuccess( paymodename + " line deleted Successfully")
   
      if(dta1.length === 1){
        let num:number = +this.totalamount
        let amt = new Intl.NumberFormat("en-GB").format(num); 
        amt = amt ? amt.toString() : '';
        this.expenceform.get('creditdtl')['controls'][0].get('amount').setValue(amt)
      }
  
      const creditdtlsdatas = this.expenceform.value.creditdtl
    
      for(let i = 0; i<creditdtlsdatas.length; i++)
      {
        if(creditdtlsdatas[i].paymode_id.code == 'PM006' || creditdtlsdatas[i].paymode_id.gl_flag === "Payable")
          this.amtChangeFlag[i] = false
        else
          this.amtChangeFlag[i] = true
      }
      this.creditdatasums()
    }
    selectedFiles:File[]=[];
    
    onFile_Selecteds(event:any):void{
      const files: FileList = event.target.files;
      for (let i = 0; i < files.length; i++) {
        this.selectedFiles.push(files[i]);
      }
    }
    getselectedFiles(){
        if (this.selectedFiles.length > 0) {
          const formData = new FormData();
          this.selectedFiles.forEach((file) => {
            formData.append('files', file, file.name);
          });
        }
     
    }
    deletefileUpload(i){
      this.selectedFiles.splice(i, 1);
    }
    @ViewChild('closedbuttons') closedbuttons;
fileback() {
  this.closedbuttons.nativeElement.click();
}

showimageHeaderPreview: boolean = false
showimageHeaderPreviewPDF: boolean = false
pdfurl: any
filepreview(files) {
  let stringValue = files.name.split('.')
  let extension = stringValue[stringValue.length-1]
  
  if (extension === "png" || extension === "jpeg" || extension === "jpg" ||
    extension === "PNG" || extension === "JPEG" || extension === "JPG") {
    // this.showimageHeaderPreview = true
    // this.showimageHeaderPreviewPDF = false
    const reader: any = new FileReader();
    reader.readAsDataURL(files);
    reader.onload = (_event) => {
    this.jpgUrls = reader.result
    const newTab = window.open();
    newTab.document.write('<html><body><img style="width: 500px;" src="' + this.jpgUrls + '" "/></body></html>');
    newTab.document.close();
    }
  }
 
  if (extension === "pdf" || extension === "PDF") {
    const reader: any = new FileReader();
    reader.onload = (_event) => {
      const fileData = reader.result;
      const blob = new Blob([fileData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    };
    reader.readAsArrayBuffer(files);
  }
  if (extension === "csv" || extension === "ods" || extension === "xlsx" || extension === "txt" ||
    extension === "ODS" || extension === "XLSX" || extension === "TXT") {
    this.showimageHeaderPreview = false
    this.showimageHeaderPreviewPDF = false
  }
}
trimComments() {
  if (this.tourmodell.comments) {
    this.tourmodell.comments = this.tourmodell.comments.trim();
  }
}
}
