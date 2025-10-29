import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SGService } from '../SG.service';
import { SGShareService } from '../share.service';
import { NotificationService } from 'src/app/service/notification.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize } from 'rxjs/operators';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import { NativeDateAdapter,DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { MatAutocompleteSelectedEvent,MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';



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
  selector: 'app-holiday-update',
  templateUrl: './holiday-update.component.html',
  styleUrls: ['./holiday-update.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ],
})
export class HolidayUpdateComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  holidayUpdateForm:FormGroup
  holiday_edit_groupvalue:FormGroup
  holiday_Id:any;
  holidayList:any;
  finaly_check_update_value:any=[];
  holidayDate:any;
  holidaySingleRecord:any;

  constructor(private fb: FormBuilder,private datepipe:DatePipe,private shareServicesg:SGShareService,
    private router:Router,private toastr: ToastrService,private  sgservice:SGService,
    private shareservice:SGShareService,private notification:NotificationService) { }

  ngOnInit(): void {
    this.holidayUpdateForm=this.fb.group({
      data:this.fb.array([])
    })

    this.holiday_edit_groupvalue=this.fb.group({
      id:'',
      name:'',
      date:''
    })
    this.holiday_Id = this.shareservice.holidayupdate.value;
    this.holidaySingleRecord = this.shareservice.holidaysummarydata.value
    this.getholidayvalue(this.holiday_Id);
    
  }
  
  getholidayvalue(holiday_id){
    this.sgservice.Viewholidayformdetails(holiday_id).subscribe((result)=>{
    let datas = result['data'];
    this.holidayList=datas;
    console.log('holidayList',datas)
    this.finaly_check_update_value=[];
    let arr_value = (this.holidayUpdateForm.get("data") as FormArray)
    for(let i=0;i<this.holidayList.length;i++)
    {
      const Date = this.holidayList[i]?.date;
      this.holidayDate = this.datepipe.transform(Date, 'yyyy-MM-dd'); 
      this.holiday_edit_groupvalue=this.fb.group({
        id:this.holidayList[i]?.id,
        name:this.holidayList[i]?.name,
        date:this.holidayDate,
        
      })
      arr_value.push(this.holiday_edit_groupvalue);
      this.finaly_check_update_value.push(this.holiday_edit_groupvalue.value)
    }
    console.log("finaly_check_update_value", this.finaly_check_update_value)
    })
    
  }


  getholidayedit_controls()
  {
    return (this.holidayUpdateForm.get("data") as FormArray).controls
  }

  
  finallist:any=[];
  onSubmitHolidayupdate()
  {
    this.finallist=[];
    let update_Arr=(this.holidayUpdateForm.get("data") as FormArray).value

    for(let i=0;i<this.finaly_check_update_value.length;i++)
    {
      for(let j=0;j<update_Arr.length;j++)
      {
        if(this.finaly_check_update_value[i]?.id == update_Arr[i]?.id )
        {
          if(this.finaly_check_update_value[i]?.name != update_Arr[i]?.name || this.finaly_check_update_value[i]?.date != update_Arr[i]?.date)
          {
            this.finallist.push(update_Arr[i])
          }
          break;
        }
      }
    }
    console.log("final post aarr",this.finallist)



    if(this.finallist.length != 0)
    {
      for(let i=0;i<this.finallist.length;i++){
        const Date = this.finallist[i]?.date;
        this.holidayDate = this.datepipe.transform(Date, 'yyyy-MM-dd'); 
        this.finallist[i].date = this.holidayDate
      }
    console.log("convert to datepipe",this.finallist)
    this.sgservice.holiday_Update(this.finallist)
    .subscribe(res => {
      if (res.status == "success") {
        this.notification.showSuccess("Updated Successfully!...")
        this.shareServicesg.hoildaykeyadd=false
        this.shareServicesg.hoildaykeyview=true
        this.shareservice.holidaysummarydata.next(this.holidaySingleRecord)
        this.onSubmit.emit()
        // this.router.navigate(['SGmodule/holidaymaster'], { skipLocationChange: true })
      } else {
        this.notification.showError(res.description)
      } 
    })
    }
    else{
      this.toastr.info("No data is Changed","want to navigate Click cancel")
    }

    
  }
  
  oncancelHolidayupdate(){
    this.shareServicesg.hoildaykeyadd=false
    this.shareServicesg.hoildaykeyview=true
    this.onCancel.emit()
    // this.router.navigate(['SGmodule/holidaymaster'], { skipLocationChange: true })
  }

}
