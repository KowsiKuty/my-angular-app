
import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {ErrorHandlingprovisionService} from'../error-handlingprovision.service'
import { ProvisionService } from '../provision.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { ProisionshareserviceService} from '../proisionshareservice.service'
import { NotificationService } from '../notification.service';      
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, tap } from 'rxjs/operators';
export interface BS {
  name: string;
  id: string;
  

}
export interface CC {
  name: string;
  id: string;
  
}
export interface RM {
  id: string;
  full_name: string;
}
@Component({
  selector: 'app-delmatmaker',
  templateUrl: './delmatmaker.component.html',
  styleUrls: ['./delmatmaker.component.scss']
})


export class DelmatmakerComponent implements OnInit {
delmat:FormGroup;
  bsdata: any;
  isLoading: boolean;
  employeeList: any;
  ccdata: any;
  bsid: any;

  constructor( private fb: FormBuilder,
    private router: Router,private toastr: ToastrService, private Service: ProvisionService, public share:ProisionshareserviceService,
    private notification: NotificationService,private SpinnerService: NgxSpinnerService,private errorHandler:ErrorHandlingprovisionService)
     { }


  ngOnInit(): void {
    
    this.delmat= this.fb.group({
      employee_id: [''],
      type: ['1'],
      cc_id: [''],
      remarks:[''],
  
      bs_id: [''],  
    })

    let data: any = this.share.delmatdta.value;
    if (data!=''){
      this.delmat.addControl('id', new FormControl(''));
    this.delmat.patchValue({
    employee_id: data.employee_id,
    bs_id: data.bs_id,
    id:data.id ,
    cc_id:data.cc_id,
    remarks:data.remarks,
    type:data.type 


    })
  }
  }

  bsget() {
    let bs: String = "";
    this.bsdatafun(bs);

    this.delmat.get('bs_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.Service.getbsvalue(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
  
      .subscribe((results: any[]) => {
        this.bsdata = results["data"];
       
      })
  }

  bsdatafun(val){
    this.Service.getbsvalue(val).subscribe((results: any[]) => {
      this.bsdata = results["data"];
     
    })

  }
  public displayFnbs(_bsval?: BS): string | undefined {
    return _bsval ? _bsval.name : undefined;
  }

  get _bsval() {
    return this.delmat.value.get('bs_id');
  }

  
  // bsend

  rmname(){
    let rmkeyvalue: String = "";
      this.getRmEmployee(rmkeyvalue);
  
      this.delmat.get('employee_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
          switchMap(value => this.Service.get_EmployeeName(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.employeeList = datas;
  
        })
  
      }

      private getRmEmployee(rmkeyvalue) {
        this.Service.getEmployeeSearchFilter(rmkeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.employeeList = datas;
          })
      }
      public displayFnRm(rmemp?: RM): string | undefined {
        return rmemp ? rmemp.full_name : undefined;
      }
    
      get rmemp() {
        return this.delmat.value.get('employee_id');
      }
      delmatadd(){
        this.delmat.value.cc_id=this.delmat.value.cc_id.id;
 
        this.delmat.value.bs_id=this.delmat.value.bs_id.id;
        this.delmat.value.employee_id=this.delmat.value.employee_id.id;

        this.Service.delmatadd(this.delmat.value)
      .subscribe(result => {
        if(result.id){
        console.log("RESULSSS", result)
        this.notification.showSuccess("Saved Successfully!...")
        this.SpinnerService.hide();
        this.delmat.reset();
        this.router.navigate(['/delmat'], { skipLocationChange: true })

      
      }else{
        if(result['description']){
          this.notification.showWarning(result['description'])}
          else{
            this.notification.showWarning('Unauthorized Request')}
            this.SpinnerService.hide();
  
      }
      

      
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
      }
      bsid_cc(id){
        this.bsid=id;
        this.delmat.get('cc_id').setValue('');
      }
    // cc
  ccget(){
    let cc: String = "";
    this.ccdatafun( this.bsid,cc);

    this.delmat.get('cc_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        

      }),
      switchMap(value => this.Service.getcclistDependentBs( this.bsid,value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
  
      .subscribe((results: any[]) => {
        this.ccdata = results["data"];
       
      })
  }
  ccdatafun(id,val){
    this.Service.getcclistDependentBs(id,val).subscribe((results: any[]) => {
      this.ccdata = results["data"];
     
    })

  }
  public displayFncc(_ccval?: CC): string | undefined {
    return _ccval ? _ccval.name : undefined;
  }

  get _ccval() {
    return this.delmat.value.get('cc_id');
  }
  // ccend
  
}
