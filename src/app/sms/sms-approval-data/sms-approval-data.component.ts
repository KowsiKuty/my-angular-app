import { formatDate } from '@angular/common';
import { Component, HostListener, OnInit, TemplateRef, ViewChild,EventEmitter,ElementRef,Renderer2 ,ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormControl, FormGroup ,FormArray} from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SmsShareService } from '../sms-share.service';
import { SmsService } from '../sms.service';
import { environment } from "src/environments/environment";
// import { createPublicKey } from 'crypto';
// import { fromEvent, pipe } from 'rxjs';
export const PICK_FORMAT={
  parse:{dateInput:{year:'numeric',month:'short',day:'numeric'}},
  display:{
    dateInput:'input',
    monthYearLabel:{'year':'numeric',month:'short'},
    dateAllyLabel:{year:'numeric',month:'long',day:'numeric'},
    monthYearAllyLabel:{year:'numeric',month:'long'}
  }
}
class pDateAdapter extends NativeDateAdapter{
  format(date: Date, displayFormat: Object): string {
    if(displayFormat==='input'){
      return formatDate(date,'dd-MMM-yyyy',this.locale)
    }
    else{
      return date.toDateString();
    }
  }
}
@Component({
  selector: 'app-sms-approval-data',
  templateUrl: './sms-approval-data.component.html',
  styleUrls: ['./sms-approval-data.component.scss'],
  providers:[
    {provide:DateAdapter,useClass:pDateAdapter},
    {provide:MAT_DATE_FORMATS,useValue:PICK_FORMAT}
    
  ]
})
export class SmsApprovalDataComponent implements OnInit {
  selectedIndex: number = 0;
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){  
    if(event.code =="Escape"){
      this.spinner.hide();
    }
       
  } 
  
  
  
  @ViewChild('viewfiledata') tempdata:TemplateRef<any>;
  @ViewChild('radio1') radio1: ElementRef;
  @ViewChild('radio2') radio2: ElementRef;
  @ViewChild('closedbuttons') closedbuttons;
  @ViewChildren('fileInput') fileInput: QueryList<ElementRef>
  @ViewChild('fileInput', { static: false }) InputVars: ElementRef;


  approveform:any=FormGroup;
  summarydata:Array<any>=[];
  has_next:boolean=false;
  has_previous:boolean=false;
  presentpage:number=1;
  pageSize:number=10;
  pdfSrc:any;
  status:any;
  filedatalist:Array<any>=[]
  formData:any=new FormData();
  formData_1:any=new FormData();
  selectedOption:any;
  has_previousnew:boolean=false;
  has_nextnew:boolean=false;
  presentpagenew:number=1;
  data:any=[];
  zoom_to:any=1;
  frmData :any= new FormData();
  servicePeriod:any= {
    '1':'MONTHLY',
     '3': 'QUARTERLY ',
     '4': 'THRICE IN A YEAR',
      '6': 'HALF YEARLY',
     '12': 'ANNUAL'
    };
    id:any;
  selectdata:any;
  file:any;
  enb_data:any='AMC';
  ser_per:any={'3':'QUATERLY'};
  imgview:boolean=false;
  pdfview:boolean=false;
  constructor(private matdialog:MatDialog,private spinner:NgxSpinnerService,private router:Router,private toastr:ToastrService,private fb:FormBuilder,private shareSerice:SmsShareService,private smsservice:SmsService,private renderer:Renderer2) { }

  ngOnInit(): void {
    this.approveform=this.fb.group({
      'id':new FormControl(''),
      'name':new FormControl(''),
      'fromperiod':new FormControl(''),
      'toperiod':new FormControl(''),
      'suppliername':new FormControl(''),
      'serviceperiod':new FormControl(''),
      'amctotal':new FormControl(''),
      'check':new FormControl(''),
      'remarks':new FormControl(''),
      'periodicmail':new FormControl(''),
      'file':new FormControl('')
    });
    this.myForm = this.fb.group({
      fileInputs: this.fb.array([this.filerow()])
    });
   
    let data:any=this.shareSerice.approval_data.value;
    this.enb_data=data['amcheader_type'];
    this.id=data.id
    this.getapprovaldata(this.id); 
  } 
  getapprovaldata(data:any){
    this.spinner.show();
    this.smsservice.getamcapprovalsummaryselect(data, this.presentpage).subscribe(res=>{
      this.spinner.hide();
      if (data==undefined){
      this.status=data.status}
      this.approveform.patchValue({'name':res.amcheader_name,'fromperiod':res.amcheader_period_from,
    'toperiod':res.amcheader_period_to,'suppliername':res.supplier_name,'serviceperiod':this.servicePeriod[res.serviceperiod],
      'amctotal':res.amcheader_amctotalamt,'periodicmail':res.periodic_mail
    });
    this.file=res.file
    this.filedeatils(data)
    if(res['data']['data'].length>0){
      this.summarydata=res['data']['data'];
      let pagination:any=res['data']['pagination'];

      console.log(pagination)
    this.has_previousnew=pagination.has_previous;
    this.has_nextnew=pagination.has_next;
    this.presentpage=pagination.index;
    }
    else{
      this.summarydata=[];
    }
    });
    }
  filedeatils(data:any){
    this.smsservice.getamcaselectfile(data).subscribe((res) => {
      if(res['data'].length>0){
        this.filedatalist=res['data'];
      }
      else{
        this.filedatalist=[];
      }
    })


  }
    newpreviousClick() {
      if (this.has_previousnew === true) {
        this.presentpage -=1;
        this.getapprovaldata(this.id);
      }
    }

    newnextClick() {
      if (this.has_nextnew === true) {
        this.presentpage +=1;
        this.getapprovaldata(this.id);
      }
    }

  
  kyenbdata(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }
  binaryData:Array<any>=[];
  downloadUrl:any;
  imgurl:any;
  pdfpup() {

    this.smsservice.amcfileview(this.id)
        .subscribe((data) => {
          console.log(data['type'])
          let a:any=data['type'].toString();
          let b:any=a.split('/')
          let c:any= b[a.split('/').length-1];
          const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.position = {
          top:  '1%'  ,
          // right: '0'
        };
        dialogConfig.width = '60%' ;
        dialogConfig.height = '500px' ;
          if(c=='png'){
            this.imgview=true;
            this.pdfview=false;
            this.binaryData.push(data)
            console.log("data",data)
            console.log("binaryData",this.binaryData)
            this.downloadUrl = window.URL.createObjectURL(new Blob([data], {type: 'application/pdf'}));
            let link = document.createElement('a');
            console.log(link)
            link.href = this.downloadUrl;
            this.imgurl = this.downloadUrl;
            this.matdialog.open(this.tempdata,dialogConfig);
          }
          if(c=='pdf'){
            this.imgview=false;
            this.pdfview=true;
            this.matdialog.open(this.tempdata,dialogConfig);
            this.binaryData.push(data)
            console.log("data",data)
            console.log("binaryData",this.binaryData)
            this.downloadUrl = window.URL.createObjectURL(new Blob([data], {type: 'application/pdf'}));
            let link = document.createElement('a');
            console.log(link)
            link.href = this.downloadUrl;
            this.pdfSrc = this.downloadUrl;
            this.matdialog.open(this.tempdata,dialogConfig);
          }
          else{
            this.pdfSrc=undefined;
            this.binaryData = [];
            this.imgview=false;
            this.pdfview=false;
          }
         
      });
     
    }
    closedialogdata(){
      this.matdialog.closeAll();
    }
    approveAction() {
      // Implement approve action here
      console.log('Approved');
    }
  
    rejectAction() {
      // Implement reject action here
      console.log('Rejected');
    }
  
  PDfDownload() {
      // let id = this.getMemoIdValue(this.idValue)
      let name =  'Karur Vysya Bank'
      this.smsservice.amcfileviewdownload(this.id)
        .subscribe((data) => {
          // let a:any=data['type'].toString();
          // let b:any=a.split('/')
          // let c:any= b[a.split('/').length-1];
          // if(c=='png'){
          //   console.log('T')
          // }
          // if(c=='pdf'){
            let binaryData = [];
            binaryData.push(data)
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            let link = document.createElement('a');
            link.href = downloadUrl;
            link.download = name + ".pdf";
            link.click();
          // }
         
        })
    }
  approval_download_file(data:any,filename){
      this.spinner.show();
      let fileName = filename
      this.smsservice.sms_approval_file_download(data).subscribe((response: any) =>{
            this.spinner.hide();
            if(response['type']!="application/json"){
              let filevalue = fileName.split('.')
              let binaryData = [];
              binaryData.push(response)
              let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
              let link = document.createElement('a');
              link.href = downloadUrl;
              link.download = fileName;
              link.click();}
           if(response['type']=="application/json"){
            this.spinner.hide();
              this.toastr.error('No Download Files Found');
            }
        }),(error) => {
          this.toastr.error('No Download Files Found');
          this.spinner.hide();
          this.spinner.hide();
        }
  }
        
  tokenValues: any
  showimageHeaderAPI: boolean
  showimagepdf: boolean
  pdfurl: any;
  jpgUrlsAPI: any
  imageUrl = environment.apiURL
  
  approval_view_file(datas,filename) {
      console.log('approval_view_file:')
      
    
      this.smsservice.sms_approval_file_view(datas).subscribe(
      (response: any) =>{
        let fileName = filename
        // let filename = response.type;
        let stringValue = fileName.split('.')
        if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg"||
        stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {   
          const getToken = localStorage.getItem("sessionData");
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token;
          this.tokenValues = token
          const headers = { 'Authorization': 'Token ' + token }
          this.showimageHeaderAPI = true
          this.showimagepdf = false
          this.jpgUrlsAPI = this.imageUrl+"smsservice/download_doc_file/"+datas+"?token="+token
          console.log('view',this.jpgUrlsAPI) 
        }    
        if (stringValue[1] === "pdf"|| stringValue[1] === "PDF") {
          this.showimagepdf = true
          this.showimageHeaderAPI = false
          const getToken = localStorage.getItem("sessionData");
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token;
          this.tokenValues = token
          const headers = { 'Authorization': 'Token ' + token }
          let downloadUrl=this.imageUrl+"smsservice/amc_doc_download/"+datas+"?token="+token
          let link = document.createElement('a');
          link.href = downloadUrl;
          this.pdfurl = downloadUrl;     
        }       
        if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt"||
        stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT"|| stringValue[1] === "octet-stream"|| stringValue[1] === "OCTET-STREAM") {
          this.showimagepdf = false
          this.showimageHeaderAPI = false
          this.toastr.warning('View File (csv,ods,xlsx,txt - Format) is not supported');
        }
        // if(response['code']==='Download File is not Exists') {
        //   this.toastr.error('No View Files Found');
        // }
        if(response['type']=="application/json"){
          this.spinner.hide();
          this.toastr.error('No View Files Found');

        }
        (error)=>{
          this.toastr.error(response['code']);
          this.toastr.error(response['description']);
        }
    })
  }
  
  approvedata(){
    
    console.log(this.selectdata);

    console.log(this.selectdata);
   
    if(this.isapproveChecked==true){
      // if(this.approveform.get('remarks').value ==undefined || this.approveform.get('remarks').value =="" || this.approveform.get('remarks').value ==''){
      //   this.toastr.error('Please Enter The Remarks');
      //   return false;
      // }
    
      let remarks:any =this.approveform.get('remarks').value?this.approveform.get('remarks').value:''
      let d={'query':this.id,'remarks':remarks}
      this.valid_arr.forEach((ele)=>{
        this.frmData.append('file',ele);
      })
      
      this.frmData.append('data',JSON.stringify(d));
      this.spinner.show();
      // this.formData.append('data',JSON.stringify(d));
      this.smsservice.getamcapprovalsummaryapprove(this.frmData).subscribe(res=>{
        if(res['status']=='success'){
          this.toastr.success('Successfully Approved');
          this.router.navigate(['/sms/smsapprovalsummary']);
        }
        else{
          this.toastr.error(res['code']);
          this.toastr.error(res['description']);
        }
      },
      (error)=>{
        this.toastr.error(error.status+error.statusText);
      }
      );
    }
    if(this.isrejectChecked==true){
      if(this.approveform.get('remarks').value ==undefined || this.approveform.get('remarks').value =="" || this.approveform.get('remarks').value ==''){
        this.toastr.error('Please Enter The Remarks');
        return false;
      }

      console.log(this.approveform.get('remarks').value)
      let remarks=this.approveform.value.check
      this.smsservice.getamcapprovalsummaryreject(this.id,remarks).subscribe(res=>{
        if(res['status']=='success'){
          this.toastr.success('Successfully Rejected');
          this.router.navigate(['/sms/smsapprovalsummary']);
        }
        else{
          this.toastr.error(res['code']);
          this.toastr.error(res['description']);
        }
      },
      (error)=>{
        this.toastr.error(error.status+error.statusText);
      }
      );
    }

  }
  rejectdata(){
    console.log(this.approveform.value);
    console.log(this.selectdata);
  }
  zoom_in() {
    this.zoom_to = this.zoom_to + 0.25;
  }

  zoom_out() {
    if (this.zoom_to > 1) {
       this.zoom_to = this.zoom_to - 0.25;
    }
  }
 
  // approval_uploaddata(event:any){
  //   this.formData.delete('file')
  //   this.formData.delete('data')
  //   if (event.target.files.length>0){
  //   console.log(event.target.files.length);
  //   this.formData.append('file',event.target.files[0])
  //   }
  //   else{
  //     this.formData.append('file','')

  //   }

  // }
  approval_uploaddata(event:any){
    console.log(event.target.files.length);
    this.formData.append('file',event.target.files[0])
  }
  // Enabled=true;
  // approveEnabled=true
  isfileviewChecked:boolean=true
  isapproveChecked: boolean = false;
  isrejectChecked: boolean = false;
  eventHandler(event) {
    this.isapproveChecked
    console.log('keyboad',event.keyCode)
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 9 || charCode == 11|| charCode == 39|| charCode == 37){
      if(this.approveform.get('check').value=="Approve"){
        this.isapproveChecked=true;
        this.isrejectChecked=false;

      }
        } 
        else if (event.key === 'Enter') {
          event.preventDefault();
          if (this.isapproveChecked) {
            // Handle approve action
          } else if (this.isrejectChecked) {
            // Handle reject action
          }
        }
      }
  
  eventclick(event,a) {

    console.log('keyboad',a)
    // const charCode = (event.which) ? event.which : event.keyCode;
    // let isapproveChecked: boolean = false;
    // isrejectChecked: boolean = false;
    if(a=="Approve"){
      this.approveform.value.check=a;
      this.isapproveChecked=true;
      this.isrejectChecked=false;
      this.isfileviewChecked=false;

    }
    if(a=="Reject"){
      this.approveform.value.check=a;
      this.isrejectChecked=true;
      this.isapproveChecked=false;
      this.isfileviewChecked=true;

    }

   
    // return true;
}


getSections(forms) {
  return forms.controls.fileInputs.controls;
}
showinvheaderadd : boolean = false
inveditindex:any
getheaderedit(i){
  this.showinvheaderadd = true
  this.inveditindex = i
}
filerow(){
  let group =this.fb.group({
    filevalue:new FormArray([]),
    file_key:new FormArray([]),
    filedataas:new FormArray([])
  })
}
assetcat1:any
valid_arr:Array<any>=[];
file_process_data:any={};
getFileDetails(index, e) {
  let data = this.myForm.value.fileInputs;
  for (var i = 0; i < e.target.files.length; i++) {
    data?.filevalue?.push(e.target.files[i])
    data?.filedataas?.push(e.target.files[i])
    this.myForm?.value?.fileInputs.push(e.target.files[i])
    this.valid_arr.push(e.target.files[i])
      // this.frmData.append("file",e.target.files[i]);
    // this.formData.push('file',e.target.files[i]);
    
    

  }
  
  
  this.file_process_data["file"+index]=this.valid_arr;
  // this.formData.append('file',this.valid_arr)
  this.formData['file']=this.valid_arr
  if (e.target.files.length > 0) {
    if (data?.file_key.length < 1) {
      data?.file_key?.push("file" + index);
    }
    
  }

}

filedatas: any
fileindex: any
filedatadataswork: any
getfiledetails(datas, ind) {
  console.log("ddataas",datas)
  this.filedatadataswork=datas
  this.fileindex = ind
  this.filedatas = datas?.value['filekey']
}
fileback() {
  this.closedbuttons.nativeElement.click();
}
fileDeletes(data, index: number) {
  this.smsservice.deletefile(data)
    .subscribe(result => {
      if (result?.status == 'success') {
        // this.fileList.splice(index, 1);
        this.myForm.value[this.fileindex].filedataas.splice(index, 1)
        this.myForm.value[this.fileindex].filekey.splice(index, 1)
        this.toastr.show("Deleted....")
        // this.closedbuttons.nativeElement.click();
      } else {
        this.toastr.error(result?.description)
        this.closedbuttons.nativeElement.click();
        return false
      }
    })
}
  showimageHeaderPreview: boolean = false
  showimageHeaderPreviewPDF: boolean = false
  jpgUrls: any
  // pdfurl: any
  myForm: FormGroup;
  filepreview(files) {
    let stringValue = files.name.split('.')
    let extension = stringValue[stringValue.length-1]
    
    if (extension === "png" || extension === "jpeg" || extension === "jpg" ||
      extension === "PNG" || extension === "JPEG" || extension === "JPG") {
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
   
    if (extension === "pdf" || extension === "PDF") {
      const reader: any = new FileReader();
      reader.onload = (_event) => {
        const fileData = reader.result;
        const blob = new Blob([fileData], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      };
      reader.readAsArrayBuffer(files);
    }
    if (extension === "csv" || extension === "ods" || extension === "xlsx" || extension === "txt" ||
      extension === "ODS" || extension === "XLSX" || extension === "TXT") {
      this.showimageHeaderPreview = false
      this.showimageHeaderPreviewPDF = false
    }
  }
  getfiles(data) {
    this.spinner.show()
    this.smsservice.filesdownload(data.file_id)
      .subscribe((results) => {
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = data.file_name;
        link.click();
        this.spinner.hide()
      },
        error => {
          this.toastr.error(error);
          this.spinner.hide();
        }
      )
  }

  // imageUrl = environment.apiURL
  // tokenValues: any
  // showimageHeaderAPI: boolean
  // showimagepdf: boolean
  // jpgUrlsAPI: any
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
    let extension = stringValue[stringValue.length-1]

    if (extension === "png" || extension === "jpeg" || extension === "jpg"||
    extension === "PNG" || extension === "JPEG" || extension === "JPG") {

        // this.showimageHeaderAPI = true
        // this.showimagepdf = false
       
        this.jpgUrlsAPI = window.open(this.imageUrl + "ecfapserv/ecffile/" + id + "?token=" + token, '_blank');
       
      }
      if (extension === "pdf"|| extension === "PDF") {
        // this.showimagepdf = true
        // this.showimageHeaderAPI = false
        this.smsservice.downloadfile1(id)
          // .subscribe((data) => {
          //   let dataType = data.type;
          //   let binaryData = [];
          //   binaryData.push(data);
          //   let downloadLink = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
          //   window.open(downloadLink, "_blank");
          // }, (error) => {
          //   this.errorHandler.handleError(error);
          //   this.showimagepdf = false
          //   this.showimageHeaderAPI = false
          //   this.SpinnerService.hide();
          // })
      }
      if (extension === "csv" || extension === "ods" || extension === "xlsx" || extension === "txt"||
      extension === "ODS" || extension === "XLSX" || extension === "TXT") {
        // this.showimagepdf = false
        // this.showimageHeaderAPI = false
      }
  
  
  
  
  }
  deletefileUpload(invdata, i) {

    // let filesValue = this.fileInput.toArray()
    // let filesValueLength = filesValue?.length
    // for (let i = 0; i < filesValueLength; i++) {
    //   filesValue[i].nativeElement.value = ""
    // }
    let filedata = invdata.filevalue
    let filedatas = invdata.filedataas
    let file_key = invdata.file_key;
    // this.fileInput:any=this.fileInput.toArray();
    // this.fileInput.splice(i,1);
    let index_id:any="file"+this.fileindex;
    this.file_process_data[index_id].splice(i,1);
    filedata.splice(i, 1)
    filedatas.splice(i, 1)
    if (this.file_process_data[index_id].length == 0) 
      file_key.splice(i, 1)
      
      // this.frmData.append('file',file_key);
      this.valid_arr.push(file_key)
      // this.formData['file']=file_key;
      this.valid_arr.push(file_key);
      console.log('file data',this.formData)
      

  }
  get fileInputs() {
    return this.myForm.get('fileInputs') as FormArray;
  }

}