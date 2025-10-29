import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { data } from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DssService } from '../dss.service';
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
  selector: 'app-dss-exception',
  templateUrl: './dss-exception.component.html',
  styleUrls: ['./dss-exception.component.scss'],
  providers:[ { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe]
})
export class DssExceptionComponent implements OnInit {
  dssexception:FormGroup
  exp_data: any;
  select_id: any=[];
  downloadUrl: string;
  show_button: boolean=true;
  search_value: any;
  date: any;
  Excepition_table_hide:boolean=false;
  constructor(private formbuilder:FormBuilder,private datePipe:DatePipe,private dss_service:DssService,private spinnerservice:NgxSpinnerService,private toastr:ToastrService) { }

  ngOnInit(): void {
    this.dssexception=this.formbuilder.group({
      excep_date:''
    })
  }
  dss_exception_summary(excep){
    this.select_id=[]
    if(excep == null || excep == "" || excep == undefined ){
      this.date= this.search_value

    } else {
      this.date=excep?.excep_date?? excep ;
    }
    console.log("Date === >",this.date)
    // let date=excep.excep_date
    this.search_value=this.date
    if(this.date==null || this.date == undefined || this.date == ''){
      this.toastr.warning('','Please Select The Date',{timeOut:1500});
      return false;
    }
    this.Excepition_table_hide=true;
    let date_tran=this.datePipe.transform(this.date,'yyyy-MM-dd')
    console.log("date=>",this.date)
    console.log("date_tran=>",date_tran)
    this.dss_service.get_dss_exception(date_tran).subscribe(res=>{
      console.log('res=>',res['data'])
      this.exp_data=res['data']
      if(this.exp_data.length==0){
        this.show_button=true
      }else{
        this.show_button=false
      }

    })
  }
  dss_exception_download(excep){
    let date=excep.excep_date
    if(date==null || date == undefined || date == ''){
      this.toastr.warning('','Please Select The Date',{timeOut:1500});
      return false;
    }
    let date_tran=this.datePipe.transform(date,'yyyy-MM-dd')    
    this.dss_service.dss_exception_download(date_tran).subscribe(data=>{
    let binaryData = [];
    binaryData.push(data)
    console.log("binarydata=>",binaryData)
    console.log("data=>",data)
    console.log("new Blob(binaryData)=>",new Blob(binaryData))
    let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    let link = document.createElement('a');
    link.href = downloadUrl;
    link.download = "Dss Exception.xlsx"
    link.click();  
    })
  }

  edit_excep_data(event,dss_excep){
    console.log(event)
    console.log("dss_excep=>",dss_excep)
    console.log("event.checked=>",event.checked)
    if(event.checked==true){
      console.log('true')
      this.select_id.push(dss_excep.id)
    }if(event.checked==false){
      console.log("false")
      let indvalue=this.select_id.findIndex(x=>x==dss_excep.id)
      this.select_id.splice(indvalue,1)
      console.log("select_id=>",this.select_id)
    }
    console.log("select_id=>",this.select_id)
  }
  dss_exception_edit(){
    let status=0;
    let id=this.select_id
    this.dss_service.dss_status_update(id,status).subscribe(res=>{
      if(res.status){
        this.toastr.success('',res.message,{timeOut:1500});
        this.dss_exception_summary(this.search_value)
        console.log(res)
      }
    })
  }
  dss_exception_clear(){
    this.dssexception.reset()
    this.Excepition_table_hide=false;
  }
}
