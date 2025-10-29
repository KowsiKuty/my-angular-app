import { Component, OnInit, EventEmitter, Output,  ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators,FormArray } from '@angular/forms';
import { AtmaService } from '../atma.service'
import { NotificationService } from 'src/app/service/notification.service';
import { ToastrService } from 'ngx-toastr'
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize,takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, from, fromEvent} from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';

export interface ProductCategory {
  id: string;
  name: string;
}
export interface ProductType {
  id: string;
  name: string;
}
export interface UOM {
  id: string;
  name: string;
}
export interface Apcategory {
  id: string;
  name: string;
}
export interface Apsubcategory {
  id: string;
  name: string;
}
export interface producttype{
  id:string;
  name:string
}
export interface productcategory{
  id:string;
  product_category:string;
}
export interface productsubcategory{
  id:string;
  product_subcategory:string;
}
export interface hsncodedata{
  id:string;
  code:string;
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
export interface pdt_type{
  id:string;
  name:string;
}
interface status {
  value: string;
}
interface ptype_depen{
  value:string;
}
@Component({
  selector: 'app-productmaster',
  templateUrl: './productmaster.component.html',
  styleUrls: ['./productmaster.component.scss']
})
export class ProductmasterComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  productForm: FormGroup;
  productcatlist: Array<ProductCategory>;
  producttypelist: Array<ProductType>;
  categorylist: Array<Apcategory>;
  subcatlist: Array<Apsubcategory>;
  // categorylist: any;
  // subcatlist: any;
  uomlist: Array<UOM>;
  hsnlist: any;
  has_next = true;
  has_previous = true;
  uom_next = true;
  uom_previous = true;
  ptype_next = true;
  ptype_previous = true;
  cat_next = true;
  cat_previous = true;
  subcat_next = true;
  subcat_previous = true;
  currentpage: number = 1;
  currentpagept: number = 1; 
  currentpageuom: number = 1;
  currentpagecat: number = 1;  
  currentpagesubcat: number = 1;  
  isLoading = false;
  disableSubmit = true;
  productcategorydetails:any=FormGroup;
  poduct_typeform:any=FormGroup;
  productsubcatdetails:any=FormGroup;
  SpecificationForm:any=FormGroup;
  specification:any=FormGroup;
  producttypearray:Array<any>=[];
  prodcutcategorylist:Array<any>=[];
  productsubcatlist:Array<any>=[];
  productspecificationArray:Array<any>=[];
  producthsndata:Array<any>=[];
  has_productcategorypre:boolean=false;
  has_productcategorynext:boolean=false;
  has_productcategorypage:number=1;

  has_productsubcategorypre:boolean=false;
  has_productsubcategorynext:boolean=false;
  has_productsubcategorypage:number=1;
  has_specificationpre:boolean=false;
  has_specificationnext:boolean=false;
  has_specificationpage:any=1;
  product_isblocked:boolean=false;
  product_isrcm:boolean=false;
  has_producthsnnxt:boolean=false;
  has_producthsnpre:boolean=false;
  has_producthsnpage:any=1;
  table_visible:boolean=false;
  table_data:Array<any>=[];
  producttradingiyem:any={'Yes':1,"No":0}
  selected='No';
  makemodule='No'
  makemodule_value:any={'Yes':1,'No':0}
  producttype_data={'Goods & Service':1,'Goods':2,'Service':3,'Hardware':4,'Software':5,'Component':6,'IT Related Services':7};
  isdisablenav:boolean=false;
  parent_enb:boolean=false;
  child_enb:boolean=false;
  ismakemodelsumary:boolean=false;
  ismakemodel:boolean=false;
  isspecification:boolean=false;
  isspecificationsummary:boolean=false;
  isotherattrb_summary:boolean=false;
  isotherattrb_creation:boolean=false;
  isproduct:boolean=true;
  makermodelformsummary:any=FormGroup
  productlist :Array<any>=[];
  product_typelist_new:Array<any>=[];
  page_pdt_type:number=1;
  prev_page_pdt_type:boolean=false;
  next_page_pdt_type:boolean=false;
  productlistsummary:Array<any>=[];
  modelsummary:Array<any>=[];
  makeModelList_new:Array<any>=[];
  labelnamelist:Array<any>=[];
  specificationsummary:Array<any>=[];
  isspecificationdata:Array<any>=[];
  matDialogparentData:any={};
  hasmodel_sum_next:boolean=false;
  hasmodel_sum_pre:boolean=false;
  hasmodel_sum_page:number=1;
  has_nextpro :boolean=false;
  has_previouspro :boolean=false;
  presentpagepro:number = 1;
  hasspec_sum_next:boolean=false;
  hasspec_sum_pre:boolean=false;
  hasspec_sum_page:number=1;
  makermodelformsummary_array:any=FormGroup;
  specificationformsummary:any=FormGroup;
  specificationform_fa_new:any=FormGroup;
  makermodelformchild:any=FormGroup;
  fa_makemodel_new_form:any=FormGroup;
  specificationform:any=FormGroup;
  makermodelform:any=FormGroup;
  child_dataproduct_code:any;
  child_dataproduct_name:any;
  child_daatparent_id:any;
  yesorno:any;
  @ViewChild('modalclose') modalclose:ElementRef;
  @ViewChild('modalclose_2') modalclose_2:ElementRef;
  @ViewChild('modalclose_3') modalclose_3:ElementRef;
  @ViewChild('catgorydatascroll') matproductcategory:MatAutocomplete;
  @ViewChild('productcategorydatavalue') paroductcategoryinput:any;
  @ViewChild('specificationtye') matspecication:MatAutocomplete;
  @ViewChild('specification') specificationinput:any;

  @ViewChild('subcatgorydatascroll') matproductsubcategory:MatAutocomplete;
  @ViewChild('productsubcategorydatavalue') paroductsubcategoryinput:any;

  @ViewChild('apcathsn') matproducthsn:MatAutocomplete;
  @ViewChild('hsninput') paroducthsnInput:any;

  @ViewChild('pdtcat') matproductcatAutocomplete: MatAutocomplete;
  @ViewChild('productcatInput') productcatInput: any;
  
  @ViewChild('pdttype') matproducttypeAutocomplete: MatAutocomplete;
  @ViewChild('producttypeInput') producttypeInput: any;

  @ViewChild('uomm') matAutocomplete: MatAutocomplete;
  @ViewChild('uomInput') uomInput: any;

  @ViewChild('apcat') matcatAutocomplete: MatAutocomplete;
  @ViewChild('apcaatInput') apcaatInput: any;

  @ViewChild('apsubcat') matsubcatAutocomplete: MatAutocomplete;
  @ViewChild('apsubcaatInput') apsubcaatInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  constructor(private formbuilder: FormBuilder, private atmaService: AtmaService,private dialog: MatDialog,
    private notification: NotificationService, private toaster: ToastrService,private spinner:NgxSpinnerService,) { }

  ngOnInit(): void {
    this.productForm = this.formbuilder.group({

      name: new FormControl('', [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
      uom_id: ['', Validators.required],
      hsn_id: ['', Validators.required],
      unitprice: ['1', Validators.required],
      weight: ['1', Validators.required],
      productcategory_id: ['', Validators.required],
      producttype_id: ['', Validators.required],
      category_id: ['', Validators.required],
      subcategory_id: ['', Validators.required],
      product_code:['',Validators.required],
      product_type:['',Validators.required],
      product_main_cat:['',Validators.required],
      product_subcat:['',Validators.required],
      product_tradingitem:[this.selected,Validators.required],
      checkbox:['',Validators.required],
      specificationstype:['',Validators.required],
      configuration:['',Validators.required],
      specificationed:['',Validators.required],
      product_isblocked:['',Validators.required],
      product_isrcm:['',Validators.required],
      make_module:[this.makemodule,Validators.required]
    });
    this.poduct_typeform=this.formbuilder.group({
      name:new FormControl('')
    })
    this.productcategorydetails=this.formbuilder.group({
      namess:['',Validators.required],
      productstockimpact:['',Validators.required],
      productdivision:['',Validators.required]
    });
    this.productsubcatdetails=this.formbuilder.group({
      productcat:['',Validators.required],
      productcatname:['',Validators.required]
    });
    console.log('one');
    this.specification=this.formbuilder.group({
      specificationed:['',Validators.required]
    });
    let pckeyvalue: String = "";
    // this.getprocatValue(pckeyvalue);
    console.log('2');
    this.SpecificationForm=this.formbuilder.group({
      specificationed:['',Validators.required]
    })
    this.makermodelform=this.formbuilder.group({
      productname:new FormControl(""),
      labelname:new FormControl(""),
      "labeltype":new FormControl(""),
      
      "mainArray":this.formbuilder.array([
        this.formbuilder.group({
          "proname":new FormControl(""),
          "lbname":new FormControl(""),
          "lbtype":new FormControl(""),
          "main_enb":false
        })
      ])

    });
    this.specificationform_fa_new=this.formbuilder.group({
      "productname":new FormControl(""),
      "key_list":this.formbuilder.array([
        this.formbuilder.group({
          "data":new FormControl(""),
          "main_enb":new FormControl(false),
          "data_value_n":new FormControl(""),
          "values_list":this.formbuilder.array([
            this.formbuilder.group({
              "data_value":new FormControl(""),
              "main_enb":new FormControl(false)
            })
          ])
        })
      ])
    });
    this.creationform_otherattrb = this.formbuilder.group({
        "productname":new FormControl(''),
        "key_list":this.formbuilder.array([
          this.formbuilder.group({
            "data":new FormControl(''),
            "main_enb":new FormControl(false),
            "data_value_n":new FormControl(''),
            "flag":new FormControl(),
            "value_list":this.formbuilder.array([
              this.formbuilder.group({
                "data_value":new FormControl(''),
                "main_enb":new FormControl(false),
              })
            ])
          })
        ])
      });
      (((this.creationform_otherattrb.get("key_list") as FormArray).at(0) as FormGroup).get('value_list')as FormArray).clear();
      // (this.creationform_otherattrb.get("key_list") as FormArray).clear()

      this.creationform_addattributes = this.formbuilder.group({
        "product_type":new FormControl(''),
        "key_list":this.formbuilder.array([
          this.formbuilder.group({
            "data":new FormControl(''),
            "main_enb":new FormControl(false),
            "data_value_n":new FormControl(''),
            "flag":new FormControl(),
            "value_list":this.formbuilder.array([
              this.formbuilder.group({
                "data_value":new FormControl(''),
                "main_enb":new FormControl(false),
              })
            ])
          })
        ])
      });
      (((this.creationform_addattributes.get("key_list") as FormArray).at(0) as FormGroup).get('value_list')as FormArray).clear();
      // (this.creationform_otherattrb.get("key_list") as FormArray).clear()
    
    (((this.specificationform_fa_new.get("key_list") as FormArray).at(0) as FormGroup).get('values_list') as FormArray).clear();
    (this.specificationform_fa_new.get("key_list") as FormArray).clear();
    this.fa_makemodel_new_form=this.formbuilder.group({
      productname:new FormControl(""),
      make_id:new FormControl(0),
      labelname:new FormControl(""),
      "labeltype":new FormControl(""),
      "main_enb":new FormControl(false),
      
      "mainArray":this.formbuilder.array([
        this.formbuilder.group({
          
          "lbname":new FormControl(""),
          "lbtype":new FormControl(""),
          "main_enb":false,
          "model_array":this.formbuilder.array([
            this.formbuilder.group({
              "id":new FormControl(0),
              "main_enb":false,
              "name":new FormControl("")
            })
          ])
        })
      ])

    });
    
    (((((this.fa_makemodel_new_form.get("mainArray") as FormArray))).at(0) as FormGroup).get('model_array') as FormArray).clear();
    (this.fa_makemodel_new_form.get("mainArray") as FormArray).clear();
    this.makermodelformchild=this.formbuilder.group({
      productname:new FormControl(""),
      labelname:new FormControl(""),
      "labeltype":new FormControl(""),
      "configuration":new FormControl(""),
      "label_group":new FormControl(""),
      "label_type":new FormControl(""),
      "mainArray":this.formbuilder.array([
        this.formbuilder.group({
          "proname":new FormControl(""),
          "lbname":new FormControl(""),
          "lbtype":new FormControl(""),
          "main_enb":false,
          "specification_type":this.formbuilder.array([
            this.formbuilder.group({
              "spec_name":new FormControl("")
            })
          ]),
          "Configuration_type":this.formbuilder.array([
            this.formbuilder.group({
              "config_name":new FormControl("")
            })
          ])
        })
      ]),
      "specification_type":this.formbuilder.array([
        this.formbuilder.group({
          "spec_name":new FormControl("")
        })
      ])

    });
    this.makermodelformsummary=this.formbuilder.group({
      productname:new FormControl(""),
      labelname:new FormControl(""),
      "labeltype":new FormControl("")

    });
    this.makermodelformsummary_array=this.formbuilder.group({
      "productname":new FormControl(""),
      "labelname":new FormControl(""),
      "labeltype":new FormControl(""),
      "mainArray":this.formbuilder.array([
        this.formbuilder.group({
          "proname":new FormControl(""),
          "lbname":new FormControl(""),
          "lbtype":new FormControl(""),
          "main_enb":false,
          
          "subarr":this.formbuilder.array([
            this.formbuilder.group({
              "subproname":new FormControl(""),
              "sublbname":new FormControl(""),
              "sublbtype":new FormControl(""),
              "sub_enb":false
            })
          ]),
          
        })
      ])

    });
    this.makermodelformsummary_array=this.formbuilder.group({
      "productname":new FormControl(""),
      "labelname":new FormControl(""),
      "labeltype":new FormControl(""),
      "mainArray":this.formbuilder.array([
        this.formbuilder.group({
          "proname":new FormControl(""),
          "lbname":new FormControl(""),
          "lbtype":new FormControl(""),
          "lid":new FormControl(""),
          "main_enb":false,
          "subarr":this.formbuilder.array([
            this.formbuilder.group({
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
    this.specificationform=this.formbuilder.group({
      'type':new FormControl("")
    });
    this.specificationformsummary=this.formbuilder.group({
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
    this.specificationform_fa_new.get('productname').valueChanges
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
      this.fa_makemodel_new_form.get('productname').valueChanges
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




  this.creationform_otherattrb.get('productname').valueChanges
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
  this.otherattsummaryform=this.formbuilder.group({
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

  this.creationform_addattributes.get('product_type').valueChanges
  .pipe(
    debounceTime(100),
    distinctUntilChanged(),
    tap(() => {
      this.isLoading = true;
    }),
    switchMap(value => this.atmaService.getproduct_type_new(1,  value)
      .pipe(
        finalize(() => {
          this.isLoading = false
        }),
      )
    )
  )
  .subscribe((results: any[]) => {
    let datas = results["data"];
    this.product_typelist_new = datas;
  });


  this.productForm.get('product_type').valueChanges
  .pipe(
    debounceTime(100),
    distinctUntilChanged(),
    tap(() => {
      this.isLoading = true;
    }),
    switchMap(value => this.atmaService.getproduct_type_new(1,  value)
      .pipe(
        finalize(() => {
          this.isLoading = false
        }),
      )
    )
  )
  .subscribe((results: any[]) => {
    let datas = results["data"];
    this.producttypearray = datas;
  });

    this.productcategorydetails.get('productdivision').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.atmaService.getproduct_type_new(1,value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.producttypearray = datas;
    });
    // this.productForm.get('product_type').valueChanges
    // .pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(() => {
    //     this.isLoading = true;
    //     console.log('inside tap')

    //   }),
    //   switchMap(value => this.atmaService.getproductcategorydata(this.productForm.get('product_type').value.id,value,1)
    //     .pipe(
    //       finalize(() => {
    //         this.isLoading = false
    //       }),
    //     )
    //   )
    // )
    // .subscribe((results: any[]) => {
    //   let datas = results["data"];
    //   this.producttypearray = datas;
    // });
    // console.log('3');
    // this.productForm.get('product_subcat').valueChanges
    // .pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(() => {
    //     this.isLoading = true;
    //     console.log('inside tap')

    //   }),
    //   switchMap(value => this.atmaService.getproductsubcategorydata(this.productForm.get('product_main_cat').value.id,this.productForm.get('product_subcat').value,1)
    //     .pipe(
    //       finalize(() => {
    //         this.isLoading = false
    //       }),
    //     )
    //   )
    // )
    // .subscribe((results: any[]) => {
    //   let datas = results["data"];
    //   this.productsubcatlist = datas;

    // });
    console.log('4');
    // this.productForm.get('specificationstype').valueChanges
    // .pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(() => {
    //     this.isLoading = true;
    //     console.log('inside tap')

    //   }),
    //   switchMap(value => this.atmaService.createproductspecification(this.productForm.get('product_main_cat').value.id,this.productForm.get('specificationstype').value,1)
    //     .pipe(
    //       finalize(() => {
    //         this.isLoading = false
    //       }),
    //     )
    //   )
    // )
    // .subscribe((results: any[]) => {
    //   let datas = results["data"];
    //   this.productspecificationArray = datas;

    // });
    console.log('5');
    this.productForm.get('productcategory_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.atmaService.get_productCat(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productcatlist = datas;

      });
      console.log('6');
      // this.productsubcatdetails.get('productcat').valueChanges
      // .pipe(
      //   debounceTime(100),
      //   distinctUntilChanged(),
      //   tap(() => {
      //     this.isLoading = true;
      //     console.log('inside tap')

      //   }),
      //   switchMap(value => this.atmaService.getproductcategorydata(this.productForm.get('product_type').value.id,value, 1)
      //     .pipe(
      //       finalize(() => {
      //         this.isLoading = false
      //       }),
      //     )
      //   )
      // )
      // .subscribe((results: any[]) => {
      //   let datas = results["data"];
      //   this.productcatlist = datas;

      // });
      console.log('7');
    let ptkeyvalue: String = "";
    this.getprotypeValue(ptkeyvalue);
    console.log('8');
    this.productForm.get('producttype_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.atmaService.get_productType(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.producttypelist = datas;

      });
      console.log('9');
      this.productForm.get('hsn_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.atmaService.createhsnproductdetails(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.producthsndata = datas;

      });
      console.log('10');
    let uomkeyvalue: String = "";
    this.getUOMValue(uomkeyvalue);
    console.log('11');
    this.productForm.get('uom_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),

        switchMap(value => this.atmaService.getuom_LoadMore(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.uomlist = datas;

      });
      console.log('12');
      let keyvalue: String = "";
    this.getApcateValue(keyvalue);
    console.log('13');
    this.productForm.get('category_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.atmaService.getapcat_LoadMore(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categorylist = datas;

      });
      console.log('14');
      let kvalue: String = "";
    // this.getApSubcateValue(kvalue);
    console.log('15');
    this.productForm.get('subcategory_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.atmaService.getapsubcat(this.productForm.get('category_id').value.id+'&query='+value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subcatlist = datas;

      })
      console.log('16');
    this.getHSNValue();
  }
  public displayFnPdtcategory(pdtcat?: ProductCategory): string | undefined {
    console.log('id', pdtcat.id);
    console.log('name', pdtcat.name);
    return pdtcat ? pdtcat.name : undefined;
  }

  get pdtcat() {
    return this.productForm.value.get('productcategory_id');
  }
  public displayFnProducttype(pdttype?: ProductType): string | undefined {
    console.log('id', pdttype.id);
    console.log('name', pdttype.name);
    return pdttype ? pdttype.name : undefined;
  }

  get pdttype() {
    return this.productForm.value.get('producttype_id');
  }
  public displayFnUOM(uomm?: UOM): string | undefined {
    console.log('id', uomm.id);
    console.log('name', uomm.name);
    return uomm ? uomm.name : undefined;
  }

  get uomm() {
    return this.productForm.value.get('uom_id');
  }
  public displayFnApcategory(apcat?: Apcategory): string | undefined {
    console.log('id', apcat.id);
    console.log('name', apcat.name);
    return apcat ? apcat.name : undefined;
  }
  public displatproductcategory(data? : productcategory): string | undefined{
    return data ? data.product_category : undefined;
  }
  public displayproductsubcategory(data ?:productsubcategory):string | undefined{
    return data ? data.product_subcategory:undefined;
  }
  get apcat() {
    return this.productForm.value.get('category_id');
  }
  public displayFnApsubcategory(apsubcat?: Apcategory): string | undefined {
    console.log('id', apsubcat.id);
    console.log('name', apsubcat.name);
    return apsubcat ? apsubcat.name : undefined;
  }
  public displayhsncodeData(data ?:hsncodedata):string | undefined{
    return data ?data.code:undefined;
  }
  public displayproducttype(producttype?:producttype):string | undefined{
    return producttype ? producttype.name : undefined;
  }
  get apsubcat() {
    return this.productForm.value.get('subcategory_id');
  }
 
  getprocatValue(pckeyvalue) {
    this.atmaService.getproductcatdropdown(pckeyvalue)
      .subscribe(result => {
        this.productcatlist = result['data']
        console.log("procat", this.productcatlist)
      })
  }
  getprotypeValue(ptkeyvalue) {
    this.atmaService.getproducttypedropdown(ptkeyvalue)
      .subscribe(result => {
        this.producttypelist = result['data']
        console.log("protype", this.producttypelist)
      })
  }
  getUOMValue(uomkeyvalue) {
    this.atmaService.getuom_Search(uomkeyvalue)
      .subscribe(result => {
        this.uomlist = result['data']
        console.log("uom", this.uomlist)
      })
  }
  
  getHSNValue() {
    this.atmaService.gethsn()
      .subscribe(result => {
        this.hsnlist = result['data']
        console.log("hsn", this.hsnlist)
      })
  }
  getApcateValue(keyvalue) {
    this.atmaService.getapcatdropdown(keyvalue)
      .subscribe(result => {
        this.categorylist = result['data']
        console.log("cat", this.categorylist)
      })
  }
  PdtcategoryScroll() {
    setTimeout(() => {
      if (
        this.matproductcatAutocomplete &&
        this.autocompleteTrigger &&
        this.matproductcatAutocomplete.panel
      ) {
        fromEvent(this.matproductcatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matproductcatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matproductcatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matproductcatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matproductcatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaService.get_productCat(this.productcatInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.productcatlist = this.productcatlist.concat(datas);
                    if (this.productcatlist.length >= 0) {
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
  ProducttypeScroll() {
    setTimeout(() => {
      if (
        this.matproducttypeAutocomplete &&
        this.autocompleteTrigger &&
        this.matproducttypeAutocomplete.panel
      ) {
        fromEvent(this.matproducttypeAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matproducttypeAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matproducttypeAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matproducttypeAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matproducttypeAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.ptype_next === true) {
                this.atmaService.get_productType(this.producttypeInput.nativeElement.value, this.currentpagept + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.producttypelist = this.producttypelist.concat(datas);
                    if (this.producttypelist.length >= 0) {
                      this.ptype_next = datapagination.has_next;
                      this.ptype_previous = datapagination.has_previous;
                      this.currentpagept = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  UOMScroll() {
    setTimeout(() => {
      if (
        this.matAutocomplete &&
        this.autocompleteTrigger &&
        this.matAutocomplete.panel
      ) {
        fromEvent(this.matAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.uom_next === true) {
                this.atmaService.getuom_LoadMore(this.uomInput.nativeElement.value, this.currentpageuom + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.uomlist = this.uomlist.concat(datas);
                    if (this.uomlist.length >= 0) {
                      this.uom_next = datapagination.has_next;
                      this.uom_previous = datapagination.has_previous;
                      this.currentpageuom = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  ApcategoryScroll() {
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
              if (this.cat_next === true) {
                this.atmaService.getapcat_LoadMore(this.apcaatInput.nativeElement.value, this.currentpagecat + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.categorylist = this.categorylist.concat(datas);
                    if (this.categorylist.length >= 0) {
                      this.cat_next = datapagination.has_next;
                      this.cat_previous = datapagination.has_previous;
                      this.currentpagecat = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  ApsubcategoryScroll() {
    setTimeout(() => {
      if (
        this.matsubcatAutocomplete &&
        this.autocompleteTrigger &&
        this.matsubcatAutocomplete.panel
      ) {
        fromEvent(this.matsubcatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsubcatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsubcatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsubcatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsubcatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.subcat_next === true) {
                this.atmaService.getapsubcat_LoadMore(this.apsubcaatInput.nativeElement.value, this.currentpagesubcat + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.subcatlist = this.subcatlist.concat(datas);
                    if (this.subcatlist.length >= 0) {
                      this.subcat_next = datapagination.has_next;
                      this.subcat_previous = datapagination.has_previous;
                      this.currentpagesubcat = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
   productnamedisplay(){
     this.productForm.patchValue({
      'producttype_id':this.productForm.get('name').value
     })
   }
  
  productCreateForm() {
    console.log(this.productForm.get('product_isrcm').value?"Y":"N");
    console.log(this.productForm.get('product_isblocked').value?"Y":"N");
    console.log(this.productForm.value);
    // if(this.productForm.get('product_code').value==null || this.productForm.get('product_code').value==undefined || this.productForm.get('product_code').value==""){
    //   this.notification.showWarning('please Select The Product Code');
    //   return false;
    // }
    this.yesorno=this.productForm.get('make_module').value
    if(this.productForm.get('product_type').value==null || this.productForm.get('product_type').value=='' || this.productForm.get('product_type').value==undefined){
      this.notification.showWarning('please Select The Product Type');
      return false;
    }
    if(this.productForm.get('product_main_cat').value== '' || this.productForm.get('product_main_cat').value==null || this.productForm.get('product_main_cat').value.id==undefined){
      this.notification.showWarning('please Select The Product Main Category');
      return false;
    }
    if(this.productForm.get('product_subcat').value== '' || this.productForm.get('product_subcat').value==null || this.productForm.get('product_subcat').value.id==undefined){
      this.notification.showWarning('please Select The Product SubCategory');
      return false;
    }
    if(this.productForm.get('name').value== '' || this.productForm.get('name').value==null || this.productForm.get('name').value==undefined){
      this.notification.showWarning('please Enter The ProductName');
      return false;
    }
    if(this.productForm.get('product_tradingitem').value== '' || this.productForm.get('product_tradingitem').value==null || this.productForm.get('product_tradingitem').value==undefined){
      this.notification.showWarning('please Select The Product Trading Item');
      return false;
    }
    // if(this.productForm.get('hsn_id').value== '' || this.productForm.get('hsn_id').value==null || this.productForm.get('product_tradingitem').value==undefined){
    //   this.notification.showWarning('please Select The Product Trading Item');
    //   return false;
    // }
    if(this.productForm.get('hsn_id').value== '' || this.productForm.get('hsn_id').value==null || this.productForm.get('hsn_id').value.id==undefined){
      this.notification.showWarning('please Select The HSN');
      return false;
    }
    if(this.productForm.get('category_id').value== '' || this.productForm.get('category_id').value==null || this.productForm.get('category_id').value.id==undefined){
      this.notification.showWarning('please Select The ApCategory');
      return false;
    }
    if(this.productForm.get('subcategory_id').value== '' || this.productForm.get('subcategory_id').value==null || this.productForm.get('subcategory_id').value.id==undefined){
      this.notification.showWarning('please Select The ApSubCategory');
      return false;
    }
    if(this.productForm.get('uom_id').value== '' || this.productForm.get('uom_id').value==null || this.productForm.get('uom_id').value.id==undefined){
      this.notification.showWarning('please Select The UOM');
      return false;
    }
    if(this.productForm.get('unitprice').value== '' || this.productForm.get('unitprice').value==null || this.productForm.get('unitprice').value==undefined){
      this.notification.showWarning('please Enter The UnitPrice');
      return false;
    }
    if(this.productForm.get('weight').value== '' || this.productForm.get('weight').value==null || this.productForm.get('weight').value==undefined){
      this.notification.showWarning('please Enter The Weight');
      return false;
    }
    if(this.productForm.get('make_module').value=='' || this.productForm.get('make_module').value==null || this.productForm.get('make_module')==undefined){
      this.notification.showWarning('please Select The Make Module')
    }
    // if(this.productForm.get('specificationstype').value== '' || this.productForm.get('specificationstype').value==null || this.productForm.get('specificationstype').value.id==undefined){
    //   this.notification.showWarning('please Select The specificationstype');
    //   return false;
    // }
    // if(this.productForm.get('configuration').value== '' || this.productForm.get('configuration').value==null || this.productForm.get('configuration').value==undefined){
    //   this.notification.showWarning('please Select The configuration');
    //   return false;
    // }
    console.log(this.productForm.value);
    let dict:any={};
    if(this.table_data.length>0){
      for(let i of this.table_data){
        dict[i['Specification']]=i['Configuration'];
      }
    }
    console.log('before payload',dict)
    
    let data:any={
      'product_isrcm':this.productForm.get('product_isrcm').value?"Y":"N",
      'product_isblocked':this.productForm.get('product_isblocked').value?"Y":"N",
      "name": this.productForm.get('name').value,
      "weight":this.productForm.get('weight').value ,
      "unitprice": this.productForm.get('unitprice').value,
      "uom_id": this.productForm.get('uom_id').value.id,
      "hsn_id": this.productForm.get('hsn_id').value.id,
      "category_id": this.productForm.get('category_id').value.id,
      "subcategory_id": this.productForm.get('subcategory_id').value.id,
      "productcategory_id": this.productForm.get('product_main_cat').value.id,
      "producttype_id":this.productForm.get('product_subcat').value.id,
      'productdisplayname':this.productForm.get('producttype_id').value,
      'producttradingitem':this.producttradingiyem[this.productForm.get('product_tradingitem').value],
      // 'producttradingitem':this.productForm.get('product_tradingitem').value,
      'make_modelflag':this.makemodule_value[this.productForm.get('make_module').value],
      "product_details":dict
  }
  console.log(data);
    this.disableSubmit = true;
    // if(this.productForm.valid) {
      // this.productForm.value.productcategory_id = this.productForm.value.productcategory_id.id
      // this.productForm.value.producttype_id = this.productForm.value.producttype_id.id
      // this.productForm.value.uom_id = this.productForm.value.uom_id.id
      // this.productForm.value.category_id = this.productForm.value.category_id.id
      // this.productForm.value.subcategory_id = this.productForm.value.subcategory_id.id;
      this.spinner.show();
      this.atmaService.ProductCreateForms(data)
        .subscribe(res => {
          this.spinner.hide();
          if (res.status === "success") {
            this.notification.showSuccess(res.message)
            this.spinner.hide();
            this.productForm.reset('');
            this.uomlist=[];
            this.subcatlist=[];
            this.categorylist=[];
            this.onSubmit.emit()          
          } 
          else {
            this.notification.showWarning(res.description)
          }

        },
        (error)=>{
          this.spinner.hide();
          this.notification.showError(error.status+error.statusText);
        }
        );
    // } else {
    //   this.notification.showError("INVALID_DATA!...")
    //   this.disableSubmit = false;
    // }
  }
  onCancelClick() {
    this.onCancel.emit()
  }
  validateNumber(e: any) {
    let input = String.fromCharCode(e.charCode);
    const reg = /^\d*(?:[.,]\d{1,2})?$/;

    if (!reg.test(input)) {
      e.preventDefault();
    }
  }

  getApSubcateValue(id) {
    console.log(">>>>>>>>>>>>>>>>>>>", id)
    this.atmaService.getapsubcat(id)
      .subscribe(result => {
        this.subcatlist = result['data']
        console.log("sub..............................", this.subcatlist)
      })
  }
  getproductdatatypefocus(){
    // console.log(this.productForm.get('product_type').value.id);
    // console.log(this.productForm.get('product_type').value.product_category);
    this.atmaService.getproductcategorydata(this.productForm.get('product_type').value.id,this.productForm.get('product_main_cat').value.product_category,1).subscribe(data=>{
      this.prodcutcategorylist=data['data'];
    });
    console.log( this.prodcutcategorylist);
    console.log('cat call');
  }
  getproductdatafocus(){
    console.log(this.productForm.get('product_main_cat').value);
    let data:any='';
    if(this.productForm.get('product_subcat').value.product_subcategory==undefined || this.productForm.get('product_subcat').value.product_subcategory ==''){
      data='';
    }
    else{
      data=this.productForm.get('product_subcat').value.product_subcategory;
    }
    this.atmaService.getproductsubcategorydata(this.productForm.get('product_main_cat').value.id,data,1).subscribe(data=>{
      this.productsubcatlist=data['data'];
    });
    console.log( this.prodcutcategorylist);
    console.log('cat call');
  }
  getproductsubcategorydataclick(){
    console.log(this.productForm.get('product_main_cat').value);
    if(this.productForm.get('product_type').value == undefined || this.productForm.get('product_type').value==null || this.productForm.get('product_type').value=='' || this.productForm.get('product_type').value ==""){
      this.notification.showWarning('Please Select The Product Type');
      return false;
    }
    if(this.productForm.get('product_main_cat').value==undefined || this.productForm.get('product_main_cat').value =='' ||  this.productForm.get('product_main_cat').value ==null){
     this.notification.showWarning('Please Select The Product MainCategory');
     return false;
    }
    let data:any='';
    if(this.productForm.get('product_subcat').value.product_subcategory==undefined || this.productForm.get('product_subcat').value.product_subcategory=='' || this.productForm.get('product_subcat').value.product_subcategory==""){
      data='';
    }
    else{
      data=this.productForm.get('product_subcat').value.product_subcategory;
    }
    this.atmaService.getproductsubcategorydata(this.productForm.get('product_main_cat').value.id,data,1).subscribe(data=>{
      this.productsubcatlist=data['data'];
    });
    this.productForm.get('product_subcat').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.atmaService.getproductsubcategorydata(this.productForm.get('product_main_cat').value.id,this.productForm.get('product_subcat').value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.productsubcatlist = datas;

    });
  }
  getproducttypedata(){
    this.atmaService.getproduct_type_new(1,' ').subscribe(data=>{
      this.producttypearray=data['data'];
    });
    console.log(this.producttypearray);
    console.log('call');
  }
  getproductcategorydata(){
    this.isLoading=true;
    if(this.productForm.get('product_type').value == undefined || this.productForm.get('product_type').value==null || this.productForm.get('product_type').value=='' || this.productForm.get('product_type').value ==""){
      this.notification.showWarning('Please Select The Product Type');
      return false;
    }
    let data:any='';
    if(this.productForm.get('product_main_cat').value==undefined || this.productForm.get('product_main_cat').value =='' ||  this.productForm.get('product_main_cat').value ==null){
      data='';
    }
    else{
      data=this.productForm.get('product_main_cat').value.product_category;
    }
    console.log(data);
    this.atmaService.getproductcategorydata(this.productForm.get('product_type').value.id,data,1).subscribe(data=>{
      this.isLoading=false;
      this.prodcutcategorylist=data['data'];
    });
    this.productForm.get('product_main_cat').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.atmaService.getproductcategorydata(this.productForm.get('product_type').value.id,value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.prodcutcategorylist = datas;


    });
  }
  getproductsubcaterydats(data:any){
    console.log(this.productForm.get('product_subcat'))
    this.productsubcatdetails.get('productcatname').patchValue(this.productForm.get('product_subcat').value.product_subcategory);
  }
  getproductspecificationclick(){
    let data:any='';
    if(this.productForm.get('product_main_cat').value.id==undefined || this.productForm.get('product_main_cat').value=='' || this.productForm.get('product_main_cat').value.id==null){
      this.notification.showError('Please Select Any Product MainCategory');
      return false;
      
    }
    if(this.productForm.get('specificationstype').value==undefined || this.productForm.get('specificationstype').value=='' || this.productForm.get('specificationstype').value==""){
      data='';
    }
    else{
      data=this.productForm.get('specificationstype').value;
    }
    this.atmaService.createproductspecification(this.productForm.get('product_main_cat').value.id,data,1).subscribe(data=>{
      this.productspecificationArray=data['data'];
    });
    this.productForm.get('specificationstype').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.atmaService.createproductspecification(this.productForm.get('product_main_cat').value.id,this.productForm.get('specificationstype').value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.productspecificationArray = datas;

    });
  }
  gethsndata(){
    let data:any='';
    if(this.productForm.get('hsn_id').value==undefined || this.productForm.get('hsn_id').value=='' || this.productForm.get('hsn_id').value==""){
      data='';
    }
    else{
      data=this.productForm.get('hsn_id').value.id;
    }
    this.atmaService.createhsnproductdetails(data,1).subscribe(data=>{
      this.producthsndata=data['data'];
    });
  }
  getproductcategorydatascroll(){
    // console.log('catinfinitecall')
    setTimeout(() => {
      if (
        this.matproductcategory &&
        this.autocompleteTrigger &&
        this.matproductcategory.panel
      ) {
        fromEvent(this.matproductcategory.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matproductcategory.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            console.log('catinfinitecall')
            const scrollTop = this.matproductcategory.panel.nativeElement.scrollTop;
            const scrollHeight = this.matproductcategory.panel.nativeElement.scrollHeight;
            const elementHeight = this.matproductcategory.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            console.log(atBottom);
            if (atBottom) {
              if (this.subcat_next === true) {
                this.atmaService.getproductcategorydata(this.productForm.get('product_type').value.id,this.paroductcategoryinput.nativeElement.value,this.has_productcategorypage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.prodcutcategorylist = this.prodcutcategorylist.concat(datas);
                    if (this.prodcutcategorylist.length >= 0) {
                      this.has_productcategorynext = datapagination.has_next;
                      this.has_productcategorypre = datapagination.has_previous;
                      this.has_productcategorypage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  
  }
  getproductsubcategorydata(){
    setTimeout(() => {
      if (
        this.matproductsubcategory &&
        this.matproductsubcategory &&
        this.matproductsubcategory.panel
      ) {
        fromEvent(this.matproductsubcategory.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matproductsubcategory.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            console.log('catinfinitecall')
            const scrollTop = this.matproductsubcategory.panel.nativeElement.scrollTop;
            const scrollHeight = this.matproductsubcategory.panel.nativeElement.scrollHeight;
            const elementHeight = this.matproductsubcategory.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.subcat_next === true) {
                this.atmaService.getproductsubcategorydata(this.productForm.get('product_main_cat').value.id,this.paroductsubcategoryinput.nativeElement.value,1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.productsubcatlist = this.productsubcatlist.concat(datas);
                    if (this.productsubcatlist.length >= 0) {
                      this.has_productsubcategorynext = datapagination.has_next;
                      this.has_productsubcategorypre = datapagination.has_previous;
                      this.has_productsubcategorypage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  getproductspecificationscrool(){
    setTimeout(() => {
      if (
        this.matspecication &&
        this.autocompleteTrigger &&
        this.matspecication.panel
      ) {
        fromEvent(this.matspecication.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matspecication.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matspecication.panel.nativeElement.scrollTop;
            const scrollHeight = this.matspecication.panel.nativeElement.scrollHeight;
            const elementHeight = this.matspecication.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_specificationnext === true) {
                this.atmaService.createproductspecification(this.productForm.get('product_main_cat').value.id,this.specificationinput.nativeElement.value,this.has_specificationpage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    console.log('pagination=',results)
                    let datapagination = results["pagination"];
                    this.productspecificationArray= this.productspecificationArray.concat(results);
                    if (this.productspecificationArray.length >= 0) {
                      this.has_specificationnext = datapagination.has_next;
                      this.has_specificationpre = datapagination.has_previous;
                      this.has_specificationpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  getproducthsnscrool(){
    setTimeout(() => {
      if (
        this.matproducthsn &&
        this.autocompleteTrigger &&
        this.matproducthsn.panel
      ) {
        fromEvent(this.matproducthsn.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matproducthsn.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matproducthsn.panel.nativeElement.scrollTop;
            const scrollHeight = this.matproducthsn.panel.nativeElement.scrollHeight;
            const elementHeight = this.matproducthsn.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_specificationnext === true) {
                this.atmaService.createhsnproductdetails(this.paroducthsnInput.nativeElement.value,this.has_producthsnpage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    console.log('pagination=',results)
                    let datapagination = results["pagination"];
                    this.producthsndata= this.producthsndata.concat(results);
                    if (this.producthsndata.length >= 0) {
                      this.has_producthsnnxt = datapagination.has_next;
                      this.has_producthsnpre = datapagination.has_previous;
                      this.has_producthsnpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  createproductcategory(){
    if(this.productcategorydetails.get('namess').value.trim()=='' || this.productcategorydetails.get('namess').value==null || this.productcategorydetails.get('namess').value==undefined || this.productcategorydetails.get('namess').value.trim()=="" ){
      this.notification.showWarning('Please Select The ProductCategory:');
      return false;
    }
    if(this.productcategorydetails.get('productstockimpact').value=='' || this.productcategorydetails.get('productstockimpact').value==undefined || this.productcategorydetails.get('productstockimpact').value==null){
      this.notification.showWarning('Please Select The Product Category Impact:');
      return false;
    }
    if(this.productcategorydetails.get('productdivision').value=='' || this.productcategorydetails.get('productdivision').value==null || this.productcategorydetails.get('productdivision').value==undefined){
      this.notification.showWarning('Please select The Product Division :');
      return false;
    }
    let data:any={
      "client_id": 21,
      // "isprodservice": this.producttype_data[this.productcategorydetails.value.productdivision],
      'isprodservice':this.productcategorydetails.get('productdivision').value.id,
      "name": this.productcategorydetails.value.namess.trim(),
      "stockimpact": this.productcategorydetails.value.productstockimpact=='Yes'?true:false
  };
    console.log(data);
    console.log(this.productcategorydetails.value);
    this.spinner.show();
    this.atmaService.createproductcategorydata(data).subscribe(data=>{
      this.spinner.hide();
      if(data['status']=="success"){
      this.notification.showSuccess('Sucess');
      this.productcategorydetails.reset('');
      this.modalclose.nativeElement.click();
      }
      else{
        this.notification.showWarning(data['description']);
      }
    },
    (error)=>{
      this.notification.showWarning(error.status+error.statusText);
    }
    );
    // this.modalclose.nativeElement.click();
  // this.productcategorydetails.reset('');
  } 
  createproduct_type(){
    if(!(this.poduct_typeform.get('name').value)){
      this.notification.showWarning('Please Enter Product Type Name');
      return false;
    }
    let data:any={
      'name':this.poduct_typeform.get('name').value
    }
    this.atmaService.poduct_type_creation(data).subscribe(res=>{
      if(res['status']=='success'){
        this.notification.showSuccess(res['message']);
        this.modalclose.nativeElement.click();
        this.poduct_typeform.reset('');
      }
      else{
        this.notification.showWarning(res['description']);
      }
    },(error)=>{
      this.notification.showError(error.status+error.statusText)
    })
  }
createproductsubcategoryData(){
  if(this.productsubcatdetails.get('productcat').value=='' || this.productsubcatdetails.get('productcat').value==undefined || this.productsubcatdetails.get('productcat').value==null){
    this.notification.showWarning('Please Select The Category');
    return false;
  }
  if(this.productsubcatdetails.get('productcatname').value=='' || this.productsubcatdetails.get('productcatname').value==undefined || this.productsubcatdetails.get('productcatname').value==null){
    this.notification.showWarning('Please Select The ProductSubCategory');
    return false;
  }

    console.log(this.productsubcatdetails.value);
    let data:any={
      "name": this.productsubcatdetails.value.productcatname,
      "productcategory_id": this.productsubcatdetails.get('productcat').value.id
  };
  console.log(data);
  this.spinner.show();
  this.atmaService.createproductsubcategorydata(data).subscribe(datas=>{
    this.spinner.hide();
    if(datas['status']=='success'){
      this.notification.showSuccess(datas['message']);
      this.productsubcatdetails.reset('');
      this.modalclose_2.nativeElement.click();
    }
    else{
      this.notification.showError(datas['description']);
      this.notification.showError(datas['code']);
    }
  },
  (error)=>{
    this.notification.showWarning(error.status+error.statusText);
  }
  );
  // this.modalclose.nativeElement.click();

  }
createspecificationsdata(){
  console.log(this.productForm.value);
    if(this.productForm.get('product_main_cat').value.id==undefined || this.productForm.get('product_main_cat').value.id==null || this.productForm.get('product_main_cat').value.id == ''){
      this.notification.showWarning('Please Select Any Product Category');
      return false;
    }
    if(this.SpecificationForm.get('specificationed').value == undefined || this.SpecificationForm.get('specificationed').value == '' || this.SpecificationForm.get('specificationed').value == ""){
      this.notification.showWarning('Please Fill The Specification');
      console.log(this.specification.value )
      return false;
    }
    let data:any={
      "productcategory_id": this.productForm.get('product_main_cat').value.id,
      "templatename":this.SpecificationForm.get('specificationed').value,
    };
    console.log(data);
    this.spinner.show();
    this.atmaService.createspecificationsdata(data).subscribe(dta=>{
      this.spinner.hide();
      if(dta['code'] === "UNEXPECTED_ERROR" || dta['code'] ==="INVALID DATA" ){
      this.notification.showWarning(dta['description']);
         return false;
      }
      else {
        this.notification.showSuccess(dta['message']);
        this.modalclose_3.nativeElement.click();
        this.SpecificationForm.reset('');
        // this.specification.patchValue({'specifications':''});
        // this.modalclose.nativeElement.click();
      }
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
      
    }
    );
    // this.modalclose.nativeElement.click();
    // this.specification.patchValue({'specifications':''});

  }
  clicktablevisible(){
    if(this.productForm.get('specificationstype').value ==null || this.productForm.get('specificationstype').value =='' || this.productForm.get('specificationstype').value==undefined){
      this.notification.showWarning('Please select The Specification Type');
      return false;
    }
    if(this.productForm.get('configuration').value==null || this.productForm.get('configuration').value==undefined || this.productForm.get('configuration').value==''){
      this.notification.showWarning('Please Select The configuration');
      return false;
    }
    this.table_visible=true;
    let dear:any=this.table_data.length+1;
    let dta:any={'No':dear,'Specification':this.productForm.get('specificationstype').value,"Configuration":this.productForm.get('configuration').value};
    this.table_data.push(dta);
    this.productForm.get('specificationstype').patchValue('');
    this.productForm.get('configuration').patchValue('');


  }
  deletedata(data){
    let remove=data
    // let idex=this.table_data.indexOf(data);
    this.table_data.splice(data,1);
    if(this.table_data.length>0){
      this.table_visible=true;
    }
    else{
      this.table_visible=false;
    }

  }
  getproductdetailsdata(){
    // this.atmaService.getproductcategorydata(this.productForm.get('product_type').value.id,'',1).subscribe(results=>{
    //   this.productcatlist=results['data'];
    //   console.log(this.productcatlist);

    // });
    // this.getproductcategory();
    // if(this.productForm.get('product_type').value == undefined || this.productForm.get('product_type').value==null || this.productForm.get('product_type').value=='' || this.productForm.get('product_type').value ==""){
    //   this.notification.showWarning('Please Select The Product Type');
    //   return false;
    // }
    // this.productsubcatdetails.get('productcat').valueChanges
    // .pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(() => {
    //     this.isLoading = true;
    //     console.log('inside tap')

    //   }),
    //   switchMap(value => this.atmaService.getproductcategorydata(this.productForm.get('product_type').value.id,value, 1)
    //     .pipe(
    //       finalize(() => {
    //         this.isLoading = false
    //       }),
    //     )
    //   )
    // )
    // .subscribe((results: any[]) => {
    //   let datas = results["data"];
    //   this.productcatlist = datas;

    // });
    if(this.productForm.get('product_type').value == undefined || this.productForm.get('product_type').value==null || this.productForm.get('product_type').value=='' || this.productForm.get('product_type').value ==""){
        this.notification.showWarning('Please Select The Product Type');
        return false;
      }
    let data:any='';
    if(this.productsubcatdetails.get('productcat').value==undefined || this.productsubcatdetails.get('productcat').value =='' ||  this.productsubcatdetails.get('productcat').value ==null){
      data='';
    }
    else{
      data=this.productsubcatdetails.get('productcat').value
     
    }
      data=this.productsubcatdetails.get('productcat').value
    this.atmaService.getproductcategorydata(this.productForm.get('product_type').value.id,data,1).subscribe(results=>{
      this.productcatlist=results['data'];
      console.log(this.productcatlist);

    });
    
  this.productsubcatdetails.get('productcat').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.atmaService.getproductcategorydata(this.productForm.get('product_type').value.id,value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.productcatlist = datas;

    });
  }
  public displayFnproduct(prd?: product): string | undefined {
   
    return prd ? prd.name : undefined;
  }
  public displayFnlabelt(prd?: labeltype): string | undefined {
   
    return prd ? prd.type : undefined;
  }
  hidenav(){
    this.isdisablenav=false;
  }
  shownav(){
    this.isdisablenav=true;
  }
  createprod(){
    this.isproduct=true;
    this.ismakemodel=false;
    this.isspecification=false;
    this.isspecificationsummary=false;
    this.ismakemodelsumary=false;
    this.isotherattrb_creation=false;
    this.isotherattrb_summary=false;
  }
  assetmakemodel(){
    this.ismakemodelsumary=true;
    this.isproduct=false;
    this.ismakemodel=false;
    this.isspecification=false;
    this.isspecificationsummary=false;
    this.isotherattrb_creation=false;
    this.isotherattrb_summary=false;
    this.fa_new_modelsummaryfunction();
  }
  assetspecification(){
    this.isspecificationsummary=true;
    this.ismakemodelsumary=false;
    this.isproduct=false;
    this.ismakemodel=false;
    this.isspecification=false;
    this.isotherattrb_creation=false;
    this.isotherattrb_summary=false;
    this.specificationsummaryfunction();
  }
  other_attributes(){
    this.isotherattrb_summary=true;
    this.isotherattrb_creation=false;
    this.ismakemodelsumary=false;
    this.isspecificationsummary=false;
    this.isproduct=false;
    this.ismakemodel=false;
    this.isspecification=false;
    this.other_attrb_summaryfunction()    
  }
  assetmakemodelcreate(){
    this.ismakemodel=true;
    this.isproduct=false;
    this.ismakemodelsumary=false;
    this.isspecification=false;
    this.isspecificationsummary=false;
    this.isotherattrb_creation=false;
    this.isotherattrb_summary=false;
    (this.fa_makemodel_new_form.get('mainArray') as FormArray).clear();
  }
  assetspecificationcreate(){
    this.isspecification=true;
    this.isproduct=false;
    this.ismakemodel=false;
    this.ismakemodelsumary=false;
    this.isspecificationsummary=false;
    this.isotherattrb_creation=false;
    this.isotherattrb_summary=false;
    (this.specificationform_fa_new.get('key_list') as FormArray).clear();
  }
  otherattrb_create(){
    this.isotherattrb_creation=true;
    this.isotherattrb_summary=false;
    this.isproduct=false;
    this.ismakemodel=false;
    this.ismakemodelsumary=false;
    this.isspecification=false;
    this.isspecificationsummary=false;
    (this.creationform_otherattrb.get('key_list') as FormArray).clear();
  
  }

  fa_makemodelsummaryfunction_pagination(num:number){
    let dta:any='page='+num;
    if(this.makermodelformsummary.get('productname').value!=undefined && this.makermodelformsummary.get('productname').value!="" && this,this.makermodelformsummary.get('productname').value!=null && this,this.makermodelformsummary.get('productname').value.id!=undefined){
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
  fa_new_modelsummaryfunction(){
    let dta:any='page='+this.hasmodel_sum_page;
    if(this.makermodelformsummary.get('productname').value!=undefined && this.makermodelformsummary.get('productname').value!="" && this,this.makermodelformsummary.get('productname').value!=null && this,this.makermodelformsummary.get('productname').value.id!=undefined){
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
  expandenbdata_new(data:any,ind:number){
    
    console.log(data);
    for(let i=0;i<this.isspecificationdata.length;i++){
      if(i==ind){
        this.isspecificationdata[i]['enb_pro']=!this.isspecificationdata[i]['enb_pro'];
        this.makeModelList_new=[];
      }
      
    }
  }
  specificationadd(i:number,original_data:any){
    this.makeModelList_new[i].specification_type.push({"name":this.makermodelformchild.get('labeltype').value.type,'lbtype':this.makermodelformchild.get('labeltype').value.id,
    "check_enb":false,"new_dta":true,"parent_product_code":original_data.product_code,"parent_id":original_data.id,"hierarchy":"C2"});
    console.log(this.makeModelList_new);
    this.makermodelformchild.get('labeltype').patchValue("");//label_group
    this.makermodelformchild.get('label_group').patchValue(false);
    for(let j=0;j<this.makeModelList_new[i].specification_type.length;j++){
      this.makeModelList_new[i].specification_type[j]['check_enb']=false;
    }
    console.log(this.makermodelformchild.value);
  }
  specificationadd_validate(i:number,data_ind){
    
    for(let kl=0;kl<this.makeModelList_new[i].specification_type.length;kl++){
      if(data_ind==kl){
        this.makeModelList_new[i].specification_type[data_ind]['check_enb']=true;
      }
      else{
        this.makeModelList_new[i].specification_type[kl]['check_enb']=false;
      }
    }
    console.log(this.makeModelList_new[i].specification_type[data_ind]);
  }
  configurationadd_validate(i:number,data_ind){
    
    for(let kl=0;kl<this.makeModelList_new[i].configuration.length;kl++){
      if(data_ind==kl){
        this.makeModelList_new[i].configuration[data_ind]['check_enb']=true;
      }
      else{
        this.makeModelList_new[i].configuration[kl]['check_enb']=false;
      }
    }
    console.log(this.makeModelList_new[i].configuration[data_ind]);
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
 
  prouctcheck_new_fa_make_navigate(data:any){
    this.ismakemodel=true;
    this.isspecificationsummary=false;
    this.isspecification=false;
    this.ismakemodelsumary=false;
    this.isproduct=false;
   
    (this.makermodelform.get('mainArray') as FormArray).clear();
    let datamake:any="code="+data.code;
    this.fa_makemodel_new_form.get("productname").patchValue(data.productname);
    this.spinner.show();
    this.atmaService.all_get_fa_makemodel_create(datamake).subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!=""){
        this.toaster.warning(result.code);
        this.toaster.warning(result.description);
        this.specificationsummary=[];
      }
      else{

       console.log(result.data);
       (this.fa_makemodel_new_form.get("mainArray") as FormArray).clear();
       if(result.data.length>0){
        let data_make=result.data[0];
        for(let i=0;i<data_make['mainArray'].length;i++){
         let data_model:any=[];
         for(let j=0;j<data_make['mainArray'][i]['model_array'].length;j++){
           data_model.push(this.formbuilder.group({
             "id":new FormControl(data_make['mainArray'][i]['model_array'][j]['id']),
             "main_enb":true,
             
             "name":new FormControl(data_make['mainArray'][i]['model_array'][j]['name'])
           }));
 
         }
         (this.fa_makemodel_new_form.get("mainArray") as FormArray).push(
           this.formbuilder.group({
             "lbname":new FormControl(data_make['mainArray'][i]['lbname']),
             "id":new FormControl(data_make['mainArray'][i]['id']),
             "main_enb":new FormControl(true),
             "lbtype":new FormControl(""),
             "model_array":this.formbuilder.array(data_model)
           })
         )
 
 
        }
       }
      
       console.log(this.fa_makemodel_new_form.value);
      }
    },
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
    }
    )
  }
  prouctcheck_new_fa_make(){
    console.log(this.fa_makemodel_new_form.value);
    if(this.fa_makemodel_new_form.get('productname').value.id==undefined || this.fa_makemodel_new_form.get('productname').value=="" || this.fa_makemodel_new_form.get('productname').value.id==undefined){
      this.toaster.warning("Please Select The Valid Product Name..");
      return false;
    }
    let datamake:any="code="+this.fa_makemodel_new_form.get('productname').value.code;
    this.spinner.show();
    this.atmaService.all_get_fa_makemodel_create(datamake).subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!=""){
        this.toaster.warning(result.code);
        this.toaster.warning(result.description);
        this.specificationsummary=[];
      }
      else{

        // "mainArray":this.fb.array([
        //   this.fb.group({
            
        //     "lbname":new FormControl(""),
        //     "lbtype":new FormControl(""),
        //     "main_enb":false,
        //     "model_array":this.fb.array([
        //       this.fb.group({
        //         "id":new FormControl(0),
        //         "main_enb":false,
        //         "name":new FormControl("")
        //       })
        //     ])


       console.log(result.data);
       (this.fa_makemodel_new_form.get("mainArray") as FormArray).clear();
       if(result.data.length>0){
        let data_make=result.data[0];
        for(let i=0;i<data_make['mainArray'].length;i++){
         let data_model:any=[];
         for(let j=0;j<data_make['mainArray'][i]['model_array'].length;j++){
           data_model.push(this.formbuilder.group({
             "id":new FormControl(data_make['mainArray'][i]['model_array'][j]['id']),
             "main_enb":false,
             
             "name":new FormControl(data_make['mainArray'][i]['model_array'][j]['name'])
           }));
 
         }
         (this.fa_makemodel_new_form.get("mainArray") as FormArray).push(
           this.formbuilder.group({
             "lbname":new FormControl(data_make['mainArray'][i]['lbname']),
             "id":new FormControl(data_make['mainArray'][i]['id']),
             "main_enb":new FormControl(true),
             "lbtype":new FormControl(""),
             "model_array":this.formbuilder.array(data_model)
           })
         )
 
 
        }
       }
      
       console.log(this.fa_makemodel_new_form.value);
      }
    },
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
    }
    )
  }
  
  deleteDataNewModelchild(i:number){
    
    (this.makermodelform.get('mainArray') as FormArray).removeAt(i);
    
  }

  addDataNewModelchild(){
    let data_length_n:any=(this.makermodelform.get('mainArray') as FormArray).length;
    if(data_length_n>=20){
      this.toaster.warning("Max Limit Data Exceed..");
      return false;
    }
    else{
      console.log(122);
    }
    (this.makermodelform.get('mainArray') as FormArray).push(this.formbuilder.group({
      "lbname":new FormControl(""),"lbtype":new FormControl(""),lid:new FormControl(""),"main_enb":true
    }));
    let data_len:any= (this.makermodelform.get('mainArray') as FormArray).length;
    ((this.makermodelform.get('mainArray') as FormArray).at(data_len-1) as FormGroup).get("lbtype").valueChanges
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
    console.log(this.makermodelform.value);
    // this.patchMakeData();
  }
  
  
  addnew_model_fa_data(i:any){
    console.log(this.fa_makemodel_new_form.get('productname').value);
     let data_any:any=((this.fa_makemodel_new_form.get("mainArray") as FormArray).at(i) as FormGroup).get("lbname").value;
     if(data_any==undefined || data_any=="" || data_any==null){
       this.toaster.warning("Please Enter Valid Make Name..");
       return false;
     }
     let data:any=((this.fa_makemodel_new_form.get("mainArray") as FormArray).at(i) as FormGroup).get("lbtype").value;
     if(data==undefined || data=="" || data==null){
       this.toaster.warning("Please Enter Valid Model Name..");
       return false;
     }
     console.log(data);
     let enb:boolean=false;
     let data_list_check:any=(((((this.fa_makemodel_new_form.get("mainArray") as FormArray))).at(i) as FormGroup).get('model_array') as FormArray).value;
     data_list_check.forEach(element => {
       if(String(element.name).toLowerCase()==String(data).toLowerCase()){
         enb=true;
       }
     });
     if(enb){
       this.toaster.warning("Duplicate Data");
       return false;
     }
     (((((this.fa_makemodel_new_form.get("mainArray") as FormArray))).at(i) as FormGroup).get('model_array') as FormArray).push(this.formbuilder.group({  "id":0,  "main_enb":false, "name":data
   }));
   ((this.fa_makemodel_new_form.get("mainArray") as FormArray).at(i) as FormGroup).get("lbtype").patchValue("");
     
   }
   addnew_make_fa_data(i:any){
    // this.fa_makemodel_new_form=this.fb.group({
    //   productname:new FormControl(""),
    //   make_id:new FormControl(0),
    //   labelname:new FormControl(""),
    //   "labeltype":new FormControl(""),
      
    //   "mainArray":this.fb.array([
    //     this.fb.group({
          
    //       "lbname":new FormControl(""),
    //       "lbtype":new FormControl(""),
    //       "main_enb":false,
    //       "model_array":this.fb.array([
    //         this.fb.group({
    //           "id":new FormControl(0),
    //           "main_enb":false,
    //           "name":new FormControl("")
    //         })
    //       ])
    //     })
    //   ])

    // });
    console.log(this.fa_makemodel_new_form.value);
    if(this.fa_makemodel_new_form.get('productname').value ==undefined || this.fa_makemodel_new_form.get('productname').value==null || this.fa_makemodel_new_form.get('productname').value=='' || this.fa_makemodel_new_form.get('productname').value.code==undefined){
      this.notification.showWarning("Please Select The Product Name..");
      return false;
    }
    (this.fa_makemodel_new_form.get("mainArray") as FormArray).push(
      this.formbuilder.group({
                "lbname":new FormControl(""),
                "lbtype":new FormControl(""),
                "main_enb":false,
                "id":new FormControl(0),
                "model_array":this.formbuilder.array([
                  this.formbuilder.group({
                    "id":new FormControl(0),
                    "main_enb":false,
                    "name":new FormControl("")
                  })
                ])     
      })
    );
    let data_len:any=(((this.fa_makemodel_new_form.get("mainArray") as FormArray))).length-1;
    if((((((this.fa_makemodel_new_form.get("mainArray") as FormArray))).at(data_len) as FormGroup).get('model_array') as FormArray).length==1){
      if (((((((this.fa_makemodel_new_form.get("mainArray") as FormArray))).at(data_len) as FormGroup).get('model_array') as FormArray).at(0) as FormGroup).get('name').value=="" || ((((((this.fa_makemodel_new_form.get("mainArray") as FormArray))).at(data_len) as FormGroup).get('model_array') as FormArray).at(0) as FormGroup).get('name').value==undefined){
        (((((this.fa_makemodel_new_form.get("mainArray") as FormArray))).at(data_len) as FormGroup).get('model_array') as FormArray).clear();
      }
    }
    console.log((this.fa_makemodel_new_form.get("mainArray") as FormArray).value);
  }
  fa_newmakemodel_data(){
    console.log(this.fa_makemodel_new_form.value);
    if(this.fa_makemodel_new_form.get('productname').value==undefined || this.fa_makemodel_new_form.get('productname').value==null || this.fa_makemodel_new_form.get('productname').value==""){
      this.toaster.warning("Please Select The Product Name..")
      return false;
    }
    if((((this.fa_makemodel_new_form.get("mainArray") as FormArray))).length==0){
      this.toaster.warning("Please Select The Make and Model Data..");
      return false;
    }
    let check_dup:boolean=false;
    let check_data_dup:any=[];
    let data_list:any=(((this.fa_makemodel_new_form.get("mainArray") as FormArray)).value);
    data_list.forEach((ele)=>{
      check_data_dup.push(ele.lbname);
    });
    data_list.forEach((ele,i)=>{
      check_data_dup.forEach((elem,j)=>{
        if((String(elem).toLowerCase().trim()==String(ele.lbname).toLowerCase().trim()) && (i!=j)){
          check_dup=true;
        }
      });
    });
    if(check_dup){
      this.toaster.warning("Please Check Asset Make Duplicate Data Not Allowed");
      return false;
    }

    let data_value=this.fa_makemodel_new_form.value;
    this.spinner.show();
    this.atmaService.get_fa_makemodel_create(data_value).subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!="" && result.code!=null){
        this.toaster.warning(result.code);
        this.toaster.warning(result.description);
      }
      else{
        this.toaster.success(result.message);
        this.ismakemodelsumary=true;
        this.isproduct=false;
        this.ismakemodel=false;
        this.isspecification=false;
        this.isspecificationsummary=false;
      }
    },
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
      this.toaster.error("Failed Load To Data..");

    }
    );
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
        console.log(this.isspecification);
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
  prsearch() {
    let data_any:any="";
    this.atmaService.getproductpage(1, 10, data_any)
      .subscribe((results: any) => {
        let datapagination = results["pagination"];
        this.productlist = results["data"];;
        if (this.productlist.length >= 0) {
          this.has_nextpro = datapagination.has_next;
          this.has_previouspro = datapagination.has_previous;
          this.presentpagepro = datapagination.index;
        }
      })
  }
  prod_typedropdown(){
    let data:any='';
    this.atmaService.getproduct_type_new(1,data).subscribe((res)=>{
      let pagination=res['pagination'];
      this.product_typelist_new=res['data'];
      if(this.product_typelist_new.length>=0){
        this.next_page_pdt_type=pagination.has_next;
        this.prev_page_pdt_type=pagination.has_previous;
        this.page_pdt_type=pagination.index;
      }
    })
  }
  
  new_product_spe_submit(){
    console.log(this.specificationform_fa_new.value);
    if(this.specificationform_fa_new.get('productname').value==undefined || this.specificationform_fa_new.get('productname').value=="" || this.specificationform_fa_new.get('productname').value==null){
      this.toaster.warning("Please Select The Valid Product Name..");
      return false;
    }
    let data_new:any=this.specificationform_fa_new.value;
    let data_new_exist:any=[];
    this.specificationform_fa_new.value['key_list'].forEach((ele)=>{
      data_new_exist.push(ele.data);
    });
    console.log(data_new_exist);
    let enb_boolean:boolean=false;
    this.specificationform_fa_new.value['key_list'].forEach((ele,i)=>{
      data_new_exist.forEach((ele_name,j)=>{
        if((String(ele.data).toLowerCase().trim()==String(ele_name).toLowerCase().trim()) && (i!=j)){
          enb_boolean=true;
        }
      })
    });
  if(enb_boolean){
    this.notification.showWarning("Duplicate Product Specification Not Allowed..");
    return false;
  }
    this.spinner.show();
    this.atmaService.fa_product_specificaitons_create(data_new).subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!="" && result.code!=null){
        this.toaster.warning(result.code);
        this.toaster.warning(result.description);
      }
      else{
        this.toaster.success(result.message);
        this.isproduct=false;
        this.ismakemodel=false;
        this.isspecification=false;
        this.isspecificationsummary=true;      }
    },
    (error:HttpErrorResponse)=>{
      this.toaster.warning("Failed To Load The Data..");
      this.spinner.hide();
    }
    )
  }
  addnew_make_fa_spec_data(i:any){
    // this.specificationform_fa_new=this.fb.group({
    //   "productname":new FormControl(""),
    //   "key_list":this.fb.array([
    //     this.fb.group({
    //       "data":new FormControl(""),
    //       "main_enb":new FormControl(false),
    //       "values_list":this.fb.array([
    //         this.fb.group({
    //           "data_value":new FormControl(""),
    //           "main_enb":new FormControl(false)
    //         })
    //       ])
    //     })
    //   ])
    // });
    if(this.specificationform_fa_new.get('productname').value ==undefined || this.specificationform_fa_new.get('productname').value==null || this.specificationform_fa_new.get('productname').value=='' || this.specificationform_fa_new.get('productname').value.code==undefined){
      this.notification.showWarning("Please Select The Product Name..");
      return false;
    }
    (this.specificationform_fa_new.get("key_list") as FormArray).push(
      this.formbuilder.group({
                "data":new FormControl(""),
                "id":new FormControl(0),
                "data_value_n":new FormControl(""),
                "main_enb":new FormControl(false),
                "values_list":this.formbuilder.array([
                  this.formbuilder.group({
                    "id":new FormControl(0),
                    "main_enb":new FormControl(false),
                    "data_value":new FormControl("")
                  })
                ])     
      })
    );
    let data_len:any=(((this.specificationform_fa_new.get("key_list") as FormArray))).length-1;
   
    if((((((this.specificationform_fa_new.get("key_list") as FormArray))).at(data_len) as FormGroup).get('values_list') as FormArray).length==1){
      if (((((((this.specificationform_fa_new.get("key_list") as FormArray))).at(data_len) as FormGroup).get('values_list') as FormArray).at(0) as FormGroup).get('data_value').value=="" || ((((((this.specificationform_fa_new.get("key_list") as FormArray))).at(data_len) as FormGroup).get('values_list') as FormArray).at(0) as FormGroup).get('data_value').value==undefined){
        (((((this.specificationform_fa_new.get("key_list") as FormArray))).at(data_len) as FormGroup).get('values_list') as FormArray).clear();
      }
    }


    console.log((this.fa_makemodel_new_form.get("mainArray") as FormArray).value);
  }



  addnew_model_fa_data_spec(i:any){
    let data_any:any=((this.specificationform_fa_new.get("key_list") as FormArray).at(i) as FormGroup).get("data").value;
    if(data_any==null || data_any==undefined || data_any==""){
      this.toaster.warning("Please Enter The Valid Specifications Name..")
    }
    let data:any=((this.specificationform_fa_new.get("key_list") as FormArray).at(i) as FormGroup).get("data_value_n").value;
    if(data==undefined || data=="" || data==null){
      this.toaster.warning("Please Enter Valid Configurations Name..");
      return false;
    }
    console.log(data);
    let data_check_valiate:any=(((((this.specificationform_fa_new.get("key_list") as FormArray))).at(i) as FormGroup).get('values_list') as FormArray).value;
    let enb_boo:boolean=false;
    data_check_valiate.forEach((ele)=>{
      if( String(ele.data_value).toLowerCase()==String(data).toLowerCase()){
        enb_boo=true;
      }
    });
    if(enb_boo){
      this.notification.showWarning("Duplicate Value Not Allowed");
      return false;
    }
    (((((this.specificationform_fa_new.get("key_list") as FormArray))).at(i) as FormGroup).get('values_list') as FormArray).push(this.formbuilder.group({  "id":0,  "main_enb":false, "data_value":data
  }));
  ((this.specificationform_fa_new.get("key_list") as FormArray).at(i) as FormGroup).get("data_value_n").patchValue("");
    
  }
  search_specificationsdatafunction(){

    // this.specificationform_fa_new=this.fb.group({
    //   "productname":new FormControl(""),
    //   "key_list":this.fb.array([
    //     this.fb.group({
    //       "data":new FormControl(""),
    //       "main_enb":new FormControl(false),
    //       "data_value_n":new FormControl(""),
    //       "values_list":this.fb.array([
    //         this.fb.group({
    //           "data_value":new FormControl(""),
    //           "main_enb":new FormControl(false)
    //         })
    //       ])
    //     })
    //   ])
    // });

    let dta:any='page='+this.hasspec_sum_page;
    if(this.specificationform_fa_new.get('productname').value!=undefined && this.specificationform_fa_new.get('productname').value!="" && this.specificationform_fa_new.get('productname').value!=null && this.specificationform_fa_new.get('productname').value!=undefined){
     dta=dta+"&code="+this.specificationform_fa_new.get('productname').value.code;
    }
    this.spinner.show();
    this.atmaService.fa_product_specificaitons_getall(dta).subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!=""){
        this.toaster.warning(result.description);
        this.isspecificationdata=[];
      }
      else{
        // (((this.specificationform_fa_new.get("key_list") as FormArray).at(0) as FormGroup).get('values_list') as FormArray).clear();
        (this.specificationform_fa_new.get("key_list") as FormArray).clear();

        console.log(result['data'][0]);
        for(let i=0;i<result['data'][0]['key_list'].length;i++){
          let data_value:any=[];
          for(let j=0;j<result['data'][0]['key_list'][i]['values_list'].length;j++){
            data_value.push(this.formbuilder.group({
              "data_value":new FormControl(result['data'][0]['key_list'][i]['values_list'][j]['data_value']),
              "main_enb":new FormControl(result['data'][0]['key_list'][i]['values_list'][j]['main_enb']),
             
            }));
          }
          let data_fa:any=this.formbuilder.group({
            "data":new FormControl(result['data'][0]['key_list'][i]['data']),
            "main_enb":new FormControl(true),
            "data_value_n":new FormControl(""),
            "values_list":this.formbuilder.array(data_value)
          });
          (this.specificationform_fa_new.get("key_list") as FormArray).push(data_fa);
        }
        console.log(this.specificationform_fa_new.value);
      }
    });
  }
  search_specificationsdatafunction_navigate(data:any){
    this.isspecification=true;
    this.isproduct=false;
    this.ismakemodel=false;
    this.ismakemodelsumary=false;
    this.isspecificationsummary=false;
    (this.specificationform_fa_new.get('key_list') as FormArray).clear();

    let dta:any='page='+this.hasspec_sum_page;
    // if(this.specificationform_fa_new.get('productname').value!=undefined && this.specificationform_fa_new.get('productname').value!="" && this.specificationform_fa_new.get('productname').value!=null && this.specificationform_fa_new.get('productname').value!=undefined){
     dta=dta+"&code="+data.code;
    // }
    this.specificationform_fa_new.get("productname").patchValue(data.productname);
    this.spinner.show();
    this.atmaService.fa_product_specificaitons_getall(dta).subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!=""){
        this.toaster.warning(result.description);
        this.isspecificationdata=[];
      }
      else{
        // (((this.specificationform_fa_new.get("key_list") as FormArray).at(0) as FormGroup).get('values_list') as FormArray).clear();
        (this.specificationform_fa_new.get("key_list") as FormArray).clear();

        console.log(result['data'][0]);
        for(let i=0;i<result['data'][0]['key_list'].length;i++){
          let data_value:any=[];
          for(let j=0;j<result['data'][0]['key_list'][i]['values_list'].length;j++){
            data_value.push(this.formbuilder.group({
              "data_value":new FormControl(result['data'][0]['key_list'][i]['values_list'][j]['data_value']),
              "main_enb":new FormControl(result['data'][0]['key_list'][i]['values_list'][j]['main_enb']),
             
            }));
          }
          let data_fa:any=this.formbuilder.group({
            "data":new FormControl(result['data'][0]['key_list'][i]['data']),
            "main_enb":new FormControl(true),
            "data_value_n":new FormControl(""),
            "values_list":this.formbuilder.array(data_value)
          });
          (this.specificationform_fa_new.get("key_list") as FormArray).push(data_fa);
        }
        console.log(this.specificationform_fa_new.value);
      }
    });
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


 otherattsummaryform:any=FormGroup;
 creationform_otherattrb:any=FormGroup;
 otherattbdata_array:Array<any>=[]
 otherattb_page:number=1;
 otherattb_next:boolean=true;
 otherattb_prev:boolean=false;
 navigate_otherattrb_edit(data:any){
   this.isspecification=false;
   this.isproduct=false;
   this.ismakemodel=false;
   this.ismakemodelsumary=false;
   this.isspecificationsummary=false;
   this.isotherattrb_summary=false;
   this.isotherattrb_creation=true;
   (this.creationform_otherattrb.get('key_list') as FormArray).clear();
 
   let dta:any='page='+this.otherattb_page;
    dta=dta+"&code="+data.code
   this.creationform_otherattrb.get("productname").patchValue(data.productname);
   this.spinner.show();
   this.atmaService.otherattb_getall(dta).subscribe((result:any)=>{
     this.spinner.hide();
     if(result.code!=undefined && result.code!=""){
       this.toaster.warning(result.description);
       this.otherattbdata_array=[];
     }
     else{
       (this.creationform_otherattrb.get("key_list") as FormArray).clear();
 
       console.log(result['data'][0]);
       let responseData = result['data'][0];
 
       responseData['key_list'].forEach((keyItem: any) => {
         let data_value: FormGroup[] = [];
 
         keyItem['values_list'].forEach((valueItem: any) => {
           data_value.push(this.formbuilder.group({
             "data_value": new FormControl(valueItem['data_value']),
             "main_enb": new FormControl(valueItem['main_enb'])
           }));
         });
 
         let data: FormGroup = this.formbuilder.group({
           "data": new FormControl(keyItem['data']),
           "main_enb": new FormControl(true),
           "data_value_n": new FormControl(
             keyItem['values_list'].length > 0 ? keyItem['values_list'][0]['data_value'] : ''
           ),
           "flag": new FormControl(
             keyItem['values_list'].length > 0 ? keyItem['values_list'][0]['is_fixed'] : ''
           ),
           "value_list": this.formbuilder.array(data_value)
         });
 
         (this.creationform_otherattrb.get("key_list") as FormArray).push(data);
       });
       
       console.log(this.creationform_otherattrb.value);
     }
   });
 }
 
 other_attrb_summaryfunction_pagination(num:number){
   let dta:any='page='+num;
  //  if(this.otherattsummaryform.get('type').value!=undefined && this.otherattsummaryform.get('type').value!="" && this.otherattsummaryform.get('type').value!=null && this.otherattsummaryform.get('type').value!=undefined){
  //   dta=dta+"&name="+this.otherattsummaryform.get('type').value;
  //  }
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
 
 
 radioFlag: any='YES';
 status: status[] = [{value: 'YES'},{value: 'NO'}]
  radioChange(event: MatRadioChange,a) {
   
   if(event.value == 'YES'){
     this.radioFlag = 'YES'
   }
   else if(event.value == 'NO'){
     this.radioFlag = 'NO'
   }
   console.log('radio_flag ',this.radioFlag);
 }
 
 
 addnew_otherattb_data(i){
   if(!(this.creationform_otherattrb.get('productname').value)){
     this.notification.showWarning("Please Select The Product");
     return false;
   }
   (this.creationform_otherattrb.get("key_list")as FormArray).push(
     this.formbuilder.group({
       "data":new FormControl(''),
       "data_value_n":new FormControl(''),
       "id":new FormControl(0),
       "main_enb":new FormControl(false),
       "flag":new FormControl('YES'),
       "value_list":this.formbuilder.array([
         this.formbuilder.group({
           "main_enb":new FormControl(false),
           "data_value":new FormControl(''),
           "id":new FormControl(1),
         })
       ])
     })
   );
   let len_data=(this.creationform_otherattrb.get("key_list")as FormArray).length-1
   
  
       if((((((this.creationform_otherattrb.get("key_list") as FormArray))).at(len_data) as FormGroup).get('value_list') as FormArray).length==1){
         if (((((((this.creationform_otherattrb.get("key_list") as FormArray))).at(len_data) as FormGroup).get('value_list') as FormArray).at(0) as FormGroup).get('data_value').value=="" || ((((((this.creationform_otherattrb.get("key_list") as FormArray))).at(len_data) as FormGroup).get('value_list') as FormArray).at(0) as FormGroup).get('data_value').value==undefined){
           (((((this.creationform_otherattrb.get("key_list") as FormArray))).at(len_data) as FormGroup).get('value_list') as FormArray).clear();
         }
       }
 
 }
 
 otherattrb_value_add(i:any){
   let data_any:any=((this.creationform_otherattrb.get("key_list") as FormArray).at(i) as FormGroup).get("data").value;
   if(data_any==null || data_any==undefined || data_any==""){
     this.toaster.warning("Please Enter The Key")
   }
   let data:any=((this.creationform_otherattrb.get("key_list") as FormArray).at(i) as FormGroup).get("data_value_n").value;
   if(data==undefined || data=="" || data==null){
     this.toaster.warning("Please Enter Valid Value");
     return false;
   }
   console.log(data);
   let data_check_valiate:any=(((((this.creationform_otherattrb.get("key_list") as FormArray))).at(i) as FormGroup).get('value_list') as FormArray).value;
   let enb_boo:boolean=false;
   data_check_valiate.forEach((ele)=>{
     if( String(ele.data_value).toLowerCase()==String(data).toLowerCase()){
       enb_boo=true;
     }
   });
   if(enb_boo){
     this.notification.showWarning("Duplicate Value Not Allowed");
     return false;
   }
   (((((this.creationform_otherattrb.get("key_list") as FormArray))).at(i) as FormGroup).get('value_list') as FormArray).push(this.formbuilder.group({  "main_enb":false, "data_value":data}));
 ((this.creationform_otherattrb.get("key_list") as FormArray).at(i) as FormGroup).get("data_value_n").patchValue("");
   
 }
 
 search_otherattb_datafunction(){
 
   let dta:any='page='+this.otherattb_page;
   if(this.creationform_otherattrb.get('productname').value!=undefined && this.creationform_otherattrb.get('productname').value!="" && this.creationform_otherattrb.get('productname').value!=null && this.creationform_otherattrb.get('productname').value!=undefined){
    dta=dta+"&code="+this.creationform_otherattrb.get('productname').value.code;
   }
   this.spinner.show();
   this.atmaService.otherattb_getall(dta).subscribe((result:any)=>{
     this.spinner.hide();
     if(result.code!=undefined && result.code!=""){
       this.toaster.warning(result.description);
       this.otherattbdata_array=[];
     }
     else{
       (this.creationform_otherattrb.get("key_list") as FormArray).clear();
 
      //  console.log(result['data'][0]);
      //  for(let i=0;i<result['data'][0]['key_list'].length;i++){
      //    let data_value:any=[];
      //    for(let j=0;j<result['data'][0]['key_list'][i]['value_list'].length;j++){
      //      data_value.push(this.formbuilder.group({
      //        "data_value":new FormControl(result['data'][0]['key_list'][i]['value_list'][j]['data_value']),
      //        "main_enb":new FormControl(result['data'][0]['key_list'][i]['value_list'][j]['main_enb']),
      //        "flag":new FormControl(result['data'][0]['key_list'][i]['value_list'][j]['flag'])
            
      //      }));
      //    }
      //    let data:any=this.formbuilder.group({
      //      "data":new FormControl(result['data'][0]['key_list'][i]['data']),
      //      "main_enb":new FormControl(true),
      //      "data_value_n":new FormControl(""),
      //      "flag":new FormControl(this.radioFlag),
      //      "value_list":this.formbuilder.array(data_value)
      //    });
      //    (this.creationform_otherattrb.get("key_list") as FormArray).push(data);
      //  }
      let responseData = result['data'][0];
 
       responseData['key_list'].forEach((keyItem: any) => {
         let data_value: FormGroup[] = [];
 
         keyItem['values_list'].forEach((valueItem: any) => {
           data_value.push(this.formbuilder.group({
             "data_value": new FormControl(valueItem['data_value']),
             "main_enb": new FormControl(valueItem['main_enb'])
           }));
         });
 
         let data: FormGroup = this.formbuilder.group({
           "data": new FormControl(keyItem['data']),
           "main_enb": new FormControl(true),
           "data_value_n": new FormControl(),
           "flag": new FormControl(keyItem['is_fixed']),
           "value_list": this.formbuilder.array(data_value)
         });
 
         (this.creationform_otherattrb.get("key_list") as FormArray).push(data);
       });
       console.log(this.creationform_otherattrb.value);
     }
   });
 }
 otherattb_creationsubmit(){
   console.log(this.creationform_otherattrb.value);
   if(this.creationform_otherattrb.get('productname').value==undefined || this.creationform_otherattrb.get('productname').value=="" || this.creationform_otherattrb.get('productname').value==null){
     this.toaster.warning("Please Select The Valid Product Name..");
     return false;
   }
   let data_new:any=this.creationform_otherattrb.value;
   let data_new_exist:any=[];
   this.creationform_otherattrb.get('key_list').value.forEach((ele)=>{
     data_new_exist.push(ele.data);
   });
   console.log(data_new_exist);
   let enb_boolean:boolean=false;
   this.creationform_otherattrb.value['key_list'].forEach((ele,i)=>{
     data_new_exist.forEach((ele_name,j)=>{
       if((String(ele.data).toLowerCase().trim()==String(ele_name).toLowerCase().trim()) && (i!=j)){
         enb_boolean=true;
       }
     })
   });
 if(enb_boolean){
   this.notification.showWarning("Duplicate Key Not Allowed");
   return false;
 }
 console.log(data_new);
   this.spinner.show();
   this.atmaService.otherattb_creation(data_new).subscribe((result:any)=>{
     this.spinner.hide();
     if(result.code!=undefined && result.code!="" && result.code!=null){
       this.toaster.warning(result.code);
       this.toaster.warning(result.description);
     }
     else{
       this.toaster.success(result.message);
       this.other_attributes();
     }
   },
   (error:HttpErrorResponse)=>{
     this.toaster.warning("Failed To Load The Data..");
     this.spinner.hide();
   }
   )
 }
 expandenbdata_otherattb(data:any,ind:number){
   
   console.log(data);
   for(let i=0;i<this.otherattbdata_array.length;i++){
     if(i==ind){
       this.otherattbdata_array[i]['enb_pro']=!this.otherattbdata_array[i]['enb_pro'];
     }
     
   }
 }




 
 creationform_addattributes:FormGroup;
 isaddattributes:boolean=false;

 
  public displayproduct_type(pdt?: pdt_type): string | undefined {
    return pdt ? pdt.name : undefined;
  }
 addattributes_create(){
  this.isaddattributes=true;
  (this.creationform_addattributes.get('key_list') as FormArray).clear();
}
radioFlag_prodtype: any='YES';
prodtype_dependency: ptype_depen[] = [{value: 'YES'},{value: 'NO'}]
 radioChange_ptype(event: MatRadioChange,a) {
  
  if(event.value == 'YES'){
    this.radioFlag_prodtype = 'YES'
  }
  else if(event.value == 'NO'){
    this.radioFlag_prodtype = 'NO'
  }
  console.log('radio_flag ',this.radioFlag_prodtype);
}
addnew_attributes_data(i){
  // if(!(this.creationform_addattributes.get('product_type').value)){
  //   this.notification.showWarning("Please Enter  The Product type");
  //   return false;
  // }
  (this.creationform_addattributes.get("key_list")as FormArray).push(
    this.formbuilder.group({
      "data":new FormControl(''),
      "data_value_n":new FormControl(''),
      "id":new FormControl(0),
      "main_enb":new FormControl(false),
      "flag":new FormControl('YES'),
      "value_list":this.formbuilder.array([
        this.formbuilder.group({
          "main_enb":new FormControl(false),
          "data_value":new FormControl(''),
          "id":new FormControl(1),
        })
      ])
    })
  );
  let len_data=(this.creationform_addattributes.get("key_list")as FormArray).length-1
  
 
      if((((((this.creationform_addattributes.get("key_list") as FormArray))).at(len_data) as FormGroup).get('value_list') as FormArray).length==1){
        if (((((((this.creationform_addattributes.get("key_list") as FormArray))).at(len_data) as FormGroup).get('value_list') as FormArray).at(0) as FormGroup).get('data_value').value=="" || ((((((this.creationform_addattributes.get("key_list") as FormArray))).at(len_data) as FormGroup).get('value_list') as FormArray).at(0) as FormGroup).get('data_value').value==undefined){
          (((((this.creationform_addattributes.get("key_list") as FormArray))).at(len_data) as FormGroup).get('value_list') as FormArray).clear();
        }
      }

}
key_values_addattributes(i:any){
  let data_any:any=((this.creationform_addattributes.get("key_list") as FormArray).at(i) as FormGroup).get("data").value;
  if(data_any==null || data_any==undefined || data_any==""){
    this.toaster.warning("Please Enter The Valid key")
    return false;
  }
  let data:any=((this.creationform_addattributes.get("key_list") as FormArray).at(i) as FormGroup).get("data_value_n").value;
  if(data==undefined || data=="" || data==null){
    this.toaster.warning("Please Enter Value");
    return false;
  }
  console.log(data);
  let data_check_valiate:any=(((((this.creationform_addattributes.get("key_list") as FormArray))).at(i) as FormGroup).get('value_list') as FormArray).value;
  let enb_boo:boolean=false;
  data_check_valiate.forEach((ele)=>{
    if( String(ele.data_value).toLowerCase()==String(data).toLowerCase()){
      enb_boo=true;
    }
  });
  if(enb_boo){
    this.notification.showWarning("Duplicate Value Not Allowed");
    return false;
  }
  (((((this.creationform_addattributes.get("key_list") as FormArray))).at(i) as FormGroup).get('value_list') as FormArray).push(this.formbuilder.group({  "id":0,  "main_enb":false, "data_value":data,"flag":this.radioFlag_prodtype}));
((this.creationform_addattributes.get("key_list") as FormArray).at(i) as FormGroup).get("data_value_n").patchValue("");
  
}


addattributes_creationsubmit(){
  console.log(this.creationform_addattributes.value);
  if(this.creationform_addattributes.get('product_type').value==undefined || this.creationform_addattributes.get('product_type').value=="" || this.creationform_addattributes.get('product_type').value==null){
    this.toaster.warning("Please Select The Valid Product Name..");
    return false;
  }
  let data_new:any=this.creationform_addattributes.value;
  let data_new_exist:any=[];
  this.creationform_addattributes.get('key_list').value.forEach((ele)=>{
    data_new_exist.push(ele.data);
  });
  console.log(data_new_exist);
  let enb_boolean:boolean=false;
  this.creationform_addattributes.value['key_list'].forEach((ele,i)=>{
    data_new_exist.forEach((ele_name,j)=>{
      if((String(ele.data).toLowerCase().trim()==String(ele_name).toLowerCase().trim()) && (i!=j)){
        enb_boolean=true;
      }
    })
  });
if(enb_boolean){
  this.notification.showWarning("Duplicate Product Specification Not Allowed..");
  return false;
}
console.log(data_new);
  this.spinner.show();
  this.atmaService.addattributes_creation(data_new).subscribe((result:any)=>{
    this.spinner.hide();
    if(result.code!=undefined && result.code!="" && result.code!=null){
      this.toaster.warning(result.code);
      this.toaster.warning(result.description);
    }
    else{
      this.toaster.success(result.message);
      this.modalclose.nativeElement.click();
      this.isaddattributes=false;
      this.creationform_addattributes.get('product_type').reset('')
    }
  },
  (error:HttpErrorResponse)=>{
    this.toaster.warning("Failed To Load The Data..");
    this.spinner.hide();
  }
  )
}

add_attribtes_summaryfunction(id) {
  this.spinner.show();
  this.atmaService.addattributes_getall(id).subscribe((result: any) => {
    this.spinner.hide();
    
    if (result.code !== undefined && result.code !== "") {
      this.toaster.warning(result.description);
      this.otherattbdata_array = [];
      return;
    }

    (this.creationform_addattributes.get("key_list") as FormArray).clear();

    let responseData = result['data'][0];

    responseData['key_list'].forEach((keyItem: any) => {
      let data_value: FormGroup[] = [];

      keyItem['values_list'].forEach((valueItem: any) => {
        valueItem['data_value'].forEach((dv: any) => {
          data_value.push(this.formbuilder.group({
            "data_value": new FormControl(dv['data_value']),
            "main_enb": new FormControl(dv['main_enb']),
          }));
        });
      });


      let data: FormGroup = this.formbuilder.group({
        "data": new FormControl(keyItem['data']),
        "main_enb": new FormControl(keyItem['main_enb']),
        "data_value_n": new FormControl(),

        "flag": new FormControl(keyItem['values_list'][0]['is_fixed']), 
        "value_list": this.formbuilder.array(data_value)
      });

      (this.creationform_addattributes.get("key_list") as FormArray).push(data);
    });

    console.log(this.creationform_addattributes.value);
  });
}

}
