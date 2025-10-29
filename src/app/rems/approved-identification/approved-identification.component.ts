import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { RemsShareService } from '../rems-share.service'
import { RemsService } from '../rems.service'
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { Rems2Service } from '../rems2.service'
// import { environment } from 'src/environments/environment';
import { environment } from 'src/environments/environment'

const isSkipLocationChange = environment.isSkipLocationChange
@Component({
  selector: 'app-approved-identification',
  templateUrl: './approved-identification.component.html',
  styleUrls: ['./approved-identification.component.scss']
})
export class ApprovedIdentificationComponent implements OnInit {
  ispaymentpage: boolean = true;
  approvedList: any;
  paymentcurrentpage: number = 1;
  paymentpresentpage: number = 1;
  pagesizepayment = 10;
  has_paymentnext = true;
  has_paymentprevious = true;
  tokenValues: any
  pdfUrls: string;
  jpgUrls: string;
  fileextension: any;
  imageUrl = environment.apiURL;
  showPopupImages: boolean
  approvedFilterList = [{ id: 1, text: "Premises Created" }, { id: 2, text: "Premises Not Created" }]
  approved_Status1 = "Created"
  approved_Status2 = "Not Created"

  constructor(private fb: FormBuilder, private datePipe: DatePipe, private router: Router, private remsshareService: RemsShareService, private route: ActivatedRoute,
    private remsService: RemsService, private toastr: ToastrService, private notification: NotificationService, private remsService2: Rems2Service) { }

  ngOnInit(): void {
    this.getApprovedList();
  }

  getApprovedList(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
    this.remsService.getApprovedDetails(filter, sortOrder, pageNumber, pageSize, this.statusId)
      .subscribe((results: any[]) => {
        console.log("payment", results)
        let datas = results["data"];
        this.approvedList = datas;
        let datapagination = results["pagination"];
        this.approvedList = datas;
        if (this.approvedList.length === 0) {
          this.ispaymentpage = false
        }
        if (this.approvedList.length > 0) {
          this.has_paymentnext = datapagination.has_next;
          this.has_paymentprevious = datapagination.has_previous;
          this.paymentpresentpage = datapagination.index;
          this.ispaymentpage = true
        }
      })
  }

  nextClickPayment() {
    if (this.has_paymentnext === true) {
      // this.paymentcurrentpage = this.paymentpresentpage + 1
      this.getApprovedList("", 'asc', this.paymentpresentpage + 1, 10)
    }
  }

  previousClickPayment() {
    if (this.has_paymentprevious === true) {
      // this.paymentcurrentpage = this.paymentpresentpage - 1
      this.getApprovedList("", 'asc', this.paymentpresentpage - 1, 10)
    }


  }

  fileDownload(id, fileName) {
    this.remsService.fileDownloadForApprovedPremise(id)
      .subscribe((results) => {
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
      })
  }



  statusId: any;
  onChangeDropDown(e: number = 1) {
    this.statusId = e
    console.log("Premises Created", this.statusId)
    this.getApprovedList();
  }

  addPremises(data) {
    console.log("code",data)
    this.remsshareService.premisesCode.next(data);
    this.router.navigate(['/rems/premiseCreate'], { skipLocationChange: isSkipLocationChange });

  }


  commentPopup(pdf_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let id = pdf_id;
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = file_name.split('.')
    this.fileextension=stringValue.pop();
    if ( this.fileextension === "pdf"){
      this.showPopupImages = false
      window.open( this.imageUrl + "pdserv/files/Rems_" + id + "?premiseidentificationfile=true&token=" + token, "_blank");
    }
    else if( this.fileextension === "png" ||  this.fileextension === "jpeg" ||  this.fileextension === "jpg" ||  this.fileextension === "JPG" ||  this.fileextension === "JPEG") {
    // if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
      this.showPopupImages = true
      this.jpgUrls = this.imageUrl + "pdserv/files/Rems_" + id + "?premiseidentificationfile=true&token=" + token;
      console.log("url", this.jpgUrls)
    }
    else {
      this.fileDownload(pdf_id, file_name)
      this.showPopupImages = false
    }
  };
}
