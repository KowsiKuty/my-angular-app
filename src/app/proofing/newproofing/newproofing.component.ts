import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { ProofingService } from '../proofing.service';
import { ShareService } from '../share.service';
import { environment } from 'src/environments/environment';
const isSkipLocationChange = environment.isSkipLocationChange
@Component({
  selector: 'app-newproofing',
  templateUrl: './newproofing.component.html',
  styleUrls: ['./newproofing.component.scss']
})
export class NewproofingComponent implements OnInit {
  mainform: FormGroup;
  creationform: FormGroup;
  get_summary_api:any
  ip = environment.apiURL;
  integritychecked:boolean = false

  constructor( private shareService: ShareService,
      private router: Router,
      private notification: NotificationService,
      private SpinnerService: NgxSpinnerService,
      private datePipe: DatePipe,
      private proofingService: ProofingService,
      private fb: FormBuilder,
      private snackBar: MatSnackBar,
      private toastr: ToastrService) { 

      }




  ngOnInit(): void {
    this.mainform=this.fb.group({
      Proofing_name:[''],
      uploaded_date:[''],
      last_rundate:['']

    })
    this.creationform=this.fb.group({
      Proofing_name:[''],
      uploaded_date:[''],
    })
this.getsummary()
  }
  consolidate_summary_header = [
    { columnname: "Proofing Name", key: "Proofing_name" },
    { columnname: "Uploaded Date", key: "uploaded_date" },
    { columnname: "Last Run Date", key: "last_rundate" },
    {"columnname": "Status", "key": "integrity_status", "style":{cursor: "pointer"},  
     toggle: true,function: true,
     clickfunction: this.deletetemplate.bind(this),
     validate: true,
     validatefunction: this.togglefunction.bind(this)
    },
    {
      columnname: "Action",
      icon: 'arrow_right_alt',"style":{cursor: "pointer",fontWeight:800},
      button: true,
      key: "download",
      function: true,
      clickfunction: this.routetoupload.bind(this),
    },
  ];

  getsummary(){
    let params = '&summery=True'
    let Proofing_name = this.mainform.get('Proofing_name').value;
    Proofing_name ? (params += "&Proofing_name=" + Proofing_name) : "";
    let uploaded_date = this.datePipe.transform(this.mainform.get('uploaded_date').value, 'yyyy-MM-dd')
    uploaded_date ? (params += "&uploaded_date=" + uploaded_date) : "";
    let last_rundate = this.datePipe.transform(this.mainform.get('last_rundate')?.value, 'yyyy-MM-dd');
    last_rundate ? (params += "&last_rundate=" + last_rundate) : "";
    this.get_summary_api = {
      method: "get",
      url: this.ip + "prfserv/proofing_file_summary",
      params:params,
    };
  }
  search(){
  
    this.getsummary()
  }
  reset_search(){
    this.mainform.reset()
    this.getsummary()
  }
  proofingcreation(){
    let payload=	{
      "Proofing_name":this.creationform.get('Proofing_name').value,
      "uploaded_date":this.datePipe.transform(this.creationform.get('uploaded_date').value, 'yyyy-MM-dd')
    }
    this.proofingService.proofing_creation(payload).subscribe(res=>{
      if(res.code){
        this.notification.showError(res.description)
      }else{
        this.notification.showSuccess(res.message)
        this.getsummary()
        this.creationform.reset()
      }
    })
  }
  routetoupload(data){
    this.router.navigate(["/proofing/newproffingupload"],{ queryParams: { id: data.id },skipLocationChange: true });
    // this.router.navigate(['/proofing/fileupload'], { skipLocationChange: isSkipLocationChange });
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
  
    if(intergrity.status == 1){
      config = {
        disabled: false,
        style: "",
        class: "success",
        value: "",
        checked: !this.integritychecked,
        function: true,
      };
  
    }
    else if (intergrity.status == 0){
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
  deletetemplate(data) {
    console.log(data)
    let status: any = ''
    if (data.status === 0) {
      status = 1
    }
    else {
      status = 0
    }
    this.proofingService.changeproofing_status(data.id, status).subscribe(res => {
      if (res.status) {
        this.notification.showSuccess(res.message)
        this.getsummary()
      }
      else {
        this.notification.showError(res.description)
      }

    })
  }
}
