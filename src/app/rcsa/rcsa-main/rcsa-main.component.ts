import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-rcsa-main',
  templateUrl: './rcsa-main.component.html',
  styleUrls: ['./rcsa-main.component.scss']
})
export class RcsaMainComponent implements OnInit {

  rcasformquestion: FormGroup;
  page = 1

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {

    this.rcasformquestion = this.fb.group({
      questarray: new FormArray([this.questionarrayget()]),
    })

  }

  questionarrayget() {
    let group = this.fb.group({
      title: [''],
      applicable: [''],
      functional_area: [''],
      sub_pga: [''],
      risk: [''],
      risk_family: [''],
      risk_rating: [''],
      process_control: [''],
      test_procedure: [''],
      observation: [''],
      result: [''],
      cap: [''],
      cap_description: [''],
      cap_tgt_dt: [''],
    });
    return group
  }

  addquest() {
    const data = this.rcasformquestion.get('questarray') as FormArray;
    data.push(this.questionarrayget());
  }

  deletequest(i) {
    let index = this.findindex(i);
    (<FormArray>this.rcasformquestion.get('questarray')).removeAt(index);
  }

  findindex(i) {
    return 10 * (this.page - 1) + i;
  }

}
