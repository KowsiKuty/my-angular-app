import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RmuApiServiceService } from '../rmu-api-service.service';
import { environment } from 'src/environments/environment';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
@Component({
  selector: 'app-retrieval-admin-summary',
  templateUrl: './retrieval-admin-summary.component.html',
  styleUrls: ['./retrieval-admin-summary.component.scss','../rmustyles.css']
})

export class RetrievalAdminSummaryComponent implements OnInit {
  @ViewChild("closeretrivalpopup") closeretrivalpopup;
  url = environment.apiURL
  summarylist = []
  summaryform: FormGroup
  retrievalmethod = [];
  retrievaltype = [];
  statuslist = []
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  imageSrc = null;
  delivery_person = '';
  contact_no = '';
  comments = '';
  file: File
  historylist=[];
  retrievaladminsearchvar:any = "String";
  retrievaladminsearch:any
  retrievalcode:any
  retrievalvendor:any
  retrievalstatus:any
  constructor(private rmuservice: RmuApiServiceService, private fb: FormBuilder, public router: Router) { 
    this.retrievalcode= {
      label: "Retrieval Type",
      method: "get",
      url: this.url + "rmuserv/common_dropdown",
      params: "&code=retrieval_type",
      searchkey: "query",
      displaykey: "name",
      Outputkey: "name",
    };
  
    this.retrievalvendor= {
      label: "Retrieval Method",
      method: "get",
      url: this.url + "rmuserv/common_dropdown",
      params: "&code=retrieval_method",
      searchkey: "query",
      displaykey: "name",
      Outputkey: "name",
    };
  
    this.retrievalstatus= {
      label: "Status",
      method: "get",
      url: this.url + "rmuserv/common_dropdown",
      params: "&code=vendor_retrieval_status",
      searchkey: "query",
      displaykey: "name",
      Outputkey: "name",
    };
    this.retrievaladminsearch = [
      {"type":"input","label":"Retrieval Code","formvalue":"code"},
      { type: "date", label: "Delivery Date", formvalue: "date", required: true}, 
      { type: "dropdown", inputobj: this.retrievalcode, formvalue: "archival_code"},
      { type: "dropdown", inputobj: this.retrievalvendor, formvalue: "name"},
      { type: "dropdown", inputobj: this.retrievalstatus, formvalue: "status"}]
  }

  ngOnInit(): void {
    this.summaryform = this.fb.group({
      product: null,
      department: '',
      retrieval_type: "1",
      retrieval_method: "1",
      status: null,
      delivery_date: null,

    })
    this.rmuservice.getretmethod().subscribe(res => {
      this.retrievalmethod = res['data']
    })
    this.rmuservice.getrettype().subscribe(res => {
      this.retrievaltype = res['data']
    })
    this.rmuservice.getvendorretrievalstatus().subscribe(res => {
      this.statuslist = res['data']
    })
    this.getarsummary()

  }

  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.getarsummary()
  }

  prevpage() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1
    }
    this.getarsummary()
  }
  getarsummary() {
    this.rmuservice.getarsummary('', this.pagination.index).subscribe(results => {
      if (!results) {
        return false
      }
      this.summarylist = results['data'];
      this.pagination = results.pagination ? results.pagination : this.pagination;
    })
  }

  getrethistory(data){
    this.popupopen_retrival_admin()
    this.rmuservice.getrethistory(data.id).subscribe(res=>{
      this.historylist = res[ "history"]
    })
  }
  getretrievalcovernote(id) {
    this.rmuservice.getretrievalpdf(id.id).subscribe(results => {
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      // this.filesrc = downloadUrl;
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${id}.pdf`;
      link.click();
    })
  }
  retrieval_archivalsummary:any = [{"columnname": "Retrieval Code", "key": "id"},{"columnname": "Raised By","key": "maker",type: "object",objkey: "code"},{"columnname": "Raised On","key": "request_date", "type": 'date',"datetype": "dd-MMM-yyyy"},{"columnname": "Retrieval Type","key": "retrieval_type",type: "object",objkey: "name"},{"columnname": "Status", "key": "retrieval_status",type: "object",objkey: "name"},{"columnname": "Approved By","key": "approver_id",type: "object",objkey: "code"},{"columnname": "Approved On","key": "approved_date","type": 'date',"datetype": "dd-MMM-yyyy"},{"columnname": "Download","icon":"download", button:true,function:true ,clickfunction:this.getretrievalcovernote.bind(this)},{ "columnname": "History","icon":"visibility", button:true,function:true ,clickfunction:this.getrethistory.bind(this) }]
  retrieval_archivalsummaryapi:any ={"method": "get", "url": this.url + "rmuserv/retrivaldata",params: ""}

  // Raised(data){
  //   console.log("zxczxzxds", data)
  // let config = {
  //           disabled: false,
  //           style: '',
  //           icon: '',
  //           class: '',
  //           value: "",
  //           function:false
  //         };
          
  //         config ={
  //           disabled: false,
  //           style: '',
  //           icon: '',
  //           class: '',
  //           value: (data.maker.branch.code),
  //           function:false
  //         }
  //         return config
  // }
  closedpopup() {
    this.closeretrivalpopup.nativeElement.click();
  }
  popupopen_retrival_admin() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("historypopup"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  
  retrievaladminsummarysearch(retrieval){
    this.retrieval_archivalsummaryapi={"method": "get", "url": this.url + "rmuserv/retrivaldata",params: retrieval}
  }
}
