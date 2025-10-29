import { Component, OnInit, ViewChild } from '@angular/core';
import { RmuApiServiceService } from '../rmu-api-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
@Component({
  selector: 'app-archivaladmin',
  templateUrl: './archivaladmin.component.html',
  styleUrls: ['./archivaladmin.component.scss']
})
export class ArchivaladminComponent implements OnInit {
  @ViewChild("closeaddpopup") closeaddpopup;
  archivalsummaryapi:any
  archivalsummary:any
  archivalsearch:any
  archivalsearchvar: any = "String";
  Archivalcode: any
  Archivalvendor:any
  Archivalstatus:any
  archivalpopupsummary:any
  archivalpopupsummaryapi:any
  id: any;
  archivalpopup1summary:any
  archivalpopup1summaryapi:any
  archivalpopup2summary:any
  archivalpopup2summaryapi:any
  constructor(private rmuservice:RmuApiServiceService, public router: Router, private fb: FormBuilder) { 
    
  this.archivalsummary = [{"columnname": "Archival Code", "key": "archival_code"},{"columnname": "Date", "key": "archival_date",type: "Date", "datetype": "dd-MMM-yyyy"},{"columnname": "No of Boxes", "key": "num_of_boxes"},{"columnname": "Requested By", "key": "employee", type: "object",objkey: "name"},{"columnname": "Branch", "key": "branch",type: "object",objkey: "name"},{"columnname": "Status", "key": "archival_status",type: "object",objkey: "value"},{"columnname": "Archival Contact",icon: "contacts",style: {cursor:"pointer"}, button: true, function: true,clickfunction: this.getsinglerecord.bind(this)},{"columnname": "Archival Details ",icon: "payment",style: {cursor:"pointer"}, button: true, function: true,clickfunction: this.getboxlevel.bind(this)},{"columnname": "Archival Document ",icon: "file_copy",style: {cursor:"pointer"}, button: true, function: true,clickfunction: this.getfilelevel.bind(this)}]
  this.archivalsummaryapi = {"method": "get", "url": this.url + "rmuserv/archival_admin",params: ""}
  this.archivalpopup1summary = [{"columnname": "Archival Date", "key": "archival_date",type: "Date", "datetype": "dd-MM-yyyy"},{"columnname": "Barcode Type", "key": "barcode_type",type: "object",objkey: "name"},{"columnname": "Barcode No", "key": "barcode_no"},{"columnname": "Vendor", "key": "vendor",type: "object",objkey: "name"},{"columnname": "Status", "key": "archival_status",type: "object",objkey: "value"}]
  this.archivalpopup2summary = [{"columnname": "Product Type", "key": "product","type": "object", "objkey": "name"}, {"columnname": "Product Barcode", "key": "product_barcode"},{"columnname": "Retention Date", "key": "retention_date",type: "Date", "datetype": "dd-MM-yyyy"},{"columnname": "Status", "key": "archival_status",type: "object", "objkey": "value"}]
  this.Archivalcode= {
    label: "Archival Code",
    method: "get",
    url: this.url + "rmuserv/archival_admin",
    params: "",
    searchkey: "query",
    displaykey: "archival_code",
    Outputkey: "archival_code",
  };

  this.Archivalvendor= {
    label: "Vendor",
    method: "get",
    url: this.url + "rmuserv/vendor",
    params: "",
    searchkey: "query",
    displaykey: "name",
    Outputkey: "name",
  };

  this.Archivalstatus= {
    label: "Archival Status",
    method: "get",
    url: this.url + "rmuserv/archival_admin",
    params: "",
    searchkey: "query",
    displaykey: "archival_code",
    Outputkey: "archival_code",
  };
  this.archivalsearch = [
    { type: "dropdown", inputobj: this.Archivalcode, formvalue: "archival_code"},
    { type: "date", label: "Uploaded Date", formvalue: "date"},
    { type: "dropdown", inputobj: this.Archivalvendor, formvalue: "name"},
    { type: "dropdown", inputobj: this.Archivalstatus, formvalue: "status"}
    
  ];

this.archivalpopupsummary =  [{"columnname": "Archival Code", "key": "archival_code"},{"columnname": "Archival Date", "key": "archival_date",type: "Date", "datetype": "dd-MMM-yyyy"},{"columnname": "Requested Person", "key": "contact_person", type: "object",objkey: "name"},{"columnname": "Address", "key": "contact_address"},{"columnname": "Requested Person", "key": "archival_code"},{"columnname": "Vendor", "key": "vendor",type: "object",objkey: "name"},{"columnname": "Status", "key": "archival_status",type: "object",objkey: "value"}]
  }
  
  

  archivalform: FormGroup;
  summarylist=[];  
  vendors: any;
  //pagination
  limit = 10;
  pagination={
    has_next:false,
    has_previous:false,
    index:1
  }
  url = environment.apiURL
  singlerecord:any= [];
  boxlevellists = [];
  filelevellists =[];

  ngOnInit(): void {

    this.archivalform = this.fb.group({

      archCode:'',
      archDate: '',
      vendor:'',
      archStatus:'',

    })

    this.getbssummary()

    this.rmuservice.getvendors()
    .subscribe(result => {
      this.vendors= result['data']


    })
  }

  nextpage(){
    if(this.pagination.has_next){
      this.pagination.index = this.pagination.index+1
    }
    this.getbssummary()
  }

  prevpage(){
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1

    }
    this.getbssummary()
  }

  getbssummary(){
   
    this.rmuservice.getarchivaladminsummary('',this.pagination.index).subscribe(results =>{
      if(!results){
        return false;
      }
      this.summarylist = results['data'];
      this.pagination = results.pagination?results.pagination:this.pagination;
    })
  }

  returnHome()
  {
    
    this.router.navigate(['rmu/adminpage'],{}); 
  }

  getsinglerecord(datas)
  {
    //singlerecord\
    this.popupopen()
    console.log("Datas", +datas)
this.archivalpopupsummaryapi = {"method": "get", "url": this.url + "rmuserv/archival_request/"+ datas.id ,params:"" }
    // this.rmuservice.getsinglerecord(datas.id).subscribe(results =>{
    //   this.singlerecord = results;
    //   console.group(results);
    //   this.pagination = results.pagination?results.pagination:this.pagination;
    //   if (results.status == 'success') {
        //this.notification.showSuccess("Records Uploaded Successfully")
      // }
      // else
      // {
     // this.notification.showError(results.description)

    //   }
      
    // })
  }

  getboxlevel(data)
  {
this.popupopen_details()
this.archivalpopup1summaryapi = {"method": "get", "url": this.url + "rmuserv/archival_get",params:"&archivalrequest=" + data.id }
    // this.rmuservice.getboxlevel(data.id).subscribe(results =>{
    //   this.boxlevellists = results.data;
    
    //   this.pagination = results.pagination?results.pagination:this.pagination;
    //   if (results.status == 'success') {
        //this.notification.showSuccess("Records Uploaded Successfully")
      // }
      // else
      // {
     // this.notification.showError(results.description)

    //   }
      
    // })
    
  }

  getfilelevel(datas)
  {

    console.log("Datas coming",+datas)

//     this.data = this.service.getUser().subscribe((user)=>{
//       console.log('user', user);
//       this.service.getBlogById(user.id).subscribe((blog)=>{
//         console.log('blog', blog);
//         this.service.getCategoryByBlogId(blog.postId).subscribe((category)=>{
//           console.log('category', category);
//         })
//       })
// })
this.popupopen_document()
this.archivalpopup2summaryapi = {"method": "get", "url": this.url + "rmuserv/archival_details_get",params:"&archival_id=" + datas.id }
    // this.rmuservice.getboxlevel(datas.id).subscribe((res)=>{
    // this.rmuservice.getfilelevel(res.data[0].id).subscribe(results =>{
    //   console.log(res.data[0].id);
    //   this.filelevellists = results.data;
    
    //   this.pagination = results.pagination?results.pagination:this.pagination;
    //   if (results.status == 'success') {
        //this.notification.showSuccess("Records Uploaded Successfully")
      // }
      // else
      // {
     // this.notification.showError(results.description)

  //     }
  //   })
  // })

  }

  
  prevpages(){
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1

    }
  //  this.getarchivalsummary()

  }

  nextpages(){

    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1

    }
  
   // this.getboxlevel(id, code, date)()

  }

  
  prevpagess(){
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1

    }
  //  this.getarchivalsummary()

  }

  nextpagess(){

    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1

    }
  
   // this.getboxlevel(id, code, date)()

  }

  popupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("singlerecordform"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }

  closedpopup() {
    this.closeaddpopup.nativeElement.click();
  }
  popupopen_details() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("boxlevelform"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }


  popupopen_document() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("filelevelform"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }

  archivalsummarysearch(archival){
    this.archivalsummaryapi = {"method": "get", "url": this.url + "rmuserv/archival_admin",params:archival}
  }

}
