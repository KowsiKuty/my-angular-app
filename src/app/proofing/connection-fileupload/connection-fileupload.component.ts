import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';

import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProofingService } from '../proofing.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-connection-fileupload',
  templateUrl: './connection-fileupload.component.html',
  styleUrls: ['./connection-fileupload.component.scss']
})
export class ConnectionFileuploadComponent implements OnInit {
  proofUrl = environment.apiURL
  fileuploadsummaryObjNew: any = { "method": "get", "url": this.proofUrl + "prfserv/connection_file_upload_summary" }
  uploadsearch: any;
  searchvar: any = "String";
  connectionsummary: boolean = true
  file_view: boolean = false
  uploadfile = new FormControl('');
  restformfile:any
  searchSumm: number;
  CommentintervalId: any;
  fa: any;
  filetype:any
  fileviewbutton:any
  inputaccount:any
  searchupload(e) {

    this.fileuploadsummaryObjNew = { "method": "get", "url": this.proofUrl + "prfserv/connection_file_upload_summary", "params": e }

  }
  createfileupload() {
    // this.id=0
    // this.uploadcreateview = true
    // this.uploadsummary = false
    // this.trans = false
    // this.trans = false
    this.popupopen("exampleModal")
    this.stopInterval()
  }

  popupopen(data) {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById(data),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  constructor(private fb: FormBuilder, private notification: NotificationService, private spinner: NgxSpinnerService, private proofingService: ProofingService) { 

    this.fileviewbutton = [
      { icon: "add", function: this.createfileupload.bind(this), "tooltip": "Connection File Upload Create"}]

    this. inputaccount= {
        label: "GL Number",
        method: "get",
        url: this.proofUrl + "prfserv/accounts",
        params: "",
        searchkey: "query",
        displaykey:"account_id_name",
        wholedate: true, 
        required: true,
      }
  }
  fileuploadForm: FormGroup


  ngOnDestroy() {
    this.stopInterval();
  }


  stopInterval() {
    if (this.CommentintervalId) {
      clearInterval(this.CommentintervalId);
      this.CommentintervalId = null;
    }
  }
  ngOnInit(): void {
    this.fileuploadForm = this.fb.group({
      images: ['', Validators.required],
      // from_date: [''],
      // to_date: [''],
      // accountno: ['']
    });
    this.uploadsearch = [
      { "type": "input", "label": "File Name", "formvalue": "name" },
      { "type": "date", "label": "Uploaded Date", "formvalue": "transdate" }
    ]
  }
  fileuploadsummaryData: any = [{ "columnname": "File Name", "key": "filename" },{ "columnname": "File Type", "key": "file_type" },
  // {"columnname": "GL Number",  key: "acc_num"},
  {
    "columnname": "Uploaded Date", key: "createddate",
    type: "Date", "datetype": "dd-MMM-yyyy"
  },
  // {"columnname": "From Date",  key: "from_date",
  // type: "Date","datetype": "dd-MMM-yyyy"},
  // {"columnname": "To Date",  key: "to_date",
  // type: "Date","datetype": "dd-MMM-yyyy"},
  { "columnname": "Data Count", "key": "file_count" },
  {
    "columnname": "Status", "key": "status", validate: true,
    validatefunction: this.statusname.bind(this),
  },
  {
    "columnname": "View", icon: "visibility", style: { cursor: "pointer" }, button: true, function: true,
    clickfunction: this.uploadview.bind(this),
  },
  {
    "columnname": "Map", icon: "swap_horizontal_circle", style: { cursor: "pointer" }, button: true, function: true,
    clickfunction: this.map.bind(this),
  },
    //   {"columnname": "Download", icon: "download",style: {cursor:"pointer"},button:true, function:true,clickfunction: this.genfiledownload.bind(this)}
  ]
  file_id:number=0
  proof_id:any;
  map(data){
    this.proof_id = data.proof_temp_id
    console.log("xczxczxcfds", data)
    this.fa = data?.file_type;
      this.popupopen("map")
      this.file_id=data?.id
    this.stopInterval()
    
  }

  viewsummary: any
  transsummaryData: any
  transsearch: any
  statusTypeList = [
    { status: "1", value: "Auto Knockoff" },
    { status: "2", value: "Partially Mapped" },
    { status: "3", value: "Unmapped" }
  ];
  statusfield: any = {
    label: "status",
    fronentdata: true,
    data: this.statusTypeList,
    displaykey: "value",
    Outputkey: "status",
    valuekey: "status",
  }

  searchtransupload(data) {
    console.log("sfsdfvsgr", data.file_type);
  let datsss = this.filetype
  data['file_id'] = this.tranid;
  console.log(datsss,"zdsfg")
    if (datsss === "PPX") {
      this.viewsummary = {
        method: "post",
        url: this.proofUrl + "prfserv/ppx_connect_temp_summ",
        data: data,
      };
      this.searchSumm = 1;
    } else if (datsss === "FA") {
      this.viewsummary = {
        method: "post",
        url: this.proofUrl + "prfserv/fa_liqudation_temp_summ",
        data: data,
      };
      this.searchSumm = 2;
    }else if (datsss === "FA-CHECKER"){
      this.viewsummary = { "method": "post", "url": this.proofUrl + "prfserv/fa_checker_summ", data: data }
      this.searchSumm = 3;
    }
    else if (datsss === "FA-MAKER"){
      this.viewsummary = { "method": "post", "url": this.proofUrl + "prfserv/fa_maker_summ", data: data }
      this.searchSumm = 4;
    }
    else if (datsss === "FA-BUCKET"){
      this.viewsummary = { "method": "post", "url": this.proofUrl + "prfserv/bucket_name_summ", data: data }
      this.searchSumm = 5;
    }
       else {
        if (this.searchSumm == 2) {
          this.viewsummary = {
            method: "post",
            url: this.proofUrl + "prfserv/fa_liqudation_temp_summ",
            data: data,
          };
        }
       else if (this.searchSumm == 1) {
          this.viewsummary = {
            method: "post",
            url: this.proofUrl + "prfserv/ppx_connect_temp_summ",
            data: data,
          };
        }
       else if (this.searchSumm == 3){
          this.viewsummary = { "method": "post", "url": this.proofUrl + "prfserv/fa_checker_summ", data: data }
        }
        else if (this.searchSumm == 4 )  {
          this.viewsummary = { "method": "post", "url": this.proofUrl + "prfserv/fa_maker_summ", data: data }
        }
       else if (this.searchSumm == 5){
          this.viewsummary = { "method": "post", "url": this.proofUrl + "prfserv/bucket_name_summ", data: data }
        }
      }
      
    }
  
  

  tranid: number = 0
  crno:number = 0
  expensegl:any
  assetbarcode:any
  uploadview(datsa) {
    console.log("adasdada===", datsa)
this.filetype = datsa.file_type
    if(datsa.file_type== 'FA'){
      this.transsearch = [
        { "type": "input", "label": "Barcode", formvalue: "asset_barcode"},
        { "type": "input", "label": "Cr Number", formvalue: "cr_no" },
        { "type": "input", "label": "Expense Gl", formvalue: "expense_gl" },
      ]
      this.tranid = datsa?.id
      let datas = {
        "file_id": datsa?.id
      }
       this.viewsummary = { "method": "post", "url": this.proofUrl + "prfserv/fa_liqudation_temp_summ", data: datas}
  
      this.connectionsummary = false
      this.file_view = true
  
      this.transsummaryData = [{ "columnname": "Asset Category", "key": "asset_cat" },{ "columnname": "Sub Category", "key": "asser_subcat" },
      { "columnname": "Asset Barcode", "key": "asset_barcode" },
        {"columnname": "Asset Group", "key": "asset_grp_id"},
        { "columnname": "Asset Transaction", "key": "asset_tran_id"},
        {"columnname": "Transaction Date", "key": "tran_date",  type: "Date","datetype": "dd-MMM-yyyy"},
        // {"columnname": "Status", "key": "status",validate: true,
        //   validatefunction: this.statuskey.bind(this)},
        // {"columnname": "Label", "key": "label_id"},
        // { "columnname": "Description", "key": "description"},
      ]

    }
    else if (datsa.file_type== "FA-CHECKER"){
    
      this.connectionsummary = false
      this.file_view = true
      this.tranid = datsa?.id
      let datas = {
        "file_id": datsa?.id
      }
      this.viewsummary = { "method": "post", "url": this.proofUrl + "prfserv/fa_checker_summ", data: datas }
      this.transsearch = [
        { "type": "input", "label": "ECF NUMBER", formvalue: "ecfnum"}
      ]
      this.transsummaryData = [{ "columnname": "ECF NUMBER", "key": "ecfnum" }
        ]
    }
    else if (datsa.file_type== "FA-MAKER"){
      this.connectionsummary = false
      this.file_view = true
      this.tranid = datsa?.id
      let datas = {
        "file_id": datsa?.id
      }
      this.viewsummary = { "method": "post", "url": this.proofUrl + "prfserv/fa_maker_summ", data: datas }
      this.transsearch = [
        { "type": "input", "label": "ECF NUMBER", formvalue: "ecfnum"}
      ]
      this.transsummaryData = [{ "columnname": "ECF NUMBER", "key": "ecfnum" }
      ]
    }
    else if (datsa.file_type== "FA-BUCKET"){
      this.connectionsummary = false
      this.file_view = true
      this.tranid = datsa?.id
      let datas = {
        "file_id": datsa?.id
      }
      this.viewsummary = { "method": "post", "url": this.proofUrl + "prfserv/bucket_name_summ", data: datas }
      this.transsearch = [
        { "type": "input", "label": "ECF NUMBER", formvalue: "ecfnum"}
      ]
      this.transsummaryData = [{ "columnname": "ECF NUMBER", "key": "ecfnum" }, {"columnname": "Bucket Name", "key":"bucket_name"}
      ]
    }
    else if (datsa.file_type== "PPX"){
      
    
    this.transsearch = [
      { "type": "input", "label": "ECF CRNO", formvalue: "ecf_crno"},
      { "type": "input", "label": "ECF Invoice Amount", formvalue: "amount"},
      { "type": "input", "label": "PPX CRNO", formvalue: "ppxcrno"},
    ]
    this.tranid = datsa?.id
    let datas = {
      "file_id": datsa?.id
    }
    this.viewsummary = { "method": "post", "url": this.proofUrl + "prfserv/ppx_connect_temp_summ", data: datas }

    this.connectionsummary = false
    this.file_view = true

    this.transsummaryData = [{ "columnname": "ECF CRNO", "key": "ecf_crno" },
    { "columnname": "ECF Invoice Amount", "key": "ecf_inv_amt" },
    { "columnname": "PPX CRNO", "key": "ppx_crno" },
    {"columnname": "ECF Taxable Amount", "key": "ecf_taxable_amt"},
    {"columnname": "ECF TYPE", "key": "ecf_type"},
    { "columnname": "Invoice Date", "key": "invoice_date",type: "Date","datetype": "dd-MMM-yyyy"},
    {"columnname": "Inovice Number", "key": "invoice_no"},
    {"columnname": "Raiser Branch", "key": "raiser_branch"},
    {"columnname": "Suppiler Code", "key": "supplier_code"},
    {"columnname": "Suppiler Name", "key": "supplier_name"},
      // {"columnname": "Status", "key": "status",validate: true,
      //   validatefunction: this.statuskey.bind(this)},
     
      // { "columnname": "Description", "key": "description"},
    ]
    }
  }
  statusname(data) {
    let config: any = {
      style: "",
      value: "",
      class: ""
    };
    if (data.status == 1) {
      config = {
        class: "table-badge10",
        style: "",
        value: "File Type Mismatch",
      }
    }

   else  if (data.status == 2) {
      config = {
        class: "table-badge4",
        style: "",
        value: "Upload Started",
      }
    }
    else if (data.status == 3) {
      config = {
        class: "table-badge3",
        style: "",
        value: "Processing",
      }
    }
    else if (data.status == 4) {
      config = {
        class: "table-badge2",
        style:"",
        value: "Success",
      }
    }
    else if (data.status == 5) {
      config = {
        class: "table-badge",
        style: "",
        value: "Data Insert Failed",
      }
    }
    else if (data.status == 6) {
      config = {
        class:"table-badge",
        style: "",
        value: "Upload Failed in S3",
      }
    }
    else if (data.status == 7) {
      config = {
        class: "table-badge6",
        style: "",
        value: "CM Started",
      }

    }
    else if (data.status == 8) {
      config = {
        class: "table-badge4",
        style: "",
        value: "CM Datas Inserted Success DR",
      }
    }
    else if (data.status == 9) {
      config = {
        class: "table-badge11",
        style: "",
        value: "Datas Inserted Into DB",
      }
    }
    else if (data.status == 10) {
      config = {
        class: "table-badge3",
        style: "",
        value: "CM Updation Started DR",
      }
    }
    else if (data.status == 11) {
      config = {
        class: "table-badge2",
        style: "",
        value: "Insert Datas Success",
      }
    }
    else if (data.status == 12) {
      config = {
        class: "table-badge9",
        style: "",
        value: "CM Filtering Data DR",
      }
    }
    else if (data.status == 13){
      config = {
        class: "table-badge3",
        style: "",
        value: "Excel Validation Started",
      }
    }
    else if (data.status == 14) {
      config = {
        class: "table-badge2",
        style: "",
        value: "CM Datas Inserted Success CR",
      }
    }

    else if (data.status == 15){
      config = {
        class: "table-badge7",
        style: "",
        value: "CM Updation Started CR",
      }
    }
    else if (data.status == 16){
      config = {
        class: "table-badge4",
        style:"",
        value: "CM Filtering Data CR",
      }
    }
    else if (data.status == 17){
      config = {
        class: "table-badge",
        style:"",
        value: "Failed",
      }
    }
    else if (data.status == 18){
      config = {
        class: "table-badge",
        style: "",
        value: "Excel Header Validation Failed",
      }
    }
    else if (data.status == 19){
      config = {
        class: "table-badge3",
        style: "",
        value: "BM Started",
      }
    }
    else if (data.status == 20){
      config = {
        class: "table-badge7",
        style: "",
        value: "BM Updation",
      }
    }
    else if(data.status == 21){
      config = {
        class: "table-badge6",
        style: "",
        value: "BM Filtering",
      }
    }

    else if (data.status == 22){
      config = {
        class: "table-badge4",
        style: "",
        value: "GL Mapping Started",
      }
    }
    else if (data.status == 23){
      config = {
        class: "table-badge2",
        style: "",
        value: "Started",
      }
    }
    else {
      config = {
        value: data.status,
      }
    }
    return config
  }

  // uploadview(num){
  //   console.log("ssadsadwqdsawqsaddwq", num)
  //   this.id=num.id
  //   num.fileid = this.id
  //   let data = {fileid : num.fileid}
  //   console.log("asadsaas++++", this.file)
  //   this.trans = true
  //   this.stopInterval()
  //   this.uploadsummary = false
  //   this.uploadcreateview = false
  //   this.transsummaryObjNew = { "method": "post", "url": this.proofUrl + "prfserv/transaction_summary","params":"&isexcel=false","data": data}
  //   this.transsummaryData = [{ "columnname": "GL Number", "key": "gl_number"},
  //     { "columnname": "Credit Amount", "key": "creditamount"},
  //     { "columnname": "Debit Amount", "key": "debitamount"},
  //     {"columnname": "Branch Code", "key": "BranchCode"},
  //     {"columnname": "Branch Name", "key": "BranchName"},
  //     { "columnname": "Reference No", "key": "reference_no"},
  //     {"columnname": "Date", "key": "tag_date",  type: "Date","datetype": "dd-MMM-yyyy"},
  //     {"columnname": "Status", "key": "status",validate: true,
  //       validatefunction: this.statuskey.bind(this)},
  //     {"columnname": "Label", "key": "label_id"},
  //     { "columnname": "Description", "key": "description"},
  //   ]
  // }
  @ViewChild("closeaddpopup") closeaddpopup;
  @ViewChild("closeaddpopups") closeaddpopups;

  @ViewChild('fileupload') fileupload: FileUploadComponent;

  closepopup() {
    this.closeaddpopup.nativeElement.click();
    this.cancel()
    this.uploadfile.setValue("")
    this.restformfile = []
    this.ifscvar = []
    this.stopInterval()
  }
  acceptfiles = { EXCEL: '.xls, .xlsx, .xlsm, .csv' }
  templateText: string
 
  cancel() {
    // this.shareservice.accountobject.next(null);
    // if (this.fileupload) {
    //   this.fileupload.resetFormFromParent();
    // }
  }
  gl_no:any
  glnochoose(data){
    
this.gl_no=data?.account_number
  }
  images: any;
  excel_ac_file: any
  fileChange(file, data) {
    if (data === 'notbulk') {
      this.images = <File>file.target.files[0];
      console.log(this.fileuploadForm.value.images)
    }
    else if (data === 'bulk') {
      this.excel_ac_file = <File>file.target.files[0];
      // this.excel_ToUpload.append('file',<File>file.target.files[0]);
      // console.log(this.ac_excelform.value.ac_ex_images);
      // console.log(this.excel_ToUpload)
    }
  }
  // FA





// 11:08
// JV
  accTypeList: any = [{ "file_type": "PPX" },{ "file_type": "FA" },{ "file_type": "JV" }, {"file_type": "FA-BUCKET"}, {"file_type": "FA-MAKER"},{"file_type": "FA-CHECKER"}]
  fileupoladfield: any = {
    label: "File Type",
    params: "",
    displaykey: "file_type",
    wholedata: true,
    fronentdata: true, data: this.accTypeList,
  }
  file_type: any
  file_type_click(data) {
    this.file_type = data
  }
  uploadDocument() {
    // console.log("fsdfsdfds_+++", this.shareservice.accountobject.value);
    // let template_id:any=this.shareservice.accountobject.value;
    // let template_id: any = this.fileuploadForm.get("accountno").value
    // let pass_tmp_id: any = template_id?.wisefin_template?.id;
    // this.accountid=this.shareservice.accountobject.value?.['id'];
    // this.accountid = this.fileuploadForm.get("accountno").value?.id

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


    // if (!this.accountid) {
    //   this.notification.showError("Please select account number");
    //   return false;
    // }
    if (this.file_type == '' || this.file_type == undefined || this.file_type == null) {
      this.notification.showError("Please choose file type")
      return

    }
    let data = this.file_type
    if (!this.images) {
      this.notification.showError("Please select a File");
      return false;
    }
    this.spinner.show();
    this.proofingService.connection_uploadDocument(this.images, data)
      .subscribe((results: any) => {
        this.spinner.hide()


        console.log("UploadFile", results)
        if (results?.description) {
          // this.uploadForm.reset(); 
          this.notification.showError(results.description)
          this.file_type = ''
          this.closeaddpopup.nativeElement.click()
          this.fileuploadsummaryObjNew = { "method": "get", "url": this.proofUrl + "prfserv/connection_file_upload_summary" }


        }
        else {
          if (results?.status === 'Success' && results?.message === 'Data processing start') {
            this.notification.showSuccess(results?.message);
             this.CommentintervalId = setInterval(() => {
              this.fileuploadsummaryObjNew = { "method": "get", "url": this.proofUrl + "prfserv/connection_file_upload_summary" }
    }, 1000 * 20);
            // this.onCancel.emit();
            // this.backtouploadsummary()
            this.fileuploadForm.reset();
            this.fileuploadsummaryObjNew = { "method": "get", "url": this.proofUrl + "prfserv/connection_file_upload_summary" }

            this.file_type = ''
            // this.fileuploadForm.get("accountno").reset()
            // this.restformfileupload = []
            // this.closeAddPopup.nativeElement.style.display = 'none';
            this.closeaddpopup.nativeElement.click()

            //  return false
          }
          else {
            let file = results['data'];
            // this.proofingList = file;
            console.log("Results from API", results['data']);
            // this.datafetch = results.count;
            // let closingbalnce = results.closing_balance;
            // let succes="Number Of Transaction Items Uploaded: '+this.datafetch+'Closing Balance:'+closingbalnce"
            // this.notification.showSuccess('Number Of Transaction Items Uploaded: ' + this.datafetch + '\n Closing Balance:' + closingbalnce)
            // this.ishide = false
            // console.log("UploadFILESList", this.proofingList)
            this.fileuploadForm.reset();
            this.file_type = ''
            this.fileuploadsummaryObjNew = { "method": "get", "url": this.proofUrl + "prfserv/connection_file_upload_summary" }
            this.closeaddpopup.nativeElement.click()

            // this.fileuploadForm.get("accountno").reset()
            // this.shareservice.accountobject.next(null)
            // this.restformdropfileupload = []

          }
        }

      }, (error: HttpErrorResponse) => {
        this.spinner.hide();
        this.notification.showWarning(error.status + error.message)
        this.closeaddpopup.nativeElement.click()

      })
  }
  ifscvar:any=[]
  mapp_connection(){
    // let datss={
    //   "glno":this.gl_no,
    //   "file_id":this.file_id,
    //   "file_type":  this.fa
    //   }
    let datss={
      "glno":this.gl_no,
      "file_id":this.file_id
      }
      this.spinner.show()
      if(this.fa == "FA-BUCKET"){
        this.proofingService.fa_connection_map(datss,this.proof_id)
      
        .subscribe((results: any) => {
          this.spinner.hide()
  
  
          console.log("UploadFile", results)
          if (results?.status === 'Success' && results?.message === 'Data processing start') {
            this.notification.showSuccess(results?.message);
            // this.onCancel.emit();
            // this.backtouploadsummary()
            this.gl_no=0
            this.uploadfile.setValue("")
            this.restformfile = []
            this.fileuploadForm.reset();
            this.fileuploadsummaryObjNew = { "method": "get", "url": this.proofUrl + "prfserv/connection_file_upload_summary" }

            this.file_type = ''
            this.ifscvar=[]

            // this.fileuploadForm.get("accountno").reset()
            // this.restformfileupload = []
            // this.closeAddPopup.nativeElement.style.display = 'none';
            this.closeaddpopups.nativeElement.click()
            this.CommentintervalId = setInterval(() => {
              this.fileuploadsummaryObjNew = { "method": "get", "url": this.proofUrl + "prfserv/connection_file_upload_summary" };
            }, 1000 * 20);

            //  return false
          
        }
        else  if (results?.description) {
            // this.uploadForm.reset(); 
            this.notification.showError(results.description)
            this.file_type = ''
            this.gl_no=0
            this.stopInterval()
            // this.fileuploadsummaryObjNew = { "method": "get", "url": this.proofUrl + "/prfserv/connection_file_upload_summary" }
  
  
          }
        
            
  
        },
        (error: HttpErrorResponse) => {
          this.spinner.hide();
          this.notification.showWarning(error.status + error.message)
          this.closeaddpopups.nativeElement.click()
  
        })
      }

      else if(this.fa == "FA-MAKER"){
        this.proofingService.fa_maker_connection_map(datss,this.proof_id)
      
        .subscribe((results: any) => {
          this.spinner.hide()
  
  
          console.log("UploadFile", results)
          if (results?.status === 'Success' && results?.message === 'Data processing start') {
            this.notification.showSuccess(results?.message);
            // this.onCancel.emit();
            // this.backtouploadsummary()
            this.gl_no=0
            this.uploadfile.setValue("")
            this.restformfile = []
            this.fileuploadForm.reset();
            this.fileuploadsummaryObjNew = { "method": "get", "url": this.proofUrl + "prfserv/connection_file_upload_summary" }

            this.file_type = ''
            this.ifscvar=[]

            // this.fileuploadForm.get("accountno").reset()
            // this.restformfileupload = []
            // this.closeAddPopup.nativeElement.style.display = 'none';
            this.closeaddpopups.nativeElement.click()
            this.CommentintervalId = setInterval(() => {
              this.fileuploadsummaryObjNew = { "method": "get", "url": this.proofUrl + "prfserv/connection_file_upload_summary" };
            }, 1000 * 20);

            //  return false
          
        }
        else  if (results?.description) {
            // this.uploadForm.reset(); 
            this.notification.showError(results.description)
            this.file_type = ''
            this.gl_no=0
            this.stopInterval()
            // this.fileuploadsummaryObjNew = { "method": "get", "url": this.proofUrl + "/prfserv/connection_file_upload_summary" }
  
  
          }
        
            
  
        },
        (error: HttpErrorResponse) => {
          this.spinner.hide();
          this.notification.showWarning(error.status + error.message)
          this.closeaddpopups.nativeElement.click()
  
        })
      }

      else if (this.fa == "FA-CHECKER"){
        this.proofingService.fa_checker_connection_map(datss,this.proof_id)
      
        .subscribe((results: any) => {
          this.spinner.hide()
  
  
          console.log("UploadFile", results)
          if (results?.status === 'Success' && results?.message === 'Data processing start') {
            this.notification.showSuccess(results?.message);
            // this.onCancel.emit();
            // this.backtouploadsummary()
            this.gl_no=0
            this.uploadfile.setValue("")
            this.restformfile = []
            this.fileuploadForm.reset();
            this.fileuploadsummaryObjNew = { "method": "get", "url": this.proofUrl + "prfserv/connection_file_upload_summary" }

            this.file_type = ''
            this.ifscvar=[]

            // this.fileuploadForm.get("accountno").reset()
            // this.restformfileupload = []
            // this.closeAddPopup.nativeElement.style.display = 'none';
            this.closeaddpopups.nativeElement.click()
            this.CommentintervalId = setInterval(() => {
              this.fileuploadsummaryObjNew = { "method": "get", "url": this.proofUrl + "prfserv/connection_file_upload_summary" };
            }, 1000 * 20);

            //  return false
          
        }
        else  if (results?.description) {
            // this.uploadForm.reset(); 
            this.notification.showError(results.description)
            this.file_type = ''
            this.gl_no=0
            this.stopInterval()
            // this.fileuploadsummaryObjNew = { "method": "get", "url": this.proofUrl + "/prfserv/connection_file_upload_summary" }
  
  
          }
        
            
  
        },
        (error: HttpErrorResponse) => {
          this.spinner.hide();
          this.notification.showWarning(error.status + error.message)
          this.closeaddpopups.nativeElement.click()
  
        })
      }
      else{
        this.proofingService.connection_map(datss,this.proof_id)
      
        .subscribe((results: any) => {
          this.spinner.hide()
  
  
          console.log("UploadFile", results)
          if (results?.status === 'Success' && results?.message === 'FA Mapping Starts') {
            this.notification.showSuccess(results?.message);
            // this.onCancel.emit();
            // this.backtouploadsummary()
            this.gl_no=0
            this.uploadfile.setValue("")
            this.restformfile = []
            this.ifscvar = []
            this.fileuploadForm.reset();
            this.fileuploadsummaryObjNew = { "method": "get", "url": this.proofUrl + "prfserv/connection_file_upload_summary" }

            this.file_type = ''

            // this.fileuploadForm.get("accountno").reset()
            // this.restformfileupload = []
            // this.closeAddPopup.nativeElement.style.display = 'none';
            this.closeaddpopups.nativeElement.click()
            this.CommentintervalId = setInterval(() => {
              this.fileuploadsummaryObjNew = { "method": "get", "url": this.proofUrl + "prfserv/connection_file_upload_summary" };
            }, 1000 * 20);

            //  return false
          
        }
        else if (results?.description) {
            // this.uploadForm.reset(); 
            this.notification.showError(results.description)
            this.file_type = ''
            this.gl_no=0
            this.stopInterval()
            // this.fileuploadsummaryObjNew = { "method": "get", "url": this.proofUrl + "/prfserv/connection_file_upload_summary" }
  
  
          }
          
  
        },
        (error: HttpErrorResponse) => {
          this.spinner.hide();
          this.notification.showWarning(error.status + error.message)
          this.closeaddpopups.nativeElement.click()
  
        })
      } 
  }

  searchback(){
    this.file_view= false
    this.connectionsummary = true
  }
}
