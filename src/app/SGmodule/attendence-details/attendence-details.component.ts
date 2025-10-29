import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SGService } from '../SG.service';
import { NotificationService } from 'src/app/service/notification.service';
import { SGShareService } from '../share.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { count } from 'rxjs/operators';

@Component({
  selector: 'app-attendence-details',
  templateUrl: './attendence-details.component.html',
  styleUrls: ['./attendence-details.component.scss']
})
export class AttendenceDetailsComponent implements OnInit {
  attendetails:any
  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
    this.attendetails=this.fb.group({
      fromdate:['',Validators.required],
      todate:['',Validators.required],
      
    })
  }
AttendenceSubmitForm(){
  
}

}
