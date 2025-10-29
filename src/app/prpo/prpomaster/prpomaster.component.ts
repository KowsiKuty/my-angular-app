import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, startWith, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, from, fromEvent } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../error-handling-service.service'
import { DatePipe } from "@angular/common";
export interface Emplistss {
  id: string;
  full_name: string;
}
export interface comlistss {
  id: string;
  name: string;
}
export interface bslistss {
  id: string;
  name: string;
}
export interface cclistss {
  id: string;
  name: string;
}
export interface catlistss {
  id: string;
  name: string;
}
export interface prodlistss {
  id: string;
  name: any;
}

@Component({
  selector: 'app-prpomaster',
  templateUrl: './prpomaster.component.html',
  styleUrls: ['./prpomaster.component.scss']
})
export class PrpomasterComponent implements OnInit {
  commoditySearchForm: FormGroup;
  delmatSearchForm: FormGroup;
  delmatapprovalSearchForm: FormGroup;
  productSearchForm: FormGroup;
  prodsearchformg: FormGroup;

  prpomasterList: any
  urls: string;
  urlcommodity;
  urldelmatmaker;
  urldelmatapprover;
  ismakerCheckerButton: boolean;
  roleValues: string;
  addFormBtn: any;

  isCommodity: boolean;
  isCommodityForm: boolean;
  isDelmatMakers: boolean;
  isDelmatMakerForm: boolean;
  isDelmatApproval: boolean;

  approvalForm: FormGroup
  rejectForm: FormGroup


  editApcatPopup: boolean;
  editApsubcatPopup: boolean;

  isdelmatappPagination: boolean;
  delmatappnodatafound: boolean

  presentpagecom: number = 1;
  has_nextcom = true;
  has_previouscom = true;

  presentpagedel: number = 1;
  has_nextdel = true;
  has_previousdel = true;

  presentpagedelapp: number = 1;
  has_nextdelapp = true;
  has_previousdelapp = true;

  pageSize = 10;

  commodityList: any;
  delmatList: any;
  delmatappList: any;
  prodList: any;

  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  nodata = false
  name: string
  no: string
  code: string

  employeeList: Array<Emplistss>;
  employee_id = new FormControl();

  commodityLists: Array<comlistss>;
  commodity_id = new FormControl();

  productList: prodlistss[];
  public chipSelectedprod: prodlistss[] = [];
  public chipSelectedprodid = [];
  product_id = new FormControl();


  delmattypeList: Array<any>;
  isdelmatappnodatafound: boolean;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @ViewChild('emp') matempAutocomplete: MatAutocomplete;
  @ViewChild('empInput') empInput: any;
  @ViewChild('prodserachinp') prodserachinp: any;
  @ViewChild('com') matcomAutocomplete: MatAutocomplete;
  @ViewChild('prodser') matcomAutocompleteprodser: MatAutocomplete;
  @ViewChild('comInput') comInput: any;

  @ViewChild('empapproval') matempappAutocomplete: MatAutocomplete;
  @ViewChild('empappInput') empappInput: any;
  @ViewChild('comapproval') matcomappAutocomplete: MatAutocomplete;
  @ViewChild('comappInput') comappInput: any;


  @ViewChild('prod') matprodAutocomplete: MatAutocomplete;
  @ViewChild('prodInput') prodInput: any;


  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;


  assetlist = [{ 'id': '1', 'name': '1', 'show': 'Yes' },
  { 'id': '2', 'name': '0', 'show': 'No' }]
  gstblockedlist = [{ 'id': '1', 'show': 'Yes', 'name': '1' },
  { 'id': '2', 'show': 'No', 'name': '0' }]
  gstrcmlist = [{ 'id': '1', 'show': 'Yes', 'name': '1' },
  { 'id': '2', 'show': 'No', 'name': '0' }]
  statuslist = [{ 'id': '1', 'show': 'Active', 'name': 1 },
  { 'id': '2', 'show': 'Inactive', 'name': 0 }]

  ActiveInactive = [
    { value: 0, display: 'Active' },
    { value: 1, display: 'Inactive' },
    // { value: 0, display: 'All' }
  ]


  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  constructor(private fb: FormBuilder, private router: Router,
      public datepipe: DatePipe,
    private shareService: SharedService, private dataService: PRPOSERVICEService,
    private prposhareService: PRPOshareService, private toastr: ToastrService, private notification: NotificationService, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService
    ) {

  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  ngOnInit(): void {

    let datas = this.shareService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "Procurement Master") {
        this.prpomasterList = subModule;
        // this.isCommodity = subModule[0].name;
        // console.log("prpomastermenuList", this.prpomasterList)
      }
    })

    this.commoditySearchForm = this.fb.group({
      code: "",
      activeinactive:"",
      name: ""
    })
    this.delmatSearchForm = this.fb.group({
      employee_id: [''],
      commodity_id: [''],
      type: [''],
      activeinactive:[''],
    })
    this.delmatapprovalSearchForm = this.fb.group({
      employee_id: [''],
      commodity_id: [''],
      type: [''],
    })


    this.approvalForm = this.fb.group({
      id: '',
      remarks: '' 
    })
    this.rejectForm = this.fb.group({
      id: '',
      remarks: ''
    })

    this.productSearchForm = this.fb.group({
      commodity_id: ''
    })
     this.prodsearchformg = this.fb.group({
      prod:['']
    })
    /////////////delmat maker search
    let empkeyvalue: String = "";
    this.getemployeeFK(empkeyvalue);
    this.delmatSearchForm.get('employee_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          //console.log('inside tap')

        }),
        switchMap(value => this.dataService.getemployeeFKdd(value, 1)
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

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })


    let comkeyvalue: String = "";
    this.getcommodityFK(comkeyvalue);
    this.delmatSearchForm.get('commodity_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;

        }),
        switchMap(value => this.dataService.getcommodityFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.commodityLists = datas;

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

    //////////////////////delmat approval
    this.getemployeeFKapp(empkeyvalue);
    this.delmatapprovalSearchForm.get('employee_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          //console.log('inside tap')

        }),
        switchMap(value => this.dataService.getemployeeFKdd(value, 1)
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

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })


    this.getcommodityFKapp(comkeyvalue);
    this.delmatapprovalSearchForm.get('commodity_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          //console.log('inside tap')

        }),
        switchMap(value => this.dataService.getcommodityFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.commodityLists = datas;

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })




    let prodkeyvalue: String = "";
    this.getproduct(prodkeyvalue);
    this.product_id.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getproductKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )




    this.getdelmattype();

  }

  subModuleData(data) {
    this.urls = data.url;
    this.urlcommodity = "/commodity";
    this.urldelmatmaker = "/delmatmaker";
    this.urldelmatapprover = "/delmatapprover";

    this.isCommodity = this.urlcommodity === this.urls ? true : false;
    this.isDelmatMakers = this.urldelmatmaker === this.urls ? true : false;
    this.isDelmatApproval = this.urldelmatapprover === this.urls ? true : false;
    this.roleValues = data.role[0].name;
    this.addFormBtn = data.name;

    if (this.isCommodity) {
      this.getcommodity(1);
      this.isCommodity = true;
      this.isCommodityForm = false;
      this.isDelmatApproval = false;
      this.isDelmatMakers = false;
      this.isDelmatMakerForm = false;

    } else if (this.isDelmatMakers) {
      this.getdelmat(1);
      this.isCommodity = false;
      this.isCommodityForm = false;
      this.isDelmatMakers = true;
      this.isDelmatMakerForm = false;
      this.isDelmatApproval = false;
    } else if (this.isDelmatApproval) {
      this.getdelmatapproval();
      this.isCommodity = false;
      this.isCommodityForm = false
      this.isDelmatMakers = false;
      this.isDelmatMakerForm = false;
      this.isDelmatApproval = true;
    }
    if (this.roleValues === "Maker") {
      this.ismakerCheckerButton = true;
    } else if (this.roleValues === "Checker") {
      this.ismakerCheckerButton = false;
    }
  }
  addForm() {
    if (this.addFormBtn === "Commodity") {
      this.isCommodityForm = true;
      this.isCommodity = false;
      this.ismakerCheckerButton = false;
    } else if (this.addFormBtn === "Delmat Maker") {
      this.isDelmatMakerForm = true;
      this.ismakerCheckerButton = false
      this.isDelmatMakers = false;
    }
  }

  ////////////////////////Validation dropdown 
  private SelectionValidator(fcvalue: FormControl) {
    if (typeof fcvalue.value === 'string') {
      return { incorrectValue: `Selected value only Allowed` }
    }
    return null;
  }

  ///////////////////////////   TABS
  Apcategory() {
    this.isCommodity = false;
    this.isCommodityForm = false;
    this.isDelmatMakers = false;
    this.isDelmatMakerForm = false;
    this.isDelmatApproval = false;
  }
  ApSubcategory() {
    this.isCommodity = false;
    this.isCommodityForm = false
    this.isDelmatMakers = false;
    this.isDelmatMakerForm = false;
    this.isDelmatApproval = false;
  }


  CC() {
    this.isCommodity = false;
    this.isCommodityForm = false
    this.isDelmatMakerForm = false;
    this.isDelmatApproval = false;
    this.isDelmatMakers = false;
  }
  BS() {
    this.isCommodity = false;
    this.isCommodityForm = false
    this.isDelmatMakerForm = false;
    this.isDelmatApproval = false;
    this.isDelmatMakers = false;
  }

  BSCC() {
    this.isCommodity = false;
    this.isCommodityForm = false
    this.isDelmatMakerForm = false;
    this.isDelmatApproval = false;
    this.isDelmatMakers = false;
  }



  //////////////////    ADD
  addcom() {
    this.isDelmatMakerForm = false;
    this.isDelmatApproval = false;
    this.isDelmatMakers = false;

    this.isCommodity = false;
    this.isCommodityForm = true;
  }
  adddel() {
    this.isCommodity = false;
    this.isCommodityForm = false;
    this.isDelmatApproval = false;

    this.isDelmatMakerForm = true;
    this.isDelmatMakers = false;
  }

  //////////////         COMMODITY SUMMARY GET
  getcommodity(page) {
    this.SpinnerService.show()
    let name:any;
    let code:any;
    let status:any;
    if(this.commoditySearchForm.get('name').value == undefined ||this.commoditySearchForm.get('name').value ==null ||this.commoditySearchForm.get('name').value=='' ){
      name='';
    }else{
      name=this.commoditySearchForm.get('name').value;
    }
    if(this.commoditySearchForm.get('code').value ==undefined ||this.commoditySearchForm.get('code').value ==null || this.commoditySearchForm.get('code').value==''){
      code='';
    }else{
      code=this.commoditySearchForm.get('code').value;
    }
    if(this.commoditySearchForm.get('activeinactive').value == undefined ||this.commoditySearchForm.get('activeinactive').value== null || this.commoditySearchForm.get('activeinactive').value=='' ){
      status=this.commoditySearchForm.get('activeinactive').value;
    }else{
      status=this.drpdwn[this.commoditySearchForm.get('activeinactive').value]
    }


    this.dataService.getcommoditysummary(page,name,code,status)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.commodityList = datas;
        if (this.commodityList.length > 0) {
          this.has_nextcom = datapagination.has_next;
          this.has_previouscom = datapagination.has_previous;
          this.presentpagecom = datapagination.index;
        }
      })

  }
  nextClickcom() {
      if (this.has_nextcom === true) {
        this.getcommodity(this.presentpagecom + 1)
      }
    
  
  }

  previousClickcom() {
      if (this.has_previouscom === true) {
        this.getcommodity(this.presentpagecom - 1)
      }   
  }
  commoditySubmit() {
    this.resetcom();
    this.ismakerCheckerButton = true;
    this.isCommodity = true;
    this.isCommodityForm = false;
  }
  commodityCancel() {
    this.ismakerCheckerButton = true;
    this.isCommodity = true;
    this.isCommodityForm = false;
  }
  resetcom() {
    this.commoditySearchForm.controls['code'].reset("")
    this.commoditySearchForm.controls['name'].reset("")
    this.commoditySearchForm.controls['activeinactive'].reset("")
    this.getcommodity(1);
    return
  }
  // commoditySearchcom() {
  //   if (this.commoditySearchForm.value.code === '' && this.commoditySearchForm.value.name === '') {
  //     this.getcommodity();
  //     return
  //   }
  //   if (this.commoditySearchForm.value.code === null && this.commoditySearchForm.value.name === null) {
  //     this.getcommodity();
  //     return false
  //   }
  //   let code = this.commoditySearchForm.value.code
  //   let name = this.commoditySearchForm.value.name
  //   this.SpinnerService.show()
  //   this.dataService.getCommoditySearch(code, name)
  //     .subscribe(result => {
  //       this.SpinnerService.hide()
  //       let datapagination =result["pagination"]
  //       this.commodityList = result['data']
  //       if (this.commodityList.length > 0) {
  //         this.has_nextcom = datapagination.has_next;
  //         this.has_previouscom = datapagination.has_previous;
  //         this.presentpagecom = datapagination.index;
  //       }

  //     })
  //   if (this.commoditySearchForm.value.code === '' && this.commoditySearchForm.value.name === '') {
  //     this.getcommodity();
  //   }
  // }
  // Inactivelistcommadity(pageNumber=1,pagesize=10){
  //   this.SpinnerService.show();
  //   this.dataService.getcommadityInactivelist(pageNumber, pagesize).subscribe((results: any[]) => {
  //       this.SpinnerService.hide();
  //       let datas = results["data"];
  //       let datapagination = results["pagination"];
  //       this.commodityList = datas;
  //       if (this.commodityList.length > 0) {
  //         this.has_nextcom = datapagination.has_next;
  //         this.has_previouscom = datapagination.has_previous;
  //         this.presentpagecom = datapagination.index;
  //       }
  //     })
  // }
  // activelistcommadity(pageNumber = 1, pagesize = 10) {
  //    this.SpinnerService.show();
  //   this.dataService.getcommadityactivelist(pageNumber, pagesize).subscribe((results: any[]) => {
  //       this.SpinnerService.hide();
  //       let datas = results["data"];
  //       let datapagination = results["pagination"];
  //       this.commodityList = datas;
  //       if (this.commodityList.length > 0) {
  //         this.has_nextcom = datapagination.has_next;
  //         this.has_previouscom = datapagination.has_previous;
  //         this.presentpagecom = datapagination.index;
  //       }
  //     })
  // }
  

  forInactive(data) {
    let datas = data.id
    let status_action: number = 0
    this.SpinnerService.show()
    this.dataService.activeInactiveCommodity(datas, status_action)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        this.notification.showSuccess('Successfully InActivated!')
        this.resetcom();
        return true
      })
  }
  foractive(data) {
    let datas = data.id
    let status_action: number = 1
    this.SpinnerService.show()
    this.dataService.activeInactiveCommodity(datas, status_action)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        this.notification.showSuccess('Successfully Activated!')
        this.resetcom();
        return true
      })
  }
  //////////////delmat
  drpdwn: any = { 'ACTIVE': 1, 'INACTIVE': 0, 'ALL': 2 };

  getdelmat(page) {
    this.SpinnerService.show()
    let emp_id:any;
    let com_id:any;
    let type:any;
    let status:any;
    if(this.delmatSearchForm.get('employee_id').value.id == undefined || this.delmatSearchForm.get('employee_id').value==null || this.delmatSearchForm.get('employee_id').value==''){
      emp_id='';
    }else{
      emp_id=this.delmatSearchForm.get('employee_id').value.id;
    }
    if(this.delmatSearchForm.get('commodity_id').value.id == undefined || this.delmatSearchForm.get('commodity_id').value==null || this.delmatSearchForm.get('commodity_id').value==''){
      com_id='';
    }else{
      com_id=this.delmatSearchForm.get('commodity_id').value.id;
    }
    if(this.delmatSearchForm.get('type').value == undefined || this.delmatSearchForm.get('type').value==null || this.delmatSearchForm.get('type').value==''){
      type='';
    }else{
      type=this.delmatSearchForm.get('type').value;
    }
    if(this.delmatSearchForm.get('activeinactive').value== undefined || this.delmatSearchForm.get('activeinactive').value== null ||this.delmatSearchForm.get('activeinactive').value == ''){
      status='';
    }else{
      status = this.drpdwn[this.delmatSearchForm.get('activeinactive').value]
    }
   
   
      this.dataService.getdelmatsummary(page,emp_id,com_id,type,status)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide()
        let datapagination = results["pagination"];
        this.delmatList = datas;
        if (this.delmatList.length > 0) {
          this.has_nextdel = datapagination.has_next;
          this.has_previousdel = datapagination.has_previous;
          this.presentpagedel = datapagination.index;
        }
      })

  }
  delmatDownload(){
    let emp_id;
    let com_id;
     if(this.delmatSearchForm.get('employee_id').value.id == undefined || this.delmatSearchForm.get('employee_id').value==null || this.delmatSearchForm.get('employee_id').value==''){
      emp_id='';
    }else{
      emp_id=this.delmatSearchForm.get('employee_id').value.id;
    }
    if(this.delmatSearchForm.get('commodity_id').value.id == undefined || this.delmatSearchForm.get('commodity_id').value==null || this.delmatSearchForm.get('commodity_id').value==''){
      com_id='';
    }else{
      com_id=this.delmatSearchForm.get('commodity_id').value.id;
    }
    this.SpinnerService.show()
    this.dataService
      .delmatDownload(com_id,emp_id)
      .subscribe((data: any) => {
        this.SpinnerService.hide()
        if (data.type == "application/json") {
            this.notification.showError('No Data Found.');
            return false;
          } else {
              let binaryData = [];
              binaryData.push(data);
              let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
              let link = document.createElement("a");
              link.href = downloadUrl;
              link.download = 'Delmat_'+ this.datepipe.transform(new Date(), "dd/MM/yyyy") + ".xlsx";
              link.click();
          }
      }, (error) => {
          this.SpinnerService.hide()
          this.errorHandler.handleError(error);          
        });
  }
  nextClickdel() {
      if (this.has_nextdel === true) {
        this.getdelmat(this.presentpagedel + 1)
      }  
  }

  previousClickdel() {   
      if (this.has_previousdel === true) {
        this.getdelmat(this.presentpagedel - 1)
      }
       
  }
  delSubmit() {
    this.getdelmat(1);
    this.getdelmatapproval();
    this.isDelmatMakers = true;
    this.isDelmatMakerForm = false;
  }
  delCancel() {
    this.isDelmatMakers = true;
    this.isDelmatMakerForm = false;
  }

  delmatEdit(data) {
    this.prposhareService.DelmatEdit.next(data);
    return data;
  }
  
  autocompleteempScroll() {
    setTimeout(() => {
      if (
        this.matempAutocomplete &&
        this.autocompleteTrigger &&
        this.matempAutocomplete.panel
      ) {
        fromEvent(this.matempAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matempAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matempAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matempAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matempAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getemployeeFKdd(this.empInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeeList = this.employeeList.concat(datas);
                    // console.log("emp", datas)
                    if (this.employeeList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  },(error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }

  public displayFnemp(emp?: Emplistss): string | undefined {
    return emp ? emp.full_name : undefined;
  }

  get emp() {
    return this.delmatSearchForm.get('employee_id');
  }




  autocompleteempapprovalScroll() {
    setTimeout(() => {
      if (
        this.matempappAutocomplete &&
        this.autocompleteTrigger &&
        this.matempappAutocomplete.panel
      ) {
        fromEvent(this.matempappAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matempappAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matempappAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matempappAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matempappAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getemployeeFKdd(this.empappInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeeList = this.employeeList.concat(datas);
                    // console.log("emp", datas)
                    if (this.employeeList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  },(error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }

  public displayFnempapproval(empapproval?: Emplistss): string | undefined {
    return empapproval ? empapproval.full_name : undefined;
  }

  get empapproval() {
    return this.delmatapprovalSearchForm.get('employee_id');
  }

  getemployeeFK(empkeyvalue) {
    this.SpinnerService.show()
    this.dataService.getemployeeFK(empkeyvalue)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["data"];
        this.employeeList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  getemployeeFKapp(empkeyvalue) {
    this.SpinnerService.show()
    this.dataService.getemployeeFK(empkeyvalue)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["data"];
        this.employeeList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  autocompletecomScroll() {
    setTimeout(() => {
      if (
        this.matcomAutocomplete &&
        this.autocompleteTrigger &&
        this.matcomAutocomplete.panel
      ) {
        fromEvent(this.matcomAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcomAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcomAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcomAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcomAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getcommodityFKdd(this.comInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.commodityLists = this.commodityLists.concat(datas);
                    if (this.commodityLists.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  },(error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }

  public displayFncom(com?: comlistss): string | undefined {
    return com ? com.name : undefined;
}

  get com() {
    return this.delmatSearchForm.get('commodity_id');
  }



  autocompletecomappScroll() {
    setTimeout(() => {
      if (
        this.matcomappAutocomplete &&
        this.autocompleteTrigger &&
        this.matcomappAutocomplete.panel
      ) {
        fromEvent(this.matcomappAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcomappAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcomappAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcomappAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcomappAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getcommodityFKdd(this.comappInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.commodityLists = this.commodityLists.concat(datas);
                    if (this.commodityLists.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  },(error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }
  public displayFncomapproval(comapproval?: comlistss): string | undefined {
    return comapproval ? comapproval.name : undefined;
  }

  get comapproval() {
    return this.delmatapprovalSearchForm.get('commodity_id');
  }
  getcommodityFK(comkeyvalue) {
    this.SpinnerService.show()
    this.dataService.getcommodityFK(comkeyvalue)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["data"];
        this.commodityLists = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  getcommodityFKapp(comkeyvalue) {
    this.SpinnerService.show()
    this.dataService.getcommodityFK(comkeyvalue)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["data"];
        this.commodityLists = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  getdelmattype() {
    this.dataService.getdelmattype()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.delmattypeList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  resetdelmak() {
    this.delmatSearchForm.controls['employee_id'].reset("")
    this.delmatSearchForm.controls['commodity_id'].reset("")
    this.delmatSearchForm.controls['type'].reset("")
    this.delmatSearchForm.controls['activeinactive'].reset("")
    this.getdelmat(1);
    return
  }
  forInactivedel(data) {
    let datas = data.id
    let status: number = 0
    this.SpinnerService.show()
    this.dataService.activeInactivedel(datas, status)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        this.notification.showSuccess('Successfully InActivated!')
        this.getdelmat(1);
        return true
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  foractivedel(data) {
    let datas = data.id
    let status: number = 1
    this.SpinnerService.show()
    this.dataService.activeInactivedel(datas, status)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        this.notification.showSuccess('Successfully Activated!')
        this.getdelmat(1);
        return true
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  /////////delmat approval
  getdelmatapproval(pageNumber = 1, pageSize = 10) {
    this.SpinnerService.show()
    this.dataService.getdelmatapp(pageNumber, pageSize)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.delmatappList = datas;
        if (this.delmatappList.length > 0) {
          this.has_nextdelapp = datapagination.has_next;
          this.has_previousdelapp = datapagination.has_previous;
          this.presentpagedelapp = datapagination.index;
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  nextClickdelapp() {
    if (this.has_nextdelapp === true) {
      this.getdelmatapproval(this.presentpagedelapp + 1, 10)
    }
  }

  previousClickdelapp() {
    if (this.has_previousdelapp === true) {
      this.getdelmatapproval(this.presentpagedelapp - 1, 10)
    }
  }
  delappSubmit() {
    this.getdelmatapproval();
    this.isDelmatMakers = true;
    this.isDelmatMakerForm = true;
  }
  delappCancel() {
    this.isDelmatMakers = true;
    this.isDelmatMakerForm = true;
  }
  delmatapprovalId: any
  delappcommodity_id: string;
  delmat_status: string;
  delappemployee_id: string;
  limit: string;
  status: string;
  type: string;
  approval(data) {
    this.delmatapprovalId = data?.id
    this.delappcommodity_id = data?.commodity_id?.name
    this.delmat_status = data?.delmat_status
    this.delappemployee_id = data?.employee_id?.full_name
    this.limit = data?.limit
    this.status = data?.status
    this.type = data?.type


    this.approvalForm.patchValue({
      id: data.id,
    })
    this.rejectForm.patchValue({
      id: data.id,
    })
  }
  approveClick() {
    let data = this.approvalForm.value
    this.dataService.getdelapprovaldata(data)
      .subscribe(result => {
        if (result.code === "INVALID_APPROVER_ID" && result.description === "Invalid Approver Id") {
          this.notification.showError("Maker Not Allowed To Approve")
          return false
        }
        else if(result.code === "UNEXPECTED_ERROR" && result.description === "NOT ALLOWED TO APPROVE DELMAT"){
          this.notification.showError("NOT ALLOWED TO APPROVE DELMAT IN 'PROD' ENVIRONMENT");
        } 
        else {

          this.notification.showSuccess("Successfully Approved")

          this.getdelmatapproval();
          this.approvalForm.controls['remarks'].reset()
          this.getdelmat(1);
          this.getdelmatapproval();
        }
        return true
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  rejectClick() {
    
    let data = this.rejectForm.value
    this.SpinnerService.show()
    this.dataService.getdelrejectdata(data)
      .subscribe(result => {
        this.SpinnerService.hide()
        if (result.code === "INVALID_APPROVER_ID" && result.description === "Invalid Approver Id") {
          this.SpinnerService.hide()
          this.notification.showError("Maker Not Allowed To Reject")
          return false
        }
        else if(result.code === "UNEXPECTED_ERROR" && result.description === "NOT ALLOWED TO REJECT DELMAT"){
          this.notification.showError("NOT ALLOWED TO REJECT IN 'PROD' ENVIRONMENT");
        }  
        else {
          this.SpinnerService.hide()
          this.notification.showError("Successfully Rejected")
        }
        this.rejectForm.controls['remarks'].reset()
        this.getdelmat(1);
        this.getdelmatapproval();
        return true
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  Approval(ApprovalData) {
    this.prposhareService.Delmatappshare.next(ApprovalData);
    this.router.navigate(['/delmatapproval'], { skipLocationChange: true })
  }

  createFormatedelapp() {
    let data = this.delmatapprovalSearchForm.controls;

    let delappSearchclass = new delappSearchtype();
    delappSearchclass.employee_id = data['employee_id'].value.id;
    delappSearchclass.commodity_id = data['commodity_id'].value.id;
    delappSearchclass.type = data['type'].value;
    return delappSearchclass;
  }

  delmatappSearch() {
    let searchdelapp = this.createFormatedelapp();

    for (let i in searchdelapp) {
      if (!searchdelapp[i]) {
        delete searchdelapp[i];
      }
    }
    this.SpinnerService.show()
    this.dataService.getdelmatappSearch(searchdelapp)
      .subscribe(result => {

        this.SpinnerService.hide()

        this.delmatappList = result['data']

        if (searchdelapp.employee_id === '' && searchdelapp.commodity_id === '' && searchdelapp.type === '') {
          this.getdelmatapproval();
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  resetdelapproval() {
    this.delmatapprovalSearchForm.controls['employee_id'].reset('')
    this.delmatapprovalSearchForm.controls['commodity_id'].reset('')
    this.delmatapprovalSearchForm.controls['type'].reset('')
    this.getdelmatapproval();
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  commodname: string;

  commodityforProduct(data) {
    this.prposhareService.CommodityEdit.next(data)
    let commodity = data.id
    let commodityId = data.id
    this.commodname = data.name
    this.productSearchForm.patchValue({
      commodity_id: commodity
    })
    this.prodserachinp.nativeElement.value=''
    this.prodsearchformg.reset(); 
    this.prodfetch()
    return true
  }




  autocompleteprodScroll() {
    setTimeout(() => {
      if (
        this.matprodAutocomplete &&
        this.autocompleteTrigger &&
        this.matprodAutocomplete.panel
      ) {
        fromEvent(this.matprodAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matprodAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matprodAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matprodAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matprodAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getproduct(this.prodInput.nativeElement.value)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.productList = this.productList.concat(datas);
                    if (this.productList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  },(error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }

  public displayFnprod(prod?: prodlistss): string | undefined {
    return prod ? prod.name : undefined;
  }

  get prod() {
    return this.product_id;
  }



  getproduct(prokeyvalue) {
    this.SpinnerService.show()
    this.dataService.getproduct(prokeyvalue)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["data"];
        this.productList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }

      )
  }





  public removedprod(pro: prodlistss): void {
    const index = this.chipSelectedprod.indexOf(pro);

    if (index >= 0) {

      this.chipSelectedprod.splice(index, 1);
      console.log(this.chipSelectedprod);
      this.chipSelectedprodid.splice(index, 1);
      console.log(this.chipSelectedprodid);
      this.prodInput.nativeElement.value = '';
    }

  }



  public prodSelected(event: MatAutocompleteSelectedEvent): void {
    console.log('event.option.value', event.option.value)
    this.selectprodByName(event.option.value.name);
    this.prodInput.nativeElement.value = '';
    console.log('chipSelectedprodid', this.chipSelectedprodid)
  }
  private selectprodByName(prod) {
    let foundprod1 = this.chipSelectedprod.filter(pro => pro.name == prod);
    if (foundprod1.length) {
      return;
    }
    let foundprod = this.productList.filter(pro => pro.name == prod);
    if (foundprod.length) {
      this.chipSelectedprod.push(foundprod[0]);
      this.chipSelectedprodid.push(foundprod[0].id)
    }
  }

  commodityid: any

  createformatprod() {
    let datas = this.productSearchForm.value

    let dataprod = this.chipSelectedprodid
    let datamethod = "add"

    let productclass = new producttype();
    productclass.commodity_id = datas.commodity_id
    productclass.product_id = dataprod
    productclass.method = datamethod
    if (dataprod?.length === 0) {
      //this.toastr.error('Add Product','Empty value not Allowed');
      return false;
    }
    return productclass
  }



  productsubmit() {
    let datas = this.createformatprod();
    if (datas === false) {
      this.toastr.error('Add Product', 'Empty value not Allowed');
      return null;
    }
    this.SpinnerService.show()
    this.dataService.productCreateForm(datas)
      .subscribe(res => {
        this.SpinnerService.hide()
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
        }
        else if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.SpinnerService.hide()
          this.notification.showWarning(res.description)
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
        } else {
          this.SpinnerService.hide()
          this.notification.showSuccess("Saved Successfully")
          this.product_id.setValue("")
          this.chipSelectedprod = []
          this.chipSelectedprodid = []
        }
        this.getcommodity(1);

        return true
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  createformatremoveprod() {
    let datas = this.productSearchForm.value

    let dataprod = this.chipSelectedprodid
    let datamethod = "remove"

    let productclass = new productremovetype();
    productclass.commodity_id = datas.commodity_id
    productclass.product_id = dataprod
    productclass.method = datamethod
    if (dataprod?.length === 0) {
      //this.toastr.error('Add Product','Empty value not Allowed');
      return false;
    }
    return productclass
  }

  productremovesubmit() {
    let datas = this.createformatremoveprod();
    if (datas === false) {
      this.toastr.error('Remove Product', 'Empty value not Allowed');
      return null;
    }
    console.log('check value', datas)
    this.SpinnerService.show()
    this.dataService.productCreateForm(datas)
      .subscribe(res => {
        this.SpinnerService.hide()
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
        this.SpinnerService.hide()
          this.notification.showError("Duplicate Data! ...[INVALID_DATA! ...]")
        }
        else if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
        this.SpinnerService.hide()
          this.notification.showWarning("Duplicate Data! ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.SpinnerService.hide()
          this.notification.showError("INVALID_DATA!...")
        } else {
          this.SpinnerService.hide()
          this.notification.showSuccess("Updated Successfully")
          this.product_id.reset('')
          this.onSubmit.emit();
        }
        this.getcommodity(1);
        return true
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  prodfetch() {
    let data: any = this.prposhareService.CommodityEdit.value
    let id = data.id
    this.SpinnerService.show()
    this.dataService.getprodselectedlist(id,this.prodserachinp.nativeElement.value)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["data"];

        this.prodList = datas;

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  clickprodsearch(x){
    this.prodsearchformg.get('prod').patchValue(x.product.name)
      let data: any = this.prposhareService.CommodityEdit.value
    let id = data.id
    this.SpinnerService.show()
    this.dataService.getprodselectedlist(id,x.product?.name)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["data"];

        this.prodList = datas;

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
Resetprod(){
  this.prodserachinp.nativeElement.value=''
    this.prodsearchformg.reset(); 
    this.prodfetch()
}
}

class delSearchtype {
  employee_id: string;
  commodity_id: string;
  type: any;
}
class delappSearchtype {
  employee_id: string;
  commodity_id: string;
  type: any;
}

class producttype {
  product_id: any;
  commodity_id: any;
  method: any;
}

class productremovetype {
  product_id: any;
  commodity_id: any;
  method: any;
} 
