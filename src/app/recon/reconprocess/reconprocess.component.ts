import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';

import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { BrsApiServiceService } from '../../brs/brs-api-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';  
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { ReconServicesService } from '../recon-services.service';
import { ErrorHandlingServiceService } from 'src/app/service/error-handling-service.service';

@Component({
  selector: 'app-reconprocess',
  templateUrl: './reconprocess.component.html',
  styleUrls: ['./reconprocess.component.scss']
})
export class ReconprocessComponent implements OnInit {


  userTable: FormGroup;
  control: FormArray;
  brsformdata: FormGroup;
  newisefinform: FormGroup;
  newcbsform: FormGroup;
  fileform: FormGroup;
  mode: boolean;
  shownwisefin= false;
  showbnkstmt = false;
  touchedRows: any;
  el: any;
  dragger: any;
  // bgcolor: any = "black";
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  accounts: any;
  templates : any;
  Column_type: string;
  ctypes : string[] = ['Single Column', 'Seperate Column'];
  recon_ars_array : any[] = [{name:'Reconcil',id:0}];
  singleColumn : boolean = false;
  multiColumns : boolean = false;
  amount_type: any;
  public defaultValue = 1;
  public defaultValues = 0;
  uploadedfasFileName: any
  uploadedcbsFileName: any
  header_fas_array: any[]=[]
  header_cbs_array: any[]=[]
  fas_file_name: any;
  cbs_file_name: any;
  fas_form: FormGroup;
  cbs_form: FormGroup;
  wisfinarrayvalidation: boolean=false
  cbsarrayvalidation: boolean=false
   wisefininput_form=new FormControl()
   cbsinput_form=new FormControl()
  showandhide: any;
  temp_field: any;
  reconurl = environment.apiURL;
  resettemplate: any[];

  constructor(private fb: FormBuilder, private notification: NotificationService, private brsService: BrsApiServiceService,
    private router: Router, config: NgbCarouselConfig, private spinner: NgxSpinnerService,private reconserv : ReconServicesService,
  private errorHandler:ErrorHandlingServiceService) {}

  ngOnInit(): void {
    this.notification.showInfo('Upload file for field mappig')
    this.touchedRows = [];
    this.userTable = this.fb.group({
      line_description:null,
      gl_date:null,
      customer_ref_no:null,
      payment_date:null,
      transaction_date:null,
      credit_amount:null,
      debit_amount:null,
      running_balance:null,
      amount:null,
      //mount_type:1,
      credit_name:null,
      debit_name:null,
      source : null,
      category:null,
      gl_doc_no:null,
      user_name:null,
      invoice_no:null,      
      ref_1:1,
      pv_no:null,
      journal_name:null,
      account_description:null,
      amount_type:null,
      credit_debit:null,
      amount_types:null,
      account_number:'',
      branch_code: null
    });
    this.newcbsform=this.fb.group({
      account_number:null,
      branch_code:null,
      narration:null,
      credit_debit:null,
      amount:null,
      transaction_date:null
    })
    // this.addRow();
this.newisefinform=this.fb.group({
  account_number:null,
branch_code:null,
transaction_date:null,
credit_debit:null,
amount:null,
entry_crno:null,
remarks:null,
entry_gid:null,
entry_module:null
})
    this.brsformdata = this.fb.group({
      // glnumber: null,
      // templatecr: null,
      template_name: null,
      account_id: 1,
      description:null,
      recon_ars:null
    })
    this.fileform = this.fb.group({
     
      file_cbs_upload: null,
      file_fas_upload:null
    
    })
    let id=1;
    this.brsService.getaccountdata(id)
      .subscribe(result => {
        this.accounts= result['data']
  
  
      })
      let ids = 1;
      this.brsService.gettemplates(ids)
        .subscribe(result => {
          this.templates= result['data']
    
    
        })

   
        this.fas_form = this.fb.group({
          fas: this.fb.array([])
      });
      this.cbs_form = this.fb.group({
        cbs: this.fb.array([])
    });
      this.temp_field = {
      label: "Template Name",
      method: "get",
      url: this.reconurl + "reconserv/wisefin_template",
      params: "",
      searchkey: "name",
      displaykey: "template_name",
      wholedata: true,   
      required:true  
      }
  }

  ngAfterOnInit() {
    this.control = this.userTable.get('tableRows') as FormArray;

    //   this.el = document.getElementById('tables');

    //   this.dragger = tableDragger(this.el, {
    //    mode: 'free',
    //    dragHandler: '.handle',
    //    onlyBody: true,
    //    animation: 300
    //  });


    //   this.dragger.on('drop',function(from, to){
    //     this.console(from);
    //     this.console(to);
    //   });
  }

  initiateForm(): FormGroup {
    return this.fb.group({
      sno: [null, Validators.required],
      colname: [null, [Validators.required]],
      syscolumnname: [null, [Validators.required]],
      // orderdisplay: [null],
      // comments: [null, [Validators.required]],
      isEditable: [true]
    });
  }

  addRow() {
    const control = this.userTable.get('tableRows') as FormArray;
    control.push(this.initiateForm());
  }

  deleteRow(index: number) {
    const control = this.userTable.get('tableRows') as FormArray;
    control.removeAt(index);
  }

  editRow(group: FormGroup) {
    group.get('isEditable').setValue(true);
  }

  doneRow(group: FormGroup) {
    group.get('isEditable').setValue(false);
  }

  saveUserDetails() {
    console.log(this.userTable.value);
  }

  get getFormControls() {
    const control = this.userTable.get('tableRows') as FormArray;
    return control;
  }

  submitForm() {
    const control = this.userTable.get('tableRows') as FormArray;
    this.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
    console.log(this.touchedRows);
  }

  toggleTheme() {
    this.mode = !this.mode;
    // document.body.style.background = this.bgcolor;
  }
  submitsForm()
  {

    let validation_temp=this.brsformdata.get('template_name').value
    let validation_description=this.brsformdata.get('description').value
    let validation_recon=this.brsformdata.get('recon_ars').value
   if(validation_temp===''||validation_temp===null||validation_temp===undefined){
    this.notification.showError('Enter template name')
    return
   }
   if(validation_description===''||validation_description===null||validation_description===undefined){
    this.notification.showError('Enter description')
    return
   }
   if(validation_recon===''||validation_recon===null||validation_recon===undefined){
    this.notification.showError('Choose template')
    return
   }
   let WISFIn=this.wisefininput_form.value
   if(WISFIn===''||WISFIn===null||WISFIn===undefined){
    this.notification.showError('Enter File 1 Header Name')
    return
   }
   let CBS =this.cbsinput_form.value
   if(this.showandhide!==3){
    if(CBS===''||CBS===null||CBS===undefined){
      this.notification.showError('Enter File 2 Header Name')
      return
     }
   }
 
   let wisfinform=this.newisefinform.value
   if((wisfinform.account_number===null
     && wisfinform.amount===null
     && wisfinform.branch_code===null
     && wisfinform.credit_debit===null
     && wisfinform.entry_crno===null
     && wisfinform.entry_gid===null
     && wisfinform.entry_module===null
     && wisfinform.remarks===null
     && wisfinform.transaction_date===null) &&
     this.fas_form.value.fas.length===0
   ){
     this.wisfinarrayvalidation=false
     this.notification.showError('At least one field needs to be mapped in the Wisefin template');
     return
   }
   else{
     this.wisfinarrayvalidation=true
   }
   for(let x of this.fas_form.value.fas ){
     let isEmpty = false;
 for (const key in x) {
   if (x[key] === '' || x[key] == null) {
     isEmpty = true;
     break;
   }
 }

 if (this.wisfinarrayvalidation===true && isEmpty) {
   this.notification.showError('At least one field needs to be mapped in the Wisefin template');
   return;
 }
   }
 if(this.showandhide!==3){
  let cbsform=this.newcbsform.value
  if(cbsform.account_number===null
    && cbsform.amount===null
    && cbsform.branch_code===null
    && cbsform.credit_debit===null
    && cbsform.narration===null
    && cbsform.transaction_date===null
 
  ){
    this.cbsarrayvalidation=false
    this.notification.showError('At least one field needs to be mapped in the CBS template');
return
  }
  else{
    this.cbsarrayvalidation=true
  }
  for(let x of this.cbs_form.value.cbs ){
    let isEmpty = false;
for (const key in x) {
  if (x[key] === '' || x[key] == null) {
    isEmpty = true;
    break;
  }
}

if (this.cbsarrayvalidation===true && isEmpty) {
  this.notification.showError('At least one field needs to be mapped in the CBS template');
  return;
}
  }
 }
    // console.log(this.newisefinform.value,'fasformvalue')
    // console.log(this.newcbsform.value,'cbsformvalue')
    // console.log(this.fas_form.value.fas,'fas')
    // console.log(this.cbs_form.value,'cbs')
    // console.log(this.brsformdata.value,'brsformdata')
    // return
    this.wisefineapi()
    if(this.showandhide!==3){
      this.cbsapi()
    }
    
    
  }
  wisefineapi(){
    this.brsService.defineTemplates(this.brsformdata.value, this.newisefinform.value,this.fas_form.value.fas,this.wisefininput_form.value).subscribe(results => {

      if (results.status == 'success') {
        this.notification.showSuccess("Template Created Successfully...")
        // this.goback()
      
      }
      else {
        this.notification.showError(results.description)

      }
    })
  }
  cbsapi(){
    this.brsService.defineTemplatesBank(this.brsformdata.value, this.newcbsform.value,this.cbs_form.value.cbs,this.cbsinput_form.value).subscribe(results => {
      this.pagination = results.pagination ? results.pagination : this.pagination;
      if (results.status == 'success') {
        this.notification.showSuccess("Template Created Successfully...") 
        // this.goback()
      }
      else {
        this.notification.showError(results.description)
      }
    })
  }

  // goback()
  // {
  //   this.router.navigate(['brs/brsmaster'],{queryParams: {key:'back'},skipLocationChange: true});  
  // }

  // showwisefin()
  // {
  //   this.shownwisefin = true;
  //   this.showbnkstmt = false;
  // }

  // showbnkstmtss()
  // {
  //   this.showbnkstmt = true;
  //   this.shownwisefin = false;
  // }

  inputColumns(event)
  {
    if(this.Column_type == "Single Column")
    {
      this.singleColumn = true;
      
    }
  }

  changeColumn(event)
  {
    if(this.userTable.controls['amount_types'].value == 1)
    {
      let val : number = 1
      // let newValue : number = parseInt(val); 
      // this.userTable.controls['amount_type']. = newValue;
      this.userTable.get('amount_type').setValue(val); 
      this.singleColumn = true;
      this.multiColumns = false;
    }
    if(this.userTable.controls['amount_types'].value == 0)
    {
      let newValue : number = 0 ; 
      let vals = "type";
      // this.userTable.controls['amount_type']. = newValue;
      // this.userTable.get('credit_debit').setValue(vals); 
      this.userTable.get('amount_type').setValue(newValue); 
      this.singleColumn = false;
      this.multiColumns = true;

    }
  }

  wisefinfileupload(e) {
    const file = e.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (fileExtension !== 'xlsx') {
        console.error('Invalid file type. Please upload an XLSX file.');
        this.notification.showError("Unsupported file type");
        return;
      }
      
      this.uploadedfasFileName = file;
      this.fas_file_name = file.name;
      this.fileform.get('file_fas_upload').reset();
    }
  }
  cbsfileupload(e){
    console.log(e)
        const files= e.target.files[0];
        if (files ) {
          const fileExtension = files.name.split('.').pop().toLowerCase();
          if (fileExtension !== 'xlsx') {
            console.error('Invalid file type. Please upload an XLSX file.');
            this.notification.showError("Unsupported file type");
            return;
          }
          this.uploadedcbsFileName =files; 
          this.cbs_file_name=files.name
          this.fileform.get('file_cbs_upload').reset()
        }
       
      }
  deleteFile() {
  
    this.fileform.get('file_fas_upload').reset()
    this.fas_file_name=''
    this.uploadedfasFileName=undefined
  }
  deletecbsFile(){
 
    this.fileform.get('file_cbs_upload').reset()
    this.cbs_file_name=''
    this.uploadedcbsFileName=undefined
  }
  clicktoupload(){
     console.log('this.brsformdata.value...',this.brsformdata)
    console.log(this.uploadedfasFileName,this.uploadedcbsFileName)
    if(this.showandhide===3){
      if(this.uploadedfasFileName===undefined){
        this.notification.showError('Choose File 1')
        return
      }
      this.uploadedcbsFileName=null
    }else{
      if(this.uploadedfasFileName===undefined||this.uploadedcbsFileName===undefined){
        this.notification.showError('Upload both files')
        return
      }
    }
   
    if(!this.brsformdata.value.template_name){
      this.notification.showError('Please Select the Template')
      return
    }
  
    if(!this.brsformdata.value.description){
      this.notification.showError('Please Enter the Occuracy')
      return
    }
  //   this.spinner.show()
  // this.brsService.attachmentsubmit(this.uploadedfasFileName,this.uploadedcbsFileName).subscribe(results => {
  //   this.spinner.hide()
  // console.log(results,'results')
  
  // let value=results['data']
  // if(value){
  //   this.notification.showSuccess('File uploaded successfully')
  // }
  // for(let data of value){
  //   this.header_fas_array=data.fas
  //   this.header_cbs_array=data.cbs
  // }
  //   this.fas_file_name=''
  //    this.cbs_file_name='' 
  //    this.uploadedfasFileName=undefined
  //    this.uploadedcbsFileName=undefined
  // })
   this.spinner.show()
    this.reconserv.download_recon_process(this.uploadedfasFileName,this.uploadedcbsFileName,this.brsformdata.value).subscribe((data :any)=>{
      console.log("dattaa",data)
      this.spinner.hide()   
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
       let date: Date = new Date();
      link.href = downloadUrl;
      link.download = 'Recon'+date+".xlsx"
      link.click();  
        this.fas_file_name=''
     this.cbs_file_name=''
     this.uploadedfasFileName=undefined
     this.uploadedcbsFileName=undefined
      this.resettemplate = [];
      this.brsformdata.reset()
      // }
    }, error => {
      this.spinner.hide();
      this.errorHandler.handleError(error);
      })  

}
fasaddform() {
  let index=this.fas?.length
  const formControlName = 'column'+(index + 1);
  let lessonForm = this.fb.group({
 [formControlName]:['']
  });

  this.fas.push(lessonForm);
  console.log(this.fas)
}
cbsaddform() {
let index=this.cbs?.length
let formControlName='column'+(index+1)
  let lessonForm = this.fb.group({
    [formControlName]:['']
  });

  this.cbs.push(lessonForm);
  
}
get fas() {
  return this.fas_form.get('fas') as FormArray;
}
get cbs() {
  return this.cbs_form.get('cbs') as FormArray;
}
deletefascolumn(i){
  this.fas.removeAt(i);
}
deletecbscolumn(i){
  this.cbs.removeAt(i);
}
resetfunction(formgroup,formcontrolname){
  formgroup.get(formcontrolname).reset()
}
gettemplateid(id){
  this.showandhide=id
  if(id===3){
    this.newcbsform.reset()
    this.cbsinput_form.reset()
  }
}

 tempdatas(e) {
    console.log("template_event", e);
    this.brsformdata.patchValue({
      template_name: e,
    });
  }

// Download(){
//     this.spinner.show()
//     this.reconserv.download_recon_process().subscribe((data :any)=>{
//       console.log("dattaa",data)
//       this.spinner.hide()
//       if(data?.size===91){
//       this.notification.showError("Product not have Additional Fields")
//       return false
//       }  if (data.blob instanceof Blob) {
//       let binaryData = [];
//       binaryData.push(data.blob)
//       let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
//       let link = document.createElement('a');
//        let date: Date = new Date();
//       link.href = downloadUrl;
//       link.download = 'Recon'+date+".xlsx"
//       link.click();  
//       }
//     }, error => {
//       this.spinner.hide();
//       this.errorHandler.handleError(error);
//       })  
// }

}
