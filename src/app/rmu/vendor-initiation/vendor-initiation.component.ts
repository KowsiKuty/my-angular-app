import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RmuApiServiceService } from '../rmu-api-service.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { environment } from 'src/environments/environment';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { NotificationService } from 'src/app/service/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-vendor-initiation',
  templateUrl: './vendor-initiation.component.html',
  styleUrls: ['./vendor-initiation.component.scss', '../rmustyles.css']
})
export class VendorInitiationComponent implements OnInit {
  url = environment.apiURL
  @ViewChild("closevendorpopup") closevendorpopup;
  @ViewChild('modalclose') modalclose: ElementRef;
  @ViewChild('actionclose') actionclose: ElementRef;
  @ViewChild('closevendordetailpopup') closevendordetailpopup;
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  summarylist = [];
  summaryform: FormGroup;
  vendorlist = []
  isLoading: boolean;
  vendorobject: any;
  rmuvendorid: any = { id: '', name: '', code: '' };
  toggle=false;
  vendor_initiation_searchvar:any = "String"
  vendor_initiation_search:any
  vendor_initiation_summary:any
  vendor_initiation_summaryapi:any
  checked: boolean = false;
  rulebutton:any
  is_blocked: any;
  vendorfield:any
  vendorvar:any
  email_validation_test: boolean;
  edit_data_id: any;
  edit_key: string;
  email_contact_validation_test: boolean;
  constructor(private fb: FormBuilder, private rmuservice: RmuApiServiceService,private notification: NotificationService,private SpinnerService: NgxSpinnerService) { 
  
  }
  contact:FormGroup;
  ngOnInit(): void {
    this.summaryform = this.fb.group({
      query: '',
      status: ''
    });

    this.contact=this.fb.group({
      name:'',
      mobile:'',
      email:'',
      another:'',
      anotheremail:'',
      address:''
    })
    this.getsummary();

  }
  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.getsummary()
  }

  prevpage() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1
    }
    this.getsummary()
  }

  getvendor(val) {
    this.isLoading = true;
    this.rmuservice.getmastervendor(val).subscribe(res => {
      this.isLoading = false;
      this.vendorlist = res['data']

    })
  }
  autoshow(subject) {
    return subject ? '(' + subject.code + ') ' + subject.name : undefined
  }
  getsummary() {
    let val = this.summaryform.value.query?this.summaryform.value.query:"";
  let status= this.summaryform.value.status?this.summaryform.value.status:'';
  this.SpinnerService.show()
    this.rmuservice.vendor_summary(val, status,this.pagination.index).subscribe(results => {
this.SpinnerService.hide()
      this.summarylist = results['data'];
      this.pagination = results.pagination ? results.pagination : this.pagination;
    })


  }

  check(data){ 
    console.log(data)
  }
  clear(){
    this.summaryform.reset()
    this.getsummary()
  }

  creatermuvendor() {
    let payload = { vendor_code: this.vendorobject }
    this.rmuservice.creatermuvendor(payload).subscribe(res => {
      if (res.status == 'success') {
        this.closedpopup()
        this.vendorvar = []
        // this.modalclose.nativeElement.click()
        // this.getsummary()
        this.vendor_initiation_summaryapi = {"method": "get", "url": this.url + "rmuserv/vendor",params: ""}
      }
    })
  }
  removermuvendor(code) {
    this.is_blocked = code?.id;
    this.SpinnerService.show()
    this.rmuservice.deletermuvendor(this.is_blocked).subscribe(res => {
      this.SpinnerService.hide()
    console.log("resvghfhg",res)
      if(res.status==="success"){
        this.notification.showSuccess(res.message)
        this.closedvenpopup()
        this.contact.reset()
        this.getsummary()
      }else{
        this.notification.showError(res.message)
      }
    })
  }

  vendor_initiation_summarysearch(vendor){
    this.vendor_initiation_summaryapi = {"method": "get", "url": this.url + "rmuserv/vendor",params: vendor}
  }

  closedpopup() {
    this.closevendorpopup.nativeElement.click();
  }

  closedvenpopup(){
    this.closevendordetailpopup.nativeElement.click()
  }
  popupopen_vendor() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("vendormodal"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }

  vendor_create(){
    this.contact.reset()
    this.popupopen_vendordetails()
  }
  popupopen_vendordetails() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("vendordetailsmodal"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }

  togglefunction(branch) {
    let config: any = {
      disabled: false,
      style: "",
      class: "",
      value: "",
      checked: "",
      function: false,
    };

    if(branch.status == 1){
      config = {
        disabled: false,
        style: "",
        class: "",
        value: "",
        checked: !this.checked,
        function: true,
      };
    }
    else if (branch.status == 0){
      config = {
        disabled: false,
        style: "",
        class: "",
        value: "",
        checked: this.checked,
        function: true,
    }
  }
  return config
}

vendordata(ven){
this.vendorobject = ven.code
}

only_nummber(event) {
  event.target.value = event.target.value.replace(/[^0-9]/g, '');
}

only_contact_nummber(event){
  event.target.value = event.target.value.replace(/[^0-9]/g, '');
}

email_validation(event){
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValidEmail = emailPattern.test(event.target.value);
  console.log("isValidEmail",isValidEmail);
  this.email_validation_test=isValidEmail
  // if(this.frs_payment.value.custype?.id===4){
  if(this.email_validation_test === false){
    this.notification.showWarning("Please  Enter the Valid Email");
    return false;
  }

}

email_contact_validation(event){
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValidEmail = emailPattern.test(event.target.value);
  console.log("isValidEmail",isValidEmail);
  this.email_contact_validation_test=isValidEmail
  if(this.email_contact_validation_test === false){
    this.notification.showWarning("Please  Enter the Contact Valid Email");
    return false;
  }
}

edit_vendor(sum){
  this.edit_key="edit"
  this.edit_data_id=sum?.id
this.contact.patchValue({
      name:sum.name,
      mobile:sum.mobile_no,
      email:sum.email_id,
      another:sum.contact_person,
      anotheremail:sum.contact_email_id,
      address:sum.address
})
this.popupopen_vendordetails()
} 

contact_detail_submit(){
  let param
  if (!this.contact.value.name) {
    this.notification.showWarning( "Please  Enter The Name");
    return false;
  } 
  if (!this.contact.value.mobile) {
    this.notification.showWarning( "Please  Enter The Mobile Number");
    return false;
  } else{
    if (this.contact.value.mobile.length < 10) {
      this.notification.showWarning( "Please  Enter Valid Mobile Number");
      return false;
    } 
  }
  if (!this.contact.value.email) {
    this.notification.showWarning( "Please  Enter The Email");
    return false;
  } 
   
  if(this.contact.value.email =="" || this.contact.value.email == undefined || this.contact.value.email == null){

  }else{
   if(this.email_validation_test === false){
    this.notification.showWarning( "Please  Enter the Valid Email");
    return false;
  }
}
if (!this.contact.value.another) {
  this.notification.showWarning( "Please  Enter The Another Contact Mobile Number");
  return false;
}else{
if (this.contact.value.another.length < 10) {
  this.notification.showWarning( "Please  Enter The Another Contact Valid Mobile Number");
  return false;
}  
}
if(this.contact.value.anotheremail =="" || this.contact.value.anotheremail == undefined || this.contact.value.anotheremail == null){

}else{
 if(this.email_contact_validation_test === false){
  this.notification.showWarning( "Please  Enter The Another Contact Valid Email");
  return false;
}
}
if (!this.contact.value.address) {
  this.notification.showWarning( "Please  Enter The Address");
  return false;
}
  if(this.edit_key==="edit"){
    param={
      "name":  this.contact.value.name?this.contact.value.name:"",
      "mobile_no":  this.contact.value.mobile?  this.contact.value.mobile:"",
      "email_id":  this.contact.value.email?  this.contact.value.email:'',
      "contact_person":  this.contact.value.another?  this.contact.value.another:'',
      "address":  this.contact.value.address?  this.contact.value.address:'',
      "contact_email_id": this.contact.value.anotheremail?  this.contact.value.anotheremail:'',
      "id":this.edit_data_id?this.edit_data_id:''
      } 
  }else{
    param={
      "name":  this.contact.value.name?this.contact.value.name:"",
      "mobile_no":  this.contact.value.mobile?  this.contact.value.mobile:"",
      "email_id":  this.contact.value.email?  this.contact.value.email:'',
      "contact_person":  this.contact.value.another?  this.contact.value.another:'',
      "address":  this.contact.value.address?  this.contact.value.address:'',
      "contact_email_id": this.contact.value.anotheremail?  this.contact.value.anotheremail:'',
      } 
  }
  this.SpinnerService.show()
    this.rmuservice.contact_details(param).subscribe(res => {
      this.SpinnerService.hide()
      if(res.status==="success"){
        this.notification.showSuccess(res.message)
        this.closedvenpopup()
        this.contact.reset()
        this.getsummary()
      }else{
        this.notification.showError(res.message)
      }

    })
}
}
