import { DatePipe, formatDate } from '@angular/common';
import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PprService } from '../ppr.service';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';


@Component({
  selector: 'app-Template-Summary',
  templateUrl: './Template-Summary.component.html',
  styleUrls: ['./Template-Summary.component.scss'],
})
export class TemplateSummaryComponent implements OnInit {
  temp_summary: FormGroup;
  temp_data: any;
  has_next: any;
  has_previous: any;
  presentpage: any;
  data_found: boolean;
  temp_screen: boolean = true;
  main_screen: boolean = false;
  template_viewscreen: boolean = false;
  // tablecolumnlist: any;
  tabledata: any;
  has_next_view: any;
  has_previous_view: any;
  presentpage_view: any;
  data_found_view: boolean;
  popupOpen: boolean = false;
  query_temp:any;
  tempquery_name: any;
  constructor(private formBuilder:FormBuilder,private service:PprService,public datepipe:DatePipe,private SpinnerService:NgxSpinnerService,private toastr:ToastrService) {   }



 

  ngOnInit(): void {
    this.temp_summary=this.formBuilder.group({
      Name:''
    })
    this.aws_search(this.temp_summary)
  }
    



  aws_search(aws,pagenumber=1){
    let name = aws.value.Name ? aws.value.Name :''
    this.SpinnerService.show()
    this.service.temp_summari_api(name,pagenumber).subscribe(results=>{
      this.SpinnerService.hide()
      console.log("results=>",results)
      let data=results['data']
      this.temp_data=data
      let datapagination = results["pagination"];
  
      if (this.temp_data.length >= 0) {
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
      this.aws_search(this.temp_summary,this.presentpage - 1);
    }
  }
  nextClick() { 
    if (this.has_next === true) {
      this.aws_search(this.temp_summary,this.presentpage + 1)
    }
  }

  back_to_sqlscreen(){
    this.temp_screen = false;
    this.main_screen = true;
    this.template_viewscreen = false
    this.tablecolumnlist = []
  }

  back_to_temp(){
    this.temp_screen = true;
    this.main_screen = false;
    this.template_viewscreen = false
    this.tablecolumnlist = []
    this.aws_search(this.temp_summary)
  }

  // query_screen
  tablecolumnlist :any[]= []
  view_query(id,name){
    this.tempquery_name = name
    this.SpinnerService.show()
    this.service.temp_query_view(id).subscribe(results=>{
      this.SpinnerService.hide()
      let data=results['data']
      let datas=results['columns']
      this.tablecolumnlist = datas
      this.tabledata = []
      this.template_viewscreen = true;
      this.temp_screen = false;

      this.tabledata=data;
      let datapagination = results["pagination"];
    
        // if (this.tabledata.length >= 0) {
        //   this.has_next_view = datapagination.has_next;
        //   this.has_previous_view = datapagination.has_previous;
        //   this.presentpage_view = datapagination.index;
        //   this.data_found_view=true
        // } 

      // if(!datas && !datas){
      //   this.toastr.error("",results['message'])
      //   return false
      // }

    },error=>{
      this.SpinnerService.hide()
    })
  }
  previousClick_view() {
    if (this.has_previous === true) {
      this.aws_search(this.temp_summary,this.presentpage - 1);
    }
  }
  nextClick_view() { 
    if (this.has_next === true) {
      this.aws_search(this.temp_summary,this.presentpage + 1)
    }
  }

  view_download(temp){
    let filetype = temp.name
    let id = temp.id
   this.SpinnerService.show()
   this.service.temp_query_download(id).subscribe((results: any) => {    
     this.SpinnerService.hide()
     this.toastr.success('Successfully Triggered');  
     })
  }

  view_popup(query){
    this.popupOpen = true;
    // this.query_temp = query
    this.getFormattedQuery(query)
  }
  closePopup(){
    this.popupOpen = false;
  }

  formattedQuery: { text: string; class: string }[] = [];

  getFormattedQuery(query: string): void {
    const keywordPattern = /\b(SELECT|FROM|WHERE|INNER|JOIN|OUTER|LEFT|RIGHT|ORDER|BY|GROUP|INNER JOIN|OUTER JOIN|LEFT JOIN|RIGHT JOIN|ORDER BY|GROUP BY|HAVING|LIMIT|AS|COUNT|SUM|AVG|MIN|MAX|ON|CROSS|FULL|RIGHT|LEFT)\b/i;
    const operatorPattern = /\b(=|>|<|>=|<=|!=|IN|AND|OR|LIKE|IS NULL|IS NOT NULL|NOT IN|NOT|IS|NULL|EXISTS|NOT EXISTS|NOT BETWEEN|NOT LIKE|BETWEEN)\b/i;
    const identifierPattern = /(`\w+`)/;
    const numberPattern = /\b\d+\b/;
    const punctuationPattern = /([\(\),.])/;

    this.formattedQuery = [];

    let tokens = query.split(/\s+/);
    tokens.forEach(token => {
        let tokenClass = '';

        if (token.match(keywordPattern)) tokenClass = 'token keyword';
        else if (token.match(operatorPattern)) tokenClass = 'token keyword';
        else if (token.match(identifierPattern)) tokenClass = 'token identifier';
        else if (token.match(numberPattern)) tokenClass = 'token number';
        else if (token.match(punctuationPattern)) tokenClass = 'token punctuation';
        else tokenClass = 'normal word';

        this.formattedQuery.push({ text: token, class: tokenClass });
    });
    
}

}