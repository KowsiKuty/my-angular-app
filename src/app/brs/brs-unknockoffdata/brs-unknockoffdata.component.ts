import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from "@angular/common";
import { BrsApiServiceService } from '../brs-api-service.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ElementRef, ViewChild, Renderer2} from '@angular/core';
import { NotificationService } from 'src/app/service/notification.service';
import { data } from 'jquery';

interface iface_typeValues{
  value: string;
  viewoption: string;
  id:number;
}
export interface displayfromat {
  branch:any;
  gl_code:any;
  type:any;
}

@Component({
  selector: 'app-brs-unknockoffdata',
  templateUrl: './brs-unknockoffdata.component.html',
  styleUrls: ['./brs-unknockoffdata.component.scss']
})
export class BrsUnknockoffdataComponent implements OnInit {
  typeValues: iface_typeValues[] = [
    { value: "EXTERNAL", viewoption: "EXTERNAL" ,id:5},
    { value: "WISEFIN", viewoption: "WISEFIN" ,id:4}
  ];
@ViewChild('popupclose')popupclose:any;
endDate: Date;
brssummary:FormGroup;
  autokdate: any;
  Knocksummary: any;
  currentPage=1;
  order: number;
  documentform: FormGroup;
  branchname: any;
  uploadfile: any;
  data_found: boolean = false;
  glcode: any;
  branchcode: any;
  upload_type: any;
  arsfile: any;
  externalFiles: any;
  cbsFiles: any;
  brscode: any;
  brancode: any;
  accno: any;
  Arsstatus: any;
  data_found1: boolean;

  constructor( private fb: FormBuilder,public datepipe: DatePipe, private brsService: BrsApiServiceService,private SpinnerService: NgxSpinnerService,private renderer: Renderer2,private el: ElementRef,
    private notification: NotificationService,) {}

  ngOnInit(): void {
    this.brssummary= this.fb.group({
      summarydate:'',
      summarybranch:'',
    })
    this.documentform= this.fb.group({
      ctrl_upload:'',
      ctrl_uploadtype:'',
    })
    const currentDate = new Date();
   this.endDate = new Date(currentDate.getTime() - 0 * 24 * 60 * 60 * 1000);
 
  }
  public displaybranch(displaydata?: displayfromat): string | undefined {
    return displaydata ? displaydata.branch  : undefined;
  }
  onscroll(){
    this.currentPage++;
    this.autokdate = this.datepipe.transform(
      this.brssummary.controls["summarydate"].value,
      "yyyy-MM-dd"
    );
    let filterVal = 2;
    if(this.brssummary.controls["summarybranch"].value == null || this.brssummary.controls["summarybranch"].value == undefined || this.brssummary.controls["summarybranch"].value == ""){
      this.branchname = ""
    }else{
      this.branchname = this.brssummary.controls["summarybranch"].value.branch
    }
    let led_acc = "";
    this.SpinnerService.show();
    this.brsService
      .knock_off_summary(this.currentPage,this.autokdate,filterVal,"",led_acc,this.branchname)
      .subscribe((results: any) => {
        this.SpinnerService.hide();
        if(results.description == "No data found"){
          this.notification.showError("No data found");
          return false
        }
        let datas = results["data"];
        this.Knocksummary = this.Knocksummary.concat(datas);
   });
  }

  summary_search(){
    console.log("branch",this.brssummary.controls["summarybranch"].value)
    if(this.brssummary.controls["summarydate"].value ==  null || this.brssummary.controls["summarydate"].value == undefined || this.brssummary.controls["summarydate"].value == ""){
      this.notification.showError("Please choose a date")
      return false
    }
    this.autokdate = this.datepipe.transform(
      this.brssummary.controls["summarydate"].value,
      "yyyy-MM-dd"
    );
    let filterVal = 2;
    if(this.brssummary.controls["summarybranch"].value == null || this.brssummary.controls["summarybranch"].value == undefined || this.brssummary.controls["summarybranch"].value == ""){
      this.branchname = ""
    }else{
      this.branchname = this.brssummary.controls["summarybranch"].value.branch
    }
   
    let led_acc = "";
    this.SpinnerService.show();
    this.brsService
      .knock_off_summary(this.currentPage,this.autokdate,filterVal,"",led_acc,this.branchname)
      .subscribe((results: any) => {
        this.SpinnerService.hide();
        this.Knocksummary = results["data"];
        if(results.code== "UNEXPECTED_ERROR"){
          this.notification.showError(results.description)
          this.data_found = false;
          return false
        }
        this.data_found = true;
      });
  }
  summary_clear(){
    this.brssummary.reset();
  }

  uploadchooses(evt){
    this.uploadfile = evt.target.files[0];
    console.log("this.uploadfile",this.uploadfile)
  }

  uploadtype(type){
    console.log("type",type.value)
    this.upload_type=type.value
  }

  documentupload(){
    if (this.documentform.controls["ctrl_uploadtype"].value == null ||this.documentform.controls["ctrl_uploadtype"].value == ""){
      this.notification.showError("Please choose a Upload Type ");
      return false;
    }
    let PARMS = {
      "date":this.autokdate,
      "type":this.upload_type,
      "gl_code":this.glcode,
      "gl_branch":this.branchcode,
    }
    this.SpinnerService.show();
    this.brsService.ARSUploadexcel(PARMS,this.uploadfile).subscribe((results: any) => {
      this.SpinnerService.hide();
      if (results.code == "ALREADY EXISTS ") {
        this.notification.showError(results.code);
        return false
      }
      if (results.code == "no_rule_to_apply") {
        this.notification.showError(results.code);
        return false
      } 
      if (results.status == "success") {
        this.notification.showSuccess("File Insert Successfully");
        this.popupclose.nativeElement.click()
       this.summary_search()
        this.documentform.reset()
      }
    });

  }
  branch_click(data){
    this.glcode = data.kd_accountno
    this.branchcode = data.kd_branchcode
    console.log("data",data)
    console.log("data",data.kd_accountno)
    console.log("data",data.kd_branchcode)

  }
  Ars_run(branch,acc_no){
    let date = this.autokdate
    let branch_no = branch
    let Acc_no = acc_no
    this.SpinnerService.show();
    this.brsService.ARSrunprocess(Acc_no,branch_no,date).subscribe((results: any) => {
      this.SpinnerService.hide();
      let data = results["data"]
      if(results.code== "No data found"){
        this.notification.showError(results.code)
        this.data_found = false;
        return false
      }
      if(results.code== "THIS DATA HAS ALREADY BEEN RUN"){
        this.notification.showError(results.code)
        this.data_found = false;
        return false
      }
      if(data[0].key == "scheduler triggered"){
        this.notification.showSuccess("Process Started")
      }
    });
  }
  
  arsfilesummary(branch,acc_no){
    this.brancode = branch
    this.accno = acc_no
    this.SpinnerService.show()
    this.brsService.arsfiles(this.accno,this.brancode).subscribe((results: any) => {
      this.SpinnerService.hide()
      let datas = results["data"]
      if (datas == undefined) {
        this.externalFiles = []
        this.cbsFiles = []
      }
      this.arsfile= results["data"]
      if(results.code== "UNEXPECTED_ERROR"){
        this.notification.showError(results.description)
        this.data_found = false;
        return false
      }
      this.externalFiles = this.arsfile.filter(item => item.type === '5');
      this.cbsFiles = this.arsfile.filter(item => item.type === '4');
      this.data_found = true;
    });
  }

  unkoffdrop(){
    this.SpinnerService.show()
    this.brsService.unkoffdropdown().subscribe((results: any) => {
      this.SpinnerService.hide();
      this.brscode = results["data"]
      if(results.code ==  "UNEXPECTED_ERROR"){
        this.notification.showError(results.description)
        return false
      }
     
    });
  }
  
  status_modify(id){
    let ID = id
    let status = 0
    this.SpinnerService.show()
    this.brsService.statusmodify(ID,status).subscribe((results: any) => {
      this.SpinnerService.hide();
      if(results.status == "success"){
        this.notification.showSuccess(results.message)
        this.arsfilesummary(this.brancode,this.accno)
        this.summary_search()
      }
      if(results.code ==  "UNEXPECTED_ERROR"){
        this.notification.showError(results.description)
        return false
      }
     
    });
  }

  arsdownload(id,filename){
    let file = filename
    this.SpinnerService.show()
    this.brsService.ars_download(id).subscribe((results: any) => {
      this.SpinnerService.hide();  
      let binaryData = [];
       binaryData.push(results)
       let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
       let link = document.createElement('a');
       link.href = downloadUrl;
       link.download = file + ".xlsx";
       link.click();
    });

  }

  arsststua(branch,acc_no){
    let date = this.autokdate 
    this.SpinnerService.show();
    this.brsService.ars_status(acc_no,branch,date).subscribe((results: any) => {
      this.SpinnerService.hide();  
      this.Arsstatus = results['data']
      if(results.code=="UNEXPECTED_ERROR"){
        this.notification.showError(results.description)
        this.data_found1 = false;
        return false
      }
      this.data_found1 = true;
     
     
    });
  }
}

