import { Component, EventEmitter, Input, OnInit, Output, ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProofingService } from '../proofing.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ShareService } from '../share.service';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  fileuploadForm:FormGroup;
  viewfileuploadForm:FormGroup;
  @Input() Id:any
  images: any;
  accountid: any;
  ishide:boolean=false
  templateText: string
  acceptfiles = { EXCEL: '.xls, .xlsx, .xlsm, .csv' }
  excel_ac_file: File;
  proofingList: Array<any>;
  datafetch: any;
  @Output() onCancel = new EventEmitter<any>();
  @ViewChild("closeaddpopup") closeAddPopup: ElementRef;
  createvalues: number = 0;
  editvalues: number = 0;
  showcreate: boolean = false;
  showview: boolean = false;
  proofUrl = environment.apiURL
  fileuploadsummaryObjNew:any
  CommentintervalId:any
  showdrop: boolean = true
  restformdropfileupload:any
  restformfileupload:any;
  constructor(private fb: FormBuilder, 
    private notification: NotificationService,
    private spinner: NgxSpinnerService, private proofingService: ProofingService,
    private shareservice: ShareService,private datePipe: DatePipe) { 
      
    }

  ngOnInit(): void {
    
    this.fileuploadForm = this.fb.group({
      images: ['', Validators.required],
      from_date: [''],
      to_date: [''],
      accountno: ['']
    });
    this.viewfileuploadForm = this.fb.group({
      images: ['', Validators.required],
    });

    this.createvalues=this.shareservice.createvalue.value
    console.log("createvalues====>",this.createvalues)
    this.editvalues=this.shareservice.editvalue.value
    console.log( "editvalues=====>", this.editvalues)
    console.log("id",this.Id)
    // if(this.createvalues === 1){
    //   this.showcreate = true;
    //   this.showview = false
    // }
    // else if(this.editvalues === 2){
    //   this.showview = true
    //   this.showcreate = false
    // }
  }
  // uploadDocument() {
  
  //   if(!this.images){
  //      this.notification.showError("Please select a File");
  //      return false;
  //   }
  //   this.spinner.show();
  //   this.proofingService.fileupload( this.images)
  //     .subscribe((results: any) => {
  //       this.spinner.hide()
  //       console.log("UploadFile", results)
  //       if (results?.description) {
        
  //         this.notification.showError(results.description)
  //       }
  //       else {
  //         if(results?.status==='Success' && results?.message==='Data processing start'){
  //           this.notification.showSuccess(results?.message);
  //         }
  //         else{
  //         let file = results['data'];
  //         this.proofingList = file;
  //         console.log("Results from API", results['data']);
  //         this.datafetch = results.count;
  //         let closingbalnce=results.closing_balance;
  //         // let succes="Number Of Transaction Items Uploaded: '+this.datafetch+'Closing Balance:'+closingbalnce"
  //         this.notification.showSuccess('Number Of Transaction Items Uploaded: '+this.datafetch+'\n Closing Balance:'+closingbalnce)
  //         // this.ishide=false
  //         // console.log("UploadFILESList", this.proofingList)
  //         this.fileuploadForm.reset();
  //       }
  //       }

  //     }, (error:HttpErrorResponse) => {
  //       this.spinner.hide();
  //       this.notification.showWarning(error.status+ error.message)
  //     })
  // }

  uploadDocument() {
    console.log("fsdfsdfds_+++", this.shareservice.accountobject.value);
    // let template_id:any=this.shareservice.accountobject.value;
    let template_id: any = this.fileuploadForm.get("accountno").value
    let pass_tmp_id:any=template_id?.wisefin_template?.id;
    // this.accountid=this.shareservice.accountobject.value?.['id'];
    // this.accountid = template_id.cbs_template.id
    this.accountid = template_id?.id
    // let from_date = this.datePipe.transform(this.fileuploadForm.value.from_date, 'yyyy-MM-dd');
    // if (from_date == '' || from_date == null || from_date == undefined) {
    //   this.notification.showError("Please select valid from date");
    //   return false;
    // }
    // let to_date = this.datePipe.transform(this.fileuploadForm.value.to_date, 'yyyy-MM-dd');
    // if (to_date == '' || to_date == null || to_date == undefined) {
    //   this.notification.showError("Please select valid to date");
    //   return false;
    // }
    // let params = 'fromdate=' + from_date;
    // to_date ? params += '&todate=' + to_date : '';
   
   
    if(!this.accountid){
        this.notification.showError("Please select account number");
        return false;
    }
    if(!this.images){
       this.notification.showError("Please select a File");
       return false;
    }
    this.spinner.show();
    this.proofingService.proofingfileuploadDocument(this.accountid, this.images)
      .subscribe((results: any) => {
        this.spinner.hide()
       
        
        console.log("UploadFile", results)
        if (results?.description) {
          // this.uploadForm.reset(); 
          this.notification.showError(results.description)
        }
        else {
          if(results?.status==='Success' && results?.message==='Data processing start'){
            this.notification.showSuccess(results?.message);
            // this.onCancel.emit();
            this.backtouploadsummary()
            this.fileuploadForm.reset();
            this.fileuploadForm.get("accountno").reset()
            // this.closeAddPopup.nativeElement.click
            // this.restformfileupload = []
            // this.closeAddPopup.nativeElement.style.display = 'none';
            
          //  return false
          }
          else{
          let file = results['data'];
          this.proofingList = file;
          console.log("Results from API", results['data']);
          this.datafetch = results.count;
          let closingbalnce=results.closing_balance;
          // let succes="Number Of Transaction Items Uploaded: '+this.datafetch+'Closing Balance:'+closingbalnce"
          this.notification.showSuccess('Number Of Transaction Items Uploaded: '+this.datafetch+'\n Closing Balance:'+closingbalnce)
          this.ishide=false
          // console.log("UploadFILESList", this.proofingList)
          this.fileuploadForm.reset();
          this.fileuploadForm.get("accountno").reset()
          this.shareservice.accountobject.next(null)
          this.restformdropfileupload = []
          // this.closeAddPopup.nativeElement.click();

        
        }
        }

      }, (error:HttpErrorResponse) => {
        this.spinner.hide();
        this.notification.showWarning(error.status+ error.message)
      })
  }
  fileChange(file,data) {
    if(data==='notbulk'){
    this.images = <File>file.target.files[0];
    console.log(this.fileuploadForm.value.images)
    }
    else if(data==='bulk'){
      this.excel_ac_file = <File>file.target.files[0];
      // this.excel_ToUpload.append('file',<File>file.target.files[0]);
    // console.log(this.ac_excelform.value.ac_ex_images);
    // console.log(this.excel_ToUpload)
    }
    }

    viewuploadDocument() {
  
    if(!this.images){
       this.notification.showError("Please select a File");
       return false;
    }
    this.spinner.show();
    this.proofingService.fileupload( this.images)
      .subscribe((results: any) => {
        this.spinner.hide()
        console.log("UploadFile", results)
        if (results?.description) {
        
          this.notification.showError(results.description)
        }
        else {
          if(results?.status==='Success' && results?.message==='Data processing start'){
            this.notification.showSuccess(results?.message);
          }
          else{
          let file = results['data'];
          this.proofingList = file;
          console.log("Results from API", results['data']);
          this.datafetch = results.count;
          let closingbalnce=results.closing_balance;
          // let succes="Number Of Transaction Items Uploaded: '+this.datafetch+'Closing Balance:'+closingbalnce"
          this.notification.showSuccess('Number Of Transaction Items Uploaded: '+this.datafetch+'\n Closing Balance:'+closingbalnce)
          // this.ishide=false
          // console.log("UploadFILESList", this.proofingList)
          this.fileuploadForm.reset();
        }
        }

      }, (error:HttpErrorResponse) => {
        this.spinner.hide();
        this.notification.showWarning(error.status+ error.message)
      })
  }

  viewfileChange(file,data) {
    if(data==='notbulk'){
    this.images = <File>file.target.files[0];
    console.log(this.fileuploadForm.value.images)
    }
    else if(data==='bulk'){
      this.excel_ac_file = <File>file.target.files[0];
      // this.excel_ToUpload.append('file',<File>file.target.files[0]);
    // console.log(this.ac_excelform.value.ac_ex_images);
    // console.log(this.excel_ToUpload)
    }
    }

  backtouploadsummary(){
    this.onCancel.emit();
    // this.closedpopup()
    
  }
  // frtodate:any = {"fromobj":{label: "From Date"},toobj:{label: "To Date"}}

//   fromdatefun(frod){
// this.fileuploadForm.patchValue({
//   from_date:frod
// })
//   }
//   todatefun(tod){
//     this.fileuploadForm.patchValue({
//       to_date:tod
//     })

//   }

  fileupoladfield:any = {
    label: "Template",
    method: "get",
    url: this.proofUrl + "prfserv/template",
    params: "",
    searchkey: "query",
    displaykey: "template",
    wholedata: true,
  }

  fileuploaddata(data){
this.fileuploadForm.patchValue({
  accountno: data
})
  }

  resetFormFromParent() {
    this.fileuploadForm.get("images").reset();
    // this.restformfileupload = [];
    this.restformdropfileupload= []
  }

}

