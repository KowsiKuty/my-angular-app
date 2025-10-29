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
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { PageEvent } from '@angular/material/paginator';

export interface commoditylistss {
  id: string;
  name: string;
}
export interface approverListss {
  id: string;
  code: string
  name: string;
  designation: string
  limit: number;
}

export interface branchListss {
  id: any;
  name: string;
  code: string;
  codename: string;
}

export interface PMDLocationlists {
  id: any;
  location: string;
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
  selector: 'app-ecf-approval-view',
  templateUrl: './ecf-approval-view.component.html',
  styleUrls: ['./ecf-approval-view.component.scss']
})
export class EcfApprovalViewComponent implements OnInit {

  @Output() linesChange = new EventEmitter<any>();
  @ViewChild(FormGroupDirective) fromGroupDirective: FormGroupDirective
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  ecfheaderviewForm: FormGroup
  InvoiceHeaderForm: FormGroup
  imageUrl = environment.apiURL
  ecfmodelurl = environment.apiURL
  approverbranch: any = {
    label: "Branch",
    // "method": "get",
    // "url": this.ecfmodelurl + "usrserv/search_branch",
    // params: "",
    // searchkey: "query",
    // displaykey: "codename",
    // Outputkey: "name",
    // formControlName: "branch_id",
    // id: "ecf-approval-view-0059"
  }
  TypeList: any
  SupptypeList: any
  isLoading: boolean;
  tomorrow = new Date()
  invheaderdata: any
  ecfheaderid: any
  amt: any
  sum: any
  invoiceheaderdetailForm: FormGroup
  SubmitApproverForm: FormGroup

  showhdrview = true
  showdtlview = false
  @ViewChild('fileInput') fileInput;
  @ViewChild('closebutton') closebutton;
  @ViewChild('closebutton1') closebutton1;
  @ViewChild('closeglbutton') closeglbutton;
  @ViewChild('supclosebutton') supclosebutton;
  @ViewChild('uploadclose') uploadclose;
  @ViewChild('commoditytype') matcommodityAutocomplete: MatAutocomplete;
  @ViewChild('commodityInput') commodityInput: any;
  commodityList: Array<commoditylistss>
  disableecfsave = true
  showgst = true
  restformdep: any;
  tokenValues: any
  showimageHeaderAPI: boolean
  showimagepdf: boolean
  pdfurl: any
  jpgUrlsAPI: any
  headertotalamt: any
  raisername: any
  raiserempname: any
  tranrecords: any
  readinvhdrdata = false
  @Output() onView = new EventEmitter<any>();
  approvernames: any = {label:"Approver Name"};
  // {
  //   label: "Approver Name",
  //   method: "get",
  //   url: this.ecfmodelurl + "ecfapserv/approver_dropdown",
  //   params: "",
  //   searchkey: "query",
  //   displaykey: "name",
  //   required: true,
  //   formcontrolname: "approvedby"
  // }
  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]
  RecurYesorno = [{ 'value': 1, 'display': 'YES' }, { 'value': 0, 'display': 'NO' }]
  behalfyesorno = [{ 'value': true, 'display': 'Yes', "checked": true }, { 'value': false, 'display': 'No', "checked": false }]

  SubmitECFApproverForm: FormGroup;
  loginuserid: any;
  @ViewChild('auditclose') auditclose;
  editorDisabled = false;

  @ViewChild('branchref') branchmatAuto: MatAutocomplete;
  @ViewChild('branchidInput') branchidInput: any;

  branchList: Array<any> = [];
  has_branchnext: boolean = true;
  has_branchprevious: boolean = false;
  has_branchpresentpage: number = 1;
  approverList: Array<approverListss>;
  @ViewChild('appInput') appInput: any;
  @ViewChild('approver') matappAutocomplete: MatAutocomplete;

  paytoid: any
  currentpageapp: any = 1
  has_nextapp: boolean = true
  has_previousapp: boolean = true
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  commodityid: any;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  createdbyid: any;
  @ViewChild('closedbuttons') closedbuttons;
  @ViewChild('closedbutton') closedbutton;
  @ViewChild('closeviewfiles') closeviewfiles;

  Branchlist: Array<branchListss>;
  PMDyesno = 'N'
  PMDLocationlist: Array<PMDLocationlists>;
  invhdrsaved = false
  formData: FormData = new FormData();
  file_process_data: any = {};
  uploadFileTypes = ['Invoice', 'Email', 'Supporting Documents', 'Others']
  // ParentObj: any
  // ChildObj: any
  SummaryApiattachObjNew: any;
  approver_submit_btn: number;
  micro_approver_submit_btn: number;
  approver_forward_submit_btn: number;
  reject_submit_btn: number;
  return_submit_btn: number;
  submit_btn: number;
  popup_heading: string;
  restforbranch: any[];
  ecf_approval_Commodity_field: any
  deletefile: any;
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
    if (!ecfdatas) {
      this.SpinnerService.show()
    }
    else {
      this.SpinnerService.hide()
    }
    console.log("ecfdatas", ecfdatas)
    this.commodityid = ecfdatas?.commodity_id
    this.createdbyid = ecfdatas?.raisedby
    if (ecfdatas?.apstatus == "DRAFT" || ecfdatas?.apstatus == "PENDING IN ECF APPROVAL" || ecfdatas?.apstatus == "READY FOR BATCH") {
      this.editorDisabled = false
    } else {
      this.editorDisabled = true
    }
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

    this.ecf_approval_Commodity_field = {
      label: "Commodity Name",
      method: "get",
      url: this.ecfmodelurl + "mstserv/commoditysearch",
      params: "&code=" + "&name=",
      searchkey: "name",
      displaykey: "name",
      Outputkey: "id",
      required: true,
      formcontrolname: "commodity_id"
    }
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
    this.approverbranch = {
    label: "Branch",
    "method": "get",
    "url": this.ecfmodelurl + "usrserv/search_branch",
    params: "",
    searchkey: "query",
    displaykey: "codename",
    // Outputkey: "name",
    wholedata: true,
    formcontrolname: "branch_id",
    id: "ecf-approval-view-0059"
  }
        this.approvernames = {
      label: "Approver Name",
      method: "get",
      url: this.ecfmodelurl + "ecfapserv/approver_dropdown",
      params: "",
      searchkey: "query",
      Outputkey: "id",
      "displaykey": "name_code_limit",
      // prefix: 'name',
      // suffix: 'limit',
      formcontrolname: "approvedby",
      id: "ecf-approval-view-0060",
      // separator: "hyphen",
      tooltip: true,
      tooltipkey: 'name_code_limit'
    }
    // this.ParentObj = {
    //   label: "Branch",
    //   "method": "get",
    //   "url": this.imageUrl + "usrserv/search_branch",
    //   params: "",
    //   searchkey: "query",
    //   displaykey: "name",
    //   formControlName: "branch_id"
    // }

    // this.ChildObj = {
    //   label: "Approver Name",
    //   "method": "get",
    //   "url": this.imageUrl + "ecfapserv/approver_dropdown",
    //   params: "&commodityid=" + this.commodityid + "&created_by=" + this.createdbyid,
    //   searchkey: "query",
    //   "displaykey": "name",
    //   "Depkey": "id",
    //   "DepValue": "branch_id",
    //   formControlName: "approvedby"
    // }
    this.getinvoicedetails()
    this.getRecurringType()

    // this.ecfservices.getbranchscroll('', 1).subscribe(data => {
    //   this.branchList = data['data'];
    // });
    this.SubmitECFApproverForm.get('branch_id').valueChanges.pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap((value: any) => this.ecfservices.getbranchscroll(value, 1).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ))
    ).subscribe(data => {
      this.branchList = data['data'];
    });



  }
enable_view_file_pagination: boolean = false
  view_file_pagination: any
  is_pca : any = false
  pca_no : any =""
  can_approvere:any
  getinvoicedetails() {
    this.ap_statusflag = false
    
    this.ecfservices.getecfheader(this.ecfheaderid, false)
      .subscribe(result => {
        console.log("result",result)
        this.SpinnerService.hide()
        if(result?.id != undefined){
        let datas = result
        this.ecfheaderresult = datas
        this.can_approvere = datas?.can_approve
        console.log("can_approvere--->", this.can_approvere);
        if(datas?.apstatus == "APPROVED"){
          this.notification.showInfo("This Claim is Already Approved")
        }
        if(datas?.apstatus == "REJECT"){
          this.notification.showInfo("This Claim is Already Rejected")
        }
        if(datas?.aptype_id == 3 || datas?.aptype_id == 13){
          this.raisername = datas?.raisername?.name
        }else{
        this.raisername = datas?.raisername
        }
        this.raiserempname = datas?.raisername?.name
        this.raisergstnum = datas?.raiserbranchgst
        this.checkhr = datas?.is_onbehalfoff_hr
        this.ecftypeid = datas?.aptype_id
        if (this.ecftypeid == 4) {
          this.ppxid = datas?.ppx_id?.id
        }
        this.paytoid = result?.payto_id?.id
        if(this.ecftypeid == 3 || this.ecftypeid == 13 || (this.ecftypeid == 4 && this.paytoid == 'E' )){
          this.show_suppdetails = false
        }
        else{
          this.show_suppdetails = true
        }
        if(datas?.is_originalinvoice == true){
          this.originalinvoice = "Yes"
        }else{
          this.originalinvoice = "No"
        }

        this.invheaderdata = result["invoice_header"]
        if (this.invheaderdata && this.invheaderdata.length > 0) {
          this.view_file_pagination = this.invheaderdata[0].file_data; // ✅ take file_data of first element
          this.preparePagedFileData(this.view_file_pagination);
          this.enable_view_file_pagination = this.view_file_pagination.length > 10;
        }

        this.is_pca = this.invheaderdata[0].is_pca
        this.pca_no = this.invheaderdata[0].pca_no
        if(this.invheaderdata[0]?.servicetype?.id == 2 || this.invheaderdata[0]?.servicetype?.id == 3)
          this.showRecurDates = true
        else 
          this.showRecurDates = false
  
        if(this.invheaderdata[0]?.servicetype?.id == 2)
          this.showRecurMonth = true
        else
          this.showRecurMonth = false
        
        for(let i=0; i<this.invheaderdata.length; i++)
        {
         if(this.invheaderdata[i].apinvoiceheader_status != null)
         {
           this.ap_statusflag = true
           break;
         }
         }
 
          this.InvoiceHeaderForm.patchValue({
          invoicegst:this.invheaderdata[0]?.invoicegst
         })
      
        if(result.approver_id == this.loginuserid && result.ecfstatus_id ==2 && result.batch_no == null)
        {
          this.showApprove = true
          // this.SubmitECFApproverForm.patchValue({
          //   branch_id: datas?.branch?.id,
          //   approvedby: datas?.approver_id,
          // })
        }
        else
        {
          this.showApprove = false
        }
        let num: number = +datas?.apamount;
        let amt = new Intl.NumberFormat("en-GB",{ style: 'decimal', minimumFractionDigits : 2, maximumFractionDigits: 2}).format(num);
        amt = amt ? amt.toString() : '';
        this.ecfheaderviewForm.patchValue({
          supplier_type: datas?.supplier_type,
          commodity_id: datas?.commodity_id,
          ecftype: datas?.aptype,
          branch: datas?.branch?.code + ' - ' + datas?.branch?.name,
          // branch:datas.raiserbranch.name,
          ecfdate: this.datePipe.transform(datas?.apdate, 'dd-MMM-yyyy'),
          ecfamount: amt,
          payto: datas?.payto,
          ppx: datas?.ppx,
          notename: datas?.notename,
          remark: datas?.remark,
          advancetype: datas?.advancetype?.text,
          // client_code: datas?.client_code?.client_name,
          // rmcode: datas?.rmcode?.code + "-" + datas?.rmcode?.name,
          is_raisedby_self:datas?.is_raisedby_self,
          raised_by:datas?.raisername?.code + ' - ' + datas?.raisername?.name,
          raised_for:datas?.raisedby_dtls?.name,
          location:datas?.location?.location,
          is_originalinvoice:this.originalinvoice,
          inwarddetails_id : datas?.inwarddetails_id

        })

          console.log("this.ecfheaderviewForm.value---->", this.ecfheaderviewForm.value);
          this.approvernames =
                {
                  label: "Approver Name",
                  "method": "get",
                  "url": this.ecfmodelurl + "ecfapserv/approver_dropdown",
                  params: "&commodityid=" + this.ecfheaderviewForm.value.commodity_id?.id + "&created_by=" + this.createdbyid,
                  "searchkey": "query",
                  Outputkey: "id",
                  required: true,
                  "displaykey": "name_code_limit",
                  // prefix: 'name',
                  // suffix: 'limit',
                  formcontrolname: 'approvedby',
                  // separator: "hyphen",
                  tooltip: true,
                  tooltipkey: 'name_code_limit'
                }
        this.getinvoicehdrrecords(this.invheaderdata)
        if( this.invheaderdata?.length > 0){
        
          let totalamount =  this.invheaderdata.map(x => x.totalamount);
          this.headertotalamt = totalamount.reduce((a, b) => a + b, 0);
        
        // ----
       
      }
      
    }else{
      this.notification.showError(result?.description)
      return false
    }
      },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }

    
      )
  }
  getcommoditydd(data) {
    let commoditykeyvalue: String = "";
    this.getcommodity(commoditykeyvalue);
    this.ecfheaderviewForm.get('commodity_id').valueChanges
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
    return this.ecfheaderviewForm.get('commodity_id');
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
  branch_id:any
  approverbranchclick(e){
    console.log("approverbranchclick", e);
    this.branch_id = e?.id
    console.log("this.branch_id", this.branch_id);
    console.log("this.SubmitECFApproverForm.value", this.SubmitECFApproverForm.value?.branch_id?.id);
    if(this.branch_id === ""){
          this.approvernames = {
      label: "Approver Name",
      method: "get",
      url: this.ecfmodelurl + "ecfapserv/approver_dropdown",
      params: "&commodityid=" + this.ecfheaderviewForm.value.commodity_id.id + "&created_by=" + this.createdbyid + "&branch_id=" + this.branch_id,
      searchkey: "query",
      Outputkey: "id",
      "displaykey": "name_code_limit",
      // prefix: 'name',
      // suffix: 'limit',
      formcontrolname: "approvedby",
      id: "ecf-approval-view-0060",
      tooltip: true,
      tooltipkey: 'name_code_limit'
      // separator: "hyphen"
    }
    }
    else{
      this.approvernames = {
      label: "Approver Name",
      method: "get",
      url: this.ecfmodelurl + "ecfapserv/approver_dropdown",
      params: "&commodityid=" + this.ecfheaderviewForm.value.commodity_id?.id + "&created_by=" + this.createdbyid + "&branch_id=" + this.branch_id,
      searchkey: "query",
      Outputkey: "id",
      "displaykey": "name_code_limit",
      // prefix: 'name',
      // suffix: 'limit',
      formcontrolname: "approvedby",
      id: "ecf-approval-view-0060",
      tooltip: true,
      tooltipkey: 'name_code_limit'
      // separator: "hyphen"
    }
    }
  }
  SubmitForm() {
    this.disableecfsave = true
    const currentDate = this.ecfheaderviewForm?.value

    if (typeof (currentDate.commodity_id) == 'object') {
      currentDate.commodity_id = this.ecfheaderviewForm?.value?.commodity_id?.id
    } else if (typeof (currentDate.commodity_id) == 'number') {
      currentDate.commodity_id = currentDate.commodity_id
    } else {
      this.notification.showError("Please Choose any one Commodity Name from the dropdown");
      this.disableecfsave = false
      // this.SpinnerService.hide();
      return false;
    }

    let datas = this.ecfheaderresult

    let ecfeditdata = {
      "supplier_type": datas?.supplier_type_id,
      "commodity_id": currentDate.commodity_id,
      "aptype": datas?.aptype_id,
      "apdate": this.datePipe.transform(datas?.apdate, 'yyyy-MM-dd'),
      "apamount": datas?.apamount,
      "ppx": datas?.ppx_id?.id,
      "notename": this.ecfheaderviewForm?.value?.notename,
      "remark": datas?.remark,
      "payto": datas?.payto_id?.id,
      "advancetype": datas?.advancetype?.id,
      "ppxno": "",
      "location": "",
      "inwarddetails_id": datas?.inwarddetails_id,
      "is_originalinvoice": datas?.is_originalinvoice,
      "crno": "",
      "is_raisedby_self": true,
      "raised_by": datas?.raisedby,
      "branch": datas?.branch?.id
    }
    this.SpinnerService.show();
    this.ecfservices.editecfheader(ecfeditdata, this.ecfheaderid)
      .subscribe(result => {
        if (result.id == undefined) {
          this.notification.showError(result?.description)
          this.SpinnerService.hide()
          return false
        }
        else {
          this.notification.showSuccess("Successfully ECF Header Saved")
          this.SpinnerService.hide();
          this.ecfheaderid = result?.id
          this.ecftypeid = result?.aptype
          this.ppxid = result?.ppx
          this.createdbyid = result?.raisedby
          this.disableecfsave = true
          this.shareservice.commodity_id.next(result?.commodity_id)
          // this.approvernames = {
          //   label: "Approver Name",
          //   method: "get",
          //   url: this.ecfmodelurl + "ecfapserv/approver_dropdown",
          //   params: "&commodityid=" + result?.commodity_id + "&created_by=" + this.createdbyid,
          //   searchkey: "query",
          //   displaykey: "name",
          //   formcontrolname: "approvedby"
          // }
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.disableecfsave = false
        this.SpinnerService.hide();
      }
      )

  }
  getSections(forms) {
    return forms.controls.invoiceheader.controls;
  }

  getecftype() {
    this.ecfservice.getecftype()
      .subscribe(result => {
        if (result) {
          this.TypeList = result["data"]
        }

      },
        error => {
          this.errorHandler.handleError(error);
          // this.SpinnerService.hide();
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
          // this.SpinnerService.hide();
        })
  }

  public displayFnBranch(branchtype?: branchListss): string | undefined {
    return branchtype ? branchtype.code + " - " + branchtype.name : undefined;
  }

  branchScroll() {
    setTimeout(() => {
      if (
        this.branchmatAuto &&
        this.branchmatAuto &&
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

                  this.ecfservices.getbranchscroll(this.SubmitECFApproverForm.get('branch_id').value, this.has_branchpresentpage + 1).subscribe((data: any) => {
                    let dear: any = data['data'];
                    console.log('second');
                    let pagination = data['pagination']
                    this.branchList = this.branchList.concat(dear);
                    if (this.branchList.length > 0) {
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
  approvername(e) {
    let appkeyvalue: String = "";
    this.getapprover(appkeyvalue);
    let branch_id = this.SubmitECFApproverForm.controls['branch_id'].value?.id ? this.SubmitECFApproverForm.controls['branch_id'].value?.id : ""

    this.SubmitECFApproverForm.get('approvedby').valueChanges
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
  private getapprover(appkeyvalue) {
    let branch_id = this.SubmitECFApproverForm.controls['branch_id'].value?.id ? this.SubmitECFApproverForm.controls['branch_id'].value?.id : ""
    this.ecfservices.getECFapproverscroll(1, this.commodityid, this.createdbyid, branch_id, appkeyvalue)
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
    let branch_id = this.SubmitECFApproverForm.controls['branch_id'].value?.id ? this.SubmitECFApproverForm.controls['branch_id'].value?.id : ""

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
                this.ecfservices.getECFapproverscroll(this.currentpageapp + 1, this.commodityid, this.createdbyid, branch_id, this.appInput.nativeElement.value)
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

  showecfHdredit()
  {
    this.disableecfsave = false
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
  show_suppdetails: boolean
  // getinvoicedetails() {
  //   this.ap_statusflag = false
  //   // let spin=true
  //   // if(spin===true){
  //   this.SpinnerService.show()
  //   // }

  //   this.ecfservices.getecfheader(this.ecfheaderid, true)
  //     .subscribe(result => {
  //       // if(result){
  //       this.SpinnerService.hide()
  //       // }
  //       // this.SpinnerService.hide()
  //       console.log("result", result)
  //       if (result?.id != undefined) {
  //         let datas = result
  //         this.ecfheaderresult = datas
  //         if (datas?.apstatus == "APPROVED") {
  //           this.notification.showInfo("This Claim is Already Approved")
  //           this.SpinnerService.hide()
  //         }
  //         if (datas?.apstatus == "REJECT") {
  //           this.notification.showInfo("This Claim is Already Rejected")
  //           this.SpinnerService.hide()
  //         }
  //         if (datas?.aptype_id == 3 || datas?.aptype_id == 13) {
  //           this.raisername = datas?.raisername?.name
  //         } else {
  //           this.raisername = datas?.raisername
  //         }
  //         this.raiserempname = datas?.raisername?.name
  //         this.raisergstnum = datas?.raiserbranchgst
  //         this.checkhr = datas?.is_onbehalfoff_hr
  //         this.ecftypeid = datas?.aptype_id
  //         if (this.ecftypeid == 4) {
  //           this.ppxid = datas?.ppx_id?.id
  //         }
  //         this.paytoid = result?.payto_id?.id
  //         if (this.ecftypeid == 3 || this.ecftypeid == 13 || (this.ecftypeid == 4 && this.paytoid == 'E')) {
  //           this.show_suppdetails = false
  //         }
  //         else {
  //           this.show_suppdetails = true
  //         }
  //         if (datas?.is_originalinvoice == true) {
  //           this.originalinvoice = "Yes"
  //         } else {
  //           this.originalinvoice = "No"
  //         }

  //         this.invheaderdata = result["invoice_header"]

  //         // console.log("approverfile ======>", this.in)
  //         this.attach_summary()

  //         if (this.invheaderdata[0]?.servicetype?.id == 2 || this.invheaderdata[0]?.servicetype?.id == 3)
  //           this.showRecurDates = true
  //         else
  //           this.showRecurDates = false

  //         if (this.invheaderdata[0]?.servicetype?.id == 2)
  //           this.showRecurMonth = true
  //         else
  //           this.showRecurMonth = false

  //         for (let i = 0; i < this.invheaderdata.length; i++) {
  //           if (this.invheaderdata[i].apinvoiceheader_status != null) {
  //             this.ap_statusflag = true
  //             break;
  //           }
  //         }

  //         this.InvoiceHeaderForm.patchValue({
  //           invoicegst: this.invheaderdata[0]?.invoicegst
  //         })

  //         if (result.approver_id == this.loginuserid && result.ecfstatus_id == 2 && result.batch_no == null) {
  //           this.showApprove = true
  //           // this.SubmitECFApproverForm.patchValue({
  //           //   branch_id: datas?.branch?.id,
  //           //   approvedby: datas?.approver_id,
  //           // })
  //         }

  //         else {
  //           this.showApprove = false
  //         }
  //         let num: number = +datas?.apamount;
  //         let amt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
  //         amt = amt ? amt.toString() : '';
  //         this.ecfheaderviewForm.patchValue({
  //           supplier_type: datas?.supplier_type,
  //           commodity_id: datas?.commodity_id,
  //           ecftype: datas?.aptype,
  //           branch: datas?.branch?.code + ' - ' + datas?.branch?.name,
  //           // branch:datas.raiserbranch.name,
  //           ecfdate: this.datePipe.transform(datas?.apdate, 'dd-MMM-yyyy'),
  //           ecfamount: amt,
  //           payto: datas?.payto,
  //           ppx: datas?.ppx,
  //           notename: datas?.notename,
  //           remark: datas?.remark,
  //           advancetype: datas?.advancetype?.text,
  //           // client_code: datas?.client_code?.client_name,
  //           // rmcode: datas?.rmcode?.code + "-" + datas?.rmcode?.name,
  //           is_raisedby_self: datas?.is_raisedby_self,
  //           raised_by: datas?.raisername?.code + ' - ' + datas?.raisername?.name,
  //           raised_for: datas?.raisedby_dtls?.name,
  //           location: datas?.location?.location,
  //           is_originalinvoice: this.originalinvoice,
  //           inwarddetails_id: datas?.inwarddetails_id

  //         })

  //         this.getinvoicehdrrecords(this.invheaderdata)
  //         if (this.invheaderdata?.length > 0) {

  //           let totalamount = this.invheaderdata.map(x => x.totalamount);
  //           this.headertotalamt = totalamount.reduce((a, b) => a + b, 0);

  //           // ----

  //         }


  //       } else {
  //         this.notification.showError(result?.description)
  //         // this.SpinnerService.hide()
  //         return false
  //       }
  //     },
  //       error => {
  //         this.errorHandler.handleError(error);
  //         this.SpinnerService.hide();
  //       }


  //     )
  // }




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
    this.shareservice.invhdrstatus.next(data.apinvoiceheaderstatus_id ? data.apinvoiceheaderstatus : data.invoice_status)
    this.shareservice.comefrom.next('ecf')
    this.onView.emit()
    // this.router.navigate(['ECFAP/invdetailview'])

  }
  back() {

    this.onCancel.emit()

  }

  SubmitFormold() {
    if (this.SubmitApproverForm?.value?.remarks === "") {
      this.toastr.error('Please Enter Purpose');
      return false;
    }
    this.ecfservices.ecfApprove(this.SubmitApproverForm?.value, '')
      .subscribe(result => {
        if (result.status) {
          this.notification.showSuccess('Approved Successfully')
          this.closeviewfiles.nativeElement.click();
          this.closedbutton.nativeElement.click();
          this.router.navigate(['ECF/ecfapproval'])
          this.SpinnerService.hide();
          this.onSubmit.emit();
        } else {
          this.notification.showError(result.description)
          this.closeviewfiles.nativeElement.click();
          this.closedbutton.nativeElement.click();
          this.SpinnerService.hide();
          this.onSubmit.emit();
          return false;
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.closeviewfiles.nativeElement.click();
        this.closedbutton.nativeElement.click();
        this.SpinnerService.hide();
        this.onSubmit.emit();
      }
      )

  }
  rejectForm() {
    if(! this.disableecfsave){
      this.notification.showError("Please Save ECF Header.")
      return false;
    }
    if (this.SubmitApproverForm?.value?.remarks === "") {
      this.toastr.error('Please Enter Purpose');
      return false;
    }
    this.SpinnerService.show()
    this.SubmitECFApproverForm.controls['id'].setValue(this.ecfheaderid)
    this.ecfservices.ecfReject(this.SubmitApproverForm?.value)
      .subscribe(result => {
        this.SpinnerService.hide()
        if (result.status) {
          this.notification.showSuccess('Rejected Successfully')
          this.closeviewfiles.nativeElement.click();
          this.closedbutton.nativeElement.click();
          this.router.navigate(['ECF/ecfapproval'])
          this.SpinnerService.hide();
          this.onSubmit.emit();
        } else {
          this.notification.showError(result?.description)
          this.SpinnerService.hide();
          return false;
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )

  }

  dtlback() {
    // this.SpinnerService.show()
    this.showhdrview = true
    this.showdtlview = false
    // this.SpinnerService.hide()

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
    let extension = stringValue[stringValue.length - 1]

    if (extension === "png" || extension === "jpeg" || extension === "jpg" ||
      extension === "PNG" || extension === "JPEG" || extension === "JPG") {

      this.showimageHeaderAPI = true
      this.showimagepdf = false
      this.jpgUrlsAPI = this.imageUrl + "ecfserv/ecffile/" + id + "?token=" + token;
    }
    if (extension === "pdf" || extension === "PDF") {
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
    if (extension === "csv" || extension === "ods" || extension === "xlsx" || extension === "txt" ||
      extension === "ODS" || extension === "XLSX" || extension === "TXT") {
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
        link.download = data.file_name;
        link.click();
        this.SpinnerService.hide()
      },
        error => {
          this.SpinnerService.hide();
          this.errorHandler.handleError(error);
        }
      )
  }
  filedatas: any
  fileindex: any
  getfiledetails(datas, ind) {
    console.log("ddataas", datas)
    this.fileindex = ind
    this.filedatas = datas.value['filekey']
    this.popupopen1()
    this.SummaryApiattachObjNew = {
      FeSummary: true,
      data: this.filedatas
    }
  }
  debitbacks() {
    this.closebutton.nativeElement.click();
  }
  supbacks() {
    this.supparray = []
    this.supclosebutton.nativeElement.click();
  }
  filelist: any
  // getfiledetails(){
  //   this.ecfservice.getinvoicedetailsummary(this.ecfheaderid)
  //     .subscribe(result => {
  //      if(result){
  //       this.filelist = result['Invheader']
  //      }
  //     },
  //     error => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     })
  // }

  gettrandata() {
    this.SpinnerService.show();
    this.ecfservice.gettransactionstatus(this.ecfheaderid)
      .subscribe(result => {
        this.SpinnerService.hide();
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
    this.SpinnerService.hide();
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

  ecfApprovePopup(text) {
    if (text == 'mono') {
      this.submit_btn = 1
      this.popup_heading = 'Approver'
    }
    else if (text == 'micro') {
      this.submit_btn = 2
      this.popup_heading = 'Approver'

    }
    else if (text == 'approver_forward') {
      this.submit_btn = 3
      this.popup_heading = 'Approver and Forward'
    }
    else if (text == 'reject') {
      this.submit_btn = 4
      this.popup_heading = 'Reject'

    }
    else if (text == 'return') {
      this.submit_btn = 5
      this.popup_heading = 'Return'
    }
    this.popupopen3()
    console.log("Form", this.SubmitECFApproverForm.value)
    // this.approvernames = {
    //   label: "Approver Name",
    //   method: "get",
    //   url: this.ecfmodelurl + "ecfapserv/approver_dropdown",
    //   params: "&commodityid=" + this.ecfheaderviewForm.value.commodity_id.id + "&created_by=" + this.createdbyid,
    //   searchkey: "query",
    //   Outputkey: "id",
    //   "displaykey": "code",
    //   prefix: 'name',
    //   suffix: 'limit',
    //   formcontrolname: "approvedby",
    //   id: "ecf-approval-view-0060",
    //   separator: "hyphen"
    // }
  }

  upload_view_click() {
    this.popupopen4()
  }
  popupback() {
    // this.SubmitECFApproverForm.reset();
    this.closeviewfiles.nativeElement.click();
    this.closedbutton.nativeElement.click();
    this.restforbranch = [];
  }
  ecfApprove(txt) {
    // let datas = this.SubmitECFApproverForm.value.remark
    // if (datas == "" || datas == null || datas == undefined) {
    //   this.notification.showError("Please Enter Remarks")
    //   return false;
    // }
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
    let data
    if (txt == '')
      data = this.SubmitApproverForm?.value

    else
      data = { "id": this.SubmitECFApproverForm?.value.id, "remarks": this.SubmitECFApproverForm?.value.remark }

    this.ecfservices.ecfApprove(data, txt)
      .subscribe(result => {
        if (result.status) {
          this.notification.showSuccess('Approved Successfully')
          this.closeviewfiles.nativeElement.click();
          this.closedbutton.nativeElement.click();
          this.SpinnerService.hide();
          this.onCancel.emit();
        } else {
          this.notification.showError(result.description)
            this.closeviewfiles.nativeElement.click();
          this.closedbutton.nativeElement.click();
          this.SpinnerService.hide();
          return false;
        }
      }, error => {
        this.errorHandler.handleError(error);
           this.closeviewfiles.nativeElement.click();
          this.closedbutton.nativeElement.click();
        this.SpinnerService.hide();
      })

    // let data = { "id": this.SubmitECFApproverForm?.value.id, "remarks": this.SubmitECFApproverForm?.value.remark }
    // if (txt == '') {
    //   this.ecfservices.ecfApprove(this.SubmitApproverForm?.value)
    //     .subscribe(result => {
    //       this.SpinnerService.hide();
    //       if (result.status) {
    //         this.notification.showSuccess('Approved Successfully')
    //         this.closedbutton.nativeElement.click();
    //         this.onCancel.emit();
    //       } else {
    //         this.notification.showError(result.description)
    //         return false;
    //       }
    //     }, error => {
    //       this.errorHandler.handleError(error);
    //       this.SpinnerService.hide();
    //     }
    //     )
    // }
    // else {
    //   this.ecfservices.ecfapprove_mono(data)
    //     .subscribe(result => {
    //       this.SpinnerService.hide();
    //       if (result?.status == 'success') {
    //         this.notification.showSuccess("Successfully Approved!...")
    //         this.closedbutton.nativeElement.click();
    //         this.onCancel.emit()
    //       } else {
    //         this.notification.showError(result.description)
    //         return false;
    //       }
    //     }, error => {
    //       this.errorHandler.handleError(error);
    //       this.SpinnerService.hide();
    //     }
    //     )
    // }
  }

  ecfReject() {
    this.SubmitECFApproverForm.controls['id'].setValue(this.ecfheaderid)
    let datas = this.SubmitECFApproverForm.value.remark
    if (datas == "" || datas == null || datas == undefined) {
      this.notification.showError("Please Enter Remarks")
      return false;
    }

    this.SpinnerService.show()

    this.ecfservices.ecfReject(this.SubmitECFApproverForm.value)

      .subscribe(result => {
        this.SpinnerService.hide();

        if (result?.status != "success") {
          this.notification.showError(result?.description)
          return false
        }
        else {
          this.notification.showSuccess("Successfully Rejected!...")
          this.closeviewfiles.nativeElement.click();
          this.closedbutton.nativeElement.click();
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
  //   viewtrnlist:any=[];
  //   viewtrn(i,id)
  //   {
  //     this.ecfservices.getViewTrans(id).subscribe(data=>{
  //       this.viewtrnlist=data['data'];
  //     })
  //   }
  //   name:any;
  //   branch:any;
  //   view(dt){
  //     this.name=dt.from_user.name
  //     this.branch=dt.from_user_branch.name
  //    }
  //    viewto(dt)
  //   {
  //     this.name=dt.to_user.name
  //     this.branch=dt.to_user_branch.name
  //   }

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
      "crno": "",
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
    if(! this.disableecfsave){
      this.notification.showError("Please Save ECF Header.")
      return false;
    }
    let approverid: any
    this.SpinnerService.show()
    this.SubmitECFApproverForm.controls['id'].setValue(this.ecfheaderid)
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
          this.closeviewfiles.nativeElement.click();
          this.closedbutton.nativeElement.click();
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


  CloseFilesView() {
    this.closeviewfiles.nativeElement.click();
  }

  showimageHeaderPreview: boolean = false
  showimageHeaderPreviewPDF: boolean = false
  jpgUrls: any
  filepreview(files) {
    let stringValue = files.name.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg" ||
      stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {
      const reader: any = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.jpgUrls = reader.result
        const newTab = window.open();
        newTab.document.write('<html><body><img style="width: 500px;" src="' + this.jpgUrls + '" "/></body></html>');
        newTab.document.close();
      }
    }
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
  ecfReturn() {
    this.SubmitECFApproverForm.controls['id'].setValue(this.ecfheaderid)
    let datas = this.SubmitECFApproverForm.value.remark
    if (datas == "" || datas == null || datas == undefined) {
      this.notification.showError("Please Enter Remarks")
      return false;
    }

    this.SpinnerService.show()

    this.ecfservices.ecfreturn(this.SubmitECFApproverForm.value.id, this.SubmitECFApproverForm.value.remark)
      .subscribe(result => {
        this.SpinnerService.hide();

        if (result?.status != "success") {
          this.notification.showError(result?.description)
          return false
        }
        else {
          this.notification.showSuccess("Successfully Returned!...")
          this.closeviewfiles.nativeElement.click();
          this.closedbutton.nativeElement.click();
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


  branchdropdown(branchkeyvalue) {
    this.ecfservice.getbranch(branchkeyvalue)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.Branchlist = datas;
        }

      }, error => {
        this.errorHandler.handleError(error);
        // this.SpinnerService.hide();
      }
      )
  }


  InvHeaderFormArray(): FormArray {
    return this.InvoiceHeaderForm.get('invoiceheader') as FormArray;
  }
  PMDbranchdata: any = []
  PCA_Det = []
  showregno = false;
  getinvoicehdrrecords(datas) {
    if (this.ecftypeid == 2 && datas[0]?.is_pca == 1) {
      this.ecfservices.getPCA(this.commodityid.id, datas[0]?.pca_no, 1)
        .subscribe(result => {
          if (result.data?.length > 0) {
            this.PCA_Det = []
            this.PCA_Det.push(result.data[0])
            // this.PCA_bal_amount = +result.data[0]?.balance_amount
          }
          // else{
          //   this.PCA_bal_amount = 0
          // }
        })
    }
    for (let invhdr of datas) {
      let id: FormControl = new FormControl('');
      let suppname: FormControl = new FormControl('');
      let suppstate: FormControl = new FormControl('');
      let invoiceno: FormControl = new FormControl('');
      let creditrefno: FormControl = new FormControl('');
      let refinv_crno: FormControl = new FormControl('');
      let invoicedate: FormControl = new FormControl('');
      let invoiceamount: FormControl = new FormControl(0);
      let taxamount: FormControl = new FormControl('');
      let totalamount: FormControl = new FormControl(0);
      let otheramount: FormControl = new FormControl('');
      let roundoffamt: FormControl = new FormControl('');
      let invtotalamt: FormControl = new FormControl('');
      let apheader_id: FormControl = new FormControl('');
      let dedupinvoiceno: FormControl = new FormControl('');
      let supplier_id: FormControl = new FormControl('');
      let suppliergst: FormControl = new FormControl('');
      let msme :FormControl = new FormControl('');
      let msme_reg_no :FormControl = new FormControl('')
      let supplierstate_id: FormControl = new FormControl('');
      let raisorbranchgst: FormControl = new FormControl('');
      let invoicegst: FormControl = new FormControl('');
      let place_of_supply: FormControl = new FormControl('');
      let branchdetails_id: FormControl = new FormControl('');
      let bankdetails_id: FormControl = new FormControl('');
      let entry_flag: FormControl = new FormControl('');
      let barcode: FormControl = new FormControl('');
      let creditbank_id: FormControl = new FormControl('');
      let manualsupp_name: FormControl = new FormControl('');
      let manual_gstno: FormControl = new FormControl('')
      let filevalue: FormArray = new FormArray([]);
      let file_key: FormArray = new FormArray([]);
      let remarks: FormControl = new FormControl('');
      let is_recur: FormControl = new FormControl('0');
      let service_type: FormControl = new FormControl(1);
      let recur_fromdate: FormControl = new FormControl('');
      let recur_todate: FormControl = new FormControl('');
      let apinvoiceheader_crno: FormControl = new FormControl('');
      let debitbank_id: FormControl = new FormControl('');
      let invoicestatus: FormControl = new FormControl('');
      let is_tds_applicable: FormControl = new FormControl('');
      let paymentinstrctn: FormControl = new FormControl('');
      let is_pmd: FormControl = new FormControl('');
      let pmdlocation_id: FormControl = new FormControl('');
      let is_pca: FormControl = new FormControl(0);
      let pca_no: FormControl = new FormControl('');
      let pca_name: FormControl = new FormControl('');
      let pca_bal_amt: FormControl = new FormControl('');
      let captalisedflag: FormControl = new FormControl(false);
      let is_fa_capitalized: FormControl = new FormControl(0);

      id.setValue(invhdr.id)
      if (this.ecftypeid == 2 || (this.ecftypeid == 4 && this.ppxid == "S") || this.ecftypeid == 7 || this.ecftypeid == 14) {
        suppname.setValue(invhdr?.supplier_id?.name)
        supplierstate_id.setValue(invhdr?.supplierstate_id?.id)
        suppstate.setValue(invhdr?.supplierstate_id?.name)
        supplier_id.setValue(invhdr?.supplier_id?.id)
        suppliergst.setValue(invhdr?.supplier_id?.gstno)
        msme.setValue(invhdr?.is_msme== true ? 'YES':'NO')
        if(invhdr?.is_msme){
          this.showregno = true;
          msme_reg_no.setValue(invhdr?.msme_reg_no)
        }
        else{
          this.showregno = false;
          msme_reg_no.setValue("")
        }
      } else {
        suppname.setValue("")
        supplierstate_id.setValue("")
        supplier_id.setValue("")
        suppliergst.setValue("")
        suppstate.setValue("")
        msme.setValue("")
      }
      if (invhdr?.pmd_data == '' || invhdr?.pmd_data == undefined || invhdr?.pmd_data == null)
        this.PMDyesno = 'N'
      else
        this.PMDyesno = 'Y'

      let num = +invhdr.totalamount;
      let tot = new Intl.NumberFormat("en-GB", { style: 'decimal' }).format(num);
      tot = tot ? tot.toString() : '';
      totalamount.setValue(tot)

      num = +invhdr.invoiceamount;
      let inv = new Intl.NumberFormat("en-GB", { style: 'decimal' }).format(num);
      inv = inv ? inv.toString() : '';
      invoiceamount.setValue(inv)

      invoiceno.setValue(invhdr?.invoiceno)
      creditrefno.setValue(invhdr?.creditrefno)
      refinv_crno.setValue(invhdr?.refinv_crno)
      invoicedate.setValue(invhdr?.invoicedate)
      taxamount.setValue(invhdr?.taxamount)
      console.log("totalamount", totalamount)
      console.log("totalamount1", invhdr?.totalamount)
      otheramount.setValue(invhdr?.otheramount)
      roundoffamt.setValue(invhdr?.roundoffamt)
      invtotalamt.setValue("")
      dedupinvoiceno.setValue(invhdr?.dedupinvoiceno)
      apheader_id.setValue(invhdr?.ecfheader_id)
      raisorbranchgst.setValue(invhdr?.raisorbranchgst)
      invoicegst.setValue(invhdr?.invoicegst)
      place_of_supply.setValue(invhdr?.place_of_supply)

      branchdetails_id.setValue(invhdr?.branchdetails_id)
      bankdetails_id.setValue(invhdr?.bankdetails_id)
      entry_flag.setValue(invhdr?.entry_flag)
      barcode.setValue("")
      creditbank_id.setValue(invhdr?.creditbank_id)
      manualsupp_name.setValue(invhdr?.manualsupp_name)
      manual_gstno.setValue(invhdr?.manual_gstno)
      console.log("manualgst", invhdr?.manual_gstno)
      remarks.setValue(invhdr?.remarks)
      is_recur.setValue(invhdr?.is_recur?.id == 1 ? 1 : 0)
      // if(invhdr?.is_recur?.id == 1)
      //   this.showRecurFields = true

      service_type.setValue(invhdr?.servicetype?.id)
      if (invhdr?.servicetype?.id == 2 || invhdr?.servicetype?.id == 3)
        this.showRecurDates = true
      else
        this.showRecurDates = false

      if (invhdr?.servicetype?.id == 2)
        this.showRecurMonth = true
      else
        this.showRecurMonth = false
      recur_fromdate.setValue(invhdr?.recur_fromdate)
      recur_todate.setValue(invhdr?.recur_todate)
      filevalue.setValue([])
      file_key.setValue([])
      apinvoiceheader_crno.setValue(invhdr?.apinvoiceheader_crno)
      debitbank_id.setValue(invhdr?.debitbank_id)
      invoicestatus.setValue(invhdr?.invoice_status)
      is_tds_applicable.setValue(invhdr?.is_tds_applicable?.id)
      paymentinstrctn.setValue(invhdr?.paymentinstrctn)
      is_pmd.setValue(this.PMDyesno)
      pmdlocation_id.setValue(invhdr?.pmd_data)
      is_pca.setValue(invhdr?.is_pca )
      pca_no.setValue(invhdr?.pca_no)
      pca_bal_amt.setValue(invhdr?.pca_bal_amt)
      captalisedflag.setValue(invhdr?.captalisedflag == 'Y' ? "Yes" : "No")
      is_fa_capitalized.setValue(invhdr?.captalisedflag == 'Y' ? 1 : 0)
      this.InvHeaderFormArray().push(new FormGroup({
        id: id,
        suppname: suppname,
        suppstate: suppstate,
        invoiceno: invoiceno,
        creditrefno: creditrefno,
        refinv_crno: refinv_crno,
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
        msme:msme,
        msme_reg_no:msme_reg_no,
        supplierstate_id: supplierstate_id,
        raisorbranchgst: raisorbranchgst,
        invoicegst: invoicegst,
        place_of_supply: place_of_supply,
        branchdetails_id: branchdetails_id,
        bankdetails_id: bankdetails_id,
        entry_flag: entry_flag,
        barcode: barcode,
        creditbank_id: creditbank_id,
        manualsupp_name: manualsupp_name,
        manual_gstno: manual_gstno,
        filevalue: filevalue,
        file_key: file_key,
        remarks: remarks,
        is_recur: is_recur,
        service_type: service_type,
        recur_fromdate: recur_fromdate,
        recur_todate: recur_todate,
        filedataas: this.filefun(invhdr),
        filekey: this.filefun(invhdr),
        debitbank_id: debitbank_id,
        apinvoiceheader_crno: apinvoiceheader_crno,
        invoicestatus: invoicestatus,
        paymentinstrctn: paymentinstrctn,
        is_tds_applicable: is_tds_applicable,
        is_pmd: is_pmd,
        pmdlocation_id:pmdlocation_id,
        captalisedflag:captalisedflag,
        is_fa_capitalized:is_fa_capitalized
      }))

      if (invhdr?.pmd_data != undefined && invhdr?.pmd_data != null && invhdr?.pmd_data != '') {
        this.PMDyesno = 'Y'
        this.ecfservices.getPMDBranch(invhdr?.branchdetails_id.code)
          .subscribe(result => {
            if (result) {
              this.PMDbranchdata = result['data']
              this.getInvHdrColCount()

            }
          })
      }
      else {
        this.PMDyesno = 'N'
      }
      // this.calchdrTotal(invoiceamount, taxamount, totalamount)
      this.datasums()
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
          // this.poslist = datas;
          this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
        })

      branchdetails_id.valueChanges
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
          this.Branchlist = datas;
          this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
        })
    }
    this.getInvHdrColCount()

  }
  datasums() {
    this.amt = this.InvoiceHeaderForm.value['invoiceheader'].map(x => Number(String(x.totalamount).replace(/,/g, '')));
    this.sum = this.amt.reduce((a, b) => a + b, 0);

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

  public displayFninvbranch(branchtyperole?: branchListss): string | undefined {
    return branchtyperole ? +branchtyperole.code + "-" + branchtyperole.name : undefined;
  }

  public displayFnPmdLoc(pmdloc?: PMDLocationlists): string | undefined {
    return pmdloc ? pmdloc.location : undefined;
  }
  public displayFnplace(placeofsupply?: branchListss): string | undefined {
    return placeofsupply ? +placeofsupply.code + "-" + placeofsupply.name : undefined;
  }

  RecurringTypes: any
  RecurringTypes1: any
  getRecurringType() {
    this.ecfservices.getRecurringType()
      .subscribe(result => {
        if (result['servicetype_dropdown']) {
          let serv = result['servicetype_dropdown']
          this.RecurringTypes = serv["data"].filter(x => x.id != 1)
          this.RecurringTypes1 = serv["data"].filter(x => x.id == 1)
        }

      }, error => {
        this.errorHandler.handleError(error);
        // this.SpinnerService.hide();
      })
  }

  InvHdrColCount = 0
  getInvHdrColCount() {
    if (this.ecftypeid == 7) {
      this.InvHdrColCount = 10
    }
    else if (this.ecftypeid  == 3 || this.ecftypeid  == 13) {
      this.InvHdrColCount = 6
    }
    else if (this.ecftypeid == 4 && this.paytoid == 'E') {
      this.InvHdrColCount = 6
    }
    else if(this.ecftypeid == 2 && !this.invheaderdata[0].is_pca)
    {
      this.InvHdrColCount = 10 
    }
    else if(this.ecftypeid == 2 && this.invheaderdata[0].is_pca)
    {
      this.InvHdrColCount = 11 
    } 
    else if(this.ecftypeid == 14)
    {
      this.InvHdrColCount = 8 
    }
    else {
      this.InvHdrColCount = 9
    }
    if(this.PMDbranchdata.length >0 && this.PMDyesno =='N')
      {
        this.InvHdrColCount +=1
      }
    else  if(this.PMDbranchdata.length >0 && this.PMDyesno =='Y')
    {
      this.InvHdrColCount +=2
    }
  }


  only_numalpha(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  Invoicedatas: any = []
  headerchange: boolean = false
  datadedupe: any
  gotodetail(section, index) {
    if (this.disableecfsave == false && this.ecfheaderviewForm.value.commodity_id?.code != this.ecfheaderresult?.commodity_id?.code) {
      this.toastr.error('Please Save ECF Header');
      return false;
    }

    this.invhdrsaved = true
    this.Invoicedatas = [];
    this.formData = new FormData();
    const invoiceheaderdata = section.value
    invoiceheaderdata.totalamount = String(invoiceheaderdata.totalamount).replace(/,/g, '');
    invoiceheaderdata.invoiceamount = String(invoiceheaderdata.invoiceamount).replace(/,/g, '');

    invoiceheaderdata.apheader_id = this.ecfheaderid
    if (invoiceheaderdata.service_type == '')
      invoiceheaderdata.service_type = 1
    this.SpinnerService.show()
    this.shareservice.invheaderid.next(invoiceheaderdata.id)
    this.shareservice.ecfheader.next(this.ecfheaderid)
    this.shareservice.invhdrstatus.next(invoiceheaderdata.apinvoiceheaderstatus_id ? invoiceheaderdata.apinvoiceheaderstatus : invoiceheaderdata.invoice_status)
    this.shareservice.comefrom.next('ecf')
    if (invoiceheaderdata.remarks != this.invheaderdata[index].remarks) {
      // this.hdrsave()
    }
    else {
      this.onView.emit()
    }

  }
  hdrsaveAndApprove(txt) {
    if(! this.disableecfsave){
      this.notification.showError("Please Save ECF Header.")
      return false;
    }
    this.SubmitECFApproverForm.controls['id'].setValue(this.ecfheaderid)
    let datas = this.SubmitECFApproverForm.value.remark
    if (datas == "" || datas == null || datas == undefined) {
      this.notification.showError("Please Enter Remarks")
      return false;
    }
    if((this.file_process_data[this.uploadFileTypes[0]]?.length == 0 || this.file_process_data[this.uploadFileTypes[0]]?.length == undefined)
      && (this.file_process_data[this.uploadFileTypes[1]]?.length == 0 || this.file_process_data[this.uploadFileTypes[1]]?.length == undefined)
      && (this.file_process_data[this.uploadFileTypes[2]]?.length == 0 || this.file_process_data[this.uploadFileTypes[2]]?.length == undefined)
      && (this.file_process_data[this.uploadFileTypes[3]]?.length == 0 || this.file_process_data[this.uploadFileTypes[3]]?.length == undefined)){
      let data
      if (txt == '')
        data = this.SubmitECFApproverForm?.value
      else
        data = { "id": this.SubmitECFApproverForm?.value.id, "remarks": this.SubmitECFApproverForm?.value.remark }

      this.SpinnerService.show();

      this.ecfservices.ecfApprove(data, txt)
        .subscribe(result => {
          if (result.status) {
            this.notification.showSuccess('Approved Successfully')
            this.closeviewfiles.nativeElement.click();
            this.closedbutton.nativeElement.click();
            this.SpinnerService.hide();
            this.onCancel.emit();
          } else {
            this.notification.showError(result.description)
             this.closeviewfiles.nativeElement.click();
            this.closedbutton.nativeElement.click();
            this.SpinnerService.hide();
            this.onCancel.emit();

          }
        }, error => {
          this.errorHandler.handleError(error);
           this.closeviewfiles.nativeElement.click();
            this.closedbutton.nativeElement.click();
          this.SpinnerService.hide();
           this.onCancel.emit();
        }
        )
    }
    else {
      const invoiceheaderdata = this.InvoiceHeaderForm.get('invoiceheader').value[0]
      if (this.ecftypeid != 3 && this.ecftypeid != 13) {
        invoiceheaderdata.invoicedate = this.datePipe.transform(invoiceheaderdata?.invoicedate, 'yyyy-MM-dd');
      }
      else {
        invoiceheaderdata.invoicedate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      }
      if (typeof (invoiceheaderdata.branchdetails_id) == 'object') {
        invoiceheaderdata.raisorbranchgst = invoiceheaderdata?.branchdetails_id.gstin
        invoiceheaderdata.place_of_supply = invoiceheaderdata?.branchdetails_id?.code
        invoiceheaderdata.branchdetails_id = invoiceheaderdata?.branchdetails_id?.id
      } else {
        invoiceheaderdata.branchdetails_id = invoiceheaderdata?.branchdetails_id
      }
      if (this.PMDyesno == 'Y') {
        invoiceheaderdata.is_pmd = true

        if (typeof (invoiceheaderdata.pmdlocation_id) == 'object') {
          invoiceheaderdata.raisorbranchgst = invoiceheaderdata?.pmdlocation_id?.gstno
          invoiceheaderdata.pmdlocation_id = invoiceheaderdata?.pmdlocation_id?.id
        } else {
          invoiceheaderdata.pmdlocation_id = invoiceheaderdata?.pmdlocation_id
        }
      }
      else {
        invoiceheaderdata.is_pmd = false
        delete invoiceheaderdata.pmdlocation_id
      }
      if (invoiceheaderdata.captalisedflag) {
        invoiceheaderdata.captalisedflag = 'Y'
        invoiceheaderdata.is_fa_capitalized = 1
      }
      else {
        invoiceheaderdata.captalisedflag = 'N'
        invoiceheaderdata.is_fa_capitalized = 0
      }

      // invoiceheaderdata[i].invoiceamount = invoiceheaderdata[i].invoiceamount.replace(/,/g, '')
      // if (this.ecftypeid == 3) {
      //   // invoiceheaderdata[i].invoicegst = 'N'
      //   invoiceheaderdata.invoiceno = "inv" + this.datePipe.transform(new Date(), 'ddMM');
      // } 
      invoiceheaderdata.invoicegst = invoiceheaderdata.invoicegst

      invoiceheaderdata.invoiceamount = +(invoiceheaderdata.invoiceamount.replace(/,/g, ''))
      invoiceheaderdata.totalamount = +(invoiceheaderdata.totalamount.replace(/,/g, ''))
      if (this.ecftypeid == 14) {
        invoiceheaderdata.invoiceamount = +invoiceheaderdata.totalamount
      }
      else {
        invoiceheaderdata.invoiceamount = +invoiceheaderdata.invoiceamount
      }
      invoiceheaderdata.invtotalamt = this.sum
      // invoiceheaderdata.raisorbranchgst = this.raisergst
      // invoiceheaderdata.place_of_supply = this.place_of_supply
      invoiceheaderdata.refinv_crno = String(invoiceheaderdata.refinv_crno).trim()

      if (invoiceheaderdata?.suppname == null) {
        invoiceheaderdata.supname = ""
      }
      if (invoiceheaderdata?.taxamount == "") {
        invoiceheaderdata.taxamount = 0
      }

      invoiceheaderdata.apinvoiceheader_crno = invoiceheaderdata?.apinvoiceheader_crno,
        invoiceheaderdata.debitbank_id = invoiceheaderdata?.debitbank_id
      invoiceheaderdata.index = 0
      delete invoiceheaderdata?.suppstate
      invoiceheaderdata.module_type = 1

      if (invoiceheaderdata.service_type == 2 || invoiceheaderdata.service_type == 3) {
        invoiceheaderdata.recur_fromdate = this.datePipe.transform(invoiceheaderdata?.recur_fromdate, 'yyyy-MM-dd');
        invoiceheaderdata.recur_todate = this.datePipe.transform(invoiceheaderdata?.recur_todate, 'yyyy-MM-dd');
      }
      else {
        delete invoiceheaderdata.recur_fromdate
        delete invoiceheaderdata.recur_todate
      }
      if (this.ecftypeid != 2 && this.ecftypeid != 1) {
        delete invoiceheaderdata.is_pca
        delete invoiceheaderdata.pca_no
        delete invoiceheaderdata.pca_name
      }
      else {
        invoiceheaderdata.pca_no = this.PCA_Det[0]?.pca_no
        invoiceheaderdata.pca_name = this.PCA_Det[0]?.pca_name
      }
      invoiceheaderdata.apheader_id = this.ecfheaderid ? this.ecfheaderid : this.ecfheaderid
      this.Invoicedatas.push(this.InvoiceHeaderForm.get('invoiceheader').value[0])
      let reqData = this.Invoicedatas
      console.log("reqData", reqData)
      for (let i = 0; i < reqData.length; i++) {
        for (let type of this.uploadFileTypes) {
          this.formData.delete(type);
          let pairvalue = this.file_process_data[type];
          if (pairvalue != undefined && pairvalue != "") {
            for (let fileindex in pairvalue) {
              this.formData.append(type, this.file_process_data[type][fileindex])
            }
          }
        }
      }
      let invheaderresult: boolean;
      this.SpinnerService.show()
      this.formData.append('data', JSON.stringify(this.Invoicedatas));
      this.ecfservices.invoiceheadercreate(this.formData, 'ecfapprover')
        .subscribe(result => {          
          if (result.status == 'Failed') {
            this.SpinnerService.hide()
            invheaderresult = false
            this.notification.showError(result?.description)
            this.invhdrsaved = false
            return false
          }
          let invhdrresults = result['invoiceheader']
          if (invhdrresults != undefined) {
            if (invhdrresults?.id == undefined) {
              invheaderresult = false
              this.SpinnerService.hide()
              this.notification.showError(invhdrresults?.description)
              this.invhdrsaved = false

              return false
            } else {
              invheaderresult = true
            }
          } else {
            this.notification.showError(result?.description)
            if (result?.code == "INVALID_FILETYPE" && result?.description == "Invalid Filetype") {
              this.SpinnerService.hide()
              this.notification.showInfo("Please Delete the Uploaded File before moving further");
              return false;
            }
            return false
          }
          if (invheaderresult == true) {
            console.log("Successfully Invoice Header Saved!...")
            let data
            this.SubmitECFApproverForm.controls['id'].setValue(this.ecfheaderid)
            if (txt == '')
              data = this.SubmitECFApproverForm?.value
            else
              data = { "id": this.SubmitECFApproverForm?.value.id, "remarks": this.SubmitECFApproverForm?.value.remark }

            this.ecfservices.ecfApprove(data, txt)
              .subscribe(result => {

                if (result.status) {
                  this.notification.showSuccess('Approved Successfully')
                  this.closeviewfiles.nativeElement.click();
                  this.closedbutton.nativeElement.click();
                  this.SpinnerService.hide();
                  this.onCancel.emit();
                } else {
                  this.notification.showError(result.description)
                  this.closeviewfiles.nativeElement.click();
                  this.closedbutton.nativeElement.click();
                  this.SpinnerService.hide();
                  this.onCancel.emit();

                }
              }, error => {
                this.errorHandler.handleError(error);
                this.closeviewfiles.nativeElement.click();
                this.closedbutton.nativeElement.click();
                this.SpinnerService.hide();
                this.onCancel.emit();

              }
              )
          }
        }, error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
        )
    }

  }

  filearr = []
  // uploaddata(event:any){
  //   this.filearr =[]
  //   let data = this.InvoiceHeaderForm.value.invoiceheader;

  //   console.log(event.target.files.length);
  //   for(let i=0;i<event.target.files.length;i++)
  //   {
  //     data[0]?.filevalue?.push(event?.target?.files[i])
  //     data[0]?.filedataas?.push(event?.target?.files[i])
  //     this.filearr.push(event.target.files[i]);
  //   } 

  //   if (event.target.files.length > 0) {
  //     if (data[0]?.file_key.length < 1) {
  //       data[0]?.file_key?.push("file" + 0);
  //     }
  //   }
  // } 

  // uploaddata(event: any) {
  //   this.filearr = []
  //   let data = this.InvoiceHeaderForm.value.invoiceheader;
  //   console.log(event.target.files.length);
  //   for (let i = 0; i < event.target.files.length; i++) {
  //     data[0]?.filevalue?.push(event?.target?.files[i])
  //     data[0]?.filedataas?.push(event?.target?.files[i])
  //     this.filearr.push(event.target.files[i]);
  //   }
  //   if (event.target.files.length > 0) {
  //     if (data[0]?.file_key.length < 1) {
  //       data[0]?.file_key?.push("file" + 0);
  //     }
  //   }
  //   this.deletefile = this.InvoiceHeaderForm.value.invoiceheader
  //     this.SummaryApiAttechedFilesObjNew = {
  //       FeSummary: true,
  //       data: this.filearr
  //     }


  // }

  uploaddata(event: any) {
    this.filearr = [];
    let data = this.InvoiceHeaderForm.value.invoiceheader;

    console.log(event.target.files.length);

    for (let i = 0; i < event.target.files.length; i++) {
      data[0]?.filevalue?.push(event?.target?.files[i]);
      data[0]?.filedataas?.push(event?.target?.files[i]);
      this.filearr.push(event.target.files[i]);
    }

    if (event.target.files.length > 0) {
      if (data[0]?.file_key.length < 1) {
        data[0]?.file_key?.push("file" + 0);
      }
    }

    this.deletefile = this.InvoiceHeaderForm.value.invoiceheader;
    this.SummaryApiAttechedFilesObjNew = {
      FeSummary: true,
      data: this.filearr,
    };

    event.target.value = '';
  }

  deletefileUploadold(file) {
    const index = this.filearr.indexOf(file);
    if (index !== -1) {
      this.filearr.splice(index, 1);
    }
    if (this.filearr.length == 0) {
      this.fileInput.nativeElement.value = ""
    }
    this.SummaryApiAttechedFilesObjNew = {
      FeSummary: true,
      data: this.filearr
    }

  }
  SummaryattachData: any = [

    { columnname: "File Name", key: "file_name" },
    { columnname: "File Type", key: "document_type" },
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
  attach_summary() {
    this.SummaryApiattachObjNew = {
      FeSummary: true,
      data: this.invheaderdata
    }
  }
  popupopen1() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ecf-approval-view-0011"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }

  ecfap_view() {
    this.popupopen2();
  }
  popupopen2() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("bd-example-modal-xl"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  popupopen3() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("approver_popup"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  popupopen4() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("attachpopup"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  popupopen5() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("uploadpop"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  FilePopupOpen() {
    this.popupopen6()
  }
  popupopen6() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("viewpop"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  SummaryApiAttechedFilesObjNew: any;
  SummaryAttechedFiles: any = [
    { columnname: "File Name", key: "name" },
    // { columnname: "File Name", key: "" },
    // {
    //   columnname: "View", key: "view", icon: "open_in_new",
    //   "style": { color: "blue", cursor: "pointer" },
    //   button: true, function: true, clickfunction: this.filepreview.bind(this)
    // },
    {
      columnname: "Delete ", key: "delete", icon: "delete",
      "style": { color: "red", cursor: "pointer" },
      button: true, function: true, clickfunction: this.deletefileUpload.bind(0, this)
    },
  ]
  attachfile_summary(file) {

  }
  summaryclick() {
    this.popupopen();
  }
  popupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.querySelector("#ecf-approval-view-0086"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }



  uploadPopShow = false

  UploadPopupOpen() {
    this.popupopen5()
    // this.uploadPopShow = true
  }

  valid_arr: Array<any> = [];

  // getFileDetails(e, filetype) {
  //   this.valid_arr = []
  //   console.log('befor   this.file_process_data------------->>>>>>>>>>>', this.file_process_data)
  //   let data
  //   data = this.InvoiceHeaderForm.value.invoiceheader;
  //   for (var i = 0; i < e.target.files.length; i++) {
  //     data[0]?.filevalue?.push(e?.target?.files[i])
  //     data[0]?.filedataas?.push(e?.target?.files[i])
  //     this.valid_arr.push(e.target.files[i]);
  //   }

  //   if (e.target.files.length > 0) {


  //     if (data[0]?.file_key.length < 1) {
  //       data[0]?.file_key?.push(this.uploadFileTypes[0]);
  //       data[0]?.file_key?.push(this.uploadFileTypes[1]);
  //       data[0]?.file_key?.push(this.uploadFileTypes[2]);
  //       data[0]?.file_key?.push(this.uploadFileTypes[3]);
  //     }
  //   }
  //   if (this.file_process_data[filetype] == undefined) {
  //     this.file_process_data[filetype] = this.valid_arr;
  //   }
  //   else if (this.file_process_data[filetype] != undefined) {
  //     if (this.file_process_data[filetype].length == 0) {
  //       this.file_process_data[filetype] = this.valid_arr;
  //     }
  //     else {
  //       let Files = this.file_process_data[filetype]
  //       for (let file of this.valid_arr) {
  //         Files.push(file)
  //       }
  //       this.file_process_data[filetype] = Files;
  //     }
  //   }
  //   console.log('this.file_process_data------------->>>>>>>>>>>', this.file_process_data)
  // }

  // deletefileUpload(i, type) {
  //   const invdata = this.InvoiceHeaderForm.value.invoiceheader[0]
  //   const filedata = invdata.filevalue
  //   const filedatas = invdata.filedataas
  //   // this.fileInput:any=this.fileInput.toArray();
  //   // this.fileInput.splice(i,1);
  //   this.file_process_data[type].splice(i, 1);
  //   filedata.splice(i, 1)
  //   filedatas.splice(i, 1)

  //   let chkfiletype =0
  //   for(let i=0; i< this.uploadFileTypes.length; i++){
  //     if(this.file_process_data[this.uploadFileTypes[i]] == undefined){
  //       chkfiletype +=1
  //     }
  //     else if(this.file_process_data[this.uploadFileTypes[i]].length == 0){
  //       chkfiletype +=1
  //     }
  //   }
  //   if (chkfiletype == this.uploadFileTypes.length) {
  //     this.fileInput.nativeElement.value = ""
  //     invdata.file_key = []
  //   }
  //   console.log('this.file_process_data------------->>>>>>>>>>>', this.file_process_data)
  // }
  file_process_data2:any={};
  getFileDetails( e, filetype) {
    this.valid_arr =[]
    console.log('befor   this.file_process_data2------------->>>>>>>>>>>' ,this.file_process_data2)
  
    for (var i = 0; i < e.target.files.length; i++) {
      this.valid_arr.push(e.target.files[i]);
    }    
    if(this.file_process_data2[filetype] == undefined){
      this.file_process_data2[filetype]=this.valid_arr;
    }
    else if(this.file_process_data2[filetype] != undefined){
      if(this.file_process_data2[filetype].length ==0){
        this.file_process_data2[filetype]=this.valid_arr;
      }
      else{
        let Files = this.file_process_data2[filetype]
        for(let file of this.valid_arr){
          Files.push(file)
        }
        this.file_process_data2[filetype]=Files;
      }
    }
    for(let i=0; i< this.uploadFileTypes.length; i++){
      if(this.file_process_data2[this.uploadFileTypes[i]]?.length == 0)
        delete this.file_process_data2[this.uploadFileTypes[i]]
    }
    console.log('this.file_process_data2------------->>>>>>>>>>>' ,this.file_process_data2)    
  }
  
  uploadSubmit(){
    let data
    data = this.InvoiceHeaderForm.value.invoiceheader;
    for (var i = 0; i < this.valid_arr.length; i++) {
      data[0]?.filevalue?.push(this.valid_arr[i])
      data[0]?.filedataas?.push(this.valid_arr[i])
    }
    
    if (this.valid_arr.length > 0) {
     if(data[0]?.file_key.length < 1) {
        data[0]?.file_key?.push(this.uploadFileTypes[0]);
        data[0]?.file_key?.push(this.uploadFileTypes[1]);
        data[0]?.file_key?.push(this.uploadFileTypes[2]);
        data[0]?.file_key?.push(this.uploadFileTypes[3]);
      } 
    }
    this.file_process_data = this.file_process_data2
    this.file_process_data2 ={}
    this.uploadclose.nativeElement.click()
    
    console.log('this.file_process_data------------->>>>>>>>>>>' ,this.file_process_data)

    this.uploadclose.nativeElement.click()
        this.preparePagedFiles();


  
  }
  uploadback(){
    this.file_process_data2 ={}
    this.uploadclose.nativeElement.click()
  }
  
  // deletefileUpload(i, type) {
  //   const invdata = this.InvoiceHeaderForm.value.invoiceheader[0]
  //   const filedata = invdata.filevalue
  //   const filedatas = invdata.filedataas
  //     // this.fileInput:any=this.fileInput.toArray();
  //     // this.fileInput.splice(i,1);
  //     this.file_process_data[type].splice(i,1);
  //     filedata.splice(i, 1)
  //     filedatas.splice(i, 1)
    
  //     let chkfiletype =0
  //     for(let i=0; i< this.uploadFileTypes.length; i++){
  //       if(this.file_process_data[this.uploadFileTypes[i]] == undefined){
  //         chkfiletype +=1
  //       }
  //       else if(this.file_process_data[this.uploadFileTypes[i]].length == 0){
  //         chkfiletype +=1
  //       }
  //     }
  //     if (chkfiletype == this.uploadFileTypes.length) {
  //       this.fileInput.nativeElement.value= ""
  //       invdata.file_key =[]
  //     }
  //   console.log('this.file_process_data------------->>>>>>>>>>>' ,this.file_process_data)
  
  // }
// currentPage = 1;
// pageSize = 10; // rows per page

// get paginatedData() {
//   const start = (this.currentPage - 1) * this.pageSize;
//   const end = start + this.pageSize;

//   // flatten file_process_data into an array of objects { type, file }
//   let allData: any[] = [];
//   this.uploadFileTypes.forEach((type: string, ind: number) => {
//     this.file_process_data[type].forEach((files: any, index: number) => {
//       allData.push({
//         sno: `${ind + 1}.${index + 1}`,
//         type: type,
//         file: files,
//         index: index
//       });
//     });
//   });

//   return allData.slice(start, end);
// }

// get totalPages() {
//   return Math.ceil(
//     this.uploadFileTypes.reduce((acc, type) => acc + this.file_process_data[type].length, 0) / this.pageSize
//   );
// }

// changePage(page: number) {
//   if (page >= 1 && page <= this.totalPages) {
//     this.currentPage = page;
//   }
// }
deletefileUpload(row: any) {
  if (!row) return;

  const { file, type } = row;

  // Remove from file_process_data
  const fileList = this.file_process_data[type];
  if (fileList) {
    const idx = fileList.findIndex((f: any) => f.name === file.name);
    if (idx > -1) {
      fileList.splice(idx, 1);
    }
  }

  // Remove from InvoiceHeaderForm arrays
  const invdata = this.InvoiceHeaderForm.value.invoiceheader[0];
  if (invdata) {
    if (invdata.filevalue) {
      const idx = invdata.filevalue.findIndex((f: any) => f.name === file.name);
      if (idx > -1) invdata.filevalue.splice(idx, 1);
    }
    if (invdata.filedataas) {
      const idx = invdata.filedataas.findIndex((f: any) => f.name === file.name);
      if (idx > -1) invdata.filedataas.splice(idx, 1);
    }
  }

  // Reset if no files left
  let chkfiletype = 0;
  for (let t of this.uploadFileTypes) {
    if (!this.file_process_data[t] || this.file_process_data[t].length === 0) {
      chkfiletype++;
    }
  }
  if (chkfiletype === this.uploadFileTypes.length) {
    this.fileInput.nativeElement.value = "";
    if (invdata) invdata.file_key = [];
  }

  // Refresh paged files
  this.preparePagedFiles();

  console.log("this.file_process_data after delete:", this.file_process_data);
}



allFiles: any[] = [];
pagedFiles: any[] = [];

length_PymtAdv = 0;
pagesize_PymtAdv = 10;
pageIndexPymtAdv = 0;
pymtAdvpresentpage = 1;
pageSizeOptions = [5, 10, 25];
showFirstLastButtons = true;
isPymtAdvpage = true;

preparePagedFiles() {
  this.allFiles = [];

  Object.keys(this.file_process_data).forEach(type => {
    this.file_process_data[type].forEach((file: any) => {
      this.allFiles.push({ type, file });
    });
  });

  this.length_PymtAdv = this.allFiles.length;
  this.updatePagedFiles();
}

updatePagedFiles() {
  const startIndex = this.pageIndexPymtAdv * this.pagesize_PymtAdv;
  const endIndex = startIndex + this.pagesize_PymtAdv;
  this.pagedFiles = this.allFiles.slice(startIndex, endIndex);
}

handlePymtAdvPageEvent(event: PageEvent) {
  this.pagesize_PymtAdv = event.pageSize;
  this.pageIndexPymtAdv = event.pageIndex;
  this.pymtAdvpresentpage = event.pageIndex + 1;
  this.updatePagedFiles();
}



pagedFileData: any[] = [];
pageSize = 10;
pageIndex = 0;
length = 0;

preparePagedFileData(fileData: any[]) {
  this.length = fileData.length;
  const startIndex = this.pageIndex * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.pagedFileData = fileData.slice(startIndex, endIndex);
}

handlePageEvent(event: PageEvent, fileData: any[]) {
  this.pageIndex = event.pageIndex;
  this.pageSize = event.pageSize;
  this.preparePagedFileData(fileData);
}
}
