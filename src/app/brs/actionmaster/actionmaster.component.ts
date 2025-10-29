import { Component, OnInit,Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { Location } from '@angular/common';
import { BrsApiServiceService } from '../brs-api-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";

@Component({
  selector: 'app-actionmaster',
  templateUrl: './actionmaster.component.html',
  styleUrls: ['./actionmaster.component.scss']
})
export class ActionmasterComponent implements OnInit {
  dropId: any;
  drop: any;
  status: any;
  url=environment.apiURL;
  constructor(private formBuilder: FormBuilder, 
    private notification: NotificationService, private location: Location, 
    private brsService: BrsApiServiceService,private spinner: NgxSpinnerService) { }
  AddForm: FormGroup;
  accounteditform: FormGroup;
  summarylists=[];
  @ViewChild('closebuttons') closebuttons; 
  has_next=true;
  has_previous=true;
  currentpage=1;
  pagesize = 10;

  uploadfile: any;
  
  actionList: any[] = [
    { id: 1, name: "FAS"},
    { id: 2, name: "CBS"},
    { id: 3, name: "Both"},
  ]

  action:any= 
  {"searchkey":"",
    "params":"",
    "displaykey":"name",
    "label":"Action Control",
    "Outputkey": 'type',
    "fronentdata":true,
    "data":this.actionList,
    // "defaultvalue":{"id": '1', "value": "System Match Done"}
  }
  
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }

  ngOnInit(): void {

    this.AddForm = this.formBuilder.group({
      code:'',
      description:'',
      type : ''
    })

   
    this.accounteditform = this.formBuilder.group({
      code:'',
      description:'',
      id:'',
      type : ''
    })

    this.getaccdata();
  }

  accountedit(data){
    this.popupopen()
    console.log("dataa",data);
  this.drop = data.type.id;
  this.status = data.status;

    this.accounteditform.patchValue({
      code: data.code,
      description:data.description,
      type:data.type.id,
      id: data.id,
     })
  }

  accountdel(data){

    let confirm = window.confirm("Are you sure want to Delete this Action?");

    if(confirm == true){
      let id = data.id;

      this.brsService.deleteRow(id).subscribe(res => {
        if(res.status){
          this.notification.showSuccess("Successfully Deleted!");
          this.getaccdata();
        } else {
          this.notification.showError(res.code);
        }
      })
    } else if(confirm == false){
      return false;
    }
   
  }

  deleteaccount(id)
  {
    this.brsService.deleteAction(id.id).subscribe(results => {
      if (results.status == 'Successfully Updated') {
        this.notification.showSuccess(results.status);
        this.getaccdata();
      }
      else {
        this.notification.showError(results.code);

      }
    })

  }
  prevpage()
  {

  }
  nextpage()
  {

  }
  editForm()
  {
    
    if(this.accounteditform.value.code == '' || this.accounteditform.value.code == null){
      console.log(this.accounteditform.value.acc_no)
      this.notification.showError('Please Enter Action Code')
      throw new Error;
    }
    if(this.accounteditform.value.description == '' || this.accounteditform.value.description == null){
      console.log(this.accounteditform.value.acc_name)
      this.notification.showError('Please Enter Action Description')
      throw new Error;
    }
    if(this.accounteditform.value.type == '' || this.accounteditform.value.type == null){
      this.notification.showError('Please Enter Action Control');
      throw new Error;
    }
    let code = this.accounteditform.value.code;
    let des = this.accounteditform.value.description;
    let id = this.accounteditform.value.id;

    let type = this.accounteditform.value.type?.id

    let dict = {
      "code" : code,
      "description" : des,
      "id" : id,
      "type" : type,
      "status" : this.status
    }

    this.brsService.actionEdit(dict).subscribe(results => {
      if (results.status == 'success') {
        this.notification.showSuccess("Action Updated Successfully ...")
        this.closebuttons.nativeElement.click();
        this.getaccdata();
      }
      else {
        this.notification.showError(results.description)
      }
    })  
  }

  acc_mapp_search_summary_api:any
  getaccdata() {
    // this.spinner.show()
    // this.brsService.getActionData().subscribe(results => {
    //   this.spinner.hide()
    //   if (!results) {
    //     return false;
    //   }
    //   this.summarylists = results['data'];
     
    //   this.pagination = results.pagination ? results.pagination : this.pagination;
    // })
    this.acc_mapp_search_summary_api = {
      method: "get",
      url: this.url + "brsserv/action_master",
    };

  }

  submitForm() {

    if(!this.AddForm.valid){
      this.notification.showWarning("All Fields are Required!");
      return false;
    }
    else { 

    this.brsService.newAction(this.AddForm.value).subscribe(results => {
      if (results.status == 'success') {
        this.notification.showSuccess("Action Added Successfully!..");
        this.getaccdata();
        this.AddForm.reset();
      }
      else {
        this.notification.showError(results.description); 
      }
    })
  }
  }

selected(event,index,data){  

    this.dropId = event.id;
    const idd = data.id;
    const code = data.code;
    const des = data.description;

    let dict = {
      "type" : this.dropId,
      "code" : code,
      "description" : des,
      "id" : idd
    }

    this.brsService.newAction(dict).subscribe(res => {
      if(res.status) {
        this.notification.showSuccess("Successfully Updated!");
        // this.getaccdata();
      }
      else if(res.code){
        this.notification.showError(res.code);
      }
    })
  }

  resetform(){
    this.AddForm.reset()
  }

  acc_mapp_summary_table=[ { columnname: "Action Code", key: "code" },
    { columnname: "Description", key: "description",},
    { columnname: "Action Control", key: "type","type":"object","objkey":"name" },
    {
      columnname: "Edit",
      key:"edit",
      icon:"edit",
      button:true,
      function: true,
      clickfunction: this.accountedit.bind(this),
    },        
    { columnname: "Status", key: "status", toggle: true, function: true,clickfunction: this.deleteaccount.bind(this), validate: true, validatefunction: this.status_togle.bind(this)},
      {
        columnname: "Delete",
        icon: "delete",
        style: { color: "rgb(219, 121, 121)", cursor: "pointer" },
        button: true,
        key: "delete",
        function: true,
        clickfunction: this.accountdel.bind(this),
      },
    ]
    status_togle(data) {
      {
        let config: any = {
          disabled: false,
          style: "",
          class: "",
          value: "",
          checked: "",
          function: true,
        };
        if (data.status == 1) {
          config = {
            disabled: false,
            style: "",
            class: "primary",
            value: "",
            checked: true,
            function: true,
          };
        } else if (data.status == 0) {
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
    }

    popupopen() {
      var myModal = new (bootstrap as any).Modal(
        document.getElementById("editmodalforaccounts"),
        {
          backdrop: 'static',
          keyboard: false
        }
      );
      myModal.show();
    }
}
