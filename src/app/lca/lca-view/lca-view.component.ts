import { Component, OnInit,ViewChild,Output,EventEmitter } from '@angular/core';
import { LcasharedService } from '../lcashared.service';
import { LcaService } from '../lca.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { FormGroup,FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ErrorhandlerService } from '../errorhandler.service';
@Component({
  selector: 'app-lca-view',
  templateUrl: './lca-view.component.html',
  styleUrls: ['./lca-view.component.scss']
})
export class LcaViewComponent implements OnInit {
  listlcadetails:any
  tableviewdata:any
  id:any
  amt:any
  beneficiarydata:any
  filedtailsdata:any
  isdetpage:boolean=false;
  presentpagedet:number=1;
  isexpanded:boolean=true;
  flag:any
  apprejform:FormGroup
  @ViewChild('closedbuttons') closedbuttons;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit =new EventEmitter<any>();
  fileDetailsArray:any
  jpgUrls: any
  pdfurl: any

  constructor(private lcashared:LcasharedService,private lcaserv:LcaService,private spinner:NgxSpinnerService
    ,private notification:NotificationService,private router:Router,private fb:FormBuilder,private toastr:ToastrService,
    private errorHandler:ErrorhandlerService) { }

  ngOnInit(): void {
    this.apprejform=this.fb.group(
      {
        remark:['']
      }
    )
    this.showjvsummaryviews("")
  this.comefrom()
  }
  eyecrete:boolean
  comefrom()
    {
     this.eyecrete=this.lcashared.appReject.value
    }
   
    filepreview(files) {
      let stringValue = files.name.split('.')
      if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg" ||
        stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {
        const reader: any = new FileReader();
        reader.readAsDataURL(files);
        reader.onload = (_event) => {
          this.jpgUrls = reader.result
        }
      }
      if (stringValue[1] === "pdf" || stringValue[1] === "PDF") {
        const reader: any = new FileReader();
        reader.readAsDataURL(files);
        reader.onload = (_event) => {
          this.pdfurl = reader.result
        }
      }
      if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt" ||
        stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT") {
      }
    }
    lcamode:any
    dynamiccolumns:any
  showjvsummaryviews(data)
  {
    let val=this.lcashared.viewvalue.value
    console.log("The value is",val)
    this.spinner.show()
    this.lcaserv.getview(val).subscribe(data=>
    {
      this.spinner.hide();
      this.listlcadetails=data
      this.tableviewdata=this.listlcadetails["lcadetails"];
      console.log("1",this.tableviewdata)
      this.dynamiccolumns=this.tableviewdata[0].expense_tran.data
      console.log("Dynamically created",this.dynamiccolumns)
      this.lcamode=this.tableviewdata[0].expense_tran.data[0].expense_type_id.LCA_name
      this.amt=data?.lcaamount
      // this.amt=this.listlcadetails["lcadetails"]?.lcadamount
      this.beneficiarydata=this.listlcadetails["beneficiary"]
      this.filedtailsdata=this.listlcadetails["file_data"]
      this.fileDetailsArray = this.filedtailsdata
      console.log("5376458734658734456789076789765788",this.filedtailsdata)
      if(data?.code)
      {
        this.spinner.hide();
        this.notification.showError(data?.description)
      }
    })
  }

  downloadfiles(data) {
    this.spinner.show()
    this.lcaserv.viewfieldett(data.file_id)
      .subscribe((results) => {

        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = data.file_name;
        link.click();
        this.spinner.hide()
        
      },(error) => {
        this.errorHandler.handleError(error);
        this.spinner.hide()
      }
      )
  }
  filepopback()
  {
    // this.onCancel.emit();
    this.router.navigate(['lca/lcasummary'])
  }
  filepopappback()
  {
    this.router.navigate(['lca/lcapprover'])
    // this.onSubmit.emit()
  }
  presentjvsum: number = 1;
  length_det = 0;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  pageSize_det=10;
  showFirstLastButtons:boolean=true;
  pophandlePageEvent(event: PageEvent) {
    this.length_det = event.length;
    this.pageSize_det = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.pageIndex=event.pageIndex+1;
    
  }

  Approve()
  {
    let rem = this.apprejform.value.remark
    if(rem == undefined || rem == null || rem == "")
    {
      this.toastr.error("Please Enter Remarks")
      return false
    }
    let data ={
      "id":this.listlcadetails.id,
      "lcadescription":rem,
     }
     let s="APPROVE"
     this.lcaserv.bretoEcfApprove(data,s).subscribe((results) => {
      if(results.status == "success"){
                  this.toastr.success(results.message,results.status)  
                  // this.onCancel.emit()
                  this.filepopback();
        }
        else
        {
         this.toastr.error(results.description,results.code) 
         this.filepopback();     
      }
  })
  }

  Reject()
  {
    let rem = this.apprejform.value.remark
    if(rem == undefined || rem == null || rem == "")
    {
      this.toastr.error("Please Enter Remarks")
      return false
    }
  
    let data ={
      
      "id":this.listlcadetails.id,
      "lcadescriptionremark":rem,
     }
     let s="REJECT"
     this.lcaserv.bretoEcfReject(data,s).subscribe((results) => {
      if(results.status == "success"){
                  this.toastr.success(results.message,results.status)  
                  // this.onCancel.emit()
                  this.filepopback();
        }
        else
        {
         this.toastr.error(results.description,results.code)   
         this.filepopback();   
      }
  })
  }
}
