import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BrsApiServiceService } from '../brs-api-service.service';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";

export interface displayfromat {
  branch:any;
  gl_code:any;
  type:any;
}
interface iface_typeValues{
  value: string;
  viewoption: string;
  id:number;
}

@Component({
  selector: 'app-brs-unmatched',
  templateUrl: './brs-unmatched.component.html',
  styleUrls: ['./brs-unmatched.component.scss']
})
export class BrsUnmatchedComponent implements OnInit {
  typeValues: iface_typeValues[] = [
    { value: "All", viewoption: "All" ,id:3},
    { value: "Matched", viewoption: "Matched" ,id:1},
    { value: "Unmatched", viewoption: "Unmatched" ,id:2},
  ];
  docsummary: FormGroup;
  unmatched_summery:  any[] = []; 
  brscode: any;
  has_nexttab: any;
  has_previoustab: any;
  presentpagetab: any;
  isSummaryPagination: boolean;
  data_found: boolean;
  currentpage: number;
  branch: string;
  GLACCNO: string;
  Actionsummary: FormGroup;
  arstype: any;
  parent_id: any;
  ref_id: any;
  actiontype: any;
  checkslected: boolean = false;
  remark: string;
  selectAll: boolean = false;
  type: any;
  typere: string;
  changepage= 1;
  key: string;
  allSelected: any;
  selectedBranches: any[];
  selectedflage: any[];
  selectedALL: string;
  conditioncheck: any;
  typeselect: any;

  constructor(private fb: FormBuilder, private brsService: BrsApiServiceService,private notification: NotificationService,private SpinnerService: NgxSpinnerService,public datepipe: DatePipe,
    private router: Router, ) { }

  ngOnInit(): void {
    this.docsummary= this.fb.group({
      summarydate:'',
      summarydate2:'',
      branch:'',
      GLACCNO:'',
      summarytype:'',
    })
    this.Actionsummary= this.fb.group({
      arstype:'',
      description:'',
    })
  }
  
  public displaygl(displaydata?: displayfromat): string | undefined {
    return displaydata ? displaydata.gl_code  : undefined;
  }
  public displaybranch(displaydata?: displayfromat): string | undefined {
    return displaydata ? displaydata.branch  : undefined;
  }

  public displayaction(displaydata?: displayfromat): string | undefined {
    return displaydata ? displaydata.type  : undefined;
  }
  

  summary_search(){
    this.chechvalueid = []
    this.chechvalueflage = []
    this.changepage = 1
    if(this.docsummary.controls["summarydate"].value == "" || this.docsummary.controls["summarydate"].value == null){
      this.notification.showError("Please Choose Start Date")
      return false
    }
    if(this.docsummary.controls["summarydate2"].value == "" || this.docsummary.controls["summarydate"].value == null){
      this.notification.showError("Please Choose End Date")
      return false
    }
    if(this.docsummary.controls['summarytype'].value == "" || this.docsummary.controls['summarytype'].value == null || this.docsummary.controls['summarytype'].value == undefined){
      this.notification.showError("Please Choose type")
      return false
    }
    this.typeselect = this.docsummary.controls['summarytype'].value
    let start_date =this.datepipe.transform(this.docsummary.controls["summarydate"].value,"yyyy-MM-dd");
    let end_date = this.datepipe.transform( this.docsummary.controls["summarydate2"].value,"yyyy-MM-dd");
    if(this.docsummary.controls["branch"].value == "" || this.docsummary.controls["branch"].value == null){
      this.branch = ""
    }else{
      this.branch = this.docsummary.controls["branch"].value.branch
    }
    if(this.docsummary.controls["GLACCNO"].value == "" || this.docsummary.controls["GLACCNO"].value == null){
      this.GLACCNO = ""
    }else{
      this.GLACCNO = this.docsummary.controls["GLACCNO"].value.gl_code
    }
    if(this.docsummary.controls["summarytype"].value == null || this.docsummary.controls["summarytype"].value == "" || this.docsummary.controls["summarytype"].value == undefined){
      this.typere = "";
    }else{
      this.typere = this.docsummary.controls["summarytype"].value
    }

    this.SpinnerService.show();
    this.brsService.fetchunmatvh(start_date,end_date,this.branch,this.GLACCNO,this.changepage,this.typere).subscribe((results: any) => {
      this.SpinnerService.hide();
      if(results.code == "UNEXPECTED_ERROR"){
        this.data_found = false;
        this.notification.showError(results.description)
      }
      let datas = results["data"];
      let dataPagination = results['pagination'];
      this.unmatched_summery = results["data"]
      if (datas.length >= 0) {
        this.has_nexttab = dataPagination.has_next;
          this.has_previoustab = dataPagination.has_previous;
          this.presentpagetab = dataPagination.index;
          this.isSummaryPagination = true;
          this.data_found = true;
      }
     
    });

  }

  arsdroupdowntype(){
    this.SpinnerService.show()
    this.brsService.ArsDropdown().subscribe((results: any) => {
      this.SpinnerService.hide();
      this.arstype = results["data"]
      console.log("this.arstype.id = ",this.arstype.id)
      
    });
  }

  brachserach(){
    this.SpinnerService.show()
     this.brsService.branchcode().subscribe((results: any) => {
      this.SpinnerService.hide();
      this.brscode = results["data"]
      if(results.code ==  "UNEXPECTED_ERROR"){
        this.notification.showError(results.description)
        return false
      }
     
    });
  }

  summary_clear(){
    this.docsummary.reset()
  }
  chechvalueid:any[]=[]
  chechvalueflage:any[]=[]
  checkboxClicked(sum: any): void {
    this.conditioncheck = sum.isSelected
    if(sum.isSelected == false){
      this.chechvalueid = []
      this.chechvalueflage = []
    }
    if (sum.isSelected) {
      console.log('Checkbox clicked for:', sum);
      // this.parent_id = sum.id
      // this.ref_id = sum.flag
      
      this.checkslected = true
      this.chechvalueid.push(sum.id)
      this.chechvalueflage.push(sum.flag)
      console.log("array",this.chechvalueid)
      console.log("array flage",this.chechvalueflage)
    }
  }

  Actionsubmit(){
    if(this.conditioncheck == false){
      this.notification.showError("Please Click the check field")
      return false
     }
   if(this.checkslected == false){
    this.notification.showError("Please Click the check field")
    return false
   }
   if(this.checkslected == true){
    this.parent_id = this.chechvalueid
    this.ref_id = this.chechvalueflage
   }
   if(this.selectedALL == "all"){
    this.parent_id = this.selectedBranches
    this.ref_id = this.selectedflage
   }
   if(this.Actionsummary.controls["arstype"].value == "" || this.Actionsummary.controls["arstype"].value == null){    
    this.notification.showError("Please Choose Action")
    return false
   }
   if(this.Actionsummary.controls["description"].value == "" || this.Actionsummary.controls["description"].value == null){
    this.remark = ""
   }else{
    this.remark = this.Actionsummary.controls["description"].value
   }
   this.actiontype = this.Actionsummary.controls["arstype"].value.id
    let PARMS = {
      "parent_id":this.parent_id,
      "ref_id":"",
      "type":this.actiontype,
      "flag":this.ref_id,
      "remark":this.remark,
    }
    this.SpinnerService.show()
    this.brsService.Action_submit(PARMS).subscribe((results: any) => {
      this.SpinnerService.hide();
      if (results.code == "ACTION ALREADY DONE") {
        this.notification.showError(results.code);
        return false
      }
      if (results.status == "success") {
        this.notification.showSuccess("Successfully Created");
        this.summary_search()
        this.Actionsummary.reset()
      }
     
    });
  }

  summary_report(){
    this.router.navigate(["brs/brs_report"], {});

  }
  // typechange(){
  //   this.changepage = 1
  // }
  onscroll(){
    if(this.has_nexttab == false){
      this.changepage = 1
      return false
    }
    this.key="end"
    this.changepage++;
      if(this.docsummary.controls["summarydate"].value == "" || this.docsummary.controls["summarydate"].value == null){
        this.notification.showError("Please Choose strat Date")
        return false
      }
      if(this.docsummary.controls["summarydate2"].value == "" || this.docsummary.controls["summarydate"].value == null){
        this.notification.showError("Please Choose End Date")
        return false
      }
      let start_date =this.datepipe.transform(this.docsummary.controls["summarydate"].value,"yyyy-MM-dd");
      let end_date = this.datepipe.transform( this.docsummary.controls["summarydate2"].value,"yyyy-MM-dd");
      if(this.docsummary.controls["branch"].value == "" || this.docsummary.controls["branch"].value == null){
        this.branch = ""
      }else{
        this.branch = this.docsummary.controls["branch"].value.branch
      }
      if(this.docsummary.controls["GLACCNO"].value == "" || this.docsummary.controls["GLACCNO"].value == null){
        this.GLACCNO = ""
      }else{
        this.GLACCNO = this.docsummary.controls["GLACCNO"].value.gl_code
      }
      if(this.docsummary.controls["summarytype"].value == null || this.docsummary.controls["summarytype"].value == "" || this.docsummary.controls["summarytype"].value == undefined){
        this.typere = "";
      }else{
        this.typere = this.docsummary.controls["summarytype"].value
      }
  
      this.SpinnerService.show();
      this.brsService.fetchunmatvh(start_date,end_date,this.branch,this.GLACCNO,this.changepage,this.typere).subscribe((results: any) => {
        this.SpinnerService.hide();
        if(results.code == "UNEXPECTED_ERROR"){
          this.data_found = false;
          this.notification.showError(results.description)
        }
        let datas = results["data"];
        let dataPagination = results['pagination'];
        this.unmatched_summery = this.unmatched_summery.concat(datas);
        if (datas.length >= 0) {
          this.has_nexttab = dataPagination.has_next;
            this.has_previoustab = dataPagination.has_previous;
            this.presentpagetab = dataPagination.index;
            this.isSummaryPagination = true;
            this.data_found = true;
        }
      });
        
  }

  selectAllRows() {
    // this.checkslected = true
    this.selectedBranches = []; 
    this.selectedflage = []; 
    for (let i = 0; i < this.unmatched_summery.length; i++) {
      this.unmatched_summery[i].isSelected = this.selectAll;
      this.selectedBranches.push(this.unmatched_summery[i].id);
      this.selectedflage.push(this.unmatched_summery[i].flag);
    }
    if(this.selectAll == true){
      this.checkslected = true
      this.selectedALL = "all"
    }
      if(this.selectAll == false){
        this.selectedALL = "none"
        this.checkslected = false
    }
  }

  uploadtype(type){
    console.log("type value",type.value)
    this.type=type.value
  }


}
