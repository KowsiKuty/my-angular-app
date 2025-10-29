import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BrsApiServiceService } from '../brs-api-service.service';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";

export interface displayfromat {
  branch:any;
  gl_code:any;
  type:any;
}

@Component({
  selector: 'app-brs-report',
  templateUrl: './brs-report.component.html',
  styleUrls: ['./brs-report.component.scss']
})
export class BrsReportComponent implements OnInit {
  brscode: any;
  brsreport: FormGroup;
  actiondate: string;
  actiondate2: string;
  actionsum: any;
  has_nexttab: any;
  has_previoustab: any;
  isSummaryPagination: boolean;
  data_found: boolean;
  presentpagetab: any;
  currentpage: number;
  arstype: any;
  ars_type: string;
  actionsum1: any;
  branch: any;
  gl_code: any;

  constructor(private fb: FormBuilder, private brsService: BrsApiServiceService,private notification: NotificationService,private SpinnerService: NgxSpinnerService,public datepipe: DatePipe,
    private router: Router,) { }

  ngOnInit(): void {
    this.brsreport= this.fb.group({
      summarydate:'',
      summarydate2:'',
      branch:'',
      GLACCNO:'',
      arstype:'',
    })
    
  }
  public displaygl(displaydata?: displayfromat): string | undefined {
    return displaydata ? displaydata.gl_code  : undefined;
  }
  public displaybranch(displaydata?: displayfromat): string | undefined {
    return displaydata ? displaydata.branch  : undefined;
  }

  public displayaction(displaydata?: displayfromat): string | undefined {
    return displaydata ? displaydata.type  : undefined;
  }

  brachserach(){
    this.SpinnerService.show()
     this.brsService.ARScodeDDunmatch().subscribe((results: any) => {
      this.SpinnerService.hide();
      this.brscode = results["data"]
      if(results.code ==  "UNEXPECTED_ERROR"){
        this.notification.showError(results.description)
        return false
      }
     
    });
  }

  summary_back(){
    this.router.navigate(["brs/brs_unmatched"], {});
  }

  summary_clear(){
    this.brsreport.reset()
  }

  summary_search(pageNumber = 1){
    if(this.brsreport.controls["summarydate"].value == null || this.brsreport.controls["summarydate"].value ==""){
      this.notification.showError("Choose Start date")
      return false
    }else{
      this.actiondate = this.datepipe.transform(this.brsreport.controls["summarydate"].value,"yyyy-MM-dd");
    }
    if(this.brsreport.controls["summarydate2"].value == null || this.brsreport.controls["summarydate2"].value ==""){
      this.notification.showError("Choose End date")
      return false
    }else{
      this.actiondate2 = this.datepipe.transform(this.brsreport.controls["summarydate2"].value,"yyyy-MM-dd");   
    }
    if(this.brsreport.controls["arstype"].value == null || this.brsreport.controls["arstype"].value ==""){
      this.ars_type = ""
    }else{
      this.ars_type = this.brsreport.controls["arstype"].value.id;
    }
    this.SpinnerService.show()
    this.brsService.Actionsummary(this.actiondate,this.actiondate2,this.ars_type,pageNumber).subscribe((results: any) => {
      this.SpinnerService.hide();
      this.actionsum = results["data"]
      let actionsum1 = this.actionsum[0]
      this.branch = actionsum1.branch
      this.gl_code = actionsum1.gl_code
      let datas = results["data"];
      if(results.code ==  "UNEXPECTED_ERROR"){
        this.notification.showError(results.description)
        return false
      }
      let dataPagination = results['pagination'];
      if (datas.length >= 0) {
        this.has_nexttab = dataPagination.has_next;
          this.has_previoustab = dataPagination.has_previous;
          this.presentpagetab = dataPagination.index;
          this.isSummaryPagination = true;
          this.data_found = true;
      }
     
    });
  }

  previousClick(){
    if(this.has_previoustab == true){
      this.currentpage = this.presentpagetab - 1;
      this.summary_search(this.presentpagetab - 1)
 
    }
  }
  nextClick(){
    if(this.has_nexttab == true){
      this.currentpage = this.presentpagetab +1;
      this.summary_search(this.presentpagetab +1)
  
    }
}

arsdroupdowntype(){
  this.SpinnerService.show()
  this.brsService.ArsDropdown().subscribe((results: any) => {
    this.SpinnerService.hide();
    this.arstype = results["data"]
    console.log("this.arstype.id = ",this.arstype.id)
    
  });
}

arsdownload(){
  if(this.brsreport.controls["summarydate"].value == null || this.brsreport.controls["summarydate"].value ==""){
    this.notification.showError("Choose Start date")
    return false
  }
  if(this.brsreport.controls["summarydate2"].value == null || this.brsreport.controls["summarydate2"].value ==""){
    this.notification.showError("Choose End date")
    return false
  }
  let date1 = this.datepipe.transform(this.brsreport.controls['summarydate'].value,"yyyy-MM-dd");
  let date2 = this.datepipe.transform(this.brsreport.controls['summarydate2'].value,"yyyy-MM-dd");
  // console.log("clicked",glcode)
  // console.log("clicked",branch)
  let glcode =this.gl_code
  let branch =this.branch
  this.SpinnerService.show()
  this.brsService.action_download(glcode,branch,date1,date2).subscribe((results: any) => {
    this.SpinnerService.hide();  
    let binaryData = [];
     binaryData.push(results)
     let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
     let link = document.createElement('a');
     link.href = downloadUrl;
     link.download = "ARS_report"+".xlsx";
     link.click();
  });

}

  
}
