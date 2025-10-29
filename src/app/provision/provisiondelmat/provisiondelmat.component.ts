
import { Component, OnInit,Inject, Injectable } from '@angular/core';
import { ProisionshareserviceService } from '../proisionshareservice.service';
import { ProvisionService } from '../provision.service'
import { NotificationService } from '../notification.service'; 
import {ErrorHandlingprovisionService} from'../error-handlingprovision.service'    
import { Router, ActivatedRoute } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-provisiondelmat',
  templateUrl: './provisiondelmat.component.html',
  styleUrls: ['./provisiondelmat.component.scss']
})
export class ProvisiondelmatComponent implements OnInit {
  delmatdata: any;
  has_next=false;
  has_previous=false;
  presentpage=1;
  Delmat=false;

  constructor(  private fb: FormBuilder,private Service: ProvisionService,private notification: NotificationService,private SpinnerService: NgxSpinnerService,private errorHandler:ErrorHandlingprovisionService,public share :ProisionshareserviceService,public router:Router)  {
   }

   ngOnInit(): void {

    // this.subModuleData()
  }

subModuleData(){
  this.delamatsmry(1);
  this.Delmat=true;
}
  public delamatsmry(q){
    this.Service.delmat(q)
      .subscribe((results: any[]) => {
        this.delmatdata = results["data"];
        if (this.delmatdata.length > 0) {
          this.has_next = results['pagination'].has_next;
          this.has_previous = results['pagination'].has_previous;
          this.presentpage = results['pagination'].index;
        }
        else{
          this.delmatdata=[];
        }
      })

  }

  nextClick() {
    if (this.has_next === true) {
      
        this.presentpage = this.presentpage + 1
        this.delamatsmry(this.presentpage)
      
    }
  }

  previousClick() {
    if (this.has_previous === true) {

      this.presentpage = this.presentpage - 1
      this.delamatsmry(this.presentpage)
    }
  }

  adddelmat(data){

    if (data=='add'){
      this.share.delmatdta.next('')}
      else{
        this.share.delmatdta.next(data)
      }
    this.router.navigate(['/delamtadd'], {
      skipLocationChange: true
    })
  }

}
