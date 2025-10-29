import { Component, OnInit, ViewChild } from '@angular/core';
import { TaService } from '../ta.service';
import { NotificationService } from '../notification.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
// import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';



@Component({
  selector: 'app-travelreasonexpense',
  templateUrl: './travelreasonexpense.component.html',
  styleUrls: ['./travelreasonexpense.component.scss']
})
export class TravelreasonexpenseComponent implements OnInit {


  travelexpenses: any;
  expenseeditform: FormGroup;
  expenseform: FormGroup;
  expenseSearchForm: FormGroup;
  searchtable_data: any;
  @ViewChild('travelexpenseeditclose') travelexpenseeditclose;
  @ViewChild('travelexpenseaddclose') travelexpenseaddclose;
  @ViewChild('travelreasonaddclose') travelreasonaddclose;
  travelreasons: any;
  expname: any;
  has_next = true;
  has_previous = true;
  currentpage = 1;
  pagesize = 10;
  reasoneditform: FormGroup;
  reasonform: FormGroup;
  reasonSearchForm: FormGroup;

  @ViewChild('travelreasoneditclose') travelreasoneditclose;

  inttraveldropdown = [{ name: 'Yes', id: 1 }, { name: 'No', id: 0 }]

  constructor(private taservice: TaService, private SpinerService: NgxSpinnerService, private notification: NotificationService, private formBuilder: FormBuilder,private spiner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.expenseSearchForm = this.formBuilder.group(
      {
        expname: ['']
      }
    )

    this.expenseeditform = this.formBuilder.group({
      name: null,
      code: null,
      id: null,

    })
    this.expenseform = this.formBuilder.group({
      name: null,
      code: null,
    })


    this.reasonSearchForm = this.formBuilder.group(
      {
        expname: ['']
      }
    )

    this.reasoneditform = this.formBuilder.group({
      name: null,
      code: null,
      id: null,

    })
    this.reasonform = this.formBuilder.group({
      name: null,
      code: null,

    })
    this.gettravelreasons(this.currentpage);
    this.gettravelexpenses();
  }
  totalcount:any;
  gettravelreasons(page) {
      this.SpinerService.show();
      this.taservice.gettravelreasondetails(page).subscribe(result => {
        this.SpinerService.hide();
        console.log('from place to place', result)
        this.travelreasons = result['data'];
        this.totalcount=result['count'];
        let datapagination = result['pagination']
      if (this.travelreasons.length >= 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.currentpage = datapagination.index;
      
      }
  })
  }
  
  resetform() {
    // this.reasoneditform.reset()
    this.reasonSearchForm.reset();
    this.gettravelreasons(1);

  }
  previousClick() {
    if (this.has_previous == true) {
      this.gettravelreasons(this.currentpage - 1)
    }
  }

  nextClick() {
    if (this.has_next == true) {
      this.gettravelreasons(this.currentpage + 1)
    }
  }
  edittravelreasons(data) {

    this.reasoneditform.patchValue({
      name: data.name,
      code: data.code,
      id: data.id,
    })
  }


  deletereason(val) {

    console.log(val)

    
        this.taservice.travelreasondelete(val).subscribe(res => {
          console.log(res)
          if (res.status === "success") {
            this.notification.showSuccess('Reason Deleted Successfully')
            this.gettravelreasons(this.currentpage);
            return true;
          } else {
            this.notification.showError(res.description)
            return false;
          }
        })
  }

  submitForm() {
    console.log("Entering Edit Section", this.reasoneditform.value.name + this.reasoneditform.value.code)
    if (this.reasoneditform.value.name == '' || this.reasoneditform.value.name == null) {
      console.log("Name VALUE ", this.reasoneditform.value.name)
      console.log('show error in date')
      this.notification.showError('Please Enter Tour Reason Name')
      throw new Error;
    }

    this.taservice.travelreasonedit(this.reasoneditform.value).subscribe(res => {
      console.log("ERRORS")
      console.log(res)
      if (res.status === "success") {
        this.notification.showSuccess('Tour Reason Updated Successfully')
        this.travelreasoneditclose.nativeElement.click()
        this.gettravelreasons(this.currentpage);
        return true;
      } else {
        this.notification.showError(res.description)
        return false;
      }
    })

  }
  addsubmitForm() {
    console.log("Entering Add Section", this.reasonform.value.name + this.reasonform.value.code)
    if (this.reasonform.value.name == '' || this.reasonform.value.name == null) {
      console.log("Name VALUE ", this.reasonform.value.name)
      console.log('show error in date')
      this.notification.showError('Please Enter Tour Reason Name')
      throw new Error;
    }

    this.taservice.travelreasonadd(this.reasonform.value).subscribe(res => {
      console.log("ERRORS")
      console.log(res)
      if (res.status === "success") {
        this.notification.showSuccess(res.message)
        this.travelreasonaddclose.nativeElement.click();
        this.gettravelreasons(this.currentpage);
        return true;
      } else {
        this.notification.showError(res.description)
        return false;
      }
    })
  }
  reasonSearch() {
    this.expname = this.reasonSearchForm.value.expname;

    if (this.expname != null) {
      this.getSearch(this.expname)
    }

  }
  getSearch(data) {
    this.searchName(data, 1)
  }
  searchName(data, pageNo) {
    console.log("Search Data")
    this.SpinerService.show()
        this.taservice.getreasonsearches(data, pageNo).subscribe(res => {
        this.searchtable_data = res['data']
        let datas = res["data"];
        this.totalcount = res['count'];
        this.travelreasons = datas;
        this.SpinerService.hide();
        })



  }
  gettravelexpenses(page=1) {
     this.spiner.show();
     this.taservice.gettravelexpensedetails().subscribe(result => {
      this.spiner.hide();
      if(result.code!="" && result.code!=null && result.code!=undefined){
        this.notification.showError(result?.code);
        this.notification.showError(result?.description);
      }
      else{
       console.log('from place to place', result)
       this.travelexpenses = result['data'];
       this.totalcount=result['count'];
       let datapagination = result['pagination']
       if (this.travelexpenses.length >= 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.currentpage = datapagination.index;
      
      }}
       },(error:HttpErrorResponse)=>{
        this.spiner.hide();
        this.notification.showError(error.status+error.message);
       })


  }

  resetform_tourexp(){
    this.expenseSearchForm.reset();
    this.gettravelexpenses();
  }
  previousClicks() {
    if (this.has_previous == true) {
      this.gettravelexpenses(this.currentpage - 1)
    }
  }

  nextClicks() {
    if (this.has_next == true) {
      this.gettravelexpenses(this.currentpage + 1)
    }
  }

  edittravelexpense(data) {
    this.expenseeditform.patchValue({
      name: data.name,
      code: data.code,
      id: data.id,
    })
  }
  editsubmitForm() {
    console.log("Entering Edit Section", this.expenseeditform.value.name + this.expenseeditform.value.code)
    if (this.expenseeditform.value.name == '' || this.expenseeditform.value.name == null) {
      console.log("Name VALUE ", this.expenseeditform.value.name)
      console.log('show error in name')
      this.notification.showError('Please Enter Tour Expense Name')
      throw new Error;
    }
    if (this.expenseeditform.value.code == '' || this.expenseeditform.value.code == null) {
      console.log("Code VALUE ", this.expenseeditform.value.name)
      console.log('show error in code')
      this.notification.showError('Please Enter Code')
      throw new Error;
    }
    this.taservice.travelexpenseedit(this.expenseeditform.value).subscribe(res => {
      console.log("ERRORS")
      console.log(res)
      if (res.status === "success") {
        this.notification.showSuccess('Tour Expense Updated Successfully')
        this.expenseSearch();
        this.travelexpenseeditclose.nativeElement.click()
        return true;
      } else {
        this.notification.showError(res.description)
        return false;
      }
    })

  }
  deleteexpense(val) {
    console.log(val)


       this.taservice.travelexpensedelete(val).subscribe(res => {
          console.log(res)
          if (res.status === "success") {
            this.notification.showSuccess('Expense Deleted Successfully')
            this.expenseSearch();
            return true;
          } else {
            this.notification.showError(res.description)
            return false;
          }
        }) 
  }
  addsubmitForms() {
    console.log("Entering Edit Section", this.expenseform.value.name + this.expenseform.value.code)
    if (this.expenseform.value.name == '' || this.expenseform.value.name == null) {
      console.log("Name VALUE ", this.expenseform.value.name)
      console.log('show error in name')
      this.notification.showError('Please Enter Tour Expense Name')
      throw new Error;
    }
    if (this.expenseform.value.code == '' || this.expenseform.value.code == null) {
      console.log("Code VALUE ", this.expenseform.value.name)
      console.log('show error in code')
      this.notification.showError('Please Enter Code')
      throw new Error;
    }
        this.taservice.travelexpenseadd(this.expenseform.value).subscribe(res => {
          if (res.status === "success") {
            this.notification.showSuccess(res.message)
            this.travelexpenseaddclose.nativeElement.click()
            this.gettravelexpenses();
            return true;
          } else {
            this.notification.showError(res.description)
            return false;
          }
        })


  }
  expenseSearch() {
    this.expname = this.expenseSearchForm.value.expname;

    if (this.expname != null) {
      this.getSearchs(this.expname)
    }

  }
  getSearchs(data) {
    this.searchNames(data, 1)
  }
  searchNames(data, pageNo) {
    console.log("Search Data")
    this.SpinerService.show()
        this.taservice.getSearchdatas(data, pageNo).subscribe(res => {
        this.searchtable_data = res['data']
        let datas = res["data"];
        this.totalcount = res['count'];
        this.travelexpenses = datas;
        this.SpinerService.hide();
        })



  }

 

}


