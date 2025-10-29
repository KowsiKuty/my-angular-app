import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TbReportService } from '../tb-report.service';
import { DatePipe, formatDate } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ErrorhandlingService } from 'src/app/ppr/errorhandling.service';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';


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
  selector: 'app-tb-document',
  templateUrl: './tb-document.component.html',
  styleUrls: ['./tb-document.component.scss'],
  providers: [{ provide: DateAdapter, useClass:PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS ,},
      DatePipe],
})


export class TbDocumentComponent implements OnInit {
  tb_doc_data: any;
  data_found: boolean;
  has_next: boolean;
  has_previous: boolean;
  presentpage: number;
  aws_data: any;
  status_list=[
    {'name':'Started',"id":1},
    {"name":"Processing","id":2},
    {"name":"Success","id":4}
  ]
  search_val: { status: any; created_date: string; filename: any; };

  constructor(private formBuilder:FormBuilder,private service:TbReportService,public datepipe:DatePipe,private SpinnerService:NgxSpinnerService,private toastr:ToastrService ,private errorHandler:ErrorhandlingService) { }
  tb_doc_summary:FormGroup;
  ngOnInit(): void {
    this.tb_doc_summary=this.formBuilder.group({
      status:[''],
      create_date:[''],
      file_name:['']
    })
    this.tb_doc_search("")
  }


  tb_doc_search(form,pagenumber=1){
    let date=''
    if(this.tb_doc_summary.value.create_date!='' || this.tb_doc_summary.value.create_date!= undefined || this.tb_doc_summary.value.create_date!=null){
      date=this.datepipe.transform(this.tb_doc_summary.value.create_date,'yyyy-MM-dd')
    }
    this.search_val={
      status:this.tb_doc_summary.value.status?.id??"",
      created_date:date?date:"",
      filename:this.tb_doc_summary.value.file_name?this.tb_doc_summary.value.file_name:""
    }
    this.SpinnerService.show()
    this.service.tbdoc_summary( this.search_val,pagenumber).subscribe(results=>{
      this.SpinnerService.hide()
      console.log("results=>",results)
      let data=results['data']
      this.tb_doc_data=data
      let datapagination = results["pagination"];
      if(this.tb_doc_data.length == 0){
        this.data_found=false
        this.has_next = false;
        this.has_previous = false;
        this.presentpage = 1;
      }
  
      if (this.tb_doc_data.length >= 0) {
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
      this.tb_doc_search( this.search_val,this.presentpage - 1);
    }
  }
  nextClick() { 
    if (this.has_next === true) {
      this.tb_doc_search( this.search_val,this.presentpage + 1)
    }
  }

  clear_doc(){
   this.tb_doc_summary.reset()
   this.tb_doc_search("")
  }

  tb_doc_file(value){
    let fileName=value.file_name
     let filekey=value.gen_filename
  this.SpinnerService.show()
  this.service.tb_File_download(filekey).subscribe((results: any[]) => {    
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = fileName;
      link.click();
      this.toastr.success('Successfully Download');
  }, error => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })
  }
}
