import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, FormGroupDirective, FormControlName } from '@angular/forms';
import { switchMap, finalize, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { EcfService } from '../ecf.service';
import { ShareService } from '../share.service';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


export interface commoditylistss {
  id: string;
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
  selector: 'app-ecfsummary-view',
  templateUrl: './ecfsummary-view.component.html',
  styleUrls: ['./ecfsummary-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class EcfsummaryViewComponent implements OnInit {
  @Output() linesChange = new EventEmitter<any>();
  @ViewChild(FormGroupDirective) fromGroupDirective: FormGroupDirective
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  ecfheaderviewForm: FormGroup
  InvoiceHeaderForm: FormGroup
  commodityList: Array<commoditylistss>
  TypeList: any
  SupptypeList: any
  isLoading: boolean;
  tomorrow = new Date()
  invheaderdata: any
  ecfheaderid: any
  invoiceheaderdetailForm: FormGroup
  SubmitApproverForm: FormGroup
  showhdrview = true
  showdtlview = false

  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]
  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer, private datePipe: DatePipe
    , private ecfservice: EcfService, private shareservice: ShareService, private notification: NotificationService,
    private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    let data = this.shareservice.ecfheader.value
    this.ecfheaderid = data
    this.ecfheaderviewForm = this.fb.group({
      supplier_type: [''],
      commodity_id: [''],
      ecftype: [''],
      branch: [''],
      ecfdate: [''],
      ecfamount: [''],
      ppx: [''],
      notename: [''],
      remark: [''],
      payto: ['']
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
        this.INVheader(),
      ]),

    })

    this.invoiceheaderdetailForm = this.fb.group({
      raisorcode: [''],
      raisorname: [''],
      transbranch: [''],
      gst: [''],
      suppcode: [''],
      suppname: [''],
      suppbranch: [''],
      suppgst: [''],
      invoiceno: [''],
      invoicedate: [''],
      taxableamt: [''],
      invoiceamt: ['']

    })

    this.SubmitApproverForm = this.fb.group({
      id: this.ecfheaderid,
      branch_id: [''],
      approver_id: [''],
      remarks: ['']

    })
    this.getinvoicedetails()
    this.getsuppliertype();
    this.getecftype();
    this.getcommodity('');
    let commoditykeyvalue: String = "";
    this.getcommodity(commoditykeyvalue);
    this.ecfheaderviewForm.get('commodity_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.ecfservice.getcommodity(value)
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
  getSections(forms) {
    return forms.controls.invoiceheader.controls;
  }

  getecftype() {
    this.ecfservice.getecftype()
      .subscribe(result => {
        this.TypeList = result["data"]
        
      })
  }

  getsuppliertype() {
    this.ecfservice.getsuppliertype()
      .subscribe(result => {
        this.SupptypeList = result["data"]
      
      })
  }
  ecftypeid: any
  ppxid:any
  getinvoicedetails() {
    this.ecfservice.getinvoicedetailsummary(this.ecfheaderid)
      .subscribe(result => {
        let datas = result
        this.ecftypeid = datas.ecftype_id
        if(this.ecftypeid == 4){
         this.ppxid=datas.ppx_id.id
        }
        this.invheaderdata = result["Invheader"]

        this.ecfheaderviewForm.patchValue({
          supplier_type: datas.supplier_type_id,
          commodity_id: datas.commodity_id,
          ecftype: datas.ecftype_id,
          branch: datas.branch.name,
          // branch:datas.raiserbranch.name,
          ecfdate: datas.ecfdate,
          ecfamount: datas.ecfamount,
          payto: datas.payto,
          ppx: datas.ppx,
          notename: datas.notename,
          remark: datas.remark,
         })

        
        if (this.ecftypeid == 2 ||this.ppxid == 'S') {
          this.invoiceheaderdetailForm.patchValue({
            raisorcode: datas.raiserbranch.code,
            raisorname: datas.raisername,
            gst: this.invheaderdata[0].invoicegst,
            suppcode: this.invheaderdata[0].supplier_id.code,
            suppname: this.invheaderdata[0].supplier_id.name,
            suppgst: this.invheaderdata[0].supplier_id.gstno,
            invoiceno: this.invheaderdata[0].invoiceno,
            invoicedate: this.invheaderdata[0].invoicedate,
            taxableamt: this.invheaderdata[0].invoiceamount,
            invoiceamt: this.invheaderdata[0].totalamount

          })
        }
        if (this.ecftypeid == 3||this.ppxid == 'E') {
          this.invoiceheaderdetailForm.patchValue({
            raisorcode: datas.raiserbranch.code,
            raisorname: datas.raisername,
            gst: this.invheaderdata[0].invoicegst,
            invoiceno: this.invheaderdata[0].invoiceno,
            invoicedate: this.invheaderdata[0].invoicedate,
            taxableamt: this.invheaderdata[0].invoiceamount,
            invoiceamt: this.invheaderdata[0].totalamount
          })

        }
      })
  }

  public displayFncommodity(commodity?: commoditylistss): string | undefined {
    return commodity ? commodity.name : undefined;
  }

  get commodity() {
    return this.ecfheaderviewForm.get('commodity_id');
  }

  getcommodity(commoditykeyvalue) {
    this.ecfservice.getcommodity(commoditykeyvalue)
      .subscribe(results => {
        let datas = results["data"];
        this.commodityList = datas;
       
      })
  }

  INVheader() {
    let group = new FormGroup({
      invoiceno: new FormControl(),
      invoicedate: new FormControl(''),
      invoiceamount: new FormControl(0),
      taxamount: new FormControl(0),
      totalamount: new FormControl(0),
      otheramount: new FormControl(0),
      roundoffamt: new FormControl(0.0),
      invtotalamt: new FormControl(0),
      ecfheader_id: new FormControl(0),
      dedupinvoiceno: new FormControl(0),
      suppliergst: new FormControl(''),
      raisorbranchgst: new FormControl(''),
      invoicegst: new FormControl(''),
    })
    group.get('invoiceamount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
     
      if (!this.InvoiceHeaderForm.valid) {
        return;
      }

      this.linesChange.emit(this.InvoiceHeaderForm.value['invoice']);
    }
    )

    group.get('taxamount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      
      if (!this.InvoiceHeaderForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
    }
    )

    group.get('roundoffamt').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
     
      if (!this.InvoiceHeaderForm.valid) {
        return;
      }

      this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
    }
    )

    return group


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
    return this.sanitizer.bypassSecurityTrustHtml(this.ecfheaderviewForm.get('html').value);
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
  addSection() {
    const control = <FormArray>this.InvoiceHeaderForm.get('invoiceheader');
    control.push(this.INVheader());

  }
  removeSection(i) {
    const control = <FormArray>this.InvoiceHeaderForm.get('invoiceheader');
    control.removeAt(i);
  }
  Movetodetail(id) {
    //  this.router.navigate(['/invdtlsummaryview'])
    this.showhdrview = false
    this.showdtlview = true
    this.getinvheaderid(id)
  }
  back() {

    this.onCancel.emit()

  }

  SubmitForm() {
    if (this.SubmitApproverForm.value.remarks === "") {
      this.toastr.error('Please Enter Purpose');
      return false;
    }
    this.ecfservice.ecfapprove(this.SubmitApproverForm.value)
      .subscribe(result => {
        if (result.status) {
          this.notification.showSuccess('Approved Successfully')
          this.router.navigate(['ECF/ecfapproval'])
          this.onSubmit.emit();
        } else {
          return false;
        }
      })

  }
  rejectForm() {
    if (this.SubmitApproverForm.value.remarks === "") {
      this.toastr.error('Please Enter Purpose');
      return false;
    }
    this.ecfservice.ecfreject(this.SubmitApproverForm.value)
      .subscribe(result => {
        if (result.status) {
          this.notification.showSuccess('Rejected Successfully')
          this.router.navigate(['ECF/ecfapproval'])
          this.onSubmit.emit();
        } else {
          return false;
        }
      })

  }

  dtlback() {

    this.showhdrview = true
    this.showdtlview = false

  }
  detailrecords: any
  creditrecords: any
  advancedebitrecords:any
  getinvheaderid(id) {
    this.ecfservice.getinvheaderdetails(id)
      .subscribe(results => {
        this.detailrecords = results['invoicedtl']
        // this.advancedebitrecords = results['debit']
        this.creditrecords = results['credit']
      
      })

  }
  debitrecords: any
  getinvdtlid(id) {
    
    this.ecfservice.getinvdetailsrecords(id)
      .subscribe(results => {
        this.debitrecords = results['debit']
       
      })
  }

  data(datas){
    let id = datas.file_id
    this.ecfservice.downloadfile(id)
  }

  getfiles(data){

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
}




