import { Component, OnInit, ViewChild, ElementRef, Output, TemplateRef, EventEmitter, ViewChildren, QueryList, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { EcfapService } from '../ecfap.service';
import { ErrorHandlingService } from '../error-handling.service';
import { NgxSpinnerService } from "ngx-spinner";
import { formatDate, DatePipe } from '@angular/common';
import { NotificationService } from '../notification.service';
import { PageEvent } from '@angular/material/paginator';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatSelectionList } from '@angular/material/list';
import { environment } from 'src/environments/environment';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { MatMenuTrigger } from '@angular/material/menu';
import { SharedService } from 'src/app/service/shared.service';

export interface supplierss {
  id: string;
  name: string;
}
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
  selector: 'app-schedular',
  templateUrl: './schedular.component.html',
  styleUrls: ['./schedular.component.scss']
})
export class SchedularComponent implements OnInit {
  ecfmodelurl = environment.apiURL
    SummaryApiSchedulerecfObjNew:any;
  SummarySchedulerData:any;
  constructor(public fb: FormBuilder, public ecfservice: EcfapService, public sharedService: SharedService,
    public errorHandler: ErrorHandlingService, public SpinnerService: NgxSpinnerService, public datePipe: DatePipe
    , public notification: NotificationService, public dialog: MatDialog, private overlayContainer: OverlayContainer) {
    this.SummaryApischedulerObjNew = {
      method: "get",
      url: this.ecfmodelurl + "ecfapserv/apscheduler",
      params: "&history=",
    };

    //  this.SummaryApiSchedulerecfObjNew = {
    //          method: "post",
    //          url: this.ecfmodelurl + "ecfapserv/apscheduler_summary",
    //          params: "",
    //          data: {},OverallCount: "Total count"
    //        }
  }

  restSchedulerformummary:any= []
  globalpayload:any;
  SummaryApischedulerObjNew: any;
  CommonSummaryForm: boolean = true;
  commonForm: FormGroup
  schedularchangeform: FormGroup
  filtr_form:FormGroup
  TypeList: any;
  ecftypelist:any;
  searchData: any = {}
  timeSlots: string[] = [];
  @ViewChild('cboxSummary') summaryBoxComponent: any;
  commonSummary: any
  iscommonsummarypage: boolean
  has_commonpageprevious = false
  has_commonpagenext = false
  pagesizecommon = 10;
  getcommontotalcount: any
  length_common = 0;
  length_schedularhistory = 0;
  // commonpresentpage: number = 1;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  showFirstLastButtons: boolean = true;
  has_next = false
  has_previous = false
  currentpage = 1;
  schedularbranch:any
  sub_module_name:any
  ngOnInit(): void {
    // this.Schedulersumfunc();
    this.commonForm = this.fb.group({
      crno: [''],
      batch_no: [''],
      invoiceheader_crno: [''],
      aptype: [''],
      raiser_name: [''],
      raiserbranch_id: [''],
      invoice_no: [''],
      invoice_amount: [''],
      minamt: [''],
      maxamt: [''],
      supplier_id: [''],
      from_date: [''],
      to_date: [''],
      apinvoiceheaderstatus_id: [''],
      invoice_status: [''],
      branchdetails_id:['']
    })
    this.schedularchangeform = this.fb.group({
      start_time: [''],
      end_time: [''],
      thread_count: [''],
      process_count: [''],
      schedule_interval: ['']
    })
    this.filtr_form = this.fb.group({
      crno:[''],
      invoiceheader_crno:[''],
      ecftype:[''],
      supplier:[''],
      invoice_amt:[''],
      branchdetails_id:[''],
      raiser_name:['']
    })
    this.sub_module_name = this.sharedService.ap_shcedular_sub_module_name
    console.log("submodulename --->",this.sub_module_name)
    this.getecftype()
    // this.commonSummarySearch('',1)
    this.SchedulersumSearch('')
    this.schedularget()
    this.get_common_status()

  }
  schedularSummarydata(e){
    if(!e?.data){
      this.notification.showError(e?.message)
    }
  }
  supplierList: any
  private getsupplier(suppkeyvalue) {
    this.ecfservice.getsupplierscroll(suppkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierList = datas;
        this.has_next = results["pagination"]?.has_next
      })
  }
  public displayFnSupplier(supplier?: supplierss): string | undefined {
    return supplier ? supplier.name : undefined;
  }
  @ViewChild('supp') matsupAutocomplete: MatAutocomplete;
  get supplier() {
    return this.commonForm.get('supplier_id');
  }
  isLoading = false
  suppliername_common() {
    let suppkeyvalue: String = "";
    this.getsupplier(suppkeyvalue);

    this.commonForm.get('supplier_id').valueChanges
    .pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.isLoading = true),
      switchMap(value =>
        this.ecfservice.getsuppliernamescroll(this.suplist, value, 1, 1).pipe(
          finalize(() => this.isLoading = false)
        )
      )
      )
      .subscribe((results: any[]) => {
        this.supplierList = results["data"]; 
      });

  }
  getecftype() {
    this.ecfservice.getecftype()
      .subscribe(result => {
        if (result['data'] != undefined) {
          let ecftypes = result["data"]
          this.TypeList = ecftypes.filter(type => type.id != 1 && type.id != 6)
        this.ecftypelist= {
         label: "ECF Type",
         params: "",
         searchkey: "query",
         displaykey: "text",
         Outputkey: "id",
         fronentdata: true,
         data: this.TypeList,   
         valuekey: "id",
         formcontrolname: "ecftype"
       }
       this.Schedulersumfunc()
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
      
  }
  onECFTypeChange() {
    const selectedInvoiceStatusIds = this.ecfTypeList?.selectedOptions.selected.map(option => option.value) || [];
    this.searchValues['aptype'] = selectedInvoiceStatusIds; 
    this.commonSummarySearch('aptype', 1); 
  }
  inv_status:any
  commonpresentpage:any
  commonSummarySearch(field:string,pageNumber) {
    
 
     console.log(`Searching ${field}:`, this.searchValues[field]);
 
     if(field == 'crno'){
 
       this.searchData['crno'] =this.searchValues['crno'];
 
     }
       if(field == 'invoice_crno'){
 
       this.searchData['invoiceheader_crno'] =this.searchValues['invoice_crno'];
 
     }
     if(field == 'invoice_amount'){
 
       this.searchData['invoice_amount'] =this.searchValues['invoice_amount'];
 
     }
    if (this.searchFieldName == 'invoice_status') {

      let selectedInvoiceStatusIds = Object.keys(this.selectedInvoiceStatus).filter(key => this.selectedInvoiceStatus[key]).map(Number);
      
      this.searchData.invoice_status = selectedInvoiceStatusIds[0]
      
      if (selectedInvoiceStatusIds.length > 1) {
      
        this.SpinnerService.hide()
       
        this.notification.showError("Select Only One Invoice Status")
      }

    }
    if (this.searchFieldName == 'invoice_amount') {
      this.searchData.invoice_amount = this.searchValue
    }

    if(field == 'invoice_amount'){
 
      this.searchData['invoice_amount'] =this.searchValues['invoice_amount']

    }
    if(field == 'aptype'){
 
      this.searchData['aptype'] = this.searchValues['aptype'][0] ;
    }
    // if(this.commonForm){
    //   let search=this.commonForm.value

    //   this.searchData.crno = search.crno ;
    //   this.searchData.batch_no = search.batch_no;
    //   this.searchData.invoiceheader_crno = search.invoiceheader_crno;
    //   this.searchData.aptype = search.aptype;
    //   this.searchData.raiser_name = search.raiser_name.id;
    //   this.searchData.raiserbranch_id = search.raiserbranch_id.id;
    //   this.searchData.invoice_no = search.invoice_no;
    //   this.searchData.invoice_amount = search.invoice_amount;
    //   this.searchData.minamt = search.minamt;
    //   this.searchData.maxamt = search.maxamt;
    //   this.searchData.is_originalinvoice = search.is_originalinvoice
    //   this.searchData.supplier_id = search.supplier_id.id
    //   this.searchData.from_date = this.datePipe.transform(search.from_date, 'yyyy-MM-dd');
    //   this.searchData.to_date = this.datePipe.transform(search.to_date, 'yyyy-MM-dd');
    //   this.searchData.apinvoiceheaderstatus_id = search.apinvoiceheaderstatus_id;
    //   this.searchData.invoice_status = search.invoice_status;

    //   for (let i in this.searchData) 
    //   {
    //       if (this.searchData[i] === null || this.searchData[i] === "") {
    //         delete this.searchData[i];
    //       }
    //     }    
    //   }
    // else{
    //   this.searchData={}
    // }

    if (this.searchData?.from_date != undefined && this.searchData?.to_date == undefined) {
      
      this.notification.showError("Please select To Date")
     
      return false
    }
    if (this.searchData?.to_date != undefined && this.searchData?.from_date == undefined) {
      
      this.notification.showError("Please select From Date")
      
      return false
    }

    if (this.searchData.invoice_amount === '' || this.searchData.invoice_amount === undefined|| this.searchData.invoice_amount === null) {
      
      delete this.searchData.invoice_amount;
    
    }

    if(field == 'supplier'){
 
      this.searchData['supplier_id'] =this.selectedSupplier.id

    }
   
    if(field == 'branch'){
 
      this.searchData['raiserbranch_id'] =this.selectedSupplier.id

    }

    if(field == 'raiser'){

      this.searchData['raiser_name'] =this.selectedSupplier.id

    }

    if (this.searchData.invoiceheader_crno === '' || this.searchData.invoiceheader_crno === undefined|| this.searchData.invoiceheader_crno === null) {
     
      delete this.searchData.invoiceheader_crno;
    
    }
    
    if (this.searchData.crno === '' || this.searchData.crno === undefined|| this.searchData.crno === null) {
      
      delete this.searchData.crno;
   
    }
    
    if (this.searchData.invoice_status === '' || this.searchData.invoice_status === undefined|| this.searchData.invoice_status === null) {
     
      delete this.searchData.invoice_status;
    
    }
    
    if (this.searchData.aptype === '' || this.searchData.aptype === undefined|| this.searchData.aptype === null) {
     
      delete this.searchData.aptype;
   
    }
  //  this.SummaryApiSchedulerecfObjNew = {
  //            method: "post",
  //            url: this.ecfmodelurl + "ecfapserv/apscheduler_summary",
  //            params: "",
  //            data:this.searchData,OverallCount: "Total count"
  //          }
    // if(spinnershow)
      this.SpinnerService.show()

    console.log("this.searchData", this.searchData)

    this.ecfservice.getschedularsummary(this.searchData, pageNumber, this.sub_module_name)
      
    .subscribe(result => {
       
      if (result['data'] != undefined) {
          
        this.isSearchVisible = {}
        
        this.commonSummary = result['data']
          
        let datapagination = result["pagination"];
         
        this.inv_status = this.commonSummary?.apinvoicehdr_status?.id
         
        this.getcommontotalcount = datapagination?.count
          
        this.length_common = datapagination?.count
          
        if (this.commonSummary.length === 0) {
            
          this.iscommonsummarypage = false
          
        }
          
        if (this.commonSummary.length > 0) {
            
          this.has_commonpagenext = datapagination.has_next;
            
          this.has_commonpageprevious = datapagination.has_previous;
              
          this.iscommonsummarypage = true
          
        }
          
        else {
            
          this.length_common = 0;
            
          this.iscommonsummarypage = false
          
        }

          this.SpinnerService.hide()
        
        } 
        
        else {
          
          this.isSearchVisible = {}

          this.notification.showError(result?.message)
          
          this.SpinnerService.hide()
          
          return false
        
        }
      },
        error => {
          this.isSearchVisible = {}
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }

  pageIndex_common = 0;
  pageSize_common = 10;
  presentpagecommon: number = 1
  handleCommonSearchPageEvent(event: PageEvent) {
    this.length_common = event.length;
    this.pageSize_common = event.pageSize;
    this.pageIndex_common = event.pageIndex;
    this.presentpagecommon = event.pageIndex + 1;
    this.commonSummarySearch('',this.presentpagecommon)

  }

  //     resetcommon()
  // {
  //   this.commonForm.controls['crno'].reset(""),
  //   this.commonForm.controls['aptype'].reset(""),
  //   this.commonForm.controls['minamt'].reset(""),
  //   this.commonForm.controls['maxamt'].reset(""),
  //   this.commonForm.controls['batch_no'].reset(""),
  //   this.commonForm.controls['invoiceheader_crno'].reset(""),
  //   this.commonForm.controls['raiser_name'].reset(""),
  //   this.commonForm.controls['raiserbranch_id'].reset(""),
  //   this.commonForm.controls['invoice_no'].reset(""),
  //   this.commonForm.controls['invoice_amount'].reset(""),
  //   this.commonForm.controls['from_date'].reset(""),
  //   this.commonForm.controls['to_date'].reset(""),
  //   this.commonForm.controls['apinvoiceheaderstatus_id'].reset(""),
  //   // this.commonForm.controls['is_originalinvoice'].reset("")
  //   this.commonForm.controls['supplier_id'].reset(""),
  //   this.commonForm.controls['invoice_status'].reset(""),
  //   this.commonSummarySearch(1);
  // } 

  getRaiserbranch() {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.filtr_form.get('branchdetails_id').valueChanges
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
  Branchlist: Array<branchListss>;
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
  @ViewChild('matbranchAutocomplete') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
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
 get branchtype() {
    return this.commonForm.get('branchdetails_id');
  }
  public displayFnbranchrole(branchtyperole?: branchListss): string | undefined {
    return branchtyperole ? +branchtyperole.code + "-" + branchtyperole.name : undefined;
  }
  @ViewChild('matraiserAutocomplete') matraiserAutocomplete: MatAutocomplete;
  @ViewChild('raiserbrInput') raiserbrInput: any;
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
  selectsupplierlist: any;
  supplierdata: any
  // @ViewChild('Suppliertype') matsupAutocomplete: MatAutocomplete;
  @ViewChild('suppInput') suppInput!: ElementRef;
  supplierNameData: any
  suplist: any
  supplierScroll() {
    let suppkeyvalue: String = "";
    this.getsupplier(suppkeyvalue);
  
    this.filtr_form.get('supplier').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')
  
        }),
        switchMap(value => this.ecfservice.getsuppliernamescroll(this.suplist, value, 1, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierList = datas;
  
      })
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
                this.ecfservice.getsuppliernamescroll(this.suplist, this.suppInput.nativeElement.value, 1, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.supplierList.length >= 0) {
                      this.supplierList = this.supplierList.concat(datas);
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

  public displayFnraiserrole(raisertyperole?: raiserlists): string | undefined {
    return raisertyperole ? raisertyperole.full_name : undefined;
  }

  get raisertyperole() {
    return this.commonForm.get('raiser_name');
  }
  Raiserlist: any
  getraiserdropdown() {
    // this.getrm('');

    let rmkeyvalue: String = "";
    this.getrm(rmkeyvalue);
    this.filtr_form.get('raiser_name').valueChanges
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

    this.commonForm.get('raiser_name').valueChanges
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
        if (results) {
          let datas = results["data"];
          this.Raiserlist = datas;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide()
      })
  }

  @ViewChild('raisertyperole') matempraiserAutocomplete: MatAutocomplete;
  @ViewChild('raiserInput') raiserInput: any;
  has_nextemp = true;
  has_previousemp = true;
  currentpageemp: number = 1;
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

  commonStatusList: any
  apMakerStatusList: any
  get_common_status() {
    this.ecfservice.get_common_status()
      .subscribe(result => {
        if (result['data'] != undefined) {
          let data = result['data']
          this.commonStatusList = data.filter(x => (x.id == 41 || x.id == 51))
          this.apMakerStatusList = data.filter(x => (x.text == 'AP MAKER' || x.text == 'AP RE-PROCCESS' || x.text == 'AP RE-AUDIT'))
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  ecfStatusList2: any
  commonRptDwnld() {

  }
  schedulargetvalue: any
  stop_flag = false
  schedularget() {
    this.ecfservice.schedularget().subscribe(result => {
      if (result['data'] != undefined) {
        let cleanedData = JSON.parse(JSON.stringify(result), (key, value) =>
          typeof value === "number" && isNaN(value) ? null : value
        );
        this.schedulargetvalue = cleanedData.data[0] || null;
        this.stop_flag = this.schedulargetvalue.stop_flag
      }
      else if (result['data'].length == 0) {
        let data = result['data']
        this.schedulargetvalue = null
      }
      else {
        this.SpinnerService.hide()
        this.notification.showError(result)
      }

    }), error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }
  }

  hours = Array.from({ length: 24 }, (_, i) => i);
  minutes = [0, 30];

  timeSelection = {
    start_time: { hour: '', minute: '', period: 'AM' },
    end_time: { hour: '', minute: '', period: 'AM' }
  };

  // updateTime(field: 'start_time' | 'end_time', value: string, type: 'hour' | 'minute' | 'period') {
  //   this.timeSelection[field][type] = value;

  //   const { hour, minute, period } = this.timeSelection[field];
  //   if (hour && minute !== '' && period) {
  //     const formattedTime = `${hour}:${minute.padStart(2, '0')} ${period}`;
  //     this.schedularchangeform.patchValue({ [field]: formattedTime });
  //   }
  // }


  extractPeriod(time: string): string {
    if (!time) return '';
    const hour = Number(time.split(':')[0]);
    return hour >= 12 ? 'PM' : 'AM';
  }

  formatTime(time: string): string {
    const hour = this.extractHour(time);
    const minute = this.extractMinute(time);
    return `${hour}:${minute}`;
  }
  startstop(value) {
    
    if (value == "start") {
      this.SpinnerService.show();
      let payload = {
        start : 1
      }
      this.ecfservice.schedularstartstop(value,1,payload).subscribe(results => {
        if (results?.status == 'failed') {
          this.notification.showError(results.message);
          this.SpinnerService.hide()
        }
        if (results?.status == 'Failed') {
          this.notification.showError(results.message);
        } else if (results?.status == 'success') {
          this.notification.showSuccess(results.message);
          this.SpinnerService.hide()
        } else {
          this.SpinnerService.hide()
        }
        this.SpinnerService.hide();
      }), error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      };
    }
    else if (value == "stop") {
      this.SpinnerService.show();
      let payload = {
        stop : 1,
      }
      this.ecfservice.schedularstartstop(value,1,payload).subscribe(results => {
        if (results?.status == 'Failed') {
          this.notification.showError(results.message);
          this.SpinnerService.hide()
        }
        if (results?.status == 'failed') {
          this.notification.showError(results.message);
          this.SpinnerService.hide()
        } else if (results?.status == 'success') {
          this.notification.showSuccess(results.message);
          this.SpinnerService.hide()
        } else {
          this.SpinnerService.hide()
        }
        this.SpinnerService.hide();
      }), error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      };
    }
    else {
      this.SpinnerService.hide();
    }
  }
  // Extract hour from time string (Assuming format HH:MM:SS)
  extractHour(time: string): string {
    return time.split(':')[0].padStart(2, '0');
  }

  // Extract minute from time string
  extractMinute(time: string): string {
    return time.split(':')[1].padStart(2, '0');
  }
  openSettings() {
    this.popupopen1();
    this.generateTimeSlots();
    this.generateTimeOptions();

    if (this.schedulargetvalue) {
      const data = this.schedulargetvalue;
      const interval = data.schedule_interval ? parseInt(data.schedule_interval, 10) : null;
      this.schedularchangeform.patchValue({
        start_time: data.start_time ? this.formatTime(data.start_time) : '',
        end_time: data.end_time ? this.formatTime(data.end_time) : '',

        thread_count: data.thread_count ?? null,
        process_count: data.process_count ?? null,
        schedule_interval: interval,

        remarks: data.remarks ?? '',
        status: data.status ?? 0,
        stop_flag: data.stop_flag ?? false
      });

      console.log('Patched Form Values:', this.schedularchangeform.value);
    } else {
      console.warn('schedulargetvalue is empty or undefined');
    }
  }





  schedularhistorydata: any
  ishistory: boolean = false
  has_hispagenext: boolean = false
  has_hispageprevious: boolean = false
  getcommontotalcount_history: any
  history(presentpage: number = 1) {
    this.popupopen();
    this.SpinnerService.show();
    if(presentpage == 1){
      this.pageIndex_common_schedular = 0;  
  }
    this.ecfservice.schedularhistory(1, presentpage).subscribe(results => {
      if (results?.code) {
        this.notification.showError(results.description);
      } else if (results?.data) {
        this.schedularhistorydata = results.data;
        let datapagination = results["pagination"];
        this.getcommontotalcount_history = results?.count
        this.length_schedularhistory = results?.count
        if (this.schedularhistorydata.length === 0) {
          this.ishistory = false
        }
        if (this.schedularhistorydata.length > 0) {
          this.has_hispagenext = datapagination.has_next;
          this.has_hispageprevious = datapagination.has_previous;
          this.presentpagecommon_schedular = datapagination.index;
          this.ishistory = true
        }
      } else {
        this.schedularhistorydata = [];
      }
      this.SpinnerService.hide();
    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    });
  }
  schedularvalue: any
  schedulersubmit() {
    let fill = {};
    let data = this.schedularchangeform.value;

    // Function to ensure time format is HH:MM:SS.000000
    const formatTime = (time: string) => {
      if (!time) return null;
      const [hour, minute] = time.split(':').map(Number);
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00.000000`;
    };

    // Ensure start_time is selected
    if (data.start_time) {
      fill['start_time'] = formatTime(data.start_time);
    } else {
      this.notification.showError("Please Select the Start Time");
      return false;
    }

    // Ensure end_time is selected
    if (data.end_time) {
      fill['end_time'] = formatTime(data.end_time);
    } else {
      this.notification.showError("Please Select the End Time");
      return false;
    }

    if (this.schedulargetvalue && this.schedulargetvalue.id) {
      fill['id'] = this.schedulargetvalue.id;
    }

    if (data.thread_count) {
      fill['thread_count'] = data.thread_count;
    } else {
      this.notification.showError("Please Enter Thread Count");
      return false;
    }

    if (data.process_count) {
      fill['process_count'] = data.process_count;
    } else {
      this.notification.showError("Please Enter Process Count");
      return false;
    }

    if (data.schedule_interval) {
      fill['schedule_interval'] = data.schedule_interval;
    } else {
      this.notification.showError("Please Enter Schedule Interval");
      return false;
    }

    console.log("Fill", fill);

    this.ecfservice.schedularedit(fill)
      .subscribe(result => {
        if (result?.id != undefined) {
          this.schedularvalue = result['data'];
          this.schedularget()
          this.back()
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      });
  }

  resetschedular() {
    this.schedularchangeform.patchValue({
      start_time: "00:00",
      end_time: "00:00"
    });
    this.schedularchangeform.controls['schedule_interval'].reset(""),
      this.schedularchangeform.controls['thread_count'].reset(""),
      this.schedularchangeform.controls['process_count'].reset("")
    //  this.commonSummarySearch(1)
  }

  generateTimeSlots() {
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        let formattedHour = hour.toString().padStart(2, '0');
        let formattedMinute = minute.toString().padStart(2, '0');
        this.timeSlots.push(`${formattedHour}:${formattedMinute}`);
      }
    }
  }

  getFormattedTime(hour: number, minute: number): string {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  timeData = {
    start_hour: '',
    start_minute: '',
    start_period: 'AM',
    end_hour: '',
    end_minute: '',
    end_period: 'AM'
  };
  // updateTime(field: 'start_time' | 'end_time', value: number, type: 'hour' | 'minute') {
  //   let currentTime = this.schedularchangeform.get(field)?.value || { hour: '', minute: '' };
  //   currentTime[type] = value;
  //   if (currentTime.hour !== '' && currentTime.minute !== '') {
  //     let formattedTime = `${currentTime.hour.toString().padStart(2, '0')}:${currentTime.minute.toString().padStart(2, '0')}`;
  //     this.schedularchangeform.patchValue({ [field]: formattedTime });
  //   } else {
  //     this.schedularchangeform.patchValue({ [field]: currentTime });
  //   }
  // }
  isDropdownOpen: { [key: string]: boolean } = { start_time: false, end_time: false };
  timeOptions: string[] = [];

  startTimeDisplay = "";
  endTimeDisplay = "";
  generateTimeOptions() {
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        this.timeOptions.push(formattedTime);
      }
    }
  }

  toggleDropdown(field: string) {
    if (field === 'start_time') {
      this.startTimeDisplay = this.startTimeDisplay || '';
    } else if (field === 'end_time') {
      this.endTimeDisplay = this.endTimeDisplay || '';
    }
  }

  closeDropdown(field: string) {
    this.isDropdownOpen[field] = false;
  }


  selectTime(field: string, time: string) {
    if (field === 'start_time') {
      this.schedularchangeform.patchValue({ start_time: time });
    } else if (field === 'end_time') {
      this.schedularchangeform.patchValue({ end_time: time });
    }
  }

  @ViewChild('auditclose') auditclose;
  back() {
    this.auditclose.nativeElement.click();
  }
  pageSize_common_schedular = 10;
  pageIndex_common_schedular = 0
  presentpagecommon_schedular = 1;
  handlehistorypage(event: PageEvent) {
    this.length_schedularhistory = event.length;
    this.pageSize_common_schedular = event.pageSize;
    this.pageIndex_common_schedular = event.pageIndex;
    this.presentpagecommon_schedular = event.pageIndex + 1;
    this.history(this.presentpagecommon_schedular)

  }

  getsuppdd() {
    let suppliername: string = "";
    this.getsuppliername(this.suplist, suppliername);
    this.selectedSupplier = "";
    fromEvent(this.suppInput.nativeElement, 'input').pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.isLoading = true),
      switchMap(() => this.ecfservice.getsuppliernamescroll(this.suplist, this.selectedSupplier, 1, 1)
        .pipe(finalize(() => this.isLoading = false))
      )
    ).subscribe((results: any[]) => {
      let datas = results["data"];
      this.supplierNameData = datas;
    });

    this.getsuppliername(this.suplist, "");
  }



  getsuppliername(id, suppliername) {
    this.ecfservice.getsuppliername(id, suppliername, 1)
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
  Releasefund(value) {
    this.SpinnerService.show()
    let fill = {
      "invoice_id": value?.id
    }
    console.log("ghfjhg", fill)
    this.ecfservice.releasefund(fill)
      .subscribe(result => {
        if (result?.code) {
          this.notification.showError(result.description)
          this.SpinnerService.hide()
        }
        if (result?.status == 'success') {
          this.notification.showSuccess(result.message)         
            setTimeout(() => {
            this.commonSummarySearch('', 1);
            this.overallreset();
             this.SpinnerService.hide()
          }, 7000);
        }
        else if (result?.status == 'failed') {
          this.notification.showError(result.message)
          // this.commonSummarySearch(1)
          this.SpinnerService.hide()
        }
        else{
         this.SpinnerService.hide() 
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      });
  }

  searchField: any
  searchValue: any

  // resetcommon() {
  //   this.dialog.closeAll();
  //   this.searchValue = '';
  //   this.searchQuery = '';
  //   this.selectedSupplier ='';
  //   Object.keys(this.selectedECFTypes).forEach(key => this.selectedECFTypes[key] = false);
  //   Object.keys(this.selectedInvoiceStatus).forEach(key => this.selectedInvoiceStatus[key] = false);
  //   this.searchData = {};
  //   this.searchValues ={};
  //   this.filtr_form.controls['supplier'].reset()
  //   this.commonSummarySearch('',1);
  // }
  closeDialog() {
    this.dialog.closeAll();
  }


  confirmSearch() {
    console.log(`Search for ${this.searchField}: ${this.searchValue}`);
    this.dialog.closeAll();
  }
  controlname: any
  searchFieldName: string = "";
  searchType: string = "";
  searchQuery: string = "";
  openSearchDialog(field: string, templateRef: TemplateRef<any>, fieldName: string, type: string) {
    this.searchField = field;
    this.searchFieldName = fieldName;
    this.searchType = type;
    this.searchValue = "";
    this.filteredECFList = this.TypeList;
    this.filteredStatusList = this.commonStatusList;

    this.dialog.open(templateRef, {
      width: "800px",
      panelClass: "custom-dialog-container",
      autoFocus: false
    });
  }


  filteredSuppliers: any
  selectedSupplier: any = null;
  selectSupplier(supplier: any) {
    this.selectedSupplier = supplier;
  }
  filterSuppliers(searchText: string) {
    this.filteredSuppliers = this.supplierNameData.filter(supplier =>
      supplier.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }
  selectedECFTypes: { [key: number]: boolean } = {};
  filteredECFList: any[] = [];
  filteredECFTypes() {
    if (!this.TypeList || !Array.isArray(this.TypeList)) {
      return [];
    }

    return this.TypeList.filter(item =>
      item.text?.toLowerCase().includes(this.searchQuery?.toLowerCase() || "")
    );
  }

  updateECFList() {
    this.filteredECFList = this.TypeList.filter(item =>
      item.text.toLowerCase().includes(this.searchQueryECF.toLowerCase())
    );
  }
  filteredStatusList: any[] = []
  searchQueryStatus: string = ""
  selectedInvoiceStatus: { [key: number]: boolean } = {};
  searchQueryECF: string = "";
  updateStatusList() {
    this.filteredStatusList = this.commonStatusList.filter(item =>
      item.text.toLowerCase().includes(this.searchQueryStatus.toLowerCase())
    );
  }
  isSearchVisible: { [key: string]: boolean } = {};
  searchValues: { [key: string]: any } = {};
  
 iscr_no:boolean = false;
 isinvcr_no:boolean = false;
 isbranch:boolean = false;
 isSupplier:boolean = false;
 isRaiser:boolean = false;
 isecftype:boolean = false;
  
  toggleSearch(field: string) {
  
    this.isSearchVisible[field] = !this.isSearchVisible[field]; 
   if(field == 'crno'){
     // this.iscr_no = true;
     this.iscr_no = !this.iscr_no
     this.isinvcr_no = false;
     this.isbranch = false;
     this.isSupplier  = false;
     this.isRaiser = false;
     this.closeMenu()
   } 
   else if(field == 'invoice_crno'){
     this.isinvcr_no = !this.isinvcr_no
     this.iscr_no = false;
     // this.isinvcr_no = true;
     this.isbranch = false;
     this.isSupplier  = false;
     this.isRaiser = false;
     this.closeMenu()
    
   } 
   else if(field == 'branch'){
     this.isbranch = !this.isbranch
     this.iscr_no = false;
     this.isinvcr_no = false;
     // this.isbranch = true;
     this.isSupplier  = false;
     this.isRaiser = false;
     this.closeMenu()
    
   } 
   else if(field == 'supplier_id'){
     this.isSupplier = !this.isSupplier
     this.iscr_no = false;
     this.isinvcr_no = false;
     this.isbranch = false;
     // this.isSupplier  = true;
     this.isRaiser = false;
     this.closeMenu()
     
   } 
   else if(field == 'raiser'){
     this.isRaiser = !this.isRaiser
     this.iscr_no = false;
     this.isinvcr_no = false;
     this.isbranch = false;
     this.isSupplier  = false;
     // this.isRaiser = true;
     this.closeMenu()
    
   } 
   else{
     this.isRaiser = false; 
     this.iscr_no = false;
     this.isinvcr_no = false;
     this.isbranch = false;
     this.isSupplier  = false;
     // this.isRaiser = true;
     
    
   } 
  
  }
  
  
  
  search() {
  
    console.log('Searching for:', this.searchValue);
  
  }
  @ViewChild('ecfTypeList') ecfTypeList: MatSelectionList;
  
  resetSelection() {
    this.ecfTypeList.deselectAll(); // Clears all selections
  }
  onECFTypeSelectionChange() {
    
    this.searchValues['aptype'] = this.ecfTypeList?.selectedOptions.selected.map(option => option.value) || [];
    this.commonSummarySearch('aptype', 1);
    this.closeMenu()
  }
  selected(value){
    console.log(value)
    this.selectedSupplier = value
    this.commonSummarySearch('supplier',1)
  }
  SummaryschedulerData: any = [
    { columnname: "Business Start Hours", key: "start_time" },
    { columnname: "Business End Hours", key: "end_time" },
    { columnname: "Schedule Interval", key: "schedule_interval" },
    { columnname: "Thread Count", key: "thread_count" },
    { columnname: "Process Count", key: "process_count" },
    { columnname: "Created By", key: "created_by_name" },
    { columnname: "Created Date", key: "created_date", "type": 'Date', "datetype": "dd-MMM-yyyy" },
    { columnname: "Updated By", key: "updated_by_name" },
    { columnname: "Updated Date", key: "updated_date", "type": 'Date', "datetype": "dd-MMM-yyyy" },
    { columnname: "Status", key: "status", validate: true, validatefunction: this.schedstatus.bind(this) },
  ]
  schedstatus(sched) {
    let config: any = {
      value: '',
    };
    if (sched?.status == 0) {
      config = {
        value: "Inactive",
      }
    }
    else if (sched?.status == 1) {
      config = {
        value: "Active",
      }
    }
    return config
  }
  popupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("schedularhistory"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  popupopen1() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("schedular"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }

  selectedbranch(value){
    console.log(value)
    this.selectedSupplier = value
    this.commonSummarySearch('branch',1)
  }
  selectedraiser(value){
    console.log(value)
    this.selectedSupplier = value
    this.commonSummarySearch('raiser',1)
  }

@ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
 
 closeMenu() {
   this.menuTrigger.closeMenu();
 }

    Schedulersumfunc(){
       this.SummarySchedulerData = [
       { columnname: "CR No", key: "crno", payloadkey: "crno", "headicon": true, headertype: 'headinput',
        label: "CR No", headerdicon: "filter_list", clickFunction: this.SchedulersumSearch.bind(this), inputicon: "search",
       },
          { columnname: "Invoice CR No", key: "apinvoiceheader_crno", payloadkey: "invoiceheader_crno", "headicon": true, headertype: 'headinput',
        label: "Invoice CR No", headerdicon: "filter_list", clickFunction: this.SchedulersumSearch.bind(this), inputicon: "search",
       },
        {columnname: "ECF Type", key: "aptype",type: "object",objkey: "text",headicon: true, headerdicon: "filter_list", headertype: 'headoptiondropdown',payloadkey: "aptype",
         inputobj: {
         label: "ECF Type",
         params: "",
         searchkey: "query",
         displaykey: "text",
         Outputkey: "id",
         fronentdata: true,
         data: this.TypeList,   
         valuekey: "id",
         formcontrolname: "ecftype"
       },
       clickFunction: this.SchedulersumSearch.bind(this),
        // validate: true, validatefunction: this.shedtypeform.bind(this),function:true,
       },
          { columnname: "Raiser", key: "raiser_name","headicon": true, headerdicon: "filter_list", headertype: 'headdropdown',
         payloadkey: "raiser_name",   
         inputobj: {
         label: "Raiser",
         method: "get",
         url: this.ecfmodelurl + "usrserv/memosearchemp",
         params: "",
         searchkey: "query",
         displaykey: "full_name",
         Outputkey: "id",
         formcontrolname: "raiser_name"
       },
       clickFunction: this.SchedulersumSearch.bind(this),function:true,
        },
       { columnname: "Raiser Branch", key: "raiserbranch_branch", type: "object", objkey: "name_code", "headicon": true, headerdicon: "filter_list", headertype: 'headdropdown',
        payloadkey: "branchdetails_id",
        inputobj:{
         label: " Branch",
         method: "get",
         url: this.ecfmodelurl + "usrserv/search_branch",
         params: "",
         searchkey: "query",
         displaykey: "name",
         Outputkey: "id",
         prefix: 'code',
         separator: "hyphen",
         formcontrolname: "branchdetails_id"
       },
        clickFunction: this.SchedulersumSearch.bind(this),function:true,
        // validate: true, validatefunction: this.shedbranch_data.bind(this),
       },
        { columnname: "Supplier", key: "supplier_data",type: "object", objkey: "name_code", "headicon": true, headerdicon: "filter_list", headertype: 'headdropdown',
         payloadkey: "supplier_id",
         inputobj :{
         label: "Supplier",
         method: "get",
         url: this.ecfmodelurl + "venserv/landlordbranch_list",
         params: "",
         searchkey: "query",
         displaykey: "name",
         Outputkey: "id",
         formcontrolname: "supplier"
       },
         clickFunction: this.SchedulersumSearch.bind(this),function:true,
         validate: true, validatefunction: this.shedsupplier_data.bind(this),
       },
       {
              columnname: "Invoice Branch", key: "invoicebranch", type: "object", objkey: "name_code", "headicon": true, headertype: 'headdropdown', payloadkey: "branchdetails_id",
              inputobj: {
                label: 'Invoice Branch',
                method: 'get',
                url: this.ecfmodelurl+ '/usrserv/search_branch',
                params: '',
                searchkey: 'query',
                displaykey: 'fullname',
                formcontrolname: "invoicebranch",
                Outputkey: "id",

              }, clickFunction: this.SchedulersumSearch.bind(this),
            },
   
    
     
    { columnname: "Invoice No", key: "invoice_no" },
    { columnname: "ECF Date", key: "invoicedate", "type": 'Date', "datetype": "dd-MMM-yyyy" },
    { columnname: "Invoice Amount", key: "invoice_amount", "prefix": "₹", "type": 'Amount', style: { "display": "flex", "justify-content": "end" } },
    { columnname: "Invoice Status", key: "apinvoicehdr_status", type: "object", objkey: "text" },
    {columnname: "Action", key: "Action", "tooltip": true, icon: "arrow_forward", style: { cursor: "pointer" }, button: true,
    function: true, clickfunction: this.Releasefund.bind(this)},]
     }
 
    shedsupplier_data(data) {
    let config: any = {
      value: "",
    };
    if (data?.supplier_data?.name) {
      config.value= data?.supplier_data?.name + "-" + data?.supplier_data?.code
    } else {
      config.value="-"
    }
    return config;
  }
    shedraiser_data(data) {
    let config: any = {
      value: "",
      headercolor:""
    };
    if (this.globalpayload?.raiser_name) {
      config.headercolor= "green"
    }
     if(data?.raiser_name) {
      config.value= data?.raiser_name
    }
    return config;
  }
    shedbranch_data(data) {
    let config: any = {
      value: "",
      headercolor:""
    };
    if (this.globalpayload?.branchdetails_id) {
      config.headercolor= "green"
    }
     if(data?.invoicebranch?.name_code) {
      config.value= data?.invoicebranch?.name_code
    }
    return config;
  }
  shedtypeform(data){
     let config: any = {
      value: "",
      color:"",
      headercolor:""
    };
   if (this.globalpayload?.aptype) {
    config.headercolor = "green";
  }
  if (data?.aptype?.text) {
    config.value = data.aptype.text;
  }
    return config;
  }
    

      // resetScheduler(e){
      //    this.restSchedulerformummary =['invoiceheader_crno','invoice_no','apdate','totalamount','ap_status','apinvoicehdr_status','start_date','end_date','minamt','maxamt','ecf_date','inv_amount','crno']
      //    this.globalpayload = "";
      //    this.SummaryApiSchedulerecfObjNew = {
      //        method: "post",
      //        url: this.ecfmodelurl + "ecfapserv/apscheduler_summary",
      //        params: "",
      //        data: {},OverallCount: "Total count"
      //      }
      //  }
         SchedulersumSearch(e) {
          if(e?.value == "" || e.value == null){
            this.globalpayload = {};
          }
          else{
            this.globalpayload = e
          }
            this.SummaryApiSchedulerecfObjNew = {
             method: "post",
             url: this.ecfmodelurl + "ecfapserv/apscheduler_summary",
             params: "&submodule=" + this.sub_module_name,
             data: this.globalpayload,OverallCount: "Total count"
           }
         }
    overallreset() {
    console.log("Reset button clicked");
    if (this.summaryBoxComponent) {
      this.summaryBoxComponent.resetAllFilters();
    } else {
      setTimeout(() => {
        if (this.summaryBoxComponent) {
          this.summaryBoxComponent.resetAllFilters();
        }
      });
    }
  }
  }
 