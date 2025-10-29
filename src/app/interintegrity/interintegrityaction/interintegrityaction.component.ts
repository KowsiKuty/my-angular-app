import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from 'src/app/service/notification.service';
import { InterintegrityApiServiceService } from '../interintegrity-api-service.service';
import { environment } from 'src/environments/environment';
import { fontWeight } from 'html2canvas/dist/types/css/property-descriptors/font-weight';

declare var bootstrap: any;
@Component({
  selector: 'app-interintegrityaction',
  templateUrl: './interintegrityaction.component.html',
  styleUrls: ['./interintegrityaction.component.scss']
})
export class InterintegrityactionComponent implements OnInit {

  url = environment.apiURL
  inputdataarray: any[] = []
  mainform: FormGroup;
  mainscreen: boolean = true
  showsummary: any;
  fileuploadsearch: FormGroup;
  dblinksearch: FormGroup;
  apicallsearch: FormGroup;
  @ViewChild("closebuttonclosed") closebuttonclosed: ElementRef;
  @ViewChild("closebuttonclosepopup") closebuttonclosepopup: ElementRef;
  dblinkcreationform: FormGroup;
  apicallcreationform: FormGroup;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  limit = 10;
  summarylists: any[] = []
  mainpage: boolean = true
  routetonext: boolean = false
  historytab: boolean = false
  file_id: any;
  file1_type: any;
  file2_type: any;
  integrity_id: any;
  mainform1: FormGroup;
  statuslist = [{ name: 'Active', id: '1' }, { name: 'In active', id: '0' }]
  isExpandedscard:boolean = true
  integritysearch:any
  integritysearchvar: any = "String"
  integritypopup_summary:any
  interintegrity_popup_summaryapi:any
  integrity_summary:any
  interintegrity_summaryapi:any
  statusfield:any
  integritychecked:boolean = false
  intergrityfield:any
  intergrity2field:any
  restforminteraction:any
  restforminteraction2:any
  @ViewChild('closeintegritypopup')closeintegritypopup
  integrity_name: any;
  constructor(
    private fb: FormBuilder,
    private notification: NotificationService,
    public interService: InterintegrityApiServiceService,
    private toster: ToastrService,
    private router: Router,
    config: NgbCarouselConfig,
    private SpinnerService: NgxSpinnerService,
  ) { 
    this.statusfield = {
      label: "status",
      fronentdata: true,
      data: this.statuslist,
      displaykey: "name",
      Outputkey: "id",
      valuekey: "id",
    };

    this.intergrityfield = { label: "File 1 Input Data", "method": "get", "url": this.url + "integrityserv/upload_type", params: "", "searchkey": "query", "displaykey": "file1_type",  Outputkey: "id"}
    this.intergrity2field = { label: "File 2 Input Data", "method": "get", "url": this.url + "integrityserv/upload_type", params: "", "searchkey": "query", "displaykey": "file1_type",  Outputkey: "id"}

    this.interintegrity_summaryapi = { method: "get",
      url: this.url + "integrityserv/multi_integrity_uploads",
      params: ""}
    this.integrity_summary = [{"columnname": "Integrity Name", "key": "integrity_name"},{"columnname": "Last Run Date", "key": "run_date"},{"columnname": "Scheduler Trigger Date", "key": "trigger_date"},{"columnname": "Status", "key": "integrity_status", "style":{cursor: "pointer"},   toggle: true,function: true,clickfunction: this.deletetemplate.bind(this),validate: true,validatefunction: this.togglefunction.bind(this)},{"columnname": "Edit", "key": "edited",button: true,icon: 'edit',"style":{cursor: "pointer"},function: true,clickfunction: this.editdata.bind(this)},{"columnname": "Action", "key": "action",icon: 'arrow_right_alt',"style":{cursor: "pointer",fontWeight:800}, button: true,function: true,clickfunction: this.routetonextpage.bind(this)},{"columnname": "History", "key": "history",icon: 'visibility',"style":{cursor: "pointer"}, button: true,function: true,clickfunction: this.historyview.bind(this)}]
    this.integritysearch =[ { "type": "input", "label": "Integrity Name", "formvalue": "name" },{ type: "dropdown", inputobj: this.statusfield, "label": "Status", "formvalue": "status"}]
    this.integritypopup_summary =  [{"columnname": "Integrity Code", "key": "code"},{"columnname": "Transaction Date", "key": "transaction_date", "type": "date","datetype": "dd/MM/yyyy"},{"columnname": "Integrity Run Date", "key": "integrity_run_date","type": "date","datetype": "dd/MM/yyyy"},{"columnname": "Count", "key": "count"},{"columnname": "Template Name", "key": "temp_name"}]
  }

  ngOnInit(): void {

    this.mainform = this.fb.group({
      template_name: [''],
      file1_type: [''],
      file2_type: [''],
      periodicity: [null],
      ars_type: [null]

    });
    this.mainform1 = this.fb.group({
      template_name: [''],
      file1_type: [''],
      file2_type: [''],
      periodicity: [null],
      ars_type: [null],

    });
    this.fileuploadsearch = this.fb.group({
      intigrity: [''],
      status: ['']
    })
    this.dblinksearch = this.fb.group({
      dbname: [''],
      username: ['']
    })
    this.apicallsearch = this.fb.group({
      endpoint: [''],
      description: [''],
      status: ['']
    })
    this.dblinkcreationform = this.fb.group({
      ipaddress: [''],
      port: [''],
      dbname: [''],
      user: [''],
      password: ['']
    })
    this.apicallcreationform = this.fb.group({
      endpoint: [''],
      payload: [''],
      description: [''],
    })
    this.interService.inputdata().subscribe(results => {
      this.inputdataarray = results['data']
    })
    this.fileupload_search()
  }
  proceedmainscreen() {
    let formvalue = this.mainform.value
    if (formvalue.template_name === '' || formvalue.template_name === null || formvalue.template_name === undefined) {
      this.notification.showError('Enter Inter Inegrity Name')
      return
    }
    if (formvalue.file1_type === '' || formvalue.file1_type === null || formvalue.file1_type === undefined) {
      this.notification.showError('Choose File1 type')
      return
    }
    if (formvalue.file2_type === '' || formvalue.file2_type === null || formvalue.file2_type === undefined) {
      this.notification.showError('Choose File2 type')
      return
    }
    if (formvalue.periodicity === null || formvalue.periodicity === '' || formvalue.periodicity === undefined) {
      this.notification.showError('Choose Periodicity')
      return
    }
    if (formvalue.ars_type === null || formvalue.ars_type === '' || formvalue.ars_type === undefined) {
      this.notification.showError('Choose ARS')
      return
    }
    let value = this.mainform.value
    value.periodicity = parseInt(value.periodicity)
    value.ars_type = parseInt(value.ars_type)
    // this.showsummary = value
    console.log(value, 'value')
    this.SpinnerService.show()
    this.interService.svae_inegrity(this.mainform.value).subscribe(res => {
      this.SpinnerService.hide()
      if (res.status) {
        this.notification.showSuccess(res.message)
        this.fileupload_search()
        this.interintegrity_summaryapi = { method: "get",
          url: this.url + "integrityserv/multi_integrity_uploads",
          params: ""}
        this.mainform.reset()
        this.restforminteraction = []
        this.restforminteraction2 = []
      }
      else {
        this.notification.showError(res.description)
      }
    })
    // this.allformreset()
  }
  fileupload_search() {
    let value = this.fileuploadsearch.value
    let params = ''
    if (value.intigrity) {
      params += '&name=' + value.intigrity
    }
    if (value.status === 1 || value.status === 0) {
      params += '&status=' + value.status
    }
    this.fileuploadsummary(params)
  }
  fileupload_reset() {
    this.pagination.index = 1
    this.fileuploadsearch.reset()
    this.fileupload_search()
  }

  apicall_submit() {
    let value = this.apicallcreationform.value
    console.log('value', value)
  }
  allformreset() {
    this.fileuploadsearch.reset()
    this.dblinksearch.reset()
    this.apicallsearch.reset()
    this.dblinkcreationform.reset()
    this.apicallcreationform.reset()
  }
  fileuploadsummary(params) {
    this.SpinnerService.show()
    this.interService.inter_file_summary(this.pagination.index, params).subscribe(res => {
      this.SpinnerService.hide()
      this.summarylists = res['data']
      this.pagination = res.pagination
    })
  }
  deletetemplate(data) {
    console.log(data)
    let status: any = ''
    if (data.integrity_status === 0) {
      status = 1
    }
    else {
      status = 0
    }
    this.interService.inter_file_statuschange(data.id, status).subscribe(res => {
      if (res.status) {
        this.notification.showSuccess(res.message)
        this.interintegrity_summaryapi = { method: "get",
          url: this.url + "integrityserv/multi_integrity_uploads",
          params: ""}
      }
      else {
        this.notification.showError(res.description)
      }

    })
  }
  prevpage() {
    this.pagination.index = this.pagination.index - 1
    this.fileupload_search()
  }
  nextpage() {
    this.pagination.index = this.pagination.index + 1
    this.fileupload_search()
  }
  routetonextpage(data) {
    this.routetonext = true
    this.historytab = false
    this.mainpage = false
    this.file_id = data.id
    this.file1_type = data.file1_type
    this.file2_type = data.file2_type
    this.integrity_name=data.integrity_name
  }
  handleValueSelection(selectedValue: any) {
    console.log(selectedValue)
    this.routetonext = selectedValue
    this.historytab = selectedValue
    this.mainpage = true
    this.ngOnInit()
  }
  historyview(data){
    this.file_id=data.id
    // this.routetonext=false
    // this.historytab=true
    // this.mainpage=false
    this.interintegrity_popup_summaryapi = { method: "get",
      url: this.url + "integrityserv/knockoff_list",
      params: "&int_type=" + this.file_id }
    this.popupopenhistroy()
   
  }
  editdata(data) {
    this.integrity_id = data.id
    this.mainform1.patchValue({
      template_name: data.integrity_name,
      periodicity: data.periodicicty,
      ars_type: data.ars_type
    })
    for (let x of this.inputdataarray) {
      if (data.file1_type === x.file1_type) {
        this.mainform1.patchValue({

          file1_type: x.id
        })
      }
      if (data.file2_type === x.file1_type) {
        this.mainform1.patchValue({
          file2_type: x.id
        })
      }
    }
    this.popupopenviewdata()
  }
  updateintegrity() {
    let formvalue = this.mainform1.value
    if (formvalue.template_name === '' || formvalue.template_name === null || formvalue.template_name === undefined) {
      this.notification.showError('Enter Inter Inegrity Name')
      return
    }
    if (formvalue.file1_type === '' || formvalue.file1_type === null || formvalue.file1_type === undefined) {
      this.notification.showError('Choose File1 type')
      return
    }
    if (formvalue.file2_type === '' || formvalue.file2_type === null || formvalue.file2_type === undefined) {
      this.notification.showError('Choose File2 type')
      return
    }
    if (formvalue.periodicity === null || formvalue.periodicity === '' || formvalue.periodicity === undefined) {
      this.notification.showError('Choose Periodicity')
      return
    }
    if (formvalue.ars_type === null || formvalue.ars_type === '' || formvalue.ars_type === undefined) {
      this.notification.showError('Choose ARS')
      return
    }
    let value = this.mainform1.value
    value.periodicity = parseInt(value.periodicity)
    value.ars_type = parseInt(value.ars_type)
    value.id = this.integrity_id
    // this.showsummary = value
    console.log(value, 'value')
    this.SpinnerService.show()
    this.interService.svae_inegrity(this.mainform1.value).subscribe(res => {
      this.SpinnerService.hide()
      if (res.status) {
        this.notification.showSuccess(res.message)
        this.fileupload_search()
        this.mainform1.reset()
        this.closebuttonclosepopup.nativeElement.click();
      }
      else {
        this.notification.showError(res.description)
      }
    })
  }
  popupopenviewdata() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("updatedata"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }
  
  togglefunction(intergrity) {
    let config: any = {
      disabled: false,
      style: "",
      class: "",
      value: "",
      checked: "",
      function: false,
    };
  
    if(intergrity.integrity_status == 1){
      config = {
        disabled: false,
        style: "",
        class: "success",
        value: "",
        checked: !this.integritychecked,
        function: true,
      };
  
    }
    else if (intergrity.integrity_status == 0){
      config = {
        disabled: false,
        style: "",
        class: "",
        value: "",
        checked: this.integritychecked,
        function: true,
      };
    }
    return config
  }
  
  
  searchinterintegrity(interintegrity){
    this.interintegrity_summaryapi = { method: "get",url: this.url + "integrityserv/multi_integrity_uploads",params:interintegrity }
  }
  
  popupopenhistroy() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("historypopup"),
      {
        keyboard: false,
      }
    );
    myModal.show();
  }
  
  close(){
    this.closeintegritypopup.nativeElement.click()
  }

  integritydata(data){
    this.mainform.patchValue({
      file1_type:data
    })
  }

  integrity2data(data){
    this.mainform.patchValue({
      file2_type:data
    })
  }
}
