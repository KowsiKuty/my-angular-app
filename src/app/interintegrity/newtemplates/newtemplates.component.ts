import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { InterintegrityApiServiceService } from '../interintegrity-api-service.service'; 
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { data } from 'jquery';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";

import { Wisefintemplate } from '../models/wisefintemplate';
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from 'src/environments/environment';

import { MatPaginator, PageEvent} from '@angular/material/paginator';
import { identity } from 'rxjs';

@Component({
  selector: 'app-newtemplates',
  templateUrl: './newtemplates.component.html',
  styleUrls: ['./newtemplates.component.scss']
})
export class NewtemplatesComponent implements OnInit {
  tempedit: any;
  tempdel: any;
  data: boolean;
  is_tempdel: any;
  checked: any;
  status: any;
  temp_edit: any;
  temp_name_edit: any;
  status_array:any=[{value:"Active",id:1},{value:"Inactive",id:0}]
  showInfo: any;
  templatebutton:any
  wisefine_id: any;
  cbs_id: any;
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    if(event.code =="Escape"){
      this.spinnerservice.hide();
    }
  }
  interurl = environment.apiURL
  @ViewChild('closeaddpopup') closeaddpopup; 

  constructor(private fb: FormBuilder, private notification: NotificationService, private interService: InterintegrityApiServiceService,public spinnerservice: NgxSpinnerService,
    private router: Router) { 
      this.SummaryApinewtempObjNew = {
        method: "get",
          url: this.interurl + "integrityserv/template"
      }
      this.uploadsearch=[
        {"type":"input","label":"Template Name","formvalue":"template_name"},
        // {"type":"input","label":"Description","formvalue":"description"},
        // {"type":"dropdown",inputobj:this.statusfield,formvalue:"status"},  
         ]

         this.templatebutton = [{icon: "add","tooltip":"Add Template",function: this.openBrsform.bind(this), "name": "ADD Template"}]
    }

    summarylist = [];
    singleList = [];
    summaryslist=[];
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  } 
  SummaryApinewtempObjNew: any;

  iscommonincomeSummaryPagination: boolean = false;
  has_next=true;
  has_previous=true;
  getnewtemplateList:any
  currentpage: number = 1;
  pagesize=1;
  presentpage: number = 1;

  displayedColumns: string[] = [ 'template_name', 'account_desc','running_balance', 'edit', 'status'];

  public dataSource : MatTableDataSource<Wisefintemplate>;

  public dataArray : any;

  pageSize = 10;
  pageIndex = this.pagination.index;
  SummaryApiappoObjNew: any;

  totalRecords = 0;
  datassearch: FormGroup;
  templateedit: FormGroup;
  templateeditform: FormGroup;
  templateeditsform: FormGroup;

  primary: any;

  accounts: any;
  templates : any;
  Column_type: string;
  ctypes : string[] = ['Single Column', 'Seperate Column'];
  singleColumn : boolean = false;
  multiColumns : boolean = false;
  amount_type: any;
  amount_types: any;
  uploadsearch: any;
  searchvar :any = "String";
  id: any;
  payload: any;
  header_fas_array: any[]=[]
  header_cbs_array: any[]=[]
  ngOnInit(): void {
     this.gettemplatedata();

      this.datassearch = this.fb.group({
        template_name: '',
        account_name:'',
        // delims:'',
        status:'',
        description:""
      })
      this.templateeditform = this.fb.group({
      gl_number:'',
      date:'',
      amount:'',
      branchcode:''
     
      });
    

      this.templateeditsform = this.fb.group({
        gl_code:'',
        date:'',
        amount:'',
        branch_code:'',
        gl_description:'',
        gl_ccy_code:''

      })
  
  }
  

  gettemplatedata() {

    this.interService.getNtemplates(this.pagination.index).subscribe(results => {
      if (!results) {
        return false;
      }
      this.summarylist = results['data'];
      // this.archstatus = this.vendorarchivallist[0].archival_status.value;
      // console.log(this.archstatus)

      this.dataArray = results['data'] ;
      this.dataSource = new MatTableDataSource<Wisefintemplate> (this.dataArray);
      this.pagination = results.pagination ? results.pagination : this.pagination;
    })
  }

  deletetemplate(value)
  {
    this.interService.deleteNtemplates(value).subscribe(results => {
      if (results.status == 'Successfully Updated') {
        this.notification.showSuccess("Template  Successfully Updated...")
      
      }
      else {
        this.notification.showError(results.description)

      }
    })
  }

  deletetemplatess(data){
    this.id = data.id;
    this.status = data.status;

    
  // this.tempdel=data.id
    // if (this.status == 1) {
    //   this.payload = {
    //     id: this.id,
    //     status: data.status,
    //   };
    // } else if (this.status == 0) {
    //   this.payload = {
    //     id: this.id,
    //     status: data.status,
    //   };
    // }
    console.log("",data)
 this.interService.deleteNtemplate(this.id,this.status).subscribe((result) => {
  // if (result.id > 0 || result.id != undefined) {
  //   if (result.status) {
  //     this.notification.showSuccess("Blocked Success");
  //    this.searchupload('')
  //   } else {
  //     this.notification.showSuccess("UnBlocked Success");
  //     this.searchupload('')

  //   }
  //   return false;
  // } 
  if (result.status == "success") {
    this.notification.showSuccess(result.message)
    this.SummaryApinewtempObjNew = {
      method: "get",
        url: this.interurl + "integrityserv/template"
    }
      }
  else {
      this.notification.showError(result.description);
 }
 })

  }

  openBrsform()
  {
    this.router.navigate(['interintegrity/newwisefintemp'],{}); 
    this.showInfo()
  }

  viewsinglerecord(vals)
  {
    this.interService.getNsingletemplate(vals).subscribe(results => {
      if (!results) {
        return false;
      }
      this.summaryslist = results['data'];
      // this.archstatus = this.vendorarchivallist[0].archival_status.value;
      // console.log(this.archstatus)
      this.pagination = results.pagination ? results.pagination : this.pagination;
    })
  }
  editDatas(data){
    // this.editDatass(data),
    this.editsDatas(data)
  }

  editsDatas(data)
  {
    this.popupopen1()
    console.log("",data)
    // let page = 1
    this.tempedit=data.id
    this.temp_name_edit=data.template_name
    console.log("temp_name_edit",this.temp_name_edit)
    this.spinnerservice.show()
    this.interService.templateSeditss(this.temp_name_edit).subscribe(results => {
      console.log("editvalue",results)
      this.wisefine_id=results.wisefine.id
      this.cbs_id=results.cbs.id
      this.templateeditform.patchValue({
        // id: results.cbs?.id,
        date: results.wisefine?.date,
        gl_number: results.wisefine.gl_number,
        amount: results.wisefine.amount,
        branchcode: results.wisefine.branchcode,
       })
       this.templateeditsform.patchValue({
        // id: results.id,
        gl_code:results.cbs.gl_code,
        date:results.cbs.date,
        amount:results.cbs.amount,
        branch_code:results.cbs.branch_code,
        gl_description:results.cbs.gl_description,
        gl_ccy_code:results.cbs.gl_ccy_code
       })
       this.datassearch.patchValue({
        template_name:results.cbs.template_name,
        description:results.wisefine.description
       })
       this.spinnerservice.hide()
  })

}
editDatass(data)
{
  // let page = 1
  let template = data.template_name
  let temp=data.id
  this.interService.templateSStmtedits(temp,"").subscribe(results => {
  console.log("",data)
  this.templateeditsform.patchValue({
    id: data.id,
    gl_code:data.gl_code,
    date:data.date,
    amount:data.amount,
    branch_code:data.branch_code,
    gl_description:data.gl_description,
    gl_ccy_code:data.gl_ccy_code
   })
  })

 
  //  this.serverValues = data.amount_types

    // this.amount_types = 0;
  //  this.changeColumn(event);


//   this.brsService.getNsingletemplate(data).subscribe(results => {
//     if (!results) {
//       return false;
//     }
//     this.singleList = results['data'];
 
//     this.pagination = results.pagination ? results.pagination : this.pagination;

// })
}



viewsinglerecords(vals)
{
  this.interService.getNsingletemplate(vals).subscribe(results => {
    if (!results) {
      return false;
    }
    this.summaryslist = results['data'];
  
    this.pagination = results.pagination ? results.pagination : this.pagination;
  })
}

prevpage()
  {
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1
    }
    this.gettemplatedata();


  }
  nextpage()
  {
    if(this.pagination.has_next){
      this.pagination.index = this.pagination.index+1
    }
    this.gettemplatedata();
  }

  // getnewtemplatesumm(page=1) {
  //   this.spinnerservice.show()
  //   this.interService.getnewtemplateSummary(page)
  //   .subscribe(result => {
  //     this.spinnerservice.hide()
  //     console.log("RESULSSS", result);
  //     let datas = result['data'];
  //     this.getnewtemplateList = datas;
  //     let datapagination = result["pagination"];
  //     this.getnewtemplateList = datas;
  //     if (this.getnewtemplateList.length >= 0) {
  //     this.has_next = datapagination.has_next;
  //     this.has_previous = datapagination.has_previous;
  //     this.currentpage = datapagination.index;
  //   }
  //   })
  //   }

    nextClickif() {
      if (this.has_next === true) {
        this.getnewtemplateList(this.presentpage + 1, 10);
      }
    }
    previousClickif() {
      if (this.has_previous === true) {
        this.getnewtemplateList(this.presentpage - 1, 10);
      }
    }


inputColumns(event)
  {
    if(this.Column_type == "Single Column")
    {
      this.singleColumn = true;
      
    }
  }

  changeColumn(event)
  {
    if(this.templateeditform.controls['amount_type'].value == 0)
    {
      let val : number = 1
      // let newValue : number = parseInt(val); 
      // this.userTable.controls['amount_type']. = newValue;
      
      this.singleColumn = true;
      this.multiColumns = false;
      // this.templateeditform.get('amount_type').setValue(val); 
    }
    if(this.templateeditform.controls['amount_type'].value == 1)
    {
      let newValue : any = "" ; 
      let vals = "type";
      // this.userTable.controls['amount_type']. = newValue;
      // this.userTable.get('credit_debit').setValue(vals); 

      // this.templateeditform.get('credit_debit').setValue(newValue); 
      // this.templateeditform.get('credit_name').setValue(newValue); 
      // this.templateeditform.get('debit_name').setValue(newValue); 
      this.singleColumn = false;
      this.multiColumns = true;
      // this.templateeditform.get('amount_type').setValue(newValue); 

    }
  }

  // UpdateForms()
  // {
  //   this.interService.templateSedit(this.templateeditform.value,this.templateeditsform).subscribe(results => {
  //     if (results.status == 'success') {
  //       this.notification.showSuccess("Template Updated Successfully ...")
  //       this.closepopup.nativeElement.click();
  //       // this.gettemplatedata();
  //     }
  //     else {
  //       this.notification.showError(results.description)

  //     }
  //   })

  // }
 
  // UpdateForms1()
  // {
  //   this.interService.templateSStmtedit(this.templateeditsform.value).subscribe(results => {
  //     if (results.status == 'success') {
  //       this.notification.showSuccess("Template Updated Successfully ...")
  //       this.closepopup.nativeElement.click();
  //       // this.gettemplatedata();

  //     }
  //     else {
  //       this.notification.showError(results.description)

  //     }
  //   })
  // }

 updateformss()
 {
  console.log("",data)  
  let payload = {
      "wisefin" :{
         "id":this.wisefine_id,
         "template_name":this.datassearch.get('template_name').value,
         "description":this.datassearch.get('description').value,
         "gl_number":this.templateeditform.get('gl_number').value,
          "date": this.templateeditform.get('date').value, 
          "amount":this.templateeditform.get('amount').value,
          "branchcode":this.templateeditform.get('branchcode').value,
      },
      "cbs":{
        "id":this.cbs_id,
        "template_name":this.datassearch.get('template_name').value,
        "gl_code":this.templateeditsform.get('gl_code').value,
        "date":this.templateeditsform.get('date').value,
        "amount":this.templateeditsform.get('amount').value,
        "branch_code":this.templateeditsform.get('branch_code').value,
        "gl_description":this.templateeditsform.get('gl_description').value,
        "gl_ccy_code":this.templateeditsform.get('gl_ccy_code').value,
    
      }
     }
  this.interService.templateSedit(payload,this.temp_name_edit).subscribe(results => {
    if (results.status == 'success') {
      this.notification.showSuccess("Template Updated Successfully ...")
      this.closeaddpopup.nativeElement.click();
        }
    else {
      this.notification.showError(results.description)

    }
  })

 } 
 
 back()
 {
   this.router.navigate(['interintegrity/newtemplates'],{});
 }
close(){
  this.closeaddpopup.nativeElement.click();
}
 togglefunction(data) {
  let config: any = {
    disabled: false,
    style: "",
    class: "",
    value: "",
    checked: "",
    function: true,
  };
  if (
    data.status == 1
  ) {
    config = {
      disabled: false,
      style: "",
      class: "success",
      value: "",
      checked:true,
      function: true,
    };
  } else if (
    data.status == 0
  ) {
    config = {
      disabled: false,
      style: "",
      class: "",
      value: "",
      checked: false,
      function: true,
    };
  }
  return config;
}
  SummarynewtemplateData:any = [
    {columnname: "Template Name", key: "template_name"},
    {columnname:"Description",key:"description"},
    {columnname:" Edit",icon:"edit","style":{color:"black",cursor:"pointer"},
    button: true, function: true, clickfunction: this.editsDatas.bind(this),},  
    { columnname: "Status", key: "status", toggle: true, function: true, 
      clickfunction: this.deletetemplatess.bind(this),"style":{color:"green",cursor:"pointer"}, validate: true, validatefunction: this.togglefunction.bind(this)}, 
   ]
 
  searchupload(e){

    this.SummaryApinewtempObjNew = {
      method: "get",
        url: this.interurl + "integrityserv/template",
        "params": e 
    }
  }
  popupopen1() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("editdatas"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }
  statusfield:any= {
    label: "status",
          fronentdata: true,
          data: this.status_array,
          displaykey: "id",
          Outputkey: "id",
          valuekey: "id",
  }
}
