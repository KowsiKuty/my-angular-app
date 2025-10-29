import { Component, OnInit,EventEmitter,Output,ViewChild } from '@angular/core';
import {TaService} from "../ta.service";
import {Router} from "@angular/router";
import {NotificationService} from '../notification.service'
import{FormGroup, FormBuilder} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms'; //BUG 8209 FIX *30/03/2023

@Component({
  selector: 'app-holidaydiem-summary',
  templateUrl: './holidaydiem-summary.component.html',
  styleUrls: ['./holidaydiem-summary.component.scss']
})
export class HolidaydiemSummaryComponent implements OnInit {
  getHolidayDiemList:any;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>(); 
  @ViewChild('closebutton') closebutton; 
  @ViewChild('closebuttons') closebuttons; 
  @ViewChild('taholidaydiemForm') taholidaydiemForm: NgForm; //BUG 8209 FIX *30/03/2023
  holidaydiemmodel:any;
  holidaydiemform:FormGroup;
  has_next=true;
  has_previous=true;
  currentpage=1;
  pagesize = 10;
  holidaydiemeditform : FormGroup;
  SearchValues: any;
  citySearchForm: FormGroup;
  searchtable_data: any;
  searchpresentpage: any = 1;
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  send_value:String="";

  constructor(private taService:TaService,private router:Router,private SpinerService: NgxSpinnerService,
    private notification:NotificationService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.holidaydiemmodel={
      salarygrade:'',
      city:'',
      amount:'',
      applicableto:'',
      entity:1
    }

    this.holidaydiemeditform = this.formBuilder.group({
      salarygrade:'',
      city:'',
      amount:'',
      applicableto:'',
      entity:1,
      id:''   
   
    })
    this.citySearchForm = this.formBuilder.group({
      salarygrade:'',
      city:'',   
    })

    
    this.getholidaydiemsummary();
  }

  editholidaydiem(data)
  {
   this.holidaydiemeditform.patchValue({
    salarygrade: data.salarygrade,
    city: data.city,
    amount:data.amount,
    applicableto: data.applicableto,
    entity:1,
    id: data.id
   })
 
  }
  totalcount:any;
  getholidaydiemsummary(){
    this.SpinerService.show()
    this.taService.getHolidaydiemSummary(this.pagination.index)
    .subscribe((results) => {
    let datas = results['data'];
    this.getHolidayDiemList = datas;
    this.totalcount=results['count'];
    this.pagination = results.pagination ? results.pagination : this.pagination;
    // let datapagination = results['pagination']
    //   if (this.getHolidayDiemList.length >= 0) {
    //     this.has_next = datapagination.has_next;
    //     this.has_previous = datapagination.has_previous;
    //     this.currentpage = datapagination.index;
    //   }
    this.SpinerService.hide()
  })
  }  
  deletediem(id){
     this.taService.deleteholidaydiem(id)
    .subscribe(result =>  {
     this.notification.showSuccess("Deleted Successfully")
     this.getholidaydiemsummary();
     return true

    })
  
  }
  
  resetform(){
    let myfrom = this.citySearchForm;
    myfrom.patchValue({
      salarygrade:'',
      city:'',
    })
    // this.citySearchForm.reset()
    this.getholidaydiemsummary();
    
  }
  previousClick(){
    if(this.has_previous == true){
      this.getholidaydiemsummary()
    }
  }

  nextClick(){
    if(this.has_next == true){
      this.getholidaydiemsummary()
    }
  }
  
  submitForm(){
    if (this.holidaydiemmodel.salarygrade  == '' || this.holidaydiemmodel.salarygrade == null) {
      console.log('show error in salarygrade')
      this.notification.showError('Please Enter Salary Grade')
      throw new Error;
    }
    if (this.holidaydiemmodel.city  == '' || this.holidaydiemmodel.city == null) {
      console.log('show error in city')
      this.notification.showError('Please Enter City')
      throw new Error;
    }
    if (this.holidaydiemmodel.amount  == '' || this.holidaydiemmodel.amount == null) {
      console.log('show error in amount')
      this.notification.showError('Please Enter Amount')
      throw new Error;
    }
    if (this.holidaydiemmodel.applicableto  == '' || this.holidaydiemmodel.applicableto == null) {
      console.log('show error in applicableto')
      this.notification.showError('Please Enter Applicable To')
      throw new Error;
    }


    this.taService.createholidaydiem([this.holidaydiemmodel])
    .subscribe(res=>{
      if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
        this.notification.showWarning("Duplicate! Code Or Name ...")
      } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
        this.notification.showError("INVALID_DATA!...")
      }
      else{
      this.notification.showSuccess("Successfully Created")
      this.closebutton.nativeElement.click();
      this.getholidaydiemsummary();
      this.taholidaydiemForm.resetForm(); //BUG 8209 FIX *30/03/2023
      this.onSubmit.emit();
      return true
      }
    })
  }
  OnCancelclick(){
    this.onCancel.emit()
    this.router.navigateByUrl('ta/ta_master');
    this.taholidaydiemForm.resetForm(); //BUG 8209 FIX *30/03/2023
  }
  editForm()
  {
   
  if(this.holidaydiemeditform.value.salarygrade == '' || this.holidaydiemeditform.value.salarygrade == null){
    console.log(this.holidaydiemeditform.value.salarygrade)
    console.log('show error in salarygrade')
    this.notification.showError('Please Enter Salary Grade')
    throw new Error;
  }

  if(this.holidaydiemeditform.value.city == '' || this.holidaydiemeditform.value.city == null){
    console.log('show error in city')
    console.log("Value is",  this.holidaydiemeditform.value.city)
    this.notification.showError('Please Enter City')

    throw new Error;

  }
  if(this.holidaydiemeditform.value.amount == '' || this.holidaydiemeditform.value.amount == null){
    console.log('show error in Amount')
    console.log("Value is",  this.holidaydiemeditform.value.amount)
    this.notification.showError('Please Enter Amount')

    throw new Error;

  }
  if(this.holidaydiemeditform.value.applicableto == '' || this.holidaydiemeditform.value.applicableto == null){
    console.log('show error in applicableto')
    console.log("Value is",  this.holidaydiemeditform.value.applicableto)
    this.notification.showError('Please Enter Applicableto')

    throw new Error;
 }
  this.taService.holidaydiemedits([this.holidaydiemeditform.value]).subscribe(res => {
    console.log("ERRORS")
    console.log(res)
    if (res.status === "success") {
      this.notification.showSuccess('Holiday Diem Updated Successfully')
      this.getholidaydiemsummary()
      this.closebuttons.nativeElement.click();
      return true;
    } else {
      this.notification.showError(res.description)
      return false;
    }
  })


  }
  citySearch()
  {
    // let grade = this.citySearchForm.value.salarygrade
    // let place = this.citySearchForm.value.city

    // if ( this.citySearchForm.value.salarygrade != null || this.citySearchForm.value.city != null) {
    //   this.searchpresentpage = 1
    //   // this.getsearches(grade, place, this.searchpresentpage);

    // }
    this.SpinerService.show()
    let formValue = this.citySearchForm.value;
     console.log("Search Inputs",formValue )
     this.send_value = ""
     if(formValue.salarygrade)
    {
      this.send_value=this.send_value+"&salarygrade="+formValue.salarygrade
    }
    if(formValue.city)
    {
      this.send_value=this.send_value+"&city="+formValue.city
    }
 
    
    this.taService.getSearchholidaydiems(this.send_value, this.pagination.index).subscribe(res => {
      this.SpinerService.hide()
  
      this.getHolidayDiemList = res['data']
      this.totalcount = res['count']

      this.pagination = res.pagination ? res.pagination : this.pagination;

    // this.brsService.getknockoffSearch(this.send_value, this.pagination.index).subscribe(results=> {
    //   this.summarylists = results['data'];
    })

   
  }
  
  getsearches(grade, place, pageNo) {
    console.log("Search Data")
    this.SpinerService.show()
        this.taService.getSearchholidaydiem(grade, place, pageNo).subscribe(res => {
        this.getHolidayDiemList = res['data']
        //let datas = res["data"];
        //this.getHolidayDiemList = datas;
        this.SpinerService.hide();
        })



  }

  prevpage()
  {
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1
    }
    this.getholidaydiemsummary();
  }
  nextpage()
  {
    if(this.pagination.has_next){
      this.pagination.index = this.pagination.index+1
    }
    this.getholidaydiemsummary();

  }

}
