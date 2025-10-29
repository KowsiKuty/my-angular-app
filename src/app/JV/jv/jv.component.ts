import { Component, ComponentFactoryResolver, OnInit,ViewChild} from '@angular/core';
import { FormGroup,FormBuilder} from '@angular/forms';
import { SharedService } from '../../service/shared.service';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe, CurrencyPipe } from '@angular/common';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import {JvService} from '../jv.service'
import {ShareService} from '../share.service'
import { NotificationService } from '../notification.service';
import {ExceptionHandlingService} from '../exception-handling.service';
import { NgxSpinnerService } from "ngx-spinner";
import {PageEvent} from '@angular/material/paginator'



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
  selector: 'app-jv',
  templateUrl: './jv.component.html',
  styleUrls: ['./jv.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,CurrencyPipe
  ]
})
export class JVComponent implements OnInit {
  JV_Sub_Menu_List: any;
  sub_module_url:any;
  jvsummary:any;
  jvpprovalsummary:any;
  jvsummaryPath:any;
  jvapprovalPath:any;
  jvreportForm: FormGroup
  toDateFilter: (d: Date | null) => boolean;
  jvSearchForm:FormGroup
  jvapprovalSearchForm:FormGroup
  TypeList:any
  StatusList:any
  jvsummaryForm:boolean
  jvcreateForm:boolean
  jvapprovalsummaryForm:boolean
  jvuploadForm:boolean
  showjvapproverview:boolean
  showjvsummaryview:boolean
  

  @ViewChild('branchtype') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild('raisertyperole') matraiserAutocomplete: MatAutocomplete;
  @ViewChild('raiserapptyperole') matappraiserAutocomplete: MatAutocomplete;
  @ViewChild('raiserInput') raiserInput: any;
  @ViewChild('raiserappInput') raiserappInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  Raiserlist:any
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;

  Branchlist: Array<branchListss>;
  jvList:any
  jvappList:any

  has_pagenext = true;
  has_pageprevious = true;
  issummarypage: boolean = true;
  jvpresentpage: number = 1;
  jvpagesize = 10;

  has_apppagenext = true;
  has_apppageprevious = true;
  isapprovepage: boolean = true;
  jvapppresentpage: number = 1;
  jvapppagesize = 10;
  @ViewChild('closedbuttons') closedbuttons;
  @ViewChild('closeentry') closeentry;
  @ViewChild('closejvreport') closejvreport;
  filedatas:any
  tranrecords:any
  entrylist:any
  entpage = 0;
  entpagenext = 10;



  constructor(private sharedService: SharedService,private fb:FormBuilder,private datePipe: DatePipe,
    private jvservice:JvService,private shareservice:ShareService,
    private notification:NotificationService,private errorHandler:ExceptionHandlingService,private spinnerservice:NgxSpinnerService,
    private currencyPipe: CurrencyPipe) { }

  ngOnInit(): void {

    let datas = this.sharedService?.menuUrlData;

    datas?.forEach((element) => {
      let subModule = element?.submodule;
      if (element?.name === "JV") {
        this.JV_Sub_Menu_List = subModule;
      
      }
    });

    this.jvSearchForm = this.fb.group({

      jecrno:[''],
      jetype:[''],
      jerefno:[''],
      jebranch:[''],
      jeamount:[''],
      jestatus:[''],
      created_by:['']
    })

    this.jvreportForm = this.fb.group({
      from_date:[''],
      to_date:['']
    })

    this.jvapprovalSearchForm = this.fb.group({


      jecrno:[''],
      jetype:[''],
      jerefno:[''],
      jebranch:[''],
      jeamount:[''],
      jestatus:[''],
      created_by:['']
      

      

    })

    // this.getjvSummaryList()
    // this.getjvappSummaryList()
    this.getjournaltype()
    this.getjournalstatus()

    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.jvSearchForm.get('jebranch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')

        }),

        switchMap(value => this.jvservice.getbranchscroll(value, 1)
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


      this.jvapprovalSearchForm.get('jebranch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')

        }),

        switchMap(value => this.jvservice.getbranchscroll(value, 1)
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

    this.toDateFilter = () => true;

  }

  getjournaltype(){
    this.jvservice.getjournaltype()
    .subscribe(result =>{
      if(result){
      let TypeList = result['data']
      this.TypeList = TypeList.filter(x=>x?.id != 4)
      
      }
    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })
  }

  getjournalstatus(){
    this.jvservice.getjournalstatus()
    .subscribe(result =>{
      if(result){
      let StatusList = result['data']
      this.StatusList = StatusList.filter(x=>x?.id != 4)
      }
    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })
  }

  getbranchdropdown(){
    this.branchdropdown('');
  }

  public displayFnbranchrole(branchtyperole?: branchListss): string | undefined {

    return branchtyperole ? branchtyperole.code + "-" + branchtyperole.name : undefined;

  }

  get branchtyperole() {
    return this.jvSearchForm.get('jebranch');
  }
  

  public displayFnbranch(branchtype?: branchListss): string | undefined {

    return branchtype ? branchtype.code + "-" + branchtype.name : undefined;

  }

  get branchtype() {
    return this.jvapprovalSearchForm.get('created_by');
  }

  branchdropdown(branchkeyvalue) {
    this.jvservice.getbranch(branchkeyvalue)
      .subscribe((results: any[]) => {
        if(results){
        let datas = results["data"];
        this.Branchlist = datas;
        }

      },(error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide()
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
                this.jvservice.getbranchscroll(this.branchInput.nativeElement.value, this.currentpage + 1)
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

  getraiserdropdown() {
    // this.getrm('');

    let rmkeyvalue: String = "";
    this.getrm(rmkeyvalue);
    this.jvSearchForm.get('created_by').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.jvservice.getrmscroll(value, 1)
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

  getraiserappdropdown(){

    let rmkeyvalue: String = "";
    this.getrm(rmkeyvalue);
    this.jvapprovalSearchForm.get('created_by').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.jvservice.getrmscroll(value, 1)
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


  public displayFnraiserrole(raisertyperole?: raiserlists): string | undefined {
    return raisertyperole ? raisertyperole.full_name : undefined;
  }

  get raisertyperole() {
    return this.jvSearchForm.get('created_by');
  }
  public displayFnappraiserrole(raiserapptyperole?: raiserlists): string | undefined {
    return raiserapptyperole ? raiserapptyperole.full_name : undefined;
  }

  get raiserapptyperole() {
    return this.jvapprovalSearchForm.get('created_by');
  }

  getrm(rmkeyvalue) {
    this.jvservice.getrmcode(rmkeyvalue)
      .subscribe(results => {
        if(results){
        let datas = results["data"];
        this.Raiserlist = datas;
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide()
      })
  }

  raiserScroll() {
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
                this.jvservice.getrmscroll(this.raiserInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Raiserlist.length >= 0) {
                      this.Raiserlist = this.Raiserlist.concat(datas);
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

  raiserappScroll() {
    setTimeout(() => {
      if (
        this.matappraiserAutocomplete &&
        this.matappraiserAutocomplete &&
        this.matappraiserAutocomplete.panel
      ) {
        fromEvent(this.matappraiserAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matappraiserAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matappraiserAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matappraiserAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matappraiserAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.jvservice.getrmscroll(this.raiserappInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Raiserlist.length >= 0) {
                      this.Raiserlist = this.Raiserlist.concat(datas);
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








  JVSubModule(data){
    this.sub_module_url = data.url;
    
    this.jvsummary = "/jvcreate"
    this.jvpprovalsummary = "/jvapproval"

    this.jvsummaryPath = this.jvsummary === this.sub_module_url ? true : false;
    this.jvapprovalPath = this.jvpprovalsummary === this.sub_module_url ? true : false;

    if(this.jvsummaryPath){
      this.jvsummaryForm = true
      this.jvcreateForm = false
      this.jvapprovalsummaryForm = false
      this.jvuploadForm = false
      this.showjvapproverview = false
      this.showjvsummaryview = false
      this.jvsummarysearch('')
      
    }

    if(this.jvapprovalPath){
      this.jvsummaryForm = false
      this.jvcreateForm = false
      this.jvapprovalsummaryForm = true
      this.jvuploadForm = false
      this.showjvapproverview = false
      this.showjvsummaryview  = false
      this.searchjvapprover('')
    }
  }

  jvtotalcount:any
  jvsummarysearch(download,pageNumber=1){

    let data = this.jvSearchForm?.value
    let fill:any={};
    if(data?.jecrno != null && data?.jecrno != "" && data?.jecrno != undefined){
      fill['jecrno']=data?.jecrno
    }
    if(data?.jerefno != null && data?.jerefno != "" && data?.jerefno != undefined){
      fill['jerefno']= data?.jerefno
    }
    if(data?.jetype != null && data?.jetype != "" && data?.jetype != undefined){
      fill['jetype']= data?.jetype
    }
    if(data?.jestatus != null && data?.jestatus != "" && data?.jestatus != undefined){
      fill['jestatus']= data?.jestatus
    }
    if(data?.jeamount != null && data?.jeamount != "" && data?.jeamount != undefined){
      // const formattedValue =Number(String(data?.jeamount).replace(/,/g, ''))
      // const formattedValue = this.currencyPipe.transform(data?.jeamount, '', 'symbol', '1.0-0');
      //  console.log(formattedValue);
      // fill['jeamount']=  Number(String(formattedValue).replace(/,/g, ''))
      // fill['jeamount']= this.currencyPipe.transform(formattedValue, '', 'symbol', '1.0-0');
      const amountString = String(data?.jeamount).replace(/[\₹,]/g, '');
      const amountNumber = Number(amountString);
      fill['jeamount']= amountNumber
    }
    
    if(data.jebranch != "" && data.jebranch != "" && data.jebranch != ""){
      if(typeof(data.jebranch) == 'object'){
      fill['jebranch'] = data?.jebranch?.id
      }
    }
    if(data.created_by != "" && data.created_by != "" && data.created_by != ""){
      if(typeof(data.created_by) == 'object'){
      fill['created_by'] = data?.created_by?.id
      }
    }
    this.spinnerservice.show()
    if(download === true){
      this.jvservice.jvsummarySearch(download,fill,pageNumber)
    .subscribe(res =>{
      this.spinnerservice.hide()
        let binaryData = [];
          binaryData.push(res)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = "JV Maker Report.xlsx";
          link.click();
    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })
      }
    this.jvservice.jvsummarySearch('',fill,pageNumber)
    .subscribe(res =>{
      this.spinnerservice.hide()
     if(res['data'] != undefined){
      this.jvList = res['data']
      let datapagination = res["pagination"];
      
      if (this.jvList?.length === 0) {
        this.issummarypage = false
        this.length_jvsum = 0
      }
      if (this.jvList?.length > 0) {
        this.presentjvsum = datapagination?.index;
        this.issummarypage = true
        this.length_jvsum = datapagination?.count
        
      }
     }else{
       this.notification.showError(res?.description)
       return false
     }
    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })
  }

   onFromDateChange(event: any) {
    const fromDate = event.value;

    // Clear to_date when from_date changes
    this.jvreportForm.patchValue({ to_date: '' });

    // Disable all dates before from_date in To Date picker
    this.toDateFilter = (d: Date | null): boolean => {
      if (!fromDate) return true;
      return d ? d >= new Date(fromDate) : false;
    };
  }

  reportjvpopup() {
    const data = this.jvreportForm.value;
    const fill: any = {};

    if (data.from_date) fill['from_date'] = data.from_date = this.datePipe.transform(data.from_date, 'yyyy-MM-dd');
    if (data.to_date) fill['to_date'] = data.to_date = this.datePipe.transform(data.to_date, 'yyyy-MM-dd');

    this.spinnerservice.show();

    this.jvservice.getreportjvdata(fill).subscribe(
      (res) => {
        this.spinnerservice.hide();
        const binaryData = [res];
        const downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'JV Maker Report.xlsx';
        link.click();
        this.jvreportback()
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide();
      }
    );
  }

  resetForm() {
    this.jvreportForm.reset();
  }
  nextClickjv() {
    if (this.has_pagenext === true) {
      this.jvsummarysearch(this.jvpresentpage + 1)
    }
  }

  previousClickjv() {
    if (this.has_pageprevious === true) {
      this.jvsummarysearch(this.jvpresentpage - 1)
    }
  }


  jvreset(){
    this.jvSearchForm.controls['jecrno'].reset(""),
    this.jvSearchForm.controls['jetype'].reset(""),
    this.jvSearchForm.controls['jerefno'].reset(""),
    this.jvSearchForm.controls['jebranch'].reset(""),
    this.jvSearchForm.controls['created_by'].reset(""),
    this.jvSearchForm.controls['jeamount'].reset(""),
    this.jvSearchForm.controls['jestatus'].reset(""),
    this.jvsummarysearch(1)

  }
  jvapptotalcount:any
  searchjvapprover(download,pagenumber = 1){

    let data = this.jvapprovalSearchForm?.value
    let appfill:any={};
    if(data?.jecrno != null && data?.jecrno != "" && data?.jecrno != undefined){
      appfill['jecrno']=data?.jecrno
    }
    if(data?.jerefno != null && data?.jerefno != "" && data?.jerefno != undefined){
      appfill['jerefno']= data?.jerefno
    }
    if(data?.jetype != null && data?.jetype != "" && data?.jetype != undefined){
      appfill['jetype']= data?.jetype
    }
    if(data?.jestatus != null && data?.jestatus != "" && data?.jestatus != undefined){
      appfill['jestatus']= data?.jestatus
    }
    if(data?.jeamount != null && data?.jeamount != "" && data?.jeamount != undefined){
      // appfill['jeamount']=  Number(String(data?.jeamount).replace(/,/g, ''))
      const amountString = String(data?.jeamount).replace(/[\₹,]/g, '');
      const amountNumber = Number(amountString);
      appfill['jeamount']= amountNumber
    }
    
    if(data.jebranch != "" && data.jebranch != "" && data.jebranch != ""){
      if(typeof(data.jebranch) == 'object'){
        appfill['jebranch'] = data?.jebranch?.id
      }
    }
    if(data.created_by != "" && data.created_by != "" && data.created_by != ""){
      if(typeof(data.created_by) == 'object'){
        appfill['created_by'] = data?.created_by?.id
      }
    }
    this.spinnerservice.show()
    if(download === true){
      this.jvservice.jvapprovalsummarySearch(download,appfill,pagenumber)
    .subscribe(res =>{
      this.spinnerservice.hide()
        let binaryData = [];
          binaryData.push(res)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = "JV Approval Report.xlsx";
          link.click();
    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })
      }
    this.jvservice.jvapprovalsummarySearch('',appfill,pagenumber)
    .subscribe(res =>{
      this.spinnerservice.hide()
     if(res['data'] != undefined){
      this.jvappList = res['data']
      let datapagination = res["pagination"];
      
      if (this.jvappList?.length === 0) {
        this.isapprovepage = false
        this.jvapptotalcount = 0
        this.length_jvsappum = 0

      }
      if (this.jvappList?.length > 0) {
        this.presentjvappsum = datapagination?.index; 
        this.isapprovepage = true
        this.length_jvsappum = datapagination?.count
      }
      
     }else{
       this.notification.showError(res?.description)
       return false
     }

    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })

  }

  clearjvapprover(){
    this.jvapprovalSearchForm.controls['jecrno'].reset(""),
    this.jvapprovalSearchForm.controls['jetype'].reset(""),
    this.jvapprovalSearchForm.controls['jerefno'].reset(""),
    this.jvapprovalSearchForm.controls['jebranch'].reset(""),
    this.jvapprovalSearchForm.controls['created_by'].reset(""),
    this.jvapprovalSearchForm.controls['jeamount'].reset(""),
    this.jvapprovalSearchForm.controls['jestatus'].reset(""),
    this.searchjvapprover(1) 
  }


  createjv(){
    this.jvcreateForm = true
    this.jvsummaryForm = false
    this.jvapprovalsummaryForm = false
    this.jvuploadForm = false
    this.showjvapproverview = false
    this.showjvsummaryview  = false


  }

  uploadjv(){
    this.jvcreateForm = false
    this.jvsummaryForm = false
    this.jvapprovalsummaryForm = false
    this.jvuploadForm = true
    this.showjvapproverview = false
    this.showjvsummaryview  = false
  }
approvaldownloadjv(data){
  this.searchjvapprover(data)
}
downloadjv(data){
  this.jvsummarysearch(data)
}
reportdownloadjv(data){
  this.jvsummarysearch(data)
}
  jvcreatesubmit(){
    this.jvcreateForm = false
    this.jvsummaryForm = true
    this.jvapprovalsummaryForm = false
    this.jvuploadForm = false
    this.showjvapproverview = false
    this.showjvsummaryview  = false
    this.jvsummarysearch('')
  }

  jvcreatecancel(){
    this.jvcreateForm = false
    this.jvsummaryForm = true
    this.jvapprovalsummaryForm = false
    this.jvuploadForm = false
    this.showjvapproverview = false
    this.showjvsummaryview  = false
    this.jvsummarysearch('')
    

  }


  getjvSummaryList(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
    this.spinnerservice.show()
    this.jvservice.getjournalsummary(filter, sortOrder, pageNumber, pageSize)
      .subscribe(results => {
        if(results["data"] != undefined){
        let datas = results["data"];
        this.jvList = datas;
        let datapagination = results["pagination"];
        if (this.jvList?.length === 0) {
          this.issummarypage = false
          this.length_jvsum =0
        }
        if (this.jvList?.length > 0) {
          this.presentjvsum = datapagination?.index;
          this.length_jvsum = datapagination?.count;

          this.issummarypage = true
          
        }
        this.spinnerservice.hide()
      }else{
        this.notification.showError(results?.description)
        this.spinnerservice.hide()
        return false
      }
      },(error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide()
      })
  }

  presentjvsum: number = 1;
 
  length_jvsum = 0;
  length_jventrysum =0;
  pageIndexjvsum = 0;
  pageSizeOptions = [5, 10, 25];
  pageSize_jvsum=10;
  showFirstLastButtons:boolean=true;
  handlePageEvent(event: PageEvent) {
    this.length_jvsum = event.length;
    this.pageSize_jvsum = event.pageSize;
    this.pageIndexjvsum = event.pageIndex;
    this.presentjvsum=event.pageIndex+1;
    this.jvsummarysearch(this.presentjvsum);
    
  }

  getjvappSummaryList(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
    this.spinnerservice.show()
    this.jvservice.getjournalappsummary(filter, sortOrder, pageNumber, pageSize)  
      .subscribe(results => {
       if(results["data"] != undefined){
        let datas = results["data"];
        this.jvappList = datas;
        let datapagination = results["pagination"];
        if (this.jvappList?.length === 0) {
          this.isapprovepage = false
          this.length_jvsappum = 0
        }
        if (this.jvappList?.length > 0) {
          this.presentjvappsum = datapagination?.index; 
          this.length_jvsappum = datapagination?.count
          this.isapprovepage = true
        }
        this.spinnerservice.hide()
      }else{
        this.notification.showError(results?.description)
        this.spinnerservice.hide()
        return false
      }
      },(error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide()
      })
  }

  presentjvappsum: number = 1;
 
  length_jvsappum = 0;
  pageIndexjvappsum = 0;
  pageSize_jvappsum=10;
  handlePageEventApprove(event: PageEvent) {
    this.length_jvsappum = event.length;
    this.pageSize_jvappsum = event.pageSize;
    this.pageIndexjvappsum = event.pageIndex;
    this.presentjvappsum=event.pageIndex+1;
    this.searchjvapprover(this.presentjvappsum);
    
  }

  showjvview(list){
    this.shareservice.jvlist.next(list.id)
    this.shareservice.jvfulllist.next(list)
    this.jvcreateForm = false
    this.jvsummaryForm = false
    this.jvapprovalsummaryForm = false
    this.jvuploadForm = false
    this.showjvapproverview = true
    this.showjvsummaryview  = false

    
  }

  showjvsummaryviews(data){
    this.shareservice.jvlist.next(data.id)
    this.jvcreateForm = false
    this.jvsummaryForm = false
    this.jvapprovalsummaryForm = false
    this.jvuploadForm = false
    this.showjvapproverview = false
    this.showjvsummaryview  = true
  }

   showjvsummaryedit(data){
    this.shareservice.jvlist.next(data.id)
    this.shareservice.jvstatus.next("returned")
    this.jvcreateForm = true
    this.jvsummaryForm = false
    this.jvapprovalsummaryForm = false
    this.jvuploadForm = false
    this.showjvapproverview = false
    this.showjvsummaryview  = false
  }

  jvapprovesubmit(){

    this.jvcreateForm = false
    this.jvsummaryForm = false
    this.jvapprovalsummaryForm = true
    this.jvuploadForm = false
    this.showjvapproverview = false
    this.showjvsummaryview  = false
    this.searchjvapprover('')

  }

  jvapprovecancel(){

    this.jvcreateForm = false
    this.jvsummaryForm = false
    this.jvapprovalsummaryForm = true
    this.jvuploadForm = false
    this.showjvapproverview = false
    this.showjvsummaryview  = false
    this.searchjvapprover('')


  }

  jvsummarysubmit(){

    this.jvcreateForm = false
    this.jvsummaryForm = true
    this.jvapprovalsummaryForm = false
    this.jvuploadForm = false
    this.showjvapproverview = false
    this.showjvsummaryview  = false
    this.getjvSummaryList('')

  }

  jvsummarycancel(){

    this.jvcreateForm = false
    this.jvsummaryForm = true
    this.jvapprovalsummaryForm = false
    this.jvuploadForm = false
    this.showjvapproverview = false
    this.showjvsummaryview  = false
    this.getjvSummaryList('')


  }

  delete(id){
    
    var answer = window.confirm("Are you sure to delete?");
    if (answer) {
      //some code
    }
    else {
      return false;
    }
    this.spinnerservice.show()
    this.jvservice.jvheaderdelete(id)
    .subscribe(result =>{
     
      if(result.status == "success"){
      this.notification.showSuccess("Deleted Successfully")
      this.getjvSummaryList('')
      this.spinnerservice.hide()
      }else{
        this.notification.showError(result.description)
        this.spinnerservice.hide()
        return false;
      }
    })
  }

  fileback(){
    this.closedbuttons.nativeElement.click();
  }
  jvcrno:any
  ofdate:any
  transactiondate:any
  debitsum:any
  creditsum:any
  totalentrycount:any
  isenrtrypage:any
  presententrysum=1

  getjvcrno(data,pageno =1){

    // let crno = data?.jecrno
    let crno = data
    this.jvcrno = data
    this.spinnerservice.show()
    let page = 1
    this.jvservice.getentrydetail(crno,pageno)
    .subscribe(result=>{
      if(result){
      this.entrylist = result['data']
      this.totalentrycount = this.entrylist?.length;
      let datapagination = result['pagination']
      if(this.totalentrycount== 0)
      {
        this.spinnerservice.hide()
        this.isenrtrypage = false;
        this.notification.showError("The data is Empty...")
        return false;
      }
      else{
      this.isenrtrypage = true;
      this.length_jventrysum = result?.count
      this.presententrysum = datapagination?.index;
      let debitdata = this.entrylist?.filter(x=>x.type == 'DEBIT')
      let debitamt = debitdata?.map(y=>Number(y.amount))
      this.debitsum = debitamt?.reduce((a, b) => a + b)
      let creditdata = this.entrylist?.filter(i=>i.type == 'CREDIT')
      let creditamt = creditdata?.map(j=>Number(j.amount))
      this.creditsum = creditamt?.reduce((a, b) => a + b)
      this.ofdate = this.entrylist[0]?.cbsdate
      this.transactiondate = this.entrylist[0]?.transactiondate
      this.spinnerservice.hide()
      }
    }
    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })

  }

  entryback(){
     this.closeentry.nativeElement.click()
    this.pageIndexjvsum = 0;
    this.pageSize_jvsum = 10;
  }

  jvreportback(){
    this.resetForm()
    this.closejvreport.nativeElement.click()
  }
   numberOnlyandDot(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

 handleentryPageEvent(event: PageEvent) {
    this.length_jventrysum = event.length;
    this.pageSize_jvsum = event.pageSize;
    this.pageIndexjvsum = event.pageIndex;
    this.presententrysum=event.pageIndex+1;
    this.getjvcrno(this.jvcrno,this.presententrysum);    
  }
  
}
