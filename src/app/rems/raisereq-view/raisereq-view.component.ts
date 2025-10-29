import { Component, OnInit } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Rems2Service } from '../rems2.service'
import { takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NotificationService } from '../notification.service'
import { environment } from 'src/environments/environment'

const isSkipLocationChange = environment.isSkipLocationChange

@Component({
  selector: 'app-raisereq-view',
  templateUrl: './raisereq-view.component.html',
  styleUrls: ['./raisereq-view.component.scss']
})
export class RaisereqViewComponent implements OnInit {
  imageUrl = environment.apiURL
  raiseReqViewdata: any;
  raiseReqnote: any;
  raiseReqApproveForm: FormGroup;
  raiseReqRejectApproveForm: FormGroup;
  approverFlag: any;
  raisereq_Id: any;
  approverComments: any;
  isShowComments: boolean;
  fileextension: any;
  tokenValues: any
  jpgUrls: string;
  raisereqdetailsList= [];
  subtype = "Edit"
  subtypeadd = "Add"

  constructor(private remsService: RemsService, private fb: FormBuilder,private notification: NotificationService,
    private router: Router, private remsService2: Rems2Service,
    private remsshareService: RemsShareService) { }

  ngOnInit(): void {

    this.raiseReqApproveForm = this.fb.group({
      remarks: [''],
      
    })

    this.raiseReqRejectApproveForm = this.fb.group({
      remarks: [''],
      
    })
    
    this.raiseReqView();
  }
 
  raiseReqView(){
    let id = this.remsshareService.raiseReqView.value
    console.log("raiseReqView-id", id)
    this.raisereq_Id = id;
    this.remsService.raiseReqView(id)
      .subscribe(result => {
        let data = result;
        this.raiseReqViewdata = data;
        this.raisereqdetailsList = data.details;
        for (let j = 0; j < this.raiseReqViewdata.comments.length; j++) {
        this.approverComments = this.raiseReqViewdata.comments[0].comments
        }

        let flag = this.remsshareService.raiseReqFlag.value
        this.approverFlag = flag;

        if (this.raiseReqViewdata.status.text == "APPROVED" || this.raiseReqViewdata.status.text == "REJECTED"){
          this.approverFlag = false;
          this.isShowComments = true;
        }
        this.raiseReqnote = this.raiseReqViewdata.description
        console.log("raisereqview",this.raiseReqViewdata)
      })
   
  }
  backbutton(){
    this.router.navigate(['rems/rems/raiseRequest'], { skipLocationChange: isSkipLocationChange });
    this.remsshareService.backtosum.next('raise_request')
  }

  SubmitRaiseReqApprove(status = 2) {
  
    this.remsService.raiseReqApprove(this.raiseReqApproveForm.value, this.raisereq_Id,status )
      .subscribe(res => {
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("INVALID_DATA!...")
        } else {
          this.raiseReqView();
          this.notification.showSuccess("Approved Successfully!...")
        }
        return true
      })
  }


  SubmitRaiseReqRejectApprove(status = 0) {
  
    this.remsService.raiseReqReject(this.raiseReqRejectApproveForm.value, this.raisereq_Id, status )
      .subscribe(res => {
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("INVALID_DATA!...")
        } else {
          this.raiseReqView();
          this.notification.showSuccess("Rejected Successfully!...")
        }
        return true
      })
  }
  
  showPopupImages: boolean = true
  raiseReqViewFile(id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = file_name.split('.')
    this.fileextension=stringValue.pop();
    if ( this.fileextension === "pdf"){
      this.showPopupImages = false
      window.open( this.imageUrl + "pdserv/modification_file/" + id + "/download?token=" + token, "_blank");
     }
    else if( this.fileextension === "png" ||  this.fileextension === "jpeg" ||  this.fileextension === "jpg" ||  this.fileextension === "JPG" ||  this.fileextension === "JPEG") {
      this.showPopupImages = true
      this.jpgUrls = this.imageUrl + "pdserv/modification_file/" + id + "/download?token=" + token;
      console.log("url", this.jpgUrls)
    } 
    else {
      this.raiseReqViewfileDownload(id, file_name)
      this.showPopupImages = false
    }
  };


  raiseReqViewfileDownload(id, fileName) {
    this.remsService.raiseReqViewfileDownload(id)
      .subscribe((results) => {
        console.log("re", results)
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
      })
  }

}
