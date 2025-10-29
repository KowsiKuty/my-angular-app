import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TqService } from '../tq.service';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { formatDate, DatePipe } from '@angular/common';


@Component({
  selector: 'app-tq-query',
  templateUrl: './tq-query.component.html',
  styleUrls: ['./tq-query.component.scss']
})
export class TqQueryComponent implements OnInit {

  tqQueryForm: FormGroup;
  constructor(private tqService: TqService, private fb: FormBuilder, private datePipe: DatePipe, ) { }
  tqQueryData: any;
  keyValue = [];
  createDate: Date;
  updateDate:Date;
  ngOnInit(): void {
    this.tqQueryForm = this.fb.group({
      key: []
    })
  }



  tqQuery() {
    this.tqService.tqQuery(this.tqQueryForm.value)
      .subscribe(result => {
        this.tqQueryData = result;
        this.tqQueryData.forEach(element => {
          this.createDate = new Date(element.created_date)
          this.updateDate = new Date(element.updated_date)
          element.created_date = this.datePipe.transform(this.createDate, 'dd-MMM-yyyy-hh:mm:ss a')
          element.updated_date = this.datePipe.transform(this.updateDate, 'dd-MMM-yyyy-hh:mm:ss a')
        });
        this.keyValue = Object.keys(this.tqQueryData[0])
      })
  }
}
