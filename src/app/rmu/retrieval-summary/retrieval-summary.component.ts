import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RmuApiServiceService } from '../rmu-api-service.service';
import { NotificationService } from 'src/app/service/notification.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-retrieval-summary',
  templateUrl: './retrieval-summary.component.html',
  styleUrls: ['./retrieval-summary.component.scss', '../rmustyles.css']
})

export class RetrievalSummaryComponent implements OnInit {
   rmuurl = environment.apiURL
  summaryform: FormGroup;
  titleobject = { maker: 'Retrieval Request Summary', checker: 'Retrieval Approval Summary' };
  title: string;
  actionlist = [];
  queryparams = {
    retrieval: 'new',
    applevel: 1,
    status: 1,
    actionid: null
  };
  summarylist = []
  retrievaltype = [];
  retrievalmethod = [];
  productlist = []
  //pagination
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  maker: boolean;
  retcode: null;
  retid: null;
  delivery_person: null;
  contact_no: null;
  comments: null;
  retrieval_summary_search:any
  retrievalbutton:any
  inputobjchip:any
  inputobj1:any
  inputobj2:any
  retrieval_summary:any
  retrieval_summaryapi:any
  searchretrivelvar:any = "String"
  constructor(private fb: FormBuilder, private router: Router, private rmuservice: RmuApiServiceService, private notify : NotificationService,private SpinnerService: NgxSpinnerService) {
    this.inputobjchip = {"method": "get", "url": this.rmuurl +"rmuserv/product_master","searchkey":"name",params:"","displaykey":"name","label":"product",Outputkey: 'id'}
    this.inputobj1 = {"method": "get", "url": this.rmuurl +"rmuserv/common_dropdown","searchkey":"name",params:"&code=retrieval_type","displaykey":"name","label":"Retrieval Type",Outputkey: 'id'}
    this.inputobj2 = {"method": "get", "url": this.rmuurl +"rmuserv/common_dropdown","searchkey":"name",params:"&code=retrieval_checker","displaykey":"name","label":"View For",Outputkey: 'id'}
    this.retrieval_summary_search = [{"type":"input",label: "Retrieval Code",formvalue:"code"},{"type":"dropdown",inputobj:this.inputobjchip,formvalue:"campaignchip"},{"type":"dropdown",inputobj:this.inputobj1,formvalue:"type"},{"type":"dropdown",inputobj:this.inputobj2,formvalue:"view"}]
    this.retrievalbutton =[{"icon":"add", function:this.navtoform.bind(this)}]
    this.retrieval_summaryapi ={"method": "get", "url": this.rmuurl + "rmuserv/retrivaldata",params: "&role=1"}
    this.retrieval_summary = [{"columnname": "Requested Date","key": "request_date", "type": 'date',"datetype": "dd-MMM-yyyy"},{"columnname": "Products", "key": "product",type: "object",objkey: "name"},{"columnname": "Retrieval Type","key": "retrieval_type",type: "object",objkey: "name"},{"columnname": "Approver","key": "approver_id",type: "object",objkey: "code"},{"columnname": "Retrieval Status", "key": "retrieval_status",type: "object",objkey: "name"},{"columnname": "Vendor Status","key": "vendor_status",type: "object",objkey: "name"},{"columnname": "Status","key": "expriy_date"},{"columnname": "Download","icon":"download", button:true,function:true ,clickfunction:this.getretrievalcovernote.bind(this)},{ "columnname": "Edit","icon":"edit", button:true,function:true ,clickfunction:this.editlist.bind(this) }]
   
   }

  ngOnInit(): void {
    this.summaryform = this.fb.group({
      product: null,
      department: '',
      retrieval_type: null,
      // retrieval_method: "1",
      role: null
    })
    this.rmuservice.getretmethod().subscribe(res => {
      this.retrievalmethod = res['data']
    })
    this.rmuservice.getrettype().subscribe(res => {
      this.retrievaltype = res['data']
    })
    this.rmuservice.getproducts().subscribe(res => {
      this.productlist = res['data']
    })
    this.rmuservice.getrole('retrieval_checker').subscribe(res => {
      this.actionlist = res['data']
      this.summaryform.patchValue({ role: this.actionlist[0].value })
      this.getrrsummary('');

    })



  }

  editlist(data) {
    this.queryparams.retrieval = data.id;
    this.queryparams.applevel = data.applevel;

    if (data.applevel > 1) {
      this.queryparams.actionid = data.approving_id;
    }
    this.queryparams.status = data.retrieval_status.value;
    this.SpinnerService.show()
    this.router.navigate(['rmu/retrievalform'], { queryParams: this.queryparams });
  }

  navtoform() {
    this.queryparams,
      this.router.navigate(['rmu/retrievalform'], { queryParams: this.queryparams });
    // this.router.navigateByUrl('rmu/retrievalform',{state:this.queryparams});
  }

  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.getrrsummary('')
  }

  prevpage() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1

    }
    this.getrrsummary('')
  }
  getrrsummary(data) {
    var val = this.summaryform.value;
    if (Number(val.role) > 1) {
      this.title = this.titleobject['checker']
      this.maker = false;
    }
    else {
      this.maker = true;
      this.title = this.titleobject['maker']
    }
    for (let item in val) {
      !val[item] ? delete val[item] : true
    }
    val = Object.keys(val).map(key => key + '=' + val[key]).join('&');
    this.summarylist = [];
    this.rmuservice.getrrsummary(val, this.pagination.index,data).subscribe(results => {
      if (!results) {
        return false;
      }
      this.summarylist = results['data'];
      this.pagination = results.pagination ? results.pagination : this.pagination;
    })
  }

  returnsubmit() {
    var payload = {
      data: {
        id: this.retid,
        return_request: 1
      }
    }

    // Return request from maker changes in payload
    this.rmuservice.submitretrieval(payload).subscribe();
  }

  getdespatch(id) {
    this.rmuservice.getdespatchdetails(id).subscribe(res => {
      let response = res['data'][0]
      this.contact_no = response.contact_no;
      this.delivery_person = response.delivery_person;
      this.comments = response.comments
    })

  }

  getretrievalcovernote(id) {
    this.rmuservice.getretrievalpdf(id).subscribe(results => {
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

  addNextArchive()
  {
    this.notify.showSuccess("File added to next archival process")
  }


  retrievalsummarySearch(retrieval){
    this.retrieval_summaryapi ={"method": "get", "url": this.rmuurl + "rmuserv/retrivaldata",params: "&role=1" + retrieval}
  }
}

