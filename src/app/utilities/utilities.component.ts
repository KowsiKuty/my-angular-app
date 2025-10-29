import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,Validators,FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Idle } from '@ng-idle/core';
import { data } from 'jquery';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { ShareService } from '../atma/share.service';
import { DataService } from '../service/data.service';
import { ReportserviceService } from '../reports/reportservice.service';
import { NotificationService } from '../service/notification.service';
import { SharedService } from '../service/shared.service';
import { MatRadioChange } from '@angular/material/radio';
import { templateJitUrl } from '@angular/compiler/public_api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
const isSkipLocationChange = environment.isSkipLocationChange

interface pm_type{
  value:string
  id:string
}
@Component({
  selector: 'app-utilities',
  templateUrl: './utilities.component.html',
  styleUrls: ['./utilities.component.scss']
})
export class UtilitiesComponent implements OnInit {
  mobileupdationform: any;
  syncform:FormGroup;
  
  otpflag = false;
  editflag=false;
  count = 100;
  timeout: any;
  login_code: any;
  mobileid: any;
  mobileupdate=false;
  checked=false;
  first=false;
  monosync=false;
  changedmobno = true;
  act_type:any;
  apiexp_page:boolean=false
  micro_sync_page:boolean=false;
  apiexp_form:FormGroup
  postman_type:string[]=['raw','formdata','x-www-form-urlencoded']
  
  constructor(private idle: Idle, public cookieService: CookieService, private dataService: DataService, private formBuilder: FormBuilder, private notification: NotificationService,
    public sharedService: SharedService, private shareService: ShareService, private SpinnerService: NgxSpinnerService,private reportservice:ReportserviceService,
    private router: Router, private route: ActivatedRoute) {
    }

  ngOnInit(): void {
    this.mobileupdationform = this.formBuilder.group({
      code: [''],
      name: [''],
      mobile_number: [''],
      otp: [''],
      id: [''],
      type:['']
    })
    this.syncform = this.formBuilder.group({
      masterid: new FormControl(''),
      name: new FormControl('')
    })
    this.apiexp_form=this.formBuilder.group({
      type:new FormControl(''),
      url:new FormControl('',Validators.pattern(/^(?!\/).*/)),
      raw_data:new FormControl(''),
      name:new FormControl(''),
      password:new FormControl(''),
      header_key:new FormControl('Content-Type'),
      header_value:new FormControl('application/x-www-form-urlencoded'),
      urlencoded_key:new FormControl('grant_type'),
      urlencoded_value:new FormControl('client_credentials'),
      key_list:this.formBuilder.array([
        this.formBuilder.group({
          'key':new FormControl(''),
          'file_text':new FormControl(''),
          'value':new FormControl(''),
          'uploadfile':new FormControl(null)
        })
      ])
    })

    this.mobile_popu()
  }
  mobile_popu() {
    this.otpflag = false;
    const sessionData = localStorage.getItem("sessionData")
    let logindata = JSON.parse(sessionData);
    this.login_code = logindata.code;
    this.getmobilestatus()
  }
  getmobilestatus() {
    this.dataService.getempmobiedata(this.login_code)
      .then((results: any[]) => {
        let datas = results["data"];
        if (datas != {}) {
          this.mobileupdationform.get('mobile_number').setValue(datas.mobile_number);
          this.mobileupdationform.get('code').setValue(datas.code);
          this.mobileupdationform.get('name').setValue(datas.full_name);
          this.mobileupdationform.get('id').setValue(datas.id);
          if(datas.mobile_number == 0 || datas.mobile_number == null || datas.mobile_number == undefined)
          {
            this.act_type="INSERT"
          }
          else
          {
            this.act_type="UPDATE"
          }
          this.editflag = true;
        }
      })
  }

  submitForm() {
    this.dataService.checkmobnoexist({"mobile_number":this.mobileupdationform.value.mobile_number})
    .subscribe((results) => {
      console.log("res",results)
      if(results['MESSAGE'] == 'Not_Exist'){          
        this.mobileupdationform.get('otp').setValue('');
        this.otpflag = false;
        let data = localStorage.getItem("location")
        if (data == 'true') {
          this.notification.showWarning("You are trying to login from outside KVB environment.Kindly access the App via KVB environment and update your mobile number in the xxxxxxxxxx for getting the OTP")
          return false
        }
        if (this.mobileupdationform.value.mobile_number.length == 10) {
          this.count = 35;
          this.timeout = setInterval(() => {
            if (this.count > 0) {
              this.count -= 1;
            } else {
              clearInterval(this.timeout);
            }
          }, 500);
          this.dataService.mobiledatapost(this.mobileupdationform.value)
            .subscribe((results) => {
              let datas = results;
              if (results.id) {
                this.otpflag = true;
                this.mobileid = results.id;
                this.notification.showSuccess("Please enter the 8-digit verification code we sent via SMS:(we want to make sure it's you before update ")
              }
              else {
                this.notification.showWarning('failed')
                this.otpflag = false;
              }
            })
        }
      }
      else
      {
        var answer = window.confirm(results['MESSAGE']);
            if (answer) {
              this.mobileupdationform.get('otp').setValue('');
                this.otpflag = false;
                let data = localStorage.getItem("location")
                if (data == 'true') {
                  this.notification.showWarning("You are trying to login from outside KVB environment.Kindly access the App via KVB environment and update your mobile number in the xxxxxxxxxx for getting the OTP")
                  return false
                }
                if (this.mobileupdationform.value.mobile_number.length == 10) {
                  this.count = 35;
                  this.timeout = setInterval(() => {
                    if (this.count > 0) {
                      this.count -= 1;
                    } else {
                      clearInterval(this.timeout);
                    }
                  }, 500);
                  this.dataService.mobiledatapost(this.mobileupdationform.value)
                    .subscribe((results) => {
                      let datas = results;
                      if (results.id) {
                        this.otpflag = true;
                        this.mobileid = results.id;
                        this.notification.showSuccess("Please enter the 8-digit verification code we sent via SMS:(we want to make sure it's you before update ")
                      }
                      else {
                        this.notification.showWarning('failed')
                        this.otpflag = false;
                      }
                    })
              }
            }
            else {
              return false;
            }  
      }
    })
  }

  updatemobile() {
    var otpdata = { "otp": this.mobileupdationform.value.otp,"type":this.act_type }
    this.dataService.employeemobilenomicro(otpdata, this.mobileid)
      .then(data => {
        if (data['MESSAGE'] == 'SUCCESS') {
          this.notification.showSuccess("Success")
          // this.mobileupdationform.reset()
          this.router.navigate(['utilities/mobileupdate'], { skipLocationChange: isSkipLocationChange })
          this.otpflag = false
          // this.closebutton.nativeElement.click();
        } else {
          this.notification.showWarning(data['MESSAGE'])
          // this.mobileupdationform.reset()
          this.router.navigate(['utilities/mobileupdate'], { skipLocationChange: isSkipLocationChange })
          // this.closebutton.nativeElement.click();
        }
      })
  }
  assetBtn(){
     this.mobileupdate=true;
     this.monosync=false;
     this.apiexp_page=false
     this.micro_sync_page=false;
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  empmonochange()
  {
      this.changedmobno = false
  }
  syncreportBtn(){
    this.mobileupdate=false;
    this.monosync=true;
    this.checked=false;
    this.apiexp_page=false
    this.micro_sync_page=false;
  }
  mstsync_reportdownload(){
    if(this.syncform.get('masterid').value==undefined||this.syncform.get('masterid').value==''){
      this.checked=true;
    }
    if(this.first==true){
      this.notification.showWarning("Already In Process");
      return false;
    }
    else{
      this.first=true;
    }
    this.dataService.mstsync_reportdownload(1).subscribe(fullXLS=>{
      this.first=false;
      if(fullXLS['type']=='application/json'){
        this.notification.showWarning("INVALID DATA");
      }
      else{
      let binaryData = [];
      binaryData.push(fullXLS)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'Master Sync Report'+ date +".xlsx";
      link.click();
      }
    },
    (error)=>{
      this.first=false;
    })
  }
  postmanBtn(){
    this.apiexp_page=true;
    this.mobileupdate=false;
    this.monosync=false;
    this.micro_sync_page=false;
  }

  body_content(){
    this.body_dict=true;
    this.Authorization_dict=false;
    this.header_dict=false;
  }
  header_content(){
    this.header_dict=true;
    this.Authorization_dict=false;
    this.body_dict=false;
  }
  Authorization_content(){
    this.Authorization_dict=true;
    this.header_dict=false;
    this.body_dict=false;
  }

  
  reset_fields() {
    this.apiexp_form.get('raw_data')?.reset('');
    this.apiexp_form.get('url')?.reset('');
    
    const keyListArray = this.apiexp_form.get('key_list') as FormArray;
    keyListArray.clear(); 
  
    keyListArray.push(this.formBuilder.group({
      'key': new FormControl(''),
      'file_text': new FormControl(''),
      'value': new FormControl(''),
      'uploadfile': new FormControl(null)
    }));
    this.response_data=false;
  }
  
  

  text_field:boolean[]=[];
  file_field:boolean[]=[];
  body_dict:boolean=false;
  Authorization_dict:boolean=false;
  header_dict:boolean=false;
  raw_section:boolean=false;
  formdata_section:boolean=false
  urlencoded_section:boolean=false;
  radiochange(event:MatRadioChange,type){
    if(event.value=='raw'){
      this.raw_section=true;
      this.formdata_section=false;
      this.urlencoded_section=false;
    }
    else if(event.value=='formdata'){
      this.formdata_section=true;
      this.raw_section=false;
      this.urlencoded_section=false;
    }else if(event.value=='x-www-form-urlencoded'){
      this.urlencoded_section=true;
      this.formdata_section=false;
      this.raw_section=false;
    }
    // this.reset_fields()
  }
  response_data:any;
  download_checked:boolean=false;
  showPassword:boolean=false;
  


  submit_apiexp() {
  if (!this.apiexp_form.get('type')?.value) {
    this.notification.showWarning('Please Select The Type');
    return false;
  }
  if (!this.apiexp_form.get('url')?.value) {
    this.notification.showWarning('Please Enter the URL');
    return false;
  }

  if (this.apiexp_form.get('type')?.value === "POST") {
    this.Formarray_submit();
  }

  let rawDataValue = this.apiexp_form.get('raw_data')?.value || '';
  let parsedRawData;
  try {
    parsedRawData = rawDataValue ? JSON.parse(rawDataValue) : {};
  } catch (error) {
    this.notification.showError('Invalid JSON in Raw Data');
    return;
  }

  const formData = new FormData();
  formData.append('type', this.apiexp_form.get('type')?.value);
  formData.append('url', this.apiexp_form.get('url')?.value);
  formData.append('raw_data', JSON.stringify(parsedRawData));
  formData.append('user_name',this.apiexp_form.get('name')?.value?this.apiexp_form.get('name')?.value:'');
  formData.append('password',this.apiexp_form.get('password')?.value?this.apiexp_form.get('password')?.value:'');
  formData.append('headers_key',this.apiexp_form.get('header_key')?.value?this.apiexp_form.get('header_key')?.value:'');
  formData.append('headers_value',this.apiexp_form.get('header_value')?.value?this.apiexp_form.get('header_value')?.value:'');
  formData.append('x_key',this.apiexp_form.get('urlencoded_key')?.value?this.apiexp_form.get('urlencoded_key')?.value:'');
  formData.append('x_value',this.apiexp_form.get('urlencoded_value')?.value?this.apiexp_form.get('urlencoded_value')?.value:'');
  formData.append('response_xl','data');

  this.formDataArray.forEach((item, index) => {
    if (item.type === 'file' && item.payload instanceof FormData) {
      formData.append(`file_${index}`, item.payload.get('file')); // Add the file
      formData.append(`file_key_${index}`, item.key); // Add the key
      formData.append(`postman_file_api_${index}`, item.type); // Add the type
    } else if (item.type === 'text') {
      formData.append(`text_key_${index}`, item.key); // Add text key
      formData.append(`text_value_${index}`, item.payload.value); // Add text value
      // formData.append(`postman_text_api_${index}`, item.type); // Add the type
    }
  });

  if(this.download_checked){
    this.SpinnerService.show();
    this.reportservice.apiexplorer_downloadapis(formData).subscribe((res) =>{
      this.SpinnerService.hide();
      if(res['type']=='application/json'){
        this.notification.showError("UNEXPECTED_ERROR");
        this.processResponse(res);
      }
      else{
        console.log(res['type']);
        if(res['type']=="text/csv"){
          let binaryData = [];
          binaryData.push(res)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          let date: Date = new Date();
          link.download = this.apiexp_form.get('url')?.value+ " " + date +".csv";
          link.click();
          this.notification.showSuccess('Excel Download Successfully');
        }
        else{
          let binaryData = [];
          binaryData.push(res)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          let date: Date = new Date();
          link.download = this.apiexp_form.get('url')?.value+ " " + date +".xlsx";
          link.click();
          this.notification.showSuccess('Excel Download Successfully');
        }

      }
        (error) => {
        console.error('Error:', error);
        this.SpinnerService.hide();
        this.notification.showError(error.status + ' ' + error.statusText);
      }
    });
  }
  else{
    this.SpinnerService.show();
    this.reportservice.apiexplorer(formData).subscribe((res) =>{
        console.log('Response:', res);
        this.SpinnerService.hide();
        this.processResponse(res);
      },
      (error) => {
        console.error('Error:', error);
        this.SpinnerService.hide();
        this.notification.showError(error.status + ' ' + error.statusText);
      }
    );
  }
  
  
}
excel_download(){
  if (!this.apiexp_form.get('type')?.value) {
    this.notification.showWarning('Please Select The Type');
    return false;
  }
  if (!this.apiexp_form.get('url')?.value) {
    this.notification.showWarning('Please Enter the URL');
    return false;
  }

  if (this.apiexp_form.get('type')?.value === "POST") {
    this.Formarray_submit(); 
  }

  let rawDataValue = this.apiexp_form.get('raw_data')?.value || '';
  let parsedRawData;
  try {
    parsedRawData = rawDataValue ? JSON.parse(rawDataValue) : {};
  } catch (error) {
    this.notification.showError('Invalid JSON in Raw Data');
    return;
  }

  const formData = new FormData();
  formData.append('type', this.apiexp_form.get('type')?.value);
  formData.append('url', this.apiexp_form.get('url')?.value);
  formData.append('raw_data', JSON.stringify(parsedRawData));
  formData.append('headers_key',this.apiexp_form.get('header_key')?.value?this.apiexp_form.get('header_key')?.value:'');
  formData.append('headers_value',this.apiexp_form.get('header_value')?.value?this.apiexp_form.get('header_value')?.value:'');
  formData.append('x_key',this.apiexp_form.get('urlencoded_key')?.value?this.apiexp_form.get('urlencoded_key')?.value:'');
  formData.append('x_value',this.apiexp_form.get('urlencoded_value')?.value?this.apiexp_form.get('urlencoded_value')?.value:'');
  formData.append('response_xl','excel');

  this.formDataArray.forEach((item, index) => {
    if (item.type === 'file' && item.payload instanceof FormData) {
      formData.append(`file_${index}`, item.payload.get('file')); 
      formData.append(`file_key_${index}`, item.key); 
      formData.append(`postman_file_api_${index}`, item.type); 
    } else if (item.type === 'text') {
      formData.append(`text_key_${index}`, item.key); 
      formData.append(`text_value_${index}`, item.payload.value); 
    }
  });
  console.log("datas",formData)
  this.SpinnerService.show();
  this.reportservice.exceldownload(formData).subscribe(res=>{
    this.SpinnerService.hide();
    if(res['type']=='application/json'){
      this.notification.showError("UNEXPECTED_ERROR");
    }
    else{
      let binarydata=[];
      binarydata.push(res);
      let downloadUrl= window.URL.createObjectURL(new Blob(binarydata));
      let link=document.createElement('a');
      link.href =downloadUrl;
      let date:Date=new Date();
      link.download ="RESPONSE_DOWNLOAD "+date+".xlsx"
      link.click();
      this.notification.showSuccess('Excel Download Successfully'); 
      
    }
  })

}
checkboxchange(event){
  this.download_checked=event.checked
  console.log('checkboxstate:',event)
}
password_view(event){
  this.showPassword=event.checked
  console.log(event)
}
  excel_dwn_btn:boolean=false;
  processResponse(res: any) {
    if (res.status && res.message) {
      this.response_data = {
        status: res.status,
        message: res.message
      };
      this.excel_dwn_btn=false;
    }
    else if (res.description && res.code) {
      this.response_data = {
        code:res.code,
        description: res.description,
        url:res.url
      };
      this.excel_dwn_btn=false;
    }
    else if(res.http_code){
      this.response_data= res;
      this.excel_dwn_btn=false;
    }
    else if(res.DATAS){
      this.response_data = res.DATAS
      this.excel_dwn_btn=true;
    }
    else {
      this.response_data = {
        type: 'unknown',
        data: res.DATA
      };
      this.excel_dwn_btn=false;
    }
  }
 

  text_or_dropdown(event,i){
    if(event.value == 'text'){
      this.text_field[i]=true;
      this.file_field[i]=false;
    }
    else if(event.value == 'file'){
      this.file_field[i]=true;
      this.text_field[i]=false;      
    }
    else{
      this.text_field[i]=false;
      this.file_field[i]=false;
    }    
  }
  addRow(): void {
    (this.apiexp_form.get('key_list')as FormArray).push(
      this.formBuilder.group({
        'key':new FormControl(''),
        'file_text':new FormControl(''),
        'value':new FormControl(''),
        'uploadfile':new FormControl('')
       

      })

    )
    this.text_field.push(false); 
    this.file_field.push(false);


  }
  get key_list() {
    return this.apiexp_form.get('key_list') as FormArray;
  }


  
  onFilechange(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const control = this.key_list.at(index).get('uploadfile');
      if(control){
        control.setValue(file); 
      }
    }
  }

  remove(index:number){
    (this.apiexp_form.get('key_list')as FormArray).removeAt(index);
    this.text_field.splice(index, 1);
    this.file_field.splice(index, 1);
  }
  formDataArray:any[]=[]
  

  Formarray_submit() {
    this.formDataArray = [];
  
    const keyListArray = (this.apiexp_form.get('key_list') as FormArray).getRawValue();
  
    keyListArray.forEach((item, index) => {
      if (item.file_text === 'file' && item.uploadfile instanceof File) {
        const filePayload = new FormData();
        filePayload.append('file', item.uploadfile);
        filePayload.append('index', index.toString()); 
        filePayload.append('key', item.key); 
        filePayload.append('type', item.file_text); 
  
        this.formDataArray.push({
          index,
          key: item.key,
          type: item.file_text,
          payload: filePayload, 
        });
      } else if (item.file_text === 'text') {
        this.formDataArray.push({
          index,
          key: item.key,
          type: item.file_text,
          payload: {
            value: item.value, 
          },
        });
      } else {
        console.warn(`Invalid data at index ${index}`);
      }
    });
  
    console.log('Processed FormDataArray:', this.formDataArray);
  }
  shouldHighlight: boolean = true;
  toggleHighlight() {
  this.shouldHighlight = !this.shouldHighlight;
  }

  microsynctab(){
    this.apiexp_page=false;
    this.mobileupdate=false;
    this.monosync=false;
    this.micro_sync_page=true;
  }
  empsync_btn:boolean=false;
  branchsync_micro(){
    this.SpinnerService.show();
    this.reportservice.branchsyncapi().subscribe(res=>{
      if(res['status']=='success'){
        this.SpinnerService.hide();
        this.notification.showSuccess(res.message);
      }
      else{
        this.SpinnerService.hide();
        this.notification.showWarning(res.description)
      }
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
      this.SpinnerService.hide();
    })
  }
  empsync_micro(){
    this.SpinnerService.show();
    this.reportservice.empsyncapi().subscribe(res=>{
      if(res['status']=='success'){
        this.SpinnerService.hide();
        this.notification.showSuccess(res.message);
      }
      else{
        this.SpinnerService.hide();
        this.notification.showWarning(res.description)
      }
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
      this.SpinnerService.hide();
    })
  }

}
