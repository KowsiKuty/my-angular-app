import { Component, OnInit } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { SharedService } from '../../service/shared.service';
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service'


import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
export interface ctrlofzListss {
  name: string;
  id: number;
}

@Component({
  selector: 'app-rems-master',
  templateUrl: './rems-master.component.html',
  styleUrls: ['./rems-master.component.scss']
})
export class RemsMasterComponent implements OnInit {
  PremiseSearchForm: FormGroup;
  has_nextlic = true;
  has_previouslic = true;
  // currentpage: number = 1;
  presentpagelic: number = 1;
  has_nextlicdet = true;
  has_previouslicdet = true;
  // currentpage: number = 1;
  presentpagelicdet: number = 1;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;

  statutorypage: number = 1;

  has_nextctrl = true;
  has_previousctrl = true;
  has_nextprem = true;
  has_previousprem = true;
  has_nextinsty = true;
  has_previousinsty = true;
  has_nextid = true;
  has_previousid = true;
  presentpageinsty: number = 1;
  presentpagectrl: number = 1;
  presentpageprem: number = 1;
  // presentpage:number = 1;
  presentpageid: number = 1;

  pagesize = 10;

  remsMasterList: any
  urls: string
  roleValues: string;
  addFormBtn: any;
  ismakerCheckerButton: boolean;

  urlControllingOffice: string;
  urlPremise: string;
  urlInsurancetype: string;
  urlInsuranceDetail: string;
  urlLicenseType: string;
  urlLicenseDetails: string;

  isControllingOffice: boolean;
  isPremise: boolean;
  isInsurancetype: boolean;
  isInsuranceDetail: boolean;
  isLicenseType: boolean;
  isLicenseDetails: boolean;

  isControllingOfficeForm: boolean;
  isPremiseForm: boolean;
  isControllingOfficeEditForm: boolean;
  isInsurancetypeForm: boolean;
  isInsuranceDetailForm: boolean;
  isPremiseEditForm: boolean;
  isInsurancetypeEditForm: boolean;
  isInsuranceDetailEditForm: boolean;
  isLicenseTypeForm: boolean;
  isLicenseDetailsForm: boolean;
  isLicenseDetailsEditForm: boolean;
  isLicenseTypeEditForm: boolean;

  ControllinOfficeList: any;
  PremiseList: any;
  ControllingOfficeList: Array<ctrlofzListss>;
  controllingofz_id = new FormControl();

  getStatutoryPaymentList: any;
  isStatutoryPayment: boolean;
  isStatutoryPaymentForm: boolean;
  isStatutoryPaymentEditForm: boolean;
  statutorypaymentId: any;

  // isctrlpage:boolean=true;
  // isctrlpages:boolean=true;

  isLoading = false;



  InsurancetypeList: any;
  InsuranceDetailList: any;
  LicenseTypeList: any;
  LicenseDetailsList: any;

  isAmentiesType: boolean;
  urlAmentiesType: string;
  amentiesTypeList: any;
  next_AmentiesType = true;
  previous_AmentiesType = true;
  currentpage_AmentiesType: number = 1;
  presentpage_AmentiesType: number = 1;
  isAmentiesTypeForm: boolean;
  isTax: boolean;
  urlTax: string;
  taxList: any;
  next_tax = true;
  previous_tax = true;
  currentpage_tax: number = 1;
  presentpage_tax: number = 1;
  isTaxForm: boolean;
  isTaxPage: boolean;
  urlTaxRate;
  taxRateList: any;
  next_taxRate = true;
  previous_taxRate = true;
  currentpage_taxRate: number = 1;
  presentpage_taxRate: number = 1;
  isTaxRate: boolean;
  isTaxRateForm: boolean;
  isTaxRatePage: boolean;

  statutoryTypeList: any;
  next_statutoryType = true;
  previous_statutoryType = true;
  isStatutoryType:boolean;
  current_statutoryType: number = 1;
  present_statutoryType: number = 1;
  sizeStatutoryType = 10;
  isStatutoryTypeForm: boolean;
  isStatutoryTypePage: boolean;
  urlStatutoryType: any;

  banckAccountTypeList: any;
  next_bankAccountType = true;
  previous_bankAccountType = true;
  isBankAccountType :boolean;
  current_bankAccountType: number = 1;
  present_bankAccountType: number = 1;
  sizebankAccountType = 10;
  isbankAccountTypeForm: boolean;
  isbankAccountTypePage: boolean;
  urlbankAccountType: any;
  constructor(private fb: FormBuilder, private router: Router, private remsshareService: RemsShareService,
    private shareService: SharedService, private dataService: RemsService, private toastr: ToastrService, private route: ActivatedRoute, private notification: NotificationService, private remsservice: RemsService) {
    // this.isPremise=this.router.getCurrentNavigation().extras.state.isPremise;
    // console.log('here',this.route.snapshot.data)
  }


  ngOnInit(): void {
    // this.onSubscribeFor(this.ActivatedRoute.params, (params) =>{
    //   let modulekey = this.ActivatedRoute.snapshot.data.ispremise;
    // });

    let datas = this.shareService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "REMS Masters") {
        this.remsMasterList = subModule;
        console.log("remsMasterList", this.remsMasterList)
      }
    });
    this.getControllingOfz();
    let ctrlofzkeyvalue: String = "";
    this.getControllingOfzDD(ctrlofzkeyvalue);
    this.getPremise();
    this.PremiseSearchForm = this.fb.group({
      code: "",
      name: "",
      controllingofz_id: ""
    })
    this.PremiseSearchForm.get('controllingofz_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),

        switchMap(value => this.dataService.getControllingOfzDropDown(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ControllingOfficeList = datas;
        console.log("ControllingOfficeList", datas)

      })

    this.getInsuranceType();
    this.getInsuranceDetails();
    this.getLicense();
    this.getLicensedetails();
    this.getAmenitiesType();

  }

  public displayFn(cotype?: ctrlofzListss): string | undefined {
    // console.log('id',cotype.id);
    // console.log('name',cotype.name);
    return cotype ? cotype.name : undefined;
  }

  get cotype() {
    return this.PremiseSearchForm.get('controllingofz_id');
  }


  private getControllingOfzDD(ctrlofzkeyvalue) {
    this.dataService.getControllingOfzDropDown(ctrlofzkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ControllingOfficeList = datas;
        console.log("Controlling Office DD", datas)
        return true
      })
  }

  subModuleData(data) {
    console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDD", data)
    this.urls = data.url;
    this.urlControllingOffice = "/controllingoffice";
    this.urlPremise = "/premise";
    this.urlInsurancetype = "/insurancetype";
    this.urlInsuranceDetail = "/insurancedetail";
    this.urlLicenseType = "/licensetype";
    this.urlLicenseDetails = "/licensedetails";
    this.urlAmentiesType = "/amenitiestype";
    this.urlTax = "/pd-tax";
    this.urlTaxRate = "/pd-taxrate";
    this.urlStatutoryType = "/statutorytype";
    this.urlbankAccountType = "/bankaccounttype";
    this.isControllingOffice = this.urlControllingOffice === this.urls ? true : false;
    this.isPremise = this.urlPremise === this.urls ? true : false;
    this.isInsurancetype = this.urlInsurancetype === this.urls ? true : false;
    this.isInsuranceDetail = this.urlInsuranceDetail === this.urls ? true : false;
    this.isLicenseType = this.urlLicenseType === this.urls ? true : false;
    this.isLicenseDetails = this.urlLicenseDetails === this.urls ? true : false;
    this.isAmentiesType = this.urlAmentiesType === this.urls ? true : false;
    this.isTax = this.urlTax === this.urls ? true : false;
    this.isTaxRate = this.urlTaxRate === this.urls ? true : false;
    this.isStatutoryType = this.urlStatutoryType === this.urls ? true : false;
    this.isBankAccountType = this.urlbankAccountType === this.urls ? true : false;


    if (this.isControllingOffice) {
      this.isPremiseEditForm = false;
      this.isPremiseForm = false;
      this.isLicenseTypeEditForm = false;
      this.isLicenseTypeForm = false;
      this.isLicenseDetailsForm = false;
      this.isLicenseDetailsEditForm = false;
      this.isInsuranceDetailForm = false;
      this.isInsuranceDetailEditForm = false;
      this.isInsurancetypeForm = false;
      this.isInsurancetypeEditForm = false;
      this.isAmentiesType = false;
      this.isTax = false;
      this.isTaxRate = false;
      this.isStatutoryType = false;
      this.isStatutoryTypeForm = false;
      this.isbankAccountTypeForm = false;
      this.isBankAccountType = false;
    }
    else if (this.isPremise) {
      this.isPremiseEditForm = false;
      this.isPremiseForm = false;
      this.isLicenseTypeEditForm = false;
      this.isLicenseTypeForm = false;
      this.isLicenseDetailsForm = false;
      this.isLicenseDetailsEditForm = false;
      this.isInsuranceDetailForm = false;
      this.isInsuranceDetailEditForm = false;
      this.isInsurancetypeForm = false;
      this.isInsurancetypeEditForm = false;
      this.isControllingOffice = false;
      this.isAmentiesType = false;
      this.isTax = false;
      this.isTaxRate = false;
      this.isStatutoryType = false;
      this.isStatutoryTypeForm = false;
      this.isbankAccountTypeForm = false;
      this.isBankAccountType = false;
    }
    else if (this.isInsurancetype) {
      this.isPremiseEditForm = false;
      this.isPremiseForm = false;
      this.isLicenseTypeEditForm = false;
      this.isLicenseTypeForm = false;
      this.isLicenseDetailsForm = false;
      this.isLicenseDetailsEditForm = false;
      this.isInsuranceDetailForm = false;
      this.isInsuranceDetailEditForm = false;
      this.isInsurancetypeForm = false;
      this.isInsurancetypeEditForm = false;
      this.isAmentiesType = false;
      this.isControllingOffice = false;
      this.isTax = false;
      this.isTaxRate = false;
      this.isbankAccountTypeForm = false;
      this.isBankAccountType = false;
    }
    else if (this.isInsuranceDetail) {
      this.isPremiseEditForm = false;
      this.isPremiseForm = false;
      this.isLicenseTypeEditForm = false;
      this.isLicenseTypeForm = false;
      this.isLicenseDetailsForm = false;
      this.isLicenseDetailsEditForm = false;
      this.isInsuranceDetailForm = false;
      this.isInsuranceDetailEditForm = false;
      this.isInsurancetypeForm = false;
      this.isInsurancetypeEditForm = false;
      this.isAmentiesType = false;
      this.isControllingOffice = false;
      this.isTax = false;
      this.isTaxRate = false;
      this.isStatutoryType = false;
      this.isStatutoryTypeForm = false;
      this.isbankAccountTypeForm = false;
      this.isBankAccountType = false;
    }
    else if (this.isLicenseType) {
      this.isPremiseEditForm = false;
      this.isPremiseForm = false;
      this.isLicenseTypeEditForm = false;
      this.isLicenseTypeForm = false;
      this.isLicenseDetailsForm = false;
      this.isLicenseDetailsEditForm = false;
      this.isInsuranceDetailForm = false;
      this.isInsuranceDetailEditForm = false;
      this.isInsurancetypeForm = false;
      this.isControllingOffice = false;
      this.isInsurancetypeEditForm = false;
      this.isStatutoryType = false;
      this.isStatutoryTypeForm = false;
      this.isbankAccountTypeForm = false;
      this.isBankAccountType = false;
    }
    else if (this.isLicenseDetails) {
      this.isPremiseEditForm = false;
      this.isPremiseForm = false;
      this.isLicenseTypeEditForm = false;
      this.isLicenseTypeForm = false;
      this.isLicenseDetailsForm = false;
      this.isLicenseDetailsEditForm = false;
      this.isInsuranceDetailForm = false;
      this.isInsuranceDetailEditForm = false;
      this.isInsurancetypeForm = false;
      this.isInsurancetypeEditForm = false;
      this.isAmentiesType = false;
      this.isControllingOffice = false;
      this.isTax = false;
      this.isTaxRate = false;
      this.isStatutoryType = false;
      this.isStatutoryTypeForm = false;
      this.isbankAccountTypeForm = false;
      this.isBankAccountType = false;
    }
    else if (this.isAmentiesType) {
      this.isPremiseEditForm = false;
      this.isPremiseForm = false;
      this.isLicenseTypeEditForm = false;
      this.isLicenseTypeForm = false;
      this.isLicenseDetailsForm = false;
      this.isLicenseDetailsEditForm = false;
      this.isInsuranceDetailForm = false;
      this.isInsuranceDetailEditForm = false;
      this.isInsurancetypeForm = false;
      this.isInsurancetypeEditForm = false;
      this.isControllingOffice = false;
      this.isTax = false;
      this.isStatutoryType = false;
      this.isStatutoryTypeForm = false;
      this.isTaxRate = false;
      this.isbankAccountTypeForm = false;
      this.isBankAccountType = false;
    } else if (this.isTax) {
      this.getTax();
      this.isPremiseEditForm = false;
      this.isPremiseForm = false;
      this.isLicenseTypeEditForm = false;
      this.isLicenseTypeForm = false;
      this.isLicenseDetailsForm = false;
      this.isLicenseDetailsEditForm = false;
      this.isInsuranceDetailForm = false;
      this.isInsuranceDetailEditForm = false;
      this.isInsurancetypeForm = false;
      this.isInsurancetypeEditForm = false;
      this.isAmentiesType = false;
      this.isTaxRate = false;
      this.isControllingOffice = false;
      this.isStatutoryType = false;
      this.isStatutoryTypeForm = false;
      this.isbankAccountTypeForm = false;
      this.isBankAccountType = false;
    } else if (this.isTaxRate) {
      this.getTaxRate();
      this.isPremiseEditForm = false;
      this.isPremiseForm = false;
      this.isLicenseTypeEditForm = false;
      this.isLicenseTypeForm = false;
      this.isLicenseDetailsForm = false;
      this.isLicenseDetailsEditForm = false;
      this.isInsuranceDetailForm = false;
      this.isInsuranceDetailEditForm = false;
      this.isInsurancetypeForm = false;
      this.isInsurancetypeEditForm = false;
      this.isAmentiesType = false;
      this.isTax = false;
      this.isControllingOffice = false;
      this.isStatutoryType = false;
      this.isStatutoryTypeForm = false;
      this.isbankAccountTypeForm = false;
      this.isBankAccountType = false;
    } else if (this.isStatutoryType) {
      this.getStatutoryTpe();
      this.isPremiseEditForm = false;
      this.isPremiseForm = false;
      this.isLicenseTypeEditForm = false;
      this.isLicenseTypeForm = false;
      this.isLicenseDetailsForm = false;
      this.isLicenseDetailsEditForm = false;
      this.isInsuranceDetailForm = false;
      this.isInsuranceDetailEditForm = false;
      this.isInsurancetypeForm = false;
      this.isInsurancetypeEditForm = false;
      this.isAmentiesType = false;
      this.isTax = false;
      this.isControllingOffice = false;
      this.isbankAccountTypeForm = false;
      this.isBankAccountType = false;
    } else if (this.isBankAccountType) {
      this.getBanchAccountType();
      this.isPremiseEditForm = false;
      this.isPremiseForm = false;
      this.isLicenseTypeEditForm = false;
      this.isLicenseTypeForm = false;
      this.isLicenseDetailsForm = false;
      this.isLicenseDetailsEditForm = false;
      this.isInsuranceDetailForm = false;
      this.isInsuranceDetailEditForm = false;
      this.isInsurancetypeForm = false;
      this.isInsurancetypeEditForm = false;
      this.isAmentiesType = false;
      this.isTax = false;
      this.isControllingOffice = false;
      this.isStatutoryType = false;
      this.isStatutoryTypeForm = false;
    }

    this.roleValues = data.role[0].name;
    this.addFormBtn = data.name;

    if (this.roleValues === "Maker") {
      this.ismakerCheckerButton = true;
    } else if (this.roleValues === "Checker") {
      this.ismakerCheckerButton = false;
    }
    if (data.name === "Controlling Office") {
      this.ismakerCheckerButton = this.addFormBtn = false;
    }
    if (data.name === "Amenities type") {
      this.ismakerCheckerButton = this.addFormBtn = false;
    }
  }

  addForm() {
    if (this.addFormBtn === "Controlling Office") {
      this.isControllingOffice = false;
      this.ismakerCheckerButton = false;

    }
    //  else if (this.addFormBtn === "Premise") {
    //   // this.isPremiseForm = true;
    //   this.isPremise = false;
    //   this.ismakerCheckerButton = false;
    //   this.isPremiseEditForm = false;
    // } 
    else if (this.addFormBtn === "Insurance Type") {
      this.isInsurancetypeForm = true;
      this.isInsurancetype = false;
      this.ismakerCheckerButton = false;
      this.isInsurancetypeEditForm = false;
    } else if (this.addFormBtn === "Insurance Detail") {
      this.isInsuranceDetailForm = true;
      this.isInsuranceDetail = false;
      this.ismakerCheckerButton = false;
      this.isLicenseDetailsEditForm = false;
    } else if (this.addFormBtn === "License Type") {
      this.isLicenseTypeForm = true;
      this.isLicenseType = false;
      this.ismakerCheckerButton = false
      this.isLicenseTypeEditForm = false
    } else if (this.addFormBtn === "License Details") {
      this.isLicenseDetailsForm = true;
      this.isLicenseDetails = false;
      this.ismakerCheckerButton = false
      this.isLicenseDetailsEditForm = false
    } else if (this.addFormBtn === "Amenities type") {
      this.isAmentiesTypeForm = true;
      this.ismakerCheckerButton = false
      this.isAmentiesType = false;
    } else if (this.addFormBtn === "Tax") {
      this.isTaxForm = true;
      this.ismakerCheckerButton = false
      this.isTax = false;
      this.remsshareService.taxForm.next('')
    } else if (this.addFormBtn === "Tax Rate") {
      this.isTaxRateForm = true;
      this.ismakerCheckerButton = false
      this.isTaxRate = false;
      this.remsshareService.taxRateForm.next('')
    } else if (this.addFormBtn === "Statutory Type") {
      this.isStatutoryTypeForm = true;
      this.ismakerCheckerButton = false
      this.remsshareService.statutoryTypeForm.next('')
      this.isStatutoryType = false;
    } else if (this.addFormBtn === "Bank Account Type") {
      this.isbankAccountTypeForm = true;
      this.ismakerCheckerButton = false
      this.remsshareService.bankAccountType.next('')
      this.isBankAccountType = false;
    }

  }

  // private getControllingOfzDD(ctrlofzkeyvalue) {
  //   this.dataService.getControllingOfzDropDown(ctrlofzkeyvalue)
  //     .subscribe((results: any[]) => {
  //    s   let datas = results["data"];
  //       this.ControllingOfficeListDD = datas;
  //       console.log("Controlling Office DD", datas)
  //     })
  // }

  getControllingOfz(pageNumber = 1, pageSize = 10) {
    this.dataService.getControllingOfz(pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        console.log("Getctrl", datas);
        let dataPagination = results["pagination"];
        this.ControllinOfficeList = datas;
        // if (this.ControllinOfficeList.length===0) {
        //   this.isctrlpage=false
        // }
        if (this.ControllinOfficeList.length >= 0) {
          this.has_nextctrl = dataPagination.has_next;
          this.has_previousctrl = dataPagination.has_previous;
          this.presentpagectrl = dataPagination.index;
          //this.isctrlpage=true
        }
      })
  }
  nextClick() {
    if (this.has_nextctrl === true) {
      // this.currentpage= this.presentpage + 1
      this.getControllingOfz(this.presentpagectrl + 1, 10)
    }
  }

  previousClick() {
    if (this.has_previousctrl === true) {
      // this.currentpage= this.presentpage - 1
      this.getControllingOfz(this.presentpagectrl - 1, 10)
    }
  }

  ControllingOfficeEdit(data) {
    // this.isControllingOfficeEditForm = true;
    // this.isControllingOffice = false;
    // this.ismakerCheckerButton = false;
    // this.remsshareService.ControllingOfficeEdit.next(data)
    // return data;
  }


  ControllingOfficeSubmit() {
    this.getControllingOfz()
    this.ismakerCheckerButton = true;
    this.isControllingOffice = true;

  }
  ControllingOfficeCancel() {
    this.ismakerCheckerButton = true;
    this.isControllingOffice = true;

  }
  ControllingOfficeEditSubmit() {
    this.getControllingOfz()
    this.isControllingOfficeEditForm = false;
    this.ismakerCheckerButton = true;
    this.isControllingOffice = true;
  }
  ControllingOfficeEditCancel() {
    this.ismakerCheckerButton = true;
    this.isControllingOffice = true;
    this.isControllingOfficeEditForm = false;
  }

  createFormate() {
    let data = this.PremiseSearchForm.controls;
    let premiseSearchclass = new premiseSearchtype();
    premiseSearchclass.code = data['code'].value;
    premiseSearchclass.name = data['name'].value;
    premiseSearchclass.controllingofz_id = data['controllingofz_id'].value.id;
    console.log("premiseSearchclass", premiseSearchclass)
    return premiseSearchclass;
  }


  PremiseSearch() {
    // let search = this.PremiseSearchForm.value;
    let search = this.createFormate();
    console.log(search);
    for (let i in search) {
      if (!search[i]) {
        delete search[i];
      }
    }
    this.dataService.getPremiseSearch(search)
      .subscribe(result => {
        console.log("premise search result", result)
        this.PremiseList = result['data']
        if (search.name === '' && search.code === '' && search.controllingofz_id === '') {
          this.getPremise();
        }
      })
  }

  reset() {
    this.getPremise();
  }


abc:number=1;

  getPremise(pageNumber = 1, pageSize = 10) {
    this.dataService.getPremise(pageNumber, pageSize,this.abc)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        console.log("getPremise", datas);
        let datapagination = results["pagination"];
        this.PremiseList = datas;
        if (this.PremiseList.length >= 0) {
          this.has_nextprem = datapagination.has_next;
          this.has_previousprem = datapagination.has_previous;
          this.presentpageprem = datapagination.index;
        }
      })

  }
  pre_nextClick() {
    if (this.has_nextprem === true) {
      // this.currentpage= this.presentpage + 1
      this.getPremise(this.presentpageprem + 1, 10)
    }
  }

  pre_previousClick() {
    if (this.has_previousprem === true) {
      // this.currentpage= this.presentpage - 1
      this.getPremise(this.presentpageprem - 1, 10)
    }
  }


  premiseView(PremiseViewData) {
    this.remsshareService.PremiseView.next(PremiseViewData);
    this.router.navigate(['/rems/premiseView'], { skipLocationChange: true })
  }

  // PremiseEdit(data) {
  //   this.remsshareService.PremiseView.next(data);
  //   return data;
  // }


  PremiseSubmit() {
    this.getPremise()
    this.ismakerCheckerButton = true;
    this.isPremise = true;
    this.isPremiseForm = false;
  }
  PremiseCancel() {
    this.ismakerCheckerButton = true;
    this.isPremise = true;
    this.isPremiseForm = false;
  }
  // PremiseEditSubmit(){
  //   this.getPremise()
  //   this.ismakerCheckerButton = true;
  //   // this.isPermiseEditForm = false;
  //   // this.isPermise = true;
  // }
  // PremiseEditCancel(){
  //   this.ismakerCheckerButton = true;
  //   // this.isPermise = true;
  //   // this.isPermiseEditForm = false;
  // }
  getstatutorypayment(pageNumber = 1, pageSize = 10) {
    this.dataService.getstatutorypayment(pageNumber, pageSize)
      .subscribe(result => {
        console.log("Catalog", result)
        let datas = result['data'];
        this.getStatutoryPaymentList = datas;
        let datapagination = result["pagination"];
        this.getStatutoryPaymentList = datas;
        if (this.getStatutoryPaymentList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.statutorypage = datapagination.index;
        }
      })
  }
  StanextClick() {
    if (this.has_next === true) {
      // this.currentpage= this.presentpage + 1
      this.getstatutorypayment(this.statutorypage + 1, 10)
    }
  }

  StapreviousClick() {
    if (this.has_previous === true) {
      // this.currentpage= this.presentpage - 1
      this.getstatutorypayment(this.statutorypage - 1, 10)
    }
  }
  StatutoryPaymentBtn() {
    this.getstatutorypayment();
    this.isStatutoryPayment = true;
    this.isStatutoryPaymentForm = false;
    this.ismakerCheckerButton = true;

  }
  addStatutoryPayment() {
    this.isStatutoryPayment = false;
    this.isStatutoryPaymentForm = true;

  }
  onCancelClick() {
    this.isStatutoryPaymentForm = false;

    this.isStatutoryPayment = true
  }

  statutorySubmit() {
    this.getstatutorypayment();
    this.isStatutoryPaymentForm = false;

    this.isStatutoryPayment = true
  }
  statutorypaymentedit(data) {
    this.isStatutoryPaymentEditForm = true;
    this.isStatutoryPayment = false;
    this.ismakerCheckerButton = false;
    this.remsshareService.statutorypaymentId.next(data)
    console.log("statutory", data);
    return data;
  }
  statutoryEditCancel() {
    this.isStatutoryPaymentEditForm = false;
    this.ismakerCheckerButton = true;
    this.isStatutoryPayment = true;
  }
  statutoryEditSubmit() {
    this.getstatutorypayment();
    this.isStatutoryPaymentEditForm = false;
    this.ismakerCheckerButton = true;
    this.isStatutoryPayment = true;


  }
  deleteStatutory(data) {
    let value = data.id
    console.log("deleteCatalog", value)
    this.remsservice.deleteStatutory(value)
      .subscribe(result => {
        this.notification.showSuccess("Successfully deleted....")
        this.getstatutorypayment();
        return true
      })
  }



  getInsuranceType(pageNumber = 1, pageSize = 10) {
    this.dataService.getInsuranceType(pageNumber, pageSize)
      .subscribe((result: any[]) => {
        let datas = result['data']
        let dataPagination = result['pagination']
        this.InsurancetypeList = datas;
        if (this.InsurancetypeList.length >= 0) {
          this.has_nextinsty = dataPagination.has_next
          this.has_previousinsty = dataPagination.has_previous
          this.presentpageinsty = dataPagination.index
        }
      })
  }

  nextClickIT() {
    if (this.has_nextinsty === true) {
      // this.currentpage= this.presentpage + 1
      this.getInsuranceType(this.presentpageinsty + 1, 10)
    }
  }

  previousClickIT() {
    if (this.has_previousinsty === true) {
      // this.currentpage= this.presentpage - 1
      this.getInsuranceType(this.presentpageinsty - 1, 10)
    }
  }

  InsurancetypeSubmit() {
    this.getInsuranceType();
    this.isInsurancetypeForm = false;
    this.isInsurancetype = true;
    this.ismakerCheckerButton = true;
  }
  InsurancetypeCancel() {
    this.isInsurancetypeForm = false;
    this.isInsurancetype = true;
    this.ismakerCheckerButton = true;
  }
  InsurancetypeEditSubmit() {
    this.getInsuranceType();
    this.isInsurancetypeEditForm = false;
    this.isInsurancetype = true;
    this.ismakerCheckerButton = true;
  }
  InsurancetypeEditCancel() {
    this.isInsurancetypeEditForm = false;
    this.isInsurancetype = true;
    this.ismakerCheckerButton = true;
  }
  InsurancetypeEdit(data) {
    this.isInsurancetypeEditForm = true;
    this.ismakerCheckerButton = false;
    this.isInsurancetype = false;
    this.remsshareService.InsuranceTypeEdit.next(data)
    return data
  }



  getInsuranceDetails(pageNumber = 1, pageSize = 10) {
    this.dataService.getInsuranceDetails(pageNumber, pageSize)
      .subscribe((result: any[]) => {
        let datas = result['data']
        let dataPagination = result['pagination']
        this.InsuranceDetailList = datas;
        if (this.InsuranceDetailList.length >= 0) {
          this.has_nextid = dataPagination.has_next
          this.has_previousid = dataPagination.has_previous
          this.presentpageid = dataPagination.index
        }
      })
  }

  nextClickinsuranceDetails() {
    if (this.has_nextid === true) {
      // this.currentpageid = this.presentpage + 1;
      this.getInsuranceDetails(this.presentpageid + 1, 10)
    }
  }
  previousClickInsuranceDetails() {
    if (this.has_previousid === true) {
      // this.currentpage = this.presentpage - 1;
      this.getInsuranceDetails(this.presentpageid - 1, 10)
    }
  }

  InsuranceDetailSubmit() {
    this.getInsuranceDetails();
    this.isInsuranceDetailForm = false;
    this.isInsuranceDetail = true;
    this.ismakerCheckerButton = true;
  }
  InsuranceDetailCancel() {
    this.isInsuranceDetailForm = false;
    this.isInsuranceDetail = true;
    this.ismakerCheckerButton = true;
  }
  InsuranceDetailEditSubmit() {
    this.getInsuranceDetails();
    this.isInsuranceDetailEditForm = false;
    this.isInsuranceDetail = true;
    this.ismakerCheckerButton = true;
  }
  InsuranceDetailEditCancel() {
    this.isInsuranceDetailEditForm = false;
    this.isInsuranceDetail = true;
    this.ismakerCheckerButton = true;
  }
  InsuranceDetailEdit(data) {
    this.isInsuranceDetailEditForm = true;
    this.ismakerCheckerButton = false;
    this.isInsuranceDetail = false;
    this.remsshareService.InsuranceDetailEdit.next(data)
    return data
  }

  getLicense(pageNumber = 1, pageSize = 10) {
    this.dataService.getLicense(pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        console.log("getLicense", datas);
        let datapagination = results["pagination"];
        this.LicenseTypeList = datas;
        if (this.LicenseTypeList.length >= 0) {
          this.has_nextlic = datapagination.has_next;
          this.has_previouslic = datapagination.has_previous;
          this.presentpagelic = datapagination.index;
        }
      })

  }

  lic_nextClick() {
    if (this.has_nextlic === true) {
      // this.currentpage= this.presentpage + 1
      this.getLicense(this.presentpagelic + 1, 10)
    }
  }

  lic_previousClick() {
    if (this.has_previouslic === true) {
      // this.currentpage= this.presentpage - 1
      this.getLicense(this.presentpagelic - 1, 10)
    }
  }
  LicenseTypeSubmit() {
    this.getLicense()
    this.ismakerCheckerButton = true;
    this.isLicenseType = true;
    this.isLicenseTypeForm = false;
  }
  LicenseTypeCancel() {
    this.ismakerCheckerButton = true;
    this.isLicenseType = true;
    this.isLicenseTypeForm = false;
  }

  LicenseTypeEditSubmit() {
    this.getLicense();
    this.ismakerCheckerButton = true;
    this.isLicenseType = true;
    this.isLicenseTypeEditForm = false;
  }
  LicenseTypeEditCancel() {
    this.ismakerCheckerButton = true;
    this.isLicenseType = true;
    this.isLicenseTypeEditForm = false;
  }

  licensetypeEdit(data) {
    this.isLicenseTypeEditForm = true;
    this.isLicenseType = false;
    this.ismakerCheckerButton = false;
    this.remsshareService.licensetypeEditValue.next(data)
    return data;
  }



  getLicensedetails(pageNumber = 1, pageSize = 10) {
    this.dataService.getLicensedetails(pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        console.log("getLicensedetails", datas);
        let datapagination = results["pagination"];
        this.LicenseDetailsList = datas;
        if (this.LicenseDetailsList.length >= 0) {
          this.has_nextlicdet = datapagination.has_next;
          this.has_previouslicdet = datapagination.has_previous;
          this.presentpagelicdet = datapagination.index;
        }
      })

  }

  licdet_nextClick() {
    if (this.has_nextlicdet === true) {
      // this.currentpage= this.presentpage + 1
      this.getLicensedetails(this.presentpagelicdet + 1, 10)
    }
  }

  licdet_previousClick() {
    if (this.has_previouslicdet === true) {
      // this.currentpage= this.presentpage - 1
      this.getLicensedetails(this.presentpagelicdet - 1, 10)
    }
  }

  LicenseDetailsSubmit() {
    this.getLicensedetails();
    this.ismakerCheckerButton = true;
    this.isLicenseDetails = true;
    this.isLicenseDetailsForm = false;
  }
  LicenseDetailsCancel() {
    this.ismakerCheckerButton = true;
    this.isLicenseDetails = true;
    this.isLicenseDetailsForm = false;
  }

  LicenseDetailsEditSubmit() {
    this.getLicensedetails();
    this.ismakerCheckerButton = true;
    this.isLicenseDetails = true;
    this.isLicenseDetailsEditForm = false;
  }
  LicenseDetailsEditCancel() {
    this.ismakerCheckerButton = true;
    this.isLicenseDetails = true;
    this.isLicenseDetailsEditForm = false;
  }

  licensedetailsEdit(data) {
    this.isLicenseDetailsEditForm = true;
    this.isLicenseDetails = false;
    this.ismakerCheckerButton = false;
    this.remsshareService.licensedetailsEditValue.next(data)
    return data;
  }

  getAmenitiesType(pageNumber = 1, ) {
    this.remsservice.getAmenitiesType(pageNumber)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.amentiesTypeList = datas;
        if (this.amentiesTypeList.length >= 0) {
          this.next_AmentiesType = datapagination.has_next;
          this.previous_AmentiesType = datapagination.has_previous;
          this.presentpage_AmentiesType = datapagination.index;
        }
      })
  }


  amentiesType_nextClick() {
    if (this.next_AmentiesType === true) {
      this.getAmenitiesType(this.presentpage_AmentiesType + 1)
    }
  }

  amentiesType_previousClick() {
    if (this.previous_AmentiesType === true) {
      this.getAmenitiesType(this.presentpage_AmentiesType - 1)
    }
  }
  amentiestypeSubmit() {
    this.getAmenitiesType();
    this.ismakerCheckerButton = true;
    this.isAmentiesType = true;
    this.isAmentiesTypeForm = false;
  }
  amentiestypeCancel() {
    this.ismakerCheckerButton = true;
    this.isAmentiesType = true;
    this.isAmentiesTypeForm = false;
  }


  getTax(pageNumber = 1, ) {
    this.remsservice.getTax(pageNumber)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.taxList = datas;
        if (this.taxList.length >= 0) {
          this.next_tax = datapagination.has_next;
          this.previous_tax = datapagination.has_previous;
          this.presentpage_tax = datapagination.index;
          this.isTaxPage = true;
        } if (this.taxRateList.length === 0) {
          this.isTaxPage = false
        }
      })
  }
  tax_nextClick() {
    if (this.next_tax === true) {
      this.getTax(this.presentpage_tax + 1)
    }
  }

  tax_previousClick() {
    if (this.previous_tax === true) {
      this.getTax(this.presentpage_tax - 1)
    }
  }
  taxEdit(data) {
    this.isTaxForm = true;
    this.ismakerCheckerButton = false;
    this.isTax = false;
    this.remsshareService.taxForm.next(data)
    return data
  }

  taxDelete(id) {
    this.remsservice.taxDelete(id)
      .subscribe((result) => {
        this.notification.showSuccess("Deleted....")
        this.getTax();
      })
  }
  taxSubmit() {
    this.getTax();
    this.ismakerCheckerButton = true;
    this.isTax = true;
    this.isTaxForm = false;
  }
  taxCancel() {
    this.ismakerCheckerButton = true;
    this.isTax = true;
    this.isTaxForm = false;
  }

  getTaxRate(pageNumber = 1, ) {
    this.remsservice.getTaxRate(pageNumber)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.taxRateList = datas;
        if (this.taxRateList.length >= 0) {
          this.next_taxRate = datapagination.has_next;
          this.previous_taxRate = datapagination.has_previous;
          this.presentpage_taxRate = datapagination.index;
          this.isTaxRatePage = true;
        } if (this.taxRateList.length === 0) {
          this.isTaxRatePage = false
        }
      })
  }

  taxRate_nextClick() {
    if (this.next_taxRate === true) {
      this.getTaxRate(this.presentpage_taxRate + 1)
    }
  }

  taxRate_previousClick() {
    if (this.previous_taxRate === true) {
      this.getTaxRate(this.presentpage_taxRate - 1)
    }
  }
  taxRateEdit(data) {
    this.isTaxRateForm = true;
    this.ismakerCheckerButton = false;
    this.isTaxRate = false;
    this.remsshareService.taxRateForm.next(data)
    return data
  }

  taxRateDelete(id) {
    this.remsservice.taxRateDelete(id)
      .subscribe((result) => {
        this.notification.showSuccess("Deleted....")
        this.getTaxRate();
      })
  }

  taxRateSubmit() {
    this.getTaxRate();
    this.ismakerCheckerButton = true;
    this.isTaxRate = true;
    this.isTaxRateForm = false;
  }
  taxRateCancel() {
    this.ismakerCheckerButton = true;
    this.isTaxRate = true;
    this.isTaxRateForm = false;
  }

  getStatutoryTpe(pageNumber = 1) {
    this.remsservice.getStatutoryTpe(pageNumber)
      .subscribe(data => {
        this.statutoryTypeList = data.data;
        let datapagination = data.pagination;
        if (this.statutoryTypeList.length === 0) {
          this.isStatutoryTypePage = false
        }
        if (this.statutoryTypeList.length > 0) {
          this.next_statutoryType = datapagination.has_next;
          this.previous_statutoryType = datapagination.has_previous;
          this.present_statutoryType = datapagination.index;
          this.isStatutoryTypePage = true
        }
      })
  }

  staturoyType_next() {
    if (this.next_statutoryType === true) {
      this.getStatutoryTpe(this.present_statutoryType + 1)
    }
  }

  staturoyType_previous() {
    if (this.previous_statutoryType === true) {
      this.getStatutoryTpe(this.present_statutoryType - 1)
    }
  }

  statutoryTypeEdit(data) {
    this.ismakerCheckerButton = false;
    this.isStatutoryType = false;
    this.isStatutoryTypeForm = true;
    this.remsshareService.statutoryTypeForm.next(data)
    return data
  }

  statutoryTypeDelete(id) {
    this.remsservice.statutoryTypeDelete(id)
      .subscribe((result) => {
        this.notification.showSuccess("Deleted....")
        this.getStatutoryTpe();
      })
  }

  statutoryTypeSubmit() {
    this.getStatutoryTpe();
    this.ismakerCheckerButton = true;
    this.isStatutoryType = true;
    this.isStatutoryTypeForm = false;
  }
  statutoryTypeCancel() {
    this.ismakerCheckerButton = true;
    this.isStatutoryType = true;
    this.isStatutoryTypeForm = false;
  }

  getBanchAccountType(pageNumber = 1) {
    this.remsservice.getBanchAccountType(pageNumber)
      .subscribe(data => {
        this.banckAccountTypeList = data.data;
        let datapagination = data.pagination;
        if (this.banckAccountTypeList.length === 0) {
          this.isbankAccountTypePage = false
        }
        if (this.banckAccountTypeList.length > 0) {
          this.next_bankAccountType = datapagination.has_next;
          this.previous_bankAccountType = datapagination.has_previous;
          this.present_bankAccountType = datapagination.index;
          this.isbankAccountTypePage = true
        }
      })
  }

  bankAccountType_next() {
    if (this.next_bankAccountType === true) {
      this.getBanchAccountType(this.present_bankAccountType + 1)
    }
  }

  bankAccountType_previous() {
    if (this.previous_bankAccountType === true) {
      this.getBanchAccountType(this.present_bankAccountType - 1)
    }
  }

  bankAccountTypeEdit(data) {
    this.ismakerCheckerButton = false;
    this.isBankAccountType = false;
    this.isbankAccountTypeForm = true;
    this.remsshareService.bankAccountType.next(data)
    return data
  }

  bankAccountTypeDelete(id) {
    this.remsservice.banckAccountTypeDelete(id)
      .subscribe((result) => {
        this.notification.showSuccess("Deleted....")
        this.getBanchAccountType();
      })
  }

  bankAccountTypeSubmit() {
    this.getBanchAccountType();
    this.ismakerCheckerButton = true;
    this.isBankAccountType = true;
    this.isbankAccountTypeForm = false;
  }
  bankAccountTypeCancel() {
    this.ismakerCheckerButton = true;
    this.isBankAccountType = true;
    this.isbankAccountTypeForm = false;
  }
}


class premiseSearchtype {
  name: string;
  controllingofz_id: any;
  code: string;

}



