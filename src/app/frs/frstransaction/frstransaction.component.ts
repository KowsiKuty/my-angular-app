import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-frstransaction',
  templateUrl: './frstransaction.component.html',
  styleUrls: ['./frstransaction.component.scss']
})
export class FrstransactionComponent implements OnInit {
  @ViewChild('closebutton') closebutton;

  frsform : FormGroup;
  Nii_menuList: any;
  NiiDocument: boolean;
  edit_sumary: boolean;
  gst_data:boolean;
  Nii_summary: boolean;
  activeTab: any;
  maker_value: any;
  query_page:boolean;
  Nii_master: boolean=false;
  activeSubModules: any=[];
  Nii_gl_mapping: boolean;
  Nii_reverse: boolean;
  activeTabs: any;
  constructor(private fb: FormBuilder, public sharedService: SharedService) { }

  ngOnInit(): void {
    let datas = this.sharedService.menuUrlData.filter(rolename => rolename.url == "/frs_summary");
    console.log('totaldata', datas)
    datas.forEach((element) => {
      if (element.url === "/frs_summary") {
        let subModule = element.submodule;
        this.Nii_menuList = subModule;
      }
      this.Nii_menuList.forEach((value)=>{
        if(value.url==="/niisummary"){
        value.role.forEach((value)=>{
        if(value.name =="Maker" ){
          console.log("is maker")
          this.maker_value=value.name
        }
      })  
    }
    })
      
    })
    
    this.frsform = this.fb.group({
      
      branchname: null,
      payment_type:'',
      transtype: '',
      custype:'',
      debitacc:'',
      debitGL:'',
      creditGL:'',
      loanfcc:'',
      invoiceNum:'',
      gstin:'',
      stcode:'',
      prodtype:'',
      gstcode:'',
      billamt:'',
      gstamt:'',
      totbillamt:'',
      totpay:'',
      narration:'',
      cusname:'',
      address:'',
      mobnum:'',
      email:'',


      

    })
  }
  niisubModuleData(data){
    console.log("data=>",data)
    this.activeTab=data
    if (data.name== "NII Documents"){    
  this.NiiDocument=true;
  this.edit_sumary=false;
  this.Nii_summary=false;  
  this.query_page=false;
  this.Nii_gl_mapping=false;
  this.Nii_reverse=false;
  this.Nii_master=false;
  // this.edit_data_sumary=false;
  // this.edit_frs_summary=false
    }
    if(data.name=="NII Summary"){  
     
      if(this.maker_value=="Maker"){
        this.Nii_summary=true;
        this.edit_sumary=true;    
        this.NiiDocument=false; 
        this.query_page=false;
        this.Nii_gl_mapping=false;
        this.Nii_reverse=false;
        this.Nii_master=false;
      }else{
        this.Nii_summary=false;
        this.edit_sumary=true;     
        this.NiiDocument=false; 
        this.query_page=false;
        this.Nii_gl_mapping=false;
        this.Nii_reverse=false;
        this.Nii_master=false;
      }    
  // this.edit_data_sumary=false;
  // this.edit_frs_summary=true;
  //   }
  }
  if(data.name=="Overall Summary"){
    this.query_page=true;
    this.NiiDocument=false;
    this.edit_sumary=false;
    this.Nii_summary=false; 
    this.Nii_gl_mapping=false;
    this.Nii_reverse=false;
    this.Nii_master=false;
  }

  if(data.url == '/niimaster'){    
    this.activeSubModules =[{ name: 'Reverse Branch' }, { name: 'GL Mapping' }]
    this.query_page=false;
    this.NiiDocument=false;
    this.edit_sumary=false;
    this.Nii_summary=false; 
    this.Nii_reverse=false;
    this.Nii_gl_mapping=false;
    this.Nii_master=true;
  }
}
secondsubmodule(sub){
  this.activeTabs=sub
if(sub.name === 'Reverse Branch'){
    this.query_page=false;
    this.NiiDocument=false;
    this.edit_sumary=false;
    this.Nii_summary=false; 
    this.Nii_reverse=true;
    this.Nii_gl_mapping=false;
    this.Nii_master=true;
}
if(sub.name=== 'GL Mapping'){
  this.query_page=false;
  this.NiiDocument=false;
  this.edit_sumary=false;
  this.Nii_summary=false; 
  this.Nii_reverse=false;
  this.Nii_gl_mapping=true;
  this.Nii_master=true;
}
}




close_btn(){
  this.closebutton.nativeElement.click()
  this.NiiDocument=false;
  this.edit_sumary=true;
  this.Nii_summary=false;
}
  
}
