import { Component, OnInit,ErrorHandler,ViewChild,EventEmitter } from '@angular/core';
import { FormGroup,FormBuilder,FormArray,FormControl,Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { EcfapService } from '../ecfap.service';
import { NotificationService } from '../notification.service';
import { DatePipe } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime,distinctUntilChanged,tap,switchMap,finalize,map,takeUntil } from 'rxjs/operators';
import { MatAutocomplete,MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { error } from 'console';
import { ToastrService } from 'ngx-toastr';

export interface branchListss {
  id: any;
  name: string;
  code: string;
  codename: string;
}
export interface raiserlists {
  id: string;
  full_name: string;
  name: string
}
@Component({
  selector: 'app-payment-q-summary',
  templateUrl: './payment-q-summary.component.html',
  styleUrls: ['./payment-q-summary.component.scss']
})
export class PaymentQSummaryComponent implements OnInit {
  paymentAdviceForm:FormGroup
  viewPaymentDetForm: FormGroup
  PaymentFileForm:FormGroup
  TypeList:any;
  paymentAdvSummary:any;
  isLoading=false;
  Branchlist: Array<branchListss>;
  ecfStatusList:any;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  Raiserlist:any
  has_nextemp = true;
  has_previousemp = true;
  currentpageemp: number = 1;
  constructor(private fb:FormBuilder,private errorHandler:ErrorHandler,private SpinnerService:NgxSpinnerService,
    public ecfservice:EcfapService,private notification:NotificationService,private datePipe:DatePipe,public toastr:ToastrService ) { }

  @ViewChild('matraiserAutocomplete') matraiserAutocomplete: MatAutocomplete;
  @ViewChild('raiserbrInput') raiserbrInput: any;
  @ViewChild('raisertyperole') matempraiserAutocomplete: MatAutocomplete;
  @ViewChild('raiserInput') raiserInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('closedpaybutton') closedpaybutton;

  ngOnInit(): void {
    this.paymentAdviceForm = this.fb.group({
      start_date: [''],
      end_date: [''],
      apinvoiceheaderstatus_id: [''],
      crno:[''],
      invoiceheader_crno:[''],
      aptype: [''],
      raiser_name: [''],
      raiserbranch_id:[''],
      empbranch_id_list:[''],
      invoice_no:[''],
      minamt:[''],
      maxamt:[''],
    })
    this.viewPaymentDetForm = this.fb.group({
      UTR_No: [''],
      paid_amount: [''],
      paid_date: [''],
      paymode: [''],
      pvno: [''],

    })
    this.PaymentFileForm = this.fb.group({
      callbackrefno:[''],
      username:[''],
      pvno:['']
    })

    this.getStatus()
    this.getecftype()
    this.paymentAdviceSearch(1)
  }
  getStatus() {
    this.ecfservice.getStatus()
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.ecfStatusList = result["data"]
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  getecftype() {
    this.ecfservice.getecftype()
      .subscribe(result => {
        if (result['data'] != undefined) {
          let ecftypes = result["data"]
          this.TypeList = ecftypes.filter(type => type.id != 1 && type.id != 6)
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  isPaymentAdvicepage: boolean
  pageSize_paymentAdvice = 10;
  getpaymentAdvtotalcount:any
  paymentAdvPresentPage =1
  lengthPaymentAdv =0
  pageIndex_paymentadv =0
  advSummarypresentpage: number = 1;
  searchData: any={}

  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  showFirstLastButtons:boolean=true;
  length_batch = 0;
  pageSize_batch = 10;
  pageIndexmk =0
  handlePaymentAdvPageEvent(event: PageEvent) {
    this.lengthPaymentAdv = event.length;
    this.pageSize_paymentAdvice = event.pageSize;
    this.pageIndex_paymentadv = event.pageIndex;
    this.advSummarypresentpage=event.pageIndex+1;
    this.paymentAdviceSearch(this.advSummarypresentpage);    
  }

  paymentAdviceSearch(pageNumber = 1)
  { 
    if(this.paymentAdviceForm){
      let search=this.paymentAdviceForm.value
    
      this.searchData.crno = search.crno ;
      this.searchData.invoiceheader_crno = search.invoiceheader_crno;
      this.searchData.aptype = search.aptype;
      this.searchData.raiser_name = search.raiser_name.id;
      this.searchData.raiserbranch_id = search.raiserbranch_id.id;
      this.searchData.invoice_no = search.invoice_no;
      this.searchData.start_date = this.datePipe.transform(search.start_date, 'yyyy-MM-dd');
      this.searchData.end_date = this.datePipe.transform(search.end_date, 'yyyy-MM-dd');
      this.searchData.apinvoiceheaderstatus_id = search.apinvoiceheaderstatus_id;

      for (let i in this.searchData) 
      {
          if (this.searchData[i] === null || this.searchData[i] === "") {
            delete this.searchData[i];
          }
        }    
      }
    else{
      this.searchData={}
    }

    if(this.searchData?.start_date != undefined && this.searchData?.end_date == undefined)
    {
      this.notification.showError("Please select To Date")
      return false
    }
    if(this.searchData?.end_date != undefined && this.searchData?.start_date == undefined )
    {
      this.notification.showError("Please select From Date")
      return false
    }

    this.SpinnerService.show()
    this.ecfservice.getQueSummary(this.searchData,pageNumber)
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.paymentAdvSummary = result['data']
          let datapagination = result["pagination"];
          this.lengthPaymentAdv = result?.count
          if (this.paymentAdvSummary.length === 0) {
            this.isPaymentAdvicepage = false
          }
          if (this.paymentAdvSummary.length > 0) {
            this.paymentAdvPresentPage = datapagination.index;
            this.isPaymentAdvicepage = true
          }
          else
          {
          this.lengthPaymentAdv = 0;
          this.isPaymentAdvicepage = false
          }
          
          this.SpinnerService.hide()
        } else {
          this.notification.showError(result?.message)
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
  getPaymentAdvRsrbranch() {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.paymentAdviceForm.get('raiserbranch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
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
      })
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
        this.SpinnerService.hide();
      }
      )
  }
  public displayFnbranchrole(branchtyperole?: branchListss): string | undefined {
    return branchtyperole ? +branchtyperole.code + "-" + branchtyperole.name : undefined;
  }
  raiseBranchScroll() {
    setTimeout(() => {
      if (
        this.matraiserAutocomplete &&
        this.matraiserAutocomplete &&
        this.matraiserAutocomplete.panel
      ) {
        fromEvent(this.matraiserAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matraiserAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matraiserAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matraiserAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matraiserAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservice.getbranchscroll(this.raiserbrInput.nativeElement.value, this.currentpage + 1)
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
  getPaymentAdvRaiserdropdown() {
    // this.getrm('');

    let rmkeyvalue: String = "";
    this.getrm(rmkeyvalue);
    this.paymentAdviceForm.get('raiser_name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.ecfservice.getrmscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Raiserlist = datas;
      })

  }
  getrm(rmkeyvalue) {
    this.ecfservice.getrmcode(rmkeyvalue)
      .subscribe(results => {
        if(results){
        let datas = results["data"];
        this.Raiserlist = datas;
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide()
      })
  }
  public displayFnraiserrole(raisertyperole?: raiserlists): string | undefined {
    return raisertyperole ? raisertyperole.full_name : undefined;
  }
  raiserScroll() {
    setTimeout(() => {
      if (
        this.matempraiserAutocomplete &&
        this.matempraiserAutocomplete &&
        this.matempraiserAutocomplete.panel
      ) {
        fromEvent(this.matempraiserAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matempraiserAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matempraiserAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matempraiserAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matempraiserAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextemp === true) {
                this.ecfservice.getrmscroll(this.raiserInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Raiserlist.length >= 0) {
                      this.Raiserlist = this.Raiserlist.concat(datas);
                      this.has_nextemp = datapagination.has_next;
                      this.has_previousemp = datapagination.has_previous;
                      this.currentpageemp = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  failedInitType : any =""
  showcbsrefno = false
  statusChange(id)
  {
    if((id == 27 || id == 14) && this.failedInitType == 13)
      this.showcbsrefno = true
    else if((id != 27 && id != 14) && this.failedInitType == 13)
      this.showcbsrefno = false
    else if(id == 9 && this.failedInitType == 25)
      this.showcbsrefno = true
    else if(id != 9 && this.failedInitType == 25)
      this.showcbsrefno = false
    
  }
  resetPaymentAdvice()
  {
    this.paymentAdviceForm.controls['crno'].reset(""),
    this.paymentAdviceForm.controls['aptype'].reset(""),
    this.paymentAdviceForm.controls['invoiceheader_crno'].reset(""),
    this.paymentAdviceForm.controls['raiser_name'].reset(""),
    this.paymentAdviceForm.controls['raiserbranch_id'].reset(""),
    this.paymentAdviceForm.controls['invoice_no'].reset(""),
    this.paymentAdviceForm.controls['start_date'].reset(""),
    this.paymentAdviceForm.controls['end_date'].reset(""),
    this.paymentAdviceForm.controls['apinvoiceheaderstatus_id'].reset(""),
    this.paymentAdviceSearch(1);
  } 
  rptFormat : number
  paymentAdvRptDwnld()
  {
    if(this.paymentAdviceForm){
      let search=this.paymentAdviceForm.value
    
      this.searchData.crno = search.crno ;
      this.searchData.invoiceheader_crno = search.invoiceheader_crno;
      this.searchData.aptype = search.aptype;
      this.searchData.raiser_name = search.raiser_name.id;
      this.searchData.raiserbranch_id = search.raiserbranch_id.id;
      this.searchData.invoice_no = search.invoice_no;
      this.searchData.start_date = this.datePipe.transform(search.start_date, 'yyyy-MM-dd');
      this.searchData.end_date = this.datePipe.transform(search.end_date, 'yyyy-MM-dd');
      this.searchData.apinvoiceheaderstatus_id = search.apinvoiceheaderstatus_id;

      for (let i in this.searchData) 
      {
          if (this.searchData[i] === null || this.searchData[i] === "") {
            delete this.searchData[i];
          }
        }    
      }
    else{
      this.searchData={}
    }
    
    if(this.searchData?.start_date != undefined && this.searchData?.end_date == undefined)
    {
      this.notification.showError("Please select To Date")
      return false
    }
    if(this.searchData?.end_date != undefined && this.searchData?.start_date == undefined )
    {
      this.notification.showError("Please select From Date")
      return false
    }

    if(this.searchData.start_date == "" || this.searchData.start_date == undefined || this.searchData.start_date == null)
    {
      delete this.searchData.start_date
    }
    
    if(this.searchData.end_date != "" && this.searchData.end_date != undefined && this.searchData.end_date != null)
    {
      this.searchData.end_date = this.datePipe.transform(this.searchData.end_date, 'yyyy-MM-dd');
    }
    else
    {
      delete this.searchData.end_date
    }
    this.SpinnerService.show()
    this.ecfservice.getRptDownload(this.rptFormat,this.searchData)
      .subscribe((results) => {

        if(results?.code ==undefined)
        {
          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = "Payment Advice Report.xlsx";
                    
          link.click();         
        }
        else
        {
          this.notification.showError(results.code)
        }
        this.SpinnerService.hide()
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }

  viewPaymentDet(data)
  {
    this.viewPaymentDetForm.controls['UTR_No'].setValue(data.UTR_No)
    this.viewPaymentDetForm.controls['paid_amount'].setValue(data.paid_amount)
    this.viewPaymentDetForm.controls['paid_date'].setValue(this.datePipe.transform(data.paid_date, 'dd-MMM-yyyy'))
    this.viewPaymentDetForm.controls['paymode'].setValue(data.paymode)
    this.viewPaymentDetForm.controls['pvno'].setValue(data.pvno)
  }
  name:any;
  value:any;
  value_array:any[] = [];
  utrsubmit(){
    let data = this.PaymentFileForm.value
    this.name = data?.username
    this.value = data?.callbackrefno
    let datas=
      {
          "name": this.name
        }
      this.value_array.push(datas)
      let datas2 = {
          "val": this.value
      }
      this.value_array.push(datas2)
    let values2 = {
      values:this.value_array}
    this.SpinnerService.show()
    this.ecfservice.submitqsummary(values2).subscribe(result =>{
      if(result.status == 'success'){
        this.notification.showSuccess(result.message)
        this.SpinnerService.hide()
        this.closedpaybutton.nativeElement.click()
      }
      if(result.status == 'failed'){
        this.notification.showSuccess(result.message)
        this.SpinnerService.hide()
      }
    },(error) =>{
      this.toastr.error(error)
      this.SpinnerService.hide()  
    })

  }
  utrback(){
    this.PaymentFileForm.reset()
    this.closedpaybutton.nativeElement.click()
  }
}
