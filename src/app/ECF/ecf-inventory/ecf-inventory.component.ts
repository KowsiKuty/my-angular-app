import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { EcfService } from '../ecf.service';
import { ShareService } from '../share.service';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';





export interface commoditylistss {
  id: string;
  name: string;
}

export interface approverListss {
  full_name: string;
  id: number;
  name: string
}
export interface branchListss {
  id: any;
  name: string;
  code: string;
  codename: string;

}

export interface hsnlistss {
  id: any;
  name: string;
  code: string;
}

export interface uomlistss {
  id: any;
  name: string;
  code: string;
}
export interface catlistss {
  id: any;
  name: string;
  code: any
}
export interface subcatlistss {
  id: any;
  name: string;
  code: string;
}
export interface bslistss {
  id: any;
  name: string;
  code: any
}
export interface cclistss {
  id: any;
  name: string;
  code: any
}


export interface SupplierName {
  id: number;
  name: string;
}

export interface taxtypefilterValue {
  id: number;
  subtax_type: string;
}

export interface paytofilterValue {
  id: string;
  text: string;
}
export interface ppxfilterValue {
  id: string;
  text: string;
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
  selector: 'app-ecf-inventory',
  templateUrl: './ecf-inventory.component.html',
  styleUrls: ['./ecf-inventory.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class EcfInventoryComponent implements OnInit {

  showheaderdata = true
  showinvocedetail = false

  ecfheaderForm: FormGroup
  TypeList: any
  commodityList: Array<commoditylistss>
  uploadList = [];
  images: string[] = [];
  @ViewChild('takeInput', { static: false })
  InputVar: ElementRef;
  ppxList: any
  advancetypeList: any
  payList: any
  isLoading = false;
  attachmentlist: any
  showppxmodal = false
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  showppx = false
  showpayto = false
  showsupptype = true
  showadvance = false
  showgstapply = false
  showgsttt = true
  SupptypeList: any
  ecfheaderid: any
  ecftypeid: any
  tomorrow = new Date();
  showviewinvoice = false
  showviewinvoices = false
  showeditinvhdrform = true
  showaddbtn = false
  showaddbtns = true
  disableecfsave = false
  invheadersave = false
  showadddebits = false
  showadddebit = true
  invdtlsave = false
  showdebitpopup = true
  showtaxtypes = [true, true, true, true, true, true, true, true, true]
  showtaxrates = [true, true, true, true, true, true, true, true, true]
  showaddinvheader = false
  hideinv = false
  showgstaplicable = true


  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild('commoditytype') matcommodityAutocomplete: MatAutocomplete;
  @ViewChild('commodityInput') commodityInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('fileInput', { static: false }) InputVars: ElementRef;
  @ViewChildren('fileInput') fileInput: QueryList<ElementRef>


  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]
  InvoiceHeaderForm: FormGroup
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
  Invoicedata: any
  date: any
  ecfid: any
  invoiceheaderid: any
  invoiceno: any
  invheaderdata: any
  invoiceheaderres: any
  ivoicehid: any
  @Output() linesChange = new EventEmitter<any>();
  @ViewChild('Suppliertype') matsupAutocomplete: MatAutocomplete;
  @ViewChild('suppInput') suppInput: any;
  SupplierName: any
  invheadertotal: any
  amt: any
  sum: any
  AddinvDetails = true
  delinvid: any
  getsuplist: any
  discreditbtn = false
  disabledebit = false

  disabledata = 1
  disableddata = 2



  Approverlist: Array<approverListss>;
  Branchlist: Array<branchListss>;
  SubmitoverallForm: FormGroup
  submitoverallbtn = false
  ECFData: any
  tdsList: any
  @ViewChild('branchtype') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild('approvertype') matappAutocomplete: MatAutocomplete;
  @ViewChild('approverInput') approverInput: any;



  invoiceheaderdetailForm: FormGroup
  InvoiceDetailForm: FormGroup
  hsnList: Array<hsnlistss>
  uomList: Array<uomlistss>
  @ViewChild('hsntype') mathsnAutocomplete: MatAutocomplete;
  @ViewChild('hsnInput') hsnInput: any;
  @ViewChild('uomtype') matuomAutocomplete: MatAutocomplete;
  @ViewChild('uomInput') uomInput: any;
  @ViewChild('taxtype') mattactypeAutocomplete: MatAutocomplete;
  @ViewChild('taxtypeInput') taxtypeInput: any;
  hsncodess: any
  totaltax: any
  invoicedetailsdata: any
  delinvdtlid: any
  ccbspercentage: any
  AdddebitDetails = true
  INVsum: any
  INVamt: any
  totalamount: any
  totaltaxable: any
  overalltotal: any
  type: any

  ecfheaderidd: any


  creditglForm: FormGroup
  accList: any
  showaccno = [false, false, false, false, false, false, false, false, false]
  creditbrnchList: any
  credittranList: any
  showtranspay = [false, false, false, false, false, false, false, false, false]
  showtaxtype = [false, false, false, false, false, false, false, false, false]
  showtaxrate = [false, false, false, false, false, false, false, false, false]
  showeraacc = [false, false, false, false, false, false, false, false, false]
  showglpopup = false
  glList: any
  taxlist: any
  taxratelist: any

  PaymodeList: any
  addcreditindex: any
  @ViewChild('closebutton') closebutton;
  @ViewChild('closebuttons') closebuttons;
  @ViewChild('closedbuttons') closedbuttons;



  @ViewChild('cattype') matcatAutocomplete: MatAutocomplete;
  @ViewChild('categoryInput') categoryInput: any;
  @ViewChild('subcategorytype') matsubcatAutocomplete: MatAutocomplete;
  @ViewChild('subcategoryInput') subcategoryInput: any;
  @ViewChild('bstype') matbsAutocomplete: MatAutocomplete;
  @ViewChild('bsInput') bsInput: any;
  @ViewChild('cctype') matccAutocomplete: MatAutocomplete;
  @ViewChild('ccInput') ccInput: any;
  DebitDetailForm: FormGroup
  ccbsdetailForm: FormGroup
  categoryNameData: Array<catlistss>;
  subcategoryNameData: Array<subcatlistss>;
  bsNameData: Array<bslistss>;
  ccNameData: Array<cclistss>;
  invheaderid: any
  catid: any
  bssid: any


  SGST = false
  CGST = false
  IGST = false
  invoicenumber: any
  value: any
  invtotamount: any
  invtaxamount: any
  invtaxableamount: any
  invdate: any
  invgst: any
  raisorbranchgst: any
  inputSUPPLIERgst: any

  SupplierDetailForm: FormGroup

  showsuppname = true
  showsuppgst = true
  showsuppstate = true

  filesHeader: FormGroup;


  showbranch = false
  showbranchdata = false
  branchrole: any
  branchroleid: any
  roledata: any
  invoicegst: any
  ecfstatusid: any
  ecfeditdata: any
  ecfstatusname: any
  ppxid: any
  fileList: any
  branchrolename: any
  paytoid: any
  // readdebitdata = false

  showsupppopup = true
  showtaxforgst = false






  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer, private datePipe: DatePipe,
    private ecfservice: EcfService, private shareservice: ShareService, private notification: NotificationService,
    private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    let data = this.shareservice.ecfheaderedit.value
    this.ecfheaderidd = data

    this.ecfheaderForm = this.fb.group({
      supplier_type: ['', Validators.required],
      commodity_id: ['', Validators.required],
      ecftype: ['', Validators.required],
      ecfdate: new Date(),
      ecfamount: ['', Validators.required],
      ppx: ['', Validators.required],
      notename: ['', Validators.required],
      remark: ['', Validators.required],
      payto: ['', Validators.required],
      advancetype: [''],
      ppxno: [''],
      branch: ['', Validators.required]

    })

    this.InvoiceHeaderForm = this.fb.group({
      branch_id: [''],
      invtotalamt: [''],
      ecfheader_id: [''],
      dedupinvoiceno: [''],
      suppliergst: [''],
      raisorbranchgst: [''],
      invoicegst: [''],


      invoiceheader: new FormArray([
        // this.INVheader(),


      ]),

    })
    this.SelectSupplierForm = this.fb.group({
      gstno: [''],
      code: [''],
      panno: [''],
      name: ['']

    })

    this.SubmitoverallForm = this.fb.group({
      approver_branch: [''],
      approvedby_id: [''],
      tds: [''],

    })

    this.invoiceheaderdetailForm = this.fb.group({
      raisorcode: [''],
      raisorname: [''],
      transbranch: [''],
      gst: [''],
      suppcode: [''],
      suppbranch: [''],
      suppname: [''],
      suppgstno: [''],
      invoiceno: [''],
      invoicedate: [''],
      taxableamt: [''],
      invoiceamt: [''],
      taxamount: ['']

    })

    this.InvoiceDetailForm = this.fb.group({

      invoicedtl: new FormArray([
        // this.INVdetail(),
      ]),

      creditdtl: new FormArray([
        // this.creditdetails(),
      ])

    })

    this.DebitDetailForm = this.fb.group({

      debitdtl: new FormArray([
        // this.debitdetail()
      ]),


    })

    this.ccbsdetailForm = this.fb.group({

      ccbs: new FormArray([
        // this.ccbsdetail()
      ])
    })

    this.creditglForm = this.fb.group({
      name: [''],
      glnum: ['']

    })

    this.SupplierDetailForm = this.fb.group({
      invoiceno: [''],
      invoicedate: [''],
      supplier_name: [''],
      suppliergst: [''],
      pincode: ['']
    })



    this.getinvoicedetails();
    this.gettdsapplicable();
    this.getecftype();
    this.getbranchrole();
    this.getsuppliertype();
    this.getcommodity('');
    this.getPaymode();




    let commoditykeyvalue: String = "";
    this.getcommodity(commoditykeyvalue);
    this.ecfheaderForm.get('commodity_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.ecfservice.getcommodityscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.commodityList = datas;
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
        switchMap(value => this.ecfservice.getsuppliernamescroll(this.suplist, value, 1)
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

    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.SubmitoverallForm.get('approver_branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')

        }),

        switchMap(value => this.ecfservice.getbranchscroll(value, 1)
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
        // console.log("Branchlist", datas)
      })

    this.ecfheaderForm.get('branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')

        }),

        switchMap(value => this.ecfservice.getbranchscroll(value, 1)
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
        // console.log("Branchlist", datas)
      })




    let approverkeyvalue: String = "";
    this.approverdropdown(approverkeyvalue);
    this.SubmitoverallForm.get('approvedby_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')

        }),

        switchMap(value => this.ecfservice.getapproverscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Approverlist = datas;
        // console.log("Approverlist", datas)
      })





    this.ecfheaderForm.get('ppx').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.getppxdropdown()
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ppxList = datas;
      })




  }


  getpaytodropdown() {

    if (this.ecftypeid == 3) {

      this.ecfheaderForm.get('payto').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ecfservice.getpayto(this.ecftypeid)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.payList = datas;
        })
    }

  }

  getinvoicedetails() {
    if (this.ecfheaderidd != "" && this.ecfheaderidd != undefined && this.ecfheaderidd != null) {
      this.ecfservice.getinvoicedetailsummary(this.ecfheaderidd)
        .subscribe(result => {

          this.fileList = result['Invheader']
          // if (result['Invheader'].length === 0) {
          //   this.showaddinvheader = true
          // this.addSection() 

          // }
          this.showviewinvoice = true
          this.showviewinvoices = false
          this.showaddbtn = true
          this.showaddbtns = false
          this.showadddebit = false
          this.showadddebits = true
          this.showeditinvhdrform = false
          let datas = result
          this.ecfeditdata = datas
          this.ecftypeid = result.ecftype_id
          this.ecfstatusid = result.ecfstatus_id
          this.ecfstatusname = result.ecfstatus
          if (this.ecftypeid == 4) {
            this.ppxid = result.ppx_id.id
          }
          if (this.ecftypeid == 3) {
            this.paytoid = result.payto_id.id
          }



          for (let a of datas.Invheader) {
            this.type = a.gsttype
            this.getgstapplicable = a.invoicegst
            if (a?.invoicegst == 'Y') {
              this.showtaxforgst = true
            } else {
              this.showtaxforgst = false
            }

          }

          if (datas.ecftype_id == 3) {
            this.showpayto = true
            this.showsuppname = false
            this.showsuppgst = false
            this.showsuppstate = false
          }

          if (datas.ecftype_id == 4 && datas.ppx_id.id == 'E') {
            this.showppx = true
            this.showsuppname = false
            this.showsuppgst = false
            this.showsuppstate = false
            this.showgsttt = false
            this.showadvance = true
          }

          if (datas.ecftype_id == 4 && datas.ppx_id.id == 'S') {
            this.showppx = true
            this.showsuppname = true
            this.showsuppgst = true
            this.showsuppstate = true
            this.showgsttt = true
            this.showadvance = true
          }

          if (this.roledata == false) {
            this.branchrolename = datas.branch.name
          } else {
            this.branchrolename = datas.branch
          }


          this.ecfheaderForm.patchValue({
            supplier_type: datas.supplier_type_id,
            commodity_id: datas.commodity_id,
            ecftype: datas.ecftype_id,
            branch: this.branchrolename,
            ecfdate: datas.ecfdate,
            ecfamount: datas.ecfamount,
            ppx: datas.ppx_id,
            payto: datas.payto_id,
            notename: datas.notename,
            remark: datas.remark,

          })

          this.SubmitoverallForm.patchValue({
            tds: datas.tds.text,
            approver_branch: datas.data.approver_branch,
            approvedby_id: datas.data.approvername
          })
          this.getinvoicehdrrecords(result)

          this.InvoiceHeaderForm.patchValue({
            invoicegst: this.getgstapplicable
          })

        })
    }
    else {
      this.addSection()
    }

  }



  data(datas) {
    let id = datas.file_id
    this.ecfservice.downloadfile(id)
  }

  getfiles(data) {

    this.ecfservice.filesdownload(data.file_id)
      .subscribe((results) => {

        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = data.file_name;
        link.click();
      })
  }

  // fileDeletes(data, index: number) {
  //   let value = data.file_id
  //   this.ecfservice.deletefile(value)
  //     .subscribe(result => {
  //       this.notification.showSuccess("Deleted....")
  //       this.fileList.splice(index, 1);

  //     })

  // }

  viewinvheader() {
    let invdata = this.ecfheaderForm.value
    let ecfdates = this.datePipe.transform(invdata.ecfdate, 'yyyy-MM-dd')

    if (this.ecfeditdata.ecftype_id != invdata.ecftype) {
      this.notification.showInfo("Please save the changes you have done")
      return false
    }
    else if (this.ecfeditdata.supplier_type_id != invdata.supplier_type) {
      this.notification.showInfo("Please save the changes you have done")
      return false
    }
    else if (this.ecfeditdata.commodity_id.id != invdata.commodity_id.id) {
      this.notification.showInfo("Please save the changes you have done")
      return false
    }
    else if (this.ecfeditdata.ecfdate != ecfdates) {
      this.notification.showInfo("Please save the changes you have done")
      return false
    }
    else if (this.ecfeditdata.ecfamount != invdata.ecfamount) {
      this.notification.showInfo("Please save the changes you have done")
      return false
    }
    else if (this.ecfeditdata.remark != invdata.remark) {
      this.notification.showInfo("Please save the changes you have done")
      return false
    }


    else {
      this.showeditinvhdrform = true
      this.disableecfsave = true

    }
  }

  viewinvheaders() {
    this.showeditinvhdrform = true
    this.disableecfsave = true
  }




  getinvoicehdrrecords(datas) {

    if (datas.Invheader.length == 0) {

      const control = <FormArray>this.InvoiceHeaderForm.get('invoiceheader');
      control.push(this.INVheader());

    }

    for (let invhdr of datas.Invheader) {
      let id: FormControl = new FormControl('');
      let suppname: FormControl = new FormControl('');
      let suppstate: FormControl = new FormControl('');
      let invoiceno: FormControl = new FormControl('');
      let invoicedate: FormControl = new FormControl('');
      let invoiceamount: FormControl = new FormControl('');
      let taxamount: FormControl = new FormControl('');
      let totalamount: FormControl = new FormControl('');
      let otheramount: FormControl = new FormControl('');
      let roundoffamt: FormControl = new FormControl('');
      let invtotalamt: FormControl = new FormControl('');
      let ecfheader_id: FormControl = new FormControl('');
      let dedupinvoiceno: FormControl = new FormControl('');
      let supplier_id: FormControl = new FormControl('');
      let suppliergst: FormControl = new FormControl('');
      let supplierstate_id: FormControl = new FormControl('');
      let raisorbranchgst: FormControl = new FormControl('');
      let invoicegst: FormControl = new FormControl('');
      let filevalue: FormArray = new FormArray([]);
      let file_key: FormArray = new FormArray([]);

      const InvHeaderFormArray = this.InvoiceHeaderForm.get("invoiceheader") as FormArray;

      id.setValue(invhdr.id)
      if (this.ecftypeid == 2 || this.ppxid == "S") {
        suppname.setValue(invhdr.supplier_id.name)
        supplierstate_id.setValue(invhdr.supplierstate_id.id)
        suppstate.setValue(invhdr.supplierstate_id.name)
        supplier_id.setValue(invhdr.supplier_id.id)
        suppliergst.setValue(invhdr.supplier_id.gstno)
      } else {
        suppname.setValue("")
        supplierstate_id.setValue("")
        supplier_id.setValue("")
        suppliergst.setValue("")
        suppstate.setValue("")
      }
      invoiceno.setValue(invhdr.invoiceno)
      invoicedate.setValue(invhdr.invoicedate)
      invoiceamount.setValue(invhdr.invoiceamount)
      taxamount.setValue(invhdr.taxamount)
      totalamount.setValue(invhdr.totalamount)
      otheramount.setValue(invhdr.otheramount)
      roundoffamt.setValue(invhdr.roundoffamt)
      invtotalamt.setValue("")
      dedupinvoiceno.setValue(invhdr.dedupinvoiceno)
      ecfheader_id.setValue(invhdr.ecfheader_id)
      raisorbranchgst.setValue(invhdr.raisorbranchgst)
      invoicegst.setValue(this.getgstapplicable)
      filevalue.setValue([])
      file_key.setValue([])



      InvHeaderFormArray.push(new FormGroup({
        id: id,
        suppname: suppname,
        suppstate: suppstate,
        invoiceno: invoiceno,
        invoicedate: invoicedate,
        invoiceamount: invoiceamount,
        taxamount: taxamount,
        totalamount: totalamount,
        otheramount: otheramount,
        roundoffamt: roundoffamt,
        invtotalamt: invtotalamt,
        dedupinvoiceno: dedupinvoiceno,
        ecfheader_id: ecfheader_id,
        supplier_id: supplier_id,
        suppliergst: suppliergst,
        supplierstate_id: supplierstate_id,
        raisorbranchgst: raisorbranchgst,
        invoicegst: invoicegst,
        filevalue: filevalue,
        file_key: file_key,
        filedataas: this.filefun(invhdr),
        filekey: this.filefun(invhdr)

      }))


      this.calchdrTotal(invoiceamount, taxamount, roundoffamt, otheramount, totalamount)

      invoiceamount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        this.calchdrTotal(invoiceamount, taxamount, roundoffamt, otheramount, totalamount)
        if (!this.InvoiceHeaderForm.valid) {
          return;
        }

        this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      }
      )

      taxamount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        this.calchdrTotal(invoiceamount, taxamount, roundoffamt, otheramount, totalamount)
        if (!this.InvoiceHeaderForm.valid) {
          return;
        }
        this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      }
      )

      roundoffamt.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        this.calchdrTotal(invoiceamount, taxamount, roundoffamt, otheramount, totalamount)
        if (!this.InvoiceHeaderForm.valid) {
          return;
        }

        this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      }
      )

      otheramount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        this.calchdrTotal(invoiceamount, taxamount, roundoffamt, otheramount, totalamount)
        if (!this.InvoiceHeaderForm.valid) {
          return;
        }

        this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      }
      )

    }

  }

  calchdrTotal(invoiceamount, taxamount, roundoffamt, otheramount, totalamount: FormControl) {

    let invAmount = Number(invoiceamount.value)
    let invtax = Number(taxamount.value)
    const Taxableamount = invAmount
    const Taxamount = invtax
    const RoundingOff = roundoffamt.value
    const Otheramount = otheramount.value

    let total = Taxableamount + Taxamount + RoundingOff
    this.invheadertotal = total - Otheramount
    totalamount.setValue((this.invheadertotal), { emitEvent: false });

    this.datasums();
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

  gettdsapplicable() {
    this.ecfservice.gettdsapplicability()
      .subscribe(result => {
        this.tdsList = result['data']
      })
  }
  public displayFnpayFilter(filterpaydata?: paytofilterValue): string | undefined {
    return filterpaydata ? filterpaydata.text : undefined;
  }
  get filterpaydata() {
    return this.ecfheaderForm.get('payto');
  }
  public displayFnppxFilter(filterppxdata?: ppxfilterValue): string | undefined {
    return filterppxdata ? filterppxdata.text : undefined;
  }
  get filterppxdata() {
    return this.ecfheaderForm.get('ppx');
  }


  getecftype() {
    this.ecfservice.getecftype()
      .subscribe(result => {
        this.TypeList = result["data"]

      })
  }

  getbranchrole() {
    this.ecfservice.getbranchrole()
      .subscribe(result => {
        this.roledata = result.enable_ddl
        if (this.roledata == false) {
          this.showbranch = false
          this.showbranchdata = true
          this.branchrole = result.branch_name
          this.branchroleid = result.id
          this.ecfheaderForm.patchValue({
            branch: this.branchrole
          })
          this.ecfheaderForm.controls['branch'].disable();
        } else {
          this.branchroleid = result.id
          this.branchrole = result.branch_name
          this.showbranch = true
          this.showbranchdata = false
          let datas = {
            "id": result.id,
            "code": result.code,
            "name": result.branch_name
          }
          this.ecfheaderForm.patchValue({
            branch: datas
          })
        }

      })
  }


  getecf(id) {
    this.ecftypeid = id
    let supprecord = {

      "id": 1,
      "text": "SINGLE"

    }
    if (id === 3) {
      this.showpayto = true
      this.getpaytype()
      this.ecfheaderForm.patchValue({
        supplier_type: supprecord.id
      })
      this.ecfheaderForm.controls['supplier_type'].disable();
    } else {
      this.showpayto = false
      this.showsupptype = true
    }
    if (id === 4) {
      this.showppx = true
      this.showadvance = true
      this.getppxtype()
      this.getadvancetype()
      this.ecfheaderForm.patchValue({
        supplier_type: supprecord.id
      })
      this.ecfheaderForm.controls['supplier_type'].disable();
    } else {
      this.showppx = false
      this.showadvance = false

    }
    if (id == 2) {
      this.ecfheaderForm.controls['supplier_type'].enable();
    }
  }

  getppxtype() {
    this.ecfservice.getppxdropdown()
      .subscribe(result => {
        this.ppxList = result["data"]

      })
  }

  getadvancetype() {

    this.ecfservice.getadvancetype()
      .subscribe(result => {
        this.advancetypeList = result["data"]

      })

  }

  getppx(data) {

    let id = data.id
    if (id == "E") {
      this.showsuppname = false
      this.showsuppgst = false
      this.showsuppstate = false
      this.showgsttt = false
    }
    if (id == "S") {
      this.showsuppname = true
      this.showsuppgst = true
      this.showsuppstate = true
      this.showgsttt = true
      this.showgstapply = true
    }


  }

  getpaytype() {
    this.ecfservice.getpayto(this.ecftypeid)
      .subscribe(result => {
        this.payList = result["data"]

      })
  }

  getsuppliertype() {
    this.ecfservice.getsuppliertype()
      .subscribe(result => {
        this.SupptypeList = result["data"]

      })
  }



  public displayFncommodity(commoditytype?: commoditylistss): string | undefined {
    return commoditytype ? commoditytype.name : undefined;
  }

  get commoditytype() {
    return this.ecfheaderForm.get('commodity_id');
  }

  getcommodity(commoditykeyvalue) {
    this.ecfservice.getcommodity(commoditykeyvalue)
      .subscribe(results => {
        let datas = results["data"];
        this.commodityList = datas;

      })
  }

  commodityScroll() {
    setTimeout(() => {
      if (
        this.matcommodityAutocomplete &&
        this.matcommodityAutocomplete &&
        this.matcommodityAutocomplete.panel
      ) {
        fromEvent(this.matcommodityAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcommodityAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcommodityAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcommodityAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcommodityAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservice.getcommodityscroll(this.commodityInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.commodityList.length >= 0) {
                      this.commodityList = this.commodityList.concat(datas);
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


  config: any = {
    airMode: false,
    tabDisable: true,
    popover: {
      table: [
        ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
        ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
      ],
      link: [['link', ['linkDialogShow', 'unlink']]],
      air: [
        [
          'font',
          [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'superscript',
            'subscript',
            'clear',
          ],
        ],
      ],
    },
    height: '200px',
    // uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
      [
        'font',
        [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'superscript',
          'subscript',
          'clear',
        ],
      ],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']],
    ],
    codeviewFilter: true,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true,
  };

  editorDisabled = false;

  get sanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.ecfheaderForm.get('html').value);
  }


  enableEditor() {
    this.editorDisabled = false;
  }

  disableEditor() {
    this.editorDisabled = true;
  }

  onBlur() {
    // console.log('Blur');
  }

  onDelete(file) {
    // console.log('Delete file', file.url);
  }

  summernoteInit(event) {
    // console.log(event);
  }
  onFileSelected(e) { }
  SupplierTypeID: any;

  SubmitForm() {

    const ECFHeader = this.ecfheaderForm.value
    ECFHeader.ecfdate = this.datePipe.transform(ECFHeader.ecfdate, 'yyyy-MM-dd');
    ECFHeader.commodity_id = this.ecfheaderForm.value.commodity_id.id
    if (this.roledata == true) {
      ECFHeader.branch = this.ecfheaderForm.value.branch.id
    } else {
      ECFHeader.branch = this.branchroleid
    }
    if (ECFHeader.branch == "" || ECFHeader.branch == undefined || ECFHeader.branch == null) {
      ECFHeader.branch = this.branchroleid
    }


    if (this.ecftypeid == 3) {
      ECFHeader.payto = this.ecfheaderForm.value.payto.id
      ECFHeader.supplier_type = 1

    } else {
      ECFHeader.payto = ""
    }
    if (this.ecftypeid == 4) {
      ECFHeader.ppx = this.ecfheaderForm.value.ppx.id
      ECFHeader.supplier_type = 1
    } else {
      ECFHeader.ppx = ""
    }



    if (ECFHeader.ecftype === "") {
      this.toastr.error('Please Select ECF Type');
      return false;
    }
    if (ECFHeader.commodity_id == undefined || ECFHeader.commodity_id <= 0) {
      this.toastr.error('Please Select Commodity Name');
      return false;
    }

    if (ECFHeader.ecfamount === "") {
      this.toastr.error('Please Enter ECF Amount');
      return false;
    }


    if (this.ecfstatusid === 2) {
      this.ecfservice.ecfmodification(ECFHeader, this.ecfheaderidd)
        .subscribe(result => {
          if (result.code != undefined) {
            this.notification.showError(result.description)
          }
          else {
            this.notification.showSuccess("Successfully ECF Header Saved")
            this.ecfheaderid = result.id
            this.ecftypeid = result.ecftype
            this.SupplierTypeID = result.supplier_type
            this.ppxid = result.ppx
            this.paytoid = result.payto
            this.disableecfsave = true
            this.showviewinvoice = false
            this.showviewinvoices = true
            if (this.ecftypeid === 3) {
              this.InvoiceHeaderForm.patchValue({
                invoicegst: "Y"
              })
              this.showsuppname = false
              this.showsuppgst = false
              this.showsuppstate = false
            }
            this.SupplierTypeID = result.supplier_type




          }

        })


    } else {
      if (this.ecfheaderidd != "") {
        this.ecfservice.editecfheader(ECFHeader, this.ecfheaderidd)
          .subscribe(result => {


            if (result.code != undefined) {
              this.notification.showError(result.description)
            }
            else {
              this.notification.showSuccess("Successfully ECF Header Saved")
              this.ecfheaderid = result.id
              this.ecftypeid = result.ecftype
              this.SupplierTypeID = result.supplier_type
              this.ppxid = result.ppx
              this.paytoid = result.payto
              this.disableecfsave = true
              this.showviewinvoice = false
              this.showviewinvoices = true
              if (this.ecftypeid === 3) {
                this.InvoiceHeaderForm.patchValue({
                  invoicegst: "Y"
                })
                this.showsuppname = false
                this.showsuppgst = false
                this.showsuppstate = false
              }






            }



          })
      }

      else {
        this.ecfservice.createecfheader(this.ecfheaderForm.value)
          .subscribe(result => {


            if (result.code != undefined) {
              this.notification.showError(result.description)
            }
            else {
              this.notification.showSuccess("Successfully ECF Header Saved")
              this.ecfheaderid = result.id
              this.ecftypeid = result.ecftype
              this.ppxid = result.ppx
              this.paytoid = result.payto
              if (this.ecftypeid === 3) {
                this.InvoiceHeaderForm.patchValue({
                  invoicegst: "Y"
                })
                this.showsuppname = false
                this.showsuppgst = false
                this.showsuppstate = false
              }
              this.SupplierTypeID = result.supplier_type
              this.disableecfsave = true


            }

          })
      }
    }

  }


  ecfreset() {
    this.ecfheaderForm.controls['ecftype'].reset(""),
      this.ecfheaderForm.controls['supplier_type'].reset(""),
      this.ecfheaderForm.controls['commodity_id'].reset(""),
      this.ecfheaderForm.controls['ecfamount'].reset(""),
      this.ecfheaderForm.controls['ppx'].reset(""),
      this.ecfheaderForm.controls['remark'].reset(""),
      this.ecfheaderForm.controls['payto'].reset(""),
      this.ecfheaderForm.controls['advance_type'].reset("")
    this.ecfheaderForm.controls['branch'].reset("")
  }
  // -----ECF HEADER ENDS------


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
    this.ecfservice.getsuppliername(id, suppliername)
      .subscribe((results) => {
        let datas = results["data"];
        this.supplierNameData = datas;

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
                this.ecfservice.getsuppliernamescroll(this.suplist, this.suppInput.nativeElement.value, this.currentpage + 1)
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

  getSections(forms) {
    return forms.controls.invoiceheader.controls;
  }

  addSection() {
    const control = <FormArray>this.InvoiceHeaderForm.get('invoiceheader');
    control.push(this.INVheader());

  }

  removeSection(i) {
    const control = <FormArray>this.InvoiceHeaderForm.get('invoiceheader');
    control.removeAt(i);
    this.datasums();
  }


  INVheader() {
    let group = new FormGroup({
      id: new FormControl(''),
      suppname: new FormControl(),
      suppstate: new FormControl(),
      invoiceno: new FormControl(),
      invoicedate: new FormControl(''),
      invoiceamount: new FormControl(0),
      taxamount: new FormControl(0),
      totalamount: new FormControl(0),
      otheramount: new FormControl(0),
      roundoffamt: new FormControl(0),
      invtotalamt: new FormControl(0),
      ecfheader_id: new FormControl(0),
      dedupinvoiceno: new FormControl(0),
      supplier_id: new FormControl(''),
      suppliergst: new FormControl(''),
      supplierstate_id: new FormControl(''),
      raisorbranchgst: new FormControl(''),
      invoicegst: new FormControl(''),
      filevalue: new FormArray([]),
      file_key: new FormArray([]),
      filedataas: new FormArray([]),

    })

    group.get('invoiceamount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      this.calcTotal(group)
      if (!this.InvoiceHeaderForm.valid) {
        return;
      }

      this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
    }
    )

    group.get('taxamount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      this.calcTotal(group)
      if (!this.InvoiceHeaderForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
    }
    )

    group.get('roundoffamt').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      this.calcTotal(group)
      if (!this.InvoiceHeaderForm.valid) {
        return;
      }

      this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
    }
    )

    group.get('otheramount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      this.calcTotal(group)
      if (!this.InvoiceHeaderForm.valid) {
        return;
      }

      this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
    }
    )
    return group


  }



  calcTotal(group: FormGroup) {
    const Taxableamount = +group.controls['invoiceamount'].value;
    const Taxamount = +group.controls['taxamount'].value;
    const RoundingOff = +group.controls['roundoffamt'].value;
    const Otheramount = +group.controls['otheramount'].value;
    let total = Taxableamount + Taxamount + RoundingOff
    this.invheadertotal = total - Otheramount
    group.controls['totalamount'].setValue((this.invheadertotal), { emitEvent: false });
    this.datasums();
  }

  datasums() {
    this.amt = this.InvoiceHeaderForm.value['invoiceheader'].map(x => x.totalamount);
    this.sum = this.amt.reduce((a, b) => a + b, 0);

  }
  showsupplierpan = false
  showsuppliercode = false
  statename: any
  successdata: any

  GSTstatus(data) {
    this.gstyesno = data.value
    if (data.value == "N") {
      this.showtaxforgst = false
      this.showsupppopup = true
      let data = this.InvoiceHeaderForm?.value?.invoiceheader
      for (let i = 0; i < data?.length; i++) {

      this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('suppname').reset()
      this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('suppstate').reset()
      this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('suppliergst').reset()
      this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('supplier_id').reset()
      this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('supplierstate_id').reset()
      }
      this.dataclear()
    }
    if (data.value == "Y") {
      this.showtaxforgst = true
      this.showsupppopup = true
      this.showsuppliercode = true
      this.showsupplierpan = true
      this.SelectSupplierForm.controls['code'].disable();
      this.SelectSupplierForm.controls['panno'].disable();
      this.SelectSupplierForm.controls['name'].disable();

    }

  }

  getsuppindex(ind) {
    this.supplierindex = ind
    let invoiceheaders = this.InvoiceHeaderForm?.value?.invoiceheader
    if (this.InvoiceHeaderForm?.value?.invoicegst == "" && this.ecftypeid != 4 || this.InvoiceHeaderForm?.value?.invoicegst == null && this.ecftypeid != 4 || this.InvoiceHeaderForm?.value?.invoicegst == undefined && this.ecftypeid != 4) {
      this.toastr.warning('', 'Please Choose GST Applicable Or Not', { timeOut: 1500 });
      this.showsupppopup = false
      return false
    }
    if (invoiceheaders[ind]?.suppname == null) {
      this.dataclear()
    }
  }

  getsuppView(data) {
    this.supplierid = data.id

    this.ecfservice.getsupplierView(data.id)
      .subscribe(result => {

        this.SupplierName = result.name
        this.SupplierCode = result.code
        this.SupplierGSTNumber = result.gstno
        this.SupplierPANNumber = result.panno
        this.Address = result.address_id
        this.line1 = result.address_id.line1
        this.line2 = result.address_id.line2
        this.line3 = result.address_id.line3
        this.City = result.address_id.city_id.name
        this.stateid = result.address_id.state_id.id
        this.statename = result.address_id.state_id.name


        this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppname').setValue(this.SupplierName)
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppliergst').setValue(this.SupplierGSTNumber)
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('supplier_id').setValue(this.supplierid)
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('supplierstate_id').setValue(this.stateid)
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppstate').setValue(this.statename)
        this.submitbutton = true;

      })
  }
  branchgstnumber: any
  Branchcallingfunction() {
    this.ecfservice.GetbranchgstnumberGSTtype(this.supplierid)
      .subscribe((results) => {
        let datas = results;
        this.branchgstnumber = datas.Branchgst
        this.type = datas.Gsttype
        // console.log("GST type", this.type)
        // console.log("branchgst number", this.branchgstnumber)
      })
  }

  SelectSuppliersearch() {
    let searchsupplier = this.SelectSupplierForm.value;
    if (searchsupplier.code === "" && searchsupplier.panno === "" && searchsupplier.gstno === "") {
      this.getsuppliername("", "");
    }
    else {
      this.SelectSupplierForm.controls['name'].enable();
      this.alternate = true;
      this.default = false;
      this.Testingfunctionalternate();
    }
  }

  Testingfunctionalternate() {
    let searchsupplier = this.SelectSupplierForm.value;
    this.ecfservice.getselectsupplierSearch(searchsupplier)
      .subscribe(result => {
        this.selectsupplierlist = result.data
        this.successdata = this.selectsupplierlist

      })
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
    this.JsonArray = [];
    this.alternate = false
    this.default = true
    this.submitbutton = false;
  }

  Taxvalue = 0
  headertaxableamount: any
  Taxamount(e) {
    let data = this.InvoiceHeaderForm?.value?.invoiceheader
    for (let i in data) {
      this.headertaxableamount = Number(data[i]?.invoiceamount)
    }
    if (e > this.headertaxableamount) {
      this.Taxvalue = 0
      this.toastr.warning("Tax Amount should not exceed taxable amount");
      return false
    }
   }

  numberOnlyandDot(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }


  submitinvoiceheader() {
    let ecfidd: any
    if (this.ecfheaderidd == "") {
      ecfidd = this.ecfheaderid
    } else {
      ecfidd = this.ecfheaderidd
    }

    if (ecfidd == undefined || ecfidd == null || ecfidd == "") {
      this.toastr.warning('', 'Create ECF Header First', { timeOut: 1500 });
      return false;
    }

    if (this.InvoiceHeaderForm.value.invoicegst === "" && this.ecftypeid != 4) {
      this.toastr.warning('', 'Please Choose GST Applicable Or Not', { timeOut: 1500 });
      return false;
    }

    const invoiceheaderdata = this.InvoiceHeaderForm.value.invoiceheader



    for (let i in invoiceheaderdata) {
      if ((invoiceheaderdata[i].suppname == '' && this.ecftypeid == 2) || (invoiceheaderdata[i].suppname == null && this.ecftypeid == 2) || (invoiceheaderdata[i].suppname == undefined && this.ecftypeid == 2)) {
        this.toastr.error('Please Choose Supplier Name');
        return false;
      }

      if ((invoiceheaderdata[i].invoiceno == '' && this.ecftypeid == 2) || (invoiceheaderdata[i].invoiceno == null && this.ecftypeid == 2) || (invoiceheaderdata[i].invoiceno == undefined && this.ecftypeid == 2)) {
        this.toastr.error('Please Enter Invoice Number');
        return false;
      }

      if ((invoiceheaderdata[i].invoicedate == '') || (invoiceheaderdata[i].invoicedate == null) || (invoiceheaderdata[i].invoicedate == undefined)) {
        this.toastr.error('Please Choose Invoice Date');
        return false;
      }

      if ((invoiceheaderdata[i].invoiceamount == '') || (invoiceheaderdata[i].invoiceamount == null) || (invoiceheaderdata[i].invoiceamount == undefined)) {
        this.toastr.error('Please Enter Taxable Amount');
        return false;
      }

      if (invoiceheaderdata[i].taxamount == 0 && this.InvoiceHeaderForm.value.invoicegst === 'Y' && this.ecftypeid != 3) {
        this.toastr.error('Please Enter Tax Amount');
        return false;
      }
      // if ((invoiceheaderdata[i].images == '') || (invoiceheaderdata[i].images == null) || (invoiceheaderdata[i].images == undefined)) {
      //   this.toastr.error('Please Upload File');
      //   return false;
      // }

      if (invoiceheaderdata[i].id === "") {
        delete invoiceheaderdata[i].id
      }
      if (this.ecfheaderid != undefined) {
        invoiceheaderdata[i].ecfheader_id = this.ecfheaderid
      } else {
        invoiceheaderdata[i].ecfheader_id = this.ecfheaderidd
      }
      invoiceheaderdata[i].invoicedate = this.datePipe.transform(invoiceheaderdata[i].invoicedate, 'yyyy-MM-dd');
      invoiceheaderdata[i].invoicegst = this.InvoiceHeaderForm.value.invoicegst
      invoiceheaderdata[i].invtotalamt = this.sum
      invoiceheaderdata[i].raisorbranchgst = this.branchgstnumber
      if (invoiceheaderdata[i].suppname == null) {
        invoiceheaderdata[i].suppname = ""
      }
      delete invoiceheaderdata[i].suppstate

    }


    if (this.ecfheaderForm.value.ecfamount < this.sum || this.ecfheaderForm.value.ecfamount > this.sum) {
      this.toastr.error('Check ECF Header Amount', 'Please Enter Valid Amount');
      return false;
    }

    this.Invoicedata = this.InvoiceHeaderForm?.value?.invoiceheader
    let reqData = this.Invoicedata
    for (let i = 0; i < reqData.length; i++) {
      let keyvalue = "file" + i
      let pairvalue = reqData[i]?.filevalue

      for (let fileindex in pairvalue) {
        this.formData.append(keyvalue, pairvalue[fileindex])
      }
    }
    this.formData.append('data', JSON.stringify(this.Invoicedata));

    if (this.ecfstatusid === 2) {
      this.ecfservice.createinvhdrmodification(this.formData)
        .subscribe(result => {
          if (result.code != undefined) {
            this.notification.showError(result.description)

          } else {
            this.invoiceheaderres = result.invoiceheader
            let data = this.InvoiceHeaderForm.value.invoiceheader
            for (let ind in data) {
              data[ind].id = this.invoiceheaderres[ind].id

            }
            console.log("hdrdata", data)
            this.notification.showSuccess("Successfully Invoice Header Saved!...")
            this.invheadersave = true
            this.showaddbtn = false
            this.showaddbtns = true
          }

        })

    } else {
      this.ecfservice.invoiceheadercreate(this.formData)
        .subscribe(result => {
          if (result.code != undefined) {
            this.notification.showError(result.description)

          } else {

            this.notification.showSuccess("Successfully Invoice Header Saved!...")
            this.invheadersave = true
            this.showaddbtn = false
            this.showaddbtns = true
            this.AddinvDetails = false
            this.invoiceheaderres = result.invoiceheader
            let data = this.InvoiceHeaderForm.value.invoiceheader
            for (let ind in data) {
              data[ind].id = this.invoiceheaderres[ind].id

            }
            console.log("hdrdata", data)

          }
        })
    }
  }

  deleteinvheader(section, ind) {

    this.delinvid = section.value.id

    if (this.delinvid != "") {
      var answer = window.confirm("Are you sure to delete?");
      if (answer) {
        this.ecfservice.invhdrdelete(this.delinvid)
          .subscribe(result => {
            if (result.status === "success") {
              this.notification.showSuccess("Deleted Successfully")
              this.removeSection(ind)
            } else {
              this.notification.showError(result.description)
              return false
            }
          })
      }
      else {
        return false;
      }

    } else {

      this.removeSection(ind)

    }

  }


  invoiceheaderaddonid: any
  invheadertotamount: any
  invheaderlist: any
  getinvoiceheaderresults: any
  getgstapplicable: any
  invdetail: any

  Addinvoice(section, data, index) {

    this.showheaderdata = false
    this.showinvocedetail = true
    let invdtldatas = this.InvoiceDetailForm.get('invoicedtl') as FormArray
    invdtldatas.clear()
    let crdtdtldatas = this.InvoiceDetailForm.get('creditdtl') as FormArray
    crdtdtldatas.clear()
    if (this.ecftypeid == 4) {
      let debitdtldatas = this.DebitDetailForm.get('debitdtl') as FormArray
      debitdtldatas.clear()
     }

      let sectiondatas = section.value
      this.invoiceheaderaddonid = sectiondatas.id
      this.invheadertotamount = sectiondatas.totalamount
      this.suppid = sectiondatas.supplier_id
      let invamount = Number(sectiondatas.invoiceamount)
      let roundamount = Number(sectiondatas.roundoffamt)
      this.taxableamount = invamount + roundamount
      this.totalamount = sectiondatas.totalamount
      this.invoiceno = sectiondatas.invoiceno
      this.getgstapplicable = sectiondatas.invoicegst


      this.invoiceheaderdetailForm.patchValue({
        raisorcode: sectiondatas.raisorbranchgst,
        raisorname: [''],
        transbranch: [''],
        gst: sectiondatas.invoicegst,
        suppcode: this.SupplierCode,
        suppbranch: this.City,
        suppname: sectiondatas.suppname,
        suppgstno: sectiondatas.suppliergst,
        invoiceno: sectiondatas.invoiceno,
        invoicedate: sectiondatas.invoicedate,
        taxableamt: sectiondatas.invoiceamount,
        invoiceamt: sectiondatas.totalamount,
        taxamount: sectiondatas.taxamount

      })

    




    if (this.invoiceheaderaddonid === "" || this.invoiceheaderaddonid === undefined || this.invoiceheaderaddonid === null) {
      this.toastr.warning('', 'Please Create Invoice Header First ', { timeOut: 1500 });
      this.showinvocedetail = false
      this.showheaderdata = true
      return false
    }
    this.ecfservice.getinvheaderdetails(this.invoiceheaderaddonid)
      .subscribe(results => {
        this.getinvoiceheaderresults = results




        if (this.ecftypeid != 4) {

          for (let a of results.invoicedtl) {
            this.totaltax = a.taxamount

            if (this.ecftypeid == 3) {
              this.SupplierDetailForm.patchValue({
                invoiceno: a.invoiceno,
                invoicedate: a.invoicedate,
                supplier_name: a.supplier_name,
                suppliergst: a.suppliergst,
                pincode: a.pincode
              })
            }

          }
        }



        if (results) {
          if (this.ecftypeid != 4) {
            this.getinvoicedtlrecords(results)
            this.getcreditrecords(results)
          } else {
            this.getdebitrecords(results)
            this.getcreditrecords(results)
          }




        }
      })



  }
  hsnindex: any
  getindex(index) {

    this.hsnindex = index

  }

  getinvoicedtlrecords(datas) {
    if (datas.invoicedtl.length === 0) {
      const control = <FormArray>this.InvoiceDetailForm.get('invoicedtl');
      control.push(this.INVdetail());

      // if (this.getgstapplicable === "N") {
      //   for (let i = 0; i < 30; i++) {

      //     this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('hsn').disable()
      //     this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('hsn_percentage').disable()
      //     this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('igst').disable()
      //     this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('cgst').disable()
      //     this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('sgst').disable()
      //     this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('taxamount').disable()
      //   }


      // }
    }
    for (let details of datas.invoicedtl) {

      let id: FormControl = new FormControl('');
      let dtltotalamt: FormControl = new FormControl('');
      let invoiceheader_id: FormControl = new FormControl('');
      let productname: FormControl = new FormControl('');
      let productcode: FormControl = new FormControl('');
      let invoice_po: FormControl = new FormControl('');
      let description: FormControl = new FormControl('');
      let hsn: FormControl = new FormControl('');
      let hsn_percentage: FormControl = new FormControl('');
      let uom: FormControl = new FormControl('');
      let unitprice: FormControl = new FormControl('');
      let quantity: FormControl = new FormControl('');
      let amount: FormControl = new FormControl('');
      let cgst: FormControl = new FormControl('');
      let sgst: FormControl = new FormControl('');
      let igst: FormControl = new FormControl('');
      let discount: FormControl = new FormControl('');
      let taxamount: FormControl = new FormControl('');
      let totalamount: FormControl = new FormControl('');


      const invdetFormArray = this.InvoiceDetailForm.get("invoicedtl") as FormArray;

      id.setValue(details.id)
      dtltotalamt.setValue(this.totalamount)
      invoiceheader_id.setValue(details.invoiceheader)
      productname.setValue(details.productname)
      productcode.setValue(details.productcode)
      invoice_po.setValue(details.invoice_po)
      description.setValue(details.description)
      if (details.hsn.code === "UNEXPECTED_ERROR") {
        hsn.setValue("")
      } else {
        hsn.setValue(details.hsn)
      }
      hsn_percentage.setValue(details.hsn_percentage)
      uom.setValue(details.uom)
      unitprice.setValue(details.unitprice)
      quantity.setValue(details.quantity)
      amount.setValue(details.amount)
      cgst.setValue(details.cgst)
      sgst.setValue(details.sgst)
      igst.setValue(details.igst)
      discount.setValue(0)
      taxamount.setValue(details.taxamount)
      totalamount.setValue(details.totalamount)

      invdetFormArray.push(new FormGroup({
        id: id,
        dtltotalamt: dtltotalamt,
        invoiceheader_id: invoiceheader_id,
        productname: productname,
        productcode: productcode,
        invoice_po: invoice_po,
        description: description,
        hsn: hsn,
        hsn_percentage: hsn_percentage,
        uom: uom,
        unitprice: unitprice,
        quantity: quantity,
        amount: amount,
        cgst: cgst,
        sgst: sgst,
        igst: igst,
        discount: discount,
        taxamount: taxamount,
        totalamount: totalamount

      }))

      hsn.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ecfservice.gethsnscroll(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
                if (value === "") {

                  this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('hsn_percentage').reset()
                  this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('cgst').reset(0)
                  this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('sgst').reset(0)
                  this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('igst').reset(0)
                  this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('taxamount').reset(0)
                  this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount)

                }
              }),

            )

          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.hsnList = datas;
          this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
        })

      uom.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ecfservice.uomscroll(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.uomList = datas;
          this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
        })

      this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount)


      unitprice.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {

        this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount)
        if (!this.InvoiceDetailForm.valid) {
          return;
        }

        this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
      }
      )

      quantity.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {

        this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount)
        if (!this.InvoiceDetailForm.valid) {
          return;
        }

        this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
      }
      )

      amount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount)
        if (!this.InvoiceDetailForm.valid) {
          return;
        }

        this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
      }
      )

      taxamount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount)
        if (!this.InvoiceDetailForm.valid) {
          return;
        }

        this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
      }
      )


      totalamount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {

        this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount)
        if (!this.InvoiceDetailForm.valid) {
          return;
        }

        this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
      }
      )

    }
  }

  getcreditrecords(datas) {
    if (datas.credit.length == 0) {
      const control = <FormArray>this.InvoiceDetailForm.get('creditdtl');
      control.push(this.creditdetails());
      this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('amount').setValue(this.totalamount)
      this.creditdatasums()

    }
    for (let data of datas.credit) {
      let id: FormControl = new FormControl('');
      let invoiceheader_id: FormControl = new FormControl('');
      let paymode_id: FormControl = new FormControl('');
      let creditbank_id: FormControl = new FormControl('');
      let suppliertax_id: FormControl = new FormControl('');
      let creditglno: FormControl = new FormControl('');

      let creditrefno: FormControl = new FormControl('');
      let suppliertaxtype: FormControl = new FormControl('');
      let suppliertaxrate: FormControl = new FormControl('');
      let taxexcempted: FormControl = new FormControl('');
      let amount: FormControl = new FormControl('');
      let taxableamount: FormControl = new FormControl('');
      let ddtranbranch: FormControl = new FormControl('');
      let credittotal: FormControl = new FormControl('');
      let ddpaybranch: FormControl = new FormControl('');
      let category_code: FormControl = new FormControl('');
      let subcategory_code: FormControl = new FormControl('');
      let bank: FormControl = new FormControl('');
      let branch: FormControl = new FormControl('');
      let ifsccode: FormControl = new FormControl('');
      let benificiary: FormControl = new FormControl('');
      let amountchange: FormControl = new FormControl('');
      const creditdetailformArray = this.InvoiceDetailForm.get("creditdtl") as FormArray;


      id.setValue(data.id)
      invoiceheader_id.setValue(data.invoiceheader)
      paymode_id.setValue(data.paymode_id.id)
      creditbank_id.setValue(data.creditbank_id)
      suppliertax_id.setValue(data.suppliertax_id)
      creditglno.setValue(data.creditglno)
      creditrefno.setValue(data.creditrefno)
      suppliertaxtype.setValue(data.suppliertaxtype)
      suppliertaxrate.setValue(data.suppliertaxrate)
      taxexcempted.setValue(data.taxexcempted)
      amount.setValue(data.amount)
      taxableamount.setValue(data.taxableamount)
      ddtranbranch.setValue(data.ddtranbranch)
      ddpaybranch.setValue(data.ddpaybranch)
      category_code.setValue(data.category_code)
      subcategory_code.setValue(data.subcategory_code)
      if (data.creditbank_id != undefined) {
        bank.setValue(data.creditbank_id.name)
        ifsccode.setValue(data.creditbank_id.code)
      } else {
        bank.setValue("")
        ifsccode.setValue("")
      }
      branch.setValue("")
      benificiary.setValue("")
      amountchange.setValue("")
      credittotal.setValue(0)




      creditdetailformArray.push(new FormGroup({
        invoiceheader_id: invoiceheader_id,
        paymode_id: paymode_id,
        creditbank_id: creditbank_id,
        suppliertax_id: suppliertax_id,
        creditglno: creditglno,
        creditrefno: creditrefno,
        suppliertaxtype: suppliertaxtype,
        suppliertaxrate: suppliertaxrate,
        taxexcempted: taxexcempted,
        amount: amount,
        taxableamount: taxableamount,
        ddtranbranch: ddtranbranch,
        ddpaybranch: ddpaybranch,
        category_code: category_code,
        subcategory_code: subcategory_code,
        id: id,
        bank: bank,
        branch: branch,
        ifsccode: ifsccode,
        benificiary: benificiary,
        amountchange: amountchange,
        credittotal: credittotal
      }))



      this.calcTotalcreditdatas(amount)

      amount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {

        this.creditdatasums()
        if (!this.InvoiceDetailForm.valid) {
          return;
        }
        this.linesChange.emit(this.InvoiceDetailForm.value['creditdtl']);
      }
      )

      amountchange.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {

        this.amountReduction()
        if (!this.InvoiceDetailForm.valid) {
          return;
        }
        this.linesChange.emit(this.InvoiceDetailForm.value['creditdtl']);
      }
      )




    }


  }

  calcTotalcreditdatas(amount: FormControl) {
    this.creditdatasums()
  }



  // ---------overall submit------

  public displayFnbranch(branchtype?: branchListss): string | undefined {

    return branchtype ? branchtype.name : undefined;
  }

  get branchtype() {
    return this.SubmitoverallForm.get('approver_branch');
  }

  public displayFnbranchrole(branchtyperole?: branchListss): string | undefined {

    return branchtyperole ? +branchtyperole.code + "-" + branchtyperole.name : undefined;

  }

  get branchtyperole() {
    return this.ecfheaderForm.get('branch');
  }


  private branchdropdown(branchkeyvalue) {
    this.ecfservice.getbranch(branchkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;


      })
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
                this.ecfservice.getbranchscroll(this.branchInput.nativeElement.value, this.currentpage + 1)
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

  public displayFnapprover(approvertype?: approverListss): string | undefined {


    return approvertype ? approvertype.name : undefined;
  }

  get approvertype() {
    return this.SubmitoverallForm.get('approvedby_id');
  }
  approvid: any
  approverid(data) {
    this.approvid = data.id
  }


  private approverdropdown(approverkeyvalue) {
    this.ecfservice.getapprover(approverkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Approverlist = datas;


      })
  }

  approverScroll() {
    setTimeout(() => {
      if (
        this.matappAutocomplete &&
        this.matappAutocomplete &&
        this.matappAutocomplete.panel
      ) {
        fromEvent(this.matappAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matappAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matappAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matappAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matappAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservice.getapproverscroll(this.approverInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Approverlist.length >= 0) {
                      this.Approverlist = this.Approverlist.concat(datas);
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

  formData: any = new FormData();

  // getFileDetails(index, e) {
  //   let data = this.InvoiceHeaderForm.value.invoiceheader

  //   for (var i = 0; i < e.target.files.length; i++) {
  //     data[index].file_key = []
  //     this.formData.append('file' + index, e.target.files[i])
  //   }
  //   data[index].file_key.push("file" + index);

  // }

  getFileDetails(index, e) {
    let data = this.InvoiceHeaderForm.value.invoiceheader
    for (var i = 0; i < e.target.files.length; i++) {
      data[index]?.filevalue?.push(e?.target?.files[i])
      data[index]?.filedataas?.push(e?.target?.files[i])
    }
    data[index]?.file_key?.push("file" + index);
  }

  deletefileUpload(invdata, i) {
    let filesValue = this.fileInput.toArray()
    let filesValueLength = filesValue?.length
    for (let i = 0; i < filesValueLength; i++) {
      filesValue[i].nativeElement.value = ""
    }
    let filedata = invdata.filevalue
    let filedatas = invdata.filedataas
    let file_key = invdata.file_key

    filedata.splice(i, 1)
    filedatas.splice(i, 1)
    file_key.splice(i, 1)

  }

  filedatas: any
  fileindex: any
  getfiledetails(datas, ind) {
    this.fileindex = ind
    this.filedatas = datas.value['filekey']
  }
  fileback() {
    this.closedbuttons.nativeElement.click();
  }


  fileDeletes(data, index: number) {
    this.ecfservice.deletefile(data)
      .subscribe(result => {
        if (result?.status == 'success') {
          this.notification.showSuccess("Deleted....")
          this.fileList.splice(index, 1);
          this.InvoiceHeaderForm.value.invoiceheader[this.fileindex].filedataas.splice(index, 1)
          this.InvoiceHeaderForm.value.invoiceheader[this.fileindex].filekey.splice(index, 1)
          this.closedbuttons.nativeElement.click();
        } else {
          this.notification.showError(result?.description)
          this.closedbuttons.nativeElement.click();
          return false
        }
      })
  }

  showimageHeaderPreview: boolean = false
  showimageHeaderPreviewPDF: boolean = false
  jpgUrls: any
  pdfurl: any
  filepreview(files) {
    let stringValue = files.name.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg" ||
      stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {
      this.showimageHeaderPreview = true
      this.showimageHeaderPreviewPDF = false
      const reader: any = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.jpgUrls = reader.result
      }
    }
    if (stringValue[1] === "pdf" || stringValue[1] === "PDF") {
      this.showimageHeaderPreview = false
      this.showimageHeaderPreviewPDF = true
      const reader: any = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.pdfurl = reader.result
      }
    }
    if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt" ||
      stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT") {
      this.showimageHeaderPreview = false
      this.showimageHeaderPreviewPDF = false
    }
  }





  fileChange(event, ind) {
    let imagesList = [];
    for (var i = 0; i < event.target.files.length; i++) {
      this.images.push(event.target.files[i]);
    }
    this.InputVar.nativeElement.value = '';
    imagesList.push(this.images);
    this.uploadList = [];
    imagesList.forEach((item) => {
      let s = item;
      s.forEach((it) => {
        let io = it.name;
        this.uploadList.push(io);
      });
    });
  }

  deleteUpload(s, index) {
    this.uploadList.forEach((s, i) => {
      if (index === i) {
        this.uploadList.splice(index, 1)
        this.images.splice(index, 1);
      }
    })
  }
  ecffid: any
  OverallFormSubmit() {
    const datas = this.SubmitoverallForm?.value

    if (this.ecfheaderidd === "") {
      this.ecffid = this.ecfheaderid
    } else {
      this.ecffid = this.ecfheaderidd
    }

    if (datas?.approvedby_id === "" || datas.approvedby_id === null) {
      this.toastr.warning('', 'Please Choose Approver ', { timeOut: 1500 });
      return false;
    }
    if (datas?.approver_branch != null && datas?.approver_branch != "" && datas?.approver_branch != undefined) {
      datas.approver_branch = datas?.approver_branch?.id
    } else {
      datas.approver_branch = ""
    }
    this.ECFData =

    {
      "id": this.ecffid,
      "approvedby_id": datas.approvedby_id.id,
      "ecftype": this.ecftypeid,
      "tds": datas.tds,
      "approver_branch": datas.approver_branch.id
    }


    this.ecfservice.OverallSubmit(this.ECFData)
      .subscribe(result => {

        if (result.code != undefined) {
          this.notification.showError(result.description)
          return false
        }
        else {
          this.notification.showSuccess("Successfully ECF Created!...")
          this.onSubmit.emit()
          this.submitoverallbtn = true

        }
      })
  }
  // ---------Invoice Details--------


  getinvdtlSections(forms) {
    return forms.controls.invoicedtl.controls;
  }

  addinvdtlSection() {

    const control = <FormArray>this.InvoiceDetailForm.get('invoicedtl');
    control.push(this.INVdetail());
    if (this.getgstapplicable === "N") {
      for (let i = 0; i < 30; i++) {

        this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('hsn').disable()
        this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('hsn_percentage').disable()
        this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('igst').disable()
        this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('cgst').disable()
        this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('sgst').disable()
        this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('taxamount').disable()
      }


    }


  }

  removeinvdtlSection(i) {

    const control = <FormArray>this.InvoiceDetailForm.get('invoicedtl');
    control.removeAt(i);
    this.INVdatasums()
  }


  INVdetail() {

    let group = new FormGroup({
      id: new FormControl(''),
      dtltotalamt: new FormControl(0),
      invoiceheader_id: new FormControl(),
      productname: new FormControl(''),
      productcode: new FormControl('PRD103'),
      invoice_po: new FormControl(''),
      description: new FormControl(''),
      hsn: new FormControl(''),
      hsn_percentage: new FormControl(''),
      uom: new FormControl(''),
      unitprice: new FormControl(''),
      quantity: new FormControl(''),
      amount: new FormControl(0),
      cgst: new FormControl(0),
      sgst: new FormControl(0),
      igst: new FormControl(0),
      discount: new FormControl(0),
      taxamount: new FormControl(0),
      totalamount: new FormControl(0),
      invoiceno: new FormControl(""),
      invoicedate: new FormControl(""),
      supplier_name: new FormControl(""),
      suppliergst: new FormControl(""),
      pincode: new FormControl(0),

    })
    group.get('hsn').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;

        }),
        switchMap(value => this.ecfservice.gethsnscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
              if (value === "" || value.id === undefined) {
                this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('hsn_percentage').reset()
                this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('cgst').reset(0)
                this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('sgst').reset(0)
                this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('igst').reset(0)
                this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('taxamount').reset(0)
                this.calcTotalM(group);

              }
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.hsnList = datas;
        this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
      })


    group.get('uom').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.uomscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.uomList = datas;
        this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
      })


    group.get('unitprice').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.calcTotalM(group)

      if (!this.InvoiceDetailForm.valid) {
        return;
      }

      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
    }
    )


    group.get('quantity').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
    }
    )

    group.get('sgst').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
    }
    )

    group.get('cgst').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
    }
    )

    group.get('igst').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
    }
    )

    group.get('amount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
    }
    )

    group.get('taxamount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
    }
    )
    return group
  }

  public displayFnuom(uomtype?: uomlistss): string | undefined {
    return uomtype ? uomtype.name : undefined;
  }

  get uomtype() {
    return this.InvoiceDetailForm.get('uom');
  }

  getuom() {
    this.ecfservice.getuom('')
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.uomList = datas;


      })
  }

  uomScroll() {
    setTimeout(() => {
      if (
        this.matuomAutocomplete &&
        this.matuomAutocomplete &&
        this.matuomAutocomplete.panel
      ) {
        fromEvent(this.matuomAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matuomAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matuomAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matuomAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matuomAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservice.uomscroll(this.uomInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.uomList.length >= 0) {
                      this.uomList = this.uomList.concat(datas);
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



  public displayFnhsn(hsntype?: hsnlistss): string | undefined {
    return hsntype ? hsntype.code : undefined;
  }

  get hsntype() {
    return this.InvoiceDetailForm.get('hsn');
  }

  gethsn() {
    this.ecfservice.gethsn('')
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.hsnList = datas;


      })
  }

  gethsncode(igstrate, ind) {
    this.InvoiceDetailForm.get('invoicedtl')['controls'][ind].get('hsn_percentage').setValue(igstrate)
  }

  hsnScroll() {
    setTimeout(() => {
      if (
        this.mathsnAutocomplete &&
        this.mathsnAutocomplete &&
        this.mathsnAutocomplete.panel
      ) {
        fromEvent(this.mathsnAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.mathsnAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.mathsnAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.mathsnAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.mathsnAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservice.gethsnscroll(this.hsnInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.hsnList.length >= 0) {
                      this.hsnList = this.hsnList.concat(datas);
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



  getgst(index) {

    if (this.getgstapplicable === "Y" && this.ecftypeid == 2) {
      let overalloffIND = this.InvoiceDetailForm.value.invoicedtl;

      this.hsncodess = overalloffIND[index].hsn.code;

      let unit = overalloffIND[index].unitprice
      let units = Number(unit)
      let qtyy = overalloffIND[index].quantity
      if (qtyy === null || qtyy === undefined) {
        qtyy = 0
      }

      if ((this.hsncodess === "" || this.hsncodess === undefined || this.hsncodess === null)
        || (qtyy === "" || qtyy === undefined || qtyy === null)
        || (unit === "" || unit === undefined || unit === null)) {
        return false
      }


      if ((this.hsncodess !== "" || this.hsncodess !== undefined || this.hsncodess !== null)
        || (qtyy !== "" || qtyy !== undefined || qtyy !== null)
        || (unit !== "" || unit !== undefined || unit !== null)) {

        let json = {
          "code": this.hsncodess,
          "unitprice": units,
          "qty": qtyy,
          "discount": 0,
          "type": this.type
        }

        this.ecfservice.GSTcalculation(json)
          .subscribe(result => {

            this.totaltax = result.igst + result.sgst + result.cgst
            this.InvoiceDetailForm.get('invoicedtl')['controls'][index].get('sgst').setValue(result.sgst)
            this.InvoiceDetailForm.get('invoicedtl')['controls'][index].get('cgst').setValue(result.cgst)
            this.InvoiceDetailForm.get('invoicedtl')['controls'][index].get('igst').setValue(result.igst)
            this.InvoiceDetailForm.get('invoicedtl')['controls'][index].get('taxamount').setValue(this.totaltax)
          })

      }
    }
  }


  calcTotalM(group: FormGroup) {
    const Unitprice = +group.controls['unitprice'].value;
    const quantity = +group.controls['quantity'].value;
    this.totaltaxable = quantity * Unitprice
    group.controls['amount'].setValue((this.totaltaxable), { emitEvent: false });
    let taxamount = +group.controls['taxamount'].value;
    this.overalltotal = this.totaltaxable + taxamount
    group.controls['totalamount'].setValue((this.overalltotal), { emitEvent: false });
    this.INVdatasums();

  }

  calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount: FormControl) {

    const Quantity = quantity.value
    const unitsprice = unitprice.value
    const taxAmount = taxamount.value
    this.totaltaxable = Quantity * unitsprice
    amount.setValue((this.totaltaxable), { emitEvent: false });
    this.overalltotal = this.totaltaxable + taxAmount
    totalamount.setValue((this.overalltotal), { emitEvent: false });
    this.INVdatasums();

  }

  INVdatasums() {
    this.INVamt = this.InvoiceDetailForm.value['invoicedtl'].map(x => x.totalamount);
    this.INVsum = this.INVamt.reduce((a, b) => a + b, 0);
  }


  submitinvoicedtl() {


    const invdetaildata = this.InvoiceDetailForm.value.invoicedtl

    for (let i in invdetaildata) {

      if ((invdetaildata[i].hsn == '' && this.getgstapplicable === 'Y') || (invdetaildata[i].hsn == null && this.getgstapplicable === 'Y') || (invdetaildata[i].hsn == undefined && this.getgstapplicable === 'Y')) {
        this.toastr.error('Please Choose Hsn Code');
        return false;
      }

      if ((invdetaildata[i].unitprice == '') || (invdetaildata[i].unitprice == null) || (invdetaildata[i].unitprice == undefined)) {
        this.toastr.error('Please Enter Unit Price');
        return false;
      }

      if ((invdetaildata[i].quantity == '') || (invdetaildata[i].quantity == null) || (invdetaildata[i].quantity == undefined)) {
        this.toastr.error('Please Enter Quantity');
        return false;
      }


      if (invdetaildata[i].id === "" || invdetaildata[i].id === undefined) {
        delete invdetaildata[i].id
      }

      if (this.ecftypeid == 3) {

        let data = this.SupplierDetailForm.value
        invdetaildata[i].dtltotalamt = this.invheadertotamount
        invdetaildata[i].hsn = invdetaildata[i].hsn.code
        invdetaildata[i].invoiceheader_id = this.invoiceheaderaddonid
        invdetaildata[i].productcode = "PRD103"
        if (invdetaildata[i].uom === null) {
          invdetaildata[i].uom = ""
        } else {
          invdetaildata[i].uom = invdetaildata[i].uom.name
        }
        invdetaildata[i].discount = 0
        invdetaildata[i].invoice_po = ""
        invdetaildata[i].invoiceno = data.invoiceno
        invdetaildata[i].invoicedate = this.datePipe.transform(data.invoicedate, 'yyyy-MM-dd')
        invdetaildata[i].supplier_name = data.supplier_name
        invdetaildata[i].suppliergst = data.suppliergst
        invdetaildata[i].pincode = data.pincode
        if (invdetaildata[i].pincode === "") {
          invdetaildata[i].pincode = 0
        }


      }
      if (this.getgstapplicable === 'Y' && this.ecftypeid == 2) {
        invdetaildata[i].dtltotalamt = this.invheadertotamount
        invdetaildata[i].hsn = invdetaildata[i].hsn.code
        invdetaildata[i].invoiceheader_id = this.invoiceheaderaddonid
        invdetaildata[i].productcode = "PRD103"
        if (invdetaildata[i].uom === null) {
          invdetaildata[i].uom = ""
        } else {
          invdetaildata[i].uom = invdetaildata[i].uom.name
        }
        invdetaildata[i].discount = 0
        invdetaildata[i].invoice_po = ""
        delete invdetaildata[i].invoiceno
        delete invdetaildata[i].supplier_name
        delete invdetaildata[i].pincode
        delete invdetaildata[i].suppliergst
        delete invdetaildata[i].invoicedate


      }
      if (this.getgstapplicable === 'N' && this.ecftypeid == 2) {
        invdetaildata[i].dtltotalamt = this.invheadertotamount
        invdetaildata[i].hsn = ""
        invdetaildata[i].hsn_percentage = 0
        invdetaildata[i].invoiceheader_id = this.invoiceheaderaddonid
        invdetaildata[i].productcode = "PRD103"
        if (invdetaildata[i].uom === null) {
          invdetaildata[i].uom = ""
        } else {
          invdetaildata[i].uom = invdetaildata[i].uom.name
        }
        invdetaildata[i].discount = 0
        invdetaildata[i].invoice_po = ""
        invdetaildata[i].igst = 0
        invdetaildata[i].cgst = 0
        invdetaildata[i].sgst = 0
        invdetaildata[i].taxamount = 0

      }



    }
    if (this.INVsum > this.totalamount || this.INVsum < this.totalamount) {
      this.toastr.error('Check Invoice Header Amount', 'Please Enter Valid Amount');
      return false
    }

    if (this.ecfstatusid === 2) {
      this.ecfservice.createinvdtlmodification(invdetaildata)
        .subscribe(result => {

          if (result.code != undefined) {
            this.notification.showError(result.description)

          }
          else {
            this.notification.showSuccess("Successfully Invoice Detail Saved")
            this.invdtlsave = true
            this.showdebitpopup = true
            this.showadddebit = true
            this.showadddebits = false
            this.invoicedetailsdata = result.invoicedetails
            let invdtl = this.InvoiceDetailForm.value.invoicedtl
            for (let index in invdtl) {
              invdtl[index].id = this.invoicedetailsdata[index].id
            }
            console.log("invdtl", invdtl)
            return true
          }
        })

    } else {

      this.ecfservice.invoicedetailcreate(invdetaildata)
        .subscribe(result => {
          if (result.code != undefined) {
            this.notification.showError(result.description)

          }

          else {

            this.notification.showSuccess("Successfully Invoice Detail Saved")
            this.invdtlsave = true
            this.showdebitpopup = true
            this.showadddebit = true
            this.showadddebits = false
            this.AdddebitDetails = false
            this.invoicedetailsdata = result.invoicedetails
            let invdtl = this.InvoiceDetailForm.value.invoicedtl
            for (let index in invdtl) {
              invdtl[index].id = this.invoicedetailsdata[index].id
            }
            console.log("invdtl", invdtl)
            return true
          }
        })
    }
  }


  deleteinvdetail(section, ind) {

    this.delinvdtlid = section.value.id
    if (this.delinvdtlid != "") {

      var answer = window.confirm("Are you sure to delete?");
      if (answer) {

        this.ecfservice.invdtldelete(this.delinvdtlid)
          .subscribe(result => {
            if (result.status == "success") {
              this.notification.showSuccess("Deleted Successfully")
              this.removeinvdtlSection(ind)
            } else {
              this.notification.showError(result.description)
              return false
            }

          })

      } else {
        return false;
      }
    } else {
      this.removeinvdtlSection(ind)
    }

  }
  invdtladdonid: any
  invdtltaxableamount: any
  invdtltotamount: any
  invdtloverallamount: any
  invdtltaxamount: any
  cgstval: any
  sgstval: any
  igstval: any
  gettaxrate: any

  getdebitresrecords: any
  invoicedetailresult: any


  adddebit(section, index) {
    let datas = this.DebitDetailForm.get('debitdtl') as FormArray
    datas.clear()
    
      let sections = section.value
      this.invdtltaxableamount = sections.amount
      this.invdtltotamount = sections.totalamount
      this.invdtloverallamount = sections.dtltotalamt
      this.invdtltaxamount = sections.taxamount
      this.cgstval = sections.cgst
      this.sgstval = sections.sgst
      this.igstval = sections.igst
      this.gettaxrate = this.cgstval + this.sgstval + this.igstval
      this.invdtladdonid = sections.id

      if (this.invdtladdonid == undefined) {
      this.toastr.warning('', 'Please Create Invoice Detail First ', { timeOut: 1500 });
      this.showdebitpopup = false
      return false;
      } else {
       this.ecfservice.getinvdetailsrecords(this.invdtladdonid)
        .subscribe(result => {
          
          this.getdebitresrecords = result
          result['debit']['expanded'] = false
          // result['debit']['disabled'] = false
          let a = this.getdebitresrecords['debit']


          if (a.length === 0) {
            let catdata = {
              "code": "GST Tax",
              "id": 232,
              "name": "GST TAX"
            }

            let igstdata = {
              "code": "IGST",
              "id": 1251,
              "glno": 179000065,
              "name": "IGST"
            }

            let cgstdata = {
              "code": "CGST",
              "id": 1252,
              "glno": 179000045,
              "name": "CGST"
            }
            let sgstdata = {
              "code": "SGST",
              "id": 1253,
              "glno": 179000035,
              "name": "SGST"
            }
            let ccdata = {
              "code": "0",
              "id": 218,
              "name": "GST"

            }

            let bsdata = {
              "code": "0",
              "name": "GST",
              "id": 52

            }



            for (let i = 0; i <= 2; i++) {
              if (i === 0 && this.getgstapplicable == "Y") {
                this.adddebitSection()
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.invdtltaxableamount)
                this.debitdatasums()


              }

              if (i == 1 && this.type === "IGST" && this.getgstapplicable == "Y") {
                this.adddebitSection()


                this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(catdata)
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(igstdata)
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(igstdata.glno)
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('remarks').setValue('GST')
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('bs').setValue(bsdata)
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('cc').setValue(ccdata)
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.igstval)
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('deductionamount').setValue(0)
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('ccbspercentage').setValue(100)

              }
              if (i == 1 && this.type === "SGST & CGST" && this.getgstapplicable == "Y") {

                this.adddebitSection()
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(catdata)
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(cgstdata)
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(cgstdata.glno)
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('remarks').setValue('GST')
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('bs').setValue(bsdata)
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('cc').setValue(ccdata)
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.cgstval)
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('deductionamount').setValue(0)
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('ccbspercentage').setValue(100)

              }

              if (i == 2 && this.type === "SGST & CGST" && this.getgstapplicable == "Y") {
                this.adddebitSection()
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(catdata)
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(sgstdata)
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(sgstdata.glno)
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('remarks').setValue('GST')
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('bs').setValue(bsdata)
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('cc').setValue(ccdata)
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.sgstval)
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('deductionamount').setValue(0)
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('ccbspercentage').setValue(100)

              }
              if (this.igstval == 0 && this.cgstval == 0 && this.sgstval == 0 && i == 0 && this.getgstapplicable == "N") {
                this.adddebitSection()
                this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.invdtltaxableamount)
                this.debitdatasums()
              }
            }



          }


          if (result) {
            this.getdebitrecords(result)

          }
        })
    }

  }
  debitdtlid: any
  debitglnum: any
  debitdtlamount: any
  addccbs(data) {
    console.log("ccbsdata", data)
    this.debitdtlid = data.value.id
    this.debitglnum = data.value.debitglno
    this.debitdtlamount = data.value.amount
    // for(let i=0;i<1;i++){
    //   this.ccbsdetailForm.get('ccbs')['controls'][i].get('amount').setValue(data.value.amount)
    //   this.ccbsdetailForm.get('ccbs')['controls'][i].get('ccbspercentage').setValue(100)
    // }

  }


  getdebitrecords(datas) {
    if (this.ecftypeid == 4) {
      if (datas.debit.length == 0) {

        const control = <FormArray>this.DebitDetailForm.get('debitdtl');
        control.push(this.debitdetail());


      }
    }

    for (let debit of datas.debit) {

      let id: FormControl = new FormControl('');
      let invoiceheader_id: FormControl = new FormControl('');
      let invoicedetail_id: FormControl = new FormControl('');
      let category_code: FormControl = new FormControl('');
      let subcategory_code: FormControl = new FormControl('');
      let debitglno: FormControl = new FormControl('');
      let amount: FormControl = new FormControl('');
      let debittotal: FormControl = new FormControl('');
      let deductionamount: FormControl = new FormControl(0);
      let cc: FormControl = new FormControl('');
      let bs: FormControl = new FormControl('');
      let ccbspercentage: FormControl = new FormControl('');
      let remarks: FormControl = new FormControl('');
      const debitFormArray = this.DebitDetailForm.get("debitdtl") as FormArray;


      id.setValue(debit.id)
      invoiceheader_id.setValue(debit.invoiceheader)
      invoicedetail_id.setValue(debit.invoicedetail)
      category_code.setValue(debit.category_code)
      subcategory_code.setValue(debit.subcategory_code)
      debitglno.setValue(debit.debitglno)
      if (this.ecftypeid != 4) {
        if (debit.category_code.code != "GST Tax") {
          // this.readdebitdata = false

          // if(debit.amount == ""){
          //   amount.setValue( this.invdtltaxableamount) 
          // }


          // if(this.totaltaxable != undefined){
          //   amount.setValue(this.totaltaxable)
          // }
          // else{
          amount.setValue(debit.amount)
          // }


        }
        else {

          if (debit.subcategory_code.code == "IGST") {
            amount.setValue(this.igstval)
          }
          if (debit.subcategory_code.code == "CGST") {
            amount.setValue(this.cgstval)
          }

          if (debit.subcategory_code.code == "SGST") {
            amount.setValue(this.sgstval)
          }

          // amount.setValue(this.invdtltaxamount)
          // this.readdebitdata = true

        }
      }
      else {

        amount.setValue(debit.amount)
      }
      debittotal.setValue(0)
      deductionamount.setValue(debit.deductionamount)
      cc.setValue(debit.ccbs.cc_code)
      bs.setValue(debit.ccbs.bs_code)
      ccbspercentage.setValue(debit.ccbs.ccbspercentage)
      remarks.setValue(debit.ccbs.remarks)


      debitFormArray.push(new FormGroup({
        id: id,
        invoiceheader_id: invoiceheader_id,
        invoicedetail_id: invoicedetail_id,
        category_code: category_code,
        subcategory_code: subcategory_code,
        debitglno: debitglno,
        amount: amount,
        debittotal: debittotal,
        deductionamount: deductionamount,
        cc: cc,
        bs: bs,
        ccbspercentage: ccbspercentage,
        remarks: remarks,
        ccbsdtl: this.fb.group({

          cc_code: debit.ccbs.cc_code,
          bs_code: debit.ccbs.bs_code,
          code: debit.ccbs.code,
          ccbspercentage: debit.ccbs.ccbspercentage,
          remarks: debit.ccbs.remarks,
          glno: debit.ccbs.glno,
          id: debit.ccbs.id,
          amount: debit.ccbs.amount,
          debit: debit.ccbs.debit,

        })
      }))


      category_code.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ecfservice.getcategoryscroll(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.categoryNameData = datas;
          this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
        })

      subcategory_code.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ecfservice.getsubcategoryscroll(this.catid, value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.subcategoryNameData = datas;

        })


      bs.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ecfservice.getbsscroll(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.bsNameData = datas;
          // console.log("bsdata", this.bsNameData)
          this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
        })

      cc.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ecfservice.getccscroll(this.bssid, value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.ccNameData = datas;
          // console.log("ccdata", this.ccNameData)
          this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
        })
      this.calctotaldebitdata(amount)

      ccbspercentage.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        this.calcTotaldebit(this.debitaddindex)
        if (!this.DebitDetailForm.valid) {
          return;
        }
        this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
      }
      )

      amount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        this.calcdebiteditamount(amount)
        if (!this.DebitDetailForm.valid) {
          return;
        }
        this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
      }
      )


    }


  }

  calctotaldebitdata(amount: FormControl) {
    this.debitdatasums()
  }





  // -------credit sections------

  getcreditindex: any
  addoncreditindex(indexx) {
    this.getcreditindex = indexx

  }

  private getPaymode() {

    this.ecfservice.getPaymode()
      .subscribe((results: any[]) => {
        this.PaymodeList = results["data"];
      })
  }


  getCreditSections(form) {
    return form.controls.creditdtl.controls;
  }

  addcreditSection() {
    const control = <FormArray>this.InvoiceDetailForm.get('creditdtl');
    control.push(this.creditdetails());
  }
  removecreditSection(i) {
    const control = <FormArray>this.InvoiceDetailForm.get('creditdtl');
    control.removeAt(i);
    this.creditdatasums()
  }


  paymodeid: any
  taxableamount: any


  CreditDessss(pay, index) {

    this.getcreditindex = index
    this.paymodeid = pay.id
    if (this.paymodeid === 5 || this.paymodeid === 8) {
      this.showaccno[index] = true
      this.getaccno(this.paymodeid)
    }
    else {
      this.showaccno[index] = false
    }

    if (this.paymodeid === 4 || this.paymodeid === 1) {
      this.showeraacc[index] = true
      this.getERA(index)
    }
    else {
      this.showeraacc[index] = false
    }
    if (this.paymodeid === 3) {

      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditrefno').reset()

      this.showtranspay[index] = true
      this.showaccno[index] = false

    } else {
      this.showtranspay[index] = false

    }

    if (this.paymodeid === 7) {
      this.showtaxtype[index] = true
      this.showtaxrate[index] = true
      this.showtaxtypes[index] = false
      this.showtaxrates[index] = false
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditglno').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditrefno').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('taxableamount').setValue(this.taxableamount)
      this.gettaxtype()


    } else {
      this.showtaxtype[index] = false
      this.showtaxrate[index] = false
      this.showtaxtypes[index] = true
      this.showtaxrates[index] = true
    }
    if (this.paymodeid === 6) {

      this.showppxmodal = true

    } else {
      this.showppxmodal = false

    }

    if (this.paymodeid === 2) {
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditrefno').reset()

      this.showglpopup = true
      this.creditglForm.patchValue({
        name: pay.name
      })
      this.getcreditgl(this.paymodeid)
    } else {
      this.showglpopup = false
    }
  }
  accountno: any
  getacc(accountno) {

    this.accountno = accountno
    this.getcreditpaymodesummary()
  }
  optionsummary = false
  firstsummary = true
  creditListed: any
  arraydata: any
  accno: any
  creditids: any
  accountnumber: any
  getcreditpaymodesummary(pageNumber = 1, pageSize = 10) {
    if (this.accountno === undefined) {
      this.accountnumber = this.accnumm
    } else {
      this.accountnumber = this.accountno
    }
    this.ecfservice.getcreditpaymodesummaryy(pageNumber, pageSize, this.paymodeid, this.suppid, this.accountnumber)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.creditListed = datas

        for (let i of this.creditListed) {

          let accno = i.account_no
          let bank = i.bank_id.name
          let branch = i.branch_id.name
          let ifsc = i.branch_id.ifsccode
          let beneficiary = i.beneficiary
          this.creditids = i.bank_id.id


          this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditrefno').setValue(accno)
          this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('bank').setValue(bank)
          this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('branch').setValue(branch)
          this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('ifsccode').setValue(ifsc)
          this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('benificiary').setValue(beneficiary)
        }


      })
  }

  choosetype(index) {
    this.showtaxtype[index] = true
    this.showtaxtypes[index] = false
    this.gettaxtype()

  }

  chooserate(index) {
    this.showtaxrate[index] = true
    this.showtaxrates[index] = false
  }




  taxrateid: any
  taxratename: any
  vendorid: any
  maintaintaxlist: any
  othertaxlist: any


  getERA(ind) {
    if (this.paymodeid == 4) {
      this.ecfservice.geterapaymode(this.paymodeid)
        .subscribe(result => {
          this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('creditrefno').setValue(result)

        })
    }

    if (this.paymodeid == 1) {

      this.ecfservice.getbrapaymode(this.paymodeid)
        .subscribe(result => {
          this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('creditrefno').setValue(result)

        })

    }
  }
  gettaxtype() {
    this.ecfservice.gettdstaxtype(this.suppid)
      .subscribe(result => {
        this.vendorid = result.vendor_id
        this.taxlist = result['subtax_list']
        this.maintaintaxlist = this.taxlist.filter(dept => dept.dflag === "M");
        this.othertaxlist = this.taxlist.filter(dept => dept.dflag === "O");

      })
  }

  gettaxid(data) {
    this.taxrateid = data.id
    this.taxratename = data.subtax_type
    this.gettdstaxrates()
  }

  maintaintaxratelist: any
  othertaxratelist: any
  gettdstaxrates() {
    this.ecfservice.gettdstaxrate(this.vendorid, this.taxrateid)
      .subscribe(result => {
        this.taxratelist = result['data']
        this.maintaintaxratelist = this.taxratelist.filter(dept => dept.dflag === "M");
        this.othertaxratelist = this.taxratelist.filter(dept => dept.dflag === "O");

      })

  }
  taxindex: any
  taxrate: any

  gettaxcalc(index) {
    this.taxindex = index

    let creditdata = this.InvoiceDetailForm.value.creditdtl
    let taxrate = creditdata[index].suppliertaxrate
    this.taxrate = taxrate
    let taxableamt = creditdata[index].taxableamount

    if (taxrate === undefined || taxrate === "" || taxrate === null || taxableamt === undefined || taxableamt === "" || taxableamt === null) {
      return false
    }

    if (taxrate != undefined || taxrate != "" || taxrate != null || taxableamt != undefined || taxableamt != "" || taxableamt != null) {

      this.ecfservice.gettdstaxcalculation(taxableamt, taxrate)
        .subscribe(results => {
          let amount = results.tdsrate
          this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('amountchange').setValue(amount)

        })
    }

  }
  suppid: any
  creditList: any
  accdata: any
  accnumm: any
  getaccno(payid) {
    this.ecfservice.getbankaccno(payid, this.suppid)
      .subscribe(res => {
        this.accList = res['data']
        this.accdata = this.accList[0].id
        this.accnumm = this.accList[0].account_no
        this.getcreditpaymodesummary()
      })

  }

  getcreditgl(payid) {
    this.ecfservice.creditglno(payid)
      .subscribe(res => {
        this.glList = res['data']

      })


  }

  getgl(glno) {
    this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditglno').setValue(glno)
  }

  glsubmitForm() {
    this.closebuttons.nativeElement.click();
  }

  creditdetails() {
    let group = new FormGroup({
      id: new FormControl(''),
      invoiceheader_id: new FormControl(''),
      paymode_id: new FormControl(''),
      creditbank_id: new FormControl(''),
      suppliertax_id: new FormControl(''),
      creditglno: new FormControl(0),
      creditrefno: new FormControl(''),
      suppliertaxtype: new FormControl(''),
      suppliertaxrate: new FormControl(''),
      taxexcempted: new FormControl('N'),
      amount: new FormControl(0),
      amountchange: new FormControl(''),
      taxableamount: new FormControl(0),
      ddtranbranch: new FormControl(0),
      ddpaybranch: new FormControl(0),
      category_code: new FormControl(''),
      subcategory_code: new FormControl(''),
      branch: new FormControl(''),
      benificiary: new FormControl(''),
      bank: new FormControl(''),
      ifsccode: new FormControl(''),
      accno: new FormControl(''),
      credittotal: new FormControl(''),

    })





    group.get('suppliertaxtype').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.gettdstaxtype(this.suppid,)
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
        this.linesChange.emit(this.InvoiceDetailForm.value['creditdtl']);
      })


    group.get('amountchange').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.amountReduction()
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['creditdtl']);
    }
    )

    return group
  }

  public displayFnFilter(filterdata?: taxtypefilterValue): string | undefined {
    return filterdata ? filterdata.subtax_type : undefined;
  }
  get filterdata() {
    return this.InvoiceDetailForm.get('suppliertaxtype');
  }
  calcreditamount: any

  amountReduction() {
    let dataForm = this.InvoiceDetailForm.value.creditdtl
    for (let data in dataForm) {

      if (data == "0") {

        this.InvoiceDetailForm.get('creditdtl')['controls'][data].get('amount').setValue(this.totalamount - dataForm[this.getcreditindex].amountchange)
      }
      if (data == this.getcreditindex) {
        this.InvoiceDetailForm.get('creditdtl')['controls'][data].get('amount').setValue(dataForm[this.getcreditindex].amountchange)

      }



    }
    this.creditdatasums()
  }

  cdtamt: any
  cdtsum: any
  creditdatasums() {
    this.cdtamt = this.InvoiceDetailForm.value['creditdtl'].map(x => x.amount);
    this.cdtsum = this.cdtamt.reduce((a, b) => a + b, 0);

  }
  CreditData: any
  creditid: any
  categoryid: any
  subcategoryid: any

  submitcredit() {



    const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl
    for (let i in creditdtlsdatas) {

      if (creditdtlsdatas[i].paymode_id === '' || creditdtlsdatas[i].paymode_id === null || creditdtlsdatas[i].paymode_id === undefined) {
        this.toastr.error('Please Choose Paymode')
        return false
      }
      if (creditdtlsdatas[i].id === "") {
        delete creditdtlsdatas[i].id
      }

      if (creditdtlsdatas[i].paymode_id === 2) {
        creditdtlsdatas[i].invoiceheader_id = this.invoiceheaderaddonid
        creditdtlsdatas[i].taxableamount = 0
        creditdtlsdatas[i].category_code = this.categoryid
        creditdtlsdatas[i].subcategory_code = this.subcategoryid
        creditdtlsdatas[i].credittotal = this.cdtsum
        creditdtlsdatas[i].creditbank_id = 0
        creditdtlsdatas[i].suppliertax_id = 0
        creditdtlsdatas[i].suppliertaxtype = ""
        creditdtlsdatas[i].suppliertaxrate = 0
        creditdtlsdatas[i].taxexcempted = "N"
        creditdtlsdatas[i].ddtranbranch = 0
        creditdtlsdatas[i].ddpaybranch = 0


      }

      if (creditdtlsdatas[i].paymode_id === 4 || creditdtlsdatas[i].paymode_id == 1) {
        creditdtlsdatas[i].invoiceheader_id = this.invoiceheaderaddonid
        creditdtlsdatas[i].taxableamount = 0
        creditdtlsdatas[i].category_code = this.categoryid
        creditdtlsdatas[i].subcategory_code = this.subcategoryid
        creditdtlsdatas[i].credittotal = this.cdtsum
        creditdtlsdatas[i].creditbank_id = 0
        creditdtlsdatas[i].suppliertax_id = 0
        creditdtlsdatas[i].suppliertaxtype = ""
        creditdtlsdatas[i].suppliertaxrate = 0
        creditdtlsdatas[i].taxexcempted = "N"
        creditdtlsdatas[i].ddtranbranch = 0
        creditdtlsdatas[i].ddpaybranch = 0
        creditdtlsdatas[i].creditglno = 0

      }


      if (creditdtlsdatas[i].paymode_id === 5) {
        creditdtlsdatas[i].invoiceheader_id = this.invoiceheaderaddonid
        creditdtlsdatas[i].taxableamount = 0
        creditdtlsdatas[i].category_code = this.categoryid
        creditdtlsdatas[i].subcategory_code = this.subcategoryid
        creditdtlsdatas[i].credittotal = this.cdtsum
        creditdtlsdatas[i].creditbank_id = this.creditids
        creditdtlsdatas[i].creditglno = 0
        creditdtlsdatas[i].suppliertax_id = 0
        creditdtlsdatas[i].suppliertaxtype = ""
        creditdtlsdatas[i].suppliertaxrate = 0
        creditdtlsdatas[i].taxexcempted = "N"
        creditdtlsdatas[i].ddtranbranch = 0
        creditdtlsdatas[i].ddpaybranch = 0


      }

      if (creditdtlsdatas[i].paymode_id === 7) {
        creditdtlsdatas[i].invoiceheader_id = this.invoiceheaderaddonid
        creditdtlsdatas[i].taxableamount = this.taxableamount
        creditdtlsdatas[i].category_code = this.categoryid
        creditdtlsdatas[i].subcategory_code = this.subcategoryid
        creditdtlsdatas[i].credittotal = this.cdtsum
        creditdtlsdatas[i].creditbank_id = 0
        creditdtlsdatas[i].creditglno = 0
        creditdtlsdatas[i].suppliertax_id = 0
        creditdtlsdatas[i].suppliertaxtype = this.taxratename
        creditdtlsdatas[i].suppliertaxrate = this.taxrate
        creditdtlsdatas[i].taxexcempted = "N"
        creditdtlsdatas[i].ddtranbranch = 0
        creditdtlsdatas[i].ddpaybranch = 0

      }

      delete creditdtlsdatas[i].amountchange
    }

    if (this.cdtsum > this.totalamount || this.cdtsum < this.totalamount) {
      this.toastr.error('Check Invoice Header Amount', 'Please Enter Valid Amount');
      return false
    }



    if (this.ecfstatusid === 2) {

      this.ecfservice.createcreditmodification(creditdtlsdatas)
        .subscribe(result => {

          if (result.code != undefined) {
            this.notification.showError(result.description)

          }
          else {
            this.notification.showSuccess("Successfully Credit Details Saved!...")
            this.creditid = result.credit
            let datas = this.InvoiceDetailForm.value.creditdtl
            for (let indd in datas) {
              datas[indd].id = this.creditid[indd].id
            }
            console.log("creditdatas", datas)
            this.discreditbtn = true
          }
        })


    } else {


      this.ecfservice.CreditDetailsSumbit(creditdtlsdatas)
        .subscribe(result => {

          if (result.code != undefined) {
            this.notification.showError(result.description)

          }

          else {

            this.creditid = result.credit
            let datas = this.InvoiceDetailForm.value.creditdtl
            for (let indd in datas) {
              datas[indd].id = this.creditid[indd].id
            }
            console.log("creditdatas", datas)
            this.notification.showSuccess("Successfully Credit Details Saved!...")
            this.discreditbtn = true

          }
        })
    }

  }



  gobacks() {
    this.showheaderdata = true
    this.showinvocedetail = false
    let invdtldatas = this.InvoiceDetailForm.get('invoicedtl') as FormArray
    invdtldatas.clear()
    let crdtdtldatas = this.InvoiceDetailForm.get('creditdtl') as FormArray
    crdtdtldatas.clear()
  }





  delcreditid: any
  deletecreditdetail(section, ind) {
    this.delcreditid = section.value.id
    if (this.delcreditid != "") {
      var answer = window.confirm("Are you sure to delete?");
      if (answer) {
        this.ecfservice.creditdelete(this.delcreditid)
          .subscribe(result => {
            if (result.status == "success") {
              this.notification.showSuccess("Deleted Successfully")
              this.removecreditSection(ind)
            } else {
              this.notification.showError(result.description)
            }

          })
      } else {
        return false;
      }

    } else {
      this.removecreditSection(ind)
    }



  }

  // -------debit--------


  getDebitSections(form) {
    return form.controls.debitdtl.controls;
  }

  adddebitSection() {
    const control = <FormArray>this.DebitDetailForm.get('debitdtl');
    control.push(this.debitdetail());
  }



  removedebitSection(i) {

    const control = <FormArray>this.DebitDetailForm.get('debitdtl');
    control.removeAt(i);
    this.debitdatasums()
  }

  getCcbsSections(form) {
    return form.controls.ccbs.controls;

  }

  addccbsSection() {
    const control = <FormArray>this.ccbsdetailForm.get('ccbs');
    control.push(this.ccbsdetail());
  }


  debitaddindex: any
  addondebitindex(index) {
    this.debitaddindex = index

  }

  debitdetail() {
    let group = new FormGroup({
      id: new FormControl(''),
      invoiceheader_id: new FormControl(),
      invoicedetail_id: new FormControl(),
      category_code: new FormControl(0),
      subcategory_code: new FormControl(0),
      debitglno: new FormControl(''),
      amount: new FormControl(0.0),
      debittotal: new FormControl(),
      deductionamount: new FormControl(0),
      cc: new FormControl(),
      bs: new FormControl(),
      splitted: new FormControl(0),
      ccbspercentage: new FormControl(100),
      // serialno:new FormControl(1),
      // readonly: new FormControl(),
      remarks: new FormControl(''),
      ccbsdtl: new FormGroup({
        cc_code: new FormControl(''),
        bs_code: new FormControl(''),
        code: new FormControl(''),
        glno: new FormControl(''),
        ccbspercentage: new FormControl(100),
        amount: new FormControl(this.invdtltotamount),
        remarks: new FormControl(),
      })
    })
    // this.readdebitdata = false

    group.get('ccbspercentage').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.calcTotaldebit(this.debitaddindex)
      if (!this.DebitDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
    }
    )

    group.get('amount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.calcdebitamount(group)
      if (!this.DebitDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
    }
    )




    group.get('category_code').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.getcategoryscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryNameData = datas;
        this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
      })

    group.get('subcategory_code').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.getsubcategoryscroll(this.catid, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subcategoryNameData = datas;

      })

    group.get('bs').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.getbsscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bsNameData = datas;
        this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
      })

    group.get('cc').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.getccscroll(this.bssid, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ccNameData = datas;
        // console.log("ccdata", this.ccNameData)
        this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
      })


    return group



  }




  calamount: any
  subamount: any
  calcTotaldebit(index) {
    let dataOnDetails = this.DebitDetailForm.value.debitdtl
    console.log("data1", dataOnDetails)
    console.log("index", index)
    let percent: any = +dataOnDetails[index].ccbspercentage
    this.calamount = this.invdtltaxableamount * percent / 100
    this.DebitDetailForm.get('debitdtl')['controls'][index].get('amount').setValue(this.calamount)
    this.debitdatasums()
  }

  calcdebitamount(group: FormGroup) {
    const amount = +group.controls['amount'].value;
    group.controls['amount'].setValue((amount), { emitEvent: false });
    this.debitdatasums()
  }

  calcdebiteditamount(amount: FormControl) {
    const amountt = Number(amount.value)
    amount.setValue((amountt), { emitEvent: false });
    this.debitdatasums()
  }

  dbtamt: any
  debitsum: any


  debitdatasums() {
    this.dbtamt = this.DebitDetailForm.value['debitdtl'].map(x => x.amount);
    this.debitsum = this.dbtamt.reduce((a, b) => (a + b), 0);
  }

  ccbsindex: any
  getccbsindex(i) {
    this.ccbsindex = i
  }

  ccbsdetail() {
    let group = new FormGroup({
      // debit_id: new FormControl(),
      category_code: new FormControl(),
      subcategory_code: new FormControl(),
      cc_code: new FormControl(),
      bs_code: new FormControl(),
      code: new FormControl(),
      ccbspercentage: new FormControl(100),
      glno: new FormControl(),
      amount: new FormControl(),
      remarks: new FormControl(),
    })

    group.get('ccbspercentage').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      this.calcTotalccbs(this.ccbsindex)
      if (!this.ccbsdetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.ccbsdetailForm.value['ccbs']);
    }
    )

    group.get('bs_code').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.getbsscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bsNameData = datas;
        this.linesChange.emit(this.ccbsdetailForm.value['ccbs']);
      })

    group.get('cc_code').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.getccscroll(this.bssid, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ccNameData = datas;
        // console.log("ccdata", this.ccNameData)
        this.linesChange.emit(this.ccbsdetailForm.value['ccbs']);
      })

    return group
  }





  public displaycatFn(cattype?: catlistss): string | undefined {
    return cattype ? cattype.name : undefined;
  }

  get cattype() {
    return this.DebitDetailForm.get('category_code');
  }
  getcat() {
    this.ecfservice.getcat('')
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryNameData = datas;
        this.catid = datas.id;


      })
  }


  getcatid(data) {
    this.catid = data['id'];
    this.getsubcat(this.catid, "");
  }

  categoryScroll() {
    setTimeout(() => {
      if (
        this.matcatAutocomplete &&
        this.matcatAutocomplete &&
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
                this.ecfservice.getcategoryscroll(this.categoryInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.categoryNameData.length >= 0) {
                      this.categoryNameData = this.categoryNameData.concat(datas);
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


  public displaysubcatFn(subcategorytype?: subcatlistss): string | undefined {
    return subcategorytype ? subcategorytype.code : undefined;
  }

  get subcategorytype() {
    return this.DebitDetailForm.get('subcategory_code');
  }

  subcategoryScroll() {
    setTimeout(() => {
      if (
        this.matsubcatAutocomplete &&
        this.matsubcatAutocomplete &&
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
              if (this.has_next === true) {
                this.ecfservice.getsubcategoryscroll(this.catid, this.subcategoryInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.subcategoryNameData.length >= 0) {
                      this.subcategoryNameData = this.subcategoryNameData.concat(datas);
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


  subcatid: any;

  getsubcat(id, subcatkeyvalue) {
    this.ecfservice.getsubcat(id, '')
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subcategoryNameData = datas;


      })
  }
  getGLNumber(data, index) {
    this.DebitDetailForm.get('debitdtl')['controls'][index].get('debitglno').setValue(data.glno)

  }

  public displaybsFn(bstype?: bslistss): string | undefined {
    return bstype ? bstype.name : undefined;
  }

  get bstype() {
    return this.DebitDetailForm.get('bs');
  }
  getbs() {
    this.ecfservice.getbs('')
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bsNameData = datas;
        this.catid = datas.id;

      })
  }

  bsScroll() {
    setTimeout(() => {
      if (
        this.matbsAutocomplete &&
        this.matbsAutocomplete &&
        this.matbsAutocomplete.panel
      ) {
        fromEvent(this.matbsAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbsAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbsAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbsAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbsAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservice.getbsscroll(this.bsInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.bsNameData.length >= 0) {
                      this.bsNameData = this.bsNameData.concat(datas);
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
  bscode: any

  bsid(data, code) {
    this.bssid = data['id'];
    this.bscode = code;
    this.getcc(this.bssid, "");
  }
  public displayccFn(cctype?: cclistss): string | undefined {
    return cctype ? cctype.name : undefined;
  }

  get cctype() {
    return this.DebitDetailForm.get('cc');
  }
  ccid: any;
  getcc(bssid, cckeyvalue) {
    this.ecfservice.getcc(bssid, cckeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ccNameData = datas;
        this.ccid = datas.id;

      })

  }

  ccScroll() {
    setTimeout(() => {
      if (
        this.matccAutocomplete &&
        this.matccAutocomplete &&
        this.matccAutocomplete.panel
      ) {
        fromEvent(this.matccAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matccAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matccAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matccAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matccAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservice.getccscroll(this.bssid, this.ccInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.ccNameData.length >= 0) {
                      this.ccNameData = this.ccNameData.concat(datas);
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




  back() {
    this.router.navigate(['ECF/inventory'])

  }

  moveback() {
    this.router.navigate(['ECF/invdetailcreate'])
  }



  cccode: any
  ccdataid: any
  getccdata(code, id) {
    this.cccode = code
    this.ccdataid = id

  }



  debitid: any
  remarkss: any
  splitarraylist: any = []
  debitform() {

    const dbtdetaildatas = this.DebitDetailForm.value.debitdtl;
    console.log("dbtdetaildata", dbtdetaildatas)

    const splitteddata = dbtdetaildatas.filter(debt => debt.splitted === 1);
    console.log("split", splitteddata)

    const dbtdetaildata = dbtdetaildatas.filter(debt => debt.splitted != 1);
    console.log("notsplit", dbtdetaildata)


    for (let i in dbtdetaildata) {




      // if ((dbtdetaildata[i].category_code == '') || (dbtdetaildata[i].category_code == null) || (dbtdetaildata[i].category_code == undefined)) {
      //   this.toastr.error('Please Choose Category');
      //   return false;
      // }
      // if ((dbtdetaildata[i].subcategory_code == '') || (dbtdetaildata[i].subcategory_code == null) || (dbtdetaildata[i].subcategory_code == undefined)) {
      //   this.toastr.error('Please Choose Sub Category');
      //   return false;
      // }
      // if ((dbtdetaildata[i].bs == '') || (dbtdetaildata[i].bs == null) || (dbtdetaildata[i].bs == undefined)) {
      //   this.toastr.error('Please Choose bs');
      //   return false;
      // }
      // if ((dbtdetaildata[i].cc == '') || (dbtdetaildata[i].cc == null) || (dbtdetaildata[i].cc == undefined)) {
      //   this.toastr.error('Please Choose cc');
      //   return false;
      // }
      if (dbtdetaildata[i].id === "") {
        delete dbtdetaildata[i].id
      }
      delete dbtdetaildata[i].splitted
      dbtdetaildata[i].invoiceheader_id = this.invoiceheaderaddonid
      if (this.ecftypeid == 4) {
        dbtdetaildata[i].invoicedetail_id = ""
        dbtdetaildata[i].debittotal = this.totalamount
      } else {
        dbtdetaildata[i].invoicedetail_id = this.invdtladdonid
        dbtdetaildata[i].debittotal = this.invdtltotamount
      }

      dbtdetaildata[i].category_code = dbtdetaildata[i].category_code.code
      dbtdetaildata[i].subcategory_code = dbtdetaildata[i].subcategory_code.code
      this.categoryid = dbtdetaildata[i].category_code
      this.subcategoryid = dbtdetaildata[i].subcategory_code
      dbtdetaildata[i].deductionamount = 0


      this.cccode = dbtdetaildata[i].cc.code
      this.bscode = dbtdetaildata[i].bs.code


      let a = dbtdetaildata[i].ccbsdtl
      if (a.id === "") {
        delete a.id
      }
      a.cc_code = this.cccode
      a.bs_code = this.bscode
      a.code = this.ccdataid
      a.glno = dbtdetaildata[i].debitglno
      a.amount = dbtdetaildata[i].amount
      a.remarks = dbtdetaildata[i].remarks
      a.ccbspercentage = dbtdetaildata[i].ccbspercentage
      a.debit = 0




      delete dbtdetaildata[i].cc
      delete dbtdetaildata[i].bs

    }


    for (let i in splitteddata) {
      // splitteddata[i].cc_code =splitteddata[i].cc_code.code
      // splitteddata[i].bs_code =splitteddata[i].bs_code.code
      // splitteddata[i].glno =splitteddata[i].debitglno
      // splitteddata[i].amount =splitteddata[i].amount
      // splitteddata[i].remarks =splitteddata[i].remarks
      // splitteddata[i].ccbspercentage =splitteddata[i].ccbspercentage

      let datas = {
        "cc_code": splitteddata[i].cc.code,
        "bs_code": splitteddata[i].bs.code,
        "glno": splitteddata[i].debitglno,
        "amount": splitteddata[i].amount,
        "remarks": splitteddata[i].remarks,
        "ccbspercentage": splitteddata[i].ccbspercentage,
        "code": this.ccdataid
      }
      this.splitarraylist.push(datas)
      console.log("dataaaaas", this.splitarraylist)

      this.ecfservice.ccbscreate(this.splitarraylist, this.debitdtlid)
        .subscribe(result => {
          console.log("ccbsres", result)
          this.notification.showSuccess("ccbs Detail Saved Successfully")
        })

    }





    if (this.ecftypeid != 4) {
      if (this.debitsum > this.invdtltotamount || this.debitsum < this.invdtltotamount) {
        this.toastr.error('Check Invoice Header Amount', 'Please Enter Valid Amount');
        return false
      }
    }

    if (this.ecftypeid == 4) {
      if (this.debitsum > this.totalamount || this.debitsum < this.totalamount || this.debitsum == undefined) {
        this.toastr.error('Check Invoice Header Amount', 'Please Enter Valid Amount');
        return false
      }
    }

    if (this.ecfstatusid === 2) {

      this.ecfservice.createdebitmodification(dbtdetaildata)
        .subscribe(result => {


          // if (result.code != undefined) {
          //   this.notification.showError(result.description)

          // }
          // else {
          this.notification.showSuccess("Successfully Debit Details Saved!...")
          this.disabledebit = true
          this.debitid = result.debit
          let data = this.DebitDetailForm.value.debitdtl
          for (let dta in data) {
            data[dta].id = this.debitid[dta].id
          }
          console.log("dbtdata", data)
          this.closebutton.nativeElement.click();

          // }
        })

    } else {
      console.log("detaildata", dbtdetaildata)
      this.ecfservice.DebitdetailCreateForm(dbtdetaildata)
        .subscribe(result => {
          if (result.code != undefined) {
            this.notification.showError(result.description)
          }
          else {


            this.notification.showSuccess("Successfully Debit Details Saved!...")
            this.disabledebit = true
            this.debitid = result.debit
            let data = this.DebitDetailForm.value.debitdtl
            for (let dta in data) {
              data[dta].id = this.debitid[dta].id
            }
            console.log("dbtdata", data)
            this.closebutton.nativeElement.click();


          }
        })

    }

  }


  deldebitid: any
  deletedebitdetail(section, ind) {
    this.deldebitid = section.value.id
    if (this.deldebitid != "") {
      var answer = window.confirm("Are you sure to delete?");
      if (answer) {
        this.ecfservice.debitdelete(this.deldebitid)
          .subscribe(result => {
            if (result.status == "success") {
              this.notification.showSuccess("Deleted Successfully")
              this.removedebitSection(ind)
            } else {
              this.notification.showError(result.description)
              return false
            }
          })

      } else {
        return false;
      }

    } else {
      this.removedebitSection(ind)
    }

  }

  ccbsamount: any
  calcTotalccbs(index) {
    let dataOnDetails = this.ccbsdetailForm.value.ccbs
    let percent: any = +dataOnDetails[index].ccbspercentage
    this.ccbsamount = this.invdtltaxableamount * percent / 100
    this.ccbsdetailForm.get('ccbs')['controls'][index].get('amount').setValue(this.ccbsamount)
    this.ccbsdatasums()
  }
  ccbsamt: any
  ccbssum: any
  ccbsdatasums() {
    this.ccbsamt = this.ccbsdetailForm.value['ccbs'].map(x => x.amount);
    this.ccbssum = this.ccbsamt.reduce((a, b) => (a + b), 0);
  }

  saveccbs() {
    const ccbsdata = this.ccbsdetailForm.value.ccbs
    for (let i in ccbsdata) {
      // ccbsdata[i].debit_id = this.debitdtlid
      ccbsdata[i].cc_code = ccbsdata[i].cc_code.code
      ccbsdata[i].bs_code = ccbsdata[i].bs_code.code
      ccbsdata[i].code = this.ccdataid
      ccbsdata[i].glno = this.debitglnum
    }

    this.ecfservice.ccbscreate(ccbsdata, this.debitdtlid)
      .subscribe(result => {
        console.log("ccbsres", result)
        this.notification.showSuccess("ccbs Detail Saved Successfully")
      })
  }



  debitbacks() {
    this.closebutton.nativeElement.click();


  }




  Roundoffvalue: number = 0;
  Othervalue: number = 0;
  min: number = -1;
  max: number = 1;
  RoundingOFF(e) {
    if (e > this.max) {
      this.Roundoffvalue = 0
      this.toastr.warning("Should not exceed one rupee");
      return false
    }
    else if (e < this.min) {
      this.Roundoffvalue = 0
      this.toastr.warning("Please enter valid amount");
      return false
    }
    else if (e <= this.max) {
      this.Roundoffvalue = e
    }
  }
  otheradjustmentmaxamount: any;
  otheradjustmentminamount: any;
  OtherAdjustment(e) {
    let data = this.InvoiceHeaderForm.value.invoiceheader
    for (let i in data) {
      let invamt = Number(data[i].invoiceamount)
      let roundamt = Number(data[i].roundoffamt)
      this.otheradjustmentmaxamount = invamt + roundamt

    }

    if (e > this.otheradjustmentmaxamount) {
      this.Othervalue = 0
      this.toastr.warning("Other Adjustment Amount should not exceed taxable amount");
      return false
    }


  }


  numberOnlyandDotminus(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57) && ((charCode < 45 || charCode > 46))) {
      return false;
    }
    return true;
  }

  backform() {
    this.onCancel.emit()

  }

  overallback() {
    this.onCancel.emit()
  }


  suppliersubmitForm() {
    this.closebuttons.nativeElement.click();
  }

  supplierbackform() {
    this.closebuttons.nativeElement.click();
  }

  characterOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 96 || charCode > 122)) {
      return false;
    }
    return true;
  }

  characterandnumberonly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 96 || charCode > 122) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  findDetails(section, index) {
    console.log("sections", section)
    console.log("indexes", index)
    return this.getdebitresrecords['debit'].filter(x => x.id === section.value.id);


  }

  getdebitsplit(data, index) {
    // this.adddebitSection()
    console.log("data1", data.value.id)
    console.log("data2", index)
    console.log("data3", this.getdebitresrecords['debit'][index]['id'])
    // if(this.getdebitresrecords['debit'][index]['id'] == data.value.id){
    //  this.getCcbsSections(form)
    // }
    return this.getdebitresrecords['debit'].filter(x => x.id === data.value.id);

  }

  addsplit(index, data) {
    console.log("section", data)
    this.debitdtlid = data.value.id
    let ind = index + 1
    const control = <FormArray>this.DebitDetailForm.get('debitdtl');
    control.insert(ind, this.debitdetail())
    this.DebitDetailForm.get('debitdtl')['controls'][ind].get('category_code').setValue(data.value.category_code)
    this.DebitDetailForm.get('debitdtl')['controls'][ind].get('subcategory_code').setValue(data.value.subcategory_code)
    this.DebitDetailForm.get('debitdtl')['controls'][ind].get('debitglno').setValue(data.value.debitglno)
    this.DebitDetailForm.get('debitdtl')['controls'][ind].get('splitted').setValue(1)
    //  let datas = this.DebitDetailForm.value.debitdtl[ind]
    //  datas['splited'] = 1
    //  console.log("ddtl",  this.DebitDetailForm.value.debitdtl)
    //  console.log("ddtl1", datas)
  }


}








