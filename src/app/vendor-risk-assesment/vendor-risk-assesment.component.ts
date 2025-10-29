import { Component, ElementRef, HostListener, Injectable, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { fromEvent, Observable } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { ErrorHandlingServiceService } from '../service/error-handling-service.service';
import { NotificationService } from '../../app/service/notification.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

import * as _moment from 'moment';

import { default as _rollupMoment, Moment } from 'moment';
import { DatePipe, formatDate } from '@angular/common';
import { SharedService } from '../service/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { data } from 'jquery';
import { ErrorHandlingService } from '../rems/error-handling.service';
import { DataService } from '../service/data.service';
import { Router } from '@angular/router';
import { AtmaService } from '../atma/atma.service';
import { float, FLOAT } from 'html2canvas/dist/types/css/property-descriptors/float';

@Component({
  selector: 'app-vendor-risk-assesment',
  templateUrl: './vendor-risk-assesment.component.html',
  styleUrls: ['./vendor-risk-assesment.component.scss']
})
export class VendorRiskAssesmentComponent implements OnInit {
  vendorid: any;
  activityid: any;
  vendordetails: any;
  vendorSummaryList: any;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  isVendorSummaryPagination: boolean;
  pageSize: any;
  returnform: FormGroup;
  acceptform: FormGroup;
  @ViewChild('closeRemarks') closeRemarks : ElementRef;
  @ViewChild('closeAccept') closeAccept : ElementRef;


@ViewChild('autoTrigger1') autoTrigger1: MatAutocompleteTrigger;
@ViewChild('autoTrigger2') autoTrigger2: MatAutocompleteTrigger;
@ViewChild('auto1') auto1: MatAutocomplete;
@ViewChild('auto2') auto2: MatAutocomplete;

  questiondata: any = [];
  vendor_name: any;
  branch_name: any;
  pan_no: any;
  questiondescriptionid: any;
  approver: any;
  activityList: any;
  isScore: boolean = false;
  questionForm : FormGroup;
  impact: any[] = [
    { id: 1, name: "1 - Low" },
    { id: 2, name: "2 - Medium" },
    { id: 3, name: "3 - High" } 
  ];
  likelhood: any[] = [
    { id: 1, name: "1 - Low" },
    { id: 2, name: "2 - Medium" },
    { id: 3, name: "3 - High" }  
  ];
  filteredStates: Observable<any[]>;
  filteredStates1: Observable<any[]>;
  enableSubmit: boolean;
  file: any;
  question
  payloadArray: any = [];
  displayData: any = [];
  risk_score: any;
  adjusted_risk_score: any;
  payloadArraySave: any = [];
  isEmc: boolean;
  vendor_mapping_id: any;
  risk_status: any;
  evaluateRes: any = [];
  supplier_name: any;
  activity_name: any;
  risk: any;
  file_name: any;
  is_download: any;
  file_id: any;
  risk_status1: boolean;
  risk_status_name: any;
  showimageHeaderPreview: boolean;
  showimageHeaderPreviewPDF: boolean;
  showtxt: boolean;
  showdoc: boolean;
  jpgUrls: string;

 

  constructor(private activateroute: ActivatedRoute, private spinnerservice: NgxSpinnerService, private shareService: SharedService, private notification: NotificationService, private dataservice: DataService,
    private errorHandler: ErrorHandlingService, private formbuilder: FormBuilder, public datepipe: DatePipe,private router:Router, private atmaservice: AtmaService, private fb: FormBuilder) { }
  ngOnInit(): void {

    this.activateroute.queryParams.subscribe(
      params => {
        console.log('logs', params)

        if (params['vendorid']) {
          // this.vendorObjs.vendorid = params['vendorid'];
          this.vendorid = params['vendorid'];

          // console.log('vendorid', this.vendorObjs.vendorid)
          console.log('vendoriiiiiddd', params['vendorid'])
        }
        
        if(params['activityid']){
          this.activityid=params['activityid']
          console.log(params['activityid'])
        }

        }
    )
    this.questionForm = this.fb.group({
      rows : this.fb.array([],Validators.required),
    })

    this.returnform = this.fb.group({
      remarks: ['',Validators.required]
    }) 
    
    this.acceptform = this.fb.group({
      remarks: ['',Validators.required]
    })

    // this.atmaservice.getVendor(this.vendorid).subscribe(
    //   result=>{
    //     this.shareService.vendorView.next(result)
    //     this.shareService.vendorViewHeaderName.next(result)

    //     this.vendordetails=result
        
    //   })

    this.getactivityleveluestion(this.activityid)
  
    // this.getquestionhistory(this.vendorid)    
}

get rows() : FormArray {
  return this.questionForm.get('rows') as FormArray;
}
createRow(data): FormGroup {
  const newRow =  this.fb.group({
    impact: [data.impact || '', Validators.required],
    likelhood: [data.likelhood || '', Validators.required],
    id: [data.question_id || ''],
    score: [data.multiple_val || ''],
    answer_id: [data.answer_id || '']
  });
    return newRow;
}
// fileDownload(){
//   this.spinnerservice.show();
//   this.atmaservice.fileDownload(this.file_id)
//   .subscribe(data => {
//     this.spinnerservice.hide();
//     if(data.type == 'application/json'){
//       this.notification.showInfo("No Data Found!");
//       return false;
//     }
//     else { 
//     let binaryData = [];
//     binaryData.push(data)
//     let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
//     let link = document.createElement('a');
//     link.href = downloadUrl;
//     let date: Date = new Date();
//     link.download = this.file_name + date + ".pdf";
//     link.click();
//     }
//   },
//     error => {
//       this.errorHandler.handleError(error);
//     this.spinnerservice.hide();
//     })
// }

fileDownload(){
  this.spinnerservice.show();
  if(this.file_id){
  this.atmaservice.fileDownload(this.file_id)
    .subscribe(data => {
      this.spinnerservice.hide();
      if (data.type === 'application/json') {
        this.notification.showInfo("No Data Found!");
        return false;
      } else { 
        const binaryData = [data];
        const downloadUrl = window.URL.createObjectURL(new Blob(binaryData, { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = downloadUrl;
        const date: Date = new Date();
        link.download = `${this.file_name}.pdf`;
        link.click();
      }
    },
    error => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide();
    });
  } else {
    this.notification.showInfo("No Record Found!");
    this.spinnerservice.hide();
  }
}

reportDownload(){
  this.spinnerservice.show();
  this.atmaservice.reportDownload(this.activityid,this.vendor_mapping_id)
  .subscribe(data => {
    this.spinnerservice.hide();
    if(data.type == 'application/json'){
      this.notification.showInfo("No Data Found!");
      return false;
    }
    else { 
    let binaryData = [];
    binaryData.push(data)
    let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    let link = document.createElement('a');
    link.href = downloadUrl;
    let date: Date = new Date();
    link.download = 'SupplierQuestionnaire' + ".xlsx";
    link.click();


    }

  },
    error => {
      this.errorHandler.handleError(error);
    this.spinnerservice.hide();
    })
}
getactivityleveluestion(value) {
this.spinnerservice.show()
this.atmaservice.evaluateactivitysubmit(value).subscribe(
result => {

  if(result.code == 'INVALID HEADER ID') {
    // this.spinnerservice.hide()
    this.notification.showError(result.code)
    this.router.navigate(['/login'])
    this.spinnerservice.hide()


  }
  else{
  this.questiondata = result['data'];
  this.vendor_mapping_id = this.questiondata[0].vendor_mapping_id;
  this.activityList = this.questiondata.activityid;
  let data = this.questiondata[0]['qns&ans']; 
  this.vendor_name = this.questiondata[0].vendor_name;
  this.branch_name = this.questiondata[0].branch_name;
  this.supplier_name = this.questiondata[0].supplierbranch_name;
  this.activity_name = this.questiondata[0].activity_name;
  this.file_name = this.questiondata[0].file_name;
  this.is_download = this.questiondata[0].is_download;
  this.file_id = this.questiondata[0].file_id;
  let emc = this.questiondata[0].is_emc;
  this.isEmc = (emc == true) ? true : false; 
  this.risk = this.questiondata[0].risk_status;
  this.risk_status_name = this.questiondata[0].risk_status_name;
  this.risk_status = (this.risk == 5 || this.risk == 2) ? true : false;
  this.risk_status1 = (this.risk == 5 || this.risk == 2 || this.isEmc)  ? true : false;


  data.forEach(question => {
    this.rows.push(this.createRow(question)); // Add the new form group to the form array

    // Add the non-input fields to displayData array
    this.displayData.push({
      riskscenario: question.riskscenario,
      description: question.description,
      response: question.response
    });
  });
  this.spinnerservice.hide()
  console.log("this.rows",this.rows);
  console.log("displayData",this.displayData);
 

}

}

)
}
updateFields(newData): void {
  newData.forEach(newItem => {
    const group = this.rows.controls.find((ctrl: FormGroup) => ctrl.get('id').value === newItem.id) as FormGroup;
    if (group) {
      group.get('impact').setValue(newItem.impact);
      group.get('likelhood').setValue(newItem.likelhood);
      group.get('score').setValue(newItem.multiple_val);
    } else {
      // If no matching group is found, you can choose to create a new one or skip it
      const newGroup = this.createRow({
        impact: newItem.impact,
        likelhood: newItem.likelhood,
        question_id: newItem.id,
        multiple_val: newItem.multiple_val
      });
      this.rows.push(newGroup);
    }
  });
}

  evaluateScore(){
  
    let formArray = this.questionForm.get('rows') as FormArray;

    formArray.controls.forEach(control => {

      const id = control.value.id;
      const ans_id = control.value.answer_id;
      const impact = control.get('impact').value;
      const likelhood = control.get('likelhood').value;

      const idExists = this.payloadArray.some(val => val.id === id);
      if(!idExists){
        if (impact && likelhood) { 
          const dict = {
            id: id,
            ans_id: ans_id,
            impact: impact,
            likelhood: likelhood,
          };
          this.payloadArray.push(dict);
        }
        console.log("payloadArray",this.payloadArray)
      } else {
        this.notification.showInfo("Answer any questions to evaluate!");
        return false;
      }
    })
    this.spinnerservice.show();


    this.atmaservice.evaluate(this.payloadArray).subscribe((res) => {
      if(res['data']){
        this.evaluateRes = res['data'];
        this.risk_score =  res.total;
        this.adjusted_risk_score = parseFloat(res.adjusted_risk_score)
        // this.adjusted_risk_score = 
        // this.rows.clear();
        this.clearFields();
        this.updateFields(this.evaluateRes)
        // this.evaluateRes.forEach(ans => {
        //   this.rows.push(this.createRow(ans));
        // })
        // this.combineDataJW();
        // this.payloadArray = [];
        this.spinnerservice.hide();
        this.notification.showSuccess("Score Evaluated!");
        this.payloadArray = [];

      }
      else if(res.code){
        this.notification.showError(res.description);
        // this.CombineArray = [];
        this.payloadArray = [];
        this.spinnerservice.hide();
      }
  })
  this.payloadArray = [];
  // this.CombineArray = [];
    this.isScore = true;
  }
  clearFields(): void {
    this.rows.controls.forEach((group: FormGroup) => {
      group.get('impact').setValue('');
      group.get('likelhood').setValue('');
    });
  }

  saveData(id){
    let risk_status: number ;
    if(id == 1){
      risk_status = 1;
      this.questionsubmit(risk_status,id)
    }
    if(id == 2){
      risk_status = 5;
      if(!this.questionForm.valid){
        this.notification.showWarning("Please answer all the questions!");
        return false;
      }
      if(this.file == '' || this.file == null || this.file == undefined){
        // this.notification.showInfo("Please upload a file before submitting!");
        this.notification.showInfo("Please upload the performance control monitoring sheet to proceed further!")
        return false;
      }
      if(this.file){
        let activity_dict = {
          "activity_id" : this.activityid,
          "vendor_map_id": this.vendor_mapping_id
        }
        this.spinnerservice.show();
        this.atmaservice.fileDeclaration(this.vendorid, activity_dict,this.file).subscribe(res => {
          if(res['data']){ 
            this.notification.showSuccess("File Upload Completed!");
            // this.spinnerservice.hide();
            this.questionsubmit(risk_status,id)
          }
          else {
            this.notification.showWarning("Please select a valid file & Proceed!");
            this.spinnerservice.hide();
            return false
          }
        })
      } else {
        this.notification.showInfo("Please upload a file before submitting!");
        this.spinnerservice.hide();
        return false;

      }
    }

  //   let formArray = this.questionForm.get('rows') as FormArray;

  //   formArray.controls.forEach(control => {

  //     const id = control.value.id;
  //     const ans_id = control.value.answer_id;
  //     const impact = control.get('impact').value;
  //     const likelhood = control.get('likelhood').value;

  //     const idExists = this.payloadArraySave?.some(val => val.id === id);
  //     if(!idExists){
  //       if (impact && likelhood) { 
  //         const dict = {
  //           id: id,
  //           ans_id: ans_id,
  //           impact: impact,
  //           likelhood: likelhood,
  //         };
  //         this.payloadArraySave.push(dict);
  //       }
  //       console.log("payloadArraySave",this.payloadArraySave)
  //     } else {
  //       return false;
  //     }
  //   })
  //   this.spinnerservice.show();


  //   this.atmaservice.saveData(this.vendorid,this.activityid,risk_status,this.vendor_mapping_id,this.payloadArraySave).subscribe((res) => {
  //     if(res.status){
  //       // this.evaluateRes = res['data'];
  //       // this.risk_score =  res.total;
  //       // this.adjusted_risk_score = parseFloat(res.adjusted_risk_score)
  //       // this.adjusted_risk_score = 
  //       this.rows.clear();
  //       this.displayData = [];
  //       console.log("displayData",this.displayData);
  //       // this.clearFields();
  //       this.getactivityleveluestion(this.activityid);
  //       // this.updateFields(this.evaluateRes)
  //       // this.evaluateRes.forEach(ans => {
  //       //   this.rows.push(this.createRow(ans));
  //       // })
  //       // this.combineDataJW();
  //       // this.payloadArray = [];
  //       this.spinnerservice.hide();
  //       let string = (id == 1) ? "Questionnaire Saved!" : (id == 2) ? "Questionnaire Submission Successful!" : "";
  //       this.notification.showSuccess(string);
  //       this.payloadArraySave = [];
  //     }
  //     else if(res.code){
  //       this.notification.showError("Questionnaire Submission Unsuccessful!");
  //       // this.CombineArray = [];
  //       this.spinnerservice.hide();
  //       this.payloadArraySave = [];

  //     }
  // })
  // this.payloadArraySave = [];
  // this.CombineArray = [];
    // this.isScore = true;

  }

  questionsubmit(risk_status,id){

    // this.spinnerservice.show()
    let formArray = this.questionForm.get('rows') as FormArray;

    formArray.controls.forEach(control => {

      const id = control.value.id;
      const ans_id = control.value.answer_id;
      const impact = control.get('impact').value;
      const likelhood = control.get('likelhood').value;

      const idExists = this.payloadArraySave?.some(val => val.id === id);
      if(!idExists){
        if (impact && likelhood) { 
          const dict = {
            id: id,
            ans_id: ans_id,
            impact: impact,
            likelhood: likelhood,
          };
          this.payloadArraySave.push(dict);
        }
        console.log("payloadArraySave",this.payloadArraySave)
      } else {
        return false;
      }
    })
    // this.spinnerservice.show();


    this.atmaservice.saveData(this.vendorid,this.activityid,risk_status,this.vendor_mapping_id,this.payloadArraySave).subscribe((res) => {
      if(res.status){
        // this.evaluateRes = res['data'];
        // this.risk_score =  res.total;
        // this.adjusted_risk_score = parseFloat(res.adjusted_risk_score)
        // this.adjusted_risk_score = 
        this.rows.clear();
        this.displayData = [];
        console.log("displayData",this.displayData);
        // this.clearFields();
        this.getactivityleveluestion(this.activityid);
        // this.updateFields(this.evaluateRes)
        // this.evaluateRes.forEach(ans => {
        //   this.rows.push(this.createRow(ans));
        // })
        // this.combineDataJW();
        // this.payloadArray = [];
        this.spinnerservice.hide();
        let string = (id == 1) ? "Questionnaire Saved!" : (id == 2) ? "Questionnaire Submission Successful!" : "";
        this.notification.showSuccess(string);
        this.payloadArraySave = [];
      }
      else if(res.code){
        this.notification.showError("Questionnaire Submission Unsuccessful!");
        // this.CombineArray = [];
        this.spinnerservice.hide();
        this.payloadArraySave = [];

      }
  })
  this.payloadArraySave = [];
  }
  declaration(e){
    if(e.checked == true){
      this.enableSubmit = true;
    }
    else if(e.checked == false){
      this.enableSubmit = false;
    }
  }
  fileSelected(e){
    this.file = e.target.files[0];
    console.log("thi.dile",this.file)
  }
  returnForm(){
    let remarks_val = this.returnform.value.remarks
    if(this.returnform.invalid){
      this.notification.showInfo("Please Enter Remarks!");
      return false;
    }
    let remarks = {
      "remarks": remarks_val,
    }
    this.spinnerservice.show();
    this.atmaservice.returnForm(this.vendorid,this.activityid,this.vendor_mapping_id,remarks).subscribe(res => {
      if(res.status == 'success'){
        this.notification.showSuccess("Questionnaire Returned!");
        this.spinnerservice.hide();
        this.closeRemarks.nativeElement.click();
        this.returnform.reset();
        this.rows.clear();
        this.displayData = [];
        console.log("displayData",this.displayData);
        // this.clearFields();
        this.getactivityleveluestion(this.activityid);
      } else{
        this.notification.showWarning("Something went wrong!");
        this.spinnerservice.hide();
        this.closeRemarks.nativeElement.click();
        this.returnform.reset();
        return false;
      }
    })
  }
  
  acceptForm(){
    let remarks_val = this.acceptform.value.remarks
    if(this.acceptform.invalid){
      this.notification.showInfo("Please Enter Remarks!");
      return false;
    }
    let remarks = {
      "remarks": remarks_val,
    }
    this.spinnerservice.show();
    this.atmaservice.approveForm(this.vendorid,this.activityid,this.vendor_mapping_id,remarks).subscribe(res => {
      if(res.status == 'success'){
        this.notification.showSuccess("Questionnaire Approved!");
        this.spinnerservice.hide();
        this.closeAccept.nativeElement.click();
        this.acceptform.reset();
        this.rows.clear();
        this.displayData = [];
        console.log("displayData",this.displayData);
        // this.clearFields();
        this.getactivityleveluestion(this.activityid);

      } else{
        this.notification.showWarning("Something went wrong!");
        this.spinnerservice.hide();
        this.closeAccept.nativeElement.click();
        this.acceptform.reset();
        return false;
      }
    })
  }
  backtoLogin(){
    let confirm = window.confirm("Are you sure you want to leave this page? Your form data will be lost unless saved.");
    if(confirm){
      this.spinnerservice.show();
      this.router.navigateByUrl('/login');
      this.spinnerservice.hide();
    } else {
      return false;
    }
}

imageUrl = environment.apiURL
tokenValues: any
showimageHeaderAPI: boolean
showimagepdf: boolean
pdfurl: any
jpgUrlsAPI: any

fileView() {
  let id = this.file_id
  let file_name = this.file_name;
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token }
  let stringValue = file_name.split('.').pop()?.toLowerCase() || '';
  if (stringValue === "png" || stringValue === "jpeg" || stringValue === "jpg") {
    this.showimageHeaderPreview = true
    this.showimageHeaderPreviewPDF = false
    this.showtxt =false
    this.showdoc=false
    // this.jpgUrls = this.imageUrl + "/inwdserv/fileview/Inwd_1040" + "?token=" + token;
    this.jpgUrls = this.imageUrl + "venserv/view_riskfile/" + id + "?token=" + token;
    // this.jpgUrls = this.imageUrl + "venserv/view_riskfile/" + id


    console.log("urlHeader", this.jpgUrls)
  }
  if (stringValue === "pdf") {
    this.showimageHeaderPreviewPDF = true
    this.showimageHeaderPreview = false
    this.showtxt =false
    this.showdoc=false
    this.atmaservice.viewfile(id)
      .subscribe((data) => {
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        this.pdfurl = downloadUrl
      }, (error) => {
        this.errorHandler.handleError(error);
        this.showimageHeaderPreviewPDF = true
        this.showimageHeaderPreview = false
        this.showtxt =false
        this.showdoc=false
        this.spinnerservice.hide();
      })
  }
  // imagePreview_attachment(pdf_id, file_name) {
  //   const getToken = localStorage.getItem("sessionData");
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token;
  //   this.tokenValues = token
  //   let stringValue = file_name.split('.')
  //   this.fileextension=stringValue.pop();
  //   if ( this.fileextension === "pdf"){
  //    window.open( this.imageUrl + "memserv/memo/download/" + pdf_id + "?type=pdf&token=" + token, "_blank");
  //     // this.pdffilename=this.imageUrl + "memserv/memo/download/" + pdf_id + "?type=pdf&token=" + token
  //     // this.modalService.open(this.popupcontent,{size: 'xl', windowClass:"huge"})
      
  //   }
  //   else if( this.fileextension === "png" ||  this.fileextension === "jpeg" ||  this.fileextension === "jpg" ||  this.fileextension === "JPG" ||  this.fileextension === "JPEG") {
  //     this.imgfilename = this.imageUrl + "memserv/memo/download/" + pdf_id + "?token=" + token;
  //     // this.modalService.open(this.popupcontent)
  //     // window.open( this.imageUrl + "memserv/memo/download/" + pdf_id + "?type=" + fileextension + "&token=" + token, "_blank");
      
  //   }
  //   else{
  //     this.pdfUrls = this.imageUrl + "memserv/memo/download/" + pdf_id + "?type= " +  this.fileextension + "&token=" + token;
  //         let anchor = document.createElement('a');
  //         anchor.href = this.pdfUrls;
  //         anchor.target = '_blank';
  //         anchor.click();
         
  //   }
  // }
    
  // if (stringValue[1] === "txt") {
  //   this.showimageHeaderPreview = false
  //   this.showimageHeaderPreviewPDF = false
  //   this.showtxt =true
  //   this.showdoc=false
  //   this.dataService.pdfPopup(id)
  //     .subscribe((data) => {
  //       let binaryData = [];
  //       binaryData.push(data)
  //       let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
  //       let link = document.createElement('a');
  //       link.href = downloadUrl;
  //       this.pdfurl = downloadUrl
  //     }, (error) => {
  //       this.errorHandler.handleError(error);
  //       this.showimageHeaderPreview = false
  //       this.showimageHeaderPreviewPDF = false
  //       this.showtxt =true
  //       this.showdoc=false
  //       // this.SpinnerService.hide();
  //     })
  // }
//  if (stringValue[1] === "docx") {
//   this.showimageHeaderPreview = false
//   this.showimageHeaderPreviewPDF = false
//   this.showtxt =false
//   this.showdoc=true
//     this.dataService.pdfPopup(id)
//       .subscribe((data) => {
//         let fileUrl = URL.createObjectURL(data);
//         // this.docUrl = 'https://view.officeapps.live.com/op/embed.aspx?src=' + encodeURIComponent(fileUrl);
//         this.docUrl = 'https://docs.google.com/viewer?url=https://example.com/my-document.docx';
//                }, (error) => {
//         this.errorHandler.handleError(error);
//         this.showimageHeaderPreview = false
//         this.showimageHeaderPreviewPDF = false
//         this.showtxt =false
//         this.showdoc=true
//       });
//   }
if (stringValue === "csv" || stringValue === "ods" || stringValue === "xlsx" || stringValue === "txt" || stringValue === "doc" || stringValue === "docx") {
    this.showimageHeaderPreview = false
    this.showimageHeaderPreviewPDF = false
    this.showtxt =false
        this.showdoc=false
    this.notification.showInfo('Preview not available for this format')
  }
}

reviewDownload(){
  this.spinnerservice.hide();

  // if(id){ 
  this.atmaservice.reviewDownload()
  .subscribe(data => {
    this.spinnerservice.hide();
    let binaryData = [];
    binaryData.push(data)
    let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    let link = document.createElement('a');
    link.href = downloadUrl;
    let date: Date = new Date();
    link.download = 'SupplierQuestionnaire_format' + ".xlsx";
    // link.download = "ExpenseClaimForm.pdf";
    link.click();


  },
    error => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide();


    }

  )
}
downloadpdf(){
  this.spinnerservice.hide();

  // if(id){ 
  this.atmaservice.pdfDownload1()
  .subscribe(data => {
    this.spinnerservice.hide();
    let binaryData = [];
    binaryData.push(data)
    let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    let link = document.createElement('a');
    link.href = downloadUrl;
    let date: Date = new Date();
    link.download = 'SupplierPerformanceSheet' + ".pdf";
    // link.download = "ExpenseClaimForm.pdf";
    link.click();


  },
    error => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide();


    }

  )
// }
  // else {
  //   this.notification.showInfo("No Records Found!");
  //   this.spinnerservice.hide();
  // }
}
}
