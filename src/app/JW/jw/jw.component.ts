import { Component, ComponentFactoryResolver, OnInit,ViewChild} from '@angular/core';
import { FormGroup,FormBuilder} from '@angular/forms';
import { SharedService } from '../../service/shared.service';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import {JwService} from '../jw.service'
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
  selector: 'app-jw',
  templateUrl: './jw.component.html',
  styleUrls: ['./jw.component.scss']
})
export class JwComponent implements OnInit {

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
  isjwsumpage: boolean = true;
  jvpresentpage: number = 1;
  jvpagesize = 10;

  has_apppagenext = true;
  has_apppageprevious = true;
  isjwappsumpage: boolean = true;
  jvapppresentpage: number = 1;
  jvapppagesize = 10;
  @ViewChild('closedbuttons') closedbuttons;
  @ViewChild('closeentry') closeentry;
  @ViewChild('closejvreport')closejvreport;
  filedatas:any
  tranrecords:any
  entrylist:any
  entpage = 0;
  entpagenext = 10;



  constructor(private sharedService: SharedService,private fb:FormBuilder,private datePipe: DatePipe,
    private jvservice:JwService,private shareservice:ShareService,
    private notification:NotificationService,private errorHandler:ExceptionHandlingService,private spinnerservice:NgxSpinnerService) { }

  ngOnInit(): void {

    let datas = this.sharedService?.menuUrlData;

    datas?.forEach((element) => {
      let subModule = element?.submodule;
      if (element?.name === "JW") {
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


  }

  getjournaltype(){
    this.jvservice.getjournaltype()
    .subscribe(result =>{
      if(result){
      let TypeList = result['data']
      this.TypeList = TypeList.filter(x=>x.id != 4)
      
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
    
    this.jvsummary = "/jwcreate"
    this.jvpprovalsummary = "/jwapproval"

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
      this.jvapproversearch('')
    }
  }

  downloadjw(data){
  this.jvsummarysearch(data)
  }
  jwtotalcount:any
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
      // fill['jeamount']=  Number(String(data?.jeamount).replace(/,/g, ''))
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
              this.jvservice.jwsummarySearch(download,fill,pageNumber)
    .subscribe(res =>{
      this.spinnerservice.hide()
        let binaryData = [];
          binaryData.push(res)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = "JW Report.xlsx";
          link.click();
    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })
      }
      this.jvservice.jwsummarySearch('',fill,pageNumber)
      .subscribe(result=>{
       
        this.spinnerservice.hide()
        this.jvList = result['data']
        let datapagination = result["pagination"];
      
        if (this.jvList?.length === 0) {
          this.isjwsumpage = false
          this.length_jwsum = 0
        }
        if (this.jvList?.length > 0) {
          this.presentpagejwsum = datapagination?.index;
          this.isjwsumpage = true
          this.length_jwsum =  result["pagination"]["count"]
          
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide()
      })
    // let data = this.jvSearchForm?.value
    // let branchid:any
    // let raiserid:any
    // if(data.branch != ""){
    //   branchid = data?.branch?.id
    // }else{
    //   branchid = ""
    // }
    // if(data.created_by != ""){
    //   raiserid = data?.created_by?.id
    // }else{
    //   raiserid = ""
    // }
    // this.spinnerservice.show()
    // this.jvservice.jvsummarySearch(data?.crno,data?.status,data?.amount,data?.refno,data?.type,branchid,raiserid)
    // .subscribe(res =>{
    //  if(res['data'] != undefined){
    //   this.jvList = res['data']
    //   this.spinnerservice.hide()
    //  }else{
    //    this.notification.showError(res?.description)
    //    this.spinnerservice.hide()
    //    return false
    //  }
    // },(error) => {
    //   this.errorHandler.handleError(error);
    //   this.spinnerservice.hide()
    // })
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
        link.download = 'JW Maker Report.xlsx';
        link.click();
        this.jvreportback();
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
  jvreportback(){
    this.resetForm()
    this.closejvreport.nativeElement.click()
  }
  approvaldownloadjw(data){
    this.jvapproversearch(data)
  }
  jwapptotalcount:any
  jvapproversearch(download,pageNumber=1){
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
    if(download === true){
    this.jvservice.jwappsummarySearch(download,appfill,pageNumber)
    .subscribe(res =>{
      this.spinnerservice.hide()
        let binaryData = [];
          binaryData.push(res)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = "JW Approval Report.xlsx";
          link.click();
    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })
    }
    this.spinnerservice.show()
    this.jvservice.jwappsummarySearch('',appfill,pageNumber)
    .subscribe(result=>{
     
      this.spinnerservice.hide()
      this.jvappList = result['data']
      let datapagination = result["pagination"];
     
        if (this.jvappList?.length === 0) {
          this.isjwappsumpage = false
          this.length_jwappsum = 0
        }
        if (this.jvappList?.length > 0) {
          this.jvapppresentpage = datapagination?.index;
          this.isjwappsumpage = true
          this.length_jwappsum =  result["pagination"]["count"]
        }
    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })

    // let data = this.jvapprovalSearchForm?.value
    // let appbranchid:any
    // let appraiserid:any
    // if(data.branch != ""){
    //   appbranchid = data?.branch?.id
    // }else{
    //   appbranchid = ""
    // }
    // if(data.created_by != ""){
    //   appraiserid = data?.created_by?.id
    // }else{
    //   appraiserid = ""
    // }
    // this.spinnerservice.show()
    // this.jvservice.jvsummarySearch(data?.crno,data?.status,data?.amount,data?.refno,data?.type,appbranchid,appraiserid)
    // .subscribe(res =>{
    //  if(res['data'] != undefined){
    //   this.jvappList = res['data']
    //   this.spinnerservice.hide()
    //  }else{
    //    this.notification.showError(res?.description)
    //    this.spinnerservice.hide()
    //    return false
    //  }

    // },(error) => {
    //   this.errorHandler.handleError(error);
    //   this.spinnerservice.hide()
    // })

  }
  clearjvapprover(){
    this.jvapprovalSearchForm.controls['jecrno'].reset(""),
    this.jvapprovalSearchForm.controls['jetype'].reset(""),
    this.jvapprovalSearchForm.controls['jerefno'].reset(""),
    this.jvapprovalSearchForm.controls['jebranch'].reset(""),
    this.jvapprovalSearchForm.controls['created_by'].reset(""),
    this.jvapprovalSearchForm.controls['jeamount'].reset(""),
    this.jvapprovalSearchForm.controls['jestatus'].reset(""),
    this.jvapproversearch('') 
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

length_jwsum = 0;
pageIndexjwsum = 0;
pageSizeOptions = [5, 10, 25];
pageSize_jwsum=10;
presentpagejwsum: number = 1;
showFirstLastButtons:boolean=true;
handlePageEventjwsum(event: PageEvent) {
    this.length_jwsum = event.length;
    this.pageSize_jwsum = event.pageSize;
    this.pageIndexjwsum = event.pageIndex;
    this.presentpagejwsum=event.pageIndex+1;
    this.jvsummarysearch(this.presentpagejwsum);
    
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
          this.isjwsumpage = false
          this.length_jwsum = 0;
        }
        if (this.jvList?.length > 0) {
          this.presentpagejwsum = datapagination?.index;
          this.isjwsumpage = true
          this.length_jwsum =  datapagination?.count;
          
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
          this.length_jwappsum = 0;
          this.isjwappsumpage = false
        }
        if (this.jvappList?.length > 0) {
          this.presentpagejwappsum = datapagination?.index;
          this.isjwappsumpage = true
          this.length_jwappsum =  datapagination?.count;
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

length_jwappsum = 0;
pageIndexjwappsum = 0;
pageSize_jwappsum=10;
presentpagejwappsum: number = 1;
handlePageEventjwappsum(event: PageEvent) {
    this.length_jwappsum = event.length;
    this.pageSize_jwappsum = event.pageSize;
    this.pageIndexjwappsum = event.pageIndex;
    this.presentpagejwappsum=event.pageIndex+1;
    this.jvapproversearch(this.presentpagejwappsum);
    
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

  jvapprovesubmit(){

    this.jvcreateForm = false
    this.jvsummaryForm = false
    this.jvapprovalsummaryForm = true
    this.jvuploadForm = false
    this.showjvapproverview = false
    this.showjvsummaryview  = false
    this.jvapproversearch('')

  }

  jvapprovecancel(){

    this.jvcreateForm = false
    this.jvsummaryForm = false
    this.jvapprovalsummaryForm = true
    this.jvuploadForm = false
    this.showjvapproverview = false
    this.showjvsummaryview  = false
    this.jvapproversearch('')


  }

  jvsummarysubmit(){

    this.jvcreateForm = false
    this.jvsummaryForm = true
    this.jvapprovalsummaryForm = false
    this.jvuploadForm = false
    this.showjvapproverview = false
    this.showjvsummaryview  = false
    this.jvsummarysearch('')

  }

  jvsummarycancel(){

    this.jvcreateForm = false
    this.jvsummaryForm = true
    this.jvapprovalsummaryForm = false
    this.jvuploadForm = false
    this.showjvapproverview = false
    this.showjvsummaryview  = false
    this.jvsummarysearch('')


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
      this.jvsummarysearch('')
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

  getjvcrno(data,pageno =1){

    // let crno = data?.jecrno
    let crno = data
    this.jvcrno = data
    this.spinnerservice.show()
    let page = 1
    this.spinnerservice.show()
    this.jvservice.getentrydetail(crno,pageno)
    .subscribe(result=>{
      if(result){
      this.spinnerservice.hide()
      this.entrylist = result['data']
       let datapagination = result['pagination']
      this.totalentrycount = this.entrylist?.length;
      if(this.totalentrycount == 0){
        this.notification.showError('No Data Available')
        this.closeentry.nativeElement.click()
        this.isenrtrypage = false;
        return false
      }
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
      }
    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })

  }

  entryback(){
     this.closeentry.nativeElement.click()
    this.pageIndexjwsum = 0;
    this.pageSize_jwsum = 10;
  }

   numberOnlyandDot(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  isenrtrypage:any
  presententrysum=1
  length_jventrysum =0;
 handleentryPageEvent(event: PageEvent) {
    this.length_jventrysum = event.length;
    this.pageSize_jwsum = event.pageSize;
    this.pageIndexjwsum = event.pageIndex;
    this.presententrysum=event.pageIndex+1;
    this.getjvcrno(this.jvcrno,this.presententrysum);    
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
  
}