import { Component, OnInit, EventEmitter, Output, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ShareService } from '../share.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { DataService } from 'src/app/inward/inward.service';
import { NotificationService } from '../notification.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
import { EcfapService } from '../ecfap.service';
import { formatDate, DatePipe } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { AbstractControl } from '@angular/forms';
export interface SupplierName {
  id: number;
  name: string;
}

export interface raiserlists {
  id: string;
  full_name: string;
  name: string
}

export interface branchListss {
  id: any;
  name: string;
  code: string;
  codename: string;
}



@Component({
  selector: 'app-ecfview',
  templateUrl: './ecfview.component.html',
  styleUrls: ['./ecfview.component.scss']
})
export class EcfviewComponent implements OnInit {
  searchvar: any;
  ecfid: any;
  ecftypeid: any;
  ppxid: any;
  paytoid: any;
  ecftype: any;
  branchcodename: any
  commodityname: any
  ECFHeaderForm: FormGroup;
  InvoiceHeaderForm: FormGroup
  @Output() linesChange = new EventEmitter<any>();
  showsuppname = true
  showsuppgst = true
  showsuppstate = true
  tomorrow = new Date();
  showtaxforgst = false
  invoiceyesno = [{ 'value': 2, 'display': 'Yes' }, { 'value': 1, 'display': 'No' }];
  @ViewChild('fileInput', { static: false }) InputVars: ElementRef;
  @ViewChild('closeInvHdrDet') closeInvHdrDet;
  raisername: any;
  isgst: any;
  showfiletable: boolean = true
  showIcon: boolean = false
  showhideicon: boolean = false
  fulldataslist: any
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  invoiceSearchForm: FormGroup;
  @Output() onCancel = new EventEmitter<any>();
  page = 1;
  pageSize = 10;
  pageSizes = [5, 10, 20, 50, 100];
  invoiceheaderrescount: any;
  ECFsubmitform: FormGroup;
  ecfSearchForm: FormGroup;
  showinvoiceheader: boolean = false
  ECFDataList: any;
  ECFDummyList: any;
  @ViewChildren('fileInput') fileInput: QueryList<ElementRef>
  @ViewChild('closedbuttons') closedbuttons;
  showforecf: boolean = false
  showforpo: boolean = false
  selectedEntry: string | null = null;
  ecforpo = [{ 'value': "E", 'display': 'ECF Entry' }, { 'value': "P", 'display': 'PO Entry' }]
  // ----------------PO---------------
  POHeaderForm: FormGroup;
  POInvoiceForm: FormGroup;
  POMakerForm: FormGroup;

  SelectSupplierForm: FormGroup
  SupplierCode: string;
  SupplierGSTNumber: string;
  SupplierPANNumber: string;
  Address: string;
  City: string;
  line1: any;
  line2: any;
  line3: any;
  default = true
  alternate = false
  JsonArray = []
  submitbutton = false;
  suplist: any
  inputSUPPLIERValue = "";
  supplierNameData: any;
  selectsupplierlist: any;
  gstyesno: any
  supplierid: any
  supp: any
  supplierindex: any
  stateid: any
  @Output() onSubmit= new EventEmitter<any>()
  // @Output() onCancel = new EventEmitter<any>();
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('Suppliertype') matsupAutocomplete: MatAutocomplete;
  @ViewChild('suppInput') suppInput: any;
  isLoading = false;
  showsupppopup = true;
  POList: any;
  checked = true;
  completedFlag = false
  @ViewChild('raisertyperole') matempraiserAutocomplete: MatAutocomplete;
  @ViewChild('raiserInput') raiserInput: any;
  @ViewChild('matbranchAutocomplete') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  Branchlist: Array<branchListss>;
  branchrole: any
  @ViewChild('matraiserAutocomplete') matraiserAutocomplete: MatAutocomplete;
  @ViewChild('raiserbrInput') raiserbrInput: any;
  SummaryApiecfentryObjNew: any;
  ecfmodelurl = environment.apiURL
  supplierlists: any;
  restformfile: any[];
  restformfile1: any[];
  choosesupplierfield1:any
  choosesupplierfield: any 
  suppliersearchs: { id: any; name: any; };
  uploadFileTypes = ['Invoice', 'Email', 'Supporting Documents', 'Others']
  @ViewChild('uploadclose') uploadclose;

  constructor(private shareservice: ShareService, private dataService: DataService, private fb: FormBuilder, private notification: NotificationService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingService, private datePipe: DatePipe,
    private ecfapservice: EcfapService) {
  }

  ngOnInit(): void {
    let inwarddatas = this.shareservice.inwardDatalist.value
    this.fulldataslist = inwarddatas
    console.log("inwarddatas", inwarddatas)

    // let ecfdata = this.shareservice.ECFData.value
    // this.ecfid = ecfdata['data'][0].id
    // this.ecftypeid = ecfdata['data'][0].aptype_id
    // this.ppxid = ecfdata['data'][0].ppx_id?.id
    // this.paytoid = ecfdata['data'][0]?.payto_id
    // this.ecftype = ecfdata['data'][0].aptype
    this.ecfapservice.getbranchrole()
      .subscribe(result => {
        if (result) {
          result.name = result.branch_name
          this.branchrole = result
        }
      })

    this.invoiceSearchForm = this.fb.group({
      branch: [''],
      inv_no: [''],
      inv_date: [''],
      inv_amt: ['']
    })
    this.ECFHeaderForm = this.fb.group({
      ecftype: [''],
      raisername: [''],
      raiserbranch: [''],
      supplierName: [''],
      invoiceno: [''],
      invoicedate: [''],
      taxableamount: [''],
      taxamount: [''],
      totalamount: [''],
      is_originalinvoice: ['']
    })

    this.ecfSearchForm = this.fb.group({
      ecf_no: [''],
      po_no: [''],
      invoicegst: ['']
    })
    this.ECFsubmitform = this.fb.group({
      'invoicehdr': this.fb.array([
        // this.fb.group({
        // invoiceheader_id:new FormControl(''),
        // is_originalinvoice:new FormControl('')
        // })
      ])
    })

    this.InvoiceHeaderForm = this.fb.group({

      invoiceheader: new FormArray([

      ]),
    })

    this.POMakerForm = this.fb.group({
      is_gst: [false],
      supplier_name: [''],
      invoice_date: [''],
      invoice_no: [''],
      amount: [''],
      taxableamount: [''],
      po_number: [''],
      is_original_invoice: [''],
      type: ['PO'],
      supplier_gst: [''],
      employee: [''],
      branch: [''],
      branch_gstno: [''],
      mep_no: [''],
      remarks: [''],
      // filevalue: ['']
      filevalue: new FormArray([]),
      file_key: new FormArray([]),
      filekey: new FormArray([]),
      filedataas: new FormArray([]),
      uploadedFiles : new FormControl([])
    })
    this.SelectSupplierForm = this.fb.group({
      gstno: [''],
      code: [''],
      panno: [''],
      name: ['']
    })

    this.choosesupplierfield1 = {
      label: "Choose Supplier", displaykey: "name",
      formcontrolname: 'name',
      searchkey: "query",
      wholedata: true,
      required: true,
      id: "create-ecf-0126"
    }
    this.choosesupplierfield = {
      label: "Choose Supplier",
      method: "get",
      url: this.ecfmodelurl + "venserv/search_suppliername_ecf",
      params: "&sup_id=&name=",
      searchkey: "name",
      displaykey: "name",
      formcontrolname: 'name',
      wholedata: true,
      required: true,
      id: "create-ecf-0125"
    }

    this.POInvoiceForm = this.fb.group({
      poheader: new FormArray([
        this.podetails()
      ])
    })

    // this.POMakerForm.patchValue({
    //   type:"PO",
    //   po_number:ponum
    // })

    // if (ecfdata?.aptype_id == 2 || ecfdata?.aptype_id == 7 || ecfdata?.aptype_id == 14) {

    //   this.showsuppgst = true
    //   this.showsuppname = true
    //   this.showsuppstate = true
    // }
    // if (ecfdata?.aptype_id == 3) {

    //   this.showsuppname = false
    //   this.showsuppgst = false
    //   this.showsuppstate = false

    // }
    // if (ecfdata?.aptype_id == 13) {

    //   this.showsuppname = false
    //   this.showsuppgst = false
    //   this.showsuppstate = false

    // }
    // if (ecfdata?.aptype_id == 4 && ecfdata?.ppx_id?.id == 'E') {

    //   this.showsuppname = false
    //   this.showsuppgst = false
    //   this.showsuppstate = false

    // }
    // if (ecfdata?.aptype_id == 4 && ecfdata?.ppx_id?.id== 'S') {

    //   this.showsuppname = true
    //   this.showsuppgst = true
    //   this.showsuppstate = true


    // }
    console.log("ecfid", this.ecfid)
    //this.getheader()

    this.SpinnerService.show()
    this.ecfapservice.getdocdata(inwarddatas?.docnumber, 1).subscribe(result => {
      console.log("docresult", result)
      this.SpinnerService.hide()
      if (result['data'].length != 0) {
        this.ECFDataList = result['data']
        this.length_ecf = result['pagination']?.count

        if (Number(this.fulldataslist?.doccount) == Number(this.length_ecf)) {
          this.completedFlag = true
          this.showforecf = true
        }
        else if (Number(this.fulldataslist?.doccount) > Number(this.length_ecf) && Number(this.length_ecf) > 0) {
          this.completedFlag = false
          this.showforecf = true
        }
        else {
          this.completedFlag = false
        }

      }
    })

    this.getPhysical_verify()
  }
  crno: any
  ecfcrno = ""
  filedata: [] = []
  viewindex: any
  invoiceheaderres: any = []
  invoiceheadertotres: any
  getheader(id, pageNumber = 1) {
    this.showfrontdata = true
    let invhdrdatas = this.InvoiceHeaderForm.get('invoiceheader') as FormArray
    invhdrdatas.clear()
    this.SpinnerService.show()
    this.ecfapservice.getecfinwheader(id, pageNumber).subscribe(result => {
      this.SpinnerService.hide()
      console.log("invhdrres", result)
      this.showinvoiceheader = true
      this.invoiceheadertotres = result
      this.raisername = result?.raisername
      this.ecfcrno = result?.crno
      let invoiceheaderres = result?.invoice_header?.['data']
      this.invoiceheaderres = invoiceheaderres
      this.createlength_ecf = result?.invoice_header?.pagination?.count
      this.invoiceheaderrescount = invoiceheaderres?.length
      // this.ECFHeaderForm.patchValue({
      //   ecftype:result?.aptype,
      //   raisername:result?.raisername,
      //   raiserbranch:result?.raiserbranchgst,
      //   supplierName:invoiceheaderres[0]?.supplier_id?.name,
      //   invoiceno:invoiceheaderres[0]?.invoiceno,
      //   invoicedate:invoiceheaderres[0]?.invoicedate,
      //   taxableamount:invoiceheaderres[0]?.invoiceamount,
      //   taxamount:invoiceheaderres[0]?.taxamount,
      //   totalamount:invoiceheaderres[0]?.totalamount,
      // })
      // this.viewindex = 0
      // this.isgst = invoiceheaderres[0]?.invoicegst
      // this.crno = invoiceheaderres[0]?.apinvoiceheader_crno
      // this.filedata = invoiceheaderres[0]?.file_data
      //   let gst = result?.invoice_header[0]?.invoicegst ? result?.invoice_header[0]?.invoicegst : "N"

      this.getinvoicehdrrecords(result?.invoice_header)


    })
  }

  showfrontdata: boolean = false
  getheaders(id, pageNumber = 1) {
    this.popupopen();
    this.showfrontdata = false
    this.showattachment = false
    let invhdrdatas = this.InvoiceHeaderForm.get('invoiceheader') as FormArray
    invhdrdatas.clear()
    this.SpinnerService.show()
    // this.SummaryApiecfentryObjNew = {
    //   method: "get",
    //   url: this.ecfmodelurl + "ecfapserv/header/" + id,
    //   params: "",
    // }
    this.ecfapservice.getecfinwheader(id, pageNumber).subscribe(result => {
      this.SpinnerService.hide()
      console.log("invhdrres", result)
      this.invoiceheadertotres = result
      this.raisername = result?.raisername
      this.ecfcrno = result?.crno
      let invoiceheaderres = result?.invoice_header
      this.viewlength_ecf = result?.invoice_header?.pagination?.count
      this.invoiceheaderres = invoiceheaderres
      this.invoiceheaderrescount = invoiceheaderres?.length
      // this.ECFHeaderForm.patchValue({
      //   ecftype:result?.aptype,
      //   raisername:result?.raisername,
      //   raiserbranch:result?.raiserbranchgst,
      //   supplierName:invoiceheaderres[0]?.supplier_id?.name,
      //   invoiceno:invoiceheaderres[0]?.invoiceno,
      //   invoicedate:invoiceheaderres[0]?.invoicedate,
      //   taxableamount:invoiceheaderres[0]?.invoiceamount,
      //   taxamount:invoiceheaderres[0]?.taxamount,
      //   totalamount:invoiceheaderres[0]?.totalamount,
      // })
      // this.viewindex = 0
      // this.isgst = invoiceheaderres[0]?.invoicegst
      // this.crno = invoiceheaderres[0]?.apinvoiceheader_crno
      // this.filedata = invoiceheaderres[0]?.file_data
      //   let gst = result?.invoice_header[0]?.invoicegst ? result?.invoice_header[0]?.invoicegst : "N"
      //    this.InvoiceHeaderForm.patchValue({
      //      invoicegst:gst
      //    })
      //    for (let a of result?.invoice_header) {


      //     if (a?.invoicegst == 'Y') {
      //       this.showtaxforgst = true
      //     } else {
      //       this.showtaxforgst = false
      //     }
      //   }

      // this.getinvoicehdrrecords(result)
    })
  }






  InvHeaderFormArray(): FormArray {
    return this.InvoiceHeaderForm.get('invoiceheader') as FormArray;
  }
  invhdr_data = []
  getinvoicehdrrecords(datas) {

    this.invhdr_data = datas.data

    for (let invhdr of datas?.data) {
      let invoiceheader_id: FormControl = new FormControl('');
      let apinvoiceheader_crno: FormControl = new FormControl('');
      let supplier_name: FormControl = new FormControl('');
      let raisername: FormControl = new FormControl('');
      let raiserbranch: FormControl = new FormControl('');
      let invoicedate: FormControl = new FormControl('');
      let totalamount: FormControl = new FormControl('');
      let is_originalinvoice: FormControl = new FormControl('');
      let invoiceno: FormControl = new FormControl('');
      let filevalue: FormArray = new FormArray([]);
      let file_key: FormArray = new FormArray([]);
      let filedataas: FormArray = new FormArray([]);

      invoiceheader_id.setValue(invhdr?.id)
      apinvoiceheader_crno.setValue(invhdr?.apinvoiceheader_crno)
      supplier_name.setValue(invhdr?.supplier_id?.name)
      raisername.setValue(invhdr?.raisercode + " - " + invhdr?.raisername)
      raiserbranch.setValue(invhdr?.branchdetails_id?.code + "-" + invhdr?.branchdetails_id?.name)
      invoicedate.setValue(invhdr?.invoicedate)
      totalamount.setValue(invhdr?.totalamount)
      invoiceno.setValue(invhdr?.invoiceno)
      // if(invhdr?.is_originalinvoice == true){
      // is_originalinvoice.setValue(1)
      // }else{
      //   is_originalinvoice.setValue(0)
      // }
      is_originalinvoice.setValue(invhdr?.is_originalinvoice)
      filevalue.setValue([])
      file_key.setValue([])
      filedataas.setValue([])

      this.InvHeaderFormArray().push(new FormGroup({
        invoiceheader_id: invoiceheader_id,
        apinvoiceheader_crno: apinvoiceheader_crno,
        supplier_name: supplier_name,
        raisername: raisername,
        raiserbranch: raiserbranch,
        invoicedate: invoicedate,
        totalamount: totalamount,
        is_originalinvoice: is_originalinvoice,
        invoiceno: invoiceno,
        filevalue: this.filefun(invhdr),
        filedataas: this.filefun(invhdr),
        filekey: this.filefun(invhdr)
      }))




    }


  }

  getinvoicehdrnewrecords(datas) {



    for (let invhdr of datas?.invoice_header) {
      let invoiceheader_id: FormControl = new FormControl('');
      let apinvoiceheader_crno: FormControl = new FormControl('');
      let supplier_name: FormControl = new FormControl('');
      let raisername: FormControl = new FormControl('');
      let raiserbranch: FormControl = new FormControl('');
      let invoicedate: FormControl = new FormControl('');
      let totalamount: FormControl = new FormControl('');
      let is_originalinvoice: FormControl = new FormControl('');
      let invoiceno: FormControl = new FormControl('');
      let filevalue: FormArray = new FormArray([]);
      let file_key: FormArray = new FormArray([]);
      let filedataas: FormArray = new FormArray([]);

      invoiceheader_id.setValue(invhdr?.id)
      apinvoiceheader_crno.setValue(invhdr?.apinvoiceheader_crno)
      supplier_name.setValue(invhdr?.supplier_id?.name)
      raisername.setValue(invhdr?.raisercode + " - " + invhdr?.raisername)
      raiserbranch.setValue(invhdr?.branchdetails_id?.code + "-" + invhdr?.branchdetails_id?.name)
      invoicedate.setValue(invhdr?.invoicedate)
      totalamount.setValue(invhdr?.totalamount)
      invoiceno.setValue(invhdr?.invoiceno)
      // if(invhdr?.is_originalinvoice == true){
      // is_originalinvoice.setValue(1)
      // }else{
      //   is_originalinvoice.setValue(0)
      // }
      is_originalinvoice.setValue(invhdr?.is_originalinvoice)
      filevalue.setValue([])
      file_key.setValue([])
      filedataas.setValue([])

      this.InvHeaderFormArray().push(new FormGroup({
        invoiceheader_id: invoiceheader_id,
        apinvoiceheader_crno: apinvoiceheader_crno,
        supplier_name: supplier_name,
        raisername: raisername,
        raiserbranch: raiserbranch,
        invoicedate: invoicedate,
        totalamount: totalamount,
        is_originalinvoice: is_originalinvoice,
        invoiceno: invoiceno,
        filevalue: this.filefun(invhdr),
        filedataas: this.filefun(invhdr),
        filekey: this.filefun(invhdr)
      }))




    }


  }

  filefun(data) {
    let arr = new FormArray([])
    let dataForfILE = data.file_data
    if (data.file_data == "" || data.file_data == null || data.file_data == undefined) {
      dataForfILE = []
    } else {
      for (let file of dataForfILE) {
        let file_id: FormControl = new FormControl('');
        let file_name: FormControl = new FormControl('');
        file_id.setValue(file.file_id);
        file_name.setValue(file.file_name)
        arr.push(new FormGroup({
          file_id: file_id,
          file_name: file_name
        }))

      }
    }
    return arr;
  }
  toto: any
  calchdrTotal(invoiceamount, taxamount, totalamount: FormControl) {
    let ivAnount = Number(invoiceamount.value)
    let ivAtax = Number(taxamount.value)
    const Taxableamount = ivAnount
    const Taxamount = ivAtax
    let toto = Taxableamount + Taxamount
    this.toto = toto
    totalamount.setValue((this.toto), { emitEvent: false });
    this.datasums();
  }

  amt: any;
  sum: any;
  datasums() {
    this.amt = this.InvoiceHeaderForm.value['invoiceheader'].map(x => Number(x.totalamount));
    this.sum = this.amt.reduce((a, b) => a + b, 0);

  }

  getfiles(data) {
    // this.SpinnerService.show()
    this.ecfapservice.filesdownload(data.file_id)
      .subscribe((results) => {
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = data.file_name;
        link.click();
        // this.SpinnerService.hide()
      },
        // error => {
        //   this.errorHandler.handleError(error);
        //   this.SpinnerService.hide();
        // }
      )
  }
  fileindex: any
  fileDeletes(data, index: number) {
    this.ecfapservice.deletefile(data)
      .subscribe(result => {
        if (result?.status == 'success') {

          this.InvoiceHeaderForm.value.invoiceheader[this.fileindex].filedataas.splice(index, 1)
          this.InvoiceHeaderForm.value.invoiceheader[this.fileindex].filekey.splice(index, 1)
          this.notification.showSuccess("Deleted....")
          // this.closedbuttons.nativeElement.click();
        } else {
          this.notification.showError(result?.description)
          return false
        }
      })
  }

  movetonext() {
    this.viewindex += 1
    let data = this.invoiceheaderres
    this.crno = data[this.viewindex]?.apinvoiceheader_crno
    this.filedata = data[this.viewindex]?.file_data
    this.ECFHeaderForm.patchValue({
      ecftype: this.invoiceheadertotres?.aptype,
      raisername: this.invoiceheadertotres?.raisername,
      raiserbranch: this.invoiceheadertotres?.raiserbranchgst,
      supplierName: data[this.viewindex]?.supplier_id?.name,
      invoiceno: data[this.viewindex]?.invoiceno,
      invoicedate: data[this.viewindex]?.invoicedate,
      taxableamount: data[this.viewindex]?.invoiceamount,
      taxamount: data[this.viewindex]?.taxamount,
      totalamount: data[this.viewindex]?.totalamount,
    })

  }

  movetoprevious() {
    this.viewindex -= 1
    let data = this.invoiceheaderres
    this.crno = data[this.viewindex]?.apinvoiceheader_crno
    this.filedata = data[this.viewindex]?.file_data
    this.ECFHeaderForm.patchValue({
      ecftype: this.invoiceheadertotres?.aptype,
      raisername: this.invoiceheadertotres?.raisername,
      raiserbranch: this.invoiceheadertotres?.raiserbranchgst,
      supplierName: data[this.viewindex]?.supplier_id?.name,
      invoiceno: data[this.viewindex]?.invoiceno,
      invoicedate: data[this.viewindex]?.invoicedate,
      taxableamount: data[this.viewindex]?.invoiceamount,
      taxamount: data[this.viewindex]?.taxamount,
      totalamount: data[this.viewindex]?.totalamount,
    })
  }
  imageUrl = environment.apiURL
  tokenValues: any
  showimageHeaderAPI: boolean
  showimagepdf: boolean
  pdfurl: any
  jpgUrlsAPI: any
  hideimage() {
    this.showfiletable = true
    this.showIcon = false
    this.showimageHeaderAPI = false
    this.showimagepdf = false
  }
  filefulldetails: any
  data(datas) {
    this.showfiletable = false
    this.showIcon = true
    this.showhideicon = true
    let id = datas?.file_id
    let filename = datas?.file_name
    this.filefulldetails = datas
    // this.ecfservice.downloadfile(id)




    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = filename.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg" ||
      stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {

      this.showimageHeaderAPI = true
      this.showimagepdf = false
      this.jpgUrlsAPI = this.imageUrl + "ecfapserv/ecffile/" + id + "?token=" + token;
    }
    if (stringValue[1] === "pdf" || stringValue[1] === "PDF") {
      this.showimagepdf = true
      this.showimageHeaderAPI = false
      this.ecfapservice.downloadfile(id)
        .subscribe((data) => {
          let binaryData = [];
          binaryData.push(data)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          this.pdfurl = downloadUrl
        }, (error) => {
          this.errorHandler.handleError(error);
          this.showimagepdf = false
          this.showimageHeaderAPI = false
          this.SpinnerService.hide();
        })
    }
    if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt" ||
      stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT") {
      this.showimagepdf = false
      this.showimageHeaderAPI = false
    }




  }

  data1(attach) {
    console.log("attach", attach)
    let datas = this.filefulldetails
    // this.showfiletable = true
    this.showIcon = false
    this.showimageHeaderAPI = false
    this.showimagepdf = false
    let id = attach?.file_id
    let filename = attach?.file_name
    // this.ecfservice.downloadfile(id)




    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = filename.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg" ||
      stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {

      // this.showimageHeaderAPI = true
      // this.showimagepdf = false
      this.jpgUrlsAPI = window.open(this.imageUrl + "ecfapserv/ecffile/" + id + "?token=" + token, '_blank');

    }
    if (stringValue[1] === "pdf" || stringValue[1] === "PDF") {
      // this.showimagepdf = true
      // this.showimageHeaderAPI = false
      this.ecfapservice.downloadfile1(id)
      // .subscribe((data) => {
      //   let dataType = data.type;
      //   let binaryData = [];
      //   binaryData.push(data);
      //   let downloadLink = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
      //   window.open(downloadLink, "_blank");
      // }, (error) => {
      //   this.errorHandler.handleError(error);
      //   this.showimagepdf = false
      //   this.showimageHeaderAPI = false
      //   this.SpinnerService.hide();
      // })
    }
    if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt" ||
      stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT") {
      // this.showimagepdf = false
      // this.showimageHeaderAPI = false
    }




  }

  zoomLevel: number = 1;

  zoomIn() {
    if (this.zoomLevel < 2) { // Limit the maximum zoom level to 200%
      this.zoomLevel += 0.1;
    }
  }

  zoomOut() {
    if (this.zoomLevel > 0.1) { // Limit the minimum zoom level to 10%
      this.zoomLevel -= 0.1;
    }
  }

  getSections(forms) {
    return forms.controls.invoiceheader.controls;
  }

  invhdrsaved = false
  invhdrsave() {

    let data = this.fulldataslist
    console.log("submit dataaaaaaaa", data)


    // if (data.doctype_id == null || data.doctype_id == "" || data.doctype_id == undefined) {
    //   this.notification.showWarning("Please Select Document Type")
    //   return false
    // }
    // if ( typeof data.doctype_id == 'string') {
    //   this.notification.showWarning("Please Select Document Type from Dropdown")
    //   return false
    // }
    // if (data.docsubject == null || data.docsubject == "" || data.docsubject == undefined) {
    //   this.notification.showWarning("Please fill Doc Subject")
    //   return false
    // }

    // if (data.ref_date == "None") {
    //   data.ref_date = ""
    // }
    // if (data.ref_date !== null || data.ref_date !== "" || data.ref_date !== undefined) {
    //   data.ref_date  = this.datePipe.transform(data.ref_date, 'yyyy-MM-dd');
    // }
    console.log("invhdrres", this.invoiceheaderres)
    const invoicedetaildata = this.InvoiceHeaderForm.value.invoiceheader
    console.log("invoicedetaildata", invoicedetaildata)
    if (invoicedetaildata.length == 0) {
      this.notification.showError("No Data to Save.")
      return false;
    }
    for (let i in invoicedetaildata) {
      if (typeof (invoicedetaildata[i].is_originalinvoice) != 'number') {
        this.notification.showError("Please Select Physical verification")
        return false;
      }
    }
    let InvhdrArray: any
    for (let x of invoicedetaildata) {
      let is_originalinvoice: FormControl = new FormControl('');
      let invoiceheader_id: FormControl = new FormControl('');
      let inwarddetails_id: FormControl = new FormControl('');
      // const InvhdrFormArray = this.ECFsubmitform.get("invoicehdr") as FormArray;
      is_originalinvoice.setValue(x?.is_originalinvoice),
        invoiceheader_id.setValue(x?.invoiceheader_id),
        inwarddetails_id.setValue(this.fulldataslist?.id)
      InvhdrArray = [{
        is_originalinvoice: is_originalinvoice?.value,
        invoiceheader_id: invoiceheader_id?.value,
        inwarddetails_id: inwarddetails_id?.value
      }]
    }

    console.log("InvhdrFormArray", InvhdrArray)
    // let dataset = {
    //   "id": data.id,
    //   "pagecount": data.pagecount,
    //   "packetno":data.packetno,
    //   "doccount":data.doccount,
    //   "receivedfrom": data.receivedfrom,
    //   "docsubject": data.docsubject,
    //   "doctype_id": data.doctype_id.id,
    //   "remarks": data.remarks,
    //   // "filekey": [data.file_name],
    //   "ref_no": data.ref_no,
    //   "ref_date": data.ref_date,
    //   "assigndept":1,
    //   "assignemployee":1,
    //   "actiontype":1,
    //   "tenor":0,
    //   "docaction":1,
    //   "assignremarks": data.remarks,
    //   "inwardheader_id":data.inwardheader_id,
    //   "invoiceheader_data":this.ECFsubmitform?.value?.invoicehdr
    // }
    // console.log("dataset",dataset)
    // let filedataCheck = data.filearray
    // if (filedataCheck.length <= 0) {
    //   this.notification.showWarning("Please Check Files is selected or not")
    //   return false
    // }
    // const formData: FormData = new FormData();
    // let datavalue = JSON.stringify(dataset)
    // formData.append('data', datavalue);
    // let filekeydata = data.file_name

    // let fileArray = data.filearray
    // for (let individual in fileArray) {
    //   formData.append(filekeydata, fileArray[individual])

    // }







    // this.ecfapservice.inwardDetailsViewUploadmicro(dataset)
    //   .subscribe(res => {
    //     this.notification.showSuccess("Updated Successfully!..")
    //     this.movetonext()
    //     console.log("return response ", res)
    //     this.headersearch = true
    //     data.docnumber = res.docnumber
    //     // this.onCancel.emit()
    //   })



    let dataset = {
      "id": data.id,
      "pagecount": data.pagecount,
      "packetno": data.packetno,
      "doccount": data.doccount,
      "receivedfrom": data.receivedfrom,
      "docsubject": data.docsubject,
      "doctype_id": 1,
      "remarks": data.remarks,
      "ref_no": this.ecfSearchForm.value.ecf_no.trim(),
      "ref_date": this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      "assigndept_id": 1,
      "assignemployee_id": 1,
      "actiontype": 1,
      "tenor": 0,
      "docaction": 1,
      "assignremarks": data.remarks,
      "inwardheader_id": data.inwardheader_id,
      "docnumber": data.docnumber
    }
    this.SpinnerService.show()
    this.ecfapservice.inwardDetailsViewUploadmicro2(dataset).subscribe(result => {
      console.log("testres", result)
      if (result?.id != undefined) {
        this.notification.showSuccess("Saved Successfully")
        this.length_ecf += 1
        this.invhdrsaved = true
        let invupdate = { "inward_datalist": InvhdrArray }
        this.ecfapservice.originalinvsave(invupdate).subscribe(result => {
          console.log("updateres", result)
          if (result?.status == "success") {

          }
        })

        this.ecfapservice.getdocdata(data?.docnumber, 1).subscribe(result => {
          console.log("docresult", result)
          this.SpinnerService.hide()
          this.ECFDataList = result['data']
          this.length_ecf = result['pagination']?.count
          console.log("ECFDataList", this.ECFDataList)
          this.showfrontdata = false
          this.ecfSearchForm.controls['ecf_no'].reset("")
          let invhdrdatas = this.InvoiceHeaderForm.get('invoiceheader') as FormArray
          invhdrdatas.clear()
          this.ecfcrno = ""
          this.createlength_ecf = 0
          this.invoiceheaderrescount = 0
        })
      } else {
        this.SpinnerService.hide()
        this.notification.showError(result?.description)
        return false
      }

    })



  }

  backtoinward() {
    this.onCancel.emit()
  }

  resetinv() { }

  get pageCount(): number {
    return Math.ceil(this.invoiceheaderres?.length / this.pageSize);
  }

  onFileSelected(e) {
    const selectedFile = e.target.files[0];
  }
  headersearch: boolean;
  searchdata() {
    console.log("ECFDataList", this.ECFDataList)
    const value = this.ecfSearchForm.value.ecf_no
    if (value == "" || value == null || value == undefined) {
      this.notification.showError("Please Enter ECF No")
      return false
    }



    let trimmedText = value?.trim();
    let headerkey = {
      "crno": trimmedText, "aptype": "", "apstatus": "", "minamt": "", "maxamt": ""
    }

    let invhdrdatas = this.InvoiceHeaderForm.get('invoiceheader') as FormArray
    invhdrdatas.clear()


    let text = value
    console.log("refnooo", value)
    let potext = text.substring(0, 2);
    console.log("potext", potext)
    if (potext != "PO") {
      // this.onSearch.emit()
      // this.router.navigate(['inward/ecfview'])
      if (Number(this.fulldataslist?.doccount) == Number(this.length_ecf)) {
        this.notification.showInfo("ECF Count Exceeds")
        return false
      }

      this.showforecf = true
      this.showforpo = false
      this.SpinnerService.show()
      this.ecfapservice.ecfinvsummarySearch(headerkey, 1).subscribe(result => {
        console.log("searchresult", result)
        this.SpinnerService.hide()
        if (result['data'] != undefined) {
          if (result['data'][0]?.ecfstatus?.text != "ECF APPROVED") {
            this.notification.showInfo("Kindly Search Approved ECF CR No")
            return false;
          }
          this.shareservice.ECFData.next(result)
          this.ecfid = result['data'][0].id
          this.ecftypeid = result['data'][0].aptype_id
          this.ppxid = result['data'][0].ppx_id?.id
          this.paytoid = result['data'][0]?.payto_id
          this.ecftype = result['data'][0].aptype
          this.branchcodename = result['data'][0]?.branch[0]?.code + "-" + result['data'][0]?.branch[0]?.name
          console.log("branchcodename", this.branchcodename)
          this.commodityname = result['data'][0]?.commodity_id?.name
          this.showfrontdata = true
          let invhdrdatas = this.InvoiceHeaderForm.get('invoiceheader') as FormArray
          invhdrdatas.clear()

          this.showinvoiceheader = true
          this.invoiceheadertotres = result
          this.invhdr_data = result['data'][0]?.['invoice_header']
          this.raisername = result?.raisername
          this.ecfcrno = result['data'][0]?.crno
          let invoiceheaderres = result['data'][0]?.['invoice_header']
          // this.invoiceheaderres = invoiceheaderres
          this.createlength_ecf = result?.invoice_header?.pagination?.count
          this.invoiceheaderrescount = invoiceheaderres?.length
          this.getinvoicehdrnewrecords(result['data'][0])
          if (this.fulldataslist.doccount > this.length_ecf) {
            this.invhdrsaved = false
          }



          if (result?.aptype_id == 2 || result?.aptype_id == 7 || result?.aptype_id == 14) {

            this.showsuppgst = true
            this.showsuppname = true
            this.showsuppstate = true
          }
          if (result?.aptype_id == 3) {

            this.showsuppname = false
            this.showsuppgst = false
            this.showsuppstate = false

          }
          if (result?.aptype_id == 13) {

            this.showsuppname = false
            this.showsuppgst = false
            this.showsuppstate = false

          }
          if (result?.aptype_id == 4 && result?.ppx_id?.id == 'E') {

            this.showsuppname = false
            this.showsuppgst = false
            this.showsuppstate = false

          }
          if (result?.aptype_id == 4 && result?.ppx_id?.id == 'S') {

            this.showsuppname = true
            this.showsuppgst = true
            this.showsuppstate = true


          }
          console.log("ecfid", this.ecfid)


        } else {
          this.notification.showError(result?.description)
          return false
        }
      })
    }
    else {
      this.shareservice.ponumber.next(value)
      this.showforecf = false
      this.showforpo = true
      let pohdrdatas = this.POInvoiceForm.get('poheader') as FormArray
      pohdrdatas.clear()
      let datas = { "po_no": value }
      this.ecfapservice.getpodetails(datas).subscribe(result => {
        console.log("pores====>", result)
        this.POList = result['data']
        if (result['data']?.length > 0) {
          this.getpohdrrecords(result)
        }
      })
      // this.onView.emit()
      // this.router.navigate(['inward/poview'])
    }
    // this.getheader(this.ecfid)


  }
  searchdatas(e) {
    console.log("ECFDataList", this.ECFDataList)
    const value = this.ecfSearchForm.value.ecf_no
    if (value == "" || value == null || value == undefined) {
      this.notification.showError("Please Enter ECF No")
      return false
    }



    let trimmedText = value?.trim();
    // let headerkey = {
    //   "crno": trimmedText, "aptype": "", "apstatus": "", "minamt": "", "maxamt": ""
    // }

    let invhdrdatas = this.InvoiceHeaderForm.get('invoiceheader') as FormArray
    invhdrdatas.clear()


    let text = value
    console.log("refnooo", value)
    let potext = text.substring(0, 2);
    console.log("potext", potext)
    if (potext != "PO") {
      // this.onSearch.emit()
      // this.router.navigate(['inward/ecfview'])
      if (Number(this.fulldataslist?.doccount) == Number(this.length_ecf)) {
        this.notification.showInfo("ECF Count Exceeds")
        return false
      }

      this.showforecf = true
      this.showforpo = false
      e["crno"]=trimmedText
      e["minamt"]="",
      e["aptype"]="",
      e["maxamt"]=""
      this.SpinnerService.show()
      
      this.ecfapservice.ecfinvsummarySearch(e, 1).subscribe(result => {
        console.log("searchresult", result)
        this.SpinnerService.hide()
        if (result['data'] != undefined) {
          if (result['data'][0]?.ecfstatus?.text != "ECF APPROVED") {
            this.notification.showInfo("Kindly Search Approved ECF CR No")
            return false;
          }
          this.shareservice.ECFData.next(result)
          this.ecfid = result['data'][0].id
          this.ecftypeid = result['data'][0].aptype_id
          this.ppxid = result['data'][0].ppx_id?.id
          this.paytoid = result['data'][0]?.payto_id
          this.ecftype = result['data'][0].aptype
          this.branchcodename = result['data'][0]?.branch[0]?.code + "-" + result['data'][0]?.branch[0]?.name
          console.log("branchcodename", this.branchcodename)
          this.commodityname = result['data'][0]?.commodity_id?.name
          this.showfrontdata = true
          let invhdrdatas = this.InvoiceHeaderForm.get('invoiceheader') as FormArray
          invhdrdatas.clear()

          this.showinvoiceheader = true
          this.invoiceheadertotres = result
          this.invhdr_data = result['data'][0]?.['invoice_header']
          this.raisername = result?.raisername
          this.ecfcrno = result['data'][0]?.crno
          let invoiceheaderres = result['data'][0]?.['invoice_header']
          // this.invoiceheaderres = invoiceheaderres
          this.createlength_ecf = result?.invoice_header?.pagination?.count
          this.invoiceheaderrescount = invoiceheaderres?.length
          this.getinvoicehdrnewrecords(result['data'][0])
          if (this.fulldataslist.doccount > this.length_ecf) {
            this.invhdrsaved = false
          }



          if (result?.aptype_id == 2 || result?.aptype_id == 7 || result?.aptype_id == 14) {

            this.showsuppgst = true
            this.showsuppname = true
            this.showsuppstate = true
          }
          if (result?.aptype_id == 3) {

            this.showsuppname = false
            this.showsuppgst = false
            this.showsuppstate = false

          }
          if (result?.aptype_id == 13) {

            this.showsuppname = false
            this.showsuppgst = false
            this.showsuppstate = false

          }
          if (result?.aptype_id == 4 && result?.ppx_id?.id == 'E') {

            this.showsuppname = false
            this.showsuppgst = false
            this.showsuppstate = false

          }
          if (result?.aptype_id == 4 && result?.ppx_id?.id == 'S') {

            this.showsuppname = true
            this.showsuppgst = true
            this.showsuppstate = true


          }
          console.log("ecfid", this.ecfid)


        } else {
          this.notification.showError(result?.description)
          return false
        }
      })
    }
    else {
      this.shareservice.ponumber.next(value)
      this.showforecf = false
      this.showforpo = true
      let pohdrdatas = this.POInvoiceForm.get('poheader') as FormArray
      pohdrdatas.clear()
      let datas = { "po_no": value }
      this.ecfapservice.getpodetails(datas).subscribe(result => {
        console.log("pores====>", result)
        this.POList = result['data']
        if (result['data']?.length > 0) {
          this.getpohdrrecords(result)
        }
      })
      // this.onView.emit()
      // this.router.navigate(['inward/poview'])
    }
    // this.getheader(this.ecfid)


  }


  // getECFdata() {
  //   console.log("ECFDataList", this.ECFDataList)
  //   const value = this.ecfSearchForm.value.ecf_no


  //   let trimmedText = value?.trim();
  //   let headerkey = {
  //     "crno": trimmedText, "aptype": "", "apstatus": "", "minamt": "", "maxamt": ""
  //   }

  //   let invhdrdatas = this.InvoiceHeaderForm.get('invoiceheader') as FormArray
  //   invhdrdatas.clear()


  //   let text = value
  //   console.log("refnooo", value)
  //   let potext = text.substring(0, 2);
  //   console.log("potext", potext)
  //   if (potext != "PO") {
  //     // this.onSearch.emit()
  //     // this.router.navigate(['inward/ecfview'])

  //     this.showforecf = true
  //     this.showforpo = false
  //     this.SpinnerService.show()
  //     this.ecfapservice.ecfinvsummarySearch(headerkey, 1).subscribe(result => {
  //       console.log("searchresult", result)
  //       this.SpinnerService.hide()
  //       if (result['data'] != undefined) {

  //         this.shareservice.ECFData.next(result)
  //         this.ecfid = result['data'][0].id
  //         this.ecftypeid = result['data'][0].aptype_id
  //         this.ppxid = result['data'][0].ppx_id?.id
  //         this.paytoid = result['data'][0]?.payto_id
  //         this.ecftype = result['data'][0].aptype
  //         this.branchcodename = result['data'][0]?.branch[0]?.code + "-" + result['data'][0]?.branch[0]?.name
  //         console.log("branchcodename", this.branchcodename)
  //         this.commodityname = result['data'][0]?.commodity_id?.name
  //         this.showfrontdata = true
  //         let invhdrdatas = this.InvoiceHeaderForm.get('invoiceheader') as FormArray
  //         invhdrdatas.clear()

  //         this.showinvoiceheader = true
  //         this.invoiceheadertotres = result
  //         this.raisername = result?.raisername
  //         this.ecfcrno = result['data'][0]?.crno
  //         let invoiceheaderres = result['data'][0]?.['invoice_header']
  //         this.invoiceheaderres = invoiceheaderres
  //         this.createlength_ecf = result?.invoice_header?.pagination?.count
  //         this.invoiceheaderrescount = invoiceheaderres?.length
  //         this.getinvoicehdrnewrecords(result['data'][0])

  //         this.InvoiceHeaderForm.get('invoiceheader')['controls'][0].get('invoicegst').setValue(result['data'][0].is_originalinvoice)                


  //         if (result?.aptype_id == 2 || result?.aptype_id == 7 || result?.aptype_id == 14) {

  //           this.showsuppgst = true
  //           this.showsuppname = true
  //           this.showsuppstate = true
  //         }
  //         if (result?.aptype_id == 3) {

  //           this.showsuppname = false
  //           this.showsuppgst = false
  //           this.showsuppstate = false

  //         }
  //         if (result?.aptype_id == 13) {

  //           this.showsuppname = false
  //           this.showsuppgst = false
  //           this.showsuppstate = false

  //         }
  //         if (result?.aptype_id == 4 && result?.ppx_id?.id == 'E') {

  //           this.showsuppname = false
  //           this.showsuppgst = false
  //           this.showsuppstate = false

  //         }
  //         if (result?.aptype_id == 4 && result?.ppx_id?.id == 'S') {

  //           this.showsuppname = true
  //           this.showsuppgst = true
  //           this.showsuppstate = true


  //         }
  //         console.log("ecfid", this.ecfid)


  //       } else {
  //         this.notification.showError(result?.description)
  //         return false
  //       }
  //     })
  //   }
  //   else {
  //     this.shareservice.ponumber.next(value)
  //     this.showforecf = false
  //     this.showforpo = true
  //     let pohdrdatas = this.POInvoiceForm.get('poheader') as FormArray
  //     pohdrdatas.clear()
  //     let datas = {"po_no":value}
  //     this.ecfapservice.getpodetails(datas).subscribe(result=>{
  //           console.log("pores====>",result)
  //       this.POList = result['data']
  //       if(result['data']?.length > 0){
  //       this.getpohdrrecords(result)
  //       }
  //     })
  //     // this.onView.emit()
  //     // this.router.navigate(['inward/poview'])
  //   }
  //   // this.getheader(this.ecfid)


  // }
  resetecfno() {
    this.ecfSearchForm.controls['ecf_no'].reset("")
    let invhdrdatas = this.InvoiceHeaderForm.get('invoiceheader') as FormArray
    invhdrdatas.clear()
    this.invoiceheaderrescount = ""
    this.ecfcrno = ""

  }

  length_ecf = 0;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  pageSize_ecf = 10;
  showFirstLastButtons: boolean = true;
  hdrpresentpage: number = 1;
  handlePageEvent(event: PageEvent) {
    this.length_ecf = event.length;
    this.pageSize_ecf = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.hdrpresentpage = event.pageIndex + 1;
    this.getdocument(this.hdrpresentpage)
  }
  viewlength_ecf = 0;
  pageSizeview_ecf = 10;
  viewpresentpage: number = 1;
  handlePageviewEvent(event: PageEvent) {
    this.viewlength_ecf = event.length;
    this.pageSizeview_ecf = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.viewpresentpage = event.pageIndex + 1;
    this.getheaders(this.ecfid, this.viewpresentpage)
  }
  createlength_ecf = 0;
  pageSizecreate_ecf = 10;
  createpresentpage: number = 1;
  handlePagecreateEvent(event: PageEvent) {
    this.createlength_ecf = event.length;
    this.pageSizecreate_ecf = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.createpresentpage = event.pageIndex + 1;
    this.getheader(this.ecfid, this.createpresentpage)
  }
  getdocument(pageNumber = 1) {
    this.SpinnerService.show()
    let data = this.fulldataslist
    this.ecfapservice.getdocdata(data?.docnumber, pageNumber).subscribe(result => {
      console.log("docresult", result)
      this.SpinnerService.hide()
      this.ECFDataList = result['data']
      this.length_ecf = result['pagination']?.count
      if(pageNumber == 1)
        this.pageIndex = 0
      console.log("ECFDataList", this.ECFDataList)
    })
  }
  showattachment: boolean = false
  showimg() {
    this.showattachment = !this.showattachment
  }

  filedatas: any

  getfiledetails(datas, ind) {
    console.log("ddataas", datas)
    this.fileindex = ind
    this.filedatas = datas.value['filekey']
    this.popupopenview()
  }

  valid_arr: Array<any> = [];
  file_process_data: any = {};
  fileArray_n: Array<any> = [];
  // getFileDetails(e) {

  //   let data = this.POMakerForm.value.filevalue;
  //   for (var i = 0; i < e.target.files.length; i++) {
  //     data[0]?.filevalue?.push(e?.target?.files[i])
  //     this.valid_arr.push(e.target.files[i]);
  //   }
  //   this.file_process_data["file" + 0] = this.valid_arr;
  // }
  //this.fileArray_n.push(e.target.files[0])


// helpers
allFiles: any[] = [];
pagedFiles: any[] = [];

length_PymtAdv = 0;
pagesize_PymtAdv = 10;
pageIndexPymtAdv = 0;
pymtAdvpresentpage = 1;
isPymtAdvpage = true;

getTotalFilesCount(): number {
  let count = 0;
  if (!this.file_process_data) return 0;
  Object.keys(this.file_process_data).forEach(type => {
    count += this.file_process_data[type]?.length || 0;
  });
  return count;
}

/** rebuild allFiles & ensure pageIndex is inside valid range, then update pagedFiles */
preparePagedFiles() {
  this.allFiles = [];

  if (this.file_process_data) {
    Object.keys(this.file_process_data).forEach(type => {
      this.file_process_data[type].forEach((file: any) => {
        // keep the same object shape you used in template
        this.allFiles.push({ type, file });
      });
    });
  }

  this.length_PymtAdv = this.allFiles.length;

  // keep pageIndex in valid range
  const totalPages = Math.max(1, Math.ceil(this.length_PymtAdv / this.pagesize_PymtAdv));
  if (this.pageIndexPymtAdv >= totalPages) {
    this.pageIndexPymtAdv = Math.max(0, totalPages - 1);
  }
  this.updatePagedFiles();
}

updatePagedFiles() {
  const startIndex = this.pageIndexPymtAdv * this.pagesize_PymtAdv;
  const endIndex = startIndex + this.pagesize_PymtAdv;
  this.pagedFiles = this.allFiles.slice(startIndex, endIndex);
  this.pymtAdvpresentpage = this.pageIndexPymtAdv + 1;
}

/** paginator callback */
handlePymtAdvPageEvent(event: PageEvent) {
  this.pagesize_PymtAdv = event.pageSize;
  this.pageIndexPymtAdv = event.pageIndex;
  this.pymtAdvpresentpage = event.pageIndex + 1;
  this.updatePagedFiles();
}

/**
 * Delete a single file row (row has {type, file})
 * - finds the file inside file_process_data[type] using robust matching (reference or name+size+lastModified)
 * - updates uploadedFiles FormControl (if used)
 * - rebuilds pagination and brings user back a page if current page becomes empty
 */
deletefileUpload(row: { type: string, file: any }) {
  if (!row) return;
  const { type, file } = row;

  if (!this.file_process_data || !this.file_process_data[type]) {
    // nothing to delete
    return;
  }

  // find index in the specific type array using best-match
  const typeArr = this.file_process_data[type];
  let idx = typeArr.findIndex((f: any) => {
    // try strict reference equality first
    if (f === file) return true;
    // fallback: match by name, size and lastModified when possible
    if (f?.name && file?.name && f?.size != null && file?.size != null && f?.lastModified != null && file?.lastModified != null) {
      return f.name === file.name && f.size === file.size && f.lastModified === file.lastModified;
    }
    // last fallback: match by name only
    return f?.name === file?.name;
  });

  if (idx === -1) {
    console.warn('deletefileUpload: file not found in file_process_data[' + type + ']');
    // try to find and remove the first matching by name to be safe
    idx = typeArr.findIndex((f: any) => f?.name === file?.name);
  }

  if (idx > -1) {
    // remove from that type array
    typeArr.splice(idx, 1);
    if (typeArr.length === 0) {
      delete this.file_process_data[type];
    }
  } else {
    // nothing found -> exit
    return;
  }

  // Also remove from POMakerForm.uploadedFiles control (if you store {type,file} there)
  const uploadedFilesCtrl = this.POMakerForm?.get('uploadedFiles');
  if (uploadedFilesCtrl) {
    const current = uploadedFilesCtrl.value || [];
    const updated = current.filter((fObj: any) => {
      const f = fObj.file || fObj; // depending on how you stored them
      const t = fObj.type || fObj?.type;
      // same matching logic
      if (t !== type) return true;
      if (f === file) return false;
      if (f?.name && file?.name && f?.size != null && file?.size != null && f?.lastModified != null && file?.lastModified != null) {
        return !(f.name === file.name && f.size === file.size && f.lastModified === file.lastModified);
      }
      return !(f?.name === file?.name);
    });
    uploadedFilesCtrl.setValue(updated);
  }

  // Rebuild paged data
  this.preparePagedFiles();

  // If current page becomes empty and we're not on the first page, go back until we have items or reach page 0
  while (this.pagedFiles.length === 0 && this.pageIndexPymtAdv > 0) {
    this.pageIndexPymtAdv--;
    this.updatePagedFiles();
  }

  // done
  console.log('Deleted file. Current file_process_data:', this.file_process_data);
}


  fileback(){
    this.closedbuttons.nativeElement.click();
    // this.onCancel.emit()
  }

  showimageHeaderPreview: boolean = false
  showimageHeaderPreviewPDF: boolean = false
  jpgUrls: any

  filepreview(files) {
    let stringValue = files.name.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg" ||
      stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {
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
    // if (stringValue[1] === "pdf" || stringValue[1] === "PDF") {
    //   // this.showimageHeaderPreview = false
    //   // this.showimageHeaderPreviewPDF = true
    //   const reader: any = new FileReader();
    //   reader.readAsDataURL(files);
    //   reader.onload = (_event) => {
    //   this.pdfurl = reader.result
    //   const link = document.createElement('a');
    //   link.href = this.pdfurl;
    //   link.target = '_blank'; // Open in a new tab
    //   link.click();
    //   }
    // }

    if (stringValue[1] === "pdf" || stringValue[1] === "PDF") {
      const reader: any = new FileReader();
      reader.onload = (_event) => {
        const fileData = reader.result;
        const blob = new Blob([fileData], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      };
      reader.readAsArrayBuffer(files);
    }
    if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt" ||
      stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT") {
      this.showimageHeaderPreview = false
      this.showimageHeaderPreviewPDF = false
    }
  }
  selecteditem = []
  storedata(e, ind, value) {
    console.log("value", value)
    console.log("ind", ind)
    this.selecteditem.push(value)
  }
  physical_verify: any
  getPhysical_verify() {
    this.ecfapservice.getPhysicalVerify()
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.physical_verify = result["data"]
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  statecode: any
  statename: any
  SupplierName: any;
    getposuppView(data) {
    console.log("dataaa", data)
    this.supplierid = data
    this.ecfapservice.getsupplierView(data)
      .subscribe(result => {
        if (result) {
          this.SupplierName = result?.name
          this.SupplierCode = result?.code
          this.SupplierGSTNumber = result?.gstno
          this.SupplierPANNumber = result?.panno
          this.Address = result?.address_id
          this.line1 = result?.address_id?.line1
          this.line2 = result?.address_id?.line2
          this.line3 = result?.address_id?.line3
          this.City = result?.address_id?.city_id?.name
          this.stateid = result?.address_id?.state_id?.id
          this.statecode = result?.address_id?.state_id?.code
          this.statename = result?.address_id?.state_id?.name
          this.POMakerForm.patchValue({
            supplier_name: result?.name,
            supplier_gst: result?.gstno
          })
          if( this.SupplierGSTNumber == '' ||  this.SupplierGSTNumber  == null ||  this.SupplierGSTNumber== undefined){
            this.POMakerForm.controls['is_gst'].disable()
          }
           else{
            this.POMakerForm.controls['is_gst'].enable()
          }
          // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppname').setValue(this.SupplierName)
          // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppliergst').setValue(this.SupplierGSTNumber)
          // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('supplier_id').setValue(this.supplierid)
          // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('supplierstate_id').setValue(this.stateid)
          // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppstate').setValue(this.statename)
          this.submitbutton = true;
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  getsuppView(data) {
    if (!data.id) {
      return;
    }
    console.log("dataaa", data)
    this.supplierid = data?.id
    this.ecfapservice.getsupplierView(data?.id)
      .subscribe(result => {
        if (result) {
          this.SupplierName = result?.name
          this.SupplierCode = result?.code
          this.SupplierGSTNumber = result?.gstno
          this.SupplierPANNumber = result?.panno
          this.Address = result?.address_id
          this.line1 = result?.address_id?.line1
          this.line2 = result?.address_id?.line2
          this.line3 = result?.address_id?.line3
          this.City = result?.address_id?.city_id?.name
          this.stateid = result?.address_id?.state_id?.id
          this.statecode = result?.address_id?.state_id?.code
          this.statename = result?.address_id?.state_id?.name
          this.POMakerForm.patchValue({
            supplier_name: data?.name,
            supplier_gst: result?.gstno
          })
          if( this.SupplierGSTNumber == '' ||  this.SupplierGSTNumber  == null ||  this.SupplierGSTNumber== undefined){
            this.POMakerForm.controls['is_gst'].disable()
          }
          else{
            this.POMakerForm.controls['is_gst'].enable()
          }
          // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppname').setValue(this.SupplierName)
          // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppliergst').setValue(this.SupplierGSTNumber)
          // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('supplier_id').setValue(this.supplierid)
          // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('supplierstate_id').setValue(this.stateid)
          // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppstate').setValue(this.statename)
          this.submitbutton = true;
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  // SelectSuppliersearch() {
  //   let searchsupplier = this.SelectSupplierForm?.value;
  //   if (searchsupplier?.code === "" && searchsupplier?.panno === "" && searchsupplier?.gstno === "") {
  //     this.getsuppliername("", "");
  //   }
  //   else {
  //     this.SelectSupplierForm.controls['name'].enable();
  //     this.alternate = true;
  //     this.default = false;
  //     this.Testingfunctionalternate();
  //   }
  // }
  searchsupplier: any
  suppliers: any;
  SelectSuppliersearchs(e) {
    this.suppliers = e
    let searchsupplier = this.SelectSupplierForm?.value;
    if ((this.suppliers?.code == "" || this.suppliers?.code == undefined || this.suppliers?.code == null)
      && (this.suppliers?.panno == "" || this.suppliers?.panno == undefined || this.suppliers?.panno == null)
      && (this.suppliers?.gstno == "" || this.suppliers?.gstno == undefined || this.suppliers?.gstno == null)) {
      this.getsuppliername("", "");
    }
    else {
      // this.SelectSupplierForm.controls['name'].enable();
      // this.alternate = true;
      // this.default = false;
      // this.Testingfunctionalternate();
      if (searchsupplier?.gstno != "" && searchsupplier?.gstno != null && searchsupplier?.gstno != undefined) {
        this.ecfapservice.getEmpBanch(searchsupplier?.gstno)
          .subscribe(res => {
            console.log("empbranch", res)
            let result = res.data
            if (result.length > 0) {
              this.notification.showError("KVB GST Numbers. cannot be used. ")
              this.SpinnerService.hide();
              return false
            }
            else {
              this.alternate = true;
              this.default = false;
              this.Testingfunctionalternate();
            }
          })
      }
      else {
        this.alternate = true;
        this.default = false;
        this.Testingfunctionalternate();
      }

    }
    if (searchsupplier?.name != "" && searchsupplier?.name != null && searchsupplier?.name != undefined) {
      this.Testingfunctionalternate();
    }
  }
  // Testingfunctionalternate() {
  //   this.searchsupplier = this.SelectSupplierForm.value;
  //   this.ecfapservice.getselectsupplierSearch(this.searchsupplier, 1)
  //     .subscribe(result => {
  //       if (result['data']?.length > 0) {
  //         this.selectsupplierlist = result['data']
  //         if (this.searchsupplier?.gstno?.length === 15 || this.searchsupplier?.panno?.length === 10) {
  //           let supplierdata = {
  //             "id": this.selectsupplierlist[0]?.id,
  //             "name": this.selectsupplierlist[0]?.name
  //           }
  //           this.supplierid = supplierdata?.id
  //           this.SelectSupplierForm.patchValue({ name: supplierdata })
  //           this.getsuppView(supplierdata)
  //         }
  //       }
  //     }, error => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     })
  // }

  Testingfunctionalternate() {
    this.searchsupplier = this.SelectSupplierForm.value;
    this.ecfapservice.getselectsupplierSearch(this.suppliers, 1)
      .subscribe(result => {
        if (result['data']?.length == 0) {
          if (this.suppliers.code != '' && this.suppliers.code != undefined && this.suppliers.code != null)
            this.notification.showError("Enter Valid Supplier Code.")
          if (this.suppliers.gstno != '' && this.suppliers.gstno != undefined && this.suppliers.gstno != null)
            this.notification.showError("Enter Valid GST Number.")
          if (this.suppliers.panno != '' && this.suppliers.panno != undefined && this.suppliers.panno != null)
            this.notification.showError("Enter Valid PAN Number.")
          this.dataclear('')
          return false;
        }
        if (result['data']?.length > 0) {
          this.selectsupplierlist = result['data']
          this.supplierlists = result['data']
          console.log("selecteddata===========>", this.supplierlists)
          this.choosesupplierfield1 = {
            label: "Choose Supplier",
            method: "get",
            url: this.ecfmodelurl + "venserv/search_supplierdetails_ecf",
            params: '&code=' + this.suppliers.code + '&panno=' + this.suppliers.panno + '&gstno=' + this.suppliers.gstno,
            displaykey: "name",
            formcontrolname: 'name',
            searchkey: "query",
            wholedata: true,
            required: true,
            id: "create-ecf-0126"
          }
          // console.log("this.searchsupplier?.gstno?.length",this.searchsupplier?.gstno?.length)
          let supplierdatass = {
            id: this.supplierlists[0].id,
            name: this.supplierlists[0].name,
          };
          this.suppliersearchs = supplierdatass
          if (this.searchsupplier?.gstno?.length == 15 || this.searchsupplier?.panno?.length == 10) {
            let supplierdata = {
              "id": this.selectsupplierlist[0]?.id,
              "name": this.selectsupplierlist[0]?.name
            }
            this.supplierid = supplierdata?.id
            this.SelectSupplierForm.patchValue({ name: supplierdata })
            this.getsuppView(supplierdata)
          } else {
            let supplierdata = {
              "id": this.selectsupplierlist[0]?.id,
              "name": this.selectsupplierlist[0]?.name
            }
            this.supplierid = supplierdatass?.id
            this.SelectSupplierForm.patchValue({ name: supplierdatass })
            this.getsuppView(supplierdatass)
          }
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  // dataclear() {
  //   this.SelectSupplierForm.controls['gstno'].reset("")
  //   this.SelectSupplierForm.controls['code'].reset("")
  //   this.SelectSupplierForm.controls['panno'].reset("")
  //   this.SelectSupplierForm.controls['name'].reset("")
  //   this.SupplierName = "";
  //   this.SupplierCode = "";
  //   this.SupplierGSTNumber = "";
  //   this.SupplierPANNumber = "";
  //   this.Address = "";
  //   this.line1 = "";
  //   this.line2 = "";
  //   this.line3 = "";
  //   this.City = "";
  //   this.suplist = "";
  //   this.JsonArray = [];
  //   this.alternate = false
  //   this.default = true
  //   this.submitbutton = false;
  // }
    dataclear(e) {
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
      this.JsonArray = [];
      this.alternate = false
      this.default = true
      this.submitbutton = false;
    }
  getsuppdd() {
    let suppliername: String = "";
    this.getsuppliername(this.suplist, suppliername);
    this.SelectSupplierForm.get('name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfapservice.getsuppliernamescroll(this.suplist, value, 1, 1)
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
      })
    this.getsuppliername(this.suplist, "");

  }

  public displaytest(SupplierName?: SupplierName): string | undefined {
    return SupplierName ? SupplierName.name : undefined;
  }
  public displayFn(Suppliertype?: SupplierName): string | undefined {
    return Suppliertype ? Suppliertype.name : undefined;
  }
  get Suppliertype() {
    return this.SelectSupplierForm.get('name');
  }
  getsuppliername(id, suppliername) {
    this.ecfapservice.getsuppliername(id, suppliername, 1)
      .subscribe((results) => {
        if (results) {
          let datas = results["data"];
          this.supplierNameData = datas;
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  supplierScroll() {
    setTimeout(() => {
      if (
        this.matsupAutocomplete &&
        this.matsupAutocomplete &&
        this.matsupAutocomplete.panel
      ) {
        fromEvent(this.matsupAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsupAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsupAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsupAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsupAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfapservice.getsuppliernamescroll(this.suplist, this.suppInput.nativeElement.value, 1, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.supplierNameData.length >= 0) {
                      this.supplierNameData = this.supplierNameData.concat(datas);
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
  branchgstnumber: any
  GSTType: any
  inputSUPPLIERStateid: any
  inputSUPPLIERgst: any
  StateID: any

  Branchcallingfunction() {
    // this.ecfapservice.GetbranchgstnumberGSTtype(this.supplierid,'')
    //   .subscribe((results) => {
    //     let datas = results;
    //     this.branchgstnumber = datas.Branchgst
    //     this.GSTType = datas.Gsttype
    //     // console.log("GST type", this.GSTType)
    //     // console.log("branchgst number", this.branchgstnumber)
    //   })
    this.inputSUPPLIERValue = this.SupplierName;
    this.inputSUPPLIERStateid = this.StateID;
    this.inputSUPPLIERgst = this.SupplierGSTNumber;
  }
  podetails() {
    let group = new FormGroup({
      id: new FormControl(''),
      product_name: new FormControl(''),
      grn_code: new FormControl(''),
      uom: new FormControl(''),
      unitprice: new FormControl(''),
      qty: new FormControl(''),
      qty_read: new FormControl(''),
      balance: new FormControl(''),
      select: new FormControl(''),
      current_invoice_qty: new FormControl(''),
      amt: new FormControl(''),
      po_num: new FormControl('')
    })
    return group
  }

  getpoSections(forms) {
    return forms.controls.poheader.controls;
  }


  poHeaderFormArray(): FormArray {
    return this.POInvoiceForm.get('poheader') as FormArray;
  }

  getpohdrrecords(datas) {
    for (let pohdr of datas?.data) {
      let id: FormControl = new FormControl('');
      let product_name: FormControl = new FormControl('');
      let grn_code: FormControl = new FormControl('');
      let uom: FormControl = new FormControl('');
      let unitprice: FormControl = new FormControl('');
      let qty: FormControl = new FormControl('');
      let qty_read: FormControl = new FormControl('');
      let balance: FormControl = new FormControl('');
      let select: FormControl = new FormControl('');
      let current_invoice_qty: FormControl = new FormControl('');
      let amt: FormControl = new FormControl('');
      let po_num: FormControl = new FormControl('');

      id.setValue(pohdr?.podetails_id?.id)
      product_name.setValue(pohdr?.podetails_id?.product_name)
      grn_code.setValue(pohdr?.inwardheader?.code)
      uom.setValue(pohdr?.podetails_id?.uom)
      unitprice.setValue(pohdr?.podetails_id?.unitprice)
      qty.setValue(pohdr?.grn_quantity)
      qty_read.setValue(pohdr?.paidqty)
      balance.setValue(pohdr?.balance_quantity)
      select.setValue("")
      current_invoice_qty.setValue("")
      amt.setValue(pohdr?.podetails_id?.amount)
      po_num.setValue(pohdr?.poheader?.no)
      this.poHeaderFormArray().push(new FormGroup({
        id: id,
        product_name: product_name,
        grn_code: grn_code,
        uom: uom,
        unitprice: unitprice,
        qty: qty,
        qty_read: qty_read,
        balance: balance,
        select: select,
        current_invoice_qty: current_invoice_qty,
        amt: amt,
        po_num: po_num
      }))
    }
  }

  cancel() {
    this.onCancel.emit()
  }

  only_numalpha(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  selectionArray = []
  onselectionchange(e, list, i) {
    list.select = true
    if (e.checked == true) {
      if (list?.value?.current_invoice_qty == "") {
        this.notification.showError("Please Enter Current Invoice Qty Read")
        list.select = false
        return false
      }
      else if (Number(list?.value?.current_invoice_qty) > Number(list?.value?.balance)) {
        this.notification.showError("Balance Quantity Exceeds")
        list.select = false
        this.POInvoiceForm.get('poheader')['controls'][i].get('current_invoice_qty').setValue("")
        return false
      } else {
        this.selectionArray.push(list?.value)
      }

    }
  }

  delete(ind, lists) {
    this.selectionArray.splice(ind, 1)
  }
  selectentry(value: string): void {
    this.selectedEntry = value;
    if (this.selectedEntry === 'E') {
      this.showforecf = true;
      this.showforpo = false;
    }
    else if (this.selectedEntry === 'P') {
      this.showforecf = false;
      this.showforpo = true;
    }
  }
  validateEcfNo(event: any): void {
  const inputValue = event.target.value;

  if (inputValue && inputValue.length >= 2) {
    const firstTwo = inputValue.substring(0, 2).toLowerCase();
    if (firstTwo === 'po') {
      this.ecfSearchForm.get('ecf_no').setValue('');
      this.notification.showError('PO number is not allowed for ECF Entry.');
      event.preventDefault();
    }
  }
}

  uplimage: any[] = []
  uploadList: any;

  fileupload(event) {
    // const allowedTypes = ["image/jpeg", "image/jpg"];
    // const maxSizeInBytes = 2 * 1024 * 1024
    let imagesList = [];
    for (var i = 0; i < event.target.files.length; i++) {
      // if(event.target.files[i].size > maxSizeInBytes)
      // {
      //   this.notification.showError("File size exceeds the maximum limit of 2 MB.")
      //   return false
      // }
      // if (!allowedTypes.includes(event.target.files[i].type)) {
      //   this.notification.showError("Please Upload JPG or JPEG File Only");
      //   return false;
      // }
      this.uplimage.push(event.target.files[i]);
      this.POMakerForm?.value?.filevalue?.push(event.target.files[i])


    }

    this.InputVars.nativeElement.value = '';
    imagesList.push(this.uplimage);
    this.uploadList = [];
    imagesList.forEach((item) => {
      let s = item;
      s.forEach((it) => {
        let io = it.name;
        this.uploadList.push(io);
      });
    });

  }

  Raiserlist: any;
  has_nextemp = true;
  has_previousemp = true;
  currentpageemp: number = 1;
  getraiserdropdown() {
    this.getemployee('');
    this.POMakerForm.get('employee').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.ecfapservice.getrmscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Raiserlist = datas;
      })



  }

  public displayFnraiserrole(raisertyperole?: raiserlists): string | undefined {
    return raisertyperole ? raisertyperole.full_name : undefined;
  }

  getemployee(value) {
    this.ecfapservice.getrmcode(value)
      .subscribe(results => {
        if (results) {
          let datas = results["data"];
          this.Raiserlist = datas;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide()
      })
  }

  raiserScroll() {
    setTimeout(() => {
      if (
        this.matempraiserAutocomplete &&
        this.matempraiserAutocomplete &&
        this.matempraiserAutocomplete.panel
      ) {
        fromEvent(this.matempraiserAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matempraiserAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matempraiserAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matempraiserAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matempraiserAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextemp === true) {
                this.ecfapservice.getrmscroll(this.raiserInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Raiserlist.length >= 0) {
                      this.Raiserlist = this.Raiserlist.concat(datas);
                      this.has_nextemp = datapagination.has_next;
                      this.has_previousemp = datapagination.has_previous;
                      this.currentpageemp = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  getEmpCode() {
    let emp = this.POMakerForm.value.employee.full_name
    let splitcode = emp.substring(emp.indexOf('('), emp.indexOf(')'))
  }
  getRaiserbranch() {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.POMakerForm.get('branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.ecfapservice.getbranchscroll(typeof (value) == 'object' ? value.code : value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
      })
  }
  branchdropdown(branchkeyvalue) {
    this.ecfapservice.getbranch(branchkeyvalue)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.Branchlist = datas;
        }

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }
  branchScroll() {
    setTimeout(() => {
      if (
        this.matbranchAutocomplete &&
        this.matbranchAutocomplete &&
        this.matbranchAutocomplete.panel
      ) {
        fromEvent(this.matbranchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbranchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfapservice.getbranchscroll(this.branchInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Branchlist.length >= 0) {
                      this.Branchlist = this.Branchlist.concat(datas);
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

  getBranchGst() {
    if (typeof (this.POMakerForm.value.branch) == 'object') {
      this.POMakerForm.controls['branch_gstno'].setValue(this.POMakerForm.value.branch.gstin)
    }
    else {
      this.notification.showError('Please choose Raiser Branch')
    }
  }
  // get branchtype() {
  //   return this.bounceForm.get('branch_id');
  // }
  public displayFnbranchrole(branchtyperole?: branchListss): string | undefined {
    return branchtyperole ? +branchtyperole.code + "-" + branchtyperole.name : undefined;
  }

  raiseBranchScroll() {
    setTimeout(() => {
      if (
        this.matraiserAutocomplete &&
        this.matraiserAutocomplete &&
        this.matraiserAutocomplete.panel
      ) {
        fromEvent(this.matraiserAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matraiserAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matraiserAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matraiserAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matraiserAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfapservice.getbranchscroll(this.raiserbrInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Branchlist.length >= 0) {
                      this.Branchlist = this.Branchlist.concat(datas);
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

  PODetails: any = []
  commodity_code: any
  getponoDetails() {
    this.PODetails = []
    let pono: any = this.POMakerForm.value.po_number
    if (pono == '') {
      this.notification.showError("Please Enter PO No")
      return false
    }
    pono = { "po_no": pono }
    this.ecfapservice.getpodetails(pono).subscribe(result => {
      console.log("docresult", result)
      if (result['data'] != undefined) {
        this.PODetails = result['data']
        if (this.PODetails.length == 0) {
          this.notification.showError('Invalid already raised for this PO')
          this.POMakerForm.controls['po_number'].reset()
          return false
        }
        this.supplierid =this.PODetails[0].poheader.supplierbranch_id
        this.ecfapservice.getCommodity(this.PODetails[0]?.poheader?.commodity_id).subscribe(result => {
          this.commodity_code = result?.code
        })
        this.getposuppView(this.supplierid)
      }
      else {
        this.notification.showError('Invalid PO Number')
        this.POMakerForm.controls['po_number'].reset()

      }
    })

  }

  poECFNo: any
  POHeaderResult: any
  formData: FormData = new FormData();
  POSaved = false
  createPOInvoice() {
 let poform =this.POMakerForm.value

    if(poform.supplier_name == undefined || poform.supplier_name == null || poform.supplier_name == ''){
      this.notification.showError("Please choose Supplier")
      return false
    }
    if(poform.invoice_date == ''){
      this.notification.showError("Please choose Invoice Date")
      return false
    }
    if(poform.invoice_no == ''){
      this.notification.showError("Please Enter Invoice No.")
      return false
    }
    if(poform.amount == ''){
      this.notification.showError("Please Enter Invoice Amount")
      return false
    }
    if(poform.taxableamount == ''){
      this.notification.showError("Please Enter Taxable Amount")
      return false
    }
    if(poform.is_gst == true){
      if(poform.amount ==poform.taxableamount){
      this.notification.showError("Invoice Amount and Taxable Amount Should not be same for GST Applicable Yes")
      return false
      }
      if(poform.amount <=poform.taxableamount){
      this.notification.showError("Invoice Amount should be greater than Taxable Amount for GST Applicable Yes")
      return false
      }
    }
    if(poform.is_gst == false){
      if(poform.amount !=poform.taxableamount){
      this.notification.showError("Invoice Amount and Taxable Amount Should be same for GST Applicable No")
      return false
      }
    }
    if(typeof(poform.employee) != 'object'){
      this.notification.showError("Please choose Raiser")
      return false
    }
    if(poform.branch == undefined || poform.branch == null || poform.branch == ''){
      this.notification.showError("Please choose Raiser Branch")
      return false
    }
    if(poform.po_number == ''){
      this.notification.showError("Please Enter PO Number")
      return false
    }
    if(poform.is_original_invoice == ''){
      this.notification.showError("Please select Is Original Document")
      return false
    }
    if(poform?.uploadedFiles?.length === 0){
      this.notification.showError("Please Select File")
      return false
    }
    let emp = poform.employee.full_name
    let empcode =emp.substring(emp.indexOf('(')+1, emp.indexOf(')'))

  // build file_key dynamically
  const selectedFileKeys = Object.keys(this.file_process_data)
    .filter(key => this.file_process_data[key] && this.file_process_data[key].length > 0);
    console.log("selectedFileKeys---->", selectedFileKeys)
  let input = [{
    "InvoiceHeaders": [
      {
        "Credit": 1,
        "Invoicedetails": 1,
        "branchdetails_code": poform.branch.code,
        "creditbank_id": 2,
        "dedupinvoiceno": "0",
        "entry_flag": false,
        // "file_key": selectedFileKeys,   //dynamic keys here
        "file_key":["Invoice", "Email", "Supporting Documents", "Others"],
        "file_data": 1,
        "invoiceamount": Number(poform.taxableamount),
        "invoicedate": this.datePipe.transform(poform.invoice_date, 'yyyy-MM-dd'),
        "invoicegst": poform.is_gst == true ? 'Y' : 'N',
        "invoiceno": poform.invoice_no,
        "invtotalamt": Number(poform.amount),
        "inward_flag": true,
        "otheramount": 0,
        "raisorbranchgst": "33AAACT3373J1ZD",
        "remarks": poform.remarks,
        "roundoffamt": 0,
        "supplier_code": this.SupplierCode,
        "suppliergst": poform.supplier_gst,
        "supplierstate_code": this.statecode,
        "taxamount": Number((poform.amount - poform.taxableamount).toFixed(2)),
        "totalamount": Number(poform.amount),
        "po_no": poform.po_number,
        "is_originalinvoice": poform.is_original_invoice
      }
    ],
    "apamount": Number(poform.amount),
    "apdate": this.datePipe.transform(poform.invoice_date, 'yyyy-MM-dd'),
    "approvedby_code": empcode,
    "aptype": 1,
    "branch_code": poform.branch.code,
    "commodity_code": this.commodity_code,
    "inv_count": 1,
    "inwarddetails_id": 1,
    "is_autoinward": false,
    "is_originalinvoice": poform.is_original_invoice,
    "module": 4,
    "payto": "S",
    "ppx": "S",
    "processed_count": 1,
    "raised_by_code": empcode,
    "raiser_branch_code": poform.branch.code,
    "raiser_name": poform.employee.full_name,
    "remark": poform.remarks,
    "supplier_type": 1
  }];

  this.formData = new FormData();

  // 🔥 append files by type
  for (let type of selectedFileKeys) {
    for (let file of this.file_process_data[type]) {
      this.formData.append(type, file);  // key = type ("Invoice", "Email"...)
    }
  }

  this.formData.append('data', JSON.stringify(input));

  this.SpinnerService.show();
  this.ecfapservice.POinvoiceCreate(this.formData).subscribe(result => {
      if (result['message'] == 'success') {
        this.poECFNo = result['crno']
        this.POHeaderResult = result
        this.ecfSearchForm.controls['ecf_no'].setValue(this.poECFNo)


        let is_originalinvoice: FormControl = new FormControl('');
        let invoiceheader_id: FormControl = new FormControl('');
        let inwarddetails_id: FormControl = new FormControl('');
        let InvhdrArray
        is_originalinvoice.setValue(poform.is_original_invoice),
          invoiceheader_id.setValue(result.apinvoiceheader[0].id),
          inwarddetails_id.setValue(this.fulldataslist?.id)
        InvhdrArray = [{
          is_originalinvoice: is_originalinvoice.value,
          invoiceheader_id: invoiceheader_id.value,
          inwarddetails_id: inwarddetails_id.value
        }]

        console.log("InvhdrFormArray", InvhdrArray)

        let dataset = {
          "id": this.fulldataslist.id,
          "pagecount": this.fulldataslist.pagecount,
          "packetno": this.fulldataslist.packetno,
          "doccount": this.fulldataslist.doccount,
          "receivedfrom": this.fulldataslist.receivedfrom,
          "docsubject": this.fulldataslist.docsubject,
          "doctype_id": 1,
          "remarks": this.fulldataslist.remarks,
          "ref_no": this.ecfSearchForm.value.ecf_no.trim(),
          "ref_date": this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
          "assigndept_id": 1,
          "assignemployee_id": 1,
          "actiontype": 1,
          "tenor": 0,
          "docaction": 1,
          "assignremarks": this.fulldataslist.remarks,
          "inwardheader_id": this.fulldataslist.inwardheader_id,
          "docnumber": this.fulldataslist.docnumber
        }
        this.ecfapservice.inwardDetailsViewUploadmicro2(dataset).subscribe(result => {
          console.log("testres", result)
          if (result?.id != undefined) {
            this.notification.showSuccess("Saved Successfully")
            this.length_ecf += 1
            this.invhdrsaved = true
            let invupdate = { "inward_datalist": InvhdrArray }
            this.ecfapservice.originalinvsave(invupdate).subscribe(result => {
              console.log("updateres", result)
              if (result?.status == "success") {

              }
            })

            this.ecfapservice.getdocdata(this.fulldataslist?.docnumber, 1).subscribe(result => {
              console.log("docresult", result)
              this.SpinnerService.hide()
              this.ECFDataList = result['data']
              this.length_ecf = result['pagination']?.count
              console.log("ECFDataList", this.ECFDataList)
              this.showfrontdata = false
              this.ecfSearchForm.controls['ecf_no'].reset("")
              let invhdrdatas = this.InvoiceHeaderForm.get('invoiceheader') as FormArray
              invhdrdatas.clear()
              this.backtoinward()
              // this.onSubmit.emit()
              this.ecfcrno = ""
              this.createlength_ecf = 0
              this.invoiceheaderrescount = 0
            })
            this.POSaved = true
          } else {
            this.POSaved = false
            this.SpinnerService.hide()
            this.notification.showError(result?.description)
            return false
          }

        })

      }
      else{
        this.notification.showError(result?.description)
        this.SpinnerService.hide()
      }
    })


  }
  invoicesearch: any = [
    { "type": "input", "label": "Branch", "formvalue": "branch", id: "ecfview-0035" },
    { "type": "input", "label": "Invoice No", "formvalue": "inv_no", id: "ecfview-0036" },
    { "type": "input", "label": "Invoice Date", "formvalue": "inv_date", id: "ecfview-0037" },
    { "type": "input", "label": "Invoice Amount", "formvalue": "apamount", id: "ecfview-0038" },

  ]
  popupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ecfview-0006"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  invflag(inwardfg) {
    let config: any = {
      value: '',
    };
    if (inwardfg?.inward_flag == true) {
      config = {
        value: inwardfg.is_originalinvoice.text,
      };
    }
    else if (inwardfg?.inward_flag == false) {
      config = {
        value: "",
      };
    }
    return config
  }
  Summaryecfentrydata: any = [
    { columnname: "InvoiceHeader No", key: "apinvoiceheader_crno" },
    { columnname: "Supplier Name", key: "supplier_id", type: "object", objkey: "name", },
    { columnname: "Raiser Name", key: "raisername" },
    { columnname: "Branch", key: "branchdetails_id", type: "object", objkey: "name", },
    { columnname: "Invoice Date", key: "invoicedate", "type": 'Date', "datetype": "dd-MMM-yyyy" },
    { columnname: "Invoice No", key: "invoiceno" },
    { columnname: "Invoice Amount", key: "totalamount", "prefix": "₹", "type": 'Amount' },
    {
      columnname: "Attachment",
      icon: "visibility", "style": { color: "green", cursor: "pointer" },
      button: true, function: true,
      clickfunction: this.showimg.bind(this),
    },
    {
      "columnname": "Physical Verification", "key": "",
      validate: true, validatefunction: this.invflag.bind(this)
    },

  ]
  popupopenview() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ecfview-0007"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }

    popupopen1() {
      var myModal = new (bootstrap as any).Modal(
        document.getElementById("ecfview-0011"),
        {
          backdrop: "static",
          keyboard: false,
        }
      );
      myModal.show();
    }

    suppliersearch: any = [
      { "type": "input", "label": "Supplier GST Number", "formvalue": "gstno", id: "create-ecf-0119" },
  
      { "type": "input", "label": "Supplier Code", "formvalue": "code", id: "create-ecf-0120" },
      { "type": "input", "label": "PAN Number", "formvalue": "panno", id: "create-ecf-0121" },
  
    ]
    ecfabs: any;
    choosesupplierdata(e) {
      this.ecfabs = e;
      console.log("event", e);
      this.getsuppView(this.ecfabs)
      // this.getsuppdd()
    }
    choosesupplierdata1(e) {
      this.ecfabs = e;
      console.log("event", e);
      this.getsuppView(this.ecfabs)
      // this.getsuppdd()
    }
  
    UploadPopupOpens(){
      this.popupopen2()

    }

    popupopen2(){
      var myModal = new (bootstrap as any).Modal(
        document.getElementById("fileUploaddpopup"),
        {
          backdrop: 'static',
          keyboard: false
        }
      );
      myModal.show();
    }
  invdtladdonid: any
  file_process_data2: any = {};
  frmInvHdrDet: FormGroup
  getFileDetails(e, filetype) {
    this.valid_arr = []
    console.log('befor   this.file_process_data2------------->>>>>>>>>>>', this.file_process_data2)

    for (var i = 0; i < e.target.files.length; i++) {
      this.valid_arr.push(e.target.files[i]);
    }
    if (this.file_process_data2[filetype] == undefined) {
      this.file_process_data2[filetype] = this.valid_arr;
    }
    else if (this.file_process_data2[filetype] != undefined) {
      if (this.file_process_data2[filetype].length == 0) {
        this.file_process_data2[filetype] = this.valid_arr;
      }
      else {
        let Files = this.file_process_data2[filetype]
        for (let file of this.valid_arr) {
          Files.push(file)
        }
        this.file_process_data2[filetype] = Files;
      }
    }
    for (let i = 0; i < this.uploadFileTypes.length; i++) {
      if (this.file_process_data2[this.uploadFileTypes[i]]?.length == 0)
        delete this.file_process_data2[this.uploadFileTypes[i]]
    }
    console.log('this.file_process_data2------------->>>>>>>>>>>', this.file_process_data2)
  }
  uploadPopShow = false
  readinvhdrdata = false
  showTempInvHdrForm = false
  fileUploaded = false
  fileUploadChk(): boolean{
    for(let i=0;i< this.uploadFileTypes.length; i++){
      if(this.file_process_data[this.uploadFileTypes[i]] != undefined ){
        if(this.file_process_data[this.uploadFileTypes[i]].length >0)
          return true
      }
    }
    return false
  }
  invhdrForm = ''
  uploadback() {
    this.file_process_data2 = {}
    // this.popupopen9()
    this.uploadPopShow = false
    this.closedbuttons.nativeElement.click()
    if (this.invhdrForm != 'frmInvHdrDet') {
      this.invHdrDetBack()
    }
    else {
      this.showTempInvHdrForm = true
    }
    this.fileUploaded = this.fileUploadChk()
  }
    invHdrDetBack() {
    // this.resetInvHdrTemp()
    if (this.showTempInvHdrForm) {
      this.file_process_data = {}
      this.closeInvHdrDet.nativeElement.click()
    }
    this.frmInvHdrDet.reset()
    this.showTempInvHdrForm = false
    // this.closeInvHdrDet.nativeElement.click()
  }
uploadSubmit() {
  let data;
  if (this.invdtladdonid != -1) {
    data = this.InvoiceHeaderForm.value.invoiceheader;
  } else {
    data = this.POMakerForm.value; // use your POMakerForm here
  }

  // Step 1: Merge temp uploaded files into form arrays
  Object.keys(this.file_process_data2).forEach(type => {
    const files = this.file_process_data2[type];

    for (let file of files) {
      if (this.invdtladdonid != -1) {
        (this.POMakerForm.get('filevalue') as FormArray).push(new FormControl(file));
        (this.POMakerForm.get('filedataas') as FormArray).push(new FormControl(file));
      } else {
        (this.POMakerForm.get('filevalue') as FormArray).push(new FormControl(file));
      }
    }
  });

  // Step 2: Handle file keys if needed
  if (Object.keys(this.file_process_data2).length > 0) {
    if (this.invdtladdonid != -1 && (this.POMakerForm.get('file_key') as FormArray).length < 1) {
      this.uploadFileTypes.forEach(type => {
        (this.POMakerForm.get('file_key') as FormArray).push(new FormControl(type));
      });
    }
  }

  // Step 3: Merge into global file_process_data
  if (!this.file_process_data) {
    this.file_process_data = {};
  }

  Object.keys(this.file_process_data2).forEach(type => {
    if (!this.file_process_data[type]) {
      this.file_process_data[type] = [];
    }
    this.file_process_data[type] = [
      ...this.file_process_data[type],
      ...this.file_process_data2[type]
    ];
  });

  // Step 4: Flatten and patch into uploadedFiles
  let allFiles: any[] = [];
  Object.keys(this.file_process_data).forEach(type => {
    allFiles = [...allFiles, ...this.file_process_data[type]];
  });

  this.POMakerForm.get('uploadedFiles')?.setValue(allFiles);
  this.POMakerForm.get('uploadedFiles')?.updateValueAndValidity();

  // Step 5: Cleanup and close modal
  this.file_process_data2 = {};
  this.uploadclose.nativeElement.click();
  this.closedbuttons.nativeElement.click();

  console.log('this.file_process_data -----> ', this.file_process_data);
  console.log('Uploaded files in FormGroup -----> ', this.POMakerForm.get('uploadedFiles')?.value);

  this.preparePagedFiles();
}

  SummaryApipreviouslyAttechedFilesObjNew: any;
  SummaryApiCurrentlyAttechedFilesObjNew: any;
  previousattachfile_summary() {
    this.SummaryApipreviouslyAttechedFilesObjNew = {
      FeSummary: true,
      data: this.filedatas
    }
  }
  viewfilepopupopen() {
      var myModal = new (bootstrap as any).Modal(
        document.getElementById("viewfilepopopen"),
        {
          backdrop: "static",
          keyboard: false,
        }
      );
      myModal.show();
  }
  getfiledetailss() {
    this.filedatas = this.POMakerForm.value['filekey']
    this.previousattachfile_summary()
    this.viewfilepopupopen()
  }

    SummarypreviousAttechedFiles: any = [
    { columnname: "Document Type", key: "document_type" },
    //   {columnname: "View", key: "view", icon: "open_in_new",
    //   "style": { color: "blue", cursor: "pointer" },
    //   button: true, function: true, clickfunction: this.data1.bind(this)
    // },
    { columnname: "File Name", key: "file_name",tooltip:true },
    // {
    //   columnname: "Download", key: "download", icon: "download",
    //   "style": { color: "blue", cursor: "pointer" },
    //   button: true, function: true, clickfunction: this.getfiles.bind(this)
    // },
    {
      columnname: "Action", key: "action", "tooltip": "View/Open",
      icon: "arrow_forward",
      style: { color: "blue", cursor: "pointer" },
      button: true,
      function: true,
      clickfunction: this.data1.bind(this),
    },
    {
      columnname: "Delete ", key: "delete", icon: "delete",
      "style": { color: "red", cursor: "pointer" },
      button: true, function: true, clickfunction: this.fileDeletes.bind(this)
    },]
  currentattachfile_summary(index) {
    this.SummaryApiCurrentlyAttechedFilesObjNew = {
      FeSummary: true,
      data: this.file_process_data["file" + index]
    }
  }

  previousCharCode: any = 0
  charCode: any = 0
  taxableamount: any
  selectedTemp: any
  getCharCode(e) {
    this.previousCharCode = this.charCode
    this.charCode = (e.which) ? e.which : e.keyCode;
  }
numberOnlyandDot(event, val): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if ((charCode < 46 || charCode > 57) || charCode === 47) {
    return false;
  }
  val = String(val ?? '').replace(/,/g, '');
  if (val.includes('.')) {
    const decimalPart = val.split('.')[1];
    if (decimalPart && decimalPart.length >= 2) {
      return false;
    }
  }
  if (+val > 9999999999) return false;
  return true;
}


  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
invhdrTempChngeToCurrency(ctrl, ctrlname) {
    if (this.charCode != 46 && !(this.previousCharCode == 46 && this.charCode == 48)) {
      let a = ctrl.value;
      a = a.replace(/,/g, "");
      if (a && !isNaN(+a)) {
        let num: number = +a;
        let temp = new Intl.NumberFormat("en-GB", { style: "decimal" }).format(num);
        temp = temp ? temp.toString() : '';
        this.POMakerForm.controls[ctrlname].setValue(temp)
      }
    }
  }
invamount(index: number, control: AbstractControl, form: FormGroup) {
  const invamount = Number(String(form.get('amount')?.value).replace(/,/g, ''));
  const gstappl = form.get('is_gst')?.value;

  if (!invamount || invamount <= 0) {
    this.notification.showWarning("Invoice amount should not be less than or equal to Zero");
    control.setValue(0);
  } else if (this.ecftypeid === 13 && gstappl === "N") {
    control.setValue(invamount); // Keep value same for GST "N"
  }
}

invhdramtDecimalChg(ctrlname: string, form: FormGroup, index?: number) {
  const control = form.get(ctrlname);
  if (!control) return;
  let raw = String(control.value).replace(/,/g, "");
  let amt =  parseFloat(raw);
  if (!isNaN(amt) && amt >= 0) {
    control.setValue(amt, { emitEvent: false });
    const input = document.querySelector<HTMLInputElement>(
      `[formControlName="${ctrlname}"]`
    );
    if (input) {
      input.value = new Intl.NumberFormat("en-GB", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amt);
    }
  }
}

taxableAmount(event: any, index: number, control: AbstractControl, form: FormGroup) {
  const invgst = form.get('is_gst')?.value;
  const totalAmount = Number(String(form.get('amount')?.value).replace(/,/g, ''));
  const invamount = Number(String(form.get('taxableamount')?.value).replace(/,/g, ''));

  if (invgst === false) return;

  if (invamount > 0) {
    if (invamount > totalAmount) {
      this.notification.showWarning("Taxable Amount should not be greater than Invoice Amount");
      form.get('taxableamount').setValue(0);
      return;
    }
    if (invgst === true && invamount === totalAmount) {
      this.notification.showWarning("Invoice Amount and Taxable Amount Should not be same for GST Applicable Yes");
      form.get('taxableamount').setValue(0);
      return;
    }
  }
}

taxableAmount1(index: number, control: AbstractControl, form: FormGroup) {
  const invgst = form.get('is_gst')?.value;
  const invamount =Number(String(form.get('taxableamount')?.value).replace(/,/g, ''));
  const totalAmount = Number(String(form.get('amount')?.value).replace(/,/g, ''));

  // if (invgst === false) return;

  if (invgst === false && invamount !== totalAmount) {
    this.notification.showWarning("Invoice amount and Taxable amount should be same if GST is not applicable");
    form.get('taxableamount').setValue(0);
  }
}


}

