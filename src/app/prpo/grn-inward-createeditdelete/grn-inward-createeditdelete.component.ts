import { Component, ComponentFactoryResolver, EventEmitter, OnInit, Output, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup, FormControl, FormArray, FormGroupDirective } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';

import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';

import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../error-handling-service.service'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DecimalPipe } from '@angular/common';
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

export interface branchcodeLists {
  name: string;
  code: string;
  id: number;
}
export interface SupplierName {
  id: number;
  name: string;
}
interface OtherAttributesCache {
  rawData: any[];
  values: any[];
  formatted: any[];
}

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
  selector: 'app-grn-inward-createeditdelete',
  templateUrl: './grn-inward-createeditdelete.component.html',
  styleUrls: ['./grn-inward-createeditdelete.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})

export class GrnInwardCreateeditdeleteComponent implements OnInit {
  @ViewChild('mytemplate') tmpref:TemplateRef<any>;
    @ViewChild('secondPopup') secondPopupRef!: TemplateRef<any>;
    
  GRNForm: FormGroup;
  GRNForm2: FormGroup;
  GrnAssestForm: any;
  SelectSupplierForm: FormGroup;
  supplierchooseForm: FormGroup;
  specificationForm: FormGroup;
  bulkuploadform:FormGroup;
  fileDatas: any = [];
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  grninwardList: Array<any>;
  presentpagegrninward: number = 1;
  currentepagegrninward: number = 1;
  has_nextgrninward = true;
  has_previousgrninward = true;
  pageSizegrninward = 10;
  grninwardpage: boolean = true;
  grninwardsummary: any;
  supplierNameData: any;
  isLoading: boolean;
  qty = new FormControl('');
  SupplierName: string;
  SupplierCode: string;
  SupplierGSTNumber: string;
  SupplierPANNumber: string;
  Address: string;
  City: string;
  idValue: any;
  tomorrow = new Date();
  selectsupplierlist: any;
  fileName: any;
  grndetails: Array<any> = [];
  otherattributespatching: Array<any> = [];
  otherattributespatchingdropdown: Array<any> = [];
  addassetbutton: boolean = false;
  isDisabled = true
  suplierids = [];
  supp: any;
  line1: any;
  line2: any;
  line3: any;
  selectedToggle:any='';
  enteredQty : any = '';
  // isDisabledcheckbox = [true, true, true, true, true, true, true, true, true, true]
  // quantitycount: number;
  inputSUPPLIERValue = "";
  inputSUPPLIERValueID = "";
  branchNameData: any;
  // BranchName: string;
  suplist: any;
  // assetdatas: boolean = false
  // JsonArray = []
  // supparrayid: any;
  default = true
  alternate = false
  successdata: any[] = [];
  inputDCValue = "";
  inputINVValue = "";
  // isDisabledslidebar = [false, false, false, false, false, false, false, false, false, false]
  currentPage: number = 1;
  // equaldata: any;
  // check: boolean;
  // summarylist: any;
  // validationdata: any;
  // validationdat: any;
  // validationda: any;
  // condition: any;
  // Disabletext = false
  // Defaulttext = true
  fromdate: any;
  todate: any;
  // isCheckBox = true;
  // quantity: any;
  // un used lines------
  // defaulttext = true
  // alternatetext = false
  // isDisabledslidebars: boolean
  // sss: any
  //-ends here --------
  // equaldataid: any;
  // validationid: any;
  // elsevalidation: any;
  issubmit = false
  // testQty: any;
  // testArray = []
  // summaryid = []
  // pushdataid: any;
  // spid: Array<any>
  // pid: any;
  // qtyValues: any;
  // defa = [true, true, true, true, true, true, true, true, true, true]
  // alter = [false, false, false, false, false, false, false, false, false, false]
  // checker = [true, true, true, true, true, true, true, true, true, true]
  loadingProcesses=0;
  clicked = true;
  @ViewChild('name') supplier_names;
  @ViewChild(FormGroupDirective) fromGroupDirective: FormGroupDirective
  @ViewChild('closebtn2', { static: false }) closebtn2!: ElementRef<HTMLButtonElement>;
   @ViewChild('closebox') closebox: any;
 @ViewChild('takeInput', { static: false })
//  @ViewChild('fileinput1', { static: false })
//  @ViewChild('takeInput1', { static: false })
 
  @Output() onCancel = new EventEmitter<any>();
  @Output() OnCancel= new EventEmitter<any>();


  @Output() onSubmit = new EventEmitter<any>();
  popup: number = 1;
  itemsPerPage = 10;
  showLoadMore: boolean = false;
  prod_name:any;
  prodcode:any;
  productForm: FormGroup;
  myForm: FormGroup;
  formstores:any=[]
  has_nextt: boolean = true;
  has_previouss: boolean = true;
  presentpages: number = 1;
  configs: any[];
  final_attributes: any[];
  innerDialogRef: MatDialogRef<any>;  // Declare to store reference
  secondDialogRef!: MatDialogRef<any>;
  assetpo_id:any;
  assetpodetails_id:any;
  productassetcode:any;
  quantityasset:any;
  checkboxclicked:boolean = false
  bulkclicked:boolean = false
  file: File = null;
  bulkasset:any[]=[];
  prodnameview:any;
  makenameview:any;
  modelnameview:any;
  specnameview:any;
  bulkfilename='';
  changedrecevedamt: number;
  isreceivedqtychange: boolean=false;
  changedrecevedqnty: any;
  // updateddetails: FormArray;
  updateddetails: FormArray = this.fb.array([]);
  isamountbased: boolean = false;
  rcdqnty: FormArray;
  SupplierArray: any;
  crntamt: FormArray;
  // crntamtArray: any;
  isqntybased: boolean = false;
  is_qty_based: any;
  newassetdetails: any[];
  isbulk = 0;
  // otherAttributesCache: any;
  
  otherAttributesCache: Map<string, any> = new Map();

  grndata: any;
  grndetailsdata: any;
  formArraySubscription: any;
  sam_array: any[]=[];
displayAmount: string[] = [];


  constructor(private fb: FormBuilder, private router: Router,
    private shareService: SharedService, private dataService: PRPOSERVICEService,public dialog: MatDialog,
    private prposhareService: PRPOshareService, private notification: NotificationService, private toastr: ToastrService, private datePipe: DatePipe, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService,private decimalpipe:DecimalPipe) { }

  ngOnInit(): void {
   
    this.GRNForm = this.fb.group({
      pono: [''],
      prno: [''],
      suppliername: [''],
      branchcode: [''],
    })
    this.myForm = this.fb.group({
      attributes: this.fb.array([])
    });

    this.SelectSupplierForm = this.fb.group({
      gstno: [''],
      code: [''],
      panno: [''],
      name: ['']
    })
     this.bulkuploadform = this.fb.group({
      fileArr: [''],
    })
    this.GRNForm2 = this.fb.group({
      dcnote: [''],
      invoiceno: [''],
      date: [''],
      remarks: [''],
      file_key:[["file1"]],
      fileData: [''],
      suppliername: [''],
      locations: [''],
      isbulk: [0],  //whule doing bulk upload need to change this as one 
      amount : [''],

      grndetails: new FormArray([
      ]),
    })
    this.GrnAssestForm = this.fb.group({
      // assestserial_no: '',
      // assest_manufacturer: [''],
      // asseststart_date: '',
      // assestend_date: '',
      // isassest: '',

      assetitems: new FormArray([])




    })
    let suppliername: String = "";
    this.getsuppliername(this.suplist, suppliername);
    this.SelectSupplierForm.get('name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getsuppliername(this.suplist, value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierNameData = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

    let branchcode: String = "";
    this.getbranchname(branchcode);
    this.GRNForm.get('branchcode').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getbranchname(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchNameData = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    this.getsuppliername(this.suplist, "");
      this.GRNCreateEditForm();
      this.grninwardList?.forEach(grn => {
  grn._tempQty = grn.qty - grn.received_quantity;
});

  }

  //-------------------------------------------------------
  public displaytest(SupplierName?: SupplierName): string | undefined {
    return SupplierName ? SupplierName.name : undefined;
  }
  //--------------------------------------------------------

  public displayFn(SupplierName?: SupplierName): string | undefined {
    return SupplierName ? SupplierName.name : undefined;
  }

  get supplierName() {
    return this.SelectSupplierForm.get('name');
  }

  getsuppliername(id, suppliername) {
    // this.SpinnerService.show();
    this.showSpinner()
    this.dataService.getsuppliername(id, suppliername)
      .subscribe((results) => {
        // this.SpinnerService.hide();
                this.hideSpinner();
        let datas = results["data"];
        this.supplierNameData = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        // this.SpinnerService.hide();
        this.hideSpinner();

      })
  }
  public displayFns(BranchName?: branchcodeLists): string | undefined {
    let code = BranchName ? BranchName.code : undefined;
    let name = BranchName ? BranchName.name : undefined;
    return BranchName ? code + "-" + name : undefined;

  }
  get branchName() {
    return this.GRNForm.get('branchcode');
  }
  getbranchname(bankname) {
    // this.SpinnerService.show();
        this.showSpinner()
    this.dataService.getbranchname(bankname)
      .subscribe((results) => {
        // this.SpinnerService.hide();
                        this.hideSpinner();
        let datas = results["data"];
        this.branchNameData = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        // this.SpinnerService.hide();
            this.hideSpinner()

      })
  }
  grnindet() {
    let group = new FormGroup({
      podetails_id: new FormControl(''),
      poheader_id: new FormControl(''),
      product_id: new FormControl(''),
      quantity: new FormControl(''),
      uom: new FormControl(''),
      unitprice: new FormControl(''),
      amount: new FormControl(''),
      taxamount: new FormControl(''),
      totalamount: new FormControl(''),
      isremoved: new FormControl(''),
      remarks: new FormControl(''),
      podelivery_id: new FormControl(''),
      date: new FormControl(''),
      qty: new FormControl(''),
      grnflag: new FormControl(''),
      branch_id: new FormControl(''),
      // other_attributes: new FormControl(''),
    })
    return group
  }
  ///////////////add row in details
  addSection() {
    const control = <FormArray>this.GRNForm2.get('grndetails');
    control.push(this.grnindet());
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  only_numalpha(event) {
    var k;
    k = event.charCode;
    // return ((k > 96 && k < 123) || (k >= 48 && k <= 57));
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  getgrnView(data) {
    this.dataService.getgrninwardView(data.id)
      .subscribe(result => {
        let datas = result
        let overall = datas;
        // for (var i = 0; i < overall.length; i++) {
          this.supp = overall
          this.SupplierName = this.supp.name;
          this.SupplierCode = this.supp.code;
          this.SupplierGSTNumber = this.supp.gstno;
          this.SupplierPANNumber = this.supp.panno;
          this.Address = this.supp.address_id;
          this.line1 = this.supp.address_id.line1;
          this.line2 = this.supp.address_id.line2;
          this.line3 = this.supp.address_id.line3;
          this.City = this.supp.address_id.city_id.name;
        // }
        this.inputSUPPLIERValue = data.name;
        this.inputSUPPLIERValueID = data.id;
        this.GRNForm.patchValue({
          suppliername: this.inputSUPPLIERValue,
        })
      })
  }
  SelectSuppliersearch() {
    let searchsupplier = this.SelectSupplierForm.value;
    if (searchsupplier.code === "" && searchsupplier.panno === "" && searchsupplier.gstno === "") {
      this.getsuppliername("", "");
    }
    else {
      this.alternate = true;
      this.default = false;
      this.Testingfunctionalternate();
    }
  }
  Testingfunctionalternate() {
    let searchsupplier = this.SelectSupplierForm.value;
    this.SpinnerService.show();
    this.dataService.getgrnselectsupplierSearch(searchsupplier)
      .subscribe(result => {
        this.SpinnerService.hide();
        this.selectsupplierlist = result.data
        this.successdata = this.selectsupplierlist
        this.getgrnView(this.successdata[0])
      })
  }
  fileProgress(fileInput: any) {
    // this.fileData = fileInput.target.files;
    // this.fileName = this.fileData[0].name;
//        if(fileInput.target.value.length>21){
// console.log("file target data length",fileInput.target.value)
//     }
    for (var i = 0; i < fileInput.target.files.length; i++) {
      this.fileDatas.push(fileInput.target.files[i]);
    }
  }
  RemoveFileData(files){
    let index=this.fileDatas.indexOf(files)
    if(index>=0){
      this.fileDatas.splice(index,1)
    }
    
  }
  dataclear() {
    this.SelectSupplierForm.controls['gstno'].reset("")
    this.SelectSupplierForm.controls['code'].reset("")
    this.SelectSupplierForm.controls['panno'].reset("")
    this.SelectSupplierForm.controls['name'].reset("")

    this.SupplierName = "";
    this.SupplierCode = "";
    this.SupplierGSTNumber = "";
    this.SupplierPANNumber = "";
    this.Address = "";
    this.line1 = "";
    this.line2 = "";
    this.line3 = "";
    this.City = "";
    this.suplist = "";
    // this.JsonArray = [];
    this.alternate = false
    this.default = true
  }
  dataclearinwardform() {
    this.GRNForm.controls['pono'].reset("")
    this.GRNForm.controls['prno'].reset("")
    this.GRNForm.controls['branchcode'].reset("")
    this.GRNForm.controls['suppliername'].reset("")
    this.inputSUPPLIERValueID = ""
    this.isamountbased = false 
    // this.selectedToggle = '0'
    this.selectedToggle = false
    this.isqntybased = false
    this.GRNForm2.reset();

// Clear the FormArray
(this.GRNForm2.get('grndetails') as FormArray).clear();

// Reset isbulk to 0 (default)
this.GRNForm2.get('isbulk')?.setValue(0);

// If file_key is required to be ["file1"] again:
this.GRNForm2.get('file_key')?.setValue(["file1"]);

//RESET Action checkbox
this.grninwardList.forEach(item =>{
  item.CheckboxenableDiableArrays  = false;
})



    this.GRNCreateEditForm();
  }
  supplier() {
    this.supplierchooseForm.reset()
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////omit special characters
  omit_special_char(event) {
    var k;
    k = event.charCode;
    // return ((k > 64 && k < 91) || (k > 96 && k < 123) || (k >= 48 && k <= 57));
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || (k >= 48 && k <= 57) || (k == 46)); //6556

  }
  total_count: any;
  /////////////////////////////////////////////////////////////////////////////////////////////////////// summary
  GRNCreateEditForm(pageNumber = 1, pageSize = 10) {
            this.showSpinner();

    let searchgrninward = this.GRNForm.value;
    searchgrninward.suppliername = this.inputSUPPLIERValueID
    if (this.GRNForm.value.branchcode == undefined) {
      this.GRNForm.value.branchcode = ""
    }
    if (this.GRNForm.value.branchcode.id == undefined) {
      this.GRNForm.value.branchcode = this.GRNForm.value.branchcode.id
    }
    else {
      this.GRNForm.value.branchcode = this.GRNForm.value.branchcode.id
    }
    // searchgrninward.branchcode = this.GRNForm.value.branchcode.id
    for (let i in searchgrninward) {
      if (!searchgrninward[i]) {
        delete searchgrninward[i];
      }
    }
    // this.SpinnerService.show();
    // this.dataService.getnewgrncreatesummarySearch(searchgrninward, pageNumber, pageSize)
    this.dataService.getnewgrncreatesummarySearch(searchgrninward, pageNumber, pageSize)
    .pipe(
    finalize(() => {
      // this.SpinnerService.hide();  // ✅ Only hide when this API is complete
        this.hideSpinner();

    })
  )
      .subscribe(result => {
        // this.SpinnerService.hide();

        this.grninwardList = result['data']
        this.total_count = result?.total_count
        console.log("grn data summary", this.grninwardList)
        let datapagination = result["pagination"];
        if (this.grninwardList?.length === 0) {
          this.grninwardpage = false
        }
        if (this.grninwardList.length > 0) {
          this.has_nextgrninward = datapagination.has_next;
          this.has_previousgrninward = datapagination.has_previous;
          this.presentpagegrninward = datapagination.index;
          this.grninwardpage = true

        }

         this.rcdqnty = new FormArray(
                  this.grninwardList.map((i) => new FormControl( this.round2(i?.qty - i?.received_quantity)))
                );

                //  this.rcdqnty = new FormArray(
                //   this.grninwardList.map((i) =>  new FormControl(((i.qty - i.received_quantity) || 0).toFixed(2)) )
                // );


          // this.crntamt = new FormArray(
          //         this.grninwardList.map((i) => new FormControl( this.round2((i?.qty-i?.received_quantity) * i?.unitprice)))
          //       );

          this.crntamt = new FormArray(
  this.grninwardList.map((i) =>
    new FormControl(
      this.round2(
        i?.is_qty_based == 1
          ? ((+i?.qty - +i?.received_quantity) * +i?.unitprice)   // if qty based
          : (+i?.amount - +i?.received_amount)                    // if amount based
      ) )));


// initialize displayAmount with formatted values
// this.displayAmount = this.crntamt.value.map((val: number) =>
//   val != null ? val.toLocaleString('en-IN') : ''
// );

  // this.displayAmount = this.crntamt.value.map((val: number) =>
  //   val != null
  //     ? val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  //     : ''
  // );
 this.displayAmount = this.crntamt.value.map((val: number) =>
    val != null
      ? val: ''
  );




        if (result) {
          this.SpinnerService.hide();
          if (this.GRNForm2.value.grndetails.length > 0) { this.UpdatingWhenUsingPagination() }
        }
        return this.grninwardList.map(row => {
          return Object.assign({}, row, { disableds: false, fieldtext: false,selectedToggle: '', });
        });
      },(error) => {
        this.errorHandler.handleError(error);
        // this.SpinnerService.hide();
                        this.hideSpinner();

      }
      )
  }

  round2(value: any): number {
  return parseFloat(parseFloat(value).toFixed(2));
}

  nextClickgrninward() {
    if (this.has_nextgrninward === true) {
      this.currentepagegrninward = this.presentpagegrninward + 1
      this.GRNCreateEditForm(this.presentpagegrninward + 1)
    }
  }
  previousClickgrninward() {
    if (this.has_previousgrninward === true) {
      this.currentepagegrninward = this.presentpagegrninward - 1
      this.GRNCreateEditForm(this.presentpagegrninward - 1)
    }
  }
  getFormArray(): FormArray {
    return this.GRNForm2.get('grndetails') as FormArray;
  }
  // getData(data, indexOfSelectedRow, quantityvalue, e, choosentype,crntamt,orderamt,balamt) {
  getData(data, indexOfSelectedRow, quantityvalue,crntamount, e, choosentype,) {
  console.log("indexOfSelectedRow", indexOfSelectedRow)
  console.log("quantityvalue", quantityvalue)
  console.log("choosentype", choosentype)
  console.log("choosen data", data)
  //  this.Assetarrray = this.bulkasset  while doing bulk upload need to check here
    let valueOfQuantityandRemainingQty = data.qty - data.received_quantity
  if(choosentype == 'checkbox'){
    if (quantityvalue > valueOfQuantityandRemainingQty || quantityvalue == 0) {
      this.notification.showWarning(" 'Current Received Quantity' must be less than or equal to 'Remaining Quantity'")
      e.preventDefault();
      e.stopPropagation();
      return false
    }
  }
  console.log("auto selected value value",data)
    console.log("event.target total  value", e.target)
    let grnHeaderData = this.GRNForm2.value
    let checkCommonValidationAndEnable = this.GRNForm2.value.grndetails
    if(e.target.checked == false) {
      data.CheckboxenableDiableArrays = false
      this.checkboxclicked = false
      this.removeSection(data, e,indexOfSelectedRow)
    }
    else {
      if (data.is_asset == 1) {
        console.log("this.Assetarrray -------------------------------------->", this.Assetarrray)
        if (this.Assetarrray.length == 0 ) {
          this.notification.showWarning("Please Enter Asset ")
          e.preventDefault();
          e.stopPropagation();
          return false
        }
      }
      if (data.is_asset == 1) {
      if ((this.Assetarrray.length != this.TotalAssetRequired)) {
        this.notification.showWarning("Required Asset Not Satisfied ")
        e.preventDefault();
        e.stopPropagation();
        return false
      }
    }
      this.GRNForm2.patchValue({
        suppliername: data.supplierbranch_id.name,
        locations: data.branch_id.name
      })
      data.CheckboxenableDiableArrays = true
      data.fieldtext = true

      
      
      let podetails_id: FormControl = new FormControl('');
      let poheader_id: FormControl = new FormControl('');
      let product_id: FormControl = new FormControl('');
      let quantitycontrol: FormControl = new FormControl('');
      let uom: FormControl = new FormControl('');
      let unitprice: FormControl = new FormControl('');
      let amount: FormControl = new FormControl('');
      let taxamount: FormControl = new FormControl('');
      let totalamount: FormControl = new FormControl('');
      let isremoved: FormControl = new FormControl('');
      let remarks: FormControl = new FormControl('');
      let podelivery_id: FormControl = new FormControl('');
      let date: FormControl = new FormControl('');
      let grnflag: FormControl = new FormControl('');
      let ASSET: FormControl = new FormControl('')
      let assest_ids: FormControl = new FormControl('')
      let Received_Date: FormControl = new FormControl('');
      let branch_id: FormControl = new FormControl('');
      let crntamt: FormControl = new FormControl('');
      // let orderamt: FormControl = new FormControl('');
      // let balamt: FormControl = new FormControl('');
      let is_qty_based: FormControl = new FormControl('');
      let is_bulk : FormControl = new FormControl('');


      
      // let other_attributes: FormControl = new FormControl('');
      podetails_id.setValue(data.podetails_id)
      poheader_id.setValue(data.poheader_id)
      product_id.setValue(data.product_id.id)
      // quantity.setValue(data.podetails_id.qty)
      quantitycontrol.setValue(+quantityvalue)
      uom.setValue(data.uom)
      unitprice.setValue(data.unitprice)
      // amount.setValue(data.amount)
      amount.setValue(crntamount)
      taxamount.setValue(data.taxamount)
      // totalamount.setValue(data.totalamount)
      totalamount.setValue(crntamount)
      isremoved.setValue(data.isremoved)
      remarks.setValue(data.supplierbranch_id.remarks)
      podelivery_id.setValue(data.id)
      date.setValue(data.date)
      grnflag.setValue(data.flag)
      ASSET.setValue(this.Assetarrray)
      let assest_idsdata = this.Assetarrray.map(x => x.id)
      console.log("Asset IDS only", assest_ids)
      assest_ids.setValue(assest_idsdata)
      branch_id.setValue(data.branch_id.id)
      crntamt.setValue(crntamount)
      is_bulk.setValue(this.isbulk)
      // orderamt.setValue(orderamt)
      // balamt.setValue(balamt)
      if(this.isamountbased == true){
        is_qty_based.setValue(0)      }
      else{
                is_qty_based.setValue(1)

      }
      // other_attributes.setValue(this.other_attributes[indexOfSelectedRow])
      // id.setValue(data.id)
      this.getFormArray().push(new FormGroup({
        podetails_id: podetails_id,
        poheader_id: poheader_id,
        product_id: product_id,
        quantity: quantitycontrol,
        uom: uom,
        unitprice: unitprice,
        amount: amount,
        taxamount: taxamount,
        totalamount: totalamount,
        isremoved: isremoved,
        remarks: remarks,
        podelivery_id: podelivery_id,
        date: date,
        grnflag: grnflag,
        Received_Date: date,
        assest_ids: assest_ids,
        ASSET: ASSET,
        branch_id:branch_id,
        crntamt : crntamt,
        // orderamt : orderamt,
        // balamt : balamt,
        is_qty_based : is_qty_based,
        is_bulk : is_bulk
        // other_attributes: other_attributes,
        // other_attributes: this.other_attributes[indexOfSelectedRow],
      }))
      // this.bulkclicked = false
      //disable all other checkboxes
      let CheckboxenableDiableCheck = this.GRNForm2.value
      this.grninwardList.forEach((row, index) => {
        let dataForArrayGrnToDisableInput = this.GRNForm2.value.grndetails
        if (row.id == data.id) {
          row.fieldtext = true
          row.CheckboxenableDiableArrays = true
        }

        //This commonly enabled add assert for same supplier & location
        // if (CheckboxenableDiableCheck.suppliername == row.supplierbranch_id.name && CheckboxenableDiableCheck.locations == row.branch_id.name) {
        //   row.disabled = false;
        // }
        // else {
        //   row.disabled = true;
        //   row.fieldtext = true;
        // }

        //TO Disable the Add aseert for aquantity > 1 which will not allow both qnty based and Amount based

        if(this.isamountbased){
                  if (CheckboxenableDiableCheck.suppliername == row.supplierbranch_id.name && CheckboxenableDiableCheck.locations == row.branch_id.name
                        && +row.qty <= 1) {
          row.disabled = false;
        }
        else {
          row.disabled = true;
          row.fieldtext = true;
        }
        }

         if(!this.isamountbased){
           if (CheckboxenableDiableCheck.suppliername == row.supplierbranch_id.name && CheckboxenableDiableCheck.locations == row.branch_id.name) {
          row.disabled = false;
            }
        else {
          row.disabled = true;
          row.fieldtext = true;
        }
        }

      });
    } 
    this.Assetarrray = []
    this.updateddetails = this.GRNForm2.get('grndetails') as FormArray;
    console.log('this.updateddetails===>',this.updateddetails)
    console.log('this.grndetails pushed values===>',    this.GRNForm2.value.grndetails)

    this.isreceivedqtychange = false
    this.closedialog();
  }
  ////////////////////////////////////////////////////////////////////////////////////////remove section
  removeSection(i, event,indexOfSelectedRow) {
    let dataConfirm;
    if(i.is_asset == 1){
    dataConfirm = confirm("If you want to Change, Selected Asset will be deleted! Do you want to continue?")}
    else{ dataConfirm = true}
    if (dataConfirm == true) {
      let dataremovevaluecheck = this.GRNForm2.value
      let dataremove = this.GRNForm2.value.grndetails
      let index = -1;
      let val = i.id
      let filteredObj = dataremove.find(function (item, ival) {
        if (item.podelivery_id === val) {
          index = ival;
          return ival;
        }
      });
      const control = <FormArray>this.GRNForm2.get('grndetails');
      control.removeAt(index);
      //uncomment this 
       this.rcdqnty.controls[indexOfSelectedRow].setValue( this.round2(i?.qty - i?.received_quantity));
      this.crntamt.controls[indexOfSelectedRow].setValue(( this.round2((i?.qty-i?.received_quantity) * i?.unitprice)));
      // i.selectedToggle[indexOfSelectedRow] = '0'
      this.grninwardList[indexOfSelectedRow].selectedToggle = false

                  /////

      this.grninwardList.forEach((row, index) => {
        if (this.GRNForm2.value.grndetails.length === 0) {
          row.disabled = false;
          row.fieldtext = false
          this.isamountbased = false
            this.isqntybased = false
          this.GRNForm2.controls.suppliername.reset()
          this.GRNForm2.controls.locations.reset()
          if (row.id == val) {
            row.fieldtext = false
          }
          return
        }

         //TO Disable the Add aseert for aquantity > 1 which will not allow both qnty based and Amount based

        if (this.GRNForm2.value.grndetails.length > 0) {
          // if (this.GRNForm2?.value?.suppliername == row.poheader_id?.supplierbranch_id?.name && this.GRNForm2.value?.locations == row.prpoqty_id?.prccbs_id?.branch_id?.name) {

          if(this.isamountbased){
            if (this.GRNForm2?.value?.suppliername == row?.supplierbranch_id?.name && this.GRNForm2.value?.locations == row?.branch_id?.name
              && +row.qty<=1) {

            row.disabled = false;   
            // row.selectedToggle = '0'
            // this.rcdqnty.controls[index].setValue(+i.quantity);
            // this.crntamt.controls[index].setValue(+i.crntamt);
            //  this.rcdqnty.controls[indexOfSelectedRow].setValue( this.round2(i?.qty - i?.received_quantity));
            //  this.crntamt.controls[indexOfSelectedRow].setValue(( this.round2((i?.qty-i?.received_quantity) * i?.unitprice)));
            
          }
          else {
            row.disabled = true;
          }
        
        }

          if(!this.isamountbased){
           if (this.GRNForm2?.value?.suppliername == row.supplierbranch_id?.name && this.GRNForm2?.value?.locations == row.branch_id.name) {
          row.disabled = false;
            }
        else {
          row.disabled = true;
          // row.fieldtext = true;
        }
        }
        }
        if (row.id == val) {
          row.fieldtext = false
        }
        
       
      });
      if(i.is_asset == 1){
      this.notification.showInfo("Asset data deleted")}
      this.Assetarrray = []
    }
    if (dataConfirm == false) {
      event.preventDefault();
      event.stopPropagation();
      return false

    }
  }
  //////////////////////////////////////////////////////////////////////////////////////////////updating while using pagination
  UpdatingWhenUsingPagination() {
    let dataarray = this.GRNForm2.value.grndetails
    let aValueToCheckAndPatch = this.grninwardList


    //   this.grninwardList.forEach((row, index) => {
    //   let headerGrn = this.GRNForm2.value
    //   let dataarray = this.GRNForm2.value.grndetails
    //   dataarray.forEach((rowarray, index) => {
    //     if (rowarray.podelivery_id == row.id) {
    //       row.qtyfield =  +rowarray.quantity
    //     }
    //   })
     
    // });

    //this worked out for the first mtaching id index only 

    // for (let datapatchcheck in aValueToCheckAndPatch) {
    //   let filteredObj = dataarray.find(function (item, ival) {
    //     if (item.podelivery_id === aValueToCheckAndPatch[datapatchcheck].id) {
    //       // aValueToCheckAndPatch[datapatchcheck].qtyfield = +item.quantity
    //       this.rcdqnty.controls[ival].value = +item.quantity
    //       this.crntamt.controls[ival].value = +item.crntamt
    //       aValueToCheckAndPatch[datapatchcheck].CheckboxenableDiableArrays = true
    //     }
    //   });
    // }

    for (let datapatchcheck in aValueToCheckAndPatch) {
  let filteredObj = dataarray.find((item, ival) => {
    if (item.podelivery_id === aValueToCheckAndPatch[datapatchcheck].id) {
      this.rcdqnty.controls[datapatchcheck].setValue(+item.quantity);
      this.crntamt.controls[datapatchcheck].setValue(+item.crntamt);
      aValueToCheckAndPatch[datapatchcheck].CheckboxenableDiableArrays = true;
      // aValueToCheckAndPatch[datapatchcheck].selectedToggle = '0'
      aValueToCheckAndPatch[datapatchcheck].selectedToggle = true

      


    }
  });
}

    this.grninwardList?.forEach((row, index) => {

      let headerGrn = this.GRNForm2.value
      let dataarray = this.GRNForm2.value.grndetails 
      dataarray?.forEach((rowarray, index) => {
        if (rowarray.podelivery_id == row.id) {
          row.fieldtext = true
        }
      })
      // if (headerGrn?.suppliername == row?.poheader_id?.supplierbranch_id?.name && headerGrn?.locations == row?.prpoqty_id?.prccbs_id?.branch_id?.name) {
      //   row.disabled = false;
      // }
      if (headerGrn?.suppliername == row?.supplierbranch_id?.name && headerGrn?.locations == row?.branch_id?.name) {
        row.disabled = false;
      }
      else {
        row.disabled = true;
        row.fieldtext = true;
      }
    });

    // to resilve the above issue 

//     this.grninwardList.forEach(grn => {
//   const matchedItem = dataarray.find(item => item.podelivery_id === grn.id);
//   if (matchedItem) {
//     grn.qtyfield = +matchedItem.quantity;
//     grn.CheckboxenableDiableArrays = true;
//   }
// });

// for (let i = 0; i < aValueToCheckAndPatch.length; i++) {
//   let grn = aValueToCheckAndPatch[i];

//   let matchedItem = dataarray.find(item => item.podelivery_id === grn.id);

//   if (matchedItem) {
//     grn.qtyfield = +matchedItem.quantity;
//     grn.CheckboxenableDiableArrays = true;
//   }
// }


    // this.grninwardList.forEach((row, index) => {
    //   let headerGrn = this.GRNForm2.value
    //   let dataarray = this.GRNForm2.value.grndetails
    //   dataarray.forEach((rowarray, index) => {
    //     if (rowarray.podelivery_id == row.id) {
    //       row.fieldtext = true
    //     row.qtyfield=  +rowarray.quantity
    //     row.CheckboxenableDiableArrays = true


    //     }
    //   })
    //   if (headerGrn?.suppliername == row.poheader_id?.supplierbranch_id?.name && headerGrn.locations == row.prpoqty_id?.prccbs_id?.branch_id.name) {
    //     row.disabled = false;
    //   }
    //   else {
    //     row.disabled = true;
    //     row.fieldtext = true;
    //   }
    // });
//     this.grninwardList.forEach((row, grnIndex) => {
//   const headerGrn = this.GRNForm2.value;
//   const dataarray = headerGrn.grndetails;

//   const matchedRow = dataarray.find(rowarray => +rowarray.podelivery_id === +row.id);

//   if (matchedRow) {
//     console.log(`✅ Matched row id: ${row.id}`);
//     row.fieldtext = true;
//     row.qtyfield = +matchedRow.quantity;
//     row.CheckboxenableDiableArrays = true;
//   }

//   if (
//     headerGrn?.suppliername === row.poheader_id?.supplierbranch_id?.name &&
//     headerGrn.locations === row.prpoqty_id?.prccbs_id?.branch_id.name
//   ) {
//     row.disabled = false;
//   } else {
//     row.disabled = true;
//     row.fieldtext = true;
//   }
// });

  }
  /////////////////////////////////////////////////////////////////////////// submit function
  GRNCreateEditForm2() {
    this.issubmit = true
    // if (this.GRNForm2.value.dcnote == "") {
    //   this.toastr.warning('', 'Please Enter  Dcnote', { timeOut: 1500 });
    //   this.issubmit = false
    //   return false;
    // }
    if (this.GRNForm2.value.invoiceno == "") {
      this.toastr.warning('', 'Please Enter  Invoiceno', { timeOut: 1500 });
      this.issubmit = false
      return false;
    }
    if (this.GRNForm2.value.date == "") {
      this.toastr.warning('', 'Please Enter Date', { timeOut: 1500 });
      this.issubmit = false
      return false;
    }
    if (this.GRNForm2.value.remarks == "") {
      this.toastr.warning('', 'Please Enter Remarks', { timeOut: 1500 });
      this.issubmit = false
      return false;
    }
    if (this.GRNForm2.value.grndetails.length <=0) {
      this.toastr.warning('', 'Make select the PO !!', { timeOut: 1500 });
      this.issubmit = false
      return false;
    }

let grndetailsarray = this.GRNForm2.value.grndetails
    const totalAmount = grndetailsarray.reduce((sum, item) => {
  return sum + (+item.crntamt || 0);  // `+` handles string/number safely
}, 0);

this.GRNForm2.patchValue({
  amount : totalAmount

})

    const currentDate = this.GRNForm2.value
    currentDate.date = this.datePipe.transform(currentDate.date, 'yyyy-MM-dd');
    let dataSubmit = this.GRNForm2.value


    


    for (let data in dataSubmit) {
      delete dataSubmit.suppliername
      delete dataSubmit.locations
    }
//     let other_attributes = this.final_attributes ;
//     const formattedOtherAttribute = this.final_attributes[0].map(attr => attr.configuration ? `${attr.specification}: ${attr.configuration.name || attr.configuration}` : attr.specification)
//   .join(", ");
// const primarySpec = this.final_attributes[0].find(attr => attr.configuration === null)?.specification || "";
// const result = `${primarySpec} : ${formattedOtherAttribute}`;

// console.log(result);
//     console.log('Attributes : ', other_attributes);
    this.SpinnerService.show();
    this.dataService.grnCreateForm(dataSubmit, this.fileDatas)
      .subscribe(result => {
        // this.SpinnerService.hide();
        if (result.code) {
          this.SpinnerService.hide();
          this.notification.showError(result.description)
          this.issubmit = false
          return
        }
        if (result.rentamount) {
          this.SpinnerService.hide();
          this.notification.showError("Remaining Amount is " + result.rentamount + " Please Check the Approved Amount or Clear the Pending Amount")
          this.issubmit = false;
          return false;
        }
        if (result.rentamount === 0) {
          this.SpinnerService.hide();
          this.notification.showError("Remaining Amount is " + result.rentamount + " Please Check the Approved Amount or Clear the Pending Amount")
          this.issubmit = false;
          return false;
        }
        else {
          this.fileDatas=[]
          // this.SpinnerService.hide();
          this.notification.showSuccess("Successfully created!...")
          // this.router.navigate(['/grninward'])
          this.onSubmit.emit();
          this.fromGroupDirective.resetForm()
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  onCancelClick() {
    // this.router.navigate(['/prmaster'], { skipLocationChange: true })
    // this.onCancel.emit()
    this.OnCancel.emit()

    
  }









  //////////////////////////////////////////////////////////////////////////////////////////////////////asset work 

  GrnassestheaderList: any;
  assetpopup: boolean = false
  TotalAssetRequired: any
  SelectedAsset: any
  nextasset = 1
  previousasset: any
  presentpageasset = 1
  headerIDForAsset: any
  detailIDForAsset: any
  FulldataOnLine: any
  passgrninwardid(data, detailID, fulldataOnParticularline, quantityvalue, templatepopup) {
    // this.GrnAssestForm.reset()
    (this.GrnAssestForm.get('assetitems') as FormArray).clear();
    this.checkboxclicked = false;
    this.Assetarrray = []
         this.isbulk = 0
         this.bulkclicked = false

    let quantityvalue1 = +quantityvalue
    this.SelectedAsset = this.Assetarrray.length   //here
    console.log("selected data in popup", data)
    // if (quantityvalue == 0) {
    if (quantityvalue1 == 0) {
      this.notification.showWarning("Please Enter Quantity")
      this.assetpopup = false
      this.dialog.closeAll()
      return false
    }

    if(quantityvalue1 > 1 && this.isamountbased == true){
    this.notification.showWarning('Enter Amount is Higher than the Actual amount')
    this.assetpopup = false
    this.dialog.closeAll()
    return false;

    }
    this.TotalAssetRequired = Math.ceil(quantityvalue1)
    // this.TotalAssetRequired =Math.floor(quantityvalue1) 

    let headerId = data;
    let datadetailID = detailID
    this.headerIDForAsset = data
    this.detailIDForAsset = detailID
    this.assetpo_id = fulldataOnParticularline?.poheader_id
    this.assetpodetails_id = fulldataOnParticularline?.podetails_id
    this.productassetcode = fulldataOnParticularline?.product_id?.code
    // this.quantityasset = quantityvalue
    // this.quantityasset = Math.floor(quantityvalue1)
    this.quantityasset = Math.ceil(quantityvalue1)

    // if (this.quantityasset < 1 && this.quantityasset > 0){ //check here

    //   this.quantityasset = 1
    // this.TotalAssetRequired = 1


    // }



    let type = 'Headers';
    // console.log("headerId", headerId)
    // console.log("detail Id", datadetailID)
    this.presentpageasset = 1
    let page = this.presentpageasset 
    
    this.dialog.open(templatepopup, {
      width: '100%',
      disableClose: true 
    });
    this.assetpopup = true
    this.SpinnerService.show();

      

    this.dataService.getassestheader(headerId, datadetailID, type, page,this.TotalAssetRequired)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results
        console.log("Asset popup data patch ", datas)
        if(quantityvalue > 10){
          this.showLoadMore = true;
        } else {
          this.showLoadMore = false;
        }
        this.FulldataOnLine = fulldataOnParticularline
        this.loadAssetForm(datas, fulldataOnParticularline,data,detailID)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  closedialog(): void {
    this.dialog.closeAll()
    this.Assetarrray = []
  }

  // previousassetClick(){
  //   if( this.presentpageasset <= 1  ){
  //     return false
  //   }

  //   let headerId = this.headerIDForAsset
  //   let datadetailID = this.detailIDForAsset
  //   let type = 'Headers';
  //   let page: any
  //   let present = this.presentpageasset ;
  //   let backward;
  //       backward = --present; 
  //       this.presentpageasset = backward
  //       this.SpinnerService.show();
  //   this.dataService.getassestheader(headerId, datadetailID, type, this.presentpageasset-1)
  //     .subscribe((results: any[]) => {
  //       this.SpinnerService.hide();
  //       let datas = results
  //       console.log("Asset popup data patch ", datas)
  //       this.loadAssetForm(datas, this.FulldataOnLine)
  //     },(error) => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     })
  // }


  nextassetClick(){
    let headerId = this.headerIDForAsset
    let datadetailID = this.detailIDForAsset
    let type = 'Headers';
    let page: any
    
    let present = this.presentpageasset ;
    let forward;
        forward = ++present; 
        this.presentpageasset = forward


        this.SpinnerService.show();
    this.dataService.getassestheader(headerId, datadetailID, type, this.presentpageasset,this.TotalAssetRequired)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results
        if(datas.length == 0){ this.notification.showInfo("Maximum Asset Reached"); this.SpinnerService.hide();    }
        console.log("Asset popup data patch ", datas)
        this.loadAssetForm(datas, this.FulldataOnLine,headerId,datadetailID)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }

  ShowHideAssertInstallation: any

  loadAssetForm(Assetdata, fulldataOnParticularline,headerid,detailId) {


    console.log("Assetdata", Assetdata)
    console.log("fulldataOnParticularline", fulldataOnParticularline)




    for (let detail of Assetdata) {

      // let assetid_name: FormControl = new FormControl('');
      // let assetid_gid: FormControl = new FormControl('');
      // let UserInputassestserial_no: FormControl = new FormControl('');
      // let UserInputassest_manufacturer: FormControl = new FormControl('');
      // let UserInputasseststart_date: FormControl = new FormControl('');
      // let UserInputassestend_date: FormControl = new FormControl('');
      // let UserInputInstallationRequired: FormControl = new FormControl(''); 

      let po_id: FormControl = new FormControl('');
      let podetails_id: FormControl = new FormControl('');
      let manufacturer: FormControl = new FormControl('');
      let serialno: FormControl = new FormControl('');
      let details: FormControl = new FormControl('');
      let id: FormControl = new FormControl('');
      let assetid: FormControl = new FormControl('');
      let hostassetid: FormControl = new FormControl('');
      let warranty_from_date: FormControl = new FormControl(new Date());
      let warranty_to_date: FormControl = new FormControl(new Date());
      let installation_required: FormControl = new FormControl(''); 
      let installation_date: FormControl = new FormControl('');
      let podelivery_id : FormControl = new FormControl('');
      let asset_complete : FormControl = new FormControl('');


      po_id.setValue(detail.po_id)
      podetails_id.setValue(detail.podetails_id)
      manufacturer.setValue("")
      serialno.setValue("")
      details.setValue(detail.details)
      id.setValue(detail.id)
      assetid.setValue(detail.assetid)
      hostassetid.setValue(detail.hostassetid)
      warranty_from_date.setValue(new Date())
      warranty_to_date.setValue(new Date())
      installation_required.setValue(detail.installation_required)
      podelivery_id.setValue(fulldataOnParticularline.id)

      // this is to eperate VALUE bsed ot QNTY based
      if(this.isamountbased){    
                  asset_complete.setValue(1)

      }
      else{
                  asset_complete.setValue(0)

      }
      
      
//this is done for first time asset completion as 1 next time it will be 0
      // if(fulldataOnParticularline.qty == 1){


      // if(fulldataOnParticularline.asset_complete == false){
      //     asset_complete.setValue(1)
      // }

      // if(fulldataOnParticularline.asset_complete == true){
      //     asset_complete.setValue(0)
      // }
      // }
     
      
      if( fulldataOnParticularline.installationrequired == 1  ){
        this.ShowHideAssertInstallation = true
        installation_date.setValue(new Date())
      }
      if( fulldataOnParticularline.installationrequired == 0  ){
        this.ShowHideAssertInstallation = false
        installation_date.setValue(detail.installation_date)
      }

      const AssetArrayForm = this.GrnAssestForm.get('assetitems') as FormArray;

      AssetArrayForm.push(new FormGroup({
        po_id: po_id,
        podetails_id: podetails_id, 
        manufacturer: manufacturer,
        serialno: serialno,
        details: details,
        id: id,
        assetid: assetid,
        hostassetid: hostassetid,
        warranty_from_date: warranty_from_date,
        warranty_to_date: warranty_to_date,
        installation_required: installation_required,
        installation_date:installation_date,
        podelivery_id : podelivery_id,
        asset_complete : asset_complete
      })
      )
      console.log('new asset arra==>',AssetArrayForm)

      // assetid_gid.setValue(detail.id)
      // assetid_name.setValue(detail.assetid)
      // UserInputassestserial_no.setValue("")
      // UserInputassest_manufacturer.setValue("")
      // UserInputasseststart_date.setValue(new Date())
      // UserInputassestend_date.setValue(new Date())
      // checkboxvalue.setValue(false)
      
      // AssetArrayForm.push(new FormGroup({
      //   UserInputassestserial_no: UserInputassestserial_no,
      //   UserInputassest_manufacturer: UserInputassest_manufacturer,
      //   // UserInputasseststart_date: UserInputasseststart_date,
      //   // UserInputassestend_date: UserInputassestend_date,
      //   assetid_name: assetid_name,
      //   assetid_gid: assetid_gid,
      //   // UserInputInstallationRequired:UserInputInstallationRequired,
      //   // checkboxvalue: checkboxvalue
      // })
      // )
    }
    this.updateWhenUsingPopup()

  }

/////////////////////////////////////////// patching already filled asset data on popup 
  updateWhenUsingPopup() {
    let PatchDataWhileCheckArray = this.patchofAssetarray
    console.log("Patch Data While Check Asset Array", PatchDataWhileCheckArray)

    let dataarray = this.GrnAssestForm.value.assetitems
    let aValueToCheckAndPatch = PatchDataWhileCheckArray

    for (let datapatchcheck in aValueToCheckAndPatch) {
      for (let dataform in dataarray) {
        if (aValueToCheckAndPatch[datapatchcheck].id == dataarray[dataform].id) {
          console.log("index value of an Form array", dataform)
          console.log(" aValueToCheckAndPatch[datapatchcheck]", aValueToCheckAndPatch[datapatchcheck])

          this.GrnAssestForm.get('assetitems')['controls'][dataform].get('po_id').setValue(aValueToCheckAndPatch[datapatchcheck].po_id)
          this.GrnAssestForm.get('assetitems')['controls'][dataform].get('podetails_id').setValue(aValueToCheckAndPatch[datapatchcheck].podetails_id)
          this.GrnAssestForm.get('assetitems')['controls'][dataform].get('manufacturer').setValue(aValueToCheckAndPatch[datapatchcheck].manufacturer)
          this.GrnAssestForm.get('assetitems')['controls'][dataform].get('serialno').setValue(aValueToCheckAndPatch[datapatchcheck].serialno)
          this.GrnAssestForm.get('assetitems')['controls'][dataform].get('details').setValue(aValueToCheckAndPatch[datapatchcheck].details)   
          this.GrnAssestForm.get('assetitems')['controls'][dataform].get('id').setValue(aValueToCheckAndPatch[datapatchcheck].id)  
          this.GrnAssestForm.get('assetitems')['controls'][dataform].get('assetid').setValue(aValueToCheckAndPatch[datapatchcheck].assetid)  
          this.GrnAssestForm.get('assetitems')['controls'][dataform].get('hostassetid').setValue(aValueToCheckAndPatch[datapatchcheck].hostassetid)  
          this.GrnAssestForm.get('assetitems')['controls'][dataform].get('warranty_from_date').setValue(aValueToCheckAndPatch[datapatchcheck].warranty_from_date)   
          this.GrnAssestForm.get('assetitems')['controls'][dataform].get('warranty_to_date').setValue(aValueToCheckAndPatch[datapatchcheck].warranty_to_date)  
          this.GrnAssestForm.get('assetitems')['controls'][dataform].get('installation_required').setValue(aValueToCheckAndPatch[datapatchcheck].installation_required)  
          this.GrnAssestForm.get('assetitems')['controls'][dataform].get('installation_date').setValue(aValueToCheckAndPatch[datapatchcheck].installation_date)  
          this.GrnAssestForm.get('assetitems')['controls'][dataform].get('podelivery_id').setValue(aValueToCheckAndPatch[datapatchcheck].podelivery_id)  
          this.GrnAssestForm.get('assetitems')['controls'][dataform].get('asset_complete').setValue(aValueToCheckAndPatch[datapatchcheck].asset_complete)  





          // this.GrnAssestForm.get('assetitems')['controls'][dataform].get('UserInputassestserial_no').setValue(aValueToCheckAndPatch[datapatchcheck].UserInputassestserial_no)
          // this.GrnAssestForm.get('assetitems')['controls'][dataform].get('UserInputassest_manufacturer').setValue(aValueToCheckAndPatch[datapatchcheck].UserInputassest_manufacturer)
          // // this.GrnAssestForm.get('assetitems')['controls'][dataform].get('UserInputasseststart_date').setValue(aValueToCheckAndPatch[datapatchcheck].UserInputasseststart_date)
          // // this.GrnAssestForm.get('assetitems')['controls'][dataform].get('UserInputassestend_date').setValue(aValueToCheckAndPatch[datapatchcheck].UserInputassestend_date)
          // // this.GrnAssestForm.get('assetitems')['controls'][dataform].get('UserInputInstallationRequired').setValue(aValueToCheckAndPatch[datapatchcheck].UserInputInstallationRequired)  
        }
      }
      this.PopupCheckboxdisable()
    }
  }

  // fieldCheckboxAsset= [false, false, false, false, false, false, false, false, false, false]
  fieldCheckboxAsset= Array(1000).fill(false)

  /////////////////////////////////////////////disabling checkbox on popup when already selected
  PopupCheckboxdisable() {

    /////// collecting assetID from grn details of asset array and assetID in popup


    let dataAssetOnPopup = this.GrnAssestForm.value.assetitems
    let assetIDdata = dataAssetOnPopup.map(x => x.id)
    console.log(" asset data in popup part 1 ", assetIDdata)
    let dataInGrnDetails = this.GRNForm2.value.grndetails
    let AssetDatailsGrndetails = []
    for (let data in dataInGrnDetails) {
      let datacollectionOfAssetId = dataInGrnDetails[data].ASSET
      for (let dataassetarray in datacollectionOfAssetId) {
        let dataAssert_GidID = datacollectionOfAssetId[dataassetarray].Assert_Gid
        let dataget = AssetDatailsGrndetails.push(dataAssert_GidID)
        console.log(" data Collection Of Asset Id Part 2", AssetDatailsGrndetails)
      }
    }

    //////////////////// disabling checkbox 
    let dataArrayOfAssetPopup  = assetIDdata
    let dataArrayOfGRNDetails  = AssetDatailsGrndetails

    for( let dataID in dataArrayOfGRNDetails ){
      for( let dataAsset in dataArrayOfAssetPopup ){
        if( dataArrayOfGRNDetails[dataID] == dataArrayOfAssetPopup[dataAsset]   ){
          this.fieldCheckboxAsset[dataAsset] = true
          // dataAssetOnPopup[dataAsset].disablecheckbox = true
        }
        // else{
        //   this.fieldCheckboxAsset[dataAsset] = false
        //   // dataAssetOnPopup[dataAsset].disablecheckbox = false
        // }
      }
    }
  }


  do_save() {
    let datacheckValidationOnPopupSubmit = this.Assetarrray
    if (datacheckValidationOnPopupSubmit.length == 0) {
      this.notification.showWarning("Asset not selected")
      this.assetpopup = false
      this.dialog.closeAll()
    }
    if (datacheckValidationOnPopupSubmit.length > this.TotalAssetRequired) {
      this.notification.showWarning("Asset not selected")
      this.assetpopup = false
      this.dialog.closeAll()
    }

    else {
      this.assetpopup = false
      this.dialog.closeAll()
    }
  }


  Assetarrray = []
  patchofAssetarray = []
  assetArrayFormation(data, grnData, index, event) {
    // console.log("grnasset popup summary ", this.GrnassestheaderList);
    // let assetformdata = this.GrnAssestForm.value
    // console.log('data on select', data.value)


    // if ((data.value.manufacturer == "") || (data.value.manufacturer == undefined) || (data.value.manufacturer == null)) {
    //   this.notification.showWarning("Please fill Manufacture ")
    //   event.preventDefault();
    //   event.stopPropagation();
    //   return false
    // }

    // if (data.value.warranty_from_date > data.value.warranty_to_date ) {
    //   this.notification.showWarning("End Date  must be greater than Start Date")
    //   event.preventDefault();
    //   event.stopPropagation();
    //   return false
    // }

    // if ((data.value.serialno == "") || (data.value.serialno == undefined) || (data.value.serialno == null)) {
    //   this.notification.showWarning("Please fill Serial No ")
    //   event.preventDefault();
    //   event.stopPropagation();
    //   return false
    // }

    // if ((data.value.UserInputasseststart_date == "") || (data.value.UserInputasseststart_date == undefined) || (data.value.UserInputasseststart_date == null)) {
    //   this.notification.showWarning("Please fill Start Day")
    //   event.preventDefault();
    //   event.stopPropagation();
    //   return false
    // }

    if (event.target.checked) {
      let datalength = this.SelectedAsset
      let totaldata = this.TotalAssetRequired
      this.checkboxclicked = true;

      if (datalength >= totaldata) {
        this.notification.showWarning("Required data satisfied")
        event.preventDefault();
        event.stopPropagation();
        return false
      }
      let assetdata = data.value
      this.patchofAssetarray.push(assetdata)
      console.log("Patch Assset selected dataaa", this.patchofAssetarray)

      // let warentydateStart = this.datePipe.transform(assetdata.warranty_from_date, "dd-MMM-yy")
      let installationdate
      if(assetdata.installation_required == 0){
        installationdate = "None"
      }
      if(assetdata.installation_required == 1){
        installationdate = this.datePipe.transform( assetdata.installation_date, 'yyyy-MM-dd')
      }
      let atributesarry:any=''
for(let x of this.sam_array){
  if(assetdata.assetid===x.id){
   atributesarry=x.array
  }
}
      let dataAssetArrangement = {
        // Sno: assetdata.UserInputassestserial_no,
        // Assert_Gid: assetdata.assetid_gid,
        // ManuF: assetdata.UserInputassest_manufacturer,
        // IsWarranty: "Y",
        // WarrantyEndDate: assetdata.UserInputassestend_date,
        // Installation_Date: assetdata.UserInputInstallationRequired,
        // WarrantyStartDate: assetdata.UserInputasseststart_date,
        // Remarks: "GRN"
        po_id: assetdata.po_id,
        podetails_id: assetdata.podetails_id, 
        manufacturer: assetdata.manufacturer,
        serialno: assetdata.serialno,
        details: assetdata.details,
        id: assetdata.id,
        assetid: assetdata.assetid,
        hostassetid : assetdata.hostassetid,
        warranty_from_date: this.datePipe.transform( assetdata.warranty_from_date, 'yyyy-MM-dd'),
        warranty_to_date:this.datePipe.transform( assetdata.warranty_to_date, 'yyyy-MM-dd'),
        installation_required: assetdata.installation_required,
        installation_date: installationdate,
      // other_attributes.setValue(this.other_attributes[indexOfSelectedRow])
        other_attribute : atributesarry || "",
        product_id : grnData?.product_id?.id,
        product_code : grnData?.product_id?.code,
        asset_complete : assetdata?.asset_complete,
        podelivery_id :assetdata?.podelivery_id


      }

      this.Assetarrray.push(dataAssetArrangement)
      console.log("Assset selected dataaa", this.Assetarrray)
      this.SelectedAsset = this.Assetarrray.length

    }
    else {



      let dataremove =  this.Assetarrray
      let index = -1;
      let val = data.value.id
      let filteredObj = dataremove.find(function (item, ival) {
        if (item.Assert_Gid == val) {
          index = ival;
          return ival;
        }
      })

      console.log("index value of data in this.Assetarrray ", this.Assetarrray[index])
      this.Assetarrray.splice(index, 1)
      let totalLengthSelected = this.Assetarrray.length
      this.SelectedAsset = totalLengthSelected
      console.log("Total Asset", this.Assetarrray)
      if(totalLengthSelected == 0){
        this.checkboxclicked = false;

      }
    }

  }
  fieldGlobalIndex(index) {
    return this.itemsPerPage * (this.currentPage - 1) + index;
  }
  tableIndex: any
  // otheratributsview(grn, index, popup){
  //   this.prod_name = grn.product_name
  //   this.prodcode = grn.product_id?.code
  //   this.tableIndex = index;
  //   this.SpinnerService.show();
  //   this.dataService.getotherattribute(this.prodcode, "GRN")
  //     .subscribe(result => {
  //       this.SpinnerService.hide();
  //       this.otherattributespatching = result.data
  //       // this.dialog.open(popup, {
  //       //   width: '100%',
  //       //   disableClose: true 
  //       // });
  //       if(popup != ""){
  //       this.innerDialogRef = this.dialog.open(popup, {
  //         width: '100%',
  //         disableClose: true 
  //       });
  //     }
  //       // this.attributes = this.fb.array(
  //       //   this.otherattributespatching.map(() => this.fb.control(''))
  //       // );
    
  //       this.initializeForm();

  //       // let datapagination = result['pagination'];
  //       // if(this.otherattributespatching.length > 0){
  //       //   this.has_nextt = datapagination.has_next;
  //       //   this.has_previouss = datapagination.has_previous;
  //       //   this.presentpages = datapagination.index;
  //       // }
        
     
  //   })
  //     //  this.patchSpecifications();
      
  // }

  closeInnerDialog() {
    if (this.innerDialogRef) {
      this.innerDialogRef.close();
    }
  }
  

  

  get specs(): FormArray {
    return this.specificationForm.get('specs') as FormArray;
  }
  // patchSpecifications() {
  //   this.otherattributespatching.forEach(spec => {
  //     this.specs.push(this.fb.group({
  //       label: spec.specification,
  //       selectedOption: ['']  // Default value for dropdown
  //     }));
  //   });
  // }
  patchSpecifications() {
    this.otherattributespatching.forEach(spec => {
      this.specificationForm.addControl(spec.specification, this.fb.control(''));
    });
  }
  getotherData(data){
console.log("dada",data.specification)
let spec =data.specification
this.SpinnerService.show();
this.dataService.getdropattribute(this.prodcode,spec)
  .subscribe(result => {
    this.SpinnerService.hide();
    this.otherattributespatchingdropdown =result.data  
  })
}
// get attributes() {
//   return this.myForm.get('attributes') as FormArray;
// }

  // initializeForm() {
  //   const formArray = this.myForm.get('attributes') as FormArray;
  //   formArray.clear(); 
  //   this.otherattributespatching.forEach(() => {
  //     formArray.push(this.fb.control(null)); 
  //   });
  //   // this.myForm = this.fb.group({
  //   //   attributes: this.fb.array(this.otherattributespatching.map(() => this.fb.control('')))
  //   // });
  // }

 
  getattributeview(selectedValue: any, index: number) {
    console.log(`Dropdown ${index} selected:`, selectedValue);
    const formArray = this.myForm.get('attributes') as FormArray;
    if (formArray.at(index)) {
      formArray.at(index).setValue(selectedValue); 
    }
    this.formstores.push(selectedValue);
    console.log("ssss",this.formstores)
  }
  // submitattributeForm() {
  //   if (this.myForm.valid) {
  //     const formArrayValues = this.myForm.get('attributes')?.value;
  
  //     const otherAttributes = this.otherattributespatching.map((attr, index) => ({
  //       specification: attr.specification,
  //       configuration: formArrayValues[index]
  //     }));
  
  //     this.final_attributes = [];
  //     this.final_attributes.push(otherAttributes);
  
  //     const payload = {
  //       other_attribute: otherAttributes,
  //     };
  //     console.log('Payload:', payload);
  
  //     // ✅ Format into: [{ "Criticality": "HIGH" }, { "RAM": "8GB RAM" }]
  //     const formattedOtherAttribute = this.final_attributes[0]
  //       .filter(attr => attr.configuration) // skip null/empty
  //       .map(attr => {
  //         const value = typeof attr.configuration === 'object'
  //           ? attr.configuration.data_value || ''
  //           : attr.configuration;
  
  //         return { [attr.specification]: value };
  //       });
  
  //     console.log('formattedOtherAttribute:', formattedOtherAttribute);
  
  //     this.other_attributes.push(formattedOtherAttribute);
  
  //     console.log("grnarray", this.GRNForm2.value.grndetails);
  
  //     this.notification.showSuccess('Saved Successfully!');
  //     this.closebtn();
  //     this.closeInnerDialog();
  //   }
  // }
  

//   submitattributeForm() {
//     if (this.myForm.valid) {
//       const formArrayValues = this.myForm.get('attributes')?.value;
//       const otherAttributes = this.otherattributespatching.map((attr, index) => ({
//         specification: attr.specification, 
//         configuration: formArrayValues[index] 
//       }));
    
//       this.final_attributes=[];
//       const payload = {
//         other_attribute: otherAttributes,
//       }
//       this.final_attributes.push(otherAttributes)
//       console.log('Payload:', payload);
//       // let other_attributes = this.final_attributes ;
//       const formattedOtherAttribute = this.final_attributes[0]
//   .filter(attr => attr.configuration) // only ones with value
//   .map(attr => `${attr.specification}: ${typeof attr.configuration === 'object' ? attr.configuration.name : attr.configuration}`)
//   .join(", ");

//       // const formattedOtherAttribute = this.final_attributes[0].map(attr => attr.configuration ? `${attr.specification}: ${attr.configuration.name || attr.configuration}` : attr.specification)
//     // .join(", ");
//       const primarySpec = this.final_attributes[0].find(attr => attr.configuration === null)?.specification || "";
//       const result = `${primarySpec} : ${formattedOtherAttribute}`;
//       console.log('formattedOtherAttribute:', formattedOtherAttribute);

//       this.other_attributes.push(formattedOtherAttribute);
//       // this.grndetails = this.GRNForm2.value.grndetails
//       // let grnarray = this.GRNForm2.value.grndetails
//       // let grnarrayindex = this.tableIndex
//       // grnarray[grnarrayindex].other_attributes = formattedOtherAttribute
//       // const grnArrayControl = this.GRNForm2.get('grndetails') as FormArray;
//       // const grnGroup = grnArrayControl.at(this.tableIndex) as FormGroup;
      
//       // if (grnGroup) {
//       //   grnGroup.patchValue({ other_attributes: formattedOtherAttribute });
//       // }
//       // this.getFormArray().controls[this.tableIndex].patchValue({
//       //   other_attributes: formattedOtherAttribute
//       // });
//       // let other_attributes: FormControl = new FormControl('');
//       // other_attributes.setValue(formattedOtherAttribute)
//       //  this.getFormArray().push(new FormGroup({
//       //   other_attributes: other_attributes
//       // }))
   
// console.log("grnarray",this.GRNForm2.value.grndetails)      
//       this.notification.showSuccess('Saved Successfully!');
//       this.closebtn();
//       this.closeInnerDialog();
      
//     }
//   }
  other_attributes: any = [];
  closebtn(){
    if(this.closebtn2){
      this.closebtn2.nativeElement.click()
    }
  }
  downloadFileXLSXprTemplate(){
 this.SpinnerService.show();
 this.bulkclicked = true
 const payload ={
  "received":0,
  "po_id":this.assetpo_id,
  "podetails_id":this.assetpodetails_id,
  "current_qty":Number(this.quantityasset),
  "product_code":this.productassetcode,
 }
    this.dataService.DownloadAssetExcel(payload)
      .subscribe((results) => {
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "Asset Template.xlsx"
        link.click();
        // this.checkboxclicked = false
        // this.bulkclicked = false
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  onFileSelected($event ){
this.file = $event.target.files[0]; 
  }
  closefunc(){
        this.closebox.nativeElement.click();
      }
 BulkUpload(){
this.SpinnerService.show()
let emptydte = ""
let variabempty = 'None'
const today = new Date().toISOString().split('T')[0];
const payload ={
  "po_id":this.assetpo_id,
  "podetails_id":this.assetpodetails_id,
  "product_id":Number(this.quantityasset),
  "branch_id":this.productassetcode,
  "manufacturer":emptydte,
  "serialno":emptydte,
  "details":emptydte,
  "warranty_from_date":today,
  "warranty_to_date":today,
  "installation_required":0,
  "installation_date":variabempty,
 }
 
 if(!this.file){
  this.notification.showWarning("Choose File To Uplaod")
  this.SpinnerService.hide();
  return true;
 }
  if (this.file) {
          console.log('File:', this.file);
          this.bulkfilename = this.file.name;
          const formData = new FormData();
          formData.append("file", this.file);
            formData.append('data', JSON.stringify(payload));
this.dataService.Bulkupload(formData)
.pipe(debounceTime(1000))
.subscribe(
  (response) => {
    this.SpinnerService.hide();
   if(response.description){
     this.notification.showWarning(response.description)
    
   }
   else{
    this.notification.showSuccess("Successfully Uploaded")
    this.bulkasset = response.ASSET;
     this.isbulk = 1

    this.bulkasset.forEach(item=>
     {
       this.Assetarrray.push(item)
     } 
    )
    console.log('this.assetarray==>',this.Assetarrray,)
    console.log("bulk",this.bulkasset)
    //  this.closefunc();
      // this.closedialog();
        this.closeSecondPopup();

   }
  },
  (error) => {
    console.error('Error uploading/downloading file:', error);
    this.toastr.error("An error occurred while processing the file. Please try again later.");
    this.file = null
    this.SpinnerService.hide();
    this.closefunc();
  }
);
        }
this.SpinnerService.hide()

 }


 ViewProduct(s){
  this.prodnameview =s?.product_name
  this.makenameview =s?.item_name
  this.modelnameview =s?.model_name
  this.specnameview =s?.specification
 }


//  onToggleChange(event: any, index: number) {

//     this.isamountbased = true

//   this.grninwardList[index].isonamountbased = event.value === '1';
// }

onToggleChange(event: any, index: number) {
  this.isamountbased = true;

  // Use event.checked for mat-checkbox
  this.grninwardList[index].isonamountbased = event.checked;

   const rowData = this.grninwardList[index];

  const isPlainCheckboxChecked = rowData.CheckboxenableDiableArrays === true;


 
  if(event.checked == false){
  //  this.crntamt.controls[index].setValue((rowData?.qty-rowData?.received_quantity) * rowData.unitprice);
  let value = (rowData?.amount) -(rowData?.received_amount)
  let formatedvalue = this.decimalpipe.transform(value,'1.2-2')
   this.crntamt.controls[index].setValue(formatedvalue);
  //  this.rcdqnty.controls[index].setValue(rowData?.qty-rowData?.received_quantity);
  this.rcdqnty.controls[index].setValue((parseFloat(rowData?.qty)-parseFloat(rowData?.received_quantity)).toFixed(2));
  }

  if(event.checked == false &&  this.GRNForm2.value.grndetails == 0){ 
    
    this.isamountbased = false
  }




  // if(event.checked == false){

  //   if(isPlainCheckboxChecked){
     
  //     this.notification.showWarning('Pls Uncheck the Action checkbox')
  //     return false
      
      
  //   }
  //   else{
  //               this.Assetarrray = []

  //   }


  // }
}


//  receiving amout chNGES STORE

onQuantityChange(value: number, index: number) {
  // this.grninwardList[index].enteredQty = +value; // store or handle as needed
  this.changedrecevedamt = value;
}

currentcheck(event,index){


 let value = event.target.value;


  // let x=((this.PARmakerForm.value.contigency * section.value.amount) / 100)
  //   this.PARmakerForm.get('pardetails')['controls'][i].get('perce').setValue(x)

  //   let amount1=section.value.amount;
  //   let contiamt = section.value.perce;
  //   let totalamt = amount1 + contiamt;
  //   this.PARmakerForm.get('pardetails')['controls'][i].get('perceTotal').setValue(totalamt)
    

}
receivedqtychange(event,index,grninward){
  
  // this.changedrecevedqnty = event.target.value
  // grninward.changedrecevedqnty = Number(event.target.value)
  
  this.isreceivedqtychange = true;

  // const receivedQty = +(event.target as HTMLInputElement).value;

  // const row = this.grninwardList[index];

  // row.received_quantity = receivedQty;
  // row.updatedValue = row.qty - receivedQty;
}

getInputValue(i: number, grninward: any): number {

  // Case 2: User is editing received quantity, no updated details yet
  
  if (this.isreceivedqtychange && this.updateddetails?.length === 0) {
    return grninward._tempQty ?? (grninward.qty - grninward.received_quantity);
  }

  // Case 3.1: updateddetails exist, match current row
  if (
    !this.isreceivedqtychange &&
    this.updateddetails?.length > 0 &&
    grninward?.id === this.updateddetails?.at(i)?.get('podelivery_id')?.value
  ) {
    return this.updateddetails.at(i)?.get('quantity')?.value ?? 0;
  }

  // Case 3.2: updateddetails exist, but doesn't match this row
  if (
    !this.isreceivedqtychange &&
    this.updateddetails?.length > 0 &&    
    grninward?.id !== this.updateddetails?.at(i)?.get('podelivery_id')?.value
  ) {
    return grninward.qty - grninward.received_quantity;
  }

  // Default: first load
  return grninward.qty - grninward.received_quantity;
}
onQtyChange(index,newvalue,grninward){

  if(+newvalue > 1){
    this.notification.showWarning('Enter Amount is Higher than the Actual amount')
    return false;
  }
}

qntybased(event,index,grninward){

  this.isqntybased = true
  let input = event.target.value
  // Match numbers like 123, 123.4, or 123.45
  const regex = /^\d*\.?\d{0,2}$/;

  if (!regex.test(input)) {
    // Remove last character if input is invalid
    event.target.value = input.slice(0, -1);
  }


   if(event.target.value < 0){
    this.notification.showWarning('Please enter a value greater than 0')
   this.crntamt.controls[index].setValue((grninward?.qty-grninward?.received_quantity) * grninward.unitprice);
   this.rcdqnty.controls[index].setValue(grninward?.qty-grninward?.received_quantity);
    return false
  }
  else if(event.target.value > (grninward?.qty- grninward?.received_quantity)){

   this.notification.showWarning('Entered Quantity is Higher than the Remaining Quantity,Pls Check... ')
   this.crntamt.controls[index].setValue((grninward?.qty-grninward?.received_quantity) * grninward.unitprice);
   this.rcdqnty.controls[index].setValue(grninward?.qty-grninward?.received_quantity);
    return false

  }
  else{
    // let crntamount = this.crntamt.controls[index].value
    // let crntamt1 = +crntamount.toFixed(2)
  let input = event.target.value
  const crntamount = input * grninward?.unitprice;
    let crntamt1 = +crntamount.toFixed(2)
    this.crntamt.controls[index].setValue(crntamt1);

  }

 

}

// crntamtchange(index: number,grninward) {

//   const val = this.crntamt.controls[index].value;

// //if zero means cant enter 0.5 during value basis
//    if(val < 0){
//     this.notification.showWarning('Please enter a value greater than 0')
//    this.crntamt.controls[index].setValue(grninward?.qty * grninward?.unitprice);
//    this.rcdqnty.controls[index].setValue(grninward?.qty-grninward?.received_quantity);    
//    return false
//   }

//   if( val >  (+grninward.qty * grninward.unitprice)){

//   this.notification.showWarning('Entered Amount is Higher than the Balance Amount,Pls Check...')
//   this.crntamt.controls[index].setValue(grninward.qty * grninward.unitprice);
//   this.rcdqnty.controls[index].setValue(grninward?.qty-grninward?.received_quantity);
//     return false
//   }
//   else{

//   const newQty = (((val / grninward.amount) * 100 / 100) * grninward.qty);

//   let newqty1 = +newQty.toFixed(2)
//   this.rcdqnty.controls[index].setValue(newqty1);
//   }
  
// }
    passgrninwardpatch(data, detailID, fulldataOnParticularline, quantityvalue, templatepopup) {


// this.GrnAssestForm.reset()
    (this.GrnAssestForm.get('assetitems') as FormArray).clear();
    this.Assetarrray = []
    let quantityvalue1 = +quantityvalue
    this.SelectedAsset = this.Assetarrray.length   //here
    console.log("selected data in popup", data)
    // if (quantityvalue == 0) {
    if (quantityvalue1 == 0) {
      this.notification.showWarning("Please Enter Quantity")
      this.assetpopup = false
      this.dialog.closeAll()
      return false
    }

    if(quantityvalue1 > 1 && this.isamountbased == true){
    this.notification.showWarning('Enter Amount is Higher than the Actual amount')
    this.assetpopup = false
    this.dialog.closeAll()
    return false;

    }
    this.TotalAssetRequired = Math.ceil(quantityvalue1)
    // this.TotalAssetRequired =Math.floor(quantityvalue1) 

    let headerId = data;
    let datadetailID = detailID
    this.headerIDForAsset = data
    this.detailIDForAsset = detailID
    this.assetpo_id = fulldataOnParticularline?.poheader_id
    this.assetpodetails_id = fulldataOnParticularline?.podetails_id
    this.productassetcode = fulldataOnParticularline?.product_id?.code
    // this.quantityasset = quantityvalue
    // this.quantityasset = Math.floor(quantityvalue1)
    this.quantityasset = Math.ceil(quantityvalue1)


    // if (this.quantityasset < 1 && this.quantityasset > 0){ //check here

    //   this.quantityasset = 1
    // this.TotalAssetRequired = 1


    // }



    let type = 'Headers';
    // console.log("headerId", headerId)
    // console.log("detail Id", datadetailID)
    this.presentpageasset = 1
    let page = this.presentpageasset 
    
    this.dialog.open(templatepopup, {
      width: '100%',
      disableClose: true 
    });
    this.assetpopup = true
    this.SpinnerService.show();
      

 this.dataService.getassestheaderpatch(headerId, datadetailID, type, page,this.TotalAssetRequired)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        this.newassetdetails = results

       let datas = results

        console.log("Asset popup data patch ", datas)
        if(quantityvalue > 10){
          this.showLoadMore = true;
        } else {
          this.showLoadMore = false;
        }
        this.FulldataOnLine = fulldataOnParticularline
        // this.loadAssetForm(datas, fulldataOnParticularline,data,detailID)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    }

     getasseetData(data, indexOfSelectedRow, quantityvalue,crntamount, e, choosentype,) {
  console.log("indexOfSelectedRow", indexOfSelectedRow)
  console.log("quantityvalue", quantityvalue)
  console.log("choosentype", choosentype)
  console.log("choosen data", data)
  //  this.Assetarrray = this.bulkasset  while doing bulk upload need to check here
    let valueOfQuantityandRemainingQty = data.qty - data.received_quantity
  if(choosentype == 'checkbox'){
    if (quantityvalue > valueOfQuantityandRemainingQty || quantityvalue == 0) {
      this.notification.showWarning(" 'Current Received Quantity' must be less than or equal to 'Remaining Quantity'")
      e.preventDefault();
      e.stopPropagation();
      return false
    }
  }
  console.log("auto selected value value",data)
    console.log("event.target total  value", e.target)
    let grnHeaderData = this.GRNForm2.value
    let checkCommonValidationAndEnable = this.GRNForm2.value.grndetails
    if(e.target.checked == false) {
      data.CheckboxenableDiableArrays = false
      this.removeSection(data, e,indexOfSelectedRow)
    }
    else {
    //   if (data.is_asset == 1) {
    //     console.log("this.Assetarrray -------------------------------------->", this.Assetarrray)
    //     if (this.Assetarrray.length == 0 ) {
    //       this.notification.showWarning("Please Enter Asset ")
    //       e.preventDefault();
    //       e.stopPropagation();
    //       return false
    //     }
    //   }
    //   if (data.is_asset == 1) {
    //   if ((this.Assetarrray.length != this.TotalAssetRequired)) {
    //     this.notification.showWarning("Required Asset Not Satisfied ")
    //     e.preventDefault();
    //     e.stopPropagation();
    //     return false
    //   }
    // }
      this.GRNForm2.patchValue({
        suppliername: data.supplierbranch_id.name,
        locations: data.branch_id.name
      })
      data.CheckboxenableDiableArrays = true
      data.fieldtext = true

      
      
      let podetails_id: FormControl = new FormControl('');
      let poheader_id: FormControl = new FormControl('');
      let product_id: FormControl = new FormControl('');
      let quantitycontrol: FormControl = new FormControl('');
      let uom: FormControl = new FormControl('');
      let unitprice: FormControl = new FormControl('');
      let amount: FormControl = new FormControl('');
      let taxamount: FormControl = new FormControl('');
      let totalamount: FormControl = new FormControl('');
      let isremoved: FormControl = new FormControl('');
      let remarks: FormControl = new FormControl('');
      let podelivery_id: FormControl = new FormControl('');
      let date: FormControl = new FormControl('');
      let grnflag: FormControl = new FormControl('');
      let ASSET: FormControl = new FormControl('')
      let assest_ids: FormControl = new FormControl('')
      let Received_Date: FormControl = new FormControl('');
      let branch_id: FormControl = new FormControl('');
      let crntamt: FormControl = new FormControl('');
      // let orderamt: FormControl = new FormControl('');
      // let balamt: FormControl = new FormControl('');
      let is_qty_based: FormControl = new FormControl('');
      let is_bulk : FormControl = new FormControl('');


      
      // let other_attributes: FormControl = new FormControl('');
      podetails_id.setValue(data.podetails_id)
      poheader_id.setValue(data.poheader_id)
      product_id.setValue(data.product_id.id)
      // quantity.setValue(data.podetails_id.qty)
      quantitycontrol.setValue(+quantityvalue)
      uom.setValue(data.uom)
      unitprice.setValue(data.unitprice)
      // amount.setValue(data.amount)
      amount.setValue(crntamount)
      taxamount.setValue(data.taxamount)
      // totalamount.setValue(data.totalamount)
      totalamount.setValue(crntamount)
      isremoved.setValue(data.isremoved)
      remarks.setValue(data.supplierbranch_id.remarks)
      podelivery_id.setValue(data.id)
      date.setValue(data.date)
      grnflag.setValue(data.flag)
      ASSET.setValue(this.Assetarrray)
      let assest_idsdata = this.Assetarrray.map(x => x.id)
      console.log("Asset IDS only", assest_ids)
      assest_ids.setValue(assest_idsdata)
      branch_id.setValue(data.branch_id.id)
      crntamt.setValue(crntamount)
      is_bulk.setValue(0)
      // orderamt.setValue(orderamt)
      // balamt.setValue(balamt)
      if(this.isamountbased == true){
        is_qty_based.setValue(0)      }
      else{
                is_qty_based.setValue(1)

      }
      // other_attributes.setValue(this.other_attributes[indexOfSelectedRow])
      // id.setValue(data.id)
      this.getFormArray().push(new FormGroup({
        podetails_id: podetails_id,
        poheader_id: poheader_id,
        product_id: product_id,
        quantity: quantitycontrol,
        uom: uom,
        unitprice: unitprice,
        amount: amount,
        taxamount: taxamount,
        totalamount: totalamount,
        isremoved: isremoved,
        remarks: remarks,
        podelivery_id: podelivery_id,
        date: date,
        grnflag: grnflag,
        Received_Date: date,
        assest_ids: assest_ids,
        ASSET: ASSET,
        branch_id:branch_id,
        crntamt : crntamt,
        // orderamt : orderamt,
        // balamt : balamt,
        is_qty_based : is_qty_based,
        is_bulk : is_bulk
        // other_attributes: other_attributes,
        // other_attributes: this.other_attributes[indexOfSelectedRow],
      }))
      //disable all other checkboxes
      let CheckboxenableDiableCheck = this.GRNForm2.value
      this.grninwardList.forEach((row, index) => {
        let dataForArrayGrnToDisableInput = this.GRNForm2.value.grndetails
        if (row.id == data.id) {
          row.fieldtext = true
          row.CheckboxenableDiableArrays = true
        }

        //This commonly enabled add assert for same supplier & location
        // if (CheckboxenableDiableCheck.suppliername == row.supplierbranch_id.name && CheckboxenableDiableCheck.locations == row.branch_id.name) {
        //   row.disabled = false;
        // }
        // else {
        //   row.disabled = true;
        //   row.fieldtext = true;
        // }

        //TO Disable the Add aseert for aquantity > 1 which will not allow both qnty based and Amount based

        if(this.isamountbased){
                  if (CheckboxenableDiableCheck.suppliername == row.supplierbranch_id.name && CheckboxenableDiableCheck.locations == row.branch_id.name
                        && +row.qty <= 1) {
          row.disabled = false;
        }
        else {
          row.disabled = true;
          row.fieldtext = true;
        }
        }

         if(!this.isamountbased){
           if (CheckboxenableDiableCheck.suppliername == row.supplierbranch_id.name && CheckboxenableDiableCheck.locations == row.branch_id.name) {
          row.disabled = false;
            }
        else {
          row.disabled = true;
          row.fieldtext = true;
        }
        }

      });
    } 
    this.Assetarrray = []
    this.updateddetails = this.GRNForm2.get('grndetails') as FormArray;
    console.log('this.updateddetails===>',this.updateddetails)
    console.log('this.grndetails pushed values===>',    this.GRNForm2.value.grndetails)

    this.isreceivedqtychange = false
    this.closedialog();
  }

  // openSecondPopup() {
  //   this.dialog.open(this.secondPopupRef, {
  //     width: '500px',
  //     disableClose: true,
  //     panelClass: 'second-dialog'
  //   });
  // }

  openSecondPopup() {
    this.secondDialogRef = this.dialog.open(this.secondPopupRef, {
      width: '500px',
      disableClose: true,
      panelClass: 'second-dialog'
    });
  }

  closeSecondPopup() {
    if (this.secondDialogRef) {
      this.secondDialogRef.close();
    }
  }



// ----------------------
// OPEN ATTRIBUTES POPUP
// ----------------------
// keep cache per asset

// ----------------------
// OPEN ATTRIBUTES POPUP
// ----------------------
otheratributsview(grn, index, popup, grndetails) {
  this.prod_name = grn.product_name;
  this.prodcode = grn.product_id?.code;
  this.tableIndex = index;
  this.grndata = grn;
  this.grndetailsdata = grndetails;

  const cacheKey = `${grn.poheader_id}_${grn.podetails_id}_${grndetails.value.assetid}`;

  // ✅ If cached → load directly
  if (this.otherAttributesCache?.has(cacheKey)) {
    if (popup != "") {
      this.innerDialogRef = this.dialog.open(popup, {
        width: '100%',
        disableClose: true
      });
    }
    this.initializeForm(cacheKey);
    return;
  }

  // ✅ Else fetch from API
  this.SpinnerService.show();
  this.dataService.getotherattribute(this.prodcode, "GRN").subscribe(result => {
    this.SpinnerService.hide();

    // ✅ Save API response to patch array
    this.otherattributespatching = result.data;

    // ✅ Create empty cache entry so initializeForm works
    this.otherAttributesCache.set(cacheKey, {
      rawData: result.data,
      values: [] // no user values yet
    });

    if (popup != "") {
      this.innerDialogRef = this.dialog.open(popup, {
        width: '100%',
        disableClose: true
      });
    }

    this.initializeForm(cacheKey);
  });
}

initializeForm(cacheKey: string) {
  // Always fresh form
  this.myForm = this.fb.group({
    attributes: this.fb.array([])
  });
  const formArray = this.myForm.get('attributes') as FormArray;

  // Get cache
  const cached = this.otherAttributesCache.get(cacheKey);
  const cachedValues = cached?.values || [];

  // Build controls
  this.otherattributespatching.forEach((attr, idx) => {
    const value = cachedValues[idx] ?? null;
    formArray.push(this.fb.control(value));
  });

  // Unsubscribe old one
  if (this.formArraySubscription) {
    this.formArraySubscription.unsubscribe();
  }

  // Auto-cache on every change
  this.formArraySubscription = formArray.valueChanges.subscribe(values => {
    this.otherAttributesCache.set(cacheKey, {
      rawData: this.otherattributespatching,
      values: values,
      formatted: cached?.formatted || []
    });
  });
}

// ----------------------
// INITIALIZE FORM
// ----------------------
// initializeForm(cacheKey: string) {
//   const formArray = this.myForm.get('attributes') as FormArray;
//   formArray.clear();

//   const cached = this.otherAttributesCache.get(cacheKey);
//   const rawData = cached?.rawData || [];
//   const cachedValues = cached?.values || [];

//   // Build form controls (cached values if present, otherwise null)
//   rawData.forEach((attr, idx) => {
//     const value = cachedValues[idx] ?? null;
//     formArray.push(this.fb.control(value));
//   });

//   // Prevent duplicate subscriptions
//   if (this.formArraySubscription) {
//     this.formArraySubscription.unsubscribe();
//   }

//   // Auto-cache on every change
//   this.formArraySubscription = formArray.valueChanges.subscribe(values => {
//     this.otherAttributesCache.set(cacheKey, {
//       rawData: rawData,          // BE fields
//       values: values,            // user-entered values
//       formatted: cached?.formatted || []
//     });
//     console.log("Auto cached:", cacheKey, values);
//   });
// }



// ----------------------
// SUBMIT FORM
// ----------------------
// submitattributeForm(grn, grndetails) {
//   if (this.myForm.valid) {
//     const cacheKey = `${grn?.poheader_id}_${grn?.podetails_id}_${grndetails.value.assetid}`;
//     const cached = this.otherAttributesCache.get(cacheKey);
//     const rawData = cached?.rawData || [];

//     const formArrayValues = this.myForm.get('attributes')?.value;

//     const otherAttributes = rawData.map((attr, index) => ({
//       specification: attr.specification,
//       configuration: formArrayValues[index]   // ✅ take user value
//     }));

//     const formattedOtherAttribute = otherAttributes
//       .filter(attr => attr.configuration) 
//       .map(attr => {
//         const value = typeof attr.configuration === 'object'
//           ? attr.configuration.data_value || ''
//           : attr.configuration;
//         return { [attr.specification]: value };
//       });

//     // ✅ Overwrite cache with final submitted values
//     this.otherAttributesCache.set(cacheKey, {
//       rawData: rawData,
//       values: formArrayValues,             // ✅ user entered values
//       formatted: formattedOtherAttribute   // ✅ final formatted
//     });

//     console.log("Cache after submit:", this.otherAttributesCache);

//     this.notification.showSuccess('Saved Successfully!');
//     this.closebtn();
//     this.closeInnerDialog();
//   }
// }

submitattributeForm(grn, grndetails) {
  if (this.myForm.valid) {
    const cacheKey = `${grn?.poheader_id}_${grn?.podetails_id}_${grndetails.value.assetid}`;
    const formArrayValues = this.myForm.get('attributes')?.value;

    const otherAttributes = this.otherattributespatching.map((attr, index) => ({
      specification: attr.specification,
      configuration: formArrayValues[index]
    }));

    const formattedOtherAttribute = otherAttributes
      .filter(attr => attr.configuration) 
      .map(attr => {
        const value = typeof attr.configuration === 'object'
          ? attr.configuration.data_value || ''
          : attr.configuration;
        return { [attr.specification]: value };
      });

    // ✅ Overwrite cache completely
    this.otherAttributesCache.set(cacheKey, {
      rawData: this.otherattributespatching,
      values: formArrayValues,          // ✅ latest user values
      formatted: formattedOtherAttribute
    });
    let dict={
      id:grndetails.value.assetid,
      array:formattedOtherAttribute
    }
this.sam_array.push(dict)
    console.log("Cache after submit:", this.otherAttributesCache);

    this.notification.showSuccess('Saved Successfully!');
    this.closebtn();
    this.closeInnerDialog();
  }
}




objectKeys = Object.keys;

parseAttributes(attrStr: string): any[] {
  try {
    // Replace single quotes with double quotes to make it JSON valid
    const fixed = attrStr.replace(/'/g, '"');
    return JSON.parse(fixed);
  } catch (e) {
    console.error("Error parsing other_attribute:", attrStr, e);
    return [];
  }
}


crntamtchange(event: Event, index: number, grninward: any) {
  const inputEl = event.target as HTMLInputElement;
  const oldValue = inputEl.value || '';
  const selectionStart = inputEl.selectionStart ?? oldValue.length;

  // Count digits before cursor (ignore commas)
  const digitsBeforeCursor = oldValue.slice(0, selectionStart).replace(/,/g, '').length;

  // Remove commas and invalid chars
  let raw = oldValue.replace(/,/g, '').replace(/[^0-9.]/g, '');
  raw = raw.replace(/(\..*)\./g, '$1'); // prevent multiple dots

  // Allow user typing only "." or empty
  if (raw === '' || raw === '.') {
    this.crntamt.controls[index].setValue(null, { emitEvent: false });
    inputEl.value = raw;
    return;
  }

  // Convert to number and round properly to 2 decimals
  let val = parseFloat(raw);
  if (isNaN(val)) val = 0;
  // val = Math.round((val + Number.EPSILON) * 100) / 100; // ✅ correct rounding
  val = Math.floor(val * 100) /100;
  // ✅ Validation 1: not less than 0
  if (val < 0) {
    this.notification.showWarning('Please enter a value greater than 0');
    val = grninward?.amount - grninward?.received_amount;
  }
  // ✅ Validation 2: not greater than balance
  else if (val > (+grninward.amount - grninward.received_amount)) {
    this.notification.showWarning('Entered Amount is Higher than the Balance Amount, Pls Check...');
    val = grninward.amount - grninward.received_amount;
  }

  // ✅ Update form control and related qty
  this.crntamt.controls[index].setValue(val, { emitEvent: false });
  const newQty = (val / grninward.amount) * grninward.qty;
  this.rcdqnty.controls[index].setValue(+newQty.toFixed(2));

  // ✅ Format display value with Indian commas
  const formatted = val.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  inputEl.value = formatted;
  this.displayAmount[index] = formatted;

  // ✅ Restore cursor position (same place user was typing)
  let count = 0;
  let targetPos = formatted.length;
  for (let i = 0; i < formatted.length; i++) {
    if (formatted[i] !== ',') count++;
    if (count === digitsBeforeCursor) {
      targetPos = i + 1;
      break;
    }
  }

  inputEl.setSelectionRange(targetPos, targetPos);
}

// crntamtBlur(event: Event, index: number) {
//   const inputEl = event.target as HTMLInputElement;
//   let val = this.crntamt.controls[index].value;

//   if (val !== null && val !== undefined && !isNaN(val)) {
//     inputEl.value = Number(val);
//   }
// }
 

showSpinner() {
  this.loadingProcesses++;
  console.log('Spinner shown. Active processes:', this.loadingProcesses); // Debugging log
  this.SpinnerService.show();
}

// Function to hide the spinner
hideSpinner() {
  this.loadingProcesses--;
  console.log('Spinner hidden. Active processes:', this.loadingProcesses); // Debugging log
  if (this.loadingProcesses <= 0) {
    this.loadingProcesses = 0; // Prevent negative counter
    this.SpinnerService.hide();
  }
}
//  omit_special_num(event) {
//     var k;
//     k = event.charCode;
//     return k == 190 || (k >= 48 && k <= 57) || k == 46; //6556
//   }
omit_special_num(event) {
  let k = event.charCode ? event.charCode : event.keyCode;

  // Allow numbers (0–9) → ASCII 48–57
  if (k >= 48 && k <= 57) {
    return true;
  }

  // Allow dot (.) → ASCII 46
  if (k === 46) {
    return true;
  }

  return false;
}




// crntamtchange(event: Event, index: number, grninward: any) {
//   const inputEl = event.target as HTMLInputElement;

//   // Remove commas + leading zeros
//   let raw = inputEl.value.replace(/,/g, '').replace(/^0+(?=\d)/, '');
//   let val = parseFloat(raw);

//   if (isNaN(val)) val = 0;

//   // ✅ Store raw value in FormControl
//   this.crntamt.controls[index].setValue(val, { emitEvent: false });

//   // ✅ Validation
//   if (val < 0) {
//     this.notification.showWarning('Please enter a value greater than 0');
//     val = grninward.amount - grninward.received_amount;
//     this.crntamt.controls[index].setValue(val, { emitEvent: false });
//   } else if (val > (+grninward.amount - grninward.received_amount)) {
//     this.notification.showWarning('Entered Amount is Higher than the Balance Amount, Pls Check...');
//     val = grninward.amount - grninward.received_amount;
//     this.crntamt.controls[index].setValue(val, { emitEvent: false });
//   } else {
//     // recalc qty
//     const newQty = (val / grninward.amount) * grninward.qty;
//     this.rcdqnty.controls[index].setValue(+newQty.toFixed(2));
//   }

//   // ✅ Show formatted instantly
//   inputEl.value = isNaN(val)
//     ? ''
//     : val.toLocaleString('en-IN', {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2
//       });

//   // Keep displayAmount array in sync (optional)
//   this.displayAmount[index] = inputEl.value;
// }

// crntamtBlur(event: Event, index: number) {
//   const inputEl = event.target as HTMLInputElement;
//   let val = this.crntamt.controls[index].value;

//   if (val !== null && val !== undefined && !isNaN(val)) {
//     inputEl.value = Number(val).toLocaleString('en-IN', {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2
//     });
//     this.displayAmount[index] = inputEl.value;
//   }
// }

// // Allow only digits + one decimal
// omit_special_num(event: KeyboardEvent) {
//   let k = event.keyCode || event.which;

//   // Numbers (0–9)
//   if (k >= 48 && k <= 57) return true;

//   // Decimal dot
//   if (k === 46) {
//     const inputEl = event.target as HTMLInputElement;
//     if (inputEl.value.includes('.')) {
//       event.preventDefault();
//       return false;
//     }
//     return true;
//   }

//   // Block others
//   event.preventDefault();
//   return false;
// }

formatIndianNumberInput(event: any) {
  let val = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
  const parts = val.split('.');
  const intPart = parts[0].replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  event.target.value = parts[1] ? intPart + '.' + parts[1] : intPart;
}
formatDisplayAmount(value: any): string {
  if (value === null || value === undefined || value === '') return '';
  const num = parseFloat((value + '').replace(/,/g, ''));
  return isNaN(num) ? value : num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

  

}









      