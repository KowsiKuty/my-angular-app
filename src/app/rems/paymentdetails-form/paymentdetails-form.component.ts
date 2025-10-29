import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-paymentdetails-form',
  templateUrl: './paymentdetails-form.component.html',
  styleUrls: ['./paymentdetails-form.component.scss']
})
export class PaymentdetailsFormComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
