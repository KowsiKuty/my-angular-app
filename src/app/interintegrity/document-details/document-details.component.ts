import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InterintegrityApiServiceService } from '../interintegrity-api-service.service';
import { NotificationService } from "src/app/service/notification.service";
import { FormBuilder} from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { InterintegrityModule } from '../interintegrity.module';
import { data } from 'jquery';
import { I } from '@angular/cdk/keycodes';

interface iface_typeValues{
  value: string;
  viewoption: string;
  id:number;
}
@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.scss']
})

export class DocumentDetailsComponent implements OnInit {
  @ViewChild('popupclose')popupclose:any;
  typeValues: iface_typeValues[] = [
    { value: "EXTERNAL", viewoption: "EXTERNAL" ,id:1},
    { value: "WISEFIN", viewoption: "WISEFIN" ,id:2}
  ];
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  limit=10
  uploadfile: any;
  upload_type: any;
  documentform: FormGroup;
  docsummary:FormGroup
  upload_type_id: any;
  endDate: Date;
  document_summery: any;
  has_next: boolean;
  has_previous: boolean;
  currentpage: number;
  presentpagetab:1
  Result: any;
  has_nexttab: any;
  has_previoustab: any;
  isSummaryPagination: boolean;
  data_found: boolean;
  summarydate: string;
  summarytype: string;
  status_modi: number;
  filename: string;
  @Input() file_id:any
  

  constructor(public documentService: InterintegrityApiServiceService,private notification: NotificationService,private fb: FormBuilder,
    private SpinnerService: NgxSpinnerService,public datepipe: DatePipe,private router: Router,) { }

  ngOnInit(): void {
    console.log(this.file_id,'fileidddddddddddddddddddddddddddddddddddddd')
    this.documentform = this.fb.group({
      ctrl_uploadtype:'',  
      uploadDate:'',
      ctrl_upload:'',
    })
    this.docsummary= this.fb.group({
      summarydate:'',
      summarytype:'',
      summaryfilename:'',
    })
   this.summary_search()
    const currentDate = new Date();
    this.endDate = new Date(currentDate.getTime() - 0 * 24 * 60 * 60 * 1000);

  
  
  }
  uploadtype(type){
    console.log("type",type.value)
    this.upload_type=type.value
  }

  uploadchooses(evt) {
    this.uploadfile = evt.target.files[0];
    console.log("this.uploadfile",this.uploadfile)
  }

  documentupload(){
    if(
      this.documentform.controls["uploadDate"].value == null ||this.documentform.controls["uploadDate"].value == ""){
      this.notification.showError("Please choose a Date");
      return false;
    }
    if (
      this.documentform.controls["ctrl_uploadtype"].value == null ||this.documentform.controls["ctrl_uploadtype"].value == ""){
      this.notification.showError("Please choose a Upload Type ");
      return false;
    }

    if (
      this.documentform.controls["ctrl_upload"].value == null ||this.documentform.controls["ctrl_upload"].value == ""){
      this.notification.showError("Please upload a File ");
      return false;
    }
    let upload_date = this.datepipe.transform(this.documentform.controls["uploadDate"].value, "yyyy-MM-dd")
    console.log("date", upload_date)
    let PARMS = {
      "type":this.upload_type,
      "date":upload_date,
    }
    this.SpinnerService.show();
    this.documentService.document_upload(PARMS,this.uploadfile ).subscribe((results) => {
      this.SpinnerService.hide();
      if (results.status == "success") {
        this.notification.showSuccess("File Insert Successfully");
        this.popupclose.nativeElement.click()
      } else {
        this.notification.showError(results.code);
      }
      if (results.status == "success") {
        this.clearSearch()
        this.summary_search();
      }
    });
  }

clearSearch()
  {
    this.documentform.reset();
  }

  Upload_summary(pageNumber = 1){
    this.documentService.upload_summary().subscribe((results: any[]) => {
      let datas = results["data"];
      this.document_summery = results["data"];
      let dataPagination = results['pagination'];
      console.log("datasupload",datas)
      if (datas.length >= 0) {
        this.has_nexttab = dataPagination.has_next;
          this.has_previoustab = dataPagination.has_previous;
          this.presentpagetab = dataPagination.index;
          this.isSummaryPagination = true;
          this.data_found = true;
      }
      if (datas.length <= 0) {
        this.data_found = false;
        this.notification.showError("NO Data Found")
      }
    });
  }

  summary_clear(){
    this.docsummary.reset();
  }

  summary_search(pageNumber = 1){
    console.log("namefeild",this.docsummary.controls["summaryfilename"].value)
    if(this.docsummary.controls["summaryfilename"].value == null){
      this.filename=""
    }else{
      this.filename=this.docsummary.controls["summaryfilename"].value
    }
    if(this.datepipe.transform(this.docsummary.controls["summarydate"].value, "yyyy-MM-dd") == null){
      this.summarydate = ""
    }else{
      this.summarydate = this.datepipe.transform(this.docsummary.controls["summarydate"].value, "yyyy-MM-dd")
      console.log("summarydate",this.summarydate)
    }
   if(this.docsummary.controls["summarytype"].value == null){
    this.summarytype = ""
   }else{
   this.summarytype = this.docsummary.controls["summarytype"].value
   }
   let test = 1
    
    console.log("summarytype",this.summarytype)
    this.SpinnerService.show();
    this.documentService.summary_search(this.summarydate,this.summarytype,this.filename,pageNumber,test,this.file_id).subscribe((results) => {
      this.SpinnerService.hide();
      let datas = results["data"];
      this.document_summery = results["data"];
      let dataPagination = results['pagination'];
      if (results.description == "No data found") { 
        this.data_found = false;
        this.notification.showError("NO Data Found")
      }
      if (datas.length >= 0) {
        this.has_nexttab = dataPagination.has_next;
          this.has_previoustab = dataPagination.has_previous;
          this.presentpagetab = dataPagination.index;
          this.isSummaryPagination = true;
          this.data_found = true;
      }
     
    });

  }
  previousClick(){
    if(this.has_previoustab == true){
      this.currentpage = this.presentpagetab - 1;
      this.summary_search(this.presentpagetab - 1)
 
    }
  }
  nextClick(){
    if(this.has_nexttab == true){
      this.currentpage = this.presentpagetab +1;
      this.summary_search(this.presentpagetab +1)
  
    }
}

 status_modify(type,date,status){
   console.log("type",type)
   console.log("date",date)
   console.log("status",status)
   let dataApprove = confirm("Are you sure, Do you want to change the status?")
    if (dataApprove == false) {
      return false;
    }
   if(status == 1){
     this.status_modi = 0
     console.log("status change 1 to 0",this.status_modi)
   }
   if(status == 0){
     this.status_modi = 1
   }
   if(status == 4){
    this.status_modi = 0
   }
   if(status == 3){
    this.status_modi = 0
   }
   if(status == 2){
    this.status_modi = 0
   }
   this.SpinnerService.show();
   this.documentService.status_modify(date,type,this.status_modi).subscribe((results) => {
     this.SpinnerService.hide();
     if (results.status == "success") {
      this.notification.showSuccess("successfully updated");
      this.summary_search();
     } else {
       this.notification.showError(results.description);
     }
 
   });
 }

 Run_s3(){
  if (
    this.docsummary.controls["summarydate"].value == null ||this.docsummary.controls["summarydate"].value == ""){
    this.notification.showError("Please choose a Date ");
    return false;
  }
  this.SpinnerService.show();
  let date = this.datepipe.transform(this.docsummary.controls["summarydate"].value, "yyyy-MM-dd")
  let PARMS_DATE ={
    "date":date
  }
 
  this.documentService.implementing_conditions(PARMS_DATE).subscribe((results) => { 
    this.SpinnerService.hide();
    if(results.code== "No data found"){
      this.notification.showError(results.code);
      return false
    }
    if(results.code == "THIS DATA HAS ALREADY BEEN RUN"){
      this.notification.showError(results.code);
      return false
    }
    if(results.description == "INVALID REQUEST"){
      this.notification.showError(results.description);
      return false
    }else{
      this.notification.showSuccess("Process started");
      this.summary_clear();
      this.summary_search();
    }
   
   
  });
   
 }

 s3_download(id,file){
  console.log("download",id)
  let fileName=file
  let FILE = fileName.split('.')[0];
  this.SpinnerService.show();
   this.documentService.s3_download(id).subscribe((results: any[])=> {
     this.SpinnerService.hide();
     let binaryData = [];
     binaryData.push(results)
     let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
     let link = document.createElement('a');
     link.href = downloadUrl;
     link.download = FILE+".xlsx";
     link.click();
   });

 }

 backintegrity(){
  this.router.navigate(["interintegrity/intertransactions"], {});
 }

}