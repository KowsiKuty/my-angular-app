import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { ErrorhandlingService } from 'src/app/ppr/errorhandling.service';
import { FrsServiceService } from '../frs-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
export interface frs{
  name:string,
  id:number
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
  selector: 'app-frs-document',
  templateUrl: './frs-document.component.html',
  styleUrls: ['./frs-document.component.scss']
})
export class FrsDocumentComponent implements OnInit {
  has_next: boolean=false;
  has_previous: boolean=false;
  presentpage: any=1;
  frs_search_val: any;
  data_found: boolean=true;
  file_info: any;
  @ViewChild('closepop') close_file :any;
  frs_data: any;
  constructor(private errorHandler:ErrorhandlingService,private fb:FormBuilder,private service:FrsServiceService,public datepipe:DatePipe,private SpinnerService:NgxSpinnerService,private toastr:ToastrService) { }

  frs_document:FormGroup;
  ngOnInit(): void {
    this.frs_document=this.fb.group({
      status:[''],
      file_name:[''],
      create_date:['']
    })
    this.frs_search('')
  }
  status_list=[
    {"name":"Processing","id":2},
    {"name":"Success","id":3}
  ]



  frs_search(search_value,pagenumber=1){
    let date=''
    if(search_value.create_date!='' || search_value.create_date!= undefined || search_value.create_date!=null){
      date=this.datepipe.transform(search_value.create_date,'yyyy-MM-dd')
    }
    this.frs_search_val=search_value
    let search_val={
      status:search_value?.status?.id,
      filename:search_value?.file_name,
      created_date:date
    }
    for(let val in search_val){
      if (search_val[val] === null || search_val[val] === "" || search_val[val] === undefined) {
        search_val[val]=''
      }
    }
 
    this.SpinnerService.show()
    this.service.frs_search(search_val,pagenumber).subscribe(results=>{
      this.SpinnerService.hide()
      console.log("results=>",results)
      let data=results['data']
      this.frs_data=data
      let datapagination = results["pagination"];
      if(results['set_code']){
        this.data_found=false
        this.has_next = false;
        this.has_previous = false;
        this.presentpage = 1;
        this.toastr.warning('',results['set_description'],{timeOut:1500})
        return false;
      }
  
      if (this.frs_data.length >= 0) {
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
      this.frs_search(this.frs_search_val,this.presentpage - 1);
    }
  }
  nextClick() { 
    if (this.has_next === true) {
      this.frs_search(this.frs_search_val,this.presentpage + 1)
    }
  }
  public displayStatus(aws_name?: frs): string | undefined {
    return aws_name ? aws_name.name : undefined;
  }
  frs_file(aws){
    console.log(aws)
    let fileName='NII Transaction'
    let filekey=aws.gen_filename
  this.SpinnerService.show()
  this.service.frsreport(filekey).subscribe((results: any[]) => {
    
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = fileName+".xlsx";
      link.click();
      this.toastr.success('Successfully Download');
  }, error => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })
  }



  clear_aws(){
    this.frs_document.reset()
    this.frs_search("")
  }
}
