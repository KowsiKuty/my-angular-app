import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router'
import { RemsShareService } from '../rems-share.service'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { Rems2Service } from '../rems2.service'
import { environment } from 'src/environments/environment';

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class DocumentFormComponent implements OnInit {
  @Input() max: any;
  tomorrow = new Date();
  documentForm: FormGroup;
  amentiesList: any;
  idValue: any;
  premiseId: any;
  images: any
  refTypeData: any;
  refTypeIdData: any;
  refIdValue: any;
  preDocumentType: any;
  refTypeID: number;
  fileData: any;
  imagesData: any;
  DocButton = false;
  documentData: any
  removeFileId: string;
  fileextension:any;
  constructor(private fb: FormBuilder, private router: Router, private remsService2: Rems2Service,
    private remsshareService: RemsShareService, private datePipe: DatePipe,
    private remsService: RemsService, private toastr:
      ToastrService, private notification: NotificationService, ) { }

  ngOnInit(): void {
    this.documentForm = this.fb.group({
      type_id: ['', Validators.required],
      remarks: [''],
      date: [''],
      ref_type: [''],
      ref_id: [''],
      doc_ref: [''],
      images: [],
      premise_id: ""
    })
    this.getDocumentEdit();
    this.getRefType();
    this.getPreDocumentType();
  }

  getDocumentEdit() {
    let data: any = this.remsshareService.documentForm.value
    this.premiseId = data.premiseid;
    this.idValue = data.id;
    this.documentData = data;
    if (this.documentData.text === '') {
      this.documentForm.patchValue({
        type_id: '',
        remarks: '',
        date: '',
        doc_ref: '',
        ref_type: '',
        ref_id: ''

      })
    } else {
      this.remsService.getDocumentEdit(this.idValue)
        .subscribe((data) => {
          this.refIdValue = this.premiseId
          this.refTypeID = data.ref_type.id
          this.getRefIdValue(this.refTypeID)
          this.fileData = data.file_data;
          this.imagesData = this.fileData;
          this.documentForm.patchValue({
            type_id: data.type.id,
            remarks: data.remarks,
            date: data.date,
            doc_ref: data.doc_ref,
            ref_type: data.ref_type.id,
            ref_id: data.ref_id.id,
          })
        })
    }
  }

  documentFormCreate() {
    this.DocButton = true;
    if (this.documentForm.value.ref_type === "" || this.documentForm.value.ref_type === null || this.documentForm.value.ref_type === undefined) {
      this.toastr.warning('', 'Please Enter Ref Type ', { timeOut: 1500 });
      this.DocButton = false;
      return false;
    }
    if (this.documentForm.value.ref_id === "" || this.documentForm.value.ref_id === null || this.documentForm.value.ref_id === undefined) {
      this.toastr.warning('', 'Please Enter Ref ID ', { timeOut: 1500 });
      this.DocButton = false;
      return false;
    }
    if (this.documentForm.value.type_id === null || this.documentForm.value.type_id === undefined || this.documentForm.value.type_id === "") {
      this.toastr.warning('', 'Please Enter Document Type', { timeOut: 1500 });
      this.DocButton = false;
      return false;
    }
    // if (this.documentForm.value.remarks === "" || this.documentForm.value.remarks === null || this.documentForm.value.remarks === undefined) {
    //   this.toastr.warning('', 'Please Enter Remarks', { timeOut: 1500 });
    //   this.DocButton = false;
    //   return false;
    // }
    if (this.documentForm.value.date === "" || this.documentForm.value.date === null || this.documentForm.value.date === undefined) {
      this.toastr.warning('', 'Select Date', { timeOut: 1500 });
      this.DocButton = false;
      return false;
    }
    // if (this.documentForm.value.doc_ref === "" || this.documentForm.value.doc_ref === undefined || this.documentForm.value.doc_ref === null) {
    //   this.toastr.warning('', 'Please Enter Document ', { timeOut: 1500 });
    //   this.DocButton = false;
    //   return false;
    // }

    if (this.documentData.text == "") {
      if (this.documentForm.value.images === "" || this.documentForm.value.images === null || this.documentForm.value.images === undefined) {
        this.toastr.warning('', 'Choose Upload Files ', { timeOut: 1500 });
        this.DocButton = false;
        return false;
      }
    }

    const Date = this.documentForm.value;
    Date.date = this.datePipe.transform(Date.date, 'yyyy-MM-dd');
    this.documentForm.value.premise_id = this.premiseId
    if (this.idValue == undefined) {
      this.remsService.documentForm(this.documentForm.value, '', this.premiseId, this.images)
        .subscribe(result => {
          let code = result.code
          if (code === "INVALID_MODIFICATION_REQUEST") {
            this.notification.showError("You can not Modify before getting the Approval")
            this.DocButton = false;
          }
          if(code == 'INVALID_FILETYPE'){
            this.notification.showError('Invalid File Type')
            this.DocButton = false;
            this.images =[]
          }
          else if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            this.DocButton = false;
          }
          else {
            this.notification.showSuccess("Successfully created!...")
            this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Documents" }, skipLocationChange: true });
          }
          this.idValue = result.id;
        })
    } else {
      this.remsService.documentForm(this.documentForm.value, this.idValue, this.premiseId, this.imagesData)
        .subscribe(result => {
          let code = result.code
          if (code === "INVALID_MODIFICATION_REQUEST") {
            this.notification.showError("You can not Modify before getting the Approval")
            this.DocButton = false;
          }
          else if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            this.DocButton = false;
          }
          else {
            this.notification.showSuccess("Successfully Updated!...")
            this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Documents" }, skipLocationChange: true });
          }
        })
    }
  }

  onCancelClick() {
    this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Documents" }, skipLocationChange: true });

  }
  onFileSelected(e) {
    this.images = e.target.files;
    this.imagesData = this.images
  }

  getRefType() {

    this.remsService.getRefType(this.premiseId)
      .subscribe((result) => {
        this.refTypeData = result.data
      })
  }

  getRefIdValue(refType) {
    if (refType.value) {
      this.refTypeID = refType.value;
    } else {
      this.refTypeID = refType;
    }
    this.remsService2.getRefTypeId(this.premiseId, this.refTypeID)
      .subscribe((result) => {
        this.refTypeIdData = result.data
      })
  }

  getPreDocumentType() {
    this.remsService2.getPreDocumentType()
      .subscribe((result) => {
        this.preDocumentType = result.data
      })
  }

  removeFile(id) {
    this.removeFileId = id;
  }
  removeFiles() {
    let id = this.removeFileId;
    this.remsService2.removeFiles(id)
      .subscribe((result) => {
        if (result.code == "YOU CAN NOT DELETE THE LAST FILE") {
          this.notification.showWarning("Not Allow to Delete this File!.")
        } else if (result.status == "success") {
          this.getDocumentEdit()
        }
      })
  }
  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 59 && k < 61)||(k > 61 && k < 63)||(k > 63 && k < 91) || (k > 96 && k < 123) || (k >= 48 && k <= 57) ||(k>31 && k<34)||(k>37 && k<39)
    ||(k>39 && k<43) ||(k>43 && k<49));
  }

  tokenValues: any
  jpgUrls: string;
  showPopupImages: boolean = true
  imageUrl = environment.apiURL
  docFile(file_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let id = file_id;
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = file_name.split('.')
    this.fileextension=stringValue.pop();
    if ( this.fileextension === "pdf"){
      this.showPopupImages = false
      window.open( this.imageUrl + "pdserv/files/" + file_id + "?token=" + token, "_blank");
    }
    else if( this.fileextension === "png" ||  this.fileextension === "jpeg" ||  this.fileextension === "jpg" ||  this.fileextension === "JPG" ||  this.fileextension === "JPEG") {
    // if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
      this.showPopupImages = true
      this.jpgUrls = this.imageUrl + "pdserv/files/" + file_id + "?token=" + token;
      console.log("url", this.jpgUrls)
    }
    else {
      this.fileDownloadsapproved(file_id, file_name)
      this.showPopupImages = false
    }
  }

  
  fileDownloadsapproved(id, fileName) {
    this.remsService2.fileDownload(id)
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

  fileDeletes(data,index:number){
    let value = data.file_id
    console.log("filedel", value)
    this.remsService2 .deletefile(value)
    .subscribe(result =>  {
      let code = result.code
          if (code === "YOU CAN NOT DELETE THE LAST FILE") {
            this.notification.showError("You can not Delete the Last File")
            this.DocButton=false;
          } else {
            this.notification.showSuccess("Deleted....")
            this.fileData.splice(index, 1);
            this.getDocumentEdit()

          }
    
    })
  
  }





}
