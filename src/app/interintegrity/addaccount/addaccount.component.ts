import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { Location } from '@angular/common';
import { InterintegrityApiServiceService } from '../interintegrity-api-service.service';
import { Addaccounts } from '../models/addaccounts';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

declare var bootstrap: any;
interface cycles {
  id: number,
  value: string;
  viewoption: string;
}


@Component({
  selector: 'app-addaccount',
  templateUrl: './addaccount.component.html',
  styleUrls: ['./addaccount.component.scss']
})
export class AddaccountComponent implements OnInit {
  Url = environment.apiURL
  viewDataTable: boolean = false;
  addAccountForm: boolean = true;
  viewDataLists: any = [];
  SummaryaddaccountData:any
  SummaryaddaccountObjNew:any
  SummaryviewaccountData:any
  SummaryviewaccountObjNew:any
  SummaryaddaccountsumData:any
  SummaryApiaddaccountObjNew:any
  constructor(private formBuilder: FormBuilder,
    private notification: NotificationService, private location: Location, private SpinnerService: NgxSpinnerService,
    private interService: InterintegrityApiServiceService) { 
      
      
      this.SummaryaddaccountsumData = [{"columnname": "account_no", "key":"name"},{"columnname": "am_accdescription", "key":"description"},{"columnname": "acc_runflag", "key":"log"}]
      this.SummaryApiaddaccountObjNew = {FeSummary: true, data:[{"id":"1","name":"1001","description":"Description1","log":"DAILY"},{"id":"2","name":"1002","description":"Description2","log":"MONTHLY"},{"id":"3","name":"1003","description":"Description3","log":"QUARTERLY"}]}
      this.SummaryaddaccountData = [{"columnname": "Account Number", "key": "acc_no"},{"columnname": "Description", "key": "acc_description"},{"columnname": "Cycle", "key": "acc_runflag", validate: true,validatefunction: this.accountstatus.bind(this),},{"columnname": "Edit", "key": "edit", "icon": "edit",style: { cursor: "pointer" }, button: true, function: true,clickfunction: this.accountedit.bind(this)},{"columnname": "Status", "key": "status",style: { cursor: "pointer" }, toggle: true, function: true,clickfunction: this.deleteaccount.bind(this), validate: true, validatefunction: this.togglefunction.bind(this)}]
      this.addaccountsearch = [{"type":"input","label":"Account Number","formvalue":"number"}]
      this.rulebutton = [{icon: "download","tooltip":"Download",function: this.downloadData.bind(this)},{icon: "add","tooltip":"add",function: this.popupopencreation.bind(this)}]
      this.SummaryaddaccountObjNew = { "method": "get", "url": this.Url + "integrityserv/account_master" }
      this.SummaryviewaccountData = [{"columnname": "File Name", "key": "file_name"},{"columnname": "Status", "key": "type"},{"columnname": "Download", "key": "download","icon": "download",style: { cursor: "pointer" }, button: true, function: true,clickfunction: this.downloadFile.bind(this)},{"columnname": "Delete", "key": "delete","icon": "delete",style: { cursor: "pointer" }, button: true, function: true,clickfunction: this.deleteFile.bind(this)}]
    this.SummaryviewaccountObjNew= { "method": "get", "url": this.Url + "integrityserv/account_master_upload"}
    }
  AddForm: FormGroup;
  searchForm: FormGroup;
  accounteditform: FormGroup;
  summarylists = [];
  @ViewChild('closeretrivalpopup') closeretrivalpopup;
  
  has_next = true;
  has_previous = true;
  currentpage = 1;
  pagesize = 10;
  accounts: any;
  filteredAccounts: any;
  uploadfile: any;
  uploadfile1: any;
  addaccountsearch:any;
  searchaccountsvar:any = "String";
  rulebutton:any;
  displayedColumns: string[] = ['acc_no', 'acc_description', 'acc_runflag', 'edit', 'status'];
  viewDataColumns: string[] = ['']
  optionValues: cycles[] = [
    { id: 0, value: 'DAILY', viewoption: 'DAILY' },
    { id: 7, value: 'WEEKLY', viewoption: 'WEEKLY' },
    { id: 6, value: 'FORTNIGHT', viewoption: 'FORTNIGHT' },
    { id: 1, value: 'MONTHLY', viewoption: 'MONTHLY' },
    { id: 2, value: 'QUARTERLY', viewoption: 'QUARTERLY' },
    { id: 3, value: 'HALFYEARLY', viewoption: 'HALFYEARLY' },
    { id: 4, value: 'YEARLY', viewoption: 'YEARLY' },
    { id: 5, value: 'NEVER', viewoption: 'NEVER' },
 ]
 
  public dataSource: MatTableDataSource<Addaccounts>;

  public dataArray: any;

  pageSize = 10;

  totalRecords = 0;


  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }

  pageIndex = this.pagination.index;
  send_value: String = "";
  totalCounts: any;

  @ViewChild('pageCol1') pageCol1: MatPaginator;

  ngOnInit(): void {

    this.AddForm = this.formBuilder.group({
      acc_no: '',
      // acc_name: '',

      acc_runflag: '',
      acc_description: '',
      filedatas: ''
    })

    this.accounteditform = this.formBuilder.group({
      acc_no: '',
      // acc_name: '',
      cycleValue: '',
      acc_description: '',
      acc_runflag: '',
      id: ''
    })
    this.searchForm = this.formBuilder.group({

      // acc_name: '',
      acc_no: '',
      filedatas:''

    })

    // this.interService.getaccountdata(this.pagination.index)
    //   .subscribe(result => {
    //     this.accounts = result['data']
    //     this.pagination=result.pagination
    //   })

    this.getaccdata();
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
  }

  accountedit(data) {
    const selectedCycle = this.optionValues.find(cycle => cycle.id === data.acc_runflag); // Replace 1 with the desired id
    // this.accounteditform.patchValue({
    //   acc_runflag: selectedCycle ? selectedCycle.value : ''
    // });
    this.accounteditform.patchValue({
      acc_no: data.acc_no,
      // acc_name: data.acc_name,
      acc_description: data.acc_description,
      acc_runflag: selectedCycle.value,
      // cycleValue: data.acc_run
      id: data.id
    })
    this.popupopenedit()
  }

  deleteaccount(val) {

    this.interService.deleteaccounts(val.id).subscribe(results => {
      if (results.status == 'Successfully Updated') {
        this.notification.showSuccess("Account Updated Successfully...")

      }
      else {
        this.notification.showError(results.description)

      }
    })

  }
  prevpage() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1
    }
    this.searchAccount();


  }
  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.searchAccount();
  }
  prevViewpage() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1
    }
    this.viewData();


  }
  nextViewpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.viewData();
  }
  editForm() {
    if (this.accounteditform.value.acc_no == '' || this.accounteditform.value.acc_no == null) {
      console.log(this.accounteditform.value.acc_no)
      this.notification.showError('Please Enter Account Number')
      throw new Error;
    }
    // if (this.accounteditform.value.acc_name == '' || this.accounteditform.value.acc_name == null) {
    //   console.log(this.accounteditform.value.acc_name)
    //   this.notification.showError('Please Enter Account Name')
    //   throw new Error;
    // }
    if (this.accounteditform.value.acc_description == '' || this.accounteditform.value.acc_description == null) {
      console.log(this.accounteditform.value.acc_description)
      this.notification.showError('Please Enter Account Description')
      throw new Error;
    }
    if (this.accounteditform.value.acc_runflag == '' || this.accounteditform.value.acc_runflag == null) {
      console.log(this.accounteditform.value.acc_runflag)
      this.notification.showError('Please Select Run Flag')
      throw new Error;
    }

    this.interService.accountSedit(this.accounteditform.value).subscribe(results => {
      if (results.status == 'success') {
        this.notification.showSuccess("Account Updated Successfully ...")
        this.closeretrivalpopup.nativeElement.click();
        this.getaccdata();
      }
      else {
        this.notification.showError(results.description)

      }
    })

  }

  getaccdata() {

    this.interService.getaccountdata(this.pagination.index).subscribe(results => {
      if (!results) {
        return false;
      }
      this.summarylists = results['data'];

      this.pagination = results.pagination ? results.pagination : this.pagination;

      this.dataArray = results['data'];
      this.dataSource = new MatTableDataSource<Addaccounts>(this.dataArray);

      // this.dataSource.paginator.length = this.totalCounts;

      // this.dataSource.sort = this.sortCol1;
    })
  }

  submitForm() {

    // this.brsService.accountS(this.AddForm.value)
    this.interService.accountS(this.AddForm.value).subscribe(results => {
      if (results.status == 'success') {
        this.notification.showSuccess("Account Added Successfully ...")
        this.getaccdata();
        this.AddForm.reset();
      }
      else {
        this.notification.showError(results.description)

      }
    })

  }

  accountuploads() {
    // this.SpinnerService.show();
    let file = this.AddForm.get("filedatas").value;

    this.interService.getAccountUpdate(this.uploadfile).subscribe(results => {
      // this.summarylist = results['data'];
      // this.getStmtdata();
      // this.SpinnerService.hide();
      this.pagination = results.pagination ? results.pagination : this.pagination;
      if (results.data) {
        this.notification.showSuccess("File Uploaded Successfully!")
        // this.closebtn.nativeElement.click();
      }
      else {
        this.notification.showError(results.description)
      }
    });
  }

  uploadchooses(evt) {
    this.uploadfile = evt.target.files[0];
    const fileExtension = this.uploadfile.name.split('.').pop().toLowerCase();
          if (fileExtension !== 'xlsx') {
            console.error('Invalid file type. Please upload an XLSX file.');
            this.notification.showError("Unsupported file type");
            this.AddForm.get('filedatas').reset()
            return;
          }
    this.AddForm.get('filedatas').setValue(this.uploadfile);

  }
  onSubmit() {

  }

  downloadData() {
    this.SpinnerService.show();
    this.interService.downloadAccount().subscribe(results => {
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "Accounts" + ".xlsx";
      link.click();
      this.SpinnerService.hide();


    })
  }

  clearSearch() {
    this.searchForm.reset();
    this.pagination.index=1
    this.getaccdata();
  }

  searchAccount() {
    let formValue = this.searchForm.value;
    console.log("Search Inputs", formValue)
    this.send_value = ""
    if (formValue.acc_no!==null) {
      let acNum = formValue.acc_no;
      console.log("ACC NAME", acNum)
      this.send_value = this.send_value + "&number=" + acNum

    }
      this.interService.getAccountSearch(this.send_value,this.pagination.index).subscribe(results => {
        this.dataArray = results['data'];
        this.pagination=results.pagination
        this.dataSource = new MatTableDataSource<Addaccounts>(this.dataArray);
      })
    
  }
  uploadData(){
    this.interService.getAccountUpdate(this.uploadfile1).subscribe(results => {
      console.log(results)
      this.notification.showSuccess("Scheduler triggered!");

      // if (results.status == "success") {
      //   this.notification.showSuccess("scheduler triggered");
      //   // this.getSchedulerstatus();
      // } else {
      //   this.notification.showError(results.code);
      // }
    })
  }
  uploadchoose(evt) {
    this.uploadfile1 = evt.target.files[0];
    this.searchForm.get("filedata").setValue(this.uploadfile1);
  }
  // setInitialValue() {
  //   const accRunFlagValue = 1; // Assuming the value is 1 from the JSON
  //   const selectedOption = this.optionValues.find(option => option.value === +accRunFlagValue);
  //   if (selectedOption) {
  //     this.accounteditform.get('acc_runflag').setValue(selectedOption.value);
  //   }
  // }
  viewData(){
    this.viewDataTable = true;
    this.addAccountForm = false;
    this.interService.getViewData(1).subscribe(results => {

      this.SpinnerService.show();
      this.viewDataLists = results['data'];
      this.pagination = results.pagination ? results.pagination : this.pagination;

      this.SpinnerService.hide();
      // if (results.status == "success") {
      //   this.notification.showSuccess("scheduler triggered");
      //   // this.getSchedulerstatus();
      // } else {
      //   this.notification.showError(results.code);
      // }
    })  }
  backToAcc(){
    this.viewDataTable = false;
    this.addAccountForm = true;  
  }
  downloadFile(data){
    let file = data.file_name;
    let id = data.id;
    let fileName = file;
  
    let FILE = fileName.split('.')[0];
    this.SpinnerService.show();
     this.interService.viewData_download(id).subscribe((results: any[])=> {
       this.SpinnerService.hide();
       let binaryData = [];
       binaryData.push(results)
       let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
       let link = document.createElement('a');
       link.href = downloadUrl;
       link.download = FILE+".xlsx";
       link.click();
     },
     (error) => {
       this.SpinnerService.hide();
     }
   );
  
  }
  deleteFile(data){
    let id = data.id;
    // let date = this.iDate;
    let type = data.type;
    let status = data.status;
    let typeid: number;
    if(type == 'Inactive'){
      typeid = 0;
    }
    if(type == 'Success'){
      typeid = 3;
    }
    if(type == 'Active'){
      typeid = 1;
    }
    if(type == 'Processing'){
      typeid = 2;
    }
    let del = confirm("Are you sure, Do you want to change the status?")
    if (del == false) {
      return false;
    }
    this.SpinnerService.show();
    this.interService.deleteFileData(id,typeid).subscribe((res)=> {
      if(res.status){
        this.SpinnerService.hide();
        this.notification.showSuccess("Successfully Changed!");
        this.viewData();
      } else {
        this.SpinnerService.hide();
        this.notification.showError(res.code);
      }
    });
    this.SpinnerService.hide();
  
  }
  popupopencreation() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("addAccounts"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }
  popupopenedit() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("editmodalforaccounts"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }

  getautoknockoff(addaccount){
    this.SummaryaddaccountObjNew = { "method": "get", "url": this.Url + "integrityserv/account_master", "params": addaccount }
  }

  accountstatus(account){
    let config: any = {
      style: "",
      value: "",
      class: ""
    };
    if (account.acc_runflag == 0) {
      config = {
        class: "",
        style: "",
        value: "DAILY",
      }
    }

    else if (account.acc_runflag == 1) {
      config = {
        class: "",
        style: "",
        value: "MONTHLY",
      }
    }
    else if (account.acc_runflag == 2) {
      config = {
        class: "",
        style: "",
        value: "QUARTERLY",
      }
    }
    else if (account.acc_runflag == 3) {
      config = {
        class: "",
        style: "",
        value: "HALFYEARLY",
      }
    }
    else if (account.acc_runflag == 4) {
      config = {
        class: "",
        style: "",
        value: "YEARLY",
      }
    }
    else if (account.acc_runflag == 5) {
      config = {
        class: "",
        style: "",
        value: "NEVER",
      }
    }
    else if (account.acc_runflag == 6) {
      config = {
        class: "",
        style: "",
        value: "FORTNIGHT",
      }
    }
    else if (account.acc_runflag == 7) {
      config = {
        class: "",
        style: "",
        value: "YEARLY",
      }
    }
    else if (account.acc_runflag == 8) {
      config = {
        class: "",
        style: "",
        value: "YEARLY",
      }
    }
    return config
}

closedpopup(){
  this.closeretrivalpopup.nativeElement.click();
  this.AddForm.reset()
  this.viewDataTable = false;
  this.addAccountForm = true; 
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
resfresh(type){
  if(type == 1){
    this.SummaryviewaccountObjNew= { "method": "get", "url": this.Url + "integrityserv/account_master_upload"}
  }
  
}
}



