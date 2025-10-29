import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-removal',
  templateUrl: './removal.component.html',
  styleUrls: ['./removal.component.scss']
})
export class RemovalComponent implements OnInit {
 
  removalsummary : FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.removalsummary = this.fb.group({
      barcode_num : '',
      fromDate : '',
      toDate : '',
      expires: '',
      actions :  ''
      
    })
  }

}
