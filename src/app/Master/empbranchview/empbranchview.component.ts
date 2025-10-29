import { Component, OnInit,EventEmitter,ElementRef,Output,ViewChild } from '@angular/core';
import { Validators,FormBuilder,FormControl,FormGroup } from '@angular/forms';
import{MatAutocompleteTrigger,MatAutocomplete}from '@angular/material/autocomplete';
import { NgxSpinnerService } from 'ngx-spinner';
import { fromEvent } from 'rxjs';
import { DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/service/notification.service';
import { masterService } from '../master.service';
import { ShareService } from '../share.service';
import { ToastrService } from 'ngx-toastr';





@Component({
  selector: 'app-empbranchview',
  templateUrl: './empbranchview.component.html',
  styleUrls: ['./empbranchview.component.scss']
})
export class EmpbranchviewComponent implements OnInit {
  @Output() onSubmit=new EventEmitter<any>();
  @Output() onCancel=new EventEmitter<any>();

  
  Empview:any=FormGroup;
 
  constructor( private fb:FormBuilder,private shareservice:ShareService,private spinner:NgxSpinnerService,private datepipe:DatePipe,private masterservice:masterService,
    private notification:NotificationService,private toastService:ToastrService) { }

  ngOnInit(): void {
  
    this.Empview=this.fb.group({
      'code':new FormControl('',Validators.required),
      'name':new FormControl('',Validators.required),
      'branch':new FormControl(''),
      'line1':new FormControl(''),
      'line2':new FormControl(''),
      'line3':new FormControl(''),
      'pincode':new FormControl(''),
      'city':new FormControl(''),
      'district':new FormControl(''),
      'state':new FormControl(''),
      'contacttype':new FormControl(''),
      'personname':new FormControl(''),
      'condesignation':new FormControl(''),
      'landline1':new FormControl('',[Validators.minLength(10),Validators.maxLength(10)]),
      'landline2':new FormControl('',[Validators.minLength(10),Validators.maxLength(10)]),
      'contactnumber':new FormControl('',[Validators.minLength(10),Validators.maxLength(10)]),
      'contactnumber2':new FormControl('',[Validators.minLength(10),Validators.maxLength(10)]),
      'conemailid':new FormControl('',[Validators.email]),
      'condob':new FormControl(''),
      'conwedday':new FormControl(''),
      'tanno':new FormControl('',[Validators.maxLength(10)]),
      'glno':new FormControl(''),
      'stdno':new FormControl(''),
      'incharge':new FormControl(''),
      'entity':new FormControl(''),
      'entitydetails':new FormControl(''),
      'gstin':new FormControl(''),
      'approverid':new FormControl('')
    });
    let data =this.shareservice.branchview.value
  console.log('view data',data);
  this.Empview.patchValue({
    'code':data['code'],
    'name':data['name'],
    'tanno':data['tanno'],
    'glno':data['glno'],
    'stdno':data['stdno'],
    'incharge':data['incharge'],
    'entity':data['entity'],
    'gstin':data['gstin'],
    'branch':data['control_office_branch']['name'],
    'line1':data['address']['line1'],
    'line2':data['address']['line2'],
    'line3':data['address']['line2'],
    'pincode':data['address']['pincode']['no'],
    'city':data['address']['city']['city_name'],
    'district':data['address']['district']['name'],
    'state':data['address']['state']['name'],
    'personname':data['contact']['name'],
    'condesignation':data['contact']['designation']['name'],
    'landline1':data['contact']['landline'],
    'landline2':data['contact']['landline'],
    'contactnumber':data['contact']['contactnumber'],
    'contactnumber2':data['contact']['contactnumber2'],
    'conemailid':data['contact']['email'],
    'condob':data['contact']['dob'],
    'conwedday':data['contact']['wedding_date']
  })

  }
  exit_empbranchview(){
    this.onCancel.emit();
  }

}
