import { Component, OnInit,Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import {ShareService} from "../share.service";
import { TaService } from '../ta.service';
import { Router } from '@angular/router';
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

@Injectable()
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
  selector: 'app-report-tour-advance',
  templateUrl: './report-tour-advance.component.html',
  styleUrls: ['./report-tour-advance.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class ReportTourAdvanceComponent implements OnInit {
  taForm:FormGroup
  touradvancemodel:any
  reasonlist:any
  touradvance:any
  employeelist:any
  id:any
  emptourid:any
  datas:any
  reportindex:any
  tourreportid:any
  emptourreportid:any
  expensetourid:any
  tourreqno:any
  selectedFiles:File[]=[];
  AdvanceMakerAttachmentList=[]
  AdvanceApproverAttachmentList=[]
  constructor(private shareservice:ShareService,private taservice:TaService,
  private router:Router,private datepipe:DatePipe) { }
  ngOnInit(): void {
  
    this.id=this.shareservice.tourData.value
    this.emptourid=this.shareservice.empData.value
    this.datas=this.shareservice.report.value
    this.reportindex=this.datas.index
    console.log("indexes",this.datas)
    this.tourreportid=this.shareservice.tourreasonid.value
    this.emptourreportid=this.shareservice.emptourreasonid.value
    let expensetour=this.shareservice.expensetourid.value
    this.expensetourid=expensetour['tourid']
    this.tourreqno=expensetour['requestno']
    
    this.touradvancemodel={
      requestno:'',
      requestdate:'',
      reason:'',
      startdate:'',
      enddate:'',
      bank:'',
      approval:''
    }
    this.gettouradvance()
  }
  tourrequestno:any
  gettouradvance(){
    if(this.reportindex === 1){
      this.tourrequestno=this.tourreportid
    }
    if(this.reportindex === 3){
      this.tourrequestno =this.emptourreportid
    }

    this.taservice.gettouradvancereport(this.expensetourid)
    .subscribe(res =>{
      console.log("advanceres",res)
      // this.tourmodel.detail.forEach(currentValue => {
      //   currentValue.startdate = this.datePipe.transform(currentValue.startdate, 'yyyy-MM-dd');
      //   currentValue.enddate = this.datePipe.transform(currentValue.enddate, 'yyyy-MM-dd');
      // });
      this.touradvance=res['detail']
      this.touradvancemodel={
        requestno:res.requestno,
        requestdate:this.datepipe.transform(res.requestdate, 'yyyy-MM-dd'),
        reason:res.reason,
        // startdate:res.startdate,
        startdate:this.datepipe.transform(res.startdate, 'yyyy-MM-dd'),
        enddate:this.datepipe.transform(res.enddate, 'yyyy-MM-dd'),
        approver_branch_data:res.approver_branch_data?.branch_name,
        employee_name:res.approver_branch_data?.employe_name,
        branch_name:res.branch_name
      }
      
    })
  
    this.getimages()  
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
tokenValues: any;
filesystem_error: boolean;
fileid: any;
fileextension: any;
jpgUrls: any;
imageUrl = environment.apiURL;
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
clicktopdf(pdfSrc){
  let link = document.createElement('a');
  console.log(link)
  link.href = pdfSrc;
  link.target='_blank';
  link.click()
}
file_downloaded: boolean = false;
tourapprover_list=[]
  totoallist_count:any;
  viewpdfimageeee: any
getimages() {

  this.taservice.getfetchpdfimage(this.expensetourid)
  .subscribe((results) => {
    // this.resultimage = results[0].url
    const file_ext = ['pdf', 'jpg', 'png', 'PDF', 'JPG', 'JPEG', 'jpeg', 'image']
    this.AdvanceMakerAttachmentList =results.advance_maker
    this.AdvanceApproverAttachmentList = results.advance_approver;
    // this.tourmaker_list=results.tour_maker;
    this.tourapprover_list=results.advance_maker;
    this.totoallist_count =results.advance_file_count;


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
}
