import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { environment } from "src/environments/environment";
import { ShareService } from "../share.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ProofingService } from "../proofing.service";
import { NotificationService } from "src/app/service/notification.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { FileUploadComponent } from "../file-upload/file-upload.component";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-file-upload-summary",
  templateUrl: "./file-upload-summary.component.html",
  styleUrls: ["./file-upload-summary.component.scss"],
})
export class FileUploadSummaryComponent implements OnInit {
  @ViewChild("closeaddpopup") closeaddpopup;
  @ViewChild("closefilepopup") closefilepopup;
  @ViewChild("fileupload") fileupload: FileUploadComponent;
  @ViewChild("viewback") viewback;
  statusTypeList = [
    { status: "1", value: "Mapped" },
    { status: "2", value: "Partially Mapped" },
    { status: "3", value: "Unmapped" },
    { status: "4", value: "RoundOff" },
    { status: "5", value: "Bucket Mapped" },
    { status: "6", value: "Bucket Roundoff" },
  ];

  proofUrl = environment.apiURL;
  // uploadsearch: ({ type: string; label: string; formvalue: string; inputobj?: undefined; parentobj?: undefined; childobj?: undefined; } | { type: string; inputobj: any; formvalue: string; label?: undefined; parentobj?: undefined; childobj?: undefined; } | { type: string; parentobj: any; childobj: any; label?: undefined; formvalue?: undefined; inputobj?: undefined; })[];
  uploadsearch: any;
  uploadcreateview: boolean = false;
  uploadsummary: boolean = true;
  viewupload: number;
  createupload: number;
  particulardata: any;
  id: number = 0;
  currentpage: number = 1;
  file: any;
  trans: boolean;
  transsummaryObjNew: any;
  transsummaryData: any;
  searchvar: any = "String";
  searchtransvar: any = "String";
  searchsumvar: any = "String";
  transsearch: any;
  // valueid: []=[];
  download: any;
  CommentintervalId: any;
  reportcardview: boolean = false;
  idandvalue: any;
  routes3: any;
  fileback: boolean = false;
  downloadid: any;
  uploadvalue: boolean = true;
  filepagination: boolean = false;
  has_next = true;
  has_previous = true;
  viewbutton: any;
  summarylist: any;
  val: any;
  view: any;
  temp: any;
  selectid: any;
  successId: boolean = true;
  verifyaccountnumber: any;
  filestatusData: any;
  filestatussummary: any;
  filedata: any;
  isselected: any;
  fileaccoutnumber:any
  presentpage:any
  restform:any
  filebutton:any
  constructor(
    private shareservice: ShareService,
    private router: Router,
    private sharedservice: ShareService,
    private spinner: NgxSpinnerService,
    private proofservice: ProofingService,
    private notification: NotificationService,
    private toastr: ToastrService
  ) {
    this.uploadsearch = [
      { type: "input", label: "File Name", formvalue: "name" },
      { type: "date", label: "Uploaded Date", formvalue: "transdate" },
    ];

    this.viewbutton = [
      { icon: "visibility", function: this.s3download.bind(this)},
      {"name": "Unmap", function: this.unmapped.bind(this) }
    ];

    this.filebutton = [
      { icon: "add", function: this.createfileupload.bind(this),"tooltip": "File Upload Create"}]
    this.transsearch = [
      {
        type: "input",
        label: "GL Number",
        formvalue: "acc_number",
        required: true,
      },
      { type: "input", label: "Reference No", formvalue: "ref_no" },
      {
        type: "twodates",
        fromobj: { label: "From Date", formvalue: "from_date" },
        toobj: { label: "To Date", formvalue: "to_date" },
      },
      { type: "input", label: "Credit Amount", formvalue: "creditamt" },
      { type: "input", label: "Debit Amount", formvalue: "debitamt" },
      { type: "input", label: "Label", formvalue: "label_id" },
      { type: "dropdown", inputobj: this.statusfield, formvalue: "status" },
    ];
    this.transsummaryObjNew = {
      method: "post",
      url: this.proofUrl + "prfserv/transaction_summary",
      params: "&isexcel=false" + "&table_type=MAIN",
      body: {},
    };
    this.filestatusData = [{columnname: "Moved On", key: "created_date"},{ columnname: "Remarks", key: "remarks" }];
    this.transsummaryData = [
      { columnname: "GL Number", key: "gl_number" },
      { columnname: "Description", key: "description" },
      { columnname: "Reference No", key: "reference_no" },
      { columnname: "Credit Amount", key: "creditamount" },
      { columnname: "Debit Amount", key: "debitamount" },
      {
        columnname: "Transaction Date",
        key: "trans_date",
        type: "Date",
        datetype: "dd-MMM-yyyy",
      },
      { columnname: "Label", key: "label_id" },
      { columnname: "Proofed Date", key: "ProofedDate" },
      {
        columnname: "Status",
        key: "status",
        validate: true,
        validatefunction: this.statusreportname.bind(this),
      },
      { columnname: "BranchCode", key: "branch_code" },
      { columnname: "BranchName", key: "branch_name" },
      { columnname: "Bucket Name", key: "bucket_name" },
      {
        columnname: "Uploaded Date",
        key: "tag_date",
        type: "Date",
        datetype: "dd-MMM-yyyy",
      },
      { columnname: "Upload File", key: "uploadfile_id" },
      { columnname: "Rule ID", key: "rule_id" },
      { columnname: "ID", key: "id" },
    ];
  }
  statusreportname(report) {
    let config: any = {
      style: "",
      value: "",
      class: "",
    };

    if (report.status == 1) {
      config = {
        class: "table-badge2",
        style: "",
        value: "Mapped",
      };
    }
    else if (report.status == -1) {
      config = {
        class: "table-badge8",
        style: "",
        value: "New Data",
      };
    } else if (report.status == 2) {
      config = {
        class: "table-badge3",
        style: "",
        value: "Partially Mapped",
      };
    } else if (report.status == 3) {
      config = {
        class: "table-badge",
        style: "",
        value: "UnMapped",
      };
    } else if (report.status == 4) {
      config = {
        class: "table-badge4",
        style: "",
        value: "RoundOff",
      };
    } else if (report.status == 5) {
      config = {
        class: "table-badge5",
        style: "",
        value: "Bucket Mapped",
      };
    } else if (report.status == 6) {
      config = {
        class: "table-badge6",
        style: "",
        value: "Bucket Roundoff",
      };
    } else if (report.status == 7) {
      config = {
        class: "table-badge4",
        style: "",
        value: "FA Maker",
      };
    } else if (report.status == 8) {
      config = {
        class: "table-badge11",
        style: "",
        value: "FA Checker",
      };
    } else
      config = {
        style: { color: "black" },
        value: report.status,
      };
    return config;
  }
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
    // this.summaryfn()
    this.fileuploadsummary(1);
    this.reportcardview = this.shareservice.cardreport.value;

    this.fileback = this.shareservice.backsum.value;
    console.log;

    // this.CommentintervalId = setInterval(() => {
    //   this.fileuploadsummaryObjNew = { "method": "get", "url": this.proofUrl + "prfserv/file_upload_summary" }
    // }, 1000 * 20);
  }

  // summaryfn(){
  //   this.fileuploadsummaryObjNew = { "method": "get", "url": this.proofUrl + "prfserv/file_upload_summary" }
  // }
  searchupload(e) {
    this.fileuploadsummaryObjNew = {
      method: "get",
      url: this.proofUrl + "prfserv/file_upload_summary",
      params: "&table_type=TEMP" + e,
    };
  }

  searchtransupload(e) {
    console.log("sdasd====dsfd", e);
    this.download = e;
    // this.idandvalue = {
    //   e,
    //   "fileid":this.id
    // }
    if (this.reportcardview == true) {
      e;
    } else if (this.reportcardview == false) {
      e.fileid = this.id;
    }
    if (
      JSON.stringify(e).length === 0 ||
       e.acc_number === "" ||
      e.acc_number === null ||
      e.acc_number === undefined
    ) {
      this.notification.showWarning("Select  GL Number");
    } else if (
      JSON.stringify(e).length === 0 ||
      e.acc_number === "" ||
      e.acc_number === null ||
      e.acc_number === undefined
    ) {
      this.transsummaryObjNew = {
        method: "post",
        url: this.proofUrl + "prfserv/transaction_summary",
        params: "&isexcel=false" + "&table_type=TEMP",
        data: e,
      };
    } else if (this.reportcardview == true) {
      this.transsummaryObjNew = {
        method: "post",
        url: this.proofUrl + "prfserv/transaction_summary",
        params: "&isexcel=false" + "&table_type=MAIN",
        data: e,
      };
    } else if (this.reportcardview == false) {
      this.transsummaryObjNew = {
        method: "post",
        url: this.proofUrl + "prfserv/transaction_summary",
        params: "&isexcel=false" + "&table_type=TEMP",
        data: e,
      };
    }

    // this.fileuploadsummaryObjNew = { "method": "get", "url": this.proofUrl + "prfserv/file_upload_summary", "params": e }
  }

  fileuploadsummaryObjNew: any = {
    method: "get",
    url: this.proofUrl + "prfserv/file_upload_summary",
    params: "&table_type=TEMP",
  };
  fileuploadsummaryData: any = [
    { columnname: "File Name", key: "filename" },
    { columnname: "GL Number", key: "acc_num" },
    {
      columnname: "Uploaded Date",
      key: "createddate",
      type: "Date",
      datetype: "dd-MMM-yyyy",
    },
    {
      columnname: "From Date",
      key: "from_date",
      type: "Date",
      datetype: "dd-MMM-yyyy",
    },
    {
      columnname: "To Date",
      key: "to_date",
      type: "Date",
      datetype: "dd-MMM-yyyy",
    },
    { columnname: "Data Count", key: "file_count" },
    {
      columnname: "Status",
      key: "status",
      validate: true,
      validatefunction: this.statusname.bind(this),
    },
    {
      columnname: "View",
      icon: "visibility",
      style: { cursor: "pointer" },
      button: true,
      function: true,
      clickfunction: this.uploadview.bind(this),
    },
    {
      columnname: "Download",
      icon: "download",
      style: { cursor: "pointer" },
      button: true,
      function: true,
      clickfunction: this.genfiledownload.bind(this),
    },
  ];

  uploadview(num) {
    console.log("ssadsadwqdsawqsaddwq", num);
    this.id = num.id;
    num.fileid = this.id;
    let data = { fileid: num.fileid };
    console.log("asadsaas++++", this.file);
    this.trans = true;
    this.stopInterval();
    this.uploadsummary = false;
    this.uploadcreateview = false;
    this.transsummaryObjNew = {
      method: "post",
      url: this.proofUrl + "prfserv/transaction_summary",
      params: "&isexcel=false" + "&table_type=TEMP",
      data: data,
    };
    this.transsummaryData = [
      { columnname: "GL Number", key: "gl_number" },
      { columnname: "Credit Amount", key: "creditamount" },
      { columnname: "Debit Amount", key: "debitamount" },
      { columnname: "Branch Code", key: "BranchCode" },
      { columnname: "Branch Name", key: "BranchName" },
      { columnname: "Reference No", key: "reference_no" },
      {
        columnname: "Date",
        key: "tag_date",
        type: "",
        datetype: "dd-MMM-yyyy",
      },
      {
        columnname: "Status",
        key: "status",
        validate: true,
        validatefunction: this.statuskey.bind(this),
      },
      { columnname: "Label", key: "label_id" },
      { columnname: "Description", key: "description" },
    ];
  }

  createfileupload() {
    this.id = 0;
    // this.uploadcreateview = true
    // this.uploadsummary = false
    // this.trans = false
    // this.trans = false
    this.popupopen();
    this.stopInterval();
  }
  backtosummary() {
    this.uploadcreateview = false;
    this.trans = false;
    this.uploadsummary = true;
    this.sharedservice.uploadsum.next(this.uploadsummary);
    this.closedpopup();
  }
  backtonormalsum() {
    if (this.id) {
      this.trans = false;
      this.uploadcreateview = false;
      this.uploadsummary = true;
      this.fileuploadsummary('',1)
      // this.CommentintervalId = setInterval(() => {
      //   this.fileuploadsummaryObjNew = { "method": "get", "url": this.proofUrl + "prfserv/file_upload_summary" }
      // }, 1000 * 20);
    } else {
      this.router.navigate(["/proofing/proofingtransaction"]);
    }
  }
  statusname(data) {
    let config: any = {
      style: "",
      value: "",
      class: "",
    };

    if (data.status.id == 2) {
      config = {
        class: "table-badge4",
        style: "",
        value: data.status.status,
      };
    } else if (data.status.id == 3) {
      config = {
        class: "table-badge3",
        style: "",
        value: data.status.status,
      };
    } else if (data.status.id == 4) {
      config = {
        class: "table-badge2",
        style: "",
        value: data.status.status,
      };
    } else if (data.status.id == 5) {
      config = {
        class: "table-badge",
        style: "",
        value: data.status.status,
      };
    } else if (data.status.id == 6) {
      config = {
        class: "table-badge",
        style: "",
        value: data.status.status,
      };
    } else if (data.status.id == 7) {
      config = {
        class: "table-badge6",
        style: "",
        value: data.status.status,
      };
    } else if (data.status.id == 8) {
      config = {
        class: "table-badge2",
        style: "",
        value: data.status.status,
      };
    } else if (data.status.id == 9) {
      config = {
        class: "table-badge11",
        style: "",
        value: data.status.status,
      };
    } else if (data.status.id == 10) {
      config = {
        class: "table-badge",
        style: "",
        value: data.status.status,
      };
    } else if (data.status.id == 11) {
      config = {
        class: "table-badge2",
        style: "",
        value: data.status.status,
      };
    } else if (data.status.id == 12) {
      config = {
        class: "table-badge2",
        style: "",
        value: data.status.status,
      };
    } else if (data.status.id == 1) {
      config = {
        class: "table-badge8",
        style: "",
        value: data.status.status,
      };
    } else if (data.status.id == 13) {
      config = {
        class: "table-badge8",
        style: "",
        value: data.status.status,
      };
    } else if (data.status.id == 14) {
      config = {
        class: "table-badge3",
        style: "",
        value: data.status.status,
      };
    } else if (data.status.id == 15) {
      config = {
        classs: "table-badge10",
        style: "",
        value: data.status.status,
      };
    } else if (data.status.id == 16) {
      config = {
        class: "table-badge9",
        style: "",
        value: data.status.status,
      };
    } else if (data.status.id == 17) {
      config = {
        class: "table-badge6",
        style: "",
        value: data.status.status,
      };
    } else if (data.status.id == 18) {
      config = {
        class: "table-badge",
        style: "",
        value: data.status.status,
      };
    } else if (data.status.id == 19) {
      config = {
        class: "table-badge7",
        style: "",
        value: data.status.status,
      };
    } else if (data.status.id == 20) {
      config = {
        class: "table-badge8",
        style: "",
        value: data.status.status,
      };
    } else {
      config = {
        value: data.status.id,
      };
    }
    return config;
  }

  statuskey(stats) {
    let config: any = {
      style: "",
      value: "",
    };

    if (stats.status == 1) {
      config = {
        class: "table-badge2",
        style: "",
        value: "Mapped",
      };
    } else if (stats.status == 2) {
      config = {
        class: "table-badge3",
        style: "",
        value: "Partially Mapped",
      };
    } else if (stats.status == 3) {
      config = {
        class: "table-badge",
        style: "",
        value: "Unmapped",
      };
    } else if (stats.status == 4) {
      config = {
        class: "table-badge4",
        style: "",
        value: "RoundOff",
      };
    } else if (stats.status == 5) {
      config = {
        class: "table-badge5",
        style: "",
        value: "Bucket Mapped",
      };
    } else if (stats.status == 6) {
      config = {
        class: "table-badge6",
        style: "",
        value: "Bucket Roundoff",
      };
    }
    return config;
  }

  summarydownload(data) {
    if (
      JSON.stringify(data).length === 0 ||
    data.acc_number === ""||
      data.acc_number === null ||
      data.acc_number === undefined
    ) {
      this.notification.showWarning("Select  GL Number");
      return false;
    } else {
      this.spinner.show();
      // Convert this.id to a string if it is a number
      const fileId = this.id ? this.id.toString() : null;
      this.proofservice.Proofing_Transaction_report(fileId, data).subscribe(
        (fullXLS) => {
          console.log(fullXLS);
          this.notification.showSuccess(fullXLS.message);
          // let binaryData = [];
          // binaryData.push(fullXLS);
          // let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          // let link = document.createElement('a');
          // link.href = downloadUrl;
          // link.download = 'Proofing_Transaction_report' + ".xlsx";
          // link.click();
          this.spinner.hide();
        },
        (error: HttpErrorResponse) => {
          this.spinner.hide();
          this.notification.showWarning(error.status + " " + error.statusText);
        }
      );
    }
  }

  // inputaccount:any = {
  //   label: "GL Number",
  //   method: "get",
  //   url: this.proofUrl + "prfserv/transaction_summary",
  //   params: "",
  //   searchkey: "name",
  //   displaykey:"account_number",
  //   wholedate: true,
  //   required: true,
  //   "data": ""
  // }
  closepopup() {
    this.closeaddpopup.nativeElement.click();
    this.cancel();
  }

  closedpopup() {
    this.closeaddpopup.nativeElement.click();
    if (this.CommentintervalId) {
      clearInterval(this.CommentintervalId);
    }
    this.CommentintervalId = setInterval(() => {
      // this.fileuploadsummaryObjNew = {
      //   method: "get",
      //   url: this.proofUrl + "prfserv/file_upload_summary",
      //   params: "&table_type=TEMP",
      // };
      this.fileuploadsummary('',1)
      console.log("API called at: ", new Date());
    }, 1000 * 20);
    this.cancel();
  }

  popupopen() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("exampleModal"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }

  closepopupdata() {
    this.closefilepopup.nativeElement.click();
  }
  popupopens() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("exampleModaldata"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  statusfield: any = {
    label: "status",
    fronentdata: true,
    data: this.statusTypeList,
    displaykey: "value",
    Outputkey: "status",
    valuekey: "status",
  };
  cancel() {
    this.shareservice.accountobject.next(null);
    if (this.fileupload) {
      this.fileupload.resetFormFromParent();
    }
  }

  s3download(num) {
    this.uploadsummary = false;
    // if(num == 1){
    //   this.sharedservice.backtogltab.next(num)
    // }
    this.downloadid = this.id;
    this.sharedservice.downloadid.next(this.downloadid);
    this.router.navigate(["/proofing/s3download"]);
    this.uploadvalue = this.sharedservice.uploadsum.value;

    this.sharedservice.uploadsum.next(this.uploadsummary);
  }

  unmapped(unmap){
    if(unmap.label_id === "" || unmap.label_id === null || unmap.label_id === undefined){
      this.notification.showInfo("Select Label");
    }
  else{
    this.spinner.show()
    let unmaped = unmap.label_id
    this.proofservice.unmapped_sum(unmaped).subscribe(
      (response) => {
        if (response.status === "Success") {
          this.notification.showSuccess(response.message);
          this.transsummaryObjNew = {
            method: "post",
            url: this.proofUrl + "prfserv/transaction_summary",
            params: "&isexcel=false" + "&table_type=MAIN",
            body: {},
          };
          
        } else {
          this.notification.showError(response.description);
          this.spinner.hide();
        }
      },
      (error) => {
        this.spinner.hide();
        this.toastr.warning(error.status);
      }
    );
  }
  }
  summaryreset(data) {
    if (this.reportcardview == true) {
      this.transsummaryObjNew = {
        method: "post",
        url: this.proofUrl + "prfserv/transaction_summary",
        params: "&isexcel=false" + "&table_type=MAIN",
        data: data,
      };
    } else if (this.reportcardview == false) {
      this.transsummaryObjNew = {
        method: "post",
        url: this.proofUrl + "prfserv/transaction_summary",
        params: "&isexcel=false" + "&table_type=TEMP",
        data: data,
      };
    }
  }

  fileuploadsummary(data, pageSize = 1) {
    this.spinner.show();
    this.proofservice.file_upload_summary(data, pageSize).subscribe(
      (results: any) => {
        this.checkedFiles = {};
        this.checkOptions = [];
        this.valueid = [];
        this.spinner.hide();
        console.log("UploadFile", results);

        if (results?.description) {
          // this.uploadForm.reset();
          this.notification.showError(results.description);
        }
        let file = results["data"];
        let datapagination = results["pagination"];
        this.summarylist = file;

        this.summarylist.forEach((file) => {
          file.checked = this.checkedFiles[file.id] || false;
        });
        console.log("Results from API", results["data"]);
        if (this.summarylist.length >= 0) {
          this.filepagination = true;
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
      },
      (error: HttpErrorResponse) => {
        this.spinner.hide();
        this.notification.showWarning(error.status + error.message);
      }
    );
  }

  genfiledownload(id) {
    this.spinner.show();
    this.proofservice.Proofing_gen_file(id).subscribe(
      (fullXLS) => {
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "Proofing_Gen_File" + ".xlsx";
        link.click();
        this.spinner.hide();
      },
      (error: HttpErrorResponse) => {
        this.spinner.hide();
        this.notification.showWarning(error.status + error.statusText);
      }
    );
  }
  nextClickTemplate() {
    if (this.has_next === true) {
      this.presentpage = this.currentpage + 1
      this.fileuploadsummary("", this.currentpage + 1);
    }
  }

  previousClickTemplate() {
    if (this.has_previous === true) {
      this.fileuploadsummary("", this.currentpage - 1);
    }
  }

  getStatusClass(id: number): string {
    switch (id) {
      case 2:
        return "table-badge4";
      case 3:
        return "table-badge3";
      case 4:
        return "table-badge2";
      case 5:
        return "table-badge";
      case 6:
        return "table-badge";
      case 10:
        return "table-badge";
      case 18:
        return "table-badge";
      case 7:
        return "table-badge6";
      case 17:
        return "table-badge6";
      case 8:
        return "table-badge2";
      case 11:
        return "table-badge2";
      case 12:
        return "table-badge2";
      case 9:
        return "table-badge11";
      case 1:
        return "table-badge8";
      case 13:
        return "table-badge8";
      case 20:
        return "table-badge8";
      case 14:
        return "table-badge3";
      case 15:
        return "table-badge10";
      case 16:
        return "table-badge9";
      case 19:
        return "table-badge7";
      case 20:
        return "table-badge3";
      case 21:
        return "table-badge5";
      case 22:
        return "table-badge6";
      case 23:
        return "table-badge8";
      case 24:
        return "table-badge9";
      case 25:
        return "table-badge2";
      case 26:
        return "table-badge10";
      case 27:
        return "table-badge8";
      case 28:
        return "table-badge4";
      case 29:
        return "table-badge5";
      case 30:
        return "table-badge";
      case 31:
        return "table-badge4";
      default:
        return "";
    }
  }
  selecteditem(values) {
    let selectedvalue = values;
    console.log("dsadsadsa", selectedvalue);
  }

  filestatus: any;
  private checkOptions: { isChecked: boolean; status: string }[] = [];
  private valueid: { id: any; account_no: any }[] = [];
  checkedFiles: { [key: string]: boolean } = {};


  onCheckboxChange(event: any, value: any, index: number): void {
    const isChecked = event.target.checked;
    const fileId = value.id;
    // this.verifyaccountnumber = value.acc_num;
    this.isselected = [];


    console.log("asdasas", this.isselected);
    if (isChecked) {
      this.checkedFiles[fileId] = true;
      this.valueid[index] = {
        id: value.id,
        account_no: value.acc_num,
      };
    } else {
      this.checkedFiles[fileId] = false;
      // this.valueid[index] = {
      //   id: value.id,
      //   account_no: value.acc_num,
      // };
      this.valueid = this.valueid.filter(item => item.id !== fileId);

    }
    this.checkOptions[index] = {
      isChecked: isChecked,
      status: value.status.status,
    };
    this.valueid.forEach((account: any) => {
      // this.selectid.push(idss.id);
      this.isselected.push(account.account_no);
    });
    
    // this.selecteditem(event.target.checked);

    // if (!isChecked) {
    //   this.selecteditem(false);
    // } else {
    //   this.selecteditem(true);
    // }
  }

  movefile(TEMP) {
    const checkedOptions = this.checkOptions.filter(
      (option) => option.isChecked
    );
    if (checkedOptions.length === 0) {
      this.notification.showError("Please select an option to Move.");
      return false;
    }
    const invalidOption = checkedOptions.some(
      (option) => option.status !== "Verification_Success"
    );

    if (invalidOption) {
      this.notification.showError(
        "You can move VERIFICATION SUCCESS entries only"
      );
      this.successId = false;
      return false;
    }
    const validOptions = checkedOptions.filter(
      (option) => option.status === "Verification_Success"
    );

    if (validOptions.length > 0) {
      this.selectid = [];
      this.valueid.forEach((idss) => {
        this.selectid.push(idss.id);
      });
      this.successId = true;
    }

    if (this.successId) {
      this.spinner.show();
      const data = this.selectid;
      this.proofservice.movefilesummary(data).subscribe(
        (response) => {
          if (response.status === "Success") {
            this.notification.showSuccess(response.message);
            this.checkedFiles = {};
            this.checkOptions = [];
            this.valueid = [];
            this.fileuploadsummary('',this.presentpage);
            this.spinner.hide();
            this.popupopens();
            this.fileaccoutnumber= this.isselected
            this.filedata = {
              account_no: this.isselected,
              type: 3,
            };
            this.filestatussummary = {
              method: "post",
              url: this.proofUrl + "prfserv/schedular_status",
              data: this.filedata,
            };
          } else {
            this.notification.showError(response.description);
            this.spinner.hide();
          }
        },
        (error) => {
          this.spinner.hide();
          this.toastr.warning(error.status);
        }
      );
    }
  }

  // verifyfile() {
  //   const invalidOption = this.checkOptions.some(option => option.isChecked && option.status !== "Upload_Success");

  //   if (invalidOption) {
  //     this.checkOptions = [];
  //     this.notification.showError("You can move UPLOAD SUCCESS entries only");
  //     this.successId = false;
  //     return false;
  //   }

  //   const validOptions = this.checkOptions.filter(option => option.isChecked && option.status === "Upload_Success");

  //   if (validOptions.length > 0) {
  //     this.valueid.forEach((idss) => {
  //       this.selectid = idss.id;
  //     });
  //     this.successId = true;
  //   }

  //   if (this.successId) {
  //     this.spinner.show();
  //     this.proofservice.verifyfilesummary(this.selectid).subscribe(
  //       (response) => {
  //         this.spinner.hide();
  //         if (response.status === "success") {
  //           this.notification.showSuccess(response.message);
  //           this.fileuploadsummary(1);
  //           this.checkOptions = [];
  //         } else {
  //           this.notification.showError(response.description);
  //           this.checkOptions = [];
  //         }
  //       },
  //       (error) => {
  //         this.spinner.hide();
  //         this.toastr.warning(error.status);
  //       }
  //     );
  //   }
  // }

  verifyfile() {
    const checkedOptions = this.checkOptions.filter(
      (option) => option.isChecked
    );
    if (checkedOptions.length === 0) {
      this.notification.showError("Please select an option to Upload.");
      return false;
    }
    const invalidOption = checkedOptions.some(
      (option) => option.status !== "Upload_Success"
    );

    if (invalidOption) {
      this.notification.showError("You can move UPLOAD SUCCESS entries only");
      this.successId = false;
      return false;
    }

    const validOptions = checkedOptions.filter(
      (option) => option.status === "Upload_Success"
    );

    if (validOptions.length > 0) {
      this.selectid = [];
      this.valueid.forEach((idss) => {
        this.selectid.push(idss.id);
      });
      this.successId = true;
    }

    if (this.successId) {
      this.spinner.show();

      const data = this.selectid;
      this.proofservice.verifyfilesummary(data).subscribe(
        (response) => {
          if (response.status === "SUCCESS") {
            this.notification.showSuccess(response.message);
            this.checkedFiles = {};
            this.checkOptions = [];
            this.valueid = [];
            this.fileuploadsummary('',this.presentpage);
            this.spinner.hide();
          } else if (response.status === "FAILED"){
            this.notification.showError(response.message + response.status);
            this.fileuploadsummary('',this.presentpage);
            this.spinner.hide();
          }
        },
        (error) => {
          this.spinner.hide();
          this.toastr.warning(error.status);
        }
      );
    }
  }
  isUploadAndVerificationSuccessful(temp: any): boolean {
    return (
      temp.status?.status === "Upload_Success" &&
      temp.status?.status === "Verification_Success"
    );
  }
  refresh() {
    this.filedata = {
      account_no: this.isselected,
      type: 3,
    };
    this.filestatussummary = {
      method: "post",
      url: this.proofUrl + "prfserv/schedular_status",
      data: this.filedata,
    };
  }

  status_button(){
    this.popupopens()
    this.filedata = {
     account_no: this.isselected,
     type: 3,
   };
   this.filestatussummary = {
     method: "post",
     url: this.proofUrl + "prfserv/schedular_status",
     data: this.filedata,
   };
   }
}
