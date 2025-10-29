import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ShareService } from '../share.service';
import { DataService } from 'src/app/inward/inward.service';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
import { EcfapService } from '../ecfap.service';
export interface SupplierName {
  id: number;
  name: string;
}

@Component({
  selector: 'app-poview',
  templateUrl: './poview.component.html',
  styleUrls: ['./poview.component.scss']
})
export class PoviewComponent implements OnInit {
  POHeaderForm:FormGroup;
  POInvoiceForm:FormGroup;
  POMakerForm:FormGroup;

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
  @Output() onCancel = new EventEmitter<any>();
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('Suppliertype') matsupAutocomplete: MatAutocomplete;
  @ViewChild('suppInput') suppInput: any;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  isLoading = false;
  showsupppopup = true;
  invoiceyesno=[{ 'value': 1, 'display': 'Yes' }, { 'value': 0, 'display': 'No' }];
  tomorrow = new Date();
  constructor(private fb:FormBuilder,private shareservice:ShareService,private dataservice:DataService,private SpinnerService:NgxSpinnerService,
    private errorHandler:ErrorHandlingService,private ecfapservice:EcfapService) { }
 
  ngOnInit(): void {
    let ponum = this.shareservice.ponumber.value
    let podata = {"po_no":ponum}
    // this.dataservice.getpoheader(podata).subscribe(result=>{
    //   console.log("pores",result)
    //   this.getpohdrrecords(result)
    // })
    this.POHeaderForm = this.fb.group({
      date:[''],
      state:[''],
      invoice_no:[''],
      amount:['']
    })
  

  this.POInvoiceForm = this.fb.group({
    poheader:new FormArray([
      this.podetails()
    ])
  })

  this.POMakerForm = this.fb.group({
    is_gst:[''],
    supplier_name:[''],
    invoice_date:[''],
    invoice_no:[''],
    amount:[''],
    taxableamount:[''],
    po_number:[''],
    is_original_invoice:[''],
    type:[''],
    supplier_gst:[''],
    employee:[''],
    branch:[''],
    branch_gstno:[''],
    mep_no:[''],
    remarks:['']
  })

  this.POMakerForm.patchValue({
    type:"PO",
    po_number:ponum
  })

  this.SelectSupplierForm = this.fb.group({
    gstno: [''],
    code: [''],
    panno: [''],
    name: ['']
  })
}

podetails(){
  let group = new FormGroup({
    id : new FormControl(''),
    product_name : new FormControl(''),
    grn_code : new FormControl(''),
    uom : new FormControl(''),
    unitprice: new FormControl(''),
    qty : new FormControl(''),
    qty_read : new FormControl(''),
    balance : new FormControl(''),
    select : new FormControl(''),
    current_invoice_qty : new FormControl(''),
    amt : new FormControl('')
  })
  return group
}

getSections(forms) {
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

    id.setValue(pohdr?.podetails_id?.id)
    product_name.setValue(pohdr?.podetails_id?.product_name)
    grn_code.setValue(pohdr?.inwardheader?.code)
    uom.setValue(pohdr?.podetails_id?.unitprice)
    unitprice.setValue(pohdr?.podetails_id?.uom)
    qty.setValue(pohdr?.podetails_id?.qty)
    qty_read.setValue(pohdr?.paidqty)
    balance.setValue(pohdr?.balance_quantity)
    select.setValue("")
    current_invoice_qty.setValue(pohdr?.grn_quantity)
    amt.setValue(pohdr?.podetails_id?.amount)
    
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
      amt:amt
}))
  }
}

cancel(){
  this.onCancel.emit()
}

only_numalpha(event) {
  var k;
  k = event.charCode;
  return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
}

statename: any
SupplierName:any;
getsuppView(data) {
  console.log("dataaa",data)
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
        this.statename = result?.address_id?.state_id?.name
        this.POMakerForm.patchValue({
          supplier_name:data?.name,
          supplier_gst: result?.gstno
        })
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
  this.ecfapservice.getselectsupplierSearch(this.searchsupplier, 1)
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
branchgstnumber:any
GSTType:any
inputSUPPLIERStateid:any
inputSUPPLIERgst:any
StateID:any

Branchcallingfunction() {
  this.ecfapservice.GetbranchgstnumberGSTtype(this.supplierid,'')
    .subscribe((results) => {
      let datas = results;
      this.branchgstnumber = datas.Branchgst
      this.GSTType = datas.Gsttype
      // console.log("GST type", this.GSTType)
      // console.log("branchgst number", this.branchgstnumber)
    })
  this.inputSUPPLIERValue =  this.SupplierName;
  this.inputSUPPLIERStateid = this.StateID;
  this.inputSUPPLIERgst = this.SupplierGSTNumber;
}




}
