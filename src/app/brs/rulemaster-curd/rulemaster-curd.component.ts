import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BrsApiServiceService } from '../brs-api-service.service';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: 'app-rulemaster-curd',
  templateUrl: './rulemaster-curd.component.html',
  styleUrls: ['./rulemaster-curd.component.scss']
})
export class RulemasterCurdComponent implements OnInit {
  rulemaster:FormGroup
  rulesummary: any;

  constructor(private fb: FormBuilder, private brsService: BrsApiServiceService,private notification: NotificationService,private SpinnerService: NgxSpinnerService,public datepipe: DatePipe,
    private router: Router,) { }

  ngOnInit(): void {
  }

  rule_search(){
    let order = ''
    let status = ''
    this.SpinnerService.show()
    this.brsService.rulemaster(order,status).subscribe((results: any) => {
      this.SpinnerService.hide()
      this.rulesummary = results["data"];
    });
  }

}
