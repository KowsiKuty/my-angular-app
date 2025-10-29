import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, FormGroupDirective, Validators, FormControlName } from '@angular/forms';
import { switchMap, finalize, debounceTime, distinctUntilChanged, tap, takeUntil, map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { EcfService } from 'src/app/ECF/ecf.service';
import { ShareService } from '../share.service';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
import { environment } from 'src/environments/environment';
import { EcfapService } from '../ecfap.service';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";

export interface approverListss {
  id: string;
  name: string;
  limit: number;
  designation: string
  code: string
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
  selector: 'app-ecfap-view',
  templateUrl: './ecfap-view.component.html',
  styleUrls: ['./ecfap-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class EcfapViewComponent implements OnInit {
  @Output() linesChange = new EventEmitter<any>();
  @ViewChild(FormGroupDirective) fromGroupDirective: FormGroupDirective
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  ecfheaderviewForm: FormGroup
  InvoiceHeaderForm: FormGroup
  infiledata: any = []
  TypeList: any
  SupptypeList: any
  isLoading: boolean;
  tomorrow = new Date()
  invheaderdata: any = []
  ecfheaderid: any
  invoiceheaderdetailForm: FormGroup
  SubmitApproverForm: FormGroup

  showhdrview = true
  showdtlview = false
  @ViewChild('closebutton') closebutton;
  @ViewChild('closebutton1') closebutton1;
  @ViewChild('closeglbutton') closeglbutton;
  @ViewChild('supclosebutton') supclosebutton;
  showgst = true

  imageUrl = environment.apiURL
  tokenValues: any
  showimageHeaderAPI: boolean
  showimagepdf: boolean
  pdfurl: any
  jpgUrlsAPI: any
  headertotalamt: any
  raisername: any
  raiserempname: any
  tranrecords:any =[]
  @Output() onView = new EventEmitter<any>();
  ecfmodelurl = environment.apiURL
  approvernames: any = {
    label: "Approver Name",
    "method": "get",
    "url": this.ecfmodelurl + "ecfapserv/approver_dropdown",
    params: '',
    "searchkey": "query",
    "displaykey": "name",
    wholedata: true,
    required: true,
    formcontrolname: 'approvedby',
  }
  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]
  behalfyesorno = [{ 'value': true, 'display': 'Yes', "checked": true }, { 'value': false, 'display': 'No', "checked": false }]

  SubmitECFApproverForm: FormGroup;
  loginuserid: any;
  @ViewChild('auditclose') auditclose;
  editorDisabled = true;

  approverList: Array<approverListss>;
  @ViewChild('appInput') appInput: any;
  @ViewChild('approver') matappAutocomplete: MatAutocomplete;

  currentpageapp: any = 1
  has_nextapp: boolean = true
  has_previousapp: boolean = true
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  commodityid: any;
  createdbyid: any;
  @ViewChild('closedbuttons') closedbuttons;
  SummaryApiattachObjNew: any;
  SummaryApitransactionObjNew: any;
  commodity_id: any
  ecftype: any
  payto: any
  ppx: any
  ecfdate: any
  supplier_type: any
  ecfamount: any
  remark: any
  advancetype: any
  is_raisedby_self: any
  raised_for: any
  raised_by: any
  location: any
  url = environment.apiURL
  branch_name: string;

  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer, private datePipe: DatePipe
    , private ecfservice: EcfService, private shareservice: ShareService, private notification: NotificationService,
    private router: Router, private toastr: ToastrService, private ecfservices: EcfapService,
    private SpinnerService: NgxSpinnerService,
    private errorHandler: ErrorHandlingService) { }

  ngOnInit(): void {
    const getToken = localStorage.getItem("sessionData")
    let tokendata = JSON.parse(getToken)
    this.loginuserid = tokendata.employee_id

    let data = this.shareservice.ecfheader.value
    this.ecfheaderid = data
    let ecfdatas = this.shareservice.ecfviewdata.value
    console.log("ecfdatas", ecfdatas)
    this.commodityid = ecfdatas?.commodity_id?.id
    this.createdbyid = ecfdatas?.raisedby
    // if (ecfdatas?.ecfstatus_id == 2) {
    //   this.editorDisabled = false
    // } else {
    //   this.editorDisabled = true
    // }
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
      payto: [''],
      client_code: [''],
      rmcode: [''],
      is_raisedby_self: [''],
      raised_by: [''],
      raised_for: [''],
      location: [''],
      is_originalinvoice: [''],
      inwarddetails_id: [''],
      advancetype: ['']


    })

    this.InvoiceHeaderForm = this.fb.group({
      branch_id: [''],
      invtotalamt: [''],
      ecfheader_id: [''],
      dedupinvoiceno: [''],
      suppliergst: [''],
      raisorbranchgst: [''],
      invoicegst: [''],


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
      invoiceamt: [''],
      taxamt: ['']

    })

    this.SubmitApproverForm = this.fb.group({
      id: this.ecfheaderid,
      branch_id: [''],
      approver_id: [''],
      remarks: ['']

    })

    this.SubmitECFApproverForm = this.fb.group({
      id: this.ecfheaderid,
      branch_id: [''],
      approvedby: [''],
      remark: ['']
    })

    this.approvernames = {
      label: "Approver Name",
      method: "get",
      url: this.ecfmodelurl + "ecfapserv/approver_dropdown",
      params: "&commodityid=" + this.commodityid + "&created_by=" + this.createdbyid,
      searchkey: "query",
      displaykey: "name",
      wholedata: true,
      required: true,
      formcontrolname: "approvedby"
    }
    this.getinvoicedetails()



  }
  // getSections(forms) {
  //   return forms.controls.invoiceheader.controls;
  // }

  getecftype() {
    this.ecfservices.getecftype()
      .subscribe(result => {
        if (result) {
          this.TypeList = result["data"]
        }

      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
  }

  getsuppliertype() {
    this.ecfservices.getsuppliertype()
      .subscribe(result => {
        if (result) {
          this.SupptypeList = result["data"]
        }

      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
  }

  approvername() {
    let appkeyvalue: String = "";
    this.getapprover(appkeyvalue);

    this.SubmitECFApproverForm.get('approvedby').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.ecfservices.getECFapproverscroll(1, this.commodityid, this.createdbyid, "", value)

          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.approverList = datas;

      })

  }
  private getapprover(appkeyvalue) {
    this.ecfservices.getECFapproverscroll(1, this.commodityid, this.createdbyid, "", appkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.approverList = datas;
      })
  }

  public displayFnApprover(approver?: approverListss): string | undefined {
    return approver ? approver.name + ' - ' + approver.code + ' - ' + approver.limit + ' - ' + approver.designation : undefined;

  }

  get approver() {
    return this.SubmitECFApproverForm.get('approvedby');
  }

  autocompleteapproverScroll() {

    setTimeout(() => {
      if (
        this.matappAutocomplete &&
        this.autocompleteTrigger &&
        this.matappAutocomplete.panel
      ) {
        fromEvent(this.matappAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matappAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matappAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matappAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matappAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextapp === true) {
                this.ecfservices.getECFapproverscroll(this.currentpageapp + 1, this.commodityid, this.createdbyid, "", this.appInput.nativeElement.value)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.approverList = this.approverList.concat(datas);
                    if (this.approverList.length >= 0) {
                      this.has_nextapp = datapagination.has_next;
                      this.has_previousapp = datapagination.has_previous;
                      this.currentpageapp = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }


  ecftypeid: any
  ppxid: any
  raisergstnum: any
  checkhr: any
  originalinvoice: any

  showApprove: boolean
  ecfheaderresult: any
  ap_statusflag = false
  showRecurDates = false
  showRecurMonth = false
  showreg= false;
  getinvoicedetails() {
    this.SpinnerService.show()

    this.ecfservices.getecfheader(this.ecfheaderid)
      .subscribe(result => {
        this.ap_statusflag = false

        console.log("result", result)
        this.SpinnerService.hide()
        if (result?.id != undefined) {
          let datas = result
          this.ecfheaderresult = datas
          if (datas?.apstatus == "APPROVED") {
            this.notification.showInfo("This Claim is Already Approved")
          }
          if (datas?.apstatus == "REJECT") {
            this.notification.showInfo("This Claim is Already Rejected")
          }
          if (datas?.aptype_id == 3 || datas?.aptype_id == 13) {
            this.raisername = datas?.raisername?.name
          } else {
            this.raisername = datas?.raisername
          }
          this.raiserempname = datas?.raisername?.name
          this.raisergstnum = datas?.raiserbranchgst
          this.checkhr = datas?.is_onbehalfoff_hr
          this.ecftypeid = datas?.aptype_id
          if (this.ecftypeid == 4) {
            this.ppxid = datas?.ppx_id?.id
          }
          if (datas?.is_originalinvoice == true) {
            this.originalinvoice = "Yes"
          } else {
            this.originalinvoice = "No"
          }

          let dts: any = result["invoice_header"];
          // this.attach_summary();
          if (dts.code != undefined && dts.code != "" && dts.code != null) {
            console.log(dts);
            this.toastr.warning(dts.code);
            this.toastr.warning(dts.description);
            this.invheaderdata = [];
          }
          else {
            console.log(dts);
            this.invheaderdata = result["invoice_header"];
            // this.attach_summary();
          }


          if (this.invheaderdata[0]?.servicetype?.id == 2 || this.invheaderdata[0]?.servicetype?.id == 3)
            this.showRecurDates = true
          else
            this.showRecurDates = false

          if (this.invheaderdata[0]?.servicetype?.id == 2)
            this.showRecurMonth = true
          else
            this.showRecurMonth = false

          if(this.invheaderdata[0]?.is_msme){
            this.showreg = true
          }
          else{
            this.showreg = false;
          }
          for (let i = 0; i < this.invheaderdata.length; i++) {
            if (this.invheaderdata[i].apinvoiceheader_status != null) {
              this.ap_statusflag = true
              break;
            }
          }

          this.InvoiceHeaderForm.patchValue({
            invoicegst: this.invheaderdata[0]?.invoicegst
          })


          if (result.approver_id == this.loginuserid && result.apstatus_id == 2 && result.batch_no == null) {
            this.showApprove = true
            this.SubmitECFApproverForm.patchValue({
              branch_id: datas?.branch?.id,
              approvedby: datas?.approver_id,
            })
          }
          else {
            this.showApprove = false
          }
          let num: number = +datas?.apamount;
          let totamt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
          totamt = totamt ? totamt.toString() : '';
          this.commodity_id = datas?.commodity_id?.name
          this.supplier_type = datas?.supplier_type
          this.branch_name = datas?.branch?.code + ' - ' + datas?.branch?.name
          // this.branch = datas?.branch?.code + ' - ' + datas?.branch?.name
          this.ecfdate = this.datePipe.transform(datas?.apdate, 'dd-MMM-yyyy'),
            this.ecfamount = totamt
          this.remark = datas?.remark
          this.advancetype = datas?.advancetype?.text
          this.raised_for = datas?.raisedby_dtls?.name
          this.raised_by = datas?.raisername?.name
          this.location = datas?.location?.location
          this.ecftype = datas?.aptype
          this.payto = datas?.payto
          this.ppx = datas?.ppx
          this.ecfheaderviewForm.patchValue({
            supplier_type: datas?.supplier_type,
            commodity_id: datas?.commodity_id?.name,
            ecftype: datas?.aptype,
            branch: datas?.branch?.code + ' - ' + datas?.branch?.name,
            // branch:datas.raiserbranch.name,
            ecfdate: this.datePipe.transform(datas?.apdate, 'dd-MMM-yyyy'),
            ecfamount: totamt,
            payto: datas?.payto,
            ppx: datas?.ppx,
            notename: datas?.notename,
            remark: datas?.remark,
            advancetype: datas?.advancetype?.text,
            // client_code: datas?.client_code?.client_name,
            // rmcode: datas?.rmcode?.code + "-" + datas?.rmcode?.name,
            is_raisedby_self: datas?.is_raisedby_self,
            raised_by: datas?.raisername?.name,
            raised_for: datas?.raisedby_dtls?.name,
            location: datas?.location?.location,
            is_originalinvoice: this.originalinvoice,
            inwarddetails_id: datas?.inwarddetails_id

          })

          if (this.invheaderdata?.length > 0) {

            let totalamount = this.invheaderdata.map(x => x.totalamount);
            this.headertotalamt = totalamount.reduce((a, b) => a + b, 0);

            // ----

          }

        } else if (result?.status == 'Failed') {
          this.notification.showError(result?.message)
          this.SpinnerService.hide()
          this.onCancel.emit()
        } else {
          this.notification.showError(result?.description)
          this.onCancel.emit()
          this.SpinnerService.hide()
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }


      )
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

  Movetodetail(data) {
    console.log("viewdata", data)
    this.shareservice.invheaderid.next(data.id)
    this.shareservice.ecfheader.next(this.ecfheaderid)
    this.shareservice.ecfviewdata.next(data)
    this.shareservice.invhdrstatus.next(data.invoice_status)
    // data.apinvoiceheaderstatus_id ? data.apinvoiceheaderstatus :
    this.onView.emit()
    // this.router.navigate(['ECFAP/invdetailview'])

  }
  back() {

    this.onCancel.emit()

  }

  SubmitForm() {
    if (this.SubmitApproverForm?.value?.remarks === "") {
      this.toastr.error('Please Enter Purpose');
      return false;
    }
    this.ecfservices.ecfApprove(this.SubmitApproverForm?.value,'')
      .subscribe(result => {
        if (result.status) {
          this.notification.showSuccess('Approved Successfully')
          this.router.navigate(['ECF/ecfapproval'])
          this.onSubmit.emit();
        } else {
          this.notification.showError(result.description)
          return false;
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )

  }
  rejectForm() {
    if (this.SubmitApproverForm?.value?.remarks === "") {
      this.toastr.error('Please Enter Purpose');
      return false;
    }
    this.ecfservices.ecfReject(this.SubmitApproverForm?.value)
      .subscribe(result => {
        if (result.status) {
          this.notification.showSuccess('Rejected Successfully')
          this.router.navigate(['ECF/ecfapproval'])
          this.onSubmit.emit();
        } else {
          this.notification.showError(result.description)
          return false;
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )

  }

  dtlback() {
    this.SpinnerService.show()
    this.showhdrview = true
    this.showdtlview = false
    this.SpinnerService.hide()

  }


  roundoffdata: any
  otheramountdata: any
  detailrecords: any
  creditrecords: any
  advancedebitrecords: any
  invoicedetailget = []
  credittotamt: any
  invdetailtotamt: any
  advdbttotamt: any
  supparray = []

  getinvheaderid(id) {
    this.SpinnerService.show()
    this.ecfservice.getinvheaderdetails(id)
      .subscribe(results => {
        if (results.id != undefined) {
          this.roundoffdata = results?.roundoffamt
          this.otheramountdata = results?.otheramount
          if (this.ecftypeid != 3 && this.ppxid != 'E' && this.ecftypeid != 8) {
            this.invoiceheaderdetailForm.patchValue({
              raisorcode: this.raisergstnum,
              raisorname: this.raisername,
              gst: results?.invoicegst,
              suppcode: results?.supplier_id?.code,
              suppname: results?.supplier_id?.name,
              suppgst: results?.supplier_id?.gstno,
              invoiceno: results?.invoiceno,
              invoicedate: this.datePipe.transform(results?.invoicedate, 'dd-MMM-yyyy'),
              taxableamt: results?.invoiceamount,
              taxamt: results?.taxamount,
              invoiceamt: results?.totalamount

            })
          }

          if (this.ecftypeid == 3 || this.ppxid == 'E' || this.ecftypeid == 13) {
            this.invoiceheaderdetailForm.patchValue({
              raisorcode: this.raisergstnum,
              raisorname: this.raisername,
              gst: results?.invoicegst,
              invoiceno: results?.invoiceno,
              invoicedate: this.datePipe.transform(results?.invoicedate, 'dd-MMM-yyyy'),
              taxableamt: results?.invoiceamount,
              taxamt: results?.taxamount,
              invoiceamt: results?.totalamount
            })

          }


          if (this.ecftypeid == 8) {

            this.invoiceheaderdetailForm.patchValue({
              raisorcode: this.raisergstnum,
              raisorname: this.raisername,
              gst: results?.invoicegst,
              invoiceno: results?.invoiceno,
              invoicedate: this.datePipe.transform(results?.invoicedate, 'dd-MMM-yyyy'),
              taxableamt: results?.invoiceamount,
              taxamt: results?.taxamount,
              invoiceamt: results?.totalamount
            })

          }

          // if(this.ecftypeid == 5){

          //   this.invoiceheaderdetailForm.patchValue({
          //     raisorcode: this.raisergstnum,
          //     raisorname: this.raisername,
          //     gst: results?.invoicegst,
          //     invoiceno: results?.invoiceno,
          //     invoicedate: this.datePipe.transform(results?.invoicedate,'dd/MM/yyyy'),
          //     taxableamt: results?.invoiceamount,
          //     taxamt:results?.taxamount,
          //     invoiceamt: results?.totalamount
          //   })

          // }
          this.detailrecords = results['invoicedtl']

          if (this.detailrecords?.length > 0) {
            let detailamount = this.detailrecords?.map(y => y.totalamount)
            let invdtltotamt = detailamount?.reduce((a, b) => a + b, 0)
            let roundoffamt = Number(this.detailrecords[0]?.roundoffamt)
            let otheramount = Number(this.detailrecords[0]?.otheramount)
            if (this.ecftypeid == 2 || this.ecftypeid == 7 || this.ecftypeid == 14) {
              this.invdetailtotamt = invdtltotamt + roundoffamt + otheramount
            }
            if (this.ecftypeid == 3 || this.ecftypeid == 13) {
              this.invdetailtotamt = Number(invdtltotamt)
            }
            if (this.ecftypeid == 8) {
              this.invdetailtotamt = Number(invdtltotamt)
            }

          }
          this.advancedebitrecords = results['debit']
          if (this.advancedebitrecords?.length > 0) {
            let dtamt = this.advancedebitrecords?.map(x => x.amount)
            this.advdbttotamt = dtamt?.reduce((a, b) => a + b, 0)
          }
          this.creditrecords = results['credit']
          if (this.creditrecords?.length > 0) {
            let amount = this.creditrecords?.map(x => x.amount)
            this.credittotamt = amount?.reduce((a, b) => a + b, 0)
          }
          this.SpinnerService.hide()

        } else {
          this.notification.showError(results?.description)
          this.SpinnerService.hide()
          return false
        }



      },

        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )

  }

  getdtlid(data) {

    for (let i = 0; i < this.detailrecords.length; i++) {
      if (data.id == this.detailrecords[i].id) {
        this.supparray.push(this.detailrecords[i])
      }
    }
  }
  debitrecords: any
  debittotamt: any
  getinvdtlid(id) {
    this.SpinnerService.show()
    this.ecfservice.getinvdetailsrecords(id)
      .subscribe(results => {
        if (results?.id != undefined) {
          this.debitrecords = results['debit']
          if (this.debitrecords?.length > 0) {
            let amount = this.debitrecords?.map(x => x.amount)
            this.debittotamt = amount?.reduce((a, b) => a + b, 0)
          }
          this.SpinnerService.hide()
        } else {
          this.notification.showError(results?.description)
          this.SpinnerService.hide()
          return false
        }

      },

        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }



  data(datas) {
    let id = datas?.file_id
    let filename = datas?.file_name
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
      this.jpgUrlsAPI = this.imageUrl + "ecfserv/ecffile/" + id + "?token=" + token;
    }
    if (stringValue[1] === "pdf" || stringValue[1] === "PDF") {
      this.showimagepdf = true
      this.showimageHeaderAPI = false
      this.ecfservices.downloadfile(id)
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

  getfiles(data) {
    this.SpinnerService.show()
    this.ecfservices.filesdownload(data?.file_id)
      .subscribe((results) => {

        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        // link.download = data.file_name;
        link.download = data?.file_name;
        link.click();
        this.SpinnerService.hide()
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
  }
  debitbacks() {
    this.closebutton.nativeElement.click();
  }
  supbacks() {
    this.supparray = []
    this.supclosebutton.nativeElement.click();
  }
  filelist: any
  getfiledetails() {
    this.ecfservice.getinvoicedetailsummary(this.ecfheaderid)
      .subscribe(result => {
        if (result) {
          this.filelist = result['Invheader']
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
  }

  gettrandata() {
    this.ecfservice.gettransactionstatus(this.ecfheaderid)
      .subscribe(result => {
        if (result) {
          this.tranrecords = result['data']
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }

  tranback() {
    this.closebutton1.nativeElement.click();
  }

  catviewdata: any
  subcatviewdata: any
  getgldata(datas) {
    // console.log("datas",datas.value)
    this.catviewdata = datas?.category_code?.code
    this.subcatviewdata = datas?.subcategory_code?.code
  }

  glback() {
    this.closeglbutton.nativeElement.click()
  }

  hdrSelectable = [false, false, false, false, false]
  hdrAuditFlag = [false, false, false, false, false];
  hdrDedupeFlag = [false, false, false, false, false];

  hdrApproveEnabled = false
  checkInvID: any
  checkinvdate: any
  checklist: any;
  getquestion(i, id, date) {
    this.checkInvID = id
    this.checkinvdate = this.datePipe.transform(date, 'yyyy-MM-dd')
    this.hdrAuditFlag[i] = true;
    this.ecfservices.getAuditChecklist(this.ecftypeid).subscribe(data => {
      this.checklist = data['data'];
      for (let i = 0; i < this.checklist.length; i++) {
        this.checklist[i]['clk'] = true;
        this.checklist[i]['value'] = 1;
      }
      console.log('check=', data);
    })
    if (this.hdrAuditFlag[i] == true && this.hdrDedupeFlag[i] == true)
      this.hdrSelectable[i] = true
  }

  dedupeChkType = ['exact',
    'supplier',
    'invoice_amount',
    'invoiceno',
    'invoice_date']

  exactList: any;
  withoutSuppList: any;
  withoutInvAmtList: any;
  withoutInvNoList: any;
  withoutInvDtList: any;

  presentpage: number = 1;
  identificationSize: number = 10;

  getdedup(i, id) {
    this.checkInvID = id

    this.hdrDedupeFlag[i] = true;
    //dedupe for type(exact)
    this.ecfservices.getInwDedupeChk(this.checkInvID, this.dedupeChkType[0],1)
      .subscribe(result => {
        this.exactList = result['data']
        console.log("exactList", this.exactList)

        // let dataPagination = result['pagination'];
        // if (this.exactList.length >= 0) {
        //   this.has_next = dataPagination.has_next;
        //   this.has_previous = dataPagination.has_previous;
        //   this.presentpage = dataPagination.index;
        //   this.isSummaryPagination = true;
        // } if (this.exactList <= 0) {
        //   this.isSummaryPagination = false;
        // }        
      }, error => {
        console.log("No data found")
      }
      )
    //dedupe for type(WITHOUT_SUPPLIER)
    this.ecfservices.getInwDedupeChk(this.checkInvID, this.dedupeChkType[1],1)
      .subscribe(result => {
        this.withoutSuppList = result['data']
        console.log("WITHOUT_SUPPLIER List", this.withoutSuppList)
        // let dataPagination = result['pagination'];
        // if (this.exactList.length >= 0) {
        //   this.has_next = dataPagination.has_next;
        //   this.has_previous = dataPagination.has_previous;
        //   this.presentpage = dataPagination.index;
        //   this.isSummaryPagination = true;
        // } if (this.exactList <= 0) {
        //   this.isSummaryPagination = false;
        // }        
      }, error => {
        console.log("No data found")
      }
      )

    //dedupe for type(WITHOUT_INVOICE_AMOUNT)
    this.ecfservices.getInwDedupeChk(this.checkInvID, this.dedupeChkType[2],1)
      .subscribe(result => {
        this.withoutInvAmtList = result['data']
        console.log("WITHOUT_INVOICE_AMOUNT List", this.withoutInvAmtList)
        // let dataPagination = result['pagination'];
        // if (this.exactList.length >= 0) {
        //   this.has_next = dataPagination.has_next;
        //   this.has_previous = dataPagination.has_previous;
        //   this.presentpage = dataPagination.index;
        //   this.isSummaryPagination = true;
        // } if (this.exactList <= 0) {
        //   this.isSummaryPagination = false;
        // }        
      }, error => {
        console.log("No data found")
      }
      )

    //dedupe for type(WITHOUT_INVOICE_NUMBER)
    this.ecfservices.getInwDedupeChk(this.checkInvID, this.dedupeChkType[3],1)
      .subscribe(result => {
        this.withoutInvNoList = result['data']
        console.log("WITHOUT_INVOICE_NUMBER List", this.withoutInvNoList)
        //   let dataPagination = result['pagination'];
        //   if (this.exactList.length >= 0) {
        //     this.has_next = dataPagination.has_next;
        //     this.has_previous = dataPagination.has_previous;
        //     this.presentpage = dataPagination.index;
        //     this.isSummaryPagination = true;
        //   } if (this.exactList <= 0) {
        //    this.isSummaryPagination = false;
        //   }        
      }, error => {
        console.log("No data found")
      }
      )

    //dedupe for type(WITHOUT_INVOICE_DATE)
    this.ecfservices.getInwDedupeChk(this.checkInvID, this.dedupeChkType[4],1)
      .subscribe(result => {
        this.withoutInvDtList = result['data']
        console.log("WITHOUT_INVOICE_DATE List", this.withoutInvDtList)
        // let dataPagination = result['pagination'];
        // if (this.exactList.length >= 0) {
        //   this.has_next = dataPagination.has_next;
        //   this.has_previous = dataPagination.has_previous;
        //   this.presentpage = dataPagination.index;
        //   this.isSummaryPagination = true;
        // } if (this.exactList <= 0) {
        //   this.isSummaryPagination = false;
        // }        
      }, error => {
        console.log("No data found")
      }
      )
    this.SpinnerService.hide();
    if (this.hdrAuditFlag[i] == true && this.hdrDedupeFlag[i] == true)
      this.hdrSelectable[i] = true
  }



  ecfApprove() {
    let datas = this.SubmitECFApproverForm.value.remark
    if (datas == "" || datas == null || datas == undefined) {
      this.notification.showError("Please Enter Remarks")
      return false;
    }
    // let chk = 1
    // for(let i= 0; i<this.invheaderdata.length; i++)
    //   {
    //     if(this.hdrSelectable[i] == false)
    //       chk =0
    //   }
    // if(chk == 0 )	
    // {	
    //   this.toastr.error('Please Check Audit & Dedup CheckList.')	
    //   return false	
    // }
    this.SpinnerService.show()

    this.ecfservices.ecfApprove(this.SubmitECFApproverForm.value,'')

      .subscribe(result => {
        this.SpinnerService.hide();

        if (result.status != "success") {
          this.notification.showError(result.description)
          return false
        }
        else {
          this.notification.showSuccess("Successfully Approved!...")
          this.getinvoicedetails();
          this.onCancel.emit()
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
  }

  ecfReject() {
    let datas = this.SubmitECFApproverForm.value.remark
    if (datas == "" || datas == null || datas == undefined) {
      this.notification.showError("Please Enter Remarks")
      return false;
    }
    // let chk = 1
    // for(let i= 0; i<this.invheaderdata.length; i++)
    //   {
    //     if(this.hdrSelectable[i] == false)
    //       chk =0
    //   }
    // if(chk == 0 )	
    // {	
    //   this.toastr.error('Please Check Audit & Dedup CheckList.')	
    //   return false	
    // }
    this.SpinnerService.show()

    this.ecfservices.ecfReject(this.SubmitECFApproverForm.value)

      .subscribe(result => {
        this.SpinnerService.hide();

        if (result.status != "success") {
          this.notification.showError(result.description)
          return false
        }
        else {
          this.notification.showSuccess("Successfully Rejected!...")
          this.getinvoicedetails();
          this.onCancel.emit()
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
  }
  viewtrnlist: any = [];
  tranrecordscount = 0
  
  tranrecordsCurrentPage =1

  viewtrn(page =1) {
    this.popupopen2()
    this.name = ''; 
    this.designation = ''; 
    this.branch = ''; 
    this.tranrecords =[]

    this.SpinnerService.show()
    this.SummaryApitransactionObjNew = {
      method: "get",
         url: this.url + "ecfapserv/viewheader_transaction/"+ this.ecfheaderid,
         params: ""
    }
    this.ecfservices.getheadertransaction(this.ecfheaderid, page)
    .subscribe(result => {
      if (result['data'] != undefined) {
        this.tranrecords = result['data']
        this.SpinnerService.hide();
        let pagination = result['pagination']
        this.tranrecordscount =pagination?.count
        
        if (this.tranrecords.length > 0) {
          this.length_tranrecords =pagination?.count
          this.tranrecordsCurrentPage = pagination.index;
        }
      }
    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }

  pageSizeOptions = [5, 10, 25];
  showFirstLastButtons:boolean=true;
  length_tranrecords = 0;
  pageSize_tranrecords = 10
  pageIndextranrecords=0
  handleTranrecords(event: PageEvent) {
    this.length_tranrecords = event.length;
    this.pageSize_tranrecords = event.pageSize;
    this.pageIndextranrecords = event.pageIndex;
    this.tranrecordsCurrentPage=event.pageIndex+1;
    this.viewtrn( this.tranrecordsCurrentPage);  
  }
  
  name: any;
  branch: any;
  designation: any;
  view(dt) {
    this.name = dt.from_user.name + ' - ' + dt.from_user.code
    this.designation = dt.from_user.designation
    this.branch = dt.from_user_branch.name + ' - ' + dt.from_user_branch.code
  }
  viewto(dt) {
    this.name = dt.to_user.name + ' - ' + dt.to_user.code
    this.designation = dt.to_user.designation
    this.branch = dt.to_user_branch.name + ' - ' + dt.to_user_branch.code
  }


  //   auditcheck:any=[];

  // submitted(){
  //   this.auditcheck =[]

  //   this.SpinnerService.show()
  //     for(let i=0;i<this.checklist.length;i++){
  //     if(this.checklist[i]['clk']){
  //       let dear:any={
  //         'ecfauditchecklist_id':this.checklist[i]['id'],
  //         'apinvoiceheader_id':this.checkInvID,
  //         'value':this.checklist[i]['value']
  //       };
  //       this.auditcheck.push(dear)
  //        }
  //   }  let obj={
  //     'auditchecklist':this.auditcheck
  //   }
  //   console.log('obj', obj);

  //   this.ecfservices.audiokservie(obj).subscribe(result=>{
  //     console.log("result",result)
  //     this.SpinnerService.hide()
  //     if(result.status != "Success")
  //     {          
  //       this.notification.showError(result?.message)
  //       return false
  //     }
  //     else
  //     {
  //       this.notification.showSuccess("Saved Successfully!")
  //     }
  //     },
  //    (error)=>{
  //    alert(error.status+error.statusText);
  //     }
  //   )
  //   this.auditclose.nativeElement.click();
  // }

  //   ok(i:any,dt)
  // {
  //   let val=1;
  //   let dear:any={
  //     "ecfauditchecklist_id":dt.id,
  //     "apinvoiceheader_id":this.checkInvID,
  //     "value":val}; 
  //   console.log(dear)
  //   console.log("check bounce",dear)
  //   for(let i=0;i<this.auditcheck.length;i++){
  //    if(this.auditcheck[i].ecfauditchecklist_id==dt.id ){
  //      this.auditcheck.splice(i,1)
  //    }
  //   }
  // this.auditcheck.push(dear)
  //   console.log("bo",this.auditcheck)
  //  }
  //  notok(i:any,dt)
  //  {
  //   this.checklist[i]['clk'] = false
  //    let d=2;
  //     let dear:any={
  //     "ecfauditchecklist_id":dt.id,
  //     "apinvoiceheader_id":this.checkInvID,
  //     "value":d};  
  //    console.log("check bounce",dear)
  //    for(let i=0;i<this.auditcheck.length;i++){
  //     if(this.auditcheck[i].ecfauditchecklist_id==dt.id ){
  //       this.auditcheck.splice(i,1)
  //     }
  //    }
  // this.auditcheck.push(dear)
  // console.log("bo",this.auditcheck)
  // }
  //  nap(i:any,dt)
  //  {
  //  let d=3
  // let dear:any={
  //     "ecfauditchecklist_id":dt.id,
  //     "apinvoiceheader_id":this.checkInvID,
  //     "value":d};
  //     console.log("check bounce",dear)
  //     for(let i=0;i<this.auditcheck.length;i++){
  //      if(this.auditcheck[i].ecfauditchecklist_id==dt.id ){
  //        this.auditcheck.splice(i,1)
  //      }
  //     }
  //  this.auditcheck.push(dear)
  //  console.log("bo",this.auditcheck)
  //  }

  //   cli:boolean=false;
  //   remark:any;
  //   rem = new FormControl('', Validators.required);

  //  bounce()
  //  {
  //   this.cli=true;
  //   this.auditcheck =[]
  //   for(let i =0; i<this.checklist.length; i++)
  //   {
  //     let dear:any={
  //       "ecfauditchecklist_id":this.checklist[i].id,
  //       "apinvoiceheader_id":this.checkInvID,
  //       "value":this.checklist[i]['clk'] == true ? 1 : 2};

  //   this.auditcheck.push(dear)
  //   }
  //   this.remark=this.rem.value;
  //   let bouio:any={
  //     "status_id":"11",
  //     "invoicedate":this.checkinvdate,
  //     "remarks":this.remark.toString()
  // };
  // let obj={
  //   'auditchecklist':this.auditcheck
  // }
  //  this.ecfservices.audiokservie(obj).subscribe(data=>{
  //    console.log(data)
  //     if(data['status']=="Success"){
  //     this.notification.showSuccess(data?.message);

  //     }
  //   }
  //  )

  //  this.ecfservices.bounce(this.checkInvID,bouio).subscribe(data=>{
  //   console.log(data)
  //  }
  // )
  //  console.log("check bounce",obj)
  //  this.auditclose.nativeElement.click();
  //  }


  //  disables(){
  //   for(let i=0;i<this.auditcheck.length;i++)
  //    {
  //     if(this.auditcheck[i].value==2){
  //       return true;

  //     }
  //   }
  // }

  notessave() {
    this.SpinnerService.show()
    let datas = this.ecfheaderresult
    let ecfviewform = {
      "supplier_type": datas?.supplier_type_id,
      "commodity_id": datas?.commodity_id?.id,
      "aptype": datas?.aptype_id,
      "apdate": this.datePipe.transform(datas?.apdate, 'yyyy-MM-dd'),
      "apamount": datas?.apamount,
      "ppx": datas?.ppx_id?.id,
      "notename": this.ecfheaderviewForm?.value?.notename,
      "remark": datas?.remark,
      "payto": datas?.payto_id?.id,
      "advancetype": "",
      "ppxno": "",
      "location": "",
      "inwarddetails_id": datas?.inwarddetails_id,
      "is_originalinvoice": datas?.is_originalinvoice,
      "crno": datas?.crno,
      "is_raisedby_self": true,
      "raised_by": datas?.raisedby,
      "branch": datas?.branch?.id
    }

    this.ecfservices.editecfheader(ecfviewform, this.ecfheaderid)
      .subscribe(result => {
        this.SpinnerService.hide()
        if (result.id == undefined) {
          this.notification.showError(result?.description)
          return false
        } else {

        }
      })
  }

  forward() {
    let approverid: any
    this.SpinnerService.show()
    if (this.SubmitECFApproverForm?.value?.approvedby === "") {
      this.toastr.error('Please Choose Approver');
      this.SpinnerService.hide()
      return false;
    }
    if (this.SubmitECFApproverForm?.value?.remark === "") {
      this.toastr.error('Please Enter Remarks');
      this.SpinnerService.hide()
      return false;
    }

    if (typeof (this.SubmitECFApproverForm?.value?.approvedby) == 'object') {
      approverid = this.SubmitECFApproverForm?.value?.approvedby?.id
    } else if (typeof (this.SubmitECFApproverForm?.value?.approvedby) == 'number') {
      approverid = this.SubmitECFApproverForm?.value?.approvedby
    } else {
      this.toastr.error('Please Choose Approver Name from the Dropdown');
      this.SpinnerService.hide()
      return false;

    }


    let data = {
      "id": this.ecfheaderid,
      "approvedby": approverid,
      "remark": this.SubmitECFApproverForm?.value?.remark
    }
    this.ecfservices.ecfapproveforward(data)
      .subscribe(result => {
        if (result?.status == 'success') {
          this.notification.showSuccess('Forwarded Successfully')
          this.SpinnerService.hide()
          this.onSubmit.emit();
        } else {
          this.notification.showError(result?.description)
          this.SpinnerService.hide()
          return false;
        }

      },

        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )

  }

  data1(datas) {

    this.showimageHeaderAPI = false
    this.showimagepdf = false
    // let id = datas?.file_id
    // let filename = datas?.file_name
    let id = datas?.file_id
    let filename = datas?.file_name
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
      this.ecfservices.downloadfile1(id)
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

  fileback() {
    this.closedbuttons.nativeElement.click();
  }

  SummaryattachData: any = [

    { columnname: "File Name", key: "file_name",tooltip: true },

    { columnname: "Document Type", key: "document_type" },
    {
      columnname: "View", icon: "open_in_new",
      "style": { color: "blue", cursor: "pointer" },
      button: true, function: true,
      clickfunction: this.data1.bind(this)
    },
    {
      columnname: "Download", icon: "download",
      "style": { color: "green", cursor: "pointer" },
      button: true, function: true,
      clickfunction: this.getfiles.bind(this)
    }
  ];
  // attach_summary() {
  //   this.SummaryApiattachObjNew = {
  //     FeSummary: true,
  //     data: this.invheaderdata
  //   }
  // }
  popupopen2() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ecfap-view-0009"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  Notepopup() {
    this.popupopen();
  }

  popupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.querySelector(".bd-example-modal-xl"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  attachment_view(e) {
    this.infiledata = e["file_data"]
    this.SummaryApiattachObjNew = {
      FeSummary: true,
      data: this.infiledata
    }
    this.popupopen1();
  }
  popupopen1() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ecfap-view-0010"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  SummarytransactionData: any = [
    // { columnname: "Type", key: "Type" },
    { columnname: "Status", key: "comments" },
    { columnname: "Transaction Date", key: "created_date", "type": 'date', "datetype": "dd-MMM-yyyy" },
    { columnname: "Remarks", key: "remarks",tooltip: true }, // tooltip: true },//  <td style="width: 255px;"><div style="width: 250px;overflow: hidden;"[matTooltip]="dt.remarks" matTooltipClass="custom-tooltipnew">{{dt.remarks}}</div></td>
    { columnname: "Employee Name", key: "from_user", type: "object", objkey: "name", suffix: "View Details",suffix_style:{color:"green",display:"block"}, function: true, clickfunction: this.view.bind(this) },
    { columnname: "Approver Name ", key: "to_user", type: "object", objkey: "name", suffix: "View Details",suffix_style:{color:"green",display:"block"}, function: true, clickfunction: this.viewto.bind(this) },
  ]
  // transaction_summary(id) {
  //   // this.SummaryApitransactionObjNew = {
  //   //   FeSummary: true,
  //   //   data: this.viewtrnlist
  //   // }
  //   this.popupopen2()
  //   this.SummaryApitransactionObjNew = {
  //        method: "get",
  //           url: this.url + "ecfapserv/viewheader_transaction/"+ id,
  //           params: ""
  //   }
  // }
}
