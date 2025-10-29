import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { EcfapService } from '../ecfap.service';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
import { NotificationService } from '../notification.service';
import { ToastrService } from 'ngx-toastr';
import { ShareService } from '../share.service';
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
export interface commoditylistss {
  id: string;
  name: string;
}


export interface branchListss {
  id: any;
  name: string;
  code: string;
  codename: string;
}
export interface SupplierName {
  id: number;
  name: string;
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
  selector: 'app-create-ap',
  templateUrl: './create-ap.component.html',
  styleUrls: ['./create-ap.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})

export class CreateApComponent implements OnInit {
  InvoiceHeaderForm:FormGroup;
  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }];
  showtaxforgst = false;
  showsupppopup = true;
  showsupplierpan = false;
  showsuppliercode = false;
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
  SupplierName: any;
  suplist:any;
  showgstapply = false;
  @Output() linesChange = new EventEmitter<any>();
  isLoading = false;
  toto:any;
  amt:any;
  sum:any;
  poslist: Array<branchListss>;
  showsuppname = true;
  showsuppgst = true;
  showsuppstate = true;
  inputGstValue = "";
  inveditindex:any;
  GstNooo:any;
  supplierindex: any;
  statename: any
  stateid:any;
  supplierid:any;
  selectsupplierlist:any;
  supplierNameData:any;
  @ViewChild('Suppliertype') matsupAutocomplete: MatAutocomplete;
  @ViewChild('suppInput') suppInput: any;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  ecftypeid:any;
  @ViewChild('pos') matposAutocomplete: MatAutocomplete;
  @ViewChild('posInput') posInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  poscurrentpage:any=1
  poshas_next:boolean=true
  poshas_previous:boolean=true
  ppxid:any;
  paytoid:any;
  readinvhdrdata = false;
  tomorrow = new Date();
  @ViewChild('fileInput', { static: false }) InputVars: ElementRef;
  @ViewChildren('fileInput') fileInput: QueryList<ElementRef>;
  @Output() onView = new EventEmitter<any>();
  showaddbtn = false
  showaddbtns = true
  invheadersave = false
  previousvalues : any
  prevoiusheadervalues : any
  currentvalues:any
  currentheadervalues:any
  editkey:any
  formData: FormData = new FormData();
  invoiceheaderres: any;
  AddinvDetails = true;
  Invoicedata: any;
  ecfstatusid:any;
  ecfamount:any;
  inputSUPPLIERValue = "";
  @Output() onCancel = new EventEmitter<any>();
  @ViewChild('closedbuttons') closedbuttons;
  apheader_id:any;
  ECFHeaderForm:FormGroup;
  ecfcrno:any;
  invhdrcrno:any;
  InvoiceHeader:any
  raisergst:any
  commodityList: Array<commoditylistss>;
  ecfid:any
  disableecfsave:boolean = false
  @ViewChild('commoditytype') matcommodityAutocomplete: MatAutocomplete;
  @ViewChild('commodityInput') commodityInput: any;
  constructor(private fb:FormBuilder,private ecfservices:EcfapService,private SpinnerService:NgxSpinnerService,private notification:NotificationService,
    private toastr:ToastrService,private errorHandler:ErrorHandlingService,private shareservice : ShareService,
    private datePipe:DatePipe) { }

  ngOnInit(): void {
    let editkey = this.shareservice.editkey.value
    console.log("editkey",editkey)
    this.editkey = editkey
    let invhdrdata = this.shareservice.invhdrdata.value
    this.ECFHeaderForm = this.fb.group({
      supplier_type: [''],
      commodity_id: [''],
      aptype: [''],
      apdate: new Date(),
      apamount: [''],
      ppx: [''],
      notename: [''],
      remark: [''],
      payto: [''],
      advancetype: [''],
      ppxno: [''],
      branch: [''],
      is_raisedby_self: [true],
      raised_by: [''],
      location: [''],
      inwarddetails_id:[''],
      is_originalinvoice:[''],
      crno:[''],
      branchname:[''],
      apname:[''],
      raisername:['']
    })
    console.log("invhdrdata",invhdrdata)
    this.ecfservices.getInvHdrComplete(invhdrdata?.id).subscribe(result=>{
      let invresdatas = result
      console.log("invresdatas",invresdatas)
      let invresdatas1 = result['data']
      console.log("invresdatas1",invresdatas1)
      this.InvoiceHeader = invresdatas1
      console.log("InvoiceHeader", this.InvoiceHeader)
      this.ecftypeid = invresdatas1[0]?.apheader_details?.aptype_id
      this.ppxid = invresdatas1[0]?.apheader_details?.ppx_id
      this.paytoid = invresdatas1[0]?.apheader_details?.payto_id?.id
      this.ecfamount = invresdatas1[0]?.apheader_details?.apamount
      this.apheader_id = invresdatas1[0]?.apheader_details?.id
      this.ecfcrno = invresdatas1[0]?.apheader_details?.crno
      this.invhdrcrno = invresdatas1[0]?.apinvoiceheader_crno
      this.raisergst = invresdatas1[0]?.raisorbranchgst
      this.ecfid = invresdatas1[0]?.apheader_details?.id
      console.log("raisergst",this.raisergst)
      this.ECFHeaderForm.patchValue({
        apname:this.InvoiceHeader[0]?.apheader_details?.aptype,
        branchname:this.InvoiceHeader[0]?.apheader_details?.branch?.name,
        commodity_id:this.InvoiceHeader[0]?.apheader_details?.commodity_id,
        apamount:this.InvoiceHeader[0]?.apheader_details?.apamount,
        raisername:this.InvoiceHeader[0]?.apheader_details?.raisername,
        apdate: this.datePipe.transform(this.InvoiceHeader[0]?.apheader_details?.apdate, 'dd-MM-yyyy'),
        supplier_type:this.InvoiceHeader[0]?.apheader_details?.supplier_type_id,
        aptype:this.InvoiceHeader[0]?.apheader_details?.aptype_id,
        ppx:this.InvoiceHeader[0]?.apheader_details?.ppx_id,
        notename:this.InvoiceHeader[0]?.apheader_details?.notename,
        remark:this.InvoiceHeader[0]?.apheader_details?.remark,
        payto:this.InvoiceHeader[0]?.apheader_details?.payto_id?.id,
        branch:this.InvoiceHeader[0]?.apheader_details?.branch?.id,
        raised_by:this.InvoiceHeader[0]?.apheader_details?.raisedby,
        inwarddetails_id:this.InvoiceHeader[0]?.apheader_details?.inwarddetails_id,
        is_originalinvoice:this.InvoiceHeader[0]?.apheader_details?.is_originalinvoice,
        crno:this.InvoiceHeader[0]?.apheader_details?.crno
      })
      this.getinvoicehdrrecords(result)
    })
    this.InvoiceHeaderForm = this.fb.group({
      invoicegst:[''],
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
  }

  
  getcommoditydd() {
    let commoditykeyvalue: String = "";
    this.getcommodity(commoditykeyvalue);
    this.ECFHeaderForm.get('commodity_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservices.getcommodityscroll(value, 1)
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
  }
  public displayFncommodity(commoditytype?: commoditylistss): string | undefined {
    return commoditytype ? commoditytype.name : undefined;
  }

  get commoditytype() {
    return this.ECFHeaderForm.get('commodity_id');
  }
  getcommodity(commoditykeyvalue) {
    this.ecfservices.getcommodity(commoditykeyvalue)
      .subscribe(results => {
        if (results) {
          let datas = results["data"];
          this.commodityList = datas;
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
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
                this.ecfservices.getcommodityscroll(this.commodityInput.nativeElement.value, this.currentpage + 1)
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
  commodityid:any
  getcommoditydata(datas) {
    this.commodityid = datas.id
  }

  getinvoicehdrrecords(datas) {
    if (datas?.invoice_header?.length == 0) {
      const control = <FormArray>this.InvoiceHeaderForm.get('invoiceheader');
      control.push(this.INVheader());
    }

    this.InvoiceHeaderForm.patchValue({
      invoicegst:datas?.data[0]?.invoicegst
    })

   
    for (let invhdr of datas?.data) {
      let id: FormControl = new FormControl('');
      let suppname: FormControl = new FormControl('');
      let suppstate: FormControl = new FormControl('');
      let invoiceno: FormControl = new FormControl('');
      let credit_refno: FormControl = new FormControl('');
      let invoicedate: FormControl = new FormControl('');
      let invoiceamount: FormControl = new FormControl('');
      let taxamount: FormControl = new FormControl('');
      let totalamount: FormControl = new FormControl('');
      let otheramount: FormControl = new FormControl('');
      let roundoffamt: FormControl = new FormControl('');
      let invtotalamt: FormControl = new FormControl('');
      let apheader_id: FormControl = new FormControl('');
      let dedupinvoiceno: FormControl = new FormControl('');
      let supplier_id: FormControl = new FormControl('');
      let suppliergst: FormControl = new FormControl('');
      let supplierstate_id: FormControl = new FormControl('');
      let raisorbranchgst: FormControl = new FormControl('');
      let invoicegst: FormControl = new FormControl('');
      let place_of_supply:  FormControl = new FormControl('');
      let bankdetails_id: FormControl = new FormControl('');
      let entry_flag: FormControl = new FormControl('');
      let barcode: FormControl = new FormControl('');
      let creditbank_id: FormControl = new FormControl('');
      let manualsupp_name :FormControl = new FormControl('');
      let manual_gstno :FormControl = new FormControl('')
      let filevalue: FormArray = new FormArray([]);
      let file_key: FormArray = new FormArray([]);

      id.setValue(invhdr.id)
      if (this.ecftypeid == 2 || this.ppxid == "S" || this.ecftypeid == 7 || this.ecftypeid == 4 ||this.ecftypeid == 14) {
        suppname.setValue(invhdr?.supplier_id?.name)
        supplierstate_id.setValue(invhdr?.supplierstate_id?.id)
        suppstate.setValue(invhdr?.supplierstate_id?.name)
        supplier_id.setValue(invhdr?.supplier_id?.id)
        suppliergst.setValue(invhdr?.supplier_id?.gstno)
      } else {
        suppname.setValue("")
        supplierstate_id.setValue("")
        supplier_id.setValue("")
        suppliergst.setValue("")
        suppstate.setValue("")
      }
      invoiceno.setValue(invhdr?.invoiceno)
      credit_refno.setValue(invhdr?.credit_refno)
      invoicedate.setValue(invhdr?.invoicedate)
      invoiceamount.setValue(invhdr?.invoiceamount)
      taxamount.setValue(invhdr?.taxamount)
      totalamount.setValue(invhdr?.totalamount)
      otheramount.setValue(invhdr?.otheramount)
      roundoffamt.setValue(invhdr?.roundoffamt)
      invtotalamt.setValue("")
      dedupinvoiceno.setValue(invhdr?.dedupinvoiceno)
      apheader_id.setValue(invhdr?.ecfheader_id)
      raisorbranchgst.setValue(invhdr?.raisorbranchgst)
      invoicegst.setValue(invhdr?.invoicegst)
      place_of_supply.setValue(invhdr?.place_of_supply)
      bankdetails_id.setValue(invhdr?.bankdetails_id)
      entry_flag.setValue(invhdr?.entry_flag)
      barcode.setValue("")
      creditbank_id.setValue(invhdr?.creditbank_id)
      manualsupp_name.setValue(invhdr?.manualsupp_name)
      manual_gstno.setValue(invhdr?.manual_gstno)
      console.log("manualgst",invhdr?.manual_gstno)
      filevalue.setValue([])
      file_key.setValue([])
      this.inputGstValue = invhdr?.manual_gstno

      this.InvHeaderFormArray().push(new FormGroup({
        id: id,
        suppname: suppname,
        suppstate: suppstate,
        invoiceno: invoiceno,
        credit_refno: credit_refno,
        invoicedate: invoicedate,
        invoiceamount: invoiceamount,
        taxamount: taxamount,
        totalamount: totalamount,
        otheramount: otheramount,
        roundoffamt: roundoffamt,
        invtotalamt: invtotalamt,
        dedupinvoiceno: dedupinvoiceno,
        apheader_id: apheader_id,
        supplier_id: supplier_id,
        suppliergst: suppliergst,
        supplierstate_id: supplierstate_id,
        raisorbranchgst: raisorbranchgst,
        invoicegst: invoicegst,
        place_of_supply:place_of_supply,
        bankdetails_id:bankdetails_id,
        entry_flag:entry_flag,
        barcode:barcode,
        creditbank_id:creditbank_id,
        manualsupp_name:manualsupp_name,
        manual_gstno:manual_gstno,
        filevalue: filevalue,
        file_key: file_key,
        filedataas: this.filefun(invhdr),
        filekey: this.filefun(invhdr)
      }))

      // this.prevoiusheadervalues = JSON.stringify(this.InvoiceHeaderForm.value)
      // console.log("prevoiusheadervalues",this.prevoiusheadervalues)

      this.calchdrTotal(invoiceamount, taxamount, totalamount)

      place_of_supply.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservices.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.poslist = datas;
        this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      })
  
      invoiceamount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        this.calchdrTotal(invoiceamount, taxamount, totalamount)
        if (!this.InvoiceHeaderForm.valid) {
          return;
        }
        this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      }
      )
      taxamount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        this.calchdrTotal(invoiceamount, taxamount, totalamount)
        if (!this.InvoiceHeaderForm.valid) {
          return;
        }
        this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      }
      )
      roundoffamt.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        this.calchdrTotal(invoiceamount, taxamount, totalamount)
        if (!this.InvoiceHeaderForm.valid) {
          return;
        }
        this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      }
      )
      otheramount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        this.calchdrTotal(invoiceamount, taxamount, totalamount)
        if (!this.InvoiceHeaderForm.valid) {
          return;
        }
        this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      }
      )
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
  
  InvHeaderFormArray(): FormArray {
    return this.InvoiceHeaderForm.get('invoiceheader') as FormArray;
  }
  gstyesno: any
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
    this.JsonArray = [];
    this.alternate = false
    this.default = true
    this.submitbutton = false;
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

  
  getheaderedit(i){
    this.inveditindex = i
  }

  INVheader() {
    let pos = {
      
        "code": "1903",
        "codename": "(1903) EXPENSES MANAGEMENT CELL",
        "fullname": "(1903) EXPENSES MANAGEMENT CELL",
        "id": 259,
        "name": "EXPENSES MANAGEMENT CELL"
    
    }
    let group = new FormGroup({
      id: new FormControl(),
      suppname: new FormControl(),
      suppstate: new FormControl(),
      invoiceno: new FormControl(),
      credit_refno: new FormControl(''),
      invoicedate: new FormControl(''),
      invoiceamount: new FormControl(0),
      taxamount: new FormControl(0),
      totalamount: new FormControl(),
      otheramount: new FormControl(0),
      roundoffamt: new FormControl(0),
      invtotalamt: new FormControl(0),
      apheader_id: new FormControl(0),
      dedupinvoiceno: new FormControl(0),
      supplier_id: new FormControl(''),
      suppliergst: new FormControl(''),
      supplierstate_id: new FormControl(''),
      raisorbranchgst: new FormControl(''),
      invoicegst: new FormControl('N'),
      place_of_supply: new FormControl(pos),
      bankdetails_id:  new FormControl(1),
      entry_flag:  new FormControl(0),
      barcode: new FormControl(''),
      creditbank_id: new FormControl(1),
      manual_gstno: new FormControl(''),
      manualsupp_name: new FormControl(''),
      filevalue: new FormArray([]),
      file_key: new FormArray([]),
      filedataas: new FormArray([]),

    })

    group.get('place_of_supply').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.ecfservices.getbranchscroll(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.poslist = datas;
      this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
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
    return group
  }
  calcTotal(group: FormGroup) {
    const Taxableamount = +group.controls['invoiceamount'].value;
    const Taxamount = +group.controls['taxamount'].value;
    const RoundingOff = +group.controls['roundoffamt'].value;
    const Otheramount = +group.controls['otheramount'].value;
    let toto = Taxableamount + Taxamount
    this.toto = toto.toFixed(2)
    group.controls['totalamount'].setValue((this.toto), { emitEvent: false });
    this.datasums();
  }

  datasums() {
    this.amt = this.InvoiceHeaderForm.value['invoiceheader'].map(x => Number(x.totalamount));
    this.sum = this.amt.reduce((a, b) => a + b, 0);

  }

  validationGstNo(e,index) {
    let gstno = e.target.value;
    if (gstno != '' && gstno.length == 15) {
      this.SpinnerService.show();
      let gst = gstno
      gst = gst.slice(2, -3);
      this.GstNooo = gst;


      this.ecfservices.getBracnhGSTNo(gstno)
        .subscribe(res => {
          console.log("gstres",res)
          let result = res.validation_status
          if (result === false) {
            this.notification.showWarning("Please Enter a Valid GST Number")
            // this.SupplierDetailForm.controls['suppliergst'].reset();
            this.SpinnerService.hide();
          } else {
            this.notification.showSuccess(" GST Number Validated...")
            this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('manualsupp_name').setValue(result?.tradeNam)
            this.SpinnerService.hide();
          }
        },
          error => {
            this.notification.showWarning("GST validation failure")
            this.SpinnerService.hide();
          }
        )
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
    this.supplierid = data?.id
    this.ecfservices.getsupplierView(data?.id)
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
          this.statename = result?.address_id?.state_id?.name
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

  SelectSuppliersearch() {
    let searchsupplier = this.SelectSupplierForm?.value;
    if (searchsupplier?.code === "" && searchsupplier?.panno === "" && searchsupplier?.gstno === "") {
      this.getsuppliername("", "");
    }
    else {
      this.SelectSupplierForm.controls['name'].enable();
      this.alternate = true;
      this.default = false;
      this.Testingfunctionalternate();
    }
  }
  searchsupplier: any
  Testingfunctionalternate() {
    this.searchsupplier = this.SelectSupplierForm.value;
    this.ecfservices.getselectsupplierSearch(this.searchsupplier, 1)
      .subscribe(result => {
        if (result['data']?.length > 0) {
          this.selectsupplierlist = result['data']
          if (this.searchsupplier?.gstno?.length === 15 || this.searchsupplier?.panno?.length === 10) {
            let supplierdata = {
              "id": this.selectsupplierlist[0]?.id,
              "name": this.selectsupplierlist[0]?.name
            }
            this.supplierid = supplierdata?.id
            this.SelectSupplierForm.patchValue({ name: supplierdata })
            this.getsuppView(supplierdata)
          }
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
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
    this.ecfservices.getsuppliername(id, suppliername, 1)
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
                this.ecfservices.getsuppliernamescroll(this.suplist, this.suppInput.nativeElement.value, 1, this.currentpage + 1)
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

  public displayFnplace(placeofsupply?: branchListss): string | undefined {
    return placeofsupply ? +placeofsupply.code + "-" + placeofsupply.name : undefined;
  }
  get placeofsupply() {
    return this.InvoiceHeaderForm.get('place_of_supply');
  }

  getposbranch() {
    let poskeyvalue: String = "";
    this.posdropdown(poskeyvalue);
    this.InvoiceHeaderForm.get('place_of_supply').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.ecfservices.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.poslist = datas;
      })
  }
  posdropdown(poskeyvalue) {
    this.ecfservices.getbranch(poskeyvalue)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.poslist = datas;
        }

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }
  
  posScroll() {
    setTimeout(() => {
      if (
        this.matposAutocomplete &&
        this.matposAutocomplete &&
        this.matposAutocomplete.panel
      ) {
        fromEvent(this.matposAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matposAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matposAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matposAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matposAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.poshas_next === true) {
                this.ecfservices.getbranchscroll(this.posInput.nativeElement.value, this.poscurrentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.poslist.length >= 0) {
                      this.poslist = this.poslist.concat(datas);
                      this.poshas_next = datapagination.has_next;
                      this.poshas_previous = datapagination.has_previous;
                      this.poscurrentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  filterTexts(ctrl, ctrlname, index) {
    let text = String(ctrl.value).trim();
    for (let i = 0; i < text.length; i++) {
      let char = text.charAt(i)
      let charcode = text.charCodeAt(i)
      if ((charcode < 65 || charcode > 90) && (charcode < 96 || charcode > 122) && (charcode < 48 || charcode > 57) && (charcode != 32)) {
        text = text.replace(char, "");
        i = i - 1
      }
    }
    if (ctrlname == "invoceno") {
      this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('invoiceno').setValue(text)
    }
    if (ctrlname == "credit_refno") {
      this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('credit_refno').setValue(text)
    }
}
numberOnlyandDot(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}
Taxvalue = 0
headertaxableamount: any
Taxamount(e,index) {
  let data = this.InvoiceHeaderForm?.value?.invoiceheader
  for (let i in data) {
    this.headertaxableamount = Number(data[i]?.invoiceamount)
  }
  if (e > this.headertaxableamount) {
    this.Taxvalue = 0
    this.toastr.warning("Tax Amount should not exceed taxable amount");
    this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('taxamount').setValue(0)
    return false
  }
}
getFileDetails(index, e) {
  let data = this.InvoiceHeaderForm.value.invoiceheader
  for (var i = 0; i < e.target.files.length; i++) {
    data[index]?.filevalue?.push(e?.target?.files[i])
    data[index]?.filedataas?.push(e?.target?.files[i])
  }

  if (e.target.files.length > 0) {
    if (data[index]?.file_key.length < 1) {
      data[index]?.file_key?.push("file" + index);
    }
  }


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
delinvid:any
getfiledetails(datas, ind) {
  this.fileindex = ind
  this.filedatas = datas.value['filekey']
}
deleteinvheader(data, section, ind) {
  let id = section?.value?.id
  if (id != undefined) {
    this.delinvid = id
    var answer = window.confirm("Are you sure to delete?");
    if (answer) {
      this.SpinnerService.show()
      this.ecfservices.invhdrdelete(this.delinvid)
        .subscribe(result => {
          this.SpinnerService.hide()
          if (result?.status === "success") {
            this.notification.showSuccess("Deleted Successfully")
            this.removeSection(ind)
            if (this.InvoiceHeaderForm?.value?.invoiceheader?.length === 0) {
              this.addSection()
            }
          } else {
            this.notification.showError(result?.description)
            return false

          }
        }, error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
    }
    else {
      return false;
    }
  } else {
    this.removeSection(ind)
    if (this.InvoiceHeaderForm?.value?.invoiceheader?.length === 0) {
      this.addSection()
    }
  }
}
ecfheaderid:any
ecfheaderidd:any
gotodetail(section){
  // console.log("section----->",section.value.id)
  if(section.value.id == "" || section.value.id == null || section.value.id == undefined ){
    this.notification.showError("Please Create Invoice Header First");
    return false;
  }else{
  this.shareservice.invheaderid.next(section.value.id)
  this.shareservice.detailsview.next('AP')
  this.shareservice.ecfheaderedit.next(this.ecfheaderid ? this.ecfheaderid : this.ecfheaderidd)
  this.onView.emit()
  // this.router.navigate(['ECFAP/invoicedetail'])
  }
}

submitinvoiceheader() {
  let invheaderresult: boolean
  this.SpinnerService.show();

  // if (this.ecfamount < this.sum || this.ecfamount > this.sum) {
  //   this.toastr.error('Check ECF Header Amount', 'Please Enter Valid Amount');
  //   this.SpinnerService.hide()
  //   return false;
  // }
  // this.currentheadervalues = JSON.stringify(this.InvoiceHeaderForm.value)
  // console.log("currentheadervalues",this.currentheadervalues)
  // if(this.currentheadervalues == this.prevoiusheadervalues){
  //   this.notification.showError("No Changes Detected");
  //   this.SpinnerService.hide();
  //   return false;
  // }
  const invoiceheaderdata = this.InvoiceHeaderForm?.value?.invoiceheader
  for (let i in invoiceheaderdata) {
    if ((invoiceheaderdata[i]?.suppname == '' && this.ecftypeid == 2) || (this.ecftypeid == 7 && invoiceheaderdata[i]?.suppname == '') || (invoiceheaderdata[i]?.suppname == null && this.ecftypeid == 2) || (invoiceheaderdata[i]?.suppname == null && this.ecftypeid == 7) || (invoiceheaderdata[i]?.suppname == undefined && this.ecftypeid == 2) || (invoiceheaderdata[i]?.suppname == undefined && this.ecftypeid == 7)) {
      this.toastr.error('Please Choose Supplier Name');
      this.SpinnerService.hide()
      return false;
    }
    if ((invoiceheaderdata[i]?.invoiceno == '' && this.ecftypeid == 2) || (invoiceheaderdata[i]?.invoiceno == '' && this.ecftypeid == 7) || (invoiceheaderdata[i]?.invoiceno == null && this.ecftypeid == 2) || (invoiceheaderdata[i]?.invoiceno == '' && this.ecftypeid == 7) || (invoiceheaderdata[i]?.invoiceno == undefined && this.ecftypeid == 2) || (invoiceheaderdata[i]?.invoiceno == '' && this.ecftypeid == 7) && this.ppxid != 'E') {
      this.toastr.error('Please Enter Invoice Number');
      this.SpinnerService.hide()
      return false;
    }
    if ((invoiceheaderdata[i]?.invoicedate == '' && this.ppxid != 'E') || (invoiceheaderdata[i]?.invoicedate == null && this.ppxid != 'E') || (invoiceheaderdata[i]?.invoicedate == undefined && this.ppxid != 'E')) {
      this.toastr.error('Please Choose Invoice Date');
      this.SpinnerService.hide()
      return false;
    }
    if ((invoiceheaderdata[i]?.invoiceamount == '') || (invoiceheaderdata[i]?.invoiceamount == null) || (invoiceheaderdata[i]?.invoiceamount == undefined)) {
      this.toastr.error('Please Enter Taxable Amount');
      this.SpinnerService.hide()
      return false;
    }
    if ((invoiceheaderdata[i]?.taxamount == 0 && this.InvoiceHeaderForm?.value?.invoicegst === 'Y' && this.ecftypeid == 2) || (invoiceheaderdata[i]?.taxamount == 0 && this.InvoiceHeaderForm?.value?.invoicegst === 'Y' && this.ecftypeid == 7)) {
      this.toastr.error('Please Enter Tax Amount');
      this.SpinnerService.hide()
      return false;
    }

    if (this.ecftypeid == 7) {
      if ((invoiceheaderdata[i]?.credit_refno == '') || (invoiceheaderdata[i]?.credit_refno == null) || (invoiceheaderdata[i]?.credit_refno == undefined)) {
        this.toastr.error('Please Enter Credit Ref No');
        this.SpinnerService.hide()
        return false;
      }
    }
 
    if (invoiceheaderdata[i]?.filedataas.length <= 0) {
      this.toastr.error('Please Upload File');
      this.SpinnerService.hide()
      return false;

    }
    
    if (invoiceheaderdata[i].id === "" || invoiceheaderdata[i].id === null) {
      delete invoiceheaderdata[i]?.id
    }
    // if (this.ecfheaderid != undefined) {
    //   invoiceheaderdata[i].apheader_id = this.ecfheaderid
    // } else {
    //   invoiceheaderdata[i].apheader_id = this.ecfheaderidd
    // }
    invoiceheaderdata[i].apheader_id = this.apheader_id
    invoiceheaderdata[i].invoicedate = this.datePipe.transform(invoiceheaderdata[i]?.invoicedate, 'yyyy-MM-dd');
    if(typeof(invoiceheaderdata[i].place_of_supply)=='object'){
      invoiceheaderdata[i].place_of_supply = invoiceheaderdata[i]?.place_of_supply?.code
    }else{
      invoiceheaderdata[i].place_of_supply =   invoiceheaderdata[i]?.place_of_supply 
    }
    // invoiceheaderdata[i].invoiceamount = invoiceheaderdata[i].invoiceamount.replace(/,/g, '')
    if (this.ecftypeid == 3) {
      // invoiceheaderdata[i].invoicegst = 'N'
      invoiceheaderdata[i].invoiceno = "inv" + this.datePipe.transform(new Date(), 'ddMM');
    } 
      invoiceheaderdata[i].invoicegst = this.InvoiceHeaderForm?.value?.invoicegst
    
    invoiceheaderdata[i].invtotalamt = this.sum
    invoiceheaderdata[i].raisorbranchgst = this.raisergst
    if (invoiceheaderdata[i]?.suppname == null) {
      invoiceheaderdata[i].suppname = ""
    }
    if (invoiceheaderdata[i]?.taxamount == "" && this.InvoiceHeaderForm?.value?.invoicegst === 'N') {
      invoiceheaderdata[i].taxamount = 0
    }
    if (this.ppxid == 'E') {
      invoiceheaderdata[i].invoiceno = "inv" + this.datePipe.transform(new Date(), 'ddMM');
      invoiceheaderdata[i].invoicedate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    }
    // i == this.inveditindex &&
    if( this.editkey == "modification"){
      invoiceheaderdata[i].edit_flag = 1
      invoiceheaderdata[i].apinvoiceheader_crno =   this.InvoiceHeader[i]?.apinvoiceheader_crno
      invoiceheaderdata[i].debitbank_id =  this.InvoiceHeader[i]?.debitbank_id
    }else if( this.editkey == "edit"){
      invoiceheaderdata[i].edit_flag = 0
      invoiceheaderdata[i].apinvoiceheader_crno =   this.InvoiceHeader[i]?.apinvoiceheader_crno
      invoiceheaderdata[i].debitbank_id =  this.InvoiceHeader[i]?.debitbank_id
    }
    delete invoiceheaderdata[i]?.suppstate
    // delete invoiceheaderdata[i]?.filekey
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
    this.ecfservices.createinvhdrmodification(this.formData)
      .subscribe(result => {
        let invhdrresults = result['invoiceheader']
        for (let i in invhdrresults) {
          if (invhdrresults[i]?.id == undefined) {
            invheaderresult = false
            this.notification.showError(invhdrresults[i]?.description)
            this.SpinnerService.hide()
            return false
          } else {
            invheaderresult = true
          }
        }
        if (invheaderresult == true) {
          this.notification.showSuccess("Successfully Invoice Header Saved!...")
          this.SpinnerService.hide();
          this.invheadersave = true
          this.readinvhdrdata = true
          this.showgstapply = true
          this.showaddbtn = false
          this.showaddbtns = true
          let data = this.InvoiceHeaderForm?.value?.invoiceheader
          for (let i in data) {
            data[i].id = result?.invoiceheader[i]?.id
          }
          this.invoiceheaderres = result?.invoiceheader
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  } else {
    this.ecfservices.invoiceheadercreate(this.formData)
      .subscribe(result => {
        let invhdrresults = result['invoiceheader']
        for (let i in invhdrresults) {
          if (invhdrresults[i]?.id == undefined) {
            invheaderresult = false
            this.notification.showError(invhdrresults[i]?.description)
            this.SpinnerService.hide()
            return false
          } else {
            invheaderresult = true
          }
        }
        if (invheaderresult == true) {
          this.notification.showSuccess("Successfully Invoice Header Saved!...")
          this.SpinnerService.hide();
          this.invheadersave = true
          this.readinvhdrdata = true
          this.showgstapply = true
          this.showaddbtn = false
          this.showaddbtns = true
          this.AddinvDetails = false
          let data = this.InvoiceHeaderForm?.value?.invoiceheader
          for (let i in data) {
            data[i].id = result?.invoiceheader[i]?.id
          }
          this.invoiceheaderres = result?.invoiceheader
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }
}
backform() {
  this.onCancel.emit()
}
only_numalpha(event) {
  var k;
  k = event.charCode;
  return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
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
      switchMap(value => this.ecfservices.getsuppliernamescroll(this.suplist, value, 1, 1)
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
branchgstnumber: any
Branchcallingfunction() {
  this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppname').setValue(this.SupplierName)
  this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppliergst').setValue(this.SupplierGSTNumber)
  this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('supplier_id').setValue(this.supplierid)
  this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('supplierstate_id').setValue(this.stateid)
  this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppstate').setValue(this.statename)
  //   if(this.branchnamecheck != "PRECIOUS METALS DIVISION" || (this.branchnamecheck == "PRECIOUS METALS DIVISION" && (this.locationname == null || this.locationname == ""))){
  //   this.ecfservice.GetbranchgstnumberGSTtype(this.supplierid, this.raiserbranchid)
  //     .subscribe((results) => {
  //       let datas = results;
  //       this.branchgstnumber = datas?.Branchgst
  //       this.type = datas?.Gsttype
  //     })
  //   }else{
  //   this.ecfservice.GetpettycashGSTtype(this.SupplierGSTNumber,this.raisergst)
  //   .subscribe(results=>{
  //     let datas = results;
  //     this.type = datas?.Gsttype

  //   })
  // }
}
getfiles(data) {
  this.SpinnerService.show()
  this.ecfservices.filesdownload(data.file_id)
    .subscribe((results) => {
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = data.file_name;
      link.click();
      this.SpinnerService.hide()
    },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    )
}

fileDeletes(data, index: number) {
  this.ecfservices.deletefile(data)
    .subscribe(result => {
      if (result?.status == 'success') {
        // this.fileList.splice(index, 1);
        this.InvoiceHeaderForm.value.invoiceheader[this.fileindex].filedataas.splice(index, 1)
        this.InvoiceHeaderForm.value.invoiceheader[this.fileindex].filekey.splice(index, 1)
        this.notification.showSuccess("Deleted....")
        // this.closedbuttons.nativeElement.click();
      } else {
        this.notification.showError(result?.description)
        this.closedbuttons.nativeElement.click();
        return false
      }
    })
}
fileback() {
  this.closedbuttons.nativeElement.click();
}
SubmitForm() {
  const currentDate = this.ECFHeaderForm?.value
  currentDate.apdate = this.datePipe.transform(currentDate?.apdate, 'yyyy-MM-dd');
  if (typeof (currentDate.commodity_id) == 'object') {
    currentDate.commodity_id = this.ECFHeaderForm?.value?.commodity_id?.id
  } else if (typeof (currentDate.commodity_id) == 'number') {
    currentDate.commodity_id = currentDate.commodity_id
  } else {
    this.notification.showError("Please Choose any one Commodity Name from the dropdown");
    return false;
  }
  this.SpinnerService.show()
  this.ecfservices.editecfheader(this.ECFHeaderForm?.value, this.ecfid )
          .subscribe(result => {
            this.SpinnerService.hide()
            if (result.id == undefined) {
              this.notification.showError(result?.description)
              this.disableecfsave = true
             
              return false
            }
            else {
              this.notification.showSuccess("Successfully AP Header Saved")
              this.SpinnerService.hide();
            }
          })
}

}
