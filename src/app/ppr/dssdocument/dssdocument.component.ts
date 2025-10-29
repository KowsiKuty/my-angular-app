import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule,FormBuilder} from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {default as _rollupMoment, Moment} from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PprService } from '../ppr.service';
import { DatePipe } from '@angular/common';
import * as _moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';


const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MMM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};
export class DatepickerViewsSelectionExample {
  date = new FormControl(moment()); 
}


@Component({
  selector: 'app-dssdocument',
  templateUrl: './dssdocument.component.html',
  styleUrls: ['./dssdocument.component.scss'],
  providers:[
    { provide: MAT_DATE_FORMATS, useValue: { display: { monthYear: 'MMM, YYYY' } } },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    DatePipe
  ],
  encapsulation: ViewEncapsulation.None,

})

export class DssdocumentComponent implements OnInit {
  @ViewChildren('fileInput') fileInput: QueryList<ElementRef>
  @ViewChild('closepop') close_file :any;
  @ViewChild('create_date') create_date:any;
  selectedMonth: Date;
  maxDate: string;
  dcs_document:FormGroup;
  file: null;
  fileName: string;
  dcs_Sum: any;
  summary_list: any;
  hass_next: any;
  hass_previous: any;
  presentspage: any;
  data_found: boolean;
  file_info: string | Blob;
  defaultDate: Date;
  sum: any;
  filedate: string;
  monthdate: string;
  monthNumber: number;
  year: number;
  formattedDate: string;
  type: any;
  status_value: number;
  status_data: any;
  constructor(private datePipe: DatePipe,private fb: FormBuilder, private dcsService: PprService,private spinnerService: NgxSpinnerService,private toastr: ToastrService,) {
    const today = new Date(this.year, this.monthNumber - 1);
    // this.formattedDate = this.datePipe.transform(today, 'MM-yyyy');
    this.defaultDate = new Date(today.getFullYear(), today.getMonth(), 1);
    
   }

  ngOnInit(): void {
this.dcs_document = this.fb.group({
  date:'',
  name:"",
  file:'',
  fulldate:'',
  file_type:'',
  Status:'',
})
 this.dcs_summary('')
  }
  file_types=[
    {"id":40,"type":"Upload File"},
    {"id":35,"type":"DCS File"},   
  ]
  active_types=[
    {"id":0,"type":"InActive"},
    {"id":1,"type":"Active"},   
  ]

  dcs_summary(summary,pageNumber=1){
 this.dcs_Sum = summary
    this.sum = summary.date 
     this.type= summary.file_type
     this.status_data =summary.Status
     console.log("status_value",this.status_data)
     let date = this.datePipe.transform(this.dcs_document.value.fulldate, 'yyyy-MM-dd')
     console.log("this.type",this.type) 
    let  summary_data ={
      'filename':this.dcs_document.value.name?this.dcs_document.value.name:"",
      'created_date':date !=null ? date :"",
      'status': this.status_data !=null  ? this.status_data :'',
      "type":this.type ? this.type : 35
    }
    console.log("sum", summary.date)
    console.log("data_id_values", summary_data )

    this.spinnerService.show()
    this.dcsService.dcs_summary(summary_data,pageNumber).subscribe(res=>{
      this.spinnerService.hide()
      // this.toastr.success('','Successfully ',{timeOut:1500});
      let data=res['data']
      let dataspagination = res["pagination"];
      this.summary_list=data      
      // console.log("this.incomedetails_id",this.incomedetails_id)
      console.log("this.histry_list",this.summary_list)   
      if(res['set_code']){
        this.data_found=false
        this.hass_next = false;
        this.hass_previous = false;
        this.presentspage = 1;
        this.toastr.warning('',res['set_description'],{timeOut:1500})
        return false;
      }
  
      if (this.summary_list.length >= 0) {
        this.hass_next = dataspagination.has_next;
        this.hass_previous = dataspagination.has_previous;
        this.presentspage = dataspagination.index;
        this.data_found=true
      }
         
    })
  }
  previousClick() {
    if (this.hass_previous === true) {
      this.dcs_summary(this.dcs_Sum,this.presentspage - 1);
    }
  }
  nextClick() { 
    if (this.hass_next === true) {
      this.dcs_summary(this.dcs_Sum,this.presentspage + 1)
    }
  }
  
  chosen_MonthHandler(event,dp:MatDatepicker<Moment>,date){
    // this.dcs_document.controls['client_todate'].reset('');
    // this.todate_change.value=""
    this.maxDate=event
    let date_value=this.datePipe.transform(new Date(event), 'MM-yyyy')   
    this.dcs_document.get('date').patchValue(date_value)
    date.value=date_value
    console.log("let date_value=this.datePipe.transform(new Date(event), 'MMM-yyyy')  ",date_value)
    console.log("date=>",event, this.dcs_document)
    dp.close()
    this.dcs_document.controls.date.setErrors(null)   
  }
 
  file_data = [];
  files(e){
      
    for (var i = 0; i < e.target.files.length; i++) {
          this.file_data.push(e.target.files[i])
      }
       console.log("file data ", this.file_data)
    } 
    removeFile() {
      this.file_data = null;
      this.fileName = '';
    }
    dcs_submit(){
     if( this.file_data.length==0){
      this.toastr.warning("", "plese select File")
      return false;
     }
     console.log("this.dcs_document.value.file",this.dcs_document.value.file)
     if( this.dcs_document.value.fulldate == "" || this.dcs_document.value.fulldate == null || this.dcs_document.value.fulldate == undefined){
      this.toastr.warning("", "plese select date")
      return false;
     }
     console.log("this.dcs_document.value.date",this.dcs_document.value.fulldate)      
      let value_date=this.dcs_document.value.fulldate
      console.log("this.dcs_document",value_date)      
      // date=this.datepipe.transform(aws.create_date,'MMM-yyyy')
      this.filedate=this.datePipe.transform(value_date, 'yyyy-MM-dd')
      console.log("this.dcs_document",this.filedate)
    let   params= {
      "date":this.filedate,
      
    }
      this.dcsService.dcs_submit(params,this.file_data).subscribe((results) => {
        if(results.set_description == "success"){
          this.toastr.success('',results.set_description ,{timeOut:1500})
        }else{
          this.toastr.warning('',results.set_description ,{timeOut:1500})
        }
        let data = results["data"];
        // this.payment_lists = data;      
      }); 
      this.dcs_document.reset()
      this.file_data=[]

    }
    documents(hg){
   let filetype = hg.gen_filename
   console.log("filetype",filetype)
  this.spinnerService.show()
  this.dcsService.pprreport(filetype).subscribe((results: any) => {    
    this.spinnerService.hide()
    let binaryData = [];
    binaryData.push(results)   
    console.log("binaryData",binaryData)
    let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    console.log(downloadUrl)
    let link = document.createElement('a');
    link.href = downloadUrl;
    // let date: Date = new Date();
    link.download =filetype+".xlsx";
    link.click();
    this.toastr.success('Successfully Download');  

    })
  }
    dcs_process(){
      if( this.dcs_document.value.date == "" || this.dcs_document.value.date == null || this.dcs_document.value.date == undefined){
        this.toastr.warning("", "plese select Month")
        return false;
       }
       let month_date =this.dcs_document.value.date          
       console.log("this.dcs_document.value.datedgfjhhj",this.dcs_document.value.date)       
       console.log("this.monthdate",month_date)
      let   params= {
        "date":month_date
      }
      console.log("params",params)
        this.dcsService.dcs_document(params).subscribe((results) => {
          if(results.message == "Rawsheet Filestarts"){
            this.toastr.success('',results.message,{timeOut:1500})
          }else{
            this.toastr.warning('',results.message,{timeOut:1500})
          }
          // this.payment_lists = data;  {"date":"06-2023"}    
        });
        this.dcs_document.reset()
    }
    dcs_file_upload(awt){
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
      this.spinnerService.show()
      this.dcsService.awt_file(type,term,formData).subscribe(results=>{
        this.spinnerService.hide()
        let data=results['data']
        this.close_file.nativeElement.click();
        this.toastr.success('','File Upload Successfully',{timeOut:1500})
        this.dcs_document.reset('')
        this.dcs_summary(this.dcs_document.value)
      },error=>{
        this.dcs_document.reset('')
        this.close_file.nativeElement.click();  
        this.spinnerService.hide()
      })
    }
    delete_document(document){
      let datass = document.id
console.log("rtfg",datass)
let status = document.status
console.log("status", status)
let active = document.type
if(active == 40){
  if(status==1){
    this.status_value=0
  }
  if(status==0){
    this.status_value=1
  }
}else{
  this.status_value=0
}
console.log("delete_values",document.incomedetails)
this.spinnerService.show()
this.dcsService.delete_document(datass,this.status_value).subscribe(results=>{
  this.spinnerService.hide()
  let data=results
  if(results.message == "Successfully Deleted"){
  this.toastr.success("",results.message,{timeOut: 1500})
  }else{
  this.toastr.warning("",results.description,{timeOut: 1500})
  }
  console.log("data", data)  
  
})
this.dcs_summary('')
    }
    dcs_reset(){
      this.dcs_document.reset()
    }
}
