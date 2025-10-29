import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, FormGroupDirective, FormControlName } from '@angular/forms';
import { switchMap, finalize, debounceTime, distinctUntilChanged, tap,map,takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { EcfService } from '../ecf.service';
import { ShareService } from '../share.service';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';


export interface branchListss {
  name: string;
  codename: string;
  id: number;
}
export interface approverListss {
  full_name: string;
  id: number;
}


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
  selector: 'app-approverheader-view',
  templateUrl: './approverheader-view.component.html',
  styleUrls: ['./approverheader-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class ApproverheaderViewComponent implements OnInit {
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
  echheaderid: any
  invoiceheaderdetailForm: FormGroup
  SubmitApproverForm: FormGroup
  showheaderview = true
  showdetailview = false

  Branchlist: Array<branchListss>;
  Approverlist: Array<approverListss>;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;

  @ViewChild('branchtype') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild('approvertype') matappAutocomplete: MatAutocomplete;
  @ViewChild('approverInput') approverInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;


  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]
  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer, private datePipe: DatePipe
    , private ecfservice: EcfService, private shareservice: ShareService, private notification: NotificationService,
    private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    let data = this.shareservice.ecfapproveheader.value
    this.echheaderid = data
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
      id: this.echheaderid,
      branch_id:[''],
      approvedby:[''],
      remark: ['']

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

      let branchkeyvalue: String="";
      this.branchdropdown(branchkeyvalue);
      this.SubmitApproverForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
            // console.log('inside tap')

        }),

        switchMap(value => this.ecfservice.getbranchscroll(value,1)
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

      let approverkeyvalue: String="";
      this.approverdropdown(approverkeyvalue);
      this.SubmitApproverForm.get('approvedby').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
            // console.log('inside tap')

        }),

        switchMap(value => this.ecfservice.getapproverscroll(value,1)
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
       
      })
    }


    public displayFnbranch(branchtype?: branchListss): string | undefined {

      return branchtype ? branchtype.codename : undefined;
    }

    get branchtype() {
      return this.SubmitApproverForm.get('branch_id');
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
  getSections(forms) {
    return forms.controls.invoiceheader.controls;
  }

    public displayFnapprover(approvertype?: approverListss): string | undefined {


      return approvertype ? approvertype.full_name : undefined;
    }

    get approvertype() {
      return this.SubmitApproverForm.get('approvedby');
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
      approverid:any
      getapproveid(data){
        this.approverid = data.id
       
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
    this.ecfservice.getinvoicedetailsummary(this.echheaderid)
      .subscribe(result => {
        let datas = result
        this.ecftypeid = datas.ecftype_id
        if(this.ecftypeid == 4){
        this.ppxid = datas.ppx_id.id
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
          ppx: datas.ppx,
          notename: datas.notename,
          remark: datas.remark,
          payto: datas.payto,

        })

        if (this.ecftypeid == 2) {
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
        if (this.ecftypeid == 3 ||this.ppxid == 'S') {
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
      // branch_id: new FormControl(''),
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
    //  this.router.navigate(['/invoicedetailview'])
    this.showheaderview = false
    this.showdetailview = true
    this.getinvheaderid(id)
  }
  back() {
    this.onCancel.emit()
  }

  forward(){

    if (this.SubmitApproverForm.value.remark === "") {
      this.toastr.error('Please Enter Purpose');
      return false;
    }

    let data={
      "id":this.echheaderid,
      "approvedby":this.approverid,
      "remark" : this.SubmitApproverForm.value.remark
    }
    this.ecfservice.ecfapproveforward(data)
      .subscribe(result => {
        if (result.status) {
          this.notification.showSuccess('Forwarded Successfully')
          this.onSubmit.emit();
        } else {
          this.notification.showError(result.description)
          return false;
        }
      })

  }

  SubmitForm() {
    if (this.SubmitApproverForm.value.remark === "") {
      this.toastr.error('Please Enter Purpose');
      return false;
    }
    this.ecfservice.ecfapprove(this.SubmitApproverForm.value)
      .subscribe(result => {
        if (result.status) {
          this.notification.showSuccess('Approved Successfully')
          this.onSubmit.emit();
        } else {
          return false;
        }
      })

  }
  rejectForm() {
    if (this.SubmitApproverForm.value.remark === "") {
      this.toastr.error('Please Enter Purpose');
      return false;
    }
    this.ecfservice.ecfreject(this.SubmitApproverForm.value)
      .subscribe(result => {
        if (result.status) {
          this.notification.showSuccess('Rejected Successfully')
          this.onSubmit.emit();
        } else {
          return false;
        }
      })

  }

  detailback() {

    this.showheaderview = true
    this.showdetailview = false
  }

  debitrecords: any
  productname :any
  getinvdtlid(id,name) {
    // this.productname = name
    this.ecfservice.getinvdetailsrecords(id)
      .subscribe(results => {
        this.debitrecords = results['debit']
        // console.log("dr",this.debitrecords)
       
      })
  }


  detailrecords: any
  creditrecords: any
  debitrecordss:any
  getinvheaderid(id) {
    this.ecfservice.getinvheaderdetails(id)
      .subscribe(results => {
        // console.log("invhdrres",results)
        if(this.ecftypeid != 4){
        this.detailrecords = results['invoicedtl']
        this.detailrecords['expanded'] = false
        }
        // console.log("ir",this.detailrecords )
        this.creditrecords = results['credit']
        this.debitrecordss = results['debit']
        // console.log("drr",this.debitrecordss )
      
      })

  }

  findDetails(data) {
    this.productname = data.productname
    return this.debitrecordss.filter(x => x.invoicedetail === data.id);
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
