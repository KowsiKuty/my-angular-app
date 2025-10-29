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
  selector: 'app-ecfcoview',
  templateUrl: './ecfcoview.component.html',
  styleUrls: ['./ecfcoview.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]

})
export class EcfcoviewComponent implements OnInit {

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  showhdrview = true
  showdtlview = false
  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]
  ecfheaderviewForm:FormGroup
  InvoiceHeaderForm:FormGroup
  invoiceheaderdetailForm:FormGroup
  coviewdata:any
  cosummarydata:any
  ecftypeid:any
  ppxid:any
  SubmitApproverForm:FormGroup
  tomorrow = new Date()
  tranrecords:any
  ecfheaderid:any


  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer, private datePipe: DatePipe
    , private ecfservice: EcfService, private shareservice: ShareService, private notification: NotificationService,
    private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    let data = this.shareservice.coview.value
    this.coviewdata = data
    // console.log("data",data)
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


    this.getcoviewdetails();

  }

  getcoviewdetails(){
    this.cosummarydata =  this.coviewdata['Invheader']
    this.ecftypeid = this.coviewdata.ecftype_id
    this.ecfheaderid = this.coviewdata.id

    this.ecfheaderviewForm.patchValue({
      supplier_type: this.coviewdata.supplier_type,
      commodity_id: this.coviewdata.commodity_id.name,
      ecftype: this.coviewdata.ecftype,
      branch: this.coviewdata.raiserbranch.name +"-"+ this.coviewdata.raiserbranch.code,
      ecfdate: this.coviewdata.ecfdate,
      ecfamount: this.coviewdata.ecfamount,
      payto: this.coviewdata.payto,
      ppx: this.coviewdata.ppx,
      notename: this.coviewdata.notename,
      remark: this.coviewdata.remark,

    })
    if (this.ecftypeid == 2 ||this.ppxid == 'S') {
      this.invoiceheaderdetailForm.patchValue({
        raisorcode: this.coviewdata.raiserbranch.code,
        raisorname: this.coviewdata.raisername,
        gst:  this.cosummarydata[0].invoicegst,
        suppcode: this.cosummarydata[0].supplier_id.code,
        suppname: this.cosummarydata[0].supplier_id.name,
        suppgst: this.cosummarydata[0].supplier_id.gstno,
        invoiceno: this.cosummarydata[0].invoiceno,
        invoicedate: this.cosummarydata[0].invoicedate,
        taxableamt: this.cosummarydata[0].invoiceamount,
        invoiceamt: this.cosummarydata[0].totalamount

      })
    }
    if (this.ecftypeid == 3||this.ppxid == 'E') {
      this.invoiceheaderdetailForm.patchValue({
        raisorcode: this.coviewdata.raiserbranch.code,
        raisorname: this.coviewdata.raisername,
        gst: this.cosummarydata[0].invoicegst,
        invoiceno: this.cosummarydata[0].invoiceno,
        invoicedate: this.cosummarydata[0].invoicedate,
        taxableamt: this.cosummarydata[0].invoiceamount,
        invoiceamt: this.cosummarydata[0].totalamount
      })

    }
  }

  Movetodetail(id) {
    this.showhdrview = false
    this.showdtlview = true
    // this.getinvheaderid(id)
  }
  back() {

    this.onCancel.emit()

  }

  dtlback() {

    this.showhdrview = true
    this.showdtlview = false

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

gettrandata(){
  this.ecfservice.gettransactionstatus(this.ecfheaderid)
  .subscribe(result =>{
    this.tranrecords = result['data']
  })
}

getfiledownload(datas){
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
