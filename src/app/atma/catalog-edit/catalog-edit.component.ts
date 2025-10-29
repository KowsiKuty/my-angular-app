import { Component, OnInit, Output, EventEmitter, ViewChild, Injectable } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ShareService } from '../share.service'
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
import { environment } from 'src/environments/environment';

// export interface productlistss {
//   id: string;
//   name: string;
// }
// export interface UOM {
//   id: string;
//   name: string;
// }

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
  selector: 'app-catalog-edit',
  templateUrl: './catalog-edit.component.html',
  styleUrls: ['./catalog-edit.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class CatalogEditComponent implements OnInit {
  isLoading = false;
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter();
  catalogEditForm: FormGroup;
  catalogEditId: number;
  currentDate: any = new Date();
  defaultDate = new FormControl(new Date());
  today = new Date();
  // uomlist: Array<UOM>;
  productlist: Array<any>;
  // categorylist: Array<any>;
  // subcategorylist: Array<any>;
  activityDetailId: number;
  // productList: Array<productlistss>;
  product_name = new FormControl();
  subcategoryID: number;
  categoryID: number;
  productID: number;
  catelogEditButton = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  select: any;
  catelogName: string;
  subCatelogName: string;
  category: any;
  subcategory: any;

  // @ViewChild('uomm') matAutocomplete: MatAutocomplete;
  // @ViewChild('producttype') matAutocomplete1: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  // @ViewChild('uomInput') uomInput: any;
  // @ViewChild('productInput') productInput: any;
  
  vendorURL=environment.apiURL
  producttypefieldParentObj: any= {
    label: "Product Type",
    method: "get",
    url: this.vendorURL + "mstserv/pdtclasstype",
    params: "",
    searchkey: "data",
    displaykey: "name",
    // wholedata: true,
    // Outputkey: "id",
    required: true,
    formcontrolname: 'type',
  };
  productfieldChildObj:any ={
    label: "Product Name",
    method: "get",
    url: this.vendorURL + "mstserv/search_mst_product_prpo",
    params: "&query=",
    searchkey: "query",
    displaykey: "name",
    // wholedata: true,
    "Depkey": "id",
    "DepValue": "request_type",
    required: true,
    formcontrolname: 'product_name',
  };
  uomfield:any = {label: "Uom Name"};
  ParentObj:any ={label:"Make",
    // method: "get",
    // url: this.vendorURL + "mstserv/product_makemodel",
    // // params: "&m_type="+ "make" + "&code=" + product_code,
    // searchkey: "query",
    // displaykey: "name",
    // wholedata: true,
    formcontrolname: 'make',
  };
  ChildObj:any = {label:"Model",
    // method: "get",
    // url: this.vendorURL + "mstserv/product_makemodel",
    // // params: "&m_type="+ "model" + "&code=" + product_code,
    // searchkey: "query",
    // displaykey: "name",
    // "Depkey":"id",
    // "DepValue": "make_id",
    // wholedata: true,
    formcontrolname: 'model', 
  };
  ParentObj1:any ={label:"Specification",
    // method: "get",
    // url: this.vendorURL + "mstserv/product_specification",
    // // params: "&code=" + this.productCode,
    // searchkey: "query",
    // displaykey: "specification",
    // wholedata: true,
    // formcontrolname: 'specifications'
  };
  ChildObj1:any = {label:"Configuration",
    // method: "get",
    // url: this.vendorURL + "mstserv/product_configuration",
    // // params: "&code=" + this.productCode,
    // searchkey: "query",
    // displaykey: "configuration",
    // "Depkey":"specification",
    // "DepValue": "specification",
    // wholedata: true,
    // formcontrolname: 'configuration'
  };
  productCode: any;
  productmakeflag: any;
  tableshow: boolean=false;
  branchViewId: number;
  status: number;
  product_Code: any;
  product_type: any;
  product_type_id: any;

  constructor(private fb: FormBuilder,private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService,
     private shareService: ShareService, private toastr: ToastrService,private atmaService: AtmaService, private notification: NotificationService, private datePipe: DatePipe) {
      // this.productfield = {
      //   label: "Activity/Product Catalogue Name",
      //   method: "get",
      //   url: this.vendorURL + "mstserv/product_search",
      //   params: "",
      //   searchkey: "query",
      //   displaykey: "name",
      //   wholedata: true,
      //   required: true,
      // };
      // this.uomfield = {
      //   label: "Uom Name",
      //   method: "get",
      //   url: this.vendorURL + "mstserv/uom_search",
      //   params: "",
      //   searchkey: "query",
      //   displaykey: "name",
      //   wholedata: true,
      //   required: true,
      // };
      // this.ParentObj = {
      //   label:"Make",
      //   method: "get",
      //   url: this.vendorURL + "mstserv/product_makemodel",
      //   params: "&m_type="+ "make" + "&code=" + this.productCode,
      //   searchkey: "query",
      //   displaykey: "name",
      //   wholedata: true,
      //   required: true,
      //   // defaultvalue: data?.make
      // };
      // this.ChildObj = {
      //   label:"Model",
      //   method: "get",
      //   url: this.vendorURL + "mstserv/product_makemodel",
      //   params: "&m_type="+ "model" + "&code=" + this.productCode,
      //   searchkey: "query",
      //   displaykey: "name",
      //   "Depkey":"id",
      //   "DepValue": "make_id",
      //   wholedata: true,
      //   required: true,
      //   // defaultvalue: data.model
      // };
      // this.ParentObj1 = {
      //   label:"Specification",
      //   method: "get",
      //   url: this.vendorURL + "mstserv/product_specification",
      //   params: "&code=" + this.productCode,
      //   searchkey: "query",
      //   displaykey: "specification",
      //   wholedata: true,
      //   required: true,
      //   // defaultvalue: data?.specification
      // };
      // this.ChildObj1 = {
      //   label:"Configuration",
      //   method: "get",
      //   url: this.vendorURL + "mstserv/product_configuration",
      //   params: "&code=" + this.productCode,
      //   searchkey: "query",
      //   displaykey: "configuration",
      //   "Depkey":"specification",
      //   "DepValue": "specification",
      //   wholedata: true,
      //   required: true,
      //   // defaultvalue: data.configuration
      // };
      }

  ngOnInit(): void {
    // let data: any = this.shareService.testingvalue.value;
    // this.activityDetailId = data.id
   
    this.catalogEditForm = this.fb.group({
      detail_name: ['', Validators.required],
      product_name: ['', Validators.required],
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
      name: ['', Validators.required],
      make: ['', Validators.required],
      model: ['', Validators.required],
      specifications: ['', Validators.required],
      configuration: ['', Validators.required],
      specification: [''],
      size: [''],
      remarks: [''],
      uom: ['', Validators.required],
      unitprice: [''],
      from_date: ['', Validators.required],
      to_date: ['', Validators.required],
      packing_price: [''],
      delivery_date: [''],
      capacity: [''],
      direct_to: ['', Validators.required],
      make_id:[''],
      model_id:[''],
      type:[''],

    })

    this.ParentObj ={label:"Make",
      method: "get",
      url: this.vendorURL + "mstserv/product_makemodel",
      // params: "&m_type="+ "make" + "&code=" + product_code,
      searchkey: "query",
      displaykey: "name",
      wholedata: true,
      formcontrolname: 'make',
    };
    this.ChildObj = {label:"Model",
      method: "get",
      url: this.vendorURL + "mstserv/product_makemodel",
      // params: "&m_type="+ "model" + "&code=" + product_code,
      searchkey: "query",
      displaykey: "name",
      "Depkey":"id",
      "DepValue": "make_id",
      wholedata: true,
      formcontrolname: 'model', 
    };
    this.ParentObj1 ={label:"Specification",
      method: "get",
      url: this.vendorURL + "mstserv/product_specification",
      // params: "&code=" + this.productCode,
      searchkey: "query",
      displaykey: "specification",
      wholedata: true,
      formcontrolname: 'specifications'
    };
    this.ChildObj1 = {label:"Configuration",
      method: "get",
      url: this.vendorURL + "mstserv/product_configuration",
      // params: "&code=" + this.productCode,
      searchkey: "query",
      displaykey: "configuration",
      "Depkey":"specification",
      "DepValue": "specification",
      wholedata: true,
      formcontrolname: 'configuration'
    };
    this.getCatalogEdit();
    // this.getProductValue();
    // this.getcatagoryValue();
    // this.getsubcatagoryValue();
    // let prokeyvalue: String = "";
    // this.getProducts(prokeyvalue);
    // this.catalogEditForm.get('product_name').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap(value => this.atmaService.getProducts(value)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.productList = datas;
    //     console.log("product", datas)

    //   })
    // let uomkeyvalue: String = "";
    // this.getuomValue(uomkeyvalue);

    // this.catalogEditForm.get('uom').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),

    //     switchMap(value => this.atmaService.getuom_LoadMore(value, 1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.uomlist = datas;

    //   })

  }
  // categorynames(){
  //   this.getcatagoryValue();
  // }
  // subcategorynames(){
  //   this.getsubcatagoryValue();
  // }
  // productname(){
  //   let prokeyvalue: String = "";
  //   this.getProducts(prokeyvalue);
  //   this.catalogEditForm.get('product_name').valueChanges
  //     .pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
  //       }),
  //       switchMap(value => this.atmaService.getProducts1(value,1)
  //         .pipe(
  //           finalize(() => {
  //             this.isLoading = false
  //           }),
  //         )
  //       )
  //     )
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.productList = datas;
  //       console.log("product", datas)

  //     })
  // }
  // uomname(){
  //   let uomkeyvalue: String = "";
  //   this.getuomValue(uomkeyvalue);

  //   this.catalogEditForm.get('uom').valueChanges
  //     .pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
  //         console.log('inside tap')

  //       }),

  //       switchMap(value => this.atmaService.getuom_LoadMore(value, 1)
  //         .pipe(
  //           finalize(() => {
  //             this.isLoading = false
  //           }),
  //         )
  //       )
  //     )
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.uomlist = datas;

  //     })

  // }
  setDate(date: string) {
    this.currentDate = date
    this.currentDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    console.log("Datttee   " + this.currentDate)

    return this.currentDate;
  }
  // public displaydis(producttype?: productlistss): string | undefined {
  //   console.log('id', producttype.id);
  //   console.log('name', producttype.name);
  //   return producttype ? producttype.name : undefined;
  // }

  // get producttype() {
  //   return this.catalogEditForm.get('product_name');
  // }
  // public displayFnUOM(uomm?: UOM): string | undefined {
  //   console.log('id', uomm.id);
  //   console.log('name', uomm.name);
  //   return uomm ? uomm.name : undefined;
  // }

  prod(data) {
    this.productID = data
    // this.categoryID = data.category
     // this.subcategoryID = data.subcategory
    let catelog = data["category"];
    let catid = catelog['id'];
    this.category = catid
    this.catelogName = catelog['name']
    let subcatelog = data["subcategory"];
    let subcatid = subcatelog['id'];
    this.subcategory =  subcatid
    this.subCatelogName = subcatelog['name']
    this.catalogEditForm.patchValue({
      product_name: this.productID,
      category: this.catelogName,
      subcategory: this.subCatelogName
      // category: this.categoryID,
      // subcategory: this.subcategoryID
    })
  }

  get uomm() {
    return this.catalogEditForm.value.get('uom');
  }

  // private getProducts(prokeyvalue) {
  //   this.atmaService.getProducts(prokeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.productList = datas;

  //     })
  // }
  getProductValue() {
    this.atmaService.getProductList()
      .subscribe(result => {
        this.productlist = result['data']
        console.log("product", this.productlist)
      })
  }

  // getcatagoryValue() {
  //   this.atmaService.getapcat()
  //     .subscribe(result => {
  //       this.categorylist = result['data']
  //       console.log("category", this.categorylist)
  //     })
  // }
  // getsubcatagoryValue() {
  //   this.atmaService.getapsubcatsummary()
  //     .subscribe(result => {
  //       this.subcategorylist = result['data']
  //       console.log("subcategory", this.subcategorylist)
  //     })
  // }
  // private getuomValue(uomkeyvalue) {
  //   this.atmaService.getuom_Search(uomkeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.uomlist = datas;
  //     })
  // }

  // UOMScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matAutocomplete &&
  //       this.autocompleteTrigger &&
  //       this.matAutocomplete.panel
  //     ) {
  //       fromEvent(this.matAutocomplete.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.matAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.matAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.atmaService.getuom_LoadMore(this.uomInput.nativeElement.value, this.currentpage + 1)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.uomlist = this.uomlist.concat(datas);
  //                   if (this.uomlist.length >= 0) {
  //                     this.has_next = datapagination.has_next;
  //                     this.has_previous = datapagination.has_previous;
  //                     this.currentpage = datapagination.index;
  //                   }
  //                 })
  //             }
  //           }
  //         });
  //     }
  //   });
  // }
  // productScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matAutocomplete1 &&
  //       this.autocompleteTrigger &&
  //       this.matAutocomplete1.panel
  //     ) {
  //       fromEvent(this.matAutocomplete1.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.matAutocomplete1.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.matAutocomplete1.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matAutocomplete1.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matAutocomplete1.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.atmaService.getProducts1(this.productInput.nativeElement.value, this.currentpage + 1)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.productList = this.productList.concat(datas);
  //                   if (this.productList.length >= 0) {
  //                     this.has_next = datapagination.has_next;
  //                     this.has_previous = datapagination.has_previous;
  //                     this.currentpage = datapagination.index;
  //                   }
  //                 })
  //             }
  //           }
  //         });
  //     }
  //   });
  // }
  keyPressAlphaNumeric(event) {

    var inp = String.fromCharCode(event.keyCode);
  
    if (/[a-zA-Z]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  createFormate() {
    let data = this.catalogEditForm.controls;
    // let datas: any = this.shareService.catalogEdit.value;
    // this.catalogEditId = datas.id;
    let objCatalog = new Catalog();
    let new_arr=[]
    console.log("this.directorNameList",this.directorNameList)
    for (let a of this.directorNameList){
      console.log("a?.id",a?.id)
      let das={
        "specification":a?.Specification?.specification,
        configuration:a?.configuration?.configuration
      }
      if(a?.id){
        das['id']=a.id
        if(a?.status !==undefined && a?.status!==null && a?.status!==''){
          das['status']=a.status
        }
        

      }
      console.log("das",das)
      new_arr.push(das)
    }
    console.log("new_arr",new_arr)
    objCatalog.detail_name = data['detail_name'].value;
    objCatalog.product_name = data['product_name'].value.id;
    objCatalog.category = this.category
    objCatalog.subcategory = this.subcategory;
    // objCatalog.name = data['name'].value;
    // objCatalog.specification = data['specification'].value;
    objCatalog.size = data['size'].value;
    // objCatalog.remarks = data['remarks'].value;
    objCatalog.uom = data['uom'].value.id;
    objCatalog.type = data['type'].value.id;
    if(this.catalogEditForm.value.unitprice == '' || this.catalogEditForm.value.unitprice == null || this.catalogEditForm.value.unitprice == undefined){
      objCatalog.unitprice = 0
    }else{
      objCatalog.unitprice = data['unitprice'].value;
    }
    if(this.catalogEditForm.value.packing_price == '' || this.catalogEditForm.value.packing_price == null || this.catalogEditForm.value.packing_price == undefined){
      objCatalog.packing_price = 0
    }else{
      objCatalog.packing_price = data['packing_price'].value;
    }
    if(this.catalogEditForm.value.delivery_date == '' || this.catalogEditForm.value.delivery_date == null || this.catalogEditForm.value.delivery_date == undefined){
      objCatalog.delivery_date = 0
    }else{
      objCatalog.delivery_date = data['delivery_date'].value;
    }
    // objCatalog.from_date = data['from_date'].value;
    // objCatalog.to_date = data['to_date'].value;
    // / BUG ID:7523-
    var from_date=data['from_date'].value;
    objCatalog.from_date=this.datePipe.transform(from_date,"yyyy-MM-dd")
    console.log('objCatalog.from_date==>',objCatalog.from_date)
    var to_date=data['to_date'].value;
    objCatalog.to_date=this.datePipe.transform(to_date,"yyyy-MM-dd")
    console.log('objCatalog.to_date==>',objCatalog.to_date)
    // BUG ID:7523
  //   objCatalog.packing_price = data['packing_price'].value;
  // objCatalog.delivery_date = data['delivery_date'].value;
    // objCatalog.capacity = data['capacity'].value;
    objCatalog.direct_to = data['direct_to'].value;
    let dateValue = this.catalogEditForm.value;


    // var str = data['name'].value
    // var cleanStr_name=str.trim();//trim() returns string with outer spaces removed
    // objCatalog.name = cleanStr_name

    // var str = data['specification'].value
    // var cleanStr_spe=str.trim();//trim() returns string with outer spaces removed
    // objCatalog.specification = cleanStr_spe

    // var str = data['remarks'].value
    // var cleanStr_rk=str.trim();//trim() returns string with outer spaces removed
    // objCatalog.remarks = cleanStr_rk
    
    var str = data['capacity'].value
    var cleanStr_cp=str.trim();//trim() returns string with outer spaces removed
    objCatalog.capacity = cleanStr_cp
    objCatalog.make=data?.make?.value.id
    objCatalog.model=data?.model?.value.id
    objCatalog.configuration=new_arr

    console.log(" objCatalog", objCatalog)
    return objCatalog;
  }
  fromDateSelection(event: string) {
    const date = new Date(event)
    this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
  }

  getCatalogEdit() {
    let dataa: any = this.shareService.catalogEdit.value;//get edit data for catalog
    console.log(dataa)
    this.catalogEditId = dataa.id;
    let datas: any = this.shareService.branchView.value;
    this.branchViewId = datas.id;
    // this.activityDetailId=dataa.activitydetail_id.id;
    this.atmaService.getSingleCatalog(this.branchViewId, this.catalogEditId)
      .subscribe(data => {
        this.frtodatecatlogedit = {"fromobj":{label: "Date From", defaultvalue: data.fromdate},toobj:{label: "Date To", defaultvalue: data.todate}}
        console.log("cat edit data ------", data)
        let new_array = []
        for (let a of data?.configuration){
          let das={
            id:a?.id,
            "Specification":{specification:a?.specification},
            configuration:{configuration:a?.configuration}
          }
          this.directorNameList.push(das)
        }
        console.log("this.directorNameList",this.directorNameList)
        // this.directorNameList = new_array

        // this.productfield = {
        //   label: "Activity/Product Catalogue Name",
        //   method: "get",
        //   url: this.vendorURL + "mstserv/product_search",
        //   params: "",
        //   searchkey: "query",
        //   displaykey: "name",
        //   wholedata: true,
        //   required: true,
        //   defaultvalue: data.productname
        // };
        // this.ParentObj = {
        //   label:"Make",
        //   method: "get",
        //   url: this.vendorURL + "mstserv/product_makemodel",
        //   params: "&m_type="+"make"  + "&code=" + data?.productname?.code,
        //   searchkey: "query",
        //   displaykey: "name",
        //   wholedata: true,
        //   // required: true,
        //   // defaultvalue: data?.make
        //   formcontrolname: 'make',
        // };
        // this.ChildObj = {
        //   label:"Model",
        //   method: "get",
        //   url: this.vendorURL + "mstserv/product_makemodel",
        //   params: "&m_type="+ "model" + "&code=" + data?.productname?.code,
        //   searchkey: "query",
        //   displaykey: "name",
        //   "Depkey":"id",
        //   "DepValue": "make_id",
        //   wholedata: true,
        //   // required: true,
        //   // defaultvalue: data?.model
        //   formcontrolname: 'model',
        // };
        // this.ParentObj1 = {
        //   label:"Specification",
        //   method: "get",
        //   url: this.vendorURL + "mstserv/product_specification",
        //   params: "&code=" + this.productCode,
        //   searchkey: "query",
        //   displaykey: "specification",
        //   wholedata: true,
        //   required: true,
        //   defaultvalue: data?.specification
        // };
        // this.ChildObj1 = {
        //   label:"Configuration",
        //   method: "get",
        //   url: this.vendorURL + "mstserv/product_configuration",
        //   params: "&code=" + this.productCode,
        //   searchkey: "query",
        //   displaykey: "configuration",
        //   "Depkey":"specification",
        //   "DepValue": "specification",
        //   wholedata: true,
        //   required: true,
        //   defaultvalue: data.configuration[0]?.configuration
        // };
        this.uomfield = {
          label: "Uom Name",
          method: "get",
          url: this.vendorURL + "mstserv/uom_search",
          params: "",
          searchkey: "query",
          displaykey: "name",
          wholedata: true,
          required: true,
          defaultvalue: data?.uom
        };
        let detailname = data.detailname;
        let product_name = data["productname"];
        let type = data["type"];
        let productid = product_name['id'];
        let product_code = product_name['code'];
        this.product_Code = product_code
        console.log("product_code--------",product_code)
        let product = productid
        let category = data["category"];
        let cname = category["name"];
        let categoryid = category['id'];
        let cat = categoryid
        this.category = cat
        let subcategory = data["subcategory"];
        let scname = subcategory["name"];
        let subcategoryid = subcategory['id'];
        let sub = subcategoryid
        this.subcategory =  sub
        let name = data.name;
        let specification = data.specification;
        let size = data.size;
        let remarks = data.remarks;
        let uom = data.uom;
        let unitprice = data.unitprice;
        let fromdate = data.fromdate;
        let todate = data.todate;
        let packing_price = data.packing_price;
        let delivery_date = data.delivery_date;
        let capacity = data.capacity;
        let direct_to = data.direct_to;
        this.ParentObj = {
          label:"Make",
          method: "get",
          url: this.vendorURL + "mstserv/product_makemodel",
          params: "&m_type="+ "make" + "&code=" + product_code,
          searchkey: "query",
          displaykey: "name",
          wholedata: true,
          formcontrolname: 'make', 
          // required: true,
        };
        this.ChildObj = {
          label:"Model",
          method: "get",
          url: this.vendorURL + "mstserv/product_makemodel",
          params: "&m_type="+ "model" + "&code=" + product_code,
          searchkey: "query",
          displaykey: "name",
          "Depkey":"id",
          "DepValue": "make_id",
          wholedata: true,
          formcontrolname: 'model', 
          // required: true,
        };

        this.ParentObj1 = {
          label:"Specification",
          method: "get",
          url: this.vendorURL + "mstserv/product_specification",
          params: "&code=" + product_code,
          searchkey: "query",
          displaykey: "specification",
          wholedata: true,
          formcontrolname: 'specifications', 
          // required: true,
        };
        this.ChildObj1 = {
          label:"Configuration",
          method: "get",
          url: this.vendorURL + "mstserv/product_configuration",
          params: "&code=" + product_code,
          searchkey: "query",
          displaykey: "configuration",
          "Depkey":"specification",
          "DepValue": "specification",
          wholedata: true,
          formcontrolname: 'configuration', 
          // required: true,
        };
        this.catalogEditForm.patchValue({
          detail_name: detailname,
          product_name: product_name,
          type: type,
          category: cname,
          subcategory: scname,
          name: name,
          specification: specification,
          size: size,
          remarks: remarks,
          uom: uom,
          unitprice: unitprice,
          from_date: fromdate,
          to_date: todate,
          packing_price: packing_price,
          delivery_date: delivery_date,
          capacity: capacity,
          direct_to: direct_to,
          make: data.make,
          model: data.model,
          // specifications: data.specification,
          // configuration: data.configuration,

        })
      })
  }
  catalogEditCreateForm() {
    this.SpinnerService.show();
   
    
      if (this.catalogEditForm.value.type === "" || this.catalogEditForm.value.type === null || this.catalogEditForm.value.type === undefined) { 
        this.toastr.error('Please Select Any One Product Type');
        this.SpinnerService.hide();
        return false;
      }
      if (this.catalogEditForm.value.product_name === "" || this.catalogEditForm.value.product_name === null || this.catalogEditForm.value.product_name === undefined) { 
        this.toastr.error('Please Select Any One Product');
        this.SpinnerService.hide();
        return false;
      }
      // if (this.catalogEditForm.value.name === "") {
      //   this.toastr.error('Please Enter Category Name');
      //   this.SpinnerService.hide();
      //   return false;
      // }
      if (this.catalogEditForm.value.uom === "" || this.catalogEditForm.value.uom === null || this.catalogEditForm.value.uom === undefined) {
        this.toastr.error('Please Select Any One UOM');
        this.SpinnerService.hide();
        return false;
      }
      // if (this.catalogEditForm.value.unitprice === "") {
      //   this.toastr.error('Please Enter UnitPrice');
      //   this.SpinnerService.hide();
      //   return false;
      // }
      if (this.catalogEditForm.value.from_date === "" || this.catalogEditForm.value.from_date === null || this.catalogEditForm.value.from_date === undefined) {
        this.toastr.error('Please Choose From date');
        this.SpinnerService.hide();
        return false;
      }
      if (this.catalogEditForm.value.to_date === "" || this.catalogEditForm.value.to_date === null || this.catalogEditForm.value.to_date === undefined) {
        this.toastr.error('Please Choose To Date');
        this.SpinnerService.hide();
        return false;
      }
      // if (this.catalogEditForm.value.packing_price === "") {
      //   this.toastr.error('Please Enter Packing Price');
      //   this.SpinnerService.hide();
      //   return false;
      // }
      // if (this.catalogEditForm.value.delivery_date === "") {
      //   this.toastr.error('Please Enter Delivery Date');
      //   this.SpinnerService.hide();
      //   return false;
      // }
     
      if (this.catalogEditForm.value.direct_to === "" || this.catalogEditForm.value.direct_to === null || this.catalogEditForm.value.direct_to === undefined) {
        this.toastr.error('Please Enter Direct To');
        this.SpinnerService.hide();
        return false;
      }
      if (this.catalogEditForm.value.uom.id === undefined || this.catalogEditForm.value.uom.id === null) {
        this.toastr.error('Please Select Valid UOM');
        this.SpinnerService.hide();
        return false;
      }
  
      if (this.catalogEditForm.value.product_name.id === undefined || this.catalogEditForm.value.product_name.id === null) {
        this.toastr.error('Please Select Valid Product');
        this.SpinnerService.hide();
        return false;
      }
     
    
      let dateValue = this.catalogEditForm.value;
      dateValue.from_date = this.datePipe.transform(dateValue.from_date, 'yyyy-MM-dd');
      dateValue.to_date = this.datePipe.transform(dateValue.to_date, 'yyyy-MM-dd');
      let data= this.createFormate()
      console.log("data data ---" ,data)
      this.atmaService.catalogEditCreateForm(this.catalogEditId,data, this.branchViewId)
        .subscribe(result => {
          if(result.id === undefined){
            this.notification.showError(result.description);
            this.SpinnerService.hide();
            return false;
          }
          
          else {
            this.notification.showSuccess("Updated Successfully....")
            this.SpinnerService.hide();
            this.onSubmit.emit();
            console.log("Catalogedit", result)
          }
        },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
        )
 
  }
  onCancelClick() {
    this.onCancel.emit()
  }


  namevalidation(event){
    
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9-/  ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  addressvalidation(event){
    
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9-_#@.', /&]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  index:number=0

  producttypedata(data) {
    this.product_type = data
    this.product_type_id = data?.id
    console.log("product_type...", this.product_type)
    console.log("product_type_id......", this.product_type_id)
    // if(data === ""){
    //   this.ParentObj ={label:"Make",formcontrolname: 'make', };
    //   this.ChildObj = {label:"Model",formcontrolname: 'model',};
    //  }
  }
  productdata(data){
    this.productID = data
    console.log("productIdDatas=======>",data)
    this.productCode = data?.code
    console.log("productCode======>",this.productCode)
    // this.productmakeflag = data?.makemodelflag
    console.log("productflag========>",this.productmakeflag)
   if(this.productCode){
    if(this.index<=0){
      this.index+=1
      this.ParentObj1 = {
        label:"Specification",
        method: "get",
        url: this.vendorURL + "mstserv/product_specification",
        params: "&code=" + this.productCode,
        searchkey: "query",
        displaykey: "specification",
        wholedata: true,
        formcontrolname: 'specifications', 
        // required: true,
      };
      this.ChildObj1 = {
        label:"Configuration",
        method: "get",
        url: this.vendorURL + "mstserv/product_configuration",
        params: "&code=" + this.productCode,
        searchkey: "query",
        displaykey: "configuration",
        "Depkey":"specification",
        "DepValue": "specification",
        wholedata: true,
        formcontrolname: 'configuration', 
        // required: true,
      };
      // this.directorNameList =[]
    }
    else{
      this.ParentObj = {
        label:"Make",
        method: "get",
        url: this.vendorURL + "mstserv/product_makemodel",
        params: "&m_type="+ "make" + "&code=" + this.productCode,
        searchkey: "query",
        displaykey: "name",
        wholedata: true,
        formcontrolname: 'make', 
        // required: true,
      };
      this.ChildObj = {
        label:"Model",
        method: "get",
        url: this.vendorURL + "mstserv/product_makemodel",
        params: "&m_type="+ "model" + "&code=" + this.productCode,
        searchkey: "query",
        displaykey: "name",
        "Depkey":"id",
        "DepValue": "make_id",
        wholedata: true,
        formcontrolname: 'model', 
        // required: true,
      };
      this.ParentObj1 = {
        label:"Specification",
        method: "get",
        url: this.vendorURL + "mstserv/product_specification",
        params: "&code=" + this.productCode,
        searchkey: "query",
        displaykey: "specification",
        wholedata: true,
        formcontrolname: 'specifications', 
        // required: true,
      };
      this.ChildObj1 = {
        label:"Configuration",
        method: "get",
        url: this.vendorURL + "mstserv/product_configuration",
        params: "&code=" + this.productCode,
        searchkey: "query",
        displaykey: "configuration",
        "Depkey":"specification",
        "DepValue": "specification",
        wholedata: true,
        formcontrolname: 'configuration', 
        // required: true,
      };
      this.index+=1
      let array=[]
      for (let b of this.directorNameList){
        b['status']=0
        array.push(b)
      }
      this.directorNameList=array
    }
   }

   else{
    this.ParentObj ={label:"Make",formcontrolname: 'make', };
    this.ChildObj = {label:"Model",formcontrolname: 'model',};
    this.catalogEditForm.get('make').reset()
    this.catalogEditForm.get('model').reset()
    this.ParentObj1 ={label:"Specification",formcontrolname: 'specifications',};
    this.ChildObj1 = {label:"Configuration",formcontrolname: 'configuration',};
    let array=[]
      for (let b of this.directorNameList){
        b['status']=0
        array.push(b)
      }
      this.directorNameList=array
    // this.directorNameList =[]
   }
  
   
    // this.categoryID = data.category
     // this.subcategoryID = data.subcategory
    let catelog = data["category"];
    let subcatelog = data["subcategory"];
    if(data == undefined || data == "" || data == null){
      this.catalogEditForm.get('category').setValue('')
      this.catalogEditForm.get('subcategory').setValue('')
    }
    else{
    // let catid = catelog['id'];
    // this.catelogName = catelog['name']
    this.catelogName = catelog.name
    // let subcatid = subcatelog['id'];
    this.subCatelogName = subcatelog.name
    this.catalogEditForm.patchValue({
      product_name: this.productID,
      category: this.catelogName,
      subcategory: this.subCatelogName
      // category: this.categoryID,
      // subcategory: this.subcategoryID
    })
    }
  }

  uomdata(e) {
    console.log("event", e);
    this.catalogEditForm.patchValue({
      uom: e,
    });
  }

  frtodatecatlogedit:any = {"fromobj":{label: "Date From",  required: true},toobj:{label: "Date To",  required: true}}

  fromdatecatlogeditfun(editform){
    this.catalogEditForm.patchValue({
      from_date:editform
    })
  }

  todatecatlogeditfun(editto){
    this.catalogEditForm.patchValue({
      to_date:editto
    })
  }

  selectedvalues(partdata){
    this.catalogEditForm.patchValue({
      // make: partdata,
      make_id:partdata?.id
     })
     
    //  if(this.golvar>1){
    //   let array=[]
    //   for(let a of this.directorNameList){
    //     if(a?.id){
    //       a['status']=0
    //     }
    //     array.push(a)
    //   }
    //   this.directorNameList=array
    //   }
    //   this.golvar+=1
    //  this.ChildObj = {
    //   label:"Model",
    //   method: "get",
    //   url: this.vendorURL + "mstserv/product_makemodel",
    //   params: "&m_type="+"model" + "&code=" + this.productCode,
    //   searchkey: "query",
    //   displaykey: "name",
    //   "Depkey":"id",
    //   "DepValue": "make_id",
    //   wholedata: true,
    //   required: true,
    // };
  }
  golvar :number = 0
  golvar1 :number = 0
  selectedvaluess(childdata){
    this.catalogEditForm.patchValue({
      // model: childdata,
      model_id: childdata?.id,
     })
     
    //  if(this.golvar1>1){
    //   let array=[]
    //   for(let a of this.directorNameList){
    //     if(a?.id){
    //       a['status']=0
    //     }
    //     array.push(a)
    //   }
    //   this.directorNameList=array

    //   }
    //   this.golvar1+=1
     
  }
  // selectedvalues1(partdata){
  //   this.catalogEditForm.patchValue({
  //     specifications: partdata
  //    })
  //   //  this.ChildObj1 = {
  //   //   label:"Configuration",
  //   //   method: "get",
  //   //   url: this.vendorURL + "mstserv/product_configuration",
  //   //   params: "&code=" + this.productCode,
  //   //   searchkey: "query",
  //   //   displaykey: "name",
  //   //   "Depkey":"name",
  //   //   "DepValue": "specification",
  //   //   wholedata: true,
  //   //   required: true,
  //   // };
  // }
  // selectedvaluess1(partdata){
  //   this.catalogEditForm.patchValue({
  //     configuration: partdata
  //    })
  // }
  directorNameList: any[] = []
  SummaryspecsconfigData:any = [
{columnname: "Specification",key: "specs"},
{columnname: "Configuration",key: "specs"},
{ columnname: 'Edit', icon: 'edit', key: 'edit', button: true, function: true, clickfunction: this.editspec.bind(this) },
    { columnname: 'Delete', icon: 'delete', function: true, button: true, key: 'delete', clickfunction: this.deletespec.bind(this) }
]
SummaryApicatalogObjNew:any = {FeSummary:true, data:this.directorNameList}
deletespec(data) {
  let index = this.directorNameList.findIndex(i => JSON.stringify(i) === JSON.stringify(data));

  if(data?.id){
    this.directorNameList[index]['status'] = 0
  }
  else{
    this.directorNameList.splice(index, 1);

  }
console.log("directorNameList",this.directorNameList)
}
create: boolean = true
global_index: number = -22
editspec(data) {
  let index = this.directorNameList.findIndex(i => JSON.stringify(i) === JSON.stringify(data));
  this.global_index = index
  let obj = this.directorNameList[index];
  this.ChildObj1 = {
    label: "Configuration",
    method: "get",
    url: this.vendorURL + "mstserv/product_configuration",
    params: "&code=" + this.product_Code,
    searchkey: "query",
    displaykey: "configuration",
    Depkey: "specification",
    DepValue: "specification",
// "Specification": spec,
// "configuration": config
    // defaultvalue: data.subtax, configuration,specification
    // required: true,
    // defaultvalue: obj?.configuration
    formcontrolname: 'configuration'
  }
  this.ParentObj1 = {
    label: "Specification",
    "method": "get",
    "url": this.vendorURL + "mstserv/product_specification",
    params: "&code=" + this.product_Code,
    searchkey: "query",
    displaykey: "specification",
    // defaultvalue: data.tax,configuration,specification
    // required: true,
    // defaultvalue: obj?.Specification
    formcontrolname: 'specifications'
  }
  this.catalogEditForm.patchValue({
    specifications: obj?.Specification,
    configuration:obj?.configuration,
  })

  // this.ParentObj2.defaultvalue = obj?.Specification
  // this.ChildObj2.defaultvalue = obj?.configuration
  this.create = false


}
addCatalog() {


  let config = this.catalogEditForm?.get("configuration")?.value
  let spec = this.catalogEditForm?.get("specifications")?.value;
  if (config && spec) {
    if (this.create
    ) {
      let specExists = this.directorNameList.some(i => JSON.stringify(i?.Specification?.specification) === JSON.stringify(spec?.specification));
      let index = this.directorNameList.findIndex(i => JSON.stringify(i?.Specification?.specification) === JSON.stringify(spec?.specification));
      // if(){
      //   this.notification.showError("Specification Already Exists")

      // }
      if (!(index!==-1 && this.directorNameList[index]?.status!=0)) {
        let data = {
          "Specification": spec,
          "configuration": config
        };
        this.directorNameList.push(data);
      }
      else {
        this.notification.showError("Specification Already Exists")

      }
      this.create = true
      this.restformcatlog = []
      return 

    }
    else {
      let data = {
        "Specification": spec,
        "configuration": config,
        id:this.directorNameList[this.global_index]?.id
      };
      this.directorNameList[this.global_index] = data
      this.create = true
      this.ParentObj1.defaultvalue = ''
      this.ChildObj1.defaultvalue = ''
      this.restformcatlog = []
      return 
    }

  }
  else {
    this.notification.showError("Please Choose specification and configiration")
    return false

  }

  // this.catalogAddForm.patchValue({
  //   Specification:'',
  //   configuration:''


  // }
  // )


}
restformcatlog: any

}
class Catalog {
  detail_name: string;
  type: number;
  product_name: string;
  category: string;
  subcategory: string;
  name: string;
  specification: string;
  size: string;
  remarks: string;
  uom: string;
  unitprice: number;
  from_date: string;
  to_date: string;
  packing_price: number;
  delivery_date: number;
  capacity: string;
  direct_to: string;
  make:any;
  model:any
  configuration:any
}