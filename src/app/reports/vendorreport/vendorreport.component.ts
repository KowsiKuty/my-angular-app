import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { AtmaService } from 'src/app/atma/atma.service'
import { ReportserviceService } from '../reportservice.service'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router'
import { NotificationService } from 'src/app/atma/notification.service'
import { NativeDateAdapter, DateAdapter } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from 'src/app/atma/error-handling.service';
import { MatDatepicker } from '@angular/material/datepicker';
import { data } from 'jquery';
// import { state } from 'src/app/atma/branch/branch.component';
import { fromEvent } from 'rxjs';
import { actdescription } from 'src/app/atma/branchactivity/branchactivity.component';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { P } from '@angular/cdk/keycodes';
import { environment } from 'src/environments/environment';


export interface GST {
  id: string;
  text: string;
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
@Injectable()
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
  selector: 'app-vendorreport',
  templateUrl: './vendorreport.component.html',
  styleUrls: ['./vendorreport.component.scss']
})
export class VendorreportComponent implements OnInit {

  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;

  @ViewChild('statetype') matstateAutocomplete: MatAutocomplete;
  @ViewChild('stateInput') stateInput: any;

  @ViewChild('nameautocomplete') nameautocomplete: MatAutocomplete;
  @ViewChild('activitynameInput') activitynameInput: any;

  @ViewChild('activitydescriptioninput') activitydescriptioninput: any;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  
  vendorSearchForm:FormGroup
  vendorsummaryForm:FormGroup;
  isLoading = false;
  GSTlist: any;
  vendorSummaryList: any;
  isVendorSummaryPagination: boolean;
  presentpage: number = 1;
  newvendorSummaryList:any;
  newreportids:any;
  page_search = false;
  newsummary:boolean=false;
  showsummarypopup:boolean=false;
  activityTypeList: string[] = ['product','Service']; 
  // vendorSummaryList = [];
  VendorstatusesList=[{'id':1,'name':'DRAFT'},
   {'id':4, 'name':'PENDING_HEADER'},
   {'id':5, 'name':'APPROVED'},{'id':6, 'name':'RENEWAL_APPROVED'},{'id':0, 'name':'REJECTED'}]

  Vendorstatuslist = [{"id":0,"text":'All'},
  {"id":1,"text":'Approved'},
  {"id":2,"text":'Draft'},
  {"id":3,"text":'Activation'},
  {"id":4,"text":'Deactivation'},
  {"id":5,"text":'Termination'},
  {"id":6,"text":'Pending_Header'},
  {"id":7,"text":'Renewal'},
  //  {"id":9,"text":'9data'},
  //  {"id":10,"text":'10data'},
  //  {"id":11,"text":'11data'},
  ]

  Vendorsummarystatuslist = [{"id":0,"text":'PA CODE'},
  {"id":1,"text":'VENDOR NAME'},
  {"id":3,"text":'ACTIVITY-TYPE'},
  {"id":2,"text":'DESCRIPTION'},
  {"id":3,"text":'DEPARTMENT'},
  {"id":4,"text":'SUPPLIER CODE'},
  {"id":5,"text":'SUPPLIER NAME'},
  {"id":6,"text":'STATE '},
  {"id":7,"text":'GST CATEGORY'},
   {"id":9,"text":'GST NUMBER '},
   {"id":10,"text":'PAN NUMBER'},
   {"id":11,"text":'PA CODE ACTIVE/INACTIVE'},
   {"id":12,"text":'SUPPLIER CODE ACTIVE/INACTIVE  '},
   {"id":13,"text":'Block/Unblock '}
  ]

  yesorno = [{ 'value': 1, 'display': 'Vendor Report' }, 
  { 'value': 2, 'display': 'Supplier Report' },
  {'value':3,"display":"Vendor with Supplier Details Report"},
  {'value':4,"display":"Active Vendor/ Supplier Report"},
  {'value':5,"display":"Vendor Summary Report"}
]

  activestatuslist=[{'id':2,'text':'All'},
                    {'id':1,'text':'Active'},
                    {'id':0,'text':'Inactive'}]

  blockstatuslist=[{'id':2,'text':'All'},
                   {'id':1,'text':'Blocked'},
                   {'id':0,'text':'Unblocked'}]
  search_value: any;
  count: any;
  has_next = true;
  has_previous = true;
  vendorreport = true;
  supplierreport =false;
  vendorwithsupplierreport = false;
  reporttype: any;
  is_excel: any;
  activevendorsupplier: boolean;
  vendorsummaryreport:boolean;
  stateList: any;
  // designationList: Array<Designation>;

  pageSize = 10
  
  currentpage: number = 1;
  acitivitydropdowndata: any;
  name_has_next=true;
  name_has_previous=true;
  namecurrentpage=1;
  
  activitydesignationdata=[];
  activitydesign_has_next=true;
  activitydesign_has_previous=true;
  activitydesign_currentpage=1;
  send_value: string;
  atmaUrl = environment.apiURL
  vendorsummaryObjNew: any
  vendorreportData: ({ columnname: string; key: string; style?: undefined; function?: undefined; clickfunction?: undefined; type?: undefined; objkey?: undefined; datetype?: undefined; } | { columnname: string; key: string; style: { color: string; cursor: string; }; function: boolean; clickfunction: any; type?: undefined; objkey?: undefined; datetype?: undefined; } | { columnname: string; key: string; type: string; objkey: string; style?: undefined; function?: undefined; clickfunction?: undefined; datetype?: undefined; } | { columnname: string; key: string; type: string; datetype: string; style?: undefined; function?: undefined; clickfunction?: undefined; objkey?: undefined; })[];
  vendorsummaryreportData: ({ columnname: string; key: string; type?: undefined; objkey?: undefined; datetype?: undefined; } | { columnname: string; key: string; type: string; objkey: string; datetype?: undefined; } | { columnname: string; key: string; type: string; datetype: string; objkey?: undefined; })[];
  vendorsummaryreportObjNew: any
 

  constructor(private atmaService: AtmaService, private reportservice: ReportserviceService,private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService, private fb: FormBuilder,private notification: NotificationService, public datepipe: DatePipe,
    private router: Router, private service: ReportserviceService
    ) {     
    this.vendorsummaryObjNew = name
    this.vendorreportData  = [
  { "columnname": "Vendor Code", "key": "code"},
  {"columnname": "Vendor Name", "key": "name", "style":{color:"blue",cursor:"pointer"},function:true,clickfunction:this.vendorView.bind(this) },
  {"columnname": "Vendor Category", "key": "panno"},
  {"columnname": "Vendor Type", "key": "type", "type": "object", "objkey":"text" },
  {"columnname": "GSTCategory", "key": "composite"},
  {"columnname": "HeaderName", "key": "rm_id", "type": "object", "objkey": "full_name"},
  {"columnname": "RenewalDate", "key": "renewal_date", "type": "date","datetype": "dd/MM/yyyy"},
  {"columnname": "VendorStatus", "key": "mainstatus_name"},
  {"columnname": "RequestType", "key": "requeststatus_name"},
  // {"columnname": "RequestStatus", "key": "vendor_status_name",validate: true, validatefunction: this.vendorcreatefn.bind(this)},
]
    this.vendorsummaryreportObjNew = { "method": "post", "url": this.atmaUrl + "venserv/vendor_report",params:"&is_excel=0",body:{}}
    this.vendorsummaryreportData  = [
  { "columnname": "PA Code", "key": "code"},
  {"columnname": "Vendor Name", "key": "name"},
  {"columnname": "Contract From", "key": "contractdate_from"},
  {"columnname": "Contract To", "key": "contractdate_to" },
  {"columnname": "Renewal Date", "key": "renewal_date"},
  {"columnname": "Aadhar Number", "key": "adhaarno"},
  {"columnname": "Suppiler Code", "key": "supplierbranch__code"},
  {"columnname": "Suppiler Name", "key": "supplierbranch__name"},
  {"columnname": "Suppiler Address", "key": "supplier_address"},
  {"columnname": "City", "key": "scity_name"},
  {"columnname": "State", "key": "supplier_state"},
  {"columnname": "Pincode", "key": "supplier_pincode"},
  {"columnname": "GST Category", "key": "vendor__composite"},
  {"columnname": "GST Number", "key": "supplierbranch__gstno"},
  {"columnname": "PAN Number", "key": "panno"},
  {"columnname": "Activity-Type", "key": "supplierbranch__supplieractivity__type"},
  {"columnname": "Description", "key": "supplierbranch__supplieractivity__description"},
  {"columnname": "Department", "key": "activity_department"},
  {"columnname": "Tax Section", "key": "subtax_name"},
  {"columnname": "Tax Rate", "key": "tax_rate"},
  {"columnname": "Is Exempted", "key": "suppliertax__suppliersubtax__isexcempted"},
  {"columnname": "Threshold Amount", "key": "suppliertax__suppliersubtax__excemthrosold"},
  {"columnname": "Threshold Rate", "key": "suppliertax__suppliersubtax__excemrate"},
  {"columnname": "Valid From", "key": "suppliertax__suppliersubtax__excemfrom"},
  {"columnname": "Valid To", "key": "suppliertax__suppliersubtax__excemto"},
  {"columnname": "Bank Name", "key": "bank_name"},
  {"columnname": "Branch Name", "key": "bank_branch"},
  {"columnname": "IFSC Code", "key": "branch_ifsccode"},
  {"columnname": "Account Number", "key": "supplierbranch__supplierpayment__account_no"},
  {"columnname": "Beneficiary", "key": "supplierbranch__supplierpayment__beneficiary"},
  {"columnname": "Vendor Status", "key": "vendor__vendor_status"},
  {"columnname": "Suppiler Active/Inactive", "key": "supplier_is_active"},
  {"columnname": "Block/unblock", "key": "supplier_is_blocked"},
  {"columnname": "Created Date","key":"vendor__created_date"},
  {"columnname": "Updated Date","key":"vendor__updated_date"},
  // {"columnname": "RequestStatus", "key": "vendor_status_name",validate: true, validatefunction: this.vendorcreatefn.bind(this)},
]


}
  ngOnInit(): void {
    this.vendorSearchForm = this.fb.group({
      code: [''],
      name: [''],
      panno:[''],
      composite:[''],
      vendor_status:[''],
      requeststatus:[''],
      GST_status:[''],
      reporttype:[1],
      is_active:[''],
      is_block:[''],
      date_from:[''],
      date_to:[''],
    })
    // this.getVendorSummary();
    this.vendorsummaryForm=this.fb.group({
      vendor_code:[''],
      vendor_name:[''],
      activity_type:[''],
      activity_description:[''],
      activity_department:[''],
      supplier_code:[''],
      supplier_name:[''],
      composite:[''],
      gstno:[''],
      panno:[''],
      supplier_state: [''],
      vendor_status:[''],
      is_active:[''],
      is_block:[''],
      date_from:[''],
      date_to:[''],

    })
    this.getnewvendorsummary();
  }

  getnewvendorsummary() {
    this.SpinnerService.show();
   let report= this.vendorSearchForm.value.reporttype
    this.reportservice.newgetVendorSummary(report)
      .subscribe(result => {
        this.SpinnerService.hide();
        this.newvendorSummaryList = result['data']
        console.log("this.newvendorSummaryList", result)
      })
  }
  // getVendorSummary(val, pageSize) {
  //   this.reportservice.getVendorSummary(val, pageSize)
  //     .subscribe(result => {
  //       this.vendorSummaryList = result['data']
  //       let dataPagination = result['pagination'];
  //       if (this.vendorSummaryList.length >= 0) {
  //         this.has_next = dataPagination.has_next;
  //         this.has_previous = dataPagination.has_previous;
  //         this.presentpage = dataPagination.index;
  //         this.isVendorSummaryPagination = true;
  //       } if (this.vendorSummaryList <= 0) {
  //         this.isVendorSummaryPagination = false;
  //       }

  //       console.log("VendorSummary", result)
  //     })
  // }

  
  namevalidation(event){
    
    var inp = String.fromCharCode(event.keyCode);
  
    if (/[a-zA-Z0-9-]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  
  GSTname(){
    let gstkeyvalue: String = "";
      this.getGST();
  
      this.vendorSearchForm.get('composite').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
          switchMap(value => this.atmaService.getComposite()

            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.GSTlist = datas;
  
        })
  
      }

      public displayFnstate(statetype?: any): string | undefined {
        // console.log('id',statetype.id);
        // console.log('name',statetype.name);
        return statetype ? statetype.name : undefined;
      }
     
      vendorSummary(){
        this.SpinnerService.show();
        let search = this.vendorsummaryForm.value
        console.log("Search Values", search)
        let obj = 
        {
          
        }
        // "vendor_code": search.vendor_code,
          // "vendor_name": search.vendor_name,
          // "activity_type": search.activity_type.name,
          // "activity_description": search.activity_description.name,
          // "activity_department": search.activity_department.id,
          // "supplier_code": search.supplier_code,
          // "supplier_name": search.supplier_name,
          // "supplier_state": search.supplier_state.id,
          // "composite": search.composite.id,
          // "gstno": search.gstno,
          // "panno": search.panno,
          // "vendor_status": search.vendor_status.id,
          // "is_active": search.is_active.id,
          // "is_block": search.is_block.id,
        if(search.vendor_code!=""&& search.vendor_code!=null&&search.vendor_code!=undefined){
          obj["vendor_code"]=search.vendor_code
        }
        if(search?.date_from != '' && search?.date_from != null && search?.date_from != undefined && search?.date_to != '' && search?.date_to !=null && search?.date_to !=undefined){
          const dateFrom = new Date(search.date_from);
          const dateTo = new Date(search.date_to);
          if (dateFrom <= dateTo){
            obj["date_from"]=this.datepipe.transform(search?.date_from, 'yyyy-MM-dd')
            obj['date_to']=this.datepipe.transform(search?.date_to, 'yyyy-MM-dd')
        } else{
          this.SpinnerService.hide()
          this.notification.showError("'date_from' cannot be greater than 'date_to'")
        }}
        if((search?.date_from == ''|| search?.date_from == null || search?.date_from == undefined ) && (search?.date_to != ''&& search?.date_to !=null && search?.date_to !=undefined)){
          this.SpinnerService.hide()
          this.notification.showError("Please fill From Date")
          return false 
        }
        if((search?.date_from != ''&& search?.date_from != null && search?.date_from != undefined) &&(search?.date_to == ''||search?.date_to ==null || search?.date_to ==undefined)){
          this.SpinnerService.hide()
          this.notification.showError("Please fill to Date")
          return false 
        }
        if(search.vendor_name!=""&& search.vendor_name!=null&&search.vendor_name!=undefined){
          obj["vendor_name"]=search.vendor_name
        }
        if(search.activity_type!=""&& search.activity_type!=null&&search.activity_type!=undefined){
          obj["activity_type"]=search.activity_type
        }
        if(search.activity_description!=""&& search.activity_description!=null&&search.activity_description!=undefined){
          obj["activity_description"]=search.activity_description.name
        }
        if(search.activity_department!=""&& search.activity_department!=null&&search.activity_department!=undefined){
          obj["activity_department"]=search.activity_department.id
        }
        if(search.supplier_code!=""&& search.supplier_code!=null&&search.supplier_code!=undefined){
          obj["supplier_code"]=search.supplier_code
        }
        if(search.supplier_name!=""&& search.supplier_name!=null&&search.supplier_name!=undefined){
          obj["supplier_name"]=search.supplier_name
        }
        if(search.supplier_state!=""&& search.supplier_state!=null&&search.supplier_state!=undefined){
          obj["supplier_state"]=search.supplier_state.id
        }
        if(search.composite!=""&& search.composite!=null&&search.composite!=undefined){
          obj["composite"]=search.composite.id
        }
        if(search.gstno!=""&& search.gstno!=null&&search.gstno!=undefined){
          obj["gstno"]=search.gstno
        }
        if(search.panno!=""&& search.panno!=null&&search.panno!=undefined){
          obj["panno"]=search.panno
        }
        if(search.vendor_status!=""&& search.vendor_status!=null&&search.vendor_status!=undefined){
          obj["vendor_status"]=search.vendor_status.id
        }
        if(search.is_active!=""&& search.is_active!=null&&search.is_active!=undefined){
          obj["is_active"]=search.is_active.id
        }
        if(search.is_block!=""&& search.is_block!=null&&search.is_block!=undefined){
          obj["is_blocked"]=search.is_block.id
        }

        this.send_value = ""
        this.vendorsummaryreportObjNew = { "method": "post", "url": this.atmaUrl + "venserv/vendor_report",params:"&is_excel=0",data:obj}
      //   this.reportservice.getVendorSummarySearch(obj, this.pageSize).subscribe(results => {
      //     this.vendorSummaryList = results['data']
      //     let dataPagination = results['pagination'];
      //     if (this.vendorSummaryList.length >= 0) {
      //     this.has_next = dataPagination.has_next;
      //     this.has_previous = dataPagination.has_previous;
      //     this.presentpage = dataPagination.index;
      //     this.isVendorSummaryPagination = true;
      //     } if (this.vendorSummaryList <= 0) {
      //       this.isVendorSummaryPagination = false;
      //     }
      //     this.SpinnerService.hide();

      //    console.log("VendorSearchSummary", results)
      // })

      }

      reportdownload(){
        this.SpinnerService.show();
        let search = this.vendorsummaryForm.value
        console.log("Search Values", search)
        let obj = 
        {
          
        }

        if(search.vendor_code!=""&& search.vendor_code!=null&&search.vendor_code!=undefined){
          obj["vendor_code"]=search.vendor_code
        }

        if(search?.date_from != '' && search?.date_from != null && search?.date_from != undefined && search?.date_to != '' && search?.date_to !=null && search?.date_to !=undefined){
          obj["date_from"]=this.datepipe.transform(search?.date_from, 'yyyy-MM-dd')
          obj['date_to']=this.datepipe.transform(search?.date_to, 'yyyy-MM-dd')
         }

         if(search?.date_from == '' && search?.date_to != ''){
           this.SpinnerService.hide()
           this.notification.showError("Please fill From Date")
           return false 
         }
         if(search?.date_to == '' && search?.date_from != ''){
           this.SpinnerService.hide()
           this.notification.showError("Please fill to Date")
           return false 
         }

        if(search.vendor_name!=""&& search.vendor_name!=null&&search.vendor_name!=undefined){
          obj["vendor_name"]=search.vendor_name
        }
        if(search.activity_type!=""&& search.activity_type!=null&&search.activity_type!=undefined){
          obj["activity_type"]=search.activity_type
        }
        if(search.activity_description!=""&& search.activity_description!=null&&search.activity_description!=undefined){
          obj["activity_description"]=search.activity_description.name
        }
        if(search.activity_department!=""&& search.activity_department!=null&&search.activity_department!=undefined){
          obj["activity_department"]=search.activity_department.id
        }
        if(search.supplier_code!=""&& search.supplier_code!=null&&search.supplier_code!=undefined){
          obj["supplier_code"]=search.supplier_code
        }
        if(search.supplier_name!=""&& search.supplier_name!=null&&search.supplier_name!=undefined){
          obj["supplier_name"]=search.supplier_name
        }
        if(search.supplier_state!=""&& search.supplier_state!=null&&search.supplier_state!=undefined){
          obj["supplier_state"]=search.supplier_state.id
        }
        if(search.composite!=""&& search.composite!=null&&search.composite!=undefined){
          obj["composite"]=search.composite.id
        }
        if(search.gstno!=""&& search.gstno!=null&&search.gstno!=undefined){
          obj["gstno"]=search.gstno
        }
        if(search.panno!=""&& search.panno!=null&&search.panno!=undefined){
          obj["panno"]=search.panno
        }
        if(search.vendor_status!=""&& search.vendor_status!=null&&search.vendor_status!=undefined){
          obj["vendor_status"]=search.vendor_status.id
        }
        if(search.is_active!=""&& search.is_active!=null&&search.is_active!=undefined){
          obj["is_active"]=search.is_active.id
        }
        if(search.is_block!=""&& search.is_block!=null&&search.is_block!=undefined){
          obj["is_blocked"]=search.is_block.id
        }
        this.reportservice.newreportdwnsum(obj).subscribe((result) => {
          this.SpinnerService.hide()
         if(result.status =="success"){
          this.showsummarypopup = true;
          this.notification.showSuccess("Success")
         }
         else{
          this.SpinnerService.hide();
          this.notification.showError(result.message)
          this.showsummarypopup = false;
         }
  
        })

       
      }
      newreportdownload(newreports){
        this.newreportids =newreports.id
        this.SpinnerService.show();
        this.reportservice.downloadreport(this.newreportids).subscribe(results => { 
          this.SpinnerService.hide();  
          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = "Vendor Summary Report.xlsx";
          link.click();
          this.showsummarypopup = false;
          this.getnewvendorsummary();
    })
      }

      resetForm(){
        this.vendorsummaryForm.reset();
      }

      
      statename(){
        let statekeyvalue: String = "";
        this.getState(statekeyvalue);
    
        this.vendorsummaryForm.get('supplier_state').valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
              console.log('inside tap')
    
            }),
    
            switchMap(value => this.atmaService.get_state(value,1)
              .pipe(
                finalize(() => {
                  this.isLoading = false
                }),
              )
            )
          )
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.stateList = datas;
    
          })
    
      }

      stateScroll() {
        setTimeout(() => {
          if (
            this.matstateAutocomplete &&
            this.autocompleteTrigger &&
            this.matstateAutocomplete.panel
          ) {
            fromEvent(this.matstateAutocomplete.panel.nativeElement, 'scroll')
              .pipe(
                map(x => this.matstateAutocomplete.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(x => {
                const scrollTop = this.matstateAutocomplete.panel.nativeElement.scrollTop;
                const scrollHeight = this.matstateAutocomplete.panel.nativeElement.scrollHeight;
                const elementHeight = this.matstateAutocomplete.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if (this.has_next === true) {
                    this.atmaService.get_state(this.stateInput.nativeElement.value, this.currentpage + 1)
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        this.stateList = this.stateList.concat(datas);
                        if (this.stateList.length >= 0) {
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

      
      private getState(statekeyvalue) {
        this.atmaService.getStateSearch(statekeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.stateList = datas;
            console.log("state", datas)
    
          })
      }

      activitynamedropdown(){
        let desgkeyvalue: String = "";
        this.getactivitynamedropdown(desgkeyvalue);
    
        this.vendorsummaryForm.get('activity_department').valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
              console.log('inside tap')
    
            }),
            switchMap(value => this.atmaService.activitynamedrop(value, this.namecurrentpage=1)
              .pipe(
                finalize(() => {
                  this.isLoading = false
                }),
              )
            )
          )
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.acitivitydropdowndata = datas;
            let datapagination = results["pagination"];
            
            if (this.acitivitydropdowndata.length >= 0) {
              this.name_has_next = datapagination.has_next;
              this.name_has_previous = datapagination.has_previous;
              this.namecurrentpage = datapagination.index;
            }
    
          })
     
      }

      private getactivitynamedropdown(desgkeyvalue) {
        this.atmaService.activitynamedrop(desgkeyvalue,this.namecurrentpage=1)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.acitivitydropdowndata = datas;
            // console.log("designation", datas)
            let datapagination = results["pagination"];
            
            if (this.acitivitydropdowndata.length >= 0) {
              this.name_has_next = datapagination.has_next;
              this.name_has_previous = datapagination.has_previous;
              this.namecurrentpage = datapagination.index;
            }
    
          })
      }

      public displayFnDesg(desg:any): string | undefined {
        // console.log('id', desg.id);
        // console.log('name', desg.name);
        return desg ? desg.name : undefined;
      }

      activitynameauto() {
        setTimeout(() => {
          if (
            this.nameautocomplete &&
            this.autocompleteTrigger &&
            this.nameautocomplete.panel
          ) {
            fromEvent(this.nameautocomplete.panel.nativeElement, 'scroll')
              .pipe(
                map(x => this.nameautocomplete.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(x => {
                const scrollTop = this.nameautocomplete.panel.nativeElement.scrollTop;
                const scrollHeight = this.nameautocomplete.panel.nativeElement.scrollHeight;
                const elementHeight = this.nameautocomplete.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if (this.has_next === true) {
                    this.atmaService.activitynamedrop(this.activitynameInput.nativeElement.value, this.namecurrentpage + 1)
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        this.acitivitydropdowndata = this.acitivitydropdowndata.concat(datas);
                        if (this.acitivitydropdowndata.length >= 0) {
                          this.name_has_next = datapagination.has_next;
                          this.name_has_previous = datapagination.has_previous;
                          this.namecurrentpage = datapagination.index;
                        }
                      })
                  }
                }
              });
          }
        });
      }


      activitydesignationsearch(value,page){
        this.isLoading=true
        this.atmaService.getactivitydesignation(value,page).subscribe(
          result => {
            this.isLoading=false
            this.activitydesignationdata=result['data']
            let pagination=result['pagination']
            if (this.activitydesignationdata.length >= 0) {
              this.activitydesign_has_next = pagination.has_next;
              this.activitydesign_has_previous = pagination.has_previous;
              this.activitydesign_currentpage = pagination.index;
            }
          }
        )
      }

      public displayFnactdescrition(desg?: actdescription): string | undefined {
        // console.log('id', desg.id);
        // console.log('name', desg.name);
        return desg ? desg.name : undefined;
      }

      activitydescriptionautocomplete(){
        setTimeout(() => {
          if (
            this.activitydescriptioninput &&
            this.autocompleteTrigger &&
            this.activitydescriptioninput.panel
          ) {
            fromEvent(this.activitydescriptioninput.panel.nativeElement, 'scroll')
              .pipe(
                map(x => this.activitydescriptioninput.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(x => {
                const scrollTop = this.activitydescriptioninput.panel.nativeElement.scrollTop;
                const scrollHeight = this.activitydescriptioninput.panel.nativeElement.scrollHeight;
                const elementHeight = this.activitydescriptioninput.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if (this.has_next === true) {
                    this.atmaService.getactivitydesignation(this.activitydescriptioninput.nativeElement.value, this.activitydesign_currentpage + 1)
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        let pagination = results["pagination"];
                        this.activitydesignationdata = this.activitydesignationdata.concat(datas);
                    
                        if (this.activitydesignationdata.length >= 0) {
                          this.activitydesign_has_next = pagination.has_next;
                          this.activitydesign_has_previous = pagination.has_previous;
                          this.activitydesign_currentpage = pagination.index;
                        }
                      })
                  }
                }
              });
          }
        });
      }

      descriptionselected(value){
        this.vendorsummaryForm.patchValue({
          "description_id": (value.id)? value.id:'',
        });
      }
    


      getGST() {
        this.atmaService.getComposite()
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.GSTlist = datas;
          })
      }
      public displayFnGST(gstcat?: GST): string | undefined {
        return gstcat ? gstcat.text  : undefined;

      }
    
      get gstcat() {
        return this.vendorSearchForm.value.get('composite');
      }
      getsummary(page){
        this.service.vendorlevelsummary(this.search_value, 1, page)
        .subscribe(result => {
          console.log("RESULSSS", result)
          console.log("RESULSSS", typeof result)
          if (result.data) {
            this.vendorSummaryList = result['data']
            this.count = result['count']
            let dataPagination = result['pagination'];
            if (this.vendorSummaryList.length >= 0) {
              this.has_next = dataPagination.has_next;
              this.has_previous = dataPagination.has_previous;
              this.presentpage = dataPagination.index;
              this.isVendorSummaryPagination = true;
  
            } if (this.vendorSummaryList.length <= 0) {
              this.isVendorSummaryPagination = false;
            }
            this.SpinnerService.hide();
            // this.vendorSearchForm.reset()
  
          }
  
          this.SpinnerService.hide();
  
        },
          error => {
            console.log('search error', error)
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
        )
      }
      reportdown(viewtype){

        this.SpinnerService.show();

        let requeststatus1 =this.vendorSearchForm.value.requeststatus;
        let requeststatus = requeststatus1?.id
        let activestatus1 = this.vendorSearchForm.value.is_active;
        let activestatus = activestatus1?.id
        let blockedstatus1 = this.vendorSearchForm.value.is_block;
        let blockedstatus = blockedstatus1?.id

        // if(requeststatus == '' || requeststatus == null || requeststatus == undefined){
        //   requeststatus =''
        // }
        // if(activestatus == '' || activestatus == null || activestatus == undefined ){
        //   activestatus =''
        // }
        // if(blockedstatus == '' || blockedstatus == null || blockedstatus == undefined ){
        //   blockedstatus =''
        // }
        if (requeststatus === '' || requeststatus === null || requeststatus === undefined) {
          requeststatus = ''
        } else if (requeststatus === 0) {
          requeststatus = 0;
        }
        
        if (activestatus === '' || activestatus === null || activestatus === undefined) {
          activestatus = ''
        } else if (activestatus === 0) {
          activestatus = 0;
        }
        
        if (blockedstatus === '' || blockedstatus === null || blockedstatus === undefined) {
          blockedstatus = ''
        } else if (blockedstatus === 0) {
          blockedstatus = 0;
        }
        
        this.reporttype = this.vendorSearchForm.value.reporttype

        let data={
          "vendor_status" : requeststatus,
          "is_active" :     activestatus,
          "is_blocked" :    blockedstatus
        }

        for (let i in data) {
          if (data[i] === null || data[i] === "" || data[i]=== undefined) {
            delete data[i];
          }
        }

        this.is_excel = viewtype
        this.service.vendorlevelreport(this.is_excel,this.reporttype,data)
        .subscribe(result => {
          this.SpinnerService.hide();
          if(result.status =="success"){
            this.showsummarypopup = true;
            this.notification.showSuccess("Success")
           }
           else{
            this.SpinnerService.hide();
            this.notification.showError(result.message)
            this.showsummarypopup = false;
           }








          // let data= JSON.parse(result)
// console.log('data')
          // if (result instanceof Blob) {
          //   if(result.type != 'text/html'){
          //     this.SpinnerService.hide()
          //     this.notification.showError('No Records Found')
          //     return false
          //   }

          //   else{
          // let binaryData = [];
          // binaryData.push(result)
          // let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          // let link = document.createElement('a');
          // link.href = downloadUrl;
          // let date: Date = new Date(); 
          // link.download = 'Vendorreport' + date + ".xlsx";
          // link.click();
          //   }
          // }
          // else if (typeof result === 'object') {
 
          //   this.notification.showError("No data Found")
          // } else {
          //   // Handle unexpected result types
          //   console.error('Unexpected result type:', typeof result);
          // }
      
          // this.SpinnerService.hide();
        },
          error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
  
        )
      }

    
      previousClick() {
        this.page_search = true;
        this.presentpage = this.presentpage - 1
        this.vendorsearch(this.presentpage)
      }
      nextClick() {
        this.page_search = true;
        this.presentpage = this.presentpage + 1
        this.vendorsearch(this.presentpage)
      }
      vendorsearch(page) {
        this.getsummary(page)
      }

      selectreporttype(data){
        // this.reporttype=data
        this.vendorSearchForm.get('requeststatus').reset();
        this.vendorSearchForm.get('is_active').reset();
        this.vendorSearchForm.get('is_block').reset();

        if(data == 1){
          this.vendorreport = true;
          this.supplierreport = false;
          this.vendorwithsupplierreport = false;
          this.activevendorsupplier = false;
          this.vendorsummaryreport = false;

        }
        if(data == 2){
          this.vendorreport = false;
          this.supplierreport = true;
          this.vendorwithsupplierreport = false;
          this.activevendorsupplier = false;
          this.vendorsummaryreport = false;


        }
        if(data == 3){
          this.vendorreport = false;
          this.supplierreport = false;
          this.vendorwithsupplierreport = true;
          this.activevendorsupplier = false;
          this.vendorsummaryreport = false;

        }
        if(data == 4){
          this.vendorreport = false;
          this.supplierreport = false;
          this.vendorwithsupplierreport = false;
          this.activevendorsupplier = true;
          this.vendorsummaryreport = false;
        }

        if(data == 5){
          this.vendorreport = false;
          this.supplierreport = false;
          this.vendorwithsupplierreport = false;
          this.activevendorsupplier = false;
          this.vendorsummaryreport = true;
          // this.getVendorSummary(this.vendorsummaryForm.value,this.pageSize);
        }

      }

      clearsearch(){
        this.vendorSearchForm.get('requeststatus').reset();
        this.vendorSearchForm.get('is_active').reset();
        this.vendorSearchForm.get('is_block').reset();
        
      }
      vendorView(vendor){

      }
      rejectPopup(vendor,vendor1){

      }
      togglechange(id){
        if(id===1){
         
          
        }
      }
   
}
