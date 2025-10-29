import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/service/shared.service';
import { NotificationService } from '../notification.service';
import { SGService } from '../SG.service';
import { SGShareService } from '../share.service';
import { of } from 'rxjs';
import { timeout, tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-monthly-scheduler',
  templateUrl: './monthly-scheduler.component.html',
  styleUrls: ['./monthly-scheduler.component.scss']
})
export class MonthlySchedulerComponent implements OnInit {
  pagesizeprivi:number=10
  isProvisionPage: boolean = false
  has_privinext:boolean=false;
  has_priviprevious:boolean=false;
  privipresentpage:number=1;
  schedulerarray=[]
  validationvalue: any={}
  constructor(private fb: FormBuilder,private toastr: ToastrService,private datepipe:DatePipe,private route:ActivatedRoute,
    private router:Router,private  sgservice:SGService,private shareservice:SGShareService,private SpinnerService: NgxSpinnerService,
    private shareService: SharedService,private notification:NotificationService) { }

  ngOnInit(): void {
    this.getsummary(1)
  }
  previousClick(){
    if (this.has_priviprevious === true) {
      this.getsummary(this.privipresentpage - 1 )
  
    }
  }
  nextClick(){
    if (this.has_privinext  === true) {
      this.getsummary(this.privipresentpage + 1)
  
    }
  }
  getsummary(page){
    this.SpinnerService.show()
    this.sgservice.sgschedulersumaary(page).subscribe((result)=>{
      this.SpinnerService.hide()
      this.schedulerarray=result['data']
      let datapagination = result.pagination;
      this.validationvalue=result.validation
      console.log(this.validationvalue,'validationvalue')
      console.log(datapagination,'datapagination')
      if (this.schedulerarray.length === 0) {
        this.isProvisionPage = false
      }
      if (this.schedulerarray.length > 0) {
        this.has_privinext = datapagination.has_next;
        this.has_priviprevious = datapagination.has_previous;
        this.privipresentpage= datapagination.index;
        this.isProvisionPage = true
      }
    })
    
  }
  mothfind(month,year){
    return new Date(year,month-1)
    // return this.datepipe.transform(obj, 'dd-MMM-yyyy h:mm')
  }
//   runscheduler(data){
// let payload={"month":data.month,"year":data.year}
// console.log(payload,'payload')
// this.sgservice.sg_schedulaer_run(payload).subscribe((result)=>{

//   this.notification.showSuccess('Schedule started')
//   this.getsummary(1)

// })

//   }
runscheduler(data: { month: string, year: string }) {
  let payload = { "month": data.month, "year": data.year };
  console.log(payload, 'payload');
  const timeoutLimit = 3000;
  let responseReceived = false;

  this.sgservice.sg_schedulaer_run(payload).pipe(
    timeout(timeoutLimit),
    tap(() => {
      responseReceived = true;
    }),
    catchError(error => {
      if (error.name === 'TimeoutError') {
        console.log('Request timed out');
      } else {
        console.log('Request failed with error:', error);
      }
      return of(null);
    })
  ).subscribe(result => {
    if (responseReceived && result && result.description) {

      this.notification.showSuccess(result.description);
    } else {
      this.notification.showSuccess('Schedule started');
      this.getsummary(1);
    }
  });
}
}
