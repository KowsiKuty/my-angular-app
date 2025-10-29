import { Component, OnInit, Output, EventEmitter, ViewChild, Injectable,ElementRef } from '@angular/core';
import { SharedService } from '../../service/shared.service'
import { AtmaService } from '../atma.service'
import { ShareService } from '../share.service'
import { NotificationService } from 'src/app/service/notification.service';
import { FormControl, FormGroup, Validators,FormArray, Form } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder } from '@angular/forms';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";

import {
  MatAutocomplete,
  MatAutocompleteTrigger
} from '@angular/material/autocomplete';
import {
  finalize,
  switchMap,
  tap,
  distinctUntilChanged,
  debounceTime,
  map,
  takeUntil
} from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { error } from 'console';
import { AnyARecord } from 'dns';
import { ErrorHandlingService } from 'src/app/rems/error-handling.service';
export interface taxListss {
  name: string;
  id: number;
}
export interface categorylista {
  id: string;
  name: string;
}
export interface subcatgorylista {
  id: string;
  name: string;
}
export interface taxnamelist {
  id: string;
  name: string;
}
export interface subtaxname {
  id: string;
  name: string;
}
export interface subtaxrate {
  id: string;
  name: string;
}

export interface categorylista{
  id:string;
  name:string; 
}

export interface questypelist{
  id:number;
  name:string;
}
export interface product{
  code:string,
  id:string,
  name:string
}
export interface labeltype{
  type:string,
  id:string
 
}

@Component({
  selector: 'app-vendor-master',
  templateUrl: './vendor-master.component.html',
  styleUrls: ['./vendor-master.component.scss']
})


export class VendorMasterComponent implements OnInit {
  @ViewChild('tax') taxx;
  @ViewChild('modalclose') modalclose:ElementRef;
  @ViewChild('modalcloseap') modalcloseap:ElementRef;
  @ViewChild('taxtype') mattaxAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('catinput') catinput;
  @ViewChild('catlists') matTaxtaxAutocomplete: MatAutocomplete;
  @ViewChild('subInput') subcatinput;
  @ViewChild('catsublists') matcatsublists: MatAutocomplete;
  @ViewChild('taxauto') mattaxname: MatAutocomplete;
  @ViewChild('taxnameinput') taxInput;
  @ViewChild('staxauto') matstaxname: MatAutocomplete;
  @ViewChild('staxnameinput') taxsInput;
  @ViewChild('staxsauto') matsratetaxname: MatAutocomplete;
  @ViewChild('sstaxnameinput') taxsrateInput;
  @ViewChild('subtaxrateinfinitedata') matsratedatataxname: MatAutocomplete;
  @ViewChild('taxnameinputdata') taxsratedataInput;
  @ViewChild('subautoinfinitedata') matsubratedatataxname: MatAutocomplete;
  @ViewChild('inputsubratedata') taxssubratedataInput;
  @ViewChild('inputproduct') inputproduct: any;
  @ViewChild('products') matproductsAutocomplete: MatAutocomplete;
  @ViewChild('subtaxrateinfinite') matsubtaxname: MatAutocomplete;
  @ViewChild('inputSubname') subtaxInput;
  @ViewChild('subautoinfinite') matsubtaxratename: MatAutocomplete;
  @ViewChild('inputsubrate') subtaxrateInput;


  @ViewChild('typeauto') mattypename:MatAutocomplete;
  @ViewChild('typeinput') typeInput;


  vendorMasterList: any
  urls: string;

  urlTax: string;
  pageSize = 10;
  urlSubTax: string;
  urlTaxRate: string;
  urlBank: string;
  urlPaymode: string;
  uomcrrentpage = 1;
  urlBankbranch: string;
  urlApCategory: string;
  urlApCategoryapprover: string;
  isApCategoryapprover: boolean;
  urlProductType: string;
  urlUom: string;
  urlCustomerCategory: string;
  urlProductCategory: string;
  isTax: boolean;
  isSubTax: boolean;
  isTaxRate: boolean;
  isBank: boolean;
  isPaymode: boolean;
  isBankbranch: boolean;
  isProductType: Boolean;
  isApCategory: boolean;
  isUom: boolean;
  isCustomerCategory: boolean;
  isProductCategory: boolean;
  has_nextprocat = true;
  has_previousprocat = true;
  currentpageprocat: number = 1;
  presentpageprocat: number = 1;
  roleValues: string;
  addFormBtn: any;
  isTaxEditForm: boolean;
  isSubTaxEditForm: boolean;
  isTaxRateEditForm: boolean;
  isBankEditForm: boolean;
  isPaymodeEditForm: boolean;
  isBankbranchEditForm: boolean;
  isTaxForm: boolean;
  isSubTaxForm: boolean;
  isTaxRateForm: boolean;
  isBankForm: boolean;
  isPaymodeForm: boolean;
  isBankbranchForm: boolean;
  isProductTypeForm: boolean;
  isProductTypeEditForm: boolean;
  has_nextprotype = true;
  has_previousprotype = true;
  currentpageprotype: number = 1;
  presentpageprotype: number = 1;
  isApCategoryEditForm: boolean;
  isApCategoryForm: boolean;
  has_nextapcat = true;
  has_previousapcat = true;
  currentpageapcat: number = 1;
  presentpageapcat: number = 1;
  taxlist: Array<taxListss>;
  isUomForm: boolean;
  isUomEditForm: boolean;
  isCustomerCategoryForm: boolean;
  isCustomerCategoryEditForm: boolean;
  isProductCategoryForm: boolean;
  isProductCategoryEditForm: boolean;
  ismakerCheckerButton: boolean;
  getTaxList: Array<any> = [];
  getSubTaxList: any;
  getTaxRateList: any;
  txratepage = 1;
  getBankList: any;
  bankpage = 1;
  getPaymodeList: any;
  paymodepage = 1;
  branchbank = 1;
  getBankbranchList: any;
  getProductTypeList: any;
  has_nextcuscat = true;
  has_previouscuscat = true;
  currentpagecuscat: number = 1;
  presentpagecuscat: number = 1;
  getApCategoryList: any;
  UomList: any;
  uompage = 1;
  CustomerCategoryList: any;
  ProductCategoryList: any;
  has_next = true;
  has_previous = true;
  testp = 1;
  subtax_next = true;
  subtax_previous = true;
  taxrate_next = true;
  taxrate_previous = true;
  bank_next = true;
  productcatlist: Array<any> = [];
  bank_previous = true;
  branch_next = true;
  branch_previous = true;
  paymode_next = true;
  paymode_previous = true;
  uom_next = true;
  uom_previous = true
  currentpage: number = 1;
  presentpage = 1;

  urldocgrp: string;
  isDocGrp: boolean;
  docgrplist: any;
  isDocGrpForm: boolean;
  isDocGrpEditForm: boolean;
  proNumber: any;
  taxlistdata: Array<any> = [];

  has_nextdoc = true;
  has_previousdoc = false;
  currentpageDoc: number = 1;
  presentpageDoc: number = 1;
  isDocpagination: boolean;
  has_categorypre: boolean = false;
  has_categorynxt: boolean = true;
  has_categorypage: number = 1;
  has_subcategorypre: boolean = false;
  has_subcategorynxt: boolean = true;
  has_subcategorypage: number = 1;
  has_taxnamepre: boolean = false;
  has_taxnamenxt: boolean = true;
  has_taxnamepage: number = 1;
  has_subtaxpre: boolean = false;
  has_subtaxnamenxt: boolean = true;
  has_subtaxnamepre: boolean = false;
  has_subtaxnamepage: number = 1;
  has_subtaxratepre: boolean = false;
  has_subtaxratenamenxt: boolean = true;
  has_subtaxratenamepage: number = 1;
  has_subtaxratenamepre: boolean = false;
  isproduct: boolean;
  urlproduct: string;
  productlist: any
  has_nextpro = true;
  has_previouspro = false;
  currentpagepro: number = 1;
  presentpagepro: number = 1;
  isProductForm: boolean;
  isProductEditForm: boolean;
  taxnamelist: Array<any> = [];
  subtaxnamelist: Array<any> = [];
  subtaxratelist: Array<any> = [];
  isBankPagination: boolean;
  isPaymodePagination: boolean;
  isBankBranchPagination: boolean;
  taxnamelistNew: Array<any> = [];
  subtaxnamelistNew: Array<any> = [];
  subtaxratelistNew: Array<any> = [];
  staxnamelistNew: Array<any> = [];
  ssubtaxnamelistNew: Array<any> = [];
  ssubtaxratelistNew: Array<any> = [];
  urlApSubCategory: string;
  isApSubCategory: boolean;
  urlApSubCategoryapprover: string;
  isApSubCategoryapprover: boolean;
  isApSubCategoryForm: boolean;
  isApSubCategorypage: boolean = true;
  isApSubCategorypages: boolean = true;
  isApSubCategoryEditForm: boolean;
  getApSubCategoryList: any;
  has_nextapsub = true;
  has_previousapsub = true;
  currentpageapsub: number = 1;
  presentpageapsub: number = 1;
  tform: FormGroup;
  subtform: FormGroup;
  taxratetform: FormGroup;
  isLoading = false;
  taxData: any;
  bform: FormGroup;
  pform: FormGroup;
  bbform: FormGroup;
  cform: FormGroup;
  uform: FormGroup;
  prform: FormGroup;
  dform: FormGroup;
  apcform: FormGroup;
  apsform: FormGroup;
  apcategoryform: FormGroup;
  protypeform: FormGroup;
  pcform: FormGroup;
  hsnlist: Array<any> = [];
  hsn: boolean;
  hsnUrl: any;
  ishsnform: boolean;
  ishsneditform: boolean;
  hsn_nextpro = true;
  hsn_previouspro = false;
  hsnpresentpagepro = 1;
  hsnform: FormGroup;
  taxaddfrom: any = FormGroup;
  subtaxaddform: any = FormGroup;
  taxrateaddgorm: any = FormGroup;

  questiontypeurl: string;
  questionheaderurl: string;
  questionurl: string;
  vendormapping: string;
  activityurl: string;
  questionmappingurl: string;
  questiontype: boolean;
  questionheader: boolean;
  question: boolean;
  vendormappingboolean: boolean;
  activitymaster: boolean;
  questionmapping: boolean;
  questiontypeform: boolean;
  isquesheaderform: boolean;
  isquestionform: boolean;
  isvendormappingform: boolean;
  activitymasterform: boolean;

  questionmapform: boolean;

  isspecificationdata:Array<any>=[];
  ismakemodelsumary:boolean=false;
  isspecificationsummary:boolean=false;
  isprodscreen:boolean=true;
  isotherattrbscreen:boolean=false;
  makermodelformsummary:any=FormGroup;
  specificationformsummary:any=FormGroup;
  otherattsummaryform:any=FormGroup;
  hasspec_sum_next:boolean=false;
  hasspec_sum_pre:boolean=false;
  hasspec_sum_page:number=1;
  modelsummary:Array<any>=[];
  hasmodel_sum_next:boolean=false;
  hasmodel_sum_pre:boolean=false;
  hasmodel_sum_page:number=1;
  productlistsummary:Array<any>=[];
  makeModelList_new:Array<any>=[];
  labelnamelist:Array<any>=[];
  makermodelformchild:any=FormGroup;
  makermodelformsummary_array:any=FormGroup;
 



  questiontypeformgroup:FormGroup;
  quesheaderform:FormGroup;
  questionform:FormGroup;
  questionmappingform:FormGroup;
  vendormappingform:FormGroup;

  QuestypeList: any;
  ques_nexttype=true;
  ques_previoustype=true;
  quespresentpage=1;
  QuesheaderList: any;
  queshdr_nexttype=true;
  queshdr_previoustype=true;
  queshdrpresentpage=1;
  questypelist: any;
  questype_has_next=true;
  questype_has_previous=true;
  questype_currentpage=1;

  QuestionList: any;
  question_nexttype=true;
  question_previoustype=true;
  questionpresentpage=1;
  questiondata=[];
  question_has_next=true;
  question_has_previous=true;
  question_currentpage=1;
  VenMapList: any;
  venmap_nexttype=true;
  venmap_previoustype=true;
  venmappresentpage=1;

  activitydesignationform:FormGroup;
  activitydesign=false;
  activitydesignform=false;
  activitydesign_has_next=true;
  activitydesign_has_previous=true;
  activitydesign_currentpage=1;
  activitydesignationurl:any;
  activitydesignationdata=[]
  isriskcategory: boolean;
  isriskcategoryurl: any;
  getriskcatList: any;
  risk_next = true;
  risk_previous = true;
  riskindex: any;
  riskform: any;
  riskeditid: any;
  isupdate= false;
  apcatSearchForm: FormGroup
  apcatapproverform:FormGroup
  apsubcatapproverForm:FormGroup
  isriskassesment: boolean;
  isriskassesmenturl: any;
  getriskassesmentList: any;
  riskass_next: any;
  riskass_previous: any;
  riskassindex: any;
  riskassesmentform: FormGroup;
  riskassesmenteditid: any;
  file: any;
  first:boolean=false;
  urlproductmapping: string;
  isProductCompMapping: boolean;
  prodmappingSearchform: FormGroup;
  @ViewChild('inputproducts') inputproducts: any;
  @ViewChild('productss') matproductsAutocompletes: MatAutocomplete;
  hasprod_comp_next:boolean=false;
  hasprod_comp_pre:boolean=false;
  hasprod_comp_page:number=1;
  prodcompaddform: FormGroup;
  @ViewChild('parentproduct') parentproduct: any;
  @ViewChild('parentproducts') matproductsAutocompleteparent: MatAutocomplete;
  @ViewChild('childproduct') childproduct: any;
  @ViewChild('childproductsss') childproducts: any;
  @ViewChild('childproducts') matproductsAutocompletechild: MatAutocomplete;
  @ViewChild('childproductss') matproductssAutocompletechild: MatAutocomplete;
  prodmappingEditform: FormGroup;
  isProductCompMappingpopup: boolean = false;


  constructor(private shareService: SharedService, private sharedService: ShareService,private toaster: ToastrService,
    private atmaService: AtmaService, private fb: FormBuilder, private notification: NotificationService,private spinner:NgxSpinnerService,
  private errorHandler: ErrorHandlingService) { }

  ngOnInit(): void {
    this.tform = this.fb.group({
      taxname: [''],
      subtaxname:[''],
      taxratename:[''],
      activeinactive:['']      

    });
    
    this.riskassesmentform = this.fb.group({
      riskscen: [''],
      desc  :[''],
      response:[''],
      id:[''],
      file:['']

    });


    this.taxaddfrom = this.fb.group({
      taxname: ['', Validators.required],
      name: ['', Validators.required],
      glno: ['', Validators.required],
      pay_receivable: ['', Validators.required],
      isreceivable: ['', Validators.required]
    });
    this.taxaddfrom.get('taxname').valueChanges.pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.atmaService.gettaxnamelist(value, 1).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ))
    ).subscribe(data => {
      this.taxnamelist = data['data'];
    });
    this.subtform = this.fb.group({
      name: [''],
      code:[''],
      tax: [''],
      activeinactive:['']      

      

    });
    this.subtaxaddform = this.fb.group({
      'name': ['', Validators.required],
      'subtaxname': ['', Validators.required],
      'subtaxlimit': ['', Validators.required],
      'subtaxremarks': ['', Validators.required],
      'subcategory': ['', Validators.required],
      'subcategorysub': ['', Validators.required],
      'glno': ['', Validators.required],
      'tax': ['', Validators.required]
    })
    this.taxratetform = this.fb.group({
      name: [''],
      code:[''],
      activeinactive:['']      


    });
    this.subtaxaddform.get('name').valueChanges.pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.atmaService.gettaxnamelist(value, 1).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ))
    ).subscribe(data => {
      this.taxnamelist = data['data'];
    });
    // this.subtaxaddform.get('tax').valueChanges.pipe(
    //   tap(()=>{
    //     this.isLoading=true;
    //   }),
    //   switchMap(value=>this.atmaService.getsubtaxnamelist(this.subtaxaddform.get('name').value.id,value,1).pipe(
    //     finalize(()=>{
    //       this.isLoading=false;
    //     })
    //   ))
    // ).subscribe(data=>{
    //   this.subtaxnamelist=data['data'];
    // });
    this.taxrateaddgorm = this.fb.group({
      'name': ['', Validators.required],
      'subtaxrate': ['', Validators.required],
      'subtaxratenew': ['', Validators.required],
      'taxratename': ['', Validators.required],
      'coderate': ['', Validators.required]
    });
    this.taxrateaddgorm.get('name').valueChanges.pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.atmaService.gettaxnamelist('', 1).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ))
    ).subscribe(data => {
      this.taxnamelistnew = data['data'];
    });
    this.taxrateaddgorm.get('subtaxrate').valueChanges.pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.atmaService.getsubtaxnamelist(this.taxrateaddgorm.get('name').value.id, value, 1).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ))
    ).subscribe(data => {
      this.subtaxnamelistNew = data['data'];
    });
    this.taxrateaddgorm.get('subtaxratenew').valueChanges.pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.atmaService.getsubratetaxnamelist(this.taxrateaddgorm.get('subtaxrate').value.id, value, 1).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ))
    ).subscribe(data => {
      this.subtaxratelist = data['data'];
    });
    this.bform = this.fb.group({
      name: [''],
      activeinactive:[''],
      code:['']

    })
    this.pform = this.fb.group({
      name: [''],
      code:['']

    })
    this.bbform = this.fb.group({
      name: [''],
      code:['']

    })
    this.uform = this.fb.group({
      name: [''],
      code:['']

    })
    this.cform = this.fb.group({
      name: [''],
      code:[''],

    })
    this.prform = this.fb.group({
      name: [''],
      code:[''],
      activeinactive:['']

    })
    this.dform = this.fb.group({
      name: ['']

    })
    this.apcform = this.fb.group({
      name: ['']

    })
    this.apsform = this.fb.group({
      name: ['']

    })
    this.apcategoryform = this.fb.group({
      name: ['']

    })
    this.protypeform = this.fb.group({
      name: [''],
      code:['']

    })
    this.pcform = this.fb.group({
      name: [''],
      code:['']

    })
    this.hsnform = this.fb.group({
      hsncode: [''],
      activeinactive:['']

    });

    this.questiontypeformgroup = this.fb.group({
      name: ['']
    })

    

    this.quesheaderform = this.fb.group({
      name: ['']
    })

    this.questionform = this.fb.group({
      type_id : ['']
    })

    this.questionmappingform = this.fb.group({
      type_id: [''],
      header: [''],
  
    })

    this.vendormappingform=this.fb.group({
      type_id:['',Validators.required]
    })

    this.activitydesignationform=this.fb.group({
      activityname:['']
    })

    let datas = this.shareService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "Vendor Master") {
        this.vendorMasterList = subModule;
        // this.isTax = subModule[0].name;
        // if (subModule[0].name === "Tax") {
        //   this.ismakerCheckerButton = this.addFormBtn;
        // }
        console.log("VendorList", this.vendorMasterList)
      }
      this.makermodelformchild=this.fb.group({
        productname:new FormControl(""),
        labelname:new FormControl(""),
        "labeltype":new FormControl(""),
        "configuration":new FormControl(""),
        "label_group":new FormControl(""),
        "label_type":new FormControl(""),
        "mainArray":this.fb.array([
          this.fb.group({
            "proname":new FormControl(""),
            "lbname":new FormControl(""),
            "lbtype":new FormControl(""),
            "main_enb":false,
            "specification_type":this.fb.array([
              this.fb.group({
                "spec_name":new FormControl("")
              })
            ]),
            "Configuration_type":this.fb.array([
              this.fb.group({
                "config_name":new FormControl("")
              })
            ])
          })
        ]),
        "specification_type":this.fb.array([
          this.fb.group({
            "spec_name":new FormControl("")
          })
        ])
  
      });
      this.makermodelformsummary=this.fb.group({
        productname:new FormControl(""),
        labelname:new FormControl(""),
        "labeltype":new FormControl("")
  
      });
      this.makermodelformsummary_array=this.fb.group({
        "productname":new FormControl(""),
        "labelname":new FormControl(""),
        "labeltype":new FormControl(""),
        "mainArray":this.fb.array([
          this.fb.group({
            "proname":new FormControl(""),
            "lbname":new FormControl(""),
            "lbtype":new FormControl(""),
            "main_enb":false,
            
            "subarr":this.fb.array([
              this.fb.group({
                "subproname":new FormControl(""),
                "sublbname":new FormControl(""),
                "sublbtype":new FormControl(""),
                "sub_enb":false
              })
            ]),
            
          })
        ])
  
      });
      this.makermodelformsummary_array=this.fb.group({
        "productname":new FormControl(""),
        "labelname":new FormControl(""),
        "labeltype":new FormControl(""),
        "mainArray":this.fb.array([
          this.fb.group({
            "proname":new FormControl(""),
            "lbname":new FormControl(""),
            "lbtype":new FormControl(""),
            "lid":new FormControl(""),
            "main_enb":false,
            "subarr":this.fb.array([
              this.fb.group({
                "subproname":new FormControl(""),
                "sublbname":new FormControl(""),
                "sublbtype":new FormControl(""),
                "sub_enb":false
              })
            ])
          })
        ])
  
      });
      this.makermodelformchild.get("labeltype").valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
  
        switchMap(value => this.atmaService.asset_specification_get(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        console.log(datas);
        this.labelnamelist = datas;
      });
      
      this.specificationformsummary=this.fb.group({
        'type':new FormControl(""),
        "productname":new FormControl("")
      });
      this.specificationformsummary.get('productname').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
  
        switchMap(value => this.atmaService.getproductpage(1, 10, value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productlist = datas;
      });
      this.otherattsummaryform=this.fb.group({
        "productname":new FormControl("")
      });
      this.otherattsummaryform.get('productname').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
  
        switchMap(value => this.atmaService.getproductpage(1, 10, value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productlist = datas;
      });
  
      this.makermodelformsummary.get('productname').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
  
        switchMap(value => this.atmaService.getproductpage(1,10, value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productlistsummary = datas;
      });
    
        
  
    });
    // this.hsn=true;
    //   this.getTax();
    //   this.getSubTax();
    //   this.getTaxRate();
    //   this.getBank();
    //   this.getPaymode();
    //   this.getBankbranch();
    //   this.gethsnlist(1);
    //   this.getProductType();
    //   this.getApCategory();

    //   this.getUom();
    //   this.getCustomerCategory();
    //   this.getProductCategory();
    //   this.getdoclist();
    //   this.getproductlist();
    //   this.getApSubCategory();
    this.editapcat = this.fb.group({
      id: '',
      isasset: ''
    })
    this.apcatSearchForm = this.fb.group({
      no: [''],
      name: [''],
      activeinactive:['']
    })
    this.editapsubcat = this.fb.group({
      id: '',
      gstblocked: ['', Validators.required],
      gstrcm: ['', Validators.required],
      status: ''
    })
    this.apsubcatSearchForm = this.fb.group({
      no: "",
      name: "",
      activeinactive:"",
      category_id: [''],
    })
    this.apcatapproverform=this.fb.group({
      no:"",
      name:""
    })
    this.apsubcatapproverForm=this.fb.group({
      no:"",
      name:"",
      category_id:"",
    })
    let apcatkeyvalue: String = "";
    this.getcategory(apcatkeyvalue);
    this.apsubcatSearchForm.get('category_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.atmaService.getcategoryFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryList = datas;

      });
    this.subtaxaddform.get('subcategory').valueChanges.pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.atmaService.getapcat_LoadMore(value, 1).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ))
    ).subscribe(datas => {
      this.productcatlist = datas['data'];
    });
    this.subtaxaddform.get('name').valueChanges.pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.atmaService.gettaxnamelist(value, 1).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ))
    ).subscribe(datas => {
      this.taxlistdata = datas['data'];
    });
    this.taxrateaddgorm.get('name').valueChanges.pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.atmaService.gettaxnamelist(value, 1).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ))
    ).subscribe(datas => {
      this.staxnamelistNew = datas['data'];
    });

    this.makermodelformchild=this.fb.group({
      productname:new FormControl(""),
      labelname:new FormControl(""),
      "labeltype":new FormControl(""),
      "configuration":new FormControl(""),
      "label_group":new FormControl(""),
      "label_type":new FormControl(""),
      "mainArray":this.fb.array([
        this.fb.group({
          "proname":new FormControl(""),
          "lbname":new FormControl(""),
          "lbtype":new FormControl(""),
          "main_enb":false,
          "specification_type":this.fb.array([
            this.fb.group({
              "spec_name":new FormControl("")
            })
          ]),
          "Configuration_type":this.fb.array([
            this.fb.group({
              "config_name":new FormControl("")
            })
          ])
        })
      ]),
      "specification_type":this.fb.array([
        this.fb.group({
          "spec_name":new FormControl("")
        })
      ])

    });
    this.makermodelformsummary=this.fb.group({
      productname:new FormControl(""),
      labelname:new FormControl(""),
      "labeltype":new FormControl("")

    });
    this.makermodelformsummary_array=this.fb.group({
      "productname":new FormControl(""),
      "labelname":new FormControl(""),
      "labeltype":new FormControl(""),
      "mainArray":this.fb.array([
        this.fb.group({
          "proname":new FormControl(""),
          "lbname":new FormControl(""),
          "lbtype":new FormControl(""),
          "main_enb":false,
          
          "subarr":this.fb.array([
            this.fb.group({
              "subproname":new FormControl(""),
              "sublbname":new FormControl(""),
              "sublbtype":new FormControl(""),
              "sub_enb":false
            })
          ]),
          
        })
      ])

    });
    this.makermodelformsummary_array=this.fb.group({
      "productname":new FormControl(""),
      "labelname":new FormControl(""),
      "labeltype":new FormControl(""),
      "mainArray":this.fb.array([
        this.fb.group({
          "proname":new FormControl(""),
          "lbname":new FormControl(""),
          "lbtype":new FormControl(""),
          "lid":new FormControl(""),
          "main_enb":false,
          "subarr":this.fb.array([
            this.fb.group({
              "subproname":new FormControl(""),
              "sublbname":new FormControl(""),
              "sublbtype":new FormControl(""),
              "sub_enb":false
            })
          ])
        })
      ])

    });
    this.makermodelformchild.get("labeltype").valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),

      switchMap(value => this.atmaService.asset_specification_get(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      console.log(datas);
      this.labelnamelist = datas;
    });
    
    this.specificationformsummary=this.fb.group({
      'type':new FormControl(""),
      "productname":new FormControl("")
    });
    this.specificationformsummary.get('productname').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),

      switchMap(value => this.atmaService.getproductpage(1, 10, value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.productlist = datas;
    });

    this.makermodelformsummary.get('productname').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),

      switchMap(value => this.atmaService.getproductpage(1,10, value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.productlistsummary = datas;
    });

    this.prodmappingSearchform = this.fb.group({
      productname : ''
    })
    this.prodcompaddform = this.fb.group({  
        product_id: '',
        child_id: ''
    })
    this.prodmappingEditform = this.fb.group({
      id: '',
      product_id: '',
      child_id: ''
    });
  }
  datacategory() {
    this.atmaService.getapcat_LoadMore('', 1).subscribe(datas => {
      this.productcatlist = datas['data'];
    });
    console.log(this.productcatlist);
  }
  apcat_id:any;
  getapsubcategorydata() {
    if (this.subtaxaddform.get('subcategory').value.id == undefined || this.subtaxaddform.get('subcategory').value == '' || this.subtaxaddform.get('subcategory').value == undefined || this.subtaxaddform.get('subcategory').value.id == null || this.subtaxaddform.get('subcategory').value.id == "") {
      this.notification.showError('Please Select The Category');
      return false;
    }
    else{
      this.apcat_id=this.subtaxaddform.get('subcategory').value.id;

    }
    
    this.atmaService.getapsubcat_tax(this.apcat_id,'',1).subscribe(datas => {
      this.subcategorylistdata = datas['data'];
    });
    this.subtaxaddform.get('subcategorysub').valueChanges.pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.atmaService.getapsubcat_tax(this.apcat_id,this.subtaxaddform.get('subcategorysub').value,1).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ))
    ).subscribe(datas => {
      this.subcategorylistdata = datas['data'];
    });
  }
  subcategorylistdata: Array<any> = [];
  getdisplaycategoryinterface(data?: categorylista): string | undefined {
    return data ? data.name : undefined;
  }
  getsubcategoryinterface(data?: subcatgorylista): string | undefined {
    return data ? data.name : undefined;
  }
  dsearch() {

    this.atmaService.getParentDropDown(this.dform.value.name)
      .subscribe(result => {
        let datas = result['data'];
        this.docgrplist = datas;
        let datapagination = result["pagination"];
        this.docgrplist = datas;
        if (this.docgrplist.length >= 0) {
          this.has_nextdoc = datapagination.has_next;
          this.has_previousdoc = datapagination.has_previous;
          this.presentpageDoc = datapagination.index;
          this.isDocpagination = true;
        } if (this.docgrplist <= 0) {
          this.isDocpagination = false;
        }

      })
  }
 
  numbersOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
        if ((charCode >= 48 && charCode <= 57) || charCode === 46) {
      return true;
    }
    
    return false;
  }

  taxReset(){
    this.tform.reset('');
    this.getTax(1);
  }
  resetbank(){
    this.bform.reset('');
    this.getBank(1);
  }

  
  bankactiveinactive(data){
    let status:any= {'status':data.status};
    this.spinner.show();
    this.atmaService.bankactiveinactive(data.id,status).subscribe(data=>{
    this.spinner.hide();
    this.notification.showSuccess(data['message']);
    this.bform.reset('')
    this.getBank(1);
    },(error)=>{
      this.notification.showError(error.status + error.statusText);
    });
  }
   taxdroplists() {

    let prokeyvalue: String = "";
    this.gettax(prokeyvalue);
    this.subtform.get('tax').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.atmaService.Tax_dropdownsearchST(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),

          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.taxlist = datas;

      })

  }

  private gettax(prokeyvalue) {
    this.atmaService.Tax_dropdownsearchST(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.taxlist = datas;

        this.taxData = datas.id;


      })
  }

  get taxtype() {
    return this.subtform.get('tax');
  }
  public getdisplaytaxnamelist(data?: taxnamelist): string | undefined {
    return data ? data.name : undefined;
  }
  public getdisplaysubtaxnamelistinterface(data?: subtaxname): string | undefined {
    return data ? data.name : undefined;
  }
  public getdisplaysubtaxrateinterface(data?: subtaxrate): string | undefined {
    return data ? data.name : undefined;
  }
  taxnamelistnew: Array<any> = [];
  gettaxnamelists() {
    this.atmaService.gettaxnamelist('', 1).subscribe(data => {
      this.taxnamelist = data['data'];
    });
  }
  gettaxnamelistsdata() {
    this.atmaService.gettaxnamelist('', 1).subscribe(data => {
      this.staxnamelistNew = data['data'];
    });
  }
  gettaxnamedatalists() {
    this.atmaService.gettaxnamelist('', 1).subscribe(data => {
      this.taxlistdata = data['data'];
    });
  }
  gettaxnamelistnew() {
    this.atmaService.gettaxnamelist('', 1).subscribe(data => {
      this.taxnamelistnew = data['data'];
    });
  }
  //*************** */
  getsubtaxratedatalist() {
    this.atmaService.gettaxnamelist('', 1).subscribe(data => {
      this.taxnamelistNew = data['data'];
    });
  }
  getsubtaxdata() {
    if (this.taxrateaddgorm.get('name').value.id == undefined || this.taxrateaddgorm.get('name').value == '' || this.taxrateaddgorm.get('name').value == null) {
      this.notification.showError('Please Select The Tax Name');
      return false;
    }
    console.log(this.taxrateaddgorm.value)
    this.atmaService.getsubtaxnamelist(this.taxrateaddgorm.get('name').value.id, '', 1).subscribe(data => {
      this.ssubtaxnamelistNew = data['data'];
    });
    this.taxrateaddgorm.get('subtaxrate').valueChanges.pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.atmaService.getsubtaxnamelist(this.taxrateaddgorm.get('name').value.id, value, 1).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ))
    ).subscribe(data => {
      this.ssubtaxnamelistNew = data['data'];
    })
  }
  getsubtaxnameviewdata() {
    if (this.taxrateaddgorm.get('subtaxrate').value.id == undefined || this.taxrateaddgorm.get('subtaxrate').value == '' || this.taxrateaddgorm.get('subtaxrate').value == null) {
      this.notification.showError('Please select The Tax Name');
      return false;
    }
    this.atmaService.getsubratetaxnamelist(this.taxrateaddgorm.get('subtaxrate').value.id, '', 1).subscribe(data => {
      this.ssubtaxratelistNew = data['data'];
    });
    console.log(this.subtaxratelist);
    this.taxrateaddgorm.get('subtaxratenew').valueChanges.pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.atmaService.getsubratetaxnamelist(this.taxrateaddgorm.get('subtaxrate').value.id, value, 1).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ))
    ).subscribe(data => {
      this.ssubtaxratelistNew = data['data'];
    });

  }
  gettaxinfinitesNew(data: any) {

    setTimeout(() => {
      if (
        this.matsratetaxname &&
        this.autocompleteTrigger &&
        this.matsratetaxname.panel
      ) {
        fromEvent(this.matsratetaxname.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsratetaxname.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsratetaxname.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsratetaxname.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsratetaxname.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_taxnamenxt === true) {
                this.atmaService.gettaxnamelist(this.taxsrateInput.nativeElement.value, this.has_taxnamepage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.staxnamelistNew = this.staxnamelistNew.concat(datas);
                    if (this.staxnamelistNew.length >= 0) {
                      this.has_taxnamenxt = datapagination.has_next;
                      this.has_taxnamepre = datapagination.has_previous;
                      this.has_taxnamepage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });


  }
  getsubtaxnameinfiniteNew() {
    setTimeout(() => {
      if (
        this.matsratedatataxname &&
        this.autocompleteTrigger &&
        this.matsratedatataxname.panel
      ) {
        fromEvent(this.matsratedatataxname.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsratedatataxname.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsratedatataxname.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsratedatataxname.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsratedatataxname.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_subtaxnamenxt === true) {
                this.atmaService.getsubtaxnamelist(this.taxrateaddgorm.get('name').value.id, this.taxsratedataInput.nativeElement.value, this.has_subtaxnamepage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.ssubtaxnamelistNew = this.ssubtaxnamelistNew.concat(datas);
                    if (this.ssubtaxnamelistNew.length >= 0) {
                      this.has_subtaxnamenxt = datapagination.has_next;
                      this.has_subtaxnamepre = datapagination.has_previous;
                      this.has_subtaxnamepage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  getsubtaxrateinfiniteNew() {
    setTimeout(() => {
      if (
        this.matsubratedatataxname &&
        this.autocompleteTrigger &&
        this.matsubratedatataxname.panel
      ) {
        fromEvent(this.matsubratedatataxname.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsubratedatataxname.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsubratedatataxname.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsubratedatataxname.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsubratedatataxname.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_subtaxratenamenxt === true) {
                this.atmaService.getsubratetaxnamelist(this.taxrateaddgorm.get('subtaxrate').value.id, this.taxssubratedataInput.nativeElement.value, this.has_subtaxratenamepage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.ssubtaxratelistNew = this.ssubtaxratelistNew.concat(datas);
                    if (this.ssubtaxratelistNew.length >= 0) {
                      this.has_subtaxratenamenxt = datapagination.has_next;
                      this.has_subtaxratenamepre = datapagination.has_previous;
                      this.has_subtaxratenamepage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  gettaxnamelistsednew() {
    if (this.taxrateaddgorm.get('name').value.id == undefined || this.taxrateaddgorm.get('name').value == '' || this.taxrateaddgorm.get('name').value == null) {
      this.notification.showError('Please Select The Tax Name');
      return false;
    }
    console.log(this.taxrateaddgorm.value)
    this.atmaService.getsubtaxnamelist(this.taxrateaddgorm.get('name').value.id, '', 1).subscribe(data => {
      this.subtaxnamelistNew = data['data'];
    });
  }

  getsubtaxnamelistrate() {
    if (this.taxrateaddgorm.get('subtaxrate').value.id == undefined || this.taxrateaddgorm.get('subtaxrate').value == '' || this.taxrateaddgorm.get('subtaxrate').value == null) {
      this.notification.showError('Please select The Tax Name');
      return false;
    }
    this.atmaService.getsubratetaxnamelist(this.taxrateaddgorm.get('subtaxrate').value.id, '', 1).subscribe(data => {
      this.subtaxratelistNew = data['data'];
    });
    console.log(this.subtaxratelist);
    this.taxrateaddgorm.get('subtaxratenew').valueChanges.pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.atmaService.getsubratetaxnamelist(this.taxrateaddgorm.get('subtaxrate').value.id, value, 1).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ))
    ).subscribe(data => {
      this.subtaxratelistNew = data['data'];
    });

  }
  getsubtaxratelist() {
    if (this.subtaxaddform.get('name').value.id == undefined || this.subtaxaddform.get('name').value == '' || this.subtaxaddform.get('name').value == null) {
      this.notification.showError('Please Select The Tax Name');
      return false;
    }
    this.atmaService.getsubtaxnamelist(this.subtaxaddform.get('name').value.id, '', 1).subscribe(data => {
      this.subtaxnamelist = data['data'];
    });
    this.subtaxaddform.get('tax').valueChanges.pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.atmaService.getsubtaxnamelist(this.subtaxaddform.get('name').value.id, value, 1).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ))
    ).subscribe(data => {
      this.subtaxnamelist = data['data'];
    });
  }
  public displayFntax(taxtype?: taxListss): string | undefined {

    return taxtype ? taxtype.name : undefined;
  }
  subtaxreset(){
    this.subtform.reset();
    this.getSubTax(1);
  }
 
 
  taxratereset(){
    this.taxratetform.reset('');
    this.getTaxRate(1);
  }


  subModuleData(data) {

    // this.vendorlistfalse()

    this.questiontype = false;
    this.questiontypeform = false

    this.questionheader = false;
    this.isquesheaderform = false;

    this.question = false;
    this.isquestionform = false

    this.vendormappingboolean = false;
    this.isvendormappingform = false;

    this.activitymaster = false;
    this.activitymasterform = false;

    this.questionmapping = false;
    this.questionmapform = false;

    this.activitydesignform=false;
    this.activitydesign=false;



    this.ishsneditform = false;
      this.ishsnform = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isTaxEditForm = false;
      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;

       this.isApCategoryEditForm = false;
      this.isProductTypeForm = false;
      this.isProductTypeEditForm = false;
      this.isProductType = false;
      this.isApCategoryForm = false
      this.isApCategory = false;
      this.isriskcategory =false;
      this.isriskassesment = false;

    this.urls = data.url;
    this.urlSubTax = "/subtax";
    this.urlTax = "/tax";
    this.urlTaxRate = "/taxrate";
    this.urlBank = "/bank";
    this.urlPaymode = "/paymode";
    this.urlBankbranch = "/bankbranch";
    this.urlProductType = "/producttype";
    this.urlApCategory = "/apcategory";
    this.urlUom = "/uom";
    this.urlCustomerCategory = "/customercategory";
    this.urlProductCategory = "/productcategory";
    this.urldocgrp = "/documentgroup";
    this.urlproduct = "/product";
    this.hsnUrl = "/hsn";
    this.urlApSubCategory = "/apsubcategory";
    this.questiontypeurl = "/questypesummary";
    this.questionheaderurl = "/quesheadersummary";
    this.questionurl = "/quessummary";
    this.vendormapping = "/docquesmappingsummary";
    this.activityurl = "/activitysummary";
    this.questionmappingurl = "/questionmapping"
    this.activitydesignationurl="/activitydescription"
    this.isriskcategoryurl  ="/riskcat"
    
    this.isriskassesmenturl = "/vendorriskquestion"
    this.urlApCategoryapprover="/apcategoryapprover"
    this.urlApSubCategoryapprover="/apsubcategoryapprover"
    this.urlproductmapping = "/productcomponentmapping"

    this.isApSubCategory = this.urlApSubCategory === this.urls ? true : false;
    this.isApSubCategoryapprover = this.urlApSubCategoryapprover === this.urls ?true:false;
    this.isTax = this.urlTax === this.urls ? true : false;
    this.isSubTax = this.urlSubTax === this.urls ? true : false;
    this.isTaxRate = this.urlTaxRate === this.urls ? true : false;
    this.isBank = this.urlBank === this.urls ? true : false;
    this.isPaymode = this.urlPaymode === this.urls ? true : false;
    this.isBankbranch = this.urlBankbranch === this.urls ? true : false;
    this.isProductType = this.urlProductType === this.urls ? true : false;
    this.isApCategory = this.urlApCategory === this.urls ? true : false;
    this.isApCategoryapprover = this.urlApCategoryapprover === this.urls ? true:false;
    this.isUom = this.urlUom === this.urls ? true : false;
    this.isCustomerCategory = this.urlCustomerCategory === this.urls ? true : false;
    this.isProductCategory = this.urlProductCategory === this.urls ? true : false;
    this.isDocGrp = this.urldocgrp === this.urls ? true : false;
    this.isproduct = this.urlproduct === this.urls ? true : false;
    this.hsn = this.hsnUrl === this.urls ? true : false;
    this.roleValues = data.role[0].name;
    this.addFormBtn = data.name;

    this.questiontype = this.questiontypeurl === this.urls ? true : false;
    this.questionheader = this.questionheaderurl === this.urls ? true : false;
    this.question = this.questionurl === this.urls ? true : false;
    this.vendormappingboolean = this.vendormapping === this.urls ? true : false;
    this.activitymaster = this.activityurl === this.urls ? true : false;
    this.questionmapping = this.questionmappingurl == this.urls ? true : false;

    this.activitydesign = this.activitydesignationurl == this.urls ? true : false; 
    this.isriskcategory = this.isriskcategoryurl == this.urls ? true : false; 
    this.isriskassesment = this.isriskassesmenturl == this.urls ? true : false;
    this.isProductCompMapping = this.urlproductmapping == this.urls ? true : false;



    if (this.hsn) {
      // this.hsn = true;
      this.gethsnlist(1);
      this.ishsneditform = false;
      this.ishsnform = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isTaxEditForm = false;
      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
      this.isApSubCategoryapprover=false;
      this.isApCategoryapprover=false;
      this.isProductCompMapping = false;
      this.isProductCompMappingEdit = false;
      this.isProductCompMappingpopup = false;

    }


    if (this.isTax) {
      this.getTax(1);
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isTaxEditForm = false;
      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
      this.isApSubCategoryapprover=false;
      this.isApCategoryapprover=false;
      this.isProductCompMapping = false;
      this.isProductCompMappingEdit = false;
      this.isProductCompMappingpopup = false;

    } else if (this.isSubTax) {
      this.getSubTax(1);
      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
      this.isApSubCategoryapprover=false;
      this.isApCategoryapprover=false;
      this.isProductCompMapping = false;
      this.isProductCompMappingEdit = false;
      this.isProductCompMappingpopup = false;

    } else if (this.isTaxRate) {
      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.getTaxRate(1);
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
      this.isApSubCategoryapprover=false;
      this.isApCategoryapprover=false;
      this.isProductCompMapping = false;
      this.isProductCompMappingEdit = false;
      this.isProductCompMappingpopup = false;

    } else if (this.isBank) {
      this.getBank(1);
      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
      this.isApSubCategoryapprover=false;
      this.isApCategoryapprover=false;
      this.isProductCompMapping = false;
      this.isProductCompMappingEdit = false;
      this.isProductCompMappingpopup = false;

    } else if (this.isPaymode) {

      this.getPaymode(1);

      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
      this.isApSubCategoryapprover=false;
      this.isApCategoryapprover=false;
      this.isProductCompMapping = false;
      this.isProductCompMappingEdit = false;
      this.isProductCompMappingpopup = false;

    } else if (this.isBankbranch) {
      this.getBankbranch(1);
      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
      this.isApSubCategoryapprover=false;
      this.isApCategoryapprover=false;
      this.isProductCompMapping = false;
      this.isProductCompMappingEdit = false;
      this.isProductCompMappingpopup = false;

    } else if (this.isUom) {
      this.getUom(1);
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
      this.isApSubCategoryapprover=false;
      this.isApCategoryapprover=false;
      this.isProductCompMapping = false;
      this.isProductCompMappingEdit = false;
      this.isProductCompMappingpopup = false;

    } else if (this.isCustomerCategory) {

      this.getCustomerCategory();

      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
      this.isApSubCategoryapprover=false;
      this.isApCategoryapprover=false;
      this.isProductCompMapping = false;
      this.isProductCompMappingEdit = false;
      this.isProductCompMappingpopup = false;

    } else if (this.isProductCategory) {

      this.getProductCategory(1);

      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
      this.isApSubCategoryapprover=false;
      this.isApCategoryapprover=false;
      this.isProductCompMapping = false;
      this.isProductCompMappingEdit = false;
      this.isProductCompMappingpopup = false;

    }
    else if (this.isProductType) {
      this.getProductType(1);

      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      // this.isApCategoryEditForm=false;
      // this.isApCategoryForm=false
      // this.isApCategoryEditForm=false;
      // this.isApCategoryForm=false;
      // this.isApCategory=false;
      // this.isApSubCategoryForm=false;
      // this.isApSubCategoryEditForm=false;
      this.isProductTypeForm = false;
      this.isProductTypeEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
      this.isApSubCategoryapprover=false;
      this.isApCategoryapprover=false;
      this.isProductCompMapping = false;
      this.isProductCompMappingEdit = false;
      this.isProductCompMappingpopup = false;

    }
    else if (this.isApCategory) {

      this.getapcategorynew(1);

      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      // this.isApSubCategory=false;
      // this.isApSubCategoryForm=false;
      // this.isApSubCategoryEditForm=false;
      this.isProductTypeEditForm = false;
      this.isProductTypeForm = false;
      this.isProductType = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
      this.isApSubCategoryapprover=false;
      this.isApCategoryapprover=false;
      this.isProductCompMapping = false;
      this.isProductCompMappingEdit = false;
      this.isProductCompMappingpopup = false;

      // this.apstatus=0;
      // this.resetcatstatus=1;
    }
    else if(this.isApCategoryapprover) {
      this.apcatapprover(1);     
      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isProductTypeForm = false;
      this.isProductTypeEditForm = false;
      this.isProductType = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
      this.isApSubCategoryapprover=false;
      this.isProductCompMapping = false;
      this.isProductCompMappingEdit = false;
      this.isProductCompMappingpopup = false;

    }
    else if (this.isDocGrp) {

      this.getdoclist();

      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isProductTypeForm = false;
      this.isProductTypeEditForm = false;
      this.isProductType = false;

      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
      this.isApSubCategoryapprover=false;
      this.isApCategoryapprover=false;
      this.isProductCompMapping = false;
      this.isProductCompMappingEdit = false;
      this.isProductCompMappingpopup = false;

    } else if (this.isproduct) {

      this.getproductlist(1);
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isProductTypeForm = false;
      this.isProductTypeEditForm = false;
      this.isProductType = false;

      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
      this.isApSubCategoryapprover=false;
      this.isApCategoryapprover=false;
      this.isProductCompMapping = false;
      this.isProductCompMappingEdit = false;
      this.isProductCompMappingpopup = false;

    } else if (this.isApSubCategory) {

      this.getapsubcategory(1);
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false
      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApCategory = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isProductTypeForm = false;
      this.isProductTypeEditForm = false;
      this.isProductTypeForm = false;
      this.isProductType = false;
      this.isApSubCategoryapprover=false;
      this.isApCategoryapprover=false;
      this.isProductCompMapping = false;
      this.isProductCompMappingEdit = false;
      this.isProductCompMappingpopup = false;

    } 
    else if(this.isApSubCategoryapprover){

      this.apsubcatapprover(1);
      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isProductTypeForm = false;
      this.isProductTypeEditForm = false;
      this.isProductType = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
      this.isApCategoryapprover=false;
      this.isProductCompMapping = false;
      this.isProductCompMappingEdit = false;
      this.isProductCompMappingpopup = false;
     

    } 
    else if (this.questiontype) {
      this.questypesearch(this.quespresentpage = 1)
    }
    else if(this.questionheader){
    this.quesheadersearch(this.queshdrpresentpage = 1)
    }
    else if (this.question){

    this.questionsearch(1);

    }
    else if(this.questionmapping){
      this.getquestions('',this.question_currentpage=1)
    }
    else if(this.vendormappingboolean){
      this.mappingsearch('',this.venmappresentpage = 1)
    }
    else if(this.activitydesign){
      this.activitydesignationsearch('',this.activitydesign_currentpage=1)
    }
    else if(this.isriskcategory){

      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
      this.isApSubCategoryapprover=false;
      this.isApCategoryapprover=false;
      this.getriskcat()
      this.isProductCompMapping = false;
      this.isProductCompMappingEdit = false;
      this.isProductCompMappingpopup = false;
    }
    else if(this.isriskassesment){

      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
      this.isApSubCategoryapprover=false;
      this.isApCategoryapprover=false;
      this.getriskassesmentques()
      this.isProductCompMapping = false;
      this.isProductCompMappingEdit = false;
      this.isProductCompMappingpopup = false;
    }
    else if(this.isProductCompMapping){
       this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
      this.isApSubCategoryapprover=false;
      this.isApCategoryapprover=false;
      this.isProductCompMapping = true;
      this.prodMappingSummary();
      this.isProductCompMappingEdit = false;
      this.isProductCompMappingpopup = false;
      
    }
    



    if (this.roleValues === "Maker") {
      this.ismakerCheckerButton = true;
    } else if (this.roleValues === "Checker") {
      this.ismakerCheckerButton = false;
    }
    if(this.isTax || this.isSubTax || this.isTaxRate){
      this.ismakerCheckerButton = false;
    }
    if(this.isApCategoryapprover ||this.isApSubCategoryapprover){
      this.ismakerCheckerButton =false;
    }
  }


  addForm() {

    this.resetsharedservice()

    if (this.addFormBtn === "Tax") {
      this.isTaxForm = true;
      this.isTax = false;
      this.ismakerCheckerButton = false;
    } else if (this.addFormBtn === "Subtax") {
      this.isSubTaxForm = true;
      this.ismakerCheckerButton = false
      this.isSubTax = false;
    } else if (this.addFormBtn === "Tax Rate") {
      this.ismakerCheckerButton = false;
      this.isTaxRateForm = true;
      this.isTaxRate = false
    }
    else if (this.addFormBtn === "Bank") {
      this.ismakerCheckerButton = false;
      this.isBankForm = true;
      this.isBank = false
    } else if (this.addFormBtn === "Paymode") {
      this.ismakerCheckerButton = false;
      this.isPaymodeForm = true;
      this.isPaymode = false
    } else if (this.addFormBtn === "Bank Branch") {
      this.ismakerCheckerButton = false;
      this.isBankbranchForm = true;
      this.isBankbranch = false
    } else if (this.addFormBtn === "Product Type") {
      this.ismakerCheckerButton = false;
      this.isProductTypeForm = true;
      this.isProductType = false
    } else if (this.addFormBtn === "Ap Category") {
      this.ismakerCheckerButton = false;
      this.isApCategoryForm = true;
      this.isApCategory = false
    } else if (this.addFormBtn === "UOM") {
      this.ismakerCheckerButton = false;
      this.isUomForm = true;
      this.isUom = false
    } else if (this.addFormBtn === "Customer Category") {
      this.ismakerCheckerButton = false;
      this.isCustomerCategoryForm = true;
      this.isCustomerCategory = false
    } 
    else if (this.addFormBtn ==="Risk Category"){
      this.ismakerCheckerButton = false;

    }
    else if (this.addFormBtn === "Product Category") {
      this.ismakerCheckerButton = false;
      this.isProductCategoryForm = true;
      this.isProductCategory = false
    } else if (this.addFormBtn === "Document Group") {
      this.ismakerCheckerButton = false;
      this.isDocGrpForm = true;
      this.isDocGrp = false
    } else if (this.addFormBtn === "Product") {
      this.ismakerCheckerButton = false;
      this.isProductForm = true;
      this.isproduct = false
    } else if (this.addFormBtn === "Ap Subcategory") {
      this.ismakerCheckerButton = false;
      this.isApSubCategoryForm = true;
      this.isApSubCategory = false
    }
    else if (this.addFormBtn === "HSN") {
      this.ismakerCheckerButton = false;
      this.ishsnform = true;
      this.hsn = false;
      this.ishsneditform = false;
    }
    else if( this.addFormBtn == 'QuestionType' ){
      this.addquestiontype()
    }
    else if( this.addFormBtn == 'Question Header' ){
      this.addquestionheader()
    }
    else if( this.addFormBtn == 'Question Master' ){
      this.addquestion()
    }
    else if( this.addFormBtn == 'Question Mapping' ){
      this.addquestionmapping()
    }
    else if( this.addFormBtn == 'Vendor Mapping' ){
      this.addvenmap()
    }
    else if( this.addFormBtn == "Acitivity Description" ){
      this.ismakerCheckerButton = false;
      this.activitydesign=false;
      this.activitydesignform=true;``
        
    }
    else if( this.addFormBtn == "Product Component Mapping"){
      this.ismakerCheckerButton = false;
      this.activitydesign=false;
      this.activitydesignform=false;
      // this.isProductCompMappingpopup=true;
      this.isProductCompMapping = true;
      this.isProductCompMappingEdit = false;
        var myModal = new (bootstrap as any).Modal(
            document.getElementById("addProdMap"),
            {
              backdrop: "static",                           
              keyboard: false
            }
          );
          myModal.show();
    }
  }
  hsnCancel() {
    this.hsnreset();
    this.ishsnform = false;
    this.ismakerCheckerButton = true;
    this.hsn = true;
    this.ishsneditform = false;
  }

  hsnSubmit() {
    this.hsnreset();
    this.ishsnform = false;
    this.ismakerCheckerButton = true;
    this.hsn = true;
    this.ishsneditform = false;
  }
  hsnedit(data: any) {
    this.ishsnform = false;
    this.ismakerCheckerButton = false;
    this.hsn = false;
    this.ishsneditform = true;
    this.sharedService.hsnedit.next(data);
    
    return true;
  }
  hsnactiveinactive(data: any) {
    let d: any = {
      'id': data.id,
      'status': data.status
    };
    this.spinner.show();
    this.atmaService.gethsnactiveinactive(d).subscribe(res => {
    this.spinner.hide();
      if (res['status'] == 'success') {
        this.notification.showSuccess(res['message']);
        this.hsnreset();
      }
      else {
        this.notification.showError(res['code']);
        this.notification.showError(res['description']);
      }
    },
      (error) => {
        this.notification.showError(error.status + error.statusText);
      }
    );
  }
  getTax(page) {
    this.spinner.show();
    let tax:any;
    let sub_tax:any;
    let tax_rate:any;
    let status:any;
    if(this.tform.get('taxname').value == undefined || this.tform.get('taxname').value == null || this.tform.get('taxname').value == ''){
      tax='';
    }else{
      tax=this.tform.get('taxname').value;
    }
    if(this.tform.get('subtaxname').value == undefined || this.tform.get('subtaxname').value ==null || this.tform.get('subtaxname').value ==''){
      sub_tax='';
    }else{
      sub_tax=this.tform.get('subtaxname').value; 
    }
    if(this.tform.get('taxratename').value ==undefined || this.tform.get('taxratename').value ==null || this.tform.get('taxratename').value ==''){
      tax_rate='';
    }else{
      tax_rate=this.tform.get('taxratename').value;
    }
    if(this.tform.get("activeinactive").value ==undefined ||this.tform.get("activeinactive").value ==null || this.tform.get("activeinactive").value =='' ){
      status='';
    }else{
      status=this.drpdwn[this.tform.get("activeinactive").value]
    }
    this.atmaService.getTaxsummary(page,tax,sub_tax,tax_rate,status).subscribe(result => {
        this.spinner.hide();
        this.getTaxList = result['data'];
        let dataPagination = result['pagination'];
        if (this.getTaxList.length >= 0) {
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
        }
        if (this.has_next == true) {
          this.has_next = true;
        }
        if (this.has_previous == true) {
          this.has_previous = true;
        }
      })
  }

  nextClickTax() {   
    if (this.has_next === true) {
      this.currentpage = this.presentpage + 1
      this.getTax( this.presentpage + 1,)
    }

  }

  


  previousClickTax() {
    if (this.has_next === true) {
      this.currentpage = this.presentpage - 1
      this.getTax(this.presentpage - 1)
    }

  }
  taxCancel() {
    this.taxReset();
    this.isTaxForm = false;
    this.ismakerCheckerButton = true;
    this.isTax = true
  }

  taxSubmit() {
    this.taxReset();
    this.isTaxForm = false;
    this.ismakerCheckerButton = true;
    this.isTax = true
  }

  getTaxRate(page) {
    this.spinner.show();
    let name:any;
    let code:any;
    let status:any;
    if(this.taxratetform.get('name').value ==undefined ||this.taxratetform.get('name').value ==null || this.taxratetform.get('name').value ==''){
      name='';
    }else{
      name=this.taxratetform.get('name').value;
    }
    if(this.taxratetform.get('code').value ==undefined ||this.taxratetform.get('code').value ==null || this.taxratetform.get('code').value ==''){
      code='';
    }else{
      code=this.taxratetform.get('code').value;
    }
    if(this.taxratetform.get('activeinactive').value ==undefined || this.taxratetform.get('activeinactive').value ==null || this.taxratetform.get('activeinactive').value ==''){
      status='';
    }else{
      status=this.drpdwn[this.taxratetform.get('activeinactive').value]
    }
    this.atmaService.getTaxRatesummary(page,name,code,status).subscribe(result => {
      this.spinner.hide();
        this.getTaxRateList = result['data'];
        let dataPagination = result['pagination'];
        if (this.getTaxRateList.length >= 0) {
          this.taxrate_next = dataPagination.has_next;
          this.taxrate_previous = dataPagination.has_previous;
          this.txratepage = dataPagination.index;
        }
      })
  }
  nextClickTaxRate() {
    if (this.taxrate_next === true) {
      this.getTaxRate(this.txratepage + 1)
    } 
  }

  previousClickTaxRate() {
    if (this.taxrate_previous === true) {
      this.getTaxRate(this.txratepage - 1)
    }
  }

  taxRateCancel() {
    this.taxratereset();
    this.isTaxRateForm = false;
    this.ismakerCheckerButton = true;
    this.isTaxRate = true
  }

  taxRateSubmit() {
    this.taxratereset();
    this.isTaxRateForm = false;
    this.ismakerCheckerButton = true;
    this.isTaxRate = true
  }


  getSubTax(page) {
    this.spinner.show();
    let name:any;
    let code:any;
    let status:any;
    if(this.subtform.get('name').value ==undefined ||this.subtform.get('name').value ==null || this.subtform.get('name').value ==''){
      name='';
    }else{
      name=this.subtform.get('name').value;
    }
    if(this.subtform.get('code').value ==undefined ||this.subtform.get('code').value ==null || this.subtform.get('code').value ==''){
      code='';
    }else{
      code=this.subtform.get('code').value;
    }
    if(this.subtform.get('activeinactive').value ==undefined || this.subtform.get('activeinactive').value ==null || this.subtform.get('activeinactive').value ==''){
      status='';
    }else{
      status=this.drpdwn[this.subtform.get('activeinactive').value]
    }
    this.atmaService.SubTaxsummary(page,name,code,status).subscribe(result => {
        this.spinner.hide();
        this.getSubTaxList = result['data'];
        let dataPagination = result['pagination'];
        if (this.getSubTaxList.length >= 0) {
          this.subtax_next = dataPagination.has_next;
          this.subtax_previous = dataPagination.has_previous;
          this.testp = dataPagination.index;
        }
      })
  }
  nextClickSubTax() {
    if (this.subtax_next === true) {
      this.getSubTax(this.testp + 1)
    }
    
  }

  previousClickSubTax() {
    if (this.subtax_previous === true) {
      this.getSubTax(this.testp - 1)
    }    
  }
  subTaxCancel() {
    this.subtaxreset()
    this.isSubTaxForm = false;
    this.ismakerCheckerButton = true;
    this.isSubTax = true
  }

  subTaxSubmit() {
    this.subtaxreset()
    this.isSubTax = true;
    this.ismakerCheckerButton = true;
    this.isSubTaxForm = false
  }


  getBank(page,) {
    this.spinner.show()
    let name:any;
    let code:any;
    let status:any;
    if(this.bform.get('name').value == undefined || this.bform.get('name').value ==null || this.bform.get('name').value ==''){
      name='';
    }else{
     name=this.bform.get('name').value;
    }
    if(this.bform.get('code').value == undefined || this.bform.get('code').value == null ||this.bform.get('code').value ==''){
      code=''
    }else{
      code=this.bform.get('code').value;
    }
    if(this.bform.get('activeinactive').value == undefined || this.bform.get('activeinactive').value ==null || this.bform.get('activeinactive').value==''){
      status='';
    }else{
      status=this.drpdwn[this.bform.get('activeinactive').value]
    }
    this.atmaService.getBankList(page,name,code,status).subscribe((results: any[]) => {
        this.spinner.hide()
        let datas = results["data"];
        this.getBankList = datas;
        let datapagination = results["pagination"];
        this.getBankList = datas;
        if (this.getBankList.length >= 0) {
          this.bank_next = datapagination.has_next;
          this.bank_previous = datapagination.has_previous;
          this.bankpage = datapagination.index;
          this.isBankPagination = true;
        } if (this.getBankList <= 0) {
          this.isBankPagination = false;
        }
      })
  }
  bank_nextClick() {
    if (this.bank_next === true) {
      this.getBank(this.bankpage + 1)
    }
  }

  bank_previousClick() {
    if (this.bank_previous === true) {
      // this.currentpage= this.presentpage - 1
      this.getBank(this.bankpage - 1)
    }
  }

  bankCancel() {
    this.getBank(1);
    this.isBankForm = false;
    this.ismakerCheckerButton = true;
    this.isBank = true
  }

  bankSubmit() {
    this.getBank(1);
    this.isBank = true;
    this.ismakerCheckerButton = true;
    this.isBankForm = false
  }

  getPaymode(page) {
    this.spinner.show();
    let name:any;
    let code:any;
    if(this.pform.get('name').value == undefined ||this.pform.get('name').value == null || this.pform.get('name').value ==''){
      name='';
    }else{
      name=this.pform.get('name').value;
    }
    if(this.pform.get('code').value ==undefined || this.pform.get('code').value == null ||this.pform.get('code').value ==''){
      code='';
    }else{
      code=this.pform.get('code').value;
    }
    this.atmaService.getPaymodesummary(page,name,code).subscribe((results: any[]) => {
        this.spinner.hide();
        let datas = results["data"];
        this.getPaymodeList = datas;
        let datapagination = results["pagination"];
        this.getPaymodeList = datas;
        if (this.getPaymodeList.length >= 0) {
          this.paymode_next = datapagination.has_next;
          this.paymode_previous = datapagination.has_previous;
          this.paymodepage = datapagination.index;
          this.isPaymodePagination = true;
        }
        if (this.getPaymodeList <= 0) {
          this.isPaymodePagination = false;
        }
      })
  }
  paymode_nextClick() {
    if (this.paymode_next === true) {

      this.getPaymode(this.paymodepage + 1)
    }
  }

  paymode_previousClick() {
    if (this.paymode_previous === true) {

      this.getPaymode(this.paymodepage - 1)
    }
  }
  resetpaymode(){
    this.pform.reset('');
    this.getPaymode(1);
    }
 
  prformreset(){
    this.prform.reset('');
    this.getproductlist(1)
  }
  prsearch() {
    // this.spinner.show();
    this.atmaService.getproductsearch(this.prform.value.name?this.prform.value.name:'',this.prform.value.code?this.prform.value.code:'',1)
      .subscribe((results: any[]) => {
        // this.spinner.hide();
        let datapagination = results["pagination"];
        this.productlist = results["data"];
        if (this.productlist.length >= 0) {
          this.has_nextpro = datapagination.has_next;
          this.has_previouspro = datapagination.has_previous;
          this.presentpagepro = datapagination.index;
        }
      })

  }
   inputprsearch() {
    // this.spinner.show();
    this.atmaService.getproductsearch(this.inputproducts.nativeElement.value,this.prform.value.code?this.prform.value.code:'',1)
      .subscribe((results: any[]) => {
        // this.spinner.hide();
        let datapagination = results["pagination"];
        this.productlist = results["data"];
        if (this.productlist.length >= 0) {
          this.has_nextpro = datapagination.has_next;
          this.has_previouspro = datapagination.has_previous;
          this.presentpagepro = datapagination.index;
        }
      })

  }
  parentinputrsearch() {
    // this.spinner.show();
    this.atmaService.getproductsearch(this.parentproduct.nativeElement.value,this.prform.value.code?this.prform.value.code:'',1)
      .subscribe((results: any[]) => {
        // this.spinner.hide();
        let datapagination = results["pagination"];
        this.productlist = results["data"];
        if (this.productlist.length >= 0) {
          this.has_nextpro = datapagination.has_next;
          this.has_previouspro = datapagination.has_previous;
          this.presentpagepro = datapagination.index;
        }
      })

  }
   childinputrsearch() {
    // this.spinner.show();
    this.atmaService.getproductsearch(this.childproduct.nativeElement.value,this.prform.value.code?this.prform.value.code:'',1)
      .subscribe((results: any[]) => {
        // this.spinner.hide();
        let datapagination = results["pagination"];
        this.productlist = results["data"];
        if (this.productlist.length >= 0) {
          this.has_nextpro = datapagination.has_next;
          this.has_previouspro = datapagination.has_previous;
          this.presentpagepro = datapagination.index;
        }
      })

  }
   childinputsrsearch() {
    // this.spinner.show();
    this.atmaService.getproductsearch(this.childproducts.nativeElement.value,this.prform.value.code?this.prform.value.code:'',1)
      .subscribe((results: any[]) => {
        // this.spinner.hide();
        let datapagination = results["pagination"];
        this.productlist = results["data"];
        if (this.productlist.length >= 0) {
          this.has_nextpro = datapagination.has_next;
          this.has_previouspro = datapagination.has_previous;
          this.presentpagepro = datapagination.index;
        }
      })

  }
  prodactivelist(page=1,pagesize=10){
    this.atmaService.getprodactivelist(page, pagesize).subscribe((results: any[]) => {
      this.spinner.hide();
      let datapagination = results["pagination"];
      this.productlist = results["data"];
      if (this.productlist.length >= 0) {
        this.hsn_nextpro = datapagination.has_next;
        this.hsn_previouspro = datapagination.has_previous;
        this.hsnpresentpagepro = datapagination.index;
      }
    })

  }
  prodInactivelist(page=1,pagesize=10){
    this.atmaService.getprodInactivelist(page, pagesize).subscribe((results: any[]) => {
      this.spinner.hide();
      let datapagination = results["pagination"];
      this.productlist = results["data"];
      if (this.productlist.length >= 0) {
        this.hsn_nextpro = datapagination.has_next;
        this.hsn_previouspro = datapagination.has_previous;
        this.hsnpresentpagepro = datapagination.index;
      }
    })
  }
  csearch() {
    this.spinner.show();
    this.atmaService.customercategory_searchfilter(this.cform.value.name?this.cform.value.name:'',this.cform.value.code?this.cform.value.code:'')
      .subscribe((results: any[]) => {
        this.spinner.hide();
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.CustomerCategoryList = datas;
        if (this.CustomerCategoryList.length >= 0) {

          this.has_nextcuscat = datapagination.has_next;
          this.has_previouscuscat = datapagination.has_previous;
          this.presentpagecuscat = datapagination.index;
        }

      })
  }

  ccreset(){
    this.cform.reset('');
    this.getCustomerCategory();
  }
  bbreset(){
    this.bbform.reset('');
    this.getBankbranch(1);

  }
  uomreset(){
    this.uform.reset('');
    this.getUom(1);

  }

  
  
  resetprodcat(){
    this.pcform.reset('');
    this.getProductCategory(1);

  }
  
  
  hsnreset(){
    this.hsnform.reset('');
    this.gethsnlist(1);
  }
 

  resetprodtype(){
    this.protypeform.reset('');
    this.getProductType(1);
  }
  apcategorysearch() {
    this.atmaService.apcategory_searchfilter(this.apcategoryform.value.name)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.getApCategoryList = datas;
        if (this.getApCategoryList.length >= 0) {
          this.has_nextapcat = datapagination.has_next;
          this.has_previousapcat = datapagination.has_previous;
          this.presentpageapcat = datapagination.index;
        }

      })

  }

  paymodeCancel() {
    this.resetpaymode();
    this.isPaymodeForm = false;
    this.ismakerCheckerButton = true;
    this.isPaymode = true
  }

  paymodeSubmit() {
    this.resetpaymode();
    this.isPaymode = true;
    this.ismakerCheckerButton = true;
    this.isPaymodeForm = false
  }

  getBankbranch(page) {
    this.spinner.show();
    let name:any;
    let code:any;
    if(this.bbform.get('name').value == undefined || this.bbform.get('name').value== null || this.bbform.get('name').value==''){
      name ='';
    }else{
      name=this.bbform.get('name').value;
    }
    if(this.bbform.get('code').value == undefined||this.bbform.get('code').value==null || this.bbform.get('code').value== ''){
      code=''
    }else{
     code=this.bbform.get('code').value;
    }
    this.atmaService.getBankbranchList(page,name,code).subscribe((results: any[]) => {
      this.spinner.hide()
        let datas = results["data"];
        this.getBankbranchList = datas;
        let datapagination = results["pagination"];
        this.getBankbranchList = datas;
        if (this.getBankbranchList.length >= 0) {
          this.branch_next = datapagination.has_next;
          this.branch_previous = datapagination.has_previous;
          this.branchbank = datapagination.index;
          this.isBankBranchPagination = true;
        } if (this.getBankbranchList <= 0) {
          this.isBankBranchPagination = false;
        }
      })
  }
  bankbranch_nextClick() {
    if (this.branch_next === true) {

      this.getBankbranch(this.branchbank + 1)
    }
  }

  bankbranch_previousClick() {
    if (this.branch_previous === true) {

      this.getBankbranch(this.branchbank - 1)
    }
  }
   getProductType(page) {
    this.spinner.show();
    let name:any;
    let code:any;
    if(this.protypeform.get('name').value == undefined ||this.protypeform.get('name').value == '' || this.protypeform.get('name').value == null){
      name='';
    }else{
      name=this.protypeform.get('name').value;
    }
    if(this.protypeform.get('code').value == undefined || this.protypeform.get('code').value == null || this.protypeform.get('code').value ==''){
      code='';
    }else{
      code=this.protypeform.get('code').value;
    }
    this.atmaService.ProductTypesummary(page,name,code).subscribe((results: any[]) => {
      this.spinner.hide();
        let datas = results["data"];
        this.getProductTypeList = datas;
        let datapagination = results["pagination"];
        this.getProductTypeList = datas;
        if (this.getProductTypeList.length >= 0) {
          this.has_nextprotype = datapagination.has_next;
          this.has_previousprotype = datapagination.has_previous;
          this.presentpageprotype = datapagination.index;

        }


      })


  }
  nextClickproducttype() {
    if (this.has_next === true) {


      this.getProductType(this.presentpageprotype + 1)


    }
  }

  previousClickproducttype() {
    if (this.has_previous === true) {

      this.getProductType(this.presentpageprotype - 1)
    }
  }

  private getApCategory(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
    this.atmaService.getApCategory(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.getApCategoryList = datas;
        let datapagination = results["pagination"];
        this.getApCategoryList = datas;
        if (this.getApCategoryList.length >= 0) {

          this.has_nextapcat = datapagination.has_next;
          this.has_previousapcat = datapagination.has_previous;
          this.presentpageapcat = datapagination.index;
        }
        // if(this.has_next==true){
        //   this.has_next=true;
        // }
        // if(this.has_previous==true){
        //   this.has_previous=true;

        // }
      })
  }
  nextClickapcategory() {
    if (this.has_nextapcat === true) {

      this.getApCategory("", 'asc', this.presentpageapcat + 1, 10)
    }
  }

  previousClickapcategory() {
    if (this.has_previousapcat === true) {

      this.getApCategory("", 'asc', this.presentpageapcat - 1, 10)

    }
  }



  bankBranchCancel() {
    this.getBankbranch(1);
    this.isBankbranchForm = false;
    this.ismakerCheckerButton = true;
    this.isBankbranch = true
  }

  bankBranchSubmit() {
    this.getBankbranch(1);
    this.isBankbranch = true;
    this.ismakerCheckerButton = true;
    this.isBankbranchForm = false
  }


  taxEditCancel() {
    this.taxReset();
    this.isTaxEditForm = false;
    this.ismakerCheckerButton = true;
    this.isTax = true;
  }

  taxEditSubmit() {
    this.taxReset();
    this.isTaxEditForm = false;
    this.ismakerCheckerButton = true;
    this.isTax = true;
  }

  subTaxEditCancel() {
    this.subtaxreset()
    this.isSubTaxEditForm = false;
    this.ismakerCheckerButton = true;
    this.isSubTax = true;
  }


  subTaxeditSubmit() {
    this.subtaxreset()
    this.isSubTaxEditForm = false;
    this.ismakerCheckerButton = true;
    this.isSubTax = true;
  }
  taxRateEditCancel() {
    this.taxratereset();
    this.isTaxRateEditForm = false;
    this.ismakerCheckerButton = true;
    this.isTaxRate = true;
  }
  taxRateEditSubmit() {
    this.presentpage = 1;
    this.taxratereset();
    this.isTaxRateEditForm = false;
    this.ismakerCheckerButton = true;
    this.isTaxRate = true;
  }
  bankEditCancel() {
    this.bform.reset('')
    this.getBank(1);
    this.isBankEditForm = false;
    this.ismakerCheckerButton = true;
    this.isBank = true;
  }
  bankEditSubmit() {
    this.bform.reset('')
    this.getBank(1);
    this.isBankEditForm = false;
    this.ismakerCheckerButton = true;
    this.isBank = true;
  }
  paymodeEditCancel() {
    this.resetpaymode();
    this.isPaymodeEditForm = false;
    this.ismakerCheckerButton = true;
    this.isPaymode = true;
  }
  paymodeEditSubmit() {
    this.resetpaymode();
    this.isPaymodeEditForm = false;
    this.ismakerCheckerButton = true;
    this.isPaymode = true;
  }
  bankBranchEditCancel() {
    this.bbform.reset('');
    this.getBankbranch(1);
    this.isBankbranchEditForm = false;
    this.ismakerCheckerButton = true;
    this.isBankbranch = true;
  }
  bankbranchEditSubmit() {
    this.bbform.reset('');
    this.getBankbranch(1);
    this.isBankbranchEditForm = false;
    this.ismakerCheckerButton = true;
    this.isBankbranch = true;
  }
  producttypeCancel() {
    this.resetprodtype();
    this.isProductTypeForm = false;
    this.ismakerCheckerButton = true;
    this.isProductType = true
  }

  producttypeSubmit() {
    this.resetprodtype();
    this.isProductTypeForm = false;
    this.ismakerCheckerButton = true;
    this.isProductType = true
  }

  producttypeEditCancel() {
    this.resetprodtype();
    this.isProductTypeEditForm = false;
    this.ismakerCheckerButton = true;
    this.isProductType = true
  }

  producttypeEditSubmit() {
    this.resetprodtype();
    this.isProductTypeEditForm = false;
    this.ismakerCheckerButton = true;
    this.isProductType = true
  }

  apCategoryCancel() {
    this.getApCategory();
    this.isApCategoryForm = false;
    this.ismakerCheckerButton = true;
    this.isApCategory = true
  }

  apCategorySubmit() {
    this.getApCategory();
    this.isApCategoryForm = false;
    this.ismakerCheckerButton = true;
    this.isApCategory = true
  }

  apcategoryEditCancel() {
    this.getapcategorynew(1)
    this.resetapcat();
    this.isApCategoryEditForm = false;
    this.ismakerCheckerButton = true;
    this.isApCategory = true;
  }
  apcategoryEditSubmit() {
    this.getapcategorynew(1)
    this.resetapcat();
    this.isApCategoryEditForm = false;
    this.ismakerCheckerButton = true;
    this.isApCategory = true;
  }

  apCategoryEdit(data) {
    this.isApCategoryEditForm = true;
    this.isApCategory = false;
    this.ismakerCheckerButton = false;
    this.sharedService.apCategoryEdit.next(data)
    
    return data;
  }
  apsubcategoryEditCancel() {
    this.resetapsubcat();
    this.isApSubCategoryEditForm = false;
    this.ismakerCheckerButton = true;
    this.isApSubCategory = true;
  }
  apsubcategoryEditSubmit() {
    this.resetapsubcat();
    this.isApSubCategoryEditForm = false;
    this.ismakerCheckerButton = true;
    this.isApSubCategory = true;
  }


 subtaxactiveinactive(data){
  let fdata: any = { 'status': data.status };
  this.spinner.show();
  this.atmaService.subtaxactiveinactive(data.id, fdata).subscribe(data => {
    this.spinner.hide();
    this.notification.showSuccess(data['message']);
    this.subtaxreset()
  },
    (error) => {
      this.notification.showError(error.status + error.statusText);
    }
  );
 }

  subTaxEdit(data) {
    this.isSubTaxEditForm = true;
    this.isSubTax = false;
    this.ismakerCheckerButton = false;
    this.sharedService.subTaxEdit.next(data)
    return data;
  }
  taxEdit(data) {
    this.isTaxEditForm = true;
    this.isTax = false;
    this.ismakerCheckerButton = false;
    this.sharedService.taxEdit.next(data)
    return data;
  }
  taxRateactiveInactive(data){
    let dta: any = { 'id': data.id, 'status': data.status };
    // let fdata: any = { 'status': data.status };
  this.spinner.show();
  this.atmaService.getactiveinactivetax(dta).subscribe(data => {
    this.spinner.hide();
    this.notification.showSuccess(data['message']);
    this.taxratereset();
  },
    (error) => {
      this.notification.showError(error.status + error.statusText);
    }
  );

  }
  taxRateEdit(data) {
    this.isTaxRateEditForm = true;
    this.isTaxRate = false;
    this.ismakerCheckerButton = false;
    this.sharedService.taxRateEdit.next(data)
    return data;
  }
  bankEdit(data) {
    this.isBankEditForm = true;
    this.isBank = false;
    this.ismakerCheckerButton = false;
    this.sharedService.bankEditValue.next(data)
    return data;
  }
  paymodeEdit(data) {
    this.isPaymodeEditForm = true;
    this.isPaymode = false;
    this.ismakerCheckerButton = false;
    this.sharedService.paymodeEditValue.next(data)
    return data;
  }
  bankbranchEdit(data) {
    this.isBankbranchEditForm = true;
    this.isBankbranch = false;
    this.ismakerCheckerButton = false;
    this.sharedService.bankBranchEditValue.next(data)
    return data;
  }
  riskedit(data ){
    this.riskform.patchValue({
      "name":data.risk_name
    })
this.riskeditid=data.id
this.isupdate=true

  }
  riskDelete(data){
    this.atmaService.riskDelete(data.id)
    .subscribe((results) => {
      if(results.message == 'Successfully Deleted'){
        this.notification.showSuccess('Successfully Deleted')
        this.getriskcat()
      }
      else{
        this.notification.showError('Something WentWrong')
        return false
      }
    })
  
}
  producttypeEdit(data) {
    this.isProductTypeEditForm = true;
    this.isProductType = false;
    this.ismakerCheckerButton = false;
    this.sharedService.productTypeEdit.next(data)
    return data;
  }
  getproductactive(data) {
    let fdata: any = { 'status': data.status };
    this.spinner.show();
    this.atmaService.productactiveinactive(data.id, fdata).subscribe(data => {
      this.spinner.hide();
      this.notification.showSuccess(data['message']);
      this.prformreset();
    },
      (error) => {
        this.notification.showError(error.status + error.statusText);
      }
    );

  }
  // apCategoryEdit(data) {
  //   this.isApCategoryEditForm = true;
  //   this.isApCategory = false;
  //   this.ismakerCheckerButton = false;
  //   this.sharedService.apCategoryEdit.next(data)
  //   return data;
  // }


  getUom(page) {
    this.spinner.show();
    let name:any;
    let code:any;
    if(this.uform.get('name').value== undefined ||this.uform.get('name').value== null || this.uform.get('name').value== ''){
      name='';
    }else{
      name=this.uform.get('name').value;
    }
    if(this.uform.get('code').value == undefined || this.uform.get('code').value == null ||this.uform.get('code').value == ''){
      code='';
    }else{
      code=this.uform.get('code').value;
    }
    this.atmaService.getUomsummary(page,name,code).subscribe((results: any[]) => {
        this.spinner.hide();
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.UomList = datas;
        if (this.UomList.length >= 0) {
          this.uom_next = datapagination.has_next;
          this.uom_previous = datapagination.has_previous;
          this.uompage = datapagination.index;
        }
      })
  }

  uom_nextClick() {
    if (this.uom_next === true) {
      this.getUom(this.uompage + 1)
    }
  }

  uom_previousClick() {
    if (this.uom_previous === true) {
      this.getUom(this.uompage - 1)
    }
  }
  uomEdit(data) {
    this.isUomEditForm = true;
    this.isUom = false;
    this.ismakerCheckerButton = false;
    this.sharedService.uomEdit.next(data)
    return data;
  }
  uomSubmit() {
    this.uomreset();
    this.isUomForm = false;
    this.ismakerCheckerButton = true;
    this.isUom = true;
  }
  uomCancel() {
    this.uomreset();
    this.ismakerCheckerButton = true;
    this.isUom = true;
    this.isUomForm = false;
  }
  uomEditSubmit() {
    this.uomreset();
    this.ismakerCheckerButton = true;
    this.isUom = true;
    this.isUomEditForm = false;
  }
  uomEditCancel() {
    this.uomreset();
    this.ismakerCheckerButton = true;
    this.isUom = true;
    this.isUomEditForm = false;
  }



  getCustomerCategory(pageNumber = 1) {
    this.atmaService.getCustomerCategory(pageNumber)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.CustomerCategoryList = datas;
        if (this.CustomerCategoryList.length >= 0) {

          this.has_nextcuscat = datapagination.has_next;
          this.has_previouscuscat = datapagination.has_previous;
          this.presentpagecuscat = datapagination.index;
        }
      })

  }
  customerCategoryEdit(data) {
    this.isCustomerCategoryEditForm = true;
    this.isCustomerCategory = false;
    this.ismakerCheckerButton = false;
    this.sharedService.customerCategoryEdit.next(data)
    return data;
  }



  cuscatnext_Click() {
    if (this.has_next === true) {


      this.getCustomerCategory(this.presentpagecuscat + 1)

    }
  }

  cuscatprevious_Click() {
    if (this.has_previous === true) {

      this.getCustomerCategory(this.presentpagecuscat - 1)

    }
  }
  customerCategorySubmit() {
    this.getCustomerCategory()
    this.ismakerCheckerButton = true;
    this.isCustomerCategory = true;
    this.isCustomerCategoryForm = false;
  }
  customerCategoryCancel() {
    this.ismakerCheckerButton = true;
    this.isCustomerCategory = true;
    this.isCustomerCategoryForm = false;
  }
  customerCategoryEditSubmit() {
    this.getCustomerCategory()
    this.isCustomerCategoryEditForm = false;
    this.ismakerCheckerButton = true;
    this.isCustomerCategory = true;
  }
  customerCategoryEditCancel() {
    this.ismakerCheckerButton = true;
    this.isCustomerCategory = true;
    this.isCustomerCategoryEditForm = false;
  }

  getProductCategory(page) {
    this.spinner.show();
    let name:any;
    let code:any;
    if(this.pcform.get('name').value == undefined || this.pcform.get('name').value == null || this.pcform.get('name').value == ''){
      name='';
    }else{
      name=this.pcform.get('name').value;
    }
    if(this.pcform.get('code').value == undefined || this.pcform.get('code').value == null || this.pcform.get('code').value == ''){
      code='';
    }else{
      code=this.pcform.get('code').value;
    }
    this.atmaService.ProductCategorysummary(page,name,code).subscribe((results: any[]) => {
        this.spinner.hide();
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.ProductCategoryList = datas;
        if (this.ProductCategoryList.length >= 0) {
          this.has_nextprocat = datapagination.has_next;
          this.has_previousprocat = datapagination.has_previous;
          this.presentpageprocat = datapagination.index;

        }
      })

  }


  procatnextClick_() {
    if (this.has_next === true) {

      this.getProductCategory(this.presentpageprocat + 1)

    }
  }

  procatpreviousClick_() {
    if (this.has_previous === true) {


      this.getProductCategory(this.presentpageprocat - 1)

    }
  }

  ProductCategoryEdit(data) {
    this.isProductCategoryEditForm = true;
    this.isProductCategory = false;
    this.ismakerCheckerButton = false;
    this.sharedService.productCategoryEdit.next(data)
    return data;
  }
  ProductCategorySubmit() {
    this.resetprodcat()
    this.ismakerCheckerButton = true;
    this.isProductCategory = true;
    this.isProductCategoryForm = false;
  }
  ProductCategoryCancel() {
    this.resetprodcat()
    this.ismakerCheckerButton = true;
    this.isProductCategory = true;
    this.isProductCategoryForm = false;
  }
  ProductCategoryEditSubmit() {
    this.resetprodcat()
    this.isProductCategoryEditForm = false;
    this.ismakerCheckerButton = true;
    this.isProductCategory = true;
  }
  ProductCategoryEditCancel() {
    this.resetprodcat()
    this.ismakerCheckerButton = true;
    this.isProductCategory = true;
    this.isProductCategoryEditForm = false;
  }


  docGrpCancle() {
    this.isDocGrpForm = false;
    this.ismakerCheckerButton = true;
    this.isDocGrp = true
  }

  docGrpSubmit() {
    this.getdoclist();
    // Name validation pending
    this.notification.showSuccess("Saved Successfully....")
    this.isDocGrp = true;
    this.ismakerCheckerButton = true;
    this.isDocGrpForm = false
  }

  docgrpedit(data) {
    this.isDocGrpEditForm = true;
    this.isDocGrp = false;
    this.ismakerCheckerButton = false;
    this.sharedService.docgrpedit.next(data)
    return data;
  }
  docGrpEditCancle() {
    this.isDocGrpEditForm = false;
    this.ismakerCheckerButton = true;
    this.isDocGrp = true;
  }


  docGrpEditSubmit() {
    this.getdoclist();

    this.notification.showSuccess("Updated Successfully....")
    this.isDocGrp = true;
    this.ismakerCheckerButton = true;
    this.isDocGrpEditForm = false
  }
  getdoclist() {
    this.atmaService.getdoc()
      .subscribe(result => {
        this.docgrplist = result["data"];
      })
  }
  deletedocgrp(data) {
    let value = data.id
    this.atmaService.docgrpDeleteForm(value)

      .subscribe(result => {
        this.notification.showSuccess("Successfully deleted....")
        this.ngOnInit();
        return true

      })
  }
  getdocgrppage(pageNumber = 1, pageSize = 10) {
    this.atmaService.getdocgrppage(pageNumber, pageSize)
      .subscribe(result => {
        console.log("docpage", result)
        let datas = result['data'];
        this.docgrplist = datas;
        let datapagination = result["pagination"];
        this.docgrplist = datas;
        if (this.docgrplist.length >= 0) {
          this.has_nextdoc = datapagination.has_next;
          this.has_previousdoc = datapagination.has_previous;
          this.presentpageDoc = datapagination.index;
          this.isDocpagination = true;
        } if (this.docgrplist <= 0) {
          this.isDocpagination = false;
        }
      })
  }
  nextClick() {
    if (this.has_nextdoc === true) {

      this.getdocgrppage(this.presentpageDoc + 1, 10)
    }
  }
  previousClick() {
    if (this.has_previousdoc === true) {

      this.getdocgrppage(this.presentpageDoc - 1, 10)
    }
  }

  getproductlist(page) {
    this.spinner.show();
    let name:any;
    let code:any;
    let status:any;
    if(this.prform.get('name').value == undefined || this.prform.get('name').value == null || this.prform.get('name').value == ''){
      name='';
    }else{
      name=this.prform.get('name').value
    }
    if(this.prform.get('code').value == undefined || this.prform.get('code').value == null || this.prform.get('code').value == ''){
      code='';
    }else{
      code=this.prform.get('code').value;
    }
    if(this.prform.get('activeinactive').value == undefined || this.prform.get('activeinactive').value == null || this.prform.get('activeinactive').value == ''){
      status='';
    }else{
      status=this.drpdwn[this.prform.get('activeinactive').value]
    }

    this.atmaService.Productmastersummary(page,name,code,status).subscribe(result => {
        this.spinner.hide();
        this.productlist = result["data"];
        let dataPagination=result["pagination"]
        if(this.productlist.length>=0){
          this.has_nextpro=dataPagination.has_next;
          this.has_previouspro=dataPagination.has_previous;
          this.presentpagepro=dataPagination.index
        }
        this.productlist.forEach((s => {
          let tes = s.unitprice;
        }))
      })
  }

  gethsnlist(page) {
    this.spinner.show();
    let code:any;
    let status:any;
    if(this.hsnform.get('hsncode').value ==undefined ||this.hsnform.get('hsncode').value ==null ||this.hsnform.get('hsncode').value =='' ){
      code='';
    }else{
      code=this.hsnform.get('hsncode').value;
    }
    if(this.hsnform.get('activeinactive').value ==undefined ||this.hsnform.get('activeinactive').value == null || this.hsnform.get('activeinactive').value =='' ){
      status='';
    }else{
      status=this.drpdwn[this.hsnform.get('activeinactive').value]
    }
    this.atmaService.gethsnsummary(page,code,status).subscribe((results: any[]) => {
        this.spinner.hide();
        let hsnpagedata = results["pagination"];
        this.hsnlist = results["data"];;
        if (this.hsnlist.length >= 0) {
          this.hsn_nextpro = hsnpagedata.has_next;
          this.hsn_previouspro = hsnpagedata.has_previous;
          this.hsnpresentpagepro = hsnpagedata.index;
        }
      })
  }

  hsnprevious() {
    if (this.hsn_previouspro === true) {
      this.gethsnlist(this.hsnpresentpagepro - 1)
    } 
  }
  hsnnext() {
      if (this.hsn_nextpro === true) {
        this.gethsnlist(this.hsnpresentpagepro + 1)
      
    }

  }
  productedit(data) {
    this.isProductEditForm = true;
    this.isproduct = false;
    this.ismakerCheckerButton = false;
    this.sharedService.productedit.next(data)
    return data;
  }
  ProductCancle() {
    this.isProductForm = false;
    this.ismakerCheckerButton = true;
    this.isproduct = true
    this.createprod();

  }
  ProductSubmit() {
    this.prformreset();
    // this.notification.showSuccess("Saved Successfully")
    this.isproduct = true;
    this.createprod();
    this.ismakerCheckerButton = true;
    this.isProductForm = false
  }
  ProductEditSubmit() {
    this.prformreset();
    // this.notification.showSuccess("Updated Successfully")
    this.isProductEditForm = false;
    this.ismakerCheckerButton = true;
    this.isproduct = true;
  }
  ProductEditCancle() {
    this.isProductEditForm = false;
    this.ismakerCheckerButton = true;
    this.isproduct = true;
  }
  getproductpage(pageNumber = 1, pageSize = 10) {
    this.spinner.show();
    this.atmaService.getproductpage(pageNumber, pageSize, this.prform.value.name)
      .subscribe((results: any[]) => {
        this.spinner.hide();
        let datapagination = results["pagination"];
        this.productlist = results["data"];;
        if (this.productlist.length >= 0) {
          this.has_nextpro = datapagination.has_next;
          this.has_previouspro = datapagination.has_previous;
          this.presentpagepro = datapagination.index;
        }
      })
  }
  previousClickpro(){
    if (this.has_previouspro === true) {
        this.getproductlist(this.presentpagepro - 1)
    }
  }
  nextClickpro(){
    if (this.has_nextpro === true) {
       this.getproductlist(this.presentpagepro + 1)
     }

  }

  // previousClickpro() {
  //   if(this.prform.value.activeinactive===0){
  //     if (this.has_previouspro === true) {

  //       this.prodactivelist(this.presentpagepro - 1, 10)
  //     }
  //   }
  //   else if(this.prform.value.activeinactive===1){
  //     if (this.has_previouspro === true) {

  //       this.prodInactivelist(this.presentpagepro - 1, 10)
  //     }
  //   }
  //   else{
  //     if (this.has_previouspro === true) {

  //       this.getproductpage(this.presentpagepro - 1, 10)
  //     }
  //   }
    
  // }
  // nextClickpro() {
  //   if(this.prform.value.activeinactive ===0){
  //     if (this.has_nextpro === true) {

  //       this.prodactivelist(this.presentpagepro + 1, 10)
  //     }
  //   }
  //   else if(this.prform.value.activeinactive===1){
  //     if (this.has_nextpro === true) {

  //       this.prodInactivelist(this.presentpagepro + 1, 10)
  //     }
  //   }
  //   else{
  //     if (this.has_nextpro === true) {

  //       this.getproductpage(this.presentpagepro + 1, 10)
  //     }
  //   }

  // }
  deleteproduct(data) {
    let value = data.id
    this.atmaService.productDeleteForm(value)


      .subscribe(result => {
        this.notification.showSuccess("Successfully deleted....")
        this.ngOnInit();
        return true



      })
  }

  apSubCategoryCancel() {
    this.isApSubCategoryForm = false;
    this.ismakerCheckerButton = true;
    this.isApSubCategory = true
  }

  apSubCategorySubmit() {
    this.getApSubCategory();
    this.isApSubCategoryForm = false;
    this.ismakerCheckerButton = true;
    this.isApSubCategory = true
  }









  apSubCategoryEdit(data) {
    this.isApSubCategoryEditForm = true;
    this.isApSubCategory = false;
    this.ismakerCheckerButton = false;
    this.sharedService.apSubCategoryEdit.next(data)
    return data;
  }


  getApSubCategory(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
    this.atmaService.getApSubCategory(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        console.log("datta", datas)
        this.getApSubCategoryList = datas;
        let datapagination = results["pagination"];
        this.getApSubCategoryList = datas;
        // if (this.getApSubCategoryList.length===0) {
        //   this.isApSubCategorypage=false
        // }
        if (this.getApSubCategoryList.length > 0) {

          this.has_nextapsub = datapagination.has_next;
          this.has_previousapsub = datapagination.has_previous;
          this.presentpageapsub = datapagination.index;

          //this.isApSubCategorypage=true

        }




      })
  }

  apcsearch() {
    this.atmaService.getProducts(this.apcform.value.name)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        // console.log("datta",datas)
        this.getApSubCategoryList = datas;
        let datapagination = results["pagination"];
        this.getApSubCategoryList = datas;
        if (this.getApSubCategoryList.length > 0) {

          this.has_nextapsub = datapagination.has_next;
          this.has_previousapsub = datapagination.has_previous;
          this.presentpageapsub = datapagination.index;

          //this.isApSubCategorypage=true

        }
      })
  }

  nextClickapsubcategory() {
    if (this.has_nextapsub === true) {


      this.getApSubCategory("", 'asc', this.presentpageapsub + 1, 10)

    }
  }

  previousClickapsubcategory() {
    if (this.has_previousapsub === true) {

      this.getApSubCategory("", 'asc', this.presentpageapsub - 1, 10)

    }
  }




  ///////////////////////////// Ap cat updated code 
  editapcat: FormGroup;
  // apcatSearchForm: FormGroup;
  apsubcatSearchForm: FormGroup;
  editapsubcat: FormGroup;

  isApcategory: boolean;
  isApcategoryForm: boolean;
  isApsubcategory: boolean;
  isApsubcategoryForm: boolean;

  editApcatPopup: boolean;
  editApsubcatPopup: boolean;

  presentpageapsubcat: number = 1;
  has_nextapsubcat = true;
  has_previousapsubcat = true;

  apCategoryList: any;
  apSubCategoryList: any;

  apcatapproverlist:any;
  apsubcatapproverlist:any;


  has_nextapcatapp:boolean=false;
  has_previousapcatapp:boolean=false;
  presentpageapcatapp: number = 1;

  has_nextapsubcatapp:boolean=false;
  has_previousapsubcatapp:boolean=false;
  presentpageapsubcatapp: number = 1;

  categoryList: Array<catlistss>;
  category_id = new FormControl();

  name: string
  no: string
  code: string

  @ViewChild('cat') matcatAutocomplete: MatAutocomplete;
  @ViewChild('catInput') catInput: any;

  ActiveInactive = [
    { value: 0, display: 'Active' },
    { value: 1, display: 'Inactive' },
    { value: 0, display: 'All' }
  ]
  drpdwn: any = { 'ACTIVE': 1, 'INACTIVE': 0, 'ALL': 2 };

  assetlist = [{ 'id': '1', 'name': '1', 'show': 'Yes' },
  { 'id': '2', 'name': '0', 'show': 'No' }]
  gstblockedlist = [{ 'id': '1', 'show': 'Yes', 'name': '1' },
  { 'id': '2', 'show': 'No', 'name': '0' }]
  gstrcmlist = [{ 'id': '1', 'show': 'Yes', 'name': '1' },
  { 'id': '2', 'show': 'No', 'name': '0' }]
  statuslist = [{ 'id': '1', 'show': 'Active', 'name': 1 },
  { 'id': '2', 'show': 'Inactive', 'name': 0 }]

  getapcategorynew(page) {
    this.spinner.show();
    let no:any;
    let name:any;
    let status:any;
    if(this.apcatSearchForm.get('no').value== undefined ||this.apcatSearchForm.get('no').value ===''||this.apcatSearchForm.get('no').value=== null ){
      no='';
    }else{
      no=this.apcatSearchForm.get('no').value;
    }
    if(this.apcatSearchForm.get('name').value== undefined ||this.apcatSearchForm.get('name').value ===''||this.apcatSearchForm.get('name').value=== null ){
      name='';
    }else{
      name=this.apcatSearchForm.get('name').value;
    }
    if(this.apcatSearchForm.get('activeinactive').value === undefined || this.apcatSearchForm.get('activeinactive').value==''||this.apcatSearchForm.get('activeinactive').value===null){
      status='';
    }
    else{
      status=this.drpdwn[this.apcatSearchForm.get('activeinactive').value]

    }
    this.atmaService.getapcategory(page,name,no,status)
      .subscribe((results: any[]) => {
        this.spinner.hide();
        let datas = results["data"];
        console.log("getapcat", datas);
        let datapagination = results["pagination"];
        this.apCategoryList = datas;
        if (this.apCategoryList.length > 0) {
          this.has_nextapcat = datapagination.has_next;
          this.has_previousapcat = datapagination.has_previous;
          this.presentpageapcat = datapagination.index;
        }
      })

  }
  apstatus:number;
  nextClickapcat() {
    if (this.has_nextapcat === true) {
      this.getapcategorynew(this.presentpageapcat + 1);
    }
  
  }

  previousClickapcat() {
      if (this.has_previousapcat === true) {
        this.getapcategorynew(this.presentpageapcat - 1);
      }
  }
  apCategorySubmitnew() {
    this.resetapcat();
    this.getapcategorynew(1);
    this.ismakerCheckerButton = true;
    this.isApCategory = true;
    this.isApCategoryForm = false;
  }
  apCategoryCancelnew() {
    this.resetapcat();
    this.getapcategorynew(1)
    this.ismakerCheckerButton = true;
    this.isApCategory = true;
    this.isApCategoryForm = false;
  }
  apCategoryEditnew(data) {
    this.editApcatPopup = true;
    console.log("edit data apcat", data)
    this.code = data.code
    this.name = data.name,
      this.no = data.no,
      this.editapcat.patchValue({
        id: data.id,
        isasset: data.isasset,
      })
  }
  editapcatForm() {
    let data = this.editapcat.value
    console.log(data)
    this.spinner.show();
    this.atmaService.editapcat(data)
      .subscribe(result => {
        this.spinner.hide();
        this.notification.showSuccess("Successfully Updated!...");
        this.modalcloseap.nativeElement.click();
        this.isApcategory = true;
        console.log("editapcat SUBMIT", result)
        this.getapcategorynew(1);
        this.resetapcat();
        return true
      })
  }
  resetcatstatus:number;
  resetapcat() {
    // this.apcatSearchForm.controls['no'].reset("")
    // this.apcatSearchForm.controls['name'].reset("")
    // this.apcatSearchForm.controls['activeinacttive'].reset("")
    // this.ActiveInactive=[];
    // this.ActiveInactive.push({ value: 0, display: 'Active' },
    // { value: 1, display: 'Inactive' })
    this.apcatSearchForm.reset('');
    this.apstatus=0;
    this.resetcatstatus=1;
    this.getapcategorynew(1);
  }
  autocompletecatScroll() {
    setTimeout(() => {
      if (
        this.matcatAutocomplete &&
        this.autocompleteTrigger &&
        this.matcatAutocomplete.panel
      ) {
        fromEvent(this.matcatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaService.getcategoryFKdd(this.catInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.categoryList = this.categoryList.concat(datas);
                    // console.log("emp", datas)
                    if (this.categoryList.length >= 0) {
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

  public displayFncat(cat?: catlistss): string | undefined {
    return cat ? cat.name : undefined;
  }

  get cat() {
    return this.apsubcatSearchForm.get('category_id');
  }


  private getcategory(apcatkeyvalue) {
    this.atmaService.getcategorydd(apcatkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryList = datas;
      })
  }
  apcatSearch() {
    // if (this.apcatSearchForm.value.no === '' && this.apcatSearchForm.value.name === '') {
    //   this.getapcategorynew();
    //   return
    // }
    // if (this.apcatSearchForm.value.name === null && this.apcatSearchForm.value.no === null) {
    //   this.getapcategorynew();
    //   return false
    // }
    // let no = this.apcatSearchForm.value.no
    // let name = this.apcatSearchForm.value.name
    this.spinner.show();
    this.atmaService.getapsearchcategory(this.apcatSearchForm.value.no?this.apcatSearchForm.value.no:'',this.apcatSearchForm.value.name?this.apcatSearchForm.value.name:'')
      .subscribe(result => {
        this.spinner.hide();
        console.log("apCategoryList search result", result)
        let datapagination = result["pagination"];
        this.apCategoryList = result['data']
        if (this.apCategoryList.length > 0) {
          this.has_nextapcat = datapagination.has_next;
          this.has_previousapcat = datapagination.has_previous;
          this.presentpageapcat = datapagination.index;
        }
      })
  }
  forInactiveapcat(data) {
    let datas = data.id
    let status: number = 0
    console.log('check id for data passing', datas)
    this.atmaService.activeInactiveapcat(datas, status)
      .subscribe((results: any[]) => {
        this.notification.showSuccess('Successfully InActivated!')
        this.resetapcat();
        this.getapcategorynew(1);
        return true
      })
    // alert('inactive')
  }


  foractiveapcat(data) {
    let datas = data.id
    let status: number = 1
    console.log('check id for data passing', datas)
    this.atmaService.activeInactiveapcat(datas, status)
      .subscribe((results: any[]) => {
        this.notification.showSuccess('Successfully Activated!')
        this.resetapcat();
        this.getapcategorynew(1);
        return true
      })
  }
 
  apcatappreset(){
    this.apcatapproverform.reset("");
    this.apcatapprover(1);

  }
  
  resetapsubappcat(){
    this.apsubcatapproverForm.reset("");
    this.apsubcatapprover(1);
  }
  nextapcatapp(){
    if(this.has_nextapcatapp === true){
      this.apcatapprover(this.presentpageapcatapp +1)
    }
  }
  prevapcatapp(){
    if(this.has_previousapcatapp === true){
      this.apcatapprover(this.presentpageapcatapp -1)
    }
  }
  previousClickapsubcatapp(){
    if(this.has_previousapsubcatapp === true){
      this.apsubcatapprover(this.presentpageapsubcatapp-1)
    }
  }
  nextClickapsubcatapp(){
    if(this.has_nextapsubcatapp === true){
      this.apsubcatapprover(this.presentpageapsubcatapp+1)
    }
  }
  apcategorydetails_download(){
    if(this.first==true){
      this.notification.showWarning('Already Running')
      return true
    }
    this.first=true;
    this.atmaService.getapcategorydetails_Download()
    .subscribe(fullXLS=>{
      console.log(fullXLS);
      let binaryData = [];
      binaryData.push(fullXLS)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'Ap Category Master '+ date +".xlsx";
      link.click();
      this.first = false;
      this.notification.showSuccess('Downloaded Successfully')
    },
    (error)=>{
      this.first=false;
      this.notification.showWarning(error.status+error.statusText)
    })
  }

  ///////////////////////////////////////////////////APsubategory

    apcatapprover(page){
    this.spinner.show();
    let no:any;
    let name:any;
    if(this.apcatapproverform.get('no').value == undefined || this.apcatapproverform.get('no').value == null || this.apcatapproverform.get('no').value == ''){
      no='';
    }else{
      no=this.apcatapproverform.get('no').value;
    }
    if(this.apcatapproverform.get('name').value == undefined || this.apcatapproverform.get('name').value == null || this.apcatapproverform.get('name').value == ''){
      name='';
    }else{
      name=this.apcatapproverform.get('name').value;
    }
    this.atmaService.getapcatapprover(page,no,name).subscribe(res=>{
      this.spinner.hide()
      if(res.code!=undefined && res.code!="" && res.code!=null){
        this.spinner.hide();
        this.notification.showError(res.code);
        this.notification.showError(res.description);

      }
      else{
        this.spinner.hide();
        this.apcatapproverlist = res["data"];
        let datapagination =res["pagination"];
        if(this.apcatapproverlist.length>0){
          this.has_previousapcatapp = datapagination.has_previous;
          this.has_nextapcatapp = datapagination.has_next;
          this.presentpageapcatapp = datapagination.index;
        } 

      }
     
    })
  }
  apsubcatapprover(page){
    this.spinner.show();
    let no:any;
    let name:any;
    if(this.apsubcatapproverForm.get('no').value == undefined || this.apsubcatapproverForm.get('no').value == null || this.apsubcatapproverForm.get('no').value == ''){
      no='';
    }else{
      no=this.apsubcatapproverForm.get('no').value;
    }
    if(this.apsubcatapproverForm.get('name').value == undefined || this.apsubcatapproverForm.get('name').value == null || this.apsubcatapproverForm.get('name').value == ''){
      name='';
    }else{
      name=this.apsubcatapproverForm.get('name').value;
    }
    this.atmaService.getapsubcatapprover(page,no,name).subscribe(res=>{
      if(res.code!=undefined && res.code!="" && res.code!=null){
        this.spinner.hide();
        this.notification.showError(res.code);
        this.notification.showError(res.description);
      
      }
      else{
        this.spinner.hide();
        this.apsubcatapproverlist = res["data"];
        let datapagination =res["pagination"];
        if(this.apsubcatapproverlist.length>0){
          this.has_previousapsubcatapp = datapagination.has_previous;
          this.has_nextapsubcatapp = datapagination.has_next;
          this.presentpageapsubcatapp = datapagination.index;
        } 

      }
     
    })
  }
  disable_button_apcat:boolean=false;
  disable_btn_ap(checked:boolean){
    this.disable_button_apcat=checked;
  }

  approveapcat(apcatapproverlist){
    let apcatapp_list:any=[]
    for(var i=0;i< apcatapproverlist.length;i++){
      if(apcatapproverlist[i].isSelected){
        apcatapp_list.push(apcatapproverlist[i].id)
      }

    }
    console.log("apcatapp:",apcatapp_list)
    let dict={
      "approve_reject_list":apcatapp_list,
      "status":1
    }
    this.spinner.show();
    this.atmaService.approveapcat(dict).subscribe(res=>{
      this.spinner.hide();
      if(res.status==="success"){
        this.notification.showSuccess(res.message);
        this.apcatappreset();
        this.disable_btn_ap(false)

      }
      else if (res.code === "INVALID_APPROVER_ID" && res.description === "Invalid Approver Id") {
        this.notification.showError("Maker Not Allowed To Approve or Reject")
        return false
      }
      else if(res.code === "UNEXPECTED_ERROR" && res.description === "NOT ALLOWED TO APPROVE OR REJECT APCATEGORY"){
        this.notification.showError("NOT ALLOWED TO APPROVE OR REJECT APCATEGORY IN 'PROD' ENVIRONMENT");
      } 
      else{
        this.notification.showWarning(res.description);
      }
    },
    (error)=>{
      this.spinner.hide();
    })
    

  }
  rejectapcat(apcatapproverlist){
    let apcatrej_list:any=[]
    for(var i=0;i<apcatapproverlist.length;i++){
      if(apcatapproverlist[i].isSelected){
        apcatrej_list.push(apcatapproverlist[i].id)
      }
    }
    console.log("apcatrej:",apcatrej_list)
    let dict={
      "approve_reject_list":apcatrej_list,
      "status":3
    }
    this.spinner.show();
    this.atmaService.rejectapcat(dict).subscribe(res=>{
      this.spinner.hide();
      if(res.status==="success"){
        this.notification.showSuccess(res.message);
        this.apcatappreset();
        this.disable_btn_ap(false)

      }
      else if (res.code === "INVALID_APPROVER_ID" && res.description === "Invalid Approver Id") {
        this.notification.showError("Maker Not Allowed To Approve or Reject")
        return false
      }
      else if(res.code === "UNEXPECTED_ERROR" && res.description === "NOT ALLOWED TO APPROVE OR REJECT APCATEGORY"){
        this.notification.showError("NOT ALLOWED TO APPROVE OR REJECT APCATEGORY IN 'PROD' ENVIRONMENT");
      } 
      else{
        this.notification.showWarning(res.description);
      }
      
    },
    (error)=>{
      this.spinner.hide();
    })

  }
  disable_button_apsub:boolean=false;
  disable_btn_apsub(checked:boolean){
    this.disable_button_apsub=checked;
  }

  approveapsubcat(apsubcatapproverlist){
    let apsubcat_applist:any=[];
    for(var i=0;i<apsubcatapproverlist.length;i++){
      if(apsubcatapproverlist[i].isSelected){
        apsubcat_applist.push(apsubcatapproverlist[i].id);
      }
    }
    console.log("apsubcatapp",apsubcat_applist);
    let dict={
      "approve_reject_list":apsubcat_applist,
      "status":1
    }
    this.spinner.show();
    this.atmaService.approveapsubcat(dict).subscribe(res=>{
      this.spinner.hide();
      if(res.status==="success"){
        this.notification.showSuccess(res.message);
        this.resetapsubappcat();
        this.disable_btn_apsub(false);

      }
      else if (res.code === "INVALID_APPROVER_ID" && res.description === "Invalid Approver Id") {
        this.notification.showError("Maker Not Allowed To Approve or Reject")
        return false
      }
      else if(res.code === "UNEXPECTED_ERROR" && res.description === "NOT ALLOWED TO APPROVE OR REJECT APSUBCATEGORY"){
        this.notification.showError("NOT ALLOWED TO APPROVE OR REJECT APSUBCATEGORY IN 'PROD' ENVIRONMENT");
      } 
      else{
        this.notification.showWarning(res.description);
      }
    },
    (error)=>{
      this.spinner.hide();
    })

  }
  
  rejectapsubcat(apsubcatapproverlist){
    let apsubcat_rejlist:any=[];
    for(var i=0;i<apsubcatapproverlist.length;i++){
      if(apsubcatapproverlist[i].isSelected){
        apsubcat_rejlist.push(apsubcatapproverlist[i].id);
      }
    }
    console.log("apsubcatapp",apsubcat_rejlist);
    let dict={
      "approve_reject_list":apsubcat_rejlist,
      "status":3
    }
    this.spinner.show();
    this.atmaService.rejectapsubcat(dict).subscribe(res=>{
      this.spinner.hide();
      if(res.status==="success"){
        this.notification.showSuccess(res.message);
        this.resetapsubappcat();
        this.disable_btn_apsub(false);
      }
      else if (res.code === "INVALID_APPROVER_ID" && res.description === "Invalid Approver Id") {
        this.notification.showError("Maker Not Allowed To Approve or Reject")
        return false
      }
      else if(res.code === "UNEXPECTED_ERROR" && res.description === "NOT ALLOWED TO APPROVE OR REJECT APSUBCATEGORY"){
        this.notification.showError("NOT ALLOWED TO APPROVE OR REJECT APSUBCATEGORY IN 'PROD' ENVIRONMENT");
      } 
      else{
        this.notification.showWarning(res.description);
      }
    },
    (error)=>{
      this.spinner.hide();
    })

  }
  getapsubcategory(page) {
    this.spinner.show();
    let no:any;
    let name:any;
    let cat_id:any;
    let status:any;
    if(this.apsubcatSearchForm.get('no').value==null || this.apsubcatSearchForm.get('no').value==undefined || this.apsubcatSearchForm.get('no').value==''){
      no='';
    }else{
      no=this.apsubcatSearchForm.get('no').value
    }
    if(this.apsubcatSearchForm.get('name').value==null || this.apsubcatSearchForm.get('name').value== undefined || this.apsubcatSearchForm.get('name').value==''){
      name='';
    }else{
      name=this.apsubcatSearchForm.get('name').value
    }
    if(this.apsubcatSearchForm.get('category_id').value==null ||this.apsubcatSearchForm.get('category_id').value.id==undefined || this.apsubcatSearchForm.get('category_id').value==''){
      cat_id=''
    }else{
      cat_id=this.apsubcatSearchForm.get('category_id').value.id
    }
    if(this.apsubcatSearchForm.get('activeinactive').value==undefined || this.apsubcatSearchForm.get('activeinactive').value==''|| this.apsubcatSearchForm.get('activeinactive').value==null){
      status='';
    }
    else{
      status=this.drpdwn[this.apsubcatSearchForm.get('activeinactive').value]
    }
    this.atmaService.getapsubcategory(page,cat_id,name,no,status)
      .subscribe((results: any[]) => {
        this.spinner.hide();
        let datas = results["data"];
        console.log("getapsubcat", datas);
        let datapagination = results["pagination"];
        this.apSubCategoryList = datas;
        if (this.apSubCategoryList.length > 0) {
          this.has_nextapsubcat = datapagination.has_next;
          this.has_previousapsubcat = datapagination.has_previous;
          this.presentpageapsubcat = datapagination.index;
        }
      })

  }
  apsubcatstatus:number;
  nextClickapsubcat() {
    if (this.has_nextapsubcat === true) {
      this.getapsubcategory(this.presentpageapsubcat + 1)
    }
  }

  previousClickapsubcat() {
    if (this.has_previousapsubcat === true) {
      this.getapsubcategory(this.presentpageapsubcat - 1)
    }
  }
  apsubCategorySubmit() {
    this.resetapsubcat();
    this.ismakerCheckerButton = true;
    this.isApSubCategory = true;
    this.isApSubCategoryForm = false;
  }
  apsubCategoryCancel() {
    this.ismakerCheckerButton = true;
    this.isApSubCategory = true;
    this.isApSubCategoryForm = false;
  }
  resetapsubcatstatus:number;
  resetapsubcat() {
    this.apsubcatSearchForm.controls['no'].reset("")
    this.apsubcatSearchForm.controls['name'].reset("")
    this.apsubcatSearchForm.controls['category_id'].reset(""),
    this.apsubcatSearchForm.controls['activeinactive'].reset(""),
    // this.apsubcatSearchForm.reset('');
    this.getapsubcategory(1);
  }
  apSubCategoryEditnew(data) {
    this.editApsubcatPopup = true;
    console.log("edit data apsubcat", data)
    this.code = data.code
    this.name = data.name,
      this.no = data.no,
      this.editapsubcat.patchValue({
        id: data.id,
        gstblocked: data.gstblocked,
        gstrcm: data.gstrcm,
        status: data.status
      })
  }

  editapsubcatcatForm() {
    let data = this.editapsubcat.value
    console.log(data)
    this.spinner.show();
    this.atmaService.editapsubcat(data)
      .subscribe(result => {
        this.spinner.hide();
        this.notification.showSuccess("Successfully Updated!...")
        this.isApsubcategory = true;
        console.log("editapsubcat SUBMIT", result);
        this.modalclose.nativeElement.click();
        this.getapsubcategory(1);
        return true
      })
  }
  apsubcategorydetails_download(){
    if(this.first==true){
      this.notification.showWarning('Already Running')
      return true
    }
    this.first=true;
    this.atmaService.getapsubcategorydetails_Download()
    .subscribe(fullXLS=>{
      console.log(fullXLS);
      let binaryData = [];
      binaryData.push(fullXLS)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'Ap SubCategory Master '+ date +".xlsx";
      link.click();
      this.first = false;
      this.notification.showSuccess('Downloaded Successfully')
    },
    (error)=>{
      this.first=false;
      this.notification.showWarning(error.status+error.statusText)
    })
  }

  createFormateApsubCategory() {
    let data = this.apsubcatSearchForm.controls;
    let apsubcatSearchclass = new apsubcatSearchtype();
    apsubcatSearchclass.no = data['no'].value;
    apsubcatSearchclass.name = data['name'].value;
    apsubcatSearchclass.category_id = data['category_id']?.value.id;
    console.log("apsubcatSearchclass", apsubcatSearchclass)
    return apsubcatSearchclass;
  }
 


  displayStyle = false;
  data: any = { 'name': '', 'productcategory_id': { 'name': '' }, 'unitprice': '', 'weight': '', 'producttype_id': { 'name': '' } };
  openPopup(datas: any) {
    this.data = datas;
    console.log(this.data);
    this.displayStyle = true;
  }
  closePopup() {
    this.displayStyle = false;
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  taxCreateForm() {
    console.log(this.taxaddfrom.get('glno').value.toString().length);
    if (this.taxaddfrom.get('name').value.trim() == '' || this.taxaddfrom.get('name').value == undefined || this.taxaddfrom.get('name').value == null) {
      this.notification.showError('Please Enter The Tax Name');
      return false;
    }
    if (this.taxaddfrom.get('pay_receivable').value == null || this.taxaddfrom.get('pay_receivable').value == '' || this.taxaddfrom.get('pay_receivable').value == undefined) {
      this.notification.showError('Please Select The Payable');
      return false;
    }
    if (this.taxaddfrom.get('isreceivable').value == null || this.taxaddfrom.get('isreceivable').value == undefined || this.taxaddfrom.get('isreceivable').value == '') {
      this.notification.showError('Please Select The Receivable');
      return false;
    }
    if (this.taxaddfrom.get('glno').value.toString().length == 9 || this.taxaddfrom.get('glno').value.toString().length == 16) {
      console.log(this.taxaddfrom.value);
    }
    else {
      this.notification.showError('Please Enter The Glno upto 9 0r 16 digits');
      return false;
    }
    let payable: any = { 'Yes': 1, 'No': 0 };
    let receivable: any = { 'Yes': 1, 'No': 0 };
    let data: any = {
      "name": this.taxaddfrom.get('name').value.trim(),
      "receivable": receivable[this.taxaddfrom.get('isreceivable').value],
      "payable": payable[this.taxaddfrom.get('pay_receivable').value],
      "glno": this.taxaddfrom.get('glno').value
    }
    this.spinner.show();
    this.atmaService.taxCreateForm(data)
      .subscribe(result => {
        this.spinner.hide();
        
        if(result.status ==='success') {
          this.notification.showSuccess(result.message)
          this.enbtax = !this.enbtax;
          this.enbtaxcan = !this.enbtaxcan;
          this.enbtaxbtn = !this.enbtaxbtn;
          this.taxaddfrom.patchValue({ 'name': '', 'pay_receivable': '', 'isreceivable': '', 'glno': '' });
        }
        else{
          this.notification.showWarning(result.description)

        }
      },
        (error) => {
          this.notification.showError(error.status + error.statusText);
          this.spinner.hide();
        }
      )
  }
  subcategoryfocusout(data: any) {
    this.subtaxaddform.get('glno').patchValue(data.glno);
  }
  enbtax: boolean = true;
  enbtaxcan: boolean = false;
  enbtaxbtn: boolean = false;
  subtaxenb: boolean = true;
  subtaxcan: boolean = false;
  subtaxenbbtn: boolean = false;
  subtaxrateenb: boolean = true;
  subtaxrateenbbtn: boolean = false;
  subtaxrateenbcan: boolean = false;
  gettaxena() {
    this.enbtax = !this.enbtax;
    this.enbtaxbtn = !this.enbtaxbtn;
    this.enbtaxcan = !this.enbtaxcan;
    if (this.enbtaxcan == false) {
      this.taxaddfrom.patchValue({ 'name': '', 'pay_receivable': '', 'isreceivable': '', 'glno': '' });
    }
  }
  getsubtaxena() {
    this.subtaxenb = !this.subtaxenb;
    this.subtaxenbbtn = !this.subtaxenbbtn;
    this.subtaxcan = !this.subtaxcan;
    if (this.subtaxcan == false) {
      this.subtaxaddform.patchValue({ 'subtaxname': '', 'subtaxlimit': '', 'subtaxremarks': '', 'subcategory': '', 'subcategorysub': '', 'glno': '' });
    }
  }
  gettaxrateenb() {
    this.subtaxrateenb = !this.subtaxrateenb;
    this.subtaxrateenbbtn = !this.subtaxrateenbbtn;
    this.subtaxrateenbcan = !this.subtaxrateenbcan;
    if (this.subtaxrateenbcan == false) {
      this.taxrateaddgorm.patchValue({ 'taxratename': '', 'coderate': '' });
    }
  }
  submitsubtax() {
    console.log(this.subtaxaddform.value);
    if (this.subtaxaddform.get('name').value.id == undefined || this.subtaxaddform.get('name').value == '' || this.subtaxaddform.get('name').value == null) {
      this.notification.showError('Please Select The Tax Name');
      return false;
    }
    if (this.subtaxaddform.get('subtaxname').value == undefined || this.subtaxaddform.get('subtaxname').value == '' || this.subtaxaddform.get('subtaxname').value == null) {
      this.notification.showError('Please Enter The Sub Tax Name');
      return false;
    }
    if (this.subtaxaddform.get('subtaxlimit').value == undefined || this.subtaxaddform.get('subtaxlimit').value == '' || this.subtaxaddform.get('subtaxlimit').value == null) {
      this.notification.showError('Please Enter The Sub Tax Limit');
      return false;
    }
    if (this.subtaxaddform.get('subtaxremarks').value == undefined || this.subtaxaddform.get('subtaxremarks').value == '' || this.subtaxaddform.get('subtaxremarks').value == null) {
      this.notification.showError('Please Enter The Sub Tax Remarks');
      return false;
    }
    if (this.subtaxaddform.get('subcategory').value.id == undefined || this.subtaxaddform.get('subcategory').value == '' || this.subtaxaddform.get('subcategory').value.id == null) {
      this.notification.showError('Please Select The Categoty');
      return false;
    }
    if (this.subtaxaddform.get('subcategorysub').value.id == undefined || this.subtaxaddform.get('subcategorysub').value == '' || this.subtaxaddform.get('subcategorysub').value.id == null) {
      this.notification.showError('Please Enter The SubCategory');
      return false;
    }
    if (this.subtaxaddform.get('glno').value == undefined || this.subtaxaddform.get('glno').value == '' || this.subtaxaddform.get('glno').value == null) {
      this.notification.showError('Please Enter The GlNo');
      return false;
    }
    let data: any = {
      "tax_id": this.subtaxaddform.get('name').value.id,
      "name": this.subtaxaddform.get('subtaxname').value.trim(),
      "subtaxamount": this.subtaxaddform.get('subtaxlimit').value,
      "remarks": this.subtaxaddform.get('subtaxremarks').value.trim(),
      "category_id": this.subtaxaddform.get('subcategory').value.id,
      "subcategory_id": this.subtaxaddform.get('subcategorysub').value.id,
      "glno": this.subtaxaddform.get('subcategorysub').value.glno
    }
    this.spinner.show();
    this.atmaService.getaddtaxname(data).subscribe((datas: any) => {
      console.log(datas);
      this.spinner.hide();
      if(datas.status ==="success") {
        this.notification.showSuccess(datas.message)
        this.subtaxenb = !this.subtaxenb;
        this.subtaxcan = !this.subtaxcan;
        this.subtaxenbbtn = !this.subtaxenbbtn;
        // this.subtaxaddform.patchValue({ 'subtaxname': '', 'subtaxlimit': '', 'subtaxremarks': '', 'subcategory': '', 'subcategorysub': '', 'glno': '' });
        // this.subtaxaddform.controls.subcategorysub.reset('');
        // this.subtaxaddform.controls.glno.reset('');
        // this.subtaxaddform.controls.subtaxname.reset('');
        // this.subtaxaddform.controls.subtaxremarks.reset('');
        // this.subtaxaddform.controls.subcategory.reset('');
        // this.subtaxaddform.controls.subtaxlimit.reset('');
        // this.subtaxaddform.controls.glno.reset('');
        this.subtaxaddform.reset();
      }
      else{
        this.notification.showWarning(datas.description)
      }
    },
      (error) => {
        this.notification.showError(error.status + error.statusText);
        this.spinner.hide();
      }
    );
  }
  submitaddtaxrate() {
    if(this.taxrateaddgorm.get('name').value.id === undefined || this.taxrateaddgorm.get('name').value==''|| this.taxrateaddgorm.get('name').value==null){
      this.notification.showError('Please Select The Tax Name ')
      return false;
    }
    if (this.taxrateaddgorm.get('subtaxrate').value.id == undefined || this.taxrateaddgorm.get('subtaxrate').value == '' || this.taxrateaddgorm.get('subtaxrate').value == null) {
      this.notification.showError('Please Select The Sub TaxName');
      return false;
    }
    // if(this.taxrateaddgorm.get('subtaxratenew').value==undefined || this.taxrateaddgorm.get('subtaxratenew').value=='' || this.taxrateaddgorm.get('subtaxratenew').value==null){
    //   this.notification.showError('Please Enter The TaxRate');
    //   return false;
    // }
    if (this.taxrateaddgorm.get('taxratename').value == undefined || this.taxrateaddgorm.get('taxratename').value == '' || this.taxrateaddgorm.get('taxratename').value == null) {
      this.notification.showError('Please Enter The TaxRate Name');
      return false;
    }
    if (this.taxrateaddgorm.get('coderate').value == undefined || this.taxrateaddgorm.get('coderate').value == '' || this.taxrateaddgorm.get('coderate').value == null) {
      this.notification.showError('Please Enter The TaxRate ');
      return false;
    }
    let data: any = {
      "name": this.taxrateaddgorm.get('taxratename').value,
      "subtax_id": this.taxrateaddgorm.get('subtaxrate').value.id,
      "rate": this.taxrateaddgorm.get('coderate').value
    }
    this.spinner.show();
    this.atmaService.getaddtaxnamerate(data).subscribe((datas: any) => {
      this.spinner.hide();
       if(datas.status ==="success") {
        this.notification.showSuccess(datas.message)
        this.subtaxrateenb = !this.subtaxrateenb;
        this.subtaxrateenbbtn = !this.subtaxrateenbbtn;
        this.subtaxrateenbcan = !this.subtaxrateenbcan;
        // this.taxrateaddgorm.patchValue({ 'taxratename': "", 'coderate': "", 'subtaxrate': "", 'subtaxratenew': "", 'name': "" });
        // this.taxrateaddgorm.controls.taxratename.reset('');
        // this.taxrateaddgorm.controls.coderate.reset('');
        // this.taxrateaddgorm.controls.subtaxrate.reset('');
        // this.taxrateaddgorm.controls.subtaxratenew.reset('');
        // this.taxrateaddgorm.controls.name.reset('');
        this.taxrateaddgorm.reset();
      }
      else{
        this.notification.showWarning(datas.description)

      }
    },
      (error) => {
        this.notification.showError(error.status + error.statusText);
      }
    )
  }
  getinfinitecategory() {
    setTimeout(() => {
      if (
        this.matTaxtaxAutocomplete &&
        this.autocompleteTrigger &&
        this.matTaxtaxAutocomplete.panel
      ) {
        fromEvent(this.matTaxtaxAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matTaxtaxAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matTaxtaxAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matTaxtaxAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matTaxtaxAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_categorynxt === true) {
                this.atmaService.getcategoryFKdd(this.catinput.nativeElement.value, this.has_categorypage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.categoryList = this.categoryList.concat(datas);
                    if (this.categoryList.length >= 0) {
                      this.has_categorynxt = datapagination.has_next;
                      this.has_categorypre = datapagination.has_previous;
                      this.has_categorypage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  gettaxinfinite(data: any) {

    setTimeout(() => {
      if (
        this.mattaxname &&
        this.autocompleteTrigger &&
        this.mattaxname.panel
      ) {
        fromEvent(this.mattaxname.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.mattaxname.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.mattaxname.panel.nativeElement.scrollTop;
            const scrollHeight = this.mattaxname.panel.nativeElement.scrollHeight;
            const elementHeight = this.mattaxname.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_taxnamenxt === true) {
                this.atmaService.gettaxnamelist(this.taxInput.nativeElement.value, this.has_taxnamepage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.taxnamelist = this.taxnamelist.concat(datas);
                    if (this.taxnamelist.length >= 0) {
                      this.has_taxnamenxt = datapagination.has_next;
                      this.has_taxnamepre = datapagination.has_previous;
                      this.has_taxnamepage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });


  }
  gettaxinfinitesdata() {

    setTimeout(() => {
      if (
        this.matstaxname &&
        this.autocompleteTrigger &&
        this.matstaxname.panel
      ) {
        fromEvent(this.matstaxname.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matstaxname.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matstaxname.panel.nativeElement.scrollTop;
            const scrollHeight = this.matstaxname.panel.nativeElement.scrollHeight;
            const elementHeight = this.matstaxname.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_taxnamenxt === true) {
                this.atmaService.gettaxnamelist(this.taxsInput.nativeElement.value, this.has_taxnamepage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.taxlistdata = this.taxlistdata.concat(datas);
                    if (this.taxlistdata.length >= 0) {
                      this.has_taxnamenxt = datapagination.has_next;
                      this.has_taxnamepre = datapagination.has_previous;
                      this.has_taxnamepage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });


  }
  gettaxinfinites(data: any) {

    setTimeout(() => {
      if (
        this.mattaxname &&
        this.autocompleteTrigger &&
        this.mattaxname.panel
      ) {
        fromEvent(this.mattaxname.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.mattaxname.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.mattaxname.panel.nativeElement.scrollTop;
            const scrollHeight = this.mattaxname.panel.nativeElement.scrollHeight;
            const elementHeight = this.mattaxname.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_taxnamenxt === true) {
                this.atmaService.gettaxnamelist(this.taxInput.nativeElement.value, this.has_taxnamepage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.taxnamelist = this.taxnamelist.concat(datas);
                    if (this.taxnamelist.length >= 0) {
                      this.has_taxnamenxt = datapagination.has_next;
                      this.has_taxnamepre = datapagination.has_previous;
                      this.has_taxnamepage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });


  }
  getsubcategoryinfinite() {
    setTimeout(() => {
      if (
        this.matcatsublists &&
        this.autocompleteTrigger &&
        this.matcatsublists.panel
      ) {
        fromEvent(this.matcatsublists.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcatsublists.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcatsublists.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcatsublists.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcatsublists.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_subcategorynxt === true) {
                this.atmaService.getapsubcat_tax(this.apcat_id,this.subcatinput.nativeElement.value, this.has_subcategorypage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.subcategorylistdata = this.subcategorylistdata.concat(datas);
                    if (this.subcategorylistdata.length >= 0) {
                      this.has_subcategorypre = datapagination.has_next;
                      this.has_subcategorynxt = datapagination.has_previous;
                      this.has_subcategorypage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  getsubtaxnameinfinite() {
    setTimeout(() => {
      if (
        this.matsubtaxname &&
        this.autocompleteTrigger &&
        this.matsubtaxname.panel
      ) {
        fromEvent(this.matsubtaxname.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsubtaxname.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsubtaxname.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsubtaxname.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsubtaxname.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_subtaxnamenxt === true) {
                this.atmaService.getsubtaxnamelist(this.taxrateaddgorm.get('name').value.id, this.subtaxInput.nativeElement.value, this.has_subtaxnamepage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.subtaxnamelist = this.subtaxnamelist.concat(datas);
                    if (this.subtaxnamelist.length >= 0) {
                      this.has_subtaxnamenxt = datapagination.has_next;
                      this.has_subtaxnamepre = datapagination.has_previous;
                      this.has_subtaxnamepage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  getsubtaxrateinfinite() {
    setTimeout(() => {
      if (
        this.matsubtaxratename &&
        this.autocompleteTrigger &&
        this.matsubtaxratename.panel
      ) {
        fromEvent(this.matsubtaxratename.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsubtaxratename.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsubtaxratename.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsubtaxratename.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsubtaxratename.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_subtaxratenamenxt === true) {
                this.atmaService.getsubratetaxnamelist(this.taxrateaddgorm.get('subtaxrate').value.id, this.subtaxrateInput.nativeElement.value, this.has_subtaxratenamepage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.subtaxratelist = this.subtaxratelist.concat(datas);
                    if (this.subtaxratelist.length >= 0) {
                      this.has_subtaxratenamenxt = datapagination.has_next;
                      this.has_subtaxratenamepre = datapagination.has_previous;
                      this.has_subtaxratenamepage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  getactiveinactivetax(data: any) {
    let dta: any = { 'id': data.id, 'status': data.status };
    this.spinner.show();
    this.atmaService.taxactiveinactive(dta).subscribe(datas => {
      this.spinner.hide();
      if (datas['status'] == 'success') {
        this.notification.showSuccess(datas['message']);
        this.taxReset();
      }
      else {
        this.notification.showError(datas['description']);
      }
    },
      (error) => {
        this.notification.showError(error.status + error.statusText);
        this.spinner.hide();
      }
    );
  }
  getactiveapcategory(data: any) {
    let dta: any = { 'id': data.id, 'status': data.status };
    this.spinner.show();
    this.atmaService.getactiveinactivetapcategory(dta).subscribe(datas => {
      this.spinner.hide();
      if (datas['status'] == 'success') {
        this.notification.showSuccess(datas['message']);
        this.resetapcat();
        this.getapcategorynew(1);
      }
      else {
        this.notification.showError(datas['description']);
      }
    },
      (error) => {
        this.notification.showError(error.status + error.statusText);
      }
    );
  }
  getactiveapsubcategory(data: any) {
    let dta: any = { 'id': data.id, 'status': data.status };
    this.spinner.show();
    this.atmaService.getactiveinactivetapsubcategory(dta).subscribe(datas => {
      this.spinner.hide();
      if (datas['status'] == 'success') {
        this.notification.showSuccess(datas['message']);
        this.resetapsubcat();
      }
      else {
        this.notification.showError(datas['description']);
      }
    },
      (error) => {
        this.notification.showError(error.status + error.statusText);
      }
    );
  }

  questypesearch(pageNumber = 1) {
    let qdata: any
    qdata = this.questiontypeformgroup.value.name
    if (qdata == null || qdata == undefined ) {
      qdata = ""
    }
    this.atmaService.getquestypemaster(qdata, pageNumber)
    .subscribe(result => {
        let pagination = result['pagination']
        this.QuestypeList = result['data']
        if (this.QuestypeList.length >= 0) {
          this.ques_nexttype = pagination.has_next;
          this.ques_previoustype = pagination.has_previous;
          this.quespresentpage = pagination.index;
        }

      })
  }

  questypereset() {
    this.questiontypeformgroup.reset('')
    this.questypesearch(this.quespresentpage = 1)
  }

  addquestiontype(){
    this.ismakerCheckerButton = false;
    this.questiontypeform = true;
    this.questiontype= false;
  
   }

   viewquesedit(data) {
    this.questiontypeform = true;
    this.ismakerCheckerButton = false;
    this.questiontype = false;
    
    let id = data.id
    this.sharedService.questypeedit.next(id)
    return true;
   
  }

  questypeSubmit() {
    this.questypesearch(1);
    this.questiontypeform = false;
    this.ismakerCheckerButton = true;
    this.questiontype = true;
    
  }

  questypeCancel() {
    this.questypesearch(1);
    this.questiontypeform = false;
    this.ismakerCheckerButton = true;
    this.questiontype = true;

  }

  quesprevious() {
    if (this.ques_previoustype === true) {
      this.questypesearch(this.quespresentpage - 1);
    }
  }
  quesnext() {
    if (this.ques_nexttype === true) {
      this.questypesearch(this.quespresentpage + 1);
    }
  }

  quesheadersearch(pageNumber = 1) {
    let qhdrdata: any
    qhdrdata = this.quesheaderform.value.name
    if (qhdrdata == null || qhdrdata == undefined ) {
      qhdrdata = ""
    }
    this.atmaService.getquesheadermaster(qhdrdata, pageNumber)
    .subscribe(result => {
        let pagination = result['pagination']
        this.QuesheaderList = result['data']
        if (this.QuesheaderList.length >= 0) {
          this.queshdr_nexttype = pagination.has_next;
          this.queshdr_previoustype = pagination.has_previous;
          this.queshdrpresentpage = pagination.index;
        }

      })
  }

  quesheaderreset() {
    this.quesheaderform.reset('')
    this.quesheadersearch(this.queshdrpresentpage = 1)
  }

  addquestionheader(){
    this.ismakerCheckerButton = false;
    this.isquesheaderform = true;
    this.questionheader= false;
  
   }

   viewqueshdredit(data) {

    let id = data.id
    this.isquesheaderform = true;
    this.ismakerCheckerButton = false;
    this.questionheader = false;

    this.sharedService.quesheaderedit.next(id)
    return true;
   
  }

  queshdrprevious() {
    if (this.queshdr_previoustype === true) {
      this.quesheadersearch(this.queshdrpresentpage - 1);
    }
  }

  queshdrnext() {
    if (this.queshdr_nexttype === true) {
      this.quesheadersearch(this.queshdrpresentpage + 1);
    }
  }

  quesheaderCancel() {
    this.quesheadersearch(1);
    this.isquesheaderform = false;
    this.ismakerCheckerButton = true;
    this.questionheader = true;
  
  }

  quesheaderSubmit() {
    this.quesheadersearch(1);
    this.isquesheaderform = false;
    this.ismakerCheckerButton = true;
    this.questionheader = true;
   
  }

  getqueslists(){
    this.atmaService.getquestypemaster('',1).subscribe(data=>{
      this.questypelist=data['data'];
    });
  }

  kyenbdata(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }

  questypescroll(){
      
    setTimeout(() => {
      if (
        this.mattypename &&
        this.autocompleteTrigger &&
        this.mattypename.panel
      ) {
        fromEvent(this.mattypename.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.mattypename.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.mattypename.panel.nativeElement.scrollTop;
            const scrollHeight = this.mattypename.panel.nativeElement.scrollHeight;
            const elementHeight = this.mattypename.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaService.getquestypemaster(this.typeInput.nativeElement.value,this.currentpage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.questypelist = this.questypelist.concat(datas);
                    if (this.questypelist.length >= 0) {
                      this.questype_has_next = datapagination.has_next;
                      this.questype_has_previous = datapagination.has_previous;
                      this.questype_currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  
 
  }

  questionsearch(pageNumber = 1) {
    let questiondata: any
    if(this.questionform.value.type_id != null){
      questiondata = this.questionform.value.type_id
    }
    if(typeof(questiondata) == 'object'){
      questiondata = questiondata.id
    }else{
      questiondata = ""
    }

    // let questiondata: any
    // questiondata = this.questionform.value.text
    // if (questiondata == null || questiondata == undefined ) {
    //   questiondata = ""
    // }
   
    this.atmaService.getquesmaster(questiondata, pageNumber)
    .subscribe(result => {
        let pagination = result['pagination']
        this.QuestionList = result['data'].map(v => ({...v, isActive: false}))
        console.log("QuestionList",this.QuestionList)
        if (this.QuestionList.length >= 0) {
          this.question_nexttype = pagination.has_next;
          this.question_previoustype = pagination.has_previous;
          this.questionpresentpage = pagination.index;
        }

      })
    
  }
  questionprevious() {
    if (this.question_previoustype === true) {
      this.questionsearch(this.questionpresentpage - 1);
    }
  }
  questionnext() {
    if (this.question_nexttype === true) {
      this.questionsearch(this.questionpresentpage + 1);
    }
  }

  questionreset() {
    this.questionform.reset()
    this.questionsearch(this.questionpresentpage = 1)
  }

 addquestion(){
    this.ismakerCheckerButton = false;
    this.isquestionform = true;
    this.question= false;
  
   }

   viewquestionedit(data) {
    let id = data.id
    this.isquestionform = true;
    this.ismakerCheckerButton = false;
    this.question = false;

    this.sharedService.quesedit.next(id)
    return true;
    
  }


  questionCancel() {
    this.questionsearch(1);
    this.isquestionform = false;
    this.ismakerCheckerButton = true;
    this.question = true;
   
  }

  questionSubmit() {
    this.questionsearch(1);
    this.isquestionform = false;
    this.ismakerCheckerButton = true;
    this.question = true;
    
  }


  getquestionmapsummary(){
    this.getquestions(this.questionmappingform.value.type_id.id,this.question_currentpage=1)
  }

  questionmapreset(){
    this.questionmappingform.reset()
  }

  addquestionmapping(){
    this.ismakerCheckerButton = false;

    this.questionmapping=false

    this.questionmapform=true
   }

   public getquestypelist(data ?:questypelist):string | undefined{
    return data?data.name:undefined;
  }

   getquestions(value,page) {

    this.atmaService.getquestionsmapping(value,page).subscribe(data => {
      this.questiondata = data['data'];
      let datapagination = data["pagination"];
      
      if (this.questiondata.length >= 0) {
        this.question_has_next = datapagination.has_next;
        this.question_has_previous = datapagination.has_previous;
        this.question_currentpage = datapagination.index;
      }

    });
  }

  previousquestiondata(){
    if(this.question_has_previous){
      this.getquestions(this.questionmappingform.value.type_id.id,this.question_currentpage-1)
    }
      }
    
      nextquestiondata(){
        if(this.question_has_next){
          this.getquestions(this.questionmappingform.value.type_id.id,this.question_currentpage+1)
        }
      }

      questionmapcancel(){
        this.questionmapping=true
        this.ismakerCheckerButton = true;
        this.questionmapform=false
      }


      vendormapsearch(){
        this.mappingsearch(this.vendormappingform.value.type_id?.id,this.venmappresentpage = 1)
      }
    
      vendormapformreset(){
        this.vendormappingform.reset()
        this.mappingsearch(this.vendormappingform.value.type_id?.id,this.venmappresentpage = 1)
    
      }

      mappingsearch(value,pageNumber = 1) {
   
        this.atmaService.getvendocmapping(value,pageNumber)
        .subscribe(result => {
            let pagination = result['pagination']
            this.VenMapList = result['data']
            if (this.VenMapList.length >= 0) {
              this.venmap_nexttype = pagination.has_next;
              this.venmap_previoustype = pagination.has_previous;
              this.venmappresentpage = pagination.index;
            }
    
          })
        
      }

      venmapprevious() {
        if (this.venmap_previoustype === true) {
          this.mappingsearch(this.vendormappingform.value.type_id?.id,this.venmappresentpage - 1);
        }
      }
      venappnext() {
        if (this.venmap_nexttype === true) {
          this.mappingsearch(this.vendormappingform.value.type_id?.id,this.venmappresentpage + 1);
        }
      }

      addvenmap(){
        this.ismakerCheckerButton = false;
        this.isvendormappingform = true;
        this.vendormappingboolean= false;
     
      }

      venmapCancel() {
        this.mappingsearch('',1);
        this.isvendormappingform= false;
        this.ismakerCheckerButton = true;
        this.vendormappingboolean = true;
    
      }
    
      venmapSubmit() {
        this.mappingsearch('',1);
        this.isvendormappingform = false;
        this.ismakerCheckerButton = true;
        this.vendormappingboolean = true;
    
      }

      vieweditmap(data) {
        let id = data.id
        this.isvendormappingform = true;
        this.ismakerCheckerButton = false;
        this.vendormappingboolean = false;
        
        this.sharedService.venmapedit.next(id)
        
      }

      activitydesignationsearch(value,page){
        this.atmaService.getactivitydesignation(value,page).subscribe(
          result => {
            this.activitydesignationdata=result['data']
            let pagination=result['pagination']
            if (this.activitydesignationdata.length >= 0) {
              this.activitydesign_has_next = pagination.has_next;
              this.activitydesign_has_previous = pagination.has_previous;
              this.activitydesign_currentpage = pagination.index;
            }
          }
        )
      }

      activitydesignationreset(){
        this.activitydesignationform.reset()
        this.activitydesignationsearch('',this.activitydesign_currentpage=1)
      }

      viewactivitydesignationedit(id){
        this.sharedService.activitydesignationedit.next(id)
        this.activitydesign=false;
        this.activitydesignform=true;

      }

      getactivitydesignprevious(){
        if(this.activitydesign_has_previous == true){
        this.activitydesignationsearch('',this.activitydesign_currentpage-1)
          
        }
      }

      getactivitydesignnext(){
        if(this.activitydesign_has_next == true){
          this.activitydesignationsearch('',this.activitydesign_currentpage+1)
            
          }
      }

      getactivitydesignationclose(){
        this.ismakerCheckerButton = true;
        this.activitydesign=true;
        this.activitydesignform=false;
        this.activitydesignationsearch('',this.activitydesign_currentpage=1)

      }

      resetsharedservice(){
        this.sharedService.hsnedit.next('');
        this.sharedService.apCategoryEdit.next('')
        this.sharedService.subTaxEdit.next('')
        this.sharedService.taxEdit.next('')
        this.sharedService.taxRateEdit.next('')
        this.sharedService.bankEditValue.next('')
        this.sharedService.paymodeEditValue.next('')
        this.sharedService.bankBranchEditValue.next('')
        this.sharedService.productTypeEdit.next('')
        this.sharedService.uomEdit.next('')
        this.sharedService.customerCategoryEdit.next('')
        this.sharedService.productCategoryEdit.next('')
        this.sharedService.docgrpedit.next('')
        this.sharedService.productedit.next('')
        this.sharedService.apSubCategoryEdit.next('')
        this.sharedService.questypeedit.next('')
        this.sharedService.quesheaderedit.next('')
        this.sharedService.quesedit.next('')
        this.sharedService.venmapedit.next('')
        this.sharedService.activitydesignationedit.next('')
      }

      
      
      getriskcat(pageNumber = 1, pageSize = 10) {
        this.atmaService.getriskcat(pageNumber, pageSize)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.getriskcatList = datas;
            let datapagination = results["pagination"];
            this.getriskcatList = datas;
            if (this.getriskcatList.length >= 0) {
              this.risk_next = datapagination.has_next;
              this.risk_previous = datapagination.has_previous;
              this.riskindex = datapagination.index;
              this.isBankBranchPagination = true;
            } if (this.getriskcatList <= 0) {
              this.isBankBranchPagination = false;
            }
          })
      }
      risk_previousClick(){
        if(this.riskass_previous === true){
          this.getriskassesmentques(this.riskassindex - 1 , 10)
        }
      }
      risk_nextClick(){
        if(this.riskass_next === true){
          this.getriskassesmentques(this.riskassindex + 1 , 10)
        }
      }
      risksum_nextClick() {
        if (this.risk_next === true) {
    
          this.getriskcat(this.riskassindex + 1, 10)
        }
      }
    
      risksum_previousClick() {
        if (this.risk_previous === true) {
    
          this.getriskcat(this.riskindex - 1, 10)
        }
      }
      riskadd() {
        let risk_name = this.riskform.value.name
        let data = {
          "risk_name":risk_name,
         "id":this.riskeditid}
         this.spinner.show();
        this.atmaService.riskadd(this.riskeditid,data) 
          .subscribe((results) => {
            if(results !=="" && results !==null && results !==undefined ){
              if(this. riskeditid=="" ||this. riskeditid ==undefined || this. riskeditid==null ){
                this.notification.showSuccess("Successfully Added")
              }
              else{
                this.notification.showSuccess("Successfully Updated")
              }
              this.riskform.reset()
              this.getriskcat()
              this.spinner.hide();
              this.isupdate = false
            }
            else{
              this.notification.showError("Something Went Wrong")
            }
          })
      }
      public displayFnproduct(prd?: product): string | undefined {
   
        return prd ? prd.name : undefined;
      }
      public displayFnlabelt(prd?: labeltype): string | undefined {
   
        return prd ? prd.type : undefined;
      }
      createprod(){
        this.isprodscreen=true;
        this.isspecificationsummary=false;
        this.ismakemodelsumary=false;
        this.isotherattrbscreen=false;
        this.prformreset()
      }
      assetmakemodel(){
        this.ismakemodelsumary=true;
        this.isprodscreen=false;
        this.isspecificationsummary=false;
        this.isotherattrbscreen=false;
        this.fa_new_modelsummaryfunction();
      }
      assetspecification(){
        this.isspecificationsummary=true;
        this.ismakemodelsumary=false;
        this.isprodscreen=false;
        this.isotherattrbscreen=false;
        this.specificationsummaryfunction();
      }
      other_attributes(){
        this.isotherattrbscreen=true;
        this.isspecificationsummary=false;
        this.ismakemodelsumary=false;
        this.isprodscreen=false;
        this.other_attrb_summaryfunction()
      }
      fa_new_modelsummaryfunction(){
        let dta:any='page='+this.hasmodel_sum_page;
        if(this.makermodelformsummary.get('productname').value!=undefined && this.makermodelformsummary.get('productname').value!="" && this,this.makermodelformsummary.get('productname').value!=null && this,this.makermodelformsummary.get('productname').value!=undefined){
         dta=dta+"&code="+this.makermodelformsummary.get('productname').value.code+"&name="+this.makermodelformsummary.get('productname').value.name;
        }
        this.spinner.show();
        this.atmaService.all_get_fa_makemodel_create(dta).subscribe((result:any)=>{
          this.spinner.hide();
          if(result.code!=undefined && result.code!=""){
            this.toaster.warning(result.description);
          }
          else{
            this.modelsummary=result['data'];
            if(this.modelsummary.length>0){
              this.hasmodel_sum_next=result['pagination'].has_next;
              this.hasmodel_sum_pre=result['pagination'].has_previous;
              this.hasmodel_sum_page=result['pagination'].index;
            }
    
          }
        },
       (error:HttpErrorResponse)=>{
        this.spinner.hide();
        this.modelsummary=[];
       } 
        );
      }

      specificationsummaryfunction(){
        let dta:any='page='+this.hasspec_sum_page;
        if(this.specificationformsummary.get('productname').value!=undefined && this.specificationformsummary.get('productname').value!="" && this.specificationformsummary.get('productname').value!=null && this.specificationformsummary.get('productname').value!=undefined){
         dta=dta+"&code="+this.specificationformsummary.get('productname').value.code;
        }
        this.spinner.show();
        this.atmaService.fa_product_specificaitons_getall(dta).subscribe((result:any)=>{
          this.spinner.hide();
          if(result.code!=undefined && result.code!=""){
            this.toaster.warning(result.description);
            this.isspecificationdata=[];
          }
          else{
            this.isspecificationdata=result['data'];
            this.isspecificationdata=result['data'];
            if(this.isspecificationdata.length>0){
              this.hasspec_sum_next=result['pagination'].has_next;
              this.hasspec_sum_pre=result['pagination'].has_previous;
              this.hasspec_sum_page=result['pagination'].index;
            }
    
          }
        });
      }
      specificationnext(){
        console.log(this.hasspec_sum_next);
        if(this.hasspec_sum_next){
          this.specificationsummaryfunction_pagination(this.hasspec_sum_page+1)
        }
      }
      specificationpre(){
        console.log(this.hasspec_sum_pre);
        if(this.hasspec_sum_pre){
          this.specificationsummaryfunction_pagination(this.hasspec_sum_page-1)
        }
      }
      specificationsummaryfunction_pagination(num:number){
        let dta:any='page='+num;
        if(this.specificationformsummary.get('type').value!=undefined && this.specificationformsummary.get('type').value!="" && this.specificationformsummary.get('type').value!=null && this.specificationformsummary.get('type').value!=undefined){
         dta=dta+"&name="+this.specificationformsummary.get('type').value;
        }
        this.spinner.show();
        this.atmaService.fa_product_specificaitons_getall(dta).subscribe((result:any)=>{
          this.spinner.hide();
          if(result.code!=undefined && result.code!=""){
            this.toaster.warning(result.description);
            this.isspecificationdata=[];
          }
          else{
            this.isspecificationdata=result['data'];
            if(this.isspecificationdata.length>0){
              this.hasspec_sum_next=result['pagination'].has_next;
              this.hasspec_sum_pre=result['pagination'].has_previous;
              this.hasspec_sum_page=result['pagination'].index;
            }
    
          }
        },
        (error:HttpErrorResponse)=>{
          this.spinner.hide();
          this.isspecificationdata=[];
        }
        );
      }
      nextmodelsum(){
        if(this.hasmodel_sum_next){
          this.fa_makemodelsummaryfunction_pagination(this.hasmodel_sum_page+1);
        }
      }
       premodelsum(){
        if(this.hasmodel_sum_pre){
          this.fa_makemodelsummaryfunction_pagination(this.hasmodel_sum_page-1);
        }
      }
      fa_makemodelsummaryfunction_pagination(num:number){
        let dta:any='page='+num;
        if(this.makermodelformsummary.get('productname').value!=undefined && this.makermodelformsummary.get('productname').value!="" && this,this.makermodelformsummary.get('productname').value!=null && this,this.makermodelformsummary.get('productname').value!=undefined){
         dta=dta+"&code="+this.makermodelformsummary.get('productname').value.code+"&name="+this.makermodelformsummary.get('productname').value.name;
        }
        this.spinner.show();
        this.atmaService.all_get_fa_makemodel_create(dta).subscribe((result:any)=>{
          this.spinner.hide();
          if(result.code!=undefined && result.code!=""){
            this.toaster.warning(result.description);
          }
          else{
            this.modelsummary=result['data'];
            console.log(this.modelsummary);
            if(this.modelsummary.length>0){
              this.hasmodel_sum_next=result['pagination'].has_next;
              this.hasmodel_sum_pre=result['pagination'].has_previous;
              this.hasmodel_sum_page=result['pagination'].index;
            }
    
          }
        },
       (error:HttpErrorResponse)=>{
        this.spinner.hide();
       } 
        );
      }
      expandenbdata_new(data:any,ind:number){
    
        console.log(data);
        for(let i=0;i<this.isspecificationdata.length;i++){
          if(i==ind){
            this.isspecificationdata[i]['enb_pro']=!this.isspecificationdata[i]['enb_pro'];
            this.makeModelList_new=[];
          }
          
        }
      }
      expandenbdata(data:any,ind:number){
    
        console.log(data);
        for(let i=0;i<this.modelsummary.length;i++){
          if(i==ind){
            this.modelsummary[i]['enb_pro']=!this.modelsummary[i]['enb_pro'];
            this.makeModelList_new=[];
          }
          // else{
    
          // }
          // else{
          //   this.modelsummary[i]['enb_pro']=false;
          //   this.makeModelList_new=[];
          //   // return false;
          // }
        }
        (this.makermodelformchild.get('mainArray') as FormArray).clear();
        (this.makermodelformchild.get('specification_type') as FormArray).clear();
        let data_list:any=data.child_data;
        for(let i=0;i<data_list.length;i++){
          this.makeModelList_new.push({"type":data_list[i].label_name+"("+data_list[i].product_name+")-"+data_list[i].hierarchy_flag,"specification_type":data_list[i].specification_type,
          "configuration":data_list[i].configuration,'id':data_list[i].id,"product_code":data_list[i].product_code,"l_type":data_list[i].label_name});
        }
        
      } 
      modelsummaryfunction_reset(){
        this.makermodelformsummary.reset("");
        this.fa_new_modelsummaryfunction();
        this.fa_makemodelsummaryfunction_pagination(this.hasmodel_sum_page);
      }
      specificationsummaryfunction_reset(){
        this.specificationformsummary.reset('');
        this.specificationsummaryfunction();
      }

      
otherattbdata_array:Array<any>=[]
otherattb_page:number=1;
otherattb_next:boolean=true;
otherattb_prev:boolean=false;  
other_attrbsummary_reset(){
  this.otherattsummaryform.reset('');
  this.other_attrb_summaryfunction();
}
other_attrb_summaryfunction(){
  let dta:any='page='+this.otherattb_page;
  if(this.otherattsummaryform.get('productname').value!=undefined && this.otherattsummaryform.get('productname').value!="" && this.otherattsummaryform.get('productname').value!=null && this.otherattsummaryform.get('productname').value!=undefined){
    dta=dta+"&code="+this.otherattsummaryform.get('productname').value.code;
   }
 
  this.spinner.show();
  this.atmaService.otherattb_getall(dta).subscribe((result:any)=>{
    this.spinner.hide();
    if(result.code!=undefined && result.code!=""){
      this.toaster.warning(result.description);
      this.otherattbdata_array=[];
    }
    else{
      this.otherattbdata_array=result['data'];
      if(this.otherattbdata_array.length>0){
        this.otherattb_next=result['pagination'].has_next;
        this.otherattb_prev=result['pagination'].has_previous;
        this.otherattb_page=result['pagination'].index;
      }

    }
  });
}
expandenbdata_otherattb(data:any,ind:number){
  
  console.log(data);
  for(let i=0;i<this.otherattbdata_array.length;i++){
    if(i==ind){
      this.otherattbdata_array[i]['enb_pro']=!this.otherattbdata_array[i]['enb_pro'];
    }
    
  }
}      
other_attrb_summaryfunction_pagination(num:number){
  let dta:any='page='+num;
  // if(this.otherattsummaryform.get('type').value!=undefined && this.otherattsummaryform.get('type').value!="" && this.otherattsummaryform.get('type').value!=null && this.otherattsummaryform.get('type').value!=undefined){
  //  dta=dta+"&name="+this.otherattsummaryform.get('type').value;
  // }
  if(this.otherattsummaryform.get('productname').value!=undefined && this.otherattsummaryform.get('productname').value!="" && this.otherattsummaryform.get('productname').value!=null && this.otherattsummaryform.get('productname').value!=undefined){
    dta=dta+"&code="+this.otherattsummaryform.get('productname').value.code;
   }
  this.spinner.show();
  this.atmaService.otherattb_getall(dta).subscribe((result:any)=>{
    this.spinner.hide();
    if(result.code!=undefined && result.code!=""){
      this.toaster.warning(result.description);
      this.otherattbdata_array=[];
    }
    else{
      this.otherattbdata_array=result['data'];
      if(this.otherattbdata_array.length>0){
        this.otherattb_next=result['pagination'].has_next;
        this.otherattb_prev=result['pagination'].has_previous;
        this.otherattb_page=result['pagination'].index;
      }

    }
  },
  (error:HttpErrorResponse)=>{
    this.spinner.hide();
    this.otherattbdata_array=[];
  }
  );
}
nextpage_otherattb(){
  if(this.otherattb_next){
    this.other_attrb_summaryfunction_pagination(this.otherattb_page+1);
  }
}
prevpage_otherattb(){
  if(this.otherattb_prev){
    this.other_attrb_summaryfunction_pagination(this.otherattb_page-1);
  }
}



      getriskassesmentques(pageNumber = 1, pageSize = 10) {
        this.spinner.show();
        this.atmaService.getriskassesment(pageNumber, pageSize)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.spinner.hide();
            this.getriskassesmentList = datas;
            let datapagination = results["pagination"];
            this.getriskassesmentList = datas;
            if (this.getriskassesmentList.length >= 0) {
              this.riskass_next = datapagination.has_next;
              this.riskass_previous = datapagination.has_previous;
              this.riskassindex = datapagination.index;
            } 
          })
          this.spinner.hide();
      }

      riskassesment_nextClick() {
        if (this.riskass_next === true) {
    
          this.getriskassesmentques(this.riskindex + 1, 10)
        }
      }
    
      riskassesment_previousClick() {
        if (this.riskass_previous === true) {
  
          this.getriskassesmentques(this.riskindex - 1, 10)
        }
      }
      riskaseesmentadd(id) {
        let risk_name = this.riskassesmentform.value;
        // let riskId = this.riskassesmenteditid?.toString();
        let data = {
          "RiskScenario":risk_name.riskscen,
          "Description"  : risk_name.desc,
          "Response": risk_name.response,
          "id":this.riskassesmenteditid
        }
        if(id == 1){
          if(!this.riskassesmentform.value.riskscen || !this.riskassesmentform.value.desc || !this.riskassesmentform.value.response){
          this.notification.showWarning("Please Enter all the Fields!");
          return false;
        }
      }
        this.spinner.show();
        this.atmaService.riskassesmentadd(this.riskassesmenteditid,data) 
          .subscribe((results) => {
            if(results !=="" && results !==null && results !==undefined ){
              if(this. riskassesmenteditid=="" ||this. riskassesmenteditid ==undefined || this. riskassesmenteditid==null ){
                this.notification.showSuccess("Successfully Added");
                this.riskassesmentform.reset();
              }
              else{
                this.notification.showSuccess("Successfully Updated");
                this.riskassesmentform.reset();
              }
              this.riskassesmentform.reset()
              this.getriskassesmentques()
              this.spinner.hide();
              this.isupdate = false
            }
            else{
              this.notification.showError("Something Went Wrong");
              this.riskassesmentform.reset();
              this.spinner.hide();
            }
          })
      }
      
      riskassesmentedit(data ){
        this.riskassesmentform.patchValue({
          riskscen:data.riskscenario,
          desc: data.description,
          response:data.response
        })
        this.riskassesmenteditid=data.id
        this.isupdate=true
    
      }
      riskassesmentDelete(data){
        let confirm = window.confirm("Are you sure want to delete?");
        if(confirm){ 
        this.spinner.show();
      
        this.atmaService.riskassesmentDelete(data.id)
        .subscribe((results) => {
          if(results.message){
            this.notification.showSuccess('Successfully Deleted!');
            this.spinner.hide();
            this.getriskassesmentques();
          }
          else{
            this.notification.showError('Something Went Wrong!');
            this.spinner.hide();
            return false
          }
        })
      } 
      else {
        return false;
      }
    }
    riskaseesmentReset(){
      this.riskassesmentform.reset();
      this.isupdate = false;
    }

    uploadFile(){
      console.log("file",this.file)
        this.spinner.show();
        if (this.file) {
          this.atmaService.fileupload(this.file)
            .subscribe((results) => {
              if (results.status) {
                this.notification.showSuccess(results.message)
                this.file = '';
                this.riskassesmentform.get('file').reset();
                this.spinner.hide();
              } else {
                this.spinner.hide();
                if (results['description']) {
                  this.notification.showWarning(results['code'])
                this.riskassesmentform.reset();

                } else {
                  this.notification.showWarning('Unauthorized Request')
                }
                this.file = '';
                this.riskassesmentform.reset();

              }
            },
              error => {
                this.errorHandler.handleError(error);
                this.riskassesmentform.reset();
                this.spinner.hide();
              })
        }
        else {
          this.spinner.hide();
          this.riskassesmentform.reset();

          this.notification.showWarning('Please Choose a File !!')
        }
    }
    fileSelected(e){
      this.file = e.target.files[0];
    }
    categoryScroll() {
        setTimeout(() => {
          if (
            this.matproductsAutocomplete &&
            this.matproductsAutocomplete &&
            this.matproductsAutocomplete.panel
          ) {
            fromEvent(this.matproductsAutocomplete.panel.nativeElement, 'scroll')
              .pipe(
                map(x => this.matproductsAutocomplete.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(x => {
                const scrollTop = this.matproductsAutocomplete.panel.nativeElement.scrollTop;
                const scrollHeight = this.matproductsAutocomplete.panel.nativeElement.scrollHeight;
                const elementHeight = this.matproductsAutocomplete.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if (this.has_nextpro === true) {
                    this.atmaService.getproductpage(this.presentpagepro + 1,10,this.inputproduct.nativeElement.value)
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        if (this.productlistsummary.length >= 0) {
                          this.productlistsummary = this.productlistsummary.concat(datas);
                          this.has_nextpro = datapagination.has_next;
                          this.has_previouspro = datapagination.has_previous;
                          this.presentpagepro = datapagination.index;
                        }
                      })
                  }
                }
              });
          }
        });
      }
      productsepctypescroll() {
        setTimeout(() => {
          if (
            this.matproductsAutocomplete &&
            this.matproductsAutocomplete &&
            this.matproductsAutocomplete.panel
          ) {
            fromEvent(this.matproductsAutocomplete.panel.nativeElement, 'scroll')
              .pipe(
                map(x => this.matproductsAutocomplete.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(x => {
                const scrollTop = this.matproductsAutocomplete.panel.nativeElement.scrollTop;
                const scrollHeight = this.matproductsAutocomplete.panel.nativeElement.scrollHeight;
                const elementHeight = this.matproductsAutocomplete.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if (this.has_nextpro === true) {
                    this.atmaService.getproductpage(this.presentpagepro + 1,10,this.inputproduct.nativeElement.value)
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        if (this.productlist.length >= 0) {
                          this.productlist = this.productlist.concat(datas);
                          this.has_nextpro = datapagination.has_next;
                          this.has_previouspro = datapagination.has_previous;
                          this.presentpagepro = datapagination.index;
                        }
                      })
                  }
                }
              });
          }
        });
      }
      otherotributes_prod_scroll() {
        setTimeout(() => {
          if (
            this.matproductsAutocomplete &&
            this.matproductsAutocomplete &&
            this.matproductsAutocomplete.panel
          ) {
            fromEvent(this.matproductsAutocomplete.panel.nativeElement, 'scroll')
              .pipe(
                map(x => this.matproductsAutocomplete.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(x => {
                const scrollTop = this.matproductsAutocomplete.panel.nativeElement.scrollTop;
                const scrollHeight = this.matproductsAutocomplete.panel.nativeElement.scrollHeight;
                const elementHeight = this.matproductsAutocomplete.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if (this.has_nextpro === true) {
                    this.atmaService.getproductpage(this.presentpagepro + 1,10,this.inputproduct.nativeElement.value)
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        if (this.productlist.length >= 0) {
                          this.productlist = this.productlist.concat(datas);
                          this.has_nextpro = datapagination.has_next;
                          this.has_previouspro = datapagination.has_previous;
                          this.presentpagepro = datapagination.index;
                        }
                      })
                  }
                }
              });
          }
        });
      }
      productsepctypescrolls() {
        setTimeout(() => {
          if (
            this.matproductsAutocompletes &&
            this.matproductsAutocompletes &&
            this.matproductsAutocompletes.panel
          ) {
            fromEvent(this.matproductsAutocompletes.panel.nativeElement, 'scroll')
              .pipe(
                map(x => this.matproductsAutocompletes.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(x => {
                const scrollTop = this.matproductsAutocompletes.panel.nativeElement.scrollTop;
                const scrollHeight = this.matproductsAutocompletes.panel.nativeElement.scrollHeight;
                const elementHeight = this.matproductsAutocompletes.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if (this.has_nextpro === true) {
                    this.atmaService.getproductsearch(this.inputproducts.nativeElement.value,this.prform.value.code?this.prform.value.code:'',this.presentpagepro + 1)
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        if (this.productlist.length >= 0) {
                          this.productlist = this.productlist.concat(datas);
                          this.has_nextpro = datapagination.has_next;
                          this.has_previouspro = datapagination.has_previous;
                          this.presentpagepro = datapagination.index;
                        }
                      })
                  }
                }
              });
          }
        });
      }
      prodcompsummaryList: any=[];
      prodMappingSummary(){
        this.spinner.show();
        this.atmaService.getProdCompSummary().subscribe((result:any)=>{
          this.spinner.hide();
          if(result.code!=undefined && result.code!=""){
            this.toaster.warning(result.description);
            this.isspecificationdata=[];
            
          }
          else{
            this.prodcompsummaryList=result['data'];

            if(this.prodcompsummaryList.length>0){
              this.hasprod_comp_next=result['pagination'].has_next;
              this.hasprod_comp_pre=result['pagination'].has_previous;
              this.hasprod_comp_page=result['pagination'].index;
            }
    
          }
        });

      }
      chunkArray(arr: any[], size: number): any[][] {
  if (!arr || arr.length === 0) return [];
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
newStatus: any;
 getactiveprodComp(data: any) {
  if(data.status==1){
    this.newStatus=0;
  }
  else{
    this.newStatus=1;
  }
    let dta: any = { 'id': data?.is_product, 'status': this.newStatus, 'type': 'p' };
    this.spinner.show();
    this.atmaService.getactiveinactiveProdComp(dta).subscribe(datas => {
      this.spinner.hide();
      if (datas['status'] == 'success') {
        this.notification.showSuccess(datas['message']);
        this.prodMappingSummary();
        // this.resetapsubcat();
      }
      else {
        this.notification.showError(datas['description']);
      }
    },
      (error) => {
        this.notification.showError(error.status + error.statusText);
      }
    );
  }
  resetprodComp()
  {
    this.prodmappingSearchform.reset();
    this.prodMappingSummary();
  }
  dataprod:any;
  prodPagenumber =1;
  searchprodComp(){
    let val=this.prodmappingSearchform.value;
    let dta:any='page=1';
    if(val.productname === undefined || val.productname ==="" || val.productname ===null ){
       this.dataprod='';
     }else{
     
      this.dataprod = val?.productname?.id;
     }
     this.spinner.show();
      this.atmaService.getProdCompSummarySearch(this.hasprod_comp_page, this.dataprod).subscribe((result:any)=>{
          this.spinner.hide();
          if(result.code!=undefined && result.code!=""){
            this.toaster.warning(result.description);
            this.isspecificationdata=[];
            
          }
          else{
            this.prodcompsummaryList=result['data'];

            if(this.prodcompsummaryList.length>0){
              this.hasprod_comp_next=result['pagination'].has_next;
              this.hasprod_comp_pre=result['pagination'].has_previous;
              this.hasprod_comp_page=result['pagination'].index;
            }
    
          }
        });

  }
    nextClickprod() {
    if (this.hasprod_comp_next === true) {
      this.hasprod_comp_page= this.hasprod_comp_page + 1
      this.searchprodComp()
    }
  }

  previousClickprod() {
    if (this.hasprod_comp_pre === true) {
      this.hasprod_comp_page = this.hasprod_comp_page - 1
      this.searchprodComp()
    }
  }
productsepctypescrollparent() {
        setTimeout(() => {
          if (
            this.matproductsAutocompleteparent &&
            this.matproductsAutocompleteparent &&
            this.matproductsAutocompleteparent.panel
          ) {
            fromEvent(this.matproductsAutocompleteparent.panel.nativeElement, 'scroll')
              .pipe(
                map(x => this.matproductsAutocompleteparent.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(x => {
                const scrollTop = this.matproductsAutocompleteparent.panel.nativeElement.scrollTop;
                const scrollHeight = this.matproductsAutocompleteparent.panel.nativeElement.scrollHeight;
                const elementHeight = this.matproductsAutocompleteparent.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if (this.has_nextpro === true) {
                    this.atmaService.getproductsearch(this.parentproduct.nativeElement.value,this.prform.value.code?this.prform.value.code:'',this.presentpagepro + 1)
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        if (this.productlist.length >= 0) {
                          this.productlist = this.productlist.concat(datas);
                          this.has_nextpro = datapagination.has_next;
                          this.has_previouspro = datapagination.has_previous;
                          this.presentpagepro = datapagination.index;
                        }
                      })
                  }
                }
              });
          }
        });
      }
      productsepctypescrollchild() {
        setTimeout(() => {
          if (
            this.matproductsAutocompletechild &&
            this.matproductsAutocompletechild &&
            this.matproductsAutocompletechild.panel
          ) {
            fromEvent(this.matproductsAutocompletechild.panel.nativeElement, 'scroll')
              .pipe(
                map(x => this.matproductsAutocompletechild.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(x => {
                const scrollTop = this.matproductsAutocompletechild.panel.nativeElement.scrollTop;
                const scrollHeight = this.matproductsAutocompletechild.panel.nativeElement.scrollHeight;
                const elementHeight = this.matproductsAutocompletechild.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if (this.has_nextpro === true) {
                    this.atmaService.getproductsearch(this.childproduct.nativeElement.value,this.prform.value.code?this.prform.value.code:'',this.presentpagepro + 1)
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        if (this.productlist.length >= 0) {
                          this.productlist = this.productlist.concat(datas);
                          this.has_nextpro = datapagination.has_next;
                          this.has_previouspro = datapagination.has_previous;
                          this.presentpagepro = datapagination.index;
                        }
                      })
                  }
                }
              });
          }
        });
      }
      productsepctypesscrollchild() {
        setTimeout(() => {
          if (
            this.matproductssAutocompletechild &&
            this.matproductssAutocompletechild &&
            this.matproductssAutocompletechild.panel
          ) {
            fromEvent(this.matproductssAutocompletechild.panel.nativeElement, 'scroll')
              .pipe(
                map(x => this.matproductssAutocompletechild.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(x => {
                const scrollTop = this.matproductssAutocompletechild.panel.nativeElement.scrollTop;
                const scrollHeight = this.matproductssAutocompletechild.panel.nativeElement.scrollHeight;
                const elementHeight = this.matproductssAutocompletechild.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if (this.has_nextpro === true) {
                    this.atmaService.getproductsearch(this.childproducts.nativeElement.value,this.prform.value.code?this.prform.value.code:'',this.presentpagepro + 1)
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        if (this.productlist.length >= 0) {
                          this.productlist = this.productlist.concat(datas);
                          this.has_nextpro = datapagination.has_next;
                          this.has_previouspro = datapagination.has_previous;
                          this.presentpagepro = datapagination.index;
                        }
                      })
                  }
                }
              });
          }
        });
      }

      addprodform(){
        let vals = this.prodcompaddform.value;
        if(vals.product_id == null || vals.product_id == undefined || vals.product_id == ''){
          this.notification.showWarning("Please select Parent Product");
          return false;
        }
        if(vals.child_id == null || vals.child_id == undefined || vals.child_id == ''){
          this.notification.showWarning("Please select Sub Component Product");
          return false;
        }
        let data = {
          "product_id": vals?.product_id?.id,
          "child_id": vals?.child_id?.id
        }
        this.spinner.show();
        this.atmaService.addprodcomp(data)
        .subscribe((results) => {
          this.spinner.hide();
          if(!results?.code){
            this.notification.showSuccess("Product Component added successfully");
             this.modalcloseap.nativeElement.click();       
            this.isProductCompMapping = true;
            this.isProductCompMappingEdit = false;
              
            this.prodcompaddform.reset();
            this.prodmappingSearchform.reset();
            this.ismakerCheckerButton = true;
             this.prodMappingSummary();
            
          }
          else{
             this.notification.showError(results.description);
          }
        });
      }
      closepopups(){
            this.prodcompaddform.reset();
            this.prodmappingSearchform.reset();
            this.isProductCompMappingpopup = false;
            this.isProductCompMapping = true;
            this.isProductCompMappingEdit = false;
            this.modalcloseap.nativeElement.click(); 
            this.ismakerCheckerButton = true;  
            this.prodMappingSummary();
}
      prodId: any;
      editdata: any;
      isProductCompMappingEdit: boolean = false;
      editprodcomp(data:any){
        this.presentpagechild=1;
        this.getChildprodlist(data);
        this.editdata = data;
        this.isProductCompMappingEdit = true;
        this.isProductCompMapping = false;
        this.prodId = data?.is_product;
        this.prodmappingEditform.patchValue({
          product_id: data?.name,
      
        })
      }
      addnewprodform(){
        let vals = this.prodmappingEditform.value;
        // if(vals.product_id == null || vals.product_id == undefined || vals.product_id == ''){
        //   this.notification.showWarning("Please select Parent Product");
        //   return false;
        // }
        if(vals.child_id == null || vals.child_id == undefined || vals.child_id == ''){
          this.notification.showWarning("Please select Sub Component Product");
          return false;
        }
        let data = {
          "product_id": this.prodId,
          "child_id": vals?.child_id?.id
        }
        this.spinner.show();
        this.atmaService.addprodcomp(data)
        .subscribe((results) => {
          this.spinner.hide();
          if(!results.code ){
            this.notification.showSuccess("Product Component added successfully");
            this.prodMappingSummary();
            this.prodcompaddform.reset();
            this.getChildprodlist(this.editdata);
            this.ismakerCheckerButton = true;
          }
          else {
            this.toaster.warning(results.description);
            this.isspecificationdata=[];
            
          }
        });
      }
      childprodlist: any;
      has_nextchild: boolean = false;
      has_previouschild: boolean = false
      presentpagechild= 1;

      getChildprodlist(datas) {
        this.spinner.show()
        this.atmaService.getChildprodlist(datas?.is_product, this?.presentpagechild).subscribe((result:any)=>{
           this.spinner.hide()
          if(result.code!=undefined && result.code!=""){
            this.toaster.warning(result.description);
            this.childprodlist=[];
          }
          else{
            this.childprodlist=result['data'];
             let datapagination = result["pagination"];
                        if (this.childprodlist.length >= 0) {
                          // this.childprodlist = this.childprodlist.concat(this.childprodlist);
                          this.has_nextchild = datapagination.has_next;
                          this.has_previouschild = datapagination.has_previous;
                          this.presentpagechild = datapagination.index;
                        }
          } 
      })
    }
  getactiveprod(data: any) {
  if(data.status==1){
    this.newStatus=0;
  }
  else{
    this.newStatus=1;
  }
    let dta: any = { 'id': data?.id, 'status': this.newStatus, 'type': 'c' };
    this.spinner.show();
    this.atmaService.getactiveinactiveProdComp(dta).subscribe(datas => {
      this.spinner.hide();
      if (datas['status'] == 'success') {
        this.notification.showSuccess(datas['message']);
        this.getChildprodlist(this.editdata);
        this.prodMappingSummary();
        // this.resetapsubcat();
      }
      else {
        this.notification.showError(datas['description']);
      }
    },
      (error) => {
        this.notification.showError(error.status + error.statusText);
      }
    );
  }
  gottoMainSummary(){
    this.isProductCompMappingEdit = false;
    this.isProductCompMapping = true;
    this.prodcompaddform.reset();
    this.prodmappingEditform.reset();
  }
  previousClickchild()
  {
    this.presentpagechild = this.presentpagechild - 1
    this.getChildprodlist(this.editdata);
  }
  nextClickchild(){
    this.presentpagechild= this.presentpagechild + 1
    this.getChildprodlist(this.editdata);
  }


}
export interface catlistss {
  id: string;
  name: string;
}
class apsubcatSearchtype {
  name: string;
  no: string;
  category_id: any;
}