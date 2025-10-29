import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProductMasterService } from '../product-master.service';
import { ToastrService } from 'ngx-toastr';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../../../service/error-handling-service.service'
import { ActivatedRouteSnapshot, Router } from "@angular/router";
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
// import { NgxSpinnerService } from "ngx-spinner";
// import { ErrorHandlingServiceService } from '../../../service/error-handling-service.service'

export interface typelistss {
  id: string;
  name: any;
  code: any;
  type: string; 

}
export interface rulevalue {
  name:any;
  id:any;
}

@Component({
  selector: 'app-product-master-create',
  templateUrl: './product-master-create.component.html',
  styleUrls: ['./product-master-create.component.scss']
})
export class ProductMasterCreateComponent implements OnInit {
  [x: string]: any;


  Obj = {
    'AgentGroup': false,
    'RulesNote': false,
    'AgentGroupEmpMapping': false,
    'Source': false
  }
  // ScreenView:any

  AgentGroupformgroup: FormGroup;
  RulesNoteformgroup: FormGroup;
  AgentGroupEmpMappingformgroup: FormGroup;
  Sourceformgroup: FormGroup;
  empid: any;
  isState: boolean;
  isDistrict: boolean;
  isCity: boolean;
  isSource: boolean;
  isPincode: boolean;
  StateList: any;
  DistrictList: any;
  PincodeList: any;
  CityList:any;
  RulesData: any 




  constructor(private fb: FormBuilder, private serv: ProductMasterService, private router: Router,
    private notify: ToastrService, private SpinnerService: NgxSpinnerService,
    private errorHandler: ErrorHandlingServiceService,) { }

  @ViewChild('product') matproductAutocomplete: MatAutocomplete;
  @ViewChild('agent') matagentAutocomplete: MatAutocomplete


  @Output() backToSummary = new EventEmitter<any>();

  ngOnInit(): void {

    this.AgentGroupformgroup = this.fb.group({
      name: ''
    })
    this.RulesNoteformgroup = this.fb.group({
      name: '',
      // product: '',
      rule_type:'',
      rule_value:''

    })
    this.AgentGroupEmpMappingformgroup = this.fb.group({
      name: ''
    })
    this.Sourceformgroup = this.fb.group({
      name: '',
      type: 0
    })
    //  this.ActivateRoute.queryParams.subscribe(result=>{
    //   console.log(result)
    //  })


    let data: any = this.serv.TypeOfCreateAgent
    this.tableData = data.tableData,
    console.log("add screen data", data)
    if (data.dataAdd == 'RulesNote') {
      console.log("data.dataAdd>>>>>>>>>>>>>>>>>>>>>>>>>>", data.dataAdd, data.AgentData)
      this.RulesData = data 
      this.Agent_Id = data?.AgentData?.id
      this.RulesNoteformgroup.patchValue({
        name: data.AgentData?.name
      })

    }


    this.getMenus(data)
    if (data.Add) {

    } else if (data.dataAdd == 'AgentGroup') {
      console.log("edit check", data)
      if (data?.Add == false) {
        this.AgentGroupformgroup.addControl("id", new FormControl(data?.data?.id))
      }

      this.AgentGroupformgroup.patchValue({
        name: data.data.name
      })
      console.log("object id", data.data.id)
    }

    this.grouprule()
    if(data?.dataAdd == 'RulesNote'){
      this.AgentRuleNote({id: this.Agent_Id}, 1)
    }

  }

  Agent_Id: any;
  AgentSummary: boolean;
  RulesNoteSummary: boolean;
  AgentGroupEmpMappingSummary: boolean;
  SourceSummary: boolean;
  AgentGroupformCreate: boolean;
  RulesNoteformcreate: boolean;
  AgentGroupEmpmappingCreate: boolean;
  SourceCreate: boolean;
  AgentGroup_id: any

  menusList: any
  SelectedView: any

  getMenus(data) {

    let keysObjs = Object.keys(this.Obj)
    this.menusList = keysObjs
    this.SelectedView = data.data
    console.log("keyObjs keys seperate", keysObjs, data)
    if (data.routes) {
      let objs = this.Obj
      for (let i in objs) {
        if (!(i == data.dataAdd)) {
          objs[i] = false;
        } else {
          objs[i] = true;
        }
      }
    }

  }

  // public displayRuleNote(typ?: typelistss): string | undefined {
  //   return typ ? typ.name : undefined;
  // }
  public displayProduct(typ?: typelistss): string | undefined {
    return typ ? typ.name : undefined;
  }
  public displayrulevalue(rule?: rulevalue): string | undefined {
    return rule ? rule.name : undefined;
  }

  onSubmitAgentGroupClick() {
    let data = this.AgentGroupformgroup.value
    if (data.name == "" || data.name == undefined || data.name == null) {
      this.notify.warning("Please fill Name");
      return false;
    }
    this.serv.AgentGroupform(data)
      .subscribe(results => {
        console.log(results)
        // if (results?.message == "Successfully Updated"){
        //   this.SpinnerService.hide();
        //   if(this.AgentGroup_id != ""){
        //     this.notify.success("Successfully Update")
        //     this.AgentGroup_id = "";
        //     this.BackToSummary("Work Group")
        //     this.AgentGroupformgroup = this.fb.group({
        //       name: [""]          
        //     });
        //   }else {
        //     this.notify.success("Successfully Created");
        //     console.log("create the table", this.notify);
        //     this.AgentGroup_id = "";
        //     this.AgentGroupformgroup = this.fb.group({
        //      name:[""]
        //     });
        //   }
        // }   
        // else {
        //   this.notify.error(results.message);
        //   // this.SpinnerService.hide();
        //   return false;
        // }
        this.notify.success(results?.message)
        this.BackToSummary("Work Group")
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })


  }




  ProductList: any
  TypeList: any

  // AgentRuleget(){

  // }

  AgentRuleproductget(data) {
    this.RulesNoteformgroup.value
    this.serv.ProductDropdown(data)
      .subscribe(results => {
        this.ProductList = results["data"]
        console.log(results)

      })

  }

grouprule(){
  this.serv.getrule().subscribe(
    result =>{
      this.ruledata=result
    }
  )
}
  getdynamicrulevalues(id,value){
    this.serv.getdynamicrulevalues(id,value)
    .subscribe(result=>{
        this.rulevaluedata=result['data'];
        let pagination=result['pagination'];
      })
  }



 

  onSubmitAgentRuleNoteClick() {
    let data = this.RulesNoteformgroup.value;
    if (data.name == "" || data.name == undefined || data.name == null) {
      this.notify.warning("Please fill Name");
      return false;
    }
    // if (data.product == "" || data.product == undefined || data.product == null) {
    //   this.notify.warning("Please Select");
    //   return false;
    // }
    if (data.rule_type == "" || data.rule_type == undefined || data.rule_type == null) {
      this.notify.warning("Please fill Name");
      return false;
    }
    if (data.rule_value == "" || data.rule_value == undefined || data.rule_value == null) {
      this.notify.warning("Please Select");
      return false;
    }

    let obj = {
      name: data?.name,
      // product_id: data?.product?.id,
      rule_type: data?.rule_type,
      rule_value: data?.rule_value?.id,

    }
    this.serv.AgentRuleform(this.Agent_Id, obj)
      .subscribe(results => {
        console.log(results)
        this.notify.success("Successfully created")
        this.AgentRuleNote({id: this.Agent_Id}, 1)
        // this.BackToSummary("Work Grop Identifier")
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })




  }

  //   onSubmitAgentGroupMappingClick(){
  //  let data = this.AgentGroupEmpMappingformgroup.value

  //  if (data.name == "" || data.name == undefined || data.name == null) {
  //   this.notify.warning("Please Select");
  //   return false;
  // }
  // console.log("AgentMapping",this.AgentGroupEmpMappingformgroup.value)

  // this.serv.AgentGroupEmpMap(data)
  //   .subscribe(results => {
  //     console.log(results)
  //     this.notify.success("Successfully created") 
  //     this.BackToSummary("BackToSummary")  
  //   })



  //   }

  onSubmitSourceClick() {

    let data = this.Sourceformgroup.value;
    if (data.name == "" || data.name == undefined || data.name == null) {
      this.notify.warning("Please fill Name");
      return false;
    }
    if (data.type == "" || data.type == undefined || data.type == null) {
      this.notify.warning("Please Select");
      return false;
    }

    console.log("Agent", this.Sourceformgroup.value);

    this.serv.Sourceform(data)
      .subscribe(results => {
        console.log(results)
        this.notify.success("Successfully created")
        this.BackToSummary("Source Summary")
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }



  ///////// BackToSummary 

  BackToSummary(dataForsummary) {
    let obj = {
      name: dataForsummary,
      id: this.Agent_Id,
      action: 'BACK',
      RulesData : this.RulesData 
    }

    this.serv.TypeOfCreateAgent = obj

    this.router.navigate(['crm/crmmaster'])

  }









  //////////////////////////////////Rules Summary
  RuleNoteList:any;
  hasnextRuleNote:boolean;
  hasPreviousRuleNote:boolean;
  CurrentPageRuleNote:number = 1;

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

}
