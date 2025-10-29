import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Address } from '../address.model';
@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  formInstance: FormGroup;

  constructor(public activeModal: NgbActiveModal) {
    this.formInstance = new FormGroup(
      {
        addressLine1: new FormControl('', Validators.required),
        addressLine2: new FormControl(''),
        city: new FormControl('', Validators.required),
        zipCode: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
      }
    )
  }


  save(){
   
    this.activeModal.close
         (Object.assign(new Address(), this.formInstance.value));
         
 }

  ngOnInit(): void {
  }

}
