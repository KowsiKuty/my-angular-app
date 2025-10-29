import { Component, OnInit, ViewChild, Output, EventEmitter,  } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, } from '@angular/forms';
import { formatDate, DatePipe, DecimalPipe } from '@angular/common';
import { BreApiServiceService } from '../bre-api-service.service';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlingService } from '../error-handling-service.service';
import { BreShareServiceService } from '../bre-share-service.service';
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

class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}@Component({
  selector: 'app-bre-to-ecf-view',
  templateUrl: './bre-to-ecf-view.component.html',
  styleUrls: ['./bre-to-ecf-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe, DecimalPipe
  ]
})
export class BreToEcfViewComponent implements OnInit {

  bretoEcfviewForm : FormGroup
  bretoEcfApproverForm : FormGroup
  bretoEcfID : any
  bretoECFData : any
  @Output() onCancel = new EventEmitter<any>();

  @ViewChild('closedbuttons') closedbuttons;
  constructor(private fb: FormBuilder, private toastr:ToastrService, private errorHandler: ErrorHandlingService,
     public datepipe: DatePipe, private shareservice : BreShareServiceService,private breapiservice:BreApiServiceService,
     private SpinnerService: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.bretoEcfID = this.shareservice.bretoecfid.value
    this.bretoEcfviewForm = this.fb.group({
      branch: [''],
      supplier: [''],
      commodity: [''],
      rsrbranch: [''],
      
    })
    this.bretoEcfApproverForm = this.fb.group({
      remark: [''],
    })


   this.breapiservice.bretoEcfFetch(this.bretoEcfID).subscribe((results) => {
    if(results.code == undefined)
    {
      this.bretoECFData = results
      this.filearr =this.bretoECFData?.file?.data
    }               
  })
  }
  
  
formData: FormData = new FormData();
filenames=[]
filearr =[]
uploaddata(event:any){
  this.formData = new FormData();
  this.filearr =[]
  this.filenames=[]

  console.log(event.target.files.length);
  for(let i=0;i<event.target.files.length;i++)
  {
    this.formData.append('file_'+(i+1),event.target.files[i])
    this.filearr.push(event.target.files[i]);
    this.filenames.push("file_"+(i+1))
  } 
} 
  getfiles(data) {
    this.SpinnerService.show()
    this.breapiservice.filesdownload(data?.file_id)
      .subscribe((results) => {

        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = data.file_name;
        link.click();
        this.SpinnerService.hide()
      },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }

disabled = false
  
Reject()
{
  let rem = this.bretoEcfApproverForm.value.remark
  if(rem == undefined || rem == null || rem == "")
  {
    this.toastr.error("Please Enter Remarks")
    return false
  }

  let data ={
    "id":this.bretoEcfID,
    "remark":rem,
   }
  
   this.disabled = true
   this.breapiservice.bretoEcfReject(data).subscribe((results) => {
    this.disabled = false
    if(results.status == "success"){
                this.toastr.success(results.message,results.status)  
                this.onCancel.emit()
      }
      else
      {
       this.toastr.error(results.description,results.code)      
    }
})
}

Approve()
{
  let rem = this.bretoEcfApproverForm.value.remark
  if(rem == undefined || rem == null || rem == "")
  {
    this.toastr.error("Please Enter Remarks")
    return false
  }
  // if(this.filearr.length <=0)
  // {
  //   this.toastr.error("Please Upload File")
  //   return false
  // }
  let data ={
    "id":this.bretoEcfID,
    "remark":rem,
   }

   this.disabled = true
   this.SpinnerService.show()
   this.breapiservice.bretoEcfApprove(data).subscribe((results) => {
    this.disabled = false
    if(results.status == "success"){
                this.toastr.success(results.message,results.status)  
                this.onCancel.emit()
                this.SpinnerService.hide()
      }
      else
      {
       this.toastr.error(results.description,results.code) 
       this.SpinnerService.hide()     
    }
})
// this.SpinnerService.hide()
}


back()
{
  this.onCancel.emit()
}

data1(datas) {
   
  this.showimageHeaderAPI = false
  this.showimagepdf = false
  let id = datas?.file_id
  let filename = datas?.file_name
  // this.ecfservice.downloadfile(id)




  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  this.tokenValues = token
  const headers = { 'Authorization': 'Token ' + token }
  let stringValue = filename.split('.')
 
  
  if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg"||
  stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG" || stringValue[1] === "pdf"|| stringValue[1] === "PDF") {
  this.jpgUrlsAPI = window.open(this.imageUrl + "breserv/bretoecf_file/" + id + "?token=" + token, '_blank');
  }

  // if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg"||
  // stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {

  //     // this.showimageHeaderAPI = true
  //     // this.showimagepdf = false
     
     
  //   }
  //   if (stringValue[1] === "pdf"|| stringValue[1] === "PDF") {
  //     // this.showimagepdf = true
  //     // this.showimageHeaderAPI = false
  //     this.ecfservice.downloadfile1(id)
  //       // .subscribe((data) => {
  //       //   let dataType = data.type;
  //       //   let binaryData = [];
  //       //   binaryData.push(data);
  //       //   let downloadLink = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
  //       //   window.open(downloadLink, "_blank");
  //       // }, (error) => {
  //       //   this.errorHandler.handleError(error);
  //       //   this.showimagepdf = false
  //       //   this.showimageHeaderAPI = false
  //       //   this.SpinnerService.hide();
  //       // })
  //   }
  //   if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt"||
  //   stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT") {
  //     // this.showimagepdf = false
  //     // this.showimageHeaderAPI = false
  //   }  

    }
    
tokenValues: any
showimageHeaderAPI: boolean
showimagepdf: boolean
pdfurl: any
jpgUrlsAPI: any
imageUrl = environment.apiURL
showimageHeaderPreview: boolean = false   
  showimageHeaderPreviewPDF: boolean = false
  jpgUrls: any
 filepreview(files) {
  let stringValue = files.file_name.split('.')
  if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg" ||
    stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {
    // this.showimageHeaderPreview = true
    // this.showimageHeaderPreviewPDF = false
    const reader: any = new FileReader();
    reader.readAsDataURL(files);
    reader.onload = (_event) => {
    this.jpgUrls = reader.result
    const newTab = window.open();
    newTab.document.write('<html><body><img style="width: 500px;" src="' + this.jpgUrls + '" "/></body></html>');
    newTab.document.close();
    }
  }
  // if (stringValue[1] === "pdf" || stringValue[1] === "PDF") {
  //   // this.showimageHeaderPreview = false
  //   // this.showimageHeaderPreviewPDF = true
  //   const reader: any = new FileReader();
  //   reader.readAsDataURL(files);
  //   reader.onload = (_event) => {
  //   this.pdfurl = reader.result
  //   const link = document.createElement('a');
  //   link.href = this.pdfurl;
  //   link.target = '_blank'; // Open in a new tab
  //   link.click();
  //   }
  // }

  if (stringValue[1] === "pdf" || stringValue[1] === "PDF") {
    const reader: any = new FileReader();
    reader.onload = (_event) => {
      const fileData = reader.result;
      const blob = new Blob([fileData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    };
    reader.readAsArrayBuffer(files);
  }
  if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt" ||
    stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT") {
    this.showimageHeaderPreview = false
    this.showimageHeaderPreviewPDF = false
  }
}

fileback() {
  this.closedbuttons.nativeElement.click();
}

viewtrnlist:any=[];
viewtrn()
{
  this.breapiservice.getBretoEcfViewTrans(this.bretoEcfID).subscribe(data=>{
    this.viewtrnlist=data['data'];
  })
}
name:any;
branch:any;
desig: any
view(dt){
  this.name=dt?.emp?.name
  this.branch=dt?.emp_branch?.name
  this.desig=dt?.emp?.designation
 }

}
