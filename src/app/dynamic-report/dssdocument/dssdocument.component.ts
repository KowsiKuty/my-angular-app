import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { default as _rollupMoment, Moment } from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PprService } from '../ppr.service';
import { DatePipe } from '@angular/common';
import * as _moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatFormFieldAppearance } from '@angular/material/form-field';

@Component({
  selector: 'app-dssdocument',
  templateUrl: './dssdocument.component.html',
  styleUrls: ['./dssdocument.component.scss'],
})

export class DssdocumentComponent implements OnInit {
  Document_form: FormGroup;
  hass_next: boolean;
  hass_previous: boolean;
  presentspage: any;
  summary_list: any;
  data_found: boolean;
  document_screen:boolean = true;
  mainscreen:boolean = false;

  constructor(private datePipe: DatePipe, private fb: FormBuilder, private dcsService: PprService, private spinnerService: NgxSpinnerService, private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.Document_form = this.fb.group({
      name: "",
    })
    this.document_search(this.Document_form)
  }

  document_search(summary, pageNumber = 1) {
    let name = summary.value.name ? summary.value.name : ''
    this.spinnerService.show()
    this.dcsService.doc_summary(name, pageNumber).subscribe(res => {
      this.spinnerService.hide()
      let data = res['data']
      let dataspagination = res["pagination"];
      this.summary_list = data
      if (this.summary_list.length >= 0) {
        this.hass_next = dataspagination.has_next;
        this.hass_previous = dataspagination.has_previous;
        this.presentspage = dataspagination.index;
        this.data_found = true
      }

    })
  }
  previousClick() {
    if (this.hass_previous === true) {
      this.document_search(this.Document_form, this.presentspage - 1);
    }
  }
  nextClick() {
    if (this.hass_next === true) {
      this.document_search(this.Document_form, this.presentspage + 1)
    }
  }

  back_to_mainscreen(){
    this.document_screen = false;
    this.mainscreen =  true;
  }

  view_download(temp){
    let name = temp.gen_filename
    let file_name = temp.file_name
   this.spinnerService.show()
   this.dcsService.document_per_download(name).subscribe((results: any) => {    
     this.spinnerService.hide()
     let binaryData = [];
     binaryData.push(results)   
     let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
     console.log(downloadUrl)
     let link = document.createElement('a');
     link.href = downloadUrl;
     link.download =file_name;
     link.click();
     this.toastr.success('Successfully Download');  
     })
  }
}
