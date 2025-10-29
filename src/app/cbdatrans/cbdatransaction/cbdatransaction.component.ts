import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDatepicker } from "@angular/material/datepicker";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import * as _moment from "moment";
import { CbdatransactionserviceService } from "../cbdatransactionservice.service";
import { NgxSpinnerService } from "ngx-spinner";
import { error } from "console";
export interface PriorityValue {
  id: string;
  name: string;
}
const moment = _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: "MM/YYYY",
  },
  display: {
    dateInput: "MM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

@Component({
  selector: "app-cbdatransaction",
  templateUrl: "./cbdatransaction.component.html",
  styleUrls: ["./cbdatransaction.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CbdatransactionComponent implements OnInit {
  MonthYear = new FormControl(moment());
  @Input() disabled: boolean = false;
  @Output() ngOutput = new EventEmitter<any>();
  transactionForm: FormGroup;
  statuslist:any;
  creationForm:FormGroup;
   new_header: any = ["sl", "name", "desc", "rrr", "vvv", "ddd", "uuu"];
  shownColumns: string[] = [];

  new_body: any = [
    { sl: 1, name: "name1", desc: "desc1", rrr: "r1", vvv: "v1" },
    { sl: 2, name: "name2", desc: "desc2", rrr: "r2", vvv: "v2" },
    { sl: 3, name: "name3", desc: "desc3", rrr: "r3", vvv: "v3" },
  ];
  GenerateData=[]
  columnValues: any = {
    ddd: ["rfef", "rfvfve", "r3"],
    uuu: ["x1", "x2", "x3"],
  };
  constructor(private fb: FormBuilder,private cbdaservice:CbdatransactionserviceService,private spinnerservice:NgxSpinnerService) {}
  ngOnInit(): void {
    this.transactionForm = this.fb.group({
      statusinput: [""],
    });
    this.creationForm = this.fb.group({

    })
  }

  chosenYearHandler(normalizedYear: any) {
    const ctrlValue = this.MonthYear.value || moment();
    ctrlValue.year(normalizedYear.year());
    this.MonthYear.setValue(ctrlValue);
  }
  statusapi() {
    this.statuslist = ""
  }
  chosenMonthHandler(normalizedMonth: any, datepicker: MatDatepicker<any>) {
    const ctrlValue = this.MonthYear.value || moment();
    ctrlValue.month(normalizedMonth.month());
    this.MonthYear.setValue(ctrlValue);
    datepicker.close(); // close after month chosen
    this.ngOutput.emit(this.MonthYear.value);
  }

  get ReturnMonth() {
    return this.MonthYear.value;
  }
  public displayColumn(priority?: PriorityValue): string | undefined {
    return priority ? priority.name : undefined;
  }
  searchicon(){

  }
   reseticon(){
    
  }
  showcreation:boolean=false;
   addicon(){
    this.showcreation = true;
  }
  gentratebtn(){
    this.spinnerservice.show()
    this.cbdaservice.GenerateColumn1().subscribe(result=>{
      this.spinnerservice.hide()
      this.GenerateData=result['data']
    },
  error=>{
    this.spinnerservice.hide()
  })
  }
  nextbtn(){

  }
   isColumnEmpty(header: string): boolean {
    return this.new_body.every((row: any) => !row[header]);
  }

  toggleColumn(header: string) {
    const values = this.columnValues[header] || [];

    this.new_body.forEach((row, index) => {
      row[header] = values[index] || "-";
    });

    console.log("After filling", this.new_body);
  }
  safeLower(value: any): string {
    return typeof value === "string" ? value.toLowerCase() : value;
  }
  fileuploadlist:any
  backbtn(){
    this.showcreation = false;
    this.GenerateData=[]
  }
}
