import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { RmuApiServiceService } from '../rmu-api-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { NotificationService } from '../../service/notification.service';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
@Component({
  selector: 'app-destroyapprove',
  templateUrl: './destroyapprove.component.html',
  styleUrls: ['./destroyapprove.component.scss', '../rmustyles.css']
})
export class DestroyapproveComponent implements OnInit {

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild('actionclose') actionclose: ElementRef;
  @ViewChild('closedestroyapproverpopup')closedestroyapproverpopup
  approverequest: FormGroup;
  limit = 10;
  pagination={
    has_next:false,
    has_previous:false,
    index:1
  }
  doclistview: any;
  destroyapprove: any;
  destoryapprove_summary:any
  destorydesvoe_summaryapi:any
  constructor(private rmuservice:RmuApiServiceService, private router:Router, private fb: FormBuilder, 
    private snackbar: MatSnackBar, private notification: NotificationService) {
      // this.destoryapprove_summary = [ { "columnname": "Destroy Code",  "key": "destroy_code"},{ "columnname": "Destroy Code",  "key": "maker_data", type: "object", objkey: "name"}]
     }
 

  ngOnInit(): void {
    
    this.approverequest = this.fb.group({
      id: '',
      status: '',
      comment: '',
     

    })
    this.getdestroyappsummary();
  }
  
  getdestroyappsummary(){
    // var val = this.summaryform.value;
    // val = Object.keys(val).map(key => key +'='+val[key]).join('&')
    this.rmuservice.getdestroyappsummary('',this.pagination.index).subscribe(results =>{
      if(!results){
        return false;
      }
      this.destroyapprove = results['data'];
      this.pagination = results.pagination?results.pagination:this.pagination;
    })
  }
  approveaction()
  {

    this.rmuservice.destroyapprove(this.approverequest.value).subscribe(results => {

      this.destroyapprove = results['data'];

      this.pagination = results.pagination ? results.pagination : this.pagination;


      if (results.status == 'success') {
        this.notification.showSuccess("Approved")
        this.closedestroyapproverpopup.nativeElement.click();
        this.getdestroyappsummary();
      }
      else {
        this.notification.showError(results.description)

      }

    })



    
    

  }

  rejectaction()
  {

    
    this.rmuservice.destroyreject(this.approverequest.value).subscribe(results => {

      this.destroyapprove = results['data'];

      this.pagination = results.pagination ? results.pagination : this.pagination;


      if (results.status == 'success') {
        this.notification.showSuccess("Rejected")
        this.actionclose.nativeElement.click();
        this.getdestroyappsummary();
      }
      else {
        this.notification.showError(results.description)

      }

    })

  }

  returnaction()
  {
    this.rmuservice.destroyreturn(this.approverequest.value).subscribe(results => {

      this.destroyapprove = results['data'];

      this.pagination = results.pagination ? results.pagination : this.pagination;


      if (results.status == 'success') {
        this.notification.showSuccess("RETURNED")
        this.closedestroyapproverpopup.nativeElement.click();
        this.getdestroyappsummary();
      }
      else {
        this.notification.showError(results.description)

      }

    })
  }


  approve(datas)
  {
   this.popupopen()
    this.approverequest.patchValue({
      id: datas.id,
      status: '',
      comment: '',

    })
  }

  reject(datas)
  {
   this.popupopenreject()
    this.approverequest.patchValue({
      id: datas.id,
      status: '',
      comment: '',

    })
  }


  return(datas)
  {
   this.popupopenreturn()
    this.approverequest.patchValue({
      id: datas.id,
      status: '',
      comment: '',

    })
  }
  
  // viewdestroydetails(datas)
  // {

    

  // }

  viewdestroydetails(id){
    this.popupopenview()
    this.rmuservice.getdestroyparticular(id,this.pagination.index).subscribe(results =>{
    
      this.doclistview = results;
      this.pagination = results.pagination?results.pagination:this.pagination;
    })
  }

  popupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("approvepopup"),
      {
        keyboard: false,
      }
    );
    myModal.show();
  }


  
  popupopenreject() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("recjectpopup"),
      {
        keyboard: false,
      }
    );
    myModal.show();
  }

  
  popupopenreturn() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("returnpopup"),
      {
        keyboard: false,
      }
    );
    myModal.show();
  }

  
  popupopenview() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("viewpopup"),
      {
        keyboard: false,
      }
    );
    myModal.show();
  }

  close(){
    this.closedestroyapproverpopup.nativeElement.click()
  }
}

