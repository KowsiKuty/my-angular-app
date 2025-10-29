import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-returnform',
  templateUrl: './returnform.component.html',
  styleUrls: ['./returnform.component.scss']
})
export class ReturnformComponent implements OnInit {

  constructor(private fb : FormBuilder) { }
  isLinear : any;
  returnrequestForm : FormGroup;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  
  ngOnInit(): void {

    this.returnrequestForm = this.fb.group({
      FormArray : this.fb.array([
        this.firstFormGroup = this.fb.group({
        doctype: ['', Validators.required],
        num_of_boxes :'',
        fromSeries: '',
        toSeries: '',
        vendors:'',
        comments:'',
       }),
       this.secondFormGroup = this.fb.group({
          secondCtrl: ['', Validators.required],
          address: '',
          contacts: '',
       }),
     ])

    })
  }

}
