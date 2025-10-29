import { Component, OnInit,EventEmitter,Output,ViewChild ,HostListener} from '@angular/core';
import {TaService} from "../ta.service";
import {Router} from "@angular/router";
import {NotificationService} from '../notification.service'
import{FormGroup} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-commondropdowndetail-master',
  templateUrl: './commondropdowndetail-master.component.html',
  styleUrls: ['./commondropdowndetail-master.component.scss']
})
export class CommondropdowndetailMasterComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.SpinerService.hide();
    }
  }
  dropdowndetailmodel:any;
  getcommondropdowndetailList:any;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>(); 
  @ViewChild('closebutton') closebutton; 
  @ViewChild('tacommondropdownForm') tacommondropdownForm: NgForm;
  dropdowndetailForm:FormGroup;
  dropdownlist:any;
  currentpage = 1;
  constructor(private taService:TaService,private router:Router,
    private notification:NotificationService,private SpinerService:NgxSpinnerService,public spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.dropdowndetailmodel={
      name:'',
      entity:'',
      reason:'',
      common_drop_down_id:''
     
    }
    this.getcommondropdowndetailsummary();
    this.getcommondropdownsummary(this.currentpage);
  }
  getcommondropdownsummary(page){
    this.taService.getCommondropdownSummary(page)
    .subscribe((results: any[]) => {
    let datas = results['data'];
    this.dropdownlist = datas;
   
    
  })
  }
  getcommondropdowndetailsummary(){
    this.taService.getCommondropdowndetailSummary()
    .subscribe((results: any[]) => {
    let datas = results['data'];
    this.getcommondropdowndetailList = datas;
    
  })
  }
  deletedetail(id){
    this.taService.deletecommondropdowndetail(id)
   .subscribe(result =>  {
    this.notification.showSuccess("Deleted Successfully")
    this.getcommondropdowndetailsummary();
    return true

   })
 
 }
 
 submitForm(){
  this.spinner.show()
   this.taService.createCommondropdowndetail([this.dropdowndetailmodel])
   .subscribe(res=>{
    this.spinner.hide()
     if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
      this.spinner.hide()
       this.notification.showWarning("Duplicate! Code Or Name ...")
     } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
      this.spinner.hide()
       this.notification.showError("INVALID_DATA!...")
     }
     else{
      this.spinner.hide()
     this.notification.showSuccess("Successfully Created")
     this.closebutton.nativeElement.click();
     this.getcommondropdowndetailsummary();
     this.onSubmit.emit();
     this.tacommondropdownForm.resetForm();
     return true
     }
   })
 }
 OnCancelclick(){
   this.onCancel.emit()
   this.router.navigateByUrl('ta/commondropdowndetail');
   this.tacommondropdownForm.resetForm();
 }


}
