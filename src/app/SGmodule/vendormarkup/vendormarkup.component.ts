
import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray,FormControl,Validators  } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap, count, takeUntil, map } from 'rxjs/operators';
import { SGService } from '../SG.service';
import { SGShareService } from '../share.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Data, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { isInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { ErrorHandlingService } from '../error-handling.service';
import { SummaryResolver } from '@angular/compiler';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
export interface premiseList{
  id:number
  name:string
  code:string
}
export const MY_FORMATS = {
  parse: {
    dateInput: 'MMM YYYY',
  },
  display: {
    dateInput: 'MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


export interface branchList{
  id:number
  name:string
  code:string
}

export interface employeetypelistss{
  id:number
  emptype:string
  code:string
}
export interface ShiftnameListsss{
  id:number
  shift_name:string
}


@Component({
  selector: 'app-vendormarkup',
  templateUrl: './vendormarkup.component.html',
  styleUrls: ['./vendormarkup.component.scss'],
    providers: [
      {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
      },
  
      { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class VendormarkupComponent implements OnInit {

  monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  // branch dropdown
  @ViewChild('branchContactInput') branchContactInput:any;
  @ViewChild('branchtype') matAutocompletebrach: MatAutocomplete;

  // Premise dropdown
  @ViewChild('PremiseContactInput') PremiseContactInput:any;
  @ViewChild('producttype') matAutocompletepremise: MatAutocomplete;

  @ViewChild('PremiseContactInput') clear_premisesSearch

  // addbranch dropdown
  @ViewChild('addbranchContactInput') addbranchContactInput:any;
  @ViewChild('branchtypeaddpri') addmatAutocompletebranch: MatAutocomplete;


    // addPremise dropdown
    @ViewChild('addPremiseContactInput') addPremiseContactInput:any;
    @ViewChild('addpri') addmatAutocompletepremise: MatAutocomplete;
  
    @ViewChild('addPremiseContactInput') clear_premises

  // addbranch dropdown
  @ViewChild('addpaybranchContactInput') addpaybranchContactInput:any;
  @ViewChild('producttypepri1') addpaymatAutocompletebranch: MatAutocomplete;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  //premises dropdown


  @ViewChild('button')button:any
  
  HourShift=[{'id':1,"name":"8 Hours"}, {'id':3,"name":"10 Hours"}, {'id':2,"name":"12 Hours"}]
  Shiftcount=[{'id':1,"name":"One"},{'id':2,"name":"Two"}]

  // shareservive
  vendordetails:any
  vendorid:any
  // page conditions
  minDate = moment().startOf('month'); // first day of current month
  maxDate = moment().endOf('month'); 
  today = moment();
  filterMonth = (d: moment.Moment | null): boolean => {
    if (!d) return false;
    // Only allow same year, same month
    const now = this.today;
    return (d.year() > now.year()) || 
         (d.year() === now.year() && d.month() >= now.month());
  };
  monthdate = new FormControl(moment());
  monthdateone = new FormControl(moment());
  monthdatesecond= new FormControl(moment());
  createmonthdatesecond = new FormControl(moment())

  // chosenYearHandler(normalizedYear: Moment) {
  //   const ctrlValue = this.monthdate.value;
  //   ctrlValue.year(normalizedYear.year());
  //   this.monthdate.setValue(ctrlValue);
  // }

  // chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
  //   const ctrlValue = this.monthdate.value;
  //   ctrlValue.month(normalizedMonth.month());
  //   this.monthdate.setValue(ctrlValue);
  //   datepicker.close();
  //   this.typeeditform.patchValue({
  //     monthdate: this.monthdate.value
  //   })
  // }
  selectedYear: number;

chosenYearHandler(normalizedYear: Moment) {
  this.selectedYear = normalizedYear.year(); // store selected year temporarily
}

chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
  const ctrlValue = this.monthdate.value || moment(); // use current moment if null
  ctrlValue.year(this.selectedYear || ctrlValue.year()); // apply selected year
  ctrlValue.month(normalizedMonth.month()); // set selected month
  this.monthdate.setValue(ctrlValue);
  this.typeeditform.patchValue({
    monthdate: this.monthdate.value
  });
  datepicker.close(); // close the picker
}
  chosenYearHandlerone(normalizedYear: Moment) {
    const ctrlValue = this.monthdateone.value;
    ctrlValue.year(normalizedYear.year());
    this.monthdateone.setValue(ctrlValue);
  }

  chosenMonthHandlerone(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.monthdateone.value;
    ctrlValue.month(normalizedMonth.month());
    this.monthdateone.setValue(ctrlValue);
    datepicker.close();
    this.deleteform.patchValue({
      monthdateone: this.monthdateone.value
    })
  }
  chosenYearHandlersecond(normalizedYear: Moment) {
    const ctrlValue = this.monthdatesecond.value;
    ctrlValue.year(normalizedYear.year());
    this.monthdatesecond.setValue(ctrlValue);
  }

  chosenMonthHandlersecond(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.monthdatesecond.value;
    ctrlValue.month(normalizedMonth.month());
    this.monthdatesecond.setValue(ctrlValue);
    datepicker.close();
    this.Employeeaddform.patchValue({
      monthdatesecond: this.monthdatesecond.value
    })
  }
  isprimessummary:boolean
  isprimesadd:boolean
  isemployyeadd:boolean

  // Vendormarkup-Premise
  premisearchform:FormGroup
  isLoading: boolean;
  effective_to_month_year:boolean=false;
  premiselistt: any;
  addBranchList: any;
  branchList: any;
  branchSearhList:any;
  premiseSearchlist: any
  premiseaddform:FormGroup

  // premises add form 

  premiselist:any
  presentpagetype:number=1
  pagesize=10
  has_previouspremis:boolean=false
  isemp_edited:boolean;
  has_nextprimes:boolean=false
  pagenumber=1;

  @ViewChild('myButton') myButton : ElementRef;
  @ViewChild('closebutton') closebutton :ElementRef;
  @ViewChild('closebuttonadd')closebuttonadd:ElementRef;
  @ViewChild('closebuttonempadd')closebuttonempadd;
  @ViewChild('closebuttonempsummary')closebuttonempsummary;
  @ViewChild('deletebuttonempsummary')deletebuttonempsummary;
  // Employee add form 
  typeaddform:FormGroup
  typeeditform:FormGroup
  deleteform:FormGroup
  Employeeaddform:FormGroup
  vendorName: any;
  paying_branch: any;
  premises: any;
  state: any;
  emp_type_editdata=[];
  zone: any;
  isPremisesAddress = false;
  updatelineName1: string;
  updatelineName2: string;
  updatelineName3: string;
  updatecityName: string;
  updatedistrictName: string;
  updatestateName: string;
  updatepinCode: string;
  premisesname:string;
  toggletype: number;
  confirmation: boolean;

  constructor(private fb: FormBuilder,private router: Router,private errorHandler: ErrorHandlingService,private toastr: ToastrService, private  sgservice:SGService,private shareservice:SGShareService,private notification:NotificationService,
    private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.isprimessummary=true
   this.vendordetails=this.shareservice.vendormappingdetails.value
   this.vendorid=this.vendordetails.id
   this.vendorName="(" +this.vendordetails?.vendor?.code+") "+this.vendordetails?.vendor?.name
   this.state=this.vendordetails?.state?.name
   this.zone=this.vendordetails?.zone?.name
    this.premisearchform=this.fb.group({
      premise_id:[''],
      branch_id:[''],

    })
    console.log("data",this.vendordetails)
    this.getPM_summary(this.vendordetails,this.send_value,this.presentpagetype)
    
   
    this.typeaddform=this.fb.group({
      type_id:[''],
      count:[''],
      shift_count:[''],
      shift_type:[''],
      createmonthdatesecond:[''],
      shift_name:[''],
      shift_code:[''],
      shift_time:['']
    })
    this.deleteform = this.fb.group({
      monthdateone: [null, Validators.required]
    });
    this.typeeditform=this.fb.group({
      type_id:[''],
      count:[''],
      shift_count:[''],
      shift_type:[''],
      branch_id:[''],
      premise_id:[''],
      monthdate:[''],
      id:[''],
      shift_name:[''],
      shift_code:[''],
      shift_time:[''],
      risk_categorization:['']
    })

    this.Employeeaddform=this.fb.group({
      name:[''],
      code:[''],
      vendor_id:[''],
      premise_id:[''],
      branch_id:[''],
      ven_markmap_id:[''],
      type:[''],
      monthdatesecond: [null]
    })
    this.premiseaddform=this.fb.group({
      premise_id:[''],
      // paying_branch:[''],
      branch_id:[''],
      risk_cat:[''],

      typearr:this.fb.array([])      

    })
    this.risk_type()
  }


  shiftselect(data)
  {
    console.log("data",data)
    if(data==1)
    {
      this.Shiftcount=[]
      this.Shiftcount.push({'id':1,"name":"One"})
      this.Shiftcount.push({'id':2,"name":"Two"})
      this.Shiftcount.push({'id':3,"name":"Three"})
    
    }
    if(data==2)
    {
      this.Shiftcount=[]
      this.Shiftcount.push({'id':1,"name":"One"})
      this.Shiftcount.push({'id':2,"name":"Two"})
      
    }

  }
  Submitformate()
  {
    let data = this.premiseaddform.controls
    let submitobj=new submitformate();
    submitobj.premise_id=data['premise_id'].value.id
    submitobj.branch_id=data['branch_id'].value.id
    submitobj.risk_categorization=data['risk_cat'].value.id
    // submitobj.paying_branch=data['paying_branch'].value.id
    let arr=data['typearr'].value

    for(let i=0;i<arr.length;i++)
    {
      let submitarr=new typeobj()
      submitarr.type_id=arr[i].type_id.id
      submitarr.count=arr[i].count
      submitarr.shift_type=arr[i].shift_type
      // submitarr.shift=0
      submitarr.shift=arr[i].shift_count
      submitarr.shift_details=arr[i].shift_name.id
      const momentDate = arr[i].createmonthdatesecond;
        submitarr.month = arr[i].effective_from_month
        submitarr.year = arr[i].effective_from_year

      submitobj.type.push(submitarr)
    }
    return submitobj
  }
 

  getformprimesarr()
  {
    return (this.premiseaddform.get('typearr') as FormArray).value
  }
  deletefromarr(i)
  {
    (this.premiseaddform.get('typearr') as FormArray).removeAt(i)
  }
  riskcatname:any
  createrisk:boolean = false;
  addtypearr(){
    console.log("vlaue of the form",this.typeaddform.value)

    if(this.premiseaddform.value.branch_id==="")
    {
      
      this.toastr.warning('', 'Please Enter the Paying Branch', { timeOut: 1000 });
      return false
    }
    if(this.premiseaddform.value.premise_id==="")
    {
      
      this.toastr.warning('', 'Please Enter the Premises', { timeOut: 1000 });
      return false
    }
    // if(this.premiseaddform.value.paying_branch==="")
    // {
      
    //   this.toastr.warning('', 'Please Enter the Paying_Branch', { timeOut: 1000 });
    //   return false
    // }
    if(this.typeaddform.value.type_id==="")
    {
      
      this.toastr.warning('', 'Please Enter the Employee Type', { timeOut: 1000 });
      return false
    }
    if(this.typeaddform.value.count==="")
    {
      
      this.toastr.warning('', 'Please Enter the Employee Count', { timeOut: 1000 });
      return false
    }
    if(this.typeaddform.value.shift_type==="")
    {
      
      this.toastr.warning('', 'Please Select the shift type', { timeOut: 1000 });
      return false
    }
    if(this.typeaddform.value.shift_count==="")
    {
      
      this.toastr.warning('', 'Please Select the shift count', { timeOut: 1000 });
      return false
    }
    if(this.typeaddform.value.createmonthdatesecond==="")
    {
      
      this.toastr.warning('', 'Please Select the Effective Month & Year', { timeOut: 1000 });
      return false
    }

    if(parseInt(this.typeaddform.value.count) < this.typeaddform.value.shift_count)    
    {
      this.toastr.warning('', 'Employee count is less than shift count', { timeOut: 1000 });
      return false
    }
    const arr=this.premiseaddform.get('typearr') as FormArray

    console.log('arr length',arr)
    for(let i=0;i<arr.value.length;i++)
    {
      if (arr.value[i].type_id.id === this.typeaddform.value.type_id.id && arr.value[i].status !== 0) 
      {
        this.toastr.warning('', 'already type added', { timeOut: 1000 });
        return false
      }
    }
    this.createrisk = true;
    this.riskcatname = this.premiseaddform.value.risk_cat 

    const raw = this.typeaddform.value;
    const monthDate = raw.createmonthdatesecond;

        const formattedData = {
          type_id: raw.type_id,
          count: raw.count,
          shift_count: raw.shift_count,
          shift_type: raw.shift_type,
          shift_name:raw.shift_name,
          createmonthdatesecond: raw.createmonthdatesecond,
          effective_from_month: monthDate.month() + 1,
          effective_from_year: monthDate.year(),
        };

        arr.push(this.fb.group(formattedData));

    // arr.push(this.typeaddform)

    this.typeaddform=this.fb.group({
      type_id:[''],
      count:[''],
      shift_count:[''],
      shift_type:[''],
      createmonthdatesecond:[''],
      shift_name:[''],
      shift_code:[''],
      shift_time:['']
    })
  }
  edittypearr(){
    if(this.typeeditform.value.type_id==="")
    {
      
      this.toastr.warning('', 'Please Enter the Employee Type', { timeOut: 1000 });
      return false
    }
    if(this.typeeditform.value.count==="")
    {
      
      this.toastr.warning('', 'Please Enter the Employee Count', { timeOut: 1000 });
      return false
    }
    if(this.typeeditform.value.shift_type==="")
    {
      
      this.toastr.warning('', 'Please Select the shift type', { timeOut: 1000 });
      return false
    }
    if(this.typeeditform.value.shift_count==="")
    {
      
      this.toastr.warning('', 'Please Select the shift count', { timeOut: 1000 });
      return false
    }
    if(!(this.typeeditform.value.monthdate))
    {
      this.toastr.warning('', 'Please Select the Effective From Date', { timeOut: 1000 });
      return false
    }

    if(parseInt(this.typeeditform.value.count) < this.typeeditform.value.shift_count)    
    {
      this.toastr.warning('', 'Employee count is less than shift count', { timeOut: 1000 });
      return false
    }
   const raw = this.typeeditform.value;
    const monthDate: Date = raw.monthdate;

    const updatedData = {
      ...raw,
      effective_from_month: new Date(monthDate).getMonth() + 1,
      effective_from_year: new Date(monthDate).getFullYear(),
      isedited:true
    };


    // if (this.selectedIndex !== undefined && this.selectedIndex !== null) {
    //   this.emp_type_editdata[this.selectedIndex] = updatedData;
    // } else {
      this.emp_type_editdata.push(updatedData);
    // }
    

    this.typeeditform.reset();
    this.monthdate.reset();
  }


  cancelprimesform()
  {
    this.premiseaddform.patchValue({
      premise_id:'',
      branch_id:'',
      // paying_branch:''
      risk_cat:''
    })
    this.typeaddform=this.fb.group({
      type_id:[''],
      count:[''],
      shift_count:[''],
      shift_type:[''],
      createmonthdatesecond:[''],
      shift_name:[''],
      shift_code:[''],
      shift_time:['']
    })
    let arr=this.premiseaddform.get('typearr') as FormArray
    
    while(arr.length!=0)
    {
      this.deletefromarr(0)
    }
    this.isPremisesAddress = false;
  }
  // Employee submit Form
  onemployeeaddcancel()
  {
    this.Employeeaddform=this.fb.group({
      name:'',
      code:'',
      vendor_id:'',
      premise_id:'',
      ven_markmap_id:[''],
      branch_id:'',
      type:'',
      monthdatesecond:''
    })
    
        
  }

  EmployeeaddForm(){
    if(this.Employeeaddform.value.name==="")
    {
      
      this.toastr.warning('', 'Please Enter the Name', { timeOut: 1000 });
      return false
    }
    if(this.Employeeaddform.value.code==="")
    {
      
      this.toastr.warning('', 'Please Enter the Code', { timeOut: 1000 });
      return false
    }
    

    console.log("employeer add",this.Employeeaddform.value)
    let data={"from_month":this.Employeeaddform.value.monthdatesecond.month()+1,
      "from_year":this.Employeeaddform.value.monthdatesecond.year(),
      "branch_id":this.Employeeaddform.value.branch_id,
      "code":this.Employeeaddform.value.code,
      "name":this.Employeeaddform.value.name,
      "premise_id":this.Employeeaddform.value.premise_id,
      "type":this.Employeeaddform.value.type,
      "ven_markmap_id":this.Employeeaddform.value.ven_markmap_id,
      "vendor_id":this.Employeeaddform.value.vendor_id
    }



    
    if (this.idValue == undefined) {
      this.sgservice.Employeeaddform(data, '')
        .subscribe(result => {
          console.log("result",result)
          
          if (result.status === "success") {
            this.notification.showSuccess(result.message)
            this.getPM_summary(this.vendordetails,this.send_value,this.presentpagetype);
            this.closebuttonempadd.nativeElement.click();
            this.Employeeaddform=this.fb.group({
              name:'',
              code:'',
              vendor_id:'',
              premise_id:'',
              branch_id:'',
              ven_markmap_id:'',
              type:'',
              monthdatesecond:''
            })
          }
          else {
            this.notification.showError(result.description)
            
          }
          
          
        },
        error => {
          this.errorHandler.handleError(error);
          
        })
    } 
    else {
      this.sgservice.Employeeaddform(data, this.idValue)
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          }
          else {
            this.notification.showSuccess("Successfully Updated...")
            this.getPM_summary(this.vendordetails,this.send_value,this.presentpagetype);
            this.closebuttonempadd.nativeElement.click();
            this.Employeeaddform=this.fb.group({
              name:'',
              code:'',
              vendor_id:'',
              premise_id:'',
              branch_id:'',
              ven_markmap_id:'',
              type:'',
              monthdatesecond:''
            })
          }
        })
      }

      
          
    
    }

  //premises mapping Summary
  isPremisesMapping: boolean = true
  adminRightsShowHide: boolean 

  getPM_summary(data,val,pagenumber)
  {
    console.log("data id",data.id)
    this.SpinnerService.show()
    this.sgservice.getPM_summaryApi(data.id,val,pagenumber).subscribe((result)=>{
      this.SpinnerService.hide()
      let data=result['data']
      this.adminRightsShowHide = result.is_admin 
      this.premiselist=data
      console.log("working fine server")
      let datapagination = result["pagination"];

        if (this.premiselist.length > 0) {
          this.has_nextprimes = datapagination.has_next;
          this.has_previouspremis = datapagination.has_previous;
          this.presentpagetype= datapagination.index;
          this.isPremisesMapping = true
        }
        if (this.premiselist.length === 0) {
          this.isPremisesMapping = false
        }
    })
  
  }

  primespreviousClick(){
    if(this.has_previouspremis==true)
    {
      this.getPM_summary(this.vendordetails,this.send_value,this.presentpagetype- 1)
    }
    
  }

  primesnextClick(){
    if( this.has_nextprimes==true)
    {
      this.getPM_summary(this.vendordetails,this.send_value,this.presentpagetype+ 1)
    }
    
  }

  formreset()
  {
    this.send_value=""
    this.premisearchform=this.fb.group({
      branch_id:[''],
      premise_id:[''],
     
    })
    this.getPM_summary(this.vendordetails,this.send_value,this.presentpagetype)
  }


  send_value:String=""

  PM_summarySearch(){
    let form_value = this.premisearchform.value;

    if(form_value.branch_id==="")
    {
      
      this.toastr.warning('', 'Please Enter the Branch', { timeOut: 1000 });
      return false
    }

    
    if(form_value.premise_id==="")
    {
      
      this.toastr.warning('', 'Please Enter the Premises', { timeOut: 1000 });
      return false
    }

    if(form_value.branch_id != "")
    {
      this.send_value=this.send_value+"&branch_id="+form_value.branch_id.id
    }
    if(form_value.premise_id != "")
    {
      this.send_value=this.send_value+"&premise_id="+form_value.premise_id.id
    }

    this.getPM_summary(this.vendordetails,this.send_value,this.presentpagetype)
  }

  // serachform(data,pagenumber=1)
  // {

  //   if(data.branch_id==="")
  //   {
      
  //     this.toastr.warning('', 'Please Enter the Branch', { timeOut: 1000 });
  //     return false
  //   }

    
  //   if(data.premise_id==="")
  //   {
      
  //     this.toastr.warning('', 'Please Enter the Premises', { timeOut: 1000 });
  //     return false
  //   }
    
  //   console.log("vendor details "+this.vendordetails.id+"primeis "+ data.premise_id.id +" branch"+data.branch_id.id)
  //   this.sgservice.getvendorprimes(this.vendordetails.id,data.premise_id.id,data.branch_id.id,pagenumber).subscribe((result)=>
  //   {
  //     let datas=result['data']
  //     console.log("datas",datas)
  //     this.premiselist=datas

  //     if(this.premiselist.length==0)
  //     {
  //       this.notification.showError("No DATA Found Create or Update the Primes")
  //     }

  //     console.log("vendor",this.premiselist)
  //     let datapagination = result["pagination"];
       
  //       if (this.premiselist.length >= 0) {
  //         this.has_nextprimes = datapagination.has_next;
  //         this.has_previouspremis = datapagination.has_previous;
  //         this.presentpagetype= datapagination.index;
  //       }

  //   })

  // }


  

  // primes Add form 
  idValue:any
  PremiseaddForm(){
    console.log("premise value",this.Submitformate())

    if(this.premiseaddform.value.branch_id==="")
    {
      
      this.toastr.warning('', 'Please Enter the Paying Branch', { timeOut: 1000 });
      return false
    }
    if(this.premiseaddform.value.premise_id==="")
    {
      
      this.toastr.warning('', 'Please Enter the Premises', { timeOut: 1000 });
      return false
    }

    let typearray=this.premiseaddform.get("typearr") as FormArray;
    let arrlength=typearray.length;
    console.log("length",typearray)
    if(arrlength==0)
    {
      this.toastr.warning('', 'Please Click Add Button', { timeOut: 1500 });
      return false;
    }

    // if(this.premiseaddform.value.paying_branch==="")
    // {
      
    //   this.toastr.warning('', 'Please Enter the Paying_Branch', { timeOut: 1000 });
    //   return false
    // }
    


    // this.premiseaddform.patchValue({
    //   premise_id:this.premiseaddform.value.premise_id.id,
    //   type_id:this.premiseaddform.value.type_id.id,
    //   branch_id:this.premiseaddform.value.branch_id.id,
    //   paying_branch:this.premiseaddform.value.paying_branch.id,
    // })
    // console.log("premiseform",this.premiseaddform.value)
    
    if (this.idValue == undefined) {
      this.sgservice.premiseaddform(this.vendorid,this.Submitformate(), '')
        .subscribe(result => {
          console.log("result",result)
          if (result.status === "success") {
            this.notification.showSuccess(result.message)
            this.getPM_summary(this.vendordetails,this.send_value,this.presentpagetype)
            this.closebutton.nativeElement.click();
            this.closebuttonadd.nativeElement.click();
            this.premiseaddform=this.fb.group({
              premise_id:[''],
              // paying_branch:[''],
              branch_id:[''],
        
              typearr:this.fb.array([])      
            })
            this.typeaddform=this.fb.group({
              type_id:[''],
              count:[''],
              shift_count:[''],
              shift_type:[''],
              createmonthdatesecond:[''],
              shift_name:[''],
              shift_code:[''],
              shift_time:['']
            })
            this.isPremisesAddress = false;   
          }
          else {
            this.notification.showError(result.description)
           
          }
        
          
        })
    } 
    else {
      this.sgservice.premiseaddform(this.vendorid,this.Submitformate(), this.idValue)
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            this.premiseaddform.patchValue({
              premise_id:'',
              branch_id:'',
              type_id:'',
              count:''
            })
          }
          else {
            this.notification.showSuccess("Successfully Updated...")
            this.getPM_summary(this.vendordetails,this.send_value,this.presentpagetype)
            this.closebutton.nativeElement.click();
            this.premiseaddform=this.fb.group({
              premise_id:[''],
              // paying_branch:[''],
              branch_id:[''],
        
              typearr:this.fb.array([])      
            })
            this.typeaddform=this.fb.group({
              type_id:[''],
              count:[''],
              shift_count:[''],
              shift_type:[''],
              createmonthdatesecond:[''],
              shift_name:[''],
              shift_code:[''],
              shift_time:['']
            })
          }
        })
      }   
    
    }
    emp_type_editdataone=[]
    
    PremiseeditForm(){
      let filterdata:any={};
      if(!this.paying_branch)
        {
          
          this.toastr.warning('', 'Paying Branch is Missing, Try Again Later', { timeOut: 1000 });
          return false
        }
        if(!this.premises)
        {
          
          this.toastr.warning('', 'Premises is Missing, Try Again Later', { timeOut: 1000 });
          return false
        }
        
        if(this.emp_type_editdata.length==0)
          {
            this.toastr.warning('', 'Please Click Add Button', { timeOut: 1500 });
            return false;
          }
        
        for (let i of this.emp_type_editdata){

         
          if (i['status']!==0 && i['isedited']){
      
            // if (i['monthdate']?.month() !== '' && i['monthdate']?.month()!==undefined) { 
         
            filterdata={
              'branch_id':i['branch_id'],
              'count':i['count'],
              'id':i['id'],
             'month': i['effective_from_month'],
             'year': i['effective_from_year'],
             'premise_id':i['premise_id'],
              'shift_count':i['shift_count'],
              'shift_type':i['shift_type'],
                'type_id':i['type_id'],
                'shift_details':i['shift_name'].id,
                'risk_categorization':i['risk_categorization']
              

           }
           this.emp_type_editdataone.push(filterdata)
          // }

          }
         
          // this.emp_type_editdataone.push(filterdata)
         
        }
        console.log (this.emp_type_editdataone)
        this.SpinnerService.show()
          this.sgservice.edit_venmarkup_type(this.emp_type_editdataone)
        .subscribe(result => {
          this.SpinnerService.hide()
          if (result?.code && result?.description){
            this.toastr.error(result.description);
            return;
          }
          this.toastr.success(result?.message);
          this.closebutton.nativeElement.click();
          
        })
    }


    shoepremisname:any
    showbranchname:any
    typename:any
    datatoggleemp:boolean=true
    vendorname:any

    employeepatch1(data)
    {
      if(data.employee_count >= data.count)
      {
        this.notification.showError("Already max Employee Added ")
        return false
      }

    }
    
    async employeepatch(data,valueof)
    {
      
      // this.sgservice.getEmployeeListprimebranch(this.vendordetails.vendor.id,data.premise_id.id,data.branch_id.id)
      // .subscribe((result)=>
      // {
      //   let datas = result['data'];
      //   let emplist=[];
      //   emplist=datas
      //   console.log("employee list",emplist)
      //   let armempcount=0,unarmempcount=0;
      //   for(let i=0;i<emplist?.length;i++)
      //   {
      //     if(emplist[i]?.type?.id==1)
      //     {
      //       armempcount++
      //     }
      //     if(emplist[i]?.type?.id==2)
      //     {
      //       unarmempcount++
      //     }
      //   }

        this.shoepremisname="(" +data?.premise_id?.code+") "+data?.premise_id?.name 
        this.showbranchname="(" +data?.branch_id?.code+") "+data?.branch_id?.name 
        this.typename=valueof
        // this.vendorname=this.vendordetails?.vendor?.name
        this.vendorname="(" +this.vendordetails?.vendor?.code+") "+this.vendordetails?.vendor?.name
        if(valueof==='Armed')
        {
          // let count=this.checkarmEmployeecount(data.type,1)
          // // if(armempcount>=count)
          // // {
          // //   this.toastr.warning('', 'Maximum Armed Employee Added', { timeOut: 1000 });
          // //   return false
          // // }
          this.button.nativeElement.click();
          this.Employeeaddform.patchValue({
        
            premise_id:data?.premise_id?.id,
            branch_id:data?.branch_id?.id,
            type:1,
            vendor_id:this.vendordetails.vendor.id,
            ven_markmap_id:data?.id,
          })
        }
        if(valueof==='Unarmed'){

          // let count=this.checkunarmEmployeeshift(data.type,1)
          // if(unarmempcount>=count)
          // { 
          //   this.toastr.warning('', 'Maximum Unarmed Employee Added', { timeOut: 1000 });
          //   return false
          // }
          this.button.nativeElement.click();
          this.Employeeaddform.patchValue({
            ven_markmap_id:data?.id,
            premise_id:data?.premise_id?.id,
            branch_id:data?.branch_id?.id,
            type:2,
            vendor_id:this.vendordetails.vendor.id
          })
        }
        

        console.log("employee add form value",this.Employeeaddform.value)
        this.sgservice.getEmployeeListprimebranch(this.vendorid,data.premise_id.id,data.branch_id.id)
        .subscribe((result)=>
        {
          let datas = result['data'];
          let datapagination = result["pagination"];
          this.employeelist = datas;
          // this.activeEmployeeList = this.employeelist.filter(emp => emp.status === 1);
          console.log("Employee", this.employeelist.length)

        })
      // })
      
      

    }
    onBackClick(){
      // console.log("back")
      // this.router.navigateByUrl('SGmodule/sgmaster/4')
      this.onCancel.emit();
  
    }


    /// Employee summmary 
    employeelist:any=[]
    activeEmployeeList:any=[]

    getEmployeeList(pagenumber=1,pagesize=10){

      this.sgservice.getEmployeeList(pagenumber,pagesize,this.vendorid)
      .subscribe((result)=>
      {
       
        let datas = result['data'];
        let datapagination = result["pagination"];
        this.employeelist = datas;
        
        // if (this.premiselist.length >= 0) {
        //   this.has_nexttype = datapagination.has_next;
        //   this.has_previoustype = datapagination.has_previous;
        //   this.presentpagetype= datapagination.index;
        // }
  
      })
    }
    primisecount:any
    employeecount:any
    list=[]
    getEmployeeListprimebranch(data)
    {
      this.employeelist=[]
      this.list=[]
      this.sgservice.getEmployeeListprimebranch(this.vendordetails.vendor.id,data.premise_id.id,data.branch_id.id)
      .subscribe((result)=>
      {
        let datas = result['data'];
        let datapagination = result["pagination"];
        this.employeelist=datas
        console.log("datas",datas)
        this.employeelist.forEach(emp => emp.status = Number(emp.status));

        // Now sort
        this.employeelist.sort((a: any, b: any) => {
          if (a.status === b.status) {
            return 0;
          }
          return a.status === 1 ? -1 : 1;
        });
        console.log("Employee", this.employeelist)
      

        // if(this.employeelist.length >=this.primisecount)
        // {
        //   this.notification.showError("Already max value Added ")
        //   let el: HTMLElement = this.myButton.nativeElement as HTMLElement;
        //   setTimeout(()=> el.click(), 100);
        //   this.datatoggleemp=false
        // }

      })
      this.shoepremisname="(" +data?.premise_id?.code+") "+data?.premise_id?.name 
      this.showbranchname="(" +data?.branch_id?.code+") "+data?.branch_id?.name 
      
      this.vendorname="(" +this.vendordetails?.vendor?.code+") "+this.vendordetails?.vendor?.name

    }
  

  
FocusOutPremises(data) {
  console.log("premises-- focusout",data)
  this.isPremisesAddress = true;
  this.premisesname = "(" +data.code+") "+data.name
  this.updatelineName1 = data.address.line1;
  this.updatelineName2 = data.address.line2;
  this.updatelineName3 = data.address.line3;
  this.updatecityName = data.address.city.name;
  this.updatedistrictName = data.address.district.name;
  this.updatestateName = data.address.state.name;
  this.updatepinCode = data.address.pincode.no;
}



// add branch For mapping screen
  branchaddname()
  {
    let prokeyvalue: String = "";
      this.getAddBranch(prokeyvalue);
      this.premiseaddform.get('branch_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.sgservice.getbranchdropdown(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.addBranchList = datas;

        })


  }

  getAddBranch(prokeyvalue)
  {
    this.sgservice.getbranchdropdown(prokeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.addBranchList = datas;
      })
  }

  public displayBranchAdd(branchtype?: branchList): string | undefined {
    
    return branchtype ? "("+branchtype.code +") "+branchtype.name : undefined;
    
  }

   
  premiseMapBranch_Id=0;
  FocusPayingBranch(data) {
    console.log("appbranch",data)
    this.premiseMapBranch_Id = data.id;
    console.log("id", this.premiseMapBranch_Id)
    this.getAddPremises(data.id, '')
  }
  clearpremises() {
    this.clear_premises.nativeElement.value = '';
  }



  // addPremises For mapping screen
  addPremiseList:any
  premiseaddname()
  {
    let prokeyvalue: String = "";
      this.getAddPremises(this.premiseMapBranch_Id,prokeyvalue);
      this.premiseaddform.get('premise_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.sgservice.MappingBranchBasedPremises(this.premiseMapBranch_Id,value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.addPremiseList = datas;

        })

  }

  private getAddPremises(id,addPremisekeyvalue) {
    this.sgservice.MappingBranchBasedPremises(id,addPremisekeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.addPremiseList = datas;
      })
  }

  public displayPremiseAdd(addpri?: premiseList): string | undefined {
    return addpri ? "("+addpri.code +") "+addpri.name : undefined;
    
  }
 

 
  employeetypelist:any

  employeetypename(){
     
    let prokeyyvalue: String = "";
      this.getcatven(prokeyyvalue);
      this.typeeditform.get('type_id').valueChanges
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




//branch search filter
  branchSearch(){
    let prokeyvalue: String = "";
      this.getbranchSearch(prokeyvalue);
      this.premisearchform.get('branch_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.sgservice.getbranchdropdown(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.branchSearhList = datas;
        
        })
  }


  getbranchSearch(prokeyvalue)
  {
    this.sgservice.getbranchdropdown(prokeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchSearhList = datas;
      })
  }

  public displaybranchSearch(branchtype?: branchList): string | undefined {

    return branchtype ? "("+branchtype.code +" )"+branchtype.name : undefined;
    
  }


  filter_premiseMapBranch_Id=0;
  FocusBranchSearch(data) {
    console.log("appbranch",data)
    this.filter_premiseMapBranch_Id = data.id;
    console.log("id", this.filter_premiseMapBranch_Id)
    this.getPremiseSearch(data.id, '')
  }
  clearpremiseSearch() {
    this.clear_premisesSearch.nativeElement.value = '';
  }

//premise search filter
  premiseSearch(){
    let prokeyvalue: String = "";
      this.getPremiseSearch(this.filter_premiseMapBranch_Id,prokeyvalue);
      this.premisearchform.get('premise_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.sgservice.MappingBranchBasedPremises(this.filter_premiseMapBranch_Id,value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.premiseSearchlist = datas;
          console.log("product", datas)

        })


  }
  private getPremiseSearch(id,prokeyvalue)
  {
    this.sgservice.MappingBranchBasedPremises(id,prokeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.premiseSearchlist = datas;

      })
  }

  public displayPremiseSearch(producttype?: premiseList): string | undefined {
    return producttype ? "("+producttype.code +" )"+producttype.name : undefined;
    
  }


 

  // Branch  Search

  currentpagebra:any=1
  has_nextbra:boolean=true
  has_previousbra:boolean=true
  autocompletebranchsearchScroll() {
    
    setTimeout(() => {
      if (
        this.matAutocompletebrach &&
        this.autocompleteTrigger &&
        this.matAutocompletebrach.panel
      ) {
        fromEvent(this.matAutocompletebrach.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletebrach.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(()=> {
            const scrollTop = this.matAutocompletebrach.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletebrach.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletebrach.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbra === true) {
                this.sgservice.getbranchdropdown(this.branchContactInput.nativeElement.value, this.currentpagebra+ 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchSearhList = this.branchSearhList.concat(datas);
                    if (this.branchSearhList.length >= 0) {
                      this.has_nextbra = datapagination.has_next;
                      this.has_previousbra = datapagination.has_previous;
                      this.currentpagebra = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  // Premies Search
  currentpagepre:any=1
  has_nextpre:boolean=true
  has_previouspre:boolean=true
  autocompletePremiseSearchScroll() {
    
    setTimeout(() => {
      if (
        this.matAutocompletepremise&&
        this.autocompleteTrigger &&
        this.matAutocompletepremise.panel
      ) {
        fromEvent(this.matAutocompletepremise.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletepremise.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(()=> {
            const scrollTop = this.matAutocompletepremise.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletepremise.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletepremise.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextpre=== true) {
                this.sgservice.MappingBranchBasedPremises(this.filter_premiseMapBranch_Id,this.PremiseContactInput.nativeElement.value, this.currentpagepre + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.premiseSearchlist = this.premiseSearchlist.concat(datas);
                    if (this.premiseSearchlist.length >= 0) {
                      this.has_nextpre = datapagination.has_next;
                      this.has_previouspre = datapagination.has_previous;
                      this.currentpagepre = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }


 

  // add branch dropdown
  currentpageaddbra:any=1
  has_nextaddbra:boolean=true
  has_previousaddbra:boolean=true
  autocompleteaddbranchnameScroll() {
    
    setTimeout(() => {
      if (
        this.addmatAutocompletebranch &&
        this.autocompleteTrigger &&
        this.addmatAutocompletebranch.panel
      ) {
        fromEvent(this.addmatAutocompletebranch.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.addmatAutocompletebranch.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(()=> {
            const scrollTop = this.addmatAutocompletebranch.panel.nativeElement.scrollTop;
            const scrollHeight = this.addmatAutocompletebranch.panel.nativeElement.scrollHeight;
            const elementHeight = this.addmatAutocompletebranch.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextaddbra === true) {
                this.sgservice.getbranchdropdown(this.addbranchContactInput.nativeElement.value, this.currentpageaddbra + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.addBranchList= this.addBranchList.concat(datas);
                    if (this.addBranchList.length >= 0) {
                      this.has_nextaddbra = datapagination.has_next;
                      this.has_previousaddbra = datapagination.has_previous;
                      this.currentpageaddbra = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }


   // add premises dropdown
   currentpageaddpre:any=1
   has_nextaddpre:boolean=true
   has_previousaddpre:boolean=true
   autocompleteaddpremisenameScroll() {
     
     setTimeout(() => {
       if (
         this.addmatAutocompletepremise &&
         this.autocompleteTrigger &&
         this.addmatAutocompletepremise.panel
       ) {
         fromEvent(this.addmatAutocompletepremise.panel.nativeElement, 'scroll')
           .pipe(
             map(() => this.addmatAutocompletepremise.panel.nativeElement.scrollTop),
             takeUntil(this.autocompleteTrigger.panelClosingActions)
           )
           .subscribe(()=> {
             const scrollTop = this.addmatAutocompletepremise.panel.nativeElement.scrollTop;
             const scrollHeight = this.addmatAutocompletepremise.panel.nativeElement.scrollHeight;
             const elementHeight = this.addmatAutocompletepremise.panel.nativeElement.clientHeight;
             const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
             if (atBottom) {
               if (this.has_nextaddpre === true) {
                 this.sgservice.MappingBranchBasedPremises(this.premiseMapBranch_Id,this.addPremiseContactInput.nativeElement.value, this.currentpageaddpre + 1)
                   .subscribe((results: any[]) => {
                     let datas = results["data"];
                     let datapagination = results["pagination"];
                     this.addPremiseList = this.addPremiseList.concat(datas);
                     if (this.addPremiseList.length >= 0) {
                       this.has_nextaddpre = datapagination.has_next;
                       this.has_previousaddpre = datapagination.has_previous;
                       this.currentpageaddpre = datapagination.index;
                     }
                   })
               }
             }
           });
       }
     });
   }


  checkarmEmployeecount(arr,name)
  {
    
    for(let i=0;i<arr.length;i++)
    {
      if((arr[i]?.type?.id==1) && arr[i]?.status==1){
        if(name==1)
        {
          return arr[i]?.count
        }
        if(name==2)
        {
          if(arr[i]?.shift_type?.id==1)
          {
            return '8 Hours'
          }
          if(arr[i]?.shift_type?.id==2)
          {
            return '12 Hours'
          }
          if(arr[i]?.shift_type?.id==3)
          {
            return '10 Hours'
          }
        }
      }
    }

  }
  checkunarmEmployeeshift(arr,name)
  {
  
    for(let i=0;i<arr.length;i++)
    {
      if((arr[i]?.type?.id==2) && arr[i]?.status==1)
      {
        if(name==1)
        {
          return arr[i]?.count
        }
        if(name==2)
        {
          if(arr[i]?.shift_type?.id==1)
          {
            return '8 Hours'
          }
          if(arr[i]?.shift_type?.id==3){
            return '10 Hours'
          }
          if(arr[i]?.shift_type?.id==2){
            return '12 Hours'
          }
        }
      }
    }

    return "-"
  

  }

  keyPressNumbers(event) {
    console.log(event.which)
    var charCode = (event.which) ? event.which : event.keyCode;
    console.log(event.keycode)
    // Only Numbers 0-9
    if (event.keyCode==32)
    {
      return true;
    }
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      this.toastr.warning('', 'Please Enter the Number only', { timeOut: 1500 });
      return false;
    } else {
      return true;
    }
  }
  keyPressAlpha(event) {

    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z]/.test(inp) ||event.keyCode==32) {
      return true;
    } else {
      event.preventDefault();
      this.toastr.warning('', 'Please Enter the Letter only', { timeOut: 1500 });      
      return false;
      
    }
  }
  keyPressAlphanumeric(event)
  {
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9]/.test(inp)||event.keyCode==32  ) {
      return true;
    } else {
      event.preventDefault();
      this.toastr.warning('', 'Don\'t Use Extra character ', { timeOut: 1500 });      
      return false;
      
    }
  }
  onChange(event,data) {
    if (event.checked) {
      this.toggletype=1;
      console.log(1);
    } else {
      this.toggletype=-1;
      console.log(2);
    }
    this.UpdateDeavtivateStatus(data)
  }

  UpdateDeavtivateStatus(individualData){
    if(individualData.status.id===1){
      this.confirmation = confirm("Are you sure, Do you want to Deactivate? ")
     
    }else{
      this.confirmation = confirm("Are you sure, Do you want to Activate? ")
    }
   

    console.log("individual  data ", individualData)
    let ID = individualData.id 
    let vendordata = {
      "id": ID, "status": this.toggletype
    }
    if(this.confirmation ==false){
      this.getPM_summary(this.vendordetails,this.send_value,this.presentpagetype)
      return false
    }
    if(this.confirmation == true ){
      this.SpinnerService.show()
    this.sgservice.deactivateVendorMarkup(vendordata)
    .subscribe(results=>{
      this.SpinnerService.hide()
      if(results.code){
        this.notification.showError(results.description)
        this.getPM_summary(this.vendordetails,this.send_value,this.presentpagetype)
      }else{
        this.notification.showSuccess(results.message)   
        this.getPM_summary(this.vendordetails,this.send_value,this.presentpagetype) 
      }

    })
    
  }

    


  }
  deleteid:any
  delete1(id:any){
    this.SpinnerService.show()
    this.deleteid=id;
    this.SpinnerService.hide()
   

  }
  onedeletecancel(){
  this.deletebuttonempsummary.nativeElement.click();}

 
  deleteone(){
    this.SpinnerService.show()
    const monthdate1=this.deleteform.controls['monthdateone'].value.month()+1+"-"+this.deleteform.controls['monthdateone'].value.year()
    // let data={
    let id=this.deleteid
    let monthdate= monthdate1
  
  // }
    this.sgservice.sg_employee_delete(id,monthdate)
    .subscribe(result => {
      this.SpinnerService.hide()
      if (result.status === "success"){
        this.notification.showSuccess(result.message)

        this.deletebuttonempsummary.nativeElement.click();
        this.deleteform.controls['monthdateone'].reset();
        this.closebuttonempsummary.nativeElement.click();
        this.SpinnerService.hide()
        this.getPM_summary(this.vendordetails,this.send_value,this.presentpagetype)

      }
      else {
        this.notification.showError(result.code)
        this.SpinnerService.hide()
      }
      
      
    })

  }
  Edit_data(data){
    this.SpinnerService.show()
    this.typeeditform.reset();
    this.isemp_edited=false;  
    this.SpinnerService.hide()
    this.paying_branch='('+data?.branch_id?.code+') ' + data?.branch_id?.name
    this.premises='('+data?.premise_id?.code+') ' + data?.premise_id?.name;
    this.emp_type_editdata = [];
    for (let dta of data?.type){
      let dic = {};
      dic['type_id']={'id':dta?.type?.id,'emptype':dta?.type?.name}
      dic['count']=dta?.count
      dic['shift_type']=dta?.shift_type?.id
      dic['branch_id']=data?.branch_id?.id
      dic['premise_id']=data?.premise_id?.id
      dic['shift_count']=dta?.shift?.id
      dic['status']=dta?.status
      dic['id']=dta?.id
      dic['effective_from_month']=dta?.effective_from_month
      dic['effective_from_year']=dta?.effective_from_year
      dic['effective_to_month']=dta?.effective_to_month
      dic['effective_to_year']=dta?.effective_to_year
      dic['shift_name']=dta?.shift_details
      dic['shift_code']=dta?.shift_details?.shift_code
      dic['shift_time']=dta?.shift_details?.shift_time
      dic['risk_categorization'] = dta?.risk_categorization.id //here

      this.emp_type_editdata.push(dic)
    }

       this.typeeditform.patchValue({
         'risk_categorization': data?.type[0]?.risk_categorization?.id
      })
  }
  edited_data:any
  selectedIndex:any
  patch_editdata(data,index){

    const year = data?.effective_from_year;
    const month = data?.effective_from_month;
    const effectivedate = new Date(year, month - 1, 1); // Month is 0-indexed in JavaScript
    console.log('2nd edit data==>',data)
    this.typeeditform.patchValue({
      'type_id':{'id':data?.type_id?.id,'emptype':data?.type_id?.emptype},
      'id':data?.id,
      'count':data?.count,
      'shift_count':data?.shift_count,
      'shift_type':data?.shift_type,
      'branch_id':data?.branch_id,
      'premise_id':data?.premise_id,
      'shift_time':data?.shift_time,
      'shift_code':data?.shift_code,
      'shift_name':data?.shift_name,
      'risk_categorization'    : data?.risk_categorization, //here
      'monthdate': effectivedate
    });
    this.isemp_edited=true;
    this.edited_data=data?.id
     this.selectedIndex = index;
    // this.emp_type_editdata.splice(index);
  }
  isPopupOpen = false;
  selectedEffectiveMonth: string = '';

  openPopup(item: any) {
    this.selectedEffectiveMonth = item.effectiveMonth;
    this.isPopupOpen = true;
  }

  closePopup() {
    this.isPopupOpen = false;
    this.selectedEffectiveMonth = '';
  }

   createchosenYearHandlersecond(normalizedYear: Moment) {
    const ctrlValue = this.createmonthdatesecond.value;
    ctrlValue.year(normalizedYear.year());
    this.createmonthdatesecond.setValue(ctrlValue);
  }

  createchosenMonthHandlersecond(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.createmonthdatesecond.value;
    ctrlValue.month(normalizedMonth.month());
    this.createmonthdatesecond.setValue(ctrlValue);
    datepicker.close();
    this.typeaddform.patchValue({
      createmonthdatesecond: this.createmonthdatesecond.value
    })
  }
  RiskcatList:any
  Shiftname_List:any
  risk_type(){
    this.sgservice.get_risk_categorization().subscribe((results)=>{
      this.RiskcatList = results["data"]
    })
  }
shiftname(){     
    let name: String = "";
    let code : String = "";
      this.getshiftname(name,code);
      this.typeaddform.get('shift_name').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.sgservice.Shift_details(1,name,code)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.Shiftname_List = datas;
          console.log("product", datas)
        })
  }
  private getshiftname(name,code)
  {
    this.sgservice.Shift_details(1,name,code)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Shiftname_List = datas;

      })
  }
    public displayshiftname(shift_name?: ShiftnameListsss): string | undefined { 
      return shift_name ? shift_name.shift_name : undefined;    
  }
  selectedshiftname(val){
    console.log("value===",val)
    this.typeaddform.patchValue({
      shift_code:val?.shift_code,
      shift_time:val?.shift_time
    })
  }
    editselectedshiftname(val){
    console.log("value===",val)
    this.typeeditform.patchValue({
      shift_code:val?.shift_code,
      shift_time:val?.shift_time
    })
  }

//   compareFn(option: any, value: any): boolean {
//   return option && value ? option.id === value.id : option === value;
// }

}


class submitformate
{
  premise_id:any
  branch_id:any
  risk_categorization:any
  type:any[]=[]
}

class typeobj{
  type_id:any
  count:any
  shift:any
  shift_type:any
  month:any
  year:any
  shift_details:any
}