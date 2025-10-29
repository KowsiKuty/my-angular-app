import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RemsService } from '../rems.service';

@Component({
  selector: 'app-remsanalysis',
  templateUrl: './remsanalysis.component.html',
  styleUrls: ['./remsanalysis.component.scss']
})
export class RemsanalysisComponent implements OnInit {
  AnalysisForm: FormGroup;
  json2: any;
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
    private remsService: RemsService) { }

  ngOnInit(): void {
    this.AnalysisForm = this.formBuilder.group({
      fcn_method: ['', Validators.required],
      fcn_url: ['', Validators.required],
      fcn_json1: ['', Validators.required],
    });

  }

  Analysis() {
    console.log("analysis calling")
  }

}
