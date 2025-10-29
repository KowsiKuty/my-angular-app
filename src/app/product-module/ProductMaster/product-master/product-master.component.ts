import { Component, EventEmitter, OnInit , Output,ViewChild} from "@angular/core";
import { FormGroup,FormBuilder, FormControl} from "@angular/forms";
import { ProductMasterService } from "../product-master.service";
import { Router } from "@angular/router";
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import {  takeUntil, map } from 'rxjs/operators'; 
import { fromEvent } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../../../service/error-handling-service.service'
import { ToastrService } from "ngx-toastr";
import { data } from "jquery";
export interface typelistss {
  id: string;
  name: any;
  code: any;
  type: string;

}
export interface emplistss {
  id: string;
  name: any;
  full_name: any
}
export interface venlistss {
  id: string;
  name: any;
  // full_name: any
}

@Component({
  selector: "app-product-master",
  templateUrl: "./product-master.component.html",
  styleUrls: ["./product-master.component.scss"],
})
export class ProductMasterComponent implements OnInit {

  Objs={
    'Work Group':false,
    'Work Grop Identifier':false,
    'AgentGroupEmpMapping Summary':false,
    'Source Summary':false,
    'Agent Vendor Mapping':false,
    'Vendor mapping': false,  
    
  }

  AgentRuleId: any 
 
  AgentGroupformgroup: FormGroup;
  RulesNoteformgroup: FormGroup;
  AgentGroupEmpMappingformgroup: FormGroup;
  Sourceformgroup: FormGroup;
  AgentGroupSearchform: FormGroup;
  RulesNoteSearchform: FormGroup;
  AgentGroupEmpMapSearchform: FormGroup;
  SourceSearchform: FormGroup;

  CRM_Master_Menu_List: any;
  agentid: any;
  controls: any;

  constructor( private fb: FormBuilder , private serv: ProductMasterService, private router: Router, private SpinnerService:NgxSpinnerService,
    private errorHandler:ErrorHandlingServiceService, private notify: ToastrService) {}
 
    @Output() backToSummary = new EventEmitter<any>();

  ngOnInit(): void {
    this.CRM_Master_Menu_List = [{ name: "Work Group"},  { name: "Source Summary" }];
    let data: any = this.serv.TypeOfCreateAgent  
    console.log("list for summary ",data)
    this.getMenus(data)
  
    this.AgentGroupSearchform =  this.fb.group({
     name:''
    })
    this.RulesNoteSearchform = this.fb.group({
     codename:''
    })
    this.AgentGroupEmpMapSearchform = this.fb.group({
      codename:''
    })
    this.SourceSearchform = this.fb.group({
      codename:'',
      text:''
     })
     this.AgentGroupformgroup = this.fb.group({
      name:''
     })
     this.RulesNoteformgroup = this.fb.group({
      name:''      
     })
     this.AgentGroupEmpMappingformgroup = this.fb.group({
      name:''
     })
     this.Sourceformgroup = this.fb.group({
      name:''
     })

     this.AgentGroupSearch('')
     this.SourceSearch('')

  
  this.agentid=this.serv.agentid
 
  
  }
  EmpId:any;

  // ProductMasterSummary:boolean = true;
  // productMasterView:boolean = false;
  

  AgentSummary: boolean;
  RulesNoteSummary: boolean;
  AgentGroupEmpMappingSummary: boolean;
  SourceSummary: boolean;
  AgentGroupcreatForm: boolean;
  RulesNoteCreateForm: boolean;
  AgentGroupMappingCreateForm: boolean;
  SourceCreateForm: boolean;


  public displayAgent(typ?: typelistss): string | undefined {
    return typ ? typ.name : undefined;
  }

  

  // menusList:any
  // SelectedView:any
  selectedNav: '' 
  getMenus(data) {

    

    if(data == null || data == undefined || data == ''){ 
      return false 
    }
    this.selectedNav = data?.name

    console.log("keyObjs keys seperate", data)
      let objs = this.Objs
      console.log("objs",objs)
      for (let i in objs) { 
        console.log("loop data ", i , data?.name )
        if (!(i == data?.name)) {
          objs[i] = false;
        } else {
          objs[i] = true;
        } 
      //  } 
    }
    if(data.name == 'Work Grop Identifier' && data?.action == 'BACK'){
      this.agentid = data?.id 
      this.AgentRuleNote(data)

    }
    if(data?.name == 'Vendor mapping' && data?.action == 'BACK' ){
      console.log("vendor mapping callingg", data)
      this.agentid = data?.id 
      this.AgentRuleId = data?.RulesData?.AgentData
      this.getAgentGroupVendorMappingSearchSumary('', 1)
    }else if(data?.name == 'Vendor mapping'){
      // this.agentid = data?.id 
      this.getAgentGroupVendorMappingSearchSumary('', 1)
    }
    

  }


  AgentgroupList:any;
  hasnextAgentgroup:boolean;
  hasPreviousAgentgroup:boolean;
  CurrentPageAgentgroup:number = 1;

  AgentGroupSearch(hint){

    let dataform = this.AgentGroupSearchform.value.name
    console.log("serach button",dataform)
    
    if (hint == "next") {
      this.getAgentgroupSearchSumary(dataform, this.CurrentPageAgentgroup + 1)
      
    }
    else if(hint == "previous"){
      this.getAgentgroupSearchSumary(dataform, this.CurrentPageAgentgroup - 1)
    }
    else if(hint == ""){
      this.getAgentgroupSearchSumary(dataform, this.CurrentPageAgentgroup = 1)
    }
  }

  getAgentgroupSearchSumary(data, page){
    console.log("summary",data)
    this.serv.getAgentgroupSumary(data, page)
    .subscribe((results) => {
      let dataList = results["data"];
      let page = results["pagination"]
      this.AgentgroupList = dataList;
      console.log(results);
      this.hasnextAgentgroup = page.has_next;
      this.hasPreviousAgentgroup = page.has_previous;
      this.CurrentPageAgentgroup = page.index;

    })
  }

  resetkAgentGroup(){
    this.AgentGroupSearchform.controls["name"].reset("");

    // this.AgentgroupList = []
  }
  
  Agenttypeget(data){

    this.serv.getAgentgroupSumary(data,1 )
    .subscribe(results => {
      console.log(results)
  
    })
  }
  




  

  RuleNoteList:any;
  hasnextRuleNote:boolean;
  hasPreviousRuleNote:boolean;
  CurrentPageRuleNote:number = 1;

  // RuleNoteSearch(hint){

  //   let dataform = this.RulesNoteSearchform.value.codename
    
  //   if (hint == "next") {
  //     this.getRuleNoteSearchSumary(dataform, this.CurrentPageAgentgroup + 1)
      
  //   }
  //   else if(hint == "previous"){
  //     this.getRuleNoteSearchSumary(dataform, this.CurrentPageAgentgroup - 1)
  //   }
  //   else if(hint == ""){
  //     this.getRuleNoteSearchSumary(dataform, this.CurrentPageAgentgroup = 1)
  //   }
  // }

  AgentRuleNote(data, page = 1){
    this.AgentRuleId = data 
    console.log('agen rule note',data)
    this.serv.getAgentgroupRuleSumary(data,page)
    .subscribe((results) => {
      let dataList = results["data"];
      let page = results["pagination"]
      this.RuleNoteList = dataList;
      console.log(results);
      this.hasnextRuleNote = page.has_next;
      this.hasPreviousRuleNote = page.has_previous;
      this.CurrentPageRuleNote = page.index;

    })
  }

  // resetkRuleNote(){
  //   this.RulesNoteSearchform.controls["codename"].reset("");
   
  // }
  RuleNoteNextClick() {
    if (this.hasnextRuleNote === true) {
      this.AgentRuleNote( this.CurrentPageRuleNote + 1);
    }
  }

  RuleNotePreviousClick() {
    if (this.hasPreviousRuleNote === true) {
      this.AgentRuleNote(this.CurrentPageRuleNote - 1);
    }
  }

  




  AgentList:any;
  AgentgroupMappingList:any;
  hasnextAgentgroupMapping:boolean;
  hasPreviousAgentgroupMapping:boolean;
  CurrentPageAgentgroupMapping:number = 1;
  AgentgroupVenMappingList:any;
  hasnextAgentgroupVenMapping:boolean;
  hasPreviousAgentgroupVenMapping:boolean;
  CurrentPageAgentgroupVenMapping:number = 1;

  // AgentGroupMappingSearch(hint){

  //   let dataform = this.AgentGroupEmpMapSearchform.value.codename
    
  //   if (hint == "next") {
  //     this.getAgentGroupMappingSearchSumary(this.RuleAgentId, this.CurrentPageAgentgroup + 1)
      
  //   }
  //   else if(hint == "previous"){
  //     this.getAgentGroupMappingSearchSumary(this.RuleAgentId, this.CurrentPageAgentgroup - 1)
  //   }
  //   else if(hint == ""){
  //     this.getAgentGroupMappingSearchSumary(this.RuleAgentId, this.CurrentPageAgentgroup = 1)
  //   }
  // }

  getAgentGroupMappingSearchSumary(data, page){

    this.serv.AgentEmployeeMappingSummary(data) 
    .subscribe((results) => {
      let dataList = results["data"];
      let page = results["pagination"]
      this.AgentgroupMappingList = dataList;
      console.log(results);
      this.hasnextAgentgroupMapping = page.has_next;
      this.hasPreviousAgentgroupMapping = page.has_previous;
      this.CurrentPageAgentgroupMapping = page.index;

    })
  }

  resetkAgentGroupMapping(){
    this.AgentGroupEmpMapSearchform.controls["codename"].reset("");
  
    // this.AgentgroupMappingList = []
  }

  getAgentGroupVendorMappingSearchSumary(data, page){
    // this.agentid=data
    // this.AgentRuleId = data 
    // console.log(" agent group ",data)
    //  console.log("this.agentid", this.agentid)
    // this.SpinnerService.show()
    this.serv.AgentvendorMappingSummary(this.agentid ,page)    
    .subscribe((results) => {
      let dataList = results["data"];
      let page = results["pagination"]
      this.AgentgroupVenMappingList = dataList;
      console.log(results);
      this.hasnextAgentgroupVenMapping = page.has_next;
      this.hasPreviousAgentgroupVenMapping = page.has_previous;
      this.CurrentPageAgentgroupVenMapping = page.index;
      this.SpinnerService.hide() 

    }, error =>{
      this.SpinnerService.hide() 
    })
  }



 

  sourceList:any;
  hasnextSource:boolean;
  hasPreviousSource:boolean;
  CurrentPageSource:number = 1;

  SourceSearch(hint){

    let dataform = this.SourceSearchform.value.codename    
    
    if (hint == "next") {
      this.getSourceSumary(dataform, this.CurrentPageSource + 1)
      
    }
    else if(hint == "previous"){
      this.getSourceSumary(dataform, this.CurrentPageSource - 1)
    }
    else if(hint == ""){
      this.getSourceSumary(dataform, this.CurrentPageSource = 1)
    }
  }

  getSourceSumary(data, page){
    this.serv.getSourceSearchSumary(data, page)
    .subscribe((results) => {
      let dataList = results["data"];
      let page = results["pagination"]
      this.sourceList = dataList;
      console.log(results);
      this.hasnextSource = page.has_next;
      this.hasPreviousSource = page.has_previous;
      this.CurrentPageSource = page.index;

    })
  }

  resetkSource(){
    this.SourceSearchform.controls["codename"].reset("");
  
  }
  

 

//   RouteToEmployeeCreate(data){
//     let obj = {
//       routes: true,
//       data: data,
//       empid: this.EmpId 
//     }
// }

// backSummary(){
//   this.productMasterView = false;
//   this.ProductMasterSummary = true;
// }


tableData:any={}
Addrule(AgentRulesNote, tabledata){
  let obj = {
    routes:true,
    name:AgentRulesNote,
    AgentData: tabledata 
  }
  this.tableData = tabledata;
  this.agentid = tabledata?.id 
  console.log('addrule',tabledata)
  this.getMenus(obj)
  this.AgentRuleNote(tabledata) 

}


empList: emplistss[];
public chipSelectedemp: emplistss[] = [];
public chipSelectedempid = [];
emp_id = new FormControl();
hasnext: any
hasprevious: any
currentpage: any = 1

venList: venlistss[];
public chipSelectedven: venlistss[] = [];
public chipSelectedvenid = [];
ven_id = new FormControl();
limits = new FormControl();


@ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
@ViewChild('emp') matempAutocomplete: MatAutocomplete;
@ViewChild('empInput') empInput: any;
readonly separatorKeysCodes: number[] = [ENTER, COMMA];
@ViewChild('vendor') matvenAutocomplete: MatAutocomplete;
@ViewChild('venInput') venInput: any;
readonly separatorsKeysCodes: number[] = [ENTER, COMMA];



autocompleteempScroll(type) {
  setTimeout(() => {
    if (
      this.matempAutocomplete &&
      this.autocompleteTrigger &&
      this.matempAutocomplete.panel
    ) {
      fromEvent(this.matempAutocomplete.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.matempAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.matempAutocomplete.panel.nativeElement.scrollTop;
          const scrollHeight = this.matempAutocomplete.panel.nativeElement.scrollHeight;
          const elementHeight = this.matempAutocomplete.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.hasnext === true) {
              this.serv.employeesearch(this.empInput.nativeElement.value, this.currentpage + 1, type)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.empList = this.empList.concat(datas);                 
                  if (this.empList.length >= 0) {
                    this.hasnext = datapagination.has_next;
                    this.hasprevious = datapagination.has_previous;
                    this.currentpage = datapagination.index;
                  }
                }, (error) => {

                })
            }
          }
        });
    }
  });
}


public displayFnemp(emp?: emplistss): string | undefined {
  return emp ? emp.full_name : undefined;
}


getemp(keyvalue, type) {
  // this.SpinnerService.show();
  this.serv.employeesearch(keyvalue, 1, type)
    .subscribe((results: any[]) => {
      this.SpinnerService.hide();
      let datas = results["data"];
      this.empList = datas;
      console.log("emp data get ", this.empList)
    }, (error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
}



public removedemp(emp: emplistss): void {
  const index = this.chipSelectedemp.indexOf(emp);

  if (index >= 0) {

    this.chipSelectedemp.splice(index, 1);
    console.log(this.chipSelectedemp);
    this.chipSelectedempid.splice(index, 1);
    console.log(this.chipSelectedempid);
    this.empInput.nativeElement.value = '';
  }

}



public empSelected(event: MatAutocompleteSelectedEvent): void {
  console.log('event.option.value', event.option.value)
  this.selectempByName(event.option.value.full_name);
  this.empInput.nativeElement.value = '';
  console.log('chipSelectedempid', this.chipSelectedempid)
}
private selectempByName(emp) {
  let foundemp1 = this.chipSelectedemp.filter(e => e.full_name == emp);
  if (foundemp1.length) {
    return;
  }
  let foundemp = this.empList.filter(e => e.full_name == emp);
  if (foundemp.length) {
    this.chipSelectedemp.push(foundemp[0]);
    this.chipSelectedempid.push(foundemp[0].id)
  }
}


SubmitAgentGroupMapping(data){

  if (this.emp_id.value == "" || this.emp_id.value == undefined || this.emp_id.value == null) {
    this.notify.warning("Please Select Name");
    return false;
  }  
  let obj = {
    arr: this.chipSelectedempid,
    agent_id: data?.id
  } 
  this.serv.AgentGroupempmappingSubmit(1,obj)
  .subscribe((results: any[]) => {
    this.SpinnerService.hide();
    console.log(results)

    this.notify.success("Successfully Mapped")
    this.BackToSummary("Work Grop Identifier")
    
  }, (error) => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })
 
}

DeleteAgentGroupEmpMap(data){
  console.log("", data)
  let obj = {
    arr: [data?.employee?.id],
    agent_id: data?.agent_id
  }
  console.log(" arr data",this.chipSelectedempid)
  console.log(" array objects",obj)
    this.SpinnerService.show();
    this.serv.AgentGroupempmapping(obj,0).subscribe(
      (results: any[]) => {        
        console.log("Result remove", results)
        this.SpinnerService.hide();      
          this.notify.success("Successfully Deleted")              
          this.BackToSummary("Work Grop Identifier") 
          this.getAgentGroupMappingSearchSumary(data,1)    
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
 
  

AddScreens(dataFromAdd,create = true, data = {}){ 
  console.log("data from add", dataFromAdd)

  this.serv.agentid=this.agentid

  let obj ={
    routes: true, 
    dataAdd: dataFromAdd,
    Add:create,
    data:data,
    AgentData: this.AgentRuleId,
    tableData:this.tableData,
    
  }
  this.serv.TypeOfCreateAgent = obj 

  this.router.navigate(['crm/productmastercreate'], {skipLocationChange: true})


}


BackToSummary(dataForsummary){ 
  let obj = {
    name: dataForsummary
  }

  this.serv.TypeOfCreateAgent = obj 

  this.router.navigate(['crm/productmaster']) 

}


autocompleteVendorScroll(type) {
  setTimeout(() => {
    if (
      this.matvenAutocomplete &&
      this.autocompleteTrigger &&
      this.matvenAutocomplete.panel
    ) {
      fromEvent(this.matvenAutocomplete.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.matvenAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.matvenAutocomplete.panel.nativeElement.scrollTop;
          const scrollHeight = this.matvenAutocomplete.panel.nativeElement.scrollHeight;
          const elementHeight = this.matvenAutocomplete.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.hasnext === true) {
              this.serv.vendorsearch(this.venInput.nativeElement.value, this.currentpage + 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.venList = this.venList.concat(datas);
                  if (this.venList.length >= 0) {
                    this.hasnext = datapagination.has_next;
                    this.hasprevious = datapagination.has_previous;
                    this.currentpage = datapagination.index;
                  }
                }, (error) => {

                })
            }
          }
        });
    }
  });
}

public displayFnven(ven?: venlistss): string | undefined {
  return ven ? ven.name : undefined;
}


getvendor(keyvalue) {
  // this.SpinnerService.show();
  this.serv.vendorsearch(keyvalue, 1)
    .subscribe((results: any[]) => {
      this.SpinnerService.hide();
      let datas = results["data"];
      this.venList = datas;
      console.log("ven data get ", this.venList)
    }, (error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
}








public VendorSelected(event: MatAutocompleteSelectedEvent): void {
  console.log('event.option.value', event.option.value)
  this.selectvenByName(event.option.value.name);
  this.venInput.nativeElement.value = '';
  console.log('chipSelectedvenid', this.chipSelectedvenid)
}

public removedven(ven: venlistss): void {
  const index = this.chipSelectedven.indexOf(ven);

  if (index >= 0) {

    this.chipSelectedven.splice(index, 1);
    console.log(this.chipSelectedven);
    this.chipSelectedvenid.splice(index, 1);
    console.log(this.chipSelectedvenid);
    this.venInput.nativeElement.value = '';
  }

}



public venSelected(event: MatAutocompleteSelectedEvent): void {
  console.log('event.option.value', event.option.value)
  this.selectvenByName(event.option.value.name);
  this.venInput.nativeElement.value = '';
  console.log('chipSelectedvenid', this.chipSelectedvenid)
}
private selectvenByName(ven) {
  let foundemp1 = this.chipSelectedven.filter(e => e.name == ven);
  if (foundemp1.length) {
    return;
  }
  let foundemp = this.venList.filter(e => e.name == ven);
  if (foundemp.length) {
    this.chipSelectedven.push(foundemp[0]);
    this.chipSelectedvenid.push(foundemp[0].id)
  }
}




SubmitAgentGroupVenMapping(){
  //  const index = this.chipSelectedven.indexOf(ven);

  if (this.ven_id.value == "" || this.ven_id.value == undefined || this.ven_id.value == null) {
    this.notify.warning("Please Select Name");
    return false;
  }  

   if (this.limits.value == "" || this.limits.value == undefined || this.limits.value == null) {
    this.notify.warning("Please fill limit");
    return false;
  }

  let obj = {
    arr: this.chipSelectedvenid,
    agent_group_id: this.agentid,
    limit:this.limits.value
  } 
  
  this.serv.AgentGroupvenmappingSubmit(1,obj)
  .subscribe((results: any[]) => {
    this.SpinnerService.hide();    
    console.log(results)       
    this.notify.success("Successfully Mapped")

    this.getAgentGroupVendorMappingSearchSumary(data,1)

    // this.BackToSummary("Work Grop Identifier")  
    this.chipSelectedvenid = []
    this.chipSelectedven = []
    this.limits.setValue(0)
    // this.chipSelectedven.splice(index, 2);
    // this.controls['this.chipSelectedvenid'].reset("") 
  
  }, (error) => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })
}

DeleteAgentGroupVenMap(data){
  console.log("", data)
  let obj = {
    arr: [data?.id],
    agent_group_id: this.agentid
    
  }
  console.log(" arr data",this.chipSelectedvenid)
  console.log(" array objects",obj)
    this.SpinnerService.show();
    this.serv.AgentGroupvenmappingSubmit(0,obj).subscribe(
      (results: any[]) => {        
        console.log("Result remove", results)
        this.SpinnerService.hide();
        //  this.BackToSummary("Work Grop Identifier")
          this.notify.success("Successfully Deleted")   
          this.getAgentGroupVendorMappingSearchSumary(data,1)  
              
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
 


VendorProduct: any 

  ProductAgainstVendor(data){
    console.log(data)
    let id = data?.id
    this.serv.getProductAgainstVendor(id)
    .subscribe(results=>{
      this.VendorProduct = {
        vendor: data,
        product: results 
      }

    })

  }











}

