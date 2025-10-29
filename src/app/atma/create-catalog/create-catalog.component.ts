import { Component, OnInit, Output, EventEmitter, ViewChild, Injectable } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AtmaService } from '../atma.service';
import { NotificationService } from '../notification.service'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { isBoolean } from 'util';
import { ShareService } from '../share.service'
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
  selector: 'app-create-catalog',
  templateUrl: './create-catalog.component.html',
  styleUrls: ['./create-catalog.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class CreateCatalogComponent implements OnInit {

  isLoading = false;
  table_show = false
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  catalogAddForm: FormGroup;
  currentDate: any = new Date();
  defaultDate = new FormControl(new Date());
  today = new Date();
  productID: number;
  subcategoryID: number;
  categoryID: number;
  // uomlist: Array<UOM>;
  // categorylist: Array<any>;
  // subcategorylist: Array<any>;
  activityDetailId: number;
  // productList: Array<productlistss>;
  product_name = new FormControl();
  catelogButton = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  select: any;
  catelogName: string;
  subCatelogName: string;

  // @ViewChild('uomm') matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  // @ViewChild('uomInput') uomInput: any;
  // @ViewChild('producttype') matAutocomplete1: MatAutocomplete;
  // @ViewChild('productInput') productInput: any;

  vendorURL = environment.apiURL
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
  productfieldChildObj: any= {
    label: "Product Name",
    method: "get",
    url: this.vendorURL + "mstserv/search_mst_product_prpo",
    params:  "&query=",
    searchkey: "query",
    displaykey: "name",
    // wholedata: true,
    "Depkey": "id",
    "DepValue": "request_type",
    required: true,
    formcontrolname: 'product_name',
  };

  uomfield: any;
  makefield: any;
  modalfield: any;
  Modenames: any;
  Modenames_code: any;
  Modenames_id: any;
  product_code: any;
  product_id: any;
  product_type: any;
  product_type_id: any;
  // product_make: any;

  constructor(private formBuilder: FormBuilder, private errorHandler: ErrorHandlingService, private SpinnerService: NgxSpinnerService,
    private atmaService: AtmaService, private notification: NotificationService, private datePipe: DatePipe,
    private toastr: ToastrService, private shareService: ShareService) {
    // this.productfield = {
    //   label: "Product Name",
    //   method: "get",
    //   url: this.vendorURL + "mstserv/product_search",
    //   params: "",
    //   searchkey: "query",
    //   displaykey: "name",
    //   wholedata: true,
    //   required: true,
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
    };
    // this.makefield = {
    //   label: "Mode Name",
    //   method: "get",
    //   url: this.vendorURL + "mstserv/product_makemodel",
    //   // params: "&m_type="+ this.mtypedata.make + "&code=" + this.mtypedata.code,
    //   searchkey: "query",
    //   displaykey: "name",
    //   wholedata: true,
    //   required: true,
    // };
    // this.modalfield = {
    //   label: "Modal Name",
    //   method: "get",
    //   url: this.vendorURL + "mstserv/product_makemodel",
    //   // params: "&m_type="+ this.mtypedata.make + "&code=" + this.mtypedata.code +  "&make_id=" + this.mtypedata.make_id,
    //   searchkey: "query",
    //   displaykey: "name",
    //   wholedata: true,
    //   required: true,
    // };

    // let product_make = make


  }
  ngOnInit(): void {

    this.catalogAddForm = this.formBuilder.group({
      detail_name: [{ value: "", disabled: isBoolean }],
      product_name: ['', Validators.required],
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
      name: ['', Validators.required, Validators.pattern('^[a-zA-Z ]*$')],
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
      direct_to: false,
      Modename: [''],
      Modalname: [''],
      Specifications: [''],
      Configuration: [''],make:[''],model:[''],
      type: [''],

    })
    this.getActivityDetailname();
    // this.getcatagoryValue();
    // this.getsubcatagoryValue();

    // let prokeyvalue: String = "";
    // this.getProducts(prokeyvalue);
    // this.catalogAddForm.get('product_name').valueChanges
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

    // this.catalogAddForm.get('uom').valueChanges
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
  // productname(){
  //   let prokeyvalue: String = "";
  //     this.getProducts(prokeyvalue);
  //     this.catalogAddForm.get('product_name').valueChanges
  //       .pipe(
  //         debounceTime(100),
  //         distinctUntilChanged(),
  //         tap(() => {
  //           this.isLoading = true;
  //         }),
  //         switchMap(value => this.atmaService.getProducts(value)
  //           .pipe(
  //             finalize(() => {
  //               this.isLoading = false
  //             }),
  //           )
  //         )
  //       )
  //       .subscribe((results: any[]) => {
  //         let datas = results["data"];
  //         this.productList = datas;
  //         console.log("product", datas)

  //       })

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
  // uomname(){
  //   let uomkeyvalue: String = "";
  //   this.getuomValue(uomkeyvalue);

  //   this.catalogAddForm.get('uom').valueChanges
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


  branchID:any
  branchViewId:any
  getActivityDetailname() {
    // let data: any = this.shareService.testingvalue.value;
    let data: any = this.shareService.branchView.value;
    this.branchID = data;
    this.branchViewId = data.id;
    console.log("ttt", data)
    let det = data.detailname
    this.activityDetailId = data.id
    this.catalogAddForm.patchValue({
      detail_name: det

    })

  }

  setDate(date: string) {
    this.currentDate = date
    this.currentDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    console.log("Datttee====>   " + this.currentDate)

    return this.currentDate;
  }
  // public displaydis(producttype?: productlistss): string | undefined {
  //   console.log('id', producttype.id);
  //   console.log('name', producttype.name);
  //   return producttype ? producttype.name : undefined;
  // }

  // get producttype() {
  //   return this.catalogAddForm.get('product_name');
  // }
  // public displayFnUOM(uomm?: UOM): string | undefined {
  //   console.log('id', uomm.id);
  //   console.log('name', uomm.name);
  //   return uomm ? uomm.name : undefined;
  // }

  // get uomm() {
  //   return this.catalogAddForm.value.get('uom');
  // }

  prod(data) {
    this.productID = data
    // this.categoryID = data.category
    // this.subcategoryID = data.subcategory
    let catelog = data["category"];
    let catid = catelog['id'];
    this.catelogName = catelog['name']
    let subcatelog = data["subcategory"];
    let subcatid = subcatelog['id'];
    this.subCatelogName = subcatelog['name']
    this.catalogAddForm.patchValue({
      product_name: this.productID,
      category: this.catelogName,
      subcategory: this.subCatelogName
      // category: this.categoryID,
      // subcategory: this.subcategoryID
    })
  }


  // private getProducts(prokeyvalue) {
  //   this.atmaService.getProducts(prokeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.productList = datas;

  //     })
  // }
  createFormate() {
    let date = this.setDate(this.currentDate);

    let data = this.catalogAddForm.controls;
    let objCatalog = new Catalog();
    // // "Specification": spec,
// "configuration": config
      // defaultvalue: data.subtax, configuration,specification
    let new_arr=[]
    for (let a of this.directorNameList){
      let das={
        "specification":a?.Specification?.specification,
        configuration:a?.configuration?.configuration
      }
      new_arr.push(das)
    }
    objCatalog.detail_name = data['detail_name'].value;
    objCatalog.product_name = data['product_name'].value.id;
    objCatalog.category = data['product_name'].value['category']['id'];
    objCatalog.subcategory = data['product_name'].value['subcategory']['id'];
    // objCatalog.name = data['name'].value;
    // objCatalog.specification = data['specification'].value;
    objCatalog.size = data['size'].value;
    // objCatalog.remarks = data['remarks'].value;
    objCatalog.uom = data['uom'].value.id;
    objCatalog.type = data['type'].value.id;
    if(this.catalogAddForm.value.unitprice == '' || this.catalogAddForm.value.unitprice == undefined || this.catalogAddForm.value.unitprice == null ){
      objCatalog.unitprice = 0
    }
    else{
      objCatalog.unitprice = data['unitprice'].value;
    }
    if(this.catalogAddForm.value.packing_price == '' || this.catalogAddForm.value.packing_price == undefined || this.catalogAddForm.value.packing_price == null ){
      objCatalog.packing_price = 0
    }
    else{
      objCatalog.packing_price = data['packing_price'].value;
    }
    if(this.catalogAddForm.value.delivery_date == '' || this.catalogAddForm.value.delivery_date == undefined || this.catalogAddForm.value.delivery_date == null ){
      objCatalog.delivery_date = 0
    }
    else{
      objCatalog.delivery_date = data['delivery_date'].value;
    }
    objCatalog.from_date = data['from_date'].value;
    console.log('fromdate===>', objCatalog.from_date)
    objCatalog.to_date = data['to_date'].value;
    console.log('todate===>', objCatalog.to_date)
    // objCatalog.packing_price = data['packing_price'].value;
    // objCatalog.delivery_date = data['delivery_date'].value;
    // objCatalog.capacity = data['capacity'].value;
    objCatalog.direct_to = data['direct_to'].value;
    let dateValue = this.catalogAddForm.value;
    // let fromdate = dateValue.from_date;
    objCatalog.from_date = this.datePipe.transform(dateValue.from_date, 'yyyy-MM-dd');
    // console.log(this.datePipe.transform(fromdate,"yyyy-MM-dd")); //output : 2018-02-13
    console.log('objCatalog.from_date===>', objCatalog.from_date)
    objCatalog.to_date = this.datePipe.transform(dateValue.to_date, 'yyyy-MM-dd');
    console.log('objCatalog.to_date===>', objCatalog.to_date)


    var str = data['name'].value
    var cleanStr_name = str.trim();//trim() returns string with outer spaces removed
    objCatalog.name = cleanStr_name

    var str = data['specification'].value
    var cleanStr_spe = str.trim();//trim() returns string with outer spaces removed
    objCatalog.specification = cleanStr_spe

    var str = data['remarks'].value
    var cleanStr_rk = str.trim();//trim() returns string with outer spaces removed
    objCatalog.remarks = cleanStr_rk

    var str = data['capacity'].value
    var cleanStr_cp = str.trim();//trim() returns string with outer spaces removed
    objCatalog.capacity = cleanStr_cp
    objCatalog.make=data?.make?.value
    objCatalog.model=data?.model?.value
    objCatalog.configuration=new_arr
    console.log(" objCatalog", objCatalog)
    return objCatalog;
  }

  // private getuomValue(uomkeyvalue) {
  //   this.atmaService.getuom_Search(uomkeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.uomlist = datas;
  //     })
  // }


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
  fromDateSelection(event: string) {
    const date = new Date(event)
    this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
  }
  submitForm() {
    // this.createFormate()
    this.SpinnerService.show();

    if (this.catalogAddForm.value.type === "" || this.catalogAddForm.value.type === null || this.catalogAddForm.value.type === undefined) { 
      this.toastr.error('Please Select Any One Product Type');
      this.SpinnerService.hide();
      return false;
    }

    if (this.catalogAddForm.value.product_name === "" || this.catalogAddForm.value.product_name === undefined || this.catalogAddForm.value.product_name === null) {
      this.toastr.error('Please Select Any One Product');
      this.SpinnerService.hide();
      return false;
    }
    // if (this.catalogAddForm.value.name === "") {
    //   this.toastr.error('Please Enter Category Name');
    //   this.SpinnerService.hide();
    //   return false;
    // }

    if (this.catalogAddForm.value.uom === "" || this.catalogAddForm.value.uom === undefined || this.catalogAddForm.value.uom === null) {
      this.toastr.error('Please Select Any One UOM');
      this.SpinnerService.hide();
      return false;
    }
    // if (this.catalogAddForm.value.unitprice === "") {
    //   this.toastr.error('Please Enter UnitPrice');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    if (this.catalogAddForm.value.from_date === "" || this.catalogAddForm.value.from_date === undefined || this.catalogAddForm.value.from_date === null) {
      this.toastr.error('Please Choose From date');
      this.SpinnerService.hide();
      return false;
    }
    if (this.catalogAddForm.value.to_date === "" || this.catalogAddForm.value.to_date === undefined || this.catalogAddForm.value.to_date === null) {
      this.toastr.error('Please Choose To Date');
      this.SpinnerService.hide();
      return false;
    }
    // if (this.catalogAddForm.value.packing_price === "") {
    //   this.toastr.error('Please Enter Packing Price');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.catalogAddForm.value.delivery_date === "") {
    //   this.toastr.error('Please Enter Delivery Date');
    //   this.SpinnerService.hide();
    //   return false;
    // }

    if (this.catalogAddForm.value.direct_to === "" || this.catalogAddForm.value.direct_to === undefined || this.catalogAddForm.value.direct_to === null) {
      this.toastr.error('Please Enter Direct To');
      this.SpinnerService.hide();
      return false;
    }
    if (this.catalogAddForm.value.uom.id === undefined || this.catalogAddForm.value.uom.id === null) {
      this.toastr.error('Please Select Valid UOM');
      this.SpinnerService.hide();
      return false;
    }
    if (this.catalogAddForm.value.product_name.id === undefined || this.catalogAddForm.value.product_name.id === null) {
      this.toastr.error('Please Select Valid Product');
      this.SpinnerService.hide();
      return false;
    }
    let data=this.createFormate()
    this.atmaService.createCatalogForm(data, this.branchViewId)

      .subscribe(res => {

        if (res.id === undefined) {
          this.notification.showError(res.description);
          this.SpinnerService.hide();
          return false;
        }
        else {
          this.notification.showSuccess("Saved Successfully....")
          console.log("res", res)
          this.SpinnerService.hide();
          this.onSubmit.emit();
          return true
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

  // namevalidation(event){

  //   var inp = String.fromCharCode(event.keyCode);

  //   if (/[a-zA-Z0-9-/  ]/.test(inp)) {
  //     return true;
  //   } else {
  //     event.preventDefault();
  //     return false;
  //   }
  // }

  addressvalidation(event) {

    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9-_#@.', /&]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  producttypedata(data) {
    this.product_type = data
    this.product_type_id = data?.id
    console.log("product_type...", this.product_type)
    this.product_id = data?.id
    console.log("product_type_id......", this.product_type_id)
    // if(this.product_type_id){
    //   this.productfieldChildObj= {
    //     label: "Product Name",
    //     method: "get",
    //     url: this.vendorURL + "mstserv/search_mst_product_prpo",
    //     params:  "&query=",
    //     searchkey: "query",
    //     displaykey: "name",
    //     // wholedata: true,
    //     "Depkey": "id",
    //     "DepValue": "request_type",
    //     required: true,
    //     formcontrolname: 'product_name',
    //   };
    //   // this.productfield= {
    //   //   label: "Product Name",
    //   //   method: "get",
    //   //   url: this.vendorURL + "mstserv/search_mst_product_prpo",
    //   //   params: "&request_type=" + this.product_type_id + "&query=",
    //   //   searchkey: "query",
    //   //   displaykey: "name",
    //   //   wholedata: true,
    //   //   required: true,
    //   //   formcontrolname: 'product_name',
    //   // };
    //   // this.ChildObj2 = {
    //   //   label: "Configuration",
    //   //   method: "get",
    //   //   url: this.vendorURL + "mstserv/product_configuration",
    //   //   params: "&code=" + this.product_code,
    //   //   searchkey: "query",
    //   //   displaykey: "configuration",
    //   //   Depkey: "specification",
    //   //   DepValue: "specification",
    //   //   formcontrolname: 'Configuration',
    //   //   // defaultvalue: data.subtax, configuration,specification
    //   //   // required: true
    //   // }
    //   // this.ParentObj2 = {
    //   //   label: "Specification",
    //   //   "method": "get",
    //   //   "url": this.vendorURL + "mstserv/product_specification",
    //   //   params: "&code=" + this.product_code,
    //   //   searchkey: "query",
    //   //   displaykey: "specification",
    //   //   formcontrolname: 'Specifications', 
    //   //   // defaultvalue: data.tax,configuration,specification
    //   //   // required: true
    //   // }
    //   // this.ParentObj = {
    //   //   label:"Make",
    //   //   "method": "get",
    //   //   "url": this.vendorURL + "mstserv/product_makemodel",
    //   //   params: "&m_type=" + "make" + "&code=" + this.product_code,
    //   //   searchkey: "query",
    //   //   displaykey: "name",
    //   //   formcontrolname: 'Modename',
    //   //   // defaultvalue: data.tax,
    //   //   // required: true
    //   // }
    //   // this.ChildObj = {
    //   //   label: "Model",
    //   //   "method": "get",
    //   //   "url": this.vendorURL + "mstserv/product_makemodel",
    //   //   params: "&m_type=" + "model" + "&code=" + this.product_code,
    //   //   searchkey: "query",
    //   //   "displaykey": "name",
    //   //   "Depkey": "id",
    //   //   "DepValue": "make_id",
    //   //   formcontrolname: 'Modalname',
  
    //   //   // defaultvalue: data.subtax,
    //   //   // required: true
    //   // }
    //   this.directorNameList =[]

    // }
    // else{
    //   this.productfieldChildObj ={label:"Product Name"}
    //   this.ParentObj ={label:"Make"};
    //   this.ChildObj = {label:"Model"};
    //   this.ParentObj2 ={label:"Specification",
    //     formcontrolname: 'Specifications',
    //   };
    //   this.ChildObj2 = {label:"Configuration",
    //     formcontrolname: 'Configuration',
    //   };
    //   this.directorNameList =[]
    //  }


  }

  productdata(data) {
    this.productID = data
    this.product_code = data?.code
    console.log("Data...", this.product_code)
    this.product_id = data?.id
    console.log("Id......", this.product_id)
    if(this.product_code){

      this.ChildObj2 = {
        label: "Configuration",
        method: "get",
        url: this.vendorURL + "mstserv/product_configuration",
        params: "&code=" + this.product_code,
        searchkey: "query",
        displaykey: "configuration",
        Depkey: "specification",
        DepValue: "specification",
        formcontrolname: 'Configuration',
        // defaultvalue: data.subtax, configuration,specification
        // required: true
      }
      this.ParentObj2 = {
        label: "Specification",
        "method": "get",
        "url": this.vendorURL + "mstserv/product_specification",
        params: "&code=" + this.product_code,
        searchkey: "query",
        displaykey: "specification",
        formcontrolname: 'Specifications', 
        // defaultvalue: data.tax,configuration,specification
        // required: true
      }
      this.ParentObj = {
        label:"Make",
        "method": "get",
        "url": this.vendorURL + "mstserv/product_makemodel",
        params: "&m_type=" + "make" + "&code=" + this.product_code,
        searchkey: "query",
        displaykey: "name",
        formcontrolname: 'Modename',
        // defaultvalue: data.tax,
        // required: true
      }
      this.ChildObj = {
        label: "Model",
        "method": "get",
        "url": this.vendorURL + "mstserv/product_makemodel",
        params: "&m_type=" + "model" + "&code=" + this.product_code,
        searchkey: "query",
        "displaykey": "name",
        "Depkey": "id",
        "DepValue": "make_id",
        formcontrolname: 'Modalname',
  
        // defaultvalue: data.subtax,
        // required: true
      }
      this.directorNameList =[]

    }
    else{
      this.ParentObj = { label: "Make",
        formcontrolname: 'Modename',
       }
      this.ChildObj = { label: "Model",
        formcontrolname: 'Modalname',
       }
      // this.ParentObj ={label:"Make",};
      // this.ChildObj = {label:"Model"};
      this.ParentObj2 ={label:"Specification",
        formcontrolname: 'Specifications',
      };
      this.ChildObj2 = {label:"Configuration",
        formcontrolname: 'Configuration',
      };
      this.catalogAddForm.get('Modename').reset()
      this.catalogAddForm.get('Modalname').reset()
      this.catalogAddForm.get('Specifications').reset()
      this.catalogAddForm.get('Configuration').reset()
      this.directorNameList =[]
     }

    // this.product_make = make
    // console.log("Make...",this.product_make)
    // this.categoryID = data.category
    // this.subcategoryID = data.subcategory
    let catelog = data["category"];
    let subcatelog = data["subcategory"];
    if (data == undefined || data == "" || data == null) {
      this.catalogAddForm.get('category').setValue('')
      this.catalogAddForm.get('subcategory').setValue('')
    }
    else {
      // let catid = catelog['id'];
      // this.catelogName = catelog['name']
      this.catelogName = catelog.name
      // let subcatid = subcatelog['id'];
      this.subCatelogName = subcatelog.name
      this.catalogAddForm.patchValue({
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
    this.catalogAddForm.patchValue({
      uom: e,
    });
  }
  // makedata($event)
  makedata(e) {
    console.log("event", e);
    this.catalogAddForm.patchValue({
      Modename: e,
    });
  }
  modaldata(e) {
    console.log("event", e);
    this.catalogAddForm.patchValue({
      Modalname: e,
    });
  }

  frtodatecatlog: any = { "fromobj": { label: "Date From", required: true, formcontrolname:"from_date" }, toobj: { label: "Date To", required: true, formcontrolname:"to_date" } }

  // fromdatecatlogfun(catloggfrom) {
  //   this.catalogAddForm.patchValue({
  //     from_date: catloggfrom
  //   })
  // }

  // todatecatlogfun(catloggto) {
  //   this.catalogAddForm.patchValue({
  //     to_date: catloggto
  //   })
  // }

  submit() {
    this.onSubmit.emit()
  } directorNameList: any[] = []
  //  "columnname": "Preview", "key": "statuus","icon":"visibility" , button:true, function: true,
  //  clickfunction:this.previewrules.bind(this)}
  // ,configuration,specification
  SummaryspecsconfigData: any = [
    { columnname: "Specification", key: "Specification", type: 'object', objkey: 'specification' },
    { columnname: "Configuration", key: "configuration", type: 'object', objkey: 'configuration' },
    { columnname: 'Edit', icon: 'edit', key: 'edit', button: true, function: true, clickfunction: this.editspec.bind(this) },
    { columnname: 'Delete', icon: 'delete', function: true, button: true, key: 'delete', clickfunction: this.deletespec.bind(this) }

  ]
  SummaryApicatloguecreatemodifyObjNew: any = { FeSummary: true, data: this.directorNameList }
  deletespec(data) {
    let index = this.directorNameList.findIndex(i => JSON.stringify(i) === JSON.stringify(data));
    this.directorNameList.splice(index, 1);

  }
  create: boolean = true
  global_index: number = -22
  editspec(data) {
    let index = this.directorNameList.findIndex(i => JSON.stringify(i) === JSON.stringify(data));
    this.global_index = index
    let obj = this.directorNameList[index];

    // this.catalogAddForm.get("Specification").patchValue(obj?.specification,{ emitEvent: false })
    // this.catalogAddForm.get("Configuration").patchValue(obj?.configuration,{ emitEvent: false })

    this.catalogAddForm.patchValue({
      Specifications: obj?.Specification,
      Configuration: obj?.configuration,
       
    })
//     this.ChildObj2 = {
//       label: "Configuration",
//       method: "get",
//       url: this.vendorURL + "mstserv/product_configuration",
//       params: "&code=" + this.product_code,
//       searchkey: "query",
//       displaykey: "configuration",
//       Depkey: "specification",
//       DepValue: "specification",
//       formcontrolname: 'Configuration',
// // "Specification": spec,
// // "configuration": config
//       // defaultvalue: data.subtax, configuration,specification
//       // required: true,
//       // defaultvalue: obj?.configuration
//     }
//     this.ParentObj2 = {
//       label: "Specification",
//       "method": "get",
//       "url": this.vendorURL + "mstserv/product_specification",
//       params: "&code=" + this.product_code,
//       searchkey: "query",
//       displaykey: "specification",
//       // defaultvalue: data.tax,configuration,specification
//       // required: true,
//       // defaultvalue: obj?.Specification
//       formcontrolname: 'Specifications', 
//     }
    // this.ParentObj2.defaultvalue = obj?.Specification
    // this.ChildObj2.defaultvalue = obj?.configuration
    this.create = false


  }
  addCatalog() {


    let config = this.catalogAddForm?.get("Configuration")?.value
    let spec = this.catalogAddForm?.get("Specifications")?.value;
    if (config && spec) {
      if (this.create
      ) {
        let specExists = this.directorNameList.some(i => JSON.stringify(i?.Specification) === JSON.stringify(spec));

        if (!specExists) {
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
        // this.restformcatlog = []
        this.catalogAddForm.get("Configuration").reset()
        this.catalogAddForm?.get("Specifications").reset()
        return false

      }
      else {
        let data = {
          "Specification": spec,
          "configuration": config
        };
        this.directorNameList[this.global_index] = data
        this.create = true
        this.ParentObj2.defaultvalue = ''
        this.ChildObj2.defaultvalue = ''
        this.restformcatlog = []
        return false
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
  selectedvalues(partdata) {
    this.catalogAddForm.patchValue({
      // Modename: partdata,
      make:partdata?.id

    })
    // this.directorNameList = []
    //   Modename: [''],
      
    // if (this.catalogAddForm.value.tax.name == "GST") {
    //   // this.taxratefield=false;
    //   // this.exmpt_flag = false;
    //   // this.taxform.value.isexcempted = false
    //   // this.taxform.get('isexcempted').setValue(false);
    //   // this.isexcempted = 'N'
    // } else {
    //   // this.taxratefield=true;
    // }
    this.Modenames = partdata.name;
    this.Modenames_code = partdata.code;
    this.Modenames_id = partdata.id;
  }
  selectedvaluess(childata) {
    this.catalogAddForm.patchValue({
      // Modalname: childata,
      model:childata?.id

    })
    // this.directorNameList = []

  }

  // selectedvalues2(partdata) {
  //   this.catalogAddForm.patchValue({
  //     Specifications: partdata
  //   })

  // }

  // selectedvaluess2(childata) {
  //   this.catalogAddForm.patchValue({
  //     Configuration: childata
  //   })
  // }


  ParentObj: any = { label: "Make",
    formcontrolname: 'Modename',
   }
  ChildObj: any = { label: "Model",
    formcontrolname: 'Modalname',
   }
  ParentObj2: any = { label: "Specification",
    formcontrolname: 'Specifications',
   }
  ChildObj2: any = { label: "Configuration",
    formcontrolname: 'Configuration',
   }


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