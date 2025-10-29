import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormArray, FormControl } from '@angular/forms'
import { UserDetailsService} from '../user-details.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.scss']
})
export class UserSummaryComponent implements OnInit {
  summaryList: any;


   
  ispaymentpage: boolean = true;
  userpresentpage: number = 1;
  userpagesize = 10;
  has_usernext = true;
  has_userprevious = true;

  constructor(private fb: FormBuilder,private userService: UserDetailsService,private router: Router) { }

  ngOnInit(): void {
    this.GetUser_Summary();
  }

   // user summary details
   GetUser_Summary() {

    this.userService.GetUser_SummaryDetails()
      .subscribe((results: any[]) => {
          console.log("usersummarydetails", results)
          let datas = results["data"];
          this.summaryList = datas;
      })
   
    
  }



  // nextClickPayment() {
  //   if (this.has_paymentnext === true) {
  //     this.getSummaryList(this.send_value,this.paymentpresentpage + 1)
  //   }
  // }

  // previousClickPayment() {
  //   if (this.has_paymentprevious === true) {
  //     this.getSummaryList(this.send_value,this.paymentpresentpage - 1)
  //   }


  // }



  userCreation(){
    this.router.navigate(['user/usercreation']);
  }

}
