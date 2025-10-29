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
  selector: 'app-frs-summary',
  templateUrl: './frs-summary.component.html',
  styleUrls: ['./frs-summary.component.scss'],
  providers: [{ provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
      DatePipe],
  encapsulation: ViewEncapsulation.None,
})
export class FrsSummaryComponent implements OnInit {

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild('branch') matAutocompletebrach: MatAutocomplete;
  @ViewChild('closepopup') closepopup:any;
  @ViewChild('open_frs') open_frs;
  @ViewChildren('fileInput') fileInput: QueryList<ElementRef>


  frs_search:FormGroup;
  frs_payment:FormGroup;
  frs_transactions:FormGroup;
  frs_Walk_in:FormGroup;
  frs_billing:FormGroup;
  Approve:FormGroup;
  FileAttachement:FormGroup;
  cbs_satuss:any
  futureDays = new Date();
  currentItem=1;
  summary_list: any;
  histry_list:any;
  has_next: any;
  has_previous: any;
  presentpage: any;
  data_found: boolean=false;
  branch_code_list: any;
  currentpage: number;
  payment_list: any;
  customer_list: any;
  customer_data: any;
  transaction_list: any;
  frs_value: any;
  trancation_datails: any;
  billing_details: any;
  walkin_details: any;
  tranempty_data: boolean=true;
  billempty_data: boolean=true;
  walkempty_data: boolean=true;
  edit_sumary: boolean =true;
  edit_data_sumary:boolean=false;
  view_change: boolean = false;
  admin_download:boolean =false;
  pending_status:boolean=false;
  debit_list:any=[
    {id:1,name:"GL"},
    {id:2,name:"CASA"}
  ]
  creditgl_list=[]
  product_list=[
    {id:1,product:'GL'},
    {id:2,product:'CASA'},
  ]
  bil_list=[]
  income_data: any;
  edit_frs_summary: any;
  view_edit_frs: boolean;
  incomedetails_id:any;
  hass_previous:any;
  hass_next:any;
  presentspage:any
  status_list: any;
  share_name:any;
  summary_value: [];
  Edit_value:boolean;
  datasinset:any;
  is_approver: boolean=false;
  edits_value:boolean= false;
  Appprovedata_values: any;
  Approver_maker: any;
  states_name: any;
  sumStatus: any;
  status_value_hide: any; 
  branch_list: any;
  fromdate: any;
  validityfrom: string;
  validityto: string;
  readvalue: boolean;
  document_list: any;
  document_id: any;
  hasdoc_previous: any;
  presentdocpage: number;
  hasdoc_next: any;
  histry_Sum: any;
  document_sum: any;
  nav_summary_page: boolean = false;
  datanot_found: boolean;
  filearray: any = [];
  flag: boolean;
  errorHandler: any;
  code: any;
  from_date_value: string;
  to_data_value: string;
  branch_id_download: string;
  filetype: any;
  branch_ids: any;
  Statusfile: any;
  Nii_menuList: any;
  NiiDocument: boolean;
  Department: any;
  datass_found: boolean;
  Nii_summary: boolean;
  reverse_branch: any;
  // date:string;
  
  constructor(private datePipe:DatePipe,private frs_service:FrsServiceService, public sharedService: SharedService,private formBuilder:FormBuilder,private toastr:ToastrService,
    private router: Router,private SpinnerService: NgxSpinnerService,private shareService: SharedService,private sanitizer: DomSanitizer, private frsshareservice:FrsshareService ) { 
      this.futureDays.setDate(this.futureDays.getDate());
    }

  ngOnInit(): void {   
    this.get_reverse_branch_api()  
    let sum_tab: any = this.frsshareservice.submoduletab.value;
    console.log("cvnv",sum_tab)
    if(sum_tab=="summary"){     
      this.edit_sumary=true;
      this.edit_data_sumary=false
    }else{
      
  }
  


    console.log("data transsatio",this.sharedService.transactionList)
     this.share_name=this.sharedService.transactionList 
    // this.share_name = this.datasinsets
    
    console.log("data transsation lists value",this.share_name['role'])
    this.frs_payment=this.formBuilder.group({
      id:'',
      branchcode:'',
      payment_type:'',
      transtype:'',
      custype:'',
     
    })
    this.frs_transactions=this.formBuilder.group({
      id:'',
      debitacc:'',
      debitGL:'',
      creditGL:'',
      loanfcc:'',
      custype:'',
      invoiceNum:'',
      gstin:'',
      states_code:''
    })
    this.frs_billing=this.formBuilder.group({
      id:'',
      prodtype:'',
      gstcode:'',
      billamt:'',
      gstamt:'',
      totbillamt:'',
      totpay:'',
      narration:'',
    })
    this.frs_Walk_in=this.formBuilder.group({
      id:'',
      cusname:'',
      address:'',
      mobnum:'',
      email:'',
    })

    this.frs_search=this.formBuilder.group({
      id:'',
      // branch:[''],
      payment:[''],
      transaction:[''],
      // customer:[''],
      code:'',
      frs_search:[''],
      status_value:[''],
      from_date:[''],
      to_date:[''],
      status:''
    })
    this.Approve=this.formBuilder.group({
      content:''
    })
    this.FileAttachement = this.formBuilder.group({
      file:'',
    })
    this.frs_summary(this.frs_search.value)  
    this.branch() 
  }

  public branch_code_display(branch_name ?: frs): string | undefined{
    return branch_name ? branch_name.name : undefined;
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
  public creditgl_display(creditgl?: frs): string | undefined {
    return creditgl ? creditgl.name : undefined;
  }
  public debit_display(debit?: frs): string | undefined {
    return debit ? debit.name : undefined;
  }
  public cus_display(customer_name?: frs): string | undefined {
    return customer_name ? customer_name.name : undefined;
  }
  public product_display(product_name?: frs): string | undefined {
    return product_name ? product_name.name : undefined;
  }
  public bil_display(bil_name?: frs): string | undefined {
    return bil_name ? bil_name.name : undefined;
  }
  public status_display(status_name?: frs): string | undefined {
    return status_name ? status_name.name : undefined;
  }
  public displayStatus(aws_name?: frs): string | undefined {
    return aws_name ? aws_name.name : undefined;
  }
  //  getbranchcode() {
  //   this.frs_service.get_branch_code(this.branchInput.nativeElement.value, 1)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.branch_code_list = datas;

  //     })
  // }
  cbsstatus_list=[
    {"name":"Failed","id":99},
    {"name":"Success","id":0},
    {"name":"Pending","id":-1}
  ] 

  autocompletebranchcodeScroll() {
    this.has_next = true;
    this.has_previous = true;
    this.currentpage = 1
    setTimeout(() => {
      if (
        this.matAutocompletebrach &&
        this.autocompleteTrigger &&
        this.matAutocompletebrach.panel
      ) {
        fromEvent(this.matAutocompletebrach.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletebrach.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletebrach.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletebrach.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletebrach.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {                
                this.frs_service.get_branch_code(this.branchInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branch_code_list = this.branch_code_list.concat(datas);
                    if (this.branch_code_list.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
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

  transtion_customer_type(){
    this.SpinnerService.show()
    this.frs_service.get_customer_type('').subscribe(results=>{
      this.SpinnerService.hide()
      let data=results['data']
      this.customer_data=data
    })
  }
  transcation_type(){
    this.SpinnerService.show()
    this.frs_service.get_transcation_type().subscribe(results=>{
      this.SpinnerService.hide()
      let data=results['data']
      this.transaction_list=data
    })
  }  

  frs_summary(frs,pageNumber=1){
    this.frs_value=frs
    // console.log("search value=>",this.frs_value)
    // console.log("search value=>",this.frs_value.code)
    // branch_id=&payment_type=&transaction_type=&customer_type=&transationdetails
     let fromdate = frs.from_date
    this.validityfrom=this.datePipe.transform(fromdate, 'yyyy-MM-dd')
    let todate =frs.to_date
    this.validityto=this.datePipe.transform(todate, 'yyyy-MM-dd')
    // console.log('validityfrom',this.validityfrom)
    // console.log("frs.status_value.id",frs.status_value)
    // console.log("flag",this.flag)
   
  
    if(this.frs_search.value.from_date != "" && this.frs_search.value.from_date != null && this.frs_search.value.from_date != undefined){
      if(this.frs_search.value.to_date == "" || this.frs_search.value.to_date == null || this.frs_search.value.to_date == undefined){
        this.toastr.warning("","Please Select The To Date")
        return false;
      }
  }
    if(this.flag == undefined){
      this.flag = false
    }
    let frs_search={
      "status":typeof frs.status_value=="object" ? (frs.status_value == null ? '' : frs.status_value.id):'',
      "branch_id":typeof frs.branch=="object" ? (frs.branch == null ? '' : frs.branch.id):'',
      "payment_type":typeof frs.payment=="object" ? (frs.payment == null ? '' : frs.payment.id):'',
      "transaction_type":typeof frs.transaction=="object" ? (frs.transaction == null ? '' : frs.transaction.id):'',
      "customer_type":typeof frs.customer=="object" ? (frs.customer == null ? '' : frs.customer.id):'',
      "transationdetails":'',
      "from_date":typeof this.validityfrom ? (this.validityfrom == null ?'' : this.validityfrom):'',
      "to_date":typeof  this.validityto ? (this.validityto == null ?'' : this.validityto):'',      
      "Flag":typeof this.flag ? (this.flag == null ? '' : this.flag):'' ,
      "code":typeof this.frs_search.value.code ? (this.frs_search.value.code == null ? '' : this.frs_search.value.code):'' ,
      "cbs_status": this.frs_search.value.status ? (this.frs_search.value.status == undefined   ? '' : this.frs_search.value.status.id):'' ,
    }
    this.SpinnerService.show()
    this.frs_service.frs_summary(frs_search,pageNumber).subscribe((results)=>{
        console.log("result=>",results)
    this.Approver_maker = results["employee_role"]    
    this.Department =results['department']
      console.log("employee_role" , this.Approver_maker)
      console.log("employee_role" , this.Department)
     this.frsshareservice.Approvermaker.next(this.Approver_maker);
      console.log("this.frsshareservice.Approvermaker.value",this.frsshareservice.Approvermaker.next(this.Approver_maker))
      let data=results['data']
      let datapagination = results["pagination"];
      this.summary_list=data
      this.summary_value =this.summary_list     
      if(this.Approver_maker == "Approver" || this.Approver_maker == "Admin" ){
        this.is_approver =true;
        if(this.Approver_maker == "Admin"){
        this.admin_download=true
        }
      }
      console.log("this.summary_value =this.summary_list",this.summary_value) 
      for(let summary_valuer of this.summary_value){
        let sum_value = summary_valuer['status']
        this.status_value_hide = sum_value['name']
      }      
      this.SpinnerService.hide()
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
      this.frs_summary(this.frs_value,this.presentpage - 1);
    }
  }
  nextClick() { 
    if (this.has_next === true) {
      this.frs_summary(this.frs_value,this.presentpage + 1)
    }
  }
  frs_reset(){
    this.frs_search.reset('')
    this.frs_summary(this.frs_search.value)  
  }
  closepopup_frs(){
    this.closepopup.nativeElement.click();
  }
  async frs_details(frsdetails,display=true){
    // this.FrsShareService.Nonintrastedit.next(frsdetails);
    // this.router.navigate(['/frs/Nonintrastedit'], { skipLocationChange: true })
    let tran_id:any=''
    let bill_id:any=''
    // console.log("frs_details=>",frsdetails)
    let transac={
      "incomedetails":frsdetails.id
    }
    this.SpinnerService.show()
    await this.frs_service.frs_info(transac,'trancation').then(res=>{
      this.SpinnerService.hide()
      console.log("trancation=>",res)
      let data=res['data']
      console.log(" this.trancation_datails=data",data)
      if(data.length!=0){
        let val=data[0]
        console.log("val=>",val)
        tran_id=val
        let state_value = tran_id.state_code
        // console.log("state_value",state_value.name)
        this.tranempty_data=false
        this.trancation_datails=data
        if(display==true){
          this.open_frs.nativeElement.click();
        }else{
          this.frs_transactions.patchValue({
            "id":val.id,
            "debitacc":'',
            "debitGL": val.debit_gl != null ? val.debit_gl : '',
            "creditGL":val.credit_gl != null ? val.credit_gl : '',
            "loanfcc":val.account_no != null ? val.account_no : '',
            "custype":val.debitaccount_title != null ? val.debitaccount_title:'',
            "invoiceNum":val.invoice_no != null ? val.invoice_no : '',
            "gstin": val.gstin != null ? val.gstin : '',
            "states_code": state_value.name != null ? state_value.name : '',
            'business_segment':val.Bs_name !=null ? val.Bs_name :'',
            "cc":val.CC_name != null ? val.CC_name :'',

          })
          console.log("frs_transaction",this.trancation_datails)
        }
      }else{
        this.tranempty_data=true;
        this.billempty_data=true;
        this.walkempty_data=true;
        this.billing_details='';
        this.walkin_details='';
        // this.trancation_datails=data
        // this.toastr.warning('','No Data Found..',{timeOut:1500})
        this.frs_edit_reset('transaction');
        return false;

      }
      console.log("tranempty_data=>",this.tranempty_data)
    })
    if(this.tranempty_data==false){
      let billing={
        "transactiontype":tran_id.id
      }
      this.SpinnerService.show()
      await this.frs_service.frs_info(billing,'billingdetails').then(bill=>{
        this.SpinnerService.hide()
        console.log("bill=>",bill)
        let data=bill['data'];
        if(data.length!=0){
          bill_id=data[0];
          this.billing_details=data;
          this.billempty_data=false;
          this.frs_billing.patchValue({
            "id":bill_id.id,
            "prodtype":'',
            "gstcode":bill_id.gst_code != null ? bill_id.gst_code : '',
            "billamt":bill_id.billamount_gst != null ? bill_id.billamount_gst : '',
            "gstamt":bill_id.gst_amount != null ? bill_id.gst_amount : '',
            "totbillamt": bill_id.totalbill_amount != null ? bill_id.totalbill_amount : '',
            "totpay": bill_id.totalamount_pr != null ? bill_id.totalamount_pr : '',
            "narration":bill_id.narration != null ? bill_id.narration : '',
          })
        }else{
          this.billempty_data=true;
          this.walkin_details='';
        // this.toastr.warning('','No Data Found..',{timeOut:1500})
        this.frs_edit_reset('billing');
          return false;
        }
      })
    }
    if(this.billempty_data==false){
      let walk={
        "billingdetails":bill_id.id
      }
      this.SpinnerService.show()
      await this.frs_service.frs_info(walk,'walkin').then(walk=>{
        this.SpinnerService.hide()
        let val=walk['data']
        if(val.length!=0){
          let data=val[0]
          this.walkin_details=val
          this.walkempty_data=false
          this.frs_Walk_in.patchValue({
            "id":data.id,
            "cusname":data.customer_name !=null ? data.customer_name:'',
            "address":data.address !=null ? data.address:'' ,
            "mobnum" :data.mobile_number !=null ? data.mobile_number:'',
            "email"  : data.email !=null ? data.email:'',
          })
          
        }else{
        this.frs_edit_reset('frs_Walk_in');
          this.walkempty_data=true
        // this.toastr.warning('','No Data Found..',{timeOut:1500})
        return false;
        }
      })
    }
  }
  only_nummber(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  frs_transaction(summary_val){    
    console.log("summary_val",summary_val) 
    this.readvalue=true
    if (summary_val !=''){
      let sum_value = summary_val['status']
        this.status_value_hide = sum_value['name']
        this.cbs_satuss =summary_val.cbs_status
        console.log("this.cbs_satuss",this.cbs_satuss)
        this.frsshareservice.cbs_status.next(this.cbs_satuss)
        this.frsshareservice.summary_code.next(summary_val.code)
        this.frsshareservice.reverse_data_branch.next(summary_val.branch)
        this.frsshareservice.branch_drop_list.next(this.branch_list)
      this.frsshareservice.Status_hide.next(this.status_value_hide);      

    }else{
      this.frsshareservice.Status_hide.next('add')
    }
    
    // if(typeof summary_val==='object'){
    //   this.edit_frs_summary=summary_val;
    //   this.edit_sumary = false;  
    //   this.edit_data_sumary=true
    //   this.view_edit_frs=false;
    // }else{
    //   // vdshgvjsd
    //   this.edit_frs_summary='';
    //   this.edit_sumary = false;  
    //   this.edit_data_sumary=true;
    //   this.view_edit_frs=true;
    // }   
    if(typeof summary_val==='object'){
      this.edit_frs_summary=summary_val;
      this.edit_sumary = false;  
      this.view_edit_frs=false;
    }else{
      // vdshgvjsd
      this.edit_frs_summary='';
      this.edit_sumary = false;  
      this.view_edit_frs=true;
    }   
    
    
  }


  get_reverse_branch_api(){
    this.frs_service
    .get_reverse_branch_api()
    .subscribe((results: any[]) => {
      let datas = results["branch_codes"];
      this.reverse_branch = datas;
      this.frsshareservice.reverse_api_data.next(this.reverse_branch)
    });
  }
  branch(){
    // this.SpinnerService.show()
    this.frs_service.get_branch().subscribe(results=>{
      // this.SpinnerService.hide()
      let data=results['data']
      this.branch_list=data      
      this.frsshareservice.Branch_value.next(this.branch_list);
      this.frsshareservice.branch_drop_list.next(this.branch_list);
      // console.log('branch_list',this.branch_list[0])
    } , error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
      this.errorHandler.errorHandler(error,'');
    })
  }
  frs_edit_reset(diff){
    if(diff == 'frs_Walk_in'){
      this.frs_Walk_in.reset('')
    }
    else if(diff == 'billing'){
      this.frs_billing.reset('')
    }
    else if(diff == 'transaction'){
      this.frs_transactions.reset('')
    }
    else if(diff == 'income'){
      this.frs_payment.reset('')
    }else{
      this.frs_Walk_in.reset('');
      this.frs_billing.reset('');
      this.frs_transactions.reset('');
      this.frs_payment.reset('');
    }
  }
  // frs_edit(diff,frs_data){
  //   // this.readvalue=true;
  //   console.log("frs_data=>",frs_data)
  //   if(diff == 'frs_Walk_in'){
  //     let walk_param={
  //       "id":frs_data.id,
  //       "customer_name": (frs_data.cusname !=null || frs_data.cusname !=undefined ? ( frs_data.cusname !='' ? frs_data.cusname : '') : ''),
  //       "address": (frs_data.address !=null || frs_data.address !=undefined ? ( frs_data.address !='' ? frs_data.address : '') : ''),
  //       "mobile_number": (frs_data.mobnum !=null || frs_data.mobnum !=undefined ?( frs_data.mobnum !='' ? frs_data.mobnum : '') : ''),
  //       "email": (frs_data.email !=null || frs_data.email !=undefined ? ( frs_data.email !='' ? frs_data.email : '') : ''),
  //     }
  //     this.frs_service.frs_edit(diff,walk_param).subscribe(res=>{
  //       this.toastr.success('','Successfully  Updated',{timeOut:1500});
  //       this.frs_edit_reset('reset');
  //       this.frs_transaction(this.edit_frs_summary);
  //     })
  //   }else if(diff == 'billing'){
  //     let bill_param={
  //       "id":frs_data.id,
  //       "product_type": (frs_data.prodtype != null || frs_data.prodtype != undefined ?( typeof frs_data.prodtype == 'object' ? frs_data.prodtype.id :'') : ''),
  //       "gst_code": (frs_data.gstcode !=null || frs_data.gstcode !=undefined ?( frs_data.gstcode !='' ? frs_data.gstcode : '') : ''),
  //       "gst_amount": (frs_data.gstamt !=null || frs_data.gstamt !=undefined ?( frs_data.gstamt !='' ? frs_data.gstamt : '') : ''),
  //       "totalbill_amount": (frs_data.totbillamt !=null || frs_data.totbillamt !=undefined ?( frs_data.totbillamt !='' ? frs_data.totbillamt : '') : ''),
  //       "totalamount_pr": (frs_data.totpay !=null || frs_data.totpay !=undefined ?( frs_data.totpay !='' ? frs_data.totpay : '') : ''),
  //       "narration":  (frs_data.narration !=null || frs_data.narration !=undefined ? ( frs_data.narration !='' ? frs_data.narration : '') : ''),
  //       "billamount_gst": (frs_data.billamt !=null || frs_data.billamt !=undefined ? ( frs_data.billamt !='' ? frs_data.billamt : '') : ''),
  //     }
  //     this.frs_service.frs_edit(diff,bill_param).subscribe(res=>{
  //       this.toastr.success('','Successfully  Updated',{timeOut:1500});
  //       this.frs_transaction(this.edit_frs_summary);
  //     })
  //   }
  //   else if(diff == 'transaction'){
  //     let transac_param={
  //       "id":frs_data.id,
  //       "debitaccount_type": (frs_data.debitacc != null || frs_data.debitacc != undefined ?( typeof frs_data.debitacc == 'object' ? frs_data.debitacc.id :'') : ''),
  //       "debit_gl": (frs_data.debitGL != null || frs_data.debitGL != undefined ?( frs_data.debitGL != '' ? frs_data.debitGL :'') : ''),
  //       "credit_gl": (frs_data.creditGL != null || frs_data.creditGL !=undefined ?( frs_data.creditGL !='' ? frs_data.creditGL :'') : '' ),
  //       "account_no": (frs_data.loanfcc !=null || frs_data.loanfcc !=undefined ? (frs_data.loanfcc !='' ? frs_data.loanfcc : '') : ''),
  //       "debitaccount_title":  (frs_data.customertype != null ||  frs_data.customertype != undefined ?(  frs_data.customertype  ?  frs_data.customertype:'') : ''),
  //       "invoice_no": (frs_data.invoiceNum !=null || frs_data.invoiceNum !=undefined ?(frs_data.invoiceNum !='' ? frs_data.invoiceNum : '') :''),
  //       "gstin": (frs_data.gstin !=null || frs_data.gstin !=undefined ? (frs_data.gstin !='' ? frs_data.gstin : ''):''),
  //       "state_code": (frs_data.stcode.id !=null || frs_data.stcode.id !=undefined ? (frs_data.stcode.id !='' ? frs_data.stcode.id : '') :''),

  //     }
  //     this.frs_service.frs_edit(diff,transac_param).subscribe(res=>{
  //       this.toastr.success('','Successfully  Updated',{timeOut:1500});
  //       this.frs_transaction(this.edit_frs_summary);
  //     })
  //   }
  //   else if(diff == 'income'){
  //     let walk_param={ 
  //     "id":frs_data.id,
  //     "branch_id": (frs_data.branchcode != null || frs_data.branchcode != undefined ?( typeof frs_data.branchcode == 'object' ? frs_data.branchcode.id :'') : ''),
  //     "payment_type": (frs_data.payment_type != null || frs_data.payment_type != undefined ?( typeof frs_data.payment_type == 'object' ? frs_data.payment_type.id :'') : ''),
  //     "transaction_type": (frs_data.transtype != null || frs_data.transtype != undefined ?( typeof frs_data.transtype == 'object' ? frs_data.transtype.id :'') : ''),
  //     "customer_type": (frs_data.cusname !=null || frs_data.cusname !=undefined ? ( frs_data.cusname !='' ? frs_data.cusname : '') : '')}
  //     this.frs_service.frs_edit(diff,walk_param).subscribe(res=>{
  //      if(res['set_code']){
  //       this.toastr.success('','Successfully  Updated',{timeOut:1500});
  //       this.frs_transaction(this.edit_frs_summary);
  //      }
  //     })
  //   }
  // }
  histry(summary){
    this.histry_Sum = summary
    this.incomedetails_id = summary.id    
    console.log("data_id_values", summary )
    this.SpinnerService.show()
    this.frs_service.frs_histry(this.incomedetails_id).subscribe(res=>{
      this.SpinnerService.hide()
      // this.toastr.success('','Successfully ',{timeOut:1500});
      let data=res['data']
      let dataspagination = res["pagination"];
      this.histry_list=data      
      // console.log("this.incomedetails_id",this.incomedetails_id)
      // console.log("this.histry_list",this.histry_list)   
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
  Statusvalue(){
    this.SpinnerService.show()
    this.frs_service.Statevalue().subscribe(results=>{
      this.SpinnerService.hide()
      let data=results['data']
      this.status_list=data
      // console.log("this.status_list",this.status_list)  
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
  status_summary(event){
     this.sumStatus =event.target.value 
    //  console.log("this.summmaryghsfdgmk",this.sumStatus)

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
  from_date_rest(){
    this.frs_search.controls['to_date'].reset('')
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
  downloadfiledocument(docu,deff){

    this.FileAttachement.reset()  
    // console.log("document",docu.id)
    this.document_id = docu.id
    this.filetype=docu.file_name
    let deffrence=deff

    // console.log("deffrence",deffrence)    
    this.SpinnerService.show()
     this.frs_service.downloadfiledocument(this.document_id ).subscribe((results: any) => {    
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(results)   
      // console.log("binaryData",binaryData)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      // console.log(downloadUrl)
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = date + this.filetype;
      link.click();
      this.toastr.success('Successfully Download');      
  }

  , error => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
    this.errorHandler.errorHandler(error,'');
    
  })
  // this.Faservice.getDepreciationForecastDownload().subscribe(result=>{
  //   let binaryData = [];
  //   binaryData.push(result)
  //   let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
  //   let link = document.createElement('a');
  //   link.href = downloadUrl;
  //   let date: Date = new Date();
  //   link.download = 'DetailedReport'+ date +".xlsx";
  //   link.click();
  //   this.toastr.success('Success');
  // },
  // (error:HttpErrorResponse)=>{
  //   console.log(error);
    // this.spinner.hide();
    // this.errorHandler.errorHandler(error,'');
  // })
  }

  adminscreendownload(form_value){
    // if(this.Approver_maker == "Admin"){
    //   this.branch_ids=""
    //   }else{
    //   this.branch_ids=this.branch_list[0].id
    //   }
    
// console.log("branch_ids",this.branch_ids)
    let fromdate = form_value.from_date
    this.validityfrom=this.datePipe.transform(fromdate, 'yyyy-MM-dd')
    let todate =form_value.to_date
    this.validityto=this.datePipe.transform(todate, 'yyyy-MM-dd')
    this.Statusfile=form_value.status_value
    let frs_search={
      "status":typeof form_value.status_value=="object" ? (form_value.status_value == null ? '' : form_value.status_value.id):'',
      "branch_id":typeof form_value.branch=="object" ? (form_value.branch == null ? '' : form_value.branch.id):'',
      "payment_type":typeof form_value.payment=="object" ? (form_value.payment == null ? '' : form_value.payment.id):'',
      "transaction_type":typeof form_value.transaction=="object" ? (form_value.transaction == null ? '' : form_value.transaction.id):'',
      "customer_type":typeof form_value.customer=="object" ? (form_value.customer == null ? '' : form_value.customer.id):'',
      "transationdetails":'',
      "from_date":typeof this.validityfrom ? (this.validityfrom == null ?'' : this.validityfrom):'',
      "to_date":typeof  this.validityto ? (this.validityto == null ?'' : this.validityto):'',
      "code":form_value.code ? (form_value.code == null ? '' : form_value.code):'' ,
      "cbs_status": form_value.status ? (form_value.status == undefined   ? '' : form_value.status.id):'' ,
    }
    this.SpinnerService.show()
      this.frs_service.Admindownloadfiledocument(frs_search)
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



  // file_data = []  
  file_data = [];
files(e){
    
  for (var i = 0; i < e.target.files.length; i++) {
        this.file_data.push(e.target.files[i])
    }
     console.log("file data ", this.file_data)
  } 
submit_document(){
//  let  document_id=0  
  // let document_file_id=document_id
  // console.log("dataass",datasss)  
  if(this.file_data?.length==0){
    this.toastr.warning("", "Please Select Files")
    return false;
  }
  if(this.file_data.length != 0){
    for (var i=0; i<this.file_data.length; i++ ){
      if(this.file_data[i].name.length>75){
        console.log("this.file_data[i] length",this.file_data[i].name.length)
         this.toastr.warning("","Please Select File Name Length 75 Only Allowed ")
         return false
      }
    }
  }
  let file_data = this.FileAttachement.value.file
  console.log("this.FileAttachement.value.file",this.FileAttachement.value.file)
let document_file_id =  {"status":1,
"Incomedetails":this.incomedetails_id,
"file_id":this.FileAttachement.value.file}
console.log("document delete",document_file_id)
this.SpinnerService.show()
this.frs_service.submit_document(document_file_id,this.file_data).subscribe(results=>{
  this.SpinnerService.hide()
  let data=results  
  this.FileAttachement.get('file')?.reset();
  if(results.set_description == "SUCCESSFULLY FILE ATTECHED"){
    this.toastr.success("",results.set_description,{timeOut: 1500})
    this.frs_summary(this.frs_search.value)
    this.FileAttachement.reset()
    }else{
    this.toastr.warning("",results.set_description,{timeOut: 1500})
    this.FileAttachement.reset()
    }  
  // console.log("data", data)  
  this.closepopup.nativeElement.click();
   } , error => {   
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
    this.errorHandler.errorHandler(error,'');
    this.FileAttachement.reset()  
}) 
}
delete_document(document){
let datass = document.id
// console.log("rtfg",datass)
let status = 0
// console.log("delete_values",document.incomedetails)
this.SpinnerService.show()
this.frs_service.delete_document(datass,status).subscribe(results=>{
  this.SpinnerService.hide()
  let data=results
  if(results.message == "Successfully Deleted"){
  this.toastr.success("",results.message,{timeOut: 1500})
  this.frs_summary(this.frs_search.value)
  }else{
  this.toastr.warning("",results.description,{timeOut: 1500})
  }
  console.log("data", data)  
  // this.closepopup.nativeElement.click();
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
// deleteUpload(s, index) {
//   this.file_data.forEach((s, i) => {
//     if (index === i) {
//       this.file_data.splice(index, 1)
//       // this.images.splice(index, 1);
//     }
//   })
// }
deleteInlineFile( fileindex) {
  console.log("fileindex", fileindex)
  let filedata = this.file_data
  console.log("filedata for delete before", filedata)
  filedata.splice(fileindex, 1)
  console.log("filedata for delete after", filedata) 

}

delete_rows(data){
  this.SpinnerService.show()
  this.frs_service.delete_particular_row(data?.id).subscribe(results=>{
    this.SpinnerService.hide()
    if(results.status == "success"){
      this.toastr.success("",results.message,{timeOut: 1500})
      this.frs_summary(this.frs_search.value)
      }else{
      this.toastr.warning("",results.description,{timeOut: 1500})
      this.frs_summary(this.frs_search.value)
      }
  })
}

}
