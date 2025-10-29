import { Component, OnInit } from '@angular/core';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";

export const PICK_FORMATS = {
  parse: {dateInput: {month: 'short', year: 'numeric', day: 'numeric'}},
  display: {
      dateInput: 'input',
      monthYearLabel: {year: 'numeric', month: 'short'},
      dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
      monthYearA11yLabel: {year: 'numeric', month: 'long'}
  }
};
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
      if (displayFormat === 'input') {
          return formatDate(date,'dd-MMM-yyyy',this.locale);
      } else {
          return date.toDateString();
      }
  }
}
@Component({
  selector: 'app-fleetmaker-summary',
  templateUrl: './fleetmaker-summary.component.html',
  styleUrls: ['./fleetmaker-summary.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
    DatePipe
]
})
export class FleetmakerSummaryComponent implements OnInit {
  fleetIdentificationSearch : FormGroup;

  constructor(private datePipe: DatePipe,private fb:FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.fleetIdentificationSearch = this.fb.group({
      name: [''],
      code: [''],
    })
  }
  addIdentificationForm(){
    this.router.navigateByUrl('vfm/fleet_maker');
  }
}
