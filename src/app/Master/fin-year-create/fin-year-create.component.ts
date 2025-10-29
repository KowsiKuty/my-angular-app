import { formatDate } from '@angular/common';
import { Component, OnInit,ViewChild,EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { NotificationService } from 'src/app/service/notification.service';
import { masterService } from '../master.service';
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY',
  },
};
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'YYYY', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
@Component({
  selector: 'app-fin-year-create',
  templateUrl: './fin-year-create.component.html',
  styleUrls: ['./fin-year-create.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    
  ]
})
export class FinYearCreateComponent implements OnInit {
  @ViewChild('pick', {static: false}) private picker: MatDatepicker<Date>;
  @Output() onSubmit=new EventEmitter<any>();
  @Output() onCancel=new EventEmitter<any>();
  constructor(private fb:FormBuilder,private Notification:NotificationService,private masterservice:masterService) { }
  finform:any=FormGroup;
  ngOnInit(): void {
    this.finform=this.fb.group({
      'year':['',Validators.required],
      'month':['',Validators.required]
    });
  }
  onclickcancel(){
    this.onCancel.emit();
  }
  chosenYearHandler(ev, input){
    let { _d } = ev;
    console.log(_d)
    this.finform.get('year').patchValue(_d) ;
    input._destroyPopup()
  }

  getsubmitform(){
    console.log(this.finform.value);
    if(this.finform.get('name').value==undefined || this.finform.get('name').value=='' || this.finform.get('name').value==null){
      this.finform.showError('please Enter the Expence Name');
      return false;
    }
    if(this.finform.get('desc').value==undefined || this.finform.get('desc').value=='' || this.finform.get('desc').value==null){
      this.Notification.showError('please Enter the Expence Name');
      return false;
    }
    let d:any={'year':this.finform.get('year').value,'month':this.finform.get('month').value};
    console.log(d);
    this.masterservice.expenceformcreate(d).subscribe(result=>{
      if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
        this.Notification.showError("[INVALID_DATA! ...]")
      }
      else if (result.code === "UNEXPECTED_ERROR" && result.description === "Duplicate Name") {
        this.Notification.showWarning("Duplicate Data! ...")
      } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
        this.Notification.showError("INVALID_DATA!...")
      }else {
        this.Notification.showSuccess("saved Successfully!...")
        this.onSubmit.emit();
      }
    })
  }
}
