import { DatePipe, formatDate } from '@angular/common';
import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ErrorhandlingService } from '../errorhandling.service';
import { PprService } from '../ppr.service';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Console } from 'console';
export interface aws{
  name:string,
  id:number,
  code:string
}
export interface sectorList {
  id: number
  name: string
}
export interface businessList {
  id: number
  name: string
}
export interface finyearList{
  finyer:string;
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
      // Adjust the formatting for the financial year starting in April
      const financialYearStartMonth = 4; // April
      const year = date.getMonth() < financialYearStartMonth ? date.getFullYear() - 1 : date.getFullYear();
      const month = date.getMonth() < financialYearStartMonth ? date.getMonth() + 12 : date.getMonth();
      return formatDate(new Date(year, month, date.getDate()), 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
@Component({
  selector: 'app-aws-file',
  templateUrl: './aws-file.component.html',
  styleUrls: ['./aws-file.component.scss'], 
  providers: [{ provide: DateAdapter, useClass:PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS ,},
      DatePipe],

})
export class AwsFileComponent implements OnInit {
  
  downloadTypeControl = new FormControl();
  @ViewChild('closepops')closepops
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
    //  finyear
  @ViewChild('fin_year') fin_yearauto: MatAutocomplete;  
    @ViewChild('finyearInput') finyearInput: any;

     // branch dropdown
  @ViewChild('branchContactInput') branchContactInput: any;
  @ViewChild('branch') matAutocompletebrach: MatAutocomplete;

  //bs

  @ViewChild('bsInput') bsInput: any;
  @ViewChild('bs') matAutocompletebs: MatAutocomplete;

  //cc
  @ViewChild('ccInput') ccInput: any;
  @ViewChild('cc_name') matAutocompletecc: MatAutocomplete;

  //cat
  @ViewChild("Catagory") Catagory: MatAutocomplete;
  @ViewChild("cata_data") cata_data: any;
 
  //subcat
  @ViewChild("subcats") subcats: MatAutocomplete;
  @ViewChild("subcat_data") subcat_data: any;

  //popup
  @ViewChild('closepop') close_file :any;
  @ViewChild('closepops') close_files:any;

   //cc
   @ViewChild('levelInput') levelInput: any;
   @ViewChild('level_name') matAutocompletelevel: MatAutocomplete;

  //Download_type
  selectedValue: any = null;


  aws_summary: FormGroup;
  awt_fileuploade:FormGroup;
  awt_filedownload:FormGroup;
  aws_data: { created_date: string; file_name: string; id: number; status: number; type: string; }[];
  has_next: boolean=false;
  has_previous: boolean=false;
  presentpage: any=1;
  aws_search_val: any;
  data_found: boolean=true;
  file_info: any;
  isLoading: boolean;
  finy: any;
  startyear: string;
  lastyear: string;
  finyearList: any;
  currentpage: number;
  minDate:any;
  maxDate:any;
  minsDate:any;
  maxsDate:any;
  finyears_data: any;
  fiyer_validation: any;
  isMultiYearView: boolean = true;
  month_based:boolean =false;
  finyear_based:boolean=true;
  branchList: any;
  has_previousbra: boolean;
  currentpagebra: number;
  has_nextbra: boolean;
  // business_id: any="";
  bsList: any;
  bsclear_name: any;
  ccList: any;
  subcats_list: any;
  Catagory_list: any;
  
  cat_id: any;
  transaction_type: boolean = false;
  download_typeee: any;
  sectorList: any;
  finyears: any;
  Fin_yearsbuisness: any;
  businessList: any;
  month: string[];
  frommonthid: any;
  startyear_ind: number;
  colspanlength: number;
  start_month_arr: string[];
  file_typess: number;
  branchid: any;
  branchids: any;
  branchcode: any;
  download_submit: boolean;
  label_list: any;
  constructor(private errorHandler:ErrorhandlingService,private formBuilder:FormBuilder,private service:PprService,public datepipe:DatePipe,private SpinnerService:NgxSpinnerService,private toastr:ToastrService) {
  
//  let form_value =this.awt_filedownload.value.finyear?this.awt_filedownload.value.finyear.finyear:""
// console.log("form_value",form_value)

   
   }
  from_month = [
    { id: 1, month: 'APR', month_id: 4 },
    { id: 2, month: 'MAY', month_id: 5 },
    { id: 3, month: 'JUN', month_id: 6 },
    { id: 4, month: 'JUL', month_id: 7 },
    { id: 5, month: 'AUG', month_id: 8 },
    { id: 6, month: 'SEP', month_id: 9 },
    { id: 7, month: 'OCT', month_id: 10 },
    { id: 8, month: 'NOV', month_id: 11 },
    { id: 9, month: 'DEC', month_id: 12 },
    { id: 10, month: 'JAN', month_id: 1 },
    { id: 11, month: 'FEB', month_id: 2 },
    { id: 12, month: 'MAR', month_id: 3 },
  ]

  from_months = [
    { id: 1, month: 'Apr', month_id: 4 },
    { id: 2, month: 'May', month_id: 5 },
    { id: 3, month: 'Jun', month_id: 6 },
    { id: 4, month: 'Jul', month_id: 7 },
    { id: 5, month: 'Aug', month_id: 8 },
    { id: 6, month: 'Sep', month_id: 9 },
    { id: 7, month: 'Oct', month_id: 10 },
    { id: 8, month: 'Nov', month_id: 11 },
    { id: 9, month: 'Dec', month_id: 12 },
    { id: 10, month: 'Jan', month_id: 1 },
    { id: 11, month: 'Feb', month_id: 2 },
    { id: 12, month: 'Mar', month_id: 3 },
  ]
  from_monthss = [
    // { id: 1, month: 'Apr', month_id: 4 },
    { id: 2, month: 'May', month_id: 5 },
    { id: 3, month: 'Jun', month_id: 6 },
    { id: 4, month: 'Jul', month_id: 7 },
    { id: 5, month: 'Aug', month_id: 8 },
    { id: 6, month: 'Sep', month_id: 9 },
    { id: 7, month: 'Oct', month_id: 10 },
    { id: 8, month: 'Nov', month_id: 11 },
    { id: 9, month: 'Dec', month_id: 12 },
    { id: 10, month: 'Jan', month_id: 1 },
    { id: 11, month: 'Feb', month_id: 2 },
    { id: 12, month: 'Mar', month_id: 3 },
  ]

  download_types=[
    {"id":1,"type":"Transaction Report"},
    {"id":2,"type":"PPR Lite"},
    {"id":3,"type":"Label Wise Report"},
    {"id":4,"type":"Branch Version"},
    {"id":5,"type":"Explanation of FAS for BSCC"},    
    {"id":6,"type":"Explanation of FAS for Subcategory"},
  ]


 

  ngOnInit(): void {
    this.aws_summary=this.formBuilder.group({
      status:[''],
      create_date:[''],
      file_name:['']
    })
    this.awt_fileuploade=this.formBuilder.group({
      awt_file:[''],
      file_type:['']
    })
    this.awt_filedownload=this.formBuilder.group({
      finyear:[''],
      frommonth:[''],
      from_date:[''],
      to_date:[''],
      bs_id:[''],
      cc_id:[''],
      cat:[''],
      subcat:[''],
      entry_module:[''],
      branch_id:[''],
      businesscontrol: [''],
      sectorname: [''],
      frommonths:[''],
      tomonth:[''],
      lable_id:['']
    })
    this.aws_search(this.aws_summary.value)
  }
  status_list=[
    {'name':"Uploaded","id":1},
    {"name":"Processing","id":2},
    {"name":"Success","id":3}
  ]
  file_types=[
    {"id":1,"type":"Income"},
    {"id":2,"type":"Hr-Cost"},
    {"id":3,"type":"Expense"},
    {"id":31,"type":"RawSheet"},
    {"id":5,"type":"Allocation Master Upload"},
    {'id':33,"type":"CBSTB Upload"},
    {"id":32,"type":"PPR Summary"},
    {"id":7,"type":"DCS Master"},
    {"id":9,"type":"Allocation Exception"},    
  ]
  public displayStatus(aws_name?: aws): string | undefined {
    return aws_name ? aws_name.name : undefined;
  }


  finyr_value(finyr){
    this.month_based=false;
    this.finyear_based=true;
    this.finyears_data=finyr.finyer
    console.log("this.finyear",this.finyears_data)
    let month_value = this.awt_filedownload.value.frommonth
    if(this.awt_filedownload.value.frommonth=="" || this.awt_filedownload.value.frommonth ==null || this.awt_filedownload.value.frommonth == undefined){
      let finyear_selete = this.finyears_data.slice(2, 4)
      let last_finyr_value = this.finyears_data.slice(5, 9)
      console.log("fin_lastfinyear_selete",finyear_selete)
      console.log("yhfghlast_finyr_value",last_finyr_value);
   
       const moonLanding =20+finyear_selete;
       const moonLandings =20+last_finyr_value
       console.log("moonLanding",moonLanding)
       console.log("moonLandings",moonLandings)
       const fin_last=new Date(last_finyr_value)
   
       console.log("fin_last",fin_last)
      console.log("yhfgh",moonLanding);
       var date = new Date();
       let finyear = moonLanding;
       var Y = finyear;        
       var M = date.getMonth() 
       var M = 3
       var D = 1; // 13
       var date3 = new Date(Y, M, D);
   
       var lastDate = new Date(Y, M + 1,0);
       var lastDay = lastDate.getDate();
       console.log("last date",lastDay)
   
       let year_datas=new Date(finyear_selete)
       console.log("year_datas",year_datas)
   
       var fromdate = date3.getDate();
       var year = date3.getFullYear(); 
       var month = date3.getMonth() ;
       var month =3
       var tomonth = date3.getMonth() ;
       var tomonth = 2
       const currentYear = new Date().getFullYear();
       this.minDate = new Date(year, month, fromdate);
       console.log('shdghj', this.minDate);
       this.maxDate = new Date(year + 1, tomonth,lastDay);
   
   
      
     
          let finyears = moonLanding;
          var Ys = finyears; // 2017
          var Ms = date.getMonth()  // 7
          var Ds = 1; // 13
          var date3 = new Date(Ys, Ms, Ds);
      
          var lastsDate = new Date(Ys, Ms + 1,0);
          var lastsDay = lastsDate.getDate();
          console.log("last date",lastsDay)
      
      
          var fromsdate = date3.getDate();
          var years = date3.getFullYear(); 
          var months = date3.getMonth() ;
          var months=3
          var tomonths = date3.getMonth() ;
        var tomonths=2
          this.minsDate = new Date(years, months, 1);
          console.log('shdghj', this.minDate);
          this.maxsDate = new Date(years + 1, tomonths,lastsDay);
    }
  }

  sta_view(){
    if(this.awt_filedownload.value.finyear!='' || this.awt_filedownload.value.finyear!=undefined || this.awt_filedownload.value.finyear!=null){
      this.isMultiYearView ? 'multi-year' : 'year';      
    }
  }

  month_date(month_values){
    this.month_based=true;
    this.finyear_based=false
    this.awt_filedownload.get('from_date').reset()
    this.awt_filedownload.get('to_date').reset()
    let month_value = month_values.month_id
    console.log("month_value",month_value)

let finyr_pata=this.awt_filedownload.value.finyear.finyer
console.log("finyr_pata",finyr_pata)
    let finyear_selete = this.finyears_data.slice(2, 4)
   let last_finyr_value = this.finyears_data.slice(5, 9)
   console.log("fin_lastfinyeargdfhf_selete",finyear_selete)
console.log("yhfghlast_finyr_dfhjfgvalue",last_finyr_value);
    const moonLanding =20+finyear_selete;
    const moonLandings =20+last_finyr_value
    console.log("moonLanding",moonLanding)
    console.log("moonLandings",moonLandings)
  
    var month_value_date = new Date(month_value).getMonth();
if(month_value==1 || month_value==3 || month_value==2 ){
  this.fiyer_validation=moonLandings
}else{
  this.fiyer_validation=moonLanding
}

console.log("yhfgh",moonLanding);
    var date = new Date();
    let finyear = this.fiyer_validation;
    var Y = finyear; 
    var M = month_value-1 
    var D = 1;
    var date3 = new Date(Y, M, D);
    var lastDate = new Date(Y, M + 1,0);
    var lastDay = lastDate.getDate();
    console.log("last date",lastDay)  
    let year_datas=new Date(finyear_selete)
    console.log("year_datas",year_datas)
    var fromdate = date3.getDate();
    var year = date3.getFullYear(); 
    var tomonth = date3.getMonth()-month_value ;    
    this.minDate = new Date(year, M, fromdate);
    console.log('shdghj', this.minDate);
    this.maxDate = new Date(year ,M, lastDay);
       let finyears = this.fiyer_validation;
       var Ys = this.fiyer_validation;
       var Ms = month_value-1  
       var Ds = 1; 
       var date3 = new Date(Ys, Ms, 1);
       var lastsDate = new Date(Ys, Ms + 1,0);
       var lastsDay = lastsDate.getDate();
       console.log("last date",lastsDay)
    
       var fromsdate = date3.getDate();
       var years = date3.getFullYear(); 
       var months = date3.getMonth()-month_value;
       var tomonths = date3.getMonth()+month_value;
    
       this.minsDate = new Date(years, M, fromsdate);
       console.log('shdghj', this.minDate);
       this.maxsDate = new Date(years,M, lastsDay);
  }

  aws_search(aws,pagenumber=1){
    let date=''
    if(aws.create_date!='' || aws.create_date!= undefined || aws.create_date!=null){
      date=this.datepipe.transform(aws.create_date,'yyyy-MM-dd')
    }
    this.aws_search_val=aws
    let search_val={
      status:aws?.status?.id,
      filename:aws?.file_name,
      created_date:date
    }
    for(let val in search_val){
      if (search_val[val] === null || search_val[val] === "" || search_val[val] === undefined) {
        search_val[val]=''
      }
    }
 
    this.SpinnerService.show()
    this.service.aws_summary(search_val,pagenumber).subscribe(results=>{
      this.SpinnerService.hide()
      console.log("results=>",results)
      let data=results['data']
      this.aws_data=data
      let datapagination = results["pagination"];
      if(results['set_code']){
        this.data_found=false
        this.has_next = false;
        this.has_previous = false;
        this.presentpage = 1;
        this.toastr.warning('',results['set_description'],{timeOut:1500})
        return false;
      }
  
      if (this.aws_data.length >= 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.presentpage = datapagination.index;
        this.data_found=true
      }

    },error=>{
      this.SpinnerService.hide()
    })
  }
  previousClick() {
    if (this.has_previous === true) {
      this.aws_search(this.aws_search_val,this.presentpage - 1);
    }
  }
  nextClick() { 
    if (this.has_next === true) {
      this.aws_search(this.aws_search_val,this.presentpage + 1)
    }
  }
  clear_aws(){
    this.aws_summary.reset('')
  }
  aws_file(aws){
    console.log(aws)
    let fileName=aws.type==1?'Income':(aws.type==2 ? 'Hr-Cost': (aws.type==3 ? 'Expense' : (aws.type==4 ? 'Report':(aws.type==6 ? 'Variance Report':(aws.type==21 ? 'Allocation' : (aws.type==24 ? 'Budget Report':(aws.type==26 ? 'Business Wise' : (aws.type==28 ? 'Gl Only' : (aws.type==30 ? 'OverAll Budget' : (aws.type==5 ? 'Allocation Master':(aws.type==31 ? 'RawSheet':(aws.type==33 ? 'CBSTB Upload' :(aws.type==32 ? 'PPR Summary' : (aws.type==7 ? 'DCS Master':(aws.type==9 ? 'Allocation Exception':(aws.type==42 ? 'Transaction Download':(aws.type==56 ? 'Customized Download' :(aws.type==58 ? 'Explanation of FAS for BSCC' : (aws.type==59 ? 'Explanation of FAS for Subcategory' : 'PPR Documents' )))))))))))))))))))
    let filekey=aws.gen_filename
  this.SpinnerService.show()
  this.service.pprreport(filekey)
  .subscribe((results: any[]) => {
    
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download =aws.type==56 || aws.type==42?aws?.file_name:fileName+".xlsx";
      link.click();
      this.toastr.success('Successfully Download');
  }, error => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })
  }
  Awt_file_data(file_info){
    console.log("element=>",file_info.target.files[0])
    this.file_info=file_info.target.files[0]
  }
  clear_data(){
    this.file_info=''
    this.awt_fileuploade.reset('')
  }
  awt_file_upload(awt){
    let type=''
    if(awt.file_type=='' || awt.file_type== undefined || awt.file_type==null){
      type=''
      this.toastr.warning('','Please Select The File Type',{timeOut:1500});
      return false;
    }else{
      type=awt.file_type;
    }
    if(awt.awt_file=='' || awt.awt_file== undefined || awt.awt_file == null){
      this.toastr.warning('','Please Choose The File',{timeOut:1500});
      return false;
    }

    let term='UPLOAD';
    const formData = new FormData();
    formData.append('file', this.file_info);
    this.SpinnerService.show()
    this.service.awt_file(type,term,formData).subscribe(results=>{
      this.SpinnerService.hide()
      let data=results['data']
      this.close_file.nativeElement.click();
      this.toastr.success('','File Upload Successfully',{timeOut:1500})
      this.aws_summary.reset('')
      this.aws_search(this.aws_summary.value)
    },error=>{
      this.aws_summary.reset('')
      this.close_file.nativeElement.click();

      this.SpinnerService.hide()
    })
  }
  finyear_dropdown() {
    this.awt_filedownload.get('from_date').reset()
    this.awt_filedownload.get('to_date').reset()
    this.awt_filedownload.get('frommonth').reset()
    let prokeyvalue: String = "";
    this.getfinyear(prokeyvalue);
    this.awt_filedownload.get('finyear').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.service.getfinyeardropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
              console.log(value.finyer)
              this.finy = value.finyer
              if (this.finy == undefined) {
                this.startyear = ''
                this.lastyear = ''
              } else {
                this.startyear = this.finy.slice(2, 4)
                this.lastyear = this.finy.slice(5, 9)
              }
              console.log("year=>", this.startyear, this.finy, this.lastyear)
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.finyearList = datas;
      })
  }

  autocompletefinyearScroll() {
    this.has_next = true;
    this.has_previous = true;
    this.currentpage = 1;
    setTimeout(() => {
      if (
        this.fin_yearauto &&
        this.autocompleteTrigger &&
        this.fin_yearauto.panel
      ) {
        fromEvent(this.fin_yearauto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.fin_yearauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.fin_yearauto.panel.nativeElement.scrollTop;
            const scrollHeight = this.fin_yearauto.panel.nativeElement.scrollHeight;
            const elementHeight = this.fin_yearauto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.service.getbbfinyeardropdown(this.finyearInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.finyearList = this.finyearList.concat(datas);
                    if (this.finyearList.length >= 0) {
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

  private getfinyear(prokeyvalue) {
    this.service.getfinyeardropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.finyearList = datas;
        console.log(this.finyearList)

      })
  }
  public displayfnfinyear(fin_year?: finyearList): string | undefined {
    return fin_year ? fin_year.finyer : undefined;

  }

  clear_down_datas(){
    this.awt_filedownload.reset('')    
  }

  clear_down_data(){
    this.awt_filedownload.reset('')    
    this.downloadTypeControl.reset(); 
    this.downloadTypeControl.updateValueAndValidity();

  }

  aws_download(){
    this.download_typeee= ""
    this.awt_filedownload.reset('')
    // this.transaction_type= false
    this.download_submit= false
    
    this.downloadTypeControl.reset(); 
    this.downloadTypeControl.updateValueAndValidity();



  }
  

    // branch dropdown start
    branchname() {
      let prokeyvalue: String = "";
      this.getbranchid(prokeyvalue);
      this.awt_filedownload.get('branch_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.service.getbranchdropdown(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.branchList = datas;
  
        })
    }
  
    private getbranchid(prokeyvalue) {
      this.service.getbranchdropdown(prokeyvalue, 1)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.branchList = datas;
  
        })
    }
  
    autocompletebranchnameScroll() {
      this.has_nextbra = true
      this.has_previousbra = true
      this.currentpagebra = 1
      setTimeout(() => {
        if (
          this.matAutocompletebrach &&
          this.autocompleteTrigger &&
          this.matAutocompletebrach.panel
        ) {
          fromEvent(this.matAutocompletebrach.panel.nativeElement, 'scroll')
            .pipe(
              map(() => this.matAutocompletebrach.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(() => {
              const scrollTop = this.matAutocompletebrach.panel.nativeElement.scrollTop;
              const scrollHeight = this.matAutocompletebrach.panel.nativeElement.scrollHeight;
              const elementHeight = this.matAutocompletebrach.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_nextbra === true) {
                  this.service.getbranchdropdown(this.branchContactInput.nativeElement.value, this.currentpagebra + 1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.branchList = this.branchList.concat(datas);
                      if (this.branchList.length >= 0) {
                        this.has_nextbra = datapagination.has_next;
                        this.has_previousbra = datapagination.has_previous;
                        this.currentpagebra = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }
  
    public displayfnbranch(branch?: aws): string | undefined {
      return branch ? branch.code +"-"+branch.name : undefined;
  
    }

    bsname_dropdowns() {
      if(this.awt_filedownload.controls['businesscontrol'].value==null ||  this.awt_filedownload.controls['businesscontrol'].value==undefined || this.awt_filedownload.controls['businesscontrol'].value==""){
        this.toastr.warning("","Please Select Business")
        // this.bsList = "";
        this.bsList = null;
        return false
      }
      let prokeyvalue: String = "";
      this.getbsid(prokeyvalue);
      this.awt_filedownload.get('bs_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.service.getbsdropdown(this.business_id, value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.bsList = datas;
          // this.expand=false
          this.bsclear_name.nativeElement.value = ''
  
        })
    }
  
    private getbsids(prokeyvalue) {
      if(this.awt_filedownload.controls['businesscontrol'].value==null ||  this.awt_filedownload.controls['businesscontrol'].value==undefined || this.awt_filedownload.controls['businesscontrol'].value==""){
        this.toastr.warning("","Please Select Business")
        // this.bsList = "";
        this.bsList = null;
        return false
      }
      this.service.getbsdropdown(this.business_id, prokeyvalue, 1)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.bsList = datas;
  
        })
    }
  
    cc_bs_id = 0
    currentpagebs: any = 1
    has_nextbs: boolean = true
    has_previousbs: boolean = true
    autocompletebsnameScrolls() {
      // this.has_nextbs = true
      // this.has_previousbs = true
      // this.currentpagebs = 1
      setTimeout(() => {
        if (
          this.matAutocompletebs &&
          this.autocompleteTrigger &&
          this.matAutocompletebs.panel
        ) {
          fromEvent(this.matAutocompletebs.panel.nativeElement, 'scroll')
            .pipe(
              map(() => this.matAutocompletebs.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(() => {
              const scrollTop = this.matAutocompletebs.panel.nativeElement.scrollTop;
              const scrollHeight = this.matAutocompletebs.panel.nativeElement.scrollHeight;
              const elementHeight = this.matAutocompletebs.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_nextbs === true) {
                  this.service.getbsdropdown(this.business_id, this.bsInput.nativeElement.value, this.currentpagebs + 1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.bsList = this.bsList.concat(datas);
                      if (this.bsList.length >= 0) {
                        this.has_nextbs = datapagination.has_next;
                        this.has_previousbs = datapagination.has_previous;
                        this.currentpagebs = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }
    // branch dropdown end
    // bs dropdown start
  
    bsname_dropdown() {
      let prokeyvalue: String = "";
      this.getbsid(prokeyvalue);
      this.awt_filedownload.get('bs_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.service.getbsdropdown(this.business_id, value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.bsList = datas;
          // this.expand=false
          this.bsclear_name.nativeElement.value = ''
  
        })
    }
  
    private getbsid(prokeyvalue) {
      this.service.getbsdropdown(this.business_id, prokeyvalue, 1)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.bsList = datas;
  
        })
    }
  
    // cc_bs_id = 0
    // currentpagebs: any = 1
    // has_nextbs: boolean = true
    // has_previousbs: boolean = true
    autocompletebsnameScroll() {
      // this.has_nextbs = true
      // this.has_previousbs = true
      // this.currentpagebs = 1
      setTimeout(() => {
        if (
          this.matAutocompletebs &&
          this.autocompleteTrigger &&
          this.matAutocompletebs.panel
        ) {
          fromEvent(this.matAutocompletebs.panel.nativeElement, 'scroll')
            .pipe(
              map(() => this.matAutocompletebs.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(() => {
              const scrollTop = this.matAutocompletebs.panel.nativeElement.scrollTop;
              const scrollHeight = this.matAutocompletebs.panel.nativeElement.scrollHeight;
              const elementHeight = this.matAutocompletebs.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_nextbs === true) {
                  this.service.getbsdropdown(this.business_id, this.bsInput.nativeElement.value, this.currentpagebs + 1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.bsList = this.bsList.concat(datas);
                      if (this.bsList.length >= 0) {
                        this.has_nextbs = datapagination.has_next;
                        this.has_previousbs = datapagination.has_previous;
                        this.currentpagebs = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }
  
    public displayfnbs(bs?: aws): string | undefined {
      return bs ? bs.name : undefined;
  
    }
  
    selectbsSection(data) {
      this.cc_bs_id = data.id
    }
  
    bs_cc_clear() {
      this.awt_filedownload.controls['cc_id'].reset('')
    }
    // cc dropdown 
  
    ccname_dropdown() {
      if(typeof this.awt_filedownload.value.bs_id !="object"){
        this.toastr.warning("Please Select BS")
        this.ccList = null
        return false
      }
      let prokeyvalue: String = "";
      this.getccid(prokeyvalue);
      this.awt_filedownload.get('cc_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.service.getccdropdown(this.cc_bs_id, value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.ccList = datas;
        })
    }
  
  
  
    private getccid(prokeyvalue) {
      if(this.awt_filedownload.controls['bs_id'].value==null ||  this.awt_filedownload.controls['bs_id'].value==undefined || this.awt_filedownload.controls['bs_id'].value==""){
        this.toastr.warning("","Please Select BS")
        this.ccList = null;
        return false
      }
      this.service.getccdropdown(this.cc_bs_id, prokeyvalue, 1)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.ccList = datas;
  
        })
    }
  
    currentpagecc: any = 1
    has_nextcc: boolean = true
    has_previouscc: boolean = true
    autocompletccnameScroll() {
      // this.has_nextcc = true
      // this.has_previouscc = true
      // this.currentpagecc = 1
      setTimeout(() => {
        if (
          this.matAutocompletecc &&
          this.autocompleteTrigger &&
          this.matAutocompletecc.panel
        ) {
          fromEvent(this.matAutocompletecc.panel.nativeElement, 'scroll')
            .pipe(
              map(() => this.matAutocompletecc.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(() => {
              const scrollTop = this.matAutocompletecc.panel.nativeElement.scrollTop;
              const scrollHeight = this.matAutocompletecc.panel.nativeElement.scrollHeight;
              const elementHeight = this.matAutocompletecc.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_nextcc === true) {
                  this.service.getccdropdown(this.cc_bs_id, this.ccInput.nativeElement.value, this.currentpagecc + 1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.ccList = this.ccList.concat(datas);
                      if (this.ccList.length >= 0) {
                        this.has_nextcc = datapagination.has_next;
                        this.has_previouscc = datapagination.has_previous;
                        this.currentpagecc = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }
  
  
    public displayfncc(cc_name?: aws): string | undefined {
      return cc_name ? cc_name.name : undefined;
  
    }

    Catagorys() {
      this.SpinnerService.show();
      this.service
        .Catagorys(this.cata_data.nativeElement.value, 1)
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe((results) => {
          this.SpinnerService.hide();
          let datas = results["data"];
          this.Catagory_list = datas;
          
        console.log("this.Catagory_list",this.Catagory_list)
        });

    }

    cat_has_next: boolean=true;
  cat_has_previous: boolean=true;
  cat_currentpage: number=1;
    autocompletecatScroll() {
    
      setTimeout(() => {
        if (this.Catagory && this.autocompleteTrigger && this.Catagory.panel) {
          fromEvent(this.Catagory.panel.nativeElement, "scroll")
            .pipe(
              map(() => this.Catagory.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(() => {
              const scrollTop = this.Catagory.panel.nativeElement.scrollTop;
              const scrollHeight = this.Catagory.panel.nativeElement.scrollHeight;
              const elementHeight =
                this.Catagory.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.cat_has_next === true) {
                  this.service
                    .Catagorys(
                      this.cata_data.nativeElement.value,
                      this.cat_currentpage + 1
                    )
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.Catagory_list = this.Catagory_list.concat(datas);
                      if (this.Catagory_list.length >= 0) {
                        this.cat_has_next = datapagination.has_next;
                        this.cat_has_previous = datapagination.has_previous;
                        this.cat_currentpage = datapagination.index;
                      }
                    });
                }
              }
            });
        }
      });
    }

    public Catagory_display(cat_name?: aws): string | undefined {
      return cat_name ? cat_name.name : undefined;
    }
   

    cat_clear() {
      this.awt_filedownload.controls['subcat'].reset('')
    }

    //subcat

    selectcat(cat_id){
this.cat_id=cat_id?.id
    }
  
    Subcats() {
      if(typeof this.awt_filedownload.value.cat !="object" || !this.awt_filedownload.value.cat){
        this.toastr.warning("Please Select Category")
        this.subcats_list= null
        return false
      }
      this.SpinnerService.show();
      this.service
        .Subcats(this.subcat_data.nativeElement.value, this.cat_id, 1)
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe((results) => {
          this.SpinnerService.hide();
          let datas = results["data"];
          this.subcats_list = datas;
        });
    }
   subcat_has_next = true;
   subcat_has_previous = true;
    subcat_currentpage = 1;
    autocompletesubcatScroll() {
      
      setTimeout(() => {
        if (this.subcats && this.autocompleteTrigger && this.subcats.panel) {
          fromEvent(this.subcats.panel.nativeElement, "scroll")
            .pipe(
              map(() => this.subcats.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(() => {
              const scrollTop = this.subcats.panel.nativeElement.scrollTop;
              const scrollHeight = this.subcats.panel.nativeElement.scrollHeight;
              const elementHeight = this.subcats.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.subcat_has_next === true) {
                  this.service
                    .Subcats(this.subcat_data.nativeElement.value, this.cat_id, this.subcat_currentpage+1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.subcats_list = this.subcats_list.concat(datas);
                      if (this.subcats_list.length >= 0) {
                        this.subcat_has_next = datapagination.has_next;
                        this.subcat_has_previous = datapagination.has_previous;
                        this.subcat_currentpage = datapagination.index;
                      }
                    });
                }
              }
            });
        }
      });
    }

    public subcats_display(subcat_name?: aws): string | undefined {
      return subcat_name ? subcat_name.name : undefined;
    }



    awt_file_download(form_data){
      if(this.download_typeee == 5 || this.download_typeee == 6){
        this.master_file_download(this.download_typeee)
      }else{
      console.log("type for submit",this.download_typeee);
      console.log("formgroup-values",form_data)
      // return false
      if(this.download_typeee== 1){
        if(form_data.finyear==null ||  form_data.finyear==undefined || form_data.finyear==""){
          this.toastr.warning("","Please Select Finyear")
          return false
        }
        // if(form_data.frommonth==null ||  form_data.frommonth==undefined || form_data.frommonth==""){
        //   this.toastr.warning("","Please Select Month")
        //   return false
        // }
        if(form_data.from_date==null ||  form_data.from_date==undefined || form_data.from_date==""){
          this.toastr.warning("","Please Select Form Date")
          return false
        }
        if(form_data.to_date==null ||  form_data.to_date==undefined || form_data.to_date==""){
          this.toastr.warning("","Please Select To Date")
          return false
        }
       let from_value_date=this.datepipe.transform(form_data.from_date,'yyyy-MM-dd')
       let to_value_date=this.datepipe.transform(form_data.to_date,'yyyy-MM-dd')
    let param={
      "finyear":form_data.finyear.finyer,
      "month":form_data.frommonth?.month_id??"",
      "from_date":from_value_date ,
      "to_date": to_value_date,
      "branch_id":form_data.branch_id?.id??"",
      "entry_module":form_data.entry_module??"",
      "bsunique_no":form_data.bs_id?.microbscode??"",
      "subcatunique_no":form_data.subcat?.microsubcatcode??"",
      "ccunique_no":form_data.cc_id?.microcccode??"",
      "catunique_no":form_data.cat?.microcatcode??"",
    }

    this.SpinnerService.show()
    this.service.awt_file_download(param)
      .subscribe((results: any) =>  {
        this.SpinnerService.hide()
        // this.errorHandler.handleError(error);   
        if(results.status=="Success"){
          this.toastr.success("", 'File Generate Start...', { timeOut: 1500 })
          this.clear_down_data()
          this.closepops.nativeElement.click()
          
          this.downloadTypeControl.reset(); 
          this.downloadTypeControl.updateValueAndValidity();
          this.aws_search(this.aws_summary.value)

          }else{
            this.toastr.warning(results)
          } 
      })

      } else if(this.download_typeee== 2 || this.download_typeee== 4){

        if(form_data.finyear==null ||  form_data.finyear==undefined || form_data.finyear==""){
          this.toastr.warning("","Please Select Finyear")
          return false
        }
        if(form_data.from_date==null ||  form_data.from_date==undefined || form_data.from_date==""){
          this.toastr.warning("","Please Select Form Date")
          return false
        }
        if(form_data.to_date==null ||  form_data.to_date==undefined || form_data.to_date==""){
          this.toastr.warning("","Please Select To Date")
          return false
        }

        let from_value_date=this.datepipe.transform(form_data.from_date,'yyyy-MM-dd')
        let to_value_date=this.datepipe.transform(form_data.to_date,'yyyy-MM-dd')

        let params={
          "finyear":form_data.finyear.finyer,
          // "month":form_data.frommonth?.month_id??"",
          "from_date":from_value_date ,
          "to_date": to_value_date,
          "from_month": "" ,
          "to_month": "",
          "branch_id":form_data.branch_id?.id??"",
          "sector_id":form_data.sectorname?.id??"",
          "business_id":form_data.businesscontrol?.id??"",
          // "entry_module":form_data.entry_module?form_data.entry_module:"",
          "bsunique_no":form_data.bs_id?.microbscode??"",
          "ccunique_no":form_data.cc_id?.microcccode??"",
        }
        if(this.download_typeee== 2){
          this.file_typess=1
        }else if(this.download_typeee== 4){
          this.file_typess=2
        }
        
        this.SpinnerService.show()
        this.service.awt_file_downloads(params,this.file_typess)
      .subscribe((results: any) =>  {
        this.SpinnerService.hide()
        // this.errorHandler.handleError(error);   
        if(results.status=="Success"){
          this.toastr.success("", 'File Generate Start...', { timeOut: 1500 })
          this.clear_down_data()
          
          this.downloadTypeControl.reset(); 
          this.downloadTypeControl.updateValueAndValidity();

          this.closepops.nativeElement.click()
          this.aws_search(this.aws_summary.value)
          }else{
            this.toastr.warning(results)
          } 
      })


      } else if(this.download_typeee== 3){
        if(form_data.finyear==null ||  form_data.finyear==undefined || form_data.finyear==""){
          this.toastr.warning("","Please Select Finyear")
          return false
        }
        if(form_data.frommonths==null ||  form_data.frommonths==undefined || form_data.frommonths==""){
          this.toastr.warning("","Please Select Form Month")
          return false
        }
        if(form_data.tomonth==null ||  form_data.tomonth==undefined || form_data.tomonth==""){
          this.toastr.warning("","Please Select To Month")
          return false
        }
         if(form_data.lable_id==null ||  form_data.lable_id==undefined || form_data.lable_id==""){
          this.toastr.warning("","Please Select Label")
          return false
        }

        let from_value_date=this.datepipe.transform(form_data.from_date,'yyyy-MM-dd')
        let to_value_date=this.datepipe.transform(form_data.to_date,'yyyy-MM-dd')

        var fromdatess=this.awt_filedownload.value.validity_from
        let validityfrom=this.datepipe.transform(fromdatess, 'yyyy-MM-dd')
        var todates=this.awt_filedownload.value.validity_to
        let validityto=this.datepipe.transform(todates, 'yyyy-MM-dd')   

        let params={
          "finyear":form_data.finyear.finyer,
          // "month":form_data.frommonth?.month_id??"",
          "from_date":"" ,
          "to_date": "",
          "from_month":form_data.frommonths?.month_id??"" ,
          "to_month": form_data.tomonth?.month_id??"",
          "branch_id":form_data.branch_id?.id??"",
          "sector_id":form_data.sectorname?.id??"",
          "business_id":form_data.businesscontrol?.id??"",
          "ccunique_no":form_data.cc_id?.microcccode??"",
          "bsunique_no":form_data.bs_id?.microbscode??"",
          "label":form_data.lable_id?.reportlevel??""
        }
        this.file_typess=3
        this.SpinnerService.show()
        this.service.awt_file_downloads(params,this.file_typess)
        .subscribe((results: any) =>  {
          this.SpinnerService.hide()
          // this.errorHandler.handleError(error);   
          if(results.status=="Success"){
            this.toastr.success("", 'File Generate Start...', { timeOut: 1500 })
            this.clear_down_data()
            this.closepops.nativeElement.click()
            
            this.downloadTypeControl.reset(); 
            this.downloadTypeControl.updateValueAndValidity();
            this.aws_search(this.aws_summary.value)


            }else{
              this.toastr.warning(results)
            } 
        })
  

      }
      }
    }

    validityto_clear(){
      console.log(this.awt_filedownload)
      this.awt_filedownload.controls['validity_to'].reset('')
    }

     sector_id = 0
      Sector_dropdown() {
        let prokeyvalue: String = "";
        this.getsector(prokeyvalue);
        this.awt_filedownload.get('sectorname').valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
            }),
            switchMap(value => this.service.getsectordropdown(value, 1)
              .pipe(
                finalize(() => {
                  this.isLoading = false
                }),
              )
            )
          )
          .subscribe((results: any[]) => {
            let datas = results["data"];
            var sectorpush = {

              "description": "ALL",
              "id": "",
              "name": "ALL"
    
            }
            datas.splice(0, 0, sectorpush)
            this.sectorList = datas;
    
          })
      }
      @ViewChild('sectornameInput') sectornameInput: any
      @ViewChild('sector_name') sectorAutoComplete: MatAutocomplete;
      autocompletesectorScroll() {
        this.has_next = true;
        this.has_previous = true;
        this.currentpage = 1;
        setTimeout(() => {
          if (
            this.sectorAutoComplete &&
            this.autocompleteTrigger &&
            this.sectorAutoComplete.panel
          ) {
            fromEvent(this.sectorAutoComplete.panel.nativeElement, 'scroll')
              .pipe(
                map(() => this.sectorAutoComplete.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(() => {
                const scrollTop = this.sectorAutoComplete.panel.nativeElement.scrollTop;
                const scrollHeight = this.sectorAutoComplete.panel.nativeElement.scrollHeight;
                const elementHeight = this.sectorAutoComplete.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if (this.has_nextbra === true) {
                    this.service.getsectordropdown(this.sectornameInput.nativeElement.value, this.currentpage + 1)
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        this.sectorList = this.sectorList.concat(datas);
                        if (this.sectorList.length >= 0) {
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
      private getsector(prokeyvalue) {
        this.service.getsectordropdown(prokeyvalue, 1)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            var sectorpush = {

              "description": "ALL",
              "id": "",
              "name": "ALL"
    
            }
            datas.splice(0, 0, sectorpush)
            this.sectorList = datas;
    
          })
      }
    
      public displayfnsectorname(sector_name?: sectorList): string | undefined {
        return sector_name ? sector_name.name : undefined;
    
      }
    
    
      selectsectorSection(name) {
        this.sector_id = name.id
      }
    
      secotralldata_clear() {
        this.awt_filedownload.controls['bs_id'].reset('')
        this.awt_filedownload.controls['businesscontrol'].reset('')
        this.awt_filedownload.controls['cc_id'].reset('')
      }

      Business_dropdown() {
        if(this.awt_filedownload.controls['sectorname'].value==null ||  this.awt_filedownload.controls['sectorname'].value==undefined || this.awt_filedownload.controls['sectorname'].value==""){
          this.toastr.warning("","Please Select Sector")
          this.businessList = null;
          return false
        }
          let prokeyvalue: String = "";
          this.getbusiness(prokeyvalue);
          this.awt_filedownload.get('businesscontrol').valueChanges
            .pipe(
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
              }),
              switchMap(value => this.service.getbusinessdropdown(this.sector_id, value, 1)
                .pipe(
                  finalize(() => {
                    this.isLoading = false
                  }),
                )
              )
            )
            .subscribe((results: any[]) => {
              let datas = results["data"];
              this.businessList = datas;
              this.awt_filedownload.controls['bs_id'].reset('')
              this.awt_filedownload.controls['cc_id'].reset('')
            })
        }
        bs_clear() {
          this.awt_filedownload.controls['bs_id'].reset('')
          this.awt_filedownload.controls['cc_id'].reset('')
        }
        autocompletebusinessnameScroll() {
          this.has_nextbra = true
          this.has_previousbra = true
          this.currentpagebra = 1
          setTimeout(() => {
            if (
              this.business_nameautocomplete &&
              this.autocompleteTrigger &&
              this.business_nameautocomplete.panel
            ) {
              fromEvent(this.business_nameautocomplete.panel.nativeElement, 'scroll')
                .pipe(
                  map(() => this.business_nameautocomplete.panel.nativeElement.scrollTop),
                  takeUntil(this.autocompleteTrigger.panelClosingActions)
                )
                .subscribe(() => {
                  const scrollTop = this.business_nameautocomplete.panel.nativeElement.scrollTop;
                  const scrollHeight = this.business_nameautocomplete.panel.nativeElement.scrollHeight;
                  const elementHeight = this.business_nameautocomplete.panel.nativeElement.clientHeight;
                  const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                  if (atBottom) {
                    if (this.has_nextbra === true) {
                      this.service.getbusinessdropdown(this.sector_id, this.businessInput.nativeElement.value, this.currentpagebra + 1)
                        .subscribe((results: any[]) => {
                          let datas = results["data"];
                          let datapagination = results["pagination"];
                          this.businessList = this.businessList.concat(datas);
                          if (this.businessList.length >= 0) {
                            this.has_nextbra = datapagination.has_next;
                            this.has_previousbra = datapagination.has_previous;
                            this.currentpagebra = datapagination.index;
                          }
                        })
                    }
                  }
                });
            }
          });
        }
        business_id = "";
        private getbusiness(prokeyvalue) {
          if(this.awt_filedownload.controls['sectorname'].value==null ||  this.awt_filedownload.controls['sectorname'].value==undefined || this.awt_filedownload.controls['sectorname'].value==""){
            this.toastr.warning("","Please Select Sector")
            this.businessList = null
            return false
          }
          this.service.getbusinessdropdown(this.sector_id, prokeyvalue, 1)
            .subscribe((results: any[]) => {
              let datas = results["data"];
              this.businessList = datas;
      
            })
        }
      
        public displayfnbusiness(business_name?: businessList): string | undefined {
          return business_name ? business_name.name : undefined;
      
        }
      
        selectbusinessSection(data) {
          this.business_id = data.id
      
          if (this.business_id == undefined) {
            this.awt_filedownload.value.bs_id = ' ';
          }
      
        }
      
        business_bs_clear() {
          this.awt_filedownload.controls['bs_id'].reset('')
          this.awt_filedownload.controls['cc_id'].reset('')
      
        }
      // sector dropdown end
      // business dropdown start
 
  // branchcode(sector_id: number, branchid: (sector_id: number, branchid: any, branchcode: any, value: any, arg4: number, Fin_yearsbuisness: any) => void, branchcode: any, value: any, arg4: number, Fin_yearsbuisness: any) {
  //   throw new Error('Method not implemented.');
  // }
  // branchid(sector_id: number, branchid: any, branchcode: any, value: any, arg4: number, Fin_yearsbuisness: any) {
  //   throw new Error('Method not implemented.');
  // }

  @ViewChild('businessInput') businessInput: any;
  @ViewChild('business_name') business_nameautocomplete: MatAutocomplete;
    
   
    
      // public displayfnbusiness(business_name?: businessList): string | undefined {
      //   return business_name ? business_name.name : undefined;
    
      // }
    
      // selectbusinessSection(data) {
      //   this.business_id = data.id
      //   if (this.business_id == undefined) {
      //     this.awt_filedownload.value.bs_id = ' ';
      //   }
      // }

      frommonthsearch(month) {
        this.frommonthid = month.id
        this.month = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'YTD']
        let startmonth = this.month.findIndex((start) => start == month.month)
        console.log("month=>", startmonth)
        this.month = this.month.filter((m, ind) => {
          if (startmonth <= ind) {
            return m;
          } else {
            return
          }
        })
        let startyear = this.month.findIndex(startind => startind == "Dec")
        this.startyear_ind = startyear + 1
        this.colspanlength = this.month.length
        this.start_month_arr = this.month
        console.log('month=>', this.month)
        this.awt_filedownload.controls['tomonth'].reset('')    
        console.log("colspanlength=>", this.colspanlength)
       
       
      }
      tomonthsearch(month) {
        if (this.start_month_arr.length != 0) {
          this.month = this.start_month_arr
        }
        let startmonth = this.month.findIndex((start) => start == month.month)
        console.log("month=>", startmonth)
        this.month = this.month.filter((m, ind) => {
          if (startmonth >= ind || m == "YTD") {
            return m;
          } else {
            return
          }
        })
        this.colspanlength = this.month.length   
        console.log("month changes=>", this.month)
     
    
      
      }

    download_type(type){
      this.download_submit= true
      this.awt_filedownload.reset()
      console.log("Download Type",type)
      this.download_typeee= type.id
      if(this.download_typeee== 1){
        this.transaction_type = true
      } else if(this.download_typeee== 2){
        this.transaction_type = false
      }

    }
  
    master_file_download(data){
      let flag
      if(data == 5){
        flag = 1
      }else{
        flag = 2
      }
      this.SpinnerService.show()
      this.service.master_filedownload(flag)
        .subscribe((results: any) =>  {
          this.SpinnerService.hide()
          if(results.status=="CREATED SUCCESS"){
            this.toastr.success("", 'File Generate Start...', { timeOut: 1500 })
            this.clear_down_data()
            this.closepops.nativeElement.click()
            this.downloadTypeControl.reset(); 
            this.downloadTypeControl.updateValueAndValidity();
            this.aws_search(this.aws_summary.value)
            }else{
              this.toastr.warning(results)
            } 
        })
    }

    lable_dropdown() {
      let prokeyvalue: String = "";
      this.getlable_id(prokeyvalue);
      this.awt_filedownload.get('lable_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.service.ppr_report_label_summary(value, "", 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.label_list = datas;
        })
    }
  
  
  
    private getlable_id(prokeyvalue) {
      this.service.ppr_report_label_summary(prokeyvalue, "", 1)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.label_list = datas;
  
        })
    }
  
    currentpagelabel: any = 1
    has_nextlabel: boolean = true
    has_previouslabel: boolean = true
    autocompletlabelnameScroll() {
      setTimeout(() => {
        if (
          this.matAutocompletelevel &&
          this.autocompleteTrigger &&
          this.matAutocompletelevel.panel
        ) {
          fromEvent(this.matAutocompletelevel.panel.nativeElement, 'scroll')
            .pipe(
              map(() => this.matAutocompletelevel.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(() => {
              const scrollTop = this.matAutocompletelevel.panel.nativeElement.scrollTop;
              const scrollHeight = this.matAutocompletelevel.panel.nativeElement.scrollHeight;
              const elementHeight = this.matAutocompletelevel.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_nextcc === true) {
                  this.service.ppr_report_label_summary(this.levelInput.nativeElement.value, "", this.currentpagecc + 1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.label_list = this.label_list.concat(datas);
                      if (this.label_list.length >= 0) {
                        this.has_nextlabel = datapagination.has_next;
                        this.has_previouslabel = datapagination.has_previous;
                        this.currentpagelabel = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }
}
