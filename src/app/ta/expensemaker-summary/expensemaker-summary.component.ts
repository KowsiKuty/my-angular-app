import { Component, OnInit,HostListener } from '@angular/core';
import {TaService} from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import {ActivatedRoute, Router} from "@angular/router";
import{ShareService} from 'src/app/ta/share.service';
import { FormGroup,FormControl, FormBuilder } from '@angular/forms';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
export const PICK_FORMATS = {
  parse: {dateInput: {month: 'short', year: 'numeric', day: 'numeric'}},
  display: {
      dateInput: 'input',
      monthYearLabel: {year: 'numeric', month: 'short'},
      dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
      monthYearA11yLabel: {year: 'numeric', month: 'long'}
  }
};
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
      if (displayFormat === 'input') {
          return formatDate(date,'dd-MMM-yyyy',this.locale);
      } else {
          return date.toDateString();
      }
  }
}

@Component({
  selector: 'app-expensemaker-summary',
  templateUrl: './expensemaker-summary.component.html',
  styleUrls: ['./expensemaker-summary.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
    DatePipe
]
})
export class ExpensemakerSummaryComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.SpinnerService.hide();
    }
  }
  has_next=true;
  has_previous=true;
  getexpenceList:any
  tourexpencesummarypage:number=1;
  pagesize=10;
  memoSearchForm:FormGroup;
  expensemakersearch:any
  currentDate: any = new Date();
  // date = new Date().toLocaleDateString();
  defaultDate = new FormControl(new Date());
  latest:any
  today = new Date();
  date:any;
  value: any;
  currentpage: number = 1;
  presentpage: number = 1;
  onbehalfname: any;
  onbehalfempid: any;
  creatable: boolean;
  tour: any;
  isTourMakerpage: boolean;
  select: Date;
  send_value:any=""

  constructor(private  taService:TaService,private sharedService:SharedService,
    private route: ActivatedRoute,private router: Router,private notification: NotificationService, private SpinnerService:NgxSpinnerService,
    private shareservice:ShareService,private sharedservice:SharedService,private datePipe: DatePipe,private fb:FormBuilder) { }

    ngOnInit(): void {
      let values:any =this.shareservice.radiovalue.value
      if (values === ''){
        this.value = null
      }
      else if (values === 0){
        this.value=0
      }
      else if(values === 1){
        this.value = 1
      }
      else if (values === "1"){
        this.value = 1
      }
    
      this.memoSearchForm = this.fb.group({
        tourno:[''],
        requestdate:[''],
      })
      let datas: any = this.shareservice.fetchData.value;
      if(datas){
        this.onbehalfname=datas.employee_name
        this.onbehalfempid =datas.employeegid
      }
      this.gettourmakersummary(this.send_value,this.currentpage,this.pagesize)
    }
    tourno(e){
      this.tour = e.target.value
      console.log("this.tour",this.tour)
    }
    fromDateSelection(event: string) {
      let latest= event
      this.date =this.datePipe.transform(latest, 'dd-MMM-yyyy');
      console.log("this.date", this.date)
      console.log("fromdate", event)
      const date = new Date(event)
      this.select = new Date(date. getFullYear(), date.getMonth(), date.getDate() )
    }
   
  gettourmakersummary(val,
    pageNumber,pageSize) {
      this.SpinnerService.show();
    if(this.value === 1){
    this.taService.getexpenceSummary(pageNumber,val)
      .subscribe((results: any[]) => {
        
        this.creatable = false;
        this.SpinnerService.hide();
        
        let datas = results["data"];
        this.getexpenceList = datas;
        let datapagination = results["pagination"];
        this.getexpenceList = datas;
        if (this.getexpenceList.length === 0) {
          this.isTourMakerpage = false
        }
        if (this.getexpenceList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
          this.isTourMakerpage = true
        }
      })
    }
    else if (this.value === 0){
      this.taService.getexpenceSummarylist(val, pageNumber,this.onbehalfempid)
      .subscribe((results: any[]) => {
      // console.log("Tourmakerresult",results)
      this.creatable = false;
      this.SpinnerService.hide();
      
      let datas = results['data'];
      this.getexpenceList = datas;
      })
    }
    else{
      return false;
    }
  }
  TourmakernextClick() {
    if (this.has_next === true) {
      this.gettourmakersummary(this.send_value,this.currentpage + 1,this.pagesize)
    }
  }
  TourmakerpreviousClick() {
    if (this.has_previous === true) {
      this.gettourmakersummary(this.send_value,this.currentpage - 1,this.pagesize)
    }
  }
  expenceEdit(data){
    // let startdate = new Date(data.startdate)
    if(!data.is_tour_started){
      this.notification.showError("Tour Date Not Started.")
      return false;
    }
    if (this.value == 1){
      delete data.onbehalfof
    }
    this.shareservice.expensesummaryData.next(data)
    var datas = JSON.stringify(Object.assign({}, data));
    
    localStorage.setItem("expense_details",datas) 
    this.router.navigateByUrl('ta/exedit');
  
  }
  searchClick(){
  }
    tourMakerSearch(){
      let form_value = this.memoSearchForm.value;
      this.send_value = ""
      if(form_value.tourno)
      {
        this.send_value=this.send_value+"&tour_no="+form_value.tourno
      }
      if(form_value.requestdate)
      {
        let date=this.datePipe.transform(form_value.requestdate,"dd-MMM-yyyy");
        this.send_value=this.send_value+"&request_date="+date
      }
      this.gettourmakersummary(this.send_value,1,this.pagesize)
    }
    reset(){
      this.send_value=""
      this.memoSearchForm = this.fb.group({
        tourno:[''],
        requestdate:[''],
      })
      this.gettourmakersummary(this.send_value,1,this.pagesize)
    }

    // onKeyDown(event: KeyboardEvent) {
    //   if (event.keyCode !== 8 && event.keyCode !== 13 && (event.keyCode < 48 || event.keyCode > 57)) {
    //     event.preventDefault();
    //   }
    // }
    onKeyDown(event:any){ 
    let d: any = new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?a-zA-Z]/);
      console.log(d.test(event.key));
      // if (event.key === "Backspace" || event.key === 'Tab') {
      //   return true; 
      // }
      if (d.test(event.key) == true) {
        return false;
      }
      return true;
    }
    

}

