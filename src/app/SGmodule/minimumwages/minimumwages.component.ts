
// import { state } from './../../atma/vendor-edit/vendor-edit.component';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap, count, takeUntil, map } from 'rxjs/operators';
import { NotificationService } from 'src/app/service/notification.service';
import { SGService } from '../SG.service';
import { SGShareService } from '../share.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NativeDateAdapter} from '@angular/material/core';
import { formatDate } from '@angular/common';



export interface statezonelist{
  id:number,
  name:string,
}
export interface zonelist{
  id:number,
  name:string
}

export interface employeetypelistss{
  id:number
  emptype:string
}

export interface approver {
  id: string;
  full_name: string;
}

// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'MM/YYYY',
//   },
//   display: {
//     dateInput: 'MM/DD/yyyy',
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   },
// };
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}


@Component({
  selector: 'app-minimumwages',
  templateUrl: './minimumwages.component.html',
  styleUrls: ['./minimumwages.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
  // providers: [DatePipe]
  //    {
  //     provide: DateAdapter,
  //    useClass: MomentDateAdapter,
  //     deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  //   },

  //   {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  // ],
})
export class MinimumwagesComponent implements OnInit {

  // State dropdown
  @ViewChild('StateSearchContactInput') StateSearchContactInput:any;
  @ViewChild('typeStateSearch') matAutocompletestateSearch: MatAutocomplete;

  // State dropdown
  @ViewChild('StateContactInput') StateContactInput:any;
  @ViewChild('producttype1') matAutocompletestate: MatAutocomplete;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  // Approver dropdown
  @ViewChild('ApproverContactInput') ApproverContactInput:any;
  @ViewChild('employee') matAutocompleteapprover: MatAutocomplete;

  HourShift:any=[{'id':1,"name":"8 Hours"},{'id':3,"name":"10 Hours"},{'id':2,"name":"12 Hours"}]
  
  minimumwagsummary:boolean=false
  minimuwagesaddform:boolean=false
  minimuwagesgetwages:boolean=false
  yesorno: any[] = [ { id: true, display: 'Percentage' }, { id: false, display: 'Amount' }  ]
  
  // mininumwages summary

  mimwagessummlist:any
  has_previoustype:boolean=false
  has_nexttype:boolean=false
  presentpagetype=1
  pagesize=10
  pagenumber=1
  isMinimumWagespage: boolean = true;
  isShowExtraAllowance:boolean=false;
  extra_Allow=false

  // mimimu wages creations 
  minimumwagesfrom:FormGroup
  mimimumfromarr:FormGroup
  minimumwagesSearchform:FormGroup
  // approval flow

  movetochekerform:FormGroup
  approverform:FormGroup
  rejectedform:FormGroup
  reviewform:FormGroup

  // EditForm values

  Formarry_edit_value:FormGroup
  Formarry_edit_groupvalue:FormGroup

  Extra_Allowance:FormGroup
  allowanceform: FormGroup;
  getAllowanceList:any;
  allowanceNameList=[];
  displayExtra_allowanceList: any 
  // popup-screens
  @ViewChild('addaprover')addaprover;
  @ViewChild('rejected')rejected;
  @ViewChild('review')review;
  @ViewChild('makerchecker')makerchecker;
  @ViewChild('allowance')allowance;
  ShowDataToEditWages: any 
  constructor(private fb: FormBuilder,private datepipe:DatePipe,private toastr: ToastrService,private router:Router,
    private  sgservice:SGService,private shareservice:SGShareService,private notification:NotificationService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.minimumwagsummary=true
    this.minimuwagesaddform=false
    this.minimuwagesgetwages=false
    this.getminimuwages(this.send_value,this.presentpagetype);

    this.Formarry_edit_value=this.fb.group({
      data:this.fb.array([])
    })

    this.Formarry_edit_groupvalue=this.fb.group({
      id:'',
      wages:'',
      variable_dearn_allowance:'',
      gun_allowances:'',
      sgst:'',
      cgst:'',
      epf:'',
      esi:'',
      zone_value:'',
      type_value:'',
      medical_insurance:''
    })

    this.minimumwagesfrom=this.fb.group({
      state_id:[''],
      effectivefrom:[''],
      // effectiveto:[''],
      shift_type:[''],
      is_extra_allowance:false,
      data:this.fb.array([])

    })
    this.mimimumfromarr=this.fb.group({
      zone_id:[''],
      type:[''],
      wages:[''],
      variable_dearn_allowance:[''],
      gun_allowances:[''],
      // sgst:[''],
      // cgst:[''],
      epf:[''],
      esi:[''],
      medical_insurance:[''],
      extra_allowance:this.fb.array([])
    })


    this.movetochekerform=this.fb.group({
      state_id:[''],
      status:[''],
      remarks:[''],
      approver:[''],
      shift_type:['']
    })
    
    this.approverform=this.fb.group({
      state_id:[''],
      status:[''],
      remarks:[''],
      shift_type:['']
    })
    
    this.rejectedform=this.fb.group({
      state_id:[''],
      status:[''],
      remarks:[''],
      shift_type:['']
    })

    this.reviewform=this.fb.group({
      state_id:[''],
      status:[''],
      remarks:[''],
      shift_type:['']
    })
    this.minimumwagesSearchform=this.fb.group({
      state_id:['']
    })

    this.allowanceform=this.fb.group({
      waged_id:[''],
      extra_allows:this.fb.array([])
    })
    
    this.Extra_Allowance =this.fb.group({
      waged_id:[''],
      waged_name:[''],
      is_percent:[''],
      is_amount:[''],
      charges:[''],
    })

    this.getAllowance();

    

  }


  // from arry and details

  subformgroup()
  {
    return this.fb.group({
      zone_id:[''],
      type:[''],
      wages:[''],
      variable_dearn_allowance:[''],
      gun_allowances:[''],
      sgst:[''],
      cgst:['']
    })
  }

  findDataValue(index)
  {
    index = index+1;
    return index%3;
  }

  checkedtrue(data) {
    if (data == true) {
      this.isShowExtraAllowance = true;
    }else{
      this.isShowExtraAllowance = false;

    }
    console.log("checkedtrue", data)
  }


  getAllowance()
  {
    this.sgservice.getExtraAllowance()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        console.log("getAllowance",datas)
        this.getAllowanceList = datas;
       
      })
  }

  arrays()
  {
    return (this.allowanceform.get("extra_allows") as FormArray).controls
  }

  getValue(index)
  {
    return (this.allowanceform.get("extra_allows") as FormArray).controls[index].value
  }

  SaveAllowance(){
    var arr = this.allowanceform.get("extra_allows") as FormArray
    console.log(arr)
    var minimuwages = this.mimimumfromarr.get("extra_allowance") as FormArray
    for(let i=0;i<arr.controls.length;i++)
    {
      if(arr.controls[i].value.is_percent == false && arr.controls[i].value.is_amount ==false)
      {
        while(minimuwages.length !=0)
        {
          minimuwages.removeAt(0)
        }
        this.toastr.warning('', 'please Fill Any One Percentage or Amount', { timeOut: 1500 });
        return false
      }
      else{
        minimuwages.push(arr.controls[i])
      }
    }
    console.log(minimuwages)
    this.allowance.nativeElement.click();
  }

  addAllowanceName() {
    if (this.allowanceform.value.waged_id === "") {
      this.notification.showWarning("Please Fill the Extra Allowance")
      return false
    }
    var arr=this.allowanceform.get("extra_allows") as FormArray

    if(arr.value.length != 0)
    {
      for(let i=0;i<arr.value.length;i++)
      {
        let array_wageid=arr.value[i].waged_id
        let select_wageid=this.allowanceform.value.waged_id.id
        if(array_wageid==select_wageid)
        {
          this.toastr.warning('', 'Already entered this Allowance', { timeOut: 1500 });
          return false
        }

      }
    }

    this.Extra_Allowance= this.fb.group({
      waged_id:this.allowanceform.value.waged_id.id,
      waged_name:this.allowanceform.value.waged_id.text,
      is_percent:false,
      is_amount:false,
      charges:['']
    })

    arr.push(this.Extra_Allowance)

  
  }
 // let list = this.allowanceform.value.waged_id
    // this.allowanceNameList.push(list);
    // console.log("allowancelist",this.allowanceNameList)
    // this.allowanceform.value.waged_id = list.id
    // console.log("array",this.allowanceform.value)

    
    // const arr=this.minimumwagesfrom.get("data") as FormArray
    // let addzoneid=this.mimimumfromarr.value.zone_id.id
  ispercent:boolean
  isamount:boolean
  onCheckPercentage(data,index_value){
    let a = this.allowanceNameList
    
    if(data == true){
      this.allowanceNameList[index_value]["amt_dis"]= true
      this.isamount = true
    }
    else {
      this.allowanceNameList[index_value]["amt_dis"]= false
      this.isamount = false
    }
  }

  onCheckAmount(data,index_value){
    if(data == true){
      this.allowanceNameList[index_value]["per_dis"]= true
      this.ispercent = true
    }
    else {
      this.allowanceNameList[index_value]["per_dis"]= false
      this.ispercent = false
    }
  }

  // allowanceNameDelete(index: number) {
  //   this.allowanceNameList.splice(index, 1);
  // }
  allowanceNameDelete(val)
  {
    // (this.mimimumfromarr.get("extra_allowance") as FormArray).removeAt(val);

    (this.allowanceform.get("extra_allows") as FormArray).removeAt(val);
  }

  getallowancecontrol()
  {
    return (this.mimimumfromarr.get("extra_allowance") as FormArray).controls
  }
  

  addformarray()
  {
    if(this.minimumwagesfrom.value.state_id==="")
    {
      
      this.toastr.warning('', 'Please Select the State', { timeOut: 1500 });
      return false
    }
    if(this.minimumwagesfrom.value.effectivefrom==="")
    {
      this.toastr.warning('', 'Please Select the Effective from date', { timeOut: 1500 });
      return false
    }
   
    if(this.mimimumfromarr.value.zone_id==="" || this.mimimumfromarr.value.zone_id.id===undefined)
    {
      
      this.toastr.warning('', 'Please Select the Zone', { timeOut: 1500 });
      return false
    }
    if(this.mimimumfromarr.value.type.id=="" || this.mimimumfromarr.value.type.id==undefined)
    {
      this.toastr.warning('', 'Please Select the Type', { timeOut: 1500 });
      return false
    }
    if(this.mimimumfromarr.value.wages==="")
    {
      this.toastr.warning('', 'Please Enter the Wages', { timeOut: 1500 });
      return false
    }
    if(this.mimimumfromarr.value.variable_dearn_allowance==="")
    {
      
      this.toastr.warning('', 'Please Enter the variable dearn allowance', { timeOut: 1500 });
      return false
    }
    if(this.mimimumfromarr.value.gun_allowances==="")
    {
      this.toastr.warning('', 'Please Enter the Gun allowance', { timeOut: 1500 });
      return false
    }
    // if(this.mimimumfromarr.value.sgst==="")
    // {
    //   this.toastr.warning('', 'Please Enter the SGST', { timeOut: 1500 });
    //   return false
    // }
    // if(this.mimimumfromarr.value.cgst==="")
    // {
      
    //   this.toastr.warning('', 'Please Enter the CGST', { timeOut: 1500 });
    //   return false
    // }
    if(this.mimimumfromarr.value.epf==="")
    {
      this.toastr.warning('', 'Please Enter the EPF', { timeOut: 1500 });
      return false
    }
    if(this.mimimumfromarr.value.esi==="")
    {
      this.toastr.warning('', 'Please Enter the ESI', { timeOut: 1500 });
      return false
    }
    if(this.minimumwagesfrom.value.is_extra_allowance == true){
      if (this.allowanceform.value.waged_id === "") {
        this.notification.showWarning("Please Fill the Extra Allowance")
        return false
      }
    }
    if(this.mimimumfromarr.value.medical_insurance==="")
    {
      this.toastr.warning('', 'Please Enter the Medical Insurance', { timeOut: 1500 });
      return false
    }



    let databaselist=this.wagesdetailslist
    console.log("server end list",databaselist)
    const arr=this.minimumwagesfrom.get("data") as FormArray
    let addzoneid=this.mimimumfromarr.value.zone_id.id
    let addtypeid=this.mimimumfromarr.value.type.id
    if(this.addFunctionList.length != 0)
    {
      for(let i=0;i<this.addFunctionList.length;i++)
      {
        let zoneid=this.addFunctionList[i].zone_id.id
        let typeid=this.addFunctionList[i].type.id
        if(addtypeid==typeid && addzoneid==zoneid)
        {
          this.toastr.warning('', 'Already enter zone and type', { timeOut: 1500 });
          return false
        }

      }
    }
    for(let i=0;i<databaselist.length;i++)
    {
      let zoneid=databaselist[i].zone.id
        let typeid=databaselist[i].type.id
        if(addtypeid==typeid && addzoneid==zoneid)
        {
          this.toastr.warning('', 'Already enter zone and type in database', { timeOut: 1500 });
          return false
        }

    }

    let dataArray = this.mimimumfromarr.value
    console.log("dataArray",dataArray)
    this.addFunctionList.push(dataArray)
    console.log("array addfunctionlist===>",this.addFunctionList)
    
    
    arr.push(this.mimimumfromarr)

    let arrayReset = this.mimimumfromarr.value.extra_allowance
    console.log("extra allow", arrayReset)
    for(let i in arrayReset){
      this.mimimumfromarr.get("extra_allowance")['controls'][i].get('charges').setValue("")
    }
    // this.mimimumfromarr.value.esi.reset("")
    this.mimimumfromarr.controls["zone_id"].reset('');
    this.mimimumfromarr.controls["type"].reset('');
    this.mimimumfromarr.controls["wages"].reset('');
    this.mimimumfromarr.controls["variable_dearn_allowance"].reset('');
    this.mimimumfromarr.controls["gun_allowances"].reset('');
    this.mimimumfromarr.controls["epf"].reset('');
    this.mimimumfromarr.controls["esi"].reset('');
    this.mimimumfromarr.controls["medical_insurance"].reset('')
    this.extra_Allow=true;
  }

  addFunctionList =[];
  AddFunction(){
    let dataArray = this.mimimumfromarr.value
    console.log("dataArray",dataArray)
    this.addFunctionList.push(dataArray)
    console.log("0 addfunctionlist",this.addFunctionList)
    


  }

  allowanceList:any=[]
  allowanceView(display){
    console.log("view", display)
    this.allowanceList=[]
    this.allowanceList = display.extra_allowance
  }

  getformarraycontrol()
  {
    return (this.minimumwagesfrom.get("data") as FormArray).value
  }

  getformarrayforedit_controls()
  {
    return (this.Formarry_edit_value.get("data") as FormArray).controls
  }
  getformarrayforedit_value()
  {
    return (this.Formarry_edit_value.get("data") as FormArray).value
  }


  deletefromarr(index:number)
  {
    // (this.minimumwagesfrom.get("data") as FormArray).removeAt(val);
    // if((this.minimumwagesfrom.get("data") as FormArray).length==0)
    // {
    //   this.dateread=false
    // }
    this.addFunctionList.splice(index,1)
    
  }

  getminimuwages(val,pageNumber)
  {
    this.sgservice.minimumWages_summary(val,pageNumber).subscribe((results: any[])=>{
      let data=results['data']
      this.mimwagessummlist=data
      let datapagination = results["pagination"];
        console.log("minimum wages ",this.mimwagessummlist)
        if (this.mimwagessummlist.length === 0) {
          this.isMinimumWagespage = false;
        }
        if (this.mimwagessummlist.length >= 0) {
          this.has_nexttype = datapagination.has_next;
          this.has_previoustype = datapagination.has_previous;
          this.presentpagetype= datapagination.index;
          this.isMinimumWagespage = true;
        }
        this.send_value=""

    })
  }
  emptypepreviousClick()
  {
    if(this.has_previoustype==true)
    {
      this.getminimuwages(this.hasNextMNSearch_Page,this.presentpagetype -1)
    }
    
  }
  emptypenextClick()
  {
    if(this.has_nexttype==true)
    {
      this.getminimuwages(this.hasNextMNSearch_Page,this.presentpagetype +1)
    }
    
  }

  statenamedis:any
  zonecount:any
  demozone=[]
  addmimformclick()
  {
    
    this.minimumwagsummary=false
    this.minimuwagesaddform=true
    this.extra_Allow=false
    this.minimuwagesgetwages=false

  }
  stateselect:boolean=false
  edit_component_value:boolean=false
  addvalue_compoent:boolean=true
  finaly_check_update_value:any=[];

  editmimformclick()
  {
    this.finaly_check_update_value=[];
    let datefrom=new Date(this.Armedlist[0].effectivefrom)
    let dateto=new Date(this.Armedlist[0].effectiveto)
    this.minimumwagesfrom.patchValue({
      effectivefrom:datefrom,
      effectiveto:dateto
    })
    this.stateselect=true
    this.dateread=true

    this.addvalue_compoent=false;
    this.edit_component_value=true;
    
    this.Formarry_edit_value=this.fb.group({
      data:this.fb.array([])
    })

    let arr_value = (this.Formarry_edit_value.get("data") as FormArray)

    while (arr_value.length !== 0) {
      arr_value.removeAt(0)
    }
    console.log("Armed List dataaaaaaaaaaaaaaaa..................", this.Armedlist)
    console.log("securitylist List dataaaaaaaaaaaaaaaa..................", this.securitylist)

    for(let i=0;i<this.Armedlist.length;i++)
    {
      this.Formarry_edit_groupvalue=this.fb.group({
        id:this.Armedlist[i]?.id,
        wages:this.Armedlist[i]?.wages,
        variable_dearn_allowance:this.Armedlist[i]?.variable_dearn_allowance,
        gun_allowances:this.Armedlist[i]?.gun_allowances,
        sgst:this.Armedlist[i]?.sgst_percentage,
        cgst:this.Armedlist[i]?.cgst_percentage,
        epf:this.Armedlist[i]?.epf_percentage,
        esi:this.Armedlist[i]?.esi_percentage,
        zone_value:this.Armedlist[i]?.zone?.name,
        type_value:this.Armedlist[i]?.type?.name,
        extra_allowance: this.extraAllowanceArrayData(this.Armedlist[i]),
        medical_insurance: this.Armedlist[i]?.medical_insurance_percentage
          })
      arr_value.push(this.Formarry_edit_groupvalue);
      this.finaly_check_update_value.push(this.Formarry_edit_groupvalue.value)
    }
    for(let i=0;i<this.securitylist.length;i++)
    {
      this.Formarry_edit_groupvalue=this.fb.group({
        id:this.securitylist[i]?.id,
        wages:this.securitylist[i]?.wages,
        variable_dearn_allowance:this.securitylist[i]?.variable_dearn_allowance,
        gun_allowances:this.securitylist[i]?.gun_allowances,
        sgst:this.securitylist[i]?.sgst_percentage,
        cgst:this.securitylist[i]?.cgst_percentage,
        epf:this.securitylist[i]?.epf_percentage,
        esi:this.securitylist[i]?.esi_percentage,
        zone_value:this.securitylist[i]?.zone?.name,
        type_value:this.securitylist[i]?.type?.name,
        extra_allowance: this.extraAllowanceArrayData(this.securitylist[i]),
        medical_insurance: this.securitylist[i]?.medical_insurance_percentage
      })
      arr_value.push(this.Formarry_edit_groupvalue);
      this.finaly_check_update_value.push(this.Formarry_edit_groupvalue.value)
    }
    
    this.minimumwagsummary=false
    this.minimuwagesaddform=true
    this.minimuwagesgetwages=false

  }

  extraAllowanceArrayData(data){
    console.log("data for looping Form extra allowence", data )
    let dataArray = data.extra_allowance
    console.log("dataArray for extra allowence ", dataArray)
    let arr = new FormArray([])
    if(dataArray?.length > 0){
    for(let line of dataArray ){
    let arrForExtraAllowance = this.fb.group({
      id: line.allowance_id, 
      charges: line.charges, 
      name: line.name,  
      is_percentage: line.is_percentage,
      // waged_id: data.id 
    })
    arr.push(arrForExtraAllowance)
  }
}
// else{
//   let arrForExtraAllowance = []
//   arr.push(arrForExtraAllowance)
// }
  return arr
}

  // show summary details

  wagesdetailslist:any=[]
  Armedlist:any=[]
  securitylist:any=[]
  shiftname:any
  approverstatus:any
  ViewSummary=[];
  ArrayList=[];
  armedArrayList=[];
  unarmedArrayList=[];
  ViewSummary_index:any
  IsTenHrsShift: any 
  UnArmedListZone = []
  createminwages(satecre)
  {
    
    let state=new statecreate();
    console.log("state_id of undefined",satecre.state_id)
    state.id=satecre.state.id
    state.state=satecre?.state?.name
    state.name=satecre?.state?.name
    state.state_id=satecre?.state?.id
    this.post_state_id=satecre?.id
    this.approverstatus=satecre?.approval_status?.id;
    this.wagesdetailslist=[]
    this.Armedlist=[]
    this.securitylist=[]
    this.ViewSummary=[]
    this.demozone=[];
    this.UnArmedListZone = []
    // this.sgservice.getdepenceofZonedropdowm(satecre?.state?.name)
    // .subscribe((results: any[]) => {
    //   let datas = results["data"];
      
    //   this.demozone = datas[0].zone;
    //   console.log("demozone",this.demozone)

        this.statenamedis=satecre?.state?.name
      //  this.zonecount=this.demozone.length

      this.sgservice.mininumwagesgetwages(satecre.id,satecre.shift_type?.id).subscribe((result:any[])=>{
      let datas=result['data'];
      this.wagesdetailslist=datas
      console.log("wagesdetailslist",this.wagesdetailslist)

        for(let i=0;i<this.wagesdetailslist.length;i++)
        {
          if(this.wagesdetailslist[i].type.id==1)
          {
            this.Armedlist.push(this.wagesdetailslist[i])
          }
          else if(this.wagesdetailslist[i].type.id==2){
            this.securitylist.push(this.wagesdetailslist[i])
          }
        }
        console.log("sec list and armed list", this.securitylist, this.Armedlist)
        for(let i = 0; i < this.securitylist.length; i++){
          this.UnArmedListZone.push(this.securitylist[i].zone)
        }
        console.log("abcd UnArmedListZone",this.UnArmedListZone)

        for(let i = 0; i < this.Armedlist.length; i++){
          this.demozone.push(this.Armedlist[i].zone)
        }
        console.log("abcd demozone",this.demozone)
        this.zonecount=this.demozone.length>= this.UnArmedListZone.length ? this.demozone.length : this.UnArmedListZone.length

        // sort the Armedlist order
        for(let i=0;i<this.Armedlist.length;i++)
        {
          for(let j=i+1;j<this.Armedlist.length;j++)
          {
            if(this.Armedlist[i].zone.id>this.Armedlist[j].zone.id)
            {
              let temp;
              temp=this.Armedlist[i];
              this.Armedlist[i]=this.Armedlist[j];
              this.Armedlist[j]=temp
              // console.log("data",this.data)
            }
          }
        }

    // sorth the security list 
    for(let i=0;i<this.securitylist.length;i++)
    {
      for(let j=i+1;j<this.securitylist.length;j++)
      {
        if(this.securitylist[i].zone.id>this.securitylist[j].zone.id)
        {
          let temp;
          temp=this.securitylist[i];
          this.securitylist[i]=this.securitylist[j];
          this.securitylist[j]=temp
          // console.log("data",this.data)
        }
      }
    }


    // this.ViewSummary = [
    //   { 
    //   "name":"House Rent",
    //   "unarmedcharges":[
    //     {"amount":"200",
    
    //   }

    //   ],
    //   "armedcharges":[
    //     {"amount":"700",
    
    //   }

    //   ]
      
    //   },
    //   { 
    //   "name":"Conveyance",
    //   "unarmedcharges":[
    //     {
    //       "amount":"300"
    //     }
    //   ],
    //   "armedcharges":[
    //     {"amount":"800",
    
    //   }

    //   ]
      
    //   }]
      
        
        for (let i = 0; i < this.Armedlist.length; i++) {
          if(this.Armedlist[i].extra_allowance){
            let armedallowancelist = this.Armedlist[i].extra_allowance
            for (let j = 0; j < armedallowancelist.length; j++) {
              let amt_json = {
                "amount": armedallowancelist[j].charges
              }
              if(this.ViewSummary.length == 0){
                let first_item = {
                  "name": armedallowancelist[j].name,
                  "armedcharges": [
                    amt_json
                  ]
                }
                this.ViewSummary.push(first_item)
              } else{
                let key_check = 'b'
                for(let k =0; k<this.ViewSummary.length; k++){
                  if(armedallowancelist[j].name==this.ViewSummary[k].name){
                    key_check = 'a'
                    this.ViewSummary_index = k
                  }
                }
                if(key_check == 'a'){
                  this.ViewSummary[this.ViewSummary_index]["armedcharges"].push(amt_json)
                }else{
                  let final_value ={
                    "name":armedallowancelist[j].name,
                    "armedcharges":[
                      amt_json
                    ]
                  }
                  this.ViewSummary.push(final_value)
                }
              }
            }
          }
        }
        console.log("armed",this.ViewSummary)



        for (let i = 0; i < this.securitylist.length; i++) {
          if(this.securitylist[i].extra_allowance){
          let armedallowancelist = this.securitylist[i].extra_allowance
            for (let j = 0; j < armedallowancelist.length; j++) {
              let amt_json = {
                "amount": armedallowancelist[j].charges
              }
              if(this.ViewSummary.length == 0){
                let first_item = {
                  "name": armedallowancelist[j].name,
                  "unarmedcharges": [
                    amt_json
                  ]
                }
                this.ViewSummary.push(first_item)
              } else{
                let key_check = 'c'
                for(let k =0; k<this.ViewSummary.length; k++){
                  if(armedallowancelist[j].name==this.ViewSummary[k].name){
                    key_check = 'd'
                    this.ViewSummary_index = k
                  }
                }
                if(key_check == 'd'){
                  if(this.ViewSummary[this.ViewSummary_index]["unarmedcharges"] == undefined){
                  this.ViewSummary[this.ViewSummary_index]["unarmedcharges"]=[amt_json]
                  }else{
                    this.ViewSummary[this.ViewSummary_index]["unarmedcharges"].push(amt_json)
                  }
                }else{
                  let final_value ={
                    "name":armedallowancelist[j].name,
                    "unarmedcharges":[
                      amt_json
                    ]
                  }
                  this.ViewSummary.push(final_value)
                }
              }
            }
          }
        }
        console.log("unarmed",this.ViewSummary)


       
        
        // //unarmed
        // for (let i = 0; i < this.securitylist.length; i++) {
        //   let unarmedallowancelist = this.securitylist[i].extra_allowance
        //     for (let j = 0; j < unarmedallowancelist.length; j++) {
        //       let unarmedjson = {
        //         amount: unarmedallowancelist[j].charges,
        //       }
        //       this.unarmedArrayList.push(unarmedjson)
        //     }
            
        // }
        // console.log("unarmed",this.unarmedArrayList)


        
      

      // for(let i=0;i<this.wagesdetailslist.length;i++){
      //   let allowancelist = this.wagesdetailslist[i].extra_allowance
      //   for (let j = 0; j < allowancelist.length; j++) {
      //     let json = {
      //       name: allowancelist[j].name,
      //     }
      //     this.ArrayList.push(json)
      //   }
        
      // }
      

      // let jsonlist ={


      // }
      // for(let i=0;i<this.wagesdetailslist.length;i++){
        //   let allowancelist = this.wagesdetailslist[i].extra_allowance
        //   for (let j = 0; j < allowancelist.length; j++) {
        //     let json = {
        //       name: allowancelist[j].name,
        //     }
        //     this.ArrayList.push(json)
        //   }
          
      //  }


    this.shiftname=satecre.shift_type.name
    this.IsTenHrsShift = satecre?.shift_type?.id
    this.minimumwagesfrom.patchValue({
      state_id:state,
      shift_type:satecre.shift_type.id
    })
    this.idValue=satecre.id
    this.minimumwagsummary=false
    this.minimuwagesaddform=false
    this.minimuwagesgetwages=true

    this.movetochekerform.patchValue({
      state_id:satecre.id,
      shift_type:satecre.shift_type.id
    })
    
    this.approverform.patchValue({
      state_id:satecre.id,
      shift_type:satecre.shift_type.id,
      remarks:''
    })
    
    this.rejectedform.patchValue({
      state_id:satecre.id,
      shift_type:satecre.shift_type.id,
      remarks:''
    })

    this.reviewform.patchValue({
      state_id:satecre.id,
      shift_type:satecre.shift_type.id,
      remarks:''
    })
    this.approvalflowlist=[]
    this.approvalflowlist.push(satecre)
    console.log("approval flow list",this.approvalflowlist)
      
    })
     
    // })
  
  
  }

  approvalflowlist:any=[]

  idValue:any
  dateread:boolean=false

  submitformate()
  {

    let subform=new createsubform();
    let subarr=new arrayofsubform();

    let data = this.minimumwagesfrom.controls

    subform.state_id=data['state_id'].value.id;
    subform.effectivefrom=data['effectivefrom'].value
    // subform.effectiveto=data['effectiveto'].value
    subform.shift_type=data['shift_type'].value
    
    let arrayfi=data['data'].value

  
    for(let i=0;i<arrayfi.length;i++)
    {
      if(arrayfi[i].zone_id.id==undefined)
      {
        subarr.zone_id=arrayfi[i].zone_id;
      }
      else{
        subarr.zone_id=arrayfi[i].zone_id.id;
      }
      subarr.type=arrayfi[i].type.id
      subarr.wages=arrayfi[i].wages
      subarr.variable_dearn_allowance=arrayfi[i].variable_dearn_allowance
      subarr.gun_allowances=arrayfi[i].gun_allowances
      subarr.cgst=arrayfi[i].cgst
      subarr.sgst=arrayfi[i].sgst
      subarr.epf=arrayfi[i].epf
      subarr.esi=arrayfi[i].esi

      subform.data.push(subarr)

      subarr=new arrayofsubform();
    }
    
    return subform
  }
  onbackclick()
  {
    this.minimumwagsummary=true
    this.minimuwagesaddform=false
    this.minimuwagesgetwages=false
    this.minimumwagesfrom.patchValue({
      state_id:'',
      effectivefrom:'',
      // effectiveto:'',
      shift_type:''
    })
    this.idValue=undefined
    this.Armedlist=[]
    this.securitylist=[]
    this.wagesdetailslist=[]
    this.addvalue_compoent=true;
    this.edit_component_value=false;

  }

  oncancelclick()
  {
    
    this.minimumwagsummary=true
    this.minimuwagesaddform=false
    this.minimuwagesgetwages=false
    this.minimumwagesfrom.patchValue({
      state_id:'',
      effectivefrom:'',
      shift_type:''
      // effectiveto:''
    })
    this.idValue=undefined
    this.Armedlist=[]
    this.securitylist=[]
    this.stateselect=false
    this.dateread=false
    this.addvalue_compoent=true;
    this.edit_component_value=false;
    let arr_value = this.Formarry_edit_value.get("data") as FormArray
    this.addFunctionList = []
    while (arr_value.length !== 0) {
      arr_value.removeAt(0)
    }
  }

  oncancelvalueofupdate()
  {
    this.minimumwagsummary=false
    this.minimuwagesaddform=false
    this.minimuwagesgetwages=true
    // this.minimumwagesfrom.patchValue({
    //   state_id:'',
    //   effectivefrom:'',
    //   shift_type:''
      // effectiveto:''
    // })
    this.idValue=undefined
   
    this.stateselect=false
    this.dateread=false
    this.addvalue_compoent=true;
    this.edit_component_value=false;
    let arr_value = this.Formarry_edit_value.get("data") as FormArray

    while (arr_value.length !== 0) {
      arr_value.removeAt(0)
    }
  }

  
  datalist:any
  onsubmitmimwages()
  {
    let AddFun = this.addFunctionList 
    // let arrofadd=this.minimumwagesfrom.get("data") as FormArray;
    console.log(" add Functional List ", this.addFunctionList)
    let arrlength=AddFun.length;
    let comapre_value=this.dropdownzone.length;
    let type_length=this.employeetypelist.length
    if(arrlength!=(type_length*comapre_value) && (this.minimumwagesfrom.value.shift_type == 1 || this.minimumwagesfrom.value.shift_type == 2 ))
    {
      this.toastr.warning('', 'Please Enter the value of All Zones', { timeOut: 1500 });
      return false;
    }
    if(this.movetochekerform.value.approver.id === undefined || this.movetochekerform.value.approver=== '')
    {
      this.toastr.warning('', 'Please Select Any one Approver', { timeOut: 1500 });
      return false
    }
    // if(this.movetochekerform.value.remarks=='')
    // {
    //   this.toastr.warning('', 'Please Enter the Remarks', { timeOut: 1500 });
    //   return false
    // }

    const submitlogic=this.minimumwagesfrom.value;
    // submitlogic.effectivefrom=this.datepipe.transform(submitlogic.effectivefrom,'yyyy-MM-dd')
    // // this.minimumwagesfrom.patchValue({
    // //   effectivefrom:submitlogic.effectivefrom,
    // // })
    // if(this.minimumwagesfrom.value.state_id.id != undefined){
    //   this.minimumwagesfrom.value.state_id = this.minimumwagesfrom.value.state_id.id
    // }

   
    // let var1 = this.addFunctionList
    // for(let i=0;i<this.addFunctionList.length;i++)
    // {
    //   if(this.addFunctionList[i].zone_id.id != undefined){
    //  let zoneId =this.addFunctionList[i].zone_id.id;
    //  var1[i].zone_id = zoneId
    //  let typeId =this.addFunctionList[i].type.id;
    //  var1[i].type = typeId
    //   }
    // }

    let ArrSet = []
    for(let i=0;i<this.addFunctionList.length;i++) {
      let obj = {
          "zone_id": this.addFunctionList[i].zone_id.id,
          "type": this.addFunctionList[i].type.id,
          "wages": this.addFunctionList[i].wages,
          "variable_dearn_allowance": this.addFunctionList[i].variable_dearn_allowance,
          "gun_allowances": this.addFunctionList[i].gun_allowances,
          "epf": this.addFunctionList[i].epf,
          "esi": this.addFunctionList[i].esi,
          "extra_allowance":  this.addFunctionList[i].extra_allowance,
          "medical_insurance":  this.addFunctionList[i].medical_insurance

    }
    ArrSet.push(obj)
  } 

  console.log("ArrSet for Final Submit ", ArrSet)

  let FinalObj = {
    effectivefrom :  this.datepipe.transform(submitlogic.effectivefrom,'yyyy-MM-dd'),
    is_extra_allowance :  this.minimumwagesfrom.value.is_extra_allowance,
    shift_type :  this.minimumwagesfrom.value.shift_type, 
    state_id :  this.minimumwagesfrom.value.state_id.id,
    data : ArrSet
  }
    // this.minimumwagesfrom.value.data = ArrSet


  //  let json_output= {
  //    "data": var1,
  //    "state_id": submitlogic.state_id.id,
  //    "effectivefrom":submitlogic.effectivefrom,
  //    "shift_type":submitlogic.shift_type,
  //    "is_extra_allowance":submitlogic.is_extra_allowance
  //  }

    console.log("json_output",this.minimumwagesfrom.value, FinalObj)
    if (this.idValue == undefined) {
      this.sgservice.minimuwageacreate(FinalObj, '')
        .subscribe(result => {
          console.log("result",result)
          if (result.status === "success") {
            this.notification.showSuccess(result.message)
            this.getminimuwages(this.send_value,this.presentpagetype)
            let dataForApprover = {
              state_id: result.id, 
              status: 2, 
              remarks: this.movetochekerform.value.remarks, 
              approver: this.movetochekerform.value.approver.id, 
              shift_type: 1
            }
            this.sgservice.postmakerchekkermim(dataForApprover)
              .subscribe(res => {
                if (res.status == "success") {
                  this.notification.showSuccess("Moved to Approver!...")
                  this.getminimuwages(this.send_value,this.presentpagetype)
                } else {
                  this.notification.showError(res.description)
                }
                this.movetochekerform=this.fb.group({
                  state_id:[''],
                  status:[''],
                  remarks:[''],
                  approver:[''],
                  shift_type:['']
                }) 
                return true
              })

            this.minimumwagesfrom=this.fb.group({
              state_id:[''],
              effectivefrom:[''],
              // effectiveto:[''],
              shift_type:[''],
              is_extra_allowance:false,
              data:this.fb.array([])

            })
            this.mimimumfromarr=this.fb.group({
              zone_id:[''],
              type:[''],
              wages:[''],
              variable_dearn_allowance:[''],
              gun_allowances:[''],
              // sgst:[''],
              // cgst:[''],
              epf:[''],
              esi:[''],
              extra_allowance:this.fb.array([])
            })
            this.allowanceform=this.fb.group({
              waged_id:[''],
              extra_allows:this.fb.array([])
            })
            
            this.Extra_Allowance =this.fb.group({
              waged_id:[''],
              waged_name:[''],
              is_percent:[''],
              is_amount:[''],
              charges:[''],
            })
            this.minimumwagsummary=true
            this.minimuwagesaddform=false
            this.minimuwagesgetwages=false
            // this.minimumwagesfrom.patchValue({
            //   state_id:'',
            //   effectivefrom:'',
            //   shift_type:''
            //   // effectiveto:''
            // })
          
            this.idValue=undefined
            this.addFunctionList =[];
            this.isShowExtraAllowance = false;
            this.Armedlist=[]
            this.securitylist=[]
            this.stateselect=false
            this.dateread=false
            this.addvalue_compoent=true;
            this.edit_component_value=false;
          }
          else {
            this.notification.showError(result.description)
            this.minimumwagsummary=false
            this.minimuwagesaddform=true
            this.minimuwagesgetwages=false
            this.dateread= false
            
          }
          
        })
    } 
    else {
      this.sgservice.minimuwageacreate(this.submitformate(), this.idValue)
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            
          }
          else {
            this.notification.showSuccess("Successfully Updated...")
            this.getminimuwages(this.send_value,this.presentpagetype)      
            this.minimumwagesfrom=this.fb.group({
              state_id:[''],
              effectivefrom:[''],
              // effectiveto:[''],
              shift_type:[''],
              data:this.fb.array([])
        
            })
            this.mimimumfromarr=this.fb.group({
              zone_id:[''],
              type:[''],
              wages:[''],
              variable_dearn_allowance:[''],
              gun_allowances:[''],
              sgst:[''],
              cgst:[''],
              epf:[''],
              esi:['']
            })    
            
          }
        })
      }


    // this.minimumwagsummary=true
    // this.minimuwagesaddform=false
    // this.minimuwagesgetwages=false

    // this.minimumwagesfrom.patchValue({
    //   state_id:'',
    //   effectivefrom:'',
    //   shift_type:''
    //   // effectiveto:''
    // })
  
    // this.idValue=undefined

    // this.Armedlist=[]
    // this.securitylist=[]
    // this.stateselect=false
    // this.dateread=false
    // this.addvalue_compoent=true;
    // this.edit_component_value=false;

    
  }


  // dropdowns

  isLoading=false
  dropdownstate:any
  stateSearchList:any
  stateList: any
  statename(){
    this.dropdownzone=[];
    let prokeyvalue: String = "";
      this.getstate(prokeyvalue);
      this.minimumwagesfrom.get('state_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.sgservice.getStatezonesearch(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          for (let i = 0; i < datas.length; i++) {
            const Date = datas[i].effectivefrom
            let fromdate = this.datepipe.transform(Date, 'dd-MMM-yyyy');
            console.log("date",fromdate)
            datas[i].name = datas[i].name + " (" + fromdate + ")"
            console.log("name",datas[i].name)
          }
          this.dropdownstate = datas;
          

        })

  }
  private getstate(prokeyvalue)
  {
    this.sgservice.getStatezonesearch(prokeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        for (let i = 0; i < datas.length; i++) {
          const Date = datas[i].effectivefrom
          let fromdate = this.datepipe.transform(Date, 'dd-MMM-yyyy');
          console.log("date",fromdate)
          datas[i].name = datas[i].name + " (" + fromdate + ")"
          console.log("name",datas[i].name)
        }
        this.dropdownstate = datas;

      })
  }

  public displaydis1(producttype?: statezonelist): string | undefined {
    return producttype ? producttype.name : undefined;
    
  }

  stateFocusOut(data){
    this.stateList = data.zone;
    console.log("statezone --- focusout",this.stateList)
  }

  ZoneClick(){
    this.dropdownzone = this.stateList
    console.log("zoneclick",this.dropdownzone)

  }

  condition()
  {
    if (this.idValue == undefined){
    this.mimimumfromarr.patchValue({
      zone_id:'',
    })
  }
  }

  //State Search minimum 
  stateSearch(){
    let prokeyvalue: String = "";
      this.getStateSearch(prokeyvalue);
      this.minimumwagesSearchform.get('state_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.sgservice.getStatezonesearch(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          for (let i = 0; i < datas.length; i++) {
            const Date = datas[i].effectivefrom
            let fromdate = this.datepipe.transform(Date, 'dd-MMM-yyyy');
            console.log("date",fromdate)
            datas[i].name = datas[i].name + " (" + fromdate + ")"
            console.log("name",datas[i].name)
          }
          this.stateSearchList = datas;

        })

  }
  private getStateSearch(prokeyvalue)
  {
    this.sgservice.getStatezonesearch(prokeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        for (let i = 0; i < datas.length; i++) {
          const Date = datas[i].effectivefrom
          let fromdate = this.datepipe.transform(Date, 'dd-MMM-yyyy');
          console.log("date",fromdate)
          datas[i].name = datas[i].name + " (" + fromdate + ")"
          console.log("name",datas[i].name)
        }
        this.stateSearchList = datas;

      })
  }

  public displayStateSearch(producttype?: statezonelist): string | undefined {
    return producttype ? producttype.name : undefined;
    
  }
  //  Zones

  dropdownzone:any

  public getzone(prokeyvalue)
  {
    this.sgservice.getdepenceofZonedropdowm(prokeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        
        this.dropdownzone = datas[0].zone;
       
      })
  }

  public displaydis2(producttype?: zonelist): string | undefined {
    //console.log('id', producttype.id);
    // this.selecteddrop=producttype.id
    // console.log('name', this.selecteddrop);
        
    
    return producttype ? producttype.name : undefined;
    
  }
  employeetypelist:any

  employeetypename(){
     
    let prokeyyvalue: String = "";
      this.getcatven(prokeyyvalue);
      this.minimumwagesfrom.get('type')?.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.sgservice.getemployeetypedropdown(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.employeetypelist = datas;
          console.log("product", datas)

        })

  }
  private getcatven(prokeyyvalue)
  {
    this.sgservice.getemployeetypedropdown(prokeyyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeetypelist = datas;

      })
  }

  public displaydiss(employetype?: employeetypelistss): string | undefined {
   
        
    
    return employetype ? employetype.emptype : undefined;
    
  }


  Convertdate(date)
  {
    let date1=new Date(date)
    return this.datepipe.transform(date1,'M/d/yy')
    
  }

  // mimimumwages display
  oncancelclick1()
  {
    this.movetochekerform.patchValue({
      approver:'',
      remarks:''
    })
    this.approverform.patchValue({
      remarks:''
    })
    this.reviewform.patchValue({
      remarks:''
    })
    this.rejectedform.patchValue({
      remarks:''
    })
    
  }

  
  movetoapprove(){
    if( this.movetochekerform.value.approver.id === undefined || this.movetochekerform.value.approver==='')
    {
      this.toastr.warning('', 'Please Select Any one Approver', { timeOut: 1500 });    
      return false
    }
    if(this.movetochekerform.value.remarks=='')
    {
      this.toastr.warning('', 'Please Enter the Remarks', { timeOut: 1500 });    
      return false
    }
    
    this.movetochekerform.patchValue({
      status:2,
      // approver:this.movetochekerform.value.approver.id,
      
    })
    this.movetochekerform.value.approver = this.movetochekerform.value.approver.id,
    console.log("form value",this.movetochekerform.value)
  
    this.sgservice.postmakerchekkermim(this.movetochekerform.value)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Moved to Approver!...")

          this.sgservice.minimumWages_summary(this.send_value,this.presentpagetype).subscribe((result)=>{
            let data=result['data']
            this.mimwagessummlist=data
              
            console.log("minimuwages list",this.mimwagessummlist)
            for(let i=0;i<this.mimwagessummlist.length;i++)
            {
              
              if(this.mimwagessummlist[i].id==this.approvalflowlist[0].id)
              {
                console.log("state_id of list",this.approvalflowlist[0])
                this.approvalflowlist=[]
                this.approvalflowlist.push(this.mimwagessummlist[i])
                this.createminwages(this.approvalflowlist[0])
              }
            }
              
           
          
            this.makerchecker.nativeElement.click();


    this.movetochekerform=this.fb.group({
      state_id:[''],
      status:[''],
      remarks:[''],
      approver:[''],
      shift_type:['']
    })
    
 
          })
          
        } else {
          this.notification.showError(res.description)
        } 
        return true
      })

      
  }

  ApproverPopupForm()
  {
    
    if(this.approverform.value.remarks=='')
    {
      this.toastr.warning('', 'Please Enter the Remarks', { timeOut: 1500 });    
      return false
    }
    
    console.log("approver branch",this.approverform.value)
    this.approverform.patchValue({
      status:3,
     
    })
    this.sgservice.postmakerchekkermim(this.approverform.value)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Approved Successfully!...")

          this.sgservice.minimumWages_summary(this.send_value,this.presentpagetype).subscribe((result)=>{
            let data=result['data']
            this.mimwagessummlist=data
              
            console.log("minimuwages list",this.mimwagessummlist)
            for(let i=0;i<this.mimwagessummlist.length;i++)
            {
             
              if(this.mimwagessummlist[i].id==this.approvalflowlist[0].id)
              {
                console.log("state_id of list",this.approvalflowlist[0])
                this.approvalflowlist=[]
                this.approvalflowlist.push(this.mimwagessummlist[i])
                this.createminwages(this.approvalflowlist[0])
              }
            }
              
            this.addaprover.nativeElement.click();
              this.approverform=this.fb.group({
                state_id:[''],
                status:[''],
                remarks:[''],
                shift_type:['']
              })
        
            
              this.addaprover.nativeElement.click();
            
           
          })
        } else {
          this.notification.showError(res.description)
          
    


    
    this.approverform=this.fb.group({
      state_id:[''],
      status:[''],
      remarks:[''],
      shift_type:['']
    })
    
  
        } 
        return true
      })
    console.log("form value",this.approverform.value)
  }
  rejectPopupForm()
  { 
    if(this.rejectedform.value.remarks=='')
    {
      this.toastr.warning('', 'Please Enter the Remarks', { timeOut: 1500 });    
      return false
    }
    this.rejectedform.patchValue({
      status:0,
     
    })
    console.log("form value",this.rejectedform.value)
    this.sgservice.postmakerchekkermim(this.rejectedform.value)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Rejected!...")

          this.sgservice.minimumWages_summary(this.send_value,this.presentpagetype).subscribe((result)=>{
            let data=result['data']
            this.mimwagessummlist=data
              
            console.log("minimuwages list",this.mimwagessummlist)
            for(let i=0;i<this.mimwagessummlist.length;i++)
            {
              
              if(this.mimwagessummlist[i].id==this.approvalflowlist[0].id)
              {
                console.log("state_id of list",this.approvalflowlist[0])
                this.approvalflowlist=[]
                this.approvalflowlist.push(this.mimwagessummlist[i])
                this.createminwages(this.approvalflowlist[0])
              }
            }
              
            this.rejected.nativeElement.click();
            
 
    
    this.rejectedform=this.fb.group({
      state_id:[''],
      status:[''],
      remarks:[''],
      shift_type:['']
    })
          })
          
        } else {
          this.notification.showError(res.description)
  
    this.rejectedform=this.fb.group({
      state_id:[''],
      status:[''],
      remarks:[''],
      shift_type:['']
    })


        } 
        return true
      })
  }
  reviewPopupForm()
  {
    if(this.reviewform.value.remarks=='')
    {
      this.toastr.warning('', 'Please Enter the Remarks', { timeOut: 1500 });    
      return false
    }
    this.reviewform.patchValue({
      status:4,
      
    })
  
    console.log("form value",this.reviewform.value)
    this.sgservice.postmakerchekkermim(this.reviewform.value)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Reviewed!...")

          this.sgservice.minimumWages_summary(this.send_value,this.presentpagetype).subscribe((result)=>{
            let data=result['data']
            this.mimwagessummlist=data
              
            console.log("minimuwages list",this.mimwagessummlist)
            for(let i=0;i<this.mimwagessummlist.length;i++)
            {
    
              if(this.mimwagessummlist[i].id==this.approvalflowlist[0].id)
              {
                console.log("state_id of list",this.approvalflowlist[0])
                this.approvalflowlist=[]
                this.approvalflowlist.push(this.mimwagessummlist[i])
                this.createminwages(this.approvalflowlist[0])
              }
            }
              
            this.review.nativeElement.click();
            
   
            this.reviewform=this.fb.group({
              state_id:[''],
              status:[''],
              remarks:[''],
              shift_type:['']
            })
          })
            
        } else {
          this.notification.showError(res.description)
          
    
          this.reviewform=this.fb.group({
            state_id:[''],
            status:[''],
            remarks:[''],
            shift_type:['']
          })
        } 
        return true
      })
  }

  // Dropdown list


  employeeList:any

  approvername() {
    let approverkeyvalue: String = "";
    this.getApprover(approverkeyvalue);
  
    this.movetochekerform.get('approver').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')
  
        }),
        switchMap(value => this.sgservice.getEmployeeFilter(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;
  
      })
  
  }
  
  private getApprover(approverkeyvalue) {
    this.sgservice.getEmployeeFilter(approverkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;
      })
  }
  
  public displayFnEmployee(employee?: approver): string | undefined {
    return employee ? employee.full_name : undefined;
  }

  historyData:any

  approvalFlow() {
    let atten_id = this.approvalflowlist[0]?.id
    if(atten_id==undefined)
    {
      this.toastr.warning('', 'Transaction states', { timeOut: 1000 });
      return false
    }
    this.sgservice.getminimuwagesHistory(atten_id)
      .subscribe(result => {
        console.log("approvalFlow", result)
        this.historyData = result.data;
      })
  }

// StateSearch dropdown
currentpagestaSearch:any=1
has_nextstaSearch:boolean=true
has_previousstaSearch:boolean=true
autocompleteStateSearchScroll() {
  
  setTimeout(() => {
    if (
      this.matAutocompletestateSearch &&
      this.autocompleteTrigger &&
      this.matAutocompletestateSearch.panel
    ) {
      fromEvent(this.matAutocompletestateSearch.panel.nativeElement, 'scroll')
        .pipe(
          map( () => this.matAutocompletestateSearch.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(()=> {
          const scrollTop = this.matAutocompletestateSearch.panel.nativeElement.scrollTop;
          const scrollHeight = this.matAutocompletestateSearch.panel.nativeElement.scrollHeight;
          const elementHeight = this.matAutocompletestateSearch.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_nextstaSearch === true) {
              this.sgservice.getStatezonesearch(this.StateSearchContactInput.nativeElement.value, this.currentpagestaSearch + 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  for (let i = 0; i < datas.length; i++) {
                    const Date = datas[i].effectivefrom
                    let fromdate = this.datepipe.transform(Date, 'dd-MMM-yyyy');
                    console.log("date",fromdate)
                    datas[i].state = datas[i].state + " (" + fromdate + ")"
                    console.log("name",datas[i].state)
                  }
                  let datapagination = results["pagination"];
                  this.stateSearchList = this.stateSearchList.concat(datas);
                  if (this.stateSearchList.length >= 0) {
                    this.has_nextstaSearch = datapagination.has_next;
                    this.has_previousstaSearch = datapagination.has_previous;
                    this.currentpagestaSearch = datapagination.index;
                  }
                })
            }
          }
        });
    }
  });
}
// State dropdown
currentpageste:any=1
has_nextsta:boolean=true
has_previoussta:boolean=true
autocompleteStatenameScroll() {
  
  setTimeout(() => {
    if (
      this.matAutocompletestate &&
      this.autocompleteTrigger &&
      this.matAutocompletestate.panel
    ) {
      fromEvent(this.matAutocompletestate.panel.nativeElement, 'scroll')
        .pipe(
          map( () => this.matAutocompletestate.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(()=> {
          const scrollTop = this.matAutocompletestate.panel.nativeElement.scrollTop;
          const scrollHeight = this.matAutocompletestate.panel.nativeElement.scrollHeight;
          const elementHeight = this.matAutocompletestate.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_nextsta === true) {
              this.sgservice.getStatezonesearch(this.StateContactInput.nativeElement.value, this.currentpageste + 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  for (let i = 0; i < datas.length; i++) {
                    const Date = datas[i].effectivefrom
                    let fromdate = this.datepipe.transform(Date, 'dd-MMM-yyyy');
                    console.log("date",fromdate)
                    datas[i].name = datas[i].name + " (" + fromdate + ")"
                    console.log("name",datas[i].name)
                  }
                  let datapagination = results["pagination"];
                  this.dropdownstate = this.dropdownstate.concat(datas);
                  if (this.dropdownstate.length >= 0) {
                    this.has_nextsta = datapagination.has_next;
                    this.has_previoussta = datapagination.has_previous;
                    this.currentpageste = datapagination.index;
                  }
                })
            }
          }
        });
    }
  });
}

   // Approver dropdown
   currentpageaddpay:any=1
   has_nextaddpay:boolean=true
   has_previousaddpay:boolean=true
   autocompleteapprovernameScroll() {
     
     setTimeout(() => {
       if (
         this.matAutocompleteapprover &&
         this.autocompleteTrigger &&
         this.matAutocompleteapprover.panel
       ) {
         fromEvent(this.matAutocompleteapprover.panel.nativeElement, 'scroll')
           .pipe(
             map(() => this.matAutocompleteapprover.panel.nativeElement.scrollTop),
             takeUntil(this.autocompleteTrigger.panelClosingActions)
           )
           .subscribe(()=> {
             const scrollTop = this.matAutocompleteapprover.panel.nativeElement.scrollTop;
             const scrollHeight = this.matAutocompleteapprover.panel.nativeElement.scrollHeight;
             const elementHeight = this.matAutocompleteapprover.panel.nativeElement.clientHeight;
             const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
             if (atBottom) {
               if (this.has_nextaddpay === true) {
                 this.sgservice.getEmployeeFilter(this.ApproverContactInput.nativeElement.value, this.currentpageaddpay + 1)
                   .subscribe((results: any[]) => {
                     let datas = results["data"];
                     let datapagination = results["pagination"];
                     this.employeeList = this.employeeList.concat(datas);
                     if (this.employeeList.length >= 0) {
                       this.has_nextaddpay = datapagination.has_next;
                       this.has_previousaddpay = datapagination.has_previous;
                       this.currentpageaddpay = datapagination.index;
                     }
                   })
               }
             }
           });
       }
     });
   }


   getMyStyles(arg) {
    let Draft = {
       'background-color' :'#aab3be'
    };
    let pendingapprival={
      'background-color' :'#aab3be',
      'width': '162px'
    };
    let aprroved={
      'background-color' :'#00c353'
    };
    
    let return1 ={
      'background-color' :'#ffb52a'
    };
    let reject={
      'background-color' :'#eb372b'
    };

    switch (arg) {
      case 1:
        return Draft;
      case 2:
        return pendingapprival;
      case 3:
        return aprroved;
      case 4:
        return return1;
      case 5:
        return reject;
      default:
        return Draft;
    }
    
    
}

keyPressAmounts(event)
{
  var inp = String.fromCharCode(event.keyCode);

  if (/[0-9.]/.test(inp)||event.keyCode==32  ) {
    return true;
  } else {
    event.preventDefault();
    this.toastr.warning('', 'Number only accepted ', { timeOut: 1500 });      
    return false;
    
  }
}
keyPress(event){
  this.toastr.warning(event, 'Don\'t type ', { timeOut: 1000 });     
  return false
}

send_value:String=""
hasNextMNSearch_Page:any=""
OnserachMinimumdetails()
{
 
    let form_value = this.minimumwagesSearchform.value;

    if(form_value.state_id != "")
    {
      this.send_value=this.send_value+"&state_id="+form_value.state_id.id
    }
   
    this.hasNextMNSearch_Page = this.send_value
    this.presentpagetype = 1
    this.getminimuwages(this.send_value,this.presentpagetype);
  
  // this.sgservice.mininumwagesgetserach(this.presentpagetype,value).subscribe((result)=>{
  //   let data=result['data']
  //   this.mimwagessummlist=data
  //   let datapagination = result["pagination"];
  //     console.log("minimum wages ",this.mimwagessummlist)
      
  //     if (this.mimwagessummlist.length >= 0) {
  //       this.has_nexttype = datapagination.has_next;
  //       this.has_previoustype = datapagination.has_previous;
  //       this.presentpagetype= datapagination.index;
  //     }

  // })

}
resettheminimumform()
{
  this.send_value=""
  this.hasNextMNSearch_Page=""
  this.minimumwagesSearchform=this.fb.group({
    state_id:['']
  })
  this.presentpagetype=1
  this.getminimuwages(this.send_value,this.presentpagetype);
}

  post_state_id:any
  finallist:any=[];
  onsubmitupdate_minimum_Wages()
  {
    this.finallist=[];
    let update_Arr=(this.Formarry_edit_value.get("data") as FormArray).value

    console.log("update arr data final check", update_Arr)
    

    for(let i=0;i<this.finaly_check_update_value.length;i++)
    {
      let checkUpdatedOrNot: boolean
      for(let j=0;j<update_Arr.length;j++){
        if(this.finaly_check_update_value[i]?.id == update_Arr[i]?.id ) {
          let extraAllowanceupdate_Arr = update_Arr[i]?.extra_allowance
          let extraAllowancefinaly_check_update_value = this.finaly_check_update_value[i].extra_allowance

          if(extraAllowanceupdate_Arr?.length == 0   ){

            if(this.finaly_check_update_value[i]?.wages != update_Arr[i]?.wages 
              || this.finaly_check_update_value[i]?.variable_dearn_allowance != update_Arr[i]?.variable_dearn_allowance 
              || this.finaly_check_update_value[i]?.sgst != update_Arr[i]?.sgst 
              || this.finaly_check_update_value[i]?.gun_allowances != update_Arr[i]?.gun_allowances  
              || this.finaly_check_update_value[i]?.esi != update_Arr[i]?.esi 
              || this.finaly_check_update_value[i]?.medical_insurance != update_Arr[i]?.medical_insurance
              || this.finaly_check_update_value[i]?.epf != update_Arr[i]?.epf 
              || this.finaly_check_update_value[i]?.cgst != update_Arr[i]?.cgst )
            {
            //  this.finallist.push(update_Arr[i])
                 checkUpdatedOrNot = true 
            }

          }
          else{
            console.log("extraAllowanceupdate_Arr ", extraAllowanceupdate_Arr)
          console.log("extraAllowancefinaly_check_update_value", extraAllowancefinaly_check_update_value)
          for( let k in  extraAllowanceupdate_Arr  ){

          if(this.finaly_check_update_value[i]?.wages != update_Arr[i]?.wages 
            || this.finaly_check_update_value[i]?.variable_dearn_allowance != update_Arr[i]?.variable_dearn_allowance 
            || this.finaly_check_update_value[i]?.sgst != update_Arr[i]?.sgst 
            || this.finaly_check_update_value[i]?.gun_allowances != update_Arr[i]?.gun_allowances  
            || this.finaly_check_update_value[i]?.esi != update_Arr[i]?.esi 
              || this.finaly_check_update_value[i]?.medical_insurance != update_Arr[i]?.medical_insurance
            || this.finaly_check_update_value[i]?.epf != update_Arr[i]?.epf 
            || this.finaly_check_update_value[i]?.cgst != update_Arr[i]?.cgst
            || this.finaly_check_update_value[i]?.extra_allowance[k].charges != update_Arr[i]?.extra_allowance[k].charges
            || this.finaly_check_update_value[i]?.extra_allowance[k].is_percentage != update_Arr[i]?.extra_allowance[k].is_percentage
            )
          {
          //  this.finallist.push(update_Arr[i])
               checkUpdatedOrNot = true 
          }
        }

          }
          
          // break;
        }
      }
      if( checkUpdatedOrNot == true ){
        this.finallist.push(update_Arr[i])
      }
    }

    console.log("final post aarr",this.finallist)
    if(this.finallist.length != 0)
    {
      this.sgservice.Minimuwages_edit(this.post_state_id,this.finallist).subscribe((result)=>{
        if(result.status==="success")
        {
          this.toastr.success(result.message)
        }
        else{
          this.toastr.error(result.code,result.description)
        }

        this.sgservice.minimumWages_summary(this.send_value,this.presentpagetype).subscribe((result)=>{
          let data=result['data']
          this.mimwagessummlist=data
            
          console.log("minimuwages list",this.mimwagessummlist)
          for(let i=0;i<this.mimwagessummlist.length;i++)
          {
            console.log("value of letter ",this.approvalflowlist[0].state_id)
            if(this.mimwagessummlist[i].id==this.approvalflowlist[0].id)
            {
              console.log("state_id of list",this.approvalflowlist[0])
              this.approvalflowlist=[]
              this.approvalflowlist.push(this.mimwagessummlist[i])
              this.createminwages(this.approvalflowlist[0])
            }
          }
            
          this.Formarry_edit_value=this.fb.group({
            data:this.fb.array([])
          })
        
        })
  
      })
    }
    else{
      this.toastr.info("No data is Changed")
    }

    
  }


  getParticularlineDataForEdit(getdata, indexofParticulardata){

    console.log("getting particular liune data ", getdata)
    console.log("index of particular line selected ", indexofParticulardata)
    let dataAllwanceList = getdata.value.extra_allowance
    this.displayExtra_allowanceList = dataAllwanceList

    
  }

  dialogRef: any

  openModal(templateRef) {
    this.dialogRef = this.dialog.open(templateRef,{
      width: '100%',
      disableClose: true
    });
    this.dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
    });
  }
  closedialog(): void {
    this.dialogRef.close();
  }



  previousChanges(type, IndexOfExternalArray, dataOfParticularLine){
    let alertShow = confirm("Do you want to save?")
    if( alertShow == true  ){
      this.closedialog()
      return true 

    }
    else{
    console.log("type", type)
    console.log("Inner external array ", IndexOfExternalArray)
    console.log("dataOfParticularLine", dataOfParticularLine.value)
    let OverAllData = this.finaly_check_update_value
    let extraAllowanceChange = dataOfParticularLine.value.extra_allowance

    for(let innerdata in extraAllowanceChange  ){
      // extraAllowanceChange[innerdata].charges = OverAllData[innerdata].charges 
      // extraAllowanceChange[innerdata].is_percentage = OverAllData[innerdata].is_percentage 
      console.log("OverAllData", OverAllData)
      console.log("OverAllData[innerdata]", OverAllData[IndexOfExternalArray])
      console.log("OverAllData[innerdata].extraallowance", OverAllData[IndexOfExternalArray].extra_allowance)
      console.log("IndexOfExternalArray", IndexOfExternalArray)
      console.log("innerdata", innerdata)
      this.Formarry_edit_value.get('data')['controls'][IndexOfExternalArray].get('extra_allowance')['controls'][innerdata].get('charges').setValue(OverAllData[IndexOfExternalArray].extra_allowance[innerdata].charges)
      this.Formarry_edit_value.get('data')['controls'][IndexOfExternalArray].get('extra_allowance')['controls'][innerdata].get('is_percentage').setValue(OverAllData[IndexOfExternalArray].extra_allowance[innerdata].is_percentage)
    }
    this.closedialog()

  }





    
  }


// this.overallDataCheck = this.Formarry_edit_value.value  







}



export class statecreate{
  id:any
  state:any
  state_id:any
  name: any 
}

export class createsubform{
  state_id:any
  effectivefrom:any
  // effectiveto:any
  shift_type:any
  data:any[]=[]
}

export class arrayofsubform{
  zone_id:any
  type:any
  wages:any
  variable_dearn_allowance:any
  gun_allowances:any
  sgst:any
  cgst:any
  epf:any
  esi:any
}