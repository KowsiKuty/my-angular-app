import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, FormControlDirective,Validators } from '@angular/forms';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { ApService } from '../ap.service';
import { ApShareServiceService } from '../ap-share-service.service';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { fromEvent, pipe } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { data } from 'jquery';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { I } from '@angular/cdk/keycodes';

const isSkipLocationChange = environment.isSkipLocationChange

export interface paymodelistss {
  code: string;
  id: string;
  name: string;
}

export interface debbanklistss {
  account_no: string;
  id: string;
  accountholder: string;
}
export interface commoditylistss {
  id: string;
  name: string;
}

export interface approverListss {
  full_name: string;
  id: number;
}
export interface branchListss {
  id: any;
  name: string;
  code: string;
  codename: string;

}

export interface prodlistss {
  code: any;
  id: any;
  name: string;
  uom_id: {
        code: any,
        id: any,
        name: string
        }  
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

export interface OriginalInv {
  id: string;
  text: string;
}

export interface cred {
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
  selector: 'app-inv-detail-view',
  templateUrl: './inv-detail-view.component.html',
  styleUrls: ['./inv-detail-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class InvDetailViewComponent implements OnInit {
  fromecf = false 
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
  advancetypeList:any
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
  aptypeid: any = 2
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
  showccbspopup = true
  
  showtaxtypes = [true, true, true,true, true, true,true, true, true]
  showtaxrates = [true, true, true,true, true, true,true, true, true]
  showaddinvheader = false
  hideinv = false

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild('commoditytype') matcommodityAutocomplete: MatAutocomplete;
  @ViewChild('commodityInput') commodityInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]
  trueorfalse = [{ 'value': true, 'display': 'True'}, { 'value': false, 'display': 'False'}]
  
  showinvoicediv =true
  showdebitdiv=false
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
  invoiceno: any
  invheaderdata: any
  invoiceheaderres: any
  ivoicehid: any
  @Output() linesChange = new EventEmitter<any>();
  @ViewChild('Suppliertype') matsupAutocomplete: MatAutocomplete;
  @ViewChild('suppInput') suppInput: any;
  SupplierName: any
  toto: any
  amt: any
  sum: any
  AddinvDetails = true
  delinvid: any
  getsuplist: any
  discreditbtn = false
  supplierdata: any
//declaration sugu
  // invHdrID=56;
  type1=['exact',
        'supplier',
        'invoice_amount',
        'invoiceno',
        'invoice_date']

  exactList: any;
  withoutSuppList: any;
  withoutInvAmtList: any;
  withoutInvNoList: any;
  withoutInvDtList: any;
  typeid:number;
  data:any=[];
  array:any=[{"auditchecklist":[]}];
  bo:any=[];
  invoicedate:any;
  sta=3;
  cli:boolean=false;
  remark:any;
  rem = new FormControl('', Validators.required);

  showthreshold = false
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

  creditdetForm: FormGroup
  prodList: Array<prodlistss>
  hsnList: Array<hsnlistss>
  uomList: Array<uomlistss>
  @ViewChild('hsntype') mathsnAutocomplete: MatAutocomplete;
  @ViewChild('productInput') productInput: any;
  @ViewChild('prodAutocom') matProdAutocomplete: MatAutocomplete;
  @ViewChild('hsnInput') hsnInput: any;
  @ViewChild('uomtype') matuomAutocomplete: MatAutocomplete;
  @ViewChild('uomInput') uomInput: any;
  @ViewChild('taxtype') mattactypeAutocomplete: MatAutocomplete;
  @ViewChild('taxtypeInput') taxtypeInput: any;
  hsncodess: any
  totaltax: any
  indexDet: any
  invoicedetailsdata: any
  ccbsdata: any
  delinvdtlid: any
  ccbspercentage: any
  AdddebitDetails = true
  INVsum: any
  INVamt: any
  totalamount: any
  totaltaxable: any
  overalltotal: any
  igstrate: any
  cgstrate: any
  sgstrate: any
  type: any

  ecfheaderidd: any


  creditglForm: FormGroup
  accList: any
  showaccno = [false, false, false,false, false, false,false, false, false]
  creditbrnchList: any
  credittranList: any
  showtranspay = [false, false, false,false, false, false,false, false, false]
  showtaxtype = [false, false, false,false, false, false,false, false, false]
  showtaxrate = [false, false, false,false, false, false,false, false, false]
  showeraacc = [false, false, false,false, false, false,false, false, false]
  readonlydebit = [false, false, false,false, false, false,false, false, false]
  showglpopup = false
  glList: any
  taxlist: any
  taxratelist: any

  PaymodeList: any
  debbankList:any
  addcreditindex: any 
  @ViewChild('debitclose') debitclose;
  @ViewChild('closebutton') closebutton;
  @ViewChild('closebuttons') closebuttons;
  @ViewChild('ccbsOpen') ccbsOpen;

  @ViewChild('ccbsclose') ccbsclose;
  @ViewChild('auditclose') auditclose;


  @ViewChild('paymode_id') matpaymodeAutocomplete: MatAutocomplete;
  @ViewChild('paymodeInput') paymodeInput: any;
  @ViewChild('debbank') matdebbankAutocomplete: MatAutocomplete;
  @ViewChild('debbankInput') debbankInput: any;
 

  @ViewChild('cattype') matcatAutocomplete: MatAutocomplete;
  @ViewChild('categoryInput') categoryInput: any;
  @ViewChild('subcategorytype') matsubcatAutocomplete: MatAutocomplete;
  @ViewChild('subcategoryInput') subcategoryInput: any;
  @ViewChild('bstype') matbsAutocomplete: MatAutocomplete;
  @ViewChild('bsInput') bsInput: any;
  @ViewChild('cctype') matccAutocomplete: MatAutocomplete;
  @ViewChild('ccInput') ccInput: any;
  DebitDetailForm: FormGroup
  ccbsForm: FormGroup
  categoryNameData: Array<catlistss>;
  subcategoryNameData: Array<subcatlistss>;
  bsNameData: Array<bslistss>;
  ccNameData: Array<cclistss>;
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






  
  presentpage: number = 1;
  identificationSize: number = 10;
  
  originalInv:Array<OriginalInv>;
  @ViewChild('OriginalInvInput') OrgInvInput: any;
  @ViewChild('isOriginalInv') OriginalInvAutoComplete: MatAutocomplete;
  
  apHdrRes : any
  invHdrRes:any;
  invDetailList:any;
  invDebitList:any;
  invDebitTot:number;
  invCreditList:any;
  invCreditTot:number;
  getgstapplicable: any
  
  apheader_id=this.shareservice.apheader_id.value;
  apinvHeader_id=this.shareservice.apinvHeader_id.value;
  // apheader_id=260
  // apinvHeader_id=159
  frmInvHdr: FormGroup;
  getinvoiceheaderresults: any
  creditid: any;
  invDetails:any={}
  invDet:any
  invCredDet:any

  invdtlsaved:boolean = false
  debitsaved:boolean = false
  creditsaved:boolean = false
  ccbssaved:boolean = false
  
  
  constructor(private service: ApService, private router: Router,  private formBuilder: FormBuilder,private toastr: ToastrService,
    private shareservice: ApShareServiceService, private spinner:NgxSpinnerService,private notification: NotificationService) { }

  ngOnInit(): void {
    this.frmInvHdr=this.formBuilder.group({
      rsrCode:new FormControl(''),
      rsrEmp:new FormControl(''),
      gst:new FormControl(''),

      supCode:new FormControl(''),
      supName:new FormControl(''),
      supGST:new FormControl(''),

      invNo:new FormControl(''),
      invDate:new FormControl(''),
      taxableAmt:new FormControl(''),
      invAmt:new FormControl(''),
     
    })

    this.InvoiceDetailForm = this.formBuilder.group({

      invoicedtls: new FormArray([
      ]),
      
      creditdtl: new FormArray([
      ])
    });

    this.creditdetForm = this.formBuilder.group({
      supName:new FormControl(''),
      isexcempted:new FormControl(''),
      TDSSection: new FormControl(''),
      TDSRate: new FormControl(''),
      thresholdValue: new FormControl(''),
      amountPaid:new FormControl(''),
      normaltdsRate:new FormControl(''),
      bankdetails_id:new FormControl('')
    }),

    this.DebitDetailForm = this.formBuilder.group({

      debitdtl: new FormArray([
      ])
    });

    this.ccbsForm = this.formBuilder.group({

      ccbsdtl: new FormArray([
        // this.ccbsdetail()
      ])
    })
    

    this.creditglForm = this.formBuilder.group({
      name: [''],
      glnum: ['']

    })

    this.gethsn('')
    this.getProduct('')
   
    this.SubmitoverallForm = this.formBuilder.group({
      apheader_id: [''],
      approver_branch: [''],
      approved_by: [''],
      aptype: [''],
      tds: [''],
      remarks: ['']
    })

    this.gettdsapplicable()

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

        switchMap(value => this.service.getbranchscroll(value, 1)
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
    this.SubmitoverallForm.get('approved_by').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')

        }),

        switchMap(value => this.service.getapproverscroll(value, 1)
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

      //get AP Header details

      this.service.getHdrSummary(this.apheader_id)
      .subscribe(result => {
        if (result)
        { 
          this.apHdrRes = result
          console.log("AP Header-->",this.apHdrRes)

          let apres = this.apHdrRes

          this.aptypeid = apres.aptype.id
          if (apres.crno !== null && apres.crno !== undefined && apres.crno !== "")
          {
            this.fromecf = true
            this.SubmitoverallForm.patchValue(
              {
                apheader_id : apres.id,
                approver_branch : apres.approver_branch,
                approved_by: apres.approvedby,
                aptype: apres.aptype.id,
                tds: apres.tds,
                remarks: apres.remark
              })
          }
          else
          {
            this.fromecf = false
            this.SubmitoverallForm.patchValue(
              {
                apheader_id : apres.id,
                aptype: apres.aptype.id,
              })
          }
        }

      })
      this.service.getInvHdr(this.apinvHeader_id)
      .subscribe(result => {
        
        if(result){
          let data=result
          this.invHdrRes=data
          console.log("Invoice Header ",this.invHdrRes); 
          this.getInvHdr(); 
        }
      
       
      },error=>{
        console.log("Error while fetching Inv Header data")
      }            
      )  
      
     
  }

  getInvHdr()
  {  
      if (this.invHdrRes !==undefined && this.invHdrRes!==null)
      {
        this.frmInvHdr.patchValue(
          {
            rsrCode:"",
            rsrEmp:this.invHdrRes.raiser_employeename,
            
            supCode:this.invHdrRes.supplier.code,
            supName:this.invHdrRes.supplier.name,
            supGST:this.invHdrRes.supplier.gstno,

            invNo:this.invHdrRes.invoice_no,
            invDate:this.invHdrRes.invoice_date,
            invAmt:this.invHdrRes.totalamount,
            taxableAmt:this.invHdrRes.invoiceamount,
            gst:this.invHdrRes.invoicegst,
          }           
        )
        this.type = this.invHdrRes.gsttype
        this.typeid= this.invHdrRes.invoicetype.id
        this.invoicedate=this.invHdrRes.invoice_date
        //this.aptype = this.invHdrRes.invoicetype
    
        this.getgstapplicable = this.invHdrRes.invoicegst
   
        //this.invheadertotamount = this.invHdrRes.totalamount
        //this.totalamount = this.invHdrRes.totalamount
        this.suppid = this.invHdrRes.supplier.id
        let invamount = Number(this.invHdrRes.invoiceamount)
        this.totalamount = Number(this.invHdrRes.totalamount)
        let roundamount = Number(this.invHdrRes.roundoffamt)
        this.taxableamount = invamount + roundamount
        // this.taxableamount = this.invHdrRes.invoice_amount

        this.invoiceno = this.invHdrRes.invoice_no
        
        if(this.aptypeid !== 4)
        {
          this.service.getInvDetail(this.apinvHeader_id)
          .subscribe(result => {
            if (result)
            {
            let data=result["data"];
            this.invDetailList =data
            console.log("Invoice Detail ",this.invDetailList);  
            this.getinvoicedtlrecords();
            }        
            },error=>{
              console.log("Error in getting Inv Detail")
            }            
          )
        }
        else
        {
          this.invtotamount = this.invHdrRes.totalamount

          this.service.getInvDebit(this.apinvHeader_id)
          .subscribe(result => {
            if (result)
              {
                this.getdebittdatas =result["data"];
                this.getdebitrecords(this.getdebittdatas)
         
              }       
            },error=>{
              console.log("Debit Detail data not found")
            }            
          ) 

        }

          this.service.getInvCredit(this.apinvHeader_id)
          .subscribe(result => {
            if (result)
              {
                this.invCreditList =result;
                console.log("Invoice Credit Detail ",this.invCreditList);  
                this.getcreditrecords(this.invCreditList); 
              }       
            },error=>{
              console.log("Inv Credit Detail data not found")
            }            
          ) 
          
      }
      else{
        this.toastr.error('Invoice Hdr not available');
        return false;

      }

      // Get Supplier Details

      if (this.suppid !== null || this.suppid !== undefined || this.suppid !== "")
      {
        this.service.getsupplierdet(this.suppid)
        .subscribe(result => {
          if (result)
          {
          this.supplierdata =result["data"][0];
          this.creditdetForm.patchValue(
            {
              supName : this.supplierdata.supplier.name,
              isexcempted : this.supplierdata.isexcempted,
            })

          if(this.supplierdata.isexcempted === "Y")
          {
            this.showthreshold = true
         
            this.creditdetForm.patchValue(
              {
                TDSSection : this.supplierdata.is_throsold,
                TDSRate : this.supplierdata.totalamount,
                thresholdValue : this.supplierdata.excemthrosold,
                amountPaid : this.supplierdata.invoiceamount,
                normaltdsRate : this.supplierdata.totalamount,
              }
            )
          }
          else{
            this.showthreshold = false
          }

          }
                
        },error=>{
            console.log("Error while getting supplier info")
            }            
          ) 
      }
  }
  hsnindex: any
  getindex(index) {
    // console.log("hsnnn", this.hsnindex)
    this.hsnindex = index

  }

  getinvoicedtlrecords() {
    let datas=this.invDetailList
    // this.frmInvHdr=this.formBuilder.group({
    //   rsrCode:new FormControl(''),

    if (datas.length==0){
      console.log("data invoice details ---->",datas)
      return false
    }
    else
    {
    for (let details of datas) {
      let id: FormControl = new FormControl('');
      let description: FormControl = new FormControl('');
      let productcode: FormControl = new FormControl('');
      let productname: FormControl = new FormControl('');
      let hsn: FormControl = new FormControl('');
      let hsn_percentage: FormControl = new FormControl('');
      let uom: FormControl = new FormControl('');
      let unitprice: FormControl = new FormControl(0);
      let quantity: FormControl = new FormControl(0);
      let amount: FormControl = new FormControl(0);
      let cgst: FormControl = new FormControl(0);
      let sgst: FormControl = new FormControl(0);
      let igst: FormControl = new FormControl(0);
      let discount: FormControl = new FormControl(0);
      let taxamount: FormControl = new FormControl(0);
      let totalamount: FormControl = new FormControl(0);

      const invdetFormArray = this.InvoiceDetailForm.get("invoicedtls") as FormArray;

      id.setValue(details.id)
      productcode.setValue(details.productcode)
      productname.setValue(details.productname)
      description.setValue(details.description)
      hsn.setValue(details.hsn)
      hsn_percentage.setValue(details.hsn_percentage)
      uom.setValue(details.uom.uom)
      unitprice.setValue(details.unitprice)
      quantity.setValue(details.quantity)
      amount.setValue(details.amount)
      cgst.setValue(details.cgst)
      sgst.setValue(details.sgst)
      igst.setValue(details.igst)
      discount.setValue(details.discount)
      taxamount.setValue(details.taxamount)
      totalamount.setValue(details.totalamount)

      invdetFormArray.push(new FormGroup({
        id: id,
        productcode: productcode,
        productname: productname,
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
      switchMap(value => this.service.gethsnscroll(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false
            if (value === "") {

              this.InvoiceDetailForm.get('invoicedtls')['controls'][this.hsnindex].get('hsn_percentage').reset()
              this.InvoiceDetailForm.get('invoicedtls')['controls'][this.hsnindex].get('cgst').reset(0)
              this.InvoiceDetailForm.get('invoicedtls')['controls'][this.hsnindex].get('sgst').reset(0)
              this.InvoiceDetailForm.get('invoicedtls')['controls'][this.hsnindex].get('igst').reset(0)
              this.InvoiceDetailForm.get('invoicedtls')['controls'][this.hsnindex].get('taxamount').reset(0)
              this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount)

            }
          }),

        )

      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.hsnList = datas;
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
    })

  // uom.valueChanges
  //   .pipe(
  //     debounceTime(100),
  //     distinctUntilChanged(),
  //     tap(() => {
  //       this.isLoading = true;
  //     }),
  //     switchMap(value => this.service.uomscroll(value, 1)
  //       .pipe(
  //         finalize(() => {
  //           this.isLoading = false
  //         }),
  //       )
  //     )
  //   )
  //   .subscribe((results: any[]) => {
  //     let datas = results["data"];
  //     this.uomList = datas;
  //     this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
  //   })

  this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount)


  unitprice.valueChanges.pipe(
    debounceTime(20)
  ).subscribe(value => {
    // this.calcTotalM(value)
    this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount)
    if (!this.InvoiceDetailForm.valid) {
      return;
    }

    this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
  }
  )

  quantity.valueChanges.pipe(
    debounceTime(20)
  ).subscribe(value => {
    // this.calcTotalM(value)
    this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount)
    if (!this.InvoiceDetailForm.valid) {
      return;
    }

    this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
  }
  )

  amount.valueChanges.pipe(
    debounceTime(20)
  ).subscribe(value => {
    // this.calcTotalM(value)
    this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount)
    if (!this.InvoiceDetailForm.valid) {
      return;
    }

    this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
  }
  )

  taxamount.valueChanges.pipe(
    debounceTime(20)
  ).subscribe(value => {
    // this.calcTotalM(value)
    this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount)
    if (!this.InvoiceDetailForm.valid) {
      return;
    }

    this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
  }
  )


  totalamount.valueChanges.pipe(
    debounceTime(20)
  ).subscribe(value => {
    // this.calcTotalM(value)
    this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount)
    if (!this.InvoiceDetailForm.valid) {
      return;
    }

    this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
  }
  )

  }
  }
}

getcreditrecords(datas) {
  let dta = this.InvoiceDetailForm.value.creditdtl
   
  let creditdet= datas["data"]
  let i=0
  for (let data of creditdet) {
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
    let accno: FormControl = new FormControl('');
    let bankdetails_id: FormControl = new FormControl('');

    // let cred = data.creditbank_id["data"]? data.creditbank_id["data"] : undefined
    // let creddata:any
    // if (cred != undefined)
    // {
    //   if (cred.length > 0)
    //     creddata = cred[0]
    //   else
    //     creddata ={"id" : 0}
    // }
    // else
    // {
    //   creddata ={"id" : 0}
    // }
    const creditdetailformArray = this.InvoiceDetailForm.get("creditdtl") as FormArray;

    if(i==0)
    {
      this.creditdetForm.patchValue(
        {
        bankdetails_id : data.bankdetails })
    }
    id.setValue(data.id)
    invoiceheader_id.setValue(data.apinvoiceheader)
    paymode_id.setValue(data.paymode)
    creditbank_id.setValue(data.creditbank_id)
    this.creditids = data.creditbank_id
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
    this.categoryid = data.category_code
    subcategory_code.setValue(data.subcategory_code)
    this.categoryid = data.subcategory_code
   
    accno.setValue("")
    this.bankdetailsids = data.bankdetails
    bankdetails_id.setValue(data.bankdetails)
    bank.setValue(data.creditbank_id.name)
    ifsccode.setValue(data.creditbank_id.code)

    // console.log("creddata",creddata)
    // if (creddata.id !== 0) {
    //   bank.setValue(creddata.bank.name)
    //   ifsccode.setValue(creddata.ifsccode)
    // } else {
    //   bank.setValue("")
    //   ifsccode.setValue("")
    // }
    branch.setValue("")
    // if (data.creditbank_id != undefined) {
    //   ifsccode.setValue(data.creditbank_id["data"][0]?.ifsccode)
    // } else {
    //   ifsccode.setValue("")
    // }

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
      credittotal: credittotal,
      bankdetails_id: bankdetails_id
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

    i++
  
  }

  let dta1 = this.InvoiceDetailForm.value.creditdtl
 
  if(dta1.length === 0){
    const control = <FormArray>this.InvoiceDetailForm.get('creditdtl');
    control.push(this.creditdetails());
  // let dta = this.InvoiceDetailForm.value.creditdtl
  // console.log("dta",dta)
  // if (dta.length === 1) {
    this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('amount').setValue(this.totalamount)
    this.creditdatasums()
  // }
  }
  
}

calcTotalcreditdatas(amount: FormControl) {
  this.creditdatasums()
}

indexvalueOninvdetails(index) {
  this.indexDet = index
  // this.getgst(index)
}

addinvdtlSection() {

    const control = <FormArray>this.InvoiceDetailForm.get('invoicedtls');
    control.push(this.INVdetail());
    if (this.getgstapplicable === "N") {
      for (let i = 0; i < 15; i++) {

        this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('hsn').disable()
        this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('hsn_percentage').disable()
        this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('igst').disable()
        this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('cgst').disable()
        this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('sgst').disable()
        this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('taxamount').disable()
      }
    }
  }

INVdetail() {
   let group = new FormGroup({
      id: new FormControl(''),
      productcode: new FormControl(''),
      productname: new FormControl(''),
      description: new FormControl(''),
      hsn: new FormControl(''),
      // hsn:this.formBuilder.group({
      //   code: new FormControl("")
      // }),
      hsn_percentage: new FormControl(''),
      uom: new FormControl(''),
      unitprice: new FormControl(0),
      quantity: new FormControl(0),
      amount: new FormControl(0),
      cgst: new FormControl(0),
      sgst: new FormControl(0),
      igst: new FormControl(0),
      discount: new FormControl(0),
      taxamount: new FormControl(0),
      totalamount: new FormControl(0)
    });

    group.get('hsn').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;

        }),
        switchMap(value => this.service.gethsnscroll(value, 1)
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
        switchMap(value => this.service.uomscroll(value, 1)
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
      // console.log("should be called first")
      this.calcTotalM(group)
      // this.datasums()
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

    return group;
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

  
  public displayFnuom(uomtype?: uomlistss): string | undefined {
    return uomtype ? uomtype.name : undefined;
  }

  get uomtype() {
    return this.InvoiceDetailForm.get('uom');
  }

  getuom(uomkeyvalue) {
    this.service.getuom(uomkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.uomList = datas;
        // console.log("uomList", datas)

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
                this.service.uomscroll(this.uomInput.nativeElement.value, this.currentpage + 1)
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

  public displayFnProduct(product?: any): string | undefined {
    if (product.name === undefined)
    {
      return product 
    }
    else
    {
      return product ? product.name : undefined;
   
    }
  }

  getProduct(keyvalue) {
    this.service.getproduct(keyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.prodList = datas;
      })
  }

  getUOMname(uom,ind)
  {
    this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('uom').setValue(uom.name)
  }
  public displayFnhsn(hsntype?: hsnlistss): string | undefined {
    return hsntype ? hsntype.code : undefined;
  }

  get hsntype() {
    return this.InvoiceDetailForm.get('hsn');
  }

  hsnpercent: any
  hsncode: any
  gethsn(hsnkeyvalue) {
    this.service.gethsn(hsnkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.hsnList = datas;
        // console.log("hsnList", datas)
      })
  }

  gethsncode(igstrate, code, ind) {
    this.hsnpercent = igstrate
    this.hsncode = code
    this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('hsn_percentage').setValue(this.hsnpercent)
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
                this.service.gethsnscroll(this.hsnInput.nativeElement.value, this.currentpage + 1)
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

  getgst(data, index) {
    // console.log("hsndataaa", data)
    if (this.getgstapplicable === "Y" ) {
      let overalloffIND = this.InvoiceDetailForm.value.invoicedtls;

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
        // console.log("jsoooon", json)
        this.service.GSTcalculation(json)
          .subscribe(result => {
            // console.log("gstttres", result)
            this.igstrate = result.igst
            this.sgstrate = result.sgst
            this.cgstrate = result.cgst

            this.totaltax = this.igstrate + this.sgstrate + this.cgstrate


            this.InvoiceDetailForm.get('invoicedtls')['controls'][index].get('sgst').setValue(this.sgstrate)
            this.InvoiceDetailForm.get('invoicedtls')['controls'][index].get('cgst').setValue(this.cgstrate)
            this.InvoiceDetailForm.get('invoicedtls')['controls'][index].get('igst').setValue(this.igstrate)
            this.InvoiceDetailForm.get('invoicedtls')['controls'][index].get('taxamount').setValue(this.totaltax)
          })
      }
    }
  }

  calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount: FormControl) {
    const Quantity = quantity.value
    const unitsprice = unitprice.value
    const taxAmount = taxamount.value
    this.totaltaxable = Quantity * unitsprice
    amount.setValue((this.totaltaxable),{ emitEvent: false });
    this.overalltotal = this.totaltaxable + taxAmount
    totalamount.setValue((this.overalltotal), { emitEvent: false });
    this.INVdatasums();
  }

  getinvdtlSections(forms) {
    return forms.controls.invoicedtls.controls;
  }

  removeinvdtlSection(i) {
    const control = <FormArray>this.InvoiceDetailForm.get('invoicedtls');
    control.removeAt(i);
    this.INVdatasums()
  }

  INVdatasums() {
    this.INVamt = this.InvoiceDetailForm.value['invoicedtls'].map(x => x.totalamount);
    this.INVsum = this.INVamt.reduce((a, b) => a + b, 0);
  }

  invdtladdonid: any
  invdtltaxableamount: any
  invdtloverallamount: any
  invdtltaxamount: any
  cgstval: any
  sgstval: any
  igstval: any
  gettaxrate: any

  adddebits(section, data, index) {
    let invdtldatas = this.invoicedetailsdata

    if (invdtldatas[index].productname != section.value.productname) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].description != section.value.description) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].hsn != section.value.hsn.code) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].hsn_percentage != section.value.hsn_percentage) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].uom.name != section.value.uom.name) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].unitprice != section.value.unitprice) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].quantity != section.value.quantity) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].amount != section.value.amount) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].cgst != section.value.cgst) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].sgst != section.value.sgst) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].igst != section.value.igst) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].taxamount != section.value.taxamount) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].totalamount != section.value.totalamount) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else {
      this.adddebit(section, data, index)

    }
  }


  getdebitresrecords: any
  getdebittdatas: any
  creditslno: any
  creditslnos: any
  showdefaultslno :boolean
  showaltslno:boolean

  adddebit(section, data, index) {
    
    this.debitsaved=false

    let datas = this.DebitDetailForm.get('debitdtl') as FormArray
    datas.clear()


    // console.log("debitsec", section)
    if (this.invoicedetailsdata != undefined) {
      let datas = this.invoicedetailsdata[index]
      this.invdtltaxableamount = this.invoicedetailsdata[index].amount
      this.invtotamount = this.invoicedetailsdata[index].totalamount
      this.invdtltaxamount = this.invoicedetailsdata[index].taxamount
      this.cgstval = this.invoicedetailsdata[index].cgst
      this.sgstval = this.invoicedetailsdata[index].sgst
      this.igstval = this.invoicedetailsdata[index].igst
      this.gettaxrate = this.cgstval + this.sgstval + this.igstval
      this.invdtladdonid = datas.id




    } else {
      let sections = section.value
      this.invdtltaxableamount = sections.amount
      this.invtotamount = sections.totalamount
      this.invdtltaxamount = sections.taxamount
      this.cgstval = sections.cgst
      this.sgstval = sections.sgst
      this.igstval = sections.igst
      this.gettaxrate = this.cgstval + this.sgstval + this.igstval
      this.invdtladdonid = sections.id
    }


    if(this.invdtladdonid == undefined || this.invdtladdonid == ""){
      this.notification.showWarning("Please save the Invoice Detail Changes")
      this.showdebitpopup = false
      return false;

    }else{

    this.service.getInvDebit(this.invdtladdonid)
      .subscribe(result => {
        // console.log("getinvdetailsrecords",result)
        if (result)
        {
        this.showinvoicediv=false
        this.showdebitdiv=true
  
        this.getdebittdatas = result["data"]
        let a = this.getdebittdatas
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
            "code": "003",
            "id": 218,
            "name": "GST"

          }

          let bsdata = {
            "code": "003",
            "name": "GST",
            "id": 52

          }

          // for(let i=0;i<2;i++){
          //   if(i == 0){
          //     // this.showdefaultslno = true
          //     this.showaltslno = false
          //     this.creditslno = i + 1
          //   }
          //   if(i == 1 && this.type == "IGST"){
          //     // this.showdefaultslno = false
          //     this.showaltslno = true
          //     this.creditslnos = i+"_"+i
          //   }
          // }

          for (let i = 0; i <= 2; i++) {
            if (i === 0 && this.getgstapplicable == "Y") {             
              this.adddebitSection()
              this.readonlydebit[i] = false
           
              this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.invdtltaxableamount)
              this.debitdatasums()
            }

            if (i == 1 && this.type === "IGST" && this.getgstapplicable == "Y") {
              this.adddebitSection()
              this.readonlydebit[i] = true
                         
              // this.creditslnoss = i + "_" + i
              this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(catdata)
              this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(igstdata)
              this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(igstdata.glno)
              this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.igstval)
              this.DebitDetailForm.get('debitdtl')['controls'][i].get('deductionamount').setValue(0)
              this.DebitDetailForm.get('debitdtl')['controls'][i].get('remarks').setValue('GST')
              // this.DebitDetailForm.get('debitdtl')['controls'][i].get('bs').setValue(bsdata)
              // this.DebitDetailForm.get('debitdtl')['controls'][i].get('cc').setValue(ccdata)              
              //this.DebitDetailForm.get('debitdtl')['controls'][i].get('ccbspercentage').setValue(100)

            }
            if (i == 1 && this.type === "SGST & CGST" && this.getgstapplicable == "Y") {
              this.adddebitSection()
              this.readonlydebit[i] = true
           
              this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(catdata)
              this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(cgstdata)
              this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(cgstdata.glno)
              this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.cgstval)
              this.DebitDetailForm.get('debitdtl')['controls'][i].get('deductionamount').setValue(0)
              this.DebitDetailForm.get('debitdtl')['controls'][i].get('remarks').setValue('GST')
              // this.DebitDetailForm.get('debitdtl')['controls'][i].get('bs').setValue(bsdata)
              // this.DebitDetailForm.get('debitdtl')['controls'][i].get('cc').setValue(ccdata)
             
              // this.DebitDetailForm.get('debitdtl')['controls'][i].get('ccbspercentage').setValue(100)
            }

            if (i == 2 && this.type === "SGST & CGST" && this.getgstapplicable == "Y") {
              this.adddebitSection()
              this.readonlydebit[i] = true
           
              this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(catdata)
              this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(sgstdata)
              this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(sgstdata.glno)
              this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.sgstval)
              this.DebitDetailForm.get('debitdtl')['controls'][i].get('deductionamount').setValue(0)
              this.DebitDetailForm.get('debitdtl')['controls'][i].get('remarks').setValue('GST')
              // this.DebitDetailForm.get('debitdtl')['controls'][i].get('bs').setValue(bsdata)
              // this.DebitDetailForm.get('debitdtl')['controls'][i].get('cc').setValue(ccdata)
              // this.DebitDetailForm.get('debitdtl')['controls'][i].get('ccbspercentage').setValue(100)
            }
            if (this.igstval == 0 && this.cgstval == 0 && this.sgstval == 0 && i == 0 && this.getgstapplicable == "N") {
              this.adddebitSection()
              this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.invdtltaxableamount)
              this.debitdatasums()
            }
          }

        

        }
      

        if (this.getdebittdatas.length>0) {
          this.getdebitrecords(this.getdebittdatas)
         
        }
      }
      })
    }

  }

  getdebitrecords(datas) {
    console.log(datas)
   
    if(datas.length == 0){
      const control = <FormArray>this.DebitDetailForm.get('debitdtl');
      control.push(this.debitdetail());
    }
    else
    {
      let amt:any
      let sum:any

      amt = datas.map(x => x.amount)
      sum = amt.reduce((a,b) => a+b,0)
      if(sum !== this.invtotamount)
      {
        for(let debit of datas)
        {
          this.service.invDebitDel(debit.id)
          .subscribe(result => {
           if(result.status == "success"){
            console.log("deleted",)
           }else{
            this.notification.showError(result.description) 
           }
          })
        }
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
          "code": "003",
          "id": 218,
          "name": "GST"
  
        }
  
        let bsdata = {
          "code": "003",
          "name": "GST",
          "id": 52
  
        }
  
        // for(let i=0;i<2;i++){
        //   if(i == 0){
        //     // this.showdefaultslno = true
        //     this.showaltslno = false
        //     this.creditslno = i + 1
        //   }
        //   if(i == 1 && this.type == "IGST"){
        //     // this.showdefaultslno = false
        //     this.showaltslno = true
        //     this.creditslnos = i+"_"+i
        //   }
        // }
  
        for (let i = 0; i <= 2; i++) {
          if (i === 0 && this.getgstapplicable == "Y") {
            this.adddebitSection()
            this.readonlydebit[i] = false
           
            this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.invdtltaxableamount)
            this.debitdatasums()
          }
  
          if (i == 1 && this.type === "IGST" && this.getgstapplicable == "Y") {
            this.adddebitSection()
            this.readonlydebit[i] = true
           
            // this.creditslnoss = i + "_" + i
            this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(catdata)
            this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(igstdata)
            this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(igstdata.glno)
            this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.igstval)
            this.DebitDetailForm.get('debitdtl')['controls'][i].get('deductionamount').setValue(0)
            this.DebitDetailForm.get('debitdtl')['controls'][i].get('remarks').setValue('GST')
          }
          if (i == 1 && this.type === "SGST & CGST" && this.getgstapplicable == "Y") {
            this.adddebitSection()
            this.readonlydebit[i] = true
           
            this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(catdata)
            this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(cgstdata)
            this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(cgstdata.glno)
            this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.cgstval)
            this.DebitDetailForm.get('debitdtl')['controls'][i].get('deductionamount').setValue(0)
            this.DebitDetailForm.get('debitdtl')['controls'][i].get('remarks').setValue('GST')
          }
          if (i == 2 && this.type === "SGST & CGST" && this.getgstapplicable == "Y") {
            this.adddebitSection()
            this.readonlydebit[i] = true
           
            this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(catdata)
            this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(sgstdata)
            this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(sgstdata.glno)
            this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.sgstval)
            this.DebitDetailForm.get('debitdtl')['controls'][i].get('deductionamount').setValue(0)
            this.DebitDetailForm.get('debitdtl')['controls'][i].get('remarks').setValue('GST')
          }
          if (this.igstval == 0 && this.cgstval == 0 && this.sgstval == 0 && i == 0 && this.getgstapplicable == "N") {
            this.adddebitSection()
            this.readonlydebit[i] = false
           
            this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.invdtltaxableamount)
            this.debitdatasums()
          }
        }
      }
      else
      {   
      let i=0
      for (let debit of datas) {  
        let id: FormControl = new FormControl('');
        let apinvoicehdr_id: FormControl = new FormControl('');
        let category_code: FormControl = new FormControl('');
        let subcategory_code: FormControl = new FormControl('');
        let debitglno: FormControl = new FormControl('');
        let amount: FormControl = new FormControl('');
        let deductionamount: FormControl = new FormControl(0);
        let remarks: FormControl = new FormControl('');
        const debitFormArray = this.DebitDetailForm.get("debitdtl") as FormArray;  
  
        id.setValue(debit.id)
        apinvoicehdr_id.setValue(debit.apinvoiceheader)
        if(debit.category_code.code === "GST Tax")
        {
          this.readonlydebit[i] = true
        }
        else
        {
          this.readonlydebit[i] = false
        }
        category_code.setValue(debit.category_code)
        subcategory_code.setValue(debit.subcategory_code)
        debitglno.setValue(debit.debitglno)
    //     if(this.ecftypeid !=4){
      //   if (debit.category_code.code != "GST Tax") {     
       
      //   if(this.totaltaxable != undefined){
      //     amount.setValue(this.totaltaxable)
      //   }else{
      //     amount.setValue(debit.amount)
      //   }
      // }
      // else{
      //   amount.setValue(this.invdtltaxamount)
      // }
    //}
    // //   else{
        amount.setValue(debit.amount)
    //   // }
        deductionamount.setValue(debit.deductionamount)
        i++;
       
        debitFormArray.push(new FormGroup({
          id: id,
          apinvoicehdr_id: apinvoicehdr_id,
          category_code: category_code,
          subcategory_code: subcategory_code,
          debitglno: debitglno,
          amount: amount,
          deductionamount: deductionamount,
          remarks: remarks,
         }))
  
  
        category_code.valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
            }),
            switchMap(value => this.service.getcategoryscroll(value, 1)
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
            switchMap(value => this.service.getsubcategoryscroll(this.catid, value, 1)
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
  
        this.calctotaldebitdata(amount)
  
        amount.valueChanges.pipe(
          debounceTime(20)
        ).subscribe(value => {
          // console.log("should be called first")
          
          // this.debitdatasums()
          this.calcdebiteditamount(amount)
          if (!this.DebitDetailForm.valid) {
            return;
          }
          this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
        }
        )
      }
      }
      

   
  }

    
    
  }

 
  deleteinvdetail(section, ind) {
    let id = section.value.id

    if (id != undefined) {
      this.delinvdtlid = id
    }
    else {

      for (var i = 0; i < this.invDetailList.length; i++) {
        if (i === ind) {
          this.delinvdtlid = this.invDetailList[i].id
        }
      }
    }
    this.service.invDetDel(this.delinvdtlid)

      .subscribe(result => {
        if (result.code != undefined) {
          this.notification.showError(result.description)
        }
        else {
        // console.log("delres2", result)
        this.notification.showSuccess("Deleted Successfully")
        this.removeinvdtlSection(ind)
        this.INVdatasums()
        }
      })
  }

  datasums() {
    this.amt = this.InvoiceDetailForm.value['invoiceheader'].map(x => x.totalamount);
    this.sum = this.amt.reduce((a, b) => a + b, 0);
  }  

  submitinvoicedtl() {
    const invoicedtlss = this.InvoiceDetailForm.value.invoicedtls
    
    let details:any={}

    for (let i in invoicedtlss) {
      if ((invoicedtlss[i].productname == '') || (invoicedtlss[i].productname == null) || (invoicedtlss[i].productname == undefined)) {
        this.toastr.error('Please chosse product');
        return false;
      }

      if ((invoicedtlss[i].description == '') || (invoicedtlss[i].description == null) || (invoicedtlss[i].description == undefined)) {
        this.toastr.error('Please Enter particulars');
        return false;
      }

      if ((invoicedtlss[i].hsn == ''  && this.getgstapplicable === 'Y') || (invoicedtlss[i].hsn== null  && this.getgstapplicable === 'Y') || (invoicedtlss[i].hsn == undefined  && this.getgstapplicable === 'Y')) {
        this.toastr.error('Please Choose hsncode');
        return false;
      }
      
      if ((invoicedtlss[i].unitprice == 0) || (invoicedtlss[i].unitprice == null) || (invoicedtlss[i].unitprice == undefined)) {
        this.toastr.error('Please Enter Unit Price');
        return false;
      }

      if ((invoicedtlss[i].quantity == 0) || (invoicedtlss[i].quantity == null) || (invoicedtlss[i].quantity == undefined)) {
        this.toastr.error('Please Enter Quantity');
        return false;
      }

      if ((invoicedtlss[i].amount == 0) || (invoicedtlss[i].amount == null) || (invoicedtlss[i].amount == undefined)) {
        this.toastr.error('Please Enter Amount');
        return false;
      }

      if (invoicedtlss[i].id === "" || invoicedtlss[i].id === undefined) {
        delete invoicedtlss[i].id
      }

      if (this.INVsum > this.totalamount || this.INVsum < this.totalamount) {
      this.toastr.error('Check Invoice Header Amount', 'Please Enter Valid Amount');
      return false
      }

      invoicedtlss[i].productcode=invoicedtlss[i].productname.code
      invoicedtlss[i].productname=invoicedtlss[i].productname.name     

      // detail[0].amount= invoicedtlss[i].amount
      // detail[0].cgst= invoicedtlss[i].cgst
      // detail[0].description= invoicedtlss[i].particulars
      // detail[0].discount= invoicedtlss[i].discount
      // detail[0].hsn.code= invoicedtlss[i].hsnCode
      // detail[0].hsn_percentage= invoicedtlss[i].hsn_percentage
      // detail[0].igst= invoicedtlss[i].igst
      // detail[0].productcode= invoicedtlss[i].productcode
      // detail[0].productname= invoicedtlss[i].productname
      // detail[0].quantity= invoicedtlss[i].quantity
      // detail[0].sgst= invoicedtlss[i].sgst
      // detail[0].taxamount= invoicedtlss[i].taxamount
      // detail[0].totalamount= invoicedtlss[i].totalamount     
      // detail[0].unitprice= invoicedtlss[i].unitprice
      // detail[0].uom= invoicedtlss[i].uom

      // details[i]=detail[0]
    }
    // let detaildata= invoicedtls.push({invoicedtlss})
 
    let detaildata = {

			"invoicedtls": invoicedtlss

		}
    console.log("input",detaildata)
    this.service.invDetAddEdit(this.apinvHeader_id,detaildata)
    .subscribe(result => {
      if (result.code != undefined) {
        this.notification.showError(result.description)
      }
      else {
        console.log("invdetEDIT RESULT ", result)
        this.notification.showSuccess("Successfully Invoice Details Saved")
        this.invoicedetailsdata = result["data"]
        this.invdtlsaved = true
        return true
      }
    })
}

  
inward_OriginalInv(){
    let keyvalue: String = "";
    this.getOriginalInv(keyvalue);
    this.frmInvHdr.get('isOriginalInvoice').valueChanges
      .pipe(
        startWith(""),
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.service.getInwardOrgInv(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.originalInv = datas;
      })
  }

  private getOriginalInv(keyvalue) {
    this.service.getInwardOrgInv(keyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.originalInv = datas;
      })
  }

  public displayFnOriginalInv(OriginalInv?: OriginalInv): string | undefined {
    return OriginalInv ? OriginalInv.text : undefined;
  }

  autocompleteOriginalInv(){
    setTimeout(() => {
      if (
        this.autocompleteOriginalInv &&
        this.autocompleteTrigger &&
        this.OriginalInvAutoComplete.panel
      ) {
        fromEvent(this.OriginalInvAutoComplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.OriginalInvAutoComplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.OriginalInvAutoComplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.OriginalInvAutoComplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.OriginalInvAutoComplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.service.getInwardOrgInv(this.OrgInvInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.originalInv = this.originalInv.concat(datas);
                    if (this.originalInv.length >= 0) {
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

  invDetDelete(invDetid:any)
  {
    this.service.invDetDel(invDetid)
      .subscribe(result => {
        if (result.code != undefined) {
          this.notification.showError(result.description)
        }
        else {
          this.notification.showSuccess('Deleted Successfully');
          this.getInvHdr();
        } 
      })
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
  backform() {
    //this.router.navigate(['/ap/apHeader'], { skipLocationChange: true });
  }

  creditaddonindex: any
  getcreditindex: any
  amountchangedata: any

  addoncreditindex(indexx, data) {
    this.creditaddonindex = indexx
    this.getcreditindex = indexx
    this.amountchangedata = data
    // console.log("secdata",data)
  }

  public displayPaymode(paymode?: paymodelistss): string | undefined {
    return paymode ? paymode.name : undefined;
  }


  getPaymode() {
    this.service.getPaymode()
      .subscribe((results: any[]) => {
        let paymodedata = results["data"];
        this.PaymodeList = paymodedata;
        // console.log("pll", this.PaymodeList)

      })
  }

  public displaydebbank(debbank?: debbanklistss): string | undefined {
    return debbank ? debbank.account_no : undefined;
  }


  getdebbank() {
    this.service.getdebbankacc("")
      .subscribe((results: any[]) => {
        let debbankdata = results["data"];
        this.debbankList = debbankdata;
        // console.log("pll", this.PaymodeList)

      })
  }

  getCreditSections(form) {
    return form.controls.creditdtl.controls;
  }

  addcreditSection() {
    if ( this.bankdetailsids === '' || this.bankdetailsids === null || this.bankdetailsids === undefined) {
      this.toastr.error('Please Choose Debit Bank')
      return false
    }
    const control = <FormArray>this.InvoiceDetailForm.get('creditdtl');
    control.push(this.creditdetails());
    let dta = this.InvoiceDetailForm.value.creditdtl
    
    if (dta.length === 1) {
      this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('amount').setValue(this.totalamount)
      this.creditdatasums()
    }

    console.log("ci",this.getcreditindex)



  }
  removecreditSection(i) {
    const control = <FormArray>this.InvoiceDetailForm.get('creditdtl');
    control.removeAt(i);
    this.creditdatasums()
  }
  credit: any

  paymodeid: any
  taxableamount: any


  CreditDessss(data, pay, index) {

    this.credit = data
    this.getcreditindex = index
    this.paymodeid = pay.id
    if (this.paymodeid === 5 || this.paymodeid === 8) {


      this.showaccno[index] = true
      this.getaccno(this.paymodeid)

    } else {

      this.showaccno[index] = false


    }

    if (this.paymodeid === 4 || this.paymodeid === 1) {

      this.showeraacc[index] = true
      this.getERA(index)

    } else {
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
      // this.showaccno[index]=false

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
      // this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditglno').reset()

      this.showglpopup = true
      this.creditglForm.patchValue({
        name: pay.name
      })
      this.getcreditgl(this.paymodeid)
    } else {
      this.showglpopup = false
    }
    // console.log("payid", this.paymodeid)
    // this.getcreditpaymodesummary();
  }
  accountno: any
  getacc(accountno, index) {

    this.accountno = accountno
    this.getcreditpaymodesummary()
  }

  optionsummary = false
  firstsummary = true
  creditListed: any
  arraydata: any
  accno: any
  creditids: any
  bankdetailsids : any
  accountnumber: any

  getbankdetailsid(det:any)
  {
    this.bankdetailsids = det
  }

  getcreditpaymodesummary(pageNumber = 1, pageSize = 10) {
    if (this.accountno === undefined) {
      this.accountnumber = this.accnumm
    } else {
      this.accountnumber = this.accountno
    }
    this.service.getcreditpaymodesummaryy(pageNumber, pageSize, this.paymodeid, this.suppid, this.accountnumber)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.creditListed = datas
        // console.log("cpres", datas)
        for (let i of this.creditListed) {

          let accno = i.account_no
          let bank = i.bank_id.name
          let branch = i.branch_id.name
          let ifsc = i.branch_id.ifsccode
          let beneficiary = i.beneficiary
          this.creditids = i.bank_id

          this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditrefno').setValue(accno)
          this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('bank').setValue(bank)
          this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('branch').setValue(branch)
          this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('ifsccode').setValue(ifsc)
          this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('benificiary').setValue(beneficiary)
        }
        this.arraydata = datas.length

        if (this.arraydata === 0) {
          this.optionsummary = true;
          this.firstsummary = false;

        }
        else {
          this.optionsummary = false;
          this.firstsummary = true;

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
  ERAList: any

  getERA(ind) {
    if (this.paymodeid == 4) {
      this.service.geterapaymode(this.paymodeid)
        .subscribe(result => {
          // this.ERAList = result
          this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('creditrefno').setValue(result)
        })
    }

    if (this.paymodeid == 1) {
      this.service.getbrapaymode(this.paymodeid)
        .subscribe(result => {
          // this.ERAList = result
          this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('creditrefno').setValue(result)
        })
    }
  }

  gettaxtype() {
    this.service.gettdstaxtype(this.suppid)
      .subscribe(result => {
        this.vendorid = result.vendor_id
        // console.log("venid", this.vendorid)
        this.taxlist = result['subtax_list']
        this.maintaintaxlist = this.taxlist.filter(dept => dept.dflag === "M");
        this.othertaxlist = this.taxlist.filter(dept => dept.dflag === "O");
      })
  }

  gettaxid(data) {
    this.taxrateid = data.id
    this.taxratename = data.subtax_type
    // console.log("rateidd", this.taxrateid)
    this.gettdstaxrates()
  }

  maintaintaxratelist: any
  othertaxratelist: any
  gettdstaxrates() {
    this.service.gettdstaxrate(this.vendorid, this.taxrateid)
      .subscribe(result => {
        this.taxratelist = result['data']
        this.maintaintaxratelist = this.taxratelist.filter(dept => dept.dflag === "M");
        this.othertaxratelist = this.taxratelist.filter(dept => dept.dflag === "O");

      })

  }
  taxindex: any
  taxrate: any

  gettaxcalc(data, index) {
    this.taxindex = index

    let creditdata = this.InvoiceDetailForm.value.creditdtl
    let taxrate = creditdata[index].suppliertaxrate
    this.taxrate = taxrate
    let taxableamt = creditdata[index].taxableamount

    if (taxrate === undefined || taxrate === "" || taxrate === null || taxableamt === undefined || taxableamt === "" || taxableamt === null) {
      return false
    }

    if (taxrate != undefined || taxrate != "" || taxrate != null || taxableamt != undefined || taxableamt != "" || taxableamt != null) {

      this.service.gettdstaxcalculation(taxableamt, taxrate)
        .subscribe(results => {
          // console.log("taxres", results)
          let amount = results.tdsrate

          this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('amountchange').setValue(amount)

        })
    }

  }
  suppid: any
  creditList: any
  paymodename: any
  creditListeds: any
  getcreditsummary(pageNumber = 1, pageSize = 10) {   
    this.service.getcreditsummary(pageNumber, pageSize, this.suppid)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.creditListeds = datas;
        for (var i = 0; i < datas.length; i++) {
          this.paymodename = datas[i].paymode_id.name
        }
      })

  }

  accdata: any
  accnumm: any
  getaccno(payid) {
    this.service.getbankaccno(payid, this.suppid)
      .subscribe(res => {
        this.accList = res['data']
        this.accdata = this.accList[0].id
        this.accnumm = this.accList[0].account_no
        this.getcreditpaymodesummary()
      })

  }

  getcreditgl(payid) {
    this.service.creditglno(payid)
      .subscribe(res => {
        this.glList = res['data']       
      })
  }

  creditgllno: any
  getgl(glno) {
    this.creditgllno = glno
    this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditglno').setValue(this.creditgllno)
  }

  glsubmitForm() {
    this.closebuttons.nativeElement.click();
  }

  creditdetails() {
    let group = new FormGroup({
      invoiceheader_id: new FormControl(this.apinvHeader_id),
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
      bankdetails_id: new FormControl(''),


    })

    group.get('suppliertaxtype').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.service.gettdstaxtype(this.suppid,)
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
    // console.log('data check amt', this.cdtamt);
    this.cdtsum = this.cdtamt.reduce((a, b) => a + b, 0);
    // console.log('sum of total ', this.cdtsum);
  }
  CreditData: any
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

      if (creditdtlsdatas[i].paymode_id.id === 2) {
        creditdtlsdatas[i].taxableamount = 0
        creditdtlsdatas[i].category_code = this.categoryid
        creditdtlsdatas[i].subcategory_code = this.subcategoryid
        creditdtlsdatas[i].credittotal = this.cdtsum
        creditdtlsdatas[i].creditbank_id = this.creditids
        creditdtlsdatas[i].suppliertax_id = 0
        creditdtlsdatas[i].suppliertaxtype = ""
        creditdtlsdatas[i].suppliertaxrate = 0
        creditdtlsdatas[i].taxexcempted = "N"
        creditdtlsdatas[i].ddtranbranch = 0
        creditdtlsdatas[i].ddpaybranch = 0
      }

      if (creditdtlsdatas[i].paymode_id.id === 4 || creditdtlsdatas[i].paymode_id.id === 1) {
        creditdtlsdatas[i].taxableamount = 0
        creditdtlsdatas[i].category_code = this.categoryid
        creditdtlsdatas[i].subcategory_code = this.subcategoryid
        creditdtlsdatas[i].credittotal = this.cdtsum
        creditdtlsdatas[i].creditbank_id = this.creditids
        creditdtlsdatas[i].suppliertax_id = 0
        creditdtlsdatas[i].suppliertaxtype = ""
        creditdtlsdatas[i].suppliertaxrate = 0
        creditdtlsdatas[i].taxexcempted = "N"
        creditdtlsdatas[i].ddtranbranch = 0
        creditdtlsdatas[i].ddpaybranch = 0
        creditdtlsdatas[i].creditglno = 0
      }

      if (creditdtlsdatas[i].paymode_id.id === 5) {
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

      if (creditdtlsdatas[i].paymode_id.id === 7) {
        creditdtlsdatas[i].taxableamount = this.taxableamount
        creditdtlsdatas[i].category_code = this.categoryid
        creditdtlsdatas[i].subcategory_code = this.subcategoryid
        creditdtlsdatas[i].credittotal = this.cdtsum
        creditdtlsdatas[i].creditbank_id = this.creditids
        creditdtlsdatas[i].creditglno = 0
        creditdtlsdatas[i].suppliertax_id = 0
        creditdtlsdatas[i].suppliertaxtype = this.taxratename
        creditdtlsdatas[i].suppliertaxrate = this.taxrate
        creditdtlsdatas[i].taxexcempted = "N"
        creditdtlsdatas[i].ddtranbranch = 0
        creditdtlsdatas[i].ddpaybranch = 0
      }

      creditdtlsdatas[i].bankdetails_id = this.bankdetailsids.id
        
      delete creditdtlsdatas[i].amountchange
    }

    if (this.cdtsum > this.totalamount || this.cdtsum < this.totalamount) {
      this.toastr.error('Check Invoice Header Amount', 'Please Enter Valid Amount');
      return false
    }

    this.CreditData = this.InvoiceDetailForm.value.creditdtl
    
    let detaildata = {

			"apcredit": this.CreditData

		}
    
    console.log("this.CreditData =",detaildata)
    console.log(JSON.stringify(detaildata))

    this.service.invCreditAddEdit(this.apinvHeader_id, detaildata)
        .subscribe(result => {
          if (result.code != undefined) {
            this.notification.showError(result.description)
          }
          else {
            this.creditid = result.credit
         
            this.notification.showSuccess("Successfully Credit Details Saved!...")
            this.creditsaved = true
          }
        })
  }


  goback() {
    let creditdatas = this.getinvoiceheaderresults['credit']
    if (creditdatas.length != 0) {
      let creditarraydata = this.InvoiceDetailForm.value.creditdtl
      for (let i in creditdatas) {
        for (let j in creditarraydata) {
          if (i == j) {
            if (creditdatas[i].paymode_id != creditarraydata[j].paymode_id) {
              this.notification.showInfo("Please save the changes you have done")
              return false
            }
            else if (creditdatas[i].creditrefno != creditarraydata[j].creditrefno) {
              this.notification.showInfo("Please save the changes you have done")
              return false
            }
            else if (creditdatas[i].suppliertaxtype != creditarraydata[j].suppliertaxtype) {
              this.notification.showInfo("Please save the changes you have done")
              return false
            }
            else if (creditdatas[i].suppliertaxrate != creditarraydata[j].suppliertaxrate) {
              this.notification.showInfo("Please save the changes you have done")
              return false
            }
            else if (creditdatas[i].taxableamount != creditarraydata[j].taxableamount) {
              this.notification.showInfo("Please save the changes you have done")
              return false
            }
            else if (creditdatas[i].amount != creditarraydata[j].amount) {
              this.notification.showInfo("Please save the changes you have done")
              return false
            }
            else if (creditdatas[i].creditglno != creditarraydata[j].creditglno) {
              this.notification.showInfo("Please save the changes you have done")
              return false

            }
          }


          else {


            this.showheaderdata = true
            this.showinvocedetail = false


            let invdtldatas = this.InvoiceDetailForm.get('invoicedtl') as FormArray
            invdtldatas.clear()
            let crdtdtldatas = this.InvoiceDetailForm.get('creditdtl') as FormArray
            crdtdtldatas.clear()



          }
        }
      }
    } else {
      this.showheaderdata = true
      this.showinvocedetail = false


      let invdtldatas = this.InvoiceDetailForm.get('invoicedtl') as FormArray
      invdtldatas.clear()
      let crdtdtldatas = this.InvoiceDetailForm.get('creditdtl') as FormArray
      crdtdtldatas.clear()
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
    let id = section.value.id

    if (id != undefined) {
      this.delcreditid = id
    } else {
      if(this.creditid == undefined){
        this.removecreditSection(ind)
      }else{
      for (var i = 0; i < this.creditid.length; i++) {
        if (i === ind) {
          this.delcreditid = this.creditid[i].id
        }
      }
    }
  }
  if(this.delcreditid != undefined){
    var answer = window.confirm("Are you sure to delete?");
    if (answer) {
      //some code
    }
    else {
      return false;
    }
    this.service.invCreditDel(this.delcreditid)
      .subscribe(result => {
        if(result.status == "success"){
        this.notification.showSuccess("Deleted Successfully")
        this.removecreditSection(ind)
        }else{
          this.notification.showError(result.description) 
         }

      })
    }else{
      this.removecreditSection(ind)
    }

  }

  // -------debit--------


  getDebitSections(form) {

    return form.controls.debitdtl.controls;
  }
  debitindex: any
  adddebitSection() {
    
    const control = <FormArray>this.DebitDetailForm.get('debitdtl');
    control.push(this.debitdetail());
    this.readonlydebit[control.length-1] = false
  }

  adddsplit(section: any, i: number) {
    if (section.value.category_code.code === "GST Tax")
    {
      return false
    }
    const control = <FormArray>this.DebitDetailForm.get('debitdtl');
    // control.push(this.debitdetail());

    control.insert(i+1,this.debitdetail())

    const dbtdetaildata = this.DebitDetailForm.value.debitdtl;
    for(let i=0; i<dbtdetaildata.length; i++)
    {
      if (dbtdetaildata[i].category_code.code !=="GST Tax")
      {
        this.readonlydebit[i] = false
      }
      else
      {
        this.readonlydebit[i] = true
      }
    }


  }

  removedebitSection(i) {

    const control = <FormArray>this.DebitDetailForm.get('debitdtl');
    control.removeAt(i);
    this.debitdatasums()
  }

  debitaddindex: any
  addondebitindex(index) {
    this.debitaddindex = index

  }

  debitdetail() {
    let group = new FormGroup({
      apinvoicehdr_id: new FormControl(),
      category_code: new FormControl(0),
      subcategory_code: new FormControl(0),
      debitglno: new FormControl(''),
      amount: new FormControl(0.0),
      deductionamount: new FormControl(0),
      // debittotal: new FormControl(),
      // cc: new FormControl(),
      // bs: new FormControl(),
      // ccbspercentage: new FormControl(100),
      remarks: new FormControl(''),
      // ccbsdtl: new FormGroup({
      //   cc_code: new FormControl(''),
      //   bs_code: new FormControl(''),
      //   code: new FormControl(''),
      //   glno: new FormControl(''),
      //   ccbspercentage: new FormControl(100),
      //   amount: new FormControl(this.invtotamount),
      //   remarks: new FormControl(),
      // })
    })

    // group.get('ccbspercentage').valueChanges.pipe(
    //   debounceTime(20)
    // ).subscribe(value => {

    //   this.calcTotaldebit(this.debitaddindex)
    //   if (!this.DebitDetailForm.valid) {
    //     return;
    //   }
    //   this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
    // }
    // )

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
        switchMap(value => this.service.getcategoryscroll(value, 1)
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
        switchMap(value => this.service.getsubcategoryscroll(this.catid, value, 1)
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
    // let bskeyvalue: String = "";
    // this.getbs(bskeyvalue);
    // group.get('bs').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap(value => this.service.getbsscroll(value, 1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.bsNameData = datas;
    //     this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
    //   })

    // group.get('cc').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap(value => this.service.getccscroll(this.bssid, value, 1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.ccNameData = datas;
    //     // console.log("ccdata", this.ccNameData)
    //     this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
    //   })


    return group



  }

  calctotaldebitdata(amount: FormControl) {
    this.debitdatasums()
  }






  calamount: any
  subamount: any
  calcTotaldebit(index) {
    let dataOnDetails = this.DebitDetailForm.value.debitdtl
    let percent: any = +dataOnDetails[index].ccbspercentage
    this.calamount = this.invdtltaxableamount * percent / 100
    this.DebitDetailForm.get('debitdtl')['controls'][index].get('amount').setValue(this.calamount)
    // console.log("test", this.calamount)
    this.debitdatasums()
  }

  calcdebitamount(group: FormGroup) {
    const amount = +group.controls['amount'].value;
    group.controls['amount'].setValue((amount), { emitEvent: false });
    this.debitdatasums()
  }

  calcdebiteditamount(amount:FormControl) {
    const amountt = Number(amount.value)
    amount.setValue((amountt), { emitEvent: false });
    this.debitdatasums()
  }

  dbtamt: any
  dbtsum: any
  debitsum: any


  debitdatasums() {
    this.dbtamt = this.DebitDetailForm.value['debitdtl'].map(x => x.amount);
    // console.log('data check amt', this.dbtamt);
    this.dbtsum = this.dbtamt.reduce((a, b) =>(a + b), 0);
  //   let data = this.DebitDetailForm.value.debitdtl
  //   if(this.ecftypeid != 4){
  //   if (data.length === 1) {
  //     this.debitsum = this.invdtltaxableamount + this.gettaxrate
  //     console.log("debittest",data) 
  //   } else {
  //     this.debitsum = this.dbtsum
  //   }
  // }else{
    this.debitsum = this.dbtsum
  // }


  }
  public displaycatFn(cattype?: catlistss): string | undefined {
    return cattype ? cattype.name : undefined;
  }

  get cattype() {
    return this.DebitDetailForm.get('category_code');
  }
  getcat(catkeyvalue) {
    this.service.getcat(catkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryNameData = datas;
        this.catid = datas.id;


      })
  }


  cid(data) {
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
                this.service.getcategoryscroll(this.categoryInput.nativeElement.value, this.currentpage + 1)
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
                this.service.getsubcategoryscroll(this.catid, this.subcategoryInput.nativeElement.value, this.currentpage + 1)
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
  GLNumb
  getsubcat(id, subcatkeyvalue) {
    this.service.getsubcat(id, subcatkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subcategoryNameData = datas;


      })
  }
  getGLNumber(data, index) {
    this.GLNumb = data.glno
    this.DebitDetailForm.get('debitdtl')['controls'][index].get('debitglno').setValue(data.glno)

  }

  public displaybsFn(bstype?: bslistss): string | undefined {
    return bstype ? bstype.name : undefined;
  }

  get bstype() {
    return this.DebitDetailForm.get('bs');
  }
  getbs(bskeyvalue) {
    this.service.getbs(bskeyvalue)
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
                this.service.getbsscroll(this.bsInput.nativeElement.value, this.currentpage + 1)
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
  bsidd: any

  bsid(data, code) {
    this.bssid = data['id'];
    this.bsidd = code;
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
    this.service.getcc(bssid, cckeyvalue)
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
                this.service.getccscroll(this.bssid, this.ccInput.nativeElement.value, this.currentpage + 1)
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
    //this.router.navigate(['ECF/inventory'])

  }

  moveback() {
   // this.router.navigate(['ECF/invdetailcreate'])
  }



  ccidd: any
  cccodeid: any
  getccdata(code, id) {
    this.ccidd = code
    this.cccodeid = id

  }


  Ddetails: any
  debitres: any

  remarkss: any
  debitform() {



    this.Ddetails = this.DebitDetailForm.value.debitdtl;


    const dbtdetaildata = this.DebitDetailForm.value.debitdtl;

    for (let i in dbtdetaildata) {

      if ((dbtdetaildata[i].category_code == '') || (dbtdetaildata[i].category_code == null) || (dbtdetaildata[i].category_code == undefined)) {
        this.toastr.error('Please Choose Category');
        return false;
      }
      if ((dbtdetaildata[i].subcategory_code == '') || (dbtdetaildata[i].subcategory_code == null) || (dbtdetaildata[i].subcategory_code == undefined)) {
        this.toastr.error('Please Choose Sub Category');
        return false;
      }
      if (dbtdetaildata[i].id === "") {
        delete dbtdetaildata[i].id
      }
      dbtdetaildata[i].apinvoicehdr_id = this.apinvHeader_id
      // if(this.ecftypeid == 4){
      //   dbtdetaildata[i].apinvoicedetail = ""
      //   dbtdetaildata[i].debittotal = this.totalamount
      // }else{
       // dbtdetaildata[i].debittotal = this.invtotamount
      //}
    
      // dbtdetaildata[i].category_code = dbtdetaildata[i].category_code.code
      // dbtdetaildata[i].subcategory_code = dbtdetaildata[i].subcategory_code.code
      this.categoryid = dbtdetaildata[i].category_code
      this.subcategoryid = dbtdetaildata[i].subcategory_code
      dbtdetaildata[i].deductionamount = 0
    }
    if (this.debitsum > this.invtotamount || this.debitsum < this.invtotamount) {
      this.toastr.error('Check Invoice Header Amount', 'Please Enter Valid Amount');
      return false
    }

    this.Ddetails = this.DebitDetailForm.value.debitdtl;
    let debdata = {"apdebit" : this.Ddetails}

    let debitaddid 
    if(this.aptypeid !== 4)
    {
      debitaddid = this.invdtladdonid
    }
    else
    {
      debitaddid = this.apinvHeader_id
    }

    this.service.invDebitAddEdit(debitaddid, debdata)
        .subscribe(result => {
          if (result.code != undefined) {
            this.notification.showError(result.description)

          }
          else {
            this.notification.showSuccess("Successfully Debit Details Saved!...")
            this.debitres = result["data"]
            console.log("this.debitres ", this.debitres )
            this.debitsaved = true
           
            //check for ccbs

            this.service.getInvDebit(debitaddid)
            .subscribe(result => {
             if (result)
             {
                this.debitres = result["data"]
      
                let debres =this.debitres
               
                let invdbtdatas = this.DebitDetailForm.get('debitdtl') as FormArray
                invdbtdatas.clear()
               
                this.getdebitrecords(this.debitres)
                for (let debit of debres)
                {
                  if(debit.category_code.code !== "GST Tax")
                  {
                    let debamt=debit.amount
                    let ccbsdata=debit.ccbs
                    if(ccbsdata)
                    {
                      if(ccbsdata.length > 0)
                      {
                        let ccbsamtdata= ccbsdata.map(x => x.amount)
               
                        let sum = ccbsamtdata.reduce((a,b) => a+b,0)        
                        if(sum !== debamt)
                        {
                          this.toastr.warning("Please give CCBS details");
                          //this.ccbsOpen.nativeElement.click();
                          return false
                        }
                      }
                      else
                      {
                       this.toastr.warning("Please give CCBS details");
                       //this.ccbsOpen.nativeElement.click();
                       return false
                      }
                    }
                    else
                    {
                      this.toastr.warning("Please give CCBS details");
                      //this.ccbsOpen.nativeElement.click();                          
                      return false
                    }      
                  }
                } 
              }
              else
              {
                this.debitClose()        
              }
            })     
          }
        })    
        
  }

  debitClose()
  {
      this.showinvoicediv=true
      this.showdebitdiv=false

      let debitcontrol = this.DebitDetailForm.controls["debitdtl"] as FormArray;
      debitcontrol.clear()
      this.debitclose.nativeElement.click();    

  }


  deldebitid: any
  deletedebitdetail(section, ind) {
    if (section.value.category_code.code === "GST Tax")
    {
      return false
    }

    let id = section.value.id

    if (id != undefined) {
      this.deldebitid = id
    } else {

      if(this.debitres == undefined){
        this.removedebitSection(ind)
      }else{
      for (var i = 0; i < this.debitres.length; i++) {
        if (i === ind) {
          this.deldebitid = this.debitres[i].id
        }
      }
    }
    }
    if(this.deldebitid != undefined){
      var answer = window.confirm("Are you sure to delete?");
      if (answer) {
        //some code
      }
      else {
        return false;
      }
    this.service.invDebitDel(this.deldebitid)
      .subscribe(result => {
       if(result.status == "success"){
        this.notification.showSuccess("Deleted Successfully")
        this.removedebitSection(ind)
       }else{
        this.notification.showError(result.description) 
       }
      })

      const dbtdetaildata = this.DebitDetailForm.value.debitdtl;
      for(let i=0; i<dbtdetaildata.length; i++)
      {
        if (dbtdetaildata[i].category_code.code !=="GST Tax")
        {
          this.readonlydebit[i] = false
        }
        else
        {
          this.readonlydebit[i] = true
        }
      }
    
    }else{
      this.removedebitSection(ind)
    }

  }

  debitback() {
    let datas = this.getdebittdatas
    let debitdatas = this.DebitDetailForm.value.debitdtl
    for (let i in datas) {
      for (let j in debitdatas) {
        if (i == j) {
          if (datas[i].category_code.id != debitdatas[j].category_code.id) {
            this.notification.showInfo("Please save the changes you have done")
            return false

          }
          else if (datas[i].subcategory_code.id != debitdatas[j].subcategory_code.id) {
            this.notification.showInfo("Please save the changes you have done")
            return false

          }
          else if (datas[i].debitglno != debitdatas[j].debitglno) {
            this.notification.showInfo("Please save the changes you have done")
            return false

          }
          // else if (datas[i].ccbs.bs_code.code != debitdatas[j].bs.code) {
          //   this.notification.showInfo("Please save the changes you have done")
          //   return false

          // }
          // else if (datas[i].ccbs.cc_code.code != debitdatas[j].cc.code) {
          //   this.notification.showInfo("Please save the changes you have done")
          //   return false

          // }
          // else if (datas[i].ccbs.remarks != debitdatas[j].remarks) {
          //   this.notification.showInfo("Please save the changes you have done")
          //   return false

          // }
          else if (datas[i].amount != debitdatas[j].amount) {
            this.notification.showInfo("Please save the changes you have done")
            return false

          }
          else if (datas[i].deductionamount != debitdatas[j].deductionamount) {
            this.notification.showInfo("Please save the changes you have done")
            return false

          }
          // else if (datas[i].ccbs.ccbspercentage != debitdatas[j].ccbspercentage) {
          //   this.notification.showInfo("Please save the changes you have done")
          //   return false

          // }
        }

        else {
          this.debitclose.nativeElement.click();

        }
      }
    }
  }

  debitbacks() {
               //check for ccbs


               this.service.getInvDebit(this.invdtladdonid)
               .subscribe(result => {
                if (result)
                {
                   this.debitres = result["data"]
         
                   let debres =this.debitres
                   for (let debit of debres)
                   {
                     if(debit.category_code.code !== "GST Tax")
                     {
                       let debamt=debit.amount
                       let ccbsdata=debit.ccbs
                       if(ccbsdata)
                       {
                         if(ccbsdata.length > 0)
                         {
                           let ccbsamtdata= ccbsdata.map(x => x.amount)
                  
                           let sum = ccbsamtdata.reduce((a,b) => a+b,0)        
                           if(sum !== debamt)
                           {
                            var answer = window.confirm("CCBS entry not completed. Are you sure to close debit?");
                            if (answer) {
                              //some code
                            }
                            else {
                              return false;
                            }                            
                           }
                         }
                         else
                         {
                          var answer = window.confirm("CCBS entry not completed. Are you sure to close debit?");
                          if (answer) {
                            //some code
                          }
                          else {
                            return false;
                          }  
                         }
                       }
                       else
                       {
                        var answer = window.confirm("CCBS entry not completed. Are you sure to close debit?");
                        if (answer) {
                          //some code
                        }
                        else {
                          return false;
                        }  
                       }      
                     }
                   } 
                   this.debitClose()   
                }
                 else
                 {
                  this.debitClose()   
                 }
               })
        
  }

 // -------ccbs--------

 getbsdropdown(){
  this.getbs('')
}
 getccbsSections(form) {

  return form.controls.ccbsdtl.controls;
}
ccbsindex: any
addccbsSection() {
 
  const control = <FormArray>this.ccbsForm.get('ccbsdtl');
  control.push(this.ccbsdetail());
}

removeccbsSection(i) {

  const control = <FormArray>this.ccbsForm.get('ccbsdtl');
  control.removeAt(i);
  this.debitdatasums()
}

ccbsaddindex: any =0
addonccbsindex(index) {
    this.ccbsaddindex = index

  }

  ccbsamount: any
  calcTotalccbs(index) {
    let dataOnDetails = this.ccbsForm.value.ccbsdtl
    let percent: any = +dataOnDetails[index].ccbspercentage
    this.ccbsamount = this.debitamount * percent / 100
    this.ccbsForm.get('ccbsdtl')['controls'][index].get('amount').setValue(this.ccbsamount)
    // console.log("test", this.calamount)
    this.debitccbssums()
  }

  calctotalccbsdata(amount: FormControl) {
    this.debitccbssums()
  }



ccbsdetail() {
  let group = new FormGroup({
    id: new FormControl(),    
    cc_code: new FormControl(),
    bs_code: new FormControl(),
    code: new FormControl(),
    ccbspercentage: new FormControl(100),
    glno: new FormControl(''),
    remarks: new FormControl(''),
    amount: new FormControl(0.0),
   
  })

  group.get('ccbspercentage').valueChanges.pipe(
    debounceTime(20)
  ).subscribe(value => {

    this.calcTotalccbs(this.ccbsaddindex)
    if (!this.ccbsForm.valid) {
      return;
    }
    this.linesChange.emit(this.ccbsForm.value['ccbsdtl']);
  }
  )

  group.get('amount').valueChanges.pipe(
    debounceTime(20)
  ).subscribe(value => {

    this.calcdebitamount(group)
    if (!this.ccbsForm.valid) {
      return;
    }
    this.linesChange.emit(this.ccbsForm.value['ccbsdtl']);
  }
  )


  let bskeyvalue: String = "";
  this.getbs(bskeyvalue);
  group.get('bs_code').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.service.getbsscroll(value, 1)
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
      this.linesChange.emit(this.ccbsForm.value['ccbsdtl']);
    })

  group.get('cc_code').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.service.getccscroll(this.bssid, value, 1)
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
      this.linesChange.emit(this.ccbsForm.value['ccbsdtl']);
    })


  return group
}

addccbss(section, data, index) {
  let ccbsdatas = this.ccbsdata

  if (ccbsdatas[index].cc_code != section.value.cc_code) {
    this.notification.showInfo("Please save the changes you have done")
    this.showccbspopup = false
    return false

  }
  else if (ccbsdatas[index].bs_code != section.value.bs_code) {
    this.notification.showInfo("Please save the changes you have done")
    this.showccbspopup = false
    return false

  }
  else if (ccbsdatas[index].ccbspercentage != section.value.ccbspercentage) {
    this.notification.showInfo("Please save the changes you have done")
    this.showccbspopup = false
    return false

  }
  else if (ccbsdatas[index].glno != section.value.glno) {
    this.notification.showInfo("Please save the changes you have done")
    this.showccbspopup = false
    return false

  }
  else if (ccbsdatas[index].remarks != section.value.remarks) {
    this.notification.showInfo("Please save the changes you have done")
    this.showccbspopup = false
    return false

  }
  else if (ccbsdatas[index].amount != section.value.amount) {
    this.notification.showInfo("Please save the changes you have done")
    this.showccbspopup = false
    return false

  }
  else {
    this.addccbs(section, data, index)

  }
}


// getdebitresrecords: any
// getdebittdatas: any
// creditslno: any
// creditslnos: any
// showdefaultslno :boolean
// showaltslno:boolean
debitaddonid:any
debitamount:any
debitglno:any
getccbsdatas: any


addccbs(section, data, index) {
  // if(section.value.category_code.code === "GST Tax")
  // {
  //   return false
  // }

  this.ccbssaved = false
  let datas = this.ccbsForm.get('ccbsdtl') as FormArray
  datas.clear()


  // console.log("debitsec", section)
  if (this.debitres != undefined) {
    let datas = this.debitres[index]
    this.debitglno=datas.glno
    this.debitamount = datas.amount    
    this.debitaddonid = datas.id

  } else {
    let sections = section.value
    this.debitglno=sections.debitglno
    this.debitamount = sections.amount
    this.debitaddonid = sections.id
  }

  if(this.debitaddonid == undefined){
    this.notification.showWarning("Please save the Debit Detail Changes")
    this.showccbspopup = false
    return false;

  }else{

  this.service.getCcbs(this.debitaddonid)
    .subscribe(result => {
       console.log("getccbsrecords",result)
      if (result === undefined)
      {
          return false
      }

      this.getccbsdatas = result["data"]
      if (this.getccbsdatas.length === 0) 
      {
        this.addccbsSection()
        this.ccbsForm.get('ccbsdtl')['controls'][0].get('glno').setValue(this.debitglno)
        this.ccbsForm.get('ccbsdtl')['controls'][0].get('ccbspercentage').setValue(100)
        this.ccbsForm.get('ccbsdtl')['controls'][0].get('amount').setValue(this.debitamount)
        this.debitccbssums()   
      }
      else      
      {
        this.getccbsrecords(this.getccbsdatas)       
      }
    })
  }

}

getccbsrecords(datas) {
  console.log(datas)
 
  if(datas.length == 0){

    const control = <FormArray>this.ccbsForm.get('ccbsdtl');
    control.push(this.ccbsdetail());
  }

  //  console.log("First",datas)
   let ccbsdetails = this.ccbsForm.value.ccbsdtl
    // console.log("Second",invoicedetails)
    let amt:any
    let sum:any

    amt = datas.map(x => x.amount)
    sum = amt.reduce((a,b) => a+b,0)

   if(sum !== this.debitamount)
    {
      for(let ccbs of datas)
      {
        this.service.ccbsdelete(ccbs.id)
        .subscribe(result => {
         if(result.status == "success"){
          console.log("deleted",)
         }else{
          this.notification.showError(result.description) 
         }
        })
      }
    
      this.addccbsSection()
      this.ccbsForm.get('ccbsdtl')['controls'][0].get('glno').setValue(this.debitglno)
      this.ccbsForm.get('ccbsdtl')['controls'][0].get('ccbspercentage').setValue(100)
      this.ccbsForm.get('ccbsdtl')['controls'][0].get('amount').setValue(this.debitamount)
      this.debitccbssums()  
    }
    else{
  for (let ccbs of datas) {
    let id: FormControl = new FormControl('');
    
    let cc_code: FormControl = new FormControl('');
    let bs_code: FormControl = new FormControl('');
    let code: FormControl = new FormControl('');
    let ccbspercentage: FormControl = new FormControl('');
    let glno: FormControl = new FormControl('');
    let remarks: FormControl = new FormControl(0);
    let amount: FormControl = new FormControl('');
    const ccbsFormArray = this.ccbsForm.get("ccbsdtl") as FormArray;

    id.setValue(ccbs.id)
    
    cc_code.setValue(ccbs.cc_code)
    bs_code.setValue(ccbs.bs_code)
    code.setValue(ccbs.code)
    ccbspercentage.setValue(ccbs.ccbspercentage)
    glno.setValue(ccbs.glno)
    remarks.setValue(ccbs.remarks)
    amount.setValue(ccbs.amount)


    ccbsFormArray.push(new FormGroup({
      id: id,
      cc_code: cc_code,
      bs_code: bs_code,
      code: code,
      ccbspercentage: ccbspercentage,
      glno: glno,
      remarks: remarks,
      amount: amount,   


    }))


    
    let bskeyvalue: String = "";
    this.getbs(bskeyvalue);
    bs_code.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.service.getbsscroll(value, 1)
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
        this.linesChange.emit(this.ccbsForm.value['ccbsdtl']);
      })

    cc_code.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.service.getccscroll(this.bssid, value, 1)
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
        this.linesChange.emit(this.ccbsForm.value['ccbsdtl']);
      })

    this.calctotalccbsdata(amount)

    ccbspercentage.valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
      this.calcTotalccbs(this.ccbsaddindex)
      if (!this.ccbsForm.valid) {
        return;
      }
      this.linesChange.emit(this.ccbsForm.value['ccbsdtl']);
    }
    )

    amount.valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
      
      // this.debitdatasums()
      this.calcdebiteditamount(amount)
      if (!this.ccbsForm.valid) {
        return;
      }
      this.linesChange.emit(this.ccbsForm.value['ccbsdtl']);
    }
    )
  }
  }
    
}

ccbsdetails:any
ccbsres: any

ccbsform() {
  const ccbsdata = this.ccbsForm.value.ccbsdtl;

  for (let i in ccbsdata) {

    if ((ccbsdata[i].cc_code == '') || (ccbsdata[i].cc_code == null) || (ccbsdata[i].cc_code == undefined)) {
      this.toastr.error('Please Choose cc');
      return false;
    }
    if ((ccbsdata[i].bs_code == '') || (ccbsdata[i].bs_code == null) || (ccbsdata[i].bs_code == undefined)) {
      this.toastr.error('Please Choose bs');
      return false;
    }
    if (ccbsdata[i].id === "") {
      delete ccbsdata[i].id
    }
    ccbsdata[i].code=ccbsdata[i].cc_code.id
    
    if (this.ccbsssum > this.debitamount || this.ccbsssum < this.debitamount) {
      this.toastr.error('Check Debit Amount', 'Please Enter Valid Amount');
      return false
    }
  }

  this.ccbsdetails = this.ccbsForm.value.ccbsdtl;
  let ccbsdet = {"ccbs" : this.ccbsdetails}
  this.service.ccbsAddEdit(this.debitaddonid, ccbsdet)
      .subscribe(result => {
        if (result.code != undefined) {
          this.notification.showError(result.description)

        }
        else {
          this.notification.showSuccess("Successfully CCBS Details Saved!...")
          this.ccbsres = result
          console.log("this.ccbsres ", this.ccbsres )
          this.ccbssaved =true
          this.ccbsclose.nativeElement.click();
        }
      })    
}

delccbsid: any
deleteccbs(section, ind) {
    let id = section.value.id

    if (id != undefined) {
      this.delccbsid = id
    } else {

      if(this.ccbsres == undefined){
        this.removeccbsSection(ind)
      }else{
      for (var i = 0; i < this.ccbsres.length; i++) {
        if (i === ind) {
          this.delccbsid = this.ccbsres[i].id
        }
      }
    }
    }
    if(this.delccbsid != undefined){
      var answer = window.confirm("Are you sure to delete?");
      if (answer) {
        //some code
      }
      else {
        return false;
      }
    this.service.ccbsdelete(this.delccbsid)
      .subscribe(result => {
       if(result.status == "success"){
        this.notification.showSuccess("Deleted Successfully")
        this.removeccbsSection(ind)
       }else{
        this.notification.showError(result.description) 
       }
      })
    
    }else{
      this.removeccbsSection(ind)
    }

  }

  ccbsamt: any
  ccbssum: any
  ccbsssum: any


  debitccbssums() {
    this.ccbsamt = this.ccbsForm.value['ccbsdtl'].map(x => x.amount);
    this.ccbssum = this.ccbsamt.reduce((a, b) =>(a + b), 0);
    this.ccbsssum = this.ccbssum

  }

  ccbsback() {
    // let datas = this.getdebittdatas
    // let debitdatas = this.DebitDetailForm.value.debitdtl
    // for (let i in datas) {
    //   for (let j in debitdatas) {
    //     if (i == j) {
    //       if (datas[i].category_code.id != debitdatas[j].category_code.id) {
    //         this.notification.showInfo("Please save the changes you have done")
    //         return false

    //       }
    //       else if (datas[i].subcategory_code.id != debitdatas[j].subcategory_code.id) {
    //         this.notification.showInfo("Please save the changes you have done")
    //         return false

    //       }
    //       else if (datas[i].debitglno != debitdatas[j].debitglno) {
    //         this.notification.showInfo("Please save the changes you have done")
    //         return false

    //       }
    //       // else if (datas[i].ccbs.bs_code.code != debitdatas[j].bs.code) {
    //       //   this.notification.showInfo("Please save the changes you have done")
    //       //   return false

    //       // }
    //       // else if (datas[i].ccbs.cc_code.code != debitdatas[j].cc.code) {
    //       //   this.notification.showInfo("Please save the changes you have done")
    //       //   return false

    //       // }
    //       // else if (datas[i].ccbs.remarks != debitdatas[j].remarks) {
    //       //   this.notification.showInfo("Please save the changes you have done")
    //       //   return false

    //       // }
    //       else if (datas[i].amount != debitdatas[j].amount) {
    //         this.notification.showInfo("Please save the changes you have done")
    //         return false

    //       }
    //       else if (datas[i].deductionamount != debitdatas[j].deductionamount) {
    //         this.notification.showInfo("Please save the changes you have done")
    //         return false

    //       }
    //       // else if (datas[i].ccbs.ccbspercentage != debitdatas[j].ccbspercentage) {
    //       //   this.notification.showInfo("Please save the changes you have done")
    //       //   return false

    //       // }
    //     }

    //     else {
    //       this.closebutton.nativeElement.click();

    //     }
    //   }
    // }
  }

  ccbsbacks() {
    // this.closebutton.nativeElement.click();
    let ccbscontrol = this.ccbsForm.controls["ccbsdtl"] as FormArray;
    ccbscontrol.clear()
  }



  Rvalue: number = 0;
  Ovalue: number = 0;
  min: number = -1;
  max: number = 1;
  RoundingOFF(e) {
    if (e > this.max) {
      this.Rvalue = 0
      this.toastr.warning("Should not exceed one rupee");
      return false
    }
    else if (e < this.min) {
      this.Rvalue = 0
      this.toastr.warning("Please enter valid amount");
      return false
    }
    else if (e <= this.max) {
      this.Rvalue = e
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
      this.Ovalue = 0
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

  // backform() {
  //   this.onCancel.emit()

  // }

  overallback() {
    this.router.navigate(['/ap/apHeader'], { skipLocationChange: true });
  }


  suppliersubmitForm() {
    this.closebuttons.nativeElement.click();
  }

  supplierbackform() {
    this.closebuttons.nativeElement.click();
  }

  characterOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 65 || charCode >90)  && (charCode < 96 || charCode > 122) ){ 
    return false;
    }
    return true;
  }

  characterandnumberonly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 65 || charCode >90)  && (charCode < 96 || charCode > 122) && (charCode < 48 || charCode > 57)){ 
    return false;
    }
    return true;
  }
  // ---------overall submit------

  public displayFnbranch(branchtype?: branchListss): string | undefined {

    return branchtype ? branchtype.name : undefined;
  }

  get branchtype() {
    return this.SubmitoverallForm.get('approver_branch');
  }

  public displayFnbranchrole(branchtyperole?: branchListss): string | undefined {

    return branchtyperole ? +branchtyperole.code +"-"+branchtyperole.name : undefined;
   
  }

  get branchtyperole() {
    return this.ecfheaderForm.get('branch');
  }


  private branchdropdown(branchkeyvalue) {
    this.service.getbranch(branchkeyvalue)
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
                this.service.getbranchscroll(this.branchInput.nativeElement.value, this.currentpage + 1)
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



  gettdsapplicable() {
    this.service.gettdsapplicability()
      .subscribe(result => {
      this.tdsList = result['data']
      })
  }

  public displayFnapprover(approvertype?: approverListss): string | undefined {
    return approvertype ? approvertype.full_name : undefined;
  }

  // get approvertype() {
  //   return this.SubmitoverallForm.get('approved_by');
  // }
  approvid: any
  approverid(data) {
   this.approvid = data.id
  }


  private approverdropdown(approverkeyvalue) {
    this.service.getapprover(approverkeyvalue)
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
                this.service.getapproverscroll(this.approverInput.nativeElement.value, this.currentpage + 1)
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

  


  OverallFormSubmit() {

    // if (this.SubmitoverallForm.value.tds === "") {
    //   this.toastr.warning('', 'Please Choose TDS applicability ');
    //   return false;
    // }
   
    // if (this.SubmitoverallForm.value.approved_branch === "") {
    //   this.toastr.warning('', 'Please Choose Approver Branch ');
    //   return false;
    // }

    // if (this.SubmitoverallForm.value.approved_by === "") {
    //   this.toastr.warning('', 'Please Choose Approver ');
    //   return false;
    // }

    // const overallform = this.SubmitoverallForm.value
   
    // overallform.apheader_id=this.apheader_id
    // overallform.approved_by=this.approvid
    // overallform.aptype=this.aptype.id
    // overallform.approver_branch= overallform.approver_branch.id
                    
    this.service.OverallAPSubmit(this.SubmitoverallForm.value)
    
    .subscribe(result => {
      if (result.code != undefined) {
        this.notification.showError(result.description)
        return false
      }
      else {
        this.notification.showSuccess("Successfully AP Created!...")
        this.onSubmit.emit()
        this.submitoverallbtn = true
      }
    })

    //check inv hdr amt and inv dtls total amt

    // this.service.getInvDetail(this.apinvHeader_id)
    //       .subscribe(invresult => {
    //         if (invresult)
    //         {
    //           let data=invresult["data"];
    //           this.invDetailList = data
 
    //           let invdtlamtdata = this.invDetailList.map(x => x.totalamount)
    //           let invdtltotamt = invdtlamtdata.reduce((a,b) => (a+b),0);  

    //           if (this.totalamount !== invdtltotamt)
    //           {
    //             this.toastr.warning('Invoice Header and Detail Amounts Mismatch');
    //             return false;
    //           }

    //            //check inv dtl amt and debit amt

    //           let  invdtl = this.invDetailList

    //           for (let  dtl of invdtl)
    //           {
    //             let invdtlamt =  dtl.totalamount
    //             let invdtlid = dtl.id

    //             this.service.getInvDebit(invdtlid)
    //             .subscribe(debresult => {
    //             if (debresult)
    //             {
    //               this.invDebitList = debresult["data"]
    //               let debitamtdata = this.invDebitList.map(x => x.amount)
    //               let debittotamt = debitamtdata.reduce((a,b) => (a+b),0);  

    //               if (invdtlamt !== debittotamt)
    //               {
    //                 this.toastr.warning('Invoice Detail and Debit Amounts Mismatch');
    //                 return false;
    //               }

    //               //check debit amt and ccbs amts

    //               let  debitdtl = this.invDebitList

    //               for (let  dtl of debitdtl)
    //               {
    //                 if(dtl.category_code.code !== "GST Tax")
    //                   {
    //                     let debitdtlamt =  dtl.amount
    //                     let debitid = dtl.id

    //                     this.service.getCcbs(debitid)
    //                     .subscribe(ccbsresult => {
                        
    //                       if (ccbsresult)
    //                         {
    //                           let ccbsdata = ccbsresult["data"]
    //                           let ccbsamtdata = ccbsdata.map(x => x.amount)
    //                           let ccbstotamt = ccbsamtdata.reduce((a,b) => (a+b),0);  


    //                           if (debitdtlamt !== ccbstotamt)
    //                           {
    //                             this.toastr.warning('Debit and CCBS Amounts Mismatch');
    //                             return false;
    //                           }
    //                         }
    //                       else
    //                         {
    //                           this.toastr.warning('Please give CCBS details');
    //                           return false;
    //                         }
    //                     })  
    //                   }      
    //                 }
    //             }
    //             else
    //             {
    //               this.toastr.warning('Please give Debit details');
    //               return false;
    //             }
    //             })        
    //           }

    //             //check credit amount and invhdr amount
    
    //             this.service.getInvCredit(this.apinvHeader_id)
    //             .subscribe(credresult => {
    //             if (credresult)
    //               {
    //                 this.invCreditList =credresult["data"];
      
    //                 let creditamtdata = this.invCreditList.map(x => x.amount)
    //                 let credittotamt = creditamtdata.reduce((a,b) => (a+b),0);  

    //                 if (this.totalamount !== credittotamt)
    //                   {
    //                     this.toastr.warning('Invoice Header and Credit Amounts Mismatch');
    //                     return false;
    //                   }

    //                   const overallform = this.SubmitoverallForm.value
   
    //                   overallform.apheader_id=this.apheader_id
    //                   overallform.approved_by=this.approvid
    //                   overallform.aptype=this.aptype.id
    //                   overallform.approver_branch= overallform.approver_branch.id
                      
    //                   this.service.OverallAPSubmit(overallform)
    //                   .subscribe(result => {
            
    //                   if (result.code != undefined) {
    //                     this.notification.showError(result.description)
    //                     return false
    //                   }
    //                   else {
    //                     this.notification.showSuccess("Successfully AP Created!...")
    //                     this.onSubmit.emit()
    //                     this.submitoverallbtn = true
            
    //                   }
    //                  })
    //               }
    //             })

                
    //         }
    //         else
    //         {
    //           this.toastr.warning('', 'Please give Invoice details');
    //           return false;
    //         }
    //       })
   
  }


























































































































































































































































































































//Dedup
getdedup()
{
    //dedupe for type(exact)
    this.service.getInwDedupeChk(this.apinvHeader_id,this.type1[0])
    .subscribe(result => {
      this.exactList = result['data']
      console.log("exactList",this.exactList)
  
      // let dataPagination = result['pagination'];
      // if (this.exactList.length >= 0) {
      //   this.has_next = dataPagination.has_next;
      //   this.has_previous = dataPagination.has_previous;
      //   this.presentpage = dataPagination.index;
      //   this.isSummaryPagination = true;
      // } if (this.exactList <= 0) {
      //   this.isSummaryPagination = false;
      // }        
    },error=>{
      console.log("No data found")
    }            
    )
  //dedupe for type(WITHOUT_SUPPLIER)
    this.service.getInwDedupeChk(this.apinvHeader_id,this.type1[1])
  .subscribe(result => {
    this.withoutSuppList = result['data']
    console.log("WITHOUT_SUPPLIER List",this.withoutSuppList)
    // let dataPagination = result['pagination'];
    // if (this.exactList.length >= 0) {
    //   this.has_next = dataPagination.has_next;
    //   this.has_previous = dataPagination.has_previous;
    //   this.presentpage = dataPagination.index;
    //   this.isSummaryPagination = true;
    // } if (this.exactList <= 0) {
    //   this.isSummaryPagination = false;
    // }        
  },error=>{
    console.log("No data found")
  }            
  )
  
  //dedupe for type(WITHOUT_INVOICE_AMOUNT)
  this.service.getInwDedupeChk(this.apinvHeader_id,this.type1[2])
    .subscribe(result => {
      this.withoutInvAmtList = result['data']
      console.log("WITHOUT_INVOICE_AMOUNT List",this.withoutInvAmtList)
      // let dataPagination = result['pagination'];
      // if (this.exactList.length >= 0) {
      //   this.has_next = dataPagination.has_next;
      //   this.has_previous = dataPagination.has_previous;
      //   this.presentpage = dataPagination.index;
      //   this.isSummaryPagination = true;
      // } if (this.exactList <= 0) {
      //   this.isSummaryPagination = false;
      // }        
    },error=>{
      console.log("No data found")
    }             
    )
  
    //dedupe for type(WITHOUT_INVOICE_NUMBER)
  this.service.getInwDedupeChk(this.apinvHeader_id,this.type1[3])
  .subscribe(result => {
    this.withoutInvNoList = result['data']
    console.log("WITHOUT_INVOICE_NUMBER List",this.withoutInvNoList)
  //   let dataPagination = result['pagination'];
  //   if (this.exactList.length >= 0) {
  //     this.has_next = dataPagination.has_next;
  //     this.has_previous = dataPagination.has_previous;
  //     this.presentpage = dataPagination.index;
  //     this.isSummaryPagination = true;
  //   } if (this.exactList <= 0) {
  //    this.isSummaryPagination = false;
  //   }        
  },error=>{
    console.log("No data found")
  }            
  )
  
  //dedupe for type(WITHOUT_INVOICE_DATE)
  this.service.getInwDedupeChk(this.apinvHeader_id,this.type1[4])
    .subscribe(result => {
      this.withoutInvDtList = result['data']
      console.log("WITHOUT_INVOICE_DATE List",this.withoutInvDtList)
      // let dataPagination = result['pagination'];
      // if (this.exactList.length >= 0) {
      //   this.has_next = dataPagination.has_next;
      //   this.has_previous = dataPagination.has_previous;
      //   this.presentpage = dataPagination.index;
      //   this.isSummaryPagination = true;
      // } if (this.exactList <= 0) {
      //   this.isSummaryPagination = false;
      // }        
    },error=>{
      console.log("No data found")
    }            
    )
    this.spinner.hide();
}
getquestion()
{
  this.service.audicservie(this.typeid).subscribe(data=>{
    this.data=data['data'];
    for(let i=0;i<this.data.length;i++){
      this.data[i]['clk']=false;
      this.data[i]['value']=0;       
    }
    console.log('check=',data);
})
}

submitted(){
  this.array=[{"auditchecklist":[]}]
  console.log(this.data);
  for(let i=0;i<this.data.length;i++){
    if(this.data[i]['clk']){
      let dear:any={
        'apauditchecklist_id':this.data[i]['id'],
        'apinvoiceheader_id':this.apinvHeader_id,
        'value':this.data[i]['value']
      };
       }
  }
let obj={
    'auditchecklist':this.bo
  }
  console.log('obj', obj);
  this.service.audiokservie(obj).subscribe(data=>{
    this.notification.showSuccess(data['status'])
   },
   (error)=>{
   alert(error.status+error.statusText);
  }
  )
  this.auditclose.nativeElement.click();
}
ok(i:any,dt)
{
  let val=1;
  let dear:any={
    "apauditchecklist_id":dt.id,
    "apinvoiceheader_id":this.apinvHeader_id,
    "value":val}; 
  console.log(dear)
  console.log("check bounce",dear)
  for(let i=0;i<this.bo.length;i++){
   if(this.bo[i].apauditchecklist_id==dt.id ){
     this.bo.splice(i,1)
   }
  }
this.bo.push(dear)
  console.log("bo",this.bo)
 }
 notok(i:any,dt)
 {
   let d=2;
    let dear:any={
    "apauditchecklist_id":dt.id,
    "apinvoiceheader_id":this.apinvHeader_id,
    "value":d};  
   console.log("check bounce",dear)
   for(let i=0;i<this.bo.length;i++){
    if(this.bo[i].apauditchecklist_id==dt.id ){
      this.bo.splice(i,1)
    }
   }
this.bo.push(dear)
console.log("bo",this.bo)
}
 nap(i:any,dt)
 {
 let d=3
let dear:any={
    "apauditchecklist_id":dt.id,
    "apinvoiceheader_id":this.apinvHeader_id,
    "value":d};
    console.log("check bounce",dear)
    for(let i=0;i<this.bo.length;i++){
     if(this.bo[i].apauditchecklist_id==dt.id ){
       this.bo.splice(i,1)
     }
    }
 this.bo.push(dear)
 console.log("bo",this.bo)
 }
 bounce()
 {
  this.cli=true;
  this.remark=this.rem.value;
  console.log("date",this.invoicedate)
  console.log("Hai",this.remark)
  let bouio:any={
    "status_id":this.sta.toString(),
    "apinvoicehdr_id":this.apinvHeader_id.toString(),
    "invoicedate":this.invoicedate.toString(),
    "remark":this.remark.toString()
};
let obj={
  'auditchecklist':this.bo
}
 this.service.audiokservie(obj).subscribe(data=>{
   console.log(data)
    if(data['status']=="success"){
    this.notification.showSuccess(data['message']);

    }
  }
 )

 this.service.bounce(bouio).subscribe(data=>{
  console.log(data)
 }
)
 console.log("check bounce",obj)
 this.auditclose.nativeElement.click();
 }

 disables(){
   let count=0
   let tocount=0
   for(let i=0;i<this.bo.length;i++)
   {
    if(this.bo[i].value==2){
      count++
    }
    else{
      tocount=tocount+1;
    }
  }
   if(tocount>24){
    return false
    }
    else{
      return true
    }   
   }
   nextClick() {
    if (this.has_next === true) {
    this.presentpage=this.presentpage+1;
       this.getdedup();
    }
  }
previousClick() {
    if (this.has_previous === true) {
this.presentpage=this.presentpage-1;
this.getdedup();
    }
  }
}
