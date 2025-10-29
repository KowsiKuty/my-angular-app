import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../notification.service';
import { TaService } from '../ta.service';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
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
  selector: 'app-holiday-master',
  templateUrl: './holiday-master.component.html',
  styleUrls: ['./holiday-master.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
    DatePipe
]
})
export class HolidayMasterComponent implements OnInit {

  @ViewChild('holidayeditclose') holidayeditclose;
  @ViewChild('holidayaddclose') holidayaddclose;
  @ViewChild('holidayinput') holidayinput: any;
  @ViewChild('closefilepopup') closefilepopup;

  holidaysummary: any;
  holidaysummarysearch: any;
  previousholidaysummary: any;
  nextholidaysummary: any;
  has_next = true;
  has_previous = true;
  currentpage = 1;
  pagesize = 10;
  holidayform: FormGroup;
  holidayeditform: FormGroup;
  list: DataTransfer;
  fileData: File = null;
  fileName = '';
  file: File = null;
  currentYear: number = new Date().getFullYear();
  SearchValues: any;
  holidaySearchForm: FormGroup;
  searchtable_data: any;
  searchpresentpage: any = 1;
  currentDate: any = new Date();
  defaultDate = new FormControl(new Date());
  date: any;
  select: Date;
  send_value:String="";
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  limit = 10;
  paginations = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  holidaysumm: boolean = true;
  holidaysearchsumm: boolean = false;
  statedata: any;
  stateList: any[];
  state_has_next: any;
  state_has_previous: any;
  state_presentpage: any;
  isLoading: boolean = false;

  constructor(private taservice: TaService,private datePipe: DatePipe, private formBuilder: FormBuilder, private SpinerService: NgxSpinnerService, private notification: NotificationService, private http: HttpClient) { }

  ngOnInit(): void {

    this.holidayform = this.formBuilder.group({
      date: null,
      holidayname: null,
      file: null,


    })

    this.holidayeditform = this.formBuilder.group({
      date: null,
      holidayname: null,
      id: null,

    })
    this.holidaySearchForm = this.formBuilder.group({
      
      dates: null,
      state_id: null,
      name:null,
      

    })
    this.getholidaysummary(this.currentpage);
    this.getstatelist('', 1);
    // this.getpreviousholidaysummary(this.currentYear-1, this.currentpage)
    //this.getnextholidaysummary(this.currentYear + 1, this.currentpage)

  }
  submitform() {
    if (this.holidayform.value.date == '' || this.holidayform.value.date == null) {
      console.log('show error in Date')
      this.notification.showError('Please Choose Date')
      throw new Error;
    }

    if (this.holidayform.value.holidayname == '' || this.holidayform.value.holidayname == null) {
      console.log('show error in name')
      this.notification.showError('Please Enter Name')

      throw new Error;

    }



    this.taservice.holidayadd(this.holidayform.value).subscribe(res => {
      console.log(res)
      if (res.status === "success") {
        this.notification.showSuccess('Holiday Added Successfully')
        this.holidayaddclose.nativeElement.click()
        return true;
      } else {
        this.notification.showError(res.description)
        return false;
      }
    })

  }

  fromDateSelection(event: string) {
    let latest= event
    this.date =this.datePipe.transform(latest, 'dd-MMM-yyyy');
    console.log("this.date", this.date)
    console.log("fromdate", event)
    const date = new Date(event)
    this.select = new Date(date. getFullYear(), date.getMonth(), date.getDate() )
  }
  totalcount:any;
  getholidaysummary(page) {
    this.SpinerService.show();
    this.taservice.getholidaydetails(page).subscribe(result => {
      this.SpinerService.hide();
      console.log('from place to place', result)
      this.holidaysummary = result['data']
      this.totalcount=result['count'];
      // this.holidaysearchsumm = false;
      // this.holidaysumm = true;
      let datapagination = result['pagination']
      // this.pagination = result.pagination ? result.pagination : this.pagination;
      if (this.holidaysummary.length >= 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.currentpage = datapagination.index;
      }
    })
  }
  resetform() {
    let myfrom = this.holidaySearchForm;
    myfrom.patchValue({
      dates: '',
      state_id: '',
      name:'',   
    })
    this.getholidaysummary(this.currentpage);
    // this.holidaySearchForm.reset();
   

  }
  previousClick() {
    if (this.has_previous == true) {
      this.getholidaysummary(this.currentpage-1)
    }
  }

  nextClick() {
    if (this.has_next == true) {
      this.getholidaysummary(this.currentpage+1)
    }
  }
  editholiday(data) {
    this.holidayeditform.patchValue({
      date: data.date,
      holidayname: data.holidayname,
      id: data.id,
    })
  }


  editsubmitform() {
    console.log("Entering Edit Section", this.holidayeditform.value.date + this.holidayeditform.value.holidayname)
    if (this.holidayeditform.value.date == '' || this.holidayeditform.value.date == null) {
      console.log(this.holidayeditform.value.date)
      console.log('show error in date')
      this.notification.showError('Please Choose Date')
      throw new Error;
    }

    if (this.holidayeditform.value.holidayname == '' || this.holidayeditform.value.holidayname == null) {
      console.log('show error in name')
      console.log("Value is", this.holidayeditform.value.holidayname)
      this.notification.showError('Please Enter Holiday Name')

      throw new Error;

    }
    this.SpinerService.show();
    this.taservice.holidayedit(this.holidayeditform.value).subscribe(res => {
      console.log("ERRORS")
      console.log(res)
      this.SpinerService.hide();
      if (res.status === "success") {
        this.notification.showSuccess('Holiday Updated Successfully')
        this.closefilepopup.nativeElement.click()
        return true;
      } else {
        this.notification.showError(res.description)
        return false;
      }
    })

  }

  deleteholiday(val) {

    console.log(val)
    // return false

    this.taservice.holidaydelete(val).subscribe(res => {
      console.log(res)
      if (res.status === "success") {
        this.notification.showSuccess('Holiday Deleted Successfully')
        this.getholidaysummary(this.currentpage)
        return true;
      } else {
        this.notification.showError(res.description)
        return false;
      }
    })
  }

  onFileSelected(event) {

    this.file = event.target.files[0];

  }
  onUpload() {
    if (this.file) {

      this.fileName = this.file.name;

      const formData = new FormData();

      formData.append("file", this.file);


      this.taservice.uploadholiday(formData)
    .subscribe((results) => {
      if (results.status == 'success') {
        this.notification.showSuccess("File Uploaded Successfully")
        this.closefilepopup.nativeElement.click()
      }
      else {
        this.notification.showError(results.description)
      }
    })
    }

  }
  holidaySearch()
  {

    // let date = this.holidaySearchForm.value.dates
    // let place = this.holidaySearchForm.value.state
    // let hname = this.holidaySearchForm.value.name

    // if ( this.holidaySearchForm.value.dates != null || this.holidaySearchForm.value.state != null || this.holidaySearchForm.value.name != null) {
    //   this.searchpresentpage = 1
    //   this.getsearches(date, place, hname, this.searchpresentpage);

    // }
    this.SpinerService.show();
    let formValue = this.holidaySearchForm.value;
     console.log("Search Inputs",formValue )
     this.send_value = ""
     if(formValue.date)
    {
      console.log("Selected Holiday Date", formValue.date)
     let newDate = this.datePipe.transform((formValue.date), 'dd-MMM-yyyy')
      this.send_value=this.send_value+"&date="+newDate
    }
    if (formValue.state_id) {
      const stateId = formValue.state_id.id; // extract the ID of the selected state
      this.send_value = this.send_value + "&state=" + stateId; // append the ID to the URL
  }
  
    if(formValue.name)
    {
      this.send_value=this.send_value+"&name="+formValue.name
    }
 
 
    
    this.taservice.getSearchholidays(this.send_value, this.paginations.index).subscribe(res => {
      this.SpinerService.hide()
      this.holidaysummary = res['data']
      this.totalcount = res['count']
      // this.holidaysearchsumm = true;
      // this.holidaysumm = false;

      this.paginations = res.pagination ? res.pagination : this.paginations;
    
  })
}
prevpage()
{
  if(this.pagination.has_previous){
    this.pagination.index = this.pagination.index-1
  }
  this.getholidaysummary(this.currentpage);
}
nextpage()
{
  if(this.pagination.has_next){
    this.pagination.index = this.pagination.index+1
  }
  this.getholidaysummary(this.currentpage);

}

// previousClick()
// {
//   if(this.has_previous == true){
//     this. = this.paginations.index-1
//   }
//   this.holidaySearch();
// }
// nextClick()
// {
//   if(this.paginations.has_next){
//     this.paginations.index = this.paginations.index+1
//   }
//   this.holidaySearch();
// }

resetIndex() {
  this.pagination.index = 1;
  this.paginations.index = 1; // set the starting page number here
  // trigger the re-rendering of the pagination component here
}

getstatelist(value, page) {
  this.taservice.getstate(value, page).subscribe(
      result => {
          this.statedata = result['data'];
          this.stateList =this.statedata 
          let dataPagination = result['pagination'];
          if (this.statedata.length > 0) { // check if new data was returned
              this.state_has_next = dataPagination.has_next;
              this.state_has_previous = dataPagination.has_previous;
              this.state_presentpage = dataPagination.index;
          }
          this.SpinerService.hide();
      }
  );
}
displayFnstate(state){
  return state.name;
}

 
  
  // getsearches(dates, place,names, pageNo) {
  //   console.log("Search Data")
  //   this.SpinerService.show()
  //       this.taservice.getSearchholiday(dates, place, names, pageNo).subscribe(res => {
  //       this.searchtable_data = res['data']
  //       let datas = res["data"];
  //       this.holidaysummary = datas;
  //       this.SpinerService.hide();
  //       })



  // }

}
