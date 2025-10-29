import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FormGroupName, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { SGShareService } from '../share.service';
import { NotificationService } from 'src/app/service/notification.service';
import { SGService } from '../SG.service';

@Component({
  selector: 'app-securitylogin',
  templateUrl: './securitylogin.component.html',
  styleUrls: ['./securitylogin.component.scss']
})
export class SecurityloginComponent implements OnInit {
  vendor=true
  client=false
  nonemp=false
  Nonemplogin:FormGroup
  clientlogin:FormGroup
  Vendorlogin:FormGroup

  username:FormControl
  password:FormControl
  idValue:any


  constructor(private fb: FormBuilder,private shareservice:SGShareService,private  sgservice:SGService,private notification:NotificationService) { }

  ngOnInit(): void {

    this.clientlogin=this.fb.group({
      username:['',Validators.required],
      password:['',Validators.required]
    })

    this.Nonemplogin=this.fb.group({
      username:['',Validators.required],
      password:['',Validators.required]
    })

    this.Vendorlogin=this.fb.group({
      username:['',Validators.required],
      password:['',Validators.required]
    })

  }
  onChange(event: MatTabChangeEvent) {
    const tab = event.tab.textLabel;
    console.log(tab);
    if(tab==="Vendor Login")
     { 
       this.vendorlo()
      // document.getElementById("employecat").style.fontWeight="bold";
       console.log("function want  implement");
      }
      if(tab==="Client Login")
     {
       this. clientlo()
      //  document.getElementById("Employeetype").style.fontWeight="bold";
       console.log("function want to implement");
      }
      if(tab==="Non Employee Login"){
        // document.getElementById("state").style.fontWeight="bold";
        this.nonemployee()
        
       
        
      }

  }
  VendorSubmitForm(){

    console.log(this.Vendorlogin.value)
    if (this.idValue == undefined) {
      this.sgservice.creatvendorlogin(this.Vendorlogin.value, '')
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          }
          
          else {
            this.notification.showSuccess("Success")
            
          }
          this.idValue = result.id;
        })
    } else {   
      this.sgservice.creatvendorlogin(this.Vendorlogin.value, this.idValue)
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          }
          
          else {
            this.notification.showSuccess("Success...")
            
          }
        })
      }   
  }

  ClientSubmitForm(){
    console.log(this.clientlogin.value)
    
    if (this.idValue == undefined) {
      this.sgservice.creatclientlogin(this.clientlogin.value, '')
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          }
          
          else {
            this.notification.showSuccess("Success")
            
          }
          this.idValue = result.id;
        })
    } else {   
      this.sgservice.creatclientlogin(this.clientlogin.value, this.idValue)
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          }
          
          else {
            this.notification.showSuccess("Success...")
            
          }
        })
      }

  }

  NonempSubmitForm(){
    
    console.log(this.Nonemplogin.value)

    if (this.idValue == undefined) {
      this.sgservice.creatnonemplogin(this.Nonemplogin.value, '')
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          }
          
          else {
            this.notification.showSuccess("Success")
            
          }
          this.idValue = result.id;
        })
    } else {   
      this.sgservice.creatnonemplogin(this.Nonemplogin.value, this.idValue)
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          }
          
          else {
            this.notification.showSuccess("Success...")
            
          }
        })
      }

  }
  

  vendorlo()
  {
    this.vendor=true
  this.client=false
  this.nonemp=false

  }
  clientlo()
  {
    this.vendor=false
    this.client=true
    this.nonemp=false
  }
  nonemployee()
  {
    this.vendor=false
    this.client=false
    this.nonemp=true

  }
}
