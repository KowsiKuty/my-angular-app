import { Component, OnInit,EventEmitter,Output,ViewChild,HostListener } from '@angular/core';
import {TaService} from "../ta.service";
import {Router} from "@angular/router";
import {NotificationService} from '../notification.service'
import{FormGroup, FormBuilder} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms'; //BUG 8210 FIX *30/03/2023
@Component({
  selector: 'app-commondropdown-master',
  templateUrl: './commondropdown-master.component.html',
  styleUrls: ['./commondropdown-master.component.scss']
})
export class CommondropdownMasterComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.SpinerService.hide();
    }
  }
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>(); 
  @ViewChild('closebutton') closebutton; 
  @ViewChild('closebuttons') closebuttons; 
  @ViewChild('tacommondropdownForm') tacommondropdownForm: NgForm; //BUG 8210 FIX *30/03/2023
  getcommondropdownList:any;
  getcommondropdowndetailList:any;
  commondropdownForm:FormGroup;
  dropdownmodel:any;
  dropdowndetailmodel:any;
  showdropdown =false;
  showdropdowndetail=false;
  dropdown=false;
  dropdowndetail=true;
  name:any;
  has_next=true;
  has_previous=true;
  currentpage=1;
 dropdownid:any;
 pagesize = 10;
 commondropeditform: FormGroup;
 commondropdetaileditform: FormGroup;
 SearchValues: any;
 nameSearchForm: FormGroup;
 searchtable_data: any;


  constructor(private taService:TaService,private router:Router,private SpinerService: NgxSpinnerService,public spinner:NgxSpinnerService,
    private notification:NotificationService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    console.log("Common dropdown Componenet")
    this.dropdownmodel={
      name:'',
      entity:'',
      code:'',
     
    }
    this.dropdowndetailmodel={
      name:'',
      entity:'',
      value:'',
      common_drop_down_id:''
     
    }
    this.commondropeditform=this.formBuilder.group({
      name: null,
      code: null,
      entity:null,
      id: null,
   
    })
    this.commondropdetaileditform=this.formBuilder.group({
      name: null,
      value: null,
      common_drop_down_id: null,
      entity:null,
      id: null,
   
    })

    this.nameSearchForm=this.formBuilder.group({
      SearchValues : [''],
   
    })
    this.getcommondropdownsummary(this.currentpage);
  }
  totalcount:any;
  getcommondropdownsummary(page){
    this.SpinerService.show()
    this.taService.getCommondropdownSummary(page)
    .subscribe((results: any[]) => {
    let datas = results['data'];
    this.getcommondropdownList = datas;
    this.totalcount=results['count'];
    let datapagination = results['pagination']
    if (this.getcommondropdownList.length >= 0) {
      this.has_next = datapagination.has_next;
      this.has_previous = datapagination.has_previous;
      this.currentpage = datapagination.index;
    }
   this.SpinerService.hide()
    
  })
  }
  editcommondropdowndetail(data)
 {
  this.commondropdetaileditform.patchValue({
    name:data.name,
    value:data.value,   
    entity: data.entity,
    id:data.id,
  })
}
  resetform(){
    let myfrom = this.nameSearchForm;
    myfrom.patchValue({
      name: '',
      code: '',
      entity:'',
      id: '',
      value: '',
      common_drop_down_id: '',
    })
  this.getcommondropdownsummary(this.currentpage);
    
  }
  previousClick(){
    if(this.has_previous == true){
      this.getcommondropdownsummary(this.currentpage -1)
    }
  }

  nextClick(){
    if(this.has_next == true){
      this.getcommondropdownsummary(this.currentpage +1)
    }
  }
  deletedata(id){
    this.taService.deletecommondropdown(id)
   .subscribe(result =>  {
    this.notification.showSuccess("Deleted Successfully")
    this.getcommondropdownsummary(this.currentpage);
    return true

   })
 
 }

 editcommondropdown(data)
 {

  this.commondropeditform.patchValue({
    name:data.name,
    code:data.code,
    entity: data.entity,
    id:data.id,
  })
}
 
 submitForm(){
  if (this.dropdownmodel.name  == '' || this.dropdownmodel.name == null) { //BUG 8210 FIX *30/03/2023
    console.log('show error in name')
    this.notification.showError('Please Enter Name')
    throw new Error;
  }
  if (this.dropdownmodel.entity  == '' || this.dropdownmodel.entity == null) { //BUG 8210 FIX *30/03/2023
    console.log('show error in entity')
    this.notification.showError('Please Enter Entity')
    throw new Error;
  }
  if (this.dropdownmodel.code  == '' || this.dropdownmodel.code == null) { //BUG 8210 FIX *30/03/2023
    console.log('show error in code')
    this.notification.showError('Please Enter Code')
    throw new Error;
  }

   this.spinner.show()
   this.taService.createCommondropdown([this.dropdownmodel])
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
     this.getcommondropdownsummary(this.currentpage);
     this.onSubmit.emit();
     this.tacommondropdownForm.resetForm(); //BUG 8210 FIX *30/03/2023
     return true
     }
   })

 }
 OnCancelclick(){
   this.onCancel.emit()
   this.router.navigateByUrl('ta/ta_master');
   this.tacommondropdownForm.resetForm(); //BUG 8210 FIX *30/03/2023
 }
 
 getdata(e,id,name){
  this.name=name;
  if(e.target.checked){
   
    this.dropdown=true;
    this.dropdowndetail=false;
    this.showdropdowndetail=true
    this.dropdownid=id;
   
  }
  else{
    this.dropdown=false;
    //changed the value from true to false to make the checkbox uncheck work 01/06/22
    this.dropdowndetail=false;
    this.showdropdowndetail=false
    this.dropdownid=id;
    //changed the value from true to false to make the checkbox uncheck work 01/06/22
  }
  this.taService.getCommondropdownselectedSummary(id)
  .subscribe((results: any[]) => {
  let datas = results['data'];
  this.getcommondropdowndetailList = datas;
  
  })
 }
 
 deletedetail(id){
  this.taService.deletecommondropdowndetail(id)
  .subscribe(result =>  {
   this.notification.showSuccess("Deleted Successfully")
   this.getcommondropdownsummary(this.currentpage);
   return true

  })

 }
 reset(){
  this.dropdowndetailmodel.common_drop_down_id
 }
 
 submitdetailForm(){
  this.spinner.show()
  this.dropdowndetailmodel.common_drop_down_id = this.dropdownid;
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
    this.getcommondropdownsummary(this.currentpage);
    this.onSubmit.emit();
    return true
    }
  })
}

OnCanceldetailclick(){
  this.onCancel.emit()
  this.router.navigateByUrl('ta/ta_master');
}
updateForm()
 {
  console.log("Entering Edit Section", this.commondropeditform.value.date + this.commondropeditform.value.holidayname)
  if(this.commondropeditform.value.name == '' || this.commondropeditform.value.name == null){
    console.log(this.commondropeditform.value.name)
    console.log('show error in name')
    this.notification.showError('Please Enter Name')
    throw new Error;
  }

  if(this.commondropeditform.value.code == '' || this.commondropeditform.value.code == null){
    console.log('show error in code')
    console.log("Value is",  this.commondropeditform.value.code)
    this.notification.showError('Please Enter Code')

    throw new Error;

  }
  if(this.commondropeditform.value.entity == '' || this.commondropeditform.value.entity == null){
    console.log('show error in entity')
    console.log("Value is",  this.commondropeditform.value.entity)
    this.notification.showError('Please Enter Entity')


    throw new Error;

  }
  this.taService.commondropdownedit(this.commondropeditform.value).subscribe(res => {
    console.log("ERRORS")
    console.log(res)
    if (res.status === "success") {
      this.notification.showSuccess('Common DropDown Updated Successfully')
      this.closebuttons.nativeElement.click();
      this.getcommondropdownsummary(this.currentpage);
      return true;
    } else {
      this.notification.showError(res.description)
      return false;
    }
  })
 }

 updateDetailForm()
 {
  console.log("Entering Edit Section", this.commondropeditform.value.date + this.commondropeditform.value.holidayname)
  if(this.commondropdetaileditform.value.name == '' || this.commondropdetaileditform.value.name == null){
    console.log(this.commondropdetaileditform.value.name)
    console.log('show error in name')
    this.notification.showError('Please Enter Name')
    throw new Error;
  }

  if(this.commondropdetaileditform.value.value == '' || this.commondropdetaileditform.value.value == null){
    console.log('show error in value')
    console.log("Value is",  this.commondropdetaileditform.value.value)
    this.notification.showError('Please Enter Value')

    throw new Error;

  }
  if(this.commondropdetaileditform.value.entity == '' || this.commondropdetaileditform.value.entity == null){
    console.log('show error in common drop down id')
    console.log("Value is",  this.commondropdetaileditform.value.entity)
    this.notification.showError('Please Enter Entity')

    throw new Error;

  }
  this.taService.commondropdowndetailedit([this.commondropdetaileditform.value]).subscribe(res => {
    console.log("ERRORS")
    console.log(res)
    if (res.status === "success") {
      this.notification.showSuccess('Common DropDown Updated Successfully')
      
      return true;
    } else {
      this.notification.showError(res.description)
      return false;
    }
  })


 }

 
 nameSearch()
 {
  this.SearchValues = this.nameSearchForm.value.SearchValues;
  if (this.SearchValues != null) {
    this.getSearchs(this.SearchValues)
  }
  else
  {
    this.getcommondropdownsummary(this.currentpage);
  }
}
getSearchs(val)
{
  this.searchNames(val, 1)
}
searchNames(data, pageNo) {
  console.log("Search Data")
  this.SpinerService.show()
      this.taService.getSearchCommonNames(data, pageNo).subscribe(res => {
      this.searchtable_data = res['data']
      let datas = res["data"];
      this.totalcount = res['count'];
      this.getcommondropdownList = datas;
      this.SpinerService.hide();
      })



}


  }


