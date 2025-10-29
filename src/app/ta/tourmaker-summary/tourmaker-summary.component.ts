import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {TaService} from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import {ShareService} from '../share.service'
import {ActivatedRoute, Router} from "@angular/router";
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import {AfterViewInit,  ElementRef,  ViewChild} from '@angular/core';
import {merge, fromEvent, Observable} from "rxjs";
import { DataService } from '../../service/data.service';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import {map, startWith, finalize, switchMap, debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatAutocompleteSelectedEvent,  MatAutocomplete} from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
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
  selector: 'app-tourmaker-summary',
  templateUrl: './tourmaker-summary.component.html',
  styleUrls: ['./tourmaker-summary.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
    DatePipe
]
})
export class TourmakerSummaryComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  istaAddForm:boolean
  isTA:boolean
  istaViewForm:boolean
  istaapprove:boolean
  istaadvancemaker:boolean
  istaadvanceForm:boolean
  istaadvanceeditForm:boolean
  isadvanceapprove:boolean
  isadvanceviewForm:boolean
  isexpencemaker:boolean
  isexpenceviewForm:boolean
  isexpenceapprover:boolean
  isexpenceapproveviewForm:boolean
  istaEditForm:boolean
  getTourmakerList:any
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  toursummarypage:number=1;
  istourSummaryPagination :boolean;
  pagesize = 10;
  touradvancesummarypage:number=1;
  getTouradvanceList:any
  gettourapproveList:any
  tourapprovesummarypage:number=1;
  getTouradvanceapproveList:any
  touradvanceappsummarypage:number=1;
  landlordViewId:any
  overallre:any
  page =1
  summ:any
  memoSearchForm : FormGroup;
  data:any
  onbehalfname:any
  onbehalfempid:any
  value:any
  tourmaker = '/tourmaker'
  tour: any;
  date: any;
  tourmodell: any;
  select: Date;
  isTourMakerpage: boolean = true;
  creatable: boolean = true;
  constructor(private taService:TaService,private sharedService:SharedService,
    private route: ActivatedRoute,private datePipe: DatePipe,private shareservice:ShareService,private fb:FormBuilder,
    private router: Router, private SpinnerService: NgxSpinnerService
    )  { }
  ngOnInit(): void {
    let values:any =this.shareservice.radiovalue.value
    if (values === ''){
      this.value = null;
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
      tourno: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      requestdate:[''],
    })
    let datas: any = this.shareservice.fetchData.value;
    if(datas && this.value == 0){
      this.onbehalfname=datas.employee_name
      this.onbehalfempid =datas.employeegid
    }
  
    const heroId = this.route.snapshot.paramMap.get('id');
    this.gettourmakersummary(this.send_value,this.currentpage,this.pagesize)
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
  this.taService.getTourMakerSummary(val,pageNumber)
    .subscribe((results: any[]) => {
    
      localStorage.removeItem('tourmakersummary');
      this.SpinnerService.hide();
      this.creatable = false;
      this.shareservice.radiovalue.next(null)
      let datas = results["data"];
      this.getTourmakerList = datas;
      let datapagination = results["pagination"];
      this.getTourmakerList = datas;
      if (this.getTourmakerList.length === 0) {
        this.isTourMakerpage = false
      }
      if (this.getTourmakerList.length > 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.currentpage = datapagination.index;
        this.isTourMakerpage = true
      }
    })
  }
  else if (this.value === 0){
    this.taService.getTourmakeronbehalfSummary(pageNumber, pageSize,this.onbehalfempid)
    .subscribe((results: any[]) => {
      this.SpinnerService.hide();
    // console.log("Tourmakerresult",results)
    this.creatable = false;
    this.shareservice.radiovalue.next(null)
    let datas = results['data'];
    this.getTourmakerList = datas;
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
  tourEdit(data){
    let onbehalf = {
      'onbename': this.onbehalfname,
      'onbeid':this.onbehalfempid
    }
    var datass = JSON.stringify(Object.assign({}, onbehalf));
      localStorage.setItem('onbehalf',datass)
   
    var datas = JSON.stringify(Object.assign({}, data));
    localStorage.setItem('tourmakersummary',datas)
    // this.sharedService.summaryData.next(data)
    this.router.navigateByUrl('ta/tourmaker');
    
  }
  createtour(){
    this.data = {id:0,onbehalf:this.onbehalfempid,name:this.onbehalfname}
    var datas = JSON.stringify(Object.assign({}, this.data));
    localStorage.setItem('tourmakersummary',datas)
    this.router.navigateByUrl('ta/tourmaker');
  }
  searchClick(){
  }
  send_value:String=""
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
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }
  
  
}