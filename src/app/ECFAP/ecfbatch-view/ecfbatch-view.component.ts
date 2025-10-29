import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, FormGroupDirective, FormControlName } from '@angular/forms';
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
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";


export interface approverListss {
  id: string;
  name: string;
  limit: number;
  code: string
  designation: string
}

export interface branchListss {
  id: any;
  name: string;
  code: string;
  codename: string;
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
  selector: 'app-ecfbatch-view',
  templateUrl: './ecfbatch-view.component.html',
  styleUrls: ['./ecfbatch-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class EcfbatchViewComponent implements OnInit {
  ecfmodelurl = environment.apiURL
  @Output() linesChange = new EventEmitter<any>();
  @ViewChild(FormGroupDirective) fromGroupDirective: FormGroupDirective
  @Output() onBack = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  ecfheaderviewForm: FormGroup
  InvoiceHeaderForm: FormGroup
  branchid: any
  TypeList: any
  SupptypeList: any
  isLoading: boolean;
  tomorrow = new Date()
  invheaderdata: any
  ecfheaderid: any
  invoiceheaderdetailForm: FormGroup
  SubmitApproverForm: FormGroup
  SubmitBatchForm: FormGroup
  approvename: any;
  showhdrview = true
  showdtlview = false
  @ViewChild('closebutton') closebutton;
  @ViewChild('closebutton1') closebutton1;
  @ViewChild('closeglbutton') closeglbutton;
  @ViewChild('supclosebutton') supclosebutton;
  showgst = true
  submit_btn: number;
  Ecftypepanel: any;
  Paytopanel: any;
  Ppxpanel: any;
  Supplier_typepanel: any;
  Commodity_idpanel: any;
  Branchpanel: any;
  approvernames: any;
  Ecfdatepanel: any;
  Ecfamountpanel: any;
  Is_originalinvoicepanel: any;
  Remarkpanel: any;
  Is_raisedby_selfpanel: any;
  Raised_forpanel: any;
  Raised_bypanel: any;
  Locationpanel: any;
  imageUrl = environment.apiURL
  tokenValues: any
  @ViewChild('closedbutton') closedbutton;
  @ViewChild('popupclose') popupclose;
  // restforbranch: any[];
  popup_heading: string;
  showimageHeaderAPI: boolean
  showimagepdf: boolean
  pdfurl: any
  jpgUrlsAPI: any
  headertotalamt: any
  raisername: any
  raiserempname: any
  tranrecords: any
  has_bviewpagenext = true;
  has_bviewpageprevious = true;
  isbatchviewpage: boolean = true;
  bvpresentpage: number = 1;
  pagesizebview = 10;
  batchSummary: any;
  showheaderform: boolean = false
  showbatchfrm: boolean = true
  showinvdtlForm: boolean
  batchForm: FormGroup
  batchviewlist: any
  batchviewdatas: any
  ECFSummarydataapi: any;
  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]
  behalfyesorno = [{ 'value': true, 'display': 'Yes', "checked": true }, { 'value': false, 'display': 'No', "checked": false }]
  approverList: Array<approverListss>;
  Branchlist: Array<branchListss>;
  @ViewChild('appInput') appInput: any;
  @ViewChild('approver') matappAutocomplete: MatAutocomplete;

  @ViewChild('branchInput') branchInput: any;
  @ViewChild('branchmatAuto') branchmatAuto: MatAutocomplete;

  has_branchnext: boolean = true;
  has_branchprevious: boolean = false;
  has_branchpresentpage: number = 1;
  currentpageapp: any = 1
  has_nextapp: boolean = true
  has_previousapp: boolean = true
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  commodityid: any;
  commodity: any;
  createdbyid: any;
  editorDisabled = false;
  text: any;
  @ViewChild('closedbuttons') closedbuttons;
  BatchUpdateForm: FormGroup;
  SummaryFiles: any
  SummaryApifileObjNew: any
  fildatas: any = []
  ecfURL = environment.apiURL

  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer, private datePipe: DatePipe
    , private ecfservice: EcfService, private shareservice: ShareService, private notification: NotificationService,
    private router: Router, private toastr: ToastrService, private ecfservices: EcfapService,
    private SpinnerService: NgxSpinnerService,
    private errorHandler: ErrorHandlingService) {
    this.SummaryFiles = [
      { columnname: "File Name", key: "file_name" },
      {
        columnname: "View", key: "view", icon: "open_in_new",
        "style": { color: "blue", cursor: "pointer" },
        button: true, function: true, clickfunction: this.data1.bind(this)
      },
      {
        columnname: "Download ", key: "download", icon: "download",
        "style": { color: "black", cursor: "pointer" },
        button: true, function: true, clickfunction: this.getfiles.bind(this)
      },
    ]
  }

  ngOnInit(): void {
    let data = this.shareservice.ecfheader.value
    this.ecfheaderid = data
    this.batchviewid = this.shareservice.batchviewid.value
    this.batchviewdatas = this.shareservice.batchviewdatas.value
    this.ecf_data_summary()
    this.ecf_data_summary1()
    console.log("batchview---------------", this.batchviewdatas)
    this.commodityid = this.batchviewdatas?.commodity_id
    this.createdbyid = this.batchviewdatas?.raisedby
    if (this.batchviewdatas?.batchstatus == "PENDING") {
      this.editorDisabled = false
    } else {
      this.editorDisabled = true
    }

    console.log("ecfheaderid", this.ecfheaderid)
    console.log("batchviewdatas", this.batchviewdatas)

    this.batchForm = this.fb.group({
      batchno: [''],
      batchcount: [''],
      batchamt: [''],
    })

    // this.batchForm.patchValue({
    //   batchno:batchdatas?.batchno,
    //   batchcount:batchdatas?.batchcount,
    //   batchamt:batchdatas?.batchamount
    // })
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
      // client_code: [''],
      // rmcode: [''],
      is_raisedby_self: [''],
      raised_by: [''],
      raised_for: [''],
      location: [''],
      is_originalinvoice: [''],
      inwarddetails_id: ['']


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

    this.SubmitBatchForm = this.fb.group({
      remark: [''],
      id: [''],
      approvedby: ['']
    })

    // this.approvename = {
    //   label: "Approver Name",
    //   method: "get",
    //   url: this.ecfmodelurl + "ecfapserv/approver_dropdown",
    //   params: "&commodityid=" + this.commodityid + "&created_by=" + this.createdbyid,
    //   searchkey: "query",
    //   displaykey: "name",
    //   wholedata: true,
    //   required: true,
    //   formcontrolname: "approvedby"
    // }
    this.BatchUpdateForm = this.fb.group({
      approvedby: [''],
      approvedbranch: ['']
    })


    this.showbatchviewview(this.batchviewid, 1)
    this.viewbatches()
    // this.getinvoicedetails()

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

    this.SubmitBatchForm.get('approvedby').valueChanges
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
    return this.SubmitBatchForm.get('approvedby');
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


  batchviewid: any
  ECF_Approver: boolean = false
  ecf_editflag = false
  returnedCompletedFlag = false
  showbatchviewview(data, pageNumber = 1) {
    this.ecf_editflag = false
    console.log("dataaaaaaa", data)
    this.batchviewid = data
    this.ecfservices.batchview(data, pageNumber)
      .subscribe(result => {
        console.log("viewresult", result)
        this.batchSummary = result['data']
        let datapagination = result["pagination"];

        if (this.batchSummary?.length === 0) {
          this.isbatchviewpage = false
        }
        if (this.batchSummary?.length > 0) {
          // this.batchForm.patchValue({
          //   batchno : this.batchSummary[0]?.batch_no, 
          //   batchdate : this.datePipe.transform(this.shareservice.batchdate.value,'dd-MMM-yyyy'),
          //   batchamt : this.shareservice.batchamt.value
          // })

          this.commodity = this.batchSummary[0]?.commodity_id.name
          let ecf_app = this.batchSummary[0]?.ECF_Approver
          let flag = this.batchSummary[0]?.ecfstatus_id
          if (ecf_app && (flag != 3 && flag != 4) && this.shareservice.batchview.value == 'Approvalview')
            this.ECF_Approver = true
          else
            this.ECF_Approver = false

          let editableentry = this.batchSummary.filter(a => a.ecfstatus?.text == 'DRAFT' || a.ecfstatus?.text == 'BATCH ECF RETURNED')
          if (this.shareservice.batchview.value == 'Makerview' && editableentry.length > 0)
            this.ecf_editflag = true

          let returnedORcompletedEntry = this.batchSummary.filter(a => a.ecfstatus?.text == 'RETURNED AND COMPLETED' || a.ecfstatus?.text == 'COMPLETED')
          let returnedEntry = this.batchSummary.filter(a => a.ecfstatus?.text == 'BATCH ECF RETURNED')
          if (this.shareservice.batchview.value == 'Makerview' && returnedORcompletedEntry.length > 0 && returnedEntry.length == 0)
            this.returnedCompletedFlag = true
          this.has_bviewpagenext = datapagination.has_next;
          this.has_bviewpageprevious = datapagination.has_previous;
          this.bvpresentpage = datapagination.index;
          this.isbatchviewpage = true

          if (this.shareservice.batchOrEcfView.value == 'ecf')
            this.headerview(this.batchSummary[this.shareservice.batchECFHdrIndex.value], this.shareservice.batchECFHdrIndex.value)

        }
      })
  }

  nextClickbview() {
    if (this.has_bviewpagenext === true) {
      this.showbatchviewview(this.batchviewid, this.bvpresentpage + 1)
    }
  }

  previousClickbview() {
    if (this.has_bviewpageprevious === true) {
      this.showbatchviewview(this.batchviewid, this.bvpresentpage - 1)
    }
  }


  ecfEditForm: boolean;
  showECFedit(data: any = '') {
    if (data != '')
      this.shareservice.ecfheaderedit.next(data?.id)
    this.shareservice.editkey.next('edit')
    this.shareservice.modificationFlag.next('edit')
    this.showbatchfrm = false
    this.showheaderform = false
    this.ecfEditForm = true
    this.showinvdtlForm = false
  }

  ecfEditBack() {
    this.showbatchviewview(this.shareservice.batchviewid.value, 1)
    this.ecfEditForm = false
    this.showbatchfrm = true
    this.showheaderform = false
    this.showinvdtlForm = false

  }
  invdtlview() {
    this.ecfEditForm = false
    this.showbatchfrm = false
    this.showheaderform = false
    this.showinvdtlForm = true

  }
  invsubmit() {

  }
  viewcrno: any
  viewindex: any
  apstatusname: any
  apstatusid: any
  headerview(data, ind) {
    console.log("data", data)
    this.showbatchfrm = false
    this.showheaderform = true
    this.ecfEditForm = false
    this.showinvdtlForm = false
    this.ecfheaderid = data?.id
    this.viewcrno = data?.crno
    this.viewindex = ind
    this.apstatusname = data.apstatus
    this.apstatusid = data.apstatus_id
    this.shareservice.ecfheaderedit.next(this.ecfheaderid)
    this.shareservice.crno.next(this.viewcrno)
    this.shareservice.batchECFHdrIndex.next(ind)
    this.getinvoicedetails()
  }
  ecftypeid: any
  ppxid: any
  raisergstnum: any
  checkhr: any
  originalinvoice: any
  ecfheaderresult: any
  ap_statusflag = false
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

          this.invheaderdata = result["invoice_header"]

          for (let i = 0; i < this.invheaderdata.length; i++) {
            if (this.invheaderdata[i].apinvoiceheader_status != null) {
              this.ap_statusflag = true
              break;
            }
          }

          this.InvoiceHeaderForm.patchValue({
            invoicegst: this.invheaderdata[0]?.invoicegst
          })
          this.Ecftypepanel = datas?.aptype,
            this.Paytopanel = datas?.payto,
            this.Ppxpanel = datas?.ppx,
            this.Supplier_typepanel = datas?.supplier_type,
            this.Commodity_idpanel = datas?.commodity_id?.name,
            this.Branchpanel = datas?.branch?.code + ' - ' + datas?.branch?.name,
            this.Ecfdatepanel = this.datePipe.transform(datas?.apdate, 'dd-MMM-yyyy'),
            this.Ecfamountpanel = datas?.apamount,
            this.Ecfamountpanel = datas?.apamount,
            this.Is_originalinvoicepanel = this.originalinvoice,
            this.Remarkpanel = datas?.remark,
            this.Branchpanel = datas?.branch?.code + ' - ' + datas?.branch?.name,
            this.Is_raisedby_selfpanel = datas?.is_raisedby_self,
            this.Raised_forpanel = datas?.raisedby_dtls?.name,
            this.Raised_bypanel = datas?.raisername?.name,
            this.Locationpanel = datas?.location?.location,

            this.ecfheaderviewForm.patchValue({
              supplier_type: datas?.supplier_type,
              commodity_id: datas?.commodity_id?.name,
              ecftype: datas?.aptype,
              branch: datas?.branch?.code + ' - ' + datas?.branch?.name,
              // branch:datas.raiserbranch.name,
              ecfdate: this.datePipe.transform(datas?.apdate, 'dd-MMM-yyyy'),
              ecfamount: datas?.apamount,
              payto: datas?.payto,
              ppx: datas?.ppx,
              notename: datas?.notename,
              remark: datas?.remark,
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
        } else {
          this.notification.showError(result?.description)
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

  Movetodetail(id) {
    this.shareservice.invheaderid.next(id)
    this.shareservice.ecfheader.next(this.ecfheaderid)
    this.shareservice.comefrom.next('batch')
    this.onSubmit.emit()
    // this.router.navigate(['ECFAP/invdetailview'])

  }
  back() {
    this.showbatchfrm = true
    this.showheaderform = false
    this.ecfEditForm = false
    this.showinvdtlForm = false

    // this.onBack.emit()

  }

  SubmitForm() {
    if (this.SubmitApproverForm?.value?.remarks === "") {
      this.toastr.error('Please Enter Purpose');
      return false;
    }
    this.ecfservices.ecfApprove(this.SubmitApproverForm?.value, '')
      .subscribe(result => {
        if (result.status) {
          this.notification.showSuccess('Approved Successfully')
          this.popupclose.nativeElement.click();
          this.router.navigate(['ECFAP/ecfapproval'])
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
          this.router.navigate(['ECFAP/ecfapproval'])
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
      this.jpgUrlsAPI = this.imageUrl + "ecfserv/fileview/" + id + "?token=" + token;
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

  coverNotedownload(id, ecftypeid) {
    this.SpinnerService.show()
    if (ecftypeid != 4) {
      this.ecfservices.batchcoverNotedownload(id)
        .subscribe((results) => {

          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = "ExpenseClaimForm.pdf";
          link.click();
          this.SpinnerService.hide()
        },
          error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }

        )
    } else {

      this.ecfservices.coverNoteadvdownload(id)
        .subscribe((results) => {

          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = "ExpenseClaimForm.pdf";
          link.click();
          this.SpinnerService.hide()
        },
          error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }

        )
    }


  }

  ecfApprovePopup(text) {
    if (text == 'approve') {
      this.submit_btn = 1
      this.popup_heading = 'Approve'
    }
    else if (text == 'approve and forward') {
      this.submit_btn = 2
      this.popup_heading = 'Approve and Forward'

    }
    else if (text == 'reject') {
      this.submit_btn = 3
      this.popup_heading = 'Reject'
    }
    else if (text == 'return') {
      this.submit_btn = 4
      this.popup_heading = 'Return'

    }
    this.popupopen6()
    console.log("Form", this.SubmitBatchForm.value)
    this.approvename = {
      label: "Approver Name",
      method: "get",
      url: this.ecfmodelurl + "ecfapserv/approver_dropdown",
      params: "&commodityid=" + this.commodityid + "&created_by=" + this.createdbyid,
      searchkey: "query",
      Outputkey: "id",
      "displaykey": "code",
      prefix: 'name',
      suffix: 'limit',
      formcontrolname: "approvedby",
      id: "ecfbatch-view-0014",
      separator: "hyphen"
    }
  }
  batchApprove() {
    const form = this.SubmitBatchForm.value

    if (form.remark == "") {
      this.toastr.error('Please enter Remarks.')
      return false
    }
    this.SpinnerService.show();
    form.id = this.batchviewid
    this.ecfservices.batchApprove(form)

      .subscribe(result => {
        this.SpinnerService.hide();

        if (result.status != "success") {
          this.notification.showError(result.description)
          return false
        }
        else {
          this.notification.showSuccess("Successfully Approved!...")
          this.popupclose.nativeElement.click();
          this.onBack.emit()
        }
      })
  }

  batchReject() {
    const form = this.SubmitBatchForm.value

    if (form.remark == "") {
      this.toastr.error('Please enter Remarks.')
      return false
    }
    this.SpinnerService.show();
    form.id = this.batchviewid

    this.ecfservices.batchReject(form)

      .subscribe(result => {
        this.SpinnerService.hide();

        if (result.status != "success") {
          this.notification.showError(result.description)
          return false
        }
        else {
          this.notification.showSuccess("Successfully Rejected!...")
          this.popupclose.nativeElement.click();
          this.onBack.emit()
        }
      })
  }

  onselectionchange(e, i) {
    console.log("e.chck", e.checked)
    if (e.checked == true) {
      this.batchSummary[i].select = true
    } else {
      this.batchSummary[i].select = false
    }
  }

  batchReturn() {
    let ecfselectedflag = false
    let data = []
    for (let i = 0; i < this.batchSummary.length; i++) {
      if (this.batchSummary[i].select == true) {
        ecfselectedflag = true
        if (this.batchSummary[i].remarks == "" || this.batchSummary[i].remarks == undefined || this.batchSummary[i].remarks == null) {
          this.toastr.error('Please enter ECF wise Remarks.')
          return false
        }
        let entry = { ecf_id: this.batchSummary[i].id, remark: this.batchSummary[i].remarks }
        data.push(entry)
      }
    }

    if (!ecfselectedflag) {
      {
        this.toastr.error('Please select the ECF(s) to be returned.')
        return false
      }
    }
    const form = this.SubmitBatchForm.value

    if (form.remark == "") {
      this.toastr.error('Please enter Remarks.')
      return false
    }
    this.SpinnerService.show();

    this.ecfservices.batchReturn(this.batchviewid, form.remark, data)

      .subscribe(result => {
        this.SpinnerService.hide();

        if (result.status != "success") {
          this.notification.showError(result.description)
          return false
        }
        else {
          this.notification.showSuccess("Successfully Returned!...")
          this.popupclose.nativeElement.click();
          this.onBack.emit()
        }
      })
  }

  backform() {
    this.onBack.emit()
  }
  popupback() {
    // this.SubmitBatchForm.reset();
    this.popupclose.nativeElement.click();
    // this.restforbranch = [];
  }
  batchviewnewlist: any
  viewbatches() {
    console.log("bid", this.batchviewdatas?.id)
    this.ecfservices.batchviewwithoutpage(this.batchviewdatas?.id)
      .subscribe(result => {
        this.batchviewnewlist = result['data']
      })
  }
  movetonext() {
    this.showbatchfrm = false
    this.showheaderform = true
    let datas = this.batchviewnewlist
    this.viewindex += 1
    this.ecfheaderid = datas[this.viewindex].id
    this.apstatusname = datas[this.viewindex].apstatus
    this.apstatusid = datas[this.viewindex].apstatus_id
    this.viewcrno = datas[this.viewindex].crno
    this.getinvoicedetails()
  }

  movetoprevious() {
    this.showbatchfrm = false
    this.showheaderform = true
    let datas = this.batchviewnewlist
    this.viewindex -= 1
    this.ecfheaderid = datas[this.viewindex].id
    this.apstatusname = datas[this.viewindex].apstatus
    this.apstatusid = datas[this.viewindex].apstatus_id
    this.viewcrno = datas[this.viewindex].crno
    this.getinvoicedetails()
  }
  forward() {
    let approverid: any
    this.SpinnerService.show()
    if (this.SubmitBatchForm?.value?.approvedby === "") {
      this.toastr.error('Please Choose Approver');
      this.SpinnerService.hide()
      return false;
    }
    if (this.SubmitApproverForm?.value?.remark === "") {
      this.toastr.error('Please Enter Remarks');
      this.SpinnerService.hide()
      return false;
    }

    if (typeof (this.SubmitBatchForm?.value?.approvedby) == 'object') {
      approverid = this.SubmitBatchForm?.value?.approvedby?.id
    } else if (typeof (this.SubmitBatchForm?.value?.approvedby) == 'number') {
      approverid = this.SubmitBatchForm?.value?.approvedby
    } else {
      this.toastr.error('Please Choose Approver Name from the Dropdown');
      this.SpinnerService.hide()
      return false;

    }


    let data = {
      "id": this.batchviewid,
      "approvedby": approverid,
      "remark": this.SubmitBatchForm?.value?.remark
    }
    this.ecfservices.batchapproveforward(data)
      .subscribe(result => {
        if (result?.status == 'success') {
          this.notification.showSuccess('Forwarded Successfully')
          this.popupclose.nativeElement.click();
          this.SpinnerService.hide()
          this.onBack.emit()
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
      "crno": "",
      "is_raisedby_self": true,
      "raised_by": datas?.raisedby,
      "branch": datas?.branch?.id
    }
    console.log("ecfheaderid", this.ecfheaderid)
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

  data1(datas) {

    this.showimageHeaderAPI = false
    this.showimagepdf = false
    let id = datas?.file_id
    let filename = datas?.file_name
    // this.ecfservice.downloadfile(id)




    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = filename.split('.')
    let extension = stringValue[stringValue.length - 1]
    if (extension === "png" || extension === "jpeg" || extension === "jpg" ||
      extension === "PNG" || extension === "JPEG" || extension === "JPG") {

      // this.showimageHeaderAPI = true
      // this.showimagepdf = false

      this.jpgUrlsAPI = window.open(this.imageUrl + "ecfapserv/ecffile/" + id + "?token=" + token, '_blank');

    }
    if (extension === "pdf" || extension === "PDF") {
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
    if (extension === "csv" || extension === "ods" || extension === "xlsx" || extension === "txt" ||
      extension === "ODS" || extension === "XLSX" || extension === "TXT") {
      // this.showimagepdf = false
      // this.showimageHeaderAPI = false
    }




  }


  fileback() {
    this.closedbuttons.nativeElement.click();
  }



  branchname() {
    this.ecfservices.getbranchscroll('', 1).subscribe(data => {
      this.Branchlist = data['data'];
    });
    this.BatchUpdateForm.get('approvedbranch').valueChanges.pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap((value: any) => this.ecfservices.getbranchscroll(value, 1).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ))
    ).subscribe(data => {
      this.Branchlist = data['data'];
    });

  }

  approvername2() {
    let appkeyvalue: String = "";
    this.getapprover2(appkeyvalue);
    let branch_id = this.BatchUpdateForm.controls['approvedbranch'].value?.id ? this.BatchUpdateForm.controls['approvedbranch'].value?.id : ""
    this.BatchUpdateForm.get('approvedby').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.ecfservices.getECFapproverscroll(1, this.commodityid, this.createdbyid, branch_id, value)
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

  private getapprover2(appkeyvalue) {
    let branch_id = this.BatchUpdateForm.controls['approvedbranch'].value?.id ? this.BatchUpdateForm.controls['approvedbranch'].value?.id : ""
    this.branchid = branch_id
    this.ecfservices.getECFapproverscroll(1, this.commodityid, this.createdbyid, branch_id, appkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.approverList = datas;
      })
  }

  public displayFnBranch(branchtype?: branchListss): string | undefined {
    return branchtype ? branchtype.code + " - " + branchtype.name : undefined;
  }

  approverbranchScroll() {
    setTimeout(() => {
      if (
        this.branchmatAuto &&
        this.autocompleteTrigger &&
        this.branchmatAuto.panel
      ) {
        fromEvent(this.branchmatAuto.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.branchmatAuto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(
            x => {
              const scrollTop = this.branchmatAuto.panel.nativeElement.scrollTop;
              const scrollHeight = this.branchmatAuto.panel.nativeElement.scrollHeight;
              const elementHeight = this.branchmatAuto.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_branchnext) {

                  this.ecfservices.getbranchscroll(this.BatchUpdateForm.get('approvedbranch').value, this.has_branchpresentpage + 1).subscribe((data: any) => {
                    let dear: any = data['data'];
                    console.log('second');
                    let pagination = data['pagination']
                    this.Branchlist = this.Branchlist.concat(dear);
                    if (this.Branchlist.length > 0) {
                      this.has_branchnext = pagination.has_next;
                      this.has_branchprevious = pagination.has_previous;
                      this.has_branchpresentpage = pagination.index;
                    }
                  })
                }
              }
            }
          )
      }
    });
  }

  update_batch() {

    const dataas = this.BatchUpdateForm?.value
    if (dataas.approvedby == "" || dataas.approvedby == null || dataas.approvedby == undefined) {
      this.notification.showError("Please Choose Approver Name");
      return false
    }
    if (typeof (dataas?.approvedby) == 'object') {
      dataas.approvedby = dataas?.approvedby?.id
    } else if (typeof (dataas?.approvedby) == 'number') {
      dataas.approvedby = dataas?.approvedby
    } else {
      this.notification.showError("Please Choose Anyone Approver Name From the Dropdown");
      return false;
    }
    let ecfiddata = []
    for (let i = 0; i < this.batchSummary.length; i++) {
      ecfiddata.push({ id: this.batchSummary[i].id })
    }
    let datas = {
      "commodity_id": this.commodityid,
      "ecftype": 1,
      "doctype": this.batchSummary[0]?.aptype_id,
      "remark": this.batchSummary[0]?.remark,
      "branch": this.batchSummary[0]?.branch[0]?.id,
      "ecfhdr": ecfiddata,
      "approvedby_id": dataas?.approvedby,
      "id": this.batchviewid
    }
    // this.approvename = {
    //   label: "Approver Name",
    //   method: "get",
    //   url: this.ecfmodelurl + "ecfapserv/approver_dropdown",
    //   params: "&commodityid=" + this.commodityid + "&created_by=" + this.createdbyid,
    //   searchkey: "query",
    //   displaykey: "name",
    //   wholedata: true,
    //   required: true,
    //   formcontrolname: "approvedby"
    // }
    console.log("datas", datas)
    this.ecfservices.submitbatch(datas).subscribe(result => {
      console.log("resultssss", result)
      if (result?.id != undefined) {
        this.notification.showSuccess("Success");
        this.BatchUpdateForm.controls['approvedbranch'].reset("")
        this.closedbutton.nativeElement.click();
        this.onBack.emit()

      } else {
        this.notification.showError(result?.description)
        return false;
      }
    })
  }

  appback() {

    this.BatchUpdateForm.controls['approvedbranch'].reset("")
    this.BatchUpdateForm.controls['approvedby'].reset("")
    this.closedbutton.nativeElement.click();
  }

  viewtrnlist: any = [];
  viewtrn(id) {
    this.popupopen1()
    this.viewtrnlist = []
    this.SpinnerService.show()
    this.ecfservices.getViewTrans_ecf(id, 1).subscribe(data => {
      this.viewtrnlist = data['data'];
      this.batch_summary();
      this.SpinnerService.hide()
    })
  }
  name: any;
  designation: any
  branch: any;
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
  crno_validate(value) {
    let config: any = {
      value: "",
    };
    if (value?.crno !== null) {
      config = {
        value: value?.crno,
      }
    }
    else {
      config = {
        value: "-",
      }
    }
    return config;
  }
  ecf_date_validate(data) {
    let config: any = {
      value: "",
      "type": 'Date',
      "datetype": "dd-MMM-yyyy"
    };
    if (data?.apdate !== "None") {
      config = {
        value: data?.apdate,
        "type": 'Date',
        "datetype": "dd-MMM-yyyy"
      }
    }
    else {
      config = {
        value: "-",
      }
    }
    return config;
  }
  edit_validate(data) {
    let config: any = {
      icon: "edit",
      function: true,
      value: "",
    };
    if (this.ecf_editflag && (data?.ecfstatus?.text == 'BATCH ECF RETURNED' || data?.ecfstatus?.text == 'DRAFT')) {
      config = {
        icon: "edit",
        function: true,
      }
    }
    else {
      config = {
        value: "-",
      }
    }
    return config;
  }
  ECFSummarydata: any = [{
    columnname: "Batch No",
    key: "batchno",
  },
  {
    columnname: "Batch Date",
    key: "batch_date", "type": 'Date', "datetype": "dd-MMM-yyyy"
  },
  {
    columnname: "Batch Amount",
    "key": "batchamount", "prefix": "₹", "type": 'Amount'
  },
  {
    columnname: "ECF Count",
    key: "batchcount",
  },
  {
    columnname: "Raiser Name",
    "key": "raisername",
  },
  {
    columnname: "Branch Name",
    key: "branchname",
  },
  {
    columnname: "Approver Name",
    key: "approvername",
  },
  ]
  ECFSummary_data: any = [{
    columnname: "CR No",
    key: "crno",
    validate: true,
    validatefunction: this.crno_validate.bind(this),
  },
  {
    columnname: "ECF Type",
    key: "aptype",
  },
  {
    columnname: "Commodity Name",
    key: "commodity_id", type: "object",
    objkey: "name",
  },
  {
    columnname: "ECF Date",
    key: "apdate",
    validate: true,
    "type": 'Date',
    "datetype": "dd-MMM-yyyy",
    validatefunction: this.ecf_date_validate.bind(this),
  },
  {
    columnname: "ECF Amount",
    "key": "apamount", "prefix": "₹", "type": 'Amount'
  },
  {
    columnname: "ECF Status",
    key: "ecfstatus", type: "object",
    objkey: "text",
  },
  {
    columnname: "Payment For",
    key: "payto",
  },
  {
    columnname: "View",
    key: "view",
    button: true,
    style: { color: "green", cursor: "pointer" },
    icon: "visibility",
    function: true,
    clickfunction: this.headerview.bind(this),
  },
  ]
  ECFSummary_data_ecf_approver: any = [{
    columnname: "CR No",
    key: "crno",
    validate: true,
    validatefunction: this.crno_validate.bind(this),
  },
  {
    columnname: "ECF Type",
    key: "aptype",
  },
  {
    columnname: "Commodity Name",
    key: "commodity_id", type: "object",
    objkey: "name",
  },
  {
    columnname: "ECF Date",
    key: "apdate",
    validate: true,
    "type": 'Date',
    "datetype": "dd-MMM-yyyy",
    validatefunction: this.ecf_date_validate.bind(this),
  },
  {
    columnname: "ECF Amount",
    "key": "apamount", "prefix": "₹", "type": 'Amount'
  },
  {
    columnname: "ECF Status",
    key: "ecfstatus", type: "object",
    objkey: "text",
  },
  {
    columnname: "Payment For",
    key: "payto",
  },
  {
    columnname: "Remarks",
    key: "remarksfield",
    value: "remarks mat form field will come here"
  },
  {
    columnname: "Select",
    key: "checkbox",
    value: "Checkbox will come here"

  },
  {
    columnname: "View",
    key: "view",
    button: true,
    style: { color: "green", cursor: "pointer" },
    icon: "visibility",
    function: true,
    clickfunction: this.headerview.bind(this),

  },
  {
    columnname: "Edit",
    key: "edit",
    button: true,
    style: { color: "green", cursor: "pointer" },
    icon: "edit",
    function: true,
    clickfunction: this.showECFedit.bind(this),
    validate: true,
    validatefunction: this.edit_validate.bind(this),
  },
  ]
  ecf_data_summary() {
    this.ECFSummarydataapi = {
      FeSummary: true,
      data: [this.batchviewdatas]
    }
  }
  ecf_data_summary_api_obj: any
  ecf_data_summary1() {
    this.ecf_data_summary_api_obj = { method: "get", "url": this.ecfURL + "ecfapserv/get_batch/" + this.batchviewid }
  }
  SummarybatchData: any = [
    { columnname: "Type", key: "Type" },
    { columnname: "Status", key: "comments" },
    { columnname: "From Date", key: "created_date", "type": 'date', "datetype": "dd-MMM-yyyy" },
    { columnname: "Remarks", key: "remarks" },
    { columnname: "Employee Name", key: "from_user", type: "object", objkey: "name", suffix: "View Details", function: true, clickfunction: this.view.bind(this) },
    { columnname: "Approver Name ", key: "to_user", type: "object", objkey: "name", suffix: "View Details", function: true, clickfunction: this.viewto.bind(this) },
  ]
  SummaryApibatchObjNew: any;
  batch_summary() {
    this.SummaryApibatchObjNew = {
      FeSummary: true,
      data: this.viewtrnlist
    }
  }
  popupopen1() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ecfbatch-view-0001"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  ecfap_list() {
    this.popupopen2();
  }
  popupopen2() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById(".bd-example-modal-xl"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  batch_list() {
    this.popupopen3();
  }
  popupopen3() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById(".bd-example-modal-xl"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  attachment_view(data) {
    this.popupopen5();
    this.fildatas = data['file_data']
    this.SummaryApifileObjNew = {
      FeSummary: true,
      data: this.fildatas
    }
  }
  popupopen5() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ecfbatch-view-0005"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  popupopen6() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("approver_popup"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
}
