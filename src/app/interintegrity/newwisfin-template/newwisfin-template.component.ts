import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { InterintegrityApiServiceService } from '../interintegrity-api-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';  
import { NgxSpinnerService } from 'ngx-spinner';
import { MatRadioButton } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { BrsApiServiceService } from 'src/app/brs/brs-api-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-newwisfin-template',
  templateUrl: './newwisfin-template.component.html',
  styleUrls: ['./newwisfin-template.component.scss']
})
export class NewwisfinTemplateComponent implements OnInit {
  interurl = environment.apiURL
  restformdropfasupload:any
  restformdropcbsupload:any
  uploadedfasFileNames = [];
  userTable: FormGroup;
  userTable1: FormGroup;
  control: FormArray;
  brsformdata: FormGroup;
  brsformdatas: FormGroup;
  fileform:FormGroup;
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
  singleColumn : boolean = false;
  singleColumn1 : boolean = false;
  multiColumns : boolean = false;
  multiColumns1 : boolean = false;
  amount_type: any;
  public defaultValue = 1;
  public defaultValues = 0;
  selectedOption: any;
  checked : any;
  isChecked: boolean = true; 

  columnList: string[] ;
  options = [  { key: +1, value: +1 },  { key: -1, value: -1 }];
  fas_file_name: any;
  cbs_file_name: any;
  uploadedfasFileName: any
  uploadedcbsFileName: any
  header_fas_array: any[]=[]
  header_cbs_array: any[]=[]
  fas_sheet_1: any[]=[]
  cbs_sheet_1: any[]=[]

  addfasFileName: any
  addcbsFileName: any
  fetchWise: any;
  temp_data: any;
  fas_sheet_data: any;
  cbs_sheet_data: any;
  fas_sheet_data_value: any;
  cbs_sheet_data_value: any;
  uploadshow : boolean = false;
  amount_no: any;
  glno_data:any;
  dates_data: any;
  amnt_data:any;
  branchcode_data:any;

  gl_code_data:any;
  date_data:any;
  amount_data:any;
  gl_ccy_code_data:any;
  gl_desc_data:any;
  branch_code_data:any;
  constructor(private fb: FormBuilder, private notification: NotificationService, private interService: InterintegrityApiServiceService,
    private router: Router, config: NgbCarouselConfig, private brsService: BrsApiServiceService,private spinner: NgxSpinnerService,) {}

  ngOnInit(): void {
    this.notification.showInfo('Template Name Not Given!')
    this.touchedRows = [];
    this.userTable = this.fb.group({
      gl_number:null,
      date:null,
      amount:null,
      branchcode:null
    });

      this.userTable1 = this.fb.group({
        gl_code:null,
        date:null,
        amount:null,
        branch_code:null,
        gl_description:null,
        gl_ccy_code:null


    });
    // this.addRow();

    this.brsformdata = this.fb.group({
      // glnumber: null,
      // templatecr: null,
      template_name: null,
      description:null,
      account_id: 1,
      fas_page:null,
      cbs_page:null
    })
    
    this.brsformdatas = this.fb.group({
      // glnumber: null,
      // templatecr: null,
      template_name: null,
      account_id: 1,
    })
    this.fileform = this.fb.group({
     
      file_cbs_upload: null,
      file_fas_upload:null,
      wisefinxl:null
    
    })
    let id=1;
    this.interService.getaccountdata(this.pagination.index)
      .subscribe(result => {
        this.accounts= result['data']
  
  
      })
      let ids = 1;
      this.interService.gettemplates(ids)
        .subscribe(result => {
          this.templates= result['data']
    
    
        })

       


          

  }

  ngAfterOnInit() {
    this.control = this.userTable.get('tableRows') as FormArray;

    const singleC = document.getElementById('SingleColumn');
    const multiC = document.getElementById('multiColumn');

    singleC.addEventListener('change', function() {
      if (singleC.click) {
        console.log("Male radio button selected");
      }
    });
    multiC.addEventListener('change', function() {
      if (multiC.click) {
        console.log("FMale radio button selected");
      }
    });


    // if(this.selectedOption == 1 )
    // {
    //   let newValue : number = 1 ; 
   
    //   this.userTable.get('amount_type').setValue(newValue); 
    //   this.singleColumn = false;
    //   this.multiColumns = true;
    // }
    // else
    // {
    //   let newValue : number = 0 ; 
   
    //   this.userTable.get('amount_type').setValue(newValue); 
    //   this.singleColumn = true;
    //   this.multiColumns = false;
    // }

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
    // if(this.userTable.get('gl_number').value ==undefined || this.userTable.get('gl_number').value =="" || this.userTable.get('gl_number').value ==''||this.userTable.value.grade==undefined || this.userTable.value.grade =="" || this.userTable.value.grade ==''){
    //   this.notification.showError('Please Enter The Account Number');
    //   return false;
    // }

    // if(this.userTable.get('date').value ==undefined || this.userTable.get('date').value =="" || this.userTable.get('date').value ==''){
    //   this.notification.showError('Please Enter The Date');
    //   return false;
    // } 
   
    // if(this.userTable.get('amount').value ==undefined || this.userTable.get('amount').value =="" || this.userTable.get('amount').value ==''){
    //   this.notification.showError('Please Enter The Orderno');
    //   return false;
    // }
    // if(this.userTable.get('branchcode').value ==undefined || this.userTable.get('branchcode').value =="" || this.userTable.get('branchcode').value ==''){
    //   this.notification.showError('Please Enter The Branchcode');
    //   return false;
    // }
    
    let payload = {
    "wisefin" :{
      "template_name":this.brsformdata.get('template_name').value,
       "description":this.brsformdata.get('description').value,
       "gl_number":this.userTable.get('gl_number').value,
        "date": this.userTable.get('date').value, 
        "amount":this.userTable.get('amount').value,
        "branchcode":this.userTable.get('branchcode').value,
    },
    "cbs":{
      "template_name":this.brsformdata.get('template_name').value,
      "gl_code":this.userTable1.get('gl_code').value,
      "date":this.userTable1.get('date').value,
      "amount":this.userTable1.get('amount').value,
      "branch_code":this.userTable1.get('branch_code').value,
      "gl_description":this.userTable1.get('gl_description').value,
      "gl_ccy_code":this.userTable1.get('gl_ccy_code').value,
  
    }
   };
  
  
    //   "gl_number":this.userTable.get('gl_number').value,
    //   "date": this.userTable.get('date').value, 
    //   "amount":this.userTable.get('amount').value,
    //   "branchcode":this.userTable.get('branchcode').value,

    // }

    this.interService.defineTemplates(payload).subscribe(results => {
    this.pagination = results.pagination ? results.pagination : this.pagination;
    if (results.status == 'success') {
        this.notification.showSuccess("Template Created Successfully...")
        this.brsformdata.reset();
        this.userTable.reset();
        this.userTable1.reset();
      }
      else {
        this.notification.showError(results.description)
        return true
      }
    })
  }
  

  goback()
  {
    this.router.navigate(['interintegrity/interintegritymaster'],{state: { showTemplate: true }});  
  }

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
      
      let val : number = 0
      // let newValue : number = parseInt(val); 
      // this.userTable.controls['amount_type']. = newValue;
      this.userTable.get('amount_type').setValue(val); 

      this.multiColumns = true;
      this.singleColumn = false;
      
    }
    else
    {
      if(this.Column_type == "Seperate Column")
    {
      this.singleColumn = true;
      this.multiColumns = false;
      let val : number = 1
      // let newValue : number = parseInt(val); 
      // this.userTable.controls['amount_type']. = newValue;
      this.userTable.get('amount_type').setValue(val); 
    }
    }
  }

  changeColumn(event)
  {
    if(this.userTable.controls['amount_types'].value == 1)
    {
      let val : number = 0
      // let newValue : number = parseInt(val); 
      // this.userTable.controls['amount_type']. = newValue;
      this.userTable.get('amount_type').setValue(val); 
      this.singleColumn = true;
      this.multiColumns = false;
    }
    if(this.userTable.controls['amount_types'].value == 0)
    {
      let newValue : number = 1 ; 
      let vals = "type";
      // this.userTable.controls['amount_type']. = newValue;
      // this.userTable.get('credit_debit').setValue(vals); 
      this.userTable.get('amount_type').setValue(newValue); 
      this.singleColumn = false;
      this.multiColumns = true;

    }
  }

  changeColumn1(event)
  {
    if(this.userTable1.controls['amount_types_s'].value == 0)
    {
      // this.userTable.controls['amount_type'].value  === 1
      let val : number = 1
      // let newValue : number = parseInt(val); 
      // this.userTable.controls['amount_type']. = newValue;
      this.userTable1.get('amount_type_s').setValue(val); 
      this.singleColumn1 = true;
      this.multiColumns1 = false;
    }
    if(this.userTable1.controls['amount_types_s'].value == 1)
    {
      let newValue : number = 0 ; 
      let vals = "type";
      // this.userTable.controls['amount_type']. = newValue;
      // this.userTable.get('credit_debit').setValue(vals); 
      this.userTable1.get('amount_type_s').setValue(newValue); 
      // this.userTable.controls['amount_type'].value  === 0
      this.singleColumn1 = false;
      this.multiColumns1 = false;
    }
  }

  wisefinfileupload(e){
    console.log(e)
    const files = e.target.files[0];
    // this.fas_file_name = files.name
    console.log(this.fas_file_name)
        if (files) {
          const fileExtension = files.name.split('.').pop().toLowerCase();
          if (fileExtension !== 'xlsx') {
            console.error('Invalid file type. Please upload an XLSX file.');
            this.notification.showError("Unsupported file type");
            return;
          }
          this.uploadedfasFileName =files; 
          this.fas_file_name=files.name
          this.fileform.get('file_fas_upload').reset()
        }
       
      }


      cbsfileupload(e){
        console.log(e)
         const files= e.target.files[0];
        //  this.cbs_file_name = files.name
         console.log(this.cbs_file_name)
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
           console.log(this.uploadedfasFileName,this.uploadedcbsFileName)
            if(this.uploadedfasFileName===undefined||this.uploadedcbsFileName===undefined){
              this.notification.showError('Upload both files')
              return
            }
           
            this.spinner.show()
          this.interService.attachmentsubmit(this.uploadedfasFileName,this.uploadedcbsFileName).subscribe(results => {
            // this.fas_sheet_data_value,this.cbs_sheet_data_value
            this.spinner.hide()
          console.log(results,'results')
          let value=results
          if(value){
            this.notification.showSuccess('File uploaded successfully')
          }
          for(let data of value){
            this.header_fas_array=data.fas
            this.header_cbs_array=data.cbs
            this.fas_sheet_1=data.fas_sheet
            this.cbs_sheet_1=data.cbs_sheet
          }
            this.fas_file_name=''
             this.cbs_file_name=''
             this.uploadedfasFileName=undefined
             this.uploadedcbsFileName=undefined
          })
        }
  
        resetDropdowns() {
          this.fileform.get('wisefinxl').reset();
          this.fileform.get('wisefinxl').reset();
        }
  submitsForm1()
  {
    this.interService.defineTemplatesBank(this.brsformdata.value, this.userTable1.value).subscribe(results => {



      this.pagination = results.pagination ? results.pagination : this.pagination;

 
      if (results.status == 'success') {
        // this.notification.showSuccess("Template Created Successfully...")
        this.brsformdata.reset();
        this.userTable1.reset();
      }
      else {
        this.notification.showError(results.description)

      }
    })
  }
  commonsubmit()
  {
    this.submitsForm()
  }     
          clicktoadd(){
            console.log(this.uploadedfasFileName,this.uploadedcbsFileName)
             if(this.uploadedfasFileName===undefined||this.uploadedcbsFileName===undefined){
               this.notification.showError('Upload both files')
               return
             }
             this.spinner.show()
           this.interService.attachmentSsubmit(this.uploadedfasFileName,this.uploadedcbsFileName).subscribe(results => {
             this.spinner.hide()
           console.log(results,'results')
           let value=results['data']
           this.temp_data = value
           this.glno_data=value
           this.date_data = value
           this.amnt_data=value
          this.gl_code_data=value
          this.date_data=value
          this.amount_data=value
          this.branchcode_data=value
          this.branch_code_data=value
          this.gl_ccy_code_data=value
          this.gl_desc_data=value
           console.log("addvalue ===>", value)
           if(value){
             this.notification.showSuccess('File uploaded successfully')
             this.uploadshow=true
           }
           for(let data of value){
             this.header_fas_array=data.fas
             this.header_cbs_array=data.cbs
           }
            //  this.fas_file_name=''
            //   this.cbs_file_name=''
            //   this.uploadedfasFileName=undefined
            //   this.uploadedcbsFileName=undefined
           })
         
         } 
   getFasData(data)
         
  {
    this.fas_sheet_data = data.fas_sheet
    console.log("fas_sheet_data",this.fas_sheet_data)
    for(let data of this.fas_sheet_data){
      this.fas_sheet_data_value=data
      console.log("this.fas_sheet_data_value",this.fas_sheet_data_value)
    }

    // let type of temp_data
  }
  getCbsData(data){
    this.cbs_sheet_data = data.fas_sheet

    console.log("cbs_sheet_data",this.cbs_sheet_data)
    for(let data of this.cbs_sheet_data){
      this.cbs_sheet_data_value=data
      console.log("this.cbs_sheet_data_value",this.cbs_sheet_data_value)
    }
  }
  fasdropdown()
  {
    // let payload = {
    //   "file_fas" : this.fas_file_name,
    //   "file_cbs" : this.cbs_file_name

    // }

    console.log(this.uploadedfasFileName,this.uploadedcbsFileName)
    if(this.uploadedfasFileName===undefined||this.uploadedcbsFileName===undefined){
      this.notification.showError('Upload both files')
      return
    }
    this.spinner.show()
  this.interService.fas_dd(this.uploadedfasFileName,this.uploadedcbsFileName).subscribe(results => {
    this.spinner.hide()
  console.log(results,'results')
  let value=results['data']
  if(value){
    this.notification.showSuccess('File uploaded successfully')
  }
  for(let data of value){
    this.header_fas_array=data.fas
    this.header_cbs_array=data.cbs

  }
    this.fas_file_name=''
     this.cbs_file_name=''
     this.uploadedfasFileName=undefined
     this.uploadedcbsFileName=undefined
  })
    // this.interService.fas_dd(this.fas_file_name,this.cbs_file_name).subscribe(results =>{
    //   console.log(results)
  
    //   this.fetchWise=results['wisefin']
    //   // this.cbs_array=results['cbs']
      
    // })
  }
}

