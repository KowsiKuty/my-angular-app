import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup ,} from '@angular/forms';
import { RmuApiServiceService } from '../rmu-api-service.service';
import { ArchivalformComponent } from '../archivalform/archivalform.component'
import { ReturnrequestComponent } from '../returnrequest/returnrequest.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../service/notification.service';
// import { ViewarchivalComponent } from '../viewarchival/viewarchival.component';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe, formatDate } from '@angular/common';
// import { arch } from 'os';
// import { AnyRecordWithTtl } from 'dns';
import { environment } from 'src/environments/environment';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { debounceTime, distinctUntilChanged, finalize, map, takeUntil, tap } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { Chart, registerables } from "chart.js";
import "chartjs-plugin-datalabels";
Chart.register(...registerables);
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ErrorhandlingService } from 'src/app/ppr/errorhandling.service';
import { ErrorHandlingServiceService } from 'src/app/service/error-handling-service.service';


export interface rmu {
  name: string;
  code: string;
  box_number:string
}
export interface DropDown {
  id: Number;
  name: string;
}
export interface Barcode {
  id: Number;
  bar_code_number: string;
}

export interface DropDown {
  id: Number;
  name: string;
}
export interface Barcode {
  id: Number;
  bar_code_number: string;
}
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

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
  selector: 'app-archivalmaster',
  templateUrl:      './archivalmaster.component.html',
  styleUrls: ['./archivalmaster.component.scss'],
   providers: [{ provide: DateAdapter, useClass: PickDateAdapter },
      { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
        DatePipe],
})
export class ArchivalmasterComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger)autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild("closemasterbutton") closemasterbutton: ElementRef;
  @ViewChild("vendor_input") vendor_input: any;
  @ViewChild("product_details") product_details: any;
  @ViewChild("product_auto") product_auto: MatAutocomplete;
    @ViewChild("vendor_auto") vendor_auto: MatAutocomplete;
    @ViewChild("vendor2") vendor2: any;
    @ViewChild("vendor2_auto") vendor2_auto: MatAutocomplete;
    @ViewChild('chartCanvas1')chartRef2:ElementRef;
    ///archival product
    @ViewChild('arch_product_auto')arch_product_auto:MatAutocomplete;
    @ViewChild('arch_product')arch_product:any;
  @ViewChild('autostorage') autostorage:MatAutocomplete
  @ViewChild('autostorage1') autostorage1:MatAutocomplete
  @ViewChild('vendorBar') vendorBar:MatAutocomplete
@ViewChild('closebuttonBarcode')closebuttonBarcode:ElementRef
@ViewChild('autostoragevendor') autostoragevendor:MatAutocomplete
@ViewChild('FileUploadFetch') FileUploadFetch:ElementRef
@ViewChild('inputFile')inputFile:ElementRef
@ViewChild('closeachieval_approve_popup') closeachieval_approve_popup:ElementRef;
@ViewChild('closeachieval_upload_popup')closeachieval_upload_popup:ElementRef;

///productedit
@ViewChild('arch_productedit_auto')arch_productedit_auto:MatAutocomplete;
@ViewChild('arch_productedit')arch_productedit:any;
///box name
@ViewChild("box_name_input") box_name_input: any;
@ViewChild('box_name_auto') box_name_auto:MatAutocomplete

///box edit
@ViewChild("boxedit_name_input") boxedit_name_input: any;
@ViewChild('boxedit_name_auto') boxedit_name_auto:MatAutocomplete

///box_number
@ViewChild("boxedit_number_input") boxedit_number_input: any;
@ViewChild('boxedit_number_auto') boxedit_number_auto:MatAutocomplete

///status
@ViewChild('Status_Type') Status_Type:MatAutocomplete
@ViewChild('Status_Type1') Status_Type1:MatAutocomplete
///fetch_prod
@ViewChild('fetch_prod')fetch_prod:any;
@ViewChild ('fetch_prod_auto')fetch_prod_auto:MatAutocomplete;

///fetchupload
@ViewChild('fetch_prod_upload')fetch_prod_upload:any;
@ViewChild ('fetch_prod_upload_auto')fetch_prod_upload_auto:MatAutocomplete;

  infiniteScroll: InfiniteScrollDirective;
  box_number_list: any;
  mapping_box_id: any;
  selectedData: any=[];
  archival_box_id: any;
  delete_btn: boolean;
  selected_checkboxs: any=[];
  BarCodeDropDownData=[]
  vendorlists: any;
  UploadData:any;
  UploadDatas:any;
  ChildData={}
  edit_type: string;
  EditData:any;
  box_count_patch: any;
  prod_upload_pagination: { prev: any; next: any; index: any; };
  box_name_pagination: { prev: any; next: any; index: any; };
  box_name_DownData: any;
  product_view: boolean=false;
  product_datas_view: any;
  product_fetch_list: any;
  product_fetchpagination: { prev: any; next: any; index: any; };
  fetch_prod_upload_list: any;
  product_arcvaledit_pagination: { prev: any; next: any; index: any; };
  product_listdetail_pagination: { prev: any; next: any; index: any; };
  product_arcval_list_pagination: { prev: any; next: any; index: any; };
  product_arcvaledit_list: any;
  archedit_box_list: any;
  box_numberedit_list: any;
  boxedit_name_DownData: any;
  boxedit_name_pagination: { prev: any; next: any; index: any; };
  boxedit_number_pagination: { prev: any; next: any; index: any; };
  edit_data_id: any;
  edit_mapped_id: any=[];
  fetch_prod_upload_DropDownData: any;
  SearchSummary: any;
  columns: any;
  table_show_hide: boolean;
  has_nextvalid: any;
  has_previousvalid: any;
  presentpage_valid: any;
  datass_valid: boolean;
  keys: string[];
  box_count_value_Check: any;
  search_product_upload: boolean=false;
  edit_box_data: any;
  selected_check_box_datas: any;
  check_boxselect_view: boolean=false;
  partially_map_count: any;
  data_id_count: any;
  data_occupaid_count: any;
  archivpresentpage_valid: any=1;
  archivalhas_previousvalid: boolean=false;
  archivalhas_nextvalid: boolean=false;
  archivalvalidsummary: any;
  table_values_table_hide:boolean=true
  PopUpIcon:boolean=false
  rmu_checkbox: boolean=false;
    @ViewChild(InfiniteScrollDirective) set appScroll(directive: InfiniteScrollDirective) { this.infiniteScroll = directive; }

  url = environment.apiURL
  isloading:boolean=false
  summaryarchival: FormGroup;
  cancelrequest: FormGroup;
  createLegitimates: FormGroup;
  CreateForm=new FormGroup({
    Vendor:new FormControl(''),
    BoxName:new FormControl(''),
    FromSession:new FormControl(''),
    ToSession:new FormControl('')
  })
  searchpresentpage: any = 1
  archivalsummarylist = [];
  archivalsummarylists = []
  boxlevellists = [];
  filelevellists = [];
  singlerecord: any = [];
  user: string;
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  queryparams = {
    archival: 'new'
  };
  searchid: any;
  lists: any;
  archival_code: any;
  searcharchievalvar: any = "String"
  archstatus = {
    CANCELLED: "CANCELLED",
    SCHEDULED: "SCHEDULED",
    REQUESTED: "REQUESTED",

  }
  currentDate: Date = new Date();
  send_value: any;
  archivalrequestForm: any;
  vendorlist: any;
  uploadfile: any;
  productlist: any;
  mychoice: boolean = true;
  addrdetails: any;
  emplogCode: any;
  emplogPhone: any;
  @ViewChild('closebtn') closebtn: ElementRef;
  emplogId: any;
  archivalsummaryData: any
  archivalsummary: any
  @ViewChild("closearchivalecode") closearchivalecode;
  archival_summary_search: any
  archievalbutton: any
  vendor_drop: any
  vendor_status: any
  globalid: any;
  archieval_summaryapi: any
  archival_summary: any
  archival_summary_popup: any
  archival_summary_popup1: any
  archieval_summaryapi_popup: any
  showmainsummary: boolean = true;
  showaddnew: boolean = false;
  UploadBarcodeBool:boolean=false
  showDataFetch: boolean = false;
  showFileUpload: boolean = false;
  data_fetchInputs: any;
  dataFetchForm: FormGroup;
  dataUploadform: FormGroup;
  fas_file_name: any;
  fas_file_names:any;
  OccupiedCountData:any=-1
  filedatagroup: FormGroup;
  hass_previous: boolean;
  hass_next: boolean;
  cr_no: any;
  Archivalvendor:any;
  has_nextarchal: any;
  has_previousarchal: any;
  presentpagearchal: any;
  datass_found: boolean;
  Selected: boolean;
  @ViewChild('ModalDisplayBar')ModalDisplayBar:ElementRef
  checker: any;
  checker_id: any;
  debitChecker: number;
  creditChecker: number;
  Allselectchecker: any;
  All_data: any;
  chechbox_id: any = [];
  CheckBoxSubmit=[]
  sumary_id: any=[];
  ischeckedall: boolean=false;
  BatchGenerateBool:boolean=false
  checked: any=35;
  hasarchivalECF_next: any;
  hasarchivalECF_previous: any;
  presentarchivalECFpage: any;
  master_edit_id: any;
  edit_master_update:FormGroup;
  isLoading: boolean;
  vendor_list: any;
  particular_data_id: any;
  has_previousarchalview: boolean;
  presentpagearchalview: number;
  has_nextarchalview: boolean;
  datass_foundview: boolean;
  archivalsummaryview: any;
  datas_id: any;
  Approval_disable: any;
  document_count_data: any;
  BatchRmuData=[]
  selectedCount: any;
  Approval_counts: any;
  disabled_check_box: boolean=true;
  occupied_counts: any;
  productlist_id_data: any=[];
  product_doct_id: any;
  closed_by: any;
  edit_data: any;
  edit_screen: boolean;
  select_count_data: number;
  myChart2: Chart<"bar", any[], any>;
  label_List=["Occupied Count"]
value_list=[]
  totalcount: any;
  data_file_edit: boolean;
  product_list: any;
  box_list: any;
  has_nextarchaldetails: any;
  has_previousarchaldetails: any;
  presentpagearchaldetails: any;
  datass_founddetails: boolean;
  archivalsummarydetails: any;
  status_list: { name: string; id: number; }[];
  product_arcval_list: any;
  arch_box_list: any;
  status_lists: { name: string; id: number; }[];
  box_id: any;
  status_listed: { name: string; id: number; }[];
  Approval_diasble: boolean;
  batchcount=new FormControl('')
  ProductGenerateBatch:any
  ProductGenerateNumber:any
  BatchGenerate:boolean=false
  constructor(private errorHandler: ErrorHandlingServiceService,private datePipe:DatePipe,private fb: FormBuilder, private router: Router, public dialog: MatDialog, private rmuservice: RmuApiServiceService, private notification: NotificationService, private SpinnerService: NgxSpinnerService,private datepipe:DatePipe) {
    // this.archivalsummaryData = [{"columnname": "Archival Code", "key": "archival_code"},{"columnname": "Date", "key": "archival_date",type: "Date","datetype": "dd-MM-yyyy"},{"columnname": "No Of Boxes", "key": "num_of_boxes"},{"columnname": "Status", "key": "archival_status","type": "object", "objkey": "value"},{"columnname": "Box Level ",icon: "payment",style: {cursor:"pointer"},button: true, function: true,clickfunction: this.getboxlevel.bind(this)},{"columnname": "File Level ",icon: "insert_drive_file",style: {cursor:"pointer"},button: true, function: true,clickfunction: this.getfilelevel.bind(this)}]
    this.archivalsummaryData = [{ "columnname": "Box No" }, { "columnname": "Product" }, { "columnname": "Archival Date", "key": 'archival_date' }, { "columnname": "Archival Status", "key": 'archival_status?.value' }, { "columnname": "Vendor Barcode" }, { "columnname": "Document Count" }, { "columnname": "Storage Vendor" }, { "columnname": "Action" }]
    this.archivalsummary = { "method": "get", "url": this.url + "rmuserv/archival_create", params: "" }
    // this.archival_summary;
    this.archival_summary_popup = [{ "columnname": "Archival Date", "key": "archival_date", type: "Date", "datetype": "dd-MM-yyyy" }, { "columnname": "Barcode Type", "key": "barcode_type", "type": "object", "objkey": "name" }, { "columnname": "Barcode No", "key": "barcode_no" }, { "columnname": "Vendor", "key": "vendor", "type": "object", "objkey": "name" }, { "columnname": "Status", "key": "archival_status", "type": "object", "objkey": "value" }]
    this.archival_summary_popup1 = [{ "columnname": "Product", "key": "product", type: "object", "objkey": "name" }, { "columnname": "Product Barcode", "key": "product_barcode" }, { "columnname": "Retention Date", "key": "retention_date", type: "Date", "datetype": "dd-MM-yyyy" }, { "columnname": "Status", "key": "archival_status", type: "object", "objkey": "value" }]
    this.Archivalvendor= {
      label: "Vendor",
      method: "get",
      url: this.url + "rmuserv/vendor",
      params: "",
      searchkey: "query",
      displaykey: "name",
      Outputkey: "code",
    };
    this.archival_summary_search = [{ "type": "date", "label": "Archival Date", formvalue: "archival_date" },{ "type": "dropdown", "label": "Vendor", formvalue: "vendor",inputobj: this.Archivalvendor, }, ]
    // this.archievalbutton = [{icon: "add","tooltip":"rmutooltip",function: this.vendorpopupopen.bind(this), "name": "ADD" }{ "type": "dropdown", "label": "Status", "formvalue": "transdate" }]
    this.archievalbutton = [{ icon: "add", "tooltip": 'Add', function: this.addnewarchival.bind(this), "name": "New Archival" }]

    this.data_fetchInputs = [{ "type": "dropdown", "label": "Product", formvalue: "product" }, { "type": "date", "label": "From Date", "formvalue": "fromdate" }, { "type": "date", "label": "To Date", "formvalue": "todate" }, { "type": "dropdown", "label": "Status", formvalue: "status" }]
  }
  archivalmasterForm:FormGroup;
  archival_details:FormGroup;
  archival_edit:FormGroup;
  VendorDropDownData=[]
  BoxNameDropDownData=[]
  UploadDocuments=false
  Vendorpagination={
    prev:false,
    next:false,
    index:1
  }
  BarCodepagination={
    prev:false,
    next:false,
    index:1
  }
  BoxNamepagination={
    prev:false,
    next:false,
    index:1
  }
  FileUploadPagination={
    has_prev:false,
    has_next:false,
    index:1
  }
  ngOnInit(): void {
    this.summaryarchival = this.fb.group({
      archival_code: '',
      archival_date: '',
      vendor: null,
      action: '',
      archival_status: ''

    })
    this.dataFetchForm = this.fb.group({
      product: '',
      from_date: '',
      to_date: '',
      status: ''
    })
    this.filedatagroup = this.fb.group({
      archivaldate:new Date(),
      boxno: '',
      count: '',
      crno: '',
      product:'',
      box_name:'',
      status_name:[],
      file_fas_upload:'',
      Batch:'',
      BatchCount:'',
    })
    this.dataUploadform = this.fb.group({
      product: '',
      file_fas_upload: ''
    })
    this.cancelrequest = this.fb.group({
      id: '',
      comments: '',
    })
    this.createLegitimates = this.fb.group({
      barcode_no: '',
      legitimate_date: '',
      comment: '',
    })
    // this.getarchivalsummary();


    this.archivalrequestForm = this.fb.group({
      archival_type: 1,
      barcode_type: 1,
      vendor: '',
      num_of_boxes: '',
      comments: '',
      filedata: '',
      productlist: '',
      contact_person: '',
      contact_no: '',
      contact_address: '',

    })

    this.archivalmasterForm=this.fb.group({
      archival_date:[''],
      vendor:[''],
      status_name:[],
      box_names:[],
      Vendor:['']
    })
this.edit_master_update=this.fb.group({
  archivaldate:new Date(),
  boxno:'',
  vendor:''
})

this.archival_details=this.fb.group({
  product:[''],
  box_name:[''],
  box_count:[],
  status_name:[],
  box_number:[]
})
this.archival_edit= this.fb.group({
  product:[''],
box_name:[''],
boxno:[''],
status_name:[''],
count:[''],
crno:[''],
file_fas_upload:'',
Batch:'',
BatchCount:''
})

    // this.getvendorValue('');
    this.rmuservice.getproducts().subscribe(res => {
      let data = res['data']
      if(data.length!=0){
      this.productlist=data
      this.productlist.forEach(item => {
        if (item.status===0) {
          this.productlist_id_data=item
          // this.archievalsummarySearch("")
        }
      }, error => {
        // this.SpinnerService.hide();
        this.errorHandler.handleError(error);
        })
      }
    })


    this.getvendordd();
    this.getarchivalECF("");
    this.first_function()
    this.archievalsummarySearch('');
    this.check_boxselected_summary()
    this.check_box_delete_value()
  }

  editarchival() {
    this.dialog.open(ArchivalformComponent,
      {
        disableClose: true,
        width: '60%',
        panelClass: 'mat-container'
        //data: data
      })
  }
  returnreq() {
    this.dialog.open(ReturnrequestComponent,
      {
        disableClose: true,
        width: '60%',
        panelClass: 'mat-container'
        //data: data
      })

  }

  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.getarchivalsummary()
  }

  prevpage() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1

    }
    this.getarchivalsummary()
  }

  prevpages() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1

    }
    //  this.getarchivalsummary()
    this.getfilelevel('');

  }

  nextpages() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.getfilelevel('');

    // this.getboxlevel(id, code, date)()

  }


  getarchivalsummary() {
    this.rmuservice.getarchivalsummary(this.pagination.index).subscribe(results => {
      this.archivalsummarylist = results['data'];
      this.pagination = results.pagination ? results.pagination : this.pagination;
      if (results.status == 'success') {
        this.notification.showSuccess("Records Uploaded Successfully")
      }
      else {
        //this.notification.showError(results.description)

      }

    })
  }
  viewarchival() {

    this.queryparams,
      this.router.navigate(['rmu/viewarchival'], { queryParams: this.queryparams });

  }
  getsinglerecord(datas) {
    console.log("Datas", +datas)

    this.rmuservice.getsinglerecord(datas).subscribe(results => {
      this.singlerecord = results;
      console.group(results);
      this.pagination = results.pagination ? results.pagination : this.pagination;
      if (results.status == 'success') {
      }
      else {

      }

    })
  }

  deletesinglerecord() {
    console.log("CANCEL REQUESTS", this.cancelrequest.value.id)
    this.rmuservice.deleterecord(this.cancelrequest.value.id, this.cancelrequest.value.comments).subscribe(results => {

      if (results.status == 'success') {
        this.notification.showSuccess("Archival Cancelled")
      }
      else {
        this.notification.showError(results.description)

      }

    }, error => {
      this.SpinnerService.hide();
      this.errorHandler.handleError(error);
      })

  }
  getboxlevel(data) {
    this.popupopen()
    // console.log("Datas coming",+id+code+date)

    this.archieval_summaryapi = {
      method: "get",
      url: this.url + "rmuserv/archival_get", "params": "&archivalrequest=" + data.id
    };
  }

  getfilelevel(datas) {
    this.popupopenfilelevelform()
    this.archieval_summaryapi_popup = {
      method: "get",
      url: this.url + "rmuserv/archival_details_get", "params": "&archival_id=" + datas.id
    };
  }
  canceldata(data) {

    this.cancelrequest.patchValue({
      id: data.id,
      comments: ''


    })
  }

  searcharchival(page=1) {
    let archCode = this.summaryarchival.value.archival_code
    let archDate = this.summaryarchival.value.archival_date
    let vendor = this.summaryarchival.value.vendor
    let status = this.summaryarchival.value.archival_status
    if(this.dataFetchForm.value.from_date=="" || this.dataFetchForm.value.from_date==null || this.dataFetchForm.value.from_date==undefined){
      this.notification.showWarning("Please Select From Date")
      return false
    }
    if(this.dataFetchForm.value.to_date=="" || this.dataFetchForm.value.to_date==null || this.dataFetchForm.value.to_date==undefined){
      this.notification.showWarning("Please Select To Date")
      return false
    }
    let from_date=this.datePipe.transform(this.dataFetchForm.value.from_date, 'yyyy-MM-dd')
    let to_date=this.datePipe.transform(this.dataFetchForm.value.to_date, 'yyyy-MM-dd')

    this.send_value = {"from_date": from_date,
      "to_date": to_date,
      "type": "CR_STATUS_GET"
      }
  this.SpinnerService.show()
    this.rmuservice.getarchivalfetch_search(this.send_value,  page).subscribe(results => {
      this.archivalsummarylist = results['data'];
      this.SpinnerService.hide()
      this.pagination = results.pagination ? results.pagination : this.pagination;
      if (results.status == 'success') {
        this.notification.showSuccess(results?.message)
        this.dataFetchForm.get('from_date').reset()
        this.dataUploadform.get('to_date').reset()
      }
      else {

      }
    }, error => {
      this.SpinnerService.hide();
      this.errorHandler.handleError(error);
      })
  }
  FileUpload(){
    // let data=this.inputFile.nativeElement.innerText
    if(!this.dataUploadform.get('product').value){
      this.notification.showError('Please Select Product')
      return false
    }
    if(this.dataUploadform.value.file_fas_upload=='' || this.dataUploadform.value.file_fas_upload== undefined || this.dataUploadform.value.file_fas_upload == null){
      this.notification.showWarning('Please Choose The File');
      return false;
    }
    else{
      this.SpinnerService.show()
      this.rmuservice.uploadfileuploadfetch(this.dataUploadform.get('product').value?this.dataUploadform.get('product').value?.id:'',this.fas_file_name).subscribe(result=>{
        this.SpinnerService.hide()
        if(result?.message){
          this.notification.showSuccess(result?.message)
          this.fas_file_name=''
          this.dataUploadform.get('file_fas_upload').reset()
          this.valid_serch_details('')
        }
        else{
          this.notification.showError(result?.description)
          this.fas_file_name=''
          this.dataUploadform.get('file_fas_upload').reset()
          this.valid_serch_details('')
        }
      }, error => {
        this.SpinnerService.hide();
        this.errorHandler.handleError(error);
        })
    }
  }


  submitLegitimate() {
    console.log("Datas coming",)
    this.rmuservice.submitlegitimaterequest(this.createLegitimates.value).subscribe(results => {
      this.boxlevellists = results.data;

      this.pagination = results.pagination ? results.pagination : this.pagination;
      if (results.status == 'success') {
        this.notification.showSuccess("Legitmate document Successfully Created")
      }
      else {
        this.notification.showError(results.description)

      }

    }, error => {
      this.SpinnerService.hide();
      this.errorHandler.handleError(error);
      })
  }

  legitimatedata(datas) {
    this.createLegitimates.patchValue({
      barcode_no: datas.id,
      legitimate_date: '',
      comment: '',
    })
  }

  deleteLegitimate(datas) {

    this.rmuservice.deletelegitimate(datas).subscribe(results => {
      // this.boxlevellists = results.data;

      this.pagination = results.pagination ? results.pagination : this.pagination;
      if (results.status == 'success') {
        this.notification.showSuccess("Legitimate Document Deleted")
      }
      else {
        this.notification.showError(results.description)

      }

    }, error => {
      this.SpinnerService.hide();
      this.errorHandler.handleError(error);
      })

  }


  uploadchoose(evt) {
    this.uploadfile = evt.target.files[0];
    this.archivalrequestForm.get('filedata').setValue(this.uploadfile);

  }

  formatdownload() {
    let vals = this.archivalrequestForm.value.productlist;
    console.log("Product Value", +vals);
    this.rmuservice.archivalformatdownload(vals).subscribe(results => {
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'SampleFormat' + ".xlsx";
      link.click();
    }, error => {
      this.SpinnerService.hide();
      this.errorHandler.handleError(error);
      })
  }

  enableAddress() {
    this.mychoice = false;
  }

  getaddres() {
    this.rmuservice.getaddress()
      .subscribe(result => {
        console.log("Address Data", result.address)
        this.addrdetails = result.address
        this.emplogCode = result.code
        this.emplogPhone = result.phone_number
        this.emplogId = result.employee_id;
        this.archivalrequestForm.patchValue({ contact_person: this.emplogCode })
        this.archivalrequestForm.patchValue({ contact_no: this.emplogPhone })
      }, error => {
        this.SpinnerService.hide();
        this.errorHandler.handleError(error);
        })
  }


  submitArchivalrequest() {

    if (this.uploadfile) {
      // this.rmuservice.submitarchival(this.firstFormGroup.value, this.uploadform.get('filedata').value).subscribe(results => {

      this.archivalrequestForm.get('contact_person').setValue(this.emplogId);
      this.rmuservice.submitarchival(this.archivalrequestForm.value, this.archivalrequestForm.get('filedata').value).subscribe(results => {
        this.archivalsummarylists = results['data'];
        this.pagination = results.pagination ? results.pagination : this.pagination;
        if (results.status == 'success') {
          this.notification.showSuccess("Files Uploaded Successfully")
          this.closearchivalecode.nativeElement.click();
        }
        else {
          this.notification.showError(results.description);
        }
      }, error => {
        this.SpinnerService.hide();
        this.errorHandler.handleError(error);
        })
    }
  }


  popupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("boxlevelform"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }

  popupopenfilelevelform() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("filelevelform"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  vendorpopupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("addNew"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  closedpopup() {
    this.closearchivalecode.nativeElement.click();
  }


  archievalsummarySearch(archieval,pageNumber=1) {
    let from_date=this.datePipe.transform(this.archivalmasterForm.value.archival_date, 'yyyy-MM-dd')
    let  fromdate=from_date?from_date:""
    let vendor=this.archivalmasterForm.value.vendor?.id??""
    let archival_status=this.archivalmasterForm.value.status_name?.id??""
    let box_name=this.archivalmasterForm.value.box_names?.id??""
    this.SpinnerService.show()
    this.rmuservice.get_archival_master_summary("",fromdate,vendor,archival_status,box_name,1,pageNumber).subscribe((results)=>{
        console.log("result=>",results)
      let data=results['data']
      let datapagination = results["pagination"];
      this.archivalsummary =data
      this.archivalsummary  = this.archivalsummary

      this.SpinnerService.hide()
      if (this.archivalsummary ?.length > 0) {
        this.has_nextarchal = datapagination.has_next;
        this.has_previousarchal = datapagination.has_previous;
        this.presentpagearchal = datapagination.index;
        this.datass_found=true
      }if(this.archivalsummary ?.length == 0){
        this.has_nextarchal = false;
        this.has_previousarchal = false;
        this.presentpagearchal = 1;
        this.datass_found=false
      }
      } , error => {
    this.SpinnerService.hide();
    this.errorHandler.handleError(error);
    })
  }
  previousClick() {
    if (this.has_previousarchal === true) {
      this.archievalsummarySearch(this.archivalmasterForm,this.presentpagearchal - 1);
    }
  }
  nextClick() {
    if (this.has_nextarchal === true) {
      this.archievalsummarySearch(this.archivalmasterForm,this.presentpagearchal + 1)
    }

  }
  addnewarchival() {
    this.PopUpIcon=false
    this.showmainsummary = false;
    this.showaddnew = true;
    this.UploadBarcodeBool=false
    this.checkbox_select=false;
    this.disabled_check_box = false;
    this.archivalsummarylists= []
    this.selected_data_view=[]
    this.selected_id_view=[]
    this.selected_check_box_datas=[]
    this.chechbox_id=[]
    this.occupied_counts=[]
    this.selected_check_value=""
    this.data_id_count=0
    this.occupied_counts=0
    this.check_box_delete_value()
  }
  fileUpload() {
    this.showDataFetch = false;
    this.showFileUpload = true;
    this.dataFetchForm.reset()
  }

  dataFetch() {
    this.showDataFetch = true;
    this.showFileUpload = false;
    this.dataUploadform.reset()
    this.fas_file_name=''
  }
  Searchbtn(page){
    this.search_product_upload=true;
    if(!this.dataUploadform.get('product').value){
      this.notification.showError("Please Select Product")
      return false
    }
    let Product=this.dataUploadform.get('product').value
    this.SpinnerService.show()
    this.rmuservice.FileUploadFetchSummary(Product?Product?.id:'',page).subscribe(result=>{
      this.SpinnerService.hide()
      if(result?.description){
        this.notification.showError(result?.description)
      }
      else{
        this.SearchSummary=result['data']
        this.FileUploadPagination={
          has_prev:result['pagination']?.has_previous,
          has_next:result['pagination']?.has_next,
          index:result['pagination']?.index
        }
      }
    }, error => {
      this.SpinnerService.hide();
      this.errorHandler.handleError(error);
      })

  }
  Clearbtn(){
    this.dataUploadform.reset()
    this.SearchSummary=[]
  }
  PreviousSearch(){
    this.FileUploadPagination.index=this.FileUploadPagination.index-1
    this.Searchbtn(this.FileUploadPagination.index)

  }
  NextSearch(){
    this.FileUploadPagination.index=this.FileUploadPagination.index+1
    this.Searchbtn(this.FileUploadPagination.index)
  }
  DownloadTemplate(){
    if(!this.dataUploadform.get('product').value){
      this.notification.showError("Please Select Product")
      return false
    }
    let Product=this.dataUploadform.get('product').value
    this.SpinnerService.show()
    this.rmuservice.downloadfileuploadfetch(Product?Product?.id:'').subscribe((data :any)=>{
      console.log("dattaa",data)
      this.SpinnerService.hide()
      if(data?.size===91){
      this.notification.showError("Product not have Additional Fields")
      return false
      }  if (data.blob instanceof Blob) {
      let binaryData = [];
      binaryData.push(data.blob)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = Product?.name+".xlsx"
      link.click();
      }
    }, error => {
      this.SpinnerService.hide();
      this.errorHandler.handleError(error);
      })
  }
  // opendatagroup(){

  // }

  selected_data_view:any=[]

  getarchivalECF(value,page=1) {
    console.log("value",value)
    let product
    let box_name
    let boxno
    let status_name
    let product_name_find
    if( this.edit_type==="edit"){
      this.cr_no=this.archival_edit.value.crno?this.archival_edit.value.crno:""
      product=this.archival_edit.value.product?.id??""
      product_name_find=this.archival_edit.value.product?.is_ecf??false
       box_name=this.archival_edit.value.box_name?.id??""
        boxno=this.archival_edit.value.boxno?.box_number??""

           if(!boxno){
           status_name =this.archival_edit.value.status_name?.id??""
            }else{
             if(!this.archival_edit.value.status_name){
               this.notification.showWarning("Please Select Status")
               return false
             }else{
               status_name =this.archival_edit.value.status_name?.id??""
               if(status_name==2 && page==1){
               this.occupied_counts=0
               this.chechbox_id.length=0
               }
             }
            }
    }else{
    this.cr_no=this.filedatagroup.value.crno?this.filedatagroup.value.crno:""
   product=this.filedatagroup.value.product?.id??""
   product_name_find=this.filedatagroup.value.product?.is_ecf??false
    box_name=this.filedatagroup.value.box_name?.id??""
     boxno=this.filedatagroup.value.boxno?.box_number??""
        if(!boxno){
        status_name =this.filedatagroup.value.status_name?.id??""
         }else{
          if(!this.filedatagroup.value.status_name){
            this.notification.showWarning("Please Select Status")
            return false
          }else{
            status_name =this.filedatagroup.value.status_name?.id??""
            if(status_name==2 && page==1){
            this.occupied_counts=0
            this.chechbox_id.length=0
            }
          }
         }
        }
        let batch=this.edit_type=='edit' && this.EditData?.if_batch?this.archival_edit.get('Batch')?.value?.batch_barcode:''
        this.SpinnerService.show()
    this.rmuservice.getarchivalecf(this.cr_no,product, product_name_find, box_name,status_name,boxno,page,batch).subscribe(results => {
      console.log("result",results)
       this.table_values_table_hide = true;
      this.archivalsummarylists = results['data'];
      this.SpinnerService.hide()
      if (this.archivalsummarylists?.length > 0) {
        let dataspagination = results["pagination"];
          this.hasarchivalECF_next = dataspagination?.has_next;
        this.hasarchivalECF_previous = dataspagination?.has_previous;
        this.presentarchivalECFpage = dataspagination?.index;
        this.data_file_edit=true;
        this.disabled_check_box=true;
         if(results['columns']){
          this.table_show_hide=false;
        let columndata=results['columns'];
        this.columns = Object.values(columndata);
        this.keys=Object.keys(columndata)
        console.log("this",this.columns,this.keys)
        }else{
          this.table_show_hide=true;
        }
        this.data_occupaid_count = this.archivalsummarylists[0]?.occupied_count
        console.log("this.document_count_data",this.document_count_data)
        if(this.data_occupaid_count > this.BatchReturn()){
          if(this.edit_type === 'edit'){
          if(this.data_id_count + this.selected_check_box_datas?.length !==0 && (this.data_id_count + this.selected_check_box_datas?.length)>= this.BatchReturn()) {
          if(this.archival_edit.get('Batch')?.value?.batch_count){
          this.notification.showWarning("Batch Count Filled Move to Another Batch")
          }else{
          this.notification.showWarning("Box Count Filled Move to Another Box")
          }

          this.disabled_check_box=false;
          return false
          }
        }
        else{
           if(this.selected_check_box_datas?.length !== 0 && this.selected_check_box_datas?.length >= this.BatchReturn()) {
           if(this.filedatagroup.get('Batch')?.value?.batch_count){
          this.notification.showWarning("Batch Count Filled Move to Another Batch")
          }else{
          this.notification.showWarning("Box Count Filled Move to Another Box")
          }
           this.disabled_check_box=false;
          return false
          }
        }
        }else{
          this.data_occupaid_count=this.selected_check_box_datas?.length
          if (this.data_occupaid_count !== 0 && this.data_occupaid_count >= this.BatchReturn()){
          if(this.edit_type === 'edit'){
          if(this.data_id_count + this.selected_check_box_datas?.length >= this.BatchReturn()) {
             if(this.archival_edit.get('Batch')?.value?.batch_count){
          this.notification.showWarning("Batch Count Filled Move to Another Batch")
          }else{
          this.notification.showWarning("Box Count Filled Move to Another Box")
          }
          this.disabled_check_box=false;
          return false
          }
        }
        else{
           if(this.selected_check_box_datas?.length !== 0 && this.selected_check_box_datas?.length >= this.BatchReturn()) {
           if(this.filedatagroup.get('Batch')?.value?.batch_count){
          this.notification.showWarning("Batch Count Filled Move to Another Batch")
          }else{
          this.notification.showWarning("Box Count Filled Move to Another Box")
          }
          this.disabled_check_box=false;
          this.check_boxselected_summary();
          return false
          }
        }
        }
    if (this.edit_type === 'edit') {
      this.archival_edit.get('crno')?.reset();
       this.document_count_data=this.archival_edit.value.count
    } else {
       this.document_count_data=this.filedatagroup.value.count
      this.filedatagroup.get('crno')?.reset();
    }


        let remainingSlots
        if (this.ischeckedall) {
          this.select_count_data=this.BatchReturn()-this.selected_check_box_datas?.length
          if (this.edit_type === "edit") {
            remainingSlots= this.select_count_data
          }else{
            remainingSlots= this.select_count_data - this.selected_id_view.length;
          }

        if (remainingSlots > 0) {
          if (this.edit_type === "edit") {
            let newSelections = 0;
     this.archivalsummarylists.forEach(item => {
  const totalCount = this.selected_check_box_datas?.length + this.data_id_count + this.selected_id_view?.length;

  if (totalCount < this.BatchReturn() && !this.chechbox_id.includes(item.id)) {
    item.selected = true;
    this.chechbox_id.push(item.id);
    newSelections++;
    this.disabled_check_box = true;
    this.selected_id_view.push(item.id);
  } else if (totalCount >= this.BatchReturn() && !this.chechbox_id.includes(item.id)) {
    item.selected = false;
  }
});




              if(page !=1){
                if(this.selected_check_box_datas?.length <= this.BatchReturn()){
                const event = { checked: true };
                this.check_box_selected(event)
              }
            }
            this.occupied_counts = this.selected_check_box_datas?.length
            this.occupied_counts += newSelections;
            this.partially_map_count=this.selected_check_box_datas?.length
          }else{
          this.archivalsummarylists.forEach(item => {
  if (
    this.chechbox_id.length < this.select_count_data &&
    !this.chechbox_id.includes(item.id)
  ) {
    item.selected = true;
    this.chechbox_id.push(item.id);
    this.disabled_check_box = true;
    this.selected_id_view.push(item.id);
  } else {
    item.selected = false;
  }
});

          if(this.selected_check_box_datas?.length <= this.BatchReturn()){
          if(page !=1){
            if(this.selected_check_box_datas?.length <= this.BatchReturn()){
            const event = { checked: true };
            this.check_box_selected(event)
            return
            }
          }
        }
        }

        } else {
          let maxPagesSelectable = Math.floor(this.select_count_data / 10);
          console.log("maxPagesSelectable", maxPagesSelectable, "Current Page:", this.presentarchivalECFpage);
          if (page > this.presentarchivalECFpage) {
            alert(
              `You have already selected ${this.chechbox_id.length} items. No additional items can be selected.`
            );

          }

          this.archivalsummarylists.forEach(item => {
            if (this.chechbox_id.includes(item.id)) {
              item.selected = true;
              this.disabled_check_box=true;

            } else {
              item.selected = false;
              this.disabled_check_box=false
            }
          });


        }
        console.log("dfhfgjfk",this.archivalsummarylists.filter(item => item.selected));
        } else {

          if(status_name==2){
          this.archivalsummarylists.forEach(item => {
            if (item.archival_status?.id === 2 || item.archival_status === 2) {
              item.selected = true;
              this.disabled_check_box = true;
              this.selectedData.push(item);
              // if (!this.chechbox_id.includes(item.id)) {
                // this.chechbox_id.push(item.id);
              // }

              // if (!this.edit_mapped_id.includes(item.id)) {
              //   this.edit_mapped_id.push(item.id);
              // }
                this.document_count_data= item.box_count;
              // if (this.chechbox_id.includes(item.id)) {
              // this.selected_checkboxs.push(item.id)
              // this.occupied_counts=item?.total_count
              if( this.edit_type==="edit"){
                this.data_id_count=item?.total_count
              }else{
                this.occupied_counts=item?.total_count
                // this.chechbox_id.push(item.id);
                this.edit_mapped_id.push(item.id);
              }
              // }
            } else {
              // item.selected = false;
              // this.disabled_check_box = false;
            }
          });
          if(!this.archivalsummarylists.length){
            this.data_id_count=0
          }

          [...new Set(this.chechbox_id)]
        }else{
          this.disabled_check_box=true;
          this.archivalsummarylists.forEach(item => item.selected = false);
          [...new Set(this.chechbox_id)]
          console.log("this.occupied countss",this.occupied_counts,this.document_count_data)
        }
          console.log("Unique IDs:", this.chechbox_id,"this.occupied_counts,this.document_count_data",this.occupied_counts,this.document_count_data);
        }
        if (this.cr_no) {
          if (status_name === 1) {
            if(this.BatchReturn() === 0 && this.edit_type==="edit"){
               this.archival_edit.value.count=this.BatchReturn()
            }else{
              this.filedatagroup.value.count =this.BatchReturn()
            }

            if(this.edit_type==="edit"){
              let count = this.selected_check_box_datas?.length + this.occupied_counts
              if(count <= this.BatchReturn()){
                this.archivalsummarylists.forEach(item => {
                  const event = { checked: true };
                  item.selected=true
                  this.singleCheckbox(event, item,'');
                });
              }else{
              this.check_boxselected_summary()
                this.notification.showWarning("Box Count Filled Move to Another Box")
                return false
              }
            }else{
            if(this.selected_check_box_datas.length === this.BatchReturn()){

             if(this.selected_check_box_datas.length >= this.BatchReturn()){
               this.archivalsummarylists.forEach(item => {
              const event = { checked: false };
              item.selected=false
            });
            }

          }else{
             if(this.selected_check_box_datas.length >= this.BatchReturn()){
              if(this.filedatagroup.get('Batch')?.value?.batch_count){
          this.notification.showWarning("Batch Count Filled Move to Another Batch")
          }else{
          this.notification.showWarning("Box Count Filled Move to Another Box")
          }
            return false
             }else{
            this.archivalsummarylists.forEach(item => {
              const event = { checked: true };
              item.selected=true
              this.singleCheckbox(event, item,'');
            });
          }
          }
        }

          }
        }
        if(this.selected_check_box_datas.length <= this.BatchReturn()){
        this.archivalsummarylists.forEach(item => {
          if(item.selected === true){
            this.check_boxselect_view=true
          this.selected_data_view.push(item)
          }else{
            this.check_boxselect_view=false
          }
        })
      }    else{
            if(this.selected_check_box_datas.length >= this.BatchReturn()){
               this.archivalsummarylists.forEach(item => {
              const event = { checked: false };
              item.selected=false
            });
            }
            this.notification.showWarning("Box Count Filled Move to Another Box")
            return false
          }
      if( this.check_boxselect_view===true){
      }else{
          if (this.selected_check_box_datas?.length > 0) {
            this.archivalsummarylists.forEach(item => {
                item.selected = this.selected_check_box_datas.some(data => item.id === data.rmu_data_ref_id);
            });
            console.log("Updated List:", this.archivalsummarylists);
        }
      }
        console.log("this.selected_data_view",this.selected_data_view)

    }
    this.check_boxselected_summary()
      }if(this.archivalsummarylists?.length == 0){
        this.disabled_check_box=false
        this.occupied_counts=0
        if (!this.cr_no) {
        this.document_count_data=0
        this.checkbox_select=false;
        }
        this.chechbox_id.length=0
        this.hasarchivalECF_next = false;
        this.hasarchivalECF_previous = false;
        this.presentarchivalECFpage = 1;
        this.data_file_edit=false;
      }

    }, error => {
      this.disabled_check_box=false
      if (!this.cr_no) {
        this.occupied_counts=0
      }
        this.document_count_data=0
        this.checkbox_select=false;
        this.chechbox_id.length=0
        this.hasarchivalECF_next = false;
        this.hasarchivalECF_previous = false;
        this.presentarchivalECFpage = 1;
        this.data_file_edit=false;
      this.SpinnerService.hide();
      this.errorHandler.handleError(error);
      this.archivalsummarylists=[]
      })
  }

  previous_master_Click(){
    if (this.hasarchivalECF_previous === true) {
      this.getarchivalECF(this.filedatagroup.value,this.presentarchivalECFpage-1);
    }
  }
  nexts_masterClick(){
    if (this.hasarchivalECF_next === true) {
      this.getarchivalECF(this.filedatagroup.value,this.presentarchivalECFpage+1);
    }
  }

  back_btn(){
     this.edit_type=''
     this.EditData=''
     this.untickVal=''
    this.showmainsummary = true;
    this.showaddnew = false;
    this.UploadBarcodeBool=false
    this.ischeckedall=false;
    this.edit_screen=false;
    this.chechbox_id=[]
    this.chechvalueid=[]
    this.sumary_id=[]
    this.value_list=[]
    this.product_view=false;
    this.valida_invalid_summary=false;
    this.fas_file_name = '';
    this.showaddnew=false;
    this.PopUpIcon=false
    this.archievalsummarySearch("")
    this.filedatagroup.reset()
    this.archival_edit.reset()
    this.dataUploadform.reset()
    this.dataFetchForm.reset()
    this.archival_details.reset()
  }
  master_reset(){
    this.archivalmasterForm.reset()
    this.archievalsummarySearch("")
  }


selected_id_view:any=[]
  checkbox_select:boolean=false;
  checkAllTrades: boolean = false
  ischecked:boolean =false
  chechvalueid:any[]=[]
  selected_check_value:any;
  selcted_id_check_data:any;
  edits_checkbox_id:any;
singleCheckbox(event, value,selected_data) {
  let validate=this.edit_type=='edit'?this.archival_edit.get('Batch').value:this.filedatagroup.get('Batch')?.value
  if(this.PopUpIcon && !validate){
    this.notification.showError('Please Select Batch')
    // event.checked=false
    // value.selected=true
    value.selected=false;
    // this.getarchivalECF('')
    event.source.checked = false;
    console.log("vaakkghsfvdg",value.selected)
    return
  }
  const isChecked = event.checked;
  const valueId = value?.id;
  this.checkbox_select = true;
  const alreadySelected = this.selected_check_box_datas.some(item => item.rmu_data_ref_id === valueId);
  if(!isChecked){
    this.untickVal='val'
  }
  if (isChecked) {
    this.untickVal=''
  const isLimitExceeded =
  this.edit_type === 'edit'
    ? this.occupied_counts >= this.BatchReturn()
    : this.disabled_check_box === false || this.selected_check_box_datas?.length >= this.BatchReturn();
    // ( this.edit_type === 'edit' ? (this.data_id_count +
    //                                     this.selected_check_box_datas?.length) : (this.selected_check_box_datas?.length))
if(this.edit_type=='edit' && this.EditData?.if_batch){
  if(this.selected_check_box_datas.length+this.data_id_count==this.BatchEditReturn()){
      this.notification.showError(`You have already selected ${this.BatchEditReturn()} items. No additional items can be selected.`);
      event.source.checked=false
      return
  }
}
if (this.data_id_count + this.selected_check_box_datas?.length >= this.BatchReturn()) {
  if (valueId === value?.id) {
    value.selected = false;
  }

  event.source.checked = false;
  this.ischeckedall = false;
  this.selected_check_box_datas = this.selected_check_box_datas.filter(
    (item) => item.id !== valueId
  );
  this.disabled_check_box = false;


  // Show alert
  alert(`You have already selected ${this.BatchReturn()} items. No additional items can be selected.`);

  return false;
}



    if (isLimitExceeded || alreadySelected) {
      if(isLimitExceeded){
        this.notification.showError('Batch Count Reached Move to Another Batch')
        event.source.checked=false
        return
      }
      if(alreadySelected){
      this.notification?.showError?.("This Data Already Selected");
      }
       if (valueId === value?.id) {
    value.selected = false;
  }
     value.selected = false;
      event.checked = false;
      event.disabled = true;
      this.ischeckedall = false;
      this.disabled_check_box = false;
      return;
    }

    this.ischecked = true;
    if (!this.chechbox_id.includes(valueId)) {
      value.selected=true
      this.chechbox_id.push(valueId);
      this.selectedData.push(value);
    }

    if (!this.selected_data_view.some(item => item.id === valueId)) {
      this.selected_data_view.push(value);
    }

    if (this.edit_type === 'edit') {
      this.occupied_counts++;
    }

} else {
  if (selected_data == 'second') {
    this.selected_check_value = 'second';
    this.selcted_id_check_data = valueId;
  } else {
    this.selected_check_value= 'second';

    const idValue = this.selected_check_box_datas.find(
  item => item.rmu_data_ref_id === valueId
)?.id;
 this.selcted_id_check_data = idValue
console.log(idValue,"idValue idValueidValueidValueidValue");

    const removeById = (arr, idKey = "id") => {
      if (!Array.isArray(arr)) return;
      if (idKey) {
        const index = arr.findIndex(item => item[idKey] === valueId);
        if (index !== -1) arr.splice(index, 1);
      } else {
        const index = arr.indexOf(valueId);
        if (index !== -1) arr.splice(index, 1);
      }
    };

    removeById(this.chechbox_id, null);
    removeById(this.selectedData);
    removeById(this.selected_data_view);

    if (this.edit_type === 'edit') {
      this.occupied_counts--;
    }
    this.chechbox_id.push(valueId)
    if (this.chechbox_id.length === 0) {
      this.checkbox_select = false;
    }

    // if (this.edit_type !== 'edit' &&
    //     this.selected_check_box_datas?.length >= this.document_count_data) {
    //   this.ischeckedall = false;
    //   this.disabled_check_box = false;
    //   return;
    // }
  }
}


  this.selected_id_view = [...this.chechbox_id];
  this.check_box_selected(event);

  console.log("Checkbox IDs:", this.chechbox_id);
  console.log("Selected Data:", this.selectedData);
  console.log("Selected View:", this.selected_data_view);
}

toggleCheckboxAll(event) {
  //  if(this.PopUpIcon && !this.ProductGenerateNumber){
  let validate=this.edit_type=='edit'?this.archival_edit.get('Batch').value:this.filedatagroup.get('Batch')?.value
   if(this.PopUpIcon && !validate){
    // event.selected = false;

          // this.getarchivalECF('')
    this.notification.showError('Please Select Batch')
    // event.checked = false;
    //       this.ischeckedall = event.checked;
     this.ischeckedall = false;

    // Optional: stop further propagation
    event.source.checked = false;
     console.log("vaakkghsfvdg",this.ischeckedall)
    return

  }
  this.checked = event.checked;
  this.checkbox_select = this.checked;
  this.ischeckedall = false;

  if (this.checked) {
    if(this.edit_type === "edit"){
       if(this.selected_check_box_datas.length+this.data_id_count==this.BatchEditReturn()){
          this.notification.showError(`You have already selected ${this.BatchEditReturn()} items. No additional items can be selected.`);
          event.source.checked=false
          return
      }
      else{
          this.select_count_data = this.BatchEditReturn() - this.data_id_count;
      }
    }else{
      if(this.filedatagroup.get('Batch')?.value){
        this.select_count_data = this.BatchReturn()
      }
      else{
        this.select_count_data = this.BatchReturn() - this.occupied_counts;
      }

    }
    const remainingSlots = this.select_count_data - this.chechbox_id.length;

    if (remainingSlots >= 0) {
      this.archivalsummarylists.forEach(item => {
        const isAlreadySelected = this.chechbox_id.includes(item.id);

        if (this.chechbox_id.length < this.select_count_data && !isAlreadySelected) {
          item.selected = true;
          item.disabled = false;
          this.chechbox_id.push(item.id);
          this.selected_data_view.push(item);
        } else if (!isAlreadySelected) {
          item.selected = false;
          item.checked = false;
          item.disabled = true;
          this.ischeckedall = false;
        }
      });

      this.disabled_check_box = true;
      this.sumary_id = [...this.chechbox_id];
      this.ischeckedall = this.BatchReturn() >= this.chechbox_id.length;

    } else {
      alert(`You have already selected ${this.chechbox_id.length} items. No additional items can be selected.`);
      console.log("maxPagesSelectable", Math.floor(this.select_count_data / 10), "Current Page:", this.presentarchivalECFpage);
    }

    if (this.edit_type === "edit") {
      const nestedArray = this.chechbox_id.pop();
      this.chechbox_id = this.chechbox_id.concat(nestedArray);
      this.occupied_counts += this.chechbox_id.length;
    } else {
      this.chechbox_id = [...this.sumary_id];
    }

  } else {
    if (this.edit_type === "edit") {
      this.occupied_counts -= this.chechbox_id.length;
    }

    this.archivalsummarylists.forEach(item => {
      item.selected = false;
      item.disabled = false; // Enable all checkboxes again
      const indexToRemove = this.selected_data_view.findIndex(sel => sel.id === item.id);
      if (indexToRemove !== -1) {
        this.selected_data_view.splice(indexToRemove, 1);
      }
    });


    this.chechbox_id = [];
    this.sumary_id = [];
    this.disabled_check_box = false;
     this.check_box_delete_value()
  }

  this.selected_id_view = [...this.chechbox_id];
  this.check_box_selected(event);
  console.log("this.chechbox_id", this.chechbox_id);

}



submit(){
  this.chechbox_id = this.selected_check_box_datas.map(item => item?.rmu_data_ref_id);
  // if(this.chechbox_id==="" || this.chechbox_id.length===0){
  //   this.notification.showError("Please Select CR Number Data")
  //   return false
  // }

let params_id
if( this.edit_type=="edit"){
  if(!this.archival_edit.value.product){
    this.notification.showError("Please Select The Product")
    return false
  }
  if(!this.archival_edit.value.box_name){
    this.notification.showError("Please Select The Box Name")
    return false
  }
  if(!this.archival_edit.value.boxno){
    this.notification.showError("Please Select The Box Number")
    return false
  }
  // if(this.chechbox_id==="" || this.chechbox_id.length===0){
  //   this.notification.showError("Please Select CR Number Data")
  //   return false
  // }
  let status
  let box_status
  if((this.data_id_count + this.selected_check_box_datas?.length) === this.BatchReturn() ){
    status=2
    box_status=3
  }else{
    status=1
    box_status=2
  }
  this.chechbox_id = this.chechbox_id.filter(id => !this.edit_mapped_id.includes(id));

console.log(this.chechbox_id);
  params_id={
    "rmu_approvedecf":this.PopUpIcon?this.CheckBoxSubmit:this.chechbox_id,
    "product_master":this.archival_edit.value.product?.id,
    "box_id":this.archival_edit.value.box_name?.id,
    "box_status":box_status,
    "archival_box_id":this.archival_edit.value.boxno?.id,
    "archival_status":status,
    "is_batch":false
}
if(this.PopUpIcon){
  params_id['final_submit']=true
}
else{
   params_id['final_submit']=false
}
}else{
  if(!this.filedatagroup.value.product){
    this.notification.showError("Please Select The Product")
    return false
  }
  if(!this.filedatagroup.value.box_name){
    this.notification.showError("Please Select The Box Name")
    return false
  }
  if(!this.filedatagroup.value.boxno){
    this.notification.showError("Please Select The Box Number")
    return false
  }
  let status
  let box_status
  let datas_count
if( this.edit_type=="edit"){
     datas_count = (this.data_id_count + this.selected_check_box_datas?.length)
}else{
      datas_count = this.selected_check_box_datas?.length
}

  if(datas_count === this.BatchReturn() ){
    status=2
    box_status=3
  }else{
    status=1
    box_status=2
  }
   params_id={
    "rmu_approvedecf":this.PopUpIcon?this.CheckBoxSubmit:this.chechbox_id,
    "product_master":this.filedatagroup.value.product?.id,
    "box_id":this.filedatagroup.value.box_name?.id,
    "box_status":box_status,
    "archival_box_id":this.filedatagroup.value.boxno?.id,
    "archival_status":status,
    "is_batch":false
}
if(this.PopUpIcon){
  params_id['final_submit']=true
}
else{
   params_id['final_submit']=false
}
}
// if(this.ProductGenerateBatch){
// if(this.filedatagroup.get('Batch')?.value){
//   let value=this.filedatagroup.get('Batch')?.value?.batch_barcode
//   let params={
//     [value]:this.chechbox_id
//   }
//   params_id['rmu_approvedecf']=params
//   params_id['is_batch']=true
// }
this.Approval_counts= this.chechbox_id.length?.length
this.SpinnerService.show()
  this.rmuservice.get_master_submit(params_id).subscribe(results => {
    if(results.status==="success"){
    this.notification.showSuccess(results.message)
    this.check_box_delete_value()
    // if(!this.PopUpIcon){
      this.back_btn()
      this.filedatagroup.reset()
    // }
    this.ischeckedall=false;
    this.checkbox_select=false;
    this.CheckBoxSubmit=[]
    this.chechbox_id.length=0
    this.chechvalueid=[]
    this.sumary_id=[]
    // this.disabled_check_box=false
    this.delete_btn=false;
    if( this.edit_type=="edit"){
      if(this.BatchReturn()===this.occupied_counts){
        this.archival_edit.reset()
        this.document_count_data=0
      this.occupied_counts=0;
      this.data_id_count=0;
      }
    }else{
      this.select_count_data=0
      this.document_count_data=0
      this.occupied_counts=0
    }
    // if(!this.PopUpIcon && (this.BatchReturn()===this.chechbox_id.length)){
      this.back_btn()
// }
console.log(results)
this.getarchivalECF("")
this.check_boxselected_summary()
// this.file_data_fun()
this.archival_details.reset()
this.archival_serch_details('')
this.ProductGenerateBatch=''
this.ProductGenerateNumber=''
this.filedatagroup.get('Batch')?.reset()
this.filedatagroup.get('BatchCount')?.reset()
setTimeout(() => {
  this.first_function();
}, 500);
    }else{
      this.notification.showError(results.message)
    }
    this.SpinnerService.hide()
  }, error => {
    this.SpinnerService.hide()
    this.errorHandler.handleError(error);
  console.error(error);
});
}
BatchClose(params){
  this.chechbox_id = this.selected_check_box_datas.map(item => item?.rmu_data_ref_id);
  if(this.archivalsummarylists?.length){
    if(this.edit_type=='edit'){
      if(this.archivalsummarylists[0]?.total_count>this.archival_edit.get('BatchCount')?.value){
        if(this.archival_edit.get('BatchCount')?.value!=this.chechbox_id.length+this.data_id_count){
          this.notification.showError(`Batch Capacity is ${this.archival_edit.get('BatchCount')?.value} But You Selected ${this.chechbox_id.length+this.data_id_count}`)
          return
        }
      }
    }
    else{
      if(this.archivalsummarylists[0]?.total_count>this.filedatagroup.get('BatchCount')?.value){
        if(this.filedatagroup.get('BatchCount')?.value!=this.chechbox_id.length){
          this.notification.showError(`Batch Capacity is ${this.filedatagroup.get('BatchCount')?.value} But You Selected ${this.chechbox_id.length}`)
          return
        }
      }
    }
   
  }
  if(this.chechbox_id==="" || this.chechbox_id.length===0){
    this.notification.showError("Please Select CR Number Data")
    return false
  }

let params_id
if( this.edit_type=="edit"){
  if(!this.archival_edit.value.product){
    this.notification.showError("Please Select The Product")
    return false
  }
  if(!this.archival_edit.value.box_name){
    this.notification.showError("Please Select The Box Name")
    return false
  }
  if(!this.archival_edit.value.boxno){
    this.notification.showError("Please Select The Box Number")
    return false
  }
  if(this.chechbox_id==="" || this.chechbox_id.length===0){
    this.notification.showError("Please Select CR Number Data")
    return false
  }
  let status
  let box_status
  if((this.data_id_count + this.selected_check_box_datas?.length) === this.BatchReturn() ){
    status=2
    box_status=3
  }else{
    status=1
    box_status=2
  }
  this.chechbox_id = this.chechbox_id.filter(id => !this.edit_mapped_id.includes(id));

console.log(this.chechbox_id);
  params_id={
    "rmu_approvedecf":this.chechbox_id,
    "product_master":this.archival_edit.value.product?.id,
    "box_id":this.archival_edit.value.box_name?.id,
    "box_status":box_status,
    "archival_box_id":this.archival_edit.value.boxno?.id,
    "archival_status":status,
    "is_batch":false
}
}else{
  if(!this.filedatagroup.value.product){
    this.notification.showError("Please Select The Product")
    return false
  }
  if(!this.filedatagroup.value.box_name){
    this.notification.showError("Please Select The Box Name")
    return false
  }
  if(!this.filedatagroup.value.boxno){
    this.notification.showError("Please Select The Box Number")
    return false
  }
  let status
  let box_status
  let datas_count
if( this.edit_type=="edit"){
     datas_count = (this.data_id_count + this.selected_check_box_datas?.length)
}else{
      datas_count = this.selected_check_box_datas?.length
}

  if(datas_count === this.BatchReturn() ){
    status=2
    box_status=3
  }else{
    status=1
    box_status=2
  }
   params_id={
    "rmu_approvedecf":this.chechbox_id,
    "product_master":this.filedatagroup.value.product?.id,
    "box_id":this.filedatagroup.value.box_name?.id,
    "box_status":box_status,
    "archival_box_id":this.filedatagroup.value.boxno?.id,
    "archival_status":status,
    "is_batch":false
}
}
// if(this.ProductGenerateBatch){
if((this.filedatagroup.get('Batch')?.value && this.PopUpIcon) || (this.archival_edit.get('Batch')?.value && this.PopUpIcon && this.EditData?.if_batch)){
  let value=this.EditData?.if_batch?this.archival_edit.get('Batch')?.value?.batch_barcode:this.filedatagroup.get('Batch')?.value?.batch_barcode
  let params={
    [value]:this.chechbox_id
  }
  params_id['rmu_approvedecf']=params
  params_id['is_batch']=true
}
this.Approval_counts= this.chechbox_id.length?.length
this.SpinnerService.show()
  this.rmuservice.get_master_submit(params_id).subscribe(async results => {
    if(results.status==="success"){
    this.notification.showSuccess(results.message)
    this.check_box_delete_value()
    if(!this.PopUpIcon){
      this.back_btn()
      this.filedatagroup.reset()
    }
    this.ischeckedall=false;
    this.checkbox_select=false;
    this.CheckBoxSubmit=this.CheckBoxSubmit.concat(this.chechbox_id)
    this.chechbox_id.length=0
    this.chechvalueid=[]
    this.sumary_id=[]
    // this.disabled_check_box=false
    this.delete_btn=false;
     let product_id=params?.value?.product?.id
    let box_id=params?.value?.box_name?.id
    let box_number=params?.value?.boxno?.box_number
    this.BoxNumberApi(product_id,box_id,box_number)
    if( this.edit_type=="edit"){
      this.archival_edit.patchValue({
        status_name:{"name":'Partially Occupied',id:2}
      })
      if(this.BatchReturn()===this.occupied_counts){
        this.archival_edit.reset()
      this.occupied_counts=0;
      this.data_id_count=0;
      }
    }else{
      this.select_count_data=0
      this.occupied_counts=0
    }
    if(!this.PopUpIcon && (this.BatchReturn()===this.chechbox_id.length)){
      this.back_btn()
}
console.log(results)
this.getarchivalECF(this.archival_edit.value)
this.check_boxselected_summary()
// this.file_data_fun()
this.archival_details.reset()
this.archival_serch_details('')
this.ProductGenerateBatch=''
this.ProductGenerateNumber=''
this.filedatagroup.get('Batch')?.reset()
this.filedatagroup.get('BatchCount')?.reset()
let CreateAndEdit=this.edit_type=='edit'?this.EditData?.id:this.filedatagroup.get('boxno')?.value?.id??''
 let data=await this.GetBatch('','Create',CreateAndEdit)
  if(this.BatchRmuData?.length){
    this.BatchGenerateBool=true
  }
  else{
    this.BatchGenerateBool=false
  }
setTimeout(() => {
  this.first_function();
}, 500);
    }else{
      this.notification.showError(results.description)
    }
    this.SpinnerService.hide()
  }, error => {
    this.SpinnerService.hide()
    this.errorHandler.handleError(error);
  console.error(error);
});
}
filefetchdata:any;
file_data_fun(){
  this.rmuservice.getproductsummary("","",1).subscribe(results => {
    let data = results['data'];
    if(data.length!=0){
    this.filefetchdata=data
    this.filefetchdata = this.filefetchdata.filter(item => item.status !== 0);
    console.log("this.filefetchdata.data = this.filefetchdata.data.filter(item => item.status !== 0);",this.filefetchdata)
    if(this.filefetchdata.length !=0){
    this.filefetchdata.forEach(item => {
      if (item.status===1) {
        this.disabled_check_box=true
        this.occupied_counts= item?.occupied_count
        this.document_count_data=item?.box_count
        this.product_doct_id=item
      } else{
        if(this.occupied_counts===undefined){
        this.disabled_check_box=false
        }
      }
    });
  }else{
    this.disabled_check_box=false
    this.occupied_counts=0
    this.document_count_data=0
    this.checkbox_select=false;
  }

  }
  else{
    this.disabled_check_box=false
    this.occupied_counts=0
    this.document_count_data=0
  }
},error=>{
  this.SpinnerService.hide()
  this.errorHandler.handleError(error);
})
}

async master_edit(data){
  this.EditData=data
  this.edit_type="edit"
  this.check_box_delete_value()
  console.log(" this.edit_data",data,data?.product_data?.name)
  const pattern = /e.*?c.*?f/gi;
  const matches = data?.product_data?.name.match(pattern);
  console.log("matches", matches);
  let mat_value = matches ? true : false;
  data.product_data = { ...data?.product_data, is_ecf: mat_value };
  this.edit_screen=true;
  this.showmainsummary = false;
  this.showaddnew = false;
  this.UploadBarcodeBool=false
  this.edit_master_update.get('boxno').reset()
  this.edit_master_update.get('vendor').reset()
  this.disabled_check_box=false
  this.delete_btn=false;
this.Approval_counts=data?.occupied_count
console.log("thispapkoisj",this.Approval_counts)
this.edit_data_id=data?.id
let status_value
if(data?.archival_data?.archival_status===2){
  status_value={"name":'Partially Occupied',id:2}
}else{
  if(data?.archival_data?.archival_status===1){
    status_value={"name":'Partially Occupied',id:2}
  }
}
await this.GetBatch('','',data?.id)
this.document_count_data=data?.box_count
this.occupied_counts=data?.occupied_count
let box_number={"box_number":data.box_number,"id":data?.id,'occupied_count':data?.occupied_count}
this.archival_edit.patchValue({
  product:data?.product_data,
  box_name:data.box_data,
  boxno:box_number,
  count:data.box_count,
  status_name:status_value,
});
if(data?.if_batch){
  this.PopUpIcon=true
}
else{
  this.PopUpIcon=false
}
this.getarchivalECF(this.archival_edit.value)
this.check_boxselected_summary()
console.log("this.archival",this.archival_edit)
this.archival_serch_details("")
this.BoxNumberApi(data?.product_data?.id,data?.box_data?.id,data?.box_number)
}


master_approve(form_data){
  this.master_edit_id
  if(form_data?.archivaldate=="" || form_data?.archivaldate==null || form_data?.archivaldate==undefined){
    this.notification.showWarning("Please Select The Archival Date")
    return false
  }
  if(form_data?.boxno=="" || form_data?.boxno==null || form_data?.boxno==undefined){
    this.notification.showWarning("Please Enter The Vendor Barcode")
    return false
  }
  if(form_data?.vendor=="" || form_data?.vendor==null || form_data?.vendor==undefined){
    this.notification.showWarning("Please Enter Storage Vendor")
    return false
  }
  let date= this.datePipe.transform(form_data?.archivaldate, 'yyyy-MM-dd')
  let params_id={
   "vendor_barcode":form_data?.boxno?.bar_code_number,
   "vendor":form_data?.vendor?.id,
   "archival_date":date,
   "id":this.particular_data_id,
    "product_master": this.edit_data_id,
    "archival_status":3
}
this.SpinnerService.show()
  this.rmuservice.get_approval_close(params_id).subscribe(results => {
    this.SpinnerService.hide()
    if(results.status === "success"){
      this.notification.showSuccess(results.message)
      // this.closemasterbutton.nativeElement.click();
      this.showmainsummary = true;
      this.showaddnew = false;
      this.UploadBarcodeBool=false
      this.ischeckedall=false;
      this.edit_screen=false;
      this.chechbox_id=[]
      this.chechvalueid=[]
      this.sumary_id=[]
      this.product_view=false;
      this.edit_master_update.get('boxno').reset()
      this.edit_master_update.get('vendor').reset()
      this.archival_approve_popup_close()
      this.archievalsummarySearch('')
    }else{
      this.notification.showError(results.message)
    }
console.log(results)
// this.archievalsummarySearch("")
  },error=>{
  this.SpinnerService.hide()
  this.errorHandler.handleError(error);
})
}

master_close(form_data){
  if(form_data?.archivaldate=="" || form_data?.archivaldate==null || form_data?.archivaldate==undefined){
    this.notification.showWarning("Please Select The Archival Date")
    return false
  }
  if(form_data?.boxno=="" || form_data?.boxno==null || form_data?.boxno==undefined){
    this.notification.showWarning("Please Enter The Vendor Barcode")
    return false
  }
  if(form_data?.vendor=="" || form_data?.vendor==null || form_data?.vendor==undefined){
    this.notification.showWarning("Please Enter Storage Vendor")
    return false
  }
  var answer = window.confirm("Are you sure to Close the Approval?");
  if (answer) {
    let date= this.datePipe.transform(form_data?.archivaldate, 'yyyy-MM-dd')
    let params_id={
     "vendor_barcode":form_data?.boxno?.bar_code_number,
     "vendor":form_data?.vendor?.id,
     "archival_date":date,
      "product_master": this.edit_data_id,
      "id":this.particular_data_id,
      "archival_status":4
  }
  this.SpinnerService.show()
  this.rmuservice.get_approval_close(params_id).subscribe(results => {
    this.SpinnerService.hide()
    if(results.status === "success"){
      this.notification.showSuccess(results.message)
      // this.closemasterbutton.nativeElement.click();
      this.showmainsummary = true;
      this.showaddnew = false;
      this.UploadBarcodeBool=false
      this.ischeckedall=false;
      this.edit_screen=false;
      this.chechbox_id=[]
      this.chechvalueid=[]
      this.sumary_id=[]
      this.product_view=false;
      this.edit_master_update.get('boxno').reset();
      this.edit_master_update.get('vendor').reset();
      this.archievalsummarySearch('')
    }else{
      this.notification.showError(results.message)
    }
console.log(results)
// this.archievalsummarySearch("")
  } ,error=>{
    this.SpinnerService.hide()
    this.errorHandler.handleError(error);
  })
  }
  else {
    return false;
  }
}

box_close(){
  var answer = window.confirm("Are you sure to Close the Approval?");
  if (answer) {
    this.edit_data_id
    let params_id={
     "vendor_barcode":null,
     "vendor":null,
    //  "archival_date":date,
      "product_master": this.archival_edit.value?.product?.id??"",
      "id":this.edit_data_id,
      "archival_status":2,
      "box_status":4
  }
  this.SpinnerService.show()
  this.rmuservice.get_approval_close(params_id).subscribe(results => {
    this.SpinnerService.hide()
    if(results.status === "success"){
      this.notification.showSuccess(results.message)
      // this.closemasterbutton.nativeElement.click();
      this.showmainsummary = true;
      this.showaddnew = false;
      this.UploadBarcodeBool=false
      this.ischeckedall=false;
      this.edit_screen=false;
      this.chechbox_id=[]
      this.chechvalueid=[]
      this.sumary_id=[]
      this.product_view=false;
      this.edit_master_update.get('boxno').reset()
      this.edit_master_update.get('vendor').reset()
      this.archievalsummarySearch('')
    }else{
      this.notification.showError(results.message)
    }
console.log(results)
// this.archievalsummarySearch("")
  } ,error=>{
    this.SpinnerService.hide()
    this.errorHandler.handleError(error);
  })
  }
  else {
    return false;
  }
}
master_view_data(data){
  this.master_view_popupopen()
  this.datas_id=data?.id
  this.master_view("")
}

master_view(data,pageNumber=1){
  this.SpinnerService.show()
  this.rmuservice.get_boxid(this.datas_id,pageNumber).subscribe((results)=>{
      console.log("result=>",results)
    let data=results['data']
    let datapagination = results["pagination"];
    this.archivalsummaryview =data

    this.SpinnerService.hide()
    if (this.archivalsummaryview ?.length > 0) {
      this.has_nextarchalview = datapagination.has_next;
      this.has_previousarchalview = datapagination.has_previous;
      this.presentpagearchalview = datapagination.index;
      this.datass_foundview=true
    }if(this.archivalsummaryview ?.length == 0){
      this.has_nextarchalview = false;
      this.has_previousarchalview = false;
      this.presentpagearchalview = 1;
      this.datass_foundview=false
    }
    } , error => {
  this.SpinnerService.hide();
  this.errorHandler.handleError(error);
  })
}
previousviewClick() {
  if (this.has_previousarchalview === true) {
    this.master_view('',this.presentpagearchalview - 1);
  }
}
nextviewClick() {
  if (this.has_nextarchalview === true) {
    this.master_view("",this.presentpagearchalview + 1)
  }

}
public vendor_display(vendor_name?: rmu): string | undefined {
    return vendor_name ? vendor_name.name : undefined;
  }



public vendor2_display(vendor_name?: rmu): string | undefined {
  return vendor_name ? vendor_name.name : undefined;
}

master_view_popupopen() {
  var myModal = new (bootstrap as any).Modal(
    document.getElementById("master_viewpopup"),
    {
      backdrop: 'static',
      keyboard: false
    }
  );
  myModal.show();
}
private generateRandomColor(): string {
  // You can implement your logic to generate colors dynamically
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}



first_function() {
  console.log("this.occupied_counts, this.totalcount",this.occupied_counts, this.document_count_data);
  this.value_list.push(this.occupied_counts, this.BatchReturn());
  this.value_list=[...new Set(this.value_list)]
  console.log("value list", this.value_list);
  this.value_list = this.value_list.filter(value => value !== undefined);

  const dynamicColors = this.label_List.map(() => this.generateRandomColor());

  // if (this.edit_screen) {
    const chartCanvas2 = document.getElementById('chartCanvas1') as HTMLCanvasElement;
    if (this.myChart2) {
      this.myChart2.destroy();
    }

    this.myChart2 = new Chart(chartCanvas2, {
      type: 'bar',
      data: {
        labels: this.label_List,
        datasets: [{
          label: "Bar",
          data: this.value_list,
          backgroundColor: dynamicColors,
          borderWidth: 1,
          barPercentage: 0.7,
          categoryPercentage: 0.5
        }],
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: {
                weight: 'bold' ,
                size: 16  // Make legend labels bold
              }
            }
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Document Count',
              font: {
                weight: 'bold' ,
                size: 16
              }
            },
            grid: {
              display: false,
            },
          },
          y: {
            title: {
              display: true, // Add y-axis title if needed
              font: {
                weight: 'bold',
                size: 16   // Make y-axis title bold
              }
            },
            grid: {
              display: false,
            },
            ticks: {
              font: {
                weight: 'bold',
                size: 16   // Make y-axis tick labels bold
              }
            }
          },
        },
      },
    });
  // }
}

getarchivalECF_reset(){
  this.rmu_checkbox= false;
    this.chechbox_id = [];
  this.sumary_id = [];
  this.selected_check_box_datas=[]
  // this.selected_check_box_datas=[];
  this.ischeckedall=false;
  this.PopUpIcon=false
  this.table_values_table_hide=false
  // this.table_show_hide=true
  this.archivalsummarylists=[]
  this.filedatagroup.reset();
  this.getarchivalECF('')
  this.check_boxselected_summary()
}

getarchivalECF_edit_reset(){
  this.rmu_checkbox= false;
  this.chechbox_id = [];
  this.sumary_id = [];
  this.selected_check_box_datas=[];
  this.ischeckedall=false;
  this.archival_edit.reset();
  this.getarchivalECF('')
  this.check_boxselected_summary()
}


public product_auto_display(prod_name?: rmu): string | undefined {
  return prod_name ? prod_name.name : undefined;
}

product_dd(name,page) {
  this.archival_details.get('box_name').reset()
  this.archival_details.get('box_count').reset()
  this.SpinnerService.show();
    this.rmuservice.product_master_summary(name,"",page).subscribe(result=>{
      this.SpinnerService.hide();
      this.product_list=result['data']
      this.product_listdetail_pagination={
        prev:result['pagination'].has_previous,
        next:result['pagination'].has_next,
        index:result['pagination'].index
      }
    },
  error=>{
    this.SpinnerService.hide();
    this.errorHandler.handleError(error);
  })
}


haspro_next:boolean=true;
haspro_previous:boolean=true;
currentpro_page=1
product_Scroll() {
    setTimeout(() => {
      if (
        this.product_auto &&
        this.autocompleteTrigger &&
        this.product_auto.panel
      ) {
        fromEvent(this.product_auto.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.product_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.product_auto.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.product_auto.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.product_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.product_listdetail_pagination.next === true) {
                this.rmuservice.product_master_summary(this.archival_details.get('product').value?this.archival_details.get('product').value:'',"",this.product_listdetail_pagination.index + 1 )
                  .subscribe((result: any[]) => {
                    this.product_list=this.product_list.concat(result['data'])
                    this.product_listdetail_pagination={
                      prev:result['pagination'].has_previous,
                      next:result['pagination'].has_next,
                      index:result['pagination'].index
                    }
                  });
              }
            }
          });
      }
    });
  }

  product_box_gen(){
    if(typeof this.archival_details.value.product != 'object'){
      this.notification.showWarning("Please Select The Product")
      return false
    }
    this.archival_details.get('box_count').reset()
     let product_id=this.archival_details.value.product?.id??""
    this.rmuservice.box_dd_product(product_id,'', 1).subscribe(data => {
      this.box_list  = data.data.map(item => item.box_data);
      let box_count  = data.data.map(item => item.box_count);
      this.box_count_patch=box_count[0]
      if(this.box_list.length===1){
     this.archival_details.patchValue({
      box_name:this.box_list[0],
      box_count:this.box_count_patch
     })
      }
      console.log("this",this.box_list,"box_count",box_count[0])
    });
  }

  box_dd(){
    if(typeof this.archival_details.value.product != 'object'){
      this.notification.showWarning("Please Select The Product")
      return false
    }
    this.archival_details.get('box_count').reset()
     let product_id=this.archival_details.value.product?.id??""
    this.rmuservice.box_dd_product(product_id,'', 1).subscribe(data => {
      this.box_list  = data.data.map(item => item.box_data);
      let box_count  = data.data.map(item => item.box_count);
      this.box_count_patch=box_count[0]
      console.log("this",this.box_list,"box_count",box_count[0])
    });
  }

  archival_serch_details(form_data,page=1){
    let product_id=this.archival_details.value.product?.id??""
    let box_id=this.archival_details.value.box_name?.id??''
    let box_number =this.archival_details.value.box_number?this.archival_details.value.box_number:""
     let status=this.archival_details.value.status_name?.id??""
     if(this.edit_type==="edit"){
      status=1
     }
    this.SpinnerService.show()
    this.rmuservice.archival_search_summary(product_id,box_id,status,box_number,page).subscribe((results)=>{
        console.log("result=>",results)
      let data=results['data']
      let datapagination = results["pagination"];
      this.archivalsummarydetails =data

      this.SpinnerService.hide()
      if (this.archivalsummarydetails ?.length > 0) {
        this.has_nextarchaldetails = datapagination.has_next;
        this.has_previousarchaldetails = datapagination.has_previous;
        this.presentpagearchaldetails = datapagination.index;
        this.datass_founddetails=true
      }if(this.archivalsummarydetails ?.length == 0){
        this.has_nextarchaldetails = false;
        this.has_previousarchaldetails = false;
        this.presentpagearchaldetails = 1;
        this.datass_founddetails=false
      }
      } , error => {
    this.SpinnerService.hide();
    this.errorHandler.handleError(error);
    })
  }


  previous_serch_Click() {
    if (this.has_previousarchaldetails === true) {
      this.archival_serch_details('',this.presentpagearchalview - 1);
    }
  }
  next_serch_Click() {
    if (this.has_nextarchaldetails === true) {
      this.archival_serch_details("",this.presentpagearchalview + 1)
    }

  }

  status_dd(){
    this.status_list=[{"name":'Un Occupied',id:1},
      {"name":'Partially Occupied',id:2},
      {"name":'Fully occupied',id:3},
      {"name":'Box Closed',id:4}
    ]
  }

  status_dd_arch(){
    this.status_lists=[
      {"name":'Un Mapped',id:1},
      {"name":'Partially Occupied',id:2},
      {"name":'Fully Mapped',id:3}
    ]
  }
  status_ddown(){
    this.status_listed=[
      {"name":'Partially Occupied',id:1},
      {"name":'Ready For Dispatch',id:2},
      {"name":'Archived',id:3},
      // {"name":'Box Closed',id:4}
    ]
  }


  generate(){
    if(typeof this.archival_details.value.product != 'object'){
      this.notification.showWarning("Please Select The Product")
      return false
    }
    if(this.archival_details.value.box_name === '' || this.archival_details.value.box_name === null ||  this.archival_details.value.box_name === undefined){
      this.notification.showWarning("Please Select The Box Name")
      return false
    }
    if(this.archival_details.value.box_count=='' || this.archival_details.value.box_count==undefined || this.archival_details.value.box_count==null){
      this.notification.showWarning("Please Enter the Box Count")
      return false
    }

    if(this.box_count_value_Check===undefined){
      this.box_count_value_Check=this.archival_details.value.box_count
    }
  if( this.box_count_value_Check <=this.box_count_patch){
    this.box_count_patch
    console.log("dgfh",this.box_count_patch, this.box_count_value_Check)
  }else{
    console.log("dgfdfhgjghjh", this.box_count_value_Check,this.box_count_patch)
    this.notification.showError("Please Enter This Count ("+ this.box_count_patch +") Less Than Value Only Allowed")
    return false
  }
    let value={
      "product_id":this.archival_details.value.product?.id??"",
      "box_id":this.archival_details.value.box_name?.id??'',
      "box_count":this.archival_details.value.box_count?this.archival_details.value.box_count:""
      }
    this.rmuservice.box_generate(value).subscribe(data => {
      if(data.status==="success"){
        this.notification.showSuccess(data.message)
        this.box_count_value_Check=''
        this.box_count_value_Check=''
        this.archival_details.reset()
        this.archival_serch_details('')

      }else{
        this.notification.showError(data.message)
      }
    },error=>{
      this.SpinnerService.hide()
      this.errorHandler.handleError(error);
    })
  }



public product_display(prod_name?: rmu): string | undefined {
  return prod_name ? prod_name.name : undefined;
}

arch_product_dd(name,page) {
  this.SpinnerService.show();
      this.rmuservice.product_master_summary(name,"",page).subscribe(result=>{
        this.SpinnerService.hide();
        this.product_arcval_list=result['data']
        this.product_arcval_list_pagination={
          prev:result['pagination'].has_previous,
          next:result['pagination'].has_next,
          index:result['pagination'].index
        }
      },
    error=>{
      this.SpinnerService.hide();
      this.errorHandler.handleError(error);
    })
}


has_arch_next:boolean=true;
has_arch_previous:boolean=true;
current_arch_page=1
arch_product_Scroll() {
    setTimeout(() => {
      if (
        this.arch_product_auto &&
        this.autocompleteTrigger &&
        this.arch_product_auto.panel
      ) {
        fromEvent(this.arch_product_auto.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.arch_product_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.arch_product_auto.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.arch_product_auto.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.arch_product_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.product_arcval_list_pagination.next === true) {
                this.rmuservice.product_master_summary(this.filedatagroup.get('product').value?this.filedatagroup.get('product').value:'',"",this.product_arcval_list_pagination.index + 1 )
                  .subscribe((result: any[]) => {
                    this.product_arcval_list=this.product_arcval_list.concat(result['data'])
                    this.product_arcval_list_pagination={
                      prev:result['pagination'].has_previous,
                      next:result['pagination'].has_next,
                      index:result['pagination'].index
                    }
                  });
              }
            }
          });
      }
    });
  }

  archival_box_dd(){
    if(typeof this.filedatagroup.value.product != 'object'){
      this.notification.showWarning("Please Select The Product")
      return false
    }
     let product_id=this.filedatagroup.value.product?.id??""
    this.rmuservice.box_dd_product(product_id,'', 1).subscribe(data => {
      this.arch_box_list  = data.data.map(item => item.box_data);
      console.log("this",this.arch_box_list)
    if(this.arch_box_list.length==1){
      this.filedatagroup.patchValue({
        box_name:this.arch_box_list[0]
      })
      this.box_number(this.arch_box_list[0])
    }
    });
  }


  public productedit_display(prod_name?: rmu): string | undefined {
    return prod_name ? prod_name.name : undefined;
  }

  arch_productedit_dd() {
    this.archival_edit.get('box_name').reset()
    this.SpinnerService.show();
    this.rmuservice.product_master_summary(this.arch_productedit.nativeElement.value,'', 1)
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((results) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.product_arcvaledit_list = datas;
      });
  }


  has_archedit_next:boolean=true;
  has_archedit_previous:boolean=true;
  current_archedit_page=1
  arch_productedit_Scroll() {
      // setTimeout(() => {
      //   if (
      //     this.arch_productedit_auto &&
      //     this.autocompleteTrigger &&
      //     this.arch_productedit_auto.panel
      //   ) {
      //     fromEvent(this.arch_productedit_auto.panel.nativeElement, "scroll")
      //       .pipe(
      //         map(() => this.arch_productedit_auto.panel.nativeElement.scrollTop),
      //         takeUntil(this.autocompleteTrigger.panelClosingActions)
      //       )
      //       .subscribe(() => {
      //         const scrollTop = this.arch_productedit_auto.panel.nativeElement.scrollTop;
      //         const scrollHeight =
      //           this.arch_productedit_auto.panel.nativeElement.scrollHeight;
      //         const elementHeight =
      //           this.arch_productedit_auto.panel.nativeElement.clientHeight;
      //         const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
      //         if (atBottom) {
      //           if (this.has_archedit_next === true) {
      //             this.rmuservice.product_master_summary(this.arch_productedit.nativeElement.value,'',this.current_archedit_page + 1 )
      //               .subscribe((results: any[]) => {
      //                 let datas = results["data"];
      //                 let datapagination = results["pagination"];
      //                 this.product_arcvaledit_list =this.product_arcvaledit_list.concat(datas);
      //                 if (this.product_arcvaledit_list.length >= 0) {
      //                   this.has_archedit_next = datapagination.has_next;
      //                   this.has_archedit_previous = datapagination.has_previous;
      //                   this.current_archedit_page = datapagination.index;
      //                 }
      //               });
      //           }
      //         }
      //       });
      //   }
      // });
      setTimeout(() => {
        if (
          this.arch_productedit_auto &&
          this.autocompleteTrigger &&
          this.arch_productedit_auto.panel
        ) {
          fromEvent(this.arch_productedit_auto.panel.nativeElement, "scroll")
            .pipe(
              map(() => this.arch_productedit_auto.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(() => {
              const scrollTop = this.arch_productedit_auto.panel.nativeElement.scrollTop;
              const scrollHeight =
                this.arch_productedit_auto.panel.nativeElement.scrollHeight;
              const elementHeight =
                this.arch_productedit_auto.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.product_arcvaledit_pagination.next === true) {
                  this.rmuservice.product_file_upload(this.archival_edit.get('product').value?this.archival_edit.get('product').value:'',this.product_arcvaledit_pagination.index + 1 )
                    .subscribe((result: any[]) => {
                      this.product_arcvaledit_list=this.product_arcvaledit_list.concat(result['data'])
                      this.product_arcvaledit_pagination={
                        prev:result['pagination'].has_previous,
                        next:result['pagination'].has_next,
                        index:result['pagination'].index
                      }
                    });
                }
              }
            });
        }
      });
    }


    archivaledit_box_dd(){
      if(typeof this.archival_edit.value.product != 'object'){
        this.notification.showWarning("Please Select The Product")
        return false
      }
       let product_id=this.archival_edit.value.product?.id??""
      this.rmuservice.box_dd_product(product_id,'', 1).subscribe(data => {
        this.archedit_box_list  = data.data.map(item => item.box_data);
        console.log("this",this.archedit_box_list)
      }, error => {
        this.SpinnerService.hide();
        this.errorHandler.handleError(error);
        })
    }

  archival_serch_reset(){
    this.archival_details.reset()
    this.archival_serch_details('')
  }
  
  box_number(box){
    let product_id =this.filedatagroup.value.product?.id??""
    let box_id=box?.id??""
    this.rmuservice.box_dd_product(product_id,box_id, 1).subscribe(async data => {
     let datass=data['data']
     this.mapping_box_id=data['data'][0]?.id
     this.box_number_list=datass[0].archival_box_data
      let status = {"name":'Un Mapped',"id":1}
     if(this.box_number_list.length==1){
      this.filedatagroup.patchValue({
        boxno:this.box_number_list[0],
        count:this.box_number_list[0]?.box_count,
           status_name:status,
          //  RemainingCount:this.box_number_list[0]?.remaining_count
      })
      this.OccupiedCountData=this.box_number_list[0]?.occupied_count
       let CreateAndEdit=this.edit_type=='edit'?this.EditData?.id:this.filedatagroup.get('boxno')?.value?.id??''
  let data=await this.GetBatch('','Create',CreateAndEdit)
  if(this.BatchRmuData?.length){
    this.BatchGenerateBool=true
  }
      this.getarchivalECF('')
      this.check_boxselected_summary()
     }
     console.log("box_fdata",datass,this.box_number_list," this.mapping_box_id", this.mapping_box_id)
     if(datass[0].archival_box_data.length===0){
      this.disabled_check_box=false
      this.occupied_counts=0
      this.document_count_data=0
      this.checkbox_select=false;
    this.notification.showError("Box Not Found Please Generate New Box")
    }
    });
  }
  boxedit_number(box){
    let product_id =this.archival_edit.value.product?.id??""
    let box_id=box?.id??""
    this.rmuservice.box_dd_product(product_id,box_id, 1).subscribe(data => {
     let datass=data['data']
     this.mapping_box_id=data['data'][0]?.id
     this.box_numberedit_list=datass[0].archival_box_data
     console.log("box_fdata",datass,this.box_numberedit_list," this.mapping_box_id", this.mapping_box_id)
     if(datass[0].archival_box_data.length===0){
      this.disabled_check_box=false
      this.occupied_counts=0
      this.document_count_data=0
      this.checkbox_select=false;
    this.notification.showError("Box Not Found Please Generate New Box")
    }
    });
  }

  delete_mapping(data){
    if(!this.archival_edit.value.status_name){
      this.disabled_check_box=false
      this.notification.showWarning("Please Select Status")
      return false
    }
   let value=data?.id
    this.rmuservice.ecf_box_delete(value).subscribe(data => {
      if(data.status==="success"){
        this.notification.showSuccess(data.message)
        this.getarchivalECF('')
        this.check_boxselected_summary()
        this.disabled_check_box=false
        this.occupied_counts=0
        this.document_count_data=0
        this.checkbox_select=false;
      }else{
        this.notification.showError(data.message)
      }
    },error=>{
      this.SpinnerService.hide()
      this.errorHandler.handleError(error);
    })
  }

 async archival_boxnumber_dd(datass){
    let item = datass
    this.occupied_counts= datass?.occupied_count??0
        this.document_count_data=datass?.box_count
        this.product_doct_id=this.filedatagroup.value.product
        this.box_id=this.mapping_box_id
        this.archival_box_id=datass?.id
      let satatus={"name":'Un Mapped',id:1}
     this.filedatagroup.patchValue({
      count:datass.box_count,
      status_name:satatus
    })
    this.OccupiedCountData=datass?.occupied_count
    let CreateAndEdit=this.edit_type=='edit'?this.EditData?.id:this.filedatagroup.get('boxno')?.value?.id??''
  let data=await this.GetBatch('','Create',CreateAndEdit)
  if(this.BatchRmuData?.length){
    this.BatchGenerateBool=true
  }
    if(!this.filedatagroup.value.status_name){
      this.disabled_check_box=false
      this.notification.showWarning("Please Select Status")
      return false
    }
    // this.disabled_check_box=true

  }

  archivaledit_boxnumber_dd(datass){
    let item = datass
    this.occupied_counts= datass?.occupied_count??0
        this.document_count_data=datass?.box_count
        this.product_doct_id=this.archival_edit.value.product
        this.box_id=this.mapping_box_id
        this.archival_box_id=datass?.id
     this.archival_edit.patchValue({
      // boxno:box.box_number,
      count:datass.box_count,

    })
    if(!this.archival_edit.value.status_name){
      this.disabled_check_box=false
      this.notification.showWarning("Please Select Status")
      return false
    }
    // this.disabled_check_box=true

  }

  status_value(data){

  if(  this.edit_type==="edit"){
    this.delete_btn=true;
  if(this.archival_edit.value.status_name?.id===3 ){
    this.occupied_counts= 0
     this.document_count_data=0
     this.getarchivalECF(this.archival_edit.value)
     this.check_boxselected_summary()
  }else if(this.archival_edit.value.status_name?.id===2){
      let valuess=this.archival_edit.value.boxno
      // this.archivaledit_boxnumber_dd(valuess)
      this.getarchivalECF(this.archival_edit.value)
      this.check_boxselected_summary()
  }else{
    this.disabled_check_box = true;
    let values=this.archival_edit.value.boxno
    this.chechbox_id.length=0
    // this.archivaledit_boxnumber_dd(values)
    this.getarchivalECF(this.archival_edit.value)
    this.check_boxselected_summary()
  }
}else{
  this.disabled_check_box=true
  this.occupied_counts= 0
 //  this.document_count_data=0
 if(this.filedatagroup.value.status_name?.id===3 ){
   this.occupied_counts= 0
    this.document_count_data=0
    this.getarchivalECF(this.filedatagroup.value)
    this.check_boxselected_summary()
 }else if(this.filedatagroup.value.status_name?.id===2){
     let valuess=this.filedatagroup.value.boxno
     this.archival_boxnumber_dd(valuess)
     this.getarchivalECF(this.filedatagroup.value)
     this.check_boxselected_summary()
 }else{
   this.disabled_check_box = true;
   let valuess=this.filedatagroup.value.boxno
   this.chechbox_id.length=0
   this.archival_boxnumber_dd(valuess)
   this.getarchivalECF(this.filedatagroup.value)
   this.check_boxselected_summary()
 }
}

  }

  getvendordd() {
    this.rmuservice.getvendors()
      .subscribe(result => {
        this.vendorlists = result['data']
      })
  }

  getvendorValue(value) {
    this.rmuservice.vendor_summary(value,'', 1).subscribe(data => {
      // this.prodct_search_subloading=false
      this.vendorlist = data['data'];
      console.log("this",this.vendorlist)
    });
  }

  has_vendor_next:boolean=true;
has_vendor_previous:boolean=true;
current_vendor_page=1
vendor_Scroll() {
    setTimeout(() => {
      if (
        this.vendor_auto &&
        this.autocompleteTrigger &&
        this.vendor_auto.panel
      ) {
        fromEvent(this.vendor_auto.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.vendor_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.vendor_auto.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.vendor_auto.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.vendor_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_vendor_next === true) {
                this.rmuservice.vendor_summary(this.vendor_input.nativeElement.value,'',this.current_vendor_page + 1 )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.vendorlist =this.vendorlist.concat(datas);
                    if (this.vendorlist.length >= 0) {
                      this.has_vendor_next = datapagination.has_next;
                      this.has_vendor_previous = datapagination.has_previous;
                      this.current_vendor_page = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }
  vendorStorageScroll() {
    setTimeout(() => {
      if (
        this.autostorage &&
        this.autocompleteTrigger &&
        this.autostorage.panel
      ) {
        fromEvent(this.autostorage.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.autostorage.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.autostorage.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.autostorage.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.autostorage.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.Vendorpagination.next === true) {
                this.rmuservice.StorageVendaorDropDown(this.CreateForm.get('Vendor').value,this.Vendorpagination.index + 1 )
                  .subscribe((result: any[]) => {
                    this.VendorDropDownData=this.VendorDropDownData.concat(result['data'])
                    this.Vendorpagination={
                      prev:result['pagination'].has_previous,
                      next:result['pagination'].has_next,
                      index:result['pagination'].index
                    }
                  });
              }
            }
          });
      }
    });
  }
  vendorStorageEditScroll() {
    setTimeout(() => {
      if (
        this.autostoragevendor &&
        this.autocompleteTrigger &&
        this.autostoragevendor.panel
      ) {
        fromEvent(this.autostoragevendor.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.autostoragevendor.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.autostoragevendor.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.autostoragevendor.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.autostoragevendor.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.Vendorpagination.next === true) {
                this.rmuservice.StorageVendaorDropDown(this.edit_master_update.get('vendor').value?this.edit_master_update.get('vendor').value:'',this.Vendorpagination.index + 1 )
                  .subscribe((result: any[]) => {
                    this.VendorDropDownData=this.VendorDropDownData.concat(result['data'])
                    this.Vendorpagination={
                      prev:result['pagination'].has_previous,
                      next:result['pagination'].has_next,
                      index:result['pagination'].index
                    }
                  });
              }
            }
          });
      }
    });
  }
  BoxNameScroll() {
    setTimeout(() => {
      if (
        this.autostorage1 &&
        this.autocompleteTrigger &&
        this.autostorage1.panel
      ) {
        fromEvent(this.autostorage1.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.autostorage1.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.autostorage1.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.autostorage1.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.autostorage1.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.BoxNamepagination.next === true) {
                this.rmuservice.BoxNameDropDown(this.CreateForm.get('BoxName').value,this.BoxNamepagination.index + 1 )
                  .subscribe((result: any[]) => {
                    this.BoxNameDropDownData=this.BoxNameDropDownData.concat(result['data'])
                    this.BoxNamepagination={
                      prev:result['pagination'].has_previous,
                      next:result['pagination'].has_next,
                      index:result['pagination'].index
                    }
                  });
              }
            }
          });
      }
    });
  }
  VendorbarcodeScroll() {
    let box_name =this.edit_box_data?.box_data?.name
    setTimeout(() => {
      if (
        this.vendorBar &&
        this.autocompleteTrigger &&
        this.vendorBar.panel
      ) {
        fromEvent(this.vendorBar.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.vendorBar.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.vendorBar.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.vendorBar.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.vendorBar.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.BarCodepagination.next === true) {
                this.rmuservice.VendorBarCodeGet(this.edit_master_update.get('boxno').value?this.edit_master_update.get('boxno').value:'',this.BarCodepagination.index + 1 ,box_name)
                  .subscribe((result: any[]) => {
                    this.BarCodeDropDownData=this.BarCodeDropDownData.concat(result['data'])
                  this.BarCodepagination={
                    prev:result['pagination'].has_previous,
                    next:result['pagination'].has_next,
                    index:result['pagination'].index
                  }
                  });
              }
            }
          });
      }
    });
  }
  CreateUpload(){
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ModalUploadBarcode"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
    // this.ModalDisplayBar.nativeElement.click()

  }


  BackCreateUpload(){
    this.CreateForm.reset('')
    this.ModalDisplayBar.nativeElement.click()
  }
  VendorDisplay(data:DropDown){
    return data?data?.name:''
  }
  VendorDropDown(name,page){
    this.isloading=true
    this.rmuservice.StorageVendaorDropDown(name,page).subscribe(result=>{
      this.isloading=false
      this.VendorDropDownData=result['data']
      this.Vendorpagination={
        prev:result['pagination'].has_previous,
        next:result['pagination'].has_next,
        index:result['pagination'].index
      }
    },
  error=>{
    this.isloading=false
    this.errorHandler.handleError(error);
  })
  }
  BoxNameDropDown(name,page){
    this.isloading=true
    this.rmuservice.BoxNameDropDown(name,page).subscribe(result=>{
      this.isloading=false
      this.BoxNameDropDownData=result['data']
      this.BoxNamepagination={
        prev:result['pagination'].has_previous,
        next:result['pagination'].has_next,
        index:result['pagination'].index
      }
    },
  error=>{
    this.isloading=false
    this.errorHandler.handleError(error);
  })
  }
  StorageSubmit(){
    if(!this.CreateForm.get('Vendor').value){
      this.notification.showError('Please Enter Storage Vendor')
    }
    else if(!this.CreateForm.get('BoxName').value){
      this.notification.showError('Please Enter Box Name')
    }
    else if(!this.CreateForm.get('FromSession').value){
      this.notification.showError('Please Enter From Session')
    }else if(!this.CreateForm.get('ToSession').value){
      this.notification.showError('Please Enter To Session')
    }
    else{
      let params={
        rmu_vendor_id:this.CreateForm.get('Vendor').value?.id,
        box_name:this.CreateForm.get('BoxName').value?.name,
        from_series:this.CreateForm.get('FromSession').value,
        to_series:this.CreateForm.get('ToSession').value
      }
      this.SpinnerService.show()
      this.rmuservice.VendorSubmit(params).subscribe(res=>{

        if(res.status=='success'){
          this.notification.showSuccess(res?.message)
          this.archievalsummarySearch('');
          this.BackCreateUpload()
        }
        else{
          this.SpinnerService.hide()
          this.notification.showError(res?.description)

        }

      },
    error=>{
      this.SpinnerService.hide()
      this.errorHandler.handleError(error);
    })
    }

  }
  BarCodeDropDown(name,page){
    this.isloading=true
    let boxname = this.edit_box_data?.box_data?.name
    this.rmuservice.VendorBarCodeGet(name,page,boxname).subscribe(result=>{
      this.isloading=false
      this.BarCodeDropDownData=result['data']
      this.BarCodepagination={
        prev:result['pagination'].has_previous,
        next:result['pagination'].has_next,
        index:result['pagination'].index
      }
    },
  error=>{
    this.isloading=false
    this.errorHandler.handleError(error);
  })
  }
  DisplayBarcode(vendor:Barcode){
    return vendor?vendor?.bar_code_number:''
  }

////box

public box_display(vendor_name?: rmu): string | undefined {
  return vendor_name ? vendor_name.name : undefined;
}
  box_name(name,page=1){
    this.isloading=true
    this.rmuservice.BoxNameDropDown(name,page).subscribe(result=>{
      this.isloading=false
      this.box_name_DownData=result['data']
      this.box_name_pagination={
        prev:result['pagination'].has_previous,
        next:result['pagination'].has_next,
        index:result['pagination'].index
      }
    },
  error=>{
    this.isloading=false
    this.errorHandler.handleError(error);
  })
  }

  box_name_Scroll() {
    setTimeout(() => {
      if (
        this.box_name_auto &&
        this.autocompleteTrigger &&
        this.box_name_auto.panel
      ) {
        fromEvent(this.box_name_auto.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.box_name_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.box_name_auto.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.box_name_auto.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.box_name_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.box_name_pagination.next === true) {
                this.rmuservice.BoxNameDropDown(this.archivalmasterForm.get('box_names').value?this.archivalmasterForm.get('box_names').value:'',this.box_name_pagination.index + 1 )
                  .subscribe((result: any[]) => {
                    this.box_name_DownData=this.box_name_DownData.concat(result['data'])
                  this.box_name_pagination={
                    prev:result['pagination'].has_previous,
                    next:result['pagination'].has_next,
                    index:result['pagination'].index
                  }
                  });
              }
            }
          });
      }
    });
  }

  product_name(summary){
    console.log("product summary",summary)
this.product_datas_view=summary
this.particular_data_id=summary?.id
this.master_edit_id=summary?.product_data?.id
this.occupied_counts= summary?.occupied_count
this.document_count_data=summary?.box_count
this.totalcount=summary?.document_count
this.edit_box_data=summary
this.edit_master_update.get('boxno').reset()
      this.edit_master_update.get('vendor').reset()
      this.value_list=[]
this.archival_approve_popup()
setTimeout(() => {
  this.first_function();
}, 500);
  }
  box_name_count_fetch(){
  this.archival_details.patchValue({
    box_count:this.box_count_patch
  })
}

//Box capacity
box_capacity(event){
  this.box_count_patch
  this.box_count_value_Check=event.target.value
  if(event.target.value <=this.box_count_patch){
    this.box_count_patch
    console.log("dgfh",this.box_count_patch,event.target.value)
  }else{
    this.notification.showError("Please Enter This Count ("+this.box_count_patch+") Less Than Value Only Allowed")
    console.log("dgfdfhgjghjh",event.target.value)
  }
}

////fetch product

public product_fetch_display(prod_name?: rmu): string | undefined {
  return prod_name ? prod_name.name : undefined;
}

fetch_prod_dd(name,page){
  this.isloading=true
  this.rmuservice.product_master_summary(name,'',page).subscribe(result=>{
    this.isloading=false
    this.product_fetch_list=result['data']
    this.product_fetchpagination={
      prev:result['pagination'].has_previous,
      next:result['pagination'].has_next,
      index:result['pagination'].index
    }
  },
error=>{
  this.isloading=false
  this.errorHandler.handleError(error);
})
}


fetch_prod_dd_Scroll() {
  setTimeout(() => {
    if (
      this.fetch_prod_auto &&
      this.autocompleteTrigger &&
      this.fetch_prod_auto.panel
    ) {
      fromEvent(this.fetch_prod_auto.panel.nativeElement, "scroll")
        .pipe(
          map(() => this.fetch_prod_auto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(() => {
          const scrollTop = this.fetch_prod_auto.panel.nativeElement.scrollTop;
          const scrollHeight =
            this.fetch_prod_auto.panel.nativeElement.scrollHeight;
          const elementHeight =
            this.fetch_prod_auto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.product_fetchpagination.next === true) {
              this.rmuservice.product_master_summary(this.dataFetchForm.get('product').value?this.dataFetchForm.get('product').value:'','',this.product_fetchpagination.index + 1 )
                .subscribe((result: any[]) => {
                  this.product_fetch_list=this.product_fetch_list.concat(result['data'])
                  this.product_fetchpagination={
                    prev:result['pagination'].has_previous,
                    next:result['pagination'].has_next,
                    index:result['pagination'].index
                  }
                });
            }
          }
        });
    }
  });
}

//// fetch upload product

public product_fetch_upload_display(prod_name?: rmu): string | undefined {
  return prod_name ? prod_name.name : undefined;
}

fetch_prod_upload_dd(name,page){
  this.isloading=true
  this.rmuservice.product_file_upload(name,page).subscribe(result=>{
    this.isloading=false
    this.fetch_prod_upload_DropDownData=result['data']
    this.prod_upload_pagination={
      prev:result['pagination'].has_previous,
      next:result['pagination'].has_next,
      index:result['pagination'].index
    }
  },
error=>{
  this.isloading=false
  this.errorHandler.handleError(error);
})
}


fetch_prod_dd_upload_Scroll() {
  setTimeout(() => {
    if (
      this.fetch_prod_upload_auto &&
      this.autocompleteTrigger &&
      this.fetch_prod_upload_auto.panel
    ) {
      fromEvent(this.fetch_prod_upload_auto.panel.nativeElement, "scroll")
        .pipe(
          map(() => this.fetch_prod_upload_auto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(() => {
          const scrollTop = this.fetch_prod_upload_auto.panel.nativeElement.scrollTop;
          const scrollHeight =
            this.fetch_prod_upload_auto.panel.nativeElement.scrollHeight;
          const elementHeight =
            this.fetch_prod_upload_auto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.prod_upload_pagination.next === true) {
              this.rmuservice.product_file_upload(this.dataUploadform.get('product').value?this.dataUploadform.get('product').value:'',this.prod_upload_pagination.index + 1 )
                .subscribe((result: any[]) => {
                  this.fetch_prod_upload_DropDownData=this.fetch_prod_upload_DropDownData.concat(result['data'])
                  this.prod_upload_pagination={
                    prev:result['pagination'].has_previous,
                    next:result['pagination'].has_next,
                    index:result['pagination'].index
                  }
                });
            }
          }
        });
    }
  });
}

///boxfor edit


public boxedit_display(vendor_name?: rmu): string | undefined {
  return vendor_name ? vendor_name.name : undefined;
}
boxedit_name(name,page=1){
  this.isloading=true
  this.rmuservice.BoxNameDropDown(name,page).subscribe(result=>{
    this.isloading=false
    this.boxedit_name_DownData=result['data']
    this.boxedit_name_pagination={
      prev:result['pagination'].has_previous,
      next:result['pagination'].has_next,
      index:result['pagination'].index
    }
  },
error=>{
  this.isloading=false
  this.errorHandler.handleError(error);
})
}

boxedit_name_Scroll() {
  setTimeout(() => {
    if (
      this.boxedit_name_auto &&
      this.autocompleteTrigger &&
      this.boxedit_name_auto.panel
    ) {
      fromEvent(this.boxedit_name_auto.panel.nativeElement, "scroll")
        .pipe(
          map(() => this.boxedit_name_auto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(() => {
          const scrollTop = this.boxedit_name_auto.panel.nativeElement.scrollTop;
          const scrollHeight =
            this.boxedit_name_auto.panel.nativeElement.scrollHeight;
          const elementHeight =
            this.boxedit_name_auto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.boxedit_name_pagination.next === true) {
              this.rmuservice.BoxNameDropDown(this.archival_edit.get('box_name').value?this.archival_edit.get('box_name').value:'',this.boxedit_name_pagination.index + 1 )
                .subscribe((result: any[]) => {
                  this.boxedit_name_DownData=this.boxedit_name_DownData.concat(result['data'])
                this.boxedit_name_pagination={
                  prev:result['pagination'].has_previous,
                  next:result['pagination'].has_next,
                  index:result['pagination'].index
                }
                });
            }
          }
        });
    }
  });
}

public boxedit_number_display(box_numbers?: rmu): string | undefined {
  return box_numbers ? box_numbers.box_number : undefined;
}

boxedit_numbers(name,page=1){
  let product_id =this.archival_edit.value.product?.id??""
  let box_id=this.archival_edit.value.box_name?.id??""
  this.isloading=true
  this.rmuservice.box_dd_product(product_id,box_id, 1).subscribe(result => {
    this.isloading=false
    let datass=result['data']
    this.boxedit_name_DownData=result['data']
    this.mapping_box_id=result['data'][0]?.id
    this.box_numberedit_list=datass[0].archival_box_data
    console.log("box_fdata",datass,this.box_numberedit_list," this.mapping_box_id", this.mapping_box_id)
    if(datass[0].archival_box_data.length===0){
     this.disabled_check_box=false
     this.occupied_counts=0
     this.document_count_data=0
     this.checkbox_select=false;
   this.notification.showError("Box Not Found Please Generate New Box")
   }
    this.boxedit_number_pagination={
      prev:result['pagination'].has_previous,
      next:result['pagination'].has_next,
      index:result['pagination'].index
    }
  },
error=>{
  this.isloading=false
  this.errorHandler.handleError(error);
})
}

boxedit_numbers_name_Scroll() {
  setTimeout(() => {
    if (
      this.boxedit_number_auto &&
      this.autocompleteTrigger &&
      this.boxedit_number_auto.panel
    ) {
      fromEvent(this.boxedit_number_auto.panel.nativeElement, "scroll")
        .pipe(
          map(() => this.boxedit_number_auto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(() => {
          const scrollTop = this.boxedit_number_auto.panel.nativeElement.scrollTop;
          const scrollHeight =
            this.boxedit_number_auto.panel.nativeElement.scrollHeight;
          const elementHeight =
            this.boxedit_number_auto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.boxedit_number_pagination.next === true) {
              this.rmuservice.BoxNameDropDown(this.archival_edit.get('boxno').value?this.archival_edit.get('boxno').value:'',this.boxedit_number_pagination.index + 1 )
                .subscribe((result: any[]) => {
                  this.boxedit_name_DownData=this.boxedit_name_DownData.concat(result['data'])
                this.boxedit_number_pagination={
                  prev:result['pagination'].has_previous,
                  next:result['pagination'].has_next,
                  index:result['pagination'].index
                }
                });
            }
          }
        });
    }
  });
}

////
public Status_display(status?: rmu): string | undefined {
  return status ? status.name : undefined;
}

public Status_display1(status?: rmu): string | undefined {
  return status ? status.name : undefined;
}


UploadScreen(){
  if(!this.dataUploadform.get('product').value){
    this.notification.showError('Please Select Product')
    return false
  }
  else{
    this.showaddnew=false
    this.showmainsummary=false
    this.edit_screen=false
    this.product_view=false
    this.UploadDocuments=true
    this.ChildData=this.dataUploadform.get('product').value
  }

}
BackUploadScreen(){
  this.showaddnew=true
  this.showmainsummary=false
  this.edit_screen=false
  this.product_view=false
  this.UploadDocuments=false
  this.showFileUpload=true ;
  // this.showDataFetch=true;
  // this.FileUploadFetch.nativeElement.click()
  this.togglePanel()
}
FileInput(file){
  this.UploadData=<File>file.target.files[0]
  this.fas_file_name = this.UploadData;
}

deleteFile(): void {
  this.fas_file_name = '';
  this.dataUploadform.get('file_fas_upload').reset()
}

validsummary:any;
valida_invalid_summary:boolean=false;
valid_fuc(){
  this.search_product_upload=false;
  this.valida_invalid_summary=!this.valida_invalid_summary
  this.valid_serch_details('')
}
valid_serch_details(form_data,page=1){
  this.SpinnerService.show()
  this.rmuservice.valid_search_summary(page).subscribe((results)=>{
      console.log("result=>",results)
    let data=results['data']
    this.validsummary =data

    this.SpinnerService.hide()
    if (this.validsummary ?.length > 0) {
      let datapagination = results["pagination"];
      this.has_nextvalid = datapagination.has_next;
      this.has_previousvalid = datapagination.has_previous;
      this.presentpage_valid = datapagination.index;
      this.datass_valid=true
    }if(this.validsummary ?.length == 0){
      this.has_nextvalid = false;
      this.has_previousvalid = false;
      this.presentpage_valid = 1;
      this.datass_valid=false
    }
    } , error => {
  this.SpinnerService.hide();
  this.errorHandler.handleError(error);
  })
}


previousvalid_serch_Click() {
  if (this.has_previousvalid === true) {
    this.valid_serch_details('',this.presentpage_valid - 1);
  }
}
valid_serch_Click() {
  if (this.has_nextvalid === true) {
    this.valid_serch_details("",this.presentpage_valid + 1)
  }

}

valid_btn(){
this.valida_invalid_summary=true
  // this.showaddnew=false
  //   this.showmainsummary=false
  //   this.edit_screen=false
  //   this.product_view=false
  //   this.UploadDocuments=false
}
product_select(){
  this.filedatagroup.get('box_name').reset()
  this.filedatagroup.get('boxno').reset()
  this.filedatagroup.get('status_name').reset()
  this.filedatagroup.get('count').reset()
  this.archival_box_dd()
}
file_download(sumary){
  let vals=sumary?.file_data?.gen_file_name
  this.rmuservice.getfileview(vals).subscribe(results => {
    let binaryData = [];
    binaryData.push(results)
    let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    let link = document.createElement('a');
    link.href = downloadUrl;
    link.download = sumary?.product_name + ".xlsx";
    link.click();
  }, error => {
    this.SpinnerService.hide();
    this.errorHandler.handleError(error);
    })
}

invalid_download(sumary){
  let vals=sumary?.id
  this.rmuservice.invalid_download(vals).subscribe(results => {
    let binaryData = [];
    binaryData.push(results)
    let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    let link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'Invalid '+sumary?.product_name+' Data' + ".xlsx";
    link.click();
  }, error => {
    this.SpinnerService.hide();
    this.errorHandler.handleError(error);
    })
}


archival_approve_popup(){
  var myModal = new (bootstrap as any).Modal(
    document.getElementById("archival_approve"),
    {
      backdrop: 'static',
      keyboard: false
    }
  );
  myModal.show();

}

archival_approve_popup_close(){
  this.closeachieval_approve_popup.nativeElement.click()
}

archivaldetails(){
  this.valida_invalid_summary=false;
  this.Searchbtn(1)
}

togglePanel() {
this.showaddnew=true;
  this.showDataFetch = false;
  this.showFileUpload=true ;
}

// cr_no_data(event){
// console.log("event",event)

// if(event.target.value){
// this.getarchivalECF(this.filedatagroup.value)
// this.check_boxselected_summary()
// if(this.edit_type==="edit"){
//   this.archival_edit.get('crno').reset()
// }else{
// this.filedatagroup.get('crno').reset()
// }
// }
// }

isProcessingScan = false;

// cr_no_data(event: any) {
//   const crValue = event?.target?.value?.trim();

//   // Only check for exact length of 13
//   const isValidCR = crValue?.length > 0 && crValue.length <= 13;

//   if (crValue && isValidCR && !this.isProcessingScan) {
//     this.isProcessingScan = true;
//     console.log('Processing valid scan (13 chars):', crValue);

//     this.getarchivalECF(this.filedatagroup.value);
//     this.check_boxselected_summary();


//     setTimeout(() => {
//       this.isProcessingScan = false;
//     }, 1000); // 1 sec lock
//   } else if (crValue && !isValidCR) {
//     this.notification.showWarning("Invalid CR Number. It must be exactly 13 characters.");
//     return false
//     // Optionally show UI feedback
//   }
// }

async cr_no_data(event: any) {
  const crValue = event?.target?.value?.trim();

  const isValidCR = crValue?.length > 0 || crValue.length === 13;

  if (crValue && isValidCR && !this.isProcessingScan) {
    this.isProcessingScan = true;
    console.log('Processing valid scan (13 chars):', crValue);

    try {
      await this.getarchivalECF(this.filedatagroup.value);
      await this.check_boxselected_summary();
    } catch (error) {
      console.error('Error during processing:', error);
    } finally {
      this.isProcessingScan = false;
    }

  }
  else if (crValue && !isValidCR) {
    this.notification.showWarning("Invalid CR Number. It must be exactly 13 characters.");
    if (this.edit_type === 'edit') {
      this.archival_edit.get('crno')?.reset();
    } else {
      this.filedatagroup.get('crno')?.reset();
    }
    return false;
  }
}

untickVal=''
check_boxselected_summary(){
  this.SpinnerService.show()
  this.rmuservice.check_boxselected_summary().subscribe((results)=>{
      console.log("result=>",results)
    let data=results['data']
    this.selected_check_box_datas=data
    if(this.edit_type==="edit"){
      let BatchReturn=this.EditData?.if_batch?this.BatchEditReturn():this.BatchReturn()
      let count = this.selected_check_box_datas?.length + this.occupied_counts
      if(count === BatchReturn){
        this.selected_check_box_datas.forEach(data =>{
          data.selected=true
        })
      }else{
    this.archivalsummarylists.forEach(item => {
      if (item.selected === true) {
        this.selected_check_box_datas.forEach(data =>{
          data.selected=true
        })
      }
    })
  }
  if(this.selected_check_box_datas.length !=0 || this.untickVal){
   const selectedIds = new Set(this.selected_check_box_datas.map(data => data?.rmu_data_ref_id));

this.archivalsummarylists.forEach(item => {
  item.selected = selectedIds.has(item.id);
});
  }
  }else{
    const selectedIds = new Set(this.selected_check_box_datas.map(data => data?.rmu_data_ref_id));

this.archivalsummarylists.forEach(item => {
  item.selected = selectedIds.has(item.id);
});

  }
    this.SpinnerService.hide()
  })
}
isApiRunning = false;
check_box_selected(value){
  console.log("value ddddd",value)
  console.log(" this.chechbox_id", this.chechbox_id,"selected_id_view",this.selected_id_view)
const extractedIds = this.selected_check_box_datas.map(item => item.rmu_data_ref_id);
this.selected_id_view = this.selected_id_view.filter(id => !extractedIds.includes(id));
console.log(this.selected_id_view);
  if (this.isApiRunning) {
    console.warn("API in progress, skipping...");
    return;
  }

  this.isApiRunning = true;
  let flages = value?.checked ? "True" : "False";

const dataaaaa = this.selected_check_box_datas.map(item => item.id);
const selectedIds = this.selected_id_view;
// Filter selected_check_box_datas where item.id is in selected_id_view and dataaaaa
const ffff = this.selected_check_box_datas
  .filter(item => selectedIds.includes(item.id) && dataaaaa.includes(item.id))
  .map(item => item.rmu_data_ref_id);
let multyselectid = this.selected_check_box_datas.map(item => item.id);
const ffffrt = this.selected_data_view
  .filter(item => selectedIds.includes(item.id) && dataaaaa.includes(item.id))
  .map(item => item.id);

console.log("Extracted IDs:", ffff,"ffffrt",ffffrt);

if (value?.checked === false) {
  ffff.forEach(idToRemove => {
    // Remove from chechbox_id
    const indexToRemoveChecker = this.chechbox_id.indexOf(idToRemove);
    if (indexToRemoveChecker !== -1) {
      this.chechbox_id.splice(indexToRemoveChecker, 1);
    }

    // Remove from selectedData
    const indexToRemoveData = this.selectedData.findIndex(item => item.id === idToRemove);
    if (indexToRemoveData !== -1) {
      this.selectedData.splice(indexToRemoveData, 1);
    }

    //Remove selected id
    const indexToRemoveid = this.selected_data_view.findIndex(item => item.id ===idToRemove);
    if (indexToRemoveid !== -1) {
      this.selected_data_view.splice(indexToRemoveid, 1);

    }
  });
  if(this.chechbox_id.length === this.BatchReturn()){
    this.disabled_check_box=false
    this.ischeckedall=false
  }else{
    this.disabled_check_box=true
  this.ischeckedall=false
  }
  if(this.edit_type==="edit"){}else{
    this.occupied_counts=0
  }

  console.log("Updated chechbox_id:", this.chechbox_id);
}
let param
if(this.selected_check_value ==='second'){

     param = {
  "data":[this.selcted_id_check_data],
  "flag":flages
}
    }else{
      param = {
  "data":this.selected_id_view,
  "flag":flages
}
    }

// if()
// = {
//   "data":this.selected_id_view,
//   "flag":flages
// }
  this.SpinnerService.show()
  this.rmuservice.check_boxselected_data(param).subscribe(results => {
      console.log("result=>selected",results)
    this.SpinnerService.hide()
    if (results.status=== "success") {
    if(this.selected_check_value ==='second'){
     if(this.selcted_id_check_data?.length==50){
        this.batch_value_generate()
     }
    }else{
      if(this.selected_id_view==50){
      this.batch_value_generate()
      }
    }

      this.selected_id_view = [];
      this.selected_data_view = [];
      this.chechbox_id = [];
      this.selected_check_value="";
      this.check_boxselected_summary();
    }else{
      this.selected_id_view = [];
      this.selected_data_view = [];
      this.chechbox_id = [];
      this.selected_check_value=""
      this.check_box_delete_value()
    }

    this.isApiRunning = false;
  }, error => {
    console.error("API failed", error);
    this.isApiRunning = false;
    this.SpinnerService.hide();
  });
}
batch_values:any;
batch_value_generate(){
  // this.SpinnerService.show()
  this.rmuservice.batch_value_generate().subscribe(results => {
   this.batch_values=results
    // this.SpinnerService.hide()
  })
}

check_box_delete_value(){

  this.SpinnerService.show()
  this.rmuservice.deletermuseletedvalue().subscribe(results => {
    this.selected_id_view=[]
    console.log("result=>delete",results)
    this.SpinnerService.hide()
    this.check_boxselected_summary()
  })
}

selected_date(){
  this.dataFetchForm.get('to_date').reset()
}

 DownloadTemplates(){
    if(!this.filedatagroup.get('product').value){
      this.notification.showError("Please Select Product")
      return false
    }
    let Product=this.filedatagroup.get('product').value
    this.SpinnerService.show()
    this.rmuservice.downloadfileuploadfetch(Product?Product?.id:'').subscribe((data :any)=>{
      console.log("dattaa",data)
      this.SpinnerService.hide()
      if(data?.size===91){
      this.notification.showError("Product not have Additional Fields")
      return false
      }  if (data.blob instanceof Blob) {
      let binaryData = [];
      binaryData.push(data.blob)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = Product?.name+".xlsx"
      link.click();
      }
    }, error => {
      this.SpinnerService.hide();
      this.errorHandler.handleError(error);
      })
  }

FileUploads(){
    // let data=this.inputFile.nativeElement.innerText
    console.log("")
    this.table_values_table_hide =false
    if(!this.filedatagroup.get('product').value){
      this.notification.showError('Please Select Product')
      return false
    }
    if(this.filedatagroup.value.file_fas_upload=='' || this.filedatagroup.value.file_fas_upload== undefined || this.filedatagroup.value.file_fas_upload == null){
      this.notification.showWarning('Please Choose The File');
      return false;
    }
    else{
      this.SpinnerService.show()
      this.rmuservice.archivalfileuploadfetch(this.filedatagroup.get('product').value?this.filedatagroup.get('product').value?.id:'',this.fas_file_names,this.filedatagroup.value.boxno?.box_number??"").subscribe(result=>{
        this.SpinnerService.hide()
        if(result?.message){
          this.notification.showSuccess(result?.message)
          this.fas_file_names=''
          this.filedatagroup.get('file_fas_upload').reset()
          // this.archivalvalid_serch_details('')
          this.check_boxselected_summary();
          this.checkbox_select=true;
        }
        else{
          this.notification.showError(result?.description)
          this.fas_file_names=''
          this.filedatagroup.get('file_fas_upload').reset()
          // this.archivalvalid_serch_details('')
        }
      }, error => {
        this.SpinnerService.hide();
        this.errorHandler.handleError(error);
        })
    }
  }

deleteFiles(): void {
  this.fas_file_names = '';
  this.filedatagroup.get('file_fas_upload').reset()
  // this.archival_edit.get('file_fas_upload').reset()
}


FileInputs(file){
  this.UploadDatas=<File>file.target.files[0]
  this.fas_file_names = this.UploadDatas;
}

archivalvalid_serch_details(form_data,page=1){
   if(!this.filedatagroup.get('product').value){
      this.notification.showError('Please Select Product')
      return false
    }
  this.archival_upload_file_popup()
  let product_id = this.filedatagroup.value.product?.id??""
  this.SpinnerService.show()
  this.rmuservice.archival_valid_search_summary(page,product_id).subscribe((results)=>{
      console.log("result=>",results)
    let data=results['data']
    this.archivalvalidsummary =data

    this.SpinnerService.hide()
    if (this.archivalvalidsummary ?.length > 0) {
      let datapagination = results["pagination"];
      this.archivalhas_nextvalid = datapagination.has_next;
      this.archivalhas_previousvalid = datapagination.has_previous;
      this.archivpresentpage_valid = datapagination.index;
      this.datass_valid=true
    }if(this.archivalvalidsummary ?.length == 0){
      this.has_nextvalid = false;
      this.has_previousvalid = false;
      this.archivpresentpage_valid = 1;
      this.datass_valid=false
    }
    } , error => {
  this.SpinnerService.hide();
  this.errorHandler.handleError(error);
  })
}


archivalpreviousvalid_serch_Click() {
  if (this.archivalhas_previousvalid === true) {
    this.archivalvalid_serch_details('',this.archivpresentpage_valid - 1);
  }
}
archivalvalid_serch_Click() {
  if (this.archivalhas_nextvalid === true) {
    this.archivalvalid_serch_details("",this.archivpresentpage_valid + 1)
  }

}

archival_upload_file_popup(){
  var myModal = new (bootstrap as any).Modal(
    document.getElementById("archival_upload_file"),
    {
      backdrop: 'static',
      keyboard: false
    }
  );
  myModal.show();

}
archival_upload_file_popup_close(){
  this.closeachieval_upload_popup.nativeElement.click()
}
bulk_upload(event){
  // this.hasarchivalECF_previous=false;
  // this.hasarchivalECF_next=true;
  // this.presentarchivalECFpage=1;
  this.getarchivalECF(this.filedatagroup.value)
  this.table_values_table_hide =false
this.rmu_checkbox = event.checked
if(this.rmu_checkbox=== false){
  this.table_values_table_hide =true;
 this.check_box_delete_value();
}
}
WithBatch(event){
  if(event.checked){
    this.PopUpIcon=true
  }
  else{
    this.PopUpIcon=false
    this.ProductGenerateBatch=''
    this.ProductGenerateNumber=''
    this.filedatagroup.get('Batch')?.reset()
    this.filedatagroup.get('BatchCount')?.reset()
  }
  this.check_box_delete_value();
  this.disabled_check_box=true
  this.ischeckedall=false

}
closePopup(){
  this.BatchGenerate=false
  this.batchcount.reset()
}
BatchGenerateFunc(){
  if(!this.filedatagroup.get('boxno')?.value){
    this.notification.showError('Please Select Box Number')
  }
  else{
    this.BatchGenerate=true
  }
}
Check(data){
  console.log(data)
}

GenerateFunc(){
  if(!this.batchcount.value){
    this.notification.showError('Please Enter Batch Capacity')
  }
  else if(this.filedatagroup.get('boxno')?.value?.remaining_count<this.batchcount.value){
    this.notification.showError(`This Box Remaining Count is ${this.filedatagroup.get('boxno')?.value?.remaining_count} But You Entered ${this.batchcount.value}`)
  }
  else{
    let params={
      "box_id":this.filedatagroup.get('boxno')?.value?.id,
      "box_no":this.filedatagroup.get('boxno')?.value?.box_number,
      "batch_count":this.batchcount.value?this.batchcount.value:''
   }
   this.SpinnerService.show()
  this.rmuservice.BatchGenerateFunc(params).subscribe(async result=>{
     this.SpinnerService.hide()
     if(result?.status){
      this.notification.showSuccess('Successfully Created')
      this.ProductGenerateBatch=result?.batch
      this.ProductGenerateNumber=result?.batch_count
      this.BatchGenerate=false
      let CreateAndEdit=this.edit_type=='edit'?this.EditData?.id:this.filedatagroup.get('boxno')?.value?.id??''
      let data=await this.GetBatch('','Create',CreateAndEdit)
      if(this.BatchRmuData.length){
        this.BatchGenerateBool=true
      }
      this.batchcount.reset()
     }
     else if(result?.description){
      this.notification.showError(result?.description)
     }

  },
  error=>{
    this.SpinnerService.hide()
  })
  }

}
BatchReturn(){
  // if(this.ProductGenerateNumber){
  //   return this.ProductGenerateNumber
  // }
  if(this.EditData?.if_batch){
    if(this.archival_edit.get('Batch')?.value && this.EditData?.if_batch){
      return this.archival_edit.get('Batch')?.value?.batch_count
    }
    else{
      return this.document_count_data
    }
  }
  else{
    if(this.filedatagroup.get('Batch')?.value){
      return this.filedatagroup.get('Batch')?.value?.batch_count
    }
    else{
      return this.document_count_data
    }
  }
  
}
BatchEditReturn(){
  if(this.archival_edit.get('Batch')?.value && this.EditData?.if_batch){
    return this.archival_edit.get('Batch')?.value?.batch_count
  }
  else{
    return this.document_count_data
  }
}
async GetBatch(data,val,id){
  // this.rmuservice.GetBatch(data).subscribe(res=>{
  //   this.BatchRmuData=res['data']
  //   if(this.BatchRmuData.length==1){
  //     this.filedatagroup.patchValue({
  //       Batch:this.BatchRmuData[0],
  //       BatchCount:this.BatchRmuData[0]?.batch_count
  //     })
  //   }
  // })
  // const res=await this.rmuservice.GetBatch(data).toPromise()
  // console.log('api hitted')
  // this.BatchRmuData=res['data']
  //   if(this.BatchRmuData.length==1){
  //     this.filedatagroup.patchValue({
  //       Batch:this.BatchRmuData[0],
  //       BatchCount:this.BatchRmuData[0]?.batch_count
  //     })
  //   }
  return new Promise((resolve)=>{
    let BoxId=id?id:''
    let action=this.edit_type!='edit'?'create':''
    this.rmuservice.GetBatch(data,BoxId,action).subscribe(res=>{
    this.BatchRmuData=res['data']
    resolve(res['data'])
    let data=val=='Create'?this.BatchRmuData.length==1:true
    if(data){
      if(val=='Create'){
        this.filedatagroup.patchValue({
          Batch:this.BatchRmuData[0],
          BatchCount:this.BatchRmuData[0]?.batch_count
      })
      }
      else{
        this.archival_edit.patchValue({
          Batch:this.BatchRmuData[0],
          BatchCount:this.BatchRmuData[0]?.batch_count
      })
      this.OccupiedCountData=this.BatchRmuData[0]?.occupied_count
      }
     
    }
  })
  })
}
GetFilterData(data){
  let val=data?.target?.value?data?.target?.value:''
  let CreateAndEdit=this.edit_type=='edit'?this.EditData?.id:this.filedatagroup.get('boxno')?.value?.id??''
  let action=this.edit_type!='edit'?'create':''
  this.rmuservice.GetBatch(val,CreateAndEdit,action).subscribe(res=>{
    this.BatchRmuData=res['data']
  })
}
BatchWidth(data:any){
  return data?data?.batch_barcode:''
}
BatchClick(data,type){
  if(type=='Create'){
    this.filedatagroup.patchValue({
      BatchCount:data?.batch_count
    })
  }
  else{
    this.archival_edit.patchValue({
      BatchCount:data?.batch_count
    })
    this.getarchivalECF(this.archival_edit.value)
  }
  
}
BoxNumberDownload(){
  let boxid=this.filedatagroup.get('boxno').value?.id
  this.SpinnerService.show()
  this.rmuservice.GetBatchDowload(boxid).subscribe(data=>{
    this.SpinnerService.hide()
    let binaryData = [];
    binaryData.push(data);
    let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    let link = document.createElement("a");
    link.href = downloadUrl;
    link.download ='Box Data '+this.datepipe.transform(new Date(), "dd/MM/yyyy") + ".xlsx";
    link.click();
  },
error=>{
   this.SpinnerService.hide()
})
}
async FileDataExpand(){
  this.getarchivalECF('')
    
  }
  BatchCountFunc(event){
    if(event.target.value>50){
      this.notification.showError('Batch Count Only Allow for 50')
    }
  }
  CheckCondition(){
    // return !this.disabled_check_box ||
    //   (this.chechbox_id?.length + this.occupied_counts) >= this.document_count_data ||
    //   this.document_count_data === 0
    return !this.disabled_check_box ||
      this.selected_check_box_datas?.length >= this.document_count_data ||
      this.document_count_data === 0
  }
  CheckReturnData(){
    return this.data_id_count + this.selected_check_box_datas?.length
  }
  ArchivalEditCheck(){
    return this.archival_edit.get('status_name').value?.id==2?true:false
  }
  BoxNumberApi(product_id,box_id,box_number){
    this.rmuservice.box_dd_product(product_id,box_id, 1).subscribe(data => {
      // params.patchValue({
        let fil=data?.data[0]?.archival_box_data.filter(res=>res?.box_number==box_number)
        this.OccupiedCountData=fil?.length?fil[0]?.occupied_count:0
      // })
    })
  }
}

