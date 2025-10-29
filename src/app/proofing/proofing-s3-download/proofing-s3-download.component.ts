import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ShareService } from '../share.service';
import { ProofingService } from '../proofing.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../notification.service';
@Component({
  selector: 'app-proofing-s3-download',
  templateUrl: './proofing-s3-download.component.html',
  styleUrls: ['./proofing-s3-download.component.scss']
})
export class ProofingS3DownloadComponent implements OnInit {
  proofUrl = environment.apiURL
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  proofs3:any
  page: number = 0
  proofings3pagination:boolean=false;
  Summarys3ApimasterObjNew:any
  file : number;
  fileid:any
  @ViewChild('viewback') viewback;
  @Input() parentData:any;
  uploadvalue: boolean;
  CommentintervalId: any;
  constructor(private router: Router,private sharedservice: ShareService, private proofingService: ProofingService,private spinner:NgxSpinnerService,private notification: NotificationService) { }
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
    console.log(this.parentData,'parent')
   this.fileid   =  this.sharedservice.downloadid.value;
    console.log("source", this.fileid)
    // this.Summarys3ApimasterObjNew ={"method": "post", "url": this.proofUrl + "prfserv/report_s3_download_summery", params: "","data": ""}
    this.refresh()

    if (this.CommentintervalId) {
      clearInterval(this.CommentintervalId);
    }
    // this.CommentintervalId = setInterval(() => {
    //   // this.Summarys3ApimasterObjNew ={"method": "post", "url": this.proofUrl + "prfserv/report_s3_download_summery", params: "","data": ""}
    //   this.refresh()
    //   console.log('API called at: ', new Date());
    // }, 1000 * 20);
  }

  backtoPrevious()
  {
    if(this.fileid == undefined || this.fileid == 0 || this.fileid == null)
      {
    this.router.navigate(["proofing/fileupload"])
   
      }

      else{
      //  this.uploadvalue = this.sharedservice.uploadsum.value
      this.sharedservice.uploadsum.next(false)
      //  this.uploadvalue = false
        this.router.navigate(["proofing/proofingreport"])
        this.viewback.nativeElement.click();
      }
  }


  Summarys3sumData: any = [{"columnname": "File Name","key": "gen_filename"},{"columnname": "File Date","key": "file_date"},{"columnname": "Status","key": "statuscol", validate: true, validatefunction: this.statuscolumn.bind(this)},{"columnname": "Download","key": "status", validate: true, validatefunction: this.statuskey.bind(this),function:true, "button":true,clickfunction:this.s3sumdownload.bind(this)}]
 

  statuskey(sta){
    let config: any = {
      style: "",
      icon: "",
      class: "",
      value: "",
    };

    if(sta.status == 1){
      config = {
        style: {color:'grey', cursor: "pointer"},
        icon: "download",
        class: "",
        value: "",
        function: true
      }
     
    }
    else if(sta.status == 0){
      config = {
        style: "",
        icon: "",
        class: "",
        value: "",
      }
    }
    else{
      config = {
        style: "",
        icon: "",
        class: "",
        value: "",
      }
    }
    return config
  }
statuscolumn(col){
  let config: any = {
    style: "",
    icon: "",
    class: "",
    value: "",
  };

  if (col.status== 1) {
    config = {
      class: "table-badge2",
      style: "",
      value: "Success",
    }
  }
  else if (col.status== 0){
    config = {
      class: 'table-badge9',
      style: "",
      value: "STARTED",
    }
  }
  else if (col.status== 2){
    config = {
      class: "table-badge6",
      style: "",
      value: "PROCESSING",
    }
  }
  else if (col.status== 3){
    config = {
      class: "table-badge3",
      style: "",
      value: "COMPLETED",
    }
  }
  else if (col.status== 4){
    config = {
      class: "table-badge",
      style: "",
      value: "FAILED",
    }
  }
  return config
}
  s3sumdownload(id){
    console.log("iddd", id.gen_filename)
    this.spinner.show(); 
    this.proofingService.s3summary(id.id,this.parentData?.id).subscribe((fullXLS=>{
      console.log(fullXLS);
      let binaryData = [];
      binaryData.push(fullXLS)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = id.gen_filename;
      link.click();
      this.spinner.hide()
    }),
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
      this.notification.showWarning(error.status + error.statusText);
    })
  }

  refresh(){
    if(this.parentData?.id){
      this.Summarys3ApimasterObjNew ={"method": "post", "url": this.proofUrl + "prfserv/report_s3_download_summery", params: "&proof_temp_id="+this.parentData?.id,"data": ""}
    }else{
      this.Summarys3ApimasterObjNew ={"method": "post", "url": this.proofUrl + "prfserv/report_s3_download_summery", params: "","data": ""} 
    }
    
  }
}
