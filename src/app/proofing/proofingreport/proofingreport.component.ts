import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ProofingService } from '../proofing.service';
import { DatePipe, formatDate ,registerLocaleData} from '@angular/common';
import { NotificationService } from '../notification.service';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { HttpErrorResponse } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
// import enIN from "@angular/common/locales/en-IN";

export interface Account{
  accno:any
}

// const Colors = ["#22fa92", "#b6a330", "#62fbb1", "#8dd55d", "#b2c072", "#24fbbe", "#50f8fc","#e4ff98","#41e740"];
const Colors = ["#faf8d4", "#e9eff5", "#f7f6f2"];
const datePickerFormat = {
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
  selector: 'app-proofingreport',
  templateUrl: './proofingreport.component.html',
  styleUrls: ['./proofingreport.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: datePickerFormat },
    DatePipe
  ],
  // encapsulation: ViewEncapsulation.None

})

export class ProofingreportComponent implements OnInit {
  proofUrl = environment.apiURL
  @ViewChild('account') accountscroll: MatAutocomplete;
  


  tablerowstyles = (color) => {
    let styles = {
      'background-color': color
    }
    return styles;
  }

  from_Date: any = null;
  to_Date: any = null;
  isLoading = false;
  has_next:boolean=false;
  finaljson: any;
  accountid: any;
  currentpage:number=1;
  AccountList = [];
  datePipe: any;
  selectedType = 1;
  currentDate: string;
  reportForm:FormGroup;
  mapfiltervalue = 'All'
  MapFilter = [{"id":"","name":'OverAll'}, {"id":1,"name":'Labelled'}, {"id":-1,"name":'Unlabelled'}];
  ReportSummary:Array<any>=[];
  PageSize:Number=10;
  has_previous:boolean=false;
  // Pagination:boolean=false;
  presentpage:number=1;
  amount=1000
  cramount=10000
  dbamount=100000
  count=1000000
  dcount=10000000
  accounttype:any
  frtodate:any
  risktype=[{id: 0, name:'High'}, {id:1, name: 'Medium'},{id:2, name:'Low'}]
  constructor(private notification: NotificationService,  private fb: FormBuilder,private datepipe:DatePipe,
    private proofingService: ProofingService,private renderer: Renderer2,private spinner:NgxSpinnerService,
    ) {
      // registerLocaleData(enIN);
      const currentDateObj = new Date();
      currentDateObj.setDate(currentDateObj.getDate() - 1); // subtract 1 day to exclude current date
      this.currentDate = currentDateObj.toISOString().split('T')[0];

      this.accounttype = {
        label: "Account Number",
        method: "get",
        url: this.proofUrl + "prfserv/accounts",
        params: "",
        searchkey: "",
        displaykey: "name",
        wholedata: true,
      };
      this.frtodate = {"fromobj":{label: "From Date"},"toobj":{label: "To Date"}}
   }

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      accountno: [''],
      fromdate: [''],
      todate: [''],
      refnos: [''],
      risktype:[''],
      Filter1:[''],
    });
    this.getAccountList();
    this.reportForm.get('accountno').valueChanges
    .pipe(
     debounceTime(100),
     distinctUntilChanged(),
     tap(() => {
       this.isLoading = true;
     }),
    //  switchMap(value => this.proofingService.getAccountList('',typeof(value)!='object'?value:'')
     switchMap(value => this.proofingService.getAccountList("", "", 1,value)
     .pipe(
       finalize(() => {
         this.isLoading = false
       }),)
     )
   )
   .subscribe((results: any[]) => {
     let datas = results['data'];
     this.AccountList = datas
     console.log("location List", this.AccountList)
   });
    this.reportsummary(1);
  }

  fromDatechange(date: string) {
    this.from_Date = date
    if (this.from_Date) {
      this.from_Date = this.datepipe.transform(this.from_Date, 'yyyy-MM-dd');
    }
    return this.from_Date;
  }

  toDatechange(date: string) {
    this.to_Date = date
    if (this.to_Date) {
      this.to_Date = this.datepipe.transform(this.to_Date, 'yyyy-MM-dd');
    }
    return this.to_Date;
  }
 

  CallByaccount(data){ 
    // this.getAccountName(data?.id) 
    
  }

  public displayFromAccnt(fromaccount?: Account): string | undefined {
   
    return fromaccount ? fromaccount.accno : undefined 
   
  }
  ClearAll(e) {
    console.log("datas=>", e)
    // this.fromdate.reset()
    // this.todate.reset()
    this.from_Date = null
    this.to_Date = null
    this.reportForm.reset('');
    this.reportsummary(1);
    // this.accountid = ''
    // this.account_type = ''
  }

  displaydownload: boolean = false
  downloadexlsearch() {
    // let body={
      // let date=this.datePipe.transform
      console.log(this.to_Date,'todate');
      console.log(this.from_Date,'fromdate');
      if(this.reportForm.get('accountno').value=='' || this.reportForm.get('accountno').value == null || this.reportForm.get('accountno').value ==undefined){
        this.notification.showError("Please Select the Account Number");
        return false;
      }
      if(this.reportForm.get('Filter1').value =='' || this.reportForm.get('Filter1').value== null || this.reportForm.get('Filter1').value == undefined){
        this.notification.showError("Please Select the Report Type");
        return false;
      }
       if (this.reportForm.get('accountno').value) {
        var body:any = this.reportForm.get('accountno').value.id;
       }
       if (this.reportForm.get('Filter1').value) {
        body += '&status=' + this.reportForm.get('Filter1').value.id;
       }
       if(this.reportForm.get('fromdate').value){
        // let fromdate=this.datePipe()
         body+='&fromdate='+(this.datepipe.transform(this.reportForm.get('fromdate').value,'yyyy-MM-dd'));
        //  body+='&from_date='+this.reportForm.get('fromdate').value
       }
       if(this.reportForm.get('todate').value){
         body+='&todate='+(this.datepipe.transform(this.reportForm.get('todate').value,'yyyy-MM-dd'));
       }
       if(this.reportForm.get('refnos').value){
         body+='&ref_no='+this.reportForm.get('refnos').value;
       }
       if(this.reportForm.get('risktype').value){
         body+='&risk_type='+this.reportForm.get('risktype').value;
       }
     
     
    // let label=this.reportForm.get('Filter1').value.id;
    // let accountid=this.reportForm.get('accountno').value.id
    // // let name = 'Proofing Map'
    // }
    this.spinner.show();
    this.proofingService.partialreportdownload(body)
    .subscribe(fullXLS=> {
      console.log(fullXLS);
      let binaryData = [];
      binaryData.push(fullXLS)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'PartialReport' +".xlsx";
      link.click();
      this.spinner.hide();
      this.notification.showSuccess("Downloaded Successfully");
    },
    (error)=>{
      this.spinner.hide();
      this.notification.showWarning(error.status+error.statusText);
    })
  }


  downloadxl(arrayname) {
    if (this.accountid == null){
      this.notification.showError('Account No Not Seleced')
      return
    }
    let payload = {
      // "account_type": this.account_type,
      "filter_type": [arrayname],
      "account_id": this.accountid,
    }
  
}

  showoverall: boolean = true;
  showlabelled: boolean = true
  showunlabelled: boolean = true;


  mapfilterchange() {
    let value = this.mapfiltervalue;
    this.showoverall = false;
    this.showlabelled = false;
    this.showunlabelled = false;
    if (value == 'All') {
      this.showoverall = true
      this.showlabelled = true;
      this.showunlabelled = true;
    }
    else if (value == 'Over All Partial Report') {
      this.showoverall = true;
    }
    else if (value == 'Labelled') {
      this.showlabelled = true;
    }
    else if (value == 'Unlabelled') {
      this.showunlabelled = true;
    }
  }
  acc_show(element) {
    let value = `${element?.name} :  ${element?.account_number}`
    return element ? value : ''
  }
  getAccountList(search = false) {
    this.isLoading = true;
    if (search) {
      this.currentpage = 1;
      this.AccountList = []
    }
    
    this.proofingService.getAccountList("", "", this.currentpage,'')
      .subscribe((results: any) => {
        this.isLoading = false;
      
        let data = results['data'];
        this.AccountList = this.AccountList.concat(data);
        // this.AccountList = data;
        if (data.length >= 0) {
          this.has_next = results.pagination.has_next;
          // this.has_previous = datapagination.has_previous;
          this.currentpage = results.pagination.index;
        }
      },error =>{
        // this.spinner.hide()
      })
  }
  open() {
    // this.accountscroll._getScrollTop.subscribe(() => {
    //   const panel = this.accountscroll.panel.nativeElement;
    //   panel.addEventListener('scroll', event => this.scrolled(event));
    // })
    this.renderer.listen(this.accountscroll.panel.nativeElement, 'scroll', () => {
      // this.renderer.setStyle(this.accountscroll.nativeElement, 'color', '#01A85A');
      let evet = this.accountscroll.panel.nativeElement
      this.scrolled(evet)
    });

  }

  scrolled(scrollelement) {
    let value = scrollelement;
    const offsetHeight = value.offsetHeight;
    const scrollHeight = value.scrollHeight;
    const scrollTop = value.scrollTop;//current scrolled distance
    const upgradelimit = scrollHeight - offsetHeight - 10;
    if (scrollTop > upgradelimit && this.has_next && !this.isLoading) {
      this.currentpage += 1;
      this.getAccountList();
    }

  }
  
 reportsummary(page=1){
  console.log(this.to_Date,'todate');
  console.log(this.from_Date,'fromdate');
  let body:any =page
  let date=this.reportForm.get('fromdate').value;
  console.log("changed date",this.datepipe.transform(date,'yyyy-MM-dd'))
  if(this.reportForm.get('accountno').value){
    body+='&account_id='+this.reportForm.get('accountno').value.id
  }
  if(this.reportForm.get('fromdate').value){
     body+='&from_date='+(this.datepipe.transform(this.reportForm.get('fromdate').value,'yyyy-MM-dd'))
  }
  if(this.reportForm.get('todate').value){
     body+='&to_date='+(this.datepipe.transform(this.reportForm.get('todate').value,'yyyy-MM-dd'))
  }
  if(this.reportForm.get('refnos').value){
     body+='&reference_no='+this.reportForm.get('refnos').value
  }
  if(this.reportForm.get('risktype').value){
     body+='&account='+this.reportForm.get('risktype').value
  }
  if(this.reportForm.get('Filter1').value){
     body+='&status='+this.reportForm.get('Filter1').value.id
  }
  
  let data=this.reportForm.get('risktype').value;
  this.spinner.show();
  this.proofingService.PartialreportSummary(body).subscribe(res=>{
    this.spinner.hide();
    if(res.code!=undefined && res.code!="" && res.code!=null){
      this.spinner.hide();
      this.notification.showError(res.code);
      this.notification.showError(res.description);
      this.ReportSummary=[];
    
    }
    else{
    let data = res['data']
    this.ReportSummary=data;
    if(this.ReportSummary.length>0){
      let pagination =res['pagination'];
      this.has_next=pagination.has_next;
      this.has_previous=pagination.has_previous;
      this.presentpage=pagination.index
    }
  }},
  (error:HttpErrorResponse)=>{
    this.ReportSummary=[];
    this.spinner.hide();
    this.notification.showWarning(error.status + error.statusText);
  }
  )
 }
 previous_page(){
   if(this.has_previous==true){
    this.presentpage-=1;
    this.reportsummary(this.presentpage);
   }
 }
 next_page(){
  if(this.has_next==true){
    this.presentpage+=1;
    this.reportsummary(this.presentpage);
   }
 }
 accountdata(accc){
  this.reportForm.patchValue({
    accountno:accc
  })
 }
 fromdatefun(frmdate){
  this.reportForm.patchValue({
    fromdate:frmdate
  })
 }
 todatefun(todate){
  this.reportForm.patchValue({
    todate:todate
  })
 }
}
