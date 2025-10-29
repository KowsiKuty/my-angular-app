import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormArray} from '@angular/forms';

@Component({
  selector: 'app-returnrequest',
  templateUrl: './returnrequest.component.html',
  styleUrls: ['./returnrequest.component.scss']
})
export class ReturnrequestComponent implements OnInit {

  isLinear : any;
  title = 'materialApp';   
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  archivalreqForm : FormGroup;
  constructor(private _formBuilder: FormBuilder) {}
  ngOnInit() {

   this.archivalreqForm = this._formBuilder.group ({
      FormArray : this._formBuilder.array([
     this.firstFormGroup = this._formBuilder.group({
      doctype: ['', Validators.required],
      num_of_boxes :'',
      fromSeries: '',
      toSeries: '',
      comments:'',
     }),
     this.secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required],
        address: '',
        contacts: '',
     }),
   ])
   });
   
  }
  formatdownload(){

}

}
