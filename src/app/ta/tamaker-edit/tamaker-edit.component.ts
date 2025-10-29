import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import{FormControl,FormGroup,FormBuilder,Validators,FormArray} from '@angular/forms';
import {isBoolean} from 'util';
// import { formatDate } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NotificationService } from '../notification.service'
import {TaService} from "../ta.service";
import {ShareService}from '../share.service'
import { DataService } from 'src/app/service/data.service';
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
  selector: 'app-tamaker-edit',
  templateUrl: './tamaker-edit.component.html',
  styleUrls: ['./tamaker-edit.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
    DatePipe
]
})
export class TamakerEditComponent implements OnInit {

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();  
   
  taEditForm:FormGroup
  currentDate: any = new Date();
  date = new Date().toLocaleDateString();
  defaultDate = new FormControl(new Date());
  today = new Date();
  // TourMakerEditId:any
  tourMakerId:any
  has_next = true;
  has_previous = true;
  approvalsummarypage:number=1;
  purpose:any
  pagesize = 10;
  getTourmakereditList:Array<any>
  days:any
  values=[];
  stratdate:Date;
  enddate:Date;
  endatetemp:Date
  startdatetemp:Date
  starttdate:any
  fileData: File = null;
  previewUrl:any = null;
  // overall:any
  summ:any
  placeof:any
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  totall:number;
  select:any;
  selectto:any;
  total:any;
  overall=[];


  detail:Array<any>;
  getApproveList:any
  reasonlist:Array<any>;
  a:any
  dataaaa:any
  visit:any
  startingpoint:any
  ordernoremarks:any
  request:any
  order:any
  start:any
  id:any
  detail1:Array<any>
  datas=[];
  
  constructor(private formBuilder: FormBuilder,private datePipe: DatePipe,private http: HttpClient,private notification :NotificationService,private taservice:TaService,private tashareservice:ShareService) { 
    
  }

  ngOnInit(): void {
    this.taEditForm = this.formBuilder.group({
      id:[{ value: "", disabled:isBoolean }],
      requestdate:['',Validators.required],
      reason:['',Validators.required],
      startdate:['',Validators.required],
      enddate:['',Validators.required],
      durationdays:['',Validators.required],
      ordernoremarks:['',Validators.required],
      permittedby:['',Validators.required],
      bank:['',Validators.required],
      employee:['',Validators.required],
      detail:this.formBuilder.array([
        this.pardet()
      ])
      
        
     
     
       
})
this.gettourmakersumm();
this.getreasonValue();
this.getapprovesumm();
// this.getTourMakerEdit();

  }
  
  pardet():FormGroup{
    return this.formBuilder.group({
    startdate : ['',Validators.required],
    enddate   :['',Validators.required],
    startingpoint: ['',Validators.required],
    
    
  })
}
  
 
  getSections(form) {
    // return .taEditForm.get('overall') as FormArray;
    //console.log(form.get('sections').controls);
    return form.controls.detail.controls;
    
  }
  addDirectorName() {
    
      // this.inputName.nativeElement.value = ' ';
  }
  addSection() {
    (<FormArray>this.taEditForm.get('detail')).push(this.pardet());
    // const control = <FormArray>this.taEditForm.get('detail');
    // control.push(this.pardet());
  }
  
  removeSection(i){
    const control = <FormArray>this.taEditForm.get('detail');
    control.removeAt(i);
   }
  setDate(date: string) {
   
    this.currentDate = date
    this.currentDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    console.log("Datttee   " + this.currentDate)
    this.currentDate= this.datePipe.transform(new Date(),"dd-MM-yyyy");
    return this.currentDate;
  }
  
 
  removevalues(i){
    this.values.splice(i,1);

  }
  
  
   
  
   
  fileProgress(fileInput: any) {
      this.fileData = <File>fileInput.target.files[0];
      this.preview();
  }
 
  preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
 
    var reader = new FileReader();      
    reader.readAsDataURL(this.fileData); 
    reader.onload = (_event) => { 
      this.previewUrl = reader.result; 
    }
  }
  fromDateSelection(event: string) {
    console.log("fromdate", event)
    const date = new Date(event)
    this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate() )
  }
  toDateSelection(event: string) {
    console.log("todate", event)
    const date = new Date(event)
    this.selectto = new Date(date.getFullYear(), date.getMonth(), date.getDate() )
    this.total=this.selectto-this.select;
    this.totall =this.total/(1000 * 60 * 60 * 24)
     console.log("baba",this.totall)
  }
  numberOnly(event) {
    var k;
    k = event.charCode;
    return ((k > 96 && k < 123) || (k >= 48 && k <= 57));
  }
  gettourmakersumm() {
    let data: any = this.tashareservice.TourMakerEditId.value;
    console.log("tourmakerEditttt",data);
     this.summ=data
    this.taservice.getTourmakereditSummary(this.summ)
    .subscribe((results: any[]) => {
     console.log("Tourmakeredittest", results)
     let datasss=results;
     console.log("ff",datasss)
     let order=datasss['ordernoremarks']
     let requestdate=datasss['requestdate']
     let reason=datasss['reason']
     let start=datasss['empdesignation']
     let end=datasss['empgrade']
     console.log("eee",end)
     let id=datasss['id']
     let durationdays=datasss['onbehalfof']
     let requestno=datasss['requestno']


     let datas = results['detail'];
     let overall=datas;
      console.log("hhh",overall)
     for(var i=0;i<overall.length;i++){
      this.purpose=overall[i].purposeofvisit;
      console.log("jj", this.purpose)
      this.startingpoint=overall[i].startingpoint;
      console.log("jj", this.startingpoint)
      this.placeof=overall[i].placeofvisit;
      console.log("jj", this.placeof)
      this.request=overall[i].requestdate;
      this.id=overall[i].id;
    }
    let dataaaa = this.taEditForm.controls.detail
    // let purposeofvisit = this.taEditForm.value.detail.purposeofvisit
    let data = {
      id: this.id,
      startdate:start,
      enddate:end,
      startingpoint: this.startingpoint,
      placeofvisit: this.placeof,
      purposeofvisit:this.purpose ,

     
    }
    let arraySize = this.overall.length
    // if (count > arraySize) {
      this.overall.push(data);
      console.log("aa", this.overall)
      this.taEditForm.controls.detail.patchValue([data])
      console.log("ssssssssss", this.taEditForm.controls.detail.value)
    
     this.taEditForm.patchValue({
      id:id,
      ordernoremarks:order,
      requestdate:this.request,
      reason:reason,
      startdate:start,
      enddate:end,
      durationdays:durationdays,
      permittedby:requestno,


      detail:{
      id:this.id,
      purposeofvisit:this.purpose,
      startingpoint:this.startingpoint,
      placeofvisit:this.placeof,
      startdate:start,
      enddate:end
     
      // detail:this.placeof

      },
      })
     })
     }
  
 

  createFormate() {
    let date = this.setDate(this.currentDate);
    
    let data = this.taEditForm.value;
    let datas = this.taEditForm.controls.detail
    // let datas = this.taEditForm.controls.detail
    let objTourmaker = new TourMaker();
    
    // objTourmaker.id = data['id'].value;
    objTourmaker.requestdate = data.requestdate;
    objTourmaker.reason = data.reason;
    objTourmaker.startdate = data['startdate'];
    objTourmaker.enddate = data['enddate'];
    objTourmaker.durationdays = data['durationdays'];
    objTourmaker.ordernoremarks = data['ordernoremarks'];
    objTourmaker.permittedby = data['permittedby'];
     let detail1 ={
      id: datas.value.id,
      startdate: data.startdate,
      enddate: data.enddate,
      purposeofvisit: datas.value.purposeofvisit,
      placeofvisit: datas.value.placeofvisit,
      startingpoint: datas.value.startingpoint,
       }
    objTourmaker.detail= detail1;
    
    let dateValue = this.taEditForm.value;
    objTourmaker.requestdate = this.datePipe.transform(dateValue.requestdate, 'yyyy-MM-dd');
    objTourmaker.startdate = this.datePipe.transform(dateValue.startdate, 'yyyy-MM-dd');
    objTourmaker.enddate = this.datePipe.transform(dateValue.enddate, 'yyyy-MM-dd');
    // objTourmaker.detail = this.datePipe.transform(dateValue.detail, 'yyyy-MM-dd');
    
    
   

    console.log(" objTourmaker",  objTourmaker)
    return  objTourmaker;
  }
  getreasonValue() {
    this.taservice.getreasonValue()
      .subscribe(result => {
        this.reasonlist = result['data']
        console.log("Reason", this.reasonlist)
      })
  }

  submitForm(){
   this.taservice.TourmakerEditForm(this.id,this.createFormate())
    .subscribe(res=>{
      if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
        this.notification.showWarning("Duplicate! Code Or Name ...")
      } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
        this.notification.showError("INVALID_DATA!...")
      }
      else{
      this.notification.showSuccess("Updated Successfully....")
      console.log("res", res)
      this.onSubmit.emit();
      return true
      }
    }
    )
    }


  

  onCancelClick() {
    this.onCancel.emit()
  }
  getapprovesumm(pageNumber = 1, pageSize = 10) {
    this.taservice.getapproveSummary()
    .subscribe(result => {
    console.log("sssss", result)
    let datas = result['approve'];
    this.getApproveList = datas;
    let datapagination = result["pagination"];
    this.getApproveList = datas;
    if (this.getApproveList.length >= 0) {
    this.has_next = datapagination.has_next;
    this.has_previous = datapagination.has_previous;
    this.approvalsummarypage = datapagination.index;
    }
    })
    }
 
  
}
class TourMaker {
  // id: string;
  requestdate: string;
  reason: string;
  startdate: string;
  enddate: string;
  durationdays: string;
  ordernoremarks: string;
  permittedby:string;
  purposeofvisit:string;
  placeofvisit:string;
  startingpoint:string;
  detail: {
    id:number;
    purposeofvisit: number;
    placeofvisit: string;
    startingpoint: string;
    // requestdate: string;
    startdate: string;
    enddate: string;
    
  }
  
  
  
}