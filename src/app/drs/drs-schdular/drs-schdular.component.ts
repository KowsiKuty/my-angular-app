import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DrsService } from '../drs.service';
// import { drs } from '../drsshared.service';
import { SharedDrsService } from '../shared-drs.service'; 
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/service/shared.service';

export interface drs {
  name: string;
  code: number;

  id: number;
  // reportmaster: string;
}



@Component({
  selector: 'app-drs-schdular',
  templateUrl: './drs-schdular.component.html',
  styleUrls: ['./drs-schdular.component.scss']
})
export class DrsSchdularComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger)autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild("schdularmaster") schdularmaster: MatAutocomplete;
  @ViewChild("schdularmastertype") schdularmastertype: MatAutocomplete;
  @ViewChild("schdular_masters") schdular_masters: MatAutocomplete;
  @ViewChild("Schdular") Schdular: MatAutocomplete;
  // report_type_list: any;
  report_type_list=[
    {"id":1,"name":"GL"},
  {"id":2,"name":"SL"}]
  upper_herachy=[{"id":1,"name":"Yes"},
  {"id":2,"name":"No"}]
  summaryshow: boolean=true;
  read_data: boolean=false;
  presentpage: number;
  hasnext: boolean;
  hasprevious: any;
  data_found: boolean;
  Schdularmaster_list: any;
  schdule_list: any;
  listdata: any;
  index: any;
  itemobj: any;
  update_hide: boolean;
  form_data:any=[]
  array_hide: boolean;
  expencegrpmapping: any;
  edit_only_true: boolean;
  activeTab: any;
  drs_docment_tab: boolean;
  drs_summary_tab: boolean;
  drs_master_tab: boolean;
  drs_menuList: any;
  drs_Audit_tab: boolean;
  drs_notional_tab: boolean;
  makers: any;
  found: any;
  found_permission: any;
  Submodule_data: any;
  constructor(private fb:FormBuilder,private drsService: DrsService,private spinnerService: NgxSpinnerService,private toastr: ToastrService,public sharedService:SharedService, private drsshared: SharedDrsService) { }
  Schdularmaster:FormGroup;
  summary_form:FormGroup;
  expence_level:FormGroup;
  ngOnInit(): void {

    let datas = this.sharedService.menuUrlData.filter(rolename => rolename.url == "/drs");
    console.log('totaldata', datas)
    datas.forEach((element) => {
      if (element.url === "/drs") {
        let subModule = element.submodule;
        this.drs_menuList = subModule;
      }
    })
    // let submoduleDataString= localStorage.getItem("menuUrlData")
    // this.Submodule_data = JSON.parse(submoduleDataString);

    // let datas = this.Submodule_data.filter(rolename => rolename.name == "DRS");
    // console.log('totaldata', datas)
    // datas.forEach((element) => {
    //   if (element.name === "DRS") {
    //     let subModule = element.submodule;
    //     this.drs_menuList = subModule;
    //   }
    // })

    this.Schdularmaster=this.fb.group({
      Schdularmastername:'',
      Schdularmaster_report:"",
      template:"",
      yes_no:"",
      items: new FormArray([])
    })
    this.summary_form=this.fb.group({
      Schdularsummary:"",
      Schdularmaster_name:""
    })
    this.expence_level=this.fb.group({
      explevel:new FormArray([this.exp_levelrowadd()])
    })
    // this.search_summary()
  }

  items: FormArray;
createItem(): FormGroup {
  return this.fb.group({
    template: '', 
  });
 
}

exp_levelrowadd(){
  let exp=new FormGroup({
    exp_status:new FormControl(2),
    exp_id:new FormControl(''),
    exp_code:new FormControl(''),
    exp_name:new FormControl(''),
    exp_Level:new FormControl(''),
    isEditable: new FormControl(false),
  }) 
  return exp;
}

drssubModuleData(data){
  console.log("data=>",data)
  this.activeTab=data
  if (data.url== "/drs_documents"){
this.drs_docment_tab=true;
this.drs_summary_tab=false;
this.drs_master_tab=false;
this.drs_Audit_tab= false
this.drs_notional_tab= false
  }
  if(data.url=="/drs_summary"){
    this.drs_docment_tab=false;
this.drs_summary_tab=true;
this.drs_master_tab=false;
this.drs_Audit_tab= false
this.drs_notional_tab= false
}
if(data.url=="/drs_masters"){
  this.drs_docment_tab=false;
  this.drs_summary_tab=false;
  this.drs_master_tab=true;
  this.drs_Audit_tab= false
  this.drs_notional_tab= false
}
if(data.url=="/audit_entry"){
  this.drs_docment_tab=false;
  this.drs_summary_tab=false;
  this.drs_master_tab=false;
  this.drs_Audit_tab= true
  this.drs_notional_tab= false
  this.makers= data.role[0]
    this.found_permission=  this.makers.name
    this.drsshared.found_permission.next(this.found_permission)
}
if(data.url=="/notional_entry"){
  this.drs_docment_tab=false;
  this.drs_summary_tab=false;
  this.drs_master_tab=false;
  this.drs_Audit_tab= false
  this.drs_notional_tab= true
}

}
addItem(): void {
  this.items = this.Schdularmaster.get('items') as FormArray;
  this.items.push(this.createItem());
}

deleteAddressGroup(index: number) {
  const add = this.Schdularmaster.get('items') as FormArray;
  add.removeAt(index)
}
  public schdularmaster_display(schdular_master_name?: drs): string | undefined {
    return schdular_master_name ? schdular_master_name.name : undefined;
  }
  public schdularmastertype_display(schdular_master_name?: drs): string | undefined {
    return schdular_master_name ? schdular_master_name.name : undefined;
  }
  public schdular_display(schdular_name?: drs): string | undefined {
    return schdular_name ? schdular_name.name : undefined;
  }
  schdularmaster_summary(){

  }  
  // reporttype_dropdown() {
  //   // let value = select;
  //   // console.log("val;ue", value);
  //   this.spinnerService.show()
  //   this.drsService.reporttype_dropdown().subscribe((results: any) => {
  //     this.spinnerService.hide()
  //     let data = results["data"];
  //     this.report_type_list = data;
  //   });
  // }
  templates_value:any[]=[]
  report_add(){
    this.summaryshow=false;
  
  }

  report_clear(){
    this.Schdularmaster.reset()  
    this.form_data=""
    this.Schdularmaster.controls['items'].reset();  
  }
  report_back(){
    this.summaryshow=true;
    this.form_data=""
    this.read_data=false;
  }
  back_summary(){
    this.edit_only_true=false;
  }
  schdule_edit(schdule,i){
    this.edit_only_true=true
    this.summaryshow=true;
    // this.expencegrpmapping=this.schdule_list[0].child
    // if(this.schdule_list[0].child.length!=0){
    //   this.array_hide=false;
    //   this.expence_level = this.fb.group({
    //     explevel: this.fb.array(
    //       this.expencegrpmapping.map(val =>
    //         this.fb.group({
    //           exp_status:new FormControl(val.status),
    //           exp_id:new FormControl(val.id),
    //           // exp_code:new FormControl(val.code),
    //           exp_name:new FormControl(val.name),
    //           exp_Level:new FormControl(val.template),
    //           isEditable: new FormControl(true),
    //         })
    //       )
    //     ) 
    //   });
    //   console.log("expence_level=>",this.expence_level)
     
    // }
    // else{
    //   this.toastr.warning("","No Data Found" ,{timeOut:1200})
    //   this.array_hide=true
      // this.expencegrpmapping=[]
      // this.expence_level.reset()
      // this.expence_level.get('explevel').reset();
    // }
  
  }


  

 
  report_Add_data(){ 
   
    if(this.Schdularmaster.value.Schdularmastername=="" || this.Schdularmaster.value.Schdularmastername==null || this.Schdularmaster.value.Schdularmastername==undefined){
      this.toastr.warning("","Please Fill the name")
      return false;
    }
    if(this.Schdularmaster.value.Schdularmaster_report=="" || this.Schdularmaster.value.Schdularmaster_report==null || this.Schdularmaster.value.Schdularmaster_report==undefined){
      this.toastr.warning("","Please Fill the Report Item")
      return false;
    }
    if(this.Schdularmaster.value.yes_no=="" || this.Schdularmaster.value.yes_no==null || this.Schdularmaster.value.yes_no==undefined){
      this.toastr.warning("","Please Fill the yes or No")
      return false;
    }
    if(this.Schdularmaster.value.template=="" || this.Schdularmaster.value.template==null || this.Schdularmaster.value.template==undefined){
      this.toastr.warning("","Please Fill the Template")
      return false;
    }
    this.read_data=true
    // this.addItem()
    this.form_data.push(this.Schdularmaster.value)
    console.log("this.formdata",this.form_data)
    this.templates_value.push(this.Schdularmaster.value.template)
    console.log("sfvgshfvxg",this.templates_value)
    // this.Schdularmaster.reset
    this.Schdularmaster.get('template').reset()
    this.read_data=true;
    // this.Schdularmaster.controls['items'].reset();
  }

  submit(){
    if(this.Schdularmaster.value.Schdularmastername=="" || this.Schdularmaster.value.Schdularmastername==null || this.Schdularmaster.value.Schdularmastername==undefined){
      this.toastr.warning("","Please Fill the name")
      return false;
    }
    if(this.Schdularmaster.value.Schdularmaster_report=="" || this.Schdularmaster.value.Schdularmaster_report==null || this.Schdularmaster.value.Schdularmaster_report==undefined){
      this.toastr.warning("","Please Fill the Report Type")
      return false;
    }
    if(this.Schdularmaster.value.yes_no=="" || this.Schdularmaster.value.yes_no==null || this.Schdularmaster.value.yes_no==undefined){
      this.toastr.warning("","Please Fill the yes or No")
      return false;
    }
    if(this.Schdularmaster.value.template=="" || this.Schdularmaster.value.template==null || this.Schdularmaster.value.template==undefined){
      this.toastr.warning("","Please Fill the Template")
      return false;
    }
    this.templates_value.push(this.Schdularmaster.value.template)
   
let temp=this.templates_value
   let params={"name":this.Schdularmaster.value.Schdularmastername,
   "type":this.Schdularmaster.value.Schdularmaster_report ? this.Schdularmaster.value.Schdularmaster_report.id:"",
   "upper_hierarchy":this.Schdularmaster.value.yes_no?this.Schdularmaster.value.yes_no.id:"",
   "child":Object.assign({},  { "template":temp })
  // "child":this.templates_value,
  }
    this.spinnerService.show()
    this.drsService.schedule_add(params).subscribe((results: any) => {
      this.spinnerService.hide()
      // this.Schdularmaster.get('Schdular_template').reset()
      this.report_clear()
      this.report_back()
      let data = results["data"];
      this.report_type_list = data;
    });
  }

  search_summary(pageNumber = 1) { 
    let report_type_id= this.summary_form.value.Schdularsummary
    let name=this.summary_form.value.Schdularsummary
    this.spinnerService.show()
    this.drsService.schdular_search_summary(report_type_id,name,pageNumber)
      .subscribe((results: any) => {
        this.spinnerService.hide()
        let data = results["data"];
        let datapagination = results["pagination"];
        this.schdule_list = data;
        if (this.schdule_list?.length > 0) {
          this.hasnext = datapagination.has_next;
          this.hasprevious = datapagination.has_previous;
          this.presentpage = datapagination.index;
          this.data_found = true;
        }
        if (results["set_code"] || this.schdule_list?.length == 0) {
          this.hasnext = false;
          this.hasprevious = false;
          this.presentpage = 1;
          this.data_found = false;
        }
      });
  }
  previousSchedulerClick() {
    if (this.hasprevious === true) {
      this.search_summary(this.presentpage - 1);
    }
  }
  nextSchedulerClick() {
    if (this.hasnext === true) {
      this.search_summary(this.presentpage + 1);
    }
  }

//   report_edit(values,i){
// let datas=values
// let index = i
//   }

  update(form_value): void {
    this.read_data=true
    this.itemobj=form_value
    this.form_data[this.index] = this.itemobj;
    this.Schdularmaster.get('template').reset();
    this.update_hide=false;
  }
  report_edit(item: any,i): void {
    this.read_data=true
    this.update_hide=true;
    this.Schdularmaster.patchValue({ 
      "Schdularmastername": item.Schdularmastername,
      "Schdularmaster_report": item.Schdularmaster_report,
      "yes_no":item.yes_no,
      "template":item.template
    });
    this.itemobj = item;
    this.index = this.form_data.indexOf(item);
  }

  removeitem(element: any) {
    this.form_data.forEach((value: any, index: any) => {
      if (value == element) this.form_data.splice(index, 1);
    });
  }

  saveexpgrp_mapping(expmapping,ind){
    console.log(expmapping)
    // if(typeof expmapping.value.exp_Level!='object'){
    //   this.toastr.warning('', 'Please Fill The Level', { timeOut: 1500 });
    //   return false;
    // }
    // if(typeof expmapping.value.exp_name!='object'){
    //   this.toastr.warning('', 'Please Select Expence Group Name', { timeOut: 1500 });
    //   return false;
    // }  
    // let expmapping_parm
    // if(expmapping.value.exp_id==''){
    //   expmapping_parm={
    //     "name":expmapping.value.exp_name.id,
    //     "level":expmapping.value.exp_Level.id, 
    //   }
    // }
    // else{
    //   expmapping_parm={
    //     "name":expmapping.value.exp_name.id,
    //     "level":expmapping.value.exp_Level.id, 
    //     "id":expmapping.value.exp_id
    //   }
    //  }
     var glsubgrpconfirm=window.confirm("Do You Want To Save And Continue?")
     console.log(glsubgrpconfirm)
     if(!glsubgrpconfirm){
       console.log("True")
       return false;
     }else{
    //  this.spinnerService.show();
    //     let val=''
    // this.drsService.expgrp_mapping(expmapping_parm)
    //   .subscribe((results: any[]) => {
  
    //  this.spinnerService.hide();
    //   if (results['set_code'] == 'success') {
    //     if(typeof expmapping.value.exp_id=='number'){
    //       this.toastr.success("",'Successfully Updated',{timeOut:1500});
    //     }else{
    //       this.toastr.success("",'Successfully Created',{timeOut:1500});
    //     }
        
        // this.expence_level.reset()
        // this.expgrplistmapping_clear()
        // this.expgrplistmapping_summary(val) 
    //   }
    // }, error => {
    //   // this.errorHandler.handleError(error);
    //   this.spinnerService.hide();
    // })
  }
  }

  cancelexpgrp_mapping(expcancel,ind){
    if(expcancel.value.exp_id  != ""){
      console.log('true')
      var arrayControl = this.expence_level.get('explevel') as FormArray;
      let item = arrayControl.at(ind);
     item.get('isEditable')
      .patchValue(true);
      // this.expgrplistmapping_summary(this.explevel_id) 
      
  
    }  if(expcancel.value.exp_id   == "" || expcancel.value.exp_id  == undefined  || expcancel.value.exp_id  ==null)
      {
      const control = <FormArray>this.expence_level.controls['explevel'];
      control.removeAt(ind)   
      console.log('false')
  
    }
  
  }

  Editexpgrp_mapping(expedit,ind){
    for(let expeditval of this.expence_level.controls['explevel'].value){
      console.log("edit",expeditval.isEditable)
      if(expeditval.isEditable==false){
        console.log(expeditval.isEditable)
        this.toastr.warning("","New Row Can Be Added Or Edited After Only Submitting Or Canceling The Line Entered Already",{timeOut:1500})
        return false;
      }
    }
    var arrayControl = this.expence_level.get('explevel') as FormArray;
    let item = arrayControl.at(ind);
   item.get('isEditable')
    .patchValue(false);
     
  }

  deleteexpgrp_mapping(expcancel,i){
    var sourceconfirm=window.confirm("Are You Sure Change The Status?")
    console.log(sourceconfirm)
    if(!sourceconfirm){
      return false;
    }else{
      // let delsource=expcancel.value.newsource[i]
      let id=expcancel.value.exp_id
      let status=expcancel.value.exp_status
      let sourcestatus
      if(status==0){
        sourcestatus=1
      }else{
        sourcestatus=0
      }
      
      let val=''
      // this.SpinnerService.show()
      // this.expservice.expgrpdelete(id,sourcestatus).subscribe((results) => {
      //   this.SpinnerService.hide()
      //   if(results.status=='success'){
      //     if(sourcestatus==1){
      //       this.toastr.success("","Expence Group Active  Succesfully",{timeOut:1500})
      //       this.expgrplistmapping_clear()
      //       this.expgrplistmapping_summary(val) 
      //     }else{
      //       this.toastr.success("","Expence Group In-Active Source Succesfully",{timeOut:1500})
      //       this.expgrplistmapping_clear()
      //       this.expgrplistmapping_summary(val) 
      //     }
      //   }
      // }, error => {
      //   this.errorHandler.handleError(error);
      //   this.SpinnerService.hide();
      // })
    }
    
   }


}
