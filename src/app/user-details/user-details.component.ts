import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormArray, FormControl } from '@angular/forms';
import { formatDate, DatePipe } from '@angular/common';
import { MatSnackBar } from "@angular/material/snack-bar";
import { VowService } from '../service/vow.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  User : FormGroup;
  UserAdd:FormGroup
  issupplier:boolean=false
  isLinear = true;
  rolllist =[
    {
    id: 1,
    text: "Users"
  },{
    id: 2,
    text: "Admin"
  },{
    id: 3,
    text: "Branch Admin"
  },
]
  rollval: any;
 
  constructor(private vowService: VowService,private fb: FormBuilder, private datePipe: DatePipe,private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.User  = this.fb.group({
      name:"",
      password:"",
      code:""
  });
  this.UserAdd  = this.fb.group({
    username:"",
    password:"",
    confirmpassword:"",
    roll:"",
    supplier:""
    
});
  }
  rolls(e){
    this.rollval=e
    if(this.rollval==1||this.rollval==3){
      this.issupplier=true
    }
    else{
      this.issupplier=false
    }
  }
  showSnackbarTopPosition(content, action, duration) {
    this.snackBar.open(content, action, {
      duration: 2000,
      verticalPosition: "top", // Allowed values are  'top' | 'bottom'
      horizontalPosition: "end", // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
      panelClass: ["custom-style"]
    });
  }
  submit_user_details(){
    
  }
  submit_user_bio() {
    this.vowService.user_bio(this.User.value)
      .subscribe((res) => {
        console.log("bio",res)
      })
   
    
  }
}

