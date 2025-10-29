import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PprService } from '../ppr.service';
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
  selector: 'app-ppr-exception',
  templateUrl: './ppr-exception.component.html',
  styleUrls: ['./ppr-exception.component.scss'],
  providers: [{ provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
      DatePipe]
})
export class PprExceptionComponent implements OnInit {
  exception:FormGroup;
  file_types=[
    {"id":1,"type":"Income"},
    {"id":2,"type":"Hr-Cost"},
    {"id":3,"type":"Expense"},
    {"id":6,"type":"DCS"},
    {"id":8,"type":"DCS Master"}
  ]
  has_next: boolean=false;
  has_previous: boolean=false;
  presentpage: number=1;
  summary_show: boolean=true;
  exception_data: any;
  exception_summary: any;
  empty:any=[]
  excep_data:any;
  exceptionsearch: { from_date: string; to_date: string; type: string; };
  month_ary=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  exception_id: any=[];
  exp_data=[{"id":2,"type":'Processing'},
            {"id":3,"type":"Closed"}]
  constructor(private toastr:ToastrService,public datepipe:DatePipe,private fromBuilder:FormBuilder,private Service:PprService,private spinnerservice:NgxSpinnerService) { }

  ngOnInit(): void {
    this.exception=this.fromBuilder.group({
      from_date:[''],
      to_date:[''],
      type:['']
    })
  }
  todate_fun(){
    this.exception.controls['to_date'].reset('')
  }
  exception_search(exception,exp_id,pageNumber=1){
    console.log("exception=>",exception)
    let exception_summary=exception
    let exceptiondata=exception
    if(exp_id.length==0){
     this.exception_id=[]
    }
    let fromdate=''
    let todate=''
    let type=''
    if(exceptiondata.from_date=='' || exceptiondata.from_date== undefined || exceptiondata.from_date==null){
      this.toastr.warning('','Please Choose From Date',{timeOut:1500});
      return false;  
    }else{
      fromdate=this.datepipe.transform(exceptiondata.from_date,'yyyy-MM-dd')
    }
    if(exceptiondata.to_date=='' || exceptiondata.to_date== undefined || exceptiondata.to_date==null){
      this.toastr.warning('','Please Choose To Date',{timeOut:1500});
      return false;
      todate=''
    }else{
      todate=this.datepipe.transform(exceptiondata.to_date,'yyyy-MM-dd')
    }
    if(exceptiondata.type == '' || exceptiondata.type== undefined || exceptiondata.type == null){
      this.toastr.warning('','Please Select The File Type',{timeOut:1500});
      return false;
      type=''
    }else{
      type=exceptiondata.type
    }
    this.exceptionsearch={
      from_date:fromdate,
      to_date:todate,
      type:type
    }
    this.spinnerservice.show()
    this.Service.exception_summary(this.exceptionsearch,pageNumber).subscribe(results=>{
      this.spinnerservice.hide()
      let data=results['data']
      this.exception_data=data
      
      let datapagination = results["pagination"];
      if(results['set_code']){
        this.has_next = false;
        this.has_previous = false;
        this.presentpage = 1;
        this.summary_show=true
        this.toastr.warning('',results['set_description'],{timeOut:1500})
        return false;
      }
      if(data.length > 0){
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.presentpage = datapagination.index;
        this.summary_show=false
        if(this.exception_id.length==0){
          this.exception_data.forEach(x=>x['select']=false)
        }else{
          this.exception_id.forEach(e=>{
            this.exception_data.forEach(y=>{
              console.log('y.branch_code=>',y.branch_code)
              if(e==y.id){
                y['select']=true
              }
            })
          })
        }
        console.log("exception_data=>",this.exception_data)
      }

    },error=>{
      this.spinnerservice.hide()
    })
  }
  previousClick() {
    if (this.has_previous === true) {
      this.exception_search(this.exception.value,this.exception_id,this.presentpage - 1);
    }
  }
  nextClick() { 
    if (this.has_next === true) {
      this.exception_search(this.exception.value,this.exception_id,this.presentpage + 1)
    }
  }
  clear_exception(){
    this.exception.reset('')
  }
  exception_download(){
    let exp_download=this.exception.value
    let fromdate=''
    let todate=''
    let type=''
    if(exp_download.from_date=='' || exp_download.from_date== undefined || exp_download.from_date==null){
      this.toastr.warning('','Please Choose From Date',{timeOut:1500});
      return false;  
    }else{
      fromdate=this.datepipe.transform(exp_download.from_date,'yyyy-MM-dd')
    }
    if(exp_download.to_date=='' || exp_download.to_date== undefined || exp_download.to_date==null){
      this.toastr.warning('','Please Choose To Date',{timeOut:1500});
      return false;
      todate=''
    }else{
      todate=this.datepipe.transform(exp_download.to_date,'yyyy-MM-dd')
    }
    if(exp_download.type == '' || exp_download.type== undefined || exp_download.type == null){
      this.toastr.warning('','Please Select The File Type',{timeOut:1500});
      return false;
      type=''
    }else{
      type=exp_download.type
    }
    let exception_down={
      from_date:fromdate,
      to_date:todate,
      type:type
    }
    this.spinnerservice.show()
    this.Service.exception_downloade(exception_down).subscribe(res=>{
      this.spinnerservice.hide()
      let binaryData = [];
      binaryData.push(res)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'PPR Exception'+".xlsx";
      link.click();
      this.toastr.success('Successfully Download');
    },error=>{
      this.spinnerservice.hide()
    })
  }
  exception_select(exp_select,e){
    console.log("event=>",e)
    let paticular_val=exp_select
    if(e.checked==true){
    console.log("select=>",paticular_val)
    this.exception_id.push(paticular_val.id)
    console.log("exception_id=>",this.exception_id)
    }
    if(e.checked==false){
      this.exception_id = this.exception_id.filter(item => item !== paticular_val.id);
    }
  }
  exception_handling(){
    let status=this.excep_data
    let exp=this.exception_id
    console.log("exception_id=>",this.exception_id)
    console.log("exp=>",exp)
    if(exp.length==0){
      this.toastr.warning('','Please Select Any checkbox ',{timeOut:1500});
      return false;
    }
    if(this.excep_data == null || this.excep_data ==undefined || this.excep_data == '' ){
      this.toastr.warning('','please Chooese The Select ',{timeOut:1500})
      return false;
    }
    this.spinnerservice.show()
    this.Service.exception_heading(exp,status).subscribe(res=>{
      this.spinnerservice.hide()
      if(res['status']){
        this.toastr.success('',res['message'],{timeOut:1500})
        // this.exception.reset('')
        this.excep_data=''
        this.exception_id=[]
        this.exception_search(this.exception.value,this.empty)
      }
    },error=>{
      this.spinnerservice.hide()
    })
  }
}
