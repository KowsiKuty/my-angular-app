import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import {ShareService} from '../share.service'
import {VfmService} from "../vfm.service";
import { environment } from 'src/environments/environment'
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NotificationService } from '../notification.service'
import { Component, OnInit,Output,EventEmitter,ViewChild,HostListener,ElementRef, ɵbypassSanitizationTrustUrl, Sanitizer } from '@angular/core';
import { AnyAaaaRecord } from 'dns';
const isSkipLocationChange = environment.isSkipLocationChange

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>(); 
  documentForm:FormGroup
  preDocumentType:any[]= [
    { id: 1,
      text: "RC" },
    { id: 2,
      text: "PC"},
    {
      id: 3,
      text: "FC"
    },
    {
      id: 4,
      text: "Insurance"
    },
    {
      id: 5,
      text: "Service Bill"
    },
    {
      id: 6,
      text: "Invoice"
    },
    {
      id: 7,
      text: "Vehicle Image"
    }
  ]
  id: any;
  fileData:boolean=false
  isservicebill:boolean=false
  isinsurance:boolean=false
  isrc:boolean=false
  isfc:boolean=false
  ispc:boolean=false
  isimage:boolean=false
  isinvoice:boolean=false
  data_final=new FormData()
  filedata:any
  images1: any;
  images2: any;
  images3: any;
  images4: any;
  images5: any;
  vehicleid: any;
  images6: any;
  images7: any;
  constructor(private datePipe: DatePipe,private router: Router,private shareservice:ShareService, private notification :NotificationService,private fb:FormBuilder,private vfmService:VfmService) { }


  ngOnInit(): void {
    let data=this.shareservice.vehiclesummaryData.value;
    this.vehicleid=data['id']
    this.documentForm = this.fb.group({
      reference_type: [''],
      images1: [],
      images2: [],
      images3: [],
      images4: [],
      images5: [],
      images6: [],
      images7: [],
    })
  }
  onFileSelected1(e) {
    this.images1 = e.target.files; 
    // this.data_final=new FormData() //file1:?=''
    if(e.target.files){
      for (var i = 0; i < this.images1.length; i++) {
        this.data_final.append('file1', this.images1[i]);
        console.log("data",this.data_final)
        }
    }
  }
  onFileSelected2(e) {
    this.images2 = e.target.files;
    if(e.target.files){
    for (var i = 0; i < this.images2.length; i++) {
      this.data_final.append('file2', this.images2[i]);
      }
    }
  }
  onFileSelected3(e) {
    this.images3 = e.target.files;
    if(e.target.files){
    for (var i = 0; i < this.images3.length; i++) {
      this.data_final.append('file3', this.images3[i]);
      }
    }
  }
  onFileSelected4(e) {
    this.images4 = e.target.files;
    if(e.target.files){
    for (var i = 0; i < this.images4.length; i++) {
      this.data_final.append('file4', this.images4[i]);
      }
    }
  }
  onFileSelected5(e) {
    this.images5 = e.target.files;
    if(e.target.files){
    for (var i = 0; i < this.images5.length; i++) {
      this.data_final.append('file5', this.images5[i]);
      }   
    }
  }
  onFileSelected6(e) {
    this.images6 = e.target.files;
    if(e.target.files){
    for (var i = 0; i < this.images6.length; i++) {
      this.data_final.append('file6', this.images6[i]);
      }   
    }
  }
  onFileSelected7(e) {
    this.images7 = e.target.files;
    if(e.target.files){
    for (var i = 0; i < this.images7.length; i++) {
      this.data_final.append('file7', this.images7[i]);
      }   
    }
  }
  documentid(e){
    this.id =e
    if(this.id==1){
      this.isrc=true
    }
    if(this.id==2){
      this.ispc=true
    }
    if(this.id==3){
      this.isfc=true
    }
    if(this.id==4){
      this.isinsurance=true
    }
    if(this.id==5){
      this.isservicebill=true
    }
    if(this.id==6){
      this.isinvoice=true
    }
    if(this.id==7){
      this.isimage=true
    }
  }
  back(){
    this.router.navigate(['vfm/fleet_view'], { queryParams: { status: "VFM Documents" }, skipLocationChange: true });
  }
  submitForm(){
  this.filedata=[]
  if (this.documentForm.value.reference_type === "") {
    this.notification.showError("Please Select Reference Type");
    return false;
  }
    
  
 
    console.log("incires", this.documentForm.value)
  if(this.documentForm.value.images1!=null||this.documentForm.value.images1!=undefined)   {
    this.filedata.push({"id":1,"file":"file1"})
  } 
  if(this.documentForm.value.images2!=null||this.documentForm.value.images2!=undefined)   {
    this.filedata.push({"id":2,"file":"file2"})
  } 
  if(this.documentForm.value.images3!=null||this.documentForm.value.images3!=undefined)   {
    this.filedata.push({"id":3,"file":"file3"})
  } 
  if(this.documentForm.value.images4!=null||this.documentForm.value.images4!=undefined)   {
    this.filedata.push({"id":4,"file":"file4"})
  } 
  if(this.documentForm.value.images5!=null||this.documentForm.value.images5!=undefined)   {
    this.filedata.push({"id":5,"file":"file5"})
  } 
  if(this.documentForm.value.images6!=null||this.documentForm.value.images6!=undefined)   {
    this.filedata.push({"id":6,"file":"file6"})
  } 
  if(this.documentForm.value.images7!=null||this.documentForm.value.images7!=undefined)   {
    this.filedata.push({"id":7,"file":"file7"})
  }  
    
      console.log("this.data_final",this.data_final)
      
      this.data_final.append("data", JSON.stringify(this.filedata))
  if(this.id==1){
      if (this.images1===null||this.images1===undefined) {
        this.notification.showError("Please Choose File");
        return false;
      }  
    }
     else if(this.id==2){
      if (this.images2===null||this.images2===undefined) {
        this.notification.showError("Please Choose File");
        return false;
      }  
    }
      else if(this.id==3){
        if (this.images3===null||this.images3===undefined) {
          this.notification.showError("Please Choose File");
          return false;
        }  
      }
      else if(this.id==4){
        if (this.images4===null||this.images4===undefined) {
          this.notification.showError("Please Choose File");
          return false;
        }  
      }
      else if(this.id==5){
        if (this.images5===null||this.images5===undefined) {
          this.notification.showError("Please Choose File");
          return false;
        }  
      }
      else if(this.id==6){
        if (this.images6===null||this.images6===undefined) {
          this.notification.showError("Please Choose File");
          return false;
        }  
      }
      else if(this.id==7){
        if (this.images7===null||this.images7===undefined) {
          this.notification.showError("Please Choose File");
          return false;
        }  
      }
  this.vfmService.createdocumentmakers(this.data_final,this.vehicleid)
    .subscribe(res => {
      console.log("incires", this.documentForm.value)
      if (res.status === "success") {
        this.notification.showSuccess("Success....")
        this.onSubmit.emit(); 
        this.router.navigate(['vfm/fleet_view'], { queryParams: { status: "VFM Documents" }, skipLocationChange: true });
          
                                                  
        
        
        return true;
      }else {
        this.notification.showError(res.description)
        return false;
      }
    })
  }
}
