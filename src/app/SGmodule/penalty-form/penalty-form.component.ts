import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router, ActivatedRoute } from '@angular/router';
import { SGService } from './../SG.service';
import { SGShareService } from './../share.service';
import { NotificationService } from 'src/app/service/notification.service';
import { SharedService } from '../../service/shared.service'
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { DatePipe,formatDate } from '@angular/common';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import { NativeDateAdapter,DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

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
  selector: 'app-penalty-form',
  templateUrl: './penalty-form.component.html',
  styleUrls: ['./penalty-form.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class PenaltyFormComponent implements OnInit {
   //penalty
   penaltyForm:FormGroup;
   isPenalty:boolean=false
   addPenaltyForm:boolean=false
   penaltyList: any;
   ispenaltypage: boolean = true;
   summaryList: any;
   paymentcurrentpage: number = 1;
   paymentpresentpage: number = 1;
   pagesizepayment = 10;
   has_paymentnext = true;
   has_paymentprevious = true;

  constructor(private router: Router, private shareService: SharedService,private route:ActivatedRoute,
    private notification:NotificationService,private  sgservice:SGService,private datePipe: DatePipe,
    private shareservice:SGShareService,private fb :FormBuilder,private toastr:ToastrService) { }

  ngOnInit(): void {
    this.penaltyForm=this.fb.group({
      penalty:['',Validators.required],
      shift:[''],
      amount:['']
    })
  
    this.isPenalty=true;
    this.addPenaltyForm=false;
    this.getpenaltyList();
  }

  

  // penalty List
  getpenaltyList(filter = "", sortOrder = 'asc',
  pageNumber = 1, pageSize = 10) {
  this.sgservice.getpenaltyList(filter, sortOrder, pageNumber, pageSize)
    .subscribe((results: any[]) => {
      console.log("penaltylist", results)
      let datas = results["data"];
      this.penaltyList = datas;
      let datapagination = results["pagination"];
      this.penaltyList = datas;
      if (this.penaltyList.length === 0) {
        this.ispenaltypage = false
      }
      if (this.penaltyList.length > 0) {
        this.has_paymentnext = datapagination.has_next;
        this.has_paymentprevious = datapagination.has_previous;
        this.paymentpresentpage = datapagination.index;
        this.ispenaltypage = true
      }
    })
}

nextClickPenalty() {
  if (this.has_paymentnext === true) {
    this.getpenaltyList("", 'asc', this.paymentpresentpage + 1, 10)
  }
}

previousClickPenalty() {
  if (this.has_paymentprevious === true) {
    this.getpenaltyList("", 'asc', this.paymentpresentpage - 1, 10)
  }
}
//add penalty
addPenalty(){
  this.ngOnInit();
  this.isPenalty=false;
  this.addPenaltyForm=true;
  this.amount = false;
  this.shift = false;
  this.penaltySubmit = false;
}
numberOnly(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}

onCancelClick()
{
  this.isPenalty=true;
  this.addPenaltyForm=false;
}

penaltySubmit:boolean=false
onSubmitPenalty() {
 this.penaltySubmit = true;
  if (this.penaltyForm.value.penalty === ""){
    this.penaltySubmit = false;
    this.toastr.error('', 'Please Enter Penalty', { timeOut: 1500 });
    return false;
  }
  if(this.penaltyForm.value.shift==='' && this.penaltyForm.value.amount===''){
    this.penaltySubmit = false;
    this.toastr.error('', 'Pls Select Any One shift or Amount');
    return false;
  }
  if(this.penaltyForm.value.shift===''){
    this.penaltyForm.value.shift=null
  }
  if(this.penaltyForm.value.amount===''){
    this.penaltyForm.value.amount=null
  }
  console.log(this.penaltyForm.value)
  this.sgservice.addPenaltyForm(this.penaltyForm.value)
  .subscribe(result => {
    console.log("add penalty",result)
    if(result.id === undefined){
      this.notification.showError(result.description)
      this.penaltySubmit = false;
      return false
    }
    else {
      this.notification.showSuccess("Successfully created!...")
      this.addPenaltyForm=false;
      this.isPenalty=true;
      this.getpenaltyList();
    }
  })
    
   
}



// shift and amount 

shift: boolean = false;
amount: boolean = false;
Shift(event) {
  let count=0;
  if(event.target.value=="")
  { 
    count++;
    this.amount = false;
  }
  if(count==0)
  {
    this.amount = true;
  }
 
}
Amount(event) {
  let count=0
  if(event.target.value=="")
  {
    count++
    this.shift = false;
  }
  if(count==0)
  {
    this.shift = true;
  }
}

keyPressNumbers(event) {
  console.log(event.which)
  var charCode = (event.which) ? event.which : event.keyCode;
  console.log(event.keycode)
  // Only Numbers 0-9
  if (event.keyCode==32)
  {
    return true;
  }
  if ((charCode < 48 || charCode > 57)) {
    event.preventDefault();
    this.toastr.warning('', 'Please Enter the Number only', { timeOut: 1500 });
    return false;
  } else {
    return true;
  }
}


keyPressAlpha(event) {

  var inp = String.fromCharCode(event.keyCode);

  if (/[a-zA-Z]/.test(inp) ||event.keyCode==32) {
    return true;
  } else {
    event.preventDefault();
    this.toastr.warning('', 'Please Enter the Letter only', { timeOut: 1500 });      
    return false;
    
  }
}
keyPressAlphanumeric(event)
{
  var inp = String.fromCharCode(event.keyCode);

  if (/[a-zA-Z0-9]/.test(inp)||event.keyCode==32  ) {
    return true;
  } else {
    event.preventDefault();
    this.toastr.warning('', 'Don\'t Use Extra character ', { timeOut: 1500 });      
    return false;
    
  }}


}
