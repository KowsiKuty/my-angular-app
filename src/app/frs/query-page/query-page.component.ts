import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { FrsServiceService } from '../frs-service.service';
import { Router } from '@angular/router'
import { SharedService } from 'src/app/service/shared.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FrsshareService} from '../frsshare.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { DatePipe, formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

export interface frs{
  name:string,
  id:number
}
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
}
@Component({
  selector: 'app-query-page',
  templateUrl: './query-page.component.html',
  styleUrls: ['./query-page.component.scss'],
  providers: [{ provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
      DatePipe],
})
export class QueryPageComponent implements OnInit {
  query_search:FormGroup;
  validityfrom: string;
  frs_value: any;
  validityto: string;
  flag: any;
  futureDays = new Date();
  has_previous: boolean=false;
  presentpage: number;
  summary_list: any;
  has_next: boolean;
  datass_found: boolean;
  errorHandler: any;
  payment_list: any;
  customer_list: any;
  transaction_list: any;
  edit_frs_summary: any;
  edit_sumary: boolean =true;
  status_value_hide: any;
  cbs_satuss: any;
  view_edit_frs: boolean;
  file_data: any[];
  document_sum: any;
  incomedetails_id: any;
  pending_status: boolean;
  datanot_found: boolean;
  document_list: any;
  hasdoc_next: boolean=false;
  hasdoc_previous: boolean=false;
  presentdocpage: any;
  data_found: boolean;
  histry_Sum: any;
  histry_list: any;
  hass_next: boolean;
  hass_previous: boolean;
  presentspage: any;
  document_id: any;
  filetype: any;
  Approve:FormGroup;
  constructor(private datePipe:DatePipe,private frs_service:FrsServiceService, public sharedService: SharedService,private formBuilder:FormBuilder,private toastr:ToastrService,
    private router: Router,private SpinnerService: NgxSpinnerService,private shareService: SharedService,private sanitizer: DomSanitizer, private frsshareservice:FrsshareService) { 
      this.futureDays.setDate(this.futureDays.getDate());
    }

    cbsstatus_list=[
      {"name":"Failed","id":99},
      {"name":"Success","id":0},
      {"name":"Pending","id":-1}
    ] 

  ngOnInit(): void {
    let sum_tab: any = this.frsshareservice.submoduletab.value;
    this.frsshareservice.query_page.next("")  

    console.log("cvnv",sum_tab)
  //   if(sum_tab=="summary"){     
  //     this.edit_sumary=true;

  //   }else{
      
  // }
  this.Approve=this.formBuilder.group({
    content:''
  })

    this.query_search=this.formBuilder.group({    
      payment:[''],
      transaction:[''],
      code:'',
      status:[''],
      from_date:[''],
      to_date:[''],
    })
    this.query_summary("")
  }

  payment_type(){
    this.SpinnerService.show()
    this.frs_service.get_payment_type().subscribe(results=>{
      this.SpinnerService.hide()
      let data=results['data']
      this.payment_list=data
    })
  }

  customer_type(){
    this.SpinnerService.show()
    this.frs_service.get_customer_type('').subscribe(results=>{
      this.SpinnerService.hide()
      let data=results['data']
      this.customer_list=data
    })
  }

  query_summary(frs,pageNumber=1){
    this.frs_value=frs  
     let fromdate = frs.from_date
    this.validityfrom=this.datePipe.transform(fromdate, 'yyyy-MM-dd')
    let todate =frs.to_date
    this.validityto=this.datePipe.transform(todate, 'yyyy-MM-dd')
  
    if(this.flag == undefined){
      this.flag = false
    }
    let query_search={     
      "payment_type":typeof frs.payment=="object" ? (frs.payment == null ? '' : frs.payment.id):'',
      "transaction_type":typeof frs.transaction=="object" ? (frs.transaction == null ? '' : frs.transaction.id):'',
      "customer_type":typeof frs.customer=="object" ? (frs.customer == null ? '' : frs.customer.id):'',      
      "from_date":typeof this.validityfrom ? (this.validityfrom == null ?'' : this.validityfrom):'',
      "to_date":typeof  this.validityto ? (this.validityto == null ?'' : this.validityto):'',      
      "code":typeof this.query_search.value.code ? (this.query_search.value.code == null ? '' : this.query_search.value.code):'' ,
      "cbs_status": this.query_search.value?.status?.id ?  this.query_search?.value?.status?.id:'' ,
    }
    this.SpinnerService.show()
    this.frs_service.query_summary(query_search,pageNumber).subscribe((results)=>{
        console.log("result=>",results)
   
      let data=results['data']
      let datapagination = results["pagination"];
      this.summary_list=data
    
      if (this.summary_list?.length > 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.presentpage = datapagination.index;
        this.datass_found=true
      }if(results['set_code'] || this.summary_list?.length == 0){
        this.has_next = false;
        this.has_previous = false;
        this.presentpage = 1;
        this.datass_found=false
      }            
      } , error => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
    this.errorHandler.errorHandler(error,'');
    })   
  }
  previousClick() {
    if (this.has_previous === true) {
      this.query_summary(this.frs_value,this.presentpage - 1);
    }
  }
  nextClick() { 
    if (this.has_next === true) {
      this.query_summary(this.frs_value,this.presentpage + 1)
    }
  }
  query_reset(){
    this.query_search.reset('')
    this.query_summary(this.query_search.value)  
  }

  public payment_display(payment_name?: frs): string | undefined {
    return payment_name ? payment_name.name : undefined;
  }
  public transaction_display(transaction_name?: frs): string | undefined {
    return transaction_name ? transaction_name.name : undefined;
  }
  public customer_display(customer_name?: frs): string | undefined {
    return customer_name ? customer_name.name : undefined;
  }
  public displayStatus(aws_name?: frs): string | undefined {
    return aws_name ? aws_name.name : undefined;
  }

  transcation_type(){
    this.SpinnerService.show()
    this.frs_service.get_transcation_type().subscribe(results=>{
      this.SpinnerService.hide()
      let data=results['data']
      this.transaction_list=data
    })
  }  
  from_date_rest(){
    this.query_search.controls['to_date'].reset('')
  }

frs_transaction(summary_val){   
  console.log("summary_val",summary_val) 
  if (summary_val !=''){
    let sum_value = summary_val['status']
      this.status_value_hide = sum_value['name']
      this.cbs_satuss =summary_val.cbs_status
      console.log("this.cbs_satuss",this.cbs_satuss)
      this.frsshareservice.cbs_status.next(this.cbs_satuss)
      this.frsshareservice.summary_code.next(summary_val.code)
    this.frsshareservice.Status_hide.next(this.status_value_hide);    
    this.frsshareservice.query_page.next("query")  

  }else{
    this.frsshareservice.Status_hide.next('add')
  }
  if(typeof summary_val==='object'){
    this.edit_frs_summary=summary_val;
    this.edit_sumary = false;  
    this.view_edit_frs=false;
  }else{
    this.edit_frs_summary='';
    this.edit_sumary = false;  
    this.view_edit_frs=true;
  }   
  
  
}

documents(summary ,presentdocpage=1){
  this.file_data = []
  this.document_sum = summary
  this.incomedetails_id = summary.id    
  console.log("data_id_values", summary )
  if(summary.status.name=="Pending"){
    this.pending_status=true;
  }else{
    this.pending_status=false;
  }
  this.SpinnerService.show()
  this.frs_service.document(this.incomedetails_id).subscribe(res=>{
    this.SpinnerService.hide()
    // this.toastr.success('','Successfully ',{timeOut:1500});
    if(res['set_description'] == "DATA NOT FOUND"){
      this.datanot_found=true;
    }else{
      this.datanot_found=false;
    }
    let data=res['data']
    console.log("data", res['set_description'])
    let dataspagination = res["pagination"];
    this.document_list=data      
    // console.log("this.incomedetails_id",this.incomedetails_id)
    console.log("this.document_list=data ",this.document_list)   
    if (this.document_list?.length > 0) {
      this.hasdoc_next = dataspagination.has_next;
      this.hasdoc_previous = dataspagination.has_previous;
      this.presentdocpage = dataspagination.index;
      this.data_found=true
    }if(this.document_list?.length == 0){
      this.hasdoc_next = false;
      this.hasdoc_previous = false;
      this.presentdocpage = 1;
      this.data_found=false
    }     
  } , error => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
    this.errorHandler.errorHandler(error,'');
  })
}
  
previousdocClick(){
  if (this.hasdoc_previous === true) {
    this.documents(this.document_sum, this.presentdocpage -1);   
  }
}

nextsdocClick(){
  if (this.hasdoc_next === true) {
    this.documents(this.document_sum,this.presentdocpage +1);
  }
}

histry(summary){
  this.histry_Sum = summary
  this.incomedetails_id = summary.id    
  console.log("data_id_values", summary )
  this.SpinnerService.show()
  this.frs_service.frs_histry(this.incomedetails_id).subscribe(res=>{
    this.SpinnerService.hide()
    let data=res['data']
    let dataspagination = res["pagination"];
    this.histry_list=data      
   
    if (this.histry_list?.length > 0) {
      this.hass_next = dataspagination.has_next;
      this.hass_previous = dataspagination.has_previous;
      this.presentspage = dataspagination.index;
      this.data_found=true
    }if(this.histry_list?.length == 0){
      this.hass_next = false;
      this.hass_previous = false;
      this.presentspage = 1;
      this.data_found=false
    }     
  } , error => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
    this.errorHandler.errorHandler(error,'');
  })
}
previoussClick(){
  if (this.hass_previous === true) {
    this.histry(this.histry_Sum);
  }
}
nextsClick(){
  if (this.hass_next === true) {
    this.histry(this.histry_Sum);
  }
}

downloadfiledocument(docu,deff){
  this.document_id = docu.id
  this.filetype=docu.file_name
  let deffrence=deff  
  this.SpinnerService.show()
   this.frs_service.downloadfiledocument(this.document_id ).subscribe((results: any) => {    
    this.SpinnerService.hide()
    let binaryData = [];
    binaryData.push(results)
    let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    let link = document.createElement('a');
    link.href = downloadUrl;
    let date: Date = new Date();
    link.download = date + this.filetype;
    link.click();
    this.toastr.success('Successfully Download');      
}, error => {
  this.errorHandler.handleError(error);
  this.SpinnerService.hide();
  this.errorHandler.errorHandler(error,'');  
})

}

delete_document(document){
  let datass = document.id
  let status = 0
  this.SpinnerService.show()
  this.frs_service.delete_document(datass,status).subscribe(results=>{
    this.SpinnerService.hide()
    let data=results
    if(results.message == "Successfully Deleted"){
    this.toastr.success("",results.message,{timeOut: 1500})
    this.query_summary(this.query_search.value)
    }else{
    this.toastr.warning("",results.description,{timeOut: 1500})
    }
    console.log("data", data)  
  } , error => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
    this.errorHandler.errorHandler(error,'');
    
  })
  
  }
  Reject(values){
    // console.log(values)
    this.Approve.setValue({
content:values
    })   
  }

  config: any = {
    airMode: false,
    tabDisable: true,
    popover: {
      table: [
        ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
        ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
      ],
      link: [['link', ['linkDialogShow', 'unlink']]],
      air: [
        [
          'font',
          [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'superscript',
            'subscript',
            'clear',
          ],
        ],
      ],
    },
    height: '200px',
    // uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
      [
        'font',
        [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'superscript',
          'subscript',
          'clear',
        ],
      ],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']],
    ],
    codeviewFilter: true,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true,
  };

  editorDisabled = false;
  get sanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.Approve.get('content').value);
  }
  
  onBlur() {
    // console.log('Blur');
  }

  onDelete(file) {
    // console.log('Delete file', file.url);
  }

  summernoteInit(event) {
    // console.log(event);
  }

  file_download(form_value){
      let fromdate = form_value.from_date
      this.validityfrom=this.datePipe.transform(fromdate, 'yyyy-MM-dd')
      let todate =form_value.to_date
      this.validityto=this.datePipe.transform(todate, 'yyyy-MM-dd')
      let frs_search={
        "transaction_type":typeof form_value.transaction=="object" ? (form_value?.transaction == null ? '' : form_value?.transaction?.id):'',
        "payment_type":typeof form_value?.payment=="object" ? (form_value?.payment == null ? '' : form_value?.payment?.id):'',
        "customer_type":typeof form_value.customer=="object" ? (form_value.customer == null ? '' : form_value?.customer?.id):'',
        "from_date":typeof this.validityfrom ? (this.validityfrom == null ?'' : this.validityfrom):'',
        "to_date":typeof  this.validityto ? (this.validityto == null ?'' : this.validityto):'',
        "code":form_value?.code ? (form_value?.code == null ? '' : form_value?.code):'' ,
        "cbs_status": form_value?.status?.id  ? form_value?.status?.id : "" ,
      }
      this.SpinnerService.show()
        this.frs_service.overall_download(frs_search)
        .subscribe((results:any) => {
          this.SpinnerService.hide()
          if(results.code=="SUCCESS"){
            this.toastr.success("", results.description, { timeOut: 1500 })
          }else{
            this.toastr.warning("",results.description , { timeOut: 1500 })
          }
          // let binaryData = [];
          // binaryData.push(results)
          // let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          // let link = document.createElement('a');
          // link.href = downloadUrl;
          // link.download = "NII.xlsx";
          // link.click();   
    }
    , error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
      this.errorHandler.errorHandler(error,'');
      
    })
  
    
  }

}
