import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NotificationService } from '../notification.service';
import { ProofingService } from '../proofing.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShareService } from '../share.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Subscription, interval } from 'rxjs';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
// import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
const datePickerFormat = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

@Component({
  selector: 'app-proofing-upload',
  templateUrl: './proofing-upload.component.html',
  styleUrls: ['./proofing-upload.component.scss'],
  providers: [{ provide: DateAdapter, useClass: PickDateAdapter },
  { provide: MAT_DATE_FORMATS, useValue: datePickerFormat }]
})
export class ProofingUploadComponent implements OnInit {
  @ViewChild("closeaddpopup") closeaddpopup;
  @ViewChild('account') accountscroll: MatAutocomplete;
  @ViewChild('withreportInput')colref_int:any ;
  images: any;
  excel_ac_file:any;
  tempId: any;
  accountid: any;
  finaljson: any;
  uploadForm: FormGroup;
  selectend: Date;
  proofingList: Array<any>;
  uploadFileList: Array<any>;
  AccountList: Array<any>;
  datafetch:any
  ishide:boolean=false
  templateId: number
  total: number;
  templateText: string
  accounts = null;
  select:Date
  isshow:boolean=false
  acceptfiles = { EXCEL: '.xls, .xlsx, .xlsm, .csv', NOTEPAD: '.txt' }
  accountObject;
  subscriptions: Subscription[] = []
  from_date: any;
  to_date: any;
  fetchedData = [];
  previousDate: Date;
  count: any;
  ac_excelform:FormGroup;
  historylist = [];
  chiplist=[];
  chipSelected=[];
  excelupload_acid=[];
  excelupload_tempid=[];
  selectable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  has_previous = true;
  Showuploaddetailsenable:boolean=false;
  file_upload_fieldenable:boolean=true;
  presentpage: number = 1;
  excel_ToUpload: FormData = new FormData();
  Fileuploadsummary:Array<any>=[];
  private RefreshSubscription: Subscription;
  indeterminate:string;
  constructor(
    private notification: NotificationService, private shareservice: ShareService, private spinner: NgxSpinnerService, private share_service: ShareService,
    private datePipe: DatePipe, private proofingService: ProofingService, private renderer: Renderer2, private fb: FormBuilder,
    private router: Router) { }


  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      images: ['', Validators.required],
      from_date: [''],
      to_date: ['']
    });
    this.ac_excelform=this.fb.group({
      accountno:[''],
      from_date:[''],
      ac_ex_images: [''],
      to_date: ['']
      
    })
    let sub1 = this.share_service.accountobject.subscribe(value => {
      this.accountObject = value;
      this.accountObject?.id ? this.getAccountTemplate() : ''
    });
    this.previousDate = new Date();
    this.previousDate.setDate(this.previousDate.getDate() - 1); // set to 7 days ago
    this.share_service.subcriptions.push(sub1)
  }

  getuploaddata($event) {
    // console.log("getuploaddata button is clicked!", $event);
    this.spinner.show();
    this.proofingService.get_uploaddata(this.accountid)
      .subscribe((results: any) => {
        let data = results['data'];
        this.proofingList = data;
        this.spinner.hide()
        // console.log('this.proofingList', this.proofingList)
      })
  }
  fromdateSelection(event: string) {
    // this.showdates=false
    // this.showstartdate=true
    // console.log("fromdate", event)
    const date = new Date(event)
    this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate() )
    this.selectend = this.select
    
    this.uploadForm.patchValue({
      to_date:null
    })
    
  }
  Approve($event) {
    // console.log("Approve button is clicked!", $event);
    let p_json: any = [];
    let accountjson: any = [];
    accountjson.push(this.accountid)
    // console.log('accountjson', accountjson);
    // let x = JSON.stringify(this.accountid)
    // console.log(this.accountid);
    p_json["id"] = accountjson
    // console.log('p_json', p_json);
    this.finaljson = JSON.stringify(Object.assign({}, p_json));
    this.proofingService.approveService(this.finaljson, "Approve")
      .subscribe(res => {
        // console.log("approve", res);
        if (res?.status) {
          this.notification.showSuccess("Uploaded Successfully!");
          this.uploadForm.reset()
        }
        else {
          this.notification.showError(res.description)
        }

      }
      )
  }
  headerarray = []
  dataupload(){
    let from_date = this.datePipe.transform(this.from_date, 'yyyy-MM-dd')
    let to_date = this.datePipe.transform(this.to_date, 'yyyy-MM-dd')
    let accounttype=2
    let params = '?from_date=' + from_date;
    to_date ? params += '&to_date=' + to_date : '';
    this.accountid ? params += '&account_id=' + this.accountid:'';
    accounttype ? params += '&account_type=' + accounttype:'';
    this.proofingService.excelupload(params)
    .subscribe((results: any) => {
      this.spinner.hide()
      if (results?.description) {
        this.notification.showError(results.description)
      }
      else {
        // this.notification.showSuccess('Success...')
        this.isshow=true
      }

    }, (error) => {
      this.spinner.hide()
    })

  }
  excelupload(){
    let from_date = this.datePipe.transform(this.uploadForm.value.from_date, 'yyyy-MM-dd')
    let to_date = this.datePipe.transform(this.uploadForm.value.to_date, 'yyyy-MM-dd')
    let accounttype=1
    let params = '?from_date=' + from_date;
    to_date ? params += '&to_date=' + to_date : '';
    this.accountid ? params += '&account_id=' + this.accountid:'';
    accounttype ? params += '&account_type=' + accounttype:'';
    this.proofingService.excelupload(params)
    .subscribe((results: any) => {
      this.spinner.hide()
      if (results?.description) {
        this.notification.showError(results.description)
      }
      else {
        // this.notification.showSuccess('Success...')
        this.ishide=true
      }

    }, (error) => {
      this.spinner.hide()
    })

  }
  getAccountTemplate() {
    var temp = this.accountObject
    console.log("Account Object", this.accountObject)
    this.accountid = temp.id;
    if (!this.accountid) {
      this.notification.showError('Please Select Account..')
      return false;
    }
    this.templateId = temp?.cbs_template?.id;
    console.log("ID", this.templateId)
    this.templateText = temp.template.file_type.text;
    this.proofingService.getTemplateDetails(temp.template.id)
      .subscribe(response => {
        this.headerarray = response.details;
        this.headerarray.splice(3, 5);
        this.headerarray.push({ sys_col_name: '', column_name: 'Debit', class: 'proofingheaderamount' })
        this.headerarray.push({ sys_col_name: '', column_name: 'Credit', class: 'proofingheaderamount' })
      }
      )
    // console.log("note", this.accountid);
    // console.log("notesss",  this.templateId );
    // console.log("BAAA",temp)

    return this.accountid, this.templateId
  }

  uploadDocument() {
    console.log(this.shareservice.accountobject.value);
    let template_id:any=this.shareservice.accountobject.value;
    let pass_tmp_id:any=template_id?.wisefin_template?.id;
    this.accountid=this.shareservice.accountobject.value?.['id'];
    
    let from_date = this.datePipe.transform(this.uploadForm.value.from_date, 'yyyy-MM-dd');
    if (from_date == '' || from_date == null || from_date == undefined) {
      this.notification.showError("Please select valid from date");
      return false;
    }
    let to_date = this.datePipe.transform(this.uploadForm.value.to_date, 'yyyy-MM-dd');
    if (to_date == '' || to_date == null || to_date == undefined) {
      this.notification.showError("Please select valid to date");
      return false;
    }
    let params = 'fromdate=' + from_date;
    to_date ? params += '&todate=' + to_date : '';
   
   
    if(!this.accountid){
        this.notification.showError("Please select account number");
        return false;
    }
    if(!this.images){
       this.notification.showError("Please select a File");
       return false;
    }
    this.spinner.show();
    this.proofingService.uploadDocument(pass_tmp_id, this.accountid, this.images,params)
      .subscribe((results: any) => {
        this.spinner.hide()
        console.log("UploadFile", results)
        if (results?.description) {
          // this.uploadForm.reset(); 
          this.notification.showError(results.description)
        }
        else {
          if(results?.status==='Success' && results?.message==='Data processing start'){
            this.notification.showSuccess(results?.message);
          }
          else{
          let file = results['data'];
          this.proofingList = file;
          console.log("Results from API", results['data']);
          this.datafetch = results.count;
          let closingbalnce=results.closing_balance;
          // let succes="Number Of Transaction Items Uploaded: '+this.datafetch+'Closing Balance:'+closingbalnce"
          this.notification.showSuccess('Number Of Transaction Items Uploaded: '+this.datafetch+'\n Closing Balance:'+closingbalnce)
          this.ishide=false
          // console.log("UploadFILESList", this.proofingList)
          this.uploadForm.reset();
        }
        }

      }, (error:HttpErrorResponse) => {
        this.spinner.hide();
        this.notification.showWarning(error.status+ error.message)
      })
  }
  filestatus:boolean=false;
  filesummary(page=1){
    // let check=a
    let ac_id:any=this.shareservice.accountobject.value?.['id'];
    if(!ac_id){
      this.notification.showError("Please select the account");
      return false;
    }
    this.spinner.show();
    this.proofingService.summaryreferesh(ac_id,page).subscribe(result=>{
      this.spinner.hide();
      console.log(result);
      if(result.code!=''&& result.code!=null && result.code!=undefined){
        this.notification.showError(result.code);
        this.notification.showError(result.description);
      }
      else{
      this.Fileuploadsummary=result['data'];
      if(this.Fileuploadsummary.length==0){
        this.notification.showWarning("No records found,against you selected account")
      }

      if(this.Fileuploadsummary.length>0){
        let pagination =result['pagination'];
        this.has_next=pagination.has_next;
        this.has_previous=pagination.has_previous;
        this.presentpage=pagination.index
      }
        
      }
    },(error:HttpErrorResponse)=>{
      this.notification.showWarning(error.status + error.statusText);
      this.Fileuploadsummary=[];
    })
  }
  next_page(){
    if(this.has_next==true){
      this.presentpage+=1;
      this.filesummary(this.presentpage);
     }
  }
  previous_page(){
    if(this.has_previous==true){
      this.presentpage-=1;
      this.filesummary(this.presentpage);
     }
  }
  enablefileinfo(){
    this.Showuploaddetailsenable=true;
    this.file_upload_fieldenable=false;
  }
  back(){
    this.Showuploaddetailsenable=false;
    this.file_upload_fieldenable=true;
    this.Fileuploadsummary=[];
  }
//  Autotrigerhandle1(){
//   this.proofingService.autotriger().subscribe(result=>{
//      console.log(result);
//   },(error:HttpErrorResponse)=>{
//     this.notification.showWarning(error.status+error.statusText);
//   });
//  }
filesumaryrefresh(){
  this.RefreshSubscription=interval(20000).subscribe(()=>{
    // this.autotriger();
  })
}
filesumaryrefreshstop(){
  this.RefreshSubscription.unsubscribe();
}
  fileChange(file,data) {
    if(data==='notbulk'){
    this.images = <File>file.target.files[0];
    console.log(this.uploadForm.value.images)
    }
    else if(data==='bulk'){
      this.excel_ac_file = <File>file.target.files[0];
      // this.excel_ToUpload.append('file',<File>file.target.files[0]);
    console.log(this.ac_excelform.value.ac_ex_images);
    console.log(this.excel_ToUpload)
    }
    }
  uploadPreview() {
    let preViewid = this.uploadFileList[0].id
    this.proofingService.uploadPreview(preViewid)
      .subscribe((response: any) => {
        let binaryData = [];
        binaryData.push(response)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "Proofing.xlsx";
        link.click();
      })
  }

  offsetlimit = 30;
  tablescrolled(scrollelement) {
    const limit = this.offsetlimit
    let value = scrollelement.target;

    const offsetHeight = value.offsetHeight;
    const scrollHeight = value.scrollHeight;
    const scrollTop = value.scrollTop;//current scrolled distance
    const upgradelimit = scrollHeight - offsetHeight - 50;


    if (scrollTop > upgradelimit) {
      console.log('bottom')
      this.offsetlimit += limit
    }
  }

  getAccountList(search = false) {
    this.isLoading = true;
    if (search) {
      this.currentpage = 1;
      this.AccountList = []
    }
    this.spinner.show()
    this.proofingService.getAccountList("", "", this.currentpage,'')
      .subscribe((results: any) => {
        this.isLoading = false;
        this.spinner.hide();
        let data = results['data'];
        this.AccountList = this.AccountList.concat(data);
        if (data.length >= 0) {
          this.has_next = results.pagination.has_next;
          // this.has_previous = datapagination.has_previous;
          this.currentpage = results.pagination.index;
        }
      }, error => {
        this.spinner.hide()
      })
  }

  has_next;
  isLoading;
  currentpage = 1;

  scrolled(scrollelement) {
    let value = scrollelement;
    const offsetHeight = value.offsetHeight;
    const scrollHeight = value.scrollHeight;
    const scrollTop = value.scrollTop;//current scrolled distance
    const upgradelimit = scrollHeight - offsetHeight - 10;
    if (scrollTop > upgradelimit && this.has_next && !this.isLoading) {
      this.currentpage += 1;
      this.getAccountList();
    }

  }

  open() {
    // this.accountscroll._getScrollTop.subscribe(() => {
    //   const panel = this.accountscroll.panel.nativeElement;
    //   panel.addEventListener('scroll', event => this.scrolled(event));
    // })
    this.renderer.listen(this.accountscroll.panel.nativeElement, 'scroll', () => {
      // this.renderer.setStyle(this.accountscroll.nativeElement, 'color', '#01A85A');
      let evet = this.accountscroll.panel.nativeElement
      this.scrolled(evet)
    });

  }

  acc_selected(account) {
    console.log(this.accounts)
    this.shareservice.accountobject.next(account.option.value);
  }

  acc_show(element) {
    let value = `${element?.name} :  ${element?.account_number}`
    return element ? value : ''
  }

  fetchData() {
    console.log(this.shareservice.accountobject.value);
    let template_id:any=this.shareservice.accountobject.value;
    let pass_tmp_id:any=template_id?.wisefin_template_id;
    let from_date = this.datePipe.transform(this.from_date, 'yyyy-MM-dd')
    let to_date = this.datePipe.transform(this.to_date, 'yyyy-MM-dd')
    let payload = {
      acc_id: this.accountObject?.id,
      from_date: from_date,
      to_date: to_date,
      template_id:pass_tmp_id
    }
    this.proofingService.fetch_transactions(payload).subscribe(res => {
      // {'entry_type': 'D', 'entry_gl': '449000200', 'branch_code': '1603', 'branch_name': 'GINJEE', 
      // 'entry_glremarks': 'MAN2110180001-1', 'entry_refno': 'MAN2110180001', 'entry_crno': 'MAN2110180001', 
      // 'entry_module': 'AP', 'entry_screen': 'SCREEN', 'entry_gid': 3971, 'entry_transactiondate': '18-Oct-2021',
      //  'opening': '0.00', 'entry_amt': '100.00', 'debitamt': 100.0, 'creditamt': 0.0, 'closing': '100.00', 
      //  'entry_updatedate': '18-Oct-2021', 'entry_exceptionflag': None}
      this.fetchedData = res;
      this.count = res.count
      if (this.fetchedData.length == 0) {
        this.notification.showError('No Data Found...')
      }
      else{
        this.notification.showSuccess('Number Of Transaction Items Uploaded:'+this.count)
        this.isshow=false
      }

    }, error => {

    })
    console.log(payload)

  }

  // open() {
  //   // this.accountscroll._getScrollTop.subscribe(() => {
  //   //   const panel = this.accountscroll.panel.nativeElement;
  //   //   panel.addEventListener('scroll', event => this.scrolled(event));
  //   // })
  //   this.renderer.listen(this.accountscroll.panel.nativeElement, 'scroll', () => {
  //     // this.renderer.setStyle(this.accountscroll.nativeElement, 'color', '#01A85A');
  //     let evet = this.accountscroll.panel.nativeElement
  //     this.scrolled(evet)
  //   });

  checkHistory()
  {
    this.router.navigate(['proofing/history'], {queryParams: { accountType: 1 } });
}
checkHistorys()
{
  this.router.navigate(['proofing/history'], {queryParams: { accountType:2 } });
}
check_para(){
  if(this.ac_excelform.get('accountno').value){
    this.ac_excelform.get('accountno').valueChanges
    .pipe(
     debounceTime(100),
     distinctUntilChanged(),
     tap(() => {
       this.isLoading = true;
     }),
    //  switchMap(value => this.proofingService.getAccountList('',typeof(value)!='object'?value:'')
     switchMap(value => this.proofingService.getAccountList("", "", 1, value)
     .pipe(
       finalize(() => {
         this.isLoading = false
       }),)
     )
   )
   .subscribe((results: any[]) => {
     let datas = results['data'];
     this.chipSelected = datas
     console.log("Account List", this.chipSelected)
   });
  }
  this.proofingService.getAccountList("","",this.presentpage,'').subscribe(res=>{
    console.log(res['data']);
    this.chipSelected=this.chipSelected.concat(res['data']);

    if(this.chipSelected.length>0){
      let pagination=res['pagination'];
      this.has_next=pagination.has_next;
      this.has_previous=pagination.has_previous;
      this.presentpage=pagination.index;
    }
  });
}
selectdropdown(event)  {
  const value =event.account_number;
  const id =event.id;
  const temp_id=event?.wisefin_template?.id;
  // this.report_accountid=id;
  
  if (value && !this.chiplist.includes(value)) {
    this.chiplist.push(value);
    this.excelupload_acid.push(id); 
    this.excelupload_tempid.push(temp_id);

  }
  else{
    this.notification.showWarning("Already_EXISTS")
  }
  this.chipSelected.push(value);
  // this.colref_int.nativeElement.value='';
  this.colref_int.nativeElement.blur();
}
remove(chip){
  const index = this.chiplist.indexOf(chip);
  const indexid=this.excelupload_acid.indexOf(chip);

  if (index >= 0 || indexid >= 0) {
    this.chiplist.splice(index, 1);
    this.excelupload_acid.splice(index,1);
    this.excelupload_tempid.splice(index,1);
  }
 }
 upload_exclel(){
  console.log('hi');
  // if(this.ac_excelform.get('accountno').value)
  let accountid =[]
   accountid=this.excelupload_acid;
  let tempid=this.excelupload_tempid;
  if ( accountid==undefined || accountid==null){
      this.notification.showError('Please Select account');
      return false;
  }
  let from_date = this.datePipe.transform(this.ac_excelform.value.from_date, 'yyyy-MM-dd');
    if (from_date == '' || from_date == null || from_date == undefined) {
      this.notification.showError("Please select valid from date");
      return false;
    }
    let to_date = this.datePipe.transform(this.ac_excelform.value.to_date, 'yyyy-MM-dd');
    if (to_date == '' || to_date == null || to_date == undefined) {
      this.notification.showError("Please select valid to date");
      return false;
    }
    let params = 'fromdate=' + from_date;
    to_date ? params += '&todate=' + to_date : '';
   let data={
    account_id:accountid,
    template_id:tempid,
   }
   this.spinner.show();
  this.proofingService.upload_multipleacc_Document(params,data,this.excel_ac_file).subscribe(result=>{
    this.spinner.hide();
       if(result.status==='success'){
        this.notification.showSuccess(result.message);
          console.log(result);
       }
       else{
        this.notification.showError(result.description);
       }
  },(error:HttpErrorResponse)=>{
    this.spinner.hide();
    this.notification.showWarning(error.status+error.statusText);
    
  });
 }
 bulkuploadclose(){
  this.excelupload_acid=[];
  this.excelupload_tempid=[];
  this.ac_excelform.reset();
  this.chipSelected=[];
  this.chiplist=[];
  this.cancelpopup()

 }
  ngOnDestroy(): void {
    if(this.RefreshSubscription){
      this.RefreshSubscription.unsubscribe();
    }
    
  }

  popupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("bulk_acexcelupload"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }

  cancelpopup(){
    this.closeaddpopup.nativeElement.click();
  }

  frtodate:any = {"fromobj":{label: "From Date"},"toobj":{label: "To Date"}}
  fromdatefun(frm){
    this.ac_excelform.patchValue({
      from_date:frm
    })

  }
  todatefun(to){
    this.ac_excelform.patchValue({
      to_date:to
    })
  }
  frtoexeceldate:any = {"fromobj":{label: "From Date"},"toobj":{label: "To Date"}}

  fromdateexcelfun(frmex){
    this.ac_excelform.patchValue({
      from_date:frmex
    })

  }
  todateexcelfun(toex){
    this.ac_excelform.patchValue({
      to_date:toex
    })
  }

  gets3downloadsum(){
    
  }
}
