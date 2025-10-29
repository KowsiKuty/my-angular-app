import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RmuApiServiceService } from '../rmu-api-service.service';
import {  ArchivalformComponent} from '../archivalform/archivalform.component'
import { ReturnrequestComponent} from '../returnrequest/returnrequest.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../service/notification.service';
import { ViewarchivalComponent } from '../viewarchival/viewarchival.component';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

// import { arch } from 'os';
// import { AnyRecordWithTtl } from 'dns';
import { environment } from 'src/environments/environment';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";

@Component({
  selector: 'app-archival-summary',
  templateUrl: './archival-summary.component.html',
  styleUrls: ['./archival-summary.component.scss','../rmustyles.css']
})
export class ArchivalSummaryComponent implements OnInit {
  url = environment.apiURL
  summaryarchival: FormGroup;
  cancelrequest: FormGroup;
  createLegitimates: FormGroup;
  searchpresentpage: any = 1
  archivalsummarylist=[]; 
  boxlevellists = [];
  filelevellists =[];
  singlerecord:any= [];
  user : string;
  limit = 10;
  pagination={
    has_next:false,
    has_previous:false,
    index:1
  }
  queryparams={
    archival:'new'
  };
  searchid:any;
  lists:any;
  archival_code: any;
  searcharchievalvar:any = "String"
  archstatus = {
    CANCELLED : "CANCELLED",
    SCHEDULED : "SCHEDULED",
    REQUESTED : "REQUESTED",
    
  }

  send_value:String="";
  archivalrequestForm: any;
  vendorlist: any;
  uploadfile: any;
  productlist: any;
  mychoice:boolean = true;
  addrdetails: any;
  emplogCode: any;
  emplogPhone: any;
  summarylist: any;
  @ViewChild('closebtn') closebtn: ElementRef;
  emplogId: any;
  archivalsummaryData:any
  archivalsummary:any
  @ViewChild("closearchivalecode") closearchivalecode;
  archival_summary_search:any
  archievalbutton:any
  vendor_drop:any
  vendor_status:any
  globalid: any;
  archieval_summaryapi:any
  archival_summary:any
  archival_summary_popup:any
  archival_summary_popup1:any
  archieval_summaryapi_popup:any
  constructor(private fb: FormBuilder, private router:Router, public dialog: MatDialog,private rmuservice:RmuApiServiceService, private notification: NotificationService, private SpinnerService:NgxSpinnerService) {
    this.archivalsummaryData = [{"columnname": "Archival Code", "key": "archival_code"},{"columnname": "Date", "key": "archival_date",type: "Date","datetype": "dd-MM-yyyy"},{"columnname": "No Of Boxes", "key": "num_of_boxes"},{"columnname": "Status", "key": "archival_status","type": "object", "objkey": "value"},{"columnname": "Box Level ",icon: "payment",style: {cursor:"pointer"},button: true, function: true,clickfunction: this.getboxlevel.bind(this)},{"columnname": "File Level ",icon: "insert_drive_file",style: {cursor:"pointer"},button: true, function: true,clickfunction: this.getfilelevel.bind(this)}]
    this.archivalsummary = {"method": "get","url": this.url + "rmuserv/archival_maker" ,params:""}
    this.archival_summary_popup=  [{"columnname": "Archival Date", "key": "archival_date",type: "Date","datetype": "dd-MM-yyyy"},{"columnname": "Barcode Type", "key": "barcode_type","type": "object", "objkey": "name"},{"columnname": "Barcode No", "key": "barcode_no"},{"columnname": "Vendor", "key": "vendor","type": "object", "objkey": "name"},{"columnname": "Status", "key": "archival_status","type": "object", "objkey": "value"}]
    this.archival_summary_popup1=  [{"columnname": "Product", "key": "product",type: "object","objkey": "name"},{"columnname": "Product Barcode", "key": "product_barcode"},{"columnname": "Retention Date", "key": "retention_date",type: "Date","datetype": "dd-MM-yyyy"},{"columnname": "Status", "key": "archival_status",type: "object","objkey": "value"}]

    // this.vendor_drop = {
    //   label: "Status",
    //   method: "get",
    //   url: this.url + "rmuserv/common_dropdown",
    //   params: "&code=barcode_type",
    //   searchkey: "query",
    //   displaykey: "name",
    //   wholedata: true,
    // }
    // this.vendor_status = {
    //   label: "Status",
    //   method: "get",
    //   url: this.url + "rmuserv/common_dropdown",
    //   params: "&code=barcode_type",
    //   searchkey: "query",
    //   displaykey: "name",
    //   wholedata: true,
    // }
    // this.archival_summary_search = [{"type":"input","label": "Archival Code",formvalue:"vendor"}, {"type":"date","label":"Uploaded Date","formvalue":"transdate"},{"type":"dropdown",inputobj:this.vendor_drop,formvalue:"vendor"},{"type":"dropdown",inputobj:this.vendor_status,formvalue:"vendor"}]
    this.archival_summary_search = [{"type":"input","label": "Archival Code",formvalue:"code"},{"type":"date","label":"Uploaded Date","formvalue":"transdate"}]
    this.archievalbutton = [{icon: "add","tooltip":"rmutooltip",function: this.vendorpopupopen.bind(this), "name": "ADD" }]
  }


  ngOnInit(): void {
    this.summaryarchival = this.fb.group({
      archival_code: '',
      archival_date: '',
      vendor: null,
      action: '',
      archival_status : ''

    })
    this.cancelrequest = this.fb.group({
      id:'',
      comments:'',
    })
    this.createLegitimates = this.fb.group({
      barcode_no:'',
      legitimate_date:'',
      comment:'',
    })
    this.getarchivalsummary();
    // this.getapproversummary();
       this.archivalrequestForm = this.fb.group({
      archival_type: 1,
      barcode_type: 1,
      vendor: '',
      num_of_boxes: '',
      comments: '',
      filedata : '',
      productlist: '',
      contact_person:'',
      contact_no:'',
      contact_address:'',

    })

    this.getvendorValue();
    this.rmuservice.getproducts().subscribe(res => {
      this.productlist = res['data']
    })

    this.getaddres();
  }
  addNewArchival()
  {
    // this.dialog.open(ArchivalformComponent,
    //   {
    //   disableClose:true,
    //   width:'70%',
    //   panelClass:'mat-containerss'
    //   })
  }
  editarchival()
  {
    this.dialog.open(ArchivalformComponent,
      {
       disableClose: true,
       width:'60%',
       panelClass:'mat-container'
       //data: data 
      })
  }
  returnreq()
  {
    this.dialog.open(ReturnrequestComponent,
      {
       disableClose: true,
       width:'60%',
       panelClass:'mat-container'
       //data: data 
      })

  }

  nextpage(){
    if(this.pagination.has_next){
      this.pagination.index = this.pagination.index+1
    }
    this.getarchivalsummary()
  }

  prevpage(){
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1

    }
    this.getarchivalsummary()
  }

  prevpages(){
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1

    }
  //  this.getarchivalsummary()
  this.getfilelevel('');

  }

  nextpages(){

    if(this.pagination.has_next){
      this.pagination.index = this.pagination.index+1

    }
    this.getfilelevel('');
  
   // this.getboxlevel(id, code, date)()

  }


  getarchivalsummary(){
    
    this.rmuservice.getarchivalsummary(this.pagination.index).subscribe(results =>{
      this.archivalsummarylist = results['data'];
      this.pagination = results.pagination?results.pagination:this.pagination;
      if (results.status == 'success') {
        this.notification.showSuccess("Records Uploaded Successfully")
      }
      else
      {
      //this.notification.showError(results.description)

      }
      
    })
  }
  viewarchival()
  {
   
    this.queryparams,
    this.router.navigate(['rmu/viewarchival'],{queryParams: this.queryparams});
    
  
    // this.rmuservice.getarchivalboxlevel().subscribe(results =>{
    //   this.archivalsummarylist = results['data'];
    //  // this.pagination = results.pagination?results.pagination:this.pagination;
    //   if (results.status == 'success') {
    //     //this.notification.showSuccess("Records Uploaded Successfully")
    //   }
    //   else
    //   {
    //  // this.notification.showError(results.description)

    //   }
      
    // })
  }
  getsinglerecord(datas)
  {
    //singlerecord\
    console.log("Datas", +datas)

    this.rmuservice.getsinglerecord(datas).subscribe(results =>{
      this.singlerecord = results;
      console.group(results);
      this.pagination = results.pagination?results.pagination:this.pagination;
      if (results.status == 'success') {
        //this.notification.showSuccess("Records Uploaded Successfully")
      }
      else
      {
     // this.notification.showError(results.description)

      }
      
    })
  }

  deletesinglerecord()
  {
    console.log("CANCEL REQUESTS", this.cancelrequest.value.id)
    this.rmuservice.deleterecord(this.cancelrequest.value.id, this.cancelrequest.value.comments).subscribe(results =>{
      
      if (results.status == 'success') {
        this.notification.showSuccess("Archival Cancelled")
      }
      else
      {
     this.notification.showError(results.description)

      }
      
    })

  }
  getboxlevel(data)
  {
this.popupopen()
    // console.log("Datas coming",+id+code+date)

      this.archieval_summaryapi = {
        method: "get",
        url: this.url + "rmuserv/archival_get","params": "&archivalrequest="+ data.id
      };
  }

  getfilelevel(datas)
  {
this.popupopenfilelevelform()
this.archieval_summaryapi_popup = {
  method: "get",
  url: this.url + "rmuserv/archival_details_get","params": "&archival_id="+ datas.id
};
  }
  canceldata(data) {

    this.cancelrequest.patchValue({
      id: data.id,
      comments:''
      

    })
  }

  searcharchival()
  {
    let archCode = this.summaryarchival.value.archival_code
    let archDate = this.summaryarchival.value.archival_date
    let vendor = this.summaryarchival.value.vendor
    let status = this.summaryarchival.value.archival_status
    this.send_value = ''


    if (this.summaryarchival.value.archival_code != null || this.summaryarchival.value.archival_date != null || this.summaryarchival.value.vendor != null || this.summaryarchival.value.archival_status != null) {
      this.searchpresentpage = 1
      this.getarchivalsearches(archCode, archDate, vendor,status, this.searchpresentpage);

    }
  }

  getarchivalsearches(archCode, archDate, vendor,status, page)
  {
    this.SpinnerService.show();
    

    this.rmuservice.getarchivalsearch(archCode, archDate, vendor,status, page).subscribe(results=>{
      this.archivalsummarylist = results['data'];
      this.pagination = results.pagination?results.pagination:this.pagination;
      if(results.status=='success'){}
      else
      {

      }
    })


  }

  submitLegitimate()
  {
    console.log("Datas coming",)
    this.rmuservice.submitlegitimaterequest(this.createLegitimates.value).subscribe(results =>{
      this.boxlevellists = results.data;
    
      this.pagination = results.pagination?results.pagination:this.pagination;
      if (results.status == 'success') {
        this.notification.showSuccess("Legitmate document Successfully Created")
      }
      else
      {
      this.notification.showError(results.description)

      }
      
    })
  }

  legitimatedata(datas)
  {
    this.createLegitimates.patchValue({
      barcode_no:datas.id,
      legitimate_date:'',
      comment:'',
    })
  }

  deleteLegitimate(datas)
  {

    this.rmuservice.deletelegitimate(datas).subscribe(results =>{
      // this.boxlevellists = results.data;
    
      this.pagination = results.pagination?results.pagination:this.pagination;
      if (results.status == 'success') {
        this.notification.showSuccess("Legitimate Document Deleted")
      }
      else
      {
      this.notification.showError(results.description)

      }
      
    })

  }
  getvendorValue() {
    this.rmuservice.getvendors()
      .subscribe(result => {
        this.vendorlist = result['data']


      })
  }

  uploadchoose(evt) {
    this.uploadfile = evt.target.files[0];
    this.archivalrequestForm.get('filedata').setValue(this.uploadfile);

  }

  formatdownload() {
    if(this.archivalrequestForm.value.num_of_boxes==="" ||this.archivalrequestForm.value.num_of_boxes===undefined || this.archivalrequestForm.value.num_of_boxes===null){
      this.notification.showWarning("Please Enter the No. Of Boxes")
      return false
    }
    if(this.archivalrequestForm.value.vendor==="" ||this.archivalrequestForm.value.vendor===undefined || this.archivalrequestForm.value.vendor===null){
      this.notification.showWarning("Please Select the vendor")
      return false
    }
    if(this.archivalrequestForm.value.comments==="" ||this.archivalrequestForm.value.comments===undefined || this.archivalrequestForm.value.comments===null){
      this.notification.showWarning("Please Enter the Comments")
      return false
    }
    if(this.archivalrequestForm.value.contact_no==="" ||this.archivalrequestForm.value.contact_no===undefined || this.archivalrequestForm.value.contact_no===null){
      this.notification.showWarning("Please Enter the Phone Number")
      return false
    }
    let vals = this.archivalrequestForm.value.productlist;
    console.log("Product Value",+vals);
    this.rmuservice.archivalformatdownload(vals).subscribe(results => {
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'SampleFormat' + ".xlsx";
      link.click();
    })
  }

  enableAddress()
  {    
    this.mychoice = false;    
  }

  getaddres() {
    this.rmuservice.getaddress()
      .subscribe(result => {
        console.log("Address Data",result.address)
        this.addrdetails = result.address
        this.emplogCode = result.code
        this.emplogPhone = result.phone_number
        this.emplogId = result.employee_id;
        this.archivalrequestForm.patchValue({  contact_person: this.emplogCode })
        this.archivalrequestForm.patchValue({  contact_no: this.emplogPhone })    
      })
  }


  submitArchivalrequest(filedata) {
    if(filedata.filedata=='' || filedata.filedata== undefined || filedata.filedata == null){
      this.notification.showWarning('Please Choose The File');
      return false;
    }
    if (this.uploadfile) {
      // this.rmuservice.submitarchival(this.firstFormGroup.value, this.uploadform.get('filedata').value).subscribe(results => {
        
      this.archivalrequestForm.get('contact_person').setValue(this.emplogId);
        this.rmuservice.submitarchival(this.archivalrequestForm.value,  this.archivalrequestForm.get('filedata').value).subscribe(results => { 
      this.summarylist = results['data'];
        this.pagination = results.pagination ? results.pagination : this.pagination;
        if (results.status == 'success') {
          this.notification.showSuccess("Files Uploaded Successfully")
          this.closearchivalecode.nativeElement.click();
        }
        else
        {
        this.notification.showError(results.description);  
        }
      });
    }
  }


  popupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("boxlevelform"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }

  popupopenfilelevelform() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("filelevelform"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  vendorpopupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("addNew"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  closedpopup() {
    this.closearchivalecode.nativeElement.click();
  }


  archievalsummarySearch(archieval){
    this.archivalsummary = {"method": "get","url": this.url + "rmuserv/archival_maker" ,params:archieval}
  }
  
  

}