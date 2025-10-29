import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {TaService} from "../ta.service";
import {ShareService} from "../share.service";
import { Router } from '@angular/router';
import { SharedService } from 'src/app/service/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-report-tour-detail',
  templateUrl: './report-tour-detail.component.html',
  styleUrls: ['./report-tour-detail.component.scss']
})
export class ReportTourDetailComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();
  reporttourdetailForm:FormGroup
  tourdetailreportmodal:any
  gettourdetailreportList:any
  id:any
  ids:any
  emptourid:any
  empname:any
  reportindex:any
  datas:any
  tourreportid:any
  emptourreportid:any
  data:any;
  tourreqno:any;
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
  attachmentlist = []
  base64textString = [];
  pdfattachmentlist = [];
  file_ext: string[];
  selectedFiles:File[]=[];
  tourmaker_list=[]
  tourapprover_list=[]
  totoallist_count:any;
  file_downloaded: boolean = false;
  showreasonattach: boolean = false;
  viewpdfimageeee: any
  constructor(public taservice:TaService,public sharedService: SharedService,private shareservice:ShareService,public spinner:NgxSpinnerService, private notification: NotificationService,
    private router:Router) { }

  ngOnInit(): void {
    this.id=this.shareservice.tourData.value
    this.emptourid=this.shareservice.empData.value
    this.datas=this.shareservice.report.value
    this.reportindex=this.datas.index
    let tourreport=this.shareservice.expensetourid.value
    this.tourreportid=tourreport['tourid']
    this.tourreqno=tourreport['requestno']
    this.emptourreportid=this.shareservice.emptourreasonid.value
    
    this.tourdetailreportmodal={
      requestno:"" 
    }
    this.gettourdetail()
  }
  tourrequestno:any
 
  gettourdetail(){
    // if(this.reportindex === 1){
    //   this.tourrequestno = this.tourreportid
    // }
    // if(this.reportindex === 3){
    //   this.tourrequestno = this.emptourreportid
    // }
    this.spinner.show()
    this.tourrequestno = this.tourreportid
    this.taservice.gettourdetailreport(this.tourrequestno)
    .subscribe(res =>{
      this.gettourdetailreportList=res
      this.spinner.hide()

     
    })
    this.getimages();
   
  }
  
  download(){
    if(this.reportindex === 1){
   
        this.taservice.gettourdetaildownload( this.tourreportid)
        .subscribe((results) => {
          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'Tour Detail Report'+".xlsx";
          link.click();
          })
      }
      if(this.reportindex === 3){
        this.taservice.gettourdetaildownload( this.emptourreportid)
        .subscribe((results) => {
          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'Tour Detail Report'+".xlsx";
          link.click();
          })
          }
  }
  onCancelClick(){
    this.router.navigateByUrl("ta/ta_summary")
  }
  touradvance(){ 
    this.router.navigateByUrl("ta/reporttouradvance")
  }
  tourexpense(){
    this.router.navigateByUrl("ta/reporttourexpense")
  }
  fileDeleted(id, i) {

    this.fileid = id
    this.taservice.fileDelete(this.fileid)
      .subscribe(res => {
        console.log("incires", res)
        if (res.status === "Successfully Deleted") {
          this.spinner.hide()
          this.notification.showSuccess("Deleted Successfully....")
          this.attachmentlist.splice(i, 1)
          this.count = this.attachmentlist.length
          this.onSubmit.emit();
          return true;
        } else {
          this.spinner.hide()
          this.notification.showError(res.description)
          return false;
        }
      })

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
  getimagedownload(url) {
    this.taservice.getfetchpdfimage(url)
    // .subscribe(result=>{
    // this.pdfimages=result
    // }
    // )

  }
  deleteUpload(i) {
    this.base64textString.splice(i, 1);
    this.pdfattachmentlist.splice(i, 1);
    this.list.items.remove(i)
    this.totalcount = this.list.items.length;
    (<HTMLInputElement>document.getElementById("uploadFile")).files = this.list.files;
    if (this.totalcount === 0) {
      (<HTMLInputElement>document.getElementById("uploadFile")).files = null
      this.showreasonattach = true;
    }
  }
  deleteAll() {
    this.totalcount = this.list.items.length;
    this.list.items.clear()
    for (let i = 0; i < this.totalcount; i++) {
      this.base64textString.splice(i, this.totalcount);
      this.pdfattachmentlist.splice(i, this.totalcount);
      // this.list.items.remove(i)


    }
    this.totalcount = 0;
    (<HTMLInputElement>document.getElementById("uploadFile")).files = this.list.files;
  }
  filetype_check(i: string | number) {
    let stringValue = this.images[i].name.split('.')
    this.fileextension = stringValue.pop();
    if (this.file_ext.includes(this.fileextension)) {
      var msg = 1;
    }
    else {
      var msg = 0;
    }
    return msg


  }
  clicktopdf(pdfSrc){
    let link = document.createElement('a');
    console.log(link)
    link.href = pdfSrc;
    link.target='_blank';
    link.click()
  }
  getselectedFiles(){
    if (this.selectedFiles.length > 0) {
      const formData = new FormData();
      this.selectedFiles.forEach((file) => {
        formData.append('files', file, file.name);
      });
    } 
  
  
}
fileData: File = null;
previewUrl:any = null;
fileUploadProgress: string = null;
  uploadedFilePath: string = null;
fileProgress(fileInput: any) {
  this.fileData = <File>fileInput.target.files[0];
  this.preview();
}

preview() {
// Show preview 
var mimeType = this.fileData.type;
if (mimeType.match(/image\/*/) == null) {
  return;
}

var reader = new FileReader();      
reader.readAsDataURL(this.fileData); 
reader.onload = (_event) => { 
  this.previewUrl = reader.result; 
}
}
getimages() {

    this.taservice.getfetchpdfimage(this.tourreportid)
    .subscribe((results) => {
      // this.resultimage = results[0].url
      const file_ext = ['pdf', 'jpg', 'png', 'PDF', 'JPG', 'JPEG', 'jpeg', 'image']
      this.attachmentlist = results.tour_maker;
      // this.tourmaker_list=results.tour_maker;
      this.pdfAttachmentList=results.tour_approver;
      this.totoallist_count =results.tour_file_count;


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
  pdfAttachmentList=[]

}

