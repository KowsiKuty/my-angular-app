import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { faservice } from '../fa.service';
import { faShareService } from '../share.service';
import { Idle ,DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import { COMMA, E, ENTER } from '@angular/cdk/keycodes';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
const moment = _rollupMoment || _moment;
@Component({
  selector: 'app-fa-reports',
  templateUrl: './fa-reports.component.html',
  styleUrls: ['./fa-reports.component.scss']
})
export class FaReportsComponent implements OnInit {

  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    console.log('welcome',event.code);
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
  regform:any=FormGroup;
  depreciationform:any=FormGroup;
  floatLabelControl = new FormControl('auto');
  date = new FormControl(moment());
  date1: any;
  downloadForecastFlag = true;
  downloadRegularFlag = true;
  query_enb=true;
  regdata:any={};
  prepate:any={};
  querydata:any={};
  fardata:any={};
  reg_q_data:any={};
  gst_q_reports:any={};
  it_q_data:any={};
  gefu_data:any={};
  jw_data:any={};
  min_exp_data:any={};
  exp_data_reports:any={};
  fa_forecas_new:any={}
  isLoading:boolean=false;
  supid:any=0;
  branch:any=0;
  supnamelist:Array<any>=[];
  branchlist:Array<any>=[];
  dataForm:any=FormGroup;
  first:boolean=false;
  four:boolean=false;
  five:boolean=false;
  gefujw:any={"GEFU":1,"JW":2};
  data_query_form:any=FormGroup;
  gefujwform:any=FormGroup;
  table_name_list:Array<any>=[];
  field_name_list:Array<any>=[];
  table_update_enb:boolean=false;
  create_field_list:boolean=false;
  insert_query_list_create:Array<any>=[];
  dump_table_list:Array<any>=[];
  dump_select_list:Array<any>=[];
  dump_field_list:boolean=false;
  visible:boolean = true;
  selectable:boolean = true;
  removable:boolean = true;
  addOnBlur:boolean = true;
  FA_queryfrom:FormGroup;
  selectedType:number=1;
  ExpenseForm:FormGroup;
  entryForm: FormGroup;
  entrydatas: any[] = [];
  expensedatas:any[] =[]
  Subentry:any=[]
  presentpage:any=1;
  has_previous=false;
  has_next=false;
  presentpage1:any=1;
  has_previous1=false;
  has_next1=false;
  fin_year :Date;
  finyear_form: FormGroup;
  fin_minYear = new Date(2000, 0, 1);
  fin_maxYear = new Date(new Date().getFullYear() + 10, 11, 31); 
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  cbs_balance_form:FormGroup;
  constructor( private idletimeout:Idle,private router: Router, private share: faShareService, private http: HttpClient,
    private Faservice: faservice, public datepipe: DatePipe, private toastr:ToastrService, private spinner: NgxSpinnerService, private fb: FormBuilder ) { }

  ngOnInit(): void {
    this.entryForm = this.fb.group({
      'barcode':new FormControl(""),
    
    });
    
    this.ExpenseForm = this.fb.group({
      'crno':new FormControl(""), 
    });
    
  
   
   
    this.gefujwform=new FormGroup({
      'lastdeprundate':new FormControl(""),
      "type":new FormControl("")
    });
    this.depreciationform =new FormGroup({
      'fromdate':new FormControl(),
      'todate':new FormControl(),
    });
    this.regform=new FormGroup({
      'regdate':new FormControl(''),
      'datecast':new FormControl('')
    });
    this.dataForm=this.fb.group({
      'pv_make':new FormControl(""),
      'branch':new FormControl(""),
      'vendorname':new FormControl(""),
      'serialnumber':new FormControl(""),
      'assetId':new FormControl(""),
      'assetrefId':new FormControl(""),
      'crno':new FormControl(""),
      "fromdate":new FormControl(""),
      "todate":new FormControl("")
    });
    this.data_query_form=this.fb.group({
      "proces_name":new FormControl(""),
      "table":new FormControl(""),
      "columnname":new FormControl(""),
      "id":new FormControl(0),
      "value":new FormControl(),
      "jsonData":new FormControl(""),
      "dumptable":new FormControl("")
    })
    this.FA_queryfrom=this.fb.group({
      "fromdate":'',
      "todate":'',
      "gltype":''
    })
    this.cbs_balance_form=this.fb.group({
      "gl_list_amount":this.fb.array([]),
      "vcf":new FormControl(""),
      "l&b":new FormControl(""),
      "f&f":new FormControl("")
    });
    this.gl_amount_init()
    this.Faservice.getassetsuppliername("",1).subscribe(data=>{
      console.log("dd=",data['data']);
      this.supnamelist=data['data'];
      let pagination=data['pagination'];
      if(this.supnamelist.length>0){
        // this.has_nextbuk=pagination.has_next;
        // this.has_previouswbuk=pagination.has_previous;
        // this.presentpagewbuk=pagination.index;
      }
    });
    this.dataForm.get('vendorname').valueChanges.pipe(
      debounceTime(100),
      map(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.Faservice.getassetsuppliername(this.dataForm.get('vendorname').value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      console.log(data);
      this.supnamelist=data['data']
    });
    this.Faservice.getassetbranchdata('',1).subscribe(data=>{
      console.log(data);
      this.branchlist=data['data'];
    })
    this.dataForm.get('branch').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.Faservice.getassetbranchdata( this.dataForm.get('branch').value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      console.log(data);
      this.branchlist=data['data'];
    });
    this.spinner.show();
    this.Faservice.fareportssummary().subscribe(data=>{
      this.spinner.hide();
      if (data.code !=undefined && data.code!=''){
        this.toastr.warning(data['code']);
        this.toastr.warning(data['description']);
      }
      else{
        this.regdata=data['querydata_reg'];
        this.prepate=data['querydata_pre'];
        this.querydata=data['querydata'];
        this.fardata=data['querydata_far'];
        this.reg_q_data=data['querydata_reg_q'];
        this.it_q_data=data['querrdata_it_q']
        this.gefu_data=data['gefu'];
        this.jw_data=data['jw'];
        this.gst_q_reports=data['querydata_file_gstreports'];
        this.min_exp_data=data['querydata_file_minexpreports'];
        this.exp_data_reports=data['querydata_file_expreports'];
        this.fa_forecas_new=data['querydata_file_forecast']
      }
    },
    (error)=>{
      this.spinner.hide();
      this.toastr.error(error.statusText);
    });
    this.gettable_list_data();

    this.finyear_form = this.fb.group({
      'year':''
    });
    this.form_x_download('s')
  }
  regularDownload_q(){
    this.Faservice.getDepreciationRegularDownload_q("Q").subscribe(result=>{
      if(result.type=='application/json'){
        this.toastr.warning("INVALID DATA");
      }
      else{
        let binaryData = [];
        binaryData.push(result)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'RegularReport_Q_'+ date +".xlsx";
        link.click();
        this.toastr.success('Success');
      }
    
    },
    (error:any)=>{
      console.log(error);
      this.toastr.warning(error.status+error.statusText)
      this.spinner.hide();
    })
  }
  It_Dep_Prepare_Q(){
    this.Faservice.preparefile_depreciation().subscribe((result:any)=>{
      if(result.code!=undefined && result.code!="" && result.code!=null){
        this.toastr.warning(result.code);
        this.toastr.warning(result.description);
      }
      else{
        this.toastr.success(result.status);
        this.toastr.success(result.message);
      }
    },
    (error:any)=>{
      console.log(error);
      this.toastr.warning(error.status+error.statusText)
      this.spinner.hide();
    })
  }
  It_Dep_Download_Q(){
    this.Faservice.Downloadfile_depreciation().subscribe((result:any)=>{
      if(result.type=='application/json'){
        this.toastr.warning("INVALID DATA");
        const reader = new FileReader();

        reader.onload = (event: any) => {
          const fileContent = event.target.result;
          // Handle the file content here
          console.log(fileContent);
          let DataNew:any=JSON.parse(fileContent);
          this.toastr.warning(DataNew.code);
          this.toastr.warning(DataNew.description);
        };

        reader.readAsText(result);
      }
      else{
        let binaryData = [];
        binaryData.push(result)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'IT Depreciation Data'+ date +".xlsx";
        link.click();
        this.toastr.success('Success');
      }
    
    },
    (error:any)=>{
      console.log(error);
      this.toastr.warning(error.status+error.statusText)
      this.spinner.hide();
    })
  }
  Gst_Expense_Reports(){
    this.spinner.show();
    this.toastr.warning("Please Wait For 5 Mins..");
    this.Faservice.Gst_expense_reports_prepare().subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!="" && result.code!=null){
        this.toastr.warning(result.code);
        this.toastr.warning(result.description);
      }
      else{
        this.toastr.success(result.status);
        this.toastr.success(result.message);
      }
    },
    (error:any)=>{
      console.log(error);
      this.toastr.warning(error.status+error.statusText)
      this.spinner.hide();
    })
  }
  Gst_Expense_Reports_Download(){
    this.spinner.show();
    this.Faservice.gst_Expense_reports_download("Q").subscribe(result=>{
      this.spinner.hide();
      if(result.type=='application/json'){
        this.toastr.warning("INVALID DATA");
        const reader = new FileReader();

        reader.onload = (event: any) => {
          const fileContent = event.target.result;
          // Handle the file content here
          console.log(fileContent);
          let DataNew:any=JSON.parse(fileContent);
          this.toastr.warning(DataNew.code);
          this.toastr.warning(DataNew.description);
        };

        reader.readAsText(result);
      }
      else{
        let binaryData = [];
        binaryData.push(result)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'FA GST Expense Reports_'+ date +".xlsx";
        link.click();
        this.toastr.success('Success');
      }
    
    },
    (error:any)=>{
      this.spinner.hide();
      console.log(error);
      this.toastr.warning(error.status+error.statusText)
      this.spinner.hide();
    })
  }


  fa_min_Expense_Reports(){
    this.spinner.show();
    this.toastr.warning("Please Wait For 5 Mins..");
    this.Faservice.fa_min_expense_reports_prepare().subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!="" && result.code!=null){
        this.toastr.warning(result.code);
        this.toastr.warning(result.description);
      }
      else{
        this.toastr.success(result.status);
        this.toastr.success(result.message);
      }
    },
    (error:any)=>{
      console.log(error);
      this.toastr.warning(error.status+error.statusText)
      this.spinner.hide();
    })
  }
  fa_min_Expense_Reports_Download(){
    this.spinner.show();
    this.Faservice.fa_min_Expense_reports_download("D").subscribe(result=>{
      this.spinner.hide();
      if(result.type=='application/json'){
        this.toastr.warning("INVALID DATA");
        const reader = new FileReader();

        reader.onload = (event: any) => {
          const fileContent = event.target.result;
          // Handle the file content here
          console.log(fileContent);
          let DataNew:any=JSON.parse(fileContent);
          this.toastr.warning(DataNew.code);
          this.toastr.warning(DataNew.description);
        };

        reader.readAsText(result);
      }
      else{
        let binaryData = [];
        binaryData.push(result)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'FA Minor Expense Reports_'+ date +".xlsx";
        link.click();
        this.toastr.success('Success');
      }
    
    },
    (error:any)=>{
      this.spinner.hide();
      console.log(error);
      this.toastr.warning(error.status+error.statusText)
      this.spinner.hide();
    })
  }


  fa_Expense_Reports(){
    this.spinner.show();
    this.toastr.warning("Please Wait For 5 Mins..");
    this.Faservice.fa_expense_reports_prepare().subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!="" && result.code!=null){
        this.toastr.warning(result.code);
        this.toastr.warning(result.description);
      }
      else{
        this.toastr.success(result.status);
        this.toastr.success(result.message);
      }
    },
    (error:any)=>{
      console.log(error);
      this.toastr.warning(error.status+error.statusText)
      this.spinner.hide();
    })
  }
  fa_Expense_Reports_Download(){
    this.spinner.show();
    this.Faservice.fa_Expense_reports_download("D").subscribe(result=>{
      this.spinner.hide();
      if(result.type=='application/json'){
        this.toastr.warning("INVALID DATA");
        const reader = new FileReader();

        reader.onload = (event: any) => {
          const fileContent = event.target.result;
          // Handle the file content here
          console.log(fileContent);
          let DataNew:any=JSON.parse(fileContent);
          this.toastr.warning(DataNew.code);
          this.toastr.warning(DataNew.description);
        };

        reader.readAsText(result);
      }
      else{
        let binaryData = [];
        binaryData.push(result)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'FA Expense Reports_'+ date +".xlsx";
        link.click();
        this.toastr.success('Success');
      }
    
    },
    (error:any)=>{
      this.spinner.hide();
      console.log(error);
      this.toastr.warning(error.status+error.statusText)
      this.spinner.hide();
    })
  }

  fas_entry_Reports(){
    let fromdate:any=this.datepipe.transform(this.dataForm.get('fromdate').value,'yyyy-MM-dd');
    let todate:any=this.datepipe.transform(this.dataForm.get('todate').value,'yyyy-MM-dd');
    let daata:any={
      "fromdate": fromdate,
      "todate": todate,
      "start": 0,
      "end": 10
  };  
    this.spinner.show();
    // this.toastr.warning("Please Wait For 5 Mins..");
    this.Faservice.fa_entry_reports_check(daata).subscribe((result:any)=>{
      this.spinner.hide();
      if(result.code!=undefined && result.code!="" && result.code!=null){
        this.toastr.warning(result.code);
        this.toastr.warning(result.description);
      }
      else{
        console.log(result['data']);
      }
    },
    (error:any)=>{
      console.log(error);
      this.toastr.warning(error.status+error.statusText)
      this.spinner.hide();
    })
  }

  supnameid(data:any){
    this.supid=data.id;
  }
  branchselect(data:any){
    console.log(data);
    this.branch=data.id;
    // console.log(this.assetmakersum.value);
  }
  resets(){
    this.dataForm.reset();
  }
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  chosenDateHandler(normalizedDate: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.date(normalizedDate.date() - this.date1.getdate());
    this.date.setValue(ctrlValue);
  }
  forecastPrepare(){
    console.log(this.regform.value);
    if(this.regform.get('datecast').value ==undefined || this.regform.get('datecast').value =='' || this.regform.get('datecast').value ==null){
      this.toastr.warning('Please Select The Valid Date');
      return false;
    }
    let date_valid:any=this.regform.get('datecast').value;
    let year:any=date_valid.getFullYear();
    let month:any=date_valid.getMonth()+1;
    this.spinner.show();
    if(this.first==true){
      this.toastr.warning('Already Work In Progress Please Wait');
      return false;
    }
    // console.log(this.idletime);
    this.toastr.warning('Wait for 7 minutes','',{timeOut:1000,progressBar:true})//progressAnimation:'decreasing'420000
    
    this.first=true;
    this.Faservice.getDepreciationForecastPrepare(year,month).subscribe(result=>{
      console.log(result);
      setTimeout(() => {
        /** spinner ends after 3 seconds */
        this.spinner.hide();
        }, 3000);
      alert('Success');
      
    },
    (error:any)=>{
      console.log(error);
      // this.toastr.warning(error.status+error.statusText)
      this.spinner.hide();
    });
    setTimeout(()=>{
      this.first=false;
      this.downloadForecastFlag = false;
      this.toastr.success('Excel Prepared Successfully','',{timeOut:5000});
    },10000);
    console.log('final Ececute');
  }
  forecastDownload(){
    this.Faservice.getDepreciationForecastDownload().subscribe(result=>{
      let binaryData = [];
      binaryData.push(result)
      if (result['type']=='application/json'){
        this.toastr.error('INVALID_DATA')
       }
       else{
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'DetailedReport'+ date +".xlsx";
      link.click();
      this.toastr.success('Success');
       }
    },
    (error:any)=>{
      console.log(error);
      this.toastr.warning(error.status+error.statusText)
      this.spinner.hide();
    })
  }
  gefuprepare(){
    console.log(this.gefujwform.value);
    if(this.gefujwform.get('lastdeprundate').value ==undefined || this.gefujwform.get('lastdeprundate').value =='' || this.gefujwform.get('lastdeprundate').value ==null){
      this.toastr.warning('Please Select The Valid Last Depreciation RUn Date');
      return false;
    }
    let date_valid:any=this.gefujwform.get('lastdeprundate').value;
    let year:any=date_valid.getFullYear();
    let month:any=date_valid.getMonth()+1;
   
    this.spinner.show();
    if(this.four==true){
      this.toastr.warning('Already Work In Progress Please Wait');
      return false;
    }
    // console.log(this.idletime);
    this.toastr.warning('Wait for 7 minutes','',{timeOut:350000,progressBar:true})//progressAnimation:'decreasing'420000
    
    this.four=true;
    this.Faservice.getfagefudata(year,month,1).subscribe(result=>{
      console.log(result);
      this.four=false;
      if (result['code']!=undefined && result['code']!=""){
        this.spinner.hide();
        this.toastr.warning(result['description']);
      }
      else{
        setTimeout(() => {
          /** spinner ends after 3 seconds */
          this.spinner.hide();
          }, 3000);
        alert('Success');
      }
      
      
    },
    (error:any)=>{
      console.log(error);
      this.four=false;
      // this.toastr.warning(error.status+error.statusText)
      this.spinner.hide();
    });
    setTimeout(()=>{
      this.four=false;
      this.toastr.success('Excel Prepared Successfully','',{timeOut:5000});
    },350000);
    console.log('final Ececute');
  }
  gefuDownload(){
    this.Faservice.getfadefudownloadexcel(1).subscribe(result=>{
      let binaryData = [];
      binaryData.push(result)
      if (result['type']=='application/json'){
        this.toastr.error('INVALID_DATA')
       }
       else{
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      let date_d:string=this.datepipe.transform(date, 'yyyy-dd-MM');
      link.download = 'FA_GEFU_REPORTS '+ date_d +".xlsx";
      link.click();
      this.toastr.success('Success');
       }
    },
    (error:any)=>{
      console.log(error);
      this.toastr.warning(error.status+error.statusText)
      this.spinner.hide();
    })
  }
  jwprepare(){
    console.log(this.gefujwform.value);
    if(this.gefujwform.get('lastdeprundate').value ==undefined || this.gefujwform.get('lastdeprundate').value =='' || this.gefujwform.get('lastdeprundate').value ==null){
      this.toastr.warning('Please Select The Valid Last Depreciation RUn Date');
      return false;
    }
    let date_valid:any=this.gefujwform.get('lastdeprundate').value;
    let year:any=date_valid.getFullYear();
    let month:any=date_valid.getMonth()+1;
   
    this.spinner.show();
    if(this.five==true){
      this.toastr.warning('Already Work In Progress Please Wait');
      return false;
    }
    // console.log(this.idletime);
    this.toastr.warning('Wait for 7 minutes','',{timeOut:350000,progressBar:true})//progressAnimation:'decreasing'420000
    
    this.five=true;
    this.Faservice.getfajwdata(year,month,2).subscribe(result=>{
      this.spinner.hide();
      console.log(result);
      this.five=false;
      if (result['code']!=undefined && result['code']!=""){
        this.toastr.warning(result['description']);
      }
      else{
        setTimeout(() => {
          /** spinner ends after 3 seconds */
          this.spinner.hide();
          }, 3000);
        alert('Success');
      }
      
      
    },
    (error:any)=>{
      console.log(error);
      this.five=false;
      // this.toastr.warning(error.status+error.statusText)
      this.spinner.hide();
    });
    setTimeout(()=>{
      this.five=false;
      this.toastr.success('Excel Prepared Successfully','',{timeOut:5000});
    },350000);
    console.log('final Ececute');
  }
  jwDownload(){
    this.Faservice.getfajwdownloadexcel(2).subscribe(result=>{
      let binaryData = [];
      binaryData.push(result)
      if (result['type']=='application/json'){
        this.toastr.error('INVALID_DATA')
       }
       else{
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      let date_d:string=this.datepipe.transform(date, 'yyyy-dd-MM');
      link.download = 'FA_JW_REPORTS '+ date_d +".xlsx";
      link.click();
      this.toastr.success('Success');
       }
    },
    (error:any)=>{
      console.log(error);
      this.toastr.warning(error.status+error.statusText)
      this.spinner.hide();
    })
  }
  regularPrepare(){
    console.log(this.regform.value);
    if(this.regform.get('datecast').value ==undefined || this.regform.get('datecast').value =='' || this.regform.get('datecast').value ==null){
      this.toastr.warning('Please Select The Valid Date');
      return false;
    }
    let date_valid:any=this.regform.get('datecast').value;
    let year:any=date_valid.getFullYear();
    let month:any=date_valid.getMonth()+1;
    this.spinner.show();
    this.toastr.show('Wait for 7 Mins');
    this.Faservice.getDepreciationRegularPrepare(year,month).subscribe(result=>{
      console.log(result);
      setTimeout(() => {
        /** spinner ends after 3 seconds */
        this.spinner.hide();
        }, 3000);
        if (result.code !=undefined && result.code !=''){
          this.toastr.warning(result.code);
          this.toastr.warning(result.description);
        }
        else{
          alert('Success');
      this.downloadRegularFlag = false
        }
      
    },
    (error:any)=>{
      console.log(error);
      this.toastr.warning(error.status+error.statusText)
      this.spinner.hide();
    });
    setTimeout(()=>{
      // this.first=false;
      this.downloadForecastFlag = false;
      this.toastr.success('Excel Prepared Successfully','',{timeOut:5000});
    },10000);
  }
  regularDownload(){
    this.Faservice.getDepreciationRegularDownload().subscribe(result=>{
      let binaryData = [];
      binaryData.push(result);
      if (result['type']=='application/json'){
        this.toastr.error('INVALID_DATA')
       }
       else{
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'RegularReport'+ date +".xlsx";
      link.click();
      this.toastr.success('Success');
       }
    },
    (error:any)=>{
      console.log(error);
      this.toastr.warning(error.status+error.statusText)
      this.spinner.hide();
    })
  }
  querydatadownload(){
    this.toastr.warning('Wait for 7 minutes','',{timeOut:10000,progressBar:true,progressAnimation:'decreasing'});//420000
    this.spinner.show();
    this.Faservice.faquerydataforecastdownload().subscribe(result=>{
      
      // this.spinner.hide();
     
    },
    (error:any)=>{
      this.spinner.hide();
      console.log(error);
  
      this.toastr.warning(error.status+error.statusText);
      this.spinner.hide();
    });
    setTimeout(()=>{
      this.spinner.hide();
      this.query_enb=false;
      this.toastr.success('Success');
     },10000);
      
  }
  querydataforecastdownload(){
    this.spinner.show();
    this.Faservice.querydatadownloadall().subscribe(result=>{
      this.spinner.hide();
      let binaryData = [];
      binaryData.push(result);
      console.log(result['type'])
     
     if (result['type']=='application/json'){
      this.toastr.error('INVALID_DATA')
     }
     else{
      //   console.log(result)
      // console.log(JSON.parse(result))
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'FA-ForecastQueryData'+ date +".xlsx";
      link.click();
      
    }
      
    },
    (error:any)=>{
      this.spinner.hide();
      console.log(error);
      this.toastr.warning(error.status+error.statusText);
      this.spinner.hide();
    });
  }
  kyenbdata(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }
  fardownload(type:any){
    console.log(type);
    if (type=='all'){
      let type=true;
      let postData:any={};
      let dta_post:any='type='+type;
      if (this.dataForm.get('pv_make').value !=undefined && this.dataForm.get('pv_make').value!="" && this.dataForm.get('pv_make').value!=null){
        postData['pv_make']=this.dataForm.get('pv_make').value;
        dta_post=dta_post+'&pv_make='+this.dataForm.get('pv_make').value;
      }
      if (this.dataForm.get('serialnumber').value !=undefined && this.dataForm.get('serialnumber').value!="" && this.dataForm.get('serialnumber').value!=null){
        postData['serialnumber']=this.dataForm.get('serialnumber').value;
        dta_post=dta_post+'&serialnumber='+this.dataForm.get('serialnumber').value;
      }
      if (this.dataForm.get('vendorname').value !=undefined && this.dataForm.get('vendorname').value!="" && this.dataForm.get('vendorname').value!=null){
        postData['vendorname']=this.supid;
        dta_post=dta_post+'&vendorname='+this.supid;
      }
      if (this.dataForm.get('branch').value !=undefined && this.dataForm.get('branch').value!="" && this.dataForm.get('branch').value!=null){
        postData['branch']=this.branch;
        dta_post=dta_post+'&branch='+this.branch;
      }
      if (this.dataForm.get('assetId').value !=undefined && this.dataForm.get('assetId').value!="" && this.dataForm.get('assetId').value!=null){
        postData['assetId']=this.dataForm.get('assetId').value;
        dta_post=dta_post+'&assetId='+this.dataForm.get('assetId').value;
      }
      if (this.dataForm.get('assetrefId').value !=undefined && this.dataForm.get('assetrefId').value!="" && this.dataForm.get('assetrefId').value!=null){
        postData['assetrefId']=this.dataForm.get('assetrefId').value;
        dta_post=dta_post+'&assetrefId='+this.dataForm.get('assetrefId').value;
      }
      if (this.dataForm.get('crno').value !=undefined && this.dataForm.get('crno').value!="" && this.dataForm.get('crno').value!=null){
        postData['crno']=this.dataForm.get('crno').value;
        dta_post=dta_post+'&crno='+this.dataForm.get('crno').value;
      }
      this.spinner.show();
      this.Faservice.fardataprepareall(dta_post).subscribe(result=>{
        this.spinner.hide();
        
        if (result['code'] != undefined && result['code'] != ''){
          console.log(1);
          this.toastr.warning(result['code']);
          this.toastr.warning(result['description']);
        }
        else{
          console.log(2);
          this.toastr.success(result['message']);
          // this.toastr.warning(result['description']);
        }
     
      },
      (error:any)=>{
        this.spinner.hide();
        console.log(error);
        this.toastr.warning(error.status+error.statusText);
        this.spinner.hide();
      });
    }
    else{
    this.spinner.show();
    this.Faservice.fardatadownloadall(false).subscribe(result=>{
      this.spinner.hide();
      let binaryData = [];
      binaryData.push(result);
      console.log(result['type'])
     
     if (result['type']=='application/json'){
      this.toastr.error('INVALID_DATA')
     }
     else{
      //   console.log(result)
      // console.log(JSON.parse(result))
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'FA-Reports_'+ this.datepipe.transform(date,"yyyy-MM-dd") +".xlsx";
      link.click();
      
    }
   
    },
    (error:any)=>{
      this.spinner.hide();
      console.log(error);
      this.toastr.warning(error.status+error.statusText);
      this.spinner.hide();
    });
  }
  }
  movetoassetheaderhistory(){
    console.log(this.regform.value);
    console.log(this.datepipe.transform(this.regform.get('datecast').value,'yyyy-mm-ddd'));
    if(this.regform.get('regdate').value ==undefined || this.regform.get('regdate').value ==null || this.regform.get('regdate').value =='' || this.regform.get('regdate').value ==""){
      this.toastr.warning('Please Select The Valid date');
      return false;
    }
    let datetime_data=this.regform.get('regdate').value;
    let valid_data_move={
      'year':datetime_data.getFullYear(),
      'month':datetime_data.getMonth()+1
    };
    this.spinner.show();
    this.Faservice.assetheaderhistorymove(valid_data_move).subscribe(data=>{
      this.spinner.hide();
      let assetdata=data;
      if(assetdata.code !=undefined || assetdata.description ==''){
        this.toastr.warning(assetdata.code);
        this.toastr.warning(assetdata.description);
      }
      else{
        this.toastr.success(assetdata.status);
        this.toastr.success(assetdata.message);
      }
    },(error)=>{
      this.spinner.hide();
    });
}
changedata(){
  console.log(this.data_query_form.get('proces_name').value);
  let name_change:any=this.data_query_form.get('proces_name').value;
  if(name_change=='Update'){
    this.table_update_enb=true;
    this.create_field_list=false;
    this.dump_field_list=false;
  }
  else if(name_change=='Dump'){
    this.table_update_enb=false;
    this.create_field_list=false;
    this.dump_field_list=true;
    this.gettable_list_data_dump();
  }
  else{
    this.table_update_enb=false;
    this.create_field_list=true;
    this.dump_field_list=false;
    this.gettable_list_data();
    // this.data_query_form.reset("");
  }
}
gettable_list_data(){
  this.spinner.show();
  this.Faservice.orm_table_list_get().subscribe((result:any)=>{
    this.spinner.hide();
    if(result.code!=undefined && result.code!="" && result.code!=null){
      this.toastr.warning(result.code);
      this.toastr.warning(result.description);

    }
    else{
      this.table_name_list=result['data'];
      console.log(this.table_name_list);
    }
  },
 (error:HttpErrorResponse)=>{
  this.spinner.hide();
  this.table_name_list=[];
 } 
  )
}
gettable_list_data_dump(){
  this.spinner.show();
  this.Faservice.orm_table_list_get().subscribe((result:any)=>{
    this.spinner.hide();
    if(result.code!=undefined && result.code!="" && result.code!=null){
      this.toastr.warning(result.code);
      this.toastr.warning(result.description);

    }
    else{
      this.dump_table_list=result['data'];
      console.log(this.table_name_list);
    }
  },
 (error:HttpErrorResponse)=>{
  this.spinner.hide();
  this.dump_table_list=[];
 } 
  )
}


getfield_list_data(){
  if(this.data_query_form.get('table').value==undefined || this.data_query_form.get('table').value==null || this.data_query_form.get('table').value==""){
    this.toastr.warning("Please Select The Valid Table");
    return false;
  }
  let table_name:any=this.data_query_form.get('table').value;
  this.spinner.show();
  this.Faservice.orm_field_list_get(table_name).subscribe((result:any)=>{
    this.spinner.hide();
    if(result.code!=undefined && result.code!="" && result.code!=null){
      this.toastr.warning(result.code);
      this.toastr.warning(result.description);

    }
    else{
      this.field_name_list=result['data'];
      console.log(this.field_name_list);
    }
  },
 (error:HttpErrorResponse)=>{
  this.spinner.hide();
  this.table_name_list=[];
 } 
  )
}
updatedatalist(){
  if(this.data_query_form.get('table').value==undefined || this.data_query_form.get('table').value==null || this.data_query_form.get('table').value==""){
    this.toastr.warning("Please Select The Valid Table");
    return false;
  }
  if(this.data_query_form.get('columnname').value==undefined || this.data_query_form.get('columnname').value==null || this.data_query_form.get('columnname').value==""){
    this.toastr.warning("Please Select The Valid Columns");
    return false;
  }
  if(this.data_query_form.get('value').value==undefined || this.data_query_form.get('value').value==null || this.data_query_form.get('value').value=="" || this.data_query_form.get('value').value==0){
    this.toastr.warning("Please Enter The Value..");
    return false;
  }
  if(this.data_query_form.get('id').value==undefined || this.data_query_form.get('id').value==null || this.data_query_form.get('id').value=="" || this.data_query_form.get('id').value==0){
    this.toastr.warning("Please Enter The Valid Table ID");
    return false;
  }
  let data_paas:any={
    "table":this.data_query_form.get('table').value,
    "field":this.data_query_form.get('columnname').value,
    "value":this.data_query_form.get('value').value,
    "id":this.data_query_form.get('id').value
  }
  this.spinner.show();
  this.Faservice.orm_data_create_query(data_paas).subscribe((result:any)=>{
    this.spinner.hide();
    if(result.code!=undefined && result.code!="" && result.code!=null){
      this.toastr.warning(result.code);
      this.toastr.warning(result.description);
    }
    else{
      this.toastr.success(result.message);
      this.data_query_form.reset("");
    }
  },
  (error:HttpErrorResponse)=>{
    this.spinner.hide();
  
  }
  )
}

getfield_list_data_insert(){
  if(this.data_query_form.get('table').value==undefined || this.data_query_form.get('table').value==null || this.data_query_form.get('table').value==""){
    this.toastr.warning("Please Select The Valid Table");
    return false;
  }
  let table_name:any=this.data_query_form.get('table').value;
  this.spinner.show();
  this.Faservice.orm_data_create_insert_query(table_name).subscribe((result:any)=>{
    this.spinner.hide();
    if(result.code!=undefined && result.code!="" && result.code!=null){
      this.toastr.warning(result.code);
      this.toastr.warning(result.description);

    }
    else{
      this.insert_query_list_create=result['data'];
      console.log(this.insert_query_list_create);
    }
  },
 (error:HttpErrorResponse)=>{
  this.spinner.hide();
  this.insert_query_list_create=[];
 } 
  )
}


updatedatalist_create(){
  if(this.data_query_form.get('table').value==undefined || this.data_query_form.get('table').value==null || this.data_query_form.get('table').value==""){
    this.toastr.warning("Please Select The Valid Table");
    return false;
  }
  
  let data_paas:any={
    "table":this.data_query_form.get('table').value,
    "data":this.insert_query_list_create
  }
  console.log(data_paas);
  this.spinner.show();
  this.Faservice.orm_insert_query(data_paas).subscribe((result:any)=>{
    this.spinner.hide();
    if(result.code!=undefined && result.code!="" && result.code!=null){
      this.toastr.warning(result.code);
      this.toastr.warning(result.description);
    }
    else{
      this.toastr.success(result.message);
      this.insert_query_list_create=[];
      this.data_query_form.reset("");
    }
  },
  (error:HttpErrorResponse)=>{
    this.spinner.hide();
  
  }
  )
}
remove(fruit: any): void {
  const index = this.dump_select_list.indexOf(fruit);

  if (index >= 0) {
    this.dump_select_list.splice(index, 1);
  }
}
add(event: MatChipInputEvent): void {
  const input = event.input;
  const value = event.value;

  // Add our fruit
  
    this.dump_select_list.push(value.trim());
  
    input.value = '';
  
}
selected(event: MatAutocompleteSelectedEvent): void {
  let data_exist:any=this.dump_select_list.indexOf(event.option.viewValue);
  console.log(data_exist);
  if (data_exist==-1){
    this.dump_select_list.push(event.option.viewValue);
    // this.fruitInput.nativeElement.value = '';
    this.data_query_form.get("dumptable").setValue("");
  }
  else{
  
  }
  
}
dump_select_table_list_prepare(){
  if(this.dump_select_list.length==0 || this.dump_select_list ==undefined || this.dump_select_list==null){
    this.toastr.warning("Please Select The Valid Tables");
    return false;
  }
  
  let data_paas:any={
    table_list:this.dump_select_list
  }
  console.log(data_paas);
  this.spinner.show();
  this.Faservice.dump_insert_query(data_paas).subscribe((result:any)=>{
    this.spinner.hide();
    if(result.code!=undefined && result.code!="" && result.code!=null){
      this.toastr.warning(result.code);
      this.toastr.warning(result.description);
    }
    else{
      this.toastr.success(result.message);
      
    }
  },
  (error:HttpErrorResponse)=>{
    this.spinner.hide();
  
  }
  )
}
dump_select_table_list_Download(){
 
  
  this.spinner.show();
  this.Faservice.dump_insert_query_download().subscribe((result:any)=>{
    this.spinner.hide();
    this.spinner.hide();
      let binaryData = [];
      binaryData.push(result);
      console.log(result['type'])
     
     if (result['type']=='application/json'){
      // this.toastr.error('INVALID_DATA');
      // this.toastr.warning("INVALID DATA");
      const reader = new FileReader();

      reader.onload = (event: any) => {
        const fileContent = event.target.result;
        // Handle the file content here
        console.log(fileContent);
        let DataNew:any=JSON.parse(fileContent);
        this.toastr.warning(DataNew.code);
        this.toastr.warning(DataNew.description);
      };

      reader.readAsText(result);
     }
     else{
      //   console.log(result)
      // console.log(JSON.parse(result))
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'FA_DUMP_DATA'+ this.datepipe.transform(date,"yyyy-MM-dd") +".zip";
      link.click();
      
    }
  },
  (error:HttpErrorResponse)=>{
    this.spinner.hide();
  
  }
  )
}
select:Date;
previousDate: Date;
fromdateSelection(event: string) {
  const date = new Date(event)
  this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate() )    
}
gltype:string='';
gl_fromdate:string='';
gl_todate:string=''

Downloadquery(){
  console.log(this.gltype,this.gl_fromdate,this.gl_todate);
  let params='&gltype=';
  if(this.gltype=='' || this.gltype== undefined || this.gltype==null){
    this.toastr.warning("Please select the type");
    return false;
  }
  else{
    params+=this.gltype;
  }
  if (this.gl_fromdate=='' || this.gl_fromdate==undefined || this.gl_fromdate== null){
    // this.toastr.warning("Please select the fromdate");
    // return true;
  }
  else{
    params+='&fromdate='+this.datepipe.transform(this.gl_fromdate,'yyyy-MM-dd');
  }
  if (this.gl_todate=='' || this.gl_todate==undefined || this.gl_todate== null){
    // this.toastr.warning("Please select the todate");
    // return true;
  }
  else{
    params+='&todate='+this.datepipe.transform(this.gl_todate,'yyyy-MM-dd');
  }
  this.spinner.show();
  this.Faservice.Fa_querdownloadglbased(params).subscribe(response=>{
    this.spinner.hide();
    if (response['type'] == 'application/json') {
      this.toastr.warning("INVALID DATA");
      const reader = new FileReader();

      reader.onload = (event: any) => {
        const fileContent = event.target.result;
        // Handle the file content here
        console.log(fileContent);
        let DataNew:any=JSON.parse(fileContent);
        this.toastr.warning(DataNew.code);
        this.toastr.warning(DataNew.description);
      };

      reader.readAsText(response);
    }
     else if(response?.code!=undefined && response.code !=null && response.code!=''){
        this.toastr.warning(response?.description);
        return false;
     }
     else{
      let filename:any='FA-Query-'+this.gltype;
      let dataType = response.type;
      let binaryData = [];
      binaryData.push(response);
      let downloadLink:any = document.createElement('a');
      console.log()
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
      
      downloadLink.setAttribute('download',filename);
      document.body.appendChild(downloadLink);
      downloadLink.click();
     }

  },(error:HttpErrorResponse)=>{
    this.spinner.hide();
    this.toastr.warning(error.message+error.status);
  })

}
reset_faquery(type){
  if (type==='gl'){
  this.gltype='';
  this.gl_fromdate='';
  this.gl_todate='';
  }
  else if (type ==='addition' ){
   this.addition_from_date='';
   this.addition_to_date='';
  }
}
entrySearch(type: number) {
  this.selectedType = type;

  let barcodeValue = '';
  let crnoValue = '';

  if (this.selectedType === 1) {
    barcodeValue = this.entryForm.get('barcode')?.value || '';
  } else if (this.selectedType === 2) {
    crnoValue = this.ExpenseForm.get('crno')?.value || '';
  }

  this.spinner.show();

  this.Faservice.getAllEntries(1, this.selectedType, barcodeValue, crnoValue).subscribe(
    (data) => {
      this.spinner.hide(); 

      if (data['code'] && data['code'] !== "") {
        this.toastr.warning(data['code']);
        this.toastr.warning(data['description']);
        return;
      }

      if (this.selectedType === 1) {
      
        this.entrydatas = data['data'];
        const pagination = data['pagination'];
        if (this.entrydatas.length > 0) {
          this.has_next = pagination.has_next;
          this.has_previous = pagination.has_previous;
          this.presentpage = pagination.index;
        }
      } else if (this.selectedType === 2) {
        
        this.expensedatas = data['data'];
        const pagination = data['pagination'];
        if (this.expensedatas.length > 0) {
          this.has_next1 = pagination.has_next;
          this.has_previous1 = pagination.has_previous;
          this.presentpage1 = pagination.index;
        }
      }
    },
    (error) => {
      this.spinner.hide(); 
      console.error(error); 
    }
  );
}

entryresetasset(){
  this.entryForm.reset('');
  this.entrydata(1);
  this.selectAll=false;
}
expenseentryreset(){
  this.ExpenseForm.reset('');
  this.entrydata(2);
  this.selectAll=false;
}
entrydata(type:number){
  this.selectedType = type;

  let barcodeValue = '';
  let crnoValue = '';

  if (this.selectedType === 1) {
    barcodeValue = this.entryForm.get('barcode')?.value || '';
  } else if (this.selectedType === 2) {
    crnoValue = this.ExpenseForm.get('crno')?.value || '';
    console.log('CRNO Value:', crnoValue);
  }

  this.spinner.show();

  this.Faservice.getAllEntries(1, this.selectedType, barcodeValue, crnoValue).subscribe(
    (data) => {
      this.spinner.hide();

     
      if (data['code'] != null && data['code'] !== "") {
        this.toastr.warning(data['code']);
        this.toastr.warning(data['description']);
      } else {
        if (this.selectedType === 1) {
        
          this.entrydatas = data['data'];
          let pagination = data['pagination'];

          if (this.entrydatas.length > 0) {
            this.has_next = pagination.has_next;
            this.has_previous = pagination.has_previous;
            this.presentpage = pagination.index;
          }
        } else if (this.selectedType === 2) {
          
          this.expensedatas = data['data'];
          let pagination = data['pagination'];

          if (this.expensedatas.length > 0) {
            this.has_next1 = pagination.has_next;
            this.has_previous1 = pagination.has_previous;
            this.presentpage1 = pagination.index;
          }
        }
      }
    },
    (error) => {
      this.spinner.hide();
      console.error(error);
    }
  );
}
nextClick() {
  if (this.has_next === true) {
  this.presentpage=this.presentpage+1;
this.entrydata(this.selectedType);
  }
}
previousClick() {
  if (this.has_previous === true) {
this.presentpage=this.presentpage-1;
this.entrydata(this.selectedType)
  }
}
nextClick1() {
  if (this.has_next1 === true) {
  this.presentpage1=this.presentpage1+1;
this.entrydata(this.selectedType);
  }
}
previousClick1() {
  if (this.has_previous1 === true) {
this.presentpage1=this.presentpage1-1;
this.entrydata(this.selectedType)
  }
}
onRadioChange(selectedValue: number) {
  this.selectedType = selectedValue;
  console.log('Selected Type:', this.selectedType);
 
    this.entrydata(this.selectedType)
}
toggleAllSelection(event: any): void {
  const isChecked = event.target.checked; 
  this.entrydatas.forEach(entry => {
    entry.selected = isChecked; 
    if (isChecked) {
      this.assetselectedEntries.push(entry);
    } else {
      const index = this.assetselectedEntries.indexOf(entry);
      if (index > -1) {
        this.assetselectedEntries.splice(index, 1);
      }
    }
    
  });
  this.selectAll = isChecked;
}
toggleAllSelection1(event: any): void {
  const isChecked = event.target.checked; 
  this.expensedatas.forEach(entry => {
    entry.selected = isChecked; 
    if (isChecked) {
      this.expeneselectedEntries.push(entry);
    } else {
      const index = this.expeneselectedEntries.indexOf(entry);
      if (index > -1) {
        this.expeneselectedEntries.splice(index, 1);
      }
    }
    
  });
  this.selectAllexp = isChecked;
}

assetselectedEntries: any[] = [];
selectAll: boolean = false;
selectAllexp: boolean = false;
toggleSelection(entry: any): void {
  const index = this.assetselectedEntries.indexOf(entry);
  if (index > -1) {
    this.assetselectedEntries.splice(index, 1);
  } else {
    this.assetselectedEntries.push(entry);
  }
  this.selectAll = this.entrydatas.length === this.assetselectedEntries.length;
}
expeneselectedEntries: any[] = [];
toggleSelection1(Expense: any): void {
  const index = this.expeneselectedEntries.indexOf(Expense);
  if (index > -1) {
    this.expeneselectedEntries.splice(index, 1);
  } else {
    this.expeneselectedEntries.push(Expense);
  }
  this.selectAllexp = this.expensedatas.length === this.expeneselectedEntries.length;
}

// exist(entry: any): boolean {
//   return this.selectedEntries.includes(entry); 
// }
repostEntry() {
  let selectedEntries = this.entrydatas.filter(entry => entry.selected);
  let type='?type='+1;
  if (selectedEntries.length === 0) {
    this.toastr.warning('No entries selected.');
    return;
  }
  let selected_id=selectedEntries.map(id=>id.id)

  this.spinner.show();
  this.Faservice.RepostEntry(type,{ assetdetails_id: selected_id }).subscribe(res=>{
    
  this.spinner.hide();
      if (res.code !='' && res?.code !=undefined && res.code!=null){
        this.toastr.warning(res.code);
        this.toastr.warning(res?.description);
      }
      else{
        this.toastr.success(res.message);
        this.ExpenseForm.reset('');
        this.entryForm.reset('');
        this.selectAll = false;
        this.selectAllexp = false;
        this.entrydata(this.selectedType);
      }
  }
   
  )}
repostEntry1() {

  let selectedEntries = this.expensedatas.filter(expense => expense.selected);



  if (selectedEntries.length === 0) {
    this.toastr.warning('No entries selected.');
    return;
  }
  let selected_id=selectedEntries.map(id=>id.id)
  let type='?type='+2;
  this.spinner.show();
  this.Faservice.RepostEntry(type,{ exp_entry_id: selected_id }).subscribe(
    res=>{
      this.spinner.hide();
      if (res.code !='' && res?.code !=undefined && res.code!=null){
        this.toastr.warning(res.code);
        this.toastr.warning(res?.description);
      }
      else{
        this.toastr.success(res.message);
      }
  }
  );
}
expandentrydata(index){
  this.entrydatas[index]['sub_enb']=!this.entrydatas[index]['sub_enb'];
 }
 expandentrydata1(index){
  this.expensedatas[index]['sub_enb']=!this.expensedatas[index]['sub_enb'];
 }
entryFailed(){
  this.entrydata(this.selectedType=1);
}
forecast_dowload(type:string){
  this.spinner.show();
    this.Faservice.farreport_download((type==='p' ||type==='P' )?'p':'d').subscribe(res=>{
      this.spinner.hide();
      if (type==='p' ||type==='P' ){
        if (res?.code!='' && res?.code!=undefined && res?.code!=null){
          this.toastr.warning(res?.code);
          this.toastr.warning(res?.description);
        }
        else{
            this.toastr.success("Prepared Sucessfully");
        }
      }
      else{
        if(res?.type=='application/json'){
          this.toastr.warning("INVALID DATA");
          const reader = new FileReader();
  
          reader.onload = (event: any) => {
            const fileContent = event.target.result;
            // Handle the file content here
            console.log(fileContent);
            let DataNew:any=JSON.parse(fileContent);
            this.toastr.warning(DataNew.code);
            this.toastr.warning(DataNew.description);
          };
  
          reader.readAsText(res);
        }
        else{
          let binaryData = [];
          binaryData.push(res)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          let date: Date = new Date();
          link.download = 'FAR_Reports_'+ date +".xlsx";
          link.click();
          this.toastr.success('Success');
        }
      }
     

    },
      (error)=>{
        this.spinner.hide();
        this.toastr.warning(error.status);
      }
    )
}
formx_summary_name:string;
formx_summarydate:string
  form_x_download(type) {
    // this.spinner.show();
    if (type === 'p' || type === 'p') {
      var data = 'type=p' + '&lb_co=' + this.l_b_co + '&lb_brn=' + this.l_b_brn + '&ff_co=' + this.f_f_co + '&ff_brn=' 
      + this.f_f_brn + '&vch_brn=' + this.vch_brn + '&vch_co=' + this.vch_co;

      if (this.l_b_brn == 0 || this.l_b_brn == 0 ) {
        this.toastr.warning("Please enter the value for L&B Branches and Co");
        return false;
      }
      else if(this.vch_brn == 0 || this.vch_co == 0){
        this.toastr.warning("Please enter the value for VCH Branches and Co");
        return false;
      }
      else if (this.f_f_co == 0 || this.f_f_brn == 0){
        this.toastr.warning("Please enter the value for F&F Branches and Co");
        return false;
      }
      this.spinner.show();
    }
    else if(type == 'd' || type == 'D'){
      this.spinner.show();
    }

    this.Faservice.form_x_report_download(data, type).subscribe(result => {
      this.spinner.hide();

      if (type === 'p' || type === 'P') {
        if (result.code != null && result?.code != undefined && result?.code != '') {
          this.toastr.warning(result?.code);
          this.toastr.warning(result?.description);
        }
        else {
          this.toastr.success(result?.status);
          this.toastr.success(result?.message);
        }
      }
      else if (type === 'd' || type === 'D') {
        if (result?.type == 'application/json') {
          this.toastr.warning("Invalid Data");
        }
        let binaryData = [];
        binaryData.push(result);
        let formx_dowloadurl = window.URL.createObjectURL(new Blob(binaryData));
        let formx_link = document.createElement('a');
        formx_link.href = formx_dowloadurl;
        let date = new Date();
        formx_link.download = "Form_X-" + date + '.xlsx';
        formx_link.click();
        this.toastr.success('Success');
      }
      else {
        let summary = result;
        this.formx_summary_name = summary?.filename;
        this.formx_summarydate = summary?.created_date

      }

    }, (error: HttpErrorResponse) => {
      this.spinner.hide();
      this.toastr.warning(error.status + error.message);
    })
    // }

  }



fin_todate:Date;
fin_fromdate:Date;

from_fin_YearSelected(event){
  let date = new Date(event)  
  this.fin_minYear = new Date(date.getFullYear(),date.getMonth(),date.getDate());
  this.finyear_form.patchValue({'year':this.fin_year});
  console.log("form_group",this.finyear_form)
  console.log("form_group",this.finyear_form.get('year'));
  console.log(this.fin_year);
  // datepicker.close();


}


cbs_gl =[{category:"L&B",gl:"175000100",branch:"Co"},
        {category:"L&B",gl:"175000200",branch:"Co"},
        {category:"L&B",gl:"175000300",branch:"Co"},
        {category:"L&B",gl:"175000400",branch:"Co"},
        {category:"L&B",gl:"175000500",branch:"Co"},
        {category:"L&B",gl:"175000600",branch:"Co"},
        {category:"L&B",gl:"175000700",branch:"Co"},
        {category:"L&B",gl:"175001600",branch:"Co"},
        {category:"L&B",gl:"175001500",branch:"Branch"},
        {category:"VCH",gl:"175001300",branch:"Co"},
        {category:"VCH",gl:"175001400",branch:"Branch"},
        {category:"F&F",gl:"176000100",branch:"Co"},
        {category:"F&F",gl:"176000200",branch:"Branch"},
    
      ]
      getRowSpanaclasss(index: number): number {
        let currentCategory = this.cbs_gl[index].category;
        let span = 1;
        for (let i = index + 1; i < this.cbs_gl.length; i++) {
          if (this.cbs_gl[i].category === currentCategory) {
            span++;
          } else {
            break;
          }
        }
        return span;
      }
      getRowSpanabrn(index: number): number {
        let currentBranch = this.cbs_gl[index].branch;
        let span = 1;
        for (let i = index + 1; i < this.cbs_gl.length; i++) {
          if (this.cbs_gl[i].branch === currentBranch && this.cbs_gl[i].category == this.cbs_gl[index].category) {
            span++;
          } else {
            break;
          }
        }
        return span;
      }



shouldShowCategory(index): boolean {
  if (index === 0) return true;
  return this.cbs_gl[index].category !== this.cbs_gl[index - 1].category;
}
shouldShowbranch(index): boolean {
  if (index === 0) return true;
  return this.cbs_gl[index].branch !== this.cbs_gl[index - 1].branch;
}
gl_amount_init(){
  // return this.cbs_balance_form.get('gl_list_amount') as FormArray
  let gl_list = this.cbs_balance_form.get('gl_list_amount') as FormArray;
  this.cbs_gl.forEach(()=>gl_list.push(this.fb.control(0)));
}
get gl_list_amount(): FormArray {
  return this.cbs_balance_form.get('gl_list_amount') as FormArray;
}
l_b_co:number=0;
l_b_brn:number=0;
vch_co:number=0;
vch_brn:number=0;
f_f_co:number=0;
f_f_brn:number=0;
get_amount_cat(gl,i){
  if (gl.category ==="F&F"){
    this.calculateSum(gl.category,gl?.branch)
    console.log(this.f_f_co);
    console.log(this.f_f_brn);
  }
  if(gl.category === "VCH"){
    let vch=this.cbs_balance_form.get('gl_list_amount').value;
    this.calculateSum(gl.category,gl?.branch)
  

  }
  if (gl.category === "L&B"){
    let l_b=this.cbs_balance_form.get('gl_list_amount').value;
    this.calculateSum(gl.category,gl?.branch)
    
  }
}
// cat_amount:number=0;
calculateSum(classes,brn): void {
  let amount = this.cbs_gl
    .map((gl, index) => ((gl.category === classes && gl.branch === brn) ? this.gl_list_amount.at(index).value || 0 : 0))
    .reduce((sum, value) => sum + value, 0);
    if(classes == 'F&F' && brn == 'Co'){
      this.f_f_co =amount.toFixed(2);
    }
    else if (classes == 'F&F' && brn =='Branch'){
      this.f_f_brn =amount.toFixed(2);
    }
    else if (classes == 'L&B' && brn =='Co'){
      this.l_b_co =amount.toFixed(2);
    }
    else if (classes == 'L&B' && brn =='Branch'){
      this.l_b_brn =amount.toFixed(2);
    }
    else if (classes == 'VCH' && brn =='Branch'){
      this.vch_brn =amount.toFixed(2);
    }
    else if (classes == 'VCH' && brn =='Co'){
      this.vch_co =amount.toFixed(2);
    }
}
addition_from_date:string='';
addition_to_date:string='';

get_addition_report(){
  let params:string='';
  if((this.addition_from_date && this.addition_to_date)){
    params += '?from_date='+this.datepipe.transform(this.addition_from_date,'yyyy-MM-dd') + '&to_date='+this.datepipe.transform(this.addition_to_date,'yyyy-MM-dd');
  }
  else{
    this.toastr.error("Please select From date and To date");
    return;
  }
  this.spinner.show();
  this.Faservice.addition_report(params).subscribe(res=>{
    this.spinner.hide();
    if (res.type == 'application/json'){
          this.toastr.warning('Invalid Data');
          return;
    }{
      let binaryData = [];
        binaryData.push(res);
        let formx_dowloadurl = window.URL.createObjectURL(new Blob(binaryData));
        let formx_link = document.createElement('a');
        formx_link.href = formx_dowloadurl;
        let date = new Date();
        formx_link.download = "FA_Addition_Report-" + date + '.xlsx';
        formx_link.click();
        this.toastr.success('Success');

    }
  },(error:HttpErrorResponse)=>{
    this.spinner.hide();
    this.toastr.warning(error.status + error.message);
  })

}

select_add:Date;
previousDate_add: Date;
add_fromdateSelection(event: string) {
  const date = new Date(event)
  this.select_add = new Date(date.getFullYear(), date.getMonth(), date.getDate() )    
}

}

