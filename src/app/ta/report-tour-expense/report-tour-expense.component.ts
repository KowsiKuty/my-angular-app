import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {TaService} from '../ta.service';
import {ShareService} from '../share.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-report-tour-expense',
  templateUrl: './report-tour-expense.component.html',
  styleUrls: ['./report-tour-expense.component.scss']
})
export class ReportTourExpenseComponent implements OnInit {
  gettourexpensereportList:any
  reporttourexpenseForm:FormGroup
  id:any
  emptourid:any
  datas:any
  reportindex:any
  tourreportid:any
  emptourreportid:any
  expensetourid:any
  data:any;
  tourreqno:any;
  selectedFiles:File[]=[];
  attachmentlist=[];
  pdfAttachmentList=[];
  AdvanceApproverAttachmentList=[]
  fileid: any;
  count = 0;
  tokenValues: any;
  filesystem_error: boolean;
  fileextension: any;
  jpgUrls: any;
  imageUrl = environment.apiURL;
  list: DataTransfer;
  totalcount = 0;
  images: any
  base64textString = [];
  pdfattachmentlist = [];
  file_ext: string[];
  tourmaker_list=[]
  tourapprover_list=[]
  totoallist_count:any;
  file_downloaded: boolean = false;
  showreasonattach: boolean = false;
  viewpdfimageeee: any
  AdvanceAttachmentList=[]
  constructor(public taservice:TaService,private shareservice:ShareService,public spinner:NgxSpinnerService,
    private router:Router,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.id=this.shareservice.tourData.value
    this.emptourid=this.shareservice.empData.value
    this.datas=this.shareservice.report.value
    this.reportindex=this.datas.index
    this.tourreportid=this.shareservice.tourreasonid.value
    this.emptourreportid=this.shareservice.emptourreasonid.value
    let expensetour=this.shareservice.expensetourid.value
    this.expensetourid=expensetour['tourid']
    this.tourreqno=expensetour['requestno']
    this.gettourexpense();
    this.getimages();
 
  }
  tourrequestno:any
  gettourexpense(){
  // if(this.reportindex=== 1){
  //   this.tourrequestno=this.expensetourid
  // }
  // if(this.reportindex=== 3){
  //   this.tourrequestno=this.emptourreportid
  // }
  this.spinner.show()
  this.tourrequestno=this.expensetourid + '?report=1'
  this.taservice.gettourexpensereport(this.tourrequestno)
  .subscribe(result =>{
    this.gettourexpensereportList=result['data']
    this.spinner.hide()
    
  })
}

download(){
    if(this.reportindex=== 1){
  
        this.taservice.gettourexpensedownload( this.expensetourid)
        .subscribe((results) => {
          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'Tour Expense Report'+".xlsx";
          link.click();
          })
      }
      if(this.reportindex=== 3){
        this.taservice.gettourexpensedownload( this.emptourreportid)
        .subscribe((results) => {
          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'Tour Expense Report'+".xlsx";
          link.click();
          })
          }
  }
  onCancelClick(){
    this.router.navigateByUrl("ta/ta_summary")
  }
  getselectedFiles(){
    if (this.selectedFiles.length > 0) {
      const formData = new FormData();
      this.selectedFiles.forEach((file) => {
        formData.append('files', file, file.name);
      });
    } 
  
  
}
clicktopdf(pdfSrc){
  let link = document.createElement('a');
  console.log(link)
  link.href = pdfSrc;
  link.target='_blank';
  link.click()
}

commentPopup(pdf_id, file_name) {
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  this.tokenValues = token
  this.filesystem_error = false;
  let id = pdf_id;
  this.fileid = pdf_id;
  const headers = { 'Authorization': 'Token ' + token }
  let stringValue = file_name.split('.')
  this.fileextension = stringValue.pop();
  if (this.fileextension === "pdf") {
    this.jpgUrls = this.imageUrl + "taserv/download_documents/" + id + "?type=pdf&token=" + token
    // window.open(this.imageUrl + "taserv/download_documents/" + id + "?type="+this.fileextension+"&token=" + token,"_blank")
    // this.file_window = window.open(this.pdfUrls,"_blank")
  }
  else if (this.fileextension === "png" || this.fileextension === "jpeg" || this.fileextension === "jpg" || this.fileextension === "JPG" || this.fileextension === "JPEG") {
    // if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {

    this.jpgUrls = this.imageUrl + "taserv/download_documents/" + id + "?type=" + this.fileextension + "&token=" + token
  }
  else {
    this.filesystem_error = true;
  }
}


getimages() {

  this.taservice.getfetchpdfimage(this.expensetourid)
  .subscribe((results) => {
    // this.resultimage = results[0].url
    const file_ext = ['pdf', 'jpg', 'png', 'PDF', 'JPG', 'JPEG', 'jpeg', 'image']
    this.attachmentlist = results.tour_expense_maker;
    // this.tourmaker_list=results.tour_maker;
    this.pdfAttachmentList = results.tour_expense_approver;
    // this.tourapprover_list=results.tour_expense_maker;
    this.totoallist_count =results.expense_file_count;


    console.log("barcode", results)
    for (var i = 0; i < results.length; i++) {

      var downloadUrl = results[i].url;
      let stringValue = results[i].file_name.split('.')
      this.fileextension = stringValue.pop();
      if (file_ext.includes(this.fileextension)) {
        continue
      }
      else if (this.file_downloaded == false) {
        this.viewpdfimageeee = window.open(downloadUrl, '_blank');
        console.log('barcode', downloadUrl)
        this.fileid = results[i].id
        console.log("this.fileid", this.fileid)
        this.getcall()
      }
    }
    this.file_downloaded = true;
  })

}
getcall() {
  this.taservice.getfetchimages1(this.fileid)
    .subscribe((results) => {
      console.log("results", results)
    })
}
tourgid: any;
expenseid: any;
approveexpenceEdit(reports){

    this.expenseid=reports.expenseid
    this.tourgid=reports
    this.tourgid.applevel=1
    this.tourgid.empdesignation=reports.designation
    this.tourgid.empgrade=reports.emp_grade
    this.tourgid.report = 'true'
    if(this.expenseid==5){
     var datas = JSON.stringify(Object.assign({}, this.tourgid));
     localStorage.setItem('expense_details',datas)
     localStorage.setItem('expense_edit',datas)
     this.router.navigateByUrl('ta/lodge');
    }
    else  if(this.expenseid==2){
     var datas = JSON.stringify(Object.assign({}, this.tourgid));
     localStorage.setItem('expense_details',datas)
     localStorage.setItem('expense_edit',datas)
     this.router.navigateByUrl('ta/daily');
    }
    else  if(this.expenseid==1){
     var datas = JSON.stringify(Object.assign({}, this.tourgid));
     localStorage.setItem('expense_details',datas)
     localStorage.setItem('expense_edit',datas)
     this.router.navigateByUrl('ta/travel');
    }
    else  if(this.expenseid==3){
     var datas = JSON.stringify(Object.assign({}, this.tourgid));
     localStorage.setItem('expense_details',datas)
     localStorage.setItem('expense_edit',datas)
     this.router.navigateByUrl('ta/inci');
    }
    else  if(this.expenseid==4){
     var datas = JSON.stringify(Object.assign({}, this.tourgid));
     localStorage.setItem('expense_details',datas)
     localStorage.setItem('expense_edit',datas)
     this.router.navigateByUrl('ta/local');
    }
    else  if(this.expenseid==6){
     var datas = JSON.stringify(Object.assign({}, this.tourgid));
     localStorage.setItem('expense_details',datas)
     localStorage.setItem('expense_edit',datas)
     this.router.navigateByUrl('ta/misc');
    }
    else  if(this.expenseid==7){
     var datas = JSON.stringify(Object.assign({}, this.tourgid));
     localStorage.setItem('expense_details',datas)
     localStorage.setItem('expense_edit',datas)
     this.router.navigateByUrl('ta/pack');
    }
    else  if(this.expenseid==8){
     var datas = JSON.stringify(Object.assign({}, this.tourgid));
     localStorage.setItem('expense_details',datas)
     localStorage.setItem('expense_edit',datas)
     this.router.navigateByUrl('ta/deput');
    }
    else  if(this.expenseid==9){
      var datas = JSON.stringify(Object.assign({}, this.tourgid));
      localStorage.setItem('expense_details',datas)
      localStorage.setItem('expense_edit',datas)
      this.router.navigateByUrl('ta/iba-expense');
     }
     else{
      this.toastr.warning('Claim Not Created')
      return false
     }
     }
}


