import { DatePipe, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { WindowInterruptSource } from '@ng-idle/core';
import { event } from 'jquery';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { faservice } from '../fa.service';
import { faShareService } from '../share.service';
import { Idle ,DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import { E } from '@angular/cdk/keycodes';
const moment = _rollupMoment || _moment;

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
// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'MM/YYYY',
//   },
//   display: {
//     dateInput: 'DD/MM/YYYY',
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   },
// };

@Component({
  selector: 'app-fa-depreciation-cal',
  templateUrl: './fa-depreciation-cal.component.html',
  styleUrls: ['./fa-depreciation-cal.component.scss'],
  providers:[ { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe],
})

export class FaDepreciationCalComponent {
  
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    console.log('welcome',event.code);
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
  idletime:any='';
  month:any = {'Jan':1,'Feb':2,'Mar':3,'Apr':4,'May':5,'Jun':6,'Jul':7,'Aug':8,'Sep':9,'Oct':10,'Nov':11,'Dec':12}
  datearray: Array<any>=[];
  startDate: any;
  endDate: any;
  date1: any;
  str1:any;
  str2:any;
  query_enb:boolean=true;
  listcomments: any = [];
  totalRecords: any = [];
  selected: string;
  filter: any;
  array = ['Regular','Forecasting'];
  has_nextbuk = true;
  has_previousbuk = true;
  presentpagebuk: number = 1;
  datapagination:any=[];
  pageSize = 10;
  radioFlag:any = '4'
  statusCheck = false;
  downloadForecastFlag = true;
  downloadRegularFlag = true;
  first:boolean=false;

  floatLabelControl = new FormControl('auto');
  date = new FormControl(moment());
  m1: number;
  m2: number;
  valid_date=new Date();
  mo1: any;
  mo2:any;
  da1:any;
  da2:any;
  yr1:any;
  yr2:any;
  pageNumber: number;
  depreciationform:any= FormGroup;
  fromdate = new FormControl(new Date());
  todate = new FormControl(new Date());
  latest_date: string;
  description = "INVALID_DATE"
  regform:any=FormGroup;
  firstQdep:boolean=true;
  secondQdep:boolean=false;
 
  constructor( private idletimeout:Idle,private router: Router, private share: faShareService, private http: HttpClient,
    private Faservice: faservice, public datepipe: DatePipe, private toastr:ToastrService, private spinner: NgxSpinnerService, private fb: FormBuilder ) { }


  ngOnInit(): void {
    this.depreciationform =new FormGroup({
      'fromdate':new FormControl(),
      'todate':new FormControl(),
    });
    this.regform=new FormGroup({
      'regdate':new FormControl(''),
      'datecast':new FormControl('')
    });
    this.latest_date =this.datepipe.transform(this.valid_date, 'yyyy-MM-dd');


    this.getApi();
  }

  getApi(){
      this.spinner.show()
      this.Faservice.getdepreciation().subscribe((data) => {
        console.log( data);
          // this.spinner.show();
          this.listcomments = data['data'];
          this.datapagination = data['pagination'];
          console.log('d-',data['data']);
          if (this.listcomments.length >= 0) {
            this.has_nextbuk = this.datapagination.has_next;
            this.has_previousbuk = this.datapagination.has_previous;
            this.presentpagebuk = this.datapagination.index;
          }
          this.spinner.hide()
          },
          (error:any)=>{
            console.log(error);
            this.toastr.warning(error.status+error.statusText)
            this.spinner.hide();
          }) 
          // setTimeout(() => {
          // /** spinner ends after 3 seconds */
          // this.spinner.hide();
          // }, 3000);
        }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  chosenDateHandler(normalizedDate: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.date(normalizedDate.date() - this.date1.getdate());
    this.date.setValue(ctrlValue);
  }

  onsubmit(){
    
}

radioChange(event: MatRadioChange) {
  console.log(event.value);
  if(event.value == 'Regular'){
    this.radioFlag = '1'
  }
  else if(event.value == 'Forecasting'){
    this.radioFlag = '4'
  }
  console.log('radio_flag ',this.radioFlag);
}

searchFor(){
    this.datearray.push(this.startDate.toString().split(" ")[1]);  //month
    this.datearray.push(this.startDate.toString().split(" ")[2]);  //day
    this.datearray.push(this.startDate.toString().split(" ")[3]);  //year
    this.datearray.push(this.endDate.toString().split(" ")[1]);  //month
    this.datearray.push(this.endDate.toString().split(" ")[2]);  //day
    this.datearray.push(this.endDate.toString().split(" ")[3]);  //year
    console.log(this.datearray)
    const month1 = this.datearray[0].toString(); //month convert string
    const month2 = this.datearray[3].toString();
    this.da1 = this.datearray[1]
    this.mo1 = this.month[month1]
    console.log('month1', this.mo1);
    this.yr1 = this.datearray[2]
    this.da2 = this.datearray[4]
    this.mo2 = this.month[month2]
    this.yr2 = this.datearray[5]
    this.str1 = `${this.yr1}-${this.mo1}-${this.da1}`;
    console.log('month1', this.str1);
    this.str2 = `${this.yr2}-${this.mo2}-${this.da2}`;
    this.calSearch();
}
reportsdownloads(){
  if(this.startDate ==undefined || this.startDate=='' || this.startDate==null){
    this.toastr.warning('Please Select The From  Date');
    return false;
  }
  if(this.endDate ==undefined || this.endDate=='' || this.endDate==null){
    this.toastr.warning('Please Select The End Date');
    return false;
  }
  let fromdate:any=this.datepipe.transform(this.startDate,'yyyy-MM-dd');
  let todate:any=this.datepipe.transform(this.endDate,'yyyy-MM-dd');

  this.spinner.show();
  this.Faservice.fareportsdownloadexcel(fromdate,todate).subscribe(result=>{
    let binaryData = [];
    binaryData.push(result)
    let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    let link = document.createElement('a');
    link.href = downloadUrl;
    let date: Date = new Date();
    link.download = 'FA-Report'+ date +".xlsx";
    link.click();
    this.toastr.success('Success');
    setTimeout(() => {
      /** spinner ends after 3 seconds */
      this.spinner.hide();
      }, 3000);
      },
      (error:any)=>{
        console.log(error);
        this.toastr.warning(error.status+error.statusText)
        this.spinner.hide();
      })
}
buknextClick() {
  console.log(this.has_nextbuk,this.has_previousbuk,this.presentpagebuk)
  if (this.has_nextbuk === true) {
    this.spinner.show();
      setTimeout(() => {
      /** spinner ends after 3 seconds */
      this.spinner.hide();
      }, 3000);
    this.Faservice.getdepreciation(this.pageNumber = this.presentpagebuk + 1, 30).subscribe(data => {
      console.log(data)
      this.listcomments = data['data'];
      this.datapagination = data['pagination'];
      console.log('d-',data['data']);
      console.log('page',this.datapagination)
      if (this.listcomments.length >= 0) {
        this.has_nextbuk = this.datapagination.has_next;
        this.has_previousbuk = this.datapagination.has_previous;
        this.presentpagebuk = this.datapagination.index;
      }
      }) 

  }
}

bukpreviousClick() {
  if (this.has_previousbuk === true) {
    this.spinner.show();
      setTimeout(() => {
      /** spinner ends after 3 seconds */
      this.spinner.hide();
      }, 3000);
    this.Faservice.getdepreciation(this.pageNumber = this.presentpagebuk - 1, 30).subscribe(data => {
      console.log(data)
      this.listcomments = data['data'];
      this.datapagination = data['pagination'];
      console.log('d-',data['data']);
      console.log('page',this.datapagination)
      if (this.listcomments.length >= 0) {
        this.has_nextbuk = this.datapagination.has_next;
        this.has_previousbuk = this.datapagination.has_previous;
        this.presentpagebuk = this.datapagination.index;
      }
      }) 


  }
}


calSearch(){
  this.spinner.show();
  this.toastr.warning('Wait for 7 Mins');
  this.Faservice.getDepreciationCal(this.str1,this.str2,this.radioFlag).subscribe(result=>{
    console.log(result);
    this.spinner.hide();
    if(result.description == this.description){
      this.toastr.error('ALREADY DEPRECIATION RUN FOR THE ASSET.')
    }
    else if(result['code']=='INVALID_DATA'){
      this.toastr.error(result['description']);
    }
    else{
    this.toastr.success('success');
    }
  },
  (error:any)=>{
    console.log(error);
    // this.toastr.warning(error.status+error.statusText)
    this.spinner.hide();
  })
  this.depreciationform.reset()
  this.datearray.length = 0;

}

regularPrepare(){
  console.log(this.regform.value);
  if(this.regform.get('datecast').value ==undefined || this.regform.get('datecast').value =='' || this.regform.get('datecast').value ==null){
    this.toastr.warning('Please Select The Valid Date');
    return false;
  }
  let date_valid:any=this.regform.get('datecast').value;
  let year:any=date_valid.getFullYear();
  let month:any=date_valid.getMonth()+1;
  this.spinner.show();
  this.toastr.show('Wait for 7 Mins');
  this.Faservice.getDepreciationRegularPrepare(year,month).subscribe(result=>{
    console.log(result);
    setTimeout(() => {
      /** spinner ends after 3 seconds */
      this.spinner.hide();
      }, 3000);
      if (result.code !=undefined && result.code !=''){
        this.toastr.warning(result.code);
        this.toastr.warning(result.description);
      }
      else{
        alert('Success');
    this.downloadRegularFlag = false
      }
    
  },
  (error:any)=>{
    console.log(error);
    this.toastr.warning(error.status+error.statusText)
    this.spinner.hide();
  })
}
regularPrepare_q(){
  console.log(this.regform.value);
  if(this.regform.get('datecast').value ==undefined || this.regform.get('datecast').value =='' || this.regform.get('datecast').value ==null){
    this.toastr.warning('Please Select The Valid Date');
    return false;
  }
  let date_valid:any=this.regform.get('datecast').value;
  let year:any=date_valid.getFullYear();
  let month:any=date_valid.getMonth()+1;
  this.spinner.show();
  this.toastr.warning('Wait for 7 minutes','',{timeOut:420000,progressBar:true,progressAnimation:'decreasing'});
  this.Faservice.getDepreciationRegularPrepare_q(year,month,'Q').subscribe(result=>{
    console.log(result);
    setTimeout(() => {
      /** spinner ends after 3 seconds */
      this.spinner.hide();
      }, 3000);
      if (result.code !=undefined && result.code !=''){
        this.toastr.warning(result.code);
        this.toastr.warning(result.description);
      }
      else{
        alert('Success');
    
      }
    
  },
  (error:any)=>{
    console.log(error);
    this.toastr.warning(error.status+error.statusText)
    this.spinner.hide();
  })
}

forecastPrepare(){
  console.log(this.regform.value);
  if(this.regform.get('datecast').value ==undefined || this.regform.get('datecast').value =='' || this.regform.get('datecast').value ==null){
    this.toastr.warning('Please Select The Valid Date');
    return false;
  }
  let date_valid:any=this.regform.get('datecast').value;
  let year:any=date_valid.getFullYear();
  let month:any=date_valid.getMonth()+1;
  // this.idletime=0;
  // this.idletimeout.setIdle(1);
  // this.idletimeout.setTimeout(420);
  // this.idletimeout.setInterrupts(DEFAULT_INTERRUPTSOURCES);
  // this.idletimeout.onTimeoutWarning.subscribe((count)=>{
  //   console.log(count);
  //   this.idletime='('+count+')';
  //   this.toastr.warning('Please Wait',this.idletime+'Seconds',{timeOut:100});
  //   console.log(this.idletime);
  // });
  this.spinner.show();
  if(this.first==true){
    this.toastr.warning('Already Work In Progress Please Wait');
    return false;
  }
  console.log(this.idletime);
  this.toastr.warning('Wait for 7 minutes','',{timeOut:420000,progressBar:true,progressAnimation:'decreasing'});
  
  this.first=true;
  this.Faservice.getDepreciationForecastPrepare(year,month).subscribe(result=>{
    console.log(result);
    setTimeout(() => {
      /** spinner ends after 3 seconds */
      this.spinner.hide();
      }, 3000);
    alert('Success');
    
  },
  (error:any)=>{
    console.log(error);
    // this.toastr.warning(error.status+error.statusText)
    this.spinner.hide();
  });
  setTimeout(()=>{
    this.first=false;
    this.downloadForecastFlag = false;
    this.toastr.success('Excel Prepared Successfully','',{timeOut:5000});
  },420000);
  console.log('final Ececute');
}

tempDownload(){
  this.spinner.show();
  this.Faservice.getDepreciationTempForecastPrepare().subscribe(result=>{
    let binaryData = [];
    binaryData.push(result)
    let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    let link = document.createElement('a');
    link.href = downloadUrl;
    let date: Date = new Date();
    link.download = 'DetailedReport'+ date +".xlsx";
    link.click();
    this.toastr.success('Success');
    setTimeout(() => {
      /** spinner ends after 3 seconds */
      this.spinner.hide();
      }, 3000);
      },
      (error:any)=>{
        console.log(error);
        this.toastr.warning(error.status+error.statusText)
        this.spinner.hide();
      })}

tempRegularDownload(){
  this.spinner.show();
  this.Faservice.getDepreciationTempRegularPrepare().subscribe(result=>{
    let binaryData = [];
    binaryData.push(result)
    let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    let link = document.createElement('a');
    link.href = downloadUrl;
    let date: Date = new Date();
    link.download = 'RegularReport'+ date +".xlsx";
    link.click();
    this.toastr.success('Success');
    setTimeout(() => {
      /** spinner ends after 3 seconds */
      this.spinner.hide();
      }, 3000);
      },
      (error:any)=>{
        console.log(error);
        this.toastr.warning(error.status+error.statusText)
        this.spinner.hide();
      })}


forecastDownload(){
  this.Faservice.getDepreciationForecastDownload().subscribe(result=>{
    let binaryData = [];
    binaryData.push(result)
    let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    let link = document.createElement('a');
    link.href = downloadUrl;
    let date: Date = new Date();
    link.download = 'DetailedReport'+ date +".xlsx";
    link.click();
    this.toastr.success('Success');
  },
  (error:any)=>{
    console.log(error);
    this.toastr.warning(error.status+error.statusText)
    this.spinner.hide();
  })
}

regularDownload(){
  this.Faservice.getDepreciationRegularDownload().subscribe(result=>{
    let binaryData = [];
    binaryData.push(result)
    let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    let link = document.createElement('a');
    link.href = downloadUrl;
    let date: Date = new Date();
    link.download = 'RegularReport'+ date +".xlsx";
    link.click();
    this.toastr.success('Success');
  },
  (error:any)=>{
    console.log(error);
    this.toastr.warning(error.status+error.statusText)
    this.spinner.hide();
  })
}
regularDownload_q(){
  this.Faservice.getDepreciationRegularDownload_q("Q").subscribe(result=>{
    if(result.type=='application/json'){
      this.toastr.warning("INVALID DATA");
    }
    else{
      let binaryData = [];
      binaryData.push(result)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'RegularReport_Q_'+ date +".xlsx";
      link.click();
      this.toastr.success('Success');
    }
    
  },
  (error:any)=>{
    console.log(error);
    this.toastr.warning(error.status+error.statusText)
    this.spinner.hide();
  })
}
  movetoassetheaderhistory(){
    if(this.regform.get('regdate').value ==undefined || this.regform.get('regdate').value ==null || this.regform.get('regdate').value =='' || this.regform.get('regdate').value ==""){
      this.toastr.warning('Please Select The Valid date');
      return false;
    }
    let datetime_data=this.regform.get('regdate').value;
    let valid_data_move={
      'year':datetime_data.getFullYear(),
      'month':datetime_data.getMonth()+1
    };
    this.spinner.show();
    this.Faservice.assetheaderhistorymove(valid_data_move).subscribe(data=>{
      this.spinner.hide();
      let assetdata=data;
      if(assetdata.code !=undefined || assetdata.description ==''){
        this.toastr.warning(assetdata.code);
        this.toastr.warning(assetdata.description);
      }
      else{
        this.toastr.success(assetdata.status);
        this.toastr.success(assetdata.message);
      }
    },(error)=>{
      this.spinner.hide();
    });
}
querydatadownload(){
  this.toastr.warning('Wait for 7 minutes','',{timeOut:420000,progressBar:true,progressAnimation:'decreasing'});
  this.spinner.show();
  
  // this.firstQdep=false;
  // if(this.secondQdep==true){
  //   this.toastr.warning("Already Work InProgress..Please Wait");
  //   return false;
  // }
  this.Faservice.faquerydataforecastdownload().subscribe(result=>{
    // this.firstQdep=true;
    
    console.log(result);
    // this.spinner.hide();
   
  },
  (error:any)=>{
    this.spinner.hide();
    console.log(error);

    this.toastr.warning(error.status+error.statusText);
    this.spinner.hide();
  });
  setTimeout(()=>{
    this.spinner.hide();
    // this.query_enb=false;
    this.toastr.success('Success');
   },420000);
    
}
querydataforecastdownload(){
  this.spinner.show();
  
  if(this.secondQdep==true){
    this.toastr.warning("Already Work InProgress..Please Wait");
    return false;
  }
  this.secondQdep=true;
  this.firstQdep=false;
  this.Faservice.querydatadownloadall().subscribe(result=>{
    this.spinner.hide();
    this.firstQdep=true;
    this.secondQdep=false;
    let binaryData = [];
    binaryData.push(result);
    console.log(result['type'])
   
   if (result['type']=='application/json'){
    this.toastr.error('INVALID_DATA')
   }
   else{
    //   console.log(result)
    // console.log(JSON.parse(result))
    let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    let link = document.createElement('a');
    link.href = downloadUrl;
    let date: Date = new Date();
    link.download = 'FA-ForecastQueryData'+ date +".xlsx";
    link.click();
    
  }
    
  },
  (error:any)=>{
    this.spinner.hide();
    console.log(error);
    this.toastr.warning(error.status+error.statusText);
    this.spinner.hide();
  });
}
}