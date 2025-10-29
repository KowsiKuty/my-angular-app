import { Component, HostListener, OnInit,ViewChild ,ElementRef} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import {SmsShareService} from '../sms-share.service'
import { SmsService } from '../sms.service';
import { ToastrService } from 'ngx-toastr';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { finalize, map, switchMap, takeUntil, tap, startWith} from 'rxjs/operators';
import { MatCheckbox } from '@angular/material/checkbox';
export interface branch{
  id:string;
  name:string;
  code:string;
}
export interface product{
  id:string;
  name:string;
}
@Component({
  selector: 'app-sms-approval-summary',
  templateUrl: './sms-approval-summary.component.html',
  styleUrls: ['./sms-approval-summary.component.scss']
})
export class SmsApprovalSummaryComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){  
    if(event.code =="Escape"){
      this.spinner.hide();
    }   
  }
  first=false;
  approveform:any=FormGroup;
  bulkapproveform:any=FormGroup;
  has_next:boolean=false;
  has_previous:boolean=false;
  presentpage:number=1;
  pagesize:number=10;
  approvalList:Array<any>=[];
  totalcount:number=0;
  smsbulkuploadform:any=FormGroup;
  sms_bulk_upload:Array<any>=[];
  file_upload_frmData:any=new FormData();
  fileformData:any=new FormData();
  branchList: Array<any>=[];
  constructor(private spinner:NgxSpinnerService,private smsService:SmsService,private fb:FormBuilder, private smsShare:SmsShareService,private router:Router,  private toastr:ToastrService) { }
  approveList: Array<any>=[];
  has_branchnext:boolean=true;
  has_branchprevious:boolean=false;
  has_branchpresentpage:number=1;
  isLoading = false;
  selectPage:number=10;
  overallCheck:boolean=false;
  intermediateCheck:boolean=false;
  newvalue = []
  sale_date=[]
  productlist:Array<any>=[];
  has_subnext:boolean=true;
  has_subprevious:boolean=false;
  has_subpresentpage:number=1;
  has_prodnext:boolean=true;
  has_prodprevious:boolean=false;
  has_prodpresentpage:number=1;
  assetidList: Array<any>=[];
  // assetsalesValue: any;
  @ViewChild( MatAutocompleteTrigger ) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('branchidInput') subInput: any;
  @ViewChild('branchref') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('fileInput') fileInput:ElementRef;
  @ViewChild('fileInput2') fileInput2:ElementRef;
  @ViewChild('closebutton') closebutton;
  @ViewChild('myCheckbox') private myCheckbox: MatCheckbox;
  @ViewChild('autoasset') matassetidAutocomplete: MatAutocomplete;
  @ViewChild('checkerproduct') matprodAutocomplete: MatAutocomplete;
  ngOnInit(): void {
    this.approveform=this.fb.group({
      'branch':new FormControl(''),
      'code':new FormControl(''),
      'name':new FormControl(''),
      'status':new FormControl(''),
      'asset_id': new FormControl(''),
      'asset_name':new FormControl('')

    });
    this.bulkapproveform=this.fb.group({
      'ApprovalRemarks':new FormControl(''),
     
    });
    this.smsService.getAMBranchdropdown(1,'').subscribe(data=>{
      this.branchList=data['data'];
    });
    this.approveform.get('branch').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.smsService.getAMBranchdropdown(1,value).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.branchList=data['data'];
    });
    
    this.smsService.getAMCassetiddropdown(1,'').subscribe(data=>{
      this.assetidList=data['data'];
    });
    this.approveform.get('asset_id').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.smsService.getAMCassetiddropdown(1,value).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.assetidList=data['data'];
    });
    this.smsService.getAMProductdropdown(1,'','').subscribe(productdata=>{
      this.productlist=productdata['data'];
    });
    this.approveform.get('asset_name').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
    
      switchMap((value:any)=>this.smsService.getAMProductdropdown(1,value,'').pipe(
        finalize(()=>{
          console.log("value=>",value)
          this.isLoading=false;
        })
      ))
      ).subscribe(productdata=>{
        this.productlist=productdata['data'];
      });
    this.getapprovalsummary(this.presentpage,this.selectPage);
    this.smsadminrights();
  }
  uploaddata(data:any){
    this.smsShare.approval_data.next(data);
    this.router.navigate(['sms/smsapproval'])
  }
  sortOrdersap:any;
  sapclr:boolean=false;
  sapclr1:boolean=false;
  getapprovalsummary(pageNumber=this.presentpage, pageSize=this.selectPage){
    if (this.sapclr == true){
      this.sapclr=true;
    }
    else if(this.sapclr1 == true){
      this.sapclr1=true;
    }
    else{
      this.sapclr=true;
      this.sapclr1=false;
    }
    if (this.sortOrdersap != undefined && this.sortOrdersap != null &&this.sortOrdersap != ''){
      this.sortOrdersap=this.sortOrdersap
    }
    else {
      this.sortOrdersap='asce'
    }
    this.overallCheck=false;
    let code:any= this.approveform.get('code').value?this.approveform.get('code').value:'';
    let name:any=this.approveform.get('name').value?this.approveform.get('name').value:'';
    let branch:any=this.approveform.get('branch').value?this.approveform.get('branch').value.id:'';
    let asset_id:any=this.approveform.value.asset_id?this.approveform.value.asset_id:'';
    let asset_name:any=this.approveform.value.asset_name?this.approveform.value.asset_name.id:'';
    let Status={'PENDING':1,'APPROVED':2,'REJECTED':3,'PENDING_FOR_RENEWAL':4,"RENEWAL_APPROVED":5,'EXPIRED':6,'RENEWAL_REJECTED':7};
    let status:any=Status[this.approveform.get('status').value]?Status[this.approveform.get('status').value]:'';
    this.spinner.show();
    this.smsService.getamcapprovalsummarysort('',pageNumber,pageSize,code,name,branch,status,this.sortOrdersap,asset_id,asset_name).subscribe(data=>{
      this.spinner.hide();
      this.approvalList=data['data'];
      if(this.approvalList.length>0){
        this.totalcount=this.approvalList[0]['count']
      }
      let pagination:any=data['pagination'];
      this.has_next=pagination.has_next;
      this.has_previous=pagination.has_previous;
      this.presentpage=pagination.index;
    });
  }
  getsapascdec(data,num){
    this.spinner.show();
    this.sortOrdersap=data;
    // this.tocosap=0;
    if (num==1){
      this.sapclr=true;
      this.sapclr1=false;
    }
    if (num==2){
      this.sapclr=false;
    this.sapclr1=true;
    }
    let code:any= this.approveform.get('code').value?this.approveform.get('code').value:'';
    let name:any=this.approveform.get('name').value?this.approveform.get('name').value:'';
    let asset_id:any=this.approveform.value.asset_id?this.approveform.value.asset_id:'';
    let asset_name:any=this.approveform.value.asset_name?this.approveform.value.asset_name.id:'';
    let branch:any=this.approveform.get('branch').value.id?this.approveform.get('branch').value.id:'';
    let Status={'PENDING':1,'APPROVED':2,'REJECTED':3,'PENDING_FOR_RENEWAL':4,"RENEWAL_APPROVED":5,'EXPIRED':6,'RENEWAL_REJECTED':7};
    let status:any=Status[this.approveform.get('status').value]?Status[this.approveform.get('status').value]:'';
    // this.spinner.show();
    this.smsService.getamcapprovalsummarysort('',1,10,code,name,branch,status,this.sortOrdersap,asset_id,asset_name).subscribe(data=>{
      this.spinner.hide();
      this.approvalList=data['data'];
      if(this.approvalList.length>0){
        this.totalcount=this.approvalList[0]['count']
      }
      let pagination:any=data['pagination'];
      this.has_next=pagination.has_next;
      this.has_previous=pagination.has_previous;
      this.presentpage=pagination.index;
    });
  }
  disables(d){
    if(d.status=="APPROVED"||d.status=="REJECTED"||d.status=="RENEWAL APPROVED"||d.status=="EXPIRED"||d.status=="RENEWAL REJECTED"){
      return true;
    }else{
      return false;
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
  has_nextpage(){
    if(this.has_next){
      this.presentpage +=1;
      this.getapprovalsummary(this.presentpage,this.selectPage);
    }
  }
  has_previouspage(){
    if(this.has_previous){
      this.presentpage -=1;
      this.getapprovalsummary(this.presentpage,this.selectPage);
    }
  }
  resetdata(){
    this.approveform.reset();
    this.getapprovalsummary(this.presentpage,this.selectPage);
  }
  amc_war_approval_summary_Download(){
    let code:any= this.approveform.get('code').value?this.approveform.get('code').value:'';
    let name:any=this.approveform.get('name').value?this.approveform.get('name').value:'';
    let asset_id:any=this.approveform.get('asset_id').value?this.approveform.get('asset_id').value:'';
    let asset_name:any=this.approveform.get('asset_name').value?this.approveform.get('asset_name').value.id:'';
    let branch:any=this.approveform.get('branch').value?this.approveform.get('branch').value.id:'';
    let Status={'PENDING':1,'APPROVED':2,'REJECTED':3,'PENDING_FOR_RENEWAL':4,"RENEWAL_APPROVED":5,'EXPIRED':6,'RENEWAL_REJECTED':7};
    let status:any=Status[this.approveform.get('status').value]?Status[this.approveform.get('status').value]:'';
    // this.spinner.show();
    if(this.first == true){
      this.toastr.warning('Already Progress')
      return true
    }
    this.first=true
    this.smsService.getamcwar_approval_summary_DownloadReport_xl(code,name,branch,status,asset_id,asset_name)
    .subscribe(fullXLS=>{
      console.log(fullXLS);
      let binaryData = [];
      binaryData.push(fullXLS)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'AMC_WAR_Approval_Summary_Download'+ date +".xlsx";
      link.click();
      this.first=false;
    },
    (error)=>{
      this.first=false;
      this.toastr.warning(error.description)
    });
  }
  public branchintreface(data?:branch):string | undefined{
    return data?data.code +' - '+data.name:undefined;
  }
  autocompletebranchname(){
    console.log('second');
    setTimeout(()=>{
      if(this.matbranchAutocomplete && this.autocompleteTrigger && this.matbranchAutocomplete.panel){
        fromEvent(this.matbranchAutocomplete.panel.nativeElement,'scroll').pipe(
          map(x=>this.matbranchAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        ).subscribe(
          x=>{
            const scrollTop=this.matbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight=this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight=this.matbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
            if(atBottom){
             if(this.has_branchnext){
               
              this.smsService.getAMBranchdropdown( this.has_branchpresentpage+1,this.approveform.get('branch').value).subscribe((data:any)=>{
                 let dear:any=data['data'];
                 console.log('second');
                 let pagination=data['pagination']
                 this.branchList=this.branchList.concat(dear);
                 if(this.branchList.length>0){
                   this.has_branchnext=pagination.has_next;
                   this.has_branchprevious=pagination.has_previous;
                   this.has_branchpresentpage=pagination.index;
                 }
               })
             }
            }
          }
        )
      }
    })
  }
  getFileDetails_upload(e:any,data:any) {
    this.sms_bulk_upload.pop()
    console.log('q=',data);
    let stringValue = data.split('.')
    if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" ||
    stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "CSV" ) {
    const d:any=new FormData();
    this.sms_bulk_upload[0] = [{'files':[],'images':[],'image':[]}]
    console.log(this.sms_bulk_upload)
    for (var i = 0; i < e.target.files.length; i++) {
      this.sms_bulk_upload[0].files = []
      this.sms_bulk_upload[0].images = [];
      this.sms_bulk_upload[0].image = []
      this.sms_bulk_upload[0].files.push(e.target.files[i].name);
      const reader :any= new FileReader();
      reader.readAsDataURL(e.target.files[i]);
      reader.onload = (_event) => {
      this.sms_bulk_upload[0].files.push(reader.result);
      
      }
      this.file_upload_frmData.append('file',e.target.files[i])
    }
    console.log('form=',this.file_upload_frmData)
    this.sms_bulk_upload[0].image.push(d);
    console.log(this.sms_bulk_upload[0])
    }
    else{
      this.spinner.show("Please Select Valid Excel Format")
      this.spinner.show("Please Select Valid Format (csv,ods,xlsx)")
    }
  }
  submitfileupload(){
    // console.log()
    this.spinner.show();
    if ((this.sms_bulk_upload.length == 0) || (this.sms_bulk_upload == null) || (this.sms_bulk_upload == undefined)){
         
          this.toastr.error('Please Choose File');
          this.spinner.hide();
          return false;
        }
    this.smsService.smsapprovalbulkupload(this.file_upload_frmData).subscribe((result)=>{
      console.log('smsres',result);
      if(result['type']=='application/json'){
        this.spinner.hide();
        // console.log(result['content'])

        this.toastr.error('Please Select Valid Excel Format');
        const reader = new FileReader();
        reader.onload = () => {
          const data:any = reader.result;
          console.log('eerr=',data);//description
          console.log('type=',typeof(data));
          let valid_data:any=JSON.parse(data);
          this.toastr.error(valid_data.description);

        };
        reader.readAsText(result);
        this.fileInput.nativeElement.value='';
      }
      else{

      this.spinner.hide();
  
      console.log('empres',result);
      let binaryData = [];
      binaryData.push(result)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'SMS Maker Bulk Upload Response'+ date +".xlsx";
      link.click();
      this.first = false;
      this.toastr.success("File Uploaded Successfully..");
      // setTimeout(()=>{
      //   this.toastr.success("File Downloaded Successfully..");
      // },2000);
      this.smsbulkuploadform.get('images').patchValue('');
      this.sms_bulk_upload=[];
      this.fileInput.nativeElement.value='';
    };
      
      this.smsbulkuploadform.get('images').patchValue('');
      this.sms_bulk_upload=[];
    },(error)=>{
      this.spinner.hide();
    })
    
     
     

 
 
    
  }
  tranback(){
    this.closebutton.nativeElement.click();

  }
  smsmasterUpload(event:any,data:any){
    console.log(event.target.files.length);
    this.fileformData.append('file',event.target.files[0])
    if (data=='sms_approver_upload'){
  
      if (data==""||data ==undefined || data =="" || data =='' || data ==undefined|| data ==""|| data ==''){
        this.toastr.warning("Please Select The File");
        return false;
      }
    let d:any={
      'type': data
     
    }  
    this.fileformData.append('data',JSON.stringify(d));
    this.spinner.show();
    this.smsService.sms_upload_data(this.fileformData).subscribe(data=>{
      this.spinner.hide()
      if (data.status=='success'){
      // this.spinner.hide()
      this.toastr.success("File Uploaded Successfully..");
      this.fileInput2.nativeElement.value='';
     
      // this.mastermigrationform.get('master_name').patchValue('');
      this.fileformData={}
      }
      if (data.status!='success'){
      
        this.toastr.warning("File is Not Uploaded...");
        this.fileInput2.nativeElement.value='';
      }
    })
   }
 
  }
 

  SMSMakerTemplateDownload(data:any){
    if (data=='sms_approval_template_download'){
      let d:any={
        'type': data
       
      }  
      this.spinner.show()
      this.smsService.getsmsmakertemplateDownload(d).subscribe(fullXLS=>{
        if (fullXLS['type']!='application/json'){
        this.spinner.hide()
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'SMS APPROVAL Template'+ date +".xlsx";
        link.click();
        
        this.toastr.success('Download Successfully...')
        // this.mastermigrationform.get('master_name').patchValue('');
      }
        if (fullXLS['type']=='application/json'){
          this.spinner.hide()
          this.toastr.warning('Download File is not Exists')
    
        }
    })
    }
  

  }
  issmsmakerdownload:Boolean=false;
  smsadminrights(){
    this.spinner.show()
      this.smsService.sms_right('SMS_APPROVER_SUMMARY').subscribe(result=>{
        this.spinner.hide()
        let data=result['data']
         for (let k = 0; k < data?.length; k++){
        if (data[k].role_name=='admin' || data[k].role_name == 'Admin'){
        this.issmsmakerdownload=true;
    }
        
  } 


  })
}
paginationChange(event:any){
  console.log(event);
  console.log(this.selectPage);
  this.getapprovalsummary(this.presentpage, this.selectPage);
}
selectall(event:any){
  console.log(event.checked);
  if (event.checked) {
    this.newvalue=[];
    for(let i=0;i<this.approvalList.length;i++){
      if(this.approvalList[i]['id']!=undefined && this.approvalList[i]['id']!=null && this.approvalList[i]['id']!=""){
        let value:any=this.approvalList[i];
        this.approvalList[i]['con']=true;
        this.newvalue.push({

          'id': value['id'],
  
        });
      }
        
      
     
    };
    this.intermediateCheck=true;
    if(this.newvalue.length==0){
      
      // this.toastr.error("Please Enter TheSale Rate  Least One Data..");
      this.overallCheck=false;
      // this.intermediateCheck=true;
      this.intermediateCheck=false;
      this.myCheckbox.checked = false;
      // return false;
    }
    else if(this.approvalList.length!=this.newvalue.length){
      this.overallCheck=true;
      
      this.intermediateCheck=true;
    }
    else if (this.approvalList.length==this.newvalue.length){
      this.overallCheck=true;
      this.intermediateCheck=false;
    }
  } 
  else {
    this.newvalue=[];
    for(let i=0;i<this.approvalList.length;i++){
      if(this.approvalList[i]['id']!=undefined && this.approvalList[i]['id']!=null && this.approvalList[i]['id']!=""){
        this.approvalList[i]['con']=false;
      }
       
      
     
    }
    if(this.newvalue.length==0){
      this.myCheckbox.checked = false;
      this.overallCheck=false;
      this.intermediateCheck=false;
    }
    else if(this.approvalList.length!=this.newvalue.length){
      this.overallCheck=true;
      this.intermediateCheck=true;
    }
    else if (this.approvalList.length==this.newvalue.length){
      this.overallCheck=true;
      this.intermediateCheck=false;
    }
}

console.log("newvalue=>",this.newvalue);

// console.log('branchshort=>',this.branchshort);
//    console.log('transfer_date=>',this.transfer_date);

}
onCheckboxChange(event, value, index) {
  if (event.currentTarget.checked) {
      this.approvalList[index]['con']=true;
      this.newvalue.push({
        'id': value['id'],
        
      });
      
      this.sale_date.push({
        "id":value['id']
      })
    
  
    // if(this.sale_rate===undefined){
    //   this.toastr.error("please give the sale rate ");
    //   
    //   return false;
    // }
    if(this.newvalue.length==0){
      this.intermediateCheck=false;
      this.overallCheck=false;
    }
    else if(this.newvalue.length==this.approvalList.length){
      this.overallCheck=true;
      this.intermediateCheck=false;
      
    }
    else if(this.newvalue.length!=this.approvalList.length){
      this.overallCheck=false;
      this.intermediateCheck=true;
     
    }
    
  }
  else {
    let value_ind:any=this.newvalue.findIndex((data:any)=>data.assetdetails_id== value['id']);
    this.newvalue.splice(value_ind,1);
    const date_index= this.sale_date.findIndex(date=>date.date == value.capdate);
    this.sale_date.splice(date_index,1);
    this.approvalList[index]['con']=false;
    if(this.newvalue.length==0){
      this.intermediateCheck=false;
      this.overallCheck=false;
    }
    else if(this.newvalue.length==this.approvalList.length){
      this.overallCheck=true;
      this.intermediateCheck=false;
      
    }
    else if(this.newvalue.length!=this.approvalList.length){
      this.overallCheck=false;
      this.intermediateCheck=true;
     
    }
    
  }
  
  
  
 
}
approvedata(){
  if (this.newvalue.length == 0) {
    this.toastr.error('Please Select Any checkbox ');
    return false;
  } 
  if (this.bulkapproveform.get('ApprovalRemarks').value=='' ||this.bulkapproveform.get('ApprovalRemarks').value==""||
  this.bulkapproveform.get('ApprovalRemarks').value ==undefined ||  this.bulkapproveform.get('ApprovalRemarks').value ==null){
    this.toastr.error('Please Enter The Approval Remarks');
    return false;
  }
  let d:any={
   
    "id":this.newvalue,
    "ApprovalRemarks":this.bulkapproveform.get('ApprovalRemarks').value
  }
  this.spinner.show();
    this.smsService.getsmsbulkdataupload(d).subscribe(resulr=>{
      this.spinner.hide();
      if (resulr.status=="success"){
        this.toastr.success(resulr.message);
        this.router.navigate(['sms/smstransaction']);
       

      }
   
      if (resulr.code=="INVALID_DATA" ||resulr.code=="INVALID_FILETYPE"||resulr.code=="INVALID_DATA"||resulr.code=="UNEXPECTED_ERROR"){
      
        this.toastr.error(resulr.description);
        this.router.navigate(['/sms/smsapprovalsummary'])
    }
   
    },
    (error)=>{
      this.toastr.error(error.status+error.statusText);
      this.spinner.hide();
    }
    )
      
  }
  
  autocompletesubname(){
    console.log('second');
    setTimeout(()=>{
      if(this.matassetidAutocomplete && this.autocompleteTrigger && this.matassetidAutocomplete.panel){
        fromEvent(this.matassetidAutocomplete.panel.nativeElement,'scroll').pipe(
          map(x=>this.matassetidAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        ).subscribe(
          x=>{
            const scrollTop=this.matassetidAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight=this.matassetidAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight=this.matassetidAutocomplete.panel.nativeElement.clientHeight;
            const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
            if(atBottom){
             if(this.has_subnext){
               
              this.smsService.getAMCassetiddropdown(this.has_subpresentpage+1,this.approveform.get('category').value).subscribe((data:any)=>{
                 let dear:any=data['data'];
                 console.log('second');
                 let pagination=data['pagination']
                 this.assetidList=this.assetidList.concat(dear);
                 if(this.assetidList.length>0){
                   this.has_subnext=pagination.has_next;
                   this.has_subprevious=pagination.has_previous;
                   this.has_subpresentpage=pagination.index;
                 }
               })
             }
            }
          }
        )
      }
    })
  }
  public assetnameinterface(productdata?:product):string | undefined{
    return productdata?productdata.name:undefined;
  }
  autocompleteproductname(){
    console.log('second');
    setTimeout(()=>{
      if(this.matprodAutocomplete && this.autocompleteTrigger && this.matprodAutocomplete.panel){
        fromEvent(this.matprodAutocomplete.panel.nativeElement,'scroll').pipe(
          map(x=>this.matprodAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        ).subscribe(
          x=>{
            const scrollTop=this.matprodAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight=this.matprodAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight=this.matprodAutocomplete.panel.nativeElement.clientHeight;
            const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
            if(atBottom){
             if(this.has_prodnext){
               
              this.smsService.getAMProductdropdown( this.has_prodpresentpage+1,this.approveform.get('asset_name').name,this.approveform.get('asset_name').id).subscribe((data:any)=>{
                 let dear:any=data['data'];
                 console.log('second');
                 let pagination=data['pagination']
                 this.productlist=this.productlist.concat(dear);
                 if(this.productlist.length>0){
                   this.has_prodnext=pagination.has_next;
                   this.has_prodprevious=pagination.has_previous;
                   this.has_prodpresentpage=pagination.index;
                 }           
               })
             }
            }
          }
        )
      }
    })
  }

}
